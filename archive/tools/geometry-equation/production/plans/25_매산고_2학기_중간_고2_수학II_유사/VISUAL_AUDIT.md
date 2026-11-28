# 2025 매산고 2학기 중간 고2 수학Ⅱ 유사 — production visual audit

- 기준: `archive/exams/similar/high/h2/2mid/25_매산고_2학기_중간_고2_수학II_유사.js`의 현행 문항 20개·해설 20개, **총 40축**. 기출 JS·PNG·SVG와 서로 다른 수치가 있을 때는 실제 배포되는 유사 JS의 식과 직접 연결된 유사 SVG를 우선한다.
- 원 기출 이미지: `archive/assets/images/25_매산고_2학기_중간_고2_수학II/`의 `q8.png`, `q9.png`, `q13.png`; 해설용 SVG는 q3·4·7·8·9(3종)·12·13(3종)·16·20. 직접 연결된 **유사판** SVG: `.../25_매산고_2학기_중간_고2_수학II_유사/q08-problem.svg` 1개. 기존 legacy `_유사_plans/` 3개 중 q08은 공식 엔진 형식이고 q09·q13은 `figureType` 개요 형식이라 실행할 수 없었다.
- 판단 표기: `R=REQUIRED`(문제의 그림·공간 관계가 필수), `B=BENEFICIAL`(해설 도형이 계산 관계를 유익하게 보여 줌), `E=EXEMPT`(원문의 숫자·식만으로 계산 가능). `P=STATIC_FIELD_PARITY PASS`; `D=RENDER_NOT_RUN`(실제 생성된 production SVG를 읽지 못해 **DRAWN_FEATURE_PARITY 시각 검증은 SKIP**). 표의 `—`는 해당 축의 별도 production plan이 필요하지 않음을 뜻한다.

| 문항 | 문제 축 판정 | 해설 축 판정 | 원본 SVG | plan 파일 | STATIC_FIELD_PARITY | DRAWN_FEATURE_PARITY | 비고 |
|---|---|---|---|---|---|---|---|
| 01 | E: 다항식 직접대입 | E: 연속성 대입 | — | — | N/A | N/A | 그래프가 계산을 바꾸지 않음. |
| 02 | E: 극한 사칙연산 | E: 값 대입 | — | — | N/A | N/A | 함수 개형 불필요. |
| 03 | E: 조각 식·경계 −1 명시 | E: 좌우 미분계수 연립 | q3-solution.svg(기출) | — | N/A | N/A | `ORIGINAL_EXAM_SVG_VARIANT_CONFLICT`: 기출 해설은 x=−2에서 직선·삼차, 유사는 x=−1에서 직선·x⁴. 유사식의 대수 검산으로 충분. |
| 04 | E: 삼차식과 구간 선택지 | B: 연속성과 부호 변화 시각화 | q4-solution.svg(기출) | `q04-solution.plan.json` | P | D | `ORIGINAL_EXAM_SVG_VARIANT_CONFLICT`: 기출 3x³−x²−x+2, 유사 x³−3x²−2. 유사 P(3)=−2, P(4)=14 검산. |
| 05 | E: 대칭 미분 극한 | E: 도함수·인수정리 | — | — | N/A | N/A | 문항이 좌표 그림을 요구하지 않음. |
| 06 | E: 다항식 나머지 | E: P(1),P′(1) 방정식 | — | — | N/A | N/A | 기호 대입으로 해설 완결. |
| 07 | E: V함수·직선의 식 제공 | E: 두 가지 교점 존재 부등식 | q7-solution.svg(기출) | — | N/A | N/A | `ORIGINAL_EXAM_SVG_VARIANT_CONFLICT`: 기출 꺾임 x=1·직선 y=kx−2k, 유사는 x=2·직선 y=kx−3k. 유사 경계 k=−3,−1,3만 유효. |
| 08 | R: 직선과 곡선의 교차·A/P/B 순서가 보기 판단의 근거 | E: 문제 그림과 평균값정리로 해석 | q8-solution.svg(기출), 직접 유사 q08-problem.svg | `q08-problem.plan.json` | P | D | `ORIGINAL_EXAM_PNG_CONFLICT`/`ORIGINAL_EXAM_SVG_VARIANT_CONFLICT`: 기출 y=x/2, 현행 유사 y=x/3. 곡선의 다항식은 직접 연결된 유사 SVG의 **개형 예시**이지 f의 정해진 식이 아님. 유사 SVG 전체 흰 `rect`: `ENGINE_CAPABILITY_PENDING:TRANSPARENT_CANVAS_OPTION`. 문제축 메타데이터에 보기의 정오·미분계수 답 미노출. |
| 09 | R: P/H/Q 및 PQ·HQ 구조를 ‘다음 그림’으로 요구 | E: 중점·거리식 유리화 | q9-solution.svg, q9-solution-v2.svg, q9-solution-v3.svg(기출) | `q09-problem.plan.json` | P | D | `ORIGINAL_EXAM_PNG_CONFLICT`/`ORIGINAL_EXAM_SVG_VARIANT_CONFLICT`: 기출 y=9x², 유사는 y=4x². JS에 직접 `image` 필드 없음(`JS_IMAGE_REFERENCE_MISSING`); t=1 대표 배치가 관계를 정확히 만족, 답 극한 1/4는 그림 메타데이터에 없음. |
| 10 | E: 다항식 극한 조건 | E: 인수·계수 비교 | — | — | N/A | N/A | 시각 축 필요 없음. |
| 11 | E: 함수 극한 참·거짓 | E: 반례 식 제시 | — | — | N/A | N/A | 그래프 없이도 반례 성립. |
| 12 | E: 세 접선 조건은 식으로 완결 | B: 접점 매개변수의 삼중 교차 | q12-solution.svg(기출) | `q12-solution.plan.json` | P | D | `ORIGINAL_EXAM_SVG_VARIANT_CONFLICT`: 기출 점 (2,k)·다른 h(t), 유사는 점 (1,k)·h(t)=−2t³+9t²−12t+11. 해설축에서만 k=169/27 표시. |
| 13 | R: OP=OQ 삼각형·외접원 구조 필수 | E: 코사인·원의 지름식 대수 계산 | q13-solution.svg, -v2.svg, -v3.svg(기출) | `q13-problem.plan.json` | P | D | `ORIGINAL_EXAM_PNG_CONFLICT`/`ORIGINAL_EXAM_SVG_VARIANT_CONFLICT`: 기출 y=x², 유사는 y=2x². JS 그림 필드 없음(`JS_IMAGE_REFERENCE_MISSING`). t=1 대표 배치 O(0,0),P(1,2),Q(√5,0), 정확 외접원 원심·반지름 제곱 검산. |
| 14 | E: 다항함수 g−f의 조건 | E: 중근·계수 연립 | — | — | N/A | N/A | 해의 그림상 위치 불필요. |
| 15 | E: 감소 조건 | E: 이차 도함수 판별식 | — | — | N/A | N/A | 전 구간 부호 판정만 필요. |
| 16 | E: 두 구간식·x=1 제공 | E: 연속·점프 도함수와 치역 | q16-solution.svg(기출) | — | N/A | N/A | `ORIGINAL_EXAM_SVG_VARIANT_CONFLICT`: 기출은 x²−4x 중심, 유사는 x²−6x 및 다른 a,b; 유사 대수 경계 x=1 유지. |
| 17 | E: 함수방정식 | E: 계수 비교 | — | — | N/A | N/A | 해설에 함수 곡선이 등장하지 않음. |
| 18 | E: 조각 이차함수 식·경계 0 제공 | E: 평균값정리 해의 개수를 부등식으로 산정 | — | — | N/A | N/A | (−1,a)의 정확한 구간 조건을 산술적으로 검산; 임의 a의 그림은 오해 우려. |
| 19 | E: 절댓값의 미분 극한 | E: 자연수 경우 분류 | — | — | N/A | N/A | 열거식으로 충분. |
| 20 | E: 삼차함수 관계식 | E: 다항식 인수·근의 곱 | q20-solution.svg(기출) | — | N/A | N/A | `ORIGINAL_EXAM_SVG_VARIANT_CONFLICT`: 기출 해설의 k=−12·g(−1)=2와 유사 k=−24·g(−4)=8이 다름. 현행 JS를 계산 기준으로 사용. |

### 집계 및 검산

- **20문항 × 2 = 40축**, 문제축 `REQUIRED 3 / BENEFICIAL 0 / EXEMPT 17`, 해설축 `REQUIRED 0 / BENEFICIAL 2 / EXEMPT 18`. 두 축 합계 `R 3 + B 2 + E 35 = 40`.
- 공식 plan `5개 모두 신규`(이전 공식 폴더 없음); legacy 개요 JSON은 사용하지 않음. `JSON 5 PASS/0 FAIL/0 SKIP`, `Shallow 5 PASS/0 FAIL/0 SKIP`, `Full 5 PASS/0 FAIL/0 SKIP` (최종 재실행 기준). `STATIC_FIELD_PARITY 5 PASS`, `DRAWN_FEATURE_PARITY 0 시각 PASS / 5 SKIP(RENDER_NOT_RUN)`.
- 독립 수학 확인: Q04 `P(3)=−2, P(4)=14`; Q08 개형 예시 `x²−8x/3=x/3`의 교점은 `x=0,3` 및 `a=1<p=3<b=4`; Q09 `sqrt(t²+4t⁴)−2t² → 1/4`; Q12 `h(t)=f(t)+(1−t)f′(t)` 및 `k=169/27∈(6,7)`; Q13 `OP=OQ=√5`, 원의 중심 `(√5/2,(5−√5)/4)`·반지름 제곱 `(25−5√5)/8`이 O,P,Q와 일치.
- 현 환경 `/usr/bin/chromium --version`은 실행 파일 `/usr/lib/chromium/chromium` 부재로 종료 127. 실제 SVG 공식 렌더와 육안 대조는 **모두 `RENDER_NOT_RUN`**이며 lint·정적 필드 PASS를 시각 PASS로 해석하지 않는다. 브라우저로 실제 렌더 가능한 환경에서 후속 확인 필요.
- 엔진의 투명 배경 선택지는 현재 미지원이다. 직접 연결된 q08 SVG는 전체 흰 `rect`가 있고, 그 도형에 한하여 `ENGINE_CAPABILITY_PENDING:TRANSPARENT_CANVAS_OPTION`. SVG 자체를 편집하지 않는다.
