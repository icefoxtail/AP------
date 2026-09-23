# LOOP 0 — Current production and render inventory

## Environment
- Base origin/main: 06c8d9f4271799446af70794f9cdf462cec5df20
- Fresh branch: codex/archive2-exam-render-ux-20260923
- Main state includes Compose updates through merge: archive2 compose count invalidation.
- Working tree started clean; no production file changes before baseline.

## Production authorities found
- Source preview modal and original issue workflow: archive/archive2-workspace.js → openOriginalIssue, originalOutputUrl, updateOriginalPreview, originalPrint.
- Compose preview, question manager, mode and part selectors: archive/archive2-workspace.js → renderPaper, renderCompose, updatePreview.
- Original output options: archive/archive2-output.js; qpp is constrained to 4/6/8 and serialized to existing engine query parameters.
- Original issue print/render: archive/engine.html.
- Mixed/Compose print/render: archive/mixed_engine.html.
- Shared navigation shell: archive/archive2-navigation.js and .css; current CSS includes 222px PC sidebar and a 960px switch to mobile bottom navigation.
- Workspace responsive/modal/inspector styles: archive/archive2.css.
- Entry point and script ordering: archive/workspace.html.

## LOOP 0 remaining
- Capture actual baseline at 1440, 1180, 1024, 961, 960, and 390 CSS px.
- Capture exam/solution/answer, multi-part, math-heavy, geometry/image-heavy, long-title, question-manager, inspector, and mobile-action states.
- Identify representative local source fixtures without changing question content.
- Capture pre-change A4 PDF baselines for text, math, and geometry/image at qpp 4/6/8.
- Record exact baseline console/runtime issues and targeted test results.
