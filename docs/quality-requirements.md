# Quality Requirements

This document defines the team's measurable quality requirements (QRs) for the
Student Union Portal. Each QR uses the quality-scenario format (source, stimulus,
artifact, environment, response, response measure), is mapped to a single
[ISO/IEC 25010:2023](https://iso25000.com/index.php/en/iso-25000-standards/iso-25010)
sub-characteristic, has a stable ID, a rationale, and links to the automated
quality requirement test(s) that verify it.

These QRs are **maintained project assets**. Later work must keep them satisfied
or supersede them explicitly — it must not bypass or disable the verifying tests.

| ID | Quality characteristic | Sub-characteristic | Verified by |
|----|------------------------|--------------------|-------------|
| [QR-SEC](#qr-sec--admin-write-endpoints-are-authenticated) | Security | Authenticity | [QRT-SEC](quality-requirement-tests.md#qrt-sec) |
| [QR-REL](#qr-rel--invalid-input-is-rejected-not-stored-or-crashed-on) | Reliability | Fault tolerance | [QRT-REL](quality-requirement-tests.md#qrt-rel) |
| [QR-PERF](#qr-perf--public-event-listing-is-fast) | Performance Efficiency | Time behaviour | [QRT-PERF](quality-requirement-tests.md#qrt-perf) |

---

## QR-SEC — Admin write endpoints are authenticated

- **ISO/IEC 25010 characteristic:** Security
- **Sub-characteristic:** Authenticity
- **Artifact:** Backend admin API (`/api/admin/**`), JWT authentication (`app/auth.py`)

**Scenario**

| Element | Value |
|---|---|
| Source | Any client without a valid admin token (anonymous user or attacker) |
| Stimulus | An HTTP request to a state-changing admin endpoint (create / update / delete an event, member, kanban card, or questionnaire) |
| Environment | Normal operation, production deployment |
| Response | The request is rejected before any data is read or written; no admin action is performed |
| Response measure | **100%** of admin write requests that carry no token, a malformed token, an expired token, or a token forged with the `none` algorithm are rejected with HTTP **401**. The login endpoint blocks brute force: after **5** failed attempts from one IP the **6th** returns HTTP **429**. |

**Rationale.** The portal has a single privileged role (admin) able to publish
content visible to all students. An authentication bypass would let anyone deface
the public site or exfiltrate questionnaire responses. Authenticity (the request
genuinely comes from the admin) is the property that must hold for every write.

**Traceability.** Supports admin stories US-11 (publish events) and US-13
(manage questionnaires); guards every `/api/admin/**` route. Verified by
[QRT-SEC](quality-requirement-tests.md#qrt-sec).

---

## QR-REL — Invalid input is rejected, not stored or crashed on

- **ISO/IEC 25010 characteristic:** Reliability
- **Sub-characteristic:** Fault tolerance
- **Artifact:** Request validation models (`app/models/schemas.py`)

**Scenario**

| Element | Value |
|---|---|
| Source | Admin or student client submitting malformed, out-of-range, or oversized data (bad form input, a buggy client, or a hostile payload) |
| Stimulus | A request whose body violates a field constraint — unknown department tag, non-`HH:MM` time, or a questionnaire response with more than 200 answers |
| Environment | Normal operation |
| Response | The request is rejected with a validation error; the malformed value is never written to the database and the API process keeps serving other requests |
| Response measure | **100%** of requests violating a documented constraint are rejected with HTTP **422** (a structured validation error), and **0** of them mutate stored data or raise an unhandled `500`. |

**Rationale.** A regression earlier in the project let an edge-case survey blank
the whole page; another let event times silently fail to persist. Validating at
the trust boundary (Pydantic models) keeps a single bad request from corrupting
data or taking the API down for everyone — the essence of fault tolerance.

**Traceability.** Applies to all write endpoints; concentrated in
`EventCreate`, `MemberCreate`, and `SurveyResponseBody`. Verified by
[QRT-REL](quality-requirement-tests.md#qrt-rel).

---

## QR-PERF — Public event listing is fast

- **ISO/IEC 25010 characteristic:** Performance Efficiency
- **Sub-characteristic:** Time behaviour
- **Artifact:** `GET /api/events` (`app/routers/events.py`)

**Scenario**

| Element | Value |
|---|---|
| Source | A student opening the Events page |
| Stimulus | `GET /api/events` for the published-events list |
| Environment | Deployed stack with a warm connection pool, representative data volume |
| Response | The full published-events list is returned successfully |
| Response measure | Median server-side response time over 5 consecutive requests is **< 500 ms** (HTTP 200). |

**Rationale.** The Events list is the most-visited page and the first thing the
customer demos. A slow listing endpoint makes the whole portal feel broken. A
median latency budget keeps the primary read path honest as the data set grows.

**Traceability.** Supports US-01 (browse events). Verified by
[QRT-PERF](quality-requirement-tests.md#qrt-perf).
