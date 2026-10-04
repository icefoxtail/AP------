-- APMS 새학기 시간표 개편안 학생 배치 staging
-- 운영 class_students/student_enrollments를 즉시 바꾸지 않고 timetable version 안에서 먼저 학생 배치를 보관한다.
CREATE TABLE IF NOT EXISTS timetable_version_student_assignments (
  id TEXT PRIMARY KEY,
  version_id TEXT NOT NULL,
  class_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  student_name_snapshot TEXT,
  source_class_id TEXT,
  memo TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(version_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_timetable_version_student_assignments_version
  ON timetable_version_student_assignments(version_id);

CREATE INDEX IF NOT EXISTS idx_timetable_version_student_assignments_class
  ON timetable_version_student_assignments(version_id, class_id);

CREATE INDEX IF NOT EXISTS idx_timetable_version_student_assignments_student
  ON timetable_version_student_assignments(student_id);
