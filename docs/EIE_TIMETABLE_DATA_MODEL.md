# EIE Timetable Data Model

## Philosophy

EIE English is an independent English-academy operations app under the Wangji academy umbrella. It is not an APMS submodule and does not treat APMS or AP Math document, timetable, student, or class structures as a superior standard.

EIE is not a SaaS React rewrite and is not a direct AP Math `class_students` clone. It starts from a separate vanilla JS app structure and will model English operations around EIE-specific timetable concepts after Round 1 design review.

## Scope

EIE Round 0 focuses on the English timetable shell. AP Math tests, OMR, archive, wrong-answer, math report, homework, attendance, billing, and messaging are outside this first EIE scope.

The detailed timetable design is intentionally deferred to Round 1 after Claude reviews the schedule structure. Round 0 does not implement a timetable parser, Excel import, latest-sheet detection, student seed generation, phone-number seed automation, candidate-key policy, or final migration design.

Round 1 records policy only. It does not implement parsing, upload, D1 writes, Worker DB queries, or confirmed operations tables.

## Core Rules

1. EIE begins from timetable cells.
2. EIE is not class-centered. One EIE student can appear in several lessons, days, periods, teachers, and class labels.
3. EIE must not simplify student membership to one student equals one class.
4. Student identity seed and schedule membership seed are separate.
5. Phone numbers, when present, are identity matching hints.
6. Missing phone numbers must not discard student information.
7. Confirmed student/class assignment is deferred to a later round.
8. Personal-data fixtures must not be committed or included in review packs.
9. New localStorage keys, if needed in later rounds, must use a `WANGJI_*` namespace instead of an `APMATH_*` namespace.
10. Schedule membership seeds may keep denormalized timetable text such as `day_label`, `period_label`, `start_time`, `end_time`, `teacher_name_raw`, and `class_name_raw` so review screens can show context without relying only on `cell_id`.

## Round 0 Draft Tables

These tables are draft vocabulary for discussion only. Parser behavior, student seed behavior, schedule seed behavior, candidate-key policy, and migration details are not finalized in Round 0.

For Round 1, the basic timetable unit is `timetable_cell`. `lesson_slot` is treated as the same concept at this stage, and the retained name is `timetable_cell`.

The intended uniqueness hint is:

- `import_session_id + day_label + period_label + column_index`

Different teachers in the same day/period are separated by `column_index`. Different class-name columns in the same day/period are separated by `column_index`. IVY-style same-period second-column cases can also be separated by `column_index`.

### eie_import_sessions

- id
- file_name
- sheet_name
- source_month
- imported_at
- status
- raw_meta_json
- created_at
- updated_at

### eie_timetable_cells

- id
- import_session_id
- day_label
- period_label
- period_order
- start_time
- end_time
- class_name_raw
- teacher_name_raw
- matched_teacher_tokens
- teacher_match_count
- room_raw
- column_index
- student_count
- status
- source_row
- raw_meta_json
- created_at
- updated_at

### eie_student_identity_seeds

- id
- import_session_id
- student_name_raw
- normalized_name
- grade_raw
- phone_raw
- normalized_phone
- memo_raw
- candidate_key
- match_status
- created_at
- updated_at

### eie_student_contact_seeds

- id
- import_session_id
- identity_seed_id
- student_name_raw
- phone_raw
- normalized_phone
- contact_type
- memo_raw
- match_status
- created_at
- updated_at

### eie_student_schedule_seeds

- id
- import_session_id
- cell_id
- identity_seed_id
- day_label
- period_label
- start_time
- end_time
- teacher_name_raw
- class_name_raw
- source_row
- source_col
- student_name_raw
- grade_raw
- phone_raw
- memo_raw
- attendance_note_raw
- status_raw
- membership_status
- created_at
- updated_at

## Status Values

- imported
- needs_review
- confirmed
- ignored

## Match Status Values

- pending
- candidate
- new_candidate
- ignored

## Membership Status Values

- active_candidate
- needs_review
- ignored

## Confirmed Operations Tables Deferred

The following confirmed operations tables are created from Round 6 onward and must not be created in Round 5:

- `eie_students`
- `eie_student_contacts`
- `eie_student_schedule_assignments`
- `eie_classroom_sessions`
- `eie_student_session_records`

## Matched Teacher Token Policy

Unknown teacher tokens such as `Laura` must be marked `needs_review` until added to a whitelist.

Adding a whitelist entry must not automatically reparse the whole import session. Only selected `needs_review` rows should be re-evaluated. Confirmed rows are excluded from automatic reparse.

Combined teacher tokens such as `Laura/Zoe` are not automatically converted into a single teacher. Preserve the raw combined token in `raw_meta_json` and keep the row in `needs_review`.

Recommended metadata:

- `matched_teacher_tokens`
- `teacher_match_count`
- `source_row`

## Student And Phone Policy

Round 5 extracts student and phone-number candidates from `eie_timetable_cells.raw_meta_json` and parser output for review only.

Having a phone number does not insert a row directly into `eie_students`. Rows must pass through seed and review stages.

Students without phone numbers must not be discarded. They should remain visible with a `missing_phone` or `needs_review` flag.

Duplicate names and family contact possibilities must be considered before confirmation.

Round 5 timetable cells may display student names only. Phone numbers are shown only in the student detail panel or in the student/contact candidate review screen.


### Import session duplicate guard

The proposal keeps the import-session duplicate guard aligned with the rulebook: a same `sheet_name + source_month` pair is blocked by default. Later, if a Wangji/EIE academy scope is introduced, this should be widened to `academy_id + sheet_name + source_month`.

Proposal hint:

```sql
UNIQUE(sheet_name, source_month)
```

## Migration Note

`docs/proposals/eie/20260528_eie_round0_proposal.sql` is a proposal only. It must not be placed under an executable Worker migrations folder and must not be applied to D1 in Round 0 or Round 1.


## Round 5 Raw Metadata Candidate Shape

Round 5 may store candidate review data inside `eie_timetable_cells.raw_meta_json` without creating confirmed tables.

Recommended keys:

- `student_candidates`
- `student_names`
- `contact_candidates`
- `needs_review_reasons`

Recommended candidate fields:

- `student_name_raw`
- `name`
- `normalized_name`
- `grade_raw`
- `phone_raw`
- `normalized_phone`
- `memo_raw`
- `source_row`
- `source_col`
- `cell_id`
- `cell_context`
- `match_status`
- `flags`

Round 5 flags:

- `duplicate_name`: same normalized phone number appears in more than one candidate row and should be reviewed as a namesake/identity-risk case
- `missing_phone`
- `needs_review`
- `phone_only`
- `name_only`

These fields are review hints only in Round 5. In Round 6, a reviewed candidate may be confirmed into EIE-only confirmed tables.


## Round 6 Confirmed Operations Tables

Round 6 introduces EIE-only confirmed operations tables.

### `eie_students`

Purpose: confirmed EIE student identity record.

Key fields:

- `id`
- `display_name`
- `normalized_name`
- `grade`
- `status`
- `source_type`
- `source_import_session_id`
- `source_cell_id`
- `memo`
- `raw_meta_json`
- `created_by`
- `created_at`
- `updated_at`

### `eie_student_contacts`

Purpose: confirmed EIE student phone/contact record.

Key fields:

- `id`
- `student_id`
- `phone`
- `normalized_phone`
- `contact_label`
- `is_primary`
- `source_type`
- `source_import_session_id`
- `source_cell_id`
- `memo`
- `raw_meta_json`
- `created_by`
- `created_at`
- `updated_at`

A same normalized phone number may appear under multiple students. Same phone alone is not enough to merge identities.

### `eie_student_schedule_assignments`

Purpose: confirmed EIE student-to-timetable-cell assignment.

Key fields:

- `id`
- `student_id`
- `timetable_cell_id`
- `status`
- `source_type`
- `source_import_session_id`
- `memo`
- `raw_meta_json`
- `created_by`
- `created_at`
- `updated_at`

Round 6 does not create classroom sessions, attendance, homework, textbook, or memo records.
