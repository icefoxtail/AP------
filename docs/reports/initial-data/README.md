# initial-data 분리 분석 문서

`/api/initial-data` 분리, lazy load 후보, 다음 단계 분석 문서를 모아둔다.

이 문서들은 아직 향후 작업에서 참고할 가능성이 있으므로 archive가 아니라 별도 작업 주제 폴더에 둔다.
# 2026-05-27 initial-data repair note

`/api/initial-data` no longer runs `repairTeacherClassMappings(env)` on every request. Remaining split candidates, including heavy report cohort work, stay documented in `CORE2_INITIAL_DATA_NEXT_SPLIT_ANALYSIS.md` for a later lazy-load phase.
