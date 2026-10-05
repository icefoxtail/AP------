// 2026-07-15 LOOP 6 — 내부 납부확인서 테스트 (동작형: mock D1 + vm 렌더러)
//  1) 표본 5건(완납/부분/환불/이월유출/0원) 출력 금액과 원장 차이 0원
//  2) 문서 번호 unique(중복 방지·동시 발급 재시도)
//  3) 다른 학생 문서 접근 차단
//  4) 발급 후 원거래 메모 변경에도 스냅샷 유지
//  5) 재발급(superseded 연결)·취소(사유 필수) 이력 추적, 발급 문서 수정 금지
//  6) receipt_sent_at은 발급으로 갱신되지 않음
//  7) A4 인쇄 HTML: 내부 확인용 표기·빈 필드 '-'·overflow 방지
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const vm = require('vm');
const { DatabaseSync } = require('node:sqlite');

const root = path.resolve(__dirname, '..');
const workerDir = path.join(root, 'apmath/worker-backup/worker');
const schemaSql = fs.readFileSync(path.join(workerDir, 'schema.sql'), 'utf8');
const managementSource = fs.readFileSync(path.join(root, 'apmath/js/management.js'), 'utf8');
const migrations = [
  '20260713_wangji_billing_transaction_hardening.sql',
  '20260714_wangji_billing_runs_issuance.sql',
  '20260714_wangji_billing_adjustment_carryover_ledger.sql',
  '20260714_wangji_billing_period_closings.sql',
  '20260715_wangji_billing_documents.sql'
].map((name) => fs.readFileSync(path.join(workerDir, 'migrations', name), 'utf8'));

function toFileUrl(p) {
  return String(new URL(`file:///${p.replace(/\\/g, '/')}`));
}

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

const ADMIN = { id: 't_admin', role: 'admin' };
const COLLECTOR = { id: 't_col', role: 'teacher' };
const VIEWER = { id: 't_view', role: 'teacher' };

function newEnv() {
  const db = new DatabaseSync(':memory:');
  db.exec(schemaSql);
  for (const sql of migrations) db.exec(sql);
  db.prepare("INSERT INTO students (id, name) VALUES ('s01', '김수학'), ('s02', '이대수')").run();
  [['t_col', 'billing.read'], ['t_col', 'billing.collect'], ['t_view', 'billing.read']].forEach(([tid, key], i) => {
    db.prepare('INSERT INTO staff_permissions (id, teacher_id, permission_key, allowed) VALUES (?, ?, ?, 1)').run(`sp_${i}`, tid, key);
  });
  return { db, env: { DB: createMockD1(db) } };
}

function seedPayment(db, { id, student_id = 's01', total, year = 2026, month = 7, itemName = '수강료' }) {
  db.prepare('INSERT INTO payments (id, student_id, year, month, total_amount, paid_amount, status, due_date) VALUES (?, ?, ?, ?, ?, 0, ?, ?)')
    .run(id, student_id, year, month, total, 'unpaid', `${year}-${String(month).padStart(2, '0')}-15`);
  db.prepare('INSERT INTO payment_items (id, payment_id, name, amount, item_type) VALUES (?, ?, ?, ?, ?)')
    .run(`pi_${id}`, id, itemName, total, 'tuition');
}

function settle(db, routeModule, paymentId) {
  const { sql, bindings } = routeModule.buildPaymentSettlementUpdateQuery(paymentId, '2026-07-15T00:00:00.000Z');
  db.prepare(sql).run(...bindings);
}

function seedTx(db, routeModule, { paymentId, type = 'payment', amount, date = '2026-07-05' }) {
  db.prepare(`
    INSERT INTO payment_transactions (id, payment_id, student_id, transaction_type, method_key, amount, transaction_date, status)
    SELECT ?, ?, p.student_id, ?, 'cash', ?, ?, 'completed' FROM payments p WHERE p.id = ?
  `).run(`tx_${paymentId}_${type}_${amount}`, paymentId, type, amount, date, paymentId);
  settle(db, routeModule, paymentId);
}

function seedRefund(db, routeModule, { paymentId, amount, date = '2026-07-08' }) {
  db.prepare(`
    INSERT INTO refund_records (id, payment_id, student_id, refund_amount, refund_date, status)
    SELECT ?, ?, p.student_id, ?, ?, 'completed' FROM payments p WHERE p.id = ?
  `).run(`rf_${paymentId}_${amount}`, paymentId, amount, date, paymentId);
  settle(db, routeModule, paymentId);
}

async function callRoute(routeModule, env, teacher, { method = 'GET', sub, id = '', action = '', query = '', body = null }) {
  const url = new URL(`https://worker.local/api/billing-accounting-foundation/${sub}${query}`);
  const pathParts = ['api', 'billing-accounting-foundation', sub];
  if (id) pathParts.push(id);
  if (action) pathParts.push(action);
  const response = await routeModule.handleBillingAccountingFoundation({ method }, env, teacher, pathParts, url, body || {});
  return { status: response.status, body: await response.json() };
}

async function run() {
  const routeModule = await import(toFileUrl(path.join(workerDir, 'routes/billing-accounting-foundation.js')));

  // ════ 1+6. 표본 5건 출력 금액 = 원장, receipt_sent_at 미갱신 ════
  {
    const { db, env } = newEnv();
    seedPayment(db, { id: 'payFull', total: 300000 });
    seedTx(db, routeModule, { paymentId: 'payFull', amount: 300000 });
    seedPayment(db, { id: 'payPartial', total: 300000 });
    seedTx(db, routeModule, { paymentId: 'payPartial', type: 'partial_payment', amount: 100000 });
    seedPayment(db, { id: 'payRefund', total: 300000 });
    seedTx(db, routeModule, { paymentId: 'payRefund', amount: 300000 });
    seedRefund(db, routeModule, { paymentId: 'payRefund', amount: 100000 });
    seedPayment(db, { id: 'payCarry', total: 300000 });
    seedTx(db, routeModule, { paymentId: 'payCarry', amount: 300000 });
    seedTx(db, routeModule, { paymentId: 'payCarry', type: 'carryover_out', amount: 150000, date: '2026-07-09' });
    seedPayment(db, { id: 'payZero', total: 300000 });

    const expected = { payFull: 300000, payPartial: 100000, payRefund: 200000, payCarry: 150000, payZero: 0 };
    for (const [paymentId, amount] of Object.entries(expected)) {
      const r = await callRoute(routeModule, env, COLLECTOR, { method: 'POST', sub: 'documents', body: { payment_id: paymentId, student_id: 's01' } });
      assert.strictEqual(r.status, 201, `${paymentId}: ${JSON.stringify(r.body)}`);
      assert.strictEqual(r.body.document.amount, amount, `${paymentId} 문서 금액 불일치`);
      const ledger = db.prepare('SELECT paid_amount FROM payments WHERE id = ?').get(paymentId);
      assert.strictEqual(r.body.document.amount, ledger.paid_amount, `${paymentId} 원장 대조 차이`);
      assert.match(r.body.document.document_no, /^INT-\d{8}-\d{4}$/);
      // 발급은 발송이 아니다 — receipt_sent_at 미갱신
      const sent = db.prepare('SELECT receipt_sent_at FROM payments WHERE id = ?').get(paymentId);
      assert.strictEqual(sent.receipt_sent_at, null, 'receipt_sent_at이 발급으로 갱신됨');
    }
    // 스냅샷 내용(부분납부+환불 케이스)
    const doc = db.prepare("SELECT * FROM billing_documents WHERE payment_id = 'payRefund'").get();
    const snapshot = JSON.parse(doc.snapshot_json);
    assert.strictEqual(snapshot.student_name, '김수학');
    assert.strictEqual(snapshot.billed_amount, 300000);
    assert.strictEqual(snapshot.effective_paid, 200000);
    assert.strictEqual(snapshot.outstanding_amount, 100000);
    assert.strictEqual(snapshot.items.length, 1);
    assert.strictEqual(snapshot.transactions.length, 1);
    assert.strictEqual(snapshot.refunds.length, 1);
    assert.match(snapshot.official_notice, /공식 증명서.*아닙니다/);
    db.close();
  }

  // ════ 2. 문서 번호 중복 방지 + 동시 발급 ════
  {
    const { db, env } = newEnv();
    seedPayment(db, { id: 'pay1', total: 100000 });
    const [a, b] = await Promise.all([
      callRoute(routeModule, env, COLLECTOR, { method: 'POST', sub: 'documents', body: { payment_id: 'pay1' } }),
      callRoute(routeModule, env, COLLECTOR, { method: 'POST', sub: 'documents', body: { payment_id: 'pay1' } })
    ]);
    assert.strictEqual(a.status, 201);
    assert.strictEqual(b.status, 201);
    assert.notStrictEqual(a.body.document.document_no, b.body.document.document_no, '동시 발급 문서 번호 충돌');
    // DB unique guard 직접 확인
    assert.throws(() => {
      db.prepare("INSERT INTO billing_documents (id, document_no, student_id, snapshot_json) VALUES ('dup', ?, 's01', '{}')")
        .run(a.body.document.document_no);
    }, /UNIQUE/i, '문서 번호 unique 인덱스 없음');
    db.close();
  }

  // ════ 3. 다른 학생 문서 접근 차단 ════
  {
    const { db, env } = newEnv();
    seedPayment(db, { id: 'pay1', total: 100000, student_id: 's01' });
    seedPayment(db, { id: 'pay2', total: 100000, student_id: 's02' });
    // 학생 불일치 발급 거부
    let r = await callRoute(routeModule, env, COLLECTOR, { method: 'POST', sub: 'documents', body: { payment_id: 'pay1', student_id: 's02' } });
    assert.strictEqual(r.status, 400);
    assert.strictEqual(r.body.code, 'DOCUMENT_STUDENT_MISMATCH');
    // 발급 후 학생 필터 조회는 해당 학생 문서만
    await callRoute(routeModule, env, COLLECTOR, { method: 'POST', sub: 'documents', body: { payment_id: 'pay1' } });
    await callRoute(routeModule, env, COLLECTOR, { method: 'POST', sub: 'documents', body: { payment_id: 'pay2' } });
    r = await callRoute(routeModule, env, COLLECTOR, { sub: 'documents', query: '?student_id=s01' });
    assert.strictEqual(r.body.documents.length, 1);
    assert.ok(r.body.documents.every((d) => d.student_id === 's01'), '다른 학생 문서가 노출됨');
    // 권한: 조회 전용은 발급 불가, 조회는 가능
    r = await callRoute(routeModule, env, VIEWER, { method: 'POST', sub: 'documents', body: { payment_id: 'pay1' } });
    assert.strictEqual(r.status, 403);
    r = await callRoute(routeModule, env, VIEWER, { sub: 'documents', query: '?student_id=s01' });
    assert.strictEqual(r.status, 200);
    db.close();
  }

  // ════ 4. 발급 후 원거래 메모 변경에도 스냅샷 유지 ════
  {
    const { db, env } = newEnv();
    seedPayment(db, { id: 'pay1', total: 300000 });
    seedTx(db, routeModule, { paymentId: 'pay1', amount: 300000 });
    const issued = await callRoute(routeModule, env, COLLECTOR, { method: 'POST', sub: 'documents', body: { payment_id: 'pay1' } });
    const before = db.prepare('SELECT snapshot_json FROM billing_documents WHERE id = ?').get(issued.body.id).snapshot_json;
    // 원거래 메모 수정 (완료 거래에서 허용되는 유일한 계열)
    const tx = db.prepare("SELECT id FROM payment_transactions WHERE payment_id = 'pay1'").get();
    const patched = await callRoute(routeModule, env, ADMIN, { method: 'PATCH', sub: 'transactions', id: tx.id, body: { note: '메모 변경됨' } });
    assert.strictEqual(patched.status, 200, JSON.stringify(patched.body));
    const after = db.prepare('SELECT snapshot_json FROM billing_documents WHERE id = ?').get(issued.body.id).snapshot_json;
    assert.strictEqual(after, before, '원거래 변경이 문서 스냅샷을 훼손함');
    db.close();
  }

  // ════ 5. 재발급·취소 이력 ════
  {
    const { db, env } = newEnv();
    seedPayment(db, { id: 'pay1', total: 300000 });
    seedTx(db, routeModule, { paymentId: 'pay1', amount: 100000 });
    const first = await callRoute(routeModule, env, COLLECTOR, { method: 'POST', sub: 'documents', body: { payment_id: 'pay1' } });
    assert.strictEqual(first.status, 201);
    // 추가 수납 후 재발급 → 원본 superseded + 연결
    seedTx(db, routeModule, { paymentId: 'pay1', amount: 200000, date: '2026-07-10' });
    const second = await callRoute(routeModule, env, COLLECTOR, {
      method: 'POST', sub: 'documents', body: { payment_id: 'pay1', replaces_document_id: first.body.id }
    });
    assert.strictEqual(second.status, 201);
    assert.strictEqual(second.body.document.amount, 300000);
    assert.strictEqual(second.body.document.replaces_document_id, first.body.id);
    const original = db.prepare('SELECT status FROM billing_documents WHERE id = ?').get(first.body.id);
    assert.strictEqual(original.status, 'superseded', '재발급 원본이 superseded로 연결되지 않음');
    // 발급 문서 수정 금지
    let r = await callRoute(routeModule, env, COLLECTOR, { method: 'PATCH', sub: 'documents', id: second.body.id, body: { amount: 1 } });
    assert.strictEqual(r.body.code, 'DOCUMENT_READONLY');
    // 취소: 사유 필수 → 취소 → 스냅샷 유지 → 중복 취소 차단
    r = await callRoute(routeModule, env, COLLECTOR, { method: 'PATCH', sub: 'documents', id: second.body.id, action: 'cancel', body: {} });
    assert.strictEqual(r.body.code, 'CANCEL_REASON_REQUIRED');
    const snapshotBefore = db.prepare('SELECT snapshot_json FROM billing_documents WHERE id = ?').get(second.body.id).snapshot_json;
    r = await callRoute(routeModule, env, COLLECTOR, { method: 'PATCH', sub: 'documents', id: second.body.id, action: 'cancel', body: { reason: '학부모 요청 재발급 예정' } });
    assert.strictEqual(r.status, 200);
    assert.strictEqual(r.body.status, 'cancelled');
    assert.strictEqual(db.prepare('SELECT snapshot_json FROM billing_documents WHERE id = ?').get(second.body.id).snapshot_json, snapshotBefore);
    r = await callRoute(routeModule, env, COLLECTOR, { method: 'PATCH', sub: 'documents', id: second.body.id, action: 'cancel', body: { reason: 'x' } });
    assert.strictEqual(r.body.code, 'ALREADY_CANCELLED');
    // 감사 로그 체인: issue → (재발급 문서) reissue → cancel
    const firstAudit = db.prepare("SELECT action FROM billing_audit_logs WHERE entity_type = 'billing_document' AND entity_id = ? ORDER BY created_at").all(first.body.id);
    assert.deepStrictEqual(firstAudit.map((a) => a.action), ['issue']);
    const secondAudit = db.prepare("SELECT action FROM billing_audit_logs WHERE entity_type = 'billing_document' AND entity_id = ? ORDER BY created_at").all(second.body.id);
    assert.deepStrictEqual(secondAudit.map((a) => a.action), ['reissue', 'cancel']);
    db.close();
  }

  // ════ 7. A4 인쇄 HTML 렌더러 (management.js를 vm에 로드) ════
  {
    const sandbox = {
      console, Date, URLSearchParams, Promise, setTimeout, clearTimeout, encodeURIComponent,
      document: { activeElement: null, getElementById: () => null, querySelectorAll: () => [] },
      window: { prompt: () => null, open: () => null },
      confirm: () => true, toast: () => {}, showModal: () => {}, closeModal: () => {},
      loadData: async () => {}, setManagementReturnView: () => {}, setModalReturnView: () => {},
      isActiveStudentStatus: () => true, normalizeStudentStatus: (s) => s, apmsGetClassOptionDisplayLabel: () => '',
      state: { auth: { role: 'admin' }, db: { students: [], classes: [], class_students: [] }, ui: {} },
      api: { get: async () => ({}), post: async () => ({}), patch: async () => ({}) }
    };
    vm.createContext(sandbox);
    vm.runInContext(managementSource, sandbox, { filename: 'management.js' });

    const html = sandbox.billingDocumentPrintHtml({
      document_no: 'INT-20260715-0001',
      issued_at: '2026-07-15T10:00:00.000Z',
      snapshot_json: JSON.stringify({
        student_name: '김수학',
        billing_year: 2026, billing_month: 7,
        due_date: null, // 빈 필드
        payment_status: 'partial',
        billed_amount: 300000, effective_paid: 200000, outstanding_amount: 100000,
        items: [{ name: '고2 심화 수강료', item_type: 'tuition', amount: 300000 }],
        adjustments: [],
        transactions: [{ date: '2026-07-05', type: 'payment', method: 'cash', amount: 300000 }],
        refunds: [{ date: '2026-07-08', amount: 100000, reason: '일부 환불' }],
        issued_by: 't_col', issued_at: '2026-07-15T10:00:00.000Z'
      })
    });
    assert.match(html, /@page \{ size: A4/, 'A4 페이지 설정 누락');
    assert.match(html, /내부 확인용 문서/, '내부 확인용(비공식) 표기 누락');
    assert.match(html, /공식 증명서/, '공식성 범위 안내 누락');
    assert.match(html, /김수학/);
    assert.match(html, /300,000원/);
    assert.match(html, /200,000원/);
    assert.match(html, /INT-20260715-0001/);
    assert.match(html, /word-break: break-all/, 'overflow(word-break) 방지 누락');
    assert.match(html, /lang="ko"/);
    // 빈 필드(due_date null)는 '-'로, undefined/null 문자열 노출 없음
    assert.match(html, /<th>납부기한<\/th><td>-<\/td>/);
    assert.doesNotMatch(html, /undefined|null/, '빈 필드가 undefined/null로 노출됨');

    // 스냅샷 파싱 실패(깨진 JSON)에도 렌더러가 죽지 않고 '-' 처리
    const brokenHtml = sandbox.billingDocumentPrintHtml({ document_no: 'INT-X', issued_at: '', snapshot_json: '{broken' });
    assert.match(brokenHtml, /납부확인서/);
    assert.doesNotMatch(brokenHtml, /undefined/);
  }

  console.log('apmath billing documents tests passed');
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
