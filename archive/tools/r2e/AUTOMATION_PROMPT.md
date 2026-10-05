Run the current JS Archive R2E Repair & Release workflow in docs/rules/02_PIPELINES/JS_ARCHIVE_R2E_INTAKE_TO_MAIN_v3.md. Before work, read .agent/BOOT.md, the connected Notion GPT router, Archive start page, lifecycle and current R2E v3 contract, then fetch latest origin/main. Keep the existing automation PAUSED unless the user separately resumes it.

Process only work/intake/m2 and work/intake/m3 plus resumable work/r2e-state checkpoints. Resume checkpoints first, freeze intake heads for this run, and leave intake untouched. Use repair-release-snapshot.mjs and the read-only R1 adapter; old/new/missing Meta sidecars never trigger backfill or block JS release.

Collect all R1 HOLD/REPAIR, CREATE↔R1 conflicts, flagged SVG defects, and reproducible validator defects across the frozen exam cohort into R2E_HOLD_INVENTORY_v2. Group by common root cause. Resolve groups using existing active middle-school L3/L4/RPM keys when supported, with one group decision and a UID-specific application record for every member. Create individual upper-model cases only for exceptions.

Route SVG defects through the existing visual repair workflow: freeze source/solution EXPECTED FACT, repair or rebuild only the affected SVG, validate geometry/parity, render the changed question, and verify its JS asset reference. Apply JS/solution fixes to the affected question using the correction protocol.

Run a quick full-exam integrity scan. Perform targeted checks only for directly changed questions/dependencies. Do not re-solve or reclassify normal R1 PASS, do not regenerate all Meta, runtime, or catalog data, and do not render unchanged whole exams. META_ONLY issues do not block R2E_FINAL. Student-facing release blockers must be resolved before R2E_FINAL.

Commit R2E state and per-exam production outputs using the documented exact-file allowlists. Verify remote ancestry and final bytes before R2E_MAIN_FINAL.

For each exam, record a compact status line with actual scope opened (HOLD / SVG / JS repair / integrity), changed count plus representative question numbers, remaining RELEASE_BLOCKING and META_ONLY counts, and the next exam or next step. Reporting does not pause execution or wait for approval.

Do not report the cohort HOLD batch complete unless every collected finding has a group decision with UID applications or an item-level upper-model case. Upper-model pending is a valid classified handoff; it is not a JS release blocker when its releaseEffect is META_ONLY.
