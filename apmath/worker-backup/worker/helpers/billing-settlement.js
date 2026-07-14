// 수납 정산 계산 헬퍼.
// payments(청구)의 paid_amount/status는 이 모듈의 계산 결과로만 갱신한다.
// (수납 거래·환불 원장에서 합산 → 청구 반영. 직접 수기 갱신 금지)

export function toSettlementAmount(value) {
  const amount = Number(value || 0);
  if (!Number.isFinite(amount)) return 0;
  return Math.max(0, Math.round(amount));
}

// 청구에 배분되는 거래 유형: 납부로 취급되는 것만.
export const SETTLEMENT_CREDIT_TYPES = ['payment', 'partial_payment', 'carryover_in'];

// 일반 수납 입력 화면에서 새로 만들 수 있는 거래만 허용한다.
// refund/cancel/correction/carryover는 각각 전용 원장을 사용한다.
export const DIRECT_PAYMENT_TRANSACTION_TYPES = ['payment', 'partial_payment'];

export function isDirectPaymentTransactionType(value) {
  return DIRECT_PAYMENT_TRANSACTION_TYPES.includes(String(value || '').trim());
}

// 완료된 수납 거래는 금액·수단·일자·대상은 수정 불가. 취소 후 재입력만 허용.
export const TRANSACTION_MUTABLE_FIELDS_WHEN_COMPLETED = ['receipt_no', 'external_provider', 'external_transaction_id', 'note'];

export function computePaymentSettlement({ total_amount, credited_amount, refunded_amount }) {
  const total = toSettlementAmount(total_amount);
  const credited = toSettlementAmount(credited_amount);
  const refunded = toSettlementAmount(refunded_amount);
  const effectivePaid = Math.max(credited - refunded, 0);
  const paidAmount = Math.min(effectivePaid, total);
  const remaining = Math.max(total - effectivePaid, 0);
  let status = 'unpaid';
  if (total > 0 && remaining <= 0) status = 'paid';
  else if (paidAmount > 0) status = 'partial';
  return {
    paid_amount: paidAmount,
    remaining_amount: remaining,
    overpaid_amount: Math.max(effectivePaid - total, 0),
    status
  };
}

export function computeRefundableAmount({ credited_amount, refunded_amount }) {
  return Math.max(toSettlementAmount(credited_amount) - toSettlementAmount(refunded_amount), 0);
}

// 완료 거래 PATCH에서 금지 필드가 섞였는지 검사한다.
export function findImmutableFieldViolation(patch) {
  const keys = Object.keys(patch || {});
  return keys.find((key) => !TRANSACTION_MUTABLE_FIELDS_WHEN_COMPLETED.includes(key)) || null;
}

// ── 금액 불변식 계약 (LOOP 0에서 고정, docs/plans/APMATH_BILLING_DECISIONS.md §2) ──
// 청구금액 = max(0, 청구항목 합계 + 활성 조정금액 합계)
// 완료 유입 = payment + partial_payment + carryover_in
// 완료 유출 = completed refund + carryover_out
// 유효수납 = clamp(유입 - 유출, 0, 청구금액)
// 미수금   = max(청구금액 - 유효수납, 0)

// 청구 유효수납에서 차감되는 유출 거래 유형(환불은 refund_records 원장 사용).
export const SETTLEMENT_DEBIT_TYPES = ['carryover_out'];

// 조정금액은 부호를 보존한다(할인·감면 음수, 추가 청구 양수).
export function toSignedSettlementAmount(value) {
  const amount = Number(value || 0);
  if (!Number.isFinite(amount)) return 0;
  return Math.round(amount);
}

export function computeBilledAmount({ item_total, active_adjustment_total }) {
  const items = toSettlementAmount(item_total);
  const adjustments = toSignedSettlementAmount(active_adjustment_total);
  return Math.max(0, items + adjustments);
}

export function computeBillingInvariant({ item_total, active_adjustment_total, completed_inflow, completed_outflow }) {
  const billed = computeBilledAmount({ item_total, active_adjustment_total });
  const inflow = toSettlementAmount(completed_inflow);
  const outflow = toSettlementAmount(completed_outflow);
  const netInflow = Math.max(inflow - outflow, 0);
  const effectivePaid = Math.min(netInflow, billed);
  const outstanding = Math.max(billed - effectivePaid, 0);
  let status = 'unpaid';
  if (billed > 0 && effectivePaid >= billed) status = 'paid';
  else if (effectivePaid > 0) status = 'partial';
  return {
    billed_amount: billed,
    effective_paid: effectivePaid,
    outstanding_amount: outstanding,
    overflow_amount: Math.max(netInflow - billed, 0),
    status
  };
}
