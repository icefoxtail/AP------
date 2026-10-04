-- APMS assessment analysis storage migration draft.
-- 검토용 초안이며 실제 적용 migration 아님.
-- 이 파일은 docs 아래 설계 산출물이다. 실제 migrations 폴더에 넣지 않는다.
-- 실제 DB 적용 명령을 포함하지 않는다.
-- D1/SQLite 기준 초안이며 기존 테이블을 DROP/RENAME 하지 않는다.
--
-- 주의:
-- SQLite/D1의 ALTER TABLE ADD COLUMN은 컬럼 단위 IF NOT EXISTS를 직접 지원하지 않을 수 있다.
-- 실제 적용 migration에서는 PRAGMA table_info('table_name')로 컬럼 존재 여부를 확인한 뒤
-- 필요한 ALTER TABLE만 실행하는 방어 로직이 필요하다.

-- class_exam_assignments 보강 초안.
-- 현재 class_exam_assignments.id는 TEXT PRIMARY KEY이므로 연결 컬럼도 TEXT 기준으로 설계한다.
ALTER TABLE class_exam_assignments ADD COLUMN pack_id TEXT;
ALTER TABLE class_exam_assignments ADD COLUMN grade_label TEXT;
ALTER TABLE class_exam_assignments ADD COLUMN source_hash TEXT;
ALTER TABLE class_exam_assignments ADD COLUMN assignment_batch_id TEXT;
ALTER TABLE class_exam_assignments ADD COLUMN target_scope TEXT;
ALTER TABLE class_exam_assignments ADD COLUMN created_by TEXT;

CREATE INDEX IF NOT EXISTS idx_class_exam_assignments_pack_id
  ON class_exam_assignments(pack_id);

CREATE INDEX IF NOT EXISTS idx_class_exam_assignments_batch
  ON class_exam_assignments(assignment_batch_id);

CREATE INDEX IF NOT EXISTS idx_class_exam_assignments_source_hash
  ON class_exam_assignments(source_hash);

-- exam_sessions 보강 초안.
-- 현재 exam_sessions.id, student_id, class_id가 TEXT 계열로 사용되므로 assignment_id도 TEXT 권장.
ALTER TABLE exam_sessions ADD COLUMN assignment_id TEXT;
ALTER TABLE exam_sessions ADD COLUMN pack_id TEXT;
ALTER TABLE exam_sessions ADD COLUMN source_hash TEXT;
ALTER TABLE exam_sessions ADD COLUMN analysis_status TEXT DEFAULT 'none'
  CHECK (analysis_status IN ('none', 'basic_ready', 'premium_ready', 'stale'));

CREATE INDEX IF NOT EXISTS idx_exam_sessions_assignment_id
  ON exam_sessions(assignment_id);

CREATE INDEX IF NOT EXISTS idx_exam_sessions_pack_id
  ON exam_sessions(pack_id);

CREATE INDEX IF NOT EXISTS idx_exam_sessions_source_hash
  ON exam_sessions(source_hash);

CREATE INDEX IF NOT EXISTS idx_exam_sessions_analysis_status
  ON exam_sessions(analysis_status);

CREATE TABLE IF NOT EXISTS assessment_result_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  assignment_id TEXT,
  pack_id TEXT,
  student_id TEXT,
  class_id TEXT,
  order_no INTEGER NOT NULL,
  question_no INTEGER,
  result_status TEXT NOT NULL DEFAULT 'unchecked'
    CHECK (result_status IN ('correct', 'wrong', 'partial', 'unchecked')),
  is_correct INTEGER
    CHECK (is_correct IN (0, 1) OR is_correct IS NULL),
  student_answer TEXT,
  correct_answer TEXT,
  score REAL,
  max_score REAL,
  source_archive_file TEXT,
  source_question_no INTEGER,
  standard_unit_key TEXT,
  standard_unit TEXT,
  concept_cluster_key TEXT,
  type_key TEXT,
  difficulty TEXT,
  analysis_note TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_assessment_result_items_session
  ON assessment_result_items(session_id);

CREATE INDEX IF NOT EXISTS idx_assessment_result_items_student
  ON assessment_result_items(student_id);

CREATE INDEX IF NOT EXISTS idx_assessment_result_items_class
  ON assessment_result_items(class_id);

CREATE INDEX IF NOT EXISTS idx_assessment_result_items_pack
  ON assessment_result_items(pack_id);

CREATE INDEX IF NOT EXISTS idx_assessment_result_items_source
  ON assessment_result_items(source_archive_file, source_question_no);

CREATE INDEX IF NOT EXISTS idx_assessment_result_items_assignment
  ON assessment_result_items(assignment_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_assessment_result_items_session_order_unique
  ON assessment_result_items(session_id, order_no);

CREATE TABLE IF NOT EXISTS assessment_analysis_snapshots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  academy_id TEXT,
  session_id TEXT,
  assignment_id TEXT,
  pack_id TEXT,
  student_id TEXT,
  class_id TEXT,
  grade_label TEXT,
  analysis_scope TEXT NOT NULL
    CHECK (analysis_scope IN ('student', 'class', 'grade')),
  analysis_type TEXT NOT NULL
    CHECK (analysis_type IN ('raw_item_analysis', 'unit_summary', 'class_summary', 'grade_summary')),
  source_hash TEXT NOT NULL,
  analysis_json TEXT NOT NULL,
  source_summary_json TEXT,
  created_by TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  invalidated_at TEXT,
  is_stale INTEGER DEFAULT 0
    CHECK (is_stale IN (0, 1))
);

CREATE INDEX IF NOT EXISTS idx_assessment_analysis_snapshots_session_type_stale
  ON assessment_analysis_snapshots(session_id, analysis_type, is_stale);

CREATE INDEX IF NOT EXISTS idx_assessment_analysis_snapshots_student_type_stale
  ON assessment_analysis_snapshots(student_id, analysis_type, is_stale);

CREATE INDEX IF NOT EXISTS idx_assessment_analysis_snapshots_class_type_stale
  ON assessment_analysis_snapshots(class_id, analysis_type, is_stale);

CREATE INDEX IF NOT EXISTS idx_assessment_analysis_snapshots_source_hash
  ON assessment_analysis_snapshots(source_hash);

CREATE INDEX IF NOT EXISTS idx_assessment_analysis_snapshots_assignment
  ON assessment_analysis_snapshots(assignment_id);

CREATE INDEX IF NOT EXISTS idx_assessment_analysis_snapshots_pack
  ON assessment_analysis_snapshots(pack_id);

CREATE TABLE IF NOT EXISTS assessment_report_snapshots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  academy_id TEXT,
  analysis_snapshot_id INTEGER,
  session_id TEXT,
  assignment_id TEXT,
  pack_id TEXT,
  student_id TEXT,
  class_id TEXT,
  grade_label TEXT,
  report_type TEXT NOT NULL
    CHECK (report_type IN ('premium_analysis', 'parent_report', 'printable_report')),
  source_hash TEXT NOT NULL,
  report_json TEXT NOT NULL,
  rendered_html TEXT,
  ai_source TEXT,
  ai_model TEXT,
  created_by TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  invalidated_at TEXT,
  is_stale INTEGER DEFAULT 0
    CHECK (is_stale IN (0, 1))
);

CREATE INDEX IF NOT EXISTS idx_assessment_report_snapshots_analysis_snapshot
  ON assessment_report_snapshots(analysis_snapshot_id);

CREATE INDEX IF NOT EXISTS idx_assessment_report_snapshots_session_type_stale
  ON assessment_report_snapshots(session_id, report_type, is_stale);

CREATE INDEX IF NOT EXISTS idx_assessment_report_snapshots_student_type_stale
  ON assessment_report_snapshots(student_id, report_type, is_stale);

CREATE INDEX IF NOT EXISTS idx_assessment_report_snapshots_class_type_stale
  ON assessment_report_snapshots(class_id, report_type, is_stale);

CREATE INDEX IF NOT EXISTS idx_assessment_report_snapshots_source_hash
  ON assessment_report_snapshots(source_hash);

CREATE INDEX IF NOT EXISTS idx_assessment_report_snapshots_assignment
  ON assessment_report_snapshots(assignment_id);

CREATE INDEX IF NOT EXISTS idx_assessment_report_snapshots_pack
  ON assessment_report_snapshots(pack_id);
