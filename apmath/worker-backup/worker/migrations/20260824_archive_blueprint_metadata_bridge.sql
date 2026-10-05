-- Phase 2A: additive Archive metadata bridge columns.
--
-- Existing archive_file/question_no identity and legacy metadata columns remain
-- unchanged. type_key and difficulty already exist in the deployed baseline
-- schema, so this migration only adds the bridge columns that are absent there.
-- All new columns are nullable so old blueprints continue to load while
-- Phase 2B/2C starts populating and hashing the richer metadata.
ALTER TABLE exam_blueprints ADD COLUMN sub_unit_key TEXT;
ALTER TABLE exam_blueprints ADD COLUMN template_key TEXT;
ALTER TABLE exam_blueprints ADD COLUMN metadata_revision TEXT;
ALTER TABLE exam_blueprints ADD COLUMN metadata_hash TEXT;

CREATE INDEX IF NOT EXISTS idx_exam_blueprints_sub_unit
  ON exam_blueprints(sub_unit_key);
CREATE INDEX IF NOT EXISTS idx_exam_blueprints_metadata_hash
  ON exam_blueprints(metadata_hash);
