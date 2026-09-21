# Middle Geometry Stage 2 L3 Fresh Assignment — 2026-09-21

- status: `CANDIDATE_FREEZE_PENDING_GPT_INDEPENDENT_REVIEW`
- base main: `843d26d60780ae1502dd53d75c8f2b064b98174f`
- branch: `codex/meta-foundation/middle-geometry`
- production JS mutation: `0`
- canonical / compiled / runtime production mutation: `0`

## Exact denominator and identity gate

- Middle Geometry total: **928 / 928**
- M2: **402 / 402**
- M3: **526 / 526**
- unique `questionUid`: **928 / 928**
- unique source identity (`sourceArchiveFile#sourceOrdinal`): **928 / 928**
- source fingerprint present: **928 / 928**
- source UID inventory was not rebuilt; the frozen 928 UID denominator was joined directly.

## M2 continuation from frozen semantics

M2 was not re-inventoried. The item-level ledger materializes the existing freeze and preserves all five route-outs.

| assignment | count |
|---|---:|
| `PT_ISOSCELES_TRIANGLE` | 24 |
| `PT_RIGHT_TRIANGLE_CONGRUENCE` | 29 |
| `PT_TRIANGLE_ANGLE_BISECTOR` | 21 |
| `PT_TRIANGLE_CENTERS` | 78 |
| `PT_COORD_CENTROID` existing reuse | 3 |
| `PT_QUADRILATERAL_PROPERTIES` | 104 |
| `PT_SIMILAR_FIGURES` | 67 |
| `PT_TRIANGLE_SIMILARITY` | 30 |
| `PT_PARALLEL_SEGMENT_RATIO` | 41 |
| L2/source route-out | 5 |
| **total** | **402** |

The five route-outs are retained as `OUT_OF_SCOPE`/`HOLD`; no source solution or production L2 field was rewritten. `PT_TRIANGLE_AREA_RATIO` is absent.

## M3 Stage 2 fresh L3 assignment

Working L2 distribution after the two frozen fresh-source corrections:

| working subUnitKey | count |
|---|---:|
| `M3-05-TRIG_RATIO` | 148 |
| `M3-05-TRIG_RATIO_APPLICATION` | 58 |
| `M3-06-CIRCLE_LINE` | 133 |
| `M3-06-CIRCLE_INSCRIBED_ANGLE` | 187 |
| **total** | **526** |

Fresh L3 usage:

| L3 | count | ownership |
|---|---:|---|
| `PT_TRIG_RATIO` | 112 | candidate, MIDDLE_GEOMETRY |
| `PT_TRIG_RATIO_APPLICATION` | 94 | candidate, MIDDLE_GEOMETRY |
| `PT_CIRCLE_LINE_RELATION` | 54 | existing ACTIVE reuse, GEOMETRY_EQUATIONS |
| `PT_CIRCLE_TANGENT` | 114 | existing ACTIVE reuse, GEOMETRY_EQUATIONS |
| `PT_TWO_CIRCLES` | 13 | existing ACTIVE reuse, GEOMETRY_EQUATIONS |
| `PT_CIRCLE_ANGLE_RELATIONS` | 116 | candidate, MIDDLE_GEOMETRY |
| `PT_TRIANGLE_CENTERS` shared candidate usage | 23 | candidate, MIDDLE_GEOMETRY |
| **total** | **526** |

The 13 M3 candidate/existing L3 axes are not 13 new canonical definitions: the three circle keys are reused, and `PT_TRIANGLE_CENTERS` is one shared candidate key used where the circle source’s decisive structure is a triangle center.

## L4 and relational metadata

- candidate L4 templates: **36**
- existing ACTIVE L4 reuse is used where the geometry-equations definition is an exact semantic fit (`TM_CIRCLE_*`, `TM_TANGENT_*`, `TM_TWO_CIRCLES_*`, and centroid templates).
- numeric, wording, proof-format, and difficulty-only variants are kept inside candidate evidence rather than promoted to separate canonical L4 keys.
- CrossConcept and Condition assignments are item-level and conservative; primary taxonomy concepts are not duplicated as CrossConcepts.
- difficulty fields are blind-first candidate evidence; legacy comparison is recorded only after the candidate bucket.

## Gates

- denominator / UID / source identity: `PASS`
- M2 freeze parity and five route-outs: `PASS`
- M3 working L2 parity: `PASS`
- candidate L3 key collision against ACTIVE canonical: `0`
- candidate L4 key collision against ACTIVE canonical: `0`
- unregistered CrossConcept / Condition references: `0`
- source / canonical / compiled / runtime mutation: `0`
- current compiler/runtime capability: `ENGINE_CAPABILITY_BLOCK` — `compile-meta-foundation.mjs` is still hard-coded to `GEOMETRY_EQUATIONS`/400, so no middle-geometry canonical promotion or runtime claim was made.
- GPT independent branch review: `PENDING_EXTERNAL_REVIEW`

## Artifacts

- candidate pack: `archive/data/meta-foundation/candidates/middle-geometry/v1/`
- complete ledger: `item_level_assignment_928.json`
- M2 ledger: `m2_item_level_l3_ledger_402.json`
- M3 Stage 2 ledger: `m3_stage2_l3_fresh_assignment_526.json`
- integrity audit: `global_integrity_audit.json`
- review manifest: `review_manifest.json`
- reproducible builder: `archive/tools/meta-foundation/build-middle-geometry-candidate.mjs`

Next gate: independent GPT review of the full branch diff and candidate/evidence parity, followed by pack-generic compiler/runtime/Archive2 work only if that scope is approved by the protocol and the engine capability gap is closed.
