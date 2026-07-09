"""DB-backed integration tests (run in CI with a Postgres service).

Covers cross-component behaviour and two quality-requirement tests:
  - QR-SEC: admin write endpoints reject unauthenticated requests (401).
  - QR-PERF: GET /events responds within the latency budget.

Skipped automatically if the database is unavailable (e.g. local unit-only run).
"""

import os
import time
import uuid

import pytest

pytestmark = pytest.mark.integration


@pytest.fixture(scope="module")
def client():
    from fastapi.testclient import TestClient

    from app.main import app

    try:
        with TestClient(app) as c:  # runs lifespan → opens the DB pool
            yield c
    except Exception as e:  # pragma: no cover - environment guard
        pytest.skip(f"database not available: {e}")


def test_events_list_ok(client):
    r = client.get("/api/events")
    assert r.status_code == 200
    assert isinstance(r.json(), list)


def test_admin_write_requires_auth(client):
    # QR-SEC: no token → 401, never an unauthenticated write.
    r = client.post(
        "/api/admin/events",
        json={"title": "x", "desc": "d", "date": "2026-09-01", "tag": "SU:Core"},
    )
    assert r.status_code == 401


def test_logout_revokes_session(client):
    pw = os.environ["ADMIN_PASSWORD"]
    token = client.post("/api/admin/login", json={"password": pw}).json()["token"]
    h = {"Authorization": f"Bearer {token}"}

    assert client.get("/api/admin/forms", headers=h).status_code == 200
    assert client.post("/api/admin/logout", headers=h).status_code == 204
    # Same token, now revoked — rejected even though it hasn't expired yet.
    assert client.get("/api/admin/forms", headers=h).status_code == 401


def test_get_events_latency(client):
    # QR-PERF: warm the path, then assert the median of a few calls is well under budget.
    client.get("/api/events")
    samples = []
    for _ in range(5):
        t0 = time.perf_counter()
        assert client.get("/api/events").status_code == 200
        samples.append(time.perf_counter() - t0)
    samples.sort()
    assert samples[len(samples) // 2] < 0.5  # 500 ms budget


def test_create_publish_appears_public(client):
    pw = os.environ["ADMIN_PASSWORD"]
    token = client.post("/api/admin/login", json={"password": pw}).json()["token"]
    h = {"Authorization": f"Bearer {token}"}

    # Unique title so the test is idempotent against a persistent dev DB.
    title = f"Integration Event {uuid.uuid4().hex[:8]}"
    created = client.post(
        "/api/admin/events",
        headers=h,
        json={"title": title, "desc": "d", "date": "2026-09-01", "tag": "SU:Core", "time": "10:00"},
    ).json()
    eid = created["id"]
    try:
        assert created["time"] == "10:00"

        # Draft is hidden from the public list…
        titles = [e["title"] for e in client.get("/api/events").json()]
        assert title not in titles

        # …until published.
        client.patch(f"/api/admin/events/{eid}", headers=h, json={"status": "published"})
        titles = [e["title"] for e in client.get("/api/events").json()]
        assert title in titles
    finally:
        # Clean up so repeated runs and the public list stay deterministic.
        client.delete(f"/api/admin/events/{eid}", headers=h)
