CREATE TABLE IF NOT EXISTS consultations (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  date TEXT,
  type TEXT,
  content TEXT NOT NULL,
  next_action TEXT,
  report_id TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS eie_grade_reports (
  report_id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  title TEXT NOT NULL,
  range_start TEXT,
  range_end TEXT,
  included_categories TEXT,
  memo_strength TEXT,
  memo_improve TEXT,
  memo_home TEXT,
  memo_goal TEXT,
  final_message TEXT NOT NULL,
  generated_snapshot TEXT,
  consultation_id TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_eie_grade_reports_student_updated
  ON eie_grade_reports(student_id, updated_at);
