# 2024 이수중 중3 1학기 중간 유사 q14~q25 — 문제·해설 SVG 2축 감사

- 현행 JS: `archive/exams/similar/middle/m3/1mid/24_이수중_1학기_중간_중3_유사.js`; 기준 main `011cf3332d64284329de35de5a04c38d40e5fbb8`.
- source Git blob `5df79dc1ec70828c98cf2c99c960e6562398c5c1`, SHA256 `a53bc389652e730d797669e17c55d306ecd620856b509146de03aebe8496bc54`.
- 범위: **q14~q25 12문항, 문제 12축 + 해설 12축 = 24축**. q01~q13은 PR #3166의 완료 감사 범위라 다시 쓰지 않는다.
- 기존 문제용 q14~q25 JSON **12개 모두 `status: EXEMPT` 자리표시자**였고 `capability`는 없었다. 실제 실행형은 아니며 내용은 변경하지 않는다.
- 열린 PR 68건의 변경 파일과 이 정확한 stem의 충돌 없음. #956은 GitHub 변경 파일 API 422로 미확인. 이번 신규 해설 plan은 q23 하나다.

## 독립 2축 판정

| qid | 축 | 판정 | capability | plan 경로(해당 `_plans/` 아래) | plan-lint | DRAWN_FEATURE_PARITY | 문항별·축별 개별 이유 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| q14 | 문제 | EXEMPT | — | q14-problem.plan.json (판정용) | EXEMPT JSON OK | 해당 없음 | `(4x−3)(y+2)`를 전개해 A,B를 비교하는 계수 계산이며 공간 관계가 없다. |
| q14 | 해설 | EXEMPT | — | — | — | 해당 없음 | 4xy+8x−3y−6의 항별 대응으로 A=4,B=8을 보이며 그림은 식의 중복이다. |
| q15 | 문제 | EXEMPT | — | q15-problem.plan.json (판정용) | EXEMPT JSON OK | 해당 없음 | `(3x−2)(2x+A)`의 상수항과 x계수를 비교하는 대수 문항이다. |
| q15 | 해설 | EXEMPT | — | — | — | 해당 없음 | −2A=−6, B=3A−4의 순차 계수 비교가 풀이의 전부다. |
| q16 | 문제 | EXEMPT | — | q16-problem.plan.json (판정용) | EXEMPT JSON OK | 해당 없음 | 합차 공식의 다섯 전개식 참거짓을 비교하므로 도형이 새로운 조건을 주지 않는다. |
| q16 | 해설 | EXEMPT | — | — | — | 해당 없음 | ①의 실제 값 25−x²와 제시된 x²−25의 부호 차이를 식으로 바로 대조한다. |
| q17 | 문제 | EXEMPT | — | q17-problem.plan.json (판정용) | EXEMPT JSON OK | 해당 없음 | 두 다항식의 공통인수 `a−2b`를 구하는 기호 인수분해 문제다. |
| q17 | 해설 | EXEMPT | — | — | — | 해당 없음 | 3a²b−6ab²=3ab(a−2b)의 인수 묶기가 결정적 단계라 그림은 반복이다. |
| q18 | 문제 | EXEMPT | — | q18-problem.plan.json (판정용) | EXEMPT JSON OK | 해당 없음 | 완전제곱식·분배법칙의 전개 결과 다섯 개를 계산해 판정한다. |
| q18 | 해설 | EXEMPT | — | — | — | 해당 없음 | ③의 중간항은 xy가 아니라 2xy임을 교차곱 2(3x)(y/3)으로 설명한다. |
| q19 | 문제 | EXEMPT | — | q19-problem.plan.json (판정용) | EXEMPT JSON OK | 해당 없음 | 15x²−x−2를 조건에 맞는 정수 계수 일차식 두 개로 인수분해한다. |
| q19 | 해설 | EXEMPT | — | — | — | 해당 없음 | (3x+1)(5x−2)로의 항 묶기와 a+b+c+d=7을 식으로 충분히 설명한다. |
| q20 | 문제 | EXEMPT | — | q20-problem.plan.json (판정용) | EXEMPT JSON OK | 해당 없음 | 다섯 인수분해 항등식의 진위를 전개하여 비교하는 계산 문항이다. |
| q20 | 해설 | EXEMPT | — | — | — | 해당 없음 | 올바른 ⑤의 전개 2x²+7x−4와 다른 식의 부호·계수를 직접 대조한다. |
| q21 | 문제 | EXEMPT | — | q21-problem.plan.json (판정용) | EXEMPT JSON OK | 해당 없음 | 7.5²·0.16−2.5²·0.16을 합차 공식으로 계산한다. |
| q21 | 해설 | EXEMPT | — | — | — | 해당 없음 | 0.16(7.5−2.5)(7.5+2.5)=8로 끝나는 숫자 인수분해이므로 그림은 장식이다. |
| q22 | 문제 | EXEMPT | — | q22-problem.plan.json (판정용) | EXEMPT JSON OK | 해당 없음 | 서술형의 두 다항식 전개 후 a,b,c 계수를 정하는 문제다. |
| q22 | 해설 | EXEMPT | — | — | — | 해당 없음 | 5x²−6xy+2y²를 도출해 계수합 1을 계산하는 대수 풀이로 완결된다. |
| q23 | 문제 | EXEMPT | — | q23-problem.plan.json (판정용) | EXEMPT JSON OK | 해당 없음 | 3<x<5의 범위와 두 근호를 이미 식으로 제시하므로 문제 단계에서 수직선 도식은 답 2를 미리 암시할 수 있다. |
| q23 | 해설 | BENEFICIAL | number-line-figure-v1 | q23-solution.plan.json (신규) | shallow/full PASS | NOT_VERIFIED | 두 절댓값이 수직선의 3→x 거리 x−3과 x→5 거리 5−x임을 연결하면 상수 2가 되는 이유를 시각적으로 알 수 있다. |
| q24 | 문제 | EXEMPT | — | q24-problem.plan.json (판정용) | EXEMPT JSON OK | 해당 없음 | (x−3)이 두 다항식의 공통인수라는 인수정리·계수 계산이다. |
| q24 | 해설 | EXEMPT | — | — | — | 해당 없음 | x=3 대입으로 a=−8, b=3을 구하는 두 방정식이 풀이의 전부다. |
| q25 | 문제 | EXEMPT | — | q25-problem.plan.json (판정용) | EXEMPT JSON OK | 해당 없음 | 2025·2026의 정수 곱과 2025²−1을 인수분해해 약분하는 계산이다. |
| q25 | 해설 | EXEMPT | — | — | — | 해당 없음 | 분자 2026(2025−1)과 분모 (2025−1)(2025+1)의 정확한 인수 대조로 끝난다. |

## 실행형 plan의 독립 수학 검산·공식 모델/spec 필드 대조

**q23 해설 `number-line-figure-v1` 신규**:

- 원문 조건은 `3<x<5`뿐이므로 `x`를 **값 없는 문자 점**으로 두고 `between:[P3,P5]`, `order:[P3,x,P5]`를 사용한다. 엔진이 화면에 배정한 대표 위치는 x의 측정값이나 원문 비율이 아니다.
- `solveNumberLineFigure` 모델: POINTS **3점**(P3=3, 문자 x, P5=5), 서로 다른 두 거리 구간 **2개**. `numberLineFigureSpec`의 실제 그리기 대상은 점 3, 수식 라벨 **3, x, 5**와 괄호 길이 표시 **2개**, 라벨 `x-3`, `5-x`다.
- 독립 검산: `sqrt((x−5)^2)+sqrt((x−3)^2)=|x−5|+|x−3|=(5−x)+(x−3)=2`. `sourceConditions` 설명만이 아니라 두 개의 실제 `spans` 객체가 이 길이 관계를 그린다.
- 오직 해설에만 정답 2를 노출한다. q23 문제용 EXEMPT JSON은 변경하지 않았다.
- shallow/full lint PASS와 정적 모델/spec 일치는 **실제 DRAWN_FEATURE_PARITY PASS를 뜻하지 않는다**. 실제 SVG/PNG, 학생 화면/A4 **NOT_RUN / NOT_VERIFIED**.

## 공식 검사·미완료

- 12개 기존 문제 판정 JSON + 신규 실행형 해설 1개 = **13 JSON**. shallow/full 각각 **13/13 OK**(실제 최종 실행으로 다시 확인).
- 실행형 1개 shallow/full 각각 **1/1 PASS**, EXEMPT 판정용 12개 shallow/full 각각 12/12 OK. EXEMPT JSON은 실제 실행형 수에 넣지 않는다.
- 이수중 신규 실행형 **1**, 기존 실행형 교정 **0**, 기존 EXEMPT JSON 교정 **0**, 실제 실행형 총 **1**.
- DRAWN_FEATURE_PARITY **PASS 0 / NOT_VERIFIED 1**; q23 해설 실제 렌더 **NOT_RUN**, 학생 화면/A4 **NOT_VERIFIED**.
- 신규 ENGINE_CAPABILITY_PENDING **0** / EVIDENCE_DEBT **0**. 다른 회차의 미해결은 별도 유지한다.
