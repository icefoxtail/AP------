// 2026-07-14 LOOP 4 — 할인·감면·환불·이월 원장 완결 테스트 (동작형: mock D1 = node:sqlite)
//  1) 할인 후 청구액·미수금 감소 / 할인 취소 후 원복
//  2) 추가 청구 후 완납 → 부분납부 복귀 (취소 시 완납 원복)
//  3) 이월 시 원청구/대상청구 합계 보존 / 이월 취소 시 양쪽 원복
//  4) 환불+이월 합계가 가용 원금을 넘으면 409/400 (통합 가용액 guard)
//  5) 동시 이월 요청 하나만 성공
//  6) carryover_out 정산 차감 (LOOP 0 KNOWN GAP 해소), 부호·사유·승인자·멱등키 검증
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { DatabaseSync } = require('node:sqlite');

const root = path.resolve(__dirname, '..');
const workerDir = path.join(root, 'apmath/worker-backup/worker');
const schemaSql = fs.readFileSync(path.join(workerDir, 'schema.sql'), 'utf8');
const migrations = [
  '20260713_wangji_billing_transaction_hardening.sql',
  '20260714_wangji_billing_runs_issuance.sql',
  '20260714_wangji_billing_adjustment_carryover_ledger.sql'
].map((name) => fs.readFileSync(path.join(workerDir, 'migrations', name), 'utf8'));

function toFileUrl(p) {
  return String(new URL(`file:///${p.replace(/\\/g, '/')}`));
}

// D1 mock — run/batch가 meta.changes를 반환하고 batch는 트랜잭션으로 동작한다.
function createMockD1(db) {
  return {
    prepare(sql) {
      return {
        sql,
        bindings: [],
        bind(...args) {
          this.bindings = args.map((v) => (v === undefined ? null : v));
          return this;
        },
        async all() {
          const rows = db.prepare(this.sql).all(...this.bindings);
          return { results: rows.map((r) => ({ ...r })) };
        },
        async first() {
          const row = db.prepare(this.sql).get(...this.bindings);
          return row ? { ...row } : null;
        },
        async run() {
          const result = db.prepare(this.sql).run(...this.bindings);
          return { success: true, meta: { changes: Number(result.changes) } };
        }
      };
    },
    async batch(statements) {
      db.exec('BEGIN');
      const results = [];
      try {
        for (const s of statements) {
          const result = db.prepare(s.sql).run(...s.bindings);
          results.push({ success: true, meta: { changes: Number(result.changes) } });
        }
        db.exec('COMMIT');
      } catch (error) {
        db.exec('ROLLBACK');
        throw error;
      }
      return results;
    }
  };
}

function newEnv() {
  const db = new DatabaseSync(':memory:');
  db.exec(schemaSql);
  for (const sql of migrations) db.exec(sql);
  db.prepare("INSERT INTO students (id, name) VALUES ('s01', '김수학'), ('s02', '이대수')").run();
  return { db, env: { DB: createMockD1(db) } };
}

function seedPayment(db, { id, student_id, total, paid = 0, status = 'unpaid' }) {
  db.prepare('INSERT INTO payments (id, student_id, year, month, total_amount, paid_amount, status) VALUES (?, ?, 2026, 7, ?, ?, ?)')
    .run(id, student_id, total, paid, status);
}

function seedCompletedPayment(db, routeModule, { paymentId, studentId, amount, date = '2026-07-05' }) {
  db.prepare(`
    INSERT INTO payment_transactions (id, payment_id, student_id, transaction_type, method_key, amount, transaction_date, status)
    VALUES (?, ?, ?, 'payment', 'cash', ?, ?, 'completed')
  `).run(`tx_${paymentId}_${amount}_${date}`, paymentId, studentId, amount, date);
  const { sql, bindings } = routeModule.buildPaymentSettlementUpdateQuery(paymentId, '2026-07-14T00:00:00.000Z');
  db.prepare(sql).run(...bindings);
}

function paymentRow(db, id) {
  return { ...db.prepare('SELECT id, total_amount, paid_amount, status FROM payments WHERE id = ?').get(id) };
}

async function callRoute(routeModule, env, { method = 'GET', sub, id = '', action = '', query = '', body = null }) {
  const url = new URL(`https://worker.local/api/billing-accounting-foundation/${sub}${query}`);
  const pathParts = ['api', 'billing-accounting-foundation', sub];
  if (id) pathParts.push(id);
  if (action) pathParts.push(action);
  const response = await routeModule.handleBillingAccountingFoundation({ method }, env, { id: 't_admin', role: 'admin' }, pathParts, url, body || {});
  return { status: response.status, body: await response.json() };
}

async function run() {
  const routeModule = await import(toFileUrl(path.join(workerDir, 'routes/billing-accounting-foundation.js')));

  // ════ 1. 조정: 할인·부호·음수 차단·멱등·취소 원복 ════
  {
    const { db, env } = newEnv();
    seedPayment(db, { id: 'payB', student_id: 's01', total: 200000 });

    // 부호·유형·사유 검증
    let r = await callRoute(routeModule, env, { method: 'POST', sub: 'billing-adjustments', body: { payment_id: 'payB', adjustment_type: 'discount', name: '할인', amount: 50000, reason: 'x' } });
    assert.strictEqual(r.body.code, 'ADJUSTMENT_SIGN_MISMATCH');
    r = await callRoute(routeModule, env, { method: 'POST', sub: 'billing-adjustments', body: { payment_id: 'payB', adjustment_type: 'charge', name: '추가', amount: -50000, reason: 'x' } });
    assert.strictEqual(r.body.code, 'ADJUSTMENT_SIGN_MISMATCH');
    r = await callRoute(routeModule, env, { method: 'POST', sub: 'billing-adjustments', body: { payment_id: 'payB', adjustment_type: 'weird', name: 'x', amount: -1000, reason: 'x' } });
    assert.strictEqual(r.body.code, 'ADJUSTMENT_TYPE_INVALID');
    r = await callRoute(routeModule, env, { method: 'POST', sub: 'billing-adjustments', body: { payment_id: 'payB', adjustment_type: 'discount', name: '할인', amount: -1000 } });
    assert.strictEqual(r.body.code, 'ADJUSTMENT_REASON_REQUIRED');
    r = await callRoute(routeModule, env, { method: 'POST', sub: 'billing-adjustments', body: { payment_id: 'payB', adjustment_type: 'discount', name: '할인', amount: 0, reason: 'x' } });
    assert.strictEqual(r.body.code, 'ADJUSTMENT_AMOUNT_INVALID');

    // 할인 -50,000 → 청구액·미수금 감소 (멱등키 포함)
    r = await callRoute(routeModule, env, {
      method: 'POST', sub: 'billing-adjustments',
      body: { payment_id: 'payB', adjustment_type: 'discount', name: '형제 할인', amount: -50000, reason: '형제 등록', idempotency_key: 'adj-1' }
    });
    assert.strictEqual(r.status, 200, JSON.stringify(r.body));
    const adjustmentId = r.body.id;
    assert.strictEqual(r.body.payment.total_amount, 150000);
    assert.strictEqual(r.body.payment.status, 'unpaid'); // 미수금 150,000

    // 같은 멱등키 재요청 → 행 1개 유지
    r = await callRoute(routeModule, env, {
      method: 'POST', sub: 'billing-adjustments',
      body: { payment_id: 'payB', adjustment_type: 'discount', name: '형제 할인', amount: -50000, reason: '형제 등록', idempotency_key: 'adj-1' }
    });
    assert.strictEqual(r.body.code, 'ADJUSTMENT_DUPLICATE_IDEMPOTENCY_KEY');
    assert.strictEqual(db.prepare('SELECT COUNT(*) AS cnt FROM billing_adjustments').get().cnt, 1);
    assert.strictEqual(paymentRow(db, 'payB').total_amount, 150000, '멱등 재요청이 금액을 중복 반영');

    // 음수 청구 차단
    r = await callRoute(routeModule, env, {
      method: 'POST', sub: 'billing-adjustments',
      body: { payment_id: 'payB', adjustment_type: 'discount', name: '과다 할인', amount: -200000, reason: 'x' }
    });
    assert.strictEqual(r.status, 409);
    assert.strictEqual(r.body.code, 'ADJUSTMENT_NEGATIVE_TOTAL');
    assert.strictEqual(paymentRow(db, 'payB').total_amount, 150000);

    // 원행 수정 금지
    r = await callRoute(routeModule, env, { method: 'PATCH', sub: 'billing-adjustments', id: adjustmentId, body: { amount: -10 } });
    assert.strictEqual(r.body.code, 'ADJUSTMENT_READONLY');

    // 취소 사유 필수 → 취소 → 원복 → 중복 취소 차단
    r = await callRoute(routeModule, env, { method: 'PATCH', sub: 'billing-adjustments', id: adjustmentId, action: 'cancel', body: {} });
    assert.strictEqual(r.body.code, 'CANCEL_REASON_REQUIRED');
    r = await callRoute(routeModule, env, { method: 'PATCH', sub: 'billing-adjustments', id: adjustmentId, action: 'cancel', body: { reason: '입력 착오' } });
    assert.strictEqual(r.status, 200);
    assert.strictEqual(r.body.payment.total_amount, 200000, '할인 취소 후 청구액 원복 실패');
    r = await callRoute(routeModule, env, { method: 'PATCH', sub: 'billing-adjustments', id: adjustmentId, action: 'cancel', body: { reason: 'again' } });
    assert.strictEqual(r.body.code, 'ALREADY_CANCELLED');
    // 감사 로그
    const audits = db.prepare("SELECT action FROM billing_audit_logs WHERE entity_type = 'billing_adjustment' AND entity_id = ? ORDER BY created_at").all(adjustmentId);
    assert.deepStrictEqual(audits.map((a) => a.action), ['create', 'cancel']);
    db.close();
  }

  // ════ 2. 추가 청구 → 완납이 부분납부로, 취소 시 완납 원복 (같은 batch 정산 재계산) ════
  {
    const { db, env } = newEnv();
    seedPayment(db, { id: 'payA', student_id: 's01', total: 300000 });
    seedCompletedPayment(db, routeModule, { paymentId: 'payA', studentId: 's01', amount: 300000 });
    assert.strictEqual(paymentRow(db, 'payA').status, 'paid');

    const r = await callRoute(routeModule, env, {
      method: 'POST', sub: 'billing-adjustments',
      body: { payment_id: 'payA', adjustment_type: 'textbook', name: '교재비', amount: 50000, reason: '교재 추가' }
    });
    assert.strictEqual(r.status, 200);
    let payA = paymentRow(db, 'payA');
    assert.strictEqual(payA.total_amount, 350000);
    assert.strictEqual(payA.status, 'partial', '추가 청구 후 완납이 부분납부로 바뀌지 않음');
    assert.strictEqual(payA.paid_amount, 300000);

    const cancel = await callRoute(routeModule, env, { method: 'PATCH', sub: 'billing-adjustments', id: r.body.id, action: 'cancel', body: { reason: '교재 반품' } });
    assert.strictEqual(cancel.status, 200);
    payA = paymentRow(db, 'payA');
    assert.strictEqual(payA.total_amount, 300000);
    assert.strictEqual(payA.status, 'paid', '조정 취소 후 완납 원복 실패');
    db.close();
  }

  // ════ 3. 이월: 합계 보존, carryover_out 정산 차감, 취소 시 양쪽 원복 ════
  {
    const { db, env } = newEnv();
    seedPayment(db, { id: 'payD', student_id: 's01', total: 300000 });
    seedCompletedPayment(db, routeModule, { paymentId: 'payD', studentId: 's01', amount: 300000 });
    seedPayment(db, { id: 'payB', student_id: 's01', total: 200000 });
    seedPayment(db, { id: 'payC', student_id: 's02', total: 100000 });

    // 학생 불일치
    let r = await callRoute(routeModule, env, {
      method: 'POST', sub: 'carryovers',
      body: { student_id: 's01', from_payment_id: 'payD', to_payment_id: 'payC', amount: 50000, carryover_type: 'credit', reason: 'x' }
    });
    assert.strictEqual(r.body.code, 'CARRYOVER_STUDENT_MISMATCH');
    // 사유 필수
    r = await callRoute(routeModule, env, {
      method: 'POST', sub: 'carryovers',
      body: { student_id: 's01', from_payment_id: 'payD', to_payment_id: 'payB', amount: 50000, carryover_type: 'credit' }
    });
    assert.strictEqual(r.body.code, 'CARRYOVER_REASON_REQUIRED');
    // 대상 수용 초과 (payB 남은 200,000 < 250,000)
    r = await callRoute(routeModule, env, {
      method: 'POST', sub: 'carryovers',
      body: { student_id: 's01', from_payment_id: 'payD', to_payment_id: 'payB', amount: 250000, carryover_type: 'credit', reason: 'x' }
    });
    assert.strictEqual(r.status, 409);
    assert.strictEqual(r.body.code, 'CARRYOVER_AMOUNT_EXCEEDS_AVAILABLE');

    // 정상 이월 150,000 (payD → payB)
    r = await callRoute(routeModule, env, {
      method: 'POST', sub: 'carryovers',
      body: { student_id: 's01', from_payment_id: 'payD', to_payment_id: 'payB', amount: 150000, carryover_type: 'credit', reason: '휴원으로 이월', idempotency_key: 'co-1' }
    });
    assert.strictEqual(r.status, 200, JSON.stringify(r.body));
    const carryoverId = r.body.id;
    let payD = paymentRow(db, 'payD');
    let payB = paymentRow(db, 'payB');
    // carryover_out이 유효수납에서 차감됨 (LOOP 0 KNOWN GAP 해소)
    assert.strictEqual(payD.paid_amount, 150000);
    assert.strictEqual(payD.status, 'partial');
    assert.strictEqual(payB.paid_amount, 150000);
    assert.strictEqual(payB.status, 'partial');
    // 합계 보존: 두 청구의 유효수납 합 = 이월 전(300,000)
    assert.strictEqual(payD.paid_amount + payB.paid_amount, 300000, '이월 시 합계 보존 위반');
    // 이월 거래 2건이 기록에 연결됨
    const linked = db.prepare("SELECT transaction_type, status FROM payment_transactions WHERE carryover_record_id = ? ORDER BY transaction_type").all(carryoverId);
    assert.deepStrictEqual(linked.map((t) => `${t.transaction_type}:${t.status}`), ['carryover_in:completed', 'carryover_out:completed']);

    // 같은 멱등키 재요청 → 중복 없음
    r = await callRoute(routeModule, env, {
      method: 'POST', sub: 'carryovers',
      body: { student_id: 's01', from_payment_id: 'payD', to_payment_id: 'payB', amount: 150000, carryover_type: 'credit', reason: 'x', idempotency_key: 'co-1' }
    });
    assert.strictEqual(r.body.code, 'CARRYOVER_DUPLICATE_IDEMPOTENCY_KEY');
    assert.strictEqual(db.prepare('SELECT COUNT(*) AS cnt FROM carryover_records').get().cnt, 1);
    assert.strictEqual(paymentRow(db, 'payD').paid_amount, 150000);

    // 이월 거래를 수납 취소 API로 한쪽만 취소하는 우회 차단
    const outTx = db.prepare("SELECT id FROM payment_transactions WHERE carryover_record_id = ? AND transaction_type = 'carryover_out'").get(carryoverId);
    r = await callRoute(routeModule, env, { method: 'PATCH', sub: 'transactions', id: outTx.id, action: 'cancel', body: { reason: 'x' } });
    assert.strictEqual(r.body.code, 'USE_CARRYOVER_CANCEL_FLOW');

    // 이월 수정 금지
    r = await callRoute(routeModule, env, { method: 'PATCH', sub: 'carryovers', id: carryoverId, body: { amount: 1 } });
    assert.strictEqual(r.body.code, 'CARRYOVER_READONLY');

    // 이월 취소 → 양쪽 원복
    r = await callRoute(routeModule, env, { method: 'PATCH', sub: 'carryovers', id: carryoverId, action: 'cancel', body: {} });
    assert.strictEqual(r.body.code, 'CANCEL_REASON_REQUIRED');
    r = await callRoute(routeModule, env, { method: 'PATCH', sub: 'carryovers', id: carryoverId, action: 'cancel', body: { reason: '이월 착오' } });
    assert.strictEqual(r.status, 200, JSON.stringify(r.body));
    payD = paymentRow(db, 'payD');
    payB = paymentRow(db, 'payB');
    assert.strictEqual(payD.paid_amount, 300000, '이월 취소 후 원청구 원복 실패');
    assert.strictEqual(payD.status, 'paid');
    assert.strictEqual(payB.paid_amount, 0, '이월 취소 후 대상청구 원복 실패');
    assert.strictEqual(payB.status, 'unpaid');
    const cancelledTx = db.prepare('SELECT COUNT(*) AS cnt FROM payment_transactions WHERE carryover_record_id = ? AND status = ?').get(carryoverId, 'cancelled');
    assert.strictEqual(cancelledTx.cnt, 2, '이월 거래 양쪽 취소 실패');
    r = await callRoute(routeModule, env, { method: 'PATCH', sub: 'carryovers', id: carryoverId, action: 'cancel', body: { reason: 'again' } });
    assert.strictEqual(r.body.code, 'ALREADY_CANCELLED');
    db.close();
  }

  // ════ 4. 환불+이월 통합 가용액 guard ════
  {
    const { db, env } = newEnv();
    seedPayment(db, { id: 'payD', student_id: 's01', total: 300000 });
    seedCompletedPayment(db, routeModule, { paymentId: 'payD', studentId: 's01', amount: 300000 });
    seedPayment(db, { id: 'payB', student_id: 's01', total: 200000 });

    // 이월 150,000 → 가용 150,000
    let r = await callRoute(routeModule, env, {
      method: 'POST', sub: 'carryovers',
      body: { student_id: 's01', from_payment_id: 'payD', to_payment_id: 'payB', amount: 150000, carryover_type: 'credit', reason: 'x' }
    });
    assert.strictEqual(r.status, 200);
    // 환불 100,000 → 가용 50,000
    r = await callRoute(routeModule, env, {
      method: 'POST', sub: 'refunds',
      body: { student_id: 's01', payment_id: 'payD', refund_amount: 100000, refund_date: '2026-07-13', reason: '일부 환불' }
    });
    assert.strictEqual(r.status, 200, JSON.stringify(r.body));
    assert.strictEqual(paymentRow(db, 'payD').paid_amount, 50000);
    // 이월 60,000 → 가용 50,000 초과 → 409
    r = await callRoute(routeModule, env, {
      method: 'POST', sub: 'carryovers',
      body: { student_id: 's01', from_payment_id: 'payD', amount: 60000, carryover_type: 'credit', reason: 'x' }
    });
    assert.strictEqual(r.status, 409);
    assert.strictEqual(r.body.code, 'CARRYOVER_AMOUNT_EXCEEDS_AVAILABLE');
    // 환불 60,000 → 가용 50,000 초과 → 400 (환불 가용액이 이월을 반영)
    r = await callRoute(routeModule, env, {
      method: 'POST', sub: 'refunds',
      body: { student_id: 's01', payment_id: 'payD', refund_amount: 60000, refund_date: '2026-07-13', reason: 'x' }
    });
    assert.strictEqual(r.status, 400);
    assert.strictEqual(r.body.code, 'REFUND_AMOUNT_EXCEEDS_AVAILABLE');
    assert.strictEqual(r.body.refundable_amount, 50000);
    // 잔여 50,000은 이월 가능
    r = await callRoute(routeModule, env, {
      method: 'POST', sub: 'carryovers',
      body: { student_id: 's01', from_payment_id: 'payD', amount: 50000, carryover_type: 'credit', reason: '잔액 이월 보관' }
    });
    assert.strictEqual(r.status, 200);
    assert.strictEqual(paymentRow(db, 'payD').paid_amount, 0);
    db.close();
  }

  // ════ 5. 이월 취소 conflict: 대상에서 이미 환불로 소진된 이월은 취소 불가 ════
  {
    const { db, env } = newEnv();
    seedPayment(db, { id: 'payD', student_id: 's01', total: 300000 });
    seedCompletedPayment(db, routeModule, { paymentId: 'payD', studentId: 's01', amount: 300000 });
    seedPayment(db, { id: 'payB', student_id: 's01', total: 200000 });
    let r = await callRoute(routeModule, env, {
      method: 'POST', sub: 'carryovers',
      body: { student_id: 's01', from_payment_id: 'payD', to_payment_id: 'payB', amount: 150000, carryover_type: 'credit', reason: 'x' }
    });
    const carryoverId = r.body.id;
    // 대상 청구에서 이월 유입분 전액 환불
    r = await callRoute(routeModule, env, {
      method: 'POST', sub: 'refunds',
      body: { student_id: 's01', payment_id: 'payB', refund_amount: 150000, refund_date: '2026-07-13', reason: '퇴원 환불' }
    });
    assert.strictEqual(r.status, 200, JSON.stringify(r.body));
    // 이월 취소 시도 → 대상 유효수납이 부족 → 409
    r = await callRoute(routeModule, env, { method: 'PATCH', sub: 'carryovers', id: carryoverId, action: 'cancel', body: { reason: 'x' } });
    assert.strictEqual(r.status, 409);
    assert.strictEqual(r.body.code, 'CARRYOVER_CANCEL_CONFLICT');
    db.close();
  }

  // ════ 6. 기초 선수금(opening_balance): 승인자·원청구 없음 강제 ════
  {
    const { db, env } = newEnv();
    seedPayment(db, { id: 'payB', student_id: 's01', total: 200000 });
    let r = await callRoute(routeModule, env, {
      method: 'POST', sub: 'carryovers',
      body: { student_id: 's01', to_payment_id: 'payB', amount: 80000, carryover_type: 'opening_balance', reason: '기존 장부 선수금' }
    });
    assert.strictEqual(r.body.code, 'CARRYOVER_APPROVER_REQUIRED');
    r = await callRoute(routeModule, env, {
      method: 'POST', sub: 'carryovers',
      body: { student_id: 's01', from_payment_id: 'payX', to_payment_id: 'payB', amount: 80000, carryover_type: 'opening_balance', reason: 'x', approved_by: '원장' }
    });
    assert.strictEqual(r.body.code, 'CARRYOVER_OPENING_NO_SOURCE');
    r = await callRoute(routeModule, env, {
      method: 'POST', sub: 'carryovers',
      body: { student_id: 's01', to_payment_id: 'payB', amount: 80000, carryover_type: 'opening_balance', reason: '기존 장부 선수금 이관', approved_by: '원장' }
    });
    assert.strictEqual(r.status, 200, JSON.stringify(r.body));
    assert.strictEqual(paymentRow(db, 'payB').paid_amount, 80000);
    const record = db.prepare('SELECT approved_by, carryover_type FROM carryover_records WHERE id = ?').get(r.body.id);
    assert.strictEqual(record.approved_by, '원장');
    assert.strictEqual(record.carryover_type, 'opening_balance');
    db.close();
  }

  // ════ 7. 동시 이월: 하나만 성공 ════
  {
    const { db, env } = newEnv();
    seedPayment(db, { id: 'payD', student_id: 's01', total: 300000 });
    seedCompletedPayment(db, routeModule, { paymentId: 'payD', studentId: 's01', amount: 300000 });
    seedPayment(db, { id: 'payB', student_id: 's01', total: 200000 });
    seedPayment(db, { id: 'payE', student_id: 's01', total: 200000 });
    const [a, b] = await Promise.all([
      callRoute(routeModule, env, {
        method: 'POST', sub: 'carryovers',
        body: { student_id: 's01', from_payment_id: 'payD', to_payment_id: 'payB', amount: 200000, carryover_type: 'credit', reason: 'A', idempotency_key: 'co-A' }
      }),
      callRoute(routeModule, env, {
        method: 'POST', sub: 'carryovers',
        body: { student_id: 's01', from_payment_id: 'payD', to_payment_id: 'payE', amount: 200000, carryover_type: 'credit', reason: 'B', idempotency_key: 'co-B' }
      })
    ]);
    const statuses = [a.status, b.status].sort();
    assert.deepStrictEqual(statuses, [200, 409], `동시 이월 결과: ${a.status}/${b.status}`);
    assert.strictEqual(db.prepare("SELECT COUNT(*) AS cnt FROM carryover_records WHERE status = 'active'").get().cnt, 1);
    // 가용액(300,000)을 넘는 총 이월이 발생하지 않음
    const outSum = db.prepare("SELECT COALESCE(SUM(amount), 0) AS total FROM payment_transactions WHERE transaction_type = 'carryover_out' AND status = 'completed'").get().total;
    assert.strictEqual(outSum, 200000);
    db.close();
  }

  console.log('apmath billing adjustment/carryover tests passed');
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
