# CLASSROOM_DOMAIN

## A. 정책

- 반 화면은 선생님 친화형 현장 화면이다.
- 기존 출석부/숙제/플래너/반 학생/일지 흐름과 문구를 보존한다.
- 복잡한 admin/foundation 기능은 선생님 기본 화면에 노출하지 않는다.

## B. 현재 구현 구조

- frontend: `apmath/js/classroom.js`
- 연결 API: `attendance`, `homework`, `attendance-history`, `homework-photo/*`, `class-daily-records`, `planner`
- 관련 DB: `attendance`, `homework`, `homework_photo_*`, `class_textbooks`, `class_daily_records`, `class_daily_progress`, `students`, `classes`, `class_students`
- helper/state: `core.js`의 `state.db`, `api`, auth header

## C. 데이터/API 흐름

반 선택 후 `state.db.classes`, `class_students`, `students`로 학생 목록을 만들고, 출결/숙제 patch는 Worker route로 전송한다. 숙제 사진은 assignment, student-links, overview, files 흐름으로 나뉜다. 플래너는 class/student/date 기준으로 `planner` API를 조회한다.

## D. 회귀 위험

- 출결/숙제 낙관 갱신과 월간 cache 불일치
- 선생님 담당반 scope 깨짐
- `숙제` UI 용어 변경
- 플래너 PC/모바일 보기 깨짐
- 수업일지 저장/결재 흐름 변경

## E. 추가 계획

오늘 수업 중심, 내 반 중심, 빠른 출결/숙제/진도 확인을 유지한다. 고급 관리 기능은 별도 화면이나 접힘 영역으로만 검토한다.

## F. 작업 후 업데이트 규칙

classroom 변경 시 `CURRENT_FRONTEND_MAP.md`, `CURRENT_API_FLOW_MAP.md`, `CURRENT_REGRESSION_RISK_MAP.md`, `CLASSROOM_NEXT_PLAN.md`, `CODEX_RESULT.md`를 업데이트한다.

