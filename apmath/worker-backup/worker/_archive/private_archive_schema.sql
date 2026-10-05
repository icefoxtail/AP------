-- JS아카이브 Private 기출 D1 입고용 추가 테이블
-- 기존 schema.sql 전체 재실행 금지. 이 파일만 D1에 1회 실행.

CREATE TABLE IF NOT EXISTS private_exams (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  school TEXT,
  year TEXT,
  semester TEXT,
  exam_type TEXT,
  grade TEXT,
  course TEXT,
  source_type TEXT DEFAULT 'original_exam',
  visibility TEXT DEFAULT 'private',
  public_allowed INTEGER DEFAULT 0,
  generation_allowed INTEGER DEFAULT 1,
  question_count INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS private_questions (
  id TEXT PRIMARY KEY,
  exam_id TEXT NOT NULL,
  question_no INTEGER NOT NULL,

  level TEXT,
  category TEXT,
  original_category TEXT,
  standard_course TEXT,
  standard_unit_key TEXT,
  standard_unit TEXT,
  standard_unit_order INTEGER,

  question_type TEXT,
  layout_tag TEXT DEFAULT 'grid',
  tags_json TEXT,
  wide INTEGER DEFAULT 0,

  content TEXT NOT NULL,
  choices_json TEXT,
  answer TEXT,
  solution TEXT,

  has_table INTEGER DEFAULT 0,
  has_graph INTEGER DEFAULT 0,
  has_geometry INTEGER DEFAULT 0,
  has_image INTEGER DEFAULT 0,
  image_path TEXT,

  source_visibility TEXT DEFAULT 'private',
  output_allowed INTEGER DEFAULT 0,
  generation_allowed INTEGER DEFAULT 1,

  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (exam_id) REFERENCES private_exams(id)
);

CREATE INDEX IF NOT EXISTS idx_private_questions_exam_id ON private_questions(exam_id);
CREATE INDEX IF NOT EXISTS idx_private_questions_unit_key ON private_questions(standard_unit_key);
CREATE INDEX IF NOT EXISTS idx_private_questions_level ON private_questions(level);
CREATE INDEX IF NOT EXISTS idx_private_questions_flags ON private_questions(has_table, has_graph, has_geometry, has_image);
CREATE INDEX IF NOT EXISTS idx_private_exams_school_grade ON private_exams(school, grade);
