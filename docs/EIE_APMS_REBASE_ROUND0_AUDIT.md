# EIE APMS 由щ쿋?댁뒪 Round 0 ?ㅼ궗 蹂닿퀬??

## 1. 寃곕줎
- ?꾩옱 EIE 援ъ“??洹쇰낯 臾몄젣???숈깮愿由ъ? ?대옒?ㅻ８??APMS??`state.db`/`state.ui`/`api` 湲곕컲 ?댁쁺 ?먮쫫??蹂듭궗?섏? ?딄퀬, `eie/js/eie-state.js`??import/timetable ?꾨낫 ?곹깭? 媛?view ?뚯씪 ?대? 濡쒖뺄 諛곗뿴???먮낯泥섎읆 ?ъ슜?쒕떎???먯씠??
- APMS 蹂듭궗 湲곕컲 由щ쿋?댁뒪媛 ?꾩슂?섎떎. APMS??`apmath/js/core.js`??`state.db.students`, `classes`, `class_students`, `attendance`, `homework`, `consultations`, `parent_contacts`? 怨듯넻 `api.get/post/patch/delete`瑜?湲곗??쇰줈 ?숈깮愿由ъ? ?대옒?ㅻ８???묐룞?쒕떎.
- ?숈깮愿由??곗꽑?쒖쐞??理쒖긽?꾨떎. ?꾩옱 EIE `eie/js/views/eie-students.js`??`_students`, `_selectedId`, `_query`, `_loaded`, `_error`留뚯쑝濡?紐⑸줉/?곸꽭瑜?援ъ꽦?섍퀬 ?좉퇋 ?깅줉, ?섏젙, ?곹깭 蹂寃? ?댁썝, ?곷떞 ????먮쫫???녿떎.
- ?쒓컙???대옒?ㅻ８/?곷떞/?숈젣/異쒓껐? ?ъ젙?ъ씠 ?꾩슂?섎떎. EIE ?쒓컙?쒕뒗 `eie_timetable_cells`? `eie_student_schedule_assignments`瑜?以묒떖?쇰줈 ?좎??섎릺, ?댁쁺 ?붾㈃? APMS???숈깮 ?곸꽭, ?곷떞, 異쒓껐, ?숈젣, ?대옒?ㅻ８ ????먮쫫??EIE API adapter濡??곌껐?댁빞 ?쒕떎.

## 2. ?ㅼ젣 ?뺤씤???뚯씪
- APMS ?뺤씤 ?뚯씪 紐⑸줉: `apmath/index.html`, `apmath/js/core.js`, `apmath/js/student.js`, `apmath/js/classroom.js`, `apmath/js/dashboard.js`, `apmath/js/dashboard-admin.js`, `apmath/js/dashboard-teacher.js`, `apmath/css/apms-ui-foundation.css`, `apmath/css/dashboard-foundation.css`, `apmath/css/classroom-foundation.css`.
- EIE ?뺤씤 ?뚯씪 紐⑸줉: `eie/index.html`, `eie/css/eie.css`, `eie/js/eie-app.js`, `eie/js/eie-router.js`, `eie/js/eie-state.js`, `eie/js/eie-api.js`, `eie/js/views/eie-dashboard.js`, `eie/js/views/eie-students.js`, `eie/js/views/eie-classroom.js`, `eie/js/views/eie-timetable.js`, `eie/js/views/eie-timetable.js`, `eie/js/views/eie-management.js`.
- Worker/API ?뺤씤 ?뚯씪 紐⑸줉: `apmath/worker-backup/worker/index.js`, `apmath/worker-backup/worker/routes/eie.js`, `apmath/worker-backup/worker/migrations/20260528_eie_round2_import_core.sql`, `apmath/worker-backup/worker/migrations/20260528_eie_round4_timetable_operations.sql`, `migrations/20260528_eie_round6_confirmed_students_contacts_assignments.sql`, `migrations/20260529_eie_seed_2604_actual_timetable.sql`, `migrations/20260529_eie_seed_2604_actual_timetable.remote_safe.sql`, `migrations/20260529_eie_seed_2604_actual_timetable.d1.remote.sql`.
- 臾몄꽌 ?뺤씤 ?뚯씪 紐⑸줉: `docs/domains/CLASSROOM_DOMAIN.md`, `docs/APMATH_CLASSROOM_MAKEUP_CHIP_POLICY.md`, `docs/guides/design/APMS_GLOBAL_UI_FOUNDATION_CLASSROOM_FIRST.md`, `docs/EIE_WORKING_RULEBOOK.md`, `docs/EIE_TIMETABLE_DATA_MODEL.md`, `docs/EIE_STUDENT_CLASSROOM_EDIT_POLICY.md`.
- ?뺤씤?섏? 紐삵븳 ?뚯씪 紐⑸줉: ?놁쓬.

## 3. APMS ?숈깮愿由?援ъ“
- 二쇱슂 ?⑥닔: `renderStudentDetail`, `renderStudentDetailTab`, `renderGradeTab`, `renderWeakTab`, `renderCnsTab`, `openAddStudent`, `handleAddStudent`, `openEditStudent`, `handleEditStudent`, `handleDelete`, `handleRestore`, `openAddConsultationModal`, `handleSaveConsultation`, `openEditConsultation`, `handleEditConsultation`, `handleDeleteConsultation`, `renderParentContactSection`, `handleSaveParentContact`, `handleEditParentContact`, `handleDeleteParentContact`, `toggleParentConsent`.
- 二쇱슂 `state.db` ?섏〈?? `students`, `classes`, `class_students`, `exam_sessions`, `wrong_answers`, `consultations`, `parent_contacts`, `message_logs`, `student_status_history`, `class_transfer_history`, `class_daily_records`, `class_daily_progress`, `class_textbooks`.
- 二쇱슂 `state.ui` ?섏〈?? `currentStudentDetailId`, `currentStudentDetailTab`, `currentStudentDetailSubModal`, `studentDetailLazyData`, `studentParentContactData`, `studentConsultationUi`, `modalReturnView`, `returnView`, `currentClassId`.
- 二쇱슂 API ?몄텧: `api.get('students/{id}/detail-data')`, `api.get('consultations?student_id=...')`, `api.post('students')`, `api.patch('students/{id}')`, `api.delete('students', id)`, `api.patch('students/{id}/restore')`, `api.post('consultations')`, `api.patch('consultations/{id}')`, `api.delete('consultations', id)`, `api.get/post/patch/delete('parent-foundation/...')`, `api.post('ai/consultation-summary')`, `api.post('ai/consultation-thread-summary')`.
- 二쇱슂 ?붾㈃ 援ъ“: ?숈깮 ?곸꽭 ?ㅻ뜑, `std-badge`, ?숈깮/蹂댄샇???곕씫泥?2??移대뱶, `tab-bar`/`tab-btn` 湲곕컲 ?? ?깆쟻遺꾩꽍/痍⑥빟?⑥썝/?곷떞湲곕줉 ?? ?곷떞 移대뱶 紐⑸줉, 蹂댄샇???곕씫泥??뱀뀡, ?좉퇋/?섏젙 modal, ?댁썝 泥섎━ 踰꾪듉.
- CSS/而댄룷?뚰듃 ?⑦꽩: `apms-card`, `apms-button`, `apms-button--quiet`, `apms-button--primary`, `apms-section-title`, `tab-bar`, `tab-btn`, `std-input-base`, `std-badge`, APMS ?꾩뿭 modal `#modal-overlay`, `#modal-content`, toast `#toast-container`.
- EIE??蹂듭궗 媛?ν븳 遺遺? ?숈깮 紐⑸줉/寃???곸꽭/??modal/?곷떞/?곕씫泥??곹깭 蹂寃??댁썝 泥섎━???붾㈃ 援ъ“? ?⑥닔 ?먮쫫, `mergeStudentIntoState`, `mergeClassStudentIntoState`, `refreshCurrentStudentListViewAfterMutation`???대떦?섎뒗 state merge 諛⑹떇.
- EIE?먯꽌 ?쒓굅/鍮꾪솢??泥섎━?댁빞 ??AP ?꾩슜 遺遺? `exam_sessions`, `wrong_answers`, `report_exam_cohort_stats`, `exam_blueprints`, `school_exam_records`, `high_subjects`, `AP_HIGH_SUBJECTS`, `onboarding/tasks/bootstrap`, AP Math ?뚮┝??由ы룷?? ?섑븰 ?⑥썝/?깆쟻/?ㅻ떟 湲곕컲 ?붾㈃.

## 4. EIE ?숈깮愿由??꾩옱 援ъ“
- 二쇱슂 ?⑥닔: `getPhone`, `getGrade`, `getSelected`, `matchesQuery`, `filteredStudents`, `renderSummary`, `renderStatusBadge`, `renderDetail`, `renderList`, `EieStudentsView.render`, `setQuery`, `openDetail`, `closeDetail`.
- 濡쒖뺄 ?곹깭 紐⑸줉: `_students`, `_error`, `_loaded`, `_selectedId`, `_query`.
- API ?몄텧 紐⑸줉: `EieApi.resolveApiBase()`? `EieApp.fetchWithAuth(base + '/confirmed-students')`. `EieApi.getStudentSeeds()`????쒕낫?쒖뿉???몄텧?섏?留??숈깮愿由?view??吏곸젒 ?ъ슜?섏? ?딅뒗??
- APMS? ?ㅻⅨ 遺遺? `state.db.students`媛 ?녾퀬 `EieState.db`???녿떎. ?숈깮 ?곸꽭 ?? ?좉퇋 ?깅줉, ?섏젙, ?곹깭 蹂寃? ?댁썝, ?곷떞, 蹂댄샇???곕씫泥?????⑥닔媛 ?녿떎. 寃?됱? `_students`??`display_name`, `name`, `grade`, `assignments.class_name_raw`, `assignments.teacher_name_raw`留?蹂몃떎.
- ?댁쁺 ?깆쑝濡??곌린 ?꾪뿕??遺遺? `_students`媛 ?붾㈃ ?대? 罹먯떆???ㅻⅨ ?붾㈃怨??먮낯 ?곗씠?곌? 怨듭쑀?섏? ?딅뒗?? ????⑥닔媛 ?놁쑝誘濡?Worker/D1 諛섏쁺 ?먮쫫???녿떎. `confirmed-students` 議고쉶 ?ㅽ뙣 ??fallback/?ㅻ쪟 ?곹깭媛 view ?대???怨좎젙?섍퀬 怨듯넻 ?щ룞湲고솕媛 ?녿떎.
- ?먭린/?댁떇/?좎? ?먯젙: `_students` ?먮낯 援ъ“???먭린?쒕떎. `confirmed-students` ?묐떟??`contacts`, `assignments` ?쒖떆 諛⑹떇? adapter ?낅젰 ?먮즺濡??댁떇?쒕떎. EIE ?꾩슜 ?꾨뱶紐?`display_name`, `grade`, `phone_raw`, `assignments`)? ?좎??섎릺 APMS ?명솚 state濡?留ㅽ븨?쒕떎.

## 5. APMS ?대옒?ㅻ８ 援ъ“
- 二쇱슂 ?⑥닔: `renderClass`, `renderClassTopBarV4B`, `renderClassToolBarV4B`, `renderClassStudentBoardV4B`, `renderClassStudentRowV4B`, `updateClassSummaryDOM`, `updateStudentRowDOM`, `toggleAtt`, `toggleHw`, `toggleAttendanceTag`, `saveAttendanceMeta`, `loadClassroomOperationDateData`, `renderAttendanceLedger`, `loadLedger`, `openClassRecordModal`, `saveClassRecord`.
- 異쒓껐/?숈젣/硫붾え ????먮쫫: `renderClass`媛 `state.db.classes`, `state.db.class_students`, `state.db.students`濡??숈깮 紐낅떒??留뚮뱾怨?`state.db.attendance`, `state.db.homework`濡??뱀씪 ?곹깭瑜?留뚮뱺?? `toggleAtt`??`state.db.attendance` ?먮뒗 `ledgerState.attendance`瑜??숆? 媛깆떊????`api.patch('attendance', { studentId, status, date })`瑜??몄텧?쒕떎. `toggleHw`??`state.db.homework` ?먮뒗 `ledgerState.homework`瑜??숆? 媛깆떊????`api.patch('homework', { studentId, status, date })`瑜??몄텧?쒕떎. ?섏뾽 硫붾え/吏꾨룄??`openClassRecordModal`?먯꽌 ?낅젰?섍퀬 `saveClassRecord`媛 `api.post('class-daily-records', payload)`瑜??몄텧?쒕떎.
- 蹂닿컯/寃곗꽍/吏媛?泥섎━ 援ъ“: 異쒓껐 tag??`renderAttendanceTagButton`, `toggleAttendanceTag`, `saveAttendanceMeta`?먯꽌 `attendance.tags`? `attendance.memo`瑜??ㅻ（怨?`api.patch('attendance', { studentId, date, tags, memo })`濡???ν븳?? 蹂닿컯 ?쒖떆 ?щ???`dashboardHasMakeupAfter`, `attendance_history`, `academy_schedules` 議고쉶? ?곌껐?쒕떎.
- ?숈깮 ?곹깭 ????먮쫫: ?숈깮 ?먯껜???곹깭 蹂寃??댁썝/蹂듦뎄??`student.js`??`handleDelete`, `handleRestore`, `handleEditStudent`媛 ?대떦?쒕떎. ?대옒?ㅻ８? ?숈깮 row ?쒖떆? 異쒓껐/?숈젣/?곷떞 踰꾪듉???듯빐 ?숈깮 ?곸꽭 諛??곷떞 ?먮쫫?쇰줈 ?대룞?쒕떎.
- EIE??媛?몄삱 遺遺? ?대옒???좏깮 ???숈깮 紐낅떒??留뚮뱾怨?異쒓껐/?숈젣/?곷떞/硫붾え瑜????붾㈃?먯꽌 鍮좊Ⅴ寃???ν븯???⑥닔 ?먮쫫, ?숆? 媛깆떊 ???ㅽ뙣 ??rollback?섎뒗 ?⑦꽩, `ap-classroom-*`? `cls-v4-*` 蹂묓뻾 CSS ?곌껐.
- EIE?먯꽌 ?ㅻⅤ寃?泥섎━??遺遺? APMS `classes`/`class_students` ???`eie_timetable_cells`/`eie_student_schedule_assignments` ?먮뒗 compat `classes`/`class_students` projection???ъ슜?쒕떎. ?섑븰 援먯옱/?⑥썝/?뚮옒???쒗뿕/?ㅻ떟? 1李⑥뿉???④? ?먮뒗 以鍮꾩쨷 泥섎━?쒕떎. `docs/APMATH_CLASSROOM_MAKEUP_CHIP_POLICY.md`??蹂닿컯 移⑹? `attendance.tags`??`makeup:progress`, `makeup:homework`, `makeup:absence`, `makeup:exam`, `makeup:other`瑜???ν븯??APMS ?뺤콉?대?濡? EIE 異쒓껐 ?뚯씠釉?endpoint媛 ?앷릿 ???숈씪??tags 諛⑹떇?쇰줈 ?댁떇?섎뒗 寃껋씠 留욌떎.

## 6. EIE ?대옒?ㅻ８ ?꾩옱 援ъ“
- 二쇱슂 ?⑥닔: `asRows`, `sortCells`, `getAssignedStudents`, `getSelectedCell`, `getSelectedStudent`, `renderSummary`, `renderStudentDetail`, `renderCellDetail`, `renderCards`, `EieClassroomView.render`, `openDetail`, `closeDetail`, `openStudentDetail`, `closeStudentDetail`.
- 濡쒖뺄 ?곹깭 紐⑸줉: `_cells`, `_error`, `_loaded`, `_selectedCellId`, `_selectedStudentKey`.
- API ?몄텧 紐⑸줉: `EieApi.getTimetable(null, { status: 'active,imported' })`.
- APMS? ?ㅻⅨ 遺遺? APMS ?대옒?ㅻ８? `state.db.classes`? `state.db.class_students`濡?諛섏쓣 ?닿퀬 `state.db.attendance`/`homework`瑜???ν븳?? EIE ?대옒?ㅻ８? `eie_timetable_cells` 紐⑸줉 移대뱶? `assigned_students` ?쒖떆留??덇퀬 異쒓껐, ?숈젣, ?곷떞, ?섏뾽 硫붾え ????⑥닔媛 ?녿떎.
- ?댁쁺 ?깆쑝濡??곌린 ?꾪뿕??遺遺? `_cells`媛 ?붾㈃ ?대? 罹먯떆?대ŉ ?????怨듯넻 state??諛섏쁺?섎뒗 ?먮쫫???녿떎. `assigned_students`??Worker??`attachAssignedStudents` 議고쉶 寃곌낵瑜??쒖떆??肉? ?숈깮 ?곹깭/異쒓껐/?숈젣/?곷떞??D1 ???寃쎈줈媛 ?녿떎.
- ?먭린/?댁떇/?좎? ?먯젙: 移대뱶???섏뾽 紐⑸줉? APMS parity 紐⑺몴? 留욎? ?딆븘 ?먭린?쒕떎. `EieApi.getTimetable`? `assigned_students` ?묐떟 援ъ“??compat layer???먯쿇 ?곗씠?곕줈 ?좎??쒕떎. APMS `renderClass`???댁쁺 ?붾㈃??EIE??adapter濡??댁떇?쒕떎.

## 7. EIE API/Worker ?곹깭
- `EieApi`???대? ?덈뒗 ?⑥닔: `resolveApiBase`, `getLatestImport`, `getImport`, `getTimetable`, `getStudentSeeds`, `getContactSeeds`, `getNeedsReview`, `createImport`, `createTimetableCell`, `updateTimetableCell`, `updateTimetableCellStatus`, `confirmStudentCandidate`, `getStudents`, `createStudent`, `updateStudent`, `updateStudentStatus`, `assignStudentToCell`, `removeStudentFromCell`.
- Worker???ㅼ젣 ?덈뒗 endpoint: `GET /api/eie/import/latest`, `GET /api/eie/import/{id}`, `GET /api/eie/import/{id}/timetable-cells`, `GET /api/eie/import/{id}/student-seeds`, `GET /api/eie/import/{id}/contact-seeds`, `GET /api/eie/import/{id}/needs-review`, `GET /api/eie/confirmed-students`, `GET /api/eie/confirmed-contacts`, `GET /api/eie/schedule-assignments`, `GET /api/eie/timetable`, `GET /api/eie/student-seeds`, `GET /api/eie/contact-seeds`, `GET /api/eie/needs-review`, `POST /api/eie/import`, `POST /api/eie/confirm-candidate`, `POST /api/eie/timetable-cells`, `PATCH /api/eie/timetable-cells/{id}`, `PATCH /api/eie/timetable-cells/{id}/status`.
- ?녿뒗 endpoint: EIE frontend `EieApi.createStudent`, `updateStudent`, `updateStudentStatus`, `assignStudentToCell`, `removeStudentFromCell`媛 ?몄텧?섎젮??Worker endpoint??`routes/eie.js`???꾩쭅 ?녿떎. ?꾨씫???ㅼ젣 endpoint??`POST /api/eie/students`, `PATCH /api/eie/students/{id}`, `PATCH /api/eie/students/{id}/status`, EIE ?댁썝/archive endpoint, EIE ?곕씫泥?吏곸젒 `POST/PATCH/DELETE` endpoint, `POST /api/eie/timetable-cells/{id}/students`, `DELETE /api/eie/timetable-cells/{id}/students/{sid}`, EIE ?섏뾽 諛곗젙 ?대룞 endpoint, EIE ?곷떞 `GET/POST/PATCH/DELETE` endpoint, EIE 異쒓껐 ???endpoint, EIE ?숈젣 ???endpoint, EIE classroom log/class-daily ???endpoint??
- ?몄쬆/Unauthorized 愿???꾪뿕: `apmath/worker-backup/worker/index.js`??`/api/eie`?먯꽌 `verifyAuth`瑜?癒쇱? ?ㅽ뻾?섍퀬 ?놁쑝硫?401??諛섑솚?쒕떎. `routes/eie.js`??`isEieOwner`濡?`teacher.role === 'admin'`留??덉슜?섍퀬 ?꾨땲硫?403??諛섑솚?쒕떎. EIE frontend??`findStoredAuthHeader`???щ윭 localStorage key瑜?李얠?留??몄뀡 key媛 ?놁쑝硫?Worker?먯꽌 401???쒕떎.
- D1 ?ㅽ궎留덉? ?곌껐 媛?μ꽦: `migrations/20260528_eie_round6_confirmed_students_contacts_assignments.sql`?먮뒗 `eie_students`, `eie_student_contacts`, `eie_student_schedule_assignments`媛 ?덈떎. `apmath/worker-backup/worker/routes/eie.js`??`queryConfirmedStudents`, `queryConfirmedContacts`, `queryScheduleAssignments`, `confirm-candidate`, `attachAssignedStudents`?????뚯씠釉붿쓣 ?ъ슜?쒕떎. 異쒓껐/?숈젣/?곷떞/classroom log??EIE ?뚯씠釉붿? ?뺤씤??migration???녿떎.

## 8. 洹쇰낯 ?먯씤
- EIE媛 import ?꾨낫 ?뺤씤 ?붾㈃?쇰줈 異쒕컻???붿쟻: `docs/EIE_WORKING_RULEBOOK.md`??Round 1/5?먯꽌 ?숈깮 ?꾨낫, ?꾪솕踰덊샇 ?꾨낫, timetable cell staging???ㅻ（怨?classroom sessions, attendance, homework, memo瑜?蹂대쪟?쒕떎怨??곴퀬 ?덈떎. 媛숈? 臾몄꽌??2026-05-29 蹂댁젙? "??쒕낫?? ?숈깮愿由? ?대옒?ㅻ８? APMS 援ъ“瑜??앷컝?댄븯??諛⑺뼢???곗꽑"?쒕떎怨??뺤젙?쒕떎. `eie/js/eie-state.js`???ъ쟾??`latestImport`, `timetableCells`, `studentSeeds`, `contactSeeds`, `needsReview`, `selectedStudentCandidate` 以묒떖?대떎.
- APMS 怨듯넻 ?곹깭? 遺꾨━??臾몄젣: APMS??`state.db`? `state.ui`媛 ?먮낯?닿퀬 ?붾㈃ ?⑥닔媛 ?대? ?쎈뒗?? EIE??`EieState`??`db` ?섏쐞 援ъ“媛 ?녾퀬, ?숈깮/?대옒?ㅻ８ view媛 `_students`, `_cells`瑜?蹂꾨룄 ?먮낯泥섎읆 ?ъ슜?쒕떎.
- ?붾㈃蹂?濡쒖뺄 ?곹깭媛 ?먮낯泥섎읆 ?곗씠??臾몄젣: `eie-students.js`? `eie-classroom.js` 紐⑤몢 `_loaded` ?댄썑 ?몃? ?숆린???놁씠 ?대? 諛곗뿴???ъ궗?⑺븳??
- ????먮쫫???쇨??섏? ?딆? 臾몄젣: APMS??`api` ?몄텧 ?깃났 ??state merge ?먮뒗 `loadData`/`refreshDataOnly`濡??숆린?뷀븳?? EIE???쒓컙??cell ?앹꽦/?섏젙怨??꾨낫 confirm ?몄쓽 ?댁쁺 ???API媛 ?녿떎.

## 9. 由щ쿋?댁뒪 ?꾩슂 踰붿쐞
- 諛섎뱶??媛덉븘?롮쓣 寃? `eie/js/views/eie-students.js`??濡쒖뺄 ?먮낯 援ъ“, `eie/js/views/eie-classroom.js`??移대뱶 ?뺤씤 援ъ“, EIE ?숈깮 ?곸꽭/?대옒?ㅻ８???낅┰ CSS 而댄룷?뚰듃 以묒떖 ?붾㈃ ?먮쫫. `docs/EIE_STUDENT_CLASSROOM_EDIT_POLICY.md`???숈깮愿由ъ? ?대옒?ㅻ８ ?숈깮?곸꽭瑜??섏젙 媛?ν븳 ?댁쁺 ?붾㈃?쇰줈 留뚮뱾怨??꾨뱶쨌UX쨌?댁쁺 ?먮쫫??AP Math 湲곗??쇰줈 留욎텣?ㅺ퀬 洹쒖젙?쒕떎.
- ?좎???寃? `eie_timetable_cells`, `eie_students`, `eie_student_contacts`, `eie_student_schedule_assignments`, `EieApi.resolveApiBase`, EIE auth header ?먯깋, `GET /api/eie/confirmed-students`, `GET /api/eie/timetable`, `assigned_students` ?묐떟.
- 蹂대쪟??寃? ?쒓컙??v2 ?몄쭛, ?섏뾽 ?대룞/蹂듭궗/醫낅즺 UI, AI ?곷떞, 由ы룷?? ?쒗뿕/?깆쟻, ?섎궔, 蹂듭옟??蹂댄샇???숈쓽, ?섑븰 援먯옱/?⑥썝/?ㅻ떟 湲곕뒫.
- ?먭린??寃? EIE ?숈깮愿由ъ뿉??`_students`瑜??먮낯?쇰줈 ?뺤젙?섎뒗 援ъ“, EIE ?대옒?ㅻ８?먯꽌 `_cells` 移대뱶留뚯쑝濡??댁쁺 ?붾㈃????좏븯??援ъ“, Worker/D1 ?놁씠 ?붾㈃ ?대??먯꽌留??꾨즺 泥섎━?섎뒗 ???諛⑹떇.

## 10. ?ㅼ쓬 援ы쁽 ?쇱슫???쒖븞
- Round 1: EIE 怨듯넻 `EieState.db`/`EieState.ui`? `EieApi` adapter瑜?留뚮뱺?? `confirmed-students`, `timetable`, `schedule-assignments`瑜?APMS ?명솚 `students`, `classes`, `class_students` projection?쇰줈 ?곸옱?쒕떎.
- Round 2: EIE ?숈깮愿由щ? APMS `student.js` ?붾㈃ 援ъ“ 湲곕컲?쇰줈 ?댁떇?쒕떎. ?좉퇋/?섏젙/?곹깭/archive endpoint媛 ?놁쑝誘濡?Worker endpoint瑜?癒쇱? 留뚮뱾嫄곕굹 ???踰꾪듉? 以鍮꾩쨷 泥섎━?쒕떎.
- Round 3: ?곷떞/?곕씫泥?硫붾え瑜?APMS ?곷떞 ??援ъ“濡??댁떇?쒕떎. EIE ?꾩슜 ?곷떞/?곕씫泥?endpoint? D1 ?뚯씠釉붿쓣 異붽? ?ㅺ퀎?쒕떎.
- Round 4: ?대옒?ㅻ８/異쒓껐/?숈젣瑜?APMS `renderClass`, `toggleAtt`, `toggleHw`, `saveClassRecord` ?먮쫫?쇰줈 ?댁떇?쒕떎. EIE 異쒓껐/?숈젣/classroom log endpoint媛 ?꾩슂?섎떎.
- Round 5: ?쒓컙??v2? ?숈깮愿由??대옒?ㅻ８???곌껐?쒕떎. ?숈깮 ?곸꽭?먯꽌 諛곗젙 ?섏뾽, ?쒓컙???숈깮紐낆뿉???숈깮 ?곸꽭, ?대옒?ㅻ８ ?숈깮紐낆뿉???숈깮 ?곸꽭濡??대룞?섍쾶 ?쒕떎.

## 11. ?쒓컙??v2 異붽? ?뺤씤
- `eie/js/eie-router.js`?먮뒗 `timetable: () => EieTimetableView.render()` route媛 ?덈떎.
- `eie/index.html`? `eie/js/views/eie-timetable.js`瑜?`eie-timetable.js` ?ㅼ쓬, ?숈깮/?대옒?ㅻ８ view ?댁쟾??濡쒕뱶?쒕떎.
- `eie/js/views/eie-timetable.js`??`EieApi.getTimetable(null, { status: 'active,imported,needs_review,hidden' })`濡?row瑜?遺덈윭?ㅺ퀬 `EieState.setTimetableCells(rows)`???곸옱?쒕떎.
- ?쒓컙??v2??`buildDisplaySessions`, `renderBoard`, `renderSelectedPanel`, `renderStudentNames`濡??쒖떆 ?몄뀡??留뚮뱾硫? ?숈깮 踰꾪듉? `EieStudentsView.openDetail(studentId)` ?먮뒗 `EieStudentsView.setQuery(studentName)`濡??곌껐?섍퀬 ?대옒?ㅻ８ 踰꾪듉? `EieClassroomView.openDetail(cellId)`濡??곌껐?쒕떎.
- ???곌껐? navigation ?먮━源뚯? 議댁옱?섏?留? ?숈깮 ?곸꽭/?대옒?ㅻ８ ?먯껜媛 ?꾩쭅 APMS parity媛 ?꾨땲誘濡?Round 5 ?꾨즺 ?곹깭濡?蹂????녿떎.
