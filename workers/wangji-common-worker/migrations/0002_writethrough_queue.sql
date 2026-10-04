-- wangji-common-os 0002: write-through 검토 큐
-- 이 큐는 "요청 적재 + 관리자 검토"까지만 사용한다 (4차).
-- applied(원본 반영)는 5차 write-through 단계에서만 사용하며, 4차 코드에는 applied 전이가 없다.
-- AP/EIE 원본 DB에는 어떤 write도 하지 않는다.

CREATE TABLE IF NOT EXISTS wangji_writethrough_queue (
  id TEXT PRIMARY KEY,
  wangji_student_id TEXT NOT NULL,
  target_app TEXT NOT NULL,            -- 'AP' | 'EIE'
  target_type TEXT NOT NULL,           -- student_info | enrollment | schedule | consultation
  target_source_id TEXT,               -- 원본 학생/반/셀 id
  request_payload_json TEXT,           -- 반영 요청 내용
  request_reason TEXT,
  status TEXT NOT NULL DEFAULT 'requested', -- requested|reviewed|approved|rejected|applied|failed
  requested_by TEXT,
  reviewed_by TEXT,
  decided_at DATETIME,
  applied_at DATETIME,                 -- 5차 전용
  original_snapshot_json TEXT,         -- 5차 롤백용 (반영 직전 원본값)
  apply_result_summary TEXT,           -- 5차 전용
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_deleted INTEGER DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_wangji_wtq_student ON wangji_writethrough_queue(wangji_student_id);
CREATE INDEX IF NOT EXISTS idx_wangji_wtq_status ON wangji_writethrough_queue(status, is_deleted);
