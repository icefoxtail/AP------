# CODEX_RESULT: 월별 시간표 UI 기존 화면 통합

## 1. UI 방향 보정 내역

- AP Math는 별도 월별 시간표 화면 대신 기존 `renderTimetable()` 화면 안에서 월 선택을 처리하도록 바꿨다.
- EIE는 `#timetable-months` route를 `#timetable`로 보정하고, 별도 월별 페이지 자산 로드를 제거했다.
- 상단 월 칩 목록은 만들지 않았다.
- 기존 시간표 보드/카드/그리드 렌더러를 재사용한다.

## 2. AP 구현 내역

- `apmath/js/timetable.js`
  - 기존 시간표 헤더에 작은 월 선택 select와 이전/다음 버튼을 추가했다.
  - 저장된 월 선택 시 월별 데이터를 기존 `classes`, `class_students`, `class_time_slots`, `students` 형태의 가상 DB로 변환한다.
  - 기존 `renderTimetableGrid(section)`를 그대로 사용해 과거 월을 렌더링한다.
  - 과거 월 모드에서는 admin 편집 affordance와 빈 학생 추가 슬롯을 비활성화한다.
  - 시간표 보드 영역에 pointer drag/swipe 월 이동을 추가했다.
- `apmath/js/timetable-months.js`
  - 별도 화면 렌더러를 제거하고 기존 `renderTimetable()`로 귀착되는 호환 alias만 남겼다.
- `apmath/js/ui.js`
  - drawer에서 `renderTimetableMonths` 별도 항목을 렌더하지 않도록 했다.

## 3. EIE 구현 내역

- `eie/js/views/eie-timetable.js`
  - 기존 EIE 시간표 헤더에 작은 월 선택 select와 이전/다음 버튼을 추가했다.
  - 저장된 월 선택 시 월별 데이터를 기존 timetable cell row 형태로 변환한다.
  - 기존 `buildDisplaySessions()`와 `renderBoard(sessions)`를 그대로 사용한다.
  - 과거 월 모드에서는 편집 버튼과 상세/편집 패널을 숨긴다.
  - 시간표 보드 영역에 pointer drag/swipe 월 이동을 추가했다.
- `eie/js/eie-router.js`
  - `#timetable-months`를 `#timetable`로 redirect한다.
- `eie/index.html`
  - 별도 월별 화면 CSS/JS 로드를 제거했다.
- `eie/css/eie-timetable.css`
  - 기존 시간표 헤더 안의 작은 월 선택 컨트롤 스타일만 추가했다.
  - 남아 있는 legacy drawer route는 화면에서 숨긴다.

## 4. 사용자 화면 금지 문구 확인

다음 문구가 AP/EIE 기존 시간표 화면 파일에서 노출되지 않도록 확인했다.

- `이번 달 저장`
- `덮어쓰기`
- `자동저장`
- `자동 보관`
- `스냅샷`
- `보관본`
- `저장본`
- `기준일`

## 5. 자동 저장 서버 로직 보존

- AP/EIE Worker scheduled handler와 wrangler cron은 유지했다.
- KST 말일 체크, `source_type: scheduled`, `month_key + snapshot_date` 중복 방지는 유지했다.
- remote migration/deploy는 실행하지 않았다.

## 6. 검증 결과

PASS:

- `node --check .\apmath\js\timetable.js`
- `node --check .\apmath\js\timetable-months.js`
- `node --check .\apmath\js\ui.js`
- `node --check .\eie\js\views\eie-timetable.js`
- `node --check .\eie\js\eie-router.js`
- `node .\tests\timetable-monthly-snapshot-schema.test.js`
- `node .\tests\apmath-monthly-timetable-snapshot.test.js`
- `node .\tests\eie-monthly-timetable-snapshot.test.js`
- AP/EIE worker route/index dynamic import
- 금지 문구 검색

## 7. 리뷰 보정 내역

- Codex B logic/routing 1차 리뷰: PASS.
- Codex C UI/UX 1차 리뷰: FAIL 항목 확인.
  - EIE drawer의 legacy `timetable-months` 항목은 `eie/index.html`에서 제거된 상태를 재확인했다.
  - EIE 월별 전용 파일은 기존 시간표로 보내는 shim으로 축소되어 금지 문구가 없다.
  - AP `renderTimetable()`는 현재 헤더에 `apTimetableMonthControlsHtml()`를 직접 렌더하고 `bindApTimetableMonthNavigation()`을 호출한다.
  - AP 과거 월 모드에서 cell drag/drop, add class, card drag/drop, 빈 학생 추가 슬롯을 명시적으로 막았다.
- Codex C UI/UX 재리뷰: PASS. 이전 FAIL 항목 모두 해소 확인.
- Codex D tests/regression: PASS.

## 8. 미실행 확인

- remote D1 migration 실행 안 함.
- Worker deploy 실행 안 함.
- `git add`, `git commit`, `git push` 실행 안 함.
