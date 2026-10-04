# Method lock and correction loop

This reference defines the two V2 quality controls that are specific to the
adaptive experiment. It does not replace the canonical `docs/rules` pack; the
compiled per-question snapshot points back to that authority.

## 1. Per-question Method Profile

At Run start, merge each preflight item with its materialised
`source/student/qNNN.json` payload and compile:

```text
source/method-profiles.json
```

Each profile records:

- canonical course and `standardUnitKey`;
- allowed core methods;
- required route evidence groups;
- unambiguous forbidden core methods;
- theorem-justification rules where a named shortcut needs a student-facing
  derivation.

The task packet exposes only the profiles for its assigned ordinals. The model
must use them to choose the student-facing route. The accepted candidate also
records `solutionMethodReview`, but the deterministic gate recomputes it from
the final solution and does not trust that self-report.

The gate is deliberately layered:

1. An unmapped canonical unit is `HOLD` at start.
2. The deterministic linter rejects an unambiguous forbidden core method, such
   as `벡터의 행렬식` in a high-school line-equation solution, before artifact
   acceptance.
3. It checks that the explanation contains evidence of the unit's allowed
   route and that triggered named relations have a justification.
4. Independent review still decides semantic use. A keyword that appears only
   in a warning or negated sentence must not be treated as proof of a method;
   the linter therefore limits checks to the explanatory route and review stays
   authoritative for ambiguous cases.

For `H22-C2-02` line-equation items, the safe route is coordinate geometry:
slopes, line equations, perpendicular/parallel relations, intersections,
point-to-line distance, and base-height or an explicitly allowed coordinate
area derivation. Vector determinants and inner products are not core methods.

For `H22-C2-03` circle items, if the solution invokes the projection relation
`CM=CA^2/PC` or names the projection theorem, it must also show the similar
triangles, Pythagorean derivation, or an equivalent student-reproducible
justification. A correct final number alone is not enough.

## 2. Approval and correction state machine

The adaptive Run is fail-closed:

```text
source visual dependency
  → actual semantic/browser inspection for every affected ordinal
  → S02 generation
review2 non-PASS
  → MANUAL_REVIEW_REQUIRED
  → correction-start
  → affected-batch repair only
  → fresh independent correction review
  → repeat if needed
  → mother final
  → browser exam/solution/answer
  → package round-trip
  → approval candidate
```

The source visual step is a hard pre-generation gate. Its normalized evidence
is stored as `source/visual-inspection.json` and binds each screenshot to the
asset hashes from the Run's visual reconnaissance. It must cover diagrams,
graphs, tables, images, and SVG-backed questions before any builder task is
dispatched.

`correction-start` never rewrites the original revision or review2 evidence.
It creates a unique `repair-NN` builder task and, after acceptance, a unique
`repair-review-NN` reviewer task for only batches containing unresolved review
or method findings. Unaffected batches retain their passing evidence.

The correction builder receives the exact finding, current candidate, current
student solution view, and the relevant Method Profiles. It must return the
whole assigned batch so unchanged questions remain hash- and order-checkable.
The adaptive reducer promotes a repair review into the active `review2` slot
only after its artifact is accepted.

Any non-PASS result leaves the Run at `MANUAL_REVIEW_REQUIRED`. V2 permits at
most three correction cycles per Run; exhausting that budget produces a
manual hold, never an approval. Approval requires all active review2 items to
be PASS, `studentCanFollow` to be true, the mother final to PASS, actual
browser evidence for exam/solution/answer, and a package round-trip PASS.

Render failures use the same closure path. A structured `record-render`
failure is preserved as `render/render-failure-NN.json`, changes the current
stage to `S08_RENDER_REVIEW`, and supplies affected ordinals to
`correction-start`. Once the repair review passes, the parent must assemble
again and collect a fresh three-view browser result; the prior failed render
evidence remains immutable history.

## 3. Operational commands

```text
python .agents/skills/apmath-similar-question-pipeline-adaptive/scripts/adaptive_alive.py correction-start --run <run-id> --json
python .agents/skills/apmath-similar-question-pipeline-adaptive/scripts/adaptive_alive.py status --run <run-id> --json
python .agents/skills/apmath-similar-question-pipeline-adaptive/scripts/adaptive_alive.py record-visual-inspection --run <run-id> --file <evidence.json> --json
python .agents/skills/apmath-similar-question-pipeline-adaptive/scripts/adaptive_alive.py record-render --run <run-id> --file <evidence.json> --json
```

Dispatch only the tasks shown in the current queue. Keep the fixed
`gpt-5.6-luna/xhigh` route. Do not dispatch a later stage, render, assemble,
or package while the correction stage is pending or held.
