# Reviewed native BASIC parent v1

`archive-reviewed-native-basic-parent-v1` is a named `approval.sourceReview`
subtype of `archive-basic-scope-rebind-request-v1`. It creates one independently
reviewed BASIC L1/L2 parent after an exact current-source wording repair. It is
not evidence that a prior canonical approval existed. The receipt reports one
new BASIC parent, zero preserved prior approvals, and zero advanced approvals.

## Scope and authority

The first contract is limited to one selected question in an original middle
school M2 semester-one exam. Both the previous and current source explicitly
state curriculum `2022`. An immutable `m2-s1-meta-review-v1` must independently
record `SOURCE_EXPLICIT_PRESERVED`, machine and semantic curriculum `2022`, null
PT/TPL, no definition proposals, an unresolved scoped PT/TPL binding, and the
specific debt `MULTIPLE_VALID_CHOICES_IN_SINGLE_CHOICE_STEM`. A proposed
curriculum is insufficient.

The request carries immutable native-review and independent-review references.
The local evidence bytes, their SHA-256, and the exact Git commit/path bytes must
all agree. The independent reviewer differs from the native reviewer and from
the request wrapper preparer. The independent review authorizes the exact
current student input, literal wording repair, and explicit new BASIC parent.
It does not claim a new blind review, REVIEW2, new difficulty judgment, or an
advanced PT/TPL approval.

The accepted independent schema is
`archive-m2s1-next-four-current-root-review-v1`. Its selected row binds the source
before and after, whole question hashes, native item and difficulty hashes,
declared changed field, and exact parent. A source-after reference may omit its
path when the review records only blob/raw hash and byte length. If a path is
supplied it must be the same source path. Unknown reference fields are rejected.

## Protected data and source repair

Only `content` may change in the selected question. The edit is one exact
occurrence of a short Korean wording fragment. All other questions in the source
file must remain whole-object identical. Answers, choices, mathematical values,
solutions, aliases and other selected fields must remain unchanged. This subtype
is text-only: renderer fields, HTML asset references and hidden renderer
dependencies are rejected.

The immutable native base and native-review commit must contain the same student
payload as the previous current-source snapshot. A separate historical source
commit must reproduce the actual prior metadata and identity fingerprints. The
prior metadata and identity selected rows are read from an exact Git commit.

All metadata values except the two fingerprints and the separately registered
four difficulty fields must stay identical to that prior row. Identity may
change only its source fingerprint. The existing
`approved_partial_with_explicit_holds` status, approved source unit/subunit, and
manual PT/TPL holds remain in force. Source PT/TPL must be empty. An existing
scoped source link, runtime approval or explicit runtime HOLD is outside this
new-parent lane.

The requested parent must match the current immutable canonical master,
projection policy, grade/course allowlist and unique scoped crosswalk parent.
The registrar does not infer a parent from the academic year or from a proposed
semantic curriculum.

## Writer, replay and difficulty dependency

The official writer creates or updates only these outputs:

- The selected metadata fingerprints.
- The selected identity source fingerprint.
- One BASIC scoped source-parent link.
- The digest-bound registration receipt.

The wrapper uses `archive-reviewed-native-basic-parent-review-v1` and the
decision `REGISTER_NEW_BASIC_PARENT_ONLY`. Receipt status is
`BASIC_PARENT_REGISTERED`, with `newBasicParentApprovals: 1`,
`newMetadataApprovals: 1`, `preservedMetadataApprovals: 0`, and
`advancedApprovals: 0`.

Difficulty registration remains a separate official request. Current difficulty
must equal either the exact prior tuple or the exact accepted native tuple;
other changes are rejected. This allows strict replay after an independently
bound difficulty-only request without treating that request as new mathematical
review. Preview and main registration order use the existing exact
fingerprint/source dependency: the BASIC request runs before a difficulty
request whose `before` fingerprints require its result. Unrelated requests are
not reordered by filename assumptions.

Replay revalidates immutable native and independent evidence, current source,
canonical authority, protected metadata/identity values, absence of runtime
assignment and the exact receipt counts/proof. Static writer projection is
reported as `STATIC_VALUES_VERIFIED`; it is not a Consumer PASS.

## Actual Consumer gate

The Changed-UID Consumer uses the explicit kind `basic-parent-registration`.
It reruns the official registrar projection and then checks current source
fingerprints, metadata, scoped link, canonical APPROVED/PASS parent and page
query. It must check the selected row, with zero skipped rows and zero pending
assignment for the new BASIC parent. It reports new BASIC and preserved counts
separately, and requires zero advanced approvals.

Ordinary difficulty-only rows retain their existing Consumer contract. An
unresolved curriculum or preexisting stale fingerprint is not repaired by
difficulty registration and must remain separately reported. No new BASIC
approval may be counted for those rows.

## Current narrow application

The current reviewed E019 Q19 repair changes the wording from asking for one
value to explicitly selecting all values from the choices. The original answer
and solution remain unchanged, and its source-explicit 2022 BASIC parent is
independently approved. E006 Q19/Q20/Q21 have only a narrow source QA status
repair and accepted native difficulty transport. Their curriculum evidence is
unresolved, so this new-parent subtype must reject them and their BASIC HOLDs
remain explicit.

Local official writer, replay and Consumer evidence is distinct from main
registration and deployment. Production requests must use remotely available
immutable review commits and the final current source/metadata baseline.
