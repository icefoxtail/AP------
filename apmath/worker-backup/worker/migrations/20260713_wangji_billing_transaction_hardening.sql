-- =============================================================================
-- [WANGJI BILLING TRANSACTION HARDENING] - 2026-07-13
-- 목적: 수납 거래를 실제 원장 수준으로 보강
--   1) 멱등성 키(이중 저장 방지)
--   2) 취소 사유·시각 기록
--   3) 장부 자동 생성 항목의 출처 구분(source_type) 및 환불 연결
--   4) 수납·회계 감사 로그
-- 원칙: 기존 행 훼손 금지, ADD COLUMN + 신규 테이블만.
-- =============================================================================

ALTER TABLE payment_transactions ADD COLUMN idempotency_key TEXT;
ALTER TABLE payment_transactions ADD COLUMN cancelled_at TEXT;
ALTER TABLE payment_transactions ADD COLUMN cancel_reason TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_payment_transactions_idempotency
  ON payment_transactions(idempotency_key) WHERE idempotency_key IS NOT NULL;

-- status/is_active는 20260516_cashbook_entries_status_is_active.sql에서 이미 추가됨
ALTER TABLE cashbook_entries ADD COLUMN source_type TEXT;
ALTER TABLE cashbook_entries ADD COLUMN refund_record_id TEXT;
CREATE INDEX IF NOT EXISTS idx_cashbook_entries_source_type ON cashbook_entries(source_type);
CREATE INDEX IF NOT EXISTS idx_cashbook_entries_refund ON cashbook_entries(refund_record_id);

ALTER TABLE refund_records ADD COLUMN cancelled_at TEXT;
ALTER TABLE refund_records ADD COLUMN cancel_reason TEXT;

CREATE TABLE IF NOT EXISTS billing_audit_logs (
  id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  action TEXT NOT NULL,
  before_json TEXT,
  after_json TEXT,
  reason TEXT,
  actor_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_billing_audit_logs_entity ON billing_audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_billing_audit_logs_created ON billing_audit_logs(created_at);
