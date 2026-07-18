-- =============================================================================
-- [WANGJI BILLING ADJUSTMENT & CARRYOVER LEDGER] - 2026-07-14 (LOOP 4)
-- 목적: 할인·감면·추가청구(조정)와 이월을 원장 수준으로 보강
--   1) billing_adjustments: 상태·멱등키·취소 사유/시각·승인자 (원행 수정 대신 취소/반대 행)
--   2) carryover_records: 멱등키·취소 사유/시각·승인자 (기초 선수금 승인 추적)
--   3) payment_transactions.carryover_record_id: 이월 거래(carryover_in/out)와
--      이월 기록의 연결 → 취소 시 양쪽 반대 반영
-- 원칙: 기존 행 훼손 금지, ADD COLUMN + 인덱스만.
-- =============================================================================

ALTER TABLE billing_adjustments ADD COLUMN status TEXT DEFAULT 'active';
ALTER TABLE billing_adjustments ADD COLUMN idempotency_key TEXT;
ALTER TABLE billing_adjustments ADD COLUMN cancelled_at TEXT;
ALTER TABLE billing_adjustments ADD COLUMN cancel_reason TEXT;
ALTER TABLE billing_adjustments ADD COLUMN approved_by TEXT;
ALTER TABLE billing_adjustments ADD COLUMN updated_at DATETIME;
CREATE UNIQUE INDEX IF NOT EXISTS idx_billing_adjustments_idempotency
  ON billing_adjustments(idempotency_key) WHERE idempotency_key IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_billing_adjustments_status ON billing_adjustments(status);

ALTER TABLE carryover_records ADD COLUMN idempotency_key TEXT;
ALTER TABLE carryover_records ADD COLUMN cancelled_at TEXT;
ALTER TABLE carryover_records ADD COLUMN cancel_reason TEXT;
ALTER TABLE carryover_records ADD COLUMN approved_by TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_carryover_records_idempotency
  ON carryover_records(idempotency_key) WHERE idempotency_key IS NOT NULL;

ALTER TABLE payment_transactions ADD COLUMN carryover_record_id TEXT;
CREATE INDEX IF NOT EXISTS idx_payment_transactions_carryover
  ON payment_transactions(carryover_record_id);
