# Release status

- Source qids: 23/23 processed; source HOLD q11 and q16 remain documented and unchanged.
- Candidate pool: 27; independent content review PASS 26 / REJECT 0 / HOLD 1.
- Candidate HOLD: B02 Q10 actual SVG engine render pending.
- SHA-bound pre-registration roster: 4 APPROVED / 23 HOLD. Only the four approved B07 candidates have active candidate-specific PT/TPL mappings. The other 23 remain excluded; no L3/L4 taxonomy promotion is claimed.
- Generated Consumer DB: 4 Palma rows registered in `archive/data/generated-lite-consumer/v1/index.json`; prior 283 rows preserved, total 287. Actual Chrome lookup verified: 4/4 approved UIDs individually searched, opened and selected; previews withheld answers/solutions; held UID negative query returned 0.
- Consumer closeout evidence: `review-consumer-closeout.json`. `STUDENT_SUPPLY_VERIFIED=YES` for all four approved records; `MAIN_DONE` remains pending main publication and remote readback.
- Runtime UI change: approved generated-question search/open/select added; targeted test PASS 4/4; Archive2 Runtime Guard PASS 42/42; Chrome print-media DOM displayed all four selected questions without answer/solution, with native print dialog interception recorded.
- Answer position audit: unchanged before/after. Full pool 23 MC: ①–⑤ = 4/6/3/6/4; approved 4 MC = 0/1/1/1/1; held 19 MC = 4/5/2/5/3. Four constructed-response candidates excluded. See `review/ANSWER_POSITION_DISTRIBUTION.json`.
- Branch: `codex/alive-palma-25-h1-2mid`; UI code commit remote-readback previously completed at `3cd654e07448894a2c51c03cfc2c03b3993383ab`.
- Main publication: PENDING final scoped commit/push and `origin/main` readback; user limited scope to Palma and requested a pause for quality review after this exam.

Release remains pending final scoped commit/push and main remote readback by ROOT. The B02 q10 render HOLD remains excluded from student supply.
