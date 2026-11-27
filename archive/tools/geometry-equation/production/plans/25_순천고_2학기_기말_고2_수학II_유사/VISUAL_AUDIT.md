# DRAWN_FEATURE_PARITY · 문제/해설 2축 감사 — 25_순천고_2학기_기말_고2_수학II_유사

- 재감사 기준 `origin/main`: `e14c8ed3e07da646f4cdcc20faf9a40e9761623b` (2026-11-28 KST, 병합 전 조회)
- 대상 JS blob: `b3401d873cb34eedd2965872de53aef4a2e53178` (수정 없음)
- 범위: **24문항 × 문제/해설 2축 = 48축**, production 실행형 plan **20개** (문제 2, 해설 18)
- 원본 JS에 연결된 기존 SVG: **19개** (문제 2, 해설 17) — 자산 경로/파일 존재와 SVG 구조·배경 확인
- JSON 파싱·필수 필드·`sourceConditions[].mappedTo` 경로 검사 **20/20 PASS**; 공식 `plan-lint.cjs --shallow` **20/20 PASS**, full **20/20 PASS** (FAIL/SKIP 0). 기존 20개 보존·수정 0·신규 0.
- 새 production 렌더·실제 SVG/PNG·학생 화면·A4: **RENDER_NOT_RUN** (`/usr/bin/chromium` 실행 시 `/usr/lib/chromium/chromium: not found`). `STATIC_FIELD_PARITY=PASS`는 **실제 그린 결과의 DRAWN_FEATURE_PARITY=PASS가 아님**.

| 문항 | 문제 축 판정 | 해설 축 판정 | 원본 SVG | plan 파일 | STATIC_FIELD_PARITY | DRAWN_FEATURE_PARITY | 비고 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 01 | EXEMPT — 위치함수·시간범위가 식으로 완결 | BENEFICIAL — v=3(t−5)(t+1) 부호 | `q01-solution.svg` | `q01-solution.plan.json` | PASS | RENDER_NOT_RUN | t=5 방향 전환 |
| 02 | EXEMPT — 속도식·출발높이가 완결 | BENEFICIAL — v=36−4t | `q02-solution.svg` | `q02-solution.plan.json` | PASS | RENDER_NOT_RUN | t=9 영점 |
| 03 | EXEMPT — 원시함수·적분상수 계산 | EXEMPT — 항등식·대입으로 설명 완결 | 없음 | 없음 | N/A | N/A | 도식이 계산을 중복 |
| 04 | EXEMPT — 증가 조건과 함수식 제시 | BENEFICIAL — 도함수 최소값 | `q04-solution.svg` | `q04-solution.plan.json` | PASS | RENDER_NOT_RUN | x=1에서 3x²+6x=9 |
| 05 | EXEMPT — 두 경계 식이 명시 | BENEFICIAL — 교점·면적 | `q05-solution.svg` | `q05-solution.plan.json` | PASS | RENDER_NOT_RUN | x=0,4, 곡선 위·직선 아래 |
| 06 | EXEMPT — 운동 높이식 제시 | BENEFICIAL — 포물선 꼭짓점 | `q06-solution.svg` | `q06-solution.plan.json` | PASS | RENDER_NOT_RUN | t=4, 높이 80 |
| 07 | REQUIRED — 도함수 삼차 그래프가 발문 정보 | EXEMPT — 기존 문제 그림의 부호 판독으로 충분 | `q07.svg` | `q07-problem.plan.json` | PASS (유사 JS) | RENDER_NOT_RUN | **ORIGINAL_EXAM_PNG_CONFLICT**: 기출 q07.png 영점 1·2·3, 유사 −2·0·2 |
| 08 | EXEMPT — 절댓값 적분식·구간 완결 | BENEFICIAL — 양·음 넓이 분할 | `q08-solution.svg` | `q08-solution.plan.json` | PASS | RENDER_NOT_RUN | 영점 0,2 및 구간 [−1,0], [0,2] |
| 09 | EXEMPT — 적분상수 식 문제 | EXEMPT — 대수 치환으로 완결 | 없음 | 없음 | N/A | N/A | 시각자료 중복 |
| 10 | EXEMPT — 접선 기울기·점 제시 | EXEMPT — 원시함수 대입으로 완결 | 없음 | 없음 | N/A | N/A | 시각자료 중복 |
| 11 | EXEMPT — 다항식·닫힌구간 완결 | BENEFICIAL — 끝점·극점 비교 | `q11-solution.svg` | `q11-solution.plan.json` | PASS | RENDER_NOT_RUN | x=−2,−1,3,4 비교 |
| 12 | EXEMPT — 포물선·넓이 조건 수치 완결 | BENEFICIAL — x축 아래 면적 | `q12-solution.svg` | `q12-solution.plan.json` | PASS | RENDER_NOT_RUN | a=−9, 두 근 −1·3, 넓이 32 |
| 13 | EXEMPT — 조각함수 식·구간 명시 | BENEFICIAL — 부호별 영역 분리 | `q13-solution.svg` | `q13-solution.plan.json` | PASS | RENDER_NOT_RUN | 분할점 −3,0,1,3 |
| 14 | EXEMPT — 이동·대칭 조건 문장 명시 | BENEFICIAL — 두 곡선 교점·면적 | `q14-solution.svg` | `q14-solution.plan.json` | PASS | RENDER_NOT_RUN | 두 포물선 경계의 넓이 |
| 15 | EXEMPT — 주기·식·구간 명시 | BENEFICIAL — 주기 반복 적분 | `q15-solution.svg` | `q15-solution.plan.json` | PASS | RENDER_NOT_RUN | 주기 3, 적분 0~20 |
| 16 | REQUIRED — P·H·O·A와 수선 관계가 문제 조건 | BENEFICIAL — S(t) 극값·삼각형 관계 | `q16.svg`, `q16-solution.svg` | `q16-problem.plan.json`, `q16-solution.plan.json` | PASS (유사 JS) | RENDER_NOT_RUN | **ORIGINAL_EXAM_PNG_CONFLICT**: 기출 q16.png의 접점 A·원점 곡선과 달리 유사 f=x²(4−x), A=(4,0); 학생 화면 P–H 높이 점검 필요 |
| 17 | EXEMPT — g′=(x−1)f′ 조건식 | BENEFICIAL — 도함수 영점·부호 | `q17-solution.svg` | `q17-solution.plan.json` | PASS | RENDER_NOT_RUN | g′의 영점 −2,1 |
| 18 | EXEMPT — 적분·극한 연립식 | EXEMPT — 미분·연립 계산으로 완결 | 없음 | 없음 | N/A | N/A | 시각자료 중복 |
| 19 | EXEMPT — 역함수·직선 식이 명시 | BENEFICIAL — 역함수·직선으로 닫힌 영역 | 없음 | 없음 | ENGINE_CAPABILITY_PENDING | NOT_RUN | `ENGINE_CAPABILITY_PENDING:MULTI_CURVE_INVERSE_CUBIC` |
| 20 | EXEMPT — 도함수 조건·절댓값 방정식 | BENEFICIAL — 극값과 4교점 | 현행 연결 없음 | `q20-solution.plan.json` | PASS | RENDER_NOT_RUN | 극값 ±16, 수평선 y=±16 |
| 21 | EXEMPT — 속도함수·원점 출발 조건 | BENEFICIAL — 속도·위치 2패널 | `q21-solution.svg` | `q21-solution.plan.json` | PASS | RENDER_NOT_RUN | 속도 영점 2·4, s(2)=4·s(4)=0·s(6)=36 |
| 22 | EXEMPT — 주어진 (가)(나)(다) 조건 | BENEFICIAL — 이차함수 꼭짓점 | `q22-solution.svg` | `q22-solution.plan.json` | PASS | RENDER_NOT_RUN | g′ 최댓값 검토 |
| 23 | EXEMPT — 도함수의 두 근 명시 | BENEFICIAL — f′ 부호·극값 | `q23-solution.svg` | `q23-solution.plan.json` | PASS (유사 JS) | RENDER_NOT_RUN | **ORIGINAL_EXAM_PNG_CONFLICT**: 기출 q23.png 영점 0·2, 유사 −1·3 |
| 24 | EXEMPT — 학생이 스스로 개형 작도 | REQUIRED — 해설의 실제 f 그래프 | `q24-solution.svg` | `q24-solution.plan.json` | PASS | RENDER_NOT_RUN | f=x³−3x²+4, 극값 (0,4)·(2,0), 영점 −1 |

## 원문·원본 SVG와 실행 필드의 결함 대조

- **모든 문항**을 최신 JS의 `content`·`solution`·정답 및 연결된 `image`/`solutionImage`와 기존 `_plans`의 기하 조건으로 대조했다. 그래프 곡선식·정의역·교점·구간·면적·라벨의 필드 존재는 별도로 점검했다. 새 plan에는 기존 SVG 자산 경로나 과거 렌더 증거를 복제하지 않았다.
- **원 기출 PNG 대조**: q07·q16·q23은 원 기출 PNG의 영점·곡선 형상·계수가 현행 유사 JS 및 연결 SVG와 다르다. 이를 `ORIGINAL_EXAM_PNG_CONFLICT`로 기록했으며, 현재 학생이 푸는 **유사 JS** 조건이 정본이다. 원 기출의 수치·영점을 production plan으로 되돌리지 않는다. 원본 PNG 확인은 신규 plan 렌더나 실물 parity를 의미하지 않는다.
- **기존 SVG에서 흰 배경**: 19개 연결 자산 중 18개 (`<rect fill="#fff">`) 확인. 현재 plan capability 다수가 자체 캔버스 배경을 그리므로 **`ENGINE_CAPABILITY_PENDING:TRANSPARENT_CANVAS_OPTION`**. SVG 문자열 직접 편집 금지, 엔진 공통 opt-out 확장 필요.
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
