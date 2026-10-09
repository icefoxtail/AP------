# q7 literal selector choices: bounded validator and display repair proposal

**Status:** OPEN — awaiting ROOT authorization for the exact technical locus. No code or exam JS was changed in this assessment.

**Binding:** worktree `C:\Users\USER\Desktop\AP-worktrees\h2-intake-batch01\AP------`, HEAD `3cecb45b2483ee1273a4b8a288f9b05ab91c9865`. Working JS SHA-256 is `f9d8592009218672855c6515795dc01d6092ccf039e931091213e7258add6837`; assigned asset root is `C:\Users\USER\Desktop\AP-worktrees\h2-intake-batch01\AP------\.tmp\archive\h2-intake-batch01-20261009\24_강남여고_1학기_중간_고2_대수`; evidence root is `C:\Users\USER\Desktop\AP-worktrees\h2-intake-batch01\AP------\archive\analysis\h2-intake-batch01-20261009\24_강남여고_1학기_중간_고2_대수`. Input packet and implementation hashes are recorded in [Q7-literal-selector-technical-assessment.json](Q7-literal-selector-technical-assessment.json).

## Finding

The current q7 choices are exactly `①, ②, ③, ④, ⑤`. The SHA-bound source check says those glyphs are the answer values pointing to five equality steps, not appended choice labels. The extracted choices are unchanged. The current generic validator reports all five as duplicated engine labels because it rejects every choice string beginning with a circled digit without looking at source evidence.

Static inspection of `archive/engine.html` found an additional display-control mismatch: `renderChoicesHTML` always emits the engine's own ①–⑤ marker. With `preserveChoicePrefixes=true`, it keeps the source glyph as choice text too, producing duplicate visible markers. With `preserveChoicePrefixes=false`, `stripChoicePrefix` removes that text prefix and the engine emits one marker. The final q7 currently sets the flag to true; it was absent from the extracted baseline. No actual browser render was performed here; R3 still owns that screen check.

## Minimal proposed repair

Change only q7's `preserveChoicePrefixes` to explicit `false`; preserve the five raw choice strings exactly and rebind the artifact/student bundle/evidence to the changed artifact SHA. No engine change is needed.

In `archive/tools/archive-stage-validator-artifact-v2.mjs`, pass the current evidence row into `validateChoiceStructure` and suppress the existing diagnostic only when all these conditions hold: the choices equal the exact ordered five glyph list; `preserveChoicePrefixes` is exactly false; the same qid's source parity says choices are unchanged; and its source choice proof records the exact ordered markers, matching qid, `PRESERVE_LITERAL_SOURCE_CHOICES`, and unchanged baseline/final choices. Every other leading marker remains rejected, including appended labels. Add focused positive and negative cases in `archive/tools/archive-stage-validator-artifact-v2.test.mjs`.

R1 and R2 must still independently confirm selector semantics and source parity. R3 must render q7 and confirm each option displays one selector glyph. This repair clears only q7's five diagnostic issues; the current separate Meta failures on q9, q17, q18, and q19 remain.

## Focused tests after authorization

- Accept only the exact ordered glyph list with `preserveChoicePrefixes=false` and matching current-qid source evidence.
- Reject the same list when the display flag is true, the proof is absent/mismatched, or source parity is false.
- Keep appended marker text rejected.
- Keep reordered, partial, repeated, unknown, empty, and extra lists outside the exception.
- Verify the focused engine rendering after the field change, then leave full actual-render ownership to R3.

No exam source, engine, validator, contract, or review evidence changed. No validator or render was run. ROOT's next action is to authorize this exact q7 display-control and validator exception locus; then the existing CREATE session can apply the correction and refresh only affected bindings and validation.
