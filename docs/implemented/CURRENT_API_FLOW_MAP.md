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
