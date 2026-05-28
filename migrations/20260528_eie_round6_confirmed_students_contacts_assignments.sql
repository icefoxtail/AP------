-- EIE Round 6: confirmed student/contact/schedule assignment foundation
-- Scope: EIE-only confirmed operations tables. Do not write to APMS students/parent_contacts/class_students/student_enrollments.

CREATE TABLE IF NOT EXISTS eie_students (
  id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  normalized_name TEXT NOT NULL,
  grade TEXT,
  status TEXT DEFAULT 'active',
  source_type TEXT DEFAULT 'candidate',
  source_import_session_id TEXT,
  source_cell_id TEXT,
  memo TEXT,
  raw_meta_json TEXT,
  created_by TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_eie_students_normalized_name ON eie_students(normalized_name);
CREATE INDEX IF NOT EXISTS idx_eie_students_status ON eie_students(status);
CREATE INDEX IF NOT EXISTS idx_eie_students_source_import ON eie_students(source_import_session_id);
CREATE INDEX IF NOT EXISTS idx_eie_students_source_cell ON eie_students(source_cell_id);

CREATE TABLE IF NOT EXISTS eie_student_contacts (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  phone TEXT NOT NULL,
  normalized_phone TEXT NOT NULL,
  contact_label TEXT,
  is_primary INTEGER DEFAULT 1,
  source_type TEXT DEFAULT 'candidate',
  source_import_session_id TEXT,
  source_cell_id TEXT,
  memo TEXT,
  raw_meta_json TEXT,
  created_by TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, normalized_phone)
);

CREATE INDEX IF NOT EXISTS idx_eie_student_contacts_student ON eie_student_contacts(student_id);
CREATE INDEX IF NOT EXISTS idx_eie_student_contacts_phone ON eie_student_contacts(normalized_phone);
CREATE INDEX IF NOT EXISTS idx_eie_student_contacts_source_import ON eie_student_contacts(source_import_session_id);
CREATE INDEX IF NOT EXISTS idx_eie_student_contacts_source_cell ON eie_student_contacts(source_cell_id);

CREATE TABLE IF NOT EXISTS eie_student_schedule_assignments (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  timetable_cell_id TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  source_type TEXT DEFAULT 'candidate',
  source_import_session_id TEXT,
  memo TEXT,
  raw_meta_json TEXT,
  created_by TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, timetable_cell_id)
);

CREATE INDEX IF NOT EXISTS idx_eie_student_schedule_assignments_student ON eie_student_schedule_assignments(student_id);
CREATE INDEX IF NOT EXISTS idx_eie_student_schedule_assignments_cell ON eie_student_schedule_assignments(timetable_cell_id);
CREATE INDEX IF NOT EXISTS idx_eie_student_schedule_assignments_status ON eie_student_schedule_assignments(status);
CREATE INDEX IF NOT EXISTS idx_eie_student_schedule_assignments_source_import ON eie_student_schedule_assignments(source_import_session_id);
