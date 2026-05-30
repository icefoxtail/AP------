# EIE APMS 리베이스 Round 0 실사 보고서

## 1. 결론
- 현재 EIE 구조의 근본 문제는 학생관리와 클래스룸이 APMS의 `state.db`/`state.ui`/`api` 기반 운영 흐름을 복사하지 않고, `eie/js/eie-state.js`의 import/timetable 후보 상태와 각 view 파일 내부 로컬 배열을 원본처럼 사용한다는 점이다.
- APMS 복사 기반 리베이스가 필요하다. APMS는 `apmath/js/core.js`의 `state.db.students`, `classes`, `class_students`, `attendance`, `homework`, `consultations`, `parent_contacts`와 공통 `api.get/post/patch/delete`를 기준으로 학생관리와 클래스룸이 작동한다.
- 학생관리 우선순위는 최상위다. 현재 EIE `eie/js/views/eie-students.js`는 `_students`, `_selectedId`, `_query`, `_loaded`, `_error`만으로 목록/상세를 구성하고 신규 등록, 수정, 상태 변경, 퇴원, 상담 저장 흐름이 없다.
- 시간표/클래스룸/상담/숙제/출결은 재정렬이 필요하다. EIE 시간표는 `eie_timetable_cells`와 `eie_student_schedule_assignments`를 중심으로 유지하되, 운영 화면은 APMS의 학생 상세, 상담, 출결, 숙제, 클래스룸 저장 흐름을 EIE API adapter로 연결해야 한다.

## 2. 실제 확인한 파일
- APMS 확인 파일 목록: `apmath/index.html`, `apmath/js/core.js`, `apmath/js/student.js`, `apmath/js/classroom.js`, `apmath/js/dashboard.js`, `apmath/js/dashboard-admin.js`, `apmath/js/dashboard-teacher.js`, `apmath/css/apms-ui-foundation.css`, `apmath/css/dashboard-foundation.css`, `apmath/css/classroom-foundation.css`.
- EIE 확인 파일 목록: `eie/index.html`, `eie/css/eie.css`, `eie/js/eie-app.js`, `eie/js/eie-router.js`, `eie/js/eie-state.js`, `eie/js/eie-api.js`, `eie/js/views/eie-dashboard.js`, `eie/js/views/eie-students.js`, `eie/js/views/eie-classroom.js`, `eie/js/views/eie-timetable.js`, `eie/js/views/eie-timetable-v2.js`, `eie/js/views/eie-management.js`.
- Worker/API 확인 파일 목록: `apmath/worker-backup/worker/index.js`, `apmath/worker-backup/worker/routes/eie.js`, `apmath/worker-backup/worker/migrations/20260528_eie_round2_import_core.sql`, `apmath/worker-backup/worker/migrations/20260528_eie_round4_timetable_operations.sql`, `migrations/20260528_eie_round6_confirmed_students_contacts_assignments.sql`, `migrations/20260529_eie_seed_2604_actual_timetable.sql`, `migrations/20260529_eie_seed_2604_actual_timetable.remote_safe.sql`, `migrations/20260529_eie_seed_2604_actual_timetable.d1.remote.sql`.
- 문서 확인 파일 목록: `docs/domains/CLASSROOM_DOMAIN.md`, `docs/APMATH_CLASSROOM_MAKEUP_CHIP_POLICY.md`, `docs/guides/design/APMS_GLOBAL_UI_FOUNDATION_CLASSROOM_FIRST.md`, `docs/EIE_WORKING_RULEBOOK.md`, `docs/EIE_TIMETABLE_DATA_MODEL.md`, `docs/EIE_STUDENT_CLASSROOM_EDIT_POLICY.md`.
- 확인하지 못한 파일 목록: 없음.

## 3. APMS 학생관리 구조
- 주요 함수: `renderStudentDetail`, `renderStudentDetailTab`, `renderGradeTab`, `renderWeakTab`, `renderCnsTab`, `openAddStudent`, `handleAddStudent`, `openEditStudent`, `handleEditStudent`, `handleDelete`, `handleRestore`, `openAddConsultationModal`, `handleSaveConsultation`, `openEditConsultation`, `handleEditConsultation`, `handleDeleteConsultation`, `renderParentContactSection`, `handleSaveParentContact`, `handleEditParentContact`, `handleDeleteParentContact`, `toggleParentConsent`.
- 주요 `state.db` 의존성: `students`, `classes`, `class_students`, `exam_sessions`, `wrong_answers`, `consultations`, `parent_contacts`, `message_logs`, `student_status_history`, `class_transfer_history`, `class_daily_records`, `class_daily_progress`, `class_textbooks`.
- 주요 `state.ui` 의존성: `currentStudentDetailId`, `currentStudentDetailTab`, `currentStudentDetailSubModal`, `studentDetailLazyData`, `studentParentContactData`, `studentConsultationUi`, `modalReturnView`, `returnView`, `currentClassId`.
- 주요 API 호출: `api.get('students/{id}/detail-data')`, `api.get('consultations?student_id=...')`, `api.post('students')`, `api.patch('students/{id}')`, `api.delete('students', id)`, `api.patch('students/{id}/restore')`, `api.post('consultations')`, `api.patch('consultations/{id}')`, `api.delete('consultations', id)`, `api.get/post/patch/delete('parent-foundation/...')`, `api.post('ai/consultation-summary')`, `api.post('ai/consultation-thread-summary')`.
- 주요 화면 구조: 학생 상세 헤더, `std-badge`, 학생/보호자 연락처 2열 카드, `tab-bar`/`tab-btn` 기반 탭, 성적분석/취약단원/상담기록 탭, 상담 카드 목록, 보호자 연락처 섹션, 신규/수정 modal, 퇴원 처리 버튼.
- CSS/컴포넌트 패턴: `apms-card`, `apms-button`, `apms-button--quiet`, `apms-button--primary`, `apms-section-title`, `tab-bar`, `tab-btn`, `std-input-base`, `std-badge`, APMS 전역 modal `#modal-overlay`, `#modal-content`, toast `#toast-container`.
- EIE에 복사 가능한 부분: 학생 목록/검색/상세/탭/modal/상담/연락처/상태 변경/퇴원 처리의 화면 구조와 함수 흐름, `mergeStudentIntoState`, `mergeClassStudentIntoState`, `refreshCurrentStudentListViewAfterMutation`에 해당하는 state merge 방식.
- EIE에서 제거/비활성 처리해야 할 AP 전용 부분: `exam_sessions`, `wrong_answers`, `report_exam_cohort_stats`, `exam_blueprints`, `school_exam_records`, `high_subjects`, `AP_HIGH_SUBJECTS`, `onboarding/tasks/bootstrap`, AP Math 알림톡 리포트, 수학 단원/성적/오답 기반 화면.

## 4. EIE 학생관리 현재 구조
- 주요 함수: `getPhone`, `getGrade`, `getSelected`, `matchesQuery`, `filteredStudents`, `renderSummary`, `renderStatusBadge`, `renderDetail`, `renderList`, `EieStudentsView.render`, `setQuery`, `openDetail`, `closeDetail`.
- 로컬 상태 목록: `_students`, `_error`, `_loaded`, `_selectedId`, `_query`.
- API 호출 목록: `EieApi.resolveApiBase()`와 `EieApp.fetchWithAuth(base + '/confirmed-students')`. `EieApi.getStudentSeeds()`는 대시보드에서 호출되지만 학생관리 view는 직접 사용하지 않는다.
- APMS와 다른 부분: `state.db.students`가 없고 `EieState.db`도 없다. 학생 상세 탭, 신규 등록, 수정, 상태 변경, 퇴원, 상담, 보호자 연락처 저장 함수가 없다. 검색은 `_students`의 `display_name`, `name`, `grade`, `assignments.class_name_raw`, `assignments.teacher_name_raw`만 본다.
- 운영 앱으로 쓰기 위험한 부분: `_students`가 화면 내부 캐시라 다른 화면과 원본 데이터가 공유되지 않는다. 저장 함수가 없으므로 Worker/D1 반영 흐름이 없다. `confirmed-students` 조회 실패 시 fallback/오류 상태가 view 내부에 고정되고 공통 재동기화가 없다.
- 폐기/이식/유지 판정: `_students` 원본 구조는 폐기한다. `confirmed-students` 응답의 `contacts`, `assignments` 표시 방식은 adapter 입력 자료로 이식한다. EIE 전용 필드명(`display_name`, `grade`, `phone_raw`, `assignments`)은 유지하되 APMS 호환 state로 매핑한다.

## 5. APMS 클래스룸 구조
- 주요 함수: `renderClass`, `renderClassTopBarV4B`, `renderClassToolBarV4B`, `renderClassStudentBoardV4B`, `renderClassStudentRowV4B`, `updateClassSummaryDOM`, `updateStudentRowDOM`, `toggleAtt`, `toggleHw`, `toggleAttendanceTag`, `saveAttendanceMeta`, `loadClassroomOperationDateData`, `renderAttendanceLedger`, `loadLedger`, `openClassRecordModal`, `saveClassRecord`.
- 출결/숙제/메모 저장 흐름: `renderClass`가 `state.db.classes`, `state.db.class_students`, `state.db.students`로 학생 명단을 만들고 `state.db.attendance`, `state.db.homework`로 당일 상태를 만든다. `toggleAtt`는 `state.db.attendance` 또는 `ledgerState.attendance`를 낙관 갱신한 뒤 `api.patch('attendance', { studentId, status, date })`를 호출한다. `toggleHw`는 `state.db.homework` 또는 `ledgerState.homework`를 낙관 갱신한 뒤 `api.patch('homework', { studentId, status, date })`를 호출한다. 수업 메모/진도는 `openClassRecordModal`에서 입력하고 `saveClassRecord`가 `api.post('class-daily-records', payload)`를 호출한다.
- 보강/결석/지각 처리 구조: 출결 tag는 `renderAttendanceTagButton`, `toggleAttendanceTag`, `saveAttendanceMeta`에서 `attendance.tags`와 `attendance.memo`를 다루고 `api.patch('attendance', { studentId, date, tags, memo })`로 저장한다. 보강 표시 여부는 `dashboardHasMakeupAfter`, `attendance_history`, `academy_schedules` 조회와 연결된다.
- 학생 상태 저장 흐름: 학생 자체의 상태 변경/퇴원/복구는 `student.js`의 `handleDelete`, `handleRestore`, `handleEditStudent`가 담당한다. 클래스룸은 학생 row 표시와 출결/숙제/상담 버튼을 통해 학생 상세 및 상담 흐름으로 이동한다.
- EIE에 가져올 부분: 클래스 선택 후 학생 명단을 만들고 출결/숙제/상담/메모를 한 화면에서 빠르게 저장하는 함수 흐름, 낙관 갱신 후 실패 시 rollback하는 패턴, `ap-classroom-*`와 `cls-v4-*` 병행 CSS 연결.
- EIE에서 다르게 처리할 부분: APMS `classes`/`class_students` 대신 `eie_timetable_cells`/`eie_student_schedule_assignments` 또는 compat `classes`/`class_students` projection을 사용한다. 수학 교재/단원/플래너/시험/오답은 1차에서 숨김 또는 준비중 처리한다. `docs/APMATH_CLASSROOM_MAKEUP_CHIP_POLICY.md`의 보강 칩은 `attendance.tags`에 `makeup:progress`, `makeup:homework`, `makeup:absence`, `makeup:exam`, `makeup:other`를 저장하는 APMS 정책이므로, EIE 출결 테이블/endpoint가 생긴 뒤 동일한 tags 방식으로 이식하는 것이 맞다.

## 6. EIE 클래스룸 현재 구조
- 주요 함수: `asRows`, `sortCells`, `getAssignedStudents`, `getSelectedCell`, `getSelectedStudent`, `renderSummary`, `renderStudentDetail`, `renderCellDetail`, `renderCards`, `EieClassroomView.render`, `openDetail`, `closeDetail`, `openStudentDetail`, `closeStudentDetail`.
- 로컬 상태 목록: `_cells`, `_error`, `_loaded`, `_selectedCellId`, `_selectedStudentKey`.
- API 호출 목록: `EieApi.getTimetable(null, { status: 'active,imported' })`.
- APMS와 다른 부분: APMS 클래스룸은 `state.db.classes`와 `state.db.class_students`로 반을 열고 `state.db.attendance`/`homework`를 저장한다. EIE 클래스룸은 `eie_timetable_cells` 목록 카드와 `assigned_students` 표시만 있고 출결, 숙제, 상담, 수업 메모 저장 함수가 없다.
- 운영 앱으로 쓰기 위험한 부분: `_cells`가 화면 내부 캐시이며 저장 후 공통 state에 반영하는 흐름이 없다. `assigned_students`는 Worker의 `attachAssignedStudents` 조회 결과를 표시할 뿐, 학생 상태/출결/숙제/상담의 D1 저장 경로가 없다.
- 폐기/이식/유지 판정: 카드형 수업 목록은 APMS parity 목표와 맞지 않아 폐기한다. `EieApi.getTimetable`와 `assigned_students` 응답 구조는 compat layer의 원천 데이터로 유지한다. APMS `renderClass`형 운영 화면을 EIE용 adapter로 이식한다.

## 7. EIE API/Worker 상태
- `EieApi`에 이미 있는 함수: `resolveApiBase`, `getLatestImport`, `getImport`, `getTimetable`, `getStudentSeeds`, `getContactSeeds`, `getNeedsReview`, `createImport`, `createTimetableCell`, `updateTimetableCell`, `updateTimetableCellStatus`, `confirmStudentCandidate`, `getStudents`, `createStudent`, `updateStudent`, `updateStudentStatus`, `assignStudentToCell`, `removeStudentFromCell`.
- Worker에 실제 있는 endpoint: `GET /api/eie/import/latest`, `GET /api/eie/import/{id}`, `GET /api/eie/import/{id}/timetable-cells`, `GET /api/eie/import/{id}/student-seeds`, `GET /api/eie/import/{id}/contact-seeds`, `GET /api/eie/import/{id}/needs-review`, `GET /api/eie/confirmed-students`, `GET /api/eie/confirmed-contacts`, `GET /api/eie/schedule-assignments`, `GET /api/eie/timetable`, `GET /api/eie/student-seeds`, `GET /api/eie/contact-seeds`, `GET /api/eie/needs-review`, `POST /api/eie/import`, `POST /api/eie/confirm-candidate`, `POST /api/eie/timetable-cells`, `PATCH /api/eie/timetable-cells/{id}`, `PATCH /api/eie/timetable-cells/{id}/status`.
- 없는 endpoint: EIE frontend `EieApi.createStudent`, `updateStudent`, `updateStudentStatus`, `assignStudentToCell`, `removeStudentFromCell`가 호출하려는 Worker endpoint는 `routes/eie.js`에 아직 없다. 누락된 실제 endpoint는 `POST /api/eie/students`, `PATCH /api/eie/students/{id}`, `PATCH /api/eie/students/{id}/status`, EIE 퇴원/archive endpoint, EIE 연락처 직접 `POST/PATCH/DELETE` endpoint, `POST /api/eie/timetable-cells/{id}/students`, `DELETE /api/eie/timetable-cells/{id}/students/{sid}`, EIE 수업 배정 이동 endpoint, EIE 상담 `GET/POST/PATCH/DELETE` endpoint, EIE 출결 저장 endpoint, EIE 숙제 저장 endpoint, EIE classroom log/class-daily 저장 endpoint다.
- 인증/Unauthorized 관련 위험: `apmath/worker-backup/worker/index.js`는 `/api/eie`에서 `verifyAuth`를 먼저 실행하고 없으면 401을 반환한다. `routes/eie.js`는 `isEieOwner`로 `teacher.role === 'admin'`만 허용하고 아니면 403을 반환한다. EIE frontend의 `findStoredAuthHeader`는 여러 localStorage key를 찾지만 세션 key가 없으면 Worker에서 401이 된다.
- D1 스키마와 연결 가능성: `migrations/20260528_eie_round6_confirmed_students_contacts_assignments.sql`에는 `eie_students`, `eie_student_contacts`, `eie_student_schedule_assignments`가 있다. `apmath/worker-backup/worker/routes/eie.js`의 `queryConfirmedStudents`, `queryConfirmedContacts`, `queryScheduleAssignments`, `confirm-candidate`, `attachAssignedStudents`는 이 테이블을 사용한다. 출결/숙제/상담/classroom log용 EIE 테이블은 확인된 migration에 없다.

## 8. 근본 원인
- EIE가 import 후보 확인 화면으로 출발한 흔적: `docs/EIE_WORKING_RULEBOOK.md`는 Round 1/5에서 학생 후보, 전화번호 후보, timetable cell staging을 다루고 classroom sessions, attendance, homework, memo를 보류한다고 적고 있다. 같은 문서의 2026-05-29 보정은 "대시보드, 학생관리, 클래스룸은 APMS 구조를 택갈이하는 방향을 우선"한다고 정정한다. `eie/js/eie-state.js`는 여전히 `latestImport`, `timetableCells`, `studentSeeds`, `contactSeeds`, `needsReview`, `selectedStudentCandidate` 중심이다.
- APMS 공통 상태와 분리된 문제: APMS는 `state.db`와 `state.ui`가 원본이고 화면 함수가 이를 읽는다. EIE는 `EieState`에 `db` 하위 구조가 없고, 학생/클래스룸 view가 `_students`, `_cells`를 별도 원본처럼 사용한다.
- 화면별 로컬 상태가 원본처럼 쓰이는 문제: `eie-students.js`와 `eie-classroom.js` 모두 `_loaded` 이후 외부 동기화 없이 내부 배열을 재사용한다.
- 저장 흐름이 일관되지 않은 문제: APMS는 `api` 호출 성공 후 state merge 또는 `loadData`/`refreshDataOnly`로 동기화한다. EIE는 시간표 cell 생성/수정과 후보 confirm 외의 운영 저장 API가 없다.

## 9. 리베이스 필요 범위
- 반드시 갈아엎을 것: `eie/js/views/eie-students.js`의 로컬 원본 구조, `eie/js/views/eie-classroom.js`의 카드 확인 구조, EIE 학생 상세/클래스룸의 독립 CSS 컴포넌트 중심 화면 흐름. `docs/EIE_STUDENT_CLASSROOM_EDIT_POLICY.md`도 학생관리와 클래스룸 학생상세를 수정 가능한 운영 화면으로 만들고 필드·UX·운영 흐름을 AP Math 기준으로 맞춘다고 규정한다.
- 유지할 것: `eie_timetable_cells`, `eie_students`, `eie_student_contacts`, `eie_student_schedule_assignments`, `EieApi.resolveApiBase`, EIE auth header 탐색, `GET /api/eie/confirmed-students`, `GET /api/eie/timetable`, `assigned_students` 응답.
- 보류할 것: 시간표 v2 편집, 수업 이동/복사/종료 UI, AI 상담, 리포트, 시험/성적, 수납, 복잡한 보호자 동의, 수학 교재/단원/오답 기능.
- 폐기할 것: EIE 학생관리에서 `_students`를 원본으로 확정하는 구조, EIE 클래스룸에서 `_cells` 카드만으로 운영 화면을 대신하는 구조, Worker/D1 없이 화면 내부에서만 완료 처리하는 저장 방식.

## 10. 다음 구현 라운드 제안
- Round 1: EIE 공통 `EieState.db`/`EieState.ui`와 `EieApi` adapter를 만든다. `confirmed-students`, `timetable`, `schedule-assignments`를 APMS 호환 `students`, `classes`, `class_students` projection으로 적재한다.
- Round 2: EIE 학생관리를 APMS `student.js` 화면 구조 기반으로 이식한다. 신규/수정/상태/archive endpoint가 없으므로 Worker endpoint를 먼저 만들거나 저장 버튼은 준비중 처리한다.
- Round 3: 상담/연락처/메모를 APMS 상담 탭 구조로 이식한다. EIE 전용 상담/연락처 endpoint와 D1 테이블을 추가 설계한다.
- Round 4: 클래스룸/출결/숙제를 APMS `renderClass`, `toggleAtt`, `toggleHw`, `saveClassRecord` 흐름으로 이식한다. EIE 출결/숙제/classroom log endpoint가 필요하다.
- Round 5: 시간표 v2와 학생관리/클래스룸을 연결한다. 학생 상세에서 배정 수업, 시간표 학생명에서 학생 상세, 클래스룸 학생명에서 학생 상세로 이동하게 한다.

## 11. 시간표 v2 추가 확인
- `eie/js/eie-router.js`에는 `timetable-v2: () => EieTimetableV2View.render()` route가 있다.
- `eie/index.html`은 `eie/js/views/eie-timetable-v2.js`를 `eie-timetable.js` 다음, 학생/클래스룸 view 이전에 로드한다.
- `eie/js/views/eie-timetable-v2.js`는 `EieApi.getTimetable(null, { status: 'active,imported,needs_review,hidden' })`로 row를 불러오고 `EieState.setTimetableCells(rows)`에 적재한다.
- 시간표 v2는 `buildDisplaySessions`, `renderBoard`, `renderSelectedPanel`, `renderStudentNames`로 표시 세션을 만들며, 학생 버튼은 `EieStudentsView.openDetail(studentId)` 또는 `EieStudentsView.setQuery(studentName)`로 연결하고 클래스룸 버튼은 `EieClassroomView.openDetail(cellId)`로 연결한다.
- 이 연결은 navigation 자리까지 존재하지만, 학생 상세/클래스룸 자체가 아직 APMS parity가 아니므로 Round 5 완료 상태로 볼 수 없다.
