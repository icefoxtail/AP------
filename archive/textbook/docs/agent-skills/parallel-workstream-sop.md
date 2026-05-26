# Parallel Workstream SOP

## Purpose

Divide work across Codex windows without corrupting shared JS or reports.

## Files To Read First

- `.agent/WORKSTREAM_TEMPLATE.md`
- `plans/PARALLEL_WORK_ASSIGNMENTS.md`
- Relevant book status and queue files.

## Allowed Work

- Assign by book, setKey, or jsFile.
- Prefer patch/report outputs from subagents before coordinator application.

## Forbidden Work

- Do not let two workers edit the same JS file.
- Do not let two workers overwrite the same generated report.
- Do not reset/delete from a workstream unless explicitly authorized.

## Evidence Standard

Each assignment must list allowed files, forbidden files, evidence, output, validation, and lock owner.

## Report Standard

Each workstream returns a separate report, then a coordinator merges and validates.

## Verification

Run integrated checks after merge, not only per-workstream checks.

## Stop Conditions

Stop if lock ownership is ambiguous or another worker touched the same target.

