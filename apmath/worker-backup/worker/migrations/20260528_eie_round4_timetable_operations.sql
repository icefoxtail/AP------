-- EIE Round 4 operation timetable migration.
-- Adds only operation-cell fields to existing eie_timetable_cells.
-- Does not create students, contacts, classroom_sessions, or student_session_records.

ALTER TABLE eie_timetable_cells ADD COLUMN source_type TEXT NOT NULL DEFAULT 'import';
ALTER TABLE eie_timetable_cells ADD COLUMN source_import_session_id TEXT;
ALTER TABLE eie_timetable_cells ADD COLUMN memo TEXT;

UPDATE eie_timetable_cells
SET source_type = 'import'
WHERE source_type IS NULL OR source_type = '';

UPDATE eie_timetable_cells
SET source_import_session_id = import_session_id
WHERE source_import_session_id IS NULL AND import_session_id IS NOT NULL;

UPDATE eie_timetable_cells
SET status = 'active'
WHERE status = 'imported';

CREATE INDEX IF NOT EXISTS idx_eie_timetable_cells_operation_status
  ON eie_timetable_cells(status, day_label, period_order, column_index);

CREATE INDEX IF NOT EXISTS idx_eie_timetable_cells_source_type
  ON eie_timetable_cells(source_type, source_import_session_id);
