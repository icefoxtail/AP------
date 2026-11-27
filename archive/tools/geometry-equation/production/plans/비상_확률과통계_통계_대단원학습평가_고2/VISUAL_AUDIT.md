# 비상 확률과 통계 · 통계 · 대단원 학습 평가 — 2축 전수 시각 검수

- 대상 JS: `archive/exams/textbooks/비상교육_확률과통계/비상_확률과통계_통계_대단원학습평가_고2/비상_확률과통계_통계_대단원학습평가_고2.js`
- 시작 판본: `main` `a8ff50171b37d5e379ad18304114acf965a1060b` / JS Git blob `a71175380f9f0888bb48fee5233d4ebb67e504ff`.
- 분모: **16문항 × 문제/해설 = 32축**. 현재 JS에 외부 `.svg`/`image`/`solutionImage` 연결 0개. 원본 문제 `<img src="q05.png">` 1개만 존재.
- 작업 원칙: 원본 PNG·JS 무변경, 해설에 유익한 도식 7개만 공식 엔진 plan으로 신규 작성. `EXEMPT`는 문항별 이유가 있는 진짜 도식 불필요 판정이며 미완성 plan이 아니다.
- 아래 plan 경로는 모두 이 문서가 있는 `archive/tools/geometry-equation/production/plans/비상_확률과통계_통계_대단원학습평가_고2/` 기준이다. `shallow/full`은 `plan-lint.cjs`의 두 모드이다.

## 원본 이미지와 결함 범주 확인

`q05.png`는 1330×591 RGB PNG를 직접 시각 확인했다. x축·f(x)축·원점 O, 삼각선 `(0,0)→(2,a)→(5,0)`, 꼭짓점에서 y축까지의 **수평 점선**, x축까지의 **수직 점선**, x 눈금 **2·5**, y 높이 **a**가 전부 있다. 기본은 흰 배경이며 삼각형 내부에 불필요한 색칠이 없다. 문제 PNG는 정확한 주어진 값만 보여 주므로 유지한다. 해설 `q05` plan은 **계산된 높이 2/5**, 경계 `b=1`, 확률 부분넓이 `1/10`, 원본 꼭짓점의 **양방향 점선**을 실제 `graphPlan`의 곡선·눈금·`regions`·`overlays.guides`로 옮긴다. 문제 풀이에 없는 직각/길이/각 표식을 요구하지 않으며 새 정답을 **문제** 이미지에 노출하지 않는다.

면 채움 점검: 7개 새 plan 중 확률영역이 실제 풀이인 q05 및 정규확률영역 q06·q07·q09·q10·q14·q15에서만 `regions`/`shades`를 쓴다. 어떤 plan에도 배경 사각형이나 무조건적인 도형 면 채움은 없다. 지시선·각·직각·길이 등 원본에 없는 요소를 형식적으로 보태지 않는다.

## 문항별 문제/해설 1:1 판정

| qid | 축 | 기존결함/판정·원문 대비 이유 | capability | plan | shallow/full | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|---|
| q01 | 문제 | EXEMPT — `kx` 확률질량함수 합을 문자로 완결 | — | — | N/A | EXEMPT |
| q01 | 해설 | EXEMPT — `k(1+2+3)=1` 식 자체가 과정 | — | — | N/A | EXEMPT |
| q02 | 문제 | EXEMPT — 네 공의 값과 무작위 조합 조건이 텍스트에 명시 | — | — | N/A | EXEMPT |
| q02 | 해설 | EXEMPT — 여섯 조합과 각 곱을 풀이 본문이 전부 나열 | — | — | N/A | EXEMPT |
| q03 | 문제 | EXEMPT — X와 확률분포 **LaTeX 표**가 이미 있음; SVG 중복 금지 | — | — | N/A | EXEMPT |
| q03 | 해설 | EXEMPT — 분산과 선형변환은 식·기존 확률표로 충분 | — | — | N/A | EXEMPT |
| q04 | 문제 | EXEMPT — 이항분포 PMF와 n이 식에 있음 | — | — | N/A | EXEMPT |
| q04 | 해설 | EXEMPT — `np=80×3/4` 직접 계산 | — | — | N/A | EXEMPT |
| q05 | 문제 | **PNG_KEEP** — 원본 선 2개·안내 점선 2개·O·2·5·a·f(x)·x 모두 정확; SVG 없음 | 원본 PNG | `q05.png` (JS 상대) | N/A | **PASS — 원본 9특징 확인** |
| q05 | 해설 | **BENEFICIAL/보완** — 원본에 없는 b=1의 부분 삼각형, 높이 2/5·넓이 1/10을 추가 | `piecewise-polynomial-spike-v1` | `q05-solution.plan.json` | PASS/PASS | **PASS — 두 구간식·꼭짓점·수평/수직 점선·1/10 영역·축 라벨 대응** |
| q06 | 문제 | EXEMPT — 두 정규분포 모수·동일확률 조건은 정확한 문자 | — | — | N/A | EXEMPT |
| q06 | 해설 | **BENEFICIAL/보완** — 두 변수를 Z로 바꿨을 때 ±2 꼬리대칭이 그림에 없었음 | `stat-chart-figure-v1` | `q06-solution.plan.json` | PASS/PASS | **PASS — −2/0/2 눈금·양쪽 대칭 꼬리** |
| q07 | 문제 | EXEMPT — 금액 기준·평균·표준편차만 제시 | — | — | N/A | EXEMPT |
| q07 | 해설 | **BENEFICIAL/보완** — 16000원 이상 오른쪽 꼬리 영역 부재 | `stat-chart-figure-v1` | `q07-solution.plan.json` | PASS/PASS | **PASS — μ=12000, σ=2000, x=16000 및 오른쪽 꼬리** |
| q08 | 문제 | EXEMPT — 모평균·분산·표본크기·표본평균 조건 모두 문자로 주어짐 | — | — | N/A | EXEMPT |
| q08 | 해설 | EXEMPT — 표본평균의 표준오차 식이 핵심이고 도식 추가 가치 낮음 | — | — | N/A | EXEMPT |
| q09 | 문제 | EXEMPT — X·표본평균·확률 동등 조건은 식으로 완결 | — | — | N/A | EXEMPT |
| q09 | 해설 | **BENEFICIAL/보완** — Z=±0.7 양쪽 꼬리 대칭 관계를 명확히 시각화 | `stat-chart-figure-v1` | `q09-solution.plan.json` | PASS/PASS | **PASS — μ=0, σ=1, −0.7/0/0.7, 두 꼬리** |
| q10 | 문제 | EXEMPT — p=0.5, n=400, 표본비율 기준이 텍스트에 있음 | — | — | N/A | EXEMPT |
| q10 | 해설 | **BENEFICIAL/보완** — 누적영역과 표본비율 0.55 위치가 그림으로 없음 | `stat-chart-figure-v1` | `q10-solution.plan.json` | PASS/PASS | **PASS — μ=0.5, σ=0.025, 0.55 왼쪽 누적** |
| q11 | 문제 | EXEMPT — 95% 신뢰구간의 양 끝값만 필요 | — | — | N/A | EXEMPT |
| q11 | 해설 | EXEMPT — 두 신뢰구간의 중심·오차범위 비교는 산술 계산 | — | — | N/A | EXEMPT |
| q12 | 문제 | EXEMPT — 카드 1~5에서 두 수 선택은 글로 명확 | — | — | N/A | EXEMPT |
| q12 | 해설 | EXEMPT — 차 1,2,3,4의 경우 수 4,3,2,1을 이미 나열 | — | — | N/A | EXEMPT |
| q13 | 문제 | EXEMPT — 이항확률의 비례식이 결정적 조건 | — | — | N/A | EXEMPT |
| q13 | 해설 | EXEMPT — p=1/4와 표준편차 공식이 직접 계산 | — | — | N/A | EXEMPT |
| q14 | 문제 | EXEMPT — 참여율·표본수·인원 구간 조건만 있음 | — | — | N/A | EXEMPT |
| q14 | 해설 | **BENEFICIAL/보완** — 304~328을 평균 320 양편으로 나누는 시각적 영역 누락 | `stat-chart-figure-v1` | `q14-solution.plan.json` | PASS/PASS | **PASS — μ=320, σ=8, x=304/320/328, 0.4772+0.3413** |
| q15 | 문제 | EXEMPT — 두 소문항의 표본크기·총합 66을 문장으로 구분 | — | — | N/A | EXEMPT |
| q15 | 해설 | **BENEFICIAL/보완** — 표본수 36과 4의 정규곡선 폭·서로 반대 꼬리 방향이 불명확 | `composite-panels-v1` + NORMAL_CURVE 2패널 | `q15-solution.plan.json` | PASS/PASS | **PASS — (15,0.5),≤16과 (15,1.5),≥16.5 두 별도 패널** |
| q16 | 문제 | EXEMPT — 표본비율 225/300과 신뢰수준만 필요 | — | — | N/A | EXEMPT |
| q16 | 해설 | EXEMPT — 오차한계·신뢰구간 끝의 산술 계산 | — | — | N/A | EXEMPT |

## 정밀 검수 요약

- 문제 축 16: **원본 PNG 유지 1 + EXEMPT 15**. 해설 축 16: **신규 실행 플랜 7 + EXEMPT 9**. 전체 **32/32축 판정**.
- 새로운 실제 제작 플랜: **7개**. 공식 `plan-lint.cjs --shallow` **7/7 PASS**, full **7/7 PASS**. `DRAWN_FEATURE_PARITY` **7/7 구조·수학 대응 PASS**(원본 PNG 1/1 유지). 엔진 미지원 **0**.
- 원본 이미지의 점선·꼭짓점·눈금 실물과 plan의 실제 출력 필드(곡선·축·점·점선·확률영역)를 항목별로 비교했다. 각/직각/길이/별도 지시선은 원본·발문에 없는 것이라 누락으로 세지 않았다.
- 원문 수학 검산: q05 `a=2/5`, `b=1`, `a+b=7/5`; q06 경계 `a=104→Z_A=2,Z_B=−2`; q09 `Z_X=+0.7`, `Z_표본평균=−0.7`; q14 `z=-2,1`; q15 두 표본평균 표준편차 `0.5,1.5`.
- 다음 단계(이 GPT 플랜 라인 외): 공식 엔진 실물 SVG/PNG 렌더, 학생 PC·모바일·A4의 가독성 및 JS 해설 이미지 연결/게시 **NOT_RUN**. 정적 parity PASS는 렌더 결과 PASS가 아니다. JS·원본 PNG를 건드리지 않았다.
