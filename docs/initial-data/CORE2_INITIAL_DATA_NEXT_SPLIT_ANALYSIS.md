# CORE2_INITIAL_DATA_NEXT_SPLIT_ANALYSIS

## 1. 분석 범위

읽기 전용으로 `/api/initial-data`의 다음 분리 후보 9개 key를 확인했다. 확인 범위는 지정 문서, `apmath/worker-backup/worker/index.js`, 주요 `apmath/js/*.js`, `apmath/index.html`, `apmath/student/`, `apmath/planner/`, `apmath/homework/`이다.

이번 분석에서는 구현, route 수정, lazy loader 추가, DB schema/migration 수정, 운영 API smoke test, git add/commit/push를 수행하지 않았다.

대상 key:

- `student_enrollments`
- `class_time_slots`
- `timetable_conflict_logs`
- `timetable_conflict_overrides`
- `parent_contacts`
- `message_logs`
- `student_status_history`
- `class_transfer_history`
- `staff_permissions`

## 2. 보류 9개 key 현재 상태 표

| key | 현재 initial-data source | 프론트 직접 참조 여부 | 첫 화면 필요 여부 | 대체 API 존재 여부 | lazy load 가능 여부 | 제거 위험도 | 다음 phase 후보 여부 | 구현 전 선행 조건 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `student_enrollments` | `loadFoundationInitialData()`에서 admin 전체, teacher는 담당 class 기준 `student_enrollments` 조회 | 직접 참조 없음. `core.js`도 `state.db`에 병합하지 않음 | 현재 첫 화면 직접 의존 없음 | `/api/enrollments` GET 존재 | 가능 | 낮음~중간 | 후보 | management/student detail 등 진입 시 loader가 `/api/enrollments?student_id/class_id`를 호출하도록 설계 |
| `class_time_slots` | `loadFoundationInitialData()`에서 admin 전체, teacher는 담당 class 기준 `class_time_slots` 조회 | 직접 참조 없음. 기존 화면은 `classes.schedule_days/time_label` 중심 | 시간표 즉시 표시가 현재 `timetable_*`, `classes` 기반이라 직접 의존은 낮음 | `/api/class-time-slots` GET 존재 | 가능하나 시간표 phase와 묶어야 함 | 중간 | 조건부 후보 | 시간표 화면/충돌 판단이 slot 누락 상태에서 깨지지 않는지 검증, class slot loader 설계 |
| `timetable_conflict_logs` | `loadFoundationInitialData()`에서 admin 최근 500, teacher 담당 class 관련 최근 500 조회 | 직접 참조 없음 | 첫 화면 직접 의존 없음 | `/api/timetable-conflicts` GET, `/api/timetable-conflicts/scan` 존재 | 가능 | 낮음 | 후보 | conflict 화면/관리 진입 시 loader 추가, 기존 로그 빈 상태 UI 확인 |
| `timetable_conflict_overrides` | `loadFoundationInitialData()`에서 admin/teacher 모두 전체 조회 | 직접 참조 없음 | 첫 화면 직접 의존 없음. 단 충돌 판단 정책에는 중요할 수 있음 | `/api/timetable-conflict-overrides` GET 존재 | 가능하나 판단 로직 연동 전까지 주의 | 중간 | 조건부 후보 | scan/override UI가 override를 lazy로 받은 뒤 판단하도록 순서 보장 |
| `parent_contacts` | `loadFoundationInitialData()`에서 admin 전체, teacher 담당 학생 기준 조회 | 직접 참조 없음. 현재 UI는 `students.parent_phone`, `guardian_relation` 사용 | 첫 화면 직접 의존 없음 | `/api/parent-foundation/contacts` GET 존재 | 가능 | 낮음~중간 | 후보 | 학생 상세/보호자 연락 foundation 진입 loader, 개인정보 empty/error 처리 |
| `message_logs` | `loadFoundationInitialData()`에서 admin 최근 1000, teacher 담당 학생 최근 500 조회 | 직접 참조 없음 | 첫 화면 직접 의존 없음 | `/api/parent-foundation/messages` GET 존재 | 가능 | 낮음 | 후보 | 발송 로그 화면/preview 진입 loader, 실제 발송 금지 유지 |
| `student_status_history` | `loadFoundationInitialData()`에서 admin 최근 1000, teacher 담당 학생 최근 500 조회 | 직접 참조 없음 | 첫 화면 직접 의존 없음 | `/api/foundation-logs/status-history` GET 존재 | 가능 | 낮음 | 후보 | 학생 상세/관리 이력 loader, response key `data` 매핑 확정 |
| `class_transfer_history` | `loadFoundationInitialData()`에서 admin 최근 1000, teacher 담당 학생 최근 500 조회 | 직접 참조 없음 | 첫 화면 직접 의존 없음 | `/api/foundation-logs/class-transfers` GET 존재 | 가능 | 낮음 | 후보 | 학생 상세/반 이동 이력 loader, response key `data` 매핑 확정 |
| `staff_permissions` | `loadFoundationInitialData()`에서 admin 전체, teacher 본인 권한 조회 | 직접 참조 없음. 현재 화면 제어는 주로 `state.auth.role` 기반 | 권한 guard 확장 전에는 직접 필요 없음 | 전용 GET API 확인 안 됨 | 아직 보류 | 높음 | 제외 | staff permission read-only API와 권한 guard fallback 정책 선행 |

## 3. 프론트 파일별 직접 참조 결과

`rg`로 9개 DB key 문자열 및 `state.db.<key>`, `data.<key>`, `initialData.<key>` 패턴을 확인했다. 지정된 프론트 범위에서는 9개 key의 직접 참조가 발견되지 않았다.

| 파일/범위 | 결과 |
| --- | --- |
| `apmath/js/core.js` | `loadData()`와 `refreshDataOnly()`가 9개 key를 `state.db`에 병합하지 않음 |
| `apmath/js/dashboard.js` | 9개 key 직접 참조 없음. 첫 화면은 `students`, `classes`, `class_students`, attendance/homework/history/schedule/memo 계열 중심 |
| `apmath/js/management.js` | 9개 key 직접 참조 없음. 보호자 표시는 `students.parent_phone`, `guardian_relation` 사용 |
| `apmath/js/classroom.js` | 9개 key 직접 참조 없음. 수업 표시/필터는 `classes.schedule_days` 등 기존 key 사용 |
| `apmath/js/student.js` | 9개 key 직접 참조 없음. 보호자 입력/표시는 `students` 테이블 컬럼 사용 |
| `apmath/js/report.js` | 9개 key 직접 참조 없음. 학부모 문구는 리포트 생성 로직 내부 텍스트이며 `parent_contacts/message_logs` 직접 사용 아님 |
| `apmath/js/cumulative.js` | 9개 key 직접 참조 없음 |
| `apmath/js/qr-omr.js` | 9개 key 직접 참조 없음 |
| `apmath/js/schedule.js` | 9개 key 직접 참조 없음 |
| `apmath/js/textbook.js` | 9개 key 직접 참조 없음 |
| `apmath/index.html` | 9개 key 및 `/api/initial-data` 직접 사용 없음 |
| `apmath/student/` | 9개 key 및 `/api/initial-data` 직접 사용 없음 |
| `apmath/planner/` | 9개 key 및 `/api/initial-data` 직접 사용 없음 |
| `apmath/homework/` | 9개 key 및 `/api/initial-data` 직접 사용 없음 |

## 4. index.js / core.js / management.js / dashboard.js 의존성

`index.js`:

- `loadFoundationInitialData(env, teacher)`가 9개 key를 모두 빈 배열 기본값으로 정의한다.
- admin은 9개 key를 전체 또는 제한 건수로 조회한다.
- teacher는 담당 class/student 범위로 `student_enrollments`, `class_time_slots`, `timetable_conflict_logs`, `parent_contacts`, `message_logs`, `student_status_history`, `class_transfer_history`, 본인 `staff_permissions`를 조회한다.
- `timetable_conflict_overrides`는 teacher도 전체 조회한다.
- `/api/initial-data` 응답 마지막에 `...foundationData`로 9개 key를 붙인다.
- `/api/enrollments`, `/api/class-time-slots`, `/api/timetable-conflicts`, `/api/timetable-conflict-overrides`, `/api/parent-foundation`, `/api/foundation-logs` route가 이미 index에서 위임된다.

`core.js`:

- `loadData()`는 9개 key를 `state.db`에 넣지 않는다.
- `refreshDataOnly()`도 9개 key를 병합하지 않는다.
- 따라서 현재 프론트 화면은 initial-data에 9개 key가 있어도 공통 state에서 소비하지 않는 상태다.
- 실제 제거 전에는 "응답에 key가 없어도 core 병합이 깨지지 않는다"는 점은 유리하지만, 숨은 전역 참조는 별도 브라우저 검증이 필요하다.

`management.js`:

- 학생/반 관리는 기존 `students`, `classes`, `class_students` 기반이다.
- 보호자 정보는 foundation `parent_contacts`가 아니라 `students.parent_phone`, `students.guardian_relation`을 직접 사용한다.
- 수납/출납 foundation lazy loader는 별도 구현되어 있으나 이번 9개 key와 직접 관련은 없다.
- 학생 enrollment, parent contact, history, staff permission용 lazy loader는 아직 없음.

`dashboard.js`:

- 첫 화면/관리자 화면은 현재 9개 key를 직접 쓰지 않는다.
- `showBillingAccountingFoundationEntry = false` 상태이며 이번 분석 대상과 무관하게 foundation 진입은 숨김 유지 상태다.
- 권한 제어는 `staff_permissions`가 아니라 `state.auth.role` 중심으로 보인다.

## 5. 다음 분리 후보

다음 phase에서 제거 후보로 검토 가능한 key:

- `student_enrollments`
- `timetable_conflict_logs`
- `parent_contacts`
- `message_logs`
- `student_status_history`
- `class_transfer_history`

이유:

- 현재 프론트 직접 참조가 없다.
- `core.js`가 이미 `state.db`에 병합하지 않는다.
- 첫 화면 직접 의존성이 낮다.
- 대체 조회 API가 이미 존재한다.

단, 실제 `/api/initial-data`에서 제거하는 작업은 별도 phase에서 해야 한다. 이때도 response 축소만 하지 말고 화면 진입 lazy loader, 빈 상태 처리, 권한 범위 확인을 같이 검증해야 한다.

## 6. 아직 분리하면 안 되는 후보

`staff_permissions`:

- 전용 read-only API가 확인되지 않았다.
- 향후 화면 제어/권한 guard와 직접 연결될 수 있어 제거 위험도가 높다.
- 현재는 `state.auth.role` 중심이라 소비되지 않지만, 권한 key는 없어도 되는 데이터가 아니라 guard 정책 선행이 필요하다.

`class_time_slots`:

- 현재 프론트 직접 참조는 없지만 시간표 foundation의 핵심 원천이다.
- 충돌 scan이 `class_time_slots`와 `student_enrollments`를 직접 사용한다.
- 시간표 즉시 표시/충돌 판단 흐름과 묶어서 phase를 잡는 편이 안전하다.

`timetable_conflict_overrides`:

- 직접 참조는 없지만 충돌 예외 정책 데이터다.
- override가 scan/판단/표시에 어느 시점에 필요한지 UI 흐름이 확정되기 전까지 단독 제거는 보류가 안전하다.

## 7. 필요한 read-only API 후보

이미 존재하는 read-only API:

- `GET /api/enrollments` -> `{ success, enrollments }`
- `GET /api/class-time-slots` -> `{ success, class_time_slots }`
- `GET /api/timetable-conflicts` -> `{ success, conflicts }`
- `GET /api/timetable-conflict-overrides` -> `{ success, overrides }`
- `GET /api/parent-foundation/contacts` -> `{ success, contacts }`
- `GET /api/parent-foundation/messages` -> `{ success, messages }`
- `GET /api/foundation-logs/status-history` -> `{ success, data }`
- `GET /api/foundation-logs/class-transfers` -> `{ success, data }`

추가 필요 후보:

- `GET /api/staff-permissions` 또는 기존 foundation route 하위의 `GET /api/foundation-logs/staff-permissions`에 준하는 전용 조회 API
- 학생 상세 단위 묶음 API 후보: contacts, status history, class transfer history를 student_id 기준으로 한 번에 조회
- 시간표 foundation 묶음 API 후보: enrollments, class_time_slots, conflicts, overrides를 class_id/branch 기준으로 조회

## 8. 필요한 lazy loader 후보

`loadEnrollmentFoundation(scope)`:

- 관리/학생 상세/반 상세 진입 시 `/api/enrollments` 호출
- scope: `student_id`, `class_id`, admin all

`loadTimetableFoundation(scope)`:

- 시간표 foundation 또는 충돌 화면 진입 시 `/api/class-time-slots`, `/api/timetable-conflicts`, `/api/timetable-conflict-overrides` 호출
- scan 버튼이 있다면 `/api/timetable-conflicts/scan`과 분리

`loadParentFoundation(studentId?)`:

- 학생 상세 보호자 foundation 또는 연락 화면 진입 시 contacts/messages 조회
- 기존 `students.parent_phone` UI와 혼동하지 않도록 별도 상태에 저장

`loadStudentHistoryFoundation(studentId?)`:

- `/api/foundation-logs/status-history`, `/api/foundation-logs/class-transfers` 호출
- response key가 `data`라서 화면 상태 key로 명시 매핑 필요

`loadStaffPermissions()`:

- staff permission 전용 read-only API가 생긴 뒤 적용
- 권한 조회 실패 시 기존 `state.auth.role` guard를 어떻게 유지할지 정책 필요

## 9. 구현 전 위험 요소

- 현재 9개 key는 initial-data 응답에는 있으나 `state.db`에 병합되지 않는다. 제거 자체는 쉬워 보이지만, 숨은 전역 직접 참조가 브라우저 런타임에서만 드러날 수 있다.
- 시간표 관련 key는 `classes.schedule_days/time_label` 기반 기존 UI와 `class_time_slots` foundation이 병존한다. 둘의 역할을 분리하지 않으면 중복/불일치가 생길 수 있다.
- `timetable_conflict_overrides`는 "표시 데이터"보다 "판단 정책"에 가까워 lazy load 시점이 늦으면 충돌 판단 결과가 달라질 수 있다.
- `parent_contacts`는 개인정보 성격이 강하다. lazy loader에는 권한 범위, 빈 상태, 실패 안내, 로그 정책을 분리해야 한다.
- `message_logs`는 실제 발송 기능과 혼동하면 안 된다. 이번 범위에서는 조회/로그만 다뤄야 한다.
- `student_status_history`, `class_transfer_history`는 `foundation-logs` route에서 `data`로 응답하므로 프론트 상태명 매핑 실수가 생기기 쉽다.
- `staff_permissions`는 현재 API 공백이 있으며, 권한 guard의 기준이 `role`에서 permission으로 확장될 때 초기 로딩 순서 문제가 생길 수 있다.
- 실제 initial-data 축소 phase에서는 `index.js`만 바꾸더라도 `core.js`, 주요 화면, student/planner/homework 경로의 무동작 검증이 필요하다.

## 10. 다음 phase 권장 순서

1. `student_enrollments`, `parent_contacts`, `message_logs`, `student_status_history`, `class_transfer_history`용 화면 진입 lazy loader 설계
2. 위 5개 key를 initial-data에서 제거해도 되는지 별도 작업에서 브라우저/화면 검증
3. `timetable_conflict_logs` lazy loader와 충돌 로그 화면/관리 흐름 정리
4. `class_time_slots` + `timetable_conflict_overrides`는 시간표 foundation 묶음 phase로 분리
5. `staff_permissions` read-only API와 권한 guard fallback 정책 설계
6. 마지막에 `/api/initial-data` 실제 축소 작업을 별도 지시로 수행

