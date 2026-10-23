# AP Math Playground React migration status

## Scope
Standalone React + TypeScript + SVG + GSAP + KaTeX playground under `playground-react/`. The production site and all Archive content remain outside the change.

## Milestones
| Area | Types | Variants | Status | Verification |
|---|---:|---:|---|---|
| React pilot foundation | 1 | 4 | Complete | install, typecheck, 370-case pilot math suite, Vite build PASS |
| Basic circle / sector concepts | 5 | 5 | Complete | exact π formulas; radius/angle sliders and SVG/KaTeX values stay synchronized; typecheck/build PASS |
| STEP3 practice catalog | 13+ | 23 explicit cases + 4 pilot semicircle forms | In progress | source inventory completed; implementation pending |
| PC/mobile integration QA | all | all | Pending | pending |

## Source inventory
- `pilot/` React starter copied from the overnight handoff.
- STEP3 has 13 practice principles and 23 explicit `makeCase` examples. The pilot already contains four semicircle forms; STEP3's lopsided semicircle case is an additional fifth candidate.
- The Drive manifest lists 11 main lab pages and a basic supplemental page. The relevant source pages and common relation assets were staged outside this repository for reference; no raw exam gallery is being imported.

## Verified behavior
- Semicircle pilot exact-π arithmetic: four base forms and 370 parameter combinations pass the supplied mathematical assertions.
- Five basic labs now run inside the React card flow: circle circumference, circle area, sector arc, sector perimeter and sector area.
- Basic radius/angle sliders feed the SVG and exact symbolic KaTeX formula. GSAP highlights real boundary SVG paths and sequences area views; physical area-piece rearrangement remains unfinished.
- Practice cards remain connected to the prior placeholder until their modules are implemented.

## Unfinished
- Add independent interactive modules for all STEP3 cases and connect every practice card.
- Add actual arc-length correspondence/unfolding and area-piece movement, starting with semicircle/태극.
- Extend mathematical checks to every implemented type and source variant.
- Verify responsive PC/mobile behavior in a real browser.

## Commits
- `0b8ef702d` foundation: isolated React pilot, dependency lock, pilot math fix.
- Current milestone: five basic labs implemented; commit pending.
