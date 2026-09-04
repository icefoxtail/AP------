# APMath archive layout and staged contracts

Read this reference before importing, validating, or auditing exams. Current
policy routing lives in `references/rules-routing.md` and the repository's
`docs/rules/00_RULES_INDEX.md`.

## Canonical paths

- Production exam JS: `archive/exams/original/<level>/<grade>/<term>/<exam-title>.js`
- Canonical problem assets: `archive/assets/images/<exam-title>/qNN.png`
- Legacy generated candidate: `archive/_generated/past-exams/<batch>/<exam-title>/candidate/<exam-title>.js`
- V2 generated candidate: `archive/_generated/past-exams/<batch>/<exam-title>/candidate/<exam-title>.candidate.js`
- Rendered source pages: `archive/_generated/past-exams/<batch>/<exam-title>/pages/page_pNNN.png`
- Candidate reports: `archive/_generated/past-exams/<batch>/<exam-title>/reports/`
- Archive catalog: `archive/db.js` as `window.mainDB.exams`
- Search index: `archive/question-index.js` as `window.questionIndex`
- Index builder: `archive/tools/build-question-index.mjs`
- Renderer: `archive/engine.html`

Use paths observed in the current repository if a batch uses a different
generated-root name. Prefer a manifest's `examId`, `candidateFile`, and
`archiveRelativePath` over title-based guesses.

## Staged JS contract

Every JS file must assign both `window.examTitle` and `window.questionBank`.
Production questions must have:

- unique sequential integer `id` values;
- non-empty `content`, explicit `answer`, and non-empty `solution`;
- the base archive metadata: `level`, `category`, `originalCategory`,
  `standardCourse`, `standardUnitKey`, `standardUnit`, `standardUnitOrder`,
  `questionType`, `layoutTag`, `tags`, and `wide`;
- for new candidates and production, non-empty `subUnitKey`, `subUnit`,
  `subUnitConfidence`, and `subUnitClassificationDepth`.

Extraction candidates are intentionally different. They may keep `answer` and
`solution` blank only with `answerStatus`/`solutionStatus` set to
`external_agent_required`, `not_in_pipeline`, or another approved pending
status. `contentSource` or `choicesSource` equal to `vision_required` is still
manual review and must never be cleared with filler text.

Choice questions preserve the original option order. New `choices` values do
not contain `①`–`⑤` or other option numbers; the engine owns the labels.
Escape raw HTML comparison signs in strings rendered as markup (`&lt;` where
needed) and preserve LaTeX backslashes as valid JavaScript escapes.

## Full-page-first source evidence

For the V2 extraction pipeline, `fullPageImagePath` or
`sourcePageEvidencePaths` is the source of truth for display number,
`content`, and `choices`. `cropPath`, debug question crops, and visual-asset
crops are auxiliary evidence only.

The production `image` field is blank unless the question needs a visual asset,
and when present it points only to a visual crop. It must never point to a
full-page image, `pages/`, `crops/questions/`, `crops/debug_questions/`,
`page_pNNN.png`, or a question-wide crop. A failed visual crop never falls back
to a question-wide crop.

## Image size and layout

Do not confuse image display size (`imageSize`) with question layout
(`layoutTag`). Image sizes are `small`, `half`, `medium`, `large`, `full`, and
`tall`.

- Keep the default/automatic size unless the actual `engine.html` exam render
  at `qpp=4` shows that the visual is too small to read.
- Use `tall` for visuals that need more vertical space and `full` when the
  image needs the available question-column width.
- `layoutTag` defaults to `grid`.
- `subjective-2up` is an approval-required candidate.
- `fullwidth` is an exceptional approval-required layout. `full` as an
  `imageSize` value is not the same as `fullwidth` as a layout value.

## Solution-only instructional visuals

When a graph or diagram materially helps students follow the solution, keep it
separate from the source problem image:

```js
solutionImage: "assets/images/<exam-title>/q05-solution.svg",
solutionImageAlt: "이차함수의 꼭짓점과 교점을 표시한 해설 그래프",
solutionImageCaption: "꼭짓점과 두 교점의 위치 관계",
solutionImageSize: "medium"
```

`solutionImage` is rendered only in solution mode. `solutionImageSize` may be
`small`, `medium`, `large`, or `full`; it defaults to `medium`. Prefer SVG for
clean coordinate graphs and PNG for annotated source crops. Do not overwrite
or reuse the original `image` when annotations belong only to the explanation.
Solution-inline SVG is also allowed when the current solution protocol permits
it; it must obey the same mathematical and print checks.

`content` is a source transcription, not an editorial summary. Preserve the
printed wording, question/essay labels, conditions, parenthetical qualifiers,
proof text, domains, and score. A mathematically equivalent rewrite does not
pass source-fidelity review.

## Visual-material rule

Retain a visual asset when the question cannot be answered faithfully from text
alone or when the source explicitly depends on a graph, layout, photograph,
table, or labeled diagram. Keep generous safety margins so printed geometry
and labels are never clipped. If the user explicitly owns manual cleanup,
retain source contamination and mark the asset `cropped_for_manual_cleanup`;
this is an intermediate handoff state. Otherwise exclude question text,
choices, handwriting, check marks, written answers, and unrelated page content.

`visualAssetStatus: "full_page_reference"` is an intermediate marker, never a
completion state. Replace it with a real image/SVG/table or document why a
faithful textual reconstruction makes the source graphic unnecessary.

For new or modified graph/geometry assets, apply the current visual protocol's
math, semantic, style, print-publication, and render gates. File existence and
positive `naturalWidth` are necessary but not sufficient.

## DB fields

For a new production import verify all of these fields:

```text
file, school, grade, year, semester, examType, subject, contentType, qCount
```

For 2022-curriculum high-school common mathematics imports, use the
repository's established `공통수학1` subject/course convention. DB `file` must
match the production path relative to `archive/`, and `qCount` must equal the
production `questionBank.length`.

## Render URLs and evidence

Use:

```text
archive/engine.html?mode=exam&qpp=4&data=<encoded production path>
archive/engine.html?mode=sol&qpp=4&data=<encoded production path>
archive/engine.html?mode=ans&qpp=4&data=<encoded production path>
```

The `data` value is relative to `archive/`, for example
`exams/original/high/h1/1final/<exam>.js`. Record the three mode states as
`PASS`, `WARN`, `FAIL`, or `NOT_TESTED` in
`reports/browser_render_check.md` or an equivalent durable evidence artifact.
