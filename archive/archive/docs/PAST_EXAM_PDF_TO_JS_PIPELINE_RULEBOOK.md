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

Answer and solution candidates must be evidence-backed.

Allowed:

- use answer/solution PDFs when mapping is clear;
- generate `answerStatus` / `solutionStatus`;
- create solution drafts only as `generated_pending`;
- emit review reports.

Forbidden:

- guess answers;
- auto-promote generated solution drafts into final `solution`;
- include `generated_pending` in a final answer/solution sheet;
- use a weakly matched answer table as verified.

Allowed answer statuses:

- `existing_verified`
- `generated_pending`
- `reviewed_pass`
- `reviewed_fail`
- `missing_answer`

Allowed solution statuses:

- `existing_verified`
- `generated_pending`
- `reviewed_pass`
- `reviewed_fail`
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

## 14. Engine policy

Do not modify engine rendering functions as part of this conversion pipeline.

If the current engine cannot display a candidate safely, mark the candidate/report instead of changing engine behavior.
