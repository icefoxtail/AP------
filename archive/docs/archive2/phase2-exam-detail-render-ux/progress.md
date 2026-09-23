# Stage 2 execution ledger — Notion plan: Archive 2.0 2단계 — 시험지 상세·렌더 UX / LaTeX·도형·A4 출력 Codex 실행계획

## Fixed context
- Base origin/main: 06c8d9f4271799446af70794f9cdf462cec5df20 (fetched 2026-09-23 UTC)
- Branch: codex/archive2-exam-render-ux-20260923
- Workspace: isolated Codex worktree
- Notion plan: fetched in full; no truncation reported
- Execution mode: primary Codex only; no subagents
- Production changes: none at ledger creation
- Model requirement: session model routing cannot be changed through available task tools; execution model identity/effort remains unverified

## Run order
- [x] LOOP 0 owner and contract discovery started
- [x] Freeze baseline feature tests and actual browser render matrix
- [x] Record severity findings with physical evidence
- [x] Fix HIGH, then MEDIUM, then LOW with per-loop targeted regression
- [x] Verify LaTeX and geometry/image fixtures
- [x] Verify A4 print output at qpp 4, 6, 8
- [x] Final changed-denominator review and full regression
- [ ] Freeze evidence, stage named files, commit, push this branch only

## Initial owner map
- Archive 2 workspace detail/preview routes, mode tabs, inspector: archive/archive2-workspace.js
- Workspace CSS, modal, inspector, mobile actions: archive/archive2.css
- Output options and qpp 4/6/8 URL contract: archive/archive2-output.js
- Paper split/part helpers: archive/archive2-papers.js
- Original question preview/print authority: archive/engine.html
- Mixed/Compose preview/print authority: archive/mixed_engine.html
- Shared PC sidebar/mobile 5-tab shell: archive/archive2-navigation.js, archive/archive2-navigation.css
- Workspace entry point: archive/workspace.html

## Checkpoints
- LOOP 0: in progress

## Checkpoint 1 — actual baseline render and targeted tests
- [x] Baseline targeted test output frozen at evidence/baseline-targeted-tests.log.
- [x] Two origin/main test-harness failures reproduced separately; root causes recorded.
- [x] Actual Chrome viewport/shell and original exam preview baseline measured at 1440 / 1180 / 1024 / 961 / 960 / 390.
- [x] Confirmed HIGH mobile readability debt, persisted in UX_DEBT_LEDGER.md and baseline-render-matrix.json.
- [x] Capture remaining baseline mode/fixture states and A4 PDF/PNG evidence.

## Checkpoint 2 — baseline print/render evidence frozen
- [x] Baseline originalSnapshot fixtures frozen for text, math, and geometry/image content.
- [x] A4 qpp 4/6/8 baseline: 9 PDFs; all match A4 dimensions, rendered page count, display title, and image readiness.
- [x] Rasterize all baseline pages; inspect three contact sheets and representative full-page math, text, and geometry pages.
- [x] Freeze actual 1440px / 390px browser render screenshots for original detail and preview.
- [x] Finish baseline Compose selection, part split, question-manager, inspector, mode tabs, and action/target measurements before implementation.

## LOOP 0 completion
- [x] Actual owner inventory and existing contract authorities frozen.
- [x] Feature/render matrix exercised through Finder original preview, live Unit Past ready paper, Compose preview, mode switches, part selector, question manager, inspector, pin, replace, undo, output settings, and mobile actions.
- [x] Baseline screenshots and A4 print evidence frozen; 9/9 original A4 matrix files were rendered through the existing snapshot/output contract.
- [x] Blocking baseline debt confirmed; proceed to HIGH → MEDIUM → LOW patch loops.

## HIGH loop 1 — readable mobile paper flow
- [x] Failing responsive-render contract test added and observed RED.
- [x] Shared screen-only stylesheet linked from both original and mixed output engines.
- [x] A4 pages retain the original print layout; mobile views reflow existing question content into one readable column after RENDER_READY.
- [x] Direct original exam, solution, and answer renders at 390px were inspected; MathJax is rendered at its normal 14.7px container text size, question/solution text is no longer page-scaled, and the geometry diagram fits.
- [x] Actual Compose preview at 390px was inspected after generating 60 questions; the mixed-engine paper is readable in one column.
- [x] A4 print matrix and original snapshot header contracts rerun by Chromium after the stylesheet change.
- Evidence: evidence/screens/final-original-engine-mobile.png, evidence/screens/final-original-solution-mobile.png, evidence/screens/final-original-answer-mobile.png, evidence/screens/final-workspace-detail-mobile.png, evidence/screens/high-compose-selected-mobile.png, evidence/a4/final/.

## MEDIUM loop 2 — touch targets and page-count controls
- [x] Added target-size regression conditions and observed RED against the 26px engine tabs, 34px Compose desktop mode tabs, 42px mobile actions, and 32px desktop page-count selector.
- [x] Kept mobile original/mixed mode tabs at 44px and their toolbar at 52px, with all prior mode labels and state behavior.
- [x] Raised Compose desktop mode tabs to 36px and page-count selectors to 36px; compact controls remain 44px.
- [x] Raised the three Compose mobile actions to 44px; action bar and bottom tabs retain their 1px separation and do not overlap.
- [x] Verified actual 1440px Compose mode controls and page selector, plus 390px Compose action buttons, in Chrome after the changes.
- [x] Repeated the original, mixed, and Compose screen renders; existing 4/6/8 output values, part split, mode switches, and pin/replace/undo behavior remain intact.
- Evidence: evidence/compose-final.json; evidence/screens/final-compose-selected-desktop.png; evidence/screens/final-compose-selected-mobile.png; evidence/screens/final-original-engine-mobile.png.

## LOW severity pass
- [x] No remaining LOW UX findings after desktop, mobile, LaTeX, geometry/image, and A4 page reviews.

## Final A4 / raster review
- [x] Generated 14 final PDFs: original text/math/geometry exam qpp4/6/8, original geometry solution and answer qpp4, and mixed/Compose exam qpp4/6/8.
- [x] Every PDF matches A4 size, expected browser-render page count, expected output header, and has no render-error text; `evidence/a4/final/pdf-audit.json` reports zero failures.
- [x] Original fixtures include rendered MathJax and image assets; mixed/Compose final qpp4/6/8 contains 50 questions, 488 MathJax containers and six ready images in the regenerated selection.
- [x] Rasterized all final PDF pages and visually reviewed text, math, geometry, and mixed/Compose contact sheets plus full-size equation and diagram pages.
- Baseline plus final expected PDF evidence count: 9 baseline + 14 final = 23.

## Final convergence
- [x] Full regression complete and baseline/environment-sensitive failures classified.
- [x] Final branch diff reviewed; only this task's production, test, and evidence files are staged.
- [x] Commit and push the task branch only; main was not merged or pushed.

### Regression results and remaining HOLD
- Focused patch regression excluding the known navigation harness: 107 tests passed.
- The broader targeted set: 110 tests, 108 passed and the same two Archive 2 navigation harness tests failed as at the frozen origin/main baseline (`location` missing in one mock, `querySelector` missing in the other). See `evidence/baseline-navigation-only.log` and `evidence/final-targeted-tests.log`.
- Full `tests/` discovery from the repository root: 830 tests, 580 passed and 250 failed. Examples include a pre-existing Unit Past fixture error (`getProblemTypeKey is not a function`) and the Phase 0 source SHA fixture rejecting the existing, unchanged `apmath/student/index.html` bytes. Full output: `evidence/final-tests-directory-root.log`.
- Full repository Node auto-discovery: 1,188 tests, 930 passed and 258 failed; it additionally enters operational audit tests with absent generated report inputs. Full output: `evidence/final-full-regression.log`.
- No failing test points to the changed preview styles or touch-target rules. Remaining HOLDs: repository-wide baseline/fixture failures above and the four `origin/main` commits added after this branch was created (latest observed `54ef7d6f`); no UX or A4 output HOLD remains.
