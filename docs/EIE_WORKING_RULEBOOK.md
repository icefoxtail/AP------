# EIE Working Rulebook

## 1. Independent App Principle

EIE English is not an APMS/AP Math submodule. EIE English is an independent English-academy operations app under the Wangji academy umbrella.

APMS/AP Math can be used as implementation reference only for:

- static deployment style
- Worker authentication flow
- Worker API namespace separation
- vanilla JavaScript implementation style
- calm screen composition

EIE must not share or inherit APMS/AP Math timetable, student/class, report, OMR, archive, or math-operations structures as its superior standard. EIE documents are governed by EIE-specific documents first.

## 2. Current App Boundary

- `apmath/` is the APMS/AP Math math-operations app.
- `eie/` is the EIE English independent operations app.
- APMS/AP Math may contain only a minimal link into EIE.
- EIE state, routing, headers, and UI modules must not be inserted into APMS core or UI files.

## 3. Shareable And Non-Shareable Standards

Shareable:

- static deployment approach
- Worker authentication flow
- Worker API namespace separation
- vanilla JavaScript implementation approach
- quiet visual density and interaction feel

Not shareable:

- APMS `classes` / `class_students` centered model
- APMS timetable model
- APMS classroom headers
- APMS OMR/archive/report/problem structures
- APMS localStorage keys
- APMS math-operation workflows

## 4. localStorage Namespace

EIE must not create new `APMATH_*` localStorage keys.

If EIE or shared Wangji academy state needs browser storage in a later round, use the `WANGJI_*` namespace. Existing APMS/AP Math localStorage keys must not be renamed or repurposed.

## 5. Import And Session Policy

EIE workbook import results must not be reflected directly into operational data.

Import results first land in staging and seed records. The same `sheet_name + source_month` combination should block duplicate import sessions by default.

Re-import happens only when an administrator explicitly chooses overwrite. Rows with `confirmed` status are not overwritten automatically. If a teacher whitelist is updated, only `needs_review` targets are re-evaluated.

## 6. Personal Data Policy

English workbook fixtures must not be committed to git.

English workbook fixtures must not be included in review packs. Student names, phone numbers, source rows, and workbook excerpts must not be copied into docs or `CODEX_RESULT.md`.

If a fixture is required, use a local-only path such as `.codex-fixtures/eie/`, and keep it excluded from cleanup packs, review packs, and commits.

## 7. Round Scope

Round 0:

- EIE independent app boundary
- placeholder screens
- Worker stubs

Round 1:

- EIE independent operations rulebook
- data model policy update
- migration proposal naming cleanup

Round 2:

- parser to Worker connection
- `POST /api/eie/import`
- import session creation
- timetable cell staging
- `eie-api.js` environment split
- Worker authentication pattern cleanup

Round 3:

- import preview UI
- timetable cell list
- `needs_review` highlighting

Round 4:

- operational timetable direct editing 1st pass
- timetable cell add/edit
- status change: `active`, `needs_review`, `hidden`, `archived`
- view filters for operation/all/needs-review/hidden

Round 5:

- student and phone-number candidate review 1st pass
- student names displayed inside timetable cells
- student detail panel opened from a student name
- phone numbers shown only inside student detail or seed review screens
- duplicate-name, missing-phone, and needs-review flags
- no student/contact/schedule confirmation write

Round 6+:

- formal student/contact/assignment confirmation design after review
- classroom sessions
- attendance, homework, textbook, memo, and class operations

## 8. Round-Specific Prohibitions

Round 1 must not implement a parser.

Round 1 must not apply database changes.

Round 1 must not create students, contacts, classroom, classroom session, or session record tables.

Before Round 2, Worker code must not issue real `eie_*` DB queries.

Round 5 must not create `eie_students`, `eie_student_contacts`, or `eie_student_schedule_assignments`.

Round 5 must not finalize student identity, phone contact, or class assignment records.

Before Round 6, do not design or implement classroom sessions.

### Migration proposal location policy

EIE proposal SQL must not live inside an executable Worker `migrations/` folder while it is marked proposal-only. Keep proposal SQL under `docs/proposals/eie/` until the relevant round explicitly approves D1 migration application. A comment such as “Proposal only” is not enough to prevent accidental migration execution.


## 9. Round 5 Candidate Review Policy

Round 5 reads student and phone candidates from `eie_timetable_cells.raw_meta_json` and import parser output only. It does not create confirmed operations tables.

Timetable cells may show student names only. Phone numbers must not be displayed inside timetable cells. Phone numbers may be displayed in the student detail panel or the student/contact candidate review screen.

Candidate flags used in Round 5:

- `duplicate_name`: same normalized phone number appears in more than one candidate row and should be reviewed as a namesake/identity-risk case
- `missing_phone`
- `needs_review`
- `phone_only`
- `name_only`

Any save/confirm/create action for students, contacts, assignments, classroom, attendance, homework, textbook, or memo remains out of scope.
