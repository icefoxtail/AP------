# 함수·유리함수·무리함수 Batch 8 실제 렌더 매트릭스

- 배치: Batch 8
- 대상: 원본 10문항 / 8개 시험지
- 해설 모드: production `archive/engine.html`, `mode=sol`, `preview=1`
- 회귀 모드: 같은 8개 시험지의 `mode=exam`, `mode=ans`, `preview=1`
- 확인 기준: 신규 SVG가 실제 DOM에 연결되고 `complete=true`, `naturalWidth>0`, `naturalHeight>0`; 각 모드의 broken image 0; `data-ap-render-error` 없음; 시험지 데이터 로드 오류 없음
- 별도 수학 검증: `generate-pilot-graphs.py`의 case별 fact validator 10/10 PASS
- 원문 보호 검증: Batch 8 attachment ledger의 id/content/choices/answer/image hash parity 10/10 PASS

| 시험지 | 신규 문항 | 해설 SVG | exam 회귀 | answer 회귀 | 신규 SVG 크기 | broken image / render error / data error |
|---|---|---|---|---|---|---|
| 21 강남여고 2학기 기말 | q16, q28 | 2개 실제 로드 | PASS | PASS | 620×520, 620×500 | 0 / 없음 / 없음 |
| 21 순천고 2학기 기말 | q02 | 1개 실제 로드 | PASS | PASS | 620×520 | 0 / 없음 / 없음 |
| 21 복성고 2학기 기말 | q11 | 1개 실제 로드 | PASS | PASS | 620×500 | 0 / 없음 / 없음 |
| 21 팔마고 2학기 기말 | q20 | 1개 실제 로드 | PASS | PASS | 620×500 | 0 / 없음 / 없음 |
| 22 강남여고 2학기 기말 | q15, q22 | 2개 실제 로드 | PASS | PASS | 각 620×520 | 0 / 없음 / 없음 |
| 22 매산고 2학기 기말 | q03 | 1개 실제 로드 | PASS | PASS | 620×500 | 0 / 없음 / 없음 |
| 22 효천고 2학기 기말 | q18 | 1개 실제 로드 | PASS | PASS | 620×500 | 0 / 없음 / 없음 |
| 22 팔마고 2학기 기말 | q08 | 1개 실제 로드 | PASS | PASS | 620×520 | 0 / 없음 / 없음 |

## Batch 8 그래프 fact 요약

| 문항 | 그래프에 표시한 독립 사실 |
|---|---|
| 21 강남여고 q16 | 렌즈식 `y=4+16/(x−4)`, 점근선 `x=4`, `y=4` |
| 21 강남여고 q28 | `f=−2/(x+4)−3`의 구간 `[-3,6]`, `m=-5`, `M=-16/5` |
| 21 순천고 q02 | `y=3+8/(x−2)`, 점근선 `x=2`, `y=3` |
| 21 복성고 q11 | `y=√(4−2x)`와 `y=−x+9/4`의 두 교점, `2≤k<5/2` |
| 21 팔마고 q20 | `y=√(4x−8)`와 `y=x−1`의 접점 `(3,2)` |
| 22 강남여고 q15 | `y=1+1/(x−2)`, 중심 `(2,1)`, 대칭축 `y=x−1`, `y=−x+3` |
| 22 강남여고 q22 | `f=√(2x+16)−4`, `f⁻¹=x²/2+4x`, 역함수 정의역 `x≥−4` |
| 22 매산고 q03 | 끝점 `(3,3)`, 정의역 `x≥3`, 치역 `y≤3` |
| 22 효천고 q18 | 끝점 `(3,−1)`, 정의역 `x≤3`, 치역 `y≥−1` |
| 22 팔마고 q08 | `y=(x+1)/(x−1)`와 `y=x`의 두 교점, 최솟거리 `4` |

## 판정

`BATCH8_RENDER_PASS_WITH_MATH_PROTECTED_AND_REGRESSION_PARITY`: 실제 브라우저에서 8개 시험지의 신규 SVG 10개를 해설 모드로 확인했고, 같은 8개 시험지의 시험지·정답표 모드 회귀도 모두 오류 없이 확인했다. 이 매트릭스는 그래프의 교육적 필요성에 대한 최종 사용자 판정을 대신하지 않으며, 전체 522문항의 `SEALED` 선언도 의미하지 않는다.
