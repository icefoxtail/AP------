CREATE TABLE IF NOT EXISTS timetable_versions (
  id TEXT PRIMARY KEY,
  school_year INTEGER NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  source_version_id TEXT,
  effective_from TEXT,
  effective_to TEXT,
  created_by TEXT,
  activated_at TEXT,
  archived_at TEXT,
  cancelled_at TEXT,
  memo TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_timetable_versions_year ON timetable_versions(school_year);
CREATE INDEX IF NOT EXISTS idx_timetable_versions_status ON timetable_versions(status);
CREATE INDEX IF NOT EXISTS idx_timetable_versions_effective ON timetable_versions(effective_from, effective_to);
CREATE INDEX IF NOT EXISTS idx_timetable_versions_source ON timetable_versions(source_version_id);

CREATE TABLE IF NOT EXISTS timetable_version_slots (
  id TEXT PRIMARY KEY,
  version_id TEXT NOT NULL,
  class_id TEXT NOT NULL,
  day_of_week TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  room_name TEXT,
  memo TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_timetable_version_slots_version ON timetable_version_slots(version_id);
CREATE INDEX IF NOT EXISTS idx_timetable_version_slots_class ON timetable_version_slots(class_id);
CREATE INDEX IF NOT EXISTS idx_timetable_version_slots_day ON timetable_version_slots(day_of_week);
CREATE INDEX IF NOT EXISTS idx_timetable_version_slots_room ON timetable_version_slots(room_name);
CREATE INDEX IF NOT EXISTS idx_timetable_version_slots_time ON timetable_version_slots(version_id, day_of_week, start_time, end_time);
