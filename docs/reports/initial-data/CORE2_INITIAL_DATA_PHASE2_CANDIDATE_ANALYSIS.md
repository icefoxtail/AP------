# CORE2_INITIAL_DATA_PHASE2_CANDIDATE_ANALYSIS

## 1. 분석 범위

- 분석 대상 key:
  - `class_time_slots`
  - `timetable_conflict_logs`
  - `timetable_conflict_overrides`
  - `staff_permissions`
- 확인 파일:
  - `apmath/worker-backup/worker/index.js`
  - `apmath/worker-backup/worker/routes/class-time-slots.js`
  - `apmath/worker-backup/worker/routes/timetable-conflicts.js`
  - `apmath/js/core.js`
  - `apmath/js/dashboard.js`
  - `apmath/js/management.js`
  - `apmath/js/classroom.js`
  - `apmath/js/cumulative.js`
  - `apmath/js/schedule.js`
  - `apmath/js/student.js`
- 추가 관찰:
  - 지정 파일 외 `apmath/js/timetable.js`가 시간표 화면의 실제 렌더러다.
  - 현재 `core.js`는 남은 4개 foundation key를 `state.db`에 병합하지 않는다.
  - 따라서 initial-data 응답에는 남아 있지만 지정 프론트 흐름에서는 직접 사용되지 않는다.

## 2. 남은 4개 key 현재 상태

원격 `/api/initial-data`를 `admin:admin1234` 인증으로 확인했다.

| key | 현재 count | 응답 key 존재 | 배열 여부 | 현재 initial-data 조회 |
| --- | ---: | --- | --- | --- |
| `class_time_slots` | 76 | 예 | 예 | admin 전체, teacher 담당 class 범위 |
| `timetable_conflict_logs` | 13 | 예 | 예 | admin 최근 500, teacher 담당 class 관련 최근 500 |
| `timetable_conflict_overrides` | 0 | 예 | 예 | admin/teacher 전체 |
| `staff_permissions` | 0 | 예 | 예 | admin 전체, teacher 본인 |

## 3. 프론트 파일별 참조 결과

| 파일 | 참조 결과 |
| --- | --- |
| `apmath/js/core.js` | `loadData()`와 `refreshDataOnly()`가 `timetable_classes`, `timetable_class_students`, `timetable_students`, `timetable_class_textbooks`는 병합하지만, 분석 대상 4개 key는 병합하지 않는다. 첫 화면 진입은 admin `renderAdminControlCenter()`, teacher `renderDashboard()`다. |
| `apmath/js/dashboard.js` | 관리자/선생님 첫 화면은 `students`, `classes`, `class_students`, 출결/숙제/시험/상담/일정 계열을 사용한다. 분석 대상 4개 key 직접 참조 없음. 시간표 버튼은 `renderTimetable()` 진입만 제공한다. |
| `apmath/js/management.js` | 반/주소록/관리 모달 중심. 분석 대상 4개 key 직접 참조 없음. |
| `apmath/js/classroom.js` | 반 화면은 `classes`, `class_students`, `students`, 출결/숙제/진도/상담을 사용한다. `renderClass()`는 `loadEnrollmentFoundation({ class_id })`만 호출하고 분석 대상 4개 key 직접 참조 없음. |
| `apmath/js/cumulative.js` | 누적 출결/성적 장부 계열. 분석 대상 4개 key 직접 참조 없음. 권한 판단은 `state.auth.role` 중심. |
| `apmath/js/schedule.js` | 시험/학원 일정 관리. `exam_schedules`, `academy_schedules` 사용. 분석 대상 4개 key 직접 참조 없음. |
| `apmath/js/student.js` | 학생 상세는 `loadEnrollmentFoundation()`과 `loadStudentFoundationDetails()`를 호출한다. 분석 대상 4개 key 직접 참조 없음. |
| `apmath/js/timetable.js` | 지정 파일은 아니지만 시간표 실제 렌더러. `timetable_classes`, `timetable_class_students`, `timetable_students`, `timetable_class_textbooks`를 사용하고, 분석 대상 `class_time_slots`는 직접 참조하지 않는다. |

## 4. 첫 화면 의존성 판단

| key | 첫 화면 필수 여부 | 관리자 첫 화면 의존 | 선생님 첫 화면 의존 | 시간표 화면 의존 | 클래스룸/학생 상세 의존 |
| --- | --- | --- | --- | --- | --- |
| `class_time_slots` | 현재 프론트 기준 필수 아님 | 직접 의존 없음 | 직접 의존 없음 | 현재 `timetable.js`는 `timetable_classes` 중심이라 직접 의존 없음. 단 Worker 충돌 scan은 이 테이블에 의존 | 직접 의존 없음 |
| `timetable_conflict_logs` | 필수 아님 | 직접 의존 없음 | 직접 의존 없음 | 충돌 관리 화면/route에서는 필요 가능. 첫 시간표 렌더 직접 의존 없음 | 직접 의존 없음 |
| `timetable_conflict_overrides` | 필수 아님 | 직접 의존 없음 | 직접 의존 없음 | 충돌 예외 관리 route에서 필요. 현재 scan 로직은 override를 판정 입력으로 직접 읽지는 않음 | 직접 의존 없음 |
| `staff_permissions` | 필수 아님 | 직접 의존 없음 | 직접 의존 없음 | 직접 의존 없음 | 직접 의존 없음 |

판단:

- 첫 화면만 기준으로 보면 4개 모두 축소 가능성이 있다.
- 다만 `class_time_slots`는 시간표 foundation과 충돌 scan의 원천 데이터라, 화면 직접 참조가 없다는 이유만으로 즉시 축소 확정하기보다 시간표/충돌 관리 lazy 진입 설계를 먼저 두는 편이 안전하다.
- `staff_permissions`는 현재 프론트 권한 제어가 `state.auth.role` 중심이라 future foundation 성격이 강하다.

## 5. 대체 API 존재 여부

| key | 대체 API | 응답 key | 필터/권한 | 원격 확인 |
| --- | --- | --- | --- | --- |
| `class_time_slots` | `GET /api/class-time-slots`, `GET /api/class-time-slots?class_id=...` | `class_time_slots` | admin 전체, teacher 담당 class 제한, `class_id` 필터 | 성공, count 76 |
| `timetable_conflict_logs` | `GET /api/timetable-conflicts?limit=...`, `status`, `conflict_type`, `target_id`, `class_id` 필터 | `conflicts` | admin 전체, teacher 담당 class 관련 충돌 제한 | 성공, count 13 |
| `timetable_conflict_overrides` | `GET /api/timetable-conflict-overrides` | `overrides` | 현재 GET은 admin/teacher 모두 조회 가능 | 성공, count 0 |
| `staff_permissions` | 명확한 전용 read API 없음 | 없음 | initial-data 외 대체 경로 확인 안 됨 | 미확인 |

## 6. lazy load 가능 후보

### 1순위 후보: `timetable_conflict_logs`

- 첫 화면 직접 의존 없음.
- 대체 API가 이미 있고 `limit`, `status`, `conflict_type`, `target_id`, `class_id` 필터가 있다.
- 관리/충돌 화면 진입 시 로드하는 구조로 옮기기 쉽다.
- 축소 위험도: 낮음~중간.

### 2순위 후보: `timetable_conflict_overrides`

- 현재 count 0이고 첫 화면 직접 의존 없음.
- 대체 API가 이미 있다.
- 다만 충돌 예외 정책 UI나 future 판단 로직과 묶일 수 있으므로 충돌 관리 진입 시 `logs + overrides`를 함께 lazy load하는 식이 안전하다.
- 축소 위험도: 낮음~중간.

### 조건부 후보: `class_time_slots`

- 현재 프론트 시간표 화면은 `timetable_classes`와 class/student/textbook snapshot 중심이라 직접 참조는 없다.
- 대체 API가 이미 있고 `class_id` 필터가 있다.
- 하지만 Worker의 충돌 scan은 `class_time_slots`를 원천 데이터로 사용한다.
- 시간표 편집/충돌 관리 화면이 class slot 상태를 즉시 필요로 하는 UX가 생기면 빈 배열 상태가 위험할 수 있다.
- 축소 전 `loadClassTimeSlots(scope)` 같은 lazy loader와 시간표/충돌 관리 진입 호출 위치를 명확히 해야 한다.
- 축소 위험도: 중간.

### 제한적 후보: `staff_permissions`

- 현재 프론트 직접 참조 없음.
- 현재 count 0.
- 권한 제어가 `state.auth.role` 중심이라 첫 화면 영향은 낮다.
- 그러나 대체 read API가 없다. 나중에 실제 권한 guard에 쓰기 시작하면 initial-data 제거가 장애가 될 수 있다.
- 축소하려면 `staff_permissions`가 정말 future-only인지 확정하거나 read API를 먼저 준비해야 한다.
- 축소 위험도: 중간~높음.

## 7. 아직 축소하면 안 되는 후보

- 확정 보류: `class_time_slots`
  - 이유: 충돌 scan 원천 데이터이고 시간표 foundation의 핵심 테이블이다.
  - 프론트 직접 의존은 현재 낮지만, 시간표/충돌 기능과 의미적으로 강하게 연결되어 있다.
  - lazy loader 구현 없이 바로 initial-data에서 빈 배열로 만들면 후속 시간표 편집/충돌 관리 기능에서 회귀를 놓치기 쉽다.

- 확정 보류: `staff_permissions`
  - 이유: 대체 read API가 없다.
  - 현재 count 0이고 직접 참조도 없지만, 권한 제어 데이터라 한번 쓰이기 시작하면 영향 범위가 크다.
  - 제거 가능성은 있으나 먼저 정책 결정을 해야 한다.

## 8. 위험 요소

- `core.js`가 현재 4개 key를 `state.db`에 병합하지 않기 때문에, 단순 프론트 검색만으로는 "응답에 있으니 사용 중"이라는 판단이 맞지 않는다.
- `class_time_slots`는 프론트 직접 사용보다 Worker-side 충돌 scan과 시간표 foundation 의미가 더 중요하다.
- `timetable_conflict_overrides`는 현재 count 0이지만 예외 정책 데이터라, 운영 중 데이터가 생기면 충돌 관리 화면과 같이 로드해야 한다.
- `staff_permissions`는 현재 API 대체 경로가 없어서 lazy load 구현 없이 축소하면 향후 권한 화면/권한 guard 확장 시 복구 비용이 생긴다.
- 선생님 계정 smoke가 아직 제한적이다. teacher 권한에서 대체 API 범위가 admin과 같은지 별도 확인이 필요하다.
- 기존 worktree에 `apmath/planner/index.html` 및 `archive` 변경이 남아 있어, 후속 구현 시 diff 범위 확인이 필요하다.

## 9. 권장 다음 단계

1. 2차 구현은 `timetable_conflict_logs`와 `timetable_conflict_overrides`를 같은 작업 단위로 묶는다.
   - 충돌 관리 화면 진입 시 `GET /api/timetable-conflicts?limit=...`와 `GET /api/timetable-conflict-overrides`를 호출하는 lazy loader를 설계한다.
   - initial-data 축소 시 두 key는 key 유지 + 빈 배열로 유지한다.

2. `class_time_slots`는 별도 phase로 둔다.
   - `GET /api/class-time-slots` 또는 `class_id` 필터 기반 lazy loader를 먼저 만든다.
   - 시간표 화면, 충돌 scan/관리 화면, class 편집 흐름에서 필요한 호출 위치를 확정한다.

3. `staff_permissions`는 이번 2차 축소 후보에서 제외한다.
   - 실제 프론트 권한 제어에 쓰지 않는 future foundation인지 결정한다.
   - 계속 유지할지, read API를 추가한 뒤 lazy화할지 정책을 먼저 정한다.

4. 다음 구현 후보와 보류 후보를 구분한다.
   - 구현 후보: `timetable_conflict_logs`, `timetable_conflict_overrides`
   - 보류 후보: `class_time_slots`, `staff_permissions`
