# Logic Visual Audit — Qualification Phase 1

This directory contains qualification-only infrastructure for the 집합·명제 Semantic Overlay v1.4. It does not rewrite production questions or solution SVGs.

## Loop order

```tex
verify-rule-preflight.mjs
build-target-inventory.mjs
emit-v1-source-only-bundles.mjs
emit-v2-artifact-only-bundles.mjs
freeze-v1-evidence.mjs
freeze-v2-evidence.mjs
compute-c-denominator.mjs
verify-item-semantic-parity.mjs
audit-visual-structure-duplicates.mjs
run-mutation-qualification.mjs
run-holdout-qualification.mjs
run-qualification-render.mjs
build-qualification-report.mjs
```

Run from the repository root with Node.js 22+. All parsers are deterministic and use only Node built-ins.

V1 is source-only and excludes answer, solution, solution-image metadata, builder facts, and previous verdicts. V2 is artifact-only and extracts observed facts from SVG structure; declared `data-*` hashes are never used as a PASS signal.

`C` semantic status and qualification render status are separate. A candidate overlay PASS is not Common Core release/seal authority.
