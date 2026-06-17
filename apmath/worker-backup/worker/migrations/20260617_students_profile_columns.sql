-- AP Math: columns used by student create/update profile payloads.
ALTER TABLE students ADD COLUMN onboarding_started_at TEXT;
ALTER TABLE students ADD COLUMN high_subjects TEXT DEFAULT '[]';
