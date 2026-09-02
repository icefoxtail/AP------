# STRICT_AUDIT legacy workflow

This file describes the implemented high-assurance `R03`–`R17` engine. Use it only for an explicitly requested strict audit or a one-question proof Run. Natural-language whole-exam generation routes to `FAST_EXAM`; see `fast-exam-workflow.md`. Do not silently substitute this strict workflow for an ordinary whole-exam request.

## Commands

Run from the repository root.

```powershell
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py doctor
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py resolve --query "25년 금당고 2학기 기말 고1 19번"
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py start --query "25년 금당고 2학기 기말 고1 19번" --question 19
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py status --run <run-id>
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py resume --run <run-id> --source-file <relative-js-path>
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py prepare --run <run-id>
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py dispatch-start --run <run-id> --task <task-id> --external-id <agent-id> --route <model-route>
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py dispatch-fail --run <run-id> --task <task-id> --code <failure-code>
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py submit --run <run-id> --task <task-id> --file <artifact.json>
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py reduce --run <run-id>
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py adapt --run <run-id> --context <adapter-context.json>
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py serialize --run <run-id> --title <exam-title>
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py record-render --run <run-id> --file <actual-browser-evidence.json>
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py package --run <run-id>
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py freeze --run <run-id>
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py exam-preflight --source-file <relative-exam-js-path>
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py exam-start --source-file <relative-exam-js-path> --query "전체 유사 시험지"
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py exam-status --run <exam-run-id> --json
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py exam-sync --run <exam-run-id>
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py exam-assemble --run <exam-run-id> --title <exam-title>
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py exam-record-render --run <exam-run-id> --file <actual-browser-evidence.json>
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py exam-package --run <exam-run-id>
python .agents/skills/apmath-similar-question-pipeline/scripts/alive.py visual-render --spec <visual-spec.json> --output <asset.svg> --report <render-report.json>
```

Use `--json` when another script or agent consumes the result.

## Stage boundary

The current runtime implements:

```text
R00 REQUEST NORMALIZE
R01 SOURCE RESOLVE
R02 SOURCE LOCK + HASH
R03 SOURCE ANALYSIS A/B
R04 CURRICULUM FINGERPRINT
R05 PLAN A/B/C
R06 PLAN CRITIC
R07 CANDIDATE BUILD
R08 LOCAL CHECKS
R09 INDEPENDENT MATH I2/I3
R10 QUALITY GATES
R11 DISTRACTOR GATE
R12 FINAL REDUCER
R13 STRUCTURED QUESTION ADAPTER
R14 JS ARCHIVE SERIALIZER
R15 EXAM / SOLUTION / ANSWER REAL RENDER
R16 PACKAGE ROUND-TRIP
R17 LOCAL FREEZE
```

At each Phase 2 stage, run `prepare`, delegate every packet with exactly its allowed inputs, submit each artifact once, then run `reduce`. The reducer alone advances the stage. After `PHASE2_COMPLETE`, run `adapt` with canonical Archive metadata, `serialize`, collect actual production-engine browser evidence for all three modes, then run `record-render`, `package`, and `freeze`. Never mark a pending stage PASS manually.

For an explicitly requested strict whole-exam audit, repeat that loop across children until every child is `LOCALLY_FROZEN`; then run `exam-sync`, `exam-assemble`, the whole-exam browser Gate, and `exam-package`. Intermediate readiness states are checkpoints, not stopping points. After a process restart, context compaction, or bulk-dispatch error, reload manifests and task packets before acting. Submitted packets are complete regardless of whether the original agent call reported cleanly; dispatch only still-pending packets. A returned subagent id is evidence of a started task even when the surrounding batch call reports a capacity error.

Use capacity-safe waves of at most four agent tasks. Record each successful spawn with `dispatch-start` immediately, then fill the next slot. Do not launch a side-effecting wave with fail-fast `Promise.all`; use sequential spawn calls or an all-settled collector so one capacity error cannot erase successful agent ids. `agent thread limit reached` means stop filling the current wave, wait for and close the known `DISPATCHED` agents, reconcile task states, and continue. It is not a reason to end the user turn while runnable or dispatched work remains.

At R03, `sourceQuestionId` is packet-owned. Both analysts copy the packet's `sourceQuestionId` verbatim. Submission rejects a different value before the stage reducer runs.

The serializer writes a Run-local JS file and a non-published review shadow under `archive/_generated/alive-runs/`. It must not register that shadow in the production database or indexes.

Strict whole-exam generation/audit uses a parent Exam Batch Run with `E00`–`E06` stages. `exam-start` is fail-closed: if even one source question is outside the active adapter capability, the parent stops at `E01_PREFLIGHT` and creates zero child Runs. Archive aliases for an implemented response form, such as `단답형` for short answer, must be normalized before this capability decision; representation differences alone are not an unsupported question. When all questions are supported, run each child through the normal `R03`–`R17` loop, call `exam-sync`, then assemble, collect actual whole-exam browser evidence for all three modes including last-page coverage, and package. The whole-exam serializer preserves the source score annotations and total-points contract. Its review shadow is written under `archive/_generated/alive-exam-runs/` and remains unregistered.

```text
E00 EXAM SOURCE LOCK
E01 WHOLE-EXAM PREFLIGHT
E02 CHILD RUNS R03-R17
E03 WHOLE-EXAM ASSEMBLY
E04 EXAM / SOLUTION / ANSWER REAL RENDER
E05 PACKAGE ROUND-TRIP
E06 LOCAL FREEZE
```

## Mode defaults

```text
generationMode = EXAM_FOLLOWUP
followupKind = CONFIRMATION
operationMode = GENERATE
outputProfile = JS_ARCHIVE
expectedQuestionCount = 1
visualDependency = NONE
```

If the user requests ADVANCED, TYPE_BANK, STRICT_VARIANT, or visual generation before the relevant capability is implemented, create no downgraded output. Record the unsupported capability and stop.

`visual-render` is deterministic tooling, not a visual PASS decision. It records spec/asset hashes, renderer version, deterministic rerender PASS, and that no generative model was used. An ESSENTIAL visual candidate must save `visual.svg` and `visual-render-report.json` in its own draft directory. R10 then creates a separate `visual_evidence` packet for `alive_visual_reviewer`; only a complete PASS artifact with matching hashes may reach R12 and R13. Actual-browser image decoding remains mandatory at R15.

## Resume

An ambiguous Run is `BLOCKED` with `SOURCE_AMBIGUOUS` or `SOURCE_NOT_FOUND`. Resume it with an explicit repository-relative source JS path. Resume never overwrites the original request; it appends a resolution event and advances only R01/R02.
