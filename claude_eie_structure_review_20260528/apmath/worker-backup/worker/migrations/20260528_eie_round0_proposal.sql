-- Proposal only. Do not apply to D1 in Round 0.

CREATE TABLE IF NOT EXISTS eie_import_sessions (
  id TEXT PRIMARY KEY,
  file_name TEXT,
  sheet_name TEXT,
  source_month TEXT,
  imported_at TEXT,
  status TEXT DEFAULT 'imported',
  raw_meta_json TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS eie_timetable_cells (
  id TEXT PRIMARY KEY,
  import_session_id TEXT,
  day_label TEXT,
  period_label TEXT,
  period_order INTEGER,
  start_time TEXT,
  end_time TEXT,
  class_name_raw TEXT,
  teacher_name_raw TEXT,
  room_raw TEXT,
  column_start INTEGER,
  column_end INTEGER,
  student_count INTEGER,
  status TEXT DEFAULT 'imported',
  raw_meta_json TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS eie_student_identity_seeds (
  id TEXT PRIMARY KEY,
  import_session_id TEXT,
  student_name_raw TEXT,
  normalized_name TEXT,
  grade_raw TEXT,
  phone_raw TEXT,
  normalized_phone TEXT,
  memo_raw TEXT,
  candidate_key TEXT,
  match_status TEXT DEFAULT 'pending',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS eie_student_schedule_seeds (
  id TEXT PRIMARY KEY,
  import_session_id TEXT,
  cell_id TEXT,
  identity_seed_id TEXT,
  source_row INTEGER,
  source_col INTEGER,
  student_name_raw TEXT,
  grade_raw TEXT,
  phone_raw TEXT,
  memo_raw TEXT,
  attendance_note_raw TEXT,
  status_raw TEXT,
  membership_status TEXT DEFAULT 'active_candidate',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
