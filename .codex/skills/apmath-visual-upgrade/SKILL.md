---
name: apmath-visual-upgrade
description: Single entrypoint for APMath problem/solution SVG, graph, geometry, and solutionImage production, repair, review, backend selection, math verification, digital-first educational composition, and final render QA.
---

# APMath Visual Production — SINGLE ENTRYPOINT

이 skill은 JS Archive의 **모든 SVG / graph / geometry figure / solutionImage 생성·수정·재생성·검수의 단일 진입점**이다.

작업자는 SVG 제작법을 다른 곳에서 임의 조합하지 않는다. 이 skill에서

```text
무엇을 보여줄지
→ visual이 필요한지
→ 문제용인지 해설용인지
→ 어떤 backend가 적합한지
→ 어떻게 학생용으로 구성할지
→ 수학적으로 맞는지
→ 실제 화면에서 완성됐는지
```

를 결정하고, 세부 수치·검증 계약은 이 skill이 지시하는 최신 canonical에 위임한다.

이 skill은 단순 router가 아니다. **Visual Production Orchestrator**다.

우선순위:

```text
사용자 현재 지시
→ 이 skill의 production contract
→ 최신 main의 visual canonical / Golden / Negative Sample
→ source problem + verified/frozen solution facts
→ actual candidate bytes
```

---

# 0. HARD PRINCIPLE — QUALITY ≠ OLD EXAM STYLE

목표는 “학교 시험지처럼 흑백으로 보이게 만들기”가 아니다.

목표는:

> **학교 내신·교육청·평가원 모의고사급 수학 정확성·조판 완성도를 가지면서, 해설용 visual은 학생이 패드·휴대폰에서 더 빠르고 명확하게 이해할 수 있도록 한 단계 더 좋은 educational visual로 만드는 것.**

current Golden Sample은 **quality floor**이지 ceiling이 아니다.

내부 목표는 **95%+ professional student-facing visual quality**다.  
이 95%는 자동 합산 점수가 아니며 다음 축을 서로 상쇄하지 않는다.

- MATH / SEMANTIC CORRECTNESS
- DECISIVE_STEP_VISIBILITY
- STUDENT_REPRODUCIBILITY
- DIAGRAM NATURALNESS
- TYPOGRAPHY / FONT / BASELINE
- LABEL / LINE / PANEL COMPOSITION
- INFORMATION DENSITY
- DIGITAL READABILITY
- BLACK-AND-WHITE SURVIVABILITY
- ACTUAL RENDER COLLISION / CLIPPING

수학적으로 맞다는 이유만으로 시각적으로 부족한 결과를 PASS하지 않는다.
반대로 색상·카드·큰 제목을 사용했다는 이유로 시험지답지 않다고 감점하지 않는다.

---

## 0.1 PASS AUTHORITY — WORKER CLAIM IS NOT EVIDENCE

작업자의 `검수 완료`, `Python으로 확인`, `PASS`, 점수/카운트 자기보고는 **authority가 아니다**.

재계산 가능한 사실은 final artifact와 결속된 raw physical evidence로 증명해야 한다.

```text
expected fact
→ Python/numeric input + calculated output
→ coordinate model
→ actual final SVG primitive
→ primitive에서 역산한 observed fact + delta/tolerance
→ label owner binding
→ actual browser measurement
→ final SVG SHA / Git blob SHA binding
```

요약 점수(`geometryScore=100`, `21/21 PASS`)는 위 raw evidence를 대체하지 못한다.
raw evidence가 없으면 해당 축은 **NOT_VERIFIED**다.

전수 triage 작업은 전체 denominator의 item-level ledger를 남긴다.

최소:
- qid / questionUid
- baseline solutionImage 존재 여부
- KEEP / POLISH / REBUILD / ADD / REMOVE / EXEMPT
- 한 줄 판단 근거
- decisive relation
- ADD인 경우 marginal benefit 근거

---

# 1. SELECT THE VISUAL SURFACE FIRST

## 1.1 PROBLEM_VISUAL

문제 원문에 노출되는 image/SVG.

목표:
- source fidelity 우선
- 원본 고품질 crop/vector가 있으면 재사용 우선
- 문제에 없던 설명·정답 힌트·교육용 강조를 추가하지 않음
- 인쇄·화면 모두 자연스러워야 함
- source problem image와 solutionImage를 섞지 않음

원본 raster/vector가 충분히 좋으면 새 SVG를 억지로 만들지 않는다.

## 1.2 SOLUTION_VISUAL — DEFAULT FOR EXPLANATION

학생이 해설과 함께 보는 instructional visual.

**DIGITAL-FIRST**로 설계한다.

적극 허용·권장:
- 큰 제목
- 의미가 고정된 색상 accent
- rounded card / light panel
- 단계별 2-panel / 3-panel
- 핵심 관계를 더 굵은 선으로 강조
- 결과/선택/결정선을 시각적으로 구분
- 태블릿·휴대폰 축소에서도 읽히는 정보 계층

단, 다음은 금지:
- rainbow decoration
- 수학 의미와 무관한 색
- 해설 전체를 그림 안에 재복사
- 내부 변수명·debug text·개발자 설명
- 학생에게 불필요한 영어

학생 노출 문구는 **한국어 우선**이다.
영어는 source 고유 명칭, 표준 수학 기호/함수명, 한국어로 바꾸면 오히려 부자연스러운 최소 표현만 허용한다.

## 1.3 SYSTEM_VISUAL

다음 자체가 작업 목적일 때만 사용한다.

- shared generator/validator 수정
- reusable visual family 개발
- common geometry/graph engine 변경
- pipeline-core visual contract
- repository-wide migration/qualification

개별 시험지 SVG 하나를 고친다고 SYSTEM_VISUAL로 승격하지 않는다.

---

# 2. CURRENT HARD START GATE — CALIBRATION

학생 노출 visual을 생성·수정·검수하기 전에 반드시:

1. parent exam task / stage 확인
2. `docs/rules/02_PIPELINES/Archive_작업전_Golden_Sample_Calibration_v1.md`
3. 관련 Golden 2~3 + Negative Sample
4. source problem
5. verified current solution 또는 fresh/frozen solution facts
6. 적용 가능한 visual canonical:
   - `docs/rules/04_VISUAL/도형추출.md`
   - 좌표/직선/원/도형의방정식이면 해당 geometry-equation 규정
   - applicable unit overlay

visual repair/rebuild:
`solution-calibration-gate.mjs --stage VISUAL_REPAIR --preflight`

독립 재검:
`--stage INDEPENDENT_RECHECK --preflight`

Golden은 눈높이를 맞추기 위한 것이다.
target의 기존 SVG를 신규 candidate construction reference로 쓸지는 별도 규칙을 따른다.

---

# 3. VISUAL TRIAGE — STUDENT UNDERSTANDING FIRST

질문은 “그림 없이 풀 수 있는가?”가 아니다.

> **이 visual이 학생이 해설의 핵심을 더 빠르고 명확하게 이해하고 재현하게 하는가?**

사용:

- `VISUAL_REQUIRED`: 결정 구조 전달에 사실상 필요
- `VISUAL_OPTIONAL`: 없어도 풀리지만 이해 속도·명료도·재현성을 의미 있게 향상
- `VISUAL_EXEMPT`: 그림이 단순 장식/해설 반복

`VISUAL_OPTIONAL != DO_NOT_GENERATE`.

다만 visual을 만들 수 있다는 이유만으로 EXEMPT를 깨지 않는다.
집합 원소 수, 단순 대수 판정처럼 **결정적 공간/그래프/구조 관계가 없는 문제**에 explanation card를 억지로 만들지 않는다.

---

## 3.1 MARGINAL BENEFIT GATE — SOURCE FIGURE SUFFICIENCY

`VISUAL_OPTIONAL != BLIND_ADD`.

문제 그림/source figure가 이미 solution의 decisive relation을 충분히 보여 주는 경우,
같은 삼각형·같은 원·같은 라벨을 다시 그리는 것만으로는 ADD 근거가 되지 않는다.

source figure가 있는 문항에서 ADD하려면 최소 하나를 item evidence에 명시한다.

- solution에서 새로 도입되는 보조선/수선/접점/분할
- source에는 없는 owner 관계 또는 같은 길이/같은 각 묶음
- 복잡한 source를 decisive reduction으로 바꾸는 새 representation
- 계산값이 도형의 어디에 대응하는지 보여 주는 실질적 concept anchor

`newVisualInformation=[]`이고 source가 이미 decisive relation을 충분히 전달하면
기본 판정은 `VISUAL_EXEMPT` 또는 기존 visual KEEP이다.

`문제가 쉽지 않다`, `삼각비 문항이다`, `그림이 있으면 좋다`만으로 ADD하지 않는다.

---

# 4. DECISIVE RELATION FIRST

solution visual은 “모든 것을 그린 그림”이 아니다.

> **풀이가 성립하는 결정 관계를 가장 적은 요소로 즉시 보이게 하는 그림**이다.

우선순위:

1. decisive point / line / circle / interval / region
2. solution에서 실제 쓰는 보조선
3. 필요한 label / exact value
4. 필요한 경우에만 axis / tick / grid
5. 필요한 경우에만 계산 card

**Geometry-preservation HARD:** 풀이의 결정 구조가 실제 점·선·원·각·접선·수선 등의 geometry이면
계산 card/panel이 그 geometry를 대체할 수 없다. card는 geometry→algebra bridge 또는 결론 보조용이다.

금지:
- 좌표 문제라는 이유만으로 항상 full Cartesian axes
- 모든 계산을 그림에 복사
- 의미 없는 grid/tick
- 화면을 채우기 위한 장식
- 한 장에 억지로 모든 case를 겹치기

두 경우가 풀이 핵심이면 case를 분리한다.
context와 decisive reduction이 다르면 panel을 분리한다.

---

# 5. BACKEND ROUTER

문항마다 **최적 backend를 선택**한다.
한 backend가 수학적으로 PASS해도 시각 품질이 부족하면 유지하지 않는다.

## STANDARD_SVG
단순 좌표기하, 원, 직선, 기본 이동, 단순 관계.

## MINIMAL_EXAM_DIAGRAM
축·grid보다 핵심 관계 자체가 중요한 경우.
시험지식 최소 geometry + digital readability.

## COMPOSITE_PANEL
- case 1 / case 2
- 이동 전 / 이동 후
- context → decisive reduction
- geometry → calculation bridge
- 한 화면에 합치면 인지부하가 커지는 경우

## FUNCTION_GRAPH
함수 곡선 자체가 핵심일 때.
Python adaptive sampling / branch separation / viewport authority를 사용한다.

## NUMBER_LINE / INTERVAL_DIAGRAM
구간 topology, 경계 포함/제외, 길이, 최댓값 window가 핵심이고 함수 곡선 전체가 불필요할 때.
그래프를 그릴 수 있다는 이유만으로 graph를 강제하지 않는다.

## TIKZ_SPECIAL
다음에서 검토:
- 복잡한 math typography
- 다수 각·길이·보조선의 정교한 vector drafting
- STANDARD 결과가 기계적으로 보임
- manual SVG보다 TeX vector alignment가 유리

## PGFPLOTS_SPECIAL
다음에서 검토:
- 축/tick/곡선/수학 조판의 출판 품질이 핵심
- 복잡한 함수 그래프
- Python sampling 결과를 더 좋은 publication composition으로 마감할 필요

## RASTER_KEEP
고품질 원본 raster/vector가 재구성보다 우수할 때.

backend escalation은 “도구를 많이 쓰기 위해서”가 아니라 **학생용 최종 품질을 올릴 때만** 한다.

---

# 6. MATH AUTHORITY — PYTHON / SEMANTIC FIRST

어떤 backend를 사용하든 수학 authority는 동일하다.

```text
source + verified/frozen solution facts
→ Python numeric / geometry computation
→ semantic relation validation
→ visual materialization
```

TikZ / PGFPlots / handcrafted SVG가 다음을 독자적으로 재계산해 authority를 바꾸면 안 된다.

- 좌표
- 교점
- 접점
- 중심
- 반지름
- 수직/평행
- 중점/내분점
- 각/길이
- 함수의 critical value
- answer fact

표시 text가 맞아도 실제 primitive가 틀리면 FAIL.

최소 관련 축:
- `GEOMETRY_FACT_PASS`
- `LABEL_OWNER_BINDING_PASS`
- `COORDINATE_SEMANTIC_PASS`
- `ACTUAL_SVG_PARITY_PASS`

변경/신규 SVG마다 item-level evidence에는 최소 다음을 남긴다.

- source exam SHA / solution SHA
- final SVG sha256 + Git blob SHA
- expectedFacts[]
- pythonInputs / pythonCalculatedOutputs
- coordinateModel
- actualSvgPrimitives
- observedFacts[] + delta/tolerance
- labelOwnerBindings
- XML parse result
- browser evidence가 있으면 final SVG SHA와 동일 artifact 결속

이 필드 없이 PASS count만 존재하면 `PHYSICAL_EVIDENCE_MISSING`이다.

---

## 6.1 EXPECTED-FACT COMPLETENESS / SOURCE IDENTITY / FACT ROLE HARD

raw evidence가 있어도 **검증 질문 자체가 불완전하면 PASS가 아니다**.

각 changed SVG evidence는 다음 세 축을 추가로 닫는다.

### A. EXPECTED_FACT_COMPLETENESS
source + verified solution에서 student-facing visual에 관련된 조건을 먼저 inventory한다.

최소:
- `sourceConditionCoverage[]`
- `decisiveRelationCovered=true`
- `uncoveredCriticalConditions=[]`
- `expectedFactCompletenessStatus=PASS`

좌표평면/함수그래프이면 slope/intercept만 검증하지 않는다.
최소 frame facts도 포함한다.

```text
x-axis horizontal
y-axis vertical
axes intersect at intended origin
axis directions/signs are correct
plotted line/curve uses the same coordinate frame
required axis/tick/label identity is preserved
```

### B. SOURCE_SEMANTIC_IDENTITY_PARITY
source의 점/선/원/접점/중심 이름은 임의 재명명하지 않는다.

evidence:
- `sourceSemanticIdentity.applicable`
- `sourceSemanticIdentity.checks[]`
- 각 row: `semanticRole / sourceLabel / artifactLabel / result`

`sourceLabel != artifactLabel`이면 사용자 승인된 pedagogical renaming이 아닌 한 FAIL.
내부 계산용 보조점은 별도 이름을 쓸 수 있지만 source entity를 대체하면 안 된다.

### C. FACT ROLE — GIVEN / DERIVED / CONCLUSION
expected fact마다 다음 role 중 하나를 부여한다.

- `GIVEN`
- `DERIVED_INTERMEDIATE`
- `CONCLUSION`

그리고 visual encoding을 `factVisualizations[]`로 결속한다.

- `GIVEN_STYLE`
- `DERIVED_STYLE`
- `CONCLUSION_STYLE`
- `NOT_RENDERED`

**CONCLUSION을 GIVEN_STYLE indicator(tick, equal-mark, supplied-value style)로 미리 그리면 FAIL**이다.
증명해야 할 등식/합동/길이를 문제에서 주어진 사실처럼 표시하지 않는다.

---

# 7. SOLUTION VISUAL DESIGN LANGUAGE — DIGITAL-FIRST

2차/3차 pilot에서 확인한 장점을 production 기본값으로 승계한다.

## 7.1 TITLE
해설용 visual은 필요하면 상단에 **한 줄 큰 제목**을 둔다.
제목은 학생에게 “이 그림이 무엇을 보여주는지” 알려준다.

좋음:
- “대칭으로 펴는 최소 경로”
- “넓이비와 PQ 최소”
- “g(t)=2인 구간”

나쁨:
- 문제 제목 전체 복사
- 내부 작업명
- 긴 설명문

## 7.2 COLOR
solution visual은 색상 사용을 적극 허용한다.

색은 의미를 가져야 한다.

예:
- neutral: 기본 도형
- primary accent: 결정 관계
- secondary accent: 비교/보조
- warm accent: 선택·최종 결과

원칙:
- 동일 의미는 시험지마다 같은 계열
- 색 없이 흑백으로 봐도 topology/line style/label로 의미 보존
- 색만으로 정답 구분 금지
- 과도한 채도/다색 장식 금지

## 7.3 ROUNDED CARD / PANEL
다음은 적극 허용:
- 결정식
- 경우 분리
- geometry→algebra bridge
- 최종 선택/결론

card는 본문 해설을 복사하는 공간이 아니다.
“학생이 다음 한 단계를 볼 수 있게 하는 작은 칠판”으로 사용한다.

## 7.4 LINE WEIGHT
해설 visual은 문제 원본보다 선이 조금 굵어도 된다.

특히 모바일/패드에서:
- main geometry
- decisive segment
- selected interval
- tangent / radius / minimum path

는 명확하게 보여야 한다.

단, canonical stroke hierarchy를 유지하고 auxiliary line보다 main relation이 강해야 한다.

---

# 8. TYPOGRAPHY CONTRACT

TEXT_FONT와 MATH_FONT를 분리한다.

- 일반 설명: canonical Korean text font stack
- 수학 변수/좌표/식: canonical math font / mathematical italic
- minus는 U+2212 우선
- exact radical/fraction/subscript 표기 유지

**작게 줄여서 충돌을 피하지 않는다.**
canonical 최소 font range 아래로 임의 축소 금지.

충돌 시 우선순위:
```text
relocate
→ leader
→ panel
→ canvas/viewport adjustment
→ composition split
→ backend escalation
```

4px/6px 같은 “들어가기는 하지만 학생이 못 읽는” label은 PASS가 아니다.

**Final viewport HARD:** authored SVG `font-size`가 아니라 실제 Archive required render profile에서의
`finalViewportCssFontPx`를 본다. 학생에게 읽혀야 하는 point/length/angle/math/text label은
**11 CSS px 미만이면 HARD FAIL**, 12 CSS px 이상을 기본 목표로 한다.
축소 때문에 11px 미만이 되면 font만 억지로 줄이지 말고 canvas/viewport/label 밀도/구성을 바꾼다.

학생용 영어 lint:
- 불필요한 영어 문장 = FAIL/POLISH
- math symbol / standard variable만 예외

---

# 9. GRAPH / VIEWPORT CONTRACT

그래프는 “다 들어간다”가 아니라 **읽힌다**가 기준이다.

확인:
- domain / branch
- aspect
- axis scale
- critical point
- interval topology
- label density
- mobile width

equal-unit은 geometry truth에 필요할 때만 사용한다.
함수 그래프에서 equal-unit 때문에 plot이 지나치게 세로/가로로 찌그러지면 다른 scale/viewport를 사용한다.

구간 구조가 핵심이면 FUNCTION_GRAPH보다 NUMBER_LINE / INTERVAL_DIAGRAM이 더 좋을 수 있다.

---

# 10. BUILD / POLISH LOOP

## ROUTINE REPAIR

```text
source + verified solution
→ defect / visual purpose
→ repair
→ math/semantic parity
→ static quality
→ targeted render when needed
→ recheck
→ parent stage
```

## PRINT95 / NEW / FULL REBUILD

```text
source + frozen solution facts
→ visual triage
→ decisive relation design
→ backend selection
→ candidate build
→ math/semantic parity
→ static layout/typography review
→ actual SVG parity
→ real browser render
→ actual font / bbox / collision / clipping / mobile readability
→ visual polish
→ backend escalation if needed
→ rerender
→ independent compare
→ PRINT95_VISUAL_READY
```

일반적으로 2~3회의 bounded browser-driven polish를 허용한다.
필요한 경우 static 단계의 여러 iteration은 가능하다.

---

# 11. REAL RENDER IS A FINISH GATE, NOT A BUILD PREREQUISITE

중요:

> **브라우저 렌더가 현재 환경에서 불가능하다고 candidate 제작을 시작도 하지 않는 것은 잘못이다.**

브라우저가 막혀도 가능한 작업은 끝까지 수행한다.

```text
triage
→ facts freeze
→ backend selection
→ build
→ math/semantic/static polish
→ actual SVG parity
→ PRINT95_RENDER_PENDING
```

그 뒤 실제 render가 가능해지면 이어서 finish한다.

브라우저가 없으면:
- `PRINT95_VISUAL_READY` 선언 금지
- candidate 폐기 금지
- 전체 작업 중단 금지
- 다음 build/static work까지 멈추지 않음

---

# 12. BROWSER EVIDENCE HARD RULE

실제 browser PASS는 **실제 browser에서 나온 raw measurement**에만 부여한다.

필수 원칙:
- candidate SHA와 render evidence SHA 결속
- actual Chromium/approved browser runtime
- actual font load state
- `getBBox()` / `getBoundingClientRect()` 등 real DOM measurement
- clipping / label collision / overflow 확인
- 각 student-facing label의 `finalViewportCssFontPx` 기록
- required render profile에서 `finalViewportCssFontPx >= 11` HARD
- 가능하면 native Archive solution column에서도 확인

금지:
- static script가 `overlapCount: 0`을 하드코딩
- labelCount/height 배열만으로 browser PASS JSON 생성
- “Chrome에서 봤다”는 자기보고만으로 PASS
- synthetic/browser-mimic evidence로 actual render 대체

가능하면 repository의 공식 browser verifier / runtime을 사용한다.
환경 제약으로 공식 route가 안 되면 `RENDER_PENDING`을 유지한다.

---

# 13. KEEP / REBUILD RULE

기존 SVG가 있다고 KEEP하지 않는다.
새 엔진을 쓸 수 있다고 무조건 REBUILD하지도 않는다.

KEEP 조건:
- math/semantic parity
- visual purpose 적합
- student readability
- current quality floor 충족
- PRINT95 작업이면 final render qualification까지 닫힘

기존 asset을 신규 제작 reference로 가리는 blind/fresh 규칙이 있으면 이를 지킨다.
facts를 먼저 동결한 뒤 existing asset을 audit하는 것은 허용할 수 있다.

---

# 14. FAILURE / NO-STOP CONTRACT

visual defect는 라인을 멈추는 이유가 아니다.

```text
실패
→ 정확한 원인 확인
→ 같은 stage에서 repair
→ 다른 backend / composition 경로 전환
→ 가능한 evidence까지 닫기
→ unresolved final gate만 명시
→ 다음 허용 작업 계속
```

`SVG_HOLD`나 whole-exam HOLD를 visual defect 하나 때문에 만들지 않는다.

source/math truth가 unresolved인 경우만 underlying question issue로 올린다.

---

# 15. SYSTEM_VISUAL ROUTE

SYSTEM_VISUAL일 때만 다음 heavy contract를 읽는다.

1. `docs/rules/02_PIPELINES/공통파이프라인_실행계약_v1.md`
2. `docs/rules/02_PIPELINES/작업방식_적응형배치루프_v1.md`
3. `archive/tools/pipeline-core/AGENT_BUDGET.md`
4. `archive/tools/pipeline-core/`
5. complete applicable visual rule pack

routine exam visual에 system qualification ceremony를 역으로 강제하지 않는다.

---

# 16. PARENT ROUTE LOCK

이 skill이 `apmath-archive-exams` CREATE/R1/R2/R3/repair에서 호출됐다면 visual 작업을 닫은 뒤 parent stage로 돌아간다.

visual subtask가 별도의 Archive lifecycle을 만들지 않는다.

최종 원칙:

```text
ONE VISUAL SKILL.
STUDENT UNDERSTANDING FIRST.
MATH TRUTH FROM PYTHON/SEMANTIC FACTS.
BEST BACKEND PER QUESTION.
DIGITAL-FIRST SOLUTION VISUALS.
REAL RENDER FOR FINAL PASS.
NO FAKE BROWSER EVIDENCE.
NO STOP BEFORE BUILD JUST BECAUSE RENDER IS BLOCKED.
```
