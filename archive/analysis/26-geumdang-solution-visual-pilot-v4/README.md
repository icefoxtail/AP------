# 26 금당고 고1 2학기 중간 — Solution Visual Pilot v4

**상태:** `PRINT95_VISUAL_READY`  
**대상:** 20문항 전체  
**브랜치:** `codex/pilot-26-geumdang-h1-skill-v4`  
**분기 기준:** latest main `cd74c75fb14abf3fd9d9c1cea026a20681576c9e`  
**latest-main 대상 JS blob:** `1cfd7d974ec987ba3fb06627b757fc71595cbf58`  
**작업 경계:** 이 pilot branch에만 변경·commit·push. production/main에는 반영하지 않음.

## 진입점과 사전 보정

요청대로 `.codex/skills/apmath-visual-upgrade/SKILL.md` 하나만 진입점으로 사용했다. 해당 스킬이 연결하는 문서만 읽었다.

- Visual router: `.codex/skills/apmath-visual-upgrade/SKILL.md` — main blob `a49d8a9d602eb7b6f10d922e6254c918fb9a8bb9`
- Artifact-first route: `docs/rules/02_PIPELINES/Archive_GPT_Artifact_First_Lightweight_v1.md` — `b6dd7c796af39d36352fdbcc997633908d188e2f`
- Golden calibration: `docs/rules/02_PIPELINES/Archive_작업전_Golden_Sample_Calibration_v1.md` — `693c7ed76dbd643dedd204bbcec9f707bbc2e2f2`
- Visual canonical: `docs/rules/04_VISUAL/도형추출.md` — `08cfc834e3dae9838000880baaf983a685dece51`
- Visual negative calibration: `archive/fixtures/visual-negative-regressions/2026-09-29/README.md` — `f7440339f2532f6e7ea357541c2a09b05847af59`; frozen `MISSING_OWNER_RAY` SVG — `b8a488b8dd9373b7d0866450bcba6c79391ba9e4`

Golden examples were read for quality calibration only. They did not supply target answers, target geometry, coordinates, or reusable layouts.

| Calibration example | Read question / actual solution image | Source exam blob | SVG blob |
|---|---|---|---|
| `25_효천고_2학기_중간_고1_기출` | q6 parameter-circle cases; q11 moving center and tangency bounds | `eb8776d19989f8f4219f4b80db0daf72310109cd` | q6 `336e1dd46d86e350eff2db1001122202d2aa3551`; q11 `0659d358be9d5e023840e934aa688ab59c55f2b4` |
| `25_순천여고_2학기_중간_고1_기출` | q17 common chord and coordinate geometry | `d527a003528a14b82d8b1cebc4094d1b72d324c3` | q17 `6f714713d7e474a445cfbd6acc44fb6bfa6deae7` |

Known Negative Sample check retained the requirement that geometry and labels must be true in the actual SVG. No existing 2차/3차 pilot branch or target Geumdang SVG was used as a new-artwork template.

## Fresh triage — all 20 questions

`PROBLEM_VISUAL` is exempt for all 20: the source-page scans are provenance, and no separate problem figure is needed for the student-facing statements. The work adds only `SOLUTION_VISUAL` assets. Original question text, choices, answers, solution text, and source-page references remain unchanged.

| Q | Triage | Student-understanding reason | Best backend | Result |
|---:|---|---|---|---|
| 1 | `VISUAL_EXEMPT` | Completing the square gives the five integer values directly; a number line adds little. | — | `EXEMPT`; image link removed |
| 2 | `VISUAL_EXEMPT` | Each choice is a direct set-cardinality check, with no spatial relationship to show. | — | `EXEMPT` |
| 3 | `VISUAL_OPTIONAL` | The radius–tangent perpendicular relationship is a useful anchor for the substitution. | `STANDARD_SVG` | `REBUILD` |
| 4 | `VISUAL_EXEMPT` | The translation is one coordinate update; an arrow does not materially reduce the reasoning. | — | `EXEMPT`; image link removed |
| 5 | `VISUAL_OPTIONAL` | Seeing the center coordinates swap while the radius stays fixed helps retain the reflection rule. | `MINIMAL_EXAM_DIAGRAM` | `REBUILD` |
| 6 | `VISUAL_EXEMPT` | The centroid task is two coordinate averages and does not depend on locating a point in a figure. | — | `EXEMPT`; image link removed |
| 7 | `VISUAL_EXEMPT` | The perpendicular-slope rule and one substitution complete the calculation. | — | `EXEMPT`; image link removed |
| 8 | `VISUAL_EXEMPT` | Equality of the finite sets reduces to element matching and cases. | — | `EXEMPT` |
| 9 | `VISUAL_OPTIONAL` | A proportional segment makes the internal division ratio 4:5 reproducible. | `NUMBER_LINE / INTERVAL_DIAGRAM` | `REBUILD` |
| 10 | `VISUAL_REQUIRED` | The coefficient pair’s common zero is the invariant point; a perpendicular foot shows the requested distance. | `MINIMAL_EXAM_DIAGRAM` | `REBUILD` |
| 11 | `VISUAL_OPTIONAL` | Separate parallel and perpendicular cases prevent mixing the two slope conditions. | `COMPOSITE_PANEL` | `REBUILD` |
| 12 | `VISUAL_REQUIRED` | The first circle’s area-bisecting line passes through its center; the second circle’s 3–4–5 relation determines its radius. | `COMPOSITE_PANEL` | `REBUILD` |
| 13 | `VISUAL_OPTIONAL` | Both external tangents and their owner radii clarify why each radius is normal to its tangent. | `STANDARD_SVG` | `REBUILD` |
| 14 | `VISUAL_REQUIRED` | Reflecting A turns the broken path into a straight minimum-distance path to the circle. | `COMPOSITE_PANEL` | `REBUILD` |
| 15 | `VISUAL_REQUIRED` | The farthest point from chord AB determines the maximum-area vertex and its tangent. | `COMPOSITE_PANEL` | `REBUILD` |
| 16 | `VISUAL_OPTIONAL` | The residue-class restriction and eight selected values are easier to audit as a grouped board. | `COMPOSITE_PANEL` | `ADD` |
| 17 | `VISUAL_REQUIRED` | The area ratio fixes `s+t`; the minimum segment fixes `s=t`; the quadrilateral shows both facts together. | `COMPOSITE_PANEL` | `REBUILD` |
| 18 | `VISUAL_OPTIONAL` | A center-movement sequence keeps translation, reflection, and positive-intercept choice distinct. | `COMPOSITE_PANEL` | `REBUILD` |
| 19 | `VISUAL_EXEMPT` | The seven-element subset cases can be summed directly; a diagram would repeat enumeration. | — | `EXEMPT` |
| 20 | `VISUAL_REQUIRED` | The open intervals and tangent endpoints decide which length-2 interval can be farthest right. | `NUMBER_LINE / INTERVAL_DIAGRAM` | `REBUILD` |

Counts: `VISUAL_REQUIRED 6`, `VISUAL_OPTIONAL 7`, `VISUAL_EXEMPT 7`. The seven exempt questions are q1, q2, q4, q6, q7, q8, and q19.

Disposition counts: `KEEP 0`, `REBUILD 12`, `EXEMPT 7`, plus q16 `ADD` (new). The prior solution-image links on q1, q4, q6, and q7 were removed after fresh review; their now-unreferenced files were left in place. q2, q8, and q19 had no solution-image link.

## Rebuilt solution visuals and frozen math facts

Python facts were computed before drawing. `build_mobile_visuals.py` freezes the arithmetic and creates the assets; `verify_visuals.py` parses the resulting SVG primitives and reverses their transforms to compare observed geometry with the expected facts.

| Q | Frozen expected facts / actual SVG parity |
|---:|---|
| 3 | `T=(-2,3)` lies on `x²+y²=13`; tangent is `−2x+3y=13`; its intersection with `y=5` is `(1,5)`. The displayed radius and tangent vectors have zero dot product. |
| 5 | Center `(3,−2)` maps to `(−2,3)`; radius remains `4`; `a−b+c=−1`. |
| 9 | `AP:PB=4:5`; the actual SVG divider is four ninths of the segment; `P=(5,−4)` and `p+q=1`. |
| 10 | `P=(2,4)` satisfies `3x−y−2=0` and `x+y−6=0`; foot `H=(−1,0)` lies on `3x+4y+3=0`; `PH=5`. The SVG target line is perpendicular to `PH`. |
| 11 | Parallel case: `k=a=2/3`, both slopes `1/3`; perpendicular case with `b>0`: `k=b=2`, slopes `−1` and `1`; `ab=4/3`. |
| 12 | `a=5`; `C₂=(2,−1)`; line distance `3`, half-chord `4`, radius `5`; `C₂: x²+y²−4x+2y−20=0`; sum `−17`. Actual rendered circle radius, chord endpoints, foot distance, and perpendicularity are checked from SVG coordinates. |
| 13 | `C=(3,2)`, `r=2`, `P=(−1,1)`; the two tangent points are computed from exact circle geometry, and each actual displayed radius is perpendicular to its tangent. `m₁m₂=−1/4`. |
| 14 | `A′=(−3,−2)`, `C=(5,4)`, `r=2`, `Q=(17/5,14/5)`, `P=(1,1)`; `A′C=10`, minimum `A′Q=8`, and `10S=21`. The actual SVG center/radius and plotted points match these coordinates. |
| 15 | `C=(2,3)`, `r=√10`, `AB: x+y=1`; maximizing point `P=(2+√5,3+√5)`; tangent `x+y−5−2√5=0`; `a+b+c=−6`. The actual SVG point lies on its displayed circle and the tangent direction is normal to CP. |
| 16 | `2ⁿ−n−1=247` gives `n=8`; since `15≡3 (mod 4)`, all members must be `3 (mod 4)`; selected set `{15,75,79,83,87,91,95,99}` sums to `624`. |
| 17 | `s+t=4/3`; `PQ²=5+5(s−t)²`, so `s=t=2/3`; `P=(2/3,2/3)`, `Q=(8/3,5/3)`; region areas are `10/3` and `5/3`; `30(m+n)=25`. Actual SVG polygon areas and ratio are recalculated from its coordinates. |
| 18 | Center moves `(-2,1)→(1,3)→(3,1)`; candidate lines are `x−2y+4=0` and `x−2y−6=0`; positive y-intercept selects `2`. |
| 20 | `k=10`; `g(t)=2` on `(3,8)∪(8,12)` with tangencies at `3,8,12`; the rightmost length-2 open interval is `(10,12)`, so `a=12`. The visual is a number line, not a compressed function graph. |

## Visual finish checks

- `PROBLEM_VISUAL`: none added. `SOLUTION_VISUAL`: 13 assets total — 12 rebuilt and q16 newly added.
- Backend use: `STANDARD_SVG` q3/q13; `MINIMAL_EXAM_DIAGRAM` q5/q10; `NUMBER_LINE / INTERVAL_DIAGRAM` q9/q20; `COMPOSITE_PANEL` q11/q12/q14/q15/q16/q17/q18. No `FUNCTION_GRAPH`, TikZ, PGFPlots, or raster fallback was needed.
- Typography and language: Korean labels, no unnecessary English, consistent line hierarchy, color distinguishes semantic roles, no q15 miniature point text, and q20 uses intervals to avoid a distorted graph.
- Static: 13/13 generated SVGs parse; Python semantic assertions pass; actual SVG coordinate parity passes for q3/q9/q10/q11/q12/q13/q14/q15/q17; q5/q16/q18/q20 displayed semantics pass; JS loads with 20 questions and all active solution-image links resolve. Source problem, choices, answer, solution prose, and source-page references match latest main for all 20 qids.
- Browser: real Chrome render of all 13 referenced solution SVGs at a 340 CSS-pixel image width using the local preview page `preview-mobile.html`; all 13 image elements are present and their rendered labels, geometry, panel balance, and clipping were visually checked. This is browser evidence for these SVGs, not evidence from a physical handset or a printer.
- Result: `PRINT95_VISUAL_READY`.

`build_mobile_visuals.py` and `verify_visuals.py` are the reproducible mathematical/static artifacts. The local browser preview is diagnostic; it is not a generated or simulated substitute for browser rendering.

## Final branch record

Base main at rebase: `cd74c75fb14abf3fd9d9c1cea026a20681576c9e`.

Pilot content commit: `60caff04599e5ec72fad788fe601c38342bedeeb`. The final branch HEAD also contains this pilot report’s closeout update.


## Final finish hardening — 2026-10-03

- General Korean copy keeps the digital-first Korean text stack. Mathematical emphasis classes `.l` and `.e` now use `STIX Two Math / Cambria Math / Times New Roman` first with Korean fallback. The same token is stored in `build_mobile_visuals.py`, so regeneration preserves the typography split.
- `capture_browser_evidence.mjs` is the reproducible raw browser-evidence path. It renders all 13 active solution SVGs at **340 CSS px**, waits for `document.fonts.ready`, and records actual `getBBox()` / `getBoundingClientRect()`, resolved font family/size, label overlaps, and clipping into `browser-evidence.json`.
- The pilot's original real-Chrome 340px visual review remains the human visual check. Future reruns must prefer the raw DOM evidence script rather than authored PASS counts.
