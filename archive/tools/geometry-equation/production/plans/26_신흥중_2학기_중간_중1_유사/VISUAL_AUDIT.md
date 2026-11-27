# 26_신흥중_2학기_중간_중1_유사 — 문제·해설 SVG 2축 정밀 감사

- 현행 원문: `archive/exams/similar/middle/m1/2mid/26_신흥중_2학기_중간_중1_유사.js`.
- 분모: 24 qid × 문제·해설 2축 = **48축**.
- 공식 렌더 실행형 plan: **35개**. plan-lint shallow/full: **35/35 PASS**, 정적 원문·원본 에셋 DRAWN_FEATURE_PARITY: **1:1 구조·스펙 대조**.
- Chrome 실물 렌더: **RENDER_NOT_RUN**; 페이지/학생 화면/A4 픽셀 동일성은 **NOT_RUN**. 정적 구조 검수를 실제 픽셀 PASS로 바꾸어 적지 않는다.
- 원본 JS·SVG/PNG, 다른 시험지/플랜은 수정하지 않았다.
- 불필요한 흰 바탕 사각형/면색은 plan에 없음. 원문에 실제 색칠된 넓이를 묻는 경우에만 LIGHT 영역 음영을 둔다.
- ENGINE_CAPABILITY_PENDING은 단순 결함이 아니라 필요한 기능을 지목하며, unsupported 근사 그림을 PASS 처리하지 않는다.

## 문항별 감사표

| 파일/qid | 축 | 기존결함/판정 | capability | plan경로 | plan-lint | DRAWN_FEATURE_PARITY |
| --- | --- | --- | --- | --- | --- | --- |
| 신흥중/q01 | 문항 | PLAN: A-B-C-D의 일직선 순서, 양 끝 화살표와 C에서 왼쪽을 향하는 반직선 | `construction-spike-v1` | `archive/tools/geometry-equation/production/plans/26_신흥중_2학기_중간_중1_유사/q01-problem.plan.json` | PASS (shallow/full) | STATIC_PASS / RENDER_NOT_RUN |
| 신흥중/q01 | 해설 | EXEMPT: 반직선의 일치 해설이 계산·정리·비례식으로 끝나 독립 도형의 결정적 교육효과가 없음 | `EXEMPT` | `—` | N/A | N/A |
| 신흥중/q02 | 문항 | PLAN: 위·아래 평행선, 두 횡단선, 주어진 65°·55° 각호 및 미지각 x·y를 모두 직접 그림 | `construction-spike-v1` | `archive/tools/geometry-equation/production/plans/26_신흥중_2학기_중간_중1_유사/q02-problem.plan.json` | PASS (shallow/full) | STATIC_PASS / RENDER_NOT_RUN |
| 신흥중/q02 | 해설 | PLAN: 위·아래 평행선, 두 횡단선, 주어진 65°·55° 각호 및 미지각 x·y를 모두 직접 그림 | `construction-spike-v1` | `archive/tools/geometry-equation/production/plans/26_신흥중_2학기_중간_중1_유사/q02-solution.plan.json` | PASS (shallow/full) | STATIC_PASS / RENDER_NOT_RUN |
| 신흥중/q03 | 문항 | PLAN: 사다리꼴의 평행 화살표와 ∠ABC 직각 표식이 실제 도형에 표시됨 | `construction-spike-v1` | `archive/tools/geometry-equation/production/plans/26_신흥중_2학기_중간_중1_유사/q03-problem.plan.json` | PASS (shallow/full) | STATIC_PASS / RENDER_NOT_RUN |
| 신흥중/q03 | 해설 | PLAN: 평행선 사이 거리는 AB=DF이며 수선과 두 직각을 점선으로 표시 | `construction-spike-v1` | `archive/tools/geometry-equation/production/plans/26_신흥중_2학기_중간_중1_유사/q03-solution.plan.json` | PASS (shallow/full) | STATIC_PASS / RENDER_NOT_RUN |
| 신흥중/q04 | 문항 | PLAN: QA=QB=PC=PD, AB=CD인 동일 폭·동일 현 평행선 작도와 보조 원호·점 라벨 | `construction-spike-v1` | `archive/tools/geometry-equation/production/plans/26_신흥중_2학기_중간_중1_유사/q04-problem.plan.json` | PASS (shallow/full) | STATIC_PASS / RENDER_NOT_RUN |
| 신흥중/q04 | 해설 | PLAN: QA=QB=PC=PD, AB=CD인 동일 폭·동일 현 평행선 작도와 보조 원호·점 라벨 | `construction-spike-v1` | `archive/tools/geometry-equation/production/plans/26_신흥중_2학기_중간_중1_유사/q04-solution.plan.json` | PASS (shallow/full) | STATIC_PASS / RENDER_NOT_RUN |
| 신흥중/q05 | 문항 | EXEMPT: 다각형의 대각선 개수 발문이 문자·수식·표 자체로 주어진 조건을 완결함 | `EXEMPT` | `—` | N/A | N/A |
| 신흥중/q05 | 해설 | EXEMPT: 다각형의 대각선 개수 해설이 계산·정리·비례식으로 끝나 독립 도형의 결정적 교육효과가 없음 | `EXEMPT` | `—` | N/A | N/A |
| 신흥중/q06 | 문항 | PLAN: 중심각 두 개의 호/40°·120°와 실제 호 길이 라벨 4cm·x를 표시 | `construction-spike-v1` | `archive/tools/geometry-equation/production/plans/26_신흥중_2학기_중간_중1_유사/q06-problem.plan.json` | PASS (shallow/full) | STATIC_PASS / RENDER_NOT_RUN |
| 신흥중/q06 | 해설 | PLAN: 중심각 두 개의 호/40°·120°와 실제 호 길이 라벨 4cm·x를 표시 | `construction-spike-v1` | `archive/tools/geometry-equation/production/plans/26_신흥중_2학기_중간_중1_유사/q06-solution.plan.json` | PASS (shallow/full) | STATIC_PASS / RENDER_NOT_RUN |
| 신흥중/q07 | 문항 | PLAN: AB=15cm, BC=5cm로 비가 정확히 3:1이고 M/N 중점, MN=10cm인 치수 | `construction-spike-v1` | `archive/tools/geometry-equation/production/plans/26_신흥중_2학기_중간_중1_유사/q07-problem.plan.json` | PASS (shallow/full) | STATIC_PASS / RENDER_NOT_RUN |
| 신흥중/q07 | 해설 | PLAN: AB=15cm, BC=5cm로 비가 정확히 3:1이고 M/N 중점, MN=10cm인 치수 | `construction-spike-v1` | `archive/tools/geometry-equation/production/plans/26_신흥중_2학기_중간_중1_유사/q07-solution.plan.json` | PASS (shallow/full) | STATIC_PASS / RENDER_NOT_RUN |
| 신흥중/q08 | 문항 | PLAN: 직육면체 원본의 12모서리·보이지 않는 선·AB 관계를 공식 입체 엔진으로 재구성 | `solid-figure-v1` | `archive/tools/geometry-equation/production/plans/26_신흥중_2학기_중간_중1_유사/q08-problem.plan.json` | PASS (shallow/full) | STATIC_PASS / RENDER_NOT_RUN |
| 신흥중/q08 | 해설 | EXEMPT: 직육면체 모서리의 위치 관계 해설이 계산·정리·비례식으로 끝나 독립 도형의 결정적 교육효과가 없음 | `EXEMPT` | `—` | N/A | N/A |
| 신흥중/q09 | 문항 | PLAN: 원본의 평행선·꺾인 지점·35°·85°·미지각 x 및 해설의 평행 보조선 | `construction-spike-v1` | `archive/tools/geometry-equation/production/plans/26_신흥중_2학기_중간_중1_유사/q09-problem.plan.json` | PASS (shallow/full) | STATIC_PASS / RENDER_NOT_RUN |
| 신흥중/q09 | 해설 | PLAN: 원본의 평행선·꺾인 지점·35°·85°·미지각 x 및 해설의 평행 보조선 | `construction-spike-v1` | `archive/tools/geometry-equation/production/plans/26_신흥중_2학기_중간_중1_유사/q09-solution.plan.json` | PASS (shallow/full) | STATIC_PASS / RENDER_NOT_RUN |
| 신흥중/q10 | 문항 | EXEMPT: 삼각형의 작도 조건 발문이 문자·수식·표 자체로 주어진 조건을 완결함 | `EXEMPT` | `—` | N/A | N/A |
| 신흥중/q10 | 해설 | EXEMPT: SSS/SAS/ASA 구별의 보조 그림은 선택 사항으로 풀이 수식이 완결됨 | `EXEMPT` | `—` | N/A | N/A |
| 신흥중/q11 | 문항 | EXEMPT: 삼각형의 세 변의 길이 조건 발문이 문자·수식·표 자체로 주어진 조건을 완결함 | `EXEMPT` | `—` | N/A | N/A |
| 신흥중/q11 | 해설 | EXEMPT: 삼각형 부등식을 만족하는 정수 삼중항 열거만으로 충분 | `EXEMPT` | `—` | N/A | N/A |
| 신흥중/q12 | 문항 | PLAN: 정삼각형 두 개의 각 60°·각각의 같은 길이 눈금·일직선 A-C-B·대각선 AE/DB·교점 P | `construction-spike-v1` | `archive/tools/geometry-equation/production/plans/26_신흥중_2학기_중간_중1_유사/q12-problem.plan.json` | PASS (shallow/full) | STATIC_PASS / RENDER_NOT_RUN |
| 신흥중/q12 | 해설 | PLAN: 정삼각형 두 개의 각 60°·각각의 같은 길이 눈금·일직선 A-C-B·대각선 AE/DB·교점 P | `construction-spike-v1` | `archive/tools/geometry-equation/production/plans/26_신흥중_2학기_중간_중1_유사/q12-solution.plan.json` | PASS (shallow/full) | STATIC_PASS / RENDER_NOT_RUN |
| 신흥중/q13 | 문항 | PLAN: 정육각형의 여섯 변, 정사각형의 네 변, 공유변 ED와 FH, 정각 120°·90° | `construction-spike-v1` | `archive/tools/geometry-equation/production/plans/26_신흥중_2학기_중간_중1_유사/q13-problem.plan.json` | PASS (shallow/full) | STATIC_PASS / RENDER_NOT_RUN |
| 신흥중/q13 | 해설 | PLAN: 정육각형의 여섯 변, 정사각형의 네 변, 공유변 ED와 FH, 정각 120°·90° | `construction-spike-v1` | `archive/tools/geometry-equation/production/plans/26_신흥중_2학기_중간_중1_유사/q13-solution.plan.json` | PASS (shallow/full) | STATIC_PASS / RENDER_NOT_RUN |
| 신흥중/q14 | 문항 | EXEMPT: 정다각형의 내각의 합 발문이 문자·수식·표 자체로 주어진 조건을 완결함 | `EXEMPT` | `—` | N/A | N/A |
| 신흥중/q14 | 해설 | EXEMPT: 정다각형 외각·내각의 수치 공식만으로 풀이 가능 | `EXEMPT` | `—` | N/A | N/A |
| 신흥중/q15 | 문항 | PLAN: 지름 AB, 반원호, 평행 표식, 두 호의 2:5 대응과 모든 점 라벨 | `construction-spike-v1` | `archive/tools/geometry-equation/production/plans/26_신흥중_2학기_중간_중1_유사/q15-problem.plan.json` | PASS (shallow/full) | STATIC_PASS / RENDER_NOT_RUN |
| 신흥중/q15 | 해설 | PLAN: 지름 AB, 반원호, 평행 표식, 두 호의 2:5 대응과 모든 점 라벨 | `construction-spike-v1` | `archive/tools/geometry-equation/production/plans/26_신흥중_2학기_중간_중1_유사/q15-solution.plan.json` | PASS (shallow/full) | STATIC_PASS / RENDER_NOT_RUN |
| 신흥중/q16 | 문항 | PLAN: 삼각형 꼭지각 40°, AB=AC 눈금, 진짜 변과 반원의 교점 D/E, 반지름 OD/OE, 지름 12cm 표시 | `construction-spike-v1` | `archive/tools/geometry-equation/production/plans/26_신흥중_2학기_중간_중1_유사/q16-problem.plan.json` | PASS (shallow/full) | STATIC_PASS / RENDER_NOT_RUN |
| 신흥중/q16 | 해설 | PLAN: 삼각형 꼭지각 40°, AB=AC 눈금, 진짜 변과 반원의 교점 D/E, 반지름 OD/OE, 지름 12cm 표시 | `construction-spike-v1` | `archive/tools/geometry-equation/production/plans/26_신흥중_2학기_중간_중1_유사/q16-solution.plan.json` | PASS (shallow/full) | STATIC_PASS / RENDER_NOT_RUN |
| 신흥중/q17 | 문항 | EXEMPT: 공간에서 직선과 평면의 위치 관계 발문이 문자·수식·표 자체로 주어진 조건을 완결함 | `EXEMPT` | `—` | N/A | N/A |
| 신흥중/q17 | 해설 | EXEMPT: 공간 직선과 평면의 보편 명제는 한 그림으로 단정하면 오히려 오해 | `EXEMPT` | `—` | N/A | N/A |
| 신흥중/q18 | 문항 | PLAN: 두 정삼각형의 실제 60° 각·동일 길이 눈금, BD/BE와 AD 연결 및 75° 각호 | `construction-spike-v1` | `archive/tools/geometry-equation/production/plans/26_신흥중_2학기_중간_중1_유사/q18-problem.plan.json` | PASS (shallow/full) | STATIC_PASS / RENDER_NOT_RUN |
| 신흥중/q18 | 해설 | PLAN: 두 정삼각형의 실제 60° 각·동일 길이 눈금, BD/BE와 AD 연결 및 75° 각호 | `construction-spike-v1` | `archive/tools/geometry-equation/production/plans/26_신흥중_2학기_중간_중1_유사/q18-solution.plan.json` | PASS (shallow/full) | STATIC_PASS / RENDER_NOT_RUN |
| 신흥중/q19 | 문항 | PLAN: 별 오각형의 다섯 내부 끝각, 정확한 다섯 대각선과 교차 구조 | `construction-spike-v1` | `archive/tools/geometry-equation/production/plans/26_신흥중_2학기_중간_중1_유사/q19-problem.plan.json` | PASS (shallow/full) | STATIC_PASS / RENDER_NOT_RUN |
| 신흥중/q19 | 해설 | PLAN: 해설에서 직접 정의한 두 교점 P=BD∩CE, Q=BD∩AC를 추가한 각 합 도형 | `construction-spike-v1` | `archive/tools/geometry-equation/production/plans/26_신흥중_2학기_중간_중1_유사/q19-solution.plan.json` | PASS (shallow/full) | STATIC_PASS / RENDER_NOT_RUN |
| 신흥중/q20 | 문항 | PLAN: 장애물 직사각형, 줄 6m의 270° 경계, 두 꼭짓점을 돈 길이 1m·3m의 90° 경계 | `construction-spike-v1` | `archive/tools/geometry-equation/production/plans/26_신흥중_2학기_중간_중1_유사/q20-problem.plan.json` | PASS (shallow/full) | STATIC_PASS / RENDER_NOT_RUN |
| 신흥중/q20 | 해설 | PLAN: 창고 밖 이동 가능 영역 세 부채꼴을 중심 A, B, D로 정확히 분리 | `construction-spike-v1` | `archive/tools/geometry-equation/production/plans/26_신흥중_2학기_중간_중1_유사/q20-solution.plan.json` | PASS (shallow/full) | STATIC_PASS / RENDER_NOT_RUN |
| 신흥중/q21 | 문항 | EXEMPT: 선분의 비와 중점 발문이 문자·수식·표 자체로 주어진 조건을 완결함 | `EXEMPT` | `—` | N/A | N/A |
| 신흥중/q21 | 해설 | PLAN: 중점 눈금과 길이비 4k:5k, A-M-B-N-C 점 순서 | `construction-spike-v1` | `archive/tools/geometry-equation/production/plans/26_신흥중_2학기_중간_중1_유사/q21-solution.plan.json` | PASS (shallow/full) | STATIC_PASS / RENDER_NOT_RUN |
| 신흥중/q22 | 문항 | PLAN: 일직선의 5개 반직선과 서로 다른 두 부분각 1:4 비율, 해당 각 호 | `construction-spike-v1` | `archive/tools/geometry-equation/production/plans/26_신흥중_2학기_중간_중1_유사/q22-problem.plan.json` | PASS (shallow/full) | STATIC_PASS / RENDER_NOT_RUN |
| 신흥중/q22 | 해설 | PLAN: 일직선의 5개 반직선과 서로 다른 두 부분각 1:4 비율, 해당 각 호 | `construction-spike-v1` | `archive/tools/geometry-equation/production/plans/26_신흥중_2학기_중간_중1_유사/q22-solution.plan.json` | PASS (shallow/full) | STATIC_PASS / RENDER_NOT_RUN |
| 신흥중/q23 | 문항 | PLAN: 정사각형 네 변·6cm 길이, 서로 다른 중심의 두 90° 호 및 실제 렌즈 교집합만 면 채움 | `construction-spike-v1` | `archive/tools/geometry-equation/production/plans/26_신흥중_2학기_중간_중1_유사/q23-problem.plan.json` | PASS (shallow/full) | STATIC_PASS / RENDER_NOT_RUN |
| 신흥중/q23 | 해설 | PLAN: 두 6cm 사분원 90° 호와 정확한 공통 영역의 경계 및 의미 있는 음영 | `construction-spike-v1` | `archive/tools/geometry-equation/production/plans/26_신흥중_2학기_중간_중1_유사/q23-solution.plan.json` | PASS (shallow/full) | STATIC_PASS / RENDER_NOT_RUN |
| 신흥중/q24 | 문항 | PLAN: 정삼각형의 두 대응변 눈금, AD·BE 교점 및 해설 목표각의 구분 | `construction-spike-v1` | `archive/tools/geometry-equation/production/plans/26_신흥중_2학기_중간_중1_유사/q24-problem.plan.json` | PASS (shallow/full) | STATIC_PASS / RENDER_NOT_RUN |
| 신흥중/q24 | 해설 | PLAN: 정삼각형의 두 대응변 눈금, AD·BE 교점 및 해설 목표각의 구분 | `construction-spike-v1` | `archive/tools/geometry-equation/production/plans/26_신흥중_2학기_중간_중1_유사/q24-solution.plan.json` | PASS (shallow/full) | STATIC_PASS / RENDER_NOT_RUN |
