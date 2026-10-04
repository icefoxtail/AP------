-- APMS 새학기 시간표 완전분리 foundation
-- 실제 운영 데이터와 새학기 개편안 데이터를 분리하기 위한 1차 기반 migration
-- destructive SQL 금지: DROP / DELETE / 운영 테이블 UPDATE 없음
-- 주의: ALTER TABLE ADD COLUMN은 D1/SQLite에서 컬럼이 이미 있으면 실패할 수 있다.
-- 운영 적용 전 반드시 대상 컬럼 존재 여부를 확인하고, 이번 migration 1개만 직접 적용한다.

CREATE TABLE IF NOT EXISTS timetable_version_classes (
  id TEXT PRIMARY KEY,
  academy_id TEXT NOT NULL DEFAULT 'apmath',
  version_id TEXT NOT NULL,
  source_class_id TEXT,
  name_snapshot TEXT,
  source_name TEXT,
  grade_snapshot TEXT,
  source_grade TEXT,
  next_grade TEXT,
  teacher_name_snapshot TEXT,
  subject_snapshot TEXT,
  schedule_days_snapshot TEXT,
  time_label_snapshot TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  excluded_reason TEXT,
  is_new INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  memo TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_timetable_version_classes_version
  ON timetable_version_classes(version_id);

CREATE INDEX IF NOT EXISTS idx_timetable_version_classes_academy_version
  ON timetable_version_classes(academy_id, version_id);

CREATE INDEX IF NOT EXISTS idx_timetable_version_classes_source
  ON timetable_version_classes(source_class_id);

CREATE INDEX IF NOT EXISTS idx_timetable_version_classes_status
  ON timetable_version_classes(status);

CREATE INDEX IF NOT EXISTS idx_timetable_version_classes_academy_version_status
  ON timetable_version_classes(academy_id, version_id, status);

CREATE INDEX IF NOT EXISTS idx_timetable_version_classes_version_source
  ON timetable_version_classes(version_id, source_class_id);

-- timetable_version_slots는 하위 호환을 위해 기존 class_id를 유지하고,
-- 이후 Step 2부터 version_class_id를 draft 렌더링 source of truth로 전환한다.
ALTER TABLE timetable_version_slots ADD COLUMN version_class_id TEXT;
ALTER TABLE timetable_version_slots ADD COLUMN source_class_id TEXT;

CREATE INDEX IF NOT EXISTS idx_timetable_version_slots_version_class
  ON timetable_version_slots(version_id, version_class_id);

CREATE INDEX IF NOT EXISTS idx_timetable_version_slots_source_class
  ON timetable_version_slots(source_class_id);

-- timetable_version_student_assignments는 하위 호환을 위해 기존 class_id/student_id를 유지한다.
-- 이후 Step 2부터 version_class_id를 draft 배치 source of truth로 전환한다.
ALTER TABLE timetable_version_student_assignments ADD COLUMN version_class_id TEXT;
ALTER TABLE timetable_version_student_assignments ADD COLUMN source_grade TEXT;
ALTER TABLE timetable_version_student_assignments ADD COLUMN next_grade TEXT;
ALTER TABLE timetable_version_student_assignments ADD COLUMN excluded_reason TEXT;
ALTER TABLE timetable_version_student_assignments ADD COLUMN temp_student_id TEXT;
ALTER TABLE timetable_version_student_assignments ADD COLUMN student_snapshot TEXT;

CREATE INDEX IF NOT EXISTS idx_timetable_version_student_assignments_version_class
  ON timetable_version_student_assignments(version_id, version_class_id);

CREATE INDEX IF NOT EXISTS idx_timetable_version_student_assignments_temp_student
  ON timetable_version_student_assignments(version_id, temp_student_id);

CREATE INDEX IF NOT EXISTS idx_timetable_version_student_assignments_source_grade
  ON timetable_version_student_assignments(version_id, source_grade, next_grade);

CREATE TABLE IF NOT EXISTS timetable_version_new_students (
  id TEXT PRIMARY KEY,
  academy_id TEXT NOT NULL DEFAULT 'apmath',
  version_id TEXT NOT NULL,
  version_class_id TEXT,
  temp_student_id TEXT,
  name_snapshot TEXT NOT NULL,
  school_name_snapshot TEXT,
  grade_snapshot TEXT,
  next_grade TEXT,
  phone_snapshot TEXT,
  memo TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_timetable_version_new_students_academy_version
  ON timetable_version_new_students(academy_id, version_id);

CREATE INDEX IF NOT EXISTS idx_timetable_version_new_students_version_class
  ON timetable_version_new_students(version_class_id);

CREATE INDEX IF NOT EXISTS idx_timetable_version_new_students_temp_student
  ON timetable_version_new_students(temp_student_id);

CREATE TABLE IF NOT EXISTS timetable_version_apply_logs (
  id TEXT PRIMARY KEY,
  academy_id TEXT NOT NULL DEFAULT 'apmath',
  version_id TEXT NOT NULL,
  status TEXT NOT NULL,
  started_at TEXT,
  finished_at TEXT,
  error_message TEXT,
  summary_json TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_timetable_version_apply_logs_academy_version
  ON timetable_version_apply_logs(academy_id, version_id);

CREATE INDEX IF NOT EXISTS idx_timetable_version_apply_logs_status
  ON timetable_version_apply_logs(status);

CREATE INDEX IF NOT EXISTS idx_timetable_version_apply_logs_created
  ON timetable_version_apply_logs(created_at);

-- 새학기 적용 후 새 운영 classes row가 기존 운영 class row를 추적하기 위한 후보 컬럼.
-- 실제 운영 적용 전 classes 테이블에 동일 컬럼이 이미 있는지 반드시 확인한다.
ALTER TABLE classes ADD COLUMN parent_class_id TEXT;
ALTER TABLE classes ADD COLUMN promotion_version_id TEXT;

CREATE INDEX IF NOT EXISTS idx_classes_parent_class_id
  ON classes(parent_class_id);

CREATE INDEX IF NOT EXISTS idx_classes_promotion_version_id
  ON classes(promotion_version_id);
