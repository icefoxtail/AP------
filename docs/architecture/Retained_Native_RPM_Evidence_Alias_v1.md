# Retained native RPM evidence alias v1

An unchanged native RPM record can still belong to an older crosswalk file. A
new retained-fields request must not replace today's canonical file with that
historical file, and its existing native scope approval must not be rewritten
to claim the current file was reviewed.

This optional item-level carrier changes only the evidence location. It leaves
the original `sourceReview`, `retainedFields`, frozen renderer request, native
review, metadata values and difficulty values unchanged.

```json
{
  "nativeRpmEvidenceAlias": {
    "schemaVersion": "archive-reviewed-native-rpm-evidence-alias-v1",
    "nativeCommit": "<exact sourceReview.reviewCommit>",
    "nativePath": "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/middle2.json",
    "nativeSha256": "<SHA-256 of the raw crosswalk at that native commit>",
    "copyRef": {
      "path": ".archive-meta-register/evidence/retained-native-rpm/<nativeCommit>/middle2.json",
      "sha256": "<the same original raw SHA-256>"
    }
  }
}
```

The exact alias reference replaces the old crosswalk reference in both the
approval and selected item evidence lists. The current canonical path remains
unchanged on disk. Each list must bind the alias once, without retaining an
ambiguous reference to the mutable canonical path.

## Required validation

The marker is accepted only in a partial FINAL_QA request, with no registry
changes, source-only rebind or identity-only mode, for an existing settled M2
semester-two retained-fields review. Marker placement and all keys are closed.
All pre-existing retained-fields checks remain mandatory, including native
field review, independent primary disposition where required, current ACTIVE
definitions and exact unchanged curriculum binding. This carrier cannot select
a different Primary, curriculum, template or cross-concept.

On every validation the registrar re-reads the original native Git crosswalk,
the alias file, current Git HEAD and the live canonical crosswalk. Both Git
paths must be regular files; local symlink traversal is rejected. The alias
must equal the native Git bytes exactly. The current canonical bytes must equal
the current HEAD bytes. Both documents must have the same ACTIVE_REFERENCE M2
header, locked RPM authority and canonical authority. The selected native RPM
record must occur exactly once and match the current whole record exactly.

Unrelated records and generated summary/revision information may change. No
current full-file SHA is fixed in the request or issued proof. The issued proof
retains the original `nativeRpmRef` and adds the alias and selected-record digest.
The current full-file SHA belongs in execution diagnostics, not in the approval.
This avoids creating a new historical-file debt when another record changes.

The existing durable source-review sidecar seals the complete original request,
including this item marker and its retained-fields result. Runtime replay reads
the files and validates the selected record again. No success, live bytes or
approval result is cached by the carrier. Removing or changing the marker,
alias, proof or durable sidecar does not create an ordinary approval path.

## Evidence and execution scope

The alias is a byte-identical copy, not a new review document. No new source,
renderer, mathematical, difficulty or metadata approval is created. Existing
M2 renderer v1 and refresh contracts, their immutable frozen comparisons and
their independent observations remain unchanged.

The normal preview treats the alias as an exact immutable evidence dependency.
Its shadow already restores current canonical data, so no historical exception
or guard relaxation is added to preview, Consumer or the main writer. Actual
registration and Consumer results must be reported separately from code tests.
