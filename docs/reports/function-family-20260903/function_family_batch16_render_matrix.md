# 함수·유리함수·무리함수 Batch 16 실제 렌더 매트릭스

- 배치: Batch 16
- 대상: 원본 7문항 / 4개 시험지
- 해설 모드: production `archive/engine.html`, `mode=sol`, `preview=1`
- 회귀 모드: 같은 원문을 `mode=exam` 및 `mode=ans`로 다시 로드
- 확인 기준: 신규 SVG가 실제 DOM에 연결되고 `complete=true`, `naturalWidth>0`, `naturalHeight>0`; 전체 해설 SVG broken count 0; `data-ap-render-error` 없음; 시험지 데이터 로드 오류 없음
- 원문 보호 검증: Batch 16 attachment ledger의 id/content/choices/answer/image hash parity 7/7 PASS

| 시험지 | 신규 문항 | 신규 SVG 실제 로드 | 크기 | solution broken image | exam 렌더 | answer 렌더 | render/data 오류 |
|---|---|---|---|---:|---|---|---|
| 21 강남여고 2학기 기말 | q12, q13, q22, q27 | q12/q13/q22/q27-solution.svg | q12 620×520; q13/q22/q27 620×500 | 0 | 8 pages PASS | 1 page PASS | 없음 |
| 21 복성고 2학기 기말 | q10 | q10-solution.svg | 620×500 | 0 | 6 pages PASS | 1 page PASS | 없음 |
| 21 순천고 2학기 기말 | q10 | q10-solution.svg | 620×500 | 0 | 6 pages PASS | 1 page PASS | 없음 |
| 22 매산고 2학기 기말 | q12 | q12-solution.svg | 620×500 | 0 | 5 pages PASS | 1 page PASS | 없음 |

## Batch 16 그래프 fact 요약

| 문항 | 그래프에 표시한 독립 사실 |
|---|---|
| 21 강남여고 q12 | `y=4/x`, `y=4/(x+1)` 및 `x=n (n=1,…,5)` 수직 선분과 망원합에 필요한 함수값 차 |
| 21 강남여고 q13 | 대표식 `y=√(−2x+6)−1`, 정의역 `x≤3`, 끝점 `(3,−1)`, x절편 `(5/2,0)` |
| 21 강남여고 q22 | 역함수 `g=2+1/(x−1)`, 수직점근선 `x=1`, 수평점근선 `y=2`, `g(0)=1` |
| 21 강남여고 q27 | `g=√(−2x)−1`, 정의역 `x≤0`, 끝점 `(0,−1)`, 제2·제3사분면 통과 |
| 21 복성고 q10 | `y=(−3x+3)/(x−2)=−3−3/(x−2)`, 점근선 `x=2`, `y=−3`, x절편 `(1,0)` |
| 21 순천고 q10 | `y=√(−6x+36)−4`, 정의역 `x≤6`, 끝점 `(6,−4)`, y절편 `(0,2)`, x절편 `(10/3,0)` |
| 22 매산고 q12 | `y=x` 대칭, 대응점 `A=(2,3)↔B=(3,2)`, `C=(2,−4)↔D=(−4,2)` |

## 판정

`BATCH16_RENDER_PASS`: 7개 신규 SVG의 실제 DOM 이미지 로드가 모두 성공했고, four source exams의 시험지·해설지·정답표 렌더 경로에서 data load error와 render error가 없었다. 그래프 수학 사실·교육적 필요성에 대한 최종 독립 재검수와 전체 단원 `SEALED` 판정은 별도 단계로 남긴다.
