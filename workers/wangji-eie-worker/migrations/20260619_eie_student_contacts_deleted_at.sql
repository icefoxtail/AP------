ALTER TABLE eie_student_contacts ADD COLUMN deleted_at TEXT;

CREATE INDEX IF NOT EXISTS idx_eie_student_contacts_deleted_at
  ON eie_student_contacts(deleted_at);
