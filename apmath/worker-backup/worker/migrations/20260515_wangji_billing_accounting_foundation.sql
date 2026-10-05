-- =============================================================================
-- [WANGJI BILLING ACCOUNTING FOUNDATION] - Stage 0
-- 목적: 왕지교육 통합 수납·출납·회계 기반 구축
-- 원칙: 기존 payments/payment_items/billing_* 훼손 금지, TEXT id 기준 유지
-- =============================================================================

CREATE TABLE IF NOT EXISTS payment_methods (
  id TEXT PRIMARY KEY,
  method_key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  is_active INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  memo TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_payment_methods_key ON payment_methods(method_key);
CREATE INDEX IF NOT EXISTS idx_payment_methods_category ON payment_methods(category);
CREATE INDEX IF NOT EXISTS idx_payment_methods_active ON payment_methods(is_active);

INSERT OR IGNORE INTO payment_methods (id, method_key, name, category, sort_order)
VALUES
('pm_card', 'card', '카드', 'card', 10),
('pm_cash', 'cash', '현금', 'cash', 20),
('pm_bank_transfer', 'bank_transfer', '계좌이체', 'transfer', 30),
('pm_kakaopay', 'kakaopay', '카카오페이', 'simple_pay', 40),
('pm_local_voucher', 'local_voucher', '지역상품권', 'voucher', 50),
('pm_mixed', 'mixed', '복합결제', 'mixed', 90),
('pm_other', 'other', '기타', 'other', 99);

CREATE TABLE IF NOT EXISTS payment_transactions (
  id TEXT PRIMARY KEY,
  payment_id TEXT,
  student_id TEXT NOT NULL,
  branch TEXT DEFAULT 'apmath',
  transaction_type TEXT NOT NULL DEFAULT 'payment',
  method_key TEXT NOT NULL,
  amount INTEGER NOT NULL DEFAULT 0,
  transaction_date TEXT NOT NULL,
  status TEXT DEFAULT 'completed',
  receipt_no TEXT,
  external_provider TEXT,
  external_transaction_id TEXT,
  note TEXT,
  created_by TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_payment ON payment_transactions(payment_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_student ON payment_transactions(student_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_branch ON payment_transactions(branch);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_method ON payment_transactions(method_key);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_date ON payment_transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(status);

CREATE TABLE IF NOT EXISTS cashbook_entries (
  id TEXT PRIMARY KEY,
  entry_date TEXT NOT NULL,
  entry_type TEXT NOT NULL,
  category TEXT NOT NULL,
  branch TEXT DEFAULT 'all',
  amount INTEGER NOT NULL DEFAULT 0,
  payment_transaction_id TEXT,
  student_id TEXT,
  title TEXT NOT NULL,
  description TEXT,
  method_key TEXT,
  created_by TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_cashbook_entries_date ON cashbook_entries(entry_date);
CREATE INDEX IF NOT EXISTS idx_cashbook_entries_type ON cashbook_entries(entry_type);
CREATE INDEX IF NOT EXISTS idx_cashbook_entries_category ON cashbook_entries(category);
CREATE INDEX IF NOT EXISTS idx_cashbook_entries_branch ON cashbook_entries(branch);
CREATE INDEX IF NOT EXISTS idx_cashbook_entries_transaction ON cashbook_entries(payment_transaction_id);
CREATE INDEX IF NOT EXISTS idx_cashbook_entries_student ON cashbook_entries(student_id);

CREATE TABLE IF NOT EXISTS refund_records (
  id TEXT PRIMARY KEY,
  payment_id TEXT,
  payment_transaction_id TEXT,
  student_id TEXT NOT NULL,
  branch TEXT DEFAULT 'apmath',
  refund_amount INTEGER NOT NULL DEFAULT 0,
  refund_method_key TEXT,
  refund_date TEXT NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'completed',
  created_by TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_refund_records_payment ON refund_records(payment_id);
CREATE INDEX IF NOT EXISTS idx_refund_records_transaction ON refund_records(payment_transaction_id);
CREATE INDEX IF NOT EXISTS idx_refund_records_student ON refund_records(student_id);
CREATE INDEX IF NOT EXISTS idx_refund_records_date ON refund_records(refund_date);
CREATE INDEX IF NOT EXISTS idx_refund_records_status ON refund_records(status);

CREATE TABLE IF NOT EXISTS carryover_records (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  from_payment_id TEXT,
  to_payment_id TEXT,
  branch TEXT DEFAULT 'apmath',
  amount INTEGER NOT NULL DEFAULT 0,
  carryover_type TEXT NOT NULL DEFAULT 'credit',
  reason TEXT,
  status TEXT DEFAULT 'active',
  created_by TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_carryover_records_student ON carryover_records(student_id);
CREATE INDEX IF NOT EXISTS idx_carryover_records_from_payment ON carryover_records(from_payment_id);
CREATE INDEX IF NOT EXISTS idx_carryover_records_to_payment ON carryover_records(to_payment_id);
CREATE INDEX IF NOT EXISTS idx_carryover_records_status ON carryover_records(status);

CREATE TABLE IF NOT EXISTS billing_policy_rules (
  id TEXT PRIMARY KEY,
  rule_key TEXT NOT NULL,
  branch TEXT DEFAULT 'all',
  rule_type TEXT NOT NULL,
  name TEXT NOT NULL,
  value_json TEXT,
  is_active INTEGER DEFAULT 1,
  memo TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_billing_policy_rules_key ON billing_policy_rules(rule_key);
CREATE INDEX IF NOT EXISTS idx_billing_policy_rules_branch ON billing_policy_rules(branch);
CREATE INDEX IF NOT EXISTS idx_billing_policy_rules_type ON billing_policy_rules(rule_type);
CREATE INDEX IF NOT EXISTS idx_billing_policy_rules_active ON billing_policy_rules(is_active);

CREATE TABLE IF NOT EXISTS accounting_daily_summaries (
  id TEXT PRIMARY KEY,
  summary_date TEXT NOT NULL,
  branch TEXT DEFAULT 'all',
  total_billed INTEGER DEFAULT 0,
  total_paid INTEGER DEFAULT 0,
  total_refunded INTEGER DEFAULT 0,
  total_discount INTEGER DEFAULT 0,
  total_outstanding INTEGER DEFAULT 0,
  by_method_json TEXT,
  by_category_json TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_accounting_daily_summaries_unique
  ON accounting_daily_summaries(summary_date, branch);

CREATE TABLE IF NOT EXISTS accounting_monthly_summaries (
  id TEXT PRIMARY KEY,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  branch TEXT DEFAULT 'all',
  total_billed INTEGER DEFAULT 0,
  total_paid INTEGER DEFAULT 0,
  total_refunded INTEGER DEFAULT 0,
  total_discount INTEGER DEFAULT 0,
  total_outstanding INTEGER DEFAULT 0,
  by_method_json TEXT,
  by_category_json TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_accounting_monthly_summaries_unique
  ON accounting_monthly_summaries(year, month, branch);
