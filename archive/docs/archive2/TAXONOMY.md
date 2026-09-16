# ARCHIVE 2.0 TAXONOMY v1.1
## Grade Authority · Curriculum · Course Family · Unit Crosswalk · Mixed Course · Search Index

> 목적: JS아카이브에서 “어디에 저장되어 있는가”와 “사용자가 어떤 자료로 인식하고 찾아야 하는가”를 분리한다.
>
> 이 문서는 Finder, Studio, Mixer가 공통으로 사용해야 하는 Taxonomy 정본이다.
>
> 가장 중요한 P0 원칙:
>
> **시험에 하위 학년 단원이 포함되어도 해당 시험의 학년을 하향 분류하지 않는다.**

---

# 0. Taxonomy가 해결할 문제

기존 물리 구조:

```text
학년
→ 시험축
→ 파일
```

실제 교사 탐색:

```text
학년
교육과정
과목계열
실제과목
학교
연도
시험축
단원범위
```

특히 고2:

```text
고2 / 1중간
```

안에:

- 대수
- 미적분/수학Ⅱ 계열
- 확률과통계
- 기하
- 혼합 범위

가 공존할 수 있다.

따라서 physical path를 사용자 IA로 사용하지 않는다.

---

# 1. Physical Path Policy

기존:

```text
archive/exams/original/high/...
```

를 Taxonomy 개편 때문에 대규모 이동하지 않는다.

물리 경로는 provenance / source location.

Taxonomy는 별도 metadata layer.


## 1.1 현재 Unit Past의 실제 학년 scope를 보존

현재 `unit-past-exams-core.js` profile은 이미 source path를 학년별로 분리한다.

```text
h1.sourcePrefix = original/high/h1/
h2.sourcePrefix = original/high/h2/
```

`isInScope()`도 이 prefix와 시험축을 함께 검사한다.

따라서 Release 1에서 기본 Studio 후보군을 넓히기 위해 이 학년 fence를 제거하지 않는다.

```text
고1 Studio 기본 후보
→ h1 source scope

고2 Studio 기본 후보
→ h2 source scope
```

고2 시험 안에 고1 선수단원 문항이 있다고 해서 고1 Studio 기본 pool로 자동 유입시키지 않는다.
Cross-grade source 검색은 향후 명시적 고급 기능으로만 검토한다.

---

# 2. Core Taxonomy Axes

Exam:

```text
sourceGrade
effectiveBrowseGrade

curriculum
actualCourse
standardCourse
courseCode
courseFamily
courseFamilySet

school
schoolKey
year
semester
examType
examAxis

courseRanges[]
rangeStartUnitKey
rangeEndUnitKey

taxonomyStatus
taxonomySource
taxonomyVersion
```

Question:

```text
questionUid
sourceGrade
unitGrade
effectiveBrowseGrade

curriculum
actualCourse
standardCourse
courseFamily

standardUnitKey
subUnitKey
conceptClusterKey
problemTypeKey
templateKey
difficultyBucket

taxonomyStatus
taxonomySource
```

---

# 3. Grade Authority — P0

## 3.1 sourceGrade

실제 source exam의 학년.

예:

```text
고2 시험지
→ sourceGrade = 고2
```

문항의 단원 학년이 sourceGrade를 바꾸지 않는다.

## 3.2 unitGrade

해당 canonical unit이 어느 과정 학년인지.

예:

```text
직선의 방정식
→ unitGrade = 고1

대수의 특정 단원
→ unitGrade = 고2
```

정확한 unit-grade table은 canonical curriculum/unit registry가 Authority.

## 3.3 unitGradeSet

Exam에 포함된 문항/범위의 unit grade 집합.

예:

```text
{고1, 고2}
```

## 3.4 effectiveBrowseGrade

기본 계산 개념:

```text
effectiveBrowseGrade =
max(
  sourceGrade,
  max(unitGradeSet)
)
```

단, source metadata와 canonical unit mapping이 충돌할 경우
`taxonomyStatus=CONFLICT`를 함께 기록한다.

## 3.5 Never Downgrade Invariant

```text
effectiveBrowseGrade < sourceGrade
```

는 절대 허용하지 않는다.

---

# 4. Grade 사례

## Case A — 정상 고2 + 고1 선수개념

```text
시험: 2026 고2
대수 18문항
직선의 방정식 활용 3문항
```

결과:

```text
sourceGrade = 고2
unitGradeSet = {고1, 고2}
effectiveBrowseGrade = 고2
taxonomyStatus = CONFIRMED 또는 DERIVED
```

Finder:

```text
고2 = 표시
고1 = 시험 목록에 미표시
```

Studio:

```text
고1 default source pool = 제외
고2 = 허용
```

## Case B — source 고1인데 고2 단원 검출

```text
sourceGrade = 고1
unitGradeSet = {고2}
```

결과:

```text
effectiveBrowseGrade = 고2
taxonomyStatus = CONFLICT
conflictCode = GRADE_CONFLICT
```

Admin 검수 필요.

---

# 5. “고1 시험 찾기” vs “직선 단원 찾기”

두 검색 의미를 분리하되 Release 1 기본 source scope는 학년 fence를 유지한다.

## Finder exam browse

```text
고1
```

은 `effectiveBrowseGrade = 고1` 시험만 표시한다.
고2 시험에서 직선 단원이 쓰였더라도 고1 시험 목록에 넣지 않는다.

## Studio default unit search

사용자가 고1 Studio에서:

```text
직선의 방정식
```

을 선택하면 기본 후보는 **고1 profile source scope** 안에서만 찾는다.

```text
sourceFile startsWith original/high/h1/
```

을 유지한다.

고2 시험 속 고1 단원 문항은:

```text
sourceGrade = 고2
unitGrade = 고1
```

라는 사실을 taxonomy에 보존하지만, Release 1 고1 자동출제 기본 pool에는 넣지 않는다.

향후 실제 필요가 확인되면 별도 고급 옵션:

```text
[ ] 고학년 시험에서 사용된 이 단원 문항도 포함
```

을 추가할 수 있다. 이 옵션은 기본 OFF이며 별도 Review WARN을 요구한다.

---

# 6. Course vs Grade

Mixed course와 mixed grade는 다르다.

예:

```text
고2 시험
공통수학2 단원 + 대수 단원
```

이면:

```text
sourceGrade = 고2
courseFamilySet = {COMMON_2, ALGEBRA}
unitGradeSet = {고1, 고2}
effectiveBrowseGrade = 고2
```

이것을 “고1+고2 시험”이라고 분류하지 않는다.

---

# 7. Curriculum

canonical:

```text
2015
2022
MIXED
UNKNOWN
```

## 7.1 CONFIRMED

원본/확정 metadata로 명시.

## 7.2 DERIVED

courseCode/unitKey 등 canonical registry로 파생.

## 7.3 UNKNOWN

근거 부족.

## 7.4 CONFLICT

서로 다른 신뢰 가능한 근거가 충돌.

---

# 8. Taxonomy Provenance

Release 1 최소:

```text
taxonomyStatus
taxonomySource
```

source:

```text
SOURCE_METADATA
COURSE_CODE
UNIT_KEY
COURSE_RANGE
MANUAL_REVIEW
```

과도한 confidence float는 Release 1에 넣지 않는다.

---

# 9. Course Family

초기 후보:

```text
COMMON_1
COMMON_2
ALGEBRA
CALCULUS
PROB_STATS
GEOMETRY
OTHER
```

중학교 family는 실제 필요 시 별도 추가.

고2 예:

```text
ALGEBRA
├─ 2015 수학Ⅰ
└─ 2022 대수

CALCULUS
├─ 2015 수학Ⅱ
└─ 2022 미적분Ⅰ

PROB_STATS
├─ 2015 확률과 통계
└─ 2022 확률과 통계
```

주의:

`courseFamily`는 browse grouping.

자동 curriculum equivalence 아님.

---

# 10. actualCourse / standardCourse

## actualCourse

원본 시험 source의 과목 표시.

## standardCourse

Archive canonical mapping 결과.

둘이 다른 경우 둘 다 보존 가능.

UI는 가능하면 canonical을 주로 쓰되
원본 표기를 provenance로 잃지 않는다.

---

# 11. Mixed Course Exam

Exam에:

```text
courseRanges[]
```

가 여러 개면 그대로 보존.

예:

```text
courseRanges = [
  공통수학2 / 직선의 방정식,
  대수 / 사인법칙 ~ 수학적 귀납법
]
```

UI:

```text
혼합 범위 · 2과목

공통수학2
직선의 방정식

대수
사인법칙 → 수학적 귀납법
```

`primaryStandardCourse`가 비어있다고
첫 range를 primary로 임의 승격하지 않는다.

---

# 12. courseFamilySet

Mixed exam:

```text
courseFamilySet =
union(courseRanges[].courseFamily)
```

따라서 한 exam은 여러 family filter에 발견될 수 있다.

하지만 실제 UI card에는:

- actual ranges
- curriculum
- sourceGrade

를 함께 표시하여 오해를 막는다.

---

# 13. Unit Crosswalk

목적:

```text
2015 수학Ⅰ 삼각함수
↔
2022 대수 삼각함수
```

를 “관련 자료”로 찾되 잘못된 자동 혼합을 막는다.

중요: Crosswalk를 처음부터 새로 작성하지 않는다.

현재 `unit-past-exams-core.js`에는 이미 다음 운영 mapping이 존재한다.

```text
HIGH1_DIRECT_KEY_MAP
HIGH2_DIRECT_KEY_MAP
HIGH1/HIGH2 rawKeyMap / overrides
```

이 mapping은 과거 교육과정/legacy key를 현재 canonical unit으로 연결하는 실제 런타임 자산이다.

Release 1 작업:

```text
기존 mapping inventory
→ 실제 mapping 정확성 감사
→ source/target curriculum 명시
→ EXACT / PARTIAL / RELATED / INCOMPATIBLE 판정
→ REVIEWED / UNREVIEWED 상태 부여
```

즉 Crosswalk v1은 **기존 direct mapping을 버리고 별도 체계를 이중 구축하는 것이 아니라, 현재 mapping을 정식 metadata 계약으로 승격**하는 작업이다.

---

# 14. Crosswalk Record

```text
crosswalkId

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

---

# 15. Crosswalk Type

## EXACT

출제 scope 관점에서 동일 범위로 자동 혼합 가능한 수준.

반드시 reviewed.

## PARTIAL

일부 내용만 겹침.

Finder 관련 검색 가능.
자동 혼합 기본 금지.

## RELATED

연계가 있으나 같은 출제 범위라고 볼 수 없음.

## INCOMPATIBLE

자동 혼합 금지.

---

# 16. Crosswalk Review Status

```text
REVIEWED
UNREVIEWED
```

Release 1 Studio default auto-mix:

```text
crosswalkType == EXACT
AND
reviewStatus == REVIEWED
```

---

# 17. Crosswalk를 과목 Family와 분리

잘못된 규칙:

```text
courseFamily 같음
→ 모든 unit 자동 호환
```

금지.

올바른:

```text
courseFamily 같음
→ Finder에서 같은 계열로 탐색 가능

실제 자동 혼합
→ unit crosswalk 별도 판정
```

---

# 18. Curriculum Mixed Selection

Finder에서 여러 source를 선택한 결과:

```text
curriculumSet = {2015, 2022}
```

이면 Studio 진입 전에 summary.

```text
2015 · 2개 시험
2022 · 1개 시험
```

문항 생성 시 Crosswalk gate 적용.

---

# 19. Question Index Additive Fields

기존 index 구조를 깨지 않고 추가 후보:

```text
sourceGrade
unitGrade
effectiveBrowseGrade

curriculum
courseFamily

taxonomyStatus
taxonomySource
taxonomyVersion
```

이미 존재하는:

```text
standardCourse
standardUnitKey
subUnitKey
conceptClusterKey
problemTypeKey
templateKey
difficultyBucket
```

는 재사용한다.

---

# 20. Exam DB Additive Fields

추가 후보:

```text
sourceGrade
effectiveBrowseGrade

curriculum
curriculumSet[]
courseFamily
courseFamilySet[]

taxonomyStatus
taxonomySource
taxonomyVersion
```

기존:

```text
grade
subject
courseRanges
primaryStandardCourse
```

를 제거하지 않는다.

migration 동안 legacy field와 additive field를 같이 유지.

---

# 21. Derivation Order

정확한 우선순위는 Phase 0 inventory 후 고정하지만
원칙:

```text
명시적 canonical metadata
>
reviewed mapping
>
canonical courseCode/unitKey derivation
>
UNKNOWN
```

파일명 guess만으로 중요한 taxonomy를 확정하지 않는다.

---

# 22. Grade Derivation

가능하면:

```text
exam.grade
```

를 sourceGrade Authority로 사용.

unit grade는 canonical unit registry에서.

`sourceGrade`와 `unitGradeSet`을 비교해 conflict를 찾는다.

---

# 23. Curriculum Derivation

우선:

```text
course code
unit key namespace
reviewed course registry
```

사용.

불확실하면 UNKNOWN.

Mixed ranges가 실제 서로 다른 curriculum이면:

```text
curriculum = MIXED
curriculumSet = [...]
```

---

# 24. Finder Filter Contract

```text
effectiveBrowseGrades[]
curriculums[]
courseFamilies[]
courses[]
schools[]
yearFrom
yearTo
examAxes[]
unitKeys[]
query
```

Finder의 `grade` UI는 `effectiveBrowseGrade`를 대상으로 한다.

이 문서의 `unitKeys[]`는 Finder/Studio 후보 범위를 표현하는 selection field다.
Student History correctness의 Authority가 아니다. History query는 canonical
`questionUid` set을 기준으로 exposure와 candidate의 교집합을 계산하며,
`unitKeys[]`는 필요할 때 query hint 또는 diagnostic으로만 전달한다. metadata나
unit 재분류가 UID history에서 과거 exposure를 제거하는 HARD filter가 되어서는
안 된다.

---

# 25. Studio Source Filter Contract

Studio 기본 후보는 현재 profile source scope를 우선 Authority로 사용한다.

```text
targetProfile
allowedSourcePrefix
allowedCurriculums[]
unitKeys[]
```

현재 예:

```text
h1 → original/high/h1/
h2 → original/high/h2/
```

따라서 Release 1 기본:

```text
sourceGrade > targetStudentGrade
```

또는 target profile sourcePrefix 밖 후보는 자동출제에서 제외한다.

고학년 source를 명시적으로 포함하는 cross-grade unit search는 Release 1 기본 기능이 아니다.
향후 필요 시 별도 advanced option + Review WARN으로 추가한다.

이 정책은 학년별 DB를 따로 만든다는 뜻이 아니다.
물리 저장소는 그대로 두고 selector source fence만 유지한다.

---

# 26. Search Normalization

Release 1:

## School

canonical:

```text
순천고등학교
→ schoolKey = 순천고
```

검색:

```text
순천고
순천고등학교
```

모두 매칭.

## Exam Axis

```text
1기말
1학기말
1학기 기말
```

→

```text
1-final
```

## Course aliases

예:

```text
확통
→ 확률과 통계
```

정확한 alias table은 실제 사용자 용어 기준으로 관리.

---

# 27. Search Result 0

0건이면 다음을 구분한다.

```text
실제 데이터 없음
필터가 너무 좁음
taxonomy unknown 때문에 제외
curriculum conflict 때문에 제외
```

가능하면 완화 예상 count 표시.

---

# 28. UNKNOWN UX

Exam Card:

```text
교육과정 미분류
```

badge.

Studio:

```text
[ ] 미분류 문항 포함
```

기본 OFF.

---

# 29. CONFLICT UX

Finder:

관리자/교사는 결과를 볼 수 있으나:

```text
분류 충돌
```

표시.

Studio auto generation:

```text
default exclude
```

Admin Health에서 검수.

---

# 30. Taxonomy Version

모든 build에:

```text
taxonomyVersion
```

부여.

taxonomy logic이 바뀌면:

- db/index regenerate
- coverage report
- conflict diff
- previous version 비교

를 수행.

---

# 31. Migration Strategy

Taxonomy v1은 additive.

```text
legacy DB
+
new taxonomy fields
```

기존 Finder/Mixer가 새 field를 몰라도 정상 동작해야 한다.

새 Finder는 flag ON일 때만 사용.

---

# 32. Data Health

Taxonomy health:

```text
gradeConflictCount
curriculumUnknownCount
curriculumConflictCount
courseFamilyUnknownCount
unitUnknownCount
mixedCourseCount
crosswalkUnreviewedCount
```

Coverage:

```text
gradeCoverage
curriculumCoverage
courseFamilyCoverage
unitCoverage
```

---

# 33. Build Report

Taxonomy build 후:

```text
시험지 N
문항 N

effective grade
고1 ...
고2 ...
고3 ...

curriculum
2015 ...
2022 ...
UNKNOWN ...
CONFLICT ...

mixed course ...
grade conflict ...
```

를 생성.

---

# 34. Required Tests

## T1 — Never Downgrade

```text
sourceGrade 고2
unitGradeSet {고1, 고2}
```

expected:

```text
effectiveBrowseGrade 고2
```

## T2 — Conflict Upgrade

```text
sourceGrade 고1
unitGradeSet {고2}
```

expected:

```text
effectiveBrowseGrade 고2
taxonomyStatus CONFLICT
```

## T3 — Finder contamination

고2 시험 + 고1 unit:

```text
고1 Finder 결과에 미포함
```

## T4 — Studio contamination

고1 target에서 고2 source:

```text
default candidate 제외
```

## T5 — Mixed Course

공통수학2 + 대수 exam:

```text
두 family에서 발견 가능
실제 range 둘 다 표시
browseGrade 고2
```

## T6 — Crosswalk EXACT

```text
2015 ↔ 2022
EXACT + REVIEWED
```

auto-mix 허용.

## T7 — Crosswalk PARTIAL

default auto-mix 차단/승인 필요.

## T8 — UNKNOWN

Finder 표시 가능,
strict Studio 기본 제외.

## T9 — CONFLICT

Data Health count 증가,
Studio auto exclude.

---

# 35. Phase 0 Inventory Questions

Taxonomy 구현 전에 실제 저장소에서 다음을 답한다.

```text
1. 현재 exam.grade/source path가 sourceGrade Authority로 어느 정도 일치하는가?
2. grade 누락/충돌은 몇 건인가?
3. canonical unit key로 unitGrade를 판정 가능한 비율은?
4. HIGH1_DIRECT_KEY_MAP / HIGH2_DIRECT_KEY_MAP 전체 mapping inventory는?
5. directKeyMap 중 curriculum EXACT로 볼 수 없는 mapping은 무엇인가?
6. rawKeyMap/overrides와 directKeyMap 충돌은 있는가?
7. h1/h2 sourcePrefix fence를 통과하는 학년 오염 문항이 있는가?
8. mixed course exam은 몇 건인가?
9. primaryStandardCourse 빈 값은 몇 건인가?
10. courseRanges / question-index standardCourse coverage는?
11. curriculum derive 가능한 비율은?
12. grade conflict 실제 건수는?
```

이 답 없이 heuristic을 확대하지 않는다.
특히 “고2 시험의 고1 단원 문항을 고1 Studio 기본 후보로 자동 포함”하는 변경은 Release 1에서 금지한다.

---

# 36. Release 1 Seal

다음이 모두 PASS해야 Finder v2 기본 ON.

```text
[ ] Never Downgrade tests
[ ] grade conflict report
[ ] curriculum coverage report
[ ] mixed course test
[ ] 기존 directKeyMap audit + reviewed Crosswalk set
[ ] index additive field parity
[ ] h1/h2 sourcePrefix 학년 fence 회귀 없음
[ ] legacy DB consumers unaffected
[ ] taxonomyVersion embedded
[ ] Data Health visible
```

---

# 최종 한 문장

> **Archive 2.0 Taxonomy는 현재의 학년별 sourcePrefix와 directKeyMap을 보존·감사하여 정식화하고, “문항이 어느 단원을 사용했는가”와 “그 시험이 어느 학년에 속하는가”를 절대 혼동하지 않으며, 검수되지 않은 cross-curriculum/cross-grade 동등성을 기본 자동출제에 사용하지 않는다.**
