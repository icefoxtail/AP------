-- Additive persistence foundation for Archive 2.0 Paper Lifecycle Campaign 0.
-- Legacy Saved Paper rows resolve lazily from deleted_at; do not mass-backfill.
ALTER TABLE class_exam_assignments ADD COLUMN cancelled_at TEXT;

CREATE TABLE IF NOT EXISTS archive_saved_paper_library_metadata (
  saved_paper_id TEXT PRIMARY KEY NOT NULL,
  owner_teacher_id TEXT NOT NULL,
  display_name TEXT CHECK (display_name IS NULL OR length(display_name) BETWEEN 1 AND 150),
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','ARCHIVED','TRASHED')),
  note TEXT NOT NULL DEFAULT '',
  tags_json TEXT NOT NULL DEFAULT '[]',
  is_favorite INTEGER NOT NULL DEFAULT 0 CHECK (is_favorite IN (0,1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (saved_paper_id) REFERENCES archive_saved_papers(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_saved_paper_library_owner_status_updated
ON archive_saved_paper_library_metadata(owner_teacher_id,status,updated_at DESC,saved_paper_id);

CREATE TABLE IF NOT EXISTS archive_saved_paper_lineage (
  child_saved_paper_id TEXT PRIMARY KEY NOT NULL,
  parent_kind TEXT NOT NULL CHECK (parent_kind IN ('SAVED_PAPER','SHARED_PAPER','COMMON_PAPER')),
  parent_id TEXT NOT NULL,
  parent_revision TEXT,
  parent_snapshot_hash TEXT CHECK (
    parent_snapshot_hash IS NULL OR
    (length(parent_snapshot_hash)=64 AND parent_snapshot_hash NOT GLOB '*[^0-9a-fA-F]*')
  ),
  derivation_type TEXT NOT NULL CHECK (derivation_type IN ('COPY','REVISION','FORK')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (child_saved_paper_id) REFERENCES archive_saved_papers(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_saved_paper_lineage_parent
ON archive_saved_paper_lineage(parent_kind,parent_id,parent_revision);

CREATE TRIGGER IF NOT EXISTS trg_saved_paper_lineage_immutable_update
BEFORE UPDATE ON archive_saved_paper_lineage
BEGIN
  SELECT RAISE(ABORT, 'ARCHIVE_SAVED_PAPER_LINEAGE_IMMUTABLE');
END;

CREATE TRIGGER IF NOT EXISTS trg_saved_paper_lineage_no_delete
BEFORE DELETE ON archive_saved_paper_lineage
BEGIN
  SELECT RAISE(ABORT, 'ARCHIVE_SAVED_PAPER_LINEAGE_IMMUTABLE');
END;

CREATE TABLE IF NOT EXISTS class_exam_assignment_lifecycle_events (
  event_id TEXT PRIMARY KEY NOT NULL,
  assignment_id TEXT NOT NULL,
  related_assignment_id TEXT,
  saved_paper_id TEXT,
  student_id TEXT,
  actor_teacher_id TEXT NOT NULL,
  operation TEXT NOT NULL CHECK (
    operation IN ('ADD_RECIPIENTS','EXCLUDE','RESTORE','CANCEL','REPLACEMENT_ASSIGNMENT')
  ),
  operation_identity TEXT NOT NULL UNIQUE,
  occurred_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  metadata_json TEXT NOT NULL DEFAULT '{}'
);

-- No assignment FK/cascade: legacy assignment cleanup must not erase lifecycle history.
CREATE INDEX IF NOT EXISTS idx_archive_assignment_events_assignment_time
ON class_exam_assignment_lifecycle_events(assignment_id,occurred_at,event_id);

CREATE INDEX IF NOT EXISTS idx_archive_assignment_events_related
ON class_exam_assignment_lifecycle_events(related_assignment_id);

CREATE TRIGGER IF NOT EXISTS trg_archive_assignment_events_immutable_update
BEFORE UPDATE ON class_exam_assignment_lifecycle_events
BEGIN
  SELECT RAISE(ABORT, 'ARCHIVE_ASSIGNMENT_EVENT_IMMUTABLE');
END;

CREATE TRIGGER IF NOT EXISTS trg_archive_assignment_events_no_delete
BEFORE DELETE ON class_exam_assignment_lifecycle_events
BEGIN
  SELECT RAISE(ABORT, 'ARCHIVE_ASSIGNMENT_EVENT_IMMUTABLE');
END;
