# 함수·유리함수·무리함수 Batch 13 실제 렌더 매트릭스

- 배치: Batch 13
- 대상: 원본 9문항 / 7개 시험지
- 모드: production `archive/engine.html`, `mode=sol`, `preview=1`
- 확인 기준: 신규 SVG가 실제 DOM에 연결되고 `complete=true`, `naturalWidth>0`, `naturalHeight>0`; 전체 해설 SVG broken count 0; `data-ap-render-error` 없음; 시험지 데이터 로드 오류 없음
- 별도 수학 검증: `generate-pilot-graphs.py`의 case별 fact validator 9/9 PASS
- 원문 보호 검증: Batch 13 attachment ledger의 id/content/choices/answer/image hash parity 9/9 PASS

| 시험지 | 신규 문항 | 신규 SVG 실제 로드 | 크기 | broken solution image | render error | data load error |
|---|---|---|---|---:|---|---|
| 22 효천고 2학기 기말 | q22 | q22-solution.svg | 620×520 | 0 | 없음 | 없음 |
| 23 금당고 2학기 기말 | q11, q13 | q11/q13-solution.svg | 각 620×500 | 0 | 없음 | 없음 |
| 23 강남여고 2학기 기말 | q19 | q19-solution.svg | 620×500 | 0 | 없음 | 없음 |
| 24 제일고 2학기 기말 | q11 | q11-solution.svg | 620×520 | 0 | 없음 | 없음 |
| 24 매산여고 2학기 기말 | q06, q22 | q06/q22-solution.svg | 620×500, 620×520 | 0 | 없음 | 없음 |
| 24 금당고 2학기 기말 | q14 | q14-solution.svg | 620×500 | 0 | 없음 | 없음 |
| 23 매산여고 2학기 기말 | q22 | q22-solution.svg | 620×500 | 0 | 없음 | 없음 |

## Batch 13 그래프 fact 요약

| 문항 | 그래프에 표시한 독립 사실 |
|---|---|
| 22 효천고 q22 | `f=2+3/(x−2)`, 자기역함수, 중심 `(2,2)`, 고정점과 대칭축 |
| 23 금당고 q11 | 중심 `(2,3)`, 구간 `[0,1]` 최댓값 2, `f(4)=4` |
| 23 금당고 q13 | 역함수 `1−x/3`, 절편 `(0,1)`, `(3,0)`, 축 넓이 |
| 23 강남여고 q19 | `f=2√(x+1)`, 접선 `y=2x+5/2`, 접점 `(-3/4,1)`, 넓이 `1/4` |
| 24 제일고 q11 | 중심 `(2,3)`, 대칭축 `y=x+1`, `y=−x+5`, 역함수 대응점 |
| 24 매산여고 q22 | 대표 `k=7`의 두 유리함수와 허용 정수 `5≤k≤9` |
| 24 매산여고 q06 | 구간 `[5,8]`의 유리함수·무리함수 한 교점, `k_min=−11/2` |
| 24 금당고 q14 | 조각 곡선과 직선의 교점 `(-4,2)`, `(0,0)`, `(2,4)`, 넓이 10 |
| 23 매산여고 q22 | `g=√(1−x)+2`, 역함수 `1−(x−2)²`, 정의역·치역 |

## 판정

`BATCH13_RENDER_PASS_WITH_MATH_AND_PROTECTED_PARITY`: 실제 브라우저 해설 모드에서 7개 시험지의 9개 신규 SVG가 모두 표시·로드되었다. 이 매트릭스는 그래프의 교육적 필요성에 대한 최종 사용자 판정을 대신하지 않으며, 전체 522문항의 `SEALED` 선언도 의미하지 않는다.
