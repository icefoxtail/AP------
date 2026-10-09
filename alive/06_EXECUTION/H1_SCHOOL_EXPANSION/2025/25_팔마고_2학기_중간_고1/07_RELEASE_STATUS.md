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
- Main publication: `MAIN_DONE` at `26ab0d83dc0f6cbe393f038ace280c712b8d9e5b` (fast-forwarded from `5c63a37e9f247267ac54aaf060007fb0bc3f68e4` after merging latest `origin/main` into the branch). Branch and `origin/main` remote readback match; Consumer index, Consumer shard, generated L2 JS/Meta, and unchanged original source bytes were compared and matched. User limited scope to Palma and requested a pause for quality review after this exam.

The B02 q10 render HOLD remains excluded from student supply. This exam is closed; later exams remain deferred until the user resumes.


## CURRENT — 2026-10-09 GPT direct 27-candidate quality repair (supersedes content-quality claims only)
- Original 27 candidates are preserved. Previous 26 content PASS / 1 SVG render HOLD is historical, not final print-quality approval. Student Consumer count remains 4, other 23 remain nonselectable pending quality and exact projection gates.
- Seven candidate MD corrections: B01-0006, B03-Q14, B05-Q04, B06-Q05-C01/C02 and Q23, B07-Q01-BP01. English student solutions rewritten in Korean (4), quadratic orientation and math-stem wording corrected (1), set choice-prompt semantics corrected (1), numeric-only repeat training reclassified without new EXT-L4 promotion (1).
- B07 production JS, metadata, approved roster, Consumer shard and index were edited for 4 registered items. Source JS Git blob `dad260f085f3ddab162b1e7ca0ac6274e6b31bbf`, Consumer shard blob `bdb88f2681ced58c8d103fd99ae0ab3e02a5633a`, Consumer index blob `c8327052a0f2704f51e1b8e4cc9d37b394af58a2`. Current expected standardUnit=집합, subUnit=집합 핵심 개념, layoutTag=grid. q01 prompt is "다음 중 옳은 것은?".
- Pre-edit Chrome PASS 4 is **historical**; corrected bytes have **not** been actually rendered/Chrome-tested in this GPT session. Therefore the new edited artifact must not be called fresh RENDER_PASS / refreshed MAIN_DONE. All 23 held items remain held, including B02 q10 actual SVG render and unresolved exact RPM/PT/TPL projection. Codex has not been used for mathematical quality judgments.
