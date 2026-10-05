# Final review — pinpoint closure

- Task branch: `codex/archive2-exam-render-ux-20260923`.
- Latest upstream merged: `origin/main` at `54ef7d6f479c2dee804812b22b24ed9c51b507c9`; merge commit: `b72261231ae14df6cf564d9d013742de3a9f7699`.
- No branch was created. The three GPT-confirmed UX defects and render-evidence cleanup were closed in this follow-up.

## Closed findings

- **P1-01 — mobile answer order:** each nonempty answer cell carries its source chunk index. Archive2 mobile screen CSS applies that order to the single-column grid. The shared answer executor and both engine fallback renderers use the same index. Empty padding cells remain hidden; desktop and print keep their existing two-column layout.
- **P1-02 — Archive 1 scope leak:** all four Archive2 engine entry points use `Archive2Output.engineUrl`, which sends `archive2Context=archive2`. Both engines set the document context from that explicit marker. Every rule in `archive2-preview-mobile.css` requires the marker and screen media; `archive/index.html` legacy links send no marker.
- **P2 — small solution SVG:** Archive2 mobile screen CSS lets solution image wrappers use the content width and removes image `max-width` / `max-height` size caps. The original q3 SVG and `solutionImageSize` data were not changed. Desktop and print sizes are unchanged.
- **Evidence cleanup:** removed 162 generated PNG renders totaling 16,225,059 bytes from this phase's `evidence/screens` and A4 `rendered` folders. No PDF files were tracked in this evidence set.

## Targeted verification

- `node --check` passed for `archive/archive2-output.js`, `archive/archive2-workspace.js`, `archive/answer-render-executor.js`, and `tests/archive2-preview-responsive.test.cjs`.
- `node --test tests/archive2-preview-responsive.test.cjs`: **5 passed, 0 failed**. The browser test uses the original 21-question Maesan geometry exam and its unchanged 620×420 q3 solution SVG.
- At 390px, the browser's positioned answer-cell order was asserted as `1, 2, 3, …, 21` for both `engine.html` and `mixed_engine.html`, through shared and fallback renderers. Archive 1 marker-free engine paths retained two columns.
- The 390px q3 SVG filled its available solution wrapper; Archive 1 retained the prior 72% / 145px caps. Archive2 exam rendering had no horizontal overflow. Desktop Archive2 answers remained two-column.
- A4 qpp 4/6/8 retained **5/4/3 pages** in the existing text fixture; page counts stayed the same after switching the browser to print media.
- No repository-wide test suite or large render capture was rerun.

## Durable evidence retained

- This summary and `UX_DEBT_LEDGER.md`.
- A4 baseline/final `summary.json` and `pdf-audit.json`.
- `evidence/compose-final.json` and `evidence/mobile-mode-tab-baseline.json` for the existing closed UX items.
- The targeted DOM/browser regression in `tests/archive2-preview-responsive.test.cjs`.
