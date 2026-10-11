# AP Galaxy star-only follow-up — same-environment review

- Baseline: d7c008eec8c25e2f3e31d59428d9b5c055dd11b3 (PR #390 before star-only follow-up)
- Updated: 7fa9b2457ec5a6826a16a1ca44501e37d94f08ca
- Chromium Playwright headless with software WebGL (SwiftShader), 1600×900 CSS px, DPR 1.
- Full shot: school view with reduced motion. Close-up: search 삼산중 → canvas pick → wheel -650 → settle 1000 ms; same steps for each version.
- WebGL clear-call samples: 3 × 3 seconds each, orbital motion enabled at focused close-up; calls/s are a frame proxy, not a GPU profiler result.
- Before: 4.66, 4, 4 FPS-equivalent (median 4).
- After: 5.33, 5, 5 FPS-equivalent (median 5).
- Observed median delta: 25.0%. The earlier 23 FPS from another environment is not compared.
- Drawer: selection switch and close PASS; checked engine.html?data=exams/... URL and iframe state. Actual exam/solution/print NOT_TESTED (iframe smoke stub).
- School/grade/unit switching: PASS. Browser page errors: none on sampled scene and stubbed route.
- Files: star-v2-before-full.png, star-v2-after-full.png, star-v2-before-close.png, star-v2-after-close.png, star-v2-after-selection.png, star-v2-motion.webm.
