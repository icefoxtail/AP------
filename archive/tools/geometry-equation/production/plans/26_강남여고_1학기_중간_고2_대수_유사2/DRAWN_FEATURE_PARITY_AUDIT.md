# 강남여고 1학기 중간 고2 대수 유사2 — SVG 전수검수

원문: `archive/exams/similar/high/h2/1mid/26_강남여고_1학기_중간_고2_대수_유사2.js` (25문항 × 2축 = 50축).
원본 기출 비교: `archive/assets/images/26_강남여고_1학기_중간_고2_대수/q19.png`에는 O,A,B,P,Q와 두 반지름, 안팎 호 및 회색 부채꼴 띠가 있다. 생산 q19 두 플랜은 이들 요소를 1:1 대응하고 θ와 r/2 라벨을 보완했다. 띠의 연한 채움은 면적 문항에 필요한 표시다. 기존 SVG의 흰 캔버스 `<rect fill="#fff">`는 배경으로서 도형 면 채움 결함과 구별한다.
22개 production plan의 shallow와 full `plan-lint`는 모두 22 OK, 0 FAIL. 그러나 실제 `render-plan.mjs`가 브라우저 시작 단계에서 `socket() failed: Operation not permitted (1)`로 실패하므로 아래의 DRAWN_FEATURE_PARITY는 PASS가 아닌 NOT_RUN이다.

| 파일/qid | 축 | 기존결함/판정 | capability | plan경로 | plan-lint shallow/full | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|---|
| 26_강남여고_1학기_중간_고2_대수_유사2.js/q01 | 문제 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_강남여고_1학기_중간_고2_대수_유사2.js/q01 | 해설 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_강남여고_1학기_중간_고2_대수_유사2.js/q02 | 문제 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_강남여고_1학기_중간_고2_대수_유사2.js/q02 | 해설 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_강남여고_1학기_중간_고2_대수_유사2.js/q03 | 문제 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_강남여고_1학기_중간_고2_대수_유사2.js/q03 | 해설 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_강남여고_1학기_중간_고2_대수_유사2.js/q04 | 문제 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_강남여고_1학기_중간_고2_대수_유사2.js/q04 | 해설 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_강남여고_1학기_중간_고2_대수_유사2.js/q05 | 문제 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_강남여고_1학기_중간_고2_대수_유사2.js/q05 | 해설 | P(3,-4), 동경·점선 수선·직각·3·4·5 라벨 | construction-spike-v1 | archive/tools/geometry-equation/production/plans/26_강남여고_1학기_중간_고2_대수_유사2/q05-solution.plan.json | OK/OK | NOT_RUN |
| 26_강남여고_1학기_중간_고2_대수_유사2.js/q06 | 문제 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_강남여고_1학기_중간_고2_대수_유사2.js/q06 | 해설 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_강남여고_1학기_중간_고2_대수_유사2.js/q07 | 문제 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_강남여고_1학기_중간_고2_대수_유사2.js/q07 | 해설 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_강남여고_1학기_중간_고2_대수_유사2.js/q08 | 문제 | ENGINE_CAPABILITY_PENDING: 미지수 m의 지수함수 계수와 두 수평선 사이 정확한 곡선형 면적 띠를 답 노출 없이 구성할 파라미터/영역 엔진 | ENGINE_CAPABILITY_PENDING | — | N/A | PENDING |
| 26_강남여고_1학기_중간_고2_대수_유사2.js/q08 | 해설 | 2개 지수곡선·y=1,9 점선·수평거리3. ENGINE_CAPABILITY_PENDING: 정확한 곡선형 띠 면적 경계 | multi-curve-figure-v1 | archive/tools/geometry-equation/production/plans/26_강남여고_1학기_중간_고2_대수_유사2/q08-solution.plan.json | OK/OK | NOT_RUN |
| 26_강남여고_1학기_중간_고2_대수_유사2.js/q09 | 문제 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_강남여고_1학기_중간_고2_대수_유사2.js/q09 | 해설 | x=3 점근선·(7,5) 좌표·수선 | logarithmic-affine-spike-v1 | archive/tools/geometry-equation/production/plans/26_강남여고_1학기_중간_고2_대수_유사2/q09-solution.plan.json | OK/OK | NOT_RUN |
| 26_강남여고_1학기_중간_고2_대수_유사2.js/q10 | 문제 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_강남여고_1학기_중간_고2_대수_유사2.js/q10 | 해설 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_강남여고_1학기_중간_고2_대수_유사2.js/q11 | 문제 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_강남여고_1학기_중간_고2_대수_유사2.js/q11 | 해설 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_강남여고_1학기_중간_고2_대수_유사2.js/q12 | 문제 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_강남여고_1학기_중간_고2_대수_유사2.js/q12 | 해설 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_강남여고_1학기_중간_고2_대수_유사2.js/q13 | 문제 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_강남여고_1학기_중간_고2_대수_유사2.js/q13 | 해설 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_강남여고_1학기_중간_고2_대수_유사2.js/q14 | 문제 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_강남여고_1학기_중간_고2_대수_유사2.js/q14 | 해설 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_강남여고_1학기_중간_고2_대수_유사2.js/q15 | 문제 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_강남여고_1학기_중간_고2_대수_유사2.js/q15 | 해설 | tan(2x), 주기 π/2, 수직점근선 | trigonometric-spike-v1 | archive/tools/geometry-equation/production/plans/26_강남여고_1학기_중간_고2_대수_유사2/q15-solution.plan.json | OK/OK | NOT_RUN |
| 26_강남여고_1학기_중간_고2_대수_유사2.js/q16 | 문제 | 경계 4개·면적 음영, 문제의 정수점 답 누설 없음 | multi-curve-figure-v1 | archive/tools/geometry-equation/production/plans/26_강남여고_1학기_중간_고2_대수_유사2/q16-problem.plan.json | OK/OK | NOT_RUN |
| 26_강남여고_1학기_중간_고2_대수_유사2.js/q16 | 해설 | 정수 좌표점 11개를 x=1,2,3 열에 1·3·7개 | multi-curve-figure-v1 | archive/tools/geometry-equation/production/plans/26_강남여고_1학기_중간_고2_대수_유사2/q16-solution.plan.json | OK/OK | NOT_RUN |
| 26_강남여고_1학기_중간_고2_대수_유사2.js/q17 | 문제 | ENGINE_CAPABILITY_PENDING: 기호 a²로 표시한 점 B,C·수선·사다리꼴을 정확히 유지하는 변수 좌표 도형 엔진 | ENGINE_CAPABILITY_PENDING | — | N/A | PENDING |
| 26_강남여고_1학기_중간_고2_대수_유사2.js/q17 | 해설 | A,B,C,D 사다리꼴·수선. ENGINE_CAPABILITY_PENDING: 비동일 배율의 직각표식 | logarithmic-affine-spike-v1 | archive/tools/geometry-equation/production/plans/26_강남여고_1학기_중간_고2_대수_유사2/q17-solution.plan.json | OK/OK | NOT_RUN |
| 26_강남여고_1학기_중간_고2_대수_유사2.js/q18 | 문제 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_강남여고_1학기_중간_고2_대수_유사2.js/q18 | 해설 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_강남여고_1학기_중간_고2_대수_유사2.js/q19 | 문제 | 원본 q19.png의 O,A,B,P,Q, 동심호·띠와 채움; 누락 θ·r/2 라벨 보완 | construction-spike-v1 | archive/tools/geometry-equation/production/plans/26_강남여고_1학기_중간_고2_대수_유사2/q19-problem.plan.json | OK/OK | NOT_RUN |
| 26_강남여고_1학기_중간_고2_대수_유사2.js/q19 | 해설 | 호·경계선·θ, r/2 길이·둘레·면적 해설, 불필요한 채움 배제 | construction-spike-v1 | archive/tools/geometry-equation/production/plans/26_강남여고_1학기_중간_고2_대수_유사2/q19-solution.plan.json | OK/OK | NOT_RUN |
| 26_강남여고_1학기_중간_고2_대수_유사2.js/q20 | 문제 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_강남여고_1학기_중간_고2_대수_유사2.js/q20 | 해설 | 둔각 θ, 제2사분면 3:4:5 직각삼각형·보조점선 | construction-spike-v1 | archive/tools/geometry-equation/production/plans/26_강남여고_1학기_중간_고2_대수_유사2/q20-solution.plan.json | OK/OK | NOT_RUN |
| 26_강남여고_1학기_중간_고2_대수_유사2.js/q21 | 문제 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_강남여고_1학기_중간_고2_대수_유사2.js/q21 | 해설 | cos2x와 y=1, -1/2 교점 2+4개 | trigonometric-spike-v1 | archive/tools/geometry-equation/production/plans/26_강남여고_1학기_중간_고2_대수_유사2/q21-solution.plan.json | OK/OK | NOT_RUN |
| 26_강남여고_1학기_중간_고2_대수_유사2.js/q22 | 문제 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_강남여고_1학기_중간_고2_대수_유사2.js/q22 | 해설 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_강남여고_1학기_중간_고2_대수_유사2.js/q23 | 문제 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_강남여고_1학기_중간_고2_대수_유사2.js/q23 | 해설 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_강남여고_1학기_중간_고2_대수_유사2.js/q24 | 문제 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_강남여고_1학기_중간_고2_대수_유사2.js/q24 | 해설 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_강남여고_1학기_중간_고2_대수_유사2.js/q25 | 문제 | EXEMPT — 해당 축은 수식·서술형으로, 현재 연결 SVG가 없고 필수 도판 특징도 없음 | NOT_REQUIRED | — | N/A | N/A |
| 26_강남여고_1학기_중간_고2_대수_유사2.js/q25 | 해설 | x/π 수직선의 두 열린 구간과 제외된 1/2 | number-line-figure-v1 | archive/tools/geometry-equation/production/plans/26_강남여고_1학기_중간_고2_대수_유사2/q25-solution.plan.json | OK/OK | NOT_RUN |

실행 가능 생산 플랜 12축, 엔진 기능 대기 2축, SVG 불필요 36축, 합계 50/50축.

운영 병합 게이트: 브라우저 검증이 가능한 환경에서 실제 렌더된 점·지시선·보조선·점선·각·직각·길이·라벨과 원본 이미지 1:1 독립 관측이 PASS할 때까지 main 병합 금지. SVG/시험지 JS/엔진은 이 변경에서 수정하지 않았다.
