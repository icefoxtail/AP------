# Literal selector corrective implementation record

**Disposition: READY for ROOT handoff.** This correction addresses the two hash-contract findings in ROOT's technical review. It preserves the prior [`repair-implementation.md`](repair-implementation.md) and its test record; this file supersedes it only for student-payload and baseline-SHA binding details.

**Binding:** `C:\Users\USER\Desktop\AP-worktrees\h2-intake-batch01\AP------`, HEAD `3cecb45b2483ee1273a4b8a288f9b05ab91c9865`. Scope remains only `archive/tools/archive-stage-validator-artifact-v2.mjs`, its focused test file, and the proof usage guide.

## Corrections

- The validator now projects student payload fields from the current question's `Object.entries` order through the canonical `STUDENT_FIELDS` whitelist and hashes that JSON serialization. It no longer reconstructs the payload in whitelist order or filters choice-object fields. The selector still requires the exact five raw string choices, so object-valued choices cannot qualify.
- The integration test imports and invokes the real `normalizeStudentBundle` adapter on a deliberately reversed student-field order and uses the adapter's returned `studentPayloadSha256`. It confirms that field order is preserved and that the validator accepts the resulting proof.
- Immutable baseline SHA binding now reads only explicit baseline fields (`baselineSourceRawSha256`, `extractedBaselineRawSha256`, or `sourceIdentity` baseline fields) and the current row's explicit baseline source-parity fields. It does not treat `expectedSourceRawSha256`, `sourceInputArtifactSha256`, or `assignmentExpectedRawSha256` as the baseline. The current student payload SHA and top-level artifact SHA remain separate current-artifact bindings.
- A focused test proves an explicit current raw SHA can differ from the unchanged intake baseline and still validate; changing the explicit baseline SHA causes the selector proof to fail.

The previous strict scope is preserved: exact ordered standalone ①–⑤ strings; false or omitted prefix-preservation control; current source identity, qid, choices, student payload, and content/asset binding; proof in the full-qid `artifactDispositions` row; R3 targeted rows stay targeted. The parent Math I L2 authority gap and all exam-stage findings remain outside this change.

## Validation

`node --test archive/tools/archive-stage-validator-artifact-v2.test.mjs` — exit 0, **16 passed, 0 failed**.

`git diff --check -- archive/tools/archive-stage-validator-artifact-v2.mjs archive/tools/archive-stage-validator-artifact-v2.test.mjs` — exit 0.

No target exam generic validator, stage review, or browser render was run. No exam JS, asset, or stage evidence was changed.

## Final file SHA-256

- `archive/tools/archive-stage-validator-artifact-v2.mjs`: `e914f9d02c4f40e4536d8fb27f2cf2b065a7086c640ffea3bc443976c42fa3c4`
- `archive/tools/archive-stage-validator-artifact-v2.test.mjs`: `ac56d02446cea1627477e28de36fe979a7a8c1e5a31903030440a8b9265781d3`
- `archive/analysis/h2-intake-batch01-20261009/technical-choice-label-selector/LITERAL_SELECTOR_PROOF_V1.md`: `411bd3c23bc8c30f34216143b8c77fd3d9d1d34ad41b64f0e4fc9833ce0cc809`
