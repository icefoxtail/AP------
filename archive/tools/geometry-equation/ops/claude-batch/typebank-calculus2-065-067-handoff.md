# 고2 유형은행 미적분Ⅱ 065–067 문제 그림 plan 20문항 인계

- 소스: `archive/exams/types/high/h2/미적분II_065_등비급수의활용-선분의길이의합_고2_유형은행1.js`(10문항), `미적분II_066_등비급수의활용-도형의넓이의합1_고2_유형은행1.js`(9문항), `미적분II_067_등비급수의활용-도형의넓이의합2_고2_유형은행1.js`(q01). **문제축 20문항**.
- 원격 선정 기준: `main` `a9a7637c3de2cf2e3665d6c6ee45bfc9259fc127`, 오픈 PR 67건 중 해당 유형은행 plan 중복 없음. 앞서 기하 원문 그림 26개는 아직 plan이 없으나 기존 독립 인계서에서 큰 실좌표 쌍곡선·구·원기둥 등 엔진 capability 미지원으로 분리된 보류 건이다. 이를 완전 작성으로 세지 않는다. 미적분Ⅱ 019–064 26문항 작업 PR #3086 병합을 확인하고 다음 첫 미작성 065부터 선정.
- 생성 경로: `archive/tools/geometry-equation/production/plans/<정확한 JS stem>/qNN-problem.plan.json`, 신규 20개. 원문 JS·시험지·교과서·해설·기하 plan 변경 없음. 손 SVG/PNG 없음.
- `sourceVsPlan`: 원본 JS의 `content`에서 [그림:] 이후 원문 설명 문자열과 각 JSON `sourceQuote` 20/20 정확 일치. `sourceConditions[].mappedTo` 20/20 실제 배열 인덱스 존재. caption만 있는 그림 요소를 PASS로 세지 않았음.
- 수학 실좌표 독립 검사: 전체 `displaySegments` 179개 비퇴화, 숫자 길이 표시 23개 실제 거리와 일치, `rightAngles` 7개 내적 0, `planeMarks.angles` 수치 2개 계산값과 일치. `planeMarks.regions`로 066/q05 사분원 밖 두 영역, 066/q09 육각별 반복의 큰·작은 여섯 끝 각각 실제 면 채움.
- 공식 검사(의존성 `setup-spikes.mjs` 완료): `node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs --shallow archive/tools/geometry-equation/production/plans/미적분II_0{65,66,67}_*/q*-problem.plan.json` → **20 OK/0 FAIL/0 SKIP**. `--shallow`을 제거한 full → **20 OK/0 FAIL/0 SKIP**.
- `DRAWN_FEATURE_PARITY`: **16 COMPLETE / 4 ENGINE_CAPABILITY_PENDING**. 아래첨자 0 점 이름의 출력 한계는 실좌표 자체의 누락과 구분.
- SVG 렌더·PNG 시각 검수·390px 학생 화면·A4 인쇄·게시: **NOT_RUN**.

약칭: `P65` = `archive/tools/geometry-equation/production/plans/미적분II_065_등비급수의활용-선분의길이의합_고2_유형은행1`; `P66` = `archive/tools/geometry-equation/production/plans/미적분II_066_등비급수의활용-도형의넓이의합1_고2_유형은행1`; `P67` = `archive/tools/geometry-equation/production/plans/미적분II_067_등비급수의활용-도형의넓이의합2_고2_유형은행1`.

## 문항별 필수 보고

| 파일/qid | 축 | 판정 | capability | plan경로 | plan-lint | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|---|
| 065/q01 | 문제 | REQUIRED · 부분 | construction-spike-v1 | P65/q01-problem.plan.json | PASS/PASS | **ENGINE_CAPABILITY_PENDING** (P₀ 아래첨자 0) |
| 065/q02 | 문제 | REQUIRED · 부분 | construction-spike-v1 | P65/q02-problem.plan.json | PASS/PASS | **ENGINE_CAPABILITY_PENDING** (C₀ 아래첨자 0) |
| 065/q03 | 문제 | REQUIRED | construction-spike-v1 | P65/q03-problem.plan.json | PASS/PASS | COMPLETE |
| 065/q04 | 문제 | REQUIRED | construction-spike-v1 | P65/q04-problem.plan.json | PASS/PASS | COMPLETE |
| 065/q05 | 문제 | REQUIRED | construction-spike-v1 | P65/q05-problem.plan.json | PASS/PASS | COMPLETE |
| 065/q06 | 문제 | REQUIRED · 부분 | construction-spike-v1 | P65/q06-problem.plan.json | PASS/PASS | **ENGINE_CAPABILITY_PENDING** (P₀ 아래첨자 0) |
| 065/q07 | 문제 | REQUIRED | construction-spike-v1 | P65/q07-problem.plan.json | PASS/PASS | COMPLETE |
| 065/q08 | 문제 | REQUIRED | construction-spike-v1 | P65/q08-problem.plan.json | PASS/PASS | COMPLETE |
| 065/q09 | 문제 | REQUIRED | construction-spike-v1 | P65/q09-problem.plan.json | PASS/PASS | COMPLETE |
| 065/q10 | 문제 | REQUIRED · 부분 | construction-spike-v1 | P65/q10-problem.plan.json | PASS/PASS | **ENGINE_CAPABILITY_PENDING** (A₀·B₀ 아래첨자 0) |
| 066/q01 | 문제 | REQUIRED | construction-spike-v1 | P66/q01-problem.plan.json | PASS/PASS | COMPLETE |
| 066/q02 | 문제 | REQUIRED | construction-spike-v1 | P66/q02-problem.plan.json | PASS/PASS | COMPLETE |
| 066/q03 | 문제 | REQUIRED | construction-spike-v1 | P66/q03-problem.plan.json | PASS/PASS | COMPLETE |
| 066/q04 | 문제 | REQUIRED | construction-spike-v1 | P66/q04-problem.plan.json | PASS/PASS | COMPLETE |
| 066/q05 | 문제 | REQUIRED | construction-spike-v1 | P66/q05-problem.plan.json | PASS/PASS | COMPLETE |
| 066/q06 | 문제 | REQUIRED | construction-spike-v1 | P66/q06-problem.plan.json | PASS/PASS | COMPLETE |
| 066/q07 | 문제 | REQUIRED | construction-spike-v1 | P66/q07-problem.plan.json | PASS/PASS | COMPLETE |
| 066/q08 | 문제 | REQUIRED | construction-spike-v1 | P66/q08-problem.plan.json | PASS/PASS | COMPLETE |
| 066/q09 | 문제 | REQUIRED | construction-spike-v1 | P66/q09-problem.plan.json | PASS/PASS | COMPLETE |
| 067/q01 | 문제 | REQUIRED | construction-spike-v1 | P67/q01-problem.plan.json | PASS/PASS | COMPLETE |

## 원문 요소 → 그리기 필드 대조

| qid | 원문 그림에서 검증한 필수 시각 요소 |
|---|---|
| 065/q01 | OX·OY 60° → `displaySegments[0..1]`·`planeMarks.angles`; OP₀=4 → `s4` 길이 라벨; P₀→P₁→P₂ 및 직각 2곳 → `mathPlan.nodes[3..5]`·`displaySegments[2..3]`·`rightAngles[0..1]` |
| 065/q02 | 한 변2 정삼각형 → `nodes[0..2]`·`segments[0..2]`; 빗변 중점 B₁,C₁,B₂,C₂ 및 경로 → `nodes[3..6]`·`segments[3..6]` |
| 065/q03 | 줄기3·좌우 45° 길이1·각 끝 45° 길이1/3 분기 → `nodes[0..7]`·`segments[0..6]`·`expressionLabels[0..2]` |
| 065/q04 | Q₀(0,0)~(2,2)·Q₁~Q₃ 연속 중점 정사각형 → `nodes[0..15]`·`segments[0..15]`, 단위길이2 표시 |
| 065/q05 | 밑변4 정삼각형·첫 중점삼각형·오른쪽 아래 삼각형의 다음 중점삼각형 → `nodes[0..8]`·`segments[0..8]` |
| 065/q06 | 0°·60°·120° 3직선 → `SOURCE_LINE` 3개·`displayLines` 3개; 수선 3단계 좌표 → `nodes[1..4]`·`segments[0..2]`·`rightAngles[0..2]` |
| 065/q07 | 중첩 범위 [0,24],[6,18],[9,15] → 공통 수치 x좌표를 사용한 3행 `segments[0..2]`·길이 라벨24/12/6 및 숫자 위치 라벨 |
| 065/q08 | 지름 끝 A₁=0,A₂=12,A₃=4,A₄=28/3 → `nodes[0..3]`; 위/아래/위 반원호 3개 → `planeMarks.arcs[0..2]` (원 전체는 출력하지 않음) |
| 065/q09 | 반지름3 원·상하좌우 꼭짓점 정사각형·안쪽 동심원 → `CIRCLE_CENTER_RADIUS` 2개·`displayCircles`·사각형 4변 |
| 065/q10 | 중심각60°·반지름9/9/2/9/4의 3호·수선 2개 → `planeMarks.angles`·`arcs[0..2]`·`expressionLabels`·`rightAngles[0..1]` |
| 066/q01 | Q₁(0,0)~(6,6)과 오른쪽 변을 대각선으로 하는 Q₂ → `nodes[0..5]`·`segments[0..7]` |
| 066/q02 | 밑변6 정삼각형·중점삼각형 2회 → `nodes[0..8]`·`segments[0..8]` |
| 066/q03 | A=0 공통 지름 끝·B₁=8,B₂=6,B₃=9/2 원 3개 → `SOURCE_POINT` 7개·`displayCircles[0..2]` |
| 066/q04 | 반지름6 외접원·꼭짓점 하나 위인 정삼각형·반지름3 동심 내접원 → 원 2개·삼각형 3변 |
| 066/q05 | (0,0)~(6,6) 정사각형·반지름6 사분원·(3√2,3√2)의 다음 정사각형·호·밖 영역 2개 → `segments[0..7]`·`arcs[0..1]`·`regions[0..1]` |
| 066/q06 | 첫 3:1 내분 네 점 (3,0),(4,3),(1,4),(0,1)·둘째 내분 정사각형 → `nodes[0..11]`·`segments[0..11]` |
| 066/q07 | 한 변4 정사각형·윗변 빗변인 직각이등변삼각형·왼쪽 직각변에 밖으로 붙은 정사각형 → `nodes[0..6]`·`segments[0..8]` |
| 066/q08 | x=±3/2,y=0/1 직사각형·원점 꼭짓점 정삼각형·그 밑변 위 직사각형과 역삼각형 → `nodes[0..11]`·`segments[0..12]` |
| 066/q09 | 정육각형(변4)·두 엇갈린 정삼각형·여섯 색칠 끝·중앙 육각형에서 반복한 작은 별과 여섯 색칠 끝 → `nodes[0..17]`·`segments[0..41]`·`regions[0..1]`의 각 6 polygons |
| 067/q01 | 직각변 a,b의 삼각형·밑 왼쪽 내접 정사각형·위쪽 직각변에 이어지는 정사각형 → 대표 a=6,b=9, `nodes[0..8]`·`segments[0..10]`·`expressionLabels` a,b |

## 엔진 보류·담당자 다음 단계

1. **ENGINE_CAPABILITY_PENDING 4개**: `065/q01,q02,q06,q10`. `pointNames`의 아래첨자 0(`P_0,C_0,A_0,B_0`)은 현재 공식 스키마의 `POINT_DISPLAY_NAME_INVALID` 제한으로 지원되지 않는다. 정확한 점·수선·호 좌표는 실행 필드에 있고, `A_1,C_1,P_1` 등 1 이상은 출력 가능하다. 임의 글자로 교체해 PASS로 위장하지 않는다.
2. 대표 2~4단계 그림은 **원문 지시가 요구하는 도형 반복의 앞부분**이다. 무한 단계 전체를 애니메이션으로 그렸다고 주장하지 않는다. 067/q01의 일반 문자 a,b는 예시 a=6,b=9로 형태 비율을 정하고 원문 변수 라벨은 실제 필드에 유지했다.
3. 후속 엔진 담당자는 아래첨자 0 지원, 실제 SVG 렌더, PNG/학생 화면/A4 관측을 분리 판정한다. `plan-lint PASS`는 시각 품질 PASS가 아니다.
