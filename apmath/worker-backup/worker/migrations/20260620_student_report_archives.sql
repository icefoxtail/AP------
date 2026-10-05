CREATE TABLE IF NOT EXISTS student_report_archives (
  id TEXT PRIMARY KEY,
  system_type TEXT NOT NULL DEFAULT 'apmath',
  student_id TEXT NOT NULL,
  report_type TEXT NOT NULL DEFAULT 'parent_report',
  title TEXT NOT NULL,
  range_start TEXT,
  range_end TEXT,
  period_label TEXT,
  payload_json TEXT NOT NULL DEFAULT '{}',
  final_message TEXT NOT NULL,
  consultation_id TEXT,
  created_by TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  consultation_saved_at DATETIME
);

CREATE INDEX IF NOT EXISTS idx_student_report_archives_student
  ON student_report_archives (system_type, student_id, updated_at DESC);
