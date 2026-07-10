"""Shared boilerplate for partial-update (PATCH) endpoints.

Each router's field-to-column mapping and null/default rules are genuinely
different per entity (custom error messages, conditional multi-column
writes) and stay in the router. Only the accumulate-params-and-raise-if-
empty scaffolding — duplicated identically in events.py, members.py, and
admin_questionnaires.py — lives here.
"""

from typing import Any

from fastapi import HTTPException, status


def require_fields_provided(provided: set[str]) -> None:
    if not provided:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="No fields to update"
        )


class SqlPatchBuilder:
    """Accumulates `col = $n` fragments and their bind params for an UPDATE."""

    def __init__(self) -> None:
        self.updates: list[str] = []
        self.params: list[Any] = []

    def add(self, col: str, val: Any) -> None:
        # col is always a hardcoded string literal, never user input.
        self.params.append(val)
        self.updates.append(f"{col} = ${len(self.params)}")

    def require_updates(self) -> None:
        if not self.updates:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="No valid fields to update",
            )
