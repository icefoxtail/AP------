# Universal A/B/C runtime workflow

The universal lane is a bounded extension over the existing B whole-exam
runtime. It uses the fixed Luna xhigh route, keeps production Archive
registration disabled, and fails closed for unsupported `family x transform`
capabilities.

## Contract and planning

Validate a Universal Question IR and inspect a capability before dispatching a
builder:

```powershell
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py universal-ir-validate --input <ir.json> --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py family-capability --family LINEAR_EQUATION --transform numeric --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py curriculum-adapter-report --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py curriculum-catalog-report --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py universal-plan --input <source-questions.json> --target-classes A,B,C --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py universal-high1-prepare --run-id <id> --title "<display title>" --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py universal-high1-variant-prepare --run-id <id> --title "<display title>" --variant-class A|B|C --fixture-scope all_structured --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py universal-high1-capability --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py universal-middle-school-variant-prepare --run-id <id> --title "<display title>" --variant-class A|B --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py universal-middle-school-capability --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py universal-middle-school-geometry-variant-prepare --run-id <id> --title "<display title>" --variant-class A|B --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py universal-middle-school-geometry-capability --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py universal-middle-school-quadrilateral-variant-prepare --run-id <id> --title "<display title>" --variant-class A|B --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py universal-middle-school-quadrilateral-capability --json
```

`universal-plan` is a preflight planner. `HOLD` is an intentional result when
the adapter, solver, visual lane, fixture corpus, or review evidence is not
registered for the exact combination. There is no silent family or variant
fallback.

## Local Run lifecycle

The universal Run freezes source identity, canonical rule snapshot, and batch order at creation. The
stage sequence is:

```text
S00 SOURCE_LOCK → S01 PREFLIGHT → S01A VISUAL_RECON →
S01B UNIVERSAL_IR_ANALYSIS → S01C VARIANT_ROUTER_CAPABILITY →
S02 ROUND1_GENERATION → S02A VARIANT_PROOF_PRECHECK → S03 REVIEW1 →
S04 BOUNDED_REVISION → S05 REVIEW2 → S06 MOTHER_FINAL → S07 ASSEMBLY →
S08 BROWSER_RENDER → S09 PACKAGE → S09A FINAL_CLOSURE → SEALED
```

The executable lifecycle commands are:

```powershell
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py universal-run-start --run-id <id> --source-lock <source-lock.json> --question-count <n> --batch-plan <batch-plan.json> --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py universal-run-status --run <id> --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py universal-run-resume --run <id> --batch-plan <batch-plan.json> --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py universal-run-stage --run <id> --stage <S01/S01A/S01B/S01C> --status PASS --evidence <evidence-id> --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py universal-run-candidates --run <id> --input <candidates.json> --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py universal-run-precheck --run <id> --input <precheck.json> --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py universal-run-review --run <id> --round review1 --input <review1.json> --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py universal-run-revision --run <id> --input <revision.json> --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py universal-run-review --run <id> --round review2 --input <review2.json> --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py universal-run-mother-final --run <id> --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py universal-run-ledger --run <id> --input <variant-rows.json> --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py universal-run-assemble --run <id> --title "<display title>" --archive-root <archive-root> --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py universal-run-render --run <id> --input <actual-render-evidence.json> --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py universal-run-package --run <id> --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py universal-run-closure --run <id> --input <closure-report.json> --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py universal-run-seal --run <id> --json
```

After a real browser has produced the three-mode evidence, the deterministic
High-1 bridge can close package, legacy final closure, Universal S09A, and
local seal in one fail-closed operation:

```powershell
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py universal-high1-finalize --run <id> --render-evidence <render-evidence.json> --review-ledger <review-ledger.json> --external-findings <external-findings.json> --json
```

`universal-run-closure` requires a PASS closure with actual `exam`,
`solution`, and `answer` browser evidence and a PASS package round-trip. The
ledger must be complete with a verified A/B/C result for every expected
ordinal. A sealed universal Run is `SEALED_LOCAL` and remains
`NOT_PUBLISHED`.

The High-1 finalize command also requires the legacy
`ALIVE_FINAL_CLOSURE_AUDIT` to PASS for package, Node, questions, browser,
external review, and variant. Its SHA-256 is recorded in the Universal S09A
closure artifact.

The generic `universal-run-stage` command is deliberately limited to the four
preflight stages. Generation, proof precheck, review, revision, Mother final,
assembly, render, package, closure, and sealing must use their dedicated
commands so that an operator cannot mark a missing artifact as PASS with a
free-form evidence string.

## Benchmark and promotion

Run the deterministic contract benchmark repeatedly:

```powershell
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py universal-variant-benchmark --repeat 3 --json
```

The benchmark covers the A/B/C bounded transforms, negative reductions,
`family x transform` promotion, mixed-exam planning, local package/closure/
seal, and repeatability. A benchmark `ACTIVE` result is a capability fixture
result, not permission to publish to `archive/exams/similar/`.

`universal-high1-prepare` is the historical deterministic High-1 integration
bridge. It selects one fixture per canonical H22-C/H22-C2 unit, records source
StudentIR/ProofIR, runs the existing exact solver and independent reviewer,
creates an experimental B-replay candidate set, and stops at
`S08_BROWSER_RENDER`.

`universal-high1-variant-prepare` is the newer bounded exact A/B/C lane. Its
default `all_structured` scope selects all 57 registered general/boundary/
composite fixtures across the canonical units; `ordinary_per_unit` is retained
as a compatibility scope. It applies the declared A/B/C transform, recomputes
the answer with the High-1 exact adapter, and records solutionDetail, visual
specs, proof sidecars, and independent review evidence. It covers only the
registered High-1 fixture vocabulary; it does not claim to solve arbitrary
Korean prose. Run
`universal-high1-capability` to inspect the positive and negative
`family x transform` promotion report. Both commands stop before browser
render evidence; use the actual browser and then
`universal-high1-finalize` to reach `SEALED_LOCAL`.

`universal-middle-school-variant-prepare` is the first Phase-5 vertical slice:
M1-03 문자와 식 and M2-03 연립일차방정식, six structured fixtures each, exact
rational A/B variants, and middle-school solution conventions. The companion
`universal-middle-school-function-variant-prepare` covers M2-04 일차함수와
그래프 with six structured fixtures and mandatory problem/solution graph SVGs.
C and all unregistered units remain HOLD. After real browser evidence, close
the run with:

```powershell
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py universal-bounded-finalize --run <id> --render-evidence <render-evidence.json> --external-findings <external-findings.json> --json
```

The shared finalizer projects Universal Review2 into the legacy final closure
ledger, runs the same static/Node/exact/package/browser/external/variant gates,
and seals only on complete PASS.
The current final bounded checkpoint is `20260901-middle-equations-a03` /
`20260901-middle-equations-b03`; it includes a tested `b=0,d=0` boundary path
and keeps determinant formulas out of student-facing middle-school solutions.
See `alive/05_DESIGN/ALIVE_UNIVERSAL_VARIANT_ENGINE_FINAL_REVIEW_20260901.md`
and its JSON checkpoint for the exact promotion/HOLD boundary.

The subsequent M2-04 checkpoint is `20260901-middle-function-a02` /
`20260901-middle-function-b02`; it includes exact value/two-point recovery,
mandatory solution graphs, and a browser-tested guard against implementation
helper text such as `_fmt(...)` leaking into student-facing explanations.

The M2-05 triangle-properties bounded adapter is exposed by
`universal-middle-school-geometry-variant-prepare` and
`universal-middle-school-geometry-capability`. It currently covers six exact
triangle fixtures (angle sum, exterior angle, and isosceles base angles), A/B
only, with mandatory `segment_geometry` problem/solution SVGs. SVG angle labels
must use Unicode `°`; TeX `^\\circ` is reserved for MathJax text and must not
leak into SVG annotations. The authoritative checkpoint is
`20260901-middle-triangle-a03` / `20260901-middle-triangle-b03`.

The M2-05 quadrilateral-properties bounded adapter is exposed by
`universal-middle-school-quadrilateral-variant-prepare` and
`universal-middle-school-quadrilateral-capability`. It currently covers six
parallelogram opposite/adjacent-angle fixtures, A/B only, with mandatory
`segment_geometry` problem/solution SVGs. Rectangle/rhombus extensions and C
parameter recovery remain `HOLD`; the authoritative checkpoint is
`20260901-middle-quadrilateral-a01` / `20260901-middle-quadrilateral-b01`.

The M2-06 similar-figures bounded adapter is exposed by
`universal-middle-school-similarity-variant-prepare` and
`universal-middle-school-similarity-capability`. It covers six exact
corresponding-side proportion fixtures, including general, boundary,
composite, and reverse-order cases. A numeric and B representation are
`ACTIVE_BOUNDED`; C parameter recovery and arbitrary prose remain `HOLD`.
Problem and solution `segment_geometry` SVGs are mandatory. The authoritative
checkpoint is `20260901-middle-similarity-a01` /
`20260901-middle-similarity-b01`.

The remaining M2-06 parallel-segment-ratio bounded adapter is exposed by
`universal-middle-school-parallel-ratio-variant-prepare` and
`universal-middle-school-parallel-ratio-capability`. It covers six exact
`DE∥BC` triangle-division fixtures, including general, boundary, composite,
and reverse-order cases. A numeric and B representation are
`ACTIVE_BOUNDED`; C parameter recovery and arbitrary prose remain `HOLD`.
Problem and solution `segment_geometry` SVGs are mandatory. The authoritative
checkpoint is `20260901-middle-parallel-ratio-a01` /
`20260901-middle-parallel-ratio-b01`.

The M2-07 Pythagorean-theorem bounded adapter is exposed by
`universal-middle-school-pythagorean-variant-prepare` and
`universal-middle-school-pythagorean-capability`. It covers six exact
integer Pythagorean-triple fixtures for finding the hypotenuse from the two
legs, including general, boundary, composite, and reverse-order cases. A
numeric and B representation are `ACTIVE_BOUNDED`; C parameter recovery and
Pythagorean application word problems remain `HOLD`. Problem and solution
`segment_geometry` SVGs are mandatory. The authoritative checkpoint is
`20260901-middle-pythagorean-a01` / `20260901-middle-pythagorean-b01`.

The M2-07 Pythagorean-application bounded adapter is exposed by
`universal-middle-school-pythagorean-application-variant-prepare` and
`universal-middle-school-pythagorean-application-capability`. It covers six
structured ladder-context fixtures where wall height and ground distance form
the two legs and ladder length is the hypotenuse. A numeric and B context
representation are `ACTIVE_BOUNDED`; C parameter recovery and arbitrary
real-world word problems remain `HOLD`. Problem and solution
`segment_geometry` SVGs are mandatory. The authoritative checkpoint is
`20260901-middle-pythagorean-application-a01` /
`20260901-middle-pythagorean-application-b01`.

The M2-08 probability bounded adapters are exposed by
`universal-middle-school-probability-variant-prepare` and
`universal-middle-school-probability-capability`. `PROBABILITY_BASIC` uses
six exact total-outcome/favourable-outcome fixtures and
`PROBABILITY_COUNTING` uses six restricted sample-space counting fixtures;
both include general, boundary, and composite cases. A numeric and B
representation are `ACTIVE_BOUNDED`; C parameter recovery and arbitrary
Korean-prose interpretation remain `HOLD`. These two bounded families have
`visualDependency=NONE` and do not require SVG; do not infer that other
probability types are covered. The authoritative checkpoints are
`20260901-middle-probability-basic-a01` /
`20260901-middle-probability-basic-b01` and
`20260901-middle-probability-counting-a01` /
`20260901-middle-probability-counting-b01`.

The M1-01 prime-factorization bounded adapter is exposed by
`universal-middle-school-prime-factorization-variant-prepare` and
`universal-middle-school-prime-factorization-capability`. It covers six exact
natural-number factorization fixtures, including prime-boundary, repeated
factor, composite, and mixed-composite cases. A numeric and B representation
are `ACTIVE_BOUNDED`; C parameter recovery, unregistered application forms,
and arbitrary Korean-prose interpretation remain `HOLD`. The family has no
visual dependency, so SVG is explicitly `NOT_REQUIRED` for this bounded
slice. The authoritative checkpoint is
`20260901-middle-prime-factorization-a01` /
`20260901-middle-prime-factorization-b01`.

The M1-02 rational-arithmetic bounded adapter is exposed by
`universal-middle-school-rational-arithmetic-variant-prepare` and
`universal-middle-school-rational-arithmetic-capability`. It covers six exact
signed-rational addition/subtraction fixtures, including different
denominators, zero results, negative subtraction, and mixed signs. A numeric
and B representation are `ACTIVE_BOUNDED`; C parameter recovery and
unregistered multiplication/division/absolute-value/number-line forms remain
`HOLD`. The family has no visual dependency, so SVG is explicitly
`NOT_REQUIRED` for this bounded slice. The authoritative checkpoint is
`20260901-middle-rational-arithmetic-a01` /
`20260901-middle-rational-arithmetic-b01`.

For a final all-structured run, browser verification is a completion gate, not
a best-effort preview. Open the production `archive/engine.html` in exam,
solution, and answer modes, poll until the last expected question and page are
present, and save mode-specific screenshots plus `render-evidence.json` inside
the Run. A fixed delay that happens to show the first few questions is not
evidence of completion. The finalizer must reject missing last-question
evidence, image failures, MathJax errors, overflow, missing review rows, or
missing package/closure evidence. Formatting fixes found by this gate (exact
fractions, coordinate signs, and math delimiters) must be applied to the
generator and rerun through the same gate; never patch only the rendered output.

The M1-05 basic-geometry bounded adapter is exposed by
`universal-middle-school-basic-geometry-variant-prepare` and
`universal-middle-school-basic-geometry-capability`. It covers six angle
classification and six line-pair position-relation fixtures. A numeric and B
representation are `ACTIVE_BOUNDED`; C parameter recovery and unregistered
geometry relations remain `HOLD`. Both families require `segment_geometry`
SVG in problem and solution; relation diagrams must not leak generic axes into
the final visual. The authoritative checkpoint is
`20260901-middle-basic-geometry-a03` /
`20260901-middle-basic-geometry-b03`.

The M1-06 polygon/circle/plane-measure bounded adapter is exposed by
`universal-middle-school-polygon-circle-measure-variant-prepare` and
`universal-middle-school-polygon-circle-measure-capability`. It covers six
polygon interior-sum, six circle area/circumference, and six rectangle
area/perimeter fixtures. A numeric and B representation are
`ACTIVE_BOUNDED`; C and unregistered composite figures remain `HOLD`. Problem
and solution visuals are mandatory: `segment_geometry` for polygons and
rectangles, proportion-preserving `circle_geometry` for circles. The solution
render gate must wait for its readiness flag and last question because detailed
solutions can take longer than exam mode. The authoritative checkpoint is
`20260901-middle-m1-06-a02` / `20260901-middle-m1-06-b03`.

The M1-04 coordinate-plane bounded adapter is exposed by
`universal-middle-school-coordinate-plane-variant-prepare` and
`universal-middle-school-coordinate-plane-capability`. It covers six exact
point-location fixtures spanning all four quadrants and the x/y-axis boundary
cases. A numeric and B representation are `ACTIVE_BOUNDED`; C parameter
recovery, line-equation/translation extensions, and arbitrary coordinate-plane
prose remain `HOLD`. Problem and solution `coordinate_plane` SVGs are
mandatory and must be confirmed in the actual browser. The authoritative
checkpoint is `20260901-middle-coordinate-plane-a01` /
`20260901-middle-coordinate-plane-b01`.

The M1-07 solid-figure bounded adapter is exposed by
`universal-middle-school-solid-figure-measure-variant-prepare` and
`universal-middle-school-solid-figure-measure-capability`. It covers six
cube-total-edge-length and six rectangular-prism-volume fixtures. A numeric
and B representation are `ACTIVE_BOUNDED`; C and unregistered surface-area or
other solid-figure families remain `HOLD`. Problem and solution wireframes are
mandatory and use `segment_geometry` with the dimensions consumed by the exact
solver. The authoritative checkpoint is
The initial checkpoint `20260901-middle-m1-07-a01` /
`20260901-middle-m1-07-b01` is historical only because its sealed manifest
render SHA did not match the retained evidence file. Do not use those Runs as
current authority. The authoritative replacement is
`20260901-middle-m1-07-a02` / `20260901-middle-m1-07-b02`; it was re-rendered
in the actual browser, visually reviewed, sealed, packaged, and resumed.

The M1-08 data-organization and interpretation bounded adapter is exposed by
`universal-middle-school-data-variant-prepare` and
`universal-middle-school-data-capability`. It covers six frequency-total and
six mean fixtures with exact `Fraction` recomputation. A numeric and B
representation are `ACTIVE_BOUNDED`; C and unregistered distribution
interpretation remain `HOLD`. Problem and solution table visuals are required.
Before assembly, the generator must include the actual source values in the
student-facing question and the fixture lint must reject duplicate A outputs.
The authoritative checkpoint is
`20260901-middle-m1-08-a03` / `20260901-middle-m1-08-b02`; actual browser exam,
solution, and answer evidence plus resume, package CRC, and closure are
required before local sealing.

Phase 6 whole-exam planning uses `universal-plan` with explicit source
questions and optional target class ranges, workload limits, school profile,
and planner policy. It records source structure/difficulty/question-type and
visual/constructed-response distributions, preserves source order and anchors,
and leaves unsupported substitutions or range violations as `HOLD`.

Phase 7 final review uses `universal-phase7-audit` over explicitly named
authoritative Runs. The audit is fail-closed: all S00~SEALED statuses, actual
browser exam/solution/answer evidence, last-page/last-question checks, variant
ledger, package SHA and CRC, legacy closure, and `NOT_PUBLISHED` must pass.
The result `PASS_ACTIVE_BOUNDED` is local bounded promotion only and never
publishes to the production Archive.

For install-ready identity, legacy output uses `<source>_유사` and then
`<source>_유사2`, while new universal output uses `<source>_유사A`,
`<source>_유사B`, or `<source>_유사C`. Repeated output in one class uses
`<source>_유사A2` (or B2/C2); never create a class `1` suffix. A/B/C counters
are independent, and old untyped `_유사` files are never silently treated as
class A. The class must be propagated to JS basename, `window.examTitle`,
asset root, package manifest, and reports.

The final authoritative audit artifact is
`alive/05_DESIGN/ALIVE_UNIVERSAL_VARIANT_ENGINE_PHASE7_AUDIT_AUTHORITATIVE_20260901.json`.
It covers 35 latest authoritative Runs. Historical superseded Runs can remain
for audit history, but must be excluded from the active set when an integrity
replacement has been sealed.
