# AP MATH Review/Audit Fast Runtime Design

**Date:** 2026-09-15  
**Scope:** `archive/tools/pipeline-core/`, `archive/tools/past-exam-pipeline/`, and the production archive render runtime  
**Baseline:** `5ffa0fdd7d8d4309fafbaf637bbe3fc976103c31` plus the clean merge of `origin/main` at `e45e8ceb1f773058e36f443864410796d1fddb99`

## Goal

Bring the review and release pipeline into alignment with the production Fast Runtime while preserving the existing U1/U2/U3 isolation, fail-closed evidence contracts, exact six-case render closure, targeted recheck semantics, and release authority boundaries. The implementation removes duplicate expensive work only when immutable identity proof is available; it never substitutes a cheaper check for an independent quality or release gate.

## Existing contract that remains authoritative

1. U1, U2, and U3 are independent packets. Each phase has its own reviewer/session/context, `priorReviewVisibility: NONE`, and deterministic merger input.
2. Source, UID, question-quality, render, and release evidence bind exact raw bytes through SHA/ref/lineage fields. A stale or incomplete binding is a block.
3. The final render denominator is exactly `exam/desktop`, `exam/mobile`, `solution/desktop`, `solution/mobile`, `answer/desktop`, and `answer/mobile`.
4. A canonical final audit and a separate production release transaction remain distinct. `REVIEW_READY` is not production authorization. External approval, target-only DB/index parity, and production smoke render remain required.
5. A targeted recheck may reuse only immutable, independently validated PASS evidence. Missing or ambiguous axis proof expands to fresh review.

## Design

### 1. Runtime readiness adapter

`archive/tools/pipeline-core/render.mjs` will wait on the production runtime's existing readiness authority: `archiveScreenRuntime.whenIdle()` when the Fast Runtime is present, otherwise `window.__AP_RENDER_READY__`. The adapter validates the resolved transaction outcome, the active snapshot/session binding, `data-ap-render-ready`, and the production readiness tracker. The current geometry-stability loop remains as a post-readiness mechanical guard; it is not the primary completion decision.

The adapter fails closed for rejected, aborted, discarded-stale, missing-snapshot, or mismatched-session outcomes. It records the transaction id, snapshot id, readiness evidence, and runtime metrics in capture telemetry.

### 2. Capture session reuse with parity fallback

The collector launches one browser per capture operation. It creates at most one desktop context and one mobile context per candidate, then performs the three normal production mode transitions in each context. Each transition goes through the runtime request API and the readiness adapter. Before reusing a context, the collector checks candidate/source identity, mode, viewport, question count/order, asset bindings, runtime transaction identity, snapshot identity, MathJax/fonts, error state, and pagination/solution/answer block parity.

If any parity proof is absent or fails, the collector opens a fresh context for that case and writes a machine-readable fallback reason. The six-case evidence denominator is unchanged in either path.

### 3. Evidence-safe screenshot deduplication

Screenshot bytes are encoded by the browser as before, but an operation-local capture store reuses an existing immutable file reference when the exact PNG SHA and case/viewport identity match. Witnesses continue to carry their question UID, case, viewport, continuation, placement, clipping/geometry, screenshot SHA, and block identity. The dedup store never merges different pixels or drops a continuation block; it only avoids writing byte-identical files twice.

### 4. Pre-capture render reuse authority

`render-impact.mjs` will expose a pre-capture eligibility decision bound to candidate SHA, relevant asset set SHA, runtime bundle SHA, engine/release/layout/render-policy identity, viewport/font/MathJax identity, mode, QPP, and semantic render dependencies. A missing or untrusted identity returns `FRESH_REQUIRED`. A prior capture/review can be reused only when the identity proof, lifecycle receipt, current run binding, and six-case scope all match. Existing post-capture signature comparison remains an additional guard.

### 5. Canonical audit snapshot

The first heavy `auditV2Run` evaluation for an immutable `(runId, revision, inputSha, CORE_SHA, evidence-set, closure, runtime/release)` identity is persisted as an immutable canonical audit snapshot. Downstream `REVIEW_READY` and release validators validate the snapshot ref, SHA, and identity fields, then perform only cheap structural/binding checks. If any identity differs, the validator invokes a fresh heavy audit and does not accept the old snapshot.

The snapshot is a persisted artifact, not a process-memory memo. It includes the complete audit result, evaluator/core identity, evidence set identity, source/UID authority identity, quality/release closure identity, and runtime/release identity.

### 6. Exact telemetry

Telemetry is additive and measured at the actual operation boundaries. It records orchestration phases, runtime/render subphases, fresh/reused phase and axis sets, screenshot counts/bytes/encode/write time, provider invocation count, and fresh model-turn count. Provider count is derived from actual provider receipts/launch ids; model count is summed from attested fresh model turns and never inferred from browser launches or phase count.

## Error handling

- Every reuse path is fail-closed and returns a reason code plus the identity fields that failed.
- A runtime transaction failure or stale snapshot prevents capture PASS.
- A malformed canonical snapshot is treated as absent and forces a fresh audit.
- A duplicate or conflicting audit identity is a `REVIEW_CONFLICT`/authority failure, never an automatic winner.
- Partial production mutations remain journaled and resumable through the existing release transaction.

## Test strategy

Each loop uses red/green tests for its new behavior, direct `node --check` for every modified JS/MJS file, the loop-specific tests, and adjacent regressions. Browser tests run with the bundled Node packages and an installed Chrome channel. The final seal runs the full pipeline-core and past-exam suites, six-case browser capture parity on isolated real archive fixtures, and a before/after telemetry comparison.

## Non-goals

- No weakening or removal of U1/U2/U3 review.
- No desktop-only or exam-only render substitution.
- No process-local-only cache as an authority.
- No mutation of unrelated archive questions, user UI text, or production data during benchmark setup.
