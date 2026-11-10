# 19 동산중 중2 2학기 기말 입력 패키지

원문 경로: `archive/exams/original/middle/m2/2final/19_동산중_2학기_기말_중2_기출.js`  
원문 Git blob: `febaad824bbf151af1708855c44c01d6e0152ac3` (65,297 bytes)  
범위: Q01–16, Q22–25는 `item.json` / `plan.json` / `publish.json` 20세트. Q17–21은 `EXEMPT_ASSESSMENT.json` 한 시험지 판정표.

## 실행 결과

- 15개 평면 construction-spike 계획: `construction.validate` PASS, `construction.execute` PASS (15/15).
- 평면도 치수·각도·중점·평행·원호·영역 입력: 현재 `planeMarkSpec` PASS (15/15).
- 입체도형 Q04, Q05, Q16, Q22: `solid-figure-v1.solveSolidFigure` PASS (4/4).
- 수직선 Q25: `number-line-figure-v1.solveNumberLineFigure` PASS (1/1).
- 직각 표시 6곳(Q06 두 곳, Q12, Q13, Q14, Q24): 계산상 모두 90° PASS.
- JSON 파싱 및 패키지 구조: PASS (20개 FIGURE 세트, EXEMPT 5문항).
- HOLD: 없음.

| 문항 | capability | 입력/엔진 상태 |
|---|---|---|
| Q01 | construction-spike-v1 | construction.validate/execute PASS, planeMarkSpec PASS |
| Q02 | construction-spike-v1 | construction.validate/execute PASS, planeMarkSpec PASS |
| Q03 | construction-spike-v1 | construction.validate/execute PASS, planeMarkSpec PASS |
| Q04 | solid-figure-v1 | solid model PASS |
| Q05 | solid-figure-v1 | solid model PASS |
| Q06 | construction-spike-v1 | construction.validate/execute PASS, planeMarkSpec PASS, 직각표시 PASS |
| Q07 | construction-spike-v1 | construction.validate/execute PASS, planeMarkSpec PASS |
| Q08 | construction-spike-v1 | construction.validate/execute PASS, planeMarkSpec PASS |
| Q09 | construction-spike-v1 | construction.validate/execute PASS, planeMarkSpec PASS |
| Q10 | construction-spike-v1 | construction.validate/execute PASS, planeMarkSpec PASS |
| Q11 | construction-spike-v1 | construction.validate/execute PASS, planeMarkSpec PASS |
| Q12 | construction-spike-v1 | construction.validate/execute PASS, planeMarkSpec PASS, 직각표시 PASS |
| Q13 | construction-spike-v1 | construction.validate/execute PASS, planeMarkSpec PASS, 호·영역 입력 PASS, 직각표시 PASS |
| Q14 | construction-spike-v1 | construction.validate/execute PASS, planeMarkSpec PASS, 직각표시 PASS |
| Q15 | construction-spike-v1 | construction.validate/execute PASS, planeMarkSpec PASS |
| Q16 | solid-figure-v1 | solid model PASS |
| Q22 | solid-figure-v1 | solid model PASS |
| Q23 | construction-spike-v1 | construction.validate/execute PASS, planeMarkSpec PASS |
| Q24 | construction-spike-v1 | construction.validate/execute PASS, planeMarkSpec PASS, 직각표시 PASS |
| Q25 | number-line-figure-v1 | number-line model PASS |

## 범위 상태

원본 문제 그림과 원문 JS는 보존했다. 원격 쓰기, 렌더, 최종검수, 엔진 변경은 수행하지 않았다. 해당 단계는 요청 범위 밖이다.
