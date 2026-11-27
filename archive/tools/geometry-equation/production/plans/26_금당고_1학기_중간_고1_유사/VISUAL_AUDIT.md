# 금당고 2026년 1학기 중간 고1 유사: SVG 플랜 전수 감사

- 대상: `archive/exams/similar/high/h1/1mid/26_금당고_1학기_중간_고1_유사.js` (20문항 × 발문/해설 = **40축**)
- 운영 플랜: `archive/tools/geometry-equation/production/plans/26_금당고_1학기_중간_고1_유사/`
- 기존 `_plans` 40축 shallow 재검증: **40/40 OK**. 운영 JSON 7개에 대해 shallow/full: **7/7 OK**.
- `DRAWN_FEATURE_PARITY`: **문항 텍스트·원본 기출 에셋·현재 유사 SVG·plan 수학요소 정적 대조**이다. 렌더된 신규 SVG의 화면상 1:1 일치는 Chromium 부재로 `RENDER_NOT_RUN`이며 PASS로 기재하지 않는다.
- 모든 신규 JSON은 직접 SVG 코드를 쓰지 않았고, `plan-lint.cjs` 정식 엔진의 심층 검사에서 통과했다. 면 채움은 원문이 요구하지 않을 경우 선언하지 않거나 `NONE`이다.

## 40축 전수 판정

| 파일/qid | 축 | 기존결함/판정 | capability | plan 경로 | plan-lint shallow/full | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|---|
| 26_금당고_1학기_중간_고1_유사.js / q01 | 발문 | EXEMPT — 다항식 가감; 조건은 텍스트 완결 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_금당고_1학기_중간_고1_유사.js / q01 | 해설 | EXEMPT — 다항식 가감; 별도 그림의 결정적 기여 없음 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_금당고_1학기_중간_고1_유사.js / q02 | 발문 | EXEMPT — 세제곱 차; 조건은 텍스트 완결 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_금당고_1학기_중간_고1_유사.js / q02 | 해설 | EXEMPT — 세제곱 차; 별도 그림의 결정적 기여 없음 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_금당고_1학기_중간_고1_유사.js / q03 | 발문 | EXEMPT — 제곱식 전개·계수; 조건은 텍스트 완결 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_금당고_1학기_중간_고1_유사.js / q03 | 해설 | EXEMPT — 제곱식 전개·계수; 별도 그림의 결정적 기여 없음 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_금당고_1학기_중간_고1_유사.js / q04 | 발문 | EXEMPT — 허근·판별식; 조건은 텍스트 완결 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_금당고_1학기_중간_고1_유사.js / q04 | 해설 | EXEMPT — 허근·판별식; 별도 그림의 결정적 기여 없음 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_금당고_1학기_중간_고1_유사.js / q05 | 발문 | EXEMPT — 근과 계수; 조건은 텍스트 완결 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_금당고_1학기_중간_고1_유사.js / q05 | 해설 | EXEMPT — 근과 계수; 별도 그림의 결정적 기여 없음 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_금당고_1학기_중간_고1_유사.js / q06 | 발문 | EXEMPT — 이차함수 최댓값; 조건은 텍스트 완결 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_금당고_1학기_중간_고1_유사.js / q06 | 해설 | EXEMPT 오판·수직선만 있는 해설 SVG → 포물선 구간과 양 끝점 보완 | `piecewise-polynomial-spike-v1` | [q06-solution.plan.json](q06-solution.plan.json) | OK / OK | STATIC_RELATION_MATCH·RENDER_NOT_RUN |
| 26_금당고_1학기_중간_고1_유사.js / q07 | 발문 | EXEMPT — 항등식 계수; 조건은 텍스트 완결 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_금당고_1학기_중간_고1_유사.js / q07 | 해설 | EXEMPT — 항등식 계수; 별도 그림의 결정적 기여 없음 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_금당고_1학기_중간_고1_유사.js / q08 | 발문 | EXEMPT — 복소수 상등; 조건은 텍스트 완결 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_금당고_1학기_중간_고1_유사.js / q08 | 해설 | EXEMPT — 복소수 상등; 별도 그림의 결정적 기여 없음 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_금당고_1학기_중간_고1_유사.js / q09 | 발문 | EXEMPT — 이차함수 x축 접점; 조건은 텍스트 완결 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_금당고_1학기_중간_고1_유사.js / q09 | 해설 | 기존 접점·축 위치는 정확, 유지 | `polynomial-spike-v1` | [q09-solution.plan.json](q09-solution.plan.json) | OK / OK | STATIC_RELATION_MATCH·RENDER_NOT_RUN |
| 26_금당고_1학기_중간_고1_유사.js / q10 | 발문 | EXEMPT — 근의 세제곱; 조건은 텍스트 완결 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_금당고_1학기_중간_고1_유사.js / q10 | 해설 | EXEMPT — 근의 세제곱; 별도 그림의 결정적 기여 없음 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_금당고_1학기_중간_고1_유사.js / q11 | 발문 | EXEMPT — 삼차식 인수분해; 조건은 텍스트 완결 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_금당고_1학기_중간_고1_유사.js / q11 | 해설 | EXEMPT — 삼차식 인수분해; 별도 그림의 결정적 기여 없음 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_금당고_1학기_중간_고1_유사.js / q12 | 발문 | EXEMPT — 나머지정리; 조건은 텍스트 완결 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_금당고_1학기_중간_고1_유사.js / q12 | 해설 | EXEMPT — 나머지정리; 별도 그림의 결정적 기여 없음 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_금당고_1학기_중간_고1_유사.js / q13 | 발문 | EXEMPT — 매개변수 포물선 공통 접선; 조건은 텍스트 완결 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_금당고_1학기_중간_고1_유사.js / q13 | 해설 | EXEMPT — 매개변수 포물선 공통 접선; 별도 그림의 결정적 기여 없음 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_금당고_1학기_중간_고1_유사.js / q14 | 발문 | 사각형 회색 면 채움 불필요, 직각 표시 4개 모두 누락 → 무채움·3개 보완 | `piecewise-polynomial-spike-v1` | [q14-problem.plan.json](q14-problem.plan.json) | OK / OK | PARTIAL_3_OF_4_RIGHT_ANGLES·ENGINE_CAPABILITY_PENDING·RENDER_NOT_RUN |
| 26_금당고_1학기_중간_고1_유사.js / q14 | 해설 | 면 채움·직각 누락 → fill NONE, 직각 3개 보완 | `polynomial-spike-v1` | [q14-solution.plan.json](q14-solution.plan.json) | OK / OK | PARTIAL_3_OF_4_RIGHT_ANGLES·ENGINE_CAPABILITY_PENDING·RENDER_NOT_RUN |
| 26_금당고_1학기_중간_고1_유사.js / q15 | 발문 | EXEMPT — 복소수 거듭제곱 주기; 조건은 텍스트 완결 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_금당고_1학기_중간_고1_유사.js / q15 | 해설 | EXEMPT — 복소수 거듭제곱 주기; 별도 그림의 결정적 기여 없음 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_금당고_1학기_중간_고1_유사.js / q16 | 발문 | EXEMPT — 두 교점 비율·이차식 최대; 조건은 텍스트 완결 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_금당고_1학기_중간_고1_유사.js / q16 | 해설 | EXEMPT — 두 교점 비율·이차식 최대; 별도 그림의 결정적 기여 없음 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_금당고_1학기_중간_고1_유사.js / q17 | 발문 | EXEMPT — 구간별 함수 교점; 조건은 텍스트 완결 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_금당고_1학기_중간_고1_유사.js / q17 | 해설 | 구간별 두 함수의 핵심 교점 표시 유지 | `piecewise-polynomial-spike-v1` | [q17-solution.plan.json](q17-solution.plan.json) | OK / OK | STATIC_RELATION_MATCH·RENDER_NOT_RUN |
| 26_금당고_1학기_중간_고1_유사.js / q18 | 발문 | 조립제법 HTML 표는 발문에 존재, SVG 불필요 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_금당고_1학기_중간_고1_유사.js / q18 | 해설 | EXEMPT — 조립제법 표; 별도 그림의 결정적 기여 없음 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_금당고_1학기_중간_고1_유사.js / q19 | 발문 | EXEMPT — 외접하는 두 구; 조건은 텍스트 완결 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_금당고_1학기_중간_고1_유사.js / q19 | 해설 | EXEMPT 오판·2D 원만 담긴 해설 → 외접 단면 정밀 작도; 구면 명암은 미지원 | `construction-spike-v1` | [q19-solution.plan.json](q19-solution.plan.json) | OK / OK | SECTION_1_TO_1·SPHERE_3D_PENDING·RENDER_NOT_RUN |
| 26_금당고_1학기_중간_고1_유사.js / q20 | 발문 | EXEMPT — 이동구간 최대·최소 차; 조건은 텍스트 완결 | `EXEMPT` | — (기존 `_plans`의 EXEMPT) | OK / 대상아님 | N/A(도형적 필수 요소 없음) |
| 26_금당고_1학기_중간_고1_유사.js / q20 | 해설 | 해설 SVG에 y=2 누락 → 별도 점선 수평선 추가 | `piecewise-polynomial-spike-v1` | [q20-solution.plan.json](q20-solution.plan.json) | OK / OK | STATIC_RELATION_MATCH·RENDER_NOT_RUN |

## 원문·원본 기출 그림 대비 핵심 요소 1:1 대조

| qid/축 | 원문/기출 에셋의 필수 요소 → 운영 플랜 확인 | 최종 그림 판정 |
|---|---|---|
| q06-solution | `[-1,3]`, A(−1,−9), B(3,39), 꼭짓점 축 x=−2는 구간 밖 | STATIC_RELATION_MATCH·RENDER_NOT_RUN |
| q09-solution | y=2(x+3/4)², 접점 (−3/4,0), x축 | STATIC_RELATION_MATCH·RENDER_NOT_RUN |
| q14-problem | 기출 PNG: 포물선 호+직사각형+밑변+직각 4개; 계획은 폭/높이 6, 무채움, 직각 3개 | PARTIAL_3_OF_4_RIGHT_ANGLES·ENGINE_CAPABILITY_PENDING·RENDER_NOT_RUN |
| q14-solution | 포물선 y=6−2x²/3, 꼭짓점 (0,6), x절편 ±3, t=3/2의 직사각형; 직각 3/4 | PARTIAL_3_OF_4_RIGHT_ANGLES·ENGINE_CAPABILITY_PENDING·RENDER_NOT_RUN |
| q17-solution | a=3 대표값, 서로 다른 교점 x=0,2,3, 경계 x=−3·0·2 | STATIC_RELATION_MATCH·RENDER_NOT_RUN |
| q19-solution | 기출 PNG: 크기가 다른 구 2개 외접; 정확한 단면은 반지름 3·4, 중심거리 7, 접점 T | SECTION_1_TO_1·SPHERE_3D_PENDING·RENDER_NOT_RUN |
| q20-solution | g(t) 네 조각, y=2 교점 0, y=9/4 교점 1, y=3 교점 2, y=12 교점 2 | STATIC_RELATION_MATCH·RENDER_NOT_RUN |

## 남은 엔진 기능과 최종 렌더 상태

- `TRANSPARENT_CANVAS_OPTION`: 새 엔진 출력을 만들 때 루트의 흰색 `<rect fill="#fff">`를 제거하는 **plan-level 투명 배경 옵션**이 없다. 이 기능은 `ENGINE_CAPABILITY_PENDING`; 외부 SVG 파일에서 손으로 요소를 지우지 않는다.
- `OVERLAY_RIGHT_ANGLE_MAX_3`: 포물선+직사각형 overlay 직각 표식은 최대 3개다. 기출의 네 모서리 직각 4개를 전부 그리는 기능을 `ENGINE_CAPABILITY_PENDING`으로 남긴다. 그래프를 평면도형으로 손재현하는 우회는 하지 않는다.
- `EXTERNAL_TANGENCY_3D_SPHERES`: 서로 다른 반지름의 구 두 개를 정확히 외접 배치하고 구면 윤곽·명암을 온전히 표현하는 `solid-figure-v1` 기능이 필요하다. 현재 계획은 수학적으로 정확한 중심 단면으로 보충한다.
- 렌더러의 브라우저 실행파일 `/usr/lib/chromium/chromium`이 없는 환경이라 최종 SVG 합성·배치 검사 및 완전한 DRAWN_FEATURE_PARITY 시각 검증은 수행할 수 없었다. 새 렌더 증거가 없으므로 `RENDER_NOT_RUN`을 유지한다.

## 재현

```bash
node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs --shallow archive/tools/geometry-equation/production/plans/26_금당고_1학기_중간_고1_유사/*.plan.json
node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs archive/tools/geometry-equation/production/plans/26_금당고_1학기_중간_고1_유사/*.plan.json
```
