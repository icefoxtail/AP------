-- wangji-common-os 0001: overlay/link/index 초기 스키마
-- 이 DB는 원본 학생 DB가 아니다. AP(ap-math-os)/EIE(wangji-eie-os)는 원본으로 유지된다.
-- 원본 데이터의 일괄 복사/재입력 seed 금지. 테이블은 빈 상태로 시작한다.

CREATE TABLE IF NOT EXISTS wangji_students (
  id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  school_name_snapshot TEXT,
  grade_snapshot TEXT,
  primary_phone_snapshot TEXT,
  status TEXT DEFAULT 'active',
  memo TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_deleted INTEGER DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_wangji_students_name ON wangji_students(display_name);
CREATE INDEX IF NOT EXISTS idx_wangji_students_status ON wangji_students(status, is_deleted);

CREATE TABLE IF NOT EXISTS wangji_student_links (
  id TEXT PRIMARY KEY,
  wangji_student_id TEXT NOT NULL,
  source_app TEXT NOT NULL,              -- 'AP' | 'EIE'
  source_student_id TEXT NOT NULL,       -- 외부 참조 (cross-DB FK 불가)
  source_display_name_snapshot TEXT,
  source_school_snapshot TEXT,
  source_grade_snapshot TEXT,
  source_phone_snapshot TEXT,
  link_status TEXT NOT NULL DEFAULT 'candidate', -- candidate|active|rejected|archived
  confidence_reason TEXT,
  confirmed_by TEXT,
  confirmed_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_deleted INTEGER DEFAULT 0,
  UNIQUE(source_app, source_student_id)
);
CREATE INDEX IF NOT EXISTS idx_wangji_links_student ON wangji_student_links(wangji_student_id);
CREATE INDEX IF NOT EXISTS idx_wangji_links_status ON wangji_student_links(link_status, is_deleted);

CREATE TABLE IF NOT EXISTS wangji_consultations (
  id TEXT PRIMARY KEY,
  wangji_student_id TEXT NOT NULL,
  source_scope TEXT NOT NULL DEFAULT 'COMMON', -- COMMON|AP|EIE
  source_app TEXT,
  source_student_id TEXT,
  consultation_date TEXT,
  category TEXT,
  content TEXT,
  next_action TEXT,
  followup_status TEXT,
  visibility TEXT DEFAULT 'staff',
  created_by TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_deleted INTEGER DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_wangji_consult_student ON wangji_consultations(wangji_student_id);
CREATE INDEX IF NOT EXISTS idx_wangji_consult_followup ON wangji_consultations(followup_status, is_deleted);

CREATE TABLE IF NOT EXISTS wangji_memos (
  id TEXT PRIMARY KEY,
  wangji_student_id TEXT NOT NULL,
  title TEXT,
  content TEXT,
  importance TEXT DEFAULT 'normal',     -- low|normal|high
  tags TEXT,
  created_by TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_deleted INTEGER DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_wangji_memos_student ON wangji_memos(wangji_student_id);

CREATE TABLE IF NOT EXISTS wangji_audit_logs (
  id TEXT PRIMARY KEY,
  actor TEXT,
  action TEXT NOT NULL,                 -- create|update|delete|status_change|login
  target_table TEXT,
  target_id TEXT,
  payload_summary TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_wangji_audit_target ON wangji_audit_logs(target_table, target_id);

CREATE TABLE IF NOT EXISTS wangji_admin_sessions (
  id TEXT PRIMARY KEY,
  login_id TEXT NOT NULL,
  session_token TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  revoked_at TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_used_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_wangji_admin_sessions_token ON wangji_admin_sessions(session_token);
