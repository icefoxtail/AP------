# DRAWN_FEATURE_PARITY · 문제/해설 2축 감사 — 25_순천고_2학기_기말_고2_확률과통계_유사

## 2026-11-28 최신 main 재검증 (기존 실행형 plan 보존)

- 기준 `origin/main`: `6dc7e32c842c0be77a0bcfdd54b540d2c24e3e72` (원격 새 조회). 현행 유사 JS **24문항·해설 24개, 총 48축** 재확인. 열린 PR 82개 전체 변경 파일에서 대상 JS 및 두 production plan 폴더 충돌 0건.
- 기존 공식 production plan **9개 유지 / 수정 0 / 신규 0**. 문제축 24개 EXEMPT, 해설축 9개 BENEFICIAL·15개 EXEMPT. 총 **BENEFICIAL 9 / EXEMPT 39**. 기출의 `_plans` 및 기존 PNG·SVG는 공식 plan 수에 포함하지 않는다.
- JSON 파싱·스키마 필수값 **9/9 PASS**, 공식 `plan-lint.cjs` **shallow 9/9 PASS**, **full 9/9 PASS** (각 FAIL 0 / SKIP 0), 원문 수식·통계 파라미터·x경계·면적 분리·기출 변형과 구분한 **`STATIC_FIELD_PARITY` 9/9 PASS**. Chromium 런처의 신규 실행 검사에서 `/usr/lib/chromium/chromium` 본체가 없어 종료 127: 실제 SVG 렌더와 육안대조 미실행, 전체 plan **`DRAWN_FEATURE_PARITY` PASS 0 / FAIL 0 / `RENDER_NOT_RUN` 9**. 정적 PASS를 시각 PASS로 간주하지 않는다.
- 직접 연결된 유사판 SVG는 **해설 q15-solution.svg 1개**다. 원문에 따른 x=0,2,5 및 높이 2/3·0·2/9와 두 삼각형 회색 음영이 SVG 래스터 자료에서 확인되나, 배경 흰 `<rect>`도 확인됐다. **`ENGINE_CAPABILITY_PENDING:TRANSPARENT_CANVAS_OPTION`**: 공통 렌더러의 투명 배경 opt-out이 없으며 이 범위에서 SVG 태그를 직접 제거하지 않는다.
- **원 기출과 유사판은 같은 번호여도 다른 문제다.** 기출 q15는 밀도 영역 [0,3]·[3,6], 현행 유사판은 [0,2]·[2,5]. 기출 q07·08·10·18·19·22·23 PNG 역시 모수·사건·기준점이 현행 JS와 다르므로 **`ORIGINAL_EXAM_PNG_CONFLICT`**를 기록한다. 원 기출 풀이 SVG의 수치가 다르면 **`ORIGINAL_EXAM_SVG_VARIANT_CONFLICT`**이며, 현행 유사 JS와 직접 연결된 SVG를 항상 우선한다.

| 문항 | 문제 축 판정 | 해설 축 판정 | 원본 SVG | plan 파일 | STATIC_FIELD_PARITY | DRAWN_FEATURE_PARITY | 비고 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 01 | EXEMPT: 주사위 시행·성공조건 수치 | EXEMPT: 이항모멘트 공식과 E(X²) | 없음 | — | EXEMPT | N/A | 이산확률 계산 |
| 02 | EXEMPT: 동전 세 개의 독립사건 | EXEMPT: 선형변환 평균식 | 없음 | — | EXEMPT | N/A | 수식만으로 경우 정의됨 |
| 03 | EXEMPT: 표본크기·모집단 정규분포 | EXEMPT: 표본평균 모멘트 계산 | 없음 | — | EXEMPT | N/A | 곡선 없이 산술 가능 |
| 04 | EXEMPT: 확률분포표는 KaTeX 배열 | EXEMPT: 분산·합계 계산 | 없음; 기출 문제 `q4.png` | — | EXEMPT | N/A | 기출 표의 표본크기 4 ≠ 유사 8: `ORIGINAL_EXAM_PNG_CONFLICT`; 유사는 배열 내 수치 우선 |
| 05 | EXEMPT: 신뢰구간 데이터 수치 | EXEMPT: 오차한계 공식 | 없음 | — | EXEMPT | N/A | 도형 불필요 |
| 06 | EXEMPT: 신뢰구간 끝값 명시 | EXEMPT: 표본평균과 폭 계산 | 없음 | — | EXEMPT | N/A | 수직선 없이 계산 가능 |
| 07 | EXEMPT: 평균·표준편차·표준정규표 | BENEFICIAL: 표본평균 70 이하의 왼 꼬리 | 유사 없음; 기출 `q7-solution-v3.svg` | `q07-solution.plan.json` | PASS | RENDER_NOT_RUN | N(73,2²), z=−1.5; 기출 공부시간/표본 조건과 달라 PNG·SVG 변형 충돌 |
| 08 | EXEMPT: KaTeX 표준정규표·구간 | BENEFICIAL: −1.5~0과 0~2 두 면적 | 유사 없음; 기출 `q8-solution-v2.svg` | `q08-solution.plan.json` | PASS | RENDER_NOT_RUN | N(50,1²), 48.5/50/52; 기출 N(65,5²)와 다름: `ORIGINAL_EXAM_PNG_CONFLICT` |
| 09 | EXEMPT: 동전·Y=aX+b 모멘트 | EXEMPT: 선형변환 연립 | 없음 | — | EXEMPT | N/A | 좌표·도형 정보 없음 |
| 10 | EXEMPT: 정규 불량 기준·분포표 | BENEFICIAL: 불량 개수 W≥57 오른쪽 꼬리 | 유사 없음; 기출 `q10-solution-v2.svg` | `q10-solution.plan.json` | PASS | RENDER_NOT_RUN | 기출 무게 40g 이상/64개와 유사 수명 60시간 이하/57개: `ORIGINAL_EXAM_PNG_CONFLICT` |
| 11 | EXEMPT: 이산질량함수의 모든 식 | EXEMPT: 값별 합계와 분산 | 없음 | — | EXEMPT | N/A | 이산 분포 그림 생략 타당 |
| 12 | EXEMPT: 모집단·표본값·누적확률 | EXEMPT: 표준화 역계산 | 유사 없음; 기출 `q12-solution-v2.svg` | — | EXEMPT | N/A | 기출 건전지/100개와 유사 부품/25개는 별개의 수치; 원본 SVG 복제 금지 |
| 13 | EXEMPT: 이산 질량과 유한구간 | EXEMPT: 망원경 합·꼬리 계산 | 없음 | — | EXEMPT | N/A | 수식으로 충분 |
| 14 | EXEMPT: 정규확률 대칭 조건 | EXEMPT: 대칭성·표본분산 방정식 | 유사 없음; 기출 `q14-solution.svg` | — | EXEMPT | N/A | 원 기출의 임계값과 유사 숫자가 달라 변형 SVG 복사하지 않음 |
| 15 | EXEMPT: 조각 밀도함수를 식으로 제시 | BENEFICIAL: [0,2]·[2,5] 삼각형 두 영역 | **유사 `q15-solution.svg`**; 기출 `q15-solution-v2.svg` | `q15-solution.plan.json` | PASS | RENDER_NOT_RUN | 분할점 2·끝점 5·높이 2/3,2/9 검산. 기출 분할 3·끝 6: `ORIGINAL_EXAM_SVG_VARIANT_CONFLICT`; 유사 SVG의 흰 rect로 투명 배경 기능 보류 |
| 16 | EXEMPT: 보기마다 신뢰구간 폭 조건 | EXEMPT: σ/√n 크기 비교 | 없음 | — | EXEMPT | N/A | 선택지 텍스트 완결 |
| 17 | EXEMPT: 모표준편차와 표본크기 조건 | EXEMPT: 부등식으로 최소 n 계산 | 없음 | — | EXEMPT | N/A | 도형 추가 불필요 |
| 18 | EXEMPT: 쿠키 합무게·구간·정규표 | BENEFICIAL: 1205~1250~1280g 두 확률영역 | 유사 없음; 기출 `q18-solution-v2.svg` | `q18-solution.plan.json` | PASS | RENDER_NOT_RUN | N(1250,30²), 0.43+0.34; 기출 소금빵과 달라 `ORIGINAL_EXAM_PNG_CONFLICT` |
| 19 | EXEMPT: 표본평균 두 분포와 확률식 | BENEFICIAL: Y평균 80, 74·88 두 임계값 | 유사 없음; 기출 `q19-solution-v2.svg` | `q19-solution.plan.json` | PASS | RENDER_NOT_RUN | σ(Ybar)=4, 왼 꼬리·누적 영역 분리; 기출 N(20)/N(100)과 달라 PNG·SVG 변형 충돌 |
| 20 | EXEMPT: 9개 관측값·95% 신뢰구간 | EXEMPT: 평균 4·표준편차 역산 | 없음 | — | EXEMPT | N/A | 그림 면제 |
| 21 | EXEMPT: f,g의 대칭축·구간을 식으로 제시 | BENEFICIAL: g의 x=2 대칭, f의 0 분할과 [−1,2] 확률 영역 | 유사 없음; 기출 `q21-solution-v2.svg` | `q21-solution.plan.json` | PASS | RENDER_NOT_RUN | 유사 g[−2,6], f[−3,3], a=1/36·b=1/8; 기출 범위가 달라 `ORIGINAL_EXAM_SVG_VARIANT_CONFLICT` |
| 22 | EXEMPT: 두 지역 모평균·σ비·표본수 | BENEFICIAL: B지역 표본평균 253 이하 누적 | 유사 없음; 기출 `q22-solution-v2.svg` | `q22-solution.plan.json` | PASS | RENDER_NOT_RUN | N(250,2²), 확률 0.9332; 기출 물 사용량/다른 평균과 달라 `ORIGINAL_EXAM_PNG_CONFLICT` |
| 23 | EXEMPT: 두 유한집합·반복횟수 | BENEFICIAL: 정규근사 N(252,10.5²)의 273 이상 꼬리 | 유사 없음; 기출 `q23-solution-v3.svg` | `q23-solution.plan.json` | PASS | RENDER_NOT_RUN | 교집합 공집합 확률 9/16·448회; 기출 원소수 1 사건/8640회와 달라 `ORIGINAL_EXAM_PNG_CONFLICT` |
| 24 | EXEMPT: 6면 숫자와 3회 반복 시행 | EXEMPT: 최댓값−최솟값 분포 계산 | 없음 | — | EXEMPT | N/A | 수식·확률 분할로 충분 |

**축 합계:** 24문항 × 2축 = 48축. REQUIRED 0 / BENEFICIAL 9 / EXEMPT 39. 정규분포의 음영은 원문에 명시된 기준값에서 끊었고, q15·q21의 면적 영역은 영점·대칭점에서 정확히 분리했다. 기존 9개 plan **모두 유지(수정 0/신규 0)**. 기출 PNG·SVG와 조건이 다른 경우 현행 유사 JS의 문항·해설이 실제 독자에게 제시되는 제작 대상이므로 기출 수치를 재사용하지 않았다. 남은 일은 실제 공식 엔진 출력의 시각적 라벨·획·배경·학생 화면 확인이며, **`ENGINE_CAPABILITY_PENDING:TRANSPARENT_CANVAS_OPTION`**과 **`RENDER_NOT_RUN`**을 분리 유지한다. `MULTI_CURVE_INVERSE_CUBIC` 및 `PIECEWISE_POLYNOMIAL_UPPERCASE_FUNCTION_NAME`은 이 시험지의 시각 축에 해당하지 않는다.

---

## 이전 제작 당시 감사 기록 (역사적 기준 SHA; 현재 재검증은 위 표 우선)

- 기준 `origin/main`: `9c42437326d026f3a928f182515cb8aa3f440ab8`
- 대상 JS blob: `45a8d905ef955628b30f311b43d842023007808f` (수정 없음)
- 범위: **24문항 × 문제/해설 2축 = 48축**, production 실행형 plan **9개** (문제 0, 해설 9)
- 원본 JS에 연결된 기존 SVG: **1개** (문제 0, 해설 1) — 자산 경로/파일 존재와 SVG 구조·배경 확인
- `plan-lint.cjs --shallow`: **9/9 PASS**; full: **9/9 PASS**, FAIL/SKIP 0
- 신규 렌더·PNG·학생 화면·A4: **RENDER_NOT_RUN** (필수 Chrome 바이너리 없음). 아래 `STATIC_FIELD_PARITY=REVIEWED`는 **실제 그린 결과의 DRAWN_FEATURE_PARITY=PASS가 아님**.

| QID | 문제축(독립 판정·사유) | 해설축(독립 판정·사유) | 엔진 plan JSON | JS 연결 SVG | STATIC_FIELD_PARITY / DRAWN_FEATURE_PARITY |
| --- | --- | --- | --- | --- | --- |
| 01 | EXEMPT — 이항시행 횟수와 확률을 발문에 전부 제시 | EXEMPT — 이항 평균·분산 공식과 E(X²) 계산 | — | — | EXEMPT / N/A |
| 02 | EXEMPT — 동전 3개 동시 시행을 문장으로 명시 | EXEMPT — 선형변환 기댓값 대입 | — | — | EXEMPT / N/A |
| 03 | EXEMPT — 모집단·표본크기·분포를 수식으로 명시 | EXEMPT — 표본평균의 평균·표준편차 공식 | — | — | EXEMPT / N/A |
| 04 | EXEMPT — 이산분포표가 KaTeX 배열로 주어짐 | EXEMPT — 확률합·표본평균 분산 계산 | — | — | EXEMPT / N/A |
| 05 | EXEMPT — 사과 무게의 표준편차·표본값이 주어짐 | EXEMPT — 95% 신뢰구간 산술 | — | — | EXEMPT / N/A |
| 06 | EXEMPT — 신뢰구간 양끝값을 수치로 명시 | EXEMPT — 99% 신뢰구간 중심값 계산 | — | — | EXEMPT / N/A |
| 07 | EXEMPT — 표준정규분포표가 본문에 있는 계산 발문 | BENEFICIAL — Xbar~N(73,2²)의 왼쪽 꼬리 z=−1.5, 0.0668 | `q07-solution.plan.json` | — | REVIEWED / RENDER_NOT_RUN |
| 08 | EXEMPT — 정규분포와 표가 본문에 있는 계산 발문 | BENEFICIAL — Xbar~N(50,1²)의 −1.5~2 구간을 양쪽 면적으로 분리 | `q08-solution.plan.json` | — | REVIEWED / RENDER_NOT_RUN |
| 09 | EXEMPT — 이항분포와 Y=aX+b가 주어짐 | EXEMPT — 선형변환 평균·분산 연립 계산 | — | — | EXEMPT / N/A |
| 10 | EXEMPT — 정규분포표·불량 기준을 수치로 명시 | BENEFICIAL — B(2500,0.02) 정규근사 N(50,7²)의 우측 꼬리 | `q10-solution.plan.json` | — | REVIEWED / RENDER_NOT_RUN |
| 11 | EXEMPT — 이산확률질량식을 구간별로 제시 | EXEMPT — 각 확률과 합계 검사 | — | — | EXEMPT / N/A |
| 12 | EXEMPT — 정규분포·표본크기·조건이 수치로 제시 | EXEMPT — 표본평균 정규화와 확률 산술 | — | — | EXEMPT / N/A |
| 13 | EXEMPT — 확률질량함수와 합 구간을 수식으로 제시 | EXEMPT — 망원경 합과 P(X>3a)의 수치 | — | — | EXEMPT / N/A |
| 14 | EXEMPT — 대칭 정규확률 조건이 수식으로 제시 | EXEMPT — 표준화 후 대칭 확률 항등식 계산 | — | — | EXEMPT / N/A |
| 15 | EXEMPT — 밀도함수 두 조각이 식으로 주어짐 | BENEFICIAL — 밑변 2·3의 두 삼각형 넓이와 a,b | `q15-solution.plan.json` | S | REVIEWED / RENDER_NOT_RUN |
| 16 | EXEMPT — 신뢰구간 폭의 대소를 보기 수치로 제시 | EXEMPT — σ/√n 비교 계산 | — | — | EXEMPT / N/A |
| 17 | EXEMPT — 표본 수 n과 신뢰구간 폭 조건 제시 | EXEMPT — 표본크기 부등식 풀이 | — | — | EXEMPT / N/A |
| 18 | EXEMPT — 쿠키의 평균·표준편차·표가 수치로 제시 | BENEFICIAL — 상자 합 N(1250,30²), −1.5~1 면적과 독립 | `q18-solution.plan.json` | — | REVIEWED / RENDER_NOT_RUN |
| 19 | EXEMPT — 두 모집단 분포와 확률합 조건이 제시 | BENEFICIAL — Ybar N(80,4²)의 −1.5 좌측 꼬리와 2 우측 위치 | `q19-solution.plan.json` | — | REVIEWED / RENDER_NOT_RUN |
| 20 | EXEMPT — 9개 표본값과 신뢰구간 조건 명시 | EXEMPT — 표본평균·모표준편차 관계 계산 | — | — | EXEMPT / N/A |
| 21 | EXEMPT — 두 밀도함수의 구간·대칭축을 글로 명시 | BENEFICIAL — g의 x=2 대칭·f의 y축 대칭과 −1~2 확률면적 | `q21-solution.plan.json` | — | REVIEWED / RENDER_NOT_RUN |
| 22 | EXEMPT — 두 지역 평균·σ비와 표준정규표가 제시 | BENEFICIAL — B지역 표본평균 N(250,2²)에서 253 이하 꼬리 | `q22-solution.plan.json` | — | REVIEWED / RENDER_NOT_RUN |
| 23 | EXEMPT — 집합원소·반복횟수·정규표가 제시 | BENEFICIAL — B(448,9/16) 정규근사 N(252,10.5²) 오른 꼬리 | `q23-solution.plan.json` | — | REVIEWED / RENDER_NOT_RUN |
| 24 | EXEMPT — 주사위의 면별 숫자·반복횟수 명시 | EXEMPT — 세 번의 각 경우 확률 곱과 합 | — | — | EXEMPT / N/A |

## 원문·원본 SVG와 실행 필드의 결함 대조

- **모든 문항**을 최신 JS의 `content`·`solution`·정답 및 연결된 `image`/`solutionImage`와 기존 `_plans`의 기하 조건으로 대조했다. 그래프 곡선식·정의역·교점·구간·면적·라벨의 필드 존재는 별도로 점검했다. 새 plan에는 기존 SVG 자산 경로나 과거 렌더 증거를 복제하지 않았다.
- **기존 SVG에서 흰 배경**: 연결된 `q15-solution.svg` 1개 (`<rect fill="#fff">`) 확인. 현재 plan capability 다수가 자체 캔버스 배경을 그리므로 `TRANSPARENT_CANVAS_OPTION`은 **ENGINE_CAPABILITY_PENDING**. SVG 문자열 직접 편집 금지, 엔진 공통 opt-out 확장 필요.
- **필드 점검**: 필요 없는 일반 다각형 면 채움을 추가하지 않았다. 단, 적분 넓이·확률밀도·삼각형 면적 자체를 묻는 문항은 의미 있는 `regions`·`overlays.polygons` 채움을 유지한다. 계산형의 문제축 EXEMPT는 그림 분실/실패가 아니라 축별 사유에 따른 판정이다.
- **q07·08·10·18·19·22·23**: 이전 legacy plan의 정규분포 `UNSUPPORTED`를 현행 `stat-chart-figure-v1 / NORMAL_CURVE`로 대체했다. 평균·표준편차·표준화 눈금·조건 범위·꼬리 음영을 발문/해설의 수치로 지정했다.
- **q15**: 밀도함수의 x=2 영점, 좌우 두 삼각형과 관련 확률면적만 채웠다. 문제축에 미지 a,b를 노출하지 않는다.
- **q15 원본 대비**: 현행 SVG에는 왼쪽·오른쪽 삼각형의 아래 면적 강조가 없어 풀이의 2a·3b/2가 시각적으로 분리되지 않는다. 새 계획은 의미 있는 두 넓이만 다른 진하기로 표시한다.
- **q21**: 기존 단독 f 그래프의 한계를 보완해, 두 패널 `g(x)`(x=2 대칭)와 `f(x)`(y축 대칭)를 모두 포함했다. f의 −1~2 확률구간만 필요한 면적에 해당해 색으로 분리했다.

## 인계 게이트

1. Chrome/Playwright 실행 환경에서 **전체 9개**를 공식 `render-plan.mjs`로 렌더하고 `RENDER_NOT_RUN`을 실결과로 갱신한다. 현재는 새 SVG/PNG 제작·학생 출고를 주장하지 않는다.
2. SVG/PNG 실물과 원 JS·원본 SVG의 축·점·보조선·면적·좌표·선택적 색을 독립 검수하여 `DRAWN_FEATURE_PARITY`를 축별 판정한다. 특히 문제축 답 누출과 A4/모바일 잘림을 검사한다.
3. `TRANSPARENT_CANVAS_OPTION` 및 필요한 경우 미지원 도형 capability를 엔진 PR로 보강한다. 승인된 렌더를 새 경로에 배치한 뒤에만 JS `image`/`solutionImage` 참조·게시를 갱신한다. 본 PR은 plan/audit 전용이다.
