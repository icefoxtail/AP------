# Luna 6 Independent Review — Middle Geometry 1–200

## Checkpoint status

- Range: 1–200
- Reviewed: 200/200 (ten batches of 20)
- MATCH: 143
- DEFECT unique UID: 50
- HOLD: 7
- L2 defect UID: 21
- L3 defect UID: 10
- L4 defect UID: 24
- CrossConcept defect UID: 16
- CrossConcept additions: 16 keys
- CrossConcept removals: 4 keys
- New canonical keys created: 0
- Source content/solution SHA-256 rechecked against the pinned source snapshot: 200/200

Field counts overlap where one UID has more than one defective field.

## Main finding groups

- CrossConcept overlap with Primary appeared in cases such as similarity used inside parallel-segment-ratio templates and diameter/inscribed-angle rules already covered by circle-angle classifications. Several rows also lacked a distinct supporting area or midpoint concept.
- Several length and height questions used trigonometry as a direct application but were assigned to the general trigonometry subunit; some expression and ratio questions had the reverse mismatch.
- Centroid and median-ratio questions were sometimes classified as similar figures. Recommendations use the existing centroid taxonomy.
- L4 mismatches included circle chord length versus perpendicular-bisector constructions, tangency conditions versus tangent lengths, and quadrilateral criteria versus special-quadrilateral properties.
- Seven rows are HOLD, including multi-part items with separate primary methods, missing or unresolved template fits, and item 163 where the solution contains a contradictory side-square comparison.

All recommendations use keys already present in the master or candidate registries.

## Blindness and model-route qualification

Status: `QUALIFIED_NONBLIND_COMPARISON`.

For each batch, source-only semantic records were saved before current metadata was opened. Sol/GPT item-level verdicts, correction files, and defect lists were not consulted. Earlier in the session, a Notion work-status summary was exposed before source review, and a post-freeze diagnostic for the 601–800 phase exposed `l3ReviewStatus` for three records. Those labels did not guide these decisions. The runtime route could not be verified as Luna 6, so this checkpoint cannot establish Luna 6 model attribution without external route confirmation.

## Artifacts

- `IDENTITY_1_200.json`
- `BLIND_1_200_COMPLETE.json`
- `luna6_blind_review_1_200.json`
- `luna6_comparison_1_200.json`
- `luna6_defects_1_200.json`
- `luna6_holds_1_200.json`
- `luna6_validation_1_200.json`
- `STATE.json`
- `batches/`, `COMPARISON_*.json`, `VALIDATION_*.json`

Checkpoint branch: `codex/luna6-middle-geometry-review`  
Source snapshot: `12951750e4bfd6e4287ebc412309919644d046ac`  
Main merge: no
