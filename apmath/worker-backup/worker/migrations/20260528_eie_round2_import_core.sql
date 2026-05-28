-- EIE Round 2 import core migration.
-- Creates only import_session and timetable_cell staging tables.
-- Does not create students, contacts, classroom_sessions, or student_session_records.

CREATE TABLE IF NOT EXISTS eie_import_sessions (
  id TEXT PRIMARY KEY,
  file_name TEXT NOT NULL,
  sheet_name TEXT NOT NULL,
  source_month TEXT NOT NULL,
  imported_at TEXT,
  status TEXT NOT NULL DEFAULT 'imported',
  raw_meta_json TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(sheet_name, source_month)
);

CREATE TABLE IF NOT EXISTS eie_timetable_cells (
  id TEXT PRIMARY KEY,
  import_session_id TEXT NOT NULL,
  day_label TEXT,
  period_label TEXT NOT NULL,
  period_order INTEGER,
  start_time TEXT,
  end_time TEXT,
  class_name_raw TEXT,
  teacher_name_raw TEXT,
  room_raw TEXT,
  column_index INTEGER NOT NULL,
  student_count INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'imported',
  raw_meta_json TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (import_session_id) REFERENCES eie_import_sessions(id) ON DELETE CASCADE,
  UNIQUE(import_session_id, day_label, period_label, column_index)
);

CREATE INDEX IF NOT EXISTS idx_eie_timetable_cells_import_session
  ON eie_timetable_cells(import_session_id);

CREATE INDEX IF NOT EXISTS idx_eie_timetable_cells_status
  ON eie_timetable_cells(import_session_id, status);
