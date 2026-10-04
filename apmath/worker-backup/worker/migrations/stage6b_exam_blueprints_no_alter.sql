CREATE TABLE IF NOT EXISTS exam_blueprints (
  archive_file TEXT NOT NULL,
  question_no INTEGER NOT NULL,
  source_archive_file TEXT NOT NULL,
  source_question_no INTEGER NOT NULL,
  standard_unit_key TEXT,
  standard_unit TEXT,
  standard_course TEXT,
  concept_cluster_key TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (archive_file, question_no)
);

CREATE INDEX IF NOT EXISTS idx_exam_blueprints_archive_file ON exam_blueprints(archive_file);
CREATE INDEX IF NOT EXISTS idx_exam_blueprints_standard_unit_key ON exam_blueprints(standard_unit_key);
CREATE INDEX IF NOT EXISTS idx_exam_blueprints_concept_cluster_key ON exam_blueprints(concept_cluster_key);