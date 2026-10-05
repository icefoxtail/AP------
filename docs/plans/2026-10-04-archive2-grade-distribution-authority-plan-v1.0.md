# Archive 2.0 Grade + Distribution Authority 마감 계획 v1.0

> 작성일: 2026-10-04  
> 상태: **REVIEW DRAFT — Astra / GPT-6 Pro second-pass review required**  
> 조사 기준 remote main: `9e31a748b07d6edac468fa2eb262c5da214f54fe`  
> 구현 상태: **코드 수정 0 / migration 0 / production mutation 0**  
> 목적: Grade + Distribution Authority를 current main 기준으로 재대조한 뒤, 실제 남은 delta만 핀포인트 구현하고 `GRADE_DISTRIBUTION_AUTHORITY = SEALED`까지 닫는다.

---

## 0. 문서의 역할

이 문서는 과거 Grade 계획을 그대로 실행하기 위한 문서가 아니다.

2026-10-04 current main을 직접 재대조한 결과를 기준으로:

1. 이미 구현된 것을 다시 만들지 않고,
2. 실제 남아 있는 P0/P1 delta를 분리하고,
3. 구현 전 Astra 또는 GPT-6 Pro가 최신 main을 다시 읽어 계획 전제를 검증하고,
4. 그 검토 결과를 `PLAN_DELTA`로 반영한 뒤,
5. v1.1 이상에서 `PLAN FREEZE` 후 구현을 시작

하기 위한 **2-pass 계획서**다.

### HARD

- 이 v1.0만 보고 바로 코드 구현을 시작하지 않는다.
- 구현 전 반드시 최신 `origin/main`을 다시 확인한다.
- Astra/GPT-6 Pro review는 계획 전체를 새로 쓰는 것이 아니라 **잘못된 전제·누락 소비처·더 작은 수정선**을 찾는 second pass다.
- review 결과는 `KEEP / MODIFY / REMOVE / ADD / DEFER / DO_NOT_TOUCH` 형태의 `PLAN_DELTA`로 남긴다.
- 형님의 최신 명시 지시가 이 문서보다 우선한다.

---

# 1. 상위 Authority와 현재 위치

Notion CURRENT 기준:

- `GPT 작업 전 필독 라우터`
- `Archive 2.0 / JS Archive 시작 페이지`
- `Archive 전체 작업 생명주기 — 단계별 필독 문서`
- `Archive 2.0 미실현 업데이트 백로그 v2 — CURRENT`

현재 제품 순서는:

```text
[완료] UX FRICTION SWEEP / shortest-path 계열
[완료] PAPER_LIFECYCLE_AUTHORITY = SEALED
        ↓
[NOW] Grade + Distribution current-main reconciliation
        ↓
실제 남은 delta만 구현
        ↓
GRADE_DISTRIBUTION_AUTHORITY = SEALED
        ↓
Common Paper / Product / Tooling
```

Paper Lifecycle은 재작업하지 않는다.

---

# 2. 조사 기준선

## 2.1 Git baseline

조사 종료 시 latest remote main:

```text
9e31a748b07d6edac468fa2eb262c5da214f54fe
publish(m2): reconcile o21 receipt after registration sync
```

Grade/Distribution 구현 시작 시 이 SHA를 고정 baseline으로 사용하지 않는다.

반드시 최신 `origin/main`을 다시 읽고 아래 owner 파일의 drift를 대조한다.

## 2.2 직접 확인한 핵심 owner

### Browser / Product

- `archive/archive2-core.js`
- `archive/archive2-workspace.js`
- `archive/archive2-entry.js`
- `archive/archive2-library.js`
- `archive/archive2-history.js`
- `archive/index.html`
- `archive/tools/build-archive2-catalog.mjs`
- `archive/data/archive2-canonical-projection-policy.json`

### Worker / Persistence

- `apmath/worker-backup/worker/routes/archive2.js`
- `apmath/worker-backup/worker/routes/archive-saved-papers.js`
- `apmath/worker-backup/worker/routes/exams.js`
- `apmath/worker-backup/worker/helpers/archive2-questions.js`
- `apmath/worker-backup/worker/helpers/archive-saved-papers.js`
- `apmath/worker-backup/worker/migrations/20260929_archive_saved_papers.sql`

### Tests / CI

- `tests/archive2-worker-validation.test.mjs`
- `tests/archive2-worker-runtime.mjs`
- `tests/archive-saved-papers-runtime.mjs`
- `tests/archive2-compose-scope.test.js`
- `tests/archive2-recent-friction-ui.test.cjs`
- `tests/archive-saved-papers-library.test.js`
- `tests/archive2-assignment-handoff.test.cjs`
- `tools/run-tests.js`
- `.github/workflows/ci.yml`

---

# 3. 최종 조사 판정

| 영역 | current-main 판정 | 처리 |
|---|---|---|
| Saved Paper cross-grade distribution | **미완료 / P0** | source grade → target eligibility 연결 제거 |
| sourceGrade provenance | **완료 기반** | 유지 |
| targetGrade / class grade | **완료 기반** | 유지 |
| browse-grade shared projection | **동작은 상당 부분 완료** | Authority 수렴 필요 |
| 명시적 `browseGrades[]` | **미완료** | canonical representation 도입 검토 |
| Saved Paper `grade` | **content/display context로 유효** | 삭제/rename migration 금지 |
| Recent target/content grade 분리 | **UI 구조 부분완료** | Worker projection 보강 필요 |
| direct MIXED / Original grade gate | **별도 정책** | 이번 P0에서 건드리지 않음 |
| Grade 관련 ESM 테스트 CI 포함 | **coverage gap** | blocking runner 편입 검토 |

현재 상태:

```text
GRADE_DISTRIBUTION_AUTHORITY = NOT_SEALED
```

---

# 4. 현재 코드에서 확인된 핵심 사실

## 4.1 Saved Paper P0 — 실제 결함

현재 Saved Paper distribution은 `archive2.js`에서:

```js
checkTargetGrades(
  classRow,
  await resolveSavedPaperSourceGrades(env, savedSnapshot.questions),
);
```

를 수행한다.

`checkTargetGrade()`는:

```text
sourceGrade rank > target class grade rank
→ HTTP 409
```

로 차단한다.

따라서 현재 main에서도 예를 들면:

- 고1 Saved Paper → 중3 반
- 고2 Saved Paper → 고1 반
- 중3 Saved Paper → 중2 선행반

같은 선행 배포가 막힐 수 있다.

이것은 문서 stale만이 아니라 **실제 제품 P0**다.

## 4.2 과거 `savedPaper.grade` gate는 이미 개선됐지만 새 계약에는 부족하다

2026-10-01의 보정에서 과거:

```text
savedPaper.grade → target grade gate
```

는:

```text
actual preserved sourceGrade → target grade gate
```

로 개선됐다.

이 수정은 browse grade가 source provenance를 덮어쓰지 않게 만든 올바른 개선이었다.

그러나 현재 제품 계약은 더 나아가:

```text
Saved Paper 생성 전:
sourceGrade = provenance
browse grade = discovery/exposure

Saved Paper 생성 후:
targetGrade = distribution destination

sourceGrade != distribution permission
browse grade != distribution permission
```

이어야 한다.

즉 현재 남은 P0는 **source provenance 검증과 distribution permission을 분리하는 것**이다.

## 4.3 `resolveSavedPaperSourceGrades()`는 삭제 대상이 아니다

최신 main의 `resolveSavedPaperSourceGrades()`는 단순 target gate helper가 아니다.

Saved Paper snapshot 안의:

- `questionUid`
- `sourceFile`
- `sourceOrdinal`
- `sourceGrade`
- `sourceIdentityEvidence`

를 검증하고 preserved source identity가 자기모순이 없는지 확인한다.

따라서 정상 수정은:

```text
Saved Paper snapshot 검증                 KEEP
source identity evidence 검증             KEEP
sourceGrade provenance 확인               KEEP
sourceGrade → targetGrade eligibility     REMOVE
teacher/class/student authorization        KEEP
active roster                              KEEP
snapshot hash / assignment identity        KEEP
retry / idempotency                        KEEP
```

다.

## 4.4 direct MIXED / Original은 별도 정책이다

현재 같은 Worker 안에서도 경로가 다르다.

| 경로 | current gate |
|---|---|
| Saved Paper → Assignment | saved snapshot sourceGrades → target class |
| direct MIXED Compose → Assignment | current canonical verified sourceGrades → target class |
| Original direct → Assignment | verified original sourceGrade → target class |

이번 P0에서는 **Saved Paper 경로만 분리**한다.

형님이 별도로 direct Compose / Original까지 자유 cross-grade 정책을 지시하지 않는 한:

- `checkTargetGrade()`
- `checkTargetGrades()`
- direct MIXED call site
- Original call site

를 전역 삭제하거나 완화하지 않는다.

---

# 5. Grade 3역할의 목표 계약

최종 의미는 다음으로 고정한다.

## 5.1 sourceGrade

```text
원본 provenance
```

- source file / canonical identity와 결속
- immutable Saved Paper 안에서도 provenance로 보존
- browse나 distribution 때문에 rewrite하지 않음

## 5.2 browseGrades[]

```text
Saved Paper 생성 전 discovery / exposure authority
```

예:

```text
sourceGrade = 고2
browseGrades = [고2, 고3]
```

고2 source가 승인된 shared semantic subject이면 고2·고3에서 모두 탐색될 수 있다.

### HARD

```text
selectedGrade ∈ browseGrades
```

는 discovery contract이지 distribution permission이 아니다.

## 5.3 targetGrade

```text
실제 Assignment가 배포되는 반/학생 측 학년
```

- class grade가 authority
- Recent/board filter의 grade는 target grade
- Saved Paper content grade와 독립

---

# 6. `archive_saved_papers.grade` 최종 권장 의미

v1.0 조사 기준 권장 결정:

```text
archive_saved_papers.grade
= Saved Paper를 만든 당시의 content / browse display context
= compatibility field

NOT source provenance authority
NOT target distribution permission
```

## 이유

현재 다음이 서로 결속되어 있다.

- DB `archive_saved_papers.grade`
- `snapshot.meta.grade`
- `snapshot.selectionFilters.grade`
- immutable snapshot 검증
- Saved Paper library display
- revision Draft restore

반면 실제 source provenance는 각 question의 `sourceGrade + sourceIdentityEvidence`가 별도로 보존한다.

따라서 이 단계에서:

- column rename
- schema migration
- old Saved Paper backfill
- snapshot field rename

을 할 실익이 작고 compatibility 위험이 크다.

### 기본 결정

**KEEP as content/display compatibility field.**

Astra/Pro review에서 강한 반증이 없으면 rename/migration하지 않는다.

---

# 7. browseGrades current-main gap

현재 builder는 record에 주로:

```text
sourceGrade
effectiveBrowseGrade = sourceGrade
```

를 물리화한다.

고2↔고3 shared browse는 명시적인 `browseGrades[]`가 아니라:

- `browseGradeMatchesRecord()`
- semantic subject projection
- Finder의 shared-high-grade 판정
- projection policy

의 조합으로 동작한다.

즉 제품 동작은 상당 부분 구현됐지만 **Grade browse Authority가 여러 계산식에 분산**돼 있다.

## 7.1 목표

preferred direction:

```js
{
  sourceGrade: "고2",
  browseGrades: ["고2", "고3"],
  effectiveBrowseGrade: "고2" // compatibility window only
}
```

### 기본 생성 규칙

- 기본: `browseGrades = [sourceGrade]`
- approved 고2/고3 shared semantic projection: `["고2","고3"]`
- future projection이 생기면 canonical policy에서 계산
- 임의 학년 확장 금지

## 7.2 selectedGrade는 scalar 유지

Browser state:

```js
state.filters.grade
```

는 사용자가 현재 선택한 학년이므로 배열로 바꾸지 않는다.

의미를 명확히 하면:

```text
state.filters.grade = selectedGrade
record.browseGrades = exposure set
```

이다.

따라서 URL state / Draft restore는 selected grade scalar를 유지할 수 있다.

A3의 “URL/Draft migration”은 **배열 저장으로 바꾼다는 뜻이 아니라 새 browse authority와 재복원 parity를 검증한다는 뜻**으로 해석한다.

---

# 8. Recent / History의 남은 Grade gap

`archive2-history.js`는 이미 개념적으로:

```js
targetGrade
contentGrade
```

를 분리한다.

UI도:

```text
대상 고1
시험지 고2 · 미적분I
```

처럼 별도 표시할 수 있게 되어 있다.

그러나 current `recent-summary` Worker projection은 target인:

```text
class_grade
```

는 제공하지만 Saved Paper content grade를 확실하게 공급하지 않는다.

현재 projection에는 Saved Paper의:

- `grade_label`
- `archive_saved_papers.grade`
- full `mixed_payload_json`

중 contentGrade authority가 직접 들어오지 않는다.

따라서 Saved Paper Recent 행에서 `contentGrade`가 비어질 수 있다.

## 권장 수정

full payload를 목록 API에서 다시 materialize하지 않는다.

Saved Paper인 경우:

```text
class_exam_assignments.saved_paper_id
→ archive_saved_papers.grade
→ content_grade
```

를 lightweight join/projection으로 제공하는 방향을 우선 검토한다.

Browser `archive2-history.js`는:

```text
assignment.content_grade
→ legacy grade_label
→ payload meta.grade
→ original exam source grade
```

순의 compatibility fallback을 검토한다.

최종 SQL/필드명은 Astra second pass에서 current schema를 다시 보고 결정한다.

---

# 9. 구현 전 second-pass review — Stage R

이 단계는 필수다.

## R1. latest main freeze

Astra 또는 GPT-6 Pro는:

1. 최신 remote main SHA 확인
2. 본 문서 기준 SHA 이후 관련 owner drift 확인
3. 아래 owner 파일 실물 재조회
4. 최근 Grade/Saved Paper 관련 commit 확인

을 한다.

## R2. Call-site denominator

최소 아래를 전수 검색한다.

```text
checkTargetGrade
checkTargetGrades
resolveSavedPaperSourceGrades
sourceGrade
effectiveBrowseGrade
browseGradeMatchesRecord
grade_label
contentGrade
targetGrade
saved_paper_id
archive_saved_papers.grade
selection_filters.grade
filters.grade
```

검색 결과를 **consumer table**로 작성한다.

## R3. PLAN_DELTA

reviewer는 본 계획에 대해 아래 형식만 우선 제출한다.

```text
PLAN_REVIEW
BASE_SHA:
REVIEWED_SHA:

KEEP:
- ...

MODIFY:
- ...

REMOVE:
- ...

ADD:
- ...

DEFER:
- ...

DO_NOT_TOUCH:
- ...

MISSED_CONSUMERS:
- ...

SMALLER_SAFE_PATCH:
- ...

TEST_DENOMINATOR:
- ...

FINAL_STAGE_ORDER:
- ...
```

## R4. v1.1 PLAN FREEZE

PLAN_DELTA를 반영해 이 문서를 v1.1 이상으로 갱신한다.

그 전에는 implementation commit을 만들지 않는다.

---

# 10. 구현 Stage 1 — Saved Paper Distribution P0

## 목표

Saved Paper가 된 뒤에는 content/source/browse grade가 target permission이 되지 않게 한다.

## 10.1 최소 수정선

`routes/archive2.js` Saved Paper branch에서:

현재:

```js
checkTargetGrades(
  classRow,
  await resolveSavedPaperSourceGrades(env, savedSnapshot.questions),
);
```

목표 의미:

```js
await resolveSavedPaperSourceGrades(env, savedSnapshot.questions);
// provenance/identity verification only
// no target-grade eligibility comparison for Saved Paper distribution
```

정확한 코드 형태는 latest main을 보고 결정한다.

## 10.2 반드시 보존

- teacher auth
- `canAccessClass`
- class existence
- target student IDs
- active roster membership
- `requireStudentAccess`
- Saved Paper owner
- TRASHED/legacy tombstone policy
- snapshot hash
- snapshot schema
- source identity evidence
- ordered UID / bridge rows
- assignment context snapshot
- assignment batch identity
- retry/idempotency
- PDF failure semantics
- lifecycle operation rules

## 10.3 금지

- `checkTargetGrade(s)` helper 전역 삭제
- direct MIXED gate 완화
- Original gate 완화
- sourceGrade 삭제
- sourceIdentityEvidence 삭제
- Saved Paper snapshot 재조립
- 현재 catalog를 Saved Paper content authority로 되살림

---

# 11. Stage 1 필수 테스트

최소 실제 실행 테스트:

## PASS

1. 고2 source Saved Paper → 고2 target
2. 고2 source Saved Paper → 고1 target
3. 고1 source Saved Paper → 중3 target
4. 동일 Saved Paper를 서로 다른 target grade에 반복 배포
5. 동일 batch retry → 동일 Assignment identity / duplicate 0
6. PDF failure 후 Assignment 보존
7. Saved Paper output/reopen unchanged

## FAIL 유지

1. 타 교사의 Saved Paper
2. 접근권한 없는 class
3. class roster 밖 student
4. inactive student
5. malformed/tampered source identity evidence
6. snapshot hash conflict
7. TRASHED Saved Paper
8. invalid lifecycle operation

## Regression

- direct MIXED의 현재 grade policy 변화 0
- Original direct의 현재 grade policy 변화 0

---

# 12. 구현 Stage 2 — Recent target/content grade 완성

## 목표

cross-grade assignment를 사람이 봐도 의미가 뒤섞이지 않게 한다.

### Worker

`recent-summary`에서:

- target grade = class grade
- content grade = Saved Paper creation/content grade

를 분리해 제공한다.

### Browser

Recent card:

```text
대상 중3
시험지 고1 · 공통수학1
```

처럼 둘을 동시에 표현한다.

### HARD

- recent grade filter는 **targetGrade** 기준
- contentGrade는 filter permission이 아님
- full Saved Paper snapshot JSON을 목록용으로 읽지 않음
- peer teacher snapshot-read permission을 건드리지 않음

---

# 13. 구현 Stage 3 — browseGrades Authority 수렴

이 단계는 P0 배포 fix와 별도 commit으로 수행할 수 있다.

## 13.1 Canonical representation

Astra review 후 아래 둘 중 하나를 선택한다.

### A — materialized `browseGrades[]` 권장

builder/resolved catalog에서 record별 배열을 물리화.

장점:

- 의미가 명확
- Finder/Compose 동일 판정
- 테스트가 단순
- future projection 확장에 유리

### B — canonical resolver only

배열 자체를 저장하지 않고 single resolver가 항상 exposure set을 반환.

허용 조건:

- Finder/Compose/Worker가 동일 helper를 사용
- consumer별 별도 shared-high-grade 계산이 사라짐
- 테스트가 exposure set을 직접 검증

## 13.2 이번 문서의 기본 선호

**A — materialized `browseGrades[]`**.

단 payload/column-pack 크기나 canonical build 구조상 B가 더 안전하다는 실증이 나오면 B로 바꿀 수 있다.

## 13.3 대상

- `build-archive2-catalog.mjs`
- `archive2-core.js`
- Finder
- Compose
- source restriction reconcile
- school candidate projection
- course/semantic subject projection
- Draft restore
- URL restore
- tests

## 13.4 compatibility

`effectiveBrowseGrade`는 즉시 삭제하지 않는다.

사용처 denominator를 확정한 뒤:

```text
KEEP compatibility
→ migrate consumers
→ no-live-consumer evidence
→ retirement 별도 판단
```

순으로 처리한다.

---

# 14. Stage 3 필수 browse tests

1. middle grade는 기본 자기 학년만 노출
2. 고1 source는 승인되지 않은 고2/고3 browse에 임의 노출되지 않음
3. approved 고2 source shared semantic subject는 고2·고3 모두 노출
4. approved 고3 source shared semantic subject는 정책이 허용하는 browse에만 노출
5. `sourceGrade`는 browse 선택으로 rewrite되지 않음
6. curriculum/course provenance 보존
7. Finder와 Compose의 UID set parity
8. source-restricted Finder → Compose handoff parity
9. Draft restore 후 동일 selectedGrade + 동일 eligible UID set
10. URL reload 후 동일 browse result
11. unapproved cross-grade source는 계속 제외
12. 2015/2022 semantic subject projection 회귀 0

---

# 15. 구현 Stage 4 — Saved Paper grade 의미 봉인

코드/문서 주석과 테스트에서 의미를 명시한다.

```text
SavedPaper.grade = creation/content browse context
```

### 하지 않을 것

- column rename
- snapshot schema bump
- historical backfill
- immutable old snapshot rewrite

실제 schema migration이 필요하다는 second-pass 근거가 있을 때만 별도 PLAN_DELTA로 승격한다.

---

# 16. 구현 Stage 5 — 테스트 denominator / CI 보강

조사 시 `tests/archive2-worker-validation.test.mjs`에는 과거 grade-block 정책을 명시한 테스트가 존재한다.

현재 root `tools/run-tests.js`는 일반 `.test.js` glob을 기본으로 하고 일부 ESM만 `requiredCommands`로 직접 추가한다.

Grade seal에서는:

- grade/distribution contract 핵심 ESM test가 실제 CI blocking인지 확인
- 아니라면 `requiredCommands` 또는 동등한 정상 runner에 편입
- 문자열 존재 검사만으로 PASS하지 않음
- Worker + D1 runtime 실행 우선

한다.

### 필수 blocking contract

- cross-grade Saved Paper PASS
- permission/roster FAIL
- identity tamper FAIL
- direct MIXED regression
- Original regression
- browse/source provenance parity
- Recent target/content separation

---

# 17. 최종 Seal

다음을 모두 만족할 때만:

```text
GRADE_DISTRIBUTION_AUTHORITY = SEALED
```

로 표기한다.

## Seal checklist

- [ ] Saved Paper source/content/browse grade가 target permission으로 쓰이지 않음
- [ ] cross-grade Saved Paper distribution runtime PASS
- [ ] teacher/class/student/roster 권한 유지
- [ ] source identity 검증 유지
- [ ] direct MIXED / Original 기존 정책 의도치 않은 변화 0
- [ ] sourceGrade provenance immutable
- [ ] browse authority single-source
- [ ] Finder/Compose browse parity
- [ ] 2015/2022 semanticSubject 회귀 0
- [ ] Recent targetGrade/contentGrade 분리
- [ ] old Saved Paper 배포 가능
- [ ] Saved Paper `grade`가 target permission에 사용되지 않음
- [ ] critical ESM/runtime tests CI blocking
- [ ] latest main 재검
- [ ] remote main readback
- [ ] 관련 Notion CURRENT 갱신

---

# 18. DO NOT REBUILD / DO NOT TOUCH

이번 작업에서 새로 만들지 않는다.

- Saved Paper persistence
- immutable snapshot
- image byte pinning
- Saved Paper library
- AssignTarget UI
- recipient/exclusion infrastructure
- assignment context snapshot
- PDF pipeline
- student portal
- OMR
- Paper Lifecycle
- Output Engine
- Shared/Common Paper

또한 다음은 이번 P0를 핑계로 변경하지 않는다.

- JS Archive 시험지 내용
- Meta Foundation
- M2 automation topology
- direct Original 정책
- direct MIXED 정책
- class/student grade 데이터 자체
- 기존 assignment history

---

# 19. Git 작업 계약

구현 단계에서는 사용자 Git 운영 원칙을 따른다.

- 최신 main에서 시작
- 병렬 dirty 변경 정리 금지
- 이번 target 파일만 수정
- `git add .`, `git add -A` 금지
- stage별 필요 시 독립 commit
- main push 후 remote readback
- branch/worktree 사용 시 작업 종료 후 cleanup
- unrelated 변경 혼입 금지

이 계획서 작성 단계의 commit은 **문서 1개만** 포함한다.

---

# 20. 권장 구현 순서

```text
Stage R
Astra / GPT-6 Pro second-pass
→ PLAN_DELTA
→ v1.1 PLAN FREEZE

Stage 1
Saved Paper distribution P0

Stage 2
Recent target/content grade

Stage 3
browseGrades Authority convergence

Stage 4
Saved Paper grade semantics seal

Stage 5
CI / runtime denominator

Final
Grade + Distribution integrated review
→ Notion CURRENT update
→ GRADE_DISTRIBUTION_AUTHORITY = SEALED
```

P0가 작게 독립 가능하면 Stage 1을 먼저 구현·검증한 뒤 Stage 2~5를 이어도 된다.

단 **Stage R은 생략하지 않는다.**

---

# 21. Astra / GPT-6 Pro에게 반드시 물을 질문

1. Saved Paper path에서 `checkTargetGrades` 연결만 끊는 것이 정말 최소 안전 patch인가?
2. `resolveSavedPaperSourceGrades()`의 identity verification 중 distribution permission과 불필요하게 결합된 부분이 더 있는가?
3. old Saved Paper 중 `sourceIdentityEvidence`가 없는 snapshot의 fallback이 cross-grade 배포 후에도 안전한가?
4. direct MIXED / Original grade gate는 이번 scope 밖으로 유지하는 것이 맞는가?
5. explicit `browseGrades[]` materialization과 canonical resolver-only 중 current architecture에 더 맞는 것은 무엇인가?
6. Finder와 Compose에 중복된 high2/high3 browse 계산이 더 존재하는가?
7. Saved Paper Recent contentGrade를 full payload 없이 가장 작게 공급하는 owner는 어디인가?
8. `archive_saved_papers.grade`를 compatibility field로 유지할 때 숨은 permission consumer가 없는가?
9. Grade 핵심 ESM tests 중 현재 CI에서 빠진 것이 정확히 무엇인가?
10. 이 계획보다 더 작은 Stage 구성이 가능한가?

---

# 22. 다음 액션

이 v1.0을 main에 저장한 뒤:

1. Astra 또는 GPT-6 Pro에게 이 문서와 최신 main을 함께 주고 **second-pass plan review만** 시킨다.
2. reviewer는 코드를 수정하지 않는다.
3. `PLAN_DELTA`만 제출한다.
4. 그 결과를 반영해 v1.1로 갱신한다.
5. v1.1 `PLAN FREEZE` 후 Luna/Codex 구현으로 넘긴다.

---

## 최종 한 문장

> **Saved Paper의 source/content/browse grade는 provenance와 discovery를 설명하는 값이고, Saved Paper가 완성된 뒤 실제 학생 배포 권한은 target class/student authorization이 결정한다. 이 원칙을 P0 distribution gate, browse authority, Recent 표시, 테스트/CI까지 일관되게 닫되 이미 완성된 Paper Lifecycle과 기존 Original/direct MIXED 정책은 재설계하지 않는다.**
