# ALIVE model routing

Use this cost-controlled profile for Codex subagents unless the user explicitly chooses another model or the requested model is unavailable.

## STAGED_EXAM automatic profile

`STAGED_EXAM` is the default whole-exam route. In the unified skill, a normal
whole exam uses four weighted balanced batches; model work is grouped by batch
and the CLI never calls a model for deterministic checks.

| Work | Model | Reasoning |
| --- | --- | --- |
| Complete first-draft batch | `gpt-5.6-luna` | `xhigh` |
| Flagged-batch revision | `gpt-5.6-luna` | `xhigh` |
| Independent whole-batch review 1 | `gpt-5.6-luna` | `xhigh` |
| Independent whole-batch review 2 | `gpt-5.6-luna` | `xhigh` |
| Student solution walkthrough inside review 1/2 | `gpt-5.6-luna` | `xhigh` |
| Mother solution-quality aggregation, state reducer, answer comparison, assembly, serialization, hashing, packaging | deterministic CLI | no extra model call |

The normal four-batch upper bound is four generation calls, four first reviews,
up to four revisions, and four final reviews. The solution walkthrough is a
second view in those same review calls, not an additional per-question agent.
A legacy `AUTO` run may use smaller contiguous batches only when explicitly
requested for compatibility or comparison; it is not the integrated default.
A batch with no findings is
copied through revision as `SKIPPED`. Do not split a batch into per-question
builder/verifier calls unless the user explicitly changes the operating mode.

## FAST_EXAM automatic profile

| Work | Model | Reasoning |
| --- | --- | --- |
| One complete question draft | `gpt-5.6-luna` | `xhigh` |
| One blinded independent solve and quality review | `gpt-5.6-luna` | `xhigh` |
| Exceptional extra blinded verification | `gpt-5.6-luna` | `xhigh` |
| Schema, answer comparison, reducers, assembly, serialization, hashing, packaging | deterministic CLI | no model judgment |

The baseline is two model calls per question. An exceptional third verifier is permitted only for the conditions defined in `fast-exam-workflow.md`. A failed question may be regenerated once; the engine must not enter an unbounded repair loop.

## STRICT_AUDIT automatic profile

| Work | Model | Reasoning |
| --- | --- | --- |
| Source analysis A/B and curriculum fingerprint | `gpt-5.6-luna` | `xhigh` |
| Plan A/B/C and plan critic | `gpt-5.6-luna` | `xhigh` |
| Candidate construction and bounded repair | `gpt-5.6-luna` | `xhigh` |
| Independent math verifiers I2/I3 | `gpt-5.6-luna` | `xhigh` |
| Fidelity, curriculum, anti-clone, difficulty, and distractor review | `gpt-5.6-luna` | `xhigh` |
| ESSENTIAL visual review and semantic render review | `gpt-5.6-luna` | `xhigh` |
| Parent orchestration that dispatches packets and invokes reducers | `gpt-5.6-luna` | `xhigh` |
| Packet preparation, reducers, adapters, serialization, hashing, packaging | deterministic CLI | no model judgment |

Neither mode escalates to Terra or Sol on its own. A Luna disagreement remains subject to the mode's fail-closed reducer and bounded recovery policy; model cost is not a reason to weaken or bypass a Gate.

## Separate manual audit profile

Run a higher-cost audit only when the user explicitly requests it after automatic production. Keep it outside the routine generation Run.

- Use `gpt-5.6-terra` with `xhigh` for a whole-exam or selected-question manual audit.
- Use `gpt-5.6-sol` with `xhigh` only when the user explicitly requests Sol or explicitly approves a bounded escalation for an unresolved mathematical or visual contradiction.
- Audit the frozen student-facing question, solution, answer, validation evidence, and render evidence without exposing one reviewer to another reviewer's reasoning.
- Save manual-audit evidence separately. Do not mutate accepted artifacts or silently convert an audit finding into PASS.
- If the manual audit finds a defect, preserve the audited Run and create a fresh recovery Run linked to it before regeneration.

## Invariants

- Different producer identities and blinded inputs establish independence even when I2 and I3 both use Luna. A model-name difference is optional diversity, not proof of independence.
- Never expose intended answers, source solutions, builder notes, sibling outputs, or prior verifier reasoning to an independent verifier.
- Do not weaken a Gate because Luna was used instead of Terra or Sol.
- If Luna is unavailable, stop and report the routing problem unless the user explicitly authorizes another model. Do not silently choose a higher-cost model.
- Record the route for every dispatched task. Do not add undeclared fields to validated artifacts.
- A user-specified model or reasoning effort overrides this cost profile, but not the artifact contracts, blinding rules, fail-closed reducer, or publication boundary.
