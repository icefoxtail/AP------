# Luna 6 Independent Review — Middle Geometry 401–600

## Checkpoint

- Range: 401–600
- Reviewed: 200/200, in ten 20-question batches
- Verdicts: MATCH 102; DEFECT 95 unique UIDs; HOLD 3
- Field defects: L2 19; L3 41; L4 75; CrossConcept 52
- CrossConcept recommendations: add 14; remove 49
- Validation: PASS; direct content/solution SHA-256 mismatches: 0
- Pinned JS files re-read for final hash verification: 53
- Report branch: codex/luna6-middle-geometry-review
- Commit message: audit(meta): luna6 independent review 401-600
- Remote: origin/codex/luna6-middle-geometry-review; main merge: no
- Source, canonical, compiled, runtime, existing working ledger mutation: 0

## Main defect families

- Primary-method mismatch: centroid and triangle similarity assignments, circle-angle methods stored as tangent-length or circle-line position methods, and triangle-area calculations stored as trigonometric-ratio applications.
- L4 template mismatch: broad direct/application labels where chord-perpendicular-bisector, tangent-length, angle-composite, triangle-similarity application, or proof/multi-statement templates fit the decisive steps more closely.
- CrossConcept errors: missing midpoint, area, or Pythagorean support; unrelated diameter, tangency, inscribed-angle, similarity, or triangle-area tags.
- Three HOLDs were retained: one coordinate-line-equation scope question (402) and two source prompts that add a length and an angle (446, 552).
- At 511 the source uses only the base-height triangle-area formula; no existing Middle Geometry L3/L4 area key was available to recommend, so no new key was proposed.

## Review boundaries and limitations

For each batch, the blind ledger was saved before that batch's current L2/L3/L4/CrossConcept comparison. Blind semantic judgments use only source content and solution; choices and answer fields were not read. No per-item Sol/GPT review, correction archive, or defect list was consulted.

Blindness status is QUALIFIED_NONBLIND_COMPARISON because task history/status context existed before this review segment. The exact runtime model route could not be independently verified as Luna 6. The source-only dimensional-unit note for reviewIndex 552 was appended after the batch metadata extraction; its HOLD decision rests on adding a length and an angle. The analogous note for reviewIndex 381 is documented in the 201–400 checkpoint.

## Artifacts

- luna6_blind_review_401_600.json
- luna6_comparison_401_600.json
- luna6_defects_401_600.json
- luna6_holds_401_600.json
- luna6_validation_401_600.json
- STATE.json
- Per-batch identity, blind ledger, comparison, and validation records

Next automatic range: **601–620**.
