# AP Math JS Archive Intelligence — Phase 0~5 구현 세부계획서

> **Historical snapshot notice (2026-08-22):** This implementation plan preserves the
> pre-production design and baseline. The current applied scope and gates are recorded in
> `archive/_generated/intelligence/phase3/complete-subunit-classification/archive-complete-subunit-operational-qa-v1.json`
> and the active contract in `docs/rules/JS아카이브_세부단원_운영규칙_v1.md`.

- 작성일: 2026-08-19
- 기준 브랜치: `main`
- 문서 위치: `archive/archive/docs/ARCHIVE_INTELLIGENCE_PHASE0_5_IMPLEMENTATION_PLAN.md`
- 대상 범위: JS Archive / Mixer / Mixed Engine / APMS 시험·OMR·오답 흐름
- 상태: IMPLEMENTATION PLAN

---

## 0. 문서 목적

이 문서는 현재 AP Math JS Archive의 실제 코드 구조를 유지하면서 다음 목표를 구현하기 위한 실행 계획서다.

1. 문항 식별자 무결성 확보
2. 교육과정 TREE와 세부 문항 메타데이터 정착
3. Archive 메타데이터와 APMS/D1의 안정적 동기화
4. 기존 Mixer의 자동출제를 Intelligence Selection으로 고도화
5. 실제 학교 기출 기반 School Fingerprint 생성
6. 기존 오답 클리닉을 Concept Weakness 기반 추천 엔진으로 확장

핵심 원칙은 **새 엔진을 중복 개발하지 않는다**는 것이다.

현재 이미 존재하는 다음 흐름을 유지하고 확장한다.

```text
archive/exams/*.js
        ↓
question-index.js
        ↓
mixer.html
        ↓
mixed_engine.html / engine.html
        ↓
class_exam_assignments / exam_blueprints
        ↓
exam_sessions / wrong_answers
        ↓
clinic-print.js / wrong_print_engine.html
```

이 프로젝트의 목표는 위 흐름을 갈아엎는 것이 아니라, **하나의 신뢰 가능한 문항 Intelligence 계층을 전체 파이프라인에 관통시키는 것**이다.

---

# 1. 현재 코드 기준 확인된 기반

## 1.1 Archive 출력 엔진

`archive/engine.html`

현재 역할:

- 단일 시험지 데이터 로드
- 시험지 / 해설지 / 정답표 렌더링
- MathJax 처리
- 출력 헤더 편집
- QR 출력
- APMS 제출 연동
- 안전한 archive script path 검증

### 정책

`engine.html`은 **출력 실행기**로 유지한다.

Intelligence Selection, School Fingerprint, Weakness 계산 로직을 `engine.html`에 넣지 않는다.

```text
Mixer = 무엇을 출제할지 결정
Engine = 결정된 문항을 정확히 출력
```

이 책임 분리를 유지한다.

---

## 1.2 Mixer

`archive/mixer.html`

현재 이미 존재하는 기능:

- 전체 Archive 문항 검색
- 현재 시험지 범위 검색
- 학년 필터
- 과목 필터
- 시작 단원 / 끝 단원 필터
- 난이도 필터
- 학교 필터
- 연도 필터
- 시험축 필터
- 태그 필터
- 카트 포함/미포함 필터
- 문항 pin
- 카트 rebuild
- 난도별 자동출제
- Blueprint 행 기반 자동출제
- 부족 문항 리포트
- 출력 전 검토

따라서 Phase 3은 신규 `Mixer 2.0` 개발이 아니다.

**현재 Mixer의 선택 알고리즘을 고도화하는 작업**으로 정의한다.

---

## 1.3 Question Index

기준 파일:

- `archive/tools/build-question-index.mjs`
- `archive/question-index.js`
- `archive/question-index-audit.md`

2026-08-18 감사 기준:

- Git tracked 시험지 JS: 432파일
- 원본 문항: 10,552문항
- 최종 index: 10,528문항
- qKey 중복 그룹: 24
- 중복으로 제외된 레코드: 24
- 공식 Master Key: 142
- 비공식 standard key: 249건
- RAW 계열: 217건

현재 인덱스는 검색 기반으로 충분히 크지만, **영구 문항 Identity로 사용하기 전 데이터 정합성 정리가 필요하다.**

---

## 1.4 Curriculum / Concept 기반

기준 파일:

- `archive/concept_map.js`
- `archive/archive/docs/CURRICULUM_TAG_MASTER_TABLE_RULEBOOK.md`
- `archive/archive/docs/JS_ARCHIVE_TAG_ENRICHMENT_RULEBOOK.md`

이미 다음 hierarchy 정책이 존재한다.

```text
standardUnitKey
→ subUnitKey
→ conceptClusterKey
→ problemTypeKey
→ templateKey
```

또한 생산용 master table 권장 위치도 이미 정의되어 있다.

```text
archive/data/master_tables/js_archive_tag_master.json
archive/data/master_tables/js_archive_tag_master.schema.json
```

새 계획은 이 규칙을 변경하지 않고 실제 런타임에 적용한다.

---

## 1.5 Tag Enrichment 기반

`archive/tools/tag-enrichment/`

현재 생성 후보:

- `subUnitKey`
- `subUnit`
- `conceptClusterKey`
- `problemTypeKey`
- `templateKey`
- `difficultyBucket`
- `tagConfidence`
- `tagStatus`

현재 상태는 **review-only candidate**다.

즉 Phase 1B의 핵심은 새 분류기 개발이 아니라:

```text
Candidate
→ Validate
→ Review
→ Approved Metadata
→ Runtime Index
```

로 승격하는 것이다.

---

## 1.6 APMS 시험·오답 기반

관련 핵심 테이블:

- `class_exam_assignments`
- `exam_blueprints`
- `exam_sessions`
- `wrong_answers`
- `exam_question_reviews`

현재 `exam_blueprints`는 최소 다음 정보를 가진다.

```text
archive_file
question_no
source_archive_file
source_question_no
standard_unit_key
standard_unit
standard_course
concept_cluster_key
```

`routes/exams.js`에는 이미 확장 필드 대응 코드가 있다.

```text
BLUEPRINT_META_COLUMNS
- assessment_pack_id
- type_key
- difficulty
```

또한 `assessment_result_items`가 존재할 경우 전체 문항의 correct/wrong 결과를 저장하는 코드도 이미 준비되어 있다.

따라서 Phase 5는 오답 시스템을 새로 만드는 작업이 아니라, **현재 결과 저장 기반에 더 정밀한 문항 metadata를 연결하는 작업**이다.

---

# 2. 프로젝트 전체 원칙

## 2.1 Source of Truth

시험 문항 원본은 계속 다음이다.

```text
archive/exams/**/*.js
archive/assets/**
```

원본 JS는 문제 내용의 Canonical Source다.

Intelligence 데이터를 만들기 위해 원본 문항을 임의 재작성하지 않는다.

---

## 2.2 보호 필드

별도 작업 지시가 없는 한 다음 필드는 Intelligence 작업으로 수정하지 않는다.

- `id`
- 문항 순서
- `content`
- `choices`
- `answer`
- `solution`
- `image`
- `layoutTag`
- `wide`
- 기존 source identity

Metadata 확장은 sidecar/index 우선이다.

---

## 2.3 새 시스템보다 기존 시스템 확장

금지:

- 새 출력 engine 제작
- 새 Mixer 페이지 별도 제작
- 새 오답 시스템 병렬 제작
- Archive 전체를 D1로 강제 migration
- 기존 JS 제거 후 DB-only 구조 전환

허용:

- question index 확장
- sidecar metadata 추가
- D1 blueprint 확장
- 기존 Mixer filter/selector 확장
- 기존 Wrong Clinic aggregation 확장

---

## 2.4 AI 사용 원칙

Phase 0~5 핵심 로직은 규칙 기반으로 구축한다.

AI가 필수인 영역:

- metadata candidate 생성 보조
- ambiguity review 보조

AI가 결정권을 가지면 안 되는 영역:

- Canonical UID
- source identity
- 시험지 문항 선택의 필수 제약
- 오답 결과 계산
- School Fingerprint 원시 통계

---

# 3. 목표 아키텍처

```text
                 VERIFIED JS ARCHIVE
                         │
                  exams/*.js
                  assets/**
                         │
                         ▼
                Question Indexer
                         │
          ┌──────────────┴──────────────┐
          │                             │
          ▼                             ▼
  Canonical Identity               Metadata
          │                        Master Table
          │                        TREE
          │                        SubUnit
          │                        Concept
          │                        ProblemType
          │                        Template
          │                        Difficulty
          │                             │
          └──────────────┬──────────────┘
                         ▼
                 QUESTION INDEX vNext
                         │
          ┌──────────────┼──────────────┐
          │              │              │
          ▼              ▼              ▼
        Mixer      School Profile    APMS Bridge
          │                             │
          ▼                             ▼
     Mixed Engine                 exam_blueprints
          │                             │
          ▼                             ▼
       QR / OMR                  exam_sessions
                                        │
                                        ▼
                                   result items
                                   wrong_answers
                                        │
                                        ▼
                                  Weakness Engine
                                        │
                                        └────→ Mixer preset
```

---

# 4. Phase 0 — Canonical Identity / Inventory 안정화

## 4.1 목표

모든 문항이 **원본 위치까지 역추적 가능한 하나의 안정적 UID**를 가지도록 한다.

현재 `sourceFile_id` qKey는 검색용으로는 동작하지만 영구 UID로 사용하기에는 충돌 사례가 존재한다.

---

## 4.2 Phase 0A — Inventory Snapshot

### 작업

1. `build-question-index.mjs` 기준 전체 문항 재수집
2. 다음 snapshot 생성

```text
total_exam_files
total_questions
qkey_duplicate_groups
invalid_standard_keys
raw_keys
missing_source_file
missing_question_id
missing_answer
missing_standard_unit
```

3. 현재 수치를 baseline JSON으로 저장

권장 출력:

```text
archive/_generated/intelligence/phase0/inventory-baseline.json
```

### PASS

- 같은 git commit에서 재실행 시 동일 결과
- 파일별 문항 수 합계 = inventory total
- 숨겨진 skip 없이 모든 제외 사유 기록

---

## 4.3 Phase 0B — 24개 qKey 충돌 전수 분류

각 충돌을 다음 유형으로 분류한다.

```text
A. 완전 중복 레코드
B. 같은 파일 + 같은 id + 다른 실제 문항
C. generated/type bank 내부 반복
D. source parsing 오류
E. legacy 구조 오류
```

### 원칙

내용이 다른 별개 문항을 하나 버리고 PASS 처리하지 않는다.

현재 index가 중복 qKey를 제거해 10,528개만 남기더라도 Canonical Inventory는 10,552문항 전체를 식별 가능해야 한다.

### 산출물

```text
archive/_generated/intelligence/phase0/qkey-collision-review.json
```

필수 필드:

```json
{
  "sourceFile": "...",
  "legacyQKey": "...",
  "sourceOrdinal": 12,
  "questionId": "12",
  "collisionType": "B",
  "resolution": "canonical_uid_only",
  "notes": ""
}
```

---

## 4.4 Phase 0C — Canonical UID 계약

### 기존 값 유지

`legacyQKey`는 제거하지 않는다.

### 신규 Canonical Identity

권장 logical identity tuple:

```text
sourceArchiveFile
sourceOrdinal
legacyQuestionNo
```

실제 canonical UID는 deterministic 값으로 생성한다.

예시 개념:

```text
QUID = hash(normalizedSourceFile + "#" + sourceOrdinal)
```

### sourceOrdinal을 포함하는 이유

현재 동일 파일에서 동일 `id`가 여러 번 등장하는 사례가 있기 때문이다.

문항 순서는 기존 룰북상 보호 대상이므로 source ordinal은 안정적 식별축으로 사용할 수 있다.

### 필수 저장값

```text
questionUid
legacyQKey
sourceArchiveFile
sourceOrdinal
sourceQuestionNo
```

### 주의

UID 생성 규칙을 source content hash 단독으로 만들지 않는다.

문구/해설 교정만으로 UID가 바뀌면 APMS 과거 오답 연결이 끊긴다.

단, source 배열에 문항을 삽입·삭제·재정렬한 뒤 기존 ordinal UID 생성기를
그대로 재실행하면 순번 뒤 문항에 잘못된 UID가 재할당된다. 운영 source가
dirty인 상태에서는 기존 생성기를 중지하고
`archive/tools/intelligence/migrate-question-identity-map-v1.mjs`를 사용한다.
이 도구는 HEAD source와 `contentFingerprint(content, choices, image)`를
대조해 기존 UID를 보존하고, 실제 신규 문항만 새 UID로 등록한다. answer와
solution 수정은 identity migration 대상에서 제외한다.

---

## 4.5 Phase 0D — Identity Map 생성

권장 파일:

```text
archive/data/question_identity_map.json
```

역할:

- legacy qKey → canonical UID
- source file + source ordinal → canonical UID
- source file + sourceQuestionNo → candidate UID 목록

동일 questionNo가 복수인 경우 단일값으로 강제 축약하지 않는다.

---

## 4.6 Phase 0E — MIXED / Wrong Clinic 호환

현재 MIXED는 다음을 저장한다.

```text
source_archive_file
source_question_no
```

향후 추가:

```text
source_question_uid
```

단 기존 필드는 유지한다.

### fallback 순서

```text
1. source_question_uid
2. source_archive_file + source_question_no
3. legacy index fallback
```

### 대상 파일

- `archive/mixer.html`
- `archive/mixed_engine.html`
- `apmath/js/clinic-print.js`
- `apmath/wrong_print_engine.html`
- `apmath/worker-backup/worker/routes/exams.js`

---

## 4.7 Phase 0F — standard key 정합성

현재 감사에서:

- 비공식 standard key: 249건
- RAW key: 217건

### 처리 원칙

비공식 key를 자동으로 비슷한 공식 key로 치환하지 않는다.

각 항목을 다음으로 분류한다.

```text
official_mapping
legacy_alias
raw_allowed
needs_review
source_error
```

최종적으로 index가 가지는 상태는 명시적이어야 한다.

```text
official
raw
review_required
```

`invalid` 상태를 조용히 `미분류`로 숨기지 않는다.

---

## Phase 0 완료 조건

- 10,552문항 전체 canonical identity 생성
- canonical UID 중복 0
- 문항 유실 0
- MIXED 원본 역추적 실패 0
- Wrong Clinic source 복원 regression 0
- qKey 24충돌 모두 resolution 기록
- 비공식 key 249건 모두 상태 분류
- RAW 217건 모두 명시적 상태 유지

---

# 5. Phase 1A — Curriculum TREE Production화

## 5.1 목표

기존 142개 standard unit master를 유지하면서 더 세밀한 교육과정 계층을 추가한다.

기존 `standardUnitKey`는 외곽 호환 계층으로 유지한다.

---

## 5.2 Production Master Table

기존 룰북의 권장 위치를 실제 source of truth로 승격한다.

```text
archive/data/master_tables/js_archive_tag_master.json
archive/data/master_tables/js_archive_tag_master.schema.json
```

### 역할

- key 정의
- hierarchy
- alias
- source evidence
- status
- auto apply 정책

---

## 5.3 TREE 구조

기본 구조:

```text
Course
→ Standard Unit
→ Sub Unit
→ Concept Cluster
```

문제 유형 계층은 별도 축으로 관리한다.

```text
Problem Type
→ Template
```

### 이유

개념과 문제형식을 하나의 tree로 섞으면 다음 분석이 어려워진다.

```text
같은 개념 + 다른 문제유형
다른 개념 + 같은 풀이 template
```

---

## 5.4 `concept_map.js` 처리

현재 `concept_map.js`를 삭제하지 않는다.

장기적으로는 production master에서 생성되는 compatibility output으로 전환한다.

```text
Master Table
    ↓
build script
    ↓
concept_map.js
```

즉 `concept_map.js`와 master table이 서로 다른 진실을 가지지 않도록 한다.

---

## 5.5 Master Key 검수

모든 active key는 다음을 만족해야 한다.

- parent 존재
- standardUnitKey 충돌 없음
- 한글 label 존재
- status 존재
- evidence policy 존재
- deprecated parent 사용 안 함

### 생성 리포트

```text
new_master_key_candidates.json
master_key_conflict_report.json
deprecated_key_usage_report.json
unknown_parent_key_report.json
```

---

## Phase 1A 완료 조건

- production master schema 확정
- 142 standard units 모두 master에 연결
- `concept_map.js`와 master mismatch 0
- parent orphan 0
- duplicate active key 0
- unknown parent 0

---

# 6. Phase 1B — Tag Enrichment Production 승격

## 6.1 목표

현재 review-only pipeline을 실제 서비스용 approved metadata pipeline으로 승격한다.

---

## 6.2 Metadata 필드

최종 문항 metadata 최소 필드:

```text
questionUid
standardUnitKey
subUnitKey
conceptClusterKey
problemTypeKey
templateKey
difficultyBucket
tagConfidence
tagStatus
metadataRevision
```

---

## 6.3 원본 JS 직접 수정 여부

v1에서는 원본 JS 대량 patch를 기본값으로 하지 않는다.

권장 sidecar:

```text
archive/data/question_metadata.json
```

또는 빌드 산출물:

```text
archive/question-meta.js
```

Mixer와 Worker는 `questionUid` 기준으로 join한다.

sidecar 병합 시 production JS의 비어 있지 않은 값은 source of truth로
보존한다. classification/review 값은 빈 필드를 채울 때만 사용하며,
비어 있지 않은 production 값과 다르면 sidecar 생성 단계에서 충돌로
차단한다. runtime에서도 source 값을 덮어쓰지 않고
`SOURCE_CONFLICT_HOLD`로 표시한다.

### 장점

- 시험지 원문 회귀 방지
- tag 재분류가 쉬움
- metadata만 rollback 가능
- 대량 JS diff 방지

---

## 6.4 Review Workflow

```text
scan
↓
candidate generation
↓
master validation
↓
confidence classification
↓
high / medium / low
↓
review
↓
approved metadata
```

### auto apply

`high`라도 다음 조건을 모두 만족해야 한다.

- master key active
- standard unit conflict 없음
- 충분한 content/solution evidence
- image-only 판단 아님
- cross-unit ambiguity 없음

---

## 6.5 Pilot

전체 10,552문항을 바로 승인하지 않는다.

먼저 대표 표본을 만든다.

권장:

- 중1~3 각 50문항
- 고1~3 각 50문항
- 이미지 포함 문항 별도 50
- 주관식 별도 50
- 난도 상 문항 별도 50

중복 제외 약 300~500문항 pilot.

### Pilot PASS

사람 검수 기준:

- standard/subUnit 정확도 ≥ 98%
- conceptCluster 정확도 ≥ 97%
- problemType 정확도 ≥ 95%
- templateKey 정확도 ≥ 92%

정확도 미달 시 전체 rollout 금지.

---

## 6.6 Coverage 원칙

Coverage를 높이기 위해 틀린 tag를 억지로 넣지 않는다.

허용:

```text
unknown
manual_review
```

금지:

- confidence 낮은데 active tag로 강제 적용
- 이미지 문항을 텍스트만 보고 template 확정
- 여러 concept가 가능한데 하나로 강제 축약

---

## Phase 1B 완료 조건

- sidecar metadata build 가능
- canonical UID join 실패 0
- master validation error 0
- pilot 정확도 gate 통과
- 전체 archive metadata coverage report 생성
- 미분류 문항은 명시적 status 보유

---

# 7. Phase 2 — Archive Metadata Bridge / APMS Sync

## 7.1 목표

Archive metadata가 APMS의 `exam_blueprints`에 안정적으로 전달되도록 한다.

검색용 API를 새로 만드는 것이 Phase 2의 주목적이 아니다.

---

## 7.2 현재 문제

현재 `syncExamBlueprintsFromArchive()`는 archive file에 blueprint row가 이미 하나라도 있으면 sync를 건너뛰는 구조다.

따라서 과거 등록된 시험은 Archive metadata가 개선되어도 자동 갱신되지 않을 수 있다.

---

## 7.3 Sync 계약 변경

현재:

```text
archive_file 존재
→ skip
```

변경:

```text
archive metadata revision/hash 확인
        ↓
같음    → skip
다름    → upsert
```

---

## 7.4 Blueprint 확장 필드

기존 필드 유지.

추가 후보:

```text
source_question_uid
sub_unit_key
concept_key
problem_type_key
template_key
difficulty_bucket
metadata_revision
metadata_hash
```

현재 코드의 `type_key`, `difficulty` 호환을 고려한다.

가능하면 기존 필드 이름을 중복 생성하지 않는다.

예:

```text
problemTypeKey → type_key
difficultyBucket → difficulty
```

처럼 bridge mapping을 명확히 정의한다.

---

## 7.5 Migration 원칙

D1 migration은 additive only.

금지:

- 기존 `exam_blueprints` drop
- 기존 primary key 변경
- 기존 source identity 삭제

권장:

```text
ALTER TABLE ... ADD COLUMN
CREATE INDEX IF NOT EXISTS ...
```

---

## 7.6 Backfill

신규 시험만 적용하면 안 된다.

기존 `exam_blueprints` 전체에 대해 backfill 가능한 도구를 만든다.

권장 별도 maintenance script 또는 admin-only route.

### backfill 단계

```text
1. dry-run
2. diff report
3. sample review
4. batch update
5. post-audit
```

---

## 7.7 Result Item 연결

`routes/exams.js`는 `assessment_result_items`가 존재할 경우 전체 문항 결과를 저장할 수 있다.

Phase 2에서 실제 D1 상태를 먼저 확인한다.

### 분기

A. 테이블이 원격 D1에 존재함

→ schema/map 문서와 migration 상태를 맞춘다.

B. 테이블이 없음

→ 별도 migration을 적용하고 기존 route의 graceful skip 구조를 유지한다.

---

## Phase 2 완료 조건

- Archive metadata → blueprint 매핑 100% deterministic
- metadata hash 기반 sync 동작
- 기존 blueprint update 가능
- MIXED blueprint에도 source UID 유지
- backfill dry-run report 존재
- 기존 QR/OMR regression 0

---

# 8. Phase 3 — Mixer Intelligence Upgrade

## 8.1 목표

현재 필터 기반 자동출제를 **후보 평가 + 다양성 제약 + 조합 검증** 방식으로 확장한다.

---

## 8.2 현재 알고리즘 문제

현재 자동출제는 조건에 맞는 목록에서 앞쪽 N개를 선택하는 구조가 중심이다.

```text
filter
→ available
→ slice(0, want)
```

조건 만족 여부는 보장하지만 최적 조합은 보장하지 않는다.

---

## 8.3 신규 Selection Pipeline

```text
Filter
↓
Candidate Pool
↓
Hard Constraints
↓
Candidate Score
↓
Diversity Penalty
↓
Set Assembly
↓
Blueprint Validation
↓
Final Cart
```

---

## 8.4 Hard Constraints

반드시 만족해야 하는 조건:

- 학년
- 과목
- 단원 범위
- 세부개념 선택
- 요청 문항 수
- source identity 유효
- canonical UID 중복 금지

선택적으로:

- 특정 학교 포함/제외
- 특정 연도 제외
- 최근 사용 문항 제외
- 서술형 최소/최대

---

## 8.5 Candidate Score v1

초기에는 AI가 아니라 규칙 기반 점수로 한다.

예시:

```text
난이도 목표 일치        +30
concept 목표 일치       +30
problemType 목표 일치   +20
학교 목표 일치          +15
최근 연도               +10
source 다양성           +10

동일 template 반복      -35
동일 학교 과다          -20
동일 source file 반복   -20
동일 유형 연속          -10
최근 사용 문항          -50
```

실제 가중치는 테스트 후 조정한다.

---

## 8.6 Deterministic Selection

같은 blueprint와 같은 seed는 같은 결과를 만들어야 한다.

필요 이유:

- 검수 재현성
- 버그 재현
- 학교 fingerprint 테스트
- 자동출제 회귀 테스트

권장:

```text
selectionSeed
```

를 내부 option으로 둔다.

UI에 항상 노출할 필요는 없다.

---

## 8.7 Blueprint UI 확장

현재:

```text
단원 | 난도 | 수 | 태그
```

확장:

```text
세부개념 | 문제유형 | 난도 | 수
```

고급 설정:

```text
학교
연도 범위
최근 사용 제외
source 다양성
동일 template 최대 수
서술형 개수
```

기존 UI 구조를 유지하고 옵션만 점진적으로 추가한다.

---

## 8.8 기존 기능 보존

반드시 유지:

- cart
- pin
- rebuild
- filter
- current paper scope
- full archive scope
- print review
- 일반 출력
- AP 제출 QR 출력

---

## 8.9 출력 전 Validation

자동생성 직후 다음 검사:

```text
total count
unit distribution
concept distribution
difficulty distribution
school distribution
template duplicate count
source duplicate count
invalid UID count
```

Hard constraint 위반 시 출력 버튼까지 진행시키지 않는다.

---

## Phase 3 완료 조건

- `slice(0, want)` 단순 선발 제거
- deterministic selection test PASS
- 동일 UID 중복 0
- blueprint 수량 정확
- pin 유지 rebuild PASS
- 기존 일반 출력 PASS
- QR MIXED 출력 PASS
- source identity regression 0

---

# 9. Phase 4 — School Fingerprint

## 9.1 목표

실제 학교 기출 archive를 집계하여 학교별 출제 성향을 정량화하고 Mixer preset으로 연결한다.

---

## 9.2 데이터 범위

Fingerprint에는 실제 학교 기출만 사용한다.

기본 포함:

```text
archive/exams/original/**
```

기본 제외:

- textbook
- type bank
- generated 문제
- mixed 시험
- 내부 review용 문제

---

## 9.3 학교 식별

학교명 canonical normalization 필요.

예:

```text
순여고 → 순천여고
강남고 → 강남여고
```

단 자동 alias 적용은 별도 학교 alias master를 사용한다.

원본 제목을 임의 수정하는 것이 아니라 통계용 canonical school key를 둔다.

---

## 9.4 Fingerprint Metrics v1

학교 / 학년 / 시험축별:

```text
question_count
exam_count
year_range
unit_distribution
subunit_distribution
concept_distribution
problem_type_distribution
template_distribution
difficulty_distribution
subjective_ratio
image_ratio
late_question_difficulty
```

추가 가능:

- 후반 20% 난도
- 반복 template
- 최근 3년 변화
- 특정 단원 집중도

---

## 9.5 Sample Threshold

문항 수가 너무 적은 학교는 fingerprint를 노출하지 않는다.

권장 v1:

```text
최소 3개 시험
또는
최소 60문항
```

둘 중 하나가 아니라 실제 안정성 검토 후 threshold 확정.

UI에는 sample size를 표시한다.

---

## 9.6 Fingerprint 산출물

권장:

```text
archive/data/school-fingerprints.json
```

생성기:

```text
archive/tools/build-school-fingerprints.mjs
```

Fingerprint는 원본 데이터를 수정하지 않는 파생 산출물이다.

---

## 9.7 Mixer Preset

핵심 기능:

```text
[순천고 스타일 시험지 만들기]
```

버튼 실행 시 별도 시험지 엔진을 만들지 않는다.

Fingerprint를 Mixer blueprint preset으로 변환한다.

```text
Fingerprint
↓
Target Distribution
↓
Mixer Intelligence
↓
Cart
```

---

## 9.8 Preset 생성 원칙

학교 성향을 100% 복제하지 않는다.

예:

```text
학교 fingerprint 70%
사용자 지정 범위 30%
```

처럼 범위 제약이 우선이다.

교육과정 밖 문항을 학교 성향 때문에 강제로 넣지 않는다.

---

## Phase 4 완료 조건

- original school exam만 집계
- 학교 alias audit 완료
- sample threshold 미달 학교 숨김
- fingerprint 재생성 deterministic
- fingerprint → Mixer preset 변환 PASS
- 선택된 시험지 distribution이 target 허용오차 안에 들어옴

권장 허용오차:

```text
주요 분포 ±10%p
```

단 문항 수가 적을 경우 절대 문항 수 기준 보정.

---

# 10. Phase 5 — Concept Weakness / APMS 오답 확장

## 10.1 목표

현재 오답 클리닉의 단원 중심 집계를 세부개념·문제유형 기반 Weakness 모델로 확장한다.

---

## 10.2 현재 재사용할 데이터

- `exam_sessions`
- `wrong_answers`
- `exam_blueprints`
- 가능 시 `assessment_result_items`

현재 `clinic-print.js`는 blueprint에서 이미 다음을 추적한다.

```text
unitKey
unit
course
cluster
```

여기에 신규 metadata를 추가한다.

---

## 10.3 Wrong Item 확장

```text
questionUid
standardUnitKey
subUnitKey
conceptClusterKey
problemTypeKey
templateKey
difficultyBucket
```

학생 오답 item에 붙인다.

---

## 10.4 Weakness Unit

학생 취약도를 다음 세 레벨로 집계한다.

```text
1. Concept Weakness
2. Problem Type Weakness
3. Template Repeat Failure
```

`standardUnitKey` 단위 집계는 기존 호환용으로 유지한다.

---

## 10.5 Weakness Score v1

초기 formula는 단순하고 설명 가능해야 한다.

개념 예시:

```text
WeaknessScore =
  weightedWrongRate
  × recencyWeight
  × repeatedFailureWeight
  × difficultyAdjustment
```

### Difficulty 보정

쉬운 문제 오답은 취약도를 더 크게 올린다.

어려운 문제 오답은 취약도를 올리되 증가폭은 낮춘다.

예:

```text
basic wrong      1.30
standard wrong   1.15
advanced wrong   1.00
challenge wrong  0.85
```

실제 수치는 데이터 확인 후 조정한다.

---

## 10.6 Recency

최근 결과일수록 가중치를 높인다.

예:

```text
0~14일    1.00
15~30일   0.85
31~60일   0.65
61~90일   0.45
90일+     0.30
```

이 역시 v1 테스트 후 조정.

---

## 10.7 Correct Result 필요성

`wrong_answers`만으로는 오답 기록은 알 수 있지만, 같은 concept를 이후에 맞혔는지 완전하게 추적하기 어렵다.

가능하면 `assessment_result_items`를 Weakness의 주 데이터로 사용한다.

```text
question-level correct/wrong history
```

가 확보되면 취약도 감소도 계산할 수 있다.

### fallback

원격 D1에 result items가 아직 없다면:

```text
exam_sessions + wrong_answers + blueprint
```

으로 v1 집계를 제공한다.

단 이 경우 `recovery score`는 제한적으로 표시한다.

---

## 10.8 학생 UI v1

처음부터 복잡한 AI 분석 화면을 만들지 않는다.

예:

```text
최근 취약 개념

역함수 존재조건      높음
합성함수            보통
경우의 수 분류       높음

최근 30일
역함수 12문항 / 6오답

[보충시험 만들기]
```

---

## 10.9 보충시험 만들기

새 출제 시스템을 만들지 않는다.

```text
Student Weakness
↓
Mixer Preset
↓
Mixer Intelligence
↓
Mixed Engine
↓
QR / OMR
↓
Result
↓
Weakness Recalculate
```

이 루프가 Phase 5의 핵심 Definition of Done이다.

---

## 10.10 Wrong Clinic 기존 기능 보존

반드시 유지:

- 학생별 오답
- 반별 공통 오답
- 학년별 공통 오답
- 최다빈출
- 최다오답
- 단원별
- 저장형 set / packet
- QR review
- 원본 Archive 복원

Weakness는 이 기능을 대체하지 않는다.

---

## Phase 5 완료 조건

- wrong item에 canonical UID 연결
- concept/type별 집계 가능
- student weakness score 재현 가능
- 최근 정답에 따른 취약도 감소 가능 또는 fallback 명시
- 보충시험 preset 생성
- preset → Mixer → Mixed Engine → OMR roundtrip PASS

---

# 11. 단계별 실제 수정 파일 후보

## Phase 0

```text
archive/tools/build-question-index.mjs
archive/question-index.js
archive/question-index-audit.md
archive/data/question_identity_map.json        [신규]
archive/mixer.html
archive/mixed_engine.html
apmath/js/clinic-print.js
apmath/wrong_print_engine.html
apmath/worker-backup/worker/routes/exams.js
```

## Phase 1A

```text
archive/data/master_tables/js_archive_tag_master.json
archive/data/master_tables/js_archive_tag_master.schema.json
archive/concept_map.js
archive/tools/* master build/audit scripts
```

## Phase 1B

```text
archive/tools/tag-enrichment/**
archive/data/question_metadata.json            [신규 후보]
archive/question-meta.js                       [런타임용 생성물 후보]
```

## Phase 2

```text
apmath/worker-backup/worker/routes/exams.js
apmath/worker-backup/worker/schema.sql
apmath/worker-backup/worker/migrations/*.sql
archive/mixed_engine.html
```

## Phase 3

```text
archive/mixer.html
archive/question-index.js
archive/question-meta.js
관련 tests/*.test.*
```

## Phase 4

```text
archive/tools/build-school-fingerprints.mjs     [신규]
archive/data/school-fingerprints.json           [신규]
archive/mixer.html
archive/index.html                              [노출 위치 확정 시]
```

## Phase 5

```text
apmath/js/clinic-print.js
apmath/wrong_print_engine.html
apmath/js/student.js 또는 별도 weakness UI module
apmath/worker-backup/worker/routes/exams.js
관련 migration / tests
```

---

# 12. 테스트 전략

## 12.1 Static tests

필수 검사:

```text
node --check
UID duplicate audit
metadata schema validation
master key parent validation
question index count audit
blueprint sync contract test
```

---

## 12.2 Identity regression

대표 케이스:

1. 단일 Archive 시험
2. MIXED 시험
3. 동일 id 충돌 파일
4. original school exam
5. type bank
6. 이미지 포함 문제

검사:

```text
source → UID
UID → source
MIXED → source
wrong item → source
```

모두 역추적되어야 한다.

---

## 12.3 Mixer regression

- 기존 filter 결과 수 동일
- current paper mode 동일
- archive mode 동일
- cart add/remove 동일
- pin 동일
- rebuild 동일
- 50문항 limit 동일
- 일반 출력 동일
- QR 출력 동일

---

## 12.4 APMS regression

- class exam assignment 생성
- MIXED assignment 생성
- exam blueprint 저장
- student OMR 제출
- wrong_answers 저장
- result items 저장 또는 graceful skip
- Wrong Clinic 생성
- QR review 열기

---

## 12.5 Metadata Quality QA

샘플링은 고정 seed를 사용한다.

권장:

```text
seed = 20260819
```

검수 보고에 seed와 샘플 UID를 기록한다.

---

# 13. 단계별 Commit / 작업 단위 권장

한 Phase를 한 번에 크게 수정하지 않는다.

## Phase 0 권장 Round

```text
0A inventory audit only
0B collision classification
0C canonical UID generator
0D identity map
0E Mixer/MIXED UID propagation
0F APMS/Wrong Clinic UID propagation
0G full regression
```

## Phase 1 권장 Round

```text
1A master table foundation
1B master audit
1C enrichment pilot
1D pilot review
1E full candidate generation
1F approved sidecar build
```

## Phase 2 권장 Round

```text
2A DB additive migration
2B blueprint bridge
2C metadata hash sync
2D backfill dry-run
2E backfill
2F OMR regression
```

## Phase 3 권장 Round

```text
3A selector core only
3B deterministic seed
3C diversity penalty
3D blueprint UI expansion
3E pre-print validation
3F regression
```

## Phase 4 권장 Round

```text
4A school normalization
4B fingerprint generator
4C profile audit
4D mixer preset
4E selected school pilot
```

## Phase 5 권장 Round

```text
5A result metadata join
5B weakness aggregation
5C student view
5D supplement preset
5E closed-loop test
```

---

# 14. 회귀 금지선

다음 항목은 각 Phase의 변경으로 깨지면 안 된다.

1. 기존 시험지 JS 파일명
2. 기존 asset path
3. 기존 시험 출력 품질
4. 기존 해설/정답 출력
5. existing QR submit
6. student portal OMR 제출 완료 정책
7. 기존 wrong_answers
8. 기존 class/grade/student Wrong Clinic
9. MIXED source tracking
10. `archive_file + question_no` legacy lookup

Canonical UID를 추가하더라도 legacy lookup은 최소 한 migration cycle 이상 유지한다.

---

# 15. 주요 위험과 대응

## Risk A — UID migration 중 과거 오답 연결 단절

대응:

```text
source_question_uid 신규
+ legacy source_archive_file/source_question_no 유지
```

---

## Risk B — Tag 오분류가 School Fingerprint를 왜곡

대응:

- active/reviewed metadata만 fingerprint 사용
- low confidence 제외
- sample size 표시

---

## Risk C — Mixer가 너무 특정 template만 선택

대응:

- template duplicate penalty
- source diversity penalty
- set-level validation

---

## Risk D — Archive metadata와 APMS blueprint가 서로 다른 버전

대응:

```text
metadataRevision
metadataHash
upsert sync
```

---

## Risk E — 오답률만으로 취약도 오판

대응:

- 난도 보정
- 최근성
- 반복성
- correct history 사용

---

# 16. Phase Gate

각 Phase는 다음 단계로 넘어가기 전에 명시적으로 PASS되어야 한다.

## Gate 0

```text
Canonical UID integrity PASS
```

## Gate 1

```text
Metadata pilot quality PASS
```

## Gate 2

```text
Archive ↔ APMS sync PASS
```

## Gate 3

```text
Mixer Intelligence regression PASS
```

## Gate 4

```text
School Fingerprint statistical QA PASS
```

## Gate 5

```text
Student Weakness closed loop PASS
```

한 Gate가 FAIL인 상태에서 다음 Phase의 실제 운영 데이터 적용을 진행하지 않는다.

---

# 17. 최종 Definition of Done

Archive Intelligence v1은 다음 흐름이 실제로 작동할 때 완료로 본다.

```text
학교 기출 JS
↓
Canonical UID
↓
Curriculum / Concept / Type Metadata
↓
Question Index
↓
School Fingerprint 또는 학생 Weakness
↓
Mixer 자동 Blueprint
↓
Intelligence Selection
↓
Mixed Engine
↓
APMS 배정
↓
학생 OMR
↓
문항별 Result
↓
Weakness 갱신
↓
보충시험 재생성
```

그리고 이 과정에서:

- 원본 문항 변형 0
- 원본 asset 손상 0
- 문항 identity 유실 0
- 기존 출력 기능 회귀 0
- 기존 오답 기능 회귀 0

이어야 한다.

---

# 18. 우선 착수 순서

실제 첫 개발은 UI가 아니라 다음 네 가지부터 시작한다.

```text
1. 24개 qKey 충돌 전수 분류
2. 249개 비공식 standard key 정리
3. Canonical UID + identity map 구축
4. exam_blueprints metadata 재동기화 계약 설계
```

이 네 가지가 완료되기 전에는 School Fingerprint나 Student Weakness를 운영 기능으로 노출하지 않는다.

이유는 간단하다.

**학교 성향과 학생 취약도는 문항 Identity와 Metadata가 정확해야만 믿을 수 있는 통계가 되기 때문이다.**

---

# 19. 본 계획의 핵심 요약

새로 만들어야 하는 것은 생각보다 적다.

이미 존재하는 것:

- Archive engine
- Mixer
- Mixed Engine
- Question Index
- Curriculum master
- Tag enrichment pipeline
- APMS assignment
- OMR
- exam blueprints
- wrong answers
- Wrong Clinic

실제로 필요한 핵심 신규 계층은 네 가지다.

```text
① Canonical Question Identity
② Approved Fine-grained Metadata
③ Intelligent Selection
④ School/Student Feedback → Mixer
```

따라서 구현 전략은 **재작성보다 연결과 정규화**를 우선한다.
