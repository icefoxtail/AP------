# 22 매산고 고2 기하와 벡터 1학기 중간 — SVG 입력 판정

- Source: archive/exams/original/high/h2/1mid/22_매산고_1학기_중간_고2_기하와벡터_기출.js
- Source blob: 580b9cd7602aa47774884bb3f6bb053a52cbccfa (verified against current main; source unchanged)
- Plan-contract check: inspected current main f792f2a77b76293bc8eebf863effee481585f979, validator blob 22917c19fac9831b84bab75cddfcd96d3ff6ea38. q01 FOCUS permits id, kind, label, coordinates, side, curve; side is optional, so q01’s {id, kind} passes this static key check.
- Existing question images, source JS, and q13/q17 solution SVGs are preserved. This branch adds candidate input/triage files only; no renderer or engine was run here.
- q18 reuses the existing bound GOLDEN plan at archive/tools/geometry-equation/ops/golden/item43/plan.json (blob 289c7ea5dca04cd4425b2c27eaf317e4ce67d6b1); no duplicate q18 plan is included. Its archived plan caption contains OP=5/2; review visible accessibility/output before publish.
- q05 uses p=-1 as a representative because p is not uniquely fixed by q05. q06 uses the same exact geometry while preserving the source-image condition P left of F; no p or focus coordinate is labeled.
- q10 compares k=3 (no intersection) and k=4 (two intersections) internally as a visual example; plan/publish captions avoid the answer value. The implementation reviewer must confirm exact lines and layout in the rendered PNG.
- q13/q17 are replacement candidates only. Existing SVG files are not changed.
- publish.json size is a pre-render estimate based on capability defaults; the implementation/review worker must align it to actual renderer sizeClass.

| Q | Decision | Capability / reuse | Note |
|---|---|---|---|
| 01 | FIGURE | conic PARABOLA | y²=8x and focus |
| 02 | FIGURE | ellipse-figure-v1 | ellipse and focus pair |
| 03 | EXEMPT | — | algebraic vector simplification; no added visual relation |
| 04 | FIGURE | ellipse-figure-v1 | exact tangent at the given point |
| 05 | FIGURE | conic PARABOLA | p<0 representative; original q05 image preserved |
| 06 | FIGURE | conic PARABOLA | preserve P left of F; exact representative satisfies PH, HI |
| 07 | FIGURE | conic HYPERBOLA | vertical transverse axis and foci |
| 08 | FIGURE | conic HYPERBOLA | asymptotes shown without equation labels |
| 09 | FIGURE | construction-spike-v1 + G3 vectors | square vectors, diagonal, orthogonality, 3a+b |
| 10 | FIGURE | conic HYPERBOLA | compare two parallel-line cases, no answer labels |
| 11 | FIGURE | conic HYPERBOLA | shifted center and foci |
| 12 | FIGURE | conic PARABOLA/G2c | external point and positive-slope tangent contact |
| 13 | REPLACE | ellipse-figure-v1 | candidate new-engine plan; preserve old SVG |
| 14 | FIGURE | construction-spike-v1 | trapezoid, equal base angles, midpoint, diagonal |
| 15 | EXEMPT | — | vector coefficient comparison; arbitrary coordinate drawing avoided |
| 16 | FIGURE | conic HYPERBOLA/G2c | exact tangent through the given point |
| 17 | REPLACE | construction-spike-v1 + G3 vectors | candidate plan; preserve old SVG |
| 18 | FIGURE | reuse GOLDEN item43 plan | no duplicate plan; item/publish only |
| 19 | FIGURE | ellipse-figure-v1 | focus symmetry and major-axis endpoint |
| 20 | FIGURE | construction-spike-v1 + G3 vectors | Q division, circle, representative P=D case |

Plans are present for q01–q17 except q18, plus q19–q20; q03/q15 use the engine EXEMPT plan shape. q18 rendering uses the existing GOLDEN plan path above. publish.json is present for visual candidates only. Validation: JSON parsing, item binding, and static plan structure checks PASS. q01 FOCUS was checked against the current validator’s allowed-key contract and PASSes statically. Actual engine plan validation, construction expansion, renderer/observer, PNG inspection, and publish sizeClass match are all NOT_RUN. No runtime validation was available in this input-authoring workspace.
