# Browser render evidence — 2026-09-04

## Direct visual asset review

- Page: `visual-review.html`
- Method: current production `qNN-solution.svg` files were loaded as real browser `<img>` elements, not inspected only as source text.
- Result: **65/65 image elements present; broken images 0**.
- Accessibility tree contained every target row and image. The visible capture was reloaded after the final LF-preserving SVG write.
- Manual visual spot checks included the high-risk coordinate cases: 21 복성 q1/q16, 21 순천 q9/q20, 22 효천 q14, 22 제일 q14, 23 팔마 q14, 24 제일 q12, 24 매산 q15/q17, 25 순천여 q14/q17/q21, and the 25 금당 multi-circle cases.

## Direct archive-engine review

The archive engine was opened in a real browser at QPP=4 and allowed to finish MathJax/layout rendering before inspection.

| Case | Mode | Direct result |
|---|---|---|
| 22 효천고 1기말 | `exam` | q content rendered; no load error; existing layout overflow was separately observed on the full exam page |
| 22 효천고 1기말 | `sol` | q=22, images=6, broken=0, overflow=0, error=false; target q14 SVG appeared in the image list |
| 22 효천고 1기말 | `ans` | answer entries=22, broken=0; direct screenshot showed the complete answer table |
| 25 매산고 2중간 | `sol` | q=20, images=9, broken=0, overflow=0, error=false; target q7/q10/q14/q18/q20 SVGs appeared in the image list |
| 22 금당고 1기말 | `exam` | q=21 and full first-page screenshot visible |
| 22 금당고 1기말 | `sol` | q=21 and full rendered solution page visible after MathJax completion |
| 22 금당고 1기말 | `ans` | answer entries=21 and complete answer-table screenshot visible |

## Exhaustive engine harness

`engine-browser-harness.html` completed 25 source files × 3 modes = 75 mode runs.

- Harness result: **72 PASS / 3 FAIL**.
- The three failures are not target SVG failures:
  - `22 효천고 1기말 / exam`: the harness recorded an existing page overflow condition.
  - `22 효천고 1기말 / ans`: the harness sampled the answer-number selector before the answer DOM settled; direct re-open after 12 seconds measured 22 answer entries and rendered the complete table.
  - `25 매산고 2중간 / sol`: the harness sampled a transient page/image state; direct re-open after 20 seconds measured q=20, images=9, broken=0, overflow=0, error=false.
- Therefore the SVG-specific browser gate is **PASS (65/65 loaded and visually reviewed)**. The archive-engine global gate remains **WARN**, because two pre-existing engine/layout observations are outside this SVG-only change scope.
