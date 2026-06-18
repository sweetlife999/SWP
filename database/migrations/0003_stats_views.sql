-- ============================================================================
-- SU Portal — survey statistics helpers (optional)
--
-- Powers the admin "answer statistics" view. For the expected data volume
-- (hundreds–low thousands of responses per survey) the plain view below is
-- instant. If a single survey grows past ~100k responses, switch to the
-- materialised variant at the bottom and REFRESH it on a schedule.
-- ============================================================================

BEGIN;

-- ── single / scale questions: one row per (question, answer) with counts ────
-- Reads answers keyed by question id (answers ? question_id::text).
CREATE OR REPLACE VIEW survey_answer_stats AS
SELECT
  sq.survey_id,
  sq.id                                   AS question_id,
  sq.position,
  sq.type,
  sq.title,
  r.answers ->> sq.id::text               AS answer,
  COUNT(*)                                AS count,
  ROUND(
    COUNT(*) * 100.0
      / SUM(COUNT(*)) OVER (PARTITION BY sq.id),
    1
  )                                       AS pct
FROM survey_questions sq
JOIN survey_responses r
  ON r.survey_id = sq.survey_id
 AND r.answers ? sq.id::text          -- only responses that answered it
WHERE sq.type IN ('single', 'scale')
  AND sq.deleted_at IS NULL
GROUP BY sq.survey_id, sq.id, sq.position, sq.type, sq.title,
         r.answers ->> sq.id::text;

-- ── multi questions: explode the JSON array, then count per option ──────────
CREATE OR REPLACE VIEW survey_multi_stats AS
SELECT
  sq.survey_id,
  sq.id                AS question_id,
  sq.position,
  sq.title,
  elem.value           AS answer,
  COUNT(*)             AS count
FROM survey_questions sq
JOIN survey_responses r
  ON r.survey_id = sq.survey_id
CROSS JOIN LATERAL jsonb_array_elements_text(r.answers -> sq.id::text) AS elem(value)
WHERE sq.type = 'multi'
  AND sq.deleted_at IS NULL
GROUP BY sq.survey_id, sq.id, sq.position, sq.title, elem.value;

COMMIT;

-- ── Scale-up option (only if a survey gets very large) ──────────────────────
-- Replace survey_answer_stats with a materialised view and refresh on a
-- schedule (pg_cron) or after N new responses:
--
--   CREATE MATERIALIZED VIEW survey_answer_stats_mv AS
--     SELECT ... (same query as survey_answer_stats) ...;
--   CREATE UNIQUE INDEX ON survey_answer_stats_mv (question_id, answer);
--   REFRESH MATERIALIZED VIEW CONCURRENTLY survey_answer_stats_mv;
