# Archive 2.0 interaction and output storage fixes

Date: 2026-10-06 (Asia/Seoul). Verified starting main: `348de69cf16ca3dc589affc3571dfefd32f72800`.

## Behavior

- Compose previously rebuilt scope membership repeatedly during one synchronous render and validated every archive item before applying the selected filters. Reuse scope results within a single render and filter before quality validation. Invalidate the cache after every render so the next interaction rechecks current catalog quality, filters and exclusions.
- Finder opened a blank popup and closed it when IndexedDB failed to open with `Internal error. (UnknownError)`. For that error only, the shared output store can transfer one complete sealed envelope through an atomic localStorage key. Readers retain request/owner/mode/expiry/hash validation. Cleanup remains owner/request scoped; unrelated login and draft data is preserved. Quota and serialization failures still fail explicitly.
- Update producer/reader cache versions together. Register the performance and storage regressions in the project test runner.

## Verification

- Scoped performance, transport, contract, envelope routing, capacity and PDF readiness: 28/28 pass on current main code.
- Reader controls: 4/4 pass. Storage and reader checks rerun after final formatting: 14/14 pass.
- Production-size Compose render: all curricula 666ms, 2015 291ms, 2022 215ms; checkbox 252ms in the Node runtime harness.
- Chrome verification against the deployed code with only the target scripts replaced: curriculum interactions improved from 5.5–7.6 seconds to 0.26–0.71 seconds; checkbox from 11.3 seconds to 0.88 seconds.
- Chrome UnknownError injection reproduced the closing popup before the fix. The patched producer and reader rendered exam 6 pages, answer 1 page and solution 7 pages under the same injected failure.
- Syntax checks, `git diff --check` and managed skill verification pass.

## Full runner and existing failures

`node tools/run-tests.js` completed: 195 pass / 19 fail, 214 commands total (8 quarantined files excluded by the existing runner). The new worktree initially lacked worker dependencies. Reusing installed dependency versions matching the worker lockfile and rerunning the affected commands resolved four failures: PDF artifacts, saved-paper runtime, worker/D1 runtime and UX retrieval/D1. Aggregate result after these rechecks: 199 pass / 15 fail.

Each remaining failure was reproduced with the original main browser runtime and HTML substituted through a read-only test loader. They were not changed to make this hotfix pass:

- `tests/apmath-student-teacher-preview.test.js`
- `tests/archive-inline-view-label.test.js`
- `tests/archive-target-selection-phase3-contract.test.js`
- `tests/m2-o11-create-gate-manual.test.js`
- `tests/m2-o15-create-gate-manual.test.js`
- `tests/m2-o26-create-gate-manual.test.js`
- `tests/m2-o27-create-gate-tempcreate1.test.js`
- `tests/m2-o28-create-gate-thanos1.test.js`
- `tests/m2-o32-create-gate-thanos5.test.js`
- `tests/m2-o33-create-gate-thanos5.test.js`
- `tests/m2-o34-create-gate-tempcreate1.test.js`
- `tests/m2-temp-create3-o25-create-gate.test.js`
- `tests/m2-temp-create4-o29-create-gate.test.js`
- `tests/print-render-authority-mixer-ecosystem.test.js`
- `tests/student-portal-omr-history-routes.test.js`

Worker/D1 tests intentionally report no Cloudflare Browser Rendering binding in the local fixture; their assertions and process exit passed. The hotfix does not change exam source content, math answers, metadata classifications or production assignment records.
