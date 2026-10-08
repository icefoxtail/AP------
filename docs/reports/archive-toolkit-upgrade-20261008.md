# Cross-run Archive toolkit upgrade — 2026-10-08

User scope: implement the reviewed speed/accuracy improvements first, report completion, then proceed to a separate new pilot. No completed exam is re-reviewed, no historical freeze/receipt is converted in place, and no new pilot is launched during this tooling work.

## Delivered routes

1. Student bundle adapter + immutable freeze + targeted postfreeze disclosure: native rows and legacy questions/requiredAssets are supported; object choice display aliases, shared material, spacing and required assets are retained. Unknown/answer-bearing fields fail rather than get discarded. Original bundle/freeze bytes and SHA remain immutable. Current student parity and original freeze SHA are required before stored-field disclosure.
2. Canonical unit-order inspection: reads actual active L1 master rows/SHA before CREATE handoff. Known wrong order and unknown authority are flagged; no numerical-suffix inference or semantic reclassification.
3. Separate existing-target registration prepare/update: new-target duplicate refusal remains. Current shared R1/R2/R3 validators, exact current source/assets/proof/baseline/HEAD and UID/ordinal/runtime invariance are required. Explicit reviewed physical Meta corrections are allowlisted, source-parity-bound and qid-level R1 META PASS-bound. Changed target runtime approval resets to pending/non-selectable; old rows/proofs remain in the plan. Default dry-run, explicit apply, output parse/deep non-target checks and limited rollback.
4. Immutable publication checkpoint CLI: checks/running/failure/completed statuses and command exit/output hashes are bound to exact inputs before commit. Resume uses immutable histories, distinguishes unrelated drift and target overlap, and leaves actual Git actions to ROOT. It is not a force-replay or automatic approval system.
5. Bounded binary Git batch reads: one tree, de-duplicated object IDs, 64 MiB aggregate chunks and 128 MiB maximum individual blob. Type/id/size/content and trailing-byte checks remain. Normal/static closeout callers preload their required references.
6. Root dispatcher with stage timing: locked roster, FIFO, one exam per stage, fresh sessions and same-session repair continuation, state SHA/lock, verified sealed-event intake. Root-safe routing references never pass raw answer-bearing roster records to R1/R2. R3 still requires separate actual render/waiver/publication gates.
7. Preview conversion cache: source SHA + full transform parameters + converter version + byte-verified outputs; misses use the approved converter, hit still requires actual reviewer opening. Source/parameters/version changes invalidate cache; corrupt output fails. Assigned temporary exam scope only.
8. Declared current asset reference binding: only explicit CURRENT_ASSET records can update, and changed bytes require worker-reviewed-current acknowledgements. Historical review/freeze hashes are never recursively overwritten.

## Validation observed

- Existing-target/publication focused tests: 30 PASS. Includes actual shared stage validators, true 99→2 unit-order correction and source-approved subunit change, rejection without R1 META PASS, stale candidate/source refusal, current source/assets/proofs/baseline drift refusal, dry-run/explicit apply, preserved UID/runtime and non-target projections, pending-review reset and limited-write rollback.
- Root compatibility/toolkit/closeout tests: 35 PASS. Includes immutable source/freeze, targeted disclosure, full input/asset checks, binary parsing, event invalidation, dispatcher concurrency/freshness/state-lock guards and cache invalidation.
- Actual previously incompatible H2 bundle: 20 qids and 7 assets normalized, zero fields dropped, original bundle unchanged, no freeze created and no math re-review.
- Current full runtime guard: 42 PASS with original corpus/thresholds; browser engine/UI/source/data are unchanged by this upgrade.
- Registration candidate and existing shared artifact/runtime suites passed in the combined check. Old valid source receipts remain supported; this tooling check is not retroactive exam review.

Single local readback benchmark (see adjacent JSON): 100 identical files, 43,415,165 bytes. Sequential 10,161.9761 ms; bounded batch 597.0513 ms; raw-byte parity PASS. Both timings include a tree query. Order/cache effects remain and this is not an end-to-end pilot speed claim.

The initial report-only existing update prototype was rejected during ROOT review because it allowed only fingerprints and could not update real Meta/order fields. The same MASTER session completed the usable prepare/dry-run/apply route and pending-review policy before publication. Production datasets were not changed by fixture tests.

Authoritative CLI usage is in `archive/tools/CODEX_MAINTENANCE.md`; CURRENT execution and role instructions were updated. A separate pilot is needed to measure actual stage time and whole-run throughput.
