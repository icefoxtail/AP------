# DRAWN_FEATURE_PARITY — 21_풍덕중_1학기_중간_중2_유사

- 대상: `archive/exams/similar/middle/m2/1mid/21_풍덕중_1학기_중간_중2_유사.js` (24문항 × 문항·해설 = 48축).
- 발문·정답·해설 JS는 변경하지 않음. 원문에는 이 대상 축의 `image`·`solutionImage`가 없었음.
- 1:1의 **PLAN 정적 비교**: 소스 조건·각·직각·동등눈금·지시선·점선·길이·라벨 ↔ 실행 JSON의 실제 노드·표식·치수와 문항별로 대조. 정답 노출은 문항축에서 금지.
- `plan-lint.cjs --shallow` 및 `plan-lint.cjs`(full)의 OK는 문법·모델·spec·MathJax 준비 검증이며 **Chrome 실물 관측 PASS를 뜻하지 않음**.
- 실물 렌더 시도(풍덕중 q11 문항): `ARCHIVE_PREFLIGHT_FAIL` — /usr/bin/chromium 래퍼가 /usr/lib/chromium/chromium 바이너리를 찾지 못함. 따라서 **DRAWN_FEATURE_PARITY 실물은 ENV_BLOCKED/NOT_RUN**이고 표시한 PASS는 plan↔원문 정적 1:1임. SVG, PNG 또는 학생 화면의 실물 PASS를 주장하지 않음.
- 흰색 배경·무의미한 면 채움: 작성한 모든 plan에서 불투명 흰 사각형, 영역 칠 `fill`, `style:SECTOR` 추가 없음. 각도는 `style:ARC`로만 표시, 필요한 길이·접점 등은 선·보조선으로 표시.
- 합계: 플랜 **24축**, EXEMPT **24축**, ENGINE_CAPABILITY_PENDING **0축**. (합계 48축)

| qid | 축 | 판정 | capability | plan 경로 | plan-lint | DRAWN_FEATURE_PARITY / 소스 1:1 특징 |
|---|---|---|---|---|---|---|
| q01 | 문항 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q01 | 해설 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q02 | 문항 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q02 | 해설 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q03 | 문항 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q03 | 해설 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q04 | 문항 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q04 | 해설 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q05 | 문항 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q05 | 해설 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q06 | 문항 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q06 | 해설 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q07 | 문항 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q07 | 해설 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q08 | 문항 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q08 | 해설 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q09 | 문항 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q09 | 해설 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q10 | 문항 | PLAN_1:1_PASS | `solid-figure-v1` | [q10-problem.plan.json](./q10-problem.plan.json) | shallow OK / full OK | 직각삼각기둥, 밑면 직각·4x·3y/4, 미지 높이 h → 입력조건·기하표식·라벨 대조 PASS (plan 정적); SVG 실물 관측 미완료 |
| q10 | 해설 | PLAN_1:1_PASS | `solid-figure-v1` | [q10-solution.plan.json](./q10-solution.plan.json) | shallow OK / full OK | 밑면 직각·4x·3y/4, 높이 40x → 입력조건·기하표식·라벨 대조 PASS (plan 정적); SVG 실물 관측 미완료 |
| q11 | 문항 | PLAN_1:1_PASS | `construction-spike-v1` | [q11-problem.plan.json](./q11-problem.plan.json) | shallow OK / full OK | AB=AC 눈금, ∠C의 외각 125°와 연장선 → 입력조건·기하표식·라벨 대조 PASS (plan 정적); SVG 실물 관측 미완료 |
| q11 | 해설 | PLAN_1:1_PASS | `construction-spike-v1` | [q11-solution.plan.json](./q11-solution.plan.json) | shallow OK / full OK | AB=AC, C=55°·B=55°·A=70°의 각호 → 입력조건·기하표식·라벨 대조 PASS (plan 정적); SVG 실물 관측 미완료 |
| q12 | 문항 | PLAN_1:1_PASS | `construction-spike-v1` | [q12-problem.plan.json](./q12-problem.plan.json) | shallow OK / full OK | AB=AC 눈금, 꼭지각 A=110° → 입력조건·기하표식·라벨 대조 PASS (plan 정적); SVG 실물 관측 미완료 |
| q12 | 해설 | PLAN_1:1_PASS | `construction-spike-v1` | [q12-solution.plan.json](./q12-solution.plan.json) | shallow OK / full OK | AB=AC, 밑각 B=C=35° → 입력조건·기하표식·라벨 대조 PASS (plan 정적); SVG 실물 관측 미완료 |
| q13 | 문항 | PLAN_1:1_PASS | `construction-spike-v1` | [q13-problem.plan.json](./q13-problem.plan.json) | shallow OK / full OK | AB=AC 눈금, AD 수선 점선·직각, BC=22cm → 입력조건·기하표식·라벨 대조 PASS (plan 정적); SVG 실물 관측 미완료 |
| q13 | 해설 | PLAN_1:1_PASS | `construction-spike-v1` | [q13-solution.plan.json](./q13-solution.plan.json) | shallow OK / full OK | AD 점선·직각, BD=DC 눈금, BD=11cm와 BC=22cm → 입력조건·기하표식·라벨 대조 PASS (plan 정적); SVG 실물 관측 미완료 |
| q14 | 문항 | PLAN_1:1_PASS | `construction-spike-v1` | [q14-problem.plan.json](./q14-problem.plan.json) | shallow OK / full OK | AB=AC 눈금, A=44°, B 내각·C 외각 이등분 호와 외각 연장선 → 입력조건·기하표식·라벨 대조 PASS (plan 정적); SVG 실물 관측 미완료 |
| q14 | 해설 | PLAN_1:1_PASS | `construction-spike-v1` | [q14-solution.plan.json](./q14-solution.plan.json) | shallow OK / full OK | B=34°·C 외각 반각 56°·D=22°, C 이등분 호 → 입력조건·기하표식·라벨 대조 PASS (plan 정적); SVG 실물 관측 미완료 |
| q15 | 문항 | PLAN_1:1_PASS | `construction-spike-v1` | [q15-problem.plan.json](./q15-problem.plan.json) | shallow OK / full OK | 두 직각삼각형 C=F=90°, 빗변·한 변의 동등눈금, B=35° → 입력조건·기하표식·라벨 대조 PASS (plan 정적); SVG 실물 관측 미완료 |
| q15 | 해설 | PLAN_1:1_PASS | `construction-spike-v1` | [q15-solution.plan.json](./q15-solution.plan.json) | shallow OK / full OK | RHS 동등눈금, E=35°, D=55°, 직각표식 → 입력조건·기하표식·라벨 대조 PASS (plan 정적); SVG 실물 관측 미완료 |
| q16 | 문항 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q16 | 해설 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q17 | 문항 | PLAN_1:1_PASS | `construction-spike-v1` | [q17-problem.plan.json](./q17-problem.plan.json) | shallow OK / full OK | ∠C 직각, AB=20·BC=12 길이 지시선 → 입력조건·기하표식·라벨 대조 PASS (plan 정적); SVG 실물 관측 미완료 |
| q17 | 해설 | PLAN_1:1_PASS | `construction-spike-v1` | [q17-solution.plan.json](./q17-solution.plan.json) | shallow OK / full OK | ∠C 직각, AC=16 추가 지시선과 AB20·BC12 → 입력조건·기하표식·라벨 대조 PASS (plan 정적); SVG 실물 관측 미완료 |
| q18 | 문항 | PLAN_1:1_PASS | `construction-spike-v1` | [q18-problem.plan.json](./q18-problem.plan.json) | shallow OK / full OK | I 내심, AI·BI·CI 점선, ∠A=64° → 입력조건·기하표식·라벨 대조 PASS (plan 정적); SVG 실물 관측 미완료 |
| q18 | 해설 | PLAN_1:1_PASS | `construction-spike-v1` | [q18-solution.plan.json](./q18-solution.plan.json) | shallow OK / full OK | A의 반각 32°, ∠BIC=122°, 내심 보조선 → 입력조건·기하표식·라벨 대조 PASS (plan 정적); SVG 실물 관측 미완료 |
| q19 | 문항 | PLAN_1:1_PASS | `construction-spike-v1` | [q19-problem.plan.json](./q19-problem.plan.json) | shallow OK / full OK | 외접원과 중심 O, OA·OB·OC 점선, AC=10cm (둘레 24는 발문) → 입력조건·기하표식·라벨 대조 PASS (plan 정적); SVG 실물 관측 미완료 |
| q19 | 해설 | PLAN_1:1_PASS | `construction-spike-v1` | [q19-solution.plan.json](./q19-solution.plan.json) | shallow OK / full OK | OA=OC 반지름 7cm, AC=10cm, 삼각형 AOC → 입력조건·기하표식·라벨 대조 PASS (plan 정적); SVG 실물 관측 미완료 |
| q20 | 문항 | PLAN_1:1_PASS | `construction-spike-v1` | [q20-problem.plan.json](./q20-problem.plan.json) | shallow OK / full OK | 내접원·접점 D/E/F, AD=5·CE=7의 길이 지시선 → 입력조건·기하표식·라벨 대조 PASS (plan 정적); SVG 실물 관측 미완료 |
| q20 | 해설 | PLAN_1:1_PASS | `construction-spike-v1` | [q20-solution.plan.json](./q20-solution.plan.json) | shallow OK / full OK | AF=AD=5·CF=CE=7 동등눈금, AC=12, 접점반지름 보조점선·직각표식 → 입력조건·기하표식·라벨 대조 PASS (plan 정적); SVG 실물 관측 미완료 |
| q21 | 문항 | PLAN_1:1_PASS | `construction-spike-v1` | [q21-problem.plan.json](./q21-problem.plan.json) | shallow OK / full OK | 외접원·외심 O, △OBC 내심 I 보조선, ∠BIC=140° → 입력조건·기하표식·라벨 대조 PASS (plan 정적); SVG 실물 관측 미완료 |
| q21 | 해설 | PLAN_1:1_PASS | `construction-spike-v1` | [q21-solution.plan.json](./q21-solution.plan.json) | shallow OK / full OK | ∠BOC=100°·∠BAC=50°, OA=OB=OC 반지름 관계 → 입력조건·기하표식·라벨 대조 PASS (plan 정적); SVG 실물 관측 미완료 |
| q22 | 문항 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q22 | 해설 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q23 | 문항 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q23 | 해설 | EXEMPT | `—` | — | N/A (EXEMPT) | 원문·해설은 식·수치·진위판정으로 완결되고 그림 고유 요소가 없어 시각축 면제; 1:1 비시각축 검토 |
| q24 | 문항 | PLAN_1:1_PASS | `construction-spike-v1` | [q24-problem.plan.json](./q24-problem.plan.json) | shallow OK / full OK | C 직각·BC12·CA16, 외접원·내접원 → 입력조건·기하표식·라벨 대조 PASS (plan 정적); SVG 실물 관측 미완료 |
| q24 | 해설 | PLAN_1:1_PASS | `construction-spike-v1` | [q24-solution.plan.json](./q24-solution.plan.json) | shallow OK / full OK | 빗변 AB20·외접반경10·내접반경4, 중심·수선 보조점선 → 입력조건·기하표식·라벨 대조 PASS (plan 정적); SVG 실물 관측 미완료 |
