# 26_제일고_1학기_중간_고2_대수_유사 — DRAWN_FEATURE_PARITY 구조 검수 (2026-11-27)

- 대상: `archive/exams/similar/high/h2/1mid/26_제일고_1학기_중간_고2_대수_유사.js`의 23문항 × 문제/해설 2축 = **46축**. 원본 발문·해설과 `archive/assets/images/26_제일고_1학기_중간_고2_대수/`의 사용 가능한 원본 그림을 대조했다.
- 이 경로에는 **실행 가능한 production plan만** 둔다. 아래 `EXEMPT`는 이전 시험지 plan의 판단을 확인한 것이며 새 EXEMPT/UNSUPPORTED JSON을 생산 계획 수로 세지 않는다.
- **shallow 및 full plan-lint PASS는 Chrome 렌더·PNG·학생 화면·A4 검수 완료를 뜻하지 않는다.** Chromium 바이너리가 실행되지 않아 전 축 `RENDER_NOT_RUN`이다. 본 표의 `FIELD_1:1_PASS`는 발문-렌더 필드 간 정적 대조에 한정한다.
- 기본 배경·면 채움은 **없음**. 기하 q12의 `LIGHT`만 원본의 넓이 영역을 나타내는 의도적 채움이다. 기존 SVG/PNG 파일을 고치거나 손 SVG를 작성하지 않았다.

| 파일/qid | 축 | 기존결함/판정 | capability | plan경로 | plan-lint (shallow/full) | DRAWN_FEATURE_PARITY |
|:--|:--|:--|:--|:--|:--|:--|
| 대수/q01 | 문제 | EXEMPT 검토 — 발문이 식으로 완결되어 학생이 풀 때 필요한 그림이 없다. | 해당 없음 | — (새 JSON 없음) | N/A | EXEMPT / RENDER_NOT_RUN |
| 대수/q01 | 해설 | EXEMPT 검토 — 거듭제곱근의 성질로 식을 정리하는 순수 계산 풀이라 그림이 필요 없다. | 해당 없음 | — (새 JSON 없음) | N/A | EXEMPT / RENDER_NOT_RUN |
| 대수/q02 | 문제 | EXEMPT 검토 — 발문이 식으로 완결되어 학생이 풀 때 필요한 그림이 없다. | 해당 없음 | — (새 JSON 없음) | N/A | EXEMPT / RENDER_NOT_RUN |
| 대수/q02 | 해설 | EXEMPT 검토 — 로그의 성질로 식을 하나로 합치는 순수 계산 풀이라 그림이 필요 없다. | 해당 없음 | — (새 JSON 없음) | N/A | EXEMPT / RENDER_NOT_RUN |
| 대수/q03 | 문제 | EXEMPT 검토 — 발문이 식의 계산 과정으로 완결되어 학생이 풀 때 필요한 그림이 없다. | 해당 없음 | — (새 JSON 없음) | N/A | EXEMPT / RENDER_NOT_RUN |
| 대수/q03 | 해설 | EXEMPT 검토 — 지수법칙이 성립하는 조건을 식으로 확인하는 풀이라 그림이 필요 없다. | 해당 없음 | — (새 JSON 없음) | N/A | EXEMPT / RENDER_NOT_RUN |
| 대수/q04 | 문제 | EXEMPT 검토 — 발문이 호의 길이와 넓이의 값으로 완결되어 학생이 풀 때 필요한 그림이 없다. | 해당 없음 | — (새 JSON 없음) | N/A | EXEMPT / RENDER_NOT_RUN |
| 대수/q04 | 해설 | EXEMPT 검토 — 호의 길이와 넓이 공식으로 r, θ를 구하는 계산 풀이라 그림이 필요 없다. | 해당 없음 | — (새 JSON 없음) | N/A | EXEMPT / RENDER_NOT_RUN |
| 대수/q05 | 문제 | EXEMPT 검토 — 발문이 식으로 완결되어 학생이 풀 때 필요한 그림이 없다. | 해당 없음 | — (새 JSON 없음) | N/A | EXEMPT / RENDER_NOT_RUN |
| 대수/q05 | 해설 | 원래 제외점 x=2가 결론 구간에 누락 → 세 번째 SET행·열린 제외구간 보강 | `composite-panels-v1` | [q05-solution.plan.json](./q05-solution.plan.json) | PASS / PASS | FIELD_1:1_PASS (정적) / RENDER_NOT_RUN |
| 대수/q06 | 문제 | EXEMPT 검토 — 발문이 식과 각의 범위로 완결되어 학생이 풀 때 필요한 그림이 없다. | 해당 없음 | — (새 JSON 없음) | N/A | EXEMPT / RENDER_NOT_RUN |
| 대수/q06 | 해설 | EXEMPT 검토 — 삼각함수 사이의 관계식과 이차방정식으로 값을 구하는 계산 풀이라 그림이 필요 없다. | 해당 없음 | — (새 JSON 없음) | N/A | EXEMPT / RENDER_NOT_RUN |
| 대수/q07 | 문제 | EXEMPT 검토 — 발문이 식으로 완결되어 학생이 풀 때 필요한 그림이 없다. | 해당 없음 | — (새 JSON 없음) | N/A | EXEMPT / RENDER_NOT_RUN |
| 대수/q07 | 해설 | EXEMPT 검토 — 로그를 취해 식을 정리하는 순수 계산 풀이라 그림이 필요 없다. | 해당 없음 | — (새 JSON 없음) | N/A | EXEMPT / RENDER_NOT_RUN |
| 대수/q08 | 문제 | EXEMPT 검토 — 발문이 문자로 쓴 로그함수의 식과 설명으로 완결되어 학생이 풀 때 필요한 그림이 없다. | 해당 없음 | — (새 JSON 없음) | N/A | EXEMPT / RENDER_NOT_RUN |
| 대수/q08 | 해설 | 잘못 제시된 g와 실제 역함수 h·y=x 비교 그래프 신설 | `multi-curve-figure-v1` | [q08-solution.plan.json](./q08-solution.plan.json) | PASS / PASS | FIELD_1:1_PASS (정적) / RENDER_NOT_RUN |
| 대수/q09 | 문제 | EXEMPT 검토 — 발문이 관계식과 값으로 완결되어 학생이 풀 때 필요한 그림이 없다. | 해당 없음 | — (새 JSON 없음) | N/A | EXEMPT / RENDER_NOT_RUN |
| 대수/q09 | 해설 | EXEMPT 검토 — 관계식에 값을 대입해 계산하는 풀이라 그림이 필요 없다. | 해당 없음 | — (새 JSON 없음) | N/A | EXEMPT / RENDER_NOT_RUN |
| 대수/q10 | 문제 | EXEMPT 검토 — 발문이 식으로 완결되어 학생이 풀 때 필요한 그림이 없다. | 해당 없음 | — (새 JSON 없음) | N/A | EXEMPT / RENDER_NOT_RUN |
| 대수/q10 | 해설 | EXEMPT 검토 — 밑변환 공식과 이차방정식으로 값을 구하는 순수 계산 풀이라 그림이 필요 없다. | 해당 없음 | — (새 JSON 없음) | N/A | EXEMPT / RENDER_NOT_RUN |
| 대수/q11 | 문제 | EXEMPT 검토 — 발문이 식으로 완결되어 학생이 풀 때 필요한 그림이 없다. | 해당 없음 | — (새 JSON 없음) | N/A | EXEMPT / RENDER_NOT_RUN |
| 대수/q11 | 해설 | EXEMPT 검토 — 치환한 문자의 범위를 구해 이차식의 최솟값을 구하는 계산 풀이라 그림이 필요 없다. | 해당 없음 | — (새 JSON 없음) | N/A | EXEMPT / RENDER_NOT_RUN |
| 대수/q12 | 문제 | EXEMPT 검토 — 발문이 식과 함숫값 조건으로 완결되어 학생이 풀 때 필요한 그림이 없다. | 해당 없음 | — (새 JSON 없음) | N/A | EXEMPT / RENDER_NOT_RUN |
| 대수/q12 | 해설 | EXEMPT 검토 — 역함수의 함숫값 관계로 연립방정식을 세워 계수를 구하는 계산 풀이라 그림이 필요 없다. | 해당 없음 | — (새 JSON 없음) | N/A | EXEMPT / RENDER_NOT_RUN |
| 대수/q13 | 문제 | EXEMPT 검토 — 발문이 식과 문장으로 완결되어 학생이 풀 때 필요한 그림이 없다. | 해당 없음 | — (새 JSON 없음) | N/A | EXEMPT / RENDER_NOT_RUN |
| 대수/q13 | 해설 | EXEMPT 검토 — 주기·최댓값·점근선을 식으로 판정하는 풀이라 그림이 필요 없다. | 해당 없음 | — (새 JSON 없음) | N/A | EXEMPT / RENDER_NOT_RUN |
| 대수/q14 | 문제 | EXEMPT 검토 — 발문이 함수의 식으로 완결되어 학생이 풀 때 필요한 그림이 없다. | 해당 없음 | — (새 JSON 없음) | N/A | EXEMPT / RENDER_NOT_RUN |
| 대수/q14 | 해설 | 정의역 [0,5]의 포물선·양 끝점·최솟값3·최댓값12 도식 신설 | `multi-curve-figure-v1` | [q14-solution.plan.json](./q14-solution.plan.json) | PASS / PASS | FIELD_1:1_PASS (정적) / RENDER_NOT_RUN |
| 대수/q15 | 문제 | EXEMPT 검토 — 발문이 직선과 원의 식으로 완결되어 학생이 풀 때 필요한 그림이 없다. | 해당 없음 | — (새 JSON 없음) | N/A | EXEMPT / RENDER_NOT_RUN |
| 대수/q15 | 해설 | 원과 직선의 교점 P(-2,-4), Q(2,4) 및 두 사분면 일치 | `construction-spike-v1` | [q15-solution.plan.json](./q15-solution.plan.json) | PASS / PASS | FIELD_1:1_PASS (정적) / RENDER_NOT_RUN |
| 대수/q16 | 문제 | EXEMPT 검토 — 발문이 원의 방정식과 식으로 완결되어 학생이 풀 때 필요한 그림이 없다. | 해당 없음 | — (새 JSON 없음) | N/A | EXEMPT / RENDER_NOT_RUN |
| 대수/q16 | 해설 | 기존 UNSUPPORTED → 원점 중심 원·C(4,-3) 중심 원의 접점 및 반지름 표시 | `ellipse-figure-v1` | [q16-solution.plan.json](./q16-solution.plan.json) | PASS / PASS | FIELD_1:1_PASS (정적) / RENDER_NOT_RUN |
| 대수/q17 | 문제 | 바뀐 유사 조건 최대3·최소-1·P(0,2)·보조 점선으로 원본과 분리 | `trigonometric-spike-v1` | [q17-problem.plan.json](./q17-problem.plan.json) | PASS / PASS | FIELD_1:1_PASS (정적) / RENDER_NOT_RUN |
| 대수/q17 | 해설 | 주기 π·극값 점선·P(0,2)와 실제 sin 그래프 확인 | `trigonometric-spike-v1` | [q17-solution.plan.json](./q17-solution.plan.json) | PASS / PASS | FIELD_1:1_PASS (정적) / RENDER_NOT_RUN |
| 대수/q18 | 문제 | EXEMPT 검토 — 발문이 함수의 식과 교점의 정의로 완결되어 학생이 풀 때 필요한 그림이 없다. | 해당 없음 | — (새 JSON 없음) | N/A | EXEMPT / RENDER_NOT_RUN |
| 대수/q18 | 해설 | 기존 UNSUPPORTED → 로그 두 가지·x=2 점근선·사다리꼴 4변, 무채움 | `multi-curve-figure-v1` | [q18-solution.plan.json](./q18-solution.plan.json) | PASS / PASS | FIELD_1:1_PASS (정적) / RENDER_NOT_RUN |
| 대수/q19 | 문제 | EXEMPT 검토 — 발문이 두 식과 사분면 조건으로 완결되어 학생이 풀 때 필요한 그림이 없다. | 해당 없음 | — (새 JSON 없음) | N/A | EXEMPT / RENDER_NOT_RUN |
| 대수/q19 | 해설 | 삼각함수 y=sin(πx/2)와 n=14 보조직선의 교차 구조 확인 | `trigonometric-spike-v1` | [q19-solution.plan.json](./q19-solution.plan.json) | PASS / PASS | FIELD_1:1_PASS (정적) / RENDER_NOT_RUN |
| 대수/q20 | 문제 | EXEMPT 검토 — 발문이 각의 값으로 완결되어 학생이 풀 때 필요한 그림이 없다. | 해당 없음 | — (새 JSON 없음) | N/A | EXEMPT / RENDER_NOT_RUN |
| 대수/q20 | 해설 | EXEMPT 검토 — 2π의 정수배를 더해 일반각으로 나타내는 계산 풀이라 그림이 필요 없다. | 해당 없음 | — (새 JSON 없음) | N/A | EXEMPT / RENDER_NOT_RUN |
| 대수/q21 | 문제 | EXEMPT 검토 — 발문이 부등식과 각의 범위로 완결되어 학생이 풀 때 필요한 그림이 없다. | 해당 없음 | — (새 JSON 없음) | N/A | EXEMPT / RENDER_NOT_RUN |
| 대수/q21 | 해설 | EXEMPT 검토 — 판별식과 삼각함수의 값의 범위를 식으로 푸는 풀이라 그림이 필요 없다. | 해당 없음 | — (새 JSON 없음) | N/A | EXEMPT / RENDER_NOT_RUN |
| 대수/q22 | 문제 | EXEMPT 검토 — 발문이 식으로 완결되어 학생이 풀 때 필요한 그림이 없다. | 해당 없음 | — (새 JSON 없음) | N/A | EXEMPT / RENDER_NOT_RUN |
| 대수/q22 | 해설 | EXEMPT 검토 — 식의 부호와 n의 홀짝에 따라 경우를 나누어 세는 계산 풀이라 그림이 필요 없다. | 해당 없음 | — (새 JSON 없음) | N/A | EXEMPT / RENDER_NOT_RUN |
| 대수/q23 | 문제 | EXEMPT 검토 — 발문이 함수의 식과 정의로 완결되어 있고 그래프는 학생이 직접 그리는 것이 문항의 요구라 그림을 주면 안 된다. | 해당 없음 | — (새 JSON 없음) | N/A | EXEMPT / RENDER_NOT_RUN |
| 대수/q23 | 해설 | 기존 UNSUPPORTED → 불연속 경계 열린/닫힌 점·3곡선·y=4 점근선 구현 | `multi-curve-figure-v1` | [q23-solution.plan.json](./q23-solution.plan.json) | PASS / PASS | FIELD_1:1_PASS (정적) / RENDER_NOT_RUN |

**합계:** 46축 중 실행 가능 plan **10**, 정적 필드 parity **10**, ENGINE_CAPABILITY_PENDING **0**, EXEMPT **36**. 렌더 검증 **0**, RENDER_NOT_RUN **46**.

### 실행/엔진 인계

1. 파일명을 명시적으로 전달하여 `node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs --shallow <개별 plan...>` 및 옵션 없는 full lint를 각각 실행했다. 폴더 경로만 주면 qNN 파일명 패턴이 수집되지 않으므로 개별 파일 인자 사용 필수.
2. Chromium 실행파일 부재로 화면 렌더·PNG·학생 기기·A4 검수는 `RENDER_NOT_RUN`. 렌더 담당자는 위 정적 검수와 별개로 실제 SVG/PNG를 재생성한 후 지시선·보조선·점선·직각/각도·길이·라벨·배경·불필요한 면 채움을 1:1로 확인해야 한다.
3. 이 대수 시험지의 그림 축에는 현재 확인된 `ENGINE_CAPABILITY_PENDING`이 없다. 단, 화면상 라벨 충돌과 배치 적합성은 미렌더 상태이므로 별도 확인해야 한다.
4. 원본/유사 원문의 값과 그래프가 다르면 유사 원문을 우선한다. 특히 대수 q17과 기하 q22의 원본 에셋을 그대로 재활용하지 않았다. 마지막 publish/JS 이미지 연결은 후속 렌더 단계다.
