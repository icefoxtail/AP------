# CURRENT_WORKER_ROUTE_MAP

## 0. Onboarding Round 1 Route

| route file | handler/export | API | auth | DB | UI exposure |
|---|---|---|---|---|---|
| `routes/onboarding.js` | `handleOnboarding` | `GET /api/onboarding/tasks`, `POST /api/onboarding/tasks/bootstrap`, `PATCH /api/onboarding/tasks/:id`, `POST /api/onboarding/tasks/:id/complete`, `contact`, `defer`, `skip` | teacher session/basic via `index.js` then route scope checks | `onboarding_tasks`, completed task only inserts `consultations` | Round 1 route/API foundation only. No teacher screen card/panel/CSS added. |

`index.js` only imports `handleOnboarding` and delegates `/api/onboarding` into the route. API body logic stays in `routes/onboarding.js`.

기준 파일: `apmath/worker-backup/worker/index.js`, `apmath/worker-backup/worker/routes/*.js`, `helpers/*.js`

## 1. index.js 위임 구조

`index.js`는 `/api/{resource}`를 기준으로 route handler에 위임한다. 공통 처리에는 `OPTIONS`, `verifyAuth`, `readJsonBody`, `jsonResponse`, try/catch, 404 응답이 있다.

index.js에 API 본문을 직접 추가하는 방식은 금지한다. 새 API는 route 파일을 만들고 index는 위임만 담당하게 한다.

## 2. route 목록

| route 파일 | handler/export | 담당 API | 인증 | 관련 DB | 위험 |
|---|---|---|---|---|---|
| `routes/auth.js` | `handleAuth` | `auth/login`, logout helper | Basic/Bearer | `teachers`, `teacher_sessions` | session 회귀 |
| `routes/students.js` | `handleStudents` | `students`, detail-data, batch-pins, restore/hide/delete | teacher | `students`, 관련 foundation | PIN/개인정보 |
| `routes/classes.js` | `handleClasses` | `classes`, `class-students` | teacher | `classes`, `class_students`, `teacher_classes` | 반/담당반 |
| `routes/teachers.js` | `handleTeachers` | `teachers`, `teacher-classes` | teacher/admin | `teachers`, `teacher_classes` | 권한 |
| `routes/attendance-homework.js` | `handleAttendanceHomework` | attendance/homework batch/history/month | teacher | `attendance`, `homework` | 출결/숙제 |
| `routes/exams.js` | `handleExams` | `exam-blueprints`, `class-exam-assignments`, `exam-sessions` | teacher | exam tables | OMR/리포트 |
| `routes/check-omr.js` | `handleCheckOmr` | `check-pin`, `check-init`, `qr-classes` | 학생 PIN/QR | students/exams | 제출 완료 수정 금지 |
| `routes/student-portal.js` | `handleStudentPortal` | `student-portal/*` | student token/PIN | students, exams, assignments | 시험지 직접 열기 금지 |
| `routes/planner.js` | `handlePlanner` | `planner`, `planner-auth`, `planner-auth-by-name` | student/teacher helper | planner schema | SSO |
| `routes/reports-ai.js` | `handleReportsAi` | `ai/student-report`, report-analysis, consultation summary | teacher | consultations/exams | 학부모 문구 |
| `routes/operations.js` | `handleOperations` | consultations, memos, schedules, school exam records, daily journals | teacher | 운영 tables | 개인정보 |
| `routes/class-daily.js` | `handleClassDaily` | class-textbooks, class-daily-records/progress | teacher | class_daily_* | 수업일지 |
| `routes/homework-photo.js` | `handleHomeworkPhoto` | homework-photo assignments/files/student submit | teacher/student | homework_photo_* + R2 | 파일 만료 |
| `routes/study-material-wrongs.js` | `handleStudyMaterialWrongs` | material-* | teacher/student token | material_* | 일반 OMR과 정책 혼선 |
| `routes/enrollments.js` | `handleEnrollments` | enrollments/transfer | teacher | `student_enrollments`, transfer history | 반 이동 |
| `routes/class-time-slots.js` | `handleClassTimeSlots` | class-time-slots | teacher | `class_time_slots` | 시간표 |
| `routes/timetable-conflicts.js` | `handleTimetableConflicts` | conflicts/scan/overrides | teacher | timetable conflict tables | 충돌 정책 |
| `routes/timetable-versions.js` | `handleTimetableVersions` | timetable version CRUD/draft/apply-ish actions | teacher | timetable_version_* | 운영/staging 분리 |
| `routes/foundation-sync.js` | `handleFoundationSync` | foundation sync preview/run | teacher | foundation_sync_logs | 운영 데이터 변형 |
| `routes/billing-foundation.js` | `handleBillingFoundation` | billing foundation | teacher | billing tables | 금액 |
| `routes/billing-accounting-foundation.js` | `handleBillingAccountingFoundation` | billing/accounting subresources | teacher | payment/cashbook/refund/carryover | 금액 무결성 |
| `routes/parent-foundation.js` | `handleParentFoundation` | contacts/consents/messages/preview | teacher | parent/contact/message | 실제 발송 금지 |
| `routes/foundation-logs.js` | `handleFoundationLogs` | audit/privacy logs | teacher | audit/privacy logs | 개인정보 |

## 3. helpers

- `helpers/response.js`: headers, jsonResponse, readJsonBody
- `helpers/foundation-db.js`: makeId, admin/staff 판정, safeAll, canAccessStudent/Class, foundation CRUD
- `helpers/admin-db.js`: sha256hex, teacher alias, student PIN, target score, high subjects
- `helpers/branch.js`: branch normalization
- `helpers/time.js`: time overlap, foundation time parsing, conflict helper

## 4. initial-data

`index.js` 내부에서 `/api/initial-data`가 핵심 데이터를 직접 조합한다. admin은 전체 데이터, teacher는 `teacher_classes`와 학생 목록으로 scope를 줄인다. foundation data는 `loadFoundationInitialData`로 합쳐진다. 이 응답 구조 변경은 frontend 전체 회귀 위험이 매우 크다.

