-- =============================================================================
-- [WANGJI PARENT FOUNDATION] Consent model + message log snapshot foundation
-- 목적: 실제 발송 전 수신 동의 scope와 발송 당시 snapshot 저장 기반을 만든다.
-- 주의: 실제 문자/알림톡/이메일 발송 기능은 포함하지 않는다.
-- =============================================================================

CREATE TABLE IF NOT EXISTS parent_contact_consents (
  id TEXT PRIMARY KEY,
  parent_contact_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  branch TEXT DEFAULT 'all',
  consent_type TEXT NOT NULL,
  is_allowed INTEGER DEFAULT 1,
  changed_by TEXT,
  memo TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(parent_contact_id, student_id, branch, consent_type)
);

CREATE INDEX IF NOT EXISTS idx_parent_contact_consents_parent
  ON parent_contact_consents(parent_contact_id);

CREATE INDEX IF NOT EXISTS idx_parent_contact_consents_student
  ON parent_contact_consents(student_id);

CREATE INDEX IF NOT EXISTS idx_parent_contact_consents_branch
  ON parent_contact_consents(branch);

CREATE INDEX IF NOT EXISTS idx_parent_contact_consents_type
  ON parent_contact_consents(consent_type);

ALTER TABLE message_logs ADD COLUMN recipient_phone_snapshot TEXT;
ALTER TABLE message_logs ADD COLUMN recipient_name_snapshot TEXT;
ALTER TABLE message_logs ADD COLUMN relation_snapshot TEXT;
ALTER TABLE message_logs ADD COLUMN consent_snapshot_json TEXT;
ALTER TABLE message_logs ADD COLUMN template_key TEXT;
ALTER TABLE message_logs ADD COLUMN provider TEXT;
ALTER TABLE message_logs ADD COLUMN preview_batch_id TEXT;
ALTER TABLE message_logs ADD COLUMN queued_at TEXT;
ALTER TABLE message_logs ADD COLUMN delivered_at TEXT;
ALTER TABLE message_logs ADD COLUMN failed_at TEXT;
ALTER TABLE message_logs ADD COLUMN retry_of TEXT;

CREATE INDEX IF NOT EXISTS idx_message_logs_preview
  ON message_logs(preview_batch_id);

CREATE INDEX IF NOT EXISTS idx_message_logs_template
  ON message_logs(template_key);
