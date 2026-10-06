# APMath Visual Production Engine — Phase 3–5 Checkpoint

## Status

This is the first implementation checkpoint, not final review readiness.

| Master phase | Status | Evidence |
|---|---|---|
| Phase 3 | In progress. The new-output workspace boundary and per-run isolation unit pass. DisplayEnvelope-aware layout, repair closure, and full/medium support remain open. | [Workspace migration evidence](../evidence/apmath-visual-production-phase3-5/workspace-migration/workspace-migration-ledger.json) |
| Phase 4 | Not started. Construction and graph capability expansion is not claimed. | — |
| Phase 5 | Not started. No qualification denominator, full real-UID review set, Seal, or ACTIVE state is claimed. | — |

## Starting findings and integration

- Worktree: `C:/Users/USER/Desktop/AP-worktrees/apmath-visual-phase3-5/AP------`
- Branch: `codex/apmath-visual-production-phase3-5-20261006`
- Starting engine SHA: `f87422b6e18cd170c03481e8a6426a8656e29509`
- Fetched `origin/main` SHA: `13525fde8e9a547f385f8dd225c43031d2b92cc1`
- Merge base: `4309245e57abc8f9318fb76a506b0c68b3d2aa6c`; at start the branch was 117 main-only / 5 engine-only commits.
- Integrated fetched main in merge commit `a44fa83b8`; merge completed with no conflicts. The prototype and reports were additions on the engine branch and were absent from main, not deleted by main.

## Completed unit: temporary workspace and isolation

New engine attempts now write under `.tmp/archive/<runId>/<examUid>/visual-engine/production/`. Their candidate exam JS uses the source exam basename, the SVG uses `qNN-solution.svg`, and the candidate bank keeps the final archive-relative `assets/images/<examUid>/qNN-solution.svg` reference. The actual Archive fixture collector maps that reference to the temporary SVG bytes during review. Historical `archive/_generated` evidence remains read-only. Pinned test dependencies use `.tmp/apmath-visual-engine/dependencies/`.

The workspace is carried with `AsyncLocalStorage`, so concurrent runs do not share a process-global path. A frozen calculation replay uses the same workspace identity to retain valid calculation cache bytes while writing fresh audit/result receipts. The regression suite checks concurrent writes, path traversal, redirects, immutable receipts, and cache reuse.

This closes only the workspace boundary. The existing production runner still uses a guessed/full-size envelope and does not yet resolve actual Archive dimensions before layout.

## Verification

- Node: 34/34 pass across workspace, runner, P1 boundary, source-policy, Past Exam adapter, and typography tests.
- Python: 137/137 pass.
- Visual fixtures: 13 generated, 0 unresolved.
- Static publication fixtures: 5/5 pass.
- Standalone Chromium layout: 5/5 pass at 390 CSS px; minimum observed label font 16.25 CSS px.
- Actual Archive desktop solution-mode fixture: 5/5 synthetic rows pass. Each final relative asset reference loaded the mapped temporary SVG; measured image box was 298.15625 × 298.15625 CSS px and minimum audited font was 12.423 CSS px.
- `git diff --check`: pass.

The Archive capture is synthetic workspace-integration evidence, not real-UID qualification. It observed an external qrious CDN request and therefore does not prove offline runtime closure. Raw logs, result summaries, SVG layout crops, screenshots, and the authority search are in the linked evidence package; the artifact-manifest SHA-256 is `d0df9f369f5d090b2cdc08e63d80f9a34973a8a095b3fbda55533ed4aa6f1957`.

## Canonical Phase 2 authority

I searched `archive/**/*.json` and `archive/**/*.jsonl` for `SOURCE_EXAM_ID_REGISTRY_v1`; the only match is the schema. I also checked the current Archive identity/index and parent-run evidence paths. `archive/data/question_identity_map.json` has exact file/ordinal rows for all three targets and source commit `4883920cfba88849166ccc15ff7eef9121d3721d`, an ancestor of fetched main. The three source JS files have not changed since that map snapshot. That map is still `question-identity-map-v1`, uses `qid_v1`, and records an audit-only semantic fingerprint. It has no v2 `canonicalSourceExamId`, exam-level `sourceIdentityKey`, ACTIVE/RETIRED status, or raw source SHA. `archive/question-identity.js` resolves qid_v1; `archive/question-index.js` is a qKey/source-file/ordinal browsing index; `question_metadata.json` is a metadata projection. None is the v2 authority consumed by the engine.

The V2 pipeline contains a registry validator and consumes a supplied registry reference, but the checkout has no registry builder that converts this qid_v1 map into the required v2 authority. `archive/analysis` has no matching v2 registry or parent-run record for these targets, and this task supplied no `parentRunRef`. Converting filenames into canonical IDs and ACTIVE mappings would invent missing authority fields. The full path inventory, source commits and raw SHA-256 values, map record fingerprints, and resolver contract findings are recorded in [authority-search.json](../evidence/apmath-visual-production-phase3-5/workspace-migration/authority-search.json).

The canonical CLI attempts for Geometry UID `25_효천고_2학기_중간_고1_기출|1`, Graph UID `25_연향중_1학기_기말_중3_기출c|10`, and coordinate-free Geometry UID `25_삼산중_2학기_기말_중2_기출|1` each returned `INPUT_REQUIRED / UID_AUTHORITY_REGISTRY_REQUIRED` (exit 2). I did not use the locator path as canonical authority. The earlier P1 locator results remain experiments; canonical Phase 2 closure is still open.

## Next unit

Proceed to Phase 3A: bind Archive image/container policy and actual target dimensions before layout, then verify medium and full envelopes separately. Keep readability failures visible; do not promote a profile based on a different size class. Phase 4 and Phase 5 work follows only after the remaining Phase 3 units are addressed or recorded as unresolved.
