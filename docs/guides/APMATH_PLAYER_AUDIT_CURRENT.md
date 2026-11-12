# AP Math selective player audit — current checkpoint

Task: `apmath-player-audit-20261112-99f030406492`  
Branch: `audit/apmath-player-fast-20261112-99f030`  
Starting main: `5d49cb23cdc895aaedaf232d9438ce83e2845713`  
Latest native-tested source: `5691d6f4f340b94313ced7e3ad7f55d9d86830c3`

**Intermediate checkpoint: phase 1 COMPLETE; phases 2 and 3 IN_PROGRESS. The second-fix candidate is native NOT_RUN.** The current instruction authorizes this audit branch, tooling and narrow fixes. Main merge and deployment remain outside scope.

## Current evidence

The catalog has **58 labs / 1,067 scenes / 2,989 lessons**. Phase 1 is preserved at `fe13e3bd2ce02693a38be91bea4cfe56f359e18a`: **2,050 newly executed checks**, plus exact prior mathematical proof for **22 labs / 231 scenes / 767 lessons**.

| Phase or candidate | State | Evidence |
|---|---|---|
| 1 mathematics and structure | COMPLETE | `APMATH_PLAYER_AUDIT_20261112_PHASE1.json` and immutable phase commit |
| 2 browser/player | IN_PROGRESS; latest raw quality FAIL | [Run 43172360702](https://github.com/icefoxtail/AP------/actions/runs/43172360702): **3,063 executed; 2,779 PASS / 262 FAIL / 22 REVIEW_REQUIRED / 0 NOT_RUN** |
| 3 independent visual/education | IN_PROGRESS | **228 actual PNGs / 55 distinct scenes / 59 lesson units** |
| Second-fix candidate | **Native and post-fix visual NOT_RUN** | **672 viewport units** selected; no browser PASS claimed |

The 5691 run contains **55,450 seek samples**. Assertion counts are **565,986 PASS / 1,334 FAIL / 187 REVIEW_REQUIRED**; these are not unit or product-defect counts. Original failure/review rows remain immutable.

The older f725 run remains historical evidence: 1,816 of 2,942 units, with 842 PASS / 962 FAIL / 12 REVIEW and 1,126 not completed after the startup defect. It is not the current coverage count.

## Verified baseline and next delta

The baseline accepts **2,429 viewport units: 2,426 raw PASS plus 3 exact independently reviewed low-ink rows**. Scoped review does not rewrite a raw FAIL or establish whole-scene visual quality.

- **2,427 unchanged verified units excluded** from the next run.
- **634 changed or unresolved units** require execution.
- **2 reuse-eligible units explicitly rechecked** for the independent question-scroll contract.
- **36 new viewport units** cover identified risks, including desktop construction review.
- Next scope: **672 viewport units / 600 lessons / 244 scenes / 18 labs**; **152 capture representatives / 95 native-continuous representatives / 0 additional normal-speed full runs**.

Accounting: `634 + 2 + 36 = 672`; `2,427 + 672 = 3,063 + 36`. The exact execution authority is `apmath/playground/next/tools/player-fast-audit.targets.json`, SHA256 `729b3e0acab9a0f7aa740888e553ef1e289b32051d842e5a2c01529feeac8c3f`. Selection receipt SHA256: `5c353d1f1794e249be7a3da1f62e96c1b1d48922ff90a87b2607d037128182b2`. Baseline SHA256: `972580c8f662b4029db9c3bef914357fa70ee84c3a5d38c1311cfebbea82433c`.

The initial scope reused 102 native function lessons and excluded 87 unchanged function units. The actual shared-entry fix then required the completed 5691 regression across all 58 labs. The next run uses the verified delta above.

## Independent review and pending fixes

Current `evidence/stage3/review.json` SHA256: **`56ee32096059ba7eb0047cd096f596bd0dc009c9f5d9f479b7605b50363adf69`**. Its actual-image scope is 228 PNGs / 55 scenes / 59 lesson units. S3-001 wording is verified. S3-002 native question scrolling is verified; independent after-scroll images remain pending. Restored sector-label overlap and other image findings remain open until fixed captures are reviewed.

The second-fix candidate addresses CSS compatibility, runtime/lesson data faults, an active slider mismatch and selected label/layout findings. Local code checks do not establish browser success. **Both its native and independent post-fix visual statuses are NOT_RUN.** The next checkpoint commit will identify its exact source SHA. Selected after-scroll and complete sampled-frame captures are included in the pending delta.

## Measured speed and contract boundaries

Student default remains **1.5**; QA uses **15**, ten times that default. At 5691, **138 native QA viewport runs across 90 lessons / 58 labs and 2 normal-speed full runs all reached ended**. Seven normal-speed control contracts passed **966 assertions across 138 units**, with no contract failures. Seventeen of those units still have other raw failures.

Matched wall-time pairs: triangle-degeneracy **20,076 → 2,072 ms**; integral/signed **40,085 → 4,084 ms**. Combined measured speedup is **9.773×**, saving **54.005 seconds** across these two pairs. The pilot's separate 9.61× result is not added to 5691 counts. **This is not whole-CI acceleration**: the API-confirmed run-start to last-job interval was 656 seconds, with no complete normal-speed CI comparison.

Seek samples are not continuous playthroughs. Native caption/chapter checks observe clock indices; rendered DOM/canvas and independent image checks remain separate. Fast playback does not establish every transition frame, physical-device behavior, audio synchronization, reading pace or learning effectiveness.

## Preserved raw evidence

All four 5691 packs are **REMOTE_READBACK_VERIFIED**, including internal manifests. Receipt SHA256: `e0d2b728e203dbeb0eb47264e6a6adfcc358180bd695fe9a47b32849080f71f3`.

| Part | Bytes | SHA256 | Remote evidence |
|---|---:|---|---|
| 1 | 64,731,018 | `7ffd20eb0d9f8b2024b35a8213e7b2de2898f5a5aaa67e34ce9a35207864cc8b` | [Verified pack](https://drive.google.com/file/d/1vg-Q0x5E0sJh-51d2knNt1qWF1jcvL2I/view) |
| 2 | 78,084,268 | `e4998948256edce0c6edeb6592fe53029e7c3bd4982f9564747c28a63ff32981` | [Verified pack](https://drive.google.com/file/d/1wcPOahAWvbJ4f74iR7m3dmKufxjPyYNJ/view) |
| 3 | 81,921,414 | `70bf0eff4c1dfd3192c8cd67dd802f567d008adee910af1c68c17f00888e834c` | [Verified pack](https://drive.google.com/file/d/1hst2c5HJ34kmZwVceD-RgBcifI8wmCGC/view) |
| 4 | 66,466,143 | `1774904c3f56f1969d1b3931670d6cca5f891dd1f4baf40185827ba81b1f7bde` | [Verified pack](https://drive.google.com/file/d/1-tRpTzCOeMbx1JY345zizG3VsBUvIKG0/view) |

Earlier verified packs remain available: [Stage 1](https://drive.google.com/file/d/1uAlEqNLBI1cm0aVpdmR51J8X6NlDprGd/view), SHA256 `bf04845941e7db16067755bb15b9d9daf0f9da5e6ecd82b7d3ae3cde791e7c4f`; [pilot](https://drive.google.com/file/d/1yGWkEn0U7w13oxGma-OaZL3ABHUv0S_p/view), SHA256 `96602ae8ce3ea8865c983ff27d6c6d0d7a11e88e1cc4c78b379a82df1e5e5b27`.

Raw images and JSONL stay outside Git. Tools, compact receipts and checkpoint documents are committed. `APMATH_PLAYER_AUDIT_20261112_PHASE2_PROGRESS.json` contains exact source, selection, review and preservation references.

## Resume point

1. Commit the frozen second-fix source and exact 672-unit manifest on the dedicated audit branch.
2. Run `.github/workflows/player-fast-audit.yml` on that commit; preserve all shard artifacts, including failures. The workflow does not deploy.
3. Aggregate using the exact manifest and inventory; require matching source/manifest hashes, no duplicate keys and explicit missing coverage.
4. Independently inspect remaining FAIL/REVIEW and new after-scroll/full-sample risk captures. Reuse the 2,427 excluded units only within verified contracts.
5. Preserve meaningful phase 2 and phase 3 completion commits separately. **Do not claim overall completion while either phase remains pending. Do not merge main or deploy.**

Local Chromium socket creation is blocked; automatic escalation review rejected the earlier permission request. Native browser execution uses the authorized repository CI environment.

## Latest delta and recovery checkpoint

Run `43177457283` at `87b942df23c8a1ecfa979bcf27b0948702eff77f` completed all **672** selected viewport units: **636 PASS / 4 FAIL / 32 REVIEW_REQUIRED**, with zero unexecuted units and verified artifact integrity. The four automatic failures are three label-rendering defects (normal-distance label at two mobile widths, one motion axis label, one vector tangent label). Independent review additionally found a cropped cubic region annotation and a midpoint label crossing geometry. A compact counting exploration layout also overlapped its lower grid and counts. These six narrow fixes await the exact native delta described in the selection receipt. The 32 semantic reviews remain explicitly pending independent exact-image adjudication.

The execution workspace disappeared during review. The exact Git checkpoint, eight original run artifacts and the 67-file metadata checkpoint were restored with their recorded SHA hashes; no completed browser run was repeated. Stages 2 and 3 remain **IN_PROGRESS**.
