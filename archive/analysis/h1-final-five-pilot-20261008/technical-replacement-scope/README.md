# ROOT q17/q20 replacement-scope blind adapter

This run-private helper handles fresh affected-scope review freezes for R1 or R2 after ROOT authorizes q17/q20 item recovery. It preserves the old full-bank freeze by raw path/SHA only, scopes the fresh independent answer/reasoning file to exactly q17 and q20, and binds the current full 20-qid safe student bundle. It verifies every student field and asset for the other 18 qids is exact. Scoped q17/q20 asset hashes may change as part of the authorized recovery; the fresh asset-read proof must match the current bundle.

The helper does not open raw JS before the scope freeze, read old freeze payloads, decide math, author replacement items, create a stage verdict/seal, release a dispatcher slot, or edit source. Postfreeze disclosure rechecks the source raw SHA/blob SHA, full current bundle SHA, and full 20-qid student parity. It emits stored answers, solution fields, decisive steps, Meta, and answer-linked assets for q17 and q20 only. The original stage owner still writes a new full 20-qid report after both fresh scoped results arrive.

R1 needs one prior-scope composition because its actual original full freeze is E2 while the reusable full-bank baseline is source37. ROOT binds an opaque `ROOT_CURRENT_R1_FROZEN_SCOPE_COMPOSITION_V1` file that links the original E2 freeze to the fresh q14 scope freeze, its layout closure, the current full R1 PASS report, and the current source37 safe bundle. The helper verifies their exact paths/SHA values and the full R1 validator PASS/20-qid binding. It keeps the original E2 freeze SHA/source identity unchanged. Expected sources: original E2 `e2fc9978a60dc3acf7d161b427c888673c913589ffacf1e630d5f6b76dd933b8`; q14 fresh freeze `9ef452747702cedf02d229a900ccf100251684e17124540a682a63be40946773`; source37 baseline `37aa02556959821382042d0f8aa7104c4fe969a899016e397cd64e18328af4d9` / blob `db338d4a3991340f50d7e41221e182fe0eb13640`. R2 uses its direct source37 original freeze and needs no R1 composite admission.

## ROOT packet contract

ROOT writes `ROOT_REPLACEMENT_SCOPE_BLIND_AUTHORITY_V1` with `decisionAuthority: "ROOT_DIRECTED_ITEM_RECOVERY"`, fixed run/exam IDs, stage `R1` or `R2`, exact `scopeQids: [17,20]`, and full order `[1..20]`. It binds:

- the locked run roster and a fresh stage assignment by absolute path/raw SHA;
- current source absolute path, raw SHA-256 and raw-buffer Git blob SHA-1;
- old and current full safe student bundle absolute paths/SHA-256 values, source raw/blob hashes, full qid order and exact student whitelist;
- the original full freeze as an opaque absolute path/SHA reference and its actual source identity. R2's original invalid qids are `[17,20]`; R1's original invalid qid is q14 and its typed composition admission supplies the prior current-source full-bank baseline. Both stages bind reusable current-baseline qids equal to the other 18;
- `rootDecision` confirming `ROOT_DIRECTED_ITEM_RECOVERY`, exact scope and `remainingAfterR2: true`;
- `sourceRecoveryProvenance` path/raw SHA whose metadata binds q17/q20, old/current source hashes and full denominator 20;
- a fresh reviewer identity with `archive_r1` or `archive_r2` role, a reviewer ID distinct from the prior freezer, `forkTurns: "none"`, and a SHA-bound session proof;
- a SHA-bound scoped asset-read proof. Its `opened: true` acknowledgments must exactly cover current assets for q17/q20 and declared dependencies;
- asset/evidence roots and exclusive scope-freeze/disclosure output paths.

The assignment must bind the same current source and full safe bundle, `scopeQids: [17,20]`, qid order `[1..20]`, `questionCount: 20`, absolute roots, and `workingJsPrefreezePermission: "HASH_ONLY_NO_TEXT_OR_PARSE"`. The helper compares the old/current student-only bundles itself and allows only q17/q20 student/asset differences.

## ROOT-controlled CLI

Run preflight after the current final source, bundle, ROOT recovery provenance, session proof, and asset-read proof are bound:

```powershell
node archive/analysis/h1-final-five-pilot-20261008/ROOT.replacement-scope-blind.mjs preflight `
  --root C:/Users/USER/Desktop/AP-worktrees/archive-gates/AP------ `
  --authority <absolute-ROOT-replacement-scope-authority.json>
```

The clean reviewer returns exactly two `independentAnswer`/`reasoning` rows, qids 17 and 20, in `ROOT_FRESH_REPLACEMENT_SCOPE_ANSWERS_V1`. ROOT freezes them with:

```powershell
node archive/analysis/h1-final-five-pilot-20261008/ROOT.replacement-scope-blind.mjs freeze `
  --root C:/Users/USER/Desktop/AP-worktrees/archive-gates/AP------ `
  --authority <absolute-ROOT-replacement-scope-authority.json> `
  --answers <absolute-fresh-stage-scope-answer-file>
```

After that immutable two-qid freeze, ROOT may disclose current stored fields:

```powershell
node archive/analysis/h1-final-five-pilot-20261008/ROOT.replacement-scope-blind.mjs disclose `
  --root C:/Users/USER/Desktop/AP-worktrees/archive-gates/AP------ `
  --authority <absolute-ROOT-replacement-scope-authority.json> `
  --freeze <absolute-stage-q17-q20-scope-freeze.json> --freeze-sha <scope-freeze-sha256>
```

The current final source/bundle was not available during this adapter implementation. The fixture tests use only synthetic data; ROOT must create fresh source-bound authority and assignment packets before executing the helper.
