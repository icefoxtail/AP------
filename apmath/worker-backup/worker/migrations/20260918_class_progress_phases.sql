-- 진도 상태(정규/시험 대비)를 canonical 단원 진도와 분리해 날짜별로 저장한다.

CREATE TABLE IF NOT EXISTS class_progress_phases (
  id TEXT PRIMARY KEY,
  class_id TEXT NOT NULL,
  effective_date TEXT NOT NULL,
  phase TEXT NOT NULL CHECK (
    phase IN (
      'regular',
      'semester1_midterm',
      'semester1_final',
      'semester2_midterm',
      'semester2_final'
    )
  ),
  updated_by_teacher_id TEXT,
  updated_by_teacher_name TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(class_id, effective_date)
);

CREATE INDEX IF NOT EXISTS idx_class_progress_phases_class_effective
  ON class_progress_phases(class_id, effective_date DESC);
