# Reviewed source metadata candidates

This transport constructs a reviewable source candidate from existing public Git objects and a bounded JSON metadata change. It does not approve questions, register metadata, modify shared derived data, or publish the site.

## Immutable input

An input commit has exactly one parent: the current main commit. Its only differences are new metadata JSON files and `.archive-source-metadata/candidate.json`. Existing evidence cannot be overwritten. Code, workflows, source banks, images, derived data, symlinks, and student question/answer/solution fields are refused in the uploaded inputs.

The envelope uses `archive-reviewed-source-candidate-input-v1` with `materializationId`, `baseCommit`, `manifestRef`, and `inputFiles`. Every file reference contains an exact path, Git blob SHA-1, and raw SHA-256. The manifest is itself one of the listed inputs. The materialization ID is 6–81 lowercase letters, digits, or hyphens and starts with a letter or digit. Its one optional field is `preservationRequestRefs`, described below. Unknown fields and duplicate JSON keys are refused, including escaped spellings of duplicate keys.

The pure materializer validates the base source, canonical identity mapping, selected request and UID, supported metadata fields, and exact resulting source bytes. It parses supported static JSON bank wrappers without evaluating input JavaScript. All nonselected fields and student-facing payloads remain byte-bound to the public base. The result must match the request's expected source blob and the manifest's before/after hashes.

## Closed input references

Every uploaded file must be reachable from the materialization manifest, its declared registration requests, or the optional declared preservation requests through a supported typed evidence reference. A metadata-shaped orphan is rejected. Listing a file in `inputFiles`, adding its hash to an approval, or inventing a schema name does not authorize that file.

The initial supported registration input is `archive-reviewed-exam-meta-register-request-v2` with `FINAL_QA`, `metadataReviewed: true`, ordinary full or `PARTIAL_UIDS` scope, and an immutable native `sourceReview` for every selected item. Root, approval, item, source-review specification and field-patch shapes are closed. Metadata patches use the existing shared registrar value-field contract and bounded value shapes; this does not enlarge the pure materializer's smaller source-field allowlist. Every selected UID and ordinal must resolve uniquely in the exact public base identity map. The whole exam denominator and final source blob must agree with the corresponding manifest file. Each materialization request item must occur exactly once in that manifest's changes; an additional selected item cannot ride along without a source-field operation. Preservation-only items belong to the separate declaration below.

Newly authored parent evidence uses `archive-meta-pipeline-parent-label-evidence-v1`, with only `schemaVersion`, `sourcePath`, `sourceSha256`, and `records`. For `archive/data/basic-scope-parent-links.json`, each seven-field parent record must already exist in the exact current base with identical values. The M2 current-metadata alternative below has a separate nine-field projection. Only this typed `*.parent-labels.json` evidence is permitted under the reviewed-exam receipt directory; issued registration receipts and issued source-review/renderer binding sidecars cannot be uploaded as candidate inputs.

Complex review evidence is copied from an immutable public Git object, not reconstructed from an author wrapper. The local raw bytes must exactly equal the request's explicit commit and path. The initial recognized families are:

| Typed request edge | Accepted evidence and authority |
| --- | --- |
| `sourceReview.reviewRef` | Exact `reviewCommit:reviewPath` bytes; `m2-s2-meta-review-v1` or `m3-s2-complete-semantic-review-v1`; matching source, full count, selected UID and ordinal |
| `proposalFinalization.finalizationRef` | v2 exact `finalizationCommit:path`; `archive-independent-native-proposal-disposition-v1`; selected application |
| M2 v1 `proposalFinalization.finalizationRef` and `registryChangesRef` | Exact public narrow CC finalization and registry-proposal bytes; native proposal IDs, selected application, primary context and entire selected change including evidence refs |
| M2 v3 `proposalFinalization.finalizationRef` and selected `independentReviewRef` | Exact public M2 disposition and independent definition witness; selected native proposal, original item, current snapshot, primary context and complete selected add-only changes |
| Selected proposal application `independentReviewRef` | Same finalization commit; the supported independent condition/boundary witness |
| Explicit current proposal evidence refs | Same selected finalization commit; recognized registry-change, independent-disposition, condition/boundary and condition-draft metadata. The existing centroid reuse document is limited to its exact three-field legacy shape and immutable public bytes |
| `rendererProof.reviewRef` and selected `independentReviewRef` | Exact renderer review commit; the current renderer-continuity manifest and four existing independent narrow renderer/correction schemas |
| `basicScopeParentRef` | Closed current-base parent-label evidence described above |
| M2 `targetParentRef` and optional `crosswalkRef` | Exact current-base canonical master and current M2 crosswalk; ACTIVE existing PT/TPL, binding and selected native RPM context |

Original proposal selections are checked against their native review commit as Git-only references. Native `artifactRefs`, historical `reviewedInputRef`, source snapshots, image refs and other provenance fields inside immutable evidence are not general traversal instructions. This transport follows the typed edges above and the current registrar's explicit approval/item/registry evidence references; the official native validator still performs its own deeper semantic, source and renderer checks.

The raw-student-field prohibition also applies to copies of public evidence. For example, the M3 historical `source-inputs.json` contains question/answer/solution objects and cannot be uploaded by this metadata transport. When that historical file is not read by the selected production validator, a fresh request can omit the unused approval/item/registry reference while retaining the original immutable review documents and their historical provenance. Such normalization must independently pass the official registrar. The frozen original request and original review evidence are not rewritten.

Two existing metadata roles are distinguished from raw student fields. The M3 native document's exact `items[].evidenceRead.{stem,choices,answer}` slots may contain booleans only; strings, objects and numbers remain refused. An existing `archive-independent-current-figure-review-v1` document may contain a bounded textual observation at `rows[].directVisualReview.solution`. That exception requires the selected renderer role and whole-document equality with the explicit public Git object. Its original public blob must be reused by SHA; new content upload is not permitted. The closure proof lists those exact input paths, immutable commits and blob/raw hashes in `publicBlobReuse`. Newly authored or changed observation text cannot inherit the exception. Generic solution fields, markup and historical raw-source documents remain refused.

The metadata-only `archive-independent-current-renderer-review-v2` role is also recognized when selected through the existing renderer continuity proof and copied exactly from its declared public commit. It carries field and asset hashes, inspection metadata, and bounded image-container descriptors. This adds no raw student-field exception. The official renderer validator must still verify the closed V2 contract against actual native, prefigure, current-source and asset bytes; transport acceptance issues no approval.

The V3 renderer role follows the same immutable-copy requirement. A selected V3 row may reference an `archive-independent-prior-solution-renderer-review-v1` document through `prefigureRendererReviewRef`. That reference must be declared in both the item and approval, copied exactly from the same renderer review commit, and bound to the same UID and ordinal. A prior witness cannot replace the current independent witness or enter as an unselected supplementary document. Both renderer contracts remain subject to the official validator; this transport adds no approval or student-payload exception.

Add-only registry changes are metadata requests for the ordinary registrar, not direct canonical file uploads. They must have `before: null`; their path, collection, match and entire after value must exactly equal a registry proposal in the selected immutable evidence. An extra after field or a different definition fails closure even if the surrounding schema and hashes are otherwise valid. Unknown evidence schemas, author wrappers, new native-review fields absent from the declared Git object, and unsupported opt-ins fail closed. The transport does not infer support for D5, audit preservation, arbitrary source repairs, or additional native finalization versions from superficially similar fields.

### Existing M2 parent transport

These two additional parent forms are limited to explicit 2015 M2 second-semester requests. They require an `original/middle/m2/2mid` or `2final` source, `courseKey: M2-2`, the existing middle-school course label, and exact requested unit, subunit and parent labels. A different grade, semester or curriculum fails rather than being inferred from a filename or year.

`targetParentRef` accepts only the canonical master path, its raw SHA-256, curriculum, scope, major unit and mid unit, plus an optional M2 crosswalk reference. The master is read from the exact current public base, with its locked schema and complete parent tuple. Current compiled taxonomy, binding and tag-master records must contain the existing ACTIVE PT/TPL relationship and the single ACTIVE five-key curriculum/course/unit/subunit/PT binding. Parent aliases are checked against that same current context. The optional crosswalk is also current-base-only: its exact raw hash and record ID must agree with the selected immutable native item's RPM ID, ACTIVE status, curriculum, scope, PT, TPL and parent path. No caller-supplied alternative commit, family-template selection or native-parent opt-in is accepted here. These public master/crosswalk files are read in place and are not input uploads.

For `basicScopeParentRef` with `sourcePath: archive/data/question_metadata.json`, the raw hash must equal the entire current base metadata document. Each nine-field row contains only UID, source file, ordinal, curriculum key, course key, unit key, subunit key, L1 and L2. It must be the exact projection of the current approved metadata row for that UID and source ordinal, and its labels must equal the requested parent values. The document's rows must be exactly the selected items using that reference; foreign or extra rows fail. This preserves an already recorded parent and supplies no new primary classification or question approval. Subsequent official registration still checks its own current metadata and sequencing requirements.

### Explicit native rationale continuity transport

The optional `sourceReview.rationaleContinuity` has exactly one key, `schemaVersion: archive-native-rationale-continuity-v1`. With this option, the source-review object has exactly its four ordinary native-reference keys plus `rationaleContinuity`; proposal, renderer, retained-field and other profiles cannot be combined. The request must be `PARTIAL_UIDS` / `FINAL_QA`, have no registry changes, and explicitly name curriculum and curriculum key `2015`, course key `M2-2` and standard course `중2 수학` for a middle-two second-semester source. The existing closed request/item shapes continue to refuse registration modes, source rebinds and item rebinds.

The immutable native document must be `m2-s2-meta-review-v1`. Its selected item's top-level `primaryMethod` and `decisiveStep` must be nonempty strings exactly equal to the requested values, and neither field may occur in that native item's `after`, including as null. The existing native Git byte/hash, source, denominator and UID checks run first. The existing current-metadata parent closure also runs first: every selected request item must use the same exact metadata-parent reference and this option, with exactly that request's UID/ordinal inventory. A basic-parent-links document or target-parent reference cannot substitute for the current whole-metadata witness.

This transport adds no source field to the materializer and never inserts rationale into a source bank. It transports the named option for the official registrar to verify: source-field own-property absence, unchanged protected source and renderer bytes, native rationale origin, current ACTIVE definitions, typed issuance and replay remain that registrar's responsibility. Candidate inspection/build still reports `approvalEffect: NONE` and `registrationStatus: NOT_REGISTERED`.

A separately reviewed child commit may add this option and its validating production code after an ordinary candidate has been generated. In that case, keep the original input commit, manifest, generated source bytes and transport receipt unchanged. The receipt describes the original generation only; it does not claim the later option was previously checked. Record the exact child request delta and run the normal PR, official registration, replay, Consumer and native-reuse checks against the child HEAD.

### Public M2 v1 CC finalization

The supported `archive-native-proposal-finalization-v1` form has exactly `schemaVersion`, `finalizationCommit`, `finalizationRef`, `registryChangesRef` and `proposalIds`. It is limited to native M2 inline CC proposals. The selected IDs must equal the native item's proposal refs, and each native proposal must explicitly support that UID. Both evidence documents must be declared by the item and approval and be exact copies from the specified immutable public commit.

The accepted public schemas are `archive-cross-concept-narrow-definition-finalization-v1` and `archive-reviewed-cross-concept-registry-change-proposal-v1`. Their existing scope records no new full mathematical QA, REVIEW2 claim, metadata approval or difficulty judgment. The selected application must bind the exact native commit/path/hash, native item hash, UID, ordinal, exam, source, proposal IDs, unchanged reviewed primary context and resulting cross-concept list. Only `ADD_EXACT_NEW_CANONICAL_CC` is transported by this form.

The selected concept's complete add-only registry row, including `evidenceRefs`, must equal the immutable registry proposal and its finalized definition. Other concepts present in the same public document cannot enter through supplementary refs or an extra registry row. No general acceptance of historical v1 wrappers is added. The existing v2 path remains separate. A candidate can therefore distinguish existing-definition reuse from selected new CC requests without treating either category as successfully registered.

### Public M2 v3 proposal finalization

`archive-native-proposal-finalization-v3` accepts only the exact original M2 inline `CC`, `NEW_TPL` or `NEW_PT` proposal selected by document path/hash, array index, complete proposal hash, original ID, UID and ordinal. The selected ID must be the native item's sole proposal reference, and the proposal must explicitly support that UID. The native review remains unchanged.

The public `archive-independent-m2-native-proposal-disposition-v1` document must have status `NARROW_PROPOSALS_FINALIZED_REGISTRATION_PENDING`. Its selected application and the mandatory `archive-independent-m2-native-definition-finalization-v1` witness must agree on the source snapshot, renderer references, native item hash, original proposal, native after fields, ACTIVE-match record, reviewed primary tuple and exact decision. Both witnesses retain zero new mathematical QA, REVIEW2, metadata approval, difficulty judgment and source edit claims. They are copied byte-for-byte from the explicit finalization commit and must be referenced by both the request and selected item.

Only the chosen definition's complete add-only change can enter the request. A `NEW_PT` additionally binds its own paired template and exact five-key curriculum binding; sibling definitions elsewhere in the same public witness remain excluded. A `REUSE_ACTIVE` concept carries no registry insertion. Its complete definition must equal the exact public prerequisite record, but this evidence does not establish that the prerequisite has been installed. The official registrar must find the required ACTIVE definition in the current canonical state. A missing prerequisite stays a registration dependency and cannot become a second `before: null` insertion through this transport.

The default source-field allowlist remains ten fields. The manifest's named `M2_NATIVE_PROPOSAL_V3` profile adds only `problemTypeKey`, and only for an unresolved native `NEW_PT` proposal whose primary/template fields were absent or empty and whose original ACTIVE match was explicitly null with no exact bindings. The pure materializer independently rechecks the immutable native review, original M2 RPM record, independent witness, definition owner, paired template operation and all three approved registry changes before applying that field. A profile flag, newly authored request, different primary, missing witness, reused definition or arbitrary field is insufficient. Existing fields still obey their original typed request binding and before/after hash checks.

Successful inspection or construction remains `NOT_REGISTERED` with `approvalEffect: NONE`. Before publication, regenerate source and parent bindings against the actual post-prerequisite main snapshot, preserve other issued approvals affected by whole-file changes, and run the unchanged official writer, replay and Consumer gates. A local candidate built before those dependencies is a transport preflight, not a release-ready registration proof.

## Additional approval-preservation requests

`preservationRequestRefs` is an optional array of the same `{path, blobSha1, sha256}` references. It declares new inbox requests that preserve existing approval while another declared request changes source metadata in the same file. These requests are not added to the pure materializer's `requestRefs`, because they make no source-field change.

The supported preservation form is the existing v2 `FINAL_QA` request with `approval.sourceRebind: {priorReceiptRef}`. Every item has empty `before` and `after`, registry changes are empty, and the prior issued FINAL_QA receipt must already exist in the exact base tree. Its selected UID/ordinal set and whole exam denominator must match. The source file and expected after blob must equal a file in this materialization manifest. A UID cannot simultaneously belong to the new-metadata request set and the preservation request set. New prior receipts, changed approval values, source repairs and untyped preservation flags are refused. The official writer and typed Consumer still have to prove actual preservation after candidate construction.

The transport receipt records closure counts separately and always records `newApprovals: 0`. Accepted input shape and immutable provenance do not imply FINAL_QA issuance, successful registration, current Consumer approval, or deployment.

## Candidate construction

Create a new branch named `archive-meta-source-input/<materializationId>` at the input commit. The create-event workflow checks out current main and executes only that trusted code. It reads the input as immutable Git objects; it never checks out or executes the input branch.

The runner writes generated source files outside the repository, independently verifies their final hashes, and builds a candidate commit through a private Git index. It leaves the checked-out HEAD, index, tracked files, and refs untouched. The candidate removes the transient envelope and adds a metadata-only transport receipt. The receipt states `approvalEffect: NONE` and `registrationStatus: NOT_REGISTERED`.

The workflow creates `release/metadata-source-<materializationId>` only if remote main still equals the inspected base and the candidate branch is absent. The empty expected value in `--force-with-lease=refs/heads/<candidate>:` is an atomic create-only condition: it cannot replace an existing branch. No main branch is pushed, no pull request is merged, and no publication workflow is dispatched.

The create event is documented in [GitHub Actions events](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#create). Input and candidate refs are distinct so the candidate branch does not satisfy the workflow entry condition.

## Required review and registration

After the candidate reference is returned, open an ordinary pull request against main with the connected GitHub tool. Normal PR CI, source review evidence, identity checks, changed-UID Consumer checks, and existing registration contracts remain required. A successful candidate build is only a transport result. After a reviewed merge, only the existing single main registration writer may persist shared outputs and dispatch the exact registered snapshot to Pages.

If main advances before the candidate branch can be created, reissue the inputs against a newly checked base. Do not weaken exact-byte assertions or reuse a previous PASS report as proof of the new snapshot. If a referenced request points to different final source bytes, regenerate and review that request through its existing typed registration contract.

## Closed problem image repair eight — `M2_PROBLEM_IMAGE_REPAIR8_V1`

This additional profile transports the reviewed problem-image URI repair for
E017 Q4/Q5/Q9/Q18/Q20/Q23 and E023 Q6/Q10 only. E017 Q2, all other UIDs, answers,
solutions, image alt text, layout, metadata values, registries and approval
requests are outside this profile. The ordinary metadata profiles and their
`META_FIELDS`/`SOURCE_METADATA_FIELDS` remain unchanged.

The trusted current-main runner dispatches this exact profile to
`archive/tools/meta-foundation/materialize-reviewed-problem-image-repair8.mjs`.
It still requires a clean trusted checkout, an input commit whose sole parent
is that exact main, a matching create event, append-only metadata paths and
hashes, and the existing current-main lease before candidate publication.
No code is loaded from the input commit. There is no fallback for a misspelled
profile, an unsupported shape, or missing immutable evidence.

### Separate static review authority

Stage A2 is an independently published, metadata-only JSON file at
`docs/operations/m2-problem-image8-repair-20261116/independent-static-v2.json`.
Its exact thirteen top-level fields are:

- `schemaVersion`: `archive-independent-m2-problem-image-repair8-static-v2`;
- `profile`: `M2_PROBLEM_IMAGE_REPAIR8_V1`;
- distinct `producer` and `reviewer` identifiers;
- `basisReviewSha256` and `repairPlanSha256`, fixed to the reviewed R3 records;
- `priorStaticRef`: the exact five-key reference to the immutable A1 review;
- `rows`: exactly eight distinct `{key, newAssetRef, staticDecision,
  beforeSourceRef, wholeQuestionBeforeSha256, oldAssetRef}` records;
- `actualUi: "PENDING"`, `newFullMathematicalQa: false`, and zero
  `newReview2Claims`, `newMetadataApprovals`, `newDifficultyJudgments`.

Each decision must be `ACCEPTED`. Each five-key asset reference contains
`commit`, `path`, `gitBlobSha1`, `sha256`, and `bytes`. The helper reads the
immutable Git object and verifies its mode, size, Git hash and raw hash. The
closed eight-row inventory fixes both the approved new assets and the original
reviewed source/whole-question/old-asset bytes at
`61830b6cd7ef773f6d9c963142a7e95af4c48e82`. The helper replays those complete
historical JavaScript sources, checks each selected whole question digest, and
verifies each historical asset directly from Git. Reissuing an A2 wrapper
cannot change that original review context or reassign its A1 reviewer.
This profile makes no new mathematical,
difficulty, Native, REVIEW2 or metadata approval.

The published asset authority is `5ab3fd968a000c5bd169cd1f70e082469610ff60`.
The unchanged A1 review is published as
`e0c968d539ea5d76ce134c38956a32bc280989fe`, raw SHA-256
`f608d253890e072e79ed6bc4dcabfb98e9058fcfc4dc60641bf57736f8eff7fb`.
A2 is published as `8a03e198329962876dadc62149821efefecf0a02`, raw SHA-256
`3dd0395907a7e047382619832af91e898ca740c7ed712764762ee8099eec7d89`.
These are evidence references, not a source payload embedded in the input.
The detailed independent observations and student content are not recopied.

### Metadata-only input shape

The existing candidate envelope contains exactly one `inputFiles` entry,
its materialization manifest. Even an empty `preservationRequestRefs` field
is rejected for this profile. The manifest has exactly these fields:

```text
schemaVersion: archive-m2-problem-image-repair8-materialization-v1
transportProfile: M2_PROBLEM_IMAGE_REPAIR8_V1
materializationId
baseCommit
identityRef: {path, blobSha1, sha256}
staticEvidenceRef: {commit, path, gitBlobSha1, sha256, bytes}
outputScope: [exact E017 source path, exact E023 source path]
files: [
  {
    path,
    sourceBeforeRef: {commit, path, gitBlobSha1, sha256, bytes},
    after: {blobSha1, sha256},
    expectedQuestionCount,
    changes: [
      {
        key, questionUid, sourceOrdinal, wholeQuestionBeforeSha256,
        imageBefore, imageAfter,
        oldAssetRef: {commit, path, gitBlobSha1, sha256, bytes},
        newAssetRef: {commit, path, gitBlobSha1, sha256, bytes}
      }
    ]
  }
]
```

`sourceBeforeRef` describes the **current whole source container** at the exact
input base. It is not the original Native semantic authority. `oldAssetRef`
also binds the current base; its path and exact bytes must match A2's original
old asset. `newAssetRef` must equal the matching A2 row. Each selected current
whole question must equal the historical whole-question digest fixed in A2.
Rebinding B to a new current source hash does not permit a changed given,
answer, solution, metadata field or old image for any selected item. Unselected
questions may have changed in a newer base and are preserved exactly from that
base. These checks compare whole objects and retain the original distinction
between static display evidence and semantic registration authority.
Current identity bytes and the canonical UID/source ordinal lookup must agree.
An explicit legacy source UID is accepted only through the existing exact,
unambiguous legacy alias contract. Wrong UID, ordinal, source, duplicated row,
missing row, mismatched denominator, stale whole-question hash or asset fails.

The input carries only IDs, paths, URI strings and hashes. It cannot carry
source code, question/answer/solution text, SVG, base64 payloads or arbitrary
JSON extensions. Approved SVG bytes are published separately. The candidate
worker never writes or replaces an asset file.

### Source preservation and output

The materializer reads the full immutable current JavaScript, locates strict
JSON value ranges in its existing `window.questionBank` literal, and replaces
only each selected top-level `image` string. No key insertion or reformatting
is supported. Inverting those eight ranges must restore every original byte,
including comments, prefix and trailing JavaScript statements.

Both complete before and after sources are executed in separate bounded VM
contexts with string/Wasm code generation disabled. The entire resulting bank
must equal the original bank with only the selected eight image values changed.
This detects trailing assignments that override a selected image or change an
unselected field after an image change. It does not rely on literal-array-only
comparison. The current two banks contain 23 and 24 questions: eight selected
image values and 39 unselected whole questions are protected, together with
all other fields of the selected eight.

The worker writes only the two source files and its normal transport receipt.
Its candidate remains a child of the immutable input commit, with the envelope
removed as in the existing workflow. The receipt states `approvalEffect: NONE`,
`registrationStatus: NOT_REGISTERED`, and the static closure retains
`actualUi: PENDING`. An explicit publication child may reuse the eight approved
public asset blobs. Normal PR checks, fresh actual student UI review and any
separately authorized registrar continuity contract remain required. Neither
the transport receipt nor static acceptance grants Native/semantic approval.

The real-Git regression fixture reads the historical source and approved assets
as opaque immutable objects. Tests commit only their public references and
hashes; they do not embed question, answer, solution or review content. Test
assertions compare hashes so failed comparisons do not print that content.
Full-history CI must retain those exact evidence objects; absent evidence is a
fixture failure, never a skipped positive test. Negative tests cover fully
resealed current question/old-asset drift, altered historical A2 bindings,
scope, identity, reviewer separation, metadata/raw payload mixing and complete
JavaScript suffix effects.
