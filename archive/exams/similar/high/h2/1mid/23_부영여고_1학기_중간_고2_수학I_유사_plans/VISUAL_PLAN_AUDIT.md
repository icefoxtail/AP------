# 부영여고 2023 1학기 중간 고2 수학 I — 유사 시험지 시각 plan 판정

- 대상 원문: `archive/exams/similar/high/h2/1mid/23_부영여고_1학기_중간_고2_수학I_유사.js`
- 범위: **qid 01–21, 21문항 × (문제/해설) = 42축**. 다음 파일인 `23_순천고_1학기_중간_고2_수학I_유사.js`(22문항)는 이번 20–30문항 한도를 넘으므로 **미작업**.
- 위치 규칙: 유사 시험지이므로 원문 JS와 나란히 `_plans/` 폴더에 `qNN-problem.plan.json`, `qNN-solution.plan.json` 형태로 저장한다. 기출용 `production/plans/<stem>/`은 이 묶음에 해당하지 않는다.
- 규칙: 손으로 만든 SVG/PNG 없음; 그림은 실행 가능한 엔진 plan JSON만 사용한다. 문제축은 물어보는 정답을 그림 라벨로 누설하지 않는다. 도형 내부·그래프 영역의 면 채움 없음.
- 판정: **DRAWN_FEATURE_PARITY=PASS**는 원문 및 해설과 수치, 함수·점의 좌표, 선분·호·각, 눈금·경계·라벨, 직각 표식·비율 등 **실제로 그려지는** 각 필드의 의미가 일치한다는 뜻이다. `EXEMPT`는 새 그림이 불필요하거나 문제 정답을 드러낼 위험이 있다는 뜻이며 이유를 남긴다. 엔진 미지원 축은 `ENGINE_CAPABILITY_PENDING`으로 따로 분류한다.

## 문제·해설 2축 판정표

| qid | 축 | 판정 | capability | plan JSON | plan-lint shallow/full | DRAWN_FEATURE_PARITY | 근거/EXEMPT 사유 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 01 | 문제 | EXEMPT | — | — | N/A | N/A | 세제곱근 계수 정리만 주어짐; 그림 정보 없음. |
| 01 | 해설 | EXEMPT | — | — | N/A | N/A | 근호 묶는 단순 대수 계산. |
| 02 | 문제 | EXEMPT | — | — | N/A | N/A | 로그 부등식을 풀어 얻는 정수 개수는 바로 정답; 문제 그림은 비노출 규칙 위반. |
| 02 | 해설 | BENEFICIAL | number-line-figure-v1 | `q02-solution.plan.json` | PASS/PASS | PASS | 열린 범위 (2,6)와 자연수 3·4·5. |
| 03 | 문제 | BENEFICIAL | multi-curve-figure-v1 | `q03-problem.plan.json` | PASS/PASS | PASS | 감소 곡선과 닫힌 x=2,4 두 점만 표시; 극값 수치·차는 비노출. |
| 03 | 해설 | BENEFICIAL | multi-curve-figure-v1 | `q03-solution.plan.json` | PASS/PASS | PASS | 동일 곡선에 (2,9), (4,6), M/m 극값 라벨. |
| 04 | 문제 | EXEMPT | — | — | N/A | N/A | 지수법칙의 식 대입·소거 문제. |
| 04 | 해설 | EXEMPT | — | — | N/A | N/A | 지수의 성질 적용만으로 완결. |
| 05 | 문제 | EXEMPT | — | — | N/A | N/A | 호 길이·넓이만 주어졌고 r, θ를 묻는다; 수치가 붙은 도형은 결과 노출. |
| 05 | 해설 | BENEFICIAL | construction-spike-v1 | `q05-solution.plan.json` | PASS/PASS | PASS | 흰 부채꼴, 반지름 9, 호 6π, 중심각 120°=2π/3, 내부 넓이 글자 27π. |
| 06 | 문제 | EXEMPT | — | — | N/A | N/A | 제3사분면 tan값만 주어져 길이 완성 삼각형은 sin 정답 누설. |
| 06 | 해설 | BENEFICIAL | construction-spike-v1 | `q06-solution.plan.json` | PASS/PASS | PASS | QIII 좌표 P(−12,−5), 5–12–13 삼각형과 X의 직각표식. |
| 07 | 문제 | EXEMPT | — | — | N/A | N/A | n제곱근 참·거짓의 성질 판단, 원문 시각자료 없음. |
| 07 | 해설 | EXEMPT | — | — | N/A | N/A | 실수 n제곱근 개수·부호 성질 설명. |
| 08 | 문제 | EXEMPT | — | — | N/A | N/A | 로그 항등식의 대수적 계산. |
| 08 | 해설 | EXEMPT | — | — | N/A | N/A | 밑 변환·로그법칙만 사용. |
| 09 | 문제 | EXEMPT | — | — | N/A | N/A | 연간 증가율의 이산적 수치 계산, 그래프 제공 없음. |
| 09 | 해설 | EXEMPT | — | — | N/A | N/A | 등비성장식을 계산하는 과정으로 충분. |
| 10 | 문제 | EXEMPT | — | — | N/A | N/A | 거듭제곱·근호 크기 비교의 수식 문제. |
| 10 | 해설 | EXEMPT | — | — | N/A | N/A | 수의 순서 비교 계산. |
| 11 | 문제 | EXEMPT | — | — | N/A | N/A | 역함수 치역을 완성한 그래프는 정수 n의 개수를 드러냄. |
| 11 | 해설 | BENEFICIAL | multi-curve-figure-v1 | `q11-solution.plan.json` | PASS/PASS | PASS | f<3, g>10과 각각의 수평 점근선 3·10. |
| 12 | 문제 | EXEMPT | — | — | N/A | N/A | 삼각함수 항등식으로 표현된 대수 연립식. |
| 12 | 해설 | EXEMPT | — | — | N/A | N/A | 항등식·계수 관계만 쓰는 풀이. |
| 13 | 문제 | EXEMPT | — | — | N/A | N/A | 계수 a,b,c를 묻고 있으며 정량 그래프의 진폭·위상은 답을 노출. |
| 13 | 해설 | BENEFICIAL | trigonometric-spike-v1 | `q13-solution.plan.json` | PASS/PASS | PASS | 4cos(3x−3π/4), 진폭 4, π/4에서 최대, 주기 2π/3. |
| 14 | 문제 | EXEMPT | — | — | N/A | N/A | 양의 두 수의 산술·기하평균 관계. |
| 14 | 해설 | EXEMPT | — | — | N/A | N/A | 부등식 등호 조건의 산술 확인. |
| 15 | 문제 | EXEMPT | — | — | N/A | N/A | 로그함수의 최대·정의역 등 선지 판단을 그래프가 바로 알려 줌. |
| 15 | 해설 | BENEFICIAL | polynomial-spike-v1 | `q15-solution.plan.json` | PASS/PASS | PASS | 원함수 y=log₂q(x)가 **아닌 진수 q(x)**, (2,10) 열린 경계, 정점 (6,16). |
| 16 | 문제 | EXEMPT | — | — | N/A | N/A | cos x로 치환한 이차함수 최댓값·최솟값이 요구 결과. |
| 16 | 해설 | BENEFICIAL | polynomial-spike-v1 | `q16-solution.plan.json` | PASS/PASS | PASS | t∈[−1,1], k=−t²−t+3, 정점 (−1/2,13/4), 오른쪽 끝 (1,1). |
| 17 | 문제 | EXEMPT | — | — | N/A | N/A | 근과 계수 관계 대수 계산. |
| 17 | 해설 | EXEMPT | — | — | N/A | N/A | 근의 합·곱을 이용한 식 변형. |
| 18 | 문제 | EXEMPT | — | — | N/A | N/A | 삼각부등식 해 구간을 그리면 구하는 끝점 차이가 드러남. |
| 18 | 해설 | BENEFICIAL | trigonometric-spike-v1 | `q18-solution.plan.json` | PASS/PASS | PASS | θ=x−π/6, sinθ=−1/2의 두 교점 −5π/6·−π/6과 닫힌 해 구간. |
| 19 | 문제 | EXEMPT | — | — | N/A | N/A | 원문이 실근 개수를 묻고 있어 교점 수가 그림에서 바로 노출됨. |
| 19 | 해설 | BENEFICIAL | trigonometric-spike-v1 | `q19-solution.plan.json` | PASS/PASS | PASS | \|sinπx\|, y=x/5, [0,5], 원점 경계 1회 포함 교점 총 10개. |
| 20 | 문제 | EXEMPT | — | — | N/A | N/A | 지수·로그 방정식의 연산. |
| 20 | 해설 | EXEMPT | — | — | N/A | N/A | 대수적 방정식 풀이. |
| 21 | 문제 | EXEMPT | — | — | N/A | N/A | 자연수 a,b 최소값 문제로 정수 네 점을 표시하면 답 추론이 빨라짐. |
| 21 | 해설 | BENEFICIAL | number-line-figure-v1 | `q21-solution.plan.json` | PASS/PASS | PASS | 정수 n=4,5,6,7을 각각 네 점으로 표시. |

## DRAWN_FEATURE_PARITY 세부 대조

| plan | 원문/해설의 직접 대조 조건 | 실제 그려지는 필드 및 검증 포인트 | 결과 |
| --- | --- | --- | --- |
| q02-solution | log₂(2x−4)<3 → 2<x<6, 자연수 3,4,5 | `numberLine`의 SET 열린 경계 2·6과 `integerPoints` 3·4·5; 모두 같은 수직선 | PASS |
| q03-problem | y=(1/2)^(x−4)+5, x∈[2,4], M−m 질문 | `curves[0]` 지수 계수·밑·shift 및 `domain:[2,4]`, 양 끝 `overlays.points` 닫힌 점; y 눈금/좌표 라벨은 미표시 | PASS·정답 비노출 |
| q03-solution | f(2)=9, f(4)=6, 감소, M−m=3 | `curves[0]` 같은 함수, `overlays.points` (2,9)·(4,6), `axisTickValues.y` 6·9, 결과는 캡션 | PASS |
| q05-solution | l=6π, S=27π, r=9, θ=2π/3 | `POLAR_POINT` O 기준 A→B 120°, `CIRCLE_CENTER_RADIUS` r9, 표시된 OA·OB, `arcs` 길이6π, `angles` 2π/3, `expressionLabels` r9, `textLabels` 넓이27π; **regions/fill 없음** | PASS |
| q06-solution | tanθ=5/12, θ 제3사분면, r13, sinθ=−5/13 | `SOURCE_POINT` O(0,0), X(−12,0), P(−12,−5), 선분 OX=12·XP=5·OP=13, `rightAngles[0]` O-X-P 직각, 음의 두 좌표, 선분별 수치 라벨, 빗변 동경 화살표 | PASS |
| q11-solution | f=3−2^(x−4)<3, g=10+3^(2−x)>10 | `curves[0..1]`의 밑·지수 계수·이동, 점선 `curves[2..3]` y3/y10, y축 3·10 눈금, 두 역함수의 상대 높이 | PASS |
| q13-solution | a=4, b=3, 최소 c=3π/4, f(π/4)=4 | `function:COS`, coefficients 4·3·0, `phasePi:-3/4`, x π/4·y±4 눈금. `INTERVAL_PI` 열린 양 끝은 **표시용 자른 화면**이며 원래 정의역이 아니다 | PASS |
| q15-solution | 진수 (x−2)(10−x)=−x²+12x−20>0, 최대16 at x6 | `polynomial.coefficients` −20·12·−1, `sourceDomain` 양 끝 OPEN 2·10, 꼭짓점 (6,16). 원래 로그 곡선을 이차함수로 오인하지 않도록 `caption`에 차이를 명기 | PASS |
| q16-solution | t=cos x∈[−1,1], k(t)=−t²−t+3 | `coefficients` 3·−1·−1, 양 끝 CLOSED, 극점 (−1/2,13/4), 양 끝 값 3·1, 별도 y 눈금 | PASS |
| q18-solution | θ=x−π/6∈[−7π/6,5π/6], sinθ≤−1/2 | `function:SIN`, `sourceDomain.INTERVAL_PI`, 기준선 y−1/2, 교점 수2, x 눈금 −5π/6·−π/6, 캡션의 원래 x∈[−2π/3,0] | PASS |
| q19-solution | \|sin(πx)\|=x/5, 실근 10개 | `absolute:true`, `ratePi:1`, 직선 slope1/5 intercept0, 범위 [0,5] CLOSED, `endCrossing:true`로 **원점 경계 교점 1개 포함**한 `intersectionCount:10`; 다섯 봉우리·양수 교차9개 | PASS |
| q21-solution | 연속 정수 네 개 합22 → 4·5·6·7, b/a 범위 [8,16) | `numberLine.rows[].points`에 네 정수 4·5·6·7, 합·최소 a,b는 캡션에만 명시 | PASS |

### 조건별 점검 및 한계

1. 각 plan의 `sourceConditions[].mappedTo`는 하나 이상 실제 존재하는 JSON 필드에 연결되어야 하며, 적힌 함수·좌표·선분·라벨·각·직각·비율 등은 JS의 문제 본문과 해설 숫자에 일치해야 한다. 임의 비율 표식은 창작하지 않는다. q06은 가로·세로인 두 다리가 실제 직교하므로 X에 직각표식을, q05는 면 채움 없이 호와 반지름·넓이 라벨을 사용한다.
2. 문제축의 유일한 plan(q03)은 정답 M,m, M−m 및 y=9/6 숫자 표기가 없고, 해설축에서만 해당 좌표를 쓴다.
3. q19는 초기 경계 집계를 개별 점 오버레이로 분리하는 방식을 검토했으나, 최종적으로 `endCrossing:true`와 닫힌 왼쪽 경계로 **원점까지 한 번에 계산·표시**하는 엔진의 공식 기능을 사용한다. 전체 10개 관측값으로 full lint 통과해야 한다.
4. `ENGINE_CAPABILITY_PENDING`: **0축**. 이번 계획에서 필요했던 지수·삼각함수·다곡선·다항식·수직선·원호 및 각 라벨 기능이 모두 lint 가능한 엔진 규격에 포함되어 있다.
5. `plan-lint`의 shallow와 full은 각각 명시적으로 수행한 기록에 따라 확정한다. Full은 실제 SVG 렌더 및 독립 관측기를 포함하지만, 별도 시험지 JS에 그림을 꽂거나 브라우저에서 지면 미리보기·A4 재검토하는 것은 이 JSON-only 작업의 범위 밖이다.

**집계:** 21문항, 42축 = BENEFICIAL/plan 12축(문제 1, 해설 11) + EXEMPT 30축 + PENDING 0축. JSON 12개, 감사문서 1개. lint shallow/full 각각 12/12 PASS, `sourceConditions`의 그려지는 필드 경로 56/56 존재 확인, DRAWN_FEATURE_PARITY 12/12 PASS. PR 및 운영 main SHA는 병합 결과에 의해 확정한다.
