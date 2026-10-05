-- =============================================================================
-- [WANGJI BILLING RUNS ISSUANCE] - 2026-07-14 (LOOP 2)
-- 목적: 월 청구 확정·일괄 생성의 DB 방어선
--   1) billing_runs: 범위 키·규칙 스냅샷·멱등키·확정/취소 이력
--   2) 청구 실행 멱등키 unique (같은 key 재요청 = 기존 실행 반환)
--   3) 같은 연월/범위의 활성(미취소) 실행 중복 방지
--   4) payments: 수강(enrollment) 연결 + (billing_run_id, enrollment_id) unique
--      → D-11(수강별 별도 청구) 기준 중복 발행 차단, 중간 실패 재개 시 멱등 삽입
-- 원칙: 기존 행 훼손 금지, ADD COLUMN + 인덱스만.
-- =============================================================================

ALTER TABLE billing_runs ADD COLUMN scope_key TEXT;
ALTER TABLE billing_runs ADD COLUMN rule_snapshot_json TEXT;
ALTER TABLE billing_runs ADD COLUMN idempotency_key TEXT;
ALTER TABLE billing_runs ADD COLUMN confirmed_at TEXT;
ALTER TABLE billing_runs ADD COLUMN confirmed_by TEXT;
ALTER TABLE billing_runs ADD COLUMN cancelled_at TEXT;
ALTER TABLE billing_runs ADD COLUMN cancel_reason TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_billing_runs_idempotency
  ON billing_runs(idempotency_key) WHERE idempotency_key IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_billing_runs_active_scope
  ON billing_runs(scope_key) WHERE scope_key IS NOT NULL AND cancelled_at IS NULL;

ALTER TABLE payments ADD COLUMN enrollment_id TEXT;
CREATE INDEX IF NOT EXISTS idx_payments_enrollment ON payments(enrollment_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_run_enrollment
  ON payments(billing_run_id, enrollment_id)
  WHERE billing_run_id IS NOT NULL AND enrollment_id IS NOT NULL;
