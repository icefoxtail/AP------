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
