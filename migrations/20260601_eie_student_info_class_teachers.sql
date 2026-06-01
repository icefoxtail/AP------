-- EIE student info + multi-teacher classroom schema.
-- Apply before deploying the matching worker code.

ALTER TABLE eie_students ADD COLUMN school_name TEXT;
ALTER TABLE eie_students ADD COLUMN student_phone TEXT;
ALTER TABLE eie_students ADD COLUMN parent_phone TEXT;
ALTER TABLE eie_students ADD COLUMN guardian_relation TEXT;
ALTER TABLE eie_students ADD COLUMN student_address TEXT;
ALTER TABLE eie_students ADD COLUMN vehicle_info TEXT;
ALTER TABLE eie_students ADD COLUMN student_pin TEXT;
ALTER TABLE eie_students ADD COLUMN student_type TEXT DEFAULT '일반';

UPDATE eie_students
SET
  school_name = COALESCE(school_name, json_extract(raw_meta_json, '$.school_name'), json_extract(raw_meta_json, '$.school')),
  student_phone = COALESCE(student_phone, json_extract(raw_meta_json, '$.student_phone')),
  parent_phone = COALESCE(parent_phone, json_extract(raw_meta_json, '$.parent_phone')),
  guardian_relation = COALESCE(guardian_relation, json_extract(raw_meta_json, '$.guardian_relation')),
  student_address = COALESCE(student_address, json_extract(raw_meta_json, '$.student_address')),
  vehicle_info = COALESCE(vehicle_info, json_extract(raw_meta_json, '$.vehicle_info')),
  student_pin = COALESCE(student_pin, json_extract(raw_meta_json, '$.student_pin'), json_extract(raw_meta_json, '$.pin')),
  student_type = COALESCE(student_type, json_extract(raw_meta_json, '$.student_type'), '일반')
WHERE raw_meta_json IS NOT NULL
  AND json_valid(raw_meta_json);

UPDATE eie_students
SET student_type = '일반'
WHERE student_type IS NULL OR TRIM(student_type) = '';

UPDATE eie_students
SET student_phone = (
  SELECT c.phone
  FROM eie_student_contacts c
  WHERE c.student_id = eie_students.id
  ORDER BY COALESCE(c.is_primary, 1) DESC, c.created_at ASC
  LIMIT 1
)
WHERE (student_phone IS NULL OR TRIM(student_phone) = '')
  AND EXISTS (
    SELECT 1
    FROM eie_student_contacts c
    WHERE c.student_id = eie_students.id
  );

CREATE TABLE IF NOT EXISTS eie_student_teachers (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  teacher_name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  source_type TEXT DEFAULT 'manual',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, teacher_name)
);

CREATE INDEX IF NOT EXISTS idx_eie_student_teachers_student
  ON eie_student_teachers(student_id);

CREATE INDEX IF NOT EXISTS idx_eie_student_teachers_teacher
  ON eie_student_teachers(teacher_name);

INSERT OR IGNORE INTO eie_student_teachers (id, student_id, teacher_name, sort_order, source_type)
SELECT
  'eie_st_' || s.id || '_' || lower(hex(randomblob(4))),
  s.id,
  TRIM(j.value),
  CAST(j.key AS INTEGER),
  'raw_meta_backfill'
FROM eie_students s,
     json_each(CASE WHEN s.raw_meta_json IS NOT NULL AND json_valid(s.raw_meta_json) THEN s.raw_meta_json ELSE '{"teacher_names":[]}' END, '$.teacher_names') AS j
WHERE s.raw_meta_json IS NOT NULL
  AND json_valid(s.raw_meta_json)
  AND json_type(s.raw_meta_json, '$.teacher_names') = 'array'
  AND TRIM(j.value) != '';

CREATE TABLE IF NOT EXISTS eie_timetable_cell_teachers (
  id TEXT PRIMARY KEY,
  timetable_cell_id TEXT NOT NULL,
  teacher_name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  source_type TEXT DEFAULT 'manual',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(timetable_cell_id, teacher_name)
);

CREATE INDEX IF NOT EXISTS idx_eie_timetable_cell_teachers_cell
  ON eie_timetable_cell_teachers(timetable_cell_id);

CREATE INDEX IF NOT EXISTS idx_eie_timetable_cell_teachers_teacher
  ON eie_timetable_cell_teachers(teacher_name);

INSERT OR IGNORE INTO eie_timetable_cell_teachers (id, timetable_cell_id, teacher_name, sort_order, source_type)
SELECT
  'eie_ct_' || t.id || '_' || lower(hex(randomblob(4))),
  t.id,
  TRIM(j.value),
  CAST(j.key AS INTEGER),
  'raw_meta_backfill'
FROM eie_timetable_cells t,
     json_each(CASE WHEN t.raw_meta_json IS NOT NULL AND json_valid(t.raw_meta_json) THEN t.raw_meta_json ELSE '{"teacher_names":[]}' END, '$.teacher_names') AS j
WHERE t.raw_meta_json IS NOT NULL
  AND json_valid(t.raw_meta_json)
  AND json_type(t.raw_meta_json, '$.teacher_names') = 'array'
  AND TRIM(j.value) != '';

INSERT OR IGNORE INTO eie_timetable_cell_teachers (id, timetable_cell_id, teacher_name, sort_order, source_type)
SELECT
  'eie_ct_primary_' || id,
  id,
  TRIM(teacher_name_raw),
  0,
  'teacher_name_raw_backfill'
FROM eie_timetable_cells
WHERE teacher_name_raw IS NOT NULL
  AND TRIM(teacher_name_raw) != '';

CREATE INDEX IF NOT EXISTS idx_eie_students_school_grade
  ON eie_students(school_name, grade);

CREATE INDEX IF NOT EXISTS idx_eie_students_student_type
  ON eie_students(student_type);

CREATE INDEX IF NOT EXISTS idx_eie_students_student_pin
  ON eie_students(student_pin);
