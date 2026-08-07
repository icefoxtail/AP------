# APMath archive layout

Read this reference before importing or auditing exams.

## Canonical paths

- Production exam JS: `archive/exams/original/<level>/<grade>/<term>/<exam-title>.js`
- Canonical image assets: `archive/assets/images/<exam-title>/qNN.png`
- Generated candidate: `archive/_generated/past-exams/<batch>/<exam-title>/candidate/<exam-title>.js`
- Rendered source pages: `archive/_generated/past-exams/<batch>/<exam-title>/pages/page_pNNN.png`
- Archive catalog: `archive/db.js` as `window.mainDB.exams`
- Search index: `archive/question-index.js` as `window.questionIndex`
- Index builder: `archive/tools/build-question-index.mjs`
- Renderer: `archive/engine.html`

Use paths observed in the current repository if a batch uses a different generated-root name.

## Exam JS contract

The file must assign both `window.examTitle` and `window.questionBank`. Questions must have:

- unique integer `id`
- non-empty `content`
- explicit `answer`
- non-empty `solution`
- archive-compatible metadata such as level, standard course/unit, question type, tags, and layout

Choice questions must preserve the original option order. Use archive-relative image paths such as:

```js
image: "assets/images/26_학교_1학기_기말_고1_기출/q05.png"
```

Escape raw HTML comparison signs in strings rendered as markup (`&lt;` where needed). Preserve LaTeX backslashes as valid JavaScript escapes.

### Solution-only instructional images

When a graph or diagram materially helps students follow the solution, keep it separate from the source problem image and use:

```js
solutionImage: "assets/images/<exam-title>/q05-solution.svg",
solutionImageAlt: "이차함수의 꼭짓점과 교점을 표시한 해설 그래프",
solutionImageCaption: "꼭짓점과 두 교점의 위치 관계",
solutionImageSize: "medium"
```

`solutionImage` is rendered only in solution mode. `solutionImageSize` may be `small`, `medium`, `large`, or `full`; it defaults to `medium`. Prefer SVG for clean coordinate graphs and PNG for annotated source crops. Do not overwrite or reuse the original `image` when the annotations belong only to the explanation.

`content` is a source transcription, not an editorial summary. Preserve the printed wording, question/essay labels, conditions, parenthetical qualifiers, proof text, domains, and score. A mathematically equivalent rewrite does not pass source-fidelity review.

## Visual-material rule

Retain a visual asset when the question cannot be answered faithfully from text alone or when the source explicitly depends on a graph, layout, photograph, table, or labeled diagram. Keep generous safety margins so printed geometry and labels are never clipped. If the user explicitly owns manual cleanup, retain source contamination and mark the asset `cropped_for_manual_cleanup`; this is an intermediate handoff state. Otherwise exclude question text, choices, handwriting, check marks, written answers, and unrelated page content.

`visualAssetStatus: "full_page_reference"` is an intermediate marker, never a completion state. Replace it with a real image/SVG/table or document why a faithful textual reconstruction makes the source graphic unnecessary.

Add a `solutionImage` when the written solution depends on a spatial relation that is difficult to reconstruct from prose alone—for example graph transformations, intersections, tangency, signed areas, auxiliary lines, or highlighted intervals. Keep the asset instructional rather than decorative: label only the points, regions, and steps referenced by the solution, and verify that every label remains legible in the printed solution layout.

## DB fields

At minimum verify `file`, `school`, `grade`, `year`, `semester`, `examType`, `subject`, `contentType`, and `qCount`. For the 2022 curriculum high-school common mathematics imports, use the repository's established `공통수학1` subject/course convention.

## Render URLs

Use:

```text
archive/engine.html?mode=exam&qpp=4&data=<encoded production path>
archive/engine.html?mode=sol&qpp=4&data=<encoded production path>
archive/engine.html?mode=ans&qpp=4&data=<encoded production path>
```

The `data` value is relative to `archive/`, for example `exams/original/high/h1/1final/<exam>.js`.
