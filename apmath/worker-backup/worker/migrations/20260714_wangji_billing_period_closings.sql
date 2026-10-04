-- =============================================================================
-- [WANGJI BILLING PERIOD CLOSINGS] - 2026-07-14 (LOOP 5)
-- 목적: 일마감·월마감으로 과거 원장을 잠근다.
--   상태 흐름: open(행 없음) → closed → reopened → (재마감 시) closed
--   마감 시 원장 합계 스냅샷을 저장하고, 재오픈은 사유·승인자·이전 스냅샷을 남긴다.
--   closed 기간의 금액 기록 생성·수정·취소는 모든 금액 API에서 423으로 차단된다.
-- 권한: 수납(billing.collect)·조정/이월(billing.adjust)·환불(billing.refund.approve)·
--   마감(billing.close)·재오픈(billing.reopen)은 staff_permissions의 capability로 분리.
-- =============================================================================

CREATE TABLE IF NOT EXISTS billing_period_closings (
  id TEXT PRIMARY KEY,
  period_type TEXT NOT NULL,           -- 'day' | 'month'
  period_key TEXT NOT NULL,            -- 'YYYY-MM-DD' | 'YYYY-MM'
  branch TEXT DEFAULT 'all',
  status TEXT NOT NULL DEFAULT 'closed', -- closed | reopened
  snapshot_json TEXT,
  closed_by TEXT,
  closed_at TEXT,
  reopened_by TEXT,
  reopened_at TEXT,
  reopen_reason TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_billing_period_closings_scope
  ON billing_period_closings(period_type, period_key, branch);
CREATE INDEX IF NOT EXISTS idx_billing_period_closings_status
  ON billing_period_closings(status);
CREATE INDEX IF NOT EXISTS idx_billing_period_closings_key
  ON billing_period_closings(period_key);
