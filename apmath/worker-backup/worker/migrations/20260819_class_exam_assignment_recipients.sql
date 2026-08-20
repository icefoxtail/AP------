-- Freeze each class exam's audience at issue time.  Existing assignments are
-- seeded once from the roster available during this migration; new assignments
-- are populated transactionally by routes/exams.js.
CREATE TABLE IF NOT EXISTS class_exam_assignment_recipients (
  assignment_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (assignment_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_assignment_recipients_student
ON class_exam_assignment_recipients(student_id);

CREATE INDEX IF NOT EXISTS idx_assignment_recipients_assignment
ON class_exam_assignment_recipients(assignment_id);

INSERT OR IGNORE INTO class_exam_assignment_recipients (assignment_id, student_id)
SELECT cea.id, cs.student_id
FROM class_exam_assignments cea
JOIN class_students cs ON cs.class_id = cea.class_id;
