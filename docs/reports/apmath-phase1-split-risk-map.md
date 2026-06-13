# AP Math Phase 1 Split Risk Map

- Date: 2026-06-13
- Scope: pre-split review for `student.js`, `classroom.js`, `dashboard.js`, and `report.js`
- Production JS status: read-only; no AP Math runtime file was edited in this phase.

## Top-Level Immediate Reference Checks

| Check | Result | Evidence |
|---|---|---|
| Does `student.js` reference future `student-edit` functions at load time? | PASS: no separate future module reference found. | Student detail/edit behavior is currently inside `student.js`; public entry points are `openStudentDetail` at `apmath/js/student.js:1243`, `renderStudentDetail` at `apmath/js/student.js:1283`, and `switchStudentDetailEditTab` exported at `apmath/js/student.js:1954`. |
| Does a future `classroom-planner.js` need helpers from `classroom.js`? | PASS: yes, high coupling. | Planner functions use same-file helpers/state such as `ensureClassPlannerState` at `apmath/js/classroom.js:2440`, `loadClassPlannerWeek` at `apmath/js/classroom.js:2466`, and exported planner controls at `apmath/js/classroom.js:3000`. |
| Does a future `classroom-planner.js` need timetable/date helpers? | PASS: yes, moderate coupling. | Classroom has date fallback `getTodayStr` at `apmath/js/classroom.js:685`; planner also uses `normalizeClassroomDate` and internal planner date helpers around `apmath/js/classroom.js:1980` and `apmath/js/classroom.js:2506`. |
| Does future `dashboard-admin-center.js` need `dashboard.js` helpers? | PASS: yes, moderate coupling. | `renderDashboard` dispatches admin role to `renderAdminControlCenter` at `apmath/js/dashboard.js:3039` and `apmath/js/dashboard.js:3052`; admin center is currently in the dashboard composition layer. |
| Does future `report-print.js` use report-center state? | PASS: yes, high coupling. | Print and center flows share `window.AP_REPORT_PENDING_TEACHER_MEMO`, `window.AP_REPORT_PRINT_RETURN`, and `window.AP_REPORT_AI_ANALYSIS_CACHE` patterns in `apmath/js/report.js:28`, `apmath/js/report.js:2098`, and `apmath/js/report.js:3213`. |
| Does future `report-center.js` use report-text constants/helpers? | PASS: yes, high coupling. | `requestAiReport` starts at `apmath/js/report.js:621`; `reportCenter*` flows reuse report builders, archive cache helpers, text helpers, MathJax/html2canvas, and print helpers through the same file. |

## Onclick Undefined Risk

- Test coverage: `tests/apmath-onclick-defined.test.js`
- Scope: `apmath/index.html` and `apmath/js/*.js`
- Current result: no undefined project onclick functions found.
- Browser/API exceptions only: `window.open`, `event.stopPropagation`, `event.preventDefault`, `Math`, `Number`, `String`, `Array`, `Object`, `Date`, `JSON`
- Not exempted: `toast`, `closeModal`, `showModal`, `openStudentDetail`, `openClassroom`, `copyText`

## File-Level Split Risk

### student.js

- Risk: medium
- First split candidate: `student-edit.js`
- Why feasible: student detail and edit flows are concentrated in the student file, and the current public surface is captured by `tests/fixtures/apmath-surface-student.json`.
- Shared state risk: `state.db.students`, modal return context, consultation lazy-load state, parent-contact lazy-load state.
- Required public surface to preserve: `openStudentDetail`, `renderStudentDetail`, `switchStudentDetailEditTab`, `renderStudentPinnedConsultationPreview`, `openStudentParentManageModal`.
- First PR note: add the new script immediately after `student.js` if code is moved out, then run the surface and onclick guards before changing fixtures.

### classroom.js

- Risk: high
- Split candidate: `classroom-planner.js`, but not before student split.
- Why risky: planner logic shares `state.ui.classPlanner*`, class rendering state, attendance/homework/exam helpers, and same-file date/cache helpers.
- Student dependency: classroom calls `openStudentDetail`/`renderStudentDetail` with fallback at `apmath/js/classroom.js:548`.
- Date/timetable dependency: classroom uses date fallbacks such as `getTodayStr` at `apmath/js/classroom.js:685`.
- Required public surface to preserve: `renderClass`, `openStudentActionSheetV4`, `setClassPlannerMode`, `setClassPlannerSelectedDate`, `moveClassPlannerWeek`, `resetClassPlannerWeek`, `moveClassPlannerMonth`, `resetClassPlannerMonth`.

### dashboard.js

- Risk: high
- Split candidate: `dashboard-admin-center.js` after admin/teacher boundaries are documented more deeply.
- Why risky: `dashboard.js` is the final composition layer after `dashboard-admin.js` and `dashboard-teacher.js`; it dispatches based on `state.auth.role`.
- Admin dependency: `renderDashboard` calls `renderAdminControlCenter` at `apmath/js/dashboard.js:3052`.
- Teacher dependency: `renderDashboard` calls `renderTeacherDashboardView` at `apmath/js/dashboard.js:3068`.
- Student dependency: dashboard contains many `openStudentDetail` onclick paths and direct calls.
- Required public surface to preserve: `renderDashboard`, `renderClass`, admin student/detail helpers used by onclick strings.

### report.js

- Risk: very high
- Recommended order: last
- Split order under review: `report-text.js` -> `report-center.js` -> `report-print.js`
- Why risky: report text generation, report center archive analysis, AI analysis cache, MathJax/html2canvas lazy loading, print-window lifecycle, and `AP_REPORT_*` window state are interleaved.
- Required public surface to preserve: `requestAiReport`, `copyReport`, `openReportCenterModal`, `reportCenterOpenPrintView`, `reportCenterPrintCleanPdf`, and related `reportCenter*` onclick functions.
- First PR note: do not split print first; print relies on center state and text builders.

## Recommended Next PR

1. Start with `student.js -> student-edit.js`.
2. Do not change `apmath/index.html` order except adding a new script directly after `student.js` if needed.
3. Run `tests/apmath-global-surface.test.js` before fixture updates.
4. Run `tests/apmath-onclick-defined.test.js` before and after the move.
5. Keep `report.js` for the final split phase.
