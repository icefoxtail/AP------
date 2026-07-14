import { jsonResponse, readJsonBody } from '../helpers/response.js';
import { isAdminUser, makeId, safeAll } from '../helpers/foundation-db.js';
import {
  computeRefundableAmount,
  findImmutableFieldViolation,
  isDirectPaymentTransactionType,
  SETTLEMENT_CREDIT_TYPES,
  toSettlementAmount
} from '../helpers/billing-settlement.js';

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

function safeJsonParseObject(text) {
  if (!text) return {};
  try {
    const parsed = JSON.parse(String(text));
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch (e) {
    return {};
  }
}

function extractPolicyAmount(rule) {
  const value = safeJsonParseObject(rule?.value_json);
  const amount = Number(value.amount ?? value.default_amount ?? value.tuition_amount ?? 0);
  return Number.isFinite(amount) ? Math.max(0, Math.round(amount)) : 0;
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
  const creditSum = `COALESCE((
    SELECT SUM(pt.amount) FROM payment_transactions pt
    WHERE pt.payment_id = payments.id AND pt.status = 'completed'
      AND pt.transaction_type IN (${creditMarkers})
  ), 0)`;
  const refundSum = `COALESCE((
    SELECT SUM(rr.refund_amount) FROM refund_records rr
    WHERE rr.payment_id = payments.id AND rr.status = 'completed'
  ), 0)`;
  const effective = `MAX((${creditSum}) - (${refundSum}), 0)`;
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
  const bindings = [
    ...SETTLEMENT_CREDIT_TYPES,
    ...SETTLEMENT_CREDIT_TYPES,
    ...SETTLEMENT_CREDIT_TYPES,
    ...SETTLEMENT_CREDIT_TYPES,
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

async function getBillingPreview(env, year, month) {
  const enrollments = await safeAll(env, `
    SELECT
      se.id AS enrollment_id,
      se.student_id,
      se.branch,
      se.class_id,
      s.name AS student_name,
      c.name AS class_name
    FROM student_enrollments se
    LEFT JOIN students s ON s.id = se.student_id
    LEFT JOIN classes c ON c.id = se.class_id
    WHERE se.status = 'active'
    ORDER BY se.branch ASC, c.name ASC, s.name ASC
  `);

  const rules = await safeAll(env, `
    SELECT * FROM billing_policy_rules
    WHERE is_active = 1 AND rule_type = 'tuition'
    ORDER BY branch ASC, created_at ASC
  `);

  const ruleByBranch = new Map();
  for (const rule of rules) {
    const branch = normalizeBranchForAccounting(rule.branch || 'all', 'all');
    if (!ruleByBranch.has(branch)) ruleByBranch.set(branch, rule);
  }

  const previewItems = [];
  let totalAmount = 0;

  for (const enrollment of enrollments) {
    const branch = normalizeBranchForAccounting(enrollment.branch, 'apmath');
    const rule = ruleByBranch.get(branch) || ruleByBranch.get('all') || null;
    const amount = rule ? extractPolicyAmount(rule) : 0;
    totalAmount += amount;

    const branchLabel =
      branch === 'cmath' ? '씨매쓰 초등' :
      branch === 'eie' ? 'EIE 영어학원' :
      'AP Math';

    previewItems.push({
      student_id: enrollment.student_id,
      student_name: enrollment.student_name || '',
      branch,
      class_id: enrollment.class_id || '',
      class_name: enrollment.class_name || '',
      item_name: `${branchLabel} 수강료`,
      amount,
      reason: rule ? `policy:${rule.rule_key}` : 'no billing policy configured'
    });
  }

  return {
    success: true,
    year,
    month,
    students_count: new Set(enrollments.map(e => e.student_id)).size,
    items_count: previewItems.length,
    total_amount: totalAmount,
    preview_items: previewItems
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
  if (!isAdminUser(teacher)) return jsonResponse({ error: 'Forbidden' }, 403);

  const method = request.method;
  const sub = normalizeFoundationSub(path[2] || '');
  const id = path[3] || '';
  const action = String(path[4] || '').trim().toLowerCase();
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
    if (method === 'GET') {
      const whereParts = [];
      const bindings = [];
      const paymentId = String(url.searchParams.get('payment_id') || '').trim();
      const studentId = String(url.searchParams.get('student_id') || '').trim();
      const adjustmentType = String(url.searchParams.get('adjustment_type') || '').trim().toLowerCase();
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
      const requestedStatus = String(data.status || 'completed').trim().toLowerCase();
      const status = normalizeTransactionStatus(requestedStatus);
      if (requestedStatus !== 'completed' || status !== 'completed') {
        return jsonResponse({ success: false, error: '완료된 환불만 등록할 수 있습니다.', code: 'REFUND_STATUS_COMPLETED_REQUIRED' }, 400);
      }
      const refundBalanceRows = await safeAll(env, `
        SELECT
          COALESCE((SELECT SUM(pt.amount) FROM payment_transactions pt
            WHERE pt.payment_id = ? AND pt.status = 'completed'
              AND pt.transaction_type IN (${SETTLEMENT_CREDIT_TYPES.map(() => '?').join(', ')})), 0) AS credited_amount,
          COALESCE((SELECT SUM(rr.refund_amount) FROM refund_records rr
            WHERE rr.payment_id = ? AND rr.status = 'completed'), 0) AS refunded_amount
      `, [paymentId, ...SETTLEMENT_CREDIT_TYPES, paymentId]);
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
              WHERE rr.payment_id = p.id AND rr.status = 'completed'), 0),
            0
          )${transactionRefundGuard}
      )`;
      const refundGuardBindings = [paymentId, studentId, refundAmount, ...SETTLEMENT_CREDIT_TYPES];
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
      const carryoverType = validateRequiredText(data.carryover_type);
      if (!studentId || !amount || !carryoverType) {
        return jsonResponse({ success: false, error: 'student_id, amount and carryover_type required' }, 400);
      }
      const row = {
        id: data.id || makeId('cor'),
        student_id: studentId,
        from_payment_id: validateRequiredText(data.from_payment_id) || null,
        to_payment_id: validateRequiredText(data.to_payment_id) || null,
        branch: normalizeBranchForAccounting(data.branch, 'apmath'),
        amount,
        carryover_type: carryoverType,
        reason: validateRequiredText(data.reason) || null,
        status: validateRequiredText(data.status) || 'active',
        created_by: getActorId(teacher)
      };
      await env.DB.batch([
        insertStatement(env, 'carryover_records', row),
        auditLogStatement(env, teacher, { entity_type: 'carryover_record', entity_id: row.id, action: 'create', after: row })
      ]);
      return jsonResponse({ success: true, id: row.id, carryover: row });
    }

    if (method === 'PATCH' && id) {
      if (action === 'cancel') {
        const existingCarryover = await getRowById(env, 'carryover_records', id);
        if (!existingCarryover) return jsonResponse({ success: false, error: 'carryover not found' }, 404);
        const result = await patchExistingRow(env, 'carryover_records', id, { status: 'cancelled' }, ['status']);
        if (result.error === 'not_found') return jsonResponse({ success: false, error: 'carryover not found' }, 404);
        await writeAuditLog(env, teacher, { entity_type: 'carryover_record', entity_id: id, action: 'cancel', before: existingCarryover, reason: validateRequiredText(data.reason) || null });
        return jsonResponse({ success: true, id, status: 'cancelled', carryover: result.updated });
      }
      const patch = { ...data };
      if (Object.prototype.hasOwnProperty.call(patch, 'branch')) patch.branch = normalizeBranchForAccounting(patch.branch, 'apmath');
      if (Object.prototype.hasOwnProperty.call(patch, 'amount')) {
        patch.amount = positiveAmountOrNull(patch.amount);
        if (!patch.amount) return jsonResponse({ success: false, error: 'amount must be positive number' }, 400);
      }
      if (Object.prototype.hasOwnProperty.call(patch, 'student_id') && !validateRequiredText(patch.student_id)) {
        return jsonResponse({ success: false, error: 'student_id required' }, 400);
      }
      if (Object.prototype.hasOwnProperty.call(patch, 'carryover_type') && !validateRequiredText(patch.carryover_type)) {
        return jsonResponse({ success: false, error: 'carryover_type required' }, 400);
      }
      const result = await patchExistingRow(env, 'carryover_records', id, patch, ['student_id', 'from_payment_id', 'to_payment_id', 'branch', 'amount', 'carryover_type', 'reason', 'status']);
      if (result.error === 'not_found') return jsonResponse({ success: false, error: 'carryover not found' }, 404);
      return jsonResponse({ success: true, carryover: result.updated });
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
    return jsonResponse({ error: 'Method Not Allowed' }, 405);
  }

  return null;
}
