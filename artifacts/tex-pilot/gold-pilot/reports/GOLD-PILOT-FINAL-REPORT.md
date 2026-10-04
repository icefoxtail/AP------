# AP Math TeX/TikZ SVG GOLD PILOT final report

Branch: `codex/tex-tikz-gold-pilot`  
Iterations: `r01` through `r10`  
Holdout: 3 unused archive-based cases

## Trend

| iteration | semantic/fact/render | polish required | NEW_WINS | TIE | OLD_WINS | regression |
|---|---|---:|---:|---:|---:|---|
| r01 baseline | 10/10 local build/render | 6 | 1 | 4 | 5 | — |
| r02 | 10/10 | 3 | 5 | 5 | 0 | 0 |
| r03 | 10/10 | 0 | 8 | 2 | 0 | 0 |
| r04 | 10/10 | 0 | 8 | 2 | 0 | 0 |
| r05 | 10/10 | 0 | 8 | 2 | 0 | 0 |
| r06 | 10/10 | 0 | 8 | 2 | 0 | 0 |
| r07 | 10/10 | 0 | 8 | 2 | 0 | 0 |
| r08 | 10/10 | 0 | 8 | 2 | 0 | 0 |
| r09 | 10/10 | 0 | 8 | 2 | 0 | 0 |
| r10 | 10/10 | 0 | 8 | 2 | 0 | 0 |

Each iteration rebuilt all ten cases. Each sealed report preserves generator/schema/input/TEX/SVG hashes, render metrics, visual review, defects, and aggregate evidence under `reports/iterations/rNN/`.

## Engine improvements

- Numeric geometry authority for canonical lines, intersections, parallel/perpendicular checks, tangent slope checks, and SPECIAL witnesses.
- Semantic `TANGENT`, `PARALLEL`, `PERPENDICULAR`, and verified mark handling.
- Source/derived fact separation and parity checks.
- Geometry equal-unit aspect policy separated from graph readability aspect policy.
- Explicit equation labels removed automatic duplication.
- Math-aware TeX labels, `fontspec` Malgun Gothic policy, and zero typography-critical warnings in the sealed runs.
- Shared AUTO label placement and collision/viewport structural gates.
- Math-aware multiline condition boxes.
- Fail-closed desktop/mobile render assertions.

## Holdout

The r10 engine was applied unchanged to three unused archive cases:

- H01 circle with two tangent lines: facts PASS, desktop/mobile PASS.
- H02 point tangent: derivative/tangent semantic PASS, desktop/mobile PASS.
- H03 two axis-tangent circles: point/circle facts and center distance `4√6` PASS, desktop/mobile PASS.

Evidence: [holdout report](C:/Users/USER/Desktop/AP------/artifacts/tex-pilot/gold-pilot/reports/holdout/HOLDOUT-REPORT.md), [fact validation](C:/Users/USER/Desktop/AP------/artifacts/tex-pilot/gold-pilot/reports/holdout/fact-validation.json), and [holdout manifest](C:/Users/USER/Desktop/AP------/artifacts/tex-pilot/gold-pilot/reports/holdout/manifest.json).

## Final decision

**GOLD_ENGINE_SEALED**

The GOLD engine completed ten full iterations without semantic, fact, math, render, clipping, collision, or glyph failures. It generalized to all three holdout cases without changing generator/schema/style during holdout. Production pipeline integration, the geometry-equation FULL PILOT, and promotion remain separate follow-up stages.
