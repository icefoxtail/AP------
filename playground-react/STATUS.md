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
| Publication | branch push + PR | Pending | main will not be merged |

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

- Semicircle/taiji boundary mode reveals the actual SVG boundary and maps each curved component to proportional length bars. The explanatory copy distinguishes length rearrangement from rigidly overlapping differently curved arcs.
- Semicircle area mode moves duplicate, same-size SVG pieces while the original coloring remains visible. The taiji's equal-size convex semicircle rotates 180° into the cutout; a Playwright geometry check confirmed its SVG path length is unchanged. The progress slider controls the GSAP timeline directly.
- Basic circle area mode cuts the circle into 12 equal-angle wedges and translates/rotates them without scaling into alternating rows. Basic circumference mode synchronizes the traced circular length and straight length bar.
- Practice area modes keep the original SVG visible and move separate calculation copies. Line mode traces actual SVG boundaries and shows component length comparisons where meaningful.
- KaTeX formulas and results use the same live slider parameters as each diagram.

## Current verified results

- `npm run check` PASS.
- `npm run test:math` PASS: 370 semicircle combinations, 66 practice variant/input combinations and exact representative source cases.
- `npm run build` PASS. KaTeX is split into its own chunk; no chunk-size warning.
- Browser: 1440×900 desktop interaction sweep passed for all five basic cards, five semicircle structures and all 33 practice variants. KaTeX, real SVG boundaries and area-piece scrubbers were present. 390px mobile checks passed without horizontal page overflow. Browser console errors/warnings: 0.
- Current commits: `0b8ef702d` (foundation), `7d8ea2ec8` (basic labs). The expanded source-derived geometry suite is ready to commit.

## Remaining

- Commit the verified expanded suite, push the feature branch, create a PR and attach it to this task.
- A one-time continuation alarm could not be scheduled: Codex reported it could not verify this chat for scheduled updates. The active goal and this status file remain available for continuation.
