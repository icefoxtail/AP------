CREATE TABLE IF NOT EXISTS exam_student_reports (
  archive_file TEXT NOT NULL,
  student_id TEXT NOT NULL,
  session_id TEXT,
  report_type TEXT NOT NULL DEFAULT 'counsel',
  fields_json TEXT,
  ai_json TEXT,
  updated_at TEXT DEFAULT (datetime('now')),
  updated_by TEXT,
  PRIMARY KEY (archive_file, student_id, report_type)
);

ALTER TABLE exam_question_reviews ADD COLUMN concept TEXT;
ALTER TABLE exam_question_reviews ADD COLUMN error_tag TEXT;
ALTER TABLE exam_question_reviews ADD COLUMN difficulty TEXT;
ALTER TABLE exam_question_reviews ADD COLUMN question_type TEXT;
