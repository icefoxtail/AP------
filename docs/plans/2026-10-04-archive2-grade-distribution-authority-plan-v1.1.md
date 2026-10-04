# Archive 2.0 Grade + Distribution Authority 구현 계획 v1.1

> 상태: **PLAN FREEZE CANDIDATE — second-pass reviewed**  
> 검토일: 2026-10-04  
> REVIEWED_MAIN_SHA: `4255e53b7b6a62f059ad6abd96595b46fc325d73`  
> 판정: `PLAN_UPDATED_TO_V1.1` / 제품 코드·migration·tests 변경 0  
> v1.0은 조사 이력으로 보존한다. 이후 구현 기준은 이 문서이며, 착수 시 최신 main의 실제 코드가 우선한다.

## 1. 결론과 증거 범위

최소 구현은 **Saved Paper 배포의 학년 높낮이 제한 분리 + 공용 대상 선택창의 고3 누락 수정 + Recent의 Saved Paper 학년 projection 보완**이다. 이미 동작하는 high2/high3 공유 조회를 다시 만들거나 Saved Paper schema를 바꾸지 않는다. Paper Lifecycle은 재구현하지 않는다.

작업 전에 연결된 Notion의 다음 네 페이지를 직접 읽었다: `GPT 작업 전 필독 라우터`, `Archive 2.0 / JS Archive 시작 페이지`, `Archive 전체 작업 생명주기 — 단계별 필독 문서`, `Archive 2.0 미실현 업데이트 백로그 v2 — CURRENT`. 현재 진입점은 제품 계획 2차 검토이며 시험지 CREATE/R1/R2/R3 캠페인이 아니다.

| 기준 | 확인 내용 |
|---|---|
| v1.0 조사 SHA | `9e31a748b07d6edac468fa2eb262c5da214f54fe` — 역사 기록, 현재 authority 아님 |
| v1.0 최초 commit | `1c7cd06e15db26aa15fd37ed168f70c745b63e65` |
| reviewed main | `4255e53b7b6a62f059ad6abd96595b46fc325d73` |
| 작성 후 drift | 위 최초 commit 대비 ahead 10 / behind 0. 시험지·생성 catalog/index·운영 문서 변화는 있으나 아래 핵심 Grade/Saved/Recent 제품 owner와 CI/runner에는 변경 없음 |
| v1.0 보존 blob | `87bcf87b7dbc3232ed0359f0f53bf43abd16dee4` |
| 코드 수집 | 해당 SHA의 GitHub 파일 read와 동일 HEAD Pages run `37179799079`, artifact `11294572656`의 source tree를 사용. core/routes/plan 등 주요 blob을 GitHub와 대조 |
| 전수 검색 분모 | artifact 내 텍스트 6,920파일 검색, 요청 symbol 일치 286파일 / code·build·test 분류 66파일. 숨김 CI 파일은 GitHub에서 별도 조회. 이 수치는 Git tracked 전체 파일 수나 286개 독립 소비처라는 뜻이 아님 |

GitHub code-search의 0건 응답은 부재 증거로 쓰지 않았다. 아래 숫자는 substring 기준이며 `checkTargetGrade`에는 복수형이 중복 포함된다. 각 hit의 실제 의미를 나누어 소비처를 검토했다.

| 검색어 | 일치 파일 수 |
|---|---:|
| `checkTargetGrade` / `checkTargetGrades` / `resolveSavedPaperSourceGrades` | 4 / 4 / 5 |
| `sourceGrade` / `effectiveBrowseGrade` / `browseGradeMatchesRecord` / `browseGrades` | 38 / 27 / 3 / 2 |
| `grade_label` / `contentGrade` / `targetGrade` / `saved_paper_id` | 17 / 6 / 225 / 15 |
| `archive_saved_papers.grade` / `selection_filters.grade` / `filters.grade` | 1 / 1 / 10 |

## 2. PLAN_DELTA

**KEEP:** Saved Paper만 우선 분리한다. sourceGrade provenance, snapshot hash/ordered UID, teacher/class/student access, 신규 대상 active roster, Assignment identity·retry·idempotency·lifecycle를 유지한다. `archive_saved_papers.grade`는 저장 당시 조회/표시 context로 유지한다.

**MODIFY:** v1.0의 Original 설명을 아래 네 분기로 교정한다. 학년 비교를 빼더라도 기존의 대상 반 학년 식별 실패 처리는 별도로 유지한다. Recent는 대형 payload 대신 기존 immutable Saved Paper 행의 `grade`를 조건부 projection한다. CI 연결은 마지막이 아니라 해당 테스트를 추가하는 첫 변경에 포함한다.

**REMOVE:** `browseGrades[]` 물리화 우선안, 이를 위한 catalog/snapshot/schema migration·backfill, 이미 있는 Worker dependency install/Saved Paper CI 명령 재추가, high2/high3 공유 조회 재구현, 모든 Finder/Compose 결과 집합의 무조건 동일성 요구를 제거한다.

**ADD:** 공용 대상 선택창 고3 누락, 네 배포 분기의 비회귀 표, legacy witness-less snapshot, 대상 학년 metadata validity, 실제 Recent endpoint→UI 정규화 연결, 신규/재시도/추가 배포/대체 배포의 음성 테스트를 추가한다.

**DEFER:** direct MIXED/blueprint 배포 정책 변경, source 전체의 grade 재분류, 새로운 physical browse field, 범용 조회 리팩터링, 다른 제품의 grade 정책 통합은 별도 작업이다. 기존 전역 CI 실패는 별도 수리 대상이며 이 계획을 통과시키려고 quarantine하지 않는다.

**DO_NOT_TOUCH:** 원본 question JS·SVG/이미지, UID/fingerprint/hash 알고리즘, snapshot 직렬화와 immutable trigger, Saved Paper lineage, Assignment context hash·수신자/제외·취소 계약, PDF/OMR/학생 조회의 권한, 정본 taxonomy, 기존 quarantine 목록. 이번 검토 commit은 v1.1 문서 1개뿐이다.

## 3. Authority와 최소 수정선

### 3.1 배포 경로를 네 개로 구분한다

근거: `apmath/worker-backup/worker/routes/archive2.js`의 `savedPaperMode`, `original`, MIXED 및 blueprint 분기; `apmath/worker-backup/worker/helpers/archive2-questions.js`의 grade helpers.

| 경로 | reviewed main의 실제 동작 | 이번 구현 |
|---|---|---|
| Saved Paper: original + `saved_paper_id` | snapshot 검증 뒤 `checkTargetGrades(classRow, await resolveSavedPaperSourceGrades(...))`. existing Assignment 조회보다 먼저 실행됨 | provenance 검증은 실행하되 source→target 순위 비교만 제거 |
| raw Original: original, Saved Paper 아님 | 최초 발행에 `validateOriginalSnapshot`; grade 비교 호출 없음 | 그대로 유지. 새 학년 제한을 넣지 않음 |
| direct MIXED: studio의 `MIXED:archive2-...` | 최초 발행에 canonical 검증 후 `checkTargetGrades` | 그대로 유지 |
| registered/normal blueprint: studio의 원본 경로 | blueprint 검증, 최초 발행에 `checkTargetGrade` | 그대로 유지 |

`checkTargetGrade(s)`를 전역 삭제하거나 helper 단위의 기존 상위 학년 거부 테스트를 전부 허용으로 뒤집지 않는다. raw Original과 normal blueprint를 같은 경로라고 설명하지 않는다. 각 분기의 existing/retry 동작도 그대로 보존한다.

**SMALLER_SAFE_PATCH:** Saved Paper 분기에서 provenance 검증을 독립된 `await resolveSavedPaperSourceGrades(...)` 호출로 남기고, 결과 학년들을 target rank와 비교하지 않는다. 다만 아래 대상 metadata guard를 함께 보존한다. 신규 eligibility 서비스나 새 저장 필드는 필요 없다.

### 3.2 대상 metadata validity와 학년 제한은 다르다

현재 `checkTargetGrade`는 두 일을 한다: (1) 반 학년을 읽지 못하면 409, (2) 원본이 대상보다 상위이면 409. 호출을 통째로 없애면 (1)도 사라진다.

기존 `grade || grade_label`의 공백 제거, 값이 없을 때 반 이름의 `(중|고)[123]` 탐색, `gradeRank` 유효성 검사를 작은 target-only guard로 분리/재사용한다. Saved Paper도 **중1~고3의 유효한 모든 대상 학년을 허용하되 기존의 미확인 대상 학년 거부는 유지**한다. 비어 있지 않은 잘못된 필드의 fallback 동작까지 임의로 넓히지 않는다. 가짜 sourceGrade를 넣어 기존 비교 함수를 우회하는 방식은 금지한다.

현재 권한 검사와 반 존재 확인을 대체하지 않는다. source/content/browse 값은 target guard 입력이 아니며, 신뢰하지 않은 클라이언트 grade로 class DB 값을 대체하지 않는다.

### 3.3 Saved Paper 출처 검증과 구버전 호환

`resolveSavedPaperSourceGrades`는 현재 catalog를 다시 가져오는 함수가 아니다. `_env`를 사용하지 않고 frozen question의 UID·파일·ordinal·provenance를 검증한다. 제거하거나 배포 때 최신 catalog 재검증으로 교체하지 않는다.

- `sourceIdentityEvidence`가 있으면 schema/status, question UID, sourceFile와 identitySourceFile, ordinal, sourceGrade 결속을 유지한다.
- witness가 없는 legacy snapshot은 기존 `qid_v1_ + SHA256(sourceFile + "#" + ordinal)` 검증과 canonical source-path grade 해석을 유지한다. legacy `sourceGrade`가 제공됐는데 해석값과 다르면 기존처럼 거부한다.
- 무효 UID/ordinal/path, 불일치 witness, 미확정 source grade를 허용하지 않는다. 새 witness를 과거 snapshot에 몰래 채우거나 hash를 재생성하지 않는다.
- `archive_saved_papers.grade`, `snapshot.meta.grade`, `selectionFilters.grade`는 source provenance 대체물이 아니다. 저장 context만 고2로 바꾼 고1 source fixture는 고2→고1 배포 허용의 증거가 아니다.

근거: 위 helper의 `resolveSavedPaperSourceGrades`, `archive/archive2-canonical.js`의 `resolveSnapshotSourceGrade`, `apmath/worker-backup/worker/helpers/archive-saved-papers.js`의 `prepareSavedPaperBatch`·`readAndVerifySavedSnapshot`.

### 3.4 누락된 공용 대상 선택창: 고3

실제 경로는 `archive/archive2-workspace.js::openSavedPaperIssue` → `index.html?savedPaper=...` iframe → `archive/archive2-entry.js::openArchive2SavedPaperIssue` → `archive/index.html::openAssignTargetPanel`이다.

`index.html::getIndexClassGrade`의 이름 fallback과 `getIndexAvailableGrades`의 반환 목록은 중1~고2만 포함한다. 정렬 helper에는 이미 고3이 있어 **정렬만 고쳐서는 해결되지 않는다**. Worker `routes/check-omr.js`의 qr-classes 결과를 받더라도 고3-only 대상은 UI에서 담당 반 없음으로 처리될 수 있다.

원본 함수 그대로 실행한 재현:

| 입력 | reviewed main 관측 |
|---|---|
| `{grade:'고3', name:'고3 반'}` | 반 학년은 고3이지만 available grades는 `[]` |
| `{name:'고3 반'}` | 이름 fallback 학년은 빈값 |
| 고1·고3 반 목록 | available grades는 `['고1']` |

최소 수정은 위 두 helper의 지원 학년 보완이다. 모든 허용 반을 표시하고, paper.grade는 초기 선택 선호값일 뿐 목록 제한으로 쓰지 않는다. 선생님 필터·반별 active roster는 그대로 둔다. 공용 UI를 사용하므로 raw Original 등에도 고3 선택이 보이게 되지만 해당 backend 배포 정책은 3.1처럼 유지한다. 새 target API나 별도 선택창을 만들지 않는다.

### 3.5 Recent: lightweight metadata projection

실제 흐름: `routes/exams.js`의 `recent-summary` SQL → workspace 수신 → `archive/archive2-history.js::normalizeAssignments` → Recent 표시/필터.

현재 SQL은 `saved_paper_id`, `class_grade`를 내보내지만 `grade_label`, `mixed_payload_json`, Saved Paper content grade를 projection하지 않는다. 반면 UI 정규화는 `grade_label → payload.meta.grade → exam.sourceGrade/grade`를 사용한다. 따라서 Saved Paper MIXED 행에 class_grade만 있는 실제 API 모양을 원본 정규화에 넣으면 targetGrade는 고3, contentGrade는 빈값이다. mock에 grade_label을 넣은 테스트만으로 이 연결을 검증할 수 없다.

**선택 구조:** 기존 `archive_saved_papers`의 immutable `grade`를 `saved_paper_id`로 조건부 LEFT JOIN하여 `content_grade`로 projection한다. client는 그 필드를 먼저 읽고, 기존 다른 경로의 fallback은 보존한다.

- 기존 schema capability 검사 방식을 재사용한다. assignment에 saved_paper_id가 없거나 Saved Paper table/id/grade가 없는 schema는 JOIN을 생략하고 NULL을 반환한다. 누락 행도 unknown이다.
- teacher/class access가 결정하는 기존 Assignment 조회 범위, target 학년/date/subject 필터, 정렬·limit·dedupe·수신/제출 수 계산은 바꾸지 않는다.
- history용 grade JOIN에 Saved Paper의 ACTIVE/ARCHIVED/TRASHED 또는 deleted_at 필터를 추가하지 않는다. 저장본 상태 변경으로 과거 배포 기록의 표시 학년이 사라져서는 안 된다. 이것은 trashed paper의 신규 배포를 허용하는 변경이 아니다.
- 대형 snapshot JSON을 목록 응답에 추가하거나 행마다 별도 조회하지 않는다. 새 DB column/assignment context field도 만들지 않는다.
- `contentGrade`는 **저장 당시 조회/콘텐츠 표시 context**이지 각 문항 sourceGrade의 집합이나 배포 허가가 아니다. NULL을 targetGrade로 채워 같은 학년인 척하지 않는다.

### 3.6 Browse: 저장 필드를 늘리지 않는다

현재 `archive/archive2-core.js::browseGradeMatchesRecord`와 `subjectProjectionMatches`, `archive/archive2-canonical.js`의 policy 해석으로 고2/고3 공유 조회가 이미 동작한다. canonical policy가 허용한 subject projection이 있는 경우에만 공유한다.

이번에는 **기존 `browseGradeMatchesRecord(record, grade, policy)`를 조회 소속 여부의 공용 판정 지점으로 유지**한다. `browseGrades[]`는 개념상 복수 소속을 뜻할 뿐 저장 필드 추가 요구가 아니다. 향후 배열이 실제 필요한 consumer가 생기면 이 판정을 이용해 알려진 학년 목록에서 유도하면 된다. P0 마감을 위해 새 resolver 이름이나 배열을 강제로 도입하지 않는다.

`effectiveBrowseGrade` scalar와 sourceGrade provenance를 보존한다. source unit/course projection, filter membership, 선택창 target grade는 서로 다른 역할이므로 이름에 grade가 있다는 이유로 일괄 치환하지 않는다. builder/canonical 정책과 Browser/Worker가 동일한 입력에 같은 소속 판정을 하는 회귀를 고정한다. 실제 중복 membership 판정의 불일치가 재현될 때만 해당 caller를 공용 predicate에 위임한다.

Finder는 original 시험지 목록/empty-catalog fallback을 다루고 Compose는 승인 문항 선택을 다룬다. 비교 대상은 **공통으로 적격인 동일 record의 조회 소속**이며, 전체 시험지 수와 문항 UID 집합이 같아야 한다는 규칙을 만들지 않는다. high1 세부 단원 projection·명시적 제외·지원하지 않는 과목의 fail-closed 동작도 유지한다.

## 4. 소비처와 persistence 검토

**MISSED_CONSUMERS:** 특히 추가한 소비처는 index의 `getIndexClassGrade/getIndexAvailableGrades/openAssignTargetPanel`, Saved Paper iframe/entry 연결, qr-classes 제공자, Recent SQL projection과 정규화 연결이다.

| 검토 영역 | 직접 확인한 owner / 처리 |
|---|---|
| Browser | `archive/archive2-core.js`, `archive/archive2-workspace.js`, `archive/archive2-entry.js`, `archive/archive2-library.js`, `archive/archive2-history.js`, `archive/index.html` — 위 delta만 수정 후보 |
| Canonical/build | `archive/archive2-canonical.js`, `archive/tools/build-archive2-catalog.mjs`, `archive/data/archive2-canonical-projection-policy.json`, `archive/tools/build-basic-scope-parent-links.mjs`, `archive/tools/report-archive2-canonical-impact.mjs` — provenance/조회 역할 보존, 재생성 기본값 아님 |
| Worker | `apmath/worker-backup/worker/routes/archive2.js`, `apmath/worker-backup/worker/routes/archive-saved-papers.js`, `apmath/worker-backup/worker/routes/exams.js`, `apmath/worker-backup/worker/helpers/archive2-questions.js`, `apmath/worker-backup/worker/helpers/archive-saved-papers.js` |
| 인접 읽기/출력 | `apmath/worker-backup/worker/routes/check-omr.js`, `apmath/worker-backup/worker/routes/exam-pdf.js`, `apmath/worker-backup/worker/routes/student-portal.js`, `apmath/worker-backup/worker/routes/wrong-clinics.js`, `apmath/student/archive-review-output.js` — 권한·frozen assignment 사용 보존 |
| lifecycle | `apmath/worker-backup/worker/helpers/archive2-assignment-lifecycle.js` — mutation/lineage/context guard 보존 |
| 동명이의 hit | assessment의 grade_label/targetGrade, Meta Foundation validator의 대상 학년, 학생 편집 등은 별도 업무 의미다. Saved Paper 배포 정책을 전파하지 않음 |

직접 읽은 관련 migration:

- `apmath/worker-backup/worker/migrations/20260929_archive_saved_papers.sql`
- `apmath/worker-backup/worker/migrations/20261002_archive2_paper_lifecycle_foundation.sql`
- `apmath/worker-backup/worker/migrations/20261002_archive2_assignment_context.sql`

Saved Paper의 grade는 snapshot.meta.grade와 검증되며 immutable 저장 계약에 포함된다. rename/drop/backfill을 하지 않는다. library 상태·lineage는 별도 테이블, Assignment context는 saved ID/hash 등 별도 불변 계약이다. grade 정책 변경 때문에 이 계약을 다시 만들 필요가 없다.

배포 변경 후에도 새 Assignment의 target 학생은 current active roster로 검사한다. 기존 RETRY의 frozen 수신자 identity·제외·취소 규칙을 신규 roster 규칙으로 재해석하지 않는다. ADD_RECIPIENTS는 같은 paper identity, REPLACEMENT는 새 revision/fork와 parent snapshot hash를 요구하는 기존 경계를 유지한다. 잘못된 요청에는 DB 쓰기 부작용도 없어야 한다.

## 5. TEST_DENOMINATOR / CI

### 5.1 실제 baseline과 실행 한계

reviewed SHA의 CI run `37179799674`, job `111369876376`을 조회했다. Node 22, Worker dependency install, syntax, skill verification은 성공했다. regression runner는 **188 PASS / 4 FAIL**이며 `tests/archive-saved-papers-runtime.mjs` 명령은 통과했다. 전역 CI가 정상이라고 보고하지 않는다. 기존 실패를 이 Grade patch에 섞어 수정하거나 gate를 약화하지 않는다.

`.github/workflows/ci.yml`에 Worker `npm ci`가 이미 있으며, `tools/run-tests.js`는 `.test.js` 자동 수집과 explicit `requiredCommands`를 조합한다. Saved Paper runtime 명령은 이미 explicit blocking이다. 반면 관련 `.mjs`/`.cjs` 파일이 존재한다는 이유만으로 모두 CI blocking이라고 볼 수 없다.

이번 계획 검토에서 고3 picker 및 Recent API 모양의 행을 원본 함수로 실행해 결함을 재현했다. 로컬 확장 suite 실행은 시간 제한으로 완료되지 않았으며 전체 PASS로 계산하지 않았다. 새로운 cross-grade D1/browser acceptance는 아직 실행하지 않았다. 아래는 **구현 시 완료해야 할 분모**이며 이번 검토의 통과 실적이 아니다.

### 5.2 반드시 증명할 계약

| ID | 계약 / 양성·음성 분모 |
|---|---|
| T1 | Saved Paper의 실제 source 고2/고3→하위 반, 중등↔고등, 여러 source grade가 섞인 유효 저장본을 유효한 중1~고3 반에 배포. 동일 학년/상위 반도 보존. 저장 context만 바꾼 fixture로 대체 금지 |
| T2 | direct MIXED/blueprint의 기존 상위 source 거부, raw Original의 기존 별도 동작, 네 경로의 existing/retry 비회귀 |
| T3 | valid/unknown/invalid class metadata, grade_label·이름 fallback. teacher/class/student 권한, 다른 반·비재원 학생 거부 및 실패 시 쓰기 0 |
| T4 | frozen snapshot hash·count·ordered UID/bridge parity, UID/path/ordinal/witness/sourceGrade 변조 거부. legacy witness 없음의 정상·불일치 사례. 유효 저장본 배포는 현재 catalog 불가 상태에서도 기존처럼 가능 |
| T5 | 신규 발행, exact retry의 중복 생성 0, 요청 identity 충돌, ADD_RECIPIENTS same-paper, REPLACEMENT lineage/hash, 제외·취소 후 retry, 낙관적 동시 mutation guard 보존 |
| T6 | 저장본 reopen/copy/revision, 출력·PDF 실패 후 retry·OMR·학생 과거 조회가 동일 frozen Assignment를 계속 사용 |
| T7 | 실제 shared picker: 고3-only / 혼합 / 이름-only / 명시 grade / 허용 반 없음. 선호 grade와 무관하게 허용 학년 전부 노출. iframe/entry 흐름과 teacher 필터 유지 |
| T8 | 실제 D1 recent-summary 응답을 그대로 history.normalizeAssignments에 전달: target≠saved content, 같은 학년, mixed source context, unknown. 목록 학년 필터는 target 기준 |
| T9 | Recent의 optional table/column/row 없음, 비-Saved Assignment, 과거 payload/grade_label fallback, ARCHIVED/TRASHED 저장본·취소/대체 이력 보존. 다른 teacher/class 조회 거부, N+1/대형 payload 추가 없음 |
| T10 | 고2↔고3 canonical shared subject, 비공유/지원 불명 과목, 고1 unit projection, 중등·명시 제외. Browser/Worker 공통 적격 record의 browse/subject parity 및 Finder 고유 scope 보존 |

### 5.3 테스트 owner와 실행 명령

기존 fixture를 확장하고 같은 계약의 중복 harness를 새로 만들지 않는다. 핵심 추가 명령은 해당 patch와 함께 `requiredCommands`에 명시한다. `.test.js` glob을 전 확장자로 넓히거나 quarantine을 없애지 않는다.

| 구분 | 파일 / 실행 |
|---|---|
| 이미 blocking | `node --test tests/archive-saved-papers-runtime.mjs`; `tests/archive2-compose-scope.test.js`는 기존 runner가 수집 |
| Grade/identity guard | `node --test tests/archive2-worker-validation.test.mjs`, `node --test tests/archive2-saved-paper-namespace.test.mjs` |
| Recent end-to-end | `node --test tests/archive2-ux-retrieval-d1.test.mjs`, `node --test tests/archive2-recent-friction-ui.test.cjs` |
| UI handoff/출력 | `node --test tests/archive2-assignment-handoff.test.cjs`, `node --test tests/archive2-assignment-pdf-retry.test.cjs` — 고3 선택 재현도 공용 선택창을 실제 호출하도록 추가 |
| Browse 비회귀 | `node --test tests/archive2-core.test.cjs`, `node --test tests/archive2-finder-filters.test.cjs`, `node --test tests/archive2-canonical-projection.test.mjs` |

추가로 직접 읽은 `tests/archive2-worker-runtime.mjs`는 workerd/D1 fixture를 구성하고 자체 assertion/결과 출력을 수행하는 실행 스크립트다. 필요 시 `node tests/archive2-worker-runtime.mjs`로 `--serve` 없이 실행하여 명시된 최종 결과와 종료 코드를 확인한다. 파일을 읽었거나 서버가 떴다는 사실을 runtime PASS로 쓰지 않는다. 현재 legacy fixture가 새 lifecycle schema와 충돌하면 fixture의 최소 정합 보완이지 제품 guard 제거 사유가 아니다.

인접 보호 범위: `tests/archive2-registration-sync.test.mjs`, `tests/archive2-canonical-lock.test.mjs`, `tests/archive2-canonical-impact.test.mjs`, `tests/archive2-school-history.test.cjs`, `tests/archive2-unit-count-links.test.cjs`, `tests/archive2-meta-advanced-filter.test.cjs`, `tests/helpers/archive2-scope-harness.cjs`, 기존 assessment Grade/Assignment 테스트. 이 목록 전부를 무조건 새 blocking 명령으로 추가하지 않고 실제 변경 의존성에 맞춰 실행한다. fixture helper 로드 성공과 assertion suite 성공을 구분한다.

## 6. FINAL_STAGE_ORDER

| 순서 | 작업 | 닫는 기준 |
|---|---|---|
| 0 | 최신 main의 owner/schema/test drift 재확인, T1~T10의 기존 커버리지와 부족 fixture 확정 | 불필요한 재조사 캠페인 없이 실제 baseline 기록. 현재 미완료/실패 테스트를 PASS로 쓰지 않음 |
| 1 | Saved Paper 순위 비교 분리 + target-only validity + 공용 고3 picker, 관련 테스트/CI 명령을 같은 단계에서 연결 | T1~T7. 직접 배포 정책과 hash/권한/lifecycle 비회귀 |
| 2 | Recent 조건부 content_grade projection + client normalization | T8~T9. 실제 endpoint→UI 데이터 검증 |
| 3 | 기존 browse predicate/policy 계약의 회귀 고정. 실제 불일치가 없으면 제품 browse 코드 변경 0 | T10. 배열 물리화·catalog 일괄 재생성·범용 리팩터링 없음 |
| 4 | 최종 diff/선정 suite/CI/테스트 계정 smoke와 remote readback | Grade acceptance와 전체 release gate 모두 확인. 실학생 mutation 없음 |

CI가 물려받은 unrelated 실패는 별도 작업으로 해결해야 전체 green/release를 선언할 수 있다. 현재 4 FAIL을 이유로 계획을 불필요하게 확장하지 않되, 이를 무시하고 제품 배포 승인으로 해석하지 않는다. 구현 완료 후 필요한 UI smoke도 실행 전에는 NOT_TESTED다.

## 7. 구현·반영 경계와 종료 판정

이번 작업은 계획만 반영한다. v1.0 및 제품/테스트/migration 파일을 변경하지 않는다. 새 v1.1 문서만 독립 commit으로 main에 반영하고 remote commit의 변경 파일 목록 및 문서 blob을 readback한다. 병렬 main 전진은 보존하며 force update하지 않는다.

후속 구현도 작업별 대상 파일만 stage하고 `git add .`/`git add -A`를 쓰지 않는다. rollback은 해당 구현 commit 범위로 하며 DB/저장 snapshot 되쓰기를 만들지 않는다. 새 consumer 결함이 확인되면 근거와 변경 범위를 먼저 기록하고, 정상 경로를 겸사겸사 수정하지 않는다.

**다음 단계: PLAN FREEZE 가능.** 이 계획으로 테스트 우선 구현을 시작할 수 있다. 이는 제품 구현 완료·전체 CI PASS·production 배포 허가를 뜻하지 않는다. 이번 검토에서는 제품 구현을 시작하지 않았다.
