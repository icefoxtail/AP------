# 금당고 고1 중간 유사2 — 해설 SVG 작업 장부

- 시험지: `26_금당고_1학기_중간_고1_유사2.js`
- 모드: `EXAM_FOLLOWUP / SOURCE_BALANCED`
- 문제용 SVG: 전체 20문항 `EXEMPT`. 모든 조건과 수치가 발문에 제시되어 그림 없이 해석·답을 확정할 수 있다. Q14도 꼭짓점·절편·대칭과 직사각형의 위치 관계를 문자로 완결해 제시했다.
- 해설용 SVG: Q09, Q13, Q14, Q17, Q20만 `SVG_TO_CREATE`. Q01–Q08, Q10–Q12, Q15–Q16, Q18–Q19는 학생이 식과 표만으로 풀이를 재현할 수 있으므로 `EXEMPT`.
- 상태: 아래 다섯 건은 모두 **plan 초안**이다. 공식 `plan-lint.cjs --shallow` 기본 검사에서는 5/5 `PASS`였지만, SVG 엔진 렌더·PNG 육안 검수·게시는 모두 `NOT_RUN`이다. 운영 JS에는 `solutionPlanRef`만 연결했으며 `solutionImage`는 없다.

| 문항 | 해설 그림 목적 | plan | plan-lint | SVG 렌더 | PNG 검수 | 게시 |
| --- | --- | --- | --- | --- | --- | --- |
| Q09 | x축과 접하는 꼭짓점 | `q09-solution.plan.json` | PASS (shallow) | NOT_RUN | NOT_RUN | NOT_RUN |
| Q13 | 모든 k에 공통인 접선의 접점 | `q13-solution.plan.json` | PASS (shallow) | NOT_RUN | NOT_RUN | NOT_RUN |
| Q14 | 둘레 최대인 내접 직사각형의 높이 | `q14-solution.plan.json` | PASS (shallow) | NOT_RUN | NOT_RUN | NOT_RUN |
| Q17 | 세 교점 발생의 대표 그래프(a=4) | `q17-solution.plan.json` | PASS (shallow) | NOT_RUN | NOT_RUN | NOT_RUN |
| Q20 | 움직이는 구간의 최대·최소 합 함수 | `q20-solution.plan.json` | PASS (shallow) | NOT_RUN | NOT_RUN | NOT_RUN |

후속 작업: 공식 `archive/tools/geometry-equation/production/render-plan.mjs`로 각 plan을 렌더하고, 수학값·지점·라벨을 PNG에서 독립 검수한 뒤 `archive/assets/images/`의 신규 경로에 게시하고 해당 문항에만 `solutionImage`를 추가한다. 해설 그림이 준비되기 전에는 렌더 PASS를 선언하지 않는다.
