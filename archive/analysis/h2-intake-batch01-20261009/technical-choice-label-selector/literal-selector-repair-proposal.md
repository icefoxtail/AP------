# Literal selector glyph-only choices: generic bounded repair proposal

**Status:** OPEN — awaiting ROOT authorization. This is a technical assessment, not a math review. No exam JS, shared validator, engine, contract, or stage evidence has been changed.

The worktree is `C:\Users\USER\Desktop\AP-worktrees\h2-intake-batch01\AP------` at HEAD `3cecb45b2483ee1273a4b8a288f9b05ab91c9865`. The two current working artifacts and assignment roots, plus their full SHA-bound continuation and evidence inputs, are recorded in [literal-selector-technical-assessment.json](literal-selector-technical-assessment.json).

## Finding

Two independently assigned CREATE items have the same narrow shape: the exact ordered choices `①, ②, ③, ④, ⑤` are source selector values, while the current generic validator rejects each as if it were an appended choice label.

For Gangnam q7, the source PDF choice check is SHA-bound and says the symbols label five equality steps. The current student body contains those markers in order and the choices match the extracted baseline. The JS sets `preserveChoicePrefixes=true`; static inspection of `archive/engine.html` shows this keeps the marker in the choice text while the engine adds its own number, so this flag needs to become explicit `false` for single-marker rendering.

For Maesan q4, the source choices match the extracted baseline. Its exact source graph asset is SHA-bound as opened and `EXACT_EXTRACTED_IMAGE`; the image itself shows the ordered circled row labels ①–⑤. The current question omits `preserveChoicePrefixes`, so the engine's default strips the marker text and emits one ordinal. No question or choice text correction is needed.

These are not general exemptions for marker-prefixed strings. They are source-backed literal selectors rendered by the existing default prefix handling. Actual browser rendering was not performed; R3 still owns that check.

## Proposed generic predicate

At `archive/tools/archive-stage-validator-artifact-v2.mjs`, pass the current evidence row and assigned asset root into `validateChoiceStructure`. Suppress the duplicate-label issue only when all of these hold:

- The current choices are exactly five strings in this order: `①`, `②`, `③`, `④`, `⑤`.
- `preserveChoicePrefixes` is false or omitted. A true value fails the exception because it retains each glyph and duplicates the engine label.
- The current row binds the same qid, source file/ordinal, baseline raw SHA, and unchanged choice parity; the proof's choices hash matches the actual current choice array.
- A reviewed source reference shows the same exact markers in order. For student content, compare its current content hash and marker sequence. For a problem asset, require the ref to match the question's current image/visualAsset, verify the current file SHA under the assigned asset root, and require the source-visual evidence to say it was opened with exact source fidelity and record the ordered markers observed in the pixels.

Add the normalized marker observation to the existing evidence row only where needed (Maesan's current evidence binds the opened image and bytes but does not encode the specific glyph observation). This keeps the decision tied to existing source parity and reviewed body/asset bytes. Do not add an exam or qid allowlist and do not change the quality-contract version.

For q7, the only artifact correction is changing the newly added `preserveChoicePrefixes` field from true to false; keep source choices and question text byte-for-byte unchanged. Rebind the final artifact, student bundle, and evidence. For q4, keep the current choices and default display control.

Keep rejection for appended-marker strings, malformed lists, and any case lacking a current source reference. R1/R2 still independently check the source semantics and R3 later renders both views.

## Tests after authorization

Add focused cases to `archive/tools/archive-stage-validator-artifact-v2.test.mjs`: a positive body-reference case for q7 and asset-reference case for q4; negative cases for `preserveChoicePrefixes=true`, absent/mismatched evidence hashes, no body/asset marker reference, appended text, reordered/repeated/partial/extra/unknown/empty choices, and choice parity false. Verify the focused validator tests and only the affected CREATE validation after the authorized implementation. R1/R2/R3 completion remains separate.

This repairs only the q7/q4 choice-label false positives. Gangnam's separate H2 Math I L2 issues and Maesan's H15-M1-03/04 L2 authority gap remain unresolved by this proposal.
