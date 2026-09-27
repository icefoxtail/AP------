# Codex R2E Repair & Release

Current contract: docs/rules/02_PIPELINES/JS_ARCHIVE_R2E_INTAKE_TO_MAIN_v3.md.
The previous v1 snapshot/final-gate helpers remain available only to inspect and resume legacy v1 artifacts. New R2E runs use the Repair & Release v3 helpers in this directory.

## Operating purpose

R2E batches R1 HOLD findings across the frozen m2/m3 cohort, groups repeated causes, maps existing middle-school L3/L4 where supported, and routes true individual exceptions with their own question evidence. Normal R1 PASS questions are not re-solved, reclassified, reprojected, or re-rendered.

The legacy R1 adapter is read-only. Missing, old, stale, or incompatible Meta sidecars are recorded as META_ONLY. They never create a JS release blocker by themselves.

## Required read order

1. Repository .agent/BOOT.md and relevant archive skills.
2. Connected Notion GPT router, Archive start page, lifecycle, and current R2E v3 contract.
3. Latest origin/main and the current R2E v3 contract.
4. Existing work/r2e-state checkpoint before new intake.
5. Current L1/RPM and active L3/L4 records for grouped mapping.
6. Source correction and visual rules only for affected repairs.

## Execution helpers

- guard.mjs keeps the single-writer lock and fencing token.
- repair-release-snapshot.mjs freezes latest m2/m3 input heads and resumes durable checkpoints. It reads R1 sidecars without modifying them.
- hold-inventory.mjs emits R2E_HOLD_INVENTORY_v2, groups repeated findings, and validates one batch decision plus UID-specific application records.
- The hold inventory also freezes the current ACTIVE L3/L4 catalog, existing middle-school bindings, and exact m2/m3 RPM crosswalk rows as read-only lookup evidence for the batch adjudication.
- repair-release-gate.mjs checks exam integrity, release blockers, HOLD routing, and only the targeted evidence required by actual changes.
- final-gate.mjs and snapshot.mjs are retained for legacy v1 records; they are not the v2 R2E authority.

The optional group-decisions JSON uses schemaVersion R2E_HOLD_GROUP_DECISIONS_v2 and a groups array. Each group row names groupId, decisionId, action, reason, evidenceRefs, selectedExistingKeys, and uidApplications. Each UID application names findingId, questionUid, ordinal, outcome, reason, evidenceRefs, and appliedExistingKeys when mapped. A group decision may map existing keys, route an item to the visual/JS repair workflow, or route an exception to upper-model review; new L3/L4 key creation is rejected.

Example helper order:

    node archive/tools/r2e/repair-release-snapshot.mjs --repo . --run-id <runId> --out tmp/<runId>/snapshot.json
    node archive/tools/r2e/hold-inventory.mjs --repo . --run-id <runId> --snapshot tmp/<runId>/snapshot.json --out tmp/<runId>/hold-inventory.json
    node archive/tools/r2e/hold-inventory.mjs --repo . --run-id <runId> --snapshot tmp/<runId>/snapshot.json --decisions tmp/<runId>/group-decisions.json --out tmp/<runId>/hold-inventory-decided.json
    node archive/tools/r2e/repair-release-gate.mjs --repo <candidate-repo> --ledger <r2e-final-ledger.json> --validation <validation.json>

The v2 snapshot must be called with the current run ID and an output path under that run's tmp directory. Store snapshots, HOLD ledgers, decisions, validation reports, and run state under a durable R2E state commit when checkpointing. Never stage temporary reports to production main.

## HARD RULES

1. RELEASE_BLOCKING is separate from META_ONLY. RPM gaps, absent resolver sidecars, difficulty metadata, and taxonomy-only findings do not block JS release.
2. R1 receipts, source JS, and all sidecars are read-only. No legacy sidecar backfill or full-denominator Meta regeneration occurs in R2E.
3. HOLD groups are adjudicated once; every affected questionUid gets an application record with groupDecisionId, applied key/action, evidence, and targeted result.
4. Only existing active L3/L4 keys may be selected in a normal R2E mapping. New taxonomy goes to an individual upper-model case.
5. R1 PASS rows receive integrity reuse only unless a reproducible defect invalidates that exact UID.
6. Repair SVGs through the existing visual repair lane: source/solution EXPECTED FACT, SVG repair or rebuild, geometry/parity validation, targeted render, then JS asset-reference verification.
7. The whole exam gets a quick integrity scan. Full-exam render, all-question resolver/difficulty projection, global runtime/catalog rebuild, and broad canonical regeneration are not R2E steps.
8. Every HOLD is either grouped, repaired, routed to an upper-model case, or retained as a true hold with its release effect explicit. No unclassified item is allowed.
9. A release-blocking student-facing defect must be closed before R2E_FINAL. META_ONLY items may remain open and are recorded in the final receipt.
10. Each exam is integrated in its own main commit. After remote byte/ancestry checks, record R2E_MAIN_FINAL and any META_ONLY follow-up count.

## Status meanings

- NO_WORK: no resumable checkpoint and no eligible R1 receipt.
- READY: one or more frozen R1 inputs are available for integrity and HOLD collection.
- READY_WITH_ITEM_ERRORS: some receipts are invalid, while independent valid exams remain processable.
- INPUT_ERRORS: no eligible exam was found because the frozen R1 receipts contain item-level authority/integrity errors; these are not Notion/access WAIT_RESOURCE failures.
- WAIT_RESOURCE: remote intake/state or required identity authority cannot be read.
- RESUME: a durable work/r2e-state checkpoint takes precedence over new intake.
- R2E_FINAL: every release-blocking issue is closed; all R1 HOLD findings have a type/UID route; META_ONLY may remain pending.
- R2E_MAIN_FINAL: production commit is present on remote main and the committed bytes and required targeted dependencies match the receipt.
- HUMAN_REQUIRED: source truth for a release-blocking issue remains undetermined after source recovery and the authorized repair routes.

Exam release and cohort hold-batch closure are separate results. META_ONLY issues may remain pending on an R2E_MAIN_FINAL exam. The cohort ledger is holdBatchStatus=CLASSIFIED only when every finding has a group decision with UID applications or a question-scoped upper-model case; it may separately report upperModelPendingCount.

## Targeted validation rules

- No change: quick exam integrity only; render NOT_REQUIRED with the unchanged R1 visual evidence reference.
- Existing L3/L4 mapping: validate selected keys are ACTIVE, verify parentage, and record each UID application. Do not rebuild global metadata.
- JS/answer/solution repair: run the correction protocol and validate only the changed UID and direct protected fields.
- SVG repair: use the current visual lane, freeze expected facts from source and solution, validate geometry/topology/labels, render only the changed question, then verify JS linkage.
- If a changed UID is consumed by a metadata/runtime feature, update that UID's record only. Do not regenerate all runtime packs or the whole catalog.

## Durable state

Use work/r2e-state for immutable run/exam ledgers, group decisions, per-UID applications, validation receipts, production commits, and final status. Intake branches are never modified by R2E. Main never receives snapshots, R1 sidecars, HOLD scratch files, or upper-model handoff payloads.\n
