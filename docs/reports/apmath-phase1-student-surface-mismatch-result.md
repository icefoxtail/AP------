# AP Math Phase 1d-5 Student Surface Mismatch Result

## 1. 작업 목적
- `renderStudentDetailTabInPlace` 추가로 발생한 student surface mismatch를 정리했다.
- 운영 JS는 수정하지 않고 `tests/fixtures/apmath-surface-student.json`만 현재 의도된 surface에 맞춰 갱신했다.

## 2. 원인
- 추가 함수: `renderStudentDetailTabInPlace`
- 호출 위치:
  - `renderStudentDetailTab`에서 모달 내부 탭 전환을 우선 시도
  - `setStudentGradeSubTab`에서 성적 하위 탭 전환 시 모달 내부 렌더를 우선 시도
- 의도된 변경 여부: 예. 학생 상세 탭 전환/깜박임 방지용 로컬 dirty 변경으로 판단했다.

## 3. 수정 파일
- `tests/fixtures/apmath-surface-student.json`
- `docs/reports/apmath-phase1-student-surface-mismatch-result.md`
- `CODEX_RESULT1.md`

## 4. fixture 변경 요약
- 변경 전 counts:
  - `functionDeclarations`: 153
  - `asyncFunctionDeclarations`: 27
  - `windowAssignments`: 5
  - `functionExpressions`: 2
  - `allDefinitions`: 182
- 변경 후 counts:
  - `functionDeclarations`: 154
  - `asyncFunctionDeclarations`: 27
  - `windowAssignments`: 5
  - `functionExpressions`: 2
  - `allDefinitions`: 183
- 추가된 `functionDeclarations`: `renderStudentDetailTabInPlace`
- `duplicateDefinitions`: `[]`
- dashboard/classroom/report fixture 변경 여부: 없음

## 5. 테스트 결과
- `node --check apmath/js/student.js`: PASS
- `node --check apmath/js/student-edit.js`: PASS
- `node --check tests/apmath-global-surface.test.js`: PASS
- `node tests/apmath-global-surface.test.js`: PASS
- `node tests/apmath-onclick-defined.test.js`: PASS
- `node tools/smoke-api.mjs`: PASS
- `node tools/run-tests.js`: FAIL
  - 남은 실패: `tests/student-portal-omr-review-ui.test.js`
  - 원인: 기존 neutral charcoal assertion failure

## 6. 수정 금지 파일 확인
- `apmath/js/student.js` 신규 수정 여부: 없음
- `apmath/js/student-edit.js` 수정 여부: 없음
- `tests/apmath-global-surface.test.js` 수정 여부: 없음
- dashboard 관련 파일 수정 여부: 없음
- fixture 중 student 외 변경 여부: 없음
- EIE/Worker/archive 수정 여부: 없음

## 7. 다음 작업 권고
- dashboard admin bulk 관련 surface guard는 통과 상태다.
- 남은 전체 테스트 실패는 student portal OMR review UI 색상 assertion을 별도 작업에서 정리한다.
