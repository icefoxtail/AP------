CREATE TABLE IF NOT EXISTS class_exam_assignments (
  id TEXT PRIMARY KEY,
  class_id TEXT NOT NULL,
  exam_title TEXT NOT NULL,
  exam_date TEXT NOT NULL,
  question_count INTEGER DEFAULT 0,
  archive_file TEXT DEFAULT '',
  source_type TEXT DEFAULT 'archive',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(class_id, exam_title, exam_date, archive_file)
);

CREATE INDEX IF NOT EXISTS idx_class_exam_assignments_class
ON class_exam_assignments(class_id);

CREATE INDEX IF NOT EXISTS idx_class_exam_assignments_date
ON class_exam_assignments(exam_date);