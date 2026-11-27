# 비상 미적분Ⅰ · 함수의 극한 · 중단원 학습 점검 — SVG 2축 감사

- 대상: `archive/exams/textbooks/비상_미적분1/비상_미적분1_함수의극한_중단원학습점검_고2/비상_미적분1_함수의극한_중단원학습점검_고2.js`, 원문 Git blob `937ff3bde00ef1937e7174f392e1d8fe18496903`.
- **14문항 × 문제·해설 = 28축 전수 대조**(`sourceVsPlan=REVIEWED`). 각 원문 발문·답·풀이를 따로 확인하고 실제 PNG `q06.png`, `q13.png`를 눈으로 확인했다. JS와 기존 PNG는 변경하지 않는다.
- 본 폴더의 `*.plan.json` 2개는 공식 엔진 실행 plan이며 `plan-lint.cjs --shallow` / full **2/2 PASS**. `PLAN_READY`만 실제 생성할 수 있는 plan으로 센다.
- `DRAWN_FEATURE_PARITY=PASS`는 원문 조건 → **실제로 그려지는 plan 필드**의 1:1 정적 검수이며, SVG 렌더·PNG 시각검수·학생 화면·A4·JS 연결은 **NOT_RUN**이다. 기존 PNG에 대한 `원본확인`은 그 파일의 시각적 완전성 확인이다.
- `ENGINE_CAPABILITY_PENDING`은 린트 통과 계획이나 비슷하게 보이는 수작업 그림으로 덮지 않는다. 문제의 수식만으로 풀이 가능한 문항 축은 개별 사유가 있는 `EXEMPT`다.

| 파일/qid | 축 | 판정 | capability | plan경로 | plan-lint shallow/full | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|---|
| 극한중단원/q01 | 문항 | EXEMPT · 무한대·유리식 극한을 식으로 조사 | — | — | N/A | N/A |
| 극한중단원/q01 | 해설 | EXEMPT · 분모의 부호·극한 계산으로 완결 | — | — | N/A | N/A |
| 극한중단원/q02 | 문항 | EXEMPT · 두 식이 이미 주어져 문제 그림은 극한값 노출 우려 | — | — | N/A | N/A |
| 극한중단원/q02 | 해설 | **PLAN_READY** | `piecewise-discontinuous-spike-v1` | `q02-solution.plan.json` | PASS/PASS | **PASS** · x=2 양쪽 열린·닫힌 끝, −2/5 극한 화살표와 점선, 이차 조각 |
| 극한중단원/q03 | 문항 | EXEMPT · 미지 함수의 극한값 대수 조합 | — | — | N/A | N/A |
| 극한중단원/q03 | 해설 | EXEMPT · 합·차·곱·몫 성질 계산 | — | — | N/A | N/A |
| 극한중단원/q04 | 문항 | EXEMPT · 주어진 절댓값 유리식의 극한 판단 | — | — | N/A | N/A |
| 극한중단원/q04 | 해설 | **ENGINE_CAPABILITY_PENDING** · x=2에서 함수값 없이 서로 다른 두 열린 접근점 | **필요 기능**: 불연속 조각의 양쪽 `OPEN`·`jumpValues` 없음 허용 | — | N/A(지원 불가, 계획 미작성) | **PENDING** · (2,1)/(2,−1)의 *두 빈 점*과 좌·우 직선·접근 방향 필요 |
| 극한중단원/q05 | 문항 | EXEMPT · 미지 a를 문제 그림에 노출하지 않음 | — | — | N/A | N/A |
| 극한중단원/q05 | 해설 | **PLAN_READY** | `piecewise-polynomial-spike-v1` | `q05-solution.plan.json` | PASS/PASS | **PASS** · 직선/포물선 연결 (1,3), a=1 |
| 극한중단원/q06 | 문항 | **KEEP_ORIGINAL** · `q06.png` 그래프 2패널 | 기존 PNG | — | N/A | 원본확인 · f의 열린 (2,0), g의 닫힌 (2,1)·열린 (2,2), 점선·라벨 |
| 극한중단원/q06 | 해설 | EXEMPT · 원본 그림에 양쪽 접근값과 표시가 이미 모두 존재 | — | — | N/A | N/A |
| 극한중단원/q07 | 문항 | EXEMPT · 인수분해·유리화 극한 3개 | — | — | N/A | N/A |
| 극한중단원/q07 | 해설 | EXEMPT · 계산식의 인수 소거·유리화가 핵심 | — | — | N/A | N/A |
| 극한중단원/q08 | 문항 | EXEMPT · ±무한에서의 절댓값·근호 식 | — | — | N/A | N/A |
| 극한중단원/q08 | 해설 | EXEMPT · 분자·분모 x로 나누어 극한 계산 | — | — | N/A | N/A |
| 극한중단원/q09 | 문항 | EXEMPT · 근호 차의 수치 극한으로 a 결정 | — | — | N/A | N/A |
| 극한중단원/q09 | 해설 | EXEMPT · 유리화 후 최고차항 계수 비교 | — | — | N/A | N/A |
| 극한중단원/q10 | 문항 | EXEMPT · f의 전체 개형 미지, 극한 조건만 존재 | — | — | N/A | N/A |
| 극한중단원/q10 | 해설 | EXEMPT · f(x)/x²→0인 계산으로 완결 | — | — | N/A | N/A |
| 극한중단원/q11 | 문항 | EXEMPT · 매개변수 a,b를 소거하는 극한 | — | — | N/A | N/A |
| 극한중단원/q11 | 해설 | EXEMPT · 분자 인수분해·유리화 대수 풀이 | — | — | N/A | N/A |
| 극한중단원/q12 | 문항 | EXEMPT · f 자체 미정인 조임정리 조건 | — | — | N/A | N/A |
| 극한중단원/q12 | 해설 | EXEMPT · 상하계의 같은 극한과 대수 변형 | — | — | N/A | N/A |
| 극한중단원/q13 | 문항 | **KEEP_ORIGINAL** · `q13.png` 원·직선 | 기존 PNG | — | N/A | 원본확인 · A,B,P,H,O·좌표 눈금·PH 수선·직각 표식·원 식 |
| 극한중단원/q13 | 해설 | EXEMPT · 원본에 PH와 OA가 표시되어 해설의 좌표 대입으로 충분 | — | — | N/A | N/A |
| 극한중단원/q14 | 문항 | EXEMPT · 미지 다항함수의 극한·항등식 | — | — | N/A | N/A |
| 극한중단원/q14 | 해설 | EXEMPT · x=2의 함수값과 인수 소거 계산 | — | — | N/A | N/A |

## 독립 수학·화면 요소 대조 및 엔진 공백

1. **q02**: 왼쪽 `−x²+2`에서 x→2− 극한 `−2`, 오른쪽 `x²+1`에서 x→2+ 극한 `5`이다. `pieces[].coefficients`, `domain`, `OPEN/CLOSED`, `limitArrows[LEFT,RIGHT]`, `axisTickValues`에 실제 표시값이 있다. 왼쪽 내부 꼭짓점 `(0,2)`를 `requiredPoints`로 매핑했다.
2. **q04**: x≠2일 때 `h(x)=3−x` (x<2), `h(x)=x−3` (x>2). 따라서 x=2의 양 끝은 각각 `(2,1)`과 `(2,−1)`로 **둘 다 빈 점**, `h(2)`는 정의되지 않는다. `piecewise-discontinuous-spike-v1`은 두 조각이 같은 경계에서 모두 `OPEN`이면 `jumpValues`로 함수값을 요구하므로 `PIECEWISE_DISCONTINUITY_UNDECLARED:2` 오류가 난다. 정확한 원문을 만족하는 단일 plan이 불가능하다. 필요한 기능: **값 없는 공통 경계에서 양쪽 열린 끝을 그대로 허용하고 방향·수치 극한을 표시**. 거짓 `h(2)`·구멍 메우기·근삿값·수작업 SVG 금지.
3. **q05**: 1에서 우극한 3, 좌극한 2+a, 같을 조건 a=1. 새 해설 plan은 `2x+1`과 `−x²+4`가 `(1,3)`에서 연결되게 그린다. 문제 그림에는 이를 미리 보여 주지 않는다.
4. **q06 기존 PNG**: f는 x=2에서 빈 점, g는 같은 x에서 아래쪽 닫힌 점과 위쪽 빈 점을 가지며 y=1,2의 점선·식 라벨이 보인다. 이 그림으로 해설의 ㄷ·ㄹ 양쪽 극한 0을 판별할 수 있다.
5. **q13 기존 PNG**: O,A(0,t),B(−1,0),P,H의 이름, 원 `x²+y²=1`, 직선, P에서 H로 내린 수선과 **H의 직각 사각형**이 명시되어 있다. 기하 해설의 길이 곱은 원본 그림으로 충분하다.

신규 plan의 면 색칠 및 흰색 배경 rect는 **0개**다. `render/SVG/PNG/student/A4/publish=NOT_RUN`. 후속 엔진 렌더에서 배치·읽힘·잘림은 별도 시각검수가 필요하다.
