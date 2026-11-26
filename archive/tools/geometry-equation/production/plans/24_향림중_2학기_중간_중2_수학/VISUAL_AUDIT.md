# 2024 향림중 2학기 중간 중2 — SVG source parity audit

- Scope: all 24 questions, separate problem/solution axes. Source: `archive/exams/original/middle/m2/2mid/24_향림중_2학기_중간_중2_수학.js`, matching original PNG asset directory and existing SVG URLs.
- Existing axes: P=14, S=14. Source assets are limited to diagram-bearing questions. No source figure is invented for text-only axes.
- Output: 1 replacement problem plan (q22) and 12 replacement solution plans (q11–19, q22–24): 13 executable plans. All 13 pass `plan-lint.cjs --shallow` after feature and mark-geometry validation; no manual SVG.
- Full lint is **BLOCKED by the external Python `visual_engine` absence** (`ModuleNotFoundError`), not a plan-rejection claim. New render/PNG/student/A4 and pixel-level parity **NOT_RUN**. The inventory is original → executable plan **static field parity** only.

| QID | Problem axis | Solution axis | Decision |
| --- | --- | --- | --- |
| q01 | Text-only | Text-only | EXEMPT |
| q02 | Slope/intercept coordinate grid retained | Same graph with intercepts, rise/run retained | RETAIN |
| q03 | Text-only | Text-only | EXEMPT |
| q04 | Text-only | Text-only | EXEMPT |
| q05 | Text-only | Text-only | EXEMPT |
| q06 | Text-only | Two lines y=x/y=2x with area and intersection retained | RETAIN |
| q07 | Text-only | Text-only | EXEMPT |
| q08 | Text-only | Text-only | EXEMPT |
| q09 | Text-only | Text-only | EXEMPT |
| q10 | Text-only | Text-only | EXEMPT |
| q11 | Given 10/10/8 and median retained | Length text floats outside instead of linking BD=4 and perpendicular foot | **S PLAN_REDESIGNED** |
| q12 | Isosceles triangle/60°/bisector arcs retained | Written 140° and 40° disconnected from F angle; bisected 20° arcs unclear | **S PLAN_REDESIGNED** |
| q13 | Original right-angle marks retained | Similar non-congruent triangles lack leg-length demonstration and mapped angle marks | **S PLAN_REDESIGNED** |
| q14 | Given BAO15°/ACO40°/central x retained | Central-angle numbers float, disconnected from all three radius arcs | **S PLAN_REDESIGNED** |
| q15 | Circumcircle, C right angle, A45° retained | R=4 and AB=8 not bound to radial/diameter dimensions | **S PLAN_REDESIGNED** |
| q16 | Incenter I, BIC120° and apex x retained | Missing drawn equal-angle ticks on BI,CI bisectors; floating formula | **S PLAN_REDESIGNED** |
| q17 | All three feet, right markers, side lengths retained | AB/AC/BC, BE=8 and IE=4 float; target IBE area not visually isolated | **S PLAN_REDESIGNED** |
| q18 | Parallelogram with D bisector and AD4/CD6 retained | CE=6, BC=4, BE=2 labels detached from their owning segments | **S PLAN_REDESIGNED** |
| q19 | Perpendicular AE and AF, given20° retained | Angles and parallel relationships replaced by loose BA(F) text | **S PLAN_REDESIGNED** |
| q20 | Two diagonals and O retained | Text-only | RETAIN |
| q21 | Text-only | Text-only | EXEMPT |
| q22 | **Unnecessary light-blue full rectangle background fill**, target PCDQ obscured | Missing movement distance brackets / detached 3x,18−x | **P+S PLAN_REDESIGNED** |
| q23 | Three B and C angle-division groups retained | B/C trisected marks and D/E angle-result locations incomplete | **S PLAN_REDESIGNED** |
| q24 | Parallelogram diagonal/two side expressions retained | Entire BD and half OD labels floating without dimension ownership | **S PLAN_REDESIGNED** |

## DRAWN_FEATURE_PARITY: source and reasoning → native plan fields

| Plan | Exact mapped visual inventory | Status |
| --- | --- | --- |
| `q11-solution.plan.json` | AB=AC=10, BC=8, AD⊥BC, BD=DC=4 | `dimensions` ×4, `rightAngles` ×1, `equalLengths` ×2; shallow OK; pixel NOT_RUN |
| `q12-solution.plan.json` | AB=AC, bisectors BD/CE, ADB60°, four 20° halves, BFE40° | `angles` ×6, equal tick ×1; shallow OK; pixel NOT_RUN |
| `q13-solution.plan.json` | Two different-size right triangles; 90° each, matching θ, legs 6/8 versus 3/4 (AA fails congruence) | `rightAngles` ×2, `angles` ×2, `dimensions` ×4; shallow OK; pixel NOT_RUN |
| `q14-solution.plan.json` | OA=OB=OC, circumcircle, 15°/40° source, central 150°/100°/110° | `displayCircles` ×1, radius ticks ×1 group, `angles` ×5; shallow OK; pixel NOT_RUN |
| `q15-solution.plan.json` | Circumcircle R4, AB diameter8, ∠C90°, ∠A45°, AC=BC | `displayCircles` ×1, `dimensions` ×2, `rightAngles` ×1, `angles` ×1, ticks ×2; shallow OK; pixel NOT_RUN |
| `q16-solution.plan.json` | BI/CI true angle bisectors, BIC120°, A=x=60°; unprovided values left unlabeled | `angles` ×6, two distinct equal-arc groups; shallow OK; pixel NOT_RUN |
| `q17-solution.plan.json` | AB15/AC13/BC14, D/E/F perpendicular feet, radius IE4, BE8, target △IBE16 | `rightAngles` ×3, `dimensions` ×5, equal-group ticks ×3, target-only `regions` ×1; shallow OK; pixel NOT_RUN |
| `q18-solution.plan.json` | AD=BC4, CD=CE6, BE2; D angle split, B–E extension | `angles` ×2, parallel ×1, equal ticks ×2, `dimensions` ×5; shallow OK; pixel NOT_RUN |
| `q19-solution.plan.json` | AE⊥BC, AF⊥CD, AB∥CD, AD∥BC, BAE20°, EAF70° | `rightAngles` ×2, `parallels` ×2, `angles` ×2; shallow OK; pixel NOT_RUN |
| `q22-problem.plan.json` | Transparent rectangular base, 18×8, moving arrows B→P/D→Q, PCDQ target area only | `dimensions` ×2, `arrow` ×2, target-only `regions` ×1; shallow OK; pixel NOT_RUN |
| `q22-solution.plan.json` | BP=x, DQ=3x, PC=18−x, 18×8, trapezoid PCDQ | `dimensions` ×5, target-only `regions` ×1; shallow OK; pixel NOT_RUN |
| `q23-solution.plan.json` | A right angle, AB=AC, B 15° ×3, C exterior 45° ×3, BDC60°, BEC30° | `rightAngles` ×1, equal ticks ×1, `angles` ×8; shallow OK; pixel NOT_RUN |
| `q24-solution.plan.json` | AD=3x−4 and BC=x+2, BD=4y+3 and OD=y/2+3, two diagonals bisected at O | `dimensions` ×4, `equalLengths` ×2, `parallels` ×1; shallow OK; pixel NOT_RUN |

All other visual axes were compared to the original assets and retained. No other exams, school lines, or grade directories were changed.
