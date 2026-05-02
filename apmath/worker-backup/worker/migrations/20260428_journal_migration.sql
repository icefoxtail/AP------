-- ==================================================
-- AP Math OS
-- 교재·수업기록·일지 자동취합 기반 마이그레이션
-- 1차: class_textbooks / class_daily_records / class_daily_progress
-- ==================================================

CREATE TABLE IF NOT EXISTS class_textbooks (
  id TEXT PRIMARY KEY,
  class_id TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  start_date TEXT,
  end_date TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_class_textbooks_class_id
ON class_textbooks(class_id);

CREATE INDEX IF NOT EXISTS idx_class_textbooks_status
ON class_textbooks(status);

CREATE INDEX IF NOT EXISTS idx_class_textbooks_class_status
ON class_textbooks(class_id, status);

CREATE TABLE IF NOT EXISTS class_daily_records (
  id TEXT PRIMARY KEY,
  class_id TEXT NOT NULL,
  date TEXT NOT NULL,
  teacher_name TEXT,
  special_note TEXT DEFAULT '',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(class_id, date)
);

CREATE INDEX IF NOT EXISTS idx_class_daily_records_class_date
ON class_daily_records(class_id, date);

CREATE INDEX IF NOT EXISTS idx_class_daily_records_date
ON class_daily_records(date);

CREATE TABLE IF NOT EXISTS class_daily_progress (
  id TEXT PRIMARY KEY,
  record_id TEXT NOT NULL,
  class_id TEXT NOT NULL,
  textbook_id TEXT,
  textbook_title_snapshot TEXT NOT NULL,
  progress_text TEXT DEFAULT '',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_class_daily_progress_record_id
ON class_daily_progress(record_id);

CREATE INDEX IF NOT EXISTS idx_class_daily_progress_class_id
ON class_daily_progress(class_id);

CREATE INDEX IF NOT EXISTS idx_class_daily_progress_textbook_id
ON class_daily_progress(textbook_id);

-- ==================================================
-- 기존 classes.textbook 호환 이관
-- 기존 단일 교재값이 있는 반은 class_textbooks에 1회 등록
-- 이미 등록된 tx_migrate_CLASSID는 중복 삽입되지 않음
-- ==================================================

INSERT OR IGNORE INTO class_textbooks (
  id,
  class_id,
  title,
  status,
  start_date,
  sort_order,
  created_at,
  updated_at
)
SELECT
  'tx_migrate_' || id,
  id,
  textbook,
  'active',
  DATE('now', '+9 hours'),
  0,
  DATETIME('now'),
  DATETIME('now')
FROM classes
WHERE textbook IS NOT NULL
  AND TRIM(textbook) <> '';