---
name: apmath-visual-upgrade
description: Route APMath SVG, graph, geometry, and solutionImage generation, modification, and review through the current versioned rule-pack before any work starts.
---

# Apmath Visual Upgrade

Use this skill whenever a task creates, edits, regenerates, attaches, or reviews an SVG, graph, geometry figure, or `solutionImage` for the JS archive.

This skill is a router only. Do not copy, summarize, merge, or rewrite the rule prose here. The authoritative text remains in the repository files below.

## CURRENT EXECUTION ROUTE LOCK

This skill remains router-only, but the current shared execution contract is the completion authority for every new or modified SVG, graph, geometry, or `solutionImage` task. The mandatory current route is:

1. `docs/rules/02_PIPELINES/공통파이프라인_실행계약_v1.md`
2. `docs/rules/02_PIPELINES/작업방식_적응형배치루프_v1.md`
3. `archive/tools/pipeline-core/`

When current rules require independent visual closure for a question whose visual material is newly generated or modified, completion/PASS is allowed only after this lineage is actually closed:

`Builder/Generator → V1 SOURCE_ONLY → V2 ARTIFACT_ONLY → V3 FROZEN_V1_V2 → render-capture → independent render-review → closure`

Past `solution-review-v2.2`, legacy coordinate-parity reports, and past individual review scripts/reports are diagnostic/supporting evidence only. They may not replace current `pipeline-core` closure or justify a PASS declaration. If required current pipeline evidence is missing, `SELF_FAIL` with `MISSING_CURRENT_PIPELINE_EVIDENCE`.

## STUDENT UNDERSTANDING VISUAL POLICY

Do not decide visual generation by asking only, “Can the problem be solved without this figure?” Ask instead, “Does this visual materially improve the speed, clarity, or reproducibility with which a student understands the explanation?”

- `VISUAL_REQUIRED`: The visual is effectively necessary to convey the core logic.
- `VISUAL_OPTIONAL`: The problem can be solved without a figure, but the visual can materially improve the speed, clarity, or reproducibility with which a student understands the explanation. Questions with a clear `STUDENT_UNDERSTANDING_BENEFIT` must not be conservatively treated as `NONE`; actively `ADD` or `REBUILD` the visual material.
- `VISUAL_EXEMPT`: Equations and prose make the explanation sufficiently clear, and a visual would be merely decorative.

`VISUAL_OPTIONAL != DO_NOT_GENERATE`: `VISUAL_OPTIONAL` questions with a clear student-understanding benefit are active generation targets. The existing `pipeline-core` `visualRequirement` schema must not be expanded or changed; its canonical values remain exactly `VISUAL_REQUIRED | VISUAL_OPTIONAL | VISUAL_EXEMPT`.

Graphs, left/right limits, continuity/discontinuity, piecewise functions, branch switching, changes in the number of intersections, tangent/normal lines, increasing/decreasing behavior, local maxima/minima, absolute maxima/minima, derivative-sign changes, function selection/switching, step-like structures, and coordinate/distance/circle/tangent relationships should be actively reviewed as visual candidates from the student-understanding benefit perspective.

Generating many visuals is not itself a goal; mass-producing decorative SVGs is prohibited.

## Mandatory preflight — do this before visual work

1. Resolve the repository root and read `docs/rules/00_RULES_INDEX.md`.
2. Read the following dependencies in this order. For each manifest-covered file, record the exact repository path, declared version, byte count, and SHA-256 from `docs/rules/MANIFEST.md`:

   1. `docs/rules/01_CANONICAL/JS아카이브룰북_v2.6.md`
   2. `docs/rules/02_PIPELINES/COMMON_PROTOCOL_v1.2.10.md`
   3. `docs/rules/02_PIPELINES/공통파이프라인_실행계약_v1.md`
   4. `docs/rules/02_PIPELINES/작업방식_적응형배치루프_v1.md`
   5. Applicable visual/unit rules:
      - `docs/rules/04_VISUAL/도형추출.md` (must declare v3.0)
      - `docs/rules/04_VISUAL/도형의방정식_해설_SVG_독립검수_운영규정_v1.1.md` when the task concerns equations of figures, coordinates, lines, circles, conics, or related geometry explanations
      - The applicable `UNIT_OVERLAY` under `docs/rules/`, if one exists for the target grade/course/unit. Exclude `docs/rules/90_ARCHIVE/` and do not treat unrelated overlays as applicable.
   6. `archive/tools/pipeline-core/README.md` and the needed executors under `archive/tools/pipeline-core/`.

For H15-SB-01/H15-SB-02 집합·명제 Logic Visual qualification, the applicable candidate overlay is `docs/rules/04_VISUAL/AP_MATH_OS_집합_명제_논리시각자료_Semantic_Overlay_v1.4_QUALIFICATION_READY.md`. It is qualification-only until its lifecycle evidence promotes it to `ADOPTED`; it has no production canonical or release authority.

3. Apply the task-specific remainder of the read order from `docs/rules/00_RULES_INDEX.md`, including the relevant pipeline and review rules. The engine-level snapshot order is also exposed by `alive/engine/rule_pack.py::RULE_READ_ORDER`.
4. Before generating or changing an asset, record the effective rule paths and versions in the task evidence/report. A visual task is not started until the manifest entry and working-tree bytes/hash agree for every mandatory file.

## Fail-closed gate

If any mandatory file is missing, unreadable, absent from the manifest, version-mismatched, or hash-drifted, stop before changing SVG, graph, or `solutionImage` content. Report `RULE_ROUTING_BLOCKED`, the missing/drifted path, and the relevant manifest/hash evidence. Do not substitute an older rule, a plan file, a historical file, or memory of the rule.

If no applicable `UNIT_OVERLAY` exists, record that fact and continue with the common ruleset. If an applicable overlay exists but cannot be identified or read, stop; do not infer its curriculum, sampling, style, print, or review requirements.

## Scope boundary

This skill governs routing and preflight only. The rule files define the actual archive schema, protection boundaries, mathematical verification, sampling, coordinates, typography, print behavior, render gates, independent review, and seal requirements. Preserve production/source assets according to those authoritative documents and the user's explicit scope.
