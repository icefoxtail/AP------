# AP Math Past Exam PDF Pipeline

This pipeline converts selected school past-exam PDFs into reviewable JS Archive
candidates. It is intentionally separate from the textbook pipeline.

## Safety Rules

- Inventory may scan the whole source folder.
- JS generation requires an explicit selected manifest or one-exam manifest.
- Generated files stay under `archive/_generated/past-exams`.
- The pipeline must not stop because OCR, content, answer, or solution evidence
  is missing. It must emit the safest candidate JS, write a queue/report for the
  unresolved part, and continue to the next selected PDF.
- Before any answer or solution work starts, the candidate JS must have 100% of
  the expected questions registered with stable numbering, usable problem text,
  source image references, and complete objective choices. Missing content is a
  content-stage blocker, not an answer/solution-stage excuse.
- Each exam must be completed as one ordered JS file first. The manager verifies
  `displayNo` order and continuity from full-page images before using question
  crops. Crops are close-up evidence, not the primary source for deciding whether
  a question exists or where it belongs.
- The live archive is protected:
  - `archive/exams/**/*.js`
  - `archive/db.js`
  - `archive/engine.html`
  - `archive/mixed_engine.html`
  - `archive/mixer.html`

## Naming

- `examId` is the canonical title.
- `window.examTitle` equals `examId`.
- Candidate filenames may include a work suffix such as `.candidate.js`.
- Work suffixes must not be included in `window.examTitle`.

Example:

```js
window.examTitle = "25_제일고_1학기_기말_고2_대수";
```

## First Commands

From `C:/Users/USER/Desktop/AP------`:

```powershell
node archive/tools/past-exam-pipeline/run-batch.mjs --config archive/tools/past-exam-pipeline/pipeline.config.example.json --inventory
```

Create a selected manifest without running conversion:

```powershell
node archive/tools/past-exam-pipeline/run-batch.mjs --config archive/tools/past-exam-pipeline/pipeline.config.example.json --create-selected --recent-years 3 --grade 고1 --exam-type 중간
```

Run only the selected manifest:

```powershell
node archive/tools/past-exam-pipeline/run-batch.mjs --config archive/tools/past-exam-pipeline/pipeline.config.example.json --selected-manifest archive/_generated/past-exams/_batch/selected_manifest.json --run-selected
```

## Current Stage Contract

The current scaffold implements:

1. PDF inventory.
2. Filename/folder metadata parsing.
3. Selected manifest creation.
4. Per-exam generated folder creation.
5. Problem PDF page rendering.
6. Solution PDF page rendering when a solution source exists.
7. 4-page two-column 20-objective + 4-essay scanned exam crop seeding.
8. Extended base-schema JS candidate generation.
9. `image_fallback` candidate JS when text transcription is not available.
10. Required validation reports.
11. Continuity queues for the next stages.

OCR, answer table OCR, formula repair, and final archive promotion are later
stages against the same manifest/output contract.

Content completion is the first hard gate:

- `expectedQuestionCount` must match the number of generated JS question records.
- Every expected `displayNo` must exist exactly once.
- Question records must be ordered by `displayNo` inside each exam JS file.
- Full-page images must be checked first for page spread, question order, and
  missing-question diagnosis.
- Question crops are used only when full-page evidence is too small or a
  formula/figure/choice needs close inspection.
- `crop missing` is not a terminal blocker when the full-page image exists.
- Every question must have usable `content` or an explicit source-backed image
  fallback that is sufficient for transcription.
- Every objective question must have complete choices before answer solving.
- If this gate fails, the next stage is always `content_transcription_queue`;
  do not dispatch answer/solution agents for that candidate file yet.

Answer/solution completion is part of the same non-stop contract after the
content gate is clean:

Updated rule: direct solving is the default stage immediately after problem
extraction. Official answer/solution files are cross-check sources after direct
solving, not blockers before solving. If no official source exists, the pipeline
goes straight from direct solve/solution writing to final validation.

- If answer evidence is not available, the next stage must directly solve from
  verified content, choices, full-page images, and question crops when needed.
- If a solution is missing after the answer is verified or directly solved, the
  solution stage must read `rules/해설프로토콜.md` plus the 발문·보기 extraction
  protocol and finish the student-facing solution.
- Direct solving is not guessing. If the problem cannot be solved because the
  source is unreadable or internally inconsistent, record the unresolved status
  and continue to the next question/PDF.

## Non-Stop Status Model

`partial` is not a failed stop. It means the current job produced a safe candidate
and wrote queue files for unresolved work.

Required continuation files:

- `reports/pipeline_continuity_report.json`
- `reports/NEXT_ACTIONS.md`
- `reports/content_transcription_queue.json`
- `reports/answer_mapping_queue.json`

Batch-level continuation files:

- `_batch/batch_progress.json`
- `_batch/subagent_worklist.json`
- `_batch/batch_validation_summary.json`

Current fallback chain:

```text
no text layer / OCR unavailable
→ render PDF pages
→ crop questions
→ create candidate JS with image fallback
→ write content_transcription_queue.json
→ continue batch
```

```text
answer not confidently mapped
→ render answer/solution pages if available
→ keep answerStatus: "missing_answer"
→ write answer_mapping_queue.json
→ continue batch
```

Updated answer/solution fallback:

```text
answer or solution still missing after evidence mapping
??directly solve from verified content/choices/full-page image/question crop
??write answer with direct_solved_* status
??write solution from 해설프로토콜 when answer is known
??use direct_solution_* status or unresolved-after-direct-solve
??write direct_solve_report.json and solution_generation_report.json
??continue batch
```

Current chain for new exam runs:

```text
problem extracted
??candidate JS registers 100% of expected questions
??content/choices gate passes
??directly solve from verified content/choices/full-page image/question crop
??write answer and student-facing solution
??cross-check answer/solution files if present
??fix confirmed mistakes, or keep direct solution with conflict report
??run final validation
??continue batch
```

## Final Review Pipeline

Promotion is blocked until candidates pass the review gates in order:

```text
1차 구조·무결성 검수
??2차 수학·정오답 검수
??3차 분류·메타·난이도 태그 검수
??최종 무결성 검수
??promotion report
```

Important 2차 rule: objective questions with zero or multiple correct candidates
fail only when the prompt does not explicitly allow multiple answers. If the
prompt says `모두 고르시오`, `옳은 것을 모두`, `정답 2개`, or an equivalent phrase,
multiple correct choices are allowed and the answer must list every correct
choice clearly.

## Batch Continuation Rule

`run-batch.mjs --run-selected` catches each job exception, writes that job as
`fail` or `partial`, updates `_batch/batch_progress.json`, and continues to the
next selected PDF.

This means a selected batch can safely include multiple PDFs. One difficult
exam must not block the rest of the queue.

Subagents should start from `_batch/subagent_worklist.json`. Each item points to:

- the candidate JS;
- `content_transcription_queue.json`;
- `answer_mapping_queue.json`;
- `NEXT_ACTIONS.md`.

Parallel agents must not edit the same candidate JS at the same time. A safe
split is one agent per `examId`, or one content agent and one answer agent only
after their allowed fields are enforced by the queue.

For answer/solution agents, allowed edits are limited to answer, answer status,
solution, solution status, and classification fields allowed by the archive
schema. They must not change content, choices, id, displayNo, layout, or image
fields while solving. If solving reveals a content/OCR conflict, they should
report it back to the content queue instead of patching the problem text.
