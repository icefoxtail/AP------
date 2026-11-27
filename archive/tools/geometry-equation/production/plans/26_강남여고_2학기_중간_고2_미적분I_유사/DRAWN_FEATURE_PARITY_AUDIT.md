# 26_강남여고_2학기_중간_고2_미적분I_유사 — DRAWN_FEATURE_PARITY 축별 검수

검수일: 2026-11-27 · 원문: `archive/exams/similar/high/h2/2mid/26_강남여고_2학기_중간_고2_미적분I_유사.js` · 공식 플랜: `archive/tools/geometry-equation/production/plans/26_강남여고_2학기_중간_고2_미적분I_유사/`

- 각 qid의 **문항(problem)**·**해설(solution)** 축을 독립 판정했다. EXEMPT는 해당 축에 별도의 그림을 더해도 풀이 정보가 늘지 않는다는 판단이다.
- 원본 이미지 에셋은 `archive/assets/images/26_강남여고_2학기_중간_고2_미적분I/`의 PNG를 열어 보고, 해당 원문 이미지·수식·해설의 의미 요소(점, 선, 수선, 축값, 곡선, 영역)를 대조했다. 유사 SVG의 수치는 변형 문제에 맞추었다.
- 플랜 행의 **STATIC_SPEC_MATCH**는 소스–계획의 구조·스펙 1:1 점검이다. **실물 픽셀 1:1 PASS가 아니다.** 로컬 Chrome 바이너리가 없어 `RENDER_NOT_RUN`; 렌더 화면의 충돌·가독성은 미확인이다.
- `ellipse-figure-v1`과 `solid-figure-v1` 엔진에 배경 흰색 `<rect fill="#fff">`가 강제되어 투명 배경은 **ENGINE_CAPABILITY_PENDING / TRANSPARENT_BACKGROUND_OPTOUT**이다. 수동 SVG 수정은 하지 않았고, 불필요한 면 채움은 플랜에서 제거했다.

| 파일/qid | 축 | 기존결함/판정 | capability | plan경로 | plan-lint | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|---|
| 26_강남여고_2학기_중간_고2_미적분I_유사.js / q01 | 문항 | EXEMPT: 인수분해 후 약분하는 극한 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_강남여고_2학기_중간_고2_미적분I_유사.js / q01 | 해설 | EXEMPT: 인수분해 후 약분하는 극한 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_강남여고_2학기_중간_고2_미적분I_유사.js / q02 | 문항 | 좌·우 극한의 열린 끝점, 도약값과 -3 눈금 누락 보완 | piecewise-discontinuous-spike-v1 | `archive/tools/geometry-equation/production/plans/26_강남여고_2학기_중간_고2_미적분I_유사/q02-problem.plan.json` | SHALLOW_PASS · FULL_PASS | STATIC_SPEC_MATCH · RENDER_NOT_RUN |
| 26_강남여고_2학기_중간_고2_미적분I_유사.js / q02 | 해설 | EXEMPT: 그림의 일방극한 두 값을 텍스트로 계산 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_강남여고_2학기_중간_고2_미적분I_유사.js / q03 | 문항 | EXEMPT: 다항식의 미분·대입 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_강남여고_2학기_중간_고2_미적분I_유사.js / q03 | 해설 | EXEMPT: 다항식의 미분·대입 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_강남여고_2학기_중간_고2_미적분I_유사.js / q04 | 문항 | EXEMPT: 평균변화율의 단순 계산 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_강남여고_2학기_중간_고2_미적분I_유사.js / q04 | 해설 | EXEMPT: 평균변화율의 단순 계산 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_강남여고_2학기_중간_고2_미적분I_유사.js / q05 | 문항 | EXEMPT: 유리화와 극한 계산 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_강남여고_2학기_중간_고2_미적분I_유사.js / q05 | 해설 | EXEMPT: 유리화와 극한 계산 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_강남여고_2학기_중간_고2_미적분I_유사.js / q06 | 문항 | EXEMPT: 중간값 정리의 양 끝 부호 계산 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_강남여고_2학기_중간_고2_미적분I_유사.js / q06 | 해설 | EXEMPT: 중간값 정리의 양 끝 부호 계산 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_강남여고_2학기_중간_고2_미적분I_유사.js / q07 | 문항 | EXEMPT: 도함수 부호의 보기별 판단 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_강남여고_2학기_중간_고2_미적분I_유사.js / q07 | 해설 | EXEMPT: 도함수 부호의 보기별 판단 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_강남여고_2학기_중간_고2_미적분I_유사.js / q08 | 문항 | EXEMPT: 유리식 식 변형·정의역 판정 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_강남여고_2학기_중간_고2_미적분I_유사.js / q08 | 해설 | 점근선 x=-1·y=-2와 양쪽 분리된 가지 추가 | rational-spike-v1 | `archive/tools/geometry-equation/production/plans/26_강남여고_2학기_중간_고2_미적분I_유사/q08-solution.plan.json` | SHALLOW_PASS · FULL_PASS | STATIC_SPEC_MATCH · RENDER_NOT_RUN |
| 26_강남여고_2학기_중간_고2_미적분I_유사.js / q09 | 문항 | 도함수의 -2 교점·3 중근 접점 숫자, 불필요한 점 마커 정리 | piecewise-polynomial-spike-v1 | `archive/tools/geometry-equation/production/plans/26_강남여고_2학기_중간_고2_미적분I_유사/q09-problem.plan.json` | SHALLOW_PASS · FULL_PASS | STATIC_SPEC_MATCH · RENDER_NOT_RUN |
| 26_강남여고_2학기_중간_고2_미적분I_유사.js / q09 | 해설 | EXEMPT: 제공된 도함수 그래프를 부호표로 해석 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_강남여고_2학기_중간_고2_미적분I_유사.js / q10 | 문항 | f/g 별도 패널과 x=0,1 불연속 열린·닫힌 점 보존 | piecewise-discontinuous-spike-v1 | `archive/tools/geometry-equation/production/plans/26_강남여고_2학기_중간_고2_미적분I_유사/q10-problem.plan.json` | SHALLOW_PASS · FULL_PASS | STATIC_SPEC_MATCH · RENDER_NOT_RUN |
| 26_강남여고_2학기_중간_고2_미적분I_유사.js / q10 | 해설 | EXEMPT: 문제의 두 그래프에서 좌·우 극한을 직접 읽음 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_강남여고_2학기_중간_고2_미적분I_유사.js / q11 | 문항 | EXEMPT: 조각함수 곱의 연속 조건 대입 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_강남여고_2학기_중간_고2_미적분I_유사.js / q11 | 해설 | EXEMPT: 조각함수 곱의 연속 조건 대입 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_강남여고_2학기_중간_고2_미적분I_유사.js / q12 | 문항 | ENGINE_CAPABILITY_PENDING: 원본 f의 극대·극소 4회 및 x=c 접점, a 보조 점선의 동시 재현 불가. 삼차 대체 기존 플랜은 원본과 의미 불일치이므로 생산 플랜으로 승격하지 않음 | NEED_SMOOTH_QUINTIC_MULTI_EXTREMA + EXACT_POINT_GUIDES | — | N/A | BLOCKED_NOT_PARITY |
| 26_강남여고_2학기_중간_고2_미적분I_유사.js / q12 | 해설 | EXEMPT: 도함수 부호·접선 기울기의 텍스트 판정 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_강남여고_2학기_중간_고2_미적분I_유사.js / q13 | 문항 | EXEMPT: 미분계수 극한을 이용한 계수 계산 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_강남여고_2학기_중간_고2_미적분I_유사.js / q13 | 해설 | EXEMPT: 미분계수 극한을 이용한 계수 계산 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_강남여고_2학기_중간_고2_미적분I_유사.js / q14 | 문항 | EXEMPT: 두 함수의 함수값·도함수 일치 방정식 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_강남여고_2학기_중간_고2_미적분I_유사.js / q14 | 해설 | EXEMPT: 두 함수의 함수값·도함수 일치 방정식 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_강남여고_2학기_중간_고2_미적분I_유사.js / q15 | 문항 | EXEMPT: 평균값 정리로 구간 끝점 계산 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_강남여고_2학기_중간_고2_미적분I_유사.js / q15 | 해설 | EXEMPT: 평균값 정리로 구간 끝점 계산 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_강남여고_2학기_중간_고2_미적분I_유사.js / q16 | 문항 | 접선 l, OP, C에서의 수선 CR, 직각표식, A/B/C/P/R 대응 유지 | piecewise-polynomial-spike-v1 | `archive/tools/geometry-equation/production/plans/26_강남여고_2학기_중간_고2_미적분I_유사/q16-problem.plan.json` | SHALLOW_PASS · FULL_PASS | STATIC_SPEC_MATCH · RENDER_NOT_RUN |
| 26_강남여고_2학기_중간_고2_미적분I_유사.js / q16 | 해설 | EXEMPT: 제공된 보조선으로 길이비 식을 계산 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_강남여고_2학기_중간_고2_미적분I_유사.js / q17 | 문항 | x=2의 열린 점·닫힌 점과 좌극한 2·우극한 -4 보존 | piecewise-discontinuous-spike-v1 | `archive/tools/geometry-equation/production/plans/26_강남여고_2학기_중간_고2_미적분I_유사/q17-problem.plan.json` | SHALLOW_PASS · FULL_PASS | STATIC_SPEC_MATCH · RENDER_NOT_RUN |
| 26_강남여고_2학기_중간_고2_미적분I_유사.js / q17 | 해설 | EXEMPT: 절댓값 곱의 좌·우 극한 비교 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_강남여고_2학기_중간_고2_미적분I_유사.js / q18 | 문항 | EXEMPT: 연속성과 미분가능성을 식으로 판정 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_강남여고_2학기_중간_고2_미적분I_유사.js / q18 | 해설 | EXEMPT: 연속성과 미분가능성을 식으로 판정 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_강남여고_2학기_중간_고2_미적분I_유사.js / q19 | 문항 | EXEMPT: 나머지정리와 미분·대입 계산 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_강남여고_2학기_중간_고2_미적분I_유사.js / q19 | 해설 | EXEMPT: 나머지정리와 미분·대입 계산 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_강남여고_2학기_중간_고2_미적분I_유사.js / q20 | 문항 | EXEMPT: 발문은 곡선·접점만을 정의하고 그림 없이 완결 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_강남여고_2학기_중간_고2_미적분I_유사.js / q20 | 해설 | 두 접선과 C의 직각, AB 지름 외접원을 엔진 도형으로 신규 구성 | piecewise-polynomial-spike-v1 | `archive/tools/geometry-equation/production/plans/26_강남여고_2학기_중간_고2_미적분I_유사/q20-solution.plan.json` | SHALLOW_PASS · FULL_PASS | STATIC_SPEC_MATCH · RENDER_NOT_RUN |
| 26_강남여고_2학기_중간_고2_미적분I_유사.js / q21 | 문항 | EXEMPT: 극값 위치의 부등식과 판별식 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_강남여고_2학기_중간_고2_미적분I_유사.js / q21 | 해설 | EXEMPT: 극값 위치의 부등식과 판별식 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_강남여고_2학기_중간_고2_미적분I_유사.js / q22 | 문항 | EXEMPT: 이차함수 계수와 두 극한 조건 계산 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_강남여고_2학기_중간_고2_미적분I_유사.js / q22 | 해설 | EXEMPT: 이차함수 계수와 두 극한 조건 계산 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_강남여고_2학기_중간_고2_미적분I_유사.js / q23 | 문항 | EXEMPT: 연속인 함수의 인수분해·대입 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_강남여고_2학기_중간_고2_미적분I_유사.js / q23 | 해설 | EXEMPT: 연속인 함수의 인수분해·대입 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_강남여고_2학기_중간_고2_미적분I_유사.js / q24 | 문항 | EXEMPT: 곱함수의 미분법 관계식 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_강남여고_2학기_중간_고2_미적분I_유사.js / q24 | 해설 | EXEMPT: 곱함수의 미분법 관계식 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_강남여고_2학기_중간_고2_미적분I_유사.js / q25 | 문항 | EXEMPT: 발문에서 함수·접선·교점이 모두 식으로 정의 | EXEMPT | — | N/A | EXEMPT (별도 도형 없음) |
| 26_강남여고_2학기_중간_고2_미적분I_유사.js / q25 | 해설 | 삼차곡선과 평행 접선 l,m, A/B/C, BC를 신규 구성 | piecewise-polynomial-spike-v1 | `archive/tools/geometry-equation/production/plans/26_강남여고_2학기_중간_고2_미적분I_유사/q25-solution.plan.json` | SHALLOW_PASS · FULL_PASS | STATIC_SPEC_MATCH · RENDER_NOT_RUN |

## 원본 PNG 대조 인벤토리

- q02: `archive/assets/images/26_강남여고_2학기_중간_고2_미적분I/q02.png` → 문항 그림의 형태·라벨·보조선·점선·교점·색채를 기준으로 점검.
- q09: `archive/assets/images/26_강남여고_2학기_중간_고2_미적분I/q09.png` → 문항 그림의 형태·라벨·보조선·점선·교점·색채를 기준으로 점검.
- q10: `archive/assets/images/26_강남여고_2학기_중간_고2_미적분I/q10.png` → 문항 그림의 형태·라벨·보조선·점선·교점·색채를 기준으로 점검.
- q12: `archive/assets/images/26_강남여고_2학기_중간_고2_미적분I/q12.png` → 문항 그림의 형태·라벨·보조선·점선·교점·색채를 기준으로 점검.
- q16: `archive/assets/images/26_강남여고_2학기_중간_고2_미적분I/q16.png` → 문항 그림의 형태·라벨·보조선·점선·교점·색채를 기준으로 점검.
- q17: `archive/assets/images/26_강남여고_2학기_중간_고2_미적분I/q17.png` → 문항 그림의 형태·라벨·보조선·점선·교점·색채를 기준으로 점검.

## 검수 결론

- 문항 25개, 축 50개 전수 판정. 실행 가능한 production plan 8개, 구조적 플랜 보류 1개.
- **plan-lint**: 위 계획에 대하여 shallow·full 전부 통과 (개별 프로세스 full 검증; 단일 대용량 프로세스 OOM 방지).
- **DRAWN_FEATURE_PARITY**: 의미 요소 정적 대조 완료; Chrome 부재로 렌더 기반 1:1 픽셀 비교 미실행.
- 필수 후속 기능: `TRANSPARENT_BACKGROUND_OPTOUT`(타원·입체 엔진의 흰 배경 rect 비활성화).
- q12 문항용 필요 기능: 도함수 부호 판단용 미분가능한 5차 이상 또는 4개 극점의 일반 매끄러운 곡선·x축 접점 c·x=a 점선 표시를 동일 모델로 검증하는 capability.
