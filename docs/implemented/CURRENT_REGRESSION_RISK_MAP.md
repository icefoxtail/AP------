# Student Mutation Risk Addendum

| flow | risk | check |
|---|---|---|
| student create idempotency | rapid duplicate clicks or concurrent create requests insert multiple rows | `student_identity_key`, `idx_students_identity_key`, duplicate response `duplicate_ignored: true`, PIN retry tests |
| student mutation lightweight refresh | create/edit/delete/restore triggers full `/api/initial-data` reload or stale local state | `student.js` merge helpers, no `await loadData()` in student mutation handlers |
| student UI Korean text | student mutation fixes accidentally reintroduce mojibake in `student.js` or backend helper strings | `tools/test-student-js-mojibake-guard.mjs` scans full student UI and related JS, including `admin-db.js` and bare `餓`, for broken Korean patterns plus required normal phrases |
| initial-data repair side effect | read-only initial-data repeatedly runs teacher-class repair and slows every reload | `index.js` does not call `repairTeacherClassMappings(env)` inside `/api/initial-data` |

# CURRENT_REGRESSION_RISK_MAP

| 흐름 | 위험 | 검수 기준 |
|---|---|---|
| 로그인/session/logout | 전체 접근 불가, expired session 처리 실패 | `auth/login`, `teacher_sessions`, Bearer header |
| initial-data | 모든 화면 데이터 로딩 실패 | admin/teacher 응답 key 유지 |
| teacher/admin 권한 | 담당반 scope 누락 | `teacher_classes`, `canAccessStudent`, `canAccessClass` |
| student export XLSX | teacher에게 출력 버튼/모달/다운로드가 노출되거나 주소·차량 시트가 confirm 없이 내려감 | `student-export.js` admin guard, 주소·차량 confirm, 출력정보 시트, PIN/학생 memo/상담 목록 미포함 |
| classroom | 출결/숙제/플래너/일지 현장 흐름 깨짐 | PC/mobile, 오늘 날짜, 반별 학생 |
| cumulative attendance print | 월간/누적 출석부가 아닌 classroom 하루 출석부를 잘못 출력하거나 상태 기호 의미가 바뀜 | `cumulative.js` 기준, O/X/- 및 지각/보강/상담 표시 유지 |
| planner SSO | 학생 포털에서 플래너 진입 실패 | `PLANNER_SID`, `PLANNER_PIN`, `planner_auth_{sid}` |
| student portal PIN | 학생 로그인/토큰 실패 | `student_token`, X-Student-Token |
| OMR 제출 완료 | 재수정/재제출 노출 | 일반 시험 OMR과 material-omr 정책 분리 |
| archive MIXED | mixed engine 문항 매핑 실패 | `MIXED:{key}` 보존 |
| report AI | 내부 표현이 학부모 문장에 노출 | fallback/provider 결과 정규화 |
| report cohort | 같은 아카이브 시험지를 여러 반이 본 경우 통계가 담당반 기준으로 좁혀지거나 다중 반 연결 학생의 세션이 중복 집계됨 | 시험연도 + `archive_file` + 같은 학년 전체 평균/등수/문항 정답률, `exam_sessions.id` 기준 dedupe, `classAverage` 별도 유지 |
| billing | 금액 합계/거래/장부 불일치 | payments vs transactions vs cashbook 구분 |
| dashboard UI | 원장님 대시보드 quick action이 탭처럼 보이거나 오늘 운영에 숫자 metric이 직접 노출됨 | 빠른 이동은 중립 버튼, 실제 필터만 segmented, 오늘 운영은 숫자 없는 진입 카드, 기능/데이터/API 변경 없음 |
| timetable | 운영 데이터와 draft/staging 혼선 | `classes` 직접 훼손 금지, version tables 분리 |
| class select label | 학생 추가/수정, 주소록/학생관리, 누적 출석부/내신, 시간표 반 선택 option에서 같은 반명이 단독 반복되어 오배정되거나, 표시명 개선이 저장값 변경으로 번짐 | option 표시명은 반명 + 담당 + 요일/교시/시간 기준, 표준 운영 시간대는 교시 자동 추론, 완전 중복 시에만 `#2` fallback, `classes.name`/`time_label`/`class_id`/`version_class_id` 저장 흐름 유지 |
| timetable print | 화면 DOM/사이드바/필터를 그대로 인쇄해 A4 가로 출력이 잘리거나 현재 보기 조건이 누락됨 | 인쇄 전용 HTML, 중등부/고등부 및 전체/내 반 조건 반영 |
| UI 문구 | 현장 용어 변경 | 기존 버튼/화면명/문구 diff 확인 |
| hidden foundation | 승인 없는 UI 노출 | `CURRENT_HIDDEN_FOUNDATION_MAP.md` 대조 |
