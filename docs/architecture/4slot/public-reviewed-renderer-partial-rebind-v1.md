# Public reviewed renderer partial rebinding

This intake publishes an existing subset of an already reviewed M3 S2 compact after a solution image is added. It issues no semantic approval, native FINAL_QA, new difficulty decision, or new mathematical review. The existing private one-item intake is unchanged.

## Inputs

The public input is `archive-4slot-public-reviewed-renderer-partial-input-v1`. It binds the current source and dictionary to actual Git HEAD bytes, the complete original compact to an immutable Git commit, the original source baseline to its exact Git blob, and each selected native row to its immutable public review file. Existing compact replacement requires an explicit expected SHA equal to the entire prior compact. The old compact and native files are never edited.

A separate reviewer-issued `archive-4slot-public-reviewed-renderer-rebind-acceptance-v1` names each exact input SHA. Author and reviewer must differ. The reviewer accepts current quote bindings and unchanged vector roles only. All semantic, other-UID, mathematical-review, and source-change counts are zero. Missing acceptance is a hard failure.

## Selection

Each input partitions every actual canonical source identity exactly once into `selected` or `unsubmitted`. Selected rows retain the original compact object, including the format and all four slot vectors. Every term must agree with the immutable native row and current dictionary; every literal quote, method evidence type, and implied justification is retained and bound to current code-point offsets.

There are two finite selected-row classes. `UNCHANGED_WHOLE_QUESTION_AND_ASSETS` requires exact original/current whole-question equality and all referenced asset bytes. `REVIEWED_SOLUTION_RENDERER_ADDITION` permits changes only to solutionImage, solutionImageSize, solutionImageAlt, and solutionImageCaption, requires that the original solutionImage was absent, preserves existing referenced assets, and requires a separately authored current renderer review tied to the source, actual SVG bytes, and viewed raster digests. Answer, solution, stem, source metadata, and unknown-field changes are rejected.

## Output and runtime

The issuer writes the selected compact and a distinct `archive-4slot-public-reviewed-rebind-receipt-v1`. This public schema does not impersonate the private import schema. Generic PARTIAL_UIDS validation still enforces identity partition, selected-only rows, exact source/dictionary, quote coverage, and receipt digests. The public branch additionally rederives the receipt from the public input, independent acceptance, immutable original native/source, and live selected assets before cache reuse. The helper digest participates in the cache key.

Unsubmitted identities appear as NOT_SUBMITTED and receive no slot record. For the first packet, four exams contain 94 identities: 23 existing unchanged rows plus 19 reviewed solution-renderer rows are selected, and 52 remain unsubmitted. This is not a whole-exam source-header promotion.

## Operation

Run `node tools/4slot/rebind-reviewed-partial.cjs --root REPO --input PUBLIC_PATH --input-sha256 SHA --acceptance ACCEPTANCE_PATH --acceptance-sha256 SHA --expected-compact-sha256 SHA`. The default is a dry run; add `--write` only after the independent acceptance is available. Exact replay is allowed. A different existing receipt, modified compact, changed source/proof/asset, unsafe path, or missing Git proof fails closed. CI and writer checkouts must retain the immutable proof commits, including any explicit evidence parent.
