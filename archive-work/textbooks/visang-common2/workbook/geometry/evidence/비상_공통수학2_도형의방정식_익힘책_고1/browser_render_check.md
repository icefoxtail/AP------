# Final browser render check

Work batch: `visang-workbook-geometry-20260929`  
Frozen candidate input SHA: `sha256:146fb8a68b1f2da3e20964c533158b3322c7d089bb6d27468389bdb4e97dd9dc`  
Freeze SHA: `sha256:240fddb0c08f9b9c8854beca7d17af8fe1bc9140ebeb435bc5d1ea4fb5668acf`

## Capture coverage

The pipeline-core browser collector used the production `archive/engine.html` runtime and captured the full 14-question bank in six cases:

| Mode | Viewport | Questions observed | Runtime | MathJax | Fonts | Images | Clipping | Overflow | Browser errors |
|---|---|---:|---|---|---|---|---|---|---:|
| Exam | Desktop 1280×1000 | 14/14 | PASS | PASS | PASS | PASS | PASS | PASS | 0 |
| Exam | Mobile 390×844 | 14/14 | PASS | PASS | PASS | PASS | PASS | PASS | 0 |
| Solution | Desktop 1280×1000 | 14/14 | PASS | PASS | PASS | PASS | PASS | PASS | 0 |
| Solution | Mobile 390×844 | 14/14 | PASS | PASS | PASS | PASS | PASS | PASS | 0 |
| Answer | Desktop 1280×1000 | 14/14 | PASS | PASS | PASS | PASS | PASS | PASS | 0 |
| Answer | Mobile 390×844 | 14/14 | PASS | PASS | PASS | PASS | PASS | PASS | 0 |

All six capture reports record the final item id as `14`; all report `badImages: 0`, `mathErrors: 0`, and `renderError: null`. The six immutable capture records and their item screenshots are stored under `pipeline-core/render-capture-final-r1/` and are bound into the frozen run manifest.

## Visual review notes

Inspected complete desktop and mobile contact sheets for all six mode/viewport combinations, plus full-size q03, q11, and q14 screenshots. The question order and source images are visible, solution blocks remain within their two-column layout, and the q14 source graph and solution transformation stages render without a stray prompt-text fragment. No clipping, horizontal overflow, missing images, or raw TeX appeared in the captures.

q03 and q11 remain without solution images. q03 is more accurately explained by its slope-product relation than by choosing arbitrary fixed coordinates; q11 contains three independent transformation statements, so a composite plot would imply a shared geometry. Their symbolic-only treatment is intentional and recorded as `VISUAL_EXEMPT` in the visual-benefit ledger and frozen manifest.

This is a builder-side visual inspection note. The capture records intentionally leave automated `readability` as `NOT_TESTED`; independent render review remains part of the serialized FINAL_AUDIT.
