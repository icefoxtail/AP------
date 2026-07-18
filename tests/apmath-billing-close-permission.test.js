// 2026-07-14 LOOP 5 — 일마감·월마감·역할별 권한 테스트 (동작형: mock D1 = node:sqlite)
//  1) 수납 권한 사용자는 수납 가능, 환불 승인/마감 불가
//  2) 조회 전용 사용자는 모든 POST/PATCH 403
//  3) closed 월의 수납·환불·조정·이월·장부·청구확정 변경 전부 423
//  4) 불일치 금액이 있으면 마감 실패 (409 + 불일치 내역)
//  5) 재오픈 사유 누락 실패, 재오픈/재마감 감사 로그 생성
//  6) 자기 수납 자기 환불 승인 차단 규칙 (정책 활성 시에만 — 기본 비활성)
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
  '20260714_wangji_billing_adjustment_carryover_ledger.sql',
  '20260714_wangji_billing_period_closings.sql'
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

const TEACHERS = {
  admin: { id: 't_admin', role: 'admin' },
  collector: { id: 't_col', role: 'teacher' },   // billing.read + billing.collect
  refunder: { id: 't_ref', role: 'teacher' },    // billing.read + billing.refund.approve
  closer: { id: 't_close', role: 'teacher' },    // billing.read + billing.close + billing.reopen
  both: { id: 't_both', role: 'teacher' },       // collect + refund.approve (자기승인 규칙 검증용)
  viewer: { id: 't_view', role: 'teacher' },     // billing.read만
  none: { id: 't_none', role: 'teacher' }        // 권한 없음
};

function newEnv() {
  const db = new DatabaseSync(':memory:');
  db.exec(schemaSql);
  for (const sql of migrations) db.exec(sql);
  db.prepare("INSERT INTO students (id, name) VALUES ('s01', '김수학')").run();
  const grants = [
    ['t_col', 'billing.read'], ['t_col', 'billing.collect'],
    ['t_ref', 'billing.read'], ['t_ref', 'billing.refund.approve'],
    ['t_close', 'billing.read'], ['t_close', 'billing.close'], ['t_close', 'billing.reopen'],
    ['t_both', 'billing.read'], ['t_both', 'billing.collect'], ['t_both', 'billing.refund.approve'],
    ['t_view', 'billing.read']
  ];
  grants.forEach(([teacherId, key], index) => {
    db.prepare('INSERT INTO staff_permissions (id, teacher_id, permission_key, allowed) VALUES (?, ?, ?, 1)')
      .run(`sp_${index}`, teacherId, key);
  });
  return { db, env: { DB: createMockD1(db) } };
}

function seedPayment(db, { id, student_id = 's01', total, year = 2026, month = 7 }) {
  db.prepare('INSERT INTO payments (id, student_id, year, month, total_amount, paid_amount, status) VALUES (?, ?, ?, ?, ?, 0, ?)')
    .run(id, student_id, year, month, total, 'unpaid');
}

async function callRoute(routeModule, env, teacher, { method = 'GET', sub, id = '', action = '', query = '', body = null }) {
  const url = new URL(`https://worker.local/api/billing-accounting-foundation/${sub}${query}`);
  const pathParts = ['api', 'billing-accounting-foundation', sub];
  if (id) pathParts.push(id);
  if (action) pathParts.push(action);
  const response = await routeModule.handleBillingAccountingFoundation({ method }, env, teacher, pathParts, url, body || {});
  return { status: response.status, body: await response.json() };
}

function collectBody(paymentId, amount, date, extra = {}) {
  return {
    payment_id: paymentId, student_id: 's01', branch: 'apmath',
    transaction_type: 'payment', method_key: 'cash', amount,
    transaction_date: date, status: 'completed', ...extra
  };
}

async function run() {
  const routeModule = await import(toFileUrl(path.join(workerDir, 'routes/billing-accounting-foundation.js')));
  const permissions = await import(toFileUrl(path.join(workerDir, 'helpers/billing-permissions.js')));

  // capability 매핑 자체를 고정
  assert.strictEqual(permissions.requiredBillingCapability('transactions', 'POST'), 'billing.collect');
  assert.strictEqual(permissions.requiredBillingCapability('refunds', 'POST'), 'billing.refund.approve');
  assert.strictEqual(permissions.requiredBillingCapability('closings', 'POST'), 'billing.close');
  assert.strictEqual(permissions.requiredBillingCapability('closings', 'PATCH', 'reopen'), 'billing.reopen');
  assert.strictEqual(permissions.requiredBillingCapability('billing-adjustments', 'POST'), 'billing.adjust');
  assert.strictEqual(permissions.requiredBillingCapability('audit-logs', 'GET'), 'billing.audit.read');
  assert.strictEqual(permissions.requiredBillingCapability('payments', 'GET'), 'billing.read');
  assert.strictEqual(permissions.requiredBillingCapability('payment-methods', 'POST'), null); // 설정 변경 = admin 전용

  // ════ 1+2. 권한 행렬 ════
  {
    const { db, env } = newEnv();
    seedPayment(db, { id: 'pay1', total: 300000 });

    // 수납 담당: 수납 가능
    let r = await callRoute(routeModule, env, TEACHERS.collector, {
      method: 'POST', sub: 'transactions', body: collectBody('pay1', 100000, '2026-07-05', { clientRequestId: 'c1' })
    });
    assert.strictEqual(r.status, 200, JSON.stringify(r.body));
    // 수납 담당: 환불 승인 불가 / 마감 불가 / 조정 불가
    r = await callRoute(routeModule, env, TEACHERS.collector, { method: 'POST', sub: 'refunds', body: { student_id: 's01', payment_id: 'pay1', refund_amount: 1000, refund_date: '2026-07-06', reason: 'x' } });
    assert.strictEqual(r.status, 403);
    assert.strictEqual(r.body.code, 'BILLING_FORBIDDEN');
    r = await callRoute(routeModule, env, TEACHERS.collector, { method: 'POST', sub: 'closings', body: { period_type: 'month', period_key: '2026-07' } });
    assert.strictEqual(r.status, 403);
    r = await callRoute(routeModule, env, TEACHERS.collector, { method: 'POST', sub: 'billing-adjustments', body: { payment_id: 'pay1', adjustment_type: 'discount', name: 'x', amount: -1000, reason: 'x' } });
    assert.strictEqual(r.status, 403);

    // 환불 승인자: 환불 가능, 수납 불가
    r = await callRoute(routeModule, env, TEACHERS.refunder, {
      method: 'POST', sub: 'refunds', body: { student_id: 's01', payment_id: 'pay1', refund_amount: 30000, refund_date: '2026-07-06', reason: '일부 환불' }
    });
    assert.strictEqual(r.status, 200, JSON.stringify(r.body));
    r = await callRoute(routeModule, env, TEACHERS.refunder, { method: 'POST', sub: 'transactions', body: collectBody('pay1', 1000, '2026-07-06') });
    assert.strictEqual(r.status, 403);

    // 조회 전용: GET은 되고 모든 POST/PATCH는 403
    r = await callRoute(routeModule, env, TEACHERS.viewer, { sub: 'payments', query: '?student_id=s01' });
    assert.strictEqual(r.status, 200);
    const writeAttempts = [
      { method: 'POST', sub: 'transactions', body: collectBody('pay1', 1000, '2026-07-06') },
      { method: 'POST', sub: 'refunds', body: { student_id: 's01', payment_id: 'pay1', refund_amount: 1000, refund_date: '2026-07-06', reason: 'x' } },
      { method: 'POST', sub: 'billing-adjustments', body: { payment_id: 'pay1', adjustment_type: 'discount', name: 'x', amount: -1000, reason: 'x' } },
      { method: 'POST', sub: 'carryovers', body: { student_id: 's01', from_payment_id: 'pay1', amount: 1000, carryover_type: 'credit', reason: 'x' } },
      { method: 'POST', sub: 'cashbook', body: { entry_date: '2026-07-06', entry_type: 'expense', category: 'x', amount: 1000, title: 'x' } },
      { method: 'POST', sub: 'closings', body: { period_type: 'month', period_key: '2026-07' } },
      { method: 'POST', sub: 'billing-runs', body: { year: 2026, month: 7, idempotency_key: 'v1' } },
      { method: 'PATCH', sub: 'transactions', id: 'any', action: 'cancel', body: { reason: 'x' } },
      { method: 'PATCH', sub: 'closings', id: 'any', action: 'reopen', body: { reason: 'x' } },
      { method: 'POST', sub: 'payment-methods', body: { method_key: 'card', name: 'x' } }
    ];
    for (const attempt of writeAttempts) {
      const res = await callRoute(routeModule, env, TEACHERS.viewer, attempt);
      assert.strictEqual(res.status, 403, `조회 전용이 ${attempt.method} ${attempt.sub}에 ${res.status}`);
    }
    // 권한 없음: 조회도 403
    r = await callRoute(routeModule, env, TEACHERS.none, { sub: 'payments' });
    assert.strictEqual(r.status, 403);
    // 감사 로그: viewer 403, admin 200
    r = await callRoute(routeModule, env, TEACHERS.viewer, { sub: 'audit-logs' });
    assert.strictEqual(r.status, 403);
    r = await callRoute(routeModule, env, TEACHERS.admin, { sub: 'audit-logs' });
    assert.strictEqual(r.status, 200);
    db.close();
  }

  // ════ 3+5. 마감 → closed 기간 변경 423 → 재오픈 → 재마감 ════
  {
    const { db, env } = newEnv();
    seedPayment(db, { id: 'pay1', total: 300000 });
    // 7월 수납 2건 (자동 장부 동반)
    let r = await callRoute(routeModule, env, TEACHERS.collector, {
      method: 'POST', sub: 'transactions', body: collectBody('pay1', 100000, '2026-07-05', { clientRequestId: 'a' })
    });
    assert.strictEqual(r.status, 200);
    const tx7Id = r.body.id;
    r = await callRoute(routeModule, env, TEACHERS.collector, {
      method: 'POST', sub: 'transactions', body: collectBody('pay1', 50000, '2026-07-10', { clientRequestId: 'b' })
    });
    assert.strictEqual(r.status, 200);

    // 마감: closer만 가능, 스냅샷 합계 일치
    r = await callRoute(routeModule, env, TEACHERS.closer, {
      method: 'POST', sub: 'closings', body: { period_type: 'month', period_key: '2026-07', branch: 'all' }
    });
    assert.strictEqual(r.status, 201, JSON.stringify(r.body));
    const closingId = r.body.id;
    assert.strictEqual(r.body.snapshot.collected, 150000);
    assert.strictEqual(r.body.snapshot.cashbook_auto_income, 150000);
    assert.strictEqual(r.body.snapshot.billed, 300000);

    // 이미 마감 → 409
    r = await callRoute(routeModule, env, TEACHERS.closer, {
      method: 'POST', sub: 'closings', body: { period_type: 'month', period_key: '2026-07', branch: 'all' }
    });
    assert.strictEqual(r.status, 409);
    assert.strictEqual(r.body.code, 'CLOSING_ALREADY_CLOSED');

    // closed 월의 모든 금액 변경 → 423 (admin이어도 마감이 우선)
    seedPayment(db, { id: 'pay8', total: 200000, month: 8 });
    const blockedAttempts = [
      { who: TEACHERS.collector, req: { method: 'POST', sub: 'transactions', body: collectBody('pay1', 1000, '2026-07-20') } },
      { who: TEACHERS.collector, req: { method: 'PATCH', sub: 'transactions', id: tx7Id, action: 'cancel', body: { reason: 'x' } } },
      { who: TEACHERS.refunder, req: { method: 'POST', sub: 'refunds', body: { student_id: 's01', payment_id: 'pay1', refund_amount: 1000, refund_date: '2026-07-21', reason: 'x' } } },
      { who: TEACHERS.admin, req: { method: 'POST', sub: 'billing-adjustments', body: { payment_id: 'pay1', adjustment_type: 'discount', name: 'x', amount: -1000, reason: 'x' } } },
      { who: TEACHERS.admin, req: { method: 'POST', sub: 'carryovers', body: { student_id: 's01', from_payment_id: 'pay1', amount: 1000, carryover_type: 'credit', reason: 'x', carryover_date: '2026-07-22' } } },
      { who: TEACHERS.admin, req: { method: 'POST', sub: 'cashbook', body: { entry_date: '2026-07-23', entry_type: 'expense', category: '비품', amount: 1000, title: '테스트' } } },
      { who: TEACHERS.admin, req: { method: 'POST', sub: 'billing-runs', body: { year: 2026, month: 7, idempotency_key: 'blocked-run' } } }
    ];
    for (const { who, req } of blockedAttempts) {
      const res = await callRoute(routeModule, env, who, req);
      assert.strictEqual(res.status, 423, `${req.method} ${req.sub}가 마감 우회: ${res.status} ${JSON.stringify(res.body)}`);
      assert.strictEqual(res.body.code, 'BILLING_PERIOD_CLOSED');
    }
    // 마감 범위 밖(8월)은 정상 동작
    r = await callRoute(routeModule, env, TEACHERS.collector, {
      method: 'POST', sub: 'transactions', body: collectBody('pay8', 1000, '2026-08-05', { clientRequestId: 'c' })
    });
    assert.strictEqual(r.status, 200, JSON.stringify(r.body));

    // 재오픈: reopen 권한 필요 + 사유 필수
    r = await callRoute(routeModule, env, TEACHERS.collector, { method: 'PATCH', sub: 'closings', id: closingId, action: 'reopen', body: { reason: 'x' } });
    assert.strictEqual(r.status, 403);
    r = await callRoute(routeModule, env, TEACHERS.closer, { method: 'PATCH', sub: 'closings', id: closingId, action: 'reopen', body: {} });
    assert.strictEqual(r.status, 400);
    assert.strictEqual(r.body.code, 'REOPEN_REASON_REQUIRED');
    r = await callRoute(routeModule, env, TEACHERS.closer, { method: 'PATCH', sub: 'closings', id: closingId, action: 'reopen', body: { reason: '7월 수납 누락 정정' } });
    assert.strictEqual(r.status, 200);
    assert.strictEqual(r.body.status, 'reopened');
    assert.strictEqual(r.body.closing.reopen_reason, '7월 수납 누락 정정');
    assert.ok(r.body.closing.reopened_by);

    // 재오픈 후 7월 수납 가능
    r = await callRoute(routeModule, env, TEACHERS.collector, {
      method: 'POST', sub: 'transactions', body: collectBody('pay1', 20000, '2026-07-20', { clientRequestId: 'd' })
    });
    assert.strictEqual(r.status, 200);

    // 재마감: 새 스냅샷(170,000)으로 closed
    r = await callRoute(routeModule, env, TEACHERS.closer, {
      method: 'POST', sub: 'closings', body: { period_type: 'month', period_key: '2026-07', branch: 'all' }
    });
    assert.strictEqual(r.status, 200);
    assert.strictEqual(r.body.snapshot.collected, 170000);
    // 감사 로그: close → reopen → reclose
    const closingAudits = db.prepare("SELECT action FROM billing_audit_logs WHERE entity_type = 'billing_period_closing' AND entity_id = ? ORDER BY created_at").all(closingId);
    assert.deepStrictEqual(closingAudits.map((a) => a.action), ['close', 'reopen', 'reclose']);
    db.close();
  }

  // ════ 4. 불일치 금액이 있으면 마감 실패 ════
  {
    const { db, env } = newEnv();
    seedPayment(db, { id: 'pay1', total: 300000 });
    let r = await callRoute(routeModule, env, TEACHERS.collector, {
      method: 'POST', sub: 'transactions', body: collectBody('pay1', 100000, '2026-07-05', { clientRequestId: 'a' })
    });
    assert.strictEqual(r.status, 200);
    // 자동 장부 훼손(원장-장부 불일치 재현)
    db.prepare("UPDATE cashbook_entries SET amount = amount - 5000 WHERE source_type = 'payment_transaction'").run();
    r = await callRoute(routeModule, env, TEACHERS.closer, {
      method: 'POST', sub: 'closings', body: { period_type: 'month', period_key: '2026-07' }
    });
    assert.strictEqual(r.status, 409);
    assert.strictEqual(r.body.code, 'CLOSING_MISMATCH');
    assert.strictEqual(r.body.mismatches[0].field, 'collected_vs_cashbook');
    assert.strictEqual(r.body.mismatches[0].ledger, 100000);
    assert.strictEqual(r.body.mismatches[0].cashbook, 95000);
    assert.strictEqual(db.prepare('SELECT COUNT(*) AS cnt FROM billing_period_closings').get().cnt, 0, '불일치인데 마감 행이 생성됨');
    db.close();
  }

  // ════ 6. 자기 수납 자기 환불 승인 차단 (정책 활성 시에만) ════
  {
    const { db, env } = newEnv();
    seedPayment(db, { id: 'pay1', total: 300000 });
    let r = await callRoute(routeModule, env, TEACHERS.both, {
      method: 'POST', sub: 'transactions', body: collectBody('pay1', 300000, '2026-07-05', { clientRequestId: 'a' })
    });
    assert.strictEqual(r.status, 200);
    const txId = r.body.id;

    // 규칙 없음(기본 비활성): 자기 수납 고액 환불 허용
    r = await callRoute(routeModule, env, TEACHERS.both, {
      method: 'POST', sub: 'refunds',
      body: { student_id: 's01', payment_transaction_id: txId, refund_amount: 150000, refund_date: '2026-07-06', reason: 'x' }
    });
    assert.strictEqual(r.status, 200, JSON.stringify(r.body));

    // 규칙 활성화(한도 100,000)
    db.prepare(`INSERT INTO billing_policy_rules (id, rule_key, branch, rule_type, name, value_json, is_active)
      VALUES ('bpr_self', 'refund_self_approval_limit', 'all', 'billing_permission', '자기승인 한도', '{"amount":100000}', 1)`).run();
    // 자기 수납 100,000 이상 환불 → 403
    r = await callRoute(routeModule, env, TEACHERS.both, {
      method: 'POST', sub: 'refunds',
      body: { student_id: 's01', payment_transaction_id: txId, refund_amount: 100000, refund_date: '2026-07-06', reason: 'x' }
    });
    assert.strictEqual(r.status, 403);
    assert.strictEqual(r.body.code, 'REFUND_SELF_APPROVAL_BLOCKED');
    // 한도 미만은 본인도 가능
    r = await callRoute(routeModule, env, TEACHERS.both, {
      method: 'POST', sub: 'refunds',
      body: { student_id: 's01', payment_transaction_id: txId, refund_amount: 50000, refund_date: '2026-07-06', reason: 'x' }
    });
    assert.strictEqual(r.status, 200, JSON.stringify(r.body));
    // 다른 승인자(admin)는 고액도 가능
    r = await callRoute(routeModule, env, TEACHERS.admin, {
      method: 'POST', sub: 'refunds',
      body: { student_id: 's01', payment_transaction_id: txId, refund_amount: 100000, refund_date: '2026-07-06', reason: '타 승인자 처리' }
    });
    assert.strictEqual(r.status, 200, JSON.stringify(r.body));
    db.close();
  }

  console.log('apmath billing close/permission tests passed');
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
