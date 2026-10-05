# PLANNER_DOMAIN

## A. 정책

- 학생 포털 SSO를 보존한다.
- `PLANNER_SID`, `PLANNER_PIN`, `planner_auth_{sid}`, `planner_pin_{sid}` 흐름을 임의 변경하지 않는다.
- PC 넓은 화면과 모바일 목록 흐름을 모두 보호한다.

## B. 현재 구현 구조

- frontend: `apmath/planner/index.html`, `apmath/js/classroom.js`의 planner 조회/feedback
- route: `routes/planner.js`
- DB: `schema_planner.sql` 확인 필요, planner route 내부 쿼리 라인 단위 확인 필요
- storage: `PLANNER_SID`, `PLANNER_PIN`, `planner_auth_{studentId}`, `planner_pin_{studentId}`

## C. 데이터/API 흐름

학생 포털에서 sid/pin을 저장하고 planner가 복원한다. `planner-auth`가 인증하고, `planner` GET/POST/PATCH/DELETE가 계획을 처리한다. 선생님 반 화면은 class/student 기준으로 planner overview와 feedback을 조회한다.

## D. 회귀 위험

- PIN URL/storage 흐름 변경
- 주간/월간 보기 깨짐
- 타이머/완료 체크가 DB 학습 시간 통계로 오해되는 것
- 선생님 반 화면 planner 버튼 회귀

## E. 추가 계획

PIN URL 노출 구조 개선, 삭제 confirm의 인앱 모달화, 모바일 월간 보기 보강은 후보이며 기존 SSO를 먼저 보호한다.

## F. 작업 후 업데이트 규칙

planner 변경 시 `CURRENT_FRONTEND_MAP.md`, `CURRENT_API_FLOW_MAP.md`, `CURRENT_AUTH_PERMISSION_MAP.md`, `STUDENT_PARENT_PORTAL_NEXT_PLAN.md`, `CODEX_RESULT.md`를 업데이트한다.

