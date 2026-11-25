# 백발백중 공통수학2 Best2회 P14–17 20261022 유사50 — 문제·해설 2축 감사

- 원문: `archive/exams/textbooks/백발백중_공통수학2/백발백중_공통수학2_Best2회_P14-17_20261022_유사50.js`
- 원문 Git blob: `e0acc47d776cc1f15fe4c761f49146f76c96e13f` (작업 기준 main: `a9a7637c3de2cf2e3665d6c6ee45bfc9259fc127`).
- 범위: **배열 순서 q01–q22, 22문항·44축**. q23–q50은 이번 묶음 미처리. q번호는 배열 순서이고 실제 `id`는 아래 표에 보존한다.
- 새 실행 plan **9개**: 문제축 q10–q12 3개, 해설축 q16–q21 6개. `construction-spike-v1` / `SOURCE_COORDINATE_AXES_v1` 기반 JSON이며 손 SVG 및 면 채움 없음. `plan-lint.cjs` **shallow 9/9 PASS, full 9/9 PASS** (실제 렌더·학생화면·인쇄 검사는 NOT_RUN).
- **기존 SVG 19축**: 문제축 q07–q09 3개, 해설축 q01–q15 및 q22 16개. 이미 JS의 `image`/`solutionImage`가 연결되어 있어서 새 plan으로 중복 생산하지 않았다. 기존 SVG는 이 변경의 plan-lint 및 신규 `DRAWN_FEATURE_PARITY` 분자에 포함하지 않는다.
- **EXEMPT 16축**: q01–q06·q13–q15·q16–q22의 문제축. 각 축별 이유는 표 참조.
- 기존 문제 SVG q07–q09의 실체를 Git에서 확인했다. q07의 기존 SVG는 미지수를 문자 `a`로 유지하고 C에서 직각이라는 조건을 표시하지만, 배경 흰 사각형 외에 삼각형 폴리곤에 **기존 채움색**이 있다. 이는 이번 신규 plan과 별개의 **LEGACY_EXISTING_SVG_FILL**이고 원본 이미지·JS는 수정하지 않았다. 나머지 기존 이미지의 실제 시각품질과 문제답 노출 여부는 전체 렌더 검사를 수행하지 않았으므로 PASS로 과장하지 않는다.

| 배열 q | 원문 `id` | 문제축 판정과 이유 | 해설축 판정과 이유 |
| --- | --- | --- | --- |
| q01 | `BV-BAKBAL-H-COM2-P14-Q01-T1-R2` | EXEMPT — O,A,B 좌표만으로 둘레 구하기 조건 완결 | BENEFICIAL · EXISTING_SVG — 세 변 길이·둘레 그림 `…Q01-T1-R2-solution.svg` |
| q02 | `BV-BAKBAL-H-COM2-P14-Q01-S1-R1` | EXEMPT — 삼각형의 세 좌표·거리 공식만 필요 | BENEFICIAL · EXISTING_SVG — 삼각형 길이 `…Q01-S1-R1-solution.svg` |
| q03 | `BV-BAKBAL-H-COM2-P14-Q01-S2-R2` | EXEMPT — 좌표와 둘레 질문 자체로 완결 | BENEFICIAL · EXISTING_SVG — 변 길이 `…Q01-S2-R2-solution.svg` |
| q04 | `BV-BAKBAL-H-COM2-P14-Q02-T1-R1` | EXEMPT — 직선 위 미지점 P의 해답 위치 선표시 방지 | BENEFICIAL · EXISTING_SVG — 등거리 조건 `…Q02-T1-R1-solution.svg` |
| q05 | `BV-BAKBAL-H-COM2-P14-Q02-S1-R1` | EXEMPT — 직선·등거리 식만으로 답 도출 | BENEFICIAL · EXISTING_SVG — 등거리 위치 `…Q02-S1-R1-solution.svg` |
| q06 | `BV-BAKBAL-H-COM2-P14-Q02-S2-R1` | EXEMPT — 등거리점의 결정 좌표를 문제축에서 숨김 | BENEFICIAL · EXISTING_SVG — 등거리 조건 `…Q02-S2-R1-solution.svg` |
| q07 | `BV-BAKBAL-H-COM2-P14-Q03-T1-R1` | REQUIRED · EXISTING_SVG — C 직각과 미지 `a`만 표기, 기존 채움색 주의 | BENEFICIAL · EXISTING_SVG — 직각삼각형 계산 `…Q03-T1-R1-solution.svg` |
| q08 | `BV-BAKBAL-H-COM2-P14-Q03-S1-R1` | REQUIRED · EXISTING_SVG — C 직각인 문제 도형 연결 | BENEFICIAL · EXISTING_SVG — 좌표와 수직 조건 `…Q03-S1-R1-solution.svg` |
| q09 | `BV-BAKBAL-H-COM2-P14-Q03-S2-R1` | REQUIRED · EXISTING_SVG — 미지수는 문자로 남긴 직각 문제 도형 | BENEFICIAL · EXISTING_SVG — 직각 조건 계산 `…Q03-S2-R1-solution.svg` |
| q10 | `BV-BAKBAL-H-COM2-P14-Q04-T1-R2` | BENEFICIAL · NEW_PLAN `q10-problem.plan.json` — AC 위 P 가변 범위·거리만 표시, 최소점/최솟값 비노출 | BENEFICIAL · EXISTING_SVG — 최소 제곱합 해설 `…Q04-T1-R2-solution.svg` |
| q11 | `BV-BAKBAL-H-COM2-P14-Q04-S1-R2` | BENEFICIAL · NEW_PLAN `q11-problem.plan.json` — 이동점의 임의 예시만 | BENEFICIAL · EXISTING_SVG — 최소 제곱합 해설 `…Q04-S1-R2-solution.svg` |
| q12 | `BV-BAKBAL-H-COM2-P14-Q04-S2-R2` | BENEFICIAL · NEW_PLAN `q12-problem.plan.json` — 선분 AC 안에서 P 이동 표시 | BENEFICIAL · EXISTING_SVG — 최소 제곱합 해설 `…Q04-S2-R2-solution.svg` |
| q13 | `BV-BAKBAL-H-COM2-P14-Q05-T1-R2` | EXEMPT — 내분비 5:3과 두 끝점 좌표가 수식으로 충분 | BENEFICIAL · EXISTING_SVG — 내분점 P와 중점 M `…Q05-T1-R2-solution.svg` |
| q14 | `BV-BAKBAL-H-COM2-P14-Q05-S1-R2` | EXEMPT — 내분비 3:1과 좌표만으로 조건 완결 | BENEFICIAL · EXISTING_SVG — P·M의 거리 `…Q05-S1-R2-solution.svg` |
| q15 | `BV-BAKBAL-H-COM2-P14-Q05-S2-R2` | EXEMPT — 내분비 1:3과 좌표만으로 조건 완결 | BENEFICIAL · EXISTING_SVG — 내분점·중점 `…Q05-S2-R2-solution.svg` |
| q16 | `BV-BAKBAL-H-COM2-P15-Q06-T1-R2` | EXEMPT — 미지 꼭짓점 A의 결과를 보이지 않음 | BENEFICIAL · NEW_PLAN `q16-solution.plan.json` — G,H의 다른 무게중심 중선 관계 |
| q17 | `BV-BAKBAL-H-COM2-P15-Q06-S1-R2` | EXEMPT — A가 미지인 중첩 무게중심 계산식 | BENEFICIAL · NEW_PLAN `q17-solution.plan.json` — G,H,A 역산·공유 중선 |
| q18 | `BV-BAKBAL-H-COM2-P15-Q06-S2-R2` | EXEMPT — 미지 A와 두 단계 무게중심의 식이 핵심 | BENEFICIAL · NEW_PLAN `q18-solution.plan.json` — G,H를 다른 좌표로 분리 |
| q19 | `BV-BAKBAL-H-COM2-P15-Q07-T1-R2` | EXEMPT — a,b 해답 좌표 노출 없이 평행사변형 조건만 제공 | BENEFICIAL · NEW_PLAN `q19-solution.plan.json` — 대각선의 공통 중점 |
| q20 | `BV-BAKBAL-H-COM2-P15-Q07-S1-R2` | EXEMPT — C,D의 미지 좌표를 발문에서 유지 | BENEFICIAL · NEW_PLAN `q20-solution.plan.json` — 평행사변형 대각선 이등분 |
| q21 | `BV-BAKBAL-H-COM2-P15-Q07-S2-R2` | EXEMPT — a,b를 먼저 계산하는 문제가 핵심 | BENEFICIAL · NEW_PLAN `q21-solution.plan.json` — 대각선 이등분의 좌표 검증 |
| q22 | `BV-BAKBAL-H-COM2-P15-Q08-T1-R3` | EXEMPT — D가 BC에서 미정인 각의 이등분선 조건; 문제에 결정된 내분점 좌표 비노출 | BENEFICIAL · EXISTING_SVG — 각의 이등분선/내분점 `…Q08-T1-R3-solution.svg` |

## 신규 계획 9개: DRAWN_FEATURE_PARITY (원문 vs 실제 구성 필드)

각 항목은 `mathPlan.nodes`의 원문 좌표·유도점, `displaySegments`의 선분, `displayPoints`/`coordinateLabels`의 라벨, `sourceConditions[].mappedTo`의 연결을 확인했다. 이 9문항의 원문은 도형의 **각 수치/직각 표식/채움 면/비율선 표기**를 추가로 요구하지 않는다. 해설용 도식에 없던 각·직각·면을 임의로 덧붙이지 않았다. `axisTickValues`는 모두 빈 배열. 단위는 좌표평면 실제 수치이다.

| plan | 원문/해설 좌표 ↔ 생성 노드 | 실제 그려지는 요소 (선분·라벨 등) | 누락·노출·기능 판정 |
| --- | --- | --- | --- |
| `q10-problem` | A(0,-3), B(6,1), C(0,5) `SOURCE_POINT`; P(0,2)는 선분 AC 위 임의 예시 | AP,PC 실선+BP 점선; A,B,C 좌표 라벨, P 점 표시(해답좌표 라벨 없음) | PASS — 원문 P∈AC·제곱거리 관계; 최솟값 44나 최소점 y=-1 비노출. 비율·각·직각 없음 |
| `q11-problem` | A(1,-5), B(5,3), C(1,7); P(1,1)는 임의 예시 | AP,PC 실선+BP 점선; A,B,C 좌표 라벨, P 점만 | PASS — P 이동 조건, 최솟값 48 및 최소점 y=-1 비노출. 비율·각 없음 |
| `q12-problem` | A(-4,0), B(2,5), C(6,0); P(2,0)는 임의 예시 | AP,PC 실선+BP 점선; A,B,C 좌표 라벨, P 점만 | PASS — P∈AC, 최솟값 43 및 최소점 x=-1 비노출. 비율·각 없음 |
| `q16-solution` | 주어진 B(1,2), C(-2,4), H(0,3); 유도 G(1,3), A(4,3), M=(-1/2,3), `CENTROID` 재검산 2개 | 삼각형 AB,BC,CA; 중선 AM·GB·GC 점선; A,B,C,G,H 좌표 라벨, M 이름 숨김 | PASS — ABC의 G와 GBC의 H를 다른 점으로 구분; 원문 두 무게중심 관계 표시. 비율은 라벨 대신 유도식으로 반영 |
| `q17-solution` | B(4,-1), C(-2,3), H(1,2); 유도 G(1,4), A(1,10), M(1,1), `CENTROID` 재검산 | AB,BC,CA; AM·GB·GC 점선; A,B,C,G,H 좌표 라벨, M 이름 숨김 | PASS — G,H가 다른 위치에 존재, 원문 조건 충족. 각·직각 없음 |
| `q18-solution` | B(-1,2), C(2,-2), H(1,0); 유도 G(2,0), A(5,0), M(1/2,0), `CENTROID` 재검산 | AB,BC,CA; AM·GB·GC 점선; A,B,C,G,H 좌표 라벨, M 이름 숨김 | PASS — 공유 밑변 BC와 두 중첩 중선, 원문 좌표 일치 |
| `q19-solution` | A(2,4), B(-1,2) 주어짐, C(-3,-1)에서 a=-1, D(0,1)에서 b=0; `MIDPOINT` X=Y=(-1/2,3/2) | AB,BC,CD,DA 실선; AC,BD 점선; A,B,C,D,X 좌표 라벨 | PASS — A+C=B+D, 대각선의 공통 중점 정확; 원문 미지 좌표 해설축에만 공개. 각·직각·비율 없음 |
| `q20-solution` | A(-2,3), B(1,-1); 유도 C(4,1), D(1,5), a=b=1; X=Y=(1,2) | 사변 4개, 대각선 2개; A,B,C,D,X 좌표 라벨 | PASS — 대각선 교점·해설 a+b=2 일치 |
| `q21-solution` | A(3,-2), B(0,4); 유도 C(-4,1), D(-1,-5), a=-4, b=-5; X=Y=(-1/2,-1/2) | 사변 4개, 대각선 2개; A,B,C,D,X 좌표 라벨 | PASS — 공통 중점·a+b=-9 일치 |

신규 **9/9 DRAWN_FEATURE_PARITY=PASS**, **ENGINE_CAPABILITY_PENDING=0**. 엔진이 지원하는 구성(`SOURCE_POINT`, `TRANSLATE_POINT`, `CENTROID`, `MIDPOINT`, 선분/라벨)을 사용했으며 실제 렌더 영상·A4/브라우저 시각 QA를 실시했다는 뜻은 아니다. 기존 SVG 19축의 plan-lint 및 신규 plan parity는 **N/A / NOT_RUN**, EXEMPT 16축은 사유만 기록한다.
