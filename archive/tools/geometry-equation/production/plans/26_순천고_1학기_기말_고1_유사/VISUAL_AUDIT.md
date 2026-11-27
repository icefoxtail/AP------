# 유사시험지 SVG 플랜 2축 전수감사 — 고1

- 대상: `archive/exams/similar/high/h1/1final/26_순천고_1학기_기말_고1_유사.js`
- 분모: 23문항, 문제 23축 + 해설 23축 = 46축
- 판정: `EXEMPT`는 도식이 계산·조건 해석에 추가 정보를 주지 않는 축만 사용. `FIELD_PASS`는 원문 조건과 엔진이 그리는 JSON 필드의 정적 대응 확인이며, SVG 실제 렌더·PNG 시인성·학생 화면·A4는 `NOT_RUN`이다.
- 생성 계획은 모두 공식 `plan-lint.cjs` shallow/full 검증 대상. 이미지 에셋과 최신 JS는 수정하지 않는다. 모든 새 plan의 면 채움은 생략하였다.
- **ENGINE_CAPABILITY_PENDING q11 해설:** 도출 계수 `a=6`인 포물선 `6x²−18x−8`과 `[-1,6]`의 양 끝·직선 교점을 한 패널에 표시하려는 후보가 `EQUAL_UNIT_PARABOLA_TOO_NARROW`로 엔진 거절. 필요한 기능: 서로 다른 x/y 축척을 수학 그래프에서도 명시적으로 표시할 수 있는 안전한 비율 선택/가독성 검증과 직선·교점·최댓값 라벨. 실패 JSON은 추가하지 않음.

| 파일/qid | 축 | 기존결함/판정 | capability | plan경로 | shallow/full | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|---|
| 26_순천고_1학기_기말_고1_유사/q01 | problem | EXEMPT — 약수 개수의 곱셈 원리; 발문·식/표로 충분 | — | — | N/A | EXEMPT |
| 26_순천고_1학기_기말_고1_유사/q01 | solution | EXEMPT — 약수 개수의 곱셈 원리; 발문·식/표로 충분 | — | — | N/A | EXEMPT |
| 26_순천고_1학기_기말_고1_유사/q02 | problem | EXEMPT — 행렬 곱과 연립계산; 발문·식/표로 충분 | — | — | N/A | EXEMPT |
| 26_순천고_1학기_기말_고1_유사/q02 | solution | EXEMPT — 행렬 곱과 연립계산; 발문·식/표로 충분 | — | — | N/A | EXEMPT |
| 26_순천고_1학기_기말_고1_유사/q03 | problem | EXEMPT — 회장·부회장 경우의 수; 발문·식/표로 충분 | — | — | N/A | EXEMPT |
| 26_순천고_1학기_기말_고1_유사/q03 | solution | EXEMPT — 회장·부회장 경우의 수; 발문·식/표로 충분 | — | — | N/A | EXEMPT |
| 26_순천고_1학기_기말_고1_유사/q04 | problem | EXEMPT — 행렬 성분 계산; 발문·식/표로 충분 | — | — | N/A | EXEMPT |
| 26_순천고_1학기_기말_고1_유사/q04 | solution | EXEMPT — 행렬 성분 계산; 발문·식/표로 충분 | — | — | N/A | EXEMPT |
| 26_순천고_1학기_기말_고1_유사/q05 | problem | EXEMPT — 순열 항등식의 계산; 발문·식/표로 충분 | — | — | N/A | EXEMPT |
| 26_순천고_1학기_기말_고1_유사/q05 | solution | EXEMPT — 순열 항등식의 계산; 발문·식/표로 충분 | — | — | N/A | EXEMPT |
| 26_순천고_1학기_기말_고1_유사/q06 | problem | EXEMPT — 발문의 HTML 표가 조건 정보를 모두 전달, 중복 SVG 불필요 | — | — | N/A | EXEMPT |
| 26_순천고_1학기_기말_고1_유사/q06 | solution | EXEMPT — 행렬 곱 표현과 기존 HTML 표; 발문·식/표로 충분 | — | — | N/A | EXEMPT |
| 26_순천고_1학기_기말_고1_유사/q07 | problem | EXEMPT — 삼차방정식의 근과 계수; 발문·식/표로 충분 | — | — | N/A | EXEMPT |
| 26_순천고_1학기_기말_고1_유사/q07 | solution | EXEMPT — 삼차방정식의 근과 계수; 발문·식/표로 충분 | — | — | N/A | EXEMPT |
| 26_순천고_1학기_기말_고1_유사/q08 | problem | EXEMPT — 허근의 대수적 성질; 발문·식/표로 충분 | — | — | N/A | EXEMPT |
| 26_순천고_1학기_기말_고1_유사/q08 | solution | EXEMPT — 허근의 대수적 성질; 발문·식/표로 충분 | — | — | N/A | EXEMPT |
| 26_순천고_1학기_기말_고1_유사/q09 | problem | EXEMPT — 발문의 HTML 표가 조건 정보를 모두 전달, 중복 SVG 불필요 | — | — | N/A | EXEMPT |
| 26_순천고_1학기_기말_고1_유사/q09 | solution | BENEFICIAL — 열량·단백질의 공통 구간의 상대 위치·도식 관계 보완 | number-line-figure-v1 | `q09-solution.plan.json` | PASS / PASS | FIELD_PASS · 렌더 NOT_RUN |
| 26_순천고_1학기_기말_고1_유사/q10 | problem | EXEMPT — 일차부등식 정수해와 매개변수; 발문·식/표로 충분 | — | — | N/A | EXEMPT |
| 26_순천고_1학기_기말_고1_유사/q10 | solution | EXEMPT — 일차부등식 정수해와 매개변수; 발문·식/표로 충분 | — | — | N/A | EXEMPT |
| 26_순천고_1학기_기말_고1_유사/q11 | problem | EXEMPT — 포물선·직선의 교점과 구간 극값; 발문·식/표로 충분 | — | — | N/A | EXEMPT |
| 26_순천고_1학기_기말_고1_유사/q11 | solution | BENEFICIAL — 포물선·직선·최대점 표시 누락, 엔진 거절로 보강 대기 | polynomial-spike-v1 → ENGINE_CAPABILITY_PENDING | — (실패 후보 제외) | FAIL (EQUAL_UNIT_PARABOLA_TOO_NARROW) | ENGINE_CAPABILITY_PENDING |
| 26_순천고_1학기_기말_고1_유사/q12 | problem | EXEMPT — 세 자리 수의 조합 계산; 발문·식/표로 충분 | — | — | N/A | EXEMPT |
| 26_순천고_1학기_기말_고1_유사/q12 | solution | EXEMPT — 세 자리 수의 조합 계산; 발문·식/표로 충분 | — | — | N/A | EXEMPT |
| 26_순천고_1학기_기말_고1_유사/q13 | problem | EXEMPT — 연립 이차부등식의 매개변수 범위; 발문·식/표로 충분 | — | — | N/A | EXEMPT |
| 26_순천고_1학기_기말_고1_유사/q13 | solution | BENEFICIAL — 연립 이차부등식의 매개변수 범위의 상대 위치·도식 관계 보완 | number-line-figure-v1 | `q13-solution.plan.json` | PASS / PASS | FIELD_PASS · 렌더 NOT_RUN |
| 26_순천고_1학기_기말_고1_유사/q14 | problem | EXEMPT — 두 팀이 인접하지 않는 순열; 발문·식/표로 충분 | — | — | N/A | EXEMPT |
| 26_순천고_1학기_기말_고1_유사/q14 | solution | EXEMPT — 두 팀이 인접하지 않는 순열; 발문·식/표로 충분 | — | — | N/A | EXEMPT |
| 26_순천고_1학기_기말_고1_유사/q15 | problem | EXEMPT — 정수 매개변수의 부등식 자연수해; 발문·식/표로 충분 | — | — | N/A | EXEMPT |
| 26_순천고_1학기_기말_고1_유사/q15 | solution | BENEFICIAL — 정수 매개변수의 부등식 자연수해의 상대 위치·도식 관계 보완 | number-line-figure-v1 | `q15-solution.plan.json` | PASS / PASS | FIELD_PASS · 렌더 NOT_RUN |
| 26_순천고_1학기_기말_고1_유사/q16 | problem | EXEMPT — 이차함수의 구간 극값; 발문·식/표로 충분 | — | — | N/A | EXEMPT |
| 26_순천고_1학기_기말_고1_유사/q16 | solution | BENEFICIAL — 이차함수의 구간 극값의 상대 위치·도식 관계 보완 | polynomial-spike-v1 | `q16-solution.plan.json` | PASS / PASS | FIELD_PASS · 렌더 NOT_RUN |
| 26_순천고_1학기_기말_고1_유사/q17 | problem | EXEMPT — 절댓값 부등식 정수해; 발문·식/표로 충분 | — | — | N/A | EXEMPT |
| 26_순천고_1학기_기말_고1_유사/q17 | solution | BENEFICIAL — 절댓값 부등식 정수해의 상대 위치·도식 관계 보완 | number-line-figure-v1 | `q17-solution.plan.json` | PASS / PASS | FIELD_PASS · 렌더 NOT_RUN |
| 26_순천고_1학기_기말_고1_유사/q18 | problem | BENEFICIAL — 원에 내접한 직사각형과 대각선의 상대 위치·도식 관계 보완 | construction-spike-v1 | `q18-problem.plan.json` | PASS / PASS | FIELD_PASS · 렌더 NOT_RUN |
| 26_순천고_1학기_기말_고1_유사/q18 | solution | BENEFICIAL — 원에 내접한 직사각형과 대각선의 상대 위치·도식 관계 보완 | construction-spike-v1 | `q18-solution.plan.json` | PASS / PASS | FIELD_PASS · 렌더 NOT_RUN |
| 26_순천고_1학기_기말_고1_유사/q19 | problem | REQUIRED — 기출 대비 변경된 절편·교점을 가진 현행 엔진 SVG 유지 | piecewise-polynomial-spike-v1 | `archive/exams/similar/high/h1/1final/26_순천고_1학기_기말_고1_유사_plans/q19-problem.plan.json` | PASS / PASS | FIELD_PASS · 기존 SVG 참조 |
| 26_순천고_1학기_기말_고1_유사/q19 | solution | BENEFICIAL — 두 이차함수 그래프에서 0<f<g의 상대 위치·도식 관계 보완 | number-line-figure-v1 | `q19-solution.plan.json` | PASS / PASS | FIELD_PASS · 렌더 NOT_RUN |
| 26_순천고_1학기_기말_고1_유사/q20 | problem | EXEMPT — 판매가와 이익의 이차함수 최대; 발문·식/표로 충분 | — | — | N/A | EXEMPT |
| 26_순천고_1학기_기말_고1_유사/q20 | solution | BENEFICIAL — 판매가와 이익의 이차함수 최대의 상대 위치·도식 관계 보완 | polynomial-spike-v1 | `q20-solution.plan.json` | PASS / PASS | FIELD_PASS · 렌더 NOT_RUN |
| 26_순천고_1학기_기말_고1_유사/q21 | problem | EXEMPT — 연립 이차방정식 풀이; 발문·식/표로 충분 | — | — | N/A | EXEMPT |
| 26_순천고_1학기_기말_고1_유사/q21 | solution | EXEMPT — 연립 이차방정식 풀이; 발문·식/표로 충분 | — | — | N/A | EXEMPT |
| 26_순천고_1학기_기말_고1_유사/q22 | problem | EXEMPT — 다항식 나눗셈·근 계산; 발문·식/표로 충분 | — | — | N/A | EXEMPT |
| 26_순천고_1학기_기말_고1_유사/q22 | solution | EXEMPT — 다항식 나눗셈·근 계산; 발문·식/표로 충분 | — | — | N/A | EXEMPT |
| 26_순천고_1학기_기말_고1_유사/q23 | problem | EXEMPT — 주스·빵 배분의 경우의 수; 발문·식/표로 충분 | — | — | N/A | EXEMPT |
| 26_순천고_1학기_기말_고1_유사/q23 | solution | EXEMPT — 주스·빵 배분의 경우의 수; 발문·식/표로 충분 | — | — | N/A | EXEMPT |

## 원문·에셋 대조 기준

- 2026 순천고 **기출**의 `archive/assets/images/26_순천고_1학기_기말_고1_기출/qNN-solution*.svg` 및 q19 원본 PNG와 기하 구성 종류(곡선/직선/구간, 원·사각형·대각선, 끝점)를 대조. 유사문항에서 값은 달라졌으므로 기출 수치를 그대로 재사용하지 않음.
- q18 직각 2개, 원 1개, 직사각형 4변, 대각선 1개, 130 치수, 가로/세로 `12k:5k`(문제)·`120:50`(해설) 필드 확인. q19 문제 기존 원본 엔진 SVG는 변경하지 않음.
- q09[50,75], q13[-2,0], q15(4,7), q17[-5,6], q19 `f>0 ∩ f<g = (-7,-5)` 등 수직선의 열린/닫힌 끝점과 정수점, q16·q20의 계수·극값 좌표를 확인.
