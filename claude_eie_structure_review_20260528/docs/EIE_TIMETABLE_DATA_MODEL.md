# EIE Timetable Data Model

## Philosophy

EIE English is an independent English-academy operations app under the Wangji academy umbrella. It is not an APMS submodule and does not treat APMS or AP Math document, timetable, student, or class structures as a superior standard.

EIE is not a SaaS React rewrite and is not a direct AP Math `class_students` clone. It starts from a separate vanilla JS app structure and will model English operations around EIE-specific timetable concepts after Round 1 design review.

## Scope

EIE Round 0 focuses on the English timetable shell. AP Math tests, OMR, archive, wrong-answer, math report, homework, attendance, billing, and messaging are outside this first EIE scope.

The detailed timetable design is intentionally deferred to Round 1 after Claude reviews the schedule structure. Round 0 does not implement a timetable parser, Excel import, latest-sheet detection, student seed generation, phone-number seed automation, candidate-key policy, or final migration design.

## Core Rules

1. EIE begins from timetable cells.
2. One EIE student can appear in several days, periods, teachers, and class labels.
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
- room_raw
- column_start
- column_end
- student_count
- status
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

## Migration Note

`apmath/worker-backup/worker/migrations/20260528_eie_round0_proposal.sql` is a proposal only. It must not be applied to D1 in Round 0.
