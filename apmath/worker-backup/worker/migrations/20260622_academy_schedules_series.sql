ALTER TABLE academy_schedules ADD COLUMN series_id TEXT;
ALTER TABLE academy_schedules ADD COLUMN series_kind TEXT DEFAULT 'single';
ALTER TABLE academy_schedules ADD COLUMN series_until TEXT;

UPDATE academy_schedules SET series_id = id WHERE series_id IS NULL OR TRIM(series_id) = '';
UPDATE academy_schedules SET series_kind = 'single' WHERE series_kind IS NULL OR TRIM(series_kind) = '';

CREATE INDEX IF NOT EXISTS idx_academy_schedules_series ON academy_schedules(series_id);
