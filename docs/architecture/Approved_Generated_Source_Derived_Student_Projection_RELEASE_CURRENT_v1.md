# Approved Generated Source-Derived Student Projection Release

status: CURRENT / RELEASE CONTRACT

## Lifecycle

Approved production packages and their byte-bound approval receipts are the authority for Generated student availability. The student index and Consumer rows are derived output: the Pages release rebuilds them from the checked-out source tree and includes that generated output in the same deployment artifact. A separate manual student-registration step is not part of release.

`.github/workflows/archive-pages-release.yml` runs on every push to `main` and supports `workflow_dispatch`. It checks out full history so the projection compiler can verify historical approval bindings, then runs:

1. `node archive/tools/generated-meta/auto-register-approved-qid9.mjs --write`
2. `node archive/tools/generated-meta/auto-register-approved-qid9.mjs --check`
3. `node archive/tools/generated-meta-retention-gate.cjs`
4. Focused registrar, projection, retention, and generated-mock selection tests.
5. The actual Chrome generated-bank lookup, preview, and print check.
6. The actual Chrome generated-mock QA for the complete approved cohort, including selection, preview, print, teacher answer/solution paths, and each new solution asset. Its JSON result and screenshots are saved in the run evidence artifact.
7. `node tools/check-archive2-runtime.cjs`.

Only after every gate succeeds does the workflow upload the repository root as the Pages artifact. The deploy job depends on the successful build job. A compile, completeness, metadata, test, browser, or runtime failure therefore prevents both Pages artifact upload and deployment; the existing deployed site remains available. The workflow uploads source-SHA context and logs for steps that actually ran from the runner's temporary directory as a run artifact, including on failure. These logs are kept out of the public Pages artifact; skipped checks are not represented as passing.

The compiled student projection is not committed by the Pages release. Source packages and approval receipts remain authoritative, and each release artifact contains the projection generated from its exact checked-out `main` SHA. The release check must fail if any supported approved UID is missing from the student projection. The run evidence must come from the compiler/check output and actual commands; workflow-authored counts must not substitute for those checks.

## Supported source scope

The current automatic approval compiler is scoped to the QID9 production package and manifest format handled by `auto-register-approved-qid9.mjs`. It does not establish automatic support for every Generated, textbook, or other problem-bank source format. Extend the source adapter and its approval-binding checks before declaring another source family releasable through this path.

## Deployment setup and URL contract

The repository Pages build source must be configured as **GitHub Actions** for this workflow to deploy. The workflow uploads the repository root and preserves the existing static route and asset layout, including the repository's `.nojekyll` marker. Existing stable exam URLs and browser-storage behavior remain governed by their current runtime contracts. Pages deployment does not rewrite approved source packages or receipts.
