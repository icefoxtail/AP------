# Final closure gate

Use this gate after revision, assembly, external review, and packaging. The
input must be the final JS or the final ZIP, not an intermediate batch file.
The command reads the final artifact, requires complete per-question evidence,
and writes one immutable-style closure report. It is a validator, not a repair
step.

## Required evidence

The independent review ledger must contain one row for every question with
these statuses:

```text
structure, math, answer, solution, solutionArithmetic, latex, meta, asset, render
```

Each status must be `PASS` for a production closure. Missing, `WARN`, or
`NOT_TESTED` is not a final PASS. `math` is the independent answer calculation;
`solutionArithmetic` is a separate read of the solution that recomputes its
intermediate and final substitutions. This separation is what catches a line
such as `a+0.5=150` followed by `a=149`.

The render evidence must prove, for the final artifact, actual-browser and
production-engine checks for all three modes: `exam`, `solution`, and `answer`.
Every mode must cover the last question, have no render error, unrendered math,
overflow, or broken image, and include a screenshot.

External findings must be supplied as a list. An empty list passes. Every
finding must be marked `resolved`, `closed`, or `fixed`; an open finding blocks
closure.

For a universal A/B/C Run, also supply `variant-proof-ledger.json`. It must
contain `variantProofLedgerComplete=PASS` and one row per question with
`variant.status=PASS` and `variant.verifiedClass` equal to `VERIFIED_A`,
`VERIFIED_B`, or `VERIFIED_C`. The ledger is optional for legacy/B-only
closure, but once supplied it is a blocking gate.

## Deterministic checks

The command additionally checks strict JS/VM loading, sequential IDs, required
fields, solution non-blank, answer math delimiters, balanced `$...$`, raw
`<`/`>` inside math, common bare-math expressions, stale `기출` tags on similar
outputs, semantic question-type mismatches, canonical curriculum-method
policies (including continuity correction when a binomial distribution is
approximated by a normal distribution), supported exact arithmetic families,
referenced asset existence, and ZIP CRC/path safety. It does not claim to
replace an independent mathematical proof; that proof is required in the
review ledger. Exact verification is a capability lane: a question outside
its supported families is recorded as `NOT_APPLICABLE`, while a recognized
conflict is a hard failure.

```powershell
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py final-closure-audit `
  --input <final-zip> `
  --js-path <optional-zip-js-member> `
  --review-ledger <review-ledger.json> `
  --render-evidence <final-render-evidence.json> `
  --external-findings <external-findings.json> `
  --variant-proof-ledger <variant-proof-ledger.json> `
  --output <final-closure-report.json> --json
```

The command exits non-zero unless every global gate and every question row is
`PASS`. A final package is not approved merely because SVG preview or one
aggregate `22/23` summary passed.
