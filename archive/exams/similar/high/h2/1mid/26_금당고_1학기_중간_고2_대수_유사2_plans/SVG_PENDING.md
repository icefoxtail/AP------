# 26_금당고_1학기_중간_고2_대수_유사2 — SVG 재제작·검수·JS 연결 완료 (2026-11-25)

독립 R1 전수검수(`#2943`)로 발문·해설이 수정되었던 Q08·Q19 및 보류 상태였던 Q21에 대해 수정된 수식에 맞춰 공식 SVG 엔진(`render-plan.mjs`)으로 재렌더·PNG 육안 검수·`engine_evidence` 확보·정규 plan 승격(`q08-problem.plan.json`, `q19-solution.plan.json`, `q21-solution.plan.json`) 및 JS 연결을 완료하였다.

| 번호 | 축 | 최종 상태 | 엔진 결과 / 크기 | PNG 검수 | 연결된 JS 경로 |
| --- | --- | --- | --- | --- | --- |
| Q08 | problem | **DONE / JS_BOUND** | `ARCHIVE_BOUND` / `medium` | PASS | `assets/images/26_금당고_1학기_중간_고2_대수_유사2/q08-problem.svg` |
| Q19 | solution | **DONE / JS_BOUND** | `ARCHIVE_BOUND` / `full` | PASS | `assets/images/26_금당고_1학기_중간_고2_대수_유사2/q19-solution.svg` |
| Q21 | solution | **DONE / JS_BOUND** | `ARCHIVE_BOUND` / `full` | PASS | `assets/images/26_금당고_1학기_중간_고2_대수_유사2/q21-solution.svg` |

- 공식 릴리스 하네스(`node tools/harness/verify_similar_exam.mjs 26_금당고_1학기_중간_고2_대수_유사2.js`): **PASS**
- 42개 정규 plan 파일 중 Q08 problem·Q19 solution·Q21 solution 외 나머지 39건은 `EXEMPT` 유지.
