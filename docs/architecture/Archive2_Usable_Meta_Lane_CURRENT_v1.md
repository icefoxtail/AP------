# Archive 2.0 usable-meta lane (S14, user direction 2026-10-29)

status: CURRENT / additive. Owner: Archive 2.0 product lane. Canonical authority, `RESOLVER_VERSION`, the strict approval
metrics (`basicEligibility`, `advancedEligible`, `health.automatic`) and every inbox request are unchanged.

## Why

The recorded concept (L3), problem type (PT), solution template (TPL), difficulty and curriculum are in
`archive/data/question_metadata.json` for thousands of questions, but the strict canonical resolver only projects a record when
a reviewed parent link, a `reviewed_pass` registration row and an allowlisted course all exist. Teachers therefore could use
the concept/type filters for 195 questions only. Policy (user, 2026-10-29): usage excludes as little as possible, review state
is not a usage gate, and a recorded value is shown with its own status instead of being hidden or upgraded.

## The lane (catalog columns, written by `archive/tools/build-archive2-catalog.mjs`)

| column | meaning |
| --- | --- |
| `metaBinding` | `exact`: the metadata row was approved against exactly these bytes. `content`: only answer/solution bytes changed after approval; the stem, choices and image (the assignment/content fingerprint the classification describes) are byte-identical. Absent: the stem/choices/image changed, so the row is not provably about this question. |
| `metaHintL3`, `metaHintPT`, `metaHintTPL` | recorded concept label, problem type key, template key. PT/TPL are exposed only when they are ACTIVE labelled keys of the compiled taxonomy registry and TPL's parent is the PT. Explicit field HOLDs are not exposed. |
| `metaHintStatus` | three characters (L3, PT, TPL): `A` approved field status (`approved_*`), `P` recorded but not approved (`검토 대기`), `-` absent. `mother_final`, `r2e_adjudicated`, `manual_review_pending` are shown as `P`, never as approved. |
| `metaHintCurriculum` | the curriculum recorded in approved metadata (`2015` or `2022`), read as recorded, never converted. |

A record without `metaBinding` stays fully usable (`generalUseEligibility` is unchanged); it only has no meta-based facets.

## Consumers

* `Archive2Core.metaFacetsOf / metaFacetMatches / metaFacetOptions / selectionTypeKey / typeCoverage` (shared module, also loaded by APMS).
* 문제지 만들기: 세부 조건 → 개념 / 유형 / 풀이 selects (faceted, per-option 승인 · 검토 대기 mix) and `승인된 분류만`. The facet filters
  decide `scopeQuestionUids` and the unit counts; they never reach the saved-paper server contract (`request().filters`).
* 단원별 기출: 조합 rows have 개념 / 유형 / 풀이 selects with the same status text and `승인된 분류만`; concept/type/template are joined only from the
  final catalog lane (never from a sidecar row that may describe older bytes).
* Selection: within the recency year being consumed a pick whose problem type is already in the paper is replaced by a same-year
  candidate of a new type when one exists. Year order, counts and untyped questions are unchanged.
* Preview rows, replacement candidates and the inspector show `개념 / 유형 / 풀이` (tagged `검토 대기` when not approved) and the type spread.
* Unified units: `originalCurriculum` evidence order is canonical key, **recorded approved curriculum**, roll-out year rule, subject name, key prefix.
* `difficultyEligible(record, {useMode: "general"})` accepts `metaBinding: content` rows; strict mode and APMS callers still require the exact source.

## Display projection (`ProblemBankMeta.createSourceBoundDisplayProjection`)

Default behaviour is unchanged (exact current bytes). The catalog builder passes `allowContentBoundRevision: true`; a row whose
content fingerprint matches is then projected as `bindingMode: CONTENT_BOUND_SOURCE_REVISED` (with `approvedSourceFingerprint`).
A changed stem/choices/image remains `DISPLAY_PROJECTION_FINGERPRINT_MISMATCH`.

## `--verify-projection`

Why 5 requests failed: the strict resolver deliberately leaves `curriculumKey`/PT/TPL empty for a record it does not assign
(`assignment_missing`): META_PIPELINE_AUDIT rows keep the source question's own `reviewStatus` (`MOTHER_FINAL`, none) which the
resolver does not accept as `reviewed_pass`; the three middle-school FINAL_QA requests name the native course `중3 수학`, which is
not an allowlisted `M3-1`/`M3-2` course key. `verifyConsumerValues` now verifies such a lane-bound record (assignment_missing and
`metaBinding` exact/content) through the lane and the display projection, and the remaining fields against the exact active
runtime row; a canonical value that exists must still equal the request, a source `reviewStatus` annotation is not a metadata
conflict for a lane-bound record, and the result reports `consumerLanes {canonical, usableMetaLane}`.
