# JS아카이브 문항 메타 파운데이션 운영규칙 v1

작성일: 2026-09-19  
상태: `CANONICAL`  
개정 메모: `PACK / SHARD / COMPILED / OWNERSHIP 구조 반영`  
적용 대상: JS아카이브 문항 분류 메타데이터, 신규 JS metadata gate, Meta Foundation canonical/runtime/candidate 관리  
비적용 대상: `content`, `choices`, `answer`, `solution`, `image`, `layoutTag`, `wide`의 내용 수정

---

## 0. 목적

이 문서는 JS아카이브의 문항 분류 메타데이터를 다음 여섯 축으로 분리하고, 각 축의 권위·입고·확장·재생성 경계를 고정한다.

1. 교육과정 식별 메타
2. Primary Taxonomy L1~L4
3. Cross Concept 관계 메타
4. Condition Meta
5. Integration Pattern
6. 난이도 메타와 판정 evidence

이 문서는 실제 문항 evidence 없이 taxonomy·concept·condition을 임의 확장하기 위한 문서가 아니다.

정식 운영 원칙은 다음으로 고정한다.

```text
실제 문항
→ canonical metadata로 분류
→ 미등록/불충분 구조 발견 시 candidate proposal
→ evidence 검수
→ canonical 승격 승인
→ production JS 재매핑
→ runtime rebuild
→ forward/reverse audit
```

Candidate 생성은 자동화할 수 있으나 canonical 승격은 자동화하지 않는다.

---

# 1. Authority 구조

## 1.1 두 종류의 Source of Truth

정확한 권위 구분은 다음과 같다.

```text
JS
= 각 문항에 실제 적용된 canonical metadata value의 source of truth

Meta Foundation
= L3/L4/CrossConcept/Condition/alias/curriculum-binding
  key의 정의·의미·부모관계·상태의 canonical source of truth
```

JS에 어떤 문자열이 존재한다는 사실만으로 그 문자열이 canonical key가 되지 않는다.

## 1.2 기존 authority 보존

다음 기존 authority는 그대로 유지한다.

### L1/L2 및 교육과정 parent

- `standardUnitKey`
- `standardUnit`
- `standardUnitOrder`
- `subUnitKey`
- `subUnit`

공식 등록·parent 관계 authority:

- `JS아카이브_표준단원키_마스터테이블.md`
- compiled master JSON
- `JS아카이브_세부단원_운영규칙_v1.md`

Meta Foundation은 L1/L2를 재정의하지 않는다.

### 난이도

`difficultyBucket` 1~5의 정의·경계·confidence·boundary·legacy compatibility authority:

- `JS아카이브_difficultyBucket_5단계_운영규칙_v1.3.md`

기존 `level = 하 | 중 | 상` authority:

- 현행 JS schema
- 3차 검수 규칙

Meta Foundation은 난이도 정의를 복제하거나 재정의하지 않는다.

## 1.3 Meta Foundation이 정식 소유하는 범위

Meta Foundation v1은 다음을 canonical authority로 소유한다.

```text
problemTypeKey
templateKey
crossConceptKeys[]
conditionKeys[]
integrationPattern
alias
curriculum/L2 ↔ semantic L3 binding
curriculum applicability rule
candidate/runtime/canonical 경계
forward/reverse consistency audit
```

---

# 2. 정식 메타 구조

## 2.1 Curriculum Meta

교육과정 식별은 taxonomy level로 세지 않는다.

```text
curriculum
course / standardCourse
```

예:

```text
curriculum = 2022
standardCourse = 공통수학2
```

2015/2022 문항은 curriculum identity를 보존한다.
서로 대응하는 유형이 존재하더라도 한 교육과정 key를 다른 교육과정 key로 자동 변환하지 않는다.

## 2.2 Primary Taxonomy

학생 문제 분류용 정식 논리 계층은 아래 네 단계다.

```text
L1 = standardUnitKey
L2 = subUnitKey
L3 = problemTypeKey
L4 = templateKey
```

| Level | canonical field | 의미 |
|---|---|---|
| L1 | `standardUnitKey` | 공식 표준단원 |
| L2 | `subUnitKey` | L1 내부 공식 세부단원 |
| L3 | `problemTypeKey` | 무엇을 묻고 어떤 핵심 전략으로 푸는 문제인가 |
| L4 | `templateKey` | 같은 L3 안에서 조건 배치·풀이 골격까지 유사한 출제 템플릿 |

논리적 분류 경로는 항상:

```text
standardUnitKey
→ subUnitKey
→ problemTypeKey
→ templateKey
```

이다.

단, L3 semantic definition을 하나의 L2 레코드 안에 종속 저장하지 않는다.

## 2.3 Shared Semantic L3/L4 + Curriculum Binding

도형의 방정식 전수 Pilot에서 동일하거나 실질적으로 동일한 L3/L4가 2015/2022 및 서로 다른 L2에서 재사용되는 사례가 확인되었다.

따라서 정식 구조는 다음으로 고정한다.

```text
[semantic registry]
problemTypeKey
templateKey

+

[curriculum binding registry]
curriculum
standardCourse
standardUnitKey
subUnitKey
problemTypeKey
```

문항의 L3 유효성은 단순히 `problemTypeKey`가 존재하는지만 보지 않는다.

다음을 모두 만족해야 한다.

```text
1. standardUnitKey → subUnitKey parent 정상
2. (curriculum, standardCourse, standardUnitKey, subUnitKey, problemTypeKey)
   ACTIVE binding 존재
3. templateKey.parentProblemTypeKey == problemTypeKey
```

동일 semantic L3를 여러 curriculum/L2에서 재사용할 수 있다.

L4는 semantic registry에서 하나의 `parentProblemTypeKey`를 가진다.
L4의 curriculum별 사용 제한이 필요하면 §7의 curriculum applicability rule로 제어한다.

## 2.4 conceptClusterKey의 지위

`conceptClusterKey`는 Primary Taxonomy level이 아니다.

허용 용도:

- 검색 grouping
- compatibility
- 넓은 개념군 집계
- legacy 확장 태그 호환

금지:

```text
standardUnit
→ subUnit
→ conceptCluster
→ L3
→ L4
```

를 정식 taxonomy tree로 취급하는 것.

---

# 3. L3 / L4 경계

## 3.1 L3 — problemTypeKey

L3는 다음 질문에 답한다.

> 이 문항은 무엇을 구하거나 판정하며, 정답에 도달하는 핵심 전략은 무엇인가?

새 L3 생성 조건:

- 기존 L3에 넣으면 핵심 해결 목표 자체가 달라진다.
- 단순 숫자·표현·조건 위치 변화가 아니다.
- 실제 기출에서 독립 유형으로 재사용할 가치가 있다.
- 유사문제 검색·자동출제에서 기존 L3와 분리할 실익이 있다.

## 3.2 L4 — templateKey

L4는 다음 질문에 답한다.

> 같은 L3 안에서도 어떤 조건 구성과 decisive step 순서를 반복하는가?

새 L4 생성 조건:

- L3는 같지만 decisive 풀이 구조가 실질적으로 다르다.
- 단순 난이도 상승이 아니다.
- 단순 계수·숫자·보기 형식 변화가 아니다.
- CrossConcept 종류·개수만 다른 것이 아니다.
- 반복 가능한 출제 템플릿이다.

## 3.3 taxonomy와 다른 축의 분리

다음은 서로 다른 축이다.

```text
문제 유형 = L3
풀이 템플릿 = L4
결정적 추가 개념 = CrossConcept
값/범위 제한 = Condition
결합 방식 = IntegrationPattern
난이도 = level / difficultyBucket
```

다음 표현만으로 L3/L4를 만들지 않는다.

```text
심화
복합
재해석
최적화
고난도
CrossConcept 2개 이상
```

분석용 표현은 definition/internalDescription/internalSkeleton 또는 relational metadata로 내린다.

---

# 4. EDUCATIONAL_TERMINOLOGY_LOCK

## 4.1 canonicalLabelKo 원칙

학생·교사에게 노출될 수 있는 `canonicalLabelKo`는 실제 한국 학교 수학 교육 현장에서 통용되는 용어를 우선한다.

우선순위:

```text
1. 공식 국가 교육과정·공개 교육자료에서 직접 확인된 표현
2. 표준 교과서·주요 문제집에서 반복 사용되는 표현
3. 기존 프로젝트 canonical에서 이미 안정적으로 쓰는 표현
4. 위 근거가 불충분하면 candidate 유지
```

## 4.2 금지

다음과 같은 내부 분석어를 근거 없이 canonicalLabelKo로 만들지 않는다.

```text
매개변수와 무관한 공통점
도형의 좌표 구성
복합 처리
재해석형
최적화형
조건 결합형
```

실제 교육현장 용어가 확인되지 않으면:

- `definition`
- `internalDescription`
- `internalSkeleton`
- `integrationPattern`
- candidate evidence

중 하나로 내린다.

## 4.3 용어 evidence

외부 용어 검증의 URL·자료명·검토 기록은 promotion evidence/sidecar에 둔다.

canonical registry에는 최종적으로 승인된:

```text
key
canonicalLabelKo
definition
aliases[]
status
```

를 저장하고, evidence를 authority와 혼합하지 않는다.

---

# 5. Cross Concept

## 5.1 정의

Cross Concept는 다음으로 정의한다.

> Primary L1~L4 이외에서, 정답에 도달하는 결정적 풀이 경로에 실제로 필요한 canonical 수학 개념.

판정 질문:

```text
이 개념을 사용할 수 없으면
문항의 decisive step을 통과해 정답에 도달할 수 있는가?
```

`NO`이면 CrossConcept 후보가 된다.

## 5.2 CrossConcept가 아닌 것

다음은 CrossConcept로 기록하지 않는다.

- 단순 등장한 개념
- 그림에만 보이는 도형 요소
- primary L1~L4에 이미 포함된 핵심 골격
- 값의 부호·정수·자연수·범위 같은 제한 조건
- `CASE_BRANCH` 같은 결합 방식
- 최대·최소라는 목표 표현 자체
- 내부 분석 행동

## 5.3 문항 저장 구조

문항은 concept registry의 canonical key만 참조한다.

```js
crossConceptKeys: [
  "CC_POINT_LINE_DISTANCE",
  "CC_DISCRIMINANT",
  "CC_TRIANGLE_AREA"
]
```

금지:

- `standardUnitKey`를 CrossConcept로 저장
- `subUnitKey`를 CrossConcept로 저장
- `problemTypeKey`를 CrossConcept로 저장
- 자유 텍스트 혼합
- alias를 canonical field에 저장
- Primary와 동일 의미 중복 저장

## 5.4 Concept Registry 최소 계약

```text
conceptKey
canonicalLabelKo
definition
aliases[]
taxonomyRefs[]
status
```

`taxonomyRefs[]`는 many-to-many 관계다.

하나의 concept를 단일 canonical taxonomy node에 강제로 귀속하지 않는다.

## 5.5 CrossConcept Count

`crossConceptCount`는 JS canonical source field로 저장하지 않는다.

```text
crossConceptCount
= unique(valid ACTIVE crossConceptKeys).length
```

runtime/index에서 캐시할 수 있으나 source of truth는 `crossConceptKeys[]`다.

---

# 6. Condition Meta

## 6.1 정의

Condition Meta는 다음으로 정의한다.

> 문항의 미지수·좌표·매개변수·해·후보값에 적용되는 값·부호·범위 제한 중, 실제 해 선택이나 decisive step에 영향을 주는 canonical condition.

Condition은 수학 개념 자체를 의미하는 CrossConcept와 분리한다.

## 6.2 초기 canonical Condition Registry

v1의 초기 canonical condition key는 다음 여섯 개로 고정한다.

```text
COND_INTEGER
COND_NATURAL_NUMBER
COND_POSITIVE
COND_NEGATIVE
COND_RANGE
COND_NONZERO
```

의미:

| conditionKey | canonicalLabelKo | 의미 |
|---|---|---|
| `COND_INTEGER` | 정수 조건 | 값이 정수여야 하는 제한 |
| `COND_NATURAL_NUMBER` | 자연수 조건 | 값이 자연수여야 하는 제한 |
| `COND_POSITIVE` | 양수 조건 | 값이 0보다 커야 하는 제한 |
| `COND_NEGATIVE` | 음수 조건 | 값이 0보다 작아야 하는 제한 |
| `COND_RANGE` | 범위 조건 | 허용 구간·범위가 실제 해 선택에 필요한 제한 |
| `COND_NONZERO` | 0이 아닌 조건 | 0 배제 조건이 정의·비퇴화·해 선택에 필요한 제한 |

신규 condition이 필요하면 candidate proposal → evidence review → canonical 승인 절차를 따른다.

## 6.3 금지되는 transitional key

다음 key는 canonical로 승격하지 않는다.

```text
COND_INTEGER_OR_NATURAL
CC_INTEGER_CONDITION
```

정수와 자연수는 source evidence를 기준으로 각각:

```text
COND_INTEGER
COND_NATURAL_NUMBER
```

로 분리한다.

## 6.4 문항 저장 구조

```js
conditionKeys: [
  "COND_INTEGER",
  "COND_POSITIVE"
]
```

동일 key를 중복 저장하지 않는다.

## 6.5 Condition Count

`conditionCount`는 JS source field로 저장하지 않는다.

```text
conditionCount
= unique(valid ACTIVE conditionKeys).length
```

---

# 7. Curriculum Applicability

## 7.1 목적

semantic L3/L4는 교육과정 간 공유할 수 있으나, 특정 유형이 특정 교육과정의 핵심 범위에 속하는지는 별도 관리한다.

## 7.2 canonical 값

```text
curriculumApplicability:
- CORE
- SUPPLEMENTARY_OUTSIDE_CORE
```

의미:

- `CORE`: 해당 교육과정의 기본 출제·추천 pool에서 사용 가능
- `SUPPLEMENTARY_OUTSIDE_CORE`: source archive에는 보존하되 기본 자동출제 pool에서는 제외

## 7.3 defaultSelectable

```text
CORE
→ defaultSelectable = true

SUPPLEMENTARY_OUTSIDE_CORE
→ defaultSelectable = false
```

예외적으로 실제 source 시험에 존재하는 문항을 삭제하거나 다른 교육과정 개념으로 왜곡하지 않는다.

## 7.4 저장 위치

curriculum applicability는 semantic taxonomy definition 자체를 변형하지 않는다.

`curriculum_bindings.json`의 `applicabilityRules[]`에 둔다.

적용 대상은 필요에 따라:

- problemType
- template

가 될 수 있다.

---

# 8. Integration Pattern

문항은 다음 canonical 값 중 대표 하나를 사용한다.

```text
NONE
SEQUENTIAL
INTERDEPENDENT
REINTERPRETATION
CASE_BRANCH
DEEP_COMPOSITE
```

| 값 | 의미 |
|---|---|
| `NONE` | primary taxonomy만으로 해결 |
| `SEQUENTIAL` | A 결과 후 B, C를 순차 적용 |
| `INTERDEPENDENT` | 둘 이상의 개념이 상호 의존해야 decisive step 성립 |
| `REINTERPRETATION` | 한 개념의 결과를 다른 개념 언어로 재해석 |
| `CASE_BRANCH` | 경우·범위·조건별 분기 필요 |
| `DEEP_COMPOSITE` | 여러 구조가 반복 상호 의존하여 단일 선형 흐름으로 축약 어려움 |

세부 근거는 sidecar/evidence에 둔다.

Condition이 존재한다는 이유만으로 자동으로 `CASE_BRANCH`를 부여하지 않는다.

---

# 9. 난이도와의 관계

## 9.1 기존 난이도 authority 유지

```text
level = 하 | 중 | 상
difficultyBucket = 1 | 2 | 3 | 4 | 5 | UNKNOWN
```

상세 정의는 `JS아카이브_difficultyBucket_5단계_운영규칙_v1.3.md`를 따른다.

## 9.2 Foundation metadata는 난이도 evidence

검토 가능한 evidence:

```text
crossConceptKeys[]
derived crossConceptCount
conditionKeys[]
integrationPattern
condition reinterpretation
case branch
strategy selection load
algebra load
reasoning depth
previous level
reassessed level
previous difficultyBucket
reassessed difficultyBucket
```

금지:

```text
crossConceptCount >= 3
=> difficultyBucket = 4
```

같은 기계적 단일 규칙.

CrossConcept·Condition·IntegrationPattern은 기존 difficulty authority를 보조할 뿐 대체하지 않는다.

---

# 10. 신규 JS 메타 계약

## 10.1 Foundation 적용 대상 필드

신규 JS 및 Foundation 업그레이드가 완료된 문항의 목표 canonical metadata는 다음과 같다.

```js
{
  problemTypeKey: "",
  templateKey: "",
  crossConceptKeys: [],
  conditionKeys: [],
  integrationPattern: "NONE",

  difficultyBucket: "UNKNOWN",
  difficultyConfidence: "UNKNOWN",
  difficultyBoundaryFlag: "UNKNOWN",
  legacyLevelCompatibility: "UNKNOWN"
}
```

`conceptClusterKey`는 grouping/compatibility 목적의 승인 확장 필드로 유지할 수 있다.

## 10.2 Legacy 기존 문항

기존 production JS 전체를 Foundation 채택과 동시에 일괄 재작성하지 않는다.

legacy 기존 문항은 L3/L4/CrossConcept/Condition 필드가 아직 없을 수 있다.

단:

```text
canonical field가 존재하면
→ 반드시 현재 canonical registry의 유효 key만 허용
```

한다.

신규 JS 또는 Foundation upgrade 완료 문항은 해당 시점의 canonical metadata gate를 통과해야 한다.

## 10.3 Production Gate

production canonical metadata에 미등록·deprecated·candidate key를 허용하지 않는다.

최소 hard gate:

```text
unregistered problemTypeKey > 0 => FAIL
unregistered templateKey > 0 => FAIL
unregistered crossConceptKey > 0 => FAIL
unregistered conditionKey > 0 => FAIL
invalid/deprecated key in use > 0 => FAIL
broken standardUnit→subUnit parent > 0 => FAIL
missing/broken L2↔L3 binding > 0 => FAIL
broken L4→L3 parent > 0 => FAIL
noncanonical alias in canonical field > 0 => FAIL
duplicate crossConceptKey > 0 => FAIL
duplicate conditionKey > 0 => FAIL
invalid integrationPattern > 0 => FAIL
```

---

# 11. Registry 계약

## 11.1 Taxonomy Registry

### problemType 최소 필드

```text
problemTypeKey
canonicalLabelKo
definition
aliases[]
status
```

### template 최소 필드

```text
templateKey
canonicalLabelKo
definition
aliases[]
internalSkeleton
parentProblemTypeKey
status
```

supporting UID는 promotion evidence에 두며 canonical definition의 필수 필드로 강제하지 않는다.

## 11.2 Concept Registry

```text
conceptKey
canonicalLabelKo
definition
aliases[]
taxonomyRefs[]
status
```

## 11.3 Condition Registry

```text
conditionKey
canonicalLabelKo
definition
aliases[]
status
```

## 11.4 Alias Registry

```text
alias
targetKey
targetType
status
```

alias는 lookup/compatibility에 사용한다.

production canonical field에는 alias 문자열을 넣지 않는다.

## 11.5 Curriculum Binding Registry

`curriculum_bindings.json`은 두 종류의 레코드를 가진다.

### bindings[]

L2와 semantic L3의 허용 관계:

```text
curriculum
standardCourse
standardUnitKey
subUnitKey
problemTypeKey
status
```

### applicabilityRules[]

curriculum별 L3/L4 기본 사용 제한:

```text
curriculum
standardUnitKey
targetType
targetKey
curriculumApplicability
defaultSelectable
reason
status
```

---

# 12. Candidate와 Canonical 승격

## 12.1 자동 허용 범위

자동화가 할 수 있는 것:

- 미등록 후보 탐지
- candidate proposal 생성
- supporting questionUid 수집
- 중복 후보 검색
- 기존 canonical과 semantic similarity report 생성
- runtime usage/distribution 재생성
- reverse candidate duplication report 생성

자동화가 해서는 안 되는 것:

- canonical key 자동 승격
- canonical definition 자동 변경
- production JS에 미등록 key 허용
- alias 충돌 자동 해결
- merge/split/rename 자동 확정
- candidate를 production canonical field에 직접 기록

## 12.2 Candidate-only 임시 표현

예:

```yaml
proposalType: NEW_L4
proposedKey: CIRCLE_TANGENCY_POINT_DISTANCE
proposedLabel: 중심과 직선 사이의 거리로 접함 조건 판정
supportingQuestionUids:
  - ...
status: REVIEW_REQUIRED
```

정식 승인 후 canonical key를 발급하고 문항을 다시 매핑한다.

## 12.3 Taxonomy Action

허용값:

```text
KEEP
MERGE
SPLIT
RENAME
ADD
ASSIGN_NEW
NO_CHANGE
```

정의:

- `KEEP`: 기존 definition과 item mapping 유지
- `MERGE`: 동일 semantic key를 통합
- `SPLIT`: 하나의 key가 서로 다른 반복 풀이 구조를 과도하게 합침
- `RENAME`: semantic은 유지하되 canonical label/key 표현 정제
- `ADD`: registry에 신규 canonical definition 후보 생성
- `ASSIGN_NEW`: 생성·승인된 신규 key를 item에 부여
- `NO_CHANGE`: 해당 레벨 변경 없음

`ADD`와 `ASSIGN_NEW`를 item-level action에서 혼용하지 않는다.

---

# 13. OUT_OF_SCOPE Routing 계약

## 13.1 원칙

현재 단원에서 Primary가 아니라고 판정된 문항을 삭제하거나 억지 분류하지 않는다.

현재 단원 ledger에는 `OUT_OF_SCOPE` 기록을 남기고 목적 단원 후보로 라우팅한다.

## 13.2 routing evidence

candidate/evidence sidecar에 최소 다음을 기록한다.

```text
questionUid
sourceJsPath
qid
scopeStatus = OUT_OF_SCOPE
targetUnitCandidate
outOfScopeReason
outOfScopeEvidence
reviewStatus
```

## 13.3 금지

OUT_OF_SCOPE 문항에 현재 단원의:

```text
finalProblemTypeKey
finalTemplateKey
crossConceptKeys
conditionKeys
difficultyBucket
integrationPattern
```

을 억지 확정하지 않는다.

관찰된 개념은 `outOfScopeEvidence.observedConcepts`에 둘 수 있다.

## 13.4 재편입

같은 Foundation group 내부 목적 단원으로 귀속이 확정되면 통합 adjudication 단계에서 새 단원 inventory에 편입할 수 있다.

그룹 밖이면 routing queue에 남겨 해당 목적 단원 작업 때 다시 판정한다.

production `standardUnitKey`/`subUnitKey` 실제 변경은 별도 승인된 migration에서 수행한다.

---

# 14. Meta Foundation 저장·분할 아키텍처

## 14.1 기본 원칙

Meta Foundation의 canonical 데이터를 학년 전체나 전 과정 전체의 단일 대형 파일로 직접 관리하지 않는다.

정식 운영 단위는 다음 네 층으로 분리한다.

```text
RULES
= 전역 운영규칙

PACK
= 대단원/수학 영역 단위의 L3/L4 canonical 작업·승격 단위

SHARD
= 여러 Pack이 공유하는 CrossConcept canonical 소유 단위

COMPILED
= ACTIVE Pack/Shard를 기계적으로 합친 전역 조회·검증용 파생본
```

핵심 원칙:

> 사람이 수정하는 정본은 Pack/Shard이고, 전역 Compiled Foundation은 기계 생성물이다.

## 14.2 Foundation Pack

Foundation Pack은 하나의 안정적인 수학 영역을 소유한다.

권장 Pack 크기는 다음과 같은 **대단원 수준**이다.

```text
POLYNOMIALS
EQUATIONS_INEQUALITIES
GEOMETRY_EQUATIONS
SETS_PROPOSITIONS
FUNCTIONS_GRAPHS
COUNTING
MATRICES
...
```

학년 전체를 하나의 Pack으로 만들지 않는다.

또한 특별한 이유 없이 다음처럼 지나치게 잘게 쪼개지 않는다.

```text
평면좌표 Pack
직선의 방정식 Pack
원의 방정식 Pack
도형의 이동 Pack
```

서로 강하게 연관되고 같은 중단원 영역에서 함께 사용하는 경우:

```text
GEOMETRY_EQUATIONS Pack
= 평면좌표
+ 직선의 방정식
+ 원의 방정식
+ 도형의 이동
```

처럼 하나의 Pack으로 관리한다.

교육과정이 다르더라도 semantic domain이 같으면 같은 Pack에서 다룰 수 있다.
단, curriculum identity와 L1/L2 key는 그대로 보존한다.

## 14.3 Pack 최소 계약

각 Pack은 최소 다음 파일 또는 동등한 구조를 가진다.

```text
pack.json
taxonomy.json
bindings.json
aliases.json
```

`pack.json` 최소 필드:

```text
packId
packVersion
canonicalStatus
ownedStandardUnitDomains[]
ownedProblemTypeKeyPrefixes[]
active
schemaVersion
```

`taxonomy.json`:

- 해당 Pack이 소유하는 L3 problemType
- 해당 Pack이 소유하는 L4 template

`bindings.json`:

- curriculum/L2 ↔ L3 binding
- curriculum applicability rule

`aliases.json`:

- 해당 Pack 소유 taxonomy key의 alias

## 14.4 Pack 경계

Pack은 **작업 편의만을 위해 semantic authority를 중복 소유하지 않는다.**

하나의 `problemTypeKey` 또는 `templateKey`는 정확히 하나의 `ownerPack`만 가진다.

예:

```json
{
  "problemTypeKey": "PT_CIRCLE_TANGENT",
  "ownerPack": "GEOMETRY_EQUATIONS"
}
```

다른 Pack은 이 key를 참조할 수 있지만 정의·rename·parent 변경을 직접 수행할 수 없다.

## 14.5 CrossConcept Shard

CrossConcept는 특정 Pack에 종속시키지 않는다.

여러 Pack에서 공유될 수 있으므로 별도의 concept shard가 canonical owner가 된다.

예시:

```text
concepts/
├ algebra.json
├ coordinate-geometry.json
├ functions.json
├ logic.json
├ counting.json
└ geometry.json
```

예:

```json
{
  "conceptKey": "CC_DISCRIMINANT",
  "ownerConceptShard": "ALGEBRA"
}
```

다른 Pack은 `CC_DISCRIMINANT`를 참조할 수 있으나 재정의하지 않는다.

## 14.6 Condition Registry의 소유

Condition은 범용성이 높고 수가 작으므로 v1에서는 전역 core registry 하나로 관리한다.

초기 canonical condition:

```text
COND_INTEGER
COND_NATURAL_NUMBER
COND_POSITIVE
COND_NEGATIVE
COND_RANGE
COND_NONZERO
```

Condition을 Pack마다 복제하지 않는다.

## 14.7 Ownership Lock

다음 ownership invariant를 HARD rule로 사용한다.

```text
problemTypeKey
→ exactly one ownerPack

templateKey
→ exactly one ownerPack

conceptKey
→ exactly one ownerConceptShard

conditionKey
→ CONDITION_CORE
```

다음은 FAIL이다.

```text
동일 key를 두 Pack이 정의
동일 L4를 서로 다른 ownerPack이 재정의
다른 Pack이 타 Pack key의 canonicalLabel/definition/parent를 수정
동일 conceptKey를 두 concept shard가 정의
```

필수 실패 코드:

```text
DUPLICATE_KEY_OWNER
CROSS_PACK_REDEFINITION
CROSS_SHARD_REDEFINITION
OWNER_MISMATCH
```

## 14.8 Registry Index

전역 `registry_index.json`은 ACTIVE Pack/Shard와 버전·hash를 나열한다.

최소 구조:

```text
schemaVersion
activePacks[]
activeConceptShards[]
conditionRegistry
compiledArtifact
```

각 Pack/Shard 항목에는 최소 다음을 둔다.

```text
id
version
status
sha256
```

`registry_index.json`은 어떤 canonical source가 현재 ACTIVE인지 결정하는 entry point다.

## 14.9 Candidate와 Evidence의 Pack 격리

candidate와 evidence도 Pack별로 분리한다.

예:

```text
candidates/
├ geometry-equations/
├ polynomials/
├ equations-inequalities/
├ sets-propositions/
└ functions-graphs/

evidence/
├ geometry-equations/
│  └ v1/
├ polynomials/
└ ...
```

Pack 작업자는 자신의 candidate/evidence 범위만 수정한다.

다른 Pack의 candidate·evidence 파일을 함께 재작성하지 않는다.

## 14.10 Compiled Foundation

Compiled Foundation은 ACTIVE Pack/Shard를 기계적으로 합친 파생본이다.

예:

```text
compiled/
├ taxonomy_registry.json
├ concept_registry.json
├ condition_registry.json
├ aliases.json
├ curriculum_bindings.json
└ meta_foundation_compiled.json
```

절대 규칙:

> `compiled/`는 사람이 직접 수정하지 않는다.

Compiled 파일을 직접 수정한 흔적이 있으면 FAIL 처리하고 Pack/Shard source에서 다시 생성한다.

## 14.11 Compiled의 권위

Compiled Foundation은 validator/runtime이 빠르게 조회하기 위한 **파생 artifact**다.

권위 우선순위:

```text
Pack / Concept Shard / Condition Core
> Compiled Foundation
```

Pack/Shard와 compiled가 다르면 compiled를 정답으로 삼지 않는다.

```text
SOURCE_COMPILED_PARITY_FAIL
```

로 처리하고 compile을 다시 수행한다.

## 14.12 Global Compile Gate

Global compiler는 최소 다음 순서로 검사한다.

```text
1. registry_index의 ACTIVE Pack/Shard 로드
2. schema validation
3. key uniqueness
4. owner uniqueness
5. L4→L3 parent integrity
6. curriculum/L2↔L3 binding integrity
7. CrossConcept/Condition existence
8. alias collision
9. candidate/deprecated key leakage
10. curriculum applicability integrity
11. compiled registry 생성
12. manifest/hash 생성
```

다음 중 하나라도 0이 아니면 compiled promotion을 금지한다.

```text
duplicate key
duplicate owner
broken parent
broken binding
alias collision
unregistered reference
candidate leakage
deprecated active reference
```

## 14.13 Pack Promotion

Pack 승격은 다른 Pack을 재작성하지 않는 atomic transaction으로 처리한다.

```text
candidate Pack
→ Pack 독립검수
→ owner/key/binding/alias 검수
→ ACTIVE Pack 승격
→ global compile
→ global collision regression
→ compiled 갱신
```

Global compile이 FAIL이면:

```text
새 Pack 승격분 rollback
다른 ACTIVE Pack은 변경하지 않음
```

을 원칙으로 한다.

## 14.14 병렬 작업 안전성

여러 작업자가 동시에 다음처럼 진행할 수 있다.

```text
작업 A → POLYNOMIALS
작업 B → SETS_PROPOSITIONS
작업 C → FUNCTIONS_GRAPHS
작업 D → GEOMETRY_EQUATIONS
```

각 작업은 자기 Pack candidate만 수정한다.

병렬 작업 중 금지:

```text
compiled 직접 수정
다른 Pack canonical 파일 수정
전역 registry 전체를 자기 작업 결과로 통째로 덮어쓰기
오래된 compiled 파일을 canonical source로 역수입
```

## 14.15 Versioning

버전은 두 층으로 분리한다.

### Foundation Rules / Schema Version

다음이 바뀔 때만 올린다.

- taxonomy 구조
- registry 계약
- ownership 규칙
- validation 의미
- canonical/candidate/runtime 경계

### Pack / Shard Version

다음은 해당 Pack 또는 Shard 버전만 올린다.

- L3/L4 추가·병합·분리·rename
- definition 정제
- alias 변경
- binding/applicability 변경
- CrossConcept 정의 변경

예:

```text
Foundation schemaVersion = 1

GEOMETRY_EQUATIONS packVersion = 1.0.0
SETS_PROPOSITIONS packVersion = 1.2.0
ALGEBRA conceptShardVersion = 1.1.0
```

한 Pack의 작은 taxonomy 수정 때문에 Foundation 전체 규칙 버전을 올리지 않는다.

## 14.16 Dependency Invalidation

Pack 수정은 원칙적으로 해당 Pack evidence만 stale 처리한다.

```text
Pack 수정
→ 해당 Pack evidence stale
→ compiled stale
→ 해당 Pack + global collision regression
```

다른 독립 Pack의 기존 evidence를 자동 무효화하지 않는다.

공유 Concept Shard를 수정한 경우에는 해당 concept를 참조하는 Pack만 영향 대상으로 계산한다.

```text
Concept Shard 수정
→ affectedConceptKeys 계산
→ affected Pack dependency closure 계산
→ affected Pack만 targeted regression
→ compiled 재생성
```

전역 전체를 무조건 다시 판독하지 않는다.

## 14.17 권장 디렉터리

```text
archive/data/meta-foundation/
├ canonical/
│  ├ registry_index.json
│  ├ packs/
│  │  ├ geometry-equations/
│  │  │  ├ pack.json
│  │  │  ├ taxonomy.json
│  │  │  ├ bindings.json
│  │  │  └ aliases.json
│  │  ├ polynomials/
│  │  ├ equations-inequalities/
│  │  ├ sets-propositions/
│  │  └ functions-graphs/
│  │
│  ├ concepts/
│  │  ├ algebra.json
│  │  ├ coordinate-geometry.json
│  │  ├ functions.json
│  │  ├ logic.json
│  │  ├ counting.json
│  │  └ geometry.json
│  │
│  └ condition_registry.json
│
├ candidates/
│  ├ geometry-equations/
│  ├ polynomials/
│  ├ equations-inequalities/
│  ├ sets-propositions/
│  └ functions-graphs/
│
├ evidence/
│  ├ geometry-equations/
│  ├ polynomials/
│  └ ...
│
├ compiled/
│  ├ taxonomy_registry.json
│  ├ concept_registry.json
│  ├ condition_registry.json
│  ├ aliases.json
│  ├ curriculum_bindings.json
│  └ meta_foundation_compiled.json
│
└ runtime/
   ├ taxonomy_usage.json
   ├ cross_concept_usage.json
   ├ condition_usage.json
   ├ binding_usage.json
   ├ difficulty_distribution.json
   ├ combination_stats.json
   ├ orphan_keys.json
   ├ unused_keys.json
   ├ unregistered_keys.json
   └ meta_foundation_runtime.json
```

실제 저장소 적용 시 기존 구조와 충돌이 있으면 사용자 승인 하에 물리 경로만 조정할 수 있다.

다음 의미는 변경할 수 없다.

```text
Pack = taxonomy 작업/승격 단위
Shard = shared concept 소유 단위
Compiled = read-only derived global artifact
Ownership = canonical 수정 권한 경계
```

---

# 15. Rebuild 계약

`Meta Foundation rebuild`와 `global compile`은 canonical Pack/Shard를 수정하지 않는다.

```text
ACTIVE Pack / Concept Shard / Condition Core
→ global compile
→ compiled Foundation

compiled Foundation
+
production JS
→ runtime
```

재생성 가능:

- taxonomy usage
- CrossConcept usage
- Condition usage
- binding usage
- difficulty distribution
- concept/condition combinations
- orphan/unused report
- unregistered report
- runtime index

재생성 금지:

- taxonomy definition
- concept definition
- condition definition
- canonical aliases
- curriculum binding canonical
- canonical status

---

# 16. 양방향 Consistency Audit

## 16.1 Forward Audit

문항별 검사:

```text
standardUnitKey canonical?
→ subUnitKey canonical + parent 정상?
→ problemTypeKey ACTIVE?
→ L2↔L3 ACTIVE binding 존재?
→ templateKey ACTIVE + L4→L3 parent 정상?
→ crossConceptKeys 전부 ACTIVE?
→ conditionKeys 전부 ACTIVE?
→ 중복 key 없음?
→ integrationPattern canonical?
→ alias가 canonical field에 들어오지 않았는가?
```

필수 실패 코드:

```text
UNREGISTERED_L3
UNREGISTERED_L4
UNREGISTERED_CROSS_CONCEPT
UNREGISTERED_CONDITION
DEPRECATED_METADATA_KEY_IN_USE
BROKEN_L1_L2_PARENT
BROKEN_L2_L3_BINDING
BROKEN_L4_PARENT
NONCANONICAL_ALIAS_IN_JS
DUPLICATE_RELATIONAL_KEY
INVALID_INTEGRATION_PATTERN
```

curriculum applicability가 `SUPPLEMENTARY_OUTSIDE_CORE`인 template를 기본 자동출제 pool에서 선택하면:

```text
CURRICULUM_APPLICABILITY_DEFAULT_POOL_VIOLATION
```

으로 차단한다.

## 16.2 Reverse Audit

registry별 검사:

```text
canonical key
→ parent/binding 존재?
→ 실제 사용 문항 수?
→ alias 충돌?
→ 동일 의미 canonical 중복?
→ 같은 의미 candidate 중복?
→ deprecated key production 사용?
→ Condition/CrossConcept 역할 혼입?
```

필수 탐지 코드:

```text
ORPHAN_KEY
UNUSED_ACTIVE_KEY
DUPLICATE_SEMANTIC_KEY
ALIAS_COLLISION
CANDIDATE_DUPLICATES_CANONICAL
DEPRECATED_METADATA_KEY_IN_USE
BROKEN_L2_L3_BINDING
BROKEN_L4_PARENT
CROSSCONCEPT_CONDITION_ROLE_COLLISION
```

`UNUSED_ACTIVE_KEY`는 즉시 FAIL로 고정하지 않고 registry hygiene review 대상으로 둘 수 있다.

---

# 17. 신규 JS 입고 파이프라인

```text
JS 생성
→ node --check
→ schema validation
→ L1/L2 master validation
→ Meta Foundation canonical metadata validation
→ curriculum applicability validation
→ 미등록/invalid key 존재?
   ├ YES
   │  → production STOP
   │  → candidate proposal/evidence 생성
   │  → canonical review
   │  → 승인 후 canonical key 발급
   │  → JS 재매핑
   │  → metadata validation 재실행
   └ NO
      → DB / question-index 갱신
      → runtime Foundation rebuild
      → forward audit
      → reverse audit
      → PASS
```

핵심 invariant:

> Production JS는 모든 taxonomy·CrossConcept·Condition key와 L2↔L3 binding이 현재 canonical registry에서 유효한 경우에만 입고할 수 있다.

---

# 18. 모델/실행기 독립성

정본 문서에는 특정 모델명을 authority로 두지 않는다.

원칙:

> 분류 실행기는 문항을 전수 분석하여 taxonomy·CrossConcept·Condition·난이도 후보와 근거를 생성한다. 신규 taxonomy/concept/condition의 canonical 승격은 정해진 검수·승격 절차를 통과한 경우에만 허용한다.

모델 교체는 canonical definition 자체를 stale로 만들지 않는다.

다음이 바뀔 때만 관련 evidence를 stale 처리한다.

- 판정 규칙
- registry
- schema
- validator
- curriculum binding
- difficulty authority

---

# 19. 도형의 방정식 Pilot 채택 기록

## 19.1 범위

Foundation v1 구조 검증에 사용한 최초 통합 Pilot이자
첫 Foundation Pack 후보는 `GEOMETRY_EQUATIONS`다.

범위:

- 평면좌표
- 직선의 방정식
- 원의 방정식
- 도형의 이동

2015/2022 curriculum identity를 보존한 채 하나의 Foundation group에서 병합 검증했다.

`GEOMETRY_EQUATIONS`는 Foundation Pack identifier다.

기존 Pilot에서 사용한 `H1-GEOMETRY_EQUATIONS_FOUNDATION`은 역사적 group identifier로만 취급하며
`standardUnitKey`로 사용하지 않는다.

기존 실제 standardUnitKey를 대체하지 않는다.

## 19.2 통합 Candidate 기준 수치

2026-09-19 통합 Candidate 기준:

```text
active unique item evidence: 400
L3 problemType: 36
L4 template: 126
CrossConcept: 48
Condition registry target: 6
curriculum/L2 binding: 75
alias: 126
```

이 수치는 Foundation v1 구조 채택의 Pilot evidence다.
전역 canonical registry의 영구 고정 총량을 의미하지 않는다.

## 19.3 Pilot에서 정식 규칙으로 승격된 사항

- shared semantic L3/L4 + curriculum/L2 binding
- Condition Meta 독립 축
- `CC_INTEGER_CONDITION`의 Condition 이동
- 정수/자연수 조건 분리
- EDUCATIONAL_TERMINOLOGY_LOCK
- OUT_OF_SCOPE routing queue
- curriculum applicability + `defaultSelectable`
- alias semantic target 검수
- global key collision 검수
- candidate/runtime/canonical 역할 분리 강화

## 19.4 Pilot data와 규칙 승격의 분리

본 문서는 Foundation **운영규칙 v1의 CANONICAL**이다.

도형의 방정식 400문항 통합 데이터의 canonical registry promotion은 별도 transaction으로 관리한다.

2026-09-19 최초 `GEOMETRY_EQUATIONS` Pack 승격에서는 다음을 완료했다.

```text
1. transitional COND_INTEGER_OR_NATURAL 16건을 current Git main source wording으로 재확인하여
   COND_INTEGER / COND_NATURAL_NUMBER / 기존 canonical Condition으로 분리
2. 400 UID / source+qid uniqueness와 L3/L4/CrossConcept/Condition/binding/alias 전역 gate 재검증
3. Pack / Concept Shard / Condition Core canonical payload 생성
4. Global compile 및 zero-gate regression
```

이 최초 승격에 대해서는 이미 수행된 단원별 전수검수와 통합본 검수를 승격 evidence로 재사용한다.
마스터의 명시적 결정에 따라 동일 400문항을 별도 provider/session에서 다시 반복하는 독립검수는 요구하지 않는다.
이 예외는 `MASTER_APPROVED_REVIEW_REUSE`로 promotion receipt에 기록하며,
향후 다른 Pack의 일반 승격 절차를 자동으로 완화하지 않는다.

production JS metadata migration은 이 registry promotion과 별도 작업이다.

---

# 20. 기존 정본문서 동기화 계약

Foundation v1 채택 후 다음 문서를 동기화한다.

1. `00_RULES_INDEX.md`
2. `01_CANONICAL/JS아카이브룰북_v2.6.md`
3. `01_CANONICAL/JS아카이브_세부단원_운영규칙_v1.md`
4. `01_CANONICAL/JS아카이브_표준단원키_마스터테이블.md`
5. `01_CANONICAL/JS아카이브_difficultyBucket_5단계_운영규칙_v1.3.md`
6. `03_REVIEW/JS아카이브_3차검수_프로토콜.md`
7. compiled master/schema 및 metadata validator
8. `MANIFEST.md`

역할 원칙:

```text
L1/L2
→ 기존 StandardUnit/SubUnit authority 유지

L3/L4/CrossConcept/Condition/Alias/Binding
→ Meta Foundation v1 authority

difficulty definition
→ difficultyBucket v1.3 authority 유지
```

기존 문서에 Foundation 상세 정의를 복제하지 않는다.
상위 원칙과 authority reference만 동기화한다.

특히 기존 문서에는 다음 운영 원칙만 연결한다.

```text
대단원 단위 Foundation Pack
shared CrossConcept Shard
read-only Compiled Foundation
canonical Ownership Lock
```

세부 Pack/Shard 구조 정의는 본 문서를 단일 authority로 한다.

---

# 21. 문서 동기화 적용 순서

```text
1. Meta Foundation v1 CANONICAL 규칙 채택
2. 도형의 방정식 통합 Candidate 잔여 condition 정리
3. 통합본 독립검수
4. canonical registry payload 생성
5. 00_RULES_INDEX 동기화
6. Rulebook / SubUnit / StandardUnit Master / Difficulty reference / 3차검수 동기화
7. compiled master / schema / validator 동기화
8. regression
9. MANIFEST 재생성
10. 별도 승인 후 production metadata migration
```

문서 승격과 production JS migration을 한 transaction으로 섞지 않는다.

---

# 22. 절대 규칙

1. 미등록 L3/L4/CrossConcept/Condition을 production에 넣지 않는다.
2. Candidate key를 production canonical field에 넣지 않는다.
3. L3 definition을 한 curriculum/L2에 종속 복제하지 않는다.
4. L2→L3는 curriculum binding으로 검증한다.
5. L4→L3 parent는 semantic registry에서 검증한다.
6. Condition을 CrossConcept로 저장하지 않는다.
7. IntegrationPattern을 CrossConcept로 저장하지 않는다.
8. CrossConcept/Condition 개수로 난이도를 자동 결정하지 않는다.
9. canonicalLabelKo에 내부 분석어를 임의 승격하지 않는다.
10. rebuild는 canonical을 수정하지 않는다.
11. OUT_OF_SCOPE를 삭제하거나 현재 단원에 억지 분류하지 않는다.
12. curriculum 밖 source 문항을 삭제하지 않고 applicability로 격리한다.
13. canonical 승격은 자동화하지 않는다.
14. production JS migration은 canonical registry 승격 뒤 별도 승인으로 수행한다.
15. `H1-GEOMETRY_EQUATIONS_FOUNDATION` 같은 Foundation group identifier를 `standardUnitKey`로 사용하지 않는다.
16. 학년 전체 또는 전 과정 전체를 사람이 직접 수정하는 단일 거대 canonical registry로 관리하지 않는다.
17. L3/L4는 정확히 하나의 ownerPack을 가진다.
18. CrossConcept는 정확히 하나의 ownerConceptShard를 가진다.
19. 다른 Pack/Shard가 소유한 canonical definition을 직접 덮어쓰지 않는다.
20. `compiled/`는 사람이 직접 수정하지 않는다.
21. global compile은 ACTIVE Pack/Shard를 읽어 derived artifact만 생성한다.
22. Pack 하나의 수정 때문에 무관한 Pack evidence를 자동 무효화하지 않는다.
23. 공유 Concept Shard 변경 시 실제 참조 Pack dependency closure만 재검한다.

---

# 23. 한 줄 운영 정의

> JS는 문항에 실제 적용된 canonical metadata value의 source of truth이고, Meta Foundation은 Pack/Shard 단위로 L3/L4/CrossConcept/Condition/alias/curriculum-binding 정의를 소유한다. 전체 Compiled Foundation은 ACTIVE Pack/Shard에서 기계 생성하는 read-only 파생본이며, 미등록 key는 production에 들어갈 수 없다.
