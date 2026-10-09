# Target registration preparation: 23 금당고 수학II

**Status: OPEN — source commit/HEAD rebind and ROOT route confirmation required.** This is technical registration preparation only. No registry apply, source edit, metadata classification, stage review, or validator rerun was performed.

## Bound input

- Worktree: `C:\Users\USER\Desktop\AP-worktrees\h2-intake-batch01\AP------`
- Current HEAD after ROOT fast-forward and validator commit: `9d5686f3a09f156e15549a5a393a2ae7eb3215ea`; `origin/main` is `8a0feb54893e7f5913043032a12663c62cfa7595`.
- Promoted target: `archive/exams/original/high/h2/1mid/23_금당고_1학기_중간_고2_수학II.js`, raw SHA-256 `3b905a30464f7f056c0e67bd4eb0bfc23b856caf90c84847aa4f618313ffaf9a`, raw-buffer Git blob SHA-1 `e4192c46c79a3abdf4ff7e6a729f4cd0a470e31c`.
- At plan capture, `git status --short -- <target>` was `?? <target>`. ROOT subsequently staged the exact source: final readback at `2026-10-09T12:07:14+09:00` is `A`, index blob `e4192c46c79a3abdf4ff7e6a729f4cd0a470e31c`, and file raw SHA remains `3b905a30464f7f056c0e67bd4eb0bfc23b856caf90c84847aa4f618313ffaf9a`. HEAD was still `9d5686f3a09f156e15549a5a393a2ae7eb3215ea`; the source is staged but not committed. The target-only helper requires a clean tracked source and will not pass until ROOT commits and rebinds expectedHead.
- Parent fixed roster: `archive/analysis/h2-intake-batch01-20261009/roster.revision2.json`, SHA-256 `8d0cf270ff622ec8b8b905a431f5c30dd29a5c1683dc1f6a0f017c7da1534c18`. The target is parent row index 3 (order 5, qcount 20).
- A one-target registration subroster is prepared with explicit parent-roster SHA and row index: [registration-subroster.json](registration-subroster.json), SHA-256 `9653a7af4a0f893cc44e06277a2d3171a6f5d621d443355488a8550ae216cf88`.

## Existing release and Meta proof

The ROOT promotion packet is `ROOT.promotion.actual-v1.json`, SHA-256 `f46340add1f17ec2de2744a92985ab938137a004d31e16ec9b5a0977ebfd6a6a`; durable six-case render receipt is `ROOT.render-receipt.durable-v1.json`, SHA-256 `bcbb7edc445120e0bc3b4447b6049f5ae06003a9f974dbceef719a06ecc4391a`.

R1 evidence `R1.evidence.revision3.bound.json` has SHA-256 `e856ed826d7fbe6774851e3903a023a695435c07c427f8a5872735e39f05fb87`. Its existing raw R1_V2 report `R1.validator-report.v3.raw.json` has SHA-256 `84ec4a63ac6e000419b20ca040a3178efc0ec6b7d525901ca2bc878a5043f45d`: PASS, denominator 20, zero issues. The actual embedded Meta values and per-qid R1 Meta PASS statuses are projected without reclassification in [registration-r1-approved-meta-inventory.json](registration-r1-approved-meta-inventory.json), SHA-256 `8d4d740951f30ead4a7f629e8c584b28736987402a12dd83f095fd860235594a`.

The current nine registration baseline SHA-256s are in `registration-preparation-plan.json`. No baseline was modified.

## Isolated normal generator attempt

I ran `node archive/tools/build-question-index.mjs` against an isolated candidate archive, with `archive/exams` junctioned read-only to the assigned source tree and `archive/db.js` copied into the candidate. It exited 1 with the captured error:

```text
DB_SOURCE_PARITY_FAIL: missing in db.js (1): original/high/h2/1mid/23_금당고_1학기_중간_고2_수학II.js
```

The target is the sole missing path; no unrelated row or DB baseline was adjusted. This attempt was at HEAD `3cecb45b2483ee1273a4b8a288f9b05ab91c9865`, before ROOT’s fast-forward and validator commit. The input `archive/db.js` SHA-256 was `f906ec6c3c7acc2d86ade9b80e6b916085de948b6e221e83e851e7c801cb9e0e`. Raw stdout/stderr are preserved at `normal-generator-attempt-01.stdout.raw.txt` and `normal-generator-attempt-01.stderr.raw.txt`; stderr SHA-256 is `93339d209ad3897047bfbd053c6ade0f6292f9a963bb9f4e72864ef0d93081a6`.

## Exact next prerequisite and commands

ROOT must commit the already-promoted source and this authorized durable preparation evidence so the target is clean and tracked. I did not change the source, Git index, or HEAD. After that commit, ROOT must use the new `expectedHead`; the old HEAD cannot be reused. The source raw/blob SHAs and current R1 evidence/report SHAs above remain the bindings.

```powershell
git add -- archive/exams/original/high/h2/1mid/23_금당고_1학기_중간_고2_수학II.js archive/analysis/h2-intake-batch01-20261009/23_금당고_1학기_중간_고2_수학II/technical-registration
git commit -m "Register release-ready 23_금당고 수학II source"

git worktree add --detach .tmp/archive/h2-intake-batch01-20261009/23_금당고_1학기_중간_고2_수학II/registration-canonical-root <new-expected-head>
```

Before running the bounded math2 producer, ROOT must create the SHA-bound producer authority and final assignment for subroster index 0, binding the post-commit HEAD, current source raw/blob SHA, the locked subroster SHA above, R1 evidence/report SHA, and six release asset SHA values from the ROOT promotion packet. The producer call shape is:

```powershell
node archive/tools/prepare-target-registration-candidate.mjs --root . --authority archive/analysis/h2-intake-batch01-20261009/23_금당고_1학기_중간_고2_수학II/technical-registration/ROOT.target-registration-producer-authority.json --roster archive/analysis/h2-intake-batch01-20261009/23_금당고_1학기_중간_고2_수학II/technical-registration/registration-subroster.json --roster-index 0 --assignment .tmp/archive/h2-intake-batch01-20261009/23_금당고_1학기_중간_고2_수학II/registration.assignment.json --r1-evidence archive/analysis/h2-intake-batch01-20261009/23_금당고_1학기_중간_고2_수학II/R1.evidence.revision3.bound.json --r1-validation archive/analysis/h2-intake-batch01-20261009/23_금당고_1학기_중간_고2_수학II/R1.validator-report.v3.raw.json --candidate-root .tmp/archive/h2-intake-batch01-20261009/23_금당고_1학기_중간_고2_수학II/registration-canonical-root --index-root .tmp/archive/h2-intake-batch01-20261009/23_금당고_1학기_중간_고2_수학II/registration-index-root --evidence-root archive/analysis/h2-intake-batch01-20261009/23_금당고_1학기_중간_고2_수학II/technical-registration/producer-evidence --package-output .tmp/archive/h2-intake-batch01-20261009/23_금당고_1학기_중간_고2_수학II/registration-package.json
```

The current helper requires a clean target source, exact candidate-root HEAD, all nine unchanged registry baselines, ROOT-target authority, the locked roster binding, and an R1_V2 PASS. It must run without `--apply`; ROOT owns the later registry apply, publication, and readback. The current global parity failure names only this new target, while `CODEX_MAINTENANCE.md` describes the bounded producer for ROOT-authorized fixed-roster work when unrelated tracked failures block global generation. ROOT should confirm that the documented route covers this target-specific missing DB row before invoking it.

Candidate worktree HEAD is deliberately not frozen yet. No helper, registry apply, source commit, or stage validator was run in this continuation.

