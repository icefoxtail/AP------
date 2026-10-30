# CI / Actions signal hygiene (S16, 2026-10-29)

Goal: a red `CI` run on `main` must mean "something is wrong with this commit". Before this change it did not:
136 CI runs between 10-26 and 10-29, 123 failed. Technical gates are unchanged; only the causes of false red were removed.

## Root causes and fixes

| # | Observation | Class | Fix |
|---|-------------|-------|-----|
| 1 | Derived registration data is committed to `main` by `github-actions[bot]` (`chore(archive): sync registration artifacts [skip ci]`). GitHub never starts a `push` workflow for a `GITHUB_TOKEN` push, so the tip of `main` was never tested. The human commit before it (stale derived files) went red and the bot's fix was never verified. | blind spot | `ci.yml` gets a `workflow_run` trigger (after `Archive Pages Release` / `Archive Reviewed Exam Meta Register`). `tools/ci/ci-tip-plan.mjs` runs the suite on the current tip only when that SHA has no CI verdict (loop-free, no double runs). |
| 2 | `meta-foundation-global-compile` (and `derivative-runtime`, `integral-calculus-runtime`, `limit-continuity-runtime`, `middle-geometry-runtime`): `compiled/*`, `canonical/registry_index.json`, geometry runtime/evidence are pure functions of the canonical packs but no `main` pipeline recompiled them. Any human commit that touched canonical packs without recompiling left every later commit red (e.g. `3dd29226` .. `b71def20`). | stale derived artifact | `tools/ci/archive-pages-registration-derive.sh` runs `compile-meta-foundation --write` first (non-blocking: a canonical defect is a warning, CI's `global-compile` test reports it). Outputs added to the Pages registration commit paths and guard allow-list. |
| 3 | `Verify Git-managed project skills`: `main is not synchronized with origin/main (ahead=0, behind=2)` (10 runs). The check compared the tested commit with a freshly fetched `origin/main`, so any push that landed while the job ran failed it. | race, not a defect | Push / re-test / dispatch runs compare with the tested commit (`--upstream HEAD`); pull requests keep the strict "contains latest origin/main" comparison. |
| 4 | `archive-inline-image-inventory`: pinned production counts (`1603/1599/1533 png/258`) plus a committed report `docs/reports/archive-inline-image-inventory-20260915.json`. Every published exam that adds an inline image changes them. Main tip `b71def20` (Hyocheon calculus I) currently fails with `1604 !== 1603`. | needs a human decision (not changed here) | See "Open items". |
| 5 | Archive Progress Observer: 234 of 237 runs cancelled. `reconcile()` asked `GET /compare/{mergeSha}...{runSha}` for every distinct pair: the live state has 175 merge SHAs x 32 runs = about 4,900 sequential, payload-heavy calls (simulated on the real state file: 4,869 distinct pairs, about 41 min at 0.5 s). The status is stored only at the end, so every timeout lost all progress; the last stored status is from 10-28 03:09. | unbounded work | Ancestry answered from a full-history blob-less checkout (`localAncestorResolver`, 1.3 s for the same state), every request has an abort deadline, evidence collection stops at a 12 min budget (deferred runs keep their state and consume no retry attempt), step timeout 20 min, job 25 min. `cancel-in-progress` stays `false`: cancelling a running observer discards its work. |
| 6 | Four observer test files (`tests/archive-progress-{cache-targets,realpaths,recovery}.test.mjs` and the nested tool test) were not part of any CI command and had drifted from the Contents API fixture shape (13 + 2 + 4 failures). | dark tests | Fixtures now return `encoding: "base64"` like GitHub does; all observer tests are in `tools/run-tests.js`. |

## Hardening of the S4/S5/S16 infra code (SB2, 2026-10-29)

| Defect in our own code | Fix |
|---|---|
| `reviewed-meta-register-pass.sh`: a failing `--verify-projection` that printed no `...Error: ` line (signal kill, non-Error throw, `AssertionError [ERR_...]`) made `grep` exit 1 inside the array assignment and aborted the whole pass under `set -euo pipefail`, so per-request isolation was lost. | Exit status captured explicitly, `grep` made non-fatal, generic rejection message `consumer projection verification failed (exit status N)`. |
| `ci.yml` group `ci-main-tip` had `cancel-in-progress: true`: the second `workflow_run` for the same tip cancelled the in-flight test, while its own plan could see the dying run as "in progress" and skip, leaving the tip untested. | `cancel-in-progress: false`; re-tests are serialised (an older waiting run is replaced by the newer one, which re-plans from the live tip). |
| `ci.yml` planner: a transient API error returned `run=true` with an empty base and the footprint guard exited 2 (false red). | The guard falls back to the checked-out tip's first parent (warning annotation) when the planned base is empty, malformed or not an available commit; a root commit stays fail-closed. |
| `archive-pages-deploy-needed.mjs`: `git rev-parse HEAD` ran outside the try/catch and on every event; a crash skipped the build (empty `needed`). | Non-schedule events answer `needed=true` before touching git or the network; `probe()` never throws; the step is `continue-on-error` and the job output defaults to `'true'`. |

`NOT_RUN` until merged to `main`: all four workflow/script paths against real GitHub runs (only the shell/Node logic is executed by tests).

## Verified vs not

Verified locally: syntax and structure tests, observer tests, planner tests, simulated reconcile timing, derive-script run on a checkout of the real `main` tip.
`NOT_RUN` until merged to `main` (workflows only execute from the default branch): the `workflow_run` CI trigger, the `plan` job against the real API, the new observer checkout (`fetch-depth: 0`, `filter: blob:none`), the compiled-artifact commit by the Pages job.

## Open items / decisions

- ~~`archive-inline-image-inventory` pins counts that change with every publish.~~ Resolved 2026-10-30, see below.
- Branch protection / required checks: make `test` (job of `CI`) required only after several consecutive green runs on `main` with this change live. Draft PR #956 (CI only for `archive/**`) would re-create the blind spot for `tools/`, `tests/` and workflow edits; close it, or narrow it to `paths-ignore` of pure documentation.

## Inline image inventory: pinned counts replaced by defect invariants (2026-10-30, user decision)

Explicit user approval of the proposal for observation 4 above. `tests/archive-inline-image-inventory.test.js` and `archive/tools/build-inline-image-inventory.mjs --check` no longer pin snapshot totals (`total`, `productionTotal`, extension counts, `qImageAndInlineTotal`, `qImageRecords.length`, `missingProductionAssetCount`) and no longer require `docs/reports/archive-inline-image-inventory-20260915.json` to equal the live inventory. The dated report is kept untouched as a historical snapshot; `--write` rewrites it on explicit request only. `--check` fails on validation errors only and prints the current totals.

Still enforced (defects): exam parse failures, unsupported or invalid image `src` (`relativePathInvalidCount` 0), `errorCount` 0, any missing production asset that is not in `archive/data/inline-image-known-missing-v1.json` (current missing must be a subset of the known list), `baselineMainSha`, `testFixtureTotal` 4 with exactly one missing fixture, textbook `qNN` naming/existence, the 25_제일고 q9 record, the 24_순천여고 q12/16/20/23 source-corrected images and 24_순천고 q8.

Changed: a known-missing entry that is no longer observed missing is a WARNING (`resolvedKnownMissing` in the tool output and a console warning in the test), not an error. Reason `asset-restored`: the image now exists. Reason `reference-removed`: the exam source no longer references it. The owner may shrink the known list later; the list was not edited here.
