import asyncpg
from fastapi import APIRouter, Depends, HTTPException, Request, status

from app.auth import require_admin
from app.computed import PRIORITY_LABEL
from app.database import get_pool
from app.models.schemas import (
    KanbanAssignee,
    KanbanAttachment,
    KanbanCardCreate,
    KanbanCardOut,
    KanbanCardPatch,
    KanbanMeta,
    KanbanTag,
)

router = APIRouter(prefix="/admin/kanban", tags=["kanban"], dependencies=[Depends(require_admin)])

_CARD_SELECT = """
    SELECT
        c.id,
        col.key AS col,
        c.blocker,
        c.title,
        c.description,
        c.priority,
        c.attachment,
        c.progress_pct,
        c.progress_label,
        COALESCE(
            (SELECT json_agg(jsonb_build_object('label', t.label, 'color', t.color))
             FROM kanban_card_tags t WHERE t.card_id = c.id),
            '[]'
        ) AS tags,
        COALESCE(
            (SELECT json_agg(
                jsonb_build_object(
                    'icon', m.icon, 'text', m.text, 'urgent', m.urgent, 'soon', m.soon
                )
                ORDER BY m.order_index
             )
             FROM kanban_card_meta m WHERE m.card_id = c.id),
            '[]'
        ) AS meta,
        COALESCE(
            (SELECT json_agg(jsonb_build_object('initials', a.initials, 'bg', a.bg))
             FROM kanban_card_assignees a WHERE a.card_id = c.id),
            '[]'
        ) AS assignees
    FROM kanban_cards c
    JOIN kanban_columns col ON col.id = c.column_id
"""


def _row_to_card(row: asyncpg.Record) -> KanbanCardOut:
    priority = row["priority"] or "p-low"
    att = row["attachment"]
    return KanbanCardOut(
        id=str(row["id"]),
        col=row["col"],
        blocker=row["blocker"] or None,
        tags=[KanbanTag(label=t["label"], cls=t["color"] or "") for t in row["tags"]],
        title=row["title"],
        desc=row["description"] or None,
        attachment=KanbanAttachment(
            icon=att.get("icon", ""), bold=att.get("bold", ""), rest=att.get("rest", "")
        )
        if att
        else None,
        progressPct=row["progress_pct"],
        progressLabel=row["progress_label"] or None,
        meta=[
            KanbanMeta(
                icon=m["icon"], text=m["text"], urgent=m["urgent"] or None, soon=m["soon"] or None
            )
            for m in row["meta"]
        ]
        or None,
        priority=priority,
        pLabel=PRIORITY_LABEL.get(priority, "P2"),
        assignees=[KanbanAssignee(initials=a["initials"], bg=a["bg"]) for a in row["assignees"]],
    )


@router.get("", response_model=list[KanbanCardOut])
async def list_cards(request: Request) -> list[KanbanCardOut]:
    pool: asyncpg.Pool = get_pool(request)
    rows = await pool.fetch(_CARD_SELECT + "ORDER BY col.order_index, c.order_index, c.id")
    return [_row_to_card(r) for r in rows]


@router.post("", response_model=KanbanCardOut, status_code=status.HTTP_201_CREATED)
async def create_card(body: KanbanCardCreate, request: Request) -> KanbanCardOut:
    """Creates a card in the requested column of the (single) SU:Core board."""
    pool: asyncpg.Pool = get_pool(request)
    col_row = await pool.fetchrow(
        "SELECT id, project_id FROM kanban_columns WHERE key = $1 ORDER BY project_id LIMIT 1",
        body.col,
    )
    if col_row is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No kanban board configured"
        )
    next_order = await pool.fetchval(
        "SELECT COALESCE(MAX(order_index), 0) + 1 FROM kanban_cards WHERE column_id = $1",
        col_row["id"],
    )
    new_id = await pool.fetchval(
        """
        INSERT INTO kanban_cards (project_id, column_id, title, description, priority, order_index)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
        """,
        col_row["project_id"],
        col_row["id"],
        body.title,
        body.desc,
        body.priority,
        next_order,
    )
    if body.assignee:
        # Deterministic green gradient so the avatar has a colour without a picker.
        await pool.execute(
            "INSERT INTO kanban_card_assignees (card_id, initials, bg) VALUES ($1, $2, $3)",
            new_id,
            body.assignee[:3].upper(),
            "linear-gradient(135deg,#a3e0ad,#32b247)",
        )
    row = await pool.fetchrow(_CARD_SELECT + "WHERE c.id = $1", new_id)
    return _row_to_card(row)


@router.delete("/{card_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_card(card_id: int, request: Request) -> None:
    """Deletes a card; tags/assignees/meta cascade."""
    pool: asyncpg.Pool = get_pool(request)
    result = await pool.execute("DELETE FROM kanban_cards WHERE id = $1", card_id)
    if result == "DELETE 0":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Card not found")


@router.patch("/{card_id}", response_model=KanbanCardOut)
async def move_card(card_id: int, body: KanbanCardPatch, request: Request) -> KanbanCardOut:
    """Moves a card to another column and/or edits its fields (title/desc/priority/assignee)."""
    pool: asyncpg.Pool = get_pool(request)
    provided = body.model_fields_set

    exists = await pool.fetchval("SELECT 1 FROM kanban_cards WHERE id = $1", card_id)
    if not exists:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Card not found")

    # Column move: resolve the target column within the card's own project.
    if body.col is not None:
        col_row = await pool.fetchrow(
            """
            SELECT col.id AS target_column_id, c.column_id AS current_column_id
            FROM kanban_columns col
            JOIN kanban_cards c ON c.project_id = col.project_id
            WHERE c.id = $1 AND col.key = $2
            """,
            card_id,
            body.col,
        )
        if col_row is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Column does not belong to the card's project",
            )
        if col_row["target_column_id"] != col_row["current_column_id"]:
            await pool.execute(
                "UPDATE kanban_cards SET column_id = $1, updated_at = now() WHERE id = $2",
                col_row["target_column_id"],
                card_id,
            )

    # Scalar field edits.
    updates: list[str] = []
    params: list = []
    if "title" in provided and body.title is not None:
        params.append(body.title)
        updates.append(f"title = ${len(params)}")
    if "desc" in provided:
        params.append(body.desc)
        updates.append(f"description = ${len(params)}")
    if "priority" in provided and body.priority is not None:
        params.append(body.priority)
        updates.append(f"priority = ${len(params)}")
    if "blocker" in provided and body.blocker is not None:
        params.append(body.blocker)
        updates.append(f"blocker = ${len(params)}")
    if updates:
        params.append(card_id)
        await pool.execute(
            f"UPDATE kanban_cards SET {', '.join(updates)}, updated_at = now() "
            f"WHERE id = ${len(params)}",
            *params,
        )

    # Assignee replacement.
    if "assignee" in provided:
        await pool.execute("DELETE FROM kanban_card_assignees WHERE card_id = $1", card_id)
        if body.assignee:
            await pool.execute(
                "INSERT INTO kanban_card_assignees (card_id, initials, bg) VALUES ($1, $2, $3)",
                card_id,
                body.assignee[:3].upper(),
                "linear-gradient(135deg,#a3e0ad,#32b247)",
            )

    row = await pool.fetchrow(_CARD_SELECT + "WHERE c.id = $1", card_id)
    return _row_to_card(row)
