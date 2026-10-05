CREATE TABLE IF NOT EXISTS onboarding_tasks (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  class_id TEXT,
  enrollment_id TEXT,
  teacher_id TEXT,
  created_teacher_id TEXT,
  task_type TEXT NOT NULL,
  task_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  onboarding_started_at TEXT NOT NULL,
  visible_from TEXT NOT NULL,
  due_date TEXT NOT NULL,
  deferred_until TEXT,
  completed_at TEXT,
  completed_by TEXT,
  completed_consultation_id TEXT,
  contact_method TEXT,
  last_contact_at TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, enrollment_id, task_type)
);

CREATE INDEX IF NOT EXISTS idx_onboarding_tasks_student ON onboarding_tasks(student_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_tasks_class ON onboarding_tasks(class_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_tasks_teacher_status ON onboarding_tasks(teacher_id, status);
CREATE INDEX IF NOT EXISTS idx_onboarding_tasks_visible ON onboarding_tasks(teacher_id, status, visible_from, due_date);
CREATE INDEX IF NOT EXISTS idx_onboarding_tasks_enrollment ON onboarding_tasks(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_tasks_type ON onboarding_tasks(task_type);
CREATE INDEX IF NOT EXISTS idx_onboarding_tasks_status ON onboarding_tasks(status);
