-- EIE: exact withdrawal date for timetable recent-withdrawn student chips.
ALTER TABLE eie_students ADD COLUMN withdrawn_at TEXT;

CREATE INDEX IF NOT EXISTS idx_eie_students_withdrawn_at
  ON eie_students(withdrawn_at);
