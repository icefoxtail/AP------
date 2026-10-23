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
| `approval` | `type: FINAL_QA`, `REVIEW2`, 또는 `META_PIPELINE_AUDIT`; 각 유형의 구별된 증거, `metadataReviewed: true`, `approvedBy`, `evidenceRefs` |
| `registryChanges` | 선택 사항. 정본 변경 작업 배열 |
| `items` | 전 UID의 `questionUid`, `sourceOrdinal`, `before`, `after`, `reason`, `evidenceRefs` |

`REVIEW2`에만 `approval.reviewPassCount: 2`가 필요하다. FINAL_QA를 REVIEW2로 기록하지 않는다.
각 `evidenceRefs`는 `{ "path": "저장소 상대 경로", "sha256": "실바이트 SHA-256" }` 배열이다.
실제 파일이 없거나 hash가 다르면 쓰기 전에 실패한다. URL이나 검토했다는 문장만으로 대체하지 않는다.

### `META_PIPELINE_AUDIT` 승인 유형

`META_PIPELINE_AUDIT`는 Gemini의 심화 메타 감사 인계를 등록하는 별도 유형이다. 이 유형은 FINAL_QA 또는 REVIEW2로 변환하지 않으며, 시험지의 최종 수학·해설 QA 상태를 승인하지 않는다. 요청은 다음을 제공한다.

- `approval.metaPipelineAudit.schemaVersion: "meta-pipeline-audit-approval-v1"`
- `approval.metaPipelineAudit.sourceFileDriveId`
- `approval.metaPipelineAudit.auditPackageRef`, `manifestRef`, `sourceParityRef`: 정확한 Drive 산출물 JSON 바이트와 source-parity report를 저장소 evidence 경로에 보존한 `{path, sha256}` 참조. 세 참조 모두 `approval.evidenceRefs`에도 포함한다.
- 감사 패키지는 `ALIVE_META_AUDIT_ATOMIC_v3`, `ALL_APPROVED_CANONICAL_STANDARDIZED`, `READY_FOR_COURIER_REGISTRATION`, N/N 승인, zero hold, zero template inflation을 만족해야 한다. `sourceSha256`는 매니페스트의 Drive source SHA와 일치해야 한다.
- 매니페스트는 `COURIER_INTAKE_MANIFEST_v2`, 같은 exam/source identity, N개 승인 바인딩, zero hold/template inflation을 만족해야 한다.
- `archive-meta-pipeline-source-parity-v1` 보고서는 Drive source SHA와 현재 production source SHA/blob SHA를 함께 결속한다. qid별 student fields (`id`, 지문, 보기, 정답, 해설, image/SVG 참조, 레이아웃) digest가 같고 source/solution 발췌가 Drive 원본에서 확인되었음을 기록한다. raw JS 메타 필드만 달라 raw SHA가 다를 때도 학생 노출 payload parity가 입증되어야 등록할 수 있다.
- 기존 CrossConcept key는 canonical definition을 변경하지 않는다. audit definition wording이 canonical과 다르면 label이 정확히 같고 동일 개념의 관점 차이라는 qid/개념별 rationale을 `existingConceptReviews`에 기록해야 재사용할 수 있다. 신규로 감사된 PT/TPL/CrossConcept key는 근거·supporting UID/count와 정확한 owner binding을 갖춘 `registryChanges`의 add-only 승격을 지원한다. 기존 key 의미 수정·삭제는 거부한다.
- Source JS의 advanced metadata placeholder는 `projectionStatus: BINDING_PENDING`과 필드별 null 사유, 또는 보존된 RPM 상태 `RPM_SEMANTIC_FINAL_PROJECTION_UNMATERIALIZED`, `RPM_SEMANTIC_FINAL_H15_UNIT_BINDING_PENDING`, `RPM_SEMANTIC_FINAL_DIRECT_BINDING_GAP` 중 하나와 비어 있지 않은 `metaNullReason`이 함께 있을 때 정식 메타 projection이 대체할 수 있다. `META_PIPELINE_AUDIT`는 더해 source에 이미 적힌 표준 단원·PT/TPL/CC/Condition 값이 감사/매니페스트와 다를 때, 해당 메타 행이 아직 승인 전이고 요청에 exact `sourceMetadataBefore`가 있어 현재 source 값을 바이트 기준으로 결속한 경우에 한해 sidecar 바인딩을 재지정할 수 있다. 승인된 메타 행의 재지정은 거부한다. 양쪽 경로 모두 student-facing source bytes를 수정하지 않는다.
- 이 감사 유형은 1~5 `difficultyBucket`이나 `IntegrationPattern`을 판정하지 않는다. 기존 bucket이 숫자형 1~5가 아니고 source JS에 별도 1~5 값도 없으면, 요청이 기존 잘못된 값을 정확한 `before`로 결속해 `after: null`로 지우고 `unreviewedFields`에 qid, `EVIDENCE_DEBT`, 사유를 기록해야 한다. source에도 IntegrationPattern이 없으면 `NONE`을 추정하지 말고 같은 방식으로 debt를 남긴다. `level`에서 bucket을 계산하지 않는다.
- Consumer가 요구하는 L1/L2는 evidence-bound `.parent-labels.json`으로 현재 `basic-scope-parent-links.json`의 정확한 curriculum/course/unit/subunit 부모에서 가져온다. standardUnit label을 부모 L1로 대체하지 않는다.
- 감사 records, 매니페스트 `recordsToBind`, 등록 요청 `items`는 source ordinal별 PT/TPL/CrossConcept/단원 값이 정확히 일치해야 한다. 결정적 풀이 발췌와 시각자료 확인 필드도 qid마다 필요하다.

이 유형의 등록 receipt는 `examFinalQaStatus: NOT_EVALUATED_BY_REGISTRAR`를 유지한다. 문항 메타 provenance에는 `metadataApprovalType: META_PIPELINE_AUDIT`, `tagConfidence: meta_pipeline_audit`, `fieldStatus.*: approved_meta_pipeline_audit`를 기록해 다른 승인 경로와 구별한다.

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
