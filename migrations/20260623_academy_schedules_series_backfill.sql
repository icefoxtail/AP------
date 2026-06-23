-- 2026-07-29 ~ 2026-07-31 (3 rows)
UPDATE academy_schedules
   SET series_id='srs_bf_1782212906561_va4myi', series_kind='range', series_until='2026-07-31', updated_at=DATETIME('now')
 WHERE id IN ('acs_1779952705053','acs_1779952705724','acs_1779952705989') AND is_deleted=0;
