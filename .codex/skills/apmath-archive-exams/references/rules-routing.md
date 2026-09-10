# APMath archive rule routing

Use this as the short router. Do not copy the full rule pack into a candidate
or handoff; read the authoritative files in the order below. For a new
original Past Exam, V3 is the route and this reference must not turn an
intermediate extractor contract into a competing lifecycle.

## Current authority

1. Start with `docs/rules/00_RULES_INDEX.md`. For Past Exam work, read
   `02_PIPELINES/Past_Exam_V3_COMPLETE.md` first and enforce
   `RULE_PREFLIGHT`, canonical production-sample calibration, profile freeze,
   and target baseline review before source inventory/build.
2. Verify `docs/rules/MANIFEST.md` and the compiled master at
   `archive/data/master_tables/js_archive_tag_master.json` before a
   source-pack-bound final decision.
3. For a new JS extraction/import, read the current canonical rulebook,
   standard-unit master, subunit operating rules, integrated exam-workflow
   protocol, and `문제해설추출.md`; add the extraction v4 protocol when using
   the full-page Vision route.
4. For answer/solution completion, add `해설프로토콜.md`, the relevant
   solution-quality protocol, `무결성검수.md`, and
   `수학_문항오류_검증_프로토콜_v2.1.md`.
5. For corrections and final release, add `수정프로토콜.md`,
   `작업방식_적응형배치루프_v1.md`, the 1차/2차/3차 domain review protocols,
   and the real-render requirements in the integrated protocol.
6. For a graph, geometry, table, or SVG, read current
   `04_VISUAL/도형추출.md`; read the geometry-equation SVG review protocol
   only when that special lane applies.

Agent execution is exclusively governed by
`archive/tools/pipeline-core/AGENT_BUDGET.md`. Review labels do not authorize
per-stage launches or production subagents.

For GOLD/pilot/benchmark/holdout execution, latest-main/rule/calibration
validation is a start-time gate. Once `START_SHA` and the required identities
are frozen, a later `origin/main` advance is `POST_START_MAIN_ADVANCE` and does
not invalidate the job; frozen bytes, hashes, or evidence must still match.
V4 GOLD benchmark eligibility is PDF plus available source-pixel rendering.
Non-PDF input is `GOLD_INELIGIBLE_SOURCE_FORMAT` and is excluded from the
benchmark denominator without deleting production document capability.

`90_ARCHIVE/` contains legacy, draft, superseded, or historical documents. It
is not current authority for a new import.

## V3 lifecycle and pipeline boundary

Keep the canonical stages independently visible:

```text
RULE_PREFLIGHT
CANONICAL_PRODUCTION_SAMPLE_CALIBRATION
PRODUCTION_QUALITY_PROFILE_FREEZE
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

`Past_Exam_V3_COMPLETE.md` is the top-level execution contract.
`archive/tools/past-exam-pipeline/` supplies the V2 full-page-first extractor
only as a subordinate implementation of V3 S1~S3. Candidate skeletons,
`vision_required`, `external_agent_required`, `NEXT_ACTIONS.md`, and
`gpt_gemini_handoff_manifest.json` are intermediate evidence/diagnostics; they
do not close a V3 job.

The default V3 worker reads source pixels itself when the source is readable.
If an extractor reports that Vision JSON was not automatically supplied, the
worker directly extracts fresh page-level evidence, binds it to source
inventory/identity, re-enters the extractor where needed, freezes source
fidelity, and continues. Do not guess empty fields or copy a previous
candidate. HOLD is reserved for a real capability or physical blocker such as
unreadable/corrupt source or inability to inspect source pixels.

The old extraction-to-external-answer/solution handoff is legacy-only and may
be used only when the user explicitly requests a V2 job. It is not the default
route for a new original exam. In V3, the same main worker continues through
independent solve, fresh student solution, classification, all-question V1
visual triage, expected-fact freeze, deterministic visual build, and machine
evidence preparation. Semantic review follows the canonical pipeline-core
FINAL_AUDIT / U1/U2/U3 contract, not an ad hoc GPT/Gemini handoff.

## Pipeline-core execution and diagnostic continuation

One normal pipeline-core JOB may still contain multiple `runIds`; that batch
capability is unchanged. Within that JOB, `AGENT_BUDGET.md` requires one main
worker and provides no independent production agent. FINAL_AUDIT and the
at-most-once TARGETED_RECHECK are managed by that JOB's canonical contract.

Machine/static/metadata candidate-quality defects remain explicit FAIL/HOLD
evidence. If downstream semantic audit is technically executable, those
defects alone do not prevent the audit from being observed or completed with
defects. This is diagnostic continuation, not a release decision:

```text
DIAGNOSTIC_CONTINUATION != CANONICAL_PASS
```

Promotion and final closure stay fail-closed until every required semantic,
source, serialization, curriculum, visual, render, DB/index, and package gate
passes.

## Solution, serialization, curriculum, and visual routing

Answer equality alone is not solution PASS. Check actual solution content
against the current typed pipeline-core contract for key-idea adequacy,
condition interpretation, reasoning direction, intermediate reasoning
completeness, independent intermediate arithmetic/count verification, case
split completeness where applicable, student reproducibility, internal
consistency, answer-conclusion parity, and curriculum boundary. Contract
applicability and evidence shape are authoritative in pipeline-core; do not
replace them with headings, length, or a string PASS.

Student-facing evaluated-string serialization integrity is STATIC required
evidence. High-school questions must validate against the actual exam cohort's
canonical H15/H22 system and the compiled master table; a malformed or
noncanonical key does not pass merely because it is non-empty.

For each new or changed solution visual, route:

```text
V1 benefit triage -> EXPECTED FACT freeze -> deterministic numeric build
  -> V2 artifact-only observed geometry -> expected/observed V3 parity
  -> actual render review
```

The canonical generator remains Python-based under the active project
contract. A TikZ/TeX pilot that has not been formally adopted is not a new
authority. File existence, `naturalWidth`, or label presence alone is not
semantic visual PASS.

The required real-render matrix is six cases:

```text
exam/desktop, exam/mobile,
solution/desktop, solution/mobile,
answer/desktop, answer/mobile
```

Separate `MACHINE_CURRENT`/`MACHINE_COLLECTOR` capture from independent
`RENDER_REVIEW`. Capture the last question and every continuation block;
`NOT_TESTED` is incomplete evidence.

## GOLD / pilot / holdout isolation

When the user asks for multiple exams to run independently for GOLD, pilot,
holdout, or comparison purposes, apply:

```text
ONE EXAM = ONE INDEPENDENT JOB
```

Each exam receives its own unique `workBatchId`, `builderId`,
`builderSessionId`, `runId`, staging, evidence, freezes, and defect ledger.
Jobs may share only `START_SHA` and the canonical rule pack. They may not share
candidate/solution/visual artifacts, calibration or seed evidence, worker
context, prior results, or defect ledgers; one worker may not complete both
exams sequentially. Do not work around the one-main-worker rule by adding a
production subagent inside a JOB.

A coordinator may create/start the independent JOBs, verify shared inputs,
collect completion and immutable artifact locations, and write an aggregate
summary. It may not solve, author, repair, transfer, or merge exam evidence.

## Similar-question boundary

`apmath-similar-question-pipeline` owns generation of similar questions and
similar exams. Its production Archive is read-only during generation and its
packages are not original-archive registrations. The `4batch` skill is a
deprecated compatibility alias; `adaptive` is an explicit comparison lane.
Do not merge their ALIVE stages, model routing, or experimental runtime into
this original-exam import skill.
