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

### 부분 UID 요청과 내용 지문 재결속

- 일부 문항을 등록하려면 최상위에 `"scope": "PARTIAL_UIDS"`를 넣고 `items`에 대상 UID만 적는다. `expectedQuestionCount`는 실제 시험지 전체 문항 수다. 빈 요청, 시험지 밖 UID, 중복 UID·순번, UID와 순번의 불일치는 거부한다.
- `expectedSourceBlobSha1`에는 현재 원본 blob을 적는다. 부분 요청에서 `after.sourceFingerprint`를 제출할 때는 항목에 `"rebind": { "priorSourceBlobSha1": "...", "priorContentFingerprint": "..." }`가 필요하다. 해당 과거 blob이 실행 환경의 Git에 있어야 한다.
- 등록기는 과거 blob의 같은 순번 문항에서 원본·내용 지문을 다시 계산한다. 보관된 원본 지문은 과거 또는 현재 판본과 맞아야 하며, 발문·보기·그림 참조의 내용 지문이 달라지면 거부한다. 기존 `before`·`after` 지문과 `identityBefore` 검사도 유지한다. 전체 요청은 기존 방식 그대로 처리하며 `rebind`를 명시하면 같은 추가 검사를 받는다.
- 부분 영수증의 `totalQuestions`와 `appliedRecords`는 요청 UID만 센다. `scope`, `partialUidCount`, 원시험 분모인 `expectedQuestionCount`가 추가되며, 재실행과 소비자 검사도 이 UID 범위를 사용한다.
- AutoMeta는 부분 영수증의 원시험 분모·선택 UID 집합·각 순번과 지문을 실제 source/identity에 대조하고 UID로 현재 행을 찾는다. 원본 바이트, 승인 근거, 현재 metadata/runtime까지 모두 일치할 때만 기존 native 승인을 유지하며, 생략한 UID에 이 승인을 확대하지 않는다. 전체 등록 영수증은 기존 형식을 유지한다.
- AutoMeta cursor 이후 해설만 수리한 경우에는 `PARTIAL_UIDS` `FINAL_QA` 영수증의 해당 UID `fingerprintRepairs`가 이전 metadata/identity 지문, 현재 두 지문, `rebind`의 실제 과거 Git blob과 정확히 연결되어야 한다. 과거 blob의 같은 순번이 cursor의 학생 payload와 같고 `solution` 외 학생 필드가 모두 그대로인 경우만 이미 발급된 승인을 재사용한다. 변경된 발문·보기·정답·그림·표시번호나 빠진/다른 UID의 수리 증거는 이 경로로 승인하지 않는다.
- 원본 `questionUid`에 남은 `파일 basename|양의 원번호` 형식은 별도 좁은 어댑터로만 읽는다. 실제 bank의 번호·alias가 유일하고 identity records 및 canonical UID/파일+순번/파일+원번호/legacyQKey lookup이 모두 같은 UID를 가리켜야 한다. 상충하는 표시번호나 임의의 unknown/canonical UID는 계속 거부한다. 원본 alias는 수정하지 않고, 등록·영수증·Runtime에는 canonical UID를 사용한다.

### 현재 원본을 실제로 검토한 부분 지문 수리 `item.sourceReview`

현재 source의 발문·그림 등이 이미 검토되었지만 metadata/identity 지문만 그 이전 판본에 남아 있으면,
내용 불변을 요구하는 `rebind`로 처리하지 않는다. `FINAL_QA` 메타 요청의 `PARTIAL_UIDS` 항목은 다음처럼
원래 검토 파일과 검토 Git commit을 명시할 수 있다. `sourceReview`와 `rebind`/`approval.sourceRebind`는 함께 쓰지 않는다.

```json
{
  "sourceReview": {
    "schemaVersion": "archive-reviewed-source-reassessment-v1",
    "reviewCommit": "40자리 실제 검토 commit",
    "reviewPath": "그 commit 안의 원래 검토 JSON 경로",
    "reviewRef": { "path": "현재 checkout의 수정하지 않은 원검토 JSON 사본", "sha256": "실바이트 SHA-256" }
  }
}
```

`reviewRef`는 승인과 해당 item의 `evidenceRefs`에 모두 포함한다. 등록기는 현재 사본과 실제 Git commit의
원검토 바이트가 같은지 검사한다. 임의의 지문·검토 완료 문장이나 다시 만든 승인 JSON으로 대체할 수 없다.
지원하는 native 입력은 `m3-s2-complete-semantic-review-v1`, `m2-s1-meta-review-v1`, `m2-s2-meta-review-v1`이다.
M3는 `sourceAfterBlob`/`sourceAfterSha256`가 그 검토 commit의 실제 source와 일치해야 한다.
M2는 `baseSha`의 실제 source blob과 `sourceGitBlobSha`를 대조하고, 검토 commit의 source도 별도로 읽는다.
source 객체·검토 commit을 읽을 수 없는 실행 환경은 거절한다. writer/CI의 전체 Git history 및 원검토 branch 참조를 보존한다.

원검토의 전체 문항 수·UID·순번이 유일해야 하며 대상 행은 확정된 의미 판정과 실제 `decisiveStep`/`after`를 제공해야 한다.
M2의 `REGISTRATION_PENDING` 표기만으로 확정 필드를 버리지는 않으며 `rpmDecision`·`fieldReview`·`after`·`finalDifficulty`를 직접 읽는다.
명시적인 원문·해설·그림·난도 hold, 미확정 판정, 원검토와 다른 요청값은 거절한다. 일반 FINAL_QA는 최종 메타 행을 다시 등록하므로
원검토가 확정한 등록기 지원 의미·난도 필드가 `final`에서 모두 일치해야 한다. 검토된 PT/TPL 교정을 `after`에서 생략하여 옛값을
재승인할 수 없다. L1~L4 표시명은 기존 정본 검증을 계속 받으며, 등록기 계약 밖의 native 보조 필드는 임의로 생성하지 않는다.
교육과정·과목 식별자는 현재 원본이나 기존 메타의 명시값을 유지하며 원검토가 명시한 값과도 일치해야 한다.

`primaryMethod`/`decisiveStep`을 운반할 때는 native `after`, native 항목의 같은 필드, 검토 commit source의 같은 필드 순으로
실제 값을 찾는다. 요청 `after`와 source에 선언된 값, 최종 metadata는 그 값과 완전히 같아야 한다. native에 별도 `primaryMethod`가
없으면 원검토 `decisiveStep` 문자열을 source와 요청의 두 필드에 그대로 실은 경우만 허용하며, 영수증에는
`NATIVE_DECISIVE_STEP_VERBATIM`으로 기록한다. 별도 주풀이 판정이나 새 독립 검수로 기록하지 않는다. `rationaleBindings`는
각 값의 출처와 SHA를 보존하며, 요청에서 필드를 빼서 상충하는 기존 rationale를 유지하는 경우는 거절한다.

`rpmPrimaryId`/`rpmPrimaryPath`/`rpmL1~rpmL4`도 native `after`의 확정값 또는 검토 commit의 source에 이미 있고 현재 source와
완전히 같은 값만 운반한다. `rpmBindings`에는 출처와 정렬 JSON 값의 SHA를 기록한다. 새 `rpmPrimaryId` 입력은 source의
명시값과 같아야 하고, 현행 crosswalk의 유일한 record ID·교육과정/과목·RPM 경로 및 LOCKED master의 실제 경로와 일치해야 한다.
다른 별칭 경로·flat 필드와의 충돌도 거절한다. 영수증 `rpmPrimaryBindings`는 두 정본 파일의 SHA와
`authorityUse: RPM_PATH_PROVENANCE_ONLY`, `selectsPtTpl: false`를 보존한다. 이 ID는 RPM 경로의 출처이며,
단일 crosswalk TPL을 새 의미 판정으로 강제하지 않는다. 원검토가 확정한 PT/TPL과 현재 ACTIVE 정의·TPL 부모·정확한 과정 바인딩의
기존 검증은 별도로 유지한다. RPM 경로 운반은 신규 키·binding 또는 수학 검토를 생성하지 않는다.

발문 별칭·원번호·보기·정답·해설·그림/SVG 참조·레이아웃 등 학생 payload를 실제 검토 source와 현재 source에서 직접 대조한다.
검토 이후의 해설 수리나 그림 변경을 과거 검토로 승인하지 않는다. 현재 blob, `before`/`after` 두 지문 및 `identityBefore`의
기존 검사는 그대로 수행한다. metadata 지문은 현재와 맞고 identity만 오래된 경우에도 이 검토 결속과 기존 메타/정본 검증이 필요하다.
원본 JS를 쓰지 않으며 생략한 UID는 그대로 둔다. 영수증은 검토 schema/commit/경로/SHA·source blob·UID·학생 payload SHA와
`newMathematicalQa: false`를 보존한다. 이 경로가 새 수학 독립 검수나 REVIEW2 2회 통과를 생성하지 않는다.

#### 원 의미 검토와 이후 그림 검토를 각각 결속하는 `rendererProof`

M3 원검토 이후 그림이 바뀌었고 실제 metadata/identity 지문은 원검토보다도 오래된 경우에는
`sourceReview.rendererProof`를 명시할 수 있다. 원 `reviewCommit`·`reviewPath`·`reviewRef`와 native `after`는
그대로 유지하고, 원검토의 학생 payload가 보존된 그림 변경 직전 source, 독립 시각 검토를 마친 현재 source,
각 시점의 실제 asset 바이트를 별도로 검사한다. 요청의 `before` 또는 `identityBefore`를 그림 변경 직전 지문으로
바꾸지 않는다. 기존 첫 등록 그림 재사용 계약과도 별도인 명시적 경로다.

```json
{
  "rendererProof": {
    "schemaVersion": "archive-reviewed-current-renderer-continuity-v1",
    "reviewCommit": "독립 그림 원문과 manifest가 실제 존재하는 40자리 commit",
    "reviewRef": { "path": "결속 manifest JSON", "sha256": "원시 SHA-256" }
  }
}
```

manifest는 `archive-reviewed-renderer-continuity-evidence-v1`,
`NATIVE_SEMANTIC_REUSE_WITH_INDEPENDENT_CURRENT_RENDERER` 범위를 명시한다. 원시험 분모, 선택 UID·순번,
원검토 commit/경로/SHA와 native item SHA, 그림 변경 전·후 같은 source 경로의 commit/blob/원시 SHA/문항 SHA,
실제 독립 검토 원문 참조가 필요하다. manifest와 원문 참조는 승인과 선택 item의 `evidenceRefs` 양쪽에 포함한다.
모든 JSON은 로컬 사본과 명시한 Git commit의 실제 바이트가 같아야 한다. 새 전체 QA·REVIEW2 횟수·메타 및 난도
판정은 각각 false 또는 0으로 기록한다. 현재 `PARTIAL_UIDS` `FINAL_QA`의 원 M3 검토만 지원하며,
`rebind`, `sourceRebind`, 별도 `registrationMode`, `proposalFinalization`을 함께 사용하지 않는다.

등록기는 원검토와 그림 변경 직전 source의 학생 payload가 같은지, 변경 직전부터 현재 snapshot까지의 전체
문항 필드 차이가 허용된 그림 필드뿐인지 직접 검사한다. `content`는 img src 교체만 허용한다. 현재 작업 source의
학생 payload는 독립 검토 snapshot과 같아야 한다. 별도로 운반하는 governed metadata는 기존 native `after`·
현행 정본·난도·source parity 검사를 그대로 받는다. 발문 조건, 보기, 정답, 해설, 원번호 또는 메타 판정을
그림 변경으로 처리할 수 없다.

정규화된 PASS 문장만 읽지 않고 지원하는 독립 작성 원문을 직접 대조한다. 원문에 결속된 모든 이전·현재
renderer 자산은 해당 source가 참조하는 전체 집합과 일치해야 하며, Git blob과 SHA뿐 아니라 현재 파일의
실제 바이트도 같아야 한다. 같은 경로의 자산이 원검토와 그림 변경 직전 사이에 바뀐 경우도 거절한다.
외부 SVG 의존 경로는 허용하지 않는다. 명시적인 해설 그림 정정 원문은 승인된 선 노드 제거·설명 교체만
바이트 단위로 재현하며, source의 지정된 그림/alt 외 필드와 다른 문항은 모두 보존해야 한다.

영수증은 `sourceReview.rendererContinuity`에 두 source snapshot, 원검토·독립검토 참조, 실제 자산 SHA,
변경된 renderer 필드와 학생 payload SHA를 남긴다. 동일 요청 재실행도 이 명시적 proof가 있는 항목은
원래 before 값, 현재 정본 정의, 모든 독립 근거·자산을 다시 검사하고 저장된 전체 sourceReview proof와
정확히 비교한다. source JS가 그대로인 asset-only 변경이나 영수증 proof 삭제도 거절한다.

공식 writer는 `<requestId>.renderer-binding.json` 보조 증거를 함께 생성한다. schema는
`archive-reviewed-renderer-binding-v1`이며 실제 request SHA·source blob/raw SHA·원시험 분모·부분 선택 수와
그림 대상 UID/순번별 전체 sourceReview 및 fingerprint repair의 정렬 JSON SHA를 저장한다. 이 경로는
그림 대상 metadata/runtime의 `approvalEvidence`에만 추가되고, 원 영수증의 `outputDigests`에 실제 파일 SHA로
결속된다. 원 before·identityBefore도 전체 repair SHA에 포함한다. 재실행은 보조 파일·digest·선택 집합·현재 승인
evidence를 모두 검사한다. 따라서 영수증의 renderer proof와 manifest 참조가 함께 누락되어도 이미 승인된 행에
남아 있는 typed 증거 경로를 기준으로 거부할 수 있다. 다른 문항과 기존 일반/첫 그림 재사용 영수증은 바꾸지 않는다.

#### 원검토의 CC·TPL 제안을 별도 독립 정의 검토로 확정

원검토에 남은 의미 제안은 `REGISTRATION_PENDING`이라는 상태만 지우거나 `native.after`를 다시 써서 승인하지 않는다.
`sourceReview.proposalFinalization`은 원 native proposal의 정확한 ID와 별도 독립 정의 검토를 결속한다.
지원 범위는 `m2-s2-meta-review-v1`의 CC 추가, `m3-s2-complete-semantic-review-v1`의 빈 TPL 확정이다.
미등록 PT, 다른 종류의 의미 제안, 새로운 학생 내용이나 난도 판정에는 적용하지 않는다. 실제 exact binding과 공식 영수증을
기다리는 기술 부채는 기존 정본 등록기로 해결하며, 미확정 의미 제안이 있는 행을 FINAL_QA로 조용히 재승인할 수 없다.
M2 `TERM` 제안은 별도 4슬롯 용어 계약의 대상이며 이 메타 등록기의 필드 허용 목록으로 등록되지 않는다.
M3의 `EXISTING_ACTIVE_CROSSWALK_CONNECTION`, `REUSE_ACTIVE_ADD_CROSSWALK`, `EXISTING_ACTIVE_LINK_GAP`,
`RPM_LEAF_LINK_PROPOSAL`, `RPM_LEAF_GAP_ACTIVE_TEMPLATE_REUSE`는 원 native.after와 제안이 같은 기존 PT/TPL을 명시하고, 등록 전·후의 정본 정의가
모두 ACTIVE·동일하며 TPL 부모도 맞을 때만 기술적 연결 부채로 분리한다. 무ID 재사용 행도 원 proposal 문서/행 SHA와
지원 UID·순번으로 결속한다. 기존 정본이 없거나 이번 요청에서 정의를 바꾸는 경우, 추가 CC·Condition 의미 제안이 남은
경우는 이 경로로 통과할 수 없다. 최종 과정 exact binding 검증은 그대로 수행하고 `technicalProposalBindings`에 기록한다.
이는 새 RPM 잎을 등록하거나 의미 경계 교차검토를 대신하지 않는다. `BOUNDARY_REVIEW`는 별도 확정 근거 없이 해소하지 않는다.

```json
{
  "proposalFinalization": {
    "schemaVersion": "archive-native-proposal-finalization-v1",
    "finalizationCommit": "원격에서 보존하는 독립 증거의 실제 Git commit",
    "finalizationRef": { "path": "독립 정의 검토 JSON 경로", "sha256": "실바이트 SHA-256" },
    "proposalIds": ["원 native의 정확한 proposal ID"],
    "registryChangesRef": { "path": "CC 등록 변경 제안 JSON 경로", "sha256": "실바이트 SHA-256" }
  }
}
```

모든 ref 경로는 `finalizationCommit`의 같은 경로에 있는 원문과 현재 checkout에서 바이트가 같아야 하며 승인 및 item의
`evidenceRefs` 양쪽에 포함한다. TPL은 `registryChangesRef` 대신 `proposalMappingRef`와 `sourceBindingRef`를 사용한다.
CC 증거는 `archive-cross-concept-narrow-definition-finalization-v1` 및
`archive-reviewed-cross-concept-registry-change-proposal-v1`을, TPL 증거는
`archive-independent-exact-template-finalization-review-v1`,
`archive-m3s2-exact-type-finalization-review-request-v1`,
`archive-exact-template-finalization-source-binding-v1`을 그대로 결속한다.

등록기는 원검토 commit의 실제 proposal 문서·SHA, 지원 UID/순번, native item 전체, 현재 학생 payload와 독립 검토의
source commit/blob/원문 SHA·문항 SHA를 대조한다. 로컬 과거 검토 commit 표기를 원격 commit으로 바꾸지 않는다.
별도 published-source binding이 그 과거 증거의 정확한 source blob/SHA와 실제 접근 가능한 commit을 연결해야 한다.
문항 그림과 해설 그림 등 renderer 자산은 원 native commit·독립 검토 source commit·현재 파일 바이트가 모두 같아야 한다.
지원하지 않는 자산 형태, 외부 URL, 변경된 같은 경로의 그림은 거절한다.

CC는 native가 확정한 기존 배열을 순서까지 유지하고 독립 검토가 그 UID에 확정한 키만 추가한다. native `after`에 CC 배열이
생략되었으면 검토 commit과 검토 baseline에 명시된 동일 배열이 있어야 한다. TPL은 native의 빈 값을 같은 승인 PT 아래의
정확한 제안 키로만 채운다. 확정 정의는 `before: null`인 add-only registryChanges 또는 현재 설치된 완전히 같은 정본 행과
일치해야 한다. 다른 정의를 치환하거나, 별도 지원 UID까지 자동 승인하거나, 기존 CC를 삭제할 수 없다.

확정 필드는 요청 `after`·현재 source·최종 metadata에 모두 명시적으로 일치해야 하며, 그 밖의 native 확정 필드·현재
ACTIVE 정의·TPL 부모·exact 과정 binding 검증은 유지한다. 원 native 문서는 수정하지 않고 검증된 필드만 내부 승인값에
추가한다. 영수증에는 원 native.after SHA, proposal 문서/행 SHA, 독립 증거 commit/ref, source/asset 결속 및 확정 필드를
별도로 보존한다. 이 증거가 새 수학 QA나 REVIEW2 승인으로 바뀌지 않는다.

#### ID가 없는 원제안과 현재의 좁은 정의 판정

`archive-native-proposal-finalization-v2`는 위 v1을 대체하지 않는 별도 명시 계약이다. 원제안에 ID가 없으면 새 ID를
만들지 않고, 원문 문서의 SHA·배열 index·canonical JSON SHA·지원 UID·원번호의 정확한 tuple로 결속한다. 원래 ID가
있으면 그 ID도 일치해야 한다. 선택한 UID의 모든 의미 제안과 `proposalSelections` 및 독립 검토의 `decisions`가
순서까지 일치해야 하며, 모르는 제안 종류나 미처리 의미 부채를 누락해서 통과시킬 수 없다.

```json
{
  "proposalFinalization": {
    "schemaVersion": "archive-native-proposal-finalization-v2",
    "finalizationCommit": "원격에서 보존하는 실제 독립 증거 commit",
    "finalizationRef": { "path": "finalized-applications.json의 저장 경로", "sha256": "실바이트 SHA-256" },
    "proposalSelections": [{
      "documentRef": { "path": "원 native proposal 문서 경로", "sha256": "원문 SHA-256" },
      "index": 0,
      "proposalSha256": "원제안 canonical JSON SHA-256",
      "questionUid": "정확한 지원 UID",
      "sourceOrdinal": 1
    }]
  }
}
```

독립 증거는 `archive-independent-native-proposal-disposition-v1`이며, 전체 수학 QA·REVIEW2·metadata·난도·학생 내용의
신규 승인을 주장하지 않는다. 실제 원 native item 전체 SHA, 검토자 분리, 현재 source의 Git/blob/raw SHA·문항 SHA와
원 native 대비 학생 payload 불변, 현재 모든 renderer 자산의 원 Git/raw SHA 및 실제 시각 검토 범위를 검사한다.
`sourceSnapshot.sourcePath`는 요청의 `archive/exams/` 원본 경로와 정확히 같아야 하며, 학생 내용이 같은 다른 파일의
snapshot을 빌려 결속할 수 없다.
텍스트만 있는 문항은 실제 renderer 목록도 비어 있을 때만 빈 자산 목록을 허용한다. 다른 최종 주분류 PT를 새로
만들거나 기존 ACTIVE 부모 정의를 바꾸는 요청은 이 계약으로 처리하지 않는다.

- M3의 명시된 CC/Condition 제안은 독립 검토가 확정한 키만 기존 native 배열 끝에 추가한다. `ADD_ONLY`는 정확한
  `before: null` 정의 요청 또는 이미 설치된 같은 정의와 결속한다. CC의 `REUSE_ACTIVE`는 변경 전부터 존재하고 변경
  후에도 동일한 ACTIVE 정본 행과 결속한다. 다른 검토에서 확정된 CC를 재사용할 때 그 정의의 기존 지원 UID 집합을
  고쳐 쓰지 않는다.
- M3 `BOUNDARY_REVIEW`는 별도 독립 판정으로 원 native와 동일한 기존 ACTIVE PT/TPL을 유지하는 경우만 허용한다.
  분류값을 추가하거나 변경하는 승인이 아니며, 원래 CC·Condition·integrationPattern·난도는 그대로 검사한다.
- M2 `NEW_TPL`은 원 native의 명시 ID, `after.templateKey`의 부재/null/빈값 및
  `activeDefinitionMatch.templateKey: null`, 이미 ACTIVE인 동일 부모를 모두 요구한다. 현재 source의 포괄적인 TPL을
  원검토가 승인한 값으로 오인하지 않는다. 원 독립 검토의 정확한 한 UID·정의·소유 pack·부모와 원 source/assets를
  `independentReviewRef`로 직접 대조하며, 정규화 문서만 작성해 원 검토의 범위를 넓힐 수 없다.

M3 Condition/경계 application은 `independentReviewRef`가 필수이며 원문·현재 source·renderer 및 정확한 승인 정의/기존
주분류 판정을 직접 검사한다. ref 삭제로 원 독립 검토 검사를 생략하는 fallback은 없다. 이 ref와 모든 부속 ref는 실제 `finalizationCommit`의 같은 경로 및
로컬 바이트가 같아야 하고 approval/item 양쪽 evidenceRefs에 들어 있어야 한다. 영수증에 원 독립 ref와 정확한 disposition을
남긴다. 원 native의 내용/해설/난도 HOLD, before/identity/source 지문, 과정 exact binding, 공식 writer와 Consumer 검사는
계속 적용된다.

M3 C그룹의 `artifactRefs["proposals.json"]`도 원 Git SHA로 읽는다. `proposals`와 두 이름이 동시에 있으면 모호성으로
거절한다. 무형식 wrapper 중 원 UID/원번호·두 풀이 근거·debts 전체가 native와 같고, debts가 정확한
`PROJECTION_BINDING_PENDING`이며 동일 ACTIVE PT/TPL을 가리키는 경우만 과거 기술 메모로 분리한다. 영수증의
`declaredCurricula`는 원 제안의 교육과정을 그대로 보존하고 `historicalBindingsResolved: false`로 기록한다. 현재 2015
등록이 원 2022 비교 메모의 바인딩까지 해결했다고 주장하지 않으며, 알 수 없는 debt·새 필드·다른 분류는 거절한다.

### 승인 메타를 보존하는 identity 지문만의 수리

현재 metadata의 두 지문이 실제 source와 이미 일치하고 identity 지문만 오래된 경우, v2 요청에
`"registrationMode": "IDENTITY_FINGERPRINT_ONLY"`와 `"scope": "PARTIAL_UIDS"`를 명시한다. `FINAL_QA`와 위 `sourceReview`의
동일한 실제 원검토·Git·UID·현재 학생 payload 결속이 필요하다. 등록 정본 변경은 허용하지 않는다.

- 각 item의 `before`/`after`에는 현재 metadata와 정확히 같은 `sourceFingerprint`와 `contentFingerprint` 두 필드만 쓴다.
  현재 metadata에 기존 승인 상태가 있어야 하고, `identityBefore.sourceFingerprint`에는 실제 오래된 identity 값을 적는다.
  임의의 의미값·난도·후보·typeHold 변경이나 이미 일치하는 identity의 불필요한 수리는 거절한다.
- 공식 writer는 `question_identity_map.json`의 해당 지문과 수리 영수증만 쓴다. 원본 JS, metadata 전체 바이트·승인 상태·남은 hold,
  Runtime 및 정본은 보존한다. 이 모드에서는 원검토의 새 의미값을 등록하지 않으며 승인 수가 증가하지 않는다.
- 영수증 schema는 `archive-reviewed-identity-fingerprint-repair-v1`이고 `metadataRegistrationStatus: PRESERVED_WITHOUT_NEW_APPROVAL`,
  `metadataChanged: false`, `newMetadataApprovals: 0` 및 metadata 전후 SHA를 보존한다. 일반 의미 등록 영수증으로 해석하지 않는다.
  두 번째 파일 쓰기가 실패하면 identity 쓰기도 되돌린다.
- 재실행은 해당 UID/현재 source·metadata 두 지문/identity/영수증의 일치를 다시 검사한다. 별도 승인 요청이 나중에 변경한 비지문 메타는
  이 수리 영수증이 소유하지 않는다. `--verify-projection`은 실제 resolver와 학생용 ProblemBankMeta 검색에서 UID와 두 지문을 확인하고,
  새 의미 승인 없이 수리된 source binding만 검증한다. 기존 소비자 충돌은 면제하지 않는다.

### Generated 확장 키(EXT-*) — 사용은 허용, 정본 승격 없음 (2026-11-02)

유사시험지 등 Generated 문항은 정본에 없는 개념·조건을 `EXT-CROSS-*`/`EXT-COND-*` 확장 키로 쓴다
(`Archive_Correction_Owner_EndToEnd_Closeout_CURRENT_v1` §3). 이유: 확장 키를 등록기가 거부하면 같은 시험지의 정상 문항까지 등록되지 않았다.
등록기(`resolve()`)는 `crossConceptKeys`/`conditionKeys`에 한해 아래를 모두 만족하는 EXT 키만 받는다. 하나라도 어긋나면 이전처럼 거부한다.

- `archive/data/archive2-extension-keys.json` 색인에 `status: GENERATED_ACTIVE`, `canonicalPromoted: false`, 필드에 맞는 `kind`(cross/cond)로 올라 있다.
- 색인이 가리키는 원본 registry가 `archive/data/meta-foundation/extensions/` 아래에 있고, 그 파일이 `GENERATED_ACTIVE*`이며 키를 정확히 한 번 정의한다.
  원본 항목은 `status: GENERATED_ACTIVE`, `canonicalRpmPromotion: false`(명시적 false)여야 한다. 색인은 파생물이라 낡을 수 있으므로 원본을 다시 확인한다.
- 정의가 실재하는 ACTIVE 정본 부모(CrossConcept `parent.conceptKey`/`parentKey`, Condition `parent.conditionKey`/`parentKey`)를 가진다.
- 정의의 교육과정·과목이 문항의 `curriculum`/`standardCourse`와 같다(공백만 다른 표기는 같은 과목).

PT/TPL에는 확장 키를 받지 않는다. 확장 키는 정본 registry·compiled·RPM LOCKED·색인·원본 registry에 쓰지 않으며(`registryChanges` 불필요), 영수증에
`generatedExtensionKeys`(키, 종류, 부모, registry 경로와 SHA-256, 사용 UID)만 남긴다. 확장 키가 없는 요청은 색인을 읽지 않는다.
`META_PIPELINE_AUDIT`의 감사 입력은 계속 `CC_` 정본 키만 허용한다.

소비 쪽 계약: catalog 빌더는 정본 concept/condition registry에 없는 키를 가진 문항에 `foundationTaxonomy` 충돌을 표시하고 `advancedEligible`에서 뺀다.
기본 선택(`basicEligibility`)과 정본 부모(L1/L2)는 그대로라서, 확장 키 문항은 쓸 수 있지만 정본 고급(L3/L4) 승인으로 세지지 않는다.
`--verify-projection`은 그 충돌을 "확장 키 때문"일 때만(등록기 `resolve()`로 문항 전체 분류를 다시 검증) 허용하고 `consumerLanes.generatedExtension`으로 센다. 다른 충돌은 그대로 막는다.

### FINAL_QA 원본 재결속 `approval.sourceRebind` (2026-11-02)

등록 뒤 원본 JS 바이트가 바뀌어(해설 그림·소제목 표기 등) 영수증 `sourceRawSha256`이 catalog 해시와 어긋나면 Archive2 영수증 루프가 그 시험지를 건너뛰어 고급(L3/L4) 승인이 0이 된다.
이유: 이때 FINAL_QA 요청을 그대로 쓰면 META_PIPELINE_AUDIT로 등록된 행의 EVIDENCE_DEBT(difficulty/integrationPattern null)와 부모 L1/L2 증거를 채울 값이 없어 거절되고,
승인값을 새로 만들면 검수 우회가 된다. 그래서 값을 하나도 바꾸지 않는 재결속만 따로 허용한다.

- 요청: `approval.type: FINAL_QA`, `approval.sourceRebind: { priorReceiptRef: { path, sha256 } }`(같은 `evidenceRefs`에도 포함), `registryChanges` 없음, 모든 item은 `before: {}`, `after: {}`.
- 등록기는 이전 영수증이 같은 시험·원본·문항 수이고 원본 바이트가 실제로 달라졌는지, 현재 메타 행이 이전 영수증 `appliedRecords`와 문항별로 완전히 같은지 확인한다.
  허용되는 유일한 값 차이는 이후 5단계 난이도 intake(`register-difficulty5.mjs`)가 영수증의 null `difficultyBucket`을 채운 필드(`difficultyBucket/difficultyConfidence/difficultyBoundaryFlag/legacyLevelCompatibility`)다.
- 문항 `sourceFingerprint`(지문·보기·정답·해설·image 결속)가 메타와 같아야 한다. 어느 하나라도 바뀐 문항이 있으면 요청 전체가 거절되므로 그 문항은 요청에서 빼고 재검수한다.
  source JS의 `sourceFields`는 메타와 같아야 하며, 예외는 `subUnit` 표기가 같은 `subUnitKey`의 정본 라벨일 때뿐이다.
- 기존 Runtime 행은 `metadataRevision`/`approvalEvidence`만 다르게 재사용한다. 갱신되는 것은 메타 행의 `metadataRevision`·`approvalEvidence`와 새 영수증·Runtime 행뿐이며,
  `metadataApprovalType`, `fieldStatus`, `tagConfidence`, EVIDENCE_DEBT는 등록 당시 그대로 둔다(새 의미 검수를 했다고 기록하지 않는다).
- 요청 근거로 승인 시점 바이트와 현재 바이트를 문항별로 비교한 `*.review.json`을 둔다(바뀐 필드 목록, 문항별 fingerprint 일치).
- `PARTIAL_UIDS` 재결속은 이전 영수증도 `PARTIAL_UIDS`/`FINAL_QA`이고 전체 시험 분모와 선택 UID·ordinal 집합이 정확히 같을 때만 허용한다. 이전 Git source blob이 실제 존재하며 선택 문항 전체 객체(표시 번호·렌더러 필드·명시 메타 포함)가 현재와 같아야 한다. 같은 파일의 다른 문항 변경으로 깨진 파일 해시만 다시 결속한다.
  이전 영수증의 선택 identity/runtime는 현재와 완전히 같아야 하고, 비선택 UID·HOLD는 변경하지 않는다. 기존 `metaFoundationPackVersion`·승인 종류·fieldStatus를 유지하며 결과·영수증·replay에 `newMetadataApprovals: 0`, `preservedMetadataApprovals: 선택 수`를 구분해 기록한다. 이전 FULL 또는 다른 승인 종류를 PARTIAL 재결속으로 변환하지 않는다.

### `META_PIPELINE_AUDIT` 승인 유형

`META_PIPELINE_AUDIT`는 Gemini의 심화 메타 감사 인계를 등록하는 별도 유형이다. 이 유형은 FINAL_QA 또는 REVIEW2로 변환하지 않으며, 시험지의 최종 수학·해설 QA 상태를 승인하지 않는다. 요청은 다음을 제공한다.

SOP v1.2의 기존 원본에 예전 단원 네임스페이스가 남아 있으면, 문항 메타가 `registration_pending_semantic_review`이고 원본과 현재 메타의 해당 값 및 `sourceMetadataBefore`가 정확히 일치하는 경우에만 SHA 결속 교정 검토의 정본 단원으로 재지정한다. 교정 사유, 정본 단원·세부단원 표시명, 원본과 대상 과목의 동일 owner pack 범위를 검증하며 FINAL_QA/REVIEW2 값을 덮지 않는다. 이유: 원본 텍스트를 바꾸지 않고 감사된 단원 네임스페이스를 바로잡기 위해서다. 발문·보기·해설 HTML에 직접 포함된 이미지와 SVG도 그림 유형 판정에 포함한다.

- `approval.metaPipelineAudit.schemaVersion` is `"meta-pipeline-audit-approval-v1"` for the rich `ALIVE_META_AUDIT_ATOMIC_v3` input, `"meta-pipeline-audit-approval-v2"` for paired key-only audit/classification inputs, or `"meta-pipeline-audit-approval-v3"` for the paired `sourceDriveId` flat v3 audit and `ALIVE_CANDIDATE_CLASSIFICATION_v3` input. `"meta-pipeline-audit-approval-v4"` is the SOP_v1.2 `META_AUDIT_ATOMIC_PACKAGE` audit with its SHA-bound corrective review.
- `approval.metaPipelineAudit.sourceFileDriveId`
- `approval.metaPipelineAudit.auditPackageRef`, `manifestRef`, `sourceParityRef`: 정확한 Drive 산출물 JSON 바이트와 source-parity report를 저장소 evidence 경로에 보존한 `{path, sha256}` 참조. 세 참조 모두 `approval.evidenceRefs`에도 포함한다.
- 감사 패키지는 `ALIVE_META_AUDIT_ATOMIC_v3`, `ALL_APPROVED_CANONICAL_STANDARDIZED`, `READY_FOR_COURIER_REGISTRATION`, N/N 승인, zero hold, zero template inflation을 만족해야 한다. `sourceSha256`는 매니페스트의 Drive source SHA와 일치해야 한다.
- rich 감사의 `canonicalTemplatesReused`는 전 문항의 TPL 바인딩 수 또는 실제 records의 고유 TPL 키 수와 정확히 일치해야 한다. 두 집계 방식만 수용하고 전 문항의 ACTIVE PT/TPL·부모·정본 근거 검증 및 `newTemplatesCreated: 0`은 유지한다. 원본 통계값은 수정하지 않는다.
- 구형 `META_AUDIT_ATOMIC_PACKAGE_v2`는 `CANDIDATE_CLASSIFICATION_v2`를 추가 SHA-bound `classificationRef`로 함께 보존한다. 두 JSON의 시험지명·Drive source ID/SHA·문항 수·ordinal별 단원/PT/TPL/CC/Condition/difficulty 값이 일치해야 하며, final audit의 모든 ordinal은 `auditStatus: APPROVED`, 0 hold, 0 template inflation이어야 한다. 이 형식은 감사 패키지와 현재 Drive 원본 SHA가 다르면 최종 감사 excerpts가 없으므로 차단한다. Drive 원본과 production JS의 raw SHA가 다르면 기존 per-UID student-payload parity 증명을 요구한다.
- `ALIVE_META_AUDIT_ATOMIC_v3`의 key-only flat 변형은 `boundAtomicCrossConcepts`가 키 문자열 배열이고 record에 nested `classification`이 없을 때 `CANDIDATE_CLASSIFICATION_PACKAGE_v2`와 함께 `meta-pipeline-audit-approval-v2`로 등록한다. 이 변형의 per-qid `readingEvidence`는 보존하고, 모든 ordinal의 classification·manifest·source binding을 확인한다. richer v3 audit는 handoff metadata와 definition objects를 포함하는 기존 approval v1 경로를 사용한다.
- 새 `sourceDriveId` flat v3 변형은 root의 `totalQuestions/totalApproved/totalHold/auditStatus`, row의 `auditVerdict/difficulty/readingEvidence`, 그리고 짝을 이룬 `ALIVE_CANDIDATE_CLASSIFICATION_v3`의 분류값을 대조한다. 시험지명·Drive source ID/SHA·N/N·ordinal·모든 PT/TPL/CC/단원·난이도 근거·발문 및 풀이 발췌가 audit, classification, manifest와 현재 production source에서 일치해야 한다. 이 스키마에 없는 visual-check 필드는 등록기가 보충하거나 확인했다고 주장하지 않는다. 해당 source schema의 모든 행이 `APPROVED_CANONICAL`이고 hold가 0일 때만 내부 통계 어댑터가 기존 denominator gate에 필요한 수치를 정규화하며, Git 정본 승격 수와 Gemini의 template inflation 수를 혼동하지 않는다.
- classification이 중복 `readingEvidence`를 생략한 실제 flat v3 입력은 최종 audit의 UID별 발문·풀이 발췌를 production source에 직접 대조한다. classification이 발췌를 제공하면 두 텍스트 발췌는 최종 audit와 같아야 하며, 버킷·confidence·reason과 분류 바인딩은 항상 일치해야 한다. 생략된 classification 증거를 복사해 원래 작성자의 독립 검수로 기록하지 않는다. 보충감사가 제공한 visual-check 상태는 row별 checked/notChecked/notProvided 분모로 영수증에 보존한다.
- SOP_v1.2 `META_AUDIT_ATOMIC_PACKAGE` 네이티브 입력은 `manifestType`, `sopVersion: "SOP_v1.2"`, `auditRecords`, `auditPassedCount`, `holdCount`, `auditStatus: "AUDIT_COMPLETE_100_PERCENT_PASS"`와 `COURIER_INTAKE_MANIFEST`의 `recordsToBind`만 가진다. 이 입력에는 `readingEvidence`가 없으므로 `meta-pipeline-audit-approval-v4`는 SHA 결속된 `correctiveReviewRef`를 필수로 받는다. 이 참조가 없거나 `approval.evidenceRefs`/각 item 근거에 없으면 등록하지 않는다.
- SOP_v1.2 corrective review(`archive-meta-pipeline-sop-v12-corrective-review-v1`)는 다음을 실제 값으로 제공해야 한다: `sopVersion: "SOP_v1.2"`, `examTitle`, `examSlug`, `sourceArchiveFile`, `sourceFileDriveId`, `originalDeclaredSourceSha256`, `excerptBasis: "CURRENT_PRODUCTION_SOURCE"`, `productionSourceSha256`, `sourceHashDrift`, `questionCount`, `reviewer: { id, role: "ROOT" | "AUTHORIZED_REVIEWER" }`, `reviewedAt`, `rows[]`. 각 row는 `questionUid`, `sourceOrdinal`, `auditQuestionNumber`, `problemTypeKey`, `templateKey`, `crossConceptKeys`, `standardUnitKey`, `subUnitKey`, `sourceTextExcerpt`, `solutionDecisiveExcerpt`, `visualEvidence: { assetChecked, visualType }`를 가진다.
- review의 발췌는 현재 production source의 `content`/`solution`에 실제로 포함되어야 한다. `difficultyReasonTrace`나 감사 설명 문장을 발췌로 재사용할 수 없고, 발췌를 대신 만들어 넣지 않는다. `visualType`은 현재 source asset에서 계산한 실제 상태(`IMAGE`, `SVG`, `SVG_IMAGE`, `NONE`)와 같아야 하며, `assetChecked`는 검토자가 기록한 checked/notChecked만 영수증에 남기고 등록기가 시각 검수를 대신했다고 기록하지 않는다.
- `originalDeclaredSourceSha256`은 audit/manifest의 `sourceFileSha256`에 결속되는 감사 시점 선언값이고, `driveSourceSha256`은 실제 현재 Drive 바이트, `productionSourceSha256`은 실제 현재 production 바이트의 SHA-256이다. `driveSourceSha256`과 `productionSourceSha256`은 서로 같아야 하며 `parityBasis: "EXACT_SOURCE_SHA256"`/`status: "EXACT_STUDENT_VISIBLE_PARITY"`로 증명한다. `sourceHashDrift`는 `originalDeclaredSourceSha256 !== driveSourceSha256`의 실제 비교 결과와 같아야 한다. 원본 선언 SHA는 절대 덮어쓰지 않으며 영수증은 세 SHA를 모두 보존한다. 선언 SHA와 현재 SHA가 달라도 corrective review가 현재 발췌를 제공하고 per-UID student-payload parity가 있으면 등록할 수 있다.
- `sourceFileSha256`와 무관하게 `difficultyRank`는 1~5 `difficultyBucket`이 아니다. SOP_v1.2 경로는 bucket을 계산·추론하지 않고, 기존 유효 bucket은 보존하며 값이 없는 UID는 `unreviewedFields`의 `EVIDENCE_DEBT`로 남긴다. `auditRecords`는 Condition 증거를 포함하지 않으므로 기존 `conditionKeys`를 그대로 보존하며, v4는 Condition을 승인하거나 변경하지 않는다(변경 시 fail-closed).
- 원본 감사 단원/세부단원 표기가 정본과 다른 경우(예: 통계를 뜻하는 `M3-05` vs 정본 `M3-07`, 존재하지 않는 `M3-03-01`) corrective review의 `originalAssignment`는 audit/manifest 값과 정확히 같아야 하고, `correctedAssignment`는 요청 item과 정본 registry에서 검증한다. 두 값이 다르면 UID별 `assignmentCorrectionReason`이 필수이며, 설명 없는 변경은 거부한다. 등록기는 원본 표기에 대한 가짜 master/registry 키를 만들지 않는다.
- SOP_v1.2 감사에는 `newTemplatesCreated`/`canonicalTemplatesReused` 통계가 없다. 등록기는 이를 0으로 합성하지 않고 `templateInflationStatus: "NOT_REPORTED_IN_SOURCE_SCHEMA"`로 영수증에 기록한다. 대신 감사가 명명한 PT/TPL/CC만 add-only로 승격하며, 승격 키 집합이 감사 키와 정확히 일치하지 않으면 거부한다.
- `examTitle`은 사람이 읽는 제목이므로 source basename과 같을 필요가 없다. v4는 `examSlug === basename(sourceArchiveFile, ".js")`를 source identity로 요구하고 audit/manifest/review의 `examTitle`이 서로 같아야 한다. manifest는 `manifestType: "COURIER_INTAKE_MANIFEST"`, `sopVersion: "SOP_v1.2"`, `sourceDriveId`, `sourceFileSha256`, `standardCourse`, `targetPack`, `totalQuestionsToRegister`, `readyForRegistrationCount`, `pipelineStatus: "READY_FOR_COURIER_REGISTRATION"`와 N개 `recordsToBind`를 가져야 하며 각 row의 UID/ordinal·PT/TPL/CC/단원/level/difficulty rank와 `answer`/`questionType`/`choicesCount`/`score`가 audit와 현재 production source에 일치해야 한다.
- `META_AUDIT_ATOMIC_PACKAGE_v2`에는 PT/TPL 정의나 CrossConcept label/definition이 들어 있지 않다. 이 형식의 키가 ACTIVE 정본에 없으면 등록 요청에 정확한 before-null additive 정의와 UID별 source evidence를 제공해야 한다. 정본에 없는 키를 이름만 보고 자동 생성하지 않는다. rich v3 입력의 audited definitions는 기존 v3 승격 검증을 그대로 사용한다.
- 구형 `approved_partial_with_explicit_holds` 원장의 `crossConceptKeys` 필드가 누락/null이고 실제 source에 명시적 배열이 있을 때는 그 source 태그 전체를 순서 그대로 접두부에 보존한 채 SHA-bound 감사가 승인한 CC를 추가 투영할 수 있다. 기존 태그 제거·재정렬이나 fully-approved 원장의 누락 필드 재해석은 허용하지 않는다.
- 감사 통계의 `atomicCrossConceptsBound`는 고유 정의 수 또는 문항별 태깅 총수로 기록될 수 있다. 등록기는 둘 다 실제 `records`에서 다시 계산하고, `boundAtomicCrossConcepts`가 사용된 고유 키 전체와 정확히 일치하는지 별도로 확인한다.
- reading evidence의 `visualType`은 `IMAGE`, `SVG`, `SVG_IMAGE`, `NONE`을 받는다. `SVG_IMAGE`는 같은 문항에 학생용 이미지와 SVG가 함께 있다는 감사 표시이며, source asset bytes는 등록기가 변경하지 않는다.
- 매니페스트는 `COURIER_INTAKE_MANIFEST_v2` 또는 `ALIVE_COURIER_INTAKE_MANIFEST_v3` / `COURIER_INTAKE_MANIFEST_v3`여야 하며, 같은 exam/source identity와 N개 승인 바인딩을 만족해야 한다. v2는 `payloadSummary`의 N/N·zero hold·zero template inflation, `courierAction`, `bindingTarget`를 검증한다. v3는 `totalQuestions=N`, `totalHoldCount=0`, `status=READY_FOR_COURIER_REGISTRATION`를 검증하고, zero template inflation은 반드시 rich audit의 `statistics.newTemplatesCreated=0`과 `canonicalTemplatesReused=N`으로 확인한다. v3 manifest만으로 flat audit 증거 누락을 대체할 수 없다. 실제 source path는 등록 요청 및 parity report의 정확한 production 파일 경로에 결속한다.
- `archive-meta-pipeline-source-parity-v1` 보고서는 Drive source SHA와 현재 production source SHA/blob SHA를 함께 결속한다. qid별 student fields (`id`, 지문, 보기, 정답, 해설, image/SVG 참조, 레이아웃) digest가 같고 source/solution 발췌가 Drive 원본에서 확인되었음을 기록한다. raw JS 메타 필드만 달라 raw SHA가 다를 때도 학생 노출 payload parity가 입증되어야 등록할 수 있다.
- 기존 CrossConcept key는 canonical definition을 변경하지 않는다. audit definition wording이 canonical과 다르면 label이 정확히 같고 동일 개념의 관점 차이라는 qid/개념별 rationale을 `existingConceptReviews`에 기록해야 재사용할 수 있다. 신규로 감사된 PT/TPL/CrossConcept key는 근거·supporting UID/count와 정확한 owner binding을 갖춘 `registryChanges`의 add-only 승격을 지원한다. TPL parent PT가 외부 owner pack에 있어도, 해당 문항의 exact ACTIVE binding owner pack이 TPL owner이고 pack scope가 맞으면 그 문맥 팩에 새 TPL을 추가할 수 있다. 기존 PT 의미·정의는 바꾸지 않는다. 기존 key 의미 수정·삭제는 거부한다. CrossConcept의 label이나 definition이 자기 key 문자열을 그대로 되풀이하는 placeholder면 승격하지 않는다.
- Source JS의 advanced metadata placeholder는 `projectionStatus: BINDING_PENDING`과 필드별 null 사유, 또는 보존된 RPM 상태 `RPM_SEMANTIC_FINAL_PROJECTION_UNMATERIALIZED`, `RPM_SEMANTIC_FINAL_H15_UNIT_BINDING_PENDING`, `RPM_SEMANTIC_FINAL_DIRECT_BINDING_GAP` 중 하나와 비어 있지 않은 `metaNullReason`이 함께 있을 때 정식 메타 projection이 대체할 수 있다. `META_PIPELINE_AUDIT`는 더해 source에 이미 적힌 표준 단원·PT/TPL/CC/Condition 값이 감사/매니페스트와 다를 때, 해당 메타 행이 아직 승인 전이고 요청에 exact `sourceMetadataBefore`가 있어 현재 source 값을 바이트 기준으로 결속한 경우에 한해 sidecar 바인딩을 재지정할 수 있다. 이 운영라인에서는 새 CrossConcept를 추가할 때 fully approved 행의 기존 키를 전부 보존하고 감사된 새 키만 덧붙일 수 있다. 또한 exact source bytes·N/N 감사·manifest binding·source parity가 일치하고 exact `sourceMetadataBefore`를 제공하면 fully approved row의 PT/TPL assignment를 현재 감사가 승인한 값으로 교정할 수 있다. 이 교정은 item binding에만 적용되며 canonical PT/TPL 정의를 바꾸지 않고 FINAL_QA/REVIEW2 승인값을 덮지 않는다. 두 예외 모두 exact source parity와 additive canonical 등록이 필수다. `reviewStatus: manual_review`와 `metadataStatus: approved_partial_with_explicit_holds`인 행은 해당 필드의 `fieldStatus`가 `manual_review_pending`이고 exact `sourceMetadataBefore`가 있을 때 그 미결 필드만 감사 바인딩으로 해결할 수 있다. 바인딩 뒤에도 남은 `manual_review_pending`은 hold 상태로 보존한다. 모든 경로에서 student-facing source bytes는 수정하지 않는다.
- 같은 필드별 미결 상태가 `reviewStatus: reviewed_pass`로 기록된 row도 `metadataStatus: approved_partial_with_explicit_holds`와 해당 `fieldStatus: manual_review_pending`이 함께 있으면 그 필드만 exact audit로 채울 수 있다. 기존 MIDDLE_RECERT 메타에서 PT/TPL 값이 null/빈 문자열이고 `metadataStatus: approved_semantic_review`, `reviewStatus: reviewed_pass`, 해당 `fieldStatus: projection_unmaterialized` 또는 `meta_semantic_hold`로 남은 것도 `sourceMetadataBefore`와 exact source parity가 일치할 때만 채운다. 이는 그 필드의 미투영 상태를 처리하며 다른 승인 메타나 학생용 데이터는 덮지 않는다.
- legacy/rich/key-only `META_PIPELINE_AUDIT` 입력은 1~5 `difficultyBucket`이나 `IntegrationPattern`을 판정하지 않는다. 새 sourceDrive flat v3 예외는 audit와 paired classification이 UID별 동일한 1~5 bucket, confidence, reason을 명시하므로 해당 bucket/confidence를 메타 provenance `approved_meta_pipeline_audit`로 바인딩한다. 이 경우에도 level에서 bucket을 계산하지 않는다. IntegrationPattern이 source schema에서 빠지고 production JS에도 없으면 manifest의 transport sentinel `NONE`만으로 값을 만들지 말고, 기존값은 보존하고 값이 없는 UID는 `unreviewedFields`에 `EVIDENCE_DEBT`로 남긴다. 기존 legacy bucket이 숫자형 1~5가 아니고 audit에서도 bucket 근거가 없으며 production JS에도 유효한 bucket이 없을 때만 정확한 `before`로 결속하여 `after: null`로 지우고 debt를 기록한다.
- Consumer가 요구하는 L1/L2는 evidence-bound `.parent-labels.json`으로 현재 `basic-scope-parent-links.json`의 정확한 curriculum/course/unit/subunit 부모에서 가져온다. `courseKey` 별칭을 쓸 때는 해당 별칭이 ACTIVE owner pack의 `standardCourses`에 있어야 한다. standardUnit label을 부모 L1로 대체하지 않는다.
- `targetParentRef`는 canonical master의 원래 scope와 parent row를 그대로 SHA 결속한다. course 대조에는 기존 Archive2 master projection과 같은 `수학_상 → 수학(상)`, `수학_하 → 수학(하)` 두 별칭만 정규화하며 curriculum·원래 master row·단원·L1/L2 검증은 유지한다.
- `PARTIAL_UIDS FINAL_QA`의 명시 `targetParentRef.nativeSourceReview` (`archive-native-reviewed-parent-v1`)는 엄격한 source reassessment를 이미 통과한 M2 S2 원검토가 `after.rpmPrimaryPath`, `rpmL1/rpmL2`, curriculum 및 PT/TPL을 직접 확정한 경우에 한해 그 부모를 운반한다. `reviewCommit/reviewPath/reviewRef`, UID/ordinal, 원 `rpmRecordId`의 SHA-bound `middle2.json` 행을 모두 정확 결속하고, 현재 master의 같은 curriculum/course/부모/리프 및 현재 ACTIVE exact unit/subunit/PT binding·TPL parent·owner scope를 별도로 검증한다. 이 경로의 원 crosswalk는 `DIRECT_BINDING_GAP/MISSING`인 과거 참조로 보존되며 ACTIVE 승인으로 취급하지 않는다. 같은 요청의 registry 변경, basic/semantic/다른 parent adapter 혼합, 기존 binding의 명시 L1/L2와 충돌, native-after 대신 현재 source에서만 추측한 부모는 거부한다. 기존 unit/subunit·정의·crosswalk 파일을 바꾸지 않으며 수학 검수 승인을 생성하지 않는다. 영수증의 `nativeParentBindings`는 원 item·현재 exact ACTIVE tuple과 부모를 기록하고 재실행 때 immutable source review·현재 부모·영수증 증거를 다시 확인한다. 옵트인이 없는 기존 parent 경로는 그대로 유지한다.
- L2 대조에는 `resolve()`가 선택한 정확한 ACTIVE 교육과정·과목·단원·세부단원·PT binding의 `subUnitLabelKo`도 정본 표시명으로 인정한다. 다른 binding의 별칭이나 요청이 임의 제공한 라벨은 사용하지 않으며, SHA 결속한 master의 교육과정·scope·L1/L2 검증은 그대로 유지한다.
- 표준단원 표시명과 RPM 부모명이 다른 경우 `targetParentRef.crosswalkRef: {path, sha256, recordId}`로 정확한 ACTIVE_REFERENCE crosswalk 행을 함께 결속할 수 있다. 해당 행의 교육과정·과목·ACTIVE PT/TPL과 canonical master L1/L2가 모두 일치해야 한다. 문항 단원은 기존 ACTIVE binding과 감사 입력으로 계속 검증하며, 이 참조로 정본 정의나 binding을 재정의하지 않는다.
- crosswalk의 과목이 `M3-2` 같은 학기 별칭이면 문항 `courseKey`와 정확히 같고 ACTIVE binding owner pack의 `standardCourses`에 실제로 선언된 경우에만 수용한다. 과목 표시명과 별칭의 교환으로 교육과정·PT/TPL·부모의 일치 검사를 생략하지 않는다.
- 이전 `META_PIPELINE_AUDIT` 등록에서 PT 의미가 아니라 exact ACTIVE binding의 부모 L2만 잘못 연결된 경우, `parentBindingCorrectionRef`가 가리키는 SHA-bound 증거와 현재 binding의 정확한 before/after, 그 binding의 전체 supporting UID, 정본 부모 근거를 함께 제시하면 L2만 정정할 수 있다. 정정은 부모 경로를 바로잡는 범위로 제한하고 PT/TPL/CrossConcept 정의·키·supporting UID 및 학생용 payload는 바꾸지 않으며, 영향을 받는 모든 UID를 같은 N/N 요청에 포함한다. 정본 compiler가 owner pack patch version을 갱신한다.
- Archive2 학생 검색 Consumer가 L1/L2와 PT/TPL/CC를 직접 노출하지만 `level/L3/L4`는 해당 행에 노출하지 않는 경우, 이 필드들은 source UID·ordinal·metadataRevision에 일치하는 단 하나의 ACTIVE Meta Foundation runtime row에서 확인한다. consumer 행의 미노출 `null`을 runtime의 승인값으로 덮어 PASS 처리하지 않으며, runtime 누락·중복·값 불일치는 실패다.
- 감사 records, 매니페스트 `recordsToBind`, 등록 요청 `items`는 source ordinal별 PT/TPL/CrossConcept/단원 값이 정확히 일치해야 한다. 결정적 풀이 발췌와 시각자료 확인 필드도 qid마다 필요하다.

### SOP_v1.2 sourceFieldCorrections (2026-11-04)

SOP_v1.2 approval v4의 매니페스트 바인딩은 answer/questionType/choicesCount/score가 현재 production source와 다를 때 원래처럼 무조건 거부한다. 실제 풍덕중 22문항 입력처럼 원본 감사/매니페스트 값이 오래되어 현재 source와 여러 row가 다른 정상 교정 감사는, 다음 조건을 모두 만족할 때만 그 네 필드의 불일치를 등록 입력으로 인정한다.

- 독립 SHA-bound correctiveReviewRef의 row와 등록 요청 item이 같은 UID/ordinal에 대해 완전히 동일한 sourceFieldCorrections 항목을 각각 가진다. 한쪽에만 있거나 값이 다르면 거부한다.
- 항목은 field, questionUid, sourceOrdinal(또는 auditQuestionNumber), originalManifestValue, currentSourceValue, 비어 있지 않은 reason, appliedToManifest:false를 가진다.
- originalManifestValue는 현재 매니페스트의 실제 값과 정확히 같고, currentSourceValue는 현재 production source의 실제 값과 정확히 같으며, 두 값은 서로 달라야 한다.
- field는 answer, questionType, choicesCount, score만 허용한다. content/choices/source UID/identity 또는 PT/TPL/CC/단원/level/difficulty/assignment를 바꾸는 교정은 허용하지 않는다.
- 기존 source parity, student payload parity, corrected canonical assignment 검증은 그대로 유지한다. 이 예외는 매니페스트 비교에만 적용된다.
- 등록기는 원본 audit/manifest/source를 덮어쓰거나 새 값으로 만들지 않는다. appliedToManifest:false는 영수증에 그대로 남기고, 각 교정에 corrective review의 reviewer id/role과 reviewedAt을 귀속해 사람 검수 책임을 식별한다.
- 누락, 중복, 다른 UID, 원본/현재 값 불일치, reason 없음, appliedToManifest:true, 원본과 현재가 같은 모순 교정은 fail-closed로 거부한다.
- 기존 교정 없는 입력의 매니페스트 동등성 검사는 정확히 이전과 같다.

기본 실행은 dry-run이며 실제 적용은 --write를 명시해야 한다.

이 유형의 등록 receipt는 `examFinalQaStatus: NOT_EVALUATED_BY_REGISTRAR`를 유지한다. 문항 메타 provenance에는 `metadataApprovalType: META_PIPELINE_AUDIT`, `tagConfidence: meta_pipeline_audit`, `fieldStatus.*: approved_meta_pipeline_audit`를 기록해 다른 승인 경로와 구별한다.

`before/after`는 승인 메타 필드 객체다. `after`의 모든 필드에 `before`를 명시하며,
기존 필드가 없으면 `before` 값은 `null`이다. source JS에도 존재하는 값은 정확히 같아야 한다.
기존 source/identity fingerprint와 UID/ordinal도 일치해야 한다.
`level`은 하/중/상, `difficultyBucket`은 정수 1~5로 독립 검증한다.
원본이 명시적으로 가진 역사적 `level: null` 또는 `level: "중상"`은 `FINAL_QA`에서 원값을 그대로 보존할 수 있다. 이 경로는 원본과 요청의 level, 정수 1~5 bucket, high/medium/low confidence, 유효한 boundary가 모두 같고 양쪽 `legacyLevelCompatibility`가 `UNKNOWN`일 때만 허용한다. level 필드 누락, 새 임의 표시명, 미확정 bucket, REVIEW2로의 승인 종류 변경은 이 예외로 승인하지 않는다. 기존 UID·원본 SHA·fingerprint·검토 증거·정본 바인딩 검사는 동일하다. source-only 검색 인덱스가 명시적 null level을 빈 문자열로 내보낸 경우에도 같은 원본의 위 조건을 다시 검증하며 등록 메타와 runtime의 원값은 null로 유지한다.
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
단, REVIEW2의 유형 미결합(typeHold) 항목은 단원·소단원·조건·연결 개념 키가 정본 표에 없어도 받아 둔 값 등록부(`archive/data/meta-os/received-values.json`)에 있으면 통과한다. 등록부에도 없으면 이 문장대로 실패한다. 판정 값이 원본이나 승인된 값과 다르면 본칸은 두고 판정은 `fieldCandidates`에 보존한다(규칙: Meta OS 부록 "받아 둔 값 등록부와 후보 칸"). 이 문서는 `docs/rules/MANIFEST.md`에 등재된 봉인 문서가 아니다.
RPM LOCKED 파일·Generated 전용 registry·그 밖의 임의 경로는 변경 대상 allowlist에 포함하지 않는다.

## 기록과 운영 경계

영수증은 `archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/<requestId>.json`에 저장한다.
승인 타입, 요청 digest, 정본 before/after, 최종 UID 메타, Runtime 값, 변경 산출물 digest를 보존한다.
`metadataRegistrationStatus: REGISTERED`와 `examFinalQaStatus: NOT_EVALUATED_BY_REGISTRAR`를 분리한다.
재실행은 요청 digest·현재 UID 메타·정본 참조·Runtime 값을 다시 확인하고 변경 없이 반환한다.

Actions는 여러 inbox 요청을 순서대로 처리하고 정본/compiled/Runtime/대형 메타를 함께 stage한다.
DB/Catalog/Search 재생성 및 값 대조가 실패하면 commit/push하지 않는다.
성공한 요청은 inbox에서 제거하고 영수증을 보존한다. 수동 재실행은 workflow_dispatch로 가능하다.

### 요청별 격리 (2026-10-29)

`tools/ci/register-reviewed-meta-requests.mjs`가 요청을 하나씩 독립 등록한다. 등록기가 거절한 요청
(before 불일치, 근거 drift, registry before 불일치 등)은 그 요청만 fail-closed로 처리한다.
등록기는 검증 후에 쓰므로 작업트리는 그대로이며, 스크립트가 등록 경로의 status 지문으로 이를 증명한다.
거절된 요청은 `.archive-meta-register/inbox/`에서 `.archive-meta-register/rejected/<파일>.json`으로 이동하고
`<파일>.rejection.json`(오류 한 줄, 요청 sha256; 실행마다 달라지는 값 없음)이 함께 커밋된다.
workflow에는 `::error` 주석과 요약 표가 남는다. 거절은 run을 실패시키지 않는다. Pages release는
성공한 register run의 completed 이벤트로만 재개되므로 거절 때문에 run을 실패시키면 release가 다시 교착된다.
등록 뒤 소비자 projection 검증(`--verify-projection`)은 적용된 요청 전부를 끝까지 검사한다. 거절된 요청이 있으면
작업트리를 HEAD로 되돌리고(`--reset-derived`) 그 요청만 `projection-verify` 단계로 거절한 뒤 나머지를 한 번 더
처음부터 등록·재생성한다(최대 2라운드). 거절된 요청의 메타 소유자는 현재 메타·소비자 기준으로 요청을 다시 만들어
새 inbox 요청으로 제출한다(`git mv`로 되돌리거나 새 파일; 같은 파일명으로 성공하면 이전 거절 기록은 자동 삭제).
거절이 작업트리를 바꿔 격리를 증명할 수 없거나(exit 2), 2라운드째에도 검증이 거절하거나, 공용 재생성·정합 검증
(build_db, parity, catalog)이 실패하면 pass 전체가 실패한다. `build_db.py`는 한 번 재실행해 고정점에 도달하는 것을 허용한다.

새 정본이나 새 Runtime pack 파일을 만들었다는 사실만으로 학생 Consumer 지원이 완성되지는 않는다.
기존 Consumer의 canonical 범위·Runtime 입력 목록이 새 분류를 지원하는지 별도 확인해야 한다.
이 구현은 Consumer 엔진을 재설계하거나 Pages와의 기존 writer 구조를 변경하지 않는다.
정본 등록/정적 값 검증과 학생 화면·출시 완료를 구분해 보고한다.

## 기존 감사 승인과 검토 난도의 원본 재결속 (2026-11-15)

이미 유효한 전체 시험 감사 영수증이 있고, 원본 메타 운반 또는 별도로 검토된 해설 수리 때문에 전체 JS 해시가 바뀐 경우에만
기존 v2 요청의 approval.type: META_PIPELINE_AUDIT와
approval.sourceRebind.schemaVersion: archive-native-audit-preservation-v1을 사용한다.
일반 FINAL_QA/REVIEW2 승인으로 전환하지 않는다. 기본 범위는 전체 시험이며,
같은 원 전체 감사에서 일부 UID만 그대로 보존할 때는 명시적으로 `scope: PARTIAL_UIDS`를 사용한다.

- requestPath는 해당 요청의 inbox 경로다. priorCommit의 실제 Git commit에서 priorReceiptRef의 raw SHA와 원본 blob/SHA를 대조한다.
  이전 영수증의 metadata, identity, runtime UID/ordinal 집합은 원시험 전체 분모와 같아야 한다.
  부분 보존도 `expectedQuestionCount`는 현재 원본 전체 문항 수이며, 요청 item은 원 전체 감사의 정확한 UID/ordinal 부분집합이어야 한다.
  빈 집합, 중복, 범위 밖 순번, 다른 UID, 부분 영수증을 prior로 삼는 요청은 거부한다.
  prior가 이미 발급된 **전체 감사 보존 영수증**인 경우에는 원 감사까지 역사 검증을 이어서 수행한다.
  각 단계의 정확한 Git source와 영수증, 봉인된 request/D5, 모든 metadata·identity·runtime 결과를
  동일 보존 planner로 재현해야 한다. 현재 revision/evidence를 무시하거나 최초 감사 값으로 되돌리지 않는다.
  소비되어 해당 Git tree에 실제로 없는 request/D5 inbox만 그 영수증의 봉인본을 사용한다.
  원 D5 외 근거 파일이 없거나 Git 파일의 SHA가 다르면 거부하고, 순환·16단계 초과 이력도 거부한다.
  현재 D5의 before는 바로 이전 보존 영수증의 실제 승인값이며, 전체 원시험 분모와 기존 검토 after를 유지한다.
- 모든 item은 before: {}, after: {}이며 registryChanges는 없다. 원래 감사 종류, 분류키·부모·승인 필드 상태,
  review_required, source_unreviewed, EVIDENCE_DEBT, 선택 가능 상태를 그대로 보존한다.
- difficultyRequestRef는 동일 source blob과 전체 UID를 대상으로 이미 적용된 공식 reviewed-correction D5 요청의 경로/raw SHA다.
  해당 요청의 근거 SHA, 원래 metadata before, 실제 source 지문, 승인된 네 난도 필드의 after를 모두 대조한다.
  먼저 D5를 적용하고 그 결과를 보존 영수증에 결속한다. legacy level은 바꾸지 않는다.
- 원본의 기본 분류키와 난도 표기는 기존 승인값과 같아야 한다. 표시명은 같은 ACTIVE master key의 정확한 label로만 운반할 수 있고,
  category와 standardUnitOrder 변화도 같은 단원 정본과 SHA-bound 순서 문서로 검증한다. 임의 별칭·새 분류·새 풀이 근거를 허용하지 않는다.
- 해설이 바뀐 UID는 solutionRepair: { ref, reviewCommit, reviewPath }로 별도의 immutable
  archive-source-solution-repair-v1 / NARROW_REPAIR_REVIEWED 근거를 제공한다.
  UID/ordinal, 독립 검토자, before/after 해설 SHA, 실제 두 Git 원본, 현재 원본을 대조하고
  해설 외 학생용 필드와 표시 번호가 모두 같아야만 full fingerprint를 갱신한다.
  새 시험지 QA나 고급 분류 승인을 부여하지 않는다.
- 영수증은 newMetadataApprovals: 0, preservedMetadataApprovals: N, 실제 해설 지문 수리 수를 따로 기록한다.
  부분 보존에서 N은 선택 UID 수이며 `scope`, `partialUidCount`, `totalQuestions`와 일치한다.
  `expectedQuestionCount`에는 전체 시험 분모를 별도로 보존한다. 적용 metadata/identity/runtime와 재실행 검증은
  정확히 선택한 UID에만 한정하고 선택 밖 행은 바꾸지 않는다. 원 전체 감사 및 D5 correction/gemini/proof의 전체 문항 검증은 줄이지 않는다.
  성공한 inbox가 소비된 이후에도 검증할 수 있도록 원 요청 객체와 D5 입력의 정확한 raw UTF-8를 영수증에 봉인한다.
  원 요청의 stable digest와 D5 raw SHA를 다시 검증하며, 현재 파일이 남아 있으면 봉인 사본으로 파일 변조를 숨길 수 없다.
- AutoMeta는 위 증거, 현재 source/identity/metadata/runtime, ACTIVE PT/TPL과 exact binding을 다시 검증해 기존 승인만 재사용한다.
  감사가 남긴 null IntegrationPattern과 명시 debt는 그대로 유지한다. D5 재실행도 같은 보존 영수증이 실제 해설 지문 수리까지
  입증할 때만 새 full fingerprint를 인정한다. 근거·UID·분모·승인 종류·debt·재결속 내역 중 하나라도 달라지면 거부한다.
- 과거 `meta-pipeline-audit-approval-v2`가 남긴 `approved_subunit_concept_partial` tag, `reviewStatus` 미기재,
  일곱 분류 필드의 `approved_meta_pipeline_audit`와 난도의 `approved_source`라는 정확한 상태 조합도 보존할 수 있다.
  이 경우 원본은 네 D5 필드 외에 한 필드도 바꿀 수 없고, 해설 수리도 함께 적용하지 않는다.
  당시 source의 빈 보조 분류와 승인 sidecar가 달랐다면, immutable prior source와 승인 영수증에서 각각 확인한
  기존 관계만 유지한다. 새 source 값으로 덮거나 비어 있던 QA 상태를 추가하지 않는다.
  현재 metadata/identity/runtime는 기존 승인 전체와 공식 D5 결과에 정확히 일치해야 하며,
  재결속 후에도 원 승인 종류·상태·fieldStatus·pack version을 유지하고 새 승인 수는 0이다.
- 위 과거 상태에서 원 audit의 L1/L2와 이미 게시된 기본 부모 투영이 달랐던 경우에만
  `sourceRebind.consumerParentRef`로 `archive-native-audit-consumer-parent-preservation-v1` 근거를 명시할 수 있다.
  근거는 동일 원 영수증·원본이 존재하는 `priorConsumerCommit`, 그 commit의 `basic-scope-parent-links.json` blob/SHA,
  동일 원 승인 metadata 전체행, UID별 full/body 지문과 정확한 기본 키·교육과정·과목·부모를 결속한다.
  현재 Consumer도 같은 승인 assignment, 현재 metadata revision, 원 승인 근거, 동일 UID/지문/키를 가져야 하며
  실제 canonical 기본 부모 검증을 다시 통과해야 한다. 이 경우 L1/L2의 화면 값은 그 기존 투영과 비교하고,
  raw 승인 L1/L2는 기존 runtime과 비교해 그대로 보존한다. PT/TPL·나머지 값과 ACTIVE binding 검증은 유지한다.
  새 부모 승인, 라벨만 같은 다른 키, 지문·분모·정본 근거 변조는 허용하지 않는다.
  부분 보존의 parent witness도 선택한 UID 안에서 실제 근거가 필요한 행만 포함한다. witness의
  `expectedQuestionCount`는 원 전체 분모를 유지하며, 선택 밖 다른 승인 UID의 부모를 끼워 넣으면 거부한다.

## 검토된 그림 교체 뒤 native 승인 재사용 (2026-11-15)

`native-reviewed-figure-reuse.mjs`는 공식 PARTIAL_UIDS FINAL_QA 등록이 이미 끝났지만
AutoMeta의 이전 원본 cursor에 PNG 또는 옛 해설 그림이 남아 있을 때만, 현재 영수증의 승인을 그대로 재사용한다.
새 등록 모드나 내용 변경의 일반 허용 경로를 만들지 않는다. 성공 결과는 `ALREADY_REGISTERED`이며
metadata·identity·runtime·source를 쓰지 않고 기존 승인 종류·revision·부모·fieldStatus를 유지한다.

- current sourceReview는 immutable native 문서의 `NARROW_CURRENT_FIGURE_CONTINUITY_ONLY` 범위를 가져야 한다.
  실제 `reviewCommit:reviewPath`, local reviewRef SHA, nativeSchemaVersion을 범위 분기 전에 대조한다.
  scope/schema와 local SHA를 함께 바꾸더라도 일반 승인 경로로 빠질 수 없다.
  sourceReview가 없는 기존 영수증과 정상 Git-bound 일반 재판정의 별도 local-copy 경로는 유지한다.
- 현재 원본 전체 blob/raw SHA 및 UID/ordinal 분모, 실제 이전 Git 원본의 학생 payload와
  AutoMeta previous payload, 원 pending 요청의 의미·난도 after 값, 원 native 의미 판정을 결속한다.
  기존 재판정 helper로 현재 영수증의 sourceReview proof도 다시 재현한다.
  이미 current 원본에 도달한 cursor도 동일한 그림 근거를 계속 검증한다.
- 문항 전체에서 허용하는 차이는 검토된 image/solutionImage·그림 표시 필드와 layoutTag뿐이다.
  content에서는 동일 `<img>`의 quoted `src` 경로 교체만 허용한다. 발문, 선택지, 정답, 해설,
  HTML alt 속성, 번호, 점수, 분류·난도 등 나머지 값이 바뀌면 거부한다.
- 독립 그림 검토의 네 명시 schema에서 정확한 UID/ordinal, 전체 before/current 문항 SHA,
  원본 blob/raw SHA와 narrow PASS를 읽는다. 원 renderer inventory와 원·현재 모든 참조 asset의
  Git blob/raw SHA가 일치해야 하며, 현재 파일 bytes도 매번 확인한다.
  같은 경로에서 나중에 바뀐 asset, 누락·추가 asset, 외부 SVG 의존성, 미지원 asset object/inline SVG를 거부한다.
  immutable Git bytes는 cache할 수 있지만 현재 source/metadata/identity/runtime 및 local evidence/asset 확인은 생략하지 않는다.
- 이 경로는 새 전체 수학 QA, REVIEW2, 난도 판단 또는 고급 메타 승인을 부여하지 않는다.
  기존 solution-only 재결속과 일반 native receipt의 ACTIVE 정본·정확 binding·현재 runtime 검증은 유지한다.
  실제 build, projection, Changed-UID Consumer 및 main 등록·배포는 별도 게이트다.

`tests/archive-main-merge-meta.test.mjs`는 image/본문 img/solutionImage-only의 정상 경로와
원문·답·해설·독립 검토·원 pending 값·renderer inventory·same-path asset·scope/schema 위조를 검증한다.
cursor가 이미 current와 같거나 Git cache가 채워진 뒤에도 변조를 거부하며,
`tests/archive-main-meta-batch-replay.test.mjs`의 기존 배치 재실행 계약을 함께 유지한다.

## 기본 승인과 명시적 PT/TPL hold의 AutoMeta 보존 (2026-11-15)

기존 `approved_partial_with_explicit_holds` 행에 PT 또는 TPL의
`fieldStatus: manual_review_pending`이 남아 있으면, 다른 요청이 ACTIVE binding을 추가해도
일반 main-merge 등록이 그 미결 값을 채우거나 기존 기본 승인·fieldStatus를 덮지 않는다.
유효한 native receipt 재사용을 먼저 검사하고, 일반 producer의 원래 UID·지문·ACTIVE·난도·근거
검증을 통과한 뒤에도 이 행은 `SUPPLEMENT_PENDING / EXPLICIT_PARTIAL_REVIEW_HOLD`로 남는다.
기존 metadata·identity·runtime·학생 원본은 쓰지 않으며 새 승인 또는 hold 해소를 주장하지 않는다.
해당 미결 필드를 실제 검토한 명시적 등록은 기존 reviewed 경로에서 별도로 수행한다.

registry SHA가 바뀌면 pending 원본을 다시 평가하는 동작과 일반 미승인 행의 main-merge 등록,
valid native reuse 및 stale native 거부 계약은 유지한다. 배치 회귀는 실제 registry 변화 뒤
부분 승인 행의 전체 metadata를 보존하고 다른 미승인 UID만 등록되는지, 같은 배치 재실행이
동일 선택과 pending 사유를 유지하는지 확인한다.

## 부분 FINAL_QA 원본 보존 영수증의 AutoMeta 재사용

`approval.sourceRebind.priorReceiptRef`로 원본 파일만 다시 결속한 `PARTIAL_UIDS` 영수증은
기존 그림·해설 검토 근거를 없애지 않는다. AutoMeta는 SHA로 결속된 원 영수증까지 이어서 확인한다.
기본 연결에서는 시험·원본 경로·전체 분모·선택 UID와 순번이 같고, 실제 Git 원본의 선택 문항 전체 객체가
같아야 한다. metadata와 runtime은 revision 및 새 영수증 경로를 추가한 evidence 목록 외 모든 값이
동일해야 하며, identity는 전체 객체가 동일해야 한다. 새 승인·registry 변경·fingerprint repair는 허용하지 않는다.

원 영수증에 도달하면 그 영수증의 실제 Git source와 기존 승인값으로 기존 native 검증기를 다시 실행한다.
이전 pending cursor를 그대로 대조하며, 원래 독립 그림 검토·renderer sidecar·현재 자산 바이트·원검토
proof 검증을 생략하지 않는다. cursor가 이미 current여도 원 solution-only repair는 원 prior Git 문항으로
다시 검증한다. 이 경로는 새로운 학생 내용 변경이나 의미 승인을 허가하지 않고 기존 영수증을 재사용한다.

잘못된 prior SHA, 선택 집합·다른 선택 문항 변경, 승인 상태·값·근거 삭제, 자산 변조, 순환 또는 64단계를
넘는 연결은 거절한다. 명시적인 부분 보존 근거가 검증에 실패하면 일반 main-merge producer로 내려가
기존 승인을 덮지 않고 `NATIVE_SOURCE_PRESERVATION_REVALIDATION_FAILED`로 남긴다.
최신 보존 영수증 자체가 누락되거나 정상적인 현재 등록 객체가 아니어도, metadata/runtime에 남은
revision과 원 영수증·evidence append 관계를 확인하여 producer 우회를 차단한다. JSON 파싱 성공만으로
정상 영수증으로 간주하지 않으며, 실제 source의 Git/raw SHA와 전체 분모까지 일치해야 한다.
기존 FULL 보존과 typed source-review/renderer sidecar 계약은 별도로 그대로 유지한다.

### 변경 문항을 제외하는 엄격한 부분 보존

원 부분 영수증의 일부 문항만 현재 원본과 달라졌다면, 기존 영수증을 절단하거나 새 승인으로 바꾸지 않고
`approval.sourceRebind.selectedSubset`을 명시할 수 있다. `schemaVersion`은
`archive-native-source-preservation-subset-v1`이며 `excludedItems`에는 제외하는 모든
`questionUid`, `sourceOrdinal`, `reason: "CURRENT_SOURCE_REVIEW_REQUIRED"`를 기록한다.
선택 items와 제외 items는 중복 없이 원 영수증의 전체 UID·순번 집합을 정확히 나누어야 한다.
원래 선택 집합을 전부 보존할 때에는 이 옵션 없이 기존 계약을 사용한다.

등록기는 원 영수증의 전체 metadata·runtime·identity가 현재 저장 상태와 일치하는지 확인하고,
그 원본 Git blob/raw SHA에서 원 영수증 전체의 기존 native 승인을 다시 검증한다. 현재 ACTIVE 정본과
정확한 binding도 필요하다. 선택 문항 전체 객체는 원본과 동일해야 하며 제외 문항은 실제로 바뀐 객체여야 한다.
선택 밖 metadata·runtime·identity는 쓰지 않는다. before/after는 빈 객체이며 새 의미값, 정본 변경,
새 승인은 허용하지 않는다. 영수증의 `newMetadataApprovals`는 0이고 `preservedMetadataApprovals`는
정확히 선택 수다. 자산의 같은 판본 확인과 현재 Consumer 검증도 해당 출고 증거에 별도로 남긴다.

AutoMeta는 원 영수증 전체를 유지한 채 선택 subset의 승인값·현재 문항과 전체 원 native 근거를 재검증한다.
제외 문항이 이후 별도의 정식 검토로 등록되더라도, 선택 문항의 과거 근거는 원 identity snapshot으로
검증하므로 그 별도 등록을 철회하거나 덮지 않는다. 누락·중복 exclusion, superset, 잘못된 원본·분모,
변경된 선택 문항, 승인값 변조는 거부한다. 이 기록은 제외 문항의 현재 승인이나 보류 해소를 뜻하지 않는다.

과거 승인과 현재 사용 가능성도 구분한다. 현재 native 영수증이 원본에 결속되지 않는 문항은 원 승인 시점의
Git source와 정확한 metadata·runtime·identity로 역사 근거만 검증한다. 현재 검증 메타 표시·자동 선택·VERIFIED
조회는 실제 Consumer 정책에 따라 별도로 거부되어야 한다. 원문을 직접 선택하는 경로는 그 승인 판정과 별개다.

### 기존 전체 시험지 영수증에서 일부만 보존

현재 자식 요청은 계속 `PARTIAL_UIDS`와 명시적인 `selectedSubset`을 사용한다. 그 원 영수증이 기존 전체
시험지 형식이면 `scope`, `partialUidCount`, `expectedQuestionCount`, `registrationMode` 필드가 모두 없어야 한다.
`totalQuestions=N`과 metadata·identity·runtime 세 inventory의 수가 모두 같고, 같은 UID와 원본 순번 1..N이
누락·중복 없이 정확히 대응해야 한다. 실제 원본 Git bank도 N문항이어야 한다. 부분 영수증의 필드를 지우거나
짧은 목록을 전체로 간주하지 않는다. 기존 영수증의 바이트·scope·분모는 바꾸지 않고 내부 비교용 수만 읽는다.

이 확장은 독립적인 원 native `FINAL_QA` leaf에만 적용한다. 원 영수증이 다시 `sourceRebind`를 주장하거나
명시적인 보존 count를 가진 전체 보존 체인은 이 확장의 대상이 아니다. 자식의 선택·제외 집합은 원 전체
승인을 정확히 나누며, 원 전체 승인의 실제 native 재생, 현재 저장 상태 일치, 선택 문항의 전체 객체·승인값
불변, 변경된 제외 문항의 상태 보존을 모두 요구한다. 기존 순환·깊이 제한과 이후 제외 UID 등록의 독립성도
유지한다. 새 승인·원본·난도·정본 변경을 허용하는 경로가 아니다.

## 검증

`node --test tests/archive-reviewed-exam-registration-v2.test.mjs`는 격리된 임시 저장소에서
중등 전 학년·고등 과목·미등록 미래 과목, 실제 Git 정본과의 확장 결합, 24 UID 보존,
키 교체/수정/폐기/삭제, UID·근거·before·binding 오류, 재실행을 확인한다.
순천고 실제 24 UID의 의미 승인이나 운영 등록 결과를 대신하지 않는다. SOP_v1.2 approval v4는 `META_AUDIT_ATOMIC_PACKAGE` + `COURIER_INTAKE_MANIFEST`의 UID/ordinal/PT/TPL/CC/단원 parity, corrective review 발췌의 실제 source 포함, 현재/원본 선언 SHA의 독립 결속, visual evidence 실제 상태, Condition 증거 부재 시 fail-closed, template inflation 미합성, 원본 바이트 불변을 검증한다. 두 네이티브 JSON만으로는 등록되지 않으며, 위 evidence contract가 모두 갖춰진 뒤에만 v4 등록이 성립한다.


### Immutable native KEEP primary continuity

A partial source reassessment may restore a primary tuple omitted from a native M2 KEEP delta only after the existing independent CC finalization has verified the exact primary context. Both immutable source snapshots, the current question, the explicit request and final metadata must agree. The native ACTIVE PT/TPL match and one exact curriculum binding are required. The unchanged current ACTIVE PT and template must both already name the selected UID among their supporting questions.

The continuity proof may carry the two primary keys, an unchanged empty condition list and an unchanged integration value. It cannot add conditions, change primary definitions, infer a new curriculum, settle a hold or replace a native semantic decision. Optional source semantic-status fields are not promoted through this path. Official canonical binding, resolver, projection and typed Consumer gates still apply.
