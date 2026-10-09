# H2 2015 Math I L2 projection: bounded authority request

**Status:** OPEN — semantic authority required before implementation. This is a technical continuation assessment, not a Meta classification or stage review.

**Binding:** worktree `C:\Users\USER\Desktop\AP-worktrees\h2-intake-batch01\AP------`, HEAD `3cecb45b2483ee1273a4b8a288f9b05ab91c9865`. The source packets are SHA-bound in [H2-MATH1-L2-technical-assessment.json](H2-MATH1-L2-technical-assessment.json): Gangnam R1 gap `221438fd6e075af1e7d70c5fc8b134d2ad3fe67ab12e278b27d68ba062ae01af`; Geumdang CREATE continuation `1a49e9fe06d03fddcb3116f4373ab3ddd56d8f129d9e2ea206275bb56c000d44`.

## Finding

The current master table defines `H15-M1-03` (지수함수) and `H15-M1-04` (로그함수) as L1 units and defines no official child subUnit rows. The compiled tag master has the same shape. The current H2 Math I crosswalk has only `subUnitKey: null` records for these parents, spanning binding-gap and RPM-only statuses. The R1 packet binds six new-target rows whose current values set `subUnitKey` equal to the parent; it records all six as unresolved. The CREATE continuation reports six unresolved L2 rows and a real generic-validator FAIL because the supplied null-L2 proof does not satisfy the validator's H2/2015/Geometry-only scope.

This is not a parser or serializer mismatch: the active resolver and generic validator intentionally scope the null proof to Geometry. Nor is there evidence of canonical drift: the current master and crosswalk agree that no child projection is registered. The Common Quality Contract's sentence to maintain existing parent-equals-subUnit compatibility values does not specify whether an unregistered, newly produced target is a qualifying existing value. That ambiguity cannot be resolved by technical code or by treating a new row as a legacy registration. Therefore no valid representation is proven and no technical repair is safe without an explicit semantic authority decision.

A non-empty parent-as-subUnit string might pass the generic artifact field-presence check, but that mechanical check is not Meta approval and does not create a registered canonical child. Likewise, reusing the Geometry null proof would weaken its explicit scope.

## Bounded decision needed

For exactly H2 + 2015 + `standardCourse=수학I` + `H15-M1-03` and `H15-M1-04`, the canonical Meta authority owner must select and define one representation:

1. Permit parent-equals-subUnit as a specific new-target compatibility projection, including the allowed labels and a rule that applies to these exact keys; or
2. Permit unresolved null L2 for these exact parents and define a dedicated resolver evidence/debt route; or
3. Require an officially registered child `subUnitKey` and supply/approve the child rows and mappings.

The decision must also state whether the current “maintain existing compatibility values” rule applies to newly registered exams. No course-wide H2 exception, other subject, or general null policy follows from this request. The current packet qids are Gangnam `[5,6,8,16,18,20]` and Geumdang `[4,6,7,12,17,19]`; the source item HOLDs remain with their stage workers.

After ROOT records the authority and approves exact files, the smallest repair is to change only the canonical authority/resolver/validator binding needed for that selected representation, add a bounded assertion for both parents, and rerun the affected artifact/Meta validation. Do not alter the quality contract version, silently accept all parent-equals-subUnit values, or add a generic H2 null exception. Preserve current source and freeze evidence until then.

## Registration path

H2 Math I and probability can use the existing full canonical-generator path, `prepare-target-registration.mjs` followed by `register-target-exam.mjs`, when the global generator checks pass. The bounded fallback `prepare-target-registration-candidate.mjs` currently accepts only `math2`, `geometry`, and H1 `수학(상)` display identities. It does not support H2 Math I or probability when global generation is blocked. Registration consumes already-approved embedded Meta and does not assign or repair L2, so extending that helper is outside this continuation.

## Disposition

No source, shared contract, validator, resolver, registry, or stage evidence was changed. No validator was rerun and no semantic verdict was manufactured. ROOT's next action is to obtain the bounded Meta authority decision above; then assign only the approved technical locus for repair and targeted revalidation.
