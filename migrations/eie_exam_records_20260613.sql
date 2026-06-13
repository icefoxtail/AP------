-- EIE exam/report records MVP.
-- EIE-only storage. Do not write to AP Math exam_sessions, wrong_answers,
-- school_exam_records, exam_blueprints, or OMR tables.

CREATE TABLE IF NOT EXISTS eie_exam_records (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  timetable_cell_id TEXT,
  exam_date TEXT NOT NULL,
  category TEXT NOT NULL,
  title TEXT,
  score REAL,
  max_score REAL,
  level TEXT,
  memo TEXT,
  payload_json TEXT,
  status TEXT DEFAULT 'active',
  created_by TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_eie_exam_records_student_date
  ON eie_exam_records(student_id, exam_date);

CREATE INDEX IF NOT EXISTS idx_eie_exam_records_cell_date
  ON eie_exam_records(timetable_cell_id, exam_date);

CREATE INDEX IF NOT EXISTS idx_eie_exam_records_category
  ON eie_exam_records(category);

CREATE INDEX IF NOT EXISTS idx_eie_exam_records_status
  ON eie_exam_records(status);
