# Archive Authority Write Pending & Candidate Materialization v1

- 상태: **ACTIVE / CURRENT**
- 적용 시작: **2026-09-30**
- 적용 대상: JS Archive current-generation CREATE / REVIEW1 / REVIEW2의 write-finalization 및 recovery
- current middle generation: `MIDDLE_RECERT_2026-09-29_V1`

---

## 1. 목적

Git/connector write 실패와 candidate 자체의 미물리화를 같은 상태로 취급하지 않는다.

`AUTHORITY_WRITE_PENDING`은 **exact candidate bytes가 이미 Git에 물리 보존되어 있고 authority branch 결속/receipt 마감만 남은 경우**에만 사용한다.

candidate exact bytes가 Git에 없으면 write retry를 반복하지 않고 materialization 상태로 분리한다.

핵심 원칙:

```text
CONTENT/REVIEW COMPLETE
→ EXACT CANDIDATE MUST EXIST PHYSICALLY IN GIT
→ AUTHORITY BIND
→ RECEIPT/EVIDENCE
→ STAGE CLOSE
```

**Notion 상세 기록만으로 candidate authority를 대신하지 않는다.**

---

## 2. HARD RULE — CANDIDATE PHYSICALIZATION BEFORE RETRY

CREATE / REVIEW1 / REVIEW2에서 새 candidate가 완성되면 authority write 시도와 별개로 다음 중 하나의 Git 물리 증거를 반드시 남긴다.

1. exact final candidate exam blob
2. candidate를 포함한 recovery commit/ref
3. deterministic candidate parts + source/input SHA + item-hold ledger + layout/asset delta로 exact reconstruction이 가능한 physical manifest

권장 순서는 **완성된 final candidate JS/blob 자체를 먼저 보존**하는 것이다.

authority write가 실패해도 candidate bytes는 Git에 남아야 한다.

금지:
- Notion page에 solution/repair/layout 내용을 써 놓고 Git candidate를 남기지 않는 것
- candidate hash만 기록하고 해당 blob/ref를 실제 Git에서 찾을 수 없게 두는 것
- write 실패 후 다음 retry에서 요약문을 보고 candidate를 임의 재작성하는 것

---

## 3. 상태 분류

### A. AUTHORITY_WRITE_PENDING

다음을 모두 만족할 때만 사용한다.

- exact candidate blob/commit/ref가 Git에 존재
- candidate identity/hash를 재조회 가능
- source/protected field 및 item-hold lineage가 물리 확인 가능
- 남은 작업은 authority branch 결속 + finalArtifactSha + receipt/evidence

처리:
- 내용 재작업/재검수 금지
- exact candidate 재사용
- non-force 직렬 write-finalization
- 성공 후 stage close

### B. CANDIDATE_MATERIALIZATION_PENDING

candidate final JS는 아직 Git에 없지만, **exact reconstruction에 충분한 물리/정본 입력**이 존재한다.

예:
- Git solution chunks + exact input artifact SHA + complete item-hold ledger
- Notion candidate pages + Git source artifact + complete layout/hold ledger가 있고 결과가 deterministic

처리:
- 먼저 candidate를 Git recovery ref/blob으로 물리화
- materialization 직후 hash를 고정
- 그 다음 A로 승격해 authority 결속
- 수학 재풀이/REVIEW 재실행 금지

### C. STAGE_REEXECUTION_REQUIRED

다음 중 하나면 해당 stage를 다시 수행한다.

- exact candidate bytes가 Git에 없음
- summary/verdict/repair intent만 있고 final student-facing bytes가 없음
- missing source/ledger 때문에 deterministic reconstruction 불가
- 여러 복원 결과가 가능해 exact candidate를 특정할 수 없음

처리:
- **전체 파이프라인 rewind 금지**
- 누락된 해당 stage만 fresh 재실행
- CREATE면 CREATE만, REVIEW1이면 REVIEW1만, REVIEW2면 REVIEW2만
- 이전 durable upstream stage는 보존
- 새 candidate는 반드시 Git에 먼저 물리화

### D. CANDIDATE_HASH_CONFLICT

기록된 candidateArtifactSha와 chunks/재구성 결과가 다를 때 사용한다.

처리 순서:
1. 기록된 candidate SHA blob이 Git에 실제 존재하면 **그 blob을 authority로 우선 사용**
2. blob이 없거나 identity가 맞지 않으면 임의 복원 금지
3. 해당 stage만 fresh 재실행

hash conflict를 authority/content conflict로 과장하지 않는다. 실제 protected field drift가 있을 때만 content conflict다.

---

## 4. Recovery Decision Tree

```text
pending 발견
│
├─ exact candidate blob/commit/ref가 Git에 있는가?
│   ├─ YES → AUTHORITY_WRITE_PENDING → exact bind
│   └─ NO
│
├─ deterministic materialization 입력이 완전한가?
│   ├─ YES → CANDIDATE_MATERIALIZATION_PENDING
│   │        → Git candidate 물리화
│   │        → hash 고정
│   │        → AUTHORITY_WRITE_PENDING
│   └─ NO
│
└─ STAGE_REEXECUTION_REQUIRED
         → 해당 stage만 fresh 재실행
         → Git candidate 물리화
         → authority bind
```

---

## 5. Retry Writer / Codex 역할 분리

자동 Authority Writer는 **A 상태만 소비**한다.

즉 exact Git candidate가 없는 B/C/D 상태는 writer가 반복 선택하지 않는다.

- A: 자동 writer 또는 Codex 수동 drain 가능
- B: materializer가 먼저 Git candidate 생성
- C: 해당 CREATE/R1/R2 lane이 stage fresh reexecution
- D: recorded blob 우선 확인 후 없으면 stage reexecution

같은 pending을 safety gate에 반복 충돌시키는 것으로 B/C/D를 해결하려 하지 않는다.

---

## 6. Question-Level HOLD와의 관계

candidate materialization 상태는 content HOLD가 아니다.

- item hold가 있어도 candidate 전체를 물리화한다.
- `*_DONE_WITH_ITEM_HOLDS` 경로를 그대로 유지한다.
- held qid는 별도 `ITEM_RECOVERY_QUEUE`로 이동한다.
- 시험지 전체 HOLD/BLOCK/격리 금지
- MAIN publish 직전에만 `itemHoldCount=0` HARD gate

---

## 7. 최소 Physical Manifest

final candidate blob을 바로 만들지 못하고 parts로 저장해야 한다면 최소 다음을 Git에 남긴다.

```text
schemaVersion
certificationGeneration
examFile
stage
authorityBranch
inputArtifactSha
candidateArtifactSha (존재하면)
candidatePartPaths[]
candidatePartBlobs[]
protectedFieldBaselineSha
solutionRewriteAttempted / fullReviewCoverage
itemHoldCount
itemHoldQuestionIds[]
itemHoldLedgerPath/blob
layoutDelta
assetDelta
writeAttemptedAt
lastRetryAt
nextAction
```

이 정보만으로 exact candidate를 하나로 결정할 수 없으면 B가 아니라 C다.

---

## 8. 2026-09-30 M3 잔여 11건 Recovery Snapshot

이 섹션은 당시 물리 상태에 대한 **snapshot**이며 이후 durable receipt가 생기면 superseded된다.

### 즉시 exact 결속 가능 / Git candidate 존재

- CREATE o17 `21_매산중_1학기_중간_중3_기출.js`
  - recorded candidate blob `0234ffafa6d60f91542438777e05580a79c241f9` 실제 존재
  - chunks 재조립 결과와 hash가 달라도 recorded blob을 우선
- CREATE o25 `26_왕운중_1학기_기말_중3_기출.js`
  - final candidate blob `f9eede649967be7b9a54d08ee5eea23fbfdd982a` 실제 존재
- CREATE o54 `25_연향중_2학기_기말_중3_기출.js`
  - recovery ref에 23/23 candidate parts 6개 물리 보존
- REVIEW1 o69 `22_매산중_2학기_기말_중3_기출.js`
  - pending manifest에 q21 layout-only exact repair가 완전 기록됨
- REVIEW2 o29 `25_연향중_1학기_기말_중3_기출c.js`
  - frozen REVIEW2 candidate blob `1e22cfbb66a057ed1d086ce2cff3ed23846ee7de`
  - intended disposition `REVIEW2_DONE → READY_FOR_COMMIT`, itemHoldCount 0

### Materialization 후 결속

- CREATE o26 `26_삼산중_1학기_기말_중3_기출.js`
  - Notion candidate q1–q12 / q13–q24 + ITEM_HOLD ledger
  - 24/24 attempted, 22/24 resolved, q15/q19 holds
- CREATE o43 `25_금당중_2학기_중간_중3_수학.js`
  - recovery solution chunks 존재
  - source artifact / item-hold ledger와 결속 후 final candidate를 먼저 Git에 물리화

### 해당 stage fresh 재실행

- REVIEW2 o11 `22_팔마중_1학기_중간_중3_기출.js`
  - full-review summary는 있으나 exact REVIEW2 candidate bytes 없음
- REVIEW2 o20 `19_풍덕중_1학기_중간_중3_기출.js`
  - q2/q5/q7 repair intent는 있으나 exact final candidate bytes 없음
- REVIEW1 o66 `22_팔마중_2학기_기말_중3_기출.js`
  - q15 intended solution logic은 있으나 exact student-facing final string/blob 없음
- CREATE o32
  - exact final candidate를 물리 특정할 수 없음

위 4건은 전체 시험지 파이프라인을 처음부터 되감지 않고 **해당 stage만 다시 수행**한다.

---

## 9. 완료 판정

다음 네 가지가 모두 맞아야 stage를 닫는다.

1. authority branch에 final candidate bytes 존재
2. exam blob == recorded finalArtifactSha
3. durable stage receipt/evidence 존재
4. remote refetch로 위 세 항목 재확인

Notion 상태만 바뀌었거나 summary만 존재하면 완료가 아니다.

---

## 10. 운영 목적

이 계약의 목적은 write failure를 숨기는 것이 아니라 다음을 분리하는 것이다.

- **write problem**
- **candidate storage problem**
- **stage content/review problem**

분리 후 가장 작은 단계만 복구한다.

```text
WRITE FAILURE ≠ CONTENT FAILURE
NOT MATERIALIZED ≠ WRITE RETRY
MISSING EXACT CANDIDATE → MATERIALIZE OR REEXECUTE ONLY THAT STAGE
```
