# 조대부고 2023·2024 수학II 핀포인트 수정 후 브라우저 검수

검수일: 2026-09-06 (Asia/Seoul)
엔진: `archive/engine.html`, local HTTP server `http://127.0.0.1:8766`
기준: current `origin/main` `ed074fde0a5a3476c0764525ce670e9a1177ad07`; target diff from user reference `ce6c8ade8e020e11d8593f803359e7664ff713b6` was zero.

| 시험지 | mode | expected count | observed count | pages | solution/source image decode | horizontal overflow | empty boxes | status |
|---|---|---:|---:|---:|---:|---|---:|---|
| 2023 조대부고 | exam | 23 q-box | 23 | 6 | 3/3 PNG | 없음 | 0 | PASS |
| 2023 조대부고 | sol | 23 q-box | 23 | 8 | 4/4 SVG | 없음 | 0 | PASS |
| 2023 조대부고 | ans | 23 ans-n | 23 | 1 | 해당 없음 | 없음 | 0 | PASS |
| 2024 조대부고 | exam | 23 q-box | 23 | 6 | 4/4 PNG | 없음 | 0 | PASS |
| 2024 조대부고 | sol | 23 q-box | 23 | 10 | 10/10 SVG (q20 포함) | 없음 | 0 | PASS |
| 2024 조대부고 | ans | 23 ans-n | 23 | 1 | 해당 없음 | 없음 | 0 | PASS |

후반/마지막 문항: 2023 q23 및 2024 q23의 해설 결론이 실제 화면에 표시됨. 2024 q17의 경우분류와 `t=1` 연속성 설명, 2024 q20 증감표 SVG도 실제 `sol` 화면에서 표시됨. MathJax 수식은 46문항 모두 typeset되어 미렌더 수식이 없었고, 신설·수정 SVG/PNG의 `naturalWidth`는 모두 양수였다.

## 정적·좌표 검수 분리

- `coordinate-parity-summary.json`: 기존 13개 SVG, EXPECTED FACT 46건, OBSERVED FACT 46건, parity 46/46 PASS.
- `svg-self-check.json`: 기존 13개 + q20 보조표 SVG 총 14개 XML/static PASS.
- 브라우저에 보인다는 사실만으로 SVG 수학 PASS를 선언하지 않았으며, 위 coordinate parity 결과를 별도로 확인했다.

## 재현 명령

```powershell
npm --prefix archive/tools/past-exam-pipeline run check
node --check archive/exams/original/high/h2/2mid/23_조대부고_2학기_중간_고2_수학II.js
node --check archive/exams/original/high/h2/2mid/24_조대부고_2학기_중간_고2_수학II.js
node archive/tools/audit-latex-escapes.mjs --repo .
node archive/tools/build-question-index.mjs
node archive/tools/geometry-equation/verify-svg-coordinate-parity.mjs --root . --input <input.json> --out <evidence.json>
```

전역 LaTeX 감사는 대상 파일이 아닌 기존 2개 파일의 결함 때문에 `ok:false`이다. 자세한 내용은 `global-latex-audit.json`에 보존했다. 대상 두 JS의 `node --check`와 대상 범위 LaTeX/문자열 검사는 PASS다.
