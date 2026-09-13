# FINAL_CLOSURE — 2020 매산고 고1 2학기 중간

## Result

The fresh candidate was built from the D-drive source and independently audited through all three provider phases. The provider FINAL_AUDIT itself completed successfully on a new launch from `b607a13b5`; the archive remains fail-closed at FINAL_CLOSURE because the audit found unresolved source/question defects and the prepared run is missing the V2 closure references required for production promotion.

- Candidate: `archive/_generated/past-exams/_manual/20_매산고_2학기_중간_고1_기출_fresh_393877dda/candidate/20_매산고_2학기_중간_고1_기출.candidate.js`
- Candidate SHA-256: `sha256:ed86303ef9a4f33432afc4528cad079ac4661050841874802a928a866a95afe2`
- Fresh START_SHA: `b607a13b5144b88097e3cee5d31b3b7785e6092b`
- Final audit launch: `past20-maesan-final-b607a13b5-r9:1`
- U1/U2/U3: all responses present; receipt status `COMPLETED`
- Machine evidence: 20/20 questions, 40 machine evidence files

## Why U1 originally failed

The first apparent U1 failure was not a model or source failure. The adapter initially read the app-server `turn/start` response as if it were the Turn object itself. The current app-server v2 contract returns `{ turn: Turn }`, so the adapter stored `turnId=undefined`. It then could not match the emitted `turn/completed` notification and continued history recovery until transport timeout. The preserved r4 raw trace contains the completed turn and the mismatch-driving history errors.

The repair lineage also fixed the earlier schema-envelope and output-recovery defects. All related provider contract tests passed at each repair point.

## Remaining blockers

The completed independent audit found:

- q5 depends on a diagram whose content was not independently visible to the blind source-only auditor; path/hash-only asset metadata is not enough for a semantic pass.
- q8 is non-unique as supplied: injectivity holds for a range of `k`, while the source choices demand one value.
- q11 has ambiguous quantified conditional wording and does not determine the intended minimum without source rewriting.
- q16 has an unresolved conflict between independent recalculation and the attached source solution.
- U2 had no render witnesses for the current candidate, so render closure is not proven.

The canonical V2 audit is also blocked because the prepared run lacks `auditorPacketRefs`, `buildWorkLedgerRefs`, `questionQualityClosureSetRef`, `examReleaseClosureRef`, and `sourceAuthority.applicability`. Those refs cannot be fabricated without changing the pipeline contract.

No production JS was written, and the database/question index were not updated. No gate was relaxed, no synthetic PASS was created, and no frozen job was resumed. A legitimate continuation requires source-level adjudication/repair for q8, q11, and q16, visual/render evidence for q5 and the full candidate, then a new targeted recheck and completion of the V2 closure refs.
