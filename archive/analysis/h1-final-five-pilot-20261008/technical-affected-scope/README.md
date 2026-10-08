# ROOT q14 affected-scope freeze adapter

`ROOT.affected-scope-freeze.mjs` supplies a run-private fresh R1/R2 q14 freeze and q14-only postfreeze disclosure. The freeze binds the full current 20-qid student-only bundle, but accepts exactly one fresh answer/reasoning row for q14. It does not create a stage verdict, completion seal, dispatcher event, or slot release. The existing full-denominator stage-kit path remains unchanged.

## ROOT evidence packet

ROOT authors `ROOT_AFFECTED_SCOPE_FREEZE_AUTHORITY_V1` without answer-bearing data. It binds the run/exam/stage, exact `scopeQids: [14]`, expected qid order `[1..20]`, locked `ROOT.roster.json` path/SHA, current affected-scope assignment path/SHA, and:

- `freshReviewer`: `reviewerIdentity` with role `archive_r1` or `archive_r2`, a reviewer ID different from the old full-freeze reviewer, `sessionCreatedWithForkTurns: "none"`, and a SHA-bound session proof tied to the current source/bundle.
- `source`: absolute working JS path, expected raw SHA-256, and raw-buffer Git blob SHA-1. The prefreeze permission remains `HASH_ONLY_NO_TEXT_OR_PARSE`; this helper does not open or parse that JS until postfreeze disclosure.
- `originalFreeze`: absolute original full-freeze path and raw SHA-256, `opaque: true`, stage/source identity, `invalidOriginalQids: [14]`, and `reuseOriginalQids` equal to the other 19 qids. The helper hashes this file as bytes and never parses its payload.
- `sourcePreimage` and `sourceRepairProvenance`: absolute path/SHA bindings for the preserved original full 20-qid source preimage and ROOT's q14-only source repair provenance. The helper verifies only physical hashes and declared qid scope; it does not parse either source file or provenance payload before freeze.
- `oldBundle` and `currentBundle`: absolute paths, raw file SHA-256, source raw SHA-256/blob SHA-1. Both must be complete 20-qid V2 safe student bundles with the exact `STUDENT_FIELDS` whitelist, answer-free provenance, and every referenced asset bound to its file SHA.
- `bundleInvarianceEvidence`: ROOT-authored `ROOT_AFFECTED_STUDENT_SOURCE_INVARIANCE_V1` file binding the two bundles, q14-only changed qid set, 19 unchanged qids, outside-scope student/asset digest, scoped change digest, and comparison digest. The helper independently recomputes all of these.
- `sourceRootPdf` plus `sourceRestorationProof`: the absolute locked root PDF path/SHA, a ROOT restoration proof file, and an opaque SHA-bound reference to the source extraction freeze.
- `scopeDependenciesQids`, `scopedAssetReadProof`, asset root, evidence root, and exclusive output paths for the scope freeze and q14-only disclosure. The asset-read proof must have an actual `opened: true` ack from the fresh reviewer for every asset referenced by q14 and its declared dependencies.

The assignment packet must use the current safe bundle, preserve all 20 qids, carry `scopeQids: [14]`, bind source raw SHA/blob SHA and all absolute roots, and keep `workingJsPrefreezePermission: "HASH_ONLY_NO_TEXT_OR_PARSE"`.

## Current student-bundle comparison

The read-only comparison command returns only qid sets and hashes; ROOT copies that result into its own invariance evidence and binds that evidence file by SHA in the authority packet.

```powershell
node archive/analysis/h1-final-five-pilot-20261008/ROOT.affected-scope-freeze.mjs compare `
  --root C:/Users/USER/Desktop/AP-worktrees/archive-gates/AP------ `
  --old-bundle <absolute-old-safe-bundle> --old-sha <old-bundle-sha256> `
  --old-source-sha <old-source-raw-sha256> --old-source-blob-sha <old-source-blob-sha1> `
  --current-bundle <absolute-current-safe-bundle> --current-sha <current-bundle-sha256> `
  --current-source-sha <current-source-raw-sha256> --current-source-blob-sha <current-source-blob-sha1>
```

For the current Maesan 2021 inputs, old safe bundle SHA-256 is `a03d20d8b1f8f6b7db8f70df8e6df443e80ed7b0b4594679114436f902ab5251` and q14-fresh safe bundle SHA-256 is `d66f4e4fddfd6b1cd6b00caa721238bed1cb1214dff9b7dc75c0f15540ac3d18`, sourced from raw source SHA-256 `4a949b6469ac73d1061a5d7b5fe5a02ad4f5ce5675bc37041574f83c2f6656d2` and blob SHA-1 `994f39d3b4cc343ca0577d0fd0490f2895ea5b3d`. The comparison reported `changedQids: [14]`, all other 19 qids unchanged, and `outsideScopeStudentAndAssetParity: true`. Digests: `outsideScopeComparisonSha256=8346d6e11cf86f5c5f01fe704cd034c2770181fd2168f1caad60e88e2527e4dd`, `scopedChangeSha256=8034f516a749d94123458c474ffdcb2b98e9768e95e06a8501c8fcf7c2b75045`, `comparisonSha256=f86003b2efd5b79ff24dedd584c9d24f6dfacbace74bf1672b33398e3a467a08`.

The preserved E2 full-source preimage is `C:\Users\USER\Desktop\AP-worktrees\archive-gates\AP------\.tmp\archive\h1-final-five-pilot-20261008\21_매산고_1학기_기말_고1_기출\history\pre-q14-source-repair\21_매산고_1학기_기말_고1_기출.js`, raw SHA-256 `e2fc9978a60dc3acf7d161b427c888673c913589ffacf1e630d5f6b76dd933b8`. ROOT's q14 source-repair provenance is at `C:\Users\USER\Desktop\AP-worktrees\archive-gates\AP------\archive\analysis\21_매산고_1학기_기말_고1_기출\h1-final-five-pilot-20261008\R1.q14-source-repair.provenance.json`, SHA-256 `4a8884e9af8c570063b9e02c692cf5a1ca4a853585503f0628e83e60b42a912d`.

## Root-controlled execution

Run a non-mutating preflight before the new reviewer answer file is accepted:

```powershell
node archive/analysis/h1-final-five-pilot-20261008/ROOT.affected-scope-freeze.mjs preflight `
  --root C:/Users/USER/Desktop/AP-worktrees/archive-gates/AP------ `
  --authority <absolute-ROOT-affected-scope-authority.json>
```

The fresh reviewer is `/root/r1_maesan2021_q14fresh`, role `archive_r1`, created with `forkTurns: "none"`; ROOT must bind the matching fresh-session proof. The fresh reviewer answer file must contain exactly `{schemaVersion: "ROOT_FRESH_AFFECTED_QID_ANSWERS_V1", reviewerIdentity, answers: [{qid: 14, independentAnswer, reasoning}]}`. No previous answer-bearing freeze is an input. After the reviewer returns that one-qid file, ROOT can write the immutable scope freeze:

```powershell
node archive/analysis/h1-final-five-pilot-20261008/ROOT.affected-scope-freeze.mjs freeze `
  --root C:/Users/USER/Desktop/AP-worktrees/archive-gates/AP------ `
  --authority <absolute-ROOT-affected-scope-authority.json> `
  --answers <absolute-fresh-q14-answer-file>
```

After that freeze, ROOT can create a q14-only stored-answer/solution/Meta disclosure, which first rechecks the immutable freeze SHA, original full-freeze opaque SHA, full safe bundle SHA, current source raw hash/blob hash, and all 20 current student fields:

```powershell
node archive/analysis/h1-final-five-pilot-20261008/ROOT.affected-scope-freeze.mjs disclose `
  --root C:/Users/USER/Desktop/AP-worktrees/archive-gates/AP------ `
  --authority <absolute-ROOT-affected-scope-authority.json> `
  --freeze <absolute-q14-scope-freeze.json> --freeze-sha <scope-freeze-sha256>
```

The disclosure contains only q14 stored fields, q14 Meta fields, and q14 answer-linked asset hashes. The original R1 owner must still produce a new full 20-qid R1 evidence/report after the clean q14 review and same-stage repair.
