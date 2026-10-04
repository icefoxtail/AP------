-- AP Math OS: 지속형 클래스룸 canonical 진도 snapshot/history
-- 기존 class_daily_records / class_daily_progress 의미는 변경하지 않는다.

CREATE TABLE IF NOT EXISTS class_progress_snapshots (
  id TEXT PRIMARY KEY,
  class_id TEXT NOT NULL,
  effective_date TEXT NOT NULL,
  updated_by_teacher_id TEXT,
  updated_by_teacher_name TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(class_id, effective_date)
);

CREATE TABLE IF NOT EXISTS class_progress_items (
  id TEXT PRIMARY KEY,
  snapshot_id TEXT NOT NULL,
  class_id TEXT NOT NULL,
  curriculum_key TEXT NOT NULL,
  level_key TEXT NOT NULL,
  course_key TEXT NOT NULL,
  canonical_path_key TEXT NOT NULL,
  l1_snapshot TEXT NOT NULL,
  l2_snapshot TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(snapshot_id, canonical_path_key)
);

CREATE INDEX IF NOT EXISTS idx_class_progress_snapshots_class_effective
  ON class_progress_snapshots(class_id, effective_date DESC);

CREATE INDEX IF NOT EXISTS idx_class_progress_items_snapshot_order
  ON class_progress_items(snapshot_id, sort_order, id);

CREATE INDEX IF NOT EXISTS idx_class_progress_items_class
  ON class_progress_items(class_id);

CREATE INDEX IF NOT EXISTS idx_class_progress_items_path
  ON class_progress_items(canonical_path_key);
