# Final review — pinpoint closure

- Task branch: `codex/archive2-exam-render-ux-20260923`.
- Latest upstream merged: `origin/main` at `54ef7d6f479c2dee804812b22b24ed9c51b507c9`; merge commit: `b72261231ae14df6cf564d9d013742de3a9f7699`.
- No branch was created. The three GPT-confirmed UX defects and render-evidence cleanup were closed in this follow-up.

## Closed findings

- **P1-01 — mobile answer order:** each nonempty answer cell carries its source chunk index. Archive2 mobile screen CSS applies that order to the single-column grid. The shared answer executor and both engine fallback renderers use the same index. Empty padding cells remain hidden; desktop and print keep their existing two-column layout.
- **P1-02 — Archive 1 scope leak:** the Archive2 workspace centralizes URL creation through `Archive2Output.engineUrl`, which sets `archive2Context=archive2`. A separate screen-only exception is limited to legacy `engine.html` when its `#qpp-display` is present and a `.q-box.sol-box` exists; legacy answer/exam and marker-free mixed-engine layouts remain unchanged.
- **P2 — small solution SVG:** Archive2 mobile lets the solution image use available content width without a height cap. A separate legacy qpp4 solution-only CSS exception is present; production-page visual verification is still pending on the current remote source tree. The original q3 SVG and `solutionImageSize` data were not changed. Desktop, print, legacy exam/answer, and marker-free mixed-engine layouts are unchanged.
- **Evidence cleanup:** removed 162 generated PNG renders totaling 16,225,059 bytes from this phase's `evidence/screens` and A4 `rendered` folders. No PDF files were tracked in this evidence set.

## Targeted verification

- Phase 5 source-authority, encoding, repair-budget, rendered-layout and qualification unit checks: **45 passed, 0 failed, 4 skipped**. The skipped checks are tied to the old frozen Jeilgo q10 source; the current remote source SHA differs and requires fresh qualification.
- Python geometry suite: **201 passed**.
- An isolated 390px Chromium fixture applied the qpp-display solution rule as one column while a marker-free answer grid stayed two columns. This checks selector behavior, not the production qpp4 render.
- The current-remote production browser run did not close: the iframe and engine render readiness timed out. The qpp4 production-page image sizing and Archive2 mobile regression remain unverified against this remote source snapshot.
- No repository-wide test suite or large render capture was run.
## Durable evidence retained

- This summary and `UX_DEBT_LEDGER.md`.
- A4 baseline/final `summary.json` and `pdf-audit.json`.
- `evidence/compose-final.json` and `evidence/mobile-mode-tab-baseline.json` for the existing closed UX items.
- The targeted DOM/browser regression in `tests/archive2-preview-responsive.test.cjs`.
