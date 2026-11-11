# 19 금당고 1학기 중간 고2 수학I · SVG 입력 triage

- Source: `archive/exams/original/high/h2/1mid/19_금당고_1학기_중간_고2_수학I.js`
- Verified source blob: `a1351ddf0ae28051d860cacee4930b59fd23421e` (21 items)
- Status means input decision only. No renderer run or SVG/PNG output is included. `PLAN_READY` files have static contract/source review only; `publish.json.size` is provisional until the root renderer produces `figure-result.json`.
- Original source images q09, q11, q21 are preserved untouched.

| Q | Decision | Evidence / action |
|---:|---|---|
| 1 | EXEMPT | Direct logarithm/exponent evaluation; solution is scalar calculation. |
| 2 | EXEMPT | Convert 125 to 5³ and compare exponents; no spatial or graphical relation. |
| 3 | FIGURE · PLAN_READY | S=18π and ℓ=6π give r=6 and central angle π, so an exact semicircular sector can show the radius, arc length, and area together. The exact construction worker, displayed-geometry inventory, and `specFor` pass. |
| 4 | FIGURE · PLAN_READY | Log-domain conditions produce (2,3)∪(3,5); number line marks integer points. Files in `root-inputs/q04/`. |
| 5 | EXEMPT | Vieta relations and base-change algebra only. |
| 6 | FIGURE · PLAN_READY | The exact value tanθ=1 with π<θ<3π/2 gives θ=5π/4 and P=(−√2/2,−√2/2) on the unit circle. The construction worker and displayed-geometry inventory both pass. |
| 7 | EXEMPT | Rational exponent/divisibility calculation only. |
| 8 | FIGURE · PLAN_READY | Exact substitution t=2^{-x} gives y=(t−3)²+4 on [1,4]; plan shows vertex and both endpoints. Files in `root-inputs/q08/`. |
| 9 | KEEP | Preserve original q09.png cone illustration; solution uses circumference/sector-arc equality. No replacement or supplemental symbolic-radius plan. |
| 10 | EXEMPT | Telescoping logarithm sum. |
| 11 | KEEP | Preserve original q11.png; it already depicts both inverse curves, P/Q, and axis-parallel guides from the prompt. No replacement. |
| 12 | FIGURE · PLAN_READY | P(−8,15) and the x-axis perpendicular foot F give the exact O-F-P right triangle and OP=17. The construction worker and displayed-geometry inventory both pass. |
| 13 | EXEMPT | Substitution and algebraic identity reduce the product to 4. |
| 14 | EXEMPT | The 24 cosine terms cancel in 12 antipodal pairs using cos(α+π)=−cosα; then add 1. Pure identity calculation. |
| 15 | FIGURE · PLAN_READY | The actual `SHARED` discontinuous-pair contract supports f(t)=t on [0,1) and g(t)=frac(−2t), including g(0)=0 and the jump value at t=1/2. Pair expansion and graph framing pass; the common points are exactly 0, 1/3, 2/3. |
| 16 | EXEMPT | Case count for square and fifth roots; no spatial relation. |
| 17 | FIGURE · PLAN_READY | Exact admissible parameter interval 1/6<a≤1/2; number line encodes open/closed boundaries. Files in `root-inputs/q17/`. |
| 18 | EXEMPT | Root-coefficient relations and sign/algebra evaluation only. |
| 19 | FIGURE · PLAN_READY | A unit-circle plan shades QIII to show x=cosθ<0 and y=sinθ<0 without inventing a particular ray or point. The exact construction worker, displayed-geometry inventory, and `specFor` pass. |
| 20 | FIGURE · PLAN_READY | With t=2ˣ>0, the integer parameters are exactly 0, 1, 2, 3; the number-line solver accepts the four-point plan. The open t-domain is explained in the solution, not approximated as a graph. |
| 21 | KEEP | The exp-log-pair contract can frame both exact exponential-affine curves, but cannot encode their exact intersections A/B: x=±log₂(2+√3) is outside the overlay exact-value grammar, and the attempted exact curve point is refused as `OVERLAY_VALUE_INVALID:A`. Preserve q21.png, which already shows both curves and OACB; do not approximate or replace it. |

## Validation and preservation

- Source blob matches the verified Git object id above; ordinal mappings are 1–21.
- Latest-main contract sources were hash-checked against the verified checkout at `130c803fa62ef0b56637716e10dffea95edab1fd`. Q4/Q17/Q20 pass the number-line solver; Q3/Q6/Q12/Q19 pass the exact construction worker, displayed-geometry inventory, and `specFor`; Q8 passes graph framing; Q15 passes pair expansion plus shared-curve graph framing, including all three overlay points. Q21's two exponential curves pass exp-log-pair framing/spec generation, but exact A/B labels and quadrilateral overlays are unavailable.
- Source quote and exact coefficients, intervals, points, and labels were cross-checked against the archived solution. `publish.json.size` remains provisional until the renderer writes `figure-result.json`.
- Rendering, independent SVG/PNG review, source image changes, global ledger edits, and publication were not performed in this input-authoring step.
