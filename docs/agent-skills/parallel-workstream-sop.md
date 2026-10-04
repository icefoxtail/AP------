# Parallel Workstream SOP

Use when AP work is split across multiple agents, windows, or domains.

## Procedure

1. Assign one owner per file or path.
2. Record locks in `reports/agent-memory/ap-workstream-locks.json`.
3. Split by domain: apmath UI, Worker/D1, archive, textbook, docs, reports.
4. Do not let multiple workstreams edit shared result files.
5. Each workstream writes its own result summary or section.
6. Merge only after verification and conflict review.

## Default Lock

No parallel edits to `archive/textbook/generated`, schema/migrations, root result files, or policy docs.
