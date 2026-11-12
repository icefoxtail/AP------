# AP Math selective player audit — current checkpoint

Task: `apmath-player-audit-20261112-99f030406492`  
Branch: `audit/apmath-player-fast-20261112-99f030`  
Frozen starting main: `5d49cb23cdc895aaedaf232d9438ce83e2845713`

The current user instruction authorizes this audit branch, test tooling and narrow defect fixes. It does **not** authorize merging main or deploying. Earlier release instructions in the lesson handoff do not expand this task's authority.

## Scope and phase status

The actual catalog has **58 labs, 1,067 scenes and 2,989 lessons**. Reuse is determined separately for mathematics, native browser behavior and independent visual review.

| Phase | Current state | Evidence |
|---|---|---|
| 1: mathematics and structure | COMPLETE; 2,050 accepted new checks, zero unresolved test failure | `APMATH_PLAYER_AUDIT_20261112_PHASE1.json`; phase commit `fe13e3bd2ce02693a38be91bea4cfe56f359e18a` |
| 2: selected browser/player audit | IN_PROGRESS; pilot completed, full selection pending execution | Pilot run [43165413460](https://github.com/icefoxtail/AP------/actions/runs/43165413460), 7 PASS and 2 recorded harness failures |
| 3: independent visual/educational review | IN_PROGRESS; source correction needs new capture | 102 original PNGs examined; one confirmed wording finding and one entry-question accessibility candidate |

Stage 1 reused exact raw mathematical/VM proof for **22 labs / 231 scenes / 767 lessons**. The new function labs cover **4 / 102 / 102**; selected missing-evidence or changed-source regression covers **32 / 734 / 2,120**. The first catalog run had missing sparse-checkout inputs; the corrected catalog-only run passed. Preserve both raw logs.

Stage 2 reuses function run `43158662069` at its actual checkout `3fd4977ebafb9b7650fc03392624a02441b2c6cc`: **102 native lessons / 1,218 checks / 510 initial viewport rows**. Complete playground, CSS and JS Git trees match the starting main. This is not an independent visual PASS. Of those 102 scenes, **15 risk scenes receive additional regression** and **87 are excluded from the new browser run**.

The lesson handoff explicitly leaves the other **54 labs / 965 scenes / 2,887 lessons** at browser `QA_PENDING`. Their existing math proof is preserved while this missing browser contract is checked. The explicit manifest adds 40 viewport cases, for **2,942 selected lesson/viewport units**, including **121 continuous native playback/capture representatives** and **2 normal-speed representatives**. The pilot already measured a separate matched normal/fast pair.

## Method and boundaries

- `player-audit-scope.mjs` inventories native scene/lesson registrations and records separate math, structure, browser and visual fingerprints. Matching prior PASS references produce a reuse candidate, requiring raw proof verification.
- `player-fast-audit.mjs` samples the native timeline at chapter, caption and animation boundaries and separately runs selected native requestAnimationFrame playback. Seek samples are never described as continuous playback.
- QA speed is the observed student default multiplied by 10, inside the audit browser only. Production default remains **1.5**.
- Each unit checks initial entry, native timeline state, geometry/text bounds, captions, final card, restored state and script/resource errors. Representative units also check pause, trusted range input, replay, close and next routing.
- Small phone, mobile landscape, tablet portrait/landscape and desktop are added only for selected shared-player/rendering risks. Independent visual/educational review remains required.
- Raw JSONL and captures are outside Git. Commits preserve tools, compact receipts and evidence pointers. Resume may reuse only exact source/configuration PASS rows; failed or incomplete units remain due.

The pilot's first comparison error ignored native set-cue precedence over numeric defaults. Its second replay probe paused before the first native animation frame; the corrected probe lets real replay initialize before testing rewind. The raw pilot failures remain preserved until the corrected browser run resolves them. No student code was changed for those two findings.

Confirmed Stage 3 finding: `common-quadratic/diffFuncFlatten` called a root x a graph intersection. The one-line summary now explicitly says **the intersection's x-coordinate**. Its targeted math/runtime suite and subsequent browser capture are the validation boundary; no broad content rewrite is intended.

## Execution and recovery

Run the manifest on the exact candidate branch through `.github/workflows/player-fast-audit.yml`. Its eight isolated shards install the existing Playwright runtime and serve the checked-out files; no deployment occurs.

```sh
node apmath/playground/next/tools/player-audit-scope.mjs --out /absolute/path/inventory.json
node apmath/playground/next/tools/player-fast-audit.mjs --manifest apmath/playground/next/tools/player-fast-audit.targets.json --shard 0/8 --out /absolute/path/shard-0
```

The local environment cannot launch Chromium because socket creation is denied. Automatic escalation review rejected a sandbox permission request, so browser execution uses the repository's GitHub Actions environment. This is an environment limitation, not a product failure.

Verified Stage 1 raw pack: [Drive evidence](https://drive.google.com/file/d/1uAlEqNLBI1cm0aVpdmR51J8X6NlDprGd/view), 909,487 bytes, SHA256 `bf04845941e7db16067755bb15b9d9daf0f9da5e6ecd82b7d3ae3cde791e7c4f`. Uploaded bytes and every internal manifest member were reread and verified. Full phase receipt, current TAPs and the 22 reused raw math logs are included.

Next action: collect the selected browser results, distinguish confirmed product defects from harness/model differences, apply narrow fixes, rerun only affected contracts, and finish the independent risk review. Commit phases 2 and 3 separately. Do not report total completion while either remains pending.
