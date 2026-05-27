# CORE2_LAZY_LOAD_COVERAGE_PLAN

## 1. 분석 범위

이번 문서는 `/api/initial-data` 다음 분리 후보 6개 key의 실제 제거 전 선행 조건을 확정하기 위한 설계 문서다. 구현은 하지 않았다.

대상 key:

- `student_enrollments`
- `timetable_conflict_logs`
- `parent_contacts`
- `message_logs`
- `student_status_history`
- `class_transfer_history`

확인 파일:

- `apmath/worker-backup/worker/index.js`
- `apmath/worker-backup/worker/routes/enrollments.js`
- `apmath/worker-backup/worker/routes/timetable-conflicts.js`
- `apmath/worker-backup/worker/routes/parent-foundation.js`
- `apmath/worker-backup/worker/routes/foundation-logs.js`
- `apmath/js/core.js`
- `apmath/js/management.js`
- `apmath/js/student.js`
- `apmath/js/dashboard.js`
- `apmath/js/classroom.js`

기준:

- `/api/initial-data` 응답 축소, route 수정, 새 API 추가, lazy loader 구현, DB 수정, UI 문구 변경, 배포, 운영 API smoke test, git add/commit/push는 수행하지 않았다.
- 판단이 불확실하거나 필터/권한/loader가 부족한 항목은 `ready`로 확정하지 않았다.

## 2. 6개 key별 API coverage 표

| key | 현재 replacement API | 응답 key | query filter | 권한 범위 | 현재 판정 | 사유 |
| --- | --- | --- | --- | --- | --- | --- |
| `student_enrollments` | `GET /api/enrollments` | `enrollments` | `student_id`, `class_id` | admin 전체, teacher 담당 class 제한 | `needs loader` | API 필터와 권한 범위는 initial-data 대체에 충분하다. 프론트 loader만 아직 없다. |
| `timetable_conflict_logs` | `GET /api/timetable-conflicts` | `conflicts` | `status`만 존재 | admin 전체, teacher 담당 class 관련 충돌 제한 | `needs api` | initial-data는 최근 500건 제한이 있으나 API는 limit/class_id 필터가 없다. admin 화면 lazy load 시 전체 로그를 받을 위험이 있다. |
| `parent_contacts` | `GET /api/parent-foundation/contacts` | `contacts` | 없음 | admin 전체, teacher 담당 학생 제한 | `needs api` | 학생 상세 진입 단위 lazy load에는 `student_id`, 선택적으로 `limit` 필터가 필요하다. 현재 admin은 전체 연락처를 받는다. |
| `message_logs` | `GET /api/parent-foundation/messages` | `messages` | 없음 | admin 전체, teacher 담당 학생 제한 | `needs api` | initial-data는 admin 1000건, teacher 500건 제한인데 API는 limit/student_id/status/channel 필터가 없다. |
| `student_status_history` | `GET /api/foundation-logs/status-history` | `data` | 없음 | admin 전체, teacher 담당 학생 제한 | `needs api` | initial-data는 최근 1000/500 제한이 있으나 API는 전체 조회다. 학생 상세용 `student_id`와 `limit`이 필요하다. |
| `class_transfer_history` | `GET /api/foundation-logs/class-transfers` | `data` | 없음 | admin 전체, teacher 담당 학생 제한 | `needs api` | initial-data는 최근 1000/500 제한이 있으나 API는 전체 조회다. 학생 상세용 `student_id`, `class_id`, `limit`이 필요하다. |

## 3. 6개 key별 lazy loader 설계

`student_enrollments`

- loader 후보: `loadEnrollmentFoundation(scope)`
- 호출 화면: `management.js`의 학생/반 관리 상세 진입, `student.js`의 학생 상세 진입, 필요 시 `classroom.js`의 반 상세에서 학생 이름 클릭 전후
- API 호출:
  - 학생 상세: `enrollments?student_id=<studentId>`
  - 반 상세: `enrollments?class_id=<classId>`
  - 관리자 foundation 화면: `enrollments`
- 저장 위치: `state.ui.enrollmentFoundation`
- 캐시 key: `student:<id>`, `class:<id>`, `all`
- 판정: API는 충분하므로 다음 구현은 loader부터 가능

`timetable_conflict_logs`

- loader 후보: `loadTimetableConflictLogs(scope)`
- 호출 화면: 시간표/충돌 관리 화면을 별도로 노출하는 phase, 또는 관리자 foundation 화면 진입 시
- 필요한 API 보강:
  - `limit`
  - `class_id`
  - `status`
  - 선택: `conflict_type`, `target_id`
- 저장 위치: `state.ui.timetableConflictFoundation`
- 캐시 key: `status:<status>|class:<id>|limit:<n>`
- 판정: API 필터 보강 후 loader 구현

`parent_contacts`

- loader 후보: `loadParentContacts(scope)`
- 호출 화면: `student.js` 학생 상세의 보호자 foundation 영역, `management.js` 학생 관리 상세/연락 foundation 영역
- 필요한 API 보강:
  - `student_id`
  - 선택: `is_primary`, `receive_*`, `limit`
- 저장 위치: `state.ui.parentFoundation`
- 캐시 key: `student:<id>` 또는 `all`
- 주의: 기존 학생 상세 상단은 `students.parent_phone`, `guardian_relation`을 그대로 사용하고, foundation 연락처는 별도 패널/상태에 둔다.
- 판정: API 필터 보강 후 loader 구현

`message_logs`

- loader 후보: `loadMessageLogs(scope)`
- 호출 화면: 보호자 연락/발송 로그 화면, 학생 상세의 발송 이력 영역
- 필요한 API 보강:
  - `student_id`
  - `parent_contact_id`
  - `status`
  - `channel`
  - `message_type`
  - `limit`
- 저장 위치: `state.ui.parentFoundation`
- 캐시 key: `student:<id>|limit:<n>` 또는 `all|limit:<n>`
- 주의: 실제 발송 기능과 연결하지 않는다. 조회/로그 표시만 다룬다.
- 판정: API 필터와 limit 보강 후 loader 구현

`student_status_history`

- loader 후보: `loadStudentHistoryFoundation(studentId)`
- 호출 화면: `student.js` 학생 상세/관리 이력 탭 또는 `management.js` 학생 관리 상세
- 필요한 API 보강:
  - `student_id`
  - `limit`
  - 선택: `changed_from`, `changed_to`
- 저장 위치: `state.ui.studentHistoryFoundation`
- 캐시 key: `student:<id>`
- 응답 매핑: API 응답 `data` -> 캐시의 `statusHistory`
- 판정: API 필터 보강 후 loader 구현

`class_transfer_history`

- loader 후보: `loadStudentHistoryFoundation(studentId)` 안에서 status history와 함께 호출하거나, `loadClassTransferHistory(scope)`로 분리
- 호출 화면: `student.js` 학생 상세/관리 이력 탭, `management.js` 반 이동 이력 영역
- 필요한 API 보강:
  - `student_id`
  - `class_id`
  - `limit`
  - 선택: `changed_from`, `changed_to`
- 저장 위치: `state.ui.studentHistoryFoundation`
- 캐시 key: `student:<id>` 또는 `class:<id>`
- 응답 매핑: API 응답 `data` -> 캐시의 `classTransferHistory`
- 판정: API 필터 보강 후 loader 구현

## 4. 권한 범위 비교

| key | initial-data admin | initial-data teacher | replacement API admin | replacement API teacher | 비교 |
| --- | --- | --- | --- | --- | --- |
| `student_enrollments` | 전체 | 담당 class 기준 | 전체 또는 query filter | 담당 class 제한 + query filter | 거의 동일 |
| `timetable_conflict_logs` | 최근 500 | 담당 class 관련 최근 500 | 전체, status filter만 | 담당 class 관련, status filter | 권한은 유사하나 limit/filter가 부족 |
| `parent_contacts` | 전체 | 담당 학생 기준 | 전체 | 담당 학생 기준 | 권한은 유사하나 query filter가 부족 |
| `message_logs` | 최근 1000 | 담당 학생 기준 최근 500 | 전체 | 담당 학생 기준 전체 | 권한은 유사하나 limit/filter가 부족 |
| `student_status_history` | 최근 1000 | 담당 학생 기준 최근 500 | 전체 | 담당 학생 기준 전체 | 권한은 유사하나 limit/filter가 부족 |
| `class_transfer_history` | 최근 1000 | 담당 학생 기준 최근 500 | 전체 | 담당 학생 기준 전체 | 권한은 유사하나 limit/filter가 부족 |

권한 범위 자체는 대체로 initial-data와 같은 방향이다. 문제는 admin 조회와 로그/이력 계열의 조회량 제어다. 실제 initial-data 제거 전에는 전체 조회가 lazy load로 옮겨지는 것만으로 충분하지 않고, 화면 진입 단위의 scope 필터가 필요하다.

## 5. 응답 key / state 저장 위치

| key | API 응답 key | 권장 state 위치 | state.db 병합 여부 |
| --- | --- | --- | --- |
| `student_enrollments` | `enrollments` | `state.ui.enrollmentFoundation.enrollmentsByScope` | 병합하지 않음 |
| `timetable_conflict_logs` | `conflicts` | `state.ui.timetableConflictFoundation.conflictsByScope` | 병합하지 않음 |
| `parent_contacts` | `contacts` | `state.ui.parentFoundation.contactsByScope` | 병합하지 않음 |
| `message_logs` | `messages` | `state.ui.parentFoundation.messagesByScope` | 병합하지 않음 |
| `student_status_history` | `data` | `state.ui.studentHistoryFoundation.statusHistoryByScope` | 병합하지 않음 |
| `class_transfer_history` | `data` | `state.ui.studentHistoryFoundation.classTransferHistoryByScope` | 병합하지 않음 |

권장 원칙:

- 이 6개 key는 현재 `core.js`가 `state.db`에 병합하지 않는다.
- lazy load 결과도 `state.db`에 넣지 않고, 화면/모달 전용 `state.ui` 캐시에 둔다.
- 각 캐시는 `loading`, `loadedAt`, `error`, `scopeKey`, `rows` 구조를 가진다.
- 실패 시 기존 initial-data 잔여값에 의존하지 않는다. 제거 전후 동일하게 빈 배열 fallback으로 화면을 유지한다.

## 6. 실패 fallback 기준

공통 기준:

- loader 실패는 전체 앱 오류로 취급하지 않는다.
- 기존 dashboard, classroom, student 기본 상세 화면은 계속 렌더링한다.
- foundation 패널 또는 이력/연락 영역만 빈 상태 또는 재시도 가능한 상태로 둔다.
- 이미 캐시된 성공 데이터가 있으면 유지하고, `error`만 갱신한다.
- `{ error }`, `{ success: false }`, fetch 실패는 모두 실패로 분류한다.

key별 기준:

- `student_enrollments`: 실패 시 기존 `students/classes/class_students` 기반 화면을 유지하고 enrollment foundation 영역만 비워 둔다.
- `timetable_conflict_logs`: 실패 시 충돌 로그 영역만 비워 둔다. 출결/수업/대시보드에는 영향 없어야 한다.
- `parent_contacts`: 실패 시 기존 `students.parent_phone` 기반 보호자 정보 표시는 유지한다.
- `message_logs`: 실패 시 발송 이력 영역만 비워 둔다. 실제 발송 기능은 이번 phase에서 연결하지 않는다.
- `student_status_history`: 실패 시 학생 상세 기본 정보/성적/상담 탭은 유지한다.
- `class_transfer_history`: 실패 시 반 배정 현재 상태는 기존 `class_students` 기준으로 유지한다.

## 7. 다음 구현 후보

1. `student_enrollments` loader 구현
   - API coverage가 가장 충분하다.
   - `state.ui.enrollmentFoundation` 캐시만 추가하면 된다.
   - initial-data 제거 전 student/class scope 화면 검증을 수행한다.

2. 로그/이력 API 필터 보강
   - `timetable_conflict_logs`: `limit`, `class_id`, 선택 `conflict_type`
   - `message_logs`: `student_id`, `parent_contact_id`, `status`, `channel`, `message_type`, `limit`
   - `student_status_history`: `student_id`, `limit`
   - `class_transfer_history`: `student_id`, `class_id`, `limit`

3. `parent_contacts` API 필터 보강
   - `student_id`, `is_primary`, 수신 동의 계열 필터를 추가한 뒤 loader 구현

4. `parent_contacts/message_logs/student_status_history/class_transfer_history` 묶음 loader 구현
   - 학생 상세 진입 시 연락처/발송 이력/상태 이력/반 이동 이력을 별도 패널 단위로 지연 조회한다.

## 8. 아직 구현하면 안 되는 항목

- `/api/initial-data`에서 6개 key를 제거하는 작업
- `message_logs`와 실제 문자/알림 발송 기능 연결
- `parent_contacts`를 기존 `students.parent_phone` 표시의 대체 데이터로 즉시 바꾸는 작업
- `student_status_history`, `class_transfer_history`를 학생 상태 변경 로직에 강하게 연결하는 작업
- `timetable_conflict_logs` 제거와 시간표 충돌 판단 로직 개편을 한 번에 하는 작업
- `state.db`에 lazy-loaded foundation key를 추가 병합하는 작업

## 9. 실제 initial-data 축소 전 체크리스트

- `student_enrollments` lazy loader가 `student_id`, `class_id`, admin all scope에서 정상 동작한다.
- `timetable_conflict_logs` API에 `limit`과 화면 단위 scope filter가 준비되어 있다.
- `parent_contacts` API에 `student_id` 필터가 준비되어 있다.
- `message_logs` API에 `student_id`, `status/channel/type`, `limit` 필터가 준비되어 있다.
- `student_status_history` API에 `student_id`, `limit` 필터가 준비되어 있다.
- `class_transfer_history` API에 `student_id`, `class_id`, `limit` 필터가 준비되어 있다.
- lazy loader 실패 시 기존 dashboard, classroom, student detail, management 화면이 깨지지 않는다.
- lazy-loaded 데이터는 `state.ui` 캐시에만 저장하고 `state.db` shape는 변경하지 않는다.
- `core.js`의 `loadData()`와 `refreshDataOnly()`가 제거된 key 없이도 동일하게 동작한다.
- admin 첫 화면, teacher 첫 화면, dashboard, classroom, student detail, management, 관련 foundation 패널을 브라우저에서 확인한다.
- 운영 API smoke test와 배포는 사용자가 별도 지시할 때만 수행한다.

