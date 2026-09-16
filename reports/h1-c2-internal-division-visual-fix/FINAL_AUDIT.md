# H1 Common Mathematics 2 Internal Division / Point Position Visual Fix

## Scope and Git

- Base: origin/main @ 4da95df8bf042729df58d63577fa62021ebe6d24
- Branch: codex/h1-c2-internal-division-visual-fix-20260910
- Worktree: C:\Users\work1\Documents\ChatGPT\AP_h1_c2_internal_division_visual_fix_20260910
- Commit SHA: recorded in the final handoff after commit
- Main merge: not performed
- Existing codex/written-solution-pilot-h1-hyocheon-2mid-20260910 worktree: untouched

## Rule preflight

node tools/skills/verify-skills.mjs: PASS.

| Rule / runtime | Version | Bytes | SHA-256 |
|---|---:|---:|---|
| docs/rules/01_CANONICAL/JS아카이브룰북_v2.6.md | v2.6 | 93734 | 15bac5c693b4bac5a5d1794ec07f641b188bb125d4321c08e0524ebbce5b0514 |
| docs/rules/02_PIPELINES/COMMON_PROTOCOL_v1.2.10.md | v1.2.10 | 200952 | 69982524a063f5c49d252473eaf74eedd4d9a078e64fcc85a6144d838d056dac |
| docs/rules/02_PIPELINES/공통파이프라인_실행계약_v1.md | v1 | 7347 | 971625ca5fd8228d01969521d8c2c4933b57e5088d6548d747101deeea6523c2 |
| docs/rules/02_PIPELINES/작업방식_적응형배치루프_v1.md | v1 | 9468 | ce4166be64d437a98eebcacbb728e6625dd4ba6472fa0d6d20295767265c71685 |
| docs/rules/04_VISUAL/도형추출.md | v3.0 | 54520 | 292c193bdfe4544fe5cf2ebca779aaa0894374d452da9dd35b91fb8f85182fb6 |
| docs/rules/04_VISUAL/도형의방정식_해설_SVG_독립검수_운영규정_v1.1.md | v1.1 | 91353 | b0c8b214d1052750d0ff60e3c83c179b02b3a4fe3f24ed72763f41292e0368c4 |
| archive/tools/pipeline-core/AGENT_BUDGET.md | v2 | 14593 | d42346f0cd7ad6a395b6df2d15c386539ac9a69394329c5d9de6bf333a889b02 |
| archive/tools/pipeline-core/README.md | v2 | 17199 | 12779744b93601310c1ee4b89c4767e904a958047eca6b28e746da6e3102c180 |

Applicable UNIT_OVERLAY: none identified for H22-C2-01. Common rules and coordinate/geometry visual rules were used.

## Denominator and inventory

The denominator is 11 production exams:

- 2nd semester midterm: 6 (금당고, 매산고, 순천고, 순천여고, 제일고, 효천고)
- 2nd semester final: 5 (금당고, 순천고, 제일고, 팔마고, 효천고)
- H22-C2-01 count in the five finals: 0

Core repair inventory: 10 questions.

| Exam | Q | Decision | Solution JS | SVG |
|---|---:|---|---|---|
| 금당고 2중간 | 1 | ADD_NEW_VISUAL | image linkage added | ADD |
| 금당고 2중간 | 9 | ADD_NEW_VISUAL | image linkage added | ADD |
| 매산고 2중간 | 9 | REBUILD_EXISTING | unchanged | REBUILD |
| 순천여고 2중간 | 8 | REBUILD_EXISTING | unchanged | REBUILD |
| 순천여고 2중간 | 9 | ADD_NEW_VISUAL | coordinate-wise solution rewrite and image linkage | ADD |
| 제일고 2중간 | 15 | REBUILD_EXISTING | caption corrected | HARD REBUILD |
| 제일고 2중간 | 18 | KEEP_EXISTING | D/E and DE:y=12 logic added | KEEP+UPGRADE |
| 제일고 2중간 | 20 | ADD_NEW_VISUAL | image linkage added | ADD |
| 효천고 2중간 | 14 | KEEP_EXISTING | point arithmetic removed | KEEP+UPGRADE |
| 효천고 2중간 | 21 | REBUILD_EXISTING | category, tags, and two-case solution rewritten | REBUILD |

content, choices, and answer parity against origin/main: PASS for all 10 questions.
Original problem images were not modified.

## Adjacent point arithmetic inventory

Recorded only; intentionally outside the repair inventory:

| Exam | Q | Finding |
|---|---:|---|
| 금당고 2중간 | 10 | coordinate addition in the square construction |
| 순천고 2중간 | 3 | A+C=B+D, C=B+D-A |
| 순천고 2중간 | 18 | G=(A+2M)/3, A=3G-2M |
| 제일고 2중간 | 11 | A+B+C=(0,0) |

These were not changed because they are adjacent findings rather than the requested internal-division / point-position repair scope.

## Mathematical and visual corrections

- 금당고 q1: A(-2,5)-P(2,7)-B(4,8), AP:PB=2:1, P inside AB.
- 금당고 q9: triangle OAB, angle bisector AC, AO:AB=4:5, OC:CB=4:5, C(0,4/3), G(4/3,1).
- 매산고 q9: A(-2,3), B(6,-1), P(0,2), y=2x+2, AB perpendicular to l, AP:PB=1:3.
- 순천여고 q8: C is below AB as in the source image; u=2, v²=12, P(6,0), CP²=28.
- 순천여고 q9: A-G-M order, AG:GM=2:1; x and y coordinates are solved separately.
- 제일고 q15: only the actual ABC/DE geometry remains; DE parallel to BC, area ratio 1:9, similarity ratio 1:3, and DE:y=-x+4.
- 제일고 q18: D(0,12), E(16,12), OD:DC=3:1, AE:EB=3:1, DE:y=12 added before the folding calculation.
- 제일고 q20: A(1,3)-P(7/3,5)-B(3,6), AP:PB=2:1, AB=√13.
- 효천고 q14: B-D-C order and BD:DC=2:3; coordinate-by-coordinate D calculation.
- 효천고 q21: no 외분/외분점, parameter t, or point arithmetic. Two cases are shown as A-C₁-B and C₂-A-B, ending at C₁(-4,0) and C₂(-28,-36).

## Static validation

- All 10 target SVGs: XML parse PASS.
- All 10 target SVGs: viewBox and preserveAspectRatio present.
- All 10 target SVGs: no script, foreignObject, br, or LaTeX source.
- SVG semantic parity checks for all required coordinates, point orders, ratios, lines, and case labels: PASS.
- Target production search for 외분 and 외분점: 0.
- Target production search for C=A+t, D=(3B+2C)/5, and the previous q21 t cases: 0.
- Protected-field parity: PASS.
- node --check: PASS for all 4 changed JS files.
- git diff --check: PASS.
- npm --prefix archive/tools/pipeline-core test: NOT RUN because npm is unavailable in the current shell; Node syntax and repository-local checks passed.

## Browser render evidence

Actual archive engine.html solution mode was served from this worktree at http://127.0.0.1:8777 and rendered in the browser.

| Exam | Source Q | Desktop pages / q-boxes / images | Mobile pages / q-boxes / images | Image errors | Overflow |
|---|---:|---:|---:|---:|---:|
| 금당고 2중간 | 22 | 11 / 22 / 21 | 11 / 22 / 21 | 0 | 0 |
| 매산고 2중간 | 20 | 10 / 21 / 12 | 10 / 21 / 12 | 0 | 0 |
| 순천여고 2중간 | 21 | 8 / 21 / 14 | 8 / 21 / 14 | 0 | 0 |
| 제일고 2중간 | 22 | 8 / 22 / 10 | 8 / 22 / 10 | 0 | 0 |
| 효천고 2중간 | 23 | 11 / 24 / 18 | 11 / 24 / 18 | 0 | 0 |

All five changed exams reached DATA_READY → MATH_READY → IMAGE_READY → LAYOUT_READY → RENDER_READY; unrenderedMath=0. Mobile checks used a 390px viewport with 375px client width and scrollWidth=375.

Changed-question screenshots were inspected for q1/q9, q9, q8/q9, q15/q18/q20, and q14/q21. Labels, point order, ratios, actual solution geometry, and two-case flow were visible without clipping.

## Final status

- Requested modification scope: PASS.
- User-defined final audit gates: PASS.
- Strict pipeline-core provider-attested FINAL_AUDIT / V1→V2→V3 evidence: NOT SEALED; no provider runtime was exposed in this workspace. Under the current rule-pack this is recorded as MISSING_CURRENT_PIPELINE_EVIDENCE, so this report does not claim a formal pipeline seal.
- Final handoff: push feature branch only; main remains unmerged; ChatGPT full re-review remains pending.
