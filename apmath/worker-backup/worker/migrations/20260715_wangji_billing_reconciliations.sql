-- =============================================================================
-- [WANGJI BILLING RECONCILIATIONS] - 2026-07-15 (LOOP 7)
-- 목적: 마감 스냅샷 ↔ 원장 재계산 ↔ 집계(summary)를 비교한 대사 결과를 저장한다.
--   집계(daily/monthly summary)는 원장 SQL 단일 기준으로만 upsert되며
--   값을 직접 수정하는 API는 존재하지 않는다.
-- =============================================================================

CREATE TABLE IF NOT EXISTS billing_reconciliations (
  id TEXT PRIMARY KEY,
  period_type TEXT NOT NULL,          -- 'day' | 'month'
  period_key TEXT NOT NULL,
  branch TEXT DEFAULT 'all',
  closing_id TEXT,                    -- 비교한 마감 스냅샷
  status TEXT NOT NULL,               -- 'matched' | 'mismatched'
  ledger_json TEXT,                   -- 원장 재계산 값
  summary_json TEXT,                  -- 집계 테이블 값
  snapshot_json TEXT,                 -- 마감 스냅샷 값
  diff_json TEXT,                     -- 불일치 목록
  created_by TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_billing_reconciliations_period
  ON billing_reconciliations(period_type, period_key, branch);
CREATE INDEX IF NOT EXISTS idx_billing_reconciliations_status
  ON billing_reconciliations(status);
