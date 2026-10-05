CREATE TABLE IF NOT EXISTS student_enrollments (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  branch TEXT NOT NULL DEFAULT 'apmath',
  class_id TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  start_date TEXT,
  end_date TEXT,
  tuition_amount INTEGER,
  memo TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_student_enrollments_student ON student_enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_student_enrollments_class ON student_enrollments(class_id);
CREATE INDEX IF NOT EXISTS idx_student_enrollments_branch ON student_enrollments(branch);
CREATE INDEX IF NOT EXISTS idx_student_enrollments_status ON student_enrollments(status);

CREATE TABLE IF NOT EXISTS class_time_slots (
  id TEXT PRIMARY KEY,
  class_id TEXT NOT NULL,
  day_of_week TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  room_name TEXT,
  memo TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_class_time_slots_class ON class_time_slots(class_id);
CREATE INDEX IF NOT EXISTS idx_class_time_slots_day ON class_time_slots(day_of_week);
CREATE INDEX IF NOT EXISTS idx_class_time_slots_room ON class_time_slots(room_name);
CREATE INDEX IF NOT EXISTS idx_class_time_slots_time ON class_time_slots(day_of_week, start_time, end_time);

CREATE TABLE IF NOT EXISTS timetable_conflict_logs (
  id TEXT PRIMARY KEY,
  conflict_type TEXT NOT NULL,
  target_id TEXT,
  branch_pair TEXT,
  class_a_id TEXT,
  class_b_id TEXT,
  day_of_week TEXT,
  overlap_start TEXT,
  overlap_end TEXT,
  severity TEXT DEFAULT 'warning',
  status TEXT DEFAULT 'open',
  resolved_by TEXT,
  resolved_at TEXT,
  memo TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_timetable_conflict_logs_type ON timetable_conflict_logs(conflict_type);
CREATE INDEX IF NOT EXISTS idx_timetable_conflict_logs_target ON timetable_conflict_logs(target_id);
CREATE INDEX IF NOT EXISTS idx_timetable_conflict_logs_status ON timetable_conflict_logs(status);
CREATE INDEX IF NOT EXISTS idx_timetable_conflict_logs_day ON timetable_conflict_logs(day_of_week);

CREATE TABLE IF NOT EXISTS timetable_conflict_overrides (
  id TEXT PRIMARY KEY,
  conflict_type TEXT NOT NULL,
  target_id TEXT,
  conflict_key TEXT NOT NULL,
  reason TEXT,
  allowed_by TEXT,
  expires_at TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_timetable_conflict_overrides_key ON timetable_conflict_overrides(conflict_key);
CREATE INDEX IF NOT EXISTS idx_timetable_conflict_overrides_target ON timetable_conflict_overrides(target_id);
CREATE INDEX IF NOT EXISTS idx_timetable_conflict_overrides_type ON timetable_conflict_overrides(conflict_type);

CREATE TABLE IF NOT EXISTS billing_templates (
  id TEXT PRIMARY KEY,
  branch TEXT DEFAULT 'apmath',
  class_id TEXT,
  name TEXT NOT NULL,
  default_amount INTEGER NOT NULL DEFAULT 0,
  item_type TEXT,
  is_active INTEGER DEFAULT 1,
  memo TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_billing_templates_branch ON billing_templates(branch);
CREATE INDEX IF NOT EXISTS idx_billing_templates_class ON billing_templates(class_id);
CREATE INDEX IF NOT EXISTS idx_billing_templates_active ON billing_templates(is_active);

CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  billing_run_id TEXT,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  total_amount INTEGER NOT NULL DEFAULT 0,
  paid_amount INTEGER DEFAULT 0,
  due_date TEXT,
  paid_date TEXT,
  status TEXT DEFAULT 'unpaid',
  payment_method TEXT,
  note TEXT,
  invoice_sent_at TEXT,
  receipt_sent_at TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_payments_student ON payments(student_id);
CREATE INDEX IF NOT EXISTS idx_payments_year_month ON payments(year, month);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_run ON payments(billing_run_id);

CREATE TABLE IF NOT EXISTS payment_items (
  id TEXT PRIMARY KEY,
  payment_id TEXT NOT NULL,
  branch TEXT DEFAULT 'apmath',
  enrollment_id TEXT,
  class_id TEXT,
  name TEXT NOT NULL,
  amount INTEGER NOT NULL DEFAULT 0,
  item_type TEXT,
  note TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_payment_items_payment ON payment_items(payment_id);
CREATE INDEX IF NOT EXISTS idx_payment_items_branch ON payment_items(branch);
CREATE INDEX IF NOT EXISTS idx_payment_items_enrollment ON payment_items(enrollment_id);

CREATE TABLE IF NOT EXISTS billing_adjustments (
  id TEXT PRIMARY KEY,
  payment_id TEXT NOT NULL,
  adjustment_type TEXT NOT NULL,
  name TEXT NOT NULL,
  amount INTEGER NOT NULL DEFAULT 0,
  reason TEXT,
  created_by TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_billing_adjustments_payment ON billing_adjustments(payment_id);
CREATE INDEX IF NOT EXISTS idx_billing_adjustments_type ON billing_adjustments(adjustment_type);

CREATE TABLE IF NOT EXISTS billing_runs (
  id TEXT PRIMARY KEY,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  branch TEXT DEFAULT 'all',
  status TEXT DEFAULT 'draft',
  total_amount INTEGER DEFAULT 0,
  issued_count INTEGER DEFAULT 0,
  created_by TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  issued_at TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_billing_runs_year_month ON billing_runs(year, month);
CREATE INDEX IF NOT EXISTS idx_billing_runs_branch ON billing_runs(branch);
CREATE INDEX IF NOT EXISTS idx_billing_runs_status ON billing_runs(status);

CREATE TABLE IF NOT EXISTS parent_contacts (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  name TEXT,
  relation TEXT,
  phone TEXT NOT NULL,
  is_primary INTEGER DEFAULT 1,
  receive_attendance INTEGER DEFAULT 1,
  receive_payment INTEGER DEFAULT 1,
  receive_notice INTEGER DEFAULT 1,
  receive_report INTEGER DEFAULT 1,
  receive_marketing INTEGER DEFAULT 0,
  memo TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_parent_contacts_student ON parent_contacts(student_id);
CREATE INDEX IF NOT EXISTS idx_parent_contacts_phone ON parent_contacts(phone);
CREATE INDEX IF NOT EXISTS idx_parent_contacts_primary ON parent_contacts(is_primary);

CREATE TABLE IF NOT EXISTS message_logs (
  id TEXT PRIMARY KEY,
  student_id TEXT,
  parent_contact_id TEXT,
  branch TEXT,
  message_type TEXT NOT NULL,
  channel TEXT NOT NULL,
  title TEXT,
  content TEXT,
  status TEXT DEFAULT 'pending',
  provider_message_id TEXT,
  error_message TEXT,
  sent_at TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_message_logs_student ON message_logs(student_id);
CREATE INDEX IF NOT EXISTS idx_message_logs_parent ON message_logs(parent_contact_id);
CREATE INDEX IF NOT EXISTS idx_message_logs_type ON message_logs(message_type);
CREATE INDEX IF NOT EXISTS idx_message_logs_status ON message_logs(status);
CREATE INDEX IF NOT EXISTS idx_message_logs_created ON message_logs(created_at);

CREATE TABLE IF NOT EXISTS student_status_history (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  old_status TEXT,
  new_status TEXT NOT NULL,
  reason TEXT,
  changed_by TEXT,
  changed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_student_status_history_student ON student_status_history(student_id);
CREATE INDEX IF NOT EXISTS idx_student_status_history_changed ON student_status_history(changed_at);

CREATE TABLE IF NOT EXISTS class_transfer_history (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  from_class_id TEXT,
  to_class_id TEXT,
  reason TEXT,
  changed_by TEXT,
  changed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_class_transfer_history_student ON class_transfer_history(student_id);
CREATE INDEX IF NOT EXISTS idx_class_transfer_history_from ON class_transfer_history(from_class_id);
CREATE INDEX IF NOT EXISTS idx_class_transfer_history_to ON class_transfer_history(to_class_id);

CREATE TABLE IF NOT EXISTS staff_permissions (
  id TEXT PRIMARY KEY,
  teacher_id TEXT NOT NULL,
  branch TEXT DEFAULT 'all',
  permission_key TEXT NOT NULL,
  allowed INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_staff_permissions_teacher ON staff_permissions(teacher_id);
CREATE INDEX IF NOT EXISTS idx_staff_permissions_branch ON staff_permissions(branch);
CREATE INDEX IF NOT EXISTS idx_staff_permissions_key ON staff_permissions(permission_key);

CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  actor_id TEXT,
  actor_role TEXT,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  before_json TEXT,
  after_json TEXT,
  ip_address TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_target ON audit_logs(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);

CREATE TABLE IF NOT EXISTS privacy_access_logs (
  id TEXT PRIMARY KEY,
  actor_id TEXT,
  student_id TEXT,
  access_type TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_privacy_access_logs_actor ON privacy_access_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_privacy_access_logs_student ON privacy_access_logs(student_id);
CREATE INDEX IF NOT EXISTS idx_privacy_access_logs_type ON privacy_access_logs(access_type);
CREATE INDEX IF NOT EXISTS idx_privacy_access_logs_created ON privacy_access_logs(created_at);
