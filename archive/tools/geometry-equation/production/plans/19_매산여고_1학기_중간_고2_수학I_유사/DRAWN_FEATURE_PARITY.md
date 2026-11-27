# DRAWN_FEATURE_PARITY — 19_매산여고_1학기_중간_고2_수학I_유사

> 최신 main 기준 원문 1:1 대비 및 2026-11-27 플랜 전수검수. 검사 범위는 지정한 유사시험지의 문항·해설 두 축뿐이다.

- 원문 22문항, 두 축 44개. 원문 JS의 모든 문항 content·choices·solution을 대조하고 SVG/배경/면채움 삽입 여부를 확인했다.
- 실행형 JSON에는 흰색 배경, `background`, `fill`, `regions`를 지정하지 않았다. 도형은 선·필요한 표식만 사용한다.
- `plan-lint --shallow` / `plan-lint` 전체 검사는 19개 파일을 대상으로 각각 FAIL 0, OK 19. 아래 LINT=OK/OK는 두 검사를 뜻한다.
- `DRAWN_FEATURE_PARITY=STATIC_MATCH`는 원문↔플랜 좌표·곡선·선분·점선·표식을 수학적으로 1:1 확인했다는 뜻이며 **실제 SVG 화면 관측 PASS는 아니다**. Chromium 실행 파일이 없어 렌더 결과 시각 관측은 `ENV_BLOCKED`다.
- `EXEMPT`는 원문에 그림이 없고 문항/해설의 계산·텍스트만으로 충분하여 SVG를 추가하지 않은 축이다.
- `CONTENT_CONFLICT`는 원문의 수학적 모순 때문에 도형을 확정할 수 없는 축이다.
- `ENGINE_CAPABILITY_PENDING`는 일부 실행 가능한 플랜은 있으나 요구한 시각 요소가 엔진의 표현 범위 밖인 축이다.

| qid | 축 | 원문 대비 그릴 요소·판정 근거 | capability | plan 경로 | plan-lint | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|---|
| 01 | 문항 | 음수의 세제곱근 계산 — 원문 발문·선택지에 독립 그림 없고 풀이값을 사전 노출하지 않음 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 01 | 해설 | 음수의 세제곱근 계산 — 계산식·표만 사용, 보조 그림 불필요 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 02 | 문항 | 근과 로그 성질 선지 — 원문 발문·선택지에 독립 그림 없고 풀이값을 사전 노출하지 않음 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 02 | 해설 | 근과 로그 성질 선지 — 계산식·표만 사용, 보조 그림 불필요 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 03 | 문항 | 지수 연산 — 원문 발문·선택지에 독립 그림 없고 풀이값을 사전 노출하지 않음 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 03 | 해설 | 지수 연산 — 계산식·표만 사용, 보조 그림 불필요 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 04 | 문항 | 세 양수의 근 지수와 자연수 n — 원문 발문·선택지에 독립 그림 없고 풀이값을 사전 노출하지 않음 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 04 | 해설 | 세 양수의 근 지수와 자연수 n — 계산식·표만 사용, 보조 그림 불필요 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 05 | 문항 | 로그 곱셈·밑변환 — 원문 발문·선택지에 독립 그림 없고 풀이값을 사전 노출하지 않음 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 05 | 해설 | 로그 곱셈·밑변환 — 계산식·표만 사용, 보조 그림 불필요 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 06 | 문항 | 다섯 지수함수와 점 (1,4),(1,2),(2,9),(−1,3),(1,1/5) — 원문 발문·선택지에 독립 그림 없고 풀이값을 사전 노출하지 않음 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 06 | 해설 | 다섯 지수함수와 점 (1,4),(1,2),(2,9),(−1,3),(1,1/5) | multi-curve-figure-v1 | q06-solution.plan.json | OK/OK | STATIC_MATCH·RENDER_ENV_BLOCKED |
| 07 | 문항 | 박테리아 개체수 로그식 — 원문 발문·선택지에 독립 그림 없고 풀이값을 사전 노출하지 않음 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 07 | 해설 | 박테리아 개체수 로그식 — 계산식·표만 사용, 보조 그림 불필요 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 08 | 문항 | 상용로그 정수 조건 — 원문 발문·선택지에 독립 그림 없고 풀이값을 사전 노출하지 않음 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 08 | 해설 | 상용로그 정수 조건 — 계산식·표만 사용, 보조 그림 불필요 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 09 | 문항 | 감소 지수곡선, y=3 점근선, x=−1·2의 경계점 — 원문 발문·선택지에 독립 그림 없고 풀이값을 사전 노출하지 않음 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 09 | 해설 | 감소 지수곡선, y=3 점근선, x=−1·2의 경계점 | exponential-affine-spike-v1 | q09-solution.plan.json | OK/OK | STATIC_MATCH·RENDER_ENV_BLOCKED |
| 10 | 문항 | 두 로그곡선, A·B·C·D 및 수직선분 AC·BD, AB=6, 영역 넓이 — 원문 발문·선택지에 독립 그림 없고 풀이값을 사전 노출하지 않음 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 10 | 해설 | 두 로그곡선, A·B·C·D 및 수직선분 AC·BD, AB=6, 영역 넓이 — 곡선 2개만 구현. A/B/C/D 교점, AC/BD 수직 경계·곡선 사이 면 경계는 현재 미지원 | multi-curve-figure-v1 (ENGINE_CAPABILITY_PENDING) | q10-solution.plan.json | OK/OK | PARTIAL_MATCH·ENGINE_CAPABILITY_PENDING |
| 11 | 문항 | 판별식과 허근 조건 — 원문 발문·선택지에 독립 그림 없고 풀이값을 사전 노출하지 않음 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 11 | 해설 | 판별식과 허근 조건 — 계산식·표만 사용, 보조 그림 불필요 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 12 | 문항 | 제3사분면 동경, 수선, 직각, 가로3·세로4·빗변5 — 원문 발문·선택지에 독립 그림 없고 풀이값을 사전 노출하지 않음 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 12 | 해설 | 제3사분면 동경, 수선, 직각, 가로3·세로4·빗변5 | construction-spike-v1 | q12-solution.plan.json | OK/OK | STATIC_MATCH·RENDER_ENV_BLOCKED |
| 13 | 문항 | 210°와 다른 동경 사분면을 선지 비교 — 원문 발문·선택지에 독립 그림 없고 풀이값을 사전 노출하지 않음 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 13 | 해설 | 210°와 다른 동경 사분면을 선지 비교 — 계산식·표만 사용, 보조 그림 불필요 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 14 | 문항 | y=cos(πx/2), y=x/7의 일곱 교점 — 원문 발문·선택지에 독립 그림 없고 풀이값을 사전 노출하지 않음 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 14 | 해설 | y=cos(πx/2), y=x/7의 일곱 교점 | trigonometric-spike-v1 | q14-solution.plan.json | OK/OK | STATIC_MATCH·RENDER_ENV_BLOCKED |
| 15 | 문항 | √sinθ/√cosθ=−√(sinθ/cosθ), 실수 조건 충돌 (제곱근의 실수 정의역과 발표 정답이 불일치) | CONTENT_CONFLICT | — | N/A | BLOCKED_SOURCE_CONTRADICTION |
| 15 | 해설 | √sinθ/√cosθ=−√(sinθ/cosθ), 실수 조건 충돌 (제곱근의 실수 정의역과 발표 정답이 불일치) | CONTENT_CONFLICT | — | N/A | BLOCKED_SOURCE_CONTRADICTION |
| 16 | 문항 | y=3sin2x−1의 주기·극대·극소·π 눈금 — 원문 발문·선택지에 독립 그림 없고 풀이값을 사전 노출하지 않음 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 16 | 해설 | y=3sin2x−1의 주기·극대·극소·π 눈금 | trigonometric-spike-v1 | q16-solution.plan.json | OK/OK | STATIC_MATCH·RENDER_ENV_BLOCKED |
| 17 | 문항 | 0≤θ≤2π, y=cosθ와 y=−√3/2의 두 교점 — 원문 발문·선택지에 독립 그림 없고 풀이값을 사전 노출하지 않음 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 17 | 해설 | 0≤θ≤2π, y=cosθ와 y=−√3/2의 두 교점 | trigonometric-spike-v1 | q17-solution.plan.json | OK/OK | STATIC_MATCH·RENDER_ENV_BLOCKED |
| 18 | 문항 | 지수함수 증가·감소, 공통점 (0,1), x축 점근선 — 원문 발문·선택지에 독립 그림 없고 풀이값을 사전 노출하지 않음 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 18 | 해설 | 지수함수 증가·감소, 공통점 (0,1), x축 점근선 | multi-curve-figure-v1 | q18-solution.plan.json | OK/OK | STATIC_MATCH·RENDER_ENV_BLOCKED |
| 19 | 문항 | t=sinx∈[−1,1], 포물선의 양 끝점·꼭짓점 — 원문 발문·선택지에 독립 그림 없고 풀이값을 사전 노출하지 않음 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 19 | 해설 | t=sinx∈[−1,1], 포물선의 양 끝점·꼭짓점 | polynomial-spike-v1 | q19-solution.plan.json | OK/OK | STATIC_MATCH·RENDER_ENV_BLOCKED |
| 20 | 문항 | 두 로그부등식의 공통 정수해 3,4,5,6 — 원문 발문·선택지에 독립 그림 없고 풀이값을 사전 노출하지 않음 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 20 | 해설 | 두 로그부등식의 공통 정수해 3,4,5,6 | number-line-figure-v1 | q20-solution.plan.json | OK/OK | STATIC_MATCH·RENDER_ENV_BLOCKED |
| 21 | 문항 | 상용로그 원문 표의 숫자 셀 — 원문 발문·선택지에 독립 그림 없고 풀이값을 사전 노출하지 않음 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 21 | 해설 | 상용로그 원문 표의 숫자 셀 — 계산식·표만 사용, 보조 그림 불필요 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 22 | 문항 | 망각모형 t≥8개월과 t=3에서의 대입값 — 원문 발문·선택지에 독립 그림 없고 풀이값을 사전 노출하지 않음 | EXEMPT | — | N/A | EXEMPT_NO_SOURCE_DRAWING |
| 22 | 해설 | 망각모형 t≥8개월과 t=3에서의 대입값 | number-line-figure-v1 | q22-solution.plan.json | OK/OK | STATIC_MATCH·RENDER_ENV_BLOCKED |

## 확인된 차단 사항

1. **q10 해설:** 두 로그곡선은 정확한 실함수로 렌더되며 두 로그의 높이차가 5인 수학 사실도 검증된다. 그러나 `LOG_REGION_BOUNDARY_UNSUPPORTED`(로그곡선을 면 경계로 사용), `SYMBOLIC_K_INTERSECTION_AND_VERTICAL_CONNECTORS`(미지수 k에서 계산한 교점과 선분 AC·BD, AB 길이 6 표시)를 요구한다. 면을 임의로 채우거나 정답 면을 사각형으로 속이지 않았으며 `ENGINE_CAPABILITY_PENDING`으로 분리했다.
2. **q15 문항·해설:** 실수 제곱근으로 해석할 때 분자 √sinθ와 분모 √cosθ가 정의되려면 sinθ≥0, cosθ>0이다. sinθcosθ≠0이므로 좌변은 양수, 우변 −√(sinθ/cosθ)는 음수다. 따라서 해가 없는데 원문은 3π/4를 답으로 제시한다. 해당 각은 cosθ<0이어서 분모 제곱근이 실수로 정의되지 않는다. 원문의 식·정답·풀이 중 하나를 수정해야 하므로 계획에 거짓 근을 기입하지 않았다.

## 검수 범위와 근거

- 문항과 해설을 각각 독립 축으로 기록했다. 점/좌표, 보조선·점선, 직각, 길이·치수선, 곡선 및 끝점, 정수 범위에 대해 sourceConditions와 plan graphPlan/mathPlan을 대조했다.
- 실제 SVG 파일, 손수 SVG, 흰색 바탕 사각형, 시각적으로 임의 생성한 면 채움은 추가하지 않았다.
- 최종 그림에 대한 DOM/픽셀 관측은 브라우저 본체 부재로 아직 실행 불가하다. 이에 `STATIC_MATCH`를 `VISUAL_PASS`로 간주하지 않는다.
