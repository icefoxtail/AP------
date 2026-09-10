---
name: apmath-archive-exams
description: Archive classified Korean math exam scans and audit, correct, or upgrade existing APMath JavaScript archive exams with full-page-first extraction, independent answer and solution verification, visual-asset provenance, database and question-index registration, and exam/solution/answer render QA; use the similar-question skill for generating variants.
---

# APMath exam archiving

Import original Korean math exam scans, or audit, correct, and upgrade existing
Archive JS answers, solutions, metadata, assets, DB/index records, and render
evidence. Do not declare a final pass until source fidelity, metadata, assets,
DB/index parity, typed quality evidence, and real browser rendering are closed.

## Scope and routing

`docs/rules/02_PIPELINES/Past_Exam_V3_COMPLETE.md` is the top-level execution
contract for every new original Past Exam job. The execution topology,
provider launch limits, freeze rules, and recheck budget are governed by
`archive/tools/pipeline-core/AGENT_BUDGET.md`. Generated reports and the
intermediate extractor's status strings never outrank those authorities.

The relationship between V3 and the existing extractor is deliberately
narrow:

```text
Past Exam V3 COMPLETE
  └─ S1~S3 SOURCE INVENTORY / FULL-PAGE EXTRACTION / SOURCE FIDELITY FREEZE
       └─ archive/tools/past-exam-pipeline/ V2 full-page-first extractor
            └─ candidate skeleton and page-level extraction evidence
  └─ S4~S8 builder solve, solution/classification, visual triage, expected facts,
       and deterministic visual build
  └─ S9~S14 static, render capture, and sealed U1/U2/U3 FINAL_AUDIT
  └─ S15~DONE repair, at-most-once targeted recheck, promotion, final closure
```

The V2 extractor is a subordinate S1~S3 implementation. It is not the V3
pipeline, a production completion authority, or a reason to stop the main
worker after extraction. Its candidate skeleton, `vision_required`,
`external_agent_required`, `NEXT_ACTIONS.md`,
`gpt_gemini_handoff_manifest.json`, and generated reports are evidence and
diagnostics only. `prepare-v2` is likewise a preparation component; it does
not by itself establish final closure.

This skill owns original-exam source fidelity, builder answer/solution work,
classification, visual routing, review preparation, promotion quality, and
archive audits. It does not authorize extra provider or production-agent
launches. Within one JOB, the main worker performs the complete build and the
pipeline-core FINAL_AUDIT / TARGETED_RECHECK contracts provide the independent
U1/U2/U3 semantic review. A coordinator may orchestrate independent JOBs, but
is never a production builder.

Verify the active Git worktree skill set before starting a pipeline-dependent
task:

~~~powershell
node tools/skills/verify-skills.mjs
~~~

### New V3 versus explicitly requested legacy V2

The default route for a new original exam is V3. Do not route it as:

```text
V2 extraction -> external GPT/Gemini answer/solution fill -> separate completion
```

The main worker continues in the same V3 JOB after source extraction to blind
solve, answer, write a new student-facing solution, classify, perform all-
question V1 visual triage, freeze expected facts, build deterministic visual
artifacts, and prepare machine evidence. An external or independent semantic
review is only the canonical pipeline-core FINAL_AUDIT / U1/U2/U3 execution;
it is not an ad hoc answer/solution handoff.

The former candidate-plus-handoff route is legacy compatibility only. Use it
only when the user explicitly requests a legacy V2 extraction/completion job,
label its evidence as legacy, and do not present its pending handoff status as
V3 completion or production authorization.

## Canonical V3 lifecycle

Keep these meanings independently visible. Do not replace them with invented
bundles such as `S3_VISION_EXTRACTION`,
`S4_S8_COMPLETION_AND_VISUAL_BUILD`, or
`S9_S14_STATIC_AND_U1_U2_U3`:

```text
RULE_PREFLIGHT
CANONICAL_PRODUCTION_SAMPLE_CALIBRATION (CALIBRATION)
PRODUCTION_QUALITY_PROFILE_FREEZE (PROFILE_FREEZE)
TARGET_BASELINE_REVIEW
SOURCE_INVENTORY_FREEZE
FULL_PAGE_EXACT_EXTRACTION
SOURCE_FIDELITY_FREEZE
BUILDER_INDEPENDENT_SOLVE
SOLUTION_AND_CLASSIFICATION_BUILD
ALL_QUESTION_VISUAL_TRIAGE
EXPECTED_FACT_FREEZE
NUMERIC_VISUAL_BUILD
STATIC_AND_RENDER_CAPTURE
FINAL_AUDIT_SEALED_U1_U2_U3
TARGETED_REPAIR
TARGETED_RECHECK_MAX_ONCE
PROMOTION
FINAL_CLOSURE
```

The canonical spelling and stage contract are in
`archive/tools/past-exam-pipeline/completion-contract.json`; the full meaning
and S0.5/S1~S15 ordering are in `Past_Exam_V3_COMPLETE.md`.

## Execution topology and independent-exam isolation

The normal batch capability is unchanged: one pipeline-core JOB may contain
many `runIds`, selected targets, or an entire unit when that is the user's
requested scope. The `AGENT_BUDGET.md` rule “No independent production agent
exists” applies inside that one JOB.

When the user asks for GOLD, pilot, holdout, or independent-comparison
execution of multiple exams, use the stronger isolation route:

```text
ONE EXAM = ONE INDEPENDENT JOB
```

For every exam create separate, unique `workBatchId`, `builderId`,
`builderSessionId`, and `runId`, plus independent staging, evidence, freezes,
and defect ledger. JOB-A and JOB-B may share only the same `START_SHA` and the
same canonical rule pack. They must not share candidates, solutions, visual
facts, calibration evidence, intermediate artifacts, defect ledgers, or
worker context. One exam worker must not inspect or write the other exam, and
one worker must not complete two independent exams sequentially.

Do not evade the one-main-worker contract by adding a production subagent
inside either JOB. FINAL_AUDIT and TARGETED_RECHECK allowances are managed
separately inside each independent JOB.

An upper-level coordinator is orchestration-only. It may confirm the shared
`START_SHA` and canonical rule pack, create JOB-A/JOB-B, start their separate
workers, collect completion state and immutable artifact locations, and write
an aggregate summary. It may not solve questions, write candidates or
solutions, author visual facts, transfer results between JOBs, repair a failed
exam, or merge their evidence.

## Start: V3 hard gates

Read `docs/rules/02_PIPELINES/Past_Exam_V3_COMPLETE.md` before source inventory,
extraction, or solution building. Before candidate writes, read 2–3 complete,
good production exam JS files from the latest Git main and freeze
`REFERENCE_SAMPLE_LOCK` with whole-question observations and anchored
`PRODUCTION_QUALITY_PROFILE`. Sample JS is quality calibration only; the
target PDF/full-page source is source truth; an existing target JS is the
current baseline and must also be read when present. Existing target solutions
never set the new solution-quality floor. Missing or weak calibration blocks
the V3 builder start, direct Python extraction, and core Past Exam preparation.

1. Locate the repository root and read [archive-layout.md](references/archive-layout.md)
   and [rules-routing.md](references/rules-routing.md).
2. Start from `docs/rules/00_RULES_INDEX.md`; read only the current operational
   rule documents required by the route. Do not treat `docs/rules/90_ARCHIVE/`
   or generated reports as current authority.
3. Check `docs/rules/MANIFEST.md` and the compiled master
   `archive/data/master_tables/js_archive_tag_master.json`. If a required rule
   file is missing or its manifest hash differs, stop final release and record
   `SOURCE_PACK_DRIFT`.
4. Inspect one nearby production exam JS, its DB record, question-index rows,
   and image directory before generating anything.
5. Inventory source schools, source pages, expected question counts, answer or
   solution sources, and visual questions. Preserve unrelated dirty-worktree
   changes and keep one school or a deliberately bounded sample isolated until
   its complete route passes.

## S1~S3 — source inventory, V2 extraction implementation, fidelity freeze

Use the repository extractor as the V2 full-page-first implementation beneath
the V3 S1~S3 stages:

~~~powershell
npm --prefix archive/tools/past-exam-pipeline run check
node archive/tools/past-exam-pipeline/run-batch.mjs --inventory
node archive/tools/past-exam-pipeline/run-batch.mjs --create-selected --grade <고1|고2|고3|중1|중2|중3> --semester <1|2> --exam-type <mid|final>
node archive/tools/past-exam-pipeline/run-batch.mjs --run-selected --selected-manifest archive/_generated/past-exams/_batch/selected_manifest.json
~~~

For one explicitly prepared manifest, run
`node archive/tools/past-exam-pipeline/run-one-exam.mjs --manifest <manifest.json>`
from the repository root. Its full-page rules remain binding for extraction:

- full-page PNG is the source of truth for display number, `content`, and
  `choices`; crops are auxiliary zoom evidence only;
- question-wide crops are disabled by default and never become candidate
  `image` fallbacks;
- candidate `image` is blank or points only to a visual-asset crop made from a
  validated `visualAssetBBoxOnPage`;
- `fullPageImagePath` is evidence, not a production problem image;
- uncertain text, choices, formula, or visual bbox becomes manual-review
  evidence;
- blank `answer` or `solution` in this intermediate candidate is not a V3
  terminal state.

If the extractor reports `vision_page_extract_json_missing`, `vision_required`,
or `external_agent_required`, do not HOLD the whole V3 JOB merely because an
external Vision JSON was not automatically supplied. When the exam worker can
read the rendered full-page source image/PDF, it must directly inspect the
source, write fresh page-level extraction evidence in the required schema,
bind it to the source identity/inventory, feed it back into the extractor as
needed, and continue to `SOURCE_FIDELITY_FREEZE` and S4. Never guess empty
content or choices, copy an old candidate, or treat a handoff manifest as
source truth. HOLD is permitted only for a real capability or physical
blocker, such as a worker that cannot read source pixels or an unreadable or
corrupt source.

Freeze independent `reports/source_inventory.json` and
`reports/source_identity_map.json` before accepting page-level content. The
inventory binds source-document SHA, source question number, source page,
evidence path, and disposition. Vision is not an authority for q-number
identity. Candidate `id`, array order, and `qNN` asset names never substitute
for frozen source identity. The candidate must cover 100% of the non-excluded
inventory set; an unexplained count gap is
`SOURCE_INVENTORY_COVERAGE_FAIL` and cannot proceed downstream.

## S4~S8 — same-worker build

After source fidelity is frozen, the main worker continues the same V3 JOB:

1. Independently solve every question from the source and choices.
2. Write a fresh student-facing answer and solution, then assign classification
   and current subunit metadata.
3. Run `ALL_QUESTION_VISUAL_TRIAGE`, freeze `EXPECTED FACT` records, and build
   only the required deterministic visual artifacts.
4. Prepare the typed machine evidence needed for STATIC/METADATA and the
   sealed U1/U2/U3 audit.

Do not pass the extraction candidate to GPT/Gemini as the default answer or
solution completion step. Do not treat extraction completion as the end of
the worker's role. The allowed completion fields are still exact and
protected: `archive/tools/past-exam-pipeline/completion-contract.json` is the
authority for answer, solution, classification, subunit, and solution-visual
fields; source identity, `content`, `choices`, source `image`, and layout stay
protected. Actual field differences must be checked against the bound baseline,
not trusted from `changedFields` self-reporting.

### Typed solution quality

Answer equality is not solution PASS. Review the actual student-facing content
against the current typed contract implemented by pipeline-core
`solution-quality.mjs`, including:

- key idea adequacy;
- condition interpretation;
- reasoning direction;
- intermediate reasoning completeness;
- independent intermediate arithmetic/count verification;
- case-split completeness when applicable;
- student reproducibility;
- internal consistency;
- answer conclusion parity; and
- curriculum boundary.

Also enforce the contract's applicable checks such as mathematical correctness,
range/uniqueness handling, high-level solution requirements, subjective
scoring readiness, and forbidden-expression checks. A correct final answer
does not pass when an intermediate argument, case count, condition, or
calculation is wrong or missing. The typed `solutionQuality` evidence requires
`{status, reason, solutionExcerpts[]}` with excerpts that exist in the current
solution; a string `PASS`, heading, length, MathJax success, or render success
does not replace content review.

Before promotion, every new candidate/production question must include the
current `subUnitKey`, `subUnit`, `subUnitConfidence`, and
`subUnitClassificationDepth`. The key must exist in the canonical/compiled
master, its parent must match `standardUnitKey`, and its label and
confidence/depth must follow current rules. Existing legacy files may remain
visible as `legacy_exception`; do not bulk-remodel them merely to satisfy the
new rule.

### Serialization and curriculum

Serialization integrity of evaluated student-facing strings is required STATIC
evidence. Use the current pipeline-core machine checks and do not reproduce
validator internals in this skill. For high-school questions, validate the
actual exam cohort against the canonical H15/H22 curriculum system and the
compiled master table. A malformed or noncanonical high-school key does not
pass merely because it is non-empty. Record the relevant rule/master evidence
and fail closed when it is absent or inconsistent.

### Visual route: V1 → V2 → V3

For every new or modified solution visual, preserve this order:

```text
V1 visual-benefit triage
  -> EXPECTED FACT freeze
  -> deterministic numeric artifact build
  -> V2 artifact-only observed geometry
  -> expected ↔ observed V3 parity
  -> actual render review
```

V1/V3 `visualBenefit` is required for every question, including questions that
ultimately need no visual. File existence, `naturalWidth`, or a label's mere
presence is never semantic PASS. The canonical generator remains the current
Python-based generator and the active visual contract; an unadopted TikZ/TeX
pilot is not a new canonical authority. For graph/geometry/table assets, also
apply the current visual rule pack and keep source-problem `image` separate
from instructional `solutionImage`.

## S9~S14 — static, six-case render capture, and sealed audit

Record `MACHINE_CURRENT` static/metadata evidence and
`MACHINE_COLLECTOR` render captures separately from the independent
`RENDER_REVIEW`. The final V3 render matrix is exactly:

```text
exam     × desktop, mobile
solution × desktop, mobile
answer   × desktop, mobile
```

Capture and review the last question and every continuation block. A machine
capture cannot become semantic render PASS by itself; unchanged blocks require
current validated reuse evidence. In one canonical FINAL_AUDIT, pipeline-core
seals U1 `SOURCE/MATH_A1/V1`, U2 `V2` artifact-only, and U3
`MATH_A2/SOLUTION/V3/RENDER_REVIEW` under its configured stateless contexts.

Serve the repository and open `archive/engine.html` with the production JS
path. Record durable evidence for all six cases with `PASS`, `WARN`, `FAIL`,
or `NOT_TESTED`:

- exam: `.q-box` count equals source count, the last page/question is present,
  and every referenced image decodes with positive `naturalWidth`;
- solution: every production question has a non-empty solution, every declared
  solution visual loads, and labels fit solution-column and print layout;
- answer: `.ans-n` count equals source count and the last answer is present;
- all modes: no load-error text, broken images, console errors, unrendered
  MathJax, or horizontal overflow.

`NOT_TESTED` is incomplete evidence, never final PASS. Visually inspect newly
cropped assets in context and re-check all six cases after any correction, not
only the mode that appeared to change.

### Diagnostic continuation and fail-closed release

Machine/static/metadata candidate-quality defects remain explicit `FAIL` or
`HOLD` findings in evidence. If downstream semantic audit is technically
executable, those defects alone do not stop observation of FINAL_AUDIT; this is
diagnostic continuation, not permission to pass.

```text
DIAGNOSTIC_CONTINUATION != CANONICAL_PASS
```

The canonical audit may complete with defects, and the main worker repairs them
locally. Promotion and FINAL_CLOSURE remain fail-closed until every required
axis, source identity, solution quality, serialization, curriculum, visual,
render, DB/index, and package obligation is satisfied.

## S15~DONE — repair, promotion, and archive audit

Repair all final-audit defects locally, compute semantic/dependency/render
impact, freeze again, and reserve `TARGETED_RECHECK` at most once through
pipeline-core. There is no PASS-until-retry loop. Accepted unaffected axes
require direct-root validated reuse evidence.

New Past Exam completion requires core v2, the calibration lock, the
project-scoped geometry pin, and whole-exam publication intent. Use
`prepare-v2 --pipeline past-exam --past-exam-manifest <staged manifest>` only
as bound preparation with the normal source/candidate/registry/builder/
work-batch arguments. It emits drafts and does not replace the V3 lifecycle or
FINAL_AUDIT closure.

Validate a generated candidate before any production write:

~~~powershell
python -X utf8 archive/tools/past-exam-pipeline/helpers/validate_final_candidates.py `
  --summary <candidate_generation_summary.json> `
  --out <final_validation_summary.json>
~~~

Require a complete `reviewed_pass` envelope and use the repository promotion
helper with the manifest, candidate, review, and generated asset directory.
The helper must reject missing/blank subunit fields, invalid confidence/depth,
missing answer/solution, wrong question identity, and assets outside the
candidate's canonical asset prefix. Production writes without the canonical
helper and promotion receipt are `UNAUTHORIZED_PRODUCTION_WRITE`.

Promotion additionally requires source-inventory coverage, source-fidelity
evidence for `content`/`choices`, SHA-bound independent blind math evidence,
typed solution quality, visual provenance/semantic evidence, serialization
integrity, curriculum-valid keys, and the exact source identity set in common
closure. Direct assets require source-question parity; shared visuals require
an explicit `SHARED_MATERIAL` UID and dependency set.

After promotion, update `archive/db.js`, rebuild the index with
`archive/tools/build-question-index.mjs`, and run the production audit with
`--strict-new` for each newly imported production JS:

~~~powershell
node <skill-dir>/scripts/audit_archive_batch.mjs `
  --repo <repo-root> `
  --strict-new `
  --exam original/high/h1/1final/<exam>.js
~~~

Use the non-strict audit for deliberately unchanged legacy production files;
legacy exceptions must remain visible in the report.

## Source defects and visual asset contracts

After full-page extraction and blind independent solve, classify a finding
before changing anything:

```text
EXTRACTION_DEFECT -> SOURCE_FIDELITY_RESTORATION
ANSWER_KEY_DEFECT -> independent answer/solution + source ledger
QUESTION_PAYLOAD_DEFECT -> DERIVED_SOURCE_RECOVERY lane
```

`DERIVED_SOURCE_RECOVERY` preserves original source bytes, choices, visual, and
hashes while handing a distinct recovery operation to the Similar/recovery
engine. `APPROVED_SOURCE_REPAIR` keeps its explicit-approval meaning. A
recovered artifact must not be labeled as the original. Any production slot
substitution requires separate `slotUid`/`effectiveArtifactUid`,
`DERIVED_REPLACEMENT_VERIFIED` 1:1 parity, and existing final-closure gates.
Missing source material is `SOURCE_RECOVERY_EVIDENCE_BLOCKED` with resumable
`SOURCE_RECHECK`, not automatic human escalation. This is routing only; it
does not authorize canonical or production promotion.

Preserve every indispensable source graph, table, seating layout, photo, or
geometry diagram with a clean, generously padded asset. Never use a full page,
question-wide crop, or `full_page_reference` marker as a production problem
image. Keep source-problem `image` separate from instructional
`solutionImage`; do not draw solution annotations onto the source crop. Apply
the current visual protocol's math, semantic, style, print-publication, and
render gates. Preserve the distinction between `imageSize` and `layoutTag`.

## Completion gate and report

Report completion only when all are true:

- source-page inventory and JS question counts agree;
- every question is source-checked and independently solved or explicitly
  documented as a source defect/uncertain item;
- every `content` and `choices` value matches the full-page source, including
  labels, subparts, scores, qualifiers, symbols, and proof/condition blocks;
- new candidate/production questions have valid subunit and curriculum
  metadata and all DB fields are accurate;
- every indispensable source visual and required solution visual has semantic
  evidence and correct provenance;
- typed solution-quality evidence is complete and content-backed;
- serialization integrity is PASS evidence, not inferred from successful load;
- production and candidate JS match byte-for-byte when parity is required;
- question-index counts match the JS and DB record for every target;
- all six exam/solution/answer desktop/mobile cases have independent render
  review evidence of PASS;
- when a deliverable ZIP exists, the exact ZIP has passed two independent
  consumers and fresh extraction; production-only flows record package
  `NOT_APPLICABLE`;
- release state is not inferred from BUILT, ZIP_CREATED, PNG decode, or a
  completed diagnostic audit; and
- source defects and corrections appear in the relevant answer/solution and
  final report.

Give a school-by-school count table, corrections, source defects, added assets,
candidate/production status, DB/index evidence, all six browser evidence
states, and the exact audit command/result. Do not stage, commit, publish, or
modify unrelated production files unless asked.
