-- Durable, teacher-owned Archive 2.0 paper snapshots. Deploy this migration
-- before the Worker and static UI that expose /archive-saved-papers.
CREATE TABLE IF NOT EXISTS archive_saved_papers (
  id TEXT PRIMARY KEY,
  owner_teacher_id TEXT NOT NULL,
  save_batch_id TEXT NOT NULL,
  part_index INTEGER NOT NULL CHECK (part_index >= 0),
  part_count INTEGER NOT NULL CHECK (part_count BETWEEN 1 AND 8),
  title TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 150),
  grade TEXT NOT NULL CHECK (length(grade) BETWEEN 1 AND 30),
  subject TEXT NOT NULL DEFAULT '',
  question_count INTEGER NOT NULL CHECK (question_count BETWEEN 1 AND 50),
  snapshot_json TEXT NOT NULL,
  snapshot_hash TEXT NOT NULL CHECK (length(snapshot_hash) = 64),
  save_request_hash TEXT NOT NULL CHECK (length(save_request_hash) = 64),
  source_index_version TEXT NOT NULL,
  schema_version TEXT NOT NULL CHECK (schema_version = 'archive-saved-paper-v1'),
  created_at TEXT NOT NULL,
  deleted_at TEXT,
  CHECK (part_index < part_count),
  UNIQUE (owner_teacher_id, save_batch_id, part_index)
);

CREATE INDEX IF NOT EXISTS idx_archive_saved_papers_owner_created
ON archive_saved_papers (owner_teacher_id, deleted_at, created_at DESC, id DESC);

CREATE INDEX IF NOT EXISTS idx_archive_saved_papers_batch
ON archive_saved_papers (owner_teacher_id, save_batch_id);

-- Snapshot and identity columns are immutable. Only a one-time soft-delete
-- transition is permitted; issued assignments keep their existing snapshots.
CREATE TRIGGER IF NOT EXISTS trg_archive_saved_papers_immutable_update
BEFORE UPDATE ON archive_saved_papers
WHEN NEW.id IS NOT OLD.id
  OR NEW.owner_teacher_id IS NOT OLD.owner_teacher_id
  OR NEW.save_batch_id IS NOT OLD.save_batch_id
  OR NEW.part_index IS NOT OLD.part_index
  OR NEW.part_count IS NOT OLD.part_count
  OR NEW.title IS NOT OLD.title
  OR NEW.grade IS NOT OLD.grade
  OR NEW.subject IS NOT OLD.subject
  OR NEW.question_count IS NOT OLD.question_count
  OR NEW.snapshot_json IS NOT OLD.snapshot_json
  OR NEW.snapshot_hash IS NOT OLD.snapshot_hash
  OR NEW.save_request_hash IS NOT OLD.save_request_hash
  OR NEW.source_index_version IS NOT OLD.source_index_version
  OR NEW.schema_version IS NOT OLD.schema_version
  OR NEW.created_at IS NOT OLD.created_at
  OR (NEW.deleted_at IS NOT OLD.deleted_at AND (OLD.deleted_at IS NOT NULL OR NEW.deleted_at IS NULL))
BEGIN
  SELECT RAISE(ABORT, 'ARCHIVE_SAVED_PAPER_IMMUTABLE');
END;

CREATE TRIGGER IF NOT EXISTS trg_archive_saved_papers_no_hard_delete
BEFORE DELETE ON archive_saved_papers
BEGIN
  SELECT RAISE(ABORT, 'ARCHIVE_SAVED_PAPER_SOFT_DELETE_ONLY');
END;

ALTER TABLE class_exam_assignments ADD COLUMN saved_paper_id TEXT;

CREATE INDEX IF NOT EXISTS idx_class_exam_assignments_saved_paper
ON class_exam_assignments (saved_paper_id)
WHERE saved_paper_id IS NOT NULL;
