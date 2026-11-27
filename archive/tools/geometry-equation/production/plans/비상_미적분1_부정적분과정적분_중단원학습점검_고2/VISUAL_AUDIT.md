# 비상 미적분Ⅰ · 부정적분과 정적분 · 중단원 학습 점검 · 고2 — 2축 SVG plan 검수

- 대상 JS: `archive/exams/textbooks/비상교육_미적분1/비상_미적분1_부정적분과정적분_중단원학습점검_고2/비상_미적분1_부정적분과정적분_중단원학습점검_고2.js`
- 원본 blob `b926e959a86e53ccafc816ff2e1d76effe1c71b9`; 재검수 기준 main `23ab9081821faa5db55f7d1355abac03813e336e`.
- 사용자 경로의 `비상교육_미적분1` 복제 JS 역시 동일 Git blob이다. 두 시험지 원본 JS는 변경하지 않는다.
- **14문항의 문항 14축 + 해설 14축 = 28축 전수**. 발문·답·해설·원본 이미지/그림 설명을 각각 확인(`sourceVsPlan=REVIEWED`). 이 시험지에는 기존 문제 PNG가 없다.
- 이 폴더의 `qNN-solution.plan.json`은 모두 공식 geometry-equation production 실행 plan이다. `plan-lint.cjs --shallow`와 full(기본) 각각 모두 PASS. 실패한 플랜을 납품 수에 포함하지 않는다.
- 아래 `DRAWN_FEATURE_PARITY=PASS`는 **원문 수식과 그려지는 필드의 정적 1:1 대조**를 뜻한다. SVG 렌더, 실제 PNG 시각검수, 학생 화면, A4 인쇄 및 JS `solutionImage` 연결은 별도 단계로 **모두 NOT_RUN**이다.
- `EXEMPT`는 수식 계산만으로 완결되고, 그래프의 구체적 모양이 주어지지 않았거나 추가 그림이 단순 반복에 해당하는 축이다. 문항용 plan을 추가해 미지 답을 노출하지 않았다.

| 파일/qid | 축 | 기존결함/판정 | capability | plan경로 | plan-lint shallow/full | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|---|
| 부정적분정적분/q01 | 문항 | EXEMPT · 다항식 원시함수 | — | — | N/A | N/A |
| 부정적분정적분/q01 | 해설 | EXEMPT · 항별 적분식이 완결 | — | — | N/A | N/A |
| 부정적분정적분/q02 | 문항 | EXEMPT · 수치 정적분 | — | — | N/A | N/A |
| 부정적분정적분/q02 | 해설 | EXEMPT · 기본정리 대입 계산 | — | — | N/A | N/A |
| 부정적분정적분/q03 | 문항 | EXEMPT · 도함수의 유한합 | — | — | N/A | N/A |
| 부정적분정적분/q03 | 해설 | EXEMPT · 적분상수·자연수 결정 | — | — | N/A | N/A |
| 부정적분정적분/q04 | 문항 | EXEMPT · 주어진 도함수/점 | — | — | N/A | N/A |
| 부정적분정적분/q04 | 해설 | EXEMPT · 적분상수 확정 | — | — | N/A | N/A |
| 부정적분정적분/q05 | 문항 | EXEMPT · 극값으로 함수 결정 | — | — | N/A | N/A |
| 부정적분정적분/q05 | 해설 | PLAN_READY | `piecewise-polynomial-spike-v1` | `q05-solution.plan.json` | PASS/PASS | PASS · 극대(0,6)·극소(1,5)·삼차곡선 |
| 부정적분정적분/q06 | 문항 | EXEMPT · 부정적분 항등식 | — | — | N/A | N/A |
| 부정적분정적분/q06 | 해설 | EXEMPT · 항등식 미분 후 적분 | — | — | N/A | N/A |
| 부정적분정적분/q07 | 문항 | EXEMPT · 적분구간 하한 a | — | — | N/A | N/A |
| 부정적분정적분/q07 | 해설 | EXEMPT · x=a 대입과 미분 | — | — | N/A | N/A |
| 부정적분정적분/q08 | 문항 | EXEMPT · 적분값 최소화 조건 | — | — | N/A | N/A |
| 부정적분정적분/q08 | 해설 | PLAN_READY | `polynomial-spike-v1` | `q08-solution.plan.json` | PASS/PASS | PASS · a축·꼭짓점(2,−3) |
| 부정적분정적분/q09 | 문항 | EXEMPT · 미지 함수 두 개 | — | — | N/A | N/A |
| 부정적분정적분/q09 | 해설 | EXEMPT · 적분값의 연립일차식 | — | — | N/A | N/A |
| 부정적분정적분/q10 | 문항 | EXEMPT · 구간별 정적분값 | — | — | N/A | N/A |
| 부정적분정적분/q10 | 해설 | EXEMPT · f의 개형 미정, 구간 덧셈만 사용 | — | — | N/A | N/A |
| 부정적분정적분/q11 | 문항 | EXEMPT · 절댓값 정적분 | — | — | N/A | N/A |
| 부정적분정적분/q11 | 해설 | 보강 · 분수 좌표의 정확 표기 미지정 → L/R 정확 분수 라벨 | `piecewise-polynomial-spike-v1` | `q11-solution.plan.json` | PASS/PASS | PASS(정적) · x=0 꺾임·L(−1/2,−1/4)·R(1/2,−1/4)·음2/양1 넓이 |
| 부정적분정적분/q12 | 문항 | EXEMPT · 도함수 조각과 조건 | — | — | N/A | N/A |
| 부정적분정적분/q12 | 해설 | 보강 · 분수 좌표의 정확 표기 미지정 → M/J/N 라벨 | `piecewise-polynomial-spike-v1` | `q12-solution.plan.json` | PASS/PASS | PASS(정적) · 연결점 (1,−1/2)·두 포물선·f(2),f(−1) |
| 부정적분정적분/q13 | 문항 | EXEMPT · 정적분 상수 항등식 | — | — | N/A | N/A |
| 부정적분정적분/q13 | 해설 | EXEMPT · 상수 k의 대수 계산 | — | — | N/A | N/A |
| 부정적분정적분/q14 | 문항 | EXEMPT · 두 함수의 적분 항등식 | — | — | N/A | N/A |
| 부정적분정적분/q14 | 해설 | EXEMPT · 다항식의 인수분해 | — | — | N/A | N/A |

## 독립 원문 대조

- q05는 `f'(x)=6x(x−1)`에서 `f(x)=2x³−3x²+6`, 극대 6·극소 5를 대조했다. 실제 `pieces[].coefficients`와 `requiredPoints`가 모두 이를 그린다.
- q08은 원문 정적분을 따로 계산하여 `I(a)=2a²−8a+5`이며 최소점 `(2,−3)`임을 확인했다. 축변수 `axisVariable:"a"`와 `overlays.points[M]`이 실제 표시 필드다.
- q11은 `x²−|x|`의 x=0 조각 경계와 부호를 대조했다. 음수 영역 2개·양수 영역 1개를 `graphPlan.regions`로 각각 분리했고, 정적분은 `1/2`다.
- q12는 x=1에서 두 부정적분 조각의 함수값 `−1/2` 일치, 왼쪽 도함수 `−2x`, 오른쪽 `x−3`, `f(2)=−2`, `f(−1)=−1/2`를 별도로 확인했다.
- 2026-11-27 재검수: q11의 L/R, q12의 M/J/N에 공식 `graphPlan.exactCoordinates`를 넣어 1/2·1/4·5/2를 소수 근사값이 아닌 정확한 분수 라벨로 배치하도록 보강했다. 원래 곡선·영역·수치·면 채움은 변경하지 않았다. 4개 제작 플랜 모두 공식 shallow/full lint PASS(동일 도구로 두 시험지 11/11 통과).
- **흰색 면 채움·기본 배경 채움은 0건**이다. q11의 연한 면 채움은 부호 있는 정적분 영역을 설명하는 필수 표시이며 삼각형 장식/불필요한 면색이 아니다.
- `render/PNG/student/A4=NOT_RUN`: 해당 역할은 실행 가능한 plan·정적 검수·PR/main 병합까지다. 시각 렌더·게시와 학생 화면 실물 검사는 후속 공장에서 실시한다.
