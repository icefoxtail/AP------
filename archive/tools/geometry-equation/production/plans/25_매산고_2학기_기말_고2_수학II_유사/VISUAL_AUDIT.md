# 25_매산고_2학기_기말_고2_수학II_유사 — 문항·해설 전축 DRAWN_FEATURE_PARITY 감사
+## 2026-11-27 최신 main 기준 전축 재검증 (기존 15개 plan 유지)

- 새 원격 기준: `origin/main` `41d9d673c378d6d300a366735a6a407d72939366`. 현행 유사 JS **22문항·문제 22축·해설 22축 = 44/44축**을 다시 개별 검토했다. **BENEFICIAL 15축(해설 15)**, **EXEMPT 29축(문제 22·해설 7)**, REQUIRED 0축.
- 공식 production JSON은 **15개 기존 그대로 유지, 신규 0·수정 0**. 원문에서 확정된 각 계획의 다항식 계수·극점·접선·음영 범위·시간 영점·정규화 단위를 이전 전축 장부와 대조했고, 15개 전부 `sourceConditions[].mappedTo`, `caption`, `accessibilityDescription`, `newVisualInformation` 존재. JSON 파싱/공식 Shallow/Full lint **각 15/15 PASS**. 현재 확인된 보완 필요 오류는 0개다.
- 직접 연결된 **유사판 해설 SVG 5개**(5,7,14,19,20)는 5개 모두 흰색 배경 rect를 갖는다. 별도의 **원 기출 JS에는 해설 SVG 17개**, 해당 2025 매산고 기출 PNG는 저장소에서 발견되지 않았다. 원 기출과 유사판은 실제 다른 수식이다(예: 기출 q05 `2x³−2x²+4=4x²−a`, 유사 q05 `x³−x²+2=2x²−a`; q07의 절댓값 높이 16↔54; q20 위치 함수 계수도 다름). **기출 SVG는 변형 전 참고**로만 사용하고 원본 기준과 유사판 조건을 혼동하지 않았다. `ORIGINAL_EXAM_SVG_VARIANT_CONFLICT`(의도적 변형), PNG가 없으므로 `ORIGINAL_EXAM_PNG_CONFLICT` 해당 없음.
- `STATIC_FIELD_PARITY` **15 PASS / 29 N/A**. `DRAWN_FEATURE_PARITY`는 정적 요소만 검토했으며, `chromium --version` 종료 127(실제 Chromium 본체 없음)으로 **`RENDER_NOT_RUN`**, 출력 육안 PASS **0/15**. 기존 문서 아래의 `STATIC_1_TO_1` 표기는 **계획 필드의 정적 대조**를 뜻하며 실제 렌더 PASS가 아니다.

| 문항 | 문제 축 판정 | 해설 축 판정 | 원본 SVG | plan 파일 | STATIC_FIELD_PARITY | DRAWN_FEATURE_PARITY | 비고 |
|---|---|---|---|---|---|---|---|
| 01 | EXEMPT | BENEFICIAL | 유사판 없음; 기출 `q1-solution-v3.svg` | `q01-solution.plan.json` (유지) | PASS | 정적 대조 / RENDER_NOT_RUN | 문제: f의 매개변수 a를 먼저 풀어야 하므로 별도 그림 불필요. 해설: a=2에서 삼차함수의 x=2 극솟점 (2,−7)을 보여준다. |
| 02 | EXEMPT | EXEMPT | 유사판 없음 | 없음 | N/A | N/A | 문제·해설: 부정적분 상수 C와 F(2)의 수치 대입으로 완결된다. |
| 03 | EXEMPT | EXEMPT | 유사판 없음 | 없음 | N/A | N/A | 문제·해설: 정적분 0~1의 다항식 계산이며 그래프 정보가 없다. |
| 04 | EXEMPT | EXEMPT | 유사판 없음; 기출 `q4-solution-v2.svg` | 없음 | N/A | N/A | 문제·해설: 위치의 1차·2차 미분과 t=1 대입, 원 기출과 변형 함수가 달라 기출 그림을 가져올 수 없다. |
| 05 | EXEMPT | BENEFICIAL | `q5-solution.svg` | `q05-solution.plan.json` (유지) | PASS | 정적 대조 / RENDER_NOT_RUN | 문제: a의 수평선 위치가 미정이다. 해설: y=x³−3x²+2의 극대 (0,2), 극소 (2,−2), 기준선 y=±2와 3실근 조건. |
| 06 | EXEMPT | BENEFICIAL | 유사판 없음; 기출 `q6-solution-v2.svg` | `q06-solution.plan.json` (유지) | PASS | 정적 대조 / RENDER_NOT_RUN | 문제: m 미정으로 교점·면적 조건을 식으로 제시. 해설: m=5의 포물선과 직선 y=−10x, 교점 0·9, 곡선 위·직선 아래 넓이 243만 색칠한다. |
| 07 | EXEMPT | BENEFICIAL | `q7-solution.svg` | `q07-solution.plan.json` (유지) | PASS | 정적 대조 / RENDER_NOT_RUN | 문제: 홀삼차함수의 계수 미정. 해설: f=x³−27x의 절댓값 54를 축 u=x/3, v=f(3u)/54로 **정확히 정규화**해 y=±1 수평선과 4교점을 그리며 캡션에 변환을 밝힌다. |
| 08 | EXEMPT | EXEMPT | 유사판 없음 | 없음 | N/A | N/A | 정적분으로 정의된 함수의 적분상수를 연립 계산하며 도형이 답을 추가 설명하지 않는다. |
| 09 | EXEMPT | EXEMPT | 유사판 없음 | 없음 | N/A | N/A | 각 n에 대한 부정적분·망원합을 계산하므로 그림 없이 완결된다. |
| 10 | EXEMPT | BENEFICIAL | 유사판 없음; 기출 `q10-solution-v3.svg` | `q10-solution.plan.json` (유지) | PASS | 정적 대조 / RENDER_NOT_RUN | 문제: n의 최솟값을 찾아야 해 두 경우 그래프를 노출하지 않는다. 해설: n=2 조건 실패·n=4 성공을 각각 정확한 최솟점의 두 패널로 비교한다. |
| 11 | EXEMPT | EXEMPT | 유사판 없음; 기출 `q11-solution.svg` | 없음 | N/A | N/A | 일반 다항함수 차수 반례·짝함수의 최소값을 문장과 대수적 증명으로 판단한다. 특정 예시 곡선을 본문 조건인 듯 추가하지 않는다. |
| 12 | EXEMPT | BENEFICIAL | 유사판 없음; 기출 `q12-solution-v3.svg` | `q12-solution.plan.json` (유지) | PASS | 정적 대조 / RENDER_NOT_RUN | 문제: 적분함수 자체가 값 결정 전에는 추론 대상. 해설: f(x)=4x²−14x+37/2의 [1,5/2] 최솟점 (7/4,25/4) 및 양끝 최댓값 17/2. |
| 13 | EXEMPT | BENEFICIAL | 유사판 없음; 기출 `q13-solution.svg` | `q13-solution.plan.json` (유지) | PASS | 정적 대조 / RENDER_NOT_RUN | 문제: 삼차함수 극점 개수의 판별식 조건만 요구. 해설: a∈(−1−√6,−1+√6)의 정수 −3,−2,−1,0, a=1 제외를 수직선에 표시. |
| 14 | EXEMPT | BENEFICIAL | `q14-solution.svg` | `q14-solution.plan.json` (유지) | PASS | 정적 대조 / RENDER_NOT_RUN | 문제: g의 치역과 f의 최솟값을 도출해야 함. 해설: 합성 입력 u≥1에서 f(1)=46, f(3)=14, f(4)=55의 계수·극값이 현행 유사판과 맞는다. |
| 15 | EXEMPT | BENEFICIAL | 유사판 없음; 기출 `q15-solution-v3.svg` | `q15-solution.plan.json` (유지) | PASS | 정적 대조 / RENDER_NOT_RUN | 문제: 두 운동점의 만남 횟수·속도 매개변수를 구하는 식 조건. 해설: k=6, t=3에서 두 위치 곡선이 (3,36)에서 접함. |
| 16 | EXEMPT | BENEFICIAL | 유사판 없음; 기출 `q16-solution-v2.svg` | `q16-solution.plan.json` (유지) | PASS | 정적 대조 / RENDER_NOT_RUN | 문제: 미정 사차함수와 부호조건만 명시. 해설: f=t²(t−6)(t−14)의 근과 6<t<14 음의 구간·g의 3<x<7 감소를 표시. |
| 17 | EXEMPT | BENEFICIAL | 유사판 없음; 기출 `q17-solution-v2.svg` | `q17-solution.plan.json` (유지) | PASS | 정적 대조 / RENDER_NOT_RUN | 문제: a,b 및 극소 m을 구해야 함. 해설: f=(x−2)²(x−5)의 극대 (2,0), 극소 (4,−4) 및 x=5 근. |
| 18 | EXEMPT | EXEMPT | 유사판 없음 | 없음 | N/A | N/A | 적분식을 두 번 미분하고 x=1의 조건을 대입해 상수값을 구한다. |
| 19 | EXEMPT | BENEFICIAL | `q19-solution.svg` | `q19-solution.plan.json` (유지) | PASS | 정적 대조 / RENDER_NOT_RUN | 문제: 접합점 t, 극점은 해법에서 정해야 함. 해설: f=x²(x−3), g가 x=3에서 부호 반전, 극댓값 (0,0)·(3,0), 극솟점 (2,−4). |
| 20 | EXEMPT | BENEFICIAL | `q20-solution.svg` | `q20-solution.plan.json` (유지) | PASS | 정적 대조 / RENDER_NOT_RUN | 문제: 위치식만 주어 방향 전환 시점은 미정. 해설: x(t)=2t³−9t²+12t의 t=1·2 방향 전환과 x=5·4, t=3에서 x=9. |
| 21 | EXEMPT | BENEFICIAL | 유사판 없음; 기출 `q21-solution-v2.svg` | `q21-solution.plan.json` (유지) | PASS | 정적 대조 / RENDER_NOT_RUN | 문제: f′ 최솟값을 구할 조건만 주어진다. 해설: a=5/3 경계의 두 도함수 차의 완전제곱 부호를 두 패널로 구별한다. |
| 22 | EXEMPT | BENEFICIAL | 유사판 없음; 기출 `q22-solution-v3.svg` | `q22-solution.plan.json` (유지) | PASS | 정적 대조 / RENDER_NOT_RUN | 문제: f,g 미정인 상태에서 정답 그림 배제. 해설: g의 (1/2,−1) 극솟점, x=2 수평변곡과 정확한 사차식을 보존한다. |

### 재검증 후 인계

- 기존 15개 plan **그대로 보존**; 새로 추가한 것은 이 22문항 통합 감사표와 원 기출 변형 차이 기록뿐이다. 기존 44개 축별 세부 장부는 아래에 유지해 추적 가능성을 잃지 않았다.
- `ENGINE_CAPABILITY_PENDING`으로 판정한 필수 축은 0이나, **Chromium 실행 불가로 출력 자체의 시각 검수는 미실행**이다. 좌표 라벨·겹침·투명 배경·학생 화면·A4 출력은 실제 렌더 가능한 환경에서 검증해야 한다.

- 원문: `archive/exams/similar/high/h2/2final/25_매산고_2학기_기말_고2_수학II_유사.js` / 최신 main 기준 원문 조건·수학·에셋을 각각 직접 대조.
- **22문항·44축 전수:** 엔진 실행형 JSON **15**, 독립 그림 EXEMPT **29**, 미지원 **0**.
- 실제 연결된 원본 SVG **5개** 중 흰색 배경 rect **5개** 발견. 원본은 변경하지 않고 새 plan에 불필요한 바탕/면 채움을 넣지 않음.
- plan-lint shallow/full: **15/15 PASS**. 정적 1:1은 발문·원본 도형의 점/선/눈금/면적 ↔ plan의 실제 그려지는 필드를 확인한 결과다.
- Chrome 실물 실행 본체 없음: 렌더·PNG·학생화면·A4 **RENDER_NOT_RUN**. 픽셀·시각적 결과는 PASS가 아님.
- 원문 JS, 기존 원본 SVG/PNG, 다른 시험지, 엔진 소스는 변경하지 않았음. 이 장부와 실행형 JSON만 본 경로에 추가.

| 파일/qid | 축 | 기존결함/판정·실제 복원 | 원문 이미지/발문 | 원본 배경 | capability | plan 경로 | plan-lint shallow/full | sourceVsPlan | DRAWN_FEATURE_PARITY | 렌더 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 25_매산고_2학기_기말_고2_수학II_유사/q01 | 문항 | EXEMPT: 극솟값: 문제 발문·수식·표가 도형 없이 조건을 완결함. | `원문 발문·해설` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_매산고_2학기_기말_고2_수학II_유사/q01 | 해설 | PLAN: a=2 대입한 삼차함수 x³−12x+9에서 x=2의 극솟점 (2,−7)과 도함수 부호변화 | `원문 발문·해설` | — | `polynomial-spike-v1` | `archive/tools/geometry-equation/production/plans/25_매산고_2학기_기말_고2_수학II_유사/q01-solution.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
| 25_매산고_2학기_기말_고2_수학II_유사/q02 | 문항 | EXEMPT: 부정적분: 문제 발문·수식·표가 도형 없이 조건을 완결함. | `원문 발문·해설` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_매산고_2학기_기말_고2_수학II_유사/q02 | 해설 | EXEMPT: 부정적분: 해설의 계산·식 전개·분포표가 완결되어 별도 도형은 중복됨. | `원문 발문·해설` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_매산고_2학기_기말_고2_수학II_유사/q03 | 문항 | EXEMPT: 정적분: 문제 발문·수식·표가 도형 없이 조건을 완결함. | `원문 발문·해설` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_매산고_2학기_기말_고2_수학II_유사/q03 | 해설 | EXEMPT: 정적분: 해설의 계산·식 전개·분포표가 완결되어 별도 도형은 중복됨. | `원문 발문·해설` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_매산고_2학기_기말_고2_수학II_유사/q04 | 문항 | EXEMPT: 속도와 가속도: 문제 발문·수식·표가 도형 없이 조건을 완결함. | `원문 발문·해설` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_매산고_2학기_기말_고2_수학II_유사/q04 | 해설 | EXEMPT: 속도와 가속도: 해설의 계산·식 전개·분포표가 완결되어 별도 도형은 중복됨. | `원문 발문·해설` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_매산고_2학기_기말_고2_수학II_유사/q05 | 문항 | EXEMPT: 방정식의 실근: 문제 발문·수식·표가 도형 없이 조건을 완결함. | `원문 발문·해설` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_매산고_2학기_기말_고2_수학II_유사/q05 | 해설 | PLAN: 원본 q5-solution.svg의 삼차곡선, 극댓값 2·극솟값 −2 및 수평기준선 y=2·−2 | `archive/assets/images/25_매산고_2학기_기말_고2_수학II_유사/q5-solution.svg` | 배경 흰 rect 확인 | `piecewise-polynomial-spike-v1` | `archive/tools/geometry-equation/production/plans/25_매산고_2학기_기말_고2_수학II_유사/q05-solution.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
| 25_매산고_2학기_기말_고2_수학II_유사/q06 | 문항 | EXEMPT: 도형의 넓이: 문제 발문·수식·표가 도형 없이 조건을 완결함. | `원문 발문·해설` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_매산고_2학기_기말_고2_수학II_유사/q06 | 해설 | PLAN: 포물선·직선의 교점 (0,0)·(9,−90), 면적 S=243의 필수 영역만 음영 | `원문 발문·해설` | — | `piecewise-polynomial-spike-v1` | `archive/tools/geometry-equation/production/plans/25_매산고_2학기_기말_고2_수학II_유사/q06-solution.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
| 25_매산고_2학기_기말_고2_수학II_유사/q07 | 문항 | EXEMPT: 홀함수와 방정식: 문제 발문·수식·표가 도형 없이 조건을 완결함. | `원문 발문·해설` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_매산고_2학기_기말_고2_수학II_유사/q07 | 해설 | PLAN: 원본 q7-solution.svg의 홀삼차 그래프, y=±1 정규화 수평선, 극점 (−1,1)·(1,−1) | `archive/assets/images/25_매산고_2학기_기말_고2_수학II_유사/q7-solution.svg` | 배경 흰 rect 확인 | `piecewise-polynomial-spike-v1` | `archive/tools/geometry-equation/production/plans/25_매산고_2학기_기말_고2_수학II_유사/q07-solution.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
| 25_매산고_2학기_기말_고2_수학II_유사/q08 | 문항 | EXEMPT: 정적분으로 정의된 함수: 문제 발문·수식·표가 도형 없이 조건을 완결함. | `원문 발문·해설` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_매산고_2학기_기말_고2_수학II_유사/q08 | 해설 | EXEMPT: 정적분으로 정의된 함수: 해설의 계산·식 전개·분포표가 완결되어 별도 도형은 중복됨. | `원문 발문·해설` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_매산고_2학기_기말_고2_수학II_유사/q09 | 문항 | EXEMPT: 부정적분: 문제 발문·수식·표가 도형 없이 조건을 완결함. | `원문 발문·해설` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_매산고_2학기_기말_고2_수학II_유사/q09 | 해설 | EXEMPT: 부정적분: 해설의 계산·식 전개·분포표가 완결되어 별도 도형은 중복됨. | `원문 발문·해설` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_매산고_2학기_기말_고2_수학II_유사/q10 | 문항 | EXEMPT: 부등식과 미분: 문제 발문·수식·표가 도형 없이 조건을 완결함. | `원문 발문·해설` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_매산고_2학기_기말_고2_수학II_유사/q10 | 해설 | PLAN: 짝수 n=2에서는 x=1의 최솟값 −1로 조건 실패, n=4에서는 최솟값 1>0으로 성공을 두 패널에서 대조 | `원문 발문·해설` | — | `composite-panels-v1` | `archive/tools/geometry-equation/production/plans/25_매산고_2학기_기말_고2_수학II_유사/q10-solution.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
| 25_매산고_2학기_기말_고2_수학II_유사/q11 | 문항 | EXEMPT: 다항함수의 성질: 문제 발문·수식·표가 도형 없이 조건을 완결함. | `원문 발문·해설` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_매산고_2학기_기말_고2_수학II_유사/q11 | 해설 | EXEMPT: 다항함수의 성질: 해설의 계산·식 전개·분포표가 완결되어 별도 도형은 중복됨. | `원문 발문·해설` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_매산고_2학기_기말_고2_수학II_유사/q12 | 문항 | EXEMPT: 적분과 최댓값·최솟값: 문제 발문·수식·표가 도형 없이 조건을 완결함. | `원문 발문·해설` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_매산고_2학기_기말_고2_수학II_유사/q12 | 해설 | PLAN: 구간 1≤x≤5/2의 적분함수 최솟값 25/4와 양 끝 최댓값 17/2 | `원문 발문·해설` | — | `piecewise-polynomial-spike-v1` | `archive/tools/geometry-equation/production/plans/25_매산고_2학기_기말_고2_수학II_유사/q12-solution.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
| 25_매산고_2학기_기말_고2_수학II_유사/q13 | 문항 | EXEMPT: 극값의 개수: 문제 발문·수식·표가 도형 없이 조건을 완결함. | `원문 발문·해설` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_매산고_2학기_기말_고2_수학II_유사/q13 | 해설 | PLAN: 도함수 판별식 >0의 두 무리근 경계 −1±√6, 정수 −3·−2·−1·0 포함과 a=1 삼차함수 제외 표시 | `원문 발문·해설` | — | `number-line-figure-v1` | `archive/tools/geometry-equation/production/plans/25_매산고_2학기_기말_고2_수학II_유사/q13-solution.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
| 25_매산고_2학기_기말_고2_수학II_유사/q14 | 문항 | EXEMPT: 합성함수와 방정식: 문제 발문·수식·표가 도형 없이 조건을 완결함. | `원문 발문·해설` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_매산고_2학기_기말_고2_수학II_유사/q14 | 해설 | PLAN: 원본 q14-solution.svg의 합성 입력 u의 구간, 점 (1,46)·(3,14)·(4,55), 곡선·좌표 | `archive/assets/images/25_매산고_2학기_기말_고2_수학II_유사/q14-solution.svg` | 배경 흰 rect 확인 | `piecewise-polynomial-spike-v1` | `archive/tools/geometry-equation/production/plans/25_매산고_2학기_기말_고2_수학II_유사/q14-solution.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
| 25_매산고_2학기_기말_고2_수학II_유사/q15 | 문항 | EXEMPT: 속도: 문제 발문·수식·표가 도형 없이 조건을 완결함. | `원문 발문·해설` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_매산고_2학기_기말_고2_수학II_유사/q15 | 해설 | PLAN: 최댓값 k=6인 경계에서 점 P의 위치 s₁(t)=10t²−2t³과 Q의 위치 s₂(t)=18+6t가 t=3, 위치 36에서 접함 | `원문 발문·해설` | — | `piecewise-polynomial-spike-v1` | `archive/tools/geometry-equation/production/plans/25_매산고_2학기_기말_고2_수학II_유사/q15-solution.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
| 25_매산고_2학기_기말_고2_수학II_유사/q16 | 문항 | EXEMPT: 사차함수와 적분함수: 문제 발문·수식·표가 도형 없이 조건을 완결함. | `원문 발문·해설` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_매산고_2학기_기말_고2_수학II_유사/q16 | 해설 | PLAN: f(t)=t²(t−6)(t−14)의 근 0(중근)·6·14와 음수 구간 (6,14)을 표시, t=2x에서 g가 감소하는 3<x<7에 대응 | `원문 발문·해설` | — | `polynomial-spike-v1` | `archive/tools/geometry-equation/production/plans/25_매산고_2학기_기말_고2_수학II_유사/q16-solution.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
| 25_매산고_2학기_기말_고2_수학II_유사/q17 | 문항 | EXEMPT: 극댓값과 극솟값: 문제 발문·수식·표가 도형 없이 조건을 완결함. | `원문 발문·해설` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_매산고_2학기_기말_고2_수학II_유사/q17 | 해설 | PLAN: 삼차함수의 극댓점 (2,0), 극솟점 (4,−4), 실근 x=5를 별도 표시 | `원문 발문·해설` | — | `polynomial-spike-v1` | `archive/tools/geometry-equation/production/plans/25_매산고_2학기_기말_고2_수학II_유사/q17-solution.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
| 25_매산고_2학기_기말_고2_수학II_유사/q18 | 문항 | EXEMPT: 적분방정식: 문제 발문·수식·표가 도형 없이 조건을 완결함. | `원문 발문·해설` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_매산고_2학기_기말_고2_수학II_유사/q18 | 해설 | EXEMPT: 적분방정식: 해설의 계산·식 전개·분포표가 완결되어 별도 도형은 중복됨. | `원문 발문·해설` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_매산고_2학기_기말_고2_수학II_유사/q19 | 문항 | EXEMPT: 연속과 삼차함수: 문제 발문·수식·표가 도형 없이 조건을 완결함. | `원문 발문·해설` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_매산고_2학기_기말_고2_수학II_유사/q19 | 해설 | PLAN: 원본 q19-solution.svg의 꺾이는 x=3, 극댓점 (0,0)·(3,0), 극솟점 (2,−4) | `archive/assets/images/25_매산고_2학기_기말_고2_수학II_유사/q19-solution.svg` | 배경 흰 rect 확인 | `piecewise-polynomial-spike-v1` | `archive/tools/geometry-equation/production/plans/25_매산고_2학기_기말_고2_수학II_유사/q19-solution.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
| 25_매산고_2학기_기말_고2_수학II_유사/q20 | 문항 | EXEMPT: 운동 방향: 문제 발문·수식·표가 도형 없이 조건을 완결함. | `원문 발문·해설` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_매산고_2학기_기말_고2_수학II_유사/q20 | 해설 | PLAN: 원본 q20-solution.svg의 위치 x(t), 방향전환 t=1·2와 x=5·4, x(3)=9 | `archive/assets/images/25_매산고_2학기_기말_고2_수학II_유사/q20-solution.svg` | 배경 흰 rect 확인 | `piecewise-polynomial-spike-v1` | `archive/tools/geometry-equation/production/plans/25_매산고_2학기_기말_고2_수학II_유사/q20-solution.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
| 25_매산고_2학기_기말_고2_수학II_유사/q21 | 문항 | EXEMPT: 삼차함수와 극값: 문제 발문·수식·표가 도형 없이 조건을 완결함. | `원문 발문·해설` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_매산고_2학기_기말_고2_수학II_유사/q21 | 해설 | PLAN: 등호 a=5/3에서 f′−g′=−4/3(x+1)²≤0, f′−h′=5/3(x−1)²≥0, x=−1·1 접점을 서로 다른 패널로 제시 | `원문 발문·해설` | — | `composite-panels-v1` | `archive/tools/geometry-equation/production/plans/25_매산고_2학기_기말_고2_수학II_유사/q21-solution.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
| 25_매산고_2학기_기말_고2_수학II_유사/q22 | 문항 | EXEMPT: 도함수와 극값: 문제 발문·수식·표가 도형 없이 조건을 완결함. | `원문 발문·해설` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_매산고_2학기_기말_고2_수학II_유사/q22 | 해설 | PLAN: 함수 g의 극솟점 (1/2,−1), x=2의 수평변곡 및 정확한 사차곡선 | `원문 발문·해설` | — | `polynomial-spike-v1` | `archive/tools/geometry-equation/production/plans/25_매산고_2학기_기말_고2_수학II_유사/q22-solution.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
