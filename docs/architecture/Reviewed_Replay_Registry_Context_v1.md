# Read-only registry context for native source-proof replay

The original registration receipt binds the request bytes and evidence. Replaying
an explicitly finalized native proposal must still inspect its original witness,
current renderer assets, exact definitions and original fingerprint context.
Otherwise a same-path renderer change can be missed after the first write.

An add-only definition is already present during replay. Passing the current
lookup as both the before and after view cannot reproduce the original proof.
`restoreReviewedReplayCanonicalBefore({ request, currentTables, root })` supplies the
request-owned before view without changing canonical files or approvals.

The helper admits only ordinary partial FINAL_QA requests with an explicit native
proposal finalization v1/v2/v3 or native scope-field opt-in. Every changed record
must have an explicit null before value, an ACTIVE after value, the exact selected
key or curriculum binding tuple, the correct canonical path and owner, and full
equality with the current canonical record. Replacements, deletions, unsupported
collections, duplicates and current definition drift fail.

The original v1 contract also permits creating a complete new canonical pack or
concept shard. That case requires the paired ACTIVE index addition and every
new owner document with null before values. The helper reads the current owner
files under `root`, checks full equality with the original output including the
registrar's deterministic count fields, and removes exactly those new lookup
entries. A complete pack may contain its original unselected sibling templates;
they must still match the authenticated original request exactly. Explicit owners
must agree with the bundle, and partial bundles, owner/version drift, duplicate
entries and unpaired whole documents are rejected. Exact selected unit/subunit
master additions are restored with their original lowercase active status and
parent relationship. These rules preserve the existing v1 registration contract.

It clones only the affected lookup Maps and removes the request's authenticated
additions from that comparison view. Other current entries and existing owner
metadata, versions and nonenumerable descriptors remain current. This is not a claim to
reconstruct a complete historical canonical snapshot. Existing records reused by
the request remain present and must pass the original unchanged-definition checks.

The caller must first validate the original request/receipt identity and all
evidence references. It then re-runs source reassessment with this before view and
the current after view, and compares the entire resulting proof with the receipt.
The helper performs no file writes and does not create definitions, mathematical
QA, REVIEW2, difficulty judgments or metadata approvals. The source-proof replay
and its actual Consumer checks remain required independently.
