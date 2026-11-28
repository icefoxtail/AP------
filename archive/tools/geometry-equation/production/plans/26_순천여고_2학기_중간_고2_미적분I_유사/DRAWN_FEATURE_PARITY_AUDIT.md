# DRAWN_FEATURE_PARITY — 2026 순천여고 고2 미적분Ⅰ 유사

- 범위: archive/exams/similar/high/h2/2mid/26_순천여고_2학기_중간_고2_미적분I_유사.js (23문항, 46축).
- 대조: 유사 JS 전체 문항·해설·이미지 참조 및 archive/assets/images/26_순천여고_2학기_중간_고2_미적분I/qNN.png 원본 PNG를 육안 검토했다. 기존 원본 해설 SVG는 태그/점·선·면 구조를 검사했다.
- 검증: production plan 13개 각각 shallow/full plan-lint 통과. 이는 구조·엔진 계약 PASS이며 화면 렌더를 통과했다는 뜻이 아니다.
- RENDER_NOT_RUN: /usr/bin/chromium 래퍼가 /usr/lib/chromium/chromium 실행 파일 누락으로 종료(127). 실제 렌더/픽셀 관측 미실행. 본 문서의 패리티는 원문·PNG 대비 정적 요소/값 대조다.
- 엔진 공통 ENGINE_CAPABILITY_PENDING: TRANSPARENT_BACKGROUND_OPTOUT. 현행 엔진은 흰 배경 rect를 자동 출력하며 plan에서 제거하는 옵션이 없다. 본 작업은 plan 자체에 불필요한 전면 fill을 선언하지 않는다. 다만 제일고 19번은 원문·원본의 삼각형 넓이 강조를 위해 LIGHT 두 면만 유지한다.
- 원본 이미지와 유사 JS 수치/상태가 다르면 정본인 해당 유사 JS를 우선했다. 눈대중으로 원본 이미지와 픽셀 1:1 동일하다고 보고하지 않는다.

| 파일/qid | 축 | 기존결함/판정 | capability | plan경로 | plan-lint | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|---|
| 26_순천여고_2학기_중간_고2_미적분I_유사.js/q01 | 문제 | EXEMPT — 다항 극한 대입; 발문에 별도 필수 그림 없음 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_순천여고_2학기_중간_고2_미적분I_유사.js/q01 | 해설 | EXEMPT — 다항 극한 대입; 해설이 식/논증으로 완결되며 고유 도형 불필요 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_순천여고_2학기_중간_고2_미적분I_유사.js/q02 | 문제 | EXEMPT — 무한대 유리식 최고차항 비교; 발문에 별도 필수 그림 없음 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_순천여고_2학기_중간_고2_미적분I_유사.js/q02 | 해설 | EXEMPT — 무한대 유리식 최고차항 비교; 해설이 식/논증으로 완결되며 고유 도형 불필요 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_순천여고_2학기_중간_고2_미적분I_유사.js/q03 | 문제 | EXEMPT — 구멍 함수 연속조건; 발문에 별도 필수 그림 없음 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_순천여고_2학기_중간_고2_미적분I_유사.js/q03 | 해설 | EXEMPT — 구멍 함수 연속조건; 해설이 식/논증으로 완결되며 고유 도형 불필요 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_순천여고_2학기_중간_고2_미적분I_유사.js/q04 | 문제 | EXEMPT — 접선 미분계수; 발문에 별도 필수 그림 없음 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_순천여고_2학기_중간_고2_미적분I_유사.js/q04 | 해설 | 접점 P(2,-1)와 실제 접선 y=x-3 추가 | polynomial-spike-v1 | [q04-solution.plan.json](./q04-solution.plan.json) | shallow PASS · full PASS | 유사 JS 문장·해설의 점/곡선/선분 정적 대조; STATIC_SPEC_CHECK · RENDER_NOT_RUN |
| 26_순천여고_2학기_중간_고2_미적분I_유사.js/q05 | 문제 | EXEMPT — 미분 정의식 변형; 발문에 별도 필수 그림 없음 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_순천여고_2학기_중간_고2_미적분I_유사.js/q05 | 해설 | EXEMPT — 미분 정의식 변형; 해설이 식/논증으로 완결되며 고유 도형 불필요 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_순천여고_2학기_중간_고2_미적분I_유사.js/q06 | 문제 | EXEMPT — 삼차식 인수분해; 발문에 별도 필수 그림 없음 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_순천여고_2학기_중간_고2_미적분I_유사.js/q06 | 해설 | EXEMPT — 삼차식 인수분해; 해설이 식/논증으로 완결되며 고유 도형 불필요 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_순천여고_2학기_중간_고2_미적분I_유사.js/q07 | 문제 | EXEMPT — 접선과 미분계수; 발문에 별도 필수 그림 없음 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_순천여고_2학기_중간_고2_미적분I_유사.js/q07 | 해설 | EXEMPT — 접선과 미분계수; 해설이 식/논증으로 완결되며 고유 도형 불필요 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_순천여고_2학기_중간_고2_미적분I_유사.js/q08 | 문제 | EXEMPT — 삼차함수 실근·접선; 발문에 별도 필수 그림 없음 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_순천여고_2학기_중간_고2_미적분I_유사.js/q08 | 해설 | 교점 A(-1,0)·접선 y=5x+5 복구 | polynomial-spike-v1 | [q08-solution.plan.json](./q08-solution.plan.json) | shallow PASS · full PASS | 유사 JS 문장·해설의 점/곡선/선분 정적 대조; STATIC_SPEC_CHECK · RENDER_NOT_RUN |
| 26_순천여고_2학기_중간_고2_미적분I_유사.js/q09 | 문제 | 기존 임의 조각을 x=1 구멍, x=3 첨점, x=4 수평극점, x=5 점프로 교정 | piecewise-discontinuous-spike-v1 | [q09-problem.plan.json](./q09-problem.plan.json) | shallow PASS · full PASS | 원본 PNG 끊김 위치와 JS 설명이 상충; JS 우선/픽셀 등가 불가; STATIC_SPEC_CHECK · RENDER_NOT_RUN |
| 26_순천여고_2학기_중간_고2_미적분I_유사.js/q09 | 해설 | 불연속점·첨점·매끄러운 극값을 분리 | piecewise-discontinuous-spike-v1 | [q09-solution.plan.json](./q09-solution.plan.json) | shallow PASS · full PASS | 원본 PNG 끊김 위치와 JS 설명이 상충; JS 우선/픽셀 등가 불가; STATIC_SPEC_CHECK · RENDER_NOT_RUN |
| 26_순천여고_2학기_중간_고2_미적분I_유사.js/q10 | 문제 | EXEMPT — 경계점 미분가능; 발문에 별도 필수 그림 없음 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_순천여고_2학기_중간_고2_미적분I_유사.js/q10 | 해설 | EXEMPT — 경계점 미분가능; 해설이 식/논증으로 완결되며 고유 도형 불필요 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_순천여고_2학기_중간_고2_미적분I_유사.js/q11 | 문제 | EXEMPT — 근호 유리화; 발문에 별도 필수 그림 없음 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_순천여고_2학기_중간_고2_미적분I_유사.js/q11 | 해설 | EXEMPT — 근호 유리화; 해설이 식/논증으로 완결되며 고유 도형 불필요 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_순천여고_2학기_중간_고2_미적분I_유사.js/q12 | 문제 | EXEMPT — 절댓값 분모의 좌우극한; 발문에 별도 필수 그림 없음 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_순천여고_2학기_중간_고2_미적분I_유사.js/q12 | 해설 | ENGINE_CAPABILITY_PENDING — x=3에서 함수 미정의인데 엔진 OPEN/OPEN 조각에 jumpValues 함숫값을 강제함. 허위 함숫값 금지 | ENGINE_CAPABILITY_PENDING: UNDEFINED_HOLE_WITHOUT_JUMP_VALUE | 미생성(허위 그림 금지) | 제약 판정 / plan 없음 | 도형 생성 불가 · RENDER_NOT_RUN |
| 26_순천여고_2학기_중간_고2_미적분I_유사.js/q13 | 문제 | EXEMPT — 끼임정리; 발문에 별도 필수 그림 없음 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_순천여고_2학기_중간_고2_미적분I_유사.js/q13 | 해설 | EXEMPT — 끼임정리; 해설이 식/논증으로 완결되며 고유 도형 불필요 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_순천여고_2학기_중간_고2_미적분I_유사.js/q14 | 문제 | 원·AB 직선·BC 보조선·반지름 2의 치수선 명시 | construction-spike-v1 | [q14-problem.plan.json](./q14-problem.plan.json) | shallow PASS · full PASS | 원본 PNG 반지름 1과 JS 반지름 2는 값이 다름; 기하 구조 보존; STATIC_SPEC_CHECK · RENDER_NOT_RUN |
| 26_순천여고_2학기_중간_고2_미적분I_유사.js/q14 | 해설 | 원·반지름·밑변 AC·높이 BC의 기하 관계 재구성 | construction-spike-v1 | [q14-solution.plan.json](./q14-solution.plan.json) | shallow PASS · full PASS | 원본 PNG 반지름 1과 JS 반지름 2는 값이 다름; 기하 구조 보존; STATIC_SPEC_CHECK · RENDER_NOT_RUN |
| 26_순천여고_2학기_중간_고2_미적분I_유사.js/q15 | 문제 | EXEMPT — 미지 연속함수의 미분성; 발문에 별도 필수 그림 없음 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_순천여고_2학기_중간_고2_미적분I_유사.js/q15 | 해설 | EXEMPT — 미지 연속함수의 미분성; 해설이 식/논증으로 완결되며 고유 도형 불필요 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_순천여고_2학기_중간_고2_미적분I_유사.js/q16 | 문제 | EXEMPT — 삼차곡선·접선의 중근; 발문에 별도 필수 그림 없음 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_순천여고_2학기_중간_고2_미적분I_유사.js/q16 | 해설 | 차함수 (x+2)^2(x-3)의 접촉 중근과 단순 교점 표시 | polynomial-spike-v1 | [q16-solution.plan.json](./q16-solution.plan.json) | shallow PASS · full PASS | 유사 JS 문장·해설의 점/곡선/선분 정적 대조; STATIC_SPEC_CHECK · RENDER_NOT_RUN |
| 26_순천여고_2학기_중간_고2_미적분I_유사.js/q17 | 문제 | EXEMPT — 두 접선 교점; 발문에 별도 필수 그림 없음 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_순천여고_2학기_중간_고2_미적분I_유사.js/q17 | 해설 | 두 접점 A,B와 접선 두 개, 공통교점 T(3,-15) 표시 | polynomial-spike-v1 | [q17-solution.plan.json](./q17-solution.plan.json) | shallow PASS · full PASS | 유사 JS 문장·해설의 점/곡선/선분 정적 대조; STATIC_SPEC_CHECK · RENDER_NOT_RUN |
| 26_순천여고_2학기_중간_고2_미적분I_유사.js/q18 | 문제 | EXEMPT — 함수방정식 도함수; 발문에 별도 필수 그림 없음 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_순천여고_2학기_중간_고2_미적분I_유사.js/q18 | 해설 | EXEMPT — 함수방정식 도함수; 해설이 식/논증으로 완결되며 고유 도형 불필요 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_순천여고_2학기_중간_고2_미적분I_유사.js/q19 | 문제 | EXEMPT — 사차함수와 연속성; 발문에 별도 필수 그림 없음 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_순천여고_2학기_중간_고2_미적분I_유사.js/q19 | 해설 | EXEMPT — 사차함수와 연속성; 해설이 식/논증으로 완결되며 고유 도형 불필요 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_순천여고_2학기_중간_고2_미적분I_유사.js/q20 | 문제 | 두 포물선 조각의 극점과 x=0 접합을 표현 | piecewise-polynomial-spike-v1 | [q20-problem.plan.json](./q20-problem.plan.json) | shallow PASS · full PASS | PNG 개형을 기준으로 함숫값·꼭짓점은 유사 JS 수치 적용; STATIC_SPEC_CHECK · RENDER_NOT_RUN |
| 26_순천여고_2학기_중간_고2_미적분I_유사.js/q20 | 해설 | ENGINE_CAPABILITY_PENDING — 정수 k에 따른 g(x) 부호반전 및 h(t)의 가변 수평선 교점 개수를 정밀 재계산할 매개변수 패널 필요 | ENGINE_CAPABILITY_PENDING: SYMBOLIC_K_SIGN_FLIP_AND_INTERSECTION_COUNT | 미생성(허위 그림 금지) | 제약 판정 / plan 없음 | 도형 생성 불가 · RENDER_NOT_RUN |
| 26_순천여고_2학기_중간_고2_미적분I_유사.js/q21 | 문제 | EXEMPT — 중간값정리; 발문에 별도 필수 그림 없음 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_순천여고_2학기_중간_고2_미적분I_유사.js/q21 | 해설 | EXEMPT — 중간값정리; 해설이 식/논증으로 완결되며 고유 도형 불필요 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_순천여고_2학기_중간_고2_미적분I_유사.js/q22 | 문제 | 해안선 x³와 직선 다리·A,B 이름 보존 | piecewise-polynomial-spike-v1 | [q22-problem.plan.json](./q22-problem.plan.json) | shallow PASS · full PASS | 원본 해안선·직선·A/B 표식과 구조 대조; STATIC_SPEC_CHECK · RENDER_NOT_RUN |
| 26_순천여고_2학기_중간_고2_미적분I_유사.js/q22 | 해설 | 선분 AB와 길이 3√10의 지시 라벨 보완 | piecewise-polynomial-spike-v1 | [q22-solution.plan.json](./q22-solution.plan.json) | shallow PASS · full PASS | 원본 해안선·직선·A/B 표식과 구조 대조; STATIC_SPEC_CHECK · RENDER_NOT_RUN |
| 26_순천여고_2학기_중간_고2_미적분I_유사.js/q23 | 문제 | 불필요한 면색 제거, 두 기울기 사례·정사각형 경계 보완 | construction-spike-v1 | [q23-problem.plan.json](./q23-problem.plan.json) | shallow PASS · full PASS | 원본 두 기울기 예시·정사각형 변/라벨 보존; STATIC_SPEC_CHECK · RENDER_NOT_RUN |
| 26_순천여고_2학기_중간_고2_미적분I_유사.js/q23 | 해설 | t가 작은/큰 경우 양 경계선과 점 A 쪽 영역을 표시 | construction-spike-v1 | [q23-solution.plan.json](./q23-solution.plan.json) | shallow PASS · full PASS | 원본 두 기울기 예시·정사각형 변/라벨 보존; STATIC_SPEC_CHECK · RENDER_NOT_RUN |
