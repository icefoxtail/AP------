1. 수정 파일
- apmath/student/index.html

2. 수정한 함수
- saveSession()
- clearSession()
- loginStudent()
- openPlanner()

3. 구현 완료 내용
- 학생포털 로그인 성공 시 세션 객체에 `pin`을 함께 저장하도록 수정함.
- 학생포털 세션 저장 시 `APMATH_STUDENT_PORTAL_SESSION`과 함께 `PLANNER_SID`, `PLANNER_PIN`을 `localStorage`와 `sessionStorage`에 저장하도록 수정함.
- 플래너 열기 시 `PLANNER_SID`, `PLANNER_PIN`을 다시 보장 저장한 뒤 `student_id`와 `pin`을 함께 포함한 쿼리스트링으로 이동하도록 수정함.
- 학생포털 로그아웃 시 `APMATH_STUDENT_PORTAL_SESSION`, `PLANNER_SID`, `PLANNER_PIN`을 모두 삭제하도록 수정함.

4. 문법 검증 결과
- `apmath/student/index.html` 내부 `<script>`를 `/tmp/apmath_student_index_script.js`로 추출 후 `node --check /tmp/apmath_student_index_script.js` 실행: 통과

5. 수동 테스트 체크리스트
- 학생포털에서 이름 + PIN으로 로그인한다.
- 브라우저 저장소에서 `APMATH_STUDENT_PORTAL_SESSION`, `PLANNER_SID`, `PLANNER_PIN` 저장 여부를 확인한다.
- 학생포털에서 플래너 열기를 눌렀을 때 URL에 `student_id`와 `pin`이 함께 붙는지 확인한다.
- 플래너 진입 시 PIN 재로그인 화면 없이 바로 들어가는지 확인한다.
- 학생포털 로그아웃 후 `PLANNER_SID`, `PLANNER_PIN`이 삭제되는지 확인한다.

6. 미해결/주의 항목
- 실제 브라우저에서의 `localStorage`/`sessionStorage` 저장 결과와 플래너 자동 로그인 동작은 이 터미널 환경에서 직접 실행 확인하지 못했고, 수동 테스트가 필요함.
- `apmath/planner/index.html`, Worker, DB/schema, 과제, OMR, UI 디자인, `API_BASE`는 수정하지 않음.
