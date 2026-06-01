# CODEX_RESULT

## 1. 생성/수정 파일
- 수정: `eie/js/views/eie-dashboard.js`
- 수정: `eie/js/views/eie-timetable-v2.js`
- 수정: `eie/js/views/eie-students.js`
- 수정: `eie/css/eie.css`
- 생성: `tests/eie-timetable-v2-student-detail-link.test.js`
- 수정: `CODEX_RESULT.md`

## 2. 구현 완료
- 대시보드의 `시간표` 진입 버튼을 기존 `timetable`에서 `timetable-v2`로 변경했습니다.
- `timetable-v2`의 카드, hover 영역, 상세 패널, 모바일 카드의 학생 이름을 클릭 가능한 버튼으로 통일했습니다.
- 학생 이름 클릭 시 화면 이동 없이 오른쪽 패널이 학생 상세 패널로 전환되도록 변경했습니다.
- 확정 학생 id가 있으면 오른쪽 패널에서 `수정` 버튼과 편집 폼을 제공하고, 저장 시 `EieApi.updateStudent(studentId, payload)`를 호출합니다.
- 학생 id가 없으면 이름 기반 상세 패널을 열되, 시간표 패널 내 직접 수정은 막고 안내 문구를 표시합니다.
- 학생 버튼 클릭이 시간표 세션 선택 이벤트와 충돌하지 않도록 학생 클릭을 먼저 처리하고 `stopPropagation()`을 적용했습니다.
- 학생관리의 `openDetail(studentId, returnCtx)`와 `setQuery(query, returnCtx)`가 시간표 v2 복귀 컨텍스트를 받을 수 있게 했습니다.
- 학생 상세에 `시간표로 돌아가기` 버튼을 추가했고, `EieTimetableV2View.openWithContext(returnCtx)`로 선택 요일/세션을 복원하게 했습니다.
- 시간표 오른쪽 패널에서 학생 수정 저장 후 `EieState.upsertStudent`, `EieApmsState.syncStudent`, `EieApmsState.loadFoundation({ force: true })` 흐름으로 공통 데이터를 강제 동기화하도록 보강했습니다.
- 시간표 v2 학생 칩에는 전화번호/연락처를 노출하지 않았습니다.

## 3. 확인한 핵심 동작
- 대시보드 시간표 버튼은 `/eie/#timetable-v2` route로 연결됩니다.
- 기존 `eie-timetable.js`는 수정하지 않았습니다.
- Worker, D1 migration, AP worker 백업, classroom/management/teacher 파일은 수정하지 않았습니다.
- 시간표 v2의 학생 버튼은 `data-eie-v2-student-id` 또는 `data-eie-v2-student-name`을 가지며, 오른쪽 패널 전환용 day/session/cell 컨텍스트도 함께 가집니다.

## 4. 실행 결과
- `node --check .\eie\js\views\eie-dashboard.js`: OK
- `node --check .\eie\js\views\eie-timetable-v2.js`: OK
- `node --check .\eie\js\views\eie-students.js`: OK
- `node --check .\eie\js\eie-state.js`: OK
- `node --check .\eie\js\apms-compat\eie-apms-state.js`: OK
- `node --check .\tests\eie-timetable-v2-student-detail-link.test.js`: OK
- `node tests\eie-owner-dashboard-ap-parity.test.js`: OK
- `node tests\eie-students-click-handlers.test.js`: OK
- `node tests\eie-timetable-v2-student-detail-link.test.js`: OK
- 금지 파일 diff 확인: `eie-timetable`, `eie-classroom`, `eie-management`, `eie-teacher`, `workers/wangji-eie-worker`, `apmath/worker-backup/worker`, `migrations` diff 없음

## 5. 구현하지 않은 것
- git add/commit/push 하지 않음
- wrangler deploy 하지 않음
- D1 migration 실행하지 않음
- Worker 수정하지 않음
- 기존 `eie/js/views/eie-timetable.js` 수정하지 않음
- 시간표 화면 안에 별도 학생 수정 UI를 만들지 않음
- 검수 zip 생성하지 않음

## 6. 남은 확인
- 브라우저에서 `/eie/#dashboard`의 시간표 버튼이 v2로 이동하는지 확인
- `/eie/#timetable-v2`에서 학생 이름 클릭 후 오른쪽 패널에 학생 상세가 뜨는지 확인
- 오른쪽 패널에서 학생 수정 저장 후 시간표 v2와 학생관리 데이터가 함께 갱신되는지 실제 데이터로 확인
