# AP Math Phase 1 Function Inventory

- Date: 2026-06-13
- Scope: `apmath/js/student.js`, `apmath/js/classroom.js`, `apmath/js/dashboard.js`, `apmath/js/report.js`
- Purpose: preserve the pre-split callable surface before moving code out of the large AP Math files.
- Full source of truth: `tests/fixtures/apmath-surface-*.json`

## Summary

| File | `function` | `async function` | `window.*` assignments | `const/let/var` functions | Total captured surface |
|---|---:|---:|---:|---:|---:|
| `student.js` | 153 | 27 | 5 | 2 | 182 |
| `classroom.js` | 107 | 31 | 8 | 6 | 152 |
| `dashboard.js` | 166 | 15 | 1 | 10 | 192 |
| `report.js` | 148 | 10 | 13 | 5 | 176 |

## Fixture Coverage

The fixtures record the complete current surface for each large file:

- `tests/fixtures/apmath-surface-student.json`
- `tests/fixtures/apmath-surface-classroom.json`
- `tests/fixtures/apmath-surface-dashboard.json`
- `tests/fixtures/apmath-surface-report.json`

Each fixture stores:

- `functionDeclarations`
- `asyncFunctionDeclarations`
- `windowAssignments`
- `functionExpressions`
- `duplicateDefinitions`
- category counts

`tests/apmath-global-surface.test.js` compares the live source against these fixtures. A future split should fail this test first if a public function disappears, is renamed, or is duplicated.

## File Notes

### `student.js`

- Main domain: student detail, student edit, consultation records, parent contacts, onboarding, status history.
- High-value global/public entries:
  - `openStudentDetail`
  - `renderStudentDetail`
  - `switchStudentDetailEditTab`
  - `renderStudentPinnedConsultationPreview`
  - `openStudentParentManageModal`
- `window.*` assignments captured:
  - `bindStudentConsultationDateButtons`
  - `handleStudentConsultationDateClick`
  - `openStudentParentManageModal`
  - `renderStudentPinnedConsultationPreview`
  - `switchStudentDetailEditTab`
- Split warning: `openStudentDetail` and `renderStudentDetail` are used by classroom/dashboard onclick paths and must remain callable after the first split.

### `classroom.js`

- Main domain: class detail, attendance, homework, exams, class planner, homework photo assignments.
- High-value global/public entries:
  - `renderClass`
  - `openStudentActionSheetV4`
  - `setClassPlannerMode`
  - `setClassPlannerSelectedDate`
  - `moveClassPlannerWeek`
  - `resetClassPlannerWeek`
  - `moveClassPlannerMonth`
  - `resetClassPlannerMonth`
- `window.*` assignments captured:
  - `apEscapeHtml`
  - `moveClassPlannerMonth`
  - `moveClassPlannerWeek`
  - `openStudentActionSheetV4`
  - `resetClassPlannerMonth`
  - `resetClassPlannerWeek`
  - `setClassPlannerMode`
  - `setClassPlannerSelectedDate`
- Split warning: planner functions share `state.ui.classPlanner*`, date helpers, and same-file render helpers.

### `dashboard.js`

- Main domain: admin/teacher dashboard composition, operational cards, global search, journals, risk students, dashboard class navigation.
- High-value global/public entries:
  - `renderDashboard`
  - `renderClass`
  - `renderAdminControlCenter`
  - `adminOpenDashboardStudentDetail`
  - `adminOpenDashboardStudentEdit`
  - `openAdminStudentList`
- `window.*` assignments captured:
  - `renderClass`
- Split warning: `dashboard.js` is a composition layer loaded after `dashboard-admin.js` and `dashboard-teacher.js`; it dispatches by `state.auth.role`.

### `report.js`

- Main domain: parent/student/counsel report text, report center, archive details, AI analysis, print view.
- High-value global/public entries:
  - `requestAiReport`
  - `copyReport`
  - `openReportCenterModal`
  - `openReportCenterDaily`
  - `openReportCenterExam`
  - `openReportCenterCounsel`
  - `reportCenterOpenPrintView`
  - `reportCenterPrintCleanPdf`
- `window.*` assignments captured:
  - `AP_REPORT_CONTEXT_OPTIONS`
  - `AP_REPORT_ARCHIVE_CACHE`
  - `AP_REPORT_ARCHIVE_BANK_CACHE`
  - `AP_REPORT_AI_ANALYSIS_CACHE`
  - `AP_REPORT_CENTER_RENDER_TOKEN`
  - `AP_REPORT_PENDING_TEACHER_MEMO`
  - `AP_REPORT_PRINT_MEMO_TIMER`
  - `AP_REPORT_PRINT_RETURN`
  - `__AP_REPORT_PRINT_TRIGGERED`
  - `__AP_REPORT_TRIGGER_PRINT`
  - `MathJax`
  - `html2canvas`
  - `onload`
- Split warning: report print state and report center state are strongly coupled through `AP_REPORT_*` globals.

## Onclick Surface

- Scanner: `tests/apmath-onclick-defined.test.js`
- Scan scope: `apmath/index.html`, `apmath/js/*.js`
- Current result: no undefined project function calls found in inline onclick attributes.
- Browser/platform allowlist:
  - `window.open`
  - `event.stopPropagation`
  - `event.preventDefault`
  - `Math`
  - `Number`
  - `String`
  - `Array`
  - `Object`
  - `Date`
  - `JSON`
- Explicitly not allowlisted:
  - `toast`
  - `closeModal`
  - `showModal`
  - `openStudentDetail`
  - `openClassroom`
  - `copyText`

## External-Call Risk List

These functions are likely to be used across file boundaries or inline handlers and should be preserved during splits:

- Student: `openStudentDetail`, `renderStudentDetail`, `switchStudentDetailEditTab`, `renderStudentPinnedConsultationPreview`
- Classroom: `renderClass`, `openStudentActionSheetV4`, `setClassPlannerMode`, `moveClassPlannerWeek`, `moveClassPlannerMonth`
- Dashboard: `renderDashboard`, `renderClass`, `renderAdminControlCenter`, `renderTeacherDashboardView`
- Report: `requestAiReport`, `copyReport`, `openReportCenterModal`, `reportCenterOpenPrintView`, `reportCenterPrintCleanPdf`

## Duplicate Definition Guard

The fixture includes `duplicateDefinitions`. The current baseline is empty for all four large files. The guard intentionally does not count `window.fn = fn` as a duplicate when `fn` is already declared; that is a normal public-export pattern in the current code.
