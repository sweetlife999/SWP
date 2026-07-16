-- Kanban automations (issue #126): configurable trigger -> actions rules for
-- the SU:Core board. v1 scope covers the two triggers the app can actually
-- fire (column_changed, task_created) and the three actions with a real
-- effect (change_column, assign_user, send_notification) — see
-- backend/app/routers/kanban_automations.py for the execution engine.

CREATE TABLE kanban_automations (
  id              INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  project_id      INT         NOT NULL REFERENCES kanban_projects (id) ON DELETE CASCADE,
  name            TEXT        NOT NULL,
  trigger_type    TEXT        NOT NULL CHECK (trigger_type IN ('column_changed', 'task_created')),
  trigger_filters JSONB       NOT NULL DEFAULT '{}',  -- e.g. {"to_column": "done"}
  actions         JSONB       NOT NULL DEFAULT '[]',  -- [{type, params}, ...]
  is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
  stats_runs      INT         NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_kanban_automations_project ON kanban_automations (project_id);

CREATE TRIGGER trg_kanban_automations_touch
  BEFORE UPDATE ON kanban_automations
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

CREATE TABLE kanban_automation_runs (
  id            INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  automation_id INT         NOT NULL REFERENCES kanban_automations (id) ON DELETE CASCADE,
  card_id       INT         REFERENCES kanban_cards (id) ON DELETE SET NULL,
  status        TEXT        NOT NULL CHECK (status IN ('success', 'failure')),
  details       JSONB       NOT NULL DEFAULT '{}',
  ran_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_kanban_automation_runs_automation ON kanban_automation_runs (automation_id, ran_at DESC);
