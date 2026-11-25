# 2023 복성고 고2 수학Ⅰ 1학기 중간 유사 — SVG plan 2축 판정

- **배치:** `archive/exams/similar/high/h2/1mid/23_복성고_1학기_중간_고2_수학I_유사.js`의 **22문항(q01–q22)**, 문제/해설 **44축**. `23_부영여고_1학기_중간_고2_수학I_유사.js`의 **21문항은 다음 배치**, 변경하지 않음.
- **원문 SHA-256:** `0d2b4820c2a77cc098e2faaf39f933c24b60980b0311afb8d2da7c94182c6e22` (본 배치 시작 시 `main`).
- 문제 그림에는 질문의 최종 수치 해답·선택지 정답을 쓰지 않는다. 해설 그림에는 풀이 결과값을 쓸 수 있다. 면 채움 기본 없음. 모든 신규 제작물은 선언적 엔진 plan JSON이고 직접 SVG 코드를 만들지 않는다.
- `DRAWN_FEATURE_PARITY=PASS`는 sourceConditions 및 원문 수학과 실제 엔진 그리기 필드(곡선 계수, point/segment/angle/label/marker, 범위)의 1:1 대조 결과다. SVG/PNG 육안 검수·학생화면·A4/크롭은 **NOT_RUN**으로 별도 기록한다.

## 전 문항 문제·해설 2축 판정

| qid | 문제축 | 해설축 |
|---|---|---|
| 01 | EXEMPT — 특수각 삼각함수의 수치 대입 | EXEMPT — sin(π/6), tan(π/4) 단순식 |
| 02 | EXEMPT — 밑이 같은 로그의 차 | EXEMPT — 로그법칙 수치 계산 |
| 03 | EXEMPT — 거듭제곱근의 지수 변환 | EXEMPT — 지수법칙 대수 계산 |
| 04 | EXEMPT — tanθ와 1/cos²θ의 항등식 | EXEMPT — 1+tan²θ 직접 대입 |
| 05 | EXEMPT — 거듭제곱근 참거짓 선지 | EXEMPT — 허근·실근에 대한 식 판단; 별도 평면도 장식 |
| 06 | BENEFICIAL — `q06-problem.plan.json`; 두 지수곡선과 x=1의 미지 높이 점 | BENEFICIAL — `q06-solution.plan.json`; (1,13) 표시 |
| 07 | EXEMPT — 그래프를 미리 그리면 옳은 선택지(점근선)를 노출 | BENEFICIAL — `q07-solution.plan.json`; 점근선 x=4, 점 (5,3), 증가 |
| 08 | EXEMPT — 로그·지수 등가식 | EXEMPT — 로그 밑변환의 지수 계산 |
| 09 | EXEMPT — 문제에서 중심각을 묻고 이미 호·넓이 값이 주어짐; 각 모양을 확정하면 정답 유출 가능 | ENGINE_CAPABILITY_PENDING — **부채꼴의 실제 호 길이 6π cm와 내부 넓이 24π cm²를 면 채움 없이 표시하는 엔진 표식·리더와 중심각 3π/4, 반지름 8의 동시 대조** 필요 |
| 10 | EXEMPT — 이차방정식 두 근의 로그식 | EXEMPT — 비에타 정리와 밑변환 계산 |
| 11 | EXEMPT — 보기를 판정하는 사분면 표시 자체가 선택지 참거짓 노출 | BENEFICIAL — `q11-solution.plan.json`; 정확한 대표 θ=5π/3, θ/2=5π/6 동경 |
| 12 | EXEMPT — 두 지수식의 대칭적 합 조건 | EXEMPT — 양수 치환·합제곱 공식 |
| 13 | BENEFICIAL — `q13-problem.plan.json`; 원문 두 지수곡선과 y=1,9만 | BENEFICIAL — `q13-solution.plan.json`; 가로 3, 세로 8을 실제 선분 길이로 표기 |
| 14 | EXEMPT — 소리 크기·거리의 로그 비율 계산; 스피커 그림 장식 | EXEMPT — 수치 대입에 의해 S₂=56 |
| 15 | EXEMPT — 매년 10% 감가의 단일 지수부등식 | EXEMPT — 로그 근삿값으로 최초 정수 연도 계산; 연속 그래프는 연도별 이산 관계를 혼동시킴 |
| 16 | EXEMPT — 로그 값의 정수 배수 제약 | EXEMPT — 로그 밑변환 및 배수 조건 대수식 |
| 17 | EXEMPT — logₓ y의 관계를 미지 두 실수에서 푸는 식 | BENEFICIAL — `q17-solution.plan.json`; x>1 열린 경계와 꼭짓점 (3,9) |
| 18 | EXEMPT — 미정 상수 k가 있는 합성함수식, 문제에서 정답 곡선을 미리 특정하지 않음 | ENGINE_CAPABILITY_PENDING — **중첩 지수 4^(k+2−2^x)−2의 정확한 곡선과 정의역 [−1,1], 해설에서 구한 4^k=8, 양끝 높이 6·62**를 하나의 graph plan으로 그릴 기능 필요 |
| 19 | EXEMPT — 미지 밑 0<b<1인 지수함수 순서 비교 | EXEMPT — 감소성만으로 bᵃ<bᵇ<1; 임의의 b 그림은 추가 가정 |
| 20 | EXEMPT — 제2사분면과 삼각함수 세제곱식, 정답용 근호 좌표 선공개 불필요 | BENEFICIAL — `q20-solution.plan.json`; 정확한 근호 성분과 사분면 표시 |
| 21 | BENEFICIAL — `q21-problem.plan.json`; 두 영점 및 제1사분면 교점의 위치만 | BENEFICIAL — `q21-solution.plan.json`; 포물선 대 직선, 교점 x=−13/4,2 및 양의 정수 1,2 |
| 22 | EXEMPT — 문자 로그부등식으로 발문 완결 | BENEFICIAL — `q22-solution.plan.json`; 두 밑 경우별 열린·닫힌 구간과 무한 반직선 |

## 작성한 엔진 plan의 실제 필드 검수

| plan | 원문과 실제 그려지는 필드의 대조 | shallow | full | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|
| q06-problem | `curves` y=3ˣ, y=3^(x+1)+4; x=1인 `points.P`, 좌표 y 라벨·정답 미표시 | PASS | PASS | PASS |
| q06-solution | 같은 두 정확한 지수곡선; `points.P` (1,13) 좌표 표시, y=4·13 눈금 | PASS | PASS | PASS |
| q07-solution | `LOGARITHMIC` base 2, 계수 [1,1,−4,3]; 점근선 x=4, `points.P` (5,3) | PASS | PASS | PASS |
| q11-solution | `mathPlan.nodes` O,Q(1,−√3),H(−√3,1): θ=5π/3, θ/2=5π/6의 실제 두 `displaySegments` 화살표 및 `expressionLabels` | PASS | PASS | PASS |
| q13-problem | `curves` y=3ˣ·27×3ˣ·y=1·y=9 실제 경계, 영역 fill 없음, 넓이 24 미표시 | PASS | PASS | PASS |
| q13-solution | 동일 4개 곡선; A(−3,1),B(0,1),H(0,9)과 두 `segments.length:true`가 3과 8을 실제 표시 | PASS | PASS | PASS |
| q17-solution | `Y_OF_X` 계수 [0,6,−1], 정의역 시작 x=1의 `marker:OPEN`, 꼭짓점 (3,9) 좌표; 오른쪽은 창에서 잘릴 뿐 정의역 끝 아님 | PASS | PASS | PASS |
| q20-solution | QII의 정확한 cos=(1−√17)/6, sin=(1+√17)/6을 `mathPlan.nodes`의 근호식 좌표로 보유; 실제 성분 선분·θ·sinθ·−cosθ 라벨 | PASS | PASS | PASS |
| q21-problem | `Y_OF_X` f=18/5−(2/5)x², `LINE` y=x/2+1, 원문 두 영점 ±3 및 교점 x=2; 구하는 정수해 미표시 | PASS | PASS | PASS |
| q21-solution | 같은 포물선·직선, 교점 Q(−13/4,−5/8),P(2,2), 양의 정수 점 I(x=1)와 x=2 축눈금·좌표 | PASS | PASS | PASS |
| q22-solution | `numberLine.rows[0]` [−7/2,−3)∪(−3,−2), `rows[1]` [−3/2,∞); 열린·닫힌 끝점 및 반직선 실제 표시 | PASS | PASS | PASS |

## 검사·인계

```bash
node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs --shallow archive/exams/similar/high/h2/1mid/23_복성고_1학기_중간_고2_수학I_유사_plans/*.plan.json
node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs archive/exams/similar/high/h2/1mid/23_복성고_1학기_중간_고2_수학I_유사_plans/*.plan.json
```

- 총 **22문항 / 44축** = 작성 **11축**(문제 3, 해설 8) + 엔진 보류 **2축**(q09 해설, q18 해설) + EXEMPT **31축**.
- `plan-lint --shallow` **11/11**, full **11/11**. `sourceConditions.mappedTo` 실제 필드 확인 및 수학적 feature parity **11/11**.
- 문제에 답으로 요구된 값·선지 정답을 직접 표시하지 않음. 영역 채움·수제 SVG·시험지 JS 변경 없음.
- SVG/PNG 렌더, 학생 화면, A4/크롭 검사, JS 그림 연결은 **NOT_RUN**. 후속 렌더·게시 작업자에게 이 경계를 명확히 인계한다.
