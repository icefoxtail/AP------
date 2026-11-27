# 25_강남여고_2학기_기말_고2_확률과통계_유사 — 2축 SVG plan 감사

## 2026-11-28 독립 재검증 결과 (최신 기록)

- 작업 전 원격 `origin/main` **90e538f1d596cd9ad9194832168976c863d92c9a**를 새로 조회했다. 아래 2026-11-27 기록의 `ddb73cda`는 당시 기준 SHA로서 최신 main을 뜻하지 않는다. 원문 JS, 직접 연결 유사 SVG 4개, 기출 PNG·SVG, 기존 `_plans/`, 공식 17개 plan 및 엔진 제약을 재대조했다.
- **24문항 × 문제·해설 = 48/48축**. 문제 **EXEMPT 24**, 해설 **BENEFICIAL 17·EXEMPT 7**, 전체 **REQUIRED 0·BENEFICIAL 17·EXEMPT 31**. 아래 문항별 표에서 각각 면제 이유와 수학 도해 필요성을 확인한다.
- 기존 공식 production plan **유지 17·수정 0·신규 0**. 모든 plan의 `sourceConditions`, `mappedTo`(문자열/배열 형태 모두 확인), `caption`, `newVisualInformation`, `accessibilityDescription`, 곡선·좌표·분절점·유효 정의역·음영 경계를 보존한다. `STATIC_FIELD_PARITY` **17 PASS / EXEMPT 31 N/A**이며 `DRAWN_FEATURE_PARITY` **실제 렌더 PASS 0·RENDER_NOT_RUN 17**. 정적 1:1 대응을 실물 SVG PASS로 해석하지 않는다.
- 공식 검수(28개 합산과 구별): 이 폴더 JSON 파싱·필수 스키마 **17 PASS / FAIL 0 / SKIP 0**, 공식 Shallow lint **17 PASS / FAIL 0 / SKIP 0**, 공식 Full lint **17 PASS / FAIL 0 / SKIP 0**. Full lint에서는 lockfile의 NotoSansKR 글꼴 SHA256을 확인하고 `opentype.js`, `mathjax-full` 런타임을 준비해 재실행했다. 최초 의존성 누락으로 보였던 3개 SKIP은 plan 결함이 아니며 최종 집계에 포함하지 않는다.
- **`ORIGINAL_EXAM_PNG_CONFLICT` 12번**: 기출 `q12_density_graph.png`는 꼭짓점 `(3,0)`과 끝점 `(4,a)`인 데 반해 현행 유사 JS는 `(2,0)`, `(5,a)` 및 `a=2/5`를 사용한다. **`ORIGINAL_EXAM_SVG_VARIANT_CONFLICT` 12번**: 기출 `q12-solution-v2.svg`도 `x=1`부터 `4`까지의 영역을 설명한다. 직접 연결된 유사판 `q12-solution.svg`와 현행 JS의 `(0,2/5) → (2,0) → (5,2/5)`, `[1,2]`·`[2,5]` 실제 음영을 제작 기준으로 유지했다. 다른 버전의 숫자를 섞어 그리지 않는다.
- 직접 연결 유사 SVG는 07·08·12·16의 4개이고, 07·16은 **`ORIGINAL_CAPTION_ONLY`**, 08·12는 전체 흰색 배경 `rect`가 있다. plan JSON에는 불필요한 배경 채움 항목을 추가하지 않았으나 공식 `stat-chart-v1.mjs` 및 `number-line-v1.mjs`가 자체적으로 기본 흰 배경 `rect`를 삽입한다. **`ENGINE_CAPABILITY_PENDING:TRANSPARENT_CANVAS_OPTION`**은 관련됨(요청·우회 구현 금지). `MULTI_CURVE_INVERSE_CUBIC`과 `PIECEWISE_POLYNOMIAL_UPPERCASE_FUNCTION_NAME`은 해당 없음.
- 대상 두 시험지의 production plan 폴더와 변경 파일이 겹치는 열린 PR 없음. 단, 오래된 draft [#1985](https://github.com/icefoxtail/AP------/pull/1985)가 **매산여고 유사 JS**를 변경하므로, 이후 이 PR을 병합한다면 **조건·계수·음영 재검증 필요**. 현재 작업은 최신 main JS를 기준으로 하며 기존 JS나 SVG는 수정하지 않는다.
- **RENDER_NOT_RUN**: `/usr/bin/chromium --version` 실행 실패(`exitCode=127`, `/usr/lib/chromium/chromium` 부재). 공식 `render-plan.mjs`의 별도 대표 plan으로 재시도한 결과 `ARCHIVE_PREFLIGHT_FAIL`; 17개의 학생화면·A4·SVG 실출력 및 육안 대조는 수행하지 못했다.

## 이전 상세 감사 및 이력

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

## 2026-11-27 독립 재검증: 문항별 2축 요약

- 최신 확인 기준: 원격 `origin/main`의 `ddb73cdab92709f7b7b85a9353595d59b7b0262f`. 이 시험지의 17개 plan과 48축 상세 감사는 앞선 `aaa40c235`에서 **이미 main에 존재**했다. 누락 없이 재확인하고 필요한 메타데이터·영역 경계만 수정했다.
- 문제 24축 + 해설 24축 = **48/48축**. `REQUIRED` **0축**, `BENEFICIAL` **17축**, `EXEMPT` **31축**. 기존 공식 plan **17개**, 이번 수정 **4개**(q07/08/12/16 해설), 신규 **0개**. 면제 사유는 위의 독립 48축 감사표에 기록했다.
- `STATIC_FIELD_PARITY` 개선: q07(61·75의 중점 m=68), q08(밀도함수 a=1/2), q12((0,2/5)→(2,0)→(5,2/5) 및 확률구간), q16(두 신뢰구간과 정수 22~26)의 원문 조건을 `sourceConditions[].mappedTo`에 명시했다. q12의 유의미한 음영은 영점 `x=2`를 기준으로 **[1,2]와 [2,5] 두 삼각형으로 분리**, 총 확률 7/10을 보존했다.
- 직접 연결 SVG **4개**. q08·q12는 실제 축·곡선·영역이 있지만 q07·q16의 레거시 SVG는 확인 결과 **caption-only 합성 컨테이너**로서 본체 점·선·구간 그림이 없다. 이 두 원본은 `ORIGINAL_CAPTION_ONLY`이며 해설 수식에 근거해 수직선 plan을 복원했다. 기존 상세 표의 이 두 건의 `STATIC_1_TO_1`은 **원문 해설 ↔ plan 의미 정합성**으로만 읽어야 하며 원본 그림의 점·선 일치라는 뜻이 아니다.
- `JSON 파싱·스키마 17/17 PASS`, `Shallow lint 17/17 PASS`, `Full lint 17/17 PASS`, `STATIC_FIELD_PARITY 17 PASS / 31 N/A`, `ENGINE_CAPABILITY_PENDING 0`, `DRAWN_FEATURE_PARITY 실제 렌더 확인 0/17`.
- **RENDER_NOT_RUN**: 공식 `render-plan.mjs`의 q08 수학Ⅱ 대표 plan에 대해 `GEOMETRY_BROWSER_EXECUTABLE=/usr/bin/chromium`으로 재시도했으나 `ARCHIVE_PREFLIGHT_FAIL`. Chromium 실행 래퍼가 가리키는 실제 `/usr/lib/chromium/chromium` 파일이 없어 `exitCode=127`. 본 17개 plan도 실제 출력 SVG·학생화면·원본 픽셀 대조를 통과했다고 선언하지 않는다.

아래 표에서 `원본 SVG`는 `archive/assets/images/25_강남여고_2학기_기말_고2_확률과통계_유사/` 기준, `plan 파일`은 이 문서와 같은 디렉터리 기준이다. 원본이 없는 축은 원문·해설 수식을 근거로 새 도해가 유익한지 판단했다.

| 문항 | 문제 축 판정 | 해설 축 판정 | 원본 SVG | plan 파일 | STATIC_FIELD_PARITY | DRAWN_FEATURE_PARITY | 비고 |
|---|---|---|---|---|---|---|---|
| 01 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 확률분포표 수치·계산식으로 완결. |
| 02 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 이항분포 기대값 공식 적용. |
| 03 | EXEMPT | BENEFICIAL | 없음 | `q03-solution.plan.json` | PASS | 원본 없음 / 렌더 보류 | −1.5~1.5 표준정규분포의 대칭 면적. |
| 04 | EXEMPT | BENEFICIAL | 없음 | `q04-solution.plan.json` | PASS | 원본 없음 / 렌더 보류 | N(20,4²)의 X≤14 왼쪽 꼬리. |
| 05 | EXEMPT | BENEFICIAL | 없음 | `q05-solution.plan.json` | PASS | 원본 없음 / 렌더 보류 | 51~66 구간을 평균 60 기준으로 분리. |
| 06 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 일차변환 기대값·분산만 계산. |
| 07 | EXEMPT | BENEFICIAL | `q07-solution.svg`(caption-only) | `q07-solution.plan.json` | PASS | 원본 그림 미완성 / 렌더 보류 | 평균 68을 중점으로 61·75를 배치; 원본에는 실제 수직선 없음. |
| 08 | EXEMPT | BENEFICIAL | `q08-solution.svg` | `q08-solution.plan.json` | PASS | 정적 일치 / 렌더 보류 | (1,0)~(3,1)의 밀도 삼각형 넓이 1. |
| 09 | EXEMPT | BENEFICIAL | 없음 | `q09-solution.plan.json` | PASS | 원본 없음 / 렌더 보류 | 세 정규곡선 평균 70·80 및 표준편차 10·15 비교. |
| 10 | EXEMPT | BENEFICIAL | 없음 | `q10-solution.plan.json` | PASS | 원본 없음 / 렌더 보류 | 정규근사 N(80,8²), 구간 68~88. |
| 11 | EXEMPT | BENEFICIAL | 없음 | `q11-solution.plan.json` | PASS | 원본 없음 / 렌더 보류 | 표본평균 N(80,2²)의 77 이상 꼬리. |
| 12 | EXEMPT | BENEFICIAL | `q12-solution.svg` | `q12-solution.plan.json` | PASS | ORIGINAL_EXAM_PNG_CONFLICT·ORIGINAL_EXAM_SVG_VARIANT_CONFLICT / RENDER_NOT_RUN | 유사판 1~2와 2~5 음영을 영점 2에서 분리. 기출은 영점 3·끝점 4, 유사판은 영점 2·끝점 5. |
| 13 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 표본 크기와 신뢰구간 폭의 대수식. |
| 14 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 4장 선택 경우의 수와 확률표 산출. |
| 15 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 이항확률 다항방정식. |
| 16 | EXEMPT | BENEFICIAL | `q16-solution.svg`(caption-only) | `q16-solution.plan.json` | PASS | 원본 그림 미완성 / 렌더 보류 | 99%·95% 두 구간과 정수 22~26; 원본은 caption만 존재. |
| 17 | EXEMPT | BENEFICIAL | 없음 | `q17-solution.plan.json` | PASS | 원본 없음 / 렌더 보류 | 근사 정규분포 X≤16 또는 X≥26의 두 꼬리. |
| 18 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 대칭 확률표·분산 계산으로 완결. |
| 19 | EXEMPT | BENEFICIAL | 없음 | `q19-solution.plan.json` | PASS | 원본 없음 / 렌더 보류 | 과일 상자 표본평균의 양쪽 불량 영역. |
| 20 | EXEMPT | BENEFICIAL | 없음 | `q20-solution.plan.json` | PASS | 원본 없음 / 렌더 보류 | z=−1.96 기준 왼쪽 꼬리의 확률. |
| 21 | EXEMPT | BENEFICIAL | 없음 | `q21-solution.plan.json` | PASS | 원본 없음 / 렌더 보류 | 정규근사 N(32,4²)의 38 이상 꼬리. |
| 22 | EXEMPT | BENEFICIAL | 없음 | `q22-solution.plan.json` | PASS | 원본 없음 / 렌더 보류 | Y~N(70,10²)의 55 이상 꼬리. |
| 23 | EXEMPT | BENEFICIAL | 없음 | `q23-solution.plan.json` | PASS | 원본 없음 / 렌더 보류 | 표본평균 49~51 중앙확률 .8664. |
| 24 | EXEMPT | BENEFICIAL | 없음 | `q24-solution.plan.json` | PASS | 원본 없음 / 렌더 보류 | X와 Y 두 정규분포의 구간을 두 패널로 별도 표현. |
