# 2025 M3 Solution SVG Full Rebuild — Phase 1–5 Restart

Working branch: `codex/2025-m3-visual-publication-full-rebuild`
Base commit: `b3c373b43f8932fa42792987663729730d4b4768`
Publication boundary: push this branch after the full rebuild; do not merge it into `main`.

## Final full rebuild — 2026-10-09

- Exact denominator: 10 exams / 130 current solution SVGs. The final source
  inventory is `source-inventory-current-display-full-v5.json` and binds the
  current source JS, answer, verified solution and target SVG references.
- All 130 candidates were emitted by the main-promoted
  `geometry-publication-v1` engine and independently checked by
  `geometry-publication-audit-v1`: **130/130 static PASS**.
- Independent human review covered all 24 diagram revisions made after the
  first desktop render. Review findings were corrected and rechecked; all
  reviewed items passed before promotion.
- Actual Archive desktop `mode=sol`, `qpp=4`, 1440×1000 render: **10/10 exams
  PASS; 130/130 SVGs loaded; zero measured font-floor, crossing, clipping or
  overflow errors**. No mobile qualification was run. The capture matrix and
  screenshots are in `archive-render-desktop-20261009-v7/`.
- 99 SVGs carry a measured fullwidth solution-row hint because their original
  two-column rendering was below the 11 CSS-pixel label floor or their diagram
  needed the relation panel. The remaining 31 retain the two-column layout.
  Fullwidth diagrams use a 640px maximum height so tall figures fit a page.
- The shared geometry engine now supports annotation labels linked to an
  independently audited condition box. Values remain bound to their angle or
  segment annotation; condition-box text uses the notation in the verified
  solution. The shared Archive solution renderer and measured layout planners
  support fullwidth rows.
- `python -m unittest test_publication`: **51 PASS**. Archive rendering/layout
  unit tests: **32 PASS**. `node tools/check-archive2-runtime.cjs`: **42 PASS**.
- Canonical Phase 1–5 completion remains `INPUT_REQUIRED`: the required
  `SOURCE_EXAM_ID_REGISTRY_v1` is absent, so no exam IDs are inferred and no
  Phase 1–5 PASS is claimed.
- All solution SVGs were constructed from the source problem, verified solution
  and frozen geometry facts. Existing SVG bytes were not used as construction
  inputs. The final candidate manifest and promotion receipt are
  `final-candidates/final-candidate-manifest.json` and
  `final-promotion-receipt-v1.json`.

## Current run — 2026-10-09

Fresh denominator is `source-inventory-current-main-v2.json`:

- 10 target exams
- 130 current `solutionImage` SVG references
- all 130 runtime solutions present
- current source JS, answer and verified solution hashes are bound
- target solution SVG bytes were not read as construction inputs

The full Phase 1–5 runner exists in current main, but the required canonical
`SOURCE_EXAM_ID_REGISTRY_v1` for this target set is not present. Canonical
Phase 1–5 completion is therefore `INPUT_REQUIRED`; no IDs are inferred from
filenames and no experimental locator result is promoted to a production PASS.
The current main-promoted `geometry-publication-v1` generator and independent
SVG auditor remain the production route for items that can be exactly expressed.

Shared calibration is frozen at
`calibration-v2/calibration.json`. It binds three official engine control
samples with independent audit PASS and actual Archive desktop `mode=sol`
render PASS (1440×1000; minimum measured label size 12.42 CSS px; zero measured
collisions/clipping). The real high-school SVG comparators were also rendered;
they were excluded from Golden status because current measurement found label
size below 11 CSS px and/or clipping/collision. Their bytes/layout are not
construction references. A frozen missing-owner-ray negative sample is bound.

The common-engine expression additions are anonymous source-point identity,
point-circle incidence auditing, frozen point-name baselines and callouts,
frozen angle label anchors, constructed-coordinate minor/reflex angle conditions,
shared publication sizing for condition-box text, and owner-audited leader
callouts for crowded angle, length, and point labels. Square right-angle markers
can omit a redundant `90°` text label. A source-endpoint-owned `CIRCULAR_ARC`
primitive covers true partial arcs and semicircles without substituting a full
circle. These extend the formal engine/auditor; no task-specific SVG generator
was added.

## Superseded exploration

`source-inventory-v1.json`, `calibration-v1.json`, and `facts/` contain the
earlier geometry-publication-v1 attempt. They are retained as historical work
only; they are not Phase 1–5 candidate inputs, final assets, or review receipts.
The two temporary production SVG replacements from that attempt were restored
to the branch base. Current-run builders must create fresh visual specs and
SVGs from source question, verified solution, and frozen geometry facts.

`phase1-5-full-rebuild/<exam>/denominator.json` contains the exact inventory qids
for worker ownership. Non-contiguous qids are intentional; records in the
current inventory, not `1..N`, define each exam denominator.
