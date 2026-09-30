# LEGACY — APMath archive rule routing

status: SUPERSEDED / DO NOT PRELOAD
superseded: 2026-09-30

This reference used to contain the full Past Exam V3 / pipeline-core / R2E / render routing map.
That broad map caused routine existing-exam jobs to inherit unnecessary pipeline context.

## Current rule

Normal existing Archive JS work does **not** use this reference and does not need
`apmath-archive-exams` as a startup prerequisite.

Use the direct path:

```text
user/current lane
→ Notion CURRENT
→ latest Git main
→ target source/current JS
→ directly applicable canonical rule(s)
→ assigned stage
```

Use the special router only for:

- true first-time original-exam import → `NEW_IMPORT_V3`;
- shared system/pipeline/engine work → `SYSTEM_PIPELINE`;
- explicit frozen legacy R2E recovery → `LEGACY_R2E`;
- genuine route ambiguity or explicit user invocation.

Historical details remain available in Git history. Do not reconstruct or copy the old heavy route map into routine work.
