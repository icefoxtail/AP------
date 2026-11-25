# 고2 미적분Ⅱ 유형은행 — 삼각함수 도형 20문항 공식 SVG plan 인계

## 범위와 증거

- 기준 main: `5317109d3611d8c5e0bf84f068f369c70b561ae1`. 범위는 `archive/exams/types/high/h2/`의 미적분Ⅱ에 한정한다. 시험지·교과서·원본 JS·손 SVG/PNG는 변경하지 않았다.
- `100/q02–q06` 5문항, `114/q01–q08` 8문항, `115/q01–q04` 4문항, `116/q01–q03` 3문항. 합계 **20문항 / 4 JS 유형군 / 실제 렌더 가능한 문제용 plan JSON 20개**.
- 중간의 `101–113` 유형에는 현재 JS의 `[그림: …]` 자리표시가 없으므로 새 문제 그림을 생성하지 않았다. `116/q04` 이후의 후속 그림은 이번 배치에 포함하지 않는다.
- 원본 JS 파일의 SHA-256: 100 `8e36b1234557ed8b198a59b41e5e1e06666edf7bc01c5a39a8d89d773fac474f`; 114 `9cbe69853fc1c701ce581ccede4536d6fa4dfd52620974b43512f81d150c7902`; 115 `34140a10a05dde77706f61bea0d75ba4725c5e635270aba06db36e6b7a7a5980`; 116 `3929cb8147cd191e3b438269fd48beae7d9c35c75194d227e3fb091a1b8deda9`.
- 저장 위치: `archive/tools/geometry-equation/production/plans/<정확한 JS stem>/qNN-problem.plan.json`. 아래 표의 `100/q02`는 해당 stem의 `q02-problem.plan.json`을 뜻하며, `100` 등의 정확한 stem은 아래와 같다.
  - 100: `미적분II_100_산술평균기하평균을이용한tanθ의최댓값_고2_유형은행1`
  - 114: `미적분II_114_도형에서삼각함수의극한_고2_유형은행1`
  - 115: `미적분II_115_도형의넓이에대한삼각함수의극한_고2_유형은행1`
  - 116: `미적분II_116_사인법칙과코사인법칙의도형에의활용_고2_유형은행1`

## 검증 결과

- `node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs --shallow archive/tools/geometry-equation/production/plans/미적분II_{100,114,115,116}_*/q*-problem.plan.json`: **20 OK / 0 FAIL / 0 SKIP**.
- 같은 명령에서 `--shallow`만 제거한 full 검사: **20 OK / 0 FAIL / 0 SKIP**. 공식 고정 NotoSansKR(sha256 `194018e6b2b293a7964f037b25c0249ce1418bc9ab3c971060a03aa57861e252`)와 잠금 npm 의존성 사용.
- 독립 JS 수학 검산: 원문 `[그림: …]` ↔ `sourceQuote` 원문 일치 20/20, 좌표·선분·직각 내적·각 비율·원의 반지름·길이·치수·수선·특수 교점 20/20 검산 오류 0. 이 검산은 원문의 진술과 렌더 필드를 따로 계산한 것이며, `plan-lint` 실행 성공과 별개의 증거다.
- **DRAWN_FEATURE_PARITY 19 PASS / 1 ENGINE_CAPABILITY_PENDING** (`114/q08`: 매개변수 `sin(t)`의 *정확한* 작도 미지원). 후자는 lint PASS여도 시각 정보 완성으로 집계하지 않는다.
- 모든 20문항은 `sourceVsPlan: REVIEWED`, `problem: REQUIRED`. 해설 축은 이번 문제 그림 플랜 작업의 검수 대상이 아니므로 **solution axis: NOT_AUDITED**로 보존한다. `EXEMPT`로 간주하지 않는다.
- SVG/PNG 엔진 렌더, Chrome·390px 학생 화면, A4/PDF, 게시·JS 연결: **NOT_RUN**. 이후 안티그래비티에서 실물 관찰을 한다.

## 문항별 원문 → 실제 그려지는 필드 1:1 대조

모든 행의 capability는 `construction-spike-v1` (`PLANE_FIGURE_v1`), 판정은 `문제 REQUIRED`, lint는 `shallow PASS / full PASS`이다. 아래 경로는 위의 정확한 stem과 결합한다. `sN`은 각 plan의 `displaySegments[].id`이며 필드 번호는 JSON의 0-based index이다.

| 파일/qid | 원문 필수 시각정보 → 실제 그려지는 필드 | 판정 | plan 경로 | DRAWN_FEATURE_PARITY |
| --- | --- | --- | --- | --- |
| 100/q02 | y축 A(0,2)·B(0,8), x축 C(t,0) → `mathPlan.nodes[0..3]`; CA·CB → `displaySegments[3..4]`; ∠ACB → `planeMarks.angles[0]` | 작성 | `100/q02-problem.plan.json` | **PASS** (대표 t=6, 최댓값 미표시) |
| 100/q03 | x축 A(9,0)·B(25,0), y축 P(0,y) → `nodes[0..3]`; PA·PB → `displaySegments[3..4]`; ∠APB → `angles[0]` | 작성 | `100/q03-problem.plan.json` | **PASS** (대표 y=12) |
| 100/q04 | 수평 PC·수직 CB=4m·BA=12m → `segments[0..2]`, `rightAngles[0]`, `expressionLabels[0..2]`; 시선 PA·PB → `segments[3..4]`; θ → `angles[0]` | 작성 | `100/q04-problem.plan.json` | **PASS** |
| 100/q05 | PC·CB=5m·BA=15m → `segments[0..2]`, `rightAngles[0]`, `expressionLabels[0..1]`; PA·PB → `segments[3..4]`; 사이각 → `angles[0]` | 작성 | `100/q05-problem.plan.json` | **PASS** |
| 100/q06 | 지면 PC, 벽 CA·AB → `segments[0..2]`, `rightAngles[0]`; CA=9m·CB=25m → `planeMarks.dimensions[0..1]`; PA·PB → `segments[3..4]`; θ → `angles[0]` | 작성 | `100/q06-problem.plan.json` | **PASS** |
| 114/q01 | AB=6·위쪽 반원 → `nodes`의 중심·반지름과 `planeMarks.arcs[0]`; P·H 및 AP·PB·PH → `segments[1..3]`; 수선·θ → `rightAngles[0]`, `angles[0]` | 작성 | `114/q01-problem.plan.json` | **PASS** |
| 114/q02 | 반지름 8 사분원 → `arcs[0]`; 호 위 P·수선 발 H → `nodes`, `segments[2..4]`, `rightAngles[0]`; ∠BOP=θ → `angles[0]` | 작성 | `114/q02-problem.plan.json` | **PASS** |
| 114/q03 | AB=6, ∠A=90°, ∠B=θ → `expressionLabels[0]`, `rightAngles[0]`, `angles[0]`; 빗변 BC와 AH⊥BC → `segments[2..3]`, `rightAngles[1]` | 작성 | `114/q03-problem.plan.json` | **PASS** |
| 114/q04 | BC=8, ∠B=90°, ∠C=θ → `expressionLabels[0]`, `rightAngles[0]`, `angles[0]`; BH⊥AC → `segments[2..3]`, `rightAngles[1]` | 작성 | `114/q04-problem.plan.json` | **PASS** |
| 114/q05 | 지름 AB=6인 원 → `displayCircles[0]`, `segments[0]`; P·Q 동일 x좌표·위아래 원 위 → `nodes[3..4]`, `segments[4]`; BPQ → `segments[2..4]`, ∠PAB → `angles[0]` | 작성 | `114/q05-problem.plan.json` | **PASS** |
| 114/q06 | O–C–B 순서, OC=12 → `nodes[0..3]`, `segments[2..3]`, `expressionLabels[0]`; A와 OB를 잇는 AC → `segments[4]`; θ·직각 → `angles[0]`, `rightAngles[0]` | 작성 | `114/q06-problem.plan.json` | **PASS** |
| 114/q07 | AB=4·∠A=90° → `expressionLabels[0]`, `rightAngles[0]`; BC와 A의 정사영 H·AH⊥BC → `segments[0..4]`, `rightAngles[1]`; θ → `angles[0]` | 작성 | `114/q07-problem.plan.json` | **PASS** |
| 114/q08 | O, Q=(t,0), P=(t,2 sin t), 접하는 원, 선분 OP 위 R → `nodes[0..3]`, `displayCircles[0]`, `segments[0..3]`, `rightAngles[0]`; 단 `sin(t)`는 t=1의 12자리 근사 | 부분 구현 | `114/q08-problem.plan.json` | **ENGINE_CAPABILITY_PENDING** (정확한 매개 `sin(t)`·원과 OP 교점 계산 노드 필요) |
| 115/q01 | 사분원·OB의 연장과 x=2의 교점 D → `arcs[0]`, `nodes[0..5]`, `segments[2]`; BH∥AD인 사다리꼴 → `segments[3..6]`, `rightAngles[0..1]` | 작성 | `115/q01-problem.plan.json` | **PASS** |
| 115/q02 | 사분원 호·현 AB → `arcs[0]`, `segments[2]`; P–Q–H 수직 및 Q∈AB → `nodes[3..5]`, `segments[3..5]`; 삼각형 AQH → `planeMarks.regions[0]` | 작성 | `115/q02-problem.plan.json` | **PASS** |
| 115/q03 | 호 위 P,Q·H의 수직 HP·기울어진 HQ → `arcs[0]`, `nodes[3..5]`, `segments[3..4]`; ∠PHQ=θ와 ∠AOP=θ → `angles[0..1]` | 작성 | `115/q03-problem.plan.json` | **PASS** (Q는 정확한 √41 좌표) |
| 115/q04 | 위 반원·P → `arcs[0]`, `nodes`; PQ⊥AB, QR⊥OP, OS⊥AP → `segments[4..9]`, `rightAngles[0..2]`; ∠BOP=2θ → `angles[0]` | 작성 | `115/q04-problem.plan.json` | **PASS** |
| 116/q01 | BC=8·∠B=θ·∠C=3θ → `segments[0]`, `expressionLabels[0]`, `angles[0..1]`; AH⊥BC → `segments[3]`, `rightAngles[0]` | 작성 | `116/q01-problem.plan.json` | **PASS** |
| 116/q02 | 반지름 2 원, P 제1사분면, A 원 밖 양의 x축 → `displayCircles[0]`, `nodes[0..2]`; OP·PA와 ∠POA=3∠PAO → `segments[0..2]`, `angles[0..1]` | 작성 | `116/q02-problem.plan.json` | **PASS** (√17 정확 좌표) |
| 116/q03 | 반지름 2 원 위 A–P–Q 작은 호 순서 → `displayCircles[0]`, `nodes[0..3]`; 호 중심각 2t:6t=1:3 → `angles[0..1]`; 현 AP·PQ → `segments[3..4]` | 작성 | `116/q03-problem.plan.json` | **PASS** (유리수 정확 좌표) |

## 엔진 인계·차단사항

1. `114/q08`은 `t=1`이라는 한 프레임에서 `P_y=2 sin 1` 및 `R`을 12자리 근사 유리수로만 표시했다. `SOURCE_POINT`의 정확한 삼각함수 매개값 또는 계산 노드 `P=(t,2 sin t)` → 접점 `Q=(t,0)` → `R=OP`와 원의 첫 교점을 일관되게 출력하는 엔진 능력이 필요하다. 캡션이나 근삿값은 **DRAWN_FEATURE_PARITY PASS의 근거가 아니다**. 공식 엔진 확장 후 같은 qid 재검수.
2. 모든 신규 원문 그림의 실물 SVG·PNG 렌더, 학생 화면·390px·A4, 정답 비노출 시각 관찰은 **NOT_RUN**이다. 엔진 담당 안티그래비티가 실제 렌더와 골든 관문을 수행해야 한다.
3. 다음 미작성 그림 작업은 `미적분II_116`의 `q04` 이후로 이어갈 수 있다. 단 최신 `main`과 열린 PR, 원문 그림 자리표시를 재확인해야 한다.
