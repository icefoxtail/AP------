# AP MATH Review/Audit Fast Runtime Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align review rendering, targeted recheck, canonical audit, and release validation with the production Fast Runtime without weakening any immutable evidence or release contract.

**Architecture:** Keep the existing pipeline-core contracts as the authority and add narrow adapters for runtime readiness, render reuse identity, persisted audit snapshots, and exact telemetry. Reuse is always a receipt-backed decision; fresh browser capture and independent review remain available as the fallback path.

**Tech Stack:** Node.js ESM, Playwright/Chrome, existing archive Fast Runtime (`APScreenRuntime`/`APPrintRuntime`), JSON SHA-bound evidence, Node test runner.

**Spec:** `docs/superpowers/specs/2026-09-15-review-audit-fast-runtime-design.md`

## Global Constraints

- Preserve U1/U2/U3 independence, deterministic merger behavior, and `REVIEW_CONFLICT` semantics.
- Preserve exact raw-byte/SHA/ref/revision/runId/freeze lineage binding and fail closed on stale evidence.
- Preserve exactly six render cases: exam/desktop, exam/mobile, solution/desktop, solution/mobile, answer/desktop, answer/mobile.
- Preserve actual browser fresh capture, production runtime readiness, production smoke render, external approval, DB parity, and index parity.
- Never use `git add .`, `git add -A`, stash, reset, clean, or unrelated restore.
- Each loop ends with targeted/adjacent verification and one logical commit containing only explicitly staged files.

---

### Task 0: Seal the merged baseline and immutable fixture lineage

**Files:**
- Modify: `archive/tools/past-exam-pipeline/tests/release-authority-fixture.mjs`
- Add: `docs/superpowers/specs/2026-09-15-review-audit-fast-runtime-design.md`
- Add: `docs/superpowers/plans/2026-09-15-review-audit-fast-runtime-plan.md`
- Test: `archive/tools/pipeline-core/tests/resume-runner.test.mjs`

**Interfaces:**
- `prepareCanonicalRun(fixture, run)` must write all run-bound authority refs to immutable revision-scoped paths.
- Existing test fixtures must continue to expose `run.pastExamCompletionRef`, `run.inputs`, and valid SHA refs.

- [ ] Write the failing regression assertion that prepares revision 1 and revision 2 in one fixture and confirms every ref in revision 1 still reads with its declared SHA.
- [ ] Run `node --test archive/tools/pipeline-core/tests/resume-runner.test.mjs` and observe the current `STALE_FILE` failure.
- [ ] Change only fixture output paths so revision-bound authority files cannot be overwritten by later revisions.
- [ ] Rerun the focused test, then direct pipeline-core tests serially with `APMATH_NODE_MODULES` set to the bundled dependency directory.
- [ ] Commit only the spec, plan, and fixture/test changes as the Loop 0 baseline seal.

### Task 1: Add exact orchestration and render telemetry

**Files:**
- Modify: `archive/tools/pipeline-core/speed.mjs`
- Modify: `archive/tools/past-exam-pipeline/resume-past-exam.mjs`
- Modify: `archive/tools/pipeline-core/provider-bridge.mjs`
- Modify: `archive/tools/past-exam-pipeline/lib/review-ready.mjs`
- Test: `archive/tools/pipeline-core/tests/speed-path.test.mjs`
- Test: `archive/tools/pipeline-core/tests/provider-adapter-contract.test.mjs`

**Interfaces:**
- `speedTelemetry()` returns additive phase timing and fresh/reuse sets.
- `resumeTelemetry()` derives provider/model counts from persisted receipts, not launch count.

- [ ] Add a failing test for fresh model turns differing from provider launches and for `freshPhaseSet`/`reusedPhaseSet` parity.
- [ ] Implement operation-local timers and receipt aggregation; keep missing attestation as `null`/blocked rather than guessing.
- [ ] Add render subphase counters to capture payloads and preserve existing fields.
- [ ] Run speed/provider/review-ready tests and all modified `node --check` commands.
- [ ] Commit Loop 1.

### Task 2: Route capture completion through the production runtime authority

**Files:**
- Modify: `archive/tools/pipeline-core/render.mjs`
- Modify: `archive/tools/pipeline-core/runtime.mjs`
- Test: `archive/tools/pipeline-core/tests/integration.test.mjs`
- Test: `archive/tools/pipeline-core/tests/machine-evidence.test.mjs`

**Interfaces:**
- Add an internal `waitForProductionReadiness(page, timeoutMs)` adapter using `archiveScreenRuntime.whenIdle()` or `window.__AP_RENDER_READY__`.
- Capture records transaction/snapshot/readiness evidence and rejects failed/stale outcomes.

- [ ] Add a browser-fixture test proving a rejected runtime readiness promise cannot produce capture PASS.
- [ ] Run it red against the current selector/stable-frame completion path.
- [ ] Implement the adapter and retain geometry stability only as a post-readiness guard.
- [ ] Run the real browser integration fixture for all six cases and the adjacent runtime tests.
- [ ] Commit Loop 2.

### Task 3: Reuse desktop/mobile capture sessions with parity fallback

**Files:**
- Modify: `archive/tools/pipeline-core/render.mjs`
- Modify: `archive/tools/pipeline-core/render-impact.mjs`
- Test: `archive/tools/pipeline-core/tests/integration.test.mjs`
- Test: `archive/tools/pipeline-core/tests/speed-path.test.mjs`

**Interfaces:**
- One browser remains the outer lifetime; one context per viewport may carry exam → solution → answer transitions.
- Any unsafe transition returns a recorded `FRESH_CONTEXT_FALLBACK` reason and still emits the same six cases.

- [ ] Add a failing fixture assertion for context reuse, transition identity, and fallback telemetry.
- [ ] Implement mode transition through the runtime request API and validate count/order/assets/transaction/snapshot/MathJax/geometry parity.
- [ ] Preserve the existing fresh-page fallback for failed parity.
- [ ] Run shadow capture on one synthetic candidate and compare all six semantic fields.
- [ ] Commit Loop 3.

### Task 4: Deduplicate immutable screenshot bytes without reducing witnesses

**Files:**
- Modify: `archive/tools/pipeline-core/render.mjs`
- Modify: `archive/tools/pipeline-core/render-impact.mjs`
- Test: `archive/tools/pipeline-core/tests/integration.test.mjs`
- Test: `archive/tools/pipeline-core/tests/v2.test.mjs`

**Interfaces:**
- A capture-local PNG store maps `(caseKey, viewport, pngSha)` to one immutable file ref.
- Every question and continuation block keeps its own geometry/placement/witness identity while referring to the shared image ref.

- [ ] Add a failing test with duplicate pixels that expects one file write and complete witness coverage.
- [ ] Implement SHA-keyed write deduplication and encode/write counters.
- [ ] Re-run six-case semantic closure and confirm no continuation denominator is dropped.
- [ ] Commit Loop 4.

### Task 5: Establish pre-capture identity proof and fresh invalidation

**Files:**
- Modify: `archive/tools/pipeline-core/render-impact.mjs`
- Modify: `archive/tools/pipeline-core/work-batch.mjs`
- Modify: `archive/tools/past-exam-pipeline/resume-past-exam.mjs`
- Test: `archive/tools/pipeline-core/tests/speed-path.test.mjs`
- Test: `archive/tools/pipeline-core/tests/v2.test.mjs`

**Interfaces:**
- `evaluateRenderReuseEligibility(previousRun, currentRun, identity)` returns `REUSE_ELIGIBLE` or `FRESH_REQUIRED` with reason codes.
- Global runtime/layout/font/MathJax/viewport/policy changes invalidate the affected render scope or all cases.

- [ ] Add red tests for unchanged identity, solution/asset edits, runtime/layout edits, stale receipt, and missing identity.
- [ ] Implement the identity proof and bind it into targeted dispatch before browser capture.
- [ ] Keep post-capture `detectRenderImpact()` as an additional guard.
- [ ] Commit Loop 5.

### Task 6: Make semantic targeted recheck telemetry and dispatch exact

**Files:**
- Modify: `archive/tools/pipeline-core/speed.mjs`
- Modify: `archive/tools/past-exam-pipeline/resume-past-exam.mjs`
- Test: `archive/tools/pipeline-core/tests/speed-path.test.mjs`
- Test: `archive/tools/pipeline-core/tests/resume-runner.test.mjs`

**Interfaces:**
- `buildTargetedDispatchPlan()` returns exact `freshPhaseSet`, `reusedPhaseSet`, `freshAxisSet`, and `reusedAxisSet`.
- Actual provider receipts must match these sets; missing proof forces fresh axes.

- [ ] Add revision fixtures for answer, solution, SVG, source, metadata-only, global invalidator, and no-op changes.
- [ ] Assert expected phase/axis sets and actual provider request logs.
- [ ] Correct count derivation and fail closed when packet/reuse proof is incomplete.
- [ ] Commit Loop 6.

### Task 7: Persist one canonical audit evaluation per immutable identity

**Files:**
- Create: `archive/tools/pipeline-core/canonical-audit-authority.mjs`
- Modify: `archive/tools/pipeline-core/v2-audit.mjs`
- Modify: `archive/tools/past-exam-pipeline/resume-past-exam.mjs`
- Modify: `archive/tools/past-exam-pipeline/lib/release-authority.mjs`
- Test: `archive/tools/pipeline-core/tests/v2.test.mjs`
- Test: `archive/tools/past-exam-pipeline/tests/release-authority-regression.test.mjs`

**Interfaces:**
- `createCanonicalAuditSnapshot(root, run, audit)` writes an immutable snapshot with identity and SHA.
- `loadCanonicalAuditSnapshot(root, ref, expected)` performs cheap exact binding validation.
- `evaluateCanonicalAuditOnce()` reuses only an exact persisted snapshot; otherwise it calls `auditV2Run()` once and persists a new snapshot.

- [ ] Add a failing test that calls REVIEW_READY and release validation twice and counts one heavy audit for the same identity.
- [ ] Implement snapshot identity including runId, revision, inputSha, CORE_SHA, evidence set, source/UID authority, quality/release closure, and runtime/release identity.
- [ ] Replace downstream unconditional heavy recomputation with snapshot validation plus fail-closed fallback.
- [ ] Commit Loop 7.

### Task 8: Reduce REVIEW_READY/release validation to cheap binding checks

**Files:**
- Modify: `archive/tools/past-exam-pipeline/lib/review-ready.mjs`
- Modify: `archive/tools/past-exam-pipeline/lib/release-authority.mjs`
- Modify: `archive/tools/past-exam-pipeline/create-review-ready.mjs`
- Test: `archive/tools/past-exam-pipeline/tests/review-ready-release.test.mjs`
- Test: `archive/tools/past-exam-pipeline/tests/release-authority-regression.test.mjs`

**Interfaces:**
- `validateCanonicalFinalAuditAuthority()` accepts only a canonical snapshot reference whose identity exactly matches the current run.
- REVIEW_READY and release still validate six cases, closure, external approval, DB/index parity, and production smoke.

- [ ] Add a regression test proving the authority validator does not rerun heavy evaluation after a valid snapshot exists.
- [ ] Implement cheap SHA/ref/closure checks and explicit snapshot validation.
- [ ] Run release transaction tests with actual Chrome-channel smoke and verify failure remains HOLD when smoke is unavailable.
- [ ] Commit Loop 8.

### Task 9: Execute real-exam shadow benchmark and final seal

**Files:**
- Modify: `archive/tools/past-exam-pipeline/tests/performance-regression.test.mjs`
- Create: `archive/tools/past-exam-pipeline/tests/fast-runtime-shadow-benchmark.test.mjs`
- Create: `docs/reports/review-audit-fast-runtime-final.md`

**Interfaces:**
- Benchmark records frozen input identity, old/new implementation, six-case parity, fresh/reused partitions, and all telemetry fields.
- The final report is the only integrated report and contains Loop 0–9 commit SHAs, tests, fixture coverage, before/after metrics, P50/P95 when available, and remaining risk.

- [ ] Select isolated real archive fixtures by question/image/SVG/formula/solution/continuation/mobile-boundary coverage.
- [ ] Run no-change, solution, asset, and global invalidator revisions through old/new shadow capture.
- [ ] Compare semantic/render/evidence/release parity and write measured before/after values.
- [ ] Run the complete serial pipeline-core and past-exam suites plus final static checks.
- [ ] Commit Loop 9 only after every final hard gate passes.
