# H2 수학I·대수 browser render check

- 실제 엔진: `archive/engine.html`
- 캡처 도구: `playwright-cli`
- cases: 72/72
- PASS: 72, FAIL: 0
- desktop/mobile: PASS
- clipping: PASS
- overflow: PASS
- image decode: PASS
- representative visual review: PASS (q9 blurry-source reconstruction, q2 ADD tangent, q23 REBUILD geometry)

캡처 matrix와 대표 검수 이미지는 `browser_render_capture_matrix.json`, `browser_render_review.json` 및 `output/playwright/h2-s1-algebra/render-capture/`에 보존한다.

origin/main 동기화 후 변경된 3개 source(q21/q13/q24)는 `browser_render_refresh_20260909.json`으로 exam/solution/answer × desktop/mobile 18/18 재검수했다. 효천고 q24의 source-only LaTeX 표기 오탈 수정 후 6/6은 이미 다시 캡처했고, MathJax 오류 0건을 확인했다.
