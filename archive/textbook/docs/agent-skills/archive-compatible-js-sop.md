# Archive Compatible JS SOP

## Purpose

Protect JS archive compatibility and stable question identity.

## Files To Read First

- Target operating JS.
- Local JS archive rulebook.
- Validation reports.

## Allowed Work

- Only fields explicitly permitted by the current task.

## Forbidden Work

- Do not change `id`, `displayNo`, `setKey`, `sourceQuestionNo`, metadata, tags, standardUnit, image, `solution`, `window.examTitle`, or question order unless the user explicitly authorizes that exact field.

## Evidence Standard

All content/answer changes must be source-backed or explicitly direct-solve-backed.

## Report Standard

Record before/after counts and protected field scan result.

## Verification

Run `node --check`, questionBank parse, and protected-field diff scan when JS is edited.

## Stop Conditions

Stop and report if syntax/parse fails or protected fields changed unexpectedly.

