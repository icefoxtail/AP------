# AP Math selective player audit — current checkpoint

Task: `apmath-player-audit-20261112-99f030406492`  
Branch: `audit/apmath-player-fast-20261112-99f030`  
Frozen starting main: `5d49cb23cdc895aaedaf232d9438ce83e2845713`

The current user instruction authorizes this audit branch, test tooling and narrow defect fixes. It does **not** authorize merging main or deploying. Earlier release instructions in the lesson handoff do not expand this task's authority.

## Scope and phase status

The catalog has **58 labs / 1,067 scenes / 2,989 lessons**. Phase 1 is complete at `fe13e3bd2ce02693a38be91bea4cfe56f359e18a`: **2,050 newly executed checks** and exact prior mathematical proof reused for **22 labs / 231 scenes / 767 lessons**. The new functions are **4 labs / 102 scenes / 102 lessons**; the other missing-evidence math scope is **32 / 734 / 2,120**.

| Phase | State | Current evidence |
|---|---|---|
| 1 math and structure | COMPLETE | `APMATH_PLAYER_AUDIT_20261112_PHASE1.json` and its immutable phase commit |
| 2 browser/player | IN_PROGRESS | First full run 43168128729 preserved 1,816 viewport units: 842 PASS, 962 FAIL, 12 REVIEW; 1,126 units were not completed after the real circle-equation startup failure |
| 3 independent visual/education | IN_PROGRESS | 146 original PNGs actually examined; wording correction verified; shared entry and landscape proof findings need current fixed captures |

`APMATH_PLAYER_AUDIT_20261112_PHASE2_PROGRESS.json` records the exact intermediate counts, defects, source scope and next step. Assertion failures are **not** the count of product defects: native state/cache and inactive registry assumptions were independently triaged and corrected in the audit harness. Original failure rows are never rewritten as PASS.

## Evidence reuse and required regression

The first selection reused 102 native function lessons from run `43158662069` at actual source `3fd4977ebafb9b7650fc03392624a02441b2c6cc` (1,218 checks / 510 initial viewport rows). Complete playground, CSS and JS trees matched starting main. Fifteen risk function scenes received new checks and 87 were excluded. The other 54 labs / 965 scenes / 2,887 lessons were explicitly browser `QA_PENDING` in the prior lesson handoff, so their math proof was reused while the browser evidence gap was tested.

The first full run exposed a real shared fixed-footer obstruction. Correcting shared player JS/CSS changes the browser fingerprint for every lab. The next **required regression**, rather than a repeat of mathematical verification, therefore covers 2,989 primary mobile lessons and 74 additional affected/control viewport units: **3,063 viewport units**, with **212 capture representatives**, **138 native continuous playback representatives**, and **2 normal-speed runs**. Future changes can use the verified delta selector and the final raw baseline rather than repeat this missing-evidence baseline.

## Method and boundaries

- `player-audit-scope.mjs` inventories native registrations and separates math, structure, browser and visual fingerprints.
- `player-audit-select.mjs` verifies immutable raw row/summary hashes, source closures, the claimed contract and current fingerprints before reuse. Weaker prior native scope stays explicitly weaker; `--require-seek` requests an upgrade.
- `player-fast-audit.mjs` samples native chapter/caption/animation boundaries. Selected units additionally run real requestAnimationFrame playback at observed student default multiplied by ten. Seek samples are not continuous playback evidence.
- Student default remains **1.5**. The pilot matched pair measured 16,075 ms at 1.5 and 1,673 ms at QA15 (**9.61 times**); this is playback wall time, not total CI speed.
- Initial question accessibility, missing-data tokens, native state, geometry/text bounds, captions, final cards, restoration and JavaScript/resource errors are checked. Selected controls include pause, trusted seeking, replay, close and next routing.
- Startup failures are preserved per lab/view and no longer prevent later labs from being tested. The first failing/uncertain sample frames are saved for independent review.
- Independent visual and educational quality is never inferred from automated PASS. Current fixes await native rerun and visual review.
- Raw JSONL/captures stay outside Git. Tools, compact receipts and exact evidence pointers are committed. No main merge or deployment is authorized.

## Recovery

Use `.github/workflows/player-fast-audit.yml` on the dedicated audit branch. The workflow serves the exact checkout in eight isolated browser shards and never deploys. Its job reserves time to upload partial artifacts even when a browser step times out.

```sh
node apmath/playground/next/tools/player-audit-scope.mjs --out /absolute/path/inventory.json
node apmath/playground/next/tools/player-fast-audit.mjs --manifest apmath/playground/next/tools/player-fast-audit.targets.json --shard 0/8 --out /absolute/path/shard-0
```

Local Chromium is unavailable because socket creation is denied; automatic escalation review rejected a permission request. Browser work uses the authorized repository CI environment.

Verified Stage 1 raw pack: [evidence](https://drive.google.com/file/d/1uAlEqNLBI1cm0aVpdmR51J8X6NlDprGd/view), 909,487 bytes, SHA256 `bf04845941e7db16067755bb15b9d9daf0f9da5e6ecd82b7d3ae3cde791e7c4f`. Pilot raw pack: [evidence](https://drive.google.com/file/d/1yGWkEn0U7w13oxGma-OaZL3ABHUv0S_p/view), SHA256 `96602ae8ce3ea8865c983ff27d6c6d0d7a11e88e1cc4c78b379a82df1e5e5b27`. Both complete uploaded byte streams were read back and verified.

Next action: execute the fixed candidate, inspect remaining FAIL/REVIEW and missing units only, complete independent current-capture review, then commit phases 2 and 3 separately. Do not report overall completion while either phase remains pending.
