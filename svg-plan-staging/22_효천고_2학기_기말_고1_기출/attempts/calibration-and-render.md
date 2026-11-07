# Renderer attempts and environment result

## Calibration attempt

Ran the official `archive/tools/geometry-equation/production/render-plan.mjs` on Golden item33 using its official plan. The first attempt stopped at `measure` because Playwright defaulted to the unavailable Chrome distribution path. Retried with the repository-supported `GEOMETRY_BROWSER_EXECUTABLE=/usr/bin/chromium`; the official pipeline advanced to `compose` then failed with `ENOENT` for `/workspace/AP------/.tmp/apmath-visual-engine/dependencies/NotoSansKR.ttf`.

This is a required renderer dependency absent in the selected environment. No substitute font, symlink, dependency install, renderer edit, or alternate path was used. A prior standalone `svg2png` display of the legacy Q4 asset was not evidence for the new candidates.

## Candidate attempts

The official renderer ran three batches. Attempts 1 and 2 exposed plan-contract problems, which were corrected in `engine-inputs/` while the original ROOT drafts remained unchanged in `root-inputs/`. Attempt 3 included all 18 ROOT-owned questions (Q3–Q10, Q12–Q18, Q20–Q22), passed their plan/frame checks, and failed all items at composition on the same missing font file. Per-item stage and error details are preserved in `render-run-summary.json`.

No candidate SVG was produced. All new candidates remain `NOT_RENDERED`; browser visual review and student-screen verification remain `NOT_RUN`. Q17's existing official SVG is retained, but it does not show the ROOT-requested route through CD.

## Negative sample visual calibration

Rendered the pinned Bokseong q7 negative fixture only for review with the standalone Chromium SVG viewer. The labels claim A(−1/2,0) and B(0,−1) lie on a parabola, but the drawn curve does not pass through B. This reinforces that visual review must verify the curve primitives against the named coordinates. The fixture remains untouched and was not used as a candidate.
