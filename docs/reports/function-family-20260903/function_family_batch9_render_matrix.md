# 함수·유리함수·무리함수 Batch 9 실제 렌더 매트릭스

- 배치: Batch 9
- 대상: 원본 10문항 / 9개 시험지
- 모드: production `archive/engine.html`, `mode=sol`, `preview=1`
- 확인 기준: 신규 SVG가 실제 DOM에 연결되고 `complete=true`, `naturalWidth>0`, `naturalHeight>0`; 전체 해설 SVG broken count 0; `data-ap-render-error` 없음; 시험지 데이터 로드 오류 없음
- 별도 수학 검증: `generate-pilot-graphs.py`의 case별 fact validator 10/10 PASS
- 원문 보호 검증: Batch 9 attachment ledger의 id/content/choices/answer/image hash parity 10/10 PASS

| 시험지 | 신규 문항 | 신규 SVG 실제 로드 | 크기 | broken solution image | render error | data load error |
|---|---|---|---|---:|---|---|
| 21 강남여고 2학기 기말 | q14 | q14-solution.svg | 620×520 | 0 | 없음 | 없음 |
| 21 복성고 2학기 기말 | q22 | q22-solution.svg | 620×520 | 0 | 없음 | 없음 |
| 22 강남여고 2학기 기말 | q18 | q18-solution.svg | 620×500 | 0 | 없음 | 없음 |
| 22 매산고 2학기 기말 | q19 | q19-solution.svg | 620×520 | 0 | 없음 | 없음 |
| 22 효천고 2학기 기말 | q04, q05, q15 | q04/q05/q15-solution.svg | 각 620×520 | 0 | 없음 | 없음 |
| 22 팔마고 2학기 기말 | q16 | q16-solution.svg | 620×500 | 0 | 없음 | 없음 |
| 23 금당고 2학기 기말 | q08 | q08-solution.svg | 620×500 | 0 | 없음 | 없음 |
| 21 순천고 2학기 기말 | q09 | q09-solution.svg | 620×500 | 0 | 없음 | 없음 |

## Batch 9 그래프 fact 요약

| 문항 | 그래프에 표시한 독립 사실 |
|---|---|
| 21 강남여고 q14 | `f(x)=−x+6`, 변환식 `y=−1+7/(x−4)`, 점근선 `x=4`, `y=−1` |
| 21 복성고 q22 | `y=√x`, `y=3√x`, `t=1`에서 `A=(1,3)`, `B=(1,1)`, `C=(9,3)`, 넓이 8 |
| 22 강남여고 q18 | `Pₖ=(k,√(k+1))`, `Qₖ=(k,√k)`, 세로 차의 망원합 |
| 22 매산고 q19 | `y=−5/x`, `y=x+6`, 교점 `(-5,1)`, `(-1,5)`, 넓이 12 |
| 22 효천고 q04 | 중심 `(1,−5)`, 대칭축 `y=x−6`, `y=−x−4` |
| 22 효천고 q05 | 역함수 점 `(5,3)` ↔ 원래 함수 점 `(3,5)`, `a=22` |
| 22 효천고 q15 | `k=1/3` 대표값에서 두 유리함수의 사분면 조건 확인 |
| 22 팔마고 q16 | `f=√(x+2)+5`, `g=√(2−x)−5`, 대칭 초과분 상쇄, 넓이 40 |
| 23 금당고 q08 | 이차함수와 역함수의 교점 `(1/2,1/2)`, `(3/2,3/2)`, 거리 `√2` |
| 21 순천고 q09 | `a=1`과 `a=−1`에서 `y=−√(ax)`의 정의역·사분면 비교 |

## 판정

`BATCH9_RENDER_PASS_WITH_MATH_AND_PROTECTED_PARITY`: 실제 브라우저 해설 모드에서 9개 시험지의 10개 신규 SVG가 모두 표시·로드되었다. 이 매트릭스는 그래프의 교육적 필요성에 대한 최종 사용자 판정을 대신하지 않으며, 전체 522문항의 `SEALED` 선언도 의미하지 않는다.
