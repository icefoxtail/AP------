# Multiple current renderer holds in a preserved full M3-S2 compact

This opt-in contract transports an existing full compact to an exactly reviewed
current source while every independently observed renderer discrepancy remains
pending. It adds multiple held UIDs in one file and a problem-side SVG role.
It creates no four-slot values, mathematical approval, difficulty approval,
source correction, asset correction, or release operation.

The v1 single-UID, solution-image validator remains separate and strict. Legacy
native holds, published renderer correction continuation, and private partial
submission keep their existing contracts.

## Explicit schemas and complete partition

| Document | Schema |
| --- | --- |
| Each held item | `4slot-current-renderer-negative-hold-v2` |
| Full-file carrier | `m3-s2-current-renderer-negative-hold-v2` |
| Independent negative review | `archive-m3s2-current-four-slot-renderer-negative-review-v2` |
| Positive current continuity review | `archive-m3s2-current-four-slot-vector-continuity-v1` |

The carrier scope is `CURRENT_FULL_COMPACT_RENDERER_HOLDS`; its decision is
`WITHHOLD_REGISTRATION`. `heldItems` contains the exact canonical UID, source
ordinal, source question number and displayed ordinal for every held item,
ordered by source ordinal. `heldUidCount` must equal this set and the actual
number of item holds. The positive review's `withheldOrdinals` must equal the
complete held set. All negative rows for the same source must belong to that
same set, so omitting a second negative cannot release it.

`retainedOrdinals`, `unchangedOrdinals` and `heldItems` partition every source
question and every existing compact row exactly once. This is a complete-file
transport; `PARTIAL_UIDS`, an omitted row, a smaller denominator and an unknown
schema or field are rejected. Source ordinals and displayed numbers are joined
separately and cannot substitute for each other.

Each item repeats the carrier, positive-review and negative-review references
from `evidence.nativeHoldReview`. These references have safe repository paths,
full immutable commit IDs and raw SHA-256 hashes. Sources, the prior compact,
the dictionary and assets also bind their exact Git blob IDs. Current source,
dictionary, assets and the three live proof files must match their immutable
bytes. They are checked before runtime cache reuse.

## Preserve the entire previously approved vector

The prior compact must be a complete, unheld compact with its source binding
intact. The carrier binds both `nativeFourSlotRef` (the prior compact's actual
top native authority) and `originalFourSlotRef` (its original review). Every
native row is projected with the existing dictionary importer and must match
the preserved compact row, including all four slots, format and candidates.
The complete compact and reviewer record remain exact except for the current
source binding, the new evidence reference group and the explicit holds.

Some existing top native files already contain approved method amendments.
The optional `methodAmendmentIndependentReviewRef` must point to the exact
review named by the prior compact, at the prior compact's immutable commit.
If absent it is explicitly `null`; a changed original vector cannot use that
absence as an exemption.

For the recognized existing `independent-scoped-method-review-v1` authority,
each changed method is replayed through all of the following:

- The original native row and the actual top native row, joined to the same
  canonical UID and source ordinal. Only method and its resulting candidate
  projection may differ; given, goal, condition and format remain exact.
- The immutable source-continuity document's selected exam, original/top
  native hashes, source commit/blob, before/after method terms and solution
  hash, plus the top native's existing `sourceRebinding` chain.
- A different existing independent reviewer, an exact selected accepted row,
  matching UID/source/solution hashes and the exact after terms. All selected
  amendment rows must be consumed; an extra or missing amendment is rejected.
- Fresh reads of the approved source bytes and every current native method
  quote from that solution. The current continuity review separately covers
  all current changed questions and assets.

The old review's `amendmentSha256` is an opaque legacy aggregate identifier.
Its raw aggregate preimage is unavailable; this contract does not reconstruct
it or claim that it was rehashed. It never supplies approval by itself. The
direct immutable accepted rows and source/solution/native chain above provide
the bounded authority. A missing direct chain rejects the file.

## Current renderer roles and observations

A negative row must come from a reviewer different from the current transport
author. It binds the current canonical UID, whole question, student payload,
identity fingerprint, preserved compact row, complete current asset set and
the particular discrepant SVG. It records actual reading of the stem,
solution, all existing four slots and renderer. Allowed negative
classifications are ambiguity, text mismatch and relation mismatch.

`incorrectRenderer.role` is either:

- `solutionImage`: exactly the current source's `solutionImage` SVG.
- `questionImage`: an SVG actually referenced by current problem-side
  `question`, `content`, `choices`, `image`, `images`, `figureSvg` or `svg`.
  Text/choice HTML uses an actual `img src` attribute; a bare path, HTML
  comment or `data-src` attribute does not establish this role.

A solution-only or unrelated SVG cannot be relabelled as a question image.
Binary prior/current asset references are compared as raw bytes. These checks
bind an actual recorded observation; they do not infer visual or mathematical
correctness from a hash or assert that a browser session was run.

Every retained changed row has exact old/current whole-question hashes,
changed-field coverage, all four-slot reading, actual renderer observation
and complete old/current asset references. Every unreviewed peer preserves
its whole question object, student payload, asset paths and raw asset bytes.
Presentation metadata outside the historical payload hash is also protected.

## Withholding survives removed markers

The shared reader discovers recognized v1 and v2
`negative-independent-review.json` files in actual immutable `HEAD` ancestry
with `git log --full-history`. Its pass-local inventory identifies obligations
only and cannot approve or release a value. It checks every historical UID
for that source against a matching current explicit hold and exact negative
witness, including when live markers or later committed witness files were
removed. Unavailable Git/source history fails closed.

Successful validation registers only the unaffected peers. Every held UID
emits `EXPLICIT_REVIEW_HOLD:SOURCE_RENDERER_CORRECTION_PENDING`, keeps its old
slot values and stays absent from the active Consumer index. Source changes,
new hashes, deleting proofs or reverting to the ordinary/v1 route do not
release it. Any later correction or release needs its own approved contract.
