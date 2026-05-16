import { jsonResponse, readJsonBody } from '../helpers/response.js';
import { isAdminUser, makeId, safeAll } from '../helpers/foundation-db.js';

const ALLOWED_BRANCHES = new Set(['all', 'apmath', 'cmath', 'eie']);
const PAYMENT_METHOD_KEYS = new Set(['card', 'cash', 'bank_transfer', 'kakaopay', 'local_voucher', 'mixed', 'other']);
const TRANSACTION_TYPES = new Set(['payment', 'partial_payment', 'refund', 'cancel', 'correction', 'carryover_in', 'carryover_out']);
const TRANSACTION_STATUSES = new Set(['pending', 'completed', 'cancelled', 'failed', 'corrected']);
const CASHBOOK_ENTRY_TYPES = new Set(['income', 'expense', 'refund', 'adjustment', 'transfer']);

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
  if (typeof value === 'string') {
    const parsed = JSON.parse(value);
    return JSON.stringify(parsed);
  }
  return JSON.stringify(value);
}

function normalizeFoundationSub(value) {
  const raw = String(value || '').trim().toLowerCase();
  if (raw === 'billing-policy-rules') return 'policy-rules';
  if (raw === 'payment-transactions') return 'transactions';
  if (raw === 'cashbook-entries') return 'cashbook';
  if (raw === 'refund-records') return 'refunds';
  if (raw === 'carryover-records') return 'carryovers';
  if (raw === 'accounting-summary') return 'summary';
  return raw;
}

function pushBranchFilter(whereParts, bindings, branch) {
  if (!branch) return;
  whereParts.push('COALESCE(branch, ?) = ?');
  bindings.push('apmath', branch);
}

function pushDateRangeFilter(whereParts, bindings, column, url) {
  const from = normalizeIsoDate(url.searchParams.get('from') || url.searchParams.get('start_date'));
  const to = normalizeIsoDate(url.searchParams.get('to') || url.searchParams.get('end_date'));
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
  await env.DB.prepare(`UPDATE ${table} SET ${keys.map(k => `${k} = ?`).join(', ')} WHERE id = ?`)
    .bind(...keys.map(k => row[k]), id)
    .run();
  return { id, ...row };
}

async function insertRow(env, table, row) {
  const keys = Object.keys(row);
  await env.DB.prepare(`INSERT INTO ${table} (${keys.join(', ')}) VALUES (${keys.map(() => '?').join(', ')})`)
    .bind(...keys.map(k => row[k]))
    .run();
  return row;
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

async function getAccountingSummary(env, year, month) {
  const ym = `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}`;

  const billedRows = await safeAll(env, `
    SELECT COALESCE(SUM(total_amount), 0) AS total_billed
    FROM payments
    WHERE year = ? AND month = ?
  `, [year, month]);

  const itemBranchRows = await safeAll(env, `
    SELECT COALESCE(branch, 'apmath') AS branch, COALESCE(SUM(amount), 0) AS amount
    FROM payment_items pi
    JOIN payments p ON p.id = pi.payment_id
    WHERE p.year = ? AND p.month = ?
    GROUP BY COALESCE(branch, 'apmath')
  `, [year, month]);

  const paidRows = await safeAll(env, `
    SELECT
      COALESCE(SUM(CASE WHEN transaction_type IN ('payment', 'partial_payment', 'carryover_in') AND status = 'completed' THEN amount ELSE 0 END), 0) AS total_paid,
      COALESCE(SUM(CASE WHEN transaction_type = 'refund' AND status = 'completed' THEN amount ELSE 0 END), 0) AS total_refunded
    FROM payment_transactions
    WHERE transaction_date LIKE ?
  `, [`${ym}%`]);

  const refundRows = await safeAll(env, `
    SELECT COALESCE(SUM(refund_amount), 0) AS total_refunded
    FROM refund_records
    WHERE refund_date LIKE ? AND status = 'completed'
  `, [`${ym}%`]);

  const methodRows = await safeAll(env, `
    SELECT method_key, COALESCE(SUM(amount), 0) AS amount
    FROM payment_transactions
    WHERE transaction_date LIKE ? AND status = 'completed'
    GROUP BY method_key
  `, [`${ym}%`]);

  const transactionBranchRows = await safeAll(env, `
    SELECT COALESCE(branch, 'apmath') AS branch, COALESCE(SUM(amount), 0) AS amount
    FROM payment_transactions
    WHERE transaction_date LIKE ? AND status = 'completed'
    GROUP BY COALESCE(branch, 'apmath')
  `, [`${ym}%`]);

  const cashRows = await safeAll(env, `
    SELECT
      COALESCE(SUM(CASE WHEN entry_type = 'income' THEN amount ELSE 0 END), 0) AS cashbook_income,
      COALESCE(SUM(CASE WHEN entry_type = 'expense' THEN amount ELSE 0 END), 0) AS cashbook_expense
    FROM cashbook_entries
    WHERE entry_date LIKE ?
  `, [`${ym}%`]);

  const categoryRows = await safeAll(env, `
    SELECT category, COALESCE(SUM(amount), 0) AS amount
    FROM cashbook_entries
    WHERE entry_date LIKE ?
    GROUP BY category
  `, [`${ym}%`]);

  const totalBilled = toInt(billedRows[0]?.total_billed, 0);
  const totalPaid = toInt(paidRows[0]?.total_paid, 0);
  const totalRefunded = toInt(paidRows[0]?.total_refunded, 0) + toInt(refundRows[0]?.total_refunded, 0);
  const cashbookIncome = toInt(cashRows[0]?.cashbook_income, 0);
  const cashbookExpense = toInt(cashRows[0]?.cashbook_expense, 0);

  const byMethod = {};
  for (const row of methodRows) addGrouped(byMethod, row.method_key, row.amount);

  const byBranch = {};
  for (const row of itemBranchRows) addGrouped(byBranch, row.branch, row.amount);
  for (const row of transactionBranchRows) {
    if (!Object.prototype.hasOwnProperty.call(byBranch, row.branch)) addGrouped(byBranch, row.branch, 0);
  }

  const byCategory = {};
  for (const row of categoryRows) addGrouped(byCategory, row.category, row.amount);

  return {
    success: true,
    year,
    month,
    total_billed: totalBilled,
    total_paid: totalPaid,
    total_refunded: totalRefunded,
    total_outstanding: Math.max(0, totalBilled - totalPaid + totalRefunded),
    cashbook_income: cashbookIncome,
    cashbook_expense: cashbookExpense,
    net_cashflow: cashbookIncome - cashbookExpense,
    by_method: byMethod,
    by_branch: byBranch,
    by_category: byCategory
  };
}

export async function handleBillingAccountingFoundation(request, env, teacher, path, url, body = null) {
  if (!isAdminUser(teacher)) return jsonResponse({ error: 'Forbidden' }, 403);

  const method = request.method;
  const sub = normalizeFoundationSub(path[2] || '');
  const id = path[3] || '';
  const data = body || (['POST', 'PATCH'].includes(method) ? await readJsonBody(request) : {});

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
      const patch = { ...data };
      if (Object.prototype.hasOwnProperty.call(patch, 'method_key')) patch.method_key = normalizeMethodKey(patch.method_key);
      if (Object.prototype.hasOwnProperty.call(patch, 'is_active')) patch.is_active = toInt(patch.is_active, 1);
      if (Object.prototype.hasOwnProperty.call(patch, 'sort_order')) patch.sort_order = toInt(patch.sort_order, 0);
      if (patch.method_key) {
        const existingMethod = await findExistingRow(env, 'SELECT id FROM payment_methods WHERE method_key = ? AND id != ? LIMIT 1', [patch.method_key, id]);
        if (existingMethod) return jsonResponse({ success: false, error: 'method_key already exists' }, 409);
      }
      return jsonResponse({ success: true, payment_method: await patchById(env, 'payment_methods', id, patch, ['method_key', 'name', 'category', 'is_active', 'sort_order', 'memo']) });
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
      return jsonResponse({ success: true, policy_rule: await patchById(env, 'billing_policy_rules', id, patch, ['rule_key', 'branch', 'rule_type', 'name', 'value_json', 'is_active', 'memo']) });
    }
  }

  if (sub === 'billing-preview') {
    if (method !== 'GET') return jsonResponse({ error: 'Method Not Allowed' }, 405);
    const ym = parseYearMonth(url);
    if (!ym) return jsonResponse({ success: false, error: 'invalid year/month' }, 400);
    return jsonResponse(await getBillingPreview(env, ym.year, ym.month));
  }

  if (sub === 'transactions') {
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
    if (method === 'GET') {
      const whereParts = [];
      const bindings = [];
      const studentId = String(url.searchParams.get('student_id') || '').trim();
      const branch = url.searchParams.get('branch') ? normalizeBranchForAccounting(url.searchParams.get('branch'), 'all') : '';
      const entryType = String(url.searchParams.get('entry_type') || url.searchParams.get('status') || '').trim().toLowerCase();
      if (studentId) {
        whereParts.push('student_id = ?');
        bindings.push(studentId);
      }
      pushBranchFilter(whereParts, bindings, branch);
      if (entryType) {
        whereParts.push('LOWER(entry_type) = ?');
        bindings.push(entryType);
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
    return jsonResponse(await getAccountingSummary(env, ym.year, ym.month));
  }

  if (sub === 'refunds') {
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

  if (sub === 'daily-summaries') {
    if (method === 'GET') {
      const whereParts = [];
      const bindings = [];
      const branch = url.searchParams.get('branch') ? normalizeBranchForAccounting(url.searchParams.get('branch'), 'all') : '';
      if (branch) {
        whereParts.push('branch = ?');
        bindings.push(branch);
      }
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
      if (branch) {
        whereParts.push('branch = ?');
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
