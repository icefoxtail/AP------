# ALIVE and pipeline-core model routing

## Pipeline-core v2 default

New pipeline-core-backed jobs use the main worker for complete-job
orchestration, deterministic preparation, local generation/repair, and
machine evidence. They do not create one independent model task per batch,
question, or evidence axis.

The provider bridge is the only new external review launch path:

| Work | Execution |
| --- | --- |
| Source, candidate, local repair, STATIC, METADATA, RENDER_CAPTURE | Main worker and deterministic local tooling |
| provider-preflight | Zero-model control-plane attestation |
| FINAL_AUDIT | One provider launch over the complete frozen job through sealed U1/U2/U3 contexts |
| TARGETED_RECHECK | Past Exam: up to three independent provider launches after disposition-bound local repairs, restricted to computed impact; legacy profiles retain their stored allowance |
| Unchanged axes | Direct-root validated reuse receipt |
| Whole-job audit, v2 audit, release audit, hashing, packaging | Deterministic local tooling |

The provider plan must attest the model, external identifier, three distinct
session/context identities, builder separation, stateless input visibility,
and disabled subagent tools. A stateful conversation that has seen answers
cannot become blind by changing a label.

## Allowances and escalation

- FINAL_AUDIT is reserved once per work batch.
- TARGETED_RECHECK is the normal bounded recovery path. Past Exam reserves it
  only after a new disposition-bound freeze and may use at most three
  iterations; legacy profiles preserve their stored allowance.
- SECOND_AUDIT is never automatic. It requires explicit authorization and a
  reason of CONFLICT or HIGH_RISK, while sharing the same expensive slot.
- Provider transport failure, invalid attestation, or unknown state remains
  HOLD or DISPATCHED. It does not authorize a retry or fallback.
- Token budget, maxTokens, and missing provider usage are telemetry only.
  Numeric usedTokens may be retained; unavailable usage becomes null and never
  creates a token HOLD.

## Legacy ALIVE compatibility

The historical STAGED_EXAM, FAST_EXAM, STRICT_AUDIT, adaptive-staged, and
task-dispatch routes retain their old model descriptions for reconciliation
and explicitly requested compatibility runs. Their batch partitions and
queue metadata do not authorize a new provider launch under pipeline-core v2.

When a legacy route is explicitly selected, preserve its declared blindness,
producer identity, and bounded retry rules. Do not silently change route,
model, or reasoning effort because of capacity pressure. If its configured
Luna route is unavailable, report the routing blocker unless the user
explicitly authorizes a different model.

## Explicit manual audit

After automatic production, a user may explicitly request a separate
higher-cost manual audit. Keep that audit outside the routine generation Run,
store its evidence separately, and never mutate accepted artifacts or silently
turn a finding into PASS. Use Terra or Sol only when explicitly requested or
explicitly authorized for a bounded unresolved mathematical or visual
contradiction. If the audit finds a defect, preserve the audited Run and create
a fresh recovery Run linked to it. When the audit consumes the bounded
SECOND_AUDIT allowance, include the explicit authorization and CONFLICT or
HIGH_RISK reason required by AGENT_BUDGET.

## Independence

Independence comes from sealed input visibility, distinct session/context
identities, producer separation, and immutable evidence bindings. A different
model name alone is not proof of independent review. Never expose answers,
source solutions, builder notes, sibling outputs, or prior reviewer reasoning
to a blinded context.
