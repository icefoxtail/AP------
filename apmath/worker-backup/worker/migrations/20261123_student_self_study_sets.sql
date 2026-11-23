-- Student self-study records ("오답 다시 풀기" / "유사 문항 풀어보기").
-- Additive only: no backfill, no destructive change, no implicit runtime DDL.
-- The Worker must answer FEATURE_UNAVAILABLE (and teacher reads an empty list)
-- until this migration has been applied; it must never CREATE this table per
-- request. Apply by hand, e.g.:
--   wrangler d1 execute ap-math-os --remote --file apmath/worker-backup/worker/migrations/20261123_student_self_study_sets.sql
-- items_json elements: { k, u, src, r: 'c'|'w'|'u'|null, why: 'calc'|'misread'|'concept'|'method'|'guess'|null, n, t }

CREATE TABLE IF NOT EXISTS student_self_study_sets (
  student_id TEXT NOT NULL,
  assignment_id TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('wrong', 'similar')),
  class_id TEXT,
  total INTEGER NOT NULL DEFAULT 0,
  correct INTEGER NOT NULL DEFAULT 0,
  wrong INTEGER NOT NULL DEFAULT 0,
  items_json TEXT NOT NULL DEFAULT '[]',
  started_at TEXT,
  updated_at TEXT,
  completed_at TEXT,
  PRIMARY KEY (student_id, assignment_id, kind)
);

CREATE INDEX IF NOT EXISTS idx_student_self_study_sets_assignment
ON student_self_study_sets (assignment_id, kind);

CREATE INDEX IF NOT EXISTS idx_student_self_study_sets_class_updated
ON student_self_study_sets (class_id, updated_at);
