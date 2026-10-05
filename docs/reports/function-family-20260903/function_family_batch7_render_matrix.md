# 함수·유리함수·무리함수 Batch 7 실제 렌더 매트릭스

- 배치: Batch 7
- 대상: 원본 10문항 / 8개 시험지
- 모드: production `archive/engine.html`, `mode=sol`, `preview=1`
- 확인 기준: 신규 SVG가 실제 DOM에 연결되고 `complete=true`, `naturalWidth>0`, `naturalHeight>0`; 전체 해설 SVG broken count 0; `data-ap-render-error` 없음; 시험지 데이터 로드 오류 없음
- 별도 수학 검증: `generate-pilot-graphs.py`의 case별 fact validator 10/10 PASS
- 원문 보호 검증: Batch 7 attachment ledger의 id/content/choices/answer/image hash parity 10/10 PASS

| 시험지 | 신규 문항 | 신규 SVG 실제 로드 | 크기 | broken solution image | render error | data load error |
|---|---|---|---|---:|---|---|
| 25 효천고 2학기 기말 | q12 | q12-solution.svg | 620×520 | 0 | 없음 | 없음 |
| 22 팔마고 2학기 기말 | q12 | q12-solution.svg | 600×500 | 0 | 없음 | 없음 |
| 22 제일고 2학기 기말 | q09 | q09-solution.svg | 600×500 | 0 | 없음 | 없음 |
| 22 순천여고 2학기 기말 | q07, q08 | q07/q08-solution.svg | 각 600×500 | 0 | 없음 | 없음 |
| 22 복성고 2학기 기말 | q07 | q07-solution.svg | 600×500 | 0 | 없음 | 없음 |
| 22 금당고 2학기 기말 | q01 | q01-solution.svg | 600×500 | 0 | 없음 | 없음 |
| 22 강남여고 2학기 기말 | q11 | q11-solution.svg | 600×500 | 0 | 없음 | 없음 |
| 25 순천고 2학기 기말 | q13, q14 | q13/q14-solution.svg | 각 600×500 | 0 | 없음 | 없음 |

## Batch 7 그래프 fact 요약

| 문항 | 그래프에 표시한 독립 사실 |
|---|---|
| 25 효천고 q12 | `a=-2`, `b=2`, 중심 `(-2,3)`, 대칭축 `y=x+5`, `y=-x+1` |
| 22 팔마고 q12 | `k=19/4`에서 `y=-√(x-5)`와 직선이 `T=(21/4,-1/2)`에서 접함 |
| 22 제일고 q09 | 대표값 `k=17/8`에서 두 교점, 일반 조건 `2≤k<9/4` |
| 22 순천여고 q07 | `k=3`일 때 `x=-1`, `y=-2` 점근선과 네 사분면 통과 |
| 22 순천여고 q08 | `k=8`일 때 판별식 `(k-1)(k-9)<0`, 두 그래프 불교점 |
| 22 복성고 q07 | 끝점 `(-3/2,2)`, 정의역 `x≥-3/2`, 치역 `y≤2`, 점 `(3,-1)` |
| 22 금당고 q01 | 점근선 `x=2`, `y=-1`, 따라서 `p+q=1` |
| 22 강남여고 q11 | 역함수와의 교점 `(1,1)`, `(2,2)`, 거리 `√2` |
| 25 순천고 q13 | 절편 `(-5,0)`, 점근선 `x=-3`, `y=1` |
| 25 순천고 q14 | `a=-1/4` 대표 그래프가 네 사분면을 통과, 일반 조건 `-1/2<a<0` |

## 판정

`BATCH7_RENDER_PASS_WITH_MATH_AND_PROTECTED_PARITY`: 실제 브라우저 해설 모드에서 8개 시험지의 10개 신규 SVG가 모두 표시·로드되었다. 이 매트릭스는 그래프의 교육적 필요성에 대한 최종 사용자 판정을 대신하지 않으며, 전체 522문항의 `SEALED` 선언도 의미하지 않는다.
