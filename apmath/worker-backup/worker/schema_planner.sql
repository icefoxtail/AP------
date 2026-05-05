CREATE TABLE IF NOT EXISTS student_plans (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  plan_date TEXT NOT NULL,
  title TEXT NOT NULL,
  subject TEXT,
  is_done INTEGER DEFAULT 0,
  repeat_rule TEXT,
  created_at TEXT DEFAULT (datetime('now','localtime')),
  updated_at TEXT DEFAULT (datetime('now','localtime')),
  FOREIGN KEY (student_id) REFERENCES students(id)
);

CREATE INDEX IF NOT EXISTS idx_plans_student_date
  ON student_plans(student_id, plan_date);

CREATE TABLE IF NOT EXISTS planner_feedback (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  feedback_date TEXT NOT NULL,
  teacher_comment TEXT,
  badge TEXT,
  completion_rate INTEGER,
  created_at TEXT DEFAULT (datetime('now','localtime')),
  updated_at TEXT DEFAULT (datetime('now','localtime')),
  FOREIGN KEY (student_id) REFERENCES students(id)
);

CREATE INDEX IF NOT EXISTS idx_planner_feedback_student_date
  ON planner_feedback(student_id, feedback_date);

CREATE UNIQUE INDEX IF NOT EXISTS idx_planner_feedback_unique_student_date
  ON planner_feedback(student_id, feedback_date);