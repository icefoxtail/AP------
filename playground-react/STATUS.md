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
