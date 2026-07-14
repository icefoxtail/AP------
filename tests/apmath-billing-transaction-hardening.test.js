// 2026-07-13 수납 거래 보강 회귀 테스트
// 1) 정산 계산(billing-settlement.js) 단위 검증
// 2) billing-accounting-foundation 라우트의 보강 지점 정적 검증
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const settlementPath = path.join(root, 'apmath/worker-backup/worker/helpers/billing-settlement.js');
const routePath = path.join(root, 'apmath/worker-backup/worker/routes/billing-accounting-foundation.js');
const migrationPath = path.join(root, 'apmath/worker-backup/worker/migrations/20260713_wangji_billing_transaction_hardening.sql');
const managementPath = path.join(root, 'apmath/js/management.js');

const routeSource = fs.readFileSync(routePath, 'utf8');
const migrationSource = fs.readFileSync(migrationPath, 'utf8');
const managementSource = fs.readFileSync(managementPath, 'utf8');

async function run() {
  // --- 단위: 정산 계산 ---
  const settlement = await import(String(new URL(`file:///${settlementPath.replace(/\\/g, '/')}`)));
  const routeModule = await import(String(new URL(`file:///${routePath.replace(/\\/g, '/')}`)));
  const {
    computePaymentSettlement,
    computeRefundableAmount,
    findImmutableFieldViolation,
    isDirectPaymentTransactionType
  } = settlement;

  // 부분 납부
  assert.deepStrictEqual(
    computePaymentSettlement({ total_amount: 300000, credited_amount: 100000, refunded_amount: 0 }),
    { paid_amount: 100000, remaining_amount: 200000, overpaid_amount: 0, status: 'partial' }
  );
  // 완납
  assert.strictEqual(
    computePaymentSettlement({ total_amount: 300000, credited_amount: 300000, refunded_amount: 0 }).status,
    'paid'
  );
  // 환불 후 미납 복귀
  assert.deepStrictEqual(
    computePaymentSettlement({ total_amount: 300000, credited_amount: 300000, refunded_amount: 300000 }),
    { paid_amount: 0, remaining_amount: 300000, overpaid_amount: 0, status: 'unpaid' }
  );
  // 초과 납부는 청구 한도로 자르고 초과분 별도 보고
  assert.deepStrictEqual(
    computePaymentSettlement({ total_amount: 300000, credited_amount: 350000, refunded_amount: 0 }),
    { paid_amount: 300000, remaining_amount: 0, overpaid_amount: 50000, status: 'paid' }
  );
  // 0원 청구는 완납으로 보지 않음(unpaid 유지)
  assert.strictEqual(
    computePaymentSettlement({ total_amount: 0, credited_amount: 0, refunded_amount: 0 }).status,
    'unpaid'
  );

  // 완료 거래 수정 가능 필드 검증
  assert.strictEqual(findImmutableFieldViolation({ note: 'x', receipt_no: '1' }), null);
  assert.strictEqual(findImmutableFieldViolation({ amount: 1000 }), 'amount');
  assert.strictEqual(findImmutableFieldViolation({ transaction_date: '2026-07-01' }), 'transaction_date');
  assert.strictEqual(isDirectPaymentTransactionType('payment'), true);
  assert.strictEqual(isDirectPaymentTransactionType('partial_payment'), true);
  assert.strictEqual(isDirectPaymentTransactionType('refund'), false);
  assert.strictEqual(isDirectPaymentTransactionType('cancel'), false);
  assert.strictEqual(isDirectPaymentTransactionType('carryover_out'), false);
  assert.strictEqual(computeRefundableAmount({ credited_amount: 300000, refunded_amount: 120000 }), 180000);
  assert.strictEqual(computeRefundableAmount({ credited_amount: 100000, refunded_amount: 150000 }), 0);

  const settlementUpdate = routeModule.buildPaymentSettlementUpdateQuery('payment_1', '2026-07-14T00:00:00.000Z');
  assert.strictEqual((settlementUpdate.sql.match(/\?/g) || []).length, settlementUpdate.bindings.length);
  assert.match(settlementUpdate.sql, /MAX\(pt\.transaction_date\)/);

  // --- 정적: 라우트 보강 지점 ---
  // 멱등성: clientRequestId/idempotency_key 소비 + 중복 시 기존 거래 반환
  assert.match(routeSource, /data\.clientRequestId/);
  assert.match(routeSource, /PAYMENT_DUPLICATE_IDEMPOTENCY_KEY/);
  // 초과 수납 가드
  assert.match(routeSource, /PAYMENT_OVER_ALLOCATED/);
  assert.match(routeSource, /PAYMENT_CONCURRENT_CONFLICT/);
  assert.match(routeSource, /COALESCE\(p\.paid_amount, 0\) \+ \? <= p\.total_amount/);
  assert.match(routeSource, /PAYMENT_STUDENT_MISMATCH/);
  assert.match(routeSource, /TRANSACTION_TYPE_USE_DEDICATED_FLOW/);
  assert.match(routeSource, /PAYMENT_STATUS_COMPLETED_REQUIRED/);
  assert.match(routeSource, /isDirectPaymentTransactionType\(requestedTransactionType\)/);
  assert.match(routeSource, /requestedStatus !== 'completed'/);
  assert.doesNotMatch(routeSource, /transactionType !== 'refund'/);
  // 원자적 배치 저장(거래+장부+감사)
  assert.match(routeSource, /env\.DB\.batch\(statements\)/);
  assert.match(routeSource, /auditLogStatement/);
  // 취소 사유 필수 + 연결 장부 동시 취소
  assert.match(routeSource, /CANCEL_REASON_REQUIRED/);
  assert.match(routeSource, /UPDATE cashbook_entries SET status = 'cancelled', is_active = 0[\s\S]*?payment_transaction_id = \?/);
  assert.match(routeSource, /UPDATE cashbook_entries SET status = 'cancelled', is_active = 0[\s\S]*?refund_record_id = \?/);
  // 완료 거래·환불 불변성
  assert.match(routeSource, /TRANSACTION_COMPLETED_READONLY/);
  assert.match(routeSource, /REFUND_COMPLETED_READONLY/);
  // 자동 장부 보호
  assert.match(routeSource, /CASHBOOK_AUTO_ENTRY_READONLY/);
  // 청구 정산 재계산
  assert.match(routeSource, /paymentSettlementUpdateStatement/);
  assert.match(routeSource, /MAX\(pt\.transaction_date\)/);
  assert.match(routeSource, /REFUND_AMOUNT_EXCEEDS_AVAILABLE/);
  assert.match(routeSource, /REFUND_CONCURRENT_CONFLICT/);
  assert.match(routeSource, /normalizeBranchForAccounting\(sourceTransaction\.branch, 'apmath'\)/);
  assert.match(routeSource, /REFUND_STUDENT_MISMATCH/);
  assert.match(routeSource, /REFUND_PAYMENT_REQUIRED/);
  assert.match(routeSource, /const sourcePaymentId = validateRequiredText\(sourceTransaction\.payment_id\)/);
  assert.match(routeSource, /WHERE payment_transaction_id = \? AND status = 'completed'/);
  // 감사 로그 조회
  assert.match(routeSource, /sub === 'audit-logs'/);

  // --- 정적: 마이그레이션 ---
  assert.match(migrationSource, /ADD COLUMN idempotency_key TEXT/);
  assert.match(migrationSource, /CREATE UNIQUE INDEX IF NOT EXISTS idx_payment_transactions_idempotency/);
  assert.match(migrationSource, /CREATE TABLE IF NOT EXISTS billing_audit_logs/);
  assert.match(migrationSource, /ADD COLUMN source_type TEXT/);
  assert.match(migrationSource, /ADD COLUMN refund_record_id TEXT/);
  // 이미 존재하는 컬럼 재추가 금지 (20260516에서 추가됨)
  assert.doesNotMatch(migrationSource, /cashbook_entries ADD COLUMN is_active/);
  assert.doesNotMatch(migrationSource, /cashbook_entries ADD COLUMN status/);

  // --- 정적: 프론트 취소 사유 ---
  assert.match(managementSource, /수납 취소 사유를 입력하세요/);
  assert.match(managementSource, /환불 취소 사유를 입력하세요/);
  assert.match(managementSource, /payment-transactions\/\$\{encodeURIComponent\(id\)\}\/cancel`, \{ reason \}/);
  assert.match(managementSource, /const options = \['payment', 'partial_payment'\]/);
  assert.match(managementSource, /const options = \['completed'\]/);

  console.log('apmath billing transaction hardening tests passed');
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
