# Browser render check — 고1 평면좌표

- Runtime: real Chrome browser, localhost server rooted at the isolated worktree
- Harness: `reports/plane-coordinate-qa-20260904/engine-browser-harness.html`
- Viewport: desktop Chrome harness iframe `1280 × 900`
- Scope: 27 production JS × `exam`, `sol`, `ans` = 81 render cases
- Final result: **PASS 81/81; FAIL 0**

Each case was loaded in a same-origin iframe and checked for:

- expected q-number count (`.q-box` containing `.q-num`) in `exam`/`sol`
- expected answer-number count (`.ans-n`) in `ans`
- image completion and `naturalWidth > 0`
- MathJax/visual element presence in `exam`/`sol`
- load-error/error text absence
- horizontal overflow on the scoped 평면좌표 target q-boxes; full exam/sol count and last-question presence remain whole-exam checks
- final/last question presence through the expected count

The harness initially exposed checker defects: staging/print duplication, a transient pre-compression overflow sample, and an answer-mode visual-element requirement. The harness was corrected to use the engine's `#staging` q-boxes, wait for the complete PASS predicate, and exempt `ans` from the MathJax/visual-presence condition. The production engine and production question data were not changed for those harness corrections. One pre-existing overflow was observed in a non-target 22 효천고 1final q21 연립부등식 box during calibration; it was excluded from the target-scoped overflow gate and left untouched because this task forbids other-unit/common-engine changes. No scoped 평면좌표 target overflow remained. The final Chrome run completed with `DONE · 81 modes · pass 81 · fail 0`.

The six modified SVGs were additionally opened standalone in Chrome after the final production edits. All six showed the expected labels and topology without clipping or label overlap requiring another correction.
