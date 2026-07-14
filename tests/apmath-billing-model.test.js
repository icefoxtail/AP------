// 2026-07-14 LOOP 0 — 금액 불변식 계약 + SQL 정산 동작 테스트
// 계약 문서: docs/plans/APMATH_BILLING_DECISIONS.md §2
//  A) billing-settlement.js 순수 함수 불변식 (정상·부분납부·전액환불·부분환불·이월 유입·이월 유출·조정 경계)
//  B) buildPaymentSettlementUpdateQuery의 실제 SQL을 node:sqlite에서 실행 (동작형 검증, 정적 문자열 검사 아님)
//  C) 읽기 전용 감사 SQL — 상태값·NULL·고아 참조·중복 외부거래·정산 drift 탐지
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { DatabaseSync } = require('node:sqlite');

const root = path.resolve(__dirname, '..');
const workerDir = path.join(root, 'apmath/worker-backup/worker');
const settlementPath = path.join(workerDir, 'helpers/billing-settlement.js');
const routePath = path.join(workerDir, 'routes/billing-accounting-foundation.js');
const schemaSql = fs.readFileSync(path.join(workerDir, 'schema.sql'), 'utf8');
const hardeningMigrationSql = fs.readFileSync(
  path.join(workerDir, 'migrations/20260713_wangji_billing_transaction_hardening.sql'),
  'utf8'
);

function toFileUrl(p) {
  return String(new URL(`file:///${p.replace(/\\/g, '/')}`));
}

// 신규 설치(schema.sql) + 업그레이드(migration) 순서 적용 — LOOP 8 통합 검증의 축소 골격
function createDb() {
  const db = new DatabaseSync(':memory:');
  db.exec(schemaSql);
  db.exec(hardeningMigrationSql);
  return db;
}

function insertPayment(db, { id, student_id, year = 2026, month = 7, total_amount, paid_amount = 0, status = 'unpaid' }) {
  db.prepare(
    'INSERT INTO payments (id, student_id, year, month, total_amount, paid_amount, status) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(id, student_id, year, month, total_amount, paid_amount, status);
}

function insertTransaction(db, {
  id, payment_id = null, student_id, transaction_type = 'payment', amount,
  transaction_date = '2026-07-10', status = 'completed', method_key = 'cash',
  external_provider = null, external_transaction_id = null
}) {
  db.prepare(`
    INSERT INTO payment_transactions
      (id, payment_id, student_id, transaction_type, method_key, amount, transaction_date, status, external_provider, external_transaction_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, payment_id, student_id, transaction_type, method_key, amount, transaction_date, status, external_provider, external_transaction_id);
}

function insertRefund(db, { id, payment_id, payment_transaction_id = null, student_id, refund_amount, refund_date = '2026-07-12', status = 'completed' }) {
  db.prepare(`
    INSERT INTO refund_records (id, payment_id, payment_transaction_id, student_id, refund_amount, refund_date, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, payment_id, payment_transaction_id, student_id, refund_amount, refund_date, status);
}

function runSettlement(db, routeModule, paymentId) {
  const { sql, bindings } = routeModule.buildPaymentSettlementUpdateQuery(paymentId, '2026-07-14T00:00:00.000Z');
  db.prepare(sql).run(...bindings);
  return { ...db.prepare('SELECT paid_amount, status, paid_date FROM payments WHERE id = ?').get(paymentId) };
}

// ── C) 읽기 전용 감사 SQL (운영 D1에 그대로 복사해 조회만 실행 가능) ──
const AUDIT_QUERIES = {
  // 고아 참조
  orphan_transactions: `
    SELECT pt.id FROM payment_transactions pt
    WHERE pt.payment_id IS NOT NULL
      AND NOT EXISTS (SELECT 1 FROM payments p WHERE p.id = pt.payment_id)`,
  orphan_refunds: `
    SELECT rr.id FROM refund_records rr
    WHERE (rr.payment_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM payments p WHERE p.id = rr.payment_id))
       OR (rr.payment_transaction_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM payment_transactions pt WHERE pt.id = rr.payment_transaction_id))`,
  orphan_carryovers: `
    SELECT cr.id FROM carryover_records cr
    WHERE (cr.from_payment_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM payments p WHERE p.id = cr.from_payment_id))
       OR (cr.to_payment_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM payments p WHERE p.id = cr.to_payment_id))`,
  carryover_student_mismatch: `
    SELECT cr.id FROM carryover_records cr
    JOIN payments p ON p.id = cr.to_payment_id
    WHERE p.student_id <> cr.student_id`,
  orphan_auto_cashbook: `
    SELECT ce.id FROM cashbook_entries ce
    WHERE ce.source_type = 'payment_transaction'
      AND NOT EXISTS (SELECT 1 FROM payment_transactions pt WHERE pt.id = ce.payment_transaction_id)`,
  // 상태값·금액 이상
  invalid_payment_status: `
    SELECT p.id FROM payments p
    WHERE LOWER(COALESCE(p.status, '')) NOT IN ('unpaid', 'partial', 'paid')`,
  invalid_transaction_status: `
    SELECT pt.id FROM payment_transactions pt
    WHERE LOWER(COALESCE(pt.status, '')) NOT IN ('pending', 'completed', 'cancelled', 'failed', 'corrected')`,
  negative_or_null_amounts: `
    SELECT 'payment:' || p.id AS ref FROM payments p WHERE p.total_amount IS NULL OR p.total_amount < 0
    UNION ALL
    SELECT 'transaction:' || pt.id FROM payment_transactions pt WHERE pt.amount IS NULL OR pt.amount <= 0
    UNION ALL
    SELECT 'refund:' || rr.id FROM refund_records rr WHERE rr.refund_amount IS NULL OR rr.refund_amount <= 0`,
  // 중복 외부거래
  duplicate_external_transactions: `
    SELECT external_provider, external_transaction_id, COUNT(*) AS cnt
    FROM payment_transactions
    WHERE external_provider IS NOT NULL AND external_transaction_id IS NOT NULL AND status = 'completed'
    GROUP BY external_provider, external_transaction_id
    HAVING COUNT(*) > 1`,
  // 정산 drift — 현재 구현 산식(완료 유입 - 완료 환불) 기준으로 paid_amount 불일치 행 탐지.
  // 주의: carryover_out 미반영은 현행 구현의 알려진 격차(LOOP 4)이며 이 쿼리도 동일 산식을 사용한다.
  settlement_drift: `
    SELECT p.id, p.paid_amount AS stored, MIN(p.total_amount, MAX(
      COALESCE((SELECT SUM(pt.amount) FROM payment_transactions pt
        WHERE pt.payment_id = p.id AND pt.status = 'completed'
          AND pt.transaction_type IN ('payment', 'partial_payment', 'carryover_in')), 0)
      - COALESCE((SELECT SUM(rr.refund_amount) FROM refund_records rr
        WHERE rr.payment_id = p.id AND rr.status = 'completed'), 0), 0)) AS expected
    FROM payments p
    WHERE p.paid_amount <> MIN(p.total_amount, MAX(
      COALESCE((SELECT SUM(pt.amount) FROM payment_transactions pt
        WHERE pt.payment_id = p.id AND pt.status = 'completed'
          AND pt.transaction_type IN ('payment', 'partial_payment', 'carryover_in')), 0)
      - COALESCE((SELECT SUM(rr.refund_amount) FROM refund_records rr
        WHERE rr.payment_id = p.id AND rr.status = 'completed'), 0), 0))`
};

async function run() {
  const settlement = await import(toFileUrl(settlementPath));
  const routeModule = await import(toFileUrl(routePath));
  const {
    computeBillingInvariant,
    computeBilledAmount,
    computePaymentSettlement,
    toSignedSettlementAmount,
    SETTLEMENT_CREDIT_TYPES,
    SETTLEMENT_DEBIT_TYPES
  } = settlement;

  // ════ A. 순수 함수 불변식 ════
  // 계약의 거래 유형 분류 자체를 고정
  assert.deepStrictEqual(SETTLEMENT_CREDIT_TYPES, ['payment', 'partial_payment', 'carryover_in']);
  assert.deepStrictEqual(SETTLEMENT_DEBIT_TYPES, ['carryover_out']);

  // 1. 정상 완납
  assert.deepStrictEqual(
    computeBillingInvariant({ item_total: 300000, active_adjustment_total: 0, completed_inflow: 300000, completed_outflow: 0 }),
    { billed_amount: 300000, effective_paid: 300000, outstanding_amount: 0, overflow_amount: 0, status: 'paid' }
  );
  // 2. 부분납부
  assert.deepStrictEqual(
    computeBillingInvariant({ item_total: 300000, active_adjustment_total: 0, completed_inflow: 100000, completed_outflow: 0 }),
    { billed_amount: 300000, effective_paid: 100000, outstanding_amount: 200000, overflow_amount: 0, status: 'partial' }
  );
  // 3. 전액환불 → 미납 복귀
  assert.deepStrictEqual(
    computeBillingInvariant({ item_total: 300000, active_adjustment_total: 0, completed_inflow: 300000, completed_outflow: 300000 }),
    { billed_amount: 300000, effective_paid: 0, outstanding_amount: 300000, overflow_amount: 0, status: 'unpaid' }
  );
  // 4. 부분환불
  assert.deepStrictEqual(
    computeBillingInvariant({ item_total: 300000, active_adjustment_total: 0, completed_inflow: 300000, completed_outflow: 120000 }),
    { billed_amount: 300000, effective_paid: 180000, outstanding_amount: 120000, overflow_amount: 0, status: 'partial' }
  );
  // 5. 이월 유입 (carryover_in 50,000 + payment 250,000)
  assert.strictEqual(
    computeBillingInvariant({ item_total: 300000, active_adjustment_total: 0, completed_inflow: 250000 + 50000, completed_outflow: 0 }).status,
    'paid'
  );
  // 6. 이월 유출 (carryover_out 100,000 → 완납이 부분납부로)
  assert.deepStrictEqual(
    computeBillingInvariant({ item_total: 300000, active_adjustment_total: 0, completed_inflow: 300000, completed_outflow: 100000 }),
    { billed_amount: 300000, effective_paid: 200000, outstanding_amount: 100000, overflow_amount: 0, status: 'partial' }
  );
  // 7. 할인(음수 조정) 반영 후 완납
  assert.deepStrictEqual(
    computeBillingInvariant({ item_total: 300000, active_adjustment_total: -50000, completed_inflow: 250000, completed_outflow: 0 }),
    { billed_amount: 250000, effective_paid: 250000, outstanding_amount: 0, overflow_amount: 0, status: 'paid' }
  );
  // 8. 추가 청구(양수 조정) → 기존 완납액이 부분납부로
  assert.deepStrictEqual(
    computeBillingInvariant({ item_total: 300000, active_adjustment_total: 30000, completed_inflow: 300000, completed_outflow: 0 }),
    { billed_amount: 330000, effective_paid: 300000, outstanding_amount: 30000, overflow_amount: 0, status: 'partial' }
  );
  // 9. 조정이 항목 합계를 초과하는 음수 → 청구금액 0 (음수 청구 금지)
  assert.strictEqual(computeBilledAmount({ item_total: 100000, active_adjustment_total: -150000 }), 0);
  assert.strictEqual(
    computeBillingInvariant({ item_total: 100000, active_adjustment_total: -150000, completed_inflow: 0, completed_outflow: 0 }).status,
    'unpaid'
  );
  // 10. 0원 청구는 완납으로 표시하지 않음 (D-06 기본 동작)
  assert.strictEqual(
    computeBillingInvariant({ item_total: 0, active_adjustment_total: 0, completed_inflow: 0, completed_outflow: 0 }).status,
    'unpaid'
  );
  // 11. 초과 유입은 청구 한도로 clamp + 초과분 별도 보고
  assert.deepStrictEqual(
    computeBillingInvariant({ item_total: 300000, active_adjustment_total: 0, completed_inflow: 400000, completed_outflow: 0 }),
    { billed_amount: 300000, effective_paid: 300000, outstanding_amount: 0, overflow_amount: 100000, status: 'paid' }
  );
  // 12. 유출 > 유입이어도 유효수납은 0 밑으로 내려가지 않음
  assert.strictEqual(
    computeBillingInvariant({ item_total: 300000, active_adjustment_total: 0, completed_inflow: 100000, completed_outflow: 200000 }).effective_paid,
    0
  );
  // 13. 비정상 입력 안전 처리
  assert.strictEqual(toSignedSettlementAmount(NaN), 0);
  assert.strictEqual(toSignedSettlementAmount(-30000), -30000);
  assert.strictEqual(
    computeBillingInvariant({ item_total: NaN, active_adjustment_total: undefined, completed_inflow: null, completed_outflow: 'x' }).billed_amount,
    0
  );
  // 14. 보존식: 청구금액 = 유효수납 + 미수금 (모든 케이스)
  const conservationCases = [
    { item_total: 300000, active_adjustment_total: 0, completed_inflow: 0, completed_outflow: 0 },
    { item_total: 300000, active_adjustment_total: -50000, completed_inflow: 100000, completed_outflow: 30000 },
    { item_total: 300000, active_adjustment_total: 30000, completed_inflow: 400000, completed_outflow: 50000 },
    { item_total: 0, active_adjustment_total: 0, completed_inflow: 50000, completed_outflow: 0 }
  ];
  for (const c of conservationCases) {
    const r = computeBillingInvariant(c);
    assert.strictEqual(r.effective_paid + r.outstanding_amount, r.billed_amount, `보존식 위반: ${JSON.stringify(c)}`);
  }
  // 15. 기존 computePaymentSettlement와 의미 일치 (carryover_out=0인 범위)
  const legacy = computePaymentSettlement({ total_amount: 300000, credited_amount: 220000, refunded_amount: 40000 });
  const modern = computeBillingInvariant({ item_total: 300000, active_adjustment_total: 0, completed_inflow: 220000, completed_outflow: 40000 });
  assert.strictEqual(legacy.paid_amount, modern.effective_paid);
  assert.strictEqual(legacy.remaining_amount, modern.outstanding_amount);
  assert.strictEqual(legacy.status, modern.status);

  // ════ B. SQL 정산 동작 테스트 (schema.sql + hardening migration을 실제 적용) ════
  {
    const db = createDb();
    insertPayment(db, { id: 'pay_1', student_id: 'stu_1', total_amount: 300000 });

    // B-1. 부분납부
    insertTransaction(db, { id: 'tx_1', payment_id: 'pay_1', student_id: 'stu_1', transaction_type: 'partial_payment', amount: 100000, transaction_date: '2026-07-05' });
    let row = runSettlement(db, routeModule, 'pay_1');
    assert.deepStrictEqual(row, { paid_amount: 100000, status: 'partial', paid_date: null });

    // B-2. 완납 → paid_date는 실제 완료 수납일의 최댓값
    insertTransaction(db, { id: 'tx_2', payment_id: 'pay_1', student_id: 'stu_1', amount: 200000, transaction_date: '2026-07-10' });
    row = runSettlement(db, routeModule, 'pay_1');
    assert.deepStrictEqual(row, { paid_amount: 300000, status: 'paid', paid_date: '2026-07-10' });

    // B-3. 부분환불 → partial 복귀
    insertRefund(db, { id: 'rf_1', payment_id: 'pay_1', payment_transaction_id: 'tx_2', student_id: 'stu_1', refund_amount: 120000 });
    row = runSettlement(db, routeModule, 'pay_1');
    assert.deepStrictEqual(row, { paid_amount: 180000, status: 'partial', paid_date: null });

    // B-4. 전액환불 → unpaid 복귀
    insertRefund(db, { id: 'rf_2', payment_id: 'pay_1', payment_transaction_id: 'tx_1', student_id: 'stu_1', refund_amount: 180000 });
    row = runSettlement(db, routeModule, 'pay_1');
    assert.deepStrictEqual(row, { paid_amount: 0, status: 'unpaid', paid_date: null });

    // B-5. cancelled 거래는 유입에서 제외
    insertPayment(db, { id: 'pay_2', student_id: 'stu_2', total_amount: 200000 });
    insertTransaction(db, { id: 'tx_3', payment_id: 'pay_2', student_id: 'stu_2', amount: 200000, status: 'cancelled' });
    row = runSettlement(db, routeModule, 'pay_2');
    assert.deepStrictEqual(row, { paid_amount: 0, status: 'unpaid', paid_date: null });

    // B-6. carryover_in은 유입으로 인정
    insertTransaction(db, { id: 'tx_4', payment_id: 'pay_2', student_id: 'stu_2', transaction_type: 'carryover_in', amount: 200000, transaction_date: '2026-07-03' });
    row = runSettlement(db, routeModule, 'pay_2');
    assert.deepStrictEqual(row, { paid_amount: 200000, status: 'paid', paid_date: '2026-07-03' });

    // B-7. [KNOWN GAP — LOOP 4에서 해소] carryover_out이 아직 유출로 차감되지 않는다.
    // 불변식 계약(§A-6)은 차감을 요구한다. LOOP 4 구현 시 이 기대값을 'partial/100000'으로 교체해야 한다.
    insertTransaction(db, { id: 'tx_5', payment_id: 'pay_2', student_id: 'stu_2', transaction_type: 'carryover_out', amount: 100000, transaction_date: '2026-07-11' });
    row = runSettlement(db, routeModule, 'pay_2');
    assert.strictEqual(row.status, 'paid', 'carryover_out 반영이 구현되면 이 KNOWN GAP 테스트를 계약 기대값으로 교체할 것');

    // ════ C. 감사 SQL — 깨끗한 DB에서는 전부 0행 ════
    // (pay_2는 KNOWN GAP과 무관: drift 감사도 현행 산식을 사용하므로 0행이어야 함)
    for (const [name, sql] of Object.entries(AUDIT_QUERIES)) {
      const rows = db.prepare(sql).all();
      assert.strictEqual(rows.length, 0, `깨끗한 DB에서 감사 쿼리 '${name}'가 ${rows.length}행 반환: ${JSON.stringify(rows)}`);
    }
    db.close();
  }

  // C-2. 이상 데이터를 주입하면 각 감사 쿼리가 탐지해야 한다
  {
    const db = createDb();
    insertPayment(db, { id: 'pay_ok', student_id: 'stu_1', total_amount: 100000 });
    // 고아 거래
    insertTransaction(db, { id: 'tx_orphan', payment_id: 'pay_missing', student_id: 'stu_1', amount: 10000 });
    // 고아 환불
    insertRefund(db, { id: 'rf_orphan', payment_id: 'pay_missing', student_id: 'stu_1', refund_amount: 5000 });
    // 고아 이월 + 학생 불일치 이월
    db.prepare("INSERT INTO carryover_records (id, student_id, to_payment_id, amount) VALUES ('cr_orphan', 'stu_1', 'pay_missing', 1000)").run();
    db.prepare("INSERT INTO carryover_records (id, student_id, to_payment_id, amount) VALUES ('cr_mismatch', 'stu_OTHER', 'pay_ok', 1000)").run();
    // 고아 자동 장부
    db.prepare(`INSERT INTO cashbook_entries (id, entry_date, entry_type, category, amount, title, source_type, payment_transaction_id)
      VALUES ('cb_orphan', '2026-07-10', 'income', 'tuition', 10000, 'x', 'payment_transaction', 'tx_missing')`).run();
    // 잘못된 상태값
    insertPayment(db, { id: 'pay_badstatus', student_id: 'stu_1', total_amount: 100000, status: 'weird' });
    insertTransaction(db, { id: 'tx_badstatus', payment_id: 'pay_ok', student_id: 'stu_1', amount: 10000, status: 'bogus' });
    // 음수 금액
    insertPayment(db, { id: 'pay_neg', student_id: 'stu_1', total_amount: -1000 });
    // 중복 외부거래 ID
    insertTransaction(db, { id: 'tx_ext1', payment_id: null, student_id: 'stu_1', amount: 10000, external_provider: 'van', external_transaction_id: 'E-1' });
    insertTransaction(db, { id: 'tx_ext2', payment_id: null, student_id: 'stu_1', amount: 10000, external_provider: 'van', external_transaction_id: 'E-1' });
    // 정산 drift (paid_amount 수기 오염)
    insertPayment(db, { id: 'pay_drift', student_id: 'stu_1', total_amount: 100000, paid_amount: 99999, status: 'partial' });

    const expectDetected = {
      orphan_transactions: ['tx_orphan'],
      orphan_refunds: ['rf_orphan'],
      orphan_carryovers: ['cr_orphan'],
      carryover_student_mismatch: ['cr_mismatch'],
      orphan_auto_cashbook: ['cb_orphan'],
      invalid_payment_status: ['pay_badstatus'],
      invalid_transaction_status: ['tx_badstatus']
    };
    for (const [name, expectedIds] of Object.entries(expectDetected)) {
      const rows = db.prepare(AUDIT_QUERIES[name]).all();
      assert.deepStrictEqual(rows.map((r) => Object.values(r)[0]).sort(), expectedIds.sort(), `감사 쿼리 '${name}' 탐지 실패`);
    }
    const negRows = db.prepare(AUDIT_QUERIES.negative_or_null_amounts).all();
    assert.ok(negRows.some((r) => r.ref === 'payment:pay_neg'), '음수 금액 탐지 실패');
    const dupRows = db.prepare(AUDIT_QUERIES.duplicate_external_transactions).all();
    assert.strictEqual(dupRows.length, 1, '중복 외부거래 탐지 실패');
    assert.strictEqual(dupRows[0].cnt, 2);
    // pay_neg(음수 청구)도 drift 산식에 걸린다 — 손상 행이므로 탐지되는 것이 맞다.
    const driftRows = db.prepare(AUDIT_QUERIES.settlement_drift).all();
    assert.deepStrictEqual(driftRows.map((r) => r.id).sort(), ['pay_drift', 'pay_neg'], '정산 drift 탐지 실패');
    db.close();
  }

  console.log('apmath billing model tests passed');
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});

module.exports = { AUDIT_QUERIES };
