# 비상 공통수학Ⅱ 도형의 방정식 — 대단원학습평가 SVG plan 전수 감사

- 원문: `archive/exams/textbooks/비상교육_공통수학2/비상_공통수학2_도형의방정식_대단원학습평가_고1.js` (SHA-256 `456f03df56043f4159ace17c6f03ac2eb9e003d4fd6023ce67dd69f1ece2feff`)
- 문항 17개 × 문항/해설 2축 = **34축**. 그림 필요한 19축 전부 실사용 JSON으로 기획; 그림 없는 문항 15축은 발문·해설·기존 SVG 여부까지 확인해 EXEMPT.
- 총 **23 plan JSON**, 공식 `plan-lint.cjs --shallow` / 전체 `plan-lint.cjs` **23/23 OK** (최종 재실행 기준). `DRAWN_FEATURE_PARITY`는 원문 필수 요소 ↔ 실제 그려지는 plan 필드의 **정적** 1:1 대조; SVG/PNG 렌더·브라우저/인쇄 화면 관측은 이 라인 범위 밖에서 별도 수행해야 함.
- 모든 plan은 기본 흰 배경 객체 없이 작성, 불필요한 `polygons.fill`·면 채움 없음. 문제 그림 q05와 q15의 불필요한 분홍/흰 배경 면을 복제하지 않고 높이·호·변 표식은 남김.
- 표의 `plan경로`는 이 Markdown 파일과 같은 폴더(`archive/tools/geometry-equation/production/plans/비상_공통수학2_도형의방정식_대단원학습평가_고1/`)를 기준으로 한다.

| 파일/qid | 축 | 판정 | capability | plan경로 | plan-lint | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|---|
| 비상_공통수학2_도형의방정식_대단원학습평가_고1.js/q01 | 문항 | EXEMPT | — | — | — | N/A — 원문에서 그림 불필요(발문/해설 텍스트 검토) |
| 비상_공통수학2_도형의방정식_대단원학습평가_고1.js/q01 | 해설 | PLAN_READY | construction-spike-v1 | `q01-solution.plan.json` | shallow OK / full OK | PASS — 최솟값 t=1의 A(1,1), B(2,2), AB 실선 |
| 비상_공통수학2_도형의방정식_대단원학습평가_고1.js/q02 | 문항 | EXEMPT | — | — | — | N/A — 원문에서 그림 불필요(발문/해설 텍스트 검토) |
| 비상_공통수학2_도형의방정식_대단원학습평가_고1.js/q02 | 해설 | PLAN_READY | construction-spike-v1 | `q02-solution.plan.json` | shallow OK / full OK | PASS — A−M−P−B 네 점·세 구간·좌표 |
| 비상_공통수학2_도형의방정식_대단원학습평가_고1.js/q03 | 문항 | EXEMPT | — | — | — | N/A — 원문에서 그림 불필요(발문/해설 텍스트 검토) |
| 비상_공통수학2_도형의방정식_대단원학습평가_고1.js/q03 | 해설 | PLAN_READY | construction-spike-v1 | `q03-solution.plan.json` | shallow OK / full OK | PASS — A−G−M 중선 두 구간 및 좌표 |
| 비상_공통수학2_도형의방정식_대단원학습평가_고1.js/q04 | 문항 | EXEMPT | — | — | — | N/A — 원문에서 그림 불필요(발문/해설 텍스트 검토) |
| 비상_공통수학2_도형의방정식_대단원학습평가_고1.js/q04 | 해설 | PLAN_READY | construction-spike-v1 | `q04-solution.plan.json` | shallow OK / full OK | PASS — P(−2,1), Q(−6,2), R(−1,5), PQ⊥PR 직각 |
| 비상_공통수학2_도형의방정식_대단원학습평가_고1.js/q05 | 문항 | PLAN_READY | construction-spike-v1 | `q05-problem.plan.json` | shallow OK / full OK | PASS — 삼각형 ABC, 수심 H, 높이 AD·CE 점선, D·E 직각 2개, △HBC 변 BH, BC·HD 치수선 |
| 비상_공통수학2_도형의방정식_대단원학습평가_고1.js/q05 | 해설 | PLAN_READY | construction-spike-v1 | `q05-solution.plan.json` | shallow OK / full OK | PASS — 삼각형 ABC, 수심 H, 높이 AD·CE 점선, D·E 직각 2개, △HBC 변 BH, BC·HD 치수선 |
| 비상_공통수학2_도형의방정식_대단원학습평가_고1.js/q06 | 문항 | EXEMPT | — | — | — | N/A — 원문에서 그림 불필요(발문/해설 텍스트 검토) |
| 비상_공통수학2_도형의방정식_대단원학습평가_고1.js/q06 | 해설 | PLAN_READY | ellipse-figure-v1 | `q06-solution.plan.json` | shallow OK / full OK | PASS — 원 중심 O(3,14)·원·직선 y=3x+5, L/R 공선 |
| 비상_공통수학2_도형의방정식_대단원학습평가_고1.js/q07 | 문항 | EXEMPT | — | — | — | N/A — 원문에서 그림 불필요(발문/해설 텍스트 검토) |
| 비상_공통수학2_도형의방정식_대단원학습평가_고1.js/q07 | 해설 | PLAN_READY | ellipse-figure-v1 | `q07-solution.plan.json` | shallow OK / full OK | PASS — 최소 넓이 원 C(−4,6), r²=3 |
| 비상_공통수학2_도형의방정식_대단원학습평가_고1.js/q08 | 문항 | EXEMPT | — | — | — | N/A — 원문에서 그림 불필요(발문/해설 텍스트 검토) |
| 비상_공통수학2_도형의방정식_대단원학습평가_고1.js/q08 | 해설 | PLAN_READY | ellipse-figure-v1 | `q08-solution.plan.json` | shallow OK / full OK | PASS — 원·현 AB·중심 C·수선의 발 H와 직각 |
| 비상_공통수학2_도형의방정식_대단원학습평가_고1.js/q09 | 문항 | EXEMPT | — | — | — | N/A — 원문에서 그림 불필요(발문/해설 텍스트 검토) |
| 비상_공통수학2_도형의방정식_대단원학습평가_고1.js/q09 | 해설 | PLAN_READY | ellipse-figure-v1 | `q09-solution.plan.json` | shallow OK / full OK | PASS — 동심원 둘, 접점 P/Q, 접선 l₁/l₂, 교차 직각 I |
| 비상_공통수학2_도형의방정식_대단원학습평가_고1.js/q10 | 문항 | EXEMPT | — | — | — | N/A — 원문에서 그림 불필요(발문/해설 텍스트 검토) |
| 비상_공통수학2_도형의방정식_대단원학습평가_고1.js/q10 | 해설 | PLAN_READY | ellipse-figure-v1 | `q10-solution.plan.json` | shallow OK / full OK | PASS — 원 두 개와 최종 원의 중심 C, 축 접점 X/Y, 반지름 |
| 비상_공통수학2_도형의방정식_대단원학습평가_고1.js/q11 | 문항 | EXEMPT | — | — | — | N/A — 원문에서 그림 불필요(발문/해설 텍스트 검토) |
| 비상_공통수학2_도형의방정식_대단원학습평가_고1.js/q11 | 해설 | PLAN_READY | construction-spike-v1 | `q11-solution.plan.json` | shallow OK / full OK | PASS — 원점/축 대칭점 A′, A−C−B 경로와 점선 |
| 비상_공통수학2_도형의방정식_대단원학습평가_고1.js/q12 | 문항 | EXEMPT | — | — | — | N/A — 원문에서 그림 불필요(발문/해설 텍스트 검토) |
| 비상_공통수학2_도형의방정식_대단원학습평가_고1.js/q12 | 해설 | PLAN_READY | construction-spike-v1 | `q12-solution.plan.json` | shallow OK / full OK | PASS — 제3사분면의 선분 AB, 경계 Q/R, 내부 P |
| 비상_공통수학2_도형의방정식_대단원학습평가_고1.js/q13 | 문항 | EXEMPT | — | — | — | N/A — 원문에서 그림 불필요(발문/해설 텍스트 검토) |
| 비상_공통수학2_도형의방정식_대단원학습평가_고1.js/q13 | 해설 | PLAN_READY | construction-spike-v1 | `q13-solution-minus1.plan.json`, `q13-solution-plus2.plan.json`, `q13-solution-plus3.plan.json` | shallow OK / full OK | PASS — 세 직선의 a=−1·2(평행), a=3(동시점) 정확히 3개 개별 플랜 |
| 비상_공통수학2_도형의방정식_대단원학습평가_고1.js/q14 | 문항 | EXEMPT | — | — | — | N/A — 원문에서 그림 불필요(발문/해설 텍스트 검토) |
| 비상_공통수학2_도형의방정식_대단원학습평가_고1.js/q14 | 해설 | PLAN_READY | ellipse-figure-v1 + construction-spike-v1 | `q14-solution.plan.json`, `q14-solution-extrema-labels.plan.json` | shallow OK / full OK | PASS — 원과 OPmin=3, OPmax=7; 별도 플랜의 Pmax/Pmin 이름 |
| 비상_공통수학2_도형의방정식_대단원학습평가_고1.js/q15 | 문항 | PLAN_READY | ellipse-figure-v1 | `q15-problem.plan.json` | shallow OK / full OK | PASS — 원·호 위 P·현 AB·수선 OM 직각, 별도 치수선 AB=4√5/OM=√5 |
| 비상_공통수학2_도형의방정식_대단원학습평가_고1.js/q15 | 해설 | PLAN_READY | ellipse-figure-v1 + construction-spike-v1 | `q15-solution.plan.json`, `q15-solution-metric.plan.json` | shallow OK / full OK | PASS — 원·호 위 P·현 AB·수선 OM 직각, 별도 치수선 AB=4√5/OM=√5 |
| 비상_공통수학2_도형의방정식_대단원학습평가_고1.js/q16 | 문항 | EXEMPT | — | — | — | N/A — 원문에서 그림 불필요(발문/해설 텍스트 검토) |
| 비상_공통수학2_도형의방정식_대단원학습평가_고1.js/q16 | 해설 | PLAN_READY | construction-spike-v1 | `q16-solution.plan.json` | shallow OK / full OK | PASS — A→B→D→C 대칭 점선, y=x, G(1,−2) |
| 비상_공통수학2_도형의방정식_대단원학습평가_고1.js/q17 | 문항 | EXEMPT | — | — | — | N/A — 원문에서 그림 불필요(발문/해설 텍스트 검토) |
| 비상_공통수학2_도형의방정식_대단원학습평가_고1.js/q17 | 해설 | PLAN_READY | ellipse-figure-v1 | `q17-solution.plan.json` | shallow OK / full OK | PASS — 중심(1,0)·원·k=−6/4 접선, T1/T2 및 안내점 P1–P4 |

## 1:1 확인 및 보완

- q05 문항: 원문 PNG의 A/C 높이·직각 둘·수심 H·△HBC의 경계 BH를 `displaySegments`와 `rightAngles`에 직접 선언. 문제 단계에서 D/E는 무명 수선 발. 해설 단계에서는 D/E 이름과 BC=3√5, HD=4/√5를 `planeMarks.dimensions`의 실제 치수선에 배치.
- q09 해설: 접선 `l_1`, `l_2` 자체와 접점·반지름 외에 접선 교점 I를 `FOOT(rightAngle:true)`로 계산해 **직각 사각형**을 실제로 표시.
- q13 해설: a=−1, a=2, a=3을 한 그림에 혼합하지 않고 정확히 세 독립 좌표 플랜으로 분리. 두 평행 경우와 공통 교점 P(−1,2)를 모두 그린다.
- q14 해설: 원 전체·극점 거리(3,7)는 conic 플랜, 원문 라벨 `Pmax`·`Pmin`과 네 직선 구간은 좌표 플랜으로 분리하여 글자 누락을 회복.
- q15 문제: 정답 P의 위치를 감춘 임의의 작은 호 위 점을 사용. 해설: 최적 P, 현·수선·직각을 conic 플랜에, 공간 부족으로 충돌하던 AB=4√5·OM=√5 치수는 독립 좌표 플랜에 실제 그려지는 `dimensions`로 배치. 캡션만으로 치수 표기를 대체하지 않음.
