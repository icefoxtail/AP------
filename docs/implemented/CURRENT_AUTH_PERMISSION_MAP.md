# CURRENT_AUTH_PERMISSION_MAP

## 1. 교사/admin 인증

- `core.js`는 `APMATH_SESSION`을 localStorage에 저장한다.
- session token이 있으면 Bearer 인증을 사용한다.
- raw password 계열은 `sanitizeSessionForStorage`에서 제거한다.
- Worker `verifyAuth`는 Bearer token과 Basic Auth fallback을 처리한다.
- `teacher_sessions`는 token, teacher_id, expires_at, revoked_at, last_used_at을 가진다.

## 2. 권한/scope

- admin은 initial-data에서 전체 students/classes 등을 조회한다.
- teacher는 `teacher_classes`로 classIds를 얻고, 해당 class의 students로 scope를 제한한다.
- `canAccessStudent`, `canAccessClass`, `getAllowedClassIds` helper가 존재한다.
- timetable 일부 전체 데이터는 teacher scope와 별도로 전용 배열로 내려간다. 이 경로는 회귀 위험이 높다.

## 3. 학생 인증

- 학생 포털은 PIN 로그인 후 `student_token`을 사용한다.
- planner는 `PLANNER_SID`, `PLANNER_PIN`, `planner_auth_{sid}`, `planner_pin_{sid}` 흐름이 있다.
- homework photo와 material OMR은 학생 token/PIN 기반 확인이 섞여 있다.

## 4. 감사/개인정보

- `staff_permissions`, `audit_logs`, `privacy_access_logs` table이 있다.
- `foundation-logs` route가 존재한다.
- UI 노출은 원장/admin 승인 전 숨김으로 취급한다.

