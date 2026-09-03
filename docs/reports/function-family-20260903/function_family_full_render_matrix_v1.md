# 함수·유리함수·무리함수 전체 브라우저 렌더 매트릭스

- 상태: **FULL_BROWSER_RENDER_PASS**
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

각 mode worker는 question-index에서 현재 target key에 해당하는 고유 source JS 50개를 읽어 순차 처리했고, 각 worker의 50개 케이스가 모두 PASS되어 총 150/150으로 종료됐다. 이 결과는 시각적 의미·교육적 적절성에 대한 사용자의 최종 재검수와 release SHA seal을 대신하지 않는다.
