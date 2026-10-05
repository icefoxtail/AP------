ALTER TABLE students ADD COLUMN student_identity_key TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_students_identity_key
  ON students(student_identity_key)
  WHERE student_identity_key IS NOT NULL AND student_identity_key != '';
