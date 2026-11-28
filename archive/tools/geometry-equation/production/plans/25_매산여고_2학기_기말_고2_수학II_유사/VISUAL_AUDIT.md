# 25_매산여고_2학기_기말_고2_수학II_유사 — production plan 전축 감사

- 기준: 2026-11-27 새로 조회한 `origin/main` `41d9d673c378d6d300a366735a6a407d72939366` 및 현행 유사 JS 23문항·해설 23개. **문제 23축 + 해설 23축 = 46/46축**을 독립 판정했다.
- 판정: **REQUIRED 1축**, **BENEFICIAL 13축**, **EXEMPT 32축**. 구현 가능한 해설 그림 **11개 신규 공식 production JSON**(문제축 0개), 엔진 기능 미지원·미완료 해설축 **3개**(16·22·23번). 다른 시험지는 수정하지 않았다.
- 현행 유사 JS에 연결된 그림은 **해설 SVG 5개**(q3, q4, q6, q8, q17)이고 문제 SVG는 0개다. 원 기출 JS에는 변형 전 **해설 SVG 18개**가 있으며, 두 학교의 해당 경로에서 기출 PNG는 찾지 못했다. 원본과 유사판의 수식이 **의도적으로 다르다**(예: 원 기출 q03 `x²−4x+3` ↔ 유사판 `x²−5x+4`; q06 원 기출 `x³+1` ↔ 유사판 `x³+x²−2x`). 그래서 **현행 유사 JS·직접 연결 유사 SVG를 수학적 기준**으로 삼았다. 기출 SVG를 그대로 옮기면 오답 그림이 된다. 기출 PNG가 없으므로 `ORIGINAL_EXAM_PNG_CONFLICT`는 판정 대상 없음이며, 변형 전 SVG는 `ORIGINAL_EXAM_SVG_VARIANT_CONFLICT`로 구별한다.
- 직접 연결 SVG 5개 모두 전체 흰색 캔버스 rect가 있었다. SVG는 수정하지 않았으며 공식 plan에 흰 캔버스/장식성 채움을 추가하지 않았다. q03·q06·q17의 실제 수학적 넓이와 q18의 삼각형 APH만 엔진 영역 필드로 채웠다.
- 공식 JSON 파싱·메타데이터 검사, **Shallow lint 11/11 PASS, Full lint 11/11 PASS**. `STATIC_FIELD_PARITY`는 작성된 11개에 대해 원문·해설의 계수, 점, 선, 영역, 부호구간과 실제 engine 필드를 정적으로 대조하여 PASS. 미지원 3축은 `PENDING`, 면제 32축은 N/A다.
- `DRAWN_FEATURE_PARITY`는 **원문↔plan 정적 특징 확인까지만** 했다. Chromium 실행 본체 `/usr/lib/chromium/chromium`이 없어 `chromium --version`은 종료 127; 새 렌더·PNG 대조·픽셀·라벨 가독성·A4 검수 **`RENDER_NOT_RUN`**이다. 따라서 실제 출력 시각 PASS **0건**이다.

| 문항 | 문제 축 판정 | 해설 축 판정 | 원본 SVG | plan 파일 | STATIC_FIELD_PARITY | DRAWN_FEATURE_PARITY | 비고 |
|---|---|---|---|---|---|---|---|
| 01 | EXEMPT | EXEMPT | 유사판 없음 | 없음 | N/A | N/A | 문제·해설 모두 두 도함수/함수값을 대입하는 산술 풀이이며 공간적 정보가 없다. |
| 02 | EXEMPT | EXEMPT | 유사판 없음 | 없음 | N/A | N/A | 정적분의 원시함수와 끝값 계산으로 완결; 원 기출 q2 해설 SVG는 변형 전 자료다. |
| 03 | EXEMPT | BENEFICIAL | `q3-solution.svg` | `q03-solution.plan.json` | PASS | 정적 대조 / RENDER_NOT_RUN | 문제는 곡선식과 x축만 주어 독립 그림 면제. 해설은 x=1,4 교점 및 위 x축/아래 포물선의 [1,4] 음영, 꼭짓점 (5/2,−9/4)을 보존한다. 기출의 다른 계수 그림은 사용하지 않았다. |
| 04 | EXEMPT | BENEFICIAL | `q4-solution.svg` | `q04-solution.plan.json` | PASS | 정적 대조 / RENDER_NOT_RUN | 문제는 시간·위치 식만 있고 그릴 지정 도형이 없다. 해설 v(t)=−3t²+12t+15의 극점 (2,27), t=5 영점과 가속도 −18을 계산한다. 시간 t≥0은 캡션에 명시하되 도함수의 전 실수 대수적 연장은 실제 시간과 구분한다. |
| 05 | EXEMPT | EXEMPT | 유사판 없음 | 없음 | N/A | N/A | f(1), f′(1)만 알 수 있어 곡선 전체를 가정해 그리면 임의 정보를 추가한다. 곱의 미분식으로 풀이 완결. |
| 06 | EXEMPT | BENEFICIAL | `q6-solution.svg` | `q06-solution.plan.json` | PASS | 정적 대조 / RENDER_NOT_RUN | 문제는 곡선과 접점으로 접선을 계산해야 하므로 정답 그림 누설 방지. 해설은 삼차곡선 f, 접선 l:y=3x−3, 교점 x=−3,1, 곡선 위·접선 아래의 [−3,1] 영역만 연하게 칠한다. 필요한 두 극점도 정확한 √7 좌표로 기재한다. |
| 07 | EXEMPT | EXEMPT | 유사판 없음 | 없음 | N/A | N/A | 다항함수의 연속성과 극한값·곱 미분만 이용하므로 두 축 모두 수식으로 완결한다. |
| 08 | EXEMPT | BENEFICIAL | `q8-solution.svg` | `q08-solution.plan.json` | PASS | 정적 대조 / RENDER_NOT_RUN | 문제는 a를 정하기 전 접선·g의 모습이 미정이다. 해설 a=11에서 g′(t)=6t(5−t)의 t=0,5 영점, (0,5) 양수, 꼭짓점 (5/2,75/2)을 표시한다. |
| 09 | EXEMPT | BENEFICIAL | 유사판 없음; 기출 `q9-solution-v2.svg` | `q09-solution.plan.json` | PASS | 정적 대조 / RENDER_NOT_RUN | 풀이에서 결정한 f=2x³−3x²−12x+5의 극댓점 (−1,12)과 극솟점 (2,−15)을 표시한다. 이전 _plans의 레이아웃 오류를 현재 공식 lint로 재검토했다. |
| 10 | EXEMPT | EXEMPT | 유사판 없음 | 없음 | N/A | N/A | 미적분 기본정리의 도함수값 f(3)만 요구한다. |
| 11 | EXEMPT | EXEMPT | 유사판 없음; 기출 `q11-solution.svg` | 없음 | N/A | N/A | a=1,2 및 a>2의 도함수 인수분해·부호 논증으로 극값 개수 판단이 완결되며 기출 그림의 매개변수를 이식할 수 없다. |
| 12 | EXEMPT | EXEMPT | 유사판 없음 | 없음 | N/A | N/A | 다항함수의 합·곱 미분식을 적분하여 계수를 결정한다. 미정 함수의 형상을 임의로 그리지 않는다. |
| 13 | EXEMPT | BENEFICIAL | 유사판 없음; 기출 `q13-solution-v2.svg` | `q13-solution.plan.json` | PASS | 정적 대조 / RENDER_NOT_RUN | 문제는 속도식·초기 위치로 완비된다. 해설의 v(t)=t²−8t, t=0·8 영점, (4,−16) 극솟점과 t=3의 음의 속도 −15를 표시한다. 변위 −27은 적분 계산으로 별도 기록한다. |
| 14 | EXEMPT | BENEFICIAL | 유사판 없음; 기출 `q14-solution-v3.svg` | `q14-solution.plan.json` | PASS | 정적 대조 / RENDER_NOT_RUN | 문제는 선형 속도식만 제시. 해설에서 t=4의 방향 전환을 수직선의 [0,4), (4,7] 두 부호구간과 정지점으로 표현하며 이동거리 16+9=25는 식으로 계산한다. |
| 15 | EXEMPT | EXEMPT | 유사판 없음 | 없음 | N/A | N/A | 적분방정식을 미분해 f와 상수 a를 구하는 식 전개다. |
| 16 | EXEMPT | BENEFICIAL / ENGINE_CAPABILITY_PENDING | 유사판 없음; 기출 `q16-solution-v2.svg` | 보류 | PENDING | ENGINE_CAPABILITY_PENDING / RENDER_NOT_RUN | 극댓점 (0,27), 극솟점 (4,−5), y=±5의 교점 수를 동시에 보이는 삼차 그래프. y=5의 세 실근이 엔진 `referenceLines.intersectionX`가 요구하는 단일 √꼴이 아니어서 `ENGINE_CAPABILITY_PENDING:CUBIC_HORIZONTAL_LINE_ALGEBRAIC_INTERSECTIONS`. 누락 교점을 가짜 좌표로 채우지 않았다. |
| 17 | EXEMPT | BENEFICIAL | `q17-solution.svg` | `q17-solution.plan.json` | PASS | 정적 대조 / RENDER_NOT_RUN | 문제는 적분조건으로 미지 근을 구해야 하므로 문제 그림은 면제. 해설 f=(x−1)(x−5), 근 1·5, 꼭짓점 (3,−4), x축 위/포물선 아래 [1,5] 넓이 보존. 기출 원판은 적분 하한 2지만 유사판은 −1이다. |
| 18 | EXEMPT | BENEFICIAL | 유사판 없음; 기출 `q18-solution-v2.svg` | `q18-solution.plan.json` | PASS | 정적 대조 / RENDER_NOT_RUN | 문제에서 P의 최적 위치를 추론해야 하므로 문제 그림 면제. 해설의 A(0,4), B(5,4), 접선 y=4, P의 x=15/4와 H=(15/4,4)를 표시하고 **삼각형 APH만** 영역 채움. |
| 19 | EXEMPT | EXEMPT | 유사판 없음; 기출 `q19-solution.svg` | 없음 | N/A | N/A | 함수방정식과 F′=(x−1)f′의 부호 분석으로 완결된다. 변형 전 원본 이미지를 유사판에 유용하다고 단정하지 않는다. |
| 20 | EXEMPT | BENEFICIAL | 유사판 없음; 기출 `q20-solution-v2.svg` | `q20-solution.plan.json` | PASS | 정적 대조 / RENDER_NOT_RUN | 문제는 두 속도식만 주어 임의 매개변수 그림은 정답을 노출한다. 해설에서 얻은 m=3(영점 t=2), m=6(영점 t=1)의 Q 속도 부호구간을 분리한 시간축으로 보조한다. |
| 21 | EXEMPT | BENEFICIAL | 유사판 없음; 기출 `q21-solution-v2.svg` | `q21-solution.plan.json` | PASS | 정적 대조 / RENDER_NOT_RUN | 문제에서 음수 a의 최댓값을 구해야 한다. 해설 a=−4에서 f=F′=(x−1)²(x−4)의 접점 (1,0), 극솟점 (3,−4), 횡단 (4,0)을 보인다. F의 극값은 1개. |
| 22 | EXEMPT | REQUIRED / ENGINE_CAPABILITY_PENDING | 유사판 없음; 기출 `q22-solution-v3.svg` | 보류 | PENDING | ENGINE_CAPABILITY_PENDING / RENDER_NOT_RUN | 문제는 학생에게 **그래프를 그려** 풀이를 쓰라고 요구하므로 문제 그림 제공은 답 노출. 해설은 x<0의 별도 해와 x≥0의 φ=2x(x−3)² 및 연속 k∈(0,8) 수평선 교점 수를 함께 보여야 한다. 엔진의 반직선 정의역·가변 수평선 조합 미지원: `ENGINE_CAPABILITY_PENDING:RIGHT_HALF_LINE_PIECEWISE_PARAMETRIC_INTERSECTION_COUNT`. |
| 23 | EXEMPT | BENEFICIAL / ENGINE_CAPABILITY_PENDING | 유사판 없음; 기출 `q23-solution.svg` | 보류 | PENDING | ENGINE_CAPABILITY_PENDING / RENDER_NOT_RUN | k=2√6의 h=(x²−4)(x−2√6), 영점 −2·2·2√6와 부호가 다른 두 넓이 구간이 필요. 공식 shallow에서 `PIECEWISE_POLY_HIGH_DEGREE_IRRATIONAL_UNSUPPORTED`로 거절되어 `ENGINE_CAPABILITY_PENDING:PIECEWISE_POLY_HIGH_DEGREE_IRRATIONAL`. 유리수로 근사한 곡선·넓이는 만들지 않았다. |

## 검수 경계 및 남은 엔진 기능

1. **STATIC_FIELD_PARITY PASS 11**: 기호와 계수·극점·접점·선·영점·시간구간·영역 경계를 현행 유사 JS의 문제/해설과 도형 필드에 직접 대응시켰다. q13·14·20은 부호/정지점을 나타내는 보조 시각화이고 적분 넓이를 가짜 음영으로 표시하지 않는다.
2. **DRAWN_FEATURE_PARITY 시각 검수 0**: 원본 SVG의 요소와 계획 JSON의 특징을 정적으로 비교했지만 실제 공식 엔진이 그린 SVG 파일에 대한 픽셀 검사는 하지 못했다. `RENDER_NOT_RUN`을 유지한다.
3. **ENGINE_CAPABILITY_PENDING 3**: 16번(일반 삼차 수평선의 세 비제곱근 교점), 22번(반직선 제한 및 k 범위 전체 교점 개수), 23번(무리수 계수 고차 다항과 부호별 음영).
4. 원 기출·유사판 수식과 그림은 변형으로 서로 다를 수 있다. `_plans/`의 과거 `UNSUPPORTED`와 예전 증거 SVG를 현재 production 출력 PASS로 간주하지 않는다. Chromium 정상 설치 환경에서 11개를 실제로 렌더링하고 학생 화면·A4·라벨·투명 배경·영역 경계를 확인해야 한다.
