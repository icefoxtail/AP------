# 함수·유리함수·무리함수 전체 REAL RENDER 매트릭스 v2

- 상태: **FULL_BROWSER_RENDER_PASS**
- 기준: dense SVG 재생성 및 `24_제일고 2학기 중간 q15–q17` semantic repair 이후
- 브라우저: Chrome via Codex computer-use extension
- harness: `archive/tools/function-family/full-render-harness.html`
- 범위: 원본 50개 시험지
- 모드: `exam`, `sol`, `ans`
- 전체 조합: 150개
- PASS: 150개
- FAIL: 0개

| 모드 | 대상 시험지 | 관측 | PASS | FAIL |
|---|---:|---:|---:|---:|
| `exam` | 50 | 50 | 50 | 0 |
| `sol` | 50 | 50 | 50 | 0 |
| `ans` | 50 | 50 | 50 | 0 |
| 합계 | 150 | 150 | 150 | 0 |

## 케이스별 공통 게이트

- `print-area`에 `.page`가 1개 이상 생성됨
- 렌더된 내용이 비어 있지 않음
- `print-area` 내부 모든 이미지가 `complete=true`, `naturalWidth>0`
- `documentElement[data-ap-render-error]` 없음
- 시험지 데이터 로드 오류 문구 없음

각 mode worker는 question-index에서 원본 target의 고유 source JS 50개를 읽어 순차 처리했다. dense 재생성본·수정 q15–q17을 포함한 fresh browser 실행이 150/150으로 종료됐다. 이 결과는 브라우저 runtime/layout gate이며, 그래프의 수학적 의미 판정은 `function_family_independent_math_review_v2`와 2차 visual review에서 별도 확인한다.
