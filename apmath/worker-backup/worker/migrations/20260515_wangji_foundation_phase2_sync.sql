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
