# STAFF_PERMISSION_AUDIT_DOMAIN

## A. 정책

- staff/admin/teacher 권한은 선생님 현장 화면과 원장/admin 화면을 분리하는 기준이다.
- 개인정보 접근 로그와 감사 로그는 기본 UI 노출 금지다.

## B. 현재 구현 구조

- frontend: `apmath/js/core.js`, `apmath/js/dashboard.js`
- routes: `auth.js`, `teachers.js`, `foundation-logs.js`
- DB: `teachers`, `teacher_sessions`, `teacher_classes`, `staff_permissions`, `audit_logs`, `privacy_access_logs`
- helpers: `verifyAuth`, `canAccessStudent`, `canAccessClass`, `isAdminUser`, `isTeacherUser`

## C. 데이터/API 흐름

로그인 후 session token이 발급되고, API마다 `verifyAuth`로 teacher/admin을 확인한다. 담당반은 `teacher_classes`로 제한한다. 감사 로그 조회는 foundation route로 분리되어 있다.

## D. 회귀 위험

- teacher에게 admin 데이터 노출
- 로그/권한 화면 무단 노출
- session revocation 실패
- `teacher is not defined`류 runtime 오류

## E. 추가 계획

권한 key 체계, branch scope, 개인정보 접근 로그 UI는 원장/admin 승인 후 별도 phase로 진행한다.

## F. 작업 후 업데이트 규칙

권한 변경 시 `CURRENT_AUTH_PERMISSION_MAP.md`, `CURRENT_WORKER_ROUTE_MAP.md`, `CURRENT_HIDDEN_FOUNDATION_MAP.md`, `CODEX_RESULT.md`를 업데이트한다.

