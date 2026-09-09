---
name: apmath-archive-exams
description: Archive classified Korean math exam scans and audit, correct, or upgrade existing APMath JavaScript archive exams with full-page-first extraction, independent answer and solution verification, visual-asset provenance, database and question-index registration, and exam/solution/answer render QA; use the similar-question skill for generating variants.
---

# APMath exam archiving

Import original Korean math exam scans, or audit, correct, and upgrade existing
Archive JS answers, solutions, metadata, assets, DB/index records, and render
evidence. Do not declare a final pass until source fidelity, metadata, assets,
DB/index parity, and real browser rendering are evidenced.

## Scope and routing

The current common execution topology is defined by
archive/tools/pipeline-core/AGENT_BUDGET.md and applies to original archive
imports as well as similar-question work. This skill owns source fidelity,
answer/solution completion, archive metadata, and promotion quality; its
domain stages do not authorize extra provider or agent launches. Verify the
active Git worktree skill set before starting a pipeline-dependent task.

~~~powershell
node tools/skills/verify-skills.mjs
~~~

- This skill owns original exam extraction, answer/solution completion, review,
  production promotion, and archive audits.
- For PDF/JPG/scan extraction, use the V2 full-page-first pipeline under
  `archive/tools/past-exam-pipeline/`. Its extraction candidate may have blank
  `answer` and `solution` with `external_agent_required` status.
- For answer/solution completion, consume the pipeline handoff manifest and
  edit only the fields allowed by that handoff. A suspected extraction error
  must be checked against the full page and recorded as a correction report;
  do not silently rewrite `content` or `choices`.
- For similar questions or similar exams, use
  `$apmath-similar-question-pipeline`. The `-4batch` skill is only a deprecated
  compatibility alias, and the adaptive skill is comparison-experiment only.
  Neither is an original-archive import route.

### Source Defect Recovery handoff (v1.2 design candidate)

After full-page-first extraction and blind independent solve, classify the
finding before changing anything:

```text
EXTRACTION_DEFECT -> SOURCE_FIDELITY_RESTORATION
ANSWER_KEY_DEFECT -> independent answer/solution + source ledger
QUESTION_PAYLOAD_DEFECT -> DERIVED_SOURCE_RECOVERY lane
```

`DERIVED_SOURCE_RECOVERY` preserves the original source bytes, choices, visual,
and hashes while handing a distinct recovery operation to the Similar/recovery
engine. `APPROVED_SOURCE_REPAIR` keeps its existing explicit-approval meaning.
The recovered artifact must not be labeled as the original. Any production
slot substitution requires separate `slotUid`/`effectiveArtifactUid`,
`DERIVED_REPLACEMENT_VERIFIED` 1:1 parity, and existing final-closure gates.
Missing source material is `SOURCE_RECOVERY_EVIDENCE_BLOCKED` with a resumable
`SOURCE_RECHECK`, not an automatic human escalation. This is design routing;
it does not authorize canonical or production promotion by itself.

## Start

**Past Exam V3 start HARD GATE:** read
`docs/rules/02_PIPELINES/Past_Exam_V3_COMPLETE.md`. Before source inventory,
extraction, or solution building, read 2–3 complete, good production exam JS
files from the latest Git main and freeze `REFERENCE_SAMPLE_LOCK` with the
whole-question observations and anchored `PRODUCTION_QUALITY_PROFILE`.
Sample JS is QUALITY CALIBRATION ONLY; target PDF is SOURCE TRUTH; existing
target JS is CURRENT BASELINE and must also be read when present. Existing
target solutions never set the new solution quality floor. Missing calibration
blocks `run-one-exam`, direct Python extraction, and core Past Exam preparation
before candidate writes. See the pipeline README for prepare/freeze commands.

1. Locate the repository root and read [archive-layout.md](references/archive-layout.md)
   and [rules-routing.md](references/rules-routing.md).
2. Start from `docs/rules/00_RULES_INDEX.md`; read only the current operational
   rule documents required by the route. Do not treat `docs/rules/90_ARCHIVE/`
   or generated reports as current authority.
3. Check the rules manifest/source-pack state. If a required rule file is
   missing or its manifest hash differs, stop the final release and record
   `SOURCE_PACK_DRIFT`.
4. Inspect one nearby production exam JS, its DB record, its question-index
   rows, and its image directory before generating anything.
5. Inventory source schools, source pages, expected question counts, answer or
   solution sources, and visual questions. Preserve unrelated dirty-worktree
   changes and keep one school or a deliberately bounded sample isolated until
   its complete route passes.

## Route A — extraction candidate

Use the repository pipeline for a new scan import:

```powershell
npm --prefix archive/tools/past-exam-pipeline run check
node archive/tools/past-exam-pipeline/run-batch.mjs --inventory
node archive/tools/past-exam-pipeline/run-batch.mjs --create-selected --grade <고1|고2|고3|중1|중2|중3> --semester <1|2> --exam-type <mid|final>
node archive/tools/past-exam-pipeline/run-batch.mjs --run-selected --selected-manifest archive/_generated/past-exams/_batch/selected_manifest.json
```

For one explicitly prepared manifest, run
`node archive/tools/past-exam-pipeline/run-one-exam.mjs --manifest <manifest.json>`
from the repository root. The V2 contract is:

- full-page PNG is the source of truth for display number, `content`, and
  `choices`; crops are auxiliary zoom evidence only;
- question-wide crops are disabled by default and never become candidate
  `image` fallbacks;
- candidate `image` is blank or points only to a visual-asset crop made from a
  validated `visualAssetBBoxOnPage`;
- `fullPageImagePath` is evidence, not a production problem image;
- uncertain text, choices, formula, or visual bbox becomes manual review;
- blank `answer` and `solution` are normal only while their external-agent
  status says they are pending.

Do not fill dummy text to clear `vision_required`, and do not solve inside the
extraction pipeline.

### Frozen source identity

The Past Exam V2 route freezes an independent
`reports/source_inventory.json` and `reports/source_identity_map.json` before
Vision content is accepted. The inventory binds the source document SHA,
source question number, source page, evidence path, and disposition. Vision is
not an authority for q-number identity. Candidate `id`, array order, and
`qNN` asset names are never substitutes for frozen source identity.

The candidate must cover 100% of the non-excluded inventory set. Every source
question has exactly one disposition; an unexplained source/candidate count gap
is `SOURCE_INVENTORY_COVERAGE_FAIL` and cannot proceed downstream.

## Route B — answer/solution completion

Give the answer/solution reviewer the candidate JS, `pages/`, visual assets,
`reports/answer_solution_required.csv`,
`reports/extraction_manual_review.csv`, and
`reports/gpt_gemini_handoff_manifest.json`.

The V3 extraction handoff permits the exact `allowedCompletionFields` in
`archive/tools/past-exam-pipeline/completion-contract.json`: answer/solution,
classification and solutionImage fields. Legacy V2 handoffs keep their narrower
scope; do not relabel old evidence as V3. Independently solve every question, compare the result with
the source and choices, preserve source defects explicitly, and leave an
uncertain solution unresolved rather than reverse-engineering an answer.

Before promotion, every new candidate/production question must include the
four current subunit fields:

```text
subUnitKey
subUnit
subUnitConfidence
subUnitClassificationDepth
```

The key must be present in the canonical/compiled master, its parent must
match `standardUnitKey`, and its label and confidence/depth values must follow
the current rule documents. Existing legacy files may be reported as
`legacy_exception`; do not bulk-remodel them merely to satisfy the new rule.

The handoff runtime freezes a protected-payload SHA over `content`, `choices`,
source identity/page evidence, `image`, and visual-asset provenance. The
V3 completion lane also binds the entire extraction baseline, and checks actual
field differences against its allowed completion fields. Source image, identity,
content/choices and layout remain protected. An extraction finding is routed to
`SOURCE_FIDELITY_RESTORATION`, never silently rewritten.

## Route C — validation and promotion

New Past Exam completion requires core v2 and FULL_EXAM closure. Use
`prepare-v2 --pipeline past-exam --past-exam-manifest <staged manifest>` with the
normal source/candidate/registry/builder/work-batch arguments. It binds the
calibration lock, source inventory and project-scoped geometry policy and emits
only unreviewed drafts. All questions require typed `solutionQuality` and
V1/V3 `visualBenefit`, even when no visual is ultimately needed. New general
solutions are written afresh; independent U3 checks content, not heading labels.

Validate the generated candidate with the pipeline's V2 validator before any
production write:

```powershell
python -X utf8 archive/tools/past-exam-pipeline/helpers/validate_final_candidates.py `
  --summary <candidate_generation_summary.json> `
  --out <final_validation_summary.json>
```

Require a `reviewed_pass` review envelope, then use the repository promotion
tool with the manifest, candidate, review, and generated asset directory. The
promotion tool must reject missing/blank subunit fields, invalid subunit
confidence/depth values, missing answer/solution, wrong question identity,
and assets outside the candidate's canonical asset prefix.

Promotion additionally requires source-inventory coverage, content/choices
source-fidelity evidence, SHA-bound independent blind math evidence, visual
asset provenance/semantic evidence, serialization integrity, and the exact
source identity set in the common closure. Direct assets require source
question parity; shared visuals require an explicit `SHARED_MATERIAL` UID and
dependency set. `reviewed_pass` is an envelope, not a sufficient string.
Production writes without the canonical helper and a promotion receipt are
`UNAUTHORIZED_PRODUCTION_WRITE`.

After promotion, update `archive/db.js`, rebuild the index with
`archive/tools/build-question-index.mjs`, and run the production audit with
`--strict-new` for each newly imported production JS:

```powershell
node <skill-dir>/scripts/audit_archive_batch.mjs `
  --repo <repo-root> `
  --strict-new `
  --exam original/high/h1/1final/<exam>.js
```

Use the non-strict audit for deliberately unchanged legacy production files;
legacy exceptions must remain visible in the report.

## Visual assets and solution visuals

- Preserve every indispensable source graph, table, seating layout, photo,
  or geometry diagram with a clean, generously padded asset. Never use a full
  page or question-wide crop as a production problem image.
- Keep source-problem `image` separate from instructional `solutionImage` or
  solution-inline SVG. Do not draw solution annotations onto the source crop.
- For new or modified graph/geometry assets, apply the current
  `docs/rules/04_VISUAL/도형추출.md` math, semantic, style, print-publication,
  and render gates. A file existing or having positive `naturalWidth` is not a
  complete visual pass.
- `cropped_for_manual_cleanup` is an intermediate handoff state. A
  `full_page_reference` marker is never a completion state.
- Preserve the repository distinction between `imageSize` and `layoutTag`.
  `subjective-2up` and `fullwidth` are layout candidates requiring approval;
  `full` is an image-size value and does not imply `fullwidth`.

## Browser QA and evidence

For pipeline-core v2 work, record MACHINE_CURRENT collection separately from
the independent RENDER_REVIEW. Capture every required mode and viewport,
including the last question and every continuation block; a machine capture
cannot be promoted to semantic render PASS by itself. Unchanged blocks require
current validated reuse evidence.

Serve the repository and open `archive/engine.html` with the production JS
path. Record a durable `reports/browser_render_check.md` or equivalent
capture/log with `PASS`, `WARN`, `FAIL`, or `NOT_TESTED` for each mode.

- `exam`: `.q-box` count equals the source count, last page is present, and
  every referenced image decodes with positive `naturalWidth`;
- `ans`: `.ans-n` count equals the source count and the last answer is present;
- `sol`: every production question has a non-empty solution, every declared
  solution visual loads, and labels fit the solution column and print layout;
- all modes: no load-error text, broken images, console errors, unrendered
  MathJax, or horizontal overflow;
- `NOT_TESTED` is evidence of an incomplete gate, never a final PASS.

Visually inspect all newly cropped assets in context. Re-check all three modes
after any correction, not only the mode that appeared to change.

## Completion gate

Report completion only when all are true:

- source-page inventory and JS question counts agree;
- every question is source-checked and independently solved or explicitly
  documented as a source defect/uncertain item;
- every `content` and `choices` value matches the full-page source, including
  labels, subparts, scores, qualifiers, symbols, and proof/condition blocks;
- new candidate/production questions have valid subunit metadata and all DB
  fields are accurate;
- every indispensable source visual has a clean asset, and every
  `solutionImage` is present and used only for solution explanation;
- production and candidate JS match byte-for-byte when parity is required;
- question-index counts match the JS and DB record for every target;
- all three browser modes have recorded PASS evidence;
- when a deliverable ZIP exists, the exact deliverable ZIP has passed two
  independent consumers and fresh extraction; production-only flows explicitly
  record package `NOT_APPLICABLE`;
- release state is not inferred from BUILT, ZIP_CREATED, or PNG decode;
- source defects and corrections appear in the relevant answer/solution and
  final report.

Give a school-by-school count table, corrections, source defects, added
assets, candidate/production status, DB/index evidence, browser evidence, and
the exact audit command/result. Do not stage, commit, publish, or modify
unrelated production files unless asked.
