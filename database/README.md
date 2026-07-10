# Database — SU Portal
## For TA: This README.md is not for grading!
PostgreSQL schema, migrations, and local dev database for the Student Union Portal.
This folder is the single source of truth for how SU Portal data is stored. The
frontend's API contract lives in [`frontend/src/lib/api.ts`](../frontend/src/lib/api.ts);
this schema backs it.

## Layout

```
database/
├── migrations/              # schema — apply in order, in every environment
│   ├── 0001_init.sql        # extensions, enums, tables, indexes, triggers
│   ├── 0002_content_seed.sql# structural seed: known content-block slugs
│   └── 0003_stats_views.sql # survey statistics views (optional but cheap)
├── Dockerfile               # Postgres 16 image bundling the migrations
└── README.md
```

The database is a service in the project-root [`compose.yml`](../compose.yml)
(`build: ./database`), so it runs alongside the frontend.

## Quick start (local)

From the **project root**:

```bash
docker compose up -d db         # builds the image, runs migrations on first start
docker compose logs -f db       # watch init
```

Connect: `postgres://su:su_dev_password@127.0.0.1:5432/su_portal`
(override `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` via the
environment or a root `.env`).

Reset from scratch (drops the volume and re-runs the migrations):

```bash
docker compose down -v && docker compose up -d db
```

## Applying to production

Apply the migrations, in order (the Docker image does this automatically on a
fresh volume; run them manually against a managed/remote Postgres):

```bash
for f in migrations/0001_init.sql migrations/0002_content_seed.sql migrations/0003_stats_views.sql; do
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "$f"
done
```

`0002` and `0003` are idempotent (`ON CONFLICT DO NOTHING`, `CREATE OR REPLACE VIEW`).
`0001` assumes a fresh database. Once you adopt a migration tool (Flyway, sqlx,
node-pg-migrate, …) keep this numeric prefix convention and never edit an
already-applied file — add a new one.

## Schema overview

| Table              | Purpose                          | Backs API                               |
|--------------------|----------------------------------|-----------------------------------------|
| `events`           | Events list + detail             | `GET/POST /events`, `GET /events/:id`   |
| `members`          | Team directory                   | `GET/POST /members`                     |
| `surveys`          | Questionnaire definitions        | `GET /surveys`                          |
| `survey_questions` | Steps of a survey                | (assembled into `Survey.steps[]`)       |
| `survey_responses` | Anonymous answers (append-only)  | `GET /admin/forms/:id/responses`        |
| `kanban_projects`  | Boards (one used at launch)      | `GET /admin/kanban`                     |
| `kanban_columns`   | Per-project columns (data, not enum) | `GET /admin/kanban`                  |
| `kanban_cards`     | Cards (FK to column)             | `GET /admin/kanban`, `PATCH .../:id`    |
| `kanban_card_tags` / `_assignees` / `_meta` | Per-card child rows | (nested into each card)         |
| `content_blocks`   | Editable rich-HTML snippets      | `GET/PUT /content/:slug`                |
| `admin_sessions`   | Single-admin opaque tokens       | `POST /admin/login`                     |

### Derived vs stored fields

The API returns several **display-only** fields the backend computes on read —
they are deliberately not stored, so they can never go stale:

- `Event.past` → `event_date < CURRENT_DATE`
- `Event.dd` / `Event.mm` → formatted from `event_date`
- `tag` / `tagCls` (events, members, surveys) → derived from `department`
- `Survey.time` → from `est_minutes`; `Survey.left` / `timeEnding` → from `closes_at`

## How survey answers are stored

`survey_responses.answers` is `JSONB`, keyed by **question id** (not position, so
reordering or soft-deleting a question never corrupts old data):

```json
{ "12": "Yes, in person", "13": 4, "14": ["Events", "Clubs"], "15": "free text" }
```

| Question type | Value shape                  |
|---------------|------------------------------|
| `single`      | `"string"`                   |
| `scale`       | integer                      |
| `multi`       | `["string", ...]`            |
| `text`        | `"string"`                   |

Responses are **append-only** — never `UPDATE`/`DELETE`. Questions are
**soft-deleted** (`deleted_at`) to keep historical answers interpretable.

### Statistics (admin panel)

`0003_stats_views.sql` provides ready-to-query views:

```sql
-- single / scale breakdown with percentages
SELECT * FROM survey_answer_stats WHERE survey_id = 1 ORDER BY question_id, count DESC;

-- multi-choice option counts
SELECT * FROM survey_multi_stats  WHERE survey_id = 1 ORDER BY question_id, count DESC;
```

Fast at the expected scale (hundreds–low thousands per survey). If one survey
ever exceeds ~100k responses, switch `survey_answer_stats` to a materialised
view and `REFRESH ... CONCURRENTLY` on a schedule — see the note at the bottom
of that migration.

### CSV export

Stream `COPY ... TO STDOUT` through the backend (constant memory, even for large
exports) behind `GET /api/admin/forms/:id/responses?format=csv`:

```sql
COPY (
  SELECT id, submitted_at,
         answers ->> '12' AS q_attended,
         answers ->> '13' AS q_rating,
         answers ->> '14' AS q_topics,
         answers ->> '15' AS q_comment
  FROM survey_responses
  WHERE survey_id = 1
  ORDER BY submitted_at
) TO STDOUT WITH (FORMAT CSV, HEADER);
```

Build the column list from `survey_questions.title` (use those as headers) and
join `multi` arrays with `" | "` so each response stays one flat row.

## Admin sessions & cleanup

Store only a **hash** of the token (`digest(token, 'sha256')`), never the raw
value; set `expires_at` at login (e.g. `now() + interval '8 hours'`). Purge
expired rows on a schedule — with `pg_cron`:

```sql
SELECT cron.schedule('purge-sessions', '*/15 * * * *',
  $$DELETE FROM admin_sessions WHERE expires_at < now()$$);
```

…or run the `DELETE` from the backend on each login.

## Conventions

- `TIMESTAMPTZ` everywhere (never naive `TIMESTAMP`).
- Enums for fixed closed sets (`department`, `question_type`). Kanban column
  membership and card priority are kept flexible (a column table + a
  CHECK-constrained TEXT) rather than enums.
- `GENERATED ALWAYS AS IDENTITY` for surrogate keys (not `SERIAL`).
- `JSONB` only for genuinely schemaless data (kanban card `attachment`,
  survey answers) — fixed-shape data stays in real columns. Kanban tags,
  assignees and meta are normalised child tables, not JSONB.
  Documented exception: `events.schedule` / `events.organizers` (0006) are
  fixed-shape but stored as JSONB — they are only ever read and written
  together with their parent event, never queried or updated per-item, so
  child tables would add joins for no benefit.
- `updated_at` maintained by the shared `touch_updated_at()` trigger.
