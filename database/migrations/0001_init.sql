-- ============================================================================
-- SU Portal — initial schema
-- PostgreSQL 14+
--
-- This migration creates all core tables, enums, indexes and triggers.
-- It is idempotent-safe for a fresh database (run once on an empty DB).
--
-- Naming: snake_case columns. The REST API (see frontend/src/lib/api.ts)
-- exposes camelCase + several *derived* display fields (dd, mm, tag, tagCls,
-- past, ...). Those are NOT stored — the backend computes them on read.
-- See database/README.md for the full column<->API field mapping.
-- ============================================================================

BEGIN;

-- ── Extensions ──────────────────────────────────────────────────────────────
-- pgcrypto: gen_random_uuid(), digest() for hashing admin tokens server-side.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ── Enums ───────────────────────────────────────────────────────────────────
-- Department drives tag + tag colour everywhere; an enum stops silent typos
-- like 'Core' vs 'core'. Extend with ALTER TYPE ... ADD VALUE in a later
-- migration if new departments appear.
CREATE TYPE department    AS ENUM ('core', 'active', 'media');
CREATE TYPE event_status  AS ENUM ('draft', 'published', 'archived');
CREATE TYPE question_type AS ENUM ('single', 'multi', 'scale', 'text');
-- Note: kanban column membership and card priority are intentionally NOT enums.
-- Columns are a per-project table (kanban_columns) so a board can rename/reorder
-- them, and priority is a CHECK-constrained TEXT — per database-schema.md.

-- ── Shared trigger: keep updated_at fresh on UPDATE ─────────────────────────
CREATE OR REPLACE FUNCTION touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ── Events ──────────────────────────────────────────────────────────────────
-- API id is a number. dd/mm/tag/tagCls/past/status are derived on read:
--   past   := event_date < CURRENT_DATE
--   tag    := 'SU:' + initcap(department)
--   dd/mm  := formatted from event_date
CREATE TABLE events (
  id          INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title       TEXT        NOT NULL,
  description TEXT        NOT NULL DEFAULT '',   -- API: desc
  event_date  DATE        NOT NULL,
  event_time  TIME,                              -- nullable: all-day events
  department  department  NOT NULL,
  cover_class TEXT        NOT NULL DEFAULT '',   -- API: cover (CSS bg class)
  foot_text   TEXT        NOT NULL DEFAULT '',   -- API: foot
  foot_label  TEXT,                              -- API: footLabel
  featured    BOOLEAN     NOT NULL DEFAULT FALSE,
  status      event_status NOT NULL DEFAULT 'draft',
  status_text TEXT,                              -- API: statusText
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_events_date       ON events (event_date DESC);
CREATE INDEX idx_events_status     ON events (status, event_date DESC);
CREATE INDEX idx_events_department ON events (department);
CREATE INDEX idx_events_featured   ON events (event_date DESC) WHERE featured;

CREATE TRIGGER trg_events_touch
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- ── Members ─────────────────────────────────────────────────────────────────
-- API id is a string; identity int serialised as string by the backend.
-- tag is derived from department. recent[] is a display-only list of <=3.
CREATE TABLE members (
  id         INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name       TEXT        NOT NULL,
  department department  NOT NULL,             -- API: dep
  role       TEXT        NOT NULL,             -- "CO-LEAD · B21-AI"
  meta       TEXT        NOT NULL DEFAULT '',  -- "2 years in SU"
  bio        TEXT        NOT NULL DEFAULT '',
  photo_url  TEXT        NOT NULL DEFAULT '',
  recent     TEXT[]      NOT NULL DEFAULT '{}',
  sort_order SMALLINT    NOT NULL DEFAULT 0,   -- display order within dept
  active     BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_members_dept ON members (department, sort_order) WHERE active;

-- ── Surveys & questions ─────────────────────────────────────────────────────
-- API Survey.steps[] is assembled from survey_questions ordered by position.
-- time/left/timeEnding/tag/tagCls are derived (from est_minutes, closes_at,
-- department) on read.
CREATE TABLE surveys (
  id          INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  department  department  NOT NULL,
  title       TEXT        NOT NULL,
  description TEXT        NOT NULL DEFAULT '',  -- API: desc
  flow_title  TEXT        NOT NULL DEFAULT '',  -- API: flowTitle
  eyebrow     TEXT        NOT NULL DEFAULT '',
  est_minutes SMALLINT    NOT NULL DEFAULT 2 CHECK (est_minutes > 0),
  closes_at   TIMESTAMPTZ,                      -- NULL = no deadline
  published   BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_surveys_published ON surveys (created_at DESC) WHERE published;

CREATE TRIGGER trg_surveys_touch
  BEFORE UPDATE ON surveys
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- Soft-delete via deleted_at so historical responses keyed by question id
-- never become orphaned. Never hard-delete a question that has responses.
CREATE TABLE survey_questions (
  id         INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  survey_id  INT           NOT NULL REFERENCES surveys (id) ON DELETE CASCADE,
  position   SMALLINT      NOT NULL,
  type       question_type NOT NULL,
  title      TEXT          NOT NULL,
  hint       TEXT          NOT NULL DEFAULT '',
  options    TEXT[],                  -- single / multi
  scale_low  TEXT,                    -- API: low
  scale_high TEXT,                    -- API: high
  scale_mid  SMALLINT,                -- API: median
  deleted_at TIMESTAMPTZ,
  UNIQUE (survey_id, position)
);

CREATE INDEX idx_questions_survey ON survey_questions (survey_id, position)
  WHERE deleted_at IS NULL;

-- ── Survey responses (append-only log) ──────────────────────────────────────
-- Anonymous by design: NO user reference, NO IP tracking. answers is keyed by
-- QUESTION ID (stable across reordering), e.g. {"12":"Yes","13":["a","b"],"14":4}.
-- Duplicate-submission guarding is handled client-side (cookie / localStorage),
-- not in the DB — everyone in Innopolis is behind one IP, so an ip_hash would
-- be useless anyway. Never UPDATE/DELETE rows here.
CREATE TABLE survey_responses (
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  survey_id    INT         NOT NULL REFERENCES surveys (id),
  answers      JSONB       NOT NULL,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_responses_survey ON survey_responses (survey_id);
-- BRIN is ideal for an append-only, time-ordered table: tiny and fast.
CREATE INDEX idx_responses_time ON survey_responses USING BRIN (submitted_at);

-- ── Kanban (internal admin) ─────────────────────────────────────────────────
-- Normalised, multi-project board (one project is used at launch). Columns are
-- data, not an enum, so a project can rename/reorder/protect them. Per-card
-- tags, assignees and meta are first-class child tables (so the board can be
-- queried, e.g. "all cards for assignee X"); only `attachment` stays JSONB as
-- a single opaque blob. Mirrors database-schema.md.

CREATE TABLE kanban_projects (
  id         INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name       TEXT        NOT NULL,
  slug       TEXT        NOT NULL UNIQUE,
  color      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE kanban_columns (
  id           INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  project_id   INT      NOT NULL REFERENCES kanban_projects (id) ON DELETE CASCADE,
  key          TEXT     NOT NULL,        -- backlog | next | doing | review | done
  label        TEXT     NOT NULL,
  color        TEXT     NOT NULL,        -- CSS hex
  order_index  SMALLINT NOT NULL,
  is_protected BOOLEAN  NOT NULL DEFAULT FALSE,
  UNIQUE (project_id, key)
);

CREATE TABLE kanban_cards (
  id             INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  project_id     INT         NOT NULL REFERENCES kanban_projects (id) ON DELETE CASCADE,
  column_id      INT         NOT NULL REFERENCES kanban_columns (id),
  title          TEXT        NOT NULL,
  description    TEXT,                                      -- API: desc
  priority       TEXT        NOT NULL DEFAULT 'p-low'
                   CHECK (priority IN ('p-low', 'p-mid', 'p-high')),
  blocker        BOOLEAN     NOT NULL DEFAULT FALSE,
  progress_pct   SMALLINT    CHECK (progress_pct BETWEEN 0 AND 100),
  progress_label TEXT,
  attachment     JSONB,                                     -- {icon, bold, rest}
  deadline       DATE,
  order_index    SMALLINT    NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_kanban_cards_column  ON kanban_cards (column_id, order_index);
CREATE INDEX idx_kanban_cards_project ON kanban_cards (project_id);

CREATE TRIGGER trg_kanban_touch
  BEFORE UPDATE ON kanban_cards
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

CREATE TABLE kanban_card_tags (
  id      INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  card_id INT  NOT NULL REFERENCES kanban_cards (id) ON DELETE CASCADE,
  label   TEXT NOT NULL,
  color   TEXT
);
CREATE INDEX idx_kanban_tags_card ON kanban_card_tags (card_id);

CREATE TABLE kanban_card_assignees (
  id       INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  card_id  INT  NOT NULL REFERENCES kanban_cards (id) ON DELETE CASCADE,
  initials TEXT NOT NULL,
  bg       TEXT NOT NULL                  -- CSS gradient
);
CREATE INDEX idx_kanban_assignees_card ON kanban_card_assignees (card_id);

CREATE TABLE kanban_card_meta (
  id          INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  card_id     INT      NOT NULL REFERENCES kanban_cards (id) ON DELETE CASCADE,
  order_index SMALLINT NOT NULL,
  icon        TEXT     NOT NULL,
  text        TEXT     NOT NULL,
  urgent      BOOLEAN  NOT NULL DEFAULT FALSE,
  soon        BOOLEAN  NOT NULL DEFAULT FALSE
);
CREATE INDEX idx_kanban_meta_card ON kanban_card_meta (card_id, order_index);

-- ── Content blocks (editable rich HTML, keyed by slug) ──────────────────────
-- Accessed only by slug (/api/content/:slug); slug IS the primary key so
-- PUT becomes a clean upsert. Known slugs are seeded in 0002_content_seed.sql.
CREATE TABLE content_blocks (
  slug       TEXT        PRIMARY KEY,
  html       TEXT        NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by TEXT        NOT NULL DEFAULT 'admin'
);

CREATE TRIGGER trg_content_touch
  BEFORE UPDATE ON content_blocks
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- ── Admin sessions (single-admin, opaque token) ─────────────────────────────
-- Store only a HASH of the token (digest(token,'sha256')) — never the raw
-- token. expires_at is set by the application at login (e.g. now()+8h).
-- Purge expired rows via the scheduled DELETE (see README / pg_cron).
CREATE TABLE admin_sessions (
  token_hash BYTEA       PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_sessions_expiry ON admin_sessions (expires_at);

COMMIT;
