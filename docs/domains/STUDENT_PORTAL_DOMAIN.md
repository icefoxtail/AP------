# STUDENT_PORTAL_DOMAIN

## A. 정책

- 학생은 시험지를 직접 열 수 없다.
- 학생 포털은 배정 확인과 OMR 연결까지만 허용한다.
- 일반 시험 OMR 제출 완료 후 수정/재입력/재제출은 금지한다.
- 학생에게 archive 원본 파일 경로나 시험지 선택권을 주지 않는다.

## B. 현재 구현 구조

- frontend: `apmath/student/index.html`
- route: `routes/student-portal.js`, `routes/study-material-wrongs.js`, `routes/homework-photo.js`
- DB: `students`, `exam_sessions`, `class_exam_assignments`, material tables, homework photo tables
- storage: `student_token`, student session, `PLANNER_SID`, `PLANNER_PIN`

## C. 데이터/API 흐름

학생은 이름/PIN으로 `student-portal/auth`에 로그인하고 `student_token`을 받는다. home/exams/material/homework/planner 링크는 이 token 또는 PIN 기반으로 제한된다.

## D. 회귀 위험

- 시험지 직접 열기 기능 추가
- OMR 제출 완료 후 수정 버튼 추가
- `student_token` 없이 데이터 로드
- planner SSO key 삭제

## E. 추가 계획

학생/학부모 포털은 출결/숙제/리포트/청구/공지/상담으로 확장할 수 있으나, AP Math 기존 학생 포털과 OMR 정책을 우선 보호한다.

## F. 작업 후 업데이트 규칙

학생 포털 변경 시 `CURRENT_AUTH_PERMISSION_MAP.md`, `CURRENT_API_FLOW_MAP.md`, `CURRENT_REGRESSION_RISK_MAP.md`, `STUDENT_PARENT_PORTAL_NEXT_PLAN.md`, `CODEX_RESULT.md`를 업데이트한다.

