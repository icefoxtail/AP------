# ROOT Maesan Girls q18 scope-blind adapter

This run-private helper supports fresh R1 or R2 review of the one true source HOLD q18 in the 22-qid Maesan Girls exam. It binds the current full safe student bundle and verifies the other 21 qids' student fields and assets exactly against the stage's original safe full-bank bundle. It also verifies ROOT's post-R2 q18 decision and source non-target-invariance proof. It does not clear `itemStatus: HOLD`, make a math/quality judgment, create a stage PASS, or release a slot.

The original full freeze is bound by stage-specific path/source/SHA and remains opaque. The current full safe bundle must carry all 22 qids, the exact `STUDENT_FIELDS` whitelist, and every current referenced asset. Only q18 independent answer and reasoning are accepted in a fresh freeze. The fresh reviewer must be `archive_r1` or `archive_r2`, use a new session with `forkTurns: "none"`, and actually open all assets referenced by q18 and its declared dependencies. Postfreeze disclosure rechecks the current source SHA/blob and full 22-qid student parity, then discloses stored fields, Meta, and answer-linked assets for q18 only.

## ROOT authority/assignment packet

ROOT writes `ROOT_MAESANGIRLS_Q18_SCOPE_BLIND_AUTHORITY_V1` with:

- run `h1-final-five-pilot-20261008`, exam `21_매산여고_1학기_기말_고1_기출`, stage R1 or R2, `scopeQids: [18]`, and `fullQidOrder: [1..22]`;
- `decisionAuthority: "ROOT_DIRECTED_ITEM_RECOVERY"`, plus a SHA-bound `ROOT_POST_R2_BOUNDED_ITEM_RECOVERY_DECISION_V1` proof with exact q18 scope and `remainingAfterR2: true`;
- the `ROOT.roster.json`, stage assignment, old safe full bundle, current safe full bundle, original stage freeze, current source, and source-recovery non-target-invariance proof, each by absolute path/raw SHA-256;
- old/current source raw SHA/blob SHA bindings. For each stage, its old safe bundle and original freeze must agree on that stage's original source SHA. Do not copy the R1 source hash into an R2 authority or vice versa;
- source-recovery proof `JS_ARCHIVE_ITEM_RECOVERY_NON_TARGET_INVARIANCE_V1`, `allowedQids/changedQids: [18]`, current question count 22, 21 non-target qids, and zero non-target mutations;
- a fresh matching reviewer role/session proof (`archive_r1` or `archive_r2`, `forkTurns: "none"`), scoped asset-read proof, absolute asset/evidence roots, and fresh freeze/disclosure output paths.

The assignment binds the same current working JS raw SHA/blob SHA and current 22-qid safe bundle SHA, full qid order, `scopeQids: [18]`, all absolute roots, and `workingJsPrefreezePermission: "HASH_ONLY_NO_TEXT_OR_PARSE"`. The helper reads only the safe bundles and Root recovery/decision evidence before freeze; it does not parse raw JS or the original answer freeze before review.

## ROOT-controlled CLI

After ROOT has the current final JS, a fresh full safe student bundle, matching assignment, recovery provenance, fresh reviewer/session proof, and opened-asset acknowledgments, preflight:

```powershell
node archive/analysis/h1-final-five-pilot-20261008/ROOT.maesangirls-q18-scope-blind.mjs preflight `
  --root C:/Users/USER/Desktop/AP-worktrees/archive-gates/AP------ `
  --authority <absolute-ROOT-q18-scope-authority.json>
```

The clean reviewer returns exactly one row, q18, in `ROOT_FRESH_Q18_SCOPE_ANSWERS_V1`. ROOT freezes it with:

```powershell
node archive/analysis/h1-final-five-pilot-20261008/ROOT.maesangirls-q18-scope-blind.mjs freeze `
  --root C:/Users/USER/Desktop/AP-worktrees/archive-gates/AP------ `
  --authority <absolute-ROOT-q18-scope-authority.json> `
  --answers <absolute-fresh-q18-answer-file>
```

After freeze, ROOT may disclose current q18 stored fields:

```powershell
node archive/analysis/h1-final-five-pilot-20261008/ROOT.maesangirls-q18-scope-blind.mjs disclose `
  --root C:/Users/USER/Desktop/AP-worktrees/archive-gates/AP------ `
  --authority <absolute-ROOT-q18-scope-authority.json> `
  --freeze <absolute-q18-scope-freeze.json> --freeze-sha <scope-freeze-sha256>
```

No source/current final bundle was applied during this helper implementation. ROOT must build a fresh authority/assignment against the actual current 22-qid source and bundle before execution.
