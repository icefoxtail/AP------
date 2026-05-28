# EIE Fork Structure

## Decision

EIE English is an independent English-academy operations app under the Wangji academy umbrella. It is not an APMS submodule and does not inherit APMS or AP Math document, timetable, student, or class structures as a superior standard.

EIE starts as a separate static app at `eie/`, not as conditional rendering inside the AP Math app. AP Math remains the existing vanilla JS app under `apmath/` and is only a reference for implementation style.

## Boundaries

- AP Math app: `apmath/index.html`, `apmath/js/*`, `apmath/css/*`
- EIE app: `eie/index.html`, `eie/css/eie.css`, `eie/js/*`
- Shared backend namespace: `/api/eie/*` stub routes inside the existing worker backup

AP Math should only contain a minimal entry link to EIE. It must not load EIE view modules, EIE CSS, EIE state, or EIE router functions.

## Current Entry Points

- AP Math to EIE: `apmath/js/dashboard.js` renders a small `../eie/index.html` link.
- EIE to AP Math: `eie/index.html` header links to `../apmath/index.html`.

## EIE Frontend Files

- `eie/index.html`
- `eie/css/eie.css`
- `eie/js/eie-app.js`
- `eie/js/eie-state.js`
- `eie/js/eie-router.js`
- `eie/js/eie-api.js`
- `eie/js/views/eie-dashboard.js`
- `eie/js/views/eie-timetable.js`
- `eie/js/views/eie-import.js`
- `eie/js/views/eie-student-seeds.js`
- `eie/js/utils/eie-normalize.js`

## Round 0 Limits

The EIE fork shows only the first shell and placeholder screens:

- English timetable
- Workbook import
- Student seed

No parser, upload, automatic seed generation, attendance, homework, report, OMR, archive, or message feature is implemented in this round.

Round 0 stops at fixing the EIE independent-app boundary. Detailed EIE timetable design is deferred until after Claude reviews the schedule structure, and will be finalized in Round 1.

Round 0 does not finalize parser, student seed, schedule seed, candidate key, or migration details.

If EIE needs new browser storage later, new keys must use a `WANGJI_*` namespace. Round 0 does not introduce a new `APMATH_*` localStorage key and does not change existing AP Math localStorage keys.

## AP Math Preservation

This correction removes EIE module loading from AP Math. AP Math state no longer contains EIE unit state, and AP Math home rendering no longer branches through EIE renderers.
