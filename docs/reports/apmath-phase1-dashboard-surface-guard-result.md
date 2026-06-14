# AP Math Phase 1d-2 Dashboard Surface Guard Result

## 1. 작업 목적

- dashboard surface guard를 단일 `dashboard.js`에서 dashboard 관련 파일 합산 기준으로 확장했다.
- 이번 작업은 dashboard 분할 또는 admin 함수 이동이 아니라, 다음 순수 이동 PR을 위한 보호망 보정이다.
- 운영 JS, `index.html`, UI, CSS는 수정하지 않았다.

## 2. 직접 확인한 파일

- `apmath/index.html`
- `apmath/js/dashboard.js`
- `apmath/js/dashboard-admin.js`
- `apmath/js/dashboard-teacher.js`
- `tests/apmath-global-surface.test.js`
- `tests/fixtures/apmath-surface-dashboard.json`
- `docs/reports/apmath-phase1-dashboard-boundary-plan.md`

확인 항목:

- `index.html` script 순서 확인: 완료
- dashboard 관련 script 목록: `dashboard-admin.js`, `dashboard-teacher.js`, `dashboard-assistant-memos.js`, `dashboard.js`
- `dashboard-assistant-memos.js` 존재 여부: 존재
- `dashboard-assistant-memos.js`가 git tracked인지 여부: NO
- 이번 작업이 surface guard 확장인지 확인: 완료
- 운영 JS 수정 금지 확인: 완료

## 3. dashboard 합산 대상

| 파일 | 포함 여부 | 이유 |
|---|---|---|
| `apmath/js/dashboard-admin.js` | YES | admin wrapper / admin helper |
| `apmath/js/dashboard-teacher.js` | YES | teacher dashboard renderer |
| `apmath/js/dashboard-assistant-memos.js` | NO | `index.html`에는 로드되어 있으나 `git ls-files --error-unmatch apmath/js/dashboard-assistant-memos.js` 실패. untracked이므로 이번 guard 합산 대상에서 제외 |
| `apmath/js/dashboard.js` | YES | dashboard 공통/dispatch/body |

## 4. 수정 파일

- `tests/apmath-global-surface.test.js`
- `tests/fixtures/apmath-surface-dashboard.json`
- `docs/reports/apmath-phase1-dashboard-surface-guard-result.md`
- `CODEX_RESULT1.md`

## 5. fixture 변경 요약

- 변경 전 counts:
  - `functionDeclarations`: 166
  - `asyncFunctionDeclarations`: 15
  - `windowAssignments`: 1
  - `functionExpressions`: 10
  - `allDefinitions`: 192
- 변경 후 counts:
  - `functionDeclarations`: 187
  - `asyncFunctionDeclarations`: 18
  - `windowAssignments`: 3
  - `functionExpressions`: 11
  - `allDefinitions`: 218
- duplicateDefinitions: `[]`
- student/classroom/report fixture 변경 여부: 없음

참고:

- `node tests/apmath-global-surface.test.js --update`는 현재 작업트리의 기존 `student.js` surface mismatch 때문에 실행 시 금지된 `tests/fixtures/apmath-surface-student.json`까지 갱신할 위험이 있어 실행하지 않았다.
- dashboard fixture는 동일한 surface 추출 로직으로 dashboard 대상 파일만 생성했다.
- 별도 dashboard-only fixture 비교 결과: PASS (`dashboard combined surface fixture matches`)

## 6. 테스트 결과

- `node --check tests/apmath-global-surface.test.js`: PASS
- `node tests/apmath-global-surface.test.js --update`: 미수행 - 현재 기존 dirty `student.js` surface mismatch가 있어 실행하면 수정 금지 대상인 student fixture까지 갱신될 수 있음
- `node tests/apmath-global-surface.test.js`: FAIL
  - 실패 원인: `apmath/js/student.js + apmath/js/student-edit.js` surface mismatch
  - 차이: `renderStudentDetailTabInPlace`가 추가되어 student actual counts가 `functionDeclarations 154`, `allDefinitions 183`으로 fixture보다 1개 많음
  - 이번 dashboard guard 변경 자체의 dashboard fixture 비교는 별도 PASS
- `node tests/apmath-onclick-defined.test.js`: PASS
- `node tools/run-tests.js`: FAIL
  - PASS 54 / FAIL 2 / KNOWN-FAIL 0
  - 실패 1: `tests/apmath-global-surface.test.js`의 기존 student surface mismatch
  - 실패 2: `tests/student-portal-omr-review-ui.test.js`의 neutral charcoal theme assertion
- `node tools/smoke-api.mjs`: PASS
  - AP/EIE/Wangji worker reachable
  - CORS origin restricted
  - 404 disclosure safe
- `node tools/smoke-browser.mjs`: FAIL / 미검증
  - 사유: Playwright 미설치

## 7. 미확인/보류

- 브라우저 실화면: 미수행
- admin login smoke: 미수행
- AP/EIE gate DOM 동일성: 미확인
- 실제 admin 함수 이동: 미수행
- global surface 전체 PASS: 보류 - 기존 student fixture mismatch 해결 필요

## 8. 다음 작업 권고

- Phase 1d-3 후보: dashboard admin 함수군 순수 이동 전, 기존 student surface fixture mismatch 처리 여부를 먼저 결정한다.
- 수정 허용 파일:
  - `apmath/js/dashboard.js`
  - `apmath/js/dashboard-admin.js`
  - `tests/apmath-global-surface.test.js`
  - `tests/fixtures/apmath-surface-dashboard.json`
  - 작업 결과 보고서
- 수정 금지 파일:
  - `apmath/index.html`
  - `apmath/js/dashboard-teacher.js`
  - `apmath/js/dashboard-assistant-memos.js` unless tracked and explicitly included
  - `tests/fixtures/apmath-surface-student.json` unless 별도 student surface 작업으로 승인됨
  - `tests/fixtures/apmath-surface-classroom.json`
  - `tests/fixtures/apmath-surface-report.json`
  - `eie/*`
  - `workers/*`
  - `archive/*`
  - `migrations/*`
