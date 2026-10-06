# APMath Visual Production Engine — Phase 3–5 Checkpoint

## Status

This is the first implementation checkpoint, not final review readiness.

| Master phase | Status | Evidence |
|---|---|---|
| Phase 3 | In progress. Workspace isolation and content-box preflight pass. Three experimental locator candidates have per-profile label, graph/topology, and final Archive evidence; general owner-safe repair, resume/cache invalidation, and full profile composition remain open. | [Workspace evidence](../evidence/apmath-visual-production-phase3-5/workspace-migration/workspace-migration-ledger.json), [Content-box amendment](../evidence/apmath-visual-production-phase3-5/display-envelope-preflight-amendment/amendment-ledger.json), [Q1 profile package](../evidence/apmath-visual-production-phase3-5/experimental-locator-geometry-q01/profile-run-ledger.json), [Graph q10 package](../evidence/apmath-visual-production-phase3-5/experimental-locator-graph-q10/profile-run-ledger.json), [Coordinate-free q1 package](../evidence/apmath-visual-production-phase3-5/experimental-locator-coordinate-free-geometry-q1/profile-run-ledger.json) |
| Phase 4 | Capability matrix recorded. No new graph family is claimed publication-supported beyond the quadratic vertical slice; broader construction and graph expansion remains pending. | [Phase 4 capability matrix](APMath_Visual_Production_Phase4_Capability_Matrix_20261006.md) |
| Phase 5 | Not started. Canonical UID denominator remains 0/10; no feature-complete qualification candidate, Seal, or ACTIVE state is claimed. | — |

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

This checkpoint closed the workspace boundary. Phase 3A runner integration is recorded below.

### Phase 3A preflight measurement

I added a measurement-only pass that opens the real Archive in `mode=sol`, retains the target `.q-box` and `.sol-meta` rectangles, and probes the Archive's actual image CSS classes with a 384×320 SVG at the measured `.sol-meta` content width. The first pass used the border-box width as the percentage denominator and overstated the full profile. A same-unit correction now measures 316.15625 CSS px for the border box and 298.15625 CSS px for the `.sol-meta` content box. Small, medium, and large remain 126×105, 174×145, and 216×180 px; full is 298.140625×248.453125 px. The original measurement remains preserved and is superseded only for the full-profile denominator by the linked amendment, which includes fresh raw rows and screenshots for all three source pages.

This is a pre-layout constraint measurement only. It does not establish candidate font readability for any profile. The profile policy module keeps this state `PLANNED` and requires a later final-SVG audit of every label, stroke, and graph topology at each profile before any profile is marked supported. The three pages were selected through the qid_v1 source map for measurement only; no v2 UID authority was created or inferred. The capture observed an external qrious CDN request, so offline runtime closure remains unverified.

## Verification

- Node: 34/34 pass across workspace, runner, P1 boundary, source-policy, Past Exam adapter, and typography tests.
- Python: 137/137 pass.
- Visual fixtures: 13 generated, 0 unresolved.
- Static publication fixtures: 5/5 pass.
- Standalone Chromium layout: 5/5 pass at 390 CSS px; minimum observed label font 16.25 CSS px.
- Actual Archive desktop solution-mode fixture: 5/5 synthetic rows pass. Each final relative asset reference loaded the mapped temporary SVG; measured image box was 298.15625 × 298.15625 CSS px and minimum audited font was 12.423 CSS px.
- DisplayEnvelope planning/final-audit contract: 17/17 fixture logic tests pass; these are not actual-profile evidence. Corrected actual source-page CSS preflight: 3/3 measurement rows pass, with no candidate SVG support verdict.
- Combined profile-gate, Archive URL-matching, canonical/store, and repair-ledger hydration subset: 31/31 tests pass. The coordinate-free q1 frozen replay retained all three existing repair entries and the same SVG SHA, then reran Archive and visual review.
- `git diff --check`: pass.

The Archive capture is synthetic workspace-integration evidence, not real-UID qualification. It observed an external qrious CDN request and therefore does not prove offline runtime closure. Raw logs, result summaries, SVG layout crops, screenshots, and the authority search are in the linked evidence package; the artifact-manifest SHA-256 is `d0df9f369f5d090b2cdc08e63d80f9a34973a8a095b3fbda55533ed4aa6f1957`.

### Phase 3A candidate profile replay

The runner now binds the measured Archive envelope before layout, captures the unchanged BUILD SVG at all four CSS profiles, measures every rendered label and stroke, runs a profile-specific topology audit, and compares the selected class against the final loaded Archive image and raw row. On Geometry q1 (`25_효천고_2학기_중간_고1_기출|1`), the current default medium profile measured 9.0625 CSS px and failed the 11px floor; large passed at 11.25 px and full passed at 15.5282 px. The temporary candidate bank records medium→large, and Actual Archive confirmed the selected image at 216×180 CSS px. The same candidate SVG SHA-256 was used across all four profile captures and the Archive image.

The result remains `EXPERIMENTAL_LOCATOR_COMPLETE`. The v2 UID authority is still missing, so q1 is excluded from all qualification counts. `auditSlice` rechecked the profile receipts and final Archive capture and reported only the expected canonical UID authority/completion failures. The [q1 profile-run ledger](../evidence/apmath-visual-production-phase3-5/experimental-locator-geometry-q01/profile-run-ledger.json) and [evidence manifest](../evidence/apmath-visual-production-phase3-5/experimental-locator-geometry-q01/evidence-manifest.json) include the raw screenshots, profile measurements, stage receipts, and attempt/replay lineage.

The ledger preserves six fixed-plan replays in the same run: the initial Unicode URL lookup failure; a pre-envelope baseline pass; the first profile identity-order failure; the raw Archive row filename failure; the repeated policy-ref ordering failure at final comparison; and the final successful profile/Archive/visual-review pass. All six BUILD receipts have the same candidate SVG SHA-256. The shared budget was not reset; no provider plan repair, content repair, or direct SVG patch was made. The two policy-order failures share one recorded root-cause group.

The Graph q10 locator (`25_연향중_1학기_기말_중3_기출c|10`) also produced an experimental profile matrix. The first build preserved a `POLISH_REQUIRED` formula-label placement failure. A single composition-only graph policy then allocated a 140px side panel; the frozen coefficients, domain, required vertex, and source-condition inventory stayed unchanged. At large, both overview arms measured 39.34px, just below the 40px minimum, while topology passed. Full passed the graph overview and topology audits at 15.53 CSS px and was explicitly selected from the medium default. Actual Archive loaded the full candidate and the visual review passed. This is still a qid_v1 locator experiment, outside qualification counts. The [Graph q10 profile ledger](../evidence/apmath-visual-production-phase3-5/experimental-locator-graph-q10/profile-run-ledger.json) and [evidence manifest](../evidence/apmath-visual-production-phase3-5/experimental-locator-graph-q10/evidence-manifest.json) retain both the unresolved formula-layout attempt and the successful same-plan replay, with raw browser evidence and hashes.

The coordinate-free Geometry q1 locator (`25_삼산중_2학기_기말_중2_기출|1`) passed the same profile path with its source diagram supplied to blind review. Its generated construction represents a right triangle from the 5cm and 3cm source lengths, labels the hypotenuse `x`, and shows `x²=34`; no source coordinates were invented. Three bounded normalizer/source-review corrections are preserved in the repair ledger. Small/medium fail at 6.5625/9.0625px; large/full pass at 11.25/15.5282px, so the source's medium default changes explicitly to large. Actual Archive and the visual review pass, while canonical audit remains blocked by missing v2 authority. The [coordinate-free q1 profile ledger](../evidence/apmath-visual-production-phase3-5/experimental-locator-coordinate-free-geometry-q1/profile-run-ledger.json) and [evidence manifest](../evidence/apmath-visual-production-phase3-5/experimental-locator-coordinate-free-geometry-q1/evidence-manifest.json) include the source diagram and raw candidate/archive evidence.

After wiring persisted-budget hydration, I replayed that same q1 frozen result with all three repair entries consumed. The replay retained the exact ledger and BUILD SVG SHA, reran profile and Actual Archive captures, and completed without resetting the repair budget. The package includes both the initial result and that replay. The 31-test regression subset (pipeline contract, envelope gate, and Archive path matching) passes; these are machine/logic tests, not independent visual review.

## Canonical Phase 2 authority

I searched `archive/**/*.json` and `archive/**/*.jsonl` for `SOURCE_EXAM_ID_REGISTRY_v1`; the only match is the schema. I also checked the current Archive identity/index and parent-run evidence paths. `archive/data/question_identity_map.json` has exact file/ordinal rows for all three targets and source commit `4883920cfba88849166ccc15ff7eef9121d3721d`, an ancestor of fetched main. The three source JS files have not changed since that map snapshot. That map is still `question-identity-map-v1`, uses `qid_v1`, and records an audit-only semantic fingerprint. It has no v2 `canonicalSourceExamId`, exam-level `sourceIdentityKey`, ACTIVE/RETIRED status, or raw source SHA. `archive/question-identity.js` resolves qid_v1; `archive/question-index.js` is a qKey/source-file/ordinal browsing index; `question_metadata.json` is a metadata projection. None is the v2 authority consumed by the engine.

The V2 pipeline contains a registry validator and consumes a supplied registry reference, but the checkout has no registry builder that converts this qid_v1 map into the required v2 authority. `archive/analysis` has no matching v2 registry or parent-run record for these targets, and this task supplied no `parentRunRef`. Converting filenames into canonical IDs and ACTIVE mappings would invent missing authority fields. The full path inventory, source commits and raw SHA-256 values, map record fingerprints, and resolver contract findings are recorded in [authority-search.json](../evidence/apmath-visual-production-phase3-5/workspace-migration/authority-search.json).

The canonical CLI attempts for Geometry UID `25_효천고_2학기_중간_고1_기출|1`, Graph UID `25_연향중_1학기_기말_중3_기출c|10`, and coordinate-free Geometry UID `25_삼산중_2학기_기말_중2_기출|1` each returned `INPUT_REQUIRED / UID_AUTHORITY_REGISTRY_REQUIRED` (exit 2). I did not use the locator path as canonical authority. The earlier P1 locator results remain experiments; canonical Phase 2 closure is still open.

## Next unit

The three requested real-source profile slices are now recorded, all as locator-only experiments. The remaining Phase 3B/C/D/E acceptance conditions, complete capability matrix, Phase 4 expansion, and Phase 5 qualification coverage remain open. Continue with measured owner-safe layout and profile composition, then resume/cache/repair/publication negatives; preserve any unsupported result and do not count these three locators toward qualification.
