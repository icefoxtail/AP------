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

The receipt status is APPLIED_PENDING_VALIDATORS. Run materializer check, identity contract/runtime tests, registration parity and relevant semantic tests after apply. Stage only the nine declared registry files and needed evidence; reject unrelated row changes. ROOT publishes and checks remote source/assets/registry bytes and target UID sets, then uses the existing static/render MAIN_DONE helper. Canonical registration-only bot commits already use [skip ci] to prevent recursive regeneration; do not use that marker to skip source quality gates.
