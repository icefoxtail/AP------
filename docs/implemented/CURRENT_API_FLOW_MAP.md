# Student Mutation Idempotency Addendum

1. `POST /api/students` builds a normalized SHA-256 `student_identity_key` from name, school, grade, phones, guardian relation, address, vehicle info, and class id.
2. The route checks both keyed duplicates and legacy rows where `student_identity_key` is null/blank. Legacy fallback matches the same normalized identity fields through `students` + `class_students`.
3. Fallback duplicates return `success: true`, the existing `id`, `student`, `class_student`, and `duplicate_ignored: true`; the route backfills the identity key when it can do so without forcing a merge.
4. Auto PIN creation uses retry-capable `generateUniqueStudentPin`; auto-pin and batch-pins retry UPDATE unique collisions, while manual PIN collisions keep the existing PIN-conflict response.
5. Student create/edit/delete/restore responses include the changed `student` row and `class_student` row or `null` so the frontend can update state without reloading all initial data.
6. `initial-data` is read-only for teacher-class mapping repair; it no longer calls `repairTeacherClassMappings(env)` on every request.

# CURRENT_API_FLOW_MAP

## 0. Onboarding Tasks Round 1

1. Teacher-authenticated clients call `/api/onboarding/tasks`.
2. `index.js` verifies auth and delegates `/api/onboarding` to `routes/onboarding.js`.
3. `bootstrap` creates `intro`, `week1`, `month1` rows in `onboarding_tasks` with duplicate guards.
4. `GET /tasks` returns visible, non-completed, non-skipped tasks scoped by teacher/class/student access and includes `effective_status`.
5. `complete` inserts one `consultations` row and stores `completed_consultation_id`.
6. `contact`, `defer`, and `skip` only update `onboarding_tasks`; they do not insert consultations.
7. Round 1 does not expose new teacher cards, panels, CSS, warnings, D+14, or director/admin dashboards.

## 1. 로그인/session

1. `core.js`가 `auth/login` 호출
2. Worker `handleAuth`가 Basic/login 처리
3. `teachers`, `teacher_sessions` 조회/생성
4. frontend는 `APMATH_SESSION`에 session 저장
5. 이후 `Authorization: Bearer {session_token}` 사용

## 2. initial-data

1. `core.js`가 `api.get('initial-data')`
2. `index.js`가 `verifyAuth`
3. admin은 students/classes/map/attendance/homework/exams/consultations/foundation 전체성 데이터 조회
4. teacher는 `teacher_classes` 기준으로 class/student scope 제한
5. report 통계용 `report_exam_cohort_stats`는 같은 연도의 같은 `archive_file`과 같은 학년 기준 summary만 추가 조회
6. response가 `state.db`로 합쳐짐
7. dashboard/classroom/student/timetable/report가 동일 state를 사용

## 3. classroom 출결/숙제

1. `classroom.js` 또는 `dashboard.js`에서 attendance/homework patch
2. `routes/attendance-homework.js`
3. `attendance`, `homework` upsert/patch
4. frontend local state와 cache 갱신

## 4. 학생 포털 OMR

1. 학생이 `student-portal/auth`로 PIN 로그인
2. `student_token` 저장
3. `student-portal/exams`로 배정 확인
4. `student-portal/omr-submit` 또는 check route로 제출
5. 일반 시험 OMR 제출 완료 후 수정/재제출 UI 금지

## 5. 플래너 SSO

1. 학생 포털이 `PLANNER_SID`, `PLANNER_PIN`을 local/session storage에 저장
2. `apmath/planner/index.html`이 query/storage에서 sid/pin 복원
3. `planner-auth` 확인
4. `planner?student_id=&from=&to=&pin=` 로드
5. POST/PATCH/DELETE로 계획 저장

## 6. 시간표 version/staging

1. `timetable.js`가 `timetable-versions` 로드
2. draft 선택 시 version classes/slots/student assignments를 state에 보관
3. slot/class/student 변경은 version route 또는 운영 class-time-slots/classes route로 분기
4. conflict scan은 `timetable-conflicts/scan`
5. 운영 classes/class_students 직접 훼손 금지, draft는 staging table 우선

## 7. 수납/출납 foundation

1. `management.js`가 `billing-accounting-foundation/*` subresource 로드
2. route는 payment methods, templates, payments, transactions, cashbook, refund, carryover, summaries 처리
3. 실제 결제/발송은 구현 또는 실행하지 않는다
4. UI 기본 노출은 사용자 승인 필요

## 8. 학원 일정 시리즈

1. `schedule.js`가 휴무/기타 반복 규칙에 따라 occurrence 날짜 배열을 만든다.
2. 단일 occurrence는 `POST /api/academy-schedules`, 복수 occurrence는 `POST /api/academy-schedules/batch`로 저장한다.
3. 각 row는 같은 `series_id`, `series_kind`, `series_until`을 보유하며 기존 row는 `series_id || id`로 호환한다.
4. 한 날짜 수정/삭제는 기존 단건 route를 사용하고, 전체 공통 필드 수정은 `PATCH /api/academy-schedules/series/:seriesId`, 전체 삭제는 `DELETE /api/academy-schedules/series/:seriesId`를 사용한다.
5. 날짜 구성 변경은 frontend가 기존 시리즈를 소프트 삭제한 뒤 occurrence를 재생성한다.
6. `exam_schedules` 저장·수정·삭제 경로는 변경하지 않는다.
