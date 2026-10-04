-- Additive only. No legacy rows are deleted, aliased or re-approved.
CREATE TABLE IF NOT EXISTS class_exam_assignment_questions (
  assignment_id TEXT NOT NULL REFERENCES class_exam_assignments(id) ON DELETE CASCADE,
  order_no INTEGER NOT NULL CHECK (order_no > 0),
  question_uid TEXT,
  source_archive_file TEXT,
  source_question_no TEXT,
  source_question_ordinal INTEGER,
  source_fingerprint TEXT,
  standard_unit_key TEXT,
  difficulty_at_assignment TEXT,
  metadata_revision TEXT,
  metadata_json TEXT,
  resolution_status TEXT NOT NULL CHECK (resolution_status IN ('VERIFIED','LEGACY_INFERRED','UNRESOLVED')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (assignment_id, order_no),
  UNIQUE (assignment_id, question_uid),
  CHECK (resolution_status = 'UNRESOLVED' OR (question_uid IS NOT NULL AND source_archive_file IS NOT NULL AND source_question_ordinal > 0))
);
CREATE INDEX IF NOT EXISTS idx_assignment_questions_uid ON class_exam_assignment_questions(question_uid, assignment_id);

-- Only Archive 2.0 writes fill this retry key. Existing compatibility identities
-- and their duplicate-reconciliation evidence are preserved.
ALTER TABLE class_exam_assignments ADD COLUMN archive2_write_key TEXT;
ALTER TABLE class_exam_assignments ADD COLUMN archive2_snapshot_hash TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS uq_assignment_archive2_write_key ON class_exam_assignments(archive2_write_key) WHERE archive2_write_key IS NOT NULL;

-- All strict writes share the existing assignment, recipient, exclusion and PDF
-- authorities. The snapshot hash makes concurrent retry with different content
-- fail within D1 batch, before question/recipient rows can drift.
CREATE TRIGGER IF NOT EXISTS archive2_immutable_snapshot
BEFORE UPDATE OF archive2_snapshot_hash ON class_exam_assignments
WHEN OLD.archive2_snapshot_hash IS NOT NULL AND NEW.archive2_snapshot_hash IS NOT OLD.archive2_snapshot_hash
BEGIN SELECT RAISE(ABORT, 'ARCHIVE2_SNAPSHOT_CONFLICT'); END;
