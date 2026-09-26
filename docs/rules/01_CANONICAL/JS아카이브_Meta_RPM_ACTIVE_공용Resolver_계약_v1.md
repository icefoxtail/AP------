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
→ exact grade/subject RPM→ACTIVE crosswalk
→ GLOBAL ACTIVE Meta Foundation targeted PT/TPL lookup
→ exact curriculum/L1/L2 binding and parent validation
→ EXISTING_REUSE / FAMILY_REUSE / RPM_PRIMARY_MIGRATION_GAP / TRUE_TAXONOMY_GAP / ROUTE_OUT
→ separate fresh difficulty blind pass
→ deterministic Meta validator receipt
→ runtime / Archive parity
```

Semantic first pass는 source identity, content/choices/image reference hash, verified solution hash, curriculum/L1/L2, `primaryMethod`, `decisiveStep`만 사용한다. same-stage candidate의 `problemTypeKey`, `templateKey`, CrossConcept/Condition suggestion, 이전 verdict, heuristic/tag-enrichment 결과는 입력하지 않는다. family template 선택은 crosswalk 조회 뒤 별도 `POST_CROSSWALK` evidence로 기록하고 semantic `inputBundleSha`에 연결한다.

## 2. Resolver API와 evidence

Resolver 입력은 `sourceIdentity`, `solutionIdentity`, `curriculumContext`, `semanticDecision`의 명시 필드만 허용한다. 결정 단계에서 `problemTypeKey`, `templateKey`, CrossConcept/Condition key, difficulty, candidate, heuristic, 이전 판정 필드는 거부한다.

최소 identity:

- `sourceArchiveFile`, `questionUid`, `sourceOrdinal`
- `contentHash`, `choicesHash`, `imageRefHash`, `sourceFingerprint`
- `solutionIdentity.status=VERIFIED_FINAL`, `independentVerification=true`, `solutionHash`
- `curriculum`, `grade`, RPM `scope`, `standardUnitKey`, `subUnitKey`
- semantic `primaryMethod`, `decisiveStep`, RPM L3/L4 path

Resolver 출력은 RPM path/L3/L4, 실제 crosswalk file·row·status, ACTIVE PT/TPL owner·version, exact binding identity, disposition, `sourceFingerprint`, `inputBundleSha`, authority file hashes, `evidenceSha`를 포함한다. `build-rpm-active-resolution.mjs`는 독립 judgement input에서 resolver 결과와 validation receipt를 생성한다. 각 검수/repair/R2E 단계는 같은 resolver 결과를 UID와 SHA로 결속한다.

## 3. Disposition

| Resolver disposition | 조건 | canonical key 동작 | BASIC 영향 |
|---|---|---|---|
| `EXISTING_REUSE` | RPM path와 DIRECT crosswalk, ACTIVE PT/TPL 및 exact binding 일치 | 기존 key 사용 | 유효한 L1/L2·source·solution이면 가능 |
| `FAMILY_REUSE` | crosswalk의 명시 template 후보 안에서 post-crosswalk decisive-step 선택, ACTIVE parent/binding 일치 | 고른 기존 key만 사용 | 유효한 L1/L2·source·solution이면 가능 |
| `RPM_PRIMARY_MIGRATION_GAP` | RPM path는 있으나 crosswalk·ACTIVE key·parent·binding materialization이 없음/불일치 | key 생성 금지; blank key + evidence | advanced만 미완료; BASIC은 별도 판정 |
| `TRUE_TAXONOMY_GAP` | RPM path가 없고 현재 GLOBAL ACTIVE targeted lookup도 완료했으나 적합 경로 없음 | candidate/HOLD evidence만; key 생성 금지 | advanced만 미완료; BASIC은 별도 판정 |
| `ROUTE_OUT` | scope/curriculum/source가 해당 route 밖이거나 현재 authority를 판정할 수 없음 | metadata apply 금지; route-out evidence | 별도 BASIC gate가 결정 |

RPM path가 있고 active key나 exact binding이 없는 상태는 항상 `RPM_PRIMARY_MIGRATION_GAP`이다. 이를 true taxonomy gap 또는 `META_PACK_GAP_HOLD`로 바꾸지 않는다.

`TRUE_TAXONOMY_GAP`에는 current registry SHA와 함께 `searchMethod=GLOBAL_ACTIVE_TARGETED_BY_EXACT_CURRICULUM_L1_L2`, 검색한 exact curriculum/L1/L2 scope, no-match candidate key list를 sidecar에 남긴다. Candidate/heuristic key를 검색 근거로 재사용하지 않는다.

R2E final receipt 매핑은 `EXISTING_REUSE`/`FAMILY_REUSE → EXISTING_REUSE`, `ROUTE_OUT → ROUTE_OUT`이다. Migration gap과 taxonomy gap은 unresolved이므로 R2E_FINAL에 남길 수 없다. Canonical materialization/repair 후에는 갱신된 ACTIVE registry를 대상으로 resolver를 다시 실행하고 그 결과를 self-hash `receiptSha`와 durable ledger로 봉인한다.

## 4. Difficulty blind pass

Difficulty는 `JS_ARCHIVE_DIFFICULTY_BLIND_EVIDENCE_v1`로 L3/L4 semantic pass와 분리한다. source fingerprint와 verified solution hash에 결속된 fresh independent pass, bucket 1–5, confidence, boundary flag, legacy compatibility, rationale, reviewer/decision provenance를 요구한다. 기존 `level`은 blind 판정 입력이나 bucket 변환식으로 사용할 수 없다. legacy level은 fresh bucket 결정 뒤 비교 evidence로만 허용한다.

## 5. Finalization·validator·runtime

`validateMetaFinalization`은 active PT/TPL, parent, exact binding, CrossConcept ACTIVE unique key, Condition canonical key, IntegrationPattern enum, difficulty evidence, relational evidence, source-solution identity, resolver evidence SHA를 함께 확인한다. `validatorReceipt`는 `inputEvidenceSha`, `validationResultSha`, `runSha`를 포함하고 현재 evidence에 대해 다시 계산된다. `makeMetaValidatorReceipt` 또는 CLI가 발급한 `validatorId=rpm-active-resolver-v1`의 PASS receipt가 없으면 Meta FINAL/PASS/promotion은 실패한다.

runtime 및 Archive projection은 UID/source fingerprint, canonical advanced fields, resolver evidence SHA, difficulty evidence SHA가 일치해야 한다. 과거 runtime은 기존 조회를 유지하되 새 resolver provenance가 없으면 `LEGACY/UNVERIFIED`로 관찰한다. 기존 production 전체를 이 계약만을 이유로 일괄 수정하지 않는다.

## 6. BASIC eligibility 분리

Source identity/fidelity, independent math, 학생용 해설, solution quality, L1/L2, serialization이 PASS이고 입력된 advanced key가 없거나 canonical-valid이면 advanced Meta가 migration gap/미분류인 경우에도 `BASIC_ARCHIVE_ELIGIBLE=true`, `ADVANCED_META_ELIGIBLE=false`가 가능하다. 등록되지 않은/candidate/deprecated key, invalid enum·parent·binding은 BASIC PASS를 만들기 위한 우회값으로 허용하지 않는다.

## 7. 기존 경로

- 신규 Past Exam은 `completion-contract.json`의 resolver-backed sidecar와 BASIC/ADVANCED 분리 gate를 사용한다.
- 3차검수·수정·무결성·R1/R2E는 `rpm-active-resolver.mjs` 및 CLI를 공통 호출한다. R2E intake receipt는 `JS_ARCHIVE_R2E_META_INPUT_RECEIPT_v1` evidence ref를 묶고, R2E final receipt는 `JS_ARCHIVE_R2E_META_RECEIPT_v1`로 동일 UID의 resolver/difficulty/runtime projection을 재검증한다.
- 1차검수는 field presence/type/evidence/provenance의 read-only 상태만 확인한다. 2차 수학검수는 semantic Meta engine이 아니다.
- tag-enrichment는 L1/L2/subUnit hint와 inventory만 만들며 advanced Meta/difficulty를 분류하지 않는다.
- js-bank-cleanup은 advanced Meta를 read-only audit한다.
- `Archive_Reviewed_Apply_Bridge_v1`는 sealed legacy recovery만 유지한다. 신규 repair는 schema v3 resolver evidence를 요구한다.
- Similar-question은 새 문항의 decisive step으로 의미를 다시 판단하고 source Meta를 무비판 상속하지 않는다. Visual skill은 routing만 한다.

관련 pipeline과 skill은 이 계약을 참조하고 문서 전문을 복제하지 않는다.
