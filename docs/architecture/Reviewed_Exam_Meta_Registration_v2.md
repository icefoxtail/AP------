# 시험지 소형 메타 등록 v2 및 Canonical Maintenance v1

2026-10-23. 범위: 시험지별 승인 메타 등록, 제한된 FINAL QA pinpoint/nonPT 경로, 별도 canonical-only maintenance 요청의 실제 request/Actions 계약.
이 문서는 시험지 수학·해설 검수나 문항 분류 승인을 대신하지 않는다. Canonical maintenance는 시험지 승인이나 UID 메타 등록이 아니다.

## 입력과 실행

`archive-reviewed-exam-meta-register-request-v2` 시험지 요청과
`archive-reviewed-canonical-maintenance-request-v1` canonical-only 요청은 같은
`register-reviewed-exam-meta-source.mjs` CLI 및 `.github/workflows/archive-reviewed-exam-meta-register.yml` Actions 경로에서 구분 처리한다.
같은 CLI에는 두 개의 exam-specific FINAL QA schema도 있다. `archive-finalqa-pinpoint-register-request-v1`과 `archive-finalqa-nonpt-register-request-v1`는 각자 고정된 exam/request, 분모와 baseline에 fail-closed로 묶이며 일반 과목 등록 경로가 아니다.
시험지 v2는 `REVIEW2`와 `FINAL_QA`를 별도 승인 타입으로 사용하고 과목 코드를 코드에 열거하지 않는다.
curriculum/course/단원/PT/TPL/ownerPack은 승인된 request와 실제 정본에서 정한다.
legacy v1 요청 경로의 기존 범위를 v2의 일반 과목 지원 근거로 확장하지 않는다.

```powershell
node archive/tools/meta-foundation/register-reviewed-exam-meta-source.mjs --request .archive-meta-register/inbox/<requestId>.json
node archive/tools/meta-foundation/register-reviewed-exam-meta-source.mjs --request .archive-meta-register/inbox/<requestId>.json --write
python archive/build_db.py
node archive/tools/meta-foundation/register-reviewed-exam-meta-source.mjs --request .archive-meta-register/inbox/<requestId>.json --verify-projection
```

기본 실행은 dry-run이다. `--repo-root`는 격리된 fixture/checkout 검사에 사용할 수 있다.
`--verify-projection`은 시험지 v2 등록 영수증의 현재 메타·Runtime·Catalog·Search 값 대조이며 read-only다.
이는 브라우저 검색/선택/출력 또는 배포 확인을 수행했다는 뜻이 아니다.

Pinpoint 요청은 현재 지정된 21-item FINAL QA 대상으로 승인된 필드만 적용하며 `PT/TPL: NOT_IN_SCOPE`로 보존한다. NonPT 요청은 현재 지정된 21-item FINAL QA candidate/source parity를 확인하고 기존 ACTIVE 보조 taxonomy key만 연결한다. 이 경로는 `PT/TPL: NOT_REVIEWED_NOT_APPROVED` 및 candidate-only 보조 키를 유지하며 canonical PT/TPL 승인을 수행하지 않는다. 다른 시험지나 학교에 대한 지원을 이 두 구현에서 추론하지 않는다.

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
`STANDARD_UNIT_DIRECT` binding의 `subUnitLabelKo`는 부모 L2를 보여 주는 표시값이며 세부단원 생성/등록을 뜻하지 않는다. v2는 명시된 `binding.L1/L2`를 parent로 사용하면서 `meta.subUnitKey: null`과 빈 child label을 보존한다.
RPM 전용 값은 `rpmL1~rpmL4`, `rpmPrimaryPath`, 의미 근거 필드로 별도 보존한다.
`content/choices/answer/solution/image/layout`은 등록 요청으로 변경할 수 없다.

## Canonical maintenance request v1

`archive-reviewed-canonical-maintenance-request-v1`는 공유 canonical registry/compiled/runtime envelope/crosswalk를 갱신하는 **별도 infrastructure request**다. `examUid`, `sourceArchiveFile`, 시험지 approval, UID별 semantic approval은 포함하지 않는다. `approval.type`은 `CANONICAL_MAINTENANCE`이고, `items`는 반드시 `[]`다.

최상위 필드는 `schemaVersion`, `requestId`, `purpose`, `approval`, `registryChanges`, `crosswalkRefreshPaths`, `items`다. `registryChanges`는 이 문서 §정본 확장·변경·삭제의 native pack collection 규칙을 따른다. 기존 pack의 `pack.json`은 전체 before/after를 보낼 수 있고, `bindings.json`은 22개처럼 정확히 식별된 binding 추가와 `applicabilityRules` 추가를 collection 단위로 보낸다. 의미 PT/TPL 변경은 별도 근거·승인 없이 포함하지 않는다.

`crosswalkRefreshPaths[]`에는 허용된 RPM v1.0 crosswalk 하나당 `path`, `expectedBeforeSha256`, `selector:{curriculum,scope,standardCourse}`, `expectedRecordCount`, `expectedSummary`, `evidenceRefs`를 둔다. Writer는 선택 분모만 exact current ACTIVE binding과 결속하고 `DIRECT_BINDING_GAP`/`FAMILY_BINDING_GAP`를 해당 active 상태로 전환한다. semantic RPM path, PT, TPL, family candidates 및 selector 밖 crosswalk rows는 유지한다. crosswalk의 before SHA는 `expectedBeforeSha256` 및 receipt witness에 보존한다. 변경되는 pack/crosswalk 바이트를 current evidenceRef로 다시 참조해 replay를 깨뜨리지 않는다.

Canonical maintenance는 canonical pack/binding과 compiler/index를 갱신하고 변경 pack의 runtime envelope version만 재결속한다. 기존 runtime UID records, source JS, `question_metadata.json`, identity map은 이 request로 수정하지 않는다. Registrar는 이 불변 조건과 out-of-scope UID 영향 여부를 검사한다. 실제 main 기반 write는 단일 Actions writer가 수행한다.

`applicabilityRules`는 exact `curriculum + standardUnitKey + targetType + targetKey` 범위로 해석한다. 특정 template에 `CORE`/`DEFAULT_SCOPE` 및 `defaultSelectable: true`를 기록하면 해당 TPL을 명시적으로 허용하며, 같은 PT의 다른 자식 TPL을 자동 허용하지 않는다. `SUPPLEMENTARY_OUTSIDE_CORE`는 근거가 있는 exact target만 `defaultSelectable: false`로 기록한다. RPM 경로 목록에 없다는 사실만으로 다른 TPL을 outside-core로 판정하지 않는다.

첫 `--write` 결과는 `maintenanceStatus: APPLIED`, `metadataRegistrationStatus: NOT_APPLICABLE`, `examFinalQaStatus: NOT_EVALUATED`, `consumerSearchStatus: NOT_RUN`이다. 이를 `COMPLETE`로 보고하지 않는다. Actions의 DB/UID/index/Catalog/Runtime-readiness 재생성 후 다음 명령으로 receipt와 manifest-backed static projection을 확인한다.

```powershell
node archive/tools/meta-foundation/register-reviewed-exam-meta-source.mjs --request .archive-meta-register/inbox/<requestId>.json --verify-maintenance
```

`--verify-maintenance`는 read-only이며 완료 시 `maintenanceStatus: MAINTENANCE_COMPLETE`와 `consumerSearchStatus: STATIC_VALUES_VERIFIED`를 반환한다. 이는 브라우저의 실제 화면 확인, 학생 배포 또는 Pages 완료가 아니다. Canonical-only fixture는 plumbing을 검증할 수 있지만 실제 시험지 분류/승인으로 해석하지 않는다.

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

시험지 v2 영수증은 `archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/<requestId>.json`에 저장한다.
승인 타입, 요청 digest, 정본 before/after, 최종 UID 메타, Runtime 값, 변경 산출물 digest를 보존한다.
`metadataRegistrationStatus: REGISTERED`와 `examFinalQaStatus: NOT_EVALUATED_BY_REGISTRAR`를 분리한다.
재실행은 요청 digest·현재 UID 메타·정본 참조·Runtime 값을 다시 확인하고 변경 없이 반환한다.

Canonical maintenance 영수증은 `archive/data/meta-foundation/evidence/canonical-maintenance/v1/<requestId>.json`에 저장한다.
`maintenanceStatus: APPLIED`와 `consumerSearchStatus: NOT_RUN`을 남기며, `--verify-maintenance` 뒤의
`MAINTENANCE_COMPLETE`/`STATIC_VALUES_VERIFIED`와 구분한다. Runtime envelope 변경 전/후, runtime UID record SHA,
선택한 crosswalk before/after SHA와 refresh 분모를 receipt에 보존한다.

Actions는 여러 inbox 요청을 정렬된 순서로 단일 writer가 처리한다. 승인된 source request만 입력이며
`question_metadata.json`, identity, DB, Runtime, compiled, Catalog, Search 파일은 writer가 파생한다.
시험지 v2에서 필요한 메타 projection을 생성할 수 있지만 canonical maintenance는 `question_metadata.json`,
identity와 기존 Runtime records를 바꾸지 않는다. 두 경로 모두 DB/Catalog/Search 재생성 및 해당 정적 값 대조가
실패하면 commit/push하지 않는다. 성공한 요청은 inbox에서 제거하고 영수증을 보존하며 workflow_dispatch로 수동 재실행할 수 있다.

GitHub Actions의 `tools/ci/reviewed-meta-register-pass.sh`는 승인된 inbox 요청을 임시 보관한 뒤 시험지 등록 테스트,
DB/UID/index/Catalog/readiness 재생성, archive/catalog/canonical 검증, 요청별 projection/maintenance verify와 `git diff --check`를 수행한다.
등록 pass는 push하지 않는다. Actions가 결과를 push한 뒤 `tools/ci/verify-registered-consumer-approval.sh`가 변경 UID의 effective student consumer 승인을 확인한다.
요청별 static verify, shell pass, post-push consumer approval, remote-main readback과 Pages/browser 상태를 각각 실행 결과대로 기록한다.

새 정본이나 runtime envelope version을 만들었다는 사실만으로 학생 Consumer 검증이 완성되지는 않는다.
Actions의 `build_db.py` 실행/readiness closeout, Catalog/Search 재생성·정적 대조, canonical-only compile check,
maintenance receipt의 `--verify-maintenance`, 실제 main push/readback을 각각 실행 결과에 맞게 기록한다.
브라우저 화면, Pages 배포나 학생 실제 사용 여부는 workflow가 검사하지 않는 한 PASS로 표시하지 않는다.
기존 Consumer의 canonical 범위·Runtime 입력 목록이 새 분류를 지원하지 않으면 그 제약을 별도로 기록한다.

## 검증

현재 Actions는 다음 테스트를 실행한다.

```powershell
node --test tests/archive-reviewed-exam-registration-v2.test.mjs tests/meta-foundation-calculus1-bindings.test.mjs
```

첫 테스트는 격리된 임시 저장소에서 course-generic v2 시험지 등록, 시험지 요청의 native registry change,
exact before/evidence, out-of-scope UID 영향 차단 및 재실행 동작을 확인한다.
두 번째 테스트는 `tests/fixtures/meta-foundation-calculus1/`의 고정 synthetic request와 exact before-crosswalk bytes를 사용한다. Git history나 production inbox에 의존하지 않고, 현재 canonical source가 after 상태여도 request의 before/after witness에 따라 격리 baseline을 재구성한 뒤 적용한다. 2022 미적분I의 50 RPM 경로, 22개 exact binding tuple, direct/family TPL coverage, runtime UID record 보존, 기존 2015 mapping 및 canonical PT/TPL 불변성을 확인한다.
두 테스트는 synthetic plumbing fixture이며 실제 Consumer/Search post-build 검증은 Actions의
`--verify-maintenance` 또는 `--verify-projection` 결과로 별도 확인한다.

`SYNTHETIC_TEST` source fixture와 resolver projection 검사는 등록 plumbing 증거일 뿐, 실제 시험지의
UID별 Meta 분류·정답 승인·REVIEW2/FINAL_QA 통과·학생 화면 확인이 아니다.
