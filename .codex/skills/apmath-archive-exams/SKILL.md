---
name: apmath-archive-exams
description: Special JS Archive route selector. Use only when explicitly invoked, when the task is a true new original-exam import, system/pipeline infrastructure work, explicit legacy R2E recovery, or when the route is genuinely ambiguous. Do not use for already-assigned existing-exam CREATE/REVIEW1/REVIEW2/BATCH/FINAL/repair/solution/layout/image/SVG/Meta/difficulty work.
---

# APMath Archive Exams — SPECIAL ROUTER

This skill is **not a normal Archive exam startup prerequisite**.

The user's current instruction and the already-assigned CURRENT stage are the authority.

## 0. NORMAL EXISTING-EXAM WORK — EXIT THIS SKILL

If the target already has an Archive JS and the task already names or clearly implies a bounded stage such as:

- `CREATE`
- `REVIEW1`
- `REVIEW2`
- `BATCH`
- `FINAL`
- repair
- solution upgrade
- question layout
- image crop/repair
- SVG/solutionImage
- Meta/difficulty work inside the assigned exam stage

then **do not route the task through this skill**.

If this skill was auto-selected for such a task, stop using it immediately. Do not load this skill's references and do not open a larger pipeline merely to reinterpret an already-assigned job.

Use the direct path:

```text
USER / CURRENT LANE INSTRUCTION
→ NOTION CURRENT ROUTER / LIFECYCLE
→ LATEST GIT MAIN
→ TARGET SOURCE + CURRENT TARGET JS
→ ONLY THE CANONICAL RULES DIRECTLY NEEDED
→ EXECUTE THE ASSIGNED STAGE
```

A routine existing-exam task does not need a second route-selection step.

## 1. USE THIS SKILL ONLY FOR TRUE ROUTE SELECTION

Use this skill only when at least one of these is true:

1. the user explicitly invokes `$apmath-archive-exams` or asks which Archive route/pipeline to use;
2. a **new original exam** is being ingested from PDF/scan/source and there is no current Archive JS;
3. the task itself is **shared system infrastructure** such as a generator/validator/common engine/pipeline contract or repository-wide migration;
4. the task is explicitly a **legacy R2E recovery/release** operation;
5. the task is genuinely ambiguous between those route families.

If none applies, this skill is not applicable.

## 2. ROUTE OUTCOMES

### DIRECT_EXISTING_EXAM

This is the outcome for ordinary existing-exam work.

Exit this skill and follow the assigned stage directly. Read only the relevant current production rule(s), for example:

- parent existing-exam production contract when needed: `docs/rules/02_PIPELINES/Archive_GPT_Artifact_First_Lightweight_v1.md`
- source/layout: `docs/rules/01_CANONICAL/JS아카이브_문항조판_운영규칙_v1.md`
- student solution: `docs/rules/01_CANONICAL/JS아카이브_학생용해설_운영규칙_v1.md`
- routine visual: `.codex/skills/apmath-visual-upgrade/SKILL.md` in `ROUTINE_EXAM_VISUAL`
- write-finalization failure: `docs/rules/02_PIPELINES/Archive_Authority_Write_Pending_Materialization_v1.md`

Do not read unrelated pipeline documents.

### NEW_IMPORT_V3

Use only for a true first-time original-exam import, or when the user explicitly requests the full V3 import route.

Authority:
- `docs/rules/02_PIPELINES/Past_Exam_V3_COMPLETE.md`
- current Past Exam V3 tooling and its required system contracts

### SYSTEM_PIPELINE

Use only when the user's task **is the shared system itself**, such as:

- common generator/validator development;
- pipeline-core/provider bridge work;
- shared visual engine changes;
- canonical/runtime/compiled architecture changes;
- repository-wide migration;
- pipeline reproducibility/idempotence as the actual goal.

A single exam needing existing canonical assignment/materialization is not SYSTEM_PIPELINE.

### LEGACY_R2E

Use `docs/rules/02_PIPELINES/JS_ARCHIVE_R2E_INTAKE_TO_MAIN_v3.md` only for an explicitly identified frozen legacy R2E recovery/release job.

### SIMILAR QUESTIONS

Variant/similar-question generation belongs to the similar-question skill, not this skill.

## 3. NO ESCALATION FROM SUBTASKS

None of the following, by itself, is a reason to enter NEW_IMPORT_V3 or SYSTEM_PIPELINE:

- SVG/solutionImage exists or needs repair;
- Meta/RPM/L3/L4/difficulty is part of the assigned exam;
- a render is needed;
- a source typo needs deterministic repair;
- one exam needs compiled/runtime materialization from already-approved canonical data;
- the same defect pattern was seen in more than one exam.

For repeated defects, repair the currently assigned exam first. Move to a shared-system task only when the user/current authority explicitly makes the common system defect or repository-wide migration the task.

## 4. LEGACY REFERENCE BOUNDARY

`references/rules-routing.md` is a **legacy pointer only**. Do not preload it for routine work.

This skill intentionally does not restate CREATE/REVIEW contracts, Meta rules, V3 lifecycle, render matrices, or pipeline-core details. Those belong to their own current authorities and should be opened only when the selected task actually requires them.

## 5. FAIL-SAFE

When in doubt between "existing exam, bounded task" and "large pipeline":

```text
PREFER THE BOUNDED EXISTING-EXAM TASK.
DO NOT TURN ONE EXAM INTO A PIPELINE PROJECT.
```
