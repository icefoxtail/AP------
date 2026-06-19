# AP/EIE Full CRUD & Save Flow Audit Result

## 작업 성격
- 조사 전용
- 코드 수정 없음
- 작성 파일: `CODEX_RESULT.md` only

## 조사 범위
- AP 프론트: `apmath/index.html`, `apmath/js/core.js`, `dashboard.js`, `ui.js`, `student.js`, `student-edit.js`, `classroom.js`, `classroom-planner.js`, `timetable.js`, `management.js`, `cumulative.js`, `report.js`, `schedule.js`, `memo.js`, `qr-omr.js`, `study-material-wrong.js`, `wangji-student-management.js`
- AP Worker: `apmath/worker-backup/worker/index.js`, `routes/*`, `helpers/*`, `schema.sql`, migrations, `wrangler.jsonc`
- EIE 프론트: `eie/index.html`, `eie/js/eie-api.js`, `eie-app.js`, `eie-router.js`, `views/*`, `apms-compat/*`
- EIE Worker: `workers/wangji-eie-worker/index.js`, `workers/wangji-eie-worker/routes/eie.js`, migrations, `wrangler.jsonc`; AP backup의 `routes/eie.js`도 보조 확인
- Archive: `archive/index.html`, `mixer.html`, `engine.html`, `mixed_engine.html`, `assessment/*`, internal review engine
- Student Portal: `apmath/student/index.html`, `sw.js`, `apmath/planner/index.html`, `apmath/homework/index.html`
- Wangji: `apmath/js/wangji-student-management.js`, `workers/wangji-common-worker/routes/wangji.js`

## 전체 요약
- 구현 완료: AP 학생 등록/수정/퇴원/복귀/숨김/제한적 purge, 상담 CRUD, 학부모 연락처 CRUD, 학급 CRUD, 출결/숙제 저장, 시간표 version/draft/배정, OMR/시험 세션, 성적, 메모, 일정, EIE 학생/시간표/상담/교사/성적 주요 흐름
- 부분 구현: EIE 연락처 삭제, EIE 학생 상세 출결 저장, EIE 성적 개별 수정/삭제 wrapper, AP 상담 전체 조회 API, AP/EIE 일부 출력·임시저장 흐름
- 프론트만 있음: EIE `deleteStudentContact()`, APMS compat의 일부 EIE timetable-cell student assignment 차단 로직, 일부 Archive/Assessment local-only 결과 저장
- 백엔드만 있음: AP `POST /students/:id/auto-pin`, EIE `confirmed-contacts`, `schedule-assignments`, EIE school-grade patch/delete wrapper, 일부 foundation/audit routes
- 미구현: 학생 PIN reset 전용 UI, EIE 연락처 soft-delete, 학생 포털 토큰 만료/회전, Archive engine 데이터 URL 제한
- 위험: AP 퇴원 status 저장값과 화면 필터 불일치, AP 학급 삭제의 강한 물리 삭제, EIE GET 실패 stub masking, EIE disabled teacher 세션 유지, Archive engine 임의 script 로드, student/planner/homework PIN localStorage 저장

## CRUD 매트릭스

### AP Math OS

| 도메인 | Create | Read | Update | Delete/Archive | Front | Backend | DB | 판정 |
|---|---|---|---|---|---|---|---|---|
| 학생 | `api.post('students')` | `initial-data`, `students/:id/detail-data` | `api.patch('students/:id')` | `DELETE students/:id` soft 퇴원, restore/hide/purge | `student-edit.js:561`, `student.js:423`, `dashboard-admin.js:199` | `routes/students.js:403`, `:405`, `:470` | `students`, `class_students`, `student_status_history` | RISK |
| 학급 | `api.post('classes')` | `initial-data`, `classes` | `api.patch('classes/:id')` | `api.delete('classes')` hard delete | `management.js:280`, `:341`, `:386` | `routes/classes.js:56`, `:82`, `:93` | `classes`, related class tables | RISK |
| 학급-학생 배정 | 학생 등록/수정, 시간표 transfer | `class_students` via initial-data | edit/transfer | transfer removes old mapping | `student-edit.js`, `timetable.js:2617` | `students.js`, `enrollments.js:8` | `class_students`, `student_enrollments`, `class_transfer_history` | PASS |
| 시간표 | draft/class/slot create | version/month read | patch/activate/replace slots | class-time-slot delete, version staging | `timetable.js:935-2617` | `timetable-versions.js`, `class-time-slots.js` | `timetable_version_*`, `class_time_slots` | PASS |
| 출결 | patch upsert | history/month | patch tags/memo/status | 없음 | `dashboard.js:1799`, `classroom.js:387`, `cumulative.js:1251` | `attendance-homework.js:137`, `:176` | `attendance` | PASS |
| 숙제 | patch upsert | initial-data/history | patch status | 없음 | `dashboard.js:1808`, `classroom-planner.js:161` | `attendance-homework.js:203` | `homework` | PASS |
| 사진 숙제 | assignment create | assignments/files/overview | close/reopen/status | delete assignment | `classroom.js:957`, `:1111`, `:1128` | `homework-photo.js:237`, `:420`, `:879` | `homework_photo_*`, R2 | RISK |
| 과제/플래너 | POST plan | GET planner/overview | PATCH plan/settings | DELETE plan | `planner/index.html:1571`, `:1594`, `:1614` | `planner.js:347`, `:467`, `:518` | `student_plans`, `planner_feedback` | RISK |
| 상담 | `api.post('consultations')` | student scoped GET | PATCH | DELETE hard delete | `student.js:1170`, `:2876`, `:3025`, `:3047` | `operations.js:66-111` | `consultations` | PASS |
| 메모 | POST | initial-data | PATCH | DELETE hard delete | `memo.js:48`, `:72`, `:95` | `operations.js:120-144` | `operation_memos` | PASS |
| 시험/OMR | bulk OMR/session/assignment | exam sessions | PATCH session/wrongs | DELETE session/wrongs | `qr-omr.js:673`, `:1304`, `classroom-planner.js:442` | `exams.js:843`, `:962`, `:1039`, `:1053` | `exam_sessions`, `wrong_answers`, `class_exam_assignments` | PASS |
| 성적 | school exam batch/create | initial-data | PATCH | soft delete | `cumulative.js:2046`, `:2276`, `:2293` | `operations.js:300-417` | `school_exam_records` | PASS |
| 리포트 | AI 생성/상담 저장 | archive/session/local cache | 분석 cache | 없음 | `report.js:547`, `:657`, `:3298` | `reports-ai.js` | `consultations`, localStorage cache | PARTIAL |
| 교재/수업자료 | class-textbooks, material routes | GET scopes | PATCH disable/update | disable/soft-ish | `textbook.js`, `study-material-wrong.js:33` | `class-daily.js`, `study-material-wrongs.js` | `class_textbooks`, `material_*` | PARTIAL |
| 오답 입력 | OMR/material submit | wrong answer 조회 | session PATCH | wrongs DELETE | `qr-omr.js`, `study-material-wrong.js` | `exams.js`, `study-material-wrongs.js` | `wrong_answers`, `student_material_*` | PASS |
| 퇴원생 | `DELETE students/:id` | admin filters | restore/hide | purge 제한 | `student-edit.js:77`, `dashboard-admin.js:199`, `:217` | `students.js:407`, `:428`, `:470` | `students.status`, history | RISK |
| 교사 계정 | POST teachers | GET teachers | PATCH/reset | disabled-ish | `dashboard-admin.js:2126`, `:2201`, `:2237`, `:2270` | `teachers.js` | `teachers`, `teacher_classes` | PASS |
| 원장 관리 | owner/admin panels | initial-data | journals/inquiries/status | 일부 delete 없음 | `dashboard-admin.js` | `operations.js`, `index.js public-inquiries` | mixed | PARTIAL |
| PIN 관리 | batch pins/edit pin | missing pins read | edit pin | reset 전용 없음 | `classroom.js:761`, `dashboard-admin.js:388`, `student-edit.js:454` | `students.js:370`, `:394` | `students.student_pin` | PARTIAL |
| 일정 | academy/exam schedule POST | GET | PATCH | exam hard delete, academy soft delete | `schedule.js:529`, `:616`, `:638` | `operations.js:152-258` | `academy_schedules`, `exam_schedules` | PASS |

### EIE

| 도메인 | Create | Read | Update | Delete/Archive | Front | Backend | DB | 판정 |
|---|---|---|---|---|---|---|---|---|
| 학생 | `EieApi.createStudent` | `getStudents` | `updateStudent`, `updateStudentStatus` | `deleteStudent` soft archive | `eie-students.js:1856`, `:1889`, `:1903`, `:1919` | `routes/eie.js:2580`, `:2763`, `:2914`, `:2975`, `:3281` | `eie_students` | PASS |
| 시간표/반 | create cell | timetable GET | update/status | status archived | `eie-timetable.js:5010`, `:5046`, `:4893` | `routes/eie.js:2451`, `:2500`, `:3276` | `eie_timetable_cells` | PASS |
| 학생-반 배정 | assign/batch | attached students | batch replace | archived assignment | `eie-timetable.js:5094`, `:5100` | `routes/eie.js:3001`, `:3023`, `:3046`, `:3383` | `eie_timetable_cell_students` | RISK |
| 출결 | saveAttendanceRecord | month/student/cell GET | POST upsert | 없음 | `eie-classroom.js:1550`, `eie-attendance.js:828`, `eie-students.js:2249` | `routes/eie.js:1577`, `:1619` | `eie_attendance_records` | RISK |
| 상담 | create | GET | update | DELETE | `eie-students.js:2072`, `:2018`, `:2146` | `routes/eie.js:1458`, `:1481`, `:1504`, `:3334` | `eie_consultations` | PASS |
| 연락처 | create | GET | update | frontend exists, backend 409 not implemented | `eie-api.js:284`, `:299`, `eie-students.js:1937` | `routes/eie.js:836`, `:843`, `:887`, `:933` | `eie_student_contacts` | FRONT_ONLY |
| 시험/성적 | create/batch | GET | exam patch | exam delete | `eie-classroom.js:1324`, `eie-students.js:2222` | `routes/eie.js:1079-1167` | `eie_exam_records` | PASS |
| 학교 성적 | batch | GET | backend patch | backend delete | `eie-grade-ledger.js:707` | `routes/eie.js:1292-1383` | `eie_school_grade_records` | BACKEND_ONLY |
| Grade sheet | save | GET | overwrite save | 없음 | `eie-grade-ledger.js:934` | `routes/eie.js:1410`, `:1424` | `eie_grade_sheets` | PASS |
| 교사 계정 | create | GET | update/reset | disabled role | `eie-management.js:158-201` | `routes/eie.js:3120-3221` | `teachers`, `teacher_sessions` | RISK |
| Owner memo | local create | local read | local update | local remove | `eie-dashboard.js:728`, `:738` | 없음 | localStorage | FRONT_ONLY |

### Archive / Assessment

| 도메인 | Create | Read | Update | Delete/Archive | Front | Backend | DB | 판정 |
|---|---|---|---|---|---|---|---|---|
| 시험지 출력 | mixed payload 생성 | JS bank/local files | 없음 | 없음 | `archive/index.html`, `mixer.html`, `engine.html`, `mixed_engine.html` | 없음 | localStorage/sessionStorage | RISK |
| AP 제출 QR/반 배정 | class-exam-assignment POST | `qr-classes` | 중복 upsert | by-exam delete backend | `archive/index.html:2214`, `engine.html:675` | `exams.js:556`, `:744` | `class_exam_assignments` | PASS |
| blueprint 저장 | POST exam-blueprints | GET by file | upsert | 없음 | `engine.html:1454`, `mixed_engine.html:844` | `exams.js:452`, `:505` | `exam_blueprints` | PASS |
| Assessment 결과 | localStorage 저장 | localStorage 분석 | local draft | local clear | `assessment-mvp.html:936`, `assessment-analysis.html:966` | 없음 | localStorage | FRONT_ONLY |
| 내부 검수 엔진 | file save/blob export | File System Access/IndexedDB | local edit | local only | `internal-review-engine.js` | 없음 | local IndexedDB-ish | PARTIAL |

### Student Portal

| 도메인 | Create | Read | Update | Delete/Archive | Front | Backend | DB | 판정 |
|---|---|---|---|---|---|---|---|---|
| 학생 로그인 | session local 저장 | auth/home | 없음 | logout local clear | `student/index.html:816`, `:849` | `student-portal.js:157`, `:208` | `students`, deterministic token | RISK |
| OMR 제출 | submit | exams/material | 재제출 제한 | 없음 | `student/index.html:1678` | `student-portal.js:300`, `:310` | `exam_sessions`, `wrong_answers` | PASS |
| 시험/정답/해설 출력 | window.open | archive URLs | 없음 | 없음 | `student/index.html:1551-1553` | 없음 | archive files | PARTIAL |
| 플래너 | POST plan | GET planner | PATCH | DELETE | `planner/index.html:1571`, `:1594`, `:1614` | `planner.js:304-518` | `student_plans` | RISK |
| 사진 숙제 제출 | upload | assignment auth | cancel/reopen | expired/deleted flag | `homework/index.html:612`, `:631` | `homework-photo.js:662`, `:699`, `:820` | `homework_photo_*`, R2 | RISK |

### Wangji

| 도메인 | Create | Read | Update | Delete/Archive | Front | Backend | DB | 판정 |
|---|---|---|---|---|---|---|---|---|
| Overlay 학생 | POST | GET | PATCH | DELETE | `wangji-student-management.js` | `wangji.js:418-424` | `wangji_students` | PASS |
| 링크 | POST | GET/status | PATCH status | 없음 | same | `wangji.js:428-430` | `wangji_links` | PASS |
| 상담 | POST | GET | PATCH | DELETE | same | `wangji.js:421`, `:434-436` | `wangji_consultations` | PASS |
| 메모 | POST | GET | PATCH | DELETE | same | `wangji.js:422`, `:440-442` | `wangji_memos` | PASS |
| Write-through queue | POST | GET | PATCH status | 없음 | same | `wangji.js:446-448` | queue tables | PARTIAL |

## 신입 등록 / 학생 수정 / 삭제 집중 조사

### 신입 등록
- 프론트: AP `openAddStudent/handleAddStudent` in `apmath/js/student-edit.js:513-573`; EIE `EieStudentsView.saveNew` in `eie/js/views/eie-students.js:1856`; timetable quick-add in `eie/js/views/eie-timetable.js:5180`, `:5535`
- API: AP `POST /api/students`; EIE `POST /api/eie/students`
- Worker: AP `routes/students.js:213`, `:403`; EIE `routes/eie.js:2580`, `:3281`
- DB: AP `students`, `class_students`, `student_identity_key`; EIE `eie_students`, optional teacher/cell mapping
- 판정: PASS
- 위험: AP add/edit 화면 텍스트 일부 인코딩 깨짐이 확인되며, EIE는 GET fallback이 실패를 빈 데이터처럼 보이게 만들 수 있음

### 학생 정보 수정
- 프론트: AP `api.patch('students/:id')` in `student-edit.js:462`; EIE `EieApi.updateStudent` in `eie-students.js:1889`, classroom quick edit `eie-classroom.js:1457`
- API: AP `PATCH /api/students/:id`; EIE `PATCH /api/eie/students/:id`
- Worker: AP `routes/students.js:255`, `:405`; EIE `routes/eie.js:2763`, `:3289`
- DB: AP student profile/contact/status/PIN fields; EIE `eie_students`
- 판정: PASS
- 위험: AP class change deletes old `class_students` then inserts new mapping without broader undo UI; EIE mutations clear read cache only after success

### 학생 삭제 / 퇴원 / 재등록
- 프론트: AP withdrawal `student-edit.js:77`, restore `:97`, admin hide/purge `dashboard-admin.js:199`, `:206`, `:217`; EIE archive `eie-students.js:1919`, timetable inactive `eie-timetable.js:5565`
- API: AP `DELETE /students/:id`, `PATCH /students/:id/restore`, `PATCH /students/:id/hide`, `DELETE /students/:id/purge`; EIE `DELETE /api/eie/students/:id`, `PATCH /status`
- Worker: AP `students.js:407`, `:420`, `:428`, `:470`; EIE `eie.js:2914`, `:2975`
- DB: AP `students.status`, `student_status_history`; purge removes only hidden students with no blocking records. EIE delete is soft archive with `withdrawn_at`
- 판정: RISK
- 위험: AP 퇴원 저장값은 route에서 `퇴원` 계열로 저장되나 일부 화면은 `제적` 필터를 사용해 퇴원생 목록 누락 가능. AP purge 자체는 제한되어 있으나 “완전 삭제” 버튼은 운영 사고 위험. EIE는 soft archive라 완전 삭제 위험은 낮음

### PIN / 학부모 연락처 / 상담
- 프론트: AP PIN edit/batch `student-edit.js:454`, `dashboard-admin.js:388`, `classroom.js:761`; AP 연락처 `student.js:2686`, `:2732`, `:2751`; AP 상담 `student.js:2876`, `:3025`, `:3047`; EIE 연락처/상담 `eie-api.js:284-317`, `eie-students.js:1937-2147`
- API: AP `students/batch-pins`, `parent-foundation/contacts`, `consultations`; EIE `students/:id/contacts`, `student-contacts/:id`, `consultations`
- Worker: AP `students.js:370`, `parent-foundation.js:475`, `operations.js:66`; EIE `eie.js:836`, `:1458`
- DB: AP `student_pin UNIQUE`, `parent_contacts`, `consultations`; EIE `eie_student_contacts`, `eie_consultations`
- 판정: PARTIAL
- 위험: AP 단일 auto-pin route는 backend-only. EIE 연락처 삭제는 frontend/API wrapper는 있으나 backend가 `EIE_NOT_IMPLEMENTED`로 거절. 학생/플래너/숙제 PIN이 localStorage에 저장됨

## 백엔드 Route Inventory

| Method | Path | Auth | Role | Body/Query | DB | Front Caller | 판정 |
|---|---|---|---|---|---|---|---|
| POST | `/api/auth/login` | no | teacher | login/password | `teachers`, `teacher_sessions` | `core.js:714`, archive login | PASS |
| GET | `/api/initial-data` | yes | admin/teacher scoped | none | mixed AP tables | `core.js:784` | PASS |
| GET/POST/PATCH/DELETE | `/api/students[/:id]` | yes | teacher scoped/admin | student fields | `students`, `class_students` | `student-edit.js` | RISK |
| POST | `/api/students/batch-pins` | yes | teacher/admin | optional `class_id` | `students.student_pin` | `dashboard-admin.js:388`, `classroom.js:761` | PASS |
| POST | `/api/students/:id/auto-pin` | yes | teacher scoped | none | `students.student_pin` | none found | BACKEND_ONLY |
| PATCH | `/api/students/:id/restore|hide` | yes | teacher scoped | none | `students.status` | `dashboard-admin.js` | PASS |
| DELETE | `/api/students/:id/purge` | yes | admin | hidden only | many student tables | `dashboard-admin.js:217` | RISK |
| GET/POST/PATCH/DELETE | `/api/classes[/:id]` | yes | teacher/admin | class fields | `classes`, related | `management.js` | RISK |
| POST | `/api/enrollments/transfer` | yes | teacher | source/target/student | `student_enrollments`, `class_transfer_history` | `timetable.js:2617` | PASS |
| GET/POST/PATCH/DELETE | `/api/class-time-slots` | yes | teacher | slot fields | `class_time_slots` | `timetable.js` | PASS |
| GET/PATCH | `/api/attendance`, `/api/attendance-history`, `/api/attendance-month` | yes | teacher | date/student/status/tags | `attendance` | dashboard/classroom/cumulative | PASS |
| PATCH | `/api/homework` | yes | teacher | date/student/status | `homework` | dashboard/classroom-planner | PASS |
| GET/POST/PATCH/DELETE | `/api/consultations[/:id]` | yes | teacher scoped | student/date/type/content | `consultations` | `student.js`, `report.js` | PASS |
| GET/POST/PATCH/DELETE | `/api/operation-memos[/:id]` | yes | teacher | memo fields | `operation_memos` | `memo.js`, `dashboard.js` | PASS |
| GET/POST/PATCH/DELETE | `/api/academy-schedules`, `/api/exam-schedules` | yes | teacher | schedule fields | schedules | `schedule.js` | PASS |
| GET/POST/PATCH/DELETE | `/api/school-exam-records` | yes | teacher | score fields | `school_exam_records` | `cumulative.js` | PASS |
| GET/POST/PATCH/DELETE | `/api/exam-sessions` | yes | teacher/student route variants | OMR/session fields | `exam_sessions`, `wrong_answers` | `qr-omr.js`, student portal | PASS |
| GET/POST | `/api/class-exam-assignments`, `/api/exam-blueprints` | yes | teacher | archive/exam fields | exam assignment tables | Archive/engine | PASS |
| GET/POST/PATCH/DELETE | `/api/planner` | teacher or student PIN/token | teacher/student | plan/settings | `student_plans`, feedback | planner/classroom-planner | RISK |
| GET/POST/PATCH | `/api/homework-photo/*` | mixed teacher/student PIN | teacher/student | assignment/upload/file | `homework_photo_*`, R2 | classroom/homework | RISK |
| GET/POST/PATCH/DELETE | `/api/eie/students`, `/api/eie/timetable-cells`, `/api/eie/consultations`, etc. | yes | EIE teacher/admin | EIE bodies | `eie_*` | EIE views | PARTIAL |
| GET/POST/PATCH/DELETE | `/api/wangji/*` | Bearer admin except login/status | admin | overlay bodies | wangji overlay tables | Wangji UI | PASS |

## 프론트 저장 호출 Inventory

| File | Function | Action | API/Storage | Method | Success Refresh | Error Handling | 판정 |
|---|---|---|---|---|---|---|---|
| `apmath/js/core.js` | `api.get/post/patch/delete` | common remote API | `CONFIG.API_BASE` | GET/POST/PATCH/DELETE | callers merge/reload; offline queue for mutations | GET returns `{}` after toast; mutations throw/return parsed | RISK |
| `apmath/js/student-edit.js` | `handleAddStudent` | 신입 등록 | `students` | POST | `mergeStudentCreateResponseIntoState`, close modal, refresh list | toast/catch | PASS |
| `apmath/js/student-edit.js` | `handleEditStudent` | 학생 수정 | `students/:id` | PATCH | merge, reload onboarding details, render detail | toast/catch | PASS |
| `apmath/js/student-edit.js` | `handleDelete/Restore` | 퇴원/복귀 | `students/:id`, restore | DELETE/PATCH | merge, close, refresh | toast/catch | RISK |
| `apmath/js/dashboard-admin.js` | `purgeHiddenStudent` | 완전 삭제 | `students/:id/purge` | DELETE | state filter/remove | double confirm, toast | RISK |
| `apmath/js/student.js` | consultation/contact handlers | 상담/연락처 CRUD | `consultations`, `parent-foundation/*` | POST/PATCH/DELETE | merge scoped rows | toast/catch | PASS |
| `apmath/js/management.js` | class/billing forms | 학급/수납 | `classes`, `billing-accounting-foundation/*` | POST/PATCH/DELETE | local render/reload | toast/catch | PARTIAL |
| `apmath/js/timetable.js` | version/class/student ops | 시간표 | `timetable-versions`, `classes`, `class-time-slots`, `enrollments/transfer` | GET/POST/PATCH | reload version/state | toast/catch | PASS |
| `apmath/js/classroom.js` | attendance/homework/photo/class daily | 출결/숙제/사진/수업일지 | multiple | GET/POST/PATCH/DELETE | targeted reload | toast/catch | PASS |
| `apmath/js/cumulative.js` | school exam save | 성적 | `school-exam-records` | POST/PATCH/DELETE | reload table | toast/catch | PASS |
| `apmath/js/qr-omr.js` | OMR submit | 시험 세션/오답 | `exam-sessions`, local last exam | PATCH/POST/localStorage | state/session update | toast/catch | PASS |
| `apmath/js/report.js` | AI/report/consultation | 리포트/상담 | `ai/*`, `consultations`, local cache | POST/localStorage | cache/render | catch/toast | PARTIAL |
| `eie/js/eie-api.js` | `request/get` | common EIE API | `/api/eie/*` | GET/POST/PATCH/DELETE | non-GET clears read cache | 401/403 handled; other GET becomes stub | RISK |
| `eie/js/views/eie-students.js` | save/create/delete/consultation/contact | 학생/상담/연락처 | EieApi | POST/PATCH/DELETE | `EieState.upsert/merge`, reload | form error | PARTIAL |
| `eie/js/views/eie-timetable.js` | cell/student assignment/consultation | 시간표/배정 | EieApi | POST/PATCH/DELETE | local cell/state merge | notice/error | RISK |
| `eie/js/views/eie-classroom.js` | attendance/exams/student quick edit | 교실 | EieApi | POST/PATCH | local refresh/merge | error text | PASS |
| `archive/index.html`, `engine.html`, `mixer.html` | assignment/print | 출력/AP assignment | fetch/localStorage/window.open | POST/GET/local | open engine | alert/toast | RISK |
| `apmath/student/index.html` | auth/submit | 학생 포털 | `student-portal/*`, storage | POST/GET/localStorage | local session/state | generic errors | RISK |
| `apmath/planner/index.html` | plan save/delete | 플래너 | `planner` | POST/PATCH/DELETE | reload plans | generic errors | RISK |
| `apmath/homework/index.html` | auth/upload | 사진 숙제 | `homework-photo/auth/upload` | POST/FormData | render submit state | generic errors | RISK |
| `apmath/js/wangji-student-management.js` | overlay API | Wangji overlay CRUD | `/api/wangji/*`, token storage | GET/POST/PATCH/DELETE | reload overlay | alert/toast | PASS |

## localStorage/sessionStorage 위험 저장

| Key | File | 내용 | 위험도 | 비고 |
|---|---|---|---|---|
| `APMATH_SESSION` | `apmath/js/core.js:51`, `archive/*.html` | teacher session token, login metadata | High | password/raw_password/pw는 저장 전 삭제하지만 bearer token은 저장 |
| `AP_SYNC_QUEUE` | `apmath/js/core.js:131`, `:550` | offline mutation payload | Medium | 학생/상담/출결 payload가 장기 저장될 수 있음 |
| `AP_TODAY_EXAM` | `dashboard.js:1937` | 오늘 시험명/문항수 | Low | 개인정보는 낮음 |
| `mixedQuestions_*`, `mixedMeta_*` | `core.js:2236`, `archive/mixer.html:2037`, `assessment-mvp.html:1657` | 시험지 출력 payload | Medium | 시험 데이터 장기 저장 |
| `AP_CLINIC_PRINT_PAYLOAD` | `clinic-print.js:583` | 클리닉 출력 payload | Medium | 학생/오답 맥락 가능 |
| report AI cache | `report.js:2151` | 리포트 분석 결과 | Medium | 학생 성적/상담 내용 포함 가능 |
| `WANGJI_EIE_SESSION_TOKEN`, role/name/login | `eie-app.js`, shared bridge | EIE bearer/session metadata | High | localStorage bearer |
| `eie.owner.dashboard.memo.*` | `eie-dashboard.js:738` | 원장 메모 | Medium | 운영 메모 local only |
| `eie-v2-zoom-boost` | `eie-timetable.js:4241` | UI setting | Low | 단순 설정 |
| `student portal session` | `apmath/student/index.html:816` | student_id, student_token, raw PIN 포함 | High | deterministic token + PIN |
| `PLANNER_SID`, `PLANNER_PIN`, `planner_pin_*` | `student/index.html:819`, `planner/index.html:1058`, `:1334` | 학생 ID/PIN | High | local/session 모두 저장, URL query도 사용 |
| `homework_photo_pin_*` | `homework/index.html:613` | 사진숙제 PIN | High | assignment/student scoped PIN |
| `WANGJI_COMMON_SESSION_TOKEN` | `wangji-student-management.js:104` | Wangji admin token | High | 12h bearer |
| Diagnostic result keys | `assessment-mvp.html:936`, `assessment-analysis.html:966` | 진단 결과/메모 | Medium | 학생명/점수 포함 가능 |

## P0 목록
- 문제 위치: `archive/engine.html:895`, `archive/engine.html:591`, `archive/engine.html:620`
  - 현재 상태: `data` query를 script src로 동적 추가하고, AP session을 localStorage/hash에서 복원
  - 왜 위험한지: 조작된 URL이 archive origin에서 임의 script를 실행해 저장된 session token을 읽을 수 있음
  - 최소 수정 대상: engine data URL allowlist/relative path 제한, hash session 전달 제거 또는 one-time token화
  - 예상 수정 난이도: 중
- 문제 위치: `apmath/js/student-edit.js:77`, `apmath/worker-backup/worker/routes/students.js:470`, `apmath/js/dashboard-admin.js:244`, `apmath/js/student-edit.js:590`
  - 현재 상태: 퇴원 저장 status와 화면 필터 status가 `퇴원`/`제적` 계열로 불일치
  - 왜 위험한지: 퇴원 처리 후 퇴원생 목록/복귀 화면에서 누락되어 운영이 막힐 수 있음
  - 최소 수정 대상: 학생 status enum 정규화, 필터 normalization, migration/호환 처리
  - 예상 수정 난이도: 중
- 문제 위치: `apmath/worker-backup/worker/routes/classes.js:93-132`, `apmath/js/management.js:386`
  - 현재 상태: 학급 삭제가 수업/배정/시험/성적 등 관련 테이블을 물리 삭제
  - 왜 위험한지: 실수로 운영 기록이 대량 삭제될 수 있음
  - 최소 수정 대상: class soft-delete/archive 전환, 삭제 전 영향도 preview
  - 예상 수정 난이도: 중상

## P1 목록
- 문제 위치: `eie/js/eie-api.js:162`
  - 현재 상태: non-auth GET 실패가 success stub/fallback으로 변환됨
  - 왜 위험한지: 서버 장애/route mismatch가 빈 데이터처럼 표시되어 저장 판단을 흐림
  - 최소 수정 대상: fallback UI 표시 강화, critical GET은 throw 유지
  - 예상 수정 난이도: 중
- 문제 위치: `eie/js/views/eie-students.js:2243`, `workers/wangji-eie-worker/routes/eie.js:1619`
  - 현재 상태: 학생 상세 출결 저장은 `timetable_cell_id` 없이 전송, backend는 cell id 요구
  - 왜 위험한지: 학생 상세 화면 출결 저장 실패
  - 최소 수정 대상: 상세 화면에서 active cell resolve 후 전송 또는 backend student/date fallback 지원
  - 예상 수정 난이도: 중
- 문제 위치: `eie/js/eie-api.js:299`, `workers/wangji-eie-worker/routes/eie.js:933`
  - 현재 상태: 연락처 삭제 API wrapper는 있으나 backend는 `EIE_NOT_IMPLEMENTED`
  - 왜 위험한지: 삭제 버튼/호환 호출이 실패
  - 최소 수정 대상: soft delete column/route 또는 UI 삭제 제거
  - 예상 수정 난이도: 중
- 문제 위치: `eie/js/apms-compat/eie-apms-api.js:57`, `workers/wangji-eie-worker/routes/eie.js:3387`
  - 현재 상태: compat layer가 timetable-cell student assignment를 미구현으로 차단
  - 왜 위험한지: APMS 복사 코드 경유 시 직접 EieApi와 다른 결과
  - 최소 수정 대상: compat route mapping 갱신
  - 예상 수정 난이도: 하
- 문제 위치: `workers/wangji-eie-worker/index.js:98`, `:149`, `routes/eie.js:3186`, `eie-management.js:170`
  - 현재 상태: disabled role 로그인은 차단하나 기존 session 검증에서 disabled를 재차단하지 않음
  - 왜 위험한지: 비활성화 직후 기존 세션이 계속 동작 가능
  - 최소 수정 대상: verify session에서 disabled role reject, updateTeacher disabled 시 sessions revoke
  - 예상 수정 난이도: 중
- 문제 위치: `apmath/student/index.html:816-822`, `planner/index.html:812-816`, `homework/index.html:613`
  - 현재 상태: 학생 PIN/token을 localStorage/sessionStorage에 저장
  - 왜 위험한지: 같은 origin XSS나 공유 PC에서 PIN 유출
  - 최소 수정 대상: sessionStorage 우선, remember 옵션, token expiry/rotation
  - 예상 수정 난이도: 중상
- 문제 위치: `homework-photo.js:550`
  - 현재 상태: file_id만 알면 R2 파일 응답. deleted/expired guard는 있음
  - 왜 위험한지: file_id 유출 시 7일 동안 bearer URL처럼 동작
  - 최소 수정 대상: signed short-lived URL 또는 student/teacher auth 확인
  - 예상 수정 난이도: 중

## P2 목록
- AP `POST /students/:id/auto-pin` backend-only: 단일 학생 PIN 자동 생성 UI 연결 후보
- AP 상담 `GET /consultations` 전체 조회가 400이고 admin은 initial-data 의존: 명시적 list route 후보
- EIE `confirmed-contacts`, `schedule-assignments` backend-only: wrapper/UI 필요성 재검토
- EIE school-grade patch/delete backend-only: `EieApi.update/deleteSchoolGradeRecord` wrapper 후보
- Archive/Assessment 결과 localStorage 저장: 서버 저장이 필요한지 정책 결정 필요
- AP/EIE 일부 상태값/문구 인코딩 깨짐: 운영 UI 신뢰도 저하

## 구현 필요 후보
- AP 학생 status enum 정규화: `재원`, `휴원`, `퇴원/제적`, `숨김`을 DB/API/UI에서 단일 기준으로 매핑
- AP 학급 삭제를 archive로 전환하고 기존 DELETE는 admin-only purge로 격하
- EIE 연락처 삭제 정책 결정 후 route/UI 일치
- EIE 출결 저장 payload에 timetable cell resolver 추가
- Student Portal/Planner/Homework PIN 저장 정책 재설계
- Archive engine script source allowlist
- EIE auth disabled-session revocation
- common API error handling에서 fallback과 진짜 빈 데이터 구분

## 다음 구현 라운드 추천 순서
1. P0 보안/운영 차단: Archive engine script 제한, AP 학생 status 정규화, AP 학급 hard delete 차단
2. 학생 핵심 CRUD 안정화: AP 퇴원/복귀 목록, PIN reset UI, EIE 학생 상세 출결, EIE 연락처 삭제 정책
3. 인증/권한: EIE disabled session revoke, student/planner/homework PIN 저장/만료 개선, homework file auth 강화
4. 상태 갱신/오류 처리: EIE GET fallback 표시, AP offline queue 개인정보 보존기간, Archive/Assessment local result 정책
5. Backend-only/Front-only 정리: auto-pin UI, EIE schedule/contacts/school-grade wrappers, AP 상담 전체 조회 route

## 확인 명령
- `git status --short`
- `rg --files`
- `rg -n "fetch\\(|api\\.(get|post|patch|put|delete)|localStorage\\.(setItem|getItem)|sessionStorage\\.(setItem|getItem)|indexedDB|FormData|sendBeacon" apmath eie archive -g "*.js" -g "*.html"`
- `rg -n "app\\.|router\\.|request\\.method|URLPattern|method ===|pathname|handle[A-Za-z]+|route" apmath/worker-backup/worker workers -g "*.js"`
- `rg -n "students|consultations|classes|attendance|homework|exam-sessions|school-exam-records|timetable|teachers|operation-memos|planner|parent-foundation|onboarding|batch-pins|restore|hide|purge|withdraw|status|deleted" apmath/worker-backup/worker/routes apmath/worker-backup/worker/index.js workers -g "*.js"`
- `rg -n "createStudent|updateStudent|deleteStudent|restoreStudent|purge|withdraw|status|student_pin|parent_phone|consultation|save|modal|신입|학생 등록|학생 수정|삭제" apmath/js eie/js -g "*.js"`
- `rg -n "EieApi\\.|localStorage\\.setItem|sessionStorage\\.setItem|fetch\\(" eie/js -g "*.js"`
- `rg -n "fetch\\(|localStorage\\.setItem|sessionStorage\\.setItem|window\\.open|print\\(|apiSend\\(|POST|PATCH|DELETE" archive apmath/student apmath/planner apmath/homework -g "*.html"`
- `rg -n "wrangler|name|main|D1|binding|database" apmath/worker-backup/worker/wrangler.jsonc workers -g "wrangler.jsonc"`
- `git diff --check`

## 건드리지 않은 항목
- 코드 수정 없음
- DB 변경 없음
- Worker 변경 없음
- UI 변경 없음
- 검수용 zip 명령 작성 없음
