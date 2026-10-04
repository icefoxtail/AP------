CREATE TABLE IF NOT EXISTS study_materials (
  id TEXT PRIMARY KEY,
  material_type TEXT NOT NULL,
  title TEXT NOT NULL,
  grade TEXT,
  semester TEXT,
  subject TEXT DEFAULT '수학',
  numbering_type TEXT DEFAULT 'global',
  number_start INTEGER,
  number_end INTEGER,
  status TEXT DEFAULT 'active',
  created_by TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_study_materials_type
  ON study_materials(material_type);

CREATE INDEX IF NOT EXISTS idx_study_materials_grade_semester
  ON study_materials(grade, semester);

CREATE INDEX IF NOT EXISTS idx_study_materials_status
  ON study_materials(status);

CREATE TABLE IF NOT EXISTS material_unit_ranges (
  id TEXT PRIMARY KEY,
  material_id TEXT NOT NULL,
  unit_order INTEGER DEFAULT 0,
  unit_text TEXT NOT NULL,
  subunit_text TEXT,
  start_no INTEGER NOT NULL,
  end_no INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(material_id, start_no, end_no)
);

CREATE INDEX IF NOT EXISTS idx_material_unit_ranges_material
  ON material_unit_ranges(material_id);

CREATE INDEX IF NOT EXISTS idx_material_unit_ranges_range
  ON material_unit_ranges(material_id, start_no, end_no);

CREATE INDEX IF NOT EXISTS idx_material_unit_ranges_unit
  ON material_unit_ranges(material_id, unit_text);

CREATE TABLE IF NOT EXISTS material_question_tags (
  id TEXT PRIMARY KEY,
  material_id TEXT NOT NULL,
  question_no INTEGER NOT NULL,
  unit_text TEXT,
  type_text TEXT,
  tags TEXT,
  difficulty TEXT,
  page_no TEXT,
  memo TEXT,
  needs_review INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(material_id, question_no)
);

CREATE INDEX IF NOT EXISTS idx_material_question_tags_material_question
  ON material_question_tags(material_id, question_no);

CREATE INDEX IF NOT EXISTS idx_material_question_tags_unit
  ON material_question_tags(material_id, unit_text);

CREATE INDEX IF NOT EXISTS idx_material_question_tags_type
  ON material_question_tags(material_id, type_text);

CREATE TABLE IF NOT EXISTS class_material_assignments (
  id TEXT PRIMARY KEY,
  class_id TEXT NOT NULL,
  material_id TEXT NOT NULL,
  assignment_title TEXT,
  assigned_date TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  created_by TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_class_material_assignments_class
  ON class_material_assignments(class_id);

CREATE INDEX IF NOT EXISTS idx_class_material_assignments_material
  ON class_material_assignments(material_id);

CREATE INDEX IF NOT EXISTS idx_class_material_assignments_date
  ON class_material_assignments(assigned_date);

CREATE INDEX IF NOT EXISTS idx_class_material_assignments_status
  ON class_material_assignments(status);

CREATE TABLE IF NOT EXISTS student_material_submissions (
  id TEXT PRIMARY KEY,
  assignment_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  is_submitted INTEGER DEFAULT 0,
  is_no_wrong INTEGER DEFAULT 0,
  submitted_at TEXT,
  status TEXT DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(assignment_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_student_material_submissions_assignment
  ON student_material_submissions(assignment_id);

CREATE INDEX IF NOT EXISTS idx_student_material_submissions_student
  ON student_material_submissions(student_id);

CREATE INDEX IF NOT EXISTS idx_student_material_submissions_submitted
  ON student_material_submissions(is_submitted);

CREATE TABLE IF NOT EXISTS student_material_wrong_answers (
  id TEXT PRIMARY KEY,
  submission_id TEXT NOT NULL,
  assignment_id TEXT NOT NULL,
  material_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  class_id TEXT,
  teacher_id TEXT,
  grade TEXT,
  wrong_date TEXT NOT NULL,
  question_no INTEGER NOT NULL,
  status TEXT DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_student_material_wrong_answers_submission
  ON student_material_wrong_answers(submission_id);

CREATE INDEX IF NOT EXISTS idx_student_material_wrong_answers_assignment
  ON student_material_wrong_answers(assignment_id);

CREATE INDEX IF NOT EXISTS idx_student_material_wrong_answers_material_question
  ON student_material_wrong_answers(material_id, question_no);

CREATE INDEX IF NOT EXISTS idx_student_material_wrong_answers_student
  ON student_material_wrong_answers(student_id);

CREATE INDEX IF NOT EXISTS idx_student_material_wrong_answers_class
  ON student_material_wrong_answers(class_id);

CREATE INDEX IF NOT EXISTS idx_student_material_wrong_answers_teacher
  ON student_material_wrong_answers(teacher_id);

CREATE INDEX IF NOT EXISTS idx_student_material_wrong_answers_grade
  ON student_material_wrong_answers(grade);

CREATE INDEX IF NOT EXISTS idx_student_material_wrong_answers_date
  ON student_material_wrong_answers(wrong_date);
