# 금당고 1학기 중간 고2 대수 유사 — SVG 전수검수

원문: `archive/exams/similar/high/h2/1mid/26_금당고_1학기_중간_고2_대수_유사.js` (21문항 × 2축 = 42축).
원본 기출 비교: `archive/assets/images/26_금당고_1학기_중간_고2_대수/q08.png`에는 축, 지수곡선, 두 점의 높이·x좌표에 대한 수평·수직 보조점선이 있다. 기존 연결 자산 `archive/assets/images/26_금당고_1학기_중간_고2_대수_유사/q08-audit-rework.svg`는 엔진 출력이 아닌 자유형 polyline이며 무관한 `20` y라벨이 남아 있었다. 새 공식 엔진 plan은 q08 문제축에서 미지수 a,b를 글자 눈금으로, 해설축에서만 a=3,b=5를 숫자로 표시한다. 원본 수치(32·4)와 유사문항 수치(9·5)는 문제 변경에 따른 정당한 차이이다.
22개 production plan의 shallow와 full `plan-lint`는 모두 22 OK, 0 FAIL. 하지만 실제 `render-plan.mjs` 측정 단계에서 브라우저 시작이 `socket() failed: Operation not permitted (1)`로 실패하므로 아래 DRAWN_FEATURE_PARITY는 NOT_RUN으로 보류한다.

| 파일/qid | 축 | 기존결함/판정 | capability | plan경로 | plan-lint shallow/full | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|---|
| 26_금당고_1학기_중간_고2_대수_유사.js/q01 | 문제 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_금당고_1학기_중간_고2_대수_유사.js/q01 | 해설 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_금당고_1학기_중간_고2_대수_유사.js/q02 | 문제 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_금당고_1학기_중간_고2_대수_유사.js/q02 | 해설 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_금당고_1학기_중간_고2_대수_유사.js/q03 | 문제 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_금당고_1학기_중간_고2_대수_유사.js/q03 | 해설 | 기존 엔진 역함수 지수·로그 도식 보전 | exp-log-pair-spike-v1 | archive/tools/geometry-equation/production/plans/26_금당고_1학기_중간_고2_대수_유사/q03-solution.plan.json | OK/OK | NOT_RUN |
| 26_금당고_1학기_중간_고2_대수_유사.js/q04 | 문제 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_금당고_1학기_중간_고2_대수_유사.js/q04 | 해설 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_금당고_1학기_중간_고2_대수_유사.js/q05 | 문제 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_금당고_1학기_중간_고2_대수_유사.js/q05 | 해설 | 기존 cos3x+4 도식·최댓값5/최솟값3 가로 점선 보전 | trigonometric-spike-v1 | archive/tools/geometry-equation/production/plans/26_금당고_1학기_중간_고2_대수_유사/q05-solution.plan.json | OK/OK | NOT_RUN |
| 26_금당고_1학기_중간_고2_대수_유사.js/q06 | 문제 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_금당고_1학기_중간_고2_대수_유사.js/q06 | 해설 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_금당고_1학기_중간_고2_대수_유사.js/q07 | 문제 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_금당고_1학기_중간_고2_대수_유사.js/q07 | 해설 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_금당고_1학기_중간_고2_대수_유사.js/q08 | 문제 | 손제작 q08-audit-rework.svg의 불필요한 20 눈금 제거; 원본 q08.png의 2점·수선·축 보전, a·b 문자 눈금 | exponential-affine-spike-v1 | archive/tools/geometry-equation/production/plans/26_금당고_1학기_중간_고2_대수_유사/q08-problem.plan.json | OK/OK | NOT_RUN |
| 26_금당고_1학기_중간_고2_대수_유사.js/q08 | 해설 | P(3,9),Q(2,5)·x=2,3/y=5,9 눈금과 두 점선 수선 | exponential-affine-spike-v1 | archive/tools/geometry-equation/production/plans/26_금당고_1학기_중간_고2_대수_유사/q08-solution.plan.json | OK/OK | NOT_RUN |
| 26_금당고_1학기_중간_고2_대수_유사.js/q09 | 문제 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_금당고_1학기_중간_고2_대수_유사.js/q09 | 해설 | 과거 미지원: 멀리 있는 점 (30,0), x=3 점근선·로그곡선 | multi-curve-figure-v1 | archive/tools/geometry-equation/production/plans/26_금당고_1학기_중간_고2_대수_유사/q09-solution.plan.json | OK/OK | NOT_RUN |
| 26_금당고_1학기_중간_고2_대수_유사.js/q10 | 문제 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_금당고_1학기_중간_고2_대수_유사.js/q10 | 해설 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_금당고_1학기_중간_고2_대수_유사.js/q11 | 문제 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_금당고_1학기_중간_고2_대수_유사.js/q11 | 해설 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_금당고_1학기_중간_고2_대수_유사.js/q12 | 문제 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_금당고_1학기_중간_고2_대수_유사.js/q12 | 해설 | 과거 미지원: S=r(14-r), 0<r<14, 꼭짓점 (7,49) | polynomial-spike-v1 | archive/tools/geometry-equation/production/plans/26_금당고_1학기_중간_고2_대수_유사/q12-solution.plan.json | OK/OK | NOT_RUN |
| 26_금당고_1학기_중간_고2_대수_유사.js/q13 | 문제 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_금당고_1학기_중간_고2_대수_유사.js/q13 | 해설 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_금당고_1학기_중간_고2_대수_유사.js/q14 | 문제 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_금당고_1학기_중간_고2_대수_유사.js/q14 | 해설 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_금당고_1학기_중간_고2_대수_유사.js/q15 | 문제 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_금당고_1학기_중간_고2_대수_유사.js/q15 | 해설 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_금당고_1학기_중간_고2_대수_유사.js/q16 | 문제 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_금당고_1학기_중간_고2_대수_유사.js/q16 | 해설 | 기존 엔진 y=x² 곡선·P(√2,2)·OP 동경 보전 | polynomial-spike-v1 | archive/tools/geometry-equation/production/plans/26_금당고_1학기_중간_고2_대수_유사/q16-solution.plan.json | OK/OK | NOT_RUN |
| 26_금당고_1학기_중간_고2_대수_유사.js/q17 | 문제 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_금당고_1학기_중간_고2_대수_유사.js/q17 | 해설 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_금당고_1학기_중간_고2_대수_유사.js/q18 | 문제 | ENGINE_CAPABILITY_PENDING: 아직 미정인 a,b,c 및 모든 실수 t의 좌우 등거리 조건을 상징적으로 구속하는 매개변수 쌍로그 그래프 | ENGINE_CAPABILITY_PENDING | — | N/A | PENDING |
| 26_금당고_1학기_중간_고2_대수_유사.js/q18 | 해설 | 과거 미지원: 대칭 로그 두 곡선과 x=-2 점근선·t=0 수평선·P,Q,R, PR=QR | multi-curve-figure-v1 | archive/tools/geometry-equation/production/plans/26_금당고_1학기_중간_고2_대수_유사/q18-solution.plan.json | OK/OK | NOT_RUN |
| 26_금당고_1학기_중간_고2_대수_유사.js/q19 | 문제 | ENGINE_CAPABILITY_PENDING: 미지수 a,k를 갖는 중첩절댓값 지수함수와 y=64의 3교점을 정확히 그리는 엔진 | ENGINE_CAPABILITY_PENDING | — | N/A | PENDING |
| 26_금당고_1학기_중간_고2_대수_유사.js/q19 | 해설 | 가능한 k=-8,-2,4의 정확한 수직선. ENGINE_CAPABILITY_PENDING: g(x)=a^{||x-k|-3|}와 y=64의 3교점 곡선 | number-line-figure-v1 | archive/tools/geometry-equation/production/plans/26_금당고_1학기_중간_고2_대수_유사/q19-solution.plan.json | OK/OK | NOT_RUN |
| 26_금당고_1학기_중간_고2_대수_유사.js/q20 | 문제 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_금당고_1학기_중간_고2_대수_유사.js/q20 | 해설 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_금당고_1학기_중간_고2_대수_유사.js/q21 | 문제 | ENGINE_CAPABILITY_PENDING: 아직 미정인 k로 두 지수곡선과 두 실수 t를 표시하는 매개변수 계수·초월수 수선 엔진 | ENGINE_CAPABILITY_PENDING | — | N/A | PENDING |
| 26_금당고_1학기_중간_고2_대수_유사.js/q21 | 해설 | 2개의 실제 지수곡선·x=-3 수선·A,B·길이5/32. ENGINE_CAPABILITY_PENDING: 두 번째 x=log₂(3/8) 수선·표식 | multi-curve-figure-v1 | archive/tools/geometry-equation/production/plans/26_금당고_1학기_중간_고2_대수_유사/q21-solution.plan.json | OK/OK | NOT_RUN |

실행 가능 생산 플랜 10축, 엔진 기능 대기 3축, SVG 불필요 29축, 합계 42/42축.

운영 병합 게이트: 브라우저 검증이 가능한 환경에서 실제 SVG 렌더와 원본 에셋 대비 점선·수선·라벨·그린 곡선·문제축 답 노출을 모두 1:1 검수하고 PASS해야 한다. 그 전에는 main 병합 불가. 기존 SVG/시험지 JS/엔진은 변경하지 않았다.
