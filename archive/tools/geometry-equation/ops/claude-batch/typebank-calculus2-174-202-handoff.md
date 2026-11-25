# 고2 유형은행 미적분Ⅱ 174/q04–202/q06: 20문항 plan·필드 parity 인계

- 기준: 2026-11-26, 병합 직전 재확인한 `main` 커밋 `03a72175`에서 분기(원래 2e343e07 이후 다른 담당의 무관한 운영 커밋 포함). 직전 유형은행 운영병합 PR #3107 다음인 **174/q04**부터 진행.
- 범위: `archive/exams/types/high/h2/` 미적분Ⅱ 7개 원문 JS의 실제 `[그림:]` 20문항. 수치 순으로 174/q04, 185/q01–02, 187/q01·03–06, 190/q01–02, 193/q03, 201/q01–03, 202/q01–06. 다음 시작점 **202/q07**.
- 기존 본문 JS, 시험지, 교과서, 엔진, 손 SVG 수정 없음. 이 PR은 `production/plans` 아래 정확히 20 JSON + 이 인계 문서만 변경.
- 품질 게이트: `plan-lint.cjs --shallow` **OK 20/20**, `plan-lint.cjs --jobs 2`(full) **OK 20/20**. 독립 `sourceQuote`/실제 필드 매핑 + 계수/교점/좌표 대조 **20/20 검사 완료**.
- **DRAWN_FEATURE_PARITY (원문↔plan 필드)**: **PASS 1**, **ENGINE_CAPABILITY_PENDING 19**. SUPPORTED 1, PARTIAL 14, UNSUPPORTED 5. 상태 전용 UNSUPPORTED 5개는 실제 SVG를 낼 수 있는 plan에 넣지 않는다. 렌더 가능한 capability plan **15/20**(그중 14개 필드 불완전).
- **렌더·독립 SVG 관측기·PNG·학생 화면·A4 단계는 NOT_RUN**. 여기의 `DRAWN_FEATURE_PARITY`는 SVG 픽셀 검수 결과가 아니라 source-to-declared-drawable-fields 대조 결과다. 이를 실제 이미지 합격으로 해석하거나 대체 이미지로 보강하면 안 된다.

## 문항별 결과

| 파일/qid | 축 | 판정 | capability | plan경로 | plan-lint (shallow/full) | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|---|
| 174_두접선이이루는예각의크기/q04 | 지수·두 접선 | UNSUPPORTED | `ENGINE_CAPABILITY_PENDING` | [JSON](../../production/plans/미적분II_174_두접선이이루는예각의크기_고2_유형은행1/q04-problem.plan.json) | OK / OK | ENGINE_CAPABILITY_PENDING |
| 185_곡선의오목과볼록/q01 | 도함수·오목볼록 | PARTIAL | `polynomial-spike-v1` | [JSON](../../production/plans/미적분II_185_곡선의오목과볼록_고2_유형은행1/q01-problem.plan.json) | OK / OK | ENGINE_CAPABILITY_PENDING |
| 185_곡선의오목과볼록/q02 | 삼차곡선·변곡 | SUPPORTED | `piecewise-polynomial-spike-v1` | [JSON](../../production/plans/미적분II_185_곡선의오목과볼록_고2_유형은행1/q02-problem.plan.json) | OK / OK | PASS |
| 187_변곡점의진위판단/q01 | 도함수·영점과 극값 | PARTIAL | `polynomial-spike-v1` | [JSON](../../production/plans/미적분II_187_변곡점의진위판단_고2_유형은행1/q01-problem.plan.json) | OK / OK | ENGINE_CAPABILITY_PENDING |
| 187_변곡점의진위판단/q03 | 도함수·삼각주기 | PARTIAL | `trigonometric-spike-v1` | [JSON](../../production/plans/미적분II_187_변곡점의진위판단_고2_유형은행1/q03-problem.plan.json) | OK / OK | ENGINE_CAPABILITY_PENDING |
| 187_변곡점의진위판단/q04 | 불연속 도함수·빈 점 | PARTIAL | `multi-curve-figure-v1` | [JSON](../../production/plans/미적분II_187_변곡점의진위판단_고2_유형은행1/q04-problem.plan.json) | OK / OK | ENGINE_CAPABILITY_PENDING |
| 187_변곡점의진위판단/q05 | 도함수·세 영점 | PARTIAL | `polynomial-spike-v1` | [JSON](../../production/plans/미적분II_187_변곡점의진위판단_고2_유형은행1/q05-problem.plan.json) | OK / OK | ENGINE_CAPABILITY_PENDING |
| 187_변곡점의진위판단/q06 | 도함수·중근과 극대 | PARTIAL | `polynomial-spike-v1` | [JSON](../../production/plans/미적분II_187_변곡점의진위판단_고2_유형은행1/q06-problem.plan.json) | OK / OK | ENGINE_CAPABILITY_PENDING |
| 190_함수의그래프/q01 | 5개 복합 함수 그래프 | UNSUPPORTED | `ENGINE_CAPABILITY_PENDING` | [JSON](../../production/plans/미적분II_190_함수의그래프_고2_유형은행1/q01-problem.plan.json) | OK / OK | ENGINE_CAPABILITY_PENDING |
| 190_함수의그래프/q02 | 5개 곱함수 그래프 | UNSUPPORTED | `ENGINE_CAPABILITY_PENDING` | [JSON](../../production/plans/미적분II_190_함수의그래프_고2_유형은행1/q02-problem.plan.json) | OK / OK | ENGINE_CAPABILITY_PENDING |
| 193_함수fx=xe⁻ˣ의그래프개형/q03 | 지수곡선·내접 직사각형 | PARTIAL | `exponential-affine-spike-v1` | [JSON](../../production/plans/미적분II_193_함수fx=xe⁻ˣ의그래프개형_고2_유형은행1/q03-problem.plan.json) | OK / OK | ENGINE_CAPABILITY_PENDING |
| 201_최대최소의활용길이/q01 | 지수·직선·수직거리 | PARTIAL | `exponential-affine-spike-v1` | [JSON](../../production/plans/미적분II_201_최대최소의활용길이_고2_유형은행1/q01-problem.plan.json) | OK / OK | ENGINE_CAPABILITY_PENDING |
| 201_최대최소의활용길이/q02 | 도로·수선·최단시간 | PARTIAL | `construction-spike-v1` | [JSON](../../production/plans/미적분II_201_최대최소의활용길이_고2_유형은행1/q02-problem.plan.json) | OK / OK | ENGINE_CAPABILITY_PENDING |
| 201_최대최소의활용길이/q03 | 원·동경·선분 분할 | PARTIAL | `construction-spike-v1` | [JSON](../../production/plans/미적분II_201_최대최소의활용길이_고2_유형은행1/q03-problem.plan.json) | OK / OK | ENGINE_CAPABILITY_PENDING |
| 202_최대최소의활용넓이/q01 | 지수접선·절편삼각형 | PARTIAL | `exponential-affine-spike-v1` | [JSON](../../production/plans/미적분II_202_최대최소의활용넓이_고2_유형은행1/q01-problem.plan.json) | OK / OK | ENGINE_CAPABILITY_PENDING |
| 202_최대최소의활용넓이/q02 | 로그접선·절편삼각형 | PARTIAL | `logarithmic-affine-spike-v1` | [JSON](../../production/plans/미적분II_202_최대최소의활용넓이_고2_유형은행1/q02-problem.plan.json) | OK / OK | ENGINE_CAPABILITY_PENDING |
| 202_최대최소의활용넓이/q03 | 로그법선·직각삼각형 | PARTIAL | `logarithmic-affine-spike-v1` | [JSON](../../production/plans/미적분II_202_최대최소의활용넓이_고2_유형은행1/q03-problem.plan.json) | OK / OK | ENGINE_CAPABILITY_PENDING |
| 202_최대최소의활용넓이/q04 | 지수접선·y축 삼각형 | PARTIAL | `exponential-affine-spike-v1` | [JSON](../../production/plans/미적분II_202_최대최소의활용넓이_고2_유형은행1/q04-problem.plan.json) | OK / OK | ENGINE_CAPABILITY_PENDING |
| 202_최대최소의활용넓이/q05 | 가우스형 그래프·직사각형 | UNSUPPORTED | `ENGINE_CAPABILITY_PENDING` | [JSON](../../production/plans/미적분II_202_최대최소의활용넓이_고2_유형은행1/q05-problem.plan.json) | OK / OK | ENGINE_CAPABILITY_PENDING |
| 202_최대최소의활용넓이/q06 | 좌우 지수곡선·직사각형 | UNSUPPORTED | `ENGINE_CAPABILITY_PENDING` | [JSON](../../production/plans/미적분II_202_최대최소의활용넓이_고2_유형은행1/q06-problem.plan.json) | OK / OK | ENGINE_CAPABILITY_PENDING |

## 원문 시각 요소와 필드 매핑 검수

- 각 JSON의 `sourceQuote`는 원본 JS의 `[그림: …]` 원문 문자열과 바이트 수준으로 일치한다. `sourceConditions[]` 각 항목의 `mappedTo`는 실제 존재하는 JSON 필드 경로로 해석되는지 독립 스크립트에서 검사했다. 사용할 수 없는 원문 요소는 필드 대신 구체 사유를 붙인 `ENGINE_CAPABILITY_PENDING: ...`으로 표시했다.
- 다항·삼각·원 도형의 계산 검수: 185/q01의 극대/극소, 185/q02의 (1,4)·(2,2)·(3,0), 187/q01의 영점·극값, 187/q03의 `3/2−(1/2)cos(πx)` 항등식, 187/q04의 두 조각과 미정의 x=2, 187/q05의 세 영점, 187/q06의 (4/3,32/27), 201/q02의 45:70 직각 배치, 201/q03의 원 중심 (3,0)·반지름 3과 PQ=2를 비교했다.
- source–plan 매핑 필드 수에는 전혀 그릴 수 없는 상태 기록의 pending 사유도 포함되지만, 그 값을 실제 작도 요소로 세지 않는다. 원문 중간에 지정된 미지 `t`를 정답값으로 고정하거나 `e^{-2x²}`를 비슷한 포물선으로 치환하지 않았다.

### 문항별 미해결 capability (모두 sourceConditions에 추적)

- **174_두접선이이루는예각의크기/q04** — EXACT_EXP_TANGENTS_AT_LOG2: t=ln2의 두 접선 기울기·절편과 A,B의 ln2 좌표를 overlay 정확수 문법으로 표현 불가
- **185_곡선의오목과볼록/q01** — DERIVATIVE_FUNCTION_LABEL: 축 제목의 f′(x) 프라임 글리프를 AXIS_TITLE_INVALID:y가 거절함
- **187_변곡점의진위판단/q01** — DERIVATIVE_FUNCTION_LABEL: 축 제목의 f′(x) 프라임 글리프를 AXIS_TITLE_INVALID:y가 거절함
- **187_변곡점의진위판단/q03** — DERIVATIVE_FUNCTION_LABEL: 축 제목의 f′(x) 프라임 글리프를 AXIS_TITLE_INVALID:y가 거절함
- **187_변곡점의진위판단/q04** — QUADRATIC_ENDPOINT_OPEN_MARKER: multi-curve의 Y_OF_X 왼쪽 가지 (2,0)에 OPEN 끝점 지정 미지원; DERIVATIVE_FUNCTION_LABEL: 축 제목의 f′(x) 프라임 글리프를 AXIS_TITLE_INVALID:y가 거절함
- **187_변곡점의진위판단/q05** — DERIVATIVE_FUNCTION_LABEL: 축 제목의 f′(x) 프라임 글리프를 AXIS_TITLE_INVALID:y가 거절함
- **187_변곡점의진위판단/q06** — DERIVATIVE_FUNCTION_LABEL: 축 제목의 f′(x) 프라임 글리프를 AXIS_TITLE_INVALID:y가 거절함
- **190_함수의그래프/q01** — FIVE_PANEL_MIXED_COMPOSITE: e^(-2x²), 2x-ln x, x+3sin x, -(ln x)/x를 각각 정확히 그린 5개 보기 패널 미지원
- **190_함수의그래프/q02** — FIVE_PANEL_PRODUCT_EXP_LOG: xe^(2x),2x ln x,x²e^(2x),(x-2)e^x,xe^(-2x) 다섯 비아핀 함수 패널 미지원
- **193_함수fx=xe⁻ˣ의그래프개형/q03** — EXP_CURVE_VERTICAL_PROJECTION: P(1/3,6/e)에서 y축 발 R과 직사각형 OQPR의 6/e 높이를 overlay 정확수 좌표로 선언 불가
- **201_최대최소의활용길이/q01** — VARIABLE_T_LABELS: t=0 대표 수직선은 작도되나 일반식 P(t,2e^t),Q(t,2t-1)의 기호좌표 점 라벨은 미지원
- **201_최대최소의활용길이/q02** — VARIABLE_ROAD_POINT_LABEL: Q(t,0)의 미지 t를 일반 기호좌표로 점 옆에 직접 인쇄하는 PLANE_FIGURE 필드 미지원
- **201_최대최소의활용길이/q03** — SYMBOLIC_RADIAL_LABEL: Q의 r=6cosθ, P의 r=6cosθ-2를 점 옆 일반식으로 인쇄하는 기하 작도 라벨 미지원
- **202_최대최소의활용넓이/q01** — EXP_TANGENT_AT_NEGATIVE_T: t<0의 접선 기울기 2e^t, 절편 t-1 및 2(1-t)e^t 정확 overlay 식/좌표 미지원
- **202_최대최소의활용넓이/q02** — LOG_TANGENT_VARIABLE_INTERCEPTS: P(1/2,-2ln2)의 접선 및 Q(t(1-ln t),0),R(0,2ln t-2) exact overlay 미지원
- **202_최대최소의활용넓이/q03** — LOG_NORMAL_VARIABLE_INTERCEPTS: P(2,2ln2)의 법선과 Q(t+4ln(t)/t,0),R(t,0) 정확 overlay 좌표 미지원
- **202_최대최소의활용넓이/q04** — EXP_VERTICAL_INTERCEPTS: A(0,3e^-2t), B(0,3(1+2t)e^-2t), 접선 및 삼각형 APB의 정확 overlay 좌표 미지원
- **202_최대최소의활용넓이/q05** — GAUSSIAN_NONAFFINE_EXP: y=3e^(-2x²)의 두 대칭 비선형 가지와 직사각형 꼭짓점 정확 작도 미지원
- **202_최대최소의활용넓이/q06** — PIECEWISE_NATURAL_EXP_PAIR: 같은 축에서 x<0의 2e^(4x), x>0의 2e^(-4x)와 x=±t 직사각형 정확 작도 미지원

### 원본 파일 SHA-256

- `미적분II_174_두접선이이루는예각의크기_고2_유형은행1.js`: `ae48e6f3a1dd7603bfb11106262da2d5de2d2e8b3cdef38abb055a6f13cd2a2e`
- `미적분II_185_곡선의오목과볼록_고2_유형은행1.js`: `3b2823a832e35f2e35774be295406bcd63df7c639cd6d7efed2ce20800bc10b7`
- `미적분II_187_변곡점의진위판단_고2_유형은행1.js`: `f79b2f412b376ae655ceb4059b5d78cac458190c503fe25450fea29644ffede4`
- `미적분II_190_함수의그래프_고2_유형은행1.js`: `d06f90d17f48e6c58fdd991f11b82f89ddf13a2e51fd2dd4cc279da524ebef83`
- `미적분II_193_함수fx=xe⁻ˣ의그래프개형_고2_유형은행1.js`: `57c81119318e87e4367df00e87a0861a1f6646010c02023c9a0d7ed7840d6c4e`
- `미적분II_201_최대최소의활용길이_고2_유형은행1.js`: `2054201b1d200f41638909fd90b1f35898c89a7405d94ba86b1219209a76b87a`
- `미적분II_202_최대최소의활용넓이_고2_유형은행1.js`: `5c57339f622eaef14d15f6e0a20ad3498b1feb80b4617b415a2f2cf2785d3593`

## 다음 작업과 운영 인계

1. 이 PR 병합 이후 추가 문항은 `미적분II_202_최대최소의활용넓이_고2_유형은행1.js`의 **q07**부터 다시 20–30개 `[그림:]`만 진행한다.
2. Antigravity/엔진 담당에게 `ENGINE_CAPABILITY_PENDING` 사유를 넘긴다. 자연지수·로그의 미지 접점/절편·법선, 변수 점 좌표의 직접 라벨, 도함수 표기의 프라임 글리프, 열린 이차곡선 끝점, 가우스형·곱지수 함수 및 5-패널을 정확히 추가하기 전에는 `PASS`로 상향하지 않는다.
3. 엔진 지원 뒤 각 JSON의 실제 drawable field를 채우고, 다시 full 린트→독립 SVG 관측→PNG·학생 화면·A4를 검수해야 한다. 원본 `window.questionBank`의 문제·답·해설을 수정하지 않는다.
