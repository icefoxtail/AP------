# 22 Suncheon H2 Math I 1st midterm: SVG input triage

Source: `archive/exams/original/high/h2/1mid/22_순천고_1학기_중간_고2_수학I.js`, blob `58d9d85ca4ff16f5db8a749e08a965a31186d5f8`. The bank was parsed in Node: exactly 22 questions with ids 1–22.

This is input-only preparation. No source JS, answers, solutions, original images or SVGs were edited. No renderer output is included. `publish.json` size is provisional until renderer results exist.

| Q | Status | Basis |
|---|---|---|
| 01 | EXEMPT | root triage: calculation/symbolic only; no separate visual relation needed |
| 02 | EXEMPT | root triage: calculation/symbolic only; no separate visual relation needed |
| 03 | EXEMPT | root triage: calculation/symbolic only; no separate visual relation needed |
| 04 | PLAN_READY_NOT_RENDERED | actual engine input/spec preflight passed; no render or visual QA |
| 05 | PLAN_READY_NOT_RENDERED | actual engine input/spec preflight passed; no render or visual QA |
| 06 | PLAN_READY_NOT_RENDERED | actual engine input/spec preflight passed; no render or visual QA |
| 07 | EXEMPT | root triage: calculation/symbolic only; no separate visual relation needed |
| 08 | EXEMPT | root triage: calculation/symbolic only; no separate visual relation needed |
| 09 | OPEN | exact overlay points fit but no common view retains all required points/lengths/asymptote |
| 10 | UNSUPPORTED | two log comparisons cannot be combined under current composite family whitelist |
| 11 | UNSUPPORTED | exact irrational logarithmic endpoint coordinates cannot enter trapezoid spec |
| 12 | PLAN_READY_NOT_RENDERED | actual engine input/spec preflight passed; no render or visual QA |
| 13 | PLAN_READY_NOT_RENDERED | actual engine input/spec preflight passed; no render or visual QA |
| 14 | PLAN_READY_NOT_RENDERED | actual engine input/spec preflight passed; no render or visual QA |
| 15 | PLAN_READY_NOT_RENDERED | actual engine input/spec preflight passed; no render or visual QA |
| 16 | EXEMPT | root triage: calculation/symbolic only; no separate visual relation needed |
| 17 | EXEMPT | root triage: calculation/symbolic only; no separate visual relation needed |
| 18 | PLAN_READY_NOT_RENDERED | actual engine input/spec preflight passed; no render or visual QA |
| 19 | UNSUPPORTED | source t≥0 cannot be represented by exponential-affine ALL_REALS contract |
| 20 | EXEMPT | root triage: calculation/symbolic only; no separate visual relation needed |
| 21 | PLAN_READY_NOT_RENDERED | actual engine input/spec preflight passed; no render or visual QA |
| 22 | EXEMPT | root triage: calculation/symbolic only; no separate visual relation needed |

## Exact engine evidence
- Current main: `3d4cea5e2694c0d4a71315e96f8332f34da56daf` (from parent’s verified current-main read). Production blobs: `phase2.mjs` `3e52203bcf1d9d1e24c08bc81760bb4414813324`; `graph_framing.py` `f33196ce44c709f59118fd3c4eb49ac1bae6e214`; `number-line-v1.mjs` `aeac72606b976e692b1da1e7d690eb2f4abda736`; `construction.py` `1544db76302491f0325dfff4292f9b712ae71f50`. These match the checked local files used for preflight.
- Verified input preflight for Q04, Q05, Q06, Q12, Q13, Q14, Q15, Q18, Q21: Python graph framing/construction plus `phase2.specFor`, or number-line expand/solve/spec. Test execution completed 2026-11-11 11:53 UTC. This is not a render, observer pass, or visual QA.
- Q15’s exact construction produced two points on line x+y=−4/5 and the radius-1 unit circle; coordinates are intentionally hidden in the plan.
- Q11 existing source image `archive/assets/images/22_순천고_1학기_중간_고2_수학I/q11.png` blob `14073d6b36aa071ec46b0214f8f83353d6366fba` verified unchanged.

## Preservation and handoff
- No generated SVG/PNG or original image was added or overwritten. Q11 remains unsupported for a replacement; its original PNG stays intact.
- No implementer handoff: no authorized current receiver was identified.
- All 22 item bindings and decisions are stored under `root-inputs/qNN/`; only nine validated candidate questions have `publish.json`.
