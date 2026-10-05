-- Frozen cross-axis identity for new Saved Paper assignments. Existing rows are not backfilled.
-- No Assignment FK/cascade: legacy Assignment cleanup cannot erase saved context evidence.
CREATE TABLE IF NOT EXISTS archive2_assignment_context_snapshots (
  assignment_id TEXT PRIMARY KEY NOT NULL,
  saved_paper_id TEXT NOT NULL,
  saved_paper_snapshot_hash TEXT NOT NULL CHECK (
    length(saved_paper_snapshot_hash)=64 AND
    saved_paper_snapshot_hash NOT GLOB '*[^0-9a-fA-F]*'
  ),
  output_context_hash TEXT NOT NULL CHECK (
    length(output_context_hash)=64 AND output_context_hash NOT GLOB '*[^0-9a-fA-F]*'
  ),
  assignment_context_hash TEXT NOT NULL CHECK (
    length(assignment_context_hash)=64 AND assignment_context_hash NOT GLOB '*[^0-9a-fA-F]*'
  ),
  context_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_archive2_assignment_context_saved_paper
ON archive2_assignment_context_snapshots(saved_paper_id,created_at DESC,assignment_id);

CREATE TRIGGER IF NOT EXISTS trg_archive2_assignment_context_immutable_update
BEFORE UPDATE ON archive2_assignment_context_snapshots
BEGIN
  SELECT RAISE(ABORT, 'ARCHIVE2_ASSIGNMENT_CONTEXT_IMMUTABLE');
END;

CREATE TRIGGER IF NOT EXISTS trg_archive2_assignment_context_no_delete
BEFORE DELETE ON archive2_assignment_context_snapshots
BEGIN
  SELECT RAISE(ABORT, 'ARCHIVE2_ASSIGNMENT_CONTEXT_IMMUTABLE');
END;
