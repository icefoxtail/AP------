---
name: apmath-archive-exams
description: Route JS Archive exam work. Existing production exam CREATE/REVIEW automation defaults to the lightweight artifact-first lane; new original exam intake uses Past Exam V3 only when the task is actually a new import.
---

# APMath Archive Exams — CURRENT ROUTER

This skill is a **route selector**, not a second pipeline.

The user's current instruction and the active automation lane are the task authority.
Do not expand a bounded exam job merely because a related rule or tool exists.

## 1. ROUTE SELECTION — DO THIS FIRST

Choose exactly one parent route before reading large rule packs.

### A. ROUTINE_AUTOMATION — DEFAULT FOR EXISTING EXAMS

Use this route when any of the following is true:

- the target already has an Archive JS file;
- the task is CURRENT `CREATE`, `REVIEW1`, `REVIEW2`, `BATCH`, `FINAL`, repair, solution upgrade, layout repair, image repair, or SVG/solutionImage repair;
- the task came from the JS Archive scheduled/automation lanes;
- an existing exam is being fully re-certified, even when every solution is rewritten;
- the source PDF/image is reopened only to verify or repair an existing exam.

**Important:** SVG, image, solution, source re-check, layout, or a small metadata field inside an existing-exam job does **not** escalate the whole task to Past Exam V3 or pipeline-core.

### B. NEW_IMPORT_V3 — NEW ORIGINAL EXAM ONLY

Use this route only when the actual job is to ingest a new original exam from PDF/scan/source into Archive production and the exam does not already have a current production JS artifact, or the user explicitly asks for the full Past Exam V3 import pipeline.

Authority:

- `docs/rules/02_PIPELINES/Past_Exam_V3_COMPLETE.md`
- `archive/tools/pipeline-core/AGENT_BUDGET.md`
- the current Past Exam V3 tooling

### C. SYSTEM_PIPELINE

Use this route only when the task itself is common infrastructure:

- shared generator/validator development;
- pipeline-core or provider bridge work;
- common visual engine changes;
- repository-wide migration;
- canonical/runtime/compiled system surgery;
- reproducibility/idempotence of the pipeline itself.

### D. LEGACY_R2E

Use `docs/rules/02_PIPELINES/JS_ARCHIVE_R2E_INTAKE_TO_MAIN_v3.md` only when the current task is explicitly an R2E/legacy intake release job. Do not route CURRENT CREATE/REVIEW work here merely because old R2E history exists.

### E. SIMILAR QUESTIONS

Variant/similar-question generation belongs to the similar-question skill, not this skill.

## 2. ROUTINE_AUTOMATION READ ORDER

For an existing-exam automation job, keep startup small:

1. Confirm latest `origin/main`, the assigned exam branch/ref, and the exact target exam.
2. Read the active automation prompt / CURRENT lane state. If Notion access is available, use the CURRENT router/lifecycle record only to identify the stage and authority.
3. Read:
   - `docs/rules/02_PIPELINES/Archive_GPT_Artifact_First_Lightweight_v1.md`
   - `docs/rules/02_PIPELINES/Archive_작업전_Golden_Sample_Calibration_v1.md`
4. Read only the canonical rule directly needed by the actual edit:
   - source/layout → `docs/rules/01_CANONICAL/JS아카이브_문항조판_운영규칙_v1.md`
   - student solution → `docs/rules/01_CANONICAL/JS아카이브_학생용해설_운영규칙_v1.md`
   - visual → `.codex/skills/apmath-visual-upgrade/SKILL.md` in its **ROUTINE_EXAM_VISUAL** mode
   - authority write failure → `docs/rules/02_PIPELINES/Archive_Authority_Write_Pending_Materialization_v1.md`
5. Read the target source and current target JS.
6. Calibrate with the closest Golden Samples and relevant Negative Samples.
7. Do the assigned stage and stop at that stage's handoff.

### DO NOT PRELOAD FOR ROUTINE_AUTOMATION

Unless the task explicitly requires them, do **not** enter or preload:

- `Past_Exam_V3_COMPLETE.md`
- `archive/tools/pipeline-core/`
- `AGENT_BUDGET.md`
- provider FINAL_AUDIT / U1-U2-U3 packets
- workBatch/runId/seal/bridge machinery
- R2E contracts
- full Meta Foundation / RPM / L3/L4 / difficulty pipelines
- DB/index rebuilds
- six-case exam/solution/answer desktop/mobile render matrices

Reading those systems is not a quality improvement for a normal existing-exam lane; it is route drift.

## 3. ROUTINE_AUTOMATION SCOPE LOCK

The assigned stage is the scope.

Do not create a new job graph, cohort, batch protocol, review tier, provider launch, or release workflow because a subproblem looks related.

For normal exam work:

```text
ONE ASSIGNED EXAM
→ ONE ASSIGNED STAGE
→ FIX THE ACTUAL ARTIFACT
→ MINIMAL RECEIPT / HANDOFF
```

Subtasks inherit the parent route.

Examples:

- CREATE finds a bad SVG → repair that SVG inside CREATE; do not start a visual pipeline campaign.
- REVIEW1 finds a source typo → apply a deterministic repair when allowed, re-check the affected fields, continue REVIEW1.
- REVIEW2 finds one label collision → repair/rebuild that asset, targeted re-check, continue REVIEW2.
- authority write fails after candidate completion → materialize/preserve the exact candidate and hand off to the write-recovery path; do not rebuild the exam from scratch.

## 4. CURRENT CREATE CONTRACT

For current-generation existing-exam CREATE, follow the Artifact-First lightweight contract:

- preserve source `content/choices/answer/image` exactly unless a verified source repair is part of the task;
- inspect every question in the assigned exam;
- write every current-generation `solution` fresh from source + verified answer before comparing with the old solution;
- keep `solutionRewrite=FULL_ALL_QUESTIONS` and `solutionRewriteCount=N/N` when fully resolved;
- judge QUESTION MICRO_LAYOUT for every question;
- judge visual need from the new solution and directly KEEP / ADD / REPAIR / REBUILD as needed;
- make the student-facing artifact usable, not merely schema-valid;
- unresolved content issues are question-level `ITEM_HOLD`, never whole-exam HOLD/BLOCK.

Do not perform normal production Meta/RPM/L3/L4/difficulty reclassification unless the current prompt explicitly includes it.

## 5. CURRENT REVIEW1 / REVIEW2 CONTRACT

REVIEW1 and REVIEW2 are fresh artifact reviews.

- Do not use previous PASS/verdict text as the answer.
- Check source, choices, answer, mathematics, student solution reproducibility, image crop, micro-layout, and linked solution visuals.
- Repair deterministic defects in the same stage when possible, then re-check the affected axes.
- Keep unresolved findings at the question level.
- Do not open a second pipeline simply because a visual or source defect was found.
- Do not add REVIEW3 unless the user/current authority explicitly adds it.

For current recertification, enforce the upstream full-solution-rewrite evidence rules in the active lightweight/current contract.

## 6. BATCH / FINAL / MAIN BOUNDARY

BATCH/FINAL are publication handoff stages, not another content-review pass.

They should:

- consume the completed stage artifact;
- verify the required final identity/SHA and item-hold gate;
- avoid unrelated edits;
- perform only the write/publish responsibility assigned to that lane.

If `AUTHORITY_WRITE_PENDING` occurs, preserve/materialize the exact candidate and use the dedicated recovery route. Do not repeat CREATE/REVIEW semantics.

## 7. ROUTINE VISUALS

When an existing exam needs SVG/graph/geometry/solutionImage work, enter `apmath-visual-upgrade` in **ROUTINE_EXAM_VISUAL** mode.

Routine visual work stays inside the parent exam stage.

Check the actual mathematical geometry and student readability. Use targeted render only when static/code inspection cannot settle clipping, collision, owner binding, or readability.

The full pipeline-core V1/V2/V3/provider ceremony is reserved for SYSTEM_VISUAL work, not ordinary per-exam repair.

## 8. NEW_IMPORT_V3

Only NEW_IMPORT_V3 uses the full new-original-exam lifecycle.

Once this route is selected, follow `Past_Exam_V3_COMPLETE.md` and current pipeline-core authorities. Do not copy the V3 lifecycle into routine existing-exam work.

## 9. SYSTEM_PIPELINE

For generator/validator/common-engine/migration tasks, read the exact system contracts required by the affected subsystem and run their tests/evidence gates.

A SYSTEM_PIPELINE task may be heavy because the **system is the product**.
A routine exam task should not become heavy because the system exists.

## 10. MINIMAL ROUTINE REPORT

For routine exam automation, the useful completion record is small:

```text
examFile
stage
base/input SHA
final artifact SHA
changedFiles
PASS | PASS_AFTER_REPAIR | DONE_WITH_ITEM_HOLDS | AUTHORITY_WRITE_PENDING
solution rewrite evidence when applicable
itemHoldQuestionIds / reasons when applicable
nextStage
```

Do not generate long packet/seal/evidence trees unless the current task actually needs them.

## 11. ROUTE DRIFT FAIL-SAFE

Before starting a large secondary pipeline, ask one internal question:

> Is this secondary pipeline the user's actual task, or did I reach it only because the assigned exam contains a visual/metadata/render subtask?

If it is only a subtask, stay in `ROUTINE_AUTOMATION`.

The default goal is simple:

```text
MAKE THE ASSIGNED EXAM BETTER
WITHOUT TURNING ONE EXAM INTO A PIPELINE PROJECT.
```
