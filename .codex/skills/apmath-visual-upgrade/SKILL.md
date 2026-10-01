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
