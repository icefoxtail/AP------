# 2023 매산여고 고2 수학Ⅰ 1학기 중간 유사 — 그림 2축 판정

- **담당 범위:** `23_매산여고_1학기_중간_고2_수학I_유사.js`의 q01–q23, 총 **23문항 / 46축**. `23_복성고_1학기_중간_고2_수학I_유사.js`는 다음 배치로 보류. 유형은행/교과서 미수정.
- **기준:** 문제축은 풀이의 수치·관계·정답을 노출하지 않는다. 해설축은 풀이에서 유도한 값 표시 가능. 그림 내부의 선·곡선·점·영역은 엔진의 선언적 plan 필드로만 생성한다. 기본 면 채움 없음.
- **판정:** `BENEFICIAL` = 유용한 그림, `REQUIRED` = 그림 없이 기하/그래프 관계 전달 곤란, `EXEMPT` = 장식 또는 순수 대수·단순식, `ENGINE_CAPABILITY_PENDING` = 요구하는 원문 필드의 충실한 묘사가 엔진의 현재 계약으로 불가능. `PASS`는 실제 그려지는 필드의 원문 대비 1:1 일치 판정이며, SVG PNG/A4 수동 렌더 검수 결과를 뜻하지 않는다.
- **lint 명령:** `PYTHONPATH=archive/tools/geometry-equation node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs --shallow <plans/*.plan.json>` 및 같은 명령에서 `--shallow`을 뺀 full. 디렉터리만 넘기면 `*.plan.json` glob이 누락되므로 파일 glob을 사용한다.

| qid | 문제축 판정 / 사유 또는 plan | 해설축 판정 / 사유 또는 plan |
|---|---|---|
| 01 | EXEMPT: 세제곱근·지수 단순식 | EXEMPT: 지수법칙의 대수 계산 |
| 02 | EXEMPT: 로그의 차 단순식 | EXEMPT: 로그 성질에 의한 수치 대입 |
| 03 | EXEMPT: 단조함수 지수부등식 한 줄 | EXEMPT: 일차부등식과 정수 최댓값 |
| 04 | EXEMPT: 라디안·도 단위 환산 | EXEMPT: 180° 비례 환산; 부채꼴 장식 불필요 |
| 05 | EXEMPT: 삼각형 내각 합을 이용한 식 항등 판단; 임의 삼각형 장식 불필요 | EXEMPT: 덧셈각·여각·보각 대수 항등식 |
| 06 | EXEMPT: 근과 계수의 관계 대수식 | EXEMPT: 비에타 정리·로그 계산 |
| 07 | BENEFICIAL: `q07-problem.plan.json` — 원곡선과 목표곡선만, 미지 이동량 미표시 | BENEFICIAL: `q07-solution.plan.json` — 두 지수곡선, y=2 점근선 |
| 08 | EXEMPT: 로그 값에 대한 정수 조건 | EXEMPT: 유한한 로그값 열거·합산 |
| 09 | BENEFICIAL: `q09-problem.plan.json` — 절댓값 지수곡선만, k 범위 미표시 | BENEFICIAL: `q09-solution.plan.json` — 최저점 (2,6), y=6 및 두 교점의 예 y=8 |
| 10 | EXEMPT: 모든 x에 대한 이차식 판별식 | ENGINE_CAPABILITY_PENDING: `sin θ = √2/2`의 **정확한 무리수 수평선**, θ∈(π/2,π)의 끝점 개폐와 3π/4 교점의 동일 trig plan 표현 필요 |
| 11 | EXEMPT: 반대 동경이라는 문자 조건 자체로 충분; 원점 화살표만 놓으면 풀이 각도를 암시 | BENEFICIAL: `q11-solution.plan.json` — 아래 동경 2θ, 위 동경 6θ, 원점·양쪽 화살표 |
| 12 | EXEMPT: 밑변환·로그 항등식 | EXEMPT: 로그 덧셈법칙으로 xy 산출 |
| 13 | EXEMPT: A/B의 집합식·절댓값 판정, 문제축에서 합집합을 미리 노출하지 않음 | BENEFICIAL: `q13-solution.plan.json` — t=θ/π, 닫힌 구간 [0,3/4]와 고립점 5/4 |
| 14 | ENGINE_CAPABILITY_PENDING: **원 x²+y²=10과 xy=−4의 교점 집합**을 제4사분면에 정확히 구속하고 해를 드러내지 않는 원·쌍곡선 교차 plan 필요 | ENGINE_CAPABILITY_PENDING: 정확한 원/직각쌍곡선 교점·OP 반지름 √10·사분면·각표식 및 두 가능한 P를 보존하는 합성 그래프 기능 필요 |
| 15 | EXEMPT: 매개변수 부등식 순수 대수 | EXEMPT: t=3ˣ, u=t−1 치환 및 AM–GM·판별 논증 |
| 16 | EXEMPT: 합성함수 연립부등식과 정수 개수 | EXEMPT: 로그 단조성·유한 정수 열거 |
| 17 | ENGINE_CAPABILITY_PENDING: 두 지수곡선에 A/B/C/D, **AB:BC=3:1**, **AB=AD**, x축·수평선 관계를 모두 동일 좌표계에서 왜곡 없이 표시할 ratio/equality mark 필요 | ENGINE_CAPABILITY_PENDING: A(−3,64), B(−4,16), D(−2,16), C 및 AB:BC=3:1, AB=AD, △ABD 면적을 극단적 y/x 범위에서도 기하 비율 보존해 렌더하는 multi-curve 기능 필요 |
| 18 | ENGINE_CAPABILITY_PENDING: 원문 A(a,b), B(c,d), 기울기 −1 직선, **AB=√2**를 미지 교점에 결합하는 정확한 로그곡선-길이 제약 기능 필요 | ENGINE_CAPABILITY_PENDING: A(12, log₃12), B(13, log₃12−1)과 **무리 로그 절편**의 직선 l, 길이 √2를 동일 plan에 정확히 붙일 기능 필요; 근삿값 상수로 대체 금지 |
| 19 | EXEMPT: 로그로 표현한 방정식 | EXEMPT: u=log₂x 치환의 이차방정식 풀이 |
| 20 | EXEMPT: 삼각함수식의 최대·최솟값, 문제축에 해설의 계수를 선공개하지 않음 | BENEFICIAL: `q20-solution.plan.json` — u∈[−1,1], f(u)=19/4−u−u², 꼭짓점·양 끝점 |
| 21 | ENGINE_CAPABILITY_PENDING: 미지 a>1에서 서로 역함수인 **두 미정곡선과 직선 y=−x+7, 미정 A/B, ACDB 넓이 18**을 풀이의 a=6 노출 없이 결합할 기호 변수·면적 constraint 기능 필요 | REQUIRED: `q21-solution.plan.json` — a=6 결정 후 두 역함수, 교점 A/B, C/D, 양 밑변, 넓이 18; 면 채움 NONE |
| 22 | EXEMPT: 미지 진폭·주기의 삼각함수 평행이동식만 제시; 정답 곡선 선공개 금지 | BENEFICIAL: `q22-solution.plan.json` — u=x/π, 주기 6, 코사인 위상 이동, u=5/4의 값 4 |
| 23 | EXEMPT: 완전거듭제곱 지수의 정수 개수 | EXEMPT: 소인수 지수 gcd와 유리수 열거, 그림은 장식 |

## 실제 필드 1:1 대조 (작성 9축)

| plan | 그려지는 필드와 원문 대응 | DRAWN_FEATURE_PARITY |
|---|---|---|
| q07-problem | `curves[0]` base 3, shiftX −1 = 3^(x+1); `curves[1]` base 1/3, shiftX 1, scale 9, +2; m/n 무기입 | PASS |
| q07-solution | 동일 두 `curves`; `overlays.lines[0]` y=2 실제 점선; 축 눈금 x=1,2 및 y=2,3,9,27 | PASS |
| q09-problem | `curves[0]` x∈[0,2]에 3^(2−x)+5, `curves[1]` x∈[2,4]에 3^(x−2)+5; `y` 숫자 눈금 없음, k 미표시 | PASS |
| q09-solution | 두 지수 가지; 실제 `LINE` y=6, y=8; 실제 `POINT` V(2,6), A(1,8), B(3,8) | PASS |
| q11-solution | `displaySegments`에서 OQ 아래·OR 위에 실제 끝 화살표, `planeMarks.expressionLabels`에 각 2θ/6θ가 각 화살표에 귀속 | PASS |
| q13-solution | `numberLine.rows[0].pieces` 양끝 CLOSED 0/3⁄4, `rows[1].points` 고립점 5⁄4; t=θ/π를 보이는 caption | PASS |
| q20-solution | `coefficients` 19/4,−1,−1; `sourceDomain` 양끝 −1/1; `requiredPoints` V(−1/2,5), L(−1,19/4), R(1,11/4). `axisFold:false`로 x/y 영축 유지 | PASS |
| q21-solution | `curves` EXP base 6, LOG base 6, y=−x+7, y=x; `overlays.points` A(1,6), B(6,1), C(0,1), D(1,0); `polygons` ACDB의 label=18/fill=NONE; `segments` AB/CD length 표시 | PASS |
| q22-solution | `ratePi` 1/3, `coefficients` [2,3], `phasePi` −1/12, `sourceDomain` [1/4,25/4]; `overlays.points` u=5/4, guides 양축, callout f=4 | PASS |

> **검사 범위 유의:** PASS는 공개 엔진의 full plan-lint 및 선언된 실제 그리기 필드의 수학적 대조이다. 운영 렌더러에서 생성된 SVG/PNG 눈검증·A4/크롭 검사는 이 plan 전용 배치에서 수행하지 않았으며 완료로 기록하지 않는다. 엔진 미지원 축은 임의 수치 좌표나 caption-only 길이/각 표기로 위장하지 않는다.

## 집계

- 문항 **23**, 문제·해설 **46축**.
- 실행 plan **9개**(문제 2, 해설 7), 각 파일 **shallow PASS / full PASS**.
- `DRAWN_FEATURE_PARITY` **PASS 9**, `ENGINE_CAPABILITY_PENDING` **8축**, `EXEMPT` **29축**.
- 원본 JS 및 복성고 파일 불변. 수제 SVG/유형은행/교과서 변경 없음.
