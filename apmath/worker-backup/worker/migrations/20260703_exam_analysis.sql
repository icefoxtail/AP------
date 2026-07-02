CREATE TABLE IF NOT EXISTS exam_question_reviews (
  archive_file TEXT NOT NULL,
  question_no TEXT NOT NULL,
  review_text TEXT,
  answer TEXT,
  updated_at TEXT DEFAULT (datetime('now')),
  updated_by TEXT,
  PRIMARY KEY (archive_file, question_no)
);

CREATE TABLE IF NOT EXISTS exam_analysis_meta (
  archive_file TEXT PRIMARY KEY,
  overview_text TEXT,
  updated_at TEXT DEFAULT (datetime('now')),
  updated_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_exam_question_reviews_archive
  ON exam_question_reviews(archive_file);
