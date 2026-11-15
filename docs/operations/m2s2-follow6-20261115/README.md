# M2 semester 2: six finalized applications and eleven existing approvals

This packet carries six previously reviewed metadata applications and preserves eleven existing FINAL_QA registrations after the same source files receive metadata edits. It does not create a new mathematical review, difficulty judgment, or curriculum inference.

The actual registered baseline is `aa3789e87da68ccd649d950946e8b06aca5d9754`. The input preparation parent is local integration `62182f7269af6827b29a3b194710729a2ead706e`; the first fixed input commit is `d710af0c1940ab28126c6d74e2a0e157316aeb92`. The already consumed main batch of 60 requests is not reintroduced.

## Owned scope

| Exam | New finalized application | Existing approvals preserved | Requests | Source questions |
| --- | --- | ---: | ---: | ---: |
| E004 | Q10: CC30 | 10 | 2 | 24 |
| E005 | Q12: centroid reuse | 0 | 1 | 24 |
| E026 | Q11 and Q15: CC30 reuse | 0 | 1 | 24 |
| E035 | Q12: centroid reuse | 0 | 1 | 21 |
| E054 | Q21: explicit 2015 primary/binding finalization | Q6 only | 2 | 24 |
| **Total** | **6** | **11** | **7** | **117** |

The 117 student payloads and the 111 source objects outside the six new applications are unchanged. The eleven preserved rows retain their approval values and identity records; their registration revision and source binding are renewed through the official sourceRebind contract.

Five of the six new applications had stale identity source fingerprints in the actual baseline. The official registrar updates only those fingerprint values, using the request's exact `identityBefore` and the independently revalidated current native source. Their UID, source path, ordinal, and student payload do not change. E004 Q10 needs no identity fingerprint update. These refreshes are recorded separately from metadata approval counts.

## Approval authority

E005 Q12, E026 Q11/Q15, and E035 Q12 retain the curriculum and primary values written directly in the immutable native `after` record. Their additional concepts follow the exact independently finalized REUSE_ACTIVE dispositions at `e083e32e6c4ecf4808401275e6520064d4436c8e`.

E004 Q10 retains its native primary. Its curriculum is the explicit `semanticRpm.originalCurriculum = 2022` in the ROOT-accepted native review, with matching immutable review SHA, CORRECT disposition, and registry context. Its exact CC30 definition/application was finalized at `1bd67bd03dfc299d371ea0e9ee55677bf4e9052a`. The matching primary binding was actually registered before this packet. The two source tag fields retain the previously verified official registrar-derived values; the fresh output confirms them again. Source `reviewStatus` stays `review_required`.

E054 Q21 uses only the exact PT, TPL, and 2015 binding approved in the independent e083 finalization. E054 Q10 remains unchanged and held. An `activeDefinitionMatch` candidate is not used to select an approval value.

All original native review documents, independent finalization documents, and renderer assets retain their original bytes. Current asset references and SHA-256 values are included in both request approval evidence and their relevant item evidence for immutable replay.

## Actual predecessors and definition order

The two source-only preservation requests bind actual baseline receipts:

| Prior receipt | Exact raw SHA-256 | Preserved UID count |
| --- | --- | ---: |
| `m2s2-binding68-20261115-E004.json` | `e43f9e990f208b15da7f3b870f8b825cce0eef39811a218270bbd8a831a9fa22` | 10 |
| `m2s2-binding68-20261115-E054.json` | `a18f410090151371e985798c80c1f5e1fa08f5bbc4308a1dbebcc9e47c489773` | 1 |

The preserved request items have empty `before`/`after` maps and no registry changes. Each scope equals its entire prior partial cohort. The full source denominator remains 24 in both cases.

| Definition provider | Consumers | Authority behavior |
| --- | --- | --- |
| Ready7 E023 centroid request | E005 Q12, E035 Q12 | The provider writes its exact approved ACTIVE definition first; the consumers verify REUSE_ACTIVE against it. |
| This packet's E004 CC30 request | E026 Q11/Q15 | The provider writes the exact CC30 definition first; E026 carries no registry addition. |

The official PR and actual main-writer dependency sorters both establish these edges even with reversed input order. No filename-based ordering or new definition approval is used. The E023 provider remains a pending input dependency, not an already registered main fact.

## Verification and remaining gates

The machine-readable reports in this directory distinguish the owned 17 UID from the complete local pending transaction of 47 UID. The other 30 are the existing Wangun23 and ready7 dependencies already present in the integration base; they must not be added again when combining task counts.

- `official-transaction-apply.json`: official dry/write results and the complete transaction boundary.
- `scope-and-native-verification.json`: owned source, metadata, identity, prior cohort, and AutoMeta checks.
- `definition-order-verification.json`: official provider ordering on the complete pending input set.
- `consumer-verification.json`: complete catalog and official replay/projection/changed-UID Consumer results.
- `held-nine-current-authority.json`: fresh actual-baseline read of the nine retained holds.
- `publication-manifest.json`: exact owned publication inputs and their hashes.

The complete catalog contains 1,211 source files and 28,882 questions. These are validation-input dimensions, not the count of newly completed registrations.

The immutable official shadow gate is `NOT_RUN_PENDING_ROOT_COMBINED`. Root will execute the complete union once, avoiding repeated extraction and repeated verification of the same inherited 30 UID. That gate remains required. Remote exact-head CI, actual main registration, deployment, and browser confirmation are also pending root integration; local registration evidence is not production completion.

No generated metadata, canonical registry output, runtime, catalog, or local registration receipt belongs to this publication packet.

## Retained holds

E015 Q7/Q8/Q10, E021 Q8/Q22, E048 Q14, E052 Q6, E054 Q10, and E058 Q9 retain their previous holds. Their actual metadata is unchanged from main034 to aa3789 and no new registration receipt appeared for them. The original-curriculum fields already present for E052/E058 do not by themselves resolve their retained-primary approval boundary.

Middle 3 semester 1 is excluded throughout.
