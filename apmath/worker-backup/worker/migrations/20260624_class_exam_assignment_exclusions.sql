ALTER TABLE class_exam_assignments ADD COLUMN subject TEXT DEFAULT '';

CREATE TABLE IF NOT EXISTS class_exam_assignment_exclusions (
  assignment_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  reason TEXT DEFAULT 'subject_mismatch',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (assignment_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_assignment_exclusions_assignment
ON class_exam_assignment_exclusions(assignment_id);

CREATE INDEX IF NOT EXISTS idx_assignment_exclusions_student
ON class_exam_assignment_exclusions(student_id);
