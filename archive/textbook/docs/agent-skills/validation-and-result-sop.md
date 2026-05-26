# Validation And Result SOP

## Purpose

Standardize final checks and `CODEX_RESULT.md` reporting.

## Files To Read First

- `.agent/RESULT_TEMPLATE.md`
- Current task instructions.
- Modified file list.

## Allowed Work

- Run validation commands permitted by the task.
- Update `CODEX_RESULT.md`.

## Forbidden Work

- Do not run unrelated stages or tests.
- Do not stage, commit, or push.

## Evidence Standard

A pass claim requires command output or explicit reason why the check does not apply.

## Report Standard

Include created/modified files, checked files, protected fields, execution results, summary, next actions, and work not performed.

## Verification

Common checks include `node --check`, questionBank parse, protected field scan, JSON parse, image-only content scan, asset path scan, and git path diff.

## Stop Conditions

Do not claim completion if required validation was skipped without explanation.

