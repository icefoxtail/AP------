# OPERATIONS_CONSULTATION_DOMAIN

## A. 정책

- 상담 기록, 운영 메모, 일정, 학교시험 기록은 개인정보와 내부 운영 정보다.
- 학부모/public 경로에 internal memo나 운영자 전용 메모를 노출하지 않는다.

## B. 현재 구현 구조

- frontend: `apmath/js/student.js`, `apmath/js/dashboard.js`, `apmath/js/cumulative.js`
- route: `routes/operations.js`
- DB: `consultations`, `operation_memos`, `academy_schedules`, `exam_schedules`, `school_exam_records`, `daily_journals`

## C. 데이터/API 흐름

학생 상세는 상담을 lazy load하고 AI 상담 요약을 호출할 수 있다. dashboard는 운영 메모와 일지 흐름을 사용한다. cumulative는 school exam records를 batch/CRUD로 처리한다.

학생 출력 Round 1에서는 상담 목록 시트를 제외한다. frontend `state.db.consultations`는 학생 상세 lazy load 상태에 따라 불완전할 수 있으므로, 상담 목록 출력은 Round 2에서 Worker export API, 기간/범위 필터, audit_logs 기록을 포함해 별도 구현한다.

## D. 회귀 위험

- 상담 기록 권한 누락
- 상담 목록 XLSX가 Round 1 frontend export에 다시 포함됨
- 운영 메모가 학생/학부모 경로에 노출
- school exam records batch 저장 오류
- 일정 target_scope 누락

## E. 추가 계획

학생 종합관리 허브, 상담 타임라인, 학부모 연락, 수납/반이동과 연결되는 운영 모드는 원장/운영자 화면으로 분리한다.

## F. 작업 후 업데이트 규칙

운영/상담 변경 시 `CURRENT_API_FLOW_MAP.md`, `CURRENT_AUTH_PERMISSION_MAP.md`, `DIRECTOR_MODE_NEXT_PLAN.md`, `CODEX_RESULT.md`를 업데이트한다.
