# 2022 금당고 1학기 기말 고2 수학Ⅰ 유사 — 공식 SVG production 2축 감사

## 대상·비교 범위

- 현행 제작 기준: `archive/exams/similar/high/h2/1final/22_금당고_1학기_기말_고2_수학I_유사.js`, 20문항/40축.
- 대응 원본 `archive/exams/original/high/h2/1final/22_금당고_1학기_기말_고2_수학I.js`; 기출 PNG `q03`, `q08`, `q13`, `q14`; 기출 해설 SVG `q8`, `q14`, `q15`, `q17`, `q19`; 직접 연결된 유사 SVG `q03-problem`, `q08-problem`, `q14-problem`; 현행 유사 `_plans/` 및 공식 production 폴더 확인(기존 공식 plan 0개).
- 문제축은 원문에 주어진 사실만 시각화하며 해설축은 풀이의 결정적 기하·그래프 관계를 독립 판정한다. 판정 `REQUIRED`/`BENEFICIAL`/`EXEMPT`의 뜻은 직전 시험지와 동일하다.

## 전 문항의 문제축·해설축 독립 판정

| 번호 | 문제축 판정과 근거 | 해설축 판정과 근거·공식 plan |
|---|---|---|
| 01 | EXEMPT — cos 3x의 주기만 묻는다. | EXEMPT — 2π/3의 공식 대입이다. |
| 02 | EXEMPT — sin x=√3/2와 범위가 완전한 수식이다. | EXEMPT — π/3, 2π/3의 합을 직접 구한다. |
| 03 | **BENEFICIAL** — 직접 연결 SVG의 △ABC에서 AB=6, AC=5, 끼인각 θ를 같이 표시: `q03-problem.plan.json`. | EXEMPT — 넓이는 1/2·6·5·(1/3)의 한 번 대입이다. |
| 04 | EXEMPT — 등차수열 첫 항·공차·8항 위치가 명시된다. | EXEMPT — a8=5+7(−3)의 계산이다. |
| 05 | EXEMPT — 두 시그마 합과 계수의 선형결합이다. | EXEMPT — 합의 분배 법칙만 이용한다. |
| 06 | EXEMPT — a cos bx+c의 최댓값·최솟값·주기와 부호가 명시된다. | EXEMPT — 진폭·중심선·주기에서 a,b,c를 대수로 결정한다. |
| 07 | EXEMPT — 정의역과 sin²x−6sin x+5의 식이 충분하다. | EXEMPT — t=sin x∈[0,1]로 치환 후 감소 이차식을 계산한다. |
| 08 | **BENEFICIAL** — A=60°, B=75°, AB=6인 △ABC와 외접원을 정확히 배치: `q08-problem.plan.json`. | EXEMPT — 빠진 각 45°와 사인법칙으로 반지름을 구한다. |
| 09 | EXEMPT — 등차·등비 조건에 수가 직접 주어진다. | EXEMPT — a²=2(12−a)와 a<0으로 유일값을 계산한다. |
| 10 | EXEMPT — 명시된 유리식의 유한합이다. | EXEMPT — 1/(2k−1)−1/(2k+1)의 망원합이다. |
| 11 | EXEMPT — 이차방정식의 세 계수와 중근 조건이 모두 문장에 있다. | EXEMPT — 판별식 0과 사인법칙이 피타고라스 관계를 준다. |
| 12 | EXEMPT — 공비 9·첫 항 3과 로그 합 조건이 수식으로 완결된다. | EXEMPT — log_27 a_k=(2k−1)/3의 등식이다. |
| 13 | EXEMPT — 현행 JS는 0,π의 영점, 그 사이 무영점, 두 함수의 공동점 x=π/3을 문장으로 명시한다. | **BENEFICIAL / ENGINE_CAPABILITY_PENDING** — 원본처럼 y=tan x의 점근선과 y=a sin bx를 한 축에 함께 보이고 공통점 (π/3,c)을 드러내면 유익하다. 현행 공식 삼각함수 capability는 TAN과 SIN의 서로 다른 두 곡선을 공통 축·교점으로 동시에 그리지 못하므로 임의 근사 plan 미작성. |
| 14 | **BENEFICIAL** — 지름 AB=6인 윗반원, 원주점 C, 밑각 α·β를 표시: `q14-problem.plan.json`. | **BENEFICIAL** — 중점 O·세 반지름·C의 직각을 추가해 cos 2β와 변 AC의 관계를 설명: `q14-solution.plan.json`. |
| 15 | EXEMPT — 원문 sin(πx/2^n)≥1/2과 정수의 범위가 수식으로 주어진다. | **BENEFICIAL** — 한 주기의 사인곡선·y=1/2 수평선·π/6,5π/6 경계를 보여 줌: `q15-solution.plan.json`. |
| 16 | EXEMPT — 등차수열 S_l=S_m의 순서쌍 개수와 S_n=0의 짝수 조건이 문장으로 충분하다. | EXEMPT — l+m=K가 11 또는 12인 정수쌍 계산이다. |
| 17 | EXEMPT — tan x=sin x와 열린/닫힌 구간이 완결된 함수식이다. | EXEMPT — sin x(1−cos x)=0의 정수배 π 해만 세면 된다. |
| 18 | EXEMPT — 점화식의 정수/비정수 분기가 정확히 주어진다. | EXEMPT — a5=6에서 7주기 항을 역추적·합산한 수열식이다. |
| 19 | EXEMPT — sin x=4/n 및 0<x<nπ 조건이 충분하다. | **BENEFICIAL** — n=6 대표 경우 양의 세 반주기에 두 근씩 생겨 총 여섯 교점임을 보여 줌: `q19-solution.plan.json`. |
| 20 | EXEMPT — 모든 양의 항·S_n 제곱근 점화 관계가 수식으로 완성된다. | EXEMPT — √S_n의 등차성으로 a25를 계산한다. |

**합계:** 20문항 / 40축 = REQUIRED **0**, BENEFICIAL **7**(제작 6, 엔진 대기 1), EXEMPT **33**. 실행형 공식 plan **6개**(문제 3, 해설 3), 전부 신규이며 기존 수정·교체 0개.

## 기출 PNG/SVG 변형본·유사 SVG·레거시 대조

| 코드 | 실제 근거 |
|---|---|
| `ORIGINAL_EXAM_PNG_CONFLICT` | 기출 `q03.png`는 AB=4, AC=3, sinθ=1/2, 현행 유사 JS·직접 유사 SVG는 AB=6, AC=5, sinθ=1/3이다. 기출 `q08.png`는 A=75°, B=45°, AB=4인데 현행은 A=60°, B=75°, AB=6. `q14.png` 기출은 AB=4, sin(α−β)=−1/8, 현행은 AB=6, −1/9. `q13.png` 기출은 두 그래프가 주어진 반면 현행 유사는 영점·무영점 조건을 글로 다시 정의했다. |
| `ORIGINAL_EXAM_SVG_VARIANT_CONFLICT` | 기출 `q14-solution.svg`는 옛 반원 지름/각 관계, `q15-solution.svg`는 cos(πx/2^n)≤−1/2 및 n≤8, `q19-solution.svg`는 sin x=3/n 및 n≤9의 예를 다룬다. 현행은 각각 지름6/−1/9, sin≥1/2 및 n≤7, sin x=4/n 및 n≤10이다. 기출 수치를 유사 plan에 붙이지 않았다. |
| 직접 연결 유사 SVG | `q03-problem.svg` title/desc의 6·5·θ, `q08-problem.svg`의 60°·75°·AB6 및 외접원, `q14-problem.svg`의 윗반원·α·β·AB6를 텍스트와 대조했다. 신규 공식 JSON에서 동일한 눈에 보이는 사실을 재현하도록 필드화했다. |
| 레거시/기존 공식 plan | 이번 stem에 기존 공식 plan은 없고 새로운 JSON 6개를 추가했다. 원본 SVG와 유사 SVG는 참조만 하고 SVG 태그를 변경하지 않았다. |
| `CONTENT_CONFLICT_SOURCE` | 이 시험지의 현행 JS에 새로 확정된 발문·정답·해설 모순 없음(아래 독립 계산). |

## 정적 필드·그려지는 요소와 수학 독립 검산

- `q03-problem`: A=(0,0), B=(6,0), C=(10√2/3,5/3)로 AC²=25, sin∠BAC=1/3을 독립 확인. △ABC 넓이 5. 문제 그림에는 결과값 5를 쓰지 않았다.
- `q08-problem`: AB=6, A에서 60°·B에서 75°의 두 반직선 교점 C 및 외접원(`CIRCLE_THROUGH_3`). C=45°, 확장 사인법칙 R=3√2를 독립 확인. 답의 반지름은 문제축에 표시하지 않는다.
- `q14-problem/solution`: A=(−3,0), B=(3,0), C=(1/3,4√5/3)이 OC²=9, (A−C)·(B−C)=0을 만족한다. cos2β=−1/9, AC²=20, sinβ=√5/3, 최종값 −√5/3. 문제축은 각의 미지값·반지름·직각 풀이 표시를 숨기고, 해설축에 O·OC와 C 직각을 추가했다.
- `q15-solution`: 치환 t=πx/2^n에서 sin t≥1/2의 경계는 π/6,5π/6. 정수 구간 열거 a1..a7=[1,3,5,11,21,43,85], 합 169. 공식 그래프에는 정수 x의 최종 합을 쓰지 않았다.
- `q19-solution`: n=6으로 보면 0<x<6π에 양의 반주기 세 개, y=2/3 교점 6개. 원문 n=1..10의 a_n=[0,0,0,2,6,6,8,8,10,10], 합 50.
- `q13` 독립 해설 검산: 0과 π만 영점이고 사이에 영점이 없으므로 양수 b=1, tan(π/3)=√3, a=2, a+b+c²=6. 하지만 두 종류의 삼각함수 곡선을 동시에 그리는 공식 기능이 없어 plan 미작성.
- `q16` K=11,12 중 S_K=0의 짝수 조건에서 K=12, a1=−22, S18=216. `q18`의 역추적 최소 a1=−24와 a5..a11 일곱 항의 합 69/4로 최종 183. `q20`의 √S_n=2n에서 a25=196을 재계산했다.
- `STATIC_FIELD_PARITY`: **6/6 PASS**. 식·계수·sin 경계·점 좌표·반원 원호 방향·각도와 공식 plan 필드를 대조했다.
- `DRAWN_FEATURE_PARITY`: **6/6 STATIC_INVENTORY_PASS**, **ACTUAL_SVG_NOT_OBSERVED**. 원·반원 호·원주점·직각·각 호·치수선·사인 기준선·교점 등 그려지는 필드 존재를 대조했으며 실제 SVG/PNG 시각 판정은 수행하지 못했다. q13 엔진 대기는 PASS 분모에 포함하지 않는다.
- 공식 JSON Schema·`plan-lint.cjs` Shallow/Full **6/6 PASS**. Chromium 재검사에서 `/usr/bin/chromium`은 래퍼만, `/usr/lib/chromium/chromium` 부재로 종료 127. 공식 SVG 렌더 **6/6 `RENDER_NOT_RUN`**, 시각·학생 화면 `NOT_RUN`.
- 실제 기능 공백: **`ENGINE_CAPABILITY_PENDING:PAIRED_TRIG_TAN_SIN_SHARED_AXES_WITH_ASYMPTOTES_AND_INTERSECTION`** — q13 해설에만 해당. 유관하지 않은 투명 캔버스 옵션이나 다른 시험지 기능 요청을 복사하지 않음.
