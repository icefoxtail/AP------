# Literal selector repair implementation record

Implementation follows the ROOT-authorized proposal SHA-256 `8b093bdbce73b87cbd3d6a63d848512d7a88f2f7c16deaa2cd464b3526bb9532` at worktree HEAD `3cecb45b2483ee1273a4b8a288f9b05ab91c9865`.

Changed loci:

- `archive/tools/archive-stage-validator-artifact-v2.mjs`: added the strict evidence-bound proof consumer. It accepts only exact ordered standalone ①–⑤ choices, `preserveChoicePrefixes` exactly false or omitted, matching qid and source-parity fields, the exact current choices hash and normalized student-payload SHA, and either ordered markers in the current hashed question content or an opened exact-source problem asset whose current bytes match its SHA. Source files must be relative original high-school exam paths under `archive/exams/original/high/h1|h2|h3/` and match the evidence exam UID. The proof is read from that qid's full-artifact `artifactDispositions` row; R3 targeted rows are not expanded. When available, it cross-checks the current stage row and top-level source identity/baseline SHA. A present but invalid proof fails with `ARTIFACT_CHOICE_LITERAL_SELECTOR_PROOF_INVALID`; unsupported all-glyph lists also fail with `ARTIFACT_CHOICE_LITERAL_SELECTOR_UNSUPPORTED`. The standard appended-label diagnostic remains unchanged for every other prefix case.
- `archive/tools/archive-stage-validator-artifact-v2.test.mjs`: added positive content and physical asset cases, R3 targeted-row portability, current asset-byte tampering, and negative cases for missing/stale/mismatched proof, source parity, student payload, display preservation, appended text, malformed sequences, empty values, unsupported glyphs, invalid empty selector proofs, preserved subjective empty-choice behavior, and missing full-qid disposition binding.
- `LITERAL_SELECTOR_PROOF_V1.md`: records the stage-owner proof schema and full-qid portability rule.

Focused verification: `node --test archive/tools/archive-stage-validator-artifact-v2.test.mjs` exited 0; 14 tests passed, 0 failed. During iteration, fixture-only failures came from mutating the unrelated Geometry resolver proof and then from a shared test-object alias; the tests now preserve unrelated Meta failures, clone the source-parity proof, and assert only the selector disposition where appropriate. A source-path fixture typo was corrected before the final passing run.

No exam JS/assets or stage evidence were changed. No target generic validator or browser render was run. This does not clear the separate H2 Math I L2 issues or authorize an L2 representation. ROOT's separately directed CREATE_10 must set q7 `preserveChoicePrefixes` false, leave source choice strings exact, and bind the portable proof in its current full-qid disposition. The Maesan q4 source owner must encode the marker observation against its current opened asset SHA. R1/R2 still perform independent source semantics; R3 still owns actual render.




Final file SHA-256:

- `archive/tools/archive-stage-validator-artifact-v2.mjs`: `c42b17380970bbeed3aafa1445c68d533a5981a3dd89d8f05a1b604c2071cb25`
- `archive/tools/archive-stage-validator-artifact-v2.test.mjs`: `6fe6fcbd2db38796f24b67b19d5f411ba38e5210f5e860dc5cc2266d9cd07b15`
- `archive/analysis/h2-intake-batch01-20261009/technical-choice-label-selector/LITERAL_SELECTOR_PROOF_V1.md`: `b564098466b84e9829406e632d270c318a279f539915fd664b74f10e3d2aa9d4`

Final focused command: `node --test archive/tools/archive-stage-validator-artifact-v2.test.mjs` — exit 0, 14 passed, 0 failed. `git diff --check -- archive/tools/archive-stage-validator-artifact-v2.mjs archive/tools/archive-stage-validator-artifact-v2.test.mjs` — exit 0.
