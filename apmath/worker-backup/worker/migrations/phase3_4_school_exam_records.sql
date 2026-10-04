CREATE TABLE IF NOT EXISTS school_exam_records (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  class_id TEXT,
  school_name TEXT,
  grade TEXT,
  exam_year INTEGER NOT NULL,
  semester TEXT,
  exam_type TEXT NOT NULL,
  subject TEXT NOT NULL,
  score INTEGER,
  target_score_snapshot INTEGER,
  memo TEXT,
  is_deleted INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
