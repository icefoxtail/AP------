# 함수·유리함수·무리함수 Batch 12 실제 렌더 매트릭스

- 배치: Batch 12
- 대상: 원본 10문항 / 8개 시험지
- 모드: production `archive/engine.html`, `mode=sol`, `preview=1`
- 확인 기준: 신규 SVG가 실제 DOM에 연결되고 `complete=true`, `naturalWidth>0`, `naturalHeight>0`; 전체 해설 SVG broken count 0; `data-ap-render-error` 없음; 시험지 데이터 로드 오류 없음
- 별도 수학 검증: `generate-pilot-graphs.py`의 case별 fact validator 10/10 PASS
- 원문 보호 검증: Batch 12 attachment ledger의 id/content/choices/answer/image hash parity 10/10 PASS

| 시험지 | 신규 문항 | 신규 SVG 실제 로드 | 크기 | broken solution image | render error | data load error |
|---|---|---|---|---:|---|---|
| 25 팔마고 2학기 기말 | q20 | q20-solution.svg | 620×500 | 0 | 없음 | 없음 |
| 25 순천고 2학기 기말 | q15 | q15-solution.svg | 620×520 | 0 | 없음 | 없음 |
| 25 효천고 2학기 기말 | q22 | q22-solution.svg | 620×500 | 0 | 없음 | 없음 |
| 22 팔마고 2학기 중간 | q12 | q12-solution.svg | 620×500 | 0 | 없음 | 없음 |
| 22 효천고 2학기 중간 | q22 | q22-solution.svg | 620×500 | 0 | 없음 | 없음 |
| 22 순천여고 2학기 중간 | q16, q17 | q16/q17-solution.svg | 620×520, 620×500 | 0 | 없음 | 없음 |
| 22 금당고 2학기 중간 | q11 | q11-solution.svg | 620×500 | 0 | 없음 | 없음 |
| 21 효천고 2학기 기말 | q12, q13 | q12/q13-solution.svg | 620×500, 620×520 | 0 | 없음 | 없음 |

## Batch 12 그래프 fact 요약

| 문항 | 그래프에 표시한 독립 사실 |
|---|---|
| 25 팔마고 q20 | `f=−(x−2)²+4`, 정의역 `x≤0`, 끝점 `(0,0)`, `k=0` |
| 25 순천고 q15 | `a=12`, 이차함수·역함수의 고정점 `(4,4)`, `(6,6)` |
| 25 효천고 q22 | `y=1/(x+2)−1`, `x<−2`, 점 `(-3,-2)`와 수선 길이 합 5 |
| 22 팔마고 2학기 중간 q12 | 함수·역함수와 `y=x`의 교점·분기점, 넓이 5 |
| 22 효천고 2학기 중간 q22 | 절댓값함수 네 선분과 `y=x/3+5`, `g(5)=0` |
| 22 순천여고 2학기 중간 q16 | 조각함수와 역함수, `f⁻¹(8)=3`, `f⁻¹(2)=−1` |
| 22 순천여고 2학기 중간 q17 | 합성함수의 구간 최솟값 5, `a=−2` |
| 22 금당고 2학기 중간 q11 | `t²−7t`, 근 `−4`, `3`, `10` |
| 21 효천고 q12 | `|√(|x|+4)−4|=2`의 세 교점 `−32`, `0`, `32` |
| 21 효천고 q13 | 조각 무리함수·직선과 `A=(-4,-8)`, `O`, `B=(8,-4)`, 넓이 40 |

## 판정

`BATCH12_RENDER_PASS_WITH_MATH_AND_PROTECTED_PARITY`: 실제 브라우저 해설 모드에서 8개 시험지의 10개 신규 SVG가 모두 표시·로드되었다. 이 매트릭스는 그래프의 교육적 필요성에 대한 최종 사용자 판정을 대신하지 않으며, 전체 522문항의 `SEALED` 선언도 의미하지 않는다.
