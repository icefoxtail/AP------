# AP Galaxy visual review evidence

These captures show the same AP Galaxy prototype before and after the close-up star and small-galaxy rendering changes.

## Capture conditions

- Browser: headed Playwright Chrome session with WebGL enabled.
- Viewport and canvas: 1600 × 900 CSS pixels, device pixel ratio 1.
- Close-up pair: focused on the same school group, 삼산중, then zoomed in with the mouse wheel.
- Full-scene pair: school view with orbital motion paused.
- Motion clip: focused scene with orbital motion resumed, followed by a drag rotation and wheel zoom.
- Label comparison: `labels-before-*` shows the PR branch before the two-line exam labels; `labels-after-*` shows the update at the same viewport. The close-up pair uses 삼산중 and distinguishes its 2026 first-term midterm, first-term final, and second-term midterm.

## Label-only screenshots

- `labels-before-full.png` and `labels-after-full.png`: label readability across the full school view.
- `labels-before-close.png` and `labels-after-close.png`: same-school, same-year exams in the focused close-up.
- `labels-click-result.png`: clicking `2026 · 1학기 중간` opens the matching original `1mid` exam in the existing drawer and preview.

The first line uses the catalog's `year`, `semester`, and `examType` fields; the second uses `school`, `grade`, and `subject`. Known `mid`/`final` values are translated, unknown non-empty enum values remain literal, and missing values are omitted. If the subject already starts with the catalog grade, that repeated prefix is shown once.

## Performance sample

A four-second WebGL `clear` call count was sampled while the camera was focused and orbital motion was running at 1600 × 900, DPR 1. The latest-main bundle produced 93 calls over 4007 ms (23.2 calls/s); this branch produced 95 over 4006 ms (23.7 calls/s). The context reported `WebKit WebGL`. These are environment-specific observations, not performance guarantees.

## Files

- `before-full.png` and `after-full.png`: full scene.
- `before-close.png` and `after-close.png`: focused close-up.
- `ap-galaxy-motion.webm`: short motion and interaction clip.
