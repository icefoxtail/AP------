import { jsonResponse, readJsonBody } from '../helpers/response.js';
import { isAdminUser, makeId, safeAll } from '../helpers/foundation-db.js';
import {
  computeRefundableAmount,
  findImmutableFieldViolation,
  isDirectPaymentTransactionType,
  SETTLEMENT_CREDIT_TYPES,
  SETTLEMENT_DEBIT_TYPES,
  toSettlementAmount
} from '../helpers/billing-settlement.js';
import { calculateBillingPreview } from '../helpers/billing-calculation.js';
import { getBillingCapabilities, requiredBillingCapability } from '../helpers/billing-permissions.js';

const ALLOWED_BRANCHES = new Set(['all', 'apmath', 'cmath', 'eie']);
const PAYMENT_METHOD_KEYS = new Set(['card', 'cash', 'bank_transfer', 'kakaopay', 'local_voucher', 'mixed', 'other']);
const TRANSACTION_TYPES = new Set(['payment', 'partial_payment', 'refund', 'cancel', 'correction', 'carryover_in', 'carryover_out']);
const TRANSACTION_STATUSES = new Set(['pending', 'completed', 'cancelled', 'failed', 'corrected']);
const CASHBOOK_ENTRY_TYPES = new Set(['income', 'expense', 'refund', 'adjustment', 'transfer']);
const CASHBOOK_STATUSES = new Set(['active', 'cancelled', 'inactive', 'corrected']);

function normalizeBranchForAccounting(value, fallback = 'apmath') {
  const raw = String(value || '').trim().toLowerCase();
  if (ALLOWED_BRANCHES.has(raw)) return raw;
  if (raw === 'cms' || raw === 'cma' || raw === 'cmath-elementary') return 'cmath';
  if (raw === 'ap' || raw === 'ap_math' || raw === 'ap-math') return 'apmath';
  return fallback;
}

function normalizeMethodKey(value) {
  const raw = String(value || '').trim().toLowerCase();
  return PAYMENT_METHOD_KEYS.has(raw) ? raw : 'other';
}

function normalizeTransactionType(value) {
  const raw = String(value || '').trim().toLowerCase();
  return TRANSACTION_TYPES.has(raw) ? raw : 'payment';
}

function normalizeTransactionStatus(value) {
  const raw = String(value || '').trim().toLowerCase();
  return TRANSACTION_STATUSES.has(raw) ? raw : 'completed';
}

function normalizeCashbookEntryType(value) {
  const raw = String(value || '').trim().toLowerCase();
  return CASHBOOK_ENTRY_TYPES.has(raw) ? raw : 'income';
}

function normalizeCashbookStatus(value) {
  const raw = String(value || '').trim().toLowerCase();
  return CASHBOOK_STATUSES.has(raw) ? raw : 'active';
}

function toInt(value, fallback = 0) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.round(n);
}

function parseLimit(url, fallback = 100, max = 1000) {
  const raw = toInt(url.searchParams.get('limit'), fallback);
  return Math.max(1, Math.min(max, raw));
}

function normalizeIsoDate(value) {
  const raw = String(value || '').trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw : '';
}

function normalizeJsonString(value) {
  if (value === undefined || value === null || value === '') return null;
  try {
    if (typeof value === 'string') {
      const parsed = JSON.parse(value);
      return JSON.stringify(parsed);
    }
    return JSON.stringify(value);
  } catch (e) {
    throw new Error('invalid_json');
  }
}

function normalizeFoundationSub(value) {
  const raw = String(value || '').trim().toLowerCase();
  if (raw === 'billing_templates') return 'billing-templates';
  if (raw === 'payment_items') return 'payment-items';
  if (raw === 'billing_adjustments') return 'billing-adjustments';
  if (raw === 'billing_runs') return 'billing-runs';
  if (raw === 'billing-policy-rules') return 'policy-rules';
  if (raw === 'payment-transactions') return 'transactions';
  if (raw === 'cashbook-entries') return 'cashbook';
  if (raw === 'refund-records') return 'refunds';
  if (raw === 'carryover-records') return 'carryovers';
  if (raw === 'accounting-summary') return 'summary';
  if (raw === 'billing-audit-logs') return 'audit-logs';
  if (raw === 'accounting-daily-summaries') return 'daily-summaries';
  if (raw === 'accounting-monthly-summaries') return 'monthly-summaries';
  return raw;
}

function pushBranchFilter(whereParts, bindings, branch) {
  if (!branch || branch === 'all') return;
  // Legacy AP Math rows may have NULL branch.
  // Treat NULL as apmath for filtered accounting reads.
  whereParts.push('COALESCE(branch, ?) = ?');
  bindings.push('apmath', branch);
}

function pushDateRangeFilter(whereParts, bindings, column, url) {
  const from = normalizeIsoDate(url.searchParams.get('date_from') || url.searchParams.get('from') || url.searchParams.get('start_date'));
  const to = normalizeIsoDate(url.searchParams.get('date_to') || url.searchParams.get('to') || url.searchParams.get('end_date'));
  if (from) {
    whereParts.push(`${column} >= ?`);
    bindings.push(from);
  }
  if (to) {
    whereParts.push(`${column} <= ?`);
    bindings.push(to);
  }
}

function buildWhereClause(whereParts) {
  return whereParts.length ? ` WHERE ${whereParts.join(' AND ')}` : '';
}

async function findExistingRow(env, sql, bindings = []) {
  const rows = await safeAll(env, sql, bindings);
  return rows[0] || null;
}

function getActorId(teacher) {
  return teacher?.id || teacher?.login_id || teacher?.name || 'admin';
}

function positiveAmountOrNull(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return null;
  return Math.round(amount);
}

// 조정 금액은 부호를 보존한다(할인 음수·추가 청구 양수).
function toSignedAdjustmentAmount(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return null;
  return Math.round(amount);
}

async function getRowById(env, table, id) {
  return findExistingRow(env, `SELECT * FROM ${table} WHERE id = ? LIMIT 1`, [id]);
}

async function patchExistingRow(env, table, id, data, allowedKeys) {
  const existing = await getRowById(env, table, id);
  if (!existing) return { error: 'not_found' };
  const updated = await patchById(env, table, id, data, allowedKeys);
  return { existing, updated };
}

function validateRequiredText(value) {
  return String(value || '').trim();
}

function parseYearMonth(url) {
  const now = new Date();
  const year = toInt(url.searchParams.get('year'), now.getUTCFullYear());
  const month = toInt(url.searchParams.get('month'), now.getUTCMonth() + 1);
  if (year < 2000 || year > 2100 || month < 1 || month > 12) return null;
  return { year, month, ym: `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}` };
}

function sumRows(rows, key = 'amount') {
  return (rows || []).reduce((sum, row) => sum + toInt(row?.[key], 0), 0);
}

function addGrouped(target, key, amount) {
  const cleanKey = String(key || 'unknown').trim() || 'unknown';
  target[cleanKey] = (target[cleanKey] || 0) + toInt(amount, 0);
}

// SQL 식별자는 바인딩이 불가능하므로 화이트리스트 패턴으로 검증한다.
const SQL_IDENTIFIER_RE = /^[A-Za-z_][A-Za-z0-9_]*$/;

function assertSqlIdentifiers(keys) {
  for (const key of keys) {
    if (!SQL_IDENTIFIER_RE.test(key)) throw new Error(`Invalid SQL identifier: ${key}`);
  }
}

async function patchById(env, table, id, data, allowedKeys) {
  const row = {};
  for (const key of allowedKeys) {
    if (Object.prototype.hasOwnProperty.call(data, key) && data[key] !== undefined) {
      row[key] = data[key];
    }
  }
  row.updated_at = new Date().toISOString();
  const keys = Object.keys(row);
  if (!keys.length) return null;
  assertSqlIdentifiers([table, ...keys]);
  await env.DB.prepare(`UPDATE ${table} SET ${keys.map(k => `${k} = ?`).join(', ')} WHERE id = ?`)
    .bind(...keys.map(k => row[k]), id)
    .run();
  return { id, ...row };
}

async function insertRow(env, table, row) {
  const keys = Object.keys(row);
  assertSqlIdentifiers([table, ...keys]);
  await env.DB.prepare(`INSERT INTO ${table} (${keys.join(', ')}) VALUES (${keys.map(() => '?').join(', ')})`)
    .bind(...keys.map(k => row[k]))
    .run();
  return row;
}

function insertStatement(env, table, row) {
  const keys = Object.keys(row);
  assertSqlIdentifiers([table, ...keys]);
  return env.DB.prepare(`INSERT INTO ${table} (${keys.join(', ')}) VALUES (${keys.map(() => '?').join(', ')})`)
    .bind(...keys.map(k => row[k]));
}

// 결정론적 PK + INSERT OR IGNORE = 청구 확정의 재실행 안전(체크포인트) 삽입.
// unique index(idx_payments_run_enrollment)와 결합해 중복 발행을 DB에서 차단한다.
function insertOrIgnoreStatement(env, table, row) {
  const keys = Object.keys(row);
  assertSqlIdentifiers([table, ...keys]);
  return env.DB.prepare(`INSERT OR IGNORE INTO ${table} (${keys.join(', ')}) VALUES (${keys.map(() => '?').join(', ')})`)
    .bind(...keys.map(k => row[k]));
}

function isUniqueConstraintError(error) {
  return /unique constraint/i.test(String(error?.message || ''));
}

function buildBillingRunScopeKey(year, month, branch) {
  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}|${branch}`;
}

// ── 일마감·월마감 (LOOP 5) ──
// closed 기간의 금액 기록은 생성·수정·취소할 수 없다(423). 재오픈 후에만 처리 가능.

async function findClosedPeriod(env, isoDate, branch = '') {
  const day = String(isoDate || '').slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day) && !/^\d{4}-\d{2}$/.test(String(isoDate || ''))) return null;
  const month = /^\d{4}-\d{2}$/.test(String(isoDate || '')) ? String(isoDate) : day.slice(0, 7);
  const whereBranch = branch ? "AND (branch = 'all' OR branch = ?)" : '';
  const bindings = [day, month];
  if (branch) bindings.push(branch);
  return findExistingRow(env, `
    SELECT id, period_type, period_key, branch FROM billing_period_closings
    WHERE status = 'closed'
      AND ((period_type = 'day' AND period_key = ?) OR (period_type = 'month' AND period_key = ?))
      ${whereBranch}
    LIMIT 1
  `, bindings);
}

function closedPeriodResponse(closing) {
  return jsonResponse({
    success: false,
    error: `마감된 기간(${closing.period_key})의 금액 기록은 생성·수정·취소할 수 없습니다. 재오픈 승인 후 처리해 주세요.`,
    code: 'BILLING_PERIOD_CLOSED',
    period_type: closing.period_type,
    period_key: closing.period_key
  }, 423);
}

// 일·월 집계의 단일 기준: 원장 SQL. summary 테이블은 이 계산 결과로만 upsert된다.
async function computeLedgerPeriodTotals(env, periodType, periodKey, branch) {
  const like = periodType === 'day' ? periodKey : `${periodKey}-%`;
  const branchFilter = branch && branch !== 'all' ? "AND COALESCE(branch, 'apmath') = ?" : '';
  const branchBindings = branch && branch !== 'all' ? [branch] : [];

  const tx = await findExistingRow(env, `
    SELECT
      COALESCE(SUM(CASE WHEN transaction_type IN ('payment', 'partial_payment') THEN amount END), 0) AS collected,
      COALESCE(SUM(CASE WHEN transaction_type = 'carryover_in' THEN amount END), 0) AS carryover_in,
      COALESCE(SUM(CASE WHEN transaction_type = 'carryover_out' THEN amount END), 0) AS carryover_out
    FROM payment_transactions
    WHERE status = 'completed' AND transaction_date LIKE ? ${branchFilter}
  `, [like, ...branchBindings]);
  const refunds = await findExistingRow(env, `
    SELECT COALESCE(SUM(refund_amount), 0) AS refunded
    FROM refund_records WHERE status = 'completed' AND refund_date LIKE ? ${branchFilter}
  `, [like, ...branchBindings]);
  const methodRows = await safeAll(env, `
    SELECT method_key, COALESCE(SUM(amount), 0) AS amount
    FROM payment_transactions
    WHERE status = 'completed' AND transaction_type IN ('payment', 'partial_payment')
      AND transaction_date LIKE ? ${branchFilter}
    GROUP BY method_key ORDER BY method_key ASC
  `, [like, ...branchBindings]);
  const byMethod = {};
  for (const row of methodRows) byMethod[String(row.method_key || 'other')] = toInt(row.amount, 0);

  // 청구액·미수금·할인은 월 개념(청구는 연월 단위 발행). 일 집계에서는 0으로 둔다.
  let billed = 0;
  let outstanding = 0;
  let discount = 0;
  if (periodType === 'month') {
    const year = Number(periodKey.slice(0, 4));
    const month = Number(periodKey.slice(5, 7));
    const paymentBranchFilter = branch && branch !== 'all'
      ? "AND EXISTS (SELECT 1 FROM payment_items pi WHERE pi.payment_id = p.id AND COALESCE(pi.branch, 'apmath') = ?)"
      : '';
    const billedRow = await findExistingRow(env, `
      SELECT
        COALESCE(SUM(p.total_amount), 0) AS billed,
        COALESCE(SUM(MAX(p.total_amount - COALESCE(p.paid_amount, 0), 0)), 0) AS outstanding
      FROM payments p
      WHERE p.year = ? AND p.month = ? ${paymentBranchFilter}
    `, [year, month, ...branchBindings]);
    billed = toInt(billedRow?.billed, 0);
    outstanding = toInt(billedRow?.outstanding, 0);
    const discountRow = await findExistingRow(env, `
      SELECT COALESCE(SUM(-ba.amount), 0) AS discount
      FROM billing_adjustments ba
      JOIN payments p ON p.id = ba.payment_id
      WHERE COALESCE(ba.status, 'active') = 'active' AND ba.amount < 0
        AND p.year = ? AND p.month = ? ${paymentBranchFilter}
    `, [year, month, ...branchBindings]);
    discount = toInt(discountRow?.discount, 0);
  }

  return {
    collected: toInt(tx?.collected, 0),
    carryover_in: toInt(tx?.carryover_in, 0),
    carryover_out: toInt(tx?.carryover_out, 0),
    refunded: toInt(refunds?.refunded, 0),
    by_method: byMethod,
    billed,
    outstanding,
    discount
  };
}

// 마감 스냅샷: 원장(거래·환불) 합계와 자동 장부 합계를 함께 저장하고, 불일치면 마감을 거부한다.
async function computeClosingSnapshot(env, periodType, periodKey, branch) {
  const like = periodType === 'day' ? periodKey : `${periodKey}-%`;
  const branchFilter = branch && branch !== 'all' ? "AND COALESCE(branch, 'apmath') = ?" : '';
  const branchBindings = branch && branch !== 'all' ? [branch] : [];

  const ledger = await findExistingRow(env, `
    SELECT
      COALESCE(SUM(CASE WHEN transaction_type IN ('payment', 'partial_payment') THEN amount ELSE 0 END), 0) AS collected,
      COALESCE(SUM(CASE WHEN transaction_type = 'carryover_in' THEN amount ELSE 0 END), 0) AS carryover_in,
      COALESCE(SUM(CASE WHEN transaction_type = 'carryover_out' THEN amount ELSE 0 END), 0) AS carryover_out
    FROM payment_transactions
    WHERE status = 'completed' AND transaction_date LIKE ? ${branchFilter}
  `, [like, ...branchBindings]);
  const refunds = await findExistingRow(env, `
    SELECT COALESCE(SUM(refund_amount), 0) AS refunded
    FROM refund_records
    WHERE status = 'completed' AND refund_date LIKE ? ${branchFilter}
  `, [like, ...branchBindings]);
  const cashbook = await findExistingRow(env, `
    SELECT
      COALESCE(SUM(CASE WHEN source_type = 'payment_transaction' THEN amount ELSE 0 END), 0) AS auto_income,
      COALESCE(SUM(CASE WHEN source_type = 'refund_record' THEN amount ELSE 0 END), 0) AS auto_refund,
      COALESCE(SUM(CASE WHEN entry_type = 'income' THEN amount ELSE 0 END), 0) AS income,
      COALESCE(SUM(CASE WHEN entry_type = 'expense' THEN amount ELSE 0 END), 0) AS expense
    FROM cashbook_entries
    WHERE COALESCE(status, 'active') = 'active' AND is_active = 1 AND entry_date LIKE ? ${branchFilter}
  `, [like, ...branchBindings]);
  const billed = periodType === 'month'
    ? await findExistingRow(env, `
        SELECT COALESCE(SUM(total_amount), 0) AS billed, COUNT(*) AS payments_count
        FROM payments WHERE year = ? AND month = ?
      `, [Number(periodKey.slice(0, 4)), Number(periodKey.slice(5, 7))])
    : { billed: null, payments_count: null };

  const snapshot = {
    period_type: periodType,
    period_key: periodKey,
    branch,
    collected: toInt(ledger?.collected, 0),
    carryover_in: toInt(ledger?.carryover_in, 0),
    carryover_out: toInt(ledger?.carryover_out, 0),
    refunded: toInt(refunds?.refunded, 0),
    cashbook_auto_income: toInt(cashbook?.auto_income, 0),
    cashbook_auto_refund: toInt(cashbook?.auto_refund, 0),
    cashbook_income: toInt(cashbook?.income, 0),
    cashbook_expense: toInt(cashbook?.expense, 0),
    billed: billed?.billed === null ? null : toInt(billed?.billed, 0),
    payments_count: billed?.payments_count === null ? null : toInt(billed?.payments_count, 0),
    computed_at: new Date().toISOString()
  };
  // 대사: 완료 수납 = 자동 장부 수입, 완료 환불 = 자동 장부 환불. 어긋나면 마감 불가.
  const mismatches = [];
  if (snapshot.collected !== snapshot.cashbook_auto_income) {
    mismatches.push({ field: 'collected_vs_cashbook', ledger: snapshot.collected, cashbook: snapshot.cashbook_auto_income });
  }
  if (snapshot.refunded !== snapshot.cashbook_auto_refund) {
    mismatches.push({ field: 'refunded_vs_cashbook', ledger: snapshot.refunded, cashbook: snapshot.cashbook_auto_refund });
  }
  return { snapshot, mismatches };
}

function conditionalInsertStatement(env, table, row, conditionSql, conditionBindings = []) {
  const keys = Object.keys(row);
  assertSqlIdentifiers([table, ...keys]);
  return env.DB.prepare(`
    INSERT INTO ${table} (${keys.join(', ')})
    SELECT ${keys.map(() => '?').join(', ')}
    WHERE ${conditionSql}
  `).bind(...keys.map(k => row[k]), ...conditionBindings);
}

function auditLogStatement(env, teacher, { entity_type, entity_id, action, before = null, after = null, reason = null }) {
  return insertStatement(env, 'billing_audit_logs', {
    id: makeId('bal'),
    entity_type,
    entity_id,
    action,
    before_json: before === null ? null : JSON.stringify(before),
    after_json: after === null ? null : JSON.stringify(after),
    reason: reason || null,
    actor_id: getActorId(teacher),
    created_at: new Date().toISOString()
  });
}

function conditionalAuditLogStatement(env, teacher, entry, sourceTable, sourceId) {
  const row = {
    id: makeId('bal'),
    entity_type: entry.entity_type,
    entity_id: entry.entity_id,
    action: entry.action,
    before_json: entry.before === null || entry.before === undefined ? null : JSON.stringify(entry.before),
    after_json: entry.after === null || entry.after === undefined ? null : JSON.stringify(entry.after),
    reason: entry.reason || null,
    actor_id: getActorId(teacher),
    created_at: new Date().toISOString()
  };
  assertSqlIdentifiers([sourceTable]);
  return conditionalInsertStatement(env, 'billing_audit_logs', row, `EXISTS (SELECT 1 FROM ${sourceTable} WHERE id = ?)`, [sourceId]);
}

async function writeAuditLog(env, teacher, entry) {
  await env.DB.batch([auditLogStatement(env, teacher, entry)]);
}

export function buildPaymentSettlementUpdateQuery(paymentId, at = new Date().toISOString()) {
  const creditMarkers = SETTLEMENT_CREDIT_TYPES.map(() => '?').join(', ');
  const debitMarkers = SETTLEMENT_DEBIT_TYPES.map(() => '?').join(', ');
  const creditSum = `COALESCE((
    SELECT SUM(pt.amount) FROM payment_transactions pt
    WHERE pt.payment_id = payments.id AND pt.status = 'completed'
      AND pt.transaction_type IN (${creditMarkers})
  ), 0)`;
  const refundSum = `COALESCE((
    SELECT SUM(rr.refund_amount) FROM refund_records rr
    WHERE rr.payment_id = payments.id AND rr.status = 'completed'
  ), 0)`;
  // 완료 유출 = 완료 환불 + carryover_out (금액 불변식 §3.1, LOOP 4에서 반영)
  const debitSum = `COALESCE((
    SELECT SUM(pt.amount) FROM payment_transactions pt
    WHERE pt.payment_id = payments.id AND pt.status = 'completed'
      AND pt.transaction_type IN (${debitMarkers})
  ), 0)`;
  const effective = `MAX((${creditSum}) - (${refundSum}) - (${debitSum}), 0)`;
  const lastCreditDate = `(
    SELECT MAX(pt.transaction_date) FROM payment_transactions pt
    WHERE pt.payment_id = payments.id AND pt.status = 'completed'
      AND pt.transaction_type IN (${creditMarkers})
  )`;
  const sql = `
    UPDATE payments
    SET paid_amount = MIN(total_amount, ${effective}),
        status = CASE
          WHEN total_amount > 0 AND ${effective} >= total_amount THEN 'paid'
          WHEN ${effective} > 0 THEN 'partial'
          ELSE 'unpaid'
        END,
        paid_date = CASE
          WHEN total_amount > 0 AND ${effective} >= total_amount THEN ${lastCreditDate}
          ELSE NULL
        END,
        updated_at = ?
    WHERE id = ?
  `;
  const perEffective = [...SETTLEMENT_CREDIT_TYPES, ...SETTLEMENT_DEBIT_TYPES];
  const bindings = [
    // paid_amount, status(2회), paid_date CASE 조건, lastCreditDate 순서로 effective가 4번 + credit 1번 등장
    ...perEffective,
    ...perEffective,
    ...perEffective,
    ...perEffective,
    ...SETTLEMENT_CREDIT_TYPES,
    at,
    paymentId
  ];
  return { sql, bindings };
}

function paymentSettlementUpdateStatement(env, paymentId, at = new Date().toISOString()) {
  const query = buildPaymentSettlementUpdateQuery(paymentId, at);
  return env.DB.prepare(query.sql).bind(...query.bindings);
}

// 자동 생성 장부 판정: 신규 자동 경로만 source_type을 기록하므로 이 값으로만 판정한다.
// (기존 수기 행이 payment_transaction_id를 참조해도 수동 항목으로 유지)
function isAutoCashbookEntry(entry) {
  if (!entry) return false;
  return ['payment_transaction', 'refund_record'].includes(String(entry.source_type || ''));
}

// 미리보기는 읽기 전용이다. 조회 후 순수 계산기(billing-calculation.js)에 위임하며
// 어떤 금액 테이블(payments/payment_items/billing_adjustments)도 변경하지 않는다.
// 청구 확정(billing-runs POST)도 같은 함수로 서버에서 재계산한다 — 클라이언트 합계 불신.
async function computeServerBillingPreview(env, year, month) {
  const enrollments = await safeAll(env, `
    SELECT
      se.id AS enrollment_id,
      se.student_id,
      se.branch,
      se.class_id,
      se.status,
      se.start_date,
      se.end_date,
      se.tuition_amount,
      s.name AS student_name,
      c.name AS class_name
    FROM student_enrollments se
    LEFT JOIN students s ON s.id = se.student_id
    LEFT JOIN classes c ON c.id = se.class_id
    WHERE se.status = 'active'
    ORDER BY se.student_id ASC, se.class_id ASC, se.id ASC
  `);

  const templates = await safeAll(env, `
    SELECT * FROM billing_templates WHERE is_active = 1 ORDER BY id ASC
  `);

  const policyRules = await safeAll(env, `
    SELECT * FROM billing_policy_rules
    WHERE is_active = 1 AND rule_type = 'tuition'
    ORDER BY id ASC
  `);

  const normalizedEnrollments = enrollments.map((e) => ({
    ...e,
    branch: normalizeBranchForAccounting(e.branch, 'apmath')
  }));

  return calculateBillingPreview({
    year,
    month,
    enrollments: normalizedEnrollments,
    templates,
    policyRules
  });
}

async function getBillingPreview(env, year, month) {
  const preview = await computeServerBillingPreview(env, year, month);

  // 구 응답 표면 유지(students_count/items_count/total_amount/preview_items).
  const legacyItems = preview.invoices.flatMap((invoice) =>
    invoice.items.map((item) => ({
      student_id: invoice.student_id,
      student_name: invoice.student_name,
      branch: item.branch,
      class_id: item.class_id,
      class_name: item.class_name,
      item_name: item.name,
      amount: item.amount,
      reason: item.basis
    }))
  );

  return {
    success: true,
    ...preview,
    students_count: preview.totals.students_count,
    items_count: preview.totals.items_count,
    total_amount: preview.totals.billed_total,
    preview_items: legacyItems
  };
}

async function getAccountingSummary(env, year, month, branch = '') {
  const ym = `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}`;
  const branchFilter = branch && branch !== 'all' ? normalizeBranchForAccounting(branch, 'apmath') : '';

  const paymentWhere = ['p.year = ?', 'p.month = ?'];
  const paymentBindings = [year, month];
  if (branchFilter) {
    paymentWhere.push("EXISTS (SELECT 1 FROM payment_items pi WHERE pi.payment_id = p.id AND COALESCE(pi.branch, 'apmath') = ?)");
    paymentBindings.push(branchFilter);
  }
  const billedRows = await safeAll(env, `
    SELECT COALESCE(SUM(total_amount), 0) AS total_billed
    FROM payments p
    WHERE ${paymentWhere.join(' AND ')}
  `, paymentBindings);

  const itemWhere = ['p.year = ?', 'p.month = ?'];
  const itemBindings = [year, month];
  if (branchFilter) {
    itemWhere.push("COALESCE(pi.branch, 'apmath') = ?");
    itemBindings.push(branchFilter);
  }
  const itemBranchRows = await safeAll(env, `
    SELECT COALESCE(pi.branch, 'apmath') AS branch, COALESCE(SUM(pi.amount), 0) AS amount
    FROM payment_items pi
    JOIN payments p ON p.id = pi.payment_id
    WHERE ${itemWhere.join(' AND ')}
    GROUP BY COALESCE(pi.branch, 'apmath')
  `, itemBindings);

  const transactionWhere = ['transaction_date LIKE ?'];
  const transactionBindings = [`${ym}%`];
  if (branchFilter) {
    transactionWhere.push('COALESCE(branch, ?) = ?');
    transactionBindings.push('apmath', branchFilter);
  }
  const paidRows = await safeAll(env, `
    SELECT
      COALESCE(SUM(CASE WHEN transaction_type IN ('payment', 'partial_payment', 'carryover_in') AND status = 'completed' THEN amount ELSE 0 END), 0) AS total_paid,
      COALESCE(SUM(CASE WHEN transaction_type = 'refund' AND status = 'completed' THEN amount ELSE 0 END), 0) AS total_refunded
    FROM payment_transactions
    WHERE ${transactionWhere.join(' AND ')}
  `, transactionBindings);

  const refundWhere = ['refund_date LIKE ?', "status = 'completed'"];
  const refundBindings = [`${ym}%`];
  if (branchFilter) {
    refundWhere.push('COALESCE(branch, ?) = ?');
    refundBindings.push('apmath', branchFilter);
  }
  const refundRows = await safeAll(env, `
    SELECT COALESCE(SUM(refund_amount), 0) AS total_refunded
    FROM refund_records
    WHERE ${refundWhere.join(' AND ')}
  `, refundBindings);

  const methodRows = await safeAll(env, `
    SELECT method_key, COALESCE(SUM(amount), 0) AS amount
    FROM payment_transactions
    WHERE ${transactionWhere.join(' AND ')} AND status = 'completed'
    GROUP BY method_key
  `, transactionBindings);

  const statusRows = await safeAll(env, `
    SELECT COALESCE(status, 'unknown') AS status, COALESCE(SUM(amount), 0) AS amount
    FROM payment_transactions
    WHERE ${transactionWhere.join(' AND ')}
    GROUP BY COALESCE(status, 'unknown')
  `, transactionBindings);

  const transactionBranchRows = await safeAll(env, `
    SELECT COALESCE(branch, 'apmath') AS branch, COALESCE(SUM(amount), 0) AS amount
    FROM payment_transactions
    WHERE ${transactionWhere.join(' AND ')} AND status = 'completed'
    GROUP BY COALESCE(branch, 'apmath')
  `, transactionBindings);

  const carryoverWhere = ['created_at LIKE ?', "status != 'cancelled'"];
  const carryoverBindings = [`${ym}%`];
  if (branchFilter) {
    carryoverWhere.push('COALESCE(branch, ?) = ?');
    carryoverBindings.push('apmath', branchFilter);
  }
  const carryoverRows = await safeAll(env, `
    SELECT COALESCE(SUM(amount), 0) AS total_carryover
    FROM carryover_records
    WHERE ${carryoverWhere.join(' AND ')}
  `, carryoverBindings);

  const cashbookWhere = ['entry_date LIKE ?', 'COALESCE(is_active, 1) = 1', "COALESCE(status, 'active') != 'cancelled'"];
  const cashbookBindings = [`${ym}%`];
  if (branchFilter) {
    cashbookWhere.push('COALESCE(branch, ?) = ?');
    cashbookBindings.push('apmath', branchFilter);
  }
  const cashRows = await safeAll(env, `
    SELECT
      COALESCE(SUM(CASE WHEN entry_type = 'income' THEN amount ELSE 0 END), 0) AS cashbook_income,
      COALESCE(SUM(CASE WHEN entry_type = 'expense' THEN amount ELSE 0 END), 0) AS cashbook_expense
    FROM cashbook_entries
    WHERE ${cashbookWhere.join(' AND ')}
  `, cashbookBindings);

  const categoryRows = await safeAll(env, `
    SELECT category, COALESCE(SUM(amount), 0) AS amount
    FROM cashbook_entries
    WHERE ${cashbookWhere.join(' AND ')}
    GROUP BY category
  `, cashbookBindings);

  const totalBilled = toInt(billedRows[0]?.total_billed, 0);
  const totalPaid = toInt(paidRows[0]?.total_paid, 0);
  const transactionRefunded = toInt(paidRows[0]?.total_refunded, 0);
  const recordedRefunded = toInt(refundRows[0]?.total_refunded, 0);

  // refund_records is the canonical refund ledger.
  // payment_transactions.transaction_type='refund' is kept as a compatibility fallback
  // for older rows that may not yet have a refund_records row.
  const totalRefunded = recordedRefunded > 0 ? recordedRefunded : transactionRefunded;
  const totalCarryover = toInt(carryoverRows[0]?.total_carryover, 0);
  const cashbookIncome = toInt(cashRows[0]?.cashbook_income, 0);
  const cashbookExpense = toInt(cashRows[0]?.cashbook_expense, 0);

  const byMethod = {};
  for (const row of methodRows) addGrouped(byMethod, row.method_key, row.amount);

  const byStatus = {};
  for (const row of statusRows) addGrouped(byStatus, row.status, row.amount);

  const byBranch = {};
  for (const row of itemBranchRows) addGrouped(byBranch, row.branch, row.amount);
  for (const row of transactionBranchRows) {
    if (!Object.prototype.hasOwnProperty.call(byBranch, row.branch)) addGrouped(byBranch, row.branch, 0);
  }

  const byCategory = {};
  for (const row of categoryRows) addGrouped(byCategory, row.category, row.amount);

  // Refunded money leaves the paid balance again, so it increases the remaining outstanding amount.
  const totalOutstanding = Math.max(0, totalBilled - totalPaid + totalRefunded);

  return {
    success: true,
    year,
    month,
    total_billed: totalBilled,
    total_paid: totalPaid,
    total_refunded: totalRefunded,
    total_carryover: totalCarryover,
    total_outstanding: totalOutstanding,
    cashbook_income: cashbookIncome,
    cashbook_expense: cashbookExpense,
    net_cashflow: cashbookIncome - cashbookExpense,
    by_method: byMethod,
    by_status: byStatus,
    by_branch: byBranch,
    by_category: byCategory
  };
}

export async function handleBillingAccountingFoundation(request, env, teacher, path, url, body = null) {
  const method = request.method;
  const sub = normalizeFoundationSub(path[2] || '');
  const id = path[3] || '';
  const action = String(path[4] || '').trim().toLowerCase();

  // 역할별 금액 권한: 메뉴 숨김이 아니라 모든 금액 API에서 capability를 검사한다.
  // admin = 전체 capability. teacher = staff_permissions의 billing.* 키로 부여.
  // capability 매핑이 없는 리소스(결제수단·정책·템플릿 등 설정 변경)는 admin 전용.
  const requiredCapability = requiredBillingCapability(sub, method, action);
  if (!isAdminUser(teacher)) {
    if (requiredCapability === null) return jsonResponse({ error: 'Forbidden' }, 403);
    const capabilities = await getBillingCapabilities(env, teacher);
    if (!capabilities.has(requiredCapability)) {
      return jsonResponse({
        success: false,
        error: `이 작업에는 ${requiredCapability} 권한이 필요합니다.`,
        code: 'BILLING_FORBIDDEN',
        required_capability: requiredCapability
      }, 403);
    }
  }

  const data = body || (['POST', 'PATCH'].includes(method) ? await readJsonBody(request) : {});

  if (sub === 'billing-templates') {
    if (method === 'GET') {
      const whereParts = [];
      const bindings = [];
      const branch = url.searchParams.get('branch') ? normalizeBranchForAccounting(url.searchParams.get('branch'), 'all') : '';
      const itemType = String(url.searchParams.get('item_type') || url.searchParams.get('template_type') || '').trim().toLowerCase();
      pushBranchFilter(whereParts, bindings, branch);
      if (url.searchParams.get('active') === '1' || url.searchParams.get('is_active') === '1') {
        whereParts.push('is_active = 1');
      }
      if (itemType) {
        whereParts.push('LOWER(COALESCE(item_type, ?)) = ?');
        bindings.push('', itemType);
      }
      const billingTemplates = await safeAll(
        env,
        `SELECT * FROM billing_templates${buildWhereClause(whereParts)} ORDER BY branch ASC, item_type ASC, name ASC, created_at DESC LIMIT ?`,
        [...bindings, parseLimit(url)]
      );
      return jsonResponse({ success: true, billing_templates: billingTemplates });
    }

    if (method === 'POST') {
      const name = validateRequiredText(data.name);
      if (!name) return jsonResponse({ success: false, error: 'name required' }, 400);
      const defaultAmount = toInt(data.default_amount, -1);
      if (defaultAmount < 0) return jsonResponse({ success: false, error: 'default_amount must be a non-negative integer' }, 400);
      const row = {
        id: data.id || makeId('bt'),
        branch: normalizeBranchForAccounting(data.branch, 'apmath'),
        class_id: validateRequiredText(data.class_id) || null,
        name,
        default_amount: defaultAmount,
        item_type: String(data.item_type || 'tuition').trim().toLowerCase() || 'tuition',
        is_active: data.is_active === undefined ? 1 : toInt(data.is_active, 1),
        memo: data.memo || null
      };
      const inserted = await insertRow(env, 'billing_templates', row);
      await writeAuditLog(env, teacher, {
        entity_type: 'billing_template',
        entity_id: row.id,
        action: 'create',
        after: row
      });
      return jsonResponse({ success: true, id: row.id, billing_template: inserted });
    }

    if (method === 'PATCH' && id) {
      // 과거 규칙은 삭제하지 않는다 — 비활성화만 허용(DELETE 미지원).
      if (action === 'deactivate') {
        const result = await patchExistingRow(env, 'billing_templates', id, { is_active: 0 }, ['is_active']);
        if (result.error === 'not_found') return jsonResponse({ success: false, error: 'billing template not found' }, 404);
        await writeAuditLog(env, teacher, {
          entity_type: 'billing_template',
          entity_id: id,
          action: 'deactivate',
          before: result.existing,
          after: { is_active: 0 }
        });
        return jsonResponse({ success: true, id, is_active: 0, billing_template: result.updated });
      }
      const patch = { ...data };
      if (Object.prototype.hasOwnProperty.call(patch, 'branch')) patch.branch = normalizeBranchForAccounting(patch.branch, 'apmath');
      if (Object.prototype.hasOwnProperty.call(patch, 'class_id')) patch.class_id = validateRequiredText(patch.class_id) || null;
      if (Object.prototype.hasOwnProperty.call(patch, 'item_type')) patch.item_type = String(patch.item_type || 'tuition').trim().toLowerCase() || 'tuition';
      if (Object.prototype.hasOwnProperty.call(patch, 'is_active')) patch.is_active = toInt(patch.is_active, 1);
      if (Object.prototype.hasOwnProperty.call(patch, 'default_amount')) {
        const nextAmount = toInt(patch.default_amount, -1);
        if (nextAmount < 0) return jsonResponse({ success: false, error: 'default_amount must be a non-negative integer' }, 400);
        patch.default_amount = nextAmount;
      }
      if (Object.prototype.hasOwnProperty.call(patch, 'name') && !validateRequiredText(patch.name)) {
        return jsonResponse({ success: false, error: 'name required' }, 400);
      }
      const result = await patchExistingRow(env, 'billing_templates', id, patch, ['branch', 'class_id', 'name', 'default_amount', 'item_type', 'is_active', 'memo']);
      if (result.error === 'not_found') return jsonResponse({ success: false, error: 'billing template not found' }, 404);
      await writeAuditLog(env, teacher, {
        entity_type: 'billing_template',
        entity_id: id,
        action: 'update',
        before: result.existing,
        after: result.updated
      });
      return jsonResponse({ success: true, billing_template: result.updated });
    }
    return jsonResponse({ error: 'Method Not Allowed' }, 405);
  }

  if (sub === 'payments') {
    if (method === 'GET') {
      const whereParts = [];
      const bindings = [];
      const studentId = String(url.searchParams.get('student_id') || '').trim();
      const branch = url.searchParams.get('branch') ? normalizeBranchForAccounting(url.searchParams.get('branch'), 'apmath') : '';
      const status = String(url.searchParams.get('status') || '').trim().toLowerCase();
      const year = url.searchParams.get('year');
      const month = url.searchParams.get('month');
      if (studentId) {
        whereParts.push('student_id = ?');
        bindings.push(studentId);
      }
      if (branch && branch !== 'all') {
        whereParts.push("EXISTS (SELECT 1 FROM payment_items pi WHERE pi.payment_id = payments.id AND COALESCE(pi.branch, 'apmath') = ?)");
        bindings.push(branch);
      }
      if (year && /^\d{4}$/.test(String(year).trim())) {
        whereParts.push('year = ?');
        bindings.push(toInt(year, 0));
      }
      if (month) {
        const monthValue = toInt(month, 0);
        if (monthValue >= 1 && monthValue <= 12) {
          whereParts.push('month = ?');
          bindings.push(monthValue);
        }
      }
      if (status) {
        whereParts.push('LOWER(status) = ?');
        bindings.push(status);
      }
      pushDateRangeFilter(whereParts, bindings, 'DATE(created_at)', url);
      const payments = await safeAll(
        env,
        `SELECT * FROM payments${buildWhereClause(whereParts)} ORDER BY year DESC, month DESC, created_at DESC LIMIT ?`,
        [...bindings, parseLimit(url)]
      );
      return jsonResponse({ success: true, payments });
    }
    return jsonResponse({ error: 'Method Not Allowed' }, 405);
  }

  if (sub === 'payment-items') {
    if (method === 'GET') {
      const whereParts = [];
      const bindings = [];
      const paymentId = String(url.searchParams.get('payment_id') || '').trim();
      const studentId = String(url.searchParams.get('student_id') || '').trim();
      const branch = url.searchParams.get('branch') ? normalizeBranchForAccounting(url.searchParams.get('branch'), 'apmath') : '';
      const itemType = String(url.searchParams.get('item_type') || '').trim().toLowerCase();
      if (paymentId) {
        whereParts.push('payment_id = ?');
        bindings.push(paymentId);
      }
      if (studentId) {
        whereParts.push('EXISTS (SELECT 1 FROM payments p WHERE p.id = payment_items.payment_id AND p.student_id = ?)');
        bindings.push(studentId);
      }
      pushBranchFilter(whereParts, bindings, branch);
      if (itemType) {
        whereParts.push('LOWER(COALESCE(item_type, ?)) = ?');
        bindings.push('', itemType);
      }
      const paymentItems = await safeAll(
        env,
        `SELECT * FROM payment_items${buildWhereClause(whereParts)} ORDER BY created_at DESC LIMIT ?`,
        [...bindings, parseLimit(url)]
      );
      return jsonResponse({ success: true, payment_items: paymentItems });
    }
    return jsonResponse({ error: 'Method Not Allowed' }, 405);
  }

  if (sub === 'billing-adjustments') {
    // 조정 부호 계약(§3.1): 할인·장학·감면·차감 = 음수 / 추가 청구·교재비·특강비 = 양수.
    const NEGATIVE_ADJUSTMENT_TYPES = new Set(['discount', 'scholarship', 'waiver', 'reduction', 'deduction']);
    const POSITIVE_ADJUSTMENT_TYPES = new Set(['charge', 'extra', 'textbook', 'special_lecture', 'fee', 'penalty']);

    if (method === 'POST') {
      const paymentId = validateRequiredText(data.payment_id);
      const adjustmentType = String(data.adjustment_type || '').trim().toLowerCase();
      const name = validateRequiredText(data.name);
      const reason = validateRequiredText(data.reason);
      const amount = toSignedAdjustmentAmount(data.amount);
      if (!paymentId || !adjustmentType || !name) {
        return jsonResponse({ success: false, error: 'payment_id, adjustment_type and name required' }, 400);
      }
      if (!reason) {
        return jsonResponse({ success: false, error: '조정 사유를 입력해 주세요.', code: 'ADJUSTMENT_REASON_REQUIRED' }, 400);
      }
      if (amount === null || amount === 0) {
        return jsonResponse({ success: false, error: '조정 금액은 0이 아닌 정수여야 합니다.', code: 'ADJUSTMENT_AMOUNT_INVALID' }, 400);
      }
      if (NEGATIVE_ADJUSTMENT_TYPES.has(adjustmentType)) {
        if (amount > 0) return jsonResponse({ success: false, error: '할인·감면 조정은 음수 금액이어야 합니다.', code: 'ADJUSTMENT_SIGN_MISMATCH' }, 400);
      } else if (POSITIVE_ADJUSTMENT_TYPES.has(adjustmentType)) {
        if (amount < 0) return jsonResponse({ success: false, error: '추가 청구 조정은 양수 금액이어야 합니다.', code: 'ADJUSTMENT_SIGN_MISMATCH' }, 400);
      } else {
        return jsonResponse({ success: false, error: `지원하지 않는 조정 유형입니다: ${adjustmentType}`, code: 'ADJUSTMENT_TYPE_INVALID' }, 400);
      }
      const payment = await getRowById(env, 'payments', paymentId);
      if (!payment) return jsonResponse({ success: false, error: 'payment not found', code: 'PAYMENT_NOT_FOUND' }, 404);
      // 조정은 청구의 연월이 마감되면 불가(청구 합계 스냅샷 보호).
      const paymentMonthKey = `${String(payment.year).padStart(4, '0')}-${String(payment.month).padStart(2, '0')}`;
      const closedForAdjust = await findClosedPeriod(env, paymentMonthKey);
      if (closedForAdjust) return closedPeriodResponse(closedForAdjust);

      const idempotencyKey = validateRequiredText(data.idempotency_key || data.clientRequestId) || null;
      if (idempotencyKey) {
        const duplicate = await findExistingRow(env, 'SELECT * FROM billing_adjustments WHERE idempotency_key = ? LIMIT 1', [idempotencyKey]);
        if (duplicate) {
          return jsonResponse({ success: true, id: duplicate.id, adjustment: duplicate, code: 'ADJUSTMENT_DUPLICATE_IDEMPOTENCY_KEY' });
        }
      }
      const nowIso = new Date().toISOString();
      const row = {
        id: data.id || makeId('badj'),
        payment_id: paymentId,
        adjustment_type: adjustmentType,
        name,
        amount,
        reason,
        status: 'active',
        idempotency_key: idempotencyKey,
        approved_by: validateRequiredText(data.approved_by) || getActorId(teacher),
        created_by: getActorId(teacher),
        created_at: nowIso,
        updated_at: nowIso
      };
      // 청구금액은 0원 미만이 될 수 없다(불변식). 음수가 되면 조정 등록 자체를 거부한다.
      // 조정 삽입 → 청구금액 재계산 → 정산 재계산 → 감사 로그를 한 batch(원자적)로 처리.
      const negativeGuardSql = 'EXISTS (SELECT 1 FROM payments p WHERE p.id = ? AND p.total_amount + ? >= 0)';
      const adjustmentStatements = [
        conditionalInsertStatement(env, 'billing_adjustments', row, negativeGuardSql, [paymentId, amount]),
        env.DB.prepare(`
          UPDATE payments SET total_amount = total_amount + ?, updated_at = ?
          WHERE id = ? AND EXISTS (SELECT 1 FROM billing_adjustments ba WHERE ba.id = ?)
        `).bind(amount, nowIso, paymentId, row.id),
        paymentSettlementUpdateStatement(env, paymentId, nowIso),
        conditionalAuditLogStatement(env, teacher, {
          entity_type: 'billing_adjustment',
          entity_id: row.id,
          action: 'create',
          after: row,
          reason
        }, 'billing_adjustments', row.id)
      ];
      const adjustmentResults = await env.DB.batch(adjustmentStatements);
      if (Number(adjustmentResults?.[0]?.meta?.changes || 0) === 0) {
        return jsonResponse({
          success: false,
          error: '이 조정을 적용하면 청구금액이 0원 미만이 됩니다. 할인 금액을 확인해 주세요.',
          code: 'ADJUSTMENT_NEGATIVE_TOTAL'
        }, 409);
      }
      return jsonResponse({ success: true, id: row.id, adjustment: row, payment: await getRowById(env, 'payments', paymentId) });
    }

    if (method === 'PATCH' && id) {
      if (action !== 'cancel') {
        // 원행 수정 금지: 조정 정정은 취소 후 반대/신규 조정 행으로만.
        return jsonResponse({ success: false, error: '조정은 수정할 수 없습니다. 취소 후 새 조정을 등록해 주세요.', code: 'ADJUSTMENT_READONLY' }, 400);
      }
      const reason = validateRequiredText(data.reason || data.cancel_reason);
      if (!reason) return jsonResponse({ success: false, error: '조정 취소 사유를 입력해 주세요.', code: 'CANCEL_REASON_REQUIRED' }, 400);
      const existing = await getRowById(env, 'billing_adjustments', id);
      if (!existing) return jsonResponse({ success: false, error: 'adjustment not found' }, 404);
      if (String(existing.status || 'active') === 'cancelled') {
        return jsonResponse({ success: false, error: '이미 취소된 조정입니다.', code: 'ALREADY_CANCELLED' }, 400);
      }
      const adjustedPayment = await getRowById(env, 'payments', existing.payment_id);
      if (adjustedPayment) {
        const cancelMonthKey = `${String(adjustedPayment.year).padStart(4, '0')}-${String(adjustedPayment.month).padStart(2, '0')}`;
        const closedForAdjustCancel = await findClosedPeriod(env, cancelMonthKey);
        if (closedForAdjustCancel) return closedPeriodResponse(closedForAdjustCancel);
      }
      const cancelAmount = toInt(existing.amount, 0);
      const nowIso = new Date().toISOString();
      // 취소 = 조정 반영을 반대로 되돌림. 되돌린 청구금액이 음수가 되면 거부(먼저 다른 조정 정리 필요).
      const cancelStatements = [
        env.DB.prepare(`
          UPDATE billing_adjustments SET status = 'cancelled', cancelled_at = ?, cancel_reason = ?, updated_at = ?
          WHERE id = ? AND status = 'active'
            AND EXISTS (SELECT 1 FROM payments p WHERE p.id = ? AND p.total_amount - ? >= 0)
        `).bind(nowIso, reason, nowIso, id, existing.payment_id, cancelAmount),
        env.DB.prepare(`
          UPDATE payments SET total_amount = total_amount - ?, updated_at = ?
          WHERE id = ? AND EXISTS (SELECT 1 FROM billing_adjustments ba WHERE ba.id = ? AND ba.status = 'cancelled' AND ba.cancelled_at = ?)
        `).bind(cancelAmount, nowIso, existing.payment_id, id, nowIso),
        paymentSettlementUpdateStatement(env, existing.payment_id, nowIso),
        auditLogStatement(env, teacher, {
          entity_type: 'billing_adjustment',
          entity_id: id,
          action: 'cancel',
          before: existing,
          reason
        })
      ];
      const cancelResults = await env.DB.batch(cancelStatements);
      if (Number(cancelResults?.[0]?.meta?.changes || 0) === 0) {
        return jsonResponse({
          success: false,
          error: '조정을 취소할 수 없습니다. (동시 처리 충돌 또는 취소 시 청구금액이 음수가 됨)',
          code: 'ADJUSTMENT_CANCEL_CONFLICT'
        }, 409);
      }
      return jsonResponse({
        success: true,
        id,
        status: 'cancelled',
        adjustment: await getRowById(env, 'billing_adjustments', id),
        payment: await getRowById(env, 'payments', existing.payment_id)
      });
    }

    if (method === 'GET') {
      const whereParts = [];
      const bindings = [];
      const paymentId = String(url.searchParams.get('payment_id') || '').trim();
      const studentId = String(url.searchParams.get('student_id') || '').trim();
      const adjustmentType = String(url.searchParams.get('adjustment_type') || '').trim().toLowerCase();
      const adjustmentStatus = String(url.searchParams.get('status') || '').trim().toLowerCase();
      if (paymentId) {
        whereParts.push('payment_id = ?');
        bindings.push(paymentId);
      }
      if (studentId) {
        whereParts.push('EXISTS (SELECT 1 FROM payments p WHERE p.id = billing_adjustments.payment_id AND p.student_id = ?)');
        bindings.push(studentId);
      }
      if (adjustmentType) {
        whereParts.push('LOWER(adjustment_type) = ?');
        bindings.push(adjustmentType);
      }
      if (adjustmentStatus) {
        whereParts.push("LOWER(COALESCE(status, 'active')) = ?");
        bindings.push(adjustmentStatus);
      }
      pushDateRangeFilter(whereParts, bindings, 'DATE(created_at)', url);
      const billingAdjustments = await safeAll(
        env,
        `SELECT * FROM billing_adjustments${buildWhereClause(whereParts)} ORDER BY created_at DESC LIMIT ?`,
        [...bindings, parseLimit(url)]
      );
      return jsonResponse({ success: true, billing_adjustments: billingAdjustments });
    }
    return jsonResponse({ error: 'Method Not Allowed' }, 405);
  }

  if (sub === 'billing-runs') {
    if (method === 'GET') {
      const whereParts = [];
      const bindings = [];
      const branch = url.searchParams.get('branch') ? normalizeBranchForAccounting(url.searchParams.get('branch'), 'all') : '';
      const status = String(url.searchParams.get('status') || '').trim().toLowerCase();
      const year = url.searchParams.get('year');
      const month = url.searchParams.get('month');
      pushBranchFilter(whereParts, bindings, branch);
      if (year && /^\d{4}$/.test(String(year).trim())) {
        whereParts.push('year = ?');
        bindings.push(toInt(year, 0));
      }
      if (month) {
        const monthValue = toInt(month, 0);
        if (monthValue >= 1 && monthValue <= 12) {
          whereParts.push('month = ?');
          bindings.push(monthValue);
        }
      }
      if (status) {
        whereParts.push('LOWER(status) = ?');
        bindings.push(status);
      }
      const billingRuns = await safeAll(
        env,
        `SELECT * FROM billing_runs${buildWhereClause(whereParts)} ORDER BY year DESC, month DESC, created_at DESC LIMIT ?`,
        [...bindings, parseLimit(url)]
      );
      return jsonResponse({ success: true, billing_runs: billingRuns });
    }

    // 청구 확정(일괄 생성). draft = billing-preview(무쓰기), confirmed = billing_runs 행.
    // 서버가 미리보기를 재계산하며 클라이언트 합계를 신뢰하지 않는다.
    if (method === 'POST' && !id) {
      const year = toInt(data.year, 0);
      const month = toInt(data.month, 0);
      if (year < 2000 || year > 2100 || month < 1 || month > 12) {
        return jsonResponse({ success: false, error: 'invalid year/month', code: 'BILLING_RUN_INVALID_PERIOD' }, 400);
      }
      const branch = normalizeBranchForAccounting(data.branch, 'all');
      const idempotencyKey = validateRequiredText(data.idempotency_key || data.clientRequestId);
      if (!idempotencyKey) {
        return jsonResponse({ success: false, error: 'idempotency_key required', code: 'BILLING_RUN_IDEMPOTENCY_KEY_REQUIRED' }, 400);
      }
      const scopeKey = buildBillingRunScopeKey(year, month, branch);
      const closedForIssue = await findClosedPeriod(env, `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}`);
      if (closedForIssue) return closedPeriodResponse(closedForIssue);
      const nowIso = new Date().toISOString();

      let run = await findExistingRow(env, 'SELECT * FROM billing_runs WHERE idempotency_key = ? LIMIT 1', [idempotencyKey]);
      let alreadyConfirmed = false;
      let invoices = null;

      if (run) {
        // 같은 멱등키 재요청 = 재개(체크포인트). 다른 범위로 재사용은 거부.
        if (String(run.scope_key || '') !== scopeKey) {
          return jsonResponse({ success: false, error: 'idempotency key already used for a different scope', code: 'BILLING_RUN_IDEMPOTENCY_SCOPE_MISMATCH' }, 409);
        }
        if (run.cancelled_at) {
          return jsonResponse({ success: false, error: 'billing run cancelled', code: 'BILLING_RUN_CANCELLED' }, 409);
        }
        alreadyConfirmed = true;
        // 재개는 확정 당시 스냅샷 기준 — 이후 수강/규칙 변화가 발행분을 바꾸지 않는다.
        let storedSnapshot = null;
        try {
          storedSnapshot = JSON.parse(String(run.rule_snapshot_json || ''));
        } catch (e) {
          storedSnapshot = null;
        }
        invoices = Array.isArray(storedSnapshot?.invoices) ? storedSnapshot.invoices : null;
        if (!invoices) {
          return jsonResponse({ success: false, error: 'stored rule snapshot missing', code: 'BILLING_RUN_SNAPSHOT_MISSING' }, 409);
        }
      } else {
        const activeScopeRun = await findExistingRow(
          env,
          'SELECT id FROM billing_runs WHERE scope_key = ? AND cancelled_at IS NULL LIMIT 1',
          [scopeKey]
        );
        if (activeScopeRun) {
          return jsonResponse({ success: false, error: 'active billing run already exists for this period/branch', code: 'BILLING_RUN_SCOPE_CONFLICT', existing_run_id: activeScopeRun.id }, 409);
        }
        const preview = await computeServerBillingPreview(env, year, month);
        invoices = preview.invoices.filter((inv) => branch === 'all' || inv.branch === branch);
        const runRow = {
          id: makeId('brun'),
          year,
          month,
          branch,
          status: 'confirmed',
          total_amount: 0,
          issued_count: 0,
          created_by: getActorId(teacher),
          scope_key: scopeKey,
          rule_snapshot_json: JSON.stringify({
            rule_version: preview.rule_version,
            snapshot: preview.snapshot,
            excluded: preview.excluded,
            invoices
          }),
          idempotency_key: idempotencyKey,
          confirmed_at: nowIso,
          confirmed_by: getActorId(teacher),
          created_at: nowIso,
          updated_at: nowIso
        };
        try {
          await insertRow(env, 'billing_runs', runRow);
          run = runRow;
        } catch (error) {
          if (!isUniqueConstraintError(error)) throw error;
          // 동시 확정 경합: 멱등키가 같으면 그 실행을 재개, 아니면 범위 충돌.
          const concurrent = await findExistingRow(env, 'SELECT * FROM billing_runs WHERE idempotency_key = ? LIMIT 1', [idempotencyKey]);
          if (!concurrent) {
            return jsonResponse({ success: false, error: 'concurrent billing run confirmed for this period/branch', code: 'BILLING_RUN_SCOPE_CONFLICT' }, 409);
          }
          run = concurrent;
          alreadyConfirmed = true;
          let storedSnapshot = null;
          try {
            storedSnapshot = JSON.parse(String(run.rule_snapshot_json || ''));
          } catch (e) {
            storedSnapshot = null;
          }
          invoices = Array.isArray(storedSnapshot?.invoices) ? storedSnapshot.invoices : invoices;
        }
      }

      // 체크포인트: 이미 발행된 수강은 건너뛴다 (결정론적 PK + INSERT OR IGNORE + unique index 3중 방어).
      const existingRows = await safeAll(env, 'SELECT enrollment_id FROM payments WHERE billing_run_id = ?', [run.id]);
      const existingEnrollmentIds = new Set(existingRows.map((r) => String(r.enrollment_id || '')));
      const pendingInvoices = invoices.filter((inv) => !existingEnrollmentIds.has(String(inv.enrollment_id)));

      // 한 청구서(payment + items)는 반드시 같은 batch에 담는다.
      // 청구서가 batch 경계에서 쪼개지면 부분 실패 시 payment만 있고 항목이 없는 상태로
      // 재개 체크포인트가 해당 수강을 건너뛰어 항목이 영구 누락될 수 있다.
      const invoiceStatementGroups = [];
      for (const invoice of pendingInvoices) {
        const statements = [];
        const paymentId = `pay_${run.id}_${invoice.enrollment_id}`;
        statements.push(insertOrIgnoreStatement(env, 'payments', {
          id: paymentId,
          student_id: invoice.student_id,
          enrollment_id: invoice.enrollment_id,
          billing_run_id: run.id,
          year,
          month,
          total_amount: toSettlementAmount(invoice.billed_amount),
          paid_amount: 0,
          due_date: invoice.due_date || null,
          status: 'unpaid',
          created_at: nowIso,
          updated_at: nowIso
        }));
        (invoice.items || []).forEach((item, index) => {
          statements.push(insertOrIgnoreStatement(env, 'payment_items', {
            id: `pi_${run.id}_${invoice.enrollment_id}_${index}`,
            payment_id: paymentId,
            branch: item.branch || invoice.branch || 'apmath',
            enrollment_id: item.enrollment_id || invoice.enrollment_id,
            class_id: item.class_id || null,
            name: item.name,
            amount: toSettlementAmount(item.amount),
            item_type: item.item_type || null,
            note: item.basis || null,
            created_at: nowIso
          }));
        });
        invoiceStatementGroups.push(statements);
      }
      const BILLING_RUN_BATCH_SIZE = 40;
      let currentBatch = [];
      const flushBatch = async () => {
        if (currentBatch.length) {
          await env.DB.batch(currentBatch);
          currentBatch = [];
        }
      };
      for (const group of invoiceStatementGroups) {
        if (currentBatch.length && currentBatch.length + group.length > BILLING_RUN_BATCH_SIZE) {
          await flushBatch();
        }
        currentBatch.push(...group);
      }
      await flushBatch();

      // 확정 후 실행 건수·금액을 DB에서 다시 계산해 저장한다(스냅샷 합계 불신).
      const paymentTotals = await findExistingRow(
        env,
        'SELECT COUNT(*) AS issued_count, COALESCE(SUM(total_amount), 0) AS total_amount FROM payments WHERE billing_run_id = ?',
        [run.id]
      );
      const itemTotals = await findExistingRow(
        env,
        'SELECT COALESCE(SUM(pi.amount), 0) AS items_total FROM payment_items pi JOIN payments p ON p.id = pi.payment_id WHERE p.billing_run_id = ?',
        [run.id]
      );
      const issuedCount = toInt(paymentTotals?.issued_count, 0);
      const totalAmount = toInt(paymentTotals?.total_amount, 0);
      await env.DB.batch([
        env.DB.prepare('UPDATE billing_runs SET issued_count = ?, total_amount = ?, issued_at = COALESCE(issued_at, ?), updated_at = ? WHERE id = ?')
          .bind(issuedCount, totalAmount, nowIso, nowIso, run.id),
        auditLogStatement(env, teacher, {
          entity_type: 'billing_run',
          entity_id: run.id,
          action: alreadyConfirmed ? 'resume' : 'confirm',
          after: {
            scope_key: scopeKey,
            issued_count: issuedCount,
            total_amount: totalAmount,
            created_now: pendingInvoices.length,
            skipped_existing: invoices.length - pendingInvoices.length
          }
        })
      ]);

      const refreshedRun = await getRowById(env, 'billing_runs', run.id);
      return jsonResponse({
        success: true,
        already_confirmed: alreadyConfirmed,
        billing_run: refreshedRun,
        created_count: pendingInvoices.length,
        skipped_count: invoices.length - pendingInvoices.length,
        issued_count: issuedCount,
        total_amount: totalAmount,
        items_total: toInt(itemTotals?.items_total, 0)
      }, alreadyConfirmed ? 200 : 201);
    }
    return jsonResponse({ error: 'Method Not Allowed' }, 405);
  }

  if (sub === 'payment-methods') {
    if (method === 'GET') {
      const whereParts = [];
      const bindings = [];
      if (url.searchParams.get('active') === '1') {
        whereParts.push('is_active = 1');
      }
      const paymentMethods = await safeAll(
        env,
        `SELECT * FROM payment_methods${buildWhereClause(whereParts)} ORDER BY sort_order ASC, method_key ASC LIMIT ?`,
        [...bindings, parseLimit(url)]
      );
      return jsonResponse({ success: true, payment_methods: paymentMethods });
    }

    if (method === 'POST') {
      const methodKey = normalizeMethodKey(data.method_key);
      const name = String(data.name || '').trim();
      const category = String(data.category || methodKey).trim().toLowerCase() || methodKey;
      if (!name) return jsonResponse({ success: false, error: 'name required' }, 400);
      const existingMethod = await findExistingRow(env, 'SELECT id FROM payment_methods WHERE method_key = ? LIMIT 1', [methodKey]);
      if (existingMethod) return jsonResponse({ success: false, error: 'method_key already exists' }, 409);
      const row = {
        id: data.id || makeId('pm'),
        method_key: methodKey,
        name,
        category,
        is_active: data.is_active === undefined ? 1 : toInt(data.is_active, 1),
        sort_order: toInt(data.sort_order, 0),
        memo: data.memo || null
      };
      return jsonResponse({ success: true, id: row.id, payment_method: await insertRow(env, 'payment_methods', row) });
    }

    if (method === 'PATCH' && id) {
      if (action === 'deactivate') {
        const result = await patchExistingRow(env, 'payment_methods', id, { is_active: 0 }, ['is_active']);
        if (result.error === 'not_found') return jsonResponse({ success: false, error: 'payment method not found' }, 404);
        return jsonResponse({ success: true, id, is_active: 0, payment_method: result.updated });
      }
      const patch = { ...data };
      if (Object.prototype.hasOwnProperty.call(patch, 'method_key')) patch.method_key = normalizeMethodKey(patch.method_key);
      if (Object.prototype.hasOwnProperty.call(patch, 'is_active')) patch.is_active = toInt(patch.is_active, 1);
      if (Object.prototype.hasOwnProperty.call(patch, 'sort_order')) patch.sort_order = toInt(patch.sort_order, 0);
      if (patch.method_key) {
        const existingMethod = await findExistingRow(env, 'SELECT id FROM payment_methods WHERE method_key = ? AND id != ? LIMIT 1', [patch.method_key, id]);
        if (existingMethod) return jsonResponse({ success: false, error: 'method_key already exists' }, 409);
      }
      const result = await patchExistingRow(env, 'payment_methods', id, patch, ['method_key', 'name', 'category', 'is_active', 'sort_order', 'memo']);
      if (result.error === 'not_found') return jsonResponse({ success: false, error: 'payment method not found' }, 404);
      return jsonResponse({ success: true, payment_method: result.updated });
    }
  }

  if (sub === 'policy-rules') {
    if (method === 'GET') {
      const whereParts = [];
      const bindings = [];
      const branch = url.searchParams.get('branch') ? normalizeBranchForAccounting(url.searchParams.get('branch'), 'all') : '';
      const ruleType = String(url.searchParams.get('rule_type') || '').trim().toLowerCase();
      if (branch) {
        whereParts.push('branch = ?');
        bindings.push(branch);
      }
      if (ruleType) {
        whereParts.push('LOWER(rule_type) = ?');
        bindings.push(ruleType);
      }
      if (url.searchParams.get('active') === '1') {
        whereParts.push('is_active = 1');
      }
      const policyRules = await safeAll(
        env,
        `SELECT * FROM billing_policy_rules${buildWhereClause(whereParts)} ORDER BY branch ASC, rule_type ASC, rule_key ASC LIMIT ?`,
        [...bindings, parseLimit(url)]
      );
      return jsonResponse({ success: true, policy_rules: policyRules });
    }

    if (method === 'POST') {
      const ruleKey = String(data.rule_key || '').trim();
      const ruleType = String(data.rule_type || '').trim();
      const name = String(data.name || '').trim();
      let valueJson = null;
      if (!ruleKey || !ruleType || !name) return jsonResponse({ success: false, error: 'rule_key, rule_type and name required' }, 400);
      try {
        valueJson = normalizeJsonString(data.value_json);
      } catch (e) {
        return jsonResponse({ success: false, error: 'value_json must be valid JSON' }, 400);
      }
      const branch = normalizeBranchForAccounting(data.branch, 'all');
      const existingRule = await findExistingRow(
        env,
        'SELECT id FROM billing_policy_rules WHERE rule_key = ? AND branch = ? AND rule_type = ? LIMIT 1',
        [ruleKey, branch, ruleType]
      );
      if (existingRule) return jsonResponse({ success: false, error: 'rule_key already exists for branch/rule_type' }, 409);
      const row = {
        id: data.id || makeId('bpr'),
        rule_key: ruleKey,
        branch,
        rule_type: ruleType,
        name,
        value_json: valueJson,
        is_active: data.is_active === undefined ? 1 : toInt(data.is_active, 1),
        memo: data.memo || null
      };
      return jsonResponse({ success: true, id: row.id, policy_rule: await insertRow(env, 'billing_policy_rules', row) });
    }

    if (method === 'PATCH' && id) {
      if (action === 'deactivate') {
        const result = await patchExistingRow(env, 'billing_policy_rules', id, { is_active: 0 }, ['is_active']);
        if (result.error === 'not_found') return jsonResponse({ success: false, error: 'policy rule not found' }, 404);
        return jsonResponse({ success: true, id, is_active: 0, policy_rule: result.updated });
      }
      const patch = { ...data };
      if (Object.prototype.hasOwnProperty.call(patch, 'branch')) patch.branch = normalizeBranchForAccounting(patch.branch, 'all');
      if (Object.prototype.hasOwnProperty.call(patch, 'is_active')) patch.is_active = toInt(patch.is_active, 1);
      if (Object.prototype.hasOwnProperty.call(patch, 'value_json')) {
        try {
          patch.value_json = normalizeJsonString(patch.value_json);
        } catch (e) {
          return jsonResponse({ success: false, error: 'value_json must be valid JSON' }, 400);
        }
      }
      if (patch.rule_key || patch.branch || patch.rule_type) {
        const currentRule = await findExistingRow(env, 'SELECT rule_key, branch, rule_type FROM billing_policy_rules WHERE id = ? LIMIT 1', [id]);
        if (!currentRule) return jsonResponse({ success: false, error: 'policy rule not found' }, 404);
        const nextRuleKey = String(patch.rule_key || currentRule.rule_key || '').trim();
        const nextBranch = normalizeBranchForAccounting(patch.branch || currentRule.branch, 'all');
        const nextRuleType = String(patch.rule_type || currentRule.rule_type || '').trim();
        const existingRule = await findExistingRow(
          env,
          'SELECT id FROM billing_policy_rules WHERE rule_key = ? AND branch = ? AND rule_type = ? AND id != ? LIMIT 1',
          [nextRuleKey, nextBranch, nextRuleType, id]
        );
        if (existingRule) return jsonResponse({ success: false, error: 'rule_key already exists for branch/rule_type' }, 409);
      }
      const result = await patchExistingRow(env, 'billing_policy_rules', id, patch, ['rule_key', 'branch', 'rule_type', 'name', 'value_json', 'is_active', 'memo']);
      if (result.error === 'not_found') return jsonResponse({ success: false, error: 'policy rule not found' }, 404);
      return jsonResponse({ success: true, policy_rule: result.updated });
    }
  }

  if (sub === 'billing-preview') {
    if (method !== 'GET') return jsonResponse({ error: 'Method Not Allowed' }, 405);
    const ym = parseYearMonth(url);
    if (!ym) return jsonResponse({ success: false, error: 'invalid year/month' }, 400);
    return jsonResponse(await getBillingPreview(env, ym.year, ym.month));
  }

  if (sub === 'transactions') {
    if (method === 'POST') {
      const studentId = validateRequiredText(data.student_id);
      const methodKey = normalizeMethodKey(data.method_key);
      const amount = positiveAmountOrNull(data.amount);
      const transactionDate = normalizeIsoDate(data.transaction_date);
      if (!studentId || !methodKey || !amount || !transactionDate) {
        return jsonResponse({ success: false, error: 'student_id, method_key, amount and transaction_date required' }, 400);
      }
      const closedForCreate = await findClosedPeriod(env, transactionDate, normalizeBranchForAccounting(data.branch, 'apmath'));
      if (closedForCreate) return closedPeriodResponse(closedForCreate);
      const idempotencyKey = validateRequiredText(data.idempotency_key) || validateRequiredText(data.clientRequestId) || null;
      if (idempotencyKey) {
        const existingTx = await findExistingRow(env, 'SELECT * FROM payment_transactions WHERE idempotency_key = ? LIMIT 1', [idempotencyKey]);
        if (existingTx) {
          return jsonResponse({ success: true, id: existingTx.id, transaction: existingTx, code: 'PAYMENT_DUPLICATE_IDEMPOTENCY_KEY' });
        }
      }
      const requestedTransactionType = String(data.transaction_type || 'payment').trim().toLowerCase();
      const requestedStatus = String(data.status || 'completed').trim().toLowerCase();
      const transactionType = normalizeTransactionType(requestedTransactionType);
      const status = normalizeTransactionStatus(requestedStatus);
      // 정규화 함수의 기본값으로 잘못된 입력이 payment/completed로 우회되지 않게 원문도 검사한다.
      if (!isDirectPaymentTransactionType(requestedTransactionType)) {
        return jsonResponse({
          success: false,
          error: '일반 수납에는 납부 또는 부분 납부 유형만 사용할 수 있습니다.',
          code: 'TRANSACTION_TYPE_USE_DEDICATED_FLOW'
        }, 400);
      }
      if (requestedStatus !== 'completed' || status !== 'completed') {
        return jsonResponse({
          success: false,
          error: '완료된 수납만 등록할 수 있습니다.',
          code: 'PAYMENT_STATUS_COMPLETED_REQUIRED'
        }, 400);
      }
      const paymentId = validateRequiredText(data.payment_id) || null;
      // 청구 연결 수납은 남은 금액을 초과할 수 없다 (초과분은 이월로 처리).
      if (paymentId && status === 'completed' && SETTLEMENT_CREDIT_TYPES.includes(transactionType)) {
        const payment = await getRowById(env, 'payments', paymentId);
        if (!payment) return jsonResponse({ success: false, error: 'payment not found', code: 'PAYMENT_NOT_FOUND' }, 404);
        if (String(payment.student_id || '') !== studentId) {
          return jsonResponse({ success: false, error: '청구와 수납 학생이 일치하지 않습니다.', code: 'PAYMENT_STUDENT_MISMATCH' }, 400);
        }
        const remaining = Math.max(toSettlementAmount(payment.total_amount) - toSettlementAmount(payment.paid_amount), 0);
        if (amount > remaining) {
          return jsonResponse({
            success: false,
            error: `청구 남은 금액(${remaining}원)보다 큰 금액은 수납할 수 없습니다. 초과분은 이월로 등록하세요.`,
            code: 'PAYMENT_OVER_ALLOCATED',
            remaining_amount: remaining
          }, 400);
        }
      }
      const row = {
        id: data.id || makeId('ptx'),
        payment_id: paymentId,
        student_id: studentId,
        branch: normalizeBranchForAccounting(data.branch, 'apmath'),
        transaction_type: transactionType,
        method_key: methodKey,
        amount,
        transaction_date: transactionDate,
        status,
        idempotency_key: idempotencyKey,
        receipt_no: validateRequiredText(data.receipt_no) || null,
        external_provider: validateRequiredText(data.external_provider) || null,
        external_transaction_id: validateRequiredText(data.external_transaction_id) || null,
        note: validateRequiredText(data.note) || null,
        created_by: getActorId(teacher)
      };
      // 수납 거래 + 장부 자동 기록 + 감사 로그를 한 배치(원자적)로 저장한다.
      const linkedPaymentCondition = 'EXISTS (SELECT 1 FROM payments p WHERE p.id = ? AND p.student_id = ? AND COALESCE(p.paid_amount, 0) + ? <= p.total_amount)';
      const statements = [paymentId
        ? conditionalInsertStatement(env, 'payment_transactions', row, linkedPaymentCondition, [paymentId, studentId, amount])
        : insertStatement(env, 'payment_transactions', row)];
      if (status === 'completed') {
        const cashbookRow = {
          id: makeId('cbe'),
          entry_date: transactionDate,
          entry_type: 'income',
          category: '수납',
          branch: row.branch,
          amount,
          status: 'active',
          is_active: 1,
          source_type: 'payment_transaction',
          payment_transaction_id: row.id,
          student_id: studentId,
          title: `수납 (${methodKey})`,
          description: row.note,
          method_key: methodKey,
          created_by: getActorId(teacher)
        };
        statements.push(paymentId
          ? conditionalInsertStatement(env, 'cashbook_entries', cashbookRow, 'EXISTS (SELECT 1 FROM payment_transactions WHERE id = ?)', [row.id])
          : insertStatement(env, 'cashbook_entries', cashbookRow));
      }
      const createAudit = { entity_type: 'payment_transaction', entity_id: row.id, action: 'create', after: row };
      statements.push(paymentId
        ? conditionalAuditLogStatement(env, teacher, createAudit, 'payment_transactions', row.id)
        : auditLogStatement(env, teacher, createAudit));
      if (paymentId) statements.push(paymentSettlementUpdateStatement(env, paymentId));
      let results;
      try {
        results = await env.DB.batch(statements);
      } catch (error) {
        if (idempotencyKey) {
          const duplicate = await findExistingRow(env, 'SELECT * FROM payment_transactions WHERE idempotency_key = ? LIMIT 1', [idempotencyKey]);
          if (duplicate) return jsonResponse({ success: true, id: duplicate.id, transaction: duplicate, code: 'PAYMENT_DUPLICATE_IDEMPOTENCY_KEY' });
        }
        throw error;
      }
      if (paymentId && Number(results?.[0]?.meta?.changes || 0) === 0) {
        return jsonResponse({
          success: false,
          error: '다른 수납이 먼저 반영되어 청구 잔액이 변경되었습니다. 새로고침 후 다시 시도해 주세요.',
          code: 'PAYMENT_CONCURRENT_CONFLICT'
        }, 409);
      }
      return jsonResponse({ success: true, id: row.id, transaction: row });
    }

    if (method === 'PATCH' && id) {
      if (action === 'cancel') {
        const reason = validateRequiredText(data.reason || data.cancel_reason);
        if (!reason) return jsonResponse({ success: false, error: '수납 취소 사유를 입력해 주세요.', code: 'CANCEL_REASON_REQUIRED' }, 400);
        const existing = await getRowById(env, 'payment_transactions', id);
        if (!existing) return jsonResponse({ success: false, error: 'transaction not found' }, 404);
        if (existing.status === 'cancelled') return jsonResponse({ success: false, error: '이미 취소된 수납입니다.', code: 'ALREADY_CANCELLED' }, 400);
        // 이월 거래는 한쪽만 취소되면 원장이 깨진다 — 이월 기록 취소로만 양쪽을 함께 되돌린다.
        if (validateRequiredText(existing.carryover_record_id)) {
          return jsonResponse({
            success: false,
            error: '이월로 생성된 거래는 이월 기록에서 취소해 주세요. 양쪽 청구가 함께 원복됩니다.',
            code: 'USE_CARRYOVER_CANCEL_FLOW'
          }, 400);
        }
        const closedForCancel = await findClosedPeriod(env, existing.transaction_date, normalizeBranchForAccounting(existing.branch, 'apmath'));
        if (closedForCancel) return closedPeriodResponse(closedForCancel);
        const at = new Date().toISOString();
        // 취소는 거래·연결 장부·감사 로그를 한 배치로 처리한다.
        const cancelStatements = [
          env.DB.prepare('UPDATE payment_transactions SET status = ?, cancelled_at = ?, cancel_reason = ?, updated_at = ? WHERE id = ?')
            .bind('cancelled', at, reason, at, id),
          env.DB.prepare("UPDATE cashbook_entries SET status = 'cancelled', is_active = 0, updated_at = ? WHERE payment_transaction_id = ? AND COALESCE(status, 'active') != 'cancelled'")
            .bind(at, id),
          auditLogStatement(env, teacher, { entity_type: 'payment_transaction', entity_id: id, action: 'cancel', before: existing, reason })
        ];
        if (existing.payment_id) cancelStatements.push(paymentSettlementUpdateStatement(env, existing.payment_id, at));
        await env.DB.batch(cancelStatements);
        const updated = await getRowById(env, 'payment_transactions', id);
        return jsonResponse({ success: true, id, status: 'cancelled', transaction: updated });
      }
      const existing = await getRowById(env, 'payment_transactions', id);
      if (!existing) return jsonResponse({ success: false, error: 'transaction not found' }, 404);
      const patch = { ...data };
      delete patch.clientRequestId;
      delete patch.idempotency_key;
      // 프론트는 전체 폼을 보내므로, 기존 값과 같은(no-op) 필드는 변경으로 취급하지 않는다.
      const sameAsExisting = (key) => String(patch[key] ?? '').trim() === String(existing[key] ?? '').trim();
      for (const key of Object.keys(patch)) {
        if (sameAsExisting(key)) delete patch[key];
      }
      // 완료된 수납의 금액·수단·일자·대상·유형·상태는 수정 불가. 취소 후 재입력한다.
      if (existing.status === 'completed') {
        const violation = findImmutableFieldViolation(patch);
        if (violation) {
          return jsonResponse({
            success: false,
            error: `완료된 수납의 ${violation} 값은 수정할 수 없습니다. 취소 후 다시 입력해 주세요.`,
            code: 'TRANSACTION_COMPLETED_READONLY'
          }, 400);
        }
      }
      if (Object.prototype.hasOwnProperty.call(patch, 'branch')) patch.branch = normalizeBranchForAccounting(patch.branch, 'apmath');
      if (Object.prototype.hasOwnProperty.call(patch, 'transaction_type')) patch.transaction_type = normalizeTransactionType(patch.transaction_type);
      if (Object.prototype.hasOwnProperty.call(patch, 'method_key')) patch.method_key = normalizeMethodKey(patch.method_key);
      if (Object.prototype.hasOwnProperty.call(patch, 'status')) {
        patch.status = normalizeTransactionStatus(patch.status);
        if (patch.status === 'cancelled') return jsonResponse({ success: false, error: '취소는 취소 액션으로만 가능합니다.', code: 'USE_CANCEL_ACTION' }, 400);
        if (patch.status === 'completed' && existing.status !== 'completed') {
          return jsonResponse({ success: false, error: '대기 수납은 취소 후 완료 수납으로 다시 입력해 주세요.', code: 'USE_COMPLETED_CREATE_FLOW' }, 400);
        }
      }
      if (Object.prototype.hasOwnProperty.call(patch, 'amount')) {
        patch.amount = positiveAmountOrNull(patch.amount);
        if (!patch.amount) return jsonResponse({ success: false, error: 'amount must be positive number' }, 400);
      }
      if (Object.prototype.hasOwnProperty.call(patch, 'transaction_date')) {
        patch.transaction_date = normalizeIsoDate(patch.transaction_date);
        if (!patch.transaction_date) return jsonResponse({ success: false, error: 'transaction_date required' }, 400);
      }
      if (Object.prototype.hasOwnProperty.call(patch, 'student_id') && !validateRequiredText(patch.student_id)) {
        return jsonResponse({ success: false, error: 'student_id required' }, 400);
      }
      const result = await patchExistingRow(env, 'payment_transactions', id, patch, ['payment_id', 'student_id', 'branch', 'transaction_type', 'method_key', 'amount', 'transaction_date', 'status', 'receipt_no', 'external_provider', 'external_transaction_id', 'note']);
      if (result.error === 'not_found') return jsonResponse({ success: false, error: 'transaction not found' }, 404);
      await writeAuditLog(env, teacher, { entity_type: 'payment_transaction', entity_id: id, action: 'update', before: existing, after: result.updated });
      return jsonResponse({ success: true, transaction: result.updated });
    }

    if (method === 'GET') {
      const whereParts = [];
      const bindings = [];
      const studentId = String(url.searchParams.get('student_id') || '').trim();
      const branch = url.searchParams.get('branch') ? normalizeBranchForAccounting(url.searchParams.get('branch'), 'apmath') : '';
      const status = String(url.searchParams.get('status') || '').trim().toLowerCase();
      if (studentId) {
        whereParts.push('student_id = ?');
        bindings.push(studentId);
      }
      pushBranchFilter(whereParts, bindings, branch);
      if (status) {
        whereParts.push('LOWER(status) = ?');
        bindings.push(status);
      }
      pushDateRangeFilter(whereParts, bindings, 'transaction_date', url);
      const transactions = await safeAll(
        env,
        `SELECT * FROM payment_transactions${buildWhereClause(whereParts)} ORDER BY transaction_date DESC, created_at DESC LIMIT ?`,
        [...bindings, parseLimit(url)]
      );
      return jsonResponse({ success: true, transactions });
    }
    return jsonResponse({ error: 'Method Not Allowed' }, 405);
  }

  if (sub === 'cashbook') {
    if (method === 'POST') {
      const entryDate = normalizeIsoDate(data.entry_date);
      const entryType = normalizeCashbookEntryType(data.entry_type);
      const category = validateRequiredText(data.category);
      const amount = positiveAmountOrNull(data.amount);
      const title = validateRequiredText(data.title);
      if (!entryDate || !category || !amount || !title) {
        return jsonResponse({ success: false, error: 'entry_date, entry_type, category, amount and title required' }, 400);
      }
      const closedForEntry = await findClosedPeriod(env, entryDate, normalizeBranchForAccounting(data.branch, 'all'));
      if (closedForEntry) return closedPeriodResponse(closedForEntry);
      const row = {
        id: data.id || makeId('cbe'),
        entry_date: entryDate,
        entry_type: entryType,
        category,
        branch: normalizeBranchForAccounting(data.branch, 'all'),
        amount,
        status: normalizeCashbookStatus(data.status),
        is_active: data.is_active === undefined ? 1 : toInt(data.is_active, 1) ? 1 : 0,
        source_type: 'manual',
        payment_transaction_id: validateRequiredText(data.payment_transaction_id) || null,
        student_id: validateRequiredText(data.student_id) || null,
        title,
        description: validateRequiredText(data.description) || null,
        method_key: validateRequiredText(data.method_key) ? normalizeMethodKey(data.method_key) : null,
        created_by: getActorId(teacher)
      };
      await env.DB.batch([
        insertStatement(env, 'cashbook_entries', row),
        auditLogStatement(env, teacher, { entity_type: 'cashbook_entry', entity_id: row.id, action: 'create', after: row })
      ]);
      return jsonResponse({ success: true, id: row.id, cashbook_entry: row });
    }

    if (method === 'PATCH' && id) {
      const existingEntry = await getRowById(env, 'cashbook_entries', id);
      if (!existingEntry) return jsonResponse({ success: false, error: 'cashbook entry not found' }, 404);
      // 수납·환불에서 자동 생성된 장부는 장부 화면에서 직접 수정·취소할 수 없다.
      // 원본(수납 거래/환불)을 취소하면 함께 취소된다.
      if (isAutoCashbookEntry(existingEntry)) {
        return jsonResponse({
          success: false,
          error: '자동 생성 장부는 직접 수정할 수 없습니다. 원본 수납/환불을 취소하면 함께 반영됩니다.',
          code: 'CASHBOOK_AUTO_ENTRY_READONLY'
        }, 400);
      }
      const closedForEntryChange = await findClosedPeriod(env, existingEntry.entry_date, normalizeBranchForAccounting(existingEntry.branch, 'all'));
      if (closedForEntryChange) return closedPeriodResponse(closedForEntryChange);
      if (Object.prototype.hasOwnProperty.call(data, 'entry_date')) {
        const closedForNewDate = await findClosedPeriod(env, normalizeIsoDate(data.entry_date), normalizeBranchForAccounting(existingEntry.branch, 'all'));
        if (closedForNewDate) return closedPeriodResponse(closedForNewDate);
      }
      if (action === 'cancel') {
        const result = await patchExistingRow(env, 'cashbook_entries', id, { status: 'cancelled', is_active: 0 }, ['status', 'is_active']);
        if (result.error === 'not_found') return jsonResponse({ success: false, error: 'cashbook entry not found' }, 404);
        await writeAuditLog(env, teacher, { entity_type: 'cashbook_entry', entity_id: id, action: 'cancel', before: existingEntry, reason: validateRequiredText(data.reason) || null });
        return jsonResponse({ success: true, id, status: 'cancelled', is_active: 0, cashbook_entry: result.updated });
      }
      const patch = { ...data };
      if (Object.prototype.hasOwnProperty.call(patch, 'entry_date')) {
        patch.entry_date = normalizeIsoDate(patch.entry_date);
        if (!patch.entry_date) return jsonResponse({ success: false, error: 'entry_date required' }, 400);
      }
      if (Object.prototype.hasOwnProperty.call(patch, 'entry_type')) patch.entry_type = normalizeCashbookEntryType(patch.entry_type);
      if (Object.prototype.hasOwnProperty.call(patch, 'branch')) patch.branch = normalizeBranchForAccounting(patch.branch, 'all');
      if (Object.prototype.hasOwnProperty.call(patch, 'status')) patch.status = normalizeCashbookStatus(patch.status);
      if (Object.prototype.hasOwnProperty.call(patch, 'is_active')) patch.is_active = toInt(patch.is_active, 1) ? 1 : 0;
      if (Object.prototype.hasOwnProperty.call(patch, 'amount')) {
        patch.amount = positiveAmountOrNull(patch.amount);
        if (!patch.amount) return jsonResponse({ success: false, error: 'amount must be positive number' }, 400);
      }
      if (Object.prototype.hasOwnProperty.call(patch, 'title') && !validateRequiredText(patch.title)) {
        return jsonResponse({ success: false, error: 'title required' }, 400);
      }
      if (Object.prototype.hasOwnProperty.call(patch, 'category') && !validateRequiredText(patch.category)) {
        return jsonResponse({ success: false, error: 'category required' }, 400);
      }
      if (Object.prototype.hasOwnProperty.call(patch, 'method_key') && patch.method_key) patch.method_key = normalizeMethodKey(patch.method_key);
      const result = await patchExistingRow(env, 'cashbook_entries', id, patch, ['entry_date', 'entry_type', 'category', 'branch', 'amount', 'status', 'is_active', 'student_id', 'title', 'description', 'method_key']);
      if (result.error === 'not_found') return jsonResponse({ success: false, error: 'cashbook entry not found' }, 404);
      await writeAuditLog(env, teacher, { entity_type: 'cashbook_entry', entity_id: id, action: 'update', before: existingEntry, after: result.updated });
      return jsonResponse({ success: true, cashbook_entry: result.updated });
    }

    if (method === 'GET') {
      const whereParts = [];
      const bindings = [];
      const studentId = String(url.searchParams.get('student_id') || '').trim();
      const branch = url.searchParams.get('branch') ? normalizeBranchForAccounting(url.searchParams.get('branch'), 'all') : '';
      const entryType = String(url.searchParams.get('entry_type') || '').trim().toLowerCase();
      const status = String(url.searchParams.get('status') || '').trim().toLowerCase();
      const includeInactive = url.searchParams.get('include_inactive') === '1';
      if (studentId) {
        whereParts.push('student_id = ?');
        bindings.push(studentId);
      }
      pushBranchFilter(whereParts, bindings, branch);
      if (entryType) {
        whereParts.push('LOWER(entry_type) = ?');
        bindings.push(entryType);
      }
      if (status) {
        whereParts.push('LOWER(COALESCE(status, ?)) = ?');
        bindings.push('active', status);
      } else if (!includeInactive) {
        whereParts.push('COALESCE(is_active, 1) = 1');
      }
      pushDateRangeFilter(whereParts, bindings, 'entry_date', url);
      const cashbookEntries = await safeAll(
        env,
        `SELECT * FROM cashbook_entries${buildWhereClause(whereParts)} ORDER BY entry_date DESC, created_at DESC LIMIT ?`,
        [...bindings, parseLimit(url)]
      );
      return jsonResponse({ success: true, cashbook_entries: cashbookEntries });
    }
    return jsonResponse({ error: 'Method Not Allowed' }, 405);
  }

  if (sub === 'summary') {
    if (method !== 'GET') return jsonResponse({ error: 'Method Not Allowed' }, 405);
    const ym = parseYearMonth(url);
    if (!ym) return jsonResponse({ success: false, error: 'invalid year/month' }, 400);
    const branch = url.searchParams.get('branch') ? normalizeBranchForAccounting(url.searchParams.get('branch'), 'all') : '';
    return jsonResponse(await getAccountingSummary(env, ym.year, ym.month, branch));
  }

  if (sub === 'refunds') {
    if (method === 'POST') {
      const studentId = validateRequiredText(data.student_id);
      const refundAmount = positiveAmountOrNull(data.refund_amount);
      const refundDate = normalizeIsoDate(data.refund_date);
      if (!studentId || !refundAmount || !refundDate) {
        return jsonResponse({ success: false, error: 'student_id, refund_amount and refund_date required' }, 400);
      }
      const closedForRefund = await findClosedPeriod(env, refundDate);
      if (closedForRefund) return closedPeriodResponse(closedForRefund);
      const paymentTransactionId = validateRequiredText(data.payment_transaction_id) || null;
      let paymentId = validateRequiredText(data.payment_id) || null;
      let sourceTransaction = null;
      if (paymentTransactionId) {
        sourceTransaction = await getRowById(env, 'payment_transactions', paymentTransactionId);
        if (!sourceTransaction || sourceTransaction.status !== 'completed' || !SETTLEMENT_CREDIT_TYPES.includes(sourceTransaction.transaction_type)) {
          return jsonResponse({ success: false, error: '환불할 완료 수납 거래를 찾을 수 없습니다.', code: 'REFUND_TRANSACTION_NOT_FOUND' }, 404);
        }
        if (String(sourceTransaction.student_id || '') !== studentId) {
          return jsonResponse({ success: false, error: '수납 거래와 환불 학생이 일치하지 않습니다.', code: 'REFUND_STUDENT_MISMATCH' }, 400);
        }
        const sourcePaymentId = validateRequiredText(sourceTransaction.payment_id) || null;
        if (!sourcePaymentId) {
          return jsonResponse({ success: false, error: '선택한 수납 거래가 청구에 연결되어 있지 않습니다.', code: 'REFUND_PAYMENT_REQUIRED' }, 400);
        }
        if (paymentId && paymentId !== sourcePaymentId) {
          return jsonResponse({ success: false, error: '수납 거래와 청구가 일치하지 않습니다.', code: 'REFUND_PAYMENT_MISMATCH' }, 400);
        }
        paymentId = sourcePaymentId;
      }
      if (!paymentId) {
        return jsonResponse({ success: false, error: '환불할 청구 또는 수납 거래를 선택해 주세요.', code: 'REFUND_PAYMENT_REQUIRED' }, 400);
      }
      const payment = await getRowById(env, 'payments', paymentId);
      if (!payment) return jsonResponse({ success: false, error: 'payment not found', code: 'PAYMENT_NOT_FOUND' }, 404);
      if (String(payment.student_id || '') !== studentId) {
        return jsonResponse({ success: false, error: '청구와 환불 학생이 일치하지 않습니다.', code: 'REFUND_STUDENT_MISMATCH' }, 400);
      }
      // 최소 승인 규칙(기본 비활성): 활성 정책 refund_self_approval_limit이 있을 때만,
      // 자신이 입력한 수납을 한도 이상 금액으로 스스로 환불 승인하는 것을 차단한다.
      // 금액 기준은 결정 문서(D-08) 승인 전까지 규칙 미등록 = 비활성 상태로 둔다.
      const selfApprovalRule = await findExistingRow(
        env,
        "SELECT value_json FROM billing_policy_rules WHERE rule_key = 'refund_self_approval_limit' AND is_active = 1 LIMIT 1"
      );
      if (selfApprovalRule && sourceTransaction) {
        let selfApprovalLimit = null;
        try {
          selfApprovalLimit = Number(JSON.parse(String(selfApprovalRule.value_json || '{}'))?.amount);
        } catch (e) {
          selfApprovalLimit = null;
        }
        if (Number.isFinite(selfApprovalLimit) && refundAmount >= selfApprovalLimit
          && String(sourceTransaction.created_by || '') === getActorId(teacher)) {
          return jsonResponse({
            success: false,
            error: `본인이 입력한 수납의 ${selfApprovalLimit.toLocaleString('ko-KR')}원 이상 환불은 다른 승인자가 처리해야 합니다.`,
            code: 'REFUND_SELF_APPROVAL_BLOCKED'
          }, 403);
        }
      }
      const requestedStatus = String(data.status || 'completed').trim().toLowerCase();
      const status = normalizeTransactionStatus(requestedStatus);
      if (requestedStatus !== 'completed' || status !== 'completed') {
        return jsonResponse({ success: false, error: '완료된 환불만 등록할 수 있습니다.', code: 'REFUND_STATUS_COMPLETED_REQUIRED' }, 400);
      }
      // 통합 가용액: 환불과 이월(carryover_out)이 같은 원금을 중복 소진하지 못한다.
      const refundBalanceRows = await safeAll(env, `
        SELECT
          COALESCE((SELECT SUM(pt.amount) FROM payment_transactions pt
            WHERE pt.payment_id = ? AND pt.status = 'completed'
              AND pt.transaction_type IN (${SETTLEMENT_CREDIT_TYPES.map(() => '?').join(', ')})), 0) AS credited_amount,
          COALESCE((SELECT SUM(rr.refund_amount) FROM refund_records rr
            WHERE rr.payment_id = ? AND rr.status = 'completed'), 0)
          + COALESCE((SELECT SUM(pt.amount) FROM payment_transactions pt
            WHERE pt.payment_id = ? AND pt.status = 'completed'
              AND pt.transaction_type IN (${SETTLEMENT_DEBIT_TYPES.map(() => '?').join(', ')})), 0) AS refunded_amount
      `, [paymentId, ...SETTLEMENT_CREDIT_TYPES, paymentId, paymentId, ...SETTLEMENT_DEBIT_TYPES]);
      let refundableAmount = computeRefundableAmount(refundBalanceRows[0] || {});
      if (sourceTransaction) {
        const transactionRefundRows = await safeAll(env, `
          SELECT COALESCE(SUM(refund_amount), 0) AS refunded_amount
          FROM refund_records
          WHERE payment_transaction_id = ? AND status = 'completed'
        `, [paymentTransactionId]);
        refundableAmount = Math.min(
          refundableAmount,
          computeRefundableAmount({
            credited_amount: sourceTransaction.amount,
            refunded_amount: transactionRefundRows[0]?.refunded_amount
          })
        );
      }
      if (refundAmount > refundableAmount) {
        return jsonResponse({
          success: false,
          error: `환불 가능 금액(${refundableAmount}원)을 초과했습니다.`,
          code: 'REFUND_AMOUNT_EXCEEDS_AVAILABLE',
          refundable_amount: refundableAmount
        }, 400);
      }
      const row = {
        id: data.id || makeId('rr'),
        payment_id: paymentId,
        payment_transaction_id: paymentTransactionId,
        student_id: studentId,
        branch: sourceTransaction
          ? normalizeBranchForAccounting(sourceTransaction.branch, 'apmath')
          : normalizeBranchForAccounting(data.branch, 'apmath'),
        refund_amount: refundAmount,
        refund_method_key: validateRequiredText(data.refund_method_key) ? normalizeMethodKey(data.refund_method_key) : null,
        refund_date: refundDate,
        reason: validateRequiredText(data.reason) || null,
        status,
        created_by: getActorId(teacher)
      };
      // 환불 + 장부(환불 지출) + 감사 로그를 한 배치로 저장한다.
      const transactionRefundGuard = paymentTransactionId ? `
          AND ? <= MAX(
            COALESCE((SELECT pt.amount FROM payment_transactions pt
              WHERE pt.id = ? AND pt.payment_id = p.id AND pt.status = 'completed'), 0)
            - COALESCE((SELECT SUM(rr2.refund_amount) FROM refund_records rr2
              WHERE rr2.payment_transaction_id = ? AND rr2.status = 'completed'), 0),
            0
          )` : '';
      const refundGuardSql = `EXISTS (
        SELECT 1 FROM payments p
        WHERE p.id = ? AND p.student_id = ?
          AND ? <= MAX(
            COALESCE((SELECT SUM(pt.amount) FROM payment_transactions pt
              WHERE pt.payment_id = p.id AND pt.status = 'completed'
                AND pt.transaction_type IN (${SETTLEMENT_CREDIT_TYPES.map(() => '?').join(', ')})), 0)
            - COALESCE((SELECT SUM(rr.refund_amount) FROM refund_records rr
              WHERE rr.payment_id = p.id AND rr.status = 'completed'), 0)
            - COALESCE((SELECT SUM(pt.amount) FROM payment_transactions pt
              WHERE pt.payment_id = p.id AND pt.status = 'completed'
                AND pt.transaction_type IN (${SETTLEMENT_DEBIT_TYPES.map(() => '?').join(', ')})), 0),
            0
          )${transactionRefundGuard}
      )`;
      const refundGuardBindings = [paymentId, studentId, refundAmount, ...SETTLEMENT_CREDIT_TYPES, ...SETTLEMENT_DEBIT_TYPES];
      if (paymentTransactionId) refundGuardBindings.push(refundAmount, paymentTransactionId, paymentTransactionId);
      const refundStatements = [conditionalInsertStatement(
        env,
        'refund_records',
        row,
        refundGuardSql,
        refundGuardBindings
      )];
      if (row.status === 'completed') {
        refundStatements.push(conditionalInsertStatement(env, 'cashbook_entries', {
          id: makeId('cbe'),
          entry_date: refundDate,
          entry_type: 'refund',
          category: '환불',
          branch: row.branch,
          amount: refundAmount,
          status: 'active',
          is_active: 1,
          source_type: 'refund_record',
          refund_record_id: row.id,
          payment_transaction_id: row.payment_transaction_id,
          student_id: studentId,
          title: `환불 (${row.refund_method_key || 'other'})`,
          description: row.reason,
          method_key: row.refund_method_key,
          created_by: getActorId(teacher)
        }, 'EXISTS (SELECT 1 FROM refund_records WHERE id = ?)', [row.id]));
      }
      refundStatements.push(conditionalAuditLogStatement(
        env,
        teacher,
        { entity_type: 'refund_record', entity_id: row.id, action: 'create', after: row },
        'refund_records',
        row.id
      ));
      refundStatements.push(paymentSettlementUpdateStatement(env, paymentId));
      const refundResults = await env.DB.batch(refundStatements);
      if (Number(refundResults?.[0]?.meta?.changes || 0) === 0) {
        return jsonResponse({
          success: false,
          error: '다른 환불이 먼저 반영되어 환불 가능 금액이 변경되었습니다. 새로고침 후 다시 시도해 주세요.',
          code: 'REFUND_CONCURRENT_CONFLICT'
        }, 409);
      }
      return jsonResponse({ success: true, id: row.id, refund: row });
    }

    if (method === 'PATCH' && id) {
      if (action === 'cancel') {
        const reason = validateRequiredText(data.reason || data.cancel_reason);
        if (!reason) return jsonResponse({ success: false, error: '환불 취소 사유를 입력해 주세요.', code: 'CANCEL_REASON_REQUIRED' }, 400);
        const existing = await getRowById(env, 'refund_records', id);
        if (!existing) return jsonResponse({ success: false, error: 'refund not found' }, 404);
        if (existing.status === 'cancelled') return jsonResponse({ success: false, error: '이미 취소된 환불입니다.', code: 'ALREADY_CANCELLED' }, 400);
        const closedForRefundCancel = await findClosedPeriod(env, existing.refund_date);
        if (closedForRefundCancel) return closedPeriodResponse(closedForRefundCancel);
        const at = new Date().toISOString();
        const cancelRefundStatements = [
          env.DB.prepare('UPDATE refund_records SET status = ?, cancelled_at = ?, cancel_reason = ?, updated_at = ? WHERE id = ?')
            .bind('cancelled', at, reason, at, id),
          env.DB.prepare("UPDATE cashbook_entries SET status = 'cancelled', is_active = 0, updated_at = ? WHERE refund_record_id = ? AND COALESCE(status, 'active') != 'cancelled'")
            .bind(at, id),
          auditLogStatement(env, teacher, { entity_type: 'refund_record', entity_id: id, action: 'cancel', before: existing, reason })
        ];
        if (existing.payment_id) cancelRefundStatements.push(paymentSettlementUpdateStatement(env, existing.payment_id, at));
        await env.DB.batch(cancelRefundStatements);
        return jsonResponse({ success: true, id, status: 'cancelled', refund: await getRowById(env, 'refund_records', id) });
      }
      const existingRefund = await getRowById(env, 'refund_records', id);
      if (!existingRefund) return jsonResponse({ success: false, error: 'refund not found' }, 404);
      // 프론트는 전체 폼을 보내므로, 기존 값과 같은(no-op) 필드는 변경으로 취급하지 않는다.
      for (const key of Object.keys(data)) {
        if (String(data[key] ?? '').trim() === String(existingRefund[key] ?? '').trim()) delete data[key];
      }
      // 완료된 환불은 사유 메모만 수정 가능. 금액·일자·대상 정정은 취소 후 재입력.
      if (existingRefund.status === 'completed') {
        const disallowed = Object.keys(data).find((key) => !['reason'].includes(key));
        if (disallowed) {
          return jsonResponse({
            success: false,
            error: `완료된 환불의 ${disallowed} 값은 수정할 수 없습니다. 취소 후 다시 입력해 주세요.`,
            code: 'REFUND_COMPLETED_READONLY'
          }, 400);
        }
      }
      const patch = { ...data };
      if (Object.prototype.hasOwnProperty.call(patch, 'branch')) patch.branch = normalizeBranchForAccounting(patch.branch, 'apmath');
      if (Object.prototype.hasOwnProperty.call(patch, 'refund_amount')) {
        patch.refund_amount = positiveAmountOrNull(patch.refund_amount);
        if (!patch.refund_amount) return jsonResponse({ success: false, error: 'refund_amount must be positive number' }, 400);
      }
      if (Object.prototype.hasOwnProperty.call(patch, 'refund_date')) {
        patch.refund_date = normalizeIsoDate(patch.refund_date);
        if (!patch.refund_date) return jsonResponse({ success: false, error: 'refund_date required' }, 400);
      }
      if (Object.prototype.hasOwnProperty.call(patch, 'refund_method_key') && patch.refund_method_key) patch.refund_method_key = normalizeMethodKey(patch.refund_method_key);
      if (Object.prototype.hasOwnProperty.call(patch, 'status')) patch.status = normalizeTransactionStatus(patch.status);
      if (patch.status === 'completed' && existingRefund.status !== 'completed') {
        return jsonResponse({ success: false, error: '대기 환불은 취소 후 완료 환불로 다시 입력해 주세요.', code: 'USE_COMPLETED_REFUND_CREATE_FLOW' }, 400);
      }
      if (Object.prototype.hasOwnProperty.call(patch, 'student_id') && !validateRequiredText(patch.student_id)) {
        return jsonResponse({ success: false, error: 'student_id required' }, 400);
      }
      const result = await patchExistingRow(env, 'refund_records', id, patch, ['payment_id', 'payment_transaction_id', 'student_id', 'branch', 'refund_amount', 'refund_method_key', 'refund_date', 'reason', 'status']);
      if (result.error === 'not_found') return jsonResponse({ success: false, error: 'refund not found' }, 404);
      await writeAuditLog(env, teacher, { entity_type: 'refund_record', entity_id: id, action: 'update', before: existingRefund, after: result.updated });
      return jsonResponse({ success: true, refund: result.updated });
    }

    if (method === 'GET') {
      const whereParts = [];
      const bindings = [];
      const studentId = String(url.searchParams.get('student_id') || '').trim();
      const branch = url.searchParams.get('branch') ? normalizeBranchForAccounting(url.searchParams.get('branch'), 'apmath') : '';
      const status = String(url.searchParams.get('status') || '').trim().toLowerCase();
      if (studentId) {
        whereParts.push('student_id = ?');
        bindings.push(studentId);
      }
      pushBranchFilter(whereParts, bindings, branch);
      if (status) {
        whereParts.push('LOWER(status) = ?');
        bindings.push(status);
      }
      pushDateRangeFilter(whereParts, bindings, 'refund_date', url);
      const refunds = await safeAll(
        env,
        `SELECT * FROM refund_records${buildWhereClause(whereParts)} ORDER BY refund_date DESC, created_at DESC LIMIT ?`,
        [...bindings, parseLimit(url)]
      );
      return jsonResponse({ success: true, refunds });
    }
    return jsonResponse({ error: 'Method Not Allowed' }, 405);
  }

  if (sub === 'carryovers') {
    if (method === 'POST') {
      const studentId = validateRequiredText(data.student_id);
      const amount = positiveAmountOrNull(data.amount);
      const carryoverType = String(data.carryover_type || 'credit').trim().toLowerCase();
      const reason = validateRequiredText(data.reason);
      const fromPaymentId = validateRequiredText(data.from_payment_id) || null;
      const toPaymentId = validateRequiredText(data.to_payment_id) || null;
      if (!studentId || !amount) {
        return jsonResponse({ success: false, error: 'student_id and amount required' }, 400);
      }
      if (!['credit', 'opening_balance'].includes(carryoverType)) {
        return jsonResponse({ success: false, error: `지원하지 않는 이월 유형입니다: ${carryoverType}`, code: 'CARRYOVER_TYPE_INVALID' }, 400);
      }
      if (!reason) {
        return jsonResponse({ success: false, error: '이월 사유를 입력해 주세요.', code: 'CARRYOVER_REASON_REQUIRED' }, 400);
      }
      if (!fromPaymentId && !toPaymentId) {
        return jsonResponse({ success: false, error: '원청구 또는 대상 청구를 선택해 주세요.', code: 'CARRYOVER_PAYMENT_REQUIRED' }, 400);
      }
      // 기초 선수금(opening_balance): 원청구 없이 대상 청구로만 유입. 출처와 이관 승인자 필수.
      const approvedBy = validateRequiredText(data.approved_by);
      if (carryoverType === 'opening_balance') {
        if (fromPaymentId) {
          return jsonResponse({ success: false, error: '기초 선수금은 원청구 없이 등록합니다.', code: 'CARRYOVER_OPENING_NO_SOURCE' }, 400);
        }
        if (!toPaymentId) {
          return jsonResponse({ success: false, error: '기초 선수금을 반영할 대상 청구를 선택해 주세요.', code: 'CARRYOVER_PAYMENT_REQUIRED' }, 400);
        }
        if (!approvedBy) {
          return jsonResponse({ success: false, error: '기초 선수금 이관 승인자를 입력해 주세요.', code: 'CARRYOVER_APPROVER_REQUIRED' }, 400);
        }
      } else if (!fromPaymentId) {
        return jsonResponse({ success: false, error: '일반 이월은 금액을 이동할 원청구가 필요합니다.', code: 'CARRYOVER_SOURCE_REQUIRED' }, 400);
      }

      // 대상/원청구 학생 일치 검증
      const fromPayment = fromPaymentId ? await getRowById(env, 'payments', fromPaymentId) : null;
      if (fromPaymentId && !fromPayment) return jsonResponse({ success: false, error: '원청구를 찾을 수 없습니다.', code: 'PAYMENT_NOT_FOUND' }, 404);
      const toPayment = toPaymentId ? await getRowById(env, 'payments', toPaymentId) : null;
      if (toPaymentId && !toPayment) return jsonResponse({ success: false, error: '대상 청구를 찾을 수 없습니다.', code: 'PAYMENT_NOT_FOUND' }, 404);
      if (fromPayment && String(fromPayment.student_id || '') !== studentId) {
        return jsonResponse({ success: false, error: '원청구와 이월 학생이 일치하지 않습니다.', code: 'CARRYOVER_STUDENT_MISMATCH' }, 400);
      }
      if (toPayment && String(toPayment.student_id || '') !== studentId) {
        return jsonResponse({ success: false, error: '대상 청구와 이월 학생이 일치하지 않습니다.', code: 'CARRYOVER_STUDENT_MISMATCH' }, 400);
      }

      const idempotencyKey = validateRequiredText(data.idempotency_key || data.clientRequestId) || null;
      if (idempotencyKey) {
        const duplicate = await findExistingRow(env, 'SELECT * FROM carryover_records WHERE idempotency_key = ? LIMIT 1', [idempotencyKey]);
        if (duplicate) {
          return jsonResponse({ success: true, id: duplicate.id, carryover: duplicate, code: 'CARRYOVER_DUPLICATE_IDEMPOTENCY_KEY' });
        }
      }

      const nowIso = new Date().toISOString();
      const transactionDate = normalizeIsoDate(data.carryover_date) || nowIso.slice(0, 10);
      const closedForCarryover = await findClosedPeriod(env, transactionDate);
      if (closedForCarryover) return closedPeriodResponse(closedForCarryover);
      const row = {
        id: data.id || makeId('cor'),
        student_id: studentId,
        from_payment_id: fromPaymentId,
        to_payment_id: toPaymentId,
        branch: fromPayment
          ? normalizeBranchForAccounting(fromPayment.branch || data.branch, 'apmath')
          : normalizeBranchForAccounting(data.branch, 'apmath'),
        amount,
        carryover_type: carryoverType,
        reason,
        status: 'active',
        idempotency_key: idempotencyKey,
        approved_by: approvedBy || getActorId(teacher),
        created_by: getActorId(teacher),
        created_at: nowIso,
        updated_at: nowIso
      };

      // 통합 가용액 guard(원청구): 완료 유입 - 완료 환불 - 기존 carryover_out >= 이월액.
      // 환불과 이월이 같은 원금을 중복 소진하지 못하고, 동시 이월도 하나만 성공한다.
      const sourceGuardSql = fromPaymentId ? `
        ? <= MAX(
          COALESCE((SELECT SUM(pt.amount) FROM payment_transactions pt
            WHERE pt.payment_id = ? AND pt.status = 'completed'
              AND pt.transaction_type IN (${SETTLEMENT_CREDIT_TYPES.map(() => '?').join(', ')})), 0)
          - COALESCE((SELECT SUM(rr.refund_amount) FROM refund_records rr
            WHERE rr.payment_id = ? AND rr.status = 'completed'), 0)
          - COALESCE((SELECT SUM(pt.amount) FROM payment_transactions pt
            WHERE pt.payment_id = ? AND pt.status = 'completed'
              AND pt.transaction_type IN (${SETTLEMENT_DEBIT_TYPES.map(() => '?').join(', ')})), 0),
          0
        )` : '1 = 1';
      const sourceGuardBindings = fromPaymentId
        ? [amount, fromPaymentId, ...SETTLEMENT_CREDIT_TYPES, fromPaymentId, fromPaymentId, ...SETTLEMENT_DEBIT_TYPES]
        : [];
      // 대상 청구 수용액 guard: 남은 금액(청구액 - 유효수납)을 초과해 유입하지 못한다.
      const targetGuardSql = toPaymentId ? `
        ? <= MAX(
          COALESCE((SELECT p2.total_amount FROM payments p2 WHERE p2.id = ?), 0)
          - MAX(
            COALESCE((SELECT SUM(pt.amount) FROM payment_transactions pt
              WHERE pt.payment_id = ? AND pt.status = 'completed'
                AND pt.transaction_type IN (${SETTLEMENT_CREDIT_TYPES.map(() => '?').join(', ')})), 0)
            - COALESCE((SELECT SUM(rr.refund_amount) FROM refund_records rr
              WHERE rr.payment_id = ? AND rr.status = 'completed'), 0)
            - COALESCE((SELECT SUM(pt.amount) FROM payment_transactions pt
              WHERE pt.payment_id = ? AND pt.status = 'completed'
                AND pt.transaction_type IN (${SETTLEMENT_DEBIT_TYPES.map(() => '?').join(', ')})), 0),
            0
          ),
          0
        )` : '1 = 1';
      const targetGuardBindings = toPaymentId
        ? [amount, toPaymentId, toPaymentId, ...SETTLEMENT_CREDIT_TYPES, toPaymentId, toPaymentId, ...SETTLEMENT_DEBIT_TYPES]
        : [];

      const carryoverStatements = [
        conditionalInsertStatement(env, 'carryover_records', row, `${sourceGuardSql} AND ${targetGuardSql}`, [...sourceGuardBindings, ...targetGuardBindings])
      ];
      if (fromPaymentId) {
        carryoverStatements.push(conditionalInsertStatement(env, 'payment_transactions', {
          id: `ptx_out_${row.id}`,
          payment_id: fromPaymentId,
          student_id: studentId,
          branch: row.branch,
          transaction_type: 'carryover_out',
          method_key: 'other',
          amount,
          transaction_date: transactionDate,
          status: 'completed',
          note: `이월 출금 (${row.id})`,
          carryover_record_id: row.id,
          created_by: getActorId(teacher),
          created_at: nowIso,
          updated_at: nowIso
        }, 'EXISTS (SELECT 1 FROM carryover_records WHERE id = ?)', [row.id]));
      }
      if (toPaymentId) {
        carryoverStatements.push(conditionalInsertStatement(env, 'payment_transactions', {
          id: `ptx_in_${row.id}`,
          payment_id: toPaymentId,
          student_id: studentId,
          branch: toPayment ? normalizeBranchForAccounting(toPayment.branch || row.branch, 'apmath') : row.branch,
          transaction_type: 'carryover_in',
          method_key: 'other',
          amount,
          transaction_date: transactionDate,
          status: 'completed',
          note: carryoverType === 'opening_balance' ? `기초 선수금 유입 (${row.id})` : `이월 입금 (${row.id})`,
          carryover_record_id: row.id,
          created_by: getActorId(teacher),
          created_at: nowIso,
          updated_at: nowIso
        }, 'EXISTS (SELECT 1 FROM carryover_records WHERE id = ?)', [row.id]));
      }
      if (fromPaymentId) carryoverStatements.push(paymentSettlementUpdateStatement(env, fromPaymentId, nowIso));
      if (toPaymentId) carryoverStatements.push(paymentSettlementUpdateStatement(env, toPaymentId, nowIso));
      carryoverStatements.push(conditionalAuditLogStatement(env, teacher, {
        entity_type: 'carryover_record',
        entity_id: row.id,
        action: 'create',
        after: row,
        reason
      }, 'carryover_records', row.id));

      const carryoverResults = await env.DB.batch(carryoverStatements);
      if (Number(carryoverResults?.[0]?.meta?.changes || 0) === 0) {
        return jsonResponse({
          success: false,
          error: '이월할 수 없습니다. 원청구의 가용 금액(환불·기존 이월 차감 후) 또는 대상 청구의 남은 금액을 초과합니다.',
          code: 'CARRYOVER_AMOUNT_EXCEEDS_AVAILABLE'
        }, 409);
      }
      return jsonResponse({
        success: true,
        id: row.id,
        carryover: row,
        from_payment: fromPaymentId ? await getRowById(env, 'payments', fromPaymentId) : null,
        to_payment: toPaymentId ? await getRowById(env, 'payments', toPaymentId) : null
      });
    }

    if (method === 'PATCH' && id) {
      if (action !== 'cancel') {
        // 원행 수정 금지: 이월 정정은 취소 후 재등록으로만.
        return jsonResponse({ success: false, error: '이월 기록은 수정할 수 없습니다. 취소 후 다시 등록해 주세요.', code: 'CARRYOVER_READONLY' }, 400);
      }
      const reason = validateRequiredText(data.reason || data.cancel_reason);
      if (!reason) return jsonResponse({ success: false, error: '이월 취소 사유를 입력해 주세요.', code: 'CANCEL_REASON_REQUIRED' }, 400);
      const existingCarryover = await getRowById(env, 'carryover_records', id);
      if (!existingCarryover) return jsonResponse({ success: false, error: 'carryover not found' }, 404);
      if (String(existingCarryover.status || 'active') !== 'active') {
        return jsonResponse({ success: false, error: '이미 취소된 이월입니다.', code: 'ALREADY_CANCELLED' }, 400);
      }
      const carryoverTx = await findExistingRow(env, 'SELECT MIN(transaction_date) AS d FROM payment_transactions WHERE carryover_record_id = ?', [id]);
      const carryoverDate = String(carryoverTx?.d || existingCarryover.created_at || '').slice(0, 10);
      const closedForCarryoverCancel = carryoverDate ? await findClosedPeriod(env, carryoverDate) : null;
      if (closedForCarryoverCancel) return closedPeriodResponse(closedForCarryoverCancel);
      const nowIso = new Date().toISOString();
      // 대상 청구에서 이 이월 유입이 이미 환불·재이월로 소진됐다면 취소 불가(음수 유효수납 방지).
      const targetReversalGuard = existingCarryover.to_payment_id ? `
        AND ? <= MAX(
          COALESCE((SELECT SUM(pt.amount) FROM payment_transactions pt
            WHERE pt.payment_id = ? AND pt.status = 'completed'
              AND pt.transaction_type IN (${SETTLEMENT_CREDIT_TYPES.map(() => '?').join(', ')})), 0)
          - COALESCE((SELECT SUM(rr.refund_amount) FROM refund_records rr
            WHERE rr.payment_id = ? AND rr.status = 'completed'), 0)
          - COALESCE((SELECT SUM(pt.amount) FROM payment_transactions pt
            WHERE pt.payment_id = ? AND pt.status = 'completed'
              AND pt.transaction_type IN (${SETTLEMENT_DEBIT_TYPES.map(() => '?').join(', ')})), 0),
          0
        )` : '';
      const targetReversalBindings = existingCarryover.to_payment_id
        ? [toInt(existingCarryover.amount, 0), existingCarryover.to_payment_id, ...SETTLEMENT_CREDIT_TYPES, existingCarryover.to_payment_id, existingCarryover.to_payment_id, ...SETTLEMENT_DEBIT_TYPES]
        : [];
      const cancelCarryoverStatements = [
        env.DB.prepare(`
          UPDATE carryover_records SET status = 'cancelled', cancelled_at = ?, cancel_reason = ?, updated_at = ?
          WHERE id = ? AND status = 'active'${targetReversalGuard}
        `).bind(nowIso, reason, nowIso, id, ...targetReversalBindings),
        // 양쪽 이월 거래를 함께 취소(반대 반영). 취소 마커로 이번 취소에 묶는다.
        env.DB.prepare(`
          UPDATE payment_transactions SET status = 'cancelled', cancelled_at = ?, cancel_reason = ?, updated_at = ?
          WHERE carryover_record_id = ? AND status = 'completed'
            AND EXISTS (SELECT 1 FROM carryover_records cr WHERE cr.id = ? AND cr.status = 'cancelled' AND cr.cancelled_at = ?)
        `).bind(nowIso, reason, nowIso, id, id, nowIso)
      ];
      if (existingCarryover.from_payment_id) cancelCarryoverStatements.push(paymentSettlementUpdateStatement(env, existingCarryover.from_payment_id, nowIso));
      if (existingCarryover.to_payment_id) cancelCarryoverStatements.push(paymentSettlementUpdateStatement(env, existingCarryover.to_payment_id, nowIso));
      cancelCarryoverStatements.push(auditLogStatement(env, teacher, {
        entity_type: 'carryover_record',
        entity_id: id,
        action: 'cancel',
        before: existingCarryover,
        reason
      }));
      const cancelCarryoverResults = await env.DB.batch(cancelCarryoverStatements);
      if (Number(cancelCarryoverResults?.[0]?.meta?.changes || 0) === 0) {
        return jsonResponse({
          success: false,
          error: '이월을 취소할 수 없습니다. 대상 청구에서 이월 금액이 이미 환불·재이월로 사용되었는지 확인해 주세요.',
          code: 'CARRYOVER_CANCEL_CONFLICT'
        }, 409);
      }
      return jsonResponse({ success: true, id, status: 'cancelled', carryover: await getRowById(env, 'carryover_records', id) });
    }

    if (method === 'GET') {
      const whereParts = [];
      const bindings = [];
      const studentId = String(url.searchParams.get('student_id') || '').trim();
      const branch = url.searchParams.get('branch') ? normalizeBranchForAccounting(url.searchParams.get('branch'), 'apmath') : '';
      const status = String(url.searchParams.get('status') || '').trim().toLowerCase();
      if (studentId) {
        whereParts.push('student_id = ?');
        bindings.push(studentId);
      }
      pushBranchFilter(whereParts, bindings, branch);
      if (status) {
        whereParts.push('LOWER(status) = ?');
        bindings.push(status);
      }
      pushDateRangeFilter(whereParts, bindings, 'DATE(created_at)', url);
      const carryovers = await safeAll(
        env,
        `SELECT * FROM carryover_records${buildWhereClause(whereParts)} ORDER BY created_at DESC LIMIT ?`,
        [...bindings, parseLimit(url)]
      );
      return jsonResponse({ success: true, carryovers });
    }
    return jsonResponse({ error: 'Method Not Allowed' }, 405);
  }

  if (sub === 'documents') {
    if (method === 'GET') {
      const whereParts = [];
      const bindings = [];
      const studentId = String(url.searchParams.get('student_id') || '').trim();
      const paymentId = String(url.searchParams.get('payment_id') || '').trim();
      const docStatus = String(url.searchParams.get('status') || '').trim().toLowerCase();
      // 다른 학생 문서 접근 차단: student_id 필터는 해당 학생 문서만 반환한다.
      if (studentId) {
        whereParts.push('student_id = ?');
        bindings.push(studentId);
      }
      if (paymentId) {
        whereParts.push('payment_id = ?');
        bindings.push(paymentId);
      }
      if (docStatus) {
        whereParts.push('LOWER(status) = ?');
        bindings.push(docStatus);
      }
      const documents = await safeAll(
        env,
        `SELECT * FROM billing_documents${buildWhereClause(whereParts)} ORDER BY created_at DESC LIMIT ?`,
        [...bindings, parseLimit(url)]
      );
      return jsonResponse({ success: true, documents });
    }

    // 내부 납부확인서 발급. replaces_document_id를 주면 재발급(원본은 superseded로 연결).
    if (method === 'POST' && !id) {
      const paymentId = validateRequiredText(data.payment_id);
      if (!paymentId) return jsonResponse({ success: false, error: 'payment_id required' }, 400);
      const payment = await getRowById(env, 'payments', paymentId);
      if (!payment) return jsonResponse({ success: false, error: 'payment not found', code: 'PAYMENT_NOT_FOUND' }, 404);
      // 요청 학생과 청구 학생이 다르면 발급 거부(다른 학생 문서 생성 차단).
      const requestedStudentId = validateRequiredText(data.student_id);
      if (requestedStudentId && requestedStudentId !== String(payment.student_id || '')) {
        return jsonResponse({ success: false, error: '청구와 학생이 일치하지 않습니다.', code: 'DOCUMENT_STUDENT_MISMATCH' }, 400);
      }
      const studentId = String(payment.student_id || '');
      const student = await getRowById(env, 'students', studentId);

      let replaced = null;
      const replacesDocumentId = validateRequiredText(data.replaces_document_id) || null;
      if (replacesDocumentId) {
        replaced = await getRowById(env, 'billing_documents', replacesDocumentId);
        if (!replaced) return jsonResponse({ success: false, error: '재발급할 원본 문서를 찾을 수 없습니다.', code: 'DOCUMENT_NOT_FOUND' }, 404);
        if (String(replaced.payment_id || '') !== paymentId || String(replaced.student_id || '') !== studentId) {
          return jsonResponse({ success: false, error: '원본 문서와 청구/학생이 일치하지 않습니다.', code: 'DOCUMENT_REPLACE_MISMATCH' }, 400);
        }
      }

      // 출력 금액은 발급 시점 원장에서 재계산한다: 완료 수납 - 완료 환불 - 이월 유출 (청구액 한도).
      const ledgerRow = await findExistingRow(env, `
        SELECT MIN(p.total_amount, MAX(
          COALESCE((SELECT SUM(pt.amount) FROM payment_transactions pt
            WHERE pt.payment_id = p.id AND pt.status = 'completed'
              AND pt.transaction_type IN (${SETTLEMENT_CREDIT_TYPES.map(() => '?').join(', ')})), 0)
          - COALESCE((SELECT SUM(rr.refund_amount) FROM refund_records rr
            WHERE rr.payment_id = p.id AND rr.status = 'completed'), 0)
          - COALESCE((SELECT SUM(pt.amount) FROM payment_transactions pt
            WHERE pt.payment_id = p.id AND pt.status = 'completed'
              AND pt.transaction_type IN (${SETTLEMENT_DEBIT_TYPES.map(() => '?').join(', ')})), 0),
          0)) AS effective_paid
        FROM payments p WHERE p.id = ?
      `, [...SETTLEMENT_CREDIT_TYPES, ...SETTLEMENT_DEBIT_TYPES, paymentId]);
      const effectivePaid = toInt(ledgerRow?.effective_paid, 0);

      const items = await safeAll(env, 'SELECT name, item_type, amount FROM payment_items WHERE payment_id = ? ORDER BY created_at ASC, id ASC', [paymentId]);
      const adjustments = await safeAll(env, "SELECT name, adjustment_type, amount, reason FROM billing_adjustments WHERE payment_id = ? AND COALESCE(status, 'active') = 'active' ORDER BY created_at ASC", [paymentId]);
      const transactions = await safeAll(env, `
        SELECT transaction_date, transaction_type, method_key, amount FROM payment_transactions
        WHERE payment_id = ? AND status = 'completed' ORDER BY transaction_date ASC, created_at ASC
      `, [paymentId]);
      const refunds = await safeAll(env, "SELECT refund_date, refund_amount, reason FROM refund_records WHERE payment_id = ? AND status = 'completed' ORDER BY refund_date ASC", [paymentId]);

      const nowIso = new Date().toISOString();
      const snapshot = {
        document_type: 'payment_confirmation',
        official_notice: '내부 확인용 문서입니다. 공식 증명서(교육비 납입증명 등)가 아닙니다.',
        student_id: studentId,
        student_name: student?.name || '',
        payment_id: paymentId,
        billing_year: toInt(payment.year, 0),
        billing_month: toInt(payment.month, 0),
        due_date: payment.due_date || null,
        billed_amount: toInt(payment.total_amount, 0),
        effective_paid: effectivePaid,
        outstanding_amount: Math.max(toInt(payment.total_amount, 0) - effectivePaid, 0),
        payment_status: payment.status || 'unpaid',
        items: items.map((i) => ({ name: i.name, item_type: i.item_type, amount: toInt(i.amount, 0) })),
        adjustments: adjustments.map((a) => ({ name: a.name, adjustment_type: a.adjustment_type, amount: toInt(a.amount, 0), reason: a.reason || '' })),
        transactions: transactions.map((t) => ({ date: t.transaction_date, type: t.transaction_type, method: t.method_key, amount: toInt(t.amount, 0) })),
        refunds: refunds.map((r) => ({ date: r.refund_date, amount: toInt(r.refund_amount, 0), reason: r.reason || '' })),
        issued_at: nowIso,
        issued_by: getActorId(teacher)
      };

      // 문서 번호: 내부 임시 규칙 INT-YYYYMMDD-#### (D-10 확정 시 교체). unique 충돌 시 재시도.
      const dayKey = nowIso.slice(0, 10).replace(/-/g, '');
      let inserted = null;
      let lastError = null;
      for (let attempt = 0; attempt < 5 && !inserted; attempt += 1) {
        const countRow = await findExistingRow(env, 'SELECT COUNT(*) AS cnt FROM billing_documents WHERE document_no LIKE ?', [`INT-${dayKey}-%`]);
        const documentNo = `INT-${dayKey}-${String(toInt(countRow?.cnt, 0) + 1 + attempt).padStart(4, '0')}`;
        const row = {
          id: makeId('bdoc'),
          document_no: documentNo,
          document_type: 'payment_confirmation',
          student_id: studentId,
          payment_id: paymentId,
          status: 'issued',
          amount: effectivePaid,
          snapshot_json: JSON.stringify(snapshot),
          replaces_document_id: replacesDocumentId,
          issued_by: getActorId(teacher),
          issued_at: nowIso,
          created_at: nowIso,
          updated_at: nowIso
        };
        try {
          const statements = [insertStatement(env, 'billing_documents', row)];
          if (replacesDocumentId) {
            statements.push(env.DB.prepare(`
              UPDATE billing_documents SET status = 'superseded', updated_at = ?
              WHERE id = ? AND status = 'issued'
            `).bind(nowIso, replacesDocumentId));
          }
          statements.push(auditLogStatement(env, teacher, {
            entity_type: 'billing_document',
            entity_id: row.id,
            action: replacesDocumentId ? 'reissue' : 'issue',
            after: { document_no: documentNo, payment_id: paymentId, amount: effectivePaid, replaces: replacesDocumentId }
          }));
          await env.DB.batch(statements);
          inserted = row;
        } catch (error) {
          if (!isUniqueConstraintError(error)) throw error;
          lastError = error;
        }
      }
      if (!inserted) {
        throw lastError || new Error('document number allocation failed');
      }
      // receipt_sent_at은 실제 발송 성공 전에는 갱신하지 않는다(발급 ≠ 발송).
      return jsonResponse({ success: true, id: inserted.id, document: inserted, snapshot }, 201);
    }

    if (method === 'PATCH' && id) {
      if (action !== 'cancel') {
        // 발급 문서는 수정하지 않는다. 정정은 취소 또는 재발급(정정본 연결)으로만.
        return jsonResponse({ success: false, error: '발급된 문서는 수정할 수 없습니다. 취소 후 재발급해 주세요.', code: 'DOCUMENT_READONLY' }, 400);
      }
      const reason = validateRequiredText(data.reason || data.cancel_reason);
      if (!reason) return jsonResponse({ success: false, error: '문서 취소 사유를 입력해 주세요.', code: 'CANCEL_REASON_REQUIRED' }, 400);
      const existing = await getRowById(env, 'billing_documents', id);
      if (!existing) return jsonResponse({ success: false, error: 'document not found' }, 404);
      if (existing.status === 'cancelled') return jsonResponse({ success: false, error: '이미 취소된 문서입니다.', code: 'ALREADY_CANCELLED' }, 400);
      const nowIso = new Date().toISOString();
      await env.DB.batch([
        env.DB.prepare(`
          UPDATE billing_documents SET status = 'cancelled', cancelled_at = ?, cancel_reason = ?, updated_at = ?
          WHERE id = ? AND status != 'cancelled'
        `).bind(nowIso, reason, nowIso, id),
        auditLogStatement(env, teacher, { entity_type: 'billing_document', entity_id: id, action: 'cancel', before: existing, reason })
      ]);
      return jsonResponse({ success: true, id, status: 'cancelled', document: await getRowById(env, 'billing_documents', id) });
    }
    return jsonResponse({ error: 'Method Not Allowed' }, 405);
  }

  if (sub === 'closings') {
    if (method === 'GET') {
      const whereParts = [];
      const bindings = [];
      const periodType = String(url.searchParams.get('period_type') || '').trim().toLowerCase();
      const status = String(url.searchParams.get('status') || '').trim().toLowerCase();
      if (periodType) {
        whereParts.push('period_type = ?');
        bindings.push(periodType);
      }
      if (status) {
        whereParts.push('LOWER(status) = ?');
        bindings.push(status);
      }
      const closings = await safeAll(
        env,
        `SELECT * FROM billing_period_closings${buildWhereClause(whereParts)} ORDER BY period_key DESC, created_at DESC LIMIT ?`,
        [...bindings, parseLimit(url)]
      );
      return jsonResponse({ success: true, closings });
    }

    // 마감 실행: open(행 없음) → closed / reopened → closed(재마감).
    if (method === 'POST' && !id) {
      const periodType = String(data.period_type || '').trim().toLowerCase();
      const periodKey = String(data.period_key || '').trim();
      const branch = normalizeBranchForAccounting(data.branch, 'all');
      if (periodType === 'day') {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(periodKey)) return jsonResponse({ success: false, error: '일마감 period_key는 YYYY-MM-DD 형식입니다.', code: 'CLOSING_INVALID_PERIOD' }, 400);
      } else if (periodType === 'month') {
        if (!/^\d{4}-\d{2}$/.test(periodKey)) return jsonResponse({ success: false, error: '월마감 period_key는 YYYY-MM 형식입니다.', code: 'CLOSING_INVALID_PERIOD' }, 400);
      } else {
        return jsonResponse({ success: false, error: "period_type은 'day' 또는 'month'입니다.", code: 'CLOSING_INVALID_PERIOD' }, 400);
      }
      const existing = await findExistingRow(
        env,
        'SELECT * FROM billing_period_closings WHERE period_type = ? AND period_key = ? AND branch = ? LIMIT 1',
        [periodType, periodKey, branch]
      );
      if (existing && existing.status === 'closed') {
        return jsonResponse({ success: false, error: '이미 마감된 기간입니다.', code: 'CLOSING_ALREADY_CLOSED' }, 409);
      }
      const { snapshot, mismatches } = await computeClosingSnapshot(env, periodType, periodKey, branch);
      if (mismatches.length) {
        // 불일치 금액이 있으면 마감하지 않는다. 원인 정리 후 재시도.
        return jsonResponse({
          success: false,
          error: '원장과 장부 합계가 일치하지 않아 마감할 수 없습니다. 불일치 내역을 정리한 뒤 다시 시도해 주세요.',
          code: 'CLOSING_MISMATCH',
          mismatches,
          snapshot
        }, 409);
      }
      const nowIso = new Date().toISOString();
      if (existing) {
        // 재마감: 이전 스냅샷은 감사 로그 before로 보존된다.
        await env.DB.batch([
          env.DB.prepare(`
            UPDATE billing_period_closings
            SET status = 'closed', snapshot_json = ?, closed_by = ?, closed_at = ?, updated_at = ?
            WHERE id = ? AND status = 'reopened'
          `).bind(JSON.stringify(snapshot), getActorId(teacher), nowIso, nowIso, existing.id),
          auditLogStatement(env, teacher, {
            entity_type: 'billing_period_closing',
            entity_id: existing.id,
            action: 'reclose',
            before: existing,
            after: snapshot
          })
        ]);
        return jsonResponse({ success: true, id: existing.id, status: 'closed', snapshot, closing: await getRowById(env, 'billing_period_closings', existing.id) });
      }
      const row = {
        id: makeId('bpc'),
        period_type: periodType,
        period_key: periodKey,
        branch,
        status: 'closed',
        snapshot_json: JSON.stringify(snapshot),
        closed_by: getActorId(teacher),
        closed_at: nowIso,
        created_at: nowIso,
        updated_at: nowIso
      };
      try {
        await env.DB.batch([
          insertStatement(env, 'billing_period_closings', row),
          auditLogStatement(env, teacher, { entity_type: 'billing_period_closing', entity_id: row.id, action: 'close', after: snapshot })
        ]);
      } catch (error) {
        if (isUniqueConstraintError(error)) {
          return jsonResponse({ success: false, error: '동시에 다른 마감이 처리되었습니다.', code: 'CLOSING_ALREADY_CLOSED' }, 409);
        }
        throw error;
      }
      return jsonResponse({ success: true, id: row.id, status: 'closed', snapshot, closing: row }, 201);
    }

    // 재오픈: 사유·승인자·시각·이전 스냅샷을 남긴다.
    if (method === 'PATCH' && id && action === 'reopen') {
      const reason = validateRequiredText(data.reason || data.reopen_reason);
      if (!reason) return jsonResponse({ success: false, error: '재오픈 사유를 입력해 주세요.', code: 'REOPEN_REASON_REQUIRED' }, 400);
      const existing = await getRowById(env, 'billing_period_closings', id);
      if (!existing) return jsonResponse({ success: false, error: 'closing not found' }, 404);
      if (existing.status !== 'closed') return jsonResponse({ success: false, error: '마감 상태가 아니어서 재오픈할 수 없습니다.', code: 'CLOSING_NOT_CLOSED' }, 400);
      const nowIso = new Date().toISOString();
      await env.DB.batch([
        env.DB.prepare(`
          UPDATE billing_period_closings
          SET status = 'reopened', reopened_by = ?, reopened_at = ?, reopen_reason = ?, updated_at = ?
          WHERE id = ? AND status = 'closed'
        `).bind(getActorId(teacher), nowIso, reason, nowIso, id),
        auditLogStatement(env, teacher, {
          entity_type: 'billing_period_closing',
          entity_id: id,
          action: 'reopen',
          before: existing,
          reason
        })
      ]);
      return jsonResponse({ success: true, id, status: 'reopened', closing: await getRowById(env, 'billing_period_closings', id) });
    }
    return jsonResponse({ error: 'Method Not Allowed' }, 405);
  }

  if (sub === 'audit-logs') {
    if (method !== 'GET') return jsonResponse({ error: 'Method Not Allowed' }, 405);
    const whereParts = [];
    const bindings = [];
    const entityType = String(url.searchParams.get('entity_type') || '').trim();
    const entityId = String(url.searchParams.get('entity_id') || '').trim();
    if (entityType) {
      whereParts.push('entity_type = ?');
      bindings.push(entityType);
    }
    if (entityId) {
      whereParts.push('entity_id = ?');
      bindings.push(entityId);
    }
    pushDateRangeFilter(whereParts, bindings, 'DATE(created_at)', url);
    const auditLogs = await safeAll(
      env,
      `SELECT * FROM billing_audit_logs${buildWhereClause(whereParts)} ORDER BY created_at DESC LIMIT ?`,
      [...bindings, parseLimit(url)]
    );
    return jsonResponse({ success: true, audit_logs: auditLogs });
  }

  if (sub === 'daily-summaries') {
    if (method === 'GET') {
      const whereParts = [];
      const bindings = [];
      const branch = url.searchParams.get('branch') ? normalizeBranchForAccounting(url.searchParams.get('branch'), 'all') : '';
      pushBranchFilter(whereParts, bindings, branch);
      pushDateRangeFilter(whereParts, bindings, 'summary_date', url);
      const dailySummaries = await safeAll(
        env,
        `SELECT * FROM accounting_daily_summaries${buildWhereClause(whereParts)} ORDER BY summary_date DESC, branch ASC LIMIT ?`,
        [...bindings, parseLimit(url)]
      );
      return jsonResponse({ success: true, daily_summaries: dailySummaries });
    }

    // 재계산(rebuild)만 허용 — 클라이언트가 보낸 금액 값은 무시하고 원장 SQL로만 upsert한다.
    if (method === 'POST' && !id) {
      const summaryDate = normalizeIsoDate(data.summary_date || data.date);
      if (!summaryDate) return jsonResponse({ success: false, error: 'summary_date(YYYY-MM-DD) required' }, 400);
      const branch = normalizeBranchForAccounting(data.branch, 'all');
      const totals = await computeLedgerPeriodTotals(env, 'day', summaryDate, branch);
      const nowIso = new Date().toISOString();
      await env.DB.batch([
        env.DB.prepare(`
          INSERT INTO accounting_daily_summaries
            (id, summary_date, branch, total_billed, total_paid, total_refunded, total_discount, total_outstanding, by_method_json, created_at, updated_at)
          VALUES (?, ?, ?, 0, ?, ?, 0, 0, ?, ?, ?)
          ON CONFLICT(summary_date, branch) DO UPDATE SET
            total_paid = excluded.total_paid,
            total_refunded = excluded.total_refunded,
            by_method_json = excluded.by_method_json,
            updated_at = excluded.updated_at
        `).bind(makeId('ads'), summaryDate, branch, totals.collected, totals.refunded, JSON.stringify(totals.by_method), nowIso, nowIso),
        auditLogStatement(env, teacher, {
          entity_type: 'accounting_daily_summary',
          entity_id: `${summaryDate}|${branch}`,
          action: 'rebuild',
          after: totals
        })
      ]);
      const row = await findExistingRow(env, 'SELECT * FROM accounting_daily_summaries WHERE summary_date = ? AND branch = ? LIMIT 1', [summaryDate, branch]);
      return jsonResponse({ success: true, daily_summary: row, ledger: totals });
    }
    return jsonResponse({ error: 'Method Not Allowed' }, 405);
  }

  if (sub === 'monthly-summaries') {
    if (method === 'GET') {
      const whereParts = [];
      const bindings = [];
      const branch = url.searchParams.get('branch') ? normalizeBranchForAccounting(url.searchParams.get('branch'), 'all') : '';
      const year = url.searchParams.get('year');
      const month = url.searchParams.get('month');
      pushBranchFilter(whereParts, bindings, branch);
      if (year && /^\d{4}$/.test(String(year).trim())) {
        whereParts.push('year = ?');
        bindings.push(toInt(year, 0));
      }
      if (month) {
        const monthValue = toInt(month, 0);
        if (monthValue >= 1 && monthValue <= 12) {
          whereParts.push('month = ?');
          bindings.push(monthValue);
        }
      }
      const monthlySummaries = await safeAll(
        env,
        `SELECT * FROM accounting_monthly_summaries${buildWhereClause(whereParts)} ORDER BY year DESC, month DESC, branch ASC LIMIT ?`,
        [...bindings, parseLimit(url)]
      );
      return jsonResponse({ success: true, monthly_summaries: monthlySummaries });
    }

    if (method === 'POST' && !id) {
      const year = toInt(data.year, 0);
      const month = toInt(data.month, 0);
      if (year < 2000 || year > 2100 || month < 1 || month > 12) {
        return jsonResponse({ success: false, error: 'invalid year/month' }, 400);
      }
      const branch = normalizeBranchForAccounting(data.branch, 'all');
      const periodKey = `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}`;
      const totals = await computeLedgerPeriodTotals(env, 'month', periodKey, branch);
      const nowIso = new Date().toISOString();
      await env.DB.batch([
        env.DB.prepare(`
          INSERT INTO accounting_monthly_summaries
            (id, year, month, branch, total_billed, total_paid, total_refunded, total_discount, total_outstanding, by_method_json, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(year, month, branch) DO UPDATE SET
            total_billed = excluded.total_billed,
            total_paid = excluded.total_paid,
            total_refunded = excluded.total_refunded,
            total_discount = excluded.total_discount,
            total_outstanding = excluded.total_outstanding,
            by_method_json = excluded.by_method_json,
            updated_at = excluded.updated_at
        `).bind(makeId('ams'), year, month, branch, totals.billed, totals.collected, totals.refunded, totals.discount, totals.outstanding, JSON.stringify(totals.by_method), nowIso, nowIso),
        auditLogStatement(env, teacher, {
          entity_type: 'accounting_monthly_summary',
          entity_id: `${periodKey}|${branch}`,
          action: 'rebuild',
          after: totals
        })
      ]);
      const row = await findExistingRow(env, 'SELECT * FROM accounting_monthly_summaries WHERE year = ? AND month = ? AND branch = ? LIMIT 1', [year, month, branch]);
      return jsonResponse({ success: true, monthly_summary: row, ledger: totals });
    }
    return jsonResponse({ error: 'Method Not Allowed' }, 405);
  }

  // 대사: 마감 스냅샷 ↔ 원장 재계산 ↔ 집계 비교 결과를 저장한다.
  if (sub === 'reconciliations') {
    if (method === 'GET') {
      const whereParts = [];
      const bindings = [];
      const periodType = String(url.searchParams.get('period_type') || '').trim().toLowerCase();
      const periodKey = String(url.searchParams.get('period_key') || '').trim();
      const status = String(url.searchParams.get('status') || '').trim().toLowerCase();
      if (periodType) { whereParts.push('period_type = ?'); bindings.push(periodType); }
      if (periodKey) { whereParts.push('period_key = ?'); bindings.push(periodKey); }
      if (status) { whereParts.push('LOWER(status) = ?'); bindings.push(status); }
      const reconciliations = await safeAll(
        env,
        `SELECT * FROM billing_reconciliations${buildWhereClause(whereParts)} ORDER BY created_at DESC LIMIT ?`,
        [...bindings, parseLimit(url)]
      );
      return jsonResponse({ success: true, reconciliations });
    }

    if (method === 'POST' && !id) {
      const periodType = String(data.period_type || '').trim().toLowerCase();
      const periodKey = String(data.period_key || '').trim();
      const branch = normalizeBranchForAccounting(data.branch, 'all');
      if (!['day', 'month'].includes(periodType) || !periodKey) {
        return jsonResponse({ success: false, error: 'period_type(day|month), period_key required' }, 400);
      }
      const closing = await findExistingRow(
        env,
        "SELECT * FROM billing_period_closings WHERE period_type = ? AND period_key = ? AND branch = ? AND status = 'closed' LIMIT 1",
        [periodType, periodKey, branch]
      );
      if (!closing) {
        return jsonResponse({ success: false, error: '마감된 기간만 대사할 수 있습니다. 먼저 마감을 실행해 주세요.', code: 'RECONCILIATION_CLOSING_REQUIRED' }, 404);
      }
      let snapshot = {};
      try {
        snapshot = JSON.parse(String(closing.snapshot_json || '{}'));
      } catch (e) {
        snapshot = {};
      }
      const ledger = await computeLedgerPeriodTotals(env, periodType, periodKey, branch);
      const summaryRow = periodType === 'day'
        ? await findExistingRow(env, 'SELECT * FROM accounting_daily_summaries WHERE summary_date = ? AND branch = ? LIMIT 1', [periodKey, branch])
        : await findExistingRow(env, 'SELECT * FROM accounting_monthly_summaries WHERE year = ? AND month = ? AND branch = ? LIMIT 1', [Number(periodKey.slice(0, 4)), Number(periodKey.slice(5, 7)), branch]);

      const diffs = [];
      const compare = (field, expected, actual, source) => {
        if (toInt(expected, 0) !== toInt(actual, 0)) {
          diffs.push({ field, source, expected: toInt(expected, 0), actual: toInt(actual, 0) });
        }
      };
      // 마감 스냅샷 ↔ 원장 (마감 후 재오픈 없이 값이 변했는지)
      compare('collected', snapshot.collected, ledger.collected, 'snapshot_vs_ledger');
      compare('refunded', snapshot.refunded, ledger.refunded, 'snapshot_vs_ledger');
      compare('carryover_in', snapshot.carryover_in, ledger.carryover_in, 'snapshot_vs_ledger');
      compare('carryover_out', snapshot.carryover_out, ledger.carryover_out, 'snapshot_vs_ledger');
      // 집계 ↔ 원장
      if (!summaryRow) {
        diffs.push({ field: 'summary', source: 'summary_missing', expected: null, actual: null });
      } else {
        compare('total_paid', summaryRow.total_paid, ledger.collected, 'summary_vs_ledger');
        compare('total_refunded', summaryRow.total_refunded, ledger.refunded, 'summary_vs_ledger');
        if (periodType === 'month') {
          compare('total_billed', summaryRow.total_billed, ledger.billed, 'summary_vs_ledger');
          compare('total_outstanding', summaryRow.total_outstanding, ledger.outstanding, 'summary_vs_ledger');
        }
      }
      const row = {
        id: makeId('brec'),
        period_type: periodType,
        period_key: periodKey,
        branch,
        closing_id: closing.id,
        status: diffs.length ? 'mismatched' : 'matched',
        ledger_json: JSON.stringify(ledger),
        summary_json: summaryRow ? JSON.stringify(summaryRow) : null,
        snapshot_json: JSON.stringify(snapshot),
        diff_json: JSON.stringify(diffs),
        created_by: getActorId(teacher),
        created_at: new Date().toISOString()
      };
      await env.DB.batch([
        insertStatement(env, 'billing_reconciliations', row),
        auditLogStatement(env, teacher, {
          entity_type: 'billing_reconciliation',
          entity_id: row.id,
          action: 'run',
          after: { period_type: periodType, period_key: periodKey, branch, status: row.status, diff_count: diffs.length }
        })
      ]);
      return jsonResponse({ success: true, id: row.id, status: row.status, diffs, ledger, summary: summaryRow, snapshot }, 201);
    }
    return jsonResponse({ error: 'Method Not Allowed' }, 405);
  }

  // 대사 예외 목록: 중복 외부거래 ID, 장부 미대사 건 (읽기 전용, 실시간 계산)
  if (sub === 'reconciliation-exceptions') {
    if (method !== 'GET') return jsonResponse({ error: 'Method Not Allowed' }, 405);
    const duplicateExternal = await safeAll(env, `
      SELECT external_provider, external_transaction_id, COUNT(*) AS cnt, COALESCE(SUM(amount), 0) AS total_amount
      FROM payment_transactions
      WHERE status = 'completed' AND external_provider IS NOT NULL AND external_transaction_id IS NOT NULL
      GROUP BY external_provider, external_transaction_id
      HAVING COUNT(*) > 1
      LIMIT 100
    `);
    const unmatchedTransactions = await safeAll(env, `
      SELECT pt.id, pt.student_id, pt.transaction_date, pt.amount
      FROM payment_transactions pt
      WHERE pt.status = 'completed' AND pt.transaction_type IN ('payment', 'partial_payment')
        AND NOT EXISTS (
          SELECT 1 FROM cashbook_entries ce
          WHERE ce.payment_transaction_id = pt.id AND ce.source_type = 'payment_transaction'
            AND COALESCE(ce.status, 'active') = 'active'
        )
      ORDER BY pt.transaction_date DESC LIMIT 100
    `);
    const unmatchedCashbook = await safeAll(env, `
      SELECT ce.id, ce.entry_date, ce.amount, ce.payment_transaction_id
      FROM cashbook_entries ce
      WHERE ce.source_type = 'payment_transaction' AND COALESCE(ce.status, 'active') = 'active'
        AND NOT EXISTS (
          SELECT 1 FROM payment_transactions pt
          WHERE pt.id = ce.payment_transaction_id AND pt.status = 'completed'
        )
      ORDER BY ce.entry_date DESC LIMIT 100
    `);
    return jsonResponse({
      success: true,
      duplicate_external_transactions: duplicateExternal,
      unmatched_transactions: unmatchedTransactions,
      unmatched_cashbook: unmatchedCashbook
    });
  }

  // 학생 360 수납 타임라인 — 읽기 전용. 요청한 학생의 기록만 반환한다.
  if (sub === 'student-timeline') {
    if (method !== 'GET') return jsonResponse({ error: 'Method Not Allowed' }, 405);
    const studentId = String(url.searchParams.get('student_id') || '').trim();
    if (!studentId) return jsonResponse({ success: false, error: 'student_id required' }, 400);
    const limit = parseLimit(url, 200, 500);

    const payments = await safeAll(env, 'SELECT * FROM payments WHERE student_id = ? ORDER BY created_at DESC LIMIT ?', [studentId, limit]);
    const transactions = await safeAll(env, "SELECT * FROM payment_transactions WHERE student_id = ? AND status IN ('completed', 'cancelled') ORDER BY transaction_date DESC LIMIT ?", [studentId, limit]);
    const refunds = await safeAll(env, "SELECT * FROM refund_records WHERE student_id = ? AND status IN ('completed', 'cancelled') ORDER BY refund_date DESC LIMIT ?", [studentId, limit]);
    const documents = await safeAll(env, 'SELECT id, document_no, status, amount, issued_at, payment_id FROM billing_documents WHERE student_id = ? ORDER BY created_at DESC LIMIT ?', [studentId, limit]);

    const typeLabels = { payment: '수납', partial_payment: '부분수납', carryover_in: '이월입금', carryover_out: '이월출금', refund: '환불', cancel: '취소', correction: '정정' };
    const events = [];
    for (const p of payments) {
      events.push({
        date: String(p.created_at || '').slice(0, 10),
        sort_at: String(p.created_at || ''),
        type: 'billing',
        label: `${p.year}년 ${p.month}월 청구 발행`,
        amount: toInt(p.total_amount, 0),
        status: p.status || 'unpaid',
        ref_id: p.id
      });
    }
    for (const t of transactions) {
      events.push({
        date: String(t.transaction_date || '').slice(0, 10),
        sort_at: String(t.transaction_date || ''),
        type: t.transaction_type,
        label: `${typeLabels[t.transaction_type] || t.transaction_type}${t.status === 'cancelled' ? ' (취소됨)' : ''}`,
        amount: toInt(t.amount, 0),
        status: t.status,
        method_key: t.method_key,
        payment_id: t.payment_id,
        ref_id: t.id
      });
    }
    for (const r of refunds) {
      events.push({
        date: String(r.refund_date || '').slice(0, 10),
        sort_at: String(r.refund_date || ''),
        type: 'refund',
        label: `환불${r.status === 'cancelled' ? ' (취소됨)' : ''}`,
        amount: toInt(r.refund_amount, 0),
        status: r.status,
        payment_id: r.payment_id,
        ref_id: r.id
      });
    }
    for (const d of documents) {
      events.push({
        date: String(d.issued_at || '').slice(0, 10),
        sort_at: String(d.issued_at || ''),
        type: 'document',
        label: `납부확인서 발급 (${d.document_no})${d.status === 'cancelled' ? ' (취소됨)' : d.status === 'superseded' ? ' (대체됨)' : ''}`,
        amount: toInt(d.amount, 0),
        status: d.status,
        payment_id: d.payment_id,
        ref_id: d.id
      });
    }
    events.sort((a, b) => String(b.sort_at).localeCompare(String(a.sort_at)));

    const openPayments = payments.filter((p) => ['unpaid', 'partial'].includes(String(p.status || 'unpaid')) && toInt(p.total_amount, 0) - toInt(p.paid_amount, 0) > 0);
    return jsonResponse({
      success: true,
      student_id: studentId,
      events,
      outstanding: {
        count: openPayments.length,
        total: openPayments.reduce((sum, p) => sum + Math.max(toInt(p.total_amount, 0) - toInt(p.paid_amount, 0), 0), 0)
      }
    });
  }

  return null;
}
