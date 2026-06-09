-- EIE attendance: switch save granularity to (student_id, date, timetable_cell_id)
-- and add a `tags` column for auxiliary symbols (상담/보강).
--
-- Why: the EIE 원장 화면 is a teacher-by-teacher monthly timetable board. A student
-- can appear in several classes on the same date, so the previous
-- UNIQUE(student_id, date) constraint would overwrite one class with another.
-- This migration rebuilds the table with UNIQUE(student_id, date, timetable_cell_id)
-- and preserves every existing row. EIE-only — never touches APMS attendance/homework.

CREATE TABLE IF NOT EXISTS eie_attendance_records_new (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  timetable_cell_id TEXT,
  date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT '등원',
  tags TEXT,
  memo TEXT,
  raw_meta_json TEXT,
  created_by TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, date, timetable_cell_id)
);

INSERT OR IGNORE INTO eie_attendance_records_new
  (id, student_id, timetable_cell_id, date, status, tags, memo, raw_meta_json, created_by, created_at, updated_at)
SELECT
  id, student_id, timetable_cell_id, date, status, NULL AS tags, memo, raw_meta_json, created_by, created_at, updated_at
FROM eie_attendance_records;

DROP TABLE eie_attendance_records;
ALTER TABLE eie_attendance_records_new RENAME TO eie_attendance_records;

CREATE INDEX IF NOT EXISTS idx_eie_attendance_student ON eie_attendance_records(student_id);
CREATE INDEX IF NOT EXISTS idx_eie_attendance_date ON eie_attendance_records(date);
CREATE INDEX IF NOT EXISTS idx_eie_attendance_cell ON eie_attendance_records(timetable_cell_id);
