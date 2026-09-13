# 2020 매산고 고1 2학기 중간 — source correction ledger

## Source identity

- Source PDF: `D:/기출/(3)2중간/수학(하)/2020_매산고1_2중간.pdf`
- Source SHA-256: `sha256:d5bd4973fa604cd9de5f606e5c29e3c8354cbe0203ceca99358d72fcca27f34f`
- Full-page inventory: 6 pages / 20 questions
- Inventory coverage: q1–4 p1, q5–8 p2, q9–12 p3, q13–15 p4, q16–18 p5, q19–20 p6
- Source identity set and candidate identity set: 20/20 exact

## Documented source defects / conflicts

### q8 — non-unique prompt/choice defect

The full-page source gives `f(x)=x^2-2x` on `X={x | x≥k}` and asks for the value of real `k` making the function one-to-one. The independent condition is `k≥1`; the prompt does not ask for a minimum and the five choices are individual numbers. The attached solution sheet also stops at `k≥1`.

The candidate preserves the source wording and records answer `$k\\ge1$` with `source_defect_documented`. No individual choice is silently selected.

### q16 — source/solution conflict

The full-page source reads `g(x)=x^2-ax+a+10`. The attached solution sheet calculates as if the constant were `a+1` and reports `-12`. Independent solving against the source PDF gives

`f(t)=(t+2)(t+4)`, so `g(x)` must have minimum at least `-2`; hence `a+10-a^2/4≥-2`, or `2-2√13≤a≤2+2√13`, and `p×q=-48`.

The candidate keeps the source transcription, answer `$-48$`, and documents the answer/solution-source conflict in the student solution. The source bytes and protected content/choices are unchanged.

## Other corrections

- q8 extraction transcription was corrected from an initial `+7` hallucination to the full-page source `x^2-2x`; the extraction candidate was regenerated from the same frozen PDF inventory.
- q5 problem visual is a full-page-bbox crop only; q5 solution visual is a separate deterministic SVG asset.
- No production JS, DB record, or question-index row was written because final closure is blocked by provider/render evidence.
