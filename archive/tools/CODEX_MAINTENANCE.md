# Codex capture and scoped registration tools

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
