# PARALLEL_WORK_ASSIGNMENTS

No real workstreams are assigned yet. Fill this before opening multiple Codex windows.

| Workstream ID | Book/Folder | jsFile Lock | Report Lock | Allowed Files | Forbidden Files | Evidence | Output | Validation | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| template-001 | unknown | none | none | report-only unless task says otherwise | generated/js, shared reports, apmath, archive/exams | source reports | isolated report | JSON parse and banned path scan | template |

## Rules

- One JS file, one worker.
- One generated report, one writer.
- Subagents should produce patch/report outputs first.
- A coordinator performs final application and validation when edits are allowed.

