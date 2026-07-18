// 2026-07-14 LOOP 2 — 월 청구 확정·일괄 생성·중복 방지 테스트 (동작형: mock D1 = node:sqlite)
//  1) 같은 멱등키 2회 → 실행 1건, 수강별 청구 1건
//  2) 다른 키 같은 연월/범위 → 409
//  3) 중간 batch 실패 후 재시작 → 누락·중복 0건 (체크포인트 재개)
//  4) 서버 재계산값과 생성된 payments/payment_items 합계 차이 0원
//  5) 동시 확정 요청 중 하나만 성공
//  6) 확정 청구 직접 수정 경로 없음(payments PATCH 405), 멱등키 범위 재사용 409
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { DatabaseSync } = require('node:sqlite');

const root = path.resolve(__dirname, '..');
const workerDir = path.join(root, 'apmath/worker-backup/worker');
const schemaSql = fs.readFileSync(path.join(workerDir, 'schema.sql'), 'utf8');
const migrations = [
  '20260713_wangji_billing_transaction_hardening.sql',
  '20260714_wangji_billing_runs_issuance.sql'
].map((name) => fs.readFileSync(path.join(workerDir, 'migrations', name), 'utf8'));

function toFileUrl(p) {
  return String(new URL(`file:///${p.replace(/\\/g, '/')}`));
}

// D1 mock — batch는 D1과 동일하게 트랜잭션(전부 반영 또는 전부 롤백)으로 동작.
// failAtBatchIndex: n번째 batch 호출을 실행 없이 실패시켜 "중간 실패"를 재현한다.
function createMockD1(db, options = {}) {
  const state = { batchCalls: 0, failAtBatchIndex: options.failAtBatchIndex ?? null };
  return {
    _state: state,
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
          db.prepare(this.sql).run(...this.bindings);
          return { success: true };
        }
      };
    },
    async batch(statements) {
      state.batchCalls += 1;
      if (state.failAtBatchIndex !== null && state.batchCalls === state.failAtBatchIndex) {
        throw new Error(`injected batch failure at call ${state.batchCalls}`);
      }
      db.exec('BEGIN');
      try {
        for (const s of statements) {
          db.prepare(s.sql).run(...s.bindings);
        }
        db.exec('COMMIT');
      } catch (error) {
        db.exec('ROLLBACK');
        throw error;
      }
      return statements.map(() => ({ success: true }));
    }
  };
}

// 기본 fixture: LOOP 1과 동일 구성 (청구서 7건, 합계 2,270,000)
const BASE = {
  students: [
    ['s01', '학생01'], ['s02', '학생02'], ['s03', '학생03'], ['s04', '학생04'], ['s05', '학생05'],
    ['s06', '학생06'], ['s07', '학생07'], ['s08', '학생08'], ['s09', '학생09'], ['s10', '학생10']
  ],
  classes: [['cA', '고2 심화'], ['cB', '고1 정규'], ['cC', '중3 기초'], ['cE', 'EIE 초급']],
  templates: [
    ['bt_A', 'apmath', 'cA', '고2 심화 수강료', 400000, 'tuition', 1],
    ['bt_A_book', 'apmath', 'cA', '고2 심화 교재비', 30000, 'textbook', 1],
    ['bt_B', 'apmath', 'cB', '고1 정규 수강료', 350000, 'tuition', 1]
  ],
  policyRules: [
    ['bpr_ap', 'apmath_default', 'apmath', 'tuition', 'AP Math 기본 수강료', '{"amount":300000}', 1]
  ],
  enrollments: [
    ['en01', 's01', 'apmath', 'cA', 'active', '2026-03-12', null, null],
    ['en02', 's02', 'apmath', 'cA', 'active', '2026-01-31', null, 380000],
    ['en03', 's03', 'apmath', 'cB', 'active', '2026-07-01', null, null],
    ['en04', 's04', 'apmath', 'cB', 'active', '2026-08-05', null, null],
    ['en05', 's05', 'apmath', 'cA', 'active', '2026-02-10', '2026-06-30', null],
    ['en06', 's06', 'apmath', 'cC', 'active', '2026-05-20', null, null],
    ['en07', 's07', 'apmath', 'cC', 'active', null, null, null],
    ['en08', 's08', 'eie', 'cE', 'active', '2026-04-15', null, null],
    ['en09', 's09', 'apmath', 'cC', 'active', '2026-06-01', null, 0],
    ['en10a', 's10', 'apmath', 'cA', 'active', '2026-03-05', null, null],
    ['en10b', 's10', 'apmath', 'cB', 'active', '2026-04-20', null, null]
  ]
};
const BASE_INVOICES = 7;
const BASE_ITEMS = 10;
const BASE_TOTAL = 2270000;

function seedDb(db, { extraStudents = 0 } = {}) {
  for (const [id, name] of BASE.students) db.prepare('INSERT INTO students (id, name) VALUES (?, ?)').run(id, name);
  for (const [id, name] of BASE.classes) db.prepare('INSERT INTO classes (id, name) VALUES (?, ?)').run(id, name);
  for (const t of BASE.templates) db.prepare('INSERT INTO billing_templates (id, branch, class_id, name, default_amount, item_type, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)').run(...t);
  for (const r of BASE.policyRules) db.prepare('INSERT INTO billing_policy_rules (id, rule_key, branch, rule_type, name, value_json, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)').run(...r);
  for (const e of BASE.enrollments) db.prepare('INSERT INTO student_enrollments (id, student_id, branch, class_id, status, start_date, end_date, tuition_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(...e);
  // 다중 batch 시나리오용 추가 수강생 (cB, 각 350,000)
  for (let i = 1; i <= extraStudents; i += 1) {
    const sid = `sx${String(i).padStart(2, '0')}`;
    db.prepare('INSERT INTO students (id, name) VALUES (?, ?)').run(sid, `추가${i}`);
    db.prepare('INSERT INTO student_enrollments (id, student_id, branch, class_id, status, start_date) VALUES (?, ?, ?, ?, ?, ?)')
      .run(`enx${String(i).padStart(2, '0')}`, sid, 'apmath', 'cB', 'active', '2026-04-10');
  }
}

function issuanceState(db, runId) {
  return {
    runs: db.prepare('SELECT COUNT(*) AS cnt FROM billing_runs').get().cnt,
    payments: db.prepare('SELECT COUNT(*) AS cnt, COALESCE(SUM(total_amount), 0) AS total FROM payments WHERE billing_run_id = ?').get(runId),
    items: db.prepare('SELECT COUNT(*) AS cnt, COALESCE(SUM(pi.amount), 0) AS total FROM payment_items pi JOIN payments p ON p.id = pi.payment_id WHERE p.billing_run_id = ?').get(runId),
    duplicateEnrollments: db.prepare('SELECT enrollment_id, COUNT(*) AS cnt FROM payments WHERE billing_run_id = ? GROUP BY enrollment_id HAVING COUNT(*) > 1').all(runId)
  };
}

async function callRoute(routeModule, env, { method = 'GET', sub, id = '', action = '', query = '', body = null, teacher = { id: 't_admin', role: 'admin' } }) {
  const url = new URL(`https://worker.local/api/billing-accounting-foundation/${sub}${query}`);
  const pathParts = ['api', 'billing-accounting-foundation', sub];
  if (id) pathParts.push(id);
  if (action) pathParts.push(action);
  const response = await routeModule.handleBillingAccountingFoundation({ method }, env, teacher, pathParts, url, body || {});
  return { status: response.status, body: await response.json() };
}

function newEnv(options = {}, seedOptions = {}) {
  const db = new DatabaseSync(':memory:');
  db.exec(schemaSql);
  for (const sql of migrations) db.exec(sql);
  seedDb(db, seedOptions);
  return { db, env: { DB: createMockD1(db, options) } };
}

async function run() {
  const routeModule = await import(toFileUrl(path.join(workerDir, 'routes/billing-accounting-foundation.js')));

  // ════ 1+4. 확정: 수강별 청구 1건, 서버 재계산 합계 차이 0원 ════
  {
    const { db, env } = newEnv();
    const confirm = await callRoute(routeModule, env, {
      method: 'POST', sub: 'billing-runs',
      body: { year: 2026, month: 7, branch: 'all', idempotency_key: 'run-2026-07-all' }
    });
    assert.strictEqual(confirm.status, 201, JSON.stringify(confirm.body));
    assert.strictEqual(confirm.body.already_confirmed, false);
    assert.strictEqual(confirm.body.created_count, BASE_INVOICES);
    assert.strictEqual(confirm.body.issued_count, BASE_INVOICES);
    assert.strictEqual(confirm.body.total_amount, BASE_TOTAL);
    assert.strictEqual(confirm.body.items_total, BASE_TOTAL); // 항목합계 = 청구합계 (확정 시 조정 0)
    const runId = confirm.body.billing_run.id;

    const state = issuanceState(db, runId);
    assert.strictEqual(state.runs, 1);
    assert.strictEqual(state.payments.cnt, BASE_INVOICES);
    assert.strictEqual(state.payments.total, BASE_TOTAL);
    assert.strictEqual(state.items.cnt, BASE_ITEMS);
    assert.strictEqual(state.items.total, BASE_TOTAL);
    assert.deepStrictEqual(state.duplicateEnrollments, []);

    // billing_runs에 DB 재계산 결과 저장
    const runRow = db.prepare('SELECT * FROM billing_runs WHERE id = ?').get(runId);
    assert.strictEqual(runRow.issued_count, BASE_INVOICES);
    assert.strictEqual(runRow.total_amount, BASE_TOTAL);
    assert.strictEqual(runRow.status, 'confirmed');
    assert.ok(runRow.confirmed_at, 'confirmed_at 누락');
    assert.ok(runRow.rule_snapshot_json, '규칙 스냅샷 누락');
    const snapshot = JSON.parse(runRow.rule_snapshot_json);
    assert.ok(snapshot.rule_version, '스냅샷 rule_version 누락');
    assert.strictEqual(snapshot.invoices.length, BASE_INVOICES);

    // 수강별 청구: due_date는 각 수강의 등원일 + 1개월 (D-11/D-02)
    const payEn02 = db.prepare('SELECT * FROM payments WHERE billing_run_id = ? AND enrollment_id = ?').get(runId, 'en02');
    assert.strictEqual(payEn02.due_date, '2026-08-31');
    assert.strictEqual(payEn02.total_amount, 410000);
    const payEn10a = db.prepare('SELECT * FROM payments WHERE billing_run_id = ? AND enrollment_id = ?').get(runId, 'en10a');
    const payEn10b = db.prepare('SELECT * FROM payments WHERE billing_run_id = ? AND enrollment_id = ?').get(runId, 'en10b');
    assert.strictEqual(payEn10a.due_date, '2026-08-05');
    assert.strictEqual(payEn10b.due_date, '2026-08-20');
    // 0원 청구는 unpaid 유지 (D-06 기본)
    const payEn09 = db.prepare('SELECT * FROM payments WHERE billing_run_id = ? AND enrollment_id = ?').get(runId, 'en09');
    assert.strictEqual(payEn09.total_amount, 0);
    assert.strictEqual(payEn09.status, 'unpaid');
    // 항목 근거(basis)가 note로 보존됨
    const itemNotes = db.prepare('SELECT pi.note AS note FROM payment_items pi JOIN payments p ON p.id = pi.payment_id WHERE p.billing_run_id = ?').all(runId);
    assert.ok(itemNotes.every((r) => r.note), '항목 적용 근거 누락');

    // ════ 1. 같은 멱등키 2회 → 실행 1건, 추가 생성 0건 ════
    const repeat = await callRoute(routeModule, env, {
      method: 'POST', sub: 'billing-runs',
      body: { year: 2026, month: 7, branch: 'all', idempotency_key: 'run-2026-07-all' }
    });
    assert.strictEqual(repeat.status, 200);
    assert.strictEqual(repeat.body.already_confirmed, true);
    assert.strictEqual(repeat.body.created_count, 0);
    assert.strictEqual(repeat.body.skipped_count, BASE_INVOICES);
    const stateAfterRepeat = issuanceState(db, runId);
    assert.deepStrictEqual(stateAfterRepeat, state, '멱등 재요청이 데이터를 변경함');

    // ════ 2. 다른 키, 같은 연월/범위 → 409 ════
    const conflict = await callRoute(routeModule, env, {
      method: 'POST', sub: 'billing-runs',
      body: { year: 2026, month: 7, branch: 'all', idempotency_key: 'run-2026-07-all-SECOND' }
    });
    assert.strictEqual(conflict.status, 409);
    assert.strictEqual(conflict.body.code, 'BILLING_RUN_SCOPE_CONFLICT');
    assert.strictEqual(issuanceState(db, runId).runs, 1);

    // ════ 6a. 멱등키를 다른 범위에 재사용 → 409 ════
    const scopeMismatch = await callRoute(routeModule, env, {
      method: 'POST', sub: 'billing-runs',
      body: { year: 2026, month: 8, branch: 'all', idempotency_key: 'run-2026-07-all' }
    });
    assert.strictEqual(scopeMismatch.status, 409);
    assert.strictEqual(scopeMismatch.body.code, 'BILLING_RUN_IDEMPOTENCY_SCOPE_MISMATCH');

    // ════ 6b. 확정된 청구 직접 수정 경로 없음 ════
    const patchPayment = await callRoute(routeModule, env, {
      method: 'PATCH', sub: 'payments', id: payEn02.id, body: { total_amount: 1 }
    });
    assert.strictEqual(patchPayment.status, 405);
    const patchItem = await callRoute(routeModule, env, {
      method: 'PATCH', sub: 'payment-items', id: `pi_${runId}_en02_0`, body: { amount: 1 }
    });
    assert.strictEqual(patchItem.status, 405);

    // 멱등키 없는 확정 → 400
    const noKey = await callRoute(routeModule, env, {
      method: 'POST', sub: 'billing-runs', body: { year: 2026, month: 9, branch: 'all' }
    });
    assert.strictEqual(noKey.status, 400);
    assert.strictEqual(noKey.body.code, 'BILLING_RUN_IDEMPOTENCY_KEY_REQUIRED');
    db.close();
  }

  // ════ 3. 중간 batch 실패 후 재시작 → 누락·중복 0건 ════
  {
    // 추가 25명 → 청구서 32건, 문장 67개 → batch 2회 이상. 두 번째 batch를 실패시킨다.
    const { db, env } = newEnv({ failAtBatchIndex: 2 }, { extraStudents: 25 });
    const expectedInvoices = BASE_INVOICES + 25;
    const expectedItems = BASE_ITEMS + 25;
    const expectedTotal = BASE_TOTAL + 25 * 350000;

    let failed = null;
    try {
      await callRoute(routeModule, env, {
        method: 'POST', sub: 'billing-runs',
        body: { year: 2026, month: 7, branch: 'all', idempotency_key: 'run-resume' }
      });
    } catch (error) {
      failed = error;
    }
    assert.ok(failed, '주입한 batch 실패가 발생하지 않음');
    const runRow = db.prepare('SELECT * FROM billing_runs WHERE idempotency_key = ?').get('run-resume');
    assert.ok(runRow, '실패 전 확정 체크포인트(billing_runs)가 없음');
    const partial = issuanceState(db, runRow.id);
    assert.ok(partial.payments.cnt > 0 && partial.payments.cnt < expectedInvoices, `부분 발행 상태가 아님: ${partial.payments.cnt}`);
    // 부분 상태에서도 발행된 청구는 payment+items가 온전해야 함 (청구서 단위 batch 보장)
    const tornInvoices = db.prepare(`
      SELECT p.id FROM payments p
      WHERE p.billing_run_id = ?
        AND p.total_amount <> COALESCE((SELECT SUM(pi.amount) FROM payment_items pi WHERE pi.payment_id = p.id), -1)
    `).all(runRow.id);
    assert.deepStrictEqual(tornInvoices, [], '부분 실패로 항목이 찢어진 청구 존재');

    // 같은 멱등키로 재시작
    const resume = await callRoute(routeModule, env, {
      method: 'POST', sub: 'billing-runs',
      body: { year: 2026, month: 7, branch: 'all', idempotency_key: 'run-resume' }
    });
    assert.strictEqual(resume.status, 200);
    assert.strictEqual(resume.body.already_confirmed, true);
    assert.strictEqual(resume.body.created_count + resume.body.skipped_count, expectedInvoices);
    const complete = issuanceState(db, runRow.id);
    assert.strictEqual(complete.runs, 1);
    assert.strictEqual(complete.payments.cnt, expectedInvoices, '재시작 후 누락 존재');
    assert.strictEqual(complete.payments.total, expectedTotal);
    assert.strictEqual(complete.items.cnt, expectedItems);
    assert.strictEqual(complete.items.total, expectedTotal);
    assert.deepStrictEqual(complete.duplicateEnrollments, [], '재시작 후 중복 발행 존재');
    const finalRun = db.prepare('SELECT issued_count, total_amount FROM billing_runs WHERE id = ?').get(runRow.id);
    assert.strictEqual(finalRun.issued_count, expectedInvoices);
    assert.strictEqual(finalRun.total_amount, expectedTotal);
    db.close();
  }

  // ════ 5. 동시 확정: 하나만 성공 ════
  {
    const { db, env } = newEnv();
    const [a, b] = await Promise.all([
      callRoute(routeModule, env, {
        method: 'POST', sub: 'billing-runs',
        body: { year: 2026, month: 7, branch: 'all', idempotency_key: 'concurrent-A' }
      }),
      callRoute(routeModule, env, {
        method: 'POST', sub: 'billing-runs',
        body: { year: 2026, month: 7, branch: 'all', idempotency_key: 'concurrent-B' }
      })
    ]);
    const statuses = [a.status, b.status].sort();
    assert.deepStrictEqual(statuses, [201, 409], `동시 확정 결과: ${a.status}/${b.status}`);
    assert.strictEqual(db.prepare("SELECT COUNT(*) AS cnt FROM billing_runs WHERE cancelled_at IS NULL").get().cnt, 1);
    const winner = a.status === 201 ? a : b;
    const state = issuanceState(db, winner.body.billing_run.id);
    assert.strictEqual(state.payments.cnt, BASE_INVOICES);
    assert.strictEqual(state.payments.total, BASE_TOTAL);
    assert.deepStrictEqual(state.duplicateEnrollments, []);
    db.close();
  }

  console.log('apmath billing issuance tests passed');
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
