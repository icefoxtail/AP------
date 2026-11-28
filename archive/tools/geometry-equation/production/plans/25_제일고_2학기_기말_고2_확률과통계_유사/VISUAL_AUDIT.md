# 제일고 고2 2학기 기말 확률과 통계 유사 — 문항·해설 전축 SVG 감사

## 2026-11-28 독립 재검증 — 현행 유사 JS 우선

- 이번 감사 기준 `origin/main`: **`3e0c3da2e39f4acfd526d8a6b51b1a0ad06fc35d`** (원격 재조회). 열린 PR **82개** 전체의 변경 파일 3,459경로 검사 결과, 이 시험지 및 함께 감사한 26_순천고_2mid 유사 JS·두 production plan 폴더 중첩 **0건**.
- 현행 JS: **23문항·23해설 = 문제 23축 + 해설 23축 = 46축**. REQUIRED 0 / BENEFICIAL 5 / EXEMPT 41. 직접 연결 유사 SVG는 해설 q08 한 장, 문제축 SVG는 없다. 레거시 `_plans/` 46축은 현행 공식 렌더 가능 plan 5개와 구분했다.
- 공식 production plan **5개 중 기존 4개 유지·q15-solution 1개 수정·신규 0**. q15 기존 plan은 귤 한 개의 X≥100 오른쪽 꼬리만 보여 주어 실제 문항이 묻는 특등급 개수 Y의 [43,64] 영역이 빠져 있었다. 공식 지원 `composite-panels-v1`의 두 번째 정규근사 패널 N(50,7²), 43≤Y≤64, 표에서 읽은 0.82 음영을 추가했다. 첫 번째 N(80,10²), X≥100, p=0.02 조건도 유지한다.
- JSON 파싱·필수 스키마 **5/5 PASS**, 공식 Shallow/Full lint 각각 **5 PASS·0 FAIL·0 SKIP**, 수치·정의역·경계·음영·라벨·caption·접근성 문구를 JS와 대조한 **STATIC_FIELD_PARITY 5 PASS**. Chrome/Chromium 신규 검사에서 `/usr/bin/chromium --version`이 실제 `/usr/lib/chromium/chromium` 본체 부재로 exit 127: **DRAWN_FEATURE_PARITY PASS 0·FAIL 0·RENDER_NOT_RUN 5**. 학생 화면/A4/실제 엔진 출력의 시각 PASS는 주장하지 않는다.
- **ORIGINAL_EXAM_PNG_CONFLICT:** 원 기출 q08은 P(X≤b)=2/3·P(X≤1)=1/6, a=3·b=2·c=2/3이고, 유사 q08은 P(X≤b)=3/4·P(X≤2)=1/3, a=4·b=3·c=1/2이다. 원본 PNG의 문자 a,b,c 개형만 보고 원본 수치를 적용하지 않는다. 기출 q08/q14/q15/q19/q21 해설 SVG는 현행 유사판의 확률변수·평균·범위·사건이 달라 **ORIGINAL_EXAM_SVG_VARIANT_CONFLICT**이다. 학생에게 실제 제시되는 현행 유사 JS·해설을 제작 기준으로 삼는다.
- 직접 연결된 유사 `q08-solution.svg`에는 전체 흰 `<rect fill="#fff">`가 존재한다. SVG 태그 직접 수정 금지이며 공식 엔진 기본 흰 캔버스의 opt-out 근거도 없으므로 **ENGINE_CAPABILITY_PENDING:TRANSPARENT_CANVAS_OPTION**. `MULTI_CURVE_INVERSE_CUBIC`, `PIECEWISE_POLYNOMIAL_UPPERCASE_FUNCTION_NAME`은 이번 시험지 관련 기능이 아니다.

## 기존 제작 당시 감사 기록 (아래 표는 이번 정정 사항과 함께 해석)

- 이전 감사 기준: `origin/main` **40d9d72bbe8d31dd9c22f4d9838cdc987be6af82** (2026-11-27 작업 중 재조회·fast-forward). 원본 시험지 JS blob: `ceecaee1322d285e656ae6089901c5fbe207ea82`. 최초 조회 `ac9cfd50d`에서 다른 학교 관련 커밋으로 전진했으나 본 두 시험지·plan 경로와는 충돌하지 않았다.
- 대상: `archive/exams/similar/high/h2/2final/25_제일고_2학기_기말_고2_확률과통계_유사.js`. 문항 **23**, 문제 축 **23**, 해설 축 **23**, 총 **46/46축** 조사.
- 해당 JS가 직접 연결한 문제 SVG **0개**, 해설 SVG **1개**(q08). 별도의 레거시 `_plans/` 참조는 총 46축에 있으나 출력 그림의 존재 증거로 삼지 않았다.
- 신규 공식 production plan **5개**: 문제 **0**, 해설 **5**(q08, q14, q15, q19, q21). `REQUIRED` 0축, `BENEFICIAL` 5축, `EXEMPT` 41축.
- `STATIC_FIELD_PARITY=PASS`는 원문·해설의 정규분포 파라미터, 경계, 확률 부등호와 plan **정적 입력의 일치**를 뜻한다. `DRAWN_FEATURE_PARITY=STATIC_MATCH / RENDER_NOT_RUN`는 유일한 기존 SVG q08을 코드·도형 정의 수준으로 대조한 결과이지 실제 엔진 출력의 시각 검증은 아니다. 원본이 없는 4개 plan은 `NO_ORIGINAL / RENDER_NOT_RUN`.

| 문항 | 문제 축 판정 | 해설 축 판정 | 원본 SVG | plan 파일 | STATIC_FIELD_PARITY | DRAWN_FEATURE_PARITY | 비고 |
|---|---|---|---|---|---|---|---|
| 01 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | B(75,p)에서 분산 12, p<1/2 조건의 대수식 계산으로 완결. |
| 02 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 이산·연속확률변수의 보기·판별 개념이며 좌표 도형 필요 없음. |
| 03 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 원문에 점수·평균·표준편차 **수식 표**가 이미 있으며 z점수 비교식이 의미를 완결; 별도 분포도 불필요. |
| 04 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | x=−2,−1,0,1,2의 조각별 확률질량함수는 식으로 정의됨; 합과 기댓값 계산. |
| 05 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | N(35,48)와 표본크기 12의 기댓값/분산 공식만 요구. |
| 06 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 공 6,4,3,2,2의 표본평균 선형 기댓값; 조합 그림이 추가 정보를 주지 않음. |
| 07 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 원문은 표준정규분포표와 P(45≤X̄≤48)=0.4332를 제공, 해설의 표준화·대입이 충분. |
| 08 | EXEMPT: O,(b,c),(a,0)을 글로 지정 | BENEFICIAL: [0,2] 확률 넓이와 두 선분 | `archive/assets/images/25_제일고_2학기_기말_고2_확률과통계_유사/q08-solution.svg` (해설) | `q08-solution.plan.json` | PASS | RENDER_NOT_RUN | a=4,b=3,c=1/2, 기울기 1/6·−1/2, 음영 1/3. `ORIGINAL_EXAM_PNG_CONFLICT` 원기출 a=3,b=2,c=2/3. 유사 SVG 전체 흰 rect는 `ENGINE_CAPABILITY_PENDING:TRANSPARENT_CANVAS_OPTION`. |
| 09 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 3→4 집합 함수의 치역 크기별 경우의 수를 조합식으로 계산. |
| 10 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 이항분포 확률비와 평균 두 식으로 n,p 확정; 막대그래프는 필수 정보 아님. |
| 11 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 무게 합 16봉지의 정규분포 변환과 표준화 수식, 문제 제공 표로 완결. |
| 12 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 신뢰구간 길이 공식의 증감 비교 보기이며 고정 확률 음영 조건 없음. |
| 13 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 신뢰구간 95%→99%의 중심 70·오차한계 계산. 별도 분포도보다 구간 수식이 정확. |
| 14 | EXEMPT | BENEFICIAL | 없음 | `q14-solution.plan.json` | PASS | NO_ORIGINAL / RENDER_NOT_RUN | X의 밀도 대칭조건에서 m=15, 다른 조건에서 σ=10을 구한 후 Y~N(30,10²)의 **25 초과 오른쪽 꼬리**. 평균30·경계25·표준화 z=−0.5로 대응. |
| 15 | EXEMPT: 분포·기준·표가 수식으로 완결 | BENEFICIAL: 특등급 p와 개수 Y의 중앙 확률구간 시각화 | 없음; 기출 `q15-solution.svg`는 다른 조건 | `q15-solution.plan.json` **수정** | PASS | RENDER_NOT_RUN | 기존 X~N(80,10²), X≥100 꼬리(0.02)를 보존하고 **Y≈N(50,7²), 43≤Y≤64 중앙 영역(0.82)**을 두 번째 패널로 추가. `ORIGINAL_EXAM_SVG_VARIANT_CONFLICT`: 기출 키위 N(50,5²), Y≥57. |
| 16 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 모평균 m을 수치로 확정하지 않는 P(m≤X≤a) 조건, 표본평균 기준의 z변환식이 충분; 임의 위치 그림 지양. |
| 17 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 신뢰구간 길이 l→l/2에 따른 신뢰상수 비율을 문제 제공 확률표로 판정. |
| 18 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | X~B(90,1/3) 꼬리확률의 합·기댓값 존재성 해석이 핵심. 확률막대 91개는 오히려 불필요. |
| 19 | EXEMPT | BENEFICIAL | 없음 | `q19-solution.plan.json` | PASS | NO_ORIGINAL / RENDER_NOT_RUN | 모집단 평균60·표준편차4에서 표본크기16의 X̄~N(60,1²); 경계59.5의 **왼쪽 꼬리**, z=−0.5를 표시. |
| 20 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 신뢰도68%와99%·표본크기 비 25의 신뢰구간 길이비만 비교; 좌표도 불필요. |
| 21 | EXEMPT | BENEFICIAL | 없음 | `q21-solution.plan.json` | PASS | NO_ORIGINAL / RENDER_NOT_RUN | B(n,1/3)의 정규근사에서 표준정규 Z의 양쪽 경계 −1,1 및 **중앙 면적 0.68**. 본 해설의 근사법에 맞는 영역이며 n의 수치값을 그림에 추가하지 않았다. |
| 22 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 1 또는 2개 구슬을 뽑는 조건부 확률분포표는 원문·해설의 조합 분수와 표가 정확하며 구슬 그림 필수 아님. |
| 23 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 표본크기 25·100의 신뢰구간 경계 방정식과 오차한계 비교로 완결. |

## 검수·한계·후속

| 단계 | 결과 |
|---|---|
| JSON 파싱·공식 스키마 | **5/5 PASS** (Shallow lint에 포함) |
| Shallow lint | **5 PASS / 0 FAIL / 0 SKIP** |
| Full lint | **5 PASS / 0 FAIL / 0 SKIP** |
| STATIC_FIELD_PARITY | plan 적용 **5 PASS**, 그림 불필요 **41 N/A** |
| DRAWN_FEATURE_PARITY | plan 5축 **정적 구성 대조**, 실제 렌더 검수 **0/5**, 원본 SVG q08 해설의 이미지 동등성 미확인 |
| ENGINE_CAPABILITY_PENDING | **`TRANSPARENT_CANVAS_OPTION` 1종**(직접 연결 유사 q08 해설 SVG의 흰 배경 전체 rect 및 엔진 공통 출력 옵션). 다른 기능 미지원 확정 0건. |
| 실제 렌더·육안 검수 | **RENDER_NOT_RUN**. 같은 공식 엔진의 대표 q07 렌더 시도는 `ARCHIVE_PREFLIGHT_FAIL` (Playwright Chrome `/opt/google/chrome/chrome` 미설치). 본 시험지 5개 결과도 시각 PASS라고 주장하지 않는다. |

**시각적 미해결:** q08의 두 선분·꼭짓점 라벨과 [0,2] 음영, q14/19/21의 꼬리 경계·면적 라벨, **이번 수정 q15의 두 패널 경계 100·43·64와 [43,64] 음영**, 분포곡선 수치 위치 및 실제 배경은 Chrome이 있는 생산 환경에서 출력한 뒤 원본(있는 경우)과 육안 비교해야 한다. SVG 수동 편집이나 기존 SVG 직접 교체는 하지 않았다. 위의 2026-11-27 기록에 있는 렌더 상태는 과거 기록이며 이번 재검증의 5건 모두 `RENDER_NOT_RUN`이 우선이다.
