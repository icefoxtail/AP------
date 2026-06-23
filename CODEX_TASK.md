# 일정관리 — 레거시 다일 일정 series_id 백필 작업 지시서

형님 지시:
- 일정 목록에서 **날짜별로 흩어져 뜨는 기존 다일 일정**(예: 여름방학 7/29·7/30·7/31 따로)을 **한 묶음**으로 모아, 일자별이 아니라 **"시리즈 전체 수정/삭제"**로 다룰 수 있게 한다.
- 이미 배포될 신규 코드(`groupAcademyScheduleRows` + 시리즈 전체 수정/삭제 UI)는 **신규 일정**엔 동작하지만, **공유 `series_id`가 없는 기존 데이터**는 여전히 따로 뜬다. 그 빈틈만 메운다.

실행: Codex / 검수: Claude

---

## 1. 목적

공유 `series_id`가 없는 기존 academy_schedules 중 **연속날짜 + 동일내용**인 묶음에 공유 `series_id`를 1회성으로 부여한다. 그러면 배포된 화면이 자동으로 1행 집계하고(`occurrence_count > 1`), 이미 구현된 **"시리즈 전체 수정/삭제"** 가 그대로 활성화된다.

**프론트/백엔드 코드 변경 0.** 데이터(기존 row의 series_id 메타)만 보정한다.

---

## 2. 전제 / 적용 순서

이 작업은 series 스키마가 이미 있는 상태에서 데이터만 보정한다. 운영 적용 순서:

```text
① 스키마 마이그레이션 apmath/worker-backup/worker/migrations/20260622_academy_schedules_series.sql 적용
② 본 작업 산출물(백필 SQL) 생성 + 검토
③ D1 백업
④ 백필 SQL 적용
⑤ 워커 ap-math-os-v2612 배포
```

본 Codex 작업 범위는 **①이 적용된 D1을 전제로 ②(생성 도구 + 백필 SQL + 롤백 SQL + 테스트)까지**다. ③④⑤(원격 적용·배포)는 저장소 규칙대로 실행하지 않고 CODEX_RESULT 다음 조치로만 남긴다.

---

## 3. 절대 금지

```text
- git add / git commit / git push / deploy 금지. (작업 트리 변경까지만)
- 원격 D1에 백필 SQL 직접 적용 금지(생성·검토까지만). 배포 금지.
- 프론트 변경 금지: apmath/js/schedule.js, apmath/js/dashboard.js, apmath/js/dashboard-admin.js 손대지 말 것.
- 백엔드 라우트 변경 금지: apmath/worker-backup/worker/routes/operations.js 손대지 말 것(신규 API 만들지 말 것).
- 스키마 마이그레이션 20260622_academy_schedules_series.sql 변경 금지.
- is_deleted = 1 row 변경 금지.
- 이미 공유 series_id를 가진 신규 row(series_id != id) 변경 금지.
- schedule_date 등 일정 본문 값 변경 금지 — series_id / series_kind / series_until 메타만 보정.
- EIE 등 타 도메인 변경 금지.
```

---

## 4. 반드시 확인할 파일 (현재 상태 기준 — 확인된 사실)

- `apmath/worker-backup/worker/migrations/20260622_academy_schedules_series.sql` — series_id / series_kind('single'|'range'|'weekly') / series_until 컬럼 + 백필(`series_id=id`, `series_kind='single'`) + idx.
- `apmath/worker-backup/worker/routes/operations.js:217~252` 부근(프론트 `groupAcademyScheduleRows`는 schedule.js) — 참고: **수정/삭제 시리즈 API 경로**
  - `PATCH /academy-schedules/series/:seriesId`, `DELETE /academy-schedules/series/:seriesId` (operations.js 내 구현). 백필로 부여한 series_id가 이 경로로 동작한다.
- `apmath/js/schedule.js`
  - `groupAcademyScheduleRows(rows)` — `series_id` 기준 그룹핑(없으면 `id` fallback). 백필 후 자동 1행 집계.
  - `openEditUnifiedScheduleModal` — `occurrence_count > 1`이면 "이 날짜만 / 시리즈 전체" 라디오 노출.
- `apmath/worker-backup/worker/wrangler.jsonc` — D1 바인딩/DB 이름 확인(백필 도구의 `wrangler d1 execute` 대상).
- 기존 마이그레이션 네이밍/위치 관례: `migrations/` 및 `apmath/worker-backup/worker/migrations/`.

academy_schedules 컬럼(보정 대상): `id, schedule_type, title, schedule_date, start_time, end_time, target_scope, student_id, teacher_name, memo, series_id, series_kind, series_until, is_closed, is_deleted`.

---

## 5. 허용 작업 범위

### 작업 1 — 그룹핑 도구 + 순수 함수

`tools/backfill-academy-schedule-series.mjs` 신규 생성.

**1-1. 순수 함수 `buildSeriesBackfill(rows)` (export)** — 테스트 대상, I/O 없음.
- 입력: academy_schedules row 배열(위 컬럼 포함).
- **대상 필터**: `is_deleted=0` 이고 `series_id`가 비었거나 `series_id === id` 인 row만 후보(= 레거시/단일). 그 외(신규 시리즈 row)는 제외.
- **시그니처 그룹**: 아래가 모두 동일한 row끼리 묶는다(빈값/NULL은 `''`로 정규화, title은 trim):
  - `schedule_type`, `title`, `start_time`, `end_time`, `memo`, `target_scope`, `student_id`
- 각 시그니처 그룹 내에서 `schedule_date` 오름차순 정렬 후 **연속 run** 검출(전날 + 1일 === 다음날, 달력 기준; 틈 있으면 run 분리).
- **run 길이 ≥ 2** 인 경우에만 series 부여:
  - `series_id = 'srs_bf_' + <timestamp> + '_' + <rand>` (run마다 유일)
  - `series_kind = 'range'`
  - `series_until = run의 마지막 schedule_date`
- run 길이 1(진짜 단일)은 변경 대상 아님(결과에 포함하지 않음).
- 반환: `[{ seriesId, seriesKind, seriesUntil, ids: [...], firstDate, lastDate }]` 형태(SQL 생성·요약용).
- **멱등성**: 한 번 백필된 row는 `series_id !== id`가 되어 다음 실행에서 후보 제외 → 재실행해도 추가 변경 없음. 함수가 이 성질을 보장하도록 대상 필터를 위와 같이 구현.

**1-2. D1 읽기 + SQL 생성**
- `wrangler d1 execute <DB> --remote --json --command "SELECT id, schedule_date, schedule_type, title, start_time, end_time, memo, target_scope, student_id, series_id FROM academy_schedules WHERE is_deleted=0"` 로 row를 읽어 `buildSeriesBackfill`에 넣는다. (DB 이름은 wrangler.jsonc에서 확인.)
- 결과로 **백필 SQL 파일** 생성: `migrations/<YYYYMMDD>_academy_schedules_series_backfill.sql`
  ```sql
  -- run당 한 문장
  UPDATE academy_schedules
     SET series_id='srs_bf_...', series_kind='range', series_until='2026-07-31', updated_at=DATETIME('now')
   WHERE id IN ('acs_a','acs_b','acs_c') AND is_deleted=0;
  ```
- **롤백 SQL 파일**도 함께 생성: `migrations/<YYYYMMDD>_academy_schedules_series_backfill_rollback.sql`
  ```sql
  -- 해당 id들을 단일 상태로 되돌림
  UPDATE academy_schedules SET series_id=id, series_kind='single', series_until=NULL, updated_at=DATETIME('now')
   WHERE id IN ('acs_a','acs_b','acs_c');
  ```
- 문자열 값은 SQL escape 처리(작은따옴표 이스케이프). title/memo는 SQL 값으로 쓰지 않고 **id IN 목록만** 사용하므로 인젝션 위험 최소(id는 `acs_`/`srs_` 패턴).

**1-3. `--dry-run` 모드**
- D1을 읽되 파일은 쓰지 않고, **묶일 시리즈 수 / 대상 row 수 / 예시 몇 건**(시그니처·날짜범위·id 수)만 stdout 출력.

### 작업 2 — 테스트

`tests/backfill-academy-schedule-series.test.mjs` 신규 생성, `buildSeriesBackfill` 단위 테스트:
```text
[ ] 연속 3일 동일내용 → 한 시리즈(range, until=마지막날, ids 3개)
[ ] 중간 날짜 빠짐(7/29,7/31) → 두 개의 run, 각 길이 1이므로 시리즈 미생성
[ ] 동일제목이라도 시간/메모/scope/student_id 다르면 분리
[ ] 단일 일정(run 길이 1)은 결과에 미포함
[ ] series_id != id 인 신규 시리즈 row는 후보에서 제외
[ ] is_deleted=1 row 제외
[ ] 멱등성: 1차 결과의 ids에 series_id를 적용한 입력으로 재실행 시 빈 결과
[ ] 월 경계 연속(7/31 → 8/1) 정상 연결
```

---

## 6. 제외 범위

```text
- 프론트/백엔드/스키마 코드 변경(데이터 보정 전용).
- 신규 API, 신규 컬럼.
- weekly 추정 백필 금지(레거시 다일은 전부 연속 daily이므로 series_kind='range'만 부여).
- 묶음 기준 완화(동일내용 + 연속만; 틈 있는 동일제목 병합 금지).
- 원격 D1 적용/배포.
```

---

## 7. 검증 명령

```text
- node --check tools/backfill-academy-schedule-series.mjs
- node --test tests/backfill-academy-schedule-series.test.mjs   (전 케이스 통과)
- node tools/backfill-academy-schedule-series.mjs --dry-run      (D1 접근 가능 시 요약 출력; 불가 시 사유 기록)
```

수동 확인(배포 후, 형님/Claude):
```text
[ ] 백필 SQL 적용 전 D1 백업 완료
[ ] 적용 후: 여름방학 7/29~31이 일정 목록에서 1행 "여름방학 · 2026-07-29 ~ 07-31"로 표시
[ ] 그 1행 수정 진입 시 "이 날짜만 / 시리즈 전체" 라디오 노출, "시리즈 전체"로 제목/메모 일괄 수정됨
[ ] "시리즈 전체 삭제"로 3일치 한 번에 사라짐
[ ] 묶이지 않아야 할 별개 일정(틈 있음/내용 다름)은 그대로 개별 표시
[ ] 신규 코드로 만든 시리즈는 영향 없음
```

---

## 8. `CODEX_RESULT.md` 작성 기준

```text
- 생성/수정 파일 목록 + 각 파일에서 한 일
- buildSeriesBackfill 그룹핑/연속run/멱등 구현 요약
- 생성된 백필 SQL / 롤백 SQL 경로와 대상 시리즈·row 통계(dry-run 결과)
- 검증 명령 실행 결과(통과/실패, 실패 원문)
- 다음 조치: ③ D1 백업 → ④ 백필 SQL 적용 → ⑤ 워커 배포 (미실행 명시)
- 미해결/판단 보류(있으면)
```
