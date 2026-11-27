# 비상_확률과통계_확률분포_중단원학습점검_고2 — 문제·해설 2축 SVG 플랜 정적 감사

- 현행 소스: `archive/exams/textbooks/비상교육_확률과통계/비상_확률과통계_확률분포_중단원학습점검_고2/비상_확률과통계_확률분포_중단원학습점검_고2.js`
- 범위: **18문항 × 2축 = 36축**. 대상 시험지 이외의 JS·PNG·SVG·엔진 파일은 변경하지 않음.
- 원본 PNG: `q11.png` 직접 육안 확인.
- plan-lint: 신규 실행형 플랜 **shallow/full PASS**(합계 26개 기준, 실패 0). 실제 학생 화면·A4 렌더와 구별.
- 공식 `render-plan.mjs` 실제 시도 결과: `ARCHIVE_PREFLIGHT_FAIL` — Chrome `/opt/google/chrome/chrome` 부재. 따라서 모든 신규 그림의 **RENDER_NOT_RUN**, 실물 PNG·학생 화면·A4 및 최종 시각 `DRAWN_FEATURE_PARITY=NOT_RUN`.
- 정적 DRAWN_FEATURE_PARITY: 원문·수식·원본 PNG와 실제 그려지는 plan 필드의 특징 1:1 매핑 `STATIC_MAPPED`; 렌더 전 `PASS`로 오인하지 않음. 원본에 없는 면색·흰색 다각형 배경을 추가하지 않았으며, 확률 영역의 의미 있는 음영·통계 막대 채움만 허용.
- production plan 경로: `archive/tools/geometry-equation/production/plans/비상_확률과통계_확률분포_중단원학습점검_고2/`. 표의 파일명은 이 디렉터리 기준.

| 파일/qid | 축 | 기존결함/판정 | capability | plan경로 | plan-lint shallow/full | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|---|
| 확률분포점검/q01 | 문항 | EXEMPT — 확률분포표 X=-1,0,1의 평균·분산; 원문 표는 AP Table Engine 대상이어서 별도 SVG 중복 불필요 | — | — | N/A | EXEMPT (근거 기반) |
| 확률분포점검/q01 | 해설 | EXEMPT — 확률분포표 X=-1,0,1의 평균·분산; 원문 표는 AP Table Engine 대상이어서 별도 SVG 중복 불필요 | — | — | N/A | EXEMPT (근거 기반) |
| 확률분포점검/q02 | 문항 | EXEMPT — 이항 B(90,1/3)의 평균·분산; 문장·수식에서 주어진 조건으로 발문 이해 가능하며 추가 독립 도형 불필요 | — | — | N/A | EXEMPT (근거 기반) |
| 확률분포점검/q02 | 해설 | EXEMPT — 이항 B(90,1/3)의 평균·분산; 풀이의 조합·확률 계산 또는 정리된 값만 반복하는 그림은 새 정보가 없어 불필요 | — | — | N/A | EXEMPT (근거 기반) |
| 확률분포점검/q03 | 문항 | EXEMPT — f(x)=(x+1)/2의 -1~0 확률밀도 넓이; 문장·수식에서 주어진 조건으로 발문 이해 가능하며 추가 독립 도형 불필요 | — | — | N/A | EXEMPT (근거 기반) |
| 확률분포점검/q03 | 해설 | PLAN_READY — 연속밀도 직선과 [-1,0] 면적 1/4 | `piecewise-polynomial-spike-v1` | `q03-solution.plan.json` | PASS / PASS | STATIC_MAPPED (점(-1,0),(0,1/2),(1,1) 및 영역); RENDER_NOT_RUN |
| 확률분포점검/q04 | 문항 | EXEMPT — N(40,9)의 누적확률; 문장·수식에서 주어진 조건으로 발문 이해 가능하며 추가 독립 도형 불필요 | — | — | N/A | EXEMPT (근거 기반) |
| 확률분포점검/q04 | 해설 | PLAN_READY — 평균40·표준편차3의 43 이하 넓이 | `stat-chart-figure-v1` | `q04-solution.plan.json` | PASS / PASS | STATIC_MAPPED (43/z1/면적0.8413); RENDER_NOT_RUN |
| 확률분포점검/q05 | 문항 | EXEMPT — 질량함수 P(X=x)=x/a의 평균·표준편차; 문장·수식에서 주어진 조건으로 발문 이해 가능하며 추가 독립 도형 불필요 | — | — | N/A | EXEMPT (근거 기반) |
| 확률분포점검/q05 | 해설 | PLAN_READY — x=1,2,3 이산질량 막대 1/6·1/3·1/2 | `stat-chart-figure-v1` | `q05-solution.plan.json` | PASS / PASS | STATIC_MAPPED (세 막대 확률 비); RENDER_NOT_RUN |
| 확률분포점검/q06 | 문항 | EXEMPT — 흰 공이 처음 나올 때까지 비복원 회차; 문장·수식에서 주어진 조건으로 발문 이해 가능하며 추가 독립 도형 불필요 | — | — | N/A | EXEMPT (근거 기반) |
| 확률분포점검/q06 | 해설 | PLAN_READY — 첫 흰공 시점 1·2·3회 비복원 수형도 | `stat-chart-figure-v1` | `q06-solution.plan.json` | PASS / PASS | STATIC_MAPPED (3개 종단 경로/분모5·4·3); RENDER_NOT_RUN |
| 확률분포점검/q07 | 문항 | EXEMPT — 카드 3장 중 최대값 X의 분포·분산; 원문 표는 AP Table Engine 대상이어서 별도 SVG 중복 불필요 | — | — | N/A | EXEMPT (근거 기반) |
| 확률분포점검/q07 | 해설 | PLAN_READY — 최댓값3·4·5의 확률 1/10·3/10·3/5 막대 | `stat-chart-figure-v1` | `q07-solution.plan.json` | PASS / PASS | STATIC_MAPPED (막대3/상대확률); RENDER_NOT_RUN |
| 확률분포점검/q08 | 문항 | EXEMPT — E(2X+1), V(2X-3)에서 E(X²); 문장·수식에서 주어진 조건으로 발문 이해 가능하며 추가 독립 도형 불필요 | — | — | N/A | EXEMPT (근거 기반) |
| 확률분포점검/q08 | 해설 | EXEMPT — E(2X+1), V(2X-3)에서 E(X²); 풀이의 조합·확률 계산 또는 정리된 값만 반복하는 그림은 새 정보가 없어 불필요 | — | — | N/A | EXEMPT (근거 기반) |
| 확률분포점검/q09 | 문항 | EXEMPT — B(3,p)에서 p를 역산한 분산; 문장·수식에서 주어진 조건으로 발문 이해 가능하며 추가 독립 도형 불필요 | — | — | N/A | EXEMPT (근거 기반) |
| 확률분포점검/q09 | 해설 | EXEMPT — B(3,p)에서 p를 역산한 분산; 풀이의 조합·확률 계산 또는 정리된 값만 반복하는 그림은 새 정보가 없어 불필요 | — | — | N/A | EXEMPT (근거 기반) |
| 확률분포점검/q10 | 문항 | EXEMPT — 주사위 눈 곱이 소수인 횟수; 문장·수식에서 주어진 조건으로 발문 이해 가능하며 추가 독립 도형 불필요 | — | — | N/A | EXEMPT (근거 기반) |
| 확률분포점검/q10 | 해설 | EXEMPT — 주사위 눈 곱이 소수인 횟수; 풀이의 조합·확률 계산 또는 정리된 값만 반복하는 그림은 새 정보가 없어 불필요 | — | — | N/A | EXEMPT (근거 기반) |
| 확률분포점검/q11 | 문항 | PLAN_READY — 원본의 축·두 선분·y=k·x=3 점선·2k,k,2,3,x,f(x) 라벨 | `construction-spike-v1` | `q11-problem.plan.json` | PASS / PASS | STATIC_MAPPED (원본 선분6/기호 라벨 7); RENDER_NOT_RUN |
| 확률분포점검/q11 | 해설 | PLAN_READY — k=2/5의 두 삼각형 영역과 y=k·x=3 안내점선 | `piecewise-polynomial-spike-v1` | `q11-solution.plan.json` | PASS / PASS | STATIC_MAPPED (수치/두 음영·양축 점선); RENDER_NOT_RUN |
| 확률분포점검/q12 | 문항 | EXEMPT — N(12,σ²)의 중앙확률·누적확률; 문장·수식에서 주어진 조건으로 발문 이해 가능하며 추가 독립 도형 불필요 | — | — | N/A | EXEMPT (근거 기반) |
| 확률분포점검/q12 | 해설 | PLAN_READY — 평균12·σ2의 15 이하 누적확률 | `stat-chart-figure-v1` | `q12-solution.plan.json` | PASS / PASS | STATIC_MAPPED (8·12·15·16/z줄); RENDER_NOT_RUN |
| 확률분포점검/q13 | 문항 | EXEMPT — X~N(50,9), Y~N(64,16)의 같은 구간넓이; 문장·수식에서 주어진 조건으로 발문 이해 가능하며 추가 독립 도형 불필요 | — | — | N/A | EXEMPT (근거 기반) |
| 확률분포점검/q13 | 해설 | PLAN_READY — X·Y 정규곡선 각각의 47~56·56~68 면적 | `composite-panels-v1` | `q13-solution.plan.json` | PASS / PASS | STATIC_MAPPED (2패널/서로 다른 눈금); RENDER_NOT_RUN |
| 확률분포점검/q14 | 문항 | EXEMPT — 봉지무게 N(60,9)의 왼쪽 꼬리; 문장·수식에서 주어진 조건으로 발문 이해 가능하며 추가 독립 도형 불필요 | — | — | N/A | EXEMPT (근거 기반) |
| 확률분포점검/q14 | 해설 | PLAN_READY — 60g 중심 57g 이하 왼쪽 꼬리 | `stat-chart-figure-v1` | `q14-solution.plan.json` | PASS / PASS | STATIC_MAPPED (57/z−1·면적0.1587); RENDER_NOT_RUN |
| 확률분포점검/q15 | 문항 | EXEMPT — 400명 중 좋아요 수의 정규근사; 문장·수식에서 주어진 조건으로 발문 이해 가능하며 추가 독립 도형 불필요 | — | — | N/A | EXEMPT (근거 기반) |
| 확률분포점검/q15 | 해설 | PLAN_READY — B(400,.2) 정규근사 N(80,8²) 중앙구간 | `stat-chart-figure-v1` | `q15-solution.plan.json` | PASS / PASS | STATIC_MAPPED (72·80·96/z−1~2); RENDER_NOT_RUN |
| 확률분포점검/q16 | 문항 | EXEMPT — 주사위 세 개 중앙값의 대칭분포; 문장·수식에서 주어진 조건으로 발문 이해 가능하며 추가 독립 도형 불필요 | — | — | N/A | EXEMPT (근거 기반) |
| 확률분포점검/q16 | 해설 | PLAN_READY — 세 주사위 중앙값 1~6의 대칭 막대 | `stat-chart-figure-v1` | `q16-solution.plan.json` | PASS / PASS | STATIC_MAPPED (6막대 대칭); RENDER_NOT_RUN |
| 확률분포점검/q17 | 문항 | EXEMPT — N(m,25)의 대칭과 최적 길이10 구간; 문장·수식에서 주어진 조건으로 발문 이해 가능하며 추가 독립 도형 불필요 | — | — | N/A | EXEMPT (근거 기반) |
| 확률분포점검/q17 | 해설 | PLAN_READY — 평균31 중심 [26,36] 최대 구간 | `stat-chart-figure-v1` | `q17-solution.plan.json` | PASS / PASS | STATIC_MAPPED (26·31·36 대칭음영); RENDER_NOT_RUN |
| 확률분포점검/q18 | 문항 | EXEMPT — 치즈 무게 정품확률과 900개 정규근사; 문장·수식에서 주어진 조건으로 발문 이해 가능하며 추가 독립 도형 불필요 | — | — | N/A | EXEMPT (근거 기반) |
| 확률분포점검/q18 | 해설 | PLAN_READY — 무게 구간 p=.9 → 개수 N(810,9²)의 828 이하 | `composite-panels-v1` | `q18-solution.plan.json` | PASS / PASS | STATIC_MAPPED (2단계·양 패널 축/면적); RENDER_NOT_RUN |

## 원본에셋과 필요 엔진 기능 인계

- q11.png: 원본의 (0,2k)→(2,0)→(3,k), 축 화살표 2개와 선분 2개, 수평 y=k·세로 x=3 점선 2개, 기호·눈금 라벨은 문제 플랜의 실질 필드에 매핑. 문제축에는 해설에서 얻은 k=2/5를 노출하지 않음. 해설축에는 `graphPlan.overlays.guides`가 두 점선을 실제 생성하고 [1,2]·[2,3]의 면적을 구분.
- 분포·표는 AP Table Engine 대상의 텍스트 표를 불필요하게 이미지로 중복하지 않음. 해설에서 실제 도움을 주는 이산확률의 막대·정규분포 면적·단계별 수형도에만 SVG 제작.
- q13과 q18의 서로 다른 평균·표준편차 분포는 하나의 눈금에 섞지 않고 각각 두 개의 공식 정규곡선 패널로 표현.

## QA 결론

- **36축 전수판정**: 실행형 plan 14, 근거 기반 EXEMPT 22, 엔진 미지원 표식 0축(일부는 plan 작성축과 중복).
- 신규 plan은 형식 검사를 통과했지만 실물 렌더에 의존하는 겹침·글리프 누락·보이는 점선 모양·A4·모바일은 미검사이며 PASS로 기록하지 않음.
- 사용자 승인 렌더 예외: `RENDER_NOT_RUN` 기록 후 구조·스펙 정적 검토와 lint만으로 plan PR 병합 가능. 엔진 확장·실물 렌더·JS 연결·학생 게시 완료와는 별개.
