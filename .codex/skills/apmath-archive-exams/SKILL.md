---
name: apmath-archive-exams
description: Archive classified Korean math exam scans into the APMath JavaScript archive with full-page-first extraction, staged candidate/production validation, independent answer and solution verification, visual-asset provenance, database and question-index registration, and exam/solution/answer render QA. Use for original exam imports, generated-candidate review, promotion, or archive integrity audits; use the similar-question skill for generating variants.
---

# APMath exam archiving

Import original Korean math exam scans into the repository archive and do not
declare a final pass until source fidelity, metadata, assets, DB/index parity,
and real browser rendering are evidenced.

## Scope and routing

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

## Start

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

## Route B — answer/solution completion

Give the answer/solution reviewer the candidate JS, `pages/`, visual assets,
`reports/answer_solution_required.csv`,
`reports/extraction_manual_review.csv`, and
`reports/gpt_gemini_handoff_manifest.json`.

The extraction handoff permits only `answer`, `solution`, `answerStatus`, and
`solutionStatus`. Independently solve every question, compare the result with
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

## Route C — validation and promotion

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
- source defects and corrections appear in the relevant answer/solution and
  final report.

Give a school-by-school count table, corrections, source defects, added
assets, candidate/production status, DB/index evidence, browser evidence, and
the exact audit command/result. Do not stage, commit, publish, or modify
unrelated production files unless asked.
