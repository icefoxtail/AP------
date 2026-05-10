CREATE TABLE IF NOT EXISTS teachers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  login_id TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'teacher',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  school_name TEXT,
  grade TEXT,
  target_score INTEGER DEFAULT NULL,
  status TEXT DEFAULT '재원',
  memo TEXT,
  guardian_name TEXT,
  guardian_relation TEXT,
  student_phone TEXT,
  parent_phone TEXT,
  student_pin TEXT UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS classes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  grade TEXT,
  subject TEXT,
  teacher_name TEXT,
  schedule_days TEXT,
  textbook TEXT,
  is_active INTEGER DEFAULT 1,
  day_group TEXT,
  time_label TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS teacher_classes (
  teacher_id TEXT NOT NULL,
  class_id TEXT NOT NULL,
  PRIMARY KEY (teacher_id, class_id)
);

CREATE TABLE IF NOT EXISTS class_students (
  class_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  PRIMARY KEY (class_id, student_id)
);

CREATE TABLE IF NOT EXISTS attendance (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  status TEXT NOT NULL,
  date DATE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS homework (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  status TEXT NOT NULL,
  date DATE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS exam_sessions (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  exam_title TEXT,
  score INTEGER,
  exam_date DATE,
  question_count INTEGER DEFAULT 0,
  class_id TEXT,
  archive_file TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS wrong_answers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  student_id TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  standard_unit TEXT,
  difficulty TEXT
);

CREATE TABLE IF NOT EXISTS consultations (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  date TEXT NOT NULL,
  type TEXT,
  content TEXT NOT NULL,
  next_action TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS operation_memos (
  id TEXT PRIMARY KEY,
  memo_date TEXT,
  content TEXT NOT NULL,
  is_pinned INTEGER DEFAULT 0,
  is_done INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS exam_schedules (
  id TEXT PRIMARY KEY,
  school_name TEXT,
  grade TEXT,
  exam_name TEXT,
  exam_date TEXT NOT NULL,
  memo TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS academy_schedules (
  id TEXT PRIMARY KEY,
  schedule_type TEXT NOT NULL,
  title TEXT NOT NULL,
  schedule_date TEXT NOT NULL,
  start_time TEXT,
  end_time TEXT,
  target_scope TEXT DEFAULT 'global',
  student_id TEXT,
  teacher_name TEXT,
  memo TEXT,
  is_closed INTEGER DEFAULT 0,
  is_deleted INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

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

CREATE TABLE IF NOT EXISTS exam_blueprints (
  archive_file TEXT NOT NULL,
  question_no INTEGER NOT NULL,
  source_archive_file TEXT,
  source_question_no INTEGER,
  standard_unit_key TEXT,
  standard_unit TEXT,
  standard_course TEXT,
  concept_cluster_key TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (archive_file, question_no)
);

CREATE TABLE IF NOT EXISTS class_exam_assignments (
  id TEXT PRIMARY KEY,
  class_id TEXT NOT NULL,
  exam_title TEXT NOT NULL,
  exam_date TEXT NOT NULL,
  question_count INTEGER DEFAULT 0,
  archive_file TEXT DEFAULT '',
  source_type TEXT DEFAULT 'archive',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(class_id, exam_title, exam_date, archive_file)
);

CREATE TABLE IF NOT EXISTS daily_journals (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  teacher_name TEXT,
  content TEXT,
  feedback TEXT,
  status TEXT DEFAULT '작성중',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS class_textbooks (
  id TEXT PRIMARY KEY,
  class_id TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  start_date TEXT,
  end_date TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS class_daily_records (
  id TEXT PRIMARY KEY,
  class_id TEXT NOT NULL,
  date TEXT NOT NULL,
  teacher_name TEXT,
  special_note TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS class_daily_progress (
  id TEXT PRIMARY KEY,
  record_id TEXT NOT NULL,
  class_id TEXT NOT NULL,
  textbook_id TEXT,
  textbook_title_snapshot TEXT,
  progress_text TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);
CREATE INDEX IF NOT EXISTS idx_students_pin ON students(student_pin);

CREATE INDEX IF NOT EXISTS idx_classes_active ON classes(is_active);
CREATE INDEX IF NOT EXISTS idx_classes_teacher ON classes(teacher_name);

CREATE INDEX IF NOT EXISTS idx_teacher_classes_teacher ON teacher_classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_classes_class ON teacher_classes(class_id);

CREATE INDEX IF NOT EXISTS idx_class_students_class ON class_students(class_id);
CREATE INDEX IF NOT EXISTS idx_class_students_student ON class_students(student_id);

CREATE INDEX IF NOT EXISTS idx_attendance_student_date ON attendance(student_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);

CREATE INDEX IF NOT EXISTS idx_homework_student_date ON homework(student_id, date);
CREATE INDEX IF NOT EXISTS idx_homework_date ON homework(date);

CREATE INDEX IF NOT EXISTS idx_exam_sessions_student ON exam_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_exam_sessions_class ON exam_sessions(class_id);
CREATE INDEX IF NOT EXISTS idx_exam_sessions_date ON exam_sessions(exam_date);
CREATE INDEX IF NOT EXISTS idx_exam_sessions_archive ON exam_sessions(archive_file);

CREATE INDEX IF NOT EXISTS idx_wrong_answers_session ON wrong_answers(session_id);
CREATE INDEX IF NOT EXISTS idx_wrong_answers_student ON wrong_answers(student_id);

CREATE INDEX IF NOT EXISTS idx_consultations_student_id ON consultations(student_id);
CREATE INDEX IF NOT EXISTS idx_consultations_date ON consultations(date);

CREATE INDEX IF NOT EXISTS idx_operation_memos_date ON operation_memos(memo_date);
CREATE INDEX IF NOT EXISTS idx_operation_memos_done ON operation_memos(is_done);

CREATE INDEX IF NOT EXISTS idx_exam_schedules_date ON exam_schedules(exam_date);

CREATE INDEX IF NOT EXISTS idx_academy_schedules_date ON academy_schedules(schedule_date);
CREATE INDEX IF NOT EXISTS idx_academy_schedules_student ON academy_schedules(student_id);
CREATE INDEX IF NOT EXISTS idx_academy_schedules_deleted ON academy_schedules(is_deleted);

CREATE INDEX IF NOT EXISTS idx_school_exam_records_student ON school_exam_records(student_id);
CREATE INDEX IF NOT EXISTS idx_school_exam_records_class ON school_exam_records(class_id);
CREATE INDEX IF NOT EXISTS idx_school_exam_records_year ON school_exam_records(exam_year);
CREATE INDEX IF NOT EXISTS idx_school_exam_records_deleted ON school_exam_records(is_deleted);

CREATE INDEX IF NOT EXISTS idx_exam_blueprints_archive ON exam_blueprints(archive_file);
CREATE INDEX IF NOT EXISTS idx_exam_blueprints_unit ON exam_blueprints(standard_unit_key);
CREATE INDEX IF NOT EXISTS idx_exam_blueprints_cluster ON exam_blueprints(concept_cluster_key);

CREATE INDEX IF NOT EXISTS idx_class_exam_assignments_class ON class_exam_assignments(class_id);
CREATE INDEX IF NOT EXISTS idx_class_exam_assignments_date ON class_exam_assignments(exam_date);

CREATE INDEX IF NOT EXISTS idx_daily_journals_date ON daily_journals(date);
CREATE INDEX IF NOT EXISTS idx_daily_journals_teacher ON daily_journals(teacher_name);

CREATE INDEX IF NOT EXISTS idx_class_textbooks_class ON class_textbooks(class_id);
CREATE INDEX IF NOT EXISTS idx_class_textbooks_status ON class_textbooks(status);

CREATE INDEX IF NOT EXISTS idx_class_daily_records_class_date ON class_daily_records(class_id, date);
CREATE INDEX IF NOT EXISTS idx_class_daily_progress_record ON class_daily_progress(record_id);
CREATE INDEX IF NOT EXISTS idx_class_daily_progress_class ON class_daily_progress(class_id);

CREATE TABLE IF NOT EXISTS homework_photo_assignments (
  id TEXT PRIMARY KEY,
  class_id TEXT NOT NULL,
  teacher_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date TEXT NOT NULL,
  due_time TEXT,
  status TEXT DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (class_id) REFERENCES classes(id),
  FOREIGN KEY (teacher_id) REFERENCES teachers(id)
);

CREATE INDEX IF NOT EXISTS idx_homework_photo_assignments_class_due
  ON homework_photo_assignments(class_id, due_date);
CREATE INDEX IF NOT EXISTS idx_homework_photo_assignments_teacher
  ON homework_photo_assignments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_homework_photo_assignments_status
  ON homework_photo_assignments(status);

CREATE TABLE IF NOT EXISTS homework_photo_submissions (
  id TEXT PRIMARY KEY,
  assignment_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  is_submitted INTEGER DEFAULT 0,
  submitted_at TEXT,
  synced_homework_date TEXT,
  synced_homework_status TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (assignment_id) REFERENCES homework_photo_assignments(id),
  FOREIGN KEY (student_id) REFERENCES students(id),
  UNIQUE(assignment_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_homework_photo_submissions_assignment
  ON homework_photo_submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_homework_photo_submissions_student
  ON homework_photo_submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_homework_photo_submissions_submitted
  ON homework_photo_submissions(is_submitted);

CREATE TABLE IF NOT EXISTS homework_photo_files (
  id TEXT PRIMARY KEY,
  submission_id TEXT NOT NULL,
  file_key TEXT NOT NULL,
  file_name TEXT,
  file_type TEXT,
  file_size INTEGER DEFAULT 0,
  expires_at TEXT NOT NULL,
  deleted_at TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (submission_id) REFERENCES homework_photo_submissions(id)
);

CREATE INDEX IF NOT EXISTS idx_homework_photo_files_submission
  ON homework_photo_files(submission_id);
CREATE INDEX IF NOT EXISTS idx_homework_photo_files_expires
  ON homework_photo_files(expires_at);
CREATE INDEX IF NOT EXISTS idx_homework_photo_files_deleted
  ON homework_photo_files(deleted_at);
