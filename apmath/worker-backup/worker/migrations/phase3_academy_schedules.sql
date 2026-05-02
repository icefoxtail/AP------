CREATE TABLE IF NOT EXISTS academy_schedules (
  id TEXT PRIMARY KEY,
  schedule_type TEXT NOT NULL,
  title TEXT NOT NULL,
  schedule_date TEXT NOT NULL,
  start_time TEXT,
  end_time TEXT,
  target_scope TEXT DEFAULT 'global',
  student_id TEXT,
  teacher_name TEXT,
  memo TEXT,
  is_closed INTEGER DEFAULT 0,
  is_deleted INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
