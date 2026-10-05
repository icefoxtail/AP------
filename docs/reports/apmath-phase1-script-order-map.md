# AP Math Phase 1 Script Order Map

- Date: 2026-06-13
- Source: `apmath/index.html`
- Production status: script order was not changed in this phase.

## Current Script Order

1. `../shared/js/wangji-owner-auth-bridge.js`
2. `js/core.js`
3. `js/ui.js`
4. `js/report.js`
5. `js/qr-omr.js`
6. `js/student.js`
7. `js/classroom.js`
8. `js/clinic-print.js`
9. `js/management.js`
10. `js/student-export.js`
11. `js/textbook.js`
12. `js/memo.js`
13. `js/schedule.js`
14. `js/cumulative.js`
15. `js/timetable.js`
16. `js/dashboard-admin.js`
17. `js/dashboard-teacher.js`
18. `js/dashboard.js`
19. `js/study-material-wrong.js`
20. `app.js`

## Current Provider Map

- `core.js`: global `state`, API helpers, data loading/saving, date helpers, teacher helpers, index helpers.
- `ui.js`: modal shell, `showModal`, `closeModal`, `toast`, app navigation helpers.
- `report.js`: report text builders, report center, archive detail helpers, AI report entry points, print helpers.
- `student.js`: student detail/edit, consultation and parent-contact flows, `openStudentDetail`.
- `classroom.js`: class detail, attendance/homework/exam operations, class planner, `renderClass`.
- `timetable.js`: timetable and operation-date helpers used by later dashboard/classroom flows.
- `dashboard-admin.js`: admin dashboard subcomponents.
- `dashboard-teacher.js`: teacher dashboard subcomponents.
- `dashboard.js`: final dashboard composition and role-based dispatch.
- `app.js`: final application bootstrap after domain scripts.

## Dependencies To Preserve

- `core.js` must stay before all domain files that use `state` and API helpers.
- `ui.js` must stay before files that call `showModal`, `closeModal`, and `toast`.
- `student.js` must stay before `classroom.js` and `dashboard.js` call student detail flows.
- `timetable.js` must stay before final dashboard rendering depends on timetable/date helpers.
- `dashboard-admin.js` and `dashboard-teacher.js` must stay before `dashboard.js`.
- `app.js` must stay last among the AP Math app scripts.

## Planned Split Order Under Review

1. `student.js` -> `student-edit.js`
2. `timetable.js` -> `classroom.js` -> `classroom-planner.js`
3. `dashboard-admin.js` -> `dashboard-teacher.js` -> `dashboard.js` -> `dashboard-admin-center.js`
4. `report-text.js` -> `report-center.js` -> `report-print.js`

## Expected Post-Split Placement

- `student-edit.js`: directly after `student.js`.
- `classroom-planner.js`: after `classroom.js`; keep `timetable.js` before planner if planner keeps date/timetable helper references.
- `dashboard-admin-center.js`: after `dashboard.js` only if it depends on dashboard composition helpers; otherwise keep admin-center before `dashboard.js` and expose a stable entry.
- `report-text.js`: before `report-center.js`.
- `report-center.js`: before `report-print.js`.
- `report-print.js`: after report center because print view currently shares `AP_REPORT_*` state.

## Do-Not-Change Order Notes

- Do not move `dashboard.js` before `dashboard-admin.js` or `dashboard-teacher.js`.
- Do not move `classroom.js` before `student.js` unless classroom no longer calls student detail globals.
- Do not move report print helpers ahead of report center/text helpers in the report split.
- Do not reorder scripts in Phase 1-0; this document is only an inventory.
