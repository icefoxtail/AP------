# STUDENTS_CLASSES_DOMAIN

## A. 정책

- 학생/반/PIN/담당반은 AP Math 핵심 운영 데이터다.
- 재원/퇴원/휴원/대기 상태와 반 이동 이력은 신중히 처리한다.
- 담당 선생님 권한을 우회하지 않는다.

## B. 현재 구현 구조

- frontend: `apmath/js/student.js`, `apmath/js/management.js`, `apmath/js/dashboard.js`
- routes: `students.js`, `classes.js`, `teachers.js`, `enrollments.js`
- DB: `students`, `classes`, `class_students`, `teacher_classes`, `student_enrollments`, `student_status_history`, `class_transfer_history`

## C. 데이터/API 흐름

admin/teacher가 students/classes를 관리하고, initial-data는 role에 따라 전체 또는 담당반 범위로 데이터를 내려준다. 반 이동은 enrollment/transfer route와 history table을 사용한다.

## D. 회귀 위험

- teacher가 담당하지 않는 학생 조회
- PIN 자동 발급 중복
- class_students와 student_enrollments 불일치
- 퇴원/숨김/복구 상태 혼선

## E. 추가 계획

반 이동 이력, 수강 상태, 담당 선생님 권한, 학생 상태 변경 이력을 운영 UI로 꺼내는 시점은 별도 승인 후 진행한다.

## F. 작업 후 업데이트 규칙

학생/반 변경 시 `CURRENT_DB_MAP.md`, `CURRENT_AUTH_PERMISSION_MAP.md`, `CURRENT_API_FLOW_MAP.md`, 관련 plan, `CODEX_RESULT.md`를 업데이트한다.

