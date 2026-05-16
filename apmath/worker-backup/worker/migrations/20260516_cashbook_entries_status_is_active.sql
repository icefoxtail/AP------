ALTER TABLE cashbook_entries ADD COLUMN status TEXT DEFAULT 'active';
ALTER TABLE cashbook_entries ADD COLUMN is_active INTEGER DEFAULT 1;

CREATE INDEX IF NOT EXISTS idx_cashbook_entries_status ON cashbook_entries(status);
CREATE INDEX IF NOT EXISTS idx_cashbook_entries_active ON cashbook_entries(is_active);
