# Private partial four-slot append v1

This contract extends an already valid `PARTIAL_UIDS` compact with separately
accepted, disjoint UIDs. It does not change source questions, native metadata,
difficulty values, identity records, or the meaning of the original receipt.

## Required transition

The current compact must match an explicit SHA-256 and the Git input tree. The
new private input also binds the exact prior compact Git blob and its existing
receipt SHA. The importer validates that existing receipt against the current
source, dictionary and complete canonical UID/ordinal partition before append.

Every added UID must belong to the prior `unsubmitted` set. The new selected set
is exactly the union of the preserved selected set and the added set. The new
unsubmitted set is exactly the prior unsubmitted set minus those additions.
The complete source denominator is retained. This partial route requires at
least one unsubmitted UID; it does not silently convert to full-exam approval.

The old receipt is never rewritten. A byte-identical snapshot of the prior
compact is stored under the new request's receipt namespace. The new receipt
binds that snapshot, the old receipt, preserved/added/cumulative counts and the
canonical partition digest. Every preserved compact item must equal its prior
item exactly. The aggregate `reviewedBy` names the latest added-vector review;
the earlier reviewer and time remain in the immutable prior compact/receipt.

Public validation recursively verifies all receipt ancestors. Missing or
modified ancestors invalidate the dependent compact, including during cache
reuse. The runtime builder observes every receipt and compact-snapshot digest
to reject changes during a build. New receipts and snapshots are written before
the atomic replacement of the one live compact. An interrupted import can leave
unreferenced evidence but cannot expose a compact without its evidence.

## Private source-structure acceptance adapter

The explicit input schema is
`archive-4slot-root-reconciled-source-structure-append-input-v1`. It is read only
from outside the repository. The existing Q22 and current-source single-item
input schemas remain separate and retain their new-file/exact-replay behavior.

The adapter reads the actual bytes of the independently frozen source-only
revision, the root reconciliation, the source-only input, the original author
record and the original method freeze. It checks their schemas, identities,
references, source/dictionary/role-contract bindings and approval boundaries.
The root's accepted item pointer and term vector must match the independent
revision. Original-author vectors are not treated as approved, and initial
method-only judgments are not relabeled as exact blind agreement. The original
format is reused only from the same source version and an explicit single-answer
`CHOICE` source. This adapter version rejects diagrams or other source formats;
they require their own accepted evidence path.

All accepted literal spans are checked against the current student stem or the
specified choice. Input UTF-16 offsets must be valid boundaries and match the
exact literal. Public spans are converted to codepoint offsets with their
lengths and SHA-256 digests. Multiple spans supporting one term are all kept and
checked. No private literal or justification is published.

Structural method entries remain `IMPLIED` with
`STUDENT_SOURCE_STRUCTURE_ONLY`. Their classification, justification digest and
literal-name observation remain distinct from claims that a written solution
was inspected. The receipt explicitly limits authority to the added four-slot
vectors and records zero native/full-semantic, difficulty or new math-QA
approval. The compact and public receipt contain IDs, scope/provenance metadata,
digests and source spans only.

## Replay and rejection

The same request is replayable only when its current compact, new receipt and
prior snapshot equal the deterministic output byte for byte. A changed review
revision requires a different accepted operation; it is not an exact replay.
Existing immutable evidence with different bytes is never overwritten.

Reject overlapping or out-of-scope UIDs, missing denominator rows, noncanonical
raw question numbers, source/dictionary drift, incomplete root acceptance,
unaccepted vector changes, malformed or changed spans, relabeling structural
evidence as explicit use, changed preserved vectors, reused ancestor request
IDs, and missing/modified ancestor evidence. The caller must complete review
of the code and exact private input before a real import/publication.
