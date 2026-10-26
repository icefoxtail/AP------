-- Teacher-confirmed repeat operations for recommended clinic follow-ups.
-- Additive only: no backfill, no destructive change, no implicit runtime DDL.
-- The Worker must return an honest FEATURE_UNAVAILABLE response until this
-- migration has been applied; it must never CREATE these tables per request.

CREATE TABLE IF NOT EXISTS clinic_repeat_policies (
  id TEXT PRIMARY KEY NOT NULL,
  class_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  source_assignment_id TEXT NOT NULL,
  -- Explicit attempt identity of the source. NULL until a submitted session is
  -- observed; never guessed from titles or UIDs.
  source_session_id TEXT,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'CLOSED')),
  revision INTEGER NOT NULL DEFAULT 1 CHECK (revision >= 1),
  settings_json TEXT NOT NULL,
  created_by_teacher_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  closed_at TEXT,
  closed_reason TEXT CHECK (
    closed_reason IS NULL OR closed_reason IN ('MANUAL_STOP', 'SOURCE_INELIGIBLE')
  ),
  closed_by_teacher_id TEXT,
  UNIQUE (class_id, student_id, source_assignment_id)
);

CREATE INDEX IF NOT EXISTS idx_clinic_repeat_policies_scope
ON clinic_repeat_policies (class_id, student_id, updated_at DESC, id DESC);

CREATE INDEX IF NOT EXISTS idx_clinic_repeat_policies_source
ON clinic_repeat_policies (source_assignment_id);

CREATE TABLE IF NOT EXISTS clinic_repeat_rounds (
  id TEXT PRIMARY KEY NOT NULL,
  policy_id TEXT NOT NULL,
  class_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  round_no INTEGER NOT NULL CHECK (round_no >= 1),
  policy_revision INTEGER NOT NULL CHECK (policy_revision >= 1),
  operation_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'RESERVED' CHECK (
    status IN ('RESERVED', 'UNRESOLVED', 'ISSUED', 'RELEASED')
  ),
  settings_snapshot_json TEXT NOT NULL,
  source_evidence_json TEXT NOT NULL,
  evidence_signature TEXT NOT NULL CHECK (
    length(evidence_signature) = 64 AND evidence_signature NOT GLOB '*[^0-9a-f]*'
  ),
  candidate_summary_json TEXT NOT NULL DEFAULT '{}',
  assignment_ids_json TEXT NOT NULL DEFAULT '[]',
  saved_paper_ids_json TEXT NOT NULL DEFAULT '[]',
  attempt_evidence_json TEXT NOT NULL DEFAULT '[]',
  confirmed_by_teacher_id TEXT NOT NULL,
  confirmed_at TEXT NOT NULL,
  reconciled_at TEXT,
  released_at TEXT,
  status_reason TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (policy_id, round_no),
  UNIQUE (operation_id),
  FOREIGN KEY (policy_id) REFERENCES clinic_repeat_policies(id) ON DELETE RESTRICT
);

-- At most one in-flight round per policy. This is the database-level guard that
-- prevents refresh/devices/concurrent tabs from reserving a duplicate round.
CREATE UNIQUE INDEX IF NOT EXISTS uq_clinic_repeat_rounds_open
ON clinic_repeat_rounds (policy_id)
WHERE status IN ('RESERVED', 'UNRESOLVED');

CREATE INDEX IF NOT EXISTS idx_clinic_repeat_rounds_policy
ON clinic_repeat_rounds (policy_id, round_no DESC);

CREATE INDEX IF NOT EXISTS idx_clinic_repeat_rounds_scope
ON clinic_repeat_rounds (class_id, student_id, created_at DESC);

-- Frozen round facts cannot be rewritten by later policy edits.
CREATE TRIGGER IF NOT EXISTS trg_clinic_repeat_rounds_frozen
BEFORE UPDATE ON clinic_repeat_rounds
WHEN NEW.id IS NOT OLD.id
  OR NEW.policy_id IS NOT OLD.policy_id
  OR NEW.class_id IS NOT OLD.class_id
  OR NEW.student_id IS NOT OLD.student_id
  OR NEW.round_no IS NOT OLD.round_no
  OR NEW.policy_revision IS NOT OLD.policy_revision
  OR NEW.operation_id IS NOT OLD.operation_id
  OR NEW.settings_snapshot_json IS NOT OLD.settings_snapshot_json
  OR NEW.source_evidence_json IS NOT OLD.source_evidence_json
  OR NEW.evidence_signature IS NOT OLD.evidence_signature
  OR NEW.candidate_summary_json IS NOT OLD.candidate_summary_json
  OR NEW.confirmed_by_teacher_id IS NOT OLD.confirmed_by_teacher_id
  OR NEW.confirmed_at IS NOT OLD.confirmed_at
  OR NEW.created_at IS NOT OLD.created_at
BEGIN
  SELECT RAISE(ABORT, 'CLINIC_REPEAT_ROUND_FROZEN');
END;

-- Operation history is retained even when the UI is hidden or rolled back.
CREATE TRIGGER IF NOT EXISTS trg_clinic_repeat_rounds_no_delete
BEFORE DELETE ON clinic_repeat_rounds
BEGIN
  SELECT RAISE(ABORT, 'CLINIC_REPEAT_ROUND_HISTORY_RETAINED');
END;

CREATE TRIGGER IF NOT EXISTS trg_clinic_repeat_policies_no_delete
BEFORE DELETE ON clinic_repeat_policies
BEGIN
  SELECT RAISE(ABORT, 'CLINIC_REPEAT_POLICY_HISTORY_RETAINED');
END;
