# 25_강남여고_2학기_기말_고2_확률과통계_유사 — 2축 SVG plan 감사

- 원문: `archive/exams/similar/high/h2/2final/25_강남여고_2학기_기말_고2_확률과통계_유사.js` (현행 main).
- 24문항 × 2축 = **48축**을 각각 판정.
- 공식 실행형 plan: **17개**, 도형 불필요(EXEMPT): **31축**.
- 원본 직접 연결 SVG 4개 중 기본 흰색 배경 rect **2개** 확인(원본 자산 보존, 새 plan에서는 배경 채움 미지정).
- plan-lint shallow/full: **17/17 PASS** (최종 CLI 검증 결과와 동일).
- DRAWN_FEATURE_PARITY: **원문·에셋 ↔ 엔진 JSON 필드의 정적 1:1 대조**. PNG/실물 SVG/학생화면/A4 픽셀 검사는 **RENDER_NOT_RUN**, 즉 NOT_RUN이지 PASS가 아니다.
- 원본 JS·기존 SVG/PNG·다른 시험지는 수정하지 않았다. 기본 도형 면 채움 없음. 확률 영역·넓이 등 문제에 꼭 필요한 영역만 색으로 채운다.

| 파일/qid | 축 | 기존결함/판정·복원 기능 | 원본 에셋/조건 | 원본 배경 | capability | plan 경로 | plan-lint shallow/full | sourceVsPlan | DRAWN_FEATURE_PARITY | 렌더 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 25_강남여고_2학기_기말_고2_확률과통계_유사/q01 | 문항 | EXEMPT: 확률분포표: 도형 없이 발문·수식·표가 조건을 완결한다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_확률과통계_유사/q01 | 해설 | EXEMPT: 확률분포표: 계산·표·정리로 완결되어 독립 그림이 중복된다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_확률과통계_유사/q02 | 문항 | EXEMPT: 이항분포의 평균: 도형 없이 발문·수식·표가 조건을 완결한다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_확률과통계_유사/q02 | 해설 | EXEMPT: 이항분포의 평균: 계산·표·정리로 완결되어 독립 그림이 중복된다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_확률과통계_유사/q03 | 문항 | EXEMPT: 표준정규분포표 읽기: 도형 없이 발문·수식·표가 조건을 완결한다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_확률과통계_유사/q03 | 해설 | PLAN: 표준정규분포 z=−1.5와 1.5 사이 대칭 두 영역 0.4332씩 | `원문 수식·조건` | — | `stat-chart-figure-v1` | `archive/tools/geometry-equation/production/plans/25_강남여고_2학기_기말_고2_확률과통계_유사/q03-solution.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
| 25_강남여고_2학기_기말_고2_확률과통계_유사/q04 | 문항 | EXEMPT: 정규분포의 표준화: 도형 없이 발문·수식·표가 조건을 완결한다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_확률과통계_유사/q04 | 해설 | PLAN: N(20,4²)에서 X≤14의 왼쪽 꼬리와 표준화 z=−1.5 | `원문 수식·조건` | — | `stat-chart-figure-v1` | `archive/tools/geometry-equation/production/plans/25_강남여고_2학기_기말_고2_확률과통계_유사/q04-solution.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
| 25_강남여고_2학기_기말_고2_확률과통계_유사/q05 | 문항 | EXEMPT: 정규분포의 구간 확률: 도형 없이 발문·수식·표가 조건을 완결한다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_확률과통계_유사/q05 | 해설 | PLAN: N(60,6²)의 확률 구간 [51,66]을 z=−1.5,0,1의 두 색으로 분리 | `원문 수식·조건` | — | `stat-chart-figure-v1` | `archive/tools/geometry-equation/production/plans/25_강남여고_2학기_기말_고2_확률과통계_유사/q05-solution.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
| 25_강남여고_2학기_기말_고2_확률과통계_유사/q06 | 문항 | EXEMPT: 확률변수의 일차변환: 도형 없이 발문·수식·표가 조건을 완결한다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_확률과통계_유사/q06 | 해설 | EXEMPT: 확률변수의 일차변환: 계산·표·정리로 완결되어 독립 그림이 중복된다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_확률과통계_유사/q07 | 문항 | EXEMPT: 정규분포 곡선의 대칭: 도형 없이 발문·수식·표가 조건을 완결한다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_확률과통계_유사/q07 | 해설 | PLAN: 원본 수직선 양 끝 A=61·B=75, 중점 M=68, 동일 길이 7·7 | `archive/assets/images/25_강남여고_2학기_기말_고2_확률과통계_유사/q07-solution.svg` | 원본 흰 배경 없음 | `number-line-figure-v1` | `archive/tools/geometry-equation/production/plans/25_강남여고_2학기_기말_고2_확률과통계_유사/q07-solution.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
| 25_강남여고_2학기_기말_고2_확률과통계_유사/q08 | 문항 | EXEMPT: 확률밀도함수: 도형 없이 발문·수식·표가 조건을 완결한다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_확률과통계_유사/q08 | 해설 | PLAN: 원본 확률밀도함수 직선 y=(x−1)/2, 끝점 (1,0)·(3,1), 전체 삼각형 영역 S | `archive/assets/images/25_강남여고_2학기_기말_고2_확률과통계_유사/q08-solution.svg` | 원본 흰 배경 있음 → 새 plan에는 미지정 | `piecewise-polynomial-spike-v1` | `archive/tools/geometry-equation/production/plans/25_강남여고_2학기_기말_고2_확률과통계_유사/q08-solution.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
| 25_강남여고_2학기_기말_고2_확률과통계_유사/q09 | 문항 | EXEMPT: 정규분포 곡선의 비교: 도형 없이 발문·수식·표가 조건을 완결한다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_확률과통계_유사/q09 | 해설 | PLAN: 세 학교 A(70,10), B(80,10), C(80,15)의 평균 이동과 표준편차에 따른 봉우리 높이·폭 비교 | `원문 수식·조건` | — | `stat-chart-figure-v1` | `archive/tools/geometry-equation/production/plans/25_강남여고_2학기_기말_고2_확률과통계_유사/q09-solution.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
| 25_강남여고_2학기_기말_고2_확률과통계_유사/q10 | 문항 | EXEMPT: 이항분포의 정규분포 근사: 도형 없이 발문·수식·표가 조건을 완결한다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_확률과통계_유사/q10 | 해설 | PLAN: 이항분포 B(400,1/5)의 정규근사 N(80,8²): a=68과 88 사이 두 면적 0.4332·0.3413 | `원문 수식·조건` | — | `stat-chart-figure-v1` | `archive/tools/geometry-equation/production/plans/25_강남여고_2학기_기말_고2_확률과통계_유사/q10-solution.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
| 25_강남여고_2학기_기말_고2_확률과통계_유사/q11 | 문항 | EXEMPT: 표본평균의 분포: 도형 없이 발문·수식·표가 조건을 완결한다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_확률과통계_유사/q11 | 해설 | PLAN: 표본평균 N(80,2²)의 X̄≥77, z≥−1.5 오른쪽 누적 면적 | `원문 수식·조건` | — | `stat-chart-figure-v1` | `archive/tools/geometry-equation/production/plans/25_강남여고_2학기_기말_고2_확률과통계_유사/q11-solution.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
| 25_강남여고_2학기_기말_고2_확률과통계_유사/q12 | 문항 | EXEMPT: 확률밀도함수의 구간 확률: 도형 없이 발문·수식·표가 조건을 완결한다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_확률과통계_유사/q12 | 해설 | PLAN: 원본 밀도함수의 A(0,2/5)·B(2,0)·C(5,2/5), P(X≥1) 적분영역 | `archive/assets/images/25_강남여고_2학기_기말_고2_확률과통계_유사/q12-solution.svg` | 원본 흰 배경 있음 → 새 plan에는 미지정 | `piecewise-polynomial-spike-v1` | `archive/tools/geometry-equation/production/plans/25_강남여고_2학기_기말_고2_확률과통계_유사/q12-solution.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
| 25_강남여고_2학기_기말_고2_확률과통계_유사/q13 | 문항 | EXEMPT: 신뢰구간의 길이: 도형 없이 발문·수식·표가 조건을 완결한다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_확률과통계_유사/q13 | 해설 | EXEMPT: 신뢰구간의 길이: 계산·표·정리로 완결되어 독립 그림이 중복된다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_확률과통계_유사/q14 | 문항 | EXEMPT: 표본평균의 분포와 경우의 수: 도형 없이 발문·수식·표가 조건을 완결한다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_확률과통계_유사/q14 | 해설 | EXEMPT: 표본평균의 분포와 경우의 수: 계산·표·정리로 완결되어 독립 그림이 중복된다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_확률과통계_유사/q15 | 문항 | EXEMPT: 이항분포의 확률: 도형 없이 발문·수식·표가 조건을 완결한다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_확률과통계_유사/q15 | 해설 | EXEMPT: 이항분포의 확률: 계산·표·정리로 완결되어 독립 그림이 중복된다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_확률과통계_유사/q16 | 문항 | EXEMPT: 신뢰구간: 도형 없이 발문·수식·표가 조건을 완결한다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_확률과통계_유사/q16 | 해설 | PLAN: 원본 99%·95% 신뢰구간 끝점 2013/100·2787/100·1053/50·1347/50과 자연수 22,23,24,25,26 | `archive/assets/images/25_강남여고_2학기_기말_고2_확률과통계_유사/q16-solution.svg` | 원본 흰 배경 없음 | `number-line-figure-v1` | `archive/tools/geometry-equation/production/plans/25_강남여고_2학기_기말_고2_확률과통계_유사/q16-solution.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
| 25_강남여고_2학기_기말_고2_확률과통계_유사/q17 | 문항 | EXEMPT: 이항분포와 정규분포 근사: 도형 없이 발문·수식·표가 조건을 완결한다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_확률과통계_유사/q17 | 해설 | PLAN: 판별식 (X−16)(X−26)≥0의 두 꼬리 P(X≤16)+P(X≥26)를 정규근사 곡선에 별도 음영 | `원문 수식·조건` | — | `stat-chart-figure-v1` | `archive/tools/geometry-equation/production/plans/25_강남여고_2학기_기말_고2_확률과통계_유사/q17-solution.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
| 25_강남여고_2학기_기말_고2_확률과통계_유사/q18 | 문항 | EXEMPT: 확률분포표와 분산: 도형 없이 발문·수식·표가 조건을 완결한다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_확률과통계_유사/q18 | 해설 | EXEMPT: 확률분포표와 분산: 계산·표·정리로 완결되어 독립 그림이 중복된다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_확률과통계_유사/q19 | 문항 | EXEMPT: 표본평균과 이항분포 근사: 도형 없이 발문·수식·표가 조건을 완결한다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_확률과통계_유사/q19 | 해설 | PLAN: 과일 상자 평균 N(500,5²)의 불량 판정 X̄<495 또는 X̄>509 양쪽 꼬리 | `원문 수식·조건` | — | `stat-chart-figure-v1` | `archive/tools/geometry-equation/production/plans/25_강남여고_2학기_기말_고2_확률과통계_유사/q19-solution.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
| 25_강남여고_2학기_기말_고2_확률과통계_유사/q20 | 문항 | EXEMPT: 표본평균과 표본의 크기: 도형 없이 발문·수식·표가 조건을 완결한다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_확률과통계_유사/q20 | 해설 | PLAN: f(0)=0.95를 제외하면 f(2.4)≤0.025, 정규분포 왼쪽 꼬리 z≤−1.96과 주어진 z=1.64의 기준값 | `원문 수식·조건` | — | `stat-chart-figure-v1` | `archive/tools/geometry-equation/production/plans/25_강남여고_2학기_기말_고2_확률과통계_유사/q20-solution.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
| 25_강남여고_2학기_기말_고2_확률과통계_유사/q21 | 문항 | EXEMPT: 이항분포와 정규분포 근사: 도형 없이 발문·수식·표가 조건을 완결한다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_확률과통계_유사/q21 | 해설 | PLAN: 앞면 64회 중 X≥38이 되는 정규근사 N(32,4²) 오른쪽 꼬리 z≥1.5 | `원문 수식·조건` | — | `stat-chart-figure-v1` | `archive/tools/geometry-equation/production/plans/25_강남여고_2학기_기말_고2_확률과통계_유사/q21-solution.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
| 25_강남여고_2학기_기말_고2_확률과통계_유사/q22 | 문항 | EXEMPT: 정규분포의 일차변환: 도형 없이 발문·수식·표가 조건을 완결한다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_확률과통계_유사/q22 | 해설 | PLAN: 일차변환 Y=2X−30의 평균70·표준편차10 및 P(Y≥55), z≥−1.5 | `원문 수식·조건` | — | `stat-chart-figure-v1` | `archive/tools/geometry-equation/production/plans/25_강남여고_2학기_기말_고2_확률과통계_유사/q22-solution.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
| 25_강남여고_2학기_기말_고2_확률과통계_유사/q23 | 문항 | EXEMPT: 표본평균과 표본의 크기: 도형 없이 발문·수식·표가 조건을 완결한다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_확률과통계_유사/q23 | 해설 | PLAN: n=225의 표본평균 N(50,(2/3)²): 49·50·51의 좌우 대칭 구간 넓이 0.4332씩 | `원문 수식·조건` | — | `stat-chart-figure-v1` | `archive/tools/geometry-equation/production/plans/25_강남여고_2학기_기말_고2_확률과통계_유사/q23-solution.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
| 25_강남여고_2학기_기말_고2_확률과통계_유사/q24 | 문항 | EXEMPT: 정규분포의 일차변환: 도형 없이 발문·수식·표가 조건을 완결한다. | `원문 수식·조건` | — | `—` | `—` | N/A | REVIEWED | N/A | NOT_RUN |
| 25_강남여고_2학기_기말_고2_확률과통계_유사/q24 | 해설 | PLAN: 두 독립 정규분포 X,Y의 기준점·평균·확률 구간을 각각 한 패널에서 정확히 보여줌 | `원문 수식·조건` | — | `composite-panels-v1` | `archive/tools/geometry-equation/production/plans/25_강남여고_2학기_기말_고2_확률과통계_유사/q24-solution.plan.json` | PASS/PASS | REVIEWED | STATIC_1_TO_1 / RENDER_NOT_RUN | NOT_RUN |
