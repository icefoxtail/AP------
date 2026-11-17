# E052 Q5 original diagram transport

## Scope and authority

`M3_E052_Q5_ORIGINAL_DIAGRAM_V1` is a closed transport for one existing
`image` URI in one public source bank. It binds UID
`qid_v1_f0b8bed25f89afa2840da1e6980215f102c4e9a44ef272080a3c53a4a5226fe1`,
ordinal 5 of the 25-question bank
`archive/exams/original/middle/m3/2final/21_풍덕중_2학기_기말_중3_기출.js`.

The immutable static authority is
`docs/operations/m3-e052-q5-original-diagram-20261116/independent-static-v1.json`
at public commit `faf874ee45044db2c69368f72ddfe0c230b78a1c`.
Its exact raw SHA-256 is
`cce08df8617603db1fd7d8967e01ed8f585105817b693be052156e5c2e846ab8`.
It transports the already frozen original-given review and extraction hashes;
it contains no question, answer, explanation, or assignment values.

The existing `q05.png` remains intact. The new
`q05-problem-source-v2.png` has SHA-256
`e09a9ffa670e31766c57c4687e88a8d44fb773e0ca265cc4d1ad06e40a79ad6f`,
Git blob `716c4228fd5e2ab0ad995eae9b498f8b57a8eb88`, and 57,270 bytes.
The new PNG and static JSON are bound to the same immutable public commit.
The static document therefore carries four asset fields; the enclosing
five-field static reference supplies its commit. The materialization manifest
must carry the resulting exact five-field new-asset reference.

## Accepted input and effect

The existing metadata-source workflow accepts its usual envelope and exactly
one materialization manifest. The new profile adds a dedicated inspector and
materializer dispatch. Existing metadata, image8, and SVG7 profiles keep their
own contracts and scopes. This input cannot carry a source file, asset payload,
preservation request, registry change, or independent registration approval.

The manifest binds the current source and identity-map hashes to an exact
base commit. The selected current question must equal the whole question in
the pinned historical source at `c777b5add23c5cf43700761fba187e4ece41c778`.
The historical source and old PNG are verified from exact Git paths, blob
identities, raw hashes, and byte counts. A caller cannot replace these facts by
resealing its own manifest. The current old PNG must still be the reviewed
original. A conflicting file already at the new PNG path is rejected.

The materializer edits only the range of the selected existing top-level
JSON `image` string. It does not insert keys or reformat the bank. It executes
the entire before and after JavaScript in a bounded context with VM-native
globals and string/Wasm code generation disabled. The resulting after bank
must equal the current before bank with exactly that image value replaced.
The inverse string edit must recover every original byte, including comments,
prefix/suffix statements, all other fields, and the other 24 questions.

The materializer writes one source file into a fresh directory outside its
checkout. It does not write an asset or alter the original source checkout.
The ordinary candidate builder produces an unreferenced source candidate and
a transport receipt. Publication and the final exact asset reference are
separate steps controlled by the existing publisher.

## Approval boundaries

The receipt reports `newApprovals: 0`, `approvalEffect: NONE`, and
`actualUi: PENDING`. This transport does not issue mathematical QA, Native,
metadata, REVIEW2, difficulty, or four-slot approval. Current Native and
semantic-field decisions require their own exact evidence and official
registration path. Actual student UI must inspect the complete restored
diagram through the current renderer; static transport is not UI approval.

## Verification

`tests/archive-m3-e052-q5-original-diagram-transport.test.mjs` reads existing
public immutable Git objects at runtime. It embeds no student source text.
The tests cover real reviewed question/asset equality, exact one-URI output,
unselected and suffix preservation, the real candidate inspector/builder,
resealed given/old-asset substitutions, scope and identity drift, conflicting
new paths, VM constructor/code-generation attempts, hidden getters, duplicate
JSON keys, extra input payloads, and unsafe output locations.
