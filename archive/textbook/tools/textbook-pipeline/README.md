# AP Math Textbook One-Click Pipeline

## Fixed Production Order

The pipeline production order is now mapping-first and `jsFile`-scoped. Empty
content is a production metric, but only content that passes the success gate is
counted as filled.

```text
1. Fix operating JS scope
   - include archive/textbook/{book}/generated/js/**/*.js only
   - exclude backup/review_pack/final_clean/draft_content/reports/root outputs
2. Lock one jsFile work unit
   - no concurrent edits to the same JS file
3. Audit question-page-displayNo mapping
   - confirm setKey + id/displayNo + pageNo + fullPageImagePath
   - never treat bboxSlotNo as a printed display number
4. Fill content/choices only for mapping-confirmed questions
5. Apply content success gate
   - non-empty text content
   - no broken OCR/mojibake
   - no image path or <img>
   - page/displayNo evidence exists
   - no image-only content
   - choices are structurally valid when present in the source
6. Split mapping/input failures by cause
   - source_image_missing
   - displayNo_page_mismatch
   - duplicate_slot_candidate
   - stale_or_extra_js_question
   - non_problem_page
   - unreadable_ocr
   - visual_asset_required
   - content_input_pending
7. Fill answer only when answer_source_map exists
8. Run node --check and questionBank parse
9. Move to the next jsFile
```

The core rule is: a question is successful only when the entered text has
page/displayNo evidence. Non-empty broken OCR, image-only content, or guessed
text must remain manual review.

No-stop rule: mapping failures, OCR failures, missing answer sources, stale JS
candidates, and manual-review items do not stop the whole pipeline. Classify the
item, write the report, and continue. If a `jsFile` fails syntax or parse after
an edit, restore the last safe backup for that file, mark that file failed or
manual review, and proceed to the next `jsFile`.

## Common Failure Cause Audit And Repair Flow

The one-click pipeline now includes common read-only failure classification stages
that apply to every `bookId`, `setKey`, and JS file. These stages do not target a
specific textbook or a specific question, and they do not edit generated textbook
JS.

Final common flow:

```text
PDF / full page images ready; question_crop_map optional for mapping/zoom evidence
-> 04B question-id-mapping-guard
-> fresh JS / input manifest ready
-> operating JS scope fixed
-> jsFile lock acquired
-> 06C question-page-mapping-audit
-> 06D question-page-mapping-repair candidate
-> 06B crop quality audit
-> existing 07 visual asset crop
-> 07A visual-asset-link-audit
-> 10B content/choices input for mapping-confirmed questions
-> 10B-SCAN content success gate / broken formula/string scan
-> 10B-FAIL empty-content-cause-classify
-> 10C answer input
-> 10C-FAIL missing-answer-cause-classify
-> 10C-SCAN answer string risk scan
-> 11 structure/rulebook guard
-> 12 formula repair target extract
-> 12B Gemini patch build
-> 12D Codex exact-once apply
-> 12C review/input packs
-> 13 final review/apply
-> 14 final validation
```

New stage roles:

- `04B-question-id-mapping-guard`: runs immediately after `question_crop_map`
  creation and before fresh JS skeleton/input-model creation. It separates
  crop-internal `bboxSlotNo` from printed question identity, accepts only crops
  with confirmed `sourceDisplayNo`, writes `fresh_js_input_manifest`, and sends
  unconfirmed crops to map review.
- `06C-question-page-mapping-audit`: checks JS `id`/`displayNo`/`setKey`
  against question crop map, page/section map, full page images, and available
  display-range metadata. It writes audit and summary reports only.
- `06D-question-page-mapping-repair`: reads the `06C` audit and emits page
  mapping repair candidates when the same `setKey` and display number resolve to
  exactly one page. Map writing is disabled by default and requires
  `applyQuestionPageMapRepair === true` or `--apply-map-repair`.
- `07A-visual-asset-link-audit`: reuses the existing `07` visual asset crop
  output and checks whether JS `image` links point to visual asset crops instead
  of page/question crops. It does not create new crops.
- `10B-FAIL-empty-content-cause-classify`: classifies remaining empty `content`
  after `10B` into reusable causes such as page mapping mismatch, missing full
  page image, missing crop, visual-asset-only question, stale JS question, or
  manual review.
- `10C-FAIL-missing-answer-cause-classify`: classifies remaining missing
  `answer` values after `10C` using answer reports, answer candidates, mismatch
  reports, quick answer table, and answer crop maps.

All audit/classify stages support rerun-oriented options such as `--book-id`,
`--book-root`, `--reports-dir`, `--out`, `--set-key`, `--limit`, and `--chunk`
where applicable. They write count summaries by failure cause/status so large
batches can be retried by `setKey` without manually searching every JS file.

## Stage 04B Question ID Mapping Guard

Stage `04B-question-id-mapping-guard` protects fresh JS creation from accidental
slot-number leakage.

Rules:

- `bboxSlotNo` is only the order of a crop box inside a page or crop pass.
- `bboxSlotNo` must not become `displayNo`, `sourceDisplayNo`, or
  `jsIdCandidate`.
- `sourceDisplayNo` is accepted only when the printed question number is
  confirmed from full-page evidence, OCR/source text metadata, publisher index
  metadata, or an explicit confirmation flag.
- A crop without confirmed `sourceDisplayNo` is excluded from
  `fresh_js_input_manifest` and written to map review.
- `globalId` is an internal stable id and remains separate from
  `sourceDisplayNo`.
- Workbook-style numbering that restarts at `01` is identified by
  `setKey + sourceDisplayNo`, not by display number alone.

Outputs:

- `generated/reports/question_id_mapping_guard_report__{bookId}__{yyyymmdd}.json`
- `generated/reports/question_id_mapping_review__{bookId}__{yyyymmdd}.json`
- `generated/reports/fresh_js_input_manifest__{bookId}__{yyyymmdd}.json`
- `generated/reports/fresh_js_input_manifest.json`

Downstream fresh JS/input-model stages must read `fresh_js_input_manifest.json`
before falling back to legacy crop maps.

Run from `archive/textbook`:

```powershell
node tools/textbook-pipeline/run-oneclick-pipeline.mjs --config pipeline.config.json
node tools/textbook-pipeline/run-oneclick-pipeline.mjs --config pipeline.config.json --dry-run
```

When `outputByInputPdfFolder` is `true`, the pipeline creates a target folder from
the original input PDF filename with only `.pdf` removed, then writes all generated
work under that folder:

```text
archive/textbook/{originalPdfFileNameWithoutPdf}/generated
```

Example:

```text
archive/textbook/_미래앤_고등_공통수학1_교과서/generated
archive/textbook/_비상교육_ 고등_공통수학1(김원경)_교과서/generated
```

Use a per-book config to select the source PDF:

```powershell
node tools/textbook-pipeline/run-oneclick-pipeline.mjs --config pipeline.miraen.config.json --dry-run
node tools/textbook-pipeline/run-oneclick-pipeline.mjs --config pipeline.miraen.config.json
```

After the main pipeline passes, create the unit-level content/choices review packs:

```powershell
node tools/textbook-pipeline/helpers/make_unit_review_packs.mjs
```

For a minimal GPT handoff zip, run this from a book folder that contains
`generated/`:

```powershell
node ..\tools\textbook-pipeline\helpers\make_gpt_unit_packs.mjs
```

The GPT packs are written to `generated/review_pack/gpt_by_unit`. Each unit zip
contains only:

- `js/`
- `page_full_images/`
- `visual_asset_images/`

The review packs are written to `generated/review_pack/by_unit`. Each zip includes
JS, input templates, correction schemas, full page evidence under
`page_full_images`, optional per-question zoom crops under
`crop_images/original_question_full` and `crop_images/by_js_id`, raw question crop
folders when available, visual asset crops, reports, and a manifest.

Pipeline completion notes are written to the generated output root for the run:

```text
archive/textbook/{originalPdfFileNameWithoutPdf}/generated/CODEX_RESULT.md
```

The pipeline does not write the project-root `CODEX_RESULT.md` or
`archive/textbook/CODEX_RESULT.md` unless the config explicitly enables those
legacy locations.

For content/choices review, use `page_full_images` first. Question crops are
optional zoom/reference material for cases where the user asks to enlarge a
specific problem. Do not put page images or question crops in the archive JS
`image` field; that field is reserved for visual asset crops only.

## Content/Choices Transcription Gate

Stage `10B` runs after JS skeleton/output profiles are emitted and before final
validation. This is the pipeline position for content/choices transcription and
formula-normalization review.

The main axis is:

1. page/question crop generation
2. visual asset crop generation for image-based problems
3. content/choices transcription using `page_full_images` first
4. formula-risk separation by setKey folder

Stage `10B` writes:

- `generated/reports/content_choices_extraction_report.json`
- `generated/reports/content_choices_pending_report.json`
- `generated/reports/formula_uncertain_report.json`
- `generated/draft_content/formula_uncertain/{setKey}/formula_uncertain_items.json`
- `generated/draft_content/review/review_index.json`
- `generated/draft_content/review/review_contact_sheet.png`

`review_index.json` is mandatory after content/choices input and records each
question with:

- `id`
- `displayNo`
- `pageNo`
- `cropPath`
- `content`
- `choices`
- `hasFormula`
- `formulaRisk`
- `confidence`
- `needsReview`
- `reviewReason`

Ambiguous formula/content/choice items must stay `needsReview: true`; do not
auto-pass them.

After first-pass content/choices input, use separate review agents. Review agents
must only work on folders whose input pass is complete, prioritize
`needsReview: true` items from `review_index.json`, compare against
`review_contact_sheet.png`, fix only confirmed `content`/`choices` issues, and
run Stage `10B` again after edits. Do not let input agents and review agents edit
the same JS file at the same time.



## Answer Fill Gate

Stage `10C-answer-fill-and-verify` runs after Stage `10B` and before final
validation. `08A-quick-answer-table` and `08B-answer-solution-crop` prepare
answer evidence; Stage `10C` is the only default stage that may write the JS
`answer` field.

Stage `10C` writes:

- `generated/reports/answer_report.json`
- `generated/reports/answer_candidate_report.json`
- `generated/reports/answer_mismatch_report.json`
- `generated/reports/answer_missing_evidence_report.json`

Rules:

- The answer agent may edit only `answer`.
- It must not edit `content`, `choices`, `solution`, ids, setKey, tags,
  standard-unit fields, metadata, or question order.
- `answerCandidate` computed from content/choices is only a cross-check report
  value, not a confirmed answer.
- Confirm answers only from answer crop or the answer table.
- If answer evidence and answerCandidate conflict, record
  `answer_candidate_mismatch` and do not auto-fill.
- Keep `solution: ""` in the default workbook/textbook pipeline. Solution filling
  belongs to a separate optional stage for self-made materials or clinic-only DBs.
- The current default mode is `answerFillMode: "evidence_only_report_first"`.
  It reports answer candidates, mismatches, and missing evidence without writing
  JS answers. Actual answer writes require an explicit safer mode after evidence
  formats are verified.

Validation after Stage `10C` must confirm that `content`, `choices`, and
`solution` did not change.

## Agent Operation Policy

Use this policy for content/choices input, answer filling, and review work.

### Input Agent

The input agent fills empty or incomplete `content` and `choices` fields.
It must use `page_full_images` as the primary evidence and may use question crops
only as zoom/reference material. It may normalize clearly visible formulas to the
JS archive rulebook notation, but it must not guess unclear formulas.

Allowed:

- Fill `content` with text transcription only.
- Fill `choices` with text choices only.
- Normalize clearly visible formulas to the rulebook notation.
- Set `needsReview: true` when content, choices, or formulas are uncertain.

Forbidden:

- Put `<img>`, page crops, or question crops into `content`.
- Use page/question crop images as the archive JS `image` field.
- Guess answers, create solutions, or invent missing wording.
- Change `id`, `displayNo`, setKey, answer, solution, standard-unit fields, or tags
  unless the current task explicitly allows it.


### Answer Agent

The answer agent runs only after content/choices input is complete. It fills or
verifies the `answer` field using answer crops or the answer table.

Allowed:

- Fill `answer` from confirmed answer evidence.
- Record `answerCandidate` in reports as a cross-check only.
- Record mismatches in `answer_mismatch_report.json`.
- Leave uncertain answers blank or mark them for review.

Forbidden:

- Edit `content`, `choices`, `solution`, ids, setKey, tags, standard-unit fields,
  metadata, or question order.
- Confirm an answer by solving the problem from the statement alone.
- Create or rewrite solutions.
- Auto-fill when answer evidence and answerCandidate conflict.

### Review Agent

The review agent works only after the input pass for the folder is complete. It
is not a second input agent. Its job is to compare the entered `content` and
`choices` against the evidence and fix only confirmed errors.

Required order:

1. Open `review_index.json`.
2. Check `needsReview: true` items first.
3. Check `formulaRisk: true` items.
4. Use `review_contact_sheet.png` to compare the source image and JS text.
5. Fix only confirmed `content`/`choices` errors.
6. Keep unclear items as `needsReview: true`.
7. Run Stage `10B` again after edits.

Allowed fixes:

- Obvious typos.
- Missing words confirmed from the source image.
- Incorrect or missing choices confirmed from the source image.
- Clearly wrong formula notation when the source image is unambiguous.
- Image-only content artifacts that must be removed or moved to review status.

Forbidden:

- Invent wording not visible in the source image.
- Guess unclear formulas.
- Guess answers.
- Create or rewrite solutions.
- Change `id`, `displayNo`, or choice order.
- Mark uncertain items as PASS.
- Edit a JS file currently assigned to another input/review agent.

### Concurrency Rule

Agents must not edit the same JS file at the same time. The lock unit is:

```text
bookId / setKey / jsFile
```

If multiple agents are used, track ownership in `agent_work_status.json` or an
equivalent handoff note. A review agent may only edit a folder marked
`input_complete`. A folder currently marked `input_in_progress` is off limits to
review agents.

### Image-only Content Rule

Image-only content is a failed transcription result, not a PASS state.

Invalid examples:

- `content` contains `<img ...>`.
- `content` contains a page crop path.
- `content` contains a question crop path.
- A page/question crop is inserted into the archive JS `image` field.

Valid handling:

- If text can be read, enter text in `content` and `choices`.
- If the source cannot be read with confidence, keep `needsReview: true`.
- If image fallback is truly required, record it as a separate manual-review or
  image-fallback item; do not count it as content/choices input completion.

Stage `10B` and the final validation must fail or flag any image-only content in
`content`/`choices` as a review item.


All formulas must be normalized to the JS archive rulebook notation before final
PASS. This is not limited to suspicious formulas; every formula in `content` and
`choices` must follow the rulebook.

Rulebook math targets include:

- `$...$` for formulas
- close `$...$` before each `\n` and reopen it on the next formula line
- `${}_{n}C_{r}` for combinations
- `${}_{n}P_{r}` for permutations
- `\dfrac` for top-level fractions
- `\frac` for fractions inside exponents/subscripts
- escaped LaTeX backslashes in JS strings
- `\lt`, `\gt` for inequalities inside choices
- no Korean inside `\text{}`

This scaffold follows `docs/textbook-pipeline/AP_MATH_TEXTBOOK_ONECLICK_PIPELINE_APP.md`.
It reuses existing crops/reports when present, emits internal metadata separately from
archive-compatible JS, and keeps uncertain content in manual-review reports.

## JS Archive Normalization Gate

The pipeline does not stop at reading the rulebook. Stage 9 and Stage 10 normalize
archive-compatible JS against the rulebook, the standard-unit master table, and
existing archive schema expectations.

Required normalization targets:

- `id`
- `level`
- `category`
- `originalCategory`
- `standardCourse`
- `standardUnitKey`
- `standardUnit`
- `standardUnitOrder`
- `questionType`
- `layoutTag`
- `tags`
- `wide`
- `content`
- `choices`
- `image`
- `answer`
- `solution`

Validation rules:

- `tags` must not be empty.
- `tags` must include publisher, textbook, grade, unit, and section where known.
- `standardUnitKey` must map to the master table. Unresolved items go to
  `unresolved_standard_unit_report.json`; do not silently leave broad UNMAPPED values.
- `archiveCompatible` JS must not include internal metadata fields.
- `choices` must remain an array; no choices means `[]`.
- `image` must point only to visual asset crops, not page images or question full crops.
- `node --check` must pass.

Reports:

- `generated/reports/js_format_normalization_report.json`
- `generated/reports/tag_normalization_report.json`
- `generated/reports/standard_unit_mapping_report.json`
- `generated/reports/standard_unit_mapping_validation.json`
- `generated/reports/unresolved_standard_unit_report.json`
- `generated/reports/js_archive_schema_violation_report.json`

## Stage 6B Crop Quality Review

After question full crops are available, Stage 6B runs a non-blocking crop quality
review. It reads `question_crop_map.json` or RPM-style `rpm_question_crop_map.json`,
checks crop file validity and basic size anomalies, writes quality reports, and
creates contact sheets for quick human review.

Run only this stage:

```powershell
node tools/textbook-pipeline/run-oneclick-pipeline.mjs --config pipeline.rpm-m2-1.config.json --stage 06B
```

Generated reports include:

- `generated/reports/question_crop_quality_report.json`
- `generated/reports/question_crop_quality_summary.json`
- `generated/reports/question_crop_quality_validation.json`
- `generated/reports/question_crop_manual_review_required.json`
- `generated/reports/question_crop_page_fallback_report.json`
- `generated/reports/question_crop_quality_contact_sheet_index.json`

## Textbook DB Pipeline v1 Confirmed Flow

The current `archive/textbook` one-click structure remains the base. This round
adds read-only broken-string scan stages after `10B` and `10C`; it does not add a
new `07` crop stage and does not add direct Gemini statement transcription.
Gemini API use is limited to Stage `12B` formula/answer patch generation from
Stage `12` targets, and Gemini never modifies generated textbook JS directly.

Final PDF-to-JS flow:

0. PDF input check: problem PDF, answer PDF or answer table, optional solution PDF, `bookId`, page range, section, and `setKey`.
1. PDF to full page images: problem PDF pages become `page_full_images`; answer/solution PDFs are rendered only for the needed ranges.
2. Page range and section mapping: organize unit/section mapping by `setKey`, `pageNo`, and `displayNo`.
2B. Question ID mapping guard: `04B-question-id-mapping-guard` accepts only confirmed printed `sourceDisplayNo` values into `fresh_js_input_manifest` and sends bbox-slot-only crops to map review.
3. Fresh pack JS creation: create JS archive skeletons from `fresh_js_input_manifest`, with `globalId` as the internal id source and `setKey + sourceDisplayNo` as printed-question identity; `content`, `choices`, `answer`, and `solution` stay empty or placeholder.
4. Page crop: create page-level working crops.
5. Question full crop: create full question crops for review and zoom reference only. These are not JS `image` values.
6. Crop quality review: check missing, cut-off, duplicate, or mismatched question crops.
6C. Page mapping audit: `06C-question-page-mapping-audit` checks all JS questions against crop/page/section mapping metadata and full page image availability. It writes reports only.
6D. Page mapping repair candidate: `06D-question-page-mapping-repair` creates repair candidates when there is exactly one safe same-`setKey` page candidate. Map repair is opt-in; default runs never edit map files.
7. Existing visual asset crop: reuse `07-visual-asset-crop` for diagrams, graphs, tables, coordinate planes, and figures only. Archive-compatible JS `image` may contain only visual asset crops. Page crops and question full crops are forbidden in `image`, and `content` must not contain image paths or `<img>` tags.
7A. Visual asset link audit: `07A-visual-asset-link-audit` checks whether required visual assets are linked in JS and whether JS `image` accidentally points to page/question crops. It does not create crops or edit JS.
8A / 8B. Answer evidence preparation: `08A-quick-answer-table` and `08B-answer-solution-crop` prepare answer evidence. They do not apply JS `answer`; solution crops do not mean v1 fills `solution`.
9. Rulebook gate / input readiness check: confirm rulebook, master table, fresh JS, full page images, and crop maps are ready.
9A. Operating JS scope / jsFile lock: count and edit only `archive/textbook/{book}/generated/js/**/*.js`; acquire a single-jsFile work lock before input.
10B. `FULL_PAGE_STATEMENT_BUILD`: `10B-transcribe-content-choices` fills or reports `content` and `choices` only for mapping-confirmed questions. It must not edit `answer` or `solution`.
10B-SCAN. `BROKEN_FORMULA_STRING_SCAN`: `10B-SCAN` runs immediately after `10B`, reads only `content` and `choices`, applies the content success gate, writes `broken_formula_string_scan__{bookId}__{yyyymmdd}.json`, and never modifies JS.
10B-FAIL. `EMPTY_CONTENT_CAUSE_CLASSIFY`: classify remaining empty or failed `content` by shared causes and write retry/repair suggestions. It does not edit JS.
10C. `ANSWER_FILL_AND_VERIFY`: `10C-answer-fill-and-verify` fills or verifies only `answer` from `answer_source_map` / answer evidence. `answerCandidate` is report-only cross-check data.
10C-FAIL. `MISSING_ANSWER_CAUSE_CLASSIFY`: classify remaining missing `answer` by shared causes and write retry/repair suggestions. It does not edit JS.
10C-SCAN. `ANSWER_STRING_RISK_SCAN`: `10C-SCAN` runs immediately after `10C`, reads only `answer`, checks broken answer strings and answer structure risks, writes `answer_string_risk_scan__{bookId}__{yyyymmdd}.json`, and never modifies JS.
11. `STRUCTURE_RULEBOOK_GUARD`: validate JS syntax, questionBank parse, required fields, empty `content`, choice count, missing `answer`, duplicate ids/source numbers, image paths, image-only content, and formula rulebook risks.
12. `FORMULA_REPAIR_TARGET_EXTRACT`: reads `broken_formula_string_scan__*.json`, `answer_string_risk_scan__*.json`, `formula_uncertain_report*.json`, `rulebook_risk_report*.json`, `answer_mismatch_report*.json`, `content_choices_report*.json`, `review_index*.json`, `manual_review_report*.json`, and `structure_guard_report*.json`. It auto-filters targets for Gemini first-pass patch build, does not edit JS, and does not create `replacementText`.
12B. `GEMINI_FORMULA_PATCH_BUILD`: receives Stage `12` targets and uses source images plus `currentText` to create first-pass `targetText` to `replacementText` correction patches. Gemini does not modify JS directly. If `GEMINI_API_KEY` is missing, it writes a skipped report and passes.
12D. `APPLY_GEMINI_FORMULA_PATCH`: Codex reads the Stage `12B` patch file and applies only items that pass safety checks to actual `js/*.js`. Failed or uncertain items are written to `formula_patch_manual_review__{bookId}__{yyyymmdd}.json`. `makeGeminiFormulaPatchAutoApply` must be `true`; undefined or false skips even when `--stage 12D` is used directly.
12C. Review/input pack creation: create review packs after the first-pass apply so GPT/human review focuses on automatic-apply failures, manual review items, and remaining high-risk entries.
13. `FINAL_FIX_APPLY_AND_REVIEW`: GPT/human review checks only automatic-apply failures, unresolved manual review items, and high-risk review-pack items. Do not create `solution`.
14. Final validate: run `node --check`, parse `questionBank`, check final `content`/`choices`/`answer` gaps, image paths, choices/answer mismatches, and confirm `solution` was not generated.

Reference documents:

- `docs/textbook-pipeline/JS_ARCHIVE_FORMULA_RULEBOOK.md`
- `docs/textbook-pipeline/FORMULA_CORRECTION_PATCH_SCHEMA.md`

Stage naming notes:

- `07`: existing visual asset crop stage only; no new visual crop stage is created.
- `10B`: full-page-based `content`/`choices` input.
- `10B-SCAN`: read-only broken string scan for `content`/`choices`.
- `10C`: answer input/verification only.
- `10C-SCAN`: read-only broken answer string and answer structure scan.
- `12`: target extraction from all scan/review/risk reports.
- `12B`: Gemini first-pass correction patch build. Gemini creates patch JSON but never edits JS directly.
- `12D`: opt-in Codex apply stage for safe Gemini patches. It is part of the first-pass automatic correction design, but defaults off unless `makeGeminiFormulaPatchAutoApply === true`.
- `12C`: review/input pack creation after 12D.

12D automatic apply conditions:

- `makeGeminiFormulaPatchAutoApply === true`
- patch `needsReview === false`
- `confidence === "high"`
- `field` is `content`, `choices[index]`, or `answer`
- `targetText` appears exactly once in that field
- `replacementText` follows `JS_ARCHIVE_FORMULA_RULEBOOK.md`
- Korean text, choice order, ids, `displayNo`, `setKey`, `sourceQuestionNo`, and question order are unchanged
- answer patches have answer crop or answer-table evidence
- `solution` is never patched
- `node --check` and questionBank parse pass after apply

12D rejects to manual review when the opt-in flag is not true, `targetText` is missing or duplicated, confidence is not high, `needsReview=true`, Gemini rewrote a full sentence, source evidence is missing or unclear, formula scope is ambiguous, content/choices repair appears inferred from `answer` or `solution`, answer evidence is missing for an answer patch, or Korean wording/choice order changes.

Role split:

- Gemini creates first-pass correction patches from source images and `currentText`; it does not edit JS.
- Codex verifies exact-once safety, applies safe patches to JS, leaves failures as manual review, and runs syntax/parse checks.
- GPT/human reviewers inspect only failed automatic patches, manual review items, and final high-risk review-pack entries.

Default workbook/textbook pipeline v1 excludes `solution` filling. `solution`
remains blank unless a separate approved solution DB stage is defined.
