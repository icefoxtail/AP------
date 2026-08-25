-- =====================================================================
-- WANGJI_STUDENT_MANAGEMENT_V1_SCHEMA_DRAFT.sql
-- 왕지교육 공통 학생관리 v1 — overlay/link/index DB 스키마 "초안"
-- =====================================================================
-- 주의 (반드시 읽을 것):
--   * 이 파일은 초안(draft)이며 실제 migration이 아니다.
--   * worker/migrations/ 에 두지 않는다. (실수로 apply 되는 위치 금지)
--   * 어떤 D1에도 apply 하지 않는다.
--   * 기존 AP DB(ap-math-os) / EIE DB(wangji-eie-os) 에 적용하지 않는다.
--   * 이 스키마는 원본 학생 DB가 아니다. 역할은 overlay / link / index 다.
--   * 권장 적용 대상(후속): 신규 별도 D1 `wangji-common-os`.
--   * 기존 AP/EIE 학생/상담/시간표 데이터를 이 테이블로 일괄 복사·재입력 금지.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1) wangji_students : 공통 학생 anchor (전체 복사본 아님)
--    - 통합 화면 표시 기준점
--    - 검색 편의를 위한 최소 snapshot만 보관
--    - 원본 정보 우선권은 항상 AP/EIE 원본 DB(adapter read)에 있다
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS wangji_students (
  id                    TEXT PRIMARY KEY,
  display_name          TEXT NOT NULL,
  school_name_snapshot  TEXT,           -- snapshot: 원본 대체값 아님
  grade_snapshot        TEXT,
  primary_phone_snapshot TEXT,
  status                TEXT DEFAULT 'active',
  memo                  TEXT,
  created_at            DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at            DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_deleted            INTEGER DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_wangji_students_name ON wangji_students(display_name);
CREATE INDEX IF NOT EXISTS idx_wangji_students_status ON wangji_students(status, is_deleted);

-- ---------------------------------------------------------------------
-- 2) wangji_student_links : AP/EIE 외부 학생 연결 (핵심 테이블)
--    - source_app + source_student_id 는 원본 학생을 가리키는 외부 참조
--    - cross-DB FK 는 걸 수 없음 (AP/EIE 는 별도 D1)
--    - 자동 확정 금지: 후보는 candidate 까지만, active 는 관리자 확인
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS wangji_student_links (
  id                          TEXT PRIMARY KEY,
  wangji_student_id           TEXT NOT NULL,
  source_app                  TEXT NOT NULL,    -- 'AP' | 'EIE'
  source_student_id           TEXT NOT NULL,    -- AP students.id 또는 eie_students.id
  source_display_name_snapshot TEXT,
  source_school_snapshot      TEXT,
  source_grade_snapshot       TEXT,
  source_phone_snapshot       TEXT,
  link_status                 TEXT NOT NULL DEFAULT 'candidate', -- candidate|active|rejected|archived
  confidence_reason           TEXT,             -- 후보 근거(동명이인/번호일치 등)
  confirmed_by                TEXT,
  confirmed_at                DATETIME,
  created_at                  DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at                  DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_deleted                  INTEGER DEFAULT 0,
  UNIQUE(source_app, source_student_id)         -- 한 외부 학생 중복 링크 방지
);
CREATE INDEX IF NOT EXISTS idx_wangji_links_student ON wangji_student_links(wangji_student_id);
CREATE INDEX IF NOT EXISTS idx_wangji_links_status ON wangji_student_links(link_status, is_deleted);
CREATE INDEX IF NOT EXISTS idx_wangji_links_source ON wangji_student_links(source_app, source_student_id);

-- ---------------------------------------------------------------------
-- 3) wangji_consultations : 공통 상담
--    - 1차: 신규 공통 상담만 저장 (이번 구현에서는 저장 UI skeleton만, write 미구현)
--    - 기존 AP/EIE 상담은 read-only adapter 로만 표시 (복사 금지)
--    - source_scope 로 상담 맥락 구분
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS wangji_consultations (
  id                TEXT PRIMARY KEY,
  wangji_student_id TEXT NOT NULL,
  source_scope      TEXT NOT NULL DEFAULT 'COMMON', -- COMMON | AP | EIE
  source_app        TEXT,                            -- AP | EIE (scope 가 AP/EIE 일 때)
  source_student_id TEXT,
  consultation_date TEXT,
  category          TEXT,
  content           TEXT,
  next_action       TEXT,
  followup_status   TEXT,
  visibility        TEXT DEFAULT 'staff',
  created_by        TEXT,
  created_at        DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_deleted        INTEGER DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_wangji_consult_student ON wangji_consultations(wangji_student_id);
CREATE INDEX IF NOT EXISTS idx_wangji_consult_scope ON wangji_consultations(source_scope);

-- =====================================================================
-- write-through 확장 포인트 (후속 단계, 이번 1차 구현 대상 아님):
--   * 공통 링크/메모/상담      → 위 overlay 테이블에 저장
--   * AP 학생/수강/반 수정      → AP 공식 API 또는 AP write-through adapter
--   * EIE 학생/시간표 배정 수정 → EIE 공식 API 또는 EIE write-through adapter
--   * 원본 DB 직접 SQL write 금지. 기존 공식 route/API 재사용 우선.
-- =====================================================================
