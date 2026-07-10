-- A single/multi question created without `options` (or scale without its
-- bounds) breaks the public survey step at read time — nothing enforced this
-- at the schema level, only optimistic application code.
--
-- NOT VALID: production already has rows that predate this rule (e.g.
-- single/multi questions saved without options while a survey was still a
-- draft). Adding the constraint without validating existing rows lets the
-- migration apply cleanly and still enforces the rule for every new/updated
-- row from now on; a follow-up migration can backfill the offending rows and
-- VALIDATE CONSTRAINT once they're identified and fixed.
ALTER TABLE survey_questions
  ADD CONSTRAINT question_options_required
  CHECK (
    type NOT IN ('single', 'multi')
    OR (options IS NOT NULL AND array_length(options, 1) > 0)
  ) NOT VALID;

ALTER TABLE survey_questions
  ADD CONSTRAINT question_scale_bounds_required
  CHECK (
    type != 'scale'
    OR (scale_low IS NOT NULL AND scale_high IS NOT NULL)
  ) NOT VALID;
