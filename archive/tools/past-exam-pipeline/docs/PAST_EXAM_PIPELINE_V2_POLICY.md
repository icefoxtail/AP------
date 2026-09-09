# Past Exam Pipeline V2 Policy

## Goal

The past-exam extraction pipeline is now an extraction-only pipeline.

It creates:

- full page PNG evidence
- page-level Vision extraction request/schema
- candidate JS with content/choices/visual asset metadata when Vision JSON is supplied
- visual asset crops only for graph/figure/table/diagram/image regions
- review reports for uncertain extraction items
- GPT/Gemini handoff manifest for answer/solution work

It does not create or decide:

- answer
- solution
- answer table mapping
- direct solving
- question-wide image fallback


## Source-of-truth order

Full page evidence is the source of truth for extraction and review.

1. Use `fullPageImagePath` or `sourcePageEvidencePaths` to locate the actual display number and question region on the page.
2. Extract and verify `content` and `choices` from the full page original.
3. Use `cropPath`, debug question crops, or visual asset crops only as auxiliary zoom evidence. Crop failure must not decide content/choice PASS or FAIL.
4. Compare candidate JS `content`/`choices` against the full-page original. Fix only mismatches confirmed from full-page evidence.
5. Generate crops only when needed for visual assets, zoom support, or later cost optimization. The extraction baseline remains full page.

In short: full-page content review first, crop assistance second.

## Frozen source identity and evidence

Before Vision extraction, the run must accept an independently verified
inventory (`INDEPENDENT_INVENTORY_VERIFIED`) and freeze
`reports/source_inventory.json` with the source-document SHA, page count,
expected question count, source question number, source page number, and one
disposition for every source question. `reports/source_identity_map.json`
materializes the same identity set. Vision may provide content, choices,
question type, visual requirement, and bbox for those frozen slots; it may not
create or renumber source identities. Archive `id`, candidate order, and asset
filename are separate fields.

The common pipeline run preserves rich Past Exam identity fields through
`prepare → run.questions → closure → promotion`. The
`sourceDocumentSha256|sourceQuestionNo` key must never be reduced to
`sourcePath|qid`.

The candidate identity set must equal the non-excluded frozen inventory set.
Inventory coverage is 100% or the run stops with
`SOURCE_INVENTORY_COVERAGE_FAIL`. Every content/choices item then needs a
source-fidelity evidence row containing the source question/page, source
evidence path and SHA, `contentChecked`, `choicesChecked`, and a `PASS`
verdict. A summary, placeholder, or `vision_required` value is never source
fidelity evidence.

The extraction and release statuses are intentionally separate:

```text
EXTRACTION_VALIDATED
  != SOURCE_FIDELITY_PASS
  != MATH_REVIEW_PASS
  != ASSET_REVIEW_PASS
  != PRE_PROMOTION_VALIDATED
  != PRODUCTION_RELEASE_PASS
```

The Python validator owns extraction validation only. The JS hardening validator
is the single authority for `PRE_PROMOTION_VALIDATED`; Python never declares
that release-adjacent state from a top-level evidence status alone.

## Hard rules

1. Full page PNG images are always generated.
2. Page-level Vision JSON is the source for `content`, `choices`, `hasVisualAsset`, and `visualAssetBBoxOnPage`.
3. Question-wide crops are disabled by default.
4. Candidate `image` must be blank or point only to a visual asset crop.
5. Candidate `image` must never point to `pages/`, `crops/questions/`, `crops/debug_questions/`, `page_p*.png`, or `cropPath`.
6. Visual asset bbox must surround only the graph/figure/table/diagram/image inside a question.
7. Visual asset crop failure never falls back to a question-wide crop.
8. `answer` and `solution` stay blank with `external_agent_required` status.
9. Blank `answer` and blank `solution` are not validation failures in this pipeline.
10. Uncertain text, choices, formula, or visual bbox goes to manual review instead of being guessed.
11. `contentSource == "vision_required"` or `choicesSource == "vision_required"` is never PASS and must not be filled with dummy text by a downstream agent.
12. A final candidate must carry non-empty `subUnitKey`, `subUnit`, `subUnitConfidence`, and `subUnitClassificationDepth`; the promotion gate also checks the canonical/compiled master relationship.
13. `PNG_DECODE_PASS` is a byte-level check only; it is not crop purity,
    semantic, provenance, or render PASS. `DIRECT` assets must bind to the
    same source question. A shared visual is accepted only through an explicit
    `SHARED_MATERIAL` binding with a UID and dependency question set. The
    independent asset evidence file is semantic authority; candidate
    provenance is parity-only, and shared material may use a different source
    page from a dependent question.
14. Production paths are writable only after a common closure with the exact
    source identity set and a production promotion receipt. Direct writes are
    `UNAUTHORIZED_PRODUCTION_WRITE`.
15. `BUILT`, `ZIP_CREATED`, and `EXTRACTION_VALIDATED` are not release states.
    `DONE` requires real production `exam`/`sol`/`ans` browser PASS evidence.
    When a ZIP/package deliverable exists, exact-byte ZIP and fresh-extraction
    checks plus separate extracted-package browser PASS evidence are required;
    production-only flows must explicitly record package `NOT_APPLICABLE`.
    In that case `PROMOTED → REAL_RENDER_PASS → DONE` is valid without a
    `PORTABLE_PACKAGE_PASS` transition.

## Normal flow

```text
PDF
→ pages/page_p001.png, page_p002.png, ...
→ reports/vision_page_extract_request.json
→ external page-level Vision call
→ rerun or provide manifest.visionPageExtractJsonPath
→ candidate/*.candidate.js
→ assets/q###_visual.png only when visualAssetBBoxOnPage is valid
→ reports/extraction_manual_review.csv
→ reports/answer_solution_required.csv
→ reports/gpt_gemini_handoff_manifest.json
```

## Debug-only question crops

Question crops can be generated only with:

```text
createQuestionCrops: true
```

or helper flag:

```text
--create-question-crops
```

Those files are written under `crops/debug_questions/` and must not be linked to candidate `image`.

## External answer/solution handoff

The next GPT/Gemini agent receives:

- candidate JS
- `pages/`
- `assets/`
- `reports/answer_solution_required.csv`
- `reports/extraction_manual_review.csv`
- `reports/gpt_gemini_handoff_manifest.json`
- relevant rulebook files

The next agent may fill only:

- `answer`
- `solution`
- `answerStatus`
- `solutionStatus`

The next agent must also preserve or complete the four required subunit
metadata fields before a candidate can receive `reviewed_pass`. Those fields
are metadata, not a license to rewrite `content`, `choices`, `answer`,
`solution`, or source images without the relevant evidence.

If it finds a content/choice/image extraction error, it must verify the mismatch against full-page evidence and write an extraction correction report instead of silently changing extraction fields. It must not use a crop failure as the basis for rewriting content or choices.

Before handoff, the protected payload SHA is frozen for each source identity.
After handoff it must match exactly. Any protected-field mutation fails with
`ANSWER_SOLUTION_SCOPE_VIOLATION` and returns to the
`SOURCE_FIDELITY_RESTORATION` lane. A reviewed-pass envelope must bind the
candidate SHA, source inventory/map/fidelity SHA, independent math evidence
SHA, and asset-provenance evidence SHA.

Independent math evidence is source-only and blind to the prior answer and
solution. It must record the solve, answer comparison, choice uniqueness, and
question validity. A string named `reviewed_pass` without these bindings has
no promotion authority.

Visual asset provenance is a separate gate from PNG decoding. The provenance
must bind asset SHA to source document/question/page and bbox, and semantic
review must pass crop purity, no other-question text, no choices
contamination, no page-border contamination, no clipping, required labels,
and question semantic match.

## Source Defect Recovery handoff

After the full-page source check and an independent answer/solution solve, a
confirmed source conflict is routed separately from extraction repair:

```text
extraction mismatch -> SOURCE_FIDELITY_RESTORATION
answer-only mismatch -> R0 ANSWER_KEY_RECOVERY
payload defect -> DERIVED_SOURCE_RECOVERY
```

For the bounded R0/R1 lane, the recovery request may be sent to the ALIVE
runtime without hand-authoring `defectTypes` or `candidatesByTier`:

```powershell
python -m alive.engine.alive_cli source-recovery-run \
  --input <locked-source-plus-independent-solve.json> --json
```

The input must include full-page/zoom/choice evidence, a source independent
solve, and a separate `blindVerifierSolve` produced by a different verifier
identity/session. The bridge creates the diagnosis, bounded candidate, frozen
candidate identity, blind verifier envelope, and shadow/blocked result. It
must not copy the source independent solve into verifier evidence. The
original extraction candidate and source evidence remain unchanged. R2-R6 are
not enabled until their producer and validator capabilities are registered.
