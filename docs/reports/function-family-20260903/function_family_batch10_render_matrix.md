# 함수·유리함수·무리함수 Batch 10 실제 렌더 매트릭스

- 배치: Batch 10
- 대상: 원본 10문항 / 8개 시험지
- 모드: production `archive/engine.html`, `mode=sol`, `preview=1`
- 확인 기준: 신규 SVG가 실제 DOM에 연결되고 `complete=true`, `naturalWidth>0`, `naturalHeight>0`; 전체 해설 SVG broken count 0; `data-ap-render-error` 없음; 시험지 데이터 로드 오류 없음
- 별도 수학 검증: `generate-pilot-graphs.py`의 case별 fact validator 10/10 PASS
- 원문 보호 검증: Batch 10 attachment ledger의 id/content/choices/answer/image hash parity 10/10 PASS

| 시험지 | 신규 문항 | 신규 SVG 실제 로드 | 크기 | broken solution image | render error | data load error |
|---|---|---|---|---:|---|---|
| 21 금당고 2학기 기말 | q22 | q22-solution.svg | 620×520 | 0 | 없음 | 없음 |
| 22 금당고 2학기 기말 | q09 | q09-solution.svg | 620×500 | 0 | 없음 | 없음 |
| 22 제일고 2학기 기말 | q02, q22 | q02/q22-solution.svg | 각 620×500 | 0 | 없음 | 없음 |
| 22 복성고 2학기 기말 | q15 | q15-solution.svg | 620×500 | 0 | 없음 | 없음 |
| 22 순천여고 2학기 기말 | q20 | q20-solution.svg | 620×520 | 0 | 없음 | 없음 |
| 24 제일고 2학기 중간 | q15, q16, q17 | q15/q16/q17-solution.svg | 620×500, 620×500, 620×520 | 0 | 없음 | 없음 |
| 22 팔마고 2학기 기말 | q06 | q06-solution.svg | 620×500 | 0 | 없음 | 없음 |

## Batch 10 그래프 fact 요약

| 문항 | 그래프에 표시한 독립 사실 |
|---|---|
| 21 금당고 q22 | `y=20/x`, `y=−45/x`, 대표점 `A=(2,10)`, `B=(3,−15)`, 최소 넓이 30 |
| 22 금당고 q09 | `f=3+2/(x−2)`, 중심 `(2,3)`, `f(3)=5`, 대칭 합 조건 |
| 22 제일고 q02 | `y=3+5/(x−2)`, 점근선 `x=2`, `y=3`, x절편 `1/3` |
| 22 제일고 q22 | `y=−√x`, `y=−√(x+2)`의 같은 x에서 세로 차와 망원합 |
| 22 복성고 q15 | `k=4` 대표 그래프와 네 사분면 조건 `k>3` |
| 22 순천여고 q20 | `y=1/(x−1)`, `y=−x`, `a=2`에서 `P,Q,R`와 최소 넓이 `9/2` |
| 24 제일고 q15 | 이동·대칭 후 `y=√(−2x−2)−1`, 점 `(-9,3)`, 끝점 `(-1,-1)` |
| 24 제일고 q16 | `y=−2−3/(x−3)`, 점근선 `x=3`, `y=−2`, 평행이동 구조 |
| 24 제일고 q17 | `y=3+8/(x−1)`, 양의 기울기 대칭축 `y=x+2`, 두 교점 거리 8 |
| 22 팔마고 q06 | `f=(x−1)/(x+1)`, 중심 `(-1,1)`, `f(2)=1/3` |

## 판정

`BATCH10_RENDER_PASS_WITH_MATH_AND_PROTECTED_PARITY`: 실제 브라우저 해설 모드에서 8개 시험지의 10개 신규 SVG가 모두 표시·로드되었다. 이 매트릭스는 그래프의 교육적 필요성에 대한 최종 사용자 판정을 대신하지 않으며, 전체 522문항의 `SEALED` 선언도 의미하지 않는다.
