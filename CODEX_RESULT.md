# CODEX_RESULT

## 변경 파일

- `eie/js/utils/eie-normalize.js`
  - 신입 판정 컷오버 상수 `EIE_NEW_STUDENT_CUTOFF_DATE = '2026-06-23'`를 정의하고 `window.EIE_NEW_STUDENT_CUTOFF_DATE`로 노출.
- `eie/js/views/eie-dashboard.js`
  - 대시보드 신입 판정에 컷오버 이전 등원자 제외 조건 추가.
- `eie/js/views/eie-students.js`
  - 학생관리 신입 판정에 컷오버 이전 등원자 제외 조건 추가.
- `eie/js/views/eie-timetable.js`
  - 시간표 신입 판정에 컷오버 조건 추가.
  - quick-grid와 상세 basic 탭의 등원 저장 위젯을 첫 등원일 미등록 학생에게만 노출.
  - 학생 수정 패널의 `보호자·메모` 서랍을 기본 펼침으로 변경.
- `CODEX_RESULT.md`
  - 이번 작업 및 검증 결과 기록.

기존 작업 트리의 `CODEX_TASK.md`, `.vscode/tasks.json`, `archive/` 관련 변경은 수정하지 않았다.

## 작업 1 — 신입 판정 컷오버

- 공용 상수 위치: `eie/js/utils/eie-normalize.js:2`, 전역 노출 `:51`
  - `eie/index.html`에서 공용 유틸이 세 뷰보다 먼저 defer 로드되는 것을 확인해 파일별 중복 대신 공용 노출 방식을 사용했다.
- 대시보드 판정: `eie/js/views/eie-dashboard.js:122-129`
- 학생관리 판정: `eie/js/views/eie-students.js:875-883`
- 시간표 판정: `eie/js/views/eie-timetable.js:700-707`
  - 기존 2개월 계산은 유지하고 `enrollDate >= cutoff` 조건만 AND로 추가했다.

## 작업 2 — 등원 저장 1회성 UI

- quick-grid: `eie/js/views/eie-timetable.js:2607-2676`
  - 함수가 `sid`만 받으므로 `selectedStudentRecord()`로 현재 학생을 조회했다.
  - 첫 등원일이 있으면 `첫 등원 {날짜}`만 표시하고, 없으면 기존 날짜 입력과 `등원 저장` 버튼을 표시한다.
- 상세 basic 탭: `eie/js/views/eie-timetable.js:2878-2928`
  - 전달받은 `student`에서 `studentEnrollDate(student)`를 조회해 동일 조건을 적용했다.
- `saveStudentAttendanceFromPanel` 핸들러와 출석/첫 등원 기록 로직은 변경하지 않았다.

## 작업 3 — 수정 패널 서랍 펼침

- `eie/js/views/eie-timetable.js:3089`
  - 수정 패널의 `<details class="eie-p-drawer">`에 `open`만 추가했다.
  - 상세 모드의 기존 서랍은 접힌 상태로 유지했다.

## 검증 결과

통과:

- `node --check eie/js/utils/eie-normalize.js`
- `node --check eie/js/views/eie-dashboard.js`
- `node --check eie/js/views/eie-students.js`
- `node --check eie/js/views/eie-timetable.js`
- `node --test tests/eie-timetable-dual-mode.test.js tests/eie-timetable-edit-entry.test.js`
  - 2 tests passed
- `git diff --check`
- 컷오버 조건, 수정 패널 `open`, 저장 핸들러 비변경 정적 확인

실패:

- `node tools/test-student-js-mojibake-guard.mjs`

```text
Student mojibake guard failed:
- student UI sources: required Korean phrase missing: "제적"
```

지시서에 별개 기존 실패로 명시된 항목이며 이번 EIE 변경에서 신규 mojibake는 확인되지 않았다.

- 관련 테스트 묶음 중 `tests/eie-timetable-withdrawn-students.test.js`

```text
AssertionError [ERR_ASSERTION]: new EIE student should use new class
```

fixture의 등원일 `2026-06-12`가 새 컷오버 `2026-06-23` 이전인데도 신입을 기대하는 기존 계약이므로 새 정책과 충돌한다. 허용 수정 범위가 `eie/` 프론트로 제한되어 테스트 파일은 변경하지 않았다.

- 관련 테스트 묶음 중 `tests/eie-timetable-student-profile-ap-parity.test.js`

```text
AssertionError [ERR_ASSERTION]: mini classroom panel should not use heavy bold weights
```

이번 변경 대상이 아닌 CSS 굵기 계약 실패이며 관련 CSS는 수정하지 않았다.

## 미해결/판단 보류

- 실제 브라우저 데이터로 수행하는 수동 UI 확인은 미실행.
- 새 컷오버 정책과 충돌하는 기존 신입 fixture 테스트는 후속 갱신이 필요하다.
- 기존 CSS 굵기 테스트 실패와 mojibake 가드의 `"제적"` 누락은 별도 작업이 필요하다.
- Git add/commit/push/deploy는 수행하지 않았다.
