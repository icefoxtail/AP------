# JS아카이브 2.0 통합 마스터플랜 v1.2
## Virtual Taxonomy · Finder · 출제 Studio · 학생 이력 · Shared Core

> 문서 역할: JS아카이브 2.0의 **제품 방향, 출시 범위, Phase 의존성, 우선순위**를 고정하는 상위 정본.
>
> 이 문서는 세부 필드/API 계약을 반복해서 담지 않는다. 구현 시 반드시 아래 하위 정본을 함께 따른다.
>
> - `CONTRACTS.md`
> - `TAXONOMY.md`
> - `STUDIO_PLAN.md`
>
> 대상 저장소: `icefoxtail/AP------`
>
> 최종 목적:
>
> **파일을 보여주는 아카이브를, 기출을 찾고 → 구성하고 → 검증하고 → 학생에게 출제하고 → 다음 출제를 더 잘 만드는 교사용 작업공간으로 전환한다.**

## Metadata Foundation v2 Authority boundary

이 마스터플랜은 제품 목표와 Phase 의존성을 정하며, 문항 데이터 의미를
재정의하지 않는다. 질문 primary taxonomy의 canonical path는
`docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/`, 난이도는
`docs/rules/01_CANONICAL/JS아카이브_difficultyBucket_5단계_운영규칙_v1.3.md`,
metadata 저장·runtime parity는
`docs/rules/01_CANONICAL/JS아카이브_Metadata_Contract_v2.md`가 HARD Authority다.

Archive 2.0의 `TAXONOMY.md`는 source/grade/course family/unit crosswalk와
Finder browse semantics를 다룬다. 기존 `standardUnitKey`나 `subUnitKey`를
L1/L2로 동일시하지 않으며, legacy bridge/evidence로만 소비한다. `level`은
historical compatibility이고, Studio가 소비하는 difficulty는 canonical
`difficultyBucket` 1~5 및 그 4-field contract다. `UNKNOWN`은 정상적인
coverage 부족 상태이고 `reviewStatus=HOLD`와 구분한다.

이 경계는 제품 IA, Finder/Studio 분리, navigation, interaction, design
system, workflow와 module boundary를 제한하지 않는다.

---

# 0. v1.2에서 바뀐 핵심

v1.2는 **실제 Archive 프론트 + AP Math OS Worker backup 코드 감사 결과**를 반영해, v1.1에서 새 시스템으로 과설계했던 Assignment / Student History / Snapshot 영역을 현재 구조에 맞게 축소한다.

실제 확인된 현재 구조:

```text
Archive / Unit Past
    ↓
class_exam_assignments
    ├─ stable assignment.id(UUID)
    ├─ archive_file
    ├─ mixed_payload_json (MIXED 시험)
    ├─ assignment_batch_id
    └─ PDF artifact / hash / R2 object
    ↓
class_exam_assignment_recipients
    - 출제 시점 roster snapshot
    ↓
class_exam_assignment_exclusions
    - 실제 제외 학생
    ↓
Student Portal / OMR
    ↓
exam_sessions
    ↓
wrong_answers
```

Worker source는 저장소 내부 `apmath/worker-backup/worker`에서 확인되며, `wrangler.jsonc`의 Worker 이름은 실제 호출 대상인 `ap-math-os-v2612`와 일치한다. 단, backup HEAD가 현재 Cloudflare 배포 revision과 정확히 동일한지는 별도 배포 parity 확인이 필요하다.

v1.2에서 상위 원칙으로 확정하는 변경:

1. **새 Assignment subsystem을 만들지 않는다.** 현재 `class_exam_assignments.id`를 canonical assignment identity로 재사용한다.
2. **새 Recipient/Exposure subsystem을 만들지 않는다.** 현재 `class_exam_assignment_recipients - exclusions`가 effective recipient Authority다.
3. 학생별 미출제 기능의 핵심 신규 데이터는 학생×문항 ledger가 아니라 **`assignment ↔ canonical questionUid` 정규화 bridge**다.
4. 신규 핵심 테이블 후보는 `class_exam_assignment_questions`이며, 학생 history는 recipients/exclusions와 JOIN해 계산한다.
5. 현재 `mixed_payload_json`과 assignment PDF artifact를 **기존 Snapshot Contract로 승격**한다. 별도 거대한 Snapshot subsystem은 만들지 않는다.
6. 현재 Worker의 `qid_v1` 생성식은 `normalizedSourceFile + "#" + sourceOrdinal` 기반 SHA-256으로 확인되었다. 따라서 **UID 안정성 감사가 실제 P0**다.
7. `class_exam_assignment_recipients`는 2026-08-19 migration 이전 assignment를 당시 roster로 backfill했으므로 legacy recipient history에는 `LEGACY_INFERRED` 구간이 존재할 수 있다.
8. `exam_blueprints.source_question_uid/source_question_ordinal`은 이미 존재한다. 이를 새로 발명하지 않고 assignment-question bridge의 source로 사용한다.
9. 서버 권한은 이미 `teacher_classes` 기반 `canAccessClass / canAccessStudent`로 재검증한다. Archive 2.0 때문에 별도 RBAC를 만들지 않는다.
10. Unit Past의 기존 `HIGH1_DIRECT_KEY_MAP / HIGH2_DIRECT_KEY_MAP`과 profile `sourcePrefix`는 실제 운영 중인 taxonomy 자산이다. Crosswalk/학년 정책은 이를 폐기하지 않고 audit·정식화한다.

따라서 Release 1의 backend 핵심은 다음 세 가지로 축소된다.

```text
P0-A  qid_v1 안정성 감사
P0-B  class_exam_assignment_questions bridge
P0-C  legacy recipient / UID coverage 판정
```

그 위에 Finder/Studio/UI를 올린다.

---

# 1. 제품 재정의

JS아카이브 2.0의 최상위 작업공간:

```text
JS ARCHIVE 2.0

1. 기출 찾기
2. 출제 Studio
3. 학생 맞춤
4. 최근 작업
5. 관리 / Data Health
```

기존 구조:

```text
Archive
├─ 시험지 목록
├─ 단원별 기출
└─ Mixer
```

목표 구조:

```text
Archive 2.0
├─ Finder
│   └─ 무엇이 있는지 찾는다
│
├─ Studio
│   └─ 무엇을 출제할지 구성·수정·검증한다
│
├─ Student
│   └─ 누구에게 출제할지, 이미 무엇을 냈는지 연결한다
│
├─ Recent
│   └─ Draft / 최근 생성 / 최근 출제를 이어간다
│
└─ Admin
    └─ Taxonomy / UID / Metadata Health를 본다
```

---

# 2. Release Scope

## 2.1 Release 1 — 반드시 출시

Release 1은 “Archive 2.0이 실제로 새 제품처럼 느껴지는 최소 완성 범위”다.

### 포함

- Taxonomy v1.1
- P0 Grade Authority
- 기존 Unit Past `sourcePrefix` 학년 scope 보존
- 기존 `HIGH1/HIGH2_DIRECT_KEY_MAP` audit 및 Crosswalk 정식화
- courseFamily / curriculum / mixed-course handling
- Finder v1
- Archive 전체 Design System 최소 코어
- Global AppBar / Navigation
- Studio 진입 구조
- Unit Past Studio v1.2 구현
- Shared Selector contract
- **qid_v1 identity stability audit**
- **`class_exam_assignment_questions` assignment-question bridge**
- 학생 question history batch query
- legacy recipient/UID history coverage 상태
- Pin / Rebuild
- Review Gate
- Draft autosave / recovery / JSON export-import
- Finder URL serialization
- Feature flags / legacy fallback
- Data Health 핵심 항목
- 기존 `mixed_payload_json`/PDF snapshot contract 정식화

### 기존 시스템을 그대로 재사용하는 것

Release 1에서 새로 만들지 않는다.

```text
Assignment identity
Recipient snapshot
Student exclusion table
Teacher/Class/Student authority
Student Portal assignment visibility
OMR session
wrong_answers
Wrong Clinic
PDF storage pipeline
```

### 제외

- 새로운 학생 체계
- 학생×문항 exposure ledger 전면 신설
- 별도 Paper Snapshot subsystem
- 별도 STARTED exam lifecycle
- Matrix
- 학교 Timeline
- A/B형
- School Fingerprint 운영 노출
- 학생 정오답 기반 자동 보강
- Mastery
- 의미 기반 유사중복 자동 판정
- Command Palette
- 완전 개인화 반 전체 문제지

## 2.2 Release 2 — 핵심 생산성 확장

- Matrix
- Saved View / Scope Preset
- Recipe
- A/B Parallel Form
- Advanced Mixer 기능 추가 흡수
- source diversity UI
- problemType / essay quota
- 학생 history UX 고도화
- 간단한 학교 Timeline
- 필요 시 assignment target atomicity 강화
- `assessment_result_items`에 canonical UID 직접 보존 검토

## 2.3 Vision — 장기 방향

- 학생 오답/취약 유형 기반 보강
- `wrong_answers.order_no → assignment_questions.order_no → questionUid` 기반 canonical 오답 분석
- Exposure / Correctness / Mastery
- School Fingerprint operationalization
- 학교 기출 분포 기반 구성
- 검수된 `questionFamilyId`
- 유사문항 / ALIVE bridge
- 완전 개인화 출제

---

# 3. P0 — Grade Authority

Archive 2.0에서 학년 귀속은 가장 먼저 닫아야 하는 Taxonomy 계약이다.

## 3.1 문제

고2 시험에서 고1 과정인 `직선의 방정식`이 일부 사용되었다고 해서
그 시험이 고1 기출로 내려가면 안 된다.

잘못되면:

- 고2 시험이 고1 Finder에 노출
- 고1 자동출제 pool에 고2 시험 문항 유입
- 고1 통계 오염
- 학생 학년보다 높은 source 문항을 조용히 출제

가 발생할 수 있다.

## 3.2 제품 원칙

```text
sourceGrade
= 실제 시험의 출처 학년

unitGrade
= 각 표준 단원이 속한 과정 학년

unitGradeSet
= 시험/문항이 포함하는 단원 학년 집합

effectiveBrowseGrade
= 최종 Archive 분류 학년
```

HARD invariant:

> **하위 학년 단원이 포함되었다는 이유로 시험의 학년은 절대 내려가지 않는다.**

정상 예:

```text
sourceGrade = 고2
unitGradeSet = {고1, 고2}

effectiveBrowseGrade = 고2
```

이 시험은:

- 고2 Finder: 허용
- 고2 Studio: 허용
- 고1 Finder 시험 목록: 금지
- 고1 기본 자동출제 pool: 금지

## 3.3 역방향 충돌

```text
sourceGrade = 고1
detected max unit grade = 고2
```

이면 조용히 고1로 믿지 않는다.

```text
taxonomyStatus = CONFLICT
conflictCode = GRADE_CONFLICT
effectiveBrowseGrade = 고2
```

로 분류하고 Data Health 검수 대상으로 올린다.

정확한 grade/browse/crosswalk 계산은 `TAXONOMY.md`가 담당하고, 문항
L1~L4의 세부 의미는 RPM Primary Taxonomy v1.0 canonical pack을 따른다.

---

# 4. Archive 2.0 제품 IA

## 4.1 Home

Home은 홍보 페이지가 아니라 작업 시작점이다.

```text
JS ARCHIVE

[기출 찾기]
학교 · 연도 · 교육과정 · 과목 · 범위

[출제 Studio]
단원 · 난이도 · 문항수로 문제지 만들기

[학생 맞춤]
이 학생에게 이미 낸 문제 제외

[최근 작업]
Draft / 최근 생성 / 최근 출제
```

큰 hero와 불필요한 gradient를 줄인다.

## 4.2 Finder 책임

Finder는:

- 시험지를 찾는다
- 학교/연도/과목/교육과정/범위를 탐색한다
- 원본 시험을 미리 본다
- 여러 source exam을 선택한다
- Studio로 source set을 넘긴다

Finder는 최종 문제지 편집기가 아니다.

## 4.3 Studio 책임

Studio는:

- 문제 범위 구성
- quota
- 난이도
- 문제 유형
- 자동선택
- Pin/Rebuild
- 문항 교체
- 반복 Series
- 학생 history exclusion
- 검증
- 출력/출제

를 담당한다.

## 4.4 Student 책임

Student는:

- 대상 학생 선택
- 출제 이력
- 결과
- 향후 보강 조건

을 담당한다.

Release 1에서 Student의 핵심은 기존 Assignment를 이용한 `Question History Bridge`다.

---

# 5. Virtual Taxonomy

Taxonomy는 물리 경로를 교체하지 않는다.

```text
Physical storage
archive/exams/original/high/h2/1mid/...
             ↓
그대로 유지

Virtual Taxonomy
grade
curriculum
courseFamily
actualCourse
examAxis
school
year
unit range
             ↓
Finder / Studio
```

주요 제품 browse 필드와 Authority는 `TAXONOMY.md`를 따른다. 문항
`curriculumKey + courseKey + L1 + L2 + L3 + L4`는 RPM Primary Taxonomy
v1.0에서 읽고, 난이도와 metadata field 의미는 각 canonical contract를
그대로 소비한다.

---

# 6. Course Family

운영상 과거/현행 교육과정을 함께 찾기 위한 상위 grouping.

예:

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

중요:

> `courseFamily`가 같다는 이유만으로 자동출제에서 문항을 섞지 않는다.

Cross-curriculum 자동 혼합은 Crosswalk 계약을 통과해야 한다.

---

# 7. Unit Crosswalk

2015와 2022의 단원을 같이 찾거나 출제하기 위해 별도 mapping을 둔다.

```text
crosswalkType =
EXACT
PARTIAL
RELATED
INCOMPATIBLE
```

```text
reviewStatus =
REVIEWED
UNREVIEWED
```

Release 1 자동 혼합 기본:

```text
EXACT + REVIEWED
```

만 허용.

`PARTIAL / RELATED`는 Finder에서 관련 자료로 보여줄 수 있지만
Studio 자동출제에는 사용자 승인 없이는 섞지 않는다.

---

# 8. Finder v1

고2 예:

```text
고2 기출 찾기

과목 계열
[전체] [대수 계열] [미적분 계열] [확률과통계] [기하]

교육과정
[전체] [2015] [2022]

시험 시기
[전체] [1중간] [1기말] [2중간] [2기말]

연도
[전체] [2026] [2025] [2024] ...

학교
[전체 학교 ▾]
```

선택 filter는 chip으로 유지.

```text
고2 ×
대수계열 ×
2022 ×
1기말 ×
2024~2026 ×
```

결과 카드:

```text
2026 · 순천고                  1학기 기말

대수 · 2022
삼각함수 → 수학적 귀납법
24문항

[미리보기] [원본 열기] [Studio에서 사용]
```

Mixed exam은 각 실제 range를 모두 표시한다.

---

# 9. Finder URL State

Release 1에 포함.

예:

```text
?grade=h2
&family=ALGEBRA
&curriculum=2022
&axis=1-final
&yearFrom=2024
&yearTo=2026
```

목적:

- 새로고침 복원
- 뒤로가기
- 동일 조건 재현
- 링크 공유
- 버그 재현

거대한 Studio Blueprint를 URL에 넣지 않는다.

Studio의 복잡한 상태는 `draftId` 또는 Draft payload로 분리한다.

---

# 10. Search Normalization

Release 1의 검색 정규화 최소 범위:

- `순천고` ↔ `순천고등학교`
- 공백 정규화
- `1기말` / `1학기 기말` / `1학기말`
- 과목 별칭
- 연도 숫자
- 학교 canonical key

초성검색/고급 fuzzy는 Release 1 blocker가 아니다.

0건이면 단순 “없음”보다 필터 충돌을 보여준다.

---

# 11. 출제 Studio

기존 Studio v1.1을 상세 정본으로 사용한다.

핵심 mode:

```text
빠른 구성
단원별 균등
직접 배분
고급 편집
```

Studio는 단일 단원뿐 아니라 다중 단원과 Series를 지원한다.

---

# 12. Mixer 흡수

Mixer는 즉시 폐기하지 않는다.

## Release 1

Shared Selector를 사용하도록 정렬.

## Release 1~2

다음 기능을 Studio로 가져온다.

- 전체 Archive scope
- school/year/examAxis/tag
- blueprint rows
- recent UID exclude
- source diversity
- template max
- essay quota
- pin/rebuild
- validation diagnostics

## Parity 후

Mixer는 legacy route로 내릴 수 있다.

---

# 13. Pin / Rebuild

Release 1 포함.

```text
50문항 생성
43문항 고정
7문항 재구성
```

HARD:

- pinned UID 유지
- 신규 후보는 pinned UID와 중복 금지
- 최종 quota 검증
- student/series exclusion 유지

---

# 14. Student Question History Bridge

Release 1의 학생별 “이미 낸 문제 제외”는 새 학생 exposure subsystem을 만드는 작업이 아니다.

현재 서버에 이미 존재하는 Authority:

```text
class_exam_assignments.id
        ↓
class_exam_assignment_recipients
        ↓
- class_exam_assignment_exclusions
        ↓
effective student recipients
```

여기에 한 단계만 정규화한다.

```text
class_exam_assignment_questions

assignment_id
order_no
question_uid
source_archive_file
source_question_no
source_question_ordinal
standard_unit_key
sub_unit_key          // optional
problem_type_key      // optional
difficulty_at_assignment
created_at
```

권장 UNIQUE:

```text
PRIMARY KEY (assignment_id, order_no)
UNIQUE (assignment_id, question_uid)
```

학생 history는 새 exposure row를 학생 수만큼 복제해 쓰는 대신 다음 JOIN으로 계산한다.

```text
studentId
  → recipients
  - exclusions
  → assignment_id
  → class_exam_assignment_questions
  → question_uid[]
```

학생 exposure의 최종 Authority는 항상 `question_uid`다. 서버 history query는
selected student IDs의 effective exposure UID set과 현재 candidate
questionUid set의 intersection을 계산해야 한다. `unit_keys`나 이후 변경될
difficulty/problem type metadata는 선택·성능·진단 hint일 수는 있지만 history
correctness를 자르는 HARD filter가 아니다. metadata/unit 재분류가 일어나도
동일 questionUid exposure는 유지하고, legacy coverage 상태를 함께 반환한다.

여러 학생 공통 시험에서는 각 학생 history의 UNION을 selector exclusion으로 사용한다.

이 구조의 장점:

- 20명 × 50문항 = 1,000 exposure row를 새로 쓰지 않아도 됨
- 현재 recipient snapshot/exclusion 의미와 1:1로 맞음
- assignment 삭제/제외 변경이 history에 자연스럽게 반영됨
- `wrong_answers.question_id(order_no)`를 canonical UID로 연결할 수 있음
- 기존 APMS Student/OMR/Wrong Clinic 체계를 그대로 살림

Release 1 history 기본 범위는 성능 때문에 임의 축소하지 않는다.
`전체 / 최근90일 / 최근30일`은 교육적 재사용 정책이다.

legacy 구간은 정확도를 숨기지 않는다.

```text
VERIFIED
LEGACY_INFERRED
UNRESOLVED
```

특히 2026-08-19 이전 recipient history는 migration 당시 roster 기반 backfill일 수 있으므로 별도 coverage 지표를 가진다.

---

# 15. Effective Exclusion

모든 exclusion은 Shared Core에서 합성한다.

개념:

```text
currentPaper
seriesHistory
studentHistory
A/B sibling form
manual exclusions
quality exclusions
```

UI마다 따로 구현하지 않는다.

---

# 16. Shortage 정책

Release 1의 기본 우선순위:

```text
1. 문항 수 낮추기
2. 인접 난이도 허용
3. 허용된 범위 내 quota 재배분
4. student history window 완화
5. 마지막 수단으로 과거 문항 재사용
```

항상 사용자 승인 필요.

절대 완화 금지:

- 동일 UID 중복
- 허용하지 않은 고학년 source 유입
- curriculum HARD mismatch
- 비공개/제외 문항
- 명시한 범위 밖 문항

---

# 17. Review Gate

Review Gate는 통계를 보여주는 장식 화면이 아니다.

## HARD BLOCK

예:

- questionUid 중복 > 0
- sourceGrade/effectiveGrade 규칙 위반
- 허용하지 않은 curriculum mix
- Series HARD 중복
- student-history HARD 중복
- quota hard constraint 위반
- identity invalid
- output handoff record 불일치

HARD가 하나라도 있으면:

```text
출력 / 학생 출제 차단
```

## WARN

예:

- 특정 학교 출처 편중
- UNKNOWN metadata 포함
- PARTIAL Crosswalk 포함
- difficulty 미분류
- 적은 source diversity

WARN은 사용자 확인 후 진행 가능.

---

# 18. Question Identity — 실제 P0

현재 Worker의 canonical UID 생성 규칙은 확인되었다.

```text
questionUid =
  "qid_v1_" +
  SHA256(
    normalizeSourceFile(sourceArchiveFile)
    + "#"
    + sourceOrdinal
  )
```

현재 `exam_blueprints`에도 다음 필드가 존재한다.

```text
source_question_uid
source_question_ordinal
```

따라서 새 identity system을 상상해서 덮어쓰지 않는다.
먼저 `qid_v1`의 실제 안정성을 감사한다.

필수 감사:

```text
source file rename
source path 이동
앞 문항 삽입/삭제로 ordinal 이동
같은 위치에서 문항 자체 교체
오탈자/표현 수정
보기 수정
이미지/SVG 수정
metadata 수정
```

현재 구조상 예상 위험:

- file rename/path 변경 → UID 변경 가능
- ordinal 이동 → 뒤 문항 UID 연쇄 변경 가능
- 동일 위치에서 문항 자체를 다른 문제로 교체 → UID가 유지될 가능성

따라서 학생별 누적 history를 production HARD exclusion에 사용하기 전에:

```text
qid_v1 stability report
UID churn count
same-position replacement risk
legacy UID coverage
```

를 반드시 산출한다.

필요성이 입증되면 그때 `qid_v2` 또는 explicit migration map을 설계한다.
Release 1 계획서만 보고 선제적으로 전면 재발급하지 않는다.

---

# 19. Draft / Recovery

Release 1에 포함.

최소:

- autosave
- schemaVersion
- updatedAt
- abnormal-exit restore prompt
- JSON export
- JSON import

서버 Draft는 Release 2 후보.

중요 문제지는 브라우저 cache 하나에만 의존시키지 않는다.

---

# 20. Output Architecture

Archive 2.0 때문에 새로운 렌더 엔진을 만들지 않는다.

```text
Finder / Studio / Student
        ↓
얇은 Adapter
        ↓
Shared Output / Render / Print Authority
```

`mixed_engine.html`을 Studio와 별개의 편집 Authority로 만들지 않는다.

출력 화면에서 필요한 편집 옵션은
가능하면 Studio state/header/layout options로 승격한다.

---

# 21. Assignment Snapshot Contract — 기존 구조 승격

Archive 2.0 때문에 별도 대형 Snapshot subsystem을 만들지 않는다.

현재 이미 존재하는 snapshot 역할:

### MIXED / Unit Past

```text
class_exam_assignments.mixed_payload_json
  ├─ questions[]
  └─ meta
```

`archive/index.html`은 `mixedQuestions_<snapshotKey>`와 `mixedMeta_<snapshotKey>`를 읽어 이 payload를 assignment에 보낸다.

### Rendered artifact

`class_exam_assignments`에는 PDF 상태/콘텐츠 hash/object key/page count/generated_at 등이 이미 존재하며 Worker가 R2 PDF artifact를 관리한다.

따라서 Release 1에서 추가로 필요한 최소 정규화는:

```text
class_exam_assignment_questions
payload_schema_version       // additive 후보
question_uid_set_hash        // additive 후보
question_identity_version    // additive 후보
```

이다.

원칙:

1. `mixed_payload_json` = 실제 MIXED 시험 내용 snapshot.
2. `class_exam_assignment_questions` = 검색/중복제외/history용 normalized question identity snapshot.
3. PDF/R2 object = 학생에게 전달되는 rendered artifact.
4. assignment 이후 taxonomy/difficulty metadata가 바뀌어도 assignment-question row는 조용히 재해석하지 않는다.
5. 새로운 `paperId` 중심 별도 DB 계층은 실제 필요성이 생기기 전까지 만들지 않는다.

Studio의 `paper.records`, `mixedMeta.questionUids`, 서버의 assignment-question rows는 최종 assignment 시점에 parity를 검증한다.

---

# 22. UNKNOWN / CONFLICT

Finder:

- UNKNOWN도 검색 가능
- 명확한 badge
- 숨기지 않음

Studio strict generation:

- UNKNOWN 기본 제외
- 사용자가 `[미분류 포함]`을 켜야 포함 가능

CONFLICT:

- 기본 자동출제 제외
- Admin Data Health 대상

---

# 23. Metadata Provenance

Release 1에서 과도한 confidence 체계를 만들지 않는다.

최소:

```text
taxonomyStatus =
CONFIRMED
DERIVED
UNKNOWN
CONFLICT

taxonomySource =
SOURCE_METADATA
COURSE_CODE
UNIT_KEY
MANUAL_REVIEW
```

필요 시 후속 버전에서 세분화.

---

# 24. Data Health

관리 화면 최소 지표:

```text
시험지 수
문항 수

invalidQuestionUid
duplicateQuestionUid
gradeConflict
curriculumUnknown
curriculumConflict
courseFamilyUnknown
unitUnknown
difficultyUnknown
problemTypeUnknown
brokenSource
```

Data Health는 검색에서 자료를 숨기는 대신
문제 데이터를 고칠 수 있게 해야 한다.

---

# 25. Design System

Release 1에서 Design System을 거대한 선행 프로젝트로 만들지 않는다.

먼저:

```text
tokens
AppBar
Button
FilterChip
SegmentedControl
Card/DataRow
Inspector
StickyActionBar
Modal
Toast
Loading/Empty/Error
```

만 정본화.

Finder/Studio 구현 중 반복되는 UI를 공통 component로 승격한다.

---

# 26. Visual Direction

```text
Dense
Calm
Professional
Fast
Tool-like
```

- 큰 hero 최소화
- gradient 최소화
- 1px border 중심
- shadow 남발 금지
- navy/neutral 중심
- orange 작은 강조
- warning/error는 의미가 있을 때만
- typography/spacing으로 hierarchy 생성

---

# 27. Accessibility 최소 Gate

Release 1:

- keyboard focus 보임
- 색상만으로 상태 표현 금지
- modal/drawer focus 관리
- button disabled/loading 명확
- filter chip remove label
- 최소 touch target
- 200% 확대 시 주요 CTA 접근 가능

다크모드는 Release 1 blocker가 아니다.

---

# 28. Performance

성능 숫자는 계획서 작성자가 임의로 확정하지 않는다.

Phase 0에서 실제 현재값을 측정한 후 budget 고정.

측정 후보:

```text
Finder 초기 진입
filter 반영
Studio availability
50문항 selection
50문항 preview
MathJax typeset
문항 교체 panel open
output handoff
```

초기 최적화 순서:

1. db/index metadata 우선 사용
2. 원문 lazy load
3. visible preview 우선
4. MathJax batch/async queue
5. 이미지/SVG lazy load
6. 실제 jank가 남을 경우 virtual scrolling

---

# 29. Feature Flag / Rollback

Release 1 필수.

개념:

```text
taxonomyV1
finderV2
studioV2
studentHistoryExclusion
pinRebuild
```

출시 순서:

```text
1. 관리자
2. 내부 pilot
3. legacy 결과와 비교
4. 오류 확인
5. 기본 ON
6. legacy route 일정 기간 유지
```

taxonomyVersion 불일치/실패 시
legacy browse fallback을 허용한다.

---

# 30. Resource Scope

현재 사용자 체계 위에 거대한 RBAC를 새로 만들지 않는다.

Release 1에서 필요한 scope:

```text
personal
academy
```

적용 후보:

- preset
- draft
- quality flag

Student history는 기본적으로 academy/org scope를 사용한다.

권한은 기존 teacher/admin/student 체계를 재사용한다.

---

# 31. A/B Form — Release 2

단순히:

```text
A ∩ B = ∅
```

만 만족시키지 않는다.

Parallel Form:

```text
slot 1: same unit / difficulty / problem type
slot 2: same unit / difficulty / problem type
...
```

형식으로 최대한 균형을 맞춘다.

각 form은 독립 Review Gate를 통과.

Shortage Assistant와 연결.

---

# 32. Semantic Duplicate Family — Vision

서로 다른 학교에서 사실상 같은 문항이 존재할 수 있다.

향후:

```text
questionFamilyId
```

도입 가능.

그러나 Release 1에서는
자동 텍스트/이미지 fingerprint를 HARD exclusion authority로 사용하지 않는다.

오탐으로 좋은 후보를 잃는 위험이 크다.

먼저 reviewed family부터.

---

# 33. School Fingerprint — Vision

현재 후보 엔진은 운영 노출 전에 별도 Gate를 통과해야 한다.

사용자에게 보여줄 때는:

```text
분석 시험 수
분석 문항 수
metadata coverage
단원 분포
난이도 분포
유형 분포
```

를 같이 표시.

“다음 시험 예측”이라고 표현하지 않는다.

---

# 34. Matrix / Timeline — Release 2

Finder v1이 먼저다.

Matrix/Timeline은 다음이 확인된 뒤 구현:

- school/year/examAxis coverage 충분
- Finder search usability 검증
- 실제 비교 사용성이 있음
- mixed exam cell 표현 규칙 확정

---

# 35. Phase 0 — Baseline Audit

코드 수정 전에 현재 구조를 고정한다.

## 이미 확인된 Repository Authority

```text
Archive frontend
- archive/index.html
- archive/unit-past-exams.js
- archive/unit-past-exams-core.js
- archive/mixer-selector.js

AP Math OS Worker backup
- apmath/worker-backup/worker/routes/exams.js
- apmath/worker-backup/worker/routes/student-portal.js
- apmath/worker-backup/worker/helpers/foundation-db.js
- apmath/worker-backup/worker/schema.sql
- apmath/worker-backup/worker/migrations/*
- apmath/worker-backup/worker/wrangler.jsonc
```

## Phase 0에서 새로 확정할 것

1. Worker backup HEAD와 실제 Cloudflare 배포 revision parity
2. `qid_v1` 안정성/UID churn
3. 기존 assignment에서 canonical UID backfill 가능한 비율
4. 2026-08-19 이전 recipient history 정확도 범위
5. MIXED 과거 payload의 `questionUid/sourceOrdinal` coverage
6. normal archive assignment의 `exam_blueprints` coverage
7. 현재 directKeyMap/Crosswalk coverage
8. current Unit Past profile `sourcePrefix` 학년 contamination 0 여부

## Data inventory

- 시험지 수 / 문항 수
- grade/curriculum/courseRanges coverage
- mixed-course 수
- sourceGrade/content-grade conflict 수
- unit/difficulty/problemType/template coverage
- UID coverage
- UID churn risk count
- assignment-question backfill coverage
- recipient history VERIFIED/LEGACY_INFERRED/UNRESOLVED count

## Performance baseline

실제 browser 측정 후 Release 1 budget 작성.

산출:

```text
ARCHIVE_2_BASELINE.md
ARCHIVE_2_IDENTITY_AUDIT.md
ARCHIVE_2_HISTORY_COVERAGE.md
```

---

# 36. Phase 1 — Contracts + Taxonomy

코드보다 계약 먼저.

완료 조건:

- Canonical Field Dictionary
- Grade Authority
- curriculum
- courseFamily
- Crosswalk v1
- UNKNOWN/CONFLICT
- identity audit
- selector contract
- taxonomyVersion/indexVersion
- additive index fields
- taxonomy tests

---

# 37. Phase 1.5 — Assignment Question Bridge + History Contract

Studio student-history 기능보다 선행한다.

신규 최소 구현:

```text
class_exam_assignment_questions
```

확정 항목:

- `class_exam_assignments.id`를 canonical assignment ID로 사용
- `assignment_batch_id`는 multi-class 묶음 ID일 뿐 row identity가 아님
- effective recipient = recipient snapshot − exclusions
- normal archive assignment의 question rows 생성 방식
- MIXED assignment의 question rows 생성 방식
- create/update/retry 시 assignment-question upsert idempotency
- batch student history query
- 여러 학생 history UNION
- teacher/admin authorization은 기존 `canAccessClass/canAccessStudent(s)Batch` 재사용
- exclude 경로는 가능하면 반환된 `assignment.id`를 직접 사용하도록 보강
- legacy backfill coverage/status
- history query가 `LEGACY_INFERRED/UNRESOLVED`를 숨기지 않도록 diagnostics

권장 history Authority:

```text
recipients
- exclusions
JOIN assignment_questions
```

학생별 exposure row를 별도로 복제 저장하는 것은 Release 1 기본안이 아니다.

이 bridge가 없으면 학생 history exclusion을 production ON하지 않는다.

---

# 38. Phase 2 — Minimal Design Core

- tokens
- AppBar
- nav
- buttons
- filters/chips
- card/data row
- loading/error/empty

Finder를 만들며 필요한 component를 추가 추출.

---

# 39. Phase 3 — Archive Home + Finder v1

- new Home
- Finder multi-axis
- highest-grade behavior
- mixed course
- curriculum
- courseFamily
- Crosswalk display
- URL state
- Studio handoff
- feature flag

---

# 40. Phase 4 — Studio v1.2

기존 하위 정본을 구현.

- multi-unit
- distribution
- Inspector
- replacement
- series
- student question history exclusion
- strict shortage
- assignment-question parity
- legacy coverage diagnostics

---

# 41. Phase 5 — Pin/Rebuild + Review Gate

- pin
- rebuild
- shared validation
- HARD/WARN
- snapshot
- draft recovery

---

# 42. Release 1 Final Gate

필수 시나리오:

### A. Grade Authority

고2 시험에 고1 직선 단원이 있어도:

```text
고2 Finder = 표시
고1 Finder = 미표시
고1 default generation = 미포함
```

### B. Finder

고2 → 대수계열 → 2022 → 1기말 → 최근3년.

### C. Crosswalk

기존 directKeyMap을 감사해 정식 Crosswalk로 승격하며, 2015↔2022 자동 혼합은 REVIEWED EXACT만.

### D. Studio

5단원 × 중10 = 50.

### E. Student History

길정현의 effective assignment history UID set = H, 신규 set = N.

```text
N ∩ H = ∅
```

history는 `recipients - exclusions → assignment_questions`로 계산되어야 한다.

### F. Series

1차/2차 교집합 0.

### G. Pin/Rebuild

43 고정 + 7 재구성.

### H. Review

HARD 1건이면 출력 차단.

### I. Draft

탭 종료 후 복원, JSON export/import.

### J. Assignment Question Parity

```text
Studio final UID set
=
mixed payload/meta UID set
=
class_exam_assignment_questions UID set
```

### K. Legacy Coverage

2026-08-19 이전 recipient 및 과거 UID 미복원 구간을 `VERIFIED / LEGACY_INFERRED / UNRESOLVED`로 구분해 보고한다.

### L. Existing APMS Regression

- Student Portal 시험 목록 정상
- recipient/exclusion 정상
- 학생 OMR 정상
- teacher bulk OMR 정상
- wrong_answers 정상
- Wrong Clinic 정상

### M. Legacy UI

flag OFF에서 기존 route 정상.

---

# 43. Release 2 Roadmap

- Matrix
- Timeline
- Saved Views
- Recipe
- A/B Parallel Form
- Advanced Mixer absorption
- source diversity UI
- type/essay quota
- server draft 검토

---

# 44. Vision Roadmap

- 오답 기반 보강
- Mastery
- School Fingerprint
- reviewed questionFamily
- 유사문항
- ALIVE bridge

---

# 45. 문서 체계

상위:

```text
MASTERPLAN.md
```

항상 같이 읽을 계약:

```text
CONTRACTS.md
TAXONOMY.md
```

Studio 상세:

```text
STUDIO_PLAN.md
```

구현 시점에 생성:

```text
ARCHIVE_2_FINDER_SPEC_v1.x.md
ARCHIVE_2_TEST_PLAN_v1.x.md
```

---

# 46. 최종 한 문장

> **Archive 2.0 Release 1은 기존 APMS의 assignment·recipient·OMR·오답 체계를 갈아엎지 않고, qid_v1을 감사한 뒤 assignment↔questionUid bridge를 추가하여 학생별 미출제 문항 선택을 가능하게 하고, 그 위에 Finder·Studio·Shared Selector·기존 공통 출력 경로를 완성한다.**
