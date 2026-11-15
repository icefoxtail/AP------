# Current renderer negative intake for an existing full M3-S2 compact

This contract transports an already approved full compact onto an exact current
source while one independently observed renderer discrepancy remains pending.
It does not create a four-slot value, approve the held question, repair the
renderer, import private partial evidence, or change any student source or asset.
The existing legacy renderer hold and published correction continuation remain
separate, unchanged contracts.

## Scope and authority

The opt-in item schema is `4slot-current-renderer-negative-hold-v1`. It is limited
to a complete M3-S2 compact with exactly one held UID and a complete canonical
source/UID/ordinal partition. The immutable original full compact, its original
native four-slot file and its source-continuity reference remain available and
are read again. Every original vector, candidate, format and `reviewedBy` field
must remain exact. Only `sourceGitBlobSha`, the new evidence reference group and
one `registrationHold` may differ from that original compact.

The carrier schema is `m3-s2-current-renderer-negative-hold-v1`. Its three
immutable references are carried both in the item and in
`evidence.nativeHoldReview`:

| Item field | File evidence field | Required authority |
| --- | --- | --- |
| `currentRendererNegativeEvidence` | `currentRendererNegative` | Exact full-file partition and source/native references |
| `vectorContinuityEvidence` | `vectorContinuity` | Actual reading of current stem, solution, all four existing slots and every referenced prior/current renderer for retained changed rows |
| `independentNegativeEvidence` | `independentNegative` | A different reviewer actually reads the current held question, existing vector and all current renderer assets and withholds the exact UID |

Each reference binds an immutable Git commit, a safe repository path and its raw
SHA-256. Source, prior compact and asset references also bind the Git blob SHA-1.
The current source, current dictionary, current assets and three evidence files
must equal their immutable bytes on disk. Binary assets are read as bytes.
The independent negative witness records a discrepancy or ambiguity; its decision
never grants a mathematical or metadata approval.

## Full-file checks before cache reuse

The runtime builder verifies the full file before using a cached result. It
reconstructs every original vector with the existing dictionary importer and
requires exact equality with the preserved compact rows. The complete source
count, original compact count and native count must agree. Canonical UID joins
must be unique and agree with source ordinal and displayed question number.

All changed retained rows must be covered by the actual continuity review,
including exact question hashes, exact changed-field sets and every old/current
renderer byte. Unreviewed peers must preserve their whole question object, student payload
and all local asset references and bytes. This includes presentation hints,
layout and captions that are outside the historical student-payload hash. The held row binds the exact current student payload,
whole question, original vector and independently observed solution SVG. The
retained, unchanged and one held set must cover the whole file exactly.

Unknown schemas or fields, missing references, unavailable immutable bytes,
changed original vectors, incomplete partitions, altered source/assets or a
missing observation reject the complete file. There is no fallback to the
ordinary registration path after this opt-in is recognized. Proof file hashes
are part of the runtime input digest and are observed again before an index is
written.

## Runtime result and limitations

Valid peers use the unchanged runtime registration and Consumer logic. The held
UID always emits `EXPLICIT_REVIEW_HOLD:SOURCE_RENDERER_CORRECTION_PENDING` and is
absent from the active Consumer index. It retains its old raw slot values and
original reviewer for an auditable later decision. A correction or later release
requires its own explicit approved transition; this negative intake provides no
release operation.

This is a full-compact transport, not `PARTIAL_UIDS`. It cannot manufacture a new
partial import or remove an unreviewed question from the denominator. The
renderer observations are actual raster/source inspections; they do not claim an
executed browser session or full mathematical re-review.

## Withholding obligations survive removed markers

The proof file name `negative-independent-review.json` under `docs/operations/`
is part of the published negative contract. For M3-S2, the builder reads exact
recognized negative reviews from immutable `HEAD` ancestry using
`git log --full-history`. This inventory is cached only within one builder pass.
It identifies a withholding obligation and cannot approve any value. Deleted
working-tree references, a later deletion of the proof file, or removal of all
new compact markers do not release a recorded UID. Unavailable Git history or
immutable source bytes fail closed. Compacts with no such negative decision in
their immutable ancestry keep the existing registration path.

A matching obligation requires the explicit negative intake, the same current
source snapshot and exact witness reference. A changed source needs a separate
formal review; it cannot turn the negative obligation into ordinary registration.
