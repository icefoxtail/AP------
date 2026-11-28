# 2022 순천고 1학기 기말 고2 수학Ⅰ 유사 — 공식 SVG production 2축 감사

## 범위·선정

- 현행 제작 기준: `archive/exams/similar/high/h2/1final/22_순천고_1학기_기말_고2_수학I_유사.js` **22문항·44축**. 고2 전체 과목·전 시기 범위의 미완료·비충돌 JS 가운데 앞선 매산고와 함께 이번 사이클의 두 번째 대상.
- 대조한 기출: `archive/assets/images/22_순천고_1학기_기말_고2_수학I/`의 q10·q11·q16·q17·q21 PNG, 각 해당 해설 SVG, q07·q08 해설 SVG; 직접 유사 `archive/assets/images/22_순천고_1학기_기말_고2_수학I_유사/`의 q10·q11·q16·q17 SVG, 레거시 `archive/exams/similar/high/h2/1final/22_순천고_1학기_기말_고2_수학I_유사_plans/`의 JSON 4개. 기존 공식 JSON은 **0개**.
- 문제축은 발문에서 주어진 조건만, 해설축은 풀잇법의 필요한 시각 관계를 **독립** 감사. `REQUIRED`는 복합 도형 관계의 전달이 그림에 의존, `BENEFICIAL`은 그림이 실질적 도움, `EXEMPT`는 글과 식이 충분함을 뜻한다.

## 22문항의 문제·해설 독립 판정

| 번호 | 문제축 | 해설축 |
|---|---|---|
| 01 | EXEMPT — sin x의 대칭·평행이동을 식으로 완전 규정. | EXEMPT — −sin(x+π/2)=−cos x 항등식 계산. |
| 02 | EXEMPT — A=60°, B=45°, b=√6가 문장으로 충분. | EXEMPT — 사인법칙 한 번 대입. |
| 03 | EXEMPT — a₃=5, a₈−a₂=18의 등차식. | EXEMPT — d=3, a₉=23 계산. |
| 04 | EXEMPT — x−2,x+1,2x+5가 등비. | EXEMPT — 이차방정식의 근 합. |
| 05 | EXEMPT — 등비수열 첫 두 항 1,2. | EXEMPT — S₆=63 합 공식. |
| 06 | EXEMPT — Σk(k+1)(k+2). | EXEMPT — 네 항을 직접 더한다. |
| 07 | EXEMPT — tan x 범위와 정의역이 수식으로 주어짐. | EXEMPT — 단조성에 따른 −π/4~π/3 경계 계산. |
| 08 | EXEMPT — tan 2x의 정의역·치역·대칭성 설명 판단. | EXEMPT — 주기와 점근선의 식으로 진위 판정. |
| 09 | EXEMPT — 삼각방정식과 0≤x<2π의 범위. | EXEMPT — 삼각함수 항등식으로 해결. |
| 10 | **BENEFICIAL** — 같은 원 위 A,B,C,D, BD=6, CD=3를 표시: `q10-problem.plan.json`. | EXEMPT — BD/sin∠DAB=15/2 및 CD/(2R)의 사인법칙. |
| 11 | **BENEFICIAL** — R=10 외접원, BC=a=12, CA=b, AB=c: `q11-problem.plan.json`. | EXEMPT — b²+c²≥2bc와 cos A 부호 비교를 대수로 설명. |
| 12 | EXEMPT — 홀수·짝수항 두 유한합의 비. | EXEMPT — 공비 r=10/5. |
| 13 | EXEMPT — 부분합 n²+n과 짝수항 부분합. | EXEMPT — a_n=2n 후 합 공식. |
| 14 | EXEMPT — a₁=0 및 등차수열 관계식. | EXEMPT — b_n=(n−1)/2로 계산. |
| 15 | EXEMPT — 몫과 나머지가 같은 정수의 집합 정의. | EXEMPT — (n+1)k의 합, 등비 아닌 정수 연산. |
| 16 | **BENEFICIAL** — 진행 방향 P→Q에서 A·B 방위각 15°/45°/60°/90°: `q16-problem.plan.json`. | EXEMPT — 사인법칙·코사인법칙을 통해 거리 13.2km 계산. |
| 17 | **REQUIRED** — D∈AB, C∈BE, 두 직각·∠DAC=30°·EC=BD의 결합 관계: `q17-problem.plan.json`. | EXEMPT — 두 직각삼각형의 피타고라스·코사인법칙 연립. |
| 18 | EXEMPT — 절댓값 부분합 S₃,S₆,S₁₂의 수식. | EXEMPT — 두 대수적 부호 분기의 계산. |
| 19 | EXEMPT — a^(log₃16)=2ⁿ 조건. | EXEMPT — 로그의 밑변환과 등비수열. |
| 20 | EXEMPT — S_n=3n²−2n+4의 지정 항. | EXEMPT — S_n−S_{n−1} 차분. |
| 21 | EXEMPT — P=(3,0), Q는 x²+y²=9를 반시계 이동, f(t)=−3PQ+4의 전 조건이 말·식으로 충분. | EXEMPT — 원 둘레 6π와 현 길이 0~6의 극값 비교. |
| 22 | EXEMPT — a_k∈{0,1,2}, 합·제곱합 조건. | EXEMPT — 1과 2의 개수 연립방정식. |

**계:** 22문항·44축, `REQUIRED 1 / BENEFICIAL 3 / EXEMPT 40`. 공식 실행형 JSON **4개(모두 문제축)**, 레거시 검증본을 공식 폴더에 신규 반영. 기존 공식 plan 수정 0·보존 0.

## 기출과 현행 유사 사이의 경계

- `ORIGINAL_EXAM_PNG_CONFLICT`: 기출 `q17.png`에는 AC=4로 인쇄되지만 현행 유사 JS·직접 유사 SVG는 **AC=6**이다. 기출 `q16.png`의 네 방위각 그림은 비교용이며 현행 유사의 주행속도·시간·각 조건이 제작 기준이다. 기출 수치·해설 수치를 기계적으로 복사하지 않았다.
- 원본 `q10`, `q11`, `q16`, `q17`, `q21` 문제 PNG 및 해당 해설 SVG와 직접 연결 유사 SVG를 분리 대조했다. 이 stem에는 확인된 `-v2`, `-v3` 해설 SVG 변형본이 없어 **`ORIGINAL_EXAM_SVG_VARIANT_CONFLICT`는 없음**. 다른 시험지의 SVG 버전 사실을 전용 코드로 복사하지 않음.
- `CONTENT_CONFLICT_SOURCE`: 현행 JS의 해당 그림 문제에서 별도의 원문·정답·해설 모순 확인 없음. 그림 원문과 관계없는 단원 메타데이터는 변경하지 않았다.
- `ENGINE_CAPABILITY_PENDING`: **없음**. 네 그림의 원·원주사각형·방위각·직각·등길이 표시는 공식 `construction-spike-v1`이 지원한다.

## 독립 수학 검산 및 단계별 검증

- `q10-problem`: BD=6, sin∠DAB=4/5이면 외접원 지름 2R=15/2. CD=3의 대응 원주각 sin∠DAC=3/(15/2)=2/5(선택 ⑤). 문제축에는 계산된 각의 사인값을 노출하지 않는다.
- `q11-problem`: R=10, a=12에서 sin A=3/5, cos A=±4/5. 코사인법칙과 b²+c²≥2bc에 의해 bc≤360(예각), 둔각이면 ≤40. 큰 호 중점에서 b=c 등호 가능, 정답 ⑤=360. 문제축은 b,c를 기호로만 표기.
- `q16-problem`: P=(0,0), Q=(0,10), R=(0,15), B=(10,10), A=((5√3−15)/2,(15+5√3)/2)는 각각 P에서 15°/45°, Q에서 60°/90°를 구현한다. PQ=10km; PA=5√6, PB=10√2, ∠APB=60°, AB²=350−100√3≈180, √5≈2.2로 답 13.2km(③). 90° 작은 정사각형은 **이미** 공식 `rightAngles`에 포함되어 있다.
- `q17-problem`: 그림에 ∠AEC=∠ACD=90°에 대한 `rightAngles` **2개가 이미 존재**, EC=BD 동길이 눈금과 AC=6, ∠DAC=30°를 확인. AD=4√3, CD=2√3. BD=EC=x, BC=y를 놓고 피타고라스 및 120° 코사인법칙을 소거하면 y=3√3(①). 원문 기출 AC=4를 유사 plan에 사용하지 않음.
- 비도형 문항의 독립 표본 재검산: q01 y=−cos x, q03 a₉=23, q05 S₆=63, q21 주기 6π·최댓값 4·최솟값 −14에서 a+b+c=−4.
- `STATIC_FIELD_PARITY`: **4/4 PASS** — 각도, 점/선/원, 수치, `sourceConditions`, 접근성 설명 및 직접 유사 SVG 일치.
- `DRAWN_FEATURE_PARITY`: **4/4 STATIC_INVENTORY_PASS** — 원주점·변 길이·호, 직각 90°, 방향각 15/45/60°, 동일 길이 기호 등의 엔진 필드 확인. **실제 생성 SVG의 시각 검수는 하지 못했으므로 `ACTUAL_SVG_VISUAL_REVIEW_NOT_RUN`**.
- JSON 파싱·공식 엔진 계약 검증, Shallow lint **4/4 PASS**, Full lint **4/4 PASS**. Chromium 실행 경로를 새로 확인했으나 `/usr/lib/chromium/chromium`이 없고 `/usr/bin/chromium`은 실패하는 래퍼이므로 실제 SVG 렌더 **4/4 `RENDER_NOT_RUN`**; 실제 픽셀·레이아웃 판정도 `NOT_RUN`.
