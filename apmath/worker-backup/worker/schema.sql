CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  school_name TEXT,
  grade TEXT,
  status TEXT DEFAULT '재원',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS classes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  grade TEXT,
  subject TEXT,
  teacher_name TEXT
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

CREATE INDEX IF NOT EXISTS idx_consultations_student_id ON consultations(student_id);
CREATE INDEX IF NOT EXISTS idx_consultations_date ON consultations(date);

ALTER TABLE students ADD COLUMN memo TEXT;
ALTER TABLE students ADD COLUMN guardian_name TEXT;
ALTER TABLE students ADD COLUMN guardian_relation TEXT;