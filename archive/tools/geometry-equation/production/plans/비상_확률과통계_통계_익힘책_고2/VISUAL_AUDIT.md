# 비상 확률과 통계 · 통계 · 익힘책 — 2축 전수 시각 검수

- 대상 JS: `archive/exams/textbooks/비상교육_확률과통계/비상_확률과통계_통계_익힘책_고2/비상_확률과통계_통계_익힘책_고2.js`
- 시작 판본: `main` `a8ff50171b37d5e379ad18304114acf965a1060b` / JS Git blob `6dde27b8908be7872996f4e793e5c0a797a46af5`.
- 분모: **27문항 × 문제/해설 = 54축**. 기존 `.svg`/`image`/`solutionImage` 0개, 문제 본문에 삽입된 원본 `<img src="q08.png">` 1개.
- 그림이 교육적 관계를 실제로 더할 때만 제작. 확률표는 이미 발문 안에 수식으로 있고, 확률표 재작성용 SVG는 AP Table Engine 원칙에 따라 생성하지 않는다.
- plan 경로는 모두 이 문서가 있는 `archive/tools/geometry-equation/production/plans/비상_확률과통계_통계_익힘책_고2/` 기준. `shallow/full`은 공식 plan-lint의 두 검사이다.

## 원본 PNG와 세부 도형 비교

`q08.png`(870×818 RGB)를 직접 확인했다. x·f(x) 축, O, 상승선 `(0,0)→(1,b)`, 하강선 `(1,b)→(a,0)`, x=1 아래의 **수직 점선**, y=b 왼쪽의 **수평 점선**, x 눈금 **1,a**, y 높이 **b**를 모두 포함한다. 흰 배경이고 삼각형에 불필요한 면색이 없다. 이 문제 PNG는 그대로 유지하며 답 `a=b=√2`를 문제 이미지에 노출하지 않는다. 해설 `q08`은 원본 두 실선·두 점선의 방향과 연결을 `construction-spike-v1`의 **근호 좌표 SOURCE_POINT, displaySegments, dashed:true**로 구현하고, 새로 구한 x=a/2=√2/2에서 높이 1까지 점선을 추가한다. 확률에 해당하는 작은 삼각형만 `planeMarks.regions`의 `LIGHT`로 채운다. `planeMarks.textLabels`로 원본의 **f(x)** 표기를 되살린다. 원본의 문자 a,b는 해설에서 정확히 구한 **√2** 좌표값으로 대치하며 모양·관계는 유지한다.

기존 엔진의 `piecewise-polynomial-spike-v1`은 `sourceDomain.range`의 끝으로 무리수 `sqrt(2)`를 받아들이지 않아 처음 시도에서 `PIECEWISE_POLY_SOURCE_DOMAIN_INVALID`가 났다. 오차가 생기는 유리수 근삿값이나 과한 그림 생략으로 피하지 않고, 같은 공식 엔진의 **`construction-spike-v1` 정확한 근호 좌표 작도**로 변경하여 shallow/full lint를 통과했다. 최종 `ENGINE_CAPABILITY_PENDING=0`(별도 엔진 기능 확대 필요 없음).

면 채움은 **밀도 아래 확률 부분**(q07·q08)과 **정규곡선 아래 사건의 넓이**(q04·q09·q10·q11·q14·q20·q21·q22·q25)에만 있고, 그 밖의 면 채움/흰색 배경 사각형은 없다. 수형도(q12)는 가지 확률만 그린다. 그림에 주어지지 않은 각·직각·길이 표식을 덧칠하지 않는다.

## 문항별 문제/해설 1:1 판정

| qid | 축 | 기존결함/판정·원문 대비 이유 | capability | plan | shallow/full | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|---|
| q01 | 문제 | EXEMPT — X=2,3,4의 확률표가 수식으로 제시 | — | — | N/A | EXEMPT |
| q01 | 해설 | EXEMPT — 확률 합과 평균 곱셈만 계산; 표 중복 금지 | — | — | N/A | EXEMPT |
| q02 | 문제 | EXEMPT — 평균·표준편차·선형변환의 수치 조건 | — | — | N/A | EXEMPT |
| q02 | 해설 | EXEMPT — 평균·표준편차 변환 공식에 도형 관계 없음 | — | — | N/A | EXEMPT |
| q03 | 문제 | EXEMPT — 주사위 조건과 60번 독립시행이 문자로 명료 | — | — | N/A | EXEMPT |
| q03 | 해설 | EXEMPT — 이항 평균과 분산은 단일 공식 계산 | — | — | N/A | EXEMPT |
| q04 | 문제 | EXEMPT — 정규분포 N(40,5²)와 사건 X≤45가 명확 | — | — | N/A | EXEMPT |
| q04 | 해설 | **BENEFICIAL/보완** — 45 왼쪽 누적넓이·평균 오른쪽 경계가 그림으로 없음 | `stat-chart-figure-v1` | `q04-solution.plan.json` | PASS/PASS | **PASS — μ=40,σ=5, 눈금 40/45, 왼쪽 누적** |
| q05 | 문제 | EXEMPT — E(X),V(X),Y=aX+b 수식만 주어짐 | — | — | N/A | EXEMPT |
| q05 | 해설 | EXEMPT — a,b는 분산·평균 연립식으로 바로 계산 | — | — | N/A | EXEMPT |
| q06 | 문제 | EXEMPT — 이항분포 모수의 평균과 E(X²)만 제시 | — | — | N/A | EXEMPT |
| q06 | 해설 | EXEMPT — V(X)=E(X²)−E(X)², np·npq 계산 | — | — | N/A | EXEMPT |
| q07 | 문제 | EXEMPT — 12분 균등한 대기시간과 상수 밀도 함수가 텍스트로 있음 | — | — | N/A | EXEMPT |
| q07 | 해설 | **BENEFICIAL/보완** — 8~12분 확률을 길이×높이 넓이로 읽는 도식 없음 | `piecewise-polynomial-spike-v1` | `q07-solution.plan.json` | PASS/PASS | **PASS — 범위 0~12, 높이 1/12, 8~12 부분 넓이 1/3** |
| q08 | 문제 | **PNG_KEEP** — 원본의 x·f(x)축, O·1·a·b·수평/수직 점선·두 빗변 모두 정확 | 원본 PNG | `q08.png` (JS 상대) | N/A | **PASS — 원본 9특징 확인** |
| q08 | 해설 | **BENEFICIAL/정밀 재설계** — a/2의 높이·부분 확률 삼각형이 누락; 근호 수치 작도 보강 | `construction-spike-v1` | `q08-solution.plan.json` | PASS/PASS | **PASS — 원본 두 변·두 점선·f(x)·√2 좌표·a/2 수선·부분 영역** |
| q09 | 문제 | EXEMPT — 두 정규분포·동일 확률구간 조건은 수식으로 주어짐 | — | — | N/A | EXEMPT |
| q09 | 해설 | **BENEFICIAL/보완** — 표준화하면 공통 경계 −2, 오른쪽 1.5가 된다는 구간 대응 없음 | `stat-chart-figure-v1` | `q09-solution.plan.json` | PASS/PASS | **PASS — Z=−2/0/1.5, 해당 두 부분 넓이** |
| q10 | 문제 | EXEMPT — 수리시간 평균·표준편차·35분 문장 | — | — | N/A | EXEMPT |
| q10 | 해설 | **BENEFICIAL/보완** — z=1의 왼쪽 넓이 부재 | `stat-chart-figure-v1` | `q10-solution.plan.json` | PASS/PASS | **PASS — μ=30,σ=5,x=35, 왼쪽 누적** |
| q11 | 문제 | EXEMPT — 식품 비율·표본수·양쪽 경계 조건 | — | — | N/A | EXEMPT |
| q11 | 해설 | **BENEFICIAL/보완** — 사건이 가운데가 아닌 **서로 떨어진 양쪽 꼬리**임을 표시 | `stat-chart-figure-v1` | `q11-solution.plan.json` | PASS/PASS | **PASS — μ=2000,σ=40,x=1960/2040, 양쪽 꼬리** |
| q12 | 문제 | EXEMPT — 상자 면 1·1·2·2·2·3과 중단 규칙을 글로 완결 | — | — | N/A | EXEMPT |
| q12 | 해설 | **BENEFICIAL/보완** — 세 단계의 분기/정지 조건을 수형도로 표시할 필요 | `stat-chart-figure-v1` TREE | `q12-solution.plan.json` | PASS/PASS | **PASS — 시작 1/3·1/2·1/6, 이어진 분기·3회 확정 1, 경로 합 1** |
| q13 | 문제 | EXEMPT — 파란 공 a, 흰 공 6, E·표준편차 조건은 식으로 완결 | — | — | N/A | EXEMPT |
| q13 | 해설 | EXEMPT — 분산/평균 연립으로 a,n 결정; 수형도가 기여할 정보 없음 | — | — | N/A | EXEMPT |
| q14 | 문제 | EXEMPT — 화분 무게·개수·구간과 필요한 정규분포표가 LaTeX 표로 있음 | — | — | N/A | EXEMPT |
| q14 | 해설 | **BENEFICIAL/보완** — 1개 무게 확률과 600개 중 개수 확률을 혼동하기 쉬운 두 단계 | `composite-panels-v1` + NORMAL_CURVE 2패널 | `q14-solution.plan.json` | PASS/PASS | **PASS — X(1500,20), [1490,1510]; Y(240,12), [222,252]** |
| q15 | 문제 | EXEMPT — 모평균·모분산·표본크기 조건만으로 분산 계산 | — | — | N/A | EXEMPT |
| q15 | 해설 | EXEMPT — E(X̄)=20, V(X̄)=4/4 식 계산 | — | — | N/A | EXEMPT |
| q16 | 문제 | EXEMPT — 원래 N(71,36), 표본크기 4, 표본평균의 모수 질문 | — | — | N/A | EXEMPT |
| q16 | 해설 | EXEMPT — 표본평균 분산 36/4 공식 계산 | — | — | N/A | EXEMPT |
| q17 | 문제 | EXEMPT — 노란 콩:검은 콩 비 4:1 및 표본 100 조건 | — | — | N/A | EXEMPT |
| q17 | 해설 | EXEMPT — 모비율 0.8의 표준오차 산술식 | — | — | N/A | EXEMPT |
| q18 | 문제 | EXEMPT — 표본비율 0.1, n=100, 신뢰도 95%라는 수치 | — | — | N/A | EXEMPT |
| q18 | 해설 | EXEMPT — 신뢰구간 양 끝은 공식 대입으로 충분 | — | — | N/A | EXEMPT |
| q19 | 문제 | EXEMPT — X=0,1,2의 확률 **LaTeX 표**가 이미 있음 | — | — | N/A | EXEMPT |
| q19 | 해설 | EXEMPT — E(X), V(X), V(X̄) 계산을 기존 표와 식으로 설명 | — | — | N/A | EXEMPT |
| q20 | 문제 | EXEMPT — 모집단 정규분포·표본평균과 누적확률 관계가 문자로 제시 | — | — | N/A | EXEMPT |
| q20 | 해설 | **BENEFICIAL/보완** — 누적확률 같은 조건에서 대칭 꼬리 z=±3을 시각화 | `stat-chart-figure-v1` | `q20-solution.plan.json` | PASS/PASS | **PASS — −3,0,3 눈금·같은 두 꼬리(여사건)** |
| q21 | 문제 | EXEMPT — 정규분포와 16개 표본평균 39.5 이상 조건 | — | — | N/A | EXEMPT |
| q21 | 해설 | **BENEFICIAL/보완** — 평균보다 왼쪽 경계의 **오른쪽 누적넓이** 부재 | `stat-chart-figure-v1` | `q21-solution.plan.json` | PASS/PASS | **PASS — μ=40,σ=0.5,x=39.5, 오른쪽 누적** |
| q22 | 문제 | EXEMPT — 0.1 점유율, 900명 표본, [0.09,0.13] 조건 | — | — | N/A | EXEMPT |
| q22 | 해설 | **BENEFICIAL/보완** — z=−1과 +3의 비대칭 넓이 분할 누락 | `stat-chart-figure-v1` | `q22-solution.plan.json` | PASS/PASS | **PASS — μ=0.1,σ=0.01, [0.09,0.13], 0.3413+0.4987** |
| q23 | 문제 | EXEMPT — 표본 평균·표준편차·크기·신뢰수준으로 신뢰구간 정의 | — | — | N/A | EXEMPT |
| q23 | 해설 | EXEMPT — 58±2.58×16/8 계산이 해설의 전부 | — | — | N/A | EXEMPT |
| q24 | 문제 | EXEMPT — 320/400 선호 표본비율과 신뢰수준 주어짐 | — | — | N/A | EXEMPT |
| q24 | 해설 | EXEMPT — 오차한계 1.96×0.02와 끝값 계산 | — | — | N/A | EXEMPT |
| q25 | 문제 | EXEMPT — 원자료 1~4의 각 개수가 문자로 명시 | — | — | N/A | EXEMPT |
| q25 | 해설 | **BENEFICIAL/전제 주의** — 기존 해설의 정규근사 P(X̄≥1.8)를 오른쪽 누적으로 구현; 표본 복원 여부 미명시 | `stat-chart-figure-v1` | `q25-solution.plan.json` | PASS/PASS | **PASS — 현행 해설 가정상 μ=2,σ=0.1,1.8부터 오른쪽** |
| q26 | 문제 | EXEMPT — 95% 신뢰구간 길이 비 3과 n1/n2 질의 | — | — | N/A | EXEMPT |
| q26 | 해설 | EXEMPT — 신뢰구간 폭 1/√n 비례식 자체로 결론 | — | — | N/A | EXEMPT |
| q27 | 문제 | EXEMPT — ㄱ/ㄴ/ㄷ의 수치·포함관계가 수식 보기에서 완결 | — | — | N/A | EXEMPT |
| q27 | 해설 | EXEMPT — 신뢰구간의 중심·표본크기·신뢰도 비율 비교는 본문이 직접 설명 | — | — | N/A | EXEMPT |

## 수학·구현 독립 확인 및 미실행

- 수학 재검산: q07 밀도 1/12, P(8≤X≤12)=4/12; q08 ab=2 및 a=b→√2, x=a/2 높이 1, 작은 삼각형 넓이 √2/4; q09 표준 경계 −2,1.5; q11 z=−1,+1; q12 중단 횟수 분포 `(1/6,13/18,1/9)`으로 기대값 **35/18**; q14 첫 p≈0.40(교과서가 제시한 표값 0.20×2 사용), 다음 Y의 μ=240,σ=12 및 z=−1.5,1; q20 z=±3; q22 z=−1,+3.
- q25 해설은 200개 유한 상자에서 100개를 뽑고도 표본평균 분산을 `1/100`으로 둔다. 이는 교과서 해설이 **독립·복원추출 근사**를 적용한 결과다. 원문에는 복원 여부가 명시되지 않아 *비복원 추출로 해석하면 유한모집단 보정이 필요*하므로 **SOURCE_MATH_SCOPE_WARNING**으로 별도 기록한다. SVG 플랜은 현행 해설의 분포만 그대로 시각화하며, JS·정답·문장 수리는 이 SVG 플랜 라인 범위 밖이다. 이 경고를 학생 수학 정합성 PASS로 세지 않는다.
- 문제 축 27: **원본 PNG 유지 1 + EXEMPT 26**. 해설 축 27: **신규 실행 플랜 12 + EXEMPT 15**. **54/54축 판정**.
- 제작 plan **12개**: shallow **12/12 PASS**, full **12/12 PASS**. `DRAWN_FEATURE_PARITY` **12/12 구조·수학 대응 PASS**, 원본 PNG **1/1 시각 대조**. 엔진 미지원 0, 임의 SVG 제작 0.
- 동일한 수학 영역을 표시하는 `shades`/`regions` 이외 도형 면색 없음. 본문 원본 PNG의 점선과 x·f(x) 라벨은 각각 정확한 도형·label 필드에 존재한다.
- 공식 렌더러의 실제 SVG 생성·PNG 눈 검수·학생 휴대폰/PC/A4·해설 이미지 연결/게시 **NOT_RUN**. `plan-lint`와 정적 1:1 필드 대조가 학생 화면 렌더 검증을 대체하지 않는다. 원본 JS·PNG·기타 라인은 수정하지 않았다.
