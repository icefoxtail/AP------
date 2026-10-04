# Formula Repair SOP

## Purpose

Repair formula notation only under exact, source-safe rules.

## Files To Read First

- Formula risk reports.
- Formula patch dry-run reports.
- Rulebook/schema documents.
- Source image when semantic meaning is uncertain.

## Allowed Work

- Create patch candidates.
- Apply patches only when explicitly authorized and exact-once safe.

## Forbidden Work

- Do not alter formula meaning.
- Do not wrap Korean prose in `\text{}`.
- Do not change answers without answer evidence.
- Do not auto-apply Gemini/API output directly to JS.

## Evidence Standard

Use `$...$` only for mathematical tokens. Separate plain safe exact-once patches from occurrence patches.

## Report Standard

Record target text, replacement text, field, occurrence count, and risk reason.

## Verification

Run syntax/parse/protected scans after any actual JS patch.

## Stop Conditions

Stop if the target appears multiple times without exact occurrence control or source meaning is uncertain.

