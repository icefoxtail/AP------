# AP Math Playground React migration status

## Scope
Standalone React + TypeScript + SVG + GSAP + KaTeX playground under `playground-react/`. The production site and all Archive content remain outside the change.

## Milestones
| Area | Types | Variants | Status | Verification |
|---|---:|---:|---|---|
| React pilot foundation | 1 | 4 | Ready | `npm install`, `npm run check`, `npm run test:math` (370 cases), `npm run build` PASS |
| Basic circle / sector concepts | 5 | 5 | Pending | pending |
| STEP3 practice catalog | 13+ | 27 source structures identified | Pending | pending |
| PC/mobile integration QA | all | all | Pending | pending |

## Source inventory
- `pilot/` React starter copied from the overnight handoff.
- STEP3 has 13 practice principles and 23 explicit `makeCase` examples. The pilot already contains four semicircle forms. STEP3's one lopsided semicircle scene is an additional candidate, pending integrated implementation.
- Drive manifest lists 11 main lab pages and a basic supplemental page. Source pages and common relation assets have been staged outside this repository for reference; no raw exam gallery is being imported.

## Verified behavior
- Semicircle pilot exact-π arithmetic: four base forms and 370 parameter combinations pass the supplied mathematical assertions.
- The proof animation currently stages line highlights, length bars and area cards; it does not yet move actual area pieces or unfold matched arc lengths.

## Unfinished
- Port basic five concepts into interactive React modules.
- Add independent interactive modules for the STEP3 cases and connect all cards.
- Add actual arc-length correspondence/unfolding and area-piece movement.
- KaTeX parameter synchronization and desktop/mobile browser verification.

## Commits
- Foundation commit pending.
