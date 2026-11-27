# DRAWN_FEATURE_PARITY — 20_제일고_1학기_중간_고2_수학I_유사

- 대상: `archive/exams/similar/high/h2/1mid/20_제일고_1학기_중간_고2_수학I_유사.js` (24문항 × 문항·해설 = 48축).
- 발문·정답·해설 JS는 변경하지 않음. 원문에는 이 대상 축의 `image`·`solutionImage`가 없었음.
- 1:1의 **PLAN 정적 비교**: 소스 조건·각·직각·동등눈금·지시선·점선·길이·라벨 ↔ 실행 JSON의 실제 노드·표식·치수와 문항별로 대조. 정답 노출은 문항축에서 금지.
- `plan-lint.cjs --shallow` 및 `plan-lint.cjs`(full)의 OK는 문법·모델·spec·MathJax 준비 검증이며 **Chrome 실물 관측 PASS를 뜻하지 않음**.
- 실물 렌더 시도(풍덕중 q11 문항): `ARCHIVE_PREFLIGHT_FAIL` — /usr/bin/chromium 래퍼가 /usr/lib/chromium/chromium 바이너리를 찾지 못함. 따라서 **DRAWN_FEATURE_PARITY 실물은 ENV_BLOCKED/NOT_RUN**이고 표시한 PASS는 plan↔원문 정적 1:1임. SVG, PNG 또는 학생 화면의 실물 PASS를 주장하지 않음.
- 흰색 배경·무의미한 면 채움: 작성한 모든 plan에서 불투명 흰 사각형, 영역 칠 `fill`, `style:SECTOR` 추가 없음. 각도는 `style:ARC`로만 표시, 필요한 길이·접점 등은 선·보조선으로 표시.
- 합계: 플랜 **10축**, EXEMPT **36축**, ENGINE_CAPABILITY_PENDING **2축**. (합계 48축)

| qid | 축 | 판정 | capability | plan 경로 | plan-lint | DRAWN_FEATURE_PARITY / 소스 1:1 특징 |
|---|---|---|---|---|---|---|
| q01 | 문항 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q01 | 해설 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q02 | 문항 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q02 | 해설 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q03 | 문항 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q03 | 해설 | PLAN_1:1_PASS | `logarithmic-affine-spike-v1` | [q03-solution.plan.json](./q03-solution.plan.json) | shallow OK / full OK | y=log_(1/3)x 감소곡선, x=1·27의 열린 경계에 대응하는 y=0·-3 → 입력조건·기하표식·라벨 대조 PASS (plan 정적); SVG 실물 관측 미완료 |
| q04 | 문항 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q04 | 해설 | PLAN_1:1_PASS | `construction-spike-v1` | [q04-solution.plan.json](./q04-solution.plan.json) | shallow OK / full OK | θ=5π/4=225° 동경, 외각 호, 제3사분면 → 입력조건·기하표식·라벨 대조 PASS (plan 정적); SVG 실물 관측 미완료 |
| q05 | 문항 | PLAN_1:1_PASS | `construction-spike-v1` | [q05-problem.plan.json](./q05-problem.plan.json) | shallow OK / full OK | 원점 O·동경 OP·P(-5,12) 좌표 및 θ호 → 입력조건·기하표식·라벨 대조 PASS (plan 정적); SVG 실물 관측 미완료 |
| q05 | 해설 | PLAN_1:1_PASS | `construction-spike-v1` | [q05-solution.plan.json](./q05-solution.plan.json) | shallow OK / full OK | P 좌표·x축 수선·직각, 5·12·13 치수선과 θ호 → 입력조건·기하표식·라벨 대조 PASS (plan 정적); SVG 실물 관측 미완료 |
| q06 | 문항 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q06 | 해설 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q07 | 문항 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q07 | 해설 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q08 | 문항 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q08 | 해설 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q09 | 문항 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q09 | 해설 | PLAN_1:1_PASS | `construction-spike-v1` | [q09-solution.plan.json](./q09-solution.plan.json) | shallow OK / full OK | 제3사분면 동경, sinθ<0·cosθ<0·tanθ>0 부호 라벨 → 입력조건·기하표식·라벨 대조 PASS (plan 정적); SVG 실물 관측 미완료 |
| q10 | 문항 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q10 | 해설 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q11 | 문항 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q11 | 해설 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q12 | 문항 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q12 | 해설 | PLAN_1:1_PASS | `construction-spike-v1` | [q12-solution.plan.json](./q12-solution.plan.json) | shallow OK / full OK | 제2사분면 동경, sinθ>0·cosθ<0 부호 라벨 → 입력조건·기하표식·라벨 대조 PASS (plan 정적); SVG 실물 관측 미완료 |
| q13 | 문항 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q13 | 해설 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q14 | 문항 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q14 | 해설 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q15 | 문항 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q15 | 해설 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q16 | 문항 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q16 | 해설 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q17 | 문항 | ENGINE_CAPABILITY_PENDING | `SYMBOLIC_LOG_POINT_BINDING 미지원` | — | N/A (엔진 미지원) | 기호 좌표 (a,log₃a),(b,log₃b), y축 수선의 발 A/B, AB=2; 필요: 매개변수 a,b를 실제 로그곡선 점에 결속하고 y축 수선발·길이2를 유도하는 기능 |
| q17 | 해설 | ENGINE_CAPABILITY_PENDING | `SYMBOLIC_LOG_POINT_BINDING 미지원` | — | N/A (엔진 미지원) | 두 기호 x좌표 a,b에 연동한 로그곡선 점·수선·세로거리 2; 필요: 매개변수 a,b를 실제 로그곡선 점에 결속하고 y축 수선발·길이2를 유도하는 기능 |
| q18 | 문항 | PLAN_1:1_PASS | `composite-panels-v1` | [q18-problem.plan.json](./q18-problem.plan.json) | shallow OK / full OK | A: 중심각 1/3 rad·호 길이 2, B: 중심각 2 rad·넓이 16, 둘 다 채움 없음 → 입력조건·기하표식·라벨 대조 PASS (plan 정적); SVG 실물 관측 미완료 |
| q18 | 해설 | PLAN_1:1_PASS | `composite-panels-v1` | [q18-solution.plan.json](./q18-solution.plan.json) | shallow OK / full OK | A/B 각각 반지름6·4 지시선과 기존 중심각·호·넓이 → 입력조건·기하표식·라벨 대조 PASS (plan 정적); SVG 실물 관측 미완료 |
| q19 | 문항 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q19 | 해설 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q20 | 문항 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q20 | 해설 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q21 | 문항 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q21 | 해설 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q22 | 문항 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q22 | 해설 | PLAN_1:1_PASS | `construction-spike-v1` | [q22-solution.plan.json](./q22-solution.plan.json) | shallow OK / full OK | 제3사분면 x=-5·y=-12·r=13, x축 수선·직각표식과 길이 → 입력조건·기하표식·라벨 대조 PASS (plan 정적); SVG 실물 관측 미완료 |
| q23 | 문항 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q23 | 해설 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q24 | 문항 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q24 | 해설 | PLAN_1:1_PASS | `polynomial-spike-v1` | [q24-solution.plan.json](./q24-solution.plan.json) | shallow OK / full OK | t=log₃x∈[1,4], y=t²−6t−6, 양끝 t=1·4 및 꼭짓점 t=3 (곡선 표시구간 1~4) → 입력조건·기하표식·라벨 대조 PASS (plan 정적); SVG 실물 관측 미완료 |

## 엔진 기능 요청 — q17, 문항·해설

`ENGINE_CAPABILITY_PENDING`: `logarithmic-affine-spike-v1`의 `requiredPoints`는 정수·분수·근호인 수치 좌표만 받는다. 주어진 미정수 `a,b`에 대해 곡선 위 `(a,log₃ a)`, `(b,log₃ b)`, `A=(0,log₃ a)`, `B=(0,log₃ b)`를 동일 심볼 매개변수로 묶어, `AB=log₃(b/a)=2`를 정확히 렌더·검증할 기능(`PARAMETRIC_LOG_POINT_BINDING`, `SYMBOLIC_PERPENDICULAR_FOOT`, `SYMBOLIC_DISTANCE_CONSTRAINT`) 필요. `a=1,b=9` 등 임의 예시를 원문 그 자체인 것처럼 그리는 plan은 생성하지 않음.

## 그래프 정의역 구별 — q24 해설

함수식은 전 실수 `t`에서 정의되는 이차식이지만 주어진 `x` 조건에서 실제 비교 범위는 `1≤t≤4`. `polynomial-spike-v1`에 `sourceDomain:CLOSED_INTERVAL`을 쓰면 `RESTRICTED_SOURCE_DOMAIN_NEEDS_CONTEXT_VIEW`로 거절되므로, 함수 자체의 정의역은 `ALL_REALS`로 유지하되 **렌더 구간 `domain:[1,4]`**와 양 끝 표시·캡션으로 문제의 비교 범위를 정확히 나타냄. 엔진 실물에서 범위를 다시 확인해야 함.
