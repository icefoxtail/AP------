-- Additive, nullable capture for new Blueprint Meta snapshots. Existing rows
-- remain unchanged; assignment/result snapshots are frozen at their own write.
ALTER TABLE exam_blueprints ADD COLUMN metadata_json TEXT;
