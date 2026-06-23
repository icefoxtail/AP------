-- rollback 2026-07-29 ~ 2026-07-31 (3 rows)
UPDATE academy_schedules SET series_id=id, series_kind='single', series_until=NULL, updated_at=DATETIME('now')
 WHERE id IN ('acs_1779952705053','acs_1779952705724','acs_1779952705989');
