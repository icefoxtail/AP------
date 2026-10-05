# Jeilgo 2025 Generated Artifact Git Policy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Keep regeneratable 2025 제일고 pipeline outputs out of Git while making every production JS/image/SVG change visible and auditable.

**Architecture:** Preserve the existing archive/_generated/ and alive/runtime/ generated roots. Remove extension-wide image ignores, add a small Node policy checker for real production references and generated roots, and use a temporary Git repository test for new-asset trackability. Untrack only generated-only files proven rebuildable; do not migrate pipeline output paths or touch unrelated dirty work.

**Tech Stack:** Git, PowerShell, Node.js 22 built-ins (node:test, node:fs, node:path, node:child_process, node:vm), existing Past Exam V3/pipeline-core validators.

**Spec:** docs/superpowers/specs/2026-09-15-jeilgo-generated-artifact-policy-design.md

## Global Constraints

- Preserve the existing modified, staged, and untracked worktree files exactly.
- Never run git add ., git add -A, git stash, git reset, git clean, git checkout -- ., git restore ., or broad generated-directory deletion.
- Keep archive/exams/ production JS and archive/assets/images/ production assets trackable regardless of extension.
- Ignore generated locations, not *.js, *.json, *.html, *.txt, *.png, *.jpg, *.jpeg, *.gif, or *.svg globally.
- Treat archive/_generated/ and alive/runtime/ as evidence/runtime workspaces, not production or canonical authority.
- Use the current Past Exam V3 contract, pipeline-core contracts, and docs/rules/MANIFEST.md as authorities.
- Stage only exact files changed by this task and make one independent commit.

### Task 1: Reconfirm baseline and map generated consumers

Files:
- Read: .gitignore
- Read: docs/rules/00_RULES_INDEX.md
- Read: docs/rules/MANIFEST.md
- Read: docs/rules/02_PIPELINES/Past_Exam_V3_COMPLETE.md
- Read: archive/tools/past-exam-pipeline/README.md
- Read: archive/tools/pipeline-core/README.md
- Read: archive/tools/logic-visual-audit/README.md
- Read: archive/db.js
- Read: archive/question-index.js
- Read: archive/exams/original/high/h1/2final/25_제일고_2학기_기말_고1_기출.js

Interfaces:
- Consumes: the approved design and the fetched origin/main ref.
- Produces: a read-only inventory of exact production JS/assets, generated roots, tracked report candidates, and the current status baseline.

- [ ] Step 1: Verify the checkout boundary.

Run:

    git rev-parse --show-toplevel
    git rev-parse --git-dir
    git rev-parse --git-common-dir
    git branch --show-current

Expected: the repository is C:/Users/USER/Desktop/AP------, git-dir equals
git-common-dir, and the current branch is codex/jeilgo25-archive-exam. Work in
place because the approved design explicitly preserves the shared dirty checkout.

- [ ] Step 2: Record a fresh status baseline without changing the worktree.

Run:

    $tracked = @(git ls-files).Count
    $modified = @(git diff --name-only).Count
    $staged = @(git diff --cached --name-only).Count
    $untracked = @(git ls-files --others --exclude-standard).Count
    $ignored = @(git ls-files --others -i --exclude-standard).Count
    [pscustomobject]@{tracked=$tracked; modified=$modified; staged=$staged; untracked=$untracked; ignored=$ignored} | ConvertTo-Json -Compress
    git status --short --untracked-files=all

Expected: the three pre-existing dirty paths remain present and no task file has
been staged.

- [ ] Step 3: Recheck upstream and branch containment.

Run:

    git fetch origin
    git rev-parse HEAD
    git rev-parse refs/remotes/origin/main
    git rev-list --left-right --count HEAD...origin/main
    git log --oneline origin/main..HEAD
    git log --oneline HEAD..origin/main

Expected: no branch-only commit exists before this task, and the fetched
origin/main identity is recorded for the final report.

- [ ] Step 4: Inventory the 2025 제일고 production family and generated run.

Run:

    git -c core.quotepath=false ls-files | Where-Object { $_ -match '제일고' }
    Get-ChildItem -Force -Recurse -File archive/_generated/past-exams/20260913_25_제일고_h1_2final | Measure-Object
    git -c core.quotepath=false ls-files archive/_generated archive/exams/_generated alive/runtime archive/tools/logic-visual-audit/reports

Expected: production/archive assets are tracked, the representative generated run
is present locally, and tracked generated entries are explicitly counted for the
later index-only cleanup. The five provider-bridge source modules are the only
allowed tracked entries below alive/runtime/provider-bridge.

- [ ] Step 5: Identify generated-only tracked report candidates.

Run:

    git -c core.quotepath=false ls-files archive/tools/logic-visual-audit/reports/v1-blind-review-input
    git -c core.quotepath=false ls-files archive/tools/logic-visual-audit/reports/v1-source-only
    git -c core.quotepath=false ls-files archive/tools/logic-visual-audit/reports/v2-artifact-only
    git -c core.quotepath=false ls-files reports | Where-Object { $_ -match '제일고|jeil|2025' }

Use the producer scripts and README to confirm that the three logic-visual bundle
directories are generated evidence. Do not untrack any file outside an exact
generated-only boundary until the consumer search is complete.

### Task 2: Write and run the policy test in RED

Files:
- Create: tests/archive-generated-artifact-git-policy.test.mjs
- Read: .gitignore

Interfaces:
- Consumes: the real .gitignore and the future exports from tools/archive/check-generated-git-policy.mjs.
- Produces: a failing test proving the global extension-ignore policy is not yet compliant and specifying the checker API.

- [ ] Step 1: Write the failing test file before the checker.

The test imports auditGeneratedRoots, auditProductionAssets,
extractProductionAssetRefs, and loadProductionExam from
tools/archive/check-generated-git-policy.mjs. It must cover these behaviors:

    Read .gitignore and assert that the five exact lines *.png, *.jpg, *.jpeg, *.gif, and *.svg are absent.
    In a temporary Git repository containing the real .gitignore, create archive/assets/images/smoke/new.svg, archive/assets/images/smoke/new.png, archive/_generated/smoke/new.svg, and archive/_generated/smoke/new.png. Assert that only the two production paths appear in git status.
    Load archive/exams/original/high/h1/2final/25_제일고_2학기_기말_고1_기출.js, assert examTitle is 25_제일고_2학기_기말_고1_기출, assert at least one asset reference, and assert auditProductionAssets(...).errors is empty.
    Assert auditGeneratedRoots({ root: repositoryRoot }).errors is empty.

Use node:test, node:assert/strict, node:fs, node:os, node:path, and
node:child_process. Delete the temporary repository in a finally block.

- [ ] Step 2: Run the test and verify the expected RED state.

Run:

    node --test tests/archive-generated-artifact-git-policy.test.mjs

Expected: FAIL because the checker module does not exist and the current
.gitignore still contains extension-wide image rules. Do not implement the
checker before observing this failure.

### Task 3: Implement the minimal production policy checker

Files:
- Create: tools/archive/check-generated-git-policy.mjs
- Test: tests/archive-generated-artifact-git-policy.test.mjs

Interfaces:
- Consumes: repository root, explicit production JS paths, and the current Git index/ignore rules.
- Produces: deterministic gate results for production asset references and generated roots.

- [ ] Step 1: Implement the exact exported API used by the RED test.

Implement these exports with Node built-ins only:

    export const DEFAULT_GENERATED_ROOTS = [
      'archive/_generated',
      'archive/exams/_generated',
      'alive/runtime',
      'archive/tools/logic-visual-audit/reports'
    ];

    export function extractProductionAssetRefs(source);
    export function loadProductionExam(root, repoRelativePath);
    export function auditProductionAssets({ root, productionPaths });
    export function auditGeneratedRoots({ root, generatedRoots = DEFAULT_GENERATED_ROOTS });
    export function runPolicyAudit({ root, productionPaths, generatedRoots });

Evaluate production JS in a node:vm context containing only window, and return
sorted { questionId, field, ref } rows for image and solutionImage. Resolve
archive-relative references under archive/, use POSIX repository paths for Git
commands, require every asset to exist and be tracked, and call
git check-ignore --no-index -q so tracked assets are also checked against current
ignore rules. Generated roots must have zero tracked files except the five
explicitly allowed provider-bridge source modules; an absent optional root is an
empty result, not a failure.

The CLI accepts repeated --exam <repository-relative-js-path> and --jeilgo
(which discovers tracked archive/exams/** JS files containing 제일고). It prints
deterministic JSON and exits 1 when a hard gate fails.

- [ ] Step 2: Run the focused test after the implementation exists.

Run:

    node --test tests/archive-generated-artifact-git-policy.test.mjs

The source-loading and generated-root portions may pass before the ignore edit;
the complete suite becomes GREEN only after Task 4 removes the extension-wide
rules.

### Task 4: Narrow .gitignore and publish the durable policy

Files:
- Modify: .gitignore
- Create: docs/rules/02_PIPELINES/GENERATED_ARTIFACT_GIT_POLICY_v1.md
- Modify: docs/rules/00_RULES_INDEX.md
- Modify: docs/rules/MANIFEST.md
- Test: tests/archive-generated-artifact-git-policy.test.mjs

Interfaces:
- Consumes: the approved design and the current generated roots.
- Produces: a path-based Git policy and a manifest-registered canonical operating document.

- [ ] Step 1: Remove only unsafe global image extension rules.

Delete the exact global lines *.jpg, *.jpeg, *.gif, and *.svg. Delete the
redundant archive/assets/images/**/*.png, *.jpg, and *.jpeg block only after
confirming that !archive/assets/images/** remains effective. Preserve
textbook-specific generated-image rules and unrelated local cache rules.

- [ ] Step 2: Keep one documented generated-root block.

Ensure .gitignore contains the following path rules and a comment explaining that
generated files remain locally available but are not production inputs:

    # Archive pipeline evidence/runtime workspaces; production assets stay visible.
    /archive/_generated/
    /archive/_generated/**
    /archive/exams/_generated/
    /archive/exams/_generated/**
    /alive/runtime/
    /alive/runtime/**

Keep narrower textbook and review workspace rules where their scope is proven.
Do not reintroduce extension-wide ignores.

- [ ] Step 3: Write the canonical policy document.

Document the five classifications, generated-root boundary, explicit staging rule,
production asset gate, A/B/C/D smoke cases, and relationship to
Past_Exam_V3_COMPLETE.md. State that generated evidence is still created and
consumed by validators but is not a canonical production artifact.

- [ ] Step 4: Recompute and update the rules manifest.

Run:

    $path = 'docs/rules/02_PIPELINES/GENERATED_ARTIFACT_GIT_POLICY_v1.md'
    $bytes = (Get-Item -LiteralPath $path).Length
    $sha = (Get-FileHash -Algorithm SHA256 -LiteralPath $path).Hash.ToLower()
    "$bytes $sha $path"

Add one entry to docs/rules/MANIFEST.md with the exact byte count and SHA-256,
update the changed 00_RULES_INDEX entry, then recompute every pre-existing
manifest entry and confirm none drifted.

- [ ] Step 5: Run the focused policy test to GREEN.

Run:

    node --test tests/archive-generated-artifact-git-policy.test.mjs

Expected: all policy tests pass and no pre-existing dirty path changes.

### Task 5: Audit and untrack proven regeneratable evidence

Files:
- Modify index only for exact generated files under archive/tools/logic-visual-audit/reports/v1-blind-review-input/
- Modify index only for exact generated files under archive/tools/logic-visual-audit/reports/v1-source-only/
- Modify index only for exact generated files under archive/tools/logic-visual-audit/reports/v2-artifact-only/
- Modify index only for exact generated files under archive/_generated/
- Modify index only for exact runtime evidence files under alive/runtime/
- Modify index only for the five exact 2025/제일고 generated files under reports/
- Modify: .gitignore if the generated-only report boundary is not already narrow enough
- Test: tests/archive-generated-artifact-git-policy.test.mjs

Interfaces:
- Consumes: Task 1 producer/consumer inventory and Task 3 policy reports.
- Produces: local evidence preserved on disk but removed from the Git index only where rebuildability and generated-only ownership are proven.

- [ ] Step 1: Verify all generated-only boundaries and the source exception.

Run:

    rg -n --hidden -g '!node_modules/**' -g '!archive/_generated/**' -g '!alive/runtime/**' 'v1-blind-review-input|v1-source-only|v2-artifact-only' archive/tools/logic-visual-audit docs tests
    git -c core.quotepath=false ls-files archive/tools/logic-visual-audit/reports/v1-blind-review-input | Measure-Object
    git -c core.quotepath=false ls-files archive/tools/logic-visual-audit/reports/v1-source-only | Measure-Object
    git -c core.quotepath=false ls-files archive/tools/logic-visual-audit/reports/v2-artifact-only | Measure-Object
    git -c core.quotepath=false ls-files archive/_generated | Measure-Object
    git -c core.quotepath=false ls-files alive/runtime | Where-Object { $_ -notmatch '^alive/runtime/provider-bridge/(auditor-output-normalizer|auditor-output-schema|auditor-turn-output|codex-appserver-adapter|codex-appserver-launch-state)\.mjs$' }

Require that references are audit inputs or documentation examples, not
production runtime imports. Preserve the five provider-bridge source modules
and any canonical ledger outside generated/evidence boundaries. The current
archive/_generated tree, provider-bridge packets/traces, work-batch state files,
logic-visual report bundles, and the five root-level 2025/제일고 report outputs
are local regeneratable material.

- [ ] Step 2: Add a narrow report ignore rule if needed.

Use these exact path-only rules when the consumer scan confirms the directories
are generated evidence:

    /archive/tools/logic-visual-audit/reports/
    /archive/_generated/
    /archive/_generated/**
    /alive/runtime/
    /alive/runtime/*
    /alive/runtime/provider-bridge/**
    !/alive/runtime/provider-bridge/auditor-output-normalizer.mjs
    !/alive/runtime/provider-bridge/auditor-output-schema.mjs
    !/alive/runtime/provider-bridge/auditor-turn-output.mjs
    !/alive/runtime/provider-bridge/codex-appserver-adapter.mjs
    !/alive/runtime/provider-bridge/codex-appserver-launch-state.mjs

If a canonical file must remain tracked, re-include only that exact file and
document why it is canonical. Do not re-include whole extension families.

- [ ] Step 3: Remove generated files from the index without deleting local files.

Build explicit lists from git -c core.quotepath=false ls-files for the verified
generated roots, evidence roots, and three report bundle directories. Pass
individual paths to git rm --cached -- in bounded argument chunks. Do not use
git rm -r, git clean, or a wildcard. Immediately check that every file still
exists on disk and that only intended index paths changed.

- [ ] Step 4: Re-run the production asset gate.

Run:

    node tools/archive/check-generated-git-policy.mjs --jeilgo

Expected: every real production asset reference is tracked and not ignored; the
generated report paths are ignored and no longer tracked.

### Task 6: Execute pipeline, gates, review, and final Git integration

Files:
- Read/execute: archive/tools/past-exam-pipeline/package.json
- Read/execute: archive/tools/past-exam-pipeline/run-one-exam.mjs
- Read/execute: archive/tools/past-exam-pipeline/run-batch.mjs
- Read/execute: archive/tools/pipeline-core/cli.mjs
- Read/execute: archive/tools/past-exam-pipeline/release-closure-check.mjs
- Read/execute: archive/tools/build-question-index.mjs
- Test: tests/archive-generated-artifact-git-policy.test.mjs

Interfaces:
- Consumes: policy changes, the exact Jeilgo manifest, and the fresh upstream baseline.
- Produces: fresh gate evidence, one explicit commit, and a verified main/upstream state or a documented blocker.

- [ ] Step 1: Run source and pipeline syntax checks.

Run:

    npm --prefix archive/tools/past-exam-pipeline run check
    npm --prefix archive/tools/pipeline-core test
    npm --prefix archive/tools/past-exam-pipeline test

Record each exit code and failure count. A failure unrelated to these changes
remains a reported regression rather than an inferred PASS.

- [ ] Step 2: Run the real 2025 제일고 policy and forward asset audits.

Run:

    node tools/archive/check-generated-git-policy.mjs --jeilgo

Run the existing documented visual-asset link checker against the target JS.
Confirm every referenced image/SVG exists, is Git-trackable, and is outside
generated roots.

- [ ] Step 3: Execute the representative 2025 제일고 pipeline in the existing generated root.

First inspect the manifest to determine whether it is an executable manifest or a
seed/preparation manifest. If it is executable, run:

    git status --short --untracked-files=all
    node archive/tools/past-exam-pipeline/run-one-exam.mjs --manifest archive/_generated/past-exams/20260913_25_제일고_h1_2final/manifest.json
    git status --short --untracked-files=all

If it is a seed manifest, use the current documented run-selected/run-one-exam
route after verifying source inventory and input paths. Do not invent source
facts or promote an incomplete candidate.

- [ ] Step 4: Compare status deltas and complete A/B/C/D.

Confirm from fresh output:

    CASE A: pipeline-only execution adds no generated noise
    CASE B: a source/production change remains visible
    CASE C: a new production SVG/PNG is visible
    CASE D: a generated SVG/PNG is hidden

Use the focused Node test for C/D and the real audit for A/B. Exclude existing
dirty files by exact baseline path, not by clearing them.

- [ ] Step 5: Run applicable production validation and six render cases.

Run the documented candidate/production validator and, when the manifest has a
complete production closure, inspect:

    exam/desktop, exam/mobile,
    solution/desktop, solution/mobile,
    answer/desktop, answer/mobile

Record PASS, WARN, FAIL, or NOT_TESTED for each. A missing source, candidate,
browser, or sealed packet is HOLD/FAIL, never a clean-status PASS.

- [ ] Step 6: Verify branch merge completeness before staging.

Run:

    git fetch origin
    git rev-list --left-right --count HEAD...origin/main
    git merge-base --is-ancestor HEAD origin/main
    git diff --name-only origin/main...HEAD

Do not delete the local branch while this task has unmerged commits. The remote
branch is already [gone]; do not issue a remote deletion command for it.

- [ ] Step 7: Review the exact diff and stage only task files.

Run:

    git status --short --untracked-files=all
    git diff -- .gitignore docs/rules/MANIFEST.md docs/rules/02_PIPELINES/GENERATED_ARTIFACT_GIT_POLICY_v1.md tools/archive/check-generated-git-policy.mjs tests/archive-generated-artifact-git-policy.test.mjs

Stage only the exact files created or modified by this plan. Do not stage the
pre-existing q9-solution.svg, 2026-09-15-production-math-boundary-audit.md, or
archive-image-4q-layout-regression.test.mjs.

- [ ] Step 8: Run final verification before committing.

Run the complete focused test, policy audit, pipeline check, relevant archive
tests, and final status/diff inspection. Confirm no generated path is staged and
every production asset referenced by the Jeilgo JS is visible to Git.

- [ ] Step 9: Create the one independent commit and push only after verification.

Use an explicit commit:

    git commit -m "chore(archive): isolate generated pipeline artifacts from git"
    git rev-parse HEAD
    git status --short --untracked-files=all

Push only after checking that the target is fast-forward-safe and cannot
overwrite unrelated newer work. Record the resulting local HEAD, origin/main,
equality, and push result. If upstream advanced and the current branch cannot be
safely fast-forwarded without reset/stash, report the exact non-destructive
blocker instead of force-pushing.
