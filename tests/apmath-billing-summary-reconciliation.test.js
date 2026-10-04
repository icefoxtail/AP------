// 2026-07-15 LOOP 7 — 집계·대사·학생 360 연결 테스트 (동작형: mock D1)
//  1) 원장 SQL, daily summary, monthly summary, dashboard 합계 동일
//  2) 날짜 경계·지점 필터, 취소 거래 제외, 환불/이월 유출 포함
//  3) summary 직접 수정 경로 0 (클라이언트 값 무시·PATCH 405)
//  4) 마감 스냅샷 ↔ summary ↔ 원장 대사 결과 저장 (matched/mismatched)
//  5) 중복 외부거래 ID·미대사 건 표시
//  6) 학생 A가 학생 B 타임라인을 받지 않음 (읽기 전용)
const fs = require('fs');
const path = require('path');
const assert = require('assert');
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
  '20260715_wangji_billing_documents.sql',
  '20260715_wangji_billing_reconciliations.sql'
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

function newEnv() {
  const db = new DatabaseSync(':memory:');
  db.exec(schemaSql);
  for (const sql of migrations) db.exec(sql);
  db.prepare("INSERT INTO students (id, name) VALUES ('s01', '김수학'), ('s02', '이대수')").run();
  return { db, env: { DB: createMockD1(db) } };
}

function seedPayment(db, { id, student_id = 's01', total, year = 2026, month = 7, branch = 'apmath' }) {
  db.prepare('INSERT INTO payments (id, student_id, year, month, total_amount, paid_amount, status) VALUES (?, ?, ?, ?, ?, 0, ?)')
    .run(id, student_id, year, month, total, 'unpaid');
  db.prepare('INSERT INTO payment_items (id, payment_id, branch, name, amount, item_type) VALUES (?, ?, ?, ?, ?, ?)')
    .run(`pi_${id}`, id, branch, '수강료', total, 'tuition');
}

async function callRoute(routeModule, env, teacher, { method = 'GET', sub, id = '', action = '', query = '', body = null }) {
  const url = new URL(`https://worker.local/api/billing-accounting-foundation/${sub}${query}`);
  const pathParts = ['api', 'billing-accounting-foundation', sub];
  if (id) pathParts.push(id);
  if (action) pathParts.push(action);
  const response = await routeModule.handleBillingAccountingFoundation({ method }, env, teacher, pathParts, url, body || {});
  return { status: response.status, body: await response.json() };
}

// API 경유 수납(자동 장부 동반)
async function collect(routeModule, env, { paymentId, studentId = 's01', amount, date, branch = 'apmath', method = 'cash', external = null }) {
  const body = {
    payment_id: paymentId, student_id: studentId, branch,
    transaction_type: 'payment', method_key: method, amount,
    transaction_date: date, status: 'completed', clientRequestId: `c-${paymentId}-${amount}-${date}`
  };
  if (external) {
    body.external_provider = external.provider;
    body.external_transaction_id = external.id;
  }
  const r = await callRoute(routeModule, env, ADMIN, { method: 'POST', sub: 'transactions', body });
  assert.strictEqual(r.status, 200, JSON.stringify(r.body));
  return r.body.id;
}

async function run() {
  const routeModule = await import(toFileUrl(path.join(workerDir, 'routes/billing-accounting-foundation.js')));

  // ════ 1+2+3. 집계 = 원장 = 대시보드, 날짜 경계·지점 필터·취소 제외·유출 포함 ════
  {
    const { db, env } = newEnv();
    seedPayment(db, { id: 'payA', total: 300000, branch: 'apmath' });
    seedPayment(db, { id: 'payB', student_id: 's02', total: 200000, branch: 'eie' });
    seedPayment(db, { id: 'payAug', total: 100000, month: 8 });

    await collect(routeModule, env, { paymentId: 'payA', amount: 100000, date: '2026-07-05', method: 'card' });
    await collect(routeModule, env, { paymentId: 'payA', amount: 50000, date: '2026-07-31', method: 'cash' }); // 월말 경계
    await collect(routeModule, env, { paymentId: 'payB', studentId: 's02', amount: 40000, date: '2026-07-05', branch: 'eie' });
    await collect(routeModule, env, { paymentId: 'payAug', amount: 20000, date: '2026-08-01' }); // 다음 달 — 7월 제외
    // 취소 거래는 집계에서 제외
    const cancelTxId = await collect(routeModule, env, { paymentId: 'payA', amount: 30000, date: '2026-07-06' });
    let r = await callRoute(routeModule, env, ADMIN, { method: 'PATCH', sub: 'transactions', id: cancelTxId, action: 'cancel', body: { reason: '착오 입력' } });
    assert.strictEqual(r.status, 200);
    // 환불·이월 유출 포함
    r = await callRoute(routeModule, env, ADMIN, {
      method: 'POST', sub: 'refunds',
      body: { student_id: 's01', payment_id: 'payA', refund_amount: 10000, refund_date: '2026-07-10', reason: 'x' }
    });
    assert.strictEqual(r.status, 200);
    r = await callRoute(routeModule, env, ADMIN, {
      method: 'POST', sub: 'carryovers',
      body: { student_id: 's01', from_payment_id: 'payA', amount: 20000, carryover_type: 'credit', reason: 'x', carryover_date: '2026-07-12' }
    });
    assert.strictEqual(r.status, 200);

    // 월 집계 재계산 (클라이언트가 보낸 조작 값은 무시되어야 함)
    r = await callRoute(routeModule, env, ADMIN, {
      method: 'POST', sub: 'monthly-summaries',
      body: { year: 2026, month: 7, branch: 'all', total_paid: 999999999 }
    });
    assert.strictEqual(r.status, 200, JSON.stringify(r.body));
    const monthly = r.body.monthly_summary;
    assert.strictEqual(monthly.total_paid, 190000, '월 수납 합계(취소 제외, 7월만)');
    assert.strictEqual(monthly.total_refunded, 10000);
    assert.strictEqual(monthly.total_billed, 500000, '7월 청구액(payA+payB)');
    // 미수금 = 원장 파생값 기준
    const ledgerOutstanding = db.prepare("SELECT COALESCE(SUM(MAX(total_amount - COALESCE(paid_amount,0), 0)),0) AS o FROM payments WHERE year = 2026 AND month = 7").get().o;
    assert.strictEqual(monthly.total_outstanding, ledgerOutstanding);
    const byMethod = JSON.parse(monthly.by_method_json);
    assert.strictEqual(byMethod.card, 100000);
    assert.strictEqual(byMethod.cash, 90000); // 50,000(apmath) + 40,000(eie)

    // 원장 직접 SQL과 동일
    const ledgerPaid = db.prepare(`
      SELECT COALESCE(SUM(amount),0) AS paid FROM payment_transactions
      WHERE status='completed' AND transaction_type IN ('payment','partial_payment') AND transaction_date LIKE '2026-07-%'
    `).get().paid;
    assert.strictEqual(monthly.total_paid, ledgerPaid, '집계와 원장 SQL 불일치');

    // 대시보드(accounting-summary)와 동일
    r = await callRoute(routeModule, env, ADMIN, { sub: 'summary', query: '?year=2026&month=7' });
    assert.strictEqual(r.body.total_paid, monthly.total_paid, '대시보드와 집계 불일치');
    assert.strictEqual(r.body.total_refunded + 20000, 10000 + 20000); // 환불 10,000 (+이월 유출은 별도 표기)

    // 일 집계: 날짜 경계 (7/31만, 7/5만)
    r = await callRoute(routeModule, env, ADMIN, { method: 'POST', sub: 'daily-summaries', body: { summary_date: '2026-07-31' } });
    assert.strictEqual(r.body.daily_summary.total_paid, 50000);
    r = await callRoute(routeModule, env, ADMIN, { method: 'POST', sub: 'daily-summaries', body: { summary_date: '2026-07-05' } });
    assert.strictEqual(r.body.daily_summary.total_paid, 140000);
    // 지점 필터: 7/5 apmath만
    r = await callRoute(routeModule, env, ADMIN, { method: 'POST', sub: 'daily-summaries', body: { summary_date: '2026-07-05', branch: 'apmath' } });
    assert.strictEqual(r.body.daily_summary.total_paid, 100000, '지점 필터 오류');
    // 같은 키 재계산 = upsert (행 1개)
    r = await callRoute(routeModule, env, ADMIN, { method: 'POST', sub: 'daily-summaries', body: { summary_date: '2026-07-05', branch: 'apmath' } });
    assert.strictEqual(r.status, 200);
    const dayRows = db.prepare("SELECT COUNT(*) AS cnt FROM accounting_daily_summaries WHERE summary_date = '2026-07-05' AND branch = 'apmath'").get().cnt;
    assert.strictEqual(dayRows, 1, 'upsert가 중복 행 생성');

    // summary 직접 수정 경로 0: PATCH 405
    r = await callRoute(routeModule, env, ADMIN, { method: 'PATCH', sub: 'daily-summaries', id: 'any', body: { total_paid: 1 } });
    assert.strictEqual(r.status, 405);
    r = await callRoute(routeModule, env, ADMIN, { method: 'PATCH', sub: 'monthly-summaries', id: 'any', body: { total_paid: 1 } });
    assert.strictEqual(r.status, 405);

    // ════ 4. 대사: 마감 → matched → summary 훼손 → mismatched ════
    r = await callRoute(routeModule, env, ADMIN, { method: 'POST', sub: 'closings', body: { period_type: 'month', period_key: '2026-07', branch: 'all' } });
    assert.strictEqual(r.status, 201, JSON.stringify(r.body));
    r = await callRoute(routeModule, env, ADMIN, { method: 'POST', sub: 'reconciliations', body: { period_type: 'month', period_key: '2026-07', branch: 'all' } });
    assert.strictEqual(r.status, 201, JSON.stringify(r.body));
    assert.strictEqual(r.body.status, 'matched', `대사 불일치: ${JSON.stringify(r.body.diffs)}`);
    // summary를 DB에서 직접 훼손(직접 수정 API가 없으므로 DB 조작으로 재현) → 대사가 잡아내야 함
    db.prepare('UPDATE accounting_monthly_summaries SET total_paid = total_paid + 1000 WHERE year = 2026 AND month = 7').run();
    r = await callRoute(routeModule, env, ADMIN, { method: 'POST', sub: 'reconciliations', body: { period_type: 'month', period_key: '2026-07', branch: 'all' } });
    assert.strictEqual(r.body.status, 'mismatched');
    assert.ok(r.body.diffs.some((d) => d.field === 'total_paid' && d.source === 'summary_vs_ledger'), '훼손된 summary를 대사가 놓침');
    // 대사 결과 저장 확인
    const recs = db.prepare('SELECT status FROM billing_reconciliations ORDER BY created_at').all();
    assert.deepStrictEqual(recs.map((x) => x.status), ['matched', 'mismatched']);
    // 마감 없는 기간 대사 → 404
    r = await callRoute(routeModule, env, ADMIN, { method: 'POST', sub: 'reconciliations', body: { period_type: 'month', period_key: '2026-08', branch: 'all' } });
    assert.strictEqual(r.status, 404);
    db.close();
  }

  // ════ 5. 중복 외부거래 ID·미대사 건 ════
  {
    const { db, env } = newEnv();
    seedPayment(db, { id: 'payA', total: 300000 });
    await collect(routeModule, env, { paymentId: 'payA', amount: 10000, date: '2026-07-05', external: { provider: 'van', id: 'E-1' } });
    // 중복 외부거래(직접 삽입으로 재현 — 서버 unique 방어 이전의 legacy 데이터 시나리오)
    db.prepare(`
      INSERT INTO payment_transactions (id, payment_id, student_id, transaction_type, method_key, amount, transaction_date, status, external_provider, external_transaction_id)
      VALUES ('tx_dup', 'payA', 's01', 'payment', 'card', 10000, '2026-07-06', 'completed', 'van', 'E-1')
    `).run();
    // 미대사: 장부 없는 수납(직접 삽입) + 원거래 없는 자동 장부
    db.prepare(`
      INSERT INTO payment_transactions (id, payment_id, student_id, transaction_type, method_key, amount, transaction_date, status)
      VALUES ('tx_nocash', 'payA', 's01', 'payment', 'cash', 5000, '2026-07-07', 'completed')
    `).run();
    db.prepare(`
      INSERT INTO cashbook_entries (id, entry_date, entry_type, category, amount, title, source_type, payment_transaction_id, status, is_active)
      VALUES ('cb_orphan', '2026-07-08', 'income', '수강료', 7000, 'x', 'payment_transaction', 'tx_missing', 'active', 1)
    `).run();
    const r = await callRoute(routeModule, env, ADMIN, { sub: 'reconciliation-exceptions' });
    assert.strictEqual(r.status, 200);
    assert.strictEqual(r.body.duplicate_external_transactions.length, 1);
    assert.strictEqual(r.body.duplicate_external_transactions[0].cnt, 2);
    assert.ok(r.body.unmatched_transactions.some((t) => t.id === 'tx_dup'), '장부 없는 수납 미탐지');
    assert.ok(r.body.unmatched_transactions.some((t) => t.id === 'tx_nocash'));
    assert.ok(r.body.unmatched_cashbook.some((c) => c.id === 'cb_orphan'), '고아 자동 장부 미탐지');
    db.close();
  }

  // ════ 6. 학생 타임라인: 읽기 전용 + 학생 간 격리 ════
  {
    const { db, env } = newEnv();
    seedPayment(db, { id: 'payA', total: 300000, student_id: 's01' });
    seedPayment(db, { id: 'payB', total: 200000, student_id: 's02' });
    await collect(routeModule, env, { paymentId: 'payA', amount: 100000, date: '2026-07-05' });
    await collect(routeModule, env, { paymentId: 'payB', studentId: 's02', amount: 50000, date: '2026-07-06' });
    let r = await callRoute(routeModule, env, ADMIN, {
      method: 'POST', sub: 'refunds',
      body: { student_id: 's01', payment_id: 'payA', refund_amount: 30000, refund_date: '2026-07-08', reason: 'x' }
    });
    assert.strictEqual(r.status, 200);
    r = await callRoute(routeModule, env, ADMIN, { method: 'POST', sub: 'documents', body: { payment_id: 'payA' } });
    assert.strictEqual(r.status, 201);

    r = await callRoute(routeModule, env, ADMIN, { sub: 'student-timeline', query: '?student_id=s01' });
    assert.strictEqual(r.status, 200);
    const events = r.body.events;
    const types = new Set(events.map((e) => e.type));
    assert.ok(types.has('billing') && types.has('payment') && types.has('refund') && types.has('document'), `이벤트 유형 누락: ${[...types]}`);
    // 학생 격리: s02의 payB/수납이 섞이면 안 됨
    assert.ok(events.every((e) => String(e.ref_id).indexOf('payB') === -1 && e.payment_id !== 'payB'), '학생 B 기록이 학생 A 타임라인에 유출');
    // 미납 요약 = 원장
    assert.strictEqual(r.body.outstanding.count, 1);
    assert.strictEqual(r.body.outstanding.total, 230000); // 300,000 - (100,000-30,000)
    // student_id 없으면 400, 쓰기 405
    r = await callRoute(routeModule, env, ADMIN, { sub: 'student-timeline' });
    assert.strictEqual(r.status, 400);
    r = await callRoute(routeModule, env, ADMIN, { method: 'POST', sub: 'student-timeline', body: {} });
    assert.strictEqual(r.status, 405);
    db.close();
  }

  // ════ UI 드릴다운·타임라인 정적 검증 ════
  assert.match(managementSource, /onclick="setBillingAccountingFoundationTab\('\$\{item\.drill\}'\)"/, '대시보드 카드 드릴다운 누락');
  assert.match(managementSource, /rebuildBillingAccountingSummaries/, '집계 재계산 버튼 누락');
  assert.match(managementSource, /billingCollectToggleTimeline/, '학생 타임라인 토글 누락');
  assert.match(managementSource, /수납 타임라인 \(읽기 전용\)/);

  console.log('apmath billing summary/reconciliation tests passed');
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
