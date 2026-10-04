-- Phase 0E: additive canonical source identity for Archive and MIXED blueprints.
ALTER TABLE exam_blueprints ADD COLUMN source_question_uid TEXT;
ALTER TABLE exam_blueprints ADD COLUMN source_question_ordinal INTEGER;

CREATE INDEX IF NOT EXISTS idx_exam_blueprints_source_question_uid
  ON exam_blueprints(source_question_uid);
