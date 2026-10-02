---
name: apmath-visual-upgrade
description: Route JS Archive SVG, graph, geometry, and solutionImage work. Routine per-exam visuals stay inside the parent CREATE/REVIEW stage; full pipeline-core visual ceremony is reserved for shared engine/system work or an explicit request.
---

# APMath Visual Upgrade — CURRENT ROUTER

## CURRENT HARD START GATE — 2026-10-01

ROUTINE_EXAM_VISUAL의 CREATE/REVIEW/repair/rebuild worker는 source/target SVG를 실제로 검수하거나 수정하기 전에 `Archive_작업전_Golden_Sample_Calibration_v1.md`의 Golden 2~3 + 관련 visual/복성고 Negative Sample을 읽고 calibration preflight를 닫는다.

- visual repair/rebuild: `solution-calibration-gate.mjs --stage VISUAL_REPAIR --preflight`
- repair 후 독립 visual recheck: `--stage INDEPENDENT_RECHECK --preflight`
- 공통 visual axes: `VISUAL_SEMANTIC_PARITY / VISUAL_READABILITY`
- sample pre-read는 quality bar를 맞추기 위한 것이며 target geometry truth는 source + verified solution에서 독립 판정한다.
- post-R3에서는 preflight가 `R3_LOCKED` 범위를 다시 여는 근거가 아니다.


## CURRENT HARD FINISH MODE — 2026-10-03 — PRINT95_VISUAL_BUILD

학생용 SVG/그래프/solutionImage를 **신규 제작·전면 REBUILD·현대화 파일럿**하면서 목표가 학교 내신/교육청·평가원 모의고사 수준의 출판 품질이면 `ROUTINE_EXAM_VISUAL`로 끝내지 말고 `PRINT95_VISUAL_BUILD`를 선택한다.

`PRINT95_VISUAL_BUILD`는 SYSTEM_VISUAL 코드 자격검증과 다르다. 공통 엔진을 재개발하지 않지만 개별 학생용 artifact는 **수학 정확성 이후의 마감 공정까지** 닫아야 한다.

고정 목표:
- current Golden Sample은 quality floor이지 ceiling이 아니다.
- 내부 목표는 **학교 시험지·모의고사 인쇄 시각물 체감 품질 95%+**다.
- 단일 합산 점수로 결함을 상쇄하지 않는다. 수학 정확성 / decisive-step 전달 / 도형 자연스러움 / typography / 정보밀도 / 불필요 요소 억제 / 실제 인쇄 가독성 중 하나라도 명확히 미달이면 완료가 아니다.
- 기존 SVG가 있다는 이유로 KEEP하지 않는다. 반대로 그릴 수 있다는 이유만으로 VISUAL_EXEMPT를 깨지 않는다.

`PRINT95_VISUAL_BUILD` 완료 루프:
```text
source + verified/frozen solution facts
→ visual necessity / decisive relation 판정
→ Python numeric geometry authority
→ semantic validation
→ backend 선택
→ candidate build
→ actual SVG parity
→ real Chromium render
→ actual font / getBBox / collision / clipping / print readability
→ composition/typography polish
→ 필요 시 backend escalation
→ rerender
→ independent visual compare
→ PRINT95_VISUAL_READY
```

`APPROXIMATE_BUILD_SIDE_ONLY`, `CANDIDATE_REQUIRES_QA`, static parity PASS는 완료 상태가 아니다.

### BACKEND ESCALATION GATE

STANDARD SVG는 기본 초벌 경로일 뿐 강제 최종 backend가 아니다.
- `STANDARD_SVG`: 단순 좌표기하·원·직선·기본 이동.
- `MINIMAL_EXAM_DIAGRAM`: 불필요한 축/tick/grid/설명 상자를 제거하고 decisive geometry만 남기는 시험지식 최소 결정도형.
- `COMPOSITE_PANEL`: 경우 2개 이상, 이동 전/후, context→decisive reduction처럼 한 장에 욱여넣으면 가독성이 떨어지는 경우.
- `TIKZ_SPECIAL`: 복잡한 수학 typography, 정교한 vector drafting, 다수 각·길이·보조선 정렬, STANDARD 결과가 기계적으로 보이는 경우.
- `PGFPLOTS_SPECIAL`: 함수/그래프에서 축·tick·곡선·수학 조판의 출판 품질이 STANDARD graph보다 중요하거나 95% 목표에 못 미치는 경우.
- `RASTER_KEEP`: 원본 고품질 raster/vector가 재구성보다 우수하고 source context 보존이 더 안전한 경우.

Python/semantic layer가 항상 수학 authority다. TikZ/PGFPlots/SPECIAL backend가 좌표·교점·접선·정답 사실을 독자적으로 재계산해 authority를 바꾸면 안 된다.

STANDARD가 수학적으로 PASS해도 **font, spacing, baseline, label hierarchy, line weight, panel balance, naturalness, print readability**가 부족하면 PASS하지 말고 polish 또는 escalation한다.

### MANDATORY FINISH LOOP

`PRINT95_VISUAL_BUILD`에서는 real browser QA가 선택사항이 아니다.
- Chromium/Playwright 실제 렌더를 최소 1회 수행한다.
- `getBBox()` / `getBoundingClientRect()` / actual font fallback / clipping / collision / condition-box overflow를 확인한다.
- 첫 렌더가 출판 품질에 미달하면 visualSpec/layout/backend를 수정하고 재렌더한다.
- 일반적으로 최대 2~3회 bounded polish loop를 사용한다.
- 실제 browser 실행이 불가능하면 `PRINT95_VISUAL_READY`를 선언하지 않고 `PRINT95_RENDER_PENDING`으로 닫는다.
- 학생용 artifact에 내부 변수명·개발자식 라벨·불필요한 영어·임시 디버그 텍스트를 남기지 않는다.

### GOLDEN FLOOR / PRINT95 TARGET

`Archive_작업전_Golden_Sample_Calibration_v1.md`의 current Golden은 **최저선**으로 사용한다. 최종 target은 Golden을 단순 복제하거나 약간 넘는 것이 아니라, `도형추출.md`의 typography / geometry publication / print readability 규칙까지 적용하여 학교 내신·교육청·평가원 모의고사 시각물에 가까운 95%+ 품질을 목표로 한다.

PRINT95 작업은 최종 compare에서 최소 다음 축을 독립 확인한다:
`MATH_SEMANTIC / DECISIVE_STEP / EXAM_DIAGRAM_NATURALNESS / TYPOGRAPHY / COMPOSITION / INFORMATION_DENSITY / PRINT_READABILITY / ACTUAL_RENDER`.

모두 닫히기 전에는 `PRINT95_VISUAL_READY`를 선언하지 않는다.


This skill is a **visual route selector**.

A visual subtask must not silently replace the parent exam task with a pipeline project.

## 1. SELECT ONE VISUAL MODE FIRST

### A. ROUTINE_EXAM_VISUAL — DEFAULT

Use this mode when a CREATE/REVIEW/repair job for an existing exam needs to:

- inspect an existing SVG/graph/geometry figure/solutionImage;
- add a missing student-helpful visual;
- repair/rebuild a visual;
- fix label placement, owner binding, clipping, collision, proportion, coordinates, or semantic geometry;
- decide whether a visual is useful for one or more questions in the assigned exam.

The parent exam stage remains the authority.

### B. SYSTEM_VISUAL

Use the heavy system route only when the task itself is:

- shared visual generator/validator development;
- common geometry/graph engine modification;
- a new reusable visualization family or production visual engine;
- pipeline-core visual contract work;
- repository-wide visual migration;
- an explicitly requested exhaustive visual qualification/audit that requires the system pipeline.

## 2. ROUTINE_EXAM_VISUAL READ ORDER

Keep routine visual startup bounded:

1. Parent exam task + current stage.
2. `docs/rules/02_PIPELINES/Archive_GPT_Artifact_First_Lightweight_v1.md`, especially the visual section.
3. `docs/rules/02_PIPELINES/Archive_작업전_Golden_Sample_Calibration_v1.md` and the relevant visual Negative Samples.
4. Source problem + verified current solution.
5. Only the applicable visual canonical:
   - `docs/rules/04_VISUAL/도형추출.md`
   - geometry-equation/coordinate-specific visual rule when actually applicable
   - applicable unit overlay when one actually exists and is needed

Do not read unrelated overlays.

### DO NOT AUTO-ENTER SYSTEM_VISUAL

For routine exam visuals, do not start:

- pipeline-core work batches;
- provider FINAL_AUDIT;
- U1/U2/U3 packet/seal workflows;
- full Past Exam V3;
- six-case whole-exam render matrices;
- common engine qualification;
- repository-wide visual evidence regeneration.

The existence of one SVG defect is not a reason to launch a system pipeline.

## 3. ROUTINE VISUAL QUALITY BAR

Judge the actual artifact, not ceremony.

For every created or changed visual, verify the applicable facts:

- all required points, segments, rays, arcs, graph branches, tables, or marks actually exist;
- labels belong to the correct point/segment/angle/region;
- angle labels sit in the intended vertex/wedge;
- length labels are attached to the intended segment;
- claimed midpoint, perpendicular, parallel, equal-length, tangent, center, bisector, intersection, coordinate, or ratio relationships are true in the artifact;
- source/problem visual and instructional `solutionImage` remain distinct;
- no misleading overlap, clipping, label collision, or ambiguous owner binding;
- the student can see the decisive solution relationship quickly.

Current recurring negative checks include:

- `MISSING_OWNER_RAY`
- `ANGLE_LABEL_OWNER_BINDING`
- `LABEL_OWNER_BINDING`
- `COORDINATE_SEMANTIC_PARITY`

Text that says the right thing does not rescue geometry that draws the wrong thing.

## 4. VISUAL TRIAGE

Use:

- `VISUAL_REQUIRED`: needed to communicate the core logic;
- `VISUAL_OPTIONAL`: not strictly required, but materially improves understanding/reproducibility;
- `VISUAL_EXEMPT`: decorative or unnecessary.

`VISUAL_OPTIONAL` is not an automatic skip. If student understanding clearly improves, add or rebuild the visual.

Do not mass-produce decorative SVGs.

## 5. ROUTINE BUILD / REPAIR LOOP

For a routine exam visual:

```text
source + verified solution
→ decide what the visual must show
→ inspect/build the artifact
→ check mathematical/semantic parity
→ check labels/owners/collisions
→ targeted render only if needed
→ repair
→ re-check affected facts
→ return to the parent exam stage
```

Do not create a parallel lifecycle.

## 6. TARGETED RENDER RULE

Use code/static inspection first.

Run targeted render when needed to settle issues that static evidence cannot reliably decide, such as:

- clipping;
- actual label collision;
- tiny unreadable marks;
- ambiguous angle/segment owner placement;
- solution-column print readability.

Routine targeted render is evidence for the affected asset/question only. It does not require a whole-exam multi-device matrix unless the parent task explicitly requires that.

## 7. ROUTINE FAILURE / HOLD BOUNDARY

A visual-only defect should normally be repaired in the same stage.

Do not create `SVG_HOLD` or whole-exam HOLD merely because a visual is wrong.

If source/math truth is unresolved, record the underlying question-level source/math issue.
If the worker genuinely cannot inspect/build the required artifact because of a real capability blocker, record the item-level capability blocker and continue the rest of the exam as allowed by the parent stage.

Missing system-pipeline ceremony is not itself a blocker in `ROUTINE_EXAM_VISUAL`.

## 8. SYSTEM_VISUAL ROUTE

When the task is truly SYSTEM_VISUAL, then read and obey the full current system contracts, including as applicable:

1. `docs/rules/02_PIPELINES/공통파이프라인_실행계약_v1.md`
2. `docs/rules/02_PIPELINES/작업방식_적응형배치루프_v1.md`
3. `archive/tools/pipeline-core/AGENT_BUDGET.md`
4. `archive/tools/pipeline-core/`
5. the complete applicable visual rule pack and unit overlays

For SYSTEM_VISUAL, the stronger pipeline evidence and independent audit gates may be required.

That requirement does **not** flow backward into ordinary per-exam visual repair.

## 9. PARENT ROUTE LOCK

If this skill was entered from `apmath-archive-exams` ROUTINE_AUTOMATION, return to that parent stage after the visual is repaired/reviewed.

Do not promote yourself into NEW_IMPORT_V3 or SYSTEM_PIPELINE.

The governing principle is:

```text
ROUTINE EXAM VISUAL = FIX THE VISUAL.
SYSTEM VISUAL = VALIDATE THE VISUAL SYSTEM.
```
