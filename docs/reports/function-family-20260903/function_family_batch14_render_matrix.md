# 함수·유리함수·무리함수 Batch 14 실제 렌더 매트릭스

- 배치: Batch 14
- 대상: 원본 7문항 / 6개 시험지
- 모드: production `archive/engine.html`, `mode=sol`, `preview=1`
- 확인 기준: 신규 SVG가 실제 DOM에 연결되고 `complete=true`, `naturalWidth>0`, `naturalHeight>0`; 전체 해설 SVG broken count 0; `data-ap-render-error` 없음; 시험지 데이터 로드 오류 없음
- 별도 수학 검증: `generate-pilot-graphs.py`의 case별 fact validator 7/7 PASS
- 원문 보호 검증: Batch 14 attachment ledger의 id/content/choices/answer/image hash parity 7/7 PASS; 중간 재실행 대상 6건은 기대 assetRef 일치 후 `ALREADY_ATTACHED`로 기록

| 시험지 | 신규 문항 | 신규 SVG 실제 로드 | 크기 | broken solution image | render error | data load error |
|---|---|---|---|---:|---|---|
| 23 매산여고 2학기 기말 | q09 | q09-solution.svg | 620×500 | 0 | 없음 | 없음 |
| 24 제일고 2학기 기말 | q12, q13 | q12/q13-solution.svg | 각 620×500 | 0 | 없음 | 없음 |
| 22 효천고 2학기 기말 | q16 | q16-solution.svg | 620×520 | 0 | 없음 | 없음 |
| 22 금당고 2학기 기말 | q17 | q17-solution.svg | 620×500 | 0 | 없음 | 없음 |
| 23 강남여고 2학기 기말 | q20, q22 | q20/q22-solution.svg | 620×520, 620×500 | 0 | 없음 | 없음 |
| 24 금당고 2학기 기말 | q14 | q14-solution.svg | 620×500 | 0 | 없음 | 없음 |

## Batch 14 그래프 fact 요약

| 문항 | 그래프에 표시한 독립 사실 |
|---|---|
| 23 매산여고 q09 | `y=√(x+3)`, `y=−2x/(x+3)`, `0≤x≤10`의 정수 격자 영역 |
| 24 제일고 q12 | 끝점 `(-2,1)`, x절편 `(-3/2,0)`, 정의역·치역 |
| 24 제일고 q13 | `k=4` 대표 유리함수 `4−5/(x+3)`와 제4사분면 조건 |
| 22 효천고 q16 | `k=31`에서 `f=√(31−x)`, 역함수 `31−x²`, 삼각형 ABC |
| 22 금당고 q17 | 대표 `t=0`에서 `y=2x/(x−1)`과 `y=√x`의 두 교점 |
| 23 강남여고 q20 | `f=6/x`, `g=6/(x−2)`, `t=6`의 사각 영역 넓이 8 |
| 23 강남여고 q22 | `g=√(3x)−2`, `3≤x≤27`의 최솟값 1·최댓값 7 |
| 24 금당고 q14 | 조각 곡선과 직선의 교점 `(-4,2)`, `(0,0)`, `(2,4)`, 넓이 10 |

## 판정

`BATCH14_RENDER_PASS_WITH_MATH_AND_PROTECTED_PARITY`: 실제 브라우저 해설 모드에서 6개 시험지의 7개 신규 SVG가 모두 표시·로드되었다. 이 매트릭스는 그래프의 교육적 필요성에 대한 최종 사용자 판정을 대신하지 않으며, 전체 522문항의 `SEALED` 선언도 의미하지 않는다.
