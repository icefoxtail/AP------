# B02 CREATE receipt — 25 팔마고 고1 2학기 중간 / 집합의 연산

## Scope and source lock

- Worktree: C:\Users\USER\Desktop\AP-worktrees\alive-palma25-h1-2mid\AP------
- Branch: codex/alive-palma-25-h1-2mid
- Source: archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js
- Source Git blob SHA-1: 4cfce909c023e5c4df4a759945c8cc3e0a63ec76
- Source file SHA-256: 1C7C2C331464AA214331D844E32F9378C86654B1B8E495C8C3CDF759B26BEAEF
- Exclusive B02 source qids: 8, 10, 16, 20
- Primary L1/L2: 집합과 명제 → 집합의 연산
- Actual model / effort recorded for this creator route: gpt-6-luna / max
- The original JS, shared manifest, adaptive plan, ledger, and production files were not edited.

## Blueprint exploration and qid disposition

| sourceQid | Blueprint decision | Draft candidate | Source-qid disposition |
|---:|---|---|---|
| 8 | ACCEPT — exact-one cardinality for divisibility-defined sets; compute LCM overlap and subtract it from both exclusive parts | ALITE-PALMA25-H1-2MID-B02-Q08-BP01 | Covered by one complete draft |
| 10 | ACCEPT — combine the pairwise-overlap regions involving B into one union, including the triple-overlap sector once | ALITE-PALMA25-H1-2MID-B02-Q10-BP01 | Covered by one complete draft |
| 16 | HOLD — prompt condition uses B⊂{U−(Aᶜ∪Bᶜ)}, while the source solution drops the outer braces and treats it as B⊆A∩B | none | Source-level HOLD preserved; no candidate created |
| 20 | ACCEPT — bound the unknown intersection, then extremize the exact-one membership count, reversing the endpoints | ALITE-PALMA25-H1-2MID-B02-Q20-BP01 | Covered by one complete draft |

Explored duplicate/drift dispositions:

- q8: repeating the union-cardinality source structure is DUPLICATE. Counting neither set is the same inclusion-exclusion count followed by a complement. A one-sided set-difference prompt changes the source’s proposed primary L3 to 여집합과 차집합 and was not produced for this seed.
- q10: a new one-cell Venn prompt is DUPLICATE of the source. A symbolic nested De Morgan problem changes the proposed source primary L3 from 교집합과 합집합 to 집합의 연산법칙, so it is L3_DRIFT and was not used for q10.
- q16: source ambiguity blocks every derivation that depends on the premise. No repair or reinterpretation was attempted.
- q20: asking again for intersection extrema is DUPLICATE of the source. Counting neither program is a direct affine complement of the same union-bound structure and was not counted as a distinct blueprint.

## Counts and answer placement

- Accepted distinct semantic blueprints: 3.
- Complete candidate instances: 3, one per accepted blueprint.
- Numeric-only sibling variants: 0.
- Source-qid coverage: 4/4 assigned qids dispositioned; 3 have draft candidates, 1 remains source HOLD.
- Multiple-choice placement plan: q8 → ④; q10 → ②. Histogram: ① 0, ② 1, ③ 0, ④ 1, ⑤ 0. q20 is constructed response and excluded from the position denominator. No candidate has a choice-order lock.

## Visual, review, and release status

- Source q10 image was opened at original resolution. Locked path: archive/assets/images/25_팔마고_2학기_중간_고1_기출/q10.png. SHA-256: FAF23A3E032087CAE6FB7FA5F08D14F7F385700E1F40E4C1EA75CCD35DE05037. It shows the A∩B region outside C shaded.
- Candidate q10 requires a new Venn diagram. SVG path: alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/candidates/B02_집합의_연산/visuals/B02_Q10_VENN.svg. SHA-256: C8AD60988107F1C78766B72E46411A1EB7F08DCDF30B9790FF0F3A45CE421920. Render status: NOT_RUN.
- q8 and q20 require no figures; visual rendering is NOT_REQUIRED.
- Independent student-only review: NOT_STARTED. The separate review-blind packet is in ../../review-blind/B02_STUDENT_ONLY.md.
- Independent math, Meta, difficulty, and render PASS are not claimed. Creator self-check only.
- Candidate publication, canonical promotion, source edits, commit, and push were not performed.

## Candidate files

- B02_Q08_EXACTLY_ONE_MULTIPLES.md
- B02_Q10_VENN_REGION_UNION.md
- B02_Q20_EXACTLY_ONE_RANGE.md
- ../../review-blind/B02_STUDENT_ONLY.md

