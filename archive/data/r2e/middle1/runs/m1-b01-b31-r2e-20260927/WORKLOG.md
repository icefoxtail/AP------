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

- Urgent user-authorized M1 archive batch promotion is on origin/main: production batch 0bb9baf75d46290d25dd88569987f7c5df4daabb; B22 visual metadata follow-up fff5ceb942ed03a736dc2eeb62e8186b0b0b2db3; latest main 25e53c3f63df0950fd43834578209b66a16b76db.
- R2E_MAIN_FINAL is closed for B20, B21, B22, B23, B24, B26, B28, B29, and B30 (9/31, 29%). Each exam has byte-parity, current runtime/catalog/canonical/RPM hashes, a PASS R2E receipt, and durable physical ledger receipt/event/state.
- Visual QA followed 도형추출.md v3.0 §6-4 using actual desktop/mobile browser renders and inspected SVG/image crops; no clipping or label collision remains. B22 Q21 latest axis PNG render evidence is archived.
- origin/main advanced to 25e53c3f63df0950fd43834578209b66a16b76db; its post-promotion changes were audited and do not touch M1 R2E dependencies. Continue remaining 22 exams; B19 Q6 remains HUMAN_REQUIRED.

- All nine official rpm-active-resolver checks passed on their producer/main checkout. A separate state-worktree run exposed a Windows core.autocrlf raw-byte mismatch on several text authority refs; JSON values and Git blobs are unchanged. State-only line-ending edits were restored, and the checkout-specific validation caveat is recorded for continuation.

- origin/main advanced to 8dcc176eff3c1544cfcea95041600c505cad13c8; archive2 catalog index changed alongside registration artifacts, while M1 exam/asset, canonical Meta, crosswalk, runtime and engine dependencies remained unchanged. Rebuilt and self-checked all nine R2E_MAIN_FINAL receipts against latest main; all production artifact and visual report hashes still match.
