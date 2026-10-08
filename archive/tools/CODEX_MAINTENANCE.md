# Codex capture and scoped registration tools

## 2026-10-08 — Handoff and notation preflight

Use [CODEX_HANDOFF.md](CODEX_HANDOFF.md) for the ROOT-side `archive-codex-handoff.mjs` commands. They bind explicit absolute assignments, canonical reviewer IDs, real asset-parent directories, immutable freezes and actual validator process output. Verified completion acceptance releases the dispatcher slot and returns the next roster plan together. ROOT still performs agent dispatch and publication; the helper does not keep a chat running after its turn ends.

`prepare-student` extracts student fields and asset dependencies from the actual current source. `scope-plan` preserves the old freeze identity and checks exact outside-scope student/asset parity; it emits a review plan, not a mathematical verdict. R1/R2 original freezes can be reused after source-byte changes only when the frozen and current student inputs remain valid. R3 targeted rows remain distinct from full artifact dispositions. Completed historical exams are not revalidated just to adopt these commands.

The one-shot validator capture preserves stdout, stderr and exit status together. File-only report inspection establishes schema and physical binding, not proof that the validator process ran. Mathematical mismatches, unresolved reviews and item HOLDs remain worker/ROOT decisions and cannot become PASS through this helper.

CREATE also uses the read-only [notation preflight](CREATE_TEX_PREFLIGHT.md) to flag unpaired math delimiters and bare TeX commands in content, solution and supported choice-object text fields. These findings require source/worker review; source text, choices and layout are never automatically rewritten. Actual Archive Engine render remains required under the current contract.

## CREATE preflight, immutable freeze, and stable completion

`archive-create-preflight.mjs --exam <current-js> --evidence <draft-evidence>` reports actual item HOLD counts/reasons, missing TeX command backslashes inside math, bare math environments, and explicit simple final-value/choice-marker inconsistencies. `REVIEW_REQUIRED` requires the stage worker's source/math review; it never rewrites source or solves a question. A reasoned genuine HOLD is `CARRY_ITEM_HOLD`, preserving the CREATE→R1→R2 recovery path. R3 artifact validation rejects remaining `itemStatus:HOLD`. Initial preflight is separate from the one normal end-of-stage generic validator.

```powershell
node archive/tools/archive-codex-stage-kit.mjs bind --root . --exam <current-js> --evidence <draft.json> --reviewed-source-sha <current-raw-sha256> --production-path <final-production-js> --output <fresh-bound.json>
node archive/tools/archive-codex-stage-kit.mjs freeze --root . --stage R1 --reviewer <actual-session-id> --bundle <current-student-only.json> --expected-source-sha <assignment-current-raw-sha256> --answers <independent-answers.json> --asset-reads <actual-opened-assets.json> --output <fresh-original-freeze.json>
node archive/tools/archive-codex-stage-kit.mjs adjudicate --root . --freeze <original-freeze.json> --corrections <qid-corrections.json> --output <fresh-adjudication.json>
```

`bind` computes raw SHA-256, official raw-buffer Git blob SHA-1, optional production-path clean-filter SHA-1, and each existing row's actual solution hash. It lifts `smallBoardContinuityStatus` only when that exact reviewed field already exists in a supported nested solution-layout record. Missing review fields remain missing; no quality verdict, Meta approval or new row is manufactured. Rebinding a different artifact requires the worker's explicit current reviewed raw SHA. Outputs require fresh paths.

R1/R2 pre-freeze use only `freeze`, the safe current student bundle, and actually opened student assets. `bind`, preflight and raw-JS-based `seal` are forbidden before blind freeze. Answers use `{qid, independentAnswer, reasoning}` rows covering the complete current qid set. Asset acknowledgements use `{ref, sha256, opened:true}` after real inspection. Freeze writes exclusively and cannot overwrite; token/calculation/time corrections are separate adjudication files referencing the original bytes/SHA. This does not replace clean affected-scope review when a freeze is genuinely invalidated.

After all mandatory evidence is final, run the normal V2/CODEX generic validator once. Its `technicalBinding` hashes actual source/evidence/asset bytes. Then seal the stable handoff:

```powershell
node archive/tools/archive-codex-stage-kit.mjs seal --root . --stage R1 --reviewer <actual-session-id> --exam <current-js> --evidence <final-evidence.json> --report <actual-raw-generic.json> --asset-root <assets-parent> --next-roster <next-examUid-or-NONE> --proof <other-required-proof> --output <fresh-complete-event.json>
node archive/tools/archive-codex-stage-kit.mjs verify-complete --root . --event <complete-event.json> --event-sha <worker-returned-event-sha256>
node archive/tools/archive-codex-stage-kit.mjs intake --root . --state <current-stage-state.json> --event <complete-event.json> --event-sha <worker-returned-event-sha256> --output <fresh-root-intake.json>
```

The completion event returns next stage, freed slot and next roster together. ROOT verifies its delivered SHA and all bound files before freeing/routing the slot. Any post-PASS source/evidence/asset/report/declared-proof mutation invalidates the event; the same worker must preserve old proof, make the necessary correction/revalidation and seal a fresh event. Optional evidence refinements are completed before normal validation. Sealing stage PASS never asserts actual render PASS or MAIN_DONE; R3 actual render and existing publication/waiver gates remain separate. Historical valid unchanged receipts can follow the existing reuse path without rerunning quality solely to obtain the new event format.

Git remote byte readback uses one revision's tree object IDs and `cat-file blob`, with a 128 MiB buffer, so deep Unicode evidence paths do not become Windows revision:path filename-stat failures.

## Cross-run workflow upgrade — 2026-10-08

The current readback reader now resolves one tree and uses bounded `cat-file --batch` chunks (64 MiB aggregate, 128 MiB maximum individual blob), de-duplicates object reads, checks object type/id/size/content, binary lengths and trailing bytes. `readGitObjects` is batched; canonical normal/waived closeout paths preload their required references. It does not drop files or loosen SHA checks.

### Student bundle compatibility and disclosure

`archive-student-bundle.mjs` accepts the existing `questions[].requiredAssets` and native `rows[].student/assets` forms. It preserves original strings, object choices (including the display alias `answer` inside a choice), shared material and `__apExamSubjectiveSpacing`; unknown fields fail rather than disappear. Target-level answer/solution/Meta fields are forbidden. Full qid order/denominator, source SHA, asset bytes and SVG dependencies are checked. Original bundles and freezes are never rewritten.

```powershell
node archive/tools/archive-student-bundle.mjs --input <old-or-native-student.json> --expected-source-sha <assignment-current-raw-sha256> --output <fresh-adapted.json>
node archive/tools/archive-codex-stage-kit.mjs postfreeze --root . --exam <current-js> --bundle <original-student-bundle> --freeze <immutable-original-freeze> --freeze-sha <original-freeze-sha> --qids <explicit-qid-csv> --output <fresh-disclosure.json>
```

The freeze CLI adapts either bundle directly and requires `--expected-source-sha`. Postfreeze verifies original freeze/bundle binding and full current student parity before releasing only requested stored fields. Meta-only raw-source changes are allowed only with exact student parity; a changed student body fails for affected fresh-review routing, never by attaching a new SHA to an old bundle. Original calculation/token adjudications remain separate records.

Only declared `currentAssetBindings:[{kind:'CURRENT_ASSET',ref,sha256}]` are supported by physical asset rebinding. A changed hash requires `bind --asset-root <parent> --reviewed-assets <reviewed-current-assets.json>` with exact `{ref,sha256,reviewed:true}` acknowledgement. Historical freeze/review/authority hashes are not traversed or replaced; before/after hashes are retained. This is not a new visual quality approval.

### Canonical unit order early check

CREATE preflight reads the actual `JS아카이브_표준단원키_마스터테이블.md` L1 rows and binds its SHA. A known key with a different order is reported before downstream stages; unknown/ambiguous authority is flagged, never inferred from a numeric suffix or silently corrected. `REVIEW_REQUIRED` still needs the worker's current source/Meta decision. The public `loadUnitOrders`/`inspectUnitOrders` API can be used by registration/bootstrap checks without changing source.

### Existing registered targets: explicit separate update route

New import `register-target-exam.mjs` still refuses an already registered target. For an existing target, supply a canonical candidate root and assignment-bound `JS_ARCHIVE_CURRENT_STAGE_PROOF_SET_V1` containing exact current R1/R2/R3 evidence path/raw SHA, source identity and original proof refs. The current validators must accept those proofs; arbitrary caller PASS/hash lists are insufficient.

```powershell
node archive/tools/prepare-existing-target-registration-update.mjs --root <root> --assignment <assignment> --candidate-root <candidate-root> --proof-manifest <proof-set> --output .tmp/archive/<runId>/<examUid>/registration-update.json
node archive/tools/register-existing-target-exam-update.mjs --root <root> --assignment <assignment> --plan <registration-update.json> --plan-sha256 <emitted-plan-sha> --candidate-root <candidate-root> --proof-manifest <proof-set> --output-dir .tmp/archive/<runId>/<examUid>/registration-merge
```

Default is dry-run; ROOT adds `--apply` explicitly. All nine baselines, source/assets/proofs/HEAD, full ordinal/UID joins and target runtime tuples are bound. Non-target rows are deep-preserved; output JS parses before writes; rollback touches only writes this operation started. Actual physical Meta corrections require the exported `TARGET_META_DELTA_POLICY` allowlist, current qid-level R1 META PASS and exact current source parity. Changed target runtime approval/field states are reset to pending/non-selectable, not inherited or promoted. The old target metadata and proofs remain preserved. This runtime pending state is distinct from source item HOLD. Run normal post-apply registration validation and remote readback.

### Publication checkpoints and Root dispatcher

`archive-publication-checkpoint.mjs create|plan|record` persists fresh immutable checkpoints. Bound command completion/exit/stdout/stderr proofs are required before commit readiness. Failed/running checks block progression. Commit, push, readback and MAIN_DONE are recorded from actual ROOT operations; no Git action is executed by the planner. Unrelated main drift permits an explicit preserved rebind plan; overlapping target inputs fail for affected review. It never automatically force-replays or overwrites current main.

`archive-codex-dispatcher.mjs init|plan|claim|resume|accept` uses a locked roster, state SHA/lock, one exam per stage, FIFO/fresh sessions and existing-session repairs. Only verified sealed events release slots and yield the next routing plan; stage duration is recorded. Plans expose Root roster references, not answer-bearing worker packets. ROOT still builds stage-safe absolute packets and performs actual spawns/Git/publication. R3 completion goes to `ROOT_PUBLICATION` with actual render/waiver gates still required, not automatic MAIN_DONE.

### Conversion cache

`archive-preview-cache.mjs get|store --root <root> --cache-root .tmp/archive/<runId>/<examUid>/preview-cache --source <pdf-or-svg> --parameters <full-transform-parameters.json> --tool-version <converter-version> [--preview <actual-converted-file>]` caches only byte-verified preview output. The key includes input SHA, all page/DPI/crop/font/backend parameters and tool version. Misses use the existing approved converter; an output SHA change fails. Cached output still requires actual reviewer opening; no source/visual/render PASS is inferred. Cache is scoped to assigned temporary exam paths, not generated paths.

Finished exams keep their valid original receipts. Apply these tools to new or actually changed stages; no historical revalidation or retroactive conversion solely for this upgrade.

These tools prepare machine evidence and target-only registration. They do not solve questions, approve Meta, review screenshots, publish, or declare MAIN_DONE.

## Capture capability before CREATE

```powershell
node archive/tools/capture-codex-exam.mjs --root . --output .tmp/archive/<runId>/<examUid>/preflight --node-modules <bundled-node_modules> --preflight
```

Use the dependency runtime returned by Codex load_workspace_dependencies; no installation or custom browser protocol is required. The existing canonical Playwright/Chrome machine collector backend runs an isolated headless Chrome, not the user's browser profile. Preflight actually writes a PNG at a 390x844 viewport. Failures remain CAPTURE_BLOCKED with their reason; they do not become render PASS or trigger a security bypass.

## Six-case actual machine capture

```powershell
node archive/tools/capture-codex-exam.mjs --root . --exam <assigned-js> --asset-root <assets-parent> --output .tmp/archive/<runId>/<examUid>/capture-01 --node-modules <bundled-node_modules>
```

The unmodified official archive/engine.html loads the assigned candidate through a loopback-only virtual final-basename route, with its production-relative assets mapped to the assigned asset root. Exam/sol/ans each run at desktop 1280x1000 and mobile 390x844. Browser response bytes are hashed; every case records actual image decode, MathJax, source-backed denominator, full-page browser PNG and viewport. Cases and the report remain CAPTURED_REVIEW_REQUIRED. A fresh output directory is required for every attempt.

R3 must open and review the actual PNGs, including all qids/last item, clipping, overflow, readability and equation flow. The review JSON uses schema JS_ARCHIVE_CODEX_R3_CAPTURE_REVIEW_V1, captureReportSha256, artifactSha, reviewerIdentity {role:archive_r3, reviewerId}, and six cases with id, reviewedQids, reviewedCaptureSha256s and layoutReviewStatus/mathJaxStatus/assetDecodeStatus=PASS. Missing review, changed hashes or a failed case cannot create PASS.

```powershell
node archive/tools/build-codex-render-receipt.mjs --root . --capture <machine-capture.json> --review <R3-review.json> --r3-validation <raw-R3-report.json> --output <fresh-receipt.json>
```

This builder consumes the existing canonical render validator. Promote/rebind identical temporary bytes to durable production/evidence paths before MAIN_DONE; preserve original captures and hashes. ROOT accepts receipts; R3 owns screen judgment. If capture is genuinely blocked, existing §25 waiver contracts remain unchanged.

## Target-only registration

Generate candidate registration artifacts in an isolated assigned .tmp package using the existing canonical generators. Never apply a full generated set just to register one exam. The generator may reveal unrelated stale-source/fingerprint failures; preserve them rather than repairing unrelated rows or weakening tests.

```powershell
node archive/tools/prepare-target-registration.mjs --root . --assignment <absolute-assignment-as-root-relative-path> --candidate-root <isolated-candidate-root> --output .tmp/archive/<runId>/<examUid>/registration-package.json
node archive/tools/register-target-exam.mjs --root . --assignment <assignment> --proposal <registration-package.json> --catalog-candidate <candidate-root>/archive/data/archive2-catalog.json --evidence-root <assigned-evidence>
node archive/tools/register-target-exam.mjs --root . --assignment <assignment> --proposal <registration-package.json> --catalog-candidate <candidate-root>/archive/data/archive2-catalog.json --evidence-root <assigned-evidence> --apply
```

The default is validated dry-run. Explicit apply requires exact HEAD, source/asset SHA, candidate catalog SHA, all nine baseline file bindings, dynamic source question count, one target file, unique ordinal/UID joins and non-target deep invariance. Baseline runtime file indices, tuples and catalog dictionary IDs remain stable. Failures restore exact original registry bytes. An already registered target is rejected rather than silently replaced. No semantic field/review status is promoted by this operation.

### Bounded target-only canonical candidate producer

When a global canonical generator cannot produce candidate rows because unrelated tracked paths fail its global source/DB parity gate, use `prepare-target-registration-candidate.mjs` only for a ROOT-authorized fixed-roster row. It consumes the SHA-bound authority and roster, current final production bytes, and explicit safe `--r1-evidence` and `--r1-validation` paths. The assignment binds both input files with `r1EvidenceSha256` and `r1ValidationSha256`; path fields `r1EvidencePath` and `r1ValidationPath` are also checked when supplied. The validation receipt must be an R1_V2 PASS for the exact evidence reference, artifact blob, and denominator, and the current shared R1 validator is run against the supplied evidence. Per-qid META approval is read from supported existing R1 row fields only; no verdict is synthesized. It formats DB display aliases from the locked UID/roster, copies unit/range values from the R1-approved embedded Meta, derives canonical qid-v1 identity/fingerprints, generates the one-target question index through the canonical index CLI in a one-source isolated archive, and runs the existing Archive 2 catalog generator on an isolated copy of the nine current registry baselines plus the target. It does not assign topic, subunit, PT/TPL, or new semantic-review status.

For ROOT-admitted `VALID_UNCHANGED_SCOPE_REUSE`, pass the ROOT-authored `--r1-reuse-manifest` instead of current R1 evidence flags. The assignment binds the manifest SHA and the exact raw SHA-256 of each historical R1, current R3, reuse-assessment, MAIN_DONE, intake, and render proof file. The adapter preserves historical R1 artifact identities and checks its recorded clean-LF evidence digest separately from the raw file SHA. It requires the current R3 validator PASS, all-current-qid metadata dispositions, unchanged Meta scope, ROOT's current MAIN_DONE reuse-intake PASS, and the existing render-receipt validator PASS before using the historical R1 metadata proof for the byte-bound current source. It does not re-enter qualification or rewrite historical proof SHA values.

```powershell
node archive/tools/prepare-target-registration-candidate.mjs --root . --authority archive/analysis/<runId>/technical-meta-projection-gap/ROOT.target-registration-producer-authority.json --roster archive/analysis/<runId>/roster.json --roster-index <fixed-zero-based-index> --assignment .tmp/archive/<runId>/<examUid>/registration.assignment.json --r1-evidence <exact-root-relative-current-R1-evidence-path> --r1-validation <exact-root-relative-R1-V2-validation-report> --candidate-root .tmp/archive/<runId>/<examUid>/registration-canonical-root --index-root .tmp/archive/<runId>/<examUid>/registration-index-root --evidence-root archive/analysis/<runId>/technical-meta-projection-gap/registration/<examUid> --package-output .tmp/archive/<runId>/<examUid>/registration-package.json

# ROOT-admitted unchanged-scope reuse row
node archive/tools/prepare-target-registration-candidate.mjs --root . --authority archive/analysis/<runId>/technical-meta-projection-gap/ROOT.target-registration-producer-authority.json --roster archive/analysis/<runId>/roster.json --roster-index <fixed-zero-based-index> --assignment .tmp/archive/<runId>/<examUid>/registration.assignment.json --r1-reuse-manifest archive/analysis/<runId>/technical-meta-projection-gap/ROOT.current-registration-r1-path-manifest.json --candidate-root .tmp/archive/<runId>/<examUid>/registration-canonical-root --index-root .tmp/archive/<runId>/<examUid>/registration-index-root --evidence-root archive/analysis/<runId>/technical-meta-projection-gap/registration/<examUid> --package-output .tmp/archive/<runId>/<examUid>/registration-package.json
```

The producer calls `prepare-target-registration.mjs`, then `register-target-exam.mjs` without `--apply`; it must finish with `PLAN_VALIDATED_NOT_APPLIED`. It binds current production raw SHA/Git blob SHA, R1 full-qid META PASS, authority/roster SHA, source count, all nine current baseline hashes, and writes stdout/stderr/exit evidence under the assigned evidence root. It rejects dirty non-baseline files in a reused candidate root and preserves prior attempts. ROOT later performs one target apply at a time after the complete fixed roster is production-ready; regenerate each target package against the current nine-file baseline after every prior apply. Never run this producer against `archive/_generated` history or use it to bypass a failed target's required R1/R2/R3 closure.

The receipt status is APPLIED_PENDING_VALIDATORS. Run materializer check, identity contract/runtime tests, registration parity and relevant semantic tests after apply. Stage only the nine declared registry files and needed evidence; reject unrelated row changes. ROOT publishes and checks remote source/assets/registry bytes and target UID sets, then uses the existing static/render MAIN_DONE helper. Canonical registration-only bot commits already use [skip ci] to prevent recursive regeneration; do not use that marker to skip source quality gates.
