# AP Math Phase 1d-3 Dashboard Admin Teacher Account Move Result

## 1. 작업 목적

- `dashboard.js`의 선생님 계정 관리 admin 함수군을 `dashboard-admin.js`로 순수 이동했다.
- 기능 개선, UI 개선, AP/EIE gate 수정, dashboard 전체 분할은 수행하지 않았다.

## 2. 이동한 함수

- `getAdminTeacherRows`
- `adminTeacherRoleLabel`
- `openAdminTeacherAccountManage`
- `renderAdminTeacherAccountManage`
- `openAdminCreateTeacherModal`
- `handleAdminCreateTeacher`
- `openAdminEditTeacherModal`
- `handleAdminUpdateTeacher`
- `openAdminResetTeacherPasswordModal`
- `handleAdminResetTeacherPassword`

## 3. 수정 파일

- `apmath/js/dashboard.js`
- `apmath/js/dashboard-admin.js`
- `docs/reports/apmath-phase1-dashboard-admin-teacher-account-move-result.md`
- `CODEX_RESULT1.md`

## 4. 순수 이동 확인

- 함수 본문 변경 여부: 없음
- 함수명 변경 여부: 없음
- 매개변수 변경 여부: 없음
- API endpoint 변경 여부: 없음
- HTML/style/toast 문구 변경 여부: 없음
- 원본 대비 함수 블록 exact match: PASS
- 이동 후 함수 위치:
  - `dashboard-admin.js`: 10개 함수 각각 1회
  - `dashboard.js`: 10개 함수 각각 0회

주의:

- `git diff -- apmath/js/dashboard.js`에는 이번 작업 전부터 존재한 dashboard dirty 변경도 같이 표시된다.
- 이번 작업으로 수행한 변경은 지정 선생님 계정 관리 함수군 이동이다.

## 5. surface guard

- dashboard 합산 대상:
  - `apmath/js/dashboard-admin.js`
  - `apmath/js/dashboard-teacher.js`
  - `apmath/js/dashboard.js`
- dashboard fixture 변경 여부: 없음
- duplicateDefinitions: `[]`
- dashboard-only 비교: PASS
  - `dashboard combined surface fixture matches`
  - counts: `functionDeclarations 187`, `asyncFunctionDeclarations 18`, `windowAssignments 3`, `functionExpressions 11`, `allDefinitions 218`

## 6. 테스트 결과

- `node --check apmath/js/dashboard.js`: PASS
- `node --check apmath/js/dashboard-admin.js`: PASS
- `node --check tests/apmath-global-surface.test.js`: PASS
- `node tests/apmath-onclick-defined.test.js`: PASS
- `node tests/apmath-global-surface.test.js`: FAIL
  - 원인: 기존 `student.js + student-edit.js` surface mismatch
  - 차이: `renderStudentDetailTabInPlace` 추가로 student counts가 fixture보다 1개 많음
- dashboard-only surface comparison: PASS
- `node tools/run-tests.js`: FAIL
  - PASS 54 / FAIL 2 / KNOWN-FAIL 0
  - 실패: `tests/apmath-global-surface.test.js`, `tests/student-portal-omr-review-ui.test.js`
- `node tools/smoke-api.mjs`: PASS

## 7. 미확인/보류

- student surface mismatch: 기존 dirty 상태로 보류
- `student-portal-omr-review-ui`: 기존 실패로 보류
- browser smoke: 미수행
- admin teacher account modal 실화면: 미수행

## 8. 다음 작업 권고

- 다음 이동 후보:
  - 학생 현황 / 학년 모달 / 퇴원 / 숨김 / PIN 함수군
  - 또는 상담 센터 / 글로벌 검색 함수군
- 커밋 전 정리 필요 항목:
  - 기존 student surface mismatch 처리 여부 결정
  - `student-portal-omr-review-ui` 실패 원인 분리
  - dashboard 관련 변경과 EIE/Worker 병행 dirty 변경 stage 범위 분리
