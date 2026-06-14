CREATE TABLE IF NOT EXISTS eie_school_grade_records (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  class_id TEXT,
  teacher_id TEXT,
  school_name TEXT,
  grade_level TEXT,
  exam_year INTEGER NOT NULL,
  semester TEXT NOT NULL,
  exam_type TEXT NOT NULL,
  subject TEXT NOT NULL DEFAULT 'english',
  score REAL,
  max_score REAL,
  achievement TEXT,
  memo TEXT,
  status TEXT DEFAULT 'active',
  created_by TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_eie_school_grade_records_student_year
  ON eie_school_grade_records(student_id, exam_year);

CREATE INDEX IF NOT EXISTS idx_eie_school_grade_records_class_year
  ON eie_school_grade_records(class_id, exam_year);

CREATE INDEX IF NOT EXISTS idx_eie_school_grade_records_teacher_year
  ON eie_school_grade_records(teacher_id, exam_year);

CREATE INDEX IF NOT EXISTS idx_eie_school_grade_records_status
  ON eie_school_grade_records(status);

CREATE UNIQUE INDEX IF NOT EXISTS uq_eie_school_grade_record_slot
  ON eie_school_grade_records(student_id, exam_year, semester, exam_type, subject);
