# Middle Geometry Candidate Compile / Runtime / Archive2 Closeout — 2026-09-21

- status: `CANDIDATE_COMPILE_PASS_RUNTIME_RECHECK_PENDING`
- production canonical/compiled/runtime promotion: **not attempted**
- production compiler remains unchanged; this is an isolated candidate projection.

## Candidate compile gates

- candidate problem types: **11**
- candidate L4 templates: **36**
- candidate bindings: **23**
- merged candidate taxonomy parent integrity: **PASS**
- candidate L3 key collision with ACTIVE canonical: **0**
- candidate L4 key collision with ACTIVE canonical: **0**
- unregistered L3/L4/CrossConcept/Condition: **0**
- broken candidate binding: **0**
- duplicate relational assignment: **0**
- candidate leakage into production: **0**

## Runtime and Archive2 projection

- candidate runtime records: **928 / 928**
- Archive2 catalog source tuple join: **928 / 928**
- identity map join: **928 / 928**
- defaultSelectable candidate records: **923**
- auto-eligible now: **415**
- recheck hold/manual or route-out records: **513**

The 513 non-eligible records are intentionally retained in the candidate runtime projection but excluded from automatic eligibility until the difficulty/recheck and route-out gates are independently closed. This is not a production runtime claim.

## Production boundary

The candidate compiler writes only:

- `candidate_compiled_middle_geometry.json`
- `candidate_runtime_middle-geometry-v1.json`
- `candidate_compile_audit.json`

under the Middle Geometry evidence directory. It does not write `archive/data/meta-foundation/compiled/`, production runtime overlays, production JS, or Archive2 catalog files.

The repository’s production compiler still contains a Geometry Equations/400 regression path. The candidate projection demonstrates that the Middle Geometry data can pass a pack-generic candidate schema/binding/runtime/Archive2 audit, while the production engine capability remains a separate promotion gate.

Next gate: independent GPT review of the branch, then close the difficulty/recheck receipts before any canonical or production promotion is considered.
