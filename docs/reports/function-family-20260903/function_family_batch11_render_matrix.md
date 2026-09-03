# 함수·유리함수·무리함수 Batch 11 실제 렌더 매트릭스

- 배치: Batch 11
- 대상: 원본 9문항 / 7개 시험지
- 모드: production `archive/engine.html`, `mode=sol`, `preview=1`
- 확인 기준: 신규 SVG가 실제 DOM에 연결되고 `complete=true`, `naturalWidth>0`, `naturalHeight>0`; 전체 해설 SVG broken count 0; `data-ap-render-error` 없음; 시험지 데이터 로드 오류 없음
- 별도 수학 검증: `generate-pilot-graphs.py`의 case별 fact validator 9/9 PASS
- 원문 보호 검증: Batch 11 attachment ledger의 id/content/choices/answer/image hash parity 9/9 PASS

| 시험지 | 신규 문항 | 신규 SVG 실제 로드 | 크기 | broken solution image | render error | data load error |
|---|---|---|---|---:|---|---|
| 22 금당고 2학기 기말 | q08 | q08-solution.svg | 620×500 | 0 | 없음 | 없음 |
| 22 매산고 2학기 기말 | q07, q08 | q07/q08-solution.svg | 각 620×500 | 0 | 없음 | 없음 |
| 22 순천여고 2학기 기말 | q14, q17, q21 | q14/q17/q21-solution.svg | 각 620×500 | 0 | 없음 | 없음 |
| 22 복성고 2학기 기말 | q12, q21 | q12/q21-solution.svg | 각 620×520 | 0 | 없음 | 없음 |
| 22 팔마고 2학기 중간 | q22 | q22-solution.svg | 620×520 | 0 | 없음 | 없음 |

## Batch 11 그래프 fact 요약

| 문항 | 그래프에 표시한 독립 사실 |
|---|---|
| 22 금당고 q08 | `y=√(x−1)+1`과 역함수의 교점 `(1,1)`, `(2,2)`, 거리 `√2`, 기울기 1 |
| 22 매산고 q07 | `y=3−√(4−x)`와 `y=−2x+3`, 제1사분면 교점 조건 `1<k≤11` |
| 22 매산고 q08 | `y=2/x`, `y=6/x`, `A=(1,2)`, `B=(3,2)`, `C=(1,6)`, 넓이 4 |
| 22 순천여고 q14 | `a=6`, 두 무리함수의 y축 절편 `−3`, `3`, 교점 `(3/2,0)` |
| 22 순천여고 q17 | 반원 거리 함수 `f(x)=2√(2−x)`, `0≤x≤2` |
| 22 순천여고 q21 | 변환 결과 `y=−√(2x−5)+3`, 계수 `a=2,b=−1,c=−2` |
| 22 복성고 q12 | `k=5`에서 원함수·이동 함수의 중심과 포함 관계 |
| 22 복성고 q21 | 조각 유리함수와 `y=−x`, `u=2`에서 최소 넓이 9 |
| 22 팔마고 2학기 중간 q22 | `k=2` 대표 이차함수·역함수의 두 교점 `(1,1)`, `(2,2)` |

## 판정

`BATCH11_RENDER_PASS_WITH_MATH_AND_PROTECTED_PARITY`: 실제 브라우저 해설 모드에서 7개 시험지의 9개 신규 SVG가 모두 표시·로드되었다. 이 매트릭스는 그래프의 교육적 필요성에 대한 최종 사용자 판정을 대신하지 않으며, 전체 522문항의 `SEALED` 선언도 의미하지 않는다.
