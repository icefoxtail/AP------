# 26_제일고_1학기_기말_고2_대수_유사2 — SVG 2축 판정 및 후속 작업

- 21문항 × 문제/해설 2축 = 42판정 (누락 0).
- 문제용 REQUIRED 0 / BENEFICIAL 0 / EXEMPT 21.
- 해설용 REQUIRED 0 / BENEFICIAL 6 / EXEMPT 15.
- 필수 문제 그림은 없고, 해설은 텍스트만으로 완결됨.
- 엔진 제작용 production plan JSON: 6 (해설 BENEFICIAL 6개에 각 1개). 2026-11-25 FINAL QA에서 원문과 `sourceQuote`를 결속하고 공식 엔진 plan lint를 실행함.
- plan lint(shallow/full): 각각 6/6 PASS, SKIP 0; SVG 렌더: NOT_RUN; PNG 시각검수: NOT_RUN; JS 그림 연결 0.

| 문항 | 축 | 필요도 | 사유 | 제작용 JSON | 후속 상태 |
| --- | --- | --- | --- | --- | --- |
| Q07 | 해설 | BENEFICIAL | 코사인 투영이 BC로 합쳐지는 관계를 삼각형에 표시하면 개념이 선명해짐 | archive/exams/similar/high/h2/1final/26_제일고_1학기_기말_고2_대수_유사2_plans/q07-solution.plan.json | SVG_TO_CREATE / 엔진·실물 검수 대기 |
| Q08 | 해설 | BENEFICIAL | 직육면체의 서로 다른 모서리와 등비 관계를 도식으로 확인하면 입체 이해를 돕는다 | archive/exams/similar/high/h2/1final/26_제일고_1학기_기말_고2_대수_유사2_plans/q08-solution.plan.json | SVG_TO_CREATE / 엔진·실물 검수 대기 |
| Q14 | 해설 | BENEFICIAL | x=4 수직선의 세 길이가 등비를 이루는 위치를 그래프로 대조할 수 있음 | archive/exams/similar/high/h2/1final/26_제일고_1학기_기말_고2_대수_유사2_plans/q14-solution.plan.json | SVG_TO_CREATE / 엔진·실물 검수 대기 |
| Q16 | 해설 | BENEFICIAL | 원·현 CD·작은 호의 중점과 높이 관계를 그림으로 확인할 가치가 큼 | archive/exams/similar/high/h2/1final/26_제일고_1학기_기말_고2_대수_유사2_plans/q16-solution.plan.json | SVG_TO_CREATE / 엔진·실물 검수 대기 |
| Q17 | 해설 | BENEFICIAL | 원·접점 현 AB·직각삼각형 OAP에서 넓이로 수선 AM을 구하고 PM을 비교하는 구조를 보임 | archive/exams/similar/high/h2/1final/26_제일고_1학기_기말_고2_대수_유사2_plans/q17-solution.plan.json | SVG_TO_CREATE / 엔진·실물 검수 대기 |
| Q19 | 해설 | BENEFICIAL | 두 직선 위의 P,Q와 원점 O가 만드는 삼각형의 끼인각 120도를 코사인법칙으로 설명 | archive/exams/similar/high/h2/1final/26_제일고_1학기_기말_고2_대수_유사2_plans/q19-solution.plan.json | SVG_TO_CREATE / 엔진·실물 검수 대기 |

주의: 6개 JSON의 공식 shallow/full plan lint만 통과했고 실제 SVG 렌더/PNG 시각검수 성공을 주장하지 않는다. 후속 렌더·실물 검수에서 결함이 나오면 plan을 고쳐야 한다.
문제 풀이에 꼭 필요한 그림이 없으므로 JS 선반영 가능 여부와 SVG 시각 완료 여부는 별개다.
