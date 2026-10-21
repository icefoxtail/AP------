# 시험지 소형 메타 등록 v2

2026-10-21. 범위: 기존 등록기의 승인 메타 적용 및 근거가 있는 정본 확장.
이번 구현은 시험지 수학·해설 검수, 순천고 실전 승인, main 병합 또는 배포 완료를 대신하지 않는다.

## 입력과 실행

기존 `register-reviewed-exam-meta-source.mjs`가 v1 요청은 기존 REVIEW2 경로로,
`archive-reviewed-exam-meta-register-request-v2` 요청은 공통 경로로 처리한다.
중1~중3·고1~고3의 과목/교육과정 이름을 코드에 열거하지 않는다.
curriculum/course/단원/PT/TPL/ownerPack은 승인된 요청과 실제 정본으로 결정한다.

```powershell
node archive/tools/meta-foundation/register-reviewed-exam-meta-source.mjs --request .archive-meta-register/inbox/<requestId>.json
node archive/tools/meta-foundation/register-reviewed-exam-meta-source.mjs --request .archive-meta-register/inbox/<requestId>.json --write
python archive/build_db.py
node archive/tools/meta-foundation/register-reviewed-exam-meta-source.mjs --request .archive-meta-register/inbox/<requestId>.json --verify-projection
```

기본 실행은 dry-run이다. `--repo-root`는 격리된 fixture/checkout 검사에 사용할 수 있다.
`--verify-projection`은 등록 영수증이 있는 요청의 현재 메타·Runtime·Catalog·Search index 값 대조이며 read-only다.
이는 브라우저 검색/선택/출력, 원격 main, 배포 확인을 수행했다는 뜻이 아니다.

## v2 요청 계약

| 필드 | 요구 내용 |
| --- | --- |
| `schemaVersion` | `archive-reviewed-exam-meta-register-request-v2` |
| `requestId` | 내용이 바뀌지 않는 고유 식별자. 수정 등록은 새 ID |
| `examUid` | 승인 대상 시험 식별자 |
| `sourceArchiveFile` | `archive/exams/` 기준 실제 JS 상대 경로 |
| `expectedSourceBlobSha1` | Git clean filter가 적용된 source의 blob SHA-1. Git 없는 격리 fixture에서는 raw blob SHA-1 |
| `expectedQuestionCount` | 실제 전 문항 수 |
| `approval` | `type: FINAL_QA 또는 REVIEW2`, `metadataReviewed: true`, `approvedBy`, `evidenceRefs` |
| `registryChanges` | 선택 사항. 정본 변경 작업 배열 |
| `items` | 전 UID의 `questionUid`, `sourceOrdinal`, `before`, `after`, `reason`, `evidenceRefs` |

`REVIEW2`에만 `approval.reviewPassCount: 2`가 필요하다. FINAL_QA를 REVIEW2로 기록하지 않는다.
각 `evidenceRefs`는 `{ "path": "저장소 상대 경로", "sha256": "실바이트 SHA-256" }` 배열이다.
실제 파일이 없거나 hash가 다르면 쓰기 전에 실패한다. URL이나 검토했다는 문장만으로 대체하지 않는다.

`before/after`는 승인 메타 필드 객체다. `after`의 모든 필드에 `before`를 명시하며,
기존 필드가 없으면 `before` 값은 `null`이다. source JS에도 존재하는 값은 정확히 같아야 한다.
기존 source/identity fingerprint와 UID/ordinal도 일치해야 한다.
`level`은 하/중/상, `difficultyBucket`은 정수 1~5로 독립 검증한다.
기존 승인 L1~L4를 정본으로부터 바꾸는 경우에도 해당 필드의 `before`가 필요하다.
L1/L2는 binding의 명시적 L1/L2를 우선하고, 기존 구조에서는 표준단원/세부단원 master label을 사용한다.
RPM 전용 값은 `rpmL1~rpmL4`, `rpmPrimaryPath`, 의미 근거 필드로 별도 보존한다.
`content/choices/answer/solution/image/layout`은 등록 요청으로 변경할 수 없다.

## 정본 확장·변경·삭제

별도 임시 registry나 별도 compiler를 만들지 않는다. 기존 native canonical pack/shard와
`js_archive_tag_master.json`을 변경하고 기존 Meta Foundation compiler로 파생물을 만든다.

일반적인 소형 변경은 다음 형태다. 아래는 구조 예시이며 실제 승인이 아니다.

```json
{
  "path": "archive/data/meta-foundation/canonical/packs/<owner>/taxonomy.json",
  "collection": "templates",
  "match": { "templateKey": "TPL_EXAMPLE" },
  "before": null,
  "after": {
    "templateKey": "TPL_EXAMPLE",
    "parentProblemTypeKey": "PT_EXISTING",
    "canonicalLabelKo": "승인된 풀이 구조",
    "definition": "승인된 의미와 적용 범위",
    "status": "ACTIVE"
  },
  "evidenceRefs": [{ "path": "실제 근거 경로", "sha256": "실제 64자리 해시" }]
}
```

- 추가: `before: null`, `after: 새 객체`.
- 수정·폐기: `before: 현재 객체`, `after: 승인된 새 객체`. 폐기는 `status: RETIRED` 등으로 표시.
- 삭제: `before: 현재 객체`, `after: null`. 삭제한 정의와 근거는 요청 영수증에 보존.
- 키 교체: 새 키 추가 → 대상 UID의 before/after 이관 → 이전 키 삭제를 한 요청에 포함.
- 새 과목·교육과정: owner pack의 `curricula/standardCourses` 및 정확한 curriculum binding을 함께 추가.
- 새 ownerPack: `registry_index.activePacks` 항목과 native `pack/taxonomy/bindings/aliases.json` 문서를 함께 추가.
- 새 CrossConcept shard: `activeConceptShards` 항목과 native concepts 문서를 함께 추가.

허용 collection은 index의 `activePacks/activeConceptShards`, taxonomy의 `problemTypes/templates`,
bindings의 `bindings/applicabilityRules`, aliases의 `aliases`, concepts의 `concepts`, condition registry의 `conditions`다.
단원 master 배열은 `collection: "$"`를 사용한다. match는 정확히 0개 또는 1개여야 한다.
새 문서 생성은 collection 없이 `before: null`로 한다. 기존 전체 문서 교체는 pack.json에만 허용한다.
기존 pack/shard의 의미 자료가 변경되면 patch version을 갱신하고 compiled/index hash도 재생성한다.

다른 시험지의 기존 메타나 Runtime 참조에 영향을 주는 정본 수정·삭제는 차단한다.
이관 대상 시험지의 변경을 포함하지 않은 채 공유 키부터 제거하지 않는다.
ACTIVE 부모/키/binding이 없거나 불명확한 경우 실패하며, 키나 의미를 자동 추정하지 않는다.
RPM LOCKED 파일·Generated 전용 registry·그 밖의 임의 경로는 변경 대상 allowlist에 포함하지 않는다.

## 기록과 운영 경계

영수증은 `archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/<requestId>.json`에 저장한다.
승인 타입, 요청 digest, 정본 before/after, 최종 UID 메타, Runtime 값, 변경 산출물 digest를 보존한다.
`metadataRegistrationStatus: REGISTERED`와 `examFinalQaStatus: NOT_EVALUATED_BY_REGISTRAR`를 분리한다.
재실행은 요청 digest·현재 UID 메타·정본 참조·Runtime 값을 다시 확인하고 변경 없이 반환한다.

Actions는 여러 inbox 요청을 순서대로 처리하고 정본/compiled/Runtime/대형 메타를 함께 stage한다.
DB/Catalog/Search 재생성 및 값 대조가 실패하면 commit/push하지 않는다.
성공한 요청은 inbox에서 제거하고 영수증을 보존한다. 수동 재실행은 workflow_dispatch로 가능하다.

새 정본이나 새 Runtime pack 파일을 만들었다는 사실만으로 학생 Consumer 지원이 완성되지는 않는다.
기존 Consumer의 canonical 범위·Runtime 입력 목록이 새 분류를 지원하는지 별도 확인해야 한다.
이 구현은 Consumer 엔진을 재설계하거나 Pages와의 기존 writer 구조를 변경하지 않는다.
정본 등록/정적 값 검증과 학생 화면·출시 완료를 구분해 보고한다.

## 검증

`node --test tests/archive-reviewed-exam-registration-v2.test.mjs`는 격리된 임시 저장소에서
중등 전 학년·고등 과목·미등록 미래 과목, 실제 Git 정본과의 확장 결합, 24 UID 보존,
키 교체/수정/폐기/삭제, UID·근거·before·binding 오류, 재실행을 확인한다.
순천고 실제 24 UID의 의미 승인이나 운영 등록 결과를 대신하지 않는다.
