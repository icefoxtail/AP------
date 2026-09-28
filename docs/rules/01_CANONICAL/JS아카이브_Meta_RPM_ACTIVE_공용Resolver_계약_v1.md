# JS Archive Meta RPM→ACTIVE 공용 Resolver 계약 v1

- 상태: ACTIVE
- 적용: 신규 JS 생성, 3차 Meta 검수, advanced Meta repair, R1/R2E receipt 검증, runtime·Archive parity audit
- 실행 구현: `archive/tools/meta-foundation/rpm-active-resolver.mjs`
- decision evidence builder: `archive/tools/meta-foundation/build-rpm-active-resolution.mjs`
- validator CLI: `archive/tools/meta-foundation/validate-rpm-active-receipt.mjs`

이 문서는 L3/L4·CrossConcept·Condition·IntegrationPattern·difficulty를 생성·검수·수정·폐쇄하는 모든 ACTIVE 경로의 공통 계약이다. 각 파이프라인은 semantic 규칙을 복제하지 않고 resolver를 호출하거나 resolver가 만든 SHA 결속 evidence를 deterministic validator에 전달한다.

## 1. 단일 판정 흐름

```text
current source + independently verified final student solution
→ decision-isolated semantic judgement
→ RPM Primary README → CANONICAL_MASTER → exact curriculum/scope view
→ exact RPM L3/L4 path
= RPM_SEMANTIC_FINAL
→ exact grade/subject crosswalk
→ GLOBAL ACTIVE PT/TPL + binding projection lookup
→ projectionStatus(PROJECTION_REUSE / PROJECTION_BINDING_PENDING / PROJECTION_UNMATERIALIZED / META_ONLY_COMPATIBILITY_PENDING)
→ separate fresh difficulty blind pass
→ deterministic Meta validator receipt
→ runtime / Archive parity
```

**RPM L3/L4가 deterministic하게 확정되는 순간 semantic classification은 FINAL이다.** crosswalk/PT/TPL/binding은 그 semantic을 기존 machine-key consumer에 투영하는 compatibility layer이며, projection gap은 semantic HOLD가 아니다.

Semantic first pass는 source identity, content/choices/image reference hash, verified solution hash, curriculum/L1/L2, `primaryMethod`, `decisiveStep`만 사용한다. same-stage candidate의 `problemTypeKey`, `templateKey`, CrossConcept/Condition suggestion, 이전 verdict, heuristic/tag-enrichment 결과는 입력하지 않는다.

## 2. Resolver API와 evidence

Resolver 입력은 `sourceIdentity`, `solutionIdentity`, `curriculumContext`, `semanticDecision`의 명시 필드만 허용한다. 결정 단계에서 `problemTypeKey`, `templateKey`, CrossConcept/Condition key, difficulty, candidate, heuristic, 이전 판정 필드는 거부한다.

최소 identity:

- `sourceArchiveFile`, `questionUid`, `sourceOrdinal`
- canonical `sourceIdentityKey` alongside `questionUid`; both refer to the same frozen source UID, and `questionUid` must be the canonical file/ordinal UID
- `contentHash`, `choicesHash`, `imageRefHash`, `sourceFingerprint`
- `solutionIdentity.status=VERIFIED_FINAL`, `independentVerification=true`, `solutionHash`
- `curriculum`, `grade`, RPM `scope`, `standardUnitKey`, `subUnitKey`
- semantic `primaryMethod`, `decisiveStep`, RPM L3/L4 path

Resolver 출력은 RPM path/L3/L4와 **`semanticStatus`**, 실제 crosswalk file·row/status, 기존 ACTIVE PT/TPL/binding projection과 **`projectionStatus`**, `sourceFingerprint`, `inputBundleSha`, authority file hashes, `evidenceSha`를 포함한다. semantic status와 projection status를 하나의 HOLD/disposition으로 합치지 않는다. `build-rpm-active-resolution.mjs`는 독립 judgement input에서 resolver 결과와 validation receipt를 생성한다. 각 검수/repair/R2E 단계는 같은 resolver 결과를 UID와 SHA로 결속한다.

## 3. Disposition

Resolver는 semantic과 projection을 분리한다.

### 3.1 Semantic status

| `semanticStatus` / disposition | 조건 | R1/R2E 영향 |
|---|---|---|
| `FINAL` / `RPM_SEMANTIC_FINAL` | source+verified solution으로 unique RPM L3/L4를 deterministic하게 확정 | semantic PASS; projection은 별도 조회 |
| `HOLD` / `TRUE_META_HOLD` | source/solution으로 경로를 결정할 수 없거나 RPM path가 없거나 모순되어 결정 불가 | true semantic HOLD 가능 |
| `UNAVAILABLE` / `ROUTE_OUT` | RPM authority 또는 route input을 사용할 수 없음 | operational route 처리; semantic FINAL 아님 |

### 3.2 Projection status

| projectionStatus | 조건 | semantic 영향 |
|---|---|---|
| `PROJECTION_REUSE` | 기존 PT/TPL 및 필요한 exact binding을 안전하게 사용 가능 | compatibility projection 사용 가능 |
| `PROJECTION_BINDING_PENDING` | PT/TPL 의미는 맞으나 exact curriculum binding이 없음 | **META_ONLY, HOLD 아님** |
| `PROJECTION_UNMATERIALIZED` | RPM path는 FINAL이나 안전한 legacy PT/TPL projection이 없음 | **META_ONLY, HOLD 아님** |
| `META_ONLY_COMPATIBILITY_PENDING` | projection choice/compatibility 처리가 남음 | **META_ONLY, HOLD 아님** |
| `NOT_ATTEMPTED` | semantic HOLD 또는 route unavailable | projection 미평가 |

crosswalk의 `DIRECT_ACTIVE/FAMILY_ACTIVE`는 주로 `PROJECTION_REUSE`, `*_BINDING_GAP`은 `PROJECTION_BINDING_PENDING`, `RPM_ONLY`는 `PROJECTION_UNMATERIALIZED`의 lookup hint다. **crosswalk status가 semantic status를 결정하지 않는다.** `RPM_ONLY`, exact binding 부재, `DIRECT_BINDING_GAP`, `FAMILY_BINDING_GAP`은 RPM semantic FINAL과 양립한다.

legacy schema에서 `RPM_PRIMARY_MIGRATION_GAP`을 유지해야 하면 `BINDING_PENDING/UNMATERIALIZED`의 compatibility alias로만 사용하며 `ADVANCED_META_HOLD`, `R2_ADJUDICATION_REQUIRED`, `resolvablePending>0`로 승격하지 않는다.

canonical ownerPack과 curriculum binding ownerPack이 다른 것은 정상 cross-pack projection이다. GLOBAL ACTIVE canonical uniqueness와 exact curriculum binding은 각각 독립 검증하며 owner 차이를 conflict로 처리하지 않는다. 실제 populated PT/TPL/CrossConcept/Condition key가 invalid이면 invalid canonical projection 오류로 별도 기록한다. 이는 projection status나 RPM semantic hold와 합치지 않는다.

### 3.3 R2E v3

R2E v3 release authority에서 projection gap은 `META_ONLY`다. `semanticStatus=FINAL`인 문항은 projection gap만으로 R1 READY, R2E_FINAL, R2E_MAIN_FINAL을 막지 않는다. TRUE semantic HOLD와 production에 실제 기록된 invalid canonical key만 해당 Meta gate를 막을 수 있다. Receipts는 RPM semantic completeness와 legacy projection completeness를 별도 집계하고, `resolvablePending`에서 projection pending을 제외한다.

## 4. Difficulty blind pass

Difficulty는 `JS_ARCHIVE_DIFFICULTY_BLIND_EVIDENCE_v1`로 L3/L4 semantic pass와 분리한다. source fingerprint와 verified solution hash에 결속된 fresh independent pass, bucket 1–5, confidence, boundary flag, legacy compatibility, rationale, reviewer/decision provenance를 요구한다. 기존 `level`은 blind 판정 입력이나 bucket 변환식으로 사용할 수 없다. legacy level은 fresh bucket 결정 뒤 비교 evidence로만 허용한다.

## 5. Finalization·validator·runtime

`validateMetaFinalization`은 source-solution identity, RPM semantic evidence, difficulty evidence, relational provenance, resolver evidence SHA와 populated canonical key validity를 확인한다. `PROJECTION_REUSE`일 때만 exact binding과 full PT/TPL projection parity를 요구한다. Projection pending에서 binding 부재는 HOLD나 semantic unresolved가 아니며, production에 실제 기록된 invalid canonical key는 별도 오류로 남긴다. `validatorReceipt`는 `inputEvidenceSha`, `validationResultSha`, `runSha`를 포함하고 현재 evidence에 대해 다시 계산된다. `makeMetaValidatorReceipt` 또는 CLI가 발급한 PASS receipt가 없으면 semantic FINAL 증명이 유효하지 않다.

runtime 및 Archive projection은 UID/source fingerprint, canonical advanced fields, resolver evidence SHA, difficulty evidence SHA가 일치해야 한다. 과거 runtime은 기존 조회를 유지하되 새 resolver provenance가 없으면 `LEGACY/UNVERIFIED`로 관찰한다. 기존 production 전체를 이 계약만을 이유로 일괄 수정하지 않는다.

## 6. BASIC eligibility 분리

Source identity/fidelity, independent math, 학생용 해설, solution quality, L1/L2, serialization이 PASS이고 populated advanced key가 canonical-valid이면 RPM semantic FINAL + projection pending이어도 `BASIC_ARCHIVE_ELIGIBLE=true`가 가능하다. `ADVANCED_META_ELIGIBLE`은 필요한 PT/TPL/binding projection이 검증됐을 때만 true다. Exact binding 부재만으로 populated PT key가 invalid가 되지는 않는다. Candidate/deprecated key는 production promotion 전에 거부하며, invalid canonical key가 실제 production에 기록된 경우 release blocker로 보고한다.

## 7. 기존 경로

- 신규 Past Exam은 `completion-contract.json`의 resolver-backed sidecar와 BASIC/ADVANCED 분리 gate를 사용한다.
- 3차검수·Meta repair·Meta promotion은 `rpm-active-resolver.mjs` 및 CLI를 공통 호출한다. R1 v1 resolver-backed receipt와 legacy R2E v1 receipt는 기존 `JS_ARCHIVE_R2E_META_INPUT_RECEIPT_v1/v2` 및 `JS_ARCHIVE_R2E_META_RECEIPT_v1`로 검증한다.
- 신규 R2E v3의 release authority는 `JS_ARCHIVE_R2E_FINAL_RECEIPT_v2`다. R1 input과 Meta sidecar는 read-only로 소비하며, `RPM_PRIMARY_MIGRATION_GAP`과 다른 metadata-only findings를 `META_ONLY`로 기록한다. HOLD group mapping이 production Meta field를 바꾸는 경우에만 해당 UID의 resolver/validator/runtime consumer를 targeted 검증한다. Resolver의 semantic disposition을 약화하거나 임의 key를 만드는 권한은 부여하지 않는다.
- 1차검수는 field presence/type/evidence/provenance의 read-only 상태만 확인한다. 2차 수학검수는 semantic Meta engine이 아니다.
- tag-enrichment는 L1/L2/subUnit hint와 inventory만 만들며 advanced Meta/difficulty를 분류하지 않는다.
- js-bank-cleanup은 advanced Meta를 read-only audit한다.
- `Archive_Reviewed_Apply_Bridge_v1`는 sealed legacy recovery만 유지한다. 신규 repair는 schema v3 resolver evidence를 요구한다.
- Similar-question은 새 문항의 decisive step으로 의미를 다시 판단하고 source Meta를 무비판 상속하지 않는다. Visual skill은 routing만 한다.

관련 pipeline과 skill은 이 계약을 참조하고 문서 전문을 복제하지 않는다.
