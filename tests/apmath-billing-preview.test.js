// 2026-07-14 LOOP 1 — 청구 규칙·결정론적 미리보기 테스트
//  A) 순수 계산기(billing-calculation.js): 결정론, 기준일/납부기한(D-01/D-02), 경계(중도등록·휴원·규칙없음·0원·음수), 규칙 누출 없음
//  B) 라우트(billing-accounting-foundation): mock D1(node:sqlite) 위에서 미리보기 무쓰기, 응답 금액, 템플릿 쓰기 API
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { DatabaseSync } = require('node:sqlite');

const root = path.resolve(__dirname, '..');
const workerDir = path.join(root, 'apmath/worker-backup/worker');
const schemaSql = fs.readFileSync(path.join(workerDir, 'schema.sql'), 'utf8');
const hardeningMigrationSql = fs.readFileSync(
  path.join(workerDir, 'migrations/20260713_wangji_billing_transaction_hardening.sql'),
  'utf8'
);

function toFileUrl(p) {
  return String(new URL(`file:///${p.replace(/\\/g, '/')}`));
}

// D1 인터페이스 최소 mock — 실제 SQL을 node:sqlite에서 실행한다(동작형).
function createMockD1(db) {
  return {
    prepare(sql) {
      const statement = {
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
      return statement;
    },
    async batch(statements) {
      const results = [];
      for (const s of statements) results.push(await s.run());
      return results;
    }
  };
}

// 10명 표본 fixture (2026년 7월 미리보기 기준)
const FIXTURE = {
  students: [
    ['s01', '학생01'], ['s02', '학생02'], ['s03', '학생03'], ['s04', '학생04'], ['s05', '학생05'],
    ['s06', '학생06'], ['s07', '학생07'], ['s08', '학생08'], ['s09', '학생09'], ['s10', '학생10']
  ],
  classes: [
    ['cA', '고2 심화'], ['cB', '고1 정규'], ['cC', '중3 기초'], ['cE', 'EIE 초급']
  ],
  templates: [
    // [id, branch, class_id, name, default_amount, item_type, is_active]
    ['bt_A', 'apmath', 'cA', '고2 심화 수강료', 400000, 'tuition', 1],
    ['bt_A_book', 'apmath', 'cA', '고2 심화 교재비', 30000, 'textbook', 1],
    ['bt_B', 'apmath', 'cB', '고1 정규 수강료', 350000, 'tuition', 1],
    ['bt_old', 'apmath', 'cA', '(구) 고2 수강료', 999999, 'tuition', 0] // 비활성 — 적용 금지
  ],
  policyRules: [
    ['bpr_ap', 'apmath_default', 'apmath', 'tuition', 'AP Math 기본 수강료', '{"amount":300000}', 1]
  ],
  enrollments: [
    // [id, student_id, branch, class_id, status, start_date, end_date, tuition_amount]
    ['en01', 's01', 'apmath', 'cA', 'active', '2026-03-12', null, null],        // 템플릿 400000 + 교재 30000 → 430000, 기준일 7/12
    ['en02', 's02', 'apmath', 'cA', 'active', '2026-01-31', null, 380000],      // 학생별 금액 380000 + 교재 30000 → 410000, 기준일 7/31(말일 당김 경계)
    ['en03', 's03', 'apmath', 'cB', 'active', '2026-07-01', null, null],        // 350000
    ['en04', 's04', 'apmath', 'cB', 'active', '2026-08-05', null, null],        // 중도등록 예정 → 제외
    ['en05', 's05', 'apmath', 'cA', 'active', '2026-02-10', '2026-06-30', null],// 기준일(7/10) 전에 종료 → 제외
    ['en06', 's06', 'apmath', 'cC', 'active', '2026-05-20', null, null],        // 반 템플릿 없음 → 지점 정책 300000
    ['en07', 's07', 'apmath', 'cC', 'active', null, null, null],                // 등원 시작일 없음 → 제외 (D-01)
    ['en08', 's08', 'eie', 'cE', 'active', '2026-04-15', null, null],           // eie 규칙 없음 → 제외 (apmath 규칙 누출 금지)
    ['en09', 's09', 'apmath', 'cC', 'active', '2026-06-01', null, 0],           // 명시적 0원 청구 → zero_billed
    ['en10a', 's10', 'apmath', 'cA', 'active', '2026-03-05', null, null],       // 복수 수강: 400000+30000
    ['en10b', 's10', 'apmath', 'cB', 'active', '2026-04-20', null, null]        //          +350000 → 780000, 기준일 min(7/5)
  ]
};

// D-11: 수강별 별도 청구 — 기대값은 enrollment 단위
const EXPECTED_BILLED = { en01: 430000, en02: 410000, en03: 350000, en06: 300000, en09: 0, en10a: 430000, en10b: 350000 };
const EXPECTED_TOTAL = 2270000;
const EXPECTED_EXCLUDED = { s04: 'starts_after_month', s05: 'ended_before_billing_date', s07: 'no_start_date', s08: 'no_tuition_rule' };

function fixtureEnrollmentsForCalculator() {
  const classNames = new Map(FIXTURE.classes);
  const studentNames = new Map(FIXTURE.students);
  return FIXTURE.enrollments.map(([id, studentId, branch, classId, status, startDate, endDate, tuitionAmount]) => ({
    enrollment_id: id,
    student_id: studentId,
    student_name: studentNames.get(studentId) || '',
    branch,
    class_id: classId,
    class_name: classNames.get(classId) || '',
    status,
    start_date: startDate,
    end_date: endDate,
    tuition_amount: tuitionAmount
  }));
}

function fixtureTemplates() {
  return FIXTURE.templates.map(([id, branch, classId, name, amount, itemType, isActive]) => ({
    id, branch, class_id: classId, name, default_amount: amount, item_type: itemType, is_active: isActive
  }));
}

function fixturePolicyRules() {
  return FIXTURE.policyRules.map(([id, ruleKey, branch, ruleType, name, valueJson, isActive]) => ({
    id, rule_key: ruleKey, branch, rule_type: ruleType, name, value_json: valueJson, is_active: isActive
  }));
}

function seedDb(db) {
  for (const [id, name] of FIXTURE.students) {
    db.prepare('INSERT INTO students (id, name) VALUES (?, ?)').run(id, name);
  }
  for (const [id, name] of FIXTURE.classes) {
    db.prepare('INSERT INTO classes (id, name) VALUES (?, ?)').run(id, name);
  }
  for (const t of FIXTURE.templates) {
    db.prepare('INSERT INTO billing_templates (id, branch, class_id, name, default_amount, item_type, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)').run(...t);
  }
  for (const r of FIXTURE.policyRules) {
    db.prepare('INSERT INTO billing_policy_rules (id, rule_key, branch, rule_type, name, value_json, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)').run(...r);
  }
  for (const e of FIXTURE.enrollments) {
    db.prepare('INSERT INTO student_enrollments (id, student_id, branch, class_id, status, start_date, end_date, tuition_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(...e);
  }
  // 무쓰기 검증용: 미리보기와 무관한 기존 금액 데이터
  db.prepare("INSERT INTO payments (id, student_id, year, month, total_amount, paid_amount, status) VALUES ('pay_seed', 's01', 2026, 6, 100000, 100000, 'paid')").run();
  db.prepare("INSERT INTO payment_items (id, payment_id, name, amount) VALUES ('pi_seed', 'pay_seed', '6월 수강료', 100000)").run();
  db.prepare("INSERT INTO billing_adjustments (id, payment_id, adjustment_type, name, amount) VALUES ('adj_seed', 'pay_seed', 'discount', '형제 할인', -10000)").run();
}

function amountTableSnapshot(db) {
  return {
    payments: { ...db.prepare('SELECT COUNT(*) AS cnt, COALESCE(SUM(total_amount), 0) AS total FROM payments').get() },
    payment_items: { ...db.prepare('SELECT COUNT(*) AS cnt, COALESCE(SUM(amount), 0) AS total FROM payment_items').get() },
    billing_adjustments: { ...db.prepare('SELECT COUNT(*) AS cnt, COALESCE(SUM(amount), 0) AS total FROM billing_adjustments').get() }
  };
}

async function callRoute(routeModule, env, { method = 'GET', sub, id = '', action = '', query = '', body = null, teacher = { id: 't_admin', role: 'admin' } }) {
  const url = new URL(`https://worker.local/api/billing-accounting-foundation/${sub}${query}`);
  const pathParts = ['api', 'billing-accounting-foundation', sub];
  if (id) pathParts.push(id);
  if (action) pathParts.push(action);
  const request = { method };
  const response = await routeModule.handleBillingAccountingFoundation(request, env, teacher, pathParts, url, body || {});
  return { status: response.status, body: await response.json() };
}

async function run() {
  const calc = await import(toFileUrl(path.join(workerDir, 'helpers/billing-calculation.js')));
  const routeModule = await import(toFileUrl(path.join(workerDir, 'routes/billing-accounting-foundation.js')));
  const {
    calculateBillingPreview,
    deriveMonthlyBillingDate,
    computeDueDate,
    resolveTuitionForEnrollment,
    BILLING_RULE_VERSION
  } = calc;

  // ════ A-1. 기준일·납부기한 (D-01/D-02) ════
  assert.strictEqual(deriveMonthlyBillingDate('2026-03-12', 2026, 7), '2026-07-12');
  assert.strictEqual(deriveMonthlyBillingDate('2026-01-31', 2026, 2), '2026-02-28'); // 말일 당김
  assert.strictEqual(deriveMonthlyBillingDate('2026-01-31', 2026, 3), '2026-03-31'); // 복귀
  assert.strictEqual(deriveMonthlyBillingDate('2026-08-05', 2026, 7), null);          // 등원 전 달
  assert.strictEqual(deriveMonthlyBillingDate('', 2026, 7), null);
  assert.strictEqual(computeDueDate('2026-07-12'), '2026-08-12');
  assert.strictEqual(computeDueDate('2026-01-31'), '2026-02-28'); // 납부기한 말일 당김
  assert.strictEqual(computeDueDate('2026-12-15'), '2027-01-15'); // 연 경계

  // ════ A-2. 음수 수강 금액 경계: 0으로 clamp ════
  const negative = resolveTuitionForEnrollment(
    { enrollment_id: 'x', class_id: 'cZ', branch: 'apmath', tuition_amount: -50000 },
    [], []
  );
  assert.strictEqual(negative.amount, 0);
  assert.strictEqual(negative.basis_type, 'enrollment_tuition_amount');

  // ════ A-3. 10명 fixture — 결정론 + 예상 청구액 차이 0원 ════
  const input = () => ({
    year: 2026,
    month: 7,
    enrollments: fixtureEnrollmentsForCalculator(),
    templates: fixtureTemplates(),
    policyRules: fixturePolicyRules()
  });
  const first = calculateBillingPreview(input());
  const second = calculateBillingPreview(input());
  assert.deepStrictEqual(first, second, '같은 입력이 다른 미리보기를 생성함(결정론 위반)');

  assert.strictEqual(first.rule_version, BILLING_RULE_VERSION);
  assert.strictEqual(first.totals.invoices_count, Object.keys(EXPECTED_BILLED).length); // 청구서 7건
  assert.strictEqual(first.totals.students_count, 6); // 학생 6명 (s10은 2건)
  for (const invoice of first.invoices) {
    assert.strictEqual(
      invoice.billed_amount,
      EXPECTED_BILLED[invoice.enrollment_id],
      `${invoice.enrollment_id} 청구액 불일치: ${invoice.billed_amount}`
    );
    // 보존 관계: 미리보기 단계 조정은 0이므로 청구액 = 항목합계
    assert.strictEqual(invoice.adjustment_total, 0);
    assert.strictEqual(invoice.billed_amount, invoice.item_total);
    // D-11: 한 청구서의 항목은 전부 같은 수강
    for (const item of invoice.items) {
      assert.strictEqual(item.enrollment_id, invoice.enrollment_id, '청구서에 다른 수강 항목이 섞임');
    }
  }
  assert.strictEqual(first.totals.billed_total, EXPECTED_TOTAL);
  assert.strictEqual(first.totals.zero_billed_count, 1);
  assert.strictEqual(first.totals.items_count, 10);

  // 제외 사유
  assert.strictEqual(first.excluded.length, Object.keys(EXPECTED_EXCLUDED).length);
  for (const row of first.excluded) {
    assert.strictEqual(row.reason_code, EXPECTED_EXCLUDED[row.student_id], `${row.student_id} 제외 사유 불일치`);
    assert.ok(row.reason, '제외 사유 한글 설명 누락');
  }

  // 기준일·납부기한 반영 (수강별 각자 유지 — D-11)
  const en02 = first.invoices.find((inv) => inv.enrollment_id === 'en02');
  assert.strictEqual(en02.billing_date, '2026-07-31');
  assert.strictEqual(en02.due_date, '2026-08-31');
  const en10a = first.invoices.find((inv) => inv.enrollment_id === 'en10a');
  const en10b = first.invoices.find((inv) => inv.enrollment_id === 'en10b');
  assert.strictEqual(en10a.billing_date, '2026-07-05');
  assert.strictEqual(en10a.due_date, '2026-08-05');
  assert.strictEqual(en10b.billing_date, '2026-07-20');
  assert.strictEqual(en10b.due_date, '2026-08-20');
  assert.strictEqual(en10a.items.length, 2); // 수강료 + 교재비
  assert.strictEqual(en10b.items.length, 1);

  // 근거 추적: 모든 항목에 basis 존재, 비활성 템플릿(bt_old) 미사용
  for (const invoice of first.invoices) {
    for (const item of invoice.items) {
      assert.ok(item.basis, `${invoice.enrollment_id} 항목 근거 누락`);
      assert.ok(!item.basis.includes('bt_old'), '비활성 템플릿이 적용됨');
    }
  }
  const en01 = first.invoices.find((inv) => inv.enrollment_id === 'en01');
  assert.strictEqual(en01.items.find((i) => i.item_type === 'tuition').basis, 'template:bt_A');
  assert.strictEqual(en01.items.find((i) => i.item_type === 'textbook').basis, 'template:bt_A_book');
  const en06 = first.invoices.find((inv) => inv.enrollment_id === 'en06');
  assert.strictEqual(en06.items[0].basis, 'policy:apmath_default');

  // 규칙 누출 없음: cA 템플릿이 cB/cC/eie 청구서 항목에 나타나지 않음
  for (const invoice of first.invoices) {
    for (const item of invoice.items) {
      if (item.basis.startsWith('template:bt_A')) {
        assert.strictEqual(item.class_id, 'cA', `cA 템플릿이 ${item.class_id}에 누출`);
      }
    }
  }
  // 스냅샷: 적용 근거 목록
  assert.deepStrictEqual(first.snapshot.applied_template_ids, ['bt_A', 'bt_A_book', 'bt_B']);
  assert.deepStrictEqual(first.snapshot.applied_policy_rule_keys, ['apmath_default']);

  // ════ B. 라우트 레벨 (mock D1) ════
  const db = new DatabaseSync(':memory:');
  db.exec(schemaSql);
  db.exec(hardeningMigrationSql);
  seedDb(db);
  const env = { DB: createMockD1(db) };

  // B-1. 미리보기 무쓰기: 전후 금액 테이블 행 수·합계 동일
  const before = amountTableSnapshot(db);
  const preview1 = await callRoute(routeModule, env, { sub: 'billing-preview', query: '?year=2026&month=7' });
  const preview2 = await callRoute(routeModule, env, { sub: 'billing-preview', query: '?year=2026&month=7' });
  const after = amountTableSnapshot(db);
  assert.deepStrictEqual(after, before, '미리보기가 금액 테이블을 변경함');
  assert.strictEqual(preview1.status, 200);
  assert.deepStrictEqual(preview1.body, preview2.body, '라우트 미리보기 결정론 위반');

  // B-2. 응답 금액 = 계산기 기대값 (DB 조회 경로 포함 end-to-end 차이 0원)
  assert.strictEqual(preview1.body.total_amount, EXPECTED_TOTAL);
  assert.strictEqual(preview1.body.totals.billed_total, EXPECTED_TOTAL);
  assert.strictEqual(preview1.body.students_count, 6);
  assert.strictEqual(preview1.body.totals.invoices_count, 7);
  assert.strictEqual(preview1.body.rule_version, BILLING_RULE_VERSION);
  assert.strictEqual(preview1.body.excluded.length, 4);
  for (const invoice of preview1.body.invoices) {
    assert.strictEqual(invoice.billed_amount, EXPECTED_BILLED[invoice.enrollment_id]);
  }
  // 구 응답 표면 유지
  assert.ok(Array.isArray(preview1.body.preview_items));
  assert.strictEqual(preview1.body.preview_items.length, 10);

  // B-3. 관리자 아님 → 403 (규칙 누출 방지의 접근 통제 축)
  const forbidden = await callRoute(routeModule, env, {
    sub: 'billing-preview', query: '?year=2026&month=7', teacher: { id: 't2', role: 'teacher' }
  });
  assert.strictEqual(forbidden.status, 403);

  // B-4. billing-templates 생성 → 조회 반영 + 감사 로그
  const created = await callRoute(routeModule, env, {
    method: 'POST', sub: 'billing-templates',
    body: { name: '고1 정규 교재비', default_amount: 20000, class_id: 'cB', item_type: 'textbook', branch: 'apmath' }
  });
  assert.strictEqual(created.status, 200);
  const templateId = created.body.id;
  assert.ok(templateId);
  const auditCreate = db.prepare("SELECT * FROM billing_audit_logs WHERE entity_type = 'billing_template' AND entity_id = ? AND action = 'create'").all(templateId);
  assert.strictEqual(auditCreate.length, 1, '템플릿 생성 감사 로그 누락');

  // 새 템플릿이 미리보기에 반영 (s03/s10의 cB에 교재비 20000 추가 → +40000)
  const preview3 = await callRoute(routeModule, env, { sub: 'billing-preview', query: '?year=2026&month=7' });
  assert.strictEqual(preview3.body.total_amount, EXPECTED_TOTAL + 40000);

  // B-5. 잘못된 금액 → 400, 이름 없음 → 400
  const badAmount = await callRoute(routeModule, env, {
    method: 'POST', sub: 'billing-templates', body: { name: 'x', default_amount: -100 }
  });
  assert.strictEqual(badAmount.status, 400);
  const noName = await callRoute(routeModule, env, {
    method: 'POST', sub: 'billing-templates', body: { default_amount: 1000 }
  });
  assert.strictEqual(noName.status, 400);

  // B-6. 비활성화(삭제 아님) → 미리보기에서 즉시 제외 + 감사 로그, 행은 보존
  const deactivated = await callRoute(routeModule, env, {
    method: 'PATCH', sub: 'billing-templates', id: templateId, action: 'deactivate'
  });
  assert.strictEqual(deactivated.status, 200);
  assert.strictEqual(deactivated.body.is_active, 0);
  const preserved = db.prepare('SELECT * FROM billing_templates WHERE id = ?').get(templateId);
  assert.ok(preserved, '비활성화가 행을 삭제함');
  assert.strictEqual(Number(preserved.is_active), 0);
  const auditDeactivate = db.prepare("SELECT * FROM billing_audit_logs WHERE entity_type = 'billing_template' AND entity_id = ? AND action = 'deactivate'").all(templateId);
  assert.strictEqual(auditDeactivate.length, 1, '템플릿 비활성화 감사 로그 누락');
  const preview4 = await callRoute(routeModule, env, { sub: 'billing-preview', query: '?year=2026&month=7' });
  assert.strictEqual(preview4.body.total_amount, EXPECTED_TOTAL);

  // B-7. DELETE 미지원 (과거 규칙 삭제 금지)
  const deleted = await callRoute(routeModule, env, { method: 'DELETE', sub: 'billing-templates', id: templateId });
  assert.strictEqual(deleted.status, 405);

  // B-8. 쓰기 API를 거쳐도 금액 테이블(payments 계열)은 여전히 무변화
  const finalSnapshot = amountTableSnapshot(db);
  assert.deepStrictEqual(finalSnapshot, before, '템플릿 API가 금액 테이블을 변경함');

  db.close();
  console.log('apmath billing preview tests passed');
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
