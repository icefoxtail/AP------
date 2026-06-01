# Past Exam PDF to JS Archive Pipeline Rulebook

## 1. Purpose

This rulebook governs conversion of past-exam PDFs into JS Archive candidate files.

It is not a textbook/workbook pipeline. It is for school past exams.

## 2. Pipeline goal

Past-exam PDF conversion should produce reviewable JS candidates and reports, not immediately overwrite the live archive.

Flow:

```text
past-exam PDF
→ manifest
→ page images
→ question crops
→ crop/image assets
→ content/choices extraction
→ JS candidate
→ exam tags
→ answer/solution candidates
→ validation reports
→ review pack
→ reviewed promotion into archive/exams
```

Content completeness gate:

Before answer/solution work starts, the JS candidate must register 100% of the
expected questions with stable numbering, usable problem text, source image
references, and complete objective choices. If this gate fails, the file returns
to content extraction; answer/solution agents must not proceed on that file.
The gate is exam-scoped and order-sensitive: complete one exam JS file in
`displayNo` order, verify continuity from full-page images, and only then move to
answer/solution work. Crops are close-up evidence for hard-to-read questions;
they are not the first source for deciding question order or whether a question
exists. If a crop is missing but the full-page image exists, continue from the
full-page image instead of marking the problem blocked.

## 3. Protected live archive

These are protected during conversion pipeline work:

- `archive/exams/**/*.js`
- `archive/db.js`
- `archive/engine.html`
- `archive/mixed_engine.html`
- `archive/mixer.html`

Generated candidates must be stored outside the live archive until reviewed.

Recommended generated path:

```text
archive/_generated/past-exams/{examId}/
```

## 4. examId and output prefix

Use existing archive naming style.

Recommended format:

```text
{연도}_{학교명}_{학기}_{시험종류}_{학년}_{기출구분}
```

Examples:

```text
24_연향중_1학기_기말_중3_기출
23_여수여고_1학기_중간_고1_기출
25_제일고_1학기_기말_고2_대수기출
```

## 5. Manifest required fields

Each past-exam job must be manifest-driven.

Required fields:

- `examId`
- `year`
- `schoolName`
- `grade`
- `semester`
- `examType`
- `sourceType`
- `pdfPath`
- `answerPdfPath`
- `pageRange`
- `expectedQuestionCount`
- `outputFileName`
- `outputDir`
- `status`
- `notes`

Default `sourceType`:

```text
past_exam
```

## 6. Job statuses

Allowed job statuses:

- `pending`
- `prepared`
- `pages_extracted`
- `crops_ready`
- `records_generated`
- `tags_enriched`
- `answer_solution_drafted`
- `validated`
- `review_pack_ready`
- `blocked`

## 7. Question statuses

Allowed question statuses:

- `ready`
- `image_fallback`
- `content_manual_review`
- `answer_solution_manual_review`
- `formula_manual_review`
- `tag_low_confidence`
- `generated_pending`
- `reviewed_pass`
- `reviewed_fail`

## 8. Crop and image asset policy

Question crop images must be preserved.

Even when text extraction succeeds, retain source crop references for audit.

Policy:

- Do not discard original crop images.
- Do not force uncertain OCR into final `content`.
- Use `image_fallback` when a question is better preserved as an image candidate.
- Mark diagram/table/graph-heavy questions for review if the crop is required to understand the problem.

Image status values:

- `none`
- `has_question_image`
- `has_inline_figure`
- `image_fallback`
- `missing_image`

## 9. Content extraction policy

Allowed:

- extract problem content when the text is clear;
- extract choices when numbering/options are clear;
- keep crop image path with the record;
- classify uncertain content into review reports.

Forbidden:

- invent missing problem text;
- infer omitted options;
- split subquestions arbitrarily;
- merge separate questions without evidence;
- change mathematical meaning to make a question fit a template.

## 10. Answer and solution policy

Answer and solution work is forbidden until the content completeness gate has
passed for the candidate file. The JS candidate must first register 100% of the
expected questions with stable numbering, usable problem text, source image
references, and complete objective choices. If any question is missing, any
required `content` is placeholder/blank, or any objective choices are incomplete,
the manager must return the file to content extraction instead of asking an
answer/solution agent to solve it.
This check is done in strict `displayNo` order for each exam. Full-page images
are the primary source for page order and missing-question recovery; crops are
used only after the full page has been checked and a close-up is needed.

Answer and solution candidates must be produced by solving the extracted
problem first, then cross-checked against official answer/solution evidence when
such evidence exists. Direct solving is the default answer/solution stage, not a
last-resort fallback. Guessing is still forbidden.

Allowed:

- directly solve from verified `content`, `choices`, and source images after
  extraction;
- use answer/solution PDFs as cross-check evidence when mapping is clear;
- generate `answerStatus` / `solutionStatus`;
- generate final `solution` text only after the answer has been evidence-verified
  or directly solved and checked;
- emit review reports.

Forbidden:

- guess answers;
- promote an unverified draft into final `answer` or `solution`;
- include `generated_pending` in a final answer/solution sheet;
- use a weakly matched answer table as verified;
- stop only because an answer/solution source is missing.

Required order:

The pipeline must run as:

```text
extract problem
-> register 100% of expected questions in JS
-> pass content/choices completeness gate
-> directly solve and write answer
-> write solution from the solved answer
-> cross-check official answer/solution sources when present
-> fix confirmed errors or keep direct solution with conflict report
-> final validation
-> report
```

The first answer/solution checklist item is always the content gate: expected
question count matches, every `displayNo` exists exactly once, content is usable,
and objective choices are complete. Official answer mapping and direct solving
start only after this passes.

1. Map answer/solution from official answer or solution PDFs when available.
2. If official answer evidence is missing, directly solve the problem from the
   verified content, choices, full-page image, and question crop if needed.
3. If the solution is missing, write the solution after reading and applying
   `rules/해설프로토콜.md` and the 발문·보기 extraction protocol. The solution
   must be student-facing only, begin with `[키포인트]`, use `\n` for line breaks
   inside JS strings, and end consistently with the verified answer.
4. If direct solving exposes a likely OCR/content error, do not silently edit
   content during the answer/solution stage. Emit a conflict report and route
   the item back to content review.
5. If the answer or solution still cannot be determined, mark the item with an
   unresolved status and report it. Do not leave a silent blank.

The numbered list above is retained for older fallback reports, but new exam
runs must treat official answer/solution sources as cross-check material after
direct solving. When a cross-check conflicts with the direct solution, recalculate
first. If the direct solution remains correct and the source appears wrong, keep
the direct answer/solution and write `answer_solution_conflict_report.json`.

Allowed answer statuses:

- `existing_verified`
- `direct_solved_verified`
- `direct_solved_cross_checked`
- `direct_solved_source_conflict_kept`
- `direct_solved_low_confidence`
- `generated_pending`
- `reviewed_pass`
- `reviewed_fail`
- `answer_unresolved_after_direct_solve`
- `missing_answer`

Allowed solution statuses:

- `existing_verified`
- `direct_solution_verified`
- `direct_solution_cross_checked`
- `direct_solution_source_conflict_kept`
- `direct_solution_pending_review`
- `generated_pending`
- `reviewed_pass`
- `reviewed_fail`
- `solution_unresolved_after_direct_solve`
- `missing_solution`

## 11. Generated JS candidate fields

Candidate question objects should remain compatible with the current archive engine.

Existing-compatible fields:

- `id`
- `n`
- `level`
- `category`
- `originalCategory`
- `standardCourse`
- `standardUnitKey`
- `standardUnit`
- `standardUnitOrder`
- `content`
- `choices`
- `answer`
- `solution`
- `image`

Allowed extension fields:

- `sourceType`
- `sourceFile`
- `sourceQuestionNo`
- `examId`
- `year`
- `schoolName`
- `grade`
- `semester`
- `examType`
- `pageNo`
- `displayNo`
- `subUnitKey`
- `subUnit`
- `conceptClusterKey`
- `problemTypeKey`
- `templateKey`
- `imageStatus`
- `answerStatus`
- `solutionStatus`
- `reviewStatus`
- `tagConfidence`
- `tagStatus`

## 12. Required validation reports

Every conversion run must create at least:

- `validation_summary.json`
- `crop_failed.json`
- `content_manual_review.json`
- `answer_solution_manual_review.json`
- `formula_manual_review.json`
- `missing_image_report.json`
- `missing_answer_report.json`
- `missing_solution_report.json`
- `direct_solve_report.json`
- `solution_generation_report.json`
- `answer_solution_conflict_report.json`
- `cross_validation_report.json`
- `tag_low_confidence_report.json`
- `duplicate_question_report.json`
- `generated_files_manifest.json`

## 13. Promotion rule

Generated JS candidates may be promoted into `archive/exams` only after:

- syntax validation passes;
- expected question count matches or mismatch is explicitly accepted;
- image paths resolve;
- protected-field policy is satisfied;
- answer/solution statuses are safe for intended output;
- manual review queues are either cleared or deliberately deferred;
- `db.js` registration is prepared and checked separately.

## 14. Final review pipeline

Past-exam candidates must pass the review gates in this order before promotion:

```text
1차 구조·무결성 검수
-> 2차 수학·정오답 검수
-> 3차 분류·메타·난이도 태그 검수
-> 최종 무결성 검수
-> promotion report
```

Rules:

- 1차 review checks JS structure, required fields, missing content/choices/
  answer/solution, image paths, string pollution, and render blockers.
- 2차 review directly solves every question again. It must not trust `answer`,
  `solution`, or an official answer sheet as the standard of truth.
- For objective questions, zero correct candidates or multiple correct
  candidates are FAIL only when the prompt does not explicitly allow multiple
  answers. Prompts such as `모두 고르시오`, `옳은 것을 모두`, `정답 2개`,
  `해당하는 것을 모두` allow multiple-answer review.
- If multiple answers are allowed, `answer` must state all correct choices
  clearly, for example `②, ⑤`, and `tags` should include `복수정답`.
- 3차 review checks standardCourse, standardUnitKey/standardUnit, questionType,
  tags, layoutTag/wide, and level. It must not redo the 2차 정오답 review.
- 최종 무결성 검수 verifies structure, math consistency, rendering stability,
  metadata consistency, and report completeness without unauthorized edits.
- A candidate may be promoted only if each gate is PASS or a human explicitly
  accepts documented WARN items. Any FAIL blocks promotion.

## 15. Engine policy

Do not modify engine rendering functions as part of this conversion pipeline.

If the current engine cannot display a candidate safely, mark the candidate/report instead of changing engine behavior.
