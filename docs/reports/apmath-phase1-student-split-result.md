# AP Math Phase 1b Student Split Result

## Scope

- Phase 1-0 보호망 문서 정독 여부: 완료
- Phase 0.5 smoke 문서 정독 여부: 완료
- 이번 작업이 student.js 순수 분할인지 확인: 완료
- 함수 본문 수정 금지 확인: 완료
- 운영 데이터 write 금지 확인: 완료

## Changes

- `apmath/js/student.js`에서 학생 편집/추가/삭제/복구 모달 관련 함수 블록을 `apmath/js/student-edit.js`로 원문 이동했다.
- `apmath/index.html`에서 `student.js` 바로 다음에 `student-edit.js`를 defer 로드하도록 추가했다.
- `tests/apmath-global-surface.test.js`는 student 표면을 `student.js`와 `student-edit.js`의 합산 표면으로 검사하도록 변경했다.
- 기존 surface fixture는 수정하지 않았다.
- onclick guard 오탐 보정: `tests/apmath-onclick-defined.test.js`가 onclick 추출 전에 JS/HTML 주석을 제거하도록 수정했다.
  - 주석 안 `onclick` 예시는 검사하지 않는다.
  - `window.open`, `event.stopPropagation`, `event.preventDefault` 내장 예외 정책은 유지했다.
  - `toast`, `closeModal`, `showModal`은 계속 실제 정의를 찾아 검증한다.

## Preserved

- 함수명, 매개변수, 반환 구조, DOM 문자열, API 호출, toast/confirm 문구, inline handler 문자열은 의도적으로 변경하지 않았다.
- `handleDeleteSession`, `handleResetSessionWrongs`는 성적/시험 기록 흐름에 속하므로 `student.js`에 유지했다.
- `file`/운영 데이터/Worker/EIE/archive/fixture/smoke tool 파일은 이번 작업 대상으로 수정하지 않았다.

## Verification

- PASS: `node --check apmath/js/student.js`
- PASS: `node --check apmath/js/student-edit.js`
- PASS: `node --check tests/apmath-global-surface.test.js`
- PASS: `node tests/apmath-global-surface.test.js`
- PASS: `node --check tests/apmath-onclick-defined.test.js`
- PASS: `node tests/apmath-onclick-defined.test.js`
  - `apmath/js/core.js` 주석 예시 `onclick="fn(${apJsArg(value)})"` 오탐을 보정했다.
  - 이번 분할 변경 파일의 inline handler 미정의 실패는 확인되지 않았다.
- PASS: `node tools/run-tests.js`
- PASS: `node tools/smoke-api.mjs`
  - sandbox 네트워크 제한에서는 fetch failed였고, 승인된 네트워크 실행에서 PASS.
- UNVERIFIED: `node tools/smoke-browser.mjs`
  - Playwright 미설치로 실행 불가.

## Review Bot Status

- Codex B logic/routing review: functional split PASS, worktree scope FAIL.
  - edit/create/delete handlers remain callable after `student-edit.js` load.
  - view/student detail/consultation/grade entry points remain in `student.js`.
  - CRUD/API logic moved without body changes.
  - Current worktree has pre-existing/out-of-scope dirty files, so scope cleanliness cannot be reported as PASS.
- Codex C UI/UX/CSS review: UI split PASS, worktree scope FAIL.
  - moved UI strings/DOM/inline styles/class names match the original moved text.
  - script order is `student.js` -> `student-edit.js` -> `classroom.js`.
  - no CSS/global style edits in scoped AP Math diff.
  - Current worktree has pre-existing/out-of-scope dirty files, so scope cleanliness cannot be reported as PASS.
- Codex D tests/regression review: split checks PASS, original full regression gate FAIL before onclick guard correction.
  - syntax checks and combined surface guard pass.
  - student fixture was not updated.
  - `tests/apmath-onclick-defined.test.js` originally failed on unrelated `apmath/js/core.js` comment example.
  - Additional onclick guard correction now makes `tests/apmath-onclick-defined.test.js` and `tools/run-tests.js` pass.
  - browser smoke remains UNVERIFIED because Playwright is unavailable.
