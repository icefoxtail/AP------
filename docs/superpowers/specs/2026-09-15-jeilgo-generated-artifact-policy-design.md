# AP MATH OS — 2025 제일고 Generated Artifact Git Policy Design

**Status:** approved for implementation on 2026-09-15

## Goal

정상적인 2025 제일고 archive/past-exam pipeline 실행에서 재생성 가능한
검수·evidence·debug·render·temporary 산출물이 Git 작업 트리를 오염시키지
않게 하고, 최종 production JS·이미지·SVG와 pipeline source 변경은 반드시
Git 상태에 드러나게 한다.

## Observed baseline

- Worktree: `C:/Users/USER/Desktop/AP------`
- Branch: `codex/jeilgo25-archive-exam`
- Start HEAD: `53e1ae66c0982809ab56456b5b9f8eb6164f8dba`
- `origin/main` before fetch: `38e45da653fbb12bca41672d65ded01e100d026e`
- `origin/main` after the requested fetch: `91d8b7528efd1a9099a2646bf89ee0edd17a02d2`
- Start status counts: tracked 11,725; modified 1; staged 0; untracked 2;
  ignored 49,239
- Current branch contains no commit absent from `origin/main` and is three
  commits behind the fetched `origin/main`.
- Existing concurrent work is preserved:
  `archive/assets/images/25_제일고_2학기_중간_고2_수학II/q9-solution.svg`,
  `docs/superpowers/plans/2026-09-15-production-math-boundary-audit.md`, and
  `tests/archive-image-4q-layout-regression.test.mjs`.
- The repository already writes the representative generated run under
  `archive/_generated/`; that 2025 제일고 run contains about 9,552 physical
  generated files. A broader census found 1,202 legacy generated files tracked
  under `archive/_generated/`, 140 tracked files under `alive/runtime/`, and
  five root-level 2025/제일고 report/screenshot files, so the cleanup must
  remove those exact generated/evidence entries from the index while preserving
  the five provider-bridge source modules.

## Decision

Keep the existing generated roots and make the boundary explicit. Do not move
the complete Past Exam pipeline to a new root in this change because its
manifest, renderer, validators, review tools, and package checks already bind
to `archive/_generated/` and `alive/runtime/`.

Replace extension-wide image ignores with path-specific generated ignores.
Production asset directories remain visible to Git regardless of whether the
asset is SVG, PNG, JPG, JPEG, or GIF.

Add a small repository policy checker and an isolated temporary-repository
smoke test. The checker verifies the real 2025 제일고 production JS references,
while the smoke test verifies that a new production asset is visible and a
same-extension generated asset is hidden.

## Classification boundary

The following are source or production and stay tracked:

- `archive/exams/original/`, `archive/exams/similar/`, and `archive/exams/types/`
  JS that is part of the archive catalog
- `archive/assets/images/` assets referenced by production JS
- pipeline, validator, renderer, runtime, contract, and configuration source
- DB/index files required by the archive runtime
- explicitly canonical operating rules

The following are regeneratable by default and remain local-only:

- `archive/_generated/`
- `archive/exams/_generated/`
- `alive/runtime/` runtime state and evidence; only the five provider-bridge
  source modules remain tracked as an explicit source exception
- `archive/tools/logic-visual-audit/reports/` generated bundles and reports,
  except a file that the reference audit proves to be an intentional canonical
  record
- new reports, evidence, screenshots, render captures, benchmark output,
  debug dumps, temporary manifests, and review packs under their generated
  roots

No physical deletion is required for a file that remains useful locally.
Existing tracked files are removed from the index only after their producer,
consumer, rebuildability, and canonical-record status are checked. The current
`archive/_generated/` Past Exam staging tree, the 126 provider-bridge evidence
files, the nine `alive/runtime/work-batches/*/state.json` files, and the three
logic-visual bundle directories are generated-only candidates; their local
bytes are preserved while their exact index entries are removed.

## Implementation units

### `.gitignore`

Remove the global `*.jpg`, `*.jpeg`, `*.gif`, and `*.svg` rules and the
redundant archive-image extension block that relies on a long exception list.
Keep narrow rules for generated roots and independent textbook/runtime caches.

### `tools/archive/check-generated-git-policy.mjs`

Expose these functions:

```js
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
```

The CLI accepts repeated `--exam <repository-relative-js-path>` arguments and
prints a deterministic JSON report. A non-zero exit code means at least one
hard gate failed.

### `tests/archive-generated-artifact-git-policy.test.mjs`

Use `node:test` and a temporary Git repository. Copy the real `.gitignore`,
create production and generated SVG/PNG files with identical extensions, and
assert that only the generated files are ignored. Also exercise the checker
against the actual 2025 제일고 production files without changing them.

### `docs/rules/02_PIPELINES/GENERATED_ARTIFACT_GIT_POLICY_v1.md`

Record the durable classification, explicit staging rule, generated-root
contract, A/B/C/D smoke cases, production asset protection gate, and the
relationship to the Past Exam V3 evidence contract. Add its byte count and
SHA-256 to `docs/rules/MANIFEST.md`.

## Hard gates

The implementation reports these gates independently:

- `GENERATED_WORKTREE_NOISE_GATE`
- `PRODUCTION_ASSET_NOT_IGNORED_GATE`
- `NEW_PRODUCTION_SVG_TRACKABILITY_GATE`
- `NEW_PRODUCTION_IMAGE_TRACKABILITY_GATE`
- `JEILGO25_PIPELINE_EXECUTION_GATE`
- `JEILGO25_PRODUCTION_OUTPUT_GATE`
- `JS_ASSET_FORWARD_PARITY_GATE`
- `GENERATED_REBUILDABILITY_GATE`
- `BRANCH_MERGE_COMPLETENESS_GATE`

The first two and the A/B/C/D smoke cases are automated in the repository.
Pipeline execution, six-case render review, and branch merge completeness are
reported from fresh commands and are never inferred from a clean `git status`.

## Safety and staging

All status comparisons use the recorded baseline. No `git add .`, `git add
-A`, stash, reset, clean, restore, checkout, or broad deletion is allowed.
Only files changed by this task are explicitly staged. Existing modified,
staged, and untracked files are not altered or included in the commit.

The final commit is one independent commit for this work. Push and local
branch cleanup occur only after every applicable gate has fresh evidence. A
remote branch already marked `[gone]` is not deleted a second time.
