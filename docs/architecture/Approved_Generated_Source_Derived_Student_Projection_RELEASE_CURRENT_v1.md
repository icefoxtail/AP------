# Generated Source-Derived Student Projection Release

status: CURRENT / RELEASE CONTRACT

## Lifecycle

Main-resident Generated Lite question JS and its metadata sidecars are the source authority for technical student availability. Review and approval fields remain item history and product-specific quality evidence; they do not decide whether a main-resident source row can be searched or selected. The student index and Consumer rows are derived output: the Pages release rebuilds them from the checked-out source tree and includes that generated output in the same deployment artifact. A separate manual student-registration step is not part of release.

`.github/workflows/archive-pages-release.yml` runs on every push to `main` and supports `workflow_dispatch`. It checks out full history so the projection compiler can verify historical approval bindings, then runs:

1. `node archive/tools/generated-meta/auto-register-approved-qid9.mjs --write` and `--check` compile and verify the supported QID9 approved source packages and receipts. The compiler runs the strict Meta-retention audit over that exact approved UID roster.
2. `node archive/tools/generated-meta/rebuild-main-source-consumer.mjs --write` and `--check` derive the complete Consumer index from every main-resident Generated Lite question JS and metadata sidecar, preserving main-source rows whose review history is pending or otherwise not approved.
3. Focused approved-roster Meta, source projection, source availability, and generated-mock selection tests. The global strict Meta-retention audit remains available for its original all-approved scope; it is not used to hide or exclude technically valid main-source rows whose approval state is independent.
4. Actual Chrome checks for Palma student lookup, preview, and print and for the incoming Geumdang source output.
5. Actual Chrome generated-mock QA for the complete approved Palma cohort, including selection, preview, print, teacher answer/solution paths, and each new solution asset. Its JSON result and screenshots are saved in the run evidence artifact.
6. `node tools/check-archive2-runtime.cjs`.

Only after every gate succeeds does the workflow upload the repository root as the Pages artifact. The deploy job depends on the successful build job. A compile, completeness, metadata, test, browser, or runtime failure therefore prevents both Pages artifact upload and deployment; the existing deployed site remains available. The workflow uploads source-SHA context and logs for steps that actually ran from the runner's temporary directory as a run artifact, including on failure. These logs are kept out of the public Pages artifact; skipped checks are not represented as passing.

The compiled student projection is not committed by the Pages release. Source packages and approval receipts remain authoritative, and each release artifact contains the projection generated from its exact checked-out `main` SHA. The release check must fail if any supported approved UID is missing from the student projection. The run evidence must come from the compiler/check output and actual commands; workflow-authored counts must not substitute for those checks.

## Supported source scope

Main-source availability projection is scoped to the Generated Lite question JS and metadata format handled by `rebuild-main-source-consumer.mjs`; it does not certify semantic review, advanced Meta quality, Factory eligibility, or approval. Automatic approval and its byte-bound receipt checks remain scoped to the QID9 production package and manifest format handled by `auto-register-approved-qid9.mjs`. Other Generated, textbook, or problem-bank source families need an explicit source adapter before they are included in this projection.

## Deployment setup and URL contract

The repository Pages build source must be configured as **GitHub Actions** for this workflow to deploy. The workflow uploads the repository root and preserves the existing static route and asset layout, including the repository's `.nojekyll` marker. Existing stable exam URLs and browser-storage behavior remain governed by their current runtime contracts. Pages deployment does not rewrite approved source packages or receipts.
