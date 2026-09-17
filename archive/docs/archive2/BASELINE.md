# JS아카이브 2.0 Phase 0 실코드 Baseline 감사

> 감사 시점: 2026-09-16 (Asia/Seoul)
>
> 범위: 최신 `main` 기준 저장소 코드·정적 데이터·Worker backup source·remote D1
> read-only 조회·Cloudflare Worker 배포 메타데이터·로그인된 Chrome의 실제
> Archive/Unit Past/출력 화면.
>
> 이 문서는 Archive 2.0을 구현한 결과가 아니다. “Existing”은 코드나 데이터에서
> 실제로 확인한 것, “Partial”은 일부 경로·필드·데이터만 연결된 것, “Absent”는
> 현재 구현/배포에서 확인되지 않은 것이다. 문서에 적힌 목표 동작을 현재 동작으로
> 간주하지 않는다.

## Metadata Foundation v2 Authority boundary

이 baseline의 수치와 `하/중/상` 기반 historical normalization은 감사 당시
관측값이지 새 canonical metadata 의미가 아니다. 문항 L1~L4는
`docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/`, difficulty 4-field는
`docs/rules/01_CANONICAL/JS아카이브_difficultyBucket_5단계_운영규칙_v1.3.md`,
metadata 저장·runtime parity는
`docs/rules/01_CANONICAL/JS아카이브_Metadata_Contract_v2.md`가 HARD
Authority다. 기존 standard/sub-unit keys와 `level`은 legacy bridge 및
historical compatibility로만 해석한다.

## 1. Audit HEAD

### 1.1 저장소 기준점

| 항목 | 값 |
|---|---|
| Audit 기준 `main` HEAD | `91b8657e41098b5ab41c2bef1dbfb7ee1b292825` |
| audit 시작 시 `HEAD` / local `main` / `origin/main` | 모두 위 SHA |
| 기준 커밋 | `docs: add Archive 2.0 canonical documents` |
| 기준 커밋 시각 | 2026-09-16 08:29:55 +09:00 |
| 감사 후 문서 커밋 | 최종 보고서의 commit SHA로 기록 |
| 배포 Worker | `ap-math-os-v2612` |
| remote D1 | `ap-math-os` / database id `146096e8-01f7-49c4-8add-9cb5a5258cde` |

감사 시작 시 작업 트리에는 사용자가 이미 남겨 둔
`tests/archive-wangun-q16-layout.test.cjs` 미추적 파일이 있었다. 이 파일과
기타 기존 변경은 읽거나 수정하지 않았고, `git add .`, `git add -A`, stash,
restore/reset/clean을 사용하지 않았다. 감사 도구가 실수로 추가한
`archive/data/question-type-coverage-audit.json`의 trailing newline은 문서 작업
전에 HEAD와 동일하게 복구했다.

### 1.2 배포 parity 기록

read-only Wrangler 조회 결과:

- Worker 최신 version id: `72e9b994-7e8e-4ddb-b9ab-25abb676e6ef`
- version number: `223`
- deployed at: `2026-09-14T03:03:26Z`
- script etag: `38629d016141bab75ac3918e327f06bcc24a860a4e9ab2c13e07988a0d6aea14`
- compatibility date: `2026-07-11`, `nodejs_compat`
- binding: D1, R2 backup/PDF/homework, Browser v2, backup Workflow가 `wrangler.jsonc`와 존재상 일치
- Worker source의 마지막 관련 변경: `681144295c2e8aee21dcf9e91ffdebf638e5f2b6` (2026-09-14 12:02:30 +09:00)

마지막 source 변경 시각은 배포보다 약 55초 앞서므로 시간상 정렬은 확인된다.
그러나 Cloudflare version metadata에 git commit SHA가 없고 script byte를 local
source와 직접 비교하지 않았으므로 결과는
`UNPROVEN_BYTEWISE / TEMPORALLY_ALIGNED`다. “remote Worker가 local backup과
byte-for-byte 동일하다”고 판정하지 않는다.

### 1.3 검사 경계

- remote D1 명령은 모두 `wrangler d1 execute --remote --command ... --json` 읽기 조회였다. 응답의 `changes=0`, `rows_written=0`을 확인했다.
- 브라우저 검사는 로그인된 Chrome extension profile의 새 agent tab에서 수행했다. 사용자의 기존 tab은 이동하지 않았다.
- 브라우저 viewport는 914×827, GitHub Pages 정적 배포였다. 새 익명 cold-cache와 Performance API 수치는 수집하지 않았고, 아래 시간은 CUA wall-clock 관측값이다.
- assignment 생성·학생 제외·OMR 제출·PDF 생성 같은 외부 상태 변경은 실행하지 않았다.

## 2. 실제 Architecture

현재 실코드의 한 줄 구조는 다음과 같다.

```text
archive/db.js + question-index/metadata + 원본 JS
        ↓
Unit Past / Mixer / normal engine / mixed engine
        ↓  (기존 assignment 등록 payload)
Worker: class_exam_assignments
        ├─ class_exam_assignment_recipients  ─ exclusions
        ├─ mixed_payload_json + PDF/R2 artifact
        └─ exam_sessions → wrong_answers / assessment_result_items
        ↓
Student Portal / OMR / Wrong Clinic / teacher board

[현재 없음]
class_exam_assignment_questions
        assignment ↔ final canonical questionUid bridge
```

실제 레이어별 확인 결과:

| 레이어 | 현재 확인 |
|---|---|
| Archive catalog | `archive/db.js` 462개 exam, 11,226개 질문; `question-index.js`도 462 files/11,226 records |
| Unit Past | profile/sourcePrefix, 단원·난이도·문항 수 선택, paper split, 교체/undo, mixed handoff |
| Mixer | UID·단원·subunit·난이도·학교·연도·source diversity·template/essay·recent UID selector |
| 기존 출력 | normal 문제지/해설/정답과 mixed output 모두 존재 |
| Assignment | 162 rows, stable UUID id, archive/MIXED payload, recipients/exclusions, PDF 상태 |
| Student/OMR | recipient/exclusion guard, student portal assignment/PDF/OMR, exam session/wrong answers |
| UID | Worker/sidecar 계산식 존재. 단, current question-index field와 모든 assignment payload에 일관되게 들어가지는 않음 |
| Bridge | `class_exam_assignment_questions` remote table 없음, route write/read 없음 |

## 3. Existing Authorities

### 3.1 데이터·서버 Authority

| 기능 | Existing Authority | 상태 |
|---|---|---|
| assignment row identity | `class_exam_assignments.id` (UUID) | EXISTING |
| batch grouping | `assignment_batch_id` | EXISTING; row identity가 아님 |
| roster snapshot | `class_exam_assignment_recipients` | EXISTING; 162/162 assignment에 coverage |
| 실제 제외 | `class_exam_assignment_exclusions` | EXISTING; 25 assignments, 93 rows |
| effective target | recipients에서 exclusions를 뺀 집합 | EXISTING; 877 rows, distinct student 115 |
| normal source metadata | `exam_blueprints.source_question_uid/source_question_ordinal` | EXISTING; 일부 blank/legacy gap |
| MIXED content snapshot | `mixed_payload_json`, `mixedQuestions_*`, `mixedMeta_*` | EXISTING; 28 remote MIXED assignment |
| PDF artifact | assignment PDF columns + R2 `apmath-exam-pdfs` pipeline | EXISTING; 상태별 coverage는 별도 |
| OMR session | deployed `exam_sessions`, `assignment_id` 포함 | EXISTING in remote; source `schema.sql`에는 drift |
| wrong answer | `wrong_answers.question_id`(현재는 order no 의미) | EXISTING; UID bridge는 없음 |
| assessment analysis result | deployed `assessment_result_items` | PARTIAL; UID column/portal write 없음 |
| assignment-question bridge | `class_exam_assignment_questions` | ABSENT |

### 3.2 권한 Authority

Worker는 assignment create/exclusion, teacher preview, student portal, OMR에서
`canAccessClass`, `canAccessStudent`, teacher/admin/session 권한을 재검증한다.
따라서 Archive 2.0이 별도 RBAC를 만들 근거는 없다. grade-wide board read가
staff-wide인 것은 현재 제품 정책으로 확인되며, bridge가 생겨도 기존 권한
helper를 재사용해야 한다.

## 4. Assignment / Student / OMR / Wrong Answer Flow

### 4.1 현재 assignment issuance flow

1. Archive index 또는 Unit Past가 normal archive file이나 `MIXED:<snapshotKey>`를 선택한다.
2. Unit Past/Mixer는 `mixedQuestions_*`와 `mixedMeta_*`를 localStorage snapshot으로 넘기거나, normal file identity를 넘긴다.
3. `archive/index.html`이 `/class-exam-assignments`에 class/date/qcount/archive/source/payload/PDF 옵션을 POST한다. 현재 payload에는 final `questionUids` 배열이 없다.
4. Worker `routes/exams.js`는 class 권한을 확인하고 class/date/archive 또는 manual title/date로 기존 assignment를 찾은 뒤 update/insert한다. UUID assignment id는 existing row로 유지된다.
5. Worker가 recipient snapshot을 `INSERT OR IGNORE`하고, normal archive는 GitHub metadata/blueprint을 동기화하며, PDF가 필요하면 `ensureAssignmentPdf`를 호출한다.
6. 응답에는 assignment가 반환되지만 현재 Archive index caller가 `assignment.id`를 후속 상태에 보존하지 않는다.

### 4.2 Student Portal / exclusion

Student Portal은 recipients에 존재하고 exclusions에 없는 학생에게 assignment와
ready PDF를 보여 준다. exclusion route는 현재 `assignment_id`를 우선하는 경로가
있지만, Archive index의 일괄 제외 요청은 class/student/title/date/archive composite를
주로 사용한다. Worker는 exclusion 뒤 matching session과 wrong answers를
삭제한다. 이 cleanup은 현재 `assessment_result_items`를 삭제하지 않는다.

### 4.3 OMR / wrong answer

- student OMR submit은 student token, assignment recipient, exclusion을 확인하고 `exam_sessions`를 upsert한 뒤 `wrong_answers`를 삭제·재삽입한다.
- teacher bulk OMR/PATCH도 class/student 권한과 exclusion을 확인하고 같은 session/wrong flow를 사용한다.
- `wrong_answers.question_id`는 현재 1-based question order no다. `exam_sessions.assignment_id`와 향후 bridge의 `order_no`를 통해 UID를 연결할 수 있지만, 지금은 direct UID가 저장되지 않는다.
- `assessment_result_items`는 Worker의 일부 OMR 경로에서 저장되지만 `question_uid/source_question_uid` 필드가 없다. Student Portal OMR 경로는 이 테이블에 write하지 않는다.
- Wrong Clinic은 자체 `wrong_clinic_sets/set_items/distributions/packets/packet_items` flow를 가지고, 기존 권한을 재사용하지만 assignment-question bridge나 canonical UID를 native key로 사용하지 않는다.

### 4.4 상태 분류

| 흐름 | 판정 | 이유 |
|---|---|---|
| assignment create/read/update | COMPLETE EXISTING | route와 remote rows 확인 |
| roster snapshot/exclusion | COMPLETE EXISTING | table, API, effective recipient 확인 |
| Student Portal assignment/PDF | COMPLETE EXISTING | recipient/exclusion/ready guard 확인 |
| OMR/session/wrong answer | COMPLETE EXISTING | routes와 remote data 확인 |
| assignment ↔ final question UID | ABSENT | bridge table/route/payload 없음 |
| historical question exposure | PARTIAL | assignment/recipient는 있으나 UID bridge와 legacy coverage 없음 |
| result item ↔ UID | ABSENT/PARTIAL | result rows는 있으나 UID field 없음 |

## 5. Question Identity Audit

### 5.1 qid_v1 계산식

Worker `apmath/worker-backup/worker/routes/exams.js`와 local
`archive/question-identity.js`, identity map builder가 같은 논리식을 사용한다.

```text
questionUid =
  "qid_v1_" + SHA256(
    normalizeSourceFileForQuestionUid(sourceArchiveFile)
    + "#"
    + positive(sourceOrdinal)
  )
```

`archive/` 접두어·leading slash·backslash·NFC를 정규화하고 `exams/` wrapper를
논리적으로 맞추지만, 실제 파일명/path와 ordinal이 바뀌면 UID가 바뀐다.
content, choices, answer, solution, image, SVG, metadata만 바뀌면 UID는 유지된다.
앞에 문항을 삽입하거나 ordinal을 바꾸면 뒤의 UID도 바뀐다. 따라서 qid_v1은
콘텐츠 fingerprint가 아니라 source 위치 identity다.

### 5.2 local source/index/sidecar 결과

| 항목 | 결과 |
|---|---:|
| current `archive/db.js` exams | 462 |
| current source question records | 11,226 |
| current source files | 462 |
| current qid 계산 결과 | 11,226 unique, duplicate 0 |
| `question_identity_map.json` 전체 | 11,034 records / 454 files |
| production identity map | 11,026 records / 453 files |
| production sidecar coverage vs current source | 11,026 / 11,226 = 98.22% |
| sidecar formula mismatch | 0 |
| identity-map duplicate/failure | 0 / 0 |

sidecar보다 현재 source에 추가된 200 records/9 files는 모두
`original/high/h2`다. 현재 `Unit Past` runtime은 sidecar에 없는 record에 대해
qid fallback을 계산하지 않으므로 이 200개는 Unit Past에서 questionUid가 비어
있을 수 있다. 현재 source는 모두 parse되었고 production map에만 있는 8개는
test fixture라 current production index와의 누락으로 보지 않는다.

### 5.3 안정성 실험

identity-map source commit `685e00b44389099b7ff92f04f51caa12200387fd`와 현재
source를 겹치는 453 production file에 대해 비교했다.

- source fingerprint 변경: 362 records / 66 files
- 변경 field: content 30, choices 221, answer 208, solution 325, image 0
- content/choices가 같은 ordinal에서 바뀐 records: 250
- 이전 fingerprint가 다른 ordinal으로 이동한 사례: 0
- question count delta: 0
- parse failure: 0

250건은 same-position replacement/correction 여부를 fingerprint만으로 판정할
수 없다. qid는 유지되지만 논리 문항이 교체되었을 가능성이 있으므로 history
hard exclusion의 설명에는 이 risk를 남겨야 한다. path rename과 ordinal shift는
qid를 바꾸므로 legacy alias 정책 없이 조용히 merge하면 안 된다.

같은 source file의 같은 ordinal에 다른 문제를 넣는 same-position replacement도
qid 자체는 유지된다. 반대로 generator를 같은 입력으로 재실행하면 같은 qid가
재생성되는 deterministic 동작을 확인했다. 따라서 qid는 재현 가능한 key이지만,
문제 의미의 동일성이나 정답 이력의 의미까지 보증하지 않는다.

### 5.4 remote blueprint identity

remote `exam_blueprints`는 2,597 rows다.

- valid-shaped nonempty qid: 2,440
- blank UID/ordinal: 157
- invalid nonempty UID: 0
- global duplicate UID groups: 302, rows over unique 358, maximum 4 rows per UID
- duplicate는 여러 assignment/derived blueprint에서 같은 source question을 참조한 결과로 보이며, MIXED payload 내부 duplicate UID는 0이다.
- local identity map와 `source+ordinal`을 비교했을 때 UID mismatch는 0이다(같은 local key가 존재하는 범위).
- local map에 없는 remote source occurrence는 272개다. 12개 basename에 걸쳐, remote가 `exams/<basename>.js`로 flatten된 legacy path를 저장하고 local canonical path는 nested path인 경우다. 이는 alias identity mismatch이므로 자동 merge하지 않는다.

orphan check도 분리했다. 현재 local source에서 계산한 11,226 qid는 모두 현재
record에 귀속되어 orphan qid가 없고, duplicate도 없다. 반면 remote
`assessment_result_items`는 qid column 자체가 없어 qid orphan 여부를 계산할 수
없다. 그 테이블의 96행은 “orphan qid”가 아니라 현재 assignment id가 없는
orphan result row로 분류한다.

## 6. Assignment ↔ questionUid Gap

### 6.1 remote assignment 현황

| 범위 | assignment | 예상 문항 | UID가 현재 근거로 확인된 문항 | gap |
|---|---:|---:|---:|---:|
| normal archive-backed | 134 | 3,169 | 2,793 | 376 |
| MIXED | 28 | 969 | 614 | 355 |
| 합계 | 162 | 4,138 | 3,407 | 731 |

전체 현재 assignment question coverage는 3,407 / 4,138 = 82.3%이며, 731개
(17.7%)는 현재 자료만으로 final canonical UID를 확정할 수 없다.

normal 상세:

- 125 assignment rows는 `archive_file`과 blueprint가 match하고 question count도 일치했다.
- 9 assignment rows는 matching blueprint가 없으며 총 215문항이다.
- 7 assignment rows는 blueprint row는 있으나 canonical UID가 0건이며 총 161문항이다.
- 따라서 exact UID coverage는 118 rows / 2,793문항, incomplete는 16 rows / 376문항이다.

MIXED 상세:

- 28 payload 모두 JSON과 nonempty `questions` array는 유효했다.
- 21 assignments / 614 questions는 `meta.questionUids`와 각 question의 `questionUid/sourceOrdinal`이 확인됐다.
- 7 assignments / 355 questions는 오래된 payload라 UID/ordinal이 없다.
- 한 MIXED assignment 내부 duplicate UID는 0건이다.

### 6.2 필요한 additive bridge

계획 정본의 최소 bridge는 다음이다.

```text
class_exam_assignment_questions
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

`sub_unit_key`, `problem_type_key`, `metadata_revision`은 필요할 때 additive하게
추가한다. 이 테이블과 write/read route는 이번 감사에서 만들지 않았다. 먼저
normal blueprint, persisted MIXED payload, 신뢰 가능한 source+ordinal 순서로
backfill 후보를 만들고, 근거 부족은 `UNRESOLVED`로 남겨야 한다. 문제 번호만으로
UID를 추정하지 않는다.

## 7. Legacy History Coverage

### 7.1 recipient snapshot

remote D1 snapshot:

| 지표 | 값 | 판정 |
|---|---:|---|
| assignments | 162 | 구조적 coverage 162/162 |
| recipient rows | 970 | existing snapshot |
| exclusion rows | 93 | 25 assignments, 모두 reason `manual` |
| effective recipient rows | 877 | recipients − exclusions |
| distinct effective students | 115 | existing data 기준 |
| assignment with no recipient | 0 | 구조적 PASS |
| assignment with zero effective recipient | 0 | 구조적 PASS |

2026-08-19 migration boundary를 기준으로 scope를 분리하면 다음과 같다.

- pre-boundary 122 assignments / 695 recipient rows: migration 당시 roster backfill/inferred 구간 → `LEGACY_INFERRED`.
- post-boundary same-day 39 assignments / 267 recipient rows: assignment와 recipient가 같은 calendar day에 생성되어 operational timestamp가 구조적으로 확인되는 구간 → `VERIFIED` 계열.
- post-boundary delayed 1 assignment / 8 recipient rows: assignment가 2026-08-22이고 recipient가 2026-09-05에 생성되어 issue-time snapshot 증거가 없는 구간 → `UNRESOLVED`.

따라서 recipient 합계는 `695 + 267 + 8 = 970`이고, assignment 합계는
`122 + 39 + 1 = 162`다. pre-boundary inferred rows와 post-boundary delayed
rows를 하나의 숫자로 합쳐 표현하지 않는다.

그러므로 “모든 과거 학생 출제가 issue-time에 정확히 기록되었다”고 말할 수
없다. 현재 가능한 요약은 `VERIFIED`(구조적/동일일자 확인),
`LEGACY_INFERRED`(migration 당시 roster 추론), `UNRESOLVED`(시점 증거 부족)의
혼합이다.

### 7.2 legacy question coverage

- normal assignment에는 blueprint 부재 215문항과 blueprint UID blank 161문항이 있다.
- MIXED에는 legacy payload 355문항이 UID/ordinal 없이 저장되어 있다.
- remote blueprint 자체에도 blank identity 157행이 있다. 7개 archive file에 집중되어 있다.
- remote/local source path flattening 때문에 local identity map에 없는 272 occurrence가 있다. 같은 basename이라는 이유만으로 canonical UID를 대체하지 않는다.

### 7.3 OMR/result history reliability

- current `exam_sessions` denominator는 531 rows다. 이 중 result item이 있는 current session은 242, 없는 current session은 289이며 `242 + 289 = 531`이다.
- `assessment_result_items`가 참조하는 distinct session ID 전체는 246이다. 이 중 current `exam_sessions`에 존재하는 session은 242, current table에 없는 orphan result session은 4이며 `242 + 4 = 246`이다. 따라서 246을 current 531의 분모로 사용하지 않는다.
- current `exam_sessions`: 531 rows 중 488 rows가 nonblank `assignment_id`, 43 rows는 assignment id가 없다.
- 494 distinct session이 wrong answers를 가지고 있고, current wrong answer row가 session 없는 orphan은 0이었다.
- `assessment_result_items`: 5,910 rows 중 5,814 rows는 current `exam_sessions`에 연결되고, 96 rows는 orphan session에 연결된다. current-session result rows 중 5,814 rows는 current archive assignment 62개에 연결되지만 question UID field가 없다.
- orphan result rows 96개는 현재 존재하지 않는 assignment id 2개(4 orphan sessions)를 가리킨다. 이 4 orphan sessions는 current `exam_sessions` 531 rows에 포함되지 않는다.
- current session 기준 result item coverage는 242/531 with-result, 289/531 without-result다. result-session 전체 기준 246에는 별도의 orphan 4가 포함되므로, result item을 complete history authority로 사용할 수 없다는 결론은 유지된다.
- exclusion cleanup은 exam session/wrong answer를 정리하지만 result item cleanup은 구현되어 있지 않다. 현재 excluded student의 result item은 확인되지 않았지만 orphan result row가 이미 존재하므로 별도 reconciliation이 필요하다.

## 8. Taxonomy Inventory

### 8.1 archive catalog

local `archive/db.js`와 current question index 기준:

| 분류 | 시험 수 | 문항 수 |
|---|---:|---:|
| 전체 | 462 | 11,226 |
| 고1 | 141 | 3,216 |
| 고2 | 113 | 2,395 |
| 고3 | 0 | 0 |
| 중3 | 82 | 1,908 |
| 중2 | 65 | 1,764 |
| 중1 | 61 | 1,943 |
| original | 359 | 8,226 |
| similar | 54 | 1,259 |
| types | 49 | 1,741 |

contentType는 기출 359, 유형 100, 단원평가 3이고, examType는 final 196,
mid 220, blank 46이다. 모든 462 exam에 `courseRanges`와 start/end가 있으나
`primaryStandardCourse`는 37건이 blank이고, 여러 course range를 가진 mixed-course
exam은 49건이다.

course code는 고등 자료에서 H15/H22가 섞여 있다. audit inventory는 H15 only
138 exams, H22 only 113 exams, H15/H22 mixed 5 exams, M1/M2/M3 unresolved
206 exams였다. 즉 strict course family가 해석 가능한 256/462 = 55.4%이고,
중등 206/462 = 44.6%는 정식 curriculum crosswalk가 아직 unresolved다.
H22 only 중 고1 65, 고2 46, 중등 H22 2건이 포함된다. 따라서 파일 grade와
단원 course를 동일 개념으로 취급하면 안 된다.

`original/high/h3/` 물리 source scope는 현재 0개이며, 현재 HIGH profile은 h1/h2와
m1/m2/m3다. Unit Past profile과 sidecar를 대조한 실제 grade mismatch는 0건이었다.
즉 고2 시험 안에 하위 단원이 들어 있어도 `sourcePrefix`/`isInScope`가 파일의
시험 grade를 고1 pool로 내리는 계약은 아니며, 이 HARD fence는 실제 core에서
확인된다. 다만 이 fence는 curriculum crosswalk가 완성되었다는 뜻은 아니다.

### 8.2 index/metadata completeness

| 지표 | 값 |
|---|---:|
| valid official `standardUnitKey` | 11,132 |
| invalid `standardUnitKey` | 94 / 21 distinct values |
| missing `level` | 344 |
| missing raw `standardCourse` | 12 |
| missing id/content/choices/unit | 0 |
| distinct standardUnitKey | 129 |
| distinct standardUnit | 113 |
| distinct course | 17 |
| distinct subUnitKey | 278 |

legacy level normalization은 하 2,185 / 중 6,156 / 상 2,487 / 미분류 398이다.
`question_metadata` production 11,034 records에는 UID/source/ordinal과
standardUnitKey/subUnitKey가 있으나 standardCourse 12건, difficulty 344건이
비어 있다. `problemType`/template은 11건만 존재하고 11,023건은 explicit hold로
남아 있다. sidecar 상태는 `approved_partial_with_explicit_holds`를 유지해야
하며 이를 완전 승인 metadata로 표현하지 않는다.

### 8.3 existing profile asset

Unit Past runtime의 기존 profile은 실제 운영 중인 taxonomy asset이다.

| profile | files | questions | current sourcePrefix |
|---|---:|---:|---|
| h1 | 112 | 2,478 | `original/high/h1/` |
| h2 | 86 | 1,915 | `original/high/h2/` |
| m1 | 31 | 737 | `original/middle/m1/` |
| m2 | 61 | 1,450 | `original/middle/m2/` |
| m3 | 69 | 1,646 | `original/middle/m3/` |

기존 code에는 `HIGH1_DIRECT_KEY_MAP` 22개, raw map 8개, override 1개와
`HIGH2_DIRECT_KEY_MAP` 42개, raw map 14개, override 26개가 있다. 이는 버릴
분류표가 아니라 formal crosswalk로 승격해야 하는 운영 자산이다.

## 9. Mixer vs Unit Past Inventory

| 기능 | Mixer | Unit Past | Shared 가능 여부 | 신규 구현 필요 여부 |
|---|---|---|---|---|
| 단원 범위 | cart와 advanced selector | profile + `selectByBlueprint` | 공통 candidate/unit key layer 가능 | Unit Past multi-unit UI 필요 |
| 난이도 | selector hard/soft difficulty | config의 legacy level display 및 adjacent fallback | canonical difficulty adapter 연결 가능 | set-level parity 연결 필요 |
| 학교 | include/exclude school filter | collection school grouping/filter | 공통 metadata filter 가능 | 없음(계약 통합만) |
| 연도 | yearFrom/yearTo/exclude year | exact/recent/range collection year | 공통 year normalization 가능 | 없음(계약 통합만) |
| 시험축 | 전용 hard gate는 확인되지 않음; source metadata 사용 | semester/examType/period filter | 공통 exam-axis field 가능 | Mixer 전용 축 filter는 필요 시 추가 |
| 태그 | `tagsAll` hard filter | dedicated tag control 없음 | metadata predicate 재사용 가능 | Unit Past UI 연결 필요 |
| blueprint | candidate evaluate/select/validate | advanced blueprint rows와 `selectByBlueprint` | selector contract 일부 공유 가능 | Unit Past set-level validator 통합 필요 |
| problem type | hard filter/soft score | metadata join은 있으나 전용 control 없음 | 공통 type key predicate 가능 | Unit Past control/hold 정책 필요 |
| source diversity | source diversity score/constraint | source group split은 있으나 선택 constraint 아님 | source count helper 재사용 가능 | Unit Past quota 연결 필요 |
| template limit | `maxTemplateCount` validate | 없음 | `templateKey` validator 재사용 가능 | Unit Past 옵션은 신규 |
| essay quota | `essayCount` validate | 없음 | essay predicate 재사용 가능 | Unit Past 옵션은 신규 |
| recent/excluded UID | `recentUids` option hook | server history query 없음 | UID Set contract 공유 가능 | bridge + history batch query 필요 |
| pin/rebuild | `pinnedKeys`, auto-generate/rebuild | replacement/undo만 존재 | identity set helper 공유 가능 | series persistence는 신규 |
| shortage diagnostics | selector validation/report | shortage와 adjacent difficulty 표시 | report shape 공유 가능 | multi-unit/학생 history 원인 분리 필요 |
| replacement | candidate scoring 일부 | candidate panel/replace/undo | candidate/UID exclusion 공유 가능 | Studio inspector 통합 필요 |
| header edit | mixed runtime options | parent→iframe path 존재하지만 live stale | print header contract 공유 가능 | Unit Past propagation fix 필요 |
| mixed output | existing mixed handoff | existing mixed handoff | `mixedQuestions_*`/`mixedMeta_*` 재사용 | UID payload parity 보강 필요 |
| student assignment | assignment integration path | index target panel + assignment POST | 기존 assignment API 재사용 | assignment id/UID bridge 연결 필요 |

중요한 구조적 차이는 Mixer가 source file을 `new Function('window','document',
source)`로 격리하지만 Unit Past가 top-level `const/let`을 가진 여러 source를
global script로 순차 삽입한다는 점이다. Studio가 다중 source/multi-unit으로
확장되기 전에 이 loader 차이를 해소해야 한다.

## 10. Performance Baseline

측정값은 2026-09-16 Chrome extension profile, GitHub Pages, viewport 914×827에서
수집한 CUA wall-clock 관측치다. 값에는 UI action과 의도적 1~2초 render wait가
포함될 수 있으므로 순수 JS/네트워크 latency나 cold-cache SLA로 해석하지 않는다.

| 시나리오 | 관측값 | 결과 |
|---|---:|---|
| Archive Finder warm reload | return 335ms, ready 442ms | 5 featured cards |
| Finder search `금당고` | filter 130ms | 31개 자료 |
| Finder metadata filtering | 별도 측정값 없음 | 현재 `archive/index.html`은 `question-index.js`/`question_metadata`를 로드하지 않고 `engineDB.exams`를 scan/filter하므로, 위 130ms는 question-level metadata filtering 비용이 아님 |
| Unit Past warm reload | return 335~521ms, ready 240~442ms | h1 catalog 2,478문항 / 18 units |
| Unit Past 첫 profile→config | 2,137ms | config rows 3, subunit chips 6 |
| 난이도 상 availability 갱신 | 3,119ms | 6문항으로 shortage 표시 |
| h1 50문항 selection→confirmation | 3,126ms | 50문항 / 21 source exams |
| single-source 15문항 handoff | 1,207ms | mixed popup 생성 |
| existing mixed render | 1,815ms 관측 후 | 16 q boxes / 4 pages |
| normal exam initial render | 약 1.8s 관측 후 | 21문항 / 6 pages |
| normal solution mode | 4,766ms wall-clock | 24 solution blocks / 13 SVG images |
| normal answer mode | 4,267ms wall-clock | 21 answer entries / 1 page |
| replacement panel open | 636ms | candidate total 210 |
| replace 후 panel 재표시 | 816ms | undo enabled; undo 후 원문 복귀 |
| school/year collection config | 800ms | 2025 2학기 기말 조건 |
| school/year preview→confirmation | 1,258ms | 3 papers / first 3문항 |

50문항 h1 preview는 shortage 완화(인접 난이도 허용)까지의 selection은
정상이나, 21개 source를 embedded preview로 로드하는 단계에서
`original/high/h1/1mid/23_부영여고_1학기_중간_고1_기출.js에서 문항 배열을 찾지
못했습니다.`가 발생했다. 이는 성능 숫자가 아니라 multi-source loader
정확성 실패다. 별도의 true cold-cache, network throttling, API p95, memory,
CLS/LCP/INP 측정은 Phase 1 performance gate로 남긴다.

## 11. Existing Feature Regression Baseline

### 11.1 정적·단위·계약 테스트

선정한 관련 테스트 25개 중 21개가 PASS, 4개가 FAIL이었다.

PASS로 확인된 범위:

- qid runtime/contract/collision/canonical propagation
- Mixer selector contract
- Unit Past core 13/13, UI runtime, collection, browser QA contract
- blueprint metadata/mixed identity bridge contract
- assignment identity, recipients, target selection, title display, shared teacher board
- student portal mixed review/OMR history/wrong clinic hotfix
- exam PDF artifact contract, assessment result item storage contract
- 관련 JS syntax check (`unit-past-exams*`, `mixer-selector`, Worker index/routes)

FAIL 4건은 다음과 같으며 이 감사에서 수정하지 않았다.

| 테스트 | 실패 이유 | 판단 |
|---|---|---|
| `archive-question-metadata-consistency.test.mjs` | 기대하는 `archive/exams/test-fixtures/render-authority-golden.js` fixture 부재 | 저장소 fixture gap |
| `archive-unit-past-exams-ui.test.js` | test가 `unit-past-exams.css?v=20260827e`를 기대하지만 현재 HTML은 `v=20260915f` | test/version drift |
| `archive-baseline-reconciliation-v1.test.mjs` | 생성 산출물 `archive/_generated/intelligence/phase2/archive-classification/archive-hierarchical-classification-v1.json` 부재 | generated artifact gap |
| `archive-complete-subunit-operational-qa-v1.test.mjs` | 생성 산출물 `archive/_generated/intelligence/phase3/complete-subunit-classification/archive-complete-subunit-operational-qa-v1.json` 부재 | generated artifact gap |

`npm run check`의 node syntax 단계는 PASS했지만 Wrangler dry-run은 Worker
`node_modules`에 `@cloudflare/puppeteer`가 없어 resolve하지 못했다. 의존성을
설치하거나 파일을 변경하지 않고 이 상태를 local validation blocker로 기록한다.

### 11.2 실제 브라우저 회귀

| 기능 | 상태 | Authority / 주요 함수·API / 증거 |
|---|---|---|
| 원본 시험지 열기 | PASS | `archive/index.html` → normal `engine.html`; 21문항/6 pages direct render |
| 일반 문제 출력 | PASS | `archive/engine.html` normal mode; image complete, MathJax 158, overflow/render error 없음 |
| 해설 출력 | PASS | `archive/engine.html` solution mode; 24 solution blocks, 13 SVG natural size 정상, MathJax 667 |
| 정답표 | PASS | `archive/engine.html` answer mode; 21 answer entries, 1 page, overflow/error 없음 |
| mixed output | PASS | `archive/mixed_engine.html`, `mixedQuestions_*`/`mixedMeta_*`; 16 q boxes/4 pages |
| Unit Past single mode | PASS | `unit-past-exams.js` paper restore/handoff; single-source 15문항 mixed popup 정상 |
| 학교·연도 지정 | PASS | `unit-past-exams-core.js` collection/year filter; 2025 exact semester/final 조건과 3 papers |
| 문항 교체 | PASS | `unit-past-exams.js` edit/candidate/replace path; candidate total 210 |
| undo | PASS | Unit Past replacement undo path; replace 후 undo로 original identity 복귀 |
| 헤더 수정 | FAIL/REVIEW | `updatePrintHeaderOption` → iframe `setPrintHeaderOptions`; parent input은 바뀌었으나 250ms 및 1.3s 후 iframe heading은 old title |
| 학생에게 출제 | NOT RUN | `archive/index.html` `registerIndexClassExamAssignment` → `POST /class-exam-assignments`; 외부 상태 변경 방지를 위해 submit 미실행 |
| 반 선택 | STATIC PASS / LIVE NOT RUN | target panel의 `GET /qr-classes`/roster와 `assignTargetSubmit`; 실제 write는 실행하지 않음 |
| 개별 학생 제외 | CODE PASS / LIVE NOT RUN | Worker `performExcludeStudent`, `/class-exam-assignments/exclude-student(s)`; state mutation 미실행 |
| PDF 생성/고정 | PARTIAL | `exam-pdf.js` `ensureAssignmentPdf`, assignment PDF/R2; ready 36/162, pending 125, failed 1 |
| 학생 시험 목록 노출 | STRUCTURAL PASS | Student Portal `loadStudentClassExamAssignments`; recipient−exclusion join 확인, live student token 미실행 |
| 학생 OMR | CODE/CONTRACT PASS | Student Portal OMR submit route; token/recipient/exclusion/session/wrong path 확인, live submit 미실행 |
| 교사 Bulk OMR | CODE/CONTRACT PASS | Worker `bulk-omr`/PATCH; class/student authority, score/session/wrong path 확인 |
| 점수 계산 | CODE PASS | teacher/student OMR routes의 score 계산과 `exam_sessions` upsert path; remote session data 존재 |
| `wrong_answers` | PASS | OMR delete/insert path; current session 없는 orphan wrong row 0 |
| Wrong Clinic | CODE/CONTRACT PASS | `routes/wrong-clinics.js` set/packet/review routes; own tables와 권한 검증 확인 |
| Archive Finder | PASS | `archive/index.html` + `db.js`; featured cards와 `금당고` 검색 31개 |

단일 source의 교체 기능이 정상이라는 사실을 다중 source preview 정상의
근거로 확대하지 않는다. 또한 assignment write를 실행하지 않았으므로 실제
학생에게 출제되는 end-to-end submit PASS를 주장하지 않는다.

## 12. docs vs actual differences

### 12.1 정본 문서와 실제의 차이

| 문서/주제 | 문서의 기존 표현 | 실제 증거 | 처리 |
|---|---|---|---|
| `CONTRACTS.md` 19.1 | compatibility identity에 unique/upsert defense가 있는 것처럼 읽힘 | remote D1에서 partial unique index 미확인, 논리 archive duplicate 9 groups | 문구를 logical lookup/upsert와 DB seal로 분리하고 Phase 1 조건 추가 |
| `STUDIO_PLAN.md` 10.6 | class/date/archive 기반 upsert/unique defense 존재 | route lookup은 있으나 DB partial unique와 legacy duplicate가 남음 | 같은 caveat를 추가해 parity 유지 |
| `MASTERPLAN.md` 배포 parity | backup과 deployed revision exact parity는 별도 확인 필요 | version에 commit metadata 없음; 시간상 55초 정렬만 확인 | 기존 보수적 문구 유지, 이 문서에서 `UNPROVEN_BYTEWISE`로 확정 |
| qid/index | qid 계약은 존재 | current `question-index.js` 자체에는 qid field 없음; sidecar missing 200 h2 records | 계획 변경 없음; implementation gap으로 기록 |
| legacy history | `VERIFIED/LEGACY_INFERRED/UNRESOLVED` 분류 정의 | 122 pre-boundary assignments와 1 delayed post-boundary assignment 확인 | 실제 coverage를 계획 문구보다 엄격하게 기록 |
| assignment-question bridge | 신규 핵심 bridge 후보 | remote table/route/payload field 없음 | 신규 구현으로 분리; 이번 작업에서 변경하지 않음 |
| remote schema | source `schema.sql`을 Worker authority로 간주할 위험 | deployed `exam_sessions.assignment_id/meta`, snapshots가 source ledger와 다름 | schema drift를 Phase 1 entry condition으로 기록 |
| history/result | result items table 존재 | current sessions 531 = 242 with-result + 289 without-result; result-session IDs 246 = current 242 + orphan 4; result rows 5,910 = current-session 5,814 + orphan 96; UID column 없음 | complete history authority로 승격하지 않음 |
| PDF | pipeline은 existing | 162 assignment 중 ready 36, pending 125, failed 1 | pipeline reuse는 existing, universal readiness는 아님 |

이번 문서 커밋에서 수정한 기존 canonical 문서는 `CONTRACTS.md`와
`STUDIO_PLAN.md`의 위 두 caveat뿐이다. `MASTERPLAN`, `TAXONOMY`의 normative
계약을 실제 미구현 기능에 맞춰 축소하지 않았다.

### 12.2 source/deployed schema drift

`apmath/worker-backup/worker/schema.sql`의 `exam_sessions`는 기본 fields만
기록하지만 remote deployed table에는 `assignment_id`, `pack_id`, `result_hash`,
`analysis_status`가 있다. 저장소 migration ledger에는 실제 remote에 존재하는
recipients/exclusions/mixed/PDF/session 확장을 모두 완전하게 열거하지 않는다.
`assessment_analysis_snapshots`와 `assessment_report_snapshots`도 remote에는
table이 있으나 source schema와 row 모두 현재 canonical archive flow에 연결되어
있지 않다. 이 차이는 이번 작업에서 schema를 맞추지 않고 evidence로 봉인한다.

## 13. true new implementation

아래는 실제 코드에서 아직 완성되지 않은 새 구현 범위다. 모두 Archive 2.0
계획의 새 작업으로 분리하며, Phase 0에서는 구현하지 않았다.

1. `class_exam_assignment_questions` additive migration과 `(assignment_id, order_no)` / question UID parity.
2. normal blueprint와 persisted MIXED payload를 bridge row로 freeze/upsert하는 server write path.
3. bridge를 이용한 student history batch query와 effective recipient별 exclusion 계산.
4. assignment create 응답의 `assignment.id`를 보존하고 후속 exclusion/조회에 `assignment_id`를 우선 사용하는 client hardening.
5. 4,138 current assignment question 중 731 gap에 대한 legacy backfill report와 `VERIFIED/LEGACY_INFERRED/UNRESOLVED` 표시.
6. flattened source path 272 occurrence와 blueprint blank/legacy payload를 위한 명시적 alias/reconciliation policy.
7. result/wrong-answer의 order no를 bridge UID로 해석하는 연결 layer; result item 자체의 UID 필요 여부는 별도 계약 검토.
8. Unit Past multi-unit/series/student-history Studio flow와 Mixer/Unit Past set-level selector 공유.
9. Unit Past multi-source isolated loader 및 embedded header propagation fix.
10. formal curriculum/effectiveBrowseGrade/sourceGrade crosswalk과 94 invalid unit key, 344 missing level, 398 unclassified difficulty를 다루는 taxonomy hard gate.
11. qid_v2는 현재 구현되지 않았지만, qid_v1 경로/ordinal 변경 시 migration/alias가 필요한 별도 future contract다. qid_v2를 Phase 0에서 발명하지 않는다.

## 14. reuse existing

| 새 요구 | 반드시 재사용할 것 |
|---|---|
| assignment identity | `class_exam_assignments.id`, existing route lookup/update |
| 대상 학생 | recipients snapshot, exclusions, existing class/student authorization |
| student history basis | recipients − exclusions + bridge rows; student×question ledger 신설 금지 |
| normal identity source | `exam_blueprints.source_question_uid/source_question_ordinal` |
| MIXED identity/content | `mixed_payload_json`, `mixedMeta_*`, existing question snapshot |
| output | `engine.html`, `mixed_engine.html`, existing print/solution/answer/render modules |
| selection | `unit-past-exams-core.js`의 profile/selection, `mixer-selector.js`의 deterministic validation |
| replacement | Unit Past의 existing candidate/replace/undo surface |
| PDF | `exam-pdf.js`, existing assignment PDF columns/R2 artifact |
| OMR/wrong answer | existing `exam_sessions`, `wrong_answers`, student/teacher OMR routes |
| Wrong Clinic | existing packet/set/distribution/review routes and permission checks |
| auth | `canAccessClass`, `canAccessStudent`, teacher/admin/session guards |

재사용의 의미는 현재 모든 경로가 이미 완전하다는 뜻이 아니다. 예를 들어
assignment id를 client가 보존하지 않는 문제, Unit Past loader 충돌, remote/source
schema drift는 기존 Authority를 유지한 채 hardening해야 한다.

## 15. Phase 1 entry conditions

### 15.1 Phase 0 결과

Phase 0 문서 봉인과 baseline 감사는 완료할 수 있다. 그러나 학생 대상
history exclusion이나 bridge를 production ON할 준비가 끝났다는 뜻은 아니다.

판정:

```text
Phase 0 document/audit: COMPLETE
Phase 1A design + read-only reconciliation: READY TO START
Phase 1B student-facing bridge/history rollout: NOT READY
```

### 15.2 Phase 1A 진입 조건

Phase 1A는 read-only reconciliation과 bridge 설계를 수행하는 단계다. Phase 1A를
시작하려면 아래의 baseline과 policy가 이미 확보되어 있어야 한다.

- audit base HEAD, Phase 0 seal commit, current verified documentation HEAD가 분리 기록되어 있어야 한다.
- qid_v1 source path normalization과 sourceOrdinal 의미가 계약으로 확정되어 있어야 한다. qid_v2는 이 단계의 전제가 아니다.
- identity policy가 UID 기준이고, metadata/unit 재분류가 history correctness를 바꾸지 않는다는 원칙이 확정되어 있어야 한다.
- 현재 known-gap inventory가 denominator와 함께 확보되어 있어야 한다: assignment question 4,138/UID 확인 3,407/gap 731, recipient 695/267/8, result session 242/289/4, sidecar/blueprint/path gap, duplicate 및 schema drift.
- 기존 assignment, recipients, exclusions, OMR, wrong answer, PDF, mixed snapshot의 Authority mapping이 고정되어 있어야 한다.
- Phase 1A는 별도 student exposure ledger나 새 assignment subsystem을 전제로 하지 않아야 한다.

### 15.3 Phase 1A — read-only reconciliation + bridge design/fixture

Phase 1A에서 수행할 작업은 다음과 같다. 이 단계는 student-facing rollout이
아니며, 대상 학생에게 출제하거나 remote production data를 쓰지 않는다.

1. normal blueprint와 persisted MIXED payload를 assignment/order 기준으로 read-only candidate report에 모은다.
2. `VERIFIED`, `LEGACY_INFERRED`, `UNRESOLVED`를 유지한 채 `class_exam_assignment_questions`의 최소 필드·키·source priority를 설계한다.
3. `candidateQuestionUids`와 student IDs를 이용한 batch history query 계약과 UID intersection fixture를 만든다. `unit_keys`는 hint/diagnostic일 뿐 correctness filter가 아니다.
4. `(assignment_id, order_no)` parity, assignment/question UID uniqueness, normal/MIXED freeze source, retry/upsert idempotency의 fixture를 설계한다.
5. remote logical assignment duplicate, source/deployed schema drift, legacy alias와 blank identity를 reconciliation report로 분리한다.
6. N+1 없는 batch query plan과 기존 `canAccessStudentsBatch` 또는 동등 권한 검증을 fixture에 포함한다.

### 15.4 Phase 1B student-facing rollout HARD Gate

Phase 1A 결과를 production student-facing 흐름에 연결하는 것은 아래 HARD
Gate가 모두 PASS한 뒤에만 가능하다. 아래 항목은 Phase 1A의 진입 조건이 아니라
Phase 1B rollout 조건이다.

- **bridge parity**: `question_count == class_exam_assignment_questions row count == final UID count`, UID unique, normal/MIXED snapshot과 최종 paper가 일치
- **retry/idempotency**: 동일 assignment create/update/retry와 question write가 `(assignment_id, order_no)` 중복을 만들지 않으며 `assignment_batch_id`를 row identity로 사용하지 않음
- **legacy coverage**: 모든 반환 history가 `VERIFIED / LEGACY_INFERRED / UNRESOLVED` 상태를 보존하고, unresolved를 조용히 verified/complete로 승격하지 않음
- **schema drift**: deployed `exam_sessions`/assessment snapshot과 source schema/migration ledger의 차이가 운영 가능한 migration/documentation 상태로 정리됨
- **critical runtime fixes**: Unit Past multi-source loader isolation과 embedded header propagation이 실제 브라우저에서 PASS
- **regression**: normal 문제지/해설/정답, MIXED, Unit Past single, school/year, replacement/undo, header, assignment target/exclusion, PDF, Student Portal, OMR, score, wrong_answers, Wrong Clinic 및 관련 test suite가 승인된 기준으로 PASS

추가로 PDF pending/failed 처리, cold-cache/API performance budget, 권한 경계도
rollout 승인 기록에 포함해야 한다.

### 15.5 권장 순서

1. Phase 1A 진입 조건을 확인한다.
2. Phase 1A에서 read-only reconciliation, UID intersection contract, bridge design/fixture를 완료한다.
3. Phase 1B HARD Gate를 승인된 검증 환경에서 검증한다.
4. 그 후에만 student history batch query와 Studio UI를 연결한다.
5. 마지막으로 실제 assignment write를 별도 승인된 환경에서 수행하고, main에는 장기 branch를 merge하지 않는다.

Phase 1의 첫 구현은 “새 assignment 제품”이 아니라 기존 assignment와 canonical
questionUid를 연결하는 최소 bridge여야 한다.
