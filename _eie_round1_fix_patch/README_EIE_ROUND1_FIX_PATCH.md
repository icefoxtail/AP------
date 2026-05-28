# EIE Round 1 Fix Patch

This patch fixes the concrete Round 1 issues found in the review pack.

## Changes

- Replaces EIE visible wording from `원천` to `엑셀` in actual view files.
- Aligns `handleEie(request, env, teacher, path, url)` signature with the caller.
- Moves proposal SQL out of executable Worker migrations path into `docs/proposals/eie/`.
- Updates timetable-cell unique hint to include `day_label`: `UNIQUE(import_session_id, day_label, period_label, column_index)`.
- Adds import-session duplicate guard hint: `UNIQUE(sheet_name, source_month)`.
- Keeps Worker EIE routes as stubs. No D1 apply, no parser, no students/contacts/classroom implementation.

## Old path to remove

`apmath/worker-backup/worker/migrations/20260528_eie_round0_proposal.sql`

Use `APPLY_EIE_ROUND1_FIX_PATCH.ps1` from the project root after extracting this zip.
