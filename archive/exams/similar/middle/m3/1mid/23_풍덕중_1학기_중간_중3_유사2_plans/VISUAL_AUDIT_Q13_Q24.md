# 23_풍덕중_1학기_중간_중3_유사2 q13~q24 문제·해설 SVG 필요성 및 필드 패리티 감사

- 기준 최신 main: `528c172b384f3ec2c9c6d8ecad65fdf226c2b19d`
- 원문: `archive/exams/similar/middle/m3/1mid/23_풍덕중_1학기_중간_중3_유사2.js` (원문 Git blob `5237d80ae483fb317d45432ac3ce5cdfd5ba0682`)
- 이전 q01~q12 감사/plan (PR #3146)은 그대로 보존, 이번 범위 **q13~q24만**.
- 이번 12문항, 문제 12축 + 해설 12축 = 24축. 필요성: BENEFICIAL 2축, EXEMPT 22축.
- 제작용 plan: q18-solution 및 q21-solution 2개. 원본 JS, SVG 및 image/solutionImage 연결 변경 없음.

| 파일/qid | 축 | 판정 | capability | plan경로 | plan-lint | DRAWN_FEATURE_PARITY | 개별 판단 근거 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 23_풍덕중_1학기_중간_중3_유사2/q13 | 문제 | EXEMPT | — | — | N/A | EXEMPT | 다섯 전개식의 빈칸 수를 비교하는 순수 대수 보기 |
| 23_풍덕중_1학기_중간_중3_유사2/q13 | 해설 | EXEMPT | — | — | N/A | EXEMPT | 8,−12,−25,7,−12를 전개식으로 직접 비교하므로 그림은 중복 |
| 23_풍덕중_1학기_중간_중3_유사2/q14 | 문제 | EXEMPT | — | — | N/A | EXEMPT | 완전제곱식인지 다섯 식을 판별하는 대수 문제 |
| 23_풍덕중_1학기_중간_중3_유사2/q14 | 해설 | EXEMPT | — | — | N/A | EXEMPT | (2a−3b)²의 세 항 전개로 충분하고 도형이 없음 |
| 23_풍덕중_1학기_중간_중3_유사2/q15 | 문제 | EXEMPT | — | — | N/A | EXEMPT | x−y와 x²+y²로 xy를 구하는 식의 계산 |
| 23_풍덕중_1학기_중간_중3_유사2/q15 | 해설 | EXEMPT | — | — | N/A | EXEMPT | (x−y)²+2xy 항등식 대입으로 답을 도출 |
| 23_풍덕중_1학기_중간_중3_유사2/q16 | 문제 | EXEMPT | — | — | N/A | EXEMPT | x−1/x=3의 제곱 변형 공식 적용 |
| 23_풍덕중_1학기_중간_중3_유사2/q16 | 해설 | EXEMPT | — | — | N/A | EXEMPT | 제곱식을 직접 전개하면 11이 나오므로 시각 관계 없음 |
| 23_풍덕중_1학기_중간_중3_유사2/q17 | 문제 | EXEMPT | — | — | N/A | EXEMPT | 3의 거듭제곱 합차 공식을 연속 적용 |
| 23_풍덕중_1학기_중간_중3_유사2/q17 | 해설 | EXEMPT | — | — | N/A | EXEMPT | 3²−1→3⁴−1→3⁸−1의 등식만이 필요한 과정 |
| 23_풍덕중_1학기_중간_중3_유사2/q18 | 문제 | EXEMPT | — | — | N/A | EXEMPT | −1<x<2의 구간은 문자로 명시되어 그림 없어도 문제를 이해 |
| 23_풍덕중_1학기_중간_중3_유사2/q18 | 해설 | BENEFICIAL | number-line-figure-v1 | `archive/exams/similar/middle/m3/1mid/23_풍덕중_1학기_중간_중3_유사2_plans/q18-solution.plan.json` | shallow PASS / full PASS | PASS (엔진 그리기 필드) | 열린 두 끝점과 내부 구간은 x+1>0, x−2<0의 부호 판단을 돕는다 |
| 23_풍덕중_1학기_중간_중3_유사2/q19 | 문제 | EXEMPT | — | — | N/A | EXEMPT | 근호 분모 두 개의 유리화와 다항식 계산 |
| 23_풍덕중_1학기_중간_중3_유사2/q19 | 해설 | EXEMPT | — | — | N/A | EXEMPT | x+y와 xy를 대입하는 순수 식 정리 |
| 23_풍덕중_1학기_중간_중3_유사2/q20 | 문제 | EXEMPT | — | — | N/A | EXEMPT | 네 일차식의 곱을 치환해 인수분해 |
| 23_풍덕중_1학기_중간_중3_유사2/q20 | 해설 | EXEMPT | — | — | N/A | EXEMPT | t=x²+2x 치환과 t(t−11)로 완결 |
| 23_풍덕중_1학기_중간_중3_유사2/q21 | 문제 | EXEMPT | — | — | N/A | EXEMPT | A,B,C 세 실수의 대소관계를 답으로 물어 선제 정렬 그림이 답 노출 |
| 23_풍덕중_1학기_중간_중3_유사2/q21 | 해설 | BENEFICIAL | number-line-figure-v1 | `archive/exams/similar/middle/m3/1mid/23_풍덕중_1학기_중간_중3_유사2_plans/q21-solution.plan.json` | shallow PASS / full PASS | PASS (엔진 그리기 필드) | A=3−√5, B=1/2, C=√3−1을 정확히 같은 수직선 척도에서 비교 |
| 23_풍덕중_1학기_중간_중3_유사2/q22 | 문제 | EXEMPT | — | — | N/A | EXEMPT | xy 이차식의 두 인수 구하기 |
| 23_풍덕중_1학기_중간_중3_유사2/q22 | 해설 | EXEMPT | — | — | N/A | EXEMPT | 전개해 x계수와 상수항을 대조하는 과정 |
| 23_풍덕중_1학기_중간_중3_유사2/q23 | 문제 | EXEMPT | — | — | N/A | EXEMPT | x=2,y=−√3 대입 근호 계산 |
| 23_풍덕중_1학기_중간_중3_유사2/q23 | 해설 | EXEMPT | — | — | N/A | EXEMPT | |x−3y|+|3y| 부호는 수치 대입으로 결정 |
| 23_풍덕중_1학기_중간_중3_유사2/q24 | 문제 | EXEMPT | — | — | N/A | EXEMPT | √(12/x)가 자연수인 x를 찾는 제곱수 조건 |
| 23_풍덕중_1학기_중간_중3_유사2/q24 | 해설 | EXEMPT | — | — | N/A | EXEMPT | 12/x=1,4일 때 x=12,3을 열거하면 충분 |

## 실제 엔진 그리기 필드 — 원문 독립 대조

- q18: 엔진 r1 SET, lo −1 OPEN x=214.956522, hi 2 OPEN x=391.043478, band x1=214.956522~391.043478, setLabel `-1<x<2`; `x+1>0` 및 `x−2<0`은 캡션 해설이므로 별도 부호 라벨을 그렸다고 주장하지 않음.
- q21: 정확한 POINTS A `3-sqrt(5)` x=274.903923, B `1/2` x=221.096077, C `-1+sqrt(3)` x=268.404297; 3행 공통 축 x1=44~460. 각 행 row-label A,B,C 출력 확인. 따라서 B<C<A 위치 일치. `showValue:false`로 근호식은 점 옆이 아닌 caption에 표시.

A와 C의 가로 위치 차이가 약 6.50 모델 단위 픽셀이므로 같은 행 대신 행을 분리했다. 대응 라벨은 그 점의 행 왼쪽에 표시되며 이름이 다른 위치에 붙지 않는다.

위 결과는 공식 `number-line-v1.mjs`의 `solveNumberLineFigure` 모델에서 `numberLineFigureSpec`로 만든 `rows[].axis`, `rows[].bands`, `rows[].dots`, `rows[].ticks`, `labels`의 실제 렌더 대상 명세를 직접 확인한 것이다. 소스 값·끝점 열림/닫힘·정수점 표시·행 라벨과 각 qid의 해설이 일치한다. **실제 SVG 렌더/PNG 눈 검수, 학생 화면/A4, JS 자산 연결은 NOT_RUN**이며 이 PASS는 엔진 model/spec 필드 패리티에만 해당한다.

## 검증 및 미해결

- 공식 `node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs --shallow` 대상 두 plan: **2/2 OK**, FAIL 0, SKIP 0, 종료코드 0.
- 공식 `node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs` full 대상 두 plan: **2/2 OK**, FAIL 0, SKIP 0, 종료코드 0.
- 엔진 생성 model/spec 필드 직접 대조 **2/2 PASS**, 신규 ENGINE_CAPABILITY_PENDING 0, 신규 EVIDENCE_DEBT 0.
- EXEMPT 22축은 빈 렌더용 plan 파일을 만들지 않고 상단 표에 각각 사유를 남김.
- 기존 별도 잔여: 왕운중 유사3 q23 문제·해설 SOURCE_LAYOUT_UNDERDETERMINED/EVIDENCE_DEBT 2축, 풍덕중 유사1 q21 해설 소문자 점 라벨 ENGINE_CAPABILITY_PENDING 1축. 이번 축 집계에 포함하지 않음.
