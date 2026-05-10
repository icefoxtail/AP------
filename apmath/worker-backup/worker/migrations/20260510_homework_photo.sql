CREATE TABLE IF NOT EXISTS homework_photo_assignments (
  id TEXT PRIMARY KEY,
  class_id TEXT NOT NULL,
  teacher_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date TEXT NOT NULL,
  due_time TEXT,
  status TEXT DEFAULT 'active',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
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
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
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
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (submission_id) REFERENCES homework_photo_submissions(id)
);

CREATE INDEX IF NOT EXISTS idx_homework_photo_files_submission
  ON homework_photo_files(submission_id);
CREATE INDEX IF NOT EXISTS idx_homework_photo_files_expires
  ON homework_photo_files(expires_at);
CREATE INDEX IF NOT EXISTS idx_homework_photo_files_deleted
  ON homework_photo_files(deleted_at);
