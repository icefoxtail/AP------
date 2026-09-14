-- Restore only source schema indexes with no production equivalent.
--
-- Audit basis:
--   source: apmath/worker-backup/worker/schema.sql
--   production: ap-math-os.sqlite_schema
--   comparison: index name + normalized CREATE INDEX definition
--
-- Seven source names were intentionally excluded because production already
-- has an equivalent table/definition under a different index name:
--   idx_class_daily_progress_class      -> idx_class_daily_progress_class_id
--   idx_class_daily_progress_record     -> idx_class_daily_progress_record_id
--   idx_class_textbooks_class           -> idx_class_textbooks_class_id
--   idx_exam_blueprints_archive         -> idx_exam_blueprints_archive_file
--   idx_exam_blueprints_cluster         -> idx_exam_blueprints_concept_cluster_key
--   idx_exam_blueprints_unit            -> idx_exam_blueprints_standard_unit_key
--   idx_teacher_classes_teacher         -> idx_tcls_teacher
--
-- This migration is intentionally not applied to production in this task.

CREATE INDEX IF NOT EXISTS idx_academy_schedules_date
  ON academy_schedules(schedule_date);

CREATE INDEX IF NOT EXISTS idx_academy_schedules_deleted
  ON academy_schedules(is_deleted);

CREATE INDEX IF NOT EXISTS idx_academy_schedules_student
  ON academy_schedules(student_id);

CREATE INDEX IF NOT EXISTS idx_attendance_date
  ON attendance(date);

CREATE INDEX IF NOT EXISTS idx_attendance_student_date
  ON attendance(student_id, date);

CREATE INDEX IF NOT EXISTS idx_class_exam_assignments_source_identity
  ON class_exam_assignments(class_id, exam_date, archive_file);

CREATE INDEX IF NOT EXISTS idx_class_students_class
  ON class_students(class_id);

CREATE INDEX IF NOT EXISTS idx_class_students_student
  ON class_students(student_id);

CREATE INDEX IF NOT EXISTS idx_classes_active
  ON classes(is_active);

CREATE INDEX IF NOT EXISTS idx_classes_teacher
  ON classes(teacher_name);

CREATE INDEX IF NOT EXISTS idx_consultations_client_req
  ON consultations(client_request_id)
  WHERE client_request_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_exam_sessions_archive
  ON exam_sessions(archive_file);

CREATE INDEX IF NOT EXISTS idx_exam_sessions_class
  ON exam_sessions(class_id);

CREATE INDEX IF NOT EXISTS idx_exam_sessions_date
  ON exam_sessions(exam_date);

CREATE INDEX IF NOT EXISTS idx_exam_sessions_student
  ON exam_sessions(student_id);

CREATE INDEX IF NOT EXISTS idx_homework_date
  ON homework(date);

CREATE INDEX IF NOT EXISTS idx_homework_student_date
  ON homework(student_id, date);

CREATE INDEX IF NOT EXISTS idx_school_exam_records_class
  ON school_exam_records(class_id);

CREATE INDEX IF NOT EXISTS idx_school_exam_records_deleted
  ON school_exam_records(is_deleted);

CREATE INDEX IF NOT EXISTS idx_school_exam_records_student
  ON school_exam_records(student_id);

CREATE INDEX IF NOT EXISTS idx_school_exam_records_year
  ON school_exam_records(exam_year);

CREATE INDEX IF NOT EXISTS idx_students_pin
  ON students(student_pin);

CREATE INDEX IF NOT EXISTS idx_students_status
  ON students(status);

CREATE INDEX IF NOT EXISTS idx_teacher_classes_class
  ON teacher_classes(class_id);

CREATE INDEX IF NOT EXISTS idx_wrong_answers_session
  ON wrong_answers(session_id);

CREATE INDEX IF NOT EXISTS idx_wrong_answers_student
  ON wrong_answers(student_id);
