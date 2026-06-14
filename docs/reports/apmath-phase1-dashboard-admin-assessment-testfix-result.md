# AP Math Phase 1d-BULK Testfix Result

## 1. 작업 목적
- `tests/admin-assessment-archive-card.test.js`가 dashboard 분리 구조를 읽도록 보정했다.
- Phase 1d-BULK 이후 admin overview/assessment archive 관련 함수는 `apmath/js/dashboard-admin.js`에 있으므로, 테스트의 admin-only assertion 기준을 `dashboard-admin.js`로 옮겼다.
- 운영 JS, fixture, EIE, Worker, archive, migrations는 수정하지 않았다.

## 2. 수정 파일
- `tests/admin-assessment-archive-card.test.js`
- `docs/reports/apmath-phase1-dashboard-admin-assessment-testfix-result.md`
- `CODEX_RESULT1.md`

## 3. 보정 내용
- `dashboard-admin.js` 읽기 추가: 예
- `dashboardCombined` 도입: 예
- `renderAdminStudentOverviewPanel` body 추출 기준: `dashboard.js`에서 `dashboard-admin.js`로 변경
- admin-only assertion 기준 변경: 예
- assertion 의미 완화/삭제: 없음

## 4. 테스트 결과
- `node --check tests/admin-assessment-archive-card.test.js`: PASS
- `node tests/admin-assessment-archive-card.test.js`: PASS
- `node --check apmath/js/dashboard.js`: PASS
- `node --check apmath/js/dashboard-admin.js`: PASS
- `node tests/apmath-onclick-defined.test.js`: PASS
- `node tools/smoke-api.mjs`: PASS
- `node tools/run-tests.js`: FAIL
  - `apmath-global-surface.test.js`: 기존 student surface mismatch (`renderStudentDetailTabInPlace`)
  - `student-portal-omr-review-ui.test.js`: 기존 neutral charcoal assertion failure

## 5. 수정 금지 파일 확인
- 운영 JS 수정 여부: 없음
- fixture 수정 여부: 없음
- EIE/Worker/archive 수정 여부: 없음

## 6. 남은 실패/보류
- student surface mismatch: 기존 이슈로 보류
- student-portal-omr-review-ui: 기존 이슈로 보류
- browser smoke: 실행하지 않음

## 7. 다음 작업 권고
- Phase 1d-BULK testfix 관점에서는 `admin-assessment-archive-card.test.js` 통과 상태다.
- 남은 전체 러너 실패 2건은 student 영역 별도 작업으로 분리하는 것이 좋다.
