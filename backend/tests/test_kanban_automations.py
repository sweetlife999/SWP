"""DB-backed integration tests for the kanban columns endpoint, card deadline
field, and the automations engine (issue #126). See test_integration_api.py
for the shared client fixture and skip-if-no-db convention.
"""

import os
import uuid

import pytest

pytestmark = pytest.mark.integration


@pytest.fixture(scope="module")
def client():
    from fastapi.testclient import TestClient

    from app.main import app

    try:
        with TestClient(app) as c:
            yield c
    except Exception as e:  # pragma: no cover - environment guard
        pytest.skip(f"database not available: {e}")


@pytest.fixture(scope="module")
def auth_headers(client):
    pw = os.environ["ADMIN_PASSWORD"]
    token = client.post("/api/admin/login", json={"password": pw}).json()["token"]
    return {"Authorization": f"Bearer {token}"}


def test_columns_endpoint_returns_seeded_board(client, auth_headers):
    r = client.get("/api/admin/kanban/columns", headers=auth_headers)
    assert r.status_code == 200
    cols = r.json()
    keys = [c["key"] for c in cols]
    assert keys == ["backlog", "next", "doing", "review", "done"]
    assert all("label" in c and "color" in c and "order_index" in c for c in cols)


def test_card_deadline_set_patch_and_clear(client, auth_headers):
    title = f"Deadline Card {uuid.uuid4().hex[:8]}"
    created = client.post(
        "/api/admin/kanban",
        headers=auth_headers,
        json={"title": title, "col": "backlog", "deadline": "2026-12-31"},
    ).json()
    card_id = created["id"]
    try:
        assert created["deadline"] == "2026-12-31"

        patched = client.patch(
            f"/api/admin/kanban/{card_id}", headers=auth_headers, json={"deadline": "2027-01-15"}
        ).json()
        assert patched["deadline"] == "2027-01-15"

        cleared = client.patch(
            f"/api/admin/kanban/{card_id}", headers=auth_headers, json={"deadline": None}
        ).json()
        assert cleared["deadline"] is None
    finally:
        client.delete(f"/api/admin/kanban/{card_id}", headers=auth_headers)


def test_automation_crud(client, auth_headers):
    created = client.post(
        "/api/admin/kanban/automations",
        headers=auth_headers,
        json={
            "name": f"Test automation {uuid.uuid4().hex[:8]}",
            "trigger_type": "task_created",
            "actions": [{"type": "change_column", "params": {"to": "next"}}],
        },
    ).json()
    automation_id = created["id"]
    try:
        assert created["is_active"] is True
        assert created["stats_runs"] == 0

        listed = client.get("/api/admin/kanban/automations", headers=auth_headers).json()
        assert any(a["id"] == automation_id for a in listed)

        patched = client.patch(
            f"/api/admin/kanban/automations/{automation_id}",
            headers=auth_headers,
            json={"is_active": False},
        ).json()
        assert patched["is_active"] is False
    finally:
        del_resp = client.delete(
            f"/api/admin/kanban/automations/{automation_id}", headers=auth_headers
        )
        assert del_resp.status_code == 204


def test_task_created_automation_fires_and_logs_history(client, auth_headers):
    automation = client.post(
        "/api/admin/kanban/automations",
        headers=auth_headers,
        json={
            "name": f"Move on create {uuid.uuid4().hex[:8]}",
            "trigger_type": "task_created",
            "actions": [{"type": "change_column", "params": {"to": "next"}}],
        },
    ).json()
    automation_id = automation["id"]
    card_id = None
    try:
        card = client.post(
            "/api/admin/kanban",
            headers=auth_headers,
            json={"title": f"Triggers automation {uuid.uuid4().hex[:8]}", "col": "backlog"},
        ).json()
        card_id = card["id"]

        history = client.get(
            f"/api/admin/kanban/automations/{automation_id}/history", headers=auth_headers
        ).json()
        assert len(history) == 1
        assert history[0]["status"] == "success"
        assert "moved to next" in history[0]["details"]["actions"]

        moved_card = next(
            c for c in client.get("/api/admin/kanban", headers=auth_headers).json()
            if c["id"] == card_id
        )
        assert moved_card["col"] == "next"

        refreshed = client.get("/api/admin/kanban/automations", headers=auth_headers).json()
        stats = next(a for a in refreshed if a["id"] == automation_id)
        assert stats["stats_runs"] == 1
    finally:
        if card_id:
            client.delete(f"/api/admin/kanban/{card_id}", headers=auth_headers)
        client.delete(f"/api/admin/kanban/automations/{automation_id}", headers=auth_headers)


def test_automation_with_multiple_actions_applies_all_of_them(client, auth_headers):
    """A single automation isn't limited to one action — issue #126 follow-up:
    the UI builds an arbitrary-length action list, not a fixed checkbox set."""
    member_name = f"Multi Action Assignee {uuid.uuid4().hex[:8]}"
    member = client.post(
        "/api/admin/members",
        headers=auth_headers,
        json={"dep": "core", "name": member_name, "role": "QA"},
    ).json()

    automation = client.post(
        "/api/admin/kanban/automations",
        headers=auth_headers,
        json={
            "name": f"Move and assign {uuid.uuid4().hex[:8]}",
            "trigger_type": "column_changed",
            "trigger_filters": {"to_column": "review"},
            "actions": [
                {"type": "assign_user", "params": {"name": member_name}},
                {"type": "change_column", "params": {"to": "done"}},
            ],
        },
    ).json()
    automation_id = automation["id"]
    card_id = None
    try:
        card = client.post(
            "/api/admin/kanban",
            headers=auth_headers,
            json={"title": f"Multi action card {uuid.uuid4().hex[:8]}", "col": "backlog"},
        ).json()
        card_id = card["id"]

        moved = client.patch(
            f"/api/admin/kanban/{card_id}", headers=auth_headers, json={"col": "review"}
        ).json()

        # Both actions from the one rule applied: assigned, then moved on to 'done'.
        assert any(a["initials"] for a in moved["assignees"])
        assert moved["col"] == "done"

        history = client.get(
            f"/api/admin/kanban/automations/{automation_id}/history", headers=auth_headers
        ).json()
        assert history[0]["status"] == "success"
        assert len(history[0]["details"]["actions"]) == 2
    finally:
        if card_id:
            client.delete(f"/api/admin/kanban/{card_id}", headers=auth_headers)
        client.delete(f"/api/admin/kanban/automations/{automation_id}", headers=auth_headers)
        client.delete(f"/api/admin/members/{member['id']}", headers=auth_headers)


def test_column_changed_automation_assigns_member(client, auth_headers):
    member_name = f"Automation Assignee {uuid.uuid4().hex[:8]}"
    member = client.post(
        "/api/admin/members",
        headers=auth_headers,
        json={"dep": "core", "name": member_name, "role": "QA"},
    ).json()

    automation = client.post(
        "/api/admin/kanban/automations",
        headers=auth_headers,
        json={
            "name": f"Assign on done {uuid.uuid4().hex[:8]}",
            "trigger_type": "column_changed",
            "trigger_filters": {"to_column": "review"},
            "actions": [{"type": "assign_user", "params": {"name": member_name}}],
        },
    ).json()
    automation_id = automation["id"]
    card_id = None
    try:
        card = client.post(
            "/api/admin/kanban",
            headers=auth_headers,
            json={"title": f"Card to move {uuid.uuid4().hex[:8]}", "col": "backlog"},
        ).json()
        card_id = card["id"]
        assert card["assignees"] == []

        # Moving to a column that doesn't match the filter must not fire the automation.
        client.patch(f"/api/admin/kanban/{card_id}", headers=auth_headers, json={"col": "next"})
        untouched = client.get("/api/admin/kanban", headers=auth_headers).json()
        assert next(c for c in untouched if c["id"] == card_id)["assignees"] == []

        moved = client.patch(
            f"/api/admin/kanban/{card_id}", headers=auth_headers, json={"col": "review"}
        ).json()
        assert any(a["initials"] for a in moved["assignees"])

        history = client.get(
            f"/api/admin/kanban/automations/{automation_id}/history", headers=auth_headers
        ).json()
        assert history[0]["status"] == "success"
    finally:
        if card_id:
            client.delete(f"/api/admin/kanban/{card_id}", headers=auth_headers)
        client.delete(f"/api/admin/kanban/automations/{automation_id}", headers=auth_headers)
        client.delete(f"/api/admin/members/{member['id']}", headers=auth_headers)
