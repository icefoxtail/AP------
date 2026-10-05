CREATE TABLE IF NOT EXISTS ap_timetable_month_snapshots (
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

CREATE TABLE IF NOT EXISTS ap_timetable_month_snapshot_cells (
  id TEXT PRIMARY KEY,
  snapshot_id TEXT NOT NULL,
  source_cell_id TEXT,
  source_class_id TEXT,
  day_label TEXT,
  period_label TEXT,
  period_order INTEGER,
  start_time TEXT,
  end_time TEXT,
  class_name TEXT,
  teacher_id TEXT,
  teacher_name TEXT,
  room TEXT,
  subject TEXT,
  grade TEXT,
  student_count INTEGER DEFAULT 0,
  memo TEXT,
  raw_meta_json TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(snapshot_id) REFERENCES ap_timetable_month_snapshots(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ap_timetable_month_snapshot_students (
  id TEXT PRIMARY KEY,
  snapshot_id TEXT NOT NULL,
  snapshot_cell_id TEXT NOT NULL,
  source_student_id TEXT,
  source_class_id TEXT,
  display_name TEXT,
  grade TEXT,
  school_name TEXT,
  student_status TEXT,
  enrollment_date TEXT,
  discharged_at TEXT,
  raw_meta_json TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(snapshot_id) REFERENCES ap_timetable_month_snapshots(id) ON DELETE CASCADE,
  FOREIGN KEY(snapshot_cell_id) REFERENCES ap_timetable_month_snapshot_cells(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_ap_timetable_month_snapshots_month ON ap_timetable_month_snapshots(month_key);
CREATE INDEX IF NOT EXISTS idx_ap_timetable_month_snapshots_date ON ap_timetable_month_snapshots(snapshot_date);
CREATE INDEX IF NOT EXISTS idx_ap_timetable_month_snapshot_cells_snapshot ON ap_timetable_month_snapshot_cells(snapshot_id);
CREATE INDEX IF NOT EXISTS idx_ap_timetable_month_snapshot_cells_source ON ap_timetable_month_snapshot_cells(source_cell_id);
CREATE INDEX IF NOT EXISTS idx_ap_timetable_month_snapshot_students_snapshot ON ap_timetable_month_snapshot_students(snapshot_id);
CREATE INDEX IF NOT EXISTS idx_ap_timetable_month_snapshot_students_source ON ap_timetable_month_snapshot_students(source_student_id);
CREATE INDEX IF NOT EXISTS idx_ap_timetable_month_snapshot_students_snapshot_source ON ap_timetable_month_snapshot_students(snapshot_id, source_student_id);
CREATE INDEX IF NOT EXISTS idx_ap_timetable_month_snapshot_cells_day_period ON ap_timetable_month_snapshot_cells(snapshot_id, day_label, period_order);
