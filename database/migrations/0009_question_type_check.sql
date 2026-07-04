-- A single/multi question created without `options` (or scale without its
-- bounds) breaks the public survey step at read time — nothing enforced this
-- at the schema level, only optimistic application code.
ALTER TABLE survey_questions
  ADD CONSTRAINT question_options_required
  CHECK (
    type NOT IN ('single', 'multi')
    OR (options IS NOT NULL AND array_length(options, 1) > 0)
  );

ALTER TABLE survey_questions
  ADD CONSTRAINT question_scale_bounds_required
  CHECK (
    type != 'scale'
    OR (scale_low IS NOT NULL AND scale_high IS NOT NULL)
  );
