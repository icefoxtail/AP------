# Geometry visual engine code qualification

Authority: explicit task instructions, code upgrade execution plan v1.1,
integration specification v1.0, then existing visual rules.

All work is on `codex/geometry-visual-engine-upgrade`. Production assets and
exam JS are read only. Run artifacts live in
`archive/_generated/geometry-visual-engine/<runId>/`. This is software
qualification, not question publication, a new GOLD pilot, or FULL PILOT.

## Ownership and boundaries

Lead owns design, implementation, static inspection, failure diagnosis,
repairs, phase decisions, and Git. GPT-6 Luna xhigh runs only explicitly
scoped tests and writes test evidence. Existing independent verifiers stay
byte-identical and do not import builder code.

Python computes canonical geometry and validates semantic claims before
materialization. Numeric values do not imply student display strings.
The composer receives prepared primitives and layout results. Math labels
use a parsed expression tree. Browser measurements decide final collision
status; approximate layout alone cannot grant FINAL_VISUAL.

## Phase order

0 baseline; 1 numeric; 2 semantic; 3 expression tree; 4 sampling/viewport;
5 labels; 6 style/composition; 7 optional TikZ; 8 entrypoints; 9 static and
actual SVG; 10 rendered boxes; 11 actual archive; 12 config/determinism;
13 regression; 14 legacy contract; 15 performance and readiness seal.

Each phase requires implementation, Lead static inspection, Luna result,
physical evidence, a separate commit, and immediate branch push. Failure
evidence is retained on retries. Code readiness requires all mandatory
gates with no unresolved P0/P1; publication still needs the existing
question quality pipeline and independent review authority.

## GOLD inheritance

Reuse numeric line relations, semantic verification, source/derived
separation, aspect policies, and deterministic witness concepts. Rewrite
the regex expression serializer and fixed offset label path. Recompute
item-level unresolved totals: r10 aggregate zero conflicts with three
POLISH_REQUIRED review rows and an archive NOT_RUN defect. Historical
render claims are not current qualification evidence.

## Performance and readiness

The final code seal validates actual artifact bytes, current code test hashes,
protected source inventory, unchanged verifier bytes, 13 isolated fixtures,
26 measured bbox captures, A/B rebuilds, and the full archive mode matrix.
Missing measurements, incomplete coverage, stale files, or synthetic browser
evidence block readiness. Pure builds never replace saved candidates.

Run after the native archive matrix and capture are complete (substitute the
run directory, archive attempt, and bbox receipt for the current job):

```text
python archive/tools/geometry-equation/record-visual-code-tests.py --run <run>
python archive/tools/geometry-equation/measure-visual-build-performance.py --run <run>
node archive/tools/geometry-equation/measure-visual-browser-performance.mjs --run <run> --archive-attempt <attempt>
node archive/tools/geometry-equation/seal-visual-engine-code-ready.mjs --run <run> --archive-attempt <attempt> --bbox-receipt <repo-relative-receipt>
```

Browser dependencies and channel are discovered through the browser runtime
and environment configuration. No personal executable paths are embedded.
Performance is measured after correctness, without inventing a latency budget.

The original v22 production verifier runs in a byte-identical shadow. The
Phase0 baseline already has 99 targets against its fixed historical 94 and
eight raw FAIL rows. Code regression uses baseline input/verifier parity and
retains every raw FAIL. The readiness seal records these inherited findings
outside its code qualification scope; they still block those production rows
from FINAL qualification. Their triage belongs to the subsequent inventory
and FULL PILOT. A code-ready fixture remains BUILD_SIDE_ONLY and cannot grant
question publication authority. Optional TikZ conversion remains draft only.

## Independent GPT review — 2026-09-27

Review target branch: `codex/geometry-visual-engine-upgrade`  
Reviewed head: `659288875bc90b2be2a58628da663dbd5830c990`

### Verdict

`GEOMETRY_VISUAL_ENGINE_CODE_READY` is accepted **only for the shared engine code and isolated qualification scope**.

The review does **not** authorize production publication, main merge, pipeline promotion, or a production-wide SVG migration.

Review coverage:

- final source/code inventory: **52/52 files opened and checked**
- protected production inventory: **4,493 files, mutation 0 as sealed**
- original independent verifiers: **6/6 byte-identical as sealed**
- Python tests: **77/77 PASS**
- Node tests: **31/31 PASS**
- static/actual SVG qualification: **13 fixtures PASS**
- deterministic A/B rebuild: **13/13 PASS**
- rendered browser QA: **26/26 PASS**
- native Archive exam/sol/ans QA: **12/12 PASS**
- inherited v22 raw qualification: **91 PASS / 8 FAIL remains unchanged**

The review independently opened the final shared engine, adapters, validators, browser QA, seal logic, tests, and critical raw evidence. The 996 regeneratable evidence files are covered by the seal inventory/hash chain; this review did not independently re-run or byte-rehash every one of those 996 generated files.

### Confirmed strengths

- production writes are fail-closed and candidate output is constrained to `archive/_generated/geometry-visual-engine/<runId>/`
- frozen independent facts are required at the shared entrypoints
- numeric geometry and semantic relation validation are separated from SVG composition
- the old greedy exponent serializer is replaced by a bounded expression tree and regression tests include the original GOLD failures
- point marker / point name / coordinate label are separated
- label layout uses N/NE/E/SE/S/SW/W/NW candidates, priority, suppression/side-panel fallback, and explicit POLISH_REQUIRED
- approximate builder layout cannot grant FINAL; actual browser `getBBox()` / `getBoundingClientRect()` drives final collision QA
- existing independent coordinate and v22 actual-SVG verifiers remain independent
- TikZ is optional candidate-only and cannot bypass common QA
- Archive QA runs the unmodified `archive/engine.html` with candidate source overrides and SHA bindings

### Integration blockers

#### 1. Latest-main drift

At review time, current main was `5f13c7289ddf8f3cf70bac7dc4b27dc0975f5a96`.
The upgrade branch was **18 commits ahead / 172 commits behind**, with merge-base `4be6351d3f4cd722ca12639d9e652777e51426db`.

The Archive engine, two original independent SVG verifiers, and the two main visual rule documents were byte-identical between the branch and current main. However, Past Exam V3 and the rules index/manifest evolved on main. Therefore the current branch qualification cannot be treated as a current-main integration qualification.

#### 2. Generated evidence is tracked on the branch

Current `GENERATED_ARTIFACT_GIT_POLICY_v1.md` classifies `archive/_generated/` as REGENERATABLE and says it must not remain in Git history.

This branch intentionally committed its qualification evidence for the experiment, including the 996-file evidence inventory. **Do not merge or cherry-pick those generated evidence paths into main.**

The branch-specific `.gitattributes` rule for `/archive/_generated/geometry-visual-engine/**` is also not a production requirement and must not override the current generated-artifact policy.

### Required integration sequence

1. Start from the **latest main**, not the stale branch tip.
2. Transfer only reviewed source/test/document changes needed by the visual engine.
3. Do not transfer tracked `archive/_generated/` evidence to main; regenerate evidence locally in the ignored workspace.
4. Preserve current-main RULES_INDEX / MANIFEST / Past Exam V3 changes.
5. Re-run the full code qualification on current main:
   - Python/Node tests
   - 13 fixture static/actual parity
   - deterministic rebuild
   - 26 rendered-bbox cases
   - 12 native Archive cases
   - inherited v22 regression
6. Only after the current-main qualification passes, enter the **Geometry Equation FULL PILOT**.
7. Production-wide migration and canonical pipeline promotion remain blocked until that FULL PILOT and independent review pass.

### Pipeline connection decision

A pipeline connection is ultimately required, but **not as a direct production-promotion path yet**.

After current-main requalification, the visual engine should first be connected as the S8/candidate-generation backend:

```text
verified solution / EXPECTED FACT
→ geometry visual engine
→ isolated candidate SVG
→ static + actual-SVG parity
→ READY_FOR_LOCAL_VISUAL_QA
→ local Codex rendered-bbox / Archive QA
→ V2/V3 independent review
→ promotion authority
```

For scheduled GPT/Work production, SVG generation may occur automatically, but GPT-side creation does not grant render FINAL. This preserves the current reservation rule `NOT_RUN_CODEX_HANDOFF`.

The intended operational split is:

- scheduled pipeline: candidate generation + math/semantic evidence
- local Codex: final rendered layout, typography, clipping/collision, Archive desktop/mobile QA
- promotion: only after existing independent review/release gates

Do not connect this engine as an unconditional replacement backend before the Geometry Equation FULL PILOT.

### Current Past Exam adapter gap

Current main already has the correct lifecycle slots in
`archive/tools/past-exam-pipeline/completion-contract.json`:

```text
ALL_QUESTION_VISUAL_TRIAGE
→ EXPECTED_FACT_FREEZE
→ NUMERIC_VISUAL_BUILD
→ STATIC_AND_RENDER_CAPTURE
```

However, current main does not yet produce the new engine input contract
(`independentFactHash + visualSpec`). Therefore the engine is **not yet wired
into Past Exam V3** even though the lifecycle has the right place for it.

The integration adapter must be explicit and candidate-only:

```text
frozen EXPECTED FACT bundle
→ canonical frozen-fact SHA
→ fact.independentFactHash
→ visualSpec.sourceFacts.independentFactHash
→ visualSpec objects / displayFacts
→ geometry visual engine STANDARD or SPECIAL route
→ archive/_generated/... candidate
```

The outer and inner fact hash must match. The adapter must not derive expected
facts from the generated SVG or from builder metadata.

`READY_FOR_LOCAL_VISUAL_QA` is a run/evidence lifecycle state, **not a new
production JS field**. `completion-contract.json` already limits production
visual fields to the existing `solutionImage*` contract.

Recommended timing:

1. latest-main source-only integration and full code requalification
2. add this feature-gated S8 adapter
3. run the Geometry Equation FULL PILOT through the adapter
4. independent review
5. only then consider making the backend canonical/default

This adapter is required **before the FULL PILOT** if the pilot is intended to
exercise the real Past Exam path. It must not grant automatic promotion.

