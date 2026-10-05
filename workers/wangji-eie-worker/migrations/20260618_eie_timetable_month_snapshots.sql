CREATE TABLE IF NOT EXISTS eie_timetable_month_snapshots (
  id TEXT PRIMARY KEY,
  month_key TEXT NOT NULL,
  snapshot_date TEXT NOT NULL,
  title TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  source_type TEXT NOT NULL DEFAULT 'manual',
  source_hash TEXT,
  memo TEXT,
  created_by TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(month_key, snapshot_date)
);

CREATE TABLE IF NOT EXISTS eie_timetable_month_snapshot_cells (
  id TEXT PRIMARY KEY,
  snapshot_id TEXT NOT NULL,
  source_cell_id TEXT,
  day_label TEXT,
  period_label TEXT,
  period_order INTEGER,
  start_time TEXT,
  end_time TEXT,
  class_name_raw TEXT,
  teacher_name_raw TEXT,
  teacher_names_json TEXT,
  room_raw TEXT,
  column_index INTEGER,
  slot_lane INTEGER DEFAULT 1,
  student_count INTEGER DEFAULT 0,
  memo TEXT,
  raw_meta_json TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(snapshot_id) REFERENCES eie_timetable_month_snapshots(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS eie_timetable_month_snapshot_students (
  id TEXT PRIMARY KEY,
  snapshot_id TEXT NOT NULL,
  snapshot_cell_id TEXT NOT NULL,
  source_assignment_id TEXT,
  source_student_id TEXT,
  display_name TEXT,
  normalized_name TEXT,
  grade TEXT,
  school_name TEXT,
  student_status TEXT,
  student_type TEXT,
  student_phone TEXT,
  parent_phone TEXT,
  enrollment_date TEXT,
  withdrawn_at TEXT,
  raw_meta_json TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(snapshot_id) REFERENCES eie_timetable_month_snapshots(id) ON DELETE CASCADE,
  FOREIGN KEY(snapshot_cell_id) REFERENCES eie_timetable_month_snapshot_cells(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_eie_timetable_month_snapshots_month ON eie_timetable_month_snapshots(month_key);
CREATE INDEX IF NOT EXISTS idx_eie_timetable_month_snapshots_date ON eie_timetable_month_snapshots(snapshot_date);
CREATE INDEX IF NOT EXISTS idx_eie_timetable_month_snapshot_cells_snapshot ON eie_timetable_month_snapshot_cells(snapshot_id);
CREATE INDEX IF NOT EXISTS idx_eie_timetable_month_snapshot_cells_source ON eie_timetable_month_snapshot_cells(source_cell_id);
CREATE INDEX IF NOT EXISTS idx_eie_timetable_month_snapshot_students_snapshot ON eie_timetable_month_snapshot_students(snapshot_id);
CREATE INDEX IF NOT EXISTS idx_eie_timetable_month_snapshot_students_source ON eie_timetable_month_snapshot_students(source_student_id);
CREATE INDEX IF NOT EXISTS idx_eie_timetable_month_snapshot_students_snapshot_source ON eie_timetable_month_snapshot_students(snapshot_id, source_student_id);
CREATE INDEX IF NOT EXISTS idx_eie_timetable_month_snapshot_cells_day_period ON eie_timetable_month_snapshot_cells(snapshot_id, day_label, period_order);
