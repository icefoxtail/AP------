# ROOT item-HOLD carry adapter

This run-private adapter records an actual generic `FAIL` and moves only the occupied CREATE, R1, or R2 dispatcher slot forward under an explicit ROOT authority packet. It never edits the source, evidence, generic report, or referenced assets; it never creates a PASS or `STAGE_COMPLETE` event. R2 with a remaining source HOLD routes to `ROOT_ITEM_RECOVERY`, not R3.

The ROOT authority packet uses schema `ROOT_ITEM_HOLD_CARRY_AUTHORITY_V1` and binds:

- `decisionAuthority: "ROOT_DELEGATED"`, `runId`, `examUid`, `stage`, exact `heldQids`, and the matching `ownerSessionId` from the dispatcher slot;
- `authorityReference` to the current Execution Contract §20 and its raw SHA-256;
- absolute paths and SHA-256 values for the locked run roster, dispatcher state, source, evidence, and raw generic report;
- the source raw-buffer Git blob SHA-1, absolute asset root, and absolute per-exam `ROOT.state.json` path.

Run a read-only preflight first:

```powershell
node archive/analysis/h1-final-five-pilot-20261008/ROOT.carry-item-hold.mjs preflight `
  --root C:/Users/USER/Desktop/AP-worktrees/archive-gates/AP------ `
  --authority C:/Users/USER/Desktop/AP-worktrees/archive-gates/AP------/archive/analysis/h1-final-five-pilot-20261008/technical-hold-routing/ROOT.<examUid>.<stage>.hold-carry-authority.json
```

Only after ROOT accepts that exact preflight, apply the carry:

```powershell
node archive/analysis/h1-final-five-pilot-20261008/ROOT.carry-item-hold.mjs apply `
  --root C:/Users/USER/Desktop/AP-worktrees/archive-gates/AP------ `
  --authority C:/Users/USER/Desktop/AP-worktrees/archive-gates/AP------/archive/analysis/h1-final-five-pilot-20261008/technical-hold-routing/ROOT.<examUid>.<stage>.hold-carry-authority.json `
  --receipt C:/Users/USER/Desktop/AP-worktrees/archive-gates/AP------/archive/analysis/h1-final-five-pilot-20261008/technical-hold-routing/<examUid>.<stage>.HOLD_CARRIED.json
```

The only accepted artifact-contract failures are exact `ARTIFACT_KNOWN_FAILED_REVIEW:q<heldQid>` entries where the same evidence row has a HOLD verdict/axis, and `ARTIFACT_SMALL_BOARD_CONTINUITY_REQUIRED:q<heldQid>` where that same row explicitly records small-board HOLD and its solution SHA matches the current source. Missing solution, bad solution SHA, Meta/difficulty/asset/choice/schema, coverage, or any other generic issue blocks carry. The current validator report must be bound to the current source/evidence/assets; an older raw FAIL remains preserved but cannot be used after any bound input changes.

The original CREATE report is preserved but rejected because it contains difficulty-enum issues on q1–q22. The final revision3 evidence/report pair is bound to the current unchanged-HOLD source, covers all 22 qids, and reports only `ARTIFACT_KNOWN_FAILED_REVIEW:q16` and `ARTIFACT_SMALL_BOARD_CONTINUITY_REQUIRED:q16`; the latter also has a matching source solution SHA. ROOT owns final intake and carry execution, so the helper, focused tests, and evidence are ready for ROOT's fresh authority packet and one-time decision/application.
