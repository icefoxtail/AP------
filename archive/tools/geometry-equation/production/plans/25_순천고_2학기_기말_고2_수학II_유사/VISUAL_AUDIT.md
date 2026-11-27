# DRAWN_FEATURE_PARITY · 문제/해설 2축 감사 — 25_순천고_2학기_기말_고2_수학II_유사

- 기준 `origin/main`: `9c42437326d026f3a928f182515cb8aa3f440ab8`
- 대상 JS blob: `b3401d873cb34eedd2965872de53aef4a2e53178` (수정 없음)
- 범위: **24문항 × 문제/해설 2축 = 48축**, production 실행형 plan **20개** (문제 2, 해설 18)
- 원본 JS에 연결된 기존 SVG: **19개** (문제 2, 해설 17) — 자산 경로/파일 존재와 SVG 구조·배경 확인
- `plan-lint.cjs --shallow`: **20/20 PASS**; full: **20/20 PASS**, FAIL/SKIP 0
- 신규 렌더·PNG·학생 화면·A4: **RENDER_NOT_RUN** (필수 Chrome 바이너리 없음). 아래 `STATIC_FIELD_PARITY=REVIEWED`는 **실제 그린 결과의 DRAWN_FEATURE_PARITY=PASS가 아님**.

| QID | 문제축(독립 판정·사유) | 해설축(독립 판정·사유) | 엔진 plan JSON | JS 연결 SVG | STATIC_FIELD_PARITY / DRAWN_FEATURE_PARITY |
| --- | --- | --- | --- | --- | --- |
| 01 | EXEMPT — 위치 함수와 시간 범위가 식으로 완결 | BENEFICIAL — 속도 v=3(t−5)(t+1)의 부호가 t=5에서 전환 | `q01-solution.plan.json` | S | REVIEWED / RENDER_NOT_RUN |
| 02 | EXEMPT — 속도식과 출발높이 조건이 수치로 완결 | BENEFICIAL — v=36−4t의 t=9 영점과 전후 방향 | `q02-solution.plan.json` | S | REVIEWED / RENDER_NOT_RUN |
| 03 | EXEMPT — 원시함수·적분상수 계산 문항 | EXEMPT — 적분 항등식과 대입 계산, 독립 도식 중복 | — | — | EXEMPT / N/A |
| 04 | EXEMPT — 단조 조건과 함수식이 주어짐 | BENEFICIAL — y=3x²+6x의 x=1 최솟값 9, 매개변수 a의 경계 | `q04-solution.plan.json` | S | REVIEWED / RENDER_NOT_RUN |
| 05 | EXEMPT — 두 경계 곡선의 식만으로 문제 성립 | BENEFICIAL — 교점 x=0,4 및 두 그래프 사이 넓이 | `q05-solution.plan.json` | S | REVIEWED / RENDER_NOT_RUN |
| 06 | EXEMPT — 높이식과 상승 조건이 주어짐 | BENEFICIAL — 포물선 높이의 꼭짓점 t=4, 높이 80 | `q06-solution.plan.json` | S | REVIEWED / RENDER_NOT_RUN |
| 07 | REQUIRED — 발문에 f′(x)의 삼차 그래프 자체가 필요 | EXEMPT — 문제 그래프의 4구간 부호 설명으로 충분, 중복 도식 불필요 | `q07-problem.plan.json` | P | REVIEWED / RENDER_NOT_RUN |
| 08 | EXEMPT — 절댓값 적분과 구간이 식으로 완결 | BENEFICIAL — 영점 0,2 및 부호별 넓이의 분리 | `q08-solution.plan.json` | S | REVIEWED / RENDER_NOT_RUN |
| 09 | EXEMPT — 적분방정식만 다루는 계산 문제 | EXEMPT — 정적분 상수 I를 치환하는 대수 전개 | — | — | EXEMPT / N/A |
| 10 | EXEMPT — 기울기식과 지나는 점이 주어짐 | EXEMPT — 도함수 적분과 적분상수 결정으로 완결 | — | — | EXEMPT / N/A |
| 11 | EXEMPT — 닫힌구간과 다항함수 식이 주어짐 | BENEFICIAL — f(x)−a의 국소극값 x=−1,3 비교 | `q11-solution.plan.json` | S | REVIEWED / RENDER_NOT_RUN |
| 12 | EXEMPT — 이차곡선 식·넓이 조건이 수치로 명시 | BENEFICIAL — a=−9일 때 근 −1,3 및 x축 아래 넓이 32 | `q12-solution.plan.json` | S | REVIEWED / RENDER_NOT_RUN |
| 13 | EXEMPT — 조각함수 식과 구간이 주어짐 | BENEFICIAL — 부호 교체점 −3,1,3을 기준으로 면적 분할 | `q13-solution.plan.json` | S | REVIEWED / RENDER_NOT_RUN |
| 14 | EXEMPT — 대칭·평행이동의 함수 변환을 문장으로 명시 | BENEFICIAL — 원래·이동 포물선의 교점과 내부 넓이 | `q14-solution.plan.json` | S | REVIEWED / RENDER_NOT_RUN |
| 15 | EXEMPT — 주기 3과 정의구간을 수식으로 제시 | BENEFICIAL — 한 주기 그래프 반복과 적분 면적 | `q15-solution.plan.json` | S | REVIEWED / RENDER_NOT_RUN |
| 16 | REQUIRED — P(t,f(t)), H, O, A, PH 수선이 발문 핵심 그림 | BENEFICIAL — 곡선·수선·삼각형 넓이 S(t)의 극값과 관계 | `q16-problem.plan.json`, `q16-solution.plan.json` | P+S | REVIEWED / RENDER_NOT_RUN |
| 17 | EXEMPT — g′=(x−1)f′ 관계와 극값 조건이 수식 | BENEFICIAL — g′의 영점 −2,1 및 부호 변화 | `q17-solution.plan.json` | S | REVIEWED / RENDER_NOT_RUN |
| 18 | EXEMPT — 적분과 극한 연립 조건만으로 성립 | EXEMPT — 적분함수의 미분과 연립식 계산 | — | — | EXEMPT / N/A |
| 19 | EXEMPT — f와 역함수·직선의 식이 명시 | ENGINE_CAPABILITY_PENDING — 삼차 역함수 g, 대칭선 y=x, 직선 y=−x−2의 둘러싸인 영역 | — | — | ENGINE_CAPABILITY_PENDING / NOT_RUN |
| 20 | EXEMPT — f′ 조건과 절댓값 방정식이 명시 | BENEFICIAL — h(x)의 극대 16·극소 −16과 y=±16이 만드는 네 교점 | `q20-solution.plan.json` | — | REVIEWED / RENDER_NOT_RUN |
| 21 | EXEMPT — 속도함수와 초기 위치가 수식으로 주어짐 | BENEFICIAL — v(t)와 s(t) 두 패널의 방향 변화와 이동거리 | `q21-solution.plan.json` | S | REVIEWED / RENDER_NOT_RUN |
| 22 | EXEMPT — 조건 (가)(나)(다)가 수식으로 주어짐 | BENEFICIAL — g′ 최댓값 유도에 쓰는 이차함수 꼭짓점 | `q22-solution.plan.json` | S | REVIEWED / RENDER_NOT_RUN |
| 23 | EXEMPT — 삼차함수의 도함수 영점이 주어짐 | BENEFICIAL — f′(x)=3(x+1)(x−3)의 부호와 양 근 | `q23-solution.plan.json` | S | REVIEWED / RENDER_NOT_RUN |
| 24 | EXEMPT — 서술형에서 학생이 f의 그래프를 직접 그리도록 요구 | REQUIRED — f(x) 그래프의 (−1,0), (0,4), (2,0)과 접선·극값; 기존 도함수 중심 플랜 수정 | `q24-solution.plan.json` | S | REVIEWED / RENDER_NOT_RUN |

## 원문·원본 SVG와 실행 필드의 결함 대조

- **모든 문항**을 최신 JS의 `content`·`solution`·정답 및 연결된 `image`/`solutionImage`와 기존 `_plans`의 기하 조건으로 대조했다. 그래프 곡선식·정의역·교점·구간·면적·라벨의 필드 존재는 별도로 점검했다. 새 plan에는 기존 SVG 자산 경로나 과거 렌더 증거를 복제하지 않았다.
- **기존 SVG에서 흰 배경**: 19개 연결 자산 중 18개 (`<rect fill="#fff">`) 확인. 현재 plan capability 다수가 자체 캔버스 배경을 그리므로 `TRANSPARENT_CANVAS_OPTION`은 **ENGINE_CAPABILITY_PENDING**. SVG 문자열 직접 편집 금지, 엔진 공통 opt-out 확장 필요.
- **필드 점검**: 필요 없는 일반 다각형 면 채움을 추가하지 않았다. 단, 적분 넓이·확률밀도·삼각형 면적 자체를 묻는 문항은 의미 있는 `regions`·`overlays.polygons` 채움을 유지한다. 계산형의 문제축 EXEMPT는 그림 분실/실패가 아니라 축별 사유에 따른 판정이다.
- **q16**: 문제축의 P,H,O,A·점 P에서 H로 내린 수선(`overlays.segments[].dashed`)·삼각형 면적 채움을 보존하고, 문제의 미지 최대점 p=3은 문제 그림에 노출하지 않았다.
- **q04/q16 해설 가독성**: 기존 q04의 극단적으로 세로로 긴 그래프는 `axisSqueeze:true`를 사용했다. q16 해설은 P,H가 학생 화면에서 지나치게 작게 보이는 현행 SVG 대신 t=0~4에 초점을 맞춘 창·곡선 표시 구간으로 다시 설계했다. 실제 개선 여부는 공식 렌더 후 반드시 재확인한다.
- **q20**: 과거 `UNSUPPORTED`를 h 삼차곡선과 수평선 y=±16, 각 두 교점으로 교체했다. 실근 개수 4를 결정하는 접점과 서로 다른 교점은 `referenceLines[].intersectionX`로 명시한다.
- **q24**: 기존 해설 플랜이 도함수 f′의 이차 그래프를 제시하던 문제를 바로잡아, 원 발문이 직접 요구하는 f(x)=x³−3x²+4의 극대(0,4)·극소(2,0)·x축 통과(−1,0)로 수정했다.
- **q19 미지원**: 삼차함수 f(x)=2x³−6x²+7x−2의 역함수 그래프와 직선 y=−x−2로 닫힌 비대칭 곡선 영역을 한 좌표계에 그려야 한다. 현행 `multi-curve-figure-v1`의 `inverseOf`는 RATIONAL/LINE/SQRT/단조 이차 가지에 국한되어 일반 삼차 역함수를 지원하지 않는다. `ENGINE_CAPABILITY_PENDING: MULTI_CURVE_INVERSE_CUBIC`와 정확한 면적 경계를 안티그래비티 엔진 라인에 인계한다. 가짜 제작용 JSON은 작성하지 않았다.

## 인계 게이트

1. Chrome/Playwright 실행 환경에서 **전체 20개**를 공식 `render-plan.mjs`로 렌더하고 `RENDER_NOT_RUN`을 실결과로 갱신한다. 현재는 새 SVG/PNG 제작·학생 출고를 주장하지 않는다.
2. SVG/PNG 실물과 원 JS·원본 SVG의 축·점·보조선·면적·좌표·선택적 색을 독립 검수하여 `DRAWN_FEATURE_PARITY`를 축별 판정한다. 특히 문제축 답 누출과 A4/모바일 잘림을 검사한다.
3. `TRANSPARENT_CANVAS_OPTION` 및 필요한 경우 미지원 도형 capability를 엔진 PR로 보강한다. 승인된 렌더를 새 경로에 배치한 뒤에만 JS `image`/`solutionImage` 참조·게시를 갱신한다. 본 PR은 plan/audit 전용이다.
