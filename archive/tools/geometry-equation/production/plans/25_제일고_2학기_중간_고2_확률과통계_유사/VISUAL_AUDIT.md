# 2025 제일고 2학기 중간 고2 확률과통계 유사 — 독립 SVG production 재검증

- 기준: 현행 `archive/exams/similar/high/h2/2mid/25_제일고_2학기_중간_고2_확률과통계_유사.js`. `window.questionBank` 23문항·23해설, **문제 23축 + 해설 23축 = 46축**. 다른 시험지·JS·SVG·원본 이미지는 편집하지 않는다.
- 직접 연결된 유사판 그림: q09 `q09.svg`, q11 `q11-readable-v2.svg`, q16 `q16-problem-v2.svg`. 나머지는 현행 JS에 직접 연결된 그림이 없다. 다른 파일명 변형 SVG와 원 기출 `q9.png`, `q11.png`, `q16.png`도 별도로 조사했다.
- 기존 공식 production 폴더의 `q16-problem-v2.config.json`은 실행형 `*.plan.json`이 아닌 엔진 설정이며 **보존**했다. 그 구성의 `figures[0].plan`을 q16-problem 실행형 JSON으로 옮기고, 다른 그림이 실제 도움이 되는 12축의 plan을 독립 작성했다. 기존 실행형 plan 0개 유지·수정 0·신규 13개, 기존 설정 1개 유지.
- 공식 JSON 필수 스키마 **13 PASS / 0 FAIL / 0 SKIP**, `plan-lint.cjs --shallow` **13 PASS / 0 FAIL / 0 SKIP**, `plan-lint.cjs` full **13 PASS / 0 FAIL / 0 SKIP**. `STATIC_FIELD_PARITY` **13 PASS**, `DRAWN_FEATURE_PARITY` **13 PASS(그려지는 필드 정적 대조만)**. Chrome/Chromium 래퍼는 있으나 실제 실행 바이너리가 없어 공식 엔진 SVG 렌더 **13/13 RENDER_NOT_RUN**. lint·정적 PASS는 실제 화소·학생 화면/A4 시각 PASS가 아니다.
- 축 분류: **REQUIRED 3**(q09/q11/q16 문제), **BENEFICIAL 10**(q04/q06/q07/q12/q13/q14/q17/q18/q19/q23 해설), **EXEMPT 33**. 3+10+33=46축.

## 원본 판본·조건 충돌과 정적 그리기 대조

1. **`ORIGINAL_EXAM_PNG_CONFLICT:q09`** — 기출 `q9.png`는 가로 평행선 **3개**·세로 **3개**지만, 현행 유사 JS 발문과 직접 연결된 `q09.svg`에는 가로 **4개**·세로 **3개**다. 유사판의 직사각형 선택 수는 `C(4,2)×C(3,2)=18`이고 기출 도형으로 계산하면 달라진다. 제작 대상이 원 기출 복원이 아닌 **현행 유사 JS**이므로 q09-problem plan은 4×3선과 간격 1을 따른다. 격자에 풀이 선택 수·답 `140`을 쓰거나 영역을 칠하지 않았다.
2. **`ORIGINAL_EXAM_PNG_CONFLICT:q16`** — 기출 `q16.png`의 카드 다섯 장은 **1,1,2,2,4**, 현행 유사 JS 및 직접 연결된 `q16-problem-v2.svg`는 **1,1,2,3,4**다. 공식 계획도 현행 유사판의 다섯 수를 채택한다. 문제축 `caption`·`accessibilityDescription`·`sourceConditions`·`newVisualInformation` 어디에도 카드쌍의 평균·기댓값·정답을 노출하지 않았다. 기존 `q16.svg`는 현재 직접 연결된 것이 아닌 변형본으로 따로 대조했다.
3. q11 기출 PNG와 유사 `q11-readable-v2.svg`는 왼쪽 A(중간 폭), 가운데 B(가장 좁고 높음), 오른쪽 C(가장 넓고 낮음)의 **상대 순서와 폭**이 일치한다. 공식 `stat-chart-figure-v1`의 평균 -2/0/2, 표준편차 1.2/0.7/1.8은 무단위 개형을 그리는 **대표 좌표**일 뿐 원문의 실측값이나 주어진 수치는 아니다. 곡선 라벨만 표시하고 평균·분산의 정답 비교는 문제 그림에 쓰지 않았다.
4. q04·q07·q12·q13·q14·q17·q18·q19·q23 정규확률은 실제 평균·표준편차, 양 끝 경계 및 단측/양측 음영을 `chart.curves/ticks/shades`와 패널로 대응시켰다. q19는 판별식 `W(W+4)≥0`의 **분리된 두 영역** `W≤-4`와 `W≥0`만 음영; 가운데 `(-4,0)`는 칠하지 않는다. q06은 정규화한 선형밀도 `f(x)=x/18`와 **실제 [2,4] 사다리꼴 영역**을 대조한다.
5. q16 직접 연결 SVG와 공식 엔진의 기존 생성 결과에는 불필요한 **흰색 전체 캔버스 rect**가 있다. plan에서 투명 배경을 지원한다는 근거가 없으므로 SVG를 손으로 고치거나 비공식 우회를 하지 않는다. **`ENGINE_CAPABILITY_PENDING:TRANSPARENT_CANVAS_OPTION`** — q16 관련. 다른 무관한 기능 `MULTI_CURVE_INVERSE_CUBIC`, `PIECEWISE_POLYNOMIAL_UPPERCASE_FUNCTION_NAME`은 요구되지 않는다.
6. 문제축은 수학적으로 필요한 시각적 **주어진 조건만** 그린다. 해설축의 계산값·확률 음영을 문제축에 미리 넣지 않았고, 표로 이미 표시된 이산분포나 순수 계산·조합 문제에는 그림을 억지로 만들지 않았다. 원 기출의 해설 SVG들은 직접 연결된 유사판 해설 그림이 아니므로 **기출을 제작 정본으로 오인하지 않는다**.

## 문항별 문제/해설 2축 감사

표의 `PASS(필드)`는 원문 수학 조건 및 공식 plan의 **그려질 필드**에 대한 정적 검증이다. 공식 SVG 화소 렌더 검사는 전부 `RENDER_NOT_RUN`. `—`는 해당 축에 실행형 plan이 없거나 그림이 면제된 상태다.

| 문항 | 문제 축 판정 | 해설 축 판정 | 원본 SVG | plan 파일 | STATIC_FIELD_PARITY | DRAWN_FEATURE_PARITY | 비고 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 01 | EXEMPT — 4개 질량의 합 조건이 텍스트에 완결 | EXEMPT — `3a+1/5=1` 계산만 필요 | — | — | N/A | N/A | 이산 질량함수 표 추가 불필요 |
| 02 | EXEMPT — 확률분포 HTML 표로 전체 값 제시 | EXEMPT — 기댓값 가중합 계산 | — | — | N/A | N/A | 표를 SVG로 중복하지 않음 |
| 03 | EXEMPT — 이항분포 모수 수식 완결 | EXEMPT — `np+np(1-p)` 계산 | — | — | N/A | N/A | 그래프 추가 이득 없음 |
| 04 | EXEMPT — 정규분포 구간과 표가 발문에 존재 | BENEFICIAL — 평균 기준 2개 확률 음영의 합 | — | `q04-solution.plan.json` | PASS | PASS(필드); RENDER_NOT_RUN | `N(18,4²)`, [14,18]와 [18,26]; 합 0.8185 |
| 05 | EXEMPT — 이산 분포 표/부등식 제시 | EXEMPT — `(X-3)(X-5)≤0` 표에서 선택 | — | — | N/A | N/A | 별도 좌표축 불필요 |
| 06 | EXEMPT — 선형 밀도 식/정의역 완결 | BENEFICIAL — [2,4] 사다리꼴 음영 및 정규화 직선 | — | `q06-solution.plan.json` | PASS | PASS(필드); RENDER_NOT_RUN | `f=x/18`, 영역 1/3; 조각 정의역 [0,6] |
| 07 | EXEMPT — 두 정규분포와 구간이 식에 주어짐 | BENEFICIAL — 동일 표준화 경계 대응 | — | `q07-solution.plan.json` | PASS | PASS(필드); RENDER_NOT_RUN | z구간 [-1,2], a=24 |
| 08 | EXEMPT — 5개 구슬의 중복 숫자가 텍스트에 완결 | EXEMPT — 두 구슬 곱의 경우별 도수 계산 | — | — | N/A | N/A | 도수 표를 별도 그림으로 복제 불필요 |
| 09 | REQUIRED — 4가로×3세로 도식 자체가 조건 | EXEMPT — 동일 격자로 폭·높이 조합 세기 가능 | `q09.svg` | `q09-problem.plan.json` | PASS | PASS(필드); RENDER_NOT_RUN | `ORIGINAL_EXAM_PNG_CONFLICT`: 기출은 3가로×3세로; 문제축 정답 비공개 |
| 10 | EXEMPT — 주사위·횟수·이항확률 텍스트 | EXEMPT — 확률 비 `P(X=1)/P(X=0)` 계산 | — | — | N/A | N/A | 도식 불필요 |
| 11 | REQUIRED — 3개 정규 곡선 상대 형상 비교가 발문 핵심 | EXEMPT — 문제 곡선만으로 중심·폭 판독 | `q11-readable-v2.svg` | `q11-problem.plan.json` | PASS | PASS(필드); RENDER_NOT_RUN | A/B/C 위치·폭·라벨, 대표 평균·σ는 무단위; 정답 순서 미표기 |
| 12 | EXEMPT — 이항분포·구간·표 주어짐 | BENEFICIAL — 정규근사 [45,60] 음영 2구간 | — | `q12-solution.plan.json` | PASS | PASS(필드); RENDER_NOT_RUN | `B(100,½)≈N(50,5²)`, z[-1,2] |
| 13 | EXEMPT — 대칭식과 표가 완결 | BENEFICIAL — m=22의 좌우 대칭 중앙 영역 | — | `q13-solution.plan.json` | PASS | PASS(필드); RENDER_NOT_RUN | [18,22], [22,26], 합 0.5762 |
| 14 | EXEMPT — 세 분포 모수·경계 모두 제시 | BENEFICIAL — 세 꼬리 영역을 나란히 비교 | — | `q14-solution.plan.json` | PASS | PASS(필드); RENDER_NOT_RUN | U z=-0.5, V z=1, T z=2 |
| 15 | EXEMPT — 5명 배열 제약을 발문에서 이해 가능 | EXEMPT — 주장 인접 공격수 경우 계산 | — | — | N/A | N/A | 불필요한 인물·장식 도형 배제 |
| 16 | REQUIRED — 5장 카드의 숫자·물리적 장수 확인 | EXEMPT — 끝 카드쌍 10개의 산술 계산 | `q16-problem-v2.svg` | `q16-problem.plan.json` | PASS | PASS(필드); RENDER_NOT_RUN | `ORIGINAL_EXAM_PNG_CONFLICT`: 기출 1,1,2,2,4 ↔ 유사 1,1,2,3,4. `ENGINE_CAPABILITY_PENDING:TRANSPARENT_CANVAS_OPTION` |
| 17 | EXEMPT — 전체 1200명과 분포·상위 순위가 텍스트에 제시 | BENEFICIAL — 상위 30% 오른쪽 꼬리 확인 | — | `q17-solution.plan.json` | PASS | PASS(필드); RENDER_NOT_RUN | 평균68·σ6·경계71.12 |
| 18 | EXEMPT — 이항시행·누적확률·표 완결 | BENEFICIAL — 정규근사 왼쪽 누적 음영 | — | `q18-solution.plan.json` | PASS | PASS(필드); RENDER_NOT_RUN | 평균144·σ6·상한150 |
| 19 | EXEMPT — 이차곡선·직선 및 정규분포 식이 충분 | BENEFICIAL — 판별식의 2개 서로소 확률 구간 | — | `q19-solution.plan.json` | PASS | PASS(필드); RENDER_NOT_RUN | `W≤-4` 또는 `W≥0`; 가운데 무음영 |
| 20 | EXEMPT — 동전 4개의 시행 절차가 서술됨 | EXEMPT — 금액 합 분포 세기 | — | — | N/A | N/A | 그림 없이 금액별 계수 계산 |
| 21 | EXEMPT — 복원추출·흰/검은 공의 수를 수식 제시 | EXEMPT — 이항계수 방정식 계산 | — | — | N/A | N/A | 본문 조건 완결 |
| 22 | EXEMPT — 집합 원소와 부분집합 선택 조건 제시 | EXEMPT — 유한 집합 경우 계산 | — | — | N/A | N/A | 집합표/벤다이어그램 중복 불필요 |
| 23 | EXEMPT — 주사위의 +3/-1 이동 규칙 완결 | BENEFICIAL — 400회 위치의 정규근사 누적 영역 | — | `q23-solution.plan.json` | PASS | PASS(필드); RENDER_NOT_RUN | 평균400·σ40·경계440, 0.8413 |

### 수학 재검산

- q04: `Φ(2)-Φ(-1)=0.4772+0.3413=0.8185`; q06: `∫₀⁶x/18 dx=1` 및 `∫₂⁴x/18 dx=1/3`; q07: Y의 하한 24는 z=-1.
- q09: 가로선 4개 중 2개·세로선 3개 중 2개 선택 = 18개 직사각형. q16: 5장 중 끝쌍 10개, 곱의 합 45→`E(-4X+8)=-10`.
- q12: `np=50`, `√np(1-p)=5`; q13: 대칭 중심 `44/2=22`; q14: 꼬리값 `0.6915>0.1587>0.0228`.
- q17: `360/1200=.3`, z=.52→71.12; q18: `192×.75=144`, `√(192×.75×.25)=6`, z=1→150; q19: 판별식 `W²+4W≥0`→양측 확률 `.0062+.6915=.6977`; q23: 한 번 이동 기대값 1·분산4, 400회 평균400·표준편차40→`Φ(1)=.8413`.
