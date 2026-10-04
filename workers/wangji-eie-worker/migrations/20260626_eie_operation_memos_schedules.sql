CREATE TABLE IF NOT EXISTS eie_operation_memos (
  id TEXT PRIMARY KEY,
  owner_user_id TEXT NOT NULL,
  owner_name TEXT,
  owner_role TEXT,
  memo_date TEXT NOT NULL,
  content TEXT NOT NULL,
  is_pinned INTEGER NOT NULL DEFAULT 0,
  is_done INTEGER NOT NULL DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_eie_operation_memos_owner_order
  ON eie_operation_memos(owner_user_id, is_done, is_pinned, memo_date, created_at);

CREATE TABLE IF NOT EXISTS eie_exam_schedules (
  id TEXT PRIMARY KEY,
  school_name TEXT,
  grade TEXT,
  exam_name TEXT NOT NULL,
  exam_date TEXT NOT NULL,
  memo TEXT,
  created_by TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_eie_exam_schedules_date
  ON eie_exam_schedules(exam_date);

CREATE TABLE IF NOT EXISTS eie_academy_schedules (
  id TEXT PRIMARY KEY,
  schedule_type TEXT NOT NULL,
  title TEXT NOT NULL,
  schedule_date TEXT NOT NULL,
  start_time TEXT,
  end_time TEXT,
  memo TEXT,
  series_id TEXT,
  series_kind TEXT DEFAULT 'single',
  series_until TEXT,
  is_closed INTEGER NOT NULL DEFAULT 0,
  is_deleted INTEGER NOT NULL DEFAULT 0,
  created_by TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_eie_academy_schedules_date
  ON eie_academy_schedules(is_deleted, schedule_date);

CREATE INDEX IF NOT EXISTS idx_eie_academy_schedules_series
  ON eie_academy_schedules(series_id, is_deleted);
