# CODEX_RESULT

## 생성/수정 파일

- `tools/backfill-academy-schedule-series.mjs`
  - 원격 D1의 `academy_schedules`를 읽는 CLI와 순수 그룹핑 함수 `buildSeriesBackfill(rows)` 구현.
  - `--dry-run`에서는 파일을 쓰지 않고 시리즈 수, row 수, 예시만 출력.
  - 일반 실행에서는 백필 SQL과 롤백 SQL을 `migrations/`에 생성.
- `tests/backfill-academy-schedule-series.test.mjs`
  - 연속 3일, 날짜 틈, 시그니처 분리, 단일 일정, 기존 시리즈 제외, 삭제 row 제외, 멱등성, 월 경계 등 8개 케이스 추가.
- `migrations/20260623_academy_schedules_series_backfill.sql`
  - `2026-07-29 ~ 2026-07-31` 여름방학 3개 row에 공유 `series_id`, `series_kind='range'`, `series_until='2026-07-31'`을 부여하는 SQL.
- `migrations/20260623_academy_schedules_series_backfill_rollback.sql`
  - 위 3개 row를 `series_id=id`, `series_kind='single'`, `series_until=NULL`로 되돌리는 SQL.
- `CODEX_RESULT.md`
  - 이번 작업과 검증 결과 기록.

기존 작업 트리의 `.vscode/`, `archive/`, `eie/`, `CODEX_TASK.md` 변경은 수정하지 않았다. 금지된 프론트, 백엔드 라우트, 스키마 마이그레이션 파일도 변경하지 않았다.

## 구현 요약

- 후보는 `is_deleted=0`이고 `series_id`가 비었거나 `series_id === id`인 row로 제한했다.
- `schedule_type`, trim한 `title`, `start_time`, `end_time`, `memo`, `target_scope`, `student_id`가 모두 같은 row만 같은 시그니처로 묶었다.
- 각 시그니처를 날짜순으로 정렬하고 UTC 달력 기준 하루 차이인 연속 run만 연결했다.
- 길이 2 이상 run에만 `srs_bf_<timestamp>_<rand>` 형식의 공유 ID와 `range` 메타를 생성했다.
- 백필 후에는 `series_id !== id`가 되므로 같은 입력을 재실행해도 후보에서 제외된다.
- SQL에는 검증된 `acs_`/`srs_` ID만 사용하고 작은따옴표를 이스케이프한다.

## dry-run 및 SQL 통계

원격 D1 `ap-math-os` 읽기 결과:

```text
묶일 시리즈 수: 1
대상 row 수: 3
- 2026-07-29 ~ 2026-07-31 / 3건
  schedule_type=closed, title=여름방학, target_scope=global
```

생성 파일:

- `migrations/20260623_academy_schedules_series_backfill.sql`
- `migrations/20260623_academy_schedules_series_backfill_rollback.sql`

백필 대상 ID:

```text
acs_1779952705053
acs_1779952705724
acs_1779952705989
```

생성된 공유 ID:

```text
srs_bf_1782212906561_va4myi
```

## 검증 결과

통과:

```text
node --check tools/backfill-academy-schedule-series.mjs
node --test tests/backfill-academy-schedule-series.test.mjs
  8 tests passed, 0 failed
node tools/backfill-academy-schedule-series.mjs --dry-run
  원격 D1 읽기 성공, 1 series / 3 rows
```

## 운영 적용 결과

- 운영 D1 스키마 확인:
  - `series_id`, `series_kind`, `series_until` 컬럼과 `idx_academy_schedules_series` 인덱스가 이미 존재해 스키마 SQL은 중복 적용하지 않았다.
- 적용 전 전체 백업:
  - `_tmp/ap-math-os_before_schedule_series_20260623_201722.sql`
- 백필 SQL 적용 완료:
  - 대상 3개 row가 모두 `srs_bf_1782212906561_va4myi`, `range`, `2026-07-31`로 저장됨.
  - 적용 후 dry-run 결과: `0 series / 0 rows`로 멱등성 확인.
- 워커 배포 완료:
  - Worker: `ap-math-os-v2612`
  - URL: `https://ap-math-os-v2612.js-pdf.workers.dev`
  - Version ID: `36c8b8f3-4650-4ee1-929b-63aea859e307`
- 일정 시리즈 관련 회귀 테스트:
  - 24 tests passed, 0 failed.

## 다음 조치

1. 지시서의 일정 목록/시리즈 전체 수정·삭제 수동 확인 수행.

문제 발생 시 `migrations/20260623_academy_schedules_series_backfill_rollback.sql`로 메타를 원복한다.

## 미해결/판단 보류

- 없음.
- 수동 브라우저 UI 확인은 별도로 필요하다.
