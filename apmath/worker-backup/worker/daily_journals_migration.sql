CREATE TABLE IF NOT EXISTS daily_journals (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  teacher_name TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT DEFAULT '작성중',
  feedback TEXT DEFAULT '',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_daily_journals_date ON daily_journals(date);
CREATE INDEX IF NOT EXISTS idx_daily_journals_teacher ON daily_journals(teacher_name);