# Archive Fast Engine v2 — Phase 0–7 completion record

`AP_Archive_Fast_Engine_v2_설계도_v1.4.md`를 구현 정본으로 사용했다. 설계도는 수정하지 않았다.

- Frozen baseline main: `ea6564cdda7a496412246522fab5940086b48a65`
- Baseline browser: Chrome `153.0.8010.36`, `1440×1000` and `390×1000`
- Worktree: `C:/Users/USER/Desktop/AP-fast-engine-v2-phase1a`
- Branch: `codex/archive-fast-engine-v2-phase1a`
- Delivery policy: every completed Phase was committed and pushed to this feature branch. `main` was neither merged nor pushed after the explicit user instruction recorded in `execution-scope.json`.

## Completion status

| Phase | Result | Feature-branch commit |
|---|---|---|
| 0 | PASS — fixed-SHA baseline, inventory, source/session and side-effect contract | `e4faa6b06` |
| 1A | PASS — immutable candidate, render transactions, 2PC, rollback, pending session promotion | `e4faa6b06` |
| 1B | PASS — answer snapshot pilot | `04e6c0594` |
| 1C | PASS — solution snapshots | `6a3a60d37` |
| 1D | PASS — exam snapshots | `5d7cac0d2` |
| 2 | PASS — connected authoritative build and atomic activation | `0b218cc66` |
| 3 | PASS — solution MathJax/measurement batching | `717456ede` |
| 4 | PASS — exam raw/tight measurement batching | `d53e94475` |
| 5 | PASS — cancellable idle prewarm | `3ebf9a9d0` |
| 6 | PASS — Layout Authority production promotion | `35d439b81` |
| 7 | PASS — legacy retirement review; retain legacy paths | `c939b5799`, `1d8e85b14` |

The final pushed commit is verified by `git ls-remote` in the final audit. It is intentionally a feature-branch commit, not a `main` commit.

## What the implementation does

- [render-state-normalizer.js](../../archive/render-state-normalizer.js) projects exactly the render-affecting source fields, copies and recursively freezes them, rejects unsupported graphs, and computes deterministic candidate/key digests.
- [screen-runtime.js](../../archive/screen-runtime.js) owns all render requests. It serializes foreground work, protects COMMIT with request-generation latest-wins checks, materializes source changes through a separate pending session, rolls back synchronous DOM/state/UI mutations, and retains only current-session snapshots.
- [screen-runtime-adapter.js](../../archive/screen-runtime-adapter.js) connects the runtime to the canonical `engine.html`, session-local render state, source loading, print readiness, QR effects, image/font readiness and request-scoped metrics.
- [snapshot-contract.js](../../archive/snapshot-contract.js) preserves completed answer, solution and exam DOM by MOVE ownership. It freezes 18 common snapshot gates and validates all 23 print preflight conditions on every print request. Cache hits run no authoritative build, MathJax typeset, image wait, pagination, QR redraw or DOM clone.
- [solution-render-executor.js](../../archive/solution-render-executor.js) batches independent staging work without changing continuation decisions. It retains individual chunk geometry where an adjacent chunk changes wrapping.
- [exam-render-executor.js](../../archive/exam-render-executor.js) performs raw/tight question measurement as one write/barrier/read group.
- [layout-authority.js](../../archive/layout-authority.js) now includes a source-free measured solution planner. [layout-materializer.js](../../archive/layout-materializer.js) is the production materializer for authority plans. `layoutPlanner=authority` is the default; `?layoutPlanner=observed` remains the rollback flag.
- Idle prewarm happens only after a committed visible frame. It has no external effects, cannot replace the active root, is cancelled by foreground/source/print work, and registers a READY snapshot only after the original session is still current.

## Phase 0 and Phase 1A evidence

Phase 0 froze the baseline and all mandatory entry conditions. The evidence is in:

- `phase0-inventory.json`
- `phase0-baseline.json`
- `phase0-parity.json`
- `phase0-seal.json`

The Phase 0 gate set is **10/10 PASS**. It covers baseline freeze, render-entry inventory, immutable input schema, pending-session lifecycle and the complete side-effect contract.

Phase 1A is **18/18 PASS**, recorded in `phase1a-gates.json`. It covers the canonical intent enum, CandidateRenderState, transitive immutability, key/build digest parity, every entry route, context isolation, pending materialization, target-session parity, render-state 2PC, synchronous COMMIT, rollback, status transition, request-generation semantics, direct bypass count 0, delivery/compensation contract and background side-effect count 0.

## Promotion evidence

`phase1b-gates.json`, `phase1c-gates.json`, `phase1d-gates.json`, `phase2-gates.json`, `phase3-gates.json`, `phase4-gates.json`, `phase5-gates.json` and `phase6-gates.json` are the per-phase evidence records.

The fixture denominator is:

- golden 8-question fixture: tables, MathJax, image, continuation and subjective layout tags;
- original image-heavy 24-question paper;
- 32-question type paper.

Each promotion path was exercised on desktop and mobile viewport profiles. The checks compare source order, text, page count, raw/tight ledger, continuation identity and chunk ranges, image dimensions, overflow, page/column geometry and actual browser screenshots.

Phase 1B–1D cache tests prove that an older `builtRequestGeneration` still activates a READY snapshot when the session/key/ownership contract matches. Cache-hit tests also inject a MathJax failure so a hidden typeset call would fail the test.

Phase 2 samples every animation frame during a held build. It proves there is no blank frame or mixed DOM/state/URL/tab frame. A forced retired-session MathJax cleanup failure keeps the new session committed, marks cleanup pending and succeeds on a later retry.

Phase 5 verifies automatic answer/solution prewarm after the visible frame, foreground/print/source cancellation, no background OS registration, QR-lock preservation and activation-only side effects.

Phase 6 runs observed and authority layout paths across 12 combinations: three fixtures × desktop/mobile × exam/solution. All parity checks passed. 24 authority/observed screenshots are retained here.

## Measured performance

Correctness gates are the promotion authority. Timings are measurements, not a claim that every fixture improved in every environment.

Phase 3 reduced solution batching cost without changing geometry:

| Fixture | Desktop MathJax calls | Desktop layout barriers | Desktop render ready |
|---|---:|---:|---:|
| golden | 18 → 3 | 50 → 36 | 1,372.7ms → 1,140.5ms |
| image-heavy 24 | 49 → 2 | 210 → 53 | 7,123.5ms → 4,592.8ms |
| 32-question | 65 → 2 | 437 → 81 | 21,481.7ms → 15,991.1ms |

Phase 4 reduced exam barriers:

| Fixture | Desktop layout barriers | Desktop render ready |
|---|---:|---:|
| golden | 14 → 7 | 707.5ms → 602.9ms |
| image-heavy 24 | 33 → 10 | 2,696.8ms → 2,346.3ms |
| 32-question | 42 → 11 | 3,199.0ms → 2,748.6ms |

Authority production promotion maintains parity but is not itself a latency promotion. `phase6-layout-browser.json` records a few solution timings that are slightly slower because the measured planner intentionally converges range geometry before materialization. This is retained as a material performance observation.

## Verification summary

- Phase 1A browser transaction scenarios: 19 PASS, 0 unexpected page errors.
- Phase 6 and 7 final relevant Node suite: 63 PASS, 0 FAIL.
- Cache snapshot browser tests: answer, solution and exam each PASS on desktop and mobile.
- Layout Authority browser comparison: 12 PASS observed-versus-authority combinations; 24 visual captures.
- Legacy review browser test: 12 PASS cases.
- Syntax checks cover engine inline scripts plus the modified external runtime/executor/test files.
- `git diff --check` passes before every phase commit.

Browser business API calls were route-intercepted for tests. No production blueprint or class assignment was created. Print validation uses `printDryRun=1`; it does not print to a physical printer.

## Legacy decision

The Phase 7 result is **RETAIN_LEGACY**. [phase7-retirement-review.json](phase7-retirement-review.json) is the authority.

The following paths remain tested and available:

- `?screenRuntime=legacy`
- `?renderer=legacy`
- `?examAuthority=legacy&solutionAuthority=legacy&answerAuthority=legacy`
- `?layoutPlanner=observed`
- `?snapshotCache=0`

The repository provides local transaction evidence but no durable production usage telemetry collector. The v1.4 policy therefore forbids removal in this release. No legacy renderer code was deleted.

## Remaining limitations

- There is no production telemetry sink yet, so Phase 7 deliberately does not retire rollback paths.
- Full archive-bank exhaustive browser rendering and physical-printer output were not part of the local browser fixture denominator.
- Layout Authority’s measured solution production path preserves correctness but has fixture-specific timing regressions noted above; that needs a separate performance release if it becomes a product SLA concern.

## Reproduction

Serve the repository root locally, then set `AP_PLAYWRIGHT_MODULE` to the locally installed Playwright package.

```text
node tests/archive-fast-engine-browser.cjs
node tests/archive-snapshot-browser.cjs
node tests/archive-prewarm-browser.cjs
node tests/archive-layout-browser.cjs
node tests/archive-legacy-browser.cjs
```

The exact fixture outputs and per-phase gate records in this directory are the review artifacts.
