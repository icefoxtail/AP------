# Reviewed source metadata candidates

This transport constructs a reviewable source candidate from existing public Git objects and a bounded JSON metadata change. It does not approve questions, register metadata, modify shared derived data, or publish the site.

## Immutable input

An input commit has exactly one parent: the current main commit. Its only differences are new metadata JSON files and `.archive-source-metadata/candidate.json`. Existing evidence cannot be overwritten. Code, workflows, source banks, images, derived data, symlinks, and student question/answer/solution fields are refused in the uploaded inputs.

The envelope uses `archive-reviewed-source-candidate-input-v1` with `materializationId`, `baseCommit`, `manifestRef`, and `inputFiles`. Every file reference contains an exact path, Git blob SHA-1, and raw SHA-256. The manifest is itself one of the listed inputs. The materialization ID is 6–81 lowercase letters, digits, or hyphens and starts with a letter or digit.

The pure materializer validates the base source, canonical identity mapping, selected request and UID, supported metadata fields, and exact resulting source bytes. It parses supported static JSON bank wrappers without evaluating input JavaScript. All nonselected fields and student-facing payloads remain byte-bound to the public base. The result must match the request's expected source blob and the manifest's before/after hashes.

## Candidate construction

Create a new branch named `archive-meta-source-input/<materializationId>` at the input commit. The create-event workflow checks out current main and executes only that trusted code. It reads the input as immutable Git objects; it never checks out or executes the input branch.

The runner writes generated source files outside the repository, independently verifies their final hashes, and builds a candidate commit through a private Git index. It leaves the checked-out HEAD, index, tracked files, and refs untouched. The candidate removes the transient envelope and adds a metadata-only transport receipt. The receipt states `approvalEffect: NONE` and `registrationStatus: NOT_REGISTERED`.

The workflow creates `release/metadata-source-<materializationId>` only if remote main still equals the inspected base and the candidate branch is absent. The empty expected value in `--force-with-lease=refs/heads/<candidate>:` is an atomic create-only condition: it cannot replace an existing branch. No main branch is pushed, no pull request is merged, and no publication workflow is dispatched.

The create event is documented in [GitHub Actions events](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#create). Input and candidate refs are distinct so the candidate branch does not satisfy the workflow entry condition.

## Required review and registration

After the candidate reference is returned, open an ordinary pull request against main with the connected GitHub tool. Normal PR CI, source review evidence, identity checks, changed-UID Consumer checks, and existing registration contracts remain required. A successful candidate build is only a transport result. After a reviewed merge, only the existing single main registration writer may persist shared outputs and dispatch the exact registered snapshot to Pages.

If main advances before the candidate branch can be created, reissue the inputs against a newly checked base. Do not weaken exact-byte assertions or reuse a previous PASS report as proof of the new snapshot. If a referenced request points to different final source bytes, regenerate and review that request through its existing typed registration contract.
