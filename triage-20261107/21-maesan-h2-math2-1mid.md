# 21_매산고_1학기_중간_고2_수학II — SVG input triage

Current source: main 87b09c58ac6cc061ba623c1e3e990ddcc18f6537; source JS blob 922cb55140a0eb6345ad9137826eaadec5b9a80e (matches assigned review base afe5a234). Current ledger blob 308f874f7d13d22f9a07cb829ac5196ba3230da7 contains no entry for this exam. No exact-exam input owner branch was found; package branch selected: codex/svg-21-maesan-h2-math2-1mid-20261111.

Engine references at current main: AUTHOR_GUIDE b6dd1acc05e0281d243ad870b039cf1f4e74e9a3; graph guide dd8a24a4077ee39047452c592589b7b3edae623e; plane guide 4130604a93a69f2f2906916a13a6a5b8272fea56; phase2 3e52203bcf1d9d1e24c08bc81760bb4414813324; contracts 9735b0c5fc1d7786493faf190c460e289d3b789a; render-plan a7e20974fb782aa5df48eda87fbf715827a437f8.

Original figures inspected: Q11 q11.png blob fe74b683ed8c2daee8205ae4082f6a5c7c57b2c1; Q13 q13.png blob ec52ed88aa5dbfd6498e84cd2accbbf1aa968159; Q17 q17.png blob 08b0ba68d3d4c7f479d3fe3278ffc529b5ff6abe. Existing Q15 solution SVG is preserved unchanged: archive/assets/images/21_매산고_1학기_중간_고2_수학II/q15-solution.svg blob 8873d92960ff0fc8691b0215264b445afb791c92. Its new-engine provenance is unverified; it is not a new PASS.

| Q | Decision | Rationale | Render | Review |
|---:|---|---|---|---|
| 1 | EXEMPT | Direct substitution in a polynomial limit; no figure needed. | NOT_RUN | NOT_RUN |
| 2 | FIGURE / INPUT_READY | Exact cubic and tangent at (1,5); includes all curve-line intersections. | NOT_RUN | NOT_RUN |
| 3 | FIGURE / INPUT_READY | Exact quadratic on a closed interval with both endpoints. | NOT_RUN | NOT_RUN |
| 4 | FIGURE / INPUT_READY | Open branch endpoints and the original function's filled completion are both at (3,6). | NOT_RUN | NOT_RUN |
| 5 | UNSUPPORTED | Exact curve is sqrt(quadratic)/(linear); supported square-root is affine-radicand and rational is linear-over-linear. No exact composed capability; do not substitute the limit. | NOT_RUN | NOT_RUN |
| 6 | EXEMPT | Product-rule computation only. | NOT_RUN | NOT_RUN |
| 7 | FIGURE / INPUT_READY | Exact three-piece absolute-value curve and its two one-sided tangent lines at x=1. | NOT_RUN | NOT_RUN |
| 8 | FIGURE / INPUT_READY | Exact parabola, secant, and parallel tangent at x=3/2. | NOT_RUN | NOT_RUN |
| 9 | FIGURE / INPUT_READY | Two exact comparison-bound lines only; f is explicitly not drawn. | NOT_RUN | NOT_RUN |
| 10 | EXEMPT | Difference quotient and polynomial factorization; no graph needed. | NOT_RUN | NOT_RUN |
| 11 | FIGURE / INPUT_READY | Source-image branch trace, open/closed points, and both limits at x=−1. Coefficients encode the pictured trace only, not formulas given in the question. | NOT_RUN | NOT_RUN |
| 12 | EXEMPT | Derivative definition and algebraic chain factorization; no graph needed. | NOT_RUN | NOT_RUN |
| 13 | FIGURE / INPUT_READY | Stacked source-trace f with open/filled points; exact solution-derived g pieces and zeros 0,1,2. f coefficients are visual trace encoding only. | NOT_RUN | NOT_RUN |
| 14 | FIGURE / INPUT_READY | Exact quadratic −4(x−2)(x−3), its two roots, and vertex. | NOT_RUN | NOT_RUN |
| 15 | KEEP_PRESERVE / REPLACEMENT_UNSUPPORTED | Preserve existing SVG. Current contract cannot combine a discontinuous staircase with circle overlays/two-panel comparison; existing SVG has no provenance marker and engine provenance is unverified. | NOT_RUN | NOT_RUN |
| 16 | EXEMPT | Limit-law truth/falsity statements; no single graph is required. | NOT_RUN | NOT_RUN |
| 17 | FIGURE / INPUT_READY | Source-trace branches, open/filled values, right approach at −1 and left approach at 3. Coefficients encode the pictured trace only. | NOT_RUN | NOT_RUN |
| 18 | FIGURE / INPUT_READY | Explicit t=3 example; incenter comes from angle bisectors and radius from perpendicular foot, not a hardcoded derived point. | NOT_RUN | NOT_RUN |
| 19 | FIGURE / INPUT_READY | Exact continuous piecewise quadratic g(t)=t²+12|t|+6 and cusp at t=0. | NOT_RUN | NOT_RUN |
| 20 | EXEMPT | The polynomial is determined by algebraic degree, derivative, and value constraints; no graph needed. | NOT_RUN | NOT_RUN |

Only Q2, Q3, Q4, Q7, Q8, Q9, Q11, Q13, Q14, Q17, Q18, and Q19 have input folders, each with item.json, plan.json, and publish.json. publish.size=full is provisional and not render-bound.

Local checks: JSON parse and static schema-shape checks PASS; all 12 sourceQuote values were verified as exact 12–40 character substrings of the matching item content/choices/solution; static mathematical invariants were independently checked. ENGINE_INPUT_CHECK=NOT_RUN: the inspected render-plan.mjs exposes only the --item/--plan/--out and --manifest/--out render paths plus renderPlan(), which creates output files and runs the render/capture pipeline; phase2.mjs exposes the work/review flow, not a pure author-plan validator. Invoking render-plan would violate the no-render scope. Rendering, SVG/PNG inspection, independent review, publishing, and ledger updates were not run.
