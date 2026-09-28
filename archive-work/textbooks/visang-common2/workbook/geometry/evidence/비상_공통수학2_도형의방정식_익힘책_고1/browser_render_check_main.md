# Current-main browser render check

Main baseline: `14ff950d4a76104d10950494aa05c7dc894624cc`  
Rule-pack SHA: `sha256:b5207bfa4b318d30279e13a3b9aa86ee46b236bd064766032c6b5b2da18b35ee`  
Work batch: `visang-workbook-geometry-20260929-main`  
Run: `visang-workbook-geometry-20260929-main-run`  
Run input SHA: `sha256:fe0417d78a0f7d2477f0b90ffe07f0a51ae55e16fc2533751df55bbe1686c0f5`  
Freeze SHA: `sha256:9bc5dd3c486887946ef99ebf843df59ce070328456ba20b172ec5e93bc157de7`

The current-main run binds three 2025 grade-1 geometry calibration exams (four representative questions), two frozen negative SVG fixtures, and the negative-fixture registry README. Rules preflight and all 28 STATIC/METADATA machine checks pass.

## Render capture coverage

| Mode | Viewport | Questions | Runtime | MathJax | Fonts | Images | Clipping | Overflow | Browser errors |
|---|---|---:|---|---|---|---|---|---|---:|
| Exam | Desktop 1280×1000 | 14/14 | PASS | PASS | PASS | PASS | PASS | PASS | 0 |
| Exam | Mobile 390×844 | 14/14 | PASS | PASS | PASS | PASS | PASS | PASS | 0 |
| Solution | Desktop 1280×1000 | 14/14 | PASS | PASS | PASS | PASS | PASS | PASS | 0 |
| Solution | Mobile 390×844 | 14/14 | PASS | PASS | PASS | PASS | PASS | PASS | 0 |
| Answer | Desktop 1280×1000 | 14/14 | PASS | PASS | PASS | PASS | PASS | PASS | 0 |
| Answer | Mobile 390×844 | 14/14 | PASS | PASS | PASS | PASS | PASS | PASS | 0 |

Each report ends with item id `14` and records `mathErrors: 0`, `badImages: 0`, and `renderError: null`. The 84 current-main witnesses are under `pipeline-core/render-capture-main-r1/`. Representative q03 solution, q11 solution, and q14 mobile-exam screenshot bytes match the earlier visually inspected captures exactly; q03/q11 remain symbolically presented with their documented exemptions.

Independent FINAL_AUDIT has not yet run on this current-main freeze.
