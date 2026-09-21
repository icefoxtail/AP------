# Middle Geometry Candidate Compile / Runtime / Archive2 Closeout — 2026-09-21

- status: `CANDIDATE_VALIDATION_ONLY_REVIEW_PENDING_FAIL_CLOSED`
- production canonical/compiled/runtime promotion: **not attempted**
- production compiler remains unchanged; this is an isolated candidate projection.

## Candidate compile gates

- candidate problem types: **11**
- candidate L4 templates: **36**
- candidate bindings: **22**
- merged candidate taxonomy parent integrity: **PASS**
- candidate L3 key collision with ACTIVE canonical: **0**
- candidate L4 key collision with ACTIVE canonical: **0**
- unregistered L3/L4/CrossConcept/Condition: **0**
- broken candidate binding: **0**
- L1→L2 parent mismatch: **0**
- candidate binding parent mismatch: **0**
- pack owned-domain violation: **0**
- source/working metadata confusion: **0**
- actual alias audit: **EXECUTED** / lookup entries **134** / collision count **0**
- duplicate relational assignment: **0**
- candidate leakage into production: **0**

## Runtime and Archive2 projection

- candidate runtime records: **928 / 928**
- Archive2 catalog source tuple join: **928 / 928**
- identity map join: **928 / 928**
- defaultSelectable candidate records: **0**
- auto-eligible now: **0**
- independent recheck trigger union: **913**
- review hold/manual or route-out records: **928**

All 928 records are intentionally retained in the candidate runtime projection but excluded from automatic eligibility until the difficulty/recheck and route-out gates are independently closed. This is not a production runtime claim.

## Production boundary

The candidate compiler writes only:

- `candidate_compiled_middle_geometry.json`
- `candidate_runtime_middle-geometry-v1.json`
- `candidate_compile_audit.json`

under the Middle Geometry evidence directory. It does not write `archive/data/meta-foundation/compiled/`, production runtime overlays, production JS, or Archive2 catalog files.

The repository’s production compiler still contains a Geometry Equations/400 regression path. The candidate projection demonstrates that the Middle Geometry data can pass a pack-generic candidate schema/binding/runtime/Archive2 audit, while the production engine capability remains a separate promotion gate.

Next gate: independent GPT review of the branch, then close the difficulty/recheck receipts before any canonical or production promotion is considered.
