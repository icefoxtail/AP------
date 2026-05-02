CREATE UNIQUE INDEX IF NOT EXISTS idx_students_student_pin ON students(student_pin) WHERE student_pin IS NOT NULL AND student_pin != '';
