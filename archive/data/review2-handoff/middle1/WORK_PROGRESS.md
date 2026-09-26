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
