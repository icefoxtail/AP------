# M2S1 current-figure repair packet

This packet follows `2d04279b6651398487cd6a9b40f899f90a73afcc` and fixes eleven questions using the actual source figures and independently checked, fixed before/after proposals. Four exam files contain 27 student-facing field corrections and 20 difficulty field changes. Historical `level` values and image bytes are unchanged.

## Local verification

- Four official difficulty requests passed dry-run, write and post-build projection for all 11 selected UIDs. The writer changed 37 difficulty fields in 11 metadata rows and zero unselected rows.
- `python3 archive/build_db.py` completed successfully, including registration synchronization. Actual Changed-UID Consumer passed 11/11 with zero skipped rows, failures or unobserved fields.
- All 11 Consumer `assignment_missing` rows are explicitly attributed to the exact difficulty-only request, exam, UID and ordinal. This packet creates zero advanced metadata approvals. Four existing advanced source bindings remain stale and are recorded in `validation.json`; they are not presented as repaired.
- Identity, raw runtime, canonical definitions and compiled registry data remain unchanged. The official writer recomputed the global metadata digest, and the official build refreshed the derived runtime-bridge receipt. Both derived changes were verified; the receipt readiness check reports no pending changes.
- Exact main `2ea8fb8b109921997e6764a3f85213d9d04b4364` has the same 11 full before-metadata rows. None of the 98 rows in the four affected source banks has a preexisting native receipt or metadata approval type, so this packet does not invalidate a prior native approval.

## Scope of the judgments

Six previously accepted numeric judgments and their low confidence remain unchanged. Five previously UNKNOWN questions receive separately reviewed current-source numeric judgments after the actual figure repairs. Neither the narrow source review nor these difficulty requests create REVIEW2, full-exam mathematical QA, PT/template or other advanced approvals.

Cumulative selected numeric coverage across the staged packets is 1340 of 1780. The remaining first-packet holds are 440: 394 missing-method rows outside the current bounded repair scope, plus 46 other rows still requiring disposition. E060 Q18 remains excluded because the clipped figure does not establish the exact angle placement.

## Release sequence

Main merge, bot registration and production remain pending the root release sequence. This packet changes sources also used by earlier requests, so the earlier immutable packets must be registered and their inbox requests consumed before these four new source versions are released. Preserve the first packet's separate E045 correction and E037/E045 native audit preservation. Do not overlay this branch's historical generated data on a newer main.

`release-manifest.json`, `validation.json` and `mutation-isolation.json` bind the exact inputs, scoped official results and remaining limitations.
