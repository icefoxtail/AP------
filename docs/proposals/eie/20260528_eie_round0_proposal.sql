-- Proposal only. Do not apply to D1.
-- Round 1 naming cleanup: timetable cells use column_index.
-- Proposal location: docs/proposals/eie only; do not keep under executable migrations/.
-- Uniqueness hint: import_session_id + day_label + period_label + column_index.
-- Import-session duplicate guard: sheet_name + source_month.

CREATE TABLE IF NOT EXISTS eie_import_sessions (
  id TEXT PRIMARY KEY,
  file_name TEXT,
  sheet_name TEXT,
  source_month TEXT,
  imported_at TEXT,
  status TEXT DEFAULT 'imported',
  raw_meta_json TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(sheet_name, source_month)
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
  matched_teacher_tokens TEXT,
  teacher_match_count INTEGER,
  room_raw TEXT,
  column_index INTEGER,
  student_count INTEGER,
  status TEXT DEFAULT 'imported',
  source_row INTEGER,
  raw_meta_json TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(import_session_id, day_label, period_label, column_index)
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

CREATE TABLE IF NOT EXISTS eie_student_contact_seeds (
  id TEXT PRIMARY KEY,
  import_session_id TEXT,
  identity_seed_id TEXT,
  student_name_raw TEXT,
  phone_raw TEXT,
  normalized_phone TEXT,
  contact_type TEXT,
  memo_raw TEXT,
  match_status TEXT DEFAULT 'pending',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS eie_student_schedule_seeds (
  id TEXT PRIMARY KEY,
  import_session_id TEXT,
  cell_id TEXT,
  identity_seed_id TEXT,
  day_label TEXT,
  period_label TEXT,
  start_time TEXT,
  end_time TEXT,
  teacher_name_raw TEXT,
  class_name_raw TEXT,
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
