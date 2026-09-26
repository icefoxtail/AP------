# JS Archive R2E Intake → Main 운영계약 v1

status: ACTIVE
effective: 2026-09-27
scope: 중등 JS Archive CREATE/R1 intake 및 Codex R2E 최종 폐쇄
supersedes-for-new-intake: REVIEW2 → Library REVIEW_DONE/APPLY_PACKET → E/Apply Bridge 기본 흐름

---

## 0. 목적과 최상위 계약

현재 중등 JS Archive의 표준 생산·최종폐쇄 흐름을 다음으로 고정한다.

```text
CREATE
→ READY_FOR_REVIEW
→ R1
→ READY_FOR_R2E
→ Codex R2E
→ R2E_FINAL
→ production integration
→ R2E_MAIN_FINAL
```

새 중2·중3 생산은 Library ZIP을 stage handoff authority로 사용하지 않는다.
**remote Git commit + machine-readable receipt/ledger**가 작업 상태 authority다.

과거 `READY_FOR_REVIEW2 → REVIEW2/CLOSED_FOR_APPLY → Library REVIEW_DONE/APPLY_PACKET → E`
흐름은 삭제하지 않고 **LEGACY ONLY**로 보존한다.
이미 봉인된 legacy artifact 복구 또는 사용자가 특정 legacy packet 처리를 명시한 경우에만 사용한다.

사용자 최신 명시 지시가 본 문서보다 우선한다.

---

## 1. 학년별 intake authority

### 중2

- branch: `work/intake/m2`
- producer: 예약 레인 A/B/C/D
- CREATE와 R1 결과를 시험지별 독립 commit으로 누적한다.

### 중3

- branch: `work/intake/m3`
- producer: 중3 2학기 F/G/H/I + 중3 1학기 J/K/L/M
- CREATE와 R1 결과를 시험지별 독립 commit으로 누적한다.

### 중1

중1 B01~B31 통합 폐쇄는 현재 일회성 별도 프로젝트다.

- input authority: `work/m1-b01-b31-r2e`
- 중1은 중2·중3 자동 intake에 섞지 않는다.

### 비정본 branch

초기 실험용 `work/intake/m2-a`, `m2-b`, `m2-c`, `m2-d`,
`work/intake/m3-2-*`, `work/intake/m3-1-*`는 R2E input authority가 아니다.

---

## 2. 상태기계

정상 상태:

```text
CREATE
READY_FOR_REVIEW
R1
READY_FOR_R2E
R2E_IN_PROGRESS
R2E_FINAL
INTEGRATION_PENDING
R2E_MAIN_FINAL
```

운영·장애 상태:

```text
WAIT_RESOURCE
RETRY_PENDING
INTEGRATION_CONFLICT
HUMAN_REQUIRED
```

정의:

- `READY_FOR_REVIEW`: CREATE 결과가 intake branch에 commit/push 완료.
- `READY_FOR_R2E`: R1 독립검수 결과가 intake branch에 commit/push 완료.
- `R2E_FINAL`: 최종 adjudication·repair·validation 완료, main 반영 전.
- `R2E_MAIN_FINAL`: 원격 main ancestry와 production parity까지 확인 완료.
- `HUMAN_REQUIRED`: 현재 operative source/recovery authority를 모두 소진해도 source truth를 결정할 수 없는 경우만 허용.

Notion/채팅에 상태만 있고 remote commit/receipt가 없으면 READY로 인정하지 않는다.

---

## 3. CREATE 계약

CREATE는 전체 denominator를 source-first로 읽고 다음을 한 번의 판독에서 물리화한다.

- source identity
- content / choices / answer
- 기존 solution / 필요한 image
- 학생용 작은칠판 final solution
- 필요한 solution SVG
- L1/L2 baseline과 명백한 conflict
- `primaryMethod`
- `decisiveStep`
- RPM Primary path
- 학년별 RPM→ACTIVE crosswalk
- GLOBAL ACTIVE canonical owner
- exact curriculum binding
- L3/L4/CrossConcept candidate 또는 reuse
- unresolved reason

Meta 강제 조회 순서:

```text
source + final solution
→ primaryMethod
→ decisiveStep
→ RPM Primary
→ 학년/과목 crosswalk
→ GLOBAL ACTIVE canonical owner
→ exact curriculum binding
→ existing reuse / migration / proposal
```

세 단계는 `docs/rules/01_CANONICAL/JS아카이브_Meta_RPM_ACTIVE_공용Resolver_계약_v1.md`와 `archive/tools/meta-foundation/rpm-active-resolver.mjs`를 공통으로 사용한다. Evidence를 봉인하기 전 검증 명령은 다음이다.

```bash
node archive/tools/meta-foundation/validate-rpm-active-receipt.mjs --resolver-evidence <resolver-evidence.json>
```

R1/R2E item receipt는 동일 UID의 `resolverInput`, `resolverEvidence`, `difficultyEvidence`, relational semantic evidence, `validatorReceipt`를 보관한다. R2E 최종 receipt는 `JS_ARCHIVE_R2E_META_RECEIPT_v1`이며 `--r2e-receipt <receipt.json>` 검증을 통과해야 `R2E_FINAL`로 닫을 수 있다.

정확한 기존 key가 없다는 이유만으로 TRUE_HOLD하지 않는다.

CREATE 단계 허용 semantic disposition:

- `EXISTING_REUSE`
- `PROPOSED_NEW_L3`
- `PROPOSED_NEW_L4`
- `RPM_PRIMARY_MIGRATION_GAP`
- `TRUE_HOLD`

`TRUE_HOLD`는 source/answer/identity 자체가 실제로 판단 불가능한 경우만 사용한다.

---

## 4. R1 계약

R1은 CREATE와 다른 실행·새 판단으로 전체 문항을 독립 대조한다.

확인:

- source/answer identity
- 수학적 solution correctness
- 학생 재현 가능 작은칠판 구조
- 필요한 SVG parity
- L1/L2 conflict
- L3/L4/CrossConcept/difficulty
- runtime 문자열·기초 무결성

R1은 가능한 결정을 최대한 끝낸다.

- exact existing path가 있으면 reuse/repair.
- canonical은 있는데 binding만 없으면 migration gap.
- 같은 L3 아래 반복 가능한 decisive-step skeleton이 실제로 다르면 신규 L4 proposal.
- 기존 L3에 넣으면 중심 요구/전략이 왜곡될 때만 신규 L3 proposal.
- 보조 개념은 CrossConcept.
- 복합성·표현 차이·완전 동일 template 부재만으로 HOLD 금지.

R1 완료는 시험지 receipt가 `READY_FOR_R2E`이고 해당 remote commit이 실제 존재할 때만 인정한다.

---

## 5. intake receipt 계약

권장 경로:

```text
archive/data/r2e-intake/m2/<examUid>.json
archive/data/r2e-intake/m3/<examUid>.json
```

최소 필드:

```text
examUid
examFile
grade
lane
stage
sourceBlobSha
inputCommit
totalQuestions
changedQuestions[]
changedSvgFiles[]
metaDispositionSummary
metaResolutionEvidenceRef: { path, sha256 }
metaResolverContractVersion = JS_ARCHIVE_RPM_ACTIVE_RESOLUTION_v1
unresolvedItems[]
authorityRefs[]
nextState
updatedAt
```

R1 추가 권장:

```text
deepReviewCandidates[]
repairs[]
proposedNewL3[]
proposedNewL4[]
rpmMigrationGaps[]
crossConceptCandidates[]
sourceHardHolds[]
validatorSummary
```

`metaResolutionEvidenceRef`는 `JS_ARCHIVE_R2E_META_INPUT_RECEIPT_v1` sidecar를 가리킨다. 모든 UID의 input bundle, resolver evidence, candidate projection, relational evidence, fresh difficulty blind evidence, validator receipt를 포함한다. Intake snapshot은 frozen exam JS와 sidecar를 UID/ordinal/content/choices/image/solution hash로 대조한 뒤 공용 resolver로 재검증한다. Receipt는 item-level evidence를 대체하지 않는다.

---

## 6. intake 동시 writer 규칙

같은 학년의 여러 예약 레인이 하나의 intake branch를 공유한다.

각 실행은:

1. 최신 remote intake HEAD fetch.
2. 그 HEAD에서 자기 시험지 1개만 작업.
3. 대상 시험지 파일 + receipt/evidence만 명시 stage.
4. 시험지별 독립 commit 1개.
5. push 직전 remote HEAD 재확인.
6. remote가 전진했으면 자기 commit만 최신 HEAD 위에 안전하게 재적용.
7. 영향 범위를 재검증한 뒤 push.

금지:

- `git add .`
- `git add -A`
- force push
- 다른 레인의 commit 삭제/덮기
- unrelated 파일 stage
- intake branch 전체 main merge

push 성공한 remote commit SHA가 durable authority다.

---

## 7. R2E run snapshot 계약

Codex R2E는 약 6시간 간격을 기본 운영값으로 한다.
권장 서울 시간은 00:00 / 06:00 / 12:00 / 18:00이다.

각 run 시작:

1. `work/intake/m2`, `work/intake/m3` remote HEAD 조회.
2. `READY_FOR_R2E` receipt inventory 확정.
3. 이미 `R2E_MAIN_FINAL`인 시험지 제외.
4. resume 가능한 checkpoint가 있으면 신규 intake보다 resume 우선.
5. run의 intake HEAD SHA와 각 exam input commit SHA를 freeze.
6. run 시작 뒤 추가된 R1 commit은 현재 batch에 섞지 않고 다음 run으로 넘긴다.

native file-condition trigger에 의존하지 않는다.
예약 실행 시 queue를 읽고 대상이 없으면 `NO_WORK`로 종료한다.

---

## 8. R2E 역할 — Final Adjudication & Closure

R2E는 세 번째 전체 deep review가 아니다.

모든 대상 문항에 integrity scan은 수행하지만 deep review는 다음에 집중한다.

- R1 HOLD
- R1 REPAIR
- CREATE ↔ R1 conflict
- review/quality blocker
- `PROPOSED_NEW_L3`
- `PROPOSED_NEW_L4`
- `RPM_PRIMARY_MIGRATION_GAP`
- legacy `META_CANONICAL_HOLD` / `META_PACK_GAP_HOLD`
- CrossConcept 경계
- source/answer/visual hard HOLD
- R1 이후 byte drift
- validator가 새로 찾은 actual defect

정상 PASS item은 source/dependency drift 등 invalidation 근거 없이 처음부터 다시 풀지 않는다.

여러 시험지의 proposal은 한 run에서 semantic cluster로 묶어 비교한다.
첫 사례 하나만 보고 taxonomy를 과분화하지 않는다.

---

## 9. Meta HOLD Zero gate

R2E는 최종 semantic 결정권자다.

`R2E_FINAL`에 다음이 남아 있으면 안 된다.

- `META_PACK_GAP_HOLD`
- `META_CANONICAL_HOLD`
- `RPM_PRIMARY_MIGRATION_GAP`
- `PROPOSED_NEW_L3`
- `PROPOSED_NEW_L4`
- 미결 CrossConcept candidate
- 미실행 deterministic Meta validator
- source/solution/resolver/difficulty SHA mismatch
- runtime/Archive metadata parity mismatch

최종 disposition은 다음 중 하나다.

- `EXISTING_REUSE`
- `REBIND`
- `MATERIALIZED`
- `NEW_L4`
- `NEW_L3`
- `CROSS_CONCEPT`
- `ROUTE_OUT`

판정 순서는 항상 RPM Primary → exact crosswalk → GLOBAL ACTIVE owner → exact binding을 선행한다.

Final disposition은 shared resolver의 결과와 현재 적용 action을 함께 보존한다. `EXISTING_REUSE`와 `FAMILY_REUSE`는 R2E의 `EXISTING_REUSE`로, 유효한 `ROUTE_OUT` evidence는 `ROUTE_OUT`으로 기록한다. Migration gap/taxonomy gap은 최종에 남길 수 없다. Canonical materialization, rebind, 신규 L3/L4, CrossConcept 승인 이후에는 current ACTIVE snapshot으로 resolver를 다시 실행해 final metadata/runtime parity receipt에 SHA를 고정한다.

R2E FINAL receipt는 `unresolvedSemanticCount`, `unresolvedProposalCount`, `unresolvedCrossConceptCandidateCount`, `metaHoldCount`, `migrationGapCount`를 모두 0으로 기록하며 shared validator가 기계적으로 확인한다.

local binding pack taxonomy에 key가 없다는 사실만으로 canonical absent를 선언하지 않는다.

---

## 10. 신규 taxonomy 경계

신규 canonical은 RPM과 GLOBAL ACTIVE 모두에서 reuse 경로가 없고 실제 retrieval 가치가 있을 때만 만든다.

신규 L3:
- 중심 요구/primary strategy가 기존 L3에 들어가면 의미가 왜곡됨.
- 독립 retrieval 가치가 있음.
- 여러 evidence UID로 반복 가능성을 확인.

신규 L4:
- 같은 L3 안에서 decisive-step solution skeleton이 반복 가능하게 다름.

CrossConcept:
- primary L1~L4 경로 밖에서 실제 결정적으로 쓰이는 보조개념.
- primary concept를 CrossConcept로 중복 등록 금지.

숫자·학교·표현·그림 모양 차이만으로 새 key를 만들지 않는다.

---

## 11. correctness / source / SVG defect

R2E가 actual defect를 확인하면 보고만 하지 않고 허용 범위의 최소 repair를 수행한다.

대상 예:
- solution 수학 오류
- 교육과정 밖 풀이
- 중간계산 누락
- 작은칠판 구조 결함
- SVG geometry/parity 오류
- source/answer mismatch
- visual hard defect

현재 capability registry가 `DERIVED_SOURCE_RECOVERY = PRODUCER_NOT_IMPLEMENTED`이면 파생문항 자동생성을 구현된 기능처럼 가정하지 않는다.

현재 operative source/correction/recovery 경로로 deterministic 복구 가능하면 처리한다.
모든 operative evidence를 소진해도 source truth 확정이 불가능한 경우만 `HUMAN_REQUIRED`.

Meta gap, validator 미구현, 네트워크/권한 문제를 HUMAN_REQUIRED로 오용하지 않는다.

---

## 12. durable state / resume

R2E 진행상태는 intake를 덮어쓰지 않고 별도 durable state에 저장한다.

권장:

```text
archive/data/r2e/<grade>/
  SCHEMA.json
  runs/<runId>.json
  exams/<examUid>.json
  events/<examUid>.jsonl
  receipts/<examUid>.json
```

시험지 state 최소:

```text
inputBranch
inputCommit
sourceBlobSha
dependencyShas
denominator
integrityScanned
deepReviewItems[]
resolvedItems[]
remainingItems[]
changedFiles[]
validatorStatus
nextAction
checkpointCommit
productionCommit
finalStatus
```

재실행:

1. remote durable ref + ledger 읽기.
2. input/dependency SHA 검증.
3. SHA가 같은 terminal item 재사용.
4. 변경된 item과 영향 closure만 invalidation.
5. `nextAction`부터 이어서 수행.

STATUS 질문이나 채팅 재개 자체는 invalidation 사유가 아니다.
checkpoint 전에 끊긴 마지막 item만 다시 확인할 수 있다.

**NO PHYSICAL CHECKPOINT = NO PROGRESS**.

---

## 13. 중복 실행 방지

R2E processor는 기본 단일 writer다.

이전 run이 active면 다음 예약 run은 lock/lease를 확인하고 동일 queue를 중복 처리하지 않는다.

lock 최소 정보:

```text
runId
owner
host
acquiredAt
heartbeatAt
fencingToken
```

한 시험지 실패가 독립된 다른 시험지를 막지 않는다.
실제 shared Meta dependency가 있는 cluster만 함께 대기한다.

---

## 14. validation gate

`R2E_FINAL` 전 current artifact SHA 기준으로 최소 확인:

- denominator coverage
- node syntax
- VM/runtime load
- answer/solution consistency
- blank solution 0
- control-char 0
- LaTeX escape regression 0
- protected parity 또는 승인 repair evidence
- SVG XML / reference / geometry / provenance
- L1/L2 parent
- L3/L4 parent
- CrossConcept registry
- duplicate/alias collision
- RPM ↔ crosswalk
- GLOBAL ACTIVE canonical owner
- exact curriculum binding
- compiled/runtime parity
- affected UID metadata
- Archive2 catalog/index/join
- 관련 targeted regression
- Meta unresolved 0

기존 validator가 HOLD/candidate를 허용한다는 이유로 R2E PASS를 선언하지 않는다.

---

## 15. production integration

R2E_FINAL 이후 최신 `origin/main`을 다시 fetch한다.

원칙:

- intake 전체 merge 금지.
- R2E working branch 전체 merge 금지.
- final production 파일만 allowlist 반영.
- 시험지 1개 = final production commit 1개.
- shared canonical/Meta 변경은 별도 shared Meta commit.
- checkpoint / scratch / input ZIP / handoff를 main에 넣지 않는다.
- 관련 drift만 targeted revalidation.
- unrelated main advance 때문에 전체 R2E 재검수 금지.
- force push 금지.

main 반영 후:

- production commit이 remote main ancestry에 존재
- final exam JS/SVG bytes 확인
- canonical/binding/runtime parity
- registration/catalog/index 정상
- unrelated mutation 0

을 확인한 후에만 `R2E_MAIN_FINAL` receipt를 기록한다.

---

## 16. reopen

`R2E_MAIN_FINAL` 시험지는 정상 CREATE/R1/R2E에서 다시 처리하지 않는다.

REOPEN 허용 사유:

1. source 원본 실제 변경
2. committed final artifact byte drift
3. 관련 canonical/rule 변경이 해당 UID를 직접 무효화
4. production regression
5. 사용자 명시 재검수

---

## 17. legacy R2/E/Library 경로의 지위

과거 R2/E/Apply Bridge 규칙은 역사·복구 계약으로 보존한다.

새 intake 기반 중2·중3 생산에는 적용하지 않는다.

legacy 경로를 사용할 수 있는 경우:

- 이미 sealed된 과거 artifact 복구
- 기존 applyId/provenance 확인
- 사용자가 특정 legacy packet 처리를 명시적으로 지시

새 CREATE/R1 결과를 legacy Library R2/E로 보내지 않는다.

---

## 18. 짧은 작업 지시 표준

이 문서가 정본이므로 작업 프롬프트에 세부 규칙을 재복사하지 않는다.

권장:

```text
최신 GPT 작업 전 필독 라우터와
JS_ARCHIVE_R2E_INTAKE_TO_MAIN_v1을 읽고 따른다.

대상: <학년/branch/scope>
목표: <CREATE/R1/R2E>
결과: <READY receipt + commit/push 또는 R2E_MAIN_FINAL>
STOP: <해당 단계 완료>
```

세부 안전규칙은 본 문서와 연결된 canonical/review 문서가 담당한다.
