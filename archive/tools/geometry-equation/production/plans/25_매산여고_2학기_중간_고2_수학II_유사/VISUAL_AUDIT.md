# 2025 매산여고 2학기 중간 고2 수학Ⅱ 유사 — production visual audit

- 기준: `archive/exams/similar/high/h2/2mid/25_매산여고_2학기_중간_고2_수학II_유사.js`의 현행 문항 23개·해설 23개, **총 46축**. 실제 유사 JS의 조건·계수가 원 기출과 충돌할 경우 이 JS가 배포되는 문제이므로 우선한다.
- 원 기출: `archive/assets/images/25_매산여고_2학기_중간_고2_수학II/q2.png`, `q13.png`, q2·9·13·15(2종)·16(2종)·20·23 해설 SVG. 유사 JS에 직접 연결된 SVG는 `.../25_매산여고_2학기_중간_고2_수학II_유사/q02-problem.svg` 한 개. 기존 legacy `_유사_plans/`의 q02는 공식 capability, q13은 실행 불가 `figureType` 개요다.
- `R=REQUIRED`, `B=BENEFICIAL`, `E=EXEMPT`. `P=STATIC_FIELD_PARITY PASS`, `D=RENDER_NOT_RUN`(production 결과의 `DRAWN_FEATURE_PARITY` **SKIP**, 시각 PASS가 아님). `—`는 별도 plan 면제. 직접 이미지를 참조하지 않는 원 기출 SVG는 제작 기준이 아닌 **버전 비교 증거**다.

| 문항 | 문제 축 판정 | 해설 축 판정 | 원본 SVG | plan 파일 | STATIC_FIELD_PARITY | DRAWN_FEATURE_PARITY | 비고 |
|---|---|---|---|---|---|---|---|
| 01 | E: 약분 가능한 유리식 극한 | E: 약분 후 대입 | — | — | N/A | N/A | 정의역의 구멍은 계산에만 필요. |
| 02 | R: 열린 점과 접근 방향을 그림으로 읽는 문제 | E: 동일 그림의 좌·우극한 합산 | q2-solution.svg(기출), 직접 유사 q02-problem.svg | `q02-problem.plan.json` | P | D | `ORIGINAL_EXAM_PNG_CONFLICT`/`ORIGINAL_EXAM_SVG_VARIANT_CONFLICT`: 기출 `x→0−`는 (0,−1)로 향하지만 유사 (0,2); `x→1+`는 둘 다 (1,−1)로 향함. 현행 JS의 극한 2+(−1)만 기준. 유사 SVG에 흰 전체 `rect`: `ENGINE_CAPABILITY_PENDING:TRANSPARENT_CANVAS_OPTION`. 문제 메타데이터에 합의 답 미기재. |
| 03 | E: x=1 조각식 경계 명시 | E: f(1)과 우극한 동치 | — | — | N/A | N/A | 연속 방정식 한 개로 충분. |
| 04 | E: 조각 직선·지수식 제공 | E: 좌우 곱의 극한 비교 | — | — | N/A | N/A | 해설은 g(1)=0인 조건으로 끝남. |
| 05 | E: 이차함수 미분계수 | E: 도함수 대입 | — | — | N/A | N/A | 접선 그림 불필요. |
| 06 | E: 미분계수 극한 | E: 1/2 f′(5) | — | — | N/A | N/A | 극한 식으로 완결. |
| 07 | E: 두 구간 평균변화율 수치 | E: 변화량 합산 | — | — | N/A | N/A | 실제 함수 개형은 주어지지 않음. |
| 08 | E: 곱함수와 점·기울기 수치 | E: 곱의 미분법 | — | — | N/A | N/A | 임의 곡선 그리기는 정보 추가 위험. |
| 09 | E: 조각 삼차·이차식 | E: 연속·미분 계수 연립 | q9-solution.svg(기출) | — | N/A | N/A | `ORIGINAL_EXAM_SVG_VARIANT_CONFLICT`: 기출 x³−2x/ x²−x−1, 현행 유사는 a=b=5인 다른 조각. 현재 식으로 대수 풀이 가능. |
| 10 | E: 절댓값 극한 | E: x=2 좌·우 부호 분리 | — | — | N/A | N/A | 꺾임의 좌·우극한은 식으로 정확히 결정. |
| 11 | E: 극한 명제의 진위 | E: 대수 반례·성질 | — | — | N/A | N/A | 임의 반례 그림 필요 없음. |
| 12 | E: 다항함수 두 극한 | E: 함수값·미분계수 | — | — | N/A | N/A | 도식이 수치 판단에 무관. |
| 13 | R: 유리곡선·두 수평선·직각삼각형 AHB의 배치가 발문 핵심 | E: 두 교점의 x좌표를 직접 구해 극한 검산 | q13-solution.svg(기출) | **— (엔진 미지원)** | PENDING | NOT_DRAWN | `ORIGINAL_EXAM_PNG_CONFLICT`/`ORIGINAL_EXAM_SVG_VARIANT_CONFLICT`: 기출 √2x/(x−1), 기준 y=2·t>2; 유사는 √3x/(x−1), 기준 y=3·t>3. 직접 유사 `image` 필드 없음(`JS_IMAGE_REFERENCE_MISSING`). 공식 Shallow에서 `UNSUPPORTED_RATIONAL_NUMERATOR_GRAMMAR` 및 `RATIONAL_SOURCE_DOMAIN_REQUIRES_ALL_REALS` 거절 확인; `ENGINE_CAPABILITY_PENDING:RATIONAL_IRRATIONAL_COEFFICIENT_RESTRICTED_DOMAIN_AND_HORIZONTAL_LEVELS`. 근사하지 않음. |
| 14 | E: 무리식 무한대 극한 | E: 최고차항 상쇄·유리화 | — | — | N/A | N/A | 수식만으로 정확히 검증 가능. |
| 15 | E: 유리함수와 수평선의 교점 개수 식으로 지정 | B: 치역에서 빠진 높이의 점근선 관계 | q15-solution.svg, -v2.svg(기출) | `q15-solution.plan.json` | P | D | `ORIGINAL_EXAM_SVG_VARIANT_CONFLICT`: 기출 t=3에서 개수 변화, 현행 유사는 `(4x+1)/(x+2)`에 따른 t=4. 해설축에서만 y=4 점근선을 강조. |
| 16 | E: 절댓값 일차식과 y=mx 명시 | E: 두 직선 부분의 교점 조건 부등식 | q16-solution.svg, -v2.svg(기출) | — | N/A | N/A | `ORIGINAL_EXAM_SVG_VARIANT_CONFLICT`: 기출 불연속 경계 m=2,4, 유사 경계 m=3,5. 임의 대표 그림 없이 구간별 식으로 계산. |
| 17 | E: x=1에서 좌·우 유리식 주어짐 | E: 발산항의 소거 차수 계산 | — | — | N/A | N/A | 점근선 그림보다 식의 극한이 결정적. |
| 18 | E: f·g의 단절점 정의 | E: 인수·접선 중복근 | — | — | N/A | N/A | 함수식과 f(2), f′(2) 조건으로 충분. |
| 19 | E: 도함수 대칭식 | E: 삼차 계수 비교 | — | — | N/A | N/A | 수식만으로 최종 함수 결정. |
| 20 | E: 세 조각 식·x=1,2 경계 명시 | E: 평균변화율의 세 구간 해 | q20-solution.svg(기출) | — | N/A | N/A | `ORIGINAL_EXAM_SVG_VARIANT_CONFLICT`: 기출 해설의 a=−3/2·좌표 집합과 유사 해설의 a=−8/3은 다름. 조각 경계는 공식 JS 부등식 그대로 계산. |
| 21 | E: 다항함수 무한대·유한 극한 | E: 미정계수 비교 | — | — | N/A | N/A | 도식 불필요. |
| 22 | E: 사차함수와 두 도함수 조건 | E: 계수 연립 | — | — | N/A | N/A | 그래프 개형을 가정하지 않음. |
| 23 | E: 조각 단조·역함수 조건을 식으로 명시 | E: 감소·대응점과 계수 계산 | q23-solution.svg(기출) | — | N/A | N/A | `ORIGINAL_EXAM_SVG_VARIANT_CONFLICT`: 기출의 0↔3·2 고정점과 현행 유사 f(−1)=2, f(1)=1, f(2)=−1은 서로 다른 버전. 반사된 곡선을 임의로 만들지 않고 단조·역함수 관계로 계산. |

### 집계·미지원·검증

- **23문항 × 2 = 46축**, 문제축 `REQUIRED 2 / BENEFICIAL 0 / EXEMPT 21`, 해설축 `REQUIRED 0 / BENEFICIAL 1 / EXEMPT 22`. 총 `R 2 + B 1 + E 43 = 46`. 문항 13의 R 1축만 엔진 미지원으로 plan 없음.
- 공식 신규 plan 2개. `JSON/Shallow/Full 각각 PASS 2/2, FAIL 0, SKIP 0`; `STATIC_FIELD_PARITY 2 PASS, 1 PENDING(필수 문제축 q13)`; `DRAWN_FEATURE_PARITY 0 시각 PASS / 2 SKIP(RENDER_NOT_RUN), q13 NOT_DRAWN`.
- 수학 독립 검산: Q02 유사 좌극한 `2`, 우극한 `−1`(합은 문제축 메타데이터에서 숨김); Q13 `x_s=s/(s−√3)`, `lim_{t→3+} AH/BH=(3−√3)^2/√3=4√3−6`(기출 √2/2와 별도); Q15 `4−7/(x+2)`의 치역은 `ℝ\{4}`; Q16 y=3x+4 (x<1), y=5x+2 (x≥1)의 경계 기울기 3,5. 이 수치는 해설 검산에만 사용.
- `/usr/bin/chromium --version`을 새로 실행하였으나 `/usr/lib/chromium/chromium` 실행 파일이 없어 exit 127. 공식 production SVG 실제 렌더·눈금/글자 겹침·투명 캔버스 시각 비교 **미실행(`RENDER_NOT_RUN`)**. lint PASS는 시각 PASS가 아니다.
- 불필요한 흰 배경은 직접 연결된 q02 유사 SVG에서 확인. `ENGINE_CAPABILITY_PENDING:TRANSPARENT_CANVAS_OPTION`; 다른 무관 문항에 확장하지 않음. 엔진 미지원 rational+√3+정의역 제한을 rational 근사 또는 임의 SVG로 대체하지 않음.
