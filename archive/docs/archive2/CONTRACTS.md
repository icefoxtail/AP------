# ARCHIVE 2.0 CONTRACTS v1.1
## Canonical Field · Identity · Selection · Exclusion · History · Review · Snapshot 계약

> 이 문서는 JS아카이브 2.0 구현에서 화면보다 우선하는 **공통 계약 정본**이다.
>
> 목적: Finder, Studio, Mixer, Student, Output이 같은 용어와 같은 판정 규칙을 사용하게 한다.
>
> v1.1 기준 실제 Worker/Archive 코드를 감사했다. 현재 canonical UID는 `qid_v1 = SHA256(normalizedSourceFile + "#" + sourceOrdinal)` 계열로 확인되었으며, assignment/recipient/exclusion/mixed payload/PDF/OMR은 이미 운영 구조가 존재한다. 이 문서는 그 구조를 재사용하고, 없는 부분만 additive하게 정의한다.

---

# 0. Contract Priority

충돌 시 우선순위:

```text
1. Canonical Identity / Grade / Curriculum HARD invariants
2. Data Contract
3. Selection Contract
4. Assignment/History Contract
5. Review Gate
6. UI Convenience
```

UI 편의를 위해 HARD invariant를 완화하지 않는다.

---

# 1. Canonical Field Dictionary

## 1.1 Exam Identity

```text
sourceFile
examId              // 존재할 경우
school
schoolKey
year
semester
examType
examAxis
contentType
qCount
```

### `examType`

시험 성격의 원본/정규화 값.

예:

```text
mid
final
other
```

### `examAxis`

UI 검색 축.

예:

```text
1-mid
1-final
2-mid
2-final
other
```

`examType`과 `examAxis`를 혼용하지 않는다.

---

# 2. Grade Fields

```text
sourceGrade
unitGrade
unitGradeSet
effectiveBrowseGrade
```

## 2.1 sourceGrade

실제 시험이 시행된 학년.

가능하면 source exam metadata가 Authority.

## 2.2 unitGrade

표준 단원 자체의 과정 학년.

## 2.3 effectiveBrowseGrade

Archive Finder가 시험을 배치할 최종 학년.

HARD:

```text
effectiveBrowseGrade >= sourceGrade
```

하위 학년 단원 때문에 절대 내려가지 않는다.

## 2.4 GRADE_CONFLICT

```text
sourceGrade = 고1
detected max unitGrade = 고2
```

이면:

```text
taxonomyStatus = CONFLICT
conflictCode = GRADE_CONFLICT
effectiveBrowseGrade = 고2
```

기본 자동출제 제외.

---

# 3. Course Fields

```text
curriculum
actualCourse
standardCourse
courseCode
courseFamily
courseFamilySet
courseRanges[]
primaryStandardCourse
```

## 3.1 actualCourse

source exam이 표방하는 실제 과목명.

## 3.2 standardCourse

문항/범위가 canonical taxonomy에 매핑된 표준 과목.

## 3.3 courseFamily

교육과정이 달라도 운영상 같이 찾기 위한 상위 grouping.

`courseFamily`는 교육과정 동등성을 의미하지 않는다.

---

# 4. Curriculum Fields

```text
curriculum =
2015
2022
MIXED
UNKNOWN
```

상태:

```text
taxonomyStatus =
CONFIRMED
DERIVED
UNKNOWN
CONFLICT
```

source:

```text
taxonomySource =
SOURCE_METADATA
COURSE_CODE
UNIT_KEY
MANUAL_REVIEW
```

---

# 5. Question Fields

```text
questionUid
sourceFile
sourceOrdinal
sourceQuestionNo
standardCourse
standardUnitKey
subUnitKey
conceptClusterKey
problemTypeKey
templateKey
difficultyBucket
tags[]
```

Release 1 additive 후보:

```text
sourceGrade
unitGrade
curriculum
courseFamily
taxonomyStatus
taxonomySource
```

---

# 6. Question Identity Contract

## 6.1 현재 `qid_v1` Authority

Worker의 현재 canonical UID 생성 규칙:

```text
normalizeSourceFile(sourceArchiveFile)
+ "#"
+ sourceOrdinal
        ↓
SHA-256
        ↓
qid_v1_<64 hex>
```

`exam_blueprints`에는 이미 다음이 존재한다.

```text
source_question_uid
source_question_ordinal
```

Unit Past runtime도 `questionUid`를 canonical duplicate key로 소비한다.

## 6.2 P0 stability audit

학생 누적 history를 HARD exclusion에 사용하기 전에 반드시 감사한다.

```text
source file rename/path move
sourceOrdinal 이동
앞 문항 삽입/삭제
같은 위치의 문항 자체 교체
오탈자/표현 수정
보기 수정
image/SVG 수정
metadata 수정
```

현재 구조에서 특히 위험한 경계:

```text
file/path 변경
→ UID churn 가능

ordinal 이동
→ 뒤 문항 UID 연쇄 churn 가능

같은 ordinal에서 완전히 다른 문항으로 교체
→ 과거 UID가 새 문항에 남을 가능성
```

## 6.3 Release 1 원칙

- 기존 qid_v1을 조용히 전면 재발급하지 않는다.
- audit에서 실제 결함 범위를 측정한다.
- 필요한 경우에만 explicit migration map 또는 qid_v2를 도입한다.
- 과거 assignment의 UID 복원이 불확실하면 `UNRESOLVED`로 남긴다.
- UID를 추측해서 생성해 history를 오염시키지 않는다.

## 6.4 Logical identity 확장 후보

향후 필요 시:

```text
questionUid
sourceOccurrenceId
contentRevision
identityStatus
```

을 분리할 수 있다.

그러나 Release 1 blocker는 먼저 **현재 qid_v1의 안정성 증명**이다.

## 6.5 UID Tombstone

identity version을 올리거나 문항을 폐기할 때 삭제된 UID를 미래의 다른 logical question에 재사용하지 않는다.

---

# 7. Identity Integrity Gate

빌드/검수에서 검사:

```text
duplicateUidCount == 0
invalidUidCount == 0
unexpectedUidLossCount == 0
reusedTombstoneCount == 0
```

UID migration이 필요한 경우 명시적 mapping/evidence를 남긴다.

조용한 UID 재발급 금지.

---

# 8. Version Contract

Draft에는 최소:

```text
selectorVersion
taxonomyVersion
indexVersion
```

Assignment/MIXED snapshot에는 additive 후보:

```text
payloadSchemaVersion
questionIdentityVersion
questionUidSetHash
```

가능하면:

```text
outputContractVersion
```

도 기록한다.

목적:

- 재현
- migration
- bug audit
- 오래된 Draft warning
- assignment question set parity 검증

버전 필드를 이유 없이 중복 저장하지 않는다. 현재 `mixed_payload_json`, PDF hash, assignment ID가 이미 제공하는 역할은 재사용한다.

---

# 9. Crosswalk Contract

구조:

```text
fromCurriculum
fromCourse
fromUnitKey

toCurriculum
toCourse
toUnitKey

crosswalkType
reviewStatus
note
```

값:

```text
crosswalkType =
EXACT
PARTIAL
RELATED
INCOMPATIBLE

reviewStatus =
REVIEWED
UNREVIEWED
```

## 9.1 Finder

Finder에서는:

- EXACT: 정확 대응
- PARTIAL: 부분 대응
- RELATED: 관련 단원

으로 같이 찾을 수 있음.

## 9.2 Studio auto-mix

기본 자동 혼합:

```text
EXACT + REVIEWED
```

만.

PARTIAL/RELATED:

- explicit user approval
- Review WARN

INCOMPATIBLE:

- HARD BLOCK

UNREVIEWED:

- default auto-mix 금지

---

# 10. Curriculum Mixing Gate

Finder selected exams → Studio에서:

```text
curriculumSet.size > 1
```

이면 Crosswalk를 평가.

Crosswalk 없는 단순 family match로 자동 혼합 금지.

Review summary 예:

```text
교육과정
2015 12문항
2022 38문항

Crosswalk
EXACT 12
PARTIAL 0
UNREVIEWED 0
```

불허 혼합이 있으면 HARD.

---

# 11. Selection Engine Contract

개념 API:

```text
selectCandidates(candidates, request, options)
selectBlueprintSet(candidates, rows, options)
validateSelection(selected, request)
composeExclusions(context)
```

UI는 이를 복제하지 않는다.

---

# 12. SelectionRequest

개념 스키마:

```text
SelectionRequest {
  sourceMode
  filters
  blueprint
  exclusions
  pinnedUids
  count
  seed
  limits
}
```

## sourceMode

```text
archive
selectedExams
student
preset
```

## filters

예:

```text
sourceGrades[]
effectiveBrowseGrades[]
curriculums[]
courseFamilies[]
courses[]
unitKeys[]
subUnitKeys[]
problemTypeKeys[]
difficulties[]
schools[]
yearFrom
yearTo
examAxes[]
tags[]
```

필드명은 실제 `mixer-selector.js`와 parity audit 후 확정.

기존 이름을 불필요하게 깨지 않는다.

---

# 13. SelectionResult

개념:

```text
SelectionResult {
  selected
  rowResults
  shortages
  diagnostics
  seed
  selectorVersion
  taxonomyVersion
  indexVersion
}
```

diagnostics:

```text
candidateCount
eligibleCount
selectedCount

excludedByCurrent
excludedBySeries
excludedByStudent
excludedByForm
excludedByManual
excludedByTaxonomy
excludedByQuality

duplicateUidCount
sourceDuplicateCount
elapsedMs
```

---

# 14. Determinism

동일:

```text
candidate index version
taxonomy version
selector version
request
exclusion set
seed
```

이면 같은 결과를 재현할 수 있어야 한다.

완전히 같은 random 결과가 제품 requirement가 아닌 경우에도
버그 재현용 deterministic mode는 유지한다.

---

# 15. Exclusion Contract

최종:

```text
effectiveExcludeQuestionUids =
    currentPaperUids
  ∪ currentRoundUids
  ∪ previousSeriesUids
  ∪ studentHistoryUids
  ∪ siblingFormUids
  ∪ manualExcludeUids
  ∪ qualityExcludeUids
```

구현은 배열 반복검색이 아니라:

```text
Set
```

기반 membership을 기본으로 한다.

---

# 16. Exclusion Invariants

- 동일 UID 중복 0
- same series HARD mode 중복 0
- student history HARD mode 중복 0
- A/B disjoint mode 중복 0
- pinned UID와 신규 UID 중복 0

명시적 정책 변경 없이는 완화 금지.

---

# 17. Student Question History Contract

## 17.1 기존 Authority 재사용

학생 history는 새 학생 체계나 별도 exposure DB를 Authority로 만들지 않는다.

현재 canonical 구조:

```text
class_exam_assignments.id
        ↓
class_exam_assignment_recipients
        ↓
- class_exam_assignment_exclusions
        ↓
effective assignment recipients
```

학생 identity Authority는 APMS `students.id`다.

## 17.2 신규 최소 Bridge

학생이 받은 canonical 문항을 빠르게 조회하기 위해 assignment별 문항을 정규화한다.

```text
class_exam_assignment_questions
```

최소 필드:

```text
assignment_id
order_no
question_uid
source_archive_file
source_question_no
source_question_ordinal
standard_unit_key
difficulty_at_assignment
created_at
```

필요에 따라 `sub_unit_key / problem_type_key / metadata_revision`을 additive하게 추가할 수 있다.

권장 제약:

```text
PRIMARY KEY (assignment_id, order_no)
UNIQUE (assignment_id, question_uid)
```

## 17.3 History Authority

학생 S의 누적 출제 문항:

```text
History(S) =
  assignment_questions.question_uid
  WHERE S ∈ assignment_recipients
    AND S ∉ assignment_exclusions
```

현재 assignment row가 삭제되면 history에서도 제외된다.
향후 assignment status가 도입되면 effective 상태만 포함한다.

## 17.4 Scope

기본:

```text
academy
```

같은 학원 조직에서 다른 교사가 냈더라도 동일 학생 이력으로 본다.
Release 1에서 기관 밖 `globalStudent` scope는 만들지 않는다.

## 17.5 History mode

```text
all
recent
off
```

`recent`는 `recentDays`를 사용한다.
기본은 전체 이력이며 성능 때문에 임의 축소하지 않는다.

## 17.6 여러 학생 공통 문제지

```text
exclude = History(A) ∪ History(B) ∪ ...
```

선택된 학생 중 한 명이라도 과거에 본 UID면 공통 문제지 기본 후보에서 제외한다.

---

# 18. History Query

프론트가 과거 assignment의 `mixed_payload_json`을 전부 내려받아 직접 조합하지 않는다.
Worker에서 batch query한다.

개념 request:

```json
{
  "student_ids": ["..."],
  "unit_keys": ["..."],
  "history_mode": "all"
}
```

개념 response:

```json
{
  "students": {
    "student-id": {
      "question_uids": [],
      "coverage": {
        "verified": 0,
        "legacy_inferred": 0,
        "unresolved": 0
      }
    }
  },
  "union_question_uids": [],
  "coverage": {
    "verified": 0,
    "legacy_inferred": 0,
    "unresolved": 0
  }
}
```

구현은 `recipients - exclusions JOIN assignment_questions`를 기본으로 한다.

성능/권한 원칙:

- N+1 금지
- `student_ids` batch query
- 기존 `canAccessStudentsBatch` 또는 동등한 teacher/admin 권한 검증 재사용
- history target/policy가 같으면 프론트 메모리 cache 가능
- UID format invalid row는 diagnostics에 포함하고 HARD history set에는 넣지 않음
- legacy coverage를 숨기지 않음

---

# 19. Assignment Identity + Question Bridge Write

## 19.1 현재 Assignment identity

canonical row identity:

```text
class_exam_assignments.id
```

현재 Worker는 UUID를 사용한다.

`assignment_batch_id`는 여러 반 출제를 한 번에 묶는 batch identity이며 개별 assignment row identity가 아니다.

현재 Worker가 사용하는 compatibility lookup identity:

```text
Archive-backed:
class_id + exam_date + archive_file

Manual/no archive:
class_id + exam_title + exam_date
```

이것은 현재 route의 existing lookup/upsert key이지, 배포된 D1에서 모든 경우의
논리적 유일성이 이미 봉인되었다는 뜻은 아니다. 2026-09-16 Phase 0 remote D1
감사에서 assignment 테이블에는 `(class_id, exam_title, exam_date, archive_file)`
전체 UNIQUE 제약은 있었지만, 이 문서가 전제했던 archive-backed/manual용
partial unique index는 확인되지 않았다. Archive-backed 논리 identity 중복도
9개 그룹, unique 초과 row 9개가 남아 있었다. 따라서 retry 때 새 assignment
subsystem을 만들 필요는 없지만, Phase 1에서 중복 정리와 실제 배포 제약 검증을
끝내기 전까지는 이 key를 **논리적 compatibility key**로만 취급한다.

## 19.2 Client hardening

신규/수정 경로에서는 create 응답의 `assignment.id`를 후속 요청에 우선 사용한다.

특히 student exclusion은 가능하면:

```text
assignment_id + student_ids
```

를 preferred contract로 하고 기존 composite lookup은 legacy fallback으로 남긴다.

## 19.3 Assignment question write

assignment 생성/갱신 시 해당 assignment의 최종 문항 set을 `class_exam_assignment_questions`에 idempotent하게 동결한다.

### MIXED

source:

```text
mixed_payload_json.questions[]
```

에서 `questionUid`, source file/ordinal/no, unit/difficulty snapshot을 추출한다.

### Normal Archive

source:

```text
archive_file
+ exam_blueprints
```

의 `source_question_uid/source_question_ordinal`을 사용한다.

### HARD parity

```text
question_count
== assignment_questions row count
== final paper UID count
```

UID unique count도 동일해야 한다.

## 19.4 Effective recipient

학생 history를 별도로 write하지 않는다.

```text
recipient snapshot
- exclusions
```

과 assignment-question rows의 JOIN이 history다.

따라서 제외 학생에게 exposure row가 잘못 쓰이는 별도 경로 자체를 만들지 않는다.

---

# 20. Idempotency + Legacy Coverage

## 20.1 Retry

assignment create/update/retry가 반복되어도:

```text
(assignment_id, order_no)
```

가 중복 row를 만들지 않는다.

동일 assignment에 question set이 갱신될 수 있는 기존 upsert 흐름은 **학생에게 최종 노출되기 전/기존 제품 semantics 안에서만** 허용하고, 변경 시 assignment-question rows와 PDF/mixed payload parity를 함께 갱신한다.

## 20.2 Legacy recipient coverage

`class_exam_assignment_recipients`는 2026-08-19 migration에서 기존 assignment를 당시 `class_students`로 backfill했다.

따라서 과거 history coverage 상태:

```text
VERIFIED
- 실제 issue 시점 recipient snapshot이 신뢰 가능한 구간

LEGACY_INFERRED
- migration 당시 roster로 복원된 구간

UNRESOLVED
- recipient 또는 question UID를 복원할 근거가 부족한 구간
```

를 구분한다.

## 20.3 Legacy question backfill

우선순위:

```text
1. persisted mixed_payload_json의 canonical UID/sourceOrdinal
2. normal archive_file + exam_blueprints
3. 신뢰 가능한 sourceFile + sourceOrdinal로 qid_v1 재계산
4. 근거 부족 → UNRESOLVED
```

문제 번호만으로 UID를 추측하지 않는다.

## 20.4 History strictness

Release 1 UI는 legacy gap이 있을 때 “전체 과거 이력 100% 보장”이라고 표시하지 않는다.

예:

```text
확정 이력 312문항
추정 이력 48문항
미복원 assignment 3건
```

실제 운영 정책에 따라 LEGACY_INFERRED를 exclusion에 포함할 수 있으나 그 상태를 diagnostics에 남긴다.

---

# 21. Resource Scope

Release 1:

```text
personal
academy
```

적용:

```text
preset
draft
qualityFlag
```

기본 예:

```text
개인 Draft = personal
개인 추천 flag = personal
공용 Preset = academy
학생 history = academy
```

권한은 기존 teacher/admin/student 체계를 재사용.

---

# 22. UNKNOWN / CONFLICT Contract

```text
CONFIRMED
DERIVED
UNKNOWN
CONFLICT
```

## Finder

UNKNOWN 표시 가능.

badge:

```text
교육과정 미분류
난이도 미분류
```

## Studio strict

UNKNOWN은 기본 자동선택 제외.

명시적 `[미분류 포함]` 사용 시 WARN.

CONFLICT는 자동출제 HARD 제외.

---

# 23. Shortage Contract

각 constraint는:

```text
hard
relaxable
approvalRequired
```

관점으로 관리.

기본 제안 순서:

```text
1. count 감소
2. adjacent difficulty
3. allowed redistribution
4. student history window 완화
5. previous item reuse
```

절대 자동완화 금지:

```text
questionUid uniqueness
effective grade
unapproved curriculum mismatch
explicit source range
private/rejected content
```

---

# 24. Review Gate

상태:

```text
PASS
WARN
HARD_BLOCK
```

## HARD_BLOCK

- duplicate UID
- grade violation
- curriculum gate violation
- identity invalid
- hard quota violation
- student history violation
- series violation
- handoff mismatch

## WARN

- source concentration
- UNKNOWN metadata
- PARTIAL crosswalk
- low diversity
- low candidate margin
- unclassified difficulty

WARN은 user acknowledgment 후 진행 가능.

---

# 25. ReviewResult

개념:

```text
ReviewResult {
  status
  hardFailures[]
  warnings[]
  metrics
  reviewedAt
}
```

학생 출제/출력 직전 재검증.

---

# 26. Draft Contract

Release 1:

```text
draftId
schemaVersion
updatedAt
mode
filterState
compositionPlan
selectedQuestionUids
pinnedUids
headerOptions
targetStudentIds
seriesState
versions
```

## Autosave

중요 state mutation 후 debounce autosave.

## Recovery

비정상 종료 후:

```text
이전 작업이 있습니다.
[복원] [삭제]
```

## JSON Backup

```text
Export Draft JSON
Import Draft JSON
```

Import 때:

- schema version
- taxonomy version
- UID validity

검증.

---

# 27. URL Serialization

Finder filter는 querystring으로 복원 가능.

URL에서 private student ID/history를 공유하지 않는다.

Studio 큰 state는 URL 전체 직렬화 금지.

```text
draftId
```

방식 권장.

---

# 28. Assignment Snapshot Contract

별도 Paper Snapshot subsystem을 새로 만들지 않는다.

## 28.1 MIXED content snapshot

현재:

```text
class_exam_assignments.mixed_payload_json
  ├─ questions[]
  └─ meta
```

를 정식 content snapshot으로 사용한다.

## 28.2 Normalized identity snapshot

```text
class_exam_assignment_questions
```

을 assignment 당시 canonical question set의 검색/history 정본으로 사용한다.

## 28.3 Rendered artifact

기존 assignment PDF fields/R2 object/hash가 rendered artifact snapshot 역할을 한다.

## 28.4 Additive metadata 후보

```text
payload_schema_version
question_identity_version
question_uid_set_hash
```

## 28.5 Invariants

```text
mixed/final paper UID set
== assignment_questions UID set

question_count
== assignment_questions row count

assignment 이후 metadata 재분류
!= 과거 assignment question identity 자동 변경
```

새 `paperId + full snapshot DB`를 Release 1 필수로 만들지 않는다.

---

# 29. Studio ↔ Output Boundary

HARD architecture:

```text
Studio = edit authority
Output Engine = render/print authority
```

`mixed_engine.html`에서 새로운 독립 편집 상태를 만드는 방향은 피한다.

출력에서 변경 가능한 것이 필요하면:

```text
header/layout options
```

을 Studio/output handoff contract로 승격.

---

# 30. Feature Flags

최소:

```text
taxonomyV1
finderV2
studioV2
pinRebuild
studentHistoryExclusion
```

optional:

```text
crosswalkMixing
```

flag OFF:

- legacy route 정상
- 기존 data path 정상

---

# 31. Observability 최소

Release 1에서 거대한 analytics system을 만들 필요는 없지만
debug diagnostics는 남긴다.

Selection:

```text
requestId
seed
selectorVersion
candidateCount
selectedCount
shortageCount
elapsedMs
```

Taxonomy:

```text
taxonomyVersion
unknownCount
conflictCount
gradeConflictCount
```

Output:

```text
paperId
renderVersion
failureStage
```

---

# 32. Performance Contract

Phase 0 실제 측정 후 budget을 문서에 추가.

측정 환경을 같이 기록:

```text
browser
device
examCount
questionCount
warm/cold cache
```

임의 수치만으로 PASS/FAIL하지 않는다.

---

# 33. A/B Parallel Form Contract — Release 2

A와 B는 단순 disjoint만으로 충분하지 않다.

slot spec:

```text
unit
difficulty
problemType
subUnit (optional)
```

각 slot의 A/B가 동일 blueprint 요구를 만족.

HARD:

```text
A_UID ∩ B_UID = ∅
```

WARN/HARD balance tolerance는 구현 전 확정.

---

# 34. Question Family — Future Contract

향후:

```text
questionFamilyId
familyStatus
familyMethod
```

가능.

초기 HARD exclusion에는:

```text
REVIEWED family
```

만 사용.

자동 fingerprint 결과를 바로 HARD 중복으로 사용하지 않는다.

---

# 35. Contract Change Rule

이 계약을 변경할 때:

- 실제 제품 이유가 있어야 함
- 기존 draft/assignment 영향 평가
- version 증가
- migration 필요 여부 명시
- 테스트 추가

단순 UI 편의 때문에 canonical field 의미를 바꾸지 않는다.

---

# 36. Release 1 Contract Seal 조건

다음이 닫혀야 Release 1 구현을 진행할 수 있다.

```text
[ ] Grade Authority
[ ] Field Dictionary
[ ] UID audit
[ ] Taxonomy version
[ ] Crosswalk schema
[ ] Selection API
[ ] Exclusion API
[ ] Assignment-question bridge + history query
[ ] Review HARD/WARN
[ ] Draft schema
[ ] Existing assignment snapshot parity
[ ] Feature flags
```

---

# 최종 한 문장

> **Archive 2.0은 기존 APMS의 assignment·recipient·exclusion·OMR을 Authority로 재사용하고, qid_v1 안정성을 검증한 뒤 assignment↔questionUid bridge만 정규화하여 학생 이력·중복·오답 연결의 의미를 하나로 고정한다.**
