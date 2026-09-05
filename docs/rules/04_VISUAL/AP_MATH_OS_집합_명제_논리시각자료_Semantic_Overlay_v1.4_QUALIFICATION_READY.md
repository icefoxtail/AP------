# AP MATH OS — 집합·명제 논리 시각자료 Semantic Overlay v1.4
## 제작·독립검수·Common Core C축 결박 규정

- 작성일: 2026-09-05
- 상태: `QUALIFICATION_READY`
- 대상 저장소: `icefoxtail/AP------`
- 기준 Common Core: `docs/rules/02_PIPELINES/COMMON_PROTOCOL_v1.2.10.md`
- 공통 VISUAL 기준: `docs/rules/04_VISUAL/도형추출.md` v3.0
- 적용 단원:
  - 2015 개정 `H15-SB-01` — 집합
  - 2015 개정 `H15-SB-02` — 명제
  - 2022 개정 공통수학2 집합·명제 대응 단원
- 적용 대상:
  - `solutionImage`
  - 검증된 inline SVG
  - 수학 의미를 갖는 HTML/table
  - solution이 실제로 의존하는 problem/shared visual
- 역할:
  - **Common Core의 VISUAL(C) 축을 집합·명제에 맞게 구체화하는 Overlay**
  - 독자적인 release/seal 프로토콜이 아님
- v1.4 최종 문서 closure:
  - C semantic gate와 D real-render gate를 완전 분리
  - C denominator input SHA + invalidation/re-freeze 계약 추가
  - qualification bundle에 `EFFECTIVE_RULESET_SHA` 및 calibration/projection/routing inputs 결박
  - `SEMANTIC_PROJECTION_SPEC_SHA`를 visualType별 필수 projection schema로 고정
  - shared reuse 판정을 `EXPECTED_SEMANTIC_SHA` 기준으로 수정
  - Overlay denominator/count/coverage formal predicate 완성
  - 중복 `# 1` 섹션을 `# 1-A / # 1-B`로 정리
  - 문서 상태를 `QUALIFICATION_READY`로 동결

---

# 0. Authority · Scope · Core Binding

## 0.1 상위 규칙

본 문서는 Common Core를 대체하지 않는다.

우선순위:

```text
COMMON_PROTOCOL_v1.2.10
> JS아카이브 canonical / curriculum rules
> 도형추출.md v3.0 공통 VISUAL contract
> 본 집합·명제 Logic Visual Overlay
> project-local implementation detail
```

본 Overlay는 Common Core의 HARD gate, independence, coverage, release SHA,
review evidence, PRESEAL / Final Seal 조건을 약화하거나 별도 상태체계로 대체할 수 없다.

```text
OVERLAY_MAY_STRENGTHEN_CORE = true
OVERLAY_MAY_WEAKEN_CORE = false
```

## 0.2 본 규정 단독 PASS의 권한

```text
LOGIC_VISUAL_OVERLAY_GATE == PASS
```

는 **Common Core C — Visual Math / Semantic review의 필요조건**일 뿐이다.

다음을 의미하지 않는다.

```text
LOGIC_VISUAL_OVERLAY_GATE == PASS
!= C_REVIEW_PASS 자동 부여
!= QUESTION_READY
!= RELEASE_CONTENT_READY
!= MOTHER_PRESEAL_PASS
!= FINAL_SEAL
```

명시적 불변식:

```text
THIS_OVERLAY_ALONE_HAS_NO_RELEASE_AUTHORITY = true
```

## 0.3 Common Core 상태축 그대로 사용

본 규정은 v1.0의 합성 `reviewStatus`를 폐기한다.

Common Core의 직교축을 그대로 사용한다.

### Pedagogy

```text
pedagogyDisposition =
  KEEP
  EXPAND
  REWRITE
  BLOCKED_BY_SOURCE
```

### Visual Requirement

```text
visualRequirement =
  VISUAL_REQUIRED
  VISUAL_OPTIONAL
  VISUAL_EXEMPT
```

### Visual Action

```text
visualAction =
  NONE
  USE_PROBLEM_IMAGE
  KEEP_EXISTING_SOLUTION_VISUAL
  ADD
  REBUILD
  REMOVE_INVALID_VISUAL
```

### Visual Review Status

```text
visualMathReviewStatus =
  NOT_REVIEWED
  PASS
  FAIL
  BLOCKED
  NOT_APPLICABLE

visualStaticContractStatus =
  NOT_TESTED
  PASS
  FAIL
  BLOCKED
  NOT_APPLICABLE
```

Pedagogy와 Visual을 하나의 상태로 합치지 않는다.

## 0.4 Rule Routing Preflight

visual 작업 시작 전 최소 다음 규칙을 읽고 실제 working-tree bytes/hash를 동결한다.

1. `docs/rules/00_RULES_INDEX.md`
2. `docs/rules/01_CANONICAL/JS아카이브룰북_v2.6.md`
3. `docs/rules/02_PIPELINES/COMMON_PROTOCOL_v1.2.10.md`
4. `docs/rules/04_VISUAL/도형추출.md` v3.0
5. 본 Overlay
6. 해당 unit/project pipeline
7. curriculum master / subUnit rules

다음이면 작업 시작 금지:

```text
RULE_ROUTING_BLOCKED
- mandatory rule missing
- manifest entry missing
- declared version mismatch
- working-tree bytes/hash drift
- applicable curriculum overlay unreadable
```

### appliedRuleRefs — Evidence 강제 필드

모든 Logic Visual review run evidence에는 다음을 반드시 넣는다.

```json
"appliedRuleRefs": [
  {
    "path": "docs/rules/02_PIPELINES/COMMON_PROTOCOL_v1.2.10.md",
    "declaredVersion": "v1.2.10",
    "actualBytes": 0,
    "sha256": "sha256:...",
    "role": "COMMON_CORE",
    "precedenceOrder": 1
  }
]
```

최소 필드:

```text
path
declaredVersion
actualBytes
sha256
role
precedenceOrder
```

`appliedRuleRefs` 누락이면 Overlay evidence 무효.

## 0.5 Candidate Rule Registration Lifecycle

qualification을 실행하려면 Candidate 상태에서도 rule routing이 해석 가능해야 한다.
따라서 정식 ADOPTED 이전에 **qualification-only 등록**을 허용한다.

canonical rule status:

```text
RULE_STATUS =
  CANDIDATE_QUALIFICATION_ONLY
  ADOPTED
  RETIRED
```

Candidate qualification 시작 전:

- `00_RULES_INDEX.md`
- `MANIFEST.md`
- `.codex/skills/apmath-visual-upgrade/SKILL.md`
- 필요한 runtime rule-pack

에 현재 **동일 SHA**를 등록하되 반드시:

```text
ruleStatus = CANDIDATE_QUALIFICATION_ONLY
canonicalForProduction = false
qualificationUseOnly = true
```

로 표시한다.

이 상태에서는:

```text
qualification runs allowed
production canonical authority forbidden
release/seal authority forbidden
```

이다.

Qualification PASS 후 동일 rule artifact SHA를:

```text
CANDIDATE_QUALIFICATION_ONLY
→ ADOPTED
```

로 승격한다.

rule bytes가 바뀌면 기존 candidate registration을 그대로 승격할 수 없다.
새 SHA로 다시 registration하고 qualification을 재실행해야 한다.

따라서 preflight의 `manifest entry missing`은 다음과 같이 해석한다.

```text
qualification run:
  CANDIDATE_QUALIFICATION_ONLY or ADOPTED entry required

production release run:
  ADOPTED entry required
```

이 lifecycle로 candidate qualification과 manifest preflight 사이의 순환을 금지한다.

---

# 1-A. Global Visual Requirement Triage — Denominator Freeze 이전

`visualRequirement`는 Builder가 자기 판단으로 final denominator를 줄이는 입력이 아니다.

모든 `FINAL_TARGET_UID_SET` 문항은 C review requirement 계산 전에 V1 visual triage를 반드시 거친다.

```text
LOGIC_VISUAL_TRIAGE_REQUIRED_UID_SET = FINAL_TARGET_UID_SET
V1_VISUAL_TRIAGE_COVERAGE_COUNT == FINAL_TARGET_COUNT
```

V1 Source-only pass는 §2의 blind contract에 따라 각 문항에 다음을 동결한다.

```text
EXPECTED_VISUAL_REQUIREMENT_SIGNAL =
  SHOULD_BE_REQUIRED
  MAY_BE_OPTIONAL
  SHOULD_BE_EXEMPT
  SOURCE_BLOCKED
```

Builder/final triage의 `visualRequirement`와 비교한다.

```text
VISUAL_REQUIREMENT_CLASSIFICATION_PARITY =
  compare(EXPECTED_VISUAL_REQUIREMENT_SIGNAL, final visualRequirement)
```

canonical compatibility:

```text
SHOULD_BE_REQUIRED
  ↔ VISUAL_REQUIRED only

MAY_BE_OPTIONAL
  ↔ VISUAL_OPTIONAL or VISUAL_REQUIRED

SHOULD_BE_EXEMPT
  ↔ VISUAL_EXEMPT or VISUAL_OPTIONAL

SOURCE_BLOCKED
  ↔ no final visualRequirement adjudication until source resolved
```

불일치하면:

```text
VISUAL_REQUIREMENT_ADJUDICATION_REQUIRED
```

로 보내며 denominator freeze 금지.

adjudication output:

```text
visualRequirementAdjudicationStatus =
  NOT_REQUIRED
  REQUIRED
  IN_PROGRESS
  RESOLVED
  UNRESOLVED

finalVisualRequirement
adjudicationReason
adjudicationEvidenceRef
adjudicatedBy
adjudicatedAt
```

최종 denominator를 계산하기 전에:

```text
V1_VISUAL_TRIAGE_COVERAGE_COUNT == FINAL_TARGET_COUNT
VISUAL_REQUIREMENT_ADJUDICATION_PENDING_COUNT == 0
VISUAL_REQUIREMENT_ADJUDICATION_UNRESOLVED_COUNT == 0
FINAL_VISUAL_REQUIREMENT_MAP_SHA valid
```

이어야 한다.

```text
FINAL_VISUAL_REQUIREMENT_MAP_SHA =
SHA256(canonical {
  questionUid -> finalVisualRequirement + adjudication evidence identity
})
```

이 map이 동결된 뒤에만 `LOGIC_VISUAL_REVIEW_REQUIRED` / Core `C_REVIEW_REQUIRED`를 계산한다.

즉:

```text
visualRequirement classification
→ independent V1 triage parity
→ adjudication closure
→ FINAL_VISUAL_REQUIREMENT_MAP_SHA freeze
→ C denominator freeze
```

순서를 뒤집을 수 없다.

---

# 1-B. Core C Closure — OPTIONAL 우회 차단

Common Core의 C closure를 그대로 사용한다.

```text
ACTUAL_SOLUTION_VISUAL_ATTACHED = true / false
PROBLEM_VISUAL_MATH_DEPENDENCY = true / false
SHARED_VISUAL_MATH_DEPENDENCY = true / false
```

본 Overlay의 canonical review denominator:

```text
LOGIC_VISUAL_REVIEW_REQUIRED =
    visualRequirement == VISUAL_REQUIRED
 OR ACTUAL_SOLUTION_VISUAL_ATTACHED == true
 OR PROBLEM_VISUAL_MATH_DEPENDENCY == true
 OR SHARED_VISUAL_MATH_DEPENDENCY == true
```

그리고:

```text
LOGIC_VISUAL_REVIEW_REQUIRED == C_REVIEW_REQUIRED
```

이어야 한다.

분모 identity도 봉인한다.

```text
LOGIC_VISUAL_REQUIRED_UID_SET =
{ uid in FINAL_TARGET_UID_SET where LOGIC_VISUAL_REVIEW_REQUIRED(uid) == true }

LOGIC_VISUAL_REQUIRED_UID_SET_SHA =
SHA256(canonical sorted LOGIC_VISUAL_REQUIRED_UID_SET)
```

최종 review 후:

```text
LOGIC_VISUAL_REVIEWED_UID_SET_SHA =
SHA256(canonical sorted reviewed logic-visual UIDs)

LOGIC_VISUAL_REVIEWED_UID_SET == LOGIC_VISUAL_REQUIRED_UID_SET
```

이어야 한다.

`100%` count만 같고 UID 구성이 다르면 FAIL.

## 1-B.1 C Denominator Input Freeze / Invalidation

C denominator는 `visualRequirement`만으로 고정하지 않는다.

canonical input:

```text
C_DENOMINATOR_INPUT_SHA =
SHA256(canonical {
  FINAL_VISUAL_REQUIREMENT_MAP_SHA,
  ACTUAL_SOLUTION_VISUAL_ATTACHED_MAP_SHA,
  PROBLEM_VISUAL_MATH_DEPENDENCY_MAP_SHA,
  SHARED_VISUAL_MATH_DEPENDENCY_MAP_SHA,
  CANDIDATE_RELEASE_ARTIFACT_SHA
})
```

분모 freeze 시 반드시 기록:

```text
C_DENOMINATOR_INPUT_SHA
LOGIC_VISUAL_REQUIRED_UID_SET_SHA
CORE_FINAL_C_REQUIRED_UID_SET_SHA
```

이후 다음 중 하나라도 바뀌면 기존 denominator와 C evidence는 즉시 STALE이다.

```text
visualAction == ADD
visualAction == REBUILD
visualAction == REMOVE_INVALID_VISUAL
visualAction == USE_PROBLEM_IMAGE
ACTUAL_SOLUTION_VISUAL_ATTACHED map change
PROBLEM_VISUAL_MATH_DEPENDENCY map change
SHARED_VISUAL_MATH_DEPENDENCY map change
FINAL_VISUAL_REQUIREMENT_MAP_SHA change
CANDIDATE_RELEASE_ARTIFACT_SHA change
```

stale 처리:

```text
C_DENOMINATOR_STATUS = STALE
LOGIC_VISUAL_REQUIRED_UID_SET_SHA = INVALIDATED
LOGIC_VISUAL_REVIEWED_UID_SET_SHA = INVALIDATED
affected C item evidence = INVALIDATED
affected C coverage evidence = INVALIDATED
```

재진입 순서:

```text
recompute dependency maps
→ recompute C_DENOMINATOR_INPUT_SHA
→ recompute LOGIC_VISUAL_REQUIRED_UID_SET
→ assert Overlay/Core C membership parity
→ freeze new denominator
→ rerun missing/stale C item reviews
→ rebuild reviewed UID set/coverage evidence
```

최종 parity:

```text
LOGIC_VISUAL_REQUIRED_UID_SET == CORE_FINAL_C_REQUIRED_UID_SET
```

가 아니면 Overlay Final Gate 불가.

따라서:

```text
visualRequirement == VISUAL_OPTIONAL
AND ACTUAL_SOLUTION_VISUAL_ATTACHED == true
=> Logic Visual independent review REQUIRED
```

기존 SVG가 붙어 있는데 OPTIONAL이라는 이유로 검수 분모에서 제외할 수 없다.

또한:

```text
visualRequirement == VISUAL_EXEMPT
=>
ACTUAL_SOLUTION_VISUAL_ATTACHED == false
AND PROBLEM_VISUAL_MATH_DEPENDENCY == false
AND SHARED_VISUAL_MATH_DEPENDENCY == false
```

이어야 한다.

## 1.1 VISUAL_EXEMPT reason code

모든 EXEMPT에는 사유 코드가 필요하다.

```text
EXEMPT_DIRECT_DEFINITION
EXEMPT_SINGLE_STEP_SYMBOL_CHECK
EXEMPT_TRIVIAL_ENUMERATION
EXEMPT_TEXT_CLEARER_THAN_VISUAL
EXEMPT_VISUAL_WOULD_DUPLICATE_SOLUTION
EXEMPT_NO_STABLE_VISUAL_MODEL
```

사유 없는 EXEMPT는 FAIL.

추가 Overlay invariant:

```text
visualRequirement == VISUAL_REQUIRED
=> REQUIRED_VISUAL_SATISFIER_PRESENT == true
```

파생:

```text
REQUIRED_VISUAL_SATISFIER_MISSING =
count(uid where visualRequirement == VISUAL_REQUIRED
      AND REQUIRED_VISUAL_SATISFIER_PRESENT == false)
```

---


# 2. Blind Independence Contract — V1 / V2 / V3

본 규정에서 `독립 검산`이라는 말은 Builder-side recheck와 Final independent review를 분리한다.

## 2.1 BUILD_SIDE_MATH_RECHECK

Builder는 작업을 위해 기존 answer/solution을 볼 수 있다.

```text
BUILD_SIDE_MATH_RECHECK
```

는 수정 근거일 뿐:

```text
BUILD_SIDE_MATH_RECHECK != A PASS
BUILD_SIDE_MATH_RECHECK != C PASS
```

다.

## 2.2 PASS V1 — SOURCE ONLY / Expected Fact Freeze

V1 reviewer는 source만 본다.

허용:

```text
content
choices
original problem image
shared problem material
curriculum boundary
logic visual review rules
```

금지:

```text
source answer
existing solution
final solution
existing solutionImage
final solutionImage
builder fact model
builder self-check
previous visual verdict
previous final report
declared visual metadata
```

V1 output:

```text
EXPECTED_LOGICAL_FACT
EXPECTED_LOGICAL_FACT_CANONICAL_JSON
EXPECTED_LOGICAL_FACT_SHA
EXPECTED_VISUAL_ROLE
EXPECTED_VISUAL_REQUIREMENT_SIGNAL
V1_FIRST_PASS_EVIDENCE_SHA
```

V1 evidence는 먼저 불변 동결한다.

## 2.3 PASS V2 — ARTIFACT ONLY / Observed Fact Freeze

V2 reviewer는 최종 visual artifact만 본다.

허용:

```text
final SVG/table artifact
rendered visual witness
asset file identity
render environment/profile
visual parsing rules
```

숨김:

```text
EXPECTED_LOGICAL_FACT
source answer
final solution
builder declared fact model
semantic metadata intended answer
previous C verdict
solutionImageAlt
solutionImageCaption
external semantic description
accessibility description carrying intended mathematical meaning
```

V2 rendered witness는 visual artifact 자체의 geometry/style/text labels만 보여 주고,
외부 caption/alt가 실제 관찰 의미를 유도하지 못하게 한다.
alt/caption은 V3/G9에서 다시 공개한다.

V2는 실제 artifact에서만 의미를 추출한다.

output:

```text
OBSERVED_VISUAL_FACT
OBSERVED_VISUAL_FACT_CANONICAL_JSON
OBSERVED_VISUAL_FACT_SHA
OBSERVED_FACT_EXTRACTION_METHOD
V2_FIRST_PASS_EVIDENCE_SHA
```

## 2.4 PASS V3 — PARITY

V1/V2 동결 후에만 비교한다.

raw fact object 전체 SHA를 서로 같다고 요구하지 않는다.
Expected와 Observed는 provenance/extraction metadata가 다를 수 있기 때문이다.

각 visualType별로 공통 수학 의미 필드만 투영한다.

```text
EXPECTED_SEMANTIC_PROJECTION =
projectSemantic(EXPECTED_LOGICAL_FACT)

OBSERVED_SEMANTIC_PROJECTION =
projectSemantic(OBSERVED_VISUAL_FACT)
```

그 뒤:

```text
EXPECTED_SEMANTIC_SHA =
SHA256(canonical(EXPECTED_SEMANTIC_PROJECTION))

OBSERVED_SEMANTIC_SHA =
SHA256(canonical(OBSERVED_SEMANTIC_PROJECTION))

EXPECTED_SEMANTIC_SHA == OBSERVED_SEMANTIC_SHA
```

를 최종 semantic parity로 사용한다.

raw fact SHA는 provenance identity용으로 별도 보존한다.


## 2.4.1 Semantic Projection Specification

`projectSemantic()`은 구현자 재량 함수가 아니다.

```text
SEMANTIC_PROJECTION_SPEC_SHA
```

를 별도 canonical spec으로 동결한다.

visualType별 projection 필수 field 예:

```text
SET_REGION_VENN_2:
  universeRequired
  expectedRegions
  boundaryIdentities

SET_REGION_VENN_3:
  universeRequired
  expectedRegions
  boundaryIdentities

SET_INCLUSION_VENN:
  inclusionDirection
  strictness
  equality
  disjointness
  boundaryIdentities

SET_NUMBER_LINE:
  intervalComponents

SET_FORCE_FORBID_FREE:
  forcedElements
  forbiddenElements
  freeElements
  freeCount
  countingResult

TRUTH_SET_VENN:
  implicationDirection
  truthSetRelation
  necessarySufficientRole
  boundaryIdentities

QUANTIFIER_NEGATION_MAP:
  originalQuantifier
  originalDomain
  originalPredicate
  negatedQuantifier
  negatedDomain
  negatedPredicate
  predicateScope

PROOF_FLOW:
  proofSteps
  proofEdges
  contradictionTarget
  finalConclusion
```

projection에서 필수 semantic field를 제외하면:

```text
SEMANTIC_PROJECTION_SPEC_FAIL
```

이다.

V1/V2/V3 evidence에는:

```text
SEMANTIC_PROJECTION_SPEC_SHA
```

를 반드시 결박한다.

또한 final solution을 공개하여:

```text
SOLUTION_EXPECTED_FACT_PARITY
SOLUTION_VISUAL_PARITY
```

를 확인한다.

## 2.5 Independence level

최소:

```text
LOGIC_VISUAL_INDEPENDENCE_LEVEL = I2_BLIND_SEPARATE_SESSION
```

권장:

```text
I3 = separate independent model/verifier + blind input
```

각 review run 최소 기록:

```text
reviewerId
reviewSessionId
reviewModelOrAgent
reviewStartReleaseSha
reviewEndReleaseSha
priorReviewVisibility
reviewInputBundleSha
firstPassEvidenceSha
finalReviewReportSha
```

START/END release SHA가 다르면 review invalid.

---

# 3. Typed Logical Fact Schema

자유형 `{}` fact는 최종 검수에 사용하지 않는다.

```text
FACT_SCHEMA_VERSION = LOGIC_VISUAL_FACT_v1
```

모든 fact는 type별 required schema를 만족해야 한다.

## 3.1 Canonical serialization

```text
EXPECTED_LOGICAL_FACT_SHA =
SHA256(canonical_json(EXPECTED_LOGICAL_FACT))

OBSERVED_VISUAL_FACT_SHA =
SHA256(canonical_json(OBSERVED_VISUAL_FACT))
```

canonicalization은 project-wide 별도 spec으로 고정한다.

```text
LOGIC_VISUAL_FACT_CANONICALIZATION_SPEC_SHA
```

field마다 collection semantics를 명시한다.

예:

```text
expectedRegions[]       = SET
forcedElements[]        = SET
forbiddenElements[]     = SET
freeElements[]          = SET
requiredLabels[]        = SET unless role-order is meaningful

proofSteps[]            = SEQUENCE
proofEdges[]            = SORT_BY_KEY(fromStep,toStep,relation)
intervalComponents[]    = SEQUENCE_BY_NUMBER_LINE_POSITION
caseRows[]              = SORT_BY_KEY(caseId) unless source order is semantically meaningful
truthVector[]           = SEQUENCE
```

규칙:

```text
SET            → canonical sort + duplicate forbidden
SEQUENCE       → original semantic order preserved
SORT_BY_KEY    → declared key order only
```

전부 정렬하거나 전부 원순서를 보존하지 않는다.

공통:

```text
sorted object keys
normalized Unicode math tokens
explicit null vs absent distinction
no floating serialization ambiguity
```

canonicalization spec SHA가 qualification/review input에 결박되어야 한다.

필수 field 누락이면:

```text
LOGIC_VISUAL_FACT_SCHEMA_FAIL
```

## 3.2 공통 fact header

```json
{
  "factSchemaVersion": "LOGIC_VISUAL_FACT_v1",
  "questionUid": "...",
  "unit": "집합 | 명제",
  "visualType": "...",
  "visualRole": "...",
  "requiredLabels": [],
  "decisiveStepIds": []
}
```

---

# 4. Observed Visual Semantics — Metadata 불신

다음은 보조 정보일 뿐 PASS 근거가 아니다.

```text
data-visual-type
data-region
data-logical-fact
data-arrow-from
data-arrow-to
data-endpoint-value
data-case-id
builder fact JSON
builder self-check
caption
title/desc
```

최종 관찰은 **post-transform / computed-style / rendered semantics** 기준이다.

```text
DECLARED_VISUAL_FACT_PARITY != OBSERVED_VISUAL_FACT_PARITY
```

## 4.1 SVG post-transform

다음을 반영한 뒤 읽는다.

```text
transform / transform-origin
nested <g> transforms
clipPath
mask
marker-start / marker-end
computed fill
computed stroke
computed opacity
display / visibility
CSS class style
```

DOM attribute만 읽고 PASS하지 않는다.

## 4.2 HTML/table first-class artifact

HTML/table도 SVG와 같은 C artifact다.

관찰 대상:

```text
rendered row count
rendered cell count
row/cell text
truth assignment
elimination state
row ordering
hidden/display-none row
merged-cell semantics [if used]
```

metadata JSON에 행이 있어도 실제 DOM에서 숨겨졌으면 누락이다.

---

# 5. Common Hard Gates

본 Overlay가 적용되는 C target에는 아래 gate를 전부 판정한다.

## G1 `LOGIC_VISUAL_NECESSITY_PARITY`

그림이 학습에 실제 이득이 있는가.

## G2 `LOGIC_VISUAL_QUESTION_SPECIFICITY_PARITY`

문자열이 고유한지가 아니라:

```text
EXPECTED_FACT_HASH
+
visualRole
+
artifact semantics
```

가 문항에 적합한지 본다.

`A/B`, `p/q`만 사용해도 원문 자체가 추상 관계 그 자체를 묻는 문항이라면 자동 FAIL시키지 않는다.
단, 이 예외는 묵시적으로 적용할 수 없다.

### G2-EX. Abstract Relation Specificity Exception

허용 reason code:

```text
SPECIFICITY_EXEMPT_ABSTRACT_RELATION_IS_QUESTION
```

예외 객체 최소 필드:

```text
specificityExceptionStatus =
  NOT_APPLICABLE
  PENDING_REVIEW
  APPROVED
  REJECTED

specificityExceptionReasonCode
specificityExceptionEvidenceRef
specificityExceptionReviewedBy
specificityExceptionReviewedAt
expectedLogicalFactSha
visualRole
artifactSemanticSummary
```

승인 조건:

```text
specificityExceptionStatus == APPROVED
AND specificityExceptionReasonCode == SPECIFICITY_EXEMPT_ABSTRACT_RELATION_IS_QUESTION
AND source question itself asks an abstract symbolic/logical relation
AND EXPECTED_LOGICAL_FACT_SHA is still question-specific
AND visualRole is necessary to explain that abstract relation
AND artifact is not a reusable decorative template detached from the expected fact
```

Builder가 자기 문항에 승인할 수 없다.

최소 승인 주체:

```text
independent C reviewer
OR designated semantic adjudicator
```

다음은 금지:

```text
"p/q만 쓰는 문제라서"
"원래 추상적이라서"
"템플릿이 편해서"
```

와 같은 근거 없는 자동 승인.

파생 count:

```text
SPECIFICITY_EXCEPTION_PENDING_COUNT
SPECIFICITY_EXCEPTION_REJECTED_BUT_USED_COUNT
SPECIFICITY_EXCEPTION_INVALID_COUNT
```

## G3 `LOGIC_VISUAL_EXPECTED_FACT_PARITY`

EXPECTED와 OBSERVED가 일치해야 한다.

## G4 `LOGIC_VISUAL_DECISIVE_STEP_PARITY`

정답을 결정하는 핵심 reasoning edge가 visual에 존재해야 한다.

## G5 `LOGIC_VISUAL_COMPLETENESS_PARITY`

필수 영역·방향·경우·domain 중 누락 0.

## G6 `LOGIC_VISUAL_MEDIUM_FIT_PARITY`

문제에 적절한 표현 매체인지 확인한다.

예:

```text
영역 → Venn
실수 구간 → number line
원소 분류 → bucket/table
경우분류 → case table
implication → flow
좌표 정의 집합 → graph
```

## G7 `LOGIC_VISUAL_DUPLICATE_PARITY`

동일 SHA만 검사하지 않는다.

아래 fingerprint를 사용한다.

```text
VISUAL_STRUCTURE_FINGERPRINT =
SHA256(canonical {
  visualType,
  regionTopology,
  boundaryTopology,
  arrowTopology,
  intervalComponentTopology,
  tableShape,
  panelStructure,
  semanticRolePattern
})
```

### 동일 SHA

동일 SHA는 review trigger다.

### 구조적 복제

서로 다른 artifact라도:

```text
same VISUAL_STRUCTURE_FINGERPRINT
AND different EXPECTED_LOGICAL_FACT_SHA
AND question-specific fact coverage insufficient
```

이면:

```text
STRUCTURAL_TEMPLATE_REUSE_FAIL
```

### 합법적 shared reuse

다음 전부 만족 시만 허용:

```text
EXPECTED_SEMANTIC_SHA identical
visualRole identical
requiredLabels compatible
shared provenance explicit
SHARED_VISUAL_EQUIVALENCE_PASS
```

## G8 `LOGIC_VISUAL_SOLUTION_PARITY`

solution의 논리와 visual의 논리가 일치해야 한다.

## G9 `LOGIC_VISUAL_ALT_CAPTION_PARITY`

alt/caption이 실제 visual 의미를 구체적으로 설명해야 한다.

## G10 `LOGIC_VISUAL_STATIC_CONTRACT`

Common Core / 도형추출의 static contract를 전부 통과해야 한다.

## G11 `LOGIC_VISUAL_ANSWER_ONLY_FAIL`

정답 또는 정답 번호만 보여 주고 reasoning structure가 없으면 FAIL.

### §Answer Leak과의 관계

solution context에서는 정답 번호를 visual에 포함할 수 있다.

단:

```text
answer choice number present
=> decisive reasoning structure also present
AND answer number is subordinate annotation
```

이어야 한다.

예:

좋음:

```text
정답 영역 B∩C∩Aᶜ를 실제로 강조
+
우측 작은 라벨 "①"
```

나쁨:

```text
큰 "①" + 실질적 reasoning 없음
```

## G12 `LOGIC_VISUAL_TEXT_HEAVY_FAIL`

SVG가 긴 해설문을 대신하는 작은 페이지가 되면 FAIL/WARN.

긴 설명은 solution 본문으로 돌린다.

## G13 `LOGIC_VISUAL_C_PRESENTATION_STATIC_PARITY`

C semantic item gate에서는 실제 browser runtime PASS를 요구하지 않는다.

C에서 허용하는 presentation-side 확인은 **artifact 자체의 정적 의미 보존**에 한정한다.

예:

```text
label exists where semantic identity requires it
required region not hidden by SVG structure
required arrow marker encoded
required endpoint marker encoded
static bounds obviously non-empty
```

다음은 C가 아니라 D authoritative 범위다.

```text
actual browser clipping
font ready
MathJax completion
image decode
computed layout collision
grayscale screenshot result
80% / 70% 실제 rendered readability
asset association in rendered exam
student-facing reading order
```

따라서 production 문항별:

```text
LOGIC_VISUAL_ITEM_SEMANTIC_GATE
```

에는 Common Core D real-render PASS를 넣지 않는다.

### Qualification-only render gate

본 규정 채택 시험에서는 별도 프로젝트 gate를 둔다.

```text
LOGIC_VISUAL_QUALIFICATION_RENDER_PASS
```

qualification 단계에서는 실제 `sol` render로:

```text
clipping 0
label collision 0
grayscale PASS
80% scale PASS
70% scale PASS
math glyph PASS
asset association PASS
reading order PASS
```

를 확인한다.

하지만 production release에서는:

```text
Common Core D = authoritative runtime/render gate
```

이며 Overlay C item PASS와 분리한다.

## G14 `LOGIC_VISUAL_RULE_ROUTING_PASS`

`RULE_ROUTING_BLOCKED = 0`.


## G15 `LOGIC_VISUAL_ACTION_PARITY`

Common Core `visualAction`과 final artifact 상태가 실제로 일치해야 한다.

```text
visualAction == KEEP_EXISTING_SOLUTION_VISUAL
=> existing asset identity/hash preserved
AND ACTUAL_SOLUTION_VISUAL_ATTACHED == true

visualAction == ADD
=> before ACTUAL_SOLUTION_VISUAL_ATTACHED == false
AND after ACTUAL_SOLUTION_VISUAL_ATTACHED == true

visualAction == REBUILD
=> before asset exists
AND after asset exists
AND final asset hash != invalid/superseded asset hash

visualAction == REMOVE_INVALID_VISUAL
=> final ACTUAL_SOLUTION_VISUAL_ATTACHED == false
AND JS solutionImage linkage removed
AND stale alt/caption/linkage removed or correctly N/A
AND removed asset is not still student-facing through another hidden linkage

visualAction == USE_PROBLEM_IMAGE
=> PROBLEM_VISUAL_MATH_DEPENDENCY == true
AND duplicate solution visual is not required unless separately justified

visualAction == NONE
=> no unauthorized visual mutation
```

필수:

```text
VISUAL_ACTION_PARITY == PASS
```

`REMOVE_INVALID_VISUAL`은 단순 파일 삭제가 아니라 **student-facing linkage absence**까지 증명해야 한다.

---

# 6. 집합 Canonical Fact

집합 type별 fact는 최소 다음 축에서 필요한 것만 사용한다.

```text
universe
regionMembership
boundaryIdentity
setInclusion
setEquality
setDisjointness
elementBuckets
intervalComponents
cardinalityByRegion
casePartition
graphDefinedSetFacts
```

---

# 7. Universe / Complement Contract

여집합 또는 바깥 영역에 의미가 있으면 전체집합 U가 반드시 고정되어야 한다.

```text
UNIVERSE_REQUIRED =
  expression contains complement
  OR outside-region has semantic meaning
```

필수 fact:

```text
universeDefinition
universeBoundaryRequired
universeLabelRequired
complementReferenceSet
```

필수 gate:

```text
UNIVERSE_BOUNDARY_PARITY
UNIVERSE_LABEL_PARITY
COMPLEMENT_REFERENCE_SET_PARITY
```

따라서:

```text
(A△B)^c
A^c
A^c∩B
outside(A∪B)
```

를 Venn으로 표현하면서 U boundary가 없으면 HARD FAIL.

2집합의 `R00`, 3집합의 `000`은 **U 내부에서 A/B/C 모두 바깥인 영역**이지 SVG canvas 전체가 아니다.

---

# 8. `SET_REGION_VENN_2`

canonical regions:

```text
R00 = U ∩ Aᶜ ∩ Bᶜ
R10 = A ∩ Bᶜ
R11 = A ∩ B
R01 = Aᶜ ∩ B
```

예:

```text
A-B       = {R10}
A∩B       = {R11}
A∪B       = {R10,R11,R01}
A△B       = {R10,R01}
(A△B)^c   = {R00,R11}
```

typed fact:

```json
{
  "visualType": "SET_REGION_VENN_2",
  "universeRequired": true,
  "expectedRegions": ["R00","R11"],
  "boundaryIdentities": {
    "A": "boundary:A",
    "B": "boundary:B",
    "U": "boundary:U"
  }
}
```

필수:

```text
REGION_MASK_PARITY
SET_BOUNDARY_IDENTITY_PARITY
```

A/B 라벨이 뒤바뀌면 region mask만 우연히 맞아도 FAIL.

## 8.1 Observed region extraction

우선순위:

1. SVG boolean geometry / clip / mask 구조 해석
2. rendered raster multi-sample fallback
3. manual independent review — verifier 미지원 시 명시

대표점 1개만으로 PASS 금지.

raster fallback이면 project config에 다음을 동결한다.

```text
REGION_SAMPLE_MIN_POINTS >= 5
REGION_REQUIRED_COVERAGE_THRESHOLD
REGION_FORBIDDEN_COVERAGE_THRESHOLD
```

각 canonical region 내부 복수 점을 검사한다.

작은 점 하나만 칠해서 representative point를 속이는 mutation을 잡아야 한다.

---

# 9. `SET_REGION_VENN_3`

membership bit:

```text
000
100
010
001
110
101
011
111
```

`000` 역시 U 내부 영역이다.

필수:

```text
REGION_MASK_PARITY
SET_BOUNDARY_IDENTITY_PARITY
UNIVERSE_* [if outside/complement applicable]
```

---

# 10. Subset Symbol Semantics Lock

구형 source의 `⊂`, production의 `⊆` 등을 추정으로 해석하지 않는다.

```text
SUBSET_SYMBOL_SEMANTICS_LOCK
- sourceSymbol
- sourceMeaning
- productionSymbol
- productionMeaning
- effectiveMeaning
- authorityRef
- driftStatus
- adjudicationRef
- adjudicatedBy
- adjudicatedAt
```

canonical drift state:

```text
subsetSemanticDriftStatus =
  NONE
  DETECTED
  PENDING_ADJUDICATION
  RESOLVED
  UNRESOLVED
```

effective meaning 결정 권한:

1. verified source/provenance
2. explicit approved historical decision
3. curriculum notation policy
4. unresolved → `SOURCE_REVIEW_REQUIRED`

추정 금지.

```text
sourceMeaning != productionMeaning
=> subsetSemanticDriftStatus IN {
     DETECTED,
     PENDING_ADJUDICATION,
     RESOLVED,
     UNRESOLVED
   }
```

`RESOLVED` 조건:

```text
effectiveMeaning fixed
AND authorityRef valid
AND adjudicationRef valid
AND adjudicatedBy recorded
AND visual/solution semantics updated or verified against effectiveMeaning
```

다음은 Final Overlay Gate 불가:

```text
DETECTED
PENDING_ADJUDICATION
UNRESOLVED
```

단순히 현재 production 의미를 canonical truth로 승격하지 않는다.

---

# 11. `SET_INCLUSION_VENN`

검증:

```text
INCLUSION_DIRECTION_PARITY
STRICTNESS_PARITY
EQUALITY_PARITY
DISJOINTNESS_PARITY
SET_BOUNDARY_IDENTITY_PARITY
```

예:

```text
A⊆B  → A inside B
A⊊B  → A inside B + equality excluded
A=B  → same semantic set
A∩B=∅ → overlap absent
```

Venn 면적은 cardinality 의미를 갖지 않는다.

```text
SCHEMATIC_AREA_HAS_NO_CARDINALITY_MEANING = true
```

---

# 12. `SET_NUMBER_LINE`

단일 LEFT/RIGHT endpoint 구조를 사용하지 않는다.

canonical schema:

```json
{
  "visualType": "SET_NUMBER_LINE",
  "intervalComponents": [
    {
      "leftEndpoint": null,
      "rightEndpoint": 1,
      "leftInfinite": true,
      "rightInfinite": false,
      "leftClosed": false,
      "rightClosed": false
    },
    {
      "leftEndpoint": 3,
      "rightEndpoint": null,
      "leftInfinite": false,
      "rightInfinite": true,
      "leftClosed": true,
      "rightClosed": false
    }
  ]
}
```

이로써:

```text
(-∞,1) ∪ [3,∞)
```

같은 다중 component를 표현한다.

필수:

```text
INTERVAL_COMPONENT_COUNT_PARITY
ENDPOINT_VALUE_PARITY
OPEN_CLOSED_PARITY
INFINITY_DIRECTION_PARITY
COMPONENT_ORDER_PARITY
```

OBSERVED는 post-transform 실제 marker와 ray/segment를 읽는다.

---

# 13. `SET_CARDINALITY_VENN`

typed fact:

```text
cardinalityByRegion
unionCardinality
intersectionCardinality
outsideCardinality
totalCardinality
extremeConfiguration [if applicable]
```

필수:

```text
CARDINALITY_BY_REGION_PARITY
TOTAL_CARDINALITY_PARITY
EXTREME_CONFIGURATION_PARITY
```

면적비가 아니라 숫자/라벨이 authoritative.

최대·최소가 핵심이면 필요한 경우 2패널로 극단 배치를 분리한다.

---

# 14. `SET_FORCE_FORBID_FREE`

반드시 실제 원소를 넣는다.

```text
forcedElements
forbiddenElements
freeElements
freeCount
countingResult
```

예:

```text
강제 {1,3,4}
금지 {6,8}
자유 {2,5,7,9}
→ 2^4
```

빈:

```text
강제 | 금지 | 자유
```

박스만 있으면 FAIL.

필수:

```text
ELEMENT_BUCKET_PARITY
FREE_COUNT_PARITY
COUNTING_RESULT_PARITY
```

---

# 15. `SET_CASE_PARTITION`

typed row:

```text
caseId
caseCondition
caseElements / parameterValue
derivedFacts[]
validity
countContribution
eliminationReasonId [if invalid]
```

필수:

```text
CASE_MUTUAL_EXCLUSIVITY_PASS
CASE_EXHAUSTIVENESS_PASS
CASE_COUNT_PARITY
ELIMINATION_REASON_PARITY
```

## 15.1 `ELIMINATION_REASON_PARITY` 판정

invalid case마다:

```text
1. 어떤 required condition을 위반했는지
2. 그 condition의 EXPECTED truth value
3. 실제 case truth value
4. elimination reason이 그 위반을 정확히 참조하는지
```

를 본다.

PASS iff:

```text
every eliminated case has >=1 verified violated requirement
AND eliminationReasonId references a genuinely violated requirement
AND no valid case is eliminated
AND no invalid case survives final valid set
```

단순 `"조건 불만족"` 문구만 있으면 FAIL.

---

# 16. `SET_GRAPH_DEFINED`

문항별 gate와 프로젝트 aggregate gate를 분리한다.

문항별:

```text
LOGIC_VISUAL_ITEM_SEMANTIC_GATE
AND
GEOMETRY_GRAPH_ITEM_GATE
```

둘 다 PASS해야 한다.

전체 프로젝트:

```text
all required item gates PASS
→ LOGIC_VISUAL_OVERLAY_GATE evaluation eligible
```

좌표 기반이면 `도형추출.md` Python/numeric contract를 그대로 적용한다.

`LOGIC_VISUAL_OVERLAY_GATE`를 개별 문항의 선행조건으로 사용하지 않는다.

---

# 17. 명제 Canonical Fact

최소 축:

```text
propositionType
implicationDirection
truthSetRelation
necessarySufficientRole
negationForm
quantifier
quantifierDomain
predicateScope
converseForm
inverseForm
contrapositiveForm
counterexample
proofSteps
proofEdges
contradictionTarget
caseTruthAssignments
```

---

# 18. Proposition Terminology / Symbol Provenance Lock

명제 용어와 방향을 production 현재 표현만 보고 추정하지 않는다.

```text
PROPOSITION_TERM_SEMANTICS_LOCK
- sourceTerm
- sourceFormula
- productionTerm
- productionFormula
- effectiveTermMeaning
- authorityRef
- driftStatus
- adjudicationRef
- adjudicatedBy
- adjudicatedAt
```

canonical drift state:

```text
propositionSemanticDriftStatus =
  NONE
  DETECTED
  PENDING_ADJUDICATION
  RESOLVED
  UNRESOLVED
```

대상:

```text
원명제
역
이
대우
필요조건
충분조건
필요충분조건
전칭
존재
부정
```

authority:

1. verified source/provenance
2. explicit approved historical decision
3. curriculum notation policy
4. unresolved → SOURCE_REVIEW_REQUIRED

용어와 공식이 충돌하면:

```text
PROPOSITION_SEMANTIC_DRIFT
=> propositionSemanticDriftStatus IN {
     DETECTED,
     PENDING_ADJUDICATION,
     RESOLVED,
     UNRESOLVED
   }
```

`RESOLVED` 조건:

```text
effectiveTermMeaning fixed
AND authorityRef valid
AND adjudicationRef valid
AND adjudicatedBy recorded
AND visual/solution semantics verified against effectiveTermMeaning
```

다음은 Final Overlay Gate 불가:

```text
DETECTED
PENDING_ADJUDICATION
UNRESOLVED
```

---

# 19. `TRUTH_SET_VENN`

canonical invariant:

```text
p → q  ⇔  P ⊆ Q
```

조건 역할:

```text
p sufficient for q => P⊆Q
p necessary for q  => Q⊆P
p necessary and sufficient for q => P=Q
```

필수:

```text
IMPLICATION_DIRECTION_PARITY
TRUTH_SET_INCLUSION_PARITY
CONDITION_ROLE_PARITY
SET_BOUNDARY_IDENTITY_PARITY
```

---

# 20. `TRUTH_SET_NUMBER_LINE`

§12의 component-list number line schema를 그대로 사용한다.

필수:

```text
TRUTH_SET_INTERVAL_PARITY
TRUTH_SET_INCLUSION_PARITY
OPEN_CLOSED_PARITY
QUANTIFIED_DOMAIN_PARITY [if applicable]
```

---

# 21. `IMPLICATION_FLOW`

typed schema:

```text
nodes[]
edges[] = {from,to,relation}
```

OBSERVED는 실제 arrow path/marker 방향을 읽는다.

```text
EXPECTED_ARROW_SET == OBSERVED_ARROW_SET
```

텍스트 `p→q`만 맞고 실제 arrow가 반대면 FAIL.

---

# 22. `CONTRAPOSITIVE_MAP`

canonical:

```text
original:       p → q
converse:       q → p
inverse:        ¬p → ¬q
contrapositive: ¬q → ¬p
```

필수:

```text
ORIGINAL_PARITY
CONVERSE_PARITY
INVERSE_PARITY
CONTRAPOSITIVE_PARITY
```

---

# 23. `QUANTIFIER_NEGATION_MAP`

typed fact:

```text
originalQuantifier
originalDomain
originalPredicate
negatedQuantifier
negatedDomain
negatedPredicate
predicateScope
```

canonical:

```text
¬(∀x∈D P(x)) = ∃x∈D ¬P(x)
¬(∃x∈D P(x)) = ∀x∈D ¬P(x)
```

필수:

```text
QUANTIFIER_FLIP_PARITY
QUANTIFIER_DOMAIN_PARITY
PREDICATE_NEGATION_PARITY
PREDICATE_SCOPE_PARITY
```

domain이 사라지거나 바뀌면 FAIL.

---

# 24. `COUNTEREXAMPLE_CARD`

typed fact:

```text
candidateValue
domain
domainMembership
premiseTruth
conclusionTruth
counterexampleStatus
```

필수:

```text
COUNTEREXAMPLE_DOMAIN_PASS
COUNTEREXAMPLE_PREMISE_TRUE
COUNTEREXAMPLE_CONCLUSION_FALSE
```

정의역 밖 값은 반례가 아니다.

---

# 25. `PROOF_FLOW`

단순 step order만 보지 않는다.

typed:

```text
proofSteps[]
proofEdges[] = {
  fromStep,
  toStep,
  justificationType,
  justificationFact
}
contradictionTarget [if applicable]
finalConclusion
```

필수:

```text
PROOF_STEP_ORDER_PARITY
PROOF_EDGE_VALIDITY_PARITY
CONTRADICTION_TARGET_PARITY
FINAL_CONCLUSION_PARITY
```

각 edge가 실제로 성립하는지 검증한다.

---

# 26. `TRUTH_TABLE / CASE_TABLE`

typed row:

```text
caseId
assignment
statementTruthVector
requiredConditionTruthVector
eliminated
eliminationReasonId
finalValidity
```

필수:

```text
CASE_ROW_COMPLETENESS
CASE_MUTUAL_EXCLUSIVITY_PASS
CASE_EXHAUSTIVENESS_PASS
TRUTH_ASSIGNMENT_PARITY
ELIMINATION_REASON_PARITY
FINAL_CASE_COUNT_PARITY
```

집합 case partition과 같은 elimination reason 규칙을 사용한다.

---

# 27. Answer Leak / Solution Context

`solutionImage`는 해설 영역에서 정답을 설명할 수 있다.

그러나:

```text
exam mode에 solution visual 노출 금지
problem image에 정답 annotation 덮어쓰기 금지
shared problem asset에 solution-only 강조 금지
```

정답 번호 사용 규칙:

```text
solution context only
AND reasoning structure present
AND answer label subordinate
```

`G11 LOGIC_VISUAL_ANSWER_ONLY_FAIL`과 함께 적용한다.

---

# 28. Grayscale / Visual Honesty

`도형추출.md` v3.0을 상속한다.

색만으로 의미 전달 금지.

권장:

```text
fill + label
fill + hatching
boundary + text
pattern + region name
```

Venn:

```text
SCHEMATIC_AREA_HAS_NO_CARDINALITY_MEANING = true
```

화살표 길이/원의 크기/겹침 면적이 논리의 강도나 cardinality를 암시하면 안 된다.

---

# 29. Duplicate / Structural Reuse Audit

각 artifact에 기록:

```text
assetSha256
visualStructureFingerprint
expectedLogicalFactSha
visualRole
requiredLabelsHash
sharedAssetProvenanceRef [if shared]
```

review rule:

```text
same SHA + different EXPECTED_FACT
=> HARD REVIEW TRIGGER

same structure fingerprint + different EXPECTED_FACT
=> structural reuse analysis required

different EXPECTED_FACT + insufficient question-specific coverage
=> STRUCTURAL_TEMPLATE_REUSE_FAIL
```

동일 fact를 정말 공유하는 경우에만 explicit shared reuse 허용.


공통 fact header에 `questionUid`가 포함되므로 서로 다른 문항의 raw
`EXPECTED_LOGICAL_FACT_SHA` 동일성을 shared reuse 조건으로 사용하지 않는다.
shared equivalence는 semantic projection 기준 `EXPECTED_SEMANTIC_SHA`를 사용한다.

---

# 30. Static Contract

Common Core static visual contract + 본 Overlay schema를 함께 검증한다.

최소:

```text
XML parse / DOM parse
viewBox
width/height
unsafe element 0
external resource 0
raw LaTeX 0
answer leak 0
empty panel 0
asset path parity
alt/caption parity
fact schema valid
FACT_SCHEMA_VERSION valid
expected fact SHA valid
observed fact SHA valid
visual structure fingerprint valid
appliedRuleRefs valid
subset/proposition semantics lock resolved [applicable]
universe contract resolved [applicable]
```

HTML/table:

```text
DOM load
row/cell schema
hidden row audit
caseId uniqueness
text/semantic parse
```

---

# 30-1. Per-Item Semantic Gate

각 `LOGIC_VISUAL_REVIEW_REQUIRED` 문항은 먼저 개별 gate를 닫는다.

```text
LOGIC_VISUAL_ITEM_SEMANTIC_GATE == PASS iff

all applicable C-semantic/static/action gates PASS
AND G13 qualification/runtime render requirement is excluded from item C status
AND expected semantic projection valid
AND observed semantic projection valid
AND EXPECTED_SEMANTIC_SHA == OBSERVED_SEMANTIC_SHA
AND semantics locks resolved
AND applicable universe/domain contracts PASS
AND no unresolved item WARN
```

문항별 evidence field는:

```text
logicVisualItemStatus =
  PASS
  FAIL
  BLOCKED
```

를 사용한다.

`logicVisualOverlayStatus`라는 문항별 필드는 사용하지 않는다.

전체 aggregate `LOGIC_VISUAL_OVERLAY_GATE`는
required UID 전부의 `logicVisualItemStatus == PASS`가 확인된 뒤에만 평가한다.

---

# 31. C Review Evidence Binding

본 Overlay가 applicable한 문항의 C review에서는:

```text
LOGIC_VISUAL_EVIDENCE_SHA =
SHA256(canonical {
  appliedRuleRefs,
  EXPECTED_LOGICAL_FACT_SHA,
  OBSERVED_VISUAL_FACT_SHA,
  EXPECTED_SEMANTIC_SHA,
  OBSERVED_SEMANTIC_SHA,
  SEMANTIC_PROJECTION_SPEC_SHA,
  LOGIC_VISUAL_FACT_CANONICALIZATION_SPEC_SHA,
  visualStructureFingerprint,
  logicVisualItemStatus,
  all applicable overlay gate results,
  V1_FIRST_PASS_EVIDENCE_SHA,
  V2_FIRST_PASS_EVIDENCE_SHA,
  V3_PARITY_EVIDENCE_SHA,
  renderWitnessRefs
})
```

를 만든다.

그리고 C review input/evidence에 결박한다.

Common Core의:

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

에서 본 Overlay가 applicable하면:

```text
visual fact model includes typed Logic Visual fact schema
visual rules include this Overlay rule SHA
dependency facts include applicable universe/shared/source semantic locks
```

이어야 한다.

또한 C final evidence가:

```text
LOGIC_VISUAL_EVIDENCE_SHA
```

를 참조해야 한다.

본 Overlay PASS를 C status와 별도로 떠 있게 두지 않는다.

---

# 32. Mutation Qualification 운영

mutation corpus는 문서 예시가 아니라 실행 gate다.

## 32.1 실행 주체

### Builder / tool qualification

visual verifier 또는 generator 변경 시:

```text
MUTATION_OPERATOR = automated tooling
```

을 기본으로 한다.

권장 위치:

```text
archive/tools/logic-visual-audit/
```

### Independent C qualification

최종 frozen release에서 C verifier가:

```text
mutation qualification report
tool SHA
ruleset SHA
corpus SHA
```

를 독립 확인한다.

## 32.2 언제 재실행하는가

다음 중 하나면 mutation qualification 재실행:

```text
Logic Visual Overlay 변경
verifier 변경
renderer semantic extraction 변경
fact schema 변경
visual generator 변경
CSS/style rule 변경으로 observed semantics 영향
Golden/holdout corpus 변경
```

## 32.2.1 Qualification currency

mutation qualification은 한 번 영구 PASS하는 것이 아니다.

qualification 입력을 하나의 bundle SHA로 묶는다.

```text
QUALIFICATION_INPUT_BUNDLE_SHA =
SHA256(canonical {
  EFFECTIVE_RULESET_SHA,
  ruleRoutingBundleSha,
  overlayRuleSha,
  verifierSha,
  observedExtractionEngineSha,
  visualGeneratorSha,
  staticContractToolSha,
  rendererSemanticProfileSha,
  styleCssBundleSha,
  factSchemaSha,
  logicVisualFactCanonicalizationSpecSha,
  semanticProjectionSpecSha,
  calibrationCorpusSha,
  mutationCorpusSha,
  holdoutCorpusSha,
  expectedDetectorMapSha
})
```

```text
MUTATION_QUALIFICATION_CURRENT == PASS
```

는 current working qualification inputs에서 다시 계산한 bundle SHA가
qualification evidence의 `QUALIFICATION_INPUT_BUNDLE_SHA`와 같을 때만 유지한다.

하나라도 바뀌면:

```text
MUTATION_QUALIFICATION_CURRENT = STALE
```

이고 재실행 전 Overlay Final Gate 진입 금지.


`EFFECTIVE_RULESET_SHA`는 Common Core 정의를 그대로 사용하며 최소 다음 변경을 포착해야 한다.

```text
COMMON_PROTOCOL_SHA
UNIT_OVERLAY_SHA
CURRICULUM_MASTER_BUNDLE_SHA
PROJECT_CONFIG_SHA
PROTOCOL_CONTRACT_REGISTRY_SHA
```

`ruleRoutingBundleSha`는 qualification에 실제 적용된 RULES_INDEX/MANIFEST/routing preflight 묶음의 canonical SHA다.

상위 ruleset 또는 curriculum/project config가 바뀌었는데 qualification이 CURRENT로 남는 것을 금지한다.


## 32.3 Expected Detector Map Pre-Freeze

qualification 시작 전에 mutation별 예상 detector를 동결한다.

```text
MUTATION_EXPECTED_DETECTOR_MAP = {
  mutationId -> {
    primaryGate,
    allowedEquivalentGates[]
  }
}
```

```text
MUTATION_EXPECTED_DETECTOR_MAP_SHA =
SHA256(canonical(MUTATION_EXPECTED_DETECTOR_MAP))
```

필수 ordering:

```text
MUTATION_EXPECTED_DETECTOR_MAP_SHA createdAt
<
first mutation execution evidence createdAt
```

사후 equivalent gate 추가/승인 금지.

allowedEquivalentGates 변경 시 qualification attempt 전체를 폐기하고 새 attempt로 재시작한다.

## 32.4 Detection qualification

mutation이 단순히 “어딘가 FAIL”하면 성공이 아니다.

각 mutation:

```text
mutationId
targetQuestionUid
mutationType
expectedDetectorGate
allowedEquivalentGates
actualFailedGate
parserSurvived
artifactRendered
survivedSemanticGate
detectorMapSha
```

를 기록한다.

formal predicate:

```text
MUTATION_CASE_PASS iff
    parserSurvived == true
AND artifactRendered == true
AND survivedSemanticGate == false
AND detectorMapSha == MUTATION_EXPECTED_DETECTOR_MAP_SHA
AND (
      actualFailedGate == expectedDetectorGate
   OR actualFailedGate IN allowedEquivalentGates
    )
```

XML/DOM parser가 깨져서 FAIL한 경우:

```text
parserSurvived == false
=> MUTATION_CASE_PASS == false
```

렌더 자체가 실패한 경우도 semantic detector qualification 성공으로 인정하지 않는다.

전체:

```text
MUTATION_DETECTION_GATE_PASS iff
all mutation cases MUTATION_CASE_PASS == true
```

---

# 33. Mutation Corpus

## 집합

1. A-only ↔ intersection highlight swap
2. `(A△B)^c`에서 R00 삭제
3. A/B boundary label swap
4. A⊆B nesting reverse
5. open ↔ closed endpoint
6. interval component 하나 삭제
7. forced element → free bucket 이동
8. cardinality 숫자 영역 이동
9. case row 삭제
10. 다른 문항 SVG 교체
11. representative point만 작은 patch로 색칠
12. U boundary 삭제한 complement Venn

## 명제

1. `p→q` arrow reverse
2. P⊆Q nesting reverse
3. contrapositive → inverse
4. quantifier만 flip, predicate negation 누락
5. predicate만 negate, quantifier 유지
6. quantifier domain 삭제
7. counterexample을 domain 밖 값으로 교체
8. proof invalid edge 삽입
9. contradiction step 삭제
10. truth-table row 삭제
11. valid case를 invalid로 표시
12. 다른 문항 flow 교체

---

# 34. Golden Set 분리

같은 corpus로 규칙을 튜닝하고 합격 판정하지 않는다.

최소 세 세트:

```text
CALIBRATION_SET
HOLDOUT_REGRESSION_SET
ADVERSARIAL_MUTATION_SET
```

## 34.1 Calibration

규칙 설계·verifier 개발용.

## 34.2 Holdout

규칙/구현 확정 후 처음 공개.

Calibration tuning에 사용 금지.

## 34.3 Adversarial Mutation

known-bad mutation 전용.

## 34.3.1 Holdout Reveal Lifecycle

holdout은 한 번 공개된 뒤 실패 원인을 보고 규칙/구현을 수정하면 더 이상 unseen holdout이 아니다.

state:

```text
holdoutStatus =
  UNSEEN
  REVEALED_PASS
  REVEALED_FAIL
  RETIRED
```

규칙:

```text
holdout run begins
=> holdoutStatus transitions UNSEEN -> REVEALED_PASS or REVEALED_FAIL
```

만약:

```text
holdoutStatus == REVEALED_FAIL
AND any of {
  overlay rule,
  verifier,
  generator,
  extraction engine,
  static tool,
  style/CSS,
  fact schema,
  canonicalization spec
} changes afterward
```

이면:

```text
current holdoutStatus = RETIRED
NEW_UNSEEN_HOLDOUT_CORPUS_SHA required
```

같은 revealed-failed holdout을 다시 돌려 PASS시켜도 adoption evidence로 인정하지 않는다.

반대로 `REVEALED_PASS` 후 qualification input이 바뀌면
qualification currency가 STALE이므로 새 unseen holdout이 필요하다.

## 34.4 Adoption 조건

```text
CALIBRATION_PASS
AND HOLDOUT_REGRESSION_PASS
AND MUTATION_DETECTION_GATE_PASS
```

없이는 `ADOPTED` 불가.

---

# 35. Evidence Record v1.1

문항별 최소:

```json
{
  "questionUid": "...",
  "examId": "...",
  "qid": 0,

  "appliedRuleRefs": [
    {
      "path": "...",
      "declaredVersion": "...",
      "actualBytes": 0,
      "sha256": "sha256:...",
      "role": "...",
      "precedenceOrder": 0
    }
  ],

  "pedagogyDisposition": "KEEP | EXPAND | REWRITE | BLOCKED_BY_SOURCE",

  "visualRequirement": "VISUAL_REQUIRED | VISUAL_OPTIONAL | VISUAL_EXEMPT",
  "visualExemptReason": "reason code or null",
  "visualAction": "NONE | USE_PROBLEM_IMAGE | KEEP_EXISTING_SOLUTION_VISUAL | ADD | REBUILD | REMOVE_INVALID_VISUAL",

  "actualSolutionVisualAttached": false,
  "problemVisualMathDependency": false,
  "sharedVisualMathDependency": false,

  "expectedVisualRequirementSignal": "SHOULD_BE_REQUIRED | MAY_BE_OPTIONAL | SHOULD_BE_EXEMPT | SOURCE_BLOCKED",
  "visualRequirementClassificationParity": "PASS | FAIL | BLOCKED",
  "visualRequirementAdjudicationStatus": "NOT_REQUIRED | REQUIRED | IN_PROGRESS | RESOLVED | UNRESOLVED",
  "visualRequirementAdjudicationEvidenceRef": "ref or null",

  "logicVisualReviewRequired": false,

  "visualType": "... | NONE",
  "visualRole": "...",
  "visualMedium": "venn | number_line | flow | table | graph | none",

  "factSchemaVersion": "LOGIC_VISUAL_FACT_v1",
  "expectedLogicalFactSha": "sha256:...",
  "observedVisualFactSha": "sha256:...",
  "expectedSemanticSha": "sha256:...",
  "observedSemanticSha": "sha256:...",
  "logicVisualFactCanonicalizationSpecSha": "sha256:...",
  "observedFactExtractionMethod": "svg_boolean | raster_multisample | endpoint_parse | arrow_parse | table_dom_parse | manual_independent",

  "visualStructureFingerprint": "sha256:...",

  "specificityException": {
    "status": "NOT_APPLICABLE | PENDING_REVIEW | APPROVED | REJECTED",
    "reasonCode": "SPECIFICITY_EXEMPT_ABSTRACT_RELATION_IS_QUESTION | null",
    "evidenceRef": "ref or null",
    "reviewedBy": "reviewer id or null",
    "reviewedAt": "timestamp or null"
  },

  "subsetSymbolSemanticsLock": {
    "applicable": false,
    "sourceSymbol": null,
    "sourceMeaning": null,
    "productionSymbol": null,
    "productionMeaning": null,
    "effectiveMeaning": null,
    "authorityRef": null,
    "driftStatus": "NONE | DETECTED | PENDING_ADJUDICATION | RESOLVED | UNRESOLVED",
    "adjudicationRef": null,
    "adjudicatedBy": null,
    "adjudicatedAt": null
  },

  "propositionTermSemanticsLock": {
    "applicable": false,
    "sourceTerm": null,
    "sourceFormula": null,
    "productionTerm": null,
    "productionFormula": null,
    "effectiveTermMeaning": null,
    "authorityRef": null,
    "driftStatus": "NONE | DETECTED | PENDING_ADJUDICATION | RESOLVED | UNRESOLVED",
    "adjudicationRef": null,
    "adjudicatedBy": null,
    "adjudicatedAt": null
  },

  "v1FirstPassEvidenceSha": "sha256:...",
  "v2FirstPassEvidenceSha": "sha256:...",
  "v3ParityEvidenceSha": "sha256:...",

  "logicVisualNecessityParity": "PASS | FAIL | NOT_APPLICABLE",
  "logicVisualQuestionSpecificityParity": "PASS | FAIL | NOT_APPLICABLE",
  "logicVisualExpectedFactParity": "PASS | FAIL | NOT_APPLICABLE",
  "logicVisualDecisiveStepParity": "PASS | FAIL | NOT_APPLICABLE",
  "logicVisualCompletenessParity": "PASS | FAIL | NOT_APPLICABLE",
  "logicVisualMediumFitParity": "PASS | FAIL | NOT_APPLICABLE",
  "logicVisualDuplicateParity": "PASS | FAIL | NOT_APPLICABLE",
  "logicVisualSolutionParity": "PASS | FAIL | NOT_APPLICABLE",
  "logicVisualAltCaptionParity": "PASS | FAIL | NOT_APPLICABLE",
  "logicVisualStaticContract": "PASS | FAIL | BLOCKED | NOT_APPLICABLE",
  "logicVisualAnswerOnlyStatus": "PASS | FAIL | NOT_APPLICABLE",
  "logicVisualTextHeavyStatus": "PASS | FAIL | NOT_APPLICABLE",
  "logicVisualQualificationRenderPass": "PASS | FAIL | NOT_TESTED | NOT_APPLICABLE",
  "logicVisualActionParity": "PASS | FAIL | NOT_APPLICABLE",

  "naReasonCodes": {},
  "unresolvedWarnCodes": [],

  "logicVisualItemStatus": "PASS | FAIL | BLOCKED"
}
```

## 35.1 NOT_APPLICABLE reason

모든 NOT_APPLICABLE은 해당 gate별 `NA_REASON_CODE`가 필요하다.

사유 없는 N/A 금지.

## 35.1.1 Project-Level Qualification Evidence

문항 record와 별도로 qualification run에는 최소 다음을 기록한다.

```json
{
  "ruleStatus": "CANDIDATE_QUALIFICATION_ONLY | ADOPTED",
  "qualificationInputBundleSha": "sha256:...",
  "effectiveRulesetSha": "sha256:...",
  "ruleRoutingBundleSha": "sha256:...",
  "semanticProjectionSpecSha": "sha256:...",
  "mutationExpectedDetectorMapSha": "sha256:...",
  "calibrationCorpusSha": "sha256:...",
  "holdoutCorpusSha": "sha256:...",
  "holdoutStatus": "UNSEEN | REVEALED_PASS | REVEALED_FAIL | RETIRED",
  "mutationCorpusSha": "sha256:...",
  "logicVisualRequiredUidSetSha": "sha256:...",
  "logicVisualReviewedUidSetSha": "sha256:..."
}
```

---

## 35.2 Semantics Lock Evidence Parity

문항 evidence의 lock 객체와 집계 count는 직접 대조한다.

```text
SUBSET_SEMANTIC_DRIFT_PENDING_COUNT =
count(question where subsetSymbolSemanticsLock.driftStatus
      IN {DETECTED, PENDING_ADJUDICATION})

SUBSET_SEMANTIC_DRIFT_UNRESOLVED_COUNT =
count(question where subsetSymbolSemanticsLock.driftStatus == UNRESOLVED)

PROPOSITION_SEMANTIC_DRIFT_PENDING_COUNT =
count(question where propositionTermSemanticsLock.driftStatus
      IN {DETECTED, PENDING_ADJUDICATION})

PROPOSITION_SEMANTIC_DRIFT_UNRESOLVED_COUNT =
count(question where propositionTermSemanticsLock.driftStatus == UNRESOLVED)
```

`RESOLVED` row에는 다음이 모두 있어야 한다.

```text
effectiveMeaning/effectiveTermMeaning
authorityRef
adjudicationRef
adjudicatedBy
adjudicatedAt
```

하나라도 없으면 `RESOLVED`는 무효이며 `SEMANTICS_LOCK_EVIDENCE_PARITY_FAIL`.

---


# 36. WARN 처리

최종 semantic gate에는 `WARN`을 남기지 않는다.

작업 중 report signal로 WARN은 허용하지만:

```text
UNRESOLVED_LOGIC_VISUAL_WARN_COUNT
```

를 계산한다.

최종 Overlay PASS 조건:

```text
UNRESOLVED_LOGIC_VISUAL_WARN_COUNT == 0
```

모든 WARN은 최종적으로:

```text
PASS
FAIL
BLOCKED
NOT_APPLICABLE + reason
```

중 하나로 adjudicate한다.

---

# 36-1. Formal Overlay Denominator / Coverage Predicates

최종 C membership:

```text
FINAL_LOGIC_VISUAL_REQUIRED_COUNT =
count(LOGIC_VISUAL_REQUIRED_UID_SET)
```

denominator completeness:

```text
LOGIC_VISUAL_REVIEW_DENOMINATOR_COMPLETE == PASS iff
    C_DENOMINATOR_STATUS == FROZEN
AND C_DENOMINATOR_INPUT_SHA valid
AND LOGIC_VISUAL_REQUIRED_UID_SET_SHA valid
AND CORE_FINAL_C_REQUIRED_UID_SET_SHA valid
AND LOGIC_VISUAL_REQUIRED_UID_SET == CORE_FINAL_C_REQUIRED_UID_SET
AND FINAL_LOGIC_VISUAL_REQUIRED_COUNT == count(LOGIC_VISUAL_REQUIRED_UID_SET)
```

coverage:

```text
LOGIC_VISUAL_REVIEW_COVERAGE == 100% iff
    LOGIC_VISUAL_REVIEWED_UID_SET_SHA valid
AND LOGIC_VISUAL_REVIEWED_UID_SET == LOGIC_VISUAL_REQUIRED_UID_SET
AND LOGIC_VISUAL_ITEM_PASS_COUNT == FINAL_LOGIC_VISUAL_REQUIRED_COUNT
AND LOGIC_VISUAL_ITEM_FAIL_COUNT == 0
AND LOGIC_VISUAL_ITEM_BLOCKED_COUNT == 0
```

count와 UID-set equality 둘 다 필요하다.

---

# 37. Final Overlay Gate

본 절은 Core Final Seal이 아니다.

```text
LOGIC_VISUAL_OVERLAY_GATE == PASS
```

조건:

```text
RULE_ROUTING_BLOCKED == 0

V1_VISUAL_TRIAGE_COVERAGE_COUNT == FINAL_TARGET_COUNT
VISUAL_REQUIREMENT_ADJUDICATION_PENDING_COUNT == 0
VISUAL_REQUIREMENT_ADJUDICATION_UNRESOLVED_COUNT == 0
FINAL_VISUAL_REQUIREMENT_MAP_SHA valid

LOGIC_VISUAL_REVIEW_DENOMINATOR_COMPLETE == PASS
LOGIC_VISUAL_REVIEW_COVERAGE == 100%
LOGIC_VISUAL_REQUIRED_UID_SET_SHA valid
LOGIC_VISUAL_REVIEWED_UID_SET_SHA valid
LOGIC_VISUAL_REVIEWED_UID_SET == LOGIC_VISUAL_REQUIRED_UID_SET

REQUIRED_VISUAL_SATISFIER_MISSING == 0

VISUAL_EXEMPT_REASON_MISSING == 0
NOT_APPLICABLE_REASON_MISSING == 0

SPECIFICITY_EXCEPTION_PENDING_COUNT == 0
SPECIFICITY_EXCEPTION_REJECTED_BUT_USED_COUNT == 0
SPECIFICITY_EXCEPTION_INVALID_COUNT == 0

LOGIC_VISUAL_NECESSITY_PARITY_FAIL == 0
LOGIC_VISUAL_QUESTION_SPECIFICITY_PARITY_FAIL == 0
LOGIC_VISUAL_EXPECTED_FACT_PARITY_FAIL == 0
LOGIC_VISUAL_DECISIVE_STEP_PARITY_FAIL == 0
LOGIC_VISUAL_COMPLETENESS_PARITY_FAIL == 0
LOGIC_VISUAL_MEDIUM_FIT_PARITY_FAIL == 0
LOGIC_VISUAL_DUPLICATE_PARITY_FAIL == 0
LOGIC_VISUAL_SOLUTION_PARITY_FAIL == 0
LOGIC_VISUAL_ALT_CAPTION_PARITY_FAIL == 0

LOGIC_VISUAL_STATIC_CONTRACT_FAIL == 0
LOGIC_VISUAL_STATIC_CONTRACT_BLOCKED == 0
LOGIC_VISUAL_STATIC_CONTRACT_NOT_TESTED == 0
LOGIC_VISUAL_ACTION_PARITY_FAIL == 0
LOGIC_VISUAL_ANSWER_ONLY_FAIL == 0
LOGIC_VISUAL_TEXT_HEAVY_FAIL == 0
LOGIC_VISUAL_C_PRESENTATION_STATIC_PARITY_FAIL == 0

LOGIC_VISUAL_ITEM_FAIL_COUNT == 0
LOGIC_VISUAL_ITEM_BLOCKED_COUNT == 0
LOGIC_VISUAL_ITEM_PASS_COUNT == FINAL_LOGIC_VISUAL_REQUIRED_COUNT

EXPECTED_LOGICAL_FACT_SCHEMA_FAIL == 0
OBSERVED_VISUAL_FACT_SCHEMA_FAIL == 0
OBSERVED_VISUAL_FACT_NOT_TESTED == 0
SEMANTIC_PROJECTION_SPEC_FAIL == 0
EXPECTED_OBSERVED_SEMANTIC_SHA_MISMATCH_COUNT == 0

UNIVERSE_CONTRACT_FAIL == 0
SET_BOUNDARY_IDENTITY_FAIL == 0

SUBSET_SEMANTIC_DRIFT_PENDING_COUNT == 0
SUBSET_SEMANTIC_DRIFT_UNRESOLVED_COUNT == 0
PROPOSITION_SEMANTIC_DRIFT_PENDING_COUNT == 0
PROPOSITION_SEMANTIC_DRIFT_UNRESOLVED_COUNT == 0
SEMANTICS_LOCK_EVIDENCE_PARITY_FAIL == 0

UNRESOLVED_LOGIC_VISUAL_WARN_COUNT == 0

RULE_STATUS IN {CANDIDATE_QUALIFICATION_ONLY, ADOPTED}
EFFECTIVE_RULESET_SHA valid
RULE_ROUTING_BUNDLE_SHA valid
QUALIFICATION_INPUT_BUNDLE_SHA valid
C_DENOMINATOR_STATUS == FROZEN
C_DENOMINATOR_STALE_COUNT == 0
CALIBRATION_PASS == PASS
HOLDOUT_REGRESSION_PASS == PASS
HOLDOUT_STATUS == REVEALED_PASS
MUTATION_EXPECTED_DETECTOR_MAP_SHA valid
MUTATION_DETECTION_GATE_PASS == PASS
MUTATION_QUALIFICATION_CURRENT == PASS
LOGIC_VISUAL_QUALIFICATION_RENDER_PASS == PASS

LOGIC_VISUAL_EVIDENCE_SHA valid
```

그리고 Common Core 결박:

```text
LOGIC_VISUAL_OVERLAY_GATE == PASS
is necessary but not sufficient for
visualMathReviewStatus == PASS
```

최종 release는 Common Core의:

```text
C_REQUIRED_COVERAGE
C_REVIEW_INPUT_HASH
review independence
release SHA parity
D real render
PRESEAL
FINAL SEAL
```

을 추가로 통과해야 한다.

---

# 38. 기존 집합 anti-pattern 회귀 사례

본 규정은 최소 다음을 잡아야 한다.

## A. Generic concept card

```text
원소 후보 → 소속 여부 → 집합
```

실제 문항 fact 없음.

## B. Empty bucket

```text
강제 | 금지 | 자유
```

실제 원소 없음.

## C. Empty Venn

A/B 원만 있고 정답 영역/실제 relation 없음.

## D. Incomplete complement

`(A△B)^c`에서 `A∩B`만 강조하고 U 내부 바깥 영역 누락.

## E. Structural template reuse

숫자만 바꾼 동일 구조를 서로 다른 reasoning 문항에 재사용.

## F. Optional bypass

`VISUAL_OPTIONAL`인데 실제 SVG가 붙어 있으나 C 검수 생략.

모두 FAIL이어야 한다.

---

# 39. 명제 anti-pattern 회귀 사례

## A. Direction reversal

`p→q`인데 arrow는 q→p.

## B. Inclusion reversal

`p→q`인데 P가 Q를 포함.

## C. Contrapositive mislabeled

`¬p→¬q`를 대우라 표시.

## D. Quantifier domain loss

`모든 실수 x`의 부정에서 domain이 사라짐.

## E. Invalid counterexample

정의역 밖 값을 반례로 사용.

## F. Proof-order-only false pass

step 순서는 맞지만 중간 edge가 논리적으로 성립하지 않음.

## G. Incomplete case table

가능한 경우 하나 누락.

모두 targeted semantic gate가 잡아야 한다.

---

# 39-1. V1 / V2 / V3 실무 운영 부록

본 절은 **권장 운영 매핑**이다.
특정 상용 모델 이름 자체를 규정의 correctness 근거로 삼지 않는다.
핵심은 역할 분리·입력 가림·별도 session·evidence freeze다.

## 39-1.1 기본 역할

### Builder

권장:

```text
Codex
```

역할:

```text
BUILD_SIDE_MATH_RECHECK
solution 수정
visual 생성/수정
static tooling
local render 준비
```

금지:

```text
자기 산출물에 Final V1/V2/V3 PASS 부여
```

### V1 — Source-only Expected Fact

권장:

```text
ChatGPT independent review session
또는 Claude independent review session
```

입력은 §2.2 Source-only contract 그대로 제한한다.

Builder 대화/결과/solutionImage를 보지 않은 별도 session이어야 한다.

### V2 — Artifact-only Observed Fact

권장:

```text
V1과 다른 독립 session
가능하면 다른 reviewer/model family
```

예:

```text
V1 = ChatGPT
V2 = Claude
```

또는 반대.

V2는 source/expected/solution을 보지 않는다.

### V3 — Parity / Adjudication

권장:

```text
ChatGPT final reviewer
또는 별도 semantic verifier
```

V1/V2 frozen evidence를 비교한다.

충돌 시 기존 evidence를 덮어쓰지 않고 Common Core adjudication으로 보낸다.

### Gemini 등 보조 모델

보조 용도:

```text
holdout spot challenge
mutation adversarial review
render interpretation second opinion
ambiguous semantic case challenge
```

단독 PASS authority는 부여하지 않는다.

## 39-1.2 모델보다 중요한 독립성 조건

다른 모델을 썼다는 사실만으로 I2/I3가 자동 성립하지 않는다.

최소:

```text
SEPARATE_SESSION = YES
PRIOR_VERDICT_CONTEXT = NONE
REVIEW_INPUT_BUNDLE_SHA recorded
FIRST_PASS_EVIDENCE_FROZEN = YES
```

가 필요하다.

같은 모델도 별도 session + blind input이면 I2 가능하다.
다른 모델이라도 prior verdict/solution을 미리 봤으면 blind 독립성 실패다.

## 39-1.3 운영 규모 최적화

모든 문항에 세 모델을 고정 배치하는 것을 요구하지 않는다.

최소 계약:

```text
V1 = blind separate session
V2 = blind separate session
V3 = parity review
```

이다.

실무 권장:

```text
일반 C target:
  V1 / V2를 서로 분리한 2개의 독립 session
  V3는 frozen evidence parity

고위험 target:
  서로 다른 model family 사용 권장

고위험 정의 예:
  semantic drift
  complement / 3-set complex region
  quantifier negation
  proof-flow multi-edge
  prior reviewer conflict
  known-bad regression class
```

## 39-1.4 Batch 운영

독립성은 **문항마다 새 UI 대화창 하나를 강제한다는 뜻이 아니다.**

같은 blind review session에서 여러 문항을 batch 처리할 수 있다.
단:

```text
V1 batch에는 V1 허용 입력만 존재
V2 batch에는 V2 허용 입력만 존재
V1/V2 verdict cross-visibility 없음
각 questionUid별 first-pass evidence 별도 freeze
```

를 만족해야 한다.

권장 batch:

```text
20~50문항
```

단, context contamination이 의심되거나 고위험 문항이면 더 작게 나눈다.

## 39-1.5 운영 매핑은 provenance로 기록

각 review evidence에:

```text
reviewerRole = BUILDER | V1_EXPECTED | V2_OBSERVED | V3_PARITY | ADVERSARIAL_CHALLENGER
reviewerId
reviewModelOrAgent
reviewSessionId
inputVisibilityProfile
```

를 기록한다.

모델명 변경은 규정 위반이 아니다.
입력 가림·역할 분리·evidence freeze 위반이 규정 위반이다.

---


# 40. Adoption Checklist

현재 상태는:

```text
QUALIFICATION_READY
```

이다.

`ADOPTED`로 변경하기 전 반드시:

1. Common Core v1.2.10 충돌검수
2. 도형추출 v3.0 충돌검수
3. 명제 계획의 기존 visual type migration 확인
4. Candidate rule을 RULES_INDEX / MANIFEST / Codex routing에 `CANDIDATE_QUALIFICATION_ONLY`로 동일 SHA 등록
5. 집합 2021/2022 known-good / known-bad 재판정
6. typed fact schema + canonicalization spec + semantic projection spec 구현
7. 모든 final target V1 visual triage 100% 및 denominator freeze rehearsal
8. visual/dependency mutation 후 C denominator STALE → re-freeze rehearsal
9. V1/V2/V3 blind review 실제 실행
10. Calibration Set PASS
11. unseen Holdout 첫 실행 PASS
12. Adversarial Mutation PASS
13. qualification real `sol` render PASS
14. Common C evidence binding 확인
15. specificity exception approval flow test
16. subset/proposition drift pending-state closure test
17. Evidence Record semantics lock replay test
18. V1/V2/V3 batch blind-operation rehearsal
19. UID-set coverage SHA parity 확인
20. mutation detector map pre-freeze ordering 확인
21. EFFECTIVE_RULESET / projection / routing bundle stale test
22. 동일 final release SHA에서 final review 재실행
23. 위 qualification input이 바뀌지 않은 동일 rule SHA를 `ADOPTED`로 승격

이전에는 `ADOPTED` 선언 금지.

---

# 40-1. 상태 전이

문서 설계 closure를 마치고 qualification 실행 전제가 닫힌 상태:

```text
QUALIFICATION_READY
```

실제 qualification이 아직 수행되지 않았으므로 이 상태는 `ADOPTED`가 아니다.

최종:

```text
QUALIFICATION_READY
→ CANDIDATE_QUALIFICATION_ONLY registration
→ Calibration PASS
→ unseen Holdout PASS
→ Mutation PASS
→ Real Render PASS
→ Common C binding PASS
→ ADOPTED
```

Holdout FAIL 후 rule/tool을 수정했다면 해당 holdout은 RETIRED되고 새 unseen corpus가 필요하다.

---

# 41. 한 줄 운영 정의

> **집합·명제 전체 final target은 먼저 Source-only V1 visual triage를 100% 통과해 visualRequirement를 독립 확정하고, 최종 visual/dependency 상태를 포함한 C denominator input을 동결한다. 집합에서는 U·영역·경계·포함·원소·경우를, 명제에서는 방향·진리집합·양화사·반례·증명 edge를 typed canonical fact로 동결하며, artifact-only V2에서 OBSERVED semantic projection을 만든 뒤 V3에서 EXPECTED와 비교한다. 문항별 C semantic gate와 Common Core D real-render gate는 분리하고, qualification에서만 별도 real-render 시험을 강제한다. 본 Overlay PASS는 Common Core C PASS의 필요조건일 뿐 Release/Seal 권한을 갖지 않는다.**
