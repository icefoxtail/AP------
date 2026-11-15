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

### Public M2 v1 CC finalization

The supported `archive-native-proposal-finalization-v1` form has exactly `schemaVersion`, `finalizationCommit`, `finalizationRef`, `registryChangesRef` and `proposalIds`. It is limited to native M2 inline CC proposals. The selected IDs must equal the native item's proposal refs, and each native proposal must explicitly support that UID. Both evidence documents must be declared by the item and approval and be exact copies from the specified immutable public commit.

The accepted public schemas are `archive-cross-concept-narrow-definition-finalization-v1` and `archive-reviewed-cross-concept-registry-change-proposal-v1`. Their existing scope records no new full mathematical QA, REVIEW2 claim, metadata approval or difficulty judgment. The selected application must bind the exact native commit/path/hash, native item hash, UID, ordinal, exam, source, proposal IDs, unchanged reviewed primary context and resulting cross-concept list. Only `ADD_EXACT_NEW_CANONICAL_CC` is transported by this form.

The selected concept's complete add-only registry row, including `evidenceRefs`, must equal the immutable registry proposal and its finalized definition. Other concepts present in the same public document cannot enter through supplementary refs or an extra registry row. No general acceptance of historical v1 wrappers is added. The existing v2 path remains separate. A candidate can therefore distinguish existing-definition reuse from selected new CC requests without treating either category as successfully registered.

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
