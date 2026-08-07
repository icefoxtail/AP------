---
name: apmath-archive-exams
description: Archive classified Korean math exam scans into the APMath JavaScript archive with question transcription, independent answer and solution verification, cropped image assets, database and question-index registration, and exam/solution/answer render QA. Use when importing one or more school exam papers from 분류완료 folders, continuing a grade-by-grade exam archive batch, reviewing a generated candidate, or auditing whether an APMath exam import is genuinely complete.
---

# APMath exam archiving

Convert scanned exams into the repository's native archive format and do not declare completion until every gate below passes.

## Start

1. Locate the repository root and read `references/archive-layout.md`.
2. Inspect one nearby production exam JS, its DB record, and its image directory before generating anything.
3. Inventory source schools, source pages, expected question counts, and visual questions. Work in the user's requested school or grade order.
4. Preserve unrelated dirty-worktree changes.

## Process one school completely

1. Render or inspect every source page at readable resolution.
2. Transcribe every question, choice, condition, score, answer, and diagram-dependent fact verbatim from the printed source. Do not summarize, paraphrase, normalize away instructions, or replace a displayed proof/condition block with a description of it. Preserve question labels, subparts, domains, qualifiers, and scores.
3. Independently solve each question. Do not trust handwriting, OCR answers, or an existing candidate. Record source defects explicitly instead of inventing an answer.
4. Create the candidate JS in the generated import directory and the production JS in `archive/exams/original/...` using the established local schema.
5. Supply every indispensable graph, table, seating layout, photo, or geometry diagram. Save canonical images below `archive/assets/images/<exam-title>/` and set each question's `image` path. Crop generously enough that no printed line, label, axis, arrow, or boundary is clipped. When the user will clean contaminated source images manually, preserve the handwriting/marks and label the asset `cropped_for_manual_cleanup`; do not reconstruct it. Otherwise the final asset must contain only the necessary visual. A `hasVisualAsset` marker without a usable image, SVG, table, or faithful textual reconstruction is incomplete. When a graph or diagram is needed to understand the worked solution, create a separate instructional asset and register it with `solutionImage`; do not draw solution annotations onto the source problem image.
6. Add or update the `archive/db.js` record. Require correct file, school, grade, year, semester, exam type, subject, content type, and question count.
7. Rebuild `archive/question-index.js` with the repository tool.
8. Run the bundled audit script, then perform browser QA for `exam`, `sol`, and `ans` modes.

Finish one sample school end-to-end before processing a large batch unless the user has already approved the format.

## Browser QA

Serve the repository locally and open `archive/engine.html` with the production JS path.

- In `exam` mode, confirm `.q-box` count equals the source count and every image has positive `naturalWidth`.
- In `ans` mode, confirm `.ans-n` count equals the source count.
- In `sol` mode, confirm the solution view loads and every question has a non-empty solution in the JS audit.
- In `sol` mode, confirm every declared `solutionImage` loads, fits inside its solution column, and keeps labels legible in print layout.
- In all modes, reject load-error text, broken images, console errors, and horizontal overflow.
- Visually inspect all newly cropped assets in context.

Use the browser-control skill when available and finalize browser tabs after the audit.

## Deterministic audit

Run:

```powershell
node <skill-dir>/scripts/audit_archive_batch.mjs --repo <repo-root> --exam original/high/h1/1final/<exam>.js --exam original/high/h1/1final/<exam2>.js
```

The script verifies JS evaluation, unique IDs, required content/answers/solutions, image existence, DB metadata and counts, question-index counts, and candidate/production hash equality when a candidate exists.

## Completion gate

Report completion only when all are true:

- Source-page inventory and JS question counts agree.
- Every question has been source-checked and independently verified.
- Every `content` and `choices` value has been compared against the actual source image; any paraphrase, missing score, omitted qualifier, changed symbol, or summarized condition/proof block is FAIL.
- Every source prompt containing an indispensable printed graph, diagram, table, or layout has a corresponding clean asset. Assets containing prompt text, choices, handwriting, answer marks, or unrelated page content are FAIL.
- Required visual assets render; no `full_page_reference` placeholders remain.
- Production and candidate JS files match byte-for-byte when both exist.
- Every DB record has a non-empty subject and accurate `qCount`.
- Question-index counts match every DB record.
- All three modes load, and exam/answer DOM counts match.
- Any source defect is documented in the answer or solution and in the final report.

Give a school-by-school count table, list corrections and source defects, list added assets, and state the exact validation evidence. Do not stage, commit, or publish unless asked.
