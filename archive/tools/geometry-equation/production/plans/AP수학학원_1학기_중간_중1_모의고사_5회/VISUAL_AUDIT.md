# 유사시험지 SVG 플랜 2축 전수감사 — 중1

- 대상: `archive/exams/similar/middle/m1/1mid/AP수학학원_1학기_중간_중1_모의고사_5회.js`
- 분모: 25문항, 문제 25축 + 해설 25축 = 50축
- 판정: `EXEMPT`는 도식이 계산·조건 해석에 추가 정보를 주지 않는 축만 사용. `FIELD_PASS`는 원문 조건과 엔진이 그리는 JSON 필드의 정적 대응 확인이며, SVG 실제 렌더·PNG 시인성·학생 화면·A4는 `NOT_RUN`이다.
- 생성 계획은 모두 공식 `plan-lint.cjs` shallow/full 검증 대상. 이미지 에셋과 최신 JS는 수정하지 않는다. 모든 새 plan의 면 채움은 생략하였다.
- **범위 밖 핵심 원문 결함:** JS 25/25 해설이 모두 무관한 “절댓값의 경계점” 공통 문구. 그림 계획은 발문·정답에서 재검산한 수학 조건으로 작성했고 JS 해설 교정은 이 SVG plan 전용 PR에 넣지 않는다.

| 파일/qid | 축 | 기존결함/판정 | capability | plan경로 | shallow/full | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|---|
| AP수학학원_1학기_중간_중1_모의고사_5회/q01 | problem | EXEMPT — 합성수 개수 판별; 발문·식/표로 충분 | — | — | N/A | EXEMPT |
| AP수학학원_1학기_중간_중1_모의고사_5회/q01 | solution | EXEMPT — 합성수 개수 판별; 발문·식/표로 충분 · **현행 JS 해설 원문 불일치** | — | — | N/A | EXEMPT |
| AP수학학원_1학기_중간_중1_모의고사_5회/q02 | problem | EXEMPT — 거듭제곱 정의 구별; 발문·식/표로 충분 | — | — | N/A | EXEMPT |
| AP수학학원_1학기_중간_중1_모의고사_5회/q02 | solution | EXEMPT — 거듭제곱 정의 구별; 발문·식/표로 충분 · **현행 JS 해설 원문 불일치** | — | — | N/A | EXEMPT |
| AP수학학원_1학기_중간_중1_모의고사_5회/q03 | problem | EXEMPT — 소인수분해로 제곱수 판별; 발문·식/표로 충분 | — | — | N/A | EXEMPT |
| AP수학학원_1학기_중간_중1_모의고사_5회/q03 | solution | EXEMPT — 소인수분해로 제곱수 판별; 발문·식/표로 충분 · **현행 JS 해설 원문 불일치** | — | — | N/A | EXEMPT |
| AP수학학원_1학기_중간_중1_모의고사_5회/q04 | problem | EXEMPT — 약수 여부 계산; 발문·식/표로 충분 | — | — | N/A | EXEMPT |
| AP수학학원_1학기_중간_중1_모의고사_5회/q04 | solution | EXEMPT — 약수 여부 계산; 발문·식/표로 충분 · **현행 JS 해설 원문 불일치** | — | — | N/A | EXEMPT |
| AP수학학원_1학기_중간_중1_모의고사_5회/q05 | problem | EXEMPT — 공약수의 개수 계산; 발문·식/표로 충분 | — | — | N/A | EXEMPT |
| AP수학학원_1학기_중간_중1_모의고사_5회/q05 | solution | EXEMPT — 공약수의 개수 계산; 발문·식/표로 충분 · **현행 JS 해설 원문 불일치** | — | — | N/A | EXEMPT |
| AP수학학원_1학기_중간_중1_모의고사_5회/q06 | problem | EXEMPT — 최대공약수 지수 비교; 발문·식/표로 충분 | — | — | N/A | EXEMPT |
| AP수학학원_1학기_중간_중1_모의고사_5회/q06 | solution | EXEMPT — 최대공약수 지수 비교; 발문·식/표로 충분 · **현행 JS 해설 원문 불일치** | — | — | N/A | EXEMPT |
| AP수학학원_1학기_중간_중1_모의고사_5회/q07 | problem | EXEMPT — 두 분수의 공배수 계산; 발문·식/표로 충분 | — | — | N/A | EXEMPT |
| AP수학학원_1학기_중간_중1_모의고사_5회/q07 | solution | EXEMPT — 두 분수의 공배수 계산; 발문·식/표로 충분 · **현행 JS 해설 원문 불일치** | — | — | N/A | EXEMPT |
| AP수학학원_1학기_중간_중1_모의고사_5회/q08 | problem | EXEMPT — 수직선 도식은 정답 −4를 곧바로 드러내므로 해설 축에만 제공 | — | — | N/A | EXEMPT |
| AP수학학원_1학기_중간_중1_모의고사_5회/q08 | solution | BENEFICIAL — 수직선 위 유리수의 순서의 상대 위치·도식 관계 보완 · **현행 JS 해설 원문 불일치** | number-line-figure-v1 | `q08-solution.plan.json` | PASS / PASS | FIELD_PASS · 렌더 NOT_RUN |
| AP수학학원_1학기_중간_중1_모의고사_5회/q09 | problem | EXEMPT — 절댓값 수치 비교; 발문·식/표로 충분 | — | — | N/A | EXEMPT |
| AP수학학원_1학기_중간_중1_모의고사_5회/q09 | solution | EXEMPT — 절댓값 수치 비교; 발문·식/표로 충분 · **현행 JS 해설 원문 불일치** | — | — | N/A | EXEMPT |
| AP수학학원_1학기_중간_중1_모의고사_5회/q10 | problem | EXEMPT — 부등식의 정수해 개수; 발문·식/표로 충분 | — | — | N/A | EXEMPT |
| AP수학학원_1학기_중간_중1_모의고사_5회/q10 | solution | BENEFICIAL — 부등식의 정수해 개수의 상대 위치·도식 관계 보완 · **현행 JS 해설 원문 불일치** | number-line-figure-v1 | `q10-solution.plan.json` | PASS / PASS | FIELD_PASS · 렌더 NOT_RUN |
| AP수학학원_1학기_중간_중1_모의고사_5회/q11 | problem | EXEMPT — 사칙연산 값 비교; 발문·식/표로 충분 | — | — | N/A | EXEMPT |
| AP수학학원_1학기_중간_중1_모의고사_5회/q11 | solution | EXEMPT — 사칙연산 값 비교; 발문·식/표로 충분 · **현행 JS 해설 원문 불일치** | — | — | N/A | EXEMPT |
| AP수학학원_1학기_중간_중1_모의고사_5회/q12 | problem | EXEMPT — 원/달러 등락표가 현행 HTML로 이미 제시되어 보조 SVG 불필요 | — | — | N/A | EXEMPT |
| AP수학학원_1학기_중간_중1_모의고사_5회/q12 | solution | EXEMPT — 환율 등락 표의 합산; 발문·식/표로 충분 · **현행 JS 해설 원문 불일치** | — | — | N/A | EXEMPT |
| AP수학학원_1학기_중간_중1_모의고사_5회/q13 | problem | EXEMPT — 음수 거듭제곱 계산; 발문·식/표로 충분 | — | — | N/A | EXEMPT |
| AP수학학원_1학기_중간_중1_모의고사_5회/q13 | solution | EXEMPT — 음수 거듭제곱 계산; 발문·식/표로 충분 · **현행 JS 해설 원문 불일치** | — | — | N/A | EXEMPT |
| AP수학학원_1학기_중간_중1_모의고사_5회/q14 | problem | EXEMPT — 유리수 곱셈·나눗셈; 발문·식/표로 충분 | — | — | N/A | EXEMPT |
| AP수학학원_1학기_중간_중1_모의고사_5회/q14 | solution | EXEMPT — 유리수 곱셈·나눗셈; 발문·식/표로 충분 · **현행 JS 해설 원문 불일치** | — | — | N/A | EXEMPT |
| AP수학학원_1학기_중간_중1_모의고사_5회/q15 | problem | EXEMPT — 분수 혼합 연산; 발문·식/표로 충분 | — | — | N/A | EXEMPT |
| AP수학학원_1학기_중간_중1_모의고사_5회/q15 | solution | EXEMPT — 분수 혼합 연산; 발문·식/표로 충분 · **현행 JS 해설 원문 불일치** | — | — | N/A | EXEMPT |
| AP수학학원_1학기_중간_중1_모의고사_5회/q16 | problem | EXEMPT — 정사각형에서 직사각형으로 비율 변형; 발문·식/표로 충분 | — | — | N/A | EXEMPT |
| AP수학학원_1학기_중간_중1_모의고사_5회/q16 | solution | BENEFICIAL — 정사각형에서 직사각형으로 비율 변형의 상대 위치·도식 관계 보완 · **현행 JS 해설 원문 불일치** | construction-spike-v1 | `q16-solution.plan.json` | PASS / PASS | FIELD_PASS · 렌더 NOT_RUN |
| AP수학학원_1학기_중간_중1_모의고사_5회/q17 | problem | EXEMPT — 문자식의 곱셈기호 생략; 발문·식/표로 충분 | — | — | N/A | EXEMPT |
| AP수학학원_1학기_중간_중1_모의고사_5회/q17 | solution | EXEMPT — 문자식의 곱셈기호 생략; 발문·식/표로 충분 · **현행 JS 해설 원문 불일치** | — | — | N/A | EXEMPT |
| AP수학학원_1학기_중간_중1_모의고사_5회/q18 | problem | EXEMPT — 문자 대입 계산; 발문·식/표로 충분 | — | — | N/A | EXEMPT |
| AP수학학원_1학기_중간_중1_모의고사_5회/q18 | solution | EXEMPT — 문자 대입 계산; 발문·식/표로 충분 · **현행 JS 해설 원문 불일치** | — | — | N/A | EXEMPT |
| AP수학학원_1학기_중간_중1_모의고사_5회/q19 | problem | EXEMPT — 다항식 용어 판별; 발문·식/표로 충분 | — | — | N/A | EXEMPT |
| AP수학학원_1학기_중간_중1_모의고사_5회/q19 | solution | EXEMPT — 다항식 용어 판별; 발문·식/표로 충분 · **현행 JS 해설 원문 불일치** | — | — | N/A | EXEMPT |
| AP수학학원_1학기_중간_중1_모의고사_5회/q20 | problem | EXEMPT — 다항식 연산의 옳고 그름; 발문·식/표로 충분 | — | — | N/A | EXEMPT |
| AP수학학원_1학기_중간_중1_모의고사_5회/q20 | solution | EXEMPT — 다항식 연산의 옳고 그름; 발문·식/표로 충분 · **현행 JS 해설 원문 불일치** | — | — | N/A | EXEMPT |
| AP수학학원_1학기_중간_중1_모의고사_5회/q21 | problem | EXEMPT — 소인수분해 지수의 합; 발문·식/표로 충분 | — | — | N/A | EXEMPT |
| AP수학학원_1학기_중간_중1_모의고사_5회/q21 | solution | EXEMPT — 소인수분해 지수의 합; 발문·식/표로 충분 · **현행 JS 해설 원문 불일치** | — | — | N/A | EXEMPT |
| AP수학학원_1학기_중간_중1_모의고사_5회/q22 | problem | EXEMPT — 최소공배수 소인수분해; 발문·식/표로 충분 | — | — | N/A | EXEMPT |
| AP수학학원_1학기_중간_중1_모의고사_5회/q22 | solution | EXEMPT — 최소공배수 소인수분해; 발문·식/표로 충분 · **현행 JS 해설 원문 불일치** | — | — | N/A | EXEMPT |
| AP수학학원_1학기_중간_중1_모의고사_5회/q23 | problem | EXEMPT — 정수·유리수 분류; 발문·식/표로 충분 | — | — | N/A | EXEMPT |
| AP수학학원_1학기_중간_중1_모의고사_5회/q23 | solution | EXEMPT — 정수·유리수 분류; 발문·식/표로 충분 · **현행 JS 해설 원문 불일치** | — | — | N/A | EXEMPT |
| AP수학학원_1학기_중간_중1_모의고사_5회/q24 | problem | EXEMPT — 잘못된 연산의 역산; 발문·식/표로 충분 | — | — | N/A | EXEMPT |
| AP수학학원_1학기_중간_중1_모의고사_5회/q24 | solution | EXEMPT — 잘못된 연산의 역산; 발문·식/표로 충분 · **현행 JS 해설 원문 불일치** | — | — | N/A | EXEMPT |
| AP수학학원_1학기_중간_중1_모의고사_5회/q25 | problem | EXEMPT — 문자식 통분·정리; 발문·식/표로 충분 | — | — | N/A | EXEMPT |
| AP수학학원_1학기_중간_중1_모의고사_5회/q25 | solution | EXEMPT — 문자식 통분·정리; 발문·식/표로 충분 · **현행 JS 해설 원문 불일치** | — | — | N/A | EXEMPT |

## 원문·에셋 대조 기준

- 현행 JS 문제/해설 이미지 연결 없음. 기존 원본 이미지와 픽셀 1:1 비교할 자료가 없으므로 PNG 대조는 `NOT_RUN`으로 표시.
- q08 수 `7, 9/2, -1/3, -11/4, -4`, q10 열린 `-9/2`와 닫힌 `3`, q16 가로 `11/8cm`·세로 `7/8cm`의 실제 그려지는 필드를 확인.
