CREATE TABLE IF NOT EXISTS eie_grade_sheets (
  id TEXT PRIMARY KEY,
  teacher_id TEXT,
  class_id TEXT,
  month_key TEXT NOT NULL,
  sheet_type TEXT NOT NULL,
  title TEXT,
  columns_json TEXT,
  status TEXT DEFAULT 'active',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_eie_grade_sheets_class_month
  ON eie_grade_sheets(class_id, month_key, sheet_type);

CREATE INDEX IF NOT EXISTS idx_eie_grade_sheets_teacher_month
  ON eie_grade_sheets(teacher_id, month_key);

CREATE INDEX IF NOT EXISTS idx_eie_grade_sheets_status
  ON eie_grade_sheets(status);

CREATE UNIQUE INDEX IF NOT EXISTS uq_eie_grade_sheet_scope
  ON eie_grade_sheets(class_id, month_key, sheet_type);
