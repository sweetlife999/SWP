-- idx_questions_survey (survey_id, position) WHERE deleted_at IS NULL fully
-- overlaps the implicit index from UNIQUE (survey_id, position) — the planner
-- can always use the unique index, so the partial one is pure write overhead.
DROP INDEX IF EXISTS idx_questions_survey;
