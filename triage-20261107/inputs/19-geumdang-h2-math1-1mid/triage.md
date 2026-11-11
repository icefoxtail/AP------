# 19 금당고 1학기 중간 고2 수학I · SVG 입력 triage

- Source: `archive/exams/original/high/h2/1mid/19_금당고_1학기_중간_고2_수학I.js`
- Verified source blob: `a1351ddf0ae28051d860cacee4930b59fd23421e` (21 items)
- Status means input decision only. No renderer run or SVG/PNG output is included. `PLAN_READY` files have static contract/source review only; `publish.json.size` is provisional until the root renderer produces `figure-result.json`.
- Original source images q09, q11, q21 are preserved untouched.

| Q | Decision | Evidence / action |
|---:|---|---|
| 1 | EXEMPT | Direct logarithm/exponent evaluation; solution is scalar calculation. |
| 2 | EXEMPT | Convert 125 to 5³ and compare exponents; no spatial or graphical relation. |
| 3 | EXEMPT | Apply sector formula S=rl/2 to two scalar measurements; no spatial reasoning is needed. |
| 4 | FIGURE · PLAN_READY | Log-domain conditions produce (2,3)∪(3,5); number line marks integer points. Files in `root-inputs/q04/`. |
| 5 | EXEMPT | Vieta relations and base-change algebra only. |
| 6 | FIGURE · HOLD | QIII and tanθ=1 determine a unit-circle point; exact construction plan not yet prepared. Do not invent a representative point. |
| 7 | EXEMPT | Rational exponent/divisibility calculation only. |
| 8 | FIGURE · PLAN_READY | Exact substitution t=2^{-x} gives y=(t−3)²+4 on [1,4]; plan shows vertex and both endpoints. Files in `root-inputs/q08/`. |
| 9 | KEEP | Preserve original q09.png cone illustration; solution uses circumference/sector-arc equality. No replacement or supplemental symbolic-radius plan. |
| 10 | EXEMPT | Telescoping logarithm sum. |
| 11 | KEEP | Preserve original q11.png; it already depicts both inverse curves, P/Q, and axis-parallel guides from the prompt. No replacement. |
| 12 | FIGURE · HOLD | P(−8,15), origin, and radius 17 support a coordinate/right-triangle view; exact construction plan not yet prepared. |
| 13 | EXEMPT | Substitution and algebraic identity reduce the product to 4. |
| 14 | EXEMPT | The 24 cosine terms cancel in 12 antipodal pairs using cos(α+π)=−cosα; then add 1. Pure identity calculation. |
| 15 | UNSUPPORTED | Solution compares t with frac(−2t) on [0,1); current discontinuous-graph contract has no exact shared-axis piecewise comparison. Do not approximate or use stacked panels as if they show intersections. |
| 16 | EXEMPT | Case count for square and fifth roots; no spatial relation. |
| 17 | FIGURE · PLAN_READY | Exact admissible parameter interval 1/6<a≤1/2; number line encodes open/closed boundaries. Files in `root-inputs/q17/`. |
| 18 | EXEMPT | Root-coefficient relations and sign/algebra evaluation only. |
| 19 | FIGURE · HOLD | QIII sign facts determine absolute-value simplification; an exact generic angle is not supplied, so no sample point is invented. |
| 20 | HOLD | Substitution yields the full open domain t>0; a finite polynomial viewport cannot be presented as that entire domain. No approximate window plan. |
| 21 | UNSUPPORTED | The solution needs two arbitrary exponential curves f=2ˣ−1 and g=−2⁻ˣ+3 together; current paired-curve graph contract is limited to inverse exp/log pairs, not this pair. Preserve q21.png; do not approximate curves. |

## Validation and preservation

- Source blob matches the verified Git object id above; ordinal mappings are 1–21.
- For Q4/Q8/Q17, item paths and JSON structure were checked against `render-plan.mjs` input shape and `AUTHOR_GUIDE.md` contracts; source quote and exact coefficients/intervals were cross-checked against the archived solution.
- Rendering, independent SVG/PNG review, source image changes, global ledger edits, and publication were not performed in this input-authoring step.
