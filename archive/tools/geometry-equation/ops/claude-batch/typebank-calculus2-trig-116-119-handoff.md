# 고2 미적분Ⅱ 도형 극한 116–119 — 문제 그림 23문항 plan/시각조건 인계

## 작업 범위·원문 결속

- 기준 원격 `main`: `f1e3905d634057be8d106ec2d37ed50184cff72f` (착수 시 열린 동일 유형은행 PR 없음). 직전 운영병합 #3101은 116/q01–q03에서 끝난다. 이번에는 **116/q04–q10 (7), 117/q01–q05 (5), 118/q01–q05 (5), 119/q01–q06 (6)**, 합계 **23문항/4개 JS 유형군**만 신규 제작했다.
- 원본 경로 `archive/exams/types/high/h2/`에서 23개 발문·보기·정답·해설과 `[그림: …]` 문구를 원문 JS로 직접 확인했다. 23개 `sourceQuote` 원문 완전 일치, 23개 `sourceConditions[].mappedTo`가 실제 plan 필드/인덱스를 가리킴. JS·시험지·교과서·공용 엔진·기존 SVG/PNG 변경 없음.
- 원문 SHA-256: 116 `3929cb8147cd191e3b438269fd48beae7d9c35c75194d227e3fb091a1b8deda9`; 117 `0c561f082739facd48ed7de5540a253adabb1920d1ac242c681193f12c81b344`; 118 `7c8d9a2cdc05d628f9b53bc477b96ed25d8ca54642a1a61435920cbe88c19cab`; 119 `0ce1449c770f0eaa1bdd51bc3fa32564452a7b13a0f21bdb314e546724eb8339`.
- 모든 제작 plan은 `archive/tools/geometry-equation/production/plans/<정확한 JS stem>/qNN-problem.plan.json`에 둔다. 표에서 `116/q04-problem.plan.json`은 아래의 `116` stem 디렉터리에 있는 정확한 파일을 뜻한다.
  - 116 = `미적분II_116_사인법칙과코사인법칙의도형에의활용_고2_유형은행1`
  - 117 = `미적분II_117_지수로그함수와삼각함수의극한의활용_고2_유형은행1`
  - 118 = `미적분II_118_삼각형에내접하는원의반지름의극한_고2_유형은행1`
  - 119 = `미적분II_119_부채꼴의호의길이와넓이의삼각함수의극한_고2_유형은행1`

## 실행 결과와 판정 경계

- 공식 `node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs --shallow <116–119 문제 plan들>`: **26/26 OK, 0 FAIL/SKIP**. `--jobs 2` full + 정본 폰트·엔진 의존성: **26/26 OK, 0 FAIL/SKIP**. 기존 116/q01–q03 3건이 포함된 수치이며, **신규 23/23 shallow PASS, 23/23 full PASS**이다.
- 별도 독립 검산: **23/23 `sourceVsPlan=REVIEWED`**, 원문 인용·필드 경로·중심/반지름·원의 호 양 끝·각·직각 내적·동일 길이 표시·각 이등분·내접원 세 접선·수선 발을 qid별로 실제 좌표에서 다시 계산, **검산 오류 0**.
- 원문이 요구한 모든 시각 요소를 *실제 그려지는 필드*로 확인한 `DRAWN_FEATURE_PARITY`: **20 PASS / 3 `ENGINE_CAPABILITY_PENDING`**. pending qid = **117/q02, 117/q04, 117/q05**. 이 3개는 lint PASS여도 원문 그림 완성으로 집계하지 않는다.
- 전부 문제축 `REQUIRED`, 해설축은 이번 범위에서 **`NOT_AUDITED`** (무근거 EXEMPT 아님). 실제 SVG·PNG 렌더, 390px/학생화면, A4/인쇄, JS 자산 연결·게시: **`NOT_RUN`**. 실제 학생화면 PASS가 아니다.
- 미지 극한값/정답을 문제 그림의 caption·그려진 라벨에 쓰지 않았으며, 대표각을 쓴 정적 배치는 `newVisualInformation`에 명시했다. 필요하지 않은 다각형·부채꼴 면 채움은 하지 않았다.

## 문항별 DRAWN_FEATURE_PARITY — 원문 한 항목 ↔ 실제 렌더 필드

표에서 `nodes`는 `mathPlan.nodes`, `segments`는 `displaySegments`, `angles/arcs/equalLengths`는 `planeMarks`의 해당 배열, `overlay`는 `graphPlan.overlays`를 뜻한다. `construction-spike-v1 / PLANE_FIGURE_v1`의 원·선·호는 모델의 실제 도형 입력이며, `logarithmic-affine`·`exponential-affine`은 엔진의 실제 곡선 계수를 쓴다.

| 파일/qid | 축 | 판정 | capability | plan 경로 | plan-lint | DRAWN_FEATURE_PARITY (실제 필드와 대조) |
| --- | --- | --- | --- | --- | --- | --- |
| 116/q04 | 문제 | REQUIRED | `construction-spike-v1` | `116/q04-problem.plan.json` | S/F PASS | **PASS**: O·A(4,3)·B(4,−3), r=5 → `nodes`; OA·OB·AB → `segments[0..2]`; 짧은 호의 `l` → `arcs[0]`; 중심각 `2θ` → `angles[0]`; 5 → `expressionLabels[0]` |
| 116/q05 | 문제 | REQUIRED | `construction-spike-v1` | `116/q05-problem.plan.json` | S/F PASS | **PASS**: A(−3,0), B(3,0), 위쪽 반원·P·C∈OB → `nodes`, `arcs[0]`; AB·AP·PB·OP·PC → `segments[0..4]`; θ, θ, 2θ → `angles[0..2]`, AB=6 → `expressionLabels[0]` |
| 116/q06 | 문제 | REQUIRED | `construction-spike-v1` | `116/q06-problem.plan.json` | S/F PASS | **PASS**: AB=5·AC=3 → `segments[0..2]`, `expressionLabels[0..1]`; ∠BAC=θ → `angles[0]`; C는 실제 반지름 3 위치의 대표점 |
| 116/q07 | 문제 | REQUIRED | `construction-spike-v1` | `116/q07-problem.plan.json` | S/F PASS | **PASS**: O 중심 r=8 외접원과 A=(0,8), B,C 대칭 → `nodes`, `displayCircles[0]`; AB=AC → `equalLengths[0]`; ∠BAC=θ·반지름 8 → `angles[0]`, `expressionLabels[0]` |
| 116/q08 | 문제 | REQUIRED | `construction-spike-v1` | `116/q08-problem.plan.json` | S/F PASS | **PASS**: AB=2·AC와 AD의 방향각 θ,2θ → `nodes`, `segments`; C 직각 → `rightAngles[0]`; ∠BAC=θ, ∠CAD=θ, ∠ACD=3π/4 → `angles[0..2]`, D는 AC의 반대편 (부호 검산) |
| 116/q09 | 문제 | REQUIRED | `construction-spike-v1` | `116/q09-problem.plan.json` | S/F PASS | **PASS**: AB=9·∠A=θ·∠B=2θ → `segments`, `expressionLabels[0]`, `angles[0..1]`; C의 각 이등분선 CD·두 같은 각호 → `segments[3]`, `angles[2..3]` (`equalGroup=1`) |
| 116/q10 | 문제 | REQUIRED | `construction-spike-v1` | `116/q10-problem.plan.json` | S/F PASS | **PASS**: O 중심 r=3·K(2,0) 중심 r=1, 접점 T=(3,0) → `displayCircles[0..1]`, `nodes`; A→Q→P 동일 반직선·θ → `segments[0..2]`, `angles[0]`, Q의 근호 교점이 두 원 관계를 충족 |
| 117/q01 | 문제 | REQUIRED | `exponential-affine-spike-v1` | `117/q01-problem.plan.json` | S/F PASS | **PASS**: `y=3^x−1` → `graphPlan.base/coefficients`; 대표 P=(1,2)·H=(1,0)·O → `overlay.points[0..2]`; OH·HP·OP → `overlay.segments[0..2]`; H 직각 → `overlay.rightAngles[0]`, `equalUnits` |
| 117/q02 | 문제 | REQUIRED | `logarithmic-affine-spike-v1` | `117/q02-problem.plan.json` | S/F PASS | **ENGINE_CAPABILITY_PENDING**: `y=ln(1+6x)`·O·H 및 수직선은 `graphPlan.coefficients`, `overlay.points[0..1]`, `overlay.lines[0]`; **P=(1/6,ln2)·PH·직각 표식 미표시** (`PIECEWISE_POLY_IRRATIONAL_FORM_UNSUPPORTED`) |
| 117/q03 | 문제 | REQUIRED | `construction-spike-v1` | `117/q03-problem.plan.json` | S/F PASS | **PASS**: A(0,0)·B(6,0)·C(0,6tanθ) → `nodes`; AB=6, ∠A 직각, ∠B=θ → `expressionLabels[0]`, `rightAngles[0]`, `angles[0]`; H∈BC·AH⊥BC → `segments[3]`, `rightAngles[1]` |
| 117/q04 | 문제 | REQUIRED | `exponential-affine-spike-v1` | `117/q04-problem.plan.json` | S/F PASS | **ENGINE_CAPABILITY_PENDING**: `y=e^(2x)−1`·O 중심 r=2 원·P=(8/5,6/5)·P의 수평선 → `graphPlan.coefficients`, `overlay.circles[0]`, `overlay.points[0..1]`, `overlay.lines[0]`; **Q의 로그 역교점·R의 x축 정사영·T=OP∩QR·삼각형 ORT 미표시**, 원도 사분호가 아닌 전체 원으로만 표시 |
| 117/q05 | 문제 | REQUIRED | `logarithmic-affine-spike-v1` | `117/q05-problem.plan.json` | S/F PASS | **ENGINE_CAPABILITY_PENDING**: `y=ln(1+2x)`·r=2 원·P·H·HP → `graphPlan.coefficients`, `overlay.circles[0]`, `overlay.points[1..2]`, `overlay.segments[1]`; **Q=( (e^(6/5)−1)/2, 6/5)·HQ·QP·△OPQ 미표시**, 원도 사분호가 아닌 전체 원으로만 표시 |
| 118/q01 | 문제 | REQUIRED | `construction-spike-v1` | `118/q01-problem.plan.json` | S/F PASS | **PASS**: P 양의 x축·Q 양의 y축·PQ=24 → `nodes`, `segments`, `expressionLabels[0]`; O 직각·∠OPQ=θ → `rightAngles[0]`, `angles[0]`; 삼각형 세 변에 접하는 내접원 → `displayCircles[0]` (세 접선 거리 독립검산) |
| 118/q02 | 문제 | REQUIRED | `construction-spike-v1` | `118/q02-problem.plan.json` | S/F PASS | **PASS**: r=6 사분원·P → `arcs[0]`, `nodes`; B→OP의 발 Q, Q→OB의 발 R → `segments`, `rightAngles[0..1]`; BQR의 내접원 → `displayCircles[0]` (세 변 거리 검산), O의 θ → `angles[0]` |
| 118/q03 | 문제 | REQUIRED | `construction-spike-v1` | `118/q03-problem.plan.json` | S/F PASS | **PASS**: r=4 제1사분원과 A(4,0), P → `arcs[0]`; H=(P_x,0)·AH·HP·AP → `nodes`, `segments[2..4]`, `rightAngles[0]`; △AHP 내접원 → `displayCircles[0]` |
| 118/q04 | 문제 | REQUIRED | `construction-spike-v1` | `118/q04-problem.plan.json` | S/F PASS | **PASS**: AB=6 윗반원·P·H 및 PH⊥AB → `arcs[0]`, `segments`, `rightAngles[0]`; ∠PAB=θ → `angles[0]`; △AHP의 내접원(넓이 S의 경계) → `displayCircles[0]` |
| 118/q05 | 문제 | REQUIRED | `construction-spike-v1` | `118/q05-problem.plan.json` | S/F PASS | **PASS**: AB=6 윗반원·P → `arcs[0]`, `nodes`; △APB의 세 변·P 직각·θ → `segments`, `rightAngles[0]`, `angles[0]`; △APB의 내접원 → `displayCircles[0]` |
| 119/q01 | 문제 | REQUIRED | `construction-spike-v1` | `119/q01-problem.plan.json` | S/F PASS | **PASS**: AB=6 윗반원·△ABC·내심 I·접점 D,E → `nodes`, `segments`; I에서 AB/BC로 내린 수선 → `rightAngles[1..2]`; 큰 호 AC·내접원의 작은 호 DE → `arcs[1..2]`, `displayCircles[0]`; ∠ABC=θ → `angles[0]` |
| 119/q02 | 문제 | REQUIRED | `construction-spike-v1` | `119/q02-problem.plan.json` | S/F PASS | **PASS**: O 중심 r=2 원, P=(2,0), Q 원 위 → `displayCircles[0]`; 작은 호 PQ=3t·중심각 3t/2 → `arcs[1]`, `angles[0]`; QH⊥x축·수평거리 PH → `segments[2..3]`, `rightAngles[0]` |
| 119/q03 | 문제 | REQUIRED | `construction-spike-v1` | `119/q03-problem.plan.json` | S/F PASS | **PASS**: r=2 사분호·P·H → `arcs[0]`, `segments`, `rightAngles[1]`; P에서 접선 PQ와 OP⊥PQ → `segments[4]`, `rightAngles[0]`; Q 중심 QA=QR의 작은 부채꼴 QRA → `nodes`, `arcs[1]`, `segments[5..6]` |
| 119/q04 | 문제 | REQUIRED | `construction-spike-v1` | `119/q04-problem.plan.json` | S/F PASS | **PASS**: r=2 부채꼴 OAB, ∠AOC=θ/4 → `arcs[0]`, `angles[0..1]`; G∈OC·F∈호 AC인 DEFG 정사각형 → `nodes`, `segments[3..6]`, `rightAngles[0..3]`; D→OB의 발 P·DP∩OC=Q → `segments[7..10]`, `rightAngles[4]`, 교점 좌표 검산 |
| 119/q05 | 문제 | REQUIRED | `construction-spike-v1` | `119/q05-problem.plan.json` | S/F PASS | **PASS**: AB=2·∠B 직각·∠A=θ → `expressionLabels[0]`, `rightAngles[0]`, `angles[0]`; CD 내각 이등분선과 같은 호 둘 → `segments[3]`, `angles[1..2]`; A 중심 AD=AE의 부채꼴 ADE → `arcs[0]`, `segments[4..5]`; △BCE → `segments[6..7]` |
| 119/q06 | 문제 | REQUIRED | `construction-spike-v1` | `119/q06-problem.plan.json` | S/F PASS | **PASS**: AB=10 윗반원·P·Q → `arcs[0]`, `nodes`, `expressionLabels[0]`; ∠PAO=θ>π/4 → `angles[0]`; A를 지나는 AQ⊥OP → `segments[1..3]`, 교차 직각 `rightAngles[0]`; △AOQ 경계 `segments[0,4]` |

## 엔진 기능 요청과 후속 경계

1. **117/q02**: 로그 곡선 y=ln(1+6x)에서 `curveX`로 얻는 비대수적 y값(`ln2`)을 정본 `overlays.points`의 정확한 점으로 유지하고 P–H 선분 및 H의 직각 표식을 그리는 기능. 현재 사용 시 `PIECEWISE_POLY_IRRATIONAL_FORM_UNSUPPORTED`. 단지 수직 보조선을 그린 것은 P의 대체가 아니다.
2. **117/q04**: 사분호 P의 수평선과 지수곡선 y=e^(2x)−1의 실제 역교점 `Q=(ln(1+2sinθ)/2,2sinθ)` 계산, 그 수직선과 x축 교점 R, OP와 만나는 T까지 정확한 계산 노드·필드 연결. **117/q05**: 사분호 P 높이에서 로그곡선 y=ln(1+2x)의 실제 역교점 `Q=((e^(2sinθ)−1)/2,2sinθ)` 및 HQ·QP·삼각형 OPQ. 두 문항 모두 곡선 위 비대수적 정확한 교점과 원의 부분 호 동시 출력 기능이 필요하다. 잘라낸 사분호 대신 엔진이 지원하는 전체 원을 쓴 상태이므로 PARITY 미완료다.
3. 안티그래비티의 엔진 기능 PR/골든 검사 후 3개 pending plan을 재작성·full lint·필드 재검수한다. 나머지 20개도 실제 SVG 렌더·PNG/A4/학생화면·게시 확인을 해야 하며 그 전에는 완료 자산이 아니다.
4. 다음 회차는 미적분Ⅱ `120` 이후 최신 JS의 도형 그림 요청과 열린 PR을 다시 조사해야 한다(120·121·122·123에 현재 `[그림:]` 없음). 중복 작성·형식적 EXEMPT 파일을 피한다.
