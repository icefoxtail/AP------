# M1 B01-B31 R2E worklog
- Start SHA: 
f53fffdf88d14731ac4313de33c881fde3327fdb
- Input branch SHA: 
92cf91b383d2e622c1c1aa22582e0903cc40da0a
- Denominator: 31 exams.
- Existing branch-final results: B20, B24, B28; no main integration yet.
- R1 source defect: B19 q6; source PDF and official answer key conflict with diagram measurements.
- Next: normalize all input ledgers and adjudicate only holds, repairs, proposals, migration gaps, source/SVG defects.
- Source recovery: B25 original and solution PDF located and rendered; denominator 24/24; R1 package recovered from physical source.
- B19 q6 remains HUMAN_REQUIRED: source measurements, tick marks, right-angle geometry, and official key do not establish a unique correct option; no corrective source found and derived-source producer is not implemented.
- Preexisting branch-final adjudication retained for B20/B24/B28; next only compare relevant frozen artifact/dependency hashes and integrate after closure checks.
- Latest main advanced post-start to 2a425e2a; relevant diff limited to shared resolver/final-gate/test code, reviewed; clean worktree moved forward before any production edit.

- B29: 24/24 R2E resolver and validator items PASS. Corrupt META_LEDGER was recorded; valid ITEM_LEDGER and REVIEW_LEDGER were used. Six solution SVGs were restored from frozen input, reviewed in desktop/mobile solution renders, and only q12/q22 text labels were moved to remove collisions; Q4 arc notation now renders with supported MathJax syntax.
- B29 receipt PASS. Current closed R2E set: 6 exams; 3 additional exams visually ready; interim single-commit main promotion requested by user. Continue B31 and remaining B01-B31 after the urgent promotion.

- After the interim main push, expanded RPM family crosswalks changed shared resolver hashes for B21/B22/B23/B26/B30. Reissued current resolver evidence and revalidated all six integrated candidates (B21/B22/B23/B26/B29/B30); every R2E receipt passes.
- B21/B22 solution visuals were freshly rendered at desktop/mobile, all 16 visual assets loaded, and item-specific alt/caption/large sizing was added without changing source image bytes. B21 Q22 retains the R1 repair and renders correctly.

- Latest main advanced to 1ac9b712 and normalized the RPM crosswalk. Re-materialized 72 R2E route rows against that snapshot, preserving source/R1 L2 where exact ACTIVE bindings exist, then regenerated B21/B22/B23/B26/B29/B30 resolver receipts; all six validators PASS. B21/B22 solution visuals were rendered at current large display sizes. Follow-up production promotion is pending.

- Interim archive aggregate commit 1623d065 and follow-up normalized-RPM resolver commit 9b988082fdc991f2098d197a6aa7846ff70747eb are on origin/main. Six exams B21/B22/B23/B26/B29/B30 have current resolver receipts PASS, byte parity on main, current runtime/catalog parity, and R2E_MAIN_FINAL receipts. B20/B24/B28 remain R2E branch-final pending main integration. Continue B25/B27/B31 and remaining B01-B31.

- Interim archive aggregate commit 1623d065 and follow-up normalized-RPM resolver commit 9b988082fdc991f2098d197a6aa7846ff70747eb are on origin/main. Six exams B21/B22/B23/B26/B29/B30 have current resolver receipts PASS, byte parity on main, current runtime/catalog parity, and R2E_MAIN_FINAL receipts. B20/B24/B28 remain R2E branch-final pending main integration. Continue B25/B27/B31 and remaining B01-B31.

- origin/main advanced to 77242953defe643a349c495535e76bfcaa96ef36 after interim promotion. The sole changed path was rchive/question-index-report.md; it does not affect the six R2E_MAIN_FINAL receipts or production artifacts. The durable state branch now includes that main commit.
