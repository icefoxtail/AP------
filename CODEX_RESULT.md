# CODEX_RESULT: AP Math + EIE Monthly Timetable Snapshot FAIL 보정

## 1. 보정 요약

- AP/EIE 프론트 월말 계산에서 `toISOString()` 사용을 제거하고 로컬 날짜 문자열 조립으로 수정했다.
- AP/EIE Worker 비교 로직을 학생 1명 = row 1개 가정에서 학생 identity별 position set 비교로 수정했다.
- AP 월별 snapshot 저장 UI가 `{ success:false }` 응답을 성공으로 처리하지 않도록 수정했다.
- 월별 시간표 관련 변경 파일과 unrelated 변경을 분리해서 확인했다.
- cron, remote D1 migration, Worker deploy, git add/commit/push는 실행하지 않았다.

## 2. 수정 파일 목록

AP Math:
- `apmath/js/timetable-months.js`
- `apmath/worker-backup/worker/routes/timetable-months.js`
- `tests/apmath-monthly-timetable-snapshot.test.js`

EIE:
- `eie/js/views/eie-timetable-months.js`
- `workers/wangji-eie-worker/routes/eie.js`
- `tests/eie-monthly-timetable-snapshot.test.js`

검증/문서:
- `CODEX_RESULT.md`

기존 1차 구현 파일은 유지:
- `apmath/css/timetable-months.css`
- `apmath/worker-backup/worker/migrations/20260618_ap_timetable_month_snapshots.sql`
- `workers/wangji-eie-worker/migrations/20260618_eie_timetable_month_snapshots.sql`
- `eie/css/eie-timetable-months.css`
- `tests/timetable-monthly-snapshot-schema.test.js`
- AP/EIE index/router/api 연결 파일들

## 3. 제외한 unrelated 변경 목록

현재 `git diff --name-only` 및 `git ls-files --others --exclude-standard` 기준으로 월별 시간표 범위 밖 변경은 확인되지 않았다.

이전 점검에서 보였던 아래 unrelated 후보는 이번 최종 상태의 diff 목록에는 없다.
- `eie/css/eie-timetable-board-fixes.css`
- `eie/js/views/eie-students.js`
- `tests/eie-grade-normalization.test.js`
- `tests/eie-students-breakdown-print.test.js`

별도 기존 파일:
- `CODEX_RESULT1.md`는 git tracked 파일이 아니며 이번 작업 status 대상이 아니다. 내용도 이번 월별 시간표 보정과 무관하므로 삭제/수정하지 않았다.

## 4. monthEnd 수정 내용

대상:
- `apmath/js/timetable-months.js`
- `eie/js/views/eie-timetable-months.js`

수정:
- `new Date(year, month, 0).toISOString().slice(0, 10)` 제거
- `getDate()`로 말일 숫자를 구한 뒤 `YYYY-MM-DD` 문자열을 직접 조립

검증 케이스:
- `monthEnd('2026-06') === '2026-06-30'`
- `monthEnd('2026-02') === '2026-02-28'`
- `monthEnd('2028-02') === '2028-02-29'`

## 5. 다중 배정 비교 로직 수정 내용

AP:
- `buildSnapshotChangeSet(previous, current)` 추가
- `normalizeNameKey(row)`는 `source_student_id` 우선, 없으면 `display_name + grade + school_name`
- `positionKey(row)`는 `source_class_id`, `source_cell_id`, 요일/교시/시간/반명/교사명을 포함

EIE:
- `buildEieTimetableMonthChangeSet(previous, current)` 추가
- `normalizeSnapshotStudentKey(row)`는 `source_student_id` 우선, 없으면 `normalized_name/display_name + grade + school_name`
- `snapshotPositionKey(row)`는 `source_cell_id`, 요일/교시/시간/반명/교사명, `column_index`, `slot_lane` 포함

동작:
- 이전/현재 snapshot student rows를 identity별 배열로 묶는다.
- 각 학생별 position set을 비교한다.
- 이전에 없고 현재에만 있으면 `joined`.
- 이전에 있고 현재에 없으면 `left`.
- 같은 학생이 양쪽에 있고 position set이 다르면 `moved`.
- `moved`에는 `before_positions`, `after_positions`, `removed_positions`, `added_positions`를 포함한다.

## 6. AP 저장 실패 UI 처리 수정 내용

대상:
- `apmath/js/timetable-months.js`

수정:
- `api.saveTimetableMonthSnapshot()` 결과를 검사한다.
- `result.success === false`면 오류 메시지를 표시하고 `loadMonths()`를 호출하지 않는다.
- 중복 저장 오류는 `이미 저장된 월별 시간표입니다. 덮어쓰기를 사용하세요.` 계열 메시지로 보여준다.
- 성공 응답일 때만 목록을 다시 불러온다.

## 7. node --check 결과

PASS:
- `node --check .\apmath\worker-backup\worker\routes\timetable-months.js`
- `node --check .\apmath\worker-backup\worker\index.js`
- `node --check .\apmath\js\core.js`
- `node --check .\apmath\js\timetable-months.js`
- `node --check .\apmath\js\timetable.js`
- `node --check .\apmath\js\ui.js`
- `node --check .\workers\wangji-eie-worker\routes\eie.js`
- `node --check .\workers\wangji-eie-worker\index.js`
- `node --check .\eie\js\eie-api.js`
- `node --check .\eie\js\eie-router.js`
- `node --check .\eie\js\views\eie-timetable-months.js`
- `node --check .\eie\js\views\eie-timetable.js`

## 8. dynamic import 결과

PASS:
- `cd C:\Users\USER\Desktop\AP------\apmath\worker-backup\worker`
- `node -e "import('./routes/timetable-months.js').then(()=>console.log('ap route import ok'))"`
- `node -e "import('./index.js').then(()=>console.log('ap worker import ok'))"`
- `cd C:\Users\USER\Desktop\AP------\workers\wangji-eie-worker`
- `node -e "import('./routes/eie.js').then(()=>console.log('eie route import ok'))"`
- `node -e "import('./index.js').then(()=>console.log('eie worker import ok'))"`

## 9. 테스트 결과

PASS:
- `node .\tests\timetable-monthly-snapshot-schema.test.js`
- `node .\tests\apmath-monthly-timetable-snapshot.test.js`
- `node .\tests\eie-monthly-timetable-snapshot.test.js`

강화된 테스트 내용:
- AP/EIE 프론트 `monthEnd()` 2026-06, 2026-02, 2028-02
- AP/EIE 학생 다중 position 중 일부 제거가 `moved`로 잡히는지
- AP/EIE 같은 학생의 position A -> B 이동이 `joined/left`가 아니라 `moved`로 잡히는지
- AP/EIE 완전 신규 학생은 `joined`
- AP/EIE 완전 제거 학생은 `left`
- AP `saveSnapshot()`이 `{ success:false }`를 성공 처리하지 않고 목록 reload를 막는지
- AP 중복 저장 안내는 ASCII 문구 `Monthly timetable snapshot already exists. Use overwrite.`로 표시
- AP/EIE dynamic import 가능 여부

Review bot 최종 결과:
- Codex B logic/routing: 핵심 보정 항목 PASS. `CODEX_RESULT1.md`는 별도 기존 파일로 제외 기록.
- Codex C UI/CSS rerun: PASS. 브라우저 클릭/스크린샷은 UNVERIFIED.
- Codex D tests/regression rerun: PASS. live Worker/D1/deploy/git 작업은 UNVERIFIED.

## 10. remote D1 migration 미실행 확인

- remote D1 migration 명령은 실행하지 않았다.
- migration 파일 생성/수정만 수행했다.

## 11. Worker deploy 미실행 확인

- Worker deploy 명령은 실행하지 않았다.

## 12. git add/commit/push 미실행 확인

- `git add`, `git commit`, `git push`는 실행하지 않았다.

## 13. 남은 위험 요소

- 브라우저 실클릭/스크린샷 검증은 미실행이다.
- 실제 D1 데이터에 대한 snapshot 생성/비교 API 런타임 호출은 미실행이다.
- AP/EIE 월별 snapshot 1차 구현은 수동 저장 기준이며 cron 자동 저장은 구현하지 않았다.

## 14. 다음 검증/배포 전 명령

로컬 정적 검증:
```powershell
cd C:\Users\USER\Desktop\AP------
node --check .\apmath\worker-backup\worker\routes\timetable-months.js
node --check .\apmath\worker-backup\worker\index.js
node --check .\apmath\js\timetable-months.js
node --check .\workers\wangji-eie-worker\routes\eie.js
node --check .\eie\js\views\eie-timetable-months.js
node .\tests\timetable-monthly-snapshot-schema.test.js
node .\tests\apmath-monthly-timetable-snapshot.test.js
node .\tests\eie-monthly-timetable-snapshot.test.js
```

사용자 승인 후에만 실행할 원격 명령:
```powershell
wrangler d1 execute wangji-eie-os --remote --file=workers/wangji-eie-worker/migrations/20260618_eie_timetable_month_snapshots.sql
cd C:\Users\USER\Desktop\AP------\workers\wangji-eie-worker
npx wrangler deploy --config .\wrangler.jsonc
```
