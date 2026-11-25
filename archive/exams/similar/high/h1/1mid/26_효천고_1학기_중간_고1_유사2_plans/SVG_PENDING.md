# 26_효천고_1학기_중간_고1_유사2 — SVG 후속 작업

- 운영 JS: `archive/exams/similar/high/h1/1mid/26_효천고_1학기_중간_고1_유사2.js`
- Git blob SHA-1: `efd1b30e6e60d7a60fbf4d1985c20cacae36a0ad`
- 문제용 필수 SVG: **0건** (26문항 모두 발문에 필수 좌표·수식·구간을 명시, EXEMPT)
- 해설용 SVG 계획: **2건** (Q18·Q26), 나머지 해설 24건 EXEMPT
- 공식 `plan-lint.cjs --shallow`: **PASS 2/2**
- 공식 SVG 엔진 렌더·PNG 육안 검증·학생 게시: **NOT_RUN**

| 문항 | 후속 상태 | 계획 | 렌더·시각 검수 |
| --- | --- | --- | --- |
| Q18 | SVG_TO_CREATE | q18-solution.plan.json — 포물선·평행선·교점 Q | NOT_RUN |
| Q26 | SVG_TO_CREATE | q26-solution.plan.json — 조각함수 경계·꼭짓점 | NOT_RUN |

학생용 JS에 존재하지 않는 `solutionImage`를 넣지 않았다. 후속 작업자는 공식 엔진 plan-lint(전체 모드) → 렌더 → PNG 육안 검수 → 검증 자산 링크를 순서대로 수행한다.

## 공식 SVG 엔진 제작·검수·JS 연결 완료 (2026-11-25)

- 전체 `plan-lint.cjs`(NotoSansKR.ttf 포함): **2/2 OK**
- 공식 `render-plan.mjs`: **2/2 ARCHIVE_BOUND**
- `assertSvgStudentLanguage`: **2/2 PASS**
- PNG 실물 육안 검수: **2/2 PASS**

| 문항 | 계획 JSON | 엔진 결과 | 크기/배율 | PNG 검수 | 연결된 JS `solutionImage` | 비고 |
| --- | --- | --- | --- | --- | --- | --- |
| Q18 | `q18-solution.plan.json` | `ARCHIVE_BOUND` | full (90%) | PASS | `assets/images/26_효천고_1학기_중간_고1_유사2/q18-solution.svg` | overlays.lines 이동 및 PANEL·pointNames 보강 후 PASS |
| Q26 | `q26-solution.plan.json` | `ARCHIVE_BOUND` | medium | PASS | `assets/images/26_효천고_1학기_중간_고1_유사2/q26-solution.svg` | y=2x-5·y=5/2x-5 직선 overlay 추가 후 PASS |
