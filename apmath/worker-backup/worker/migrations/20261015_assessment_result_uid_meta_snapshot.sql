-- Additive identity/Meta snapshot bridge for new result rows. Legacy rows are
-- deliberately left NULL; no UID or historical Meta is inferred or backfilled.
ALTER TABLE class_exam_assignment_questions ADD COLUMN metadata_hash TEXT;

ALTER TABLE assessment_result_items ADD COLUMN source_question_uid TEXT;
ALTER TABLE assessment_result_items ADD COLUMN source_question_ordinal INTEGER;
ALTER TABLE assessment_result_items ADD COLUMN source_fingerprint TEXT;
ALTER TABLE assessment_result_items ADD COLUMN source_identity_status TEXT;
ALTER TABLE assessment_result_items ADD COLUMN metadata_revision TEXT;
ALTER TABLE assessment_result_items ADD COLUMN metadata_hash TEXT;
ALTER TABLE assessment_result_items ADD COLUMN metadata_json TEXT;
ALTER TABLE assessment_result_items ADD COLUMN metadata_snapshot_status TEXT;

CREATE INDEX IF NOT EXISTS idx_assessment_result_items_uid
  ON assessment_result_items(source_question_uid);
