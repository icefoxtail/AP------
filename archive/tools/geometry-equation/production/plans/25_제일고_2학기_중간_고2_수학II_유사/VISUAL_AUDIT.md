# 2025 제일고 고2 2학기 중간 수학Ⅱ 유사 — 2축 독립 감사

- 기준: 현행 `archive/exams/similar/high/h2/2mid/25_제일고_2학기_중간_고2_수학II_유사.js`의 **22문항·22해설**, 합계 **44축**. 원 기출의 숫자나 그림이 아닌 현재 유사 JS의 조건을 제작 기준으로 삼았다.
- 공식 production plan: 기존 0개, 신규 **3개**(`q18-solution`, `q20-problem`, `q20-solution`). 기존 `_plans/`에는 q09 그래프의 비공식 `.visual.json`과 q20의 공식 엔진 내장형 시각 초안이 있었으며, q20은 공식 `construction-spike-v1` 내용을 추출해 조건별로 재검수했다. 손 SVG 작성·수정 없음.
- 표의 `PASS(정적)`은 원본 SVG의 수학적 구성요소와 JSON의 실제 그리기 필드 대응만 뜻한다. **공식 SVG 렌더는 실행하지 못해 3개 모두 `RENDER_NOT_RUN`**; 실제 렌더 이미지의 시각적 일치 판정이 아니다. 원본 SVG만 별도 래스터화해 검사했다.
- Chromium 새 검사: `/usr/bin/chromium --version`은 설치 실행 파일 `/usr/lib/chromium/chromium` 부재로 실패(exit 127). 공식 렌더 없음.
- `ORIGINAL_EXAM_PNG_CONFLICT`: q09 원 기출 `q9.png`의 함수명과 x=1 분기 조건이 유사 `q09-problem-engine-v3.svg`의 p·q 및 x=2 분기와 다르다. q20 원 기출 `q20.png`는 접선 `y=x`·중심 `(a,a−1/a)`인데 유사 JS는 `y=2x`·`(a,2a−20/a)`이다. `ORIGINAL_EXAM_SVG_VARIANT_CONFLICT`: 원 기출 `q20-solution*.svg`·`q18-solution.svg`는 서로 다른 문제/접선 조건을 그리므로 유사판의 해설 그림으로 대용하지 않는다.
- q09 `ENGINE_CAPABILITY_PENDING:SHARED_DISCONTINUOUS_PAIR_WITH_SECOND_CURVE_QUADRATIC_EXTREMUM`: 공식 `piecewise-discontinuous-spike-v1`의 `layout:SHARED`에서 둘째 함수 q의 내부 꼭짓점 `(1/2,3)`을 `requiredPoints`로 요구하면서도 `referenceCurves[0].requiredPoints`는 거절한다. 공식 `multi-curve-figure-v1`은 `Y_OF_X` 조각의 `domainStates`(열린 경계)를 지원하지 않는다. 두 경계 x=-1,2의 열린/닫힌 점과 p 실선·q 점선을 모두 유지하는 plan이 거절되어 **근사·우회 생성하지 않았다**.
- `ENGINE_CAPABILITY_PENDING:TRANSPARENT_CANVAS_OPTION`: 직접 연결된 `q20-problem-engine-v3.svg`에 전면 흰색 `<rect width="600" height="440" fill="#fff"/>`가 있다. 공식 엔진의 투명 캔버스 옵션 미지원 여부가 남아 있으므로 기존 SVG를 직접 고치지 않았다.
- q20 문제축 `caption`·`accessibilityDescription`·`sourceConditions`·`newVisualInformation`은 임의 대표 배치라는 점만 언급하고 `a=5`, 반지름의 수치, 최종 극한값을 노출하지 않는다. `a=5`는 해설축에만 명시한다.

| 문항 | 문제 축 판정 | 해설 축 판정 | 원본 SVG | plan 파일 | STATIC_FIELD_PARITY | DRAWN_FEATURE_PARITY | 비고 |
|---|---|---|---|---|---|---|---|
| 01 | EXEMPT — 이차식의 조임 정리, 그림 불필요 | EXEMPT — 양끝 극한 대수식으로 검산 | — | — | SKIP | SKIP | 부등식 계수 4·7만 사용 |
| 02 | EXEMPT — 극한 연산 식 완결 | EXEMPT — p·q 극한 계산 식 완결 | — | — | SKIP | SKIP | 함수 개형 미지정 |
| 03 | BENEFICIAL — x=2 조각 경계 시각화 유익 | BENEFICIAL — 좌우 값과 연속 조건 비교 유익 | — | — | SKIP | SKIP | 식으로 풀 수 있어 신규 그림 비필수 |
| 04 | EXEMPT — 이차함수 평균변화율 식 완결 | EXEMPT — 할선 기울기 계산만 필요 | — | — | SKIP | SKIP | 3x²−2x+4 |
| 05 | BENEFICIAL — 접선과 법선 방향 관계 | BENEFICIAL — P의 접선 기울기와 y절편 관계 | — | — | SKIP | SKIP | 직접 연결된 그림 없음 |
| 06 | EXEMPT — 이차함수 극한·최솟값 조건 충분 | EXEMPT — 인수분해와 꼭짓점 대수 검산 | — | — | SKIP | SKIP | 그래프 임의 추가 금지 |
| 07 | EXEMPT — 근호 극한 유리화 식 완결 | EXEMPT — 유리화 해설 식 완결 | — | — | SKIP | SKIP | 정의역 도식 의무 없음 |
| 08 | BENEFICIAL — 12·32분 및 5·6분 주차료 계단 | BENEFICIAL — x=23 좌우 계단 값 대조 | — | — | SKIP | SKIP | 시각화 유익하지만 문제·해설 텍스트만 존재 |
| 09 | REQUIRED — p 실선·q 점선의 6개 조각과 ±경계 열린/닫힌 점 | BENEFICIAL — x=-1·2 좌우 함수값 읽기 | `q09-problem-engine-v3.svg` (+ `q09.svg`) | — | SKIP (엔진 거절) | ENGINE_CAPABILITY_PENDING | 원 기출 PNG와 함수명·경계 상이; SHARED 둘째 포물선 꼭짓점 필수점 충돌, `RENDER_NOT_RUN` |
| 10 | EXEMPT — 홀함수/중간값정리 부호 조건 | EXEMPT — 구간별 근 존재 논증 | — | — | SKIP | SKIP | 함수 구체 식 불명 |
| 11 | EXEMPT — 다항계수와 극한 제약 | EXEMPT — 중근 인수분해로 충분 | — | — | SKIP | SKIP | 임의 개형 미지정 |
| 12 | EXEMPT — 홀다항함수 미분계수 | EXEMPT — 도함수 극한 검산 | — | — | SKIP | SKIP | 식 처리 |
| 13 | BENEFICIAL — 일차/이차 조각의 접합점 | BENEFICIAL — 함수·도함수 양쪽 일치 조건 | — | — | SKIP | SKIP | 미지 c,d 해설 누설 주의 |
| 14 | EXEMPT — 삼차함수 접선 조건 식 완결 | BENEFICIAL — 원점 통과 접선·접점 | — | — | SKIP | SKIP | 연립방정식으로 풀이 가능 |
| 15 | BENEFICIAL — x=1 및 주기 4 조각 경계 | BENEFICIAL — f(0)=f(4), f(1±) 비교 | — | — | SKIP | SKIP | 해설 계수의 문제축 노출 금지 |
| 16 | BENEFICIAL — y=tx와 √(9x−4)의 교점 수 | BENEFICIAL — 접선/교점 개수 전이 | — | — | SKIP | SKIP | 정의역 x≥4/9 필수이나 원본 그림 없음 |
| 17 | BENEFICIAL — 직선과 포물선의 분기 교점 | BENEFICIAL — 유일한 비미분 접합점 | — | — | SKIP | SKIP | 원문에는 해설 그림 없음 |
| 18 | BENEFICIAL — 원 중심·공통 접선 관계 | REQUIRED — C(3,0), T(1,1), 접선·반지름 수직 | `q18-solution.svg` | `q18-solution.plan.json` | PASS(정적) | PASS(필드↔SVG 요소), 렌더 미검증 | 원 기출 SVG는 다른 접선 조건. 독립 검산 CT 기울기 −1/2, 직선 기울기 2. `RENDER_NOT_RUN` |
| 19 | EXEMPT — 무리함수 분모의 정의역 조건 | EXEMPT — 이차식의 양성 판별식 | — | — | SKIP | SKIP | 구간/영점 그림 요구 없음 |
| 20 | REQUIRED — y=2x와 접하는 원·중심·반지름·접점 | REQUIRED — OP·r·최대거리 d=OP+r | `q20-problem-engine-v3.svg`, `q20-solution.svg` (+ `q20.svg`) | `q20-problem.plan.json`, `q20-solution.plan.json` | 2 PASS(정적) | 2 PASS(필드↔SVG 요소), 렌더 미검증 | 원 기출 PNG/SVG는 y=x와 다른 중심. 흰 캔버스 보류. `RENDER_NOT_RUN`×2 |
| 21 | EXEMPT — f와 f′ 계수 비교 | EXEMPT — 다항계수 결정만 필요 | — | — | SKIP | SKIP | 그래프 비필수 |
| 22 | EXEMPT — 미분함수의 극값 식 완결 | BENEFICIAL — 기울기 최소 접선 표시 | — | — | SKIP | SKIP | 해설 도식 없어 미제작 |

**합계:** 문제축 22 + 해설축 22 = **44축**. REQUIRED: 문제 2·해설 2; BENEFICIAL: 문제 8·해설 10; EXEMPT: 문제 12·해설 10. 공식 plan JSON/Shallow/Full **3/3 PASS**; `STATIC_FIELD_PARITY` 3 PASS·0 FAIL, `DRAWN_FEATURE_PARITY`는 원본 요소↔plan 필드 정적 대응 3 PASS이나 공식 산출 SVG 관찰 **0건**. 공식 SVG **3/3 RENDER_NOT_RUN**. 엔진 미지원 q09는 plan 미생성으로 lint 집계에서 분리한다.
