# 2024 왕운중 2학기 중간 중2 — SVG source parity audit

- Scope: this exam's 24 questions; problem and solution axes examined separately. Source: `archive/exams/original/middle/m2/2mid/24_왕운중_2학기_중간_중2_수학.js`, `archive/assets/images/24_왕운중_2학기_중간_중2_수학/` and SVG URLs cited in the JS.
- Original figures: 23 problem SVG axes; 0 solution SVG axes. The q05 question has no source figure. A missing solution SVG is not independently a defect where the written explanation already carries the reasoning.
- Output: 3 executable replacement problem plans. All 3 pass `plan-lint.cjs --shallow` and all encoded geometry marks and reference ids have been checked against their source conditions. No manual SVG was produced.
- Execution limitation: full lint requires the external Python `visual_engine` under `.tmp/apmath-visual-engine/dependencies/python`, not installed in this worktree. Full lint reports `ModuleNotFoundError: No module named 'visual_engine'`; render/PNG/student/A4 and pixel-level drawn-feature parity **NOT_RUN**. The parity below is source-to-plan **static field parity**, not a rendered pass.

| QID | Problem SVG vs original image | Solution SVG | Audit disposition |
| --- | --- | --- | --- |
| q01 | Isosceles ticks, 40° and x retained | Text-only | RETAIN |
| q02 | Three-branch diagram, 25°,40°,x retained | Text-only | RETAIN |
| q03 | Incenter rays, 25°,35°,x retained | Text-only | RETAIN |
| q04 | Existing color-coded crossed diagonals and overprint undercut dotted source-length guides | Text-only | **PLAN_REDESIGNED** |
| q05 | No original diagram | Text-only | EXEMPT |
| q06 | Parallelogram, bisector, 56° and x retained | Text-only | RETAIN |
| q07 | Original reference triangle **plus five alternatives** (six figure panels): current SVG uses extraneous pale cards; six-plane-panel faithful reconstruction exceeds engine's `composite-panels-v1` maximum of five | Text-only | **ENGINE_CAPABILITY_PENDING**: six ordered plane panels with optional-free background, full right-angle, length and degree marks; no executable plan invented |
| q08 | Two cones and hidden curved rear base arcs retained | Text-only | RETAIN |
| q09 | Polygon vertex sequence, interior x arc retained | Text-only | RETAIN |
| q10 | Rectangle diagonals, x and 38° retained | Text-only | RETAIN |
| q11 | Rhombus diagonals and 8/12 dimension marks retained | Text-only | RETAIN |
| q12 | Three perpendiculars, marks and 3/4/8 dimensions retained | Text-only | RETAIN |
| q13 | Parallelogram two diagonals and O retained | Text-only | RETAIN |
| q14 | Extended side, midpoint ticks at BM and MC retained | Text-only | RETAIN |
| q15 | Source annulus **requires** hatching/shading of named area; retained | Text-only | RETAIN (intentional fill) |
| q16 | Right triangle lengths 6/8/10 and square retained | Text-only | RETAIN |
| q17 | A–B–C–D and P lines with 25° and x retained | Text-only | RETAIN |
| q18 | Existing extraneous purple dashed radii and missing clean O/I alignment; source has central perpendicular line to BC | Text-only | **PLAN_REDESIGNED** |
| q19 | Matching side ticks, 11°,28°,x retained | Text-only | RETAIN |
| q20 | Extension rays, given angle and equal-length ticks retained | Text-only | RETAIN |
| q21 | Existing hypotenuses AB/AC marked with **different** tick counts, contradicting source's paired double ticks | Text-only | **PLAN_REDESIGNED** |
| q22 | Interior parallel DE/BC and I crossing lines retained | Text-only | RETAIN |
| q23 | Incenter I, 130° and x arcs retained | Text-only | RETAIN |
| q24 | Right triangle, 13/5 dimensions and bisector markers retained | Text-only | RETAIN |

## DRAWN_FEATURE_PARITY: source image → executable plan fields

| Plan | 1:1 feature inventory (static) | Verification |
| --- | --- | --- |
| `q04-problem.plan.json` | ABCD/AC/BD/O; `AC=10`, `BO=7`; `OC=x`, `OD=y`; both diagonal bisector tick groups; white/transparent background and no region fill | `displaySegments` ×8, `planeMarks.dimensions` ×2, `expressionLabels` ×2, `equalLengths` ×2; shallow OK; pixel NOT_RUN |
| `q18-problem.plan.json` | AB=AC ticks; A–O–I–base-foot line; OA=OB=OC radius relation; BI/CI bisectors; `∠OAC=26°`, `∠OCI=x`; no extraneous dashed radii or area fill | `displaySegments` ×10, `hiddenPointNames:M`, `planeMarks.equalLengths` ×2, `angles` ×2; shallow OK; pixel NOT_RUN |
| `q21-problem.plan.json` | D,A,E collinear; 90° at D,A,E; AB=AC **same** one-tick group, no shading | `rightAngles` ×3, `equalLengths` ×1; shallow OK; pixel NOT_RUN |

Only this exact exam's production plan directory was changed. The q07 capability gap is intentionally documented rather than encoded as a plan that would silently omit a source choice.
