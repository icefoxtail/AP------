# M2 native proposal finalization v3

## Purpose

An immutable M2 review can identify a missing concept, template, or primary type while leaving the proposal unregistered. The v3 adapter lets the official registrar consume a separately reviewed definition and the exact selected application. It does not author a new question review, alter student content, assign new difficulty, or claim a second review pass.

The request opts in with `archive-native-proposal-finalization-v3`. Existing v1 and v2 contracts retain their own validators and refusal rules.

## Required evidence

Each selected UID has exactly one native semantic proposal. Selection binds the original document SHA, array index, stable proposal SHA, UID, ordinal, and original proposal identifier where present. The immutable native review must have a settled decision and no explicit content or difficulty hold.

The finalized disposition binds an original independent definition review. The original and normalized documents must agree on the native item, proposal, exact primary context, decision, immutable source snapshot, and complete renderer inventory. The registrar reads the actual Git objects and local evidence bytes, checks their hashes, and verifies the current protected student payload. Text-only items use an empty inventory; figure items require every referenced asset. This comparison does not turn a definition review into full mathematical QA.

The original native RPM record supplies the exact curriculum and semester. The adapter does not infer curriculum from a grade or reinterpret a historical crosswalk comparison as an approval.

## Supported dispositions

| Native proposal | Permitted registration |
| --- | --- |
| CC | Add one independently reviewed concept, or reuse an unchanged ACTIVE concept bound to its separately finalized prerequisite. Preserve the native primary type and template. |
| NEW_TPL | Add the exact reviewed template under its existing ACTIVE parent. Preserve the parent's definition and exact curriculum binding. |
| NEW_PT | Add the exact reviewed primary type, template, and one curriculum binding only when the native record explicitly has an unresolved primary and template with no exact binding. |

New definitions must be add-only records in their declared canonical owner. New template owners must agree with their parent. A new primary binding contains only the selected UID. Reused definitions retain their existing supporting-UID lists and content.

An omitted primary field is not an open-ended permission to choose a parent. The CC retention route requires the original source values and existing canonical UID support. A finalized NEW_TPL may also reuse a global parent when both immutable source snapshots and the current source contain that exact parent, the native record declares the parent ACTIVE with an unresolved template, and the native record contains exactly the same single ACTIVE curriculum binding. This route also requires the original independent definition witness and native classification/binding review. It does not modify the older unchanged-primary contract.

Missing auxiliary fields can only carry the original empty cross-concept/condition list or an unchanged explicitly reviewed integration value. The adapter cannot invent a value absent from the immutable sources. Rationale transport and source parity remain subject to the source-reassessment validator.

## Official registration and verification

The adapter returns evidence-bound field values to the official registrar. It does not write canonical tables directly. The registrar still checks request before-values, source parity, exact ACTIVE compiled bindings, out-of-scope preservation, runtime projection, and replay. Full build, consumer checks, actual main registration, and public deployment are separate required stages.

The regression suite covers each supported disposition and rejects witness omission, QA overclaims, proposal/UID drift, changed content or assets, incomplete inventories, wrong curriculum, altered definitions, missing owners, missing or expanded bindings, and native holds. The global-parent route has separate positive and missing/wrong-binding tests.
