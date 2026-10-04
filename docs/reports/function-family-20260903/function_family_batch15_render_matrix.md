# 함수·유리함수·무리함수 Batch 15 실제 렌더 매트릭스

- 배치: Batch 15
- 대상: 원본 1문항 / 1개 시험지
- 모드: production `archive/engine.html`, `mode=sol`, `preview=1`
- 확인 기준: 신규 SVG가 실제 DOM에 연결되고 `complete=true`, `naturalWidth>0`, `naturalHeight>0`; 전체 해설 SVG broken count 0; `data-ap-render-error` 없음; 시험지 데이터 로드 오류 없음
- 수학·출처 확인: 보기 ①이 `11/4`이고 해설 계산도 `11/4`임을 대조해 기존 source-review 의심을 해소
- 원문 보호 검증: Batch 15 attachment ledger의 id/content/choices/answer/image hash parity 1/1 PASS

| 시험지 | 신규 문항 | 신규 SVG 실제 로드 | 크기 | broken solution image | render error | data load error |
|---|---|---|---|---:|---|---|
| 25 제일고 2학기 기말 | q18 | q18-solution.svg | 620×500 | 0 | 없음 | 없음 |

## Batch 15 그래프 fact 요약

| 문항 | 그래프에 표시한 독립 사실 |
|---|---|
| 25 제일고 q18 | `(g∘f)(x)=2−x`, `2x−1`, `−4x+8`의 세 구간과 좌표축 넓이 `11/4` |

## 판정

`BATCH15_RENDER_PASS_WITH_SOURCE_REVIEW_RESOLUTION`: 실제 브라우저 해설 모드에서 q18 신규 SVG가 표시·로드되었고, 원문 choices의 ①=`11/4` 대조로 answer/solution 불일치 의심을 해소했다. 이 결과는 다른 문항의 독립 triage 완료나 전체 522문항의 `SEALED` 선언을 의미하지 않는다.
