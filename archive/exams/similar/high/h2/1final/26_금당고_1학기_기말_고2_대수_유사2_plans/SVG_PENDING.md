# 금당고 기말 대수 유사2 — SVG 후속 작업

- 본 시험지: archive/exams/similar/high/h2/1final/26_금당고_1학기_기말_고2_대수_유사2.js
- 학생용 21문항 모두 그림 없이 조건과 풀이가 수학적으로 완결됨. 모든 문제용 그림은 EXEMPT 또는 BENEFICIAL이다. REQUIRED 0개.
- 2축 42개 판정, EXEMPT 34개, 유익한 그림 8개(제작용 엔진 plan 2개 / 엔진 확정 대기 6개).
- 실제 SVG 렌더·PNG 육안검수·JS image 연결: 0개, NOT_RUN.

| 번호 | 축 | 필요도 | 계획 JSON | 상태 |
|---|---|---|---|---|
| 5 | solution | BENEFICIAL | q05-solution.plan.json | ENGINE_PLAN_READY / RENDER_NOT_RUN |
| 9 | problem | BENEFICIAL | q09-problem.plan.json | ENGINE_CAPABILITY_PENDING |
| 9 | solution | BENEFICIAL | q09-solution.plan.json | ENGINE_CAPABILITY_PENDING |
| 14 | solution | BENEFICIAL | q14-solution.plan.json | ENGINE_CAPABILITY_PENDING |
| 18 | solution | BENEFICIAL | q18-solution.plan.json | ENGINE_PLAN_READY / RENDER_NOT_RUN |
| 19 | problem | BENEFICIAL | q19-problem.plan.json | ENGINE_CAPABILITY_PENDING |
| 19 | solution | BENEFICIAL | q19-solution.plan.json | ENGINE_CAPABILITY_PENDING |
| 21 | solution | BENEFICIAL | q21-solution.plan.json | ENGINE_CAPABILITY_PENDING |

후속 엔진 작업자는 각 JSON의 수학 조건을 최종 JS와 독립 대조한 뒤 공식 render-plan.mjs로 렌더·PNG 검수하고 원격 자산에 연결할 것.
