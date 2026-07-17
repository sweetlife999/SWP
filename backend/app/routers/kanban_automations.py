"""Kanban automations: trigger -> actions rules for the SU:Core board (issue #126).

v1 scope covers the two triggers the app can actually fire (column_changed,
task_created) and the two actions with a real, working effect (change_column,
assign_user). The fuller trigger/condition/action model from the legacy
project (regex_match, numeric_compare, external webhook triggers,
send_notification/create_task/add_tag/enrich_task actions) is intentionally
out of scope until there's a real delivery channel and a concrete need
driving which of those to build next.
"""

import asyncpg
from fastapi import APIRouter, Depends, HTTPException, Request, status

from app.auth import require_admin
from app.database import get_pool
from app.kanban_shared import ASSIGNEE_COLORS, initials
from app.models.schemas import (
    AutomationAction,
    AutomationCreate,
    AutomationOut,
    AutomationPatch,
    AutomationRunOut,
)

router = APIRouter(
    prefix="/admin/kanban/automations",
    tags=["kanban-automations"],
    dependencies=[Depends(require_admin)],
)

_SELECT = """
    SELECT id, name, trigger_type, trigger_filters, actions, is_active, stats_runs
    FROM kanban_automations
"""


def _row_to_automation(row: asyncpg.Record) -> AutomationOut:
    return AutomationOut(
        id=row["id"],
        name=row["name"],
        trigger_type=row["trigger_type"],
        trigger_filters=row["trigger_filters"],
        actions=[AutomationAction(**a) for a in row["actions"]],
        is_active=row["is_active"],
        stats_runs=row["stats_runs"],
    )


async def _su_core_project_id(pool: asyncpg.Pool) -> int:
    """The board is a single SU:Core project (see kanban.py); resolve its id."""
    project_id = await pool.fetchval("SELECT id FROM kanban_projects WHERE slug = 'su-core'")
    if project_id is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No kanban board configured"
        )
    return project_id


@router.get("", response_model=list[AutomationOut])
async def list_automations(request: Request) -> list[AutomationOut]:
    pool: asyncpg.Pool = get_pool(request)
    rows = await pool.fetch(_SELECT + " ORDER BY id")
    return [_row_to_automation(r) for r in rows]


@router.post("", response_model=AutomationOut, status_code=status.HTTP_201_CREATED)
async def create_automation(body: AutomationCreate, request: Request) -> AutomationOut:
    pool: asyncpg.Pool = get_pool(request)
    project_id = await _su_core_project_id(pool)
    new_id = await pool.fetchval(
        """
        INSERT INTO kanban_automations
            (project_id, name, trigger_type, trigger_filters, actions, is_active)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
        """,
        project_id,
        body.name,
        body.trigger_type,
        body.trigger_filters,
        [a.model_dump() for a in body.actions],
        body.is_active,
    )
    row = await pool.fetchrow(_SELECT + " WHERE id = $1", new_id)
    return _row_to_automation(row)


@router.patch("/{automation_id}", response_model=AutomationOut)
async def patch_automation(
    automation_id: int, body: AutomationPatch, request: Request
) -> AutomationOut:
    pool: asyncpg.Pool = get_pool(request)
    exists = await pool.fetchval("SELECT 1 FROM kanban_automations WHERE id = $1", automation_id)
    if not exists:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Automation not found")

    provided = body.model_fields_set
    updates: list[str] = []
    params: list = []
    if "name" in provided and body.name is not None:
        params.append(body.name)
        updates.append(f"name = ${len(params)}")
    if "trigger_filters" in provided and body.trigger_filters is not None:
        params.append(body.trigger_filters)
        updates.append(f"trigger_filters = ${len(params)}")
    if "actions" in provided and body.actions is not None:
        params.append([a.model_dump() for a in body.actions])
        updates.append(f"actions = ${len(params)}")
    if "is_active" in provided and body.is_active is not None:
        params.append(body.is_active)
        updates.append(f"is_active = ${len(params)}")
    if not updates:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="No fields to update"
        )
    params.append(automation_id)
    await pool.execute(
        f"UPDATE kanban_automations SET {', '.join(updates)} WHERE id = ${len(params)}", *params
    )
    row = await pool.fetchrow(_SELECT + " WHERE id = $1", automation_id)
    return _row_to_automation(row)


@router.delete("/{automation_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_automation(automation_id: int, request: Request) -> None:
    pool: asyncpg.Pool = get_pool(request)
    result = await pool.execute("DELETE FROM kanban_automations WHERE id = $1", automation_id)
    if result == "DELETE 0":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Automation not found")


@router.get("/history", response_model=list[AutomationRunOut])
async def list_all_runs(request: Request) -> list[AutomationRunOut]:
    pool: asyncpg.Pool = get_pool(request)
    rows = await pool.fetch(
        """
        SELECT id, automation_id, card_id, status, details, ran_at
        FROM kanban_automation_runs
        ORDER BY ran_at DESC LIMIT 200
        """
    )
    return [AutomationRunOut(**dict(r)) for r in rows]


@router.get("/{automation_id}/history", response_model=list[AutomationRunOut])
async def list_runs(automation_id: int, request: Request) -> list[AutomationRunOut]:
    pool: asyncpg.Pool = get_pool(request)
    rows = await pool.fetch(
        """
        SELECT id, automation_id, card_id, status, details, ran_at
        FROM kanban_automation_runs WHERE automation_id = $1
        ORDER BY ran_at DESC LIMIT 100
        """,
        automation_id,
    )
    return [AutomationRunOut(**dict(r)) for r in rows]


# ── Execution engine ──────────────────────────────────────────────────────────
# Called by kanban.py's create_card (trigger_type="task_created") and
# move_card (trigger_type="column_changed") after their own write commits.


async def run_automations(
    pool: asyncpg.Pool,
    project_id: int,
    trigger_type: str,
    card_id: int,
    context: dict[str, str],
) -> None:
    """Fires active automations matching `trigger_type` against `card_id`.

    Never raises: automations are a best-effort side effect of a card write
    that has already succeeded, so a misconfigured action (e.g. an unknown
    target column) is recorded as a failed run in history instead of turning
    into a 500 on the card's own create/move request.
    """
    rows = await pool.fetch(
        _SELECT + " WHERE project_id = $1 AND trigger_type = $2 AND is_active",
        project_id,
        trigger_type,
    )
    for row in rows:
        filters = row["trigger_filters"] or {}
        to_column = filters.get("to_column")
        if to_column and to_column != context.get("to_column"):
            continue

        details: dict = {"actions": []}
        run_status = "success"
        try:
            for action in row["actions"]:
                await _apply_action(pool, card_id, action, details)
        except Exception as exc:  # noqa: BLE001 - recorded below, deliberately not re-raised
            run_status = "failure"
            details["error"] = str(exc)

        await pool.execute(
            """
            INSERT INTO kanban_automation_runs (automation_id, card_id, status, details)
            VALUES ($1, $2, $3, $4)
            """,
            row["id"],
            card_id,
            run_status,
            details,
        )
        await pool.execute(
            "UPDATE kanban_automations SET stats_runs = stats_runs + 1 WHERE id = $1", row["id"]
        )


async def _apply_action(pool: asyncpg.Pool, card_id: int, action: dict, details: dict) -> None:
    action_type = action.get("type")
    params = action.get("params") or {}

    if action_type == "change_column":
        target_key = params.get("to", "")
        col_row = await pool.fetchrow(
            """
            SELECT col.id FROM kanban_columns col
            JOIN kanban_cards c ON c.project_id = col.project_id
            WHERE c.id = $1 AND col.key = $2
            """,
            card_id,
            target_key,
        )
        if col_row is None:
            raise ValueError(f"unknown column '{target_key}'")
        await pool.execute(
            "UPDATE kanban_cards SET column_id = $1, updated_at = now() WHERE id = $2",
            col_row["id"],
            card_id,
        )
        details["actions"].append(f"moved to {target_key}")

    elif action_type == "assign_user":
        name = params.get("name", "").strip()
        if not name:
            raise ValueError("assign_user requires a 'name' param")
        card_initials = initials(name)
        already = await pool.fetchval(
            "SELECT 1 FROM kanban_card_assignees WHERE card_id = $1 AND initials = $2",
            card_id,
            card_initials,
        )
        if not already:
            count = await pool.fetchval(
                "SELECT COUNT(*) FROM kanban_card_assignees WHERE card_id = $1", card_id
            )
            await pool.execute(
                "INSERT INTO kanban_card_assignees (card_id, initials, bg) VALUES ($1, $2, $3)",
                card_id,
                card_initials,
                ASSIGNEE_COLORS[count % len(ASSIGNEE_COLORS)],
            )
        details["actions"].append(f"assigned {name}")

    else:
        raise ValueError(f"unsupported action type '{action_type}'")
