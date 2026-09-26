# Middle 1 B20/B24/B28 R2E checkpoint

## Branch and immutable inputs

- Branch: `work/m1-b20-b24-b28-r2e`
- Branch base: `main` at `8e12f496bf49f70a1490d55f5176d67d5bd1da10` (observed before branch creation).
- Review target ref at checkpoint: `codex/meta-foundation/middle1` at `98b6e4700a50176a6a605f25577117b2aae22cc8`.
- Current source blob SHAs at that target ref:
  - B20: `4fcbb09d4c2cb5b647c77941c3646e24a3d915a1`
  - B24: `4f505e347845129e74b57dffb9247fac2bbee599`
  - B28: `07231701bb482dfc126b097294433824506d2b4f`
- Commit order: B20, then B24, then B28. Each exam has its own commit.
- Source question PNGs already exist on the base tree under `archive/assets/images/<exam>/`. The branch adds the candidate solution SVGs at those asset roots and replaces only the three exam JS files.

## Recovered R1 inputs and current candidate scope

- B20: `B20/R1_INPUT.zip` preserves the recovered `REVIEW1_DONE` package. Current branch candidate includes the JS plus 16 solution SVGs.
- B24: `B24/R1_INPUT.zip` preserves the recovered `READY_FOR_REVIEW` package. This is the package available in this Work; its filename/status alone does not prove it is the latest R1-complete byte set. The R1 completion record was reported in Notion, so verify that record and compare bytes before treating this package as definitive. Current branch candidate includes the JS plus 7 solution SVGs.
- B28: `B28/R1_INPUT.zip` preserves the recovered `REVIEW1_DONE` package. Current branch candidate includes the JS plus 8 solution SVGs. The current JS has the q14 mean calculation corrected to (135/10=13.5); q12 and q23 remain source HOLD leads to re-evaluate.

## Work notes for independent REVIEW2

Scratch review notes before this checkpoint recorded Math/Solution checks of B20 24/24 PASS, B24 22/22 PASS, and B28 22 PASS with q12/q23 HOLD. These are leads only, not a REVIEW2 verdict or substitute for independently checking every final item and Meta against the current target ref. SVG layout adjustments are present in the branch candidate files.

## Closure state

This branch is a review handoff checkpoint. No final REVIEW2 ledgers, final Meta patch/evidence, APPLY_PACKET, final artifact seal, or REVIEW_DONE ZIP has been produced here. None of the three exams is certified `CLOSED_FOR_APPLY` or `READY_FOR_APPLY`. Keep the order B20 → B24 → B28, finish REVIEW2 and its fixes, then validate and seal each final artifact. No merge or push to `main` was performed.


## R2E physical checkpoint — 2026-09-26 (input reconciliation)

- Current worktree: `work/m1-b20-b24-b28-r2e`; initial HEAD `90a3c21166daefcbe08e1e5be0f578603ea68edf`; fetched `origin/main` `8e12f496bf49f70a1490d55f5176d67d5bd1da10`; main comparison: ahead 3 / behind 0.
- Notion R1 receipts read: D10 B20, D11 B24, D12 B28. The pilot's R2E contract is applied with the user's direct-integration exception.
- B20: 24/24; R1 solution PASS 24, SVG HOLD 0, Meta repair 10 + pack-gap 11; R1 final JS SHA-256 `c5153b1122b10e0e1b574a5f897242a3ea162020d7957934afb926eb86d93387` equals both ZIP JS and current HEAD blob. Deep review queue: q1–q8, q11–q22, q24 (21 items).
- B24: 22/22; Notion R1 says solution KEEP 22, SVG repair q6/q7/q10/q21, Meta repairs q12/q14/q15/q17/q18/q20 and 12 remaining Meta HOLD (q2–q10, q13, q19, q21). Current B24 ZIP is the CREATE/READY package (SHA-256 4188aebb9ce4c88da0c018fab8b03a2f409167621964c54b3f4a0b5234885970), and its JS SHA-256 `497f7c4267ed615d2a617191ca83c8d51d07d14f266fdc2b8c6026dfb0f6b56a` equals the current branch blob but differs from Notion's R1 final JS SHA-256 `3e0e0e717ef6eb62804d543cc2d8e42e9ea75da6e1fe97a921a319b1b0052f7a`. Treat the six R1 Meta repairs as missing from this branch and re-adjudicate them alongside all 12 holds. Deep review queue: q2–q10, q12–q15, q17–q21 (18 items).
- B28: 24/24; R1 solution KEEP 20 / REPAIR 2 / HOLD 2; Meta KEEP 4 / REPAIR 8 / HOLD 12, including 15 RPM gaps + source visual HOLD q12/q23. R1 final JS SHA-256 `9a46ad715ca2603794cd38e58fa29f1d57362d32aa4d3a646cb72c97f0993e59`; current branch differs only at q14 solution, whose `145/10=14.5` is already corrected to `135/10=13.5`. Deep review queue: q1–q15, q19–q24 (21 items).
- Extracted ZIP evidence is read-only under the OS temp directory; SHA-256 and ZIP member inventories are in this session's verified checkpoint. Production integration must omit this entire review handoff directory.
- Current next item: B20 q1 Meta R1 repair recheck. Machine ledger: `archive/data/review2-handoff/middle1/R2E_LEDGER.json`.


## Latest user scope and B28 recovery reconciliation — 2026-09-27

- Latest user instruction: finish on the existing task branch with commit/push only; do not merge or update main. Do not issue `R2E_MAIN_FINAL` receipts without main integration.
- Latest Notion D12 REVIEW1 record and R2E pilot update report deterministic source recovery for B28 q12/q23 and q14 mean repair. Current branch q12 image blob `f7fd240b9cd92fe668ae5a3e880d843892851f6b` and q23 image blob `063ac074aa466d8a3ac5eadf0373babc3e2c51cb` match those receipts exactly.
- Current branch JS still contains the old q12/q23 HOLD prose. R2E will independently adjudicate and replace both solutions from the matched source images; q14 already uses `135/10=13.5` and has no residual `145/10`.
- The Notion recovery summary says target image blobs exact, source holds 0, and the recovery artifact was stored in the latest Library REVIEW1_DONE ZIP. That ZIP is not present in this branch's R1_INPUT package; evidence identity is preserved above and the R2E solution writes will be recorded locally.


## Cross-exam Meta clustering — 2026-09-27

- Cross-exam comparison is frozen in `R2E_META_CLUSTER_PLAN.json`; it groups 60 deep-review items and keeps true-new L3 count at 0 (new machine keys materialize existing RPM paths).
- Shared structures: triangle angle chase (B20 q8/q22 + B28 q1/q21); circle/sector measurement (B20 q11–13 + B28 q4–6/q22); polyhedron face/vertex properties; rotation-solid sections; solid surface/volume; frequency/relative-frequency; 2022 representative values.
- Planned exact curriculum: B20/B24 2015, B28 2022. Planned shared changes remain on branch only; no main integration.
- Current next: materialize Meta plan and restore B24 R1 Meta corrections; then finalize B20 → B24 → B28 files in order.


## SVG byte-drift audit scope — 2026-09-27

- B20 SVG drift vs extracted R1_INPUT: q8, q9, q13, q21, q22, q24; q9 reopens from R1 normal PASS because only its SVG byte set changed.
- B24 SVG drift vs physical CREATE/READY package: q8, q10, q21. q6/q7 branch SVGs match the package bytes but R1 records semantic repairs; q6/q7/q10/q21 remain deep.
- B28 SVG drift vs extracted R1_INPUT: q6, q13, q22; all three were already deep-review targets.
- Deep review denominator is now B20 22/24, B24 18/22, B28 21/24 (61 targeted items total); unchanged PASS items remain closure-scan only. Exact hashes/render findings will be added before exam closure.

## B20 bounded visual rechecks — 2026-09-27

- Reopened the R1 byte-drift items q9, q13, and q21 against the exact source PNGs.
- q9: corrected the hexagon angle SVG to place `x` at the source vertex, preserve the marked 90° angle, and derive the adjacent 130° interior angle from the 50° exterior angle.
- q13: corrected the leash diagram so the equilateral fence, tether vertex, initial 300°/6 m sector, and two added 120°/2 m sectors agree with the verified solution.
- q21: corrected the graph aid to show the source points (3,1200) and (3,240), both `y=400x` / `y=80x` lines, and the 6000 m intersections at 15 and 75 minutes.
- All three SVGs were opened through Chrome headless rendering and visually inspected. Targeted XML/schema validation and full B20 closure remain pending; no item is marked fully resolved until Meta and its associated checks close.
- Current checkpoint branch HEAD before this visual checkpoint: `1d5244405db63371a97b95a2a78daa1539d83295`. Current next: B20 q1–q8 binding/parity closure, then q11 source/Meta adjudication.

## B20 Meta re-adjudication — 2026-09-27

- q9 and q21 are closed as deep-review items after their source-parity SVG repairs. q13 remains open pending the shared sector/measurement Meta disposition.
- q22 was re-adjudicated from its source and final solution: `2x−10=(x−30)+80` is the triangle exterior-angle equation. The prior `TPL_M1_TRIANGLE_ANGLE_CHASE_INTERIOR_POINT_ANGLE_SUM` did not describe that decisive step; the JS now uses active `TPL_M1_TRIANGLE_ANGLE_CHASE_EXTERIOR_ANGLE_EQUATION`.
- This correction is a targeted R1/R2 Meta conflict recheck. q22 remains unresolved until the 2015 binding/crosswalk and compiled runtime checks pass.
- The q13 SVG was adjusted once more after its first browser render so the 300° arc is centered on the tether point and the fence masks the interior wedge; the final rendered SVG and XML check pass.
- Current branch HEAD before this checkpoint: `9bfb121a565e4cf1738637f55f52f513716dd666`.

## B24 bounded visual repairs — 2026-09-27

- R1's `q6`, `q7`, `q10`, and `q21` visual repairs are absent from the available CREATE/READY package, so I checked each image and final solution directly.
- q6 now shows radius 6/height 6 for A and radius 3 with a four-times-taller cylinder B; the equal-volume equation still yields 24 cm.
- q7 now shows a 144° sector of radius 5 cm, matching arc length 4π and a base radius of 2 cm; total surface area remains 14π cm².
- q10 now shows the large cone and removed small cone in exact 2:1 radius/height scale (4,6 and 2,3), supporting 32π−4π=28π m³.
- q21 now shows three radius-3 spheres fitting exactly in a radius-3 cylinder of height 18 cm; empty volume remains 54π cm³.
- All four SVGs passed XML parsing and Chrome headless renders were visually inspected. B24 items remain open until Meta and full exam validators close.
- Current branch HEAD before this checkpoint: `2f14894cb52d6d4198a963f60c59e858c74a8f99`.

## Cross-exam Meta adjudication draft — 2026-09-27

- Recorded 61 item-level disposition candidates in `R2E_META_ASSIGNMENTS.json`, grouped across the three exams. This preserves the shared decisions for circle/sector, polyhedra, rotation-solid sections, solid measurement, frequency/relative-frequency, and central tendency.
- New shared keys remain draft until current canonical schemas, exact bindings, RPM crosswalk rows, and source solutions validate together. The physical assignments are not yet applied to exam JS or metadata projection.
- B24 visual repairs are checkpointed, but B20 remains the active exam for terminal closure. The q23 Meta assignment is still draft until its recovered source geometry is carried through the final student solution.
- Current checkpoint branch HEAD: `bd8f8ec639a74db22a24757917d74c378e1e54f0`.

## Shared Meta application and B20 branch closure — 2026-09-27

- Applied the cross-exam taxonomy disposition to the active MIDDLE1 and MIDDLE_GEOMETRY owners, with the required FUNCTIONS_GRAPHS evidence support. Three machine L3s materialize locked RPM paths; the clustered sector, polyhedron, rotation, solid-measure, central-tendency, and relative-frequency L4s are active.
- Updated the target RPM crosswalk rows and exact curriculum/L1/L2/L3 bindings. The 61 deep assignments now have zero crosswalk, parent, or binding mismatches. `compile-meta-foundation --write` and `--canonical-only-check` pass with zero alias collisions, duplicate keys, broken parents, and unregistered keys.
- B20 q22 now uses the exterior-angle L4. q8/q9/q13/q21/q22/q24 visual source parity was reviewed; the repaired assets render and all referenced SVGs validate.
- B20 full-denominator checks: 24/24 UID/source joins PASS; 24/24 Archive2 records taxonomy-confirmed and eligible; 24/24 runtime records selectable; solution blank/control/LaTeX checks 0; protected fields parity 24/24; runtime catalog joins 24/24.
- B20's 22 deep-review items are resolved. Its exam-specific final commit is still pending; the upcoming shared Meta commit is separate. B24 visual repairs are checkpointed, while its R2E Meta adjudication waits for the B20 final commit.
- Latest user scope remains branch-only: no `main` merge, update, or `R2E_MAIN_FINAL` receipt.
- Current checkpoint branch HEAD before the shared Meta checkpoint commit: `3f30ed098b87440d319683e34e185a7c1a1b47da`.
