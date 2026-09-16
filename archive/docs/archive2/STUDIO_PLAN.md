# JS아카이브 단원별 기출 Studio UI v2
## 다중 단원 · 반복 테스트 무중복 · 학생별 출제이력 제외 · 문항별 교체 통합 계획서 v1.2

> 목적: 현재 `단원별 기출`의 강한 기능 구조는 보존하고, 화면을 ‘설정 폼’에서 ‘시험지 제작 Studio’로 재설계한다. 동시에 다중 단원 출제, 단원별 균등/직접 배분, 반복 테스트 무중복, **학생별 누적 출제이력 기반 문항 제외**, 문항별 교체를 하나의 일관된 출제 흐름으로 통합한다.
>
> 기준 파일: `archive/unit-past-exams.html`, `archive/unit-past-exams.js`, `archive/unit-past-exams-core.js`, `archive/unit-past-exams.css`, `archive/mixer-selector.js`, `archive/mixed_engine.html`
>
> v1.2 실제 코드 감사 기준: Archive frontend뿐 아니라 `apmath/worker-backup/worker`의 `routes/exams.js`, `routes/student-portal.js`, `schema.sql`, migrations, `foundation-db.js`, `wrangler.jsonc`까지 확인했다. 현재 Worker에는 stable assignment ID, recipient snapshot, exclusions, Student Portal, OMR, wrong_answers, mixed payload, PDF pipeline이 이미 존재한다. 새로 필요한 핵심은 이 구조를 갈아엎는 것이 아니라 `assignment ↔ canonical questionUid` bridge를 추가하는 것이다.

> **v1.2 핵심 수정:** 학생 history는 별도 student×question exposure ledger를 새로 만드는 방식이 아니라, 기존 `class_exam_assignment_recipients - exclusions`와 신규 `class_exam_assignment_questions`를 JOIN해 계산한다. `mixed_payload_json`은 기존 content snapshot으로 승격하고, qid_v1 안정성 감사와 legacy history coverage를 P0로 올린다.

---

# 0. 이번 작업의 성격

이번 작업은 `단원별 기출`을 새 제품으로 다시 만드는 작업이 아니다.

현재 잘 동작하는 다음 기능은 **제품 계약으로 동결**한다.

- 단원 → 출처 → 구성 → 확인 4단계 흐름
- 전체 아카이브 / 학교·연도 지정 출처
- 소단원·난이도·문항 수 구성
- 빠른 구성 / 세부 조합
- 부족 문항 완화 흐름
- 문제지 미리보기
- 일반 출력 / 학생에게 출제
- 헤더 수정
- 문항별 교체 / 빠른 교체 / 수동 후보 선택 / 되돌리기
- `mixedQuestions_*`, `mixedMeta_*` 기반 mixed output handoff
- canonical question identity / questionUid 기반 중복 판단

이번 작업에서 바꾸는 것은 크게 세 축이다.

1. **UX/UI 구조를 Studio 형태로 재설계**
2. **다중 단원 + 반복 테스트 시리즈를 기존 선택·교체 기능과 통합**
3. **학생별 누적 출제이력을 canonical UID exclusion으로 연결해, 같은 학생에게 이미 냈던 문제를 다음 출제에서 기본 제외**

기능 추가보다 중요한 원칙은 **기존 정상 경로를 깨지 않는 것**이다.

---

# 1. 현재 구조 진단

## 1.1 현재 장점

현재 단원별 기출은 기능적으로 이미 상당히 완성도가 높다.

- 교육과정 단원 카탈로그가 명확하다.
- 출처 선택과 구성 선택이 분리되어 있다.
- 난이도·소단원·세부 조합이 존재한다.
- 문항 부족을 조용히 보정하지 않고 보고한다.
- generated paper → `mixed_engine.html` 출력 경로가 이미 안정적으로 연결되어 있다.
- 최근 추가된 문항별 교체는 현재 generated papers 전체의 사용 identity를 모아 이미 사용 중인 문항을 후보에서 제외한다.
- 학교·연도 지정 출제 후 교체할 때 원래 선택한 연도 범위를 보존한다.
- `archive/index.html`의 학생 출제 패널은 반 → 학생 roster를 불러오고 개별 `studentId` 선택/제외를 이미 지원한다.
- 단원별 기출 `assignPaper()` handoff에는 `questionUids`가 포함되지만, 현재 출제 등록 흐름에서 학생별 문항 UID 이력을 조회·재사용하는 명시적 계약은 없다.

따라서 이 기능들을 다시 구현하지 않는다.

## 1.2 현재 UI의 핵심 문제

현재 화면은 기능이 추가될수록 다음 구조로 성장했다.

`기능 추가 → 기존 화면 아래에 설정 행/박스 추가`

그 결과:

- 대부분의 컨트롤이 동일한 시각 강도를 가진다.
- `border-bottom + input/select + label`이 반복되어 관리자 설정 페이지처럼 보인다.
- 무엇이 핵심 결정이고 무엇이 보조 옵션인지 구분이 약하다.
- Step 4 우측 패널에 요약·헤더·출력·문항 수정·교체 후보가 세로로 계속 쌓인다.
- 문항교체가 강력한 기능인데도 별도 도구 패널처럼 느껴지지 않고 ‘하단에 붙은 기능’처럼 보인다.
- 향후 다중 단원과 반복 테스트까지 같은 방식으로 추가하면 화면이 더 복잡해질 가능성이 높다.

즉, 현재 문제는 색상보다 **정보 구조와 interaction hierarchy**다.

---

# 2. 최종 제품 개념

이번 v2의 제품 개념은 다음과 같다.

> **Unit Past Exam Studio**
>
> 시험범위를 고르고 → 출처를 정하고 → 구성 계획을 만들고 → 실제 A4 문제지를 보면서 필요한 문항만 교체한 뒤 → 바로 출력/학생 출제하는 교사용 작업공간.

디자인의 핵심은 ‘예쁘게 꾸미기’가 아니라 다음 세 가지다.

- 지금 무엇을 선택했는지 항상 보인다.
- 지금 무엇을 결정해야 하는지 한눈에 보인다.
- 실제 문제지와 수정 도구가 같은 화면에서 자연스럽게 연결된다.

---

# 3. 절대 원칙

## 3.1 단일 단원 경로 회귀 금지

기본 진입은 지금처럼 **한 단원 선택**이다.

다중 단원은 별도 mode로 추가한다.

```text
selectionMode = 'single' | 'multi'
selectedUnitKey       // 기존 유지
selectedUnitKeys[]    // 신규
```

`single`에서는 기존 로직과 결과가 동일해야 한다.

## 3.2 같은 과목 안에서만 다중 단원 허용

v1 범위에서는 동일 학년·동일 과목 단원끼리만 다중 선택한다.

예:

- 공통수학2 평면좌표 + 직선 + 원 + 이동 + 집합: 허용
- 공통수학1 순열과 조합 + 공통수학2 집합: 차단

이는 제목, 단원 order, 범위 선택, 출처 범위, 교체 후보, 출력 메타를 단순하게 유지한다.

## 3.3 canonical UID가 중복 판정의 Authority

다음 네 범위 모두 canonical questionUid/record identity 기준으로 중복 0을 보장한다.

1. 한 문제지 내부
2. 같은 회차의 여러 split paper 사이
3. 같은 테스트 시리즈의 이전 회차와 현재 회차 사이
4. **선택한 학생에게 과거 최종 출제된 문항과 현재 출제 사이**

텍스트가 비슷한 유사문항 의미 중복은 이번 범위에 포함하지 않는다.

## 3.4 출력 엔진 복제 금지

이번 기능은 출력 렌더러를 새로 만들지 않는다.

최종 선택 문항은 기존 `mixedQuestions_*`, `mixedMeta_*` handoff를 통해 현재 출력 경로로 넘긴다.

UI 개편 때문에 `mixed_engine.html`의 렌더·pagination·print 로직을 복사하지 않는다.

## 3.5 기능 추가와 시각 개편을 분리하지 않는다

다중 단원 UI를 임시로 붙이고 나중에 CSS를 다시 손대는 방식은 금지한다.

State/DOM 구조를 두 번 뒤집지 않도록 이번 작업에서 UI v2 구조와 신규 기능을 함께 설계한다.


## 3.6 학생 출제이력은 기존 APMS Assignment를 Authority로 본다

학생별 중복 제외는 브라우저 `localStorage`만으로 구현하지 않는다.

하지만 별도의 학생 exposure subsystem도 만들지 않는다.

현재 서버 Authority:

```text
class_exam_assignments.id
        ↓
class_exam_assignment_recipients
        ↓
- class_exam_assignment_exclusions
        ↓
effective recipients
```

신규 최소 bridge:

```text
class_exam_assignment_questions
        ↓
questionUid[]
```

학생 이력:

```text
History(studentId)
=
해당 학생이 effective recipient인 assignment들의
class_exam_assignment_questions.question_uid UNION
```

학생 exposure의 최종 Authority는 `questionUid`다. `unitKey`, difficulty,
problem type은 assignment 당시 metadata snapshot과 선택/진단 정보로만
사용하며, metadata나 unit 재분류 후 history correctness를 자르는 HARD
predicate로 사용하지 않는다.

규칙:

- `studentId` = APMS `students.id`
- `questionUid` = canonical question identity
- draft/preview는 history가 아님
- 현재 assignment row가 존재하고 recipient snapshot에 포함되며 exclusion이 아닌 경우를 기본 effective assignment로 봄
- 학생이 OMR을 제출했는지와 별개로 assignment에 포함되었다면 “출제됨”으로 본다
- 학생×문항 exposure row를 별도로 복제 저장하지 않는다
- legacy history 정확도는 `VERIFIED / LEGACY_INFERRED / UNRESOLVED`로 구분한다

## 3.7 다수 학생에게 하나의 공통 문제지를 낼 때는 history UNION을 사용한다

학생 A와 학생 B에게 같은 문제지를 출제하면서 둘 모두에게 재출제를 막으려면:

```text
excludedStudentHistoryUids
= History(A) ∪ History(B) ∪ ...
```

선택 대상 중 한 명이라도 과거에 본 문항이면 기본 후보에서 제외한다.

이번 범위에서는 학생마다 서로 다른 개인화 문제지를 자동 생성하지 않는다.

## 3.8 `qid_v1` 안정성 감사가 선행이다

현재 Worker UID는 개념적으로:

```text
qid_v1 = SHA256(normalizedSourceFile + "#" + sourceOrdinal)
```

이다.

따라서 다음이 학생 history HARD exclusion 전에 반드시 검증되어야 한다.

- source file rename/path 이동
- sourceOrdinal 이동
- 문항 앞삽입/삭제
- 같은 위치의 문항 자체 교체
- metadata/content 수정 시 UID 유지/변경 경계

UID churn이나 same-position replacement 문제가 확인되면 explicit migration 또는 identity v2를 별도 설계한다.
현재 qid_v1을 계획서만 보고 전면 재발급하지 않는다.

---

# 4. 전체 화면 구조

## 4.1 App Shell

현재의 큰 원형 Stepper는 축소한다.

### 목표 형태

```text
← JS 아카이브                                  단원별 기출
공통수학2 · 시험범위 문제지 만들기

단원 선택        출처        구성        확인
   ✓              ✓          ●          ○
```

- app bar는 64~68px 수준
- progress는 1줄 compact navigation
- 현재 단계만 primary
- 완료 단계는 check
- 미완료 단계는 muted
- 단계 아래 필요한 경우 짧은 context만 표시

화면의 세로 공간을 Stepper가 과도하게 차지하지 않도록 한다.

---

# 5. Design System v2

## 5.1 색상

```text
Ink / Primary     #172033
Background        #F6F7F9
Surface           #FFFFFF
Surface Soft      #F9FAFB
Border            #E5E7EB
Border Strong     #D0D5DD
Muted             #667085
Accent            #F06C3E  // 작은 강조에만
Success           #16865C
Warning           #B7791F
Danger            #B42332
```

### 규칙

- 선택 상태는 navy 계열 사용
- orange는 단원 번호, 작은 강조, 현재 위치 indicator 정도로 제한
- 카드마다 그림자 금지
- 기본은 1px border
- sticky/floating action bar만 매우 약한 shadow 허용

## 5.2 Radius / Spacing

- 큰 surface: 14px
- 일반 카드: 12px
- input/button: 9~10px
- 최소 클릭 높이: 40~44px
- 주요 CTA: 46~50px
- section gap: 20~24px

## 5.3 Button hierarchy

### Primary
- 계속하기
- 문제지 만들기
- 일반 출력
- 학생에게 출제

### Secondary
- 문항 수정
- 범위 선택
- 직접 배분
- 출처 수정

### Tertiary
- 이전
- 초기화
- 되돌리기

### Danger
- 실제 destructive action에만 사용

---

# 6. Step 1 — 단원 선택 재설계

## 6.1 기본 상태

```text
단원을 선택하세요
시험범위에 포함할 단원을 선택합니다.

[ 한 단원 ] [ 여러 단원 ]
```

기본값은 `한 단원`.

기존 사용자는 지금처럼 단원을 한 번 클릭해 다음 단계로 진입할 수 있다.

## 6.2 여러 단원 모드

단원 목록은 큰 타일이 아니라 **compact selection card/list hybrid**로 만든다.

```text
공통수학2                                      9개 단원

┃ ✓ 01   평면좌표                         95문항
┃        좌표 · 거리 · 내분점

┃ ✓ 02   직선의 방정식                    94문항
┃        직선 · 위치관계 · 거리

  ○ 03   원의 방정식                     140문항
```

선택 상태:

- left accent line
- check circle
- subtle navy background
- count badge

## 6.3 다중 선택 방법

지원:

- 개별 클릭
- 현재 과목 전체 선택
- 연속 범위 선택

### 범위 선택 UI

```text
시작 단원  [평면좌표 ▼]
끝 단원    [집합 ▼]

→ 5개 단원 선택
```

내부 정본은 start/end가 아니라 `selectedUnitKeys[]`다.

## 6.4 Sticky Selection Bar

다중 선택 시 화면 하단에 고정한다.

```text
5개 단원 선택 · 617문항
평면좌표 · 직선의 방정식 · 원의 방정식 · 도형의 이동 · 집합

[선택 초기화]                            [이 범위로 출제 →]
```

모바일에서는 2줄 compact layout.

---

# 7. Step 2 — 출처 재설계

기능은 거의 그대로 유지한다.

## 7.1 상단 범위 Summary

```text
출제 범위
공통수학2 · 5개 단원
평면좌표 · 직선 · 원 · 이동 · 집합
```

## 7.2 출처 선택

```text
[ 전체 아카이브 ]   [ 학교·연도 지정 ]
```

현재 radio 형태를 카드형 segmented control로 정리한다.

## 7.3 학교·연도 지정

기존 기능을 유지하되 모든 필드를 한꺼번에 세로로 늘어놓지 않는다.

권장 그룹:

- 범위
- 연도
- 학기/시험
- 학교

각 그룹은 surface section으로 묶는다.

다중 단원인 경우 기존 `collectionScope`와 선택 단원 범위가 충돌하지 않도록 다음 원칙을 둔다.

- 신규 multi mode에서는 Step 1의 `selectedUnitKeys[]`가 단원 범위 Authority
- Step 2의 학교·연도 설정은 학교/연도/학기/시험 scope만 추가 제한
- 기존 single mode의 collection current/range/cumulative/course 옵션은 회귀 없이 유지

---

# 8. Step 3 — 구성 화면 전면 재설계

현재의 긴 config row 구조를 **결정 카드 3~4개**로 바꾼다.

## 8.1 다중 단원 출제 방식

다중 단원일 때 상단에 3개 방식 표시.

```text
[ 전체에서 구성 ]   [ 단원별 균등 ]   [ 직접 배분 ]
```

### A. 전체에서 구성

선택 단원의 후보 전체를 하나의 pool로 보고 총 N문항 선택.

```text
난이도: 중
총 문항 수: 50
```

단원별 quota 보장 없음.

### B. 단원별 균등 — 기본 추천

```text
난이도: 중
단원당: 10문항

평면좌표          10 / 신규 가능 34
직선의 방정식     10 / 신규 가능 46
원의 방정식       10 / 신규 가능 27
도형의 이동       10 / 신규 가능 39
집합              10 / 신규 가능 51

총 50문항
```

### C. 직접 배분

```text
                    하      중      상      합계
평면좌표            0      10       0       10
직선의 방정식       0      10       0       10
원의 방정식         0      10       0       10
도형의 이동         0      10       0       10
집합                0      10       0       10
------------------------------------------------
합계                0      50       0       50
```

빠른 preset:

- 모두 하 5
- 모두 하 10
- 모두 중 10
- 하5 + 중5
- 초기화

## 8.2 조건 일치 전부

별도 토글:

```text
출제량
● 지정 수만 출제
○ 조건에 맞는 문항 전부
```

전부 출제일 때 예상 split 수를 표시한다.

```text
총 162문항
약 50문항 기준 4개 문제지로 분할 예정
```

기존 `targetQuestionsPerPaper=50`, `hardMaxQuestionsPerPaper=80` 계약을 유지한다.

## 8.3 난이도 선택

난이도는 단순 checkbox보다 availability를 같이 보여준다.

```text
하            중            상
163           214           87
              ●
```

반복 테스트 시에는 **전체 available**이 아니라 **신규 available**을 함께 표시한다.

---

# 9. 반복 테스트 Series 설계

## 9.1 목적

같은 범위/구성으로 1차, 2차, 3차 테스트를 만들 때 이전 회차와 같은 문항이 다시 선택되지 않도록 한다.

## 9.2 Series 데이터 구조

개념 구조:

```text
seriesId
profileId
course
selectedUnitKeys[]
sourceConfig
compositionPlan
rounds[]
```

각 round:

```text
roundNo
status: draft | sealed
createdAt
paperSnapshotKeys[]
questionUids[]
```

## 9.3 중복 규칙

새 회차 후보:

```text
eligible candidates
- 현재 회차에서 이미 사용한 UID
- 현재 회차 split paper에서 사용한 UID
- 같은 series의 sealed 이전 회차 UID 전체
```

결과 invariant:

```text
withinRoundDuplicateCount == 0
crossRoundDuplicateCount == 0
```

## 9.4 Draft와 Seal

현재 회차가 편집 중일 때는 `paper.records`를 정본으로 본다.

문항 교체가 일어날 때마다 series ledger를 복잡하게 수정하지 않는다.

회차를 확정/출력/학생출제 직전에 현재 `paper.records`의 최종 UID set을 검증하고 round를 seal한다.

장점:

- 교체/되돌리기 반복 시 ledger drift 방지
- 최종 실제 문제지만 series history에 남음

## 9.5 다음 회차 생성

Step 4에서:

```text
1차 테스트 · 완료
50문항 · 중복 0

[같은 조건으로 2차 테스트 만들기]
```

2차 생성 시 현재 plan을 복제하고 `excludeQuestionUids = 1차 sealed UID` 적용.

3차는 1차+2차 sealed UID 전체 제외.

---


# 10. 학생별 누적 출제이력 Exclusion — 실제 APMS 구조 기준

이 기능은 같은 시리즈의 1차/2차/3차 무중복과 별개다.

예를 들어 길정현 학생에게 지난주 다른 시리즈에서 이미 출제했던 문항이 있다면, 오늘 새 시리즈에서도 동일 canonical UID를 기본 후보에서 제외한다.

## 10.1 현재 실제 Assignment 구조

확인된 서버 흐름:

```text
class_exam_assignments
  ├─ id (UUID)
  ├─ class_id
  ├─ archive_file
  ├─ mixed_payload_json
  ├─ assignment_batch_id
  └─ PDF fields
        ↓
class_exam_assignment_recipients
  - 출제 시점 roster snapshot
        ↓
class_exam_assignment_exclusions
  - 실제 제외 학생
        ↓
Student Portal /student-portal/exams
```

서버 권한은 `teacher_classes` 기반 `canAccessClass / canAccessStudent / canAccessStudentsBatch`를 재사용한다.
새 RBAC를 만들지 않는다.

## 10.2 신규 핵심: `class_exam_assignment_questions`

학생별 history를 만들기 위해 학생×문항 row를 대량 복제하지 않는다.

신규 최소 테이블:

```text
class_exam_assignment_questions

assignment_id
order_no
question_uid
source_archive_file
source_question_no
source_question_ordinal
standard_unit_key
sub_unit_key              // optional
problem_type_key          // optional
difficulty_at_assignment
created_at
```

권장 제약:

```text
PRIMARY KEY (assignment_id, order_no)
UNIQUE (assignment_id, question_uid)
```

### MIXED assignment

`mixed_payload_json.questions[]`에서 canonical identity를 동결한다.

### 일반 Archive assignment

`archive_file + exam_blueprints.source_question_uid/source_question_ordinal`을 사용한다.

## 10.3 학생 History Query

개념:

```text
History(studentId)
  = assignment_questions.question_uid
    WHERE studentId ∈ assignment_recipients
      AND studentId ∉ assignment_exclusions
```

여러 학생 공통 시험:

```text
HistoryUnion = History(A) ∪ History(B) ∪ ...
```

프론트가 과거 `mixed_payload_json`을 전부 내려받아 직접 파싱하지 않는다.
Worker에 batch history query를 둔다.

개념 요청:

```json
{
  "student_ids": ["student-123"],
  "candidate_question_uids": ["qid_v1_..."],
  "history_mode": "all"
}
```

기존 Studio filter와의 호환을 위해 `unit_keys`를 함께 보낼 수 있지만, 이는
query hint/diagnostic용 optional field일 뿐 history correctness의 HARD filter가
아니다. 서버는 먼저 recipients−exclusions와 assignment-question bridge에서
학생별 exposure UID set을 계산한 뒤 `candidate_question_uids`와 교집합을
계산한다. `candidate_question_uids`를 생략하면 full history UID set을 batch로
반환한다.

개념 응답:

```json
{
  "students": {
    "student-123": {
      "question_uids": ["qid_v1_..."],
      "matched_candidate_question_uids": ["qid_v1_..."],
      "coverage": {
        "verified": 84,
        "legacy_inferred": 0,
        "unresolved": 0
      }
    }
  },
  "union_question_uids": ["qid_v1_..."],
  "union_count": 84
}
```

정확한 endpoint 이름은 Worker route 스타일에 맞춰 구현 시 확정한다.
`question_uids`는 candidate가 주어진 경우 candidate와의 UID intersection,
생략된 경우 full effective history UID set이다. `coverage`는 candidate filter
전에 평가한 effective history rows/UID의 `VERIFIED / LEGACY_INFERRED /
UNRESOLVED` 상태를 함께 반환하여 후보 축소로 legacy gap을 숨기지 않는다. query는
selected studentIds를 batch로 처리하며 학생별 N+1 query를 금지한다.

## 10.4 대상 학생 선택 시점

학생 이력을 문제 선택 전에 제외하려면 Studio Step 3에서 optional target을 먼저 지정할 수 있어야 한다.

```text
출제 대상 (선택)
[학생 선택]
길정현 · 고1 A반
이전 출제 문항 제외  ON
제외 범위             전체 이력
확정 과거 사용        84문항
legacy 추정           0문항
```

- 학생을 선택하지 않으면 기존 일반 문제지 생성과 동일
- 한 명/여러 명 가능
- Step 3 target은 Step 4/Archive assign panel의 기본 선택값으로 전달
- 최종 target이 바뀌면 history conflict 재검증

## 10.5 History Policy

```text
studentHistoryMode = all | recent | off
```

기본 `all`.

권장 UI:

- 전체 이력
- 최근 90일
- 최근 30일
- 사용 안 함

history를 시스템이 조용히 OFF로 바꾸지 않는다.

## 10.6 Assignment identity는 이미 존재한다

canonical assignment identity:

```text
class_exam_assignments.id
```

`assignment_batch_id`는 여러 반 배포 묶음용이다.

현재 archive-backed assignment에는 class/date/archive identity를 이용하는
기존 lookup/upsert 흐름이 있으므로 새 assignment identity subsystem은 만들지
않는다. 다만 Phase 0 remote D1 감사 기준으로는 전체 UNIQUE 제약만 확인되었고,
archive-backed/manual partial unique index는 배포되어 있지 않았다. 또한
archive-backed 논리 identity 중복 9개 그룹이 관측되었다. 따라서 이 문서에서
말하는 “unique 방어”는 현재 route의 논리적 compatibility 방어를 뜻하며,
실제 DB 유일성 봉인은 Phase 1의 정리·검증 조건이다.

신규 프론트 hardening:

- `POST /class-exam-assignments` 반환 `assignment.id`를 보존
- 후속 exclusion/history 관련 요청은 가능하면 `assignment_id`를 우선 사용
- 기존 class/title/date/archive composite lookup은 compatibility fallback

## 10.7 Assignment question parity

학생 출제 성공 시 새 exposure row를 학생별로 쓰는 것이 아니라 assignment question set을 동결한다.

HARD:

```text
final paper UID set
== mixed payload/meta UID set
== class_exam_assignment_questions UID set
```

또한:

```text
question_count == assignment_questions row count
```

여야 한다.

## 10.8 Legacy History Coverage

`class_exam_assignment_recipients`는 2026-08-19 migration에서 기존 assignment를 당시 roster로 backfill했다.

따라서 과거 데이터는:

```text
VERIFIED
LEGACY_INFERRED
UNRESOLVED
```

로 구분한다.

assignment question backfill 우선순위:

```text
1. persisted mixed_payload_json의 canonical UID/sourceOrdinal
2. normal archive + exam_blueprints
3. 신뢰 가능한 sourceFile + sourceOrdinal 기반 qid_v1 재계산
4. 근거 부족 → UNRESOLVED
```

문제 번호만으로 UID를 추측하지 않는다.

## 10.9 Selection Exclusion 합성

```text
effectiveExcludeQuestionUids =
    currentRoundUsedUids
  ∪ sameSeriesPreviousRoundUids
  ∪ selectedStudentsHistoryUids
  ∪ explicitManualExcludeUids
```

원인별 diagnostics:

```text
excludedByCurrentRound
excludedBySeriesHistory
excludedByStudentHistory
excludedByManualRule
```

## 10.10 대상 학생 변경 Gate

Step 3에서 길정현으로 만든 뒤 Step 4에서 학생 B를 추가하면:

```text
History(B) ∩ currentPaperUids
```

를 즉시 다시 검사한다.

충돌 시:

- 그대로 출제 버튼 비활성
- 충돌 문항 수 표시
- `[충돌 문항 자동 교체]` 또는 `[구성으로 돌아가기]`
- 명시적 `재사용 허용` 전에는 진행 금지

## 10.11 문항별 교체와 History

교체 후보에도 동일 history set을 적용한다.

```text
교체 후보
- 현재 generated papers 사용 UID
- 같은 series 이전 sealed UID
- 선택 학생 HistoryUnion UID
```

수동 교체로 과거 문항을 다시 넣는 우회 경로를 막는다.

## 10.12 OMR / 오답과 canonical UID 연결

현재 학생 OMR/선생님 Bulk OMR은 `wrong_answers.question_id`에 시험지 번호를 저장한다.

신규 bridge가 생기면:

```text
exam_sessions.assignment_id
+ wrong_answers.question_id(order_no)
        ↓
class_exam_assignment_questions.order_no
        ↓
question_uid
```

로 과거 오답을 canonical UID에 연결할 수 있다.

이것은 향후 학생 취약단원/오답 보강의 기반이지만 Release 1의 자동 추천 기능은 아니다.

## 10.13 별도 START lifecycle은 만들지 않는다

현재 학생 포털에서는 assignment가 보이는 순간 “출제됨”이고, `exam_sessions`는 OMR 제출 시 생성/갱신된다.

Release 1 학생 history는 **출제 여부**를 기준으로 하므로 `STARTED` 상태를 새로 만들 필요가 없다.
실제 열람 여부가 제품 요구가 될 때만 `viewed_at` 등을 별도 검토한다.

## 10.14 UI 표시

Step 3:

```text
중복 방지
✓ 같은 테스트 시리즈 이전 문항 제외
✓ 선택 학생의 이전 출제 문항 제외

대상: 길정현
확정 과거 사용 84문항
현재 조건에서 제외 19문항
신규 사용 가능 143문항
```

Step 4 Inspector:

```text
중복 검증
현재 문제지 내부           0
같은 시리즈 이전 회차      0
길정현 이전 출제와 중복    0
history coverage          VERIFIED
```

legacy gap이 있으면 “전체 과거 이력 100%”라고 표시하지 않는다.

---

# 11. 문항별 교체와 Series 통합

현재 문항 교체 기능은 폐기하지 않고 **Studio의 핵심 Inspector 도구로 승격**한다.

## 11.1 다중 단원에서 교체 후보 Authority

현재 단일 단원 구조의 `state.selectedUnitKey` 기준 후보 pool 사용을 다중 단원에서 그대로 쓰면 안 된다.

다중 단원에서는 **선택된 현재 문항 자체의 mapped/standard unitKey**가 교체 후보 단원 Authority다.

예:

- 23번이 원의 방정식 문항
- 후보 기본 pool = 원의 방정식 records
- 기본 filter = 현재 문항 소단원 + 현재 난이도

따라서 교체해도 `단원별 10개` quota가 깨지지 않는다.

## 11.2 교체 후보 exclusion

교체 후보는 다음을 모두 제외한다.

```text
현재 문항 자신
현재 generated papers 전체에서 사용 중인 identity
같은 series 이전 sealed rounds의 questionUid
```

즉 자동생성 무중복과 수동교체 무중복이 동일 계약을 사용한다.

## 11.3 교체 후 quota 검증

기본 교체는 동일 unit 안에서 일어나므로 unit quota 유지.

난이도 filter를 사용자가 바꿔 다른 난이도로 교체한 경우:

- 총 문항 수는 유지
- 단원 quota는 유지
- 난이도 계획과 실제 분포 차이는 Step 4 summary에서 즉시 반영

직접 배분 plan의 난이도 quota를 HARD로 유지할지 여부는 다음처럼 처리한다.

- `같은 조건으로 교체`: HARD 유지
- 사용자가 filter를 수동 변경 후 교체: 명시적 사용자 변경으로 허용하되 `계획 대비 편차` 표시

## 11.4 Undo

기존 `replacementHistory` 유지.

단, 복원할 before UID가:

- 현재 다른 paper에 존재하거나
- 이전 sealed round에서 금지된 UID라면

복원 차단.

---

# 12. Step 4 — Preview + Inspector Studio

이번 디자인 개편의 핵심이다.

## 12.1 Desktop layout

```text
┌──────────────────────────────────────┬─────────────────────┐
│                                      │ [구성] [문항] [헤더] │
│                                      │                     │
│             A4 Preview               │     Inspector       │
│                                      │                     │
│                                      │                     │
└──────────────────────────────────────┴─────────────────────┘
```

권장 비율:

- Preview 70~74%
- Inspector 26~30%

Inspector는 sticky.

현재처럼 기능 블록을 아래로 계속 추가하지 않는다.

## 12.2 구성 탭

```text
문제지 구성

공통수학2 · 5개 단원
중 · 단원당 10문항

평면좌표          10
직선의 방정식     10
원의 방정식       10
도형의 이동       10
집합              10

총 50문항
현재 회차 중복       0
이전 회차와 중복     0
선택 학생 이력 중복   0
```

Series가 있으면:

```text
2차 테스트
이전 회차 사용 50문항
이번 회차 신규 50문항
```

학생 history mode가 켜져 있으면:

```text
대상 길정현
과거 출제 84문항
현재 문제지와 중복 0
```

## 12.3 문항 탭

문항 수정 ON 상태에서 A4 preview 문항 클릭 시 자동 활성화.

```text
23번 문항

원의 방정식 · 중
2025 제일고 · 2학기 중간 · 원본 14번

교체 조건
소단원 [원의 방정식 ▼]
난이도 [중 ▼]

[같은 조건으로 빠른 교체]

후보 26문항
--------------------------------
2024 매산고 · 원본 17번
원의 방정식 · 중              [교체]

2023 팔마고 · 원본 12번
원의 방정식 · 중              [교체]
```

상단에 `↶ 마지막 교체 되돌리기` tertiary action.

후보가 많으면 현재 pagination 유지.

## 12.4 헤더 탭

오늘 추가된 헤더 수정 기능을 별도 긴 박스가 아니라 Inspector tab으로 이동.

```text
시험지 헤더

제목
[ 공통수학2 중간대비 2차 ]

부제
[ 평면좌표 ~ 집합 ]

우측 정보
[ AP수학 · 고1 ]

☑ 이름란
☑ 점수란
☑ 해설 적용
☑ 정답 적용
```

실시간 preview 반영은 기존 계약 유지.

## 12.5 Bottom Action Bar

Inspector 아래 고정 CTA:

```text
[일반 출력]  [학생에게 출제]
```

Series일 경우 secondary:

```text
[같은 조건으로 다음 테스트 만들기]
```

---

# 13. 모바일 / 좁은 화면

850px 이하에서는 현재처럼 1열 전환하되 Inspector를 단순히 preview 아래에 길게 붙이지 않는다.

권장:

- Preview 상단
- 하단 sticky toolbar: `구성 | 문항 | 헤더`
- 선택 탭은 bottom sheet 또는 section expand
- 주요 CTA는 하단 2버튼

문항 후보는 카드 1열.

---

# 14. State 설계

기존 state에 무작정 필드를 추가하지 않고 영역별 nested state로 정리하는 것을 권장한다.

## 14.1 호환 우선안

기존 필드는 유지하면서 신규만 namespace로 추가한다.

```text
state.selection = {
  mode: 'single' | 'multi',
  selectedUnitKeys: [],
  selectionMethod: 'individual' | 'range' | 'all'
}

state.composition = {
  distributionMode: 'pool' | 'equal' | 'custom' | 'all',
  rows: [],
  totalCount: 0
}

state.series = {
  seriesId: '',
  roundNo: 1,
  excludedQuestionUids: new Set(),
  previousRounds: []
}

state.targeting = {
  enabled: false,
  selectedStudentIds: [],
  selectedClassIds: [],
  studentLabels: [],
  historyMode: 'all' | 'recent' | 'off',
  recentDays: 90,
  historyTargetHash: '',
  historyLoaded: false,
  historyError: '',
  studentHistoryUids: new Set(),
  studentHistoryUnionCount: 0,
  historyCoverage: { verified: 0, legacyInferred: 0, unresolved: 0 }
}

state.inspector = {
  tab: 'summary' | 'question' | 'header'
}
```

기존 `selectedUnitKey`, `filterState`, `collectionState`, replacement state는 migration 동안 유지.

한 번에 state 전면 rewrite 금지.

---

# 15. Selection Engine 구조

## 15.1 목표

UI 코드가 직접 후보를 이리저리 필터해서 quota를 맞추지 않는다.

다중 단원 selection은 공통 selector가 책임진다.

## 15.2 Blueprint contract

개념 입력:

```text
[
  { unitKey: 'H22-C2-01', difficultyBucket: '중', count: 10 },
  { unitKey: 'H22-C2-02', difficultyBucket: '중', count: 10 },
  { unitKey: 'H22-C2-03', difficultyBucket: '중', count: 10 },
  { unitKey: 'H22-C2-04', difficultyBucket: '중', count: 10 },
  { unitKey: 'H22-C2-05', difficultyBucket: '중', count: 10 }
]
```

공통 options:

```text
excludeQuestionUids[]        // effective union: round + series + student history + explicit
excludeReasonCounts
includeSchools[]
year range
source restrictions
selectionSeed
```

결과:

```text
selected[]
rows[]
requestedCount
selectedCount
shortage
excludedPreviouslyUsed
excludedBySeriesHistory
excludedByStudentHistory
excludedByCurrentRound
withinSelectionDuplicateCount
```

## 15.3 mixer-selector 재사용 원칙

현재 `mixer-selector.js`가 이미 unitKeys, difficulty, count, excluded/recent UIDs 계약을 가진다.

따라서 `mixer.html`의 고급 blueprint 로직을 단원별 기출에 복사하지 않는다.

권장 방식:

- `mixer-selector.js`에 set-level blueprint selection API를 공통 함수로 올림
- Mixer와 Unit Past 둘 다 그 API 사용

파일명이 Mixer이지만 이번 작업에서 무리한 rename/refactor는 하지 않는다.

이후 별도 통합 작업에서 generic naming을 검토할 수 있다.

---

# 16. 부족 문항 정책

기본은 HARD 중복 금지.

예:

```text
원의 방정식 · 중
요청 10
신규 가능 7
부족 3
```

자동으로 이전 회차 3문항을 재사용하지 않는다.

사용자 선택 옵션:

- 중복 없이 7문항으로 낮추기
- 인접 난이도 허용
- 부족분을 다른 선택 단원으로 재배분
- 이전 문항 재사용 허용

마지막 옵션은 명시적으로 눌러야만 가능.

학생 history 때문에 부족한 경우에는 원인을 분리해 보여준다.

```text
전체 후보 31
학생 이력 제외 18
시리즈 이력 제외 4
신규 가능 9
요청 10
부족 1
```

완화 우선순위:

1. 문항 수 낮추기
2. 인접 난이도 허용
3. 다른 선택 단원으로 재배분
4. 학생 history 범위를 `전체 → 최근 90일 → 최근 30일`로 명시적 축소
5. 마지막 수단으로 이전 문항 재사용 허용

학생 history를 시스템이 조용히 OFF로 바꾸는 행위 금지.

기본 생성 버튼은 shortage가 있는 동안 차단.

---

# 17. URL / 저장 / 복원

## 17.1 URL

기존 single-unit URL contract는 유지한다.

multi mode에서는 추가 query를 사용한다.

예:

```text
selectionMode=multi
units=H22-C2-01,H22-C2-02,H22-C2-03,H22-C2-04,H22-C2-05
distribution=equal
```

너무 큰 custom blueprint는 기존처럼 JSON parameter 사용 가능하나 URL 길이를 고려한다.

## 17.2 Series 저장

예시 key:

```text
APMATH_UNIT_PAST_SERIES_v1:<seriesId>
```

저장 내용:

- selectedUnitKeys
- source config
- composition plan
- sealed rounds
- final questionUids per round

현재 draft는 state/paper.records를 authority로 두고 필요하면 lightweight autosave만 한다.

## 17.3 학생 History 저장 / 조회

학생별 출제이력은 localStorage나 Series ledger를 Authority로 사용하지 않는다.

영속 Authority:

```text
class_exam_assignment_recipients
- class_exam_assignment_exclusions
JOIN class_exam_assignment_questions
```

Frontend cache는 허용하지만:

- cache miss 시 서버 batch query
- cache는 target hash + history policy에 묶음
- assignment/exclusion 변경 후 관련 학생 cache invalidate
- 다른 PC/브라우저에서도 동일 history를 얻어야 함
- coverage 상태도 같이 cache

단원별 기출 → index assignment handoff에는 최소 다음이 살아 있어야 한다.

```text
paperSnapshotKey
questionUids[]
question source identity/order information
seriesId
roundNo
targetStudentIds[]   // Studio 선선택 시
studentHistoryMode
```

`archive/index.html`은 create 응답의 `assignment.id`를 잃지 않고 후속 exclusion/diagnostics에 사용할 수 있어야 한다.

## 17.4 mixedMeta 확장

기존 필드를 유지하고 다음을 추가 가능:

```text
unitKeys[]
unitNames[]
distributionMode
distributionPlan
questionUids[]
seriesId
roundNo
previousRoundCount
crossRoundDuplicateCount
studentHistoryMode
studentHistoryTargetCount
studentHistoryExcludedCount
studentHistoryConflictCount
studentHistoryCoverage
```

기존 소비자가 모르는 신규 필드는 무시 가능해야 한다.

---

# 18. 파일별 변경 범위

## `archive/unit-past-exams.html`

- selector script/load ordering 필요 시 최소 변경
- cache version 갱신
- app shell의 최소 static container만 유지

## `archive/unit-past-exams.css`

- Studio design token
- compact stepper
- unit multi-select list
- sticky selection bar
- composition cards/table
- Preview + Inspector
- replacement candidate redesign
- responsive/bottom-sheet

## `archive/unit-past-exams.js`

- multi selection state
- distribution plan
- series lifecycle
- effective exclude UID plumbing
- current record unit 기준 replacement pool
- Inspector state/render
- student target/history query state
- mixedMeta questionUids/coverage 확장

## `archive/unit-past-exams-core.js`

- 기존 profile sourcePrefix 보존
- 기존 HIGH1/HIGH2 direct map 보존 및 taxonomy audit 대상화
- unit set / availability helper
- record unitKey authority helper
- 출력 renderer 로직 추가 금지

## `archive/mixer-selector.js`

- blueprint set-level selection API
- excludeQuestionUids 공통 적용
- row diagnostics
- duplicate invariants

## `archive/index.html`

기존 반/학생 선택 UX를 재사용한다.

필요 변경:

- Unit Past handoff의 `questionUids[]`, series metadata, target IDs 보존
- Studio target을 assignment panel 초기값으로 반영
- 최종 target 변경 시 history conflict 재검증
- `registerIndexClassExamAssignment()` 반환 `assignment.id` 보존
- exclusion 요청은 신규 backend 지원 시 `assignment_id`를 우선 전달
- 기존 composite lookup fallback은 호환용으로 유지

## AP Math OS Worker — 실제 위치

```text
apmath/worker-backup/worker/routes/exams.js
apmath/worker-backup/worker/routes/student-portal.js
apmath/worker-backup/worker/helpers/foundation-db.js
apmath/worker-backup/worker/schema.sql
apmath/worker-backup/worker/migrations/
```

신규 최소 구현:

1. migration: `class_exam_assignment_questions`
2. assignment create/update 시 question rows freeze/upsert
3. MIXED payload → question row 추출
4. normal archive + exam_blueprints → question row 추출
5. student history batch query
6. 기존 `canAccessStudentsBatch` 권한 재사용
7. legacy assignment question backfill/report
8. history coverage diagnostics
9. 가능하면 exclusion endpoint의 `assignment_id` preferred path 추가

새로 만들지 않는 것:

- 새로운 Student table
- 새로운 Assignment table
- student×question exposure ledger
- 별도 Snapshot DB
- 별도 STARTED session lifecycle

## `archive/mixed_engine.html`

원칙적으로 수정하지 않는다.
신규 metadata를 렌더링에 실제로 필요로 할 때만 최소 adapter 변경.

---

# 19. 구현 Phase

## Phase 0 — Baseline Freeze + Real Backend Audit Seal

현재 단일 단원 기능 fixture:

- 전체 아카이브
- 학교·연도
- quick / advanced
- header edit
- question replace
- print handoff
- student assign handoff

이미 backend 위치와 핵심 schema는 확인했다.
추가로 확정:

- Worker backup HEAD ↔ 실제 배포 revision parity
- qid_v1 stability/churn
- mixed/normal assignment question backfill coverage
- 2026-08-19 이전 recipient history coverage
- 기존 directKeyMap/sourcePrefix 회귀 baseline

산출:

```text
ARCHIVE_2_IDENTITY_AUDIT.md
ARCHIVE_2_HISTORY_COVERAGE.md
```

## Phase 1 — Assignment Question Bridge

UI 대개편보다 먼저 작은 backend bridge를 닫는다.

- `class_exam_assignment_questions` migration
- MIXED/normal assignment row 생성
- assignment create/update/retry idempotency
- final UID parity
- legacy backfill/report
- batch student history query
- authorization
- history coverage status

## Phase 2 — UI Shell v2

기능 변경 없이:

- compact appbar/stepper
- hierarchy
- button hierarchy
- Preview + Inspector layout

## Phase 3 — Multi Unit Selection

- single/multi
- selectedUnitKeys
- individual/range/all
- sticky selection bar
- same-course gate
- 기존 profile sourcePrefix 유지

## Phase 4 — Multi Unit Composition + Inspector

- pool/equal/custom/all
- availability
- shared selector
- shortage diagnostics
- summary/question/header Inspector
- current-record unit replacement pool

## Phase 5 — Student History Integration

- Step 3 optional target selector
- APMS roster/student ID 재사용
- history batch query
- history UNION exclusion
- coverage 표시
- final target 변경 conflict gate
- replacement 후보 history exclusion
- assignment question parity

## Phase 6 — Test Series

- seriesId
- sealed rounds
- previous UID exclusion
- next round generation
- student history union
- replacement candidate exclusion
- round seal validation

## Phase 7 — Full Runtime Verification

실제 브라우저에서:

- 일반 1/2/3차
- 학생 1명/여러 명
- 문항 교체/undo
- final assignment
- Student Portal 노출
- 학생/교사 OMR
- 다음 출제에서 history 재조회
- wrong_answers → assignment_questions UID 연결 샘플 검증

까지 수행.

---

# 20. 필수 실행 테스트 Matrix

## A. 기존 단일 단원 회귀

1. 평면좌표 단일 선택 → 기존과 동일한 출처 화면
2. quick 12문항 생성
3. advanced 조합 생성
4. 학교·연도 지정 생성
5. header 수정 후 preview 즉시 반영
6. 문항 교체 → 후보/undo 정상
7. 일반 출력 정상
8. 학생 출제 handoff 정상

## B. 다중 단원 균등

범위:

- 평면좌표
- 직선의 방정식
- 원의 방정식
- 도형의 이동
- 집합

조건:

```text
난이도 중
단원당 10
총 50
```

검증:

```text
각 단원 selectedCount == 10
총 selectedCount == 50
questionUid unique count == 50
```

## C. 학생 1명 과거 출제 제외

fixture:

```text
student = 길정현
history UID set = H
현재 범위/난이도와 겹치는 H 문항 존재
```

새 문제지 UID set = N.

검증:

```text
N ∩ H = ∅
studentHistoryConflictCount == 0
excludedByStudentHistory > 0
```

브라우저 reload/다른 세션에서도 서버 history를 재조회해 같은 결과를 얻어야 한다.

## D. 서로 다른 시리즈에서도 학생 이력 유지

시리즈 X에서 학생에게 출제한 UID set = A.

새 시리즈 Y 생성.

검증:

```text
Y ∩ A = ∅
```

같은 series가 아니어도 학생 history 때문에 제외되어야 한다.

## E. 다수 학생 공통 문제지

학생 A/B/C history union = U.

공통 문제지 P.

```text
P ∩ U = ∅
```

개별 학생 history 각각과도 교집합 0.

## F. 대상 학생 변경 Gate

처음 길정현으로 생성 후 학생 B를 추가.

학생 B history와 현재 paper가 3문항 충돌하도록 fixture.

검증:

- 출제 버튼 차단
- 충돌 3문항 표시
- 자동 교체 또는 구성 복귀 요구
- 명시적 재사용 허용 전에는 assignment 불가

## G. Assignment Question / Effective History 정확성

학생 5명 반에서 2명을 제외하고 3명에게 최종 출제.

검증:

- assignment ID 1개로 안정적으로 식별
- `class_exam_assignment_questions` row count = 최종 문항 수
- questionUid unique count = 최종 문항 수
- effective recipients = 3명
- 제외 2명의 history query에는 신규 UID 0
- 포함 3명의 history query에는 최종 UID 포함
- 동일 create/retry 시 assignment-question duplicate 증가 없음
- 반환 assignment.id를 후속 exclusion에서 사용할 수 있음
- legacy composite fallback도 회귀 없음

---

## H. 2차 테스트 무중복

1차 UID set = A
2차 UID set = B

검증:

```text
|A| = 50
|B| = 50
A ∩ B = ∅
```

학생 history mode가 켜져 있으면:

```text
B ∩ studentHistoryBeforeRound2 = ∅
```

## I. 3차 테스트 무중복

3차 UID set = C

```text
C ∩ (A ∪ B) = ∅
```

학생 history와도 교집합 0.

## J. 문항 교체 후 무중복

2차에서 특정 문항 교체.

검증:

```text
교체 후보 ∉ 현재 회차 다른 UID
교체 후보 ∉ 이전 series UID
교체 후보 ∉ 선택 학생 history UID
교체 후 총 50
교체 후 각 단원 quota 유지
```

## K. Undo

교체 → undo.

복원 UID가 다른 곳에서 사용 중이지 않고 student/series 금지 UID가 아닐 때 정상 복원.

금지 UID와 충돌하면 차단.

## L. 부족 문항 — 학생 history 원인

한 단원의 중 난이도에서:

```text
전체 20
student history 제외 12
series 제외 1
신규 가능 7
요청 10
```

검증:

- 자동 재사용 없음
- exclusion 원인별 count 정확
- 기본 generate 차단
- history policy 자동 완화 금지
- 사용자가 명시적으로 완화해야 진행

## M. 학교·연도 + 학생 history + 교체

- 선택 학교/연도 범위를 벗어난 후보가 나오지 않음
- student history UID가 후보에 나오지 않음
- multi-unit에서도 동일

## N. 출력 / Assignment Handoff

최종 `paper.records`, `mixedMeta.questionUids`, assignment에 전달된 `questionUids`가 동일.

Preview에서 본 문항과 실제 mixed output/학생 출제 문항이 동일.

## O. 난이도 metadata 변경 내성

과거 출제 당시 `중`, 현재 metadata가 `상`으로 바뀐 같은 questionUid를 fixture로 둔다.

검증:

- student history exclusion은 difficulty label이 아니라 UID 기준이므로 계속 제외

---

## P. Legacy History Coverage

2026-08-19 이전 assignment와 이후 assignment를 섞은 fixture.

검증:

```text
VERIFIED count
LEGACY_INFERRED count
UNRESOLVED count
```

가 실제 근거와 일치.

- legacy gap을 숨기고 “전체 history 완전 보장” 표시 금지
- UID를 복원할 근거가 없는 assignment를 임의 question_no 기반으로 매핑 금지
- history API/Studio Inspector에 coverage 상태 표시

# 21. UX Acceptance Gate

디자인은 ‘예쁜지’만으로 PASS하지 않는다.

다음이 모두 충족되어야 한다.

- 첫 화면에서 5단원 범위를 10초 안에 선택 가능
- `중 / 단원당 10` 설정이 3~4 interaction 이내
- 현재 총 문항 수가 항상 보임
- shortage가 생성 전에 보임
- Step 4에서 preview와 수정 도구가 동시에 보임
- 문항 클릭 후 교체 후보까지 1개 화면 안에서 접근 가능
- header edit 때문에 preview context를 잃지 않음
- 1차→2차 생성 시 조건 재입력 불필요
- 이전 회차 중복 0이 화면에서 확인 가능
- 학생 1명을 3 interaction 이내에 중복 방지 대상으로 선택 가능
- 학생 선택 즉시 `과거 사용 / 현재 범위 충돌 / 신규 가능` 수치가 보임
- 대상 학생 변경으로 충돌이 생기면 출제 직전에 조용히 통과하지 않고 명확히 차단
- 학생 history exclusion이 ON/OFF인지 항상 눈에 보임
- 모바일에서도 주요 CTA가 화면 하단에서 접근 가능

---

# 22. Performance Gate

이번 UI 개편으로 다음 회귀를 허용하지 않는다.

- 단원 catalog 초기 렌더 체감 지연 증가
- 단원 선택 때 전체 question file 즉시 load
- Step 3 진입 때 불필요한 원문 문제 JS 전부 load
- replacement panel open만으로 모든 후보 원문 load
- 학생 history 조회를 후보 문항별/학생별 N+1 API 호출로 구현
- 구성 화면 재렌더 때마다 동일 history를 반복 fetch

가능한 한 `question-index + metadata`로 availability/selection을 처리하고, 실제 원문은 preview/output 준비 시 필요한 파일만 lazy load한다.

학생 history는 `studentIds + policy + course/scope` 기준 batch query 한 번으로 UID set을 받아 메모리 cache한다. target/policy가 바뀌거나 assignment 성공 후에만 invalidate한다.

---

# 23. 접근성 / 안정성

- 모든 mode/tab은 button/radio semantics 유지
- keyboard focus visible
- inspector tab aria-selected
- multi-select unit card에 aria-pressed 또는 checkbox semantics
- status/error aria-live 유지
- iframe preview selection은 기존 event binding 회귀 금지
- 브라우저 back/forward URL restore 검증
- 학생 selector keyboard navigation / checkbox semantics
- history API 실패 시 `이력 제외 0`으로 조용히 폴백 금지; 명시적 오류/재시도 표시

---

# 24. 이번 범위에서 하지 않는 것

다음은 이번 작업에 섞지 않는다.

- 의미 기반 유사문항 중복 제거
- AI 자동 문항 추천
- 다른 과목을 섞은 cross-course test
- 출력 렌더 엔진 신규 작성
- mixed_engine 디자인 전면 개편
- 문제 데이터/난이도 metadata 대규모 수정
- 학생 화면 개편
- 학생별 서로 다른 문제지를 한 번에 자동 생성하는 완전 개인화 배치
- 학생 정오답/성적을 이용한 AI 난이도 추천

단, **교사용 Studio에서 학생을 중복 방지 대상으로 선택하고 학생별 출제 UID history를 조회·기록하는 기능은 이번 범위에 포함한다.**

이번 작업의 목표는 **교사용 단원별 기출 제작 경험**이다.

---

# 25. 최종 사용자 흐름

## 예시 1 — 길정현 학생 중간고사 1차 테스트

```text
단원별 기출
→ 여러 단원
→ 평면좌표~집합 5개 선택
→ 전체 아카이브
→ 출제 대상: 길정현
→ 이전 출제 문항 제외: 전체 이력
→ 단원별 균등
→ 난이도 중
→ 단원당 10
→ 길정현 과거 출제 UID 자동 제외
→ 신규 50문항 생성
→ Preview 확인
→ 마음에 안 드는 2문항 클릭 교체
   (교체 후보에서도 길정현 과거 UID 제외)
→ 헤더 '중간대비 1차'
→ 학생에게 출제
→ assignment에 최종 50 UID를 `class_exam_assignment_questions`로 동결
→ 길정현은 effective recipient이므로 다음 history query에 자동 포함
```

## 예시 2 — 며칠 뒤 새 시리즈 재출제

```text
새 시리즈 생성
→ 대상: 길정현
→ 범위/난이도 동일
→ 서버에서 `recipients - exclusions JOIN assignment_questions`로 길정현 누적 history 조회
→ 지난번 50문항도 자동 제외
→ 새로운 중 난이도 문항만 생성
```

즉 같은 `seriesId`가 아니어도 학생 기준으로 재출제되지 않는다.

## 예시 3 — 같은 조건 2차 테스트

```text
[같은 조건으로 2차 테스트 만들기]
→ 1차 series UID 자동 제외
→ 길정현의 다른 과거 시리즈 UID도 자동 제외
→ 각 단원 신규 중 10개씩
→ 50문항 생성
→ series 중복 0
→ 학생 history 중복 0
→ 필요한 문항만 교체
→ 출력/출제
```

## 예시 4 — 여러 학생 공통 테스트

```text
대상: 길정현 + 학생 B + 학생 C
→ 세 학생 history UNION 계산
→ 한 명이라도 본 문항은 제외
→ 세 학생 모두에게 미출제인 공통 50문항 생성
```

## 예시 5 — 부족 발생

```text
원의 방정식 · 중
전체 후보 27
학생 history 제외 15
series 제외 5
신규 가능 7 / 요청 10

생성 차단
→ 인접 난이도 허용
또는
→ 문항 수 낮추기
또는
→ history 범위를 전체 → 최근 90일로 명시적 완화
```

---

# 26. Definition of Done

아래가 전부 PASS일 때만 완료다.

### 기능

- single mode 기존 기능 parity
- multi unit selection 정상
- equal/custom/pool/all 구성 정상
- 50문항 단원별 quota 정확
- 1/2/3차 cross-round duplicate 0
- 학생 1명 전체 이력 exclusion 정상
- 여러 학생 history UNION exclusion 정상
- 새 series에서도 동일 학생 과거 UID exclusion 정상
- final assignment의 `class_exam_assignment_questions` parity 정상
- effective recipients만 student history query에 포함
- 제외 학생 history 신규 UID 0
- legacy coverage 상태 정확
- target 변경 시 conflict gate 정상
- replacement가 current unit quota를 깨지 않음
- previous round UID가 replacement 후보에 나오지 않음
- header edit 정상
- print/assign 정상

### UI

- Studio shell 적용
- 긴 폼 구조 축소
- Preview + Inspector 적용
- 구성/문항/헤더 tab 분리
- sticky selection/action bar 정상
- desktop/mobile responsive 정상
- 학생 중복방지 대상/이력 제외 상태/충돌 수가 Studio 안에서 명확히 보임

### 검증

- 정적 syntax/check PASS
- 실제 브라우저 interaction PASS
- 실제 UID set 비교 PASS
- student history batch query PASS
- assignment question bridge persistence/idempotency PASS
- effective recipient history parity PASS
- legacy coverage diagnostics PASS
- 다른 세션 재조회에서도 학생 history 유지 PASS
- 실제 mixed output handoff PASS
- 기존 single-unit baseline 비교 PASS

---

# 27. 최종 구현 원칙 한 줄

> **현재 단원별 기출의 기능적 강점과 기존 APMS assignment·recipient·OMR 구조를 동결하고, UI를 시험지 제작 Studio로 재설계한다. qid_v1 안정성을 먼저 감사한 뒤 `class_exam_assignment_questions`만 추가하여 다중 단원·반복 테스트·학생별 누적 출제이력 제외·문항 교체를 같은 canonical UID 체계로 연결한다. 학생 history는 `recipients - exclusions JOIN assignment_questions`가 Authority이며, mixed payload/PDF는 기존 snapshot으로 승격한다. 출력 렌더 엔진은 새로 만들지 않는다.**
