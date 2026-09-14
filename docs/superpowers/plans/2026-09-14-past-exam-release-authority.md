# Past Exam Release Authority and Performance Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Seal Past Exam FINAL_AUDIT/release lineage and then reduce targeted-review, bound-file, evidence, and batch-scan I/O while preserving all correctness gates.

**Architecture:** Keep the existing Past Exam public entrypoints and canonical pipeline-core validators. Add one typed FINAL_AUDIT authority binding consumed by REVIEW_READY creation, validation, and release; add a durable release transaction journal with compare-and-resume semantics; add execution-local immutable snapshots and an inventory-scoped production candidate index.

**Tech Stack:** Node.js ESM, Node test runner, filesystem SHA-256 bindings, VM-loaded Archive JS, Playwright through the existing pipeline-core browser collector, temporary filesystem fixtures.

**Spec:** `docs/superpowers/specs/2026-09-14-past-exam-release-authority-design.md`

## Global Constraints

- Work only on `codex/jeilgo25-archive-exam` from start HEAD `72adf278dff6790820f34e4c5b2d83ca51b9ad2d` and preserve unrelated changes.
- Do not use `git add .`, `git add -A`, stash, reset, restore, clean, force push, or production archive files as test fixtures.
- Complete P1-1 through P1-5 and the full P1 regression gate before touching PERF-1 through PERF-3.
- Do not weaken or remove FINAL_AUDIT, closure, freshness, stale-file, authority, DB, index, render, or production-write checks.
- Legacy receipts that cannot prove the new authority contract must fail closed with explicit error codes.
- The only successful release state with `productionAuthorized: true` is `DONE`.
- Commit exactly the correctness work under `fix(past-exam): seal release authority and exam identity` and the performance work under `perf(past-exam): narrow review scope and repeated scans`.

---

### Task 1: Seal REVIEW_READY to canonical FINAL_AUDIT authority

**Files:**
- Create: `archive/tools/past-exam-pipeline/tests/release-authority-regression.test.mjs`
- Modify: `archive/tools/past-exam-pipeline/lib/review-ready.mjs`
- Modify: `archive/tools/past-exam-pipeline/lib/release-authority.mjs`
- Modify: `archive/tools/pipeline-core/work-batch.mjs`
- Modify: `archive/tools/past-exam-pipeline/create-review-ready.mjs`
- Modify: `archive/tools/past-exam-pipeline/contracts/review-ready-v1.schema.json`
- Modify: `archive/tools/past-exam-pipeline/tests/review-ready-release.test.mjs`

**Interfaces:**
- Produce `validateCanonicalFinalAuditAuthority(root, { authority, expected })` in `lib/release-authority.mjs`, returning `{ status: 'PASS'|'FAIL', errors, binding }` and never accepting a status-only object.
- Add required `finalAuditAuthority` and `finalAuditAuthoritySha` fields to the REVIEW_READY payload. The binding includes the work-batch state ref/SHA, run ref/SHA, run/revision/input SHA, candidate/asset refs and SHA, final launch identity, U1/U2/U3 request/response/evidence refs, canonical closure ref/SHA, and its object SHA.
- `createReviewReady()` must return `BLOCKED` when `finalAuditAuthority` is absent or not canonical; `validateReviewReady()` and the release path must revalidate it when `root` is available.

- [ ] **Step 1: Add the failing fake-authority regression.** Build a temporary fixture whose candidate, closure, and all six render/gate values are valid, then call:

```js
const ready = createReviewReady({
  root,
  run: { pipeline: 'past-exam', publicationIntent: 'FULL_EXAM', examId: 'target', runId: 'review-run', revision: 1 },
  closure: { status: 'PASS', productionAuthorized: false },
  finalAudit: { status: 'PASS' },
  candidateRef,
  assetRefs: [],
  candidateQuestions: [question],
  renderCases: passingRenderCases,
  gateStatuses: passingGates,
  finalClosureRef,
  openDefectCount: 0,
});
assert.equal(ready.status, 'BLOCKED');
assert.ok(ready.errors.includes('FINAL_AUDIT_AUTHORITY_REQUIRED'));
```

- [ ] **Step 2: Add the failing canonical-authority positive and tamper tests.** The positive fixture must contain a persisted work-batch state, latest freeze, one completed FINAL_AUDIT launch, three phase request/response/evidence records, a canonical audit report, and a canonical closure. Assert that the same binding passes creation and validation, then mutate one phase response or candidate byte and assert `FAIL`.
- [ ] **Step 3: Run only the new test and confirm RED.** Run `node --test archive/tools/past-exam-pipeline/tests/release-authority-regression.test.mjs`; the fake status-only case must fail because the current implementation accepts it.
- [ ] **Step 4: Implement the shared authority validator.** Reuse `readWorkBatch()`, `validateWorkBatchEvidence()`, `auditV2Run()`/the applicable canonical closure validator, and `aggregateWorkBatchAudit()`; check exact work-batch/run/revision/input/candidate/asset/launch/phase/closure lineage and current bound bytes. Do not create a second weak FINAL_AUDIT validator.
- [ ] **Step 5: Bind and revalidate the authority in REVIEW_READY.** Add the authority fields to the payload and object hash, pass them through the CLI, make work-batch review-ready validation require them, and emit explicit legacy errors for missing fields.
- [ ] **Step 6: Run the focused test and existing release tests.** Run `node --test archive/tools/past-exam-pipeline/tests/release-authority-regression.test.mjs archive/tools/past-exam-pipeline/tests/review-ready-release.test.mjs`; all updated positive fixtures must pass and all fake/tampered fixtures must remain blocked.

### Task 2: Require fresh browser production smoke after all mutations

**Files:**
- Modify: `archive/tools/past-exam-pipeline/lib/release-authority.mjs`
- Modify: `archive/tools/past-exam-pipeline/release-approved-exam.mjs`
- Modify: `archive/tools/pipeline-core/render.mjs` only if the adapter requires a narrow exported helper
- Modify: `archive/tools/past-exam-pipeline/tests/release-authority-regression.test.mjs`
- Modify: `archive/tools/past-exam-pipeline/tests/review-ready-release.test.mjs`

**Interfaces:**
- Produce a release-scoped `captureProductionSmoke()` adapter that reuses the existing pipeline-core Playwright collector and returns six current case witnesses.
- Extend `validateProductionSmokeRender(report, expectedCount, expectedBinding)` to require transaction identity, review-ready run identity, candidate/live JS SHA, production asset SHA, DB/index targets, renderer/runtime binding, actual browser witness, and post-index capture time.
- `executeApprovedRelease()` must ignore a CLI pre-read smoke JSON as final authority and call fresh capture after DB/index parity.

- [ ] **Step 1: Add three failing smoke tests.** Assert that a report with six PASS cases but no browser witness/timestamp/release identity fails; assert that a valid report bound to release A fails against release B; assert that a report captured before the recorded index-complete time fails.
- [ ] **Step 2: Run the focused smoke tests and confirm RED.** Run `node --test archive/tools/past-exam-pipeline/tests/release-authority-regression.test.mjs`; current validation should accept at least the incomplete six-case report.
- [ ] **Step 3: Implement the binding checks.** Require exact release transaction ID, `reviewReadyRunId`, all current production and target SHAs, a non-empty browser witness/capture ref, and timestamps satisfying `capturedAt >= indexCompletedAt`. Reject duplicate/replayed capture identity.
- [ ] **Step 4: Connect the existing browser collector.** Construct the post-promotion smoke run from the canonical run and live production refs, write only runtime evidence under the release runtime directory, and derive the six required case rows from fresh capture witnesses. Keep `inspect-production-artifacts.mjs` diagnostic-only.
- [ ] **Step 5: Update release orchestration and tests.** Call fresh smoke only after promotion, registration, and index target parity. A test-only injected collector must return a report with the same binding shape; a supplied stale `smokeReport` must not bypass the collector.
- [ ] **Step 6: Run focused smoke/release tests.** Verify positive fresh smoke, missing witness/timestamp, replay, pre-index timing, and current release completion behavior.

### Task 3: Bind promotion, registration, and index targets to one lineage

**Files:**
- Modify: `archive/tools/past-exam-pipeline/promote-reviewed-exam.mjs`
- Modify: `archive/tools/past-exam-pipeline/register-approved-exam.mjs`
- Modify: `archive/tools/past-exam-pipeline/rebuild-approved-index.mjs`
- Modify: `archive/tools/past-exam-pipeline/release-approved-exam.mjs`
- Modify: `archive/tools/past-exam-pipeline/lib/release-authority.mjs`
- Modify: `archive/tools/past-exam-pipeline/tests/release-authority-regression.test.mjs`
- Modify: `archive/tools/past-exam-pipeline/tests/review-ready-release.test.mjs`

**Interfaces:**
- Promotion returns normalized target path, target live JS SHA, asset-set SHA, exam/run/revision identity, and previous receipt bindings.
- Registration returns a receipt SHA and binds current target production bytes, `dbEntry.file`, `qCount`, promotion identity, review-ready SHA, approval SHA, and DB before/after SHA.
- Index rebuild accepts only a registration receipt that matches exam/target/run/revision and whose `afterSha256` still equals the current DB file SHA; it returns a receipt SHA and exact target/index bindings.

- [ ] **Step 1: Add failing cross-target tests.** Use temporary A and B target files and assert that A approval/promotion cannot register B, that an A registration receipt cannot rebuild B, and that modifying DB after registration blocks index rebuild.
- [ ] **Step 2: Run the tests and confirm RED.** Run the new test file; current code checks only part of exam/candidate identity and permits the gaps.
- [ ] **Step 3: Add exact promotion checks and receipt fields.** Verify promotion target path equals manifest path, live JS path equals target, current live bytes equal approved candidate SHA, and asset refs are still exact.
- [ ] **Step 4: Add exact registration checks and receipt fields.** Re-read current target JS, compare all run/revision/exam/candidate bindings, validate DB target file and question count, and include `registrationSha`.
- [ ] **Step 5: Add exact index checks and receipt fields.** Re-read DB and index, compare registration identity/SHA/target, compare target rows and qKeys, and include `indexReceiptSha`.
- [ ] **Step 6: Run focused release and registration tests.** Confirm existing same-target positive paths still pass and all cross-target/replay/tamper paths fail closed.

### Task 4: Add safe release transaction journaling and recovery

**Files:**
- Modify: `archive/tools/past-exam-pipeline/release-approved-exam.mjs`
- Modify: `archive/tools/past-exam-pipeline/lib/release-authority.mjs`
- Modify: `archive/tools/past-exam-pipeline/promote-reviewed-exam.mjs`
- Modify: `archive/tools/past-exam-pipeline/register-approved-exam.mjs`
- Modify: `archive/tools/past-exam-pipeline/tests/release-authority-regression.test.mjs`
- Modify: `archive/tools/past-exam-pipeline/contracts/release-transaction-v1.schema.json`

**Interfaces:**
- `executeApprovedRelease()` creates a unique runtime transaction directory and a `PREPARED` journal containing approval, target, production, DB, and index baselines.
- Every completed mutation appends an immutable `{ stage, target, before, after, identity, completedAt }` record. Returned HOLD receipts include `resumeFrom`, actual state, and recovery reason.
- Re-execution with the same approval resumes from matching after-SHA stages; mismatched current bytes produce HOLD and never force restore.

- [ ] **Step 1: Add failure-injection tests before implementation.** Inject failures after promotion, after DB write, and after index write/smoke. For each, assert the transaction says HOLD, `productionAuthorized` is false, and actual files/DB/index are either journaled completed or safely resumable.
- [ ] **Step 2: Run the failure tests and confirm RED.** Run `node --test archive/tools/past-exam-pipeline/tests/release-authority-regression.test.mjs`; current transaction output has no mutation journal or recovery state.
- [ ] **Step 3: Implement baseline preflight.** Before any write, read target production/asset state, DB bytes, and index bytes; compare approval baseline and expected identity. Stop with HOLD before promotion on any mismatch.
- [ ] **Step 4: Implement journaled mutations.** Record each target’s before/after SHA and identity around promotion, DB registration, and index rebuild. Preserve partial mutation details if a dependency throws.
- [ ] **Step 5: Implement resume/reconcile.** On an existing transaction, compare current bytes with recorded baseline/after states. Continue only from an exact known state; classify all other states as concurrent-writer HOLD. Do not use unconditional rollback.
- [ ] **Step 6: Verify DONE authority and failure recovery.** Run the three failure injections plus a successful same-approval resume; assert only the complete fresh-smoke path returns `DONE` and `productionAuthorized: true`.

### Task 5: Add course-aware canonical identity and collision HOLD

**Files:**
- Modify: `archive/tools/past-exam-pipeline/lib/exam-id.mjs`
- Modify: `archive/tools/past-exam-pipeline/lib/existing-exam.mjs`
- Modify: `archive/tools/past-exam-pipeline/run-batch.mjs`
- Modify: `archive/tools/past-exam-pipeline/tests/release-authority-regression.test.mjs`
- Modify: `archive/tools/pipeline-core/tests/speed-path.test.mjs`

**Interfaces:**
- Export the repository-standard course normalizer backed by the existing `COURSE_TOKENS`/`COURSE_ALIASES` semantics.
- `canonicalExamIdentity()` returns `{ year, school, grade, semester, examType, course }` with unknown course represented as incomplete.
- `findExistingProductionExam()` accepts an optional inventory index and returns all matching candidates or an explicit ambiguity/incomplete result; `existingExamPreflight()` maps those results to NEW, SKIP, FORCE, or HOLD.

- [ ] **Step 1: Add failing identity tests.** Assert that alias course spellings match, `수학II` and `확률과통계` do not match, missing course returns `HOLD_EXISTING_EXAM_IDENTITY_INCOMPLETE`, and duplicate same-base candidates return HOLD.
- [ ] **Step 2: Add the required real-shape regression.** Create temporary DB/filesystem records for `2025 강남여고 고2 2학기 기말` with existing `수학II`; query `확률과통계` and assert it is not `SKIP_EXISTING_EXAM`.
- [ ] **Step 3: Run identity tests and confirm RED.** Run `node --test archive/tools/past-exam-pipeline/tests/release-authority-regression.test.mjs archive/tools/pipeline-core/tests/speed-path.test.mjs`; current five-field identity will expose the mismatch.
- [ ] **Step 4: Implement course normalization and completeness.** Reuse aliases, select course from explicit course/subject/primary course fields, and make unresolved course a hard incomplete identity.
- [ ] **Step 5: Implement full candidate collection.** Collect DB and filesystem candidates, preserve partial/collision candidates, remove first-match returns, and use one canonical identity function for both sources.
- [ ] **Step 6: Run all P1 identity/preflight tests.** Confirm current representative DB fixtures and existing positive preflight paths remain valid, while ambiguous/incomplete identities HOLD.

### Task 6: P1 correctness gate and first commit

**Files:**
- Modify only files listed in Tasks 1–5 plus the new regression test and the design/plan documents.

- [ ] **Step 1: Run syntax checks for every changed JS/MJS.** Run `node --check` individually for each changed file, including release-authority, review-ready, release, promotion, registration, index, exam-id, existing-exam, run-batch, work-batch, and all changed test files.
- [ ] **Step 2: Run the complete P1 test set.** Run `npm --prefix archive/tools/past-exam-pipeline test`, `node --test archive/tools/pipeline-core/tests/release-authority-regression.test.mjs`, `node --test archive/tools/pipeline-core/tests/speed-path.test.mjs`, `node --test archive/tools/pipeline-core/tests/production-artifacts.test.mjs`, and the official `npm --prefix archive/tools/pipeline-core test` after resolving the baseline `sharp` environment dependency without changing repository dependencies unless required.
- [ ] **Step 3: Inspect results against the P1 checklist.** Do not start performance work if any fake authority, smoke, replay, transaction, or course identity test fails.
- [ ] **Step 4: Review the staged file list.** Run `git status --short`, stage only the explicit P1 paths, and inspect `git diff --cached --check` and `git diff --cached --stat`.
- [ ] **Step 5: Create the correctness commit.** Run `git commit -m "fix(past-exam): seal release authority and exam identity"` only after the P1 gate is green.

### Task 7: Preserve per-question targeted axis scope

**Files:**
- Modify: `archive/tools/past-exam-pipeline/resume-past-exam.mjs`
- Modify: `archive/tools/pipeline-core/review-isolation-runner.mjs`
- Modify: `archive/tools/pipeline-core/provider-bridge.mjs`
- Modify: `archive/tools/pipeline-core/speed.mjs` only where targeted map validation is defined
- Modify: `archive/tools/pipeline-core/tests/resume-runner.test.mjs`
- Modify: `archive/tools/pipeline-core/tests/provider-adapter-contract.test.mjs`
- Modify: `archive/tools/pipeline-core/tests/release-authority-regression.test.mjs`

**Interfaces:**
- Packets contain `targetedAxesByQuestionUid: { [questionUid]: string[] }` for targeted phases; the map is included in packet and provider request hashes.
- `phaseRequest()` forwards the map unchanged.
- Response validation accepts only requested `(questionUid, axis)` pairs and throws `PROVIDER_UNREQUESTED_EVIDENCE_SCOPE` for any extra pair.

- [ ] **Step 1: Add the failing q1/q2 scope test.** Build a targeted plan with q1:SOLUTION and q2:MATH_A2, call packet building, and assert the U3 packet map has exactly those two pairs rather than a phase-wide union.
- [ ] **Step 2: Add the failing unrequested-response test and run RED.** Return q1:MATH_A2 or q2:SOLUTION evidence from the synthetic provider and assert dispatch fails; run the focused test before implementation.
- [ ] **Step 3: Implement map sealing and validation.** Update packet construction/schema validation/request hashing and response evidence filtering to use pair keys; preserve reused evidence merge behavior and required-axis fail-closed behavior.
- [ ] **Step 4: Run targeted scope tests.** Confirm exact two-pair fresh scope, no silent filtering, packet SHA changes when the map changes, and full-audit behavior remains complete.

### Task 8: Deduplicate bound/evidence I/O within one audit or packet build

**Files:**
- Modify: `archive/tools/pipeline-core/v2-audit.mjs`
- Modify: `archive/tools/pipeline-core/closure.mjs`
- Modify: `archive/tools/past-exam-pipeline/resume-past-exam.mjs`
- Modify: `archive/tools/pipeline-core/provider-bridge.mjs` or `native-visual.mjs` only if the asset payload cache boundary belongs there
- Modify: `archive/tools/pipeline-core/tests/release-authority-regression.test.mjs`
- Modify: `archive/tools/pipeline-core/tests/production-artifacts.test.mjs`

**Interfaces:**
- `createAuditSnapshot(root, run)` is operation-local and caches bound bytes/SHA/parsed JSON/VM bank objects by exact ref identity; it is discarded when the caller returns.
- `loadBoundQuestionBanks(root, run, { snapshot })`, `projectionContext(..., snapshot)`, and `computeV2AxisInputShas()` share the snapshot without changing output hashes.
- `packetInputs()` creates a local evidence index and local immutable asset payload cache, passes one computed source/solution asset result to each payload, and makes `renderWitnesses()` use the index.

- [ ] **Step 1: Add instrumentation tests before implementation.** Count `readBoundFile`/filesystem reads for repeated identical refs and assert one read per ref within a single audit/packet-build invocation; assert a second invocation reads again.
- [ ] **Step 2: Add packet call-count tests and run RED.** Instrument source/solution asset payload helpers and evidence scan helpers; assert current duplicate calls exceed the new expected bound.
- [ ] **Step 3: Implement the audit-local snapshot.** Cache only after the first boundary read and preserve all stale SHA checks; use immutable structured data for parsed content.
- [ ] **Step 4: Implement packet-local evidence/asset caches.** Index `run.evidence` by UID/axis, compute source/solution payloads once, and reuse identical immutable refs without a global cache.
- [ ] **Step 5: Run output-parity tests.** Assert packet hashes, evidence semantics, and canonical results are unchanged apart from the targeted-axis map; assert stale mutation after cache disposal is still detected.

### Task 9: Deduplicate batch production scans

**Files:**
- Modify: `archive/tools/past-exam-pipeline/run-batch.mjs`
- Modify: `archive/tools/past-exam-pipeline/lib/existing-exam.mjs`
- Modify: `archive/tools/pipeline-core/tests/release-authority-regression.test.mjs`
- Modify: `archive/tools/pipeline-core/tests/speed-path.test.mjs`

**Interfaces:**
- `scanProductionCandidates({ archiveRoot, dbEntries, onScan })` returns one complete DB/filesystem candidate collection.
- `indexProductionCandidates(candidates)` maps canonical identities to arrays, preserving collisions and incomplete candidates.
- `buildInventory()` constructs one index per inventory build, shares each canonical lookup across problem/answer/solution items, and performs target-specific existence/identity/SHA revalidation immediately before a real job.

- [ ] **Step 1: Add a scan-count regression.** Use a temporary source set with multiple PDFs and a production tree; inject a scan counter and assert one production full scan for the inventory build, not one per PDF.
- [ ] **Step 2: Add collision/new-registration tests and run RED.** Assert index construction preserves two candidates as ambiguous and a target-specific revalidation sees a file added after inventory construction.
- [ ] **Step 3: Implement candidate collection/indexing.** Keep the existing no-index fallback for standalone callers, but let batch inventory pass its local index.
- [ ] **Step 4: Update buildInventory sharing.** Cache preflight results by canonical source identity for all source kinds and revalidate selected candidates at job boundary.
- [ ] **Step 5: Run performance and correctness tests.** Confirm one-scan instrumentation, collision HOLD, new-registration visibility, course-aware map keys, and existing inventory output shape.

### Task 10: Final regression, review, second commit, and push

**Files:**
- Modify only performance files/tests listed in Tasks 7–9 if additional fixes are required.

- [ ] **Step 1: Run `node --check` for every changed JS/MJS.** Record each command and exit status.
- [ ] **Step 2: Run the final relevant suites.** Run the new regression tests, past-exam tests, release path tests, existing-exam preflight tests, provider bridge/targeted reuse tests, V2 audit tests, and the official pipeline-core check.
- [ ] **Step 3: Verify all eight required outcomes from actual test output.** Record fake FINAL_AUDIT blocking, fresh smoke blocking, cross-target replay blocking, transaction safety/recovery, subject-aware identity, exact UID-axis targeting, I/O reduction, and batch scan reduction.
- [ ] **Step 4: Perform code-review checkpoint.** Inspect the complete diff against the design and requirements, verify no assertion/gate was removed, and resolve every Critical/Important finding before commit.
- [ ] **Step 5: Inspect the performance staged diff.** Run `git status --short`, stage only explicit PERF paths, then run `git diff --cached --check`, `git diff --cached --stat`, and inspect the full staged diff.
- [ ] **Step 6: Create the performance commit.** Run `git commit -m "perf(past-exam): narrow review scope and repeated scans"`.
- [ ] **Step 7: Verify both commits and push.** Run `git status --short`, `git log -2 --oneline`, `git show --stat --oneline HEAD~1`, and `git show --stat --oneline HEAD`; then run `git push origin codex/jeilgo25-archive-exam` without force.
- [ ] **Step 8: Prepare the final report.** Report `RESULT: PASS` only if every P1/PERF item and all relevant verification commands are freshly green; otherwise report `FAIL` with the exact failing gate and evidence.

