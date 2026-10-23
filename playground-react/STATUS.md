# AP Math Playground · migration status

## Scope
Standalone React app at `playground-react/`, on `feat/playground-react-migration`. The production website and Archive files remain outside this change.

## Milestones

| Area | Count | Status | Evidence |
|---|---:|---|---|
| Foundation | React + TypeScript + SVG + GSAP + KaTeX | Complete | `npm install`, typecheck and build PASS |
| Basic concepts | 5 interactive labs | Complete | Exact π formula assertions; radius/angle and SVG/KaTeX sync |
| Practice principles | 14 labs | Complete | 13 STEP3 principles plus common-area cancellation discovered in original Advanced |
| Substructures | 38 | Complete | 33 practice variants + 5 semicircle-combination variants |
| Middle-school geometry | 7 interactive lesson families | Complete | Point/ray/segment, midpoint/ratio, angles/counts, constructions/folding, parallel lines, congruence, 3D spatial relations |
| Geometry runtime | 2D/3D core + SVG + pointer/keyboard + GSAP + KaTeX | Complete | `src/geometry-*`, `src/geometry-lessons/`, `npm run test:geometry` PASS |
| Legacy geometry preservation | 6 original tabs | Complete | Full original 2D/3D `points-lines.html` and its local relation assets remain linked as a compatibility lab |
| Mathematical checks | 370 semicircle + 66 practice input/variant combinations, plus fixed source cases | Complete | `npm run test:math` PASS |
| Browser QA | PC + mobile | Complete | Full 14-lab / 33-variant desktop sweep; 390px mobile checks; 0 console errors or warnings |
| Per-type commit cadence | 14 practice models | Partial | The practice suite is committed as one shared-engine milestone (`f9e2e0b40`), not as one implementation commit per type |
| Publication | branch push + PR | Complete | PR #761 open against `main`; intentionally not merged |

## Per-type progress

| Module | Variants | Status |
|---|---:|---|
| Basic circle and sector concepts | 5 | Complete |
| Semicircle combinations | 5 | Complete |
| Arc length / angle inference | 4 | Complete |
| Sector formulas / ratio | 3 | Complete |
| Boundary / stadium track | 3 | Complete |
| Square, arcs and inscribed figures | 4 | Complete |
| Rotational area | 1 | Complete |
| Point rotation distance | 2 | Complete |
| Rope around circles | 3 | Complete |
| Rolling circle | 1 | Complete |
| Overlap, annulus and lunes | 4 | Complete |
| Polygon sectors | 2 | Complete |
| Tether / wall access | 2 | Complete |
| Pizza comparison | 2 | Complete |
| Equal-area transformation | 2 | Complete |

## 중1 기본 도형·작도·합동·평행선 확장

- Base: `feat/playground-react-migration`; the existing React app's circle/sector labs remain connected. The requested middle-school geometry source was not present in this branch, so the original student lab and its relationship-engine assets were read from the connected Drive folder and ported into the existing React app.
- React lesson families: 7 selectable boards covering point/line/ray/segment overlap, shortest distance/midpoint/trisection/ratio, vertical angles/line counts/clock angles, compass constructions/perpendicular bisectors/angle bisectors/perpendicular distance/paper-fold reflection, parallel-line counterexamples, SSS/SAS/ASA/RHS comparison, and spatial relations/counterexamples.
- 3D scenes: cuboid, triangular prism, trapezoidal prism, hexagonal prism, and square pyramid; line-plane incidence and distinct/intersecting/perpendicular plane states; counterexamples for perpendicular-to-one-line and parallel-to-one-plane relations.
- Source fallback: the original 6-mode `points-lines.html` is preserved at `public/labs/g7/points-lines.html` with `geometry-relations.js`, `geometry-relations.css`, and `student-guide.js` under `public/assets/`. Its original teacher/quiz/guided controls remain available from the React geometry header's “원본 전체 실험” link. A small inline favicon suppresses the original page's missing-favicon request; its Tailwind CDN warning remains.
- Architecture: `geometry-core` contains pure 2D/3D math and classifications; `geometry-renderer` owns SVG primitives and verified angle/equality/parallel marks plus KaTeX; `geometry-interaction` handles pointer/keyboard movement, screen-coordinate conversion, snap targets, and undo; `geometry-animation` drives construction strokes with GSAP; `geometry-lessons` contains topic modules; `labs/geometry` integrates them into the card UI.
- Markers are derived from computed geometry: right-angle marks require a zero dot product within numeric tolerance; equal-length and parallel marks render only when their measured vectors satisfy the relation. Triangle display distinguishes selected conditions from full coordinate-based congruence results.

### Verification for this increment

- `npm run check` PASS.
- `npm run test:geometry` PASS: line/segment/ray intersections, vertical angles, degenerate cases, triangle classification, 3D skew/parallel/intersecting lines, and line-plane cases.
- `npm run test:math` PASS for the existing circle/sector suite: 370 semicircle parameter sets and 66 practice combinations.
- `npm run build` PASS.
- Browser: direct point drag changed the angle and formula together; dragging a point onto an existing point snapped exactly to it and undo restored the prior length. Triangle scale change flipped the live result from congruent to noncongruent. 3D prism and counterexample boards rendered without console errors. 390px and 768px viewports had no horizontal document overflow; 110% board zoom remained within the 390px viewport. The legacy static fallback loaded its 6 modes; it has one upstream Tailwind CDN advisory and no runtime errors after the favicon link.

## Source coverage

- STEP3's 13 original principles and 23 explicit `makeCase` geometries are connected.
- Five basic labs are integrated in the React card UI.
- Original Advanced additions: 1:2:3 sectors; stadium track; rectangle inside a quadrant; inscribed-square complement; three-circle snowman; baby-circle radius relation; Hippocrates lunes; isosceles, parallel-chord and external-secant angle inference; one-row rope; and common-area addition.
- Like-number parameter variants stay within their existing module; distinct geometry or proof structures have their own selectable variants. All 14 practice cards use per-type model modules under `src/labs/<id>/`.
- No raw exam gallery, production site files or Archive data were copied into the app.

## Interaction quality

- Browser comparison against the AI Studio prototype confirmed its baseline strengths: persistent type/shape selection, three observation modes, and parameter sliders that immediately recalculate the perimeter/area proof. The original basic HTML additionally had a draggable yellow angle point; React now preserves that direct manipulation with 5° snapping, pointer capture, slider/formula/SVG synchronization, and arrow-key access.
- Live browser comparison at radius 6 cm and angle 60° produced the same arc result (`2π cm`) in the source HTML and React. Dragging the source point changed 90°→60° and updated its calculation; dragging the React handle changed 120°→30°, then keyboard stepping reached 60° and KaTeX recalculated to `2π cm`.
- Semicircle/taiji boundary mode reveals the actual SVG boundary and maps each curved component to proportional length bars. The explanatory copy distinguishes length rearrangement from rigidly overlapping differently curved arcs.
- Semicircle area mode moves duplicate, same-size SVG pieces while the original coloring remains visible. The taiji's equal-size convex semicircle rotates 180° into the cutout; a Playwright geometry check confirmed its SVG path length is unchanged. The progress slider controls the GSAP timeline directly.
- Basic circle area mode cuts the circle into 12 equal-angle wedges and translates/rotates them without scaling into alternating rows. Basic circumference mode synchronizes the traced circular length and straight length bar.
- Sector-angle labs retain the original yellow endpoint direct manipulation. Dragging snaps to the same 5° increments as the source interaction; keyboard arrow keys change the angle by 5° while keeping the boundary, ratio, and formula in sync.
- Practice area modes keep the original SVG visible and move separate calculation copies. Line mode traces actual SVG boundaries and shows component length comparisons where meaningful.
- KaTeX formulas and results use the same live slider parameters as each diagram.

## Current verified results

- `npm run check` PASS.
- `npm run test:math` PASS: 370 semicircle combinations, 66 practice variant/input combinations and exact representative source cases.
- `npm run build` PASS. KaTeX is split into its own chunk; no chunk-size warning.
- Browser: 1440×900 desktop interaction sweep passed for all five basic cards, five semicircle structures and all 33 practice variants. KaTeX, real SVG boundaries and area-piece scrubbers were present. 390px mobile checks passed without horizontal page overflow. Browser console errors/warnings: 0.
- Geometry browser verification: 7 lesson families rendered at 1440×900 and 390×844 with document width equal to viewport and no KaTeX errors. Tablet width 768px likewise had no horizontal overflow. Direct pointer drag changed angle and live formula, snapping merged a point exactly with an existing point, and Undo restored its previous position. The triangle scale control changed the live result from congruent to noncongruent. 3D prisms and the spatial counterexample mode rendered without app console errors. Zoom to 110% remained inside the 390px viewport.
- Implementation milestone commits: `0b8ef702d` (foundation), `7d8ea2ec8` (basic labs), `f9e2e0b40` (source-derived geometry suite and visual proof upgrades).

## Remaining

- Functional implementation and requested verification are complete. PR #761 is open; merge and deployment are intentionally outside the requested scope.
- The requested one-type-per-implementation-commit cadence was not met for the 14 practice principles: they use one shared engine suite commit, with individual model modules and per-type verification retained.
- A one-time continuation alarm could not be scheduled: Codex reported it could not verify this chat for scheduled updates. The active goal and this status file remain available for continuation.

## Pinpoint repair review — 2026-10-24

- Direct code review identified wrong practical-sector perimeter (missing π), mismatched arc and straight-boundary SVGs, fixed lens radii, incorrect square/triangle rotation pivots, and a schematic rolling trace.
- Repaired exact symbolic perimeter/area values for sector, annular sector, and rotational band. Constrained lens lessons to two quarter-circle arcs with an elementary area formula.
- Rebuilt the square semicircle cutout, square-corner quarter-arcs, annular edge endpoints, rotation trajectories, outward rolling sweep, overlap circle dimensions and tether accessible-sector orientation.
- Restricted tether controls to the non-overlapping range and aligned basic sector reference radius with its arc.
- Added focused mathematical regression assertions and an isolated Playground QA workflow. This QA run must PASS before the new head can be approved; previous PASS claims apply to the earlier commit only.
- **Still requiring visual acceptance:** the shared practice-area piece tray is a scale-free calculation-symbol illustration, not yet a general proof by exact rigid cut-and-paste. Its UI now labels this limitation. Full real-browser animation comparison against the AI Studio minimum quality floor has not been independently repeated in this repair review.
- PR #761 remains unmerged; changes are confined to the Playground and its dedicated QA workflow.

## Geometry source and compatibility notes

- The current React branch initially contained only the circle/sector lab; the middle-school geometry source had been kept in the user's Drive. The source `points-lines.html` was inspected before porting its six main interaction modes: 2D line/ray/segment and intersections; shortest path/midpoint/trisection/ratio; collinear/circle point counts, vertical angles and clock angles; perpendicular distance/bisectors/paper fold; skew-line filters over five solids; and line-plane/two-plane/counterexample scenes.
- The React port organizes those core scenes into seven topic cards. Geometry computations live in pure `geometry-core`; render marks are conditional on measured relations; pointer coordinates use the SVG inverse screen matrix; snap thresholds are measured in CSS pixels; GSAP draws construction paths; KaTeX presents the synchronized result.
- To retain the full older teacher panel, step controls, hypothesis quiz and detailed subscenarios while the React migration continues, the original working HTML and its three helper assets remain under `public/labs/g7/` and `public/assets/`. The compatibility page still uses its original Tailwind CDN and logs one upstream production advisory; no runtime errors remain. The React lab is the default student path.
- The broader Drive triangle atlas was not imported as an entire 62-scene library; this task adds the requested congruence conditions (SSS/SAS/ASA/RHS) with transformation and counterexample controls.
