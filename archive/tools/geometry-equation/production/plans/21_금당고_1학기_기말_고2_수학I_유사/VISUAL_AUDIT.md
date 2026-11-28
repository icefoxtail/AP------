# 2021 금당고 1학기 기말 고2 수학Ⅰ 유사 — 공식 SVG production 2축 감사

## 대상·근거

- 현행 제작 기준: `archive/exams/similar/high/h2/1final/21_금당고_1학기_기말_고2_수학I_유사.js`의 22문항 전체(문제 22축, 해설 22축).
- 대조: 대응 `archive/exams/original/high/h2/1final/21_금당고_1학기_기말_고2_수학I.js`; 해당 기출 이미지 `q17.png`, `q20.png`; 기출 해설 SVG `q1`, `q13`, `q14`, `q16`, `q17`, `q19`, `q20`, `q22`; 직접 연결된 유사 SVG `q20-problem.svg`. 기출·유사 시험지 옆 레거시 `_plans/` 및 공식 production 폴더 조사(이번 stem의 기존 공식 plan 0개).
- 판정 의미: **REQUIRED** = 그림이 필수 조건 전달에 필요, **BENEFICIAL** = 실제 해설/문제 이해에 도움, **EXEMPT** = 독립 SVG 없이 텍스트와 수식으로 충분. 문제와 해설은 별도 판정했다.

## 모든 문항의 문제축 / 해설축

| 번호 | 문제축 판정과 근거 | 해설축 판정과 근거·공식 plan |
|---|---|---|
| 01 | EXEMPT — cos x=-1/2, 0≤x<2π가 텍스트로 완전하다. | EXEMPT — 두 정확한 각을 삼각함수 값으로 바로 열거한다. |
| 02 | EXEMPT — 정수 x와 tan의 정의역만 판별한다. | EXEMPT — 홀수 x의 미정의·짝수 x의 값 0을 직접 분류한다. |
| 03 | EXEMPT — 두 각의 sin·cos 수치 계산이다. | EXEMPT — 덧셈정리와 특수각으로 끝나는 식이다. |
| 04 | EXEMPT — 두 변 8,5 및 sin A가 명시되어 별도 도형 없이 넓이가 결정된다. | EXEMPT — 1/2·bc·sin A의 단일 공식 대입이다. |
| 05 | EXEMPT — 등차수열의 세 위치값만 필요하다. | EXEMPT — a4는 a2와 a6의 산술중항이다. |
| 06 | EXEMPT — 합 Sn이 식으로 주어진다. | EXEMPT — S1, S3−S2의 단순 뺄셈이다. |
| 07 | EXEMPT — 다섯 항의 등비 조건과 r⁴=81로 충분하다. | EXEMPT — r=±3 두 경우의 합을 계산만 비교한다. |
| 08 | EXEMPT — S3=S7과 a1=8이 완전히 명시된다. | EXEMPT — a5>0>a6으로 최대 S5가 결정된다. |
| 09 | EXEMPT — 합의 각 항이 유리식이다. | EXEMPT — 1/(k+1)−1/(k+2)의 망원합이다. |
| 10 | EXEMPT — 삼각형의 두 변 문자와 이차방정식 조건이 충분하다. | EXEMPT — 판별식 0과 사인법칙에서 b=c를 도출한다. |
| 11 | EXEMPT — 두 항의 합 두 개만 주어진다. | EXEMPT — 등차수열의 공차 계산으로 끝난다. |
| 12 | EXEMPT — 20km·0.9의 등비 여행거리 조건이 완전하다. | EXEMPT — 30항 등비급수 공식 한 번 대입한다. |
| 13 | EXEMPT — 원에 내접한다는 사실과 네 변 길이가 전부 명시된다. | EXEMPT — 맞은편 내각의 합 π와 대각선 AC 코사인법칙으로 식이 완결된다. |
| 14 | EXEMPT — 넓이 16, B=30°, 최소화 대상이 모두 문장에 있다. | EXEMPT — xy=64 및 x²+y²≥2xy의 등호 조건 계산이다. |
| 15 | EXEMPT — 첫·끝 네 항의 합과 전체 합 조건이 완전하다. | EXEMPT — 앞뒤 대칭 합을 이용한 등차수열의 식이다. |
| 16 | EXEMPT — 원문의 사인함수·정의역·수평선과 구할 넓이가 수식으로 주어진다. | **BENEFICIAL** — 세 교점과 최대 밑변·높이 관계를 확인: `q16-solution.plan.json`. |
| 17 | EXEMPT — A 좌표·원·P의 사분면·Q의 같은 거리 조건이 전부 문장에 있다. | **BENEFICIAL** — 같은 현 PA=PQ와 중심 O의 반지름이 만드는 이등분선을 확인: `q17-solution.plan.json`. |
| 18 | EXEMPT — 퇴직금·이율·기간이 산술 조건으로 명시된다. | EXEMPT — 미래가치와 연금합의 등식 대입이다. |
| 19 | EXEMPT — sin x 치환 전 이차식과 구간이 수식으로 충분하다. | **BENEFICIAL** — t∈[0,1]의 이차 포물선 꼭짓점·k 경계 두 높이를 비교: `q19-solution.plan.json`. |
| 20 | **REQUIRED** — 직접 연결된 그림의 평행사변형·네 이등분선·P,Q,R,S와 구할 영역이 문제의 위치 조건이다: `q20-problem.plan.json`. | **BENEFICIAL** — A의 이등분선과 BC의 교점 E, P의 직각 및 △ABE·△ABP 넓이 관계: `q20-solution.plan.json`. |
| 21 | EXEMPT — a_n=2n의 항과 합 한계가 명시된다. | EXEMPT — 연속 분모의 부분분수 망원합으로 끝난다. |
| 22 | EXEMPT — 조각함수의 두 식, 삼각형 세 꼭짓점과 정수점 조건이 문장으로 완전하다. | **BENEFICIAL / ENGINE_CAPABILITY_PENDING** — y=2x²(x<0), y=√x(x≥0), 이동하는 삼각형의 위 경계 y=n−\|x\|, 정수점 세기가 하나의 좌표 도식에 필요하다. 공식 엔진의 단일 지원 capability에는 이 복합 경계·열별 격자점·n=1..8 분할 계산을 함께 보이는 기능이 없다. 미지원 근사 plan은 만들지 않음. |

**합계:** 22문항 / 44축 = REQUIRED **1**, BENEFICIAL **5**(제작 4, 엔진 대기 1), EXEMPT **38**. 실행형 공식 plan **5개**(문제 1, 해설 4), 모두 신규이며 기존 수정·교체 **0개**.

## 원본 그림과 직접 연결 유사본 대조

| 코드 | 실제 대조 결과 |
|---|---|
| `ORIGINAL_EXAM_PNG_CONFLICT` | 기출 `q17.png`의 원은 x²+y²=1, A=(-1,0)인데 현행 유사 JS는 x²+y²=4, A=(-2,0)이다. 기출 `q20.png`는 AB=5, BC=7, 넓이 28인 평행사변형, 현행 유사는 AB=3, BC=7, 넓이 14. 기존 기출 치수를 신규 plan에 옮기지 않았다. |
| `ORIGINAL_EXAM_SVG_VARIANT_CONFLICT` | 기출 `q16-solution.svg`와 JS는 (x−π)/4·[0,10π], 현행 유사는 (x−π)/3·[0,8π]. 기출 `q19-solution.svg`는 1−2sin²x+sin x, 현행 유사는 2−4sin²x+2sin x. 기출 `q20-solution.svg`와 `q22-solution.svg` 역시 각각 다른 변·넓이 및 왼쪽 조각계수 x²를 다룬다. 현행 JS를 기준으로 새 plan을 계산했다. |
| 직접 연결 유사 SVG | 유사 `q20-problem.svg`의 title/desc는 AB=3·BC=7과 중앙 회색 PQRS를 설명한다. 다만 단순 내부 도식의 위치·교차점 배치와 달리 실제 조건에서 계산한 네 이등분선의 교점은 일부가 바깥에 올 수 있다. 공식 plan은 정확한 교점을 작도하고 PQRS만 LIGHT로 칠한다. |
| 레거시/기존 공식 plan | 현행 유사의 직접 `_plans/`와 공식 production plan은 대상 stem에 0개. 신규 5개만 추가했다. |
| `CONTENT_CONFLICT_SOURCE` | 이번 시험지에서 별도로 확정된 현행 JS 발문·정답·해설 수학 충돌 없음(계산 증거 아래). |

## 수학 독립 검산·필드 및 실제 그려진 정보 상태

- `q16-solution`: 2sin((x−π)/3)=1의 세 교점 x=3π/2,7π/2,15π/2; 최대 밑변 6π, 최대 높이 3, 최댓넓이 9π. trig 원함수 계수·phasePi·INTERVAL_PI·referenceLines의 3교점을 재확인.
- `q17-solution`: 대표 P=(6/5,8/5), Q=(14/25,−48/25), A=(−2,0). OA²=OP²=OQ²=4, PA²=PQ²=64/5; f(π/3)=2π/3, g(π/3)=12, 곱 8π. 대표점 좌표는 해설 SVG에 숫자 라벨로 드러내지 않는다.
- `q19-solution`: k=2+2t−4t² (0≤t≤1), 꼭짓점 (1/4,9/4); k∈[2,9/4)일 때 x의 실근은 네 개, a+4b=11. 두 y값과 꼭짓점을 JSON 필드에 보존.
- `q20-problem/solution`: 정확한 대표 A=(0,0), B=(√5,2), C=(7+√5,2), D=(7,0)이 AB=3, BC=7, 넓이 14를 충족. 엔진의 `ANGLE_BISECTOR` 네 직선과 `LINE_INTERSECTION` 네 점으로 구한 PQRS의 넓이는 독립 벡터 행렬식 계산에서 16/3, p+q=19. E는 A 이등분선과 BC의 교점, AP=PE, ∠APB=90°; 문제축 설명문에는 최종 넓이·풀이 중간값을 넣지 않았다.
- `q22` 정수점 독립 열거: n=1..8에서 A_n=[2,4,7,11,16,22,28,35], 합=125. 지원되는 그래프 능력의 일부만 조합하여 전체 그림인 양 흉내 내지 않는다.
- `STATIC_FIELD_PARITY`: **5/5 PASS**(원문 수치·그려지는 좌표·선분·표식·교점과 plan의 정확한 계수·노드 확인).
- `DRAWN_FEATURE_PARITY`: **5/5 STATIC_INVENTORY_PASS**, **ACTUAL_SVG_NOT_OBSERVED**. 도형의 선·점·원·호·각·영역 필드를 대조했으나 실제 SVG 렌더를 열어 본 시각 PASS가 아니다. q22는 지원 공백이므로 parity PASS 분모에 넣지 않았다.
- 공식 Schema/JSON 및 `plan-lint.cjs`: shallow/full **5/5 PASS**. Chromium 실행 재확인: `/usr/bin/chromium` 래퍼는 있으나 `/usr/lib/chromium/chromium`이 없어 종료 코드 127. 공식 렌더 **5/5 `RENDER_NOT_RUN`**, 학생 화면·PNG 육안검수 `NOT_RUN`.
- 실제 엔진 부족: `ENGINE_CAPABILITY_PENDING:INTEGRATED_PIECEWISE_QUADRATIC_SQRT_TRIANGLE_LATTICE_COLUMNS` — q22 해설에만 해당. `TRANSPARENT_CANVAS_OPTION` 등 다른 시험지 요청을 복사하지 않았다.
