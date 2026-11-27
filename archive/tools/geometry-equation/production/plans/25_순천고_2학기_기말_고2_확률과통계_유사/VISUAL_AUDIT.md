# DRAWN_FEATURE_PARITY · 문제/해설 2축 감사 — 25_순천고_2학기_기말_고2_확률과통계_유사

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
