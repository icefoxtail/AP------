-- 4D: 할 일 메모(operation_memos) 테이블 신설
CREATE TABLE IF NOT EXISTS operation_memos (
  id TEXT PRIMARY KEY,
  memo_date TEXT NOT NULL,
  content TEXT NOT NULL,
  is_pinned INTEGER DEFAULT 0,
  is_done INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_operation_memos_date ON operation_memos(memo_date);
CREATE INDEX IF NOT EXISTS idx_operation_memos_done ON operation_memos(is_done);

-- 4D: 시험일정(exam_schedules) 테이블 신설
CREATE TABLE IF NOT EXISTS exam_schedules (
  id TEXT PRIMARY KEY,
  school_name TEXT NOT NULL,
  grade TEXT,
  exam_name TEXT,
  exam_date TEXT NOT NULL,
  memo TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_exam_schedules_date ON exam_schedules(exam_date);
CREATE INDEX IF NOT EXISTS idx_exam_schedules_school ON exam_schedules(school_name);