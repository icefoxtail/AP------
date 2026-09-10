# APMath archive layout and staged contracts

Read this reference before importing, validating, or auditing exams. Current
policy routing lives in `references/rules-routing.md` and the repository's
`docs/rules/00_RULES_INDEX.md`.

## V3 contract and staged artifacts

For every new original Past Exam, `docs/rules/02_PIPELINES/Past_Exam_V3_COMPLETE.md`
is the top-level execution contract and
`archive/tools/pipeline-core/AGENT_BUDGET.md` controls the JOB topology. The
canonical lifecycle remains independently visible:

```text
RULE_PREFLIGHT -> CANONICAL_PRODUCTION_SAMPLE_CALIBRATION
-> PRODUCTION_QUALITY_PROFILE_FREEZE -> TARGET_BASELINE_REVIEW
-> SOURCE_INVENTORY_FREEZE -> FULL_PAGE_EXACT_EXTRACTION
-> SOURCE_FIDELITY_FREEZE -> BUILDER_INDEPENDENT_SOLVE
-> SOLUTION_AND_CLASSIFICATION_BUILD -> ALL_QUESTION_VISUAL_TRIAGE
-> EXPECTED_FACT_FREEZE -> NUMERIC_VISUAL_BUILD
-> STATIC_AND_RENDER_CAPTURE -> FINAL_AUDIT_SEALED_U1_U2_U3
-> TARGETED_REPAIR -> TARGETED_RECHECK_MAX_ONCE -> PROMOTION -> FINAL_CLOSURE
```

The V2 full-page-first extractor under
`archive/tools/past-exam-pipeline/` is only the implementation used beneath
the V3 S1~S3 source stages. Its candidate, page reports, `vision_required`,
`external_agent_required`, `NEXT_ACTIONS.md`, and
`gpt_gemini_handoff_manifest.json` are intermediate evidence/diagnostics. They
are not a V3 completion state and do not authorize a production write.

The normal batch contract still permits many `runIds` in one JOB. If the user
requests independent GOLD, pilot, holdout, or comparison execution, the
artifact boundary changes to:

```text
ONE EXAM = ONE INDEPENDENT JOB
```

Each exam then has unique `workBatchId`, `builderId`, `builderSessionId`, and
`runId`, independent staging, evidence, freezes, and defect ledger. Such JOBs
share only `START_SHA` and the canonical rule pack. They never share source
identity, calibration, candidates, solutions, expected/observed visual facts,
intermediate artifacts, worker context, or defects. A single worker may not
complete both independent exams. The pipeline-core “No independent production
agent exists” rule remains intact inside each JOB.

## Canonical paths

- Production exam JS: `archive/exams/original/<level>/<grade>/<term>/<exam-title>.js`
- Canonical problem assets: `archive/assets/images/<exam-title>/qNN.png`
- Legacy generated candidate: `archive/_generated/past-exams/<batch>/<exam-title>/candidate/<exam-title>.js`
- V2 generated candidate: `archive/_generated/past-exams/<batch>/<exam-title>/candidate/<exam-title>.candidate.js`
- Rendered source pages: `archive/_generated/past-exams/<batch>/<exam-title>/pages/page_pNNN.png`
- Candidate reports and V3 evidence: `archive/_generated/past-exams/<batch>/<exam-title>/reports/`
- Archive catalog: `archive/db.js` as `window.mainDB.exams`
- Search index: `archive/question-index.js` as `window.questionIndex`
- Index builder: `archive/tools/build-question-index.mjs`
- Renderer: `archive/engine.html`

Use paths observed in the current repository if a batch uses a different
generated-root name. Prefer a manifest's `examId`, `candidateFile`, and
`archiveRelativePath` over title-based guesses. Keep source-page evidence and
all V3 freezes in staging until canonical promotion is authorized.

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

Extraction candidates are intentionally different. In the V2 S1~S3
intermediate artifact they may keep `answer` and `solution` blank while a
pending status records that the builder has not completed them. That status is
not a V3 terminal state and must not be cleared with filler text. A
`contentSource` or `choicesSource` of `vision_required` is manual-review
evidence, not permission to invent content or choices.

Choice questions preserve original option order. New `choices` values do not
contain `①`–`⑤` or other option numbers; the engine owns labels. Escape raw
HTML comparison signs in strings rendered as markup (`&lt;` where needed) and
preserve LaTeX backslashes as valid JavaScript escapes.

## Full-page-first source evidence and continuation

For V2 extraction inside V3 S1~S3, `fullPageImagePath` or
`sourcePageEvidencePaths` is the source of truth for display number, `content`,
and `choices`. `cropPath`, debug question crops, and visual-asset crops are
auxiliary evidence only.

If the extractor reports `vision_page_extract_json_missing`, `vision_required`,
or `external_agent_required`, a source-readable exam worker must directly read
the rendered full-page source image/PDF, write fresh page-level extraction
evidence in the required schema, bind it to source identity/inventory, feed it
back into the extractor as needed, and continue to source-fidelity freeze and
the builder stages. Do not guess blank fields, copy a prior candidate, or
interpret absent external Vision JSON as automatic HOLD. HOLD is allowed only
for a real capability/physical blocker, such as inability to inspect source
pixels or unreadable/corrupt source.

Freeze independent `reports/source_inventory.json` and
`reports/source_identity_map.json` before accepting page-level content. The
inventory binds source-document SHA, source question number, source page,
evidence path, and disposition. Vision is not q-number authority. Candidate
`id`, array order, and `qNN` asset names never replace frozen source identity.
Every non-excluded inventory item needs exactly one disposition; an unexplained
source/candidate count gap is `SOURCE_INVENTORY_COVERAGE_FAIL`.

The production `image` field is blank unless the question needs a visual asset,
and when present it points only to a visual crop. It must never point to a
full-page image, `pages/`, `crops/questions/`, `crops/debug_questions/`,
`page_pNNN.png`, or a question-wide crop. A failed visual crop never falls
back to a question-wide crop.

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

For every new or modified solution visual, keep the evidence order:

```text
V1 benefit triage -> EXPECTED FACT freeze -> deterministic numeric artifact
  -> V2 artifact-only observed geometry -> expected/observed V3 parity
  -> actual render review
```

V1/V3 `visualBenefit` is required for every question. File existence,
`naturalWidth`, or label presence alone is not semantic PASS. The canonical
generator remains Python-based under the active project contract. Do not make
an unadopted TikZ/TeX pilot a new canonical authority. Apply the current visual
protocol's math, semantic, style, print-publication, and render gates.

`content` is a source transcription, not an editorial summary. Preserve
printed wording, question/essay labels, conditions, parenthetical qualifiers,
proof text, domains, and score. A mathematically equivalent rewrite does not
pass source-fidelity review.

## DB fields, serialization, and curriculum

For a new production import verify all of these fields:

```text
file, school, grade, year, semester, examType, subject, contentType, qCount
```

For 2022-curriculum high-school common mathematics imports, validate the
actual exam cohort against the repository's canonical H15/H22 system and
compiled master table. A malformed or noncanonical high-school key does not
pass merely because it is non-empty. DB `file` must match the production path
relative to `archive/`, and `qCount` must equal production
`questionBank.length`.

Evaluated student-facing strings must pass current pipeline-core serialization
integrity machine checks as STATIC required evidence. Do not infer this gate
from a successful JS load or duplicate validator internals here.

## Render URLs and evidence

Use the three renderer modes at both required viewports:

```text
archive/engine.html?mode=exam&qpp=4&data=<encoded production path>
archive/engine.html?mode=sol&qpp=4&data=<encoded production path>
archive/engine.html?mode=ans&qpp=4&data=<encoded production path>
```

The `data` value is relative to `archive/`, for example
`exams/original/high/h1/1final/<exam>.js`. The final V3 matrix is six cases:

```text
exam/desktop, exam/mobile,
solution/desktop, solution/mobile,
answer/desktop, answer/mobile
```

Record `MACHINE_CURRENT` static/metadata evidence and
`MACHINE_COLLECTOR` captures separately from independent `RENDER_REVIEW`.
Capture the last question and every continuation block. Record each case as
`PASS`, `WARN`, `FAIL`, or `NOT_TESTED`; `NOT_TESTED` is incomplete evidence,
never final PASS. A machine capture alone cannot become semantic render PASS.

## Diagnostic continuation and final closure

Machine/static/metadata candidate-quality defects remain explicit FAIL/HOLD
evidence. If semantic FINAL_AUDIT is technically executable, those defects do
not by themselves stop the audit from being observed or completed with
defects:

```text
DIAGNOSTIC_CONTINUATION != CANONICAL_PASS
```

Promotion and FINAL_CLOSURE remain fail-closed. All source identity, typed
solution quality, serialization, curriculum, visual parity/provenance, render,
DB/index, and package obligations must pass before release. After any
correction, re-check all six render cases, not only the mode that appeared to
change.
