# STUDENTS_CLASSES_DOMAIN

## 0. Onboarding Tasks Round 1 Note

신입생 적응 확인은 이번 Round 1에서 `onboarding_tasks` DB/API foundation으로만 추가한다. 학생 등록 화면, 선생님 화면 카드, 슬라이드 패널, CSS, 자동 문자 발송, 원장/admin 화면은 추가하지 않는다. `/api/onboarding/tasks/bootstrap`은 학생/enrollment 기준으로 `intro`, `week1`, `month1` task를 만들고, 실제 상담 기록은 `complete` 처리에서만 `consultations`에 insert한다.

## A. 정책

- 학생/반/PIN/담당반은 AP Math 핵심 운영 데이터다.
- 재원/퇴원/휴원/대기 상태와 반 이동 이력은 신중히 처리한다.
- 담당 선생님 권한을 우회하지 않는다.
- 학생 추가/수정 및 학생관리 class select option 표시명은 중복 반명 방지를 위해 `반명 · 담당 · 요일/교시/시간` 기준으로 보강하되, 표준 운영 시간대는 교시를 자동 추론하고 DB `classes.name`, `time_label`, 저장 `class_id`는 변경하지 않는다.

## B. 현재 구현 구조

- frontend: `apmath/js/student.js`, `apmath/js/management.js`, `apmath/js/dashboard.js`
- shared frontend helper: `apmath/js/core.js`의 class option 표시명 helper
- frontend export: `apmath/js/student-export.js`는 admin 전용 학생 XLSX 출력 Round 1을 담당한다.
- routes: `students.js`, `classes.js`, `teachers.js`, `enrollments.js`
- DB: `students`, `classes`, `class_students`, `teacher_classes`, `student_enrollments`, `student_status_history`, `class_transfer_history`

## C. 데이터/API 흐름

admin/teacher가 students/classes를 관리하고, initial-data는 role에 따라 전체 또는 담당반 범위로 데이터를 내려준다. 반 이동은 enrollment/transfer route와 history table을 사용한다.

학생 출력/엑셀 내보내기 Round 1은 frontend `state.db.students`, `classes`, `class_students` 기반이다. admin에만 출력 버튼과 모달을 노출하며 teacher 출력, Worker export API, audit_logs는 보류한다. XLSX에는 출력정보 시트를 항상 포함한다. PIN 출력과 학생 memo 출력은 포함하지 않는다. 상담 목록은 frontend 상담 데이터 lazy load 불완전성 때문에 Round 1에서 제외하고 Round 2 Worker export API와 audit_logs 기반으로 처리한다.

## D. 회귀 위험

- teacher가 담당하지 않는 학생 조회
- teacher에게 admin 전용 학생 출력 버튼/모달 노출
- 학생 출력 파일에 PIN 또는 학생 memo 포함
- PIN 자동 발급 중복
- class_students와 student_enrollments 불일치
- 퇴원/숨김/복구 상태 혼선
- 반 선택 option 표시명 개선이 `classes.name`, `class_id`, 학생 등록/수정 payload 구조를 바꾸는 것

## E. 추가 계획

반 이동 이력, 수강 상태, 담당 선생님 권한, 학생 상태 변경 이력을 운영 UI로 꺼내는 시점은 별도 승인 후 진행한다.

## F. 작업 후 업데이트 규칙

학생/반 변경 시 `CURRENT_DB_MAP.md`, `CURRENT_AUTH_PERMISSION_MAP.md`, `CURRENT_API_FLOW_MAP.md`, 관련 plan, `CODEX_RESULT.md`를 업데이트한다.
