# JS아카이브 전수 품질 업그레이드 · 다중 독립 검수 · 최종 봉인 공통 프로토콜 v1.2.10 — 정본

- 작성일: 2026-09-04
- 상태: `CANONICAL_CANDIDATE_READY_FOR_FINAL_REVIEW`
- 기준 저장소: `icefoxtail/AP------`
- 적용 범위: JS아카이브 원본 production 문항의 단원별 전수 품질 업그레이드 프로젝트
- 적용 학년: 중등·고1·고2·고3 전 범위 가능. 실제 교육과정 경계는 `UNIT_OVERLAY`가 정의
- 기본 제작 단위: 5문항 batch
- 추적 단위: 개별 문항 `questionUid`
- 렌더 단위: target-bearing 시험지 × required render mode × required viewport/profile
- 검수 단위: frozen manifest 및 동일 final release artifact
- 봉인 단위: 프로젝트 Overlay가 선언한 전체 단원/영역
- 유사문항: 기본 제외. 별도 manifest와 별도 봉인 프로젝트로 수행
- 문서 계층: `COMMON CORE + UNIT OVERLAY`

---

# 0. 문서 목적과 정본 지위

본 문서는 JS아카이브 전수 품질 업그레이드 프로젝트의 공통 실행 OS다.

기존 단원별 대형 계획서를 매번 새로 만드는 대신 다음 구조를 사용한다.

```text
COMMON_PROTOCOL_v1.2.10
+
UNIT_OVERLAY
=
EFFECTIVE_RULESET
```

본 정본은 다음 경험을 통합한다.

1. 고1 도형의 방정식 v2.2의 강한 무결성 구조
   - inventory / reverse scan
   - stable identity
   - production READ ONLY / staging
   - Pilot System Gate
   - 5문항 batch
   - 보호 hash
   - 독립 검수
   - same-SHA
   - preseal / promotion / production parity
   - post-promotion REAL RENDER
   - Mother Final Seal

2. 함수·유리함수·무리함수 v1.0의 선택적 업그레이드 구조
   - 전수 검수하되 전수 수정하지 않음
   - 좋은 해설 KEEP
   - Text와 Visual 필요성 선별
   - 원문 problem image 재사용
   - 단원별 visual/pedagogy profile

3. 함수 재검에서 확인된 보강 요구
   - sparse curve 금지
   - authoritative math fact → deterministic generator
   - dense/adaptive sampling
   - static contract와 independent math의 의미 분리
   - 문자열 패턴으로 logic-jump PASS 금지
   - DOM load와 layout/visual presentation PASS 분리
   - 문항별 독립 검산 evidence 보존

4. v1.1/v1.2 보강에서 확립된 공통 장치
   - SOURCE/MATH/PEDAGOGY/VISUAL/RUNTIME 완전 직교화
   - A1 blind solve → A2 comparison
   - 독립 review contamination 방지
   - coverage map
   - review input hash map
   - repair invalidation matrix
   - canonical raw-byte hashing
   - effective ruleset SHA
   - protocol regression gate
   - append-only evidence
   - review conflict adjudication
   - REAL RENDER witness
   - promotion rollback
   - final Git parity
   - legacy plan compatibility

5. v1.2.1 독립검수 핀포인트 closure
   - correctness-affecting source defect의 exception 봉인 금지
   - `PROMOTED_PENDING_FINAL_SEAL`과 finalization 실패 rollback
   - post-promotion REAL RENDER witness HARD binding
   - protocol regression adopted baseline / bootstrap adoption evidence
   - B/C/D coverage membership SHA의 PRESEAL 결박
   - solution/problem/shared visual dependency의 C closure 분리

6. v1.2.2 최종 핀포인트 closure
   - correctness defect를 scope exclusion로 denominator에서 제거하는 우회 차단
   - 실제 out-of-scope 또는 production withdrawal verified만 final target 제외 허용
   - 초기 포함 UID의 final scope disposition map SHA 및 withdrawal evidence PRESEAL 결박
   - `RELEASE_CONTENT_READY`와 Static Contract coverage/count의 Final Seal HARD binding
   - artifact-changing repair 후 impacted static contract 무효화·재검·readiness 재계산

7. v1.2.3 최종 실행순서 핀포인트 closure
   - baseline freeze 이후 승인된 production withdrawal을 일반 production 수정이 아니라 controlled baseline-reset transaction으로 정의
   - 현재 candidate/PRESEAL eligibility 무효화 후 withdrawal 실행·absence verification·새 production baseline 재동결
   - `INITIAL_INCLUDED_SCOPE_UID_SET(_SHA)`는 reset 전후 불변으로 보존
   - 기존 PRESEAL bundle의 carry-forward 금지 및 영향 hash/evidence 재계산
   - 새 active baseline 기준 `PRODUCTION_BASELINE_DRIFT == 0`을 다시 확립한 뒤 pipeline 재진입

8. v1.2.4 withdrawal state-order 핀포인트 closure
   - `REFROZEN_VERIFIED` 확정 전 reset evidence를 생성하던 시간축 충돌 제거
   - refreeze verification·새 baseline drift==0 확인 후 final reset status를 확정하고 append-only reset evidence를 생성
   - PRESEAL 전/후와 production mutation 후 withdrawal 요청의 우선순위를 명시적으로 분리
   - `PROMOTED_PENDING_FINAL_SEAL` 중 withdrawal은 직접 실행하지 않고 기존 promotion transaction을 rollback 완료한 뒤 새 controlled baseline-reset transaction으로 처리

9. v1.2.5 state/field 핀포인트 closure
   - controlled reset evidence의 canonical status field를 `controlledBaselineResetStatus` 하나로 통일하고 alias 사용 금지
   - `PROMOTING` 중 withdrawal event를 mutation 전 abort / mutation 후 rollback으로 완전 분기
   - withdrawal event latch 이후 새 production write를 금지하여 race 경계를 fail-closed로 고정
   - PRESEAL bundle parity가 참조하는 canonical object field mapping을 명시

10. v1.2.6 promotion transaction lifecycle 핀포인트 closure
   - 모든 promotion attempt에 unique `promotionTransactionId`를 발급하고 terminal transaction record를 immutable로 보존
   - `ACTIVE_PROMOTION_TRANSACTION_ID`가 현재 attempt만 가리키도록 정의하고 과거 terminal transaction과 project-level current state를 분리
   - 새 attempt 시작 전 transaction-local latch/mutation/fence를 명시적으로 초기화하고 이전 attempt 상태의 상속을 금지
   - abort/rollback/reopen 이후 재진입은 반드시 새 transaction 생성 → `NOT_STARTED` → `PROMOTING` 순서로만 허용

11. v1.2.7 promotion boundary/evidence parity 핀포인트 closure
   - promotion transaction이 아직 존재하지 않는 project-level `NO_TRANSACTION`과 생성된 transaction-local `NOT_STARTED`를 분리
   - terminal withdrawal latch는 immutable history로 유지하되 verified controlled reset이 정확히 한 번 소비했다는 append-only consumption evidence를 요구
   - 새 promotion transaction의 predecessor terminal evidence type/SHA/transaction id parity를 직접 검증하고 promotion chain parity에 결박
   - 신규 transaction 생성식의 OR/AND precedence를 명시적 괄호로 고정하고 unconsumed latch가 있는 상태에서 새 transaction 생성 금지

12. v1.2.8 reopen/reset-reentrancy 핀포인트 closure
   - `FINALIZED_SEALED` 이후 새 promotion attempt는 generic terminal 재진입이 아니라 §42의 명시적 Reopen authorization과 새 `PROJECT_ATTEMPT_ID`를 요구
   - reopened project attempt의 첫 promotion transaction은 이전 sealed transaction/finalization evidence와 `REOPEN_LINEAGE_PARITY`로 bridge하고 root/same-attempt predecessor와 구분
   - controlled baseline reset은 single-writer transaction으로 고정하고 reset 진행 중 들어오는 추가 withdrawal은 중첩 reset이 아니라 append-only pending queue로 직렬화
   - pending withdrawal queue가 모두 drain되기 전 PRESEAL·새 promotion·Final Seal 진입을 금지

13. v1.2.9 reopen-trigger/reset-retry 핀포인트 closure
   - Reopen의 wrapper state·canonical reason·실제 trigger evidence를 `REOPEN_TRIGGER_PARITY`로 1:1 결박하고 syntactic Reopen evidence만으로 sealed state를 여는 것을 금지
   - reset `FAILED` 중 새 distinct withdrawal은 기존 failed trigger에 합치지 않고 append-only queue에 적재하며, failed 원 trigger를 먼저 동일 identity로 retry하도록 정의
   - queued withdrawal의 drain evidence가 실제 reset transaction 생성·trigger identity·retry lineage·최종 `REFROZEN_VERIFIED` 소비까지 이어지는지 `WITHDRAWAL_QUEUE_DRAIN_TO_RESET_PARITY`로 검증
   - failed reset retry는 `FAILED_RESET_RETRY_TRIGGER_PARITY`로 원 trigger를 불변 승계하며 orphan drain·drained-but-unverified event가 0이 되기 전 PRESEAL·promotion·Final Seal을 금지

14. v1.2.10 queue-order/reopen-history 핀포인트 closure
   - failed reset lineage가 unresolved인 동안 queued withdrawal drain을 금지하고 `FAILED_RESET_RETRY_BEFORE_QUEUE_DRAIN_PARITY`로 실행순서를 증명
   - 모든 queue drain이 그 시점의 최소 undrained `withdrawalEventSequence`를 소비하는지 `WITHDRAWAL_QUEUE_FIFO_PARITY`로 검증
   - queue intake의 `observedDuringResetTransactionId`와 drain authorization의 `drainAuthorizedAfterResetTransactionId` 의미를 분리하고 `WITHDRAWAL_QUEUE_PROVENANCE_PARITY`로 semantic provenance를 결박
   - Reopen evidence의 `previousSealBundleSha`와 `previousFinalReleaseArtifactSha`가 실제 이전 sealed artifact와 일치하는지 `REOPEN_HISTORICAL_ARTIFACT_PARITY`로 직접 검증

최상위 목표:

> **전체 문항은 독립적으로 검수하되 필요한 부분만 수정하고, SOURCE·MATH·PEDAGOGY·VISUAL·RUNTIME을 서로 독립된 증거로 검증하며, 동일한 최종 artifact SHA에 모든 필수 PASS가 모이고 production 승격 후 실제 렌더까지 재통과한 경우에만 최종 봉인한다.**

---

# 1. 최상위 절대 원칙

## 1.1 전수 검수와 전수 수정은 다르다

```text
REVIEW_ALL = YES
REWRITE_ALL = NO
```

다음을 이유로 정상 solution을 다시 쓰지 않는다.

- 문체 통일
- 형식 통일
- 줄 수 통일
- 새 템플릿 적용 자체
- SVG 수량 증가 자체
- 보고서 수치 맞추기

기존 해설이 정확하고 교육과정에 맞으며 학생이 재현 가능하면 `pedagogyDisposition = KEEP`이다.

## 1.2 기존 정답과 해설은 독립 수학 검산의 선행 근거가 아니다

정식 수학 검수는 반드시 다음 순서다.

```text
문제 원문/발문 시각자료
→ A1 BLIND SOLVE
→ 실제 결과 동결
→ A2에서 source answer / final solution 공개
→ 비교
```

첫 풀이 전에 금지:

```text
source answer
기존 solution
수정 solution
Builder verdict
이전 reviewer verdict
이전 final report의 정답 판정
```

## 1.3 자동 검사는 증명한 범위를 넘지 않는다

다음은 서로 다른 증거다.

```text
STATIC_CONTRACT_PASS
SOURCE_READY
INDEPENDENT_MATH_PASS
PEDAGOGY_PASS
STUDENT_REPRODUCIBLE_PASS
CURRICULUM_PASS
VISUAL_MATH_PASS
RUNTIME_LOAD_PASS
LAYOUT_PASS
RENDERED_VISUAL_PRESENTATION_PASS
FINAL_SEAL
```

예:

```text
solution에 "따라서" 존재
```

는 구조 신호일 뿐 다음을 의미하지 않는다.

```text
INDEPENDENT_MATH_PASS
LOGIC_JUMP_RESOLVED
STUDENT_REPRODUCIBLE_PASS
```

## 1.4 학생 재현 가능성은 HARD GATE다

핵심 질문:

> 문제와 최종 해설만 받은 학생이 각 단계에서 “왜 다음 단계로 가는지”를 추적하여 같은 풀이를 다시 만들 수 있는가?

`studentReproducibleStatus != PASS`이면 Final Seal 불가.

## 1.5 시각자료의 권위는 그림이 아니라 수학 fact다

```text
problem facts
→ independent computed facts
→ machine-readable visual fact model
→ deterministic generator
→ SVG/asset
→ static visual contract
→ C visual math review
→ D real render
```

눈대중 좌표, 손입력 sparse curve, 그림을 먼저 만든 뒤 수학을 맞추는 방식은 금지한다.

## 1.6 production은 작업 중 READ ONLY다

```text
PRODUCTION_BASELINE = READ_ONLY
```

수정·생성·A/B/C/D 검수는 staging/candidate에서 수행한다.

부분 완성본을 production에 누적하지 않는다.

단, baseline freeze 이후 사용자가 특정 문항의 **정식 production withdrawal**을 승인한 경우에는 Builder가 frozen production을 임의 수정하는 것이 아니라 §5.1의 `CONTROLLED_BASELINE_RESET_TRANSACTION`으로 **현재 frozen attempt를 종료하고 새 production baseline을 만드는 절차**를 수행한다. 이 transaction 밖에서 production을 수정하면 READ-ONLY 위반이다.

## 1.7 모든 최종 PASS는 동일 artifact SHA에 결박한다

검수 중 release artifact가 바뀌면 영향받는 evidence는 무효다.

최종 A/B/C/D 보고서는 동일한 `FINAL_RELEASE_ARTIFACT_SHA`를 가리켜야 한다.

## 1.8 Fail-closed

```text
PASS_WITHOUT_EVIDENCE = INVALID
EVIDENCE_WITHOUT_SCOPE = INVALID
REPAIR_WITHOUT_INVALIDATION = INVALID
SOURCE_DEFECT_WITHOUT_RESOLUTION = NOT_SEALABLE
PROMOTION_WITHOUT_ROLLBACK_PATH = INVALID
UNKNOWN_APPLICABILITY = NOT_PASS
```

확인하지 않은 항목은 PASS가 아니다.

---

# 2. 문서 계층과 실행 권위

## 2.1 Normative 실행 권위

신규 프로젝트와 재봉인 프로젝트는 오직 다음 조합을 실행 권위로 사용한다.

```text
COMMON_PROTOCOL_v1.2.10
+
UNIT_OVERLAY
```

이를 `EFFECTIVE_RULESET`이라 한다.

## 2.2 COMMON CORE가 정하는 것

- scope 확정 방식
- inventory / reverse scan
- stable UID
- dependency closure
- 보호 필드 / source repair
- canonical hashing
- staging
- quality axis
- 독립 A/B/C/D 검수
- blind math contract
- pedagogy hard gate
- visual fact model
- real render witness
- repair invalidation
- promotion / rollback
- final seal
- stale / reopen

## 2.3 UNIT OVERLAY가 정하는 것

최소:

```text
projectId
projectName
projectVersion
curriculumVersions
targetStandardUnitKeys
scopeKeywords
reverseScanRules
curriculumBoundary
forbiddenMethods
allowedMethods
pedagogyProfile
visualProfile
visualGeneratorPolicy
pilotBuckets
requiredRenderModes
requiredViewportProfiles
projectSpecificFailureCodes
approvedModificationFields
independenceEscalationRules
finalSealName
```

## 2.4 Overlay는 Core HARD gate를 약화시킬 수 없다

허용:

```text
공통 기준 강화
단원별 판정 세분화
추가 verifier 요구
더 높은 independence level 요구
더 높은 sampling/scale precision 요구
```

금지:

```text
독립 수학검산 생략
학생 재현 가능성 optional 처리
same-SHA 해제
real render 생략
protected field 자동 개방
coverage 축소
source defect 미해결 허용
post-promotion 검증 생략
```

## 2.5 Overlay Validation Gate

Overlay 활성화 전 자동/독립 검수한다.

```text
OVERLAY_VALIDATION_GATE = PASS
```

최소 검사:

- Core HARD gate 삭제/완화 없음
- target key 명시
- curriculum boundary 명시
- modification field 명시
- visual N/A 규칙 명시
- render mode/profile 명시
- source exception 권한이 사용자 승인으로 제한됨
- final seal token 정의

## 2.6 공통 문서의 단원 Profile 예시는 NON-NORMATIVE다

본 문서 후반의 단원 예시는 설명용이다.

실제 단원 규칙은 별도 `UNIT_OVERLAY` 파일에 둔다.

다른 단원 Overlay 변경이 이미 봉인된 단원의 ruleset을 stale로 만들지 않게 한다.

## 2.7 Legacy Unit Plan Compatibility

Core 채택 전 계획서는 기본적으로:

```text
HISTORICAL_REFERENCE
```

이다.

재사용하려면:

```text
LEGACY_PLAN_COMPATIBILITY_STATUS = PASS
```

필수다. 신규 프로젝트처럼 legacy 계획서를 실행 권위로 전혀 사용하지 않으면:

```text
LEGACY_PLAN_COMPATIBILITY_STATUS = PASS_NOT_APPLICABLE
```

를 허용한다.

legacy 문구가 Core HARD gate와 충돌하면 legacy 문구를 승계하지 않는다.

---

# 3. Core Hard Gate Registry와 Protocol Regression Gate

## 3.1 Stable Hard Gate ID

최소 registry:

```text
CORE-SCOPE-001   Full Inventory + Reverse Scan + Scope Denominator Lock
CORE-STATIC-001  Static Contract Final Closure
CORE-SOURCE-001  Protected Source Lock
CORE-MATH-001    Blind Independent Math Review
CORE-PED-001     Student Reproducible Hard Gate
CORE-VIS-001     Visual Fact Model First
CORE-RUN-001     Real Render Required
CORE-EVID-001    Append-Only Review Evidence
CORE-SEAL-001    Same Final Artifact SHA
CORE-PROMO-001   Atomic Promotion + Rollback + Controlled Withdrawal Baseline Reset + Promotion Transaction Chain
CORE-GIT-001     Final Git Parity
```

## 3.2 Protocol Regression Gate

공통 프로토콜 개정 시 다음은 무승인 FAIL이다.

```text
ACTIVE hard gate 삭제
HARD → OPTIONAL 변경
coverage 완화
independence 완화
protected field 자동 개방
same-SHA 해제
real render 생략
post-promotion gate 생략
rollback 제거
```

Protocol 후보는 반드시 비교 기준을 명시한다.

```text
PROTOCOL_REGRESSION_BASELINE_STATUS = ADOPTED_BASELINE / BOOTSTRAP_ADOPTION
PROTOCOL_REGRESSION_BASELINE_SHA
PROTOCOL_REGRESSION_BASELINE_CONTRACT_REGISTRY_SHA
CANDIDATE_PROTOCOL_CONTRACT_REGISTRY_SHA
removedHardGates[]
relaxedHardGates[]
addedHardGates[]
strengthenedHardGates[]
PROTOCOL_REGRESSION_EVIDENCE_SHA
```

`ADOPTED_BASELINE`이면 실제 직전 adopted common protocol의 raw artifact SHA와 `PROTOCOL_REGRESSION_BASELINE_CONTRACT_REGISTRY_SHA`를 기준으로 deterministic diff를 만든다. 임의의 과거 초안이나 candidate를 baseline으로 가장하지 않는다.

자동 `PASS`의 최소 조건:

```text
removedHardGates[] == []
relaxedHardGates[] == []
```

기존 gate를 더 강한 gate로 대체한 경우 단순 `removed`로 기록하지 말고 replacement mapping과 강화 근거를 regression evidence에 남긴다. 실제 weakening이 있으면 정본 승격을 HOLD하고 별도 governance 승인을 요구한다.

최초 공통 정본 채택처럼 adopted baseline이 없으면:

```text
PROTOCOL_REGRESSION_BASELINE_STATUS = BOOTSTRAP_ADOPTION
PROTOCOL_REGRESSION_BASELINE_SHA = NOT_APPLICABLE_BOOTSTRAP
PROTOCOL_REGRESSION_BASELINE_CONTRACT_REGISTRY_SHA = NOT_APPLICABLE_BOOTSTRAP
BOOTSTRAP_ADOPTION_APPROVAL_EVIDENCE_SHA valid
```

를 사용한다. 가짜 baseline을 만들어 `PASS`시키지 않는다. Bootstrap에서도 현재 Hard Gate Registry 전체와 독립 외부검수 evidence를 승인 객체에 결박한다.

최종 정규화 gate는 두 경로 중 하나가 완결된 경우에만:

```text
PROTOCOL_REGRESSION_GATE == PASS
```

가 된다. 따라서 `PASS`는 baseline comparison 또는 명시적 bootstrap adoption evidence 없이 생성할 수 없다.

`PROTOCOL_REGRESSION_GATE == PASS`는 정본 승격과 프로젝트 Final Seal 모두의 조건이다.

## 3.3 Effective Ruleset Bundle

```text
EFFECTIVE_RULESET_SHA = SHA256(canonical bundle {
  COMMON_PROTOCOL_SHA,
  UNIT_OVERLAY_SHA,
  CURRICULUM_MASTER_BUNDLE_SHA,
  PROJECT_CONFIG_SHA,
  PROTOCOL_CONTRACT_REGISTRY_SHA
})
```

A/B/C/D review는 `EFFECTIVE_RULESET_SHA`를 기록한다.

---

# 4. Scope · Inventory · Reverse Scan

## 4.1 정방향 inventory

Overlay의 `targetStandardUnitKeys`로 원본 production 문항을 수집한다.

기본 포함:

```text
archive/exams/original/**
```

기본 제외:

```text
similar
types
textbook
candidate-only
backup / copy / temp
폐기 문항
헤더 / 비문항 객체
```

## 4.2 역방향 내용 스캔 필수

metadata가 잘못되었거나 누락된 target을 찾기 위해 해당 학년/과정의 원본을 내용 기준으로 역방향 스캔한다.

scope 상태 예:

```text
SCOPE_INCLUDED
SCOPE_INCLUDED_METADATA_DEFECT
SCOPE_CANDIDATE
OUT_OF_SCOPE_CONFIRMED
SCOPE_WITHDRAWN_VERIFIED
METADATA_REVIEW_REQUIRED
```

메타 오류를 발견했다고 production metadata를 자동 수정하지 않는다.

## 4.2.1 Scope Exclusion / Withdrawal Lock

`scopeStatus`와 production withdrawal 승인 사건을 같은 상태축으로 섞지 않는다.

forward inventory + reverse scan + scope adjudication이 끝난 시점에 실제 scope에 포함된 UID를 별도로 동결한다.

```text
INITIAL_INCLUDED_SCOPE_UID_SET
INITIAL_INCLUDED_SCOPE_UID_SET_SHA
```

이 집합의 문항은 이후 source correctness defect가 발견되었다는 이유만으로 denominator에서 조용히 제거할 수 없다.

다음 HARD invariant를 적용한다.

```text
questionUid IN INITIAL_INCLUDED_SCOPE_UID_SET
AND sourceCorrectnessImpactStatus IN {CORRECTNESS_AFFECTING, MIXED}
AND productionStudentFacingActive == true
=> simple scope exclusion FORBIDDEN
=> REPAIR_VERIFIED required
   OR SOURCE_BLOCKED
   OR verified production withdrawal required
```

정상적인 final target 제외는 다음 두 경우만 허용한다.

1. 독립 scope 재판정으로 실제 `OUT_OF_SCOPE_CONFIRMED`가 된 경우
2. 문항 자체를 학생용 production release에서 정식 철회하여 `SCOPE_WITHDRAWN_VERIFIED`가 된 경우

단순 사용자 승인만으로 correctness defect 문항을 제외하는 legacy scope-exclusion 승인 상태는 사용하지 않는다. 단순 승인 제외를 repair 대체수단으로 사용하는 것은 HARD FAIL이다.

production withdrawal은 별도 상태축을 사용한다.

```text
scopeWithdrawalStatus =
    NOT_APPLICABLE
    WITHDRAWAL_PENDING_APPROVAL
    SCOPE_WITHDRAWAL_APPROVED
    PRODUCTION_WITHDRAWAL_VERIFIED
    WITHDRAWAL_VERIFICATION_FAILED
```

withdrawal 완료에는 최소 다음 evidence가 필요하다.

```text
questionUid
approvalRef
withdrawalReasonCode
beforeProductionPresenceHash
afterProductionPresenceHash
studentFacingRemovalProofRef
productionIndexRemovalProofRef [if applicable]
productionRenderAbsenceProofRef [if applicable]
approvedBy
approvedAt
verifiedBy
verifiedAt
SCOPE_WITHDRAWAL_EVIDENCE_SHA
```

`SCOPE_WITHDRAWAL_APPROVED`만으로 final target에서 제외할 수 없다.

baseline freeze 이후 withdrawal 승인이 발생한 경우에는 production을 직접 수정하여 위 상태를 만들지 않는다.

```text
BASELINE_FREEZE_COMPLETED == true
AND scopeWithdrawalStatus == SCOPE_WITHDRAWAL_APPROVED
=> POST_BASELINE_PRODUCTION_WITHDRAWAL_REQUEST
=> CONTROLLED_BASELINE_RESET_REQUIRED
```

이 경우 §5.1의 controlled baseline-reset transaction이 완료되어 **새 active production baseline이 재동결된 뒤에만** 다음 상태를 선언할 수 있다.

```text
scopeStatus == SCOPE_WITHDRAWN_VERIFIED
=> scopeWithdrawalStatus == PRODUCTION_WITHDRAWAL_VERIFIED
AND SCOPE_WITHDRAWAL_EVIDENCE_SHA valid
AND productionStudentFacingActive == false
AND (
      withdrawalRequestedAfterBaselineFreeze == false
   OR CONTROLLED_BASELINE_RESET_STATUS == REFROZEN_VERIFIED
    )
```

baseline freeze 이후 withdrawal evidence에는 최소 다음 reset provenance를 추가한다.

```text
withdrawalRequestedAfterBaselineFreeze
controlledBaselineResetTransactionId
preResetBaselineTreeSha
postWithdrawalProductionTreeSha
postWithdrawalAbsenceVerificationSha
postResetBaselineTreeSha
controlledBaselineResetEvidenceSha
withdrawalRequestEvidenceRef [if promotion-latched]
withdrawalLatchConsumptionEvidenceSha [if promotion-latched]
```

`SCOPE_WITHDRAWAL_EVIDENCE_SHA`는 applicable한 경우 위 reset provenance까지 포함한다. promotion transaction에서 latch된 withdrawal이면 `withdrawalRequestEvidenceRef`와 valid `withdrawalLatchConsumptionEvidenceSha`도 포함해야 한다. 기존 frozen baseline을 몰래 바꾼 뒤 새 baseline인 것처럼 가장하거나 동일 latch를 여러 reset으로 소비한 evidence는 무효다.

초기 포함 UID 전체는 최종적으로 반드시 다음 disposition 중 하나를 가진다.

```text
FINAL_SCOPE_DISPOSITION =
    TARGET_INCLUDED
    OUT_OF_SCOPE_CONFIRMED
    WITHDRAWN_VERIFIED
```

이를 canonical map으로 봉인한다.

```text
FINAL_SCOPE_DISPOSITION_MAP_SHA = SHA256(canonical map {
  questionUid -> {
    finalScopeDisposition,
    scopeEvidenceRef,
    sourceCorrectnessImpactStatus,
    productionStudentFacingActive,
    withdrawalEvidenceSha [if applicable]
  }
})
```

Final Seal용 파생 count:

```text
SCOPE_WITHDRAWN_VERIFIED_COUNT
UNVERIFIED_SCOPE_WITHDRAWAL_COUNT
POST_BASELINE_WITHDRAWAL_REQUEST_COUNT
POST_BASELINE_WITHDRAWAL_REFROZEN_VERIFIED_COUNT =
count(post-baseline withdrawal UID whose SCOPE_WITHDRAWAL_EVIDENCE_SHA references
      a valid CONTROLLED_BASELINE_RESET_EVIDENCE_SHA with status REFROZEN_VERIFIED)
UNVERIFIED_POST_BASELINE_WITHDRAWAL_COUNT =
POST_BASELINE_WITHDRAWAL_REQUEST_COUNT - POST_BASELINE_WITHDRAWAL_REFROZEN_VERIFIED_COUNT

FINAL_SCOPE_DISPOSITION_INVALID_COUNT =
count(uid in INITIAL_INCLUDED_SCOPE_UID_SET where
      finalScopeDisposition NOT IN {TARGET_INCLUDED, OUT_OF_SCOPE_CONFIRMED, WITHDRAWN_VERIFIED})

EXCLUDED_CORRECTNESS_DEFECT_STILL_IN_PRODUCTION_COUNT =
count(uid in INITIAL_INCLUDED_SCOPE_UID_SET where
      finalScopeDisposition NOT IN {TARGET_INCLUDED, OUT_OF_SCOPE_CONFIRMED}
      AND sourceCorrectnessImpactStatus IN {CORRECTNESS_AFFECTING, MIXED}
      AND productionStudentFacingActive == true)
```

`OUT_OF_SCOPE_CONFIRMED`는 독립 scope evidence로 실제 프로젝트 범위 밖임이 확인된 경우이므로, 해당 문항이 production에서 active라는 이유만으로 이 프로젝트 seal을 막지는 않는다. 반대로 correctness defect 때문에 scope를 바꿨다는 증거는 `OUT_OF_SCOPE_CONFIRMED`의 근거가 될 수 없다. `sourceDefectTypes`, `sourceRepairStatus`, `sourceCorrectnessImpactStatus`는 scope inclusion/exclusion 판정의 근거로 사용하지 않으며, scope 판정은 Overlay 범위·원문 내용·dependency만으로 독립 수행한다.

final target denominator도 disposition map과 직접 대조한다.

```text
TARGET_INCLUDED_UID_SET_FROM_SCOPE_MAP =
{ uid in INITIAL_INCLUDED_SCOPE_UID_SET where finalScopeDisposition == TARGET_INCLUDED }

FINAL_TARGET_SCOPE_PARITY = PASS iff
FINAL_TARGET_UID_SET == TARGET_INCLUDED_UID_SET_FROM_SCOPE_MAP
AND FINAL_TARGET_COUNT == count(TARGET_INCLUDED_UID_SET_FROM_SCOPE_MAP)
```

최종 HARD invariant:

```text
FINAL_SCOPE_DISPOSITION_INVALID_COUNT == 0
FINAL_TARGET_SCOPE_PARITY == PASS
EXCLUDED_CORRECTNESS_DEFECT_STILL_IN_PRODUCTION_COUNT == 0
UNVERIFIED_SCOPE_WITHDRAWAL_COUNT == 0
UNVERIFIED_POST_BASELINE_WITHDRAWAL_COUNT == 0
```

## 4.3 예상 문항 수를 최종값으로 고정하지 않는다

```text
TARGET_ESTIMATE = ESTIMATE_ONLY
FINAL_TARGET_UID_SET = unique questionUid set in frozen final manifest
FINAL_TARGET_UID_SET_SHA = SHA256(canonical sorted FINAL_TARGET_UID_SET)
FINAL_TARGET_COUNT = count(FINAL_TARGET_UID_SET)
```

## 4.4 stable questionUid

권장 identity 구성:

```text
sourceJsPath
examId
id
displayNo
```

`contentHash`를 UID 자체에 넣지 않는다.

source/solution/asset hash는 별도 관리한다.

## 4.5 Composite / Shared Material dependency

공통 자료를 공유하는 문항은 dependency closure를 명시한다.

```text
groupUid
sharedMaterialUid
sharedMaterialRole
dependencyQuestionUids
renderSequence
dependencyClosureStatus
```

미해결 dependency가 있으면 manifest freeze 금지.

## 4.6 Inventory parity

최소:

```text
target_count > 0
unique_question_uid == target_count
duplicate_uid == 0
missing_source_path == 0
unresolved_scope == 0
unresolved_curriculum == 0
unresolved_dependency == 0
dependency_closure_fail == 0
TARGET_QUESTION_UIDS resolved
PROTECTED_QUESTION_UIDS resolved
TARGET_RENDER_EXAM_COUNT > 0
```

---

# 5. Baseline Freeze · Environment Fingerprint

작업 시작 시 최소 기록:

```text
currentBranch
HEAD_SHA
mainSha
originMainSha
worktreeClean
BASELINE_TREE_SHA
MANIFEST_SHA
QUESTION_INDEX_SHA
COMMON_PROTOCOL_SHA
UNIT_OVERLAY_SHA
EFFECTIVE_RULESET_SHA
CURRICULUM_MASTER_BUNDLE_SHA
ENGINE_SHA
DB_SHA
RENDER_RUNTIME_FINGERPRINT_SHA
PROJECT_CONFIG_SHA
PROJECT_STAGING_BASELINE_SHA
HASH_CANONICALIZATION_SPEC_SHA
PROJECT_ATTEMPT_ID
PREVIOUS_PROJECT_ATTEMPT_ID   // 최초 attempt이면 null
```

계획서 기준 HEAD와 다르다고 임의 reset하지 않는다.

현재 차이를 보고하고 새 baseline을 정식 동결한다.

최초 project attempt를 시작할 때는 baseline freeze 전에 다음 lineage root를 확정한다.

```text
PROJECT_ATTEMPT_ID = new unique projectAttemptId
PREVIOUS_PROJECT_ATTEMPT_ID = null
REOPEN_POLICY_GATE = PASS_NOT_APPLICABLE
REOPEN_LINEAGE_PARITY = PASS_NOT_APPLICABLE
PROJECT_ATTEMPT_LINEAGE_PARITY = PASS
```

Reopen attempt의 `PROJECT_ATTEMPT_ID` 생성 규칙은 §42가 우선한다. 하나의 project attempt 안에서는 `PROJECT_ATTEMPT_ID`를 변경하지 않는다.

환경 변경 시:

```text
ENVIRONMENT_CHANGED
```

으로 전환하고 Repair Invalidation Matrix에 따라 evidence를 무효화한다.

## 5.1 Controlled Production Withdrawal Baseline Reset

baseline freeze 이후 승인된 production withdrawal은 frozen baseline에 대한 일반 수정으로 처리하지 않는다. **현재 frozen attempt를 명시적으로 supersede하고, 승인된 withdrawal만 수행한 뒤 새 active production baseline을 재동결하는 transaction**으로 처리한다.

상태:

```text
CONTROLLED_BASELINE_RESET_STATUS =
    NOT_APPLICABLE
    REQUIRED
    WITHDRAWAL_EXECUTING
    WITHDRAWAL_VERIFIED_PENDING_REFREEZE
    REFROZEN_VERIFIED
    FAILED
```

controlled reset은 **single-writer transaction**이다. 하나의 reset이 transient state에 있는 동안 두 번째 reset transaction을 중첩 생성하지 않는다.

```text
CONTROLLED_BASELINE_RESET_IN_PROGRESS iff
    CONTROLLED_BASELINE_RESET_STATUS IN {
        REQUIRED,
        WITHDRAWAL_EXECUTING,
        WITHDRAWAL_VERIFIED_PENDING_REFREEZE
    }
```

reset transaction의 trigger lineage는 transaction 생성 시 append-only init evidence로 고정하며 이후 변경할 수 없다.

```text
RESET_TRIGGER_TYPE =
    DIRECT_WITHDRAWAL
    PROMOTION_LATCHED_WITHDRAWAL
    QUEUED_WITHDRAWAL
    FAILED_RESET_RETRY

CONTROLLED_BASELINE_RESET_INIT_EVIDENCE_SHA = SHA256(canonical {
  controlledBaselineResetTransactionId,
  resetTriggerType,
  triggerWithdrawalRequestEvidenceRef,             // single queued/latch trigger가 아니면 null 가능
  triggerWithdrawalEventSequence,                 // queued event가 아니면 null
  originalTriggerWithdrawalRequestEvidenceSetSha, // 모든 direct/queued/retry trigger의 authoritative identity

  retryOfControlledBaselineResetTransactionId,    // retry가 아니면 null
  sourceWithdrawalQueueDrainEvidenceSha            // 최초 queued reset init 시 null 허용; retry/final evidence에서 exact ref 결박
})
```

`originalTriggerWithdrawalRequestEvidenceSetSha`는 하나의 reset/retry lineage에서 immutable하다. `FAILED_RESET_RETRY`는 새 withdrawal을 자기 trigger에 합치지 못하며 반드시 바로 이전 failed reset의 원 trigger set을 그대로 승계한다.

`REQUIRED` 상태의 유일한 producer는 다음 canonical start operation이다. 문서의 다른 절에서 `CONTROLLED_BASELINE_RESET_STATUS = REQUIRED`라고 축약해 쓰더라도 반드시 이 operation 전체를 의미하며 bare state assignment는 HARD FAIL이다.

```text
START_CONTROLLED_BASELINE_RESET(trigger)
→ new unique controlledBaselineResetTransactionId 발급
→ resetTriggerType 결정
→ originalTriggerWithdrawalRequestEvidenceSetSha 확정
→ queued/retry lineage field 확정
→ CONTROLLED_BASELINE_RESET_INIT_EVIDENCE_SHA append
→ only then CONTROLLED_BASELINE_RESET_STATUS = REQUIRED
```

trigger source별 canonical type:

```text
A/B의 open-promotion 없는 승인 withdrawal        -> DIRECT_WITHDRAWAL
C0/C1/C2/D/E/F의 promotion-latched withdrawal    -> PROMOTION_LATCHED_WITHDRAWAL
queue drain으로 시작                              -> QUEUED_WITHDRAWAL
FAILED 원 trigger 재시도                          -> FAILED_RESET_RETRY
```


FAILED 상태도 새 withdrawal event intake에서 빈 상태가 아니다.

```text
NEW_POST_BASELINE_WITHDRAWAL_REQUEST == true
AND CONTROLLED_BASELINE_RESET_STATUS == FAILED
=> failed reset의 original trigger에 merge = FORBIDDEN
=> failed reset transaction/evidence immutable
=> distinct withdrawalRequestEvidenceRef는 QUEUED_WITHDRAWAL_EVENT에 1회 append
=> CONTROLLED_BASELINE_RESET_STATUS remains FAILED
=> failed original trigger retry가 queued event drain보다 우선

if withdrawalRequestEvidenceRef == failed original trigger ref or an already-queued identical ref:
=> idempotent duplicate observation only
=> no new queue entry
=> no reset status mutation
```

`CONTROLLED_BASELINE_RESET_IN_PROGRESS == true`인 동안 `controlledBaselineResetTransactionId`는 immutable하다. 이때 새로운 distinct withdrawal event가 관측되면 현재 reset의 trigger bundle을 뒤늦게 변경하거나 `REQUIRED`로 상태를 되감지 않고 append-only queue에 직렬화한다.

```text
NEW_POST_BASELINE_WITHDRAWAL_REQUEST == true
AND CONTROLLED_BASELINE_RESET_IN_PROGRESS == true
=> NESTED_CONTROLLED_BASELINE_RESET = FORBIDDEN
=> current controlledBaselineResetTransactionId unchanged
=> current reset trigger/evidence input immutable
=> QUEUED_WITHDRAWAL_EVENT ledger entry append
=> PENDING_WITHDRAWAL_DURING_RESET_COUNT += 1  // distinct withdrawalRequestEvidenceRef 기준
```

pending queue는 mutable list가 아니라 append-only `EVIDENCE_LEDGER`의 `QUEUED_WITHDRAWAL_EVENT`와 `WITHDRAWAL_QUEUE_DRAIN_EVIDENCE`를 기준으로 계산되는 derived view다. 동일 `withdrawalRequestEvidenceRef`를 둘 이상 pending entry로 중복 적재하는 것을 금지한다.

canonical queue ledger entry:

```text
QUEUED_WITHDRAWAL_EVENT {
  withdrawalEventSequence,              // project attempt 안에서 monotonic unique integer
  withdrawalRequestEvidenceRef,
  observedDuringResetTransactionId,
  observedAt
}

WITHDRAWAL_QUEUE_DRAIN_EVIDENCE {
  withdrawalEventSequence,
  withdrawalRequestEvidenceRef,
  observedDuringResetTransactionId,        // exact QUEUED_WITHDRAWAL_EVENT provenance
  drainAuthorizedAfterResetTransactionId, // queue drain을 허가한 직전 REFROZEN_VERIFIED reset/retry
  drainAuthorizedAfterResetEvidenceSha,   // 위 transaction의 exact reset evidence SHA
  minimumPendingWithdrawalEventSequenceAtDrain,
  nextControlledBaselineResetTransactionId,
  nextControlledBaselineResetInitEvidenceSha,
  disposition: DEQUEUED_FOR_RESET
}
```

queue 처리 순서는 `withdrawalEventSequence ASC`, 동률은 허용하지 않는다. sequence duplicate 또는 하나의 queued event에 복수 drain evidence가 있으면 HARD FAIL이다. queued event를 drain할 때는 **현재 single-writer reset/retry lineage가 `REFROZEN_VERIFIED`로 완전히 해소되고 unresolved `FAILED` lineage가 0인 상태**여야 한다. 그 시점의 undrained queue 중 최소 `withdrawalEventSequence`만 선택한다. 먼저 새 reset transaction id와 `CONTROLLED_BASELINE_RESET_INIT_EVIDENCE_SHA`를 생성하여 exact queued event identity를 trigger로 고정하고, queue intake provenance와 직전 성공 reset authorization을 drain evidence에 함께 결박한 뒤 `REQUIRED`로 진입한다.

`observedDuringResetTransactionId`와 `drainAuthorizedAfterResetTransactionId`는 의미가 다르다. 전자는 withdrawal event가 최초 관측된 reset transaction이고, 후자는 그 event를 queue에서 꺼내도 된다고 허가한 직전 성공 reset/retry transaction이다. 하나를 다른 의미의 alias로 사용하거나 임의의 historical reset id를 기록하는 것을 금지한다.

```text
PENDING_WITHDRAWAL_DURING_RESET_COUNT =
count(distinct queued withdrawalRequestEvidenceRef without valid drain evidence)

DUPLICATE_PENDING_WITHDRAWAL_EVENT_COUNT =
count(withdrawalRequestEvidenceRef having more than one live pending queue entry)

DUPLICATE_WITHDRAWAL_QUEUE_DRAIN_COUNT =
count(withdrawalRequestEvidenceRef having more than one valid DEQUEUED_FOR_RESET evidence)

ORPHAN_WITHDRAWAL_QUEUE_DRAIN_COUNT =
count(valid-looking drain evidence for which exact next reset transaction/init evidence does not exist or trigger identity mismatches)

UNVERIFIED_DRAINED_WITHDRAWAL_EVENT_COUNT =
count(drained queued events whose reset/retry lineage has not terminated in exact-trigger REFROZEN_VERIFIED evidence)

NESTED_CONTROLLED_BASELINE_RESET_COUNT =
count(reset transactions whose active intervals overlap)

WITHDRAWAL_EVENT_QUEUE_LEDGER_SHA =
SHA256(canonical ordered QUEUED_WITHDRAWAL_EVENT + WITHDRAWAL_QUEUE_DRAIN_EVIDENCE entries)
```

queue/retry ordering verifier는 현재 최종 상태만 보지 않고 append-only `EVIDENCE_LEDGER`의 각 evidence append position에서 당시의 상태를 재구성한다. 다음 derived function은 저장 필드가 아니라 verifier가 history에서 계산한다.

```text
UNRESOLVED_FAILED_RESET_LINEAGE_COUNT_AT(position) =
count(FAILED reset transactions whose trigger lineage has no REFROZEN_VERIFIED retry/reset evidence appended before position)

MIN_UNDRAINED_WITHDRAWAL_EVENT_SEQUENCE_AT(position) =
min(withdrawalEventSequence among QUEUED_WITHDRAWAL_EVENT entries appended before position
    for which no valid WITHDRAWAL_QUEUE_DRAIN_EVIDENCE was appended before position)

UNVERIFIED_DRAINED_WITHDRAWAL_EVENT_COUNT_AT(position) =
count(withdrawal events having a valid drain appended before position
    but no exact-trigger REFROZEN_VERIFIED reset/retry evidence appended before position)
```

이 값을 drain evidence 내부의 자기선언 값으로 대체하거나 최종 ledger snapshot만 보고 역추정하여 PASS시키는 것을 금지한다.

`FAILED_RESET_RETRY_TRIGGER_PARITY`, `FAILED_RESET_RETRY_BEFORE_QUEUE_DRAIN_PARITY`, `WITHDRAWAL_QUEUE_FIFO_PARITY`, `WITHDRAWAL_QUEUE_PROVENANCE_PARITY`, `WITHDRAWAL_QUEUE_DRAIN_TO_RESET_PARITY`는 다음 aggregate predicate다.

```text
FAILED_RESET_RETRY_TRIGGER_PARITY == PASS iff
    every FAILED_RESET_RETRY transaction has a valid retryOfControlledBaselineResetTransactionId
    AND retryOf points to the immediately preceding unresolved FAILED reset transaction in the same trigger lineage
    AND each FAILED reset transaction has at most one retry successor
    AND no retry successor may be created after that lineage already reached REFROZEN_VERIFIED
    AND retry.originalTriggerWithdrawalRequestEvidenceSetSha
        == failed.originalTriggerWithdrawalRequestEvidenceSetSha
    AND retry does not add/remove/replace withdrawal trigger evidence
    AND if failed lineage originated from a queued event:
        retry.triggerWithdrawalEventSequence == failed.triggerWithdrawalEventSequence
        AND retry.triggerWithdrawalRequestEvidenceRef == failed.triggerWithdrawalRequestEvidenceRef
        AND retry.sourceWithdrawalQueueDrainEvidenceSha == failed.sourceWithdrawalQueueDrainEvidenceSha
    AND retry chain is acyclic

FAILED_RESET_RETRY_TRIGGER_PARITY == PASS_NOT_APPLICABLE iff
    no FAILED reset retry has occurred in current project attempt

FAILED_RESET_RETRY_BEFORE_QUEUE_DRAIN_PARITY == PASS iff
    for every reset init evidence with resetTriggerType == QUEUED_WITHDRAWAL at its append position:
        UNRESOLVED_FAILED_RESET_LINEAGE_COUNT_AT(init append position) == 0
    AND for every WITHDRAWAL_QUEUE_DRAIN_EVIDENCE at its append position in EVIDENCE_LEDGER:
        UNRESOLVED_FAILED_RESET_LINEAGE_COUNT_AT(drain append position) == 0
    AND drain.drainAuthorizedAfterResetTransactionId is the exact immediately preceding reset/retry transaction whose lineage reached REFROZEN_VERIFIED before this queued reset init/drain
    AND drain.drainAuthorizedAfterResetEvidenceSha is that transaction's exact CONTROLLED_BASELINE_RESET_EVIDENCE_SHA
    AND nextControlledBaselineResetInitEvidenceSha append position
        > drainAuthorizedAfterResetEvidenceSha append position
    AND drain evidence append position
        > nextControlledBaselineResetInitEvidenceSha append position
    AND no queued reset init or drain is appended between a FAILED reset and the first successful retry/refreeze that resolves that FAILED lineage

FAILED_RESET_RETRY_BEFORE_QUEUE_DRAIN_PARITY == PASS_NOT_APPLICABLE iff
    no WITHDRAWAL_QUEUE_DRAIN_EVIDENCE exists in current project attempt

WITHDRAWAL_QUEUE_FIFO_PARITY == PASS iff
    for every reset init evidence with resetTriggerType == QUEUED_WITHDRAWAL at its append position:
        init.triggerWithdrawalEventSequence
        == MIN_UNDRAINED_WITHDRAWAL_EVENT_SEQUENCE_AT(init append position)
    AND for every WITHDRAWAL_QUEUE_DRAIN_EVIDENCE at its append position in EVIDENCE_LEDGER:
        drain.withdrawalEventSequence
        == MIN_UNDRAINED_WITHDRAWAL_EVENT_SEQUENCE_AT(drain append position)
        == drain.minimumPendingWithdrawalEventSequenceAtDrain
    AND drain.withdrawalEventSequence
        == next reset init.triggerWithdrawalEventSequence
    AND for every drain after the first:
        every lower-sequence previously drained withdrawal event has already reached exact-trigger REFROZEN_VERIFIED reset/retry evidence before this drain append position
        AND UNVERIFIED_DRAINED_WITHDRAWAL_EVENT_COUNT_AT(drain append position) == 0
    AND queue event sequence order is strictly increasing among successive drains

WITHDRAWAL_QUEUE_FIFO_PARITY == PASS_NOT_APPLICABLE iff
    no WITHDRAWAL_QUEUE_DRAIN_EVIDENCE exists in current project attempt

WITHDRAWAL_QUEUE_PROVENANCE_PARITY == PASS iff
    every drain references exactly one prior queued event
    AND drain.observedDuringResetTransactionId
        == queuedEvent.observedDuringResetTransactionId
    AND queuedEvent.observedDuringResetTransactionId is the reset transaction that was active/FAILED when the withdrawal event was first queued
    AND drain.drainAuthorizedAfterResetTransactionId
        != null
    AND drain.drainAuthorizedAfterResetEvidenceSha
        == exact REFROZEN_VERIFIED reset evidence for drain.drainAuthorizedAfterResetTransactionId
    AND drain.drainAuthorizedAfterResetTransactionId is not substituted for queuedEvent.observedDuringResetTransactionId unless they are factually the same transaction

WITHDRAWAL_QUEUE_PROVENANCE_PARITY == PASS_NOT_APPLICABLE iff
    no WITHDRAWAL_QUEUE_DRAIN_EVIDENCE exists in current project attempt

WITHDRAWAL_QUEUE_DRAIN_TO_RESET_PARITY == PASS iff
    every valid drain references exactly one prior QUEUED_WITHDRAWAL_EVENT
    AND FAILED_RESET_RETRY_BEFORE_QUEUE_DRAIN_PARITY == PASS
    AND WITHDRAWAL_QUEUE_FIFO_PARITY == PASS
    AND WITHDRAWAL_QUEUE_PROVENANCE_PARITY == PASS
    AND drain.nextControlledBaselineResetTransactionId exists
    AND drain.nextControlledBaselineResetInitEvidenceSha is valid
    AND that init evidence.resetTriggerType == QUEUED_WITHDRAWAL
    AND init evidence.triggerWithdrawalEventSequence == drain.withdrawalEventSequence
    AND init evidence.triggerWithdrawalRequestEvidenceRef == drain.withdrawalRequestEvidenceRef
    AND any later FAILED_RESET_RETRY preserves the same original trigger identity
    AND the final successful reset evidence in that lineage binds the same queued event/drain identity
    AND its controlledBaselineResetStatus == REFROZEN_VERIFIED

WITHDRAWAL_QUEUE_DRAIN_TO_RESET_PARITY == PASS_NOT_APPLICABLE iff
    no WITHDRAWAL_QUEUE_DRAIN_EVIDENCE exists in current project attempt
```

queue ledger canonical order는 `(withdrawalEventSequence, entryType)`이며 raw evidence refs를 포함한다. queue event가 한 번도 없으면 이 SHA는 `NOT_APPLICABLE`로 기록할 수 있다.

```text
WITHDRAWAL_EVENT_QUEUE_LEDGER_INTEGRITY == PASS iff
    withdrawalEventSequence duplicate == 0
    AND duplicate live pending event == 0
    AND duplicate drain evidence == 0
    AND every drain references exactly one prior queued event
    AND every drained event points to exactly one new reset transaction id/init evidence
    AND ORPHAN_WITHDRAWAL_QUEUE_DRAIN_COUNT == 0
    AND FAILED_RESET_RETRY_BEFORE_QUEUE_DRAIN_PARITY IN {PASS, PASS_NOT_APPLICABLE}
    AND WITHDRAWAL_QUEUE_FIFO_PARITY IN {PASS, PASS_NOT_APPLICABLE}
    AND WITHDRAWAL_QUEUE_PROVENANCE_PARITY IN {PASS, PASS_NOT_APPLICABLE}

WITHDRAWAL_EVENT_QUEUE_LEDGER_INTEGRITY == PASS_NOT_APPLICABLE iff
    no QUEUED_WITHDRAWAL_EVENT has ever existed in current project attempt
```

현재 reset이 `REFROZEN_VERIFIED` evidence까지 완전히 닫히고 **unresolved FAILED reset lineage count == 0**인 뒤 pending event가 존재하면 정상 pipeline으로 재진입하지 않는다. canonical queue order에서 현재 undrained event 중 최소 `withdrawalEventSequence` 하나만 선택한다. **새 `controlledBaselineResetTransactionId` + init evidence를 먼저 생성하여 exact queue event를 trigger로 고정하고**, queue intake의 `observedDuringResetTransactionId`와 직전 성공 reset의 `drainAuthorizedAfterResetTransactionId`/evidence SHA를 함께 기록한 `WITHDRAWAL_QUEUE_DRAIN_EVIDENCE`를 append한 뒤 새 reset을 `REQUIRED`에서 시작한다. queue가 0이 되고 모든 drained event가 verified reset/retry lineage로 소비될 때까지 이를 반복한다. FIFO를 뒤집거나 unresolved FAILED lineage보다 queue drain을 먼저 실행하면 후속 상태가 정상화되어도 evidence history 기준 HARD FAIL이다.

promotion transaction 생성 전/진행 중/종료 후의 project-level context를 transaction-local enum과 분리한다.

```text
PROMOTION_TRANSACTION_CONTEXT =
    NO_TRANSACTION
    OPEN_TRANSACTION
    TERMINAL_TRANSACTION
```

canonical 의미:

```text
NO_TRANSACTION iff
    ACTIVE_PROMOTION_TRANSACTION_ID == null

OPEN_TRANSACTION iff
    ACTIVE_PROMOTION_TRANSACTION_ID != null
    AND PROMOTION_TRANSACTION_FINALIZATION_STATUS IN {
        NOT_STARTED,
        PROMOTING,
        PROMOTED_PENDING_FINAL_SEAL,
        FINALIZATION_FAILED_ROLLBACK_REQUIRED
    }

TERMINAL_TRANSACTION iff
    ACTIVE_PROMOTION_TRANSACTION_ID != null
    AND PROMOTION_TRANSACTION_FINALIZATION_STATUS IN {
        FINALIZED_ABORTED_NO_MUTATION,
        FINALIZED_ROLLED_BACK,
        FINALIZED_SEALED
    }
```

`NOT_STARTED`는 **이미 `NEW_PROMOTION_TRANSACTION`이 생성된 뒤의 transaction-local 최초 상태**이며, transaction 자체가 아직 없는 상태를 뜻하지 않는다. `NO_TRANSACTION` 상태에서 transaction-local `PROMOTION_TRANSACTION_FINALIZATION_STATUS`, `WITHDRAWAL_REQUEST_LATCHED`, `PRODUCTION_MUTATED`, `FURTHER_PRODUCTION_MUTATION`을 존재하는 것처럼 읽거나 기본값으로 추정하는 것을 금지한다.

### 5.1.1 Withdrawal 요청 시점 우선순위

withdrawal 요청은 PRESEAL, production mutation, promotion transaction 상태에 따라 아래 상태표로 완전히 분기한다. **정의되지 않은 withdrawal 경로는 허용하지 않는다.** 이 우선순위는 §36.7보다 임의로 낮추거나 뒤집을 수 없다.

공통 event 규칙:

```text
POST_BASELINE_PRODUCTION_WITHDRAWAL_REQUEST observed during an open promotion transaction
=> WITHDRAWAL_REQUEST_LATCHED = true
=> withdrawalRequestEvidenceRef valid
=> DIRECT_WITHDRAWAL_DURING_OPEN_PROMOTION = FORBIDDEN
```

```text
WITHDRAWAL_REQUEST_LATCHED == true
=> withdrawalRequestEvidenceRef must identify the exact latched event or canonical event bundle
```

`WITHDRAWAL_REQUEST_LATCHED == true`가 된 뒤에는 해당 promotion transaction이 안전하게 종료될 때까지 withdrawal 자체를 production에 실행하지 않는다. 또한 `PROMOTING` 중 event를 처리할 때는 event latch와 production-mutation fence를 같은 transaction lock 아래에서 판정한다. latch 시점에 production mutation이 아직 시작되지 않았다면 이후 새 production mutation을 시작할 수 없고, 이미 mutation이 시작되었거나 완료되었다면 rollback branch로만 이동한다.

`PRODUCTION_MUTATED`는 하나의 promotion transaction 안에서 monotonic하다. 한번 `true`가 되면 그 transaction이 종료되기 전 다시 `false`로 되돌리지 않는다.

#### A. baseline freeze 이후 ~ PRESEAL 완료 전, open promotion transaction 없음

```text
BASELINE_FREEZE_COMPLETED == true
AND MOTHER_PRESEAL_PASS != true
AND (
      PROMOTION_TRANSACTION_CONTEXT == NO_TRANSACTION
   OR (
        PROMOTION_TRANSACTION_CONTEXT == TERMINAL_TRANSACTION
        AND PROMOTION_TRANSACTION_FINALIZATION_STATUS IN {FINALIZED_ABORTED_NO_MUTATION, FINALIZED_ROLLED_BACK}
      )
    )
AND UNCONSUMED_TERMINAL_WITHDRAWAL_LATCH_COUNT == 0
AND CONTROLLED_BASELINE_RESET_STATUS IN {NOT_APPLICABLE, REFROZEN_VERIFIED}
AND PENDING_WITHDRAWAL_DURING_RESET_COUNT == 0
AND POST_BASELINE_PRODUCTION_WITHDRAWAL_REQUEST == true
=> CONTROLLED_BASELINE_RESET_STATUS = REQUIRED
=> §5.1.2 transaction 직접 실행
```

#### B. PRESEAL 완료 이후 ~ promotion transaction 생성 전, open promotion transaction 없음

```text
MOTHER_PRESEAL_PASS == true
AND (
      PROMOTION_TRANSACTION_CONTEXT == NO_TRANSACTION
   OR (
        PROMOTION_TRANSACTION_CONTEXT == TERMINAL_TRANSACTION
        AND PROMOTION_TRANSACTION_FINALIZATION_STATUS IN {FINALIZED_ABORTED_NO_MUTATION, FINALIZED_ROLLED_BACK}
      )
    )
AND UNCONSUMED_TERMINAL_WITHDRAWAL_LATCH_COUNT == 0
AND CONTROLLED_BASELINE_RESET_STATUS IN {NOT_APPLICABLE, REFROZEN_VERIFIED}
AND PENDING_WITHDRAWAL_DURING_RESET_COUNT == 0
AND POST_BASELINE_PRODUCTION_WITHDRAWAL_REQUEST == true
=> current PRESEAL eligibility invalidate
=> current PRESEAL_BUNDLE_SHA invalidate
=> CONTROLLED_BASELINE_RESET_STATUS = REQUIRED
=> §5.1.2 transaction 실행
=> 새 active baseline 기준 PRESEAL부터 다시 수행
```

PRESEAL 완료는 production을 수정할 권한을 만들지 않는다. open promotion transaction이 없는 상태의 withdrawal은 기존 PRESEAL을 폐기한 뒤 controlled reset으로 되돌아간다. 과거 terminal transaction의 transaction-local `PRODUCTION_MUTATED` 값은 A/B 판정에 사용하지 않는다.

#### C0. transaction 생성 완료 후 `NOT_STARTED`에서 withdrawal

```text
PROMOTION_TRANSACTION_CONTEXT == OPEN_TRANSACTION
AND PROMOTION_TRANSACTION_FINALIZATION_STATUS == NOT_STARTED
AND POST_BASELINE_PRODUCTION_WITHDRAWAL_REQUEST == true
=> WITHDRAWAL_REQUEST_LATCHED = true
=> FURTHER_PRODUCTION_MUTATION = FORBIDDEN
=> DIRECT_WITHDRAWAL_DURING_OPEN_PROMOTION = FORBIDDEN
=> PROMOTION_ABORT_EVIDENCE_SHA 생성
=> PROMOTION_TRANSACTION_FINALIZATION_STATUS = FINALIZED_ABORTED_NO_MUTATION
=> PROMOTION_TRANSACTION_CONTEXT = TERMINAL_TRANSACTION
=> CONTROLLED_BASELINE_RESET_STATUS = REQUIRED
=> §5.1.2 transaction 시작
```

`NOT_STARTED` transaction에서 withdrawal이 관측되면 `PROMOTING`으로 진입하거나 production mutation을 시작해서는 안 된다.

#### C. `PROMOTING` 중 withdrawal

```text
PROMOTION_TRANSACTION_FINALIZATION_STATUS == PROMOTING
AND POST_BASELINE_PRODUCTION_WITHDRAWAL_REQUEST == true
=> WITHDRAWAL_REQUEST_LATCHED = true
=> DIRECT_WITHDRAWAL_DURING_OPEN_PROMOTION = FORBIDDEN
```

이 event는 production mutation 여부에 따라 정확히 둘 중 하나로만 분기한다.

##### C1. 아직 production mutation이 시작되지 않은 경우

```text
PROMOTION_TRANSACTION_FINALIZATION_STATUS == PROMOTING
AND WITHDRAWAL_REQUEST_LATCHED == true
AND PRODUCTION_MUTATED == false
=> FURTHER_PRODUCTION_MUTATION = FORBIDDEN
=> current promotion attempt abort
=> PROMOTION_ABORT_EVIDENCE_SHA 생성
=> PROMOTION_TRANSACTION_FINALIZATION_STATUS = FINALIZED_ABORTED_NO_MUTATION
=> CONTROLLED_BASELINE_RESET_STATUS = REQUIRED
=> §5.1.2 transaction 시작
```

withdrawal event latch 이후 production mutation을 새로 시작하여 C1을 C2로 인위적으로 바꾸는 행위는 HARD FAIL이다.

##### C2. production mutation이 이미 시작되었거나 완료된 경우

```text
PROMOTION_TRANSACTION_FINALIZATION_STATUS == PROMOTING
AND WITHDRAWAL_REQUEST_LATCHED == true
AND PRODUCTION_MUTATED == true
=> PROMOTION_TRANSACTION_FINALIZATION_STATUS = FINALIZATION_FAILED_ROLLBACK_REQUIRED
=> mandatory rollback + verification
=> production baseline parity 재확인
=> FINALIZATION_ROLLBACK_EVIDENCE_SHA 생성
=> PROMOTION_TRANSACTION_FINALIZATION_STATUS = FINALIZED_ROLLED_BACK
=> CONTROLLED_BASELINE_RESET_STATUS = REQUIRED
=> §5.1.2 transaction 시작
```

rollback 완료 전 withdrawal 실행 또는 새 baseline generation 생성은 금지한다.

#### D. `PROMOTED_PENDING_FINAL_SEAL` 중 withdrawal

```text
PRODUCTION_MUTATED == true
AND PROMOTION_TRANSACTION_FINALIZATION_STATUS == PROMOTED_PENDING_FINAL_SEAL
AND POST_BASELINE_PRODUCTION_WITHDRAWAL_REQUEST == true
=> WITHDRAWAL_REQUEST_LATCHED = true
=> DIRECT_WITHDRAWAL_DURING_OPEN_PROMOTION = FORBIDDEN
```

이 구간에서는 withdrawal을 현재 production에 직접 실행하지 않는다. 먼저 열려 있는 promotion transaction을 §36.7 규칙으로 종료해야 한다.

```text
POST_PROMOTION_WITHDRAWAL_ABORT
→ PROMOTION_TRANSACTION_FINALIZATION_STATUS = FINALIZATION_FAILED_ROLLBACK_REQUIRED
→ promotion baseline으로 mandatory rollback
→ rollback verification
→ production baseline parity 재확인
→ FINALIZATION_ROLLBACK_EVIDENCE_SHA 생성
→ PROMOTION_TRANSACTION_FINALIZATION_STATUS = FINALIZED_ROLLED_BACK
→ 기존 promotion transaction 종료
→ withdrawal용 CONTROLLED_BASELINE_RESET_STATUS = REQUIRED
→ §5.1.2의 새 controlled baseline-reset transaction 시작
```

#### E. rollback 진행 중 withdrawal

```text
PROMOTION_TRANSACTION_FINALIZATION_STATUS == FINALIZATION_FAILED_ROLLBACK_REQUIRED
AND POST_BASELINE_PRODUCTION_WITHDRAWAL_REQUEST == true
=> WITHDRAWAL_REQUEST_LATCHED = true
=> DIRECT_WITHDRAWAL_DURING_OPEN_PROMOTION = FORBIDDEN
=> 현재 rollback을 끝까지 완료
=> FINALIZED_ROLLED_BACK 이후에만 §5.1.2 시작 가능
```

이미 rollback이 진행 중일 때 withdrawal 때문에 두 번째 production mutation이나 두 번째 rollback transaction을 중첩 생성하지 않는다.

#### E2. controlled reset 진행 중 추가 withdrawal — queue only

```text
CONTROLLED_BASELINE_RESET_IN_PROGRESS == true
AND NEW_POST_BASELINE_WITHDRAWAL_REQUEST == true
=> current controlledBaselineResetTransactionId immutable
=> NESTED_CONTROLLED_BASELINE_RESET = FORBIDDEN
=> current reset state를 REQUIRED로 되감기 FORBIDDEN
=> current reset trigger/evidence input mutation FORBIDDEN
=> distinct withdrawalRequestEvidenceRef를 pending queue ledger에 append
=> current reset을 REFROZEN_VERIFIED까지 먼저 완료
=> pending queue가 있으면 새 controlledBaselineResetTransactionId로 다음 reset 시작
```

reset 진행 중 추가 withdrawal은 현재 reset에 묵시적으로 merge하지도, 무시하지도, 중첩 실행하지도 않는다. 동일 event의 중복 queue entry는 HARD FAIL이다. pending event를 새 reset으로 넘길 때는 `WITHDRAWAL_QUEUE_DRAIN_EVIDENCE`가 queued event ref와 새 `controlledBaselineResetTransactionId`를 1:1로 결박해야 하며 동일 event에 대한 복수 drain도 금지한다.

#### F. promotion transaction 종료 후 — unconsumed latch만 reset trigger

terminal transaction의 `WITHDRAWAL_REQUEST_LATCHED == true`는 immutable historical fact이므로 reset 완료 후 false로 되돌리지 않는다. 대신 해당 withdrawal event가 verified controlled reset에 의해 정확히 한 번 소비되었는지를 별도 append-only evidence로 추적한다.

```text
PROMOTION_TRANSACTION_CONTEXT == TERMINAL_TRANSACTION
AND PROMOTION_TRANSACTION_FINALIZATION_STATUS IN {FINALIZED_ROLLED_BACK, FINALIZED_ABORTED_NO_MUTATION}
AND WITHDRAWAL_REQUEST_LATCHED == true
AND no valid WITHDRAWAL_LATCH_CONSUMPTION_EVIDENCE exists for that withdrawalRequestEvidenceRef
AND CONTROLLED_BASELINE_RESET_IN_PROGRESS == false
AND CONTROLLED_BASELINE_RESET_STATUS IN {NOT_APPLICABLE, REFROZEN_VERIFIED}
=> CONTROLLED_BASELINE_RESET_STATUS = REQUIRED
=> §5.1.2 transaction 시작 가능
```

동일 unconsumed terminal latch가 발견되었지만 다른 controlled reset이 이미 진행 중이면 새 reset을 시작하지 않는다. 해당 `withdrawalRequestEvidenceRef`가 pending queue에 아직 없다면 E2 규칙으로 정확히 한 번 queue하고 현재 reset을 먼저 완료한다.

반대로 동일 withdrawal event에 대해 valid consumption evidence가 이미 존재하면 같은 terminal latch만을 근거로 두 번째 reset을 시작하면 HARD FAIL이다.

이미 `FINALIZED_SEALED`인 release에 대한 새 withdrawal 요청은 종료된 promotion transaction을 다시 열지 않는다. §42 Reopen Policy에 따라 새 변경 attempt를 시작하고, 그 새 attempt의 baseline freeze 이후 withdrawal 규칙을 적용한다.

withdrawal event에 대한 promotion-state coverage는 다음과 같으며 각 행의 결과는 정확히 하나여야 한다.

```text
NO_TRANSACTION/nonsealed TERMINAL + preseal not passed + no unconsumed latch -> A controlled reset
NO_TRANSACTION/nonsealed TERMINAL + preseal passed + no unconsumed latch     -> B invalidate preseal + controlled reset
OPEN NOT_STARTED                                                   -> C0 abort-no-mutation + controlled reset
PROMOTING + production not mutated                                 -> C1 abort-no-mutation + controlled reset
PROMOTING + production mutated                                     -> C2 rollback + controlled reset
PROMOTED_PENDING_FINAL_SEAL                                        -> D rollback + controlled reset
FINALIZATION_FAILED_ROLLBACK_REQUIRED                              -> E latch + finish rollback + controlled reset
FINALIZED_ROLLED_BACK + unconsumed latch                           -> F controlled reset
FINALIZED_ABORTED_NO_MUTATION + unconsumed latch                   -> F controlled reset
terminal + already-consumed same latch                             -> no second reset from same event
FINALIZED_SEALED                                                   -> §42 reopen authorization + new project attempt; current transaction immutable
RESET IN PROGRESS + new withdrawal                                 -> queue only; no nested reset; current reset completes first
ANY nonsealed terminal -> next promotion attempt                   -> NEW_PROMOTION_TRANSACTION with new promotionTransactionId (§36.7.1)
SEALED terminal -> next promotion attempt                          -> §42 REOPEN_POLICY_GATE + REOPEN_LINEAGE_PARITY required before NEW_PROMOTION_TRANSACTION
```

### 5.1.2 Controlled reset normative ordering

`CONTROLLED_BASELINE_RESET_STATUS`의 normative state transition은 다음과 같다. enum에 존재하지만 실행 경로가 없는 상태를 허용하지 않는다.

```text
NOT_APPLICABLE
  -- approved post-baseline withdrawal --> REQUIRED

REQUIRED
  -- step 3 production withdrawal starts --> WITHDRAWAL_EXECUTING

WITHDRAWAL_EXECUTING
  -- step 4 absence verification PASS --> WITHDRAWAL_VERIFIED_PENDING_REFREEZE

WITHDRAWAL_VERIFIED_PENDING_REFREEZE
  -- steps 5~7 refreeze/drift verification PASS --> REFROZEN_VERIFIED

REFROZEN_VERIFIED
  -- later new approved post-baseline withdrawal --> REQUIRED with new controlledBaselineResetTransactionId

REFROZEN_VERIFIED
  -- pending queued withdrawal exists --> append WITHDRAWAL_QUEUE_DRAIN_EVIDENCE, then REQUIRED with new controlledBaselineResetTransactionId before pipeline reentry

any non-terminal reset state
  -- required withdrawal/absence/refreeze verification FAIL --> FAILED

FAILED
  -- retry same original trigger --> new controlledBaselineResetTransactionId + FAILED_RESET_RETRY init evidence --> REQUIRED
  -- new distinct withdrawal --> QUEUED_WITHDRAWAL_EVENT append, status remains FAILED
```

`FAILED`에서는 PRESEAL, promotion, denominator exclusion용 `WITHDRAWN_VERIFIED` 선언을 모두 금지한다. 재시도는 새 `controlledBaselineResetTransactionId`를 발급하되 `resetTriggerType = FAILED_RESET_RETRY`, `retryOfControlledBaselineResetTransactionId = exact failed transaction`, `originalTriggerWithdrawalRequestEvidenceSetSha = failed transaction과 동일`이어야 한다. 새 distinct withdrawal은 failed original trigger에 합치지 않고 queue에 적재하며, failed 원 trigger의 retry가 성공해 `REFROZEN_VERIFIED`에 도달하기 전 queued event를 drain하지 않는다. 실패 attempt의 ledger/evidence ref를 덮어쓰지 않는다. `FAILED`에서 retry transaction 생성과 새 withdrawal event intake는 같은 controlled-reset single-writer lock으로 직렬화한다. 어느 쪽이 먼저 관측되더라도 새 distinct withdrawal은 retry의 original trigger set에 합쳐지지 않고 queue event로만 남는다.

필수 실행 순서:

```text
1. current candidate / current PRESEAL eligibility 무효화
2. 기존 active production baseline lock을 해당 attempt에 대해 formally close
3. `CONTROLLED_BASELINE_RESET_STATUS = WITHDRAWAL_EXECUTING` 전환 후 승인된 withdrawal transaction만 production에 실행
4. student-facing absence / index absence / render absence를 applicable 범위에서 검증
   → POST_WITHDRAWAL_ABSENCE_VERIFICATION_SHA
   → PASS 시 `CONTROLLED_BASELINE_RESET_STATUS = WITHDRAWAL_VERIFIED_PENDING_REFREEZE`
5. production baseline을 새 generation으로 재동결
   → BASELINE_TREE_SHA / QUESTION_INDEX_SHA 등 production-baseline hash 재생성
6. invalidatedEvidenceSet 확정
   → INVALIDATED_EVIDENCE_SET_SHA
7. refreeze verification 수행
   → 새 active baseline 기준 PRODUCTION_BASELINE_DRIFT == 0 확인
   → REFREEZE_VERIFICATION_SHA 생성
8. 위 4~7이 모두 PASS인 경우에만
   CONTROLLED_BASELINE_RESET_STATUS = REFROZEN_VERIFIED 확정
9. final status를 포함한 CONTROLLED_BASELINE_RESET_EVIDENCE_SHA 생성
10. promotion transaction의 latched withdrawal에서 시작된 reset이면 해당 withdrawal event의 WITHDRAWAL_LATCH_CONSUMPTION_EVIDENCE_SHA 생성
11. applicable withdrawal의 SCOPE_WITHDRAWAL_EVIDENCE_SHA를 reset evidence ref 및 applicable consumption evidence ref와 함께 확정
12. finalScopeDisposition을 반영해 MANIFEST_SHA / PROJECT_STAGING_BASELINE_SHA 및 영향 canonical hash 재생성
13. Repair Invalidation Matrix에 따라 영향 static/A/B/C/D/coverage/evidence 재평가
14. 현재 reset/retry lineage가 `REFROZEN_VERIFIED`에 도달한 뒤 `PENDING_WITHDRAWAL_DURING_RESET_COUNT > 0`이면 정상 pipeline 재진입을 금지하고 canonical queue order의 첫 event에 대해
    새 `controlledBaselineResetTransactionId`와 exact-trigger `CONTROLLED_BASELINE_RESET_INIT_EVIDENCE_SHA`를 생성 → 이를 참조하는 `WITHDRAWAL_QUEUE_DRAIN_EVIDENCE` append → `REQUIRED`부터 다음 reset 수행
15. `PENDING_WITHDRAWAL_DURING_RESET_COUNT == 0`, `DUPLICATE_PENDING_WITHDRAWAL_EVENT_COUNT == 0`, `DUPLICATE_WITHDRAWAL_QUEUE_DRAIN_COUNT == 0`, `ORPHAN_WITHDRAWAL_QUEUE_DRAIN_COUNT == 0`, `UNVERIFIED_DRAINED_WITHDRAWAL_EVENT_COUNT == 0`, `NESTED_CONTROLLED_BASELINE_RESET_COUNT == 0`, `FAILED_RESET_RETRY_TRIGGER_PARITY IN {PASS, PASS_NOT_APPLICABLE}`, `FAILED_RESET_RETRY_BEFORE_QUEUE_DRAIN_PARITY IN {PASS, PASS_NOT_APPLICABLE}`, `WITHDRAWAL_QUEUE_FIFO_PARITY IN {PASS, PASS_NOT_APPLICABLE}`, `WITHDRAWAL_QUEUE_PROVENANCE_PARITY IN {PASS, PASS_NOT_APPLICABLE}`, `WITHDRAWAL_QUEUE_DRAIN_TO_RESET_PARITY IN {PASS, PASS_NOT_APPLICABLE}`인 경우에만 정상 pipeline 재진입
```

`REFROZEN_VERIFIED`는 **refreeze verification과 새 baseline 기준 drift==0이 실제로 확인된 뒤에만** 확정한다. `CONTROLLED_BASELINE_RESET_EVIDENCE_SHA`는 그 final status가 확정된 뒤 생성하는 append-only evidence다. pending 상태를 담은 evidence를 나중에 덮어써 final PASS evidence로 바꾸는 행위는 금지한다.

이 순서는 hash 순환과 status time-travel을 동시에 금지하기 위한 normative ordering이다. `SCOPE_WITHDRAWAL_EVIDENCE_SHA` 또는 `CONTROLLED_BASELINE_RESET_EVIDENCE_SHA`가 자신을 포함하는 새 `MANIFEST_SHA`/`PROJECT_STAGING_BASELINE_SHA`를 입력으로 삼아서는 안 된다. 새 manifest/staging hash는 withdrawal/reset evidence가 확정된 **후** 계산하고, PRESEAL에서 함께 결박한다.

가장 중요한 provenance 불변식:

```text
INITIAL_INCLUDED_SCOPE_UID_SET_AFTER_RESET == INITIAL_INCLUDED_SCOPE_UID_SET_BEFORE_RESET
INITIAL_INCLUDED_SCOPE_UID_SET_SHA_AFTER_RESET == INITIAL_INCLUDED_SCOPE_UID_SET_SHA_BEFORE_RESET
```

withdrawal을 이유로 최초 포함 UID 집합을 다시 계산하거나 덮어써서는 안 된다. 철회 문항은 최초 scope provenance에 남고 `FINAL_SCOPE_DISPOSITION = WITHDRAWN_VERIFIED`로만 종결한다.

기존 baseline에서 만들어진 PRESEAL bundle은 새 baseline으로 승계할 수 없다.

```text
POST_BASELINE_WITHDRAWAL_REQUEST == true
=> EXISTING_PRESEAL_BUNDLE_CARRY_FORWARD = FORBIDDEN
=> current PRESEAL_BUNDLE_SHA = INVALIDATED
```

A/B/C/D 또는 static evidence의 개별 승계는 §31의 input-hash 기반 carry-forward 규칙을 다시 만족한 경우에만 가능하다. **PRESEAL 전체를 통째로 승계하는 것은 금지**한다.

controlled reset evidence 최소 객체:

```text
controlledBaselineResetTransactionId
controlledBaselineResetInitEvidenceSha
resetTriggerType
triggerWithdrawalRequestEvidenceRef
triggerWithdrawalEventSequence
originalTriggerWithdrawalRequestEvidenceSetSha
retryOfControlledBaselineResetTransactionId
sourceWithdrawalQueueDrainEvidenceSha
triggerWithdrawalUidSetSha
approvalEvidenceBundleSha
preResetBaselineGeneration
preResetBaselineTreeSha
preResetManifestSha
postWithdrawalProductionTreeSha
postWithdrawalAbsenceVerificationSha
postResetBaselineGeneration
postResetBaselineTreeSha
postResetQuestionIndexSha
initialIncludedScopeUidSetSha
invalidatedEvidenceSetSha
refreezeVerificationSha
controlledBaselineResetStatus   // canonical field; 반드시 REFROZEN_VERIFIED
```

queue-drained reset 또는 failed retry reset의 final evidence는 init/retry/drain trigger lineage를 그대로 보존해야 한다.

```text
CONTROLLED_BASELINE_RESET_EVIDENCE.controlledBaselineResetInitEvidenceSha
== exact init evidence SHA for this reset transaction

if resetTriggerType == QUEUED_WITHDRAWAL:
    sourceWithdrawalQueueDrainEvidenceSha == exact drain evidence SHA
    AND triggerWithdrawalEventSequence == drain.withdrawalEventSequence
    AND triggerWithdrawalRequestEvidenceRef == drain.withdrawalRequestEvidenceRef

if resetTriggerType == FAILED_RESET_RETRY:
    retryOfControlledBaselineResetTransactionId references exact prior FAILED reset
    AND originalTriggerWithdrawalRequestEvidenceSetSha is unchanged across retry chain
```

`controlledBaselineResetStatus`가 reset evidence 객체의 **유일한 canonical status field name**이다. evidence 객체 내부에 `status`, `resetStatus`, `CONTROLLED_BASELINE_RESET_STATUS`를 alias field로 추가하거나 verifier마다 다른 이름을 참조하는 것을 금지한다. evidence 생성 시:

```text
CONTROLLED_BASELINE_RESET_EVIDENCE.controlledBaselineResetStatus
== CONTROLLED_BASELINE_RESET_STATUS
== REFROZEN_VERIFIED
```

이어야 한다. project-level state token `CONTROLLED_BASELINE_RESET_STATUS`와 evidence-object field `controlledBaselineResetStatus`는 의미는 같지만 저장 위치와 canonical field name이 다르며, 위 equality로 명시적으로 결박한다.

`CONTROLLED_BASELINE_RESET_EVIDENCE_SHA`는 final `SCOPE_WITHDRAWAL_EVIDENCE_SHA`, 새 `MANIFEST_SHA`, 새 `PROJECT_STAGING_BASELINE_SHA`를 입력으로 포함하지 않는다. 반대로 applicable `SCOPE_WITHDRAWAL_EVIDENCE_SHA`가 이 reset evidence SHA를 참조한다. 이 단방향 관계로 self/circular hash를 금지한다.

이를 canonicalize하여:

```text
CONTROLLED_BASELINE_RESET_EVIDENCE_SHA
```

를 transaction별 append-only evidence로 생성한다. 복수 reset transaction이 있었다면 과거 reset evidence를 덮어쓰지 않는다. project-level `CONTROLLED_BASELINE_RESET_EVIDENCE_SHA`는 **현재 active baseline generation을 만든 가장 최근 verified reset evidence**를 가리키며, 모든 과거 withdrawal/reset provenance는 각 `SCOPE_WITHDRAWAL_EVIDENCE_SHA`와 `SCOPE_WITHDRAWAL_EVIDENCE_BUNDLE_SHA`에 보존한다.

promotion transaction에서 latch된 withdrawal event가 이 reset의 trigger였다면 reset evidence 확정 후 다음 one-shot consumption evidence를 생성한다.

```text
WITHDRAWAL_LATCH_CONSUMPTION_EVIDENCE_SHA = SHA256(canonical {
  promotionTransactionId,
  terminalFinalizationStatus,
  withdrawalRequestEvidenceRef,
  controlledBaselineResetTransactionId,
  controlledBaselineResetEvidenceSha,
  disposition: CONSUMED
})
```

필수 parity:

```text
WITHDRAWAL_LATCH_CONSUMPTION_EVIDENCE.promotionTransactionId
== terminal transaction that owns withdrawalRequestEvidenceRef

WITHDRAWAL_LATCH_CONSUMPTION_EVIDENCE.controlledBaselineResetTransactionId
== CONTROLLED_BASELINE_RESET_EVIDENCE.controlledBaselineResetTransactionId

WITHDRAWAL_LATCH_CONSUMPTION_EVIDENCE.controlledBaselineResetEvidenceSha
== CONTROLLED_BASELINE_RESET_EVIDENCE_SHA
```

동일 `withdrawalRequestEvidenceRef`는 최대 한 번만 `CONSUMED` disposition을 가질 수 있다. terminal transaction의 latch 자체는 immutable하게 true로 남지만, valid consumption evidence가 존재하면 그 동일 event는 다시 `REQUIRED`를 발생시키지 않는다.

```text
UNCONSUMED_TERMINAL_WITHDRAWAL_LATCH_COUNT =
count(distinct terminal withdrawalRequestEvidenceRef where
      WITHDRAWAL_REQUEST_LATCHED == true
      AND no valid one-to-one consumption evidence exists)

DUPLICATE_WITHDRAWAL_LATCH_CONSUMPTION_COUNT =
count(withdrawalRequestEvidenceRef having more than one valid CONSUMED evidence)
```

모든 consumption evidence를 canonical bundle로 묶는다.

```text
WITHDRAWAL_LATCH_CONSUMPTION_EVIDENCE_BUNDLE_SHA
```

closure HARD invariant:

다음 식은 reset transaction의 transient 중간 상태 자체를 금지하는 식이 아니다. §5.1.2 step 14의 정상 pipeline 재진입, 새 PRESEAL, 새 promotion transaction 생성 또는 Final Seal eligibility 평가 직전에 반드시 만족해야 하는 closure 조건이다.

```text
POST_BASELINE_WITHDRAWAL_REQUEST_COUNT > 0
=> CONTROLLED_BASELINE_RESET_STATUS == REFROZEN_VERIFIED
AND CONTROLLED_BASELINE_RESET_EVIDENCE_SHA valid
AND CONTROLLED_BASELINE_RESET_EVIDENCE.controlledBaselineResetStatus == REFROZEN_VERIFIED
AND REFREEZE_VERIFICATION_SHA valid
AND UNVERIFIED_POST_BASELINE_WITHDRAWAL_COUNT == 0
AND PRODUCTION_BASELINE_DRIFT == 0   // 새 active baseline 기준
AND UNCONSUMED_TERMINAL_WITHDRAWAL_LATCH_COUNT == 0
AND DUPLICATE_WITHDRAWAL_LATCH_CONSUMPTION_COUNT == 0
AND WITHDRAWAL_EVENT_QUEUE_LEDGER_INTEGRITY IN {PASS, PASS_NOT_APPLICABLE}
AND PENDING_WITHDRAWAL_DURING_RESET_COUNT == 0
AND DUPLICATE_PENDING_WITHDRAWAL_EVENT_COUNT == 0
AND DUPLICATE_WITHDRAWAL_QUEUE_DRAIN_COUNT == 0
AND ORPHAN_WITHDRAWAL_QUEUE_DRAIN_COUNT == 0
AND UNVERIFIED_DRAINED_WITHDRAWAL_EVENT_COUNT == 0
AND FAILED_RESET_RETRY_TRIGGER_PARITY IN {PASS, PASS_NOT_APPLICABLE}
AND FAILED_RESET_RETRY_BEFORE_QUEUE_DRAIN_PARITY IN {PASS, PASS_NOT_APPLICABLE}
AND WITHDRAWAL_QUEUE_FIFO_PARITY IN {PASS, PASS_NOT_APPLICABLE}
AND WITHDRAWAL_QUEUE_PROVENANCE_PARITY IN {PASS, PASS_NOT_APPLICABLE}
AND WITHDRAWAL_QUEUE_DRAIN_TO_RESET_PARITY IN {PASS, PASS_NOT_APPLICABLE}
AND NESTED_CONTROLLED_BASELINE_RESET_COUNT == 0
```

추가 transaction-order invariant:

```text
PROMOTION_TRANSACTION_FINALIZATION_STATUS IN {PROMOTING, PROMOTED_PENDING_FINAL_SEAL, FINALIZATION_FAILED_ROLLBACK_REQUIRED}
AND POST_BASELINE_PRODUCTION_WITHDRAWAL_REQUEST == true
=> DIRECT_WITHDRAWAL_DURING_OPEN_PROMOTION = FORBIDDEN
AND CONTROLLED_BASELINE_RESET transaction starts only after
    FINALIZED_ABORTED_NO_MUTATION or FINALIZED_ROLLED_BACK
```

`PRODUCTION_BASELINE_DRIFT`는 항상 **현재 active baseline generation**을 기준으로 계산한다. superseded baseline과 비교하여 의도된 withdrawal을 drift로 오인하지도 않고, 새 baseline freeze 없이 drift를 0으로 재정의하지도 않는다.

---

# 6. Source 보호 · 수정 허용 · Repair 승인

## 6.1 기본 보호 필드

```text
id
content
choices
answer
problem image / 발문 image
displayNo
source identity
시험지 identity
```

기본 READ ONLY.

## 6.2 기본 수정 허용 후보

Overlay가 필요한 것만 개방한다.

```text
solution
solutionImage
solutionImageAlt
solutionImageCaption
solutionImageSize
solution visual asset
승인된 해설용 metadata
report / verifier / generator tooling
```

## 6.3 조건부 수정 필드

자동 허용 금지:

```text
tags
subUnit*
standardUnit*
questionType
layoutTag
wide
problem image
content
choices
answer
```

## 6.4 SOURCE 축 내부 직교화

### sourceReviewStatus

```text
NOT_REVIEWED
SOURCE_REVIEW_REQUIRED
SOURCE_CLEAR
SOURCE_BLOCKED
SOURCE_RESOLVED
```

### sourceDefectTypes[]

```text
NONE
CONTENT_DEFECT
CHOICE_DEFECT
ANSWER_DEFECT
PROBLEM_IMAGE_DEFECT
LATEX_SOURCE_DEFECT
METADATA_DEFECT
SOURCE_AMBIGUITY
SOURCE_DATA_EXCEPTION
OTHER_SOURCE_DEFECT
```

### sourceRepairStatus

```text
NOT_REQUIRED
REPAIR_PENDING_APPROVAL
REPAIR_APPROVED
REPAIR_APPLIED
REPAIR_VERIFIED
EXCEPTION_PENDING_APPROVAL
EXCEPTION_APPROVED
REPAIR_REJECTED
```

### sourceCorrectnessImpactStatus

```text
NOT_ADJUDICATED
NONE
NON_CORRECTNESS
CORRECTNESS_AFFECTING
MIXED
```

### sourceExceptionSealability

```text
NOT_APPLICABLE
SEALABLE_NON_CORRECTNESS_EXCEPTION
NON_SEALABLE_CORRECTNESS_EXCEPTION
```

상태·결함 유형·correctness 영향·승인 사건·sealability를 한 필드에 섞지 않는다.

다음 defect는 원칙적으로 correctness-affecting이다.

```text
CONTENT_DEFECT
CHOICE_DEFECT
ANSWER_DEFECT
```

다음은 실제 의미 영향 판정이 필요하다.

```text
PROBLEM_IMAGE_DEFECT
LATEX_SOURCE_DEFECT
OTHER_SOURCE_DEFECT
```

예를 들어 문제 그림의 좌표·라벨·조건·도형 의미가 달라지는 `PROBLEM_IMAGE_DEFECT`는 `CORRECTNESS_AFFECTING`이다. 반대로 학생이 보는 수학적 truth와 무관한 순수 metadata 표기 문제는 `NON_CORRECTNESS`일 수 있다.

## 6.5 SOURCE_READY

```text
SOURCE_READY =
    (
      sourceReviewStatus == SOURCE_CLEAR
      AND sourceDefectTypes[] == {NONE}
      AND sourceCorrectnessImpactStatus == NONE
      AND sourceRepairStatus == NOT_REQUIRED
    )
OR (
      sourceReviewStatus == SOURCE_RESOLVED
      AND sourceRepairStatus == REPAIR_VERIFIED
    )
OR (
      sourceReviewStatus == SOURCE_RESOLVED
      AND sourceRepairStatus == EXCEPTION_APPROVED
      AND sourceExceptionSealability == SEALABLE_NON_CORRECTNESS_EXCEPTION
      AND sourceCorrectnessImpactStatus == NON_CORRECTNESS
    )
```

HARD invariant:

```text
sourceCorrectnessImpactStatus IN {CORRECTNESS_AFFECTING, MIXED}
AND sourceRepairStatus == EXCEPTION_APPROVED
=> sourceExceptionSealability == NON_SEALABLE_CORRECTNESS_EXCEPTION
=> SOURCE_READY == false
```

따라서 correctness-affecting defect는 `EXCEPTION_APPROVED`만으로 봉인할 수 없다. 최종 included target으로 남기려면:

```text
REPAIR_VERIFIED
```

가 필요하다. 수리를 하지 않기로 결정하면 해당 문항은 원칙적으로 `SOURCE_BLOCKED`로 남겨 전체 seal을 막는다.

correctness-affecting defect를 final target에서 제외하는 것은 §4.2.1의 Scope Exclusion / Withdrawal Lock을 따라야 한다. 즉 단순 승인으로 denominator에서 제거할 수 없으며, 실제 `OUT_OF_SCOPE_CONFIRMED`이거나 student-facing production에서 정식 철회되어 `SCOPE_WITHDRAWN_VERIFIED + PRODUCTION_WITHDRAWAL_VERIFIED`가 된 경우에만 manifest 재구축을 허용한다.

다음은 seal 불가:

```text
NOT_REVIEWED
SOURCE_REVIEW_REQUIRED
SOURCE_BLOCKED
REPAIR_PENDING_APPROVAL
REPAIR_APPROVED
REPAIR_APPLIED
EXCEPTION_PENDING_APPROVAL
REPAIR_REJECTED
NON_SEALABLE_CORRECTNESS_EXCEPTION
sourceCorrectnessImpactStatus == NOT_ADJUDICATED
```

`ANSWER_DEFECT + INDEPENDENT_MATH_PASS`가 가능하더라도 학생에게 서비스되는 source correctness defect가 미수리 상태이면 seal 불가.

Source correctness의 문항 내부 readiness count는 included final target을 기준으로 계산하되, denominator 우회를 막기 위한 scope closure count는 §4.2.1의 `INITIAL_INCLUDED_SCOPE_UID_SET` 전체를 기준으로 별도 계산한다. 따라서 correctness defect가 final target 밖으로 이동했다고 해서 scope-level 위험이 사라진 것으로 간주하지 않는다.

```text
CORRECTNESS_AFFECTING_SOURCE_DEFECT_UNREPAIRED_COUNT =
count(target where sourceCorrectnessImpactStatus IN {CORRECTNESS_AFFECTING, MIXED}
             AND sourceRepairStatus != REPAIR_VERIFIED)

NON_SEALABLE_CORRECTNESS_EXCEPTION_COUNT =
count(target where sourceExceptionSealability == NON_SEALABLE_CORRECTNESS_EXCEPTION)

SOURCE_CORRECTNESS_IMPACT_NOT_ADJUDICATED_COUNT =
count(target where sourceCorrectnessImpactStatus == NOT_ADJUDICATED)
```

복수 defect가 있는 문항의 `sourceRepairStatus`는 summary status다. `REPAIR_VERIFIED`는 모든 correctness-affecting defect instance가 실제 repair verification을 끝낸 경우에만 부여한다. 비correctness defect에 exception이 병존하면 defect-instance resolution ledger에 각각의 종료 상태를 보존한다.

HARD invariant:

```text
sourceRepairStatus == REPAIR_VERIFIED
=> every correctness-affecting defect instance resolution == REPAIR_VERIFIED
AND no correctness-affecting defect instance resolution == EXCEPTION_APPROVED
```

## 6.6 Source Repair / Exception 승인 객체

최소:

```text
questionUid
field / defectTypes[]
sourceCorrectnessImpactStatus
sourceExceptionSealability
beforeHash
afterHash
approvalRef
reasonCode
sourceEvidenceRef
approvedBy
approvedAt
repairStatus / exceptionStatus
defectInstanceResolutionId
```

사용자의 명시 승인 없이 protected field를 수정하지 않는다.

승인 exception은 defect 사실을 숨기지 않고 최종 보고서에 별도 count로 노출한다.

모든 repair/exception resolution item은 append-only `SOURCE_RESOLUTION_LEDGER`에 기록한다.

```text
SOURCE_RESOLUTION_LEDGER_SHA
APPROVED_SOURCE_REPAIR_LEDGER_PARITY
APPROVED_SOURCE_EXCEPTION_LEDGER_PARITY
SCOPE_WITHDRAWAL_EVIDENCE_BUNDLE_SHA
SCOPE_WITHDRAWAL_EVIDENCE_PARITY
```

repair와 exception을 같은 parity flag로 뭉개지 않는다. production withdrawal evidence 역시 source repair/exception evidence와 별도 ledger/bundle로 관리한다.

## 6.7 ORIGINAL / EFFECTIVE protected hash

```text
ORIGINAL_PROTECTED_HASH
```

승인 repair가 없으면:

```text
EFFECTIVE_PROTECTED_HASH = ORIGINAL_PROTECTED_HASH
```

승인 repair가 있으면 repair ledger를 통해 새 유효 기준을 만든다.

최종:

```text
UNAPPROVED_PROTECTED_DIFF == 0
OUT_OF_SCOPE_DIFF == 0
```

필수.

---

# 7. 품질 상태 축 — 완전 직교화

문항 하나에 단일 종합 disposition을 강제하지 않는다.

## 7.1 Source

```text
sourceReviewStatus
sourceDefectTypes[]
sourceRepairStatus
```

## 7.2 Math

```text
mathReviewStatus = NOT_REVIEWED / PASS / FAIL / BLOCKED
mathConflictStatus = NONE / DETECTED / RESOLVED / UNRESOLVED
computedAnswer
sourceAnswer
answerComparison = MATCH / MISMATCH / NOT_COMPARABLE
solutionConclusionComparison = MATCH / MISMATCH / NOT_COMPARABLE
```

## 7.3 Pedagogy

### pedagogyDisposition

```text
KEEP
EXPAND
REWRITE
BLOCKED_BY_SOURCE
```

이는 작업 종류다.

### pedagogyReviewStatus

```text
NOT_REVIEWED
PASS
FAIL
BLOCKED
```

### studentReproducibleStatus

```text
NOT_REVIEWED
PASS
FAIL
BLOCKED
```

### curriculumStatus

```text
NOT_REVIEWED
PASS
FAIL
BLOCKED
```

## 7.4 Visual

### visualRequirement

```text
VISUAL_REQUIRED
VISUAL_OPTIONAL
VISUAL_EXEMPT
```

### visualAction

```text
NONE
USE_PROBLEM_IMAGE
KEEP_EXISTING_SOLUTION_VISUAL
ADD
REBUILD
REMOVE_INVALID_VISUAL
```

### visualMathReviewStatus

```text
NOT_REVIEWED
PASS
FAIL
BLOCKED
NOT_APPLICABLE
```

### visualStaticContractStatus

```text
NOT_TESTED
PASS
FAIL
BLOCKED
NOT_APPLICABLE
```

## 7.5 Runtime

단일 enum을 사용하지 않는다.

```text
runtimeLoadStatus
mathJaxStatus
fontReadyStatus
imageDecodeStatus
questionCountParityStatus
assetAssociationStatus
layoutStatus
renderedVisualPresentationStatus
```

각 필드:

```text
NOT_TESTED
PASS
FAIL
BLOCKED
NOT_APPLICABLE [해당 필드가 진짜 N/A인 경우만]
```

## 7.6 Release

```text
CANDIDATE
FROZEN
VERIFYING
REPAIR_REQUIRED
MOTHER_PRESEAL_PASS
PROMOTING
PRODUCTION_PARITY_PASS
PROMOTED_PENDING_FINAL_SEAL
FINAL_REVIEW
SEALED
```

---

# 8. Formal Readiness Predicate

## 8.1 Static

```text
STATIC_READY = staticContractStatus == PASS
```

## 8.2 Source

`SOURCE_READY`는 §6.5.

## 8.3 Math

```text
MATH_READY =
    mathReviewStatus == PASS
AND mathConflictStatus IN {NONE, RESOLVED}
```

## 8.4 Pedagogy

```text
PEDAGOGY_READY =
    pedagogyReviewStatus == PASS
AND studentReproducibleStatus == PASS
AND curriculumStatus == PASS
```

## 8.5 Visual

시각 dependency를 세 종류로 분리한다.

```text
ACTUAL_SOLUTION_VISUAL_ATTACHED = true / false
PROBLEM_VISUAL_MATH_DEPENDENCY = true / false
SHARED_VISUAL_MATH_DEPENDENCY = true / false
```

`ACTUAL_SOLUTION_VISUAL_ATTACHED`는 `solutionImage` 또는 해설에 실제 연결된 solution-side visual만 뜻한다. 단순히 시험지에 problem image가 존재한다는 이유로 true로 두지 않는다.

C closure:

```text
C_REVIEW_REQUIRED =
    visualRequirement == VISUAL_REQUIRED
 OR ACTUAL_SOLUTION_VISUAL_ATTACHED == true
 OR PROBLEM_VISUAL_MATH_DEPENDENCY == true
 OR SHARED_VISUAL_MATH_DEPENDENCY == true
```

필수 시각자료 satisfier:

```text
REQUIRED_VISUAL_SATISFIER_PRESENT =
    ACTUAL_SOLUTION_VISUAL_ATTACHED == true
 OR PROBLEM_VISUAL_MATH_DEPENDENCY == true
 OR SHARED_VISUAL_MATH_DEPENDENCY == true
```

```text
VISUAL_READY =
    (
      visualRequirement == VISUAL_EXEMPT
      AND C_REVIEW_REQUIRED == false
      AND visualMathReviewStatus == NOT_APPLICABLE
      AND visualStaticContractStatus IN {PASS, NOT_APPLICABLE}
    )
OR (
      visualRequirement == VISUAL_OPTIONAL
      AND C_REVIEW_REQUIRED == false
      AND visualMathReviewStatus == NOT_APPLICABLE
      AND visualStaticContractStatus == NOT_APPLICABLE
    )
OR (
      C_REVIEW_REQUIRED == true
      AND visualMathReviewStatus == PASS
      AND visualStaticContractStatus == PASS
      AND (
            visualRequirement != VISUAL_REQUIRED
         OR REQUIRED_VISUAL_SATISFIER_PRESENT == true
          )
    )
```

추가 불변식:

```text
visualRequirement == VISUAL_REQUIRED => REQUIRED_VISUAL_SATISFIER_PRESENT == true
ACTUAL_SOLUTION_VISUAL_ATTACHED == true => C_REVIEW_REQUIRED
PROBLEM_VISUAL_MATH_DEPENDENCY == true => C_REVIEW_REQUIRED
SHARED_VISUAL_MATH_DEPENDENCY == true => C_REVIEW_REQUIRED
visualRequirement == VISUAL_EXEMPT
  => ACTUAL_SOLUTION_VISUAL_ATTACHED == false
  AND PROBLEM_VISUAL_MATH_DEPENDENCY == false
  AND SHARED_VISUAL_MATH_DEPENDENCY == false
```

Optional solution asset도 실제로 붙였다면 C 검수 면제 금지. 반대로 단순 problem image 존재만으로 C를 강제하지 않으며, 그 그림이 실제 수학 해석/풀이에 의존될 때만 `PROBLEM_VISUAL_MATH_DEPENDENCY = true`다.

## 8.6 Question readiness

```text
QUESTION_READY =
    STATIC_READY
AND SOURCE_READY
AND MATH_READY
AND PEDAGOGY_READY
AND VISUAL_READY
```

Runtime은 render case 단위이므로 문항 readiness와 분리한다.

```text
RELEASE_CONTENT_READY = all target QUESTION_READY
RELEASE_RUNTIME_READY = all required render case D PASS
```

둘 다 필요.

---

# 9. 1차 전수 Quality Triage

바로 전수 재작성/전수 SVG 생성을 시작하지 않는다.

모든 target을 먼저 판정한다.

최소 triage:

```text
sourceReviewStatus
sourceDefectTypes[]
mathPrecheckSignal
pedagogyDisposition
visualRequirement
visualAction
sourceReviewRequired
```

보고용 예:

```text
PEDAGOGY_KEEP_COUNT
PEDAGOGY_EXPAND_COUNT
PEDAGOGY_REWRITE_COUNT
VISUAL_REQUIRED_COUNT
VISUAL_OPTIONAL_COUNT
VISUAL_EXEMPT_COUNT
SOURCE_REVIEW_REQUIRED_COUNT
```

중요:

```text
triage count != independent PASS count
```

---

# 10. Static Contract Gate — 권한 제한

Static verifier가 확인할 수 있는 예:

- 필수 필드 존재
- solution blank 여부
- placeholder
- 금지 token
- syntax/load 가능성
- asset path 존재
- SVG unsafe element
- hash/parity
- sample count
- schema

Static verifier가 단독 선언할 수 없는 것:

```text
actual mathematical answer is correct
logic jump fully resolved
student can reproduce
visual mathematical meaning is correct
layout is visually acceptable
```

static 결과 명칭 예:

```text
answerSolutionParity
solutionStructureGate
staticContractStatus
visualStaticContractStatus
```

`INDEPENDENT_*`라는 이름을 붙이지 않는다.

## 10.1 Static final closure / coverage

Static Contract는 초기 Build gate로만 소비하지 않고 최종 candidate까지 closure를 유지한다.

각 final target은 최소 다음을 기록한다.

```text
staticContractStatus = PASS / FAIL / NOT_TESTED
staticContractInputHash
staticContractReviewedArtifactSha
staticContractEvidenceRef
```

최종 candidate에서 다음 count를 계산한다.

```text
STATIC_CONTRACT_PASS_COUNT
STATIC_CONTRACT_FAIL_COUNT
STATIC_CONTRACT_NOT_TESTED_COUNT
```

membership 자체도 SHA로 봉인한다.

```text
STATIC_CONTRACT_COVERAGE_COUNT = count(static coverage map rows)

STATIC_CONTRACT_COVERAGE_MAP_SHA = SHA256(canonical map {
  questionUid -> {
    staticContractStatus,
    staticContractInputHash,
    staticContractReviewedArtifactSha,
    staticContractEvidenceRef,
    carryForwardSourceArtifactSha [if any]
  }
})
```

final map의 각 PASS row는 다음 둘 중 하나여야 한다.

```text
staticContractReviewedArtifactSha == FINAL_RELEASE_ARTIFACT_SHA
OR (
     carryForwardSourceArtifactSha valid
     AND OLD_STATIC_CONTRACT_INPUT_HASH == FINAL_STATIC_CONTRACT_INPUT_HASH
     AND carryForwardEvidenceValidity == PASS
   )
```

즉 pre-freeze static evidence를 final candidate에 승계할 수는 있지만, final input hash가 동일하다는 증거 없이 artifact SHA가 다른 PASS를 그대로 복사하지 않는다.

`STATIC_CONTRACT_COVERAGE_MAP_SHA valid`는 단순 hash parse 성공이 아니라 다음 membership parity까지 뜻한다.

```text
keys(STATIC_CONTRACT_COVERAGE_MAP) == FINAL_TARGET_UID_SET
STATIC_CONTRACT_COVERAGE_COUNT == FINAL_TARGET_COUNT
```

최종 closure:

```text
STATIC_CONTRACT_PASS_COUNT == FINAL_TARGET_COUNT
STATIC_CONTRACT_FAIL_COUNT == 0
STATIC_CONTRACT_NOT_TESTED_COUNT == 0
STATIC_CONTRACT_COVERAGE_COUNT == FINAL_TARGET_COUNT
STATIC_CONTRACT_COVERAGE_MAP_SHA valid
```

이 조건은 `STATIC_READY` 및 `RELEASE_CONTENT_READY`의 최종 HARD 근거다.

---

# 11. A Math Verifier — A1 Blind Solve + A2 Comparison

A는 Builder가 아니며 수정하지 않는다.

## 11.1 A1 BLIND SOLVE 입력

허용:

```text
question content
choices [객관식]
problem image/source [문제 해석에 필요]
curriculum boundary
shared material/dependency
math review rules
```

금지:

```text
source answer
existing solution
modified/final solution
Builder self-check
previous reviewer verdict
previous final report
```

## 11.2 A1 필수 evidence

```text
A_BLIND_INPUT_SHA
A_FIRST_PASS_EVIDENCE_SHA
computedAnswer
independentDerivation
choiceTruthVector [객관식]
uniqueAnswerStatus [객관식]
```

객관식은 모든 선지를 판정한다.

예:

```text
choiceTruthVector = [false, false, true, false, false]
uniqueAnswerStatus = UNIQUE
```

정답 없음/복수정답도 명시한다.

주관식은 실제 값을 독립 산출한다.

A1 evidence를 먼저 불변 동결한다.

## 11.3 A2 COMPARISON

A1 동결 후에만 공개:

```text
source answer
final solution
source repair / exception record
```

필수:

```text
A_COMPARISON_INPUT_SHA
A_COMPARISON_EVIDENCE_SHA
answerComparison
solutionConclusionComparison
sourceDefectSignal
```

## 11.4 Independence level

최소:

```text
A_INDEPENDENCE_LEVEL = I2_BLIND_SEPARATE_SESSION
```

권장 분류:

```text
I1 = same-session context contamination 가능 [Final A 불가]
I2 = separate session + answer/solution hidden
I3 = separate independent model/verifier + blind input
```

Overlay는 고위험 문항에 I3를 요구할 수 있다.

## 11.5 수학 검수 항목

- 문제 성립성
- 실제 정답
- 조건 충분성
- 객관식 전체 보기
- 정답 유일성
- 주관식 값
- 경우 나누기
- domain/boundary
- 그래프/도형 조건
- 교육과정 내 계산 가능성

source answer가 틀려도 독립 수학 자체는 PASS할 수 있다.

그러나 source 결함 미해결이면 SOURCE_READY가 false다.

---

# 12. Deterministic / Computational Companion Verifier

적용 가능한 문항은 A의 보조 검증기를 사용한다.

A를 대체하지 않는다.

## 12.1 method

```text
NOT_APPLICABLE
EXACT_SYMBOLIC
EXACT_RATIONAL
EXACT_ENUMERATION
NUMERICAL_EXHAUSTIVE
FINITE_SAMPLING
NUMERICAL_APPROXIMATION
```

## 12.2 coverage

```text
NOT_APPLICABLE
COMPLETE
PARTIAL
HEURISTIC
```

## 12.3 강한 기계 증거

```text
EXACT_SYMBOLIC + COMPLETE
EXACT_RATIONAL + COMPLETE
EXACT_ENUMERATION + COMPLETE
NUMERICAL_EXHAUSTIVE + COMPLETE
```

## 12.4 단독 Final Math PASS 금지

```text
FINITE_SAMPLING
NUMERICAL_APPROXIMATION
PARTIAL
HEURISTIC
```

## 12.5 충돌

A1과 complete computational result가 충돌하면:

```text
MATH_CONFLICT
ADJUDICATION_REQUIRED
FINAL_SEAL_BLOCK
```

자동 다수결/기계 우선 금지.

---

# 13. Review Independence Contract — A/B/C/D 공통

각 review run은 최소 기록한다.

```text
reviewAxis
reviewerId
reviewSessionId
reviewModelOrAgent
reviewInputBundleSha
reviewRuleSha
reviewStartReleaseSha
reviewEndReleaseSha
priorReviewVisibility
firstPassEvidenceSha
finalReviewReportSha
```

첫 판정 기본값:

```text
priorReviewVisibility = NONE
```

첫 판정 전에 다른 reviewer verdict를 공개하지 않는다.

같은 모델을 재사용할 경우 최소:

```text
SEPARATE_SESSION = YES
PRIOR_VERDICT_CONTEXT = NONE
REVIEW_INPUT_BUNDLE_SHA recorded
FIRST_PASS_EVIDENCE_FROZEN = YES
```

START release SHA와 END release SHA가 다르면 해당 review invalid.

---

# 14. Review Conflict / Adjudication

## 14.1 원칙

검수 충돌은 다수결로 해결하지 않는다.

첫 pass evidence를 수정해 합의한 것처럼 만들지 않는다.

## 14.2 adjudicationStatus

```text
NONE
REQUIRED
IN_PROGRESS
RESOLVED
UNRESOLVED
```

## 14.3 해결 순서

```text
충돌 evidence 동결
→ 입력/규칙/hash 차이 확인
→ 필요하면 fresh independent verifier
→ source defect면 SOURCE 축으로 이동
→ artifact defect면 repair
→ 영향 evidence invalidation
→ 새 final SHA에서 재검
```

## 14.4 unresolved conflict

```text
UNRESOLVED_REVIEW_CONFLICT_COUNT > 0
```

이면 Final Seal 불가.

---

# 15. B Pedagogy Verifier — 학생 재현 가능성

B는 최종 solution을 검수한다.

Builder self-check나 문자열 패턴을 독립 근거로 사용하지 않는다.

## 15.1 핵심 질문

학생이 다음을 설명할 수 있어야 한다.

```text
왜 이 식/정리/경우를 선택했는가?
어떤 조건을 사용했는가?
그 조건에서 다음 단계가 왜 나오는가?
경계/예외/경우가 왜 필요한가?
마지막 결론이 질문과 어떻게 연결되는가?
```

## 15.2 pedagogyDisposition

```text
KEEP
EXPAND
REWRITE
BLOCKED_BY_SOURCE
```

이는 수정 계획이고 PASS/FAIL이 아니다.

## 15.3 B의 독립 status

```text
pedagogyReviewStatus
studentReproducibleStatus
curriculumStatus
```

세 필드 모두 `PASS`여야 `PEDAGOGY_READY`.

## 15.4 대표 실패 코드

```text
WHY_MISSING
CONDITION_NOT_USED_EXPLICITLY
LOGIC_JUMP
CASE_SPLIT_MISSING
BOUNDARY_REASON_MISSING
DOMAIN_REASON_MISSING
TRANSFORMATION_REASON_MISSING
DEFINITION_NOT_EXPLICIT
NEW_SYMBOL_UNDEFINED
UNJUSTIFIED_THEOREM_USE
CONCLUSION_JUMP
CURRICULUM_OUT_OF_SCOPE
STUDENT_REPRODUCTION_FAIL
```

## 15.5 문장 길이가 품질이 아니다

금지:

```text
짧으므로 무조건 EXPAND
긴 해설이므로 PASS
"따라서"가 있으므로 PASS
```

좋은 짧은 해설은 KEEP 가능.

핵심 reasoning edge가 빠졌으면 길이와 무관하게 FAIL.

---

# 16. Curriculum Gate

교육과정은 Overlay가 정한다.

공통본에 특정 학년의 금지 개념을 하드코딩하지 않는다.

Overlay 최소:

```text
courseVersion
standardCourse
unitKey
subUnitKey
allowedConceptKeys[]
allowedOperations[]
allowedTheorems[]
forbiddenConceptKeys[]
forbiddenTerminology[]
curriculumMasterSha
```

예:

```text
고1 함수 Overlay: 미분 금지
고2/고3 미적분 Overlay: 해당 교육과정 범위에서 미분 허용
```

따라서 공통 프로토콜은 고1뿐 아니라 고2·고3에도 그대로 사용한다.

---

# 17. Visual Requirement / Action

모든 문항은:

```text
VISUAL_REQUIRED
VISUAL_OPTIONAL
VISUAL_EXEMPT
```

중 하나로 판정한다.

Visual과 Pedagogy를 섞지 않는다.

정상 예:

```text
pedagogyDisposition = KEEP
visualRequirement = VISUAL_REQUIRED
visualAction = ADD
```

또는:

```text
pedagogyDisposition = REWRITE
visualRequirement = VISUAL_EXEMPT
```

## 17.1 problem image 활용

```text
PROBLEM_IMAGE_SUFFICIENT
SOLUTION_ANNOTATION_REQUIRED
SOLUTION_RECONSTRUCTION_REQUIRED
```

원문 그림이 solution mode에서 충분하면 중복 asset을 억지로 만들지 않는다.

## 17.2 실제 visual / problem visual / shared visual의 C closure

다음 세 신호를 별도로 기록한다.

```text
ACTUAL_SOLUTION_VISUAL_ATTACHED
PROBLEM_VISUAL_MATH_DEPENDENCY
SHARED_VISUAL_MATH_DEPENDENCY
```

```text
C_REVIEW_REQUIRED =
    visualRequirement == VISUAL_REQUIRED
 OR ACTUAL_SOLUTION_VISUAL_ATTACHED
 OR PROBLEM_VISUAL_MATH_DEPENDENCY
 OR SHARED_VISUAL_MATH_DEPENDENCY
```

Optional solution asset도 예외 없음. 다만 원문 problem image가 단순 장식/비핵심 자료인 경우에는 `PROBLEM_VISUAL_MATH_DEPENDENCY = false`로 두어 불필요한 C 검수를 만들지 않는다.

## 17.3 scalePolicy

```text
EQUAL_SCALE_REQUIRED
PROPORTIONAL_REQUIRED
SCHEMATIC_ALLOWED
```

Overlay가 단원 특성에 따라 판정 규칙을 구체화한다.

---

# 18. Visual Fact Model · Deterministic Generator

시각자료는 machine-readable fact model에서 생성한다.

예시 필드:

```text
visualType
domain
range
curves[]
segments[]
keyPoints[]
openPoints[]
closedPoints[]
intersections[]
asymptotes[]
centers[]
radii[]
symmetryLines[]
labels[]
scalePolicy
viewportModel
```

시각자산은 fact model의 표현물이지 authoritative source가 아니다.

특수점은 일반 sampling에 묻지 않는다.

별도 검증:

- 교점
- 접점
- 끝점
- 꼭짓점
- 역함수 대응점
- 원 중심/반지름
- 최소거리점
- 면적 계산용 점
- 대칭점

---

# 19. 함수/곡선 Visual 안전 규격

이 절은 함수형 Overlay가 활성화할 수 있는 Core capability다.

## 19.1 sparse hand curve 금지

몇 개의 손입력 좌표를 이어 실제 함수 곡선처럼 표현하지 않는다.

```text
function expression + domain/interval
→ sampler
→ validated samples
→ SVG
```

## 19.2 최소 density 기본값

Overlay가 더 강한 값을 정의할 수 있다.

```text
general nonlinear continuous branch >= 200 points
rational/asymptote/high-curvature branch >= 300 points
```

단순 직선·보조선에 200점 규칙을 적용하지 않는다.

## 19.3 Adaptive sampling

고정 point count만으로 품질을 보장하지 않는다.

권장:

```text
minimum density
+
curvature / chord-error adaptive subdivision
```

점근선 부근, 급격한 곡률 변화, viewport 경계에서는 subdivision을 강화한다.

## 19.4 정의역 분기

연속 branch를 분리한다.

금지:

```text
undefined domain crossing
asymptote left/right branch polyline connection
NaN / Inf
```

## 19.5 sample equation validation

모든 sample이 해당 함수식과 domain을 만족하는지 tolerance 내 검증한다.

수치 tolerance는 `PROJECT_CONFIG`에 고정하고 작업 중 임의 완화하지 않는다.

---

# 20. 좌표/도형 Visual 안전 규격

좌표 기반 시각자료는 Python/정확 계산을 선행한다.

검증 대상 예:

- 좌표
- 교점
- 기울기
- 중심
- 반지름
- 접점
- 거리
- 대칭점
- 이동 후 좌표
- 좌표 → SVG transform

`EQUAL_SCALE_REQUIRED`이면 x/y 단위 스케일을 동일하게 생성한다.

공통 권장 설정 예:

```text
EQUAL_SCALE_MODEL_TOLERANCE = 1e-9
EQUAL_SCALE_RENDER_TOLERANCE = 0.005
```

실제 Overlay/Project config가 authoritative다.

render tolerance는 눈대중 제작을 허용하는 값이 아니라 raster/DPR 측정 오차용이다.

---

# 21. SVG Static Contract

SVG마다 최소 검사:

```text
XML parse
<svg viewBox>
width
height
forbidden <script>
forbidden <foreignObject>
forbidden external resource
SVG 내부 <br> 없음
SVG 내부 raw LaTeX/MathJax 없음
answer leak 없음
empty panel 없음
label bounds
clip/overflow
asset existence
asset path parity
data provenance
fact hash
case id uniqueness
asset ref uniqueness
sampling policy
undefined-domain crossing
scalePolicy compliance
```

권장 metadata:

```text
data-graph-case / data-visual-case
data-fact-hash
data-visual-provenance
```

Static contract PASS는 C Visual Math PASS를 대체하지 않는다.

---

# 22. C — Visual Math / Semantic Verifier

C는 asset의 **수학적 의미**를 검수한다.

대상 closure는 bool predicate로 계산한다.

```text
C_REVIEW_REQUIRED =
    visualRequirement == VISUAL_REQUIRED
 OR ACTUAL_SOLUTION_VISUAL_ATTACHED == true
 OR PROBLEM_VISUAL_MATH_DEPENDENCY == true
 OR SHARED_VISUAL_MATH_DEPENDENCY == true
```

Final C membership은 다음으로 확정한다.

```text
FINAL_C_REQUIRED_COUNT = count(target where C_REVIEW_REQUIRED == true)
```

즉 다음을 모두 포괄한다.

- `VISUAL_REQUIRED`
- 실제 solution visual 존재
- problem image가 실제 수학 해석/풀이의 핵심
- shared/dependency visual이 실제 수학 의미에 사용됨
- `VISUAL_OPTIONAL`이지만 실제 solution asset이 연결된 문항

검수:

- problem ↔ math facts
- solution ↔ math facts
- fact model ↔ asset
- 좌표
- 교점/접점
- branch/domain
- 점근선
- endpoint/open/closed
- 중심/반지름
- 대칭
- scale policy
- label의 수학적 의미
- 시각적 오해 가능성

C는 generator self-check를 독립 근거로 사용하지 않는다.

## 22.1 C N/A

```text
FINAL_C_REQUIRED_COUNT == 0
```

이면:

```text
C_FINAL_REPORT_STATUS = PASS_NOT_APPLICABLE
C_REQUIRED_COVERAGE_COUNT = 0
```

허용.

actual solution visual이 하나라도 연결되어 있거나 problem/shared visual이 실제 수학 dependency이면 C required closure에 포함해야 한다.

---

# 23. Pilot System Gate

대량 생산 전에 제작 시스템 자체를 검증한다.

Overlay가 pilot bucket을 정의한다.

기본 원칙:

- curriculum version/단원별 대표
- 단순형 + 복합형
- 시각 민감형
- source image 사용형
- 객관식 + 서답형
- 고위험 pedagogy 유형

Pilot 문항은 실제 target이다.

절차:

```text
A-style independent facts
→ pedagogy disposition
→ 필요 수정
→ visual requirement
→ fact model
→ numeric validation
→ visual generation
→ Builder self-check
→ static contract
→ pilot real render
→ independent pilot system verifier
```

필수:

```text
PILOT_BUILDER_PASS
PILOT_INDEPENDENT_SYSTEM_PASS
PILOT_SOLUTION_PASS
PILOT_VISUAL_PASS [applicable]
PILOT_PATH_PASS
PILOT_RENDER_PASS
PILOT_PROTECTION_PASS
```

Pilot이 실질적으로 N/A인 단원/프로젝트는 Overlay에서 근거를 제시하고:

```text
PILOT_NOT_APPLICABLE_APPROVED = true
```

여야 한다.

Pilot PASS는 최종 A/B/C/D를 대체하지 않는다.

---

# 24. 5문항 Batch Production Loop

기본 제작 단위:

```text
BUILD_BATCH_SIZE = 5
```

Overlay가 더 작은 단위를 요구할 수 있으나 임의 대량화는 금지한다.

각 batch:

## LOOP 1 Input

- source JS
- content
- choices
- answer [Builder 작업 참고 가능, A1에는 숨김]
- problem image
- 기존 solution
- 기존 solution visual
- curriculum/meta/dependency

## LOOP 2 Independent build-side math

Builder도 문제를 실제로 풀어 수정 근거를 확보한다.

그러나 Builder math는 A PASS가 아니다.

## LOOP 3 Pedagogy triage

```text
KEEP / EXPAND / REWRITE
```

## LOOP 4 필요한 solution만 수정

핵심 reasoning edge를 보강한다.

## LOOP 5 Visual requirement/action

필요한 경우에만 생성/수정한다.

## LOOP 6 Fact model / numeric validation

## LOOP 7 Visual generation

## LOOP 8 Builder self-check

- 수학 consistency
- solution 결론
- pedagogy self-check
- fact/asset
- protected diff

Builder self-check는 독립 PASS가 아니다.

## LOOP 9 Static tooling

syntax/schema/path/hash/static visual.

## LOOP 10 다음 batch

blocking self-check/static FAIL이면 다음 batch로 넘어가지 않는다.

---

# 25. Sentinel Audit

대량 반복 오류를 조기 탐지한다.

권장 주기:

```text
50문항 누적
OR source JS 10개 완료
```

검사 예:

- 동일 logic jump 반복
- 교육과정 밖 풀이 반복
- sparse curve 반복
- scale 오류 반복
- asset path 오류 반복
- protected mutation 반복
- 동일 template 오용

Sentinel은 최종 PASS 권한이 없다.

```text
NO_SYSTEMIC_DEFECT
SYSTEMIC_DEFECT_FOUND
```

---

# 26. 전체 BUILD 완료 Gate

A/B/C/D 공식 검수 전에 최소:

```text
FINAL_TARGET_COUNT 확정
전 문항 triage 완료
필요 solution 수정 완료
solution blank 0
VISUAL_REQUIRED missing 0
VISUAL_EXEMPT reason missing 0
builder self-check incomplete 0
static contract fail 0
missing asset 0
syntax error 0
UNAPPROVED_PROTECTED_DIFF 0
OUT_OF_SCOPE_DIFF 0
```

그 뒤 staging release payload를 동결한다.

```text
CANDIDATE_RELEASE_ARTIFACT_SHA = S0
```

review/evidence/report/screenshot은 release payload에 포함하지 않는다.

---

# 27. Coverage Gate

“전수 검수했다”는 문장만으로 인정하지 않는다.

## 27.1 A coverage

```text
A_BLIND_COVERAGE_COUNT == FINAL_TARGET_COUNT
A_COMPARISON_COVERAGE_COUNT == FINAL_TARGET_COUNT
```

## 27.2 B coverage

```text
B_COVERAGE_COUNT == FINAL_TARGET_COUNT
```

## 27.3 C coverage

```text
C_REQUIRED_COVERAGE_COUNT == FINAL_C_REQUIRED_COUNT
```

## 27.4 D coverage

```text
FINAL_RENDER_CASE_COUNT =
count(unique target-bearing exam × required render mode × required viewport/profile)

D_RENDER_CASE_COVERAGE_COUNT == FINAL_RENDER_CASE_COUNT
```

Coverage map 자체도 SHA로 봉인한다.

```text
A_BLIND_COVERAGE_MAP_SHA
A_COMPARISON_COVERAGE_MAP_SHA
B_COVERAGE_MAP_SHA
C_REQUIRED_COVERAGE_MAP_SHA
D_RENDER_CASE_COVERAGE_MAP_SHA
```

각 map은 count뿐 아니라 실제 member identity를 canonical order로 기록한다. 따라서 count가 같아도 구성원이 바뀌면 SHA가 달라져야 한다.

---

# 28. Review Input Hash Map

축별 input hash를 둔다.

## 28.1 A1 Blind

```text
A_BLIND_INPUT_SHA = SHA256(canonical {
  question/problem source visible to A1,
  choices,
  relevant problem image,
  shared/dependency material,
  curriculum boundary,
  math review rules
})
```

source answer/final solution을 포함하지 않는다.

## 28.2 A2 Comparison

```text
A_COMPARISON_INPUT_SHA = SHA256(canonical {
  A_FIRST_PASS_EVIDENCE_SHA,
  source answer,
  final solution,
  source repair/exception record,
  comparison rules
})
```

## 28.3 B

```text
B_REVIEW_INPUT_HASH = SHA256(canonical {
  problem,
  final solution,
  curriculum boundary,
  pedagogy profile,
  dependency facts
})
```

## 28.4 C

```text
C_REVIEW_INPUT_HASH = SHA256(canonical {
  problem,
  final solution,
  visual fact model,
  final visual asset,
  scale policy,
  dependency facts,
  visual rules
})
```

## 28.5 D

```text
D_RENDER_INPUT_HASH = SHA256(canonical {
  rendered payload files,
  engine,
  DB/index linkage,
  browser/runtime fingerprint,
  viewport/profile,
  font/math runtime,
  render mode
})
```

---

# 29. D — REAL RENDER / Runtime Verifier

D는 브라우저에서 **실제 표현된 결과**를 검수한다.

C의 수학 의미 PASS를 다시 선언하지 않는다.

## 29.1 render case manifest

각 case:

```text
renderCaseId
examId
mode
viewportProfile
D_RENDER_INPUT_HASH
expectedQuestionCount
expectedAssetAssociations
witnessRequirement
```

## 29.2 기본 required modes

기본:

```text
exam
solution
answer
```

Overlay가 추가 mode/profile을 요구할 수 있다.

## 29.3 Runtime 계층

각 case 최소:

```text
runtimeLoadStatus
mathJaxStatus
fontReadyStatus
imageDecodeStatus
questionCountParityStatus
assetAssociationStatus
layoutStatus
renderedVisualPresentationStatus
```

## 29.4 runtimeLoad PASS

- page 생성
- source data load 성공
- JS/engine fatal error 없음
- 빈 payload 없음

이것만으로 REAL_RENDER_PASS가 아니다.

## 29.5 MathJax/font/image

- MathJax 완료
- font readiness 확인
- image/SVG decode 완료
- broken asset 0

## 29.6 Question count parity

렌더된 문항 수가 manifest 예상과 일치해야 한다.

```text
RENDER_QUESTION_COUNT_PARITY == PASS
```

## 29.7 Asset association parity

solutionImage가 다른 문항에 붙거나 누락되지 않았는지 확인한다.

```text
RENDER_ASSET_ASSOCIATION_PARITY == PASS
```

## 29.8 layout PASS 최소 검수

- 텍스트 clipping 없음
- image/SVG clipping 없음
- 페이지 경계 침범 없음
- overlap 없음
- 빈 해설 없음
- solution visual이 해당 문항 바로 아래 정상 표시
- label 잘림 없음
- page overflow 정책 위반 없음

## 29.9 renderedVisualPresentationStatus

D는 실제 화면에서:

- 올바른 asset hash 로드
- label 가시성
- axis/line/dash 가시성
- open/closed point 구분
- CSS/viewport로 핵심 요소 소실 없음

을 본다.

수학 의미 자체는 C 권한이다.

## 29.10 REAL RENDER witness

DOM success만으로 layout PASS를 선언하지 않는다.

각 required case는 정책에 따라 실제 화면 증거를 남긴다.

예:

```text
screenshot / page capture refs
rendered bounding-box measurements
overflow/clipping measurements
question→asset association witness
console/error capture
```

필수:

```text
ALL_REQUIRED_RENDER_WITNESS_PRESENT == PASS
```

---

# 30. Review Evidence — Append-Only / Supersession

검수 evidence는 append-only로 관리한다.

이전 FAIL/PASS report를 덮어쓰지 않는다.

수정 후 새 evidence를 추가하고 관계를 기록한다.

최소:

```text
evidenceId
axis
questionUid / renderCaseId
artifactSha
inputHash
status
reasonCodes[]
evidenceRefs[]
createdAt [audit-only]
supersedesEvidenceId
supersededByEvidenceId
validityStatus
```

`firstPassEvidenceSha`는 충돌 조정 과정에서도 변경하지 않는다.

최종 `REVIEW_EVIDENCE_SHA`는 유효 최종 evidence와 lineage를 포함한다.

```text
EVIDENCE_LEDGER_INTEGRITY == PASS
```

필수.

---

# 31. Repair Loop · Invalidation Matrix

수정 시 이전 PASS를 기계적으로 유지하지 않는다.

기본 Matrix:

| 변경 | Static Contract | A1 Blind | A2 Compare | B Pedagogy | C Visual | D Runtime | Coverage |
|---|---:|---:|---:|---:|---:|---:|---:|
| `answer` 승인 수정 | **무효** | 유지 가능 | **무효** | 결론 관련 재검 | answer leak 관련 재검 | **무효** | 유지 |
| `solution` | **무효** | 원칙 유지 | **무효** | **무효** | solution-dependent면 **무효** | **무효** | 유지 |
| `content` | **무효** | **무효** | **무효** | **무효** | **무효** | **무효** | 재계산 |
| `choices` | **무효** | **무효** | **무효** | 관련 시 무효 | 관련 시 무효 | **무효** | 재계산 가능 |
| problem image | **무효** | **무효/재평가** | **무효** | 영향 시 무효 | **무효** | **무효** | dependency 재계산 |
| visual fact model | asset/metadata 영향 시 **무효** | 유지 | 유지 | 해설 의존 없으면 유지 | **무효** | **무효** | C 재계산 |
| SVG bytes only | **무효** | 유지 | 유지 | 유지 가능 | **무효** | **무효** | C/D 재계산 |
| visual generator | release asset 변경 시 **무효** | 유지 | 유지 | 유지 | 영향 asset **무효** | 해당 case **무효** | C/D 재계산 |
| pedagogy Overlay | static rule 영향 시 **무효** | 유지 | 유지 | 영향 target **무효** | visual 정책 영향 시 무효 | 직접 영향 시 무효 | B/C 재계산 |
| math rules/curriculum | static rule 영향 시 **무효** | **무효** | **무효** | 영향 target **무효** | fact 영향 시 무효 | 직접 영향 시 무효 | A/B/C 재계산 |
| engine/CSS/MathJax/font | release static input 불변이면 유지 | 유지 | 유지 | 유지 | 의미 표현 영향 시 재검 | **무효** | D 재계산 |
| render profile | 유지 | 유지 | 유지 | 유지 | asset math 유지 | **무효** | D 재계산 |
| manifest scope/dependency | **재계산** | coverage 재계산 | 재계산 | 재계산 | 재계산 | render closure 재계산 | 전체 재계산 |
| controlled production withdrawal / baseline reset | **재계산** | input-hash 기준 재평가 | 재계산 | 재계산 | dependency 기준 재계산 | render closure 재계산 | **전체 재계산** |
| hash canonicalization spec | **재평가** | carry-forward 재평가 | 재평가 | 재평가 | 재평가 | 재평가 | hash maps 재생성 |

artifact-changing repair가 발생하면 affected target의 `staticContractInputHash`를 반드시 다시 계산한다.

```text
artifact-changing repair
→ impacted staticContractStatus = NOT_TESTED
→ staticContractInputHash 재계산
→ hash-preserved carry-forward 가능 여부 판정
→ carry-forward 불가이면 static recheck
→ STATIC_CONTRACT_* counts 재계산
→ STATIC_CONTRACT_COVERAGE_MAP_SHA 재생성
→ QUESTION_READY / RELEASE_CONTENT_READY 재계산
→ new candidate freeze
```

unimpacted target의 static evidence를 승계하려면 다른 축과 동일하게 input-hash 보존을 증명해야 한다. 전체 artifact SHA가 달라졌다는 이유만으로 무조건 전수 재검하지 않지만, 최신 candidate에서 `NOT_TESTED`가 하나라도 남은 상태로 PRESEAL에 진입할 수 없다.

`유지 가능`은 자동 승계가 아니다.

반드시:

```text
OLD_INPUT_HASH == NEW_INPUT_HASH
```

가 증명되어야 한다.

불확실하면:

```text
CARRY_FORWARD_DENIED
```

controlled baseline reset이 발생하면 기존 `PRESEAL_BUNDLE_SHA`는 무조건 invalidated다. 새 baseline의 `BASELINE_TREE_SHA`, `MANIFEST_SHA`, `PROJECT_STAGING_BASELINE_SHA` 및 scope/coverage membership을 기준으로 다시 PRESEAL을 생성해야 한다. 개별 review evidence의 승계 가능 여부와 PRESEAL bundle 승계 금지를 혼동하지 않는다.

---

# 32. Canonical Hash 규격

## 32.1 실제 release file hash는 raw bytes

```text
fileSha256 = SHA256(actual raw bytes)
fileSize = raw byte length
```

hash를 맞추기 위해 파일 내용을 몰래 normalize하지 않는다.

## 32.2 Text conformance는 별도 gate

프로젝트가 UTF-8/LF를 요구한다면:

```text
TEXT_ENCODING_CONFORMANCE
LINE_ENDING_CONFORMANCE
BOM_CONFORMANCE
```

를 별도 검사한다.

Conformance PASS 후 실제 raw bytes를 hash한다.

## 32.3 path canonicalization

release manifest path:

```text
repository-relative
POSIX separator '/'
no './'
no '..'
no absolute path
no drive letter
```

경로 정렬:

```text
normalizedPath lexicographic ascending
```

case-sensitive repository에서 실제 path case를 보존한다.

Windows/macOS 환경에서 case-collision 가능성이 있으면:

```text
CANONICAL_PATH_COLLISION = HARD_FAIL
```

## 32.4 self-hash 금지

bundle이 자기 자신의 hash 값을 payload에 넣어 순환하지 않게 한다.

Hash manifest 자체를 release bundle에 포함할 경우 해당 hash 산출 순서를 명확히 하고 self-reference를 배제한다.

## 32.5 canonical JSON

```text
UTF-8
LF
stable key order
stable array order when semantics unordered
no machine-specific absolute path
no volatile timestamp in semantic hash payload
explicit schemaVersion
```

## 32.6 주요 SHA 구분

```text
GIT_COMMIT_SHA
RELEASE_FILE_MANIFEST_SHA
FINAL_RELEASE_ARTIFACT_SHA
REVIEW_EVIDENCE_SHA
PRESEAL_BUNDLE_SHA
PROMOTION_EVIDENCE_SHA
SEAL_BUNDLE_SHA
```

서로 대체하지 않는다.

---

# 33. Release Artifact 범위

`FINAL_RELEASE_ARTIFACT_SHA`에는 학생에게 실제 제공되는 release payload를 포함한다.

최소:

- target-bearing 최종 JS
- 필요한 problem visual assets
- 신규/수정 solution visual assets
- 학생 화면 내용에 직접 영향을 주는 release payload
- 필요한 index/linkage 파일 중 Overlay가 release scope로 선언한 것

제외:

- A/B/C/D report
- screenshot/witness
- repair ledger
- review evidence 문서
- promotion report

release scope는 manifest로 고정한다.

A/B/C/D 검수 및 production 승격 후 동일 digest가 재현되어야 한다.

---

# 34. Final Release SHA Lock

후보 수정에 따라:

```text
S0 → S1 → S2 ...
```

최종 repair가 끝난 뒤:

```text
FINAL_RELEASE_ARTIFACT_SHA = Sf
```

모든 final A/B/C/D report는 `Sf`를 가리킨다.

각 reviewer:

```text
START_RELEASE_SHA == END_RELEASE_SHA == FINAL_RELEASE_ARTIFACT_SHA
```

이어야 한다.

---

# 35. PRESEAL Bundle

production 승격 전 Mother Preseal이 검수본·규칙·환경·evidence를 묶는다.

최소 포함:

```text
FINAL_RELEASE_ARTIFACT_SHA
REVIEW_EVIDENCE_SHA
MANIFEST_SHA
BASELINE_TREE_SHA
ACTIVE_PRODUCTION_BASELINE_GENERATION
PROJECT_STAGING_BASELINE_SHA
CONTROLLED_BASELINE_RESET_STATUS
CONTROLLED_BASELINE_RESET_EVIDENCE_SHA [if post-baseline withdrawal occurred]
PROJECT_CONFIG_SHA
COMMON_PROTOCOL_SHA
UNIT_OVERLAY_SHA
EFFECTIVE_RULESET_SHA
HASH_CANONICALIZATION_SPEC_SHA
PROTOCOL_CONTRACT_REGISTRY_SHA
PROTOCOL_REGRESSION_BASELINE_STATUS
PROTOCOL_REGRESSION_BASELINE_SHA
PROTOCOL_REGRESSION_BASELINE_CONTRACT_REGISTRY_SHA
CANDIDATE_PROTOCOL_CONTRACT_REGISTRY_SHA
PROTOCOL_REGRESSION_EVIDENCE_SHA
BOOTSTRAP_ADOPTION_APPROVAL_EVIDENCE_SHA [if bootstrap]
CURRICULUM_MASTER_BUNDLE_SHA
QUESTION_INDEX_SHA
ENGINE_SHA
DB_SHA
RENDER_RUNTIME_FINGERPRINT_SHA
STAGING_RENDER_REPORT_SHA
INITIAL_INCLUDED_SCOPE_UID_SET_SHA
FINAL_TARGET_UID_SET_SHA
FINAL_SCOPE_DISPOSITION_MAP_SHA
SCOPE_WITHDRAWAL_EVIDENCE_BUNDLE_SHA
WITHDRAWAL_LATCH_CONSUMPTION_EVIDENCE_BUNDLE_SHA [if promotion-latched withdrawal occurred]
UNCONSUMED_TERMINAL_WITHDRAWAL_LATCH_COUNT
DUPLICATE_WITHDRAWAL_LATCH_CONSUMPTION_COUNT
WITHDRAWAL_EVENT_QUEUE_LEDGER_SHA [if any withdrawal was queued during reset]
WITHDRAWAL_EVENT_QUEUE_LEDGER_INTEGRITY
PENDING_WITHDRAWAL_DURING_RESET_COUNT
DUPLICATE_PENDING_WITHDRAWAL_EVENT_COUNT
DUPLICATE_WITHDRAWAL_QUEUE_DRAIN_COUNT
ORPHAN_WITHDRAWAL_QUEUE_DRAIN_COUNT
UNVERIFIED_DRAINED_WITHDRAWAL_EVENT_COUNT
FAILED_RESET_RETRY_TRIGGER_PARITY
FAILED_RESET_RETRY_BEFORE_QUEUE_DRAIN_PARITY
WITHDRAWAL_QUEUE_FIFO_PARITY
WITHDRAWAL_QUEUE_PROVENANCE_PARITY
WITHDRAWAL_QUEUE_DRAIN_TO_RESET_PARITY
NESTED_CONTROLLED_BASELINE_RESET_COUNT
PROJECT_ATTEMPT_ID
PREVIOUS_PROJECT_ATTEMPT_ID
REOPEN_POLICY_GATE
REOPEN_TRIGGER_PARITY
REOPEN_HISTORICAL_ARTIFACT_PARITY
REOPEN_ATTEMPT_EVIDENCE_SHA [if reopened attempt]
REOPEN_LINEAGE_PARITY
PROJECT_ATTEMPT_LINEAGE_PARITY
STATIC_CONTRACT_COVERAGE_MAP_SHA
A_BLIND_COVERAGE_MAP_SHA
A_COMPARISON_COVERAGE_MAP_SHA
B_COVERAGE_MAP_SHA
C_REQUIRED_COVERAGE_MAP_SHA
D_RENDER_CASE_COVERAGE_MAP_SHA
B_REVIEW_INPUT_HASH_MAP_SHA
C_REVIEW_INPUT_HASH_MAP_SHA
D_RENDER_INPUT_HASH_MAP_SHA
SOURCE_RESOLUTION_LEDGER_SHA
EVIDENCE_LEDGER_SHA
RENDER_WITNESS_MANIFEST_SHA
```

Mother Preseal을 PASS로 선언하기 직전 다음 closure는 HARD다.

```text
WITHDRAWAL_EVENT_QUEUE_LEDGER_INTEGRITY IN {PASS, PASS_NOT_APPLICABLE}
PENDING_WITHDRAWAL_DURING_RESET_COUNT == 0
DUPLICATE_PENDING_WITHDRAWAL_EVENT_COUNT == 0
DUPLICATE_WITHDRAWAL_QUEUE_DRAIN_COUNT == 0
ORPHAN_WITHDRAWAL_QUEUE_DRAIN_COUNT == 0
UNVERIFIED_DRAINED_WITHDRAWAL_EVENT_COUNT == 0
FAILED_RESET_RETRY_TRIGGER_PARITY IN {PASS, PASS_NOT_APPLICABLE}
FAILED_RESET_RETRY_BEFORE_QUEUE_DRAIN_PARITY IN {PASS, PASS_NOT_APPLICABLE}
WITHDRAWAL_QUEUE_FIFO_PARITY IN {PASS, PASS_NOT_APPLICABLE}
WITHDRAWAL_QUEUE_PROVENANCE_PARITY IN {PASS, PASS_NOT_APPLICABLE}
WITHDRAWAL_QUEUE_DRAIN_TO_RESET_PARITY IN {PASS, PASS_NOT_APPLICABLE}
NESTED_CONTROLLED_BASELINE_RESET_COUNT == 0
PROJECT_ATTEMPT_LINEAGE_PARITY == PASS
REOPEN_POLICY_GATE IN {PASS, PASS_NOT_APPLICABLE}
REOPEN_TRIGGER_PARITY IN {PASS, PASS_NOT_APPLICABLE}
REOPEN_HISTORICAL_ARTIFACT_PARITY IN {PASS, PASS_NOT_APPLICABLE}
REOPEN_LINEAGE_PARITY IN {PASS, PASS_NOT_APPLICABLE}
```

```text
PRESEAL_BUNDLE_SHA
MOTHER_PRESEAL_PASS
```

를 생성한다.

PRESEAL은 반드시 현재 active baseline generation에서 다시 생성된 것이어야 한다. parity verifier가 참조하는 canonical PRESEAL object field mapping은 다음 네 이름으로 고정한다. alias field를 사용하지 않는다.

```text
PRESEAL_BUNDLE.activeProductionBaselineGeneration := ACTIVE_PRODUCTION_BASELINE_GENERATION
PRESEAL_BUNDLE.baselineTreeSha := BASELINE_TREE_SHA
PRESEAL_BUNDLE.manifestSha := MANIFEST_SHA
PRESEAL_BUNDLE.projectStagingBaselineSha := PROJECT_STAGING_BASELINE_SHA
```

```text
PRESEAL_ACTIVE_BASELINE_PARITY = PASS iff
PRESEAL_BUNDLE.activeProductionBaselineGeneration == ACTIVE_PRODUCTION_BASELINE_GENERATION
AND PRESEAL_BUNDLE.baselineTreeSha == BASELINE_TREE_SHA
AND PRESEAL_BUNDLE.manifestSha == MANIFEST_SHA
AND PRESEAL_BUNDLE.projectStagingBaselineSha == PROJECT_STAGING_BASELINE_SHA
```

post-baseline withdrawal/reset 이전의 PRESEAL bundle은 위 parity를 통과할 수 없으며 재사용할 수 없다.

Mother는 수정하지 않는다.

---

# 36. Production Promotion — Atomic + Rollback Transaction

## 36.1 promotion 전

필수:

```text
MOTHER_PRESEAL_PASS
PRODUCTION_BASELINE_DRIFT == 0  // current active baseline generation 기준
UNVERIFIED_POST_BASELINE_WITHDRAWAL_COUNT == 0
CONTROLLED_BASELINE_RESET_STATUS IN {NOT_APPLICABLE, REFROZEN_VERIFIED}
PRESEAL_ACTIVE_BASELINE_PARITY == PASS
rollbackPlanSha valid
promotion manifest valid
NEW_PROMOTION_TRANSACTION_INITIALIZED == PASS
PROMOTION_TRANSACTION_CONTEXT == OPEN_TRANSACTION
ACTIVE_PROMOTION_TRANSACTION_ID != null
PROMOTION_TRANSACTION_INIT_EVIDENCE_SHA valid
PREVIOUS_PROMOTION_TERMINAL_EVIDENCE_PARITY IN {PASS, PASS_NOT_APPLICABLE}
PROJECT_ATTEMPT_LINEAGE_PARITY == PASS
REOPEN_POLICY_GATE IN {PASS, PASS_NOT_APPLICABLE}
REOPEN_TRIGGER_PARITY IN {PASS, PASS_NOT_APPLICABLE}
REOPEN_HISTORICAL_ARTIFACT_PARITY IN {PASS, PASS_NOT_APPLICABLE}
REOPEN_LINEAGE_PARITY IN {PASS, PASS_NOT_APPLICABLE}
UNCONSUMED_TERMINAL_WITHDRAWAL_LATCH_COUNT == 0
DUPLICATE_WITHDRAWAL_LATCH_CONSUMPTION_COUNT == 0
WITHDRAWAL_EVENT_QUEUE_LEDGER_INTEGRITY IN {PASS, PASS_NOT_APPLICABLE}
PENDING_WITHDRAWAL_DURING_RESET_COUNT == 0
DUPLICATE_PENDING_WITHDRAWAL_EVENT_COUNT == 0
DUPLICATE_WITHDRAWAL_QUEUE_DRAIN_COUNT == 0
ORPHAN_WITHDRAWAL_QUEUE_DRAIN_COUNT == 0
UNVERIFIED_DRAINED_WITHDRAWAL_EVENT_COUNT == 0
FAILED_RESET_RETRY_TRIGGER_PARITY IN {PASS, PASS_NOT_APPLICABLE}
FAILED_RESET_RETRY_BEFORE_QUEUE_DRAIN_PARITY IN {PASS, PASS_NOT_APPLICABLE}
WITHDRAWAL_QUEUE_FIFO_PARITY IN {PASS, PASS_NOT_APPLICABLE}
WITHDRAWAL_QUEUE_PROVENANCE_PARITY IN {PASS, PASS_NOT_APPLICABLE}
WITHDRAWAL_QUEUE_DRAIN_TO_RESET_PARITY IN {PASS, PASS_NOT_APPLICABLE}
NESTED_CONTROLLED_BASELINE_RESET_COUNT == 0
PROMOTION_TRANSACTION_FINALIZATION_STATUS == NOT_STARTED
WITHDRAWAL_REQUEST_LATCHED == false
PRODUCTION_MUTATED == false
FURTHER_PRODUCTION_MUTATION == ALLOWED
```

`NEW_PROMOTION_TRANSACTION_INITIALIZED == PASS`는 §36.7.1의 새 transaction 생성 계약이 완료되어 현재 attempt에 고유한 `promotionTransactionId`가 발급되고 transaction-local state가 초기값으로 동결된 경우에만 참이다. 이전 terminal transaction의 id/state를 재사용하거나 덮어쓴 상태에서는 promotion을 시작할 수 없다.

init evidence의 project-attempt binding도 promotion 시작 전 직접 확인한다.

```text
PROMOTION_TRANSACTION_INIT_EVIDENCE.projectAttemptId == PROJECT_ATTEMPT_ID
PROMOTION_TRANSACTION_INIT_EVIDENCE.previousProjectAttemptId == PREVIOUS_PROJECT_ATTEMPT_ID

REOPEN_POLICY_GATE == PASS
=> PROMOTION_TRANSACTION_INIT_EVIDENCE.reopenAttemptEvidenceSha == REOPEN_ATTEMPT_EVIDENCE_SHA
AND PROMOTION_TRANSACTION_INIT_EVIDENCE.reopenLineageParity == PASS

REOPEN_POLICY_GATE == PASS_NOT_APPLICABLE
=> PROMOTION_TRANSACTION_INIT_EVIDENCE.reopenAttemptEvidenceSha == null
AND PROMOTION_TRANSACTION_INIT_EVIDENCE.reopenLineageParity == PASS_NOT_APPLICABLE
```

production baseline을 백업 가능한 방식으로 transaction에 결박한다.

## 36.2 transient 상태

허용되는 promotion start transition은 하나뿐이다.

```text
PROMOTION_TRANSACTION_FINALIZATION_STATUS == NOT_STARTED
AND NEW_PROMOTION_TRANSACTION_INITIALIZED == PASS
→ PROMOTION_TRANSACTION_FINALIZATION_STATUS = PROMOTING
```

`PROMOTING` 중 부분 성공 상태를 `SEALED` 또는 `PASS`로 노출하지 않는다. terminal state에서 직접 `PROMOTING`으로 이동하거나 transaction 초기화 없이 `PROMOTING`을 선언하면 HARD FAIL이다.

## 36.3 승격

staging 검수본을 production으로 원자적 승격한다.

## 36.4 post-promotion 필수 gate

- production release artifact SHA 재계산
- protected parity
- out-of-scope parity
- index/linkage parity
- required exam/solution/answer REAL RENDER
- render witness

필수:

```text
PRODUCTION_RELEASE_ARTIFACT_SHA == FINAL_RELEASE_ARTIFACT_SHA
PRODUCTION_PARITY_GATE == PASS
POST_PROMOTION_ALL_REQUIRED_RENDER == PASS
POST_PROMOTION_ALL_REQUIRED_RENDER_WITNESS_PRESENT == PASS
POST_PROMOTION_RENDER_WITNESS_MANIFEST_SHA_VALID
POST_PROMOTION_RENDER_RUNTIME_FINGERPRINT_SHA_VALID
```

post-promotion witness도 staging D와 동일하게 최소 다음을 증명한다.

- required render case membership
- screenshot/page capture 또는 동등한 시각 witness
- clipping/overflow/bounding-box 근거
- question → asset association
- console/runtime error evidence
- production runtime fingerprint

DOM load 성공만으로 post-promotion REAL RENDER PASS를 선언하지 않는다.

## 36.5 post-promotion FAIL

실패본을 production에 남겨두지 않는다.

```text
PROMOTION_FAILED
→ PROMOTION_TRANSACTION_FINALIZATION_STATUS = FINALIZATION_FAILED_ROLLBACK_REQUIRED
→ rollback baseline
→ rollback verification
→ production baseline parity 재확인

rollback verification PASS
→ FINALIZATION_ROLLBACK_EVIDENCE_SHA 생성
→ PROMOTION_TRANSACTION_FINALIZATION_STATUS = FINALIZED_ROLLED_BACK
→ REPAIR_REQUIRED

rollback verification FAIL
→ PROMOTION_TRANSACTION_FINALIZATION_STATUS = FINALIZATION_FAILED_ROLLBACK_REQUIRED 유지
→ ROLLBACK_REQUIRED = true 유지
→ Final Seal / 새 promotion / controlled reset 금지
→ manual recovery + rollback verification 재시도
```

필수:

```text
PROMOTION_ROLLBACK_PATH_VALID == PASS
POST_PROMOTION_FAILURE_LEFT_IN_PRODUCTION == 0
```

## 36.6 Promotion Evidence

최소:

```text
promotionTransactionId
activePromotionTransactionId
promotionTransactionInitEvidenceSha
promotionBaselineTreeSha
promotionBaselineReleaseArtifactSha
productionReleaseArtifactSha
productionParityReportSha
postPromotionRenderMatrixSha
postPromotionRenderWitnessManifestSha
postPromotionRenderRuntimeFingerprintSha
postPromotionRequiredRenderWitnessCoverageStatus
rollbackStatus
rollbackPlanSha
rollbackVerificationSha
postPromotionProtectedParitySha
postPromotionOutOfScopeParitySha
```

이를 묶어:

```text
PROMOTION_EVIDENCE_SHA
```
생성.

필수 transaction identity parity:

```text
PROMOTION_EVIDENCE.promotionTransactionId
== ACTIVE_PROMOTION_TRANSACTION_ID
AND PROMOTION_EVIDENCE.activePromotionTransactionId
== ACTIVE_PROMOTION_TRANSACTION_ID
AND PROMOTION_TRANSACTION_INIT_EVIDENCE.promotionTransactionId
== ACTIVE_PROMOTION_TRANSACTION_ID
```

## 36.7 Promotion transaction의 종료점 — Final Seal까지 OPEN

post-promotion parity/render PASS는 transaction 완료가 아니다. transaction 종료 상태는 다음 enum으로 관리한다.

```text
PROMOTION_TRANSACTION_FINALIZATION_STATUS =
    NOT_STARTED
    PROMOTING
    PROMOTED_PENDING_FINAL_SEAL
    FINALIZATION_FAILED_ROLLBACK_REQUIRED
    FINALIZED_ABORTED_NO_MUTATION
    FINALIZED_ROLLED_BACK
    FINALIZED_SEALED
```

### 36.7.1 Promotion Transaction Lifecycle / 재진입 초기화

모든 promotion attempt는 **고유한 `promotionTransactionId`**를 가져야 한다. 하나의 transaction이 terminal state에 도달하면 그 transaction record와 terminal evidence는 append-only immutable이다. terminal record를 `NOT_STARTED` 또는 `PROMOTING`으로 되돌려 다음 attempt처럼 재사용하는 것을 금지한다.

terminal state:

```text
FINALIZED_ABORTED_NO_MUTATION
FINALIZED_ROLLED_BACK
FINALIZED_SEALED
```

project-level current pointer는 다음 하나를 사용한다.

```text
ACTIVE_PROMOTION_TRANSACTION_ID
PROMOTION_TRANSACTION_CONTEXT
```

`PROMOTION_TRANSACTION_CONTEXT`의 canonical 의미는 §5.1에 정의된 `NO_TRANSACTION / OPEN_TRANSACTION / TERMINAL_TRANSACTION`을 사용한다. `PROMOTION_TRANSACTION_FINALIZATION_STATUS`, `WITHDRAWAL_REQUEST_LATCHED`, `PRODUCTION_MUTATED`, `FURTHER_PRODUCTION_MUTATION`은 **`ACTIVE_PROMOTION_TRANSACTION_ID`가 가리키는 현재 transaction의 transaction-local state**다. 과거 terminal transaction의 동일 필드 최종값은 historical transaction record/evidence에 그대로 보존하며 current pointer가 이동했다고 덮어쓰지 않는다.

`PROMOTION_TRANSACTION_CONTEXT == NO_TRANSACTION`일 때 transaction-local 상태 필드를 `NOT_STARTED/false/ALLOWED` 같은 암묵적 기본값으로 합성하지 않는다. `NOT_STARTED`는 새 transaction 객체가 실제 생성된 뒤에만 존재한다.

새 promotion attempt는 반드시 `PROMOTING` 전에 새 transaction을 생성한다.

```text
NEW_PROMOTION_TRANSACTION
→ new unique promotionTransactionId
→ ACTIVE_PROMOTION_TRANSACTION_ID = promotionTransactionId
→ PROMOTION_TRANSACTION_CONTEXT = OPEN_TRANSACTION
→ PROMOTION_TRANSACTION_FINALIZATION_STATUS = NOT_STARTED
→ WITHDRAWAL_REQUEST_LATCHED = false
→ PRODUCTION_MUTATED = false
→ FURTHER_PRODUCTION_MUTATION = ALLOWED
→ PROMOTION_TRANSACTION_INIT_EVIDENCE_SHA 생성
→ NOT_STARTED -> PROMOTING
```

초기화는 이전 transaction state를 변경하는 것이 아니라 **새 transaction-local state 객체를 생성하는 것**이다. 다음과 같은 값 상속은 HARD FAIL이다.

```text
new transaction inherits WITHDRAWAL_REQUEST_LATCHED == true
new transaction inherits PRODUCTION_MUTATED == true
new transaction inherits FURTHER_PRODUCTION_MUTATION == FORBIDDEN
old terminal transaction status overwritten to NOT_STARTED/PROMOTING
ACTIVE_PROMOTION_TRANSACTION_ID reused for a different attempt
```

`PROMOTION_TRANSACTION_INIT_EVIDENCE_SHA` 최소 객체:

```text
PROMOTION_TRANSACTION_INIT_EVIDENCE_SHA = SHA256(canonical {
  promotionTransactionId,
  projectAttemptId,
  previousProjectAttemptId,                 // root attempt이면 null
  promotionLineageEdgeType,                 // ROOT | SAME_ATTEMPT_PREDECESSOR | REOPEN_BRIDGE
  previousPromotionTransactionId,           // root first transaction이면 null
  previousPromotionTerminalStatus,          // root first transaction이면 null
  previousTerminalEvidenceType,             // root first transaction이면 null
  previousTerminalEvidenceSha,              // root first transaction이면 null
  previousPromotionTerminalEvidenceParity,
  reopenAttemptEvidenceSha,                 // reopened project attempt의 모든 transaction에서 동일 evidence SHA, root attempt이면 null
  reopenLineageParity,                       // reopened attempt이면 PASS, root attempt이면 PASS_NOT_APPLICABLE
  activeProductionBaselineGeneration,
  presealBundleSha,
  controlledBaselineResetStatus,
  withdrawalRequestLatched: false,
  productionMutated: false,
  furtherProductionMutation: ALLOWED,
  finalizationStatus: NOT_STARTED
})
```

새 transaction을 만들기 전에 predecessor terminal evidence를 type/id/SHA까지 검증한다.

```text
PREVIOUS_PROMOTION_TERMINAL_EVIDENCE_PARITY = PASS_NOT_APPLICABLE iff
    previousPromotionTransactionId == null
    AND previousPromotionTerminalStatus == null
    AND previousTerminalEvidenceType == null
    AND previousTerminalEvidenceSha == null
```

previous transaction이 존재하면 정확히 다음 mapping만 허용한다.

```text
previousPromotionTerminalStatus == FINALIZED_ABORTED_NO_MUTATION
=> previousTerminalEvidenceType == PROMOTION_ABORT_EVIDENCE
AND previousTerminalEvidenceSha == that T1 PROMOTION_ABORT_EVIDENCE_SHA
AND evidence.promotionTransactionId == previousPromotionTransactionId
AND evidence.finalizationStatus == FINALIZED_ABORTED_NO_MUTATION

previousPromotionTerminalStatus == FINALIZED_ROLLED_BACK
=> previousTerminalEvidenceType == FINALIZATION_ROLLBACK_EVIDENCE
AND previousTerminalEvidenceSha == that T1 FINALIZATION_ROLLBACK_EVIDENCE_SHA
AND evidence.promotionTransactionId == previousPromotionTransactionId
AND evidence.finalizationStatus == FINALIZED_ROLLED_BACK

previousPromotionTerminalStatus == FINALIZED_SEALED
=> previousTerminalEvidenceType == PROMOTION_FINALIZATION_EVIDENCE
AND previousTerminalEvidenceSha == that T1 PROMOTION_FINALIZATION_EVIDENCE_SHA
AND evidence.promotionTransactionId == previousPromotionTransactionId
AND evidence.finalizationStatus == FINALIZED_SEALED
```

위 mapping 전체가 참일 때만 `PREVIOUS_PROMOTION_TERMINAL_EVIDENCE_PARITY == PASS`다. 단순히 SHA 파일이 존재한다는 이유로 PASS시키지 않는다.

새 transaction은 다음 **명시적 괄호식 전체**가 참일 때만 생성할 수 있다. terminal predecessor는 root / same-attempt nonsealed / sealed-reopen 세 branch로 분리하며 `FINALIZED_SEALED`를 generic terminal branch로 처리하지 않는다.

```text
(
    (
      PROMOTION_TRANSACTION_CONTEXT == NO_TRANSACTION
      AND previous promotion transaction does not exist
      AND promotionLineageEdgeType == ROOT
      AND PREVIOUS_PROMOTION_TERMINAL_EVIDENCE_PARITY == PASS_NOT_APPLICABLE
      AND PREVIOUS_PROJECT_ATTEMPT_ID == null
      AND REOPEN_POLICY_GATE == PASS_NOT_APPLICABLE
      AND REOPEN_TRIGGER_PARITY == PASS_NOT_APPLICABLE
      AND REOPEN_HISTORICAL_ARTIFACT_PARITY == PASS_NOT_APPLICABLE
      AND REOPEN_LINEAGE_PARITY == PASS_NOT_APPLICABLE
      AND PROJECT_ATTEMPT_LINEAGE_PARITY == PASS
    )
    OR
    (
      PROMOTION_TRANSACTION_CONTEXT == TERMINAL_TRANSACTION
      AND previous promotion transaction exists
      AND previousPromotionTerminalStatus IN {FINALIZED_ABORTED_NO_MUTATION, FINALIZED_ROLLED_BACK}
      AND promotionLineageEdgeType == SAME_ATTEMPT_PREDECESSOR
      AND previous transaction.projectAttemptId == PROJECT_ATTEMPT_ID
      AND PREVIOUS_PROMOTION_TERMINAL_EVIDENCE_PARITY == PASS
      AND REOPEN_POLICY_GATE IN {PASS, PASS_NOT_APPLICABLE}
      AND REOPEN_TRIGGER_PARITY IN {PASS, PASS_NOT_APPLICABLE}
      AND REOPEN_HISTORICAL_ARTIFACT_PARITY IN {PASS, PASS_NOT_APPLICABLE}
      AND REOPEN_LINEAGE_PARITY IN {PASS, PASS_NOT_APPLICABLE}
      AND PROJECT_ATTEMPT_LINEAGE_PARITY == PASS
    )
    OR
    (
      PROMOTION_TRANSACTION_CONTEXT == NO_TRANSACTION
      AND ACTIVE_PROMOTION_TRANSACTION_ID == null
      AND previous promotion transaction exists only as REOPEN_FROM historical lineage
      AND previousPromotionTerminalStatus == FINALIZED_SEALED
      AND promotionLineageEdgeType == REOPEN_BRIDGE
      AND REOPEN_POLICY_GATE == PASS
      AND REOPEN_TRIGGER_PARITY == PASS
      AND REOPEN_HISTORICAL_ARTIFACT_PARITY == PASS
      AND REOPEN_ATTEMPT_EVIDENCE_SHA valid
      AND PROJECT_ATTEMPT_ID != PREVIOUS_PROJECT_ATTEMPT_ID
      AND REOPEN_FROM_PROMOTION_TRANSACTION_ID == previousPromotionTransactionId
      AND REOPEN_FROM_PROMOTION_FINALIZATION_EVIDENCE_SHA == previousTerminalEvidenceSha
      AND PREVIOUS_PROMOTION_TERMINAL_EVIDENCE_PARITY == PASS
      AND REOPEN_LINEAGE_PARITY == PASS
      AND PROJECT_ATTEMPT_LINEAGE_PARITY == PASS
    )
)
AND ROLLBACK_REQUIRED != true
AND no rollback verification pending
AND UNCONSUMED_TERMINAL_WITHDRAWAL_LATCH_COUNT == 0
AND DUPLICATE_WITHDRAWAL_LATCH_CONSUMPTION_COUNT == 0
AND WITHDRAWAL_EVENT_QUEUE_LEDGER_INTEGRITY IN {PASS, PASS_NOT_APPLICABLE}
AND PENDING_WITHDRAWAL_DURING_RESET_COUNT == 0
AND DUPLICATE_PENDING_WITHDRAWAL_EVENT_COUNT == 0
AND DUPLICATE_WITHDRAWAL_QUEUE_DRAIN_COUNT == 0
AND ORPHAN_WITHDRAWAL_QUEUE_DRAIN_COUNT == 0
AND UNVERIFIED_DRAINED_WITHDRAWAL_EVENT_COUNT == 0
AND FAILED_RESET_RETRY_TRIGGER_PARITY IN {PASS, PASS_NOT_APPLICABLE}
AND FAILED_RESET_RETRY_BEFORE_QUEUE_DRAIN_PARITY IN {PASS, PASS_NOT_APPLICABLE}
AND WITHDRAWAL_QUEUE_FIFO_PARITY IN {PASS, PASS_NOT_APPLICABLE}
AND WITHDRAWAL_QUEUE_PROVENANCE_PARITY IN {PASS, PASS_NOT_APPLICABLE}
AND WITHDRAWAL_QUEUE_DRAIN_TO_RESET_PARITY IN {PASS, PASS_NOT_APPLICABLE}
AND NESTED_CONTROLLED_BASELINE_RESET_COUNT == 0
AND CONTROLLED_BASELINE_RESET_STATUS IN {NOT_APPLICABLE, REFROZEN_VERIFIED}
AND PRESEAL_ACTIVE_BASELINE_PARITY == PASS
AND PRODUCTION_BASELINE_DRIFT == 0
```

`AND`가 `OR`의 한 branch에만 적용되는 방식으로 이 식을 구현하면 HARD FAIL이다.

same-attempt 후속 transaction은 project-attempt lineage를 새로 만들지 않는다. 따라서 root attempt 안의 후속 transaction은 `REOPEN_POLICY_GATE/REOPEN_TRIGGER_PARITY/REOPEN_LINEAGE_PARITY == PASS_NOT_APPLICABLE`을 유지하고, reopened attempt 안의 후속 transaction은 동일 `REOPEN_ATTEMPT_EVIDENCE_SHA`와 `REOPEN_POLICY_GATE/REOPEN_TRIGGER_PARITY/REOPEN_LINEAGE_PARITY == PASS`를 유지한다. same-attempt transaction마다 Reopen을 새로 승인하거나 `PASS`를 `PASS_NOT_APPLICABLE`로 되돌리는 것을 금지한다.

특히 `FINALIZED_ABORTED_NO_MUTATION` 또는 `FINALIZED_ROLLED_BACK` 뒤 controlled reset/refreeze/PRESEAL을 완료하고 재진입할 때도 기존 transaction을 재사용하지 않고 새 `promotionTransactionId`를 발급한다. `FINALIZED_SEALED` 뒤에는 위 generic nonsealed branch를 사용할 수 없으며, §42가 생성한 valid `REOPEN_ATTEMPT_EVIDENCE_SHA`와 새 `PROJECT_ATTEMPT_ID`의 lineage bridge가 먼저 확정되어야 한다.

`PROMOTION_LINEAGE_EDGE_TYPE`의 canonical 값은 다음 세 개뿐이다.

```text
ROOT
SAME_ATTEMPT_PREDECESSOR
REOPEN_BRIDGE
```

HARD invariant:

```text
PROMOTION_TRANSACTION_FINALIZATION_STATUS == PROMOTING
=> ACTIVE_PROMOTION_TRANSACTION_ID is not null
AND PROMOTION_TRANSACTION_INIT_EVIDENCE_SHA valid
AND PROMOTION_TRANSACTION_INIT_EVIDENCE.promotionTransactionId
    == ACTIVE_PROMOTION_TRANSACTION_ID

terminal transaction id
=> never becomes ACTIVE_PROMOTION_TRANSACTION_ID for a new attempt

PROMOTION_TRANSACTION_FINALIZATION_STATUS in terminal states
=> PROMOTION_TRANSACTION_CONTEXT == TERMINAL_TRANSACTION
```

`PROMOTING` 상태에서 withdrawal 요청이 들어오면 §5.1.1(C)의 event latch/fence가 우선한다.

```text
PROMOTING + withdrawal + PRODUCTION_MUTATED == false
→ FURTHER_PRODUCTION_MUTATION = FORBIDDEN
→ PROMOTION_TRANSACTION_FINALIZATION_STATUS = FINALIZED_ABORTED_NO_MUTATION
→ PROMOTION_ABORT_EVIDENCE_SHA valid
→ CONTROLLED_BASELINE_RESET_STATUS = REQUIRED

PROMOTING + withdrawal + PRODUCTION_MUTATED == true
→ PROMOTION_TRANSACTION_FINALIZATION_STATUS = FINALIZATION_FAILED_ROLLBACK_REQUIRED
→ mandatory rollback + verification
→ FINALIZATION_ROLLBACK_EVIDENCE_SHA valid
→ PROMOTION_TRANSACTION_FINALIZATION_STATUS = FINALIZED_ROLLED_BACK
→ CONTROLLED_BASELINE_RESET_STATUS = REQUIRED
```

mutation 전 abort evidence 최소 객체:

```text
PROMOTION_ABORT_EVIDENCE_SHA = SHA256(canonical {
  promotionTransactionId,
  abortEvent: {NOT_STARTED_WITHDRAWAL_ABORT | PROMOTING_WITHDRAWAL_ABORT},
  withdrawalRequestEvidenceRef,
  productionMutated: false,
  mutationFenceEstablished: true,
  finalizationStatus: FINALIZED_ABORTED_NO_MUTATION
})
```

`FINALIZED_ABORTED_NO_MUTATION`은 `NOT_STARTED` 또는 `PROMOTING`에서 production write가 하나도 발생하지 않은 promotion attempt의 정상적인 abort terminal state다. 이 상태에서는 rollback evidence를 위조해서 만들지 않는다. 반대로 mutation이 하나라도 발생했다면 이 상태를 사용할 수 없고 반드시 rollback branch로 간다.
`PROMOTION_ABORT_EVIDENCE_SHA`는 append-only evidence로 `EVIDENCE_LEDGER_SHA`에 포함한다. mutation 전 abort에서는 `PROMOTION_EVIDENCE_SHA`가 성공 evidence처럼 생성되어서는 안 되며, 이후 새 controlled reset/new promotion attempt가 시작되어도 abort provenance를 덮어쓰지 않는다.

production이 새 release로 바뀌고 post-promotion gate를 통과한 뒤 최종 봉인 전까지는:

```text
PROMOTION_TRANSACTION_FINALIZATION_STATUS = PROMOTED_PENDING_FINAL_SEAL
```

이다.

이 상태에서 승인된 production withdrawal 요청이 발생하면 withdrawal을 직접 실행하지 않는다. 이는 현재 promotion transaction을 먼저 종료해야 하는 `POST_PROMOTION_WITHDRAWAL_ABORT`로 처리한다.

```text
PROMOTED_PENDING_FINAL_SEAL
+ POST_BASELINE_PRODUCTION_WITHDRAWAL_REQUEST
→ FINALIZATION_FAILED_ROLLBACK_REQUIRED
→ mandatory rollback + verification
→ FINALIZED_ROLLED_BACK
→ 그 후에만 별도 CONTROLLED_BASELINE_RESET_TRANSACTION 시작 가능
```

이 ordering은 §5.1.1의 withdrawal state table이 최우선이다. rollback 전에 withdrawal을 실행하거나 새 production baseline generation을 만들면 HARD FAIL이다. `FINALIZATION_FAILED_ROLLBACK_REQUIRED`에서 추가 withdrawal request가 관측되면 request만 latch하고 현재 rollback을 완료한다. 중첩 rollback/promotion/reset transaction을 만들지 않는다.

HARD invariant:

```text
PRODUCTION_MUTATED == true
AND UNIT_STATUS != SEALED
AND FINALIZATION_FAILED == true
=> ROLLBACK_REQUIRED
```

다음은 모두 `POST_PROMOTION_FINALIZATION_FAIL`이다.

```text
FINAL_GIT_PARITY_FAIL
SEAL_BUNDLE_SHA_INVALID
MOTHER_FINAL_REVIEW_FAIL
POST_PROMOTION_WITHDRAWAL_ABORT
기타 Final Seal HARD predicate의 post-promotion 실패
```

처리:

일반 post-promotion finalization fail:

```text
POST_PROMOTION_FINALIZATION_FAIL
AND event != POST_PROMOTION_WITHDRAWAL_ABORT
→ PROMOTION_TRANSACTION_FINALIZATION_STATUS = FINALIZATION_FAILED_ROLLBACK_REQUIRED
→ rollback baseline
→ rollback verification
→ production baseline parity 재확인
→ FINALIZATION_ROLLBACK_EVIDENCE_SHA 생성
→ PROMOTION_TRANSACTION_FINALIZATION_STATUS = FINALIZED_ROLLED_BACK
→ REPAIR_REQUIRED
```

withdrawal abort는 rollback 완료 후 generic `REPAIR_REQUIRED`에서 멈추지 않고 §5.1의 새 reset transaction으로 이어진다.

```text
POST_PROMOTION_WITHDRAWAL_ABORT
→ PROMOTION_TRANSACTION_FINALIZATION_STATUS = FINALIZATION_FAILED_ROLLBACK_REQUIRED
→ rollback baseline
→ rollback verification
→ production baseline parity 재확인
→ FINALIZATION_ROLLBACK_EVIDENCE_SHA 생성
→ PROMOTION_TRANSACTION_FINALIZATION_STATUS = FINALIZED_ROLLED_BACK
→ CONTROLLED_BASELINE_RESET_STATUS = REQUIRED
→ §5.1.2 transaction 시작
```

`PROMOTION_EVIDENCE_SHA`는 PHASE 12 성공 당시의 append-only evidence이므로 사후 rollback 정보를 넣기 위해 덮어쓰지 않는다. finalization 실패 rollback은 별도 객체로 기록한다.

```text
FINALIZATION_ROLLBACK_EVIDENCE_SHA = SHA256(canonical {
  promotionTransactionId,
  failedFinalizationGate,
  failedEvidenceRef,
  rollbackPlanSha,
  rollbackVerificationSha,
  restoredProductionBaselineSha,
  restoredGitStateRef,
  finalizationStatus: FINALIZED_ROLLED_BACK
})
```

공유 Git history를 위험하게 rewind/force-reset하지 않는다. 이미 commit/push가 발생한 경우에는 baseline release payload를 복구하는 corrective commit 등 repository 정책에 맞는 안전한 rollback을 사용하고, 그 결과를 `rollbackVerificationSha`에 결박한다.

다음이 참인 상태를 장기간 허용하지 않는다.

```text
production = unsealed candidate
UNIT_STATUS = REPAIR_REQUIRED
ROLLBACK_REQUIRED = true
rollback not verified
```

rollback 성공 후에는 다음이 참이어야 한다.

```text
PROMOTION_TRANSACTION_FINALIZATION_STATUS == FINALIZED_ROLLED_BACK
FINALIZATION_ROLLBACK_EVIDENCE_SHA_VALID
PRODUCTION_RELEASE_ARTIFACT_SHA == promotionBaselineReleaseArtifactSha
```

rollback verification이 실패하면 terminal state로 가장하지 않는다.

```text
ROLLBACK_VERIFICATION_FAIL
=> PROMOTION_TRANSACTION_FINALIZATION_STATUS == FINALIZATION_FAILED_ROLLBACK_REQUIRED
AND ROLLBACK_REQUIRED == true
AND FINALIZED_ROLLED_BACK 선언 금지
AND CONTROLLED_BASELINE_RESET transaction 시작 금지
AND FINAL_SEAL_ELIGIBLE == false
```

Finalization 성공 시에는 pre-finalization bundle과 Mother verdict를 별도 immutable record로 닫는다.

```text
MOTHER_FINAL_REVIEW_EVIDENCE_SHA
PROMOTION_FINALIZATION_EVIDENCE_SHA = SHA256(canonical {
  promotionTransactionId,
  activePromotionTransactionId,
  SEAL_BUNDLE_SHA,
  MOTHER_FINAL_REVIEW_EVIDENCE_SHA,
  finalizationStatus: FINALIZED_SEALED
})
```

이 record는 `SEAL_BUNDLE_SHA`의 입력이 아니다. 즉 self/circular hash를 만들지 않고, Final Seal 의사결정 이후의 transaction 종료 사실을 증명한다.

---

# 37. Final Git Parity Gate

Final Seal 전에 repository 상태를 고정한다.

기본 required 상태:

```text
HEAD == main == origin/main
worktree clean
```

프로젝트가 PR/branch 기반 release를 명시한 경우 Overlay가 동등한 canonical release ref 규칙을 정의할 수 있으나, 모호한 detached/dirty 상태는 허용하지 않는다.

최소:

```text
FINAL_GIT_HEAD_SHA
FINAL_GIT_PARITY_PASS
HEAD_RELEASE_ARTIFACT_SHA
```

필수:

```text
HEAD_RELEASE_ARTIFACT_SHA == FINAL_RELEASE_ARTIFACT_SHA
```

Git commit SHA와 release artifact SHA는 다른 개념이다.

---

# 38. Global CI와 Project Seal 분리

프로젝트 scope 밖 unrelated CI 실패가 있을 수 있다.

최종 보고는:

```text
PROJECT_SEAL_STATUS
GLOBAL_CI_STATUS
```

를 분리한다.

단, global CI 실패가 target release 또는 공통 engine/runtime에 영향을 준다면 unrelated로 분류할 수 없다.

`BLOCKED_UNRELATED` 판정에는 근거를 남긴다.

---

# 39. Final Seal Bundle

권장:

```text
SEAL_BUNDLE_SHA = SHA256(canonical {
  PRESEAL_BUNDLE_SHA,
  PROMOTION_EVIDENCE_SHA,
  FINAL_RELEASE_ARTIFACT_SHA,
  PRODUCTION_RELEASE_ARTIFACT_SHA,
  PROMOTION_TRANSACTION_PRE_FINALIZATION_STATUS: PROMOTED_PENDING_FINAL_SEAL,
  FINAL_GIT_HEAD_SHA,
  EFFECTIVE_RULESET_SHA
})
```

검수/evidence/report를 release payload와 분리하여 hash 순환을 막는다.

---

# 40. Final Seal HARD Predicate

다음 전체 조건을 만족해야 한다.

```text
FINAL_SEAL_ELIGIBLE =
    INVENTORY_PARITY_PASS
AND REVERSE_SCAN_RESOLVED
AND INITIAL_INCLUDED_SCOPE_UID_SET_SHA_VALID
AND FINAL_TARGET_UID_SET_SHA_VALID
AND FINAL_SCOPE_DISPOSITION_MAP_SHA_VALID
AND FINAL_SCOPE_DISPOSITION_INVALID_COUNT == 0
AND FINAL_TARGET_SCOPE_PARITY == PASS
AND EXCLUDED_CORRECTNESS_DEFECT_STILL_IN_PRODUCTION_COUNT == 0
AND UNVERIFIED_SCOPE_WITHDRAWAL_COUNT == 0
AND UNVERIFIED_POST_BASELINE_WITHDRAWAL_COUNT == 0
AND UNCONSUMED_TERMINAL_WITHDRAWAL_LATCH_COUNT == 0
AND DUPLICATE_WITHDRAWAL_LATCH_CONSUMPTION_COUNT == 0
AND CONTROLLED_BASELINE_RESET_STATUS IN {NOT_APPLICABLE, REFROZEN_VERIFIED}
AND (
      POST_BASELINE_WITHDRAWAL_REQUEST_COUNT == 0
   OR CONTROLLED_BASELINE_RESET_EVIDENCE_SHA_VALID
    )
AND SCOPE_WITHDRAWAL_EVIDENCE_PARITY == PASS
AND SCOPE_WITHDRAWAL_EVIDENCE_BUNDLE_SHA_VALID
AND MANIFEST_FROZEN
AND STABLE_UID_DUPLICATE_COUNT == 0
AND DEPENDENCY_UNRESOLVED_COUNT == 0
AND OVERLAY_VALIDATION_GATE == PASS
AND PROTOCOL_REGRESSION_GATE == PASS
AND PROTOCOL_REGRESSION_EVIDENCE_SHA_VALID
AND (
      PROTOCOL_REGRESSION_BASELINE_STATUS == ADOPTED_BASELINE
      AND PROTOCOL_REGRESSION_BASELINE_SHA_VALID
      AND PROTOCOL_REGRESSION_BASELINE_CONTRACT_REGISTRY_SHA_VALID
    OR
      PROTOCOL_REGRESSION_BASELINE_STATUS == BOOTSTRAP_ADOPTION
      AND BOOTSTRAP_ADOPTION_APPROVAL_EVIDENCE_SHA_VALID
    )
AND EFFECTIVE_RULESET_SHA_VALID
AND HASH_CANONICALIZATION_SPEC_SHA_VALID
AND LEGACY_PLAN_COMPATIBILITY_STATUS IN {PASS, PASS_NOT_APPLICABLE}

AND (
      PILOT_SYSTEM_GATE == PASS
   OR PILOT_NOT_APPLICABLE_APPROVED == true
)

AND RELEASE_CONTENT_READY == true
AND STATIC_CONTRACT_PASS_COUNT == FINAL_TARGET_COUNT
AND STATIC_CONTRACT_FAIL_COUNT == 0
AND STATIC_CONTRACT_NOT_TESTED_COUNT == 0
AND STATIC_CONTRACT_COVERAGE_COUNT == FINAL_TARGET_COUNT
AND STATIC_CONTRACT_COVERAGE_MAP_SHA_VALID

AND SOURCE_READY_COUNT == FINAL_TARGET_COUNT
AND UNRESOLVED_SOURCE_DEFECT_COUNT == 0
AND CORRECTNESS_AFFECTING_SOURCE_DEFECT_UNREPAIRED_COUNT == 0
AND NON_SEALABLE_CORRECTNESS_EXCEPTION_COUNT == 0
AND SOURCE_CORRECTNESS_IMPACT_NOT_ADJUDICATED_COUNT == 0
AND UNAPPROVED_PROTECTED_DIFF == 0
AND OUT_OF_SCOPE_DIFF == 0
AND APPROVED_SOURCE_REPAIR_LEDGER_PARITY == PASS
AND APPROVED_SOURCE_EXCEPTION_LEDGER_PARITY == PASS
AND SOURCE_RESOLUTION_LEDGER_SHA_VALID

AND A_BLIND_INPUT_HASH_MAP_VALID
AND A_COMPARISON_INPUT_HASH_MAP_VALID
AND B_REVIEW_INPUT_HASH_MAP_VALID
AND C_REVIEW_INPUT_HASH_MAP_VALID
AND D_RENDER_INPUT_HASH_MAP_VALID
AND A_BLIND_COVERAGE_MAP_SHA_VALID
AND A_COMPARISON_COVERAGE_MAP_SHA_VALID
AND B_COVERAGE_MAP_SHA_VALID
AND C_REQUIRED_COVERAGE_MAP_SHA_VALID
AND D_RENDER_CASE_COVERAGE_MAP_SHA_VALID

AND A_BLIND_COVERAGE_COUNT == FINAL_TARGET_COUNT
AND A_COMPARISON_COVERAGE_COUNT == FINAL_TARGET_COUNT
AND B_COVERAGE_COUNT == FINAL_TARGET_COUNT
AND C_REQUIRED_COVERAGE_COUNT == FINAL_C_REQUIRED_COUNT
AND D_RENDER_CASE_COVERAGE_COUNT == FINAL_RENDER_CASE_COUNT

AND MATH_REVIEW_PASS_COUNT == FINAL_TARGET_COUNT
AND INDEPENDENT_MATH_FAIL_COUNT == 0
AND INDEPENDENT_MATH_UNRESOLVED_COUNT == 0
AND UNRESOLVED_REVIEW_CONFLICT_COUNT == 0

AND PEDAGOGY_REVIEW_PASS_COUNT == FINAL_TARGET_COUNT
AND STUDENT_REPRODUCIBLE_PASS_COUNT == FINAL_TARGET_COUNT
AND CURRICULUM_PASS_COUNT == FINAL_TARGET_COUNT

AND VISUAL_REQUIRED_MISSING_COUNT == 0
AND VISUAL_MATH_FAIL_COUNT == 0
AND STATIC_VISUAL_CONTRACT_FAIL_COUNT == 0
AND BROKEN_ASSET_COUNT == 0
AND (
      FINAL_C_REQUIRED_COUNT > 0
      AND C_FINAL_REPORT_STATUS == PASS
    OR
      FINAL_C_REQUIRED_COUNT == 0
      AND C_FINAL_REPORT_STATUS == PASS_NOT_APPLICABLE
)

AND A_FINAL_REPORT(FINAL_RELEASE_ARTIFACT_SHA) == PASS
AND B_FINAL_REPORT(FINAL_RELEASE_ARTIFACT_SHA) == PASS
AND D_FINAL_REPORT(FINAL_RELEASE_ARTIFACT_SHA) == PASS
AND (
      FINAL_C_REQUIRED_COUNT > 0
      AND C_FINAL_REPORT(FINAL_RELEASE_ARTIFACT_SHA) == PASS
    OR
      FINAL_C_REQUIRED_COUNT == 0
      AND C_FINAL_REPORT(FINAL_RELEASE_ARTIFACT_SHA) == PASS_NOT_APPLICABLE
    )

AND A_START_RELEASE_SHA == A_END_RELEASE_SHA == FINAL_RELEASE_ARTIFACT_SHA
AND B_START_RELEASE_SHA == B_END_RELEASE_SHA == FINAL_RELEASE_ARTIFACT_SHA
AND C_START_RELEASE_SHA == C_END_RELEASE_SHA == FINAL_RELEASE_ARTIFACT_SHA [if C applicable]
AND D_START_RELEASE_SHA == D_END_RELEASE_SHA == FINAL_RELEASE_ARTIFACT_SHA
AND SAME_FINAL_RELEASE_SHA_ACROSS_ALL_APPLICABLE_AXES

AND STAGING_ALL_REQUIRED_RENDER == PASS
AND ALL_REQUIRED_RENDER_WITNESS_PRESENT == PASS
AND RENDER_QUESTION_COUNT_PARITY == PASS
AND RENDER_ASSET_ASSOCIATION_PARITY == PASS
AND RENDER_RUNTIME_FINGERPRINT_VALID

AND EVIDENCE_LEDGER_INTEGRITY == PASS
AND REVIEW_EVIDENCE_SHA_VALID
AND PRESEAL_BUNDLE_SHA_VALID
AND PRESEAL_ACTIVE_BASELINE_PARITY == PASS
AND MOTHER_PRESEAL_PASS

AND PRODUCTION_BASELINE_DRIFT == 0
AND PROMOTION_ROLLBACK_PATH_VALID == PASS
AND PROMOTION_STATUS == PASS
AND PRODUCTION_RELEASE_ARTIFACT_SHA == FINAL_RELEASE_ARTIFACT_SHA
AND PRODUCTION_OUT_OF_SCOPE_DIFF == 0
AND PRODUCTION_UNAPPROVED_PROTECTED_DIFF == 0
AND POST_PROMOTION_ALL_REQUIRED_RENDER == PASS
AND POST_PROMOTION_ALL_REQUIRED_RENDER_WITNESS_PRESENT == PASS
AND POST_PROMOTION_RENDER_WITNESS_MANIFEST_SHA_VALID
AND POST_PROMOTION_RENDER_RUNTIME_FINGERPRINT_SHA_VALID
AND POST_PROMOTION_FAILURE_LEFT_IN_PRODUCTION == 0
AND PRODUCTION_PARITY_GATE == PASS
AND PROMOTION_EVIDENCE_SHA_VALID
AND PROMOTION_TRANSACTION_CONTEXT == OPEN_TRANSACTION
AND ACTIVE_PROMOTION_TRANSACTION_ID != null
AND NEW_PROMOTION_TRANSACTION_INITIALIZED == PASS
AND PROMOTION_TRANSACTION_INIT_EVIDENCE_SHA_VALID
AND PREVIOUS_PROMOTION_TERMINAL_EVIDENCE_PARITY IN {PASS, PASS_NOT_APPLICABLE}
AND REOPEN_POLICY_GATE IN {PASS, PASS_NOT_APPLICABLE}
AND REOPEN_TRIGGER_PARITY IN {PASS, PASS_NOT_APPLICABLE}
AND REOPEN_HISTORICAL_ARTIFACT_PARITY IN {PASS, PASS_NOT_APPLICABLE}
AND REOPEN_LINEAGE_PARITY IN {PASS, PASS_NOT_APPLICABLE}
AND PROJECT_ATTEMPT_LINEAGE_PARITY == PASS
AND PROMOTION_TRANSACTION_CHAIN_PARITY == PASS
AND PROMOTION_TRANSACTION_ID_PARITY == PASS
AND UNCONSUMED_TERMINAL_WITHDRAWAL_LATCH_COUNT == 0
AND DUPLICATE_WITHDRAWAL_LATCH_CONSUMPTION_COUNT == 0
AND WITHDRAWAL_EVENT_QUEUE_LEDGER_INTEGRITY IN {PASS, PASS_NOT_APPLICABLE}
AND PENDING_WITHDRAWAL_DURING_RESET_COUNT == 0
AND DUPLICATE_PENDING_WITHDRAWAL_EVENT_COUNT == 0
AND DUPLICATE_WITHDRAWAL_QUEUE_DRAIN_COUNT == 0
AND ORPHAN_WITHDRAWAL_QUEUE_DRAIN_COUNT == 0
AND UNVERIFIED_DRAINED_WITHDRAWAL_EVENT_COUNT == 0
AND FAILED_RESET_RETRY_TRIGGER_PARITY IN {PASS, PASS_NOT_APPLICABLE}
AND FAILED_RESET_RETRY_BEFORE_QUEUE_DRAIN_PARITY IN {PASS, PASS_NOT_APPLICABLE}
AND WITHDRAWAL_QUEUE_FIFO_PARITY IN {PASS, PASS_NOT_APPLICABLE}
AND WITHDRAWAL_QUEUE_PROVENANCE_PARITY IN {PASS, PASS_NOT_APPLICABLE}
AND WITHDRAWAL_QUEUE_DRAIN_TO_RESET_PARITY IN {PASS, PASS_NOT_APPLICABLE}
AND NESTED_CONTROLLED_BASELINE_RESET_COUNT == 0
AND PROMOTION_TRANSACTION_FINALIZATION_STATUS == PROMOTED_PENDING_FINAL_SEAL

AND FINAL_GIT_PARITY_PASS == PASS
AND HEAD_RELEASE_ARTIFACT_SHA == FINAL_RELEASE_ARTIFACT_SHA
AND GIT_WORKTREE_CLEAN

AND SEAL_BUNDLE_SHA_VALID
AND MOTHER_FINAL_REVIEW == PASS
```

위 predicate가 모두 참이고 Mother가 PASS를 선언하는 원자적 finalization 순간에만:

```text
PROMOTION_TRANSACTION_FINALIZATION_STATUS = FINALIZED_SEALED
UNIT_STATUS = SEALED
MOTHER_FINAL_REVIEW_EVIDENCE_SHA valid
PROMOTION_FINALIZATION_EVIDENCE_SHA valid
```

로 전환한다. `FINAL_SEAL_ELIGIBLE`은 이 전환 직전의 precondition predicate이며, 전환 후에는 `FINALIZED_SEALED` postcondition과 두 finalization evidence SHA로 봉인 완료 사실을 확인한다.

하나라도 거짓이면:

```text
FINAL_SEAL_ELIGIBLE = false
UNIT_STATUS = REPAIR_REQUIRED
```

이미 `PRODUCTION_MUTATED == true`인 시점의 실패라면 §36.7에 따라:

```text
FINALIZATION_FAILED = true
ROLLBACK_REQUIRED = true
PROMOTION_TRANSACTION_FINALIZATION_STATUS = FINALIZATION_FAILED_ROLLBACK_REQUIRED
```

를 설정하고 rollback verification이 끝나기 전까지 repair를 재개하거나 새 candidate를 production에 올리지 않는다. rollback 완료 후에는 `FINALIZED_ROLLED_BACK`과 `FINALIZATION_ROLLBACK_EVIDENCE_SHA_VALID`을 확인한다.

SEALED postcondition:

```text
UNIT_STATUS == SEALED
AND PROMOTION_TRANSACTION_CONTEXT == TERMINAL_TRANSACTION
AND PROMOTION_TRANSACTION_FINALIZATION_STATUS == FINALIZED_SEALED
AND ACTIVE_PROMOTION_TRANSACTION_ID == PROMOTION_FINALIZATION_EVIDENCE.promotionTransactionId
AND PROMOTION_FINALIZATION_EVIDENCE.activePromotionTransactionId == ACTIVE_PROMOTION_TRANSACTION_ID
AND MOTHER_FINAL_REVIEW_EVIDENCE_SHA_VALID
AND PROMOTION_FINALIZATION_EVIDENCE_SHA_VALID
```

`PROMOTION_TRANSACTION_ID_PARITY == PASS` iff 현재 active transaction id가 transaction-init evidence, promotion evidence, finalization 대상 transaction id와 모두 동일하며 과거 terminal transaction id를 재사용하지 않았음이 검증된 상태다.

`PROMOTION_TRANSACTION_CHAIN_PARITY == PASS` iff 현재 `PROJECT_ATTEMPT_ID`의 promotion init evidence chain 전체에서 다음을 모두 만족한 상태다.

```text
root project lineage의 최초 transaction:
  promotionLineageEdgeType == ROOT
  AND predecessor == PASS_NOT_APPLICABLE
  AND PREVIOUS_PROJECT_ATTEMPT_ID == null

reopened project attempt의 최초 transaction:
  promotionLineageEdgeType == REOPEN_BRIDGE
  AND REOPEN_LINEAGE_PARITY == PASS
  AND previousPromotionTransactionId == REOPEN_FROM_PROMOTION_TRANSACTION_ID
  AND previous sealed finalization evidence와 bridge parity PASS

동일 project attempt의 모든 후속 transaction:
  promotionLineageEdgeType == SAME_ATTEMPT_PREDECESSOR
  AND PREVIOUS_PROMOTION_TERMINAL_EVIDENCE_PARITY == PASS
  AND previous transaction.projectAttemptId == PROJECT_ATTEMPT_ID
  AND PROJECT_ATTEMPT_LINEAGE_PARITY == PASS
  AND project-attempt-level REOPEN_POLICY_GATE / REOPEN_LINEAGE_PARITY 값이 해당 attempt 시작 시점과 동일

공통:
  모든 init evidence.projectAttemptId == PROJECT_ATTEMPT_ID
  모든 init evidence.previousProjectAttemptId == PREVIOUS_PROJECT_ATTEMPT_ID
  reopened attempt의 모든 init evidence.reopenAttemptEvidenceSha == REOPEN_ATTEMPT_EVIDENCE_SHA
  root attempt의 모든 init evidence.reopenAttemptEvidenceSha == null
  previousPromotionTransactionId가 해당 edge가 요구하는 정확한 terminal transaction id와 일치
  promotionTransactionId 중복 == 0
  projectAttemptId lineage 역행/중복 == 0
  self-reference / cycle == 0
  terminal evidence type/status/SHA mapping mismatch == 0
```

`PROJECT_ATTEMPT_LINEAGE_PARITY == PASS` iff root attempt은 `PREVIOUS_PROJECT_ATTEMPT_ID == null`이고 reopen evidence가 없으며, reopened attempt은 `PROJECT_ATTEMPT_ID != PREVIOUS_PROJECT_ATTEMPT_ID`이고 valid `REOPEN_ATTEMPT_EVIDENCE_SHA`가 바로 이전 sealed project attempt와 정확히 bridge한다. reopened attempt에서 `REOPEN_LINEAGE_PARITY == PASS_NOT_APPLICABLE`을 사용하면 HARD FAIL이다. `REOPEN_POLICY_GATE == PASS`인 모든 reopened attempt는 `REOPEN_TRIGGER_PARITY == PASS`도 유지해야 하며, wrapper state/reason/primary trigger evidence 중 하나라도 바뀌면 기존 Reopen authorization은 stale이다.

금지 표현:

```text
SEALED
FINAL
COMPLETE
최종완료
봉인완료
```

---

# 41. Mother Final Review

Mother Verifier는 수정하지 않는다.

최종 확인:

- scope/manifest
- Core/Overlay/effective ruleset
- protocol regression
- source closure
- A/B/C/D coverage
- review independence
- input hash maps
- unresolved conflicts
- evidence ledger
- protected/out-of-scope parity
- staging render
- preseal bundle
- promotion/rollback evidence
- production parity
- post-promotion render + witness coverage + runtime fingerprint
- promotion transaction이 `PROMOTED_PENDING_FINAL_SEAL` 상태인지
- Git parity
- seal bundle

Mother PASS/FAIL 자체도 `MOTHER_FINAL_REVIEW_EVIDENCE_SHA`로 append-only 기록한다. PASS인 경우에만 §36.7의 `PROMOTION_FINALIZATION_EVIDENCE_SHA`를 생성하고 transaction을 `FINALIZED_SEALED`로 닫는다.

Mother가 새로운 수학 풀이를 만들어 A를 대체하지 않는다.

Mother는 모든 필수 evidence가 정식 closure를 이루는지 확인한다.

---

# 42. 봉인 후 상태 / Reopen Policy

허용 상태:

```text
SEALED
SEALED_RULESET_STALE
SEALED_OVERLAY_STALE
SEALED_CURRICULUM_MASTER_STALE
SEALED_RENDER_STALE
SEAL_BROKEN
```

Reopen reason의 canonical enum:

```text
REOPEN_REASON =
    PROTOCOL_STALE
    OVERLAY_STALE
    CURRICULUM_STALE
    RENDER_STALE
    RELEASE_BROKEN
    POST_SEAL_WITHDRAWAL_APPROVED
```

Reopen authorization의 의미 근거는 별도 canonical trigger evidence로 고정한다. syntactically valid한 Reopen evidence만으로 reason을 선택할 수 없다.

```text
PROTOCOL_STALENESS_EVIDENCE_SHA
OVERLAY_STALENESS_EVIDENCE_SHA
CURRICULUM_STALENESS_EVIDENCE_SHA
RENDER_STALENESS_EVIDENCE_SHA
RELEASE_BREAK_EVIDENCE_SHA
POST_SEAL_WITHDRAWAL_APPROVAL_EVIDENCE_SHA
```

각 trigger evidence SHA는 다음 공통 canonical envelope의 hash여야 한다. `triggerEvidenceType`별 required payload가 없으면 syntactically valid한 SHA로 인정하지 않는다.

```text
REOPEN_TRIGGER_EVIDENCE {
  triggerEvidenceType,
  previousProjectAttemptId,
  previousSealBundleSha,
  observedSealedWrapperState,
  previousValueSha,
  currentValueSha,
  sourceEvidenceRefs,
  approvalEvidenceRef
}
```

타입별 최소 의미:

```text
PROTOCOL_STALENESS_EVIDENCE:
  previousValueSha == previous sealed COMMON_PROTOCOL_SHA
  currentValueSha == current COMMON_PROTOCOL_SHA
  previousValueSha != currentValueSha
  affected-gate analysis ref required

OVERLAY_STALENESS_EVIDENCE:
  previousValueSha == previous sealed UNIT_OVERLAY_SHA
  currentValueSha == current UNIT_OVERLAY_SHA
  previousValueSha != currentValueSha

CURRICULUM_STALENESS_EVIDENCE:
  previousValueSha == previous sealed CURRICULUM_MASTER_BUNDLE_SHA
  currentValueSha == current CURRICULUM_MASTER_BUNDLE_SHA
  previousValueSha != currentValueSha

RENDER_STALENESS_EVIDENCE:
  previousValueSha == previous sealed RENDER_RUNTIME_FINGERPRINT_SHA
  currentValueSha == current RENDER_RUNTIME_FINGERPRINT_SHA
  previousValueSha != currentValueSha

RELEASE_BREAK_EVIDENCE:
  sourceEvidenceRefs prove mismatch in sealed release payload / manifest / identity
  previousValueSha == previous sealed relevant SHA
  currentValueSha == recomputed current relevant SHA
  previousValueSha != currentValueSha

POST_SEAL_WITHDRAWAL_APPROVAL_EVIDENCE:
  approvalEvidenceRef valid
  sourceEvidenceRefs contains exact post-seal withdrawalRequestEvidenceRef
  previousValueSha/currentValueSha may be null because authorization is event-driven, not stale-SHA driven
```

모든 trigger evidence는 `previousProjectAttemptId`와 `previousSealBundleSha`가 바로 Reopen 대상 sealed attempt와 일치해야 한다. `observedSealedWrapperState`는 Reopen 직전 wrapper state와 같아야 한다.

`REOPEN_ATTEMPT_EVIDENCE`에는 `primaryReopenTriggerEvidenceSha`를 반드시 기록하고 `reopenTriggerEvidenceRefs` 안에도 같은 SHA가 포함되어야 한다. 추가 trigger refs가 존재할 수는 있지만 canonical `REOPEN_REASON`은 아래 wrapper-state mapping으로 하나만 결정한다.

전환:

```text
COMMON_PROTOCOL 변경
→ 영향 gate 분석
→ PROTOCOL_STALENESS_EVIDENCE_SHA 생성
→ SEALED_RULESET_STALE
→ REOPEN_REASON = PROTOCOL_STALE

해당 UNIT_OVERLAY 변경
→ OVERLAY_STALENESS_EVIDENCE_SHA 생성
→ SEALED_OVERLAY_STALE
→ REOPEN_REASON = OVERLAY_STALE

해당 curriculum master 변경
→ CURRICULUM_STALENESS_EVIDENCE_SHA 생성
→ SEALED_CURRICULUM_MASTER_STALE
→ REOPEN_REASON = CURRICULUM_STALE

ENGINE/browser/MathJax/font/viewport 변경
→ RENDER_STALENESS_EVIDENCE_SHA 생성
→ SEALED_RENDER_STALE
→ REOPEN_REASON = RENDER_STALE

release payload/manifest/identity 변경
→ RELEASE_BREAK_EVIDENCE_SHA 생성
→ SEAL_BROKEN
→ REOPEN_REASON = RELEASE_BROKEN

FINALIZED_SEALED 이후 승인된 새 withdrawal 요청
→ 과거 sealed transaction immutable 유지
→ POST_SEAL_WITHDRAWAL_APPROVAL_EVIDENCE_SHA 생성
→ REOPEN_REASON = POST_SEAL_WITHDRAWAL_APPROVED
→ Reopen authorization 전 production 직접 withdrawal 금지
```

다른 단원 Overlay 변경은 해당 프로젝트 seal을 stale로 만들지 않는다. stale은 과거 evidence를 삭제한다는 뜻이 아니다. 새 정책으로 다시 봉인하려면 영향 scope를 재검하고 새 evidence/seal을 만든다.

`FINALIZED_SEALED` 이후 새 promotion transaction을 만들 권한은 §36.7.1의 generic terminal 조건만으로 생기지 않는다. 먼저 **새 project attempt**를 생성하고 다음 Reopen evidence를 확정해야 한다.

```text
PREVIOUS_PROJECT_ATTEMPT_ID = sealed attempt의 projectAttemptId
PROJECT_ATTEMPT_ID = new unique projectAttemptId
PROJECT_ATTEMPT_ID != PREVIOUS_PROJECT_ATTEMPT_ID

REOPEN_ATTEMPT_EVIDENCE_SHA = SHA256(canonical {
  previousProjectAttemptId,
  projectAttemptId,
  reopenFromSealedWrapperState,
  reopenReason,
  primaryReopenTriggerEvidenceSha,
  reopenTriggerEvidenceRefs,
  reopenFromPromotionTransactionId,
  reopenFromPromotionFinalizationEvidenceSha,
  previousSealBundleSha,
  previousFinalReleaseArtifactSha
})
```

`REOPEN_ATTEMPT_EVIDENCE_SHA`는 append-only evidence이며 `EVIDENCE_LEDGER`에 등록한다. Reopen 후 stale/broken marker나 trigger evidence를 바꾸어 기존 Reopen evidence를 덮어쓰는 것을 금지한다.

Reopen verifier가 참조하는 historical artifact의 canonical project-level fields는 다음 이름으로 고정한다. alias 표현을 사용하지 않는다.

```text
PREVIOUS_SEALED_SEAL_BUNDLE_SHA := immutable previous sealed attempt의 exact SEAL_BUNDLE_SHA
PREVIOUS_SEALED_FINAL_RELEASE_ARTIFACT_SHA := immutable previous sealed attempt의 exact FINAL_RELEASE_ARTIFACT_SHA
```

필수 authorization:

`REOPEN_TRIGGER_PARITY`는 current sealed wrapper state, canonical reason, exact trigger evidence를 다음과 같이 1:1 결박한다.

```text
REOPEN_TRIGGER_PARITY == PASS iff exactly one canonical mapping holds. 여기서 wrapper state는 mutable current state가 아니라 `REOPEN_ATTEMPT_EVIDENCE.reopenFromSealedWrapperState` snapshot이다:

SEALED_RULESET_STALE
  <=> REOPEN_REASON == PROTOCOL_STALE
  AND primaryReopenTriggerEvidenceSha == PROTOCOL_STALENESS_EVIDENCE_SHA
  AND valid protocol/ruleset staleness evidence proves COMMON_PROTOCOL impact

SEALED_OVERLAY_STALE
  <=> REOPEN_REASON == OVERLAY_STALE
  AND primaryReopenTriggerEvidenceSha == OVERLAY_STALENESS_EVIDENCE_SHA
  AND valid overlay staleness evidence proves current UNIT_OVERLAY impact

SEALED_CURRICULUM_MASTER_STALE
  <=> REOPEN_REASON == CURRICULUM_STALE
  AND primaryReopenTriggerEvidenceSha == CURRICULUM_STALENESS_EVIDENCE_SHA
  AND valid curriculum-master staleness evidence proves current project impact

SEALED_RENDER_STALE
  <=> REOPEN_REASON == RENDER_STALE
  AND primaryReopenTriggerEvidenceSha == RENDER_STALENESS_EVIDENCE_SHA
  AND valid runtime/environment staleness evidence proves render fingerprint impact

SEAL_BROKEN
  <=> REOPEN_REASON == RELEASE_BROKEN
  AND primaryReopenTriggerEvidenceSha == RELEASE_BREAK_EVIDENCE_SHA
  AND valid release-break evidence proves sealed release/manifest/identity mutation

SEALED
  <=> REOPEN_REASON == POST_SEAL_WITHDRAWAL_APPROVED
  AND primaryReopenTriggerEvidenceSha == POST_SEAL_WITHDRAWAL_APPROVAL_EVIDENCE_SHA
  AND valid approved post-seal withdrawal evidence exists

AND primary trigger evidence.previousProjectAttemptId == PREVIOUS_PROJECT_ATTEMPT_ID
AND primary trigger evidence.previousSealBundleSha == PREVIOUS_SEALED_SEAL_BUNDLE_SHA
AND primary trigger evidence.observedSealedWrapperState == REOPEN_ATTEMPT_EVIDENCE.reopenFromSealedWrapperState
AND REOPEN_ATTEMPT_EVIDENCE.reopenFromSealedWrapperState
    == sealed wrapper state observed immediately before Reopen authorization
AND REOPEN_ATTEMPT_EVIDENCE.primaryReopenTriggerEvidenceSha
    == primaryReopenTriggerEvidenceSha
AND reopenTriggerEvidenceRefs contains primaryReopenTriggerEvidenceSha
```

Reopen 직전 wrapper가 이미 stale/broken 상태라면 `reopenFromSealedWrapperState`에 그 상태를 snapshot하고 대응하는 reason을 canonical reason으로 사용한다. 같은 시점에 post-seal withdrawal approval 같은 추가 trigger가 존재해도 supplemental ref로만 기록할 수 있고 canonical reason을 다른 enum으로 바꾸지 않는다. `SEALED` clean wrapper에서만 `POST_SEAL_WITHDRAWAL_APPROVED`를 canonical reason으로 사용할 수 있다. 모든 supplemental `reopenTriggerEvidenceRefs`도 각 evidence type의 canonical validation을 통과해야 하며 invalid/unknown ref를 단순 부가 정보로 허용하지 않는다.

valid `POST_SEAL_WITHDRAWAL_APPROVAL_EVIDENCE_SHA`가 `reopenTriggerEvidenceRefs`에 하나라도 존재하면 canonical `REOPEN_REASON`이 stale/broken reason이더라도 withdrawal event를 폐기하지 않는다. Reopen authorization 후 새 project attempt에서 production baseline을 동결한 다음, 해당 approval evidence가 가리키는 exact withdrawal request event들을 canonical order로 §5.1 withdrawal intake에 전달한다. 첫 event가 controlled reset을 시작한 뒤 들어오는 나머지 event는 §5.1 single-writer/queue 규칙을 그대로 따른다.

```text
REOPEN_TRIGGER_PARITY == PASS_NOT_APPLICABLE iff
    PREVIOUS_PROJECT_ATTEMPT_ID == null
    AND REOPEN_ATTEMPT_EVIDENCE_SHA == null
    AND no Reopen trigger exists
```

`REOPEN_HISTORICAL_ARTIFACT_PARITY`는 Reopen evidence 내부의 historical fingerprint가 위 canonical historical fields와 정확히 일치하는지 직접 검증한다. trigger evidence가 올바르더라도 Reopen evidence 자체의 historical SHA가 다르면 PASS할 수 없다.

```text
REOPEN_HISTORICAL_ARTIFACT_PARITY == PASS iff
    REOPEN_ATTEMPT_EVIDENCE.previousSealBundleSha
        == PREVIOUS_SEALED_SEAL_BUNDLE_SHA
    AND REOPEN_ATTEMPT_EVIDENCE.previousFinalReleaseArtifactSha
        == PREVIOUS_SEALED_FINAL_RELEASE_ARTIFACT_SHA
    AND REOPEN_ATTEMPT_EVIDENCE.previousProjectAttemptId
        == PREVIOUS_PROJECT_ATTEMPT_ID

REOPEN_HISTORICAL_ARTIFACT_PARITY == PASS_NOT_APPLICABLE iff
    PREVIOUS_PROJECT_ATTEMPT_ID == null
    AND REOPEN_ATTEMPT_EVIDENCE_SHA == null
```

```text
REOPEN_POLICY_GATE == PASS_NOT_APPLICABLE iff
    PREVIOUS_PROJECT_ATTEMPT_ID == null
    AND REOPEN_ATTEMPT_EVIDENCE_SHA == null
    AND REOPEN_REASON is not set
    AND REOPEN_TRIGGER_PARITY == PASS_NOT_APPLICABLE
    AND REOPEN_HISTORICAL_ARTIFACT_PARITY == PASS_NOT_APPLICABLE
```

```text
REOPEN_POLICY_GATE == PASS iff
    previous attempt has valid immutable historical SEALED postcondition evidence
    AND previous promotion finalization evidence.status == FINALIZED_SEALED
    AND REOPEN_ATTEMPT_EVIDENCE.reopenFromSealedWrapperState IN {
        SEALED,
        SEALED_RULESET_STALE,
        SEALED_OVERLAY_STALE,
        SEALED_CURRICULUM_MASTER_STALE,
        SEALED_RENDER_STALE,
        SEAL_BROKEN
    }
    AND PROJECT_ATTEMPT_ID != PREVIOUS_PROJECT_ATTEMPT_ID
    AND REOPEN_REASON in canonical enum
    AND REOPEN_TRIGGER_PARITY == PASS
    AND REOPEN_HISTORICAL_ARTIFACT_PARITY == PASS
    AND REOPEN_ATTEMPT_EVIDENCE_SHA valid
```

```text
REOPEN_LINEAGE_PARITY == PASS iff
    REOPEN_HISTORICAL_ARTIFACT_PARITY == PASS
    AND REOPEN_ATTEMPT_EVIDENCE.previousProjectAttemptId == PREVIOUS_PROJECT_ATTEMPT_ID
    AND REOPEN_ATTEMPT_EVIDENCE.projectAttemptId == PROJECT_ATTEMPT_ID
    AND REOPEN_ATTEMPT_EVIDENCE.reopenFromPromotionTransactionId
        == REOPEN_FROM_PROMOTION_TRANSACTION_ID
    AND REOPEN_FROM_PROMOTION_TRANSACTION_ID
        == previous FINALIZED_SEALED promotionTransactionId
    AND REOPEN_ATTEMPT_EVIDENCE.reopenFromPromotionFinalizationEvidenceSha
        == REOPEN_FROM_PROMOTION_FINALIZATION_EVIDENCE_SHA
    AND REOPEN_FROM_PROMOTION_FINALIZATION_EVIDENCE_SHA
        == previous sealed PROMOTION_FINALIZATION_EVIDENCE_SHA
    AND that finalization evidence.promotionTransactionId
        == REOPEN_FROM_PROMOTION_TRANSACTION_ID
```

root/non-reopened attempt에서는 `REOPEN_LINEAGE_PARITY = PASS_NOT_APPLICABLE`만 허용한다. reopened attempt에서는 `PASS_NOT_APPLICABLE`을 사용할 수 없다.

```text
PROJECT_ATTEMPT_LINEAGE_PARITY == PASS iff
    (
      PREVIOUS_PROJECT_ATTEMPT_ID == null
      AND REOPEN_ATTEMPT_EVIDENCE_SHA == null
      AND REOPEN_POLICY_GATE == PASS_NOT_APPLICABLE
      AND REOPEN_TRIGGER_PARITY == PASS_NOT_APPLICABLE
      AND REOPEN_HISTORICAL_ARTIFACT_PARITY == PASS_NOT_APPLICABLE
      AND REOPEN_LINEAGE_PARITY == PASS_NOT_APPLICABLE
    )
    OR
    (
      PREVIOUS_PROJECT_ATTEMPT_ID != null
      AND PROJECT_ATTEMPT_ID != PREVIOUS_PROJECT_ATTEMPT_ID
      AND REOPEN_POLICY_GATE == PASS
      AND REOPEN_TRIGGER_PARITY == PASS
      AND REOPEN_LINEAGE_PARITY == PASS
    )
```

`FINALIZED_SEALED` 이후 Reopen은 기존 promotion transaction을 재개하지 않는다. Reopen authorization으로 새 project attempt를 생성하는 순간, **새 attempt에는 아직 promotion transaction이 없으므로** project-level current pointer를 다음처럼 초기화한다.

```text
previous sealed transaction/evidence -> immutable history only
REOPEN_FROM_PROMOTION_TRANSACTION_ID = previous sealed promotionTransactionId
REOPEN_FROM_PROMOTION_FINALIZATION_EVIDENCE_SHA = previous PROMOTION_FINALIZATION_EVIDENCE_SHA
ACTIVE_PROMOTION_TRANSACTION_ID = null
PROMOTION_TRANSACTION_CONTEXT = NO_TRANSACTION
```

옛 sealed transaction을 새 attempt의 `ACTIVE_PROMOTION_TRANSACTION_ID`로 계속 들고 가는 것을 금지한다. §36.7.1의 `REOPEN_BRIDGE` branch를 통해서만 새 `promotionTransactionId`와 새 `ACTIVE_PROMOTION_TRANSACTION_ID`를 발급할 수 있다.

`POST_SEAL_WITHDRAWAL_APPROVED`가 Reopen reason인 경우에도 `REOPEN_TRIGGER_PARITY == PASS`가 먼저 확정되어야 하며 sealed production을 즉시 수정하지 않는다. 새 project attempt를 생성해 현재 production을 baseline으로 동결한 뒤, 승인 withdrawal event를 새 attempt의 §5.1 A 경로(`PROMOTION_TRANSACTION_CONTEXT == NO_TRANSACTION`)로 넘겨 production withdrawal·absence verification·refreeze를 수행한다.

---

# 43. Manifest Canonical Minimum Schema

문항별 최소:

```text
questionUid
examId
sourceJsPath
id
displayNo

curriculumVersion
standardCourse
standardUnitKey
standardUnit
subUnitKey
subUnit

scopeReason
scopeSource
scopeStatus
initialScopeIncluded
productionStudentFacingActive
scopeWithdrawalStatus
scopeWithdrawalApprovalRef
scopeWithdrawalEvidenceSha
withdrawalRequestedAfterBaselineFreeze
controlledBaselineResetTransactionId [if applicable]
controlledBaselineResetEvidenceSha [if applicable]
finalScopeDisposition

groupUid
sharedMaterialUid
sharedMaterialRole
dependencyQuestionUids[]
renderSequence
dependencyClosureStatus

baselineJsSha256
ORIGINAL_PROTECTED_HASH
EFFECTIVE_PROTECTED_HASH
FINAL_PROTECTED_HASH
baselineSolutionHash

sourceReviewStatus
sourceDefectTypes[]
sourceCorrectnessImpactStatus
sourceExceptionSealability
sourceRepairStatus
sourceRepairApprovalRef
sourceExceptionApprovalRef
sourceResolutionItems[]

pedagogyDisposition
pedagogyReviewStatus
studentReproducibleStatus
curriculumStatus

visualRequirement
visualAction
ACTUAL_SOLUTION_VISUAL_ATTACHED
PROBLEM_VISUAL_MATH_DEPENDENCY
SHARED_VISUAL_MATH_DEPENDENCY
C_REVIEW_REQUIRED
visualMathReviewStatus
visualStaticContractStatus
scalePolicy
problemImageRef
solutionImageRef

ABlindInputSha
AFirstPassEvidenceSha
AComparisonInputSha
AComparisonEvidenceSha
AIndependenceLevel
mathReviewStatus
computedAnswer
sourceAnswer
answerComparison
solutionConclusionComparison

computationalVerificationMethod
computationalCoverage
computationalEvidenceRef
mathConflictStatus
adjudicationStatus
adjudicationEvidenceRef

BReviewInputHash
BReviewEvidenceRef
CReviewInputHash
CReviewEvidenceRef

builderStatus
selfCheckStatus
staticContractStatus
staticContractInputHash
staticContractReviewedArtifactSha
staticContractEvidenceRef

candidateReleaseArtifactSha
finalReleaseArtifactSha
productionReleaseArtifactSha

carryForwardEligible
carryForwardReason
carryForwardSourceArtifactSha
```

render case 별 최소:

```text
renderCaseId
examId
mode
viewportProfile
DRenderInputHash
runtimeLoadStatus
mathJaxStatus
fontReadyStatus
imageDecodeStatus
questionCountParityStatus
assetAssociationStatus
layoutStatus
renderedVisualPresentationStatus
renderWitnessRefs[]
DReviewEvidenceRef
```

project-level 최소:

```text
INITIAL_INCLUDED_SCOPE_UID_SET_SHA
FINAL_TARGET_UID_SET_SHA
FINAL_SCOPE_DISPOSITION_MAP_SHA
SCOPE_WITHDRAWAL_EVIDENCE_BUNDLE_SHA
SCOPE_WITHDRAWAL_EVIDENCE_PARITY
FINAL_SCOPE_DISPOSITION_INVALID_COUNT
FINAL_TARGET_SCOPE_PARITY
EXCLUDED_CORRECTNESS_DEFECT_STILL_IN_PRODUCTION_COUNT
UNVERIFIED_SCOPE_WITHDRAWAL_COUNT
POST_BASELINE_WITHDRAWAL_REQUEST_COUNT
POST_BASELINE_WITHDRAWAL_REFROZEN_VERIFIED_COUNT
UNVERIFIED_POST_BASELINE_WITHDRAWAL_COUNT
ACTIVE_PRODUCTION_BASELINE_GENERATION
CONTROLLED_BASELINE_RESET_STATUS
CONTROLLED_BASELINE_RESET_EVIDENCE_SHA [if applicable]
WITHDRAWAL_LATCH_CONSUMPTION_EVIDENCE_BUNDLE_SHA [if applicable]
UNCONSUMED_TERMINAL_WITHDRAWAL_LATCH_COUNT
DUPLICATE_WITHDRAWAL_LATCH_CONSUMPTION_COUNT
WITHDRAWAL_EVENT_QUEUE_LEDGER_SHA [if applicable]
WITHDRAWAL_EVENT_QUEUE_LEDGER_INTEGRITY
PENDING_WITHDRAWAL_DURING_RESET_COUNT
DUPLICATE_PENDING_WITHDRAWAL_EVENT_COUNT
DUPLICATE_WITHDRAWAL_QUEUE_DRAIN_COUNT
ORPHAN_WITHDRAWAL_QUEUE_DRAIN_COUNT
UNVERIFIED_DRAINED_WITHDRAWAL_EVENT_COUNT
FAILED_RESET_RETRY_TRIGGER_PARITY
FAILED_RESET_RETRY_BEFORE_QUEUE_DRAIN_PARITY
WITHDRAWAL_QUEUE_FIFO_PARITY
WITHDRAWAL_QUEUE_PROVENANCE_PARITY
WITHDRAWAL_QUEUE_DRAIN_TO_RESET_PARITY
NESTED_CONTROLLED_BASELINE_RESET_COUNT
PRESEAL_ACTIVE_BASELINE_PARITY
STATIC_CONTRACT_PASS_COUNT
STATIC_CONTRACT_FAIL_COUNT
STATIC_CONTRACT_NOT_TESTED_COUNT
STATIC_CONTRACT_COVERAGE_COUNT
STATIC_CONTRACT_COVERAGE_MAP_SHA
RELEASE_CONTENT_READY
commonProtocolVersion
commonProtocolSha
unitOverlayVersion
unitOverlaySha
effectiveRulesetSha
curriculumMasterBundleSha
hashCanonicalizationSpecVersion
hashCanonicalizationSpecSha
protocolContractRegistrySha
PROTOCOL_REGRESSION_BASELINE_STATUS
PROTOCOL_REGRESSION_BASELINE_SHA
PROTOCOL_REGRESSION_BASELINE_CONTRACT_REGISTRY_SHA
CANDIDATE_PROTOCOL_CONTRACT_REGISTRY_SHA
PROTOCOL_REGRESSION_EVIDENCE_SHA
BOOTSTRAP_ADOPTION_APPROVAL_EVIDENCE_SHA [if bootstrap]
A_BLIND_COVERAGE_MAP_SHA
A_COMPARISON_COVERAGE_MAP_SHA
B_COVERAGE_MAP_SHA
C_REQUIRED_COVERAGE_MAP_SHA
D_RENDER_CASE_COVERAGE_MAP_SHA
SOURCE_RESOLUTION_LEDGER_SHA
manifestSha
projectConfigSha
renderRuntimeFingerprintSha
POST_PROMOTION_RENDER_WITNESS_MANIFEST_SHA
POST_PROMOTION_RENDER_RUNTIME_FINGERPRINT_SHA
PROJECT_ATTEMPT_ID
PREVIOUS_PROJECT_ATTEMPT_ID
PREVIOUS_SEALED_SEAL_BUNDLE_SHA [if reopened]
PREVIOUS_SEALED_FINAL_RELEASE_ARTIFACT_SHA [if reopened]
REOPEN_REASON [if reopened]
reopenFromSealedWrapperState [if reopened]
REOPEN_POLICY_GATE
REOPEN_TRIGGER_PARITY
REOPEN_HISTORICAL_ARTIFACT_PARITY
REOPEN_ATTEMPT_EVIDENCE_SHA [if reopened]
REOPEN_FROM_PROMOTION_TRANSACTION_ID [if reopened]
REOPEN_FROM_PROMOTION_FINALIZATION_EVIDENCE_SHA [if reopened]
REOPEN_LINEAGE_PARITY
PROJECT_ATTEMPT_LINEAGE_PARITY
PROMOTION_TRANSACTION_CONTEXT
ACTIVE_PROMOTION_TRANSACTION_ID
NEW_PROMOTION_TRANSACTION_INITIALIZED
PROMOTION_TRANSACTION_INIT_EVIDENCE_SHA
PREVIOUS_PROMOTION_TERMINAL_EVIDENCE_PARITY
PROMOTION_TRANSACTION_CHAIN_PARITY
PROMOTION_TRANSACTION_ID_PARITY
PROMOTION_TRANSACTION_FINALIZATION_STATUS
WITHDRAWAL_REQUEST_LATCHED
PRODUCTION_MUTATED
FURTHER_PRODUCTION_MUTATION
MOTHER_FINAL_REVIEW_EVIDENCE_SHA
PROMOTION_FINALIZATION_EVIDENCE_SHA
FINALIZATION_ROLLBACK_EVIDENCE_SHA [if rollback]
finalGitHeadSha
finalGitParityStatus
globalCiStatus
rollbackPlanSha
rollbackVerificationSha
legacyPlanCompatibilityStatus
```

---

# 44. 필수 산출물 이름 규칙

프로젝트 prefix를 사용한다.

권장:

```text
{project}_inventory.json/csv
{project}_reverse_scan.json/csv
{project}_manifest.json
{project}_quality_triage.json/csv
{project}_pedagogy_upgrade_ledger.json/csv
{project}_visual_fact_ledger.json
{project}_visual_contract.json/md
{project}_computational_math_evidence.json
{project}_review_A_blind.json/md
{project}_review_A_comparison.json/md
{project}_review_B_pedagogy.json/md
{project}_review_C_visual.json/md
{project}_render_case_manifest.json
{project}_review_D_runtime.json/md
{project}_render_witness_manifest.json
{project}_repair_ledger.json/csv
{project}_evidence_ledger.ndjson/json
{project}_review_evidence_sha.json
{project}_preseal_bundle.json
{project}_promotion_evidence.json
{project}_final_report.md
{project}_seal_bundle.json
```

함수형 visual 프로젝트는 필요 시:

```text
{project}_dense_sampling_audit.json/md
```

추가.

---

# 45. 작업 상태 모델

문항/프로젝트 상태는 필요한 수준에서 분리한다.

대표 project flow:

```text
INVENTORY
→ MANIFEST_FROZEN
→ STAGING_READY
→ PILOT_VERIFYING
→ PILOT_PASS
→ BUILDING
→ BUILD_COMPLETE
→ ARTIFACT_FROZEN
→ VERIFYING_A
→ VERIFYING_B
→ VERIFYING_C
→ VERIFYING_D
→ MOTHER_PRESEAL
→ NEW_PROMOTION_TRANSACTION
→ PROMOTING
→ PRODUCTION_PARITY
→ PROMOTED_PENDING_FINAL_SEAL
→ FINAL_REVIEW
→ SEALED
```

sealed attempt 이후 재작업은 기존 flow를 역전하지 않는다.

```text
SEALED previous attempt
→ REOPEN_POLICY_GATE
→ NEW PROJECT_ATTEMPT_ID + REOPEN_ATTEMPT_EVIDENCE
→ impacted phase에서 새 attempt 시작
→ NEW_PROMOTION_TRANSACTION은 §36.7.1 sealed-reopen branch로만 생성
```

실패/보류:

```text
REPAIR_REQUIRED
SOURCE_BLOCKED
METADATA_REVIEW_REQUIRED
ENVIRONMENT_CHANGED
SCOPE_VIOLATION
EVIDENCE_STALE
REVIEW_CONFLICT
PRODUCTION_BASELINE_DRIFT
BASELINE_RESET_REQUIRED
BASELINE_RESETTING
BASELINE_RESET_FAILED
PROMOTION_FAILED
```

`FAIL → SEALED` 직접 전환 금지.

---

# 46. 고2·고3 적용 규칙

본 Core는 고1 전용이 아니다.

학년/과목별 차이는 Overlay에서 정의한다.

예:

## 46.1 고2 확률과 통계

Pedagogy/Math profile 후보:

- 경우 누락
- 중복 counting
- 순서 고려 여부
- 같은 것이 있는 순열의 중복계수
- 조합 선택 근거
- 표본공간
- 사건 정의
- 조건부확률의 조건 사건
- 이항정리 항 번호/계수

Visual은 표/트리/도식이 실제 이해를 돕는 경우만.

## 46.2 고2/고3 미적분

- 정의역/연속/극한 조건
- 미분 가능성
- 증감/극값 근거
- 접선 조건
- 적분 구간/부호
- 넓이와 정적분 구분
- 그래프 sampling/특수점

미분·적분은 해당 Overlay curriculum에서 정상 허용.

## 46.3 대수

- 지수/로그 정의역
- 밑 조건
- 삼각함수 주기
- 해의 범위
- 그래프 이동/대칭
- 방정식/부등식 branch

## 46.4 기하

- 이차곡선 정의
- 초점/준선
- 벡터 조건
- 내적
- 공간 관계
- metric/scale policy

각 단원의 실제 profile은 별도 Overlay로 작성한다.

---

# 47. NON-NORMATIVE 단원 Profile 예시

이 절은 실행 규칙이 아니다.

## 47.1 도형의 방정식 예시

강조:

```text
좌표/거리/원/직선/이동
EQUAL_SCALE_REQUIRED 적극 사용
Python geometry facts
교점/접점/중심/반지름
```

## 47.2 함수·유리·무리함수 예시

강조:

```text
domain/range
inverse relation
asymptote
endpoint
intersection
piecewise branch
dense + adaptive sampling
```

## 47.3 집합 예시

강조:

```text
원소/부분집합
집합 연산
조건제시법
진리집합 연결
Venn diagram은 실제 이득이 있을 때만
```

## 47.4 명제 예시

Visual보다 논리 방향과 reasoning edge를 우선한다.

실제 명제 Overlay에서는 다음 claim map을 HARD로 둘 수 있다.

```text
assumptionClaim
conclusionClaim
implicationDirectionClaim
necessarySufficientClaim
negationScopeClaim
quantifierNegationClaim
counterexampleValidityClaim
contrapositiveClaim
contradictionTargetClaim
truthSetTranslationClaim
```

적용 불필요는 `NOT_APPLICABLE`로 명시한다.

반례:

```text
ASSUMPTION_SATISFIED == true
CONCLUSION_FALSE == true
```

필요/충분:

```text
p sufficient for q  <=> p → q <=> P ⊆ Q
p necessary for q   <=> q → p <=> Q ⊆ P
```

문장·논리기호·진리집합 중 최소 2개 표현으로 교차 확인하도록 Overlay가 요구할 수 있다.

양화사 부정:

```text
∀x P(x) 의 부정 = ∃x ¬P(x)
∃x P(x) 의 부정 = ∀x ¬P(x)
```

양화사와 predicate 부정을 모두 확인한다.

대우:

- 원명제 방향
- 대우 방향
- 동치 근거
- 실제 조건 변환

귀류:

- 무엇을 반대로 가정했는지
- 어느 지점에서 모순인지
- 모순이 원결론을 어떻게 확정하는지

를 명시한다.

명제 Visual 후보:

```text
TRUTH_SET_VENN
TRUTH_SET_NUMBER_LINE
IMPLICATION_FLOW
PROOF_FLOW
CASE_TABLE
TRUTH_TABLE
```

시각자료 수를 KPI로 사용하지 않는다.

---

# 48. 프로젝트 전체 실행 흐름

```text
PHASE 0
COMMON CORE / Overlay / curriculum / project config freeze
→ OVERLAY_VALIDATION_GATE
→ PROTOCOL_REGRESSION_GATE
→ EFFECTIVE_RULESET_SHA

PHASE 1
forward inventory
+
reverse scan
+
dependency closure

PHASE 2
manifest freeze
+
production baseline READ ONLY
+
staging baseline

EVENT — baseline freeze 이후 production withdrawal 발생 시

[A] PRESEAL 완료 전, OPEN promotion transaction 없음
→ PROMOTION_TRANSACTION_CONTEXT == NO_TRANSACTION 또는 nonsealed TERMINAL{FINALIZED_ABORTED_NO_MUTATION, FINALIZED_ROLLED_BACK}
→ unconsumed terminal withdrawal latch가 없을 때 CONTROLLED_BASELINE_RESET_REQUIRED
→ §5.1.2 transaction 실행

[B] PRESEAL 완료 후, OPEN promotion transaction 없음
→ current PRESEAL_BUNDLE_SHA / eligibility 무효화
→ PROMOTION_TRANSACTION_CONTEXT == NO_TRANSACTION 또는 nonsealed TERMINAL{FINALIZED_ABORTED_NO_MUTATION, FINALIZED_ROLLED_BACK}
→ unconsumed terminal withdrawal latch가 없을 때 CONTROLLED_BASELINE_RESET_REQUIRED
→ §5.1.2 transaction 실행
→ 새 baseline에서 PRESEAL부터 다시 수행

[C0] PROMOTION_TRANSACTION_CONTEXT == OPEN_TRANSACTION
     AND PROMOTION_TRANSACTION_FINALIZATION_STATUS == NOT_STARTED
→ withdrawal request latch
→ production mutation 시작 금지
→ FINALIZED_ABORTED_NO_MUTATION + PROMOTION_ABORT_EVIDENCE_SHA
→ 새 CONTROLLED_BASELINE_RESET_TRANSACTION 시작

[C1] PROMOTION_TRANSACTION_FINALIZATION_STATUS == PROMOTING
     AND PRODUCTION_MUTATED == false
→ withdrawal request latch
→ 새 production mutation 금지
→ promotion abort without mutation
→ PROMOTION_TRANSACTION_FINALIZATION_STATUS = FINALIZED_ABORTED_NO_MUTATION
→ PROMOTION_ABORT_EVIDENCE_SHA 생성
→ 새 CONTROLLED_BASELINE_RESET_TRANSACTION 시작

[C2] PROMOTION_TRANSACTION_FINALIZATION_STATUS == PROMOTING
     AND PRODUCTION_MUTATED == true
→ withdrawal request latch / direct withdrawal 금지
→ mandatory promotion rollback + verification
→ PROMOTION_TRANSACTION_FINALIZATION_STATUS = FINALIZED_ROLLED_BACK
→ rollback 완료 후에만 새 CONTROLLED_BASELINE_RESET_TRANSACTION 시작

[D] PRODUCTION_MUTATED == true
    AND PROMOTION_TRANSACTION_FINALIZATION_STATUS == PROMOTED_PENDING_FINAL_SEAL
→ direct withdrawal 금지
→ POST_PROMOTION_WITHDRAWAL_ABORT
→ mandatory promotion rollback + verification
→ PROMOTION_TRANSACTION_FINALIZATION_STATUS = FINALIZED_ROLLED_BACK
→ rollback 완료 후에만 새 CONTROLLED_BASELINE_RESET_TRANSACTION 시작

[E] PROMOTION_TRANSACTION_FINALIZATION_STATUS == FINALIZATION_FAILED_ROLLBACK_REQUIRED
→ withdrawal request는 latch만 유지
→ 현재 rollback을 완료
→ FINALIZED_ROLLED_BACK 이후 새 CONTROLLED_BASELINE_RESET_TRANSACTION 시작

§5.1.2 reset ordering:
→ withdrawal + production absence verification
→ 새 production baseline generation 재동결
→ INVALIDATED_EVIDENCE_SET_SHA 확정
→ 새 baseline 기준 PRODUCTION_BASELINE_DRIFT == 0 / REFREEZE_VERIFICATION_SHA 확인
→ CONTROLLED_BASELINE_RESET_STATUS = REFROZEN_VERIFIED
→ 그 final status를 포함한 CONTROLLED_BASELINE_RESET_EVIDENCE_SHA 생성
→ promotion-latched withdrawal이면 WITHDRAWAL_LATCH_CONSUMPTION_EVIDENCE_SHA 생성
→ SCOPE_WITHDRAWAL_EVIDENCE_SHA 확정
→ finalScopeDisposition 반영 MANIFEST_SHA / PROJECT_STAGING_BASELINE_SHA 재생성
→ INITIAL_INCLUDED_SCOPE_UID_SET(_SHA)는 원값 유지
→ Repair Invalidation Matrix에 따라 영향 evidence/coverage 재평가
→ reset verification FAIL이면 FAILED 상태 유지; 새 distinct withdrawal은 queue에만 적재
→ failed original trigger는 새 transaction에서 exact-trigger retry 후 성공해야 queued event drain 가능
→ every drain append 시 `UNRESOLVED_FAILED_RESET_LINEAGE_COUNT_AT(position) == 0`을 재계산하여 `FAILED_RESET_RETRY_BEFORE_QUEUE_DRAIN_PARITY` 검증
→ every drain은 당시 undrained queue의 최소 sequence만 소비하여 `WITHDRAWAL_QUEUE_FIFO_PARITY` 검증
→ queue intake `observedDuringResetTransactionId`와 drain authorization `drainAuthorizedAfterResetTransactionId/evidenceSha`를 `WITHDRAWAL_QUEUE_PROVENANCE_PARITY`로 분리 검증
→ drained event는 WITHDRAWAL_QUEUE_DRAIN_TO_RESET_PARITY로 exact reset/retry lineage의 REFROZEN_VERIFIED 소비까지 검증
→ ORPHAN_WITHDRAWAL_QUEUE_DRAIN_COUNT == 0 / UNVERIFIED_DRAINED_WITHDRAWAL_EVENT_COUNT == 0 확인
→ 정상 pipeline 재진입

PHASE 3
전수 quality triage
SOURCE / pedagogy disposition / visual requirement

PHASE 4
Pilot System Gate

PHASE 5
5문항 batch production
→ 필요한 solution만 수정
→ 필요한 visual만 생성/수정
→ Builder self-check
→ static contract

PHASE 6
Build complete
→ STATIC_CONTRACT_PASS_COUNT == FINAL_TARGET_COUNT 확인
→ STATIC_CONTRACT_FAIL_COUNT == 0
→ STATIC_CONTRACT_NOT_TESTED_COUNT == 0
→ STATIC_CONTRACT_COVERAGE_COUNT == FINAL_TARGET_COUNT 확인
→ STATIC_CONTRACT_COVERAGE_MAP_SHA 생성
→ candidate release freeze S0
→ 현재 readiness 재계산

주의: 이 시점에는 아직 A/B/C 독립검수가 시작되지 않았으므로 `RELEASE_CONTENT_READY == false` 또는 NOT_READY가 정상일 수 있다. PHASE 6에서 요구하는 것은 Static closure이며, 최종 `RELEASE_CONTENT_READY == true`는 A/B/C와 Source/Pedagogy/Visual closure가 모두 끝난 final candidate에서 §40이 HARD로 요구한다.

PHASE 7
A1 blind solve 전수
→ first-pass evidence freeze
→ A2 comparison 전수
→ computational companion applicable cases
→ conflicts adjudicate/repair

PHASE 8
B pedagogy 전수
→ pedagogy PASS
→ student reproducible PASS
→ curriculum PASS

PHASE 9
C visual required closure 전수
→ static + independent visual math

PHASE 10
D staging REAL RENDER 전수
→ runtime/load/mathjax/font/image
→ count/association parity
→ layout/presentation
→ render witnesses

FAIL
→ pinpoint repair
→ invalidation matrix
→ impacted staticContractStatus 무효화/재평가
→ static recheck 또는 hash-preserved carry-forward 검증
→ STATIC_CONTRACT_* counts / coverage map 재생성
→ RELEASE_CONTENT_READY 재계산
→ new candidate SHA
→ impacted A/B/C/D axes 재검

PHASE 11
모든 applicable A/B/C/D가 동일 FINAL_RELEASE_ARTIFACT_SHA에 PASS
→ REVIEW_EVIDENCE_SHA
→ PRESEAL_BUNDLE_SHA
→ Mother Preseal

PHASE 12
Atomic production promotion
→ production artifact parity
→ protected/out-of-scope parity
→ post-promotion REAL RENDER

FAIL
→ PROMOTION_TRANSACTION_FINALIZATION_STATUS = FINALIZATION_FAILED_ROLLBACK_REQUIRED
→ mandatory rollback + verification
→ PASS 시 FINALIZED_ROLLED_BACK → repair required
→ rollback verification FAIL이면 ROLLBACK_REQUIRED 상태 유지 / Final Seal·reset·새 promotion 금지

PASS
→ PROMOTION_EVIDENCE_SHA
→ PROMOTED_PENDING_FINAL_SEAL

PHASE 13
Final Git parity
→ SEAL_BUNDLE_SHA
→ Mother Final Review

FAIL
→ POST_PROMOTION_FINALIZATION_FAIL
→ mandatory rollback
→ rollback verification
→ REPAIR_REQUIRED

PASS
→ promotion transaction FINALIZED_SEALED
→ SEALED
```

---

# 49. 절대 금지

- 예상 문항 수를 final target으로 고정
- metadata 정방향 검색만으로 scope 확정
- dependency 무시
- 전 문항 solution 무조건 재작성
- 좋은 해설을 문체 통일 목적으로 재작성
- 모든 문항에 억지 SVG
- Builder SELF_CHECK를 독립 PASS로 사용
- static regex를 independent math로 명명
- `따라서` 존재를 logic-jump 해소로 간주
- answer 문자열 일치를 실제 정답 검산으로 간주
- A1 전에 source answer/solution 노출
- first-pass evidence를 사후 수정
- review conflict를 다수결 처리
- source defect를 math PASS에 섞어 숨김
- correctness-affecting source defect를 `EXCEPTION_APPROVED`만으로 SOURCE_READY 처리
- baseline freeze 이후 controlled reset transaction 밖에서 production withdrawal 실행
- withdrawal 후 `INITIAL_INCLUDED_SCOPE_UID_SET(_SHA)` 재계산/덮어쓰기
- post-baseline withdrawal 이후 기존 PRESEAL bundle을 새 baseline에 carry-forward
- 미승인 protected repair
- 손입력 sparse nonlinear curve
- 정의역/점근선 가로질러 curve 연결
- 좌표/그래프 눈대중 생성
- sample count만 충족하고 식/정의역 검증 생략
- `naturalWidth > 0`만으로 REAL RENDER PASS
- DOM load PASS를 layout PASS로 간주
- C visual math와 D presentation을 같은 status로 처리
- 검수 중 artifact 변경 후 이전 PASS 자동 유지
- input hash가 달라졌는데 evidence carry-forward
- 서로 다른 release SHA의 PASS를 합쳐 final seal
- evidence report overwrite
- canonical hash를 위해 실제 파일 bytes를 몰래 normalize
- self-referential bundle hash
- production에 반완성 batch 누적
- rollback path 없이 promotion
- post-promotion FAIL 상태를 production에 남김
- `PROMOTING` 중 withdrawal event를 무시하거나, event latch 후 새 production mutation 시작
- `PROMOTING` 중 이미 production mutation이 발생했는데 rollback 없이 controlled reset 시작
- `PROMOTED_PENDING_FINAL_SEAL`에서 finalization 실패 후 rollback 없이 production 유지
- Mother verdict/finalization transition을 append-only evidence 없이 완료 처리
- dirty worktree/모호한 Git ref에서 final seal
- correctness-affecting defect 문항을 단순 승인으로 target denominator에서 제외
- production에 살아 있는 correctness defect를 scope exclusion로 숨김
- artifact-changing repair 후 impacted static contract를 재계산하지 않고 PRESEAL 진행
- `RELEASE_CONTENT_READY == false`인데 Final Seal 진행
- 미해결 FAIL/NOT_TESTED/CONFLICT가 있는데 FINAL/COMPLETE/SEALED 표현

---

# 50. 최종 보고 형식

```text
FINAL VERDICT:
FINAL_SEAL_ELIGIBLE:
FINAL STATUS TOKEN:

Scope
- target exams:
- target questions:
- reverse-scan additions:
- dependency groups:
- initial included scope UID count:
- INITIAL_INCLUDED_SCOPE_UID_SET_SHA:
- FINAL_TARGET_UID_SET_SHA:
- out-of-scope confirmed count:
- scope withdrawn verified count:
- withdrawn UIDs / reasons:
- final scope disposition invalid count:
- FINAL_TARGET_SCOPE_PARITY:
- unverified scope withdrawal:
- post-baseline withdrawal request count:
- post-baseline withdrawal refrozen verified count:
- unverified post-baseline withdrawal:
- ACTIVE_PRODUCTION_BASELINE_GENERATION:
- CONTROLLED_BASELINE_RESET_STATUS:
- CONTROLLED_BASELINE_RESET_EVIDENCE_SHA [if applicable]:
- WITHDRAWAL_LATCH_CONSUMPTION_EVIDENCE_BUNDLE_SHA [if applicable]:
- unconsumed terminal withdrawal latch count:
- duplicate withdrawal latch consumption count:
- excluded correctness defect still active in production:
- FINAL_SCOPE_DISPOSITION_MAP_SHA:
- SCOPE_WITHDRAWAL_EVIDENCE_BUNDLE_SHA:
- scope withdrawal evidence parity:

Static Contract
- RELEASE_CONTENT_READY:
- static PASS: n / target
- static FAIL:
- static NOT_TESTED:
- static coverage: n / target
- STATIC_CONTRACT_COVERAGE_MAP_SHA:

Source
- SOURCE_READY: n / target
- unresolved source defect:
- correctness-affecting unrepaired defect:
- non-sealable correctness exception:
- correctness impact not adjudicated:
- approved repair:
- sealable non-correctness exception:
- source repair ledger parity:
- source exception ledger parity:
- SOURCE_RESOLUTION_LEDGER_SHA:

Math
- A1 blind coverage: n / target
- A2 comparison coverage: n / target
- independent math PASS: n / target
- computational complete verification:
- unresolved math/review conflict:

Pedagogy
- disposition KEEP/EXPAND/REWRITE:
- B review PASS: n / target
- STUDENT_REPRODUCIBLE PASS: n / target
- curriculum PASS: n / target

Visual
- VISUAL_REQUIRED:
- VISUAL_OPTIONAL:
- VISUAL_EXEMPT:
- actual attached visual:
- C required closure: n / FINAL_C_REQUIRED_COUNT
- C status: PASS / PASS_NOT_APPLICABLE / FAIL
- static visual contract:

Runtime
- D render cases: n / FINAL_RENDER_CASE_COUNT
- runtime load:
- MathJax:
- font:
- image decode:
- question count parity:
- asset association parity:
- layout:
- rendered visual presentation:
- render witness coverage:

Protection
- unapproved protected mutation:
- out-of-scope mutation:

Evidence
- evidence ledger integrity:
- PROTOCOL_REGRESSION_BASELINE_STATUS:
- PROTOCOL_REGRESSION_BASELINE_SHA:
- PROTOCOL_REGRESSION_BASELINE_CONTRACT_REGISTRY_SHA:
- CANDIDATE_PROTOCOL_CONTRACT_REGISTRY_SHA:
- PROTOCOL_REGRESSION_EVIDENCE_SHA:
- BOOTSTRAP_ADOPTION_APPROVAL_EVIDENCE_SHA [if applicable]:
- INITIAL_INCLUDED_SCOPE_UID_SET_SHA:
- FINAL_TARGET_UID_SET_SHA:
- FINAL_SCOPE_DISPOSITION_MAP_SHA:
- SCOPE_WITHDRAWAL_EVIDENCE_BUNDLE_SHA:
- CONTROLLED_BASELINE_RESET_EVIDENCE_SHA [if applicable]:
- WITHDRAWAL_LATCH_CONSUMPTION_EVIDENCE_BUNDLE_SHA [if applicable]:
- WITHDRAWAL_EVENT_QUEUE_LEDGER_SHA [if applicable]:
- WITHDRAWAL_EVENT_QUEUE_LEDGER_INTEGRITY:
- FAILED_RESET_RETRY_TRIGGER_PARITY:
- FAILED_RESET_RETRY_BEFORE_QUEUE_DRAIN_PARITY:
- WITHDRAWAL_QUEUE_FIFO_PARITY:
- WITHDRAWAL_QUEUE_PROVENANCE_PARITY:
- WITHDRAWAL_QUEUE_DRAIN_TO_RESET_PARITY:
- ORPHAN_WITHDRAWAL_QUEUE_DRAIN_COUNT:
- UNVERIFIED_DRAINED_WITHDRAWAL_EVENT_COUNT:
- PENDING_WITHDRAWAL_DURING_RESET_COUNT:
- DUPLICATE_PENDING_WITHDRAWAL_EVENT_COUNT:
- DUPLICATE_WITHDRAWAL_QUEUE_DRAIN_COUNT:
- NESTED_CONTROLLED_BASELINE_RESET_COUNT:
- STATIC_CONTRACT_COVERAGE_MAP_SHA:
- A_BLIND_COVERAGE_MAP_SHA:
- A_COMPARISON_COVERAGE_MAP_SHA:
- B_COVERAGE_MAP_SHA:
- C_REQUIRED_COVERAGE_MAP_SHA:
- D_RENDER_CASE_COVERAGE_MAP_SHA:
- EFFECTIVE_RULESET_SHA:
- HASH_CANONICALIZATION_SPEC_SHA:
- FINAL_RELEASE_ARTIFACT_SHA:
- REVIEW_EVIDENCE_SHA:
- PRESEAL_BUNDLE_SHA:
- PRESEAL_ACTIVE_BASELINE_PARITY:

Promotion / Reopen
- PROJECT_ATTEMPT_ID:
- PREVIOUS_PROJECT_ATTEMPT_ID:
- PREVIOUS_SEALED_SEAL_BUNDLE_SHA [if applicable]:
- PREVIOUS_SEALED_FINAL_RELEASE_ARTIFACT_SHA [if applicable]:
- REOPEN_REASON [if applicable]:
- reopenFromSealedWrapperState [if applicable]:
- REOPEN_POLICY_GATE:
- REOPEN_TRIGGER_PARITY:
- REOPEN_HISTORICAL_ARTIFACT_PARITY:
- REOPEN_ATTEMPT_EVIDENCE_SHA [if applicable]:
- REOPEN_LINEAGE_PARITY:
- PROJECT_ATTEMPT_LINEAGE_PARITY:
- active production baseline generation:
- controlled baseline reset status:
- promotion status:
- PROMOTION_TRANSACTION_CONTEXT:
- active promotion transaction id:
- PREVIOUS_PROMOTION_TERMINAL_EVIDENCE_PARITY:
- PROMOTION_TRANSACTION_CHAIN_PARITY:
- PROMOTION_TRANSACTION_ID_PARITY:
- promotion transaction finalization status:
- production release SHA parity:
- production parity:
- post-promotion render:
- post-promotion render witness coverage:
- post-promotion render witness manifest SHA:
- post-promotion runtime fingerprint SHA:
- rollback path valid:
- rollback executed if required:
- rollback verification:
- PROMOTION_ABORT_EVIDENCE_SHA [if applicable]:
- FINALIZATION_ROLLBACK_EVIDENCE_SHA [if applicable]:
- PROMOTION_EVIDENCE_SHA:

Git
- HEAD:
- main:
- origin/main:
- FINAL_GIT_PARITY_PASS:
- worktree clean:
- HEAD_RELEASE_ARTIFACT_SHA:

Seal
- SEAL_BUNDLE_SHA:
- MOTHER_FINAL_REVIEW:
- MOTHER_FINAL_REVIEW_EVIDENCE_SHA:
- PROMOTION_FINALIZATION_EVIDENCE_SHA:
- final promotion transaction status:

Global CI
- GLOBAL_CI_STATUS:

Residual FAIL
- NONE
or
- exact exam / q / asset / failure code / evidence ref
```

최종 조건을 모두 만족한 경우에만 Overlay의 `finalSealName`을 출력한다.

---

# 51. 채택 및 마이그레이션 원칙

## 51.1 기존 봉인 프로젝트

본 Core는 과거 도형/함수 프로젝트의 역사적 evidence를 자동 무효화하지 않는다.

재봉인이 필요할 때:

```text
기존 artifact 보존
→ legacy compatibility 판정
→ 새 Core에서 추가된 gate만 필요한 범위로 수행
→ 새 version evidence/seal 생성
```

과거 report를 덮어쓰지 않는다.

## 51.2 신규 프로젝트

신규 전수 업그레이드는:

```text
COMMON_PROTOCOL_v1.2.10 + UNIT_OVERLAY
```

를 기본 실행 구조로 사용한다.

## 51.3 실제 tooling 구현과 문서 채택은 별개

```text
CANONICAL_PROTOCOL_READY
```

는 계약이 준비되었다는 뜻이다.

모든 verifier/generator/tooling이 이미 구현되었다는 뜻은 아니다.

프로젝트 시작 전에 필요한 tooling coverage를 Pilot에서 확인한다.

---

# 52. 한 줄 운영 정의

> **JS아카이브 전수 품질 업그레이드는 전체 scope를 먼저 동결하고 모든 문항을 blind 독립 수학검산과 학생 재현 가능성 검수에 통과시키되 필요한 부분만 수정하며, 시각자료는 수학 fact에서 결정적으로 생성·검증하고 실제 브라우저 표현까지 별도 검수한 뒤, correctness-affecting source defect를 미수리 exception으로 봉인하지 않고 append-only evidence와 동일 final artifact SHA를 기준으로 preseal·원자적 production 승격·post-promotion 실렌더 witness·Git parity·Mother Final Review를 모두 통과하여 promotion transaction이 최종 종료된 경우에만 봉인한다.**
