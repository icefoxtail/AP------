-- EIE teacher attendance ledger foundation
-- EIE-only attendance records. Do not write to APMS attendance/homework tables.

CREATE TABLE IF NOT EXISTS eie_attendance_records (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  timetable_cell_id TEXT,
  date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT '등원',
  memo TEXT,
  raw_meta_json TEXT,
  created_by TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, date)
);

CREATE INDEX IF NOT EXISTS idx_eie_attendance_student ON eie_attendance_records(student_id);
CREATE INDEX IF NOT EXISTS idx_eie_attendance_date ON eie_attendance_records(date);
CREATE INDEX IF NOT EXISTS idx_eie_attendance_cell ON eie_attendance_records(timetable_cell_id);
