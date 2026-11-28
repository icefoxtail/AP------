# DRAWN_FEATURE_PARITY — 2026 제일고 고2 미적분Ⅰ 유사

- 범위: archive/exams/similar/high/h2/2mid/26_제일고_2학기_중간_고2_미적분I_유사.js (22문항, 44축).
- 대조: 유사 JS 전체 문항·해설·이미지 참조 및 archive/assets/images/26_제일고_2학기_중간_고2_미적분I/qNN.png 원본 PNG를 육안 검토했다. 기존 원본 해설 SVG는 태그/점·선·면 구조를 검사했다.
- 검증: production plan 11개 각각 shallow/full plan-lint 통과. 이는 구조·엔진 계약 PASS이며 화면 렌더를 통과했다는 뜻이 아니다.
- RENDER_NOT_RUN: /usr/bin/chromium 래퍼가 /usr/lib/chromium/chromium 실행 파일 누락으로 종료(127). 실제 렌더/픽셀 관측 미실행. 본 문서의 패리티는 원문·PNG 대비 정적 요소/값 대조다.
- 엔진 공통 ENGINE_CAPABILITY_PENDING: TRANSPARENT_BACKGROUND_OPTOUT. 현행 엔진은 흰 배경 rect를 자동 출력하며 plan에서 제거하는 옵션이 없다. 본 작업은 plan 자체에 불필요한 전면 fill을 선언하지 않는다. 다만 제일고 19번은 원문·원본의 삼각형 넓이 강조를 위해 LIGHT 두 면만 유지한다.
- 원본 이미지와 유사 JS 수치/상태가 다르면 정본인 해당 유사 JS를 우선했다. 눈대중으로 원본 이미지와 픽셀 1:1 동일하다고 보고하지 않는다.

| 파일/qid | 축 | 기존결함/판정 | capability | plan경로 | plan-lint | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|---|
| 26_제일고_2학기_중간_고2_미적분I_유사.js/q01 | 문제 | 기존 단일 선분을 V자 꺾임·점프·열린점과 JS 극한값으로 교정 | piecewise-discontinuous-spike-v1 | [q01-problem.plan.json](./q01-problem.plan.json) | shallow PASS · full PASS | PNG V자 구조를 보존하되 높이/함숫값은 유사 JS의 극한값 우선; STATIC_SPEC_CHECK · RENDER_NOT_RUN |
| 26_제일고_2학기_중간_고2_미적분I_유사.js/q01 | 해설 | x=-2 우극한, x=0 좌극한, x=1 함수값의 열린/닫힌 끝 구별 | piecewise-discontinuous-spike-v1 | [q01-solution.plan.json](./q01-solution.plan.json) | shallow PASS · full PASS | PNG V자 구조를 보존하되 높이/함숫값은 유사 JS의 극한값 우선; STATIC_SPEC_CHECK · RENDER_NOT_RUN |
| 26_제일고_2학기_중간_고2_미적분I_유사.js/q02 | 문제 | EXEMPT — 미분계수 대입; 발문에 별도 필수 그림 없음 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_제일고_2학기_중간_고2_미적분I_유사.js/q02 | 해설 | EXEMPT — 미분계수 대입; 해설이 식/논증으로 완결되며 고유 도형 불필요 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_제일고_2학기_중간_고2_미적분I_유사.js/q03 | 문제 | EXEMPT — 평균변화율; 발문에 별도 필수 그림 없음 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_제일고_2학기_중간_고2_미적분I_유사.js/q03 | 해설 | 할선의 두 점 (1,4),(4,-11)과 기울기 -5를 명시 | polynomial-spike-v1 | [q03-solution.plan.json](./q03-solution.plan.json) | shallow PASS · full PASS | 유사 JS 문장·해설의 점/곡선/선분 정적 대조; STATIC_SPEC_CHECK · RENDER_NOT_RUN |
| 26_제일고_2학기_중간_고2_미적분I_유사.js/q04 | 문제 | EXEMPT — 끼임극한; 발문에 별도 필수 그림 없음 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_제일고_2학기_중간_고2_미적분I_유사.js/q04 | 해설 | EXEMPT — 끼임극한; 해설이 식/논증으로 완결되며 고유 도형 불필요 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_제일고_2학기_중간_고2_미적분I_유사.js/q05 | 문제 | EXEMPT — 무한대 극한; 발문에 별도 필수 그림 없음 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_제일고_2학기_중간_고2_미적분I_유사.js/q05 | 해설 | EXEMPT — 무한대 극한; 해설이 식/논증으로 완결되며 고유 도형 불필요 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_제일고_2학기_중간_고2_미적분I_유사.js/q06 | 문제 | EXEMPT — 함수 연속조건; 발문에 별도 필수 그림 없음 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_제일고_2학기_중간_고2_미적분I_유사.js/q06 | 해설 | EXEMPT — 함수 연속조건; 해설이 식/논증으로 완결되며 고유 도형 불필요 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_제일고_2학기_중간_고2_미적분I_유사.js/q07 | 문제 | EXEMPT — 극한값 진위; 발문에 별도 필수 그림 없음 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_제일고_2학기_중간_고2_미적분I_유사.js/q07 | 해설 | EXEMPT — 극한값 진위; 해설이 식/논증으로 완결되며 고유 도형 불필요 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_제일고_2학기_중간_고2_미적분I_유사.js/q08 | 문제 | EXEMPT — 무리함수 중간값; 발문에 별도 필수 그림 없음 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_제일고_2학기_중간_고2_미적분I_유사.js/q08 | 해설 | EXEMPT — 무리함수 중간값; 해설이 식/논증으로 완결되며 고유 도형 불필요 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_제일고_2학기_중간_고2_미적분I_유사.js/q09 | 문제 | 포물선/직선, a·b 라벨, 축까지 내린 점선 가이드 추가 | multi-curve-figure-v1 | [q09-problem.plan.json](./q09-problem.plan.json) | shallow PASS · full PASS | PNG의 y=x·f(x)·a,b 및 점선 보조선과 구조 대조; STATIC_SPEC_CHECK · RENDER_NOT_RUN |
| 26_제일고_2학기_중간_고2_미적분I_유사.js/q09 | 해설 | f(a)<a, f(b)=b를 점선과 함수값으로 구분 | multi-curve-figure-v1 | [q09-solution.plan.json](./q09-solution.plan.json) | shallow PASS · full PASS | PNG의 y=x·f(x)·a,b 및 점선 보조선과 구조 대조; STATIC_SPEC_CHECK · RENDER_NOT_RUN |
| 26_제일고_2학기_중간_고2_미적분I_유사.js/q10 | 문제 | EXEMPT — 구간 이차함수 극값; 발문에 별도 필수 그림 없음 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_제일고_2학기_중간_고2_미적분I_유사.js/q10 | 해설 | 이차 꼭짓점 (2,9)와 두 영점 표시 | polynomial-spike-v1 | [q10-solution.plan.json](./q10-solution.plan.json) | shallow PASS · full PASS | 유사 JS 문장·해설의 점/곡선/선분 정적 대조; STATIC_SPEC_CHECK · RENDER_NOT_RUN |
| 26_제일고_2학기_중간_고2_미적분I_유사.js/q11 | 문제 | EXEMPT — 삼차함수 평행접선; 발문에 별도 필수 그림 없음 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_제일고_2학기_중간_고2_미적분I_유사.js/q11 | 해설 | 삼차함수에 접하는 두 평행선 y=2x, y=2x+4 강조 | polynomial-spike-v1 | [q11-solution.plan.json](./q11-solution.plan.json) | shallow PASS · full PASS | 유사 JS 문장·해설의 점/곡선/선분 정적 대조; STATIC_SPEC_CHECK · RENDER_NOT_RUN |
| 26_제일고_2학기_중간_고2_미적분I_유사.js/q12 | 문제 | EXEMPT — 절댓값 첨점; 발문에 별도 필수 그림 없음 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_제일고_2학기_중간_고2_미적분I_유사.js/q12 | 해설 | x=0에서 y=\|x\|의 첨점과 좌우 기울기 표시 | absolute-value-spike-v1 | [q12-solution.plan.json](./q12-solution.plan.json) | shallow PASS · full PASS | 유사 JS 문장·해설의 점/곡선/선분 정적 대조; STATIC_SPEC_CHECK · RENDER_NOT_RUN |
| 26_제일고_2학기_중간_고2_미적분I_유사.js/q13 | 문제 | EXEMPT — 다항 미분 관계; 발문에 별도 필수 그림 없음 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_제일고_2학기_중간_고2_미적분I_유사.js/q13 | 해설 | EXEMPT — 다항 미분 관계; 해설이 식/논증으로 완결되며 고유 도형 불필요 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_제일고_2학기_중간_고2_미적분I_유사.js/q14 | 문제 | EXEMPT — 함수방정식; 발문에 별도 필수 그림 없음 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_제일고_2학기_중간_고2_미적분I_유사.js/q14 | 해설 | EXEMPT — 함수방정식; 해설이 식/논증으로 완결되며 고유 도형 불필요 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_제일고_2학기_중간_고2_미적분I_유사.js/q15 | 문제 | EXEMPT — 나머지정리; 발문에 별도 필수 그림 없음 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_제일고_2학기_중간_고2_미적분I_유사.js/q15 | 해설 | EXEMPT — 나머지정리; 해설이 식/논증으로 완결되며 고유 도형 불필요 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_제일고_2학기_중간_고2_미적분I_유사.js/q16 | 문제 | EXEMPT — 조각함수 교점 개수; 발문에 별도 필수 그림 없음 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_제일고_2학기_중간_고2_미적분I_유사.js/q16 | 해설 | 조각 그래프의 x=-2 접합·꼭짓점 (-3,7) 추가 | piecewise-polynomial-spike-v1 | [q16-solution.plan.json](./q16-solution.plan.json) | shallow PASS · full PASS | 유사 JS 문장·해설의 점/곡선/선분 정적 대조; STATIC_SPEC_CHECK · RENDER_NOT_RUN |
| 26_제일고_2학기_중간_고2_미적분I_유사.js/q17 | 문제 | EXEMPT — 매개변수 삼차함수; 발문에 별도 필수 그림 없음 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_제일고_2학기_중간_고2_미적분I_유사.js/q17 | 해설 | EXEMPT — 매개변수 삼차함수; 해설이 식/논증으로 완결되며 고유 도형 불필요 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_제일고_2학기_중간_고2_미적분I_유사.js/q18 | 문제 | EXEMPT — 조각함수 미분조건; 발문에 별도 필수 그림 없음 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_제일고_2학기_중간_고2_미적분I_유사.js/q18 | 해설 | EXEMPT — 조각함수 미분조건; 해설이 식/논증으로 완결되며 고유 도형 불필요 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_제일고_2학기_중간_고2_미적분I_유사.js/q19 | 문제 | P₁,P₂,Q₁,Q₂ 라벨·두 수선/직각표식·필수 넓이 면 채움 | piecewise-polynomial-spike-v1 | [q19-problem.plan.json](./q19-problem.plan.json) | shallow PASS · full PASS | PNG y=x²-2와 유사 JS y=x²-3 값 차이; 두 수선·직각·영역 구조 대조; STATIC_SPEC_CHECK · RENDER_NOT_RUN |
| 26_제일고_2학기_중간_고2_미적분I_유사.js/q19 | 해설 | 두 직각표식과 수선·넓이 두 영역을 1:1 구조로 보존 | piecewise-polynomial-spike-v1 | [q19-solution.plan.json](./q19-solution.plan.json) | shallow PASS · full PASS | PNG y=x²-2와 유사 JS y=x²-3 값 차이; 두 수선·직각·영역 구조 대조; STATIC_SPEC_CHECK · RENDER_NOT_RUN |
| 26_제일고_2학기_중간_고2_미적분I_유사.js/q20 | 문제 | EXEMPT — 미분 정의 전개; 발문에 별도 필수 그림 없음 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_제일고_2학기_중간_고2_미적분I_유사.js/q20 | 해설 | EXEMPT — 미분 정의 전개; 해설이 식/논증으로 완결되며 고유 도형 불필요 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_제일고_2학기_중간_고2_미적분I_유사.js/q21 | 문제 | EXEMPT — 판별식과 유리함수 연속; 발문에 별도 필수 그림 없음 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_제일고_2학기_중간_고2_미적분I_유사.js/q21 | 해설 | EXEMPT — 판별식과 유리함수 연속; 해설이 식/논증으로 완결되며 고유 도형 불필요 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_제일고_2학기_중간_고2_미적분I_유사.js/q22 | 문제 | EXEMPT — 삼차함수 계수와 극한; 발문에 별도 필수 그림 없음 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
| 26_제일고_2학기_중간_고2_미적분I_유사.js/q22 | 해설 | EXEMPT — 삼차함수 계수와 극한; 해설이 식/논증으로 완결되며 고유 도형 불필요 | EXEMPT | — | 해당 없음 | 그려야 할 도형 없음(N/A) |
