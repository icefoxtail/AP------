CREATE TABLE IF NOT EXISTS teachers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  login_id TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'teacher',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  school_name TEXT,
  grade TEXT,
  target_score INTEGER DEFAULT NULL,
  status TEXT DEFAULT '재원',
  memo TEXT,
  guardian_name TEXT,
  guardian_relation TEXT,
  student_phone TEXT,
  parent_phone TEXT,
  student_pin TEXT UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS classes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  grade TEXT,
  subject TEXT,
  teacher_name TEXT,
  schedule_days TEXT,
  textbook TEXT,
  is_active INTEGER DEFAULT 1,
  day_group TEXT,
  time_label TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS teacher_classes (
  teacher_id TEXT NOT NULL,
  class_id TEXT NOT NULL,
  PRIMARY KEY (teacher_id, class_id)
);

CREATE TABLE IF NOT EXISTS class_students (
  class_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  PRIMARY KEY (class_id, student_id)
);

CREATE TABLE IF NOT EXISTS attendance (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  status TEXT NOT NULL,
  date DATE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS homework (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  status TEXT NOT NULL,
  date DATE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS exam_sessions (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  exam_title TEXT,
  score INTEGER,
  exam_date DATE,
  question_count INTEGER DEFAULT 0,
  class_id TEXT,
  archive_file TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS wrong_answers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  student_id TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  standard_unit TEXT,
  difficulty TEXT
);

CREATE TABLE IF NOT EXISTS consultations (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  date TEXT NOT NULL,
  type TEXT,
  content TEXT NOT NULL,
  next_action TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS operation_memos (
  id TEXT PRIMARY KEY,
  memo_date TEXT,
  content TEXT NOT NULL,
  is_pinned INTEGER DEFAULT 0,
  is_done INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS exam_schedules (
  id TEXT PRIMARY KEY,
  school_name TEXT,
  grade TEXT,
  exam_name TEXT,
  exam_date TEXT NOT NULL,
  memo TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS academy_schedules (
  id TEXT PRIMARY KEY,
  schedule_type TEXT NOT NULL,
  title TEXT NOT NULL,
  schedule_date TEXT NOT NULL,
  start_time TEXT,
  end_time TEXT,
  target_scope TEXT DEFAULT 'global',
  student_id TEXT,
  teacher_name TEXT,
  memo TEXT,
  is_closed INTEGER DEFAULT 0,
  is_deleted INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS school_exam_records (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  class_id TEXT,
  school_name TEXT,
  grade TEXT,
  exam_year INTEGER NOT NULL,
  semester TEXT,
  exam_type TEXT NOT NULL,
  subject TEXT NOT NULL,
  score INTEGER,
  target_score_snapshot INTEGER,
  memo TEXT,
  is_deleted INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS exam_blueprints (
  archive_file TEXT NOT NULL,
  question_no INTEGER NOT NULL,
  source_archive_file TEXT,
  source_question_no INTEGER,
  standard_unit_key TEXT,
  standard_unit TEXT,
  standard_course TEXT,
  concept_cluster_key TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (archive_file, question_no)
);

CREATE TABLE IF NOT EXISTS class_exam_assignments (
  id TEXT PRIMARY KEY,
  class_id TEXT NOT NULL,
  exam_title TEXT NOT NULL,
  exam_date TEXT NOT NULL,
  question_count INTEGER DEFAULT 0,
  archive_file TEXT DEFAULT '',
  source_type TEXT DEFAULT 'archive',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(class_id, exam_title, exam_date, archive_file)
);

CREATE TABLE IF NOT EXISTS daily_journals (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  teacher_name TEXT,
  content TEXT,
  feedback TEXT,
  status TEXT DEFAULT '작성중',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS class_textbooks (
  id TEXT PRIMARY KEY,
  class_id TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  start_date TEXT,
  end_date TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS class_daily_records (
  id TEXT PRIMARY KEY,
  class_id TEXT NOT NULL,
  date TEXT NOT NULL,
  teacher_name TEXT,
  special_note TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS class_daily_progress (
  id TEXT PRIMARY KEY,
  record_id TEXT NOT NULL,
  class_id TEXT NOT NULL,
  textbook_id TEXT,
  textbook_title_snapshot TEXT,
  progress_text TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);
CREATE INDEX IF NOT EXISTS idx_students_pin ON students(student_pin);

CREATE INDEX IF NOT EXISTS idx_classes_active ON classes(is_active);
CREATE INDEX IF NOT EXISTS idx_classes_teacher ON classes(teacher_name);

CREATE INDEX IF NOT EXISTS idx_teacher_classes_teacher ON teacher_classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_classes_class ON teacher_classes(class_id);

CREATE INDEX IF NOT EXISTS idx_class_students_class ON class_students(class_id);
CREATE INDEX IF NOT EXISTS idx_class_students_student ON class_students(student_id);

CREATE INDEX IF NOT EXISTS idx_attendance_student_date ON attendance(student_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);

CREATE INDEX IF NOT EXISTS idx_homework_student_date ON homework(student_id, date);
CREATE INDEX IF NOT EXISTS idx_homework_date ON homework(date);

CREATE INDEX IF NOT EXISTS idx_exam_sessions_student ON exam_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_exam_sessions_class ON exam_sessions(class_id);
CREATE INDEX IF NOT EXISTS idx_exam_sessions_date ON exam_sessions(exam_date);
CREATE INDEX IF NOT EXISTS idx_exam_sessions_archive ON exam_sessions(archive_file);

CREATE INDEX IF NOT EXISTS idx_wrong_answers_session ON wrong_answers(session_id);
CREATE INDEX IF NOT EXISTS idx_wrong_answers_student ON wrong_answers(student_id);

CREATE INDEX IF NOT EXISTS idx_consultations_student_id ON consultations(student_id);
CREATE INDEX IF NOT EXISTS idx_consultations_date ON consultations(date);

CREATE INDEX IF NOT EXISTS idx_operation_memos_date ON operation_memos(memo_date);
CREATE INDEX IF NOT EXISTS idx_operation_memos_done ON operation_memos(is_done);

CREATE INDEX IF NOT EXISTS idx_exam_schedules_date ON exam_schedules(exam_date);

CREATE INDEX IF NOT EXISTS idx_academy_schedules_date ON academy_schedules(schedule_date);
CREATE INDEX IF NOT EXISTS idx_academy_schedules_student ON academy_schedules(student_id);
CREATE INDEX IF NOT EXISTS idx_academy_schedules_deleted ON academy_schedules(is_deleted);

CREATE INDEX IF NOT EXISTS idx_school_exam_records_student ON school_exam_records(student_id);
CREATE INDEX IF NOT EXISTS idx_school_exam_records_class ON school_exam_records(class_id);
CREATE INDEX IF NOT EXISTS idx_school_exam_records_year ON school_exam_records(exam_year);
CREATE INDEX IF NOT EXISTS idx_school_exam_records_deleted ON school_exam_records(is_deleted);

CREATE INDEX IF NOT EXISTS idx_exam_blueprints_archive ON exam_blueprints(archive_file);
CREATE INDEX IF NOT EXISTS idx_exam_blueprints_unit ON exam_blueprints(standard_unit_key);
CREATE INDEX IF NOT EXISTS idx_exam_blueprints_cluster ON exam_blueprints(concept_cluster_key);

CREATE INDEX IF NOT EXISTS idx_class_exam_assignments_class ON class_exam_assignments(class_id);
CREATE INDEX IF NOT EXISTS idx_class_exam_assignments_date ON class_exam_assignments(exam_date);

CREATE INDEX IF NOT EXISTS idx_daily_journals_date ON daily_journals(date);
CREATE INDEX IF NOT EXISTS idx_daily_journals_teacher ON daily_journals(teacher_name);

CREATE INDEX IF NOT EXISTS idx_class_textbooks_class ON class_textbooks(class_id);
CREATE INDEX IF NOT EXISTS idx_class_textbooks_status ON class_textbooks(status);

CREATE INDEX IF NOT EXISTS idx_class_daily_records_class_date ON class_daily_records(class_id, date);
CREATE INDEX IF NOT EXISTS idx_class_daily_progress_record ON class_daily_progress(record_id);
CREATE INDEX IF NOT EXISTS idx_class_daily_progress_class ON class_daily_progress(class_id);

CREATE TABLE IF NOT EXISTS homework_photo_assignments (
  id TEXT PRIMARY KEY,
  class_id TEXT NOT NULL,
  teacher_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date TEXT NOT NULL,
  due_time TEXT,
  status TEXT DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (class_id) REFERENCES classes(id),
  FOREIGN KEY (teacher_id) REFERENCES teachers(id)
);

CREATE INDEX IF NOT EXISTS idx_homework_photo_assignments_class_due
  ON homework_photo_assignments(class_id, due_date);
CREATE INDEX IF NOT EXISTS idx_homework_photo_assignments_teacher
  ON homework_photo_assignments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_homework_photo_assignments_status
  ON homework_photo_assignments(status);

CREATE TABLE IF NOT EXISTS homework_photo_submissions (
  id TEXT PRIMARY KEY,
  assignment_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  is_submitted INTEGER DEFAULT 0,
  submitted_at TEXT,
  synced_homework_date TEXT,
  synced_homework_status TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (assignment_id) REFERENCES homework_photo_assignments(id),
  FOREIGN KEY (student_id) REFERENCES students(id),
  UNIQUE(assignment_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_homework_photo_submissions_assignment
  ON homework_photo_submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_homework_photo_submissions_student
  ON homework_photo_submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_homework_photo_submissions_submitted
  ON homework_photo_submissions(is_submitted);

CREATE TABLE IF NOT EXISTS homework_photo_files (
  id TEXT PRIMARY KEY,
  submission_id TEXT NOT NULL,
  file_key TEXT NOT NULL,
  file_name TEXT,
  file_type TEXT,
  file_size INTEGER DEFAULT 0,
  expires_at TEXT NOT NULL,
  deleted_at TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (submission_id) REFERENCES homework_photo_submissions(id)
);

CREATE INDEX IF NOT EXISTS idx_homework_photo_files_submission
  ON homework_photo_files(submission_id);
CREATE INDEX IF NOT EXISTS idx_homework_photo_files_expires
  ON homework_photo_files(expires_at);
CREATE INDEX IF NOT EXISTS idx_homework_photo_files_deleted
  ON homework_photo_files(deleted_at);

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

CREATE TABLE IF NOT EXISTS foundation_sync_logs (
  id TEXT PRIMARY KEY,
  sync_type TEXT NOT NULL,
  status TEXT DEFAULT 'success',
  dry_run INTEGER DEFAULT 0,
  inserted_count INTEGER DEFAULT 0,
  skipped_count INTEGER DEFAULT 0,
  updated_count INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  summary_json TEXT,
  created_by TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_foundation_sync_logs_type
  ON foundation_sync_logs(sync_type);

CREATE INDEX IF NOT EXISTS idx_foundation_sync_logs_created
  ON foundation_sync_logs(created_at);
