# 2023 연향중 1학기 중간 중2 유사 — SVG plan audit, q01–q12

- Source: `archive/exams/similar/middle/m2/1mid/23_연향중_1학기_중간_중2_유사.js`
- Source blob on base main `e366b04ed6a07710b8232bacec5bf986198c2a8f`: `9780aae2aa7fad2de66dcd16b9f3f4809bdce60d`
- Scope: q01–q12, 12 questions × 2 axes = 24 decisions; q13–q23 outside this batch.
- Plan paths below are relative to this directory. All axes were independently read against their actual question/choices and solution. `EXEMPT` is a reasoned decision, not a renderable plan or a substitute for a failed image.

| qid | Problem axis | Reason | Solution axis | Reason |
| --- | --- | --- | --- | --- |
| q01 | EXEMPT | 보기의 순환마디 점 표기를 직접 판정함 | EXEMPT | 틀린 점 위치는 `−0.7\dot{2}`로 이미 정확히 교정됨 |
| q02 | EXEMPT | 유리수의 정의·분류를 문장으로 판별 | EXEMPT | 정수를 분수로 표현한 반례가 글과 식으로 완결됨 |
| q03 | EXEMPT | 거듭제곱 계산의 옳고 그름 판단 | EXEMPT | `(-2y³)³`의 부호·지수가 수식에서 직접 드러남 |
| q04 | EXEMPT | 문자 지수·계수 비교의 순수 대수 문제 | EXEMPT | `3b=9`, `ab=15`, `c=2³`의 단계가 수식으로 완결됨 |
| q05 | BENEFICIAL | 직사각형 가로/세로와 삼각형 밑변/미지 높이의 위치가 도형으로 더 명확해짐 | EXEMPT | 해설은 두 면적의 식을 이미 직접 세워 높이를 계산하므로 같은 그림 재제작은 중복 |
| q06 | EXEMPT | 단항식의 나눗셈과 곱셈 계산 | EXEMPT | A와 B의 간단화가 해설 수식으로 제시됨 |
| q07 | EXEMPT | 미지 식 A를 역산하는 다항식 문제 | EXEMPT | 잘못된 뺄셈을 되돌리고 더하는 순수 식 변형 |
| q08 | EXEMPT | 중첩 괄호와 동류항 정리 | EXEMPT | 분배법칙 적용 순서가 해설에 모두 있음 |
| q09 | EXEMPT | 분배법칙·단항식 나눗셈 보기 중 올바른 식 판단 | EXEMPT | 보기별 식의 전개·검산이 해설에 있음 |
| q10 | EXEMPT | 다항식의 계수 a,b 비교 | EXEMPT | `−2x+6y`에서 계수를 읽는 연산만 있음 |
| q11 | EXEMPT | 문자 부등식의 부호 변환 판단, 임의 수치 도식은 조건을 왜곡함 | EXEMPT | 음수 −2를 곱할 때 부등호 반전이 대수적으로 충분히 표현됨 |
| q12 | EXEMPT | 수치 부등식의 풀이·최댓값을 그림에 미리 제시하면 정답 노출 | BENEFICIAL | 열린 경계 `−4/9`와 왼쪽 정수해 가운데 최대 `−1`의 관계를 수직선으로 읽음 |

## Production plan and field parity

| Axis | Capability | Plan | Shallow lint | Full lint | DRAWN_FEATURE_PARITY | Field-by-field source mapping |
| --- | --- | --- | --- | --- | --- | --- |
| q05 problem | `construction-spike-v1` / `PLANE_FIGURE_v1` | `q05-problem.plan.json` | PASS | PASS | PASS | 주어진 가로 `4a³b²`→`planeMarks.expressionLabels.rectWidth` on `sAB`, 세로 `3ab`→`rectHeight` on `sDA`, 삼각형 밑변 `8a²b⁵`→`triBase` on `sEF`, 미지 높이 `h`→`triHeight` on `sGH`, 수선→`rightAngles.triRight`. 표시점 좌표로 직사각형 넓이 4×3=12, 삼각형 넓이 8×3/2=12인 대표 배치를 독립 계산하여 동면적 확인. 문자 길이의 일반 축척이 아니며 답 `h=3a²/b²`는 미표시. 면 채움 없음. |
| q12 solution | `number-line-figure-v1` | `q12-solution.plan.json` | PASS | PASS | PASS | 원식×10 정리 `9x<−4`→경계 `−4/9`, `hi.state=OPEN`, `lo=null`(왼쪽 무한), `integerPoints.range=[−3,0]`에 의한 정수해 −3, −2, −1. 값 0은 정수해에서 제외됨. 가장 큰 정수 −1은 해설 축에서만 제시. 면 채움 없음. |

All other 22 axes: EXEMPT, `plan-lint=NOT_APPLICABLE`, `DRAWN_FEATURE_PARITY=NOT_APPLICABLE`, no dummy JSON. `sourceVsPlan=REVIEWED` for the two plans, `ENGINE_CAPABILITY_PENDING=0` at authored-field parity level. `render/PNG/student view/A4=NOT_RUN` (plan authoring stage only), so field parity PASS does **not** mean completed SVG visual QA or publication. No JS `image`/`solutionImage` paths were added.
