# M2 problem renderer continuity v1

## Purpose and authority

This explicit source-review option carries separately inspected renderer changes
for exactly three existing M2 items. It does not supply a mathematical judgment,
a difficulty judgment, a REVIEW2 claim, a new definition, or a hold upgrade.
The original native review and its independent definition or retained-primary
authority must still pass their ordinary validators.

The implementation is based on the public support code at
`c8393cc28a214cc13a70f656d948886e468a1ca5`. The old source/native inputs, existing
independent approvals and earlier negative observations are never edited.

| Item | Allowed original authority | Source |
| --- | --- | --- |
| E005 Q12 | M2 v3 finalization with explicit scope-parent transport | `original/middle/m2/2final/25_삼산중_2학기_기말_중2_기출.js` |
| E006 Q3 | Independently reviewed existing primary plus retained scope transport | `original/middle/m2/2final/25_연향중_2학기_기말_중2_기출.js` |
| E006 Q21 | Independently reviewed existing primary plus retained scope transport | Same E006 source |

UID, source path and ordinal must match the fixed inventory in the helper; both
banks retain their exact immutable native counts: E005 has 24 questions and E006
has 23. The same count is required in the request, source snapshots and UI result.
Other M2 or M3 items cannot opt into this version.

## Request option

```json
{
  "m2ProblemRendererContinuity": {
    "schemaVersion": "archive-reviewed-m2-problem-renderer-continuity-v1",
    "reviewCommit": "<exact immutable commit>",
    "reviewRef": { "path": "<repository-relative JSON>", "sha256": "<raw SHA256>" }
  }
}
```

The option is part of `item.sourceReview`. Requests must be PARTIAL_UIDS FINAL_QA
with no registration mode, source rebind or item rebind. E005 permits only the
ordinary native reference, this option, and its original v3 proposal finalization
with named scope-parent transport. E006 permits only the ordinary native
reference, this option, retained fields with an independent primary reference,
and retained scope transport. E006 registry changes remain empty. Unknown or
mixed options are rejected; the nested original authority validators retain
their exact-key requirements.

## Immutable witness

The top-level witness is
`archive-independent-m2-problem-renderer-continuity-v1`, with scope
`EXACT_M2_PROBLEM_RENDERER_THREE` and decision
`APPROVE_EXACT_PROBLEM_RENDERER_CONTINUITY`. Its three rows bind:

- the original native document, item digest, reviewed source and native-commit source;
- the prefigure source, separately inspected current source and full question digest;
- every native-to-prefigure metadata field with original native authority;
- every prefigure-to-current field change;
- complete original, prefigure and current referenced asset inventories;
- unchanged authored original renderer observations and the separate Q3 label repair;
- exact student-UI technical results and a separate independent visual review.

Each source reference carries an exact commit, path, Git blob SHA1, raw SHA256 and
question SHA256. Each asset carries path, Git blob SHA1, raw SHA256 and byte count.
Every witness reference is bound in both the item and request approval evidence
lists. The helper verifies Git bytes and current local bytes on every use.

The native-to-prefigure differences are limited to the declared metadata fields.
Every value must equal its original native `after`, original native rationale
field, or original final-difficulty field. No metadata is inferred from the
picture, year, filename or display label. Both original native source questions
must be identical.

Prefigure-to-current differences must consist of exactly `image`, `imageAlt`,
`imageSize` and `layoutTag`. Text, answer, explanation, choices and all other
question properties stay exact. Complete nested asset references are inspected;
unbound external SVG dependencies, scripts and executable renderer forms are
rejected. Original and current assets are validated separately.

## Actual student UI requirement

Standalone SVG inspection does not satisfy this contract. The technical document
must be `archive-problem-renderer-student-ui-preview-v2` with status
`TECHNICAL_PASS_VISUAL_REVIEW_PENDING`, an exact GitHub Actions checkout, the
executed checker/manifest/identity references, and six desktop/mobile problem-only
logical cases. Each case contains one to eight original PNG scroll tiles with
complete vertical coverage and exactly 32 CSS pixels of overlap between adjacent
tiles. The viewport, student DOM and CSS remain unchanged; composites and the old
single-screenshot alias are rejected. It must report no source overlay, no solution view, valid question
counts and readiness, local MathJax, loaded images, no math/page/request errors,
and the intended Nanum Myeongjo font with the three checked weights and exact
stylesheet/font response digests.

An independent `archive-independent-m2-problem-renderer-student-ui-review-v2`
document must bind the technical path and raw SHA and every original tile's path,
raw SHA, byte count and tile index in all six cases. The global PNG inventory and
each case's ordered tile inventory must agree exactly, including top and bottom
coverage, fixed-control occlusion and hit-test evidence. Each review explicitly
records preserved conditions and labels, legibility, no clipping and complete
problem coverage. The
technical producer and visual reviewer must differ. Technical PASS alone never
constitutes visual approval. Missing or pending observations refuse registration.

The authored original Q3 negative label-clearance observation is preserved. Its
later label-only repair must link the exact earlier document by raw SHA and size,
retain its approved geometry, and bind the old and repaired SVGs. An authored
absolute provenance path is not opened or rewritten; a portable Git-bound copy
is resolved by its original bytes.

## Comparison and replay

Only after all of the above checks pass does the source reassessment create a
temporary in-memory comparison question with the four renderer fields restored
to their prefigure values. The original native, v3 definition or retained primary,
RPM, scope-parent and original asset validators then run without relaxed checks.
No normalized source is written to disk or substituted into a Git witness. The
outer proof retains the actual current student payload digest and the original
inner source-review digest.

The live bank and wrapper must equal the inspected current snapshot. The only
additional live source delta is E005's selected cross-concept metadata, which its
original v3 validator independently checks. Unselected source changes require a
fresh current snapshot/UI binding; this option is not a generic source patch.

The normal typed source-review binding sidecar is mandatory. Official replay
recomputes the full source proof. AutoMeta revalidates that same sidecar, current
metadata/identity/runtime, current canonical inputs, original/current assets and
all witnesses before reusing an issued approval. An older cursor must equal one
of the proof's exact original or prefigure whole questions. A generic typed proof
or matching fingerprint alone does not authorize a renderer change. Missing
receipt, sidecar, issued proof, parent or witness and same-path asset drift must
refuse reuse at both old and caught-up cursors.

Existing authority-withdrawal and explicit hold checks remain in force. In
particular, the withdrawn E0487/E0541 cohort is outside this option.

## Validation and release state

The dedicated regression file exercises a synthetic native/v3 request and a
synthetic two-item retained request through the real official writer, replay and
AutoMeta. Its synthetic independent/UI documents are test fixtures, not authority
for the actual three items. Tests also cover re-sealed contradictory witnesses,
unknown and mixed options, live source/asset drift and missing typed obligations.

Actual registration remains pending until the separately authored actual UI
technical and visual witnesses are available and the inputs are freshly bound to
the current registered main. Local tests do not claim actual main registration.
