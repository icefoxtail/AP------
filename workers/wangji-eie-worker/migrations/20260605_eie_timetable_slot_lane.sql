-- EIE 시간표 셀 slot_lane 컬럼 추가 (테이블 재생성 방식)
-- 적용 명령: wrangler d1 execute wangji-eie-os --remote --file=workers/wangji-eie-worker/migrations/20260605_eie_timetable_slot_lane.sql
--
-- 목적: UNIQUE(import_session_id, day_label, period_label, column_index) 제약을
--       UNIQUE(import_session_id, day_label, period_label, column_index, slot_lane)로 변경하여
--       같은 슬롯에 lane 1/2 두 카드를 허용한다.
-- SQLite/D1은 UNIQUE 제약 변경을 지원하지 않으므로 테이블 재생성이 필요하다.

PRAGMA foreign_keys = OFF;

-- 1. 새 테이블 생성 (기존 제약 보존 + slot_lane 추가 + 새 UNIQUE 제약)
CREATE TABLE eie_timetable_cells_new (
  id                       TEXT PRIMARY KEY,
  import_session_id        TEXT NOT NULL,
  source_type              TEXT NOT NULL DEFAULT 'import',
  source_import_session_id TEXT,
  day_label                TEXT,
  period_label             TEXT NOT NULL,
  period_order             INTEGER,
  start_time               TEXT,
  end_time                 TEXT,
  class_name_raw           TEXT,
  teacher_name_raw         TEXT,
  room_raw                 TEXT,
  column_index             INTEGER NOT NULL,
  student_count            INTEGER DEFAULT 0,
  status                   TEXT NOT NULL DEFAULT 'imported',
  memo                     TEXT,
  raw_meta_json            TEXT,
  slot_lane                INTEGER NOT NULL DEFAULT 1,
  created_at               TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at               TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (import_session_id) REFERENCES eie_import_sessions(id) ON DELETE CASCADE,
  UNIQUE(import_session_id, day_label, period_label, column_index, slot_lane)
);

-- 2. 기존 데이터 복사 (slot_lane = 1로 채움)
INSERT INTO eie_timetable_cells_new (
  id, import_session_id, source_type, source_import_session_id,
  day_label, period_label, period_order, start_time, end_time,
  class_name_raw, teacher_name_raw, room_raw, column_index,
  student_count, status, memo, raw_meta_json, slot_lane, created_at, updated_at
)
SELECT
  id, import_session_id, source_type, source_import_session_id,
  day_label, period_label, period_order, start_time, end_time,
  class_name_raw, teacher_name_raw, room_raw, column_index,
  student_count, status, memo, raw_meta_json, 1,
  COALESCE(created_at, CURRENT_TIMESTAMP),
  COALESCE(updated_at, CURRENT_TIMESTAMP)
FROM eie_timetable_cells;

-- 3. 기존 테이블 삭제 후 이름 변경
DROP TABLE eie_timetable_cells;
ALTER TABLE eie_timetable_cells_new RENAME TO eie_timetable_cells;

-- 4. 인덱스 재생성
CREATE INDEX IF NOT EXISTS idx_eie_timetable_cells_import_session
  ON eie_timetable_cells(import_session_id);

CREATE INDEX IF NOT EXISTS idx_eie_timetable_cells_status
  ON eie_timetable_cells(import_session_id, status);

CREATE INDEX IF NOT EXISTS idx_eie_timetable_cells_operation_status
  ON eie_timetable_cells(status, day_label, period_order, column_index, slot_lane);

CREATE INDEX IF NOT EXISTS idx_eie_timetable_cells_source_type
  ON eie_timetable_cells(source_type, source_import_session_id);

PRAGMA foreign_keys = ON;
