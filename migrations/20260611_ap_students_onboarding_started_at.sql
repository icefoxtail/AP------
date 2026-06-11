-- AP Math: add persistent onboarding start date to students.
-- Keep onboarding_started_at as a stable student profile field,
-- not only as onboarding task/cache data.
ALTER TABLE students ADD COLUMN onboarding_started_at TEXT;
