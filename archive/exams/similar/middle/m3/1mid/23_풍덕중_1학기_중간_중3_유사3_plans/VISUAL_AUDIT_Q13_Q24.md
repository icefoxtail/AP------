# 23_풍덕중_1학기_중간_중3_유사3 q13~q24 문제·해설 SVG 필요성 및 필드 패리티 감사

- 기준 최신 main: `528c172b384f3ec2c9c6d8ecad65fdf226c2b19d`
- 원문: `archive/exams/similar/middle/m3/1mid/23_풍덕중_1학기_중간_중3_유사3.js` (원문 Git blob `5314f731ebb2e71085dc364f0c4212ca8be5ed31`)
- 이전 q01~q12 감사/plan (PR #3146)은 그대로 보존, 이번 범위 **q13~q24만**.
- 이번 12문항, 문제 12축 + 해설 12축 = 24축. 필요성: BENEFICIAL 2축, EXEMPT 22축.
- 제작용 plan: q18-solution 및 q21-solution 2개. 원본 JS, SVG 및 image/solutionImage 연결 변경 없음.

| 파일/qid | 축 | 판정 | capability | plan경로 | plan-lint | DRAWN_FEATURE_PARITY | 개별 판단 근거 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 23_풍덕중_1학기_중간_중3_유사3/q13 | 문제 | EXEMPT | — | — | N/A | EXEMPT | 두 인수분해식의 미지 양수 A,B,C,D 결정 |
| 23_풍덕중_1학기_중간_중3_유사3/q13 | 해설 | EXEMPT | — | — | N/A | EXEMPT | A=3 B=5 C=3 D=1을 인수계수로 직접 확인 |
| 23_풍덕중_1학기_중간_중3_유사3/q14 | 문제 | EXEMPT | — | — | N/A | EXEMPT | 9x²+(k−2)x+16의 완전제곱 조건 |
| 23_풍덕중_1학기_중간_중3_유사3/q14 | 해설 | EXEMPT | — | — | N/A | EXEMPT | k−2=±24 두 경우 계산만 필요 |
| 23_풍덕중_1학기_중간_중3_유사3/q15 | 문제 | EXEMPT | — | — | N/A | EXEMPT | a−b, ab로 b/a+a/b를 구하는 식 문제 |
| 23_풍덕중_1학기_중간_중3_유사3/q15 | 해설 | EXEMPT | — | — | N/A | EXEMPT | a²+b²=(a−b)²+2ab 항등식으로 완결 |
| 23_풍덕중_1학기_중간_중3_유사3/q16 | 문제 | EXEMPT | — | — | N/A | EXEMPT | 0<x<1과 x²−6x+1=0의 대수 계산 |
| 23_풍덕중_1학기_중간_중3_유사3/q16 | 해설 | EXEMPT | — | — | N/A | EXEMPT | x−1/x 부호와 제곱식 계산이 풀이 전부 |
| 23_풍덕중_1학기_중간_중3_유사3/q17 | 문제 | EXEMPT | — | — | N/A | EXEMPT | 5의 거듭제곱과 합차 공식 적용 |
| 23_풍덕중_1학기_중간_중3_유사3/q17 | 해설 | EXEMPT | — | — | N/A | EXEMPT | 24=5²−1에서 5⁸−1이라는 등식 계산 |
| 23_풍덕중_1학기_중간_중3_유사3/q18 | 문제 | EXEMPT | — | — | N/A | EXEMPT | 절댓값 포함 방정식의 해집합을 찾고 정수 개수를 묻기에 정답 구간을 미리 그리면 노출 |
| 23_풍덕중_1학기_중간_중3_유사3/q18 | 해설 | BENEFICIAL | number-line-figure-v1 | `archive/exams/similar/middle/m3/1mid/23_풍덕중_1학기_중간_중3_유사3_plans/q18-solution.plan.json` | shallow PASS / full PASS | PASS (엔진 그리기 필드) | −2≤x≤4를 닫힌 구간으로 그리고 −2부터 4까지 정수점 7개를 표시 |
| 23_풍덕중_1학기_중간_중3_유사3/q19 | 문제 | EXEMPT | — | — | N/A | EXEMPT | 황금비 형태 x의 삼차 다항식을 차수 내리기 |
| 23_풍덕중_1학기_중간_중3_유사3/q19 | 해설 | EXEMPT | — | — | N/A | EXEMPT | x²−x−1=0을 이용한 인수식으로 완결 |
| 23_풍덕중_1학기_중간_중3_유사3/q20 | 문제 | EXEMPT | — | — | N/A | EXEMPT | 연속 네 자연수 곱에 1을 더한 완전제곱 |
| 23_풍덕중_1학기_중간_중3_유사3/q20 | 해설 | EXEMPT | — | — | N/A | EXEMPT | 131²의 소인수분해 계산이므로 도형 불필요 |
| 23_풍덕중_1학기_중간_중3_유사3/q21 | 문제 | EXEMPT | — | — | N/A | EXEMPT | 실수의 정수·소수 부분을 문제에서 묻기에 숫자 위치를 미리 보이면 답 노출 |
| 23_풍덕중_1학기_중간_중3_유사3/q21 | 해설 | BENEFICIAL | number-line-figure-v1 | `archive/exams/similar/middle/m3/1mid/23_풍덕중_1학기_중간_중3_유사3_plans/q21-solution.plan.json` | shallow PASS / full PASS | PASS (엔진 그리기 필드) | 1/b=2+√3이 3과 4 사이임을 정확한 점 위치로 확인 |
| 23_풍덕중_1학기_중간_중3_유사3/q22 | 문제 | EXEMPT | — | — | N/A | EXEMPT | 두 문자 이차식의 계수 k 인수분해 |
| 23_풍덕중_1학기_중간_중3_유사3/q22 | 해설 | EXEMPT | — | — | N/A | EXEMPT | (2y+1)(y−3)와 3y+k의 대수 비교 |
| 23_풍덕중_1학기_중간_중3_유사3/q23 | 문제 | EXEMPT | — | — | N/A | EXEMPT | x<−3의 부호 조건만 있는 절댓값 계산 |
| 23_풍덕중_1학기_중간_중3_유사3/q23 | 해설 | EXEMPT | — | — | N/A | EXEMPT | x+3<0, x−1<0을 문장·수식으로 명확히 제공 |
| 23_풍덕중_1학기_중간_중3_유사3/q24 | 문제 | EXEMPT | — | — | N/A | EXEMPT | √(28−2x)가 정수인 자연수 x 열거 |
| 23_풍덕중_1학기_중간_중3_유사3/q24 | 해설 | EXEMPT | — | — | N/A | EXEMPT | 0,4,16 세 제곱수에 대응하는 x=14,12,6을 직접 계산 |

## 실제 엔진 그리기 필드 — 원문 독립 대조

- q18: 엔진 r1 SET, lo −2 CLOSED x=137.368421, hi 4 CLOSED x=402.631579, band x1~x2 동일, setLabel `-2≤x≤4`; integer dots 정확히 −2,−1,0,1,2,3,4의 7개(위치 137.368421,181.578947,225.789474,270,314.210526,358.421053,402.631579) 출력 확인.
- q21: 엔진 r1 POINTS 정확한 값 3 x=166.615385, 2+sqrt(3) x=276.986122, 4 x=317.384615, 세 점 모두 공통 축 x1=32~460. 실제 label 역할 `point-value`로 3, `2+sqrt(3)`, 4를 표시하도록 생성. 3<2+√3<4 일치.

q18의 실제 spec `integerPoints`는 정수점 7개와 라벨 7개를 생성하며, 끝점도 CLOSED이다. q21에는 원문에 없는 점 이름·선분·면 채움을 추가하지 않았다.

위 결과는 공식 `number-line-v1.mjs`의 `solveNumberLineFigure` 모델에서 `numberLineFigureSpec`로 만든 `rows[].axis`, `rows[].bands`, `rows[].dots`, `rows[].ticks`, `labels`의 실제 렌더 대상 명세를 직접 확인한 것이다. 소스 값·끝점 열림/닫힘·정수점 표시·행 라벨과 각 qid의 해설이 일치한다. **실제 SVG 렌더/PNG 눈 검수, 학생 화면/A4, JS 자산 연결은 NOT_RUN**이며 이 PASS는 엔진 model/spec 필드 패리티에만 해당한다.

## 검증 및 미해결

- 공식 `node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs --shallow` 대상 두 plan: **2/2 OK**, FAIL 0, SKIP 0, 종료코드 0.
- 공식 `node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs` full 대상 두 plan: **2/2 OK**, FAIL 0, SKIP 0, 종료코드 0.
- 엔진 생성 model/spec 필드 직접 대조 **2/2 PASS**, 신규 ENGINE_CAPABILITY_PENDING 0, 신규 EVIDENCE_DEBT 0.
- EXEMPT 22축은 빈 렌더용 plan 파일을 만들지 않고 상단 표에 각각 사유를 남김.
- 기존 별도 잔여: 왕운중 유사3 q23 문제·해설 SOURCE_LAYOUT_UNDERDETERMINED/EVIDENCE_DEBT 2축, 풍덕중 유사1 q21 해설 소문자 점 라벨 ENGINE_CAPABILITY_PENDING 1축. 이번 축 집계에 포함하지 않음.
