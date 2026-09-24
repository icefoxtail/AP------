# Middle 1 Meta Foundation — B01–B16 promotion report

## Scope and authority

- Branch: `codex/meta-foundation/middle1`; promotion starts from B16 checkpoint `011fc49279d24503b0162c5612f03add8a68a12c`.
- Latest examined `origin/main`: `c483002ea4294a92420450c0edd4754bd9210033`.
- This promotion uses the 16 physical `CONSENSUS.jsonl`, `DIFFICULTY_FINAL.jsonl`, `WRITEBACK_RECEIPT.json`, and `VALIDATION.json` files. It does not rerun A/B/C or difficulty reviews.
- B17–B31 source files and metadata records are outside scope. Main merge and deploy were not performed.

## Exact denominator

| Measure | Result |
|---|---:|
| Completed exam batches | 16 / 16 |
| Raw rows and unique UID | 381 / 381 |
| Unique source identities | 381 / 381 |
| Final semantic mappings | 364 / 381 |
| Semantic HOLD | 15 / 381 |
| ROUTE_OUT | 2 / 381 |
| Historical metadata writeback before promotion | 364 / 381 |
| B01–B16 source key normalization in this promotion | 364 / 381 |
| L1 / L2 corrections in accepted batch writeback | 14 / 66 |
| A/B actual conflicts / C reviewed | 122 / 122 |
| Difficulty covered | 381 / 381 |
| Difficulty buckets 1–5 / UNKNOWN | 54 / 165 / 107 / 39 / 1 / 15 |

## Compression and canonical ownership

| Taxonomy | Distinct accepted keys before | Distinct final keys | Existing ACTIVE reused | New in `MIDDLE1` |
|---|---:|---:|---:|---:|
| L3 `problemTypeKey` | 177 | 85 | 7 | 78 |
| L4 `templateKey` | 299 | 155 | 6 | 149 |
| CrossConcept | 14 | 11 | 9 | 2 |

The existing ACTIVE owner is retained for every reused key. New keys are owned by `MIDDLE1`, with **139** curriculum/L1/L2→L3 bindings across the actual 2015 and 2022 middle 1 source years. The pack has **432** aliases from earlier candidate names. Compiler checks found zero duplicate canonical keys, alias collisions, broken L4 parents, broken L2→L3 bindings, or unregistered concept and condition references.

Three earlier CrossConcept candidates (`RATE_TO_GRAPH_SLOPE`, `TRIANGLE_AREA`, `TRIANGLE_AREA_TRANSFER`) were explicitly suppressed because their steps are intrinsic to the accepted primary type. Two genuinely auxiliary concepts (`CC_RATIONAL_RECIPROCAL`, `CC_RECTANGULAR_PRISM_TILING`) were added to the middle 1 concept shard. Condition keys and IntegrationPattern values remain attached to each mapped UID and are checked against the active registries.

## Source, question metadata, runtime, and Archive2

- Production JS: all 16 exam files were normalized by UID. Exactly **364** mapped rows received final L3/L4/CrossConcept keys. The 15 semantic HOLD and 2 ROUTE_OUT source rows were left unchanged. Protected student field mutations: **0**; other non-Foundation source field mutations: **0**.
- `question_metadata.json`: **381 / 381** target UID records synchronized; **0** records outside the B01–B16 denominator changed. Actual year rollout is **309** records under the 2015 curriculum and **72** under 2022. Source identity and fingerprint are preserved.
- Compiled Foundation: regenerated through `compile-meta-foundation.mjs --write`; `--check` and the existing global geometry regression gate pass. The middle 1 runtime compiler produces **381 / 381** UID records, including 364 canonical mappings and 17 explicit semantic HOLD/ROUTE_OUT records; parity check passes.
- Archive2 catalog: regenerated after the question metadata join. B01–B16 UID join **381 / 381**, identity VERIFIED **381 / 381**, source VERIFIED **381 / 381**, Foundation taxonomy CONFIRMED **364 / 364**, direct RPM taxonomy CONFIRMED **353 / 364**. The remaining **11 / 364** valid Foundation mappings have explicit `HOLD_NO_EQUIVALENT_PATH` because the current RPM M1 tree lacks a precise coordinate-area or quadrilateral/area leaf. They remain non-selectable. The 15 semantic HOLD and 2 ROUTE_OUT rows are also non-selectable.
- Archive2 target metadata conflicts **0**, duplicate UID **0**, duplicate source identity **0**, and unexpected taxonomy UNKNOWN **0**. Exactly **121** target records are automatically eligible; every semantic, solution-quality, and RPM-path HOLD is excluded.

The source/solution-quality ledger has **240** `SOLUTION_REPAIR_REQUIRED` entries; these are retained as separate findings and blocked from automatic selection until repair. No solution text was upgraded in this promotion.

## Latest main reconciliation

`origin/main` advanced the Archive2 catalog through **16** source files outside B01–B16, changing **347** non-target catalog rows. Those 16 files were brought into the branch content-equivalent to `origin/main` under Git's line-ending policy, with no content edits, solely so catalog regeneration preserves them. The rebuilt catalog differs from current main on **0** records outside B01–B16; the B01–B16 source files have no main drift. See `B01_B16_MAIN_CATALOG_DRIFT.json` and `B01_B16_MAIN_SOURCE_ALIGN_RECEIPT.json`.

## Validation

- `B01_B16_COMPRESSION_VALIDATION.json`: **PASS**, including 16 batch artifacts, 381 UID union, source/content protection, 364 key writes, 381 metadata joins, canonical parent/ownership/alias, runtime parity, Archive2 join, scope-only diff, and B17–B31 source mutation 0.
- `compile-meta-foundation.mjs --check`: **PASS**.
- `compile-middle1-b01-b16-runtime.mjs --check`: **PASS**.
- `build-archive2-catalog.mjs --check`: **PASS**.
- Targeted Node tests: **29 passed / 29**, including Archive2 core/Finder, global compile, and the new middle 1 promotion contract. A test detected the 2025→2022 curriculum rollout mismatch during implementation; the scoped curriculum binding and metadata were corrected and all tests pass.

## Physical artifacts and next step

The item-level and candidate-to-canonical mapping authority is in this `global/` directory: `B01_B16_GLOBAL_COMPRESSION_INPUT.json`, L3/L4/CrossConcept compression files, `B01_B16_CANONICAL_MAPPING.json`, source/question metadata receipts, canonical usage, runtime parity, Archive2 path/join audits, and `B01_B16_COMPRESSION_VALIDATION.json`. Canonical pack: `archive/data/meta-foundation/canonical/packs/middle1/`; runtime: `archive/data/meta-foundation/runtime/middle1-v1.json`.

Next work starts at **B17 `25_왕의중_2학기_중간_중1_수학.js`**, using one source read to perform the student solution upgrade and Meta metadata together. B17 was not started here. Main merge was not performed.
