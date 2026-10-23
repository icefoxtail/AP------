# JS Archive — 공용 메타 조회 / 시험지별 소형 JSON 수정 계약 (CURRENT v1.1)

> 2026-10-21 사용자 결정; 2026-10-22 실제 구현 상태 반영. 적용: JS Archive / APMS의 원본·유사·교재·Generated 문항, CREATE/R1/R2/R3, FINAL QA, 감독/출고, Codex·GPT·Gemini를 포함한 모든 메타 수정 작업. 사용자의 현재 명시 지시·수학/정본/품질 계약은 유지한다.
>
> [Notion 02-06 메타 업무 라우트](https://app.notion.com/p/3e10e68bd69f81f19397e7cd1c8d3cfd)는 각 작업의 첫 정본 선택을 관리한다. 이 Git 파일만이 공용 조회·소형 JSON 쓰기 원칙의 정본.

## 한 줄 원칙

**READ SHARED, WRITE SMALL, MATERIALIZE SERVER-SIDE, VERIFY CONSUMER.**

- **READ**: `archive/data/question_metadata.json`은 전 UID의 기존 등록 상태·검색·조회용 공용 집계(projection)다. 대상 `examUid`/`sourceArchiveFile`/`sourceOrdinal`/`questionUid`로 필요한 N행만 추출해 대조한다. 필요한 경우 원본 JS, ACTIVE registry/taxonomy/bindings, RPM/crosswalk/runtime와 소비자 검색 데이터를 함께 읽는다. 공용 집계가 의미 정본의 권위를 대체하지 않는다.
- **WRITE**: 시험지 UID 메타 수정은 해당 **시험지 1건의 소형 JSON** 또는 기존 승인된 stage-local 패킷에만 기록한다. UID별 KEEP/CORRECT/REGISTER/NOT_APPLICABLE/HOLD, old/new, 근거, 대상 source/blob SHA와 owner를 포함한다. 공유 canonical registry 변경은 예외적으로 별도 `archive-reviewed-canonical-maintenance-request-v1` 소형 요청만 사용하며 `items: []`로 시험지 UID 승인을 분리한다. 문항 JS의 본문/해설/시각 수정은 별도 파일 책임으로 유지한다.
- **MATERIALIZE**: 허가된 단일 GitHub Actions/등록기만 소형 승인 입력을 읽고 공용 `question_metadata.json`, 직접 영향 runtime/DB/index/catalog/Consumer projection을 재생성·커밋한다. 파생 대형 파일은 작업자가 직접 업로드하는 변경 입력이 아니다.
- **VERIFY (담당 분리)**: 메타 의미 검수·Git `MAIN_DONE`·서버 측 자동 등록/Consumer 검증·Pages 배포는 서로 다른 단계와 증거다. 시험지 v2 등록 완료는 정확한 N/N UID, ACTIVE PT/TPL/binding, source SHA, 공용 sidecar, 실제 검색/Consumer 값과 원격 main SHA의 일치로 확인한다. Canonical maintenance는 선택된 crosswalk 분모, exact binding, compiled authority, 불변 runtime UID rows와 후속 `STATIC_VALUES_VERIFIED`를 확인한다. **등록기/Actions 담당**은 승인된 변경 및 직접 영향 범위의 projection/Consumer/Search 값과 main commit을 검증한다. **GPT 사후 FINAL QA 담당**는 필요한 소형 JSON 및 원격 main/대상 blob까지 확인하며 후속 소비자 전수 수동 검증을 `MAIN_DONE` 조건으로 만들지 않는다. 단순 Actions 시작, JS 필드 존재나 미실행 검사로 등록 `PASS`를 주장하지 않는다.

## 금지 / 책임

1. 사람·GPT·Gemini·Codex가 `archive/data/question_metadata.json` 전체를 편집·직접 PUT/contents API 업로드·통째 교체·수동 staged commit하는 작업 **금지**. 대형 파일 작업 실패를 이유로 다시 대형 업로드·분할 업로드로 우회하지 않는다.
2. 무관한 UID의 기존 승인·원본 fingerprint·정답·해설·visual·canonical RPM을 손대지 않는다. 신규 분류/ACTIVE binding이 없으면 의미 근거로 정확한 대상만 처리한다. 빈값이나 임의 PT/TPL로 승인하지 않는다.
3. `CREATE/R1/R2/R3` 단계의 기존 Library/Drive stage-local META 산출물은 소형 승인 패킷으로 보존하고 인계한다. 예약 워커에 Git 직접 쓰기 권한을 새로 주는 정책이 아니다. 인가된 마지막 Git writer만 자동 등록 요청을 제출한다.
4. `FINAL QA`는 수학·해설·메타 기존 검수 증거를 재사용하고 열린 UID만 최소 수정하며, 메타 수정은 소형 패킷으로 인계한다. 검색 자료를 편집 산출물로 취급하지 않는다.
5. GitHub 자동 생성 커밋의 결과물로서 공용 대형 JSON이 변경되는 것은 허용한다. 단 **사용자/에이전트가 직접 편집한 대형 JSON 커밋**과 구별하여 provenance/생성기 실행 증거를 기록한다. 같은 UID는 중복 요청·동시 writer·stale-before가 있으면 fail-closed.
6. 값 변경은 `sourceArchiveFile + ordinal + questionUid`, 이전값 `before`, 목표값 `after`, 최신 blob SHA, schema/owner/stage, proof, 대조 분모를 결속한다. 요청은 idempotent해야 하며 각 UID 변경 근거를 기록한다.
7. 자동 등록 실패 시 `REGISTER_PENDING`/`TOOLING_GAP`/`BLOCKED`와 firstMissingStep를 기록하고 담당자는 그 메타 경로를 수리/인계한다. 공용 JSON 직접 편집으로 우회하거나 완료로 포장하지 않는다.

## 등록·검증은 해당 담당 단계에서만 (역할별 계약)

- **인가된 Git writer**가 소형 승인 요청 JSON을 `.archive-meta-register/inbox/*.json` 경로로 제출할 때, 실제 등록기 코드의 지원 과목·승인 schema·source SHA·before 값의 조건을 확인합니다. 미지원은 `TOOLING_GAP` 또는 `REGISTER_PENDING`이며 다른 과목/REVIEW2 승인을 위장해 우회하지 않습니다.
- **GitHub Actions/등록기 기술 소유자**는 실제 변경 UID의 source→공용 projection→Consumer/Search 및 원격 commit을 검증하고 `PIPELINE_PASS`/실패 증거를 남깁니다. 단순 workflow 시작만으로 검증 성공을 주장하지 않습니다.
- **GPT 사후 FINAL QA/사용자 지정 단순 출고**는 [FINAL QA v2.0](../operations/JS_Archive_FINAL_QA_EXECUTION_CARD_CURRENT.md) 및 지정 출고 계약을 따릅니다. 필요한 소형 JSON을 main 병합 입력에 포함하고 대상 원격 SHA/blob 확인 후 `MAIN_DONE`으로 종료하며, **병합 후 UID 전수 검색·Consumer parity 및 CI·Pages 반복 확인을 수동 종료조건으로 붙이지 않습니다.** 사후 FINAL QA에서는 PT/TPL 신규 검수·수리를 사용자 지시에 따라 제외합니다.
- **신규 CREATE/R1/R2/R3·ALIVE**의 의미 메타 검수와 R1 blind 등 최초 품질 의무는 각 역할 정본 그대로입니다. stage Library/Drive worker는 소형 META 패킷을 인계하지만 Git writer 권한은 얻지 않습니다. R1~R3의 품질 PASS는 Actions 성공으로 소급하지 않습니다.

**구현 이력·당시 미지원 과목·PR #679 및 후속 작업안은 [Notion 02-06-A 등록기 구현 이력](https://app.notion.com/p/4010e68bd69f81cc9203ccf1f9165a24)에서만 보관합니다.** 현재 코드 동작은 [workflow](https://github.com/icefoxtail/AP------/blob/main/.github/workflows/archive-reviewed-exam-meta-register.yml)와 실제 등록기 및 Actions 실행 결과가 우선입니다.

## 보고 상태 — 실제 수행한 책임만

- **메타 입력 작성자:** `examUid / sourceBlob / UID 대상 / smallJsonRef+SHA / before→after 근거 / OPEN·firstMissingStep`를 기록합니다. 인가된 등록기 미실행이면 `REGISTER_PENDING` 또는 `NOT_RUN`입니다.
- **Git/main 병합 담당:** 실제 commit/대상 blob 원격 확인과 `MAIN_DONE` 여부를 기록합니다. 아직 실행되지 않은 Consumer/Search parity를 PASS라 적지 않습니다.
- **Actions/기술 담당:** 실제 `registrationActionRun / changedUIDs / sharedProjectionReadback / ConsumerSearchParity / mainSHA / PASS·FAIL`을 기록합니다. 실패한 UID만 해당 후속 등록·수리 이슈로 분리합니다.
- **역할별 QA:** CREATE/R1/R2/R3/ALIVE의 최초 해설·Blind·Golden·메타 품질 분모는 그대로이며, 사후 FINAL QA의 핀포인트 분모와 main 병합 종료 경계는 [해당 v2.0 정본](../operations/JS_Archive_FINAL_QA_EXECUTION_CARD_CURRENT.md)이 우선합니다.

## 실제 요청 경로와 지원 범위 (2026-10-23)

공통 자동 writer는 `.archive-meta-register/inbox/*.json`을 읽는 `.github/workflows/archive-reviewed-exam-meta-register.yml`이다. 기존 시험지 메타 등록과 canonical-only 유지보수는 서로 다른 request schema로 같은 workflow와 `archive/tools/meta-foundation/register-reviewed-exam-meta-source.mjs` CLI에 전달한다.

- `archive-reviewed-exam-meta-register-request-v2`는 `REVIEW2` 또는 `FINAL_QA` 승인 등록이다. 고정 과목 코드 목록 없이 요청의 `curriculum`, `standardCourse`, ACTIVE canonical pack, 단원 master, exact binding으로 해석한다. `REVIEW2`만 `reviewPassCount: 2`가 필요하고 `FINAL_QA`를 REVIEW2로 기록하지 않는다. 각 요청은 대상 시험 JS의 source blob SHA, 문항 수와 UID별 before/after를 묶는다.
- `archive-finalqa-pinpoint-register-request-v1`과 `archive-finalqa-nonpt-register-request-v1`은 main에 있는 별도 표적 FINAL QA 경로다. 현재 구현은 각각 지정된 단일 exam/request 및 고정 분모·source/candidate baseline에 fail-closed로 묶여 있다. Pinpoint는 등록된 필드만 변경하며 `PT/TPL: NOT_IN_SCOPE`; nonPT는 기존 ACTIVE 보조 키를 이용한 의미 필드만 다루고 `PT/TPL: NOT_REVIEWED_NOT_APPROVED`다. 이 두 전용 요청으로 다른 시험지나 일반적인 과목 범위를 추론하지 않는다.
- `archive-reviewed-canonical-maintenance-request-v1`은 시험지 승인 요청이 아닌 canonical 변경 요청이다. `approval.type: CANONICAL_MAINTENANCE`, `registryChanges`, `crosswalkRefreshPaths`, `items: []`를 받는다. 정본 pack 변경을 기존 canonical `pack.json`, `bindings.json` 및 허용된 native registry 경로에만 적용하며, 별도 subject registry나 parallel compiler를 만들지 않는다.
- Legacy v1/미버전 요청은 구 경로다. 좁게 명시된 pinpoint/nonPT v1 요청은 위 exact scope에서만 처리되며, 이를 구 legacy `registerLegacy`나 v2의 일반 과목 지원 근거로 확장하지 않는다. 봉인된 `.github/workflows/archive-reviewed-apply.yml`은 legacy R2 recovery에만 쓴다.

`question_metadata.json`은 두 경로 모두 직접 입력 파일이 아니다. v2 시험지 등록은 승인 UID의 sidecar와 runtime/DB/index/catalog projection을 Actions가 만든다. Canonical maintenance는 승인된 pack/binding을 compile하고 변경 대상 pack의 **runtime envelope**를 동기화한다. runtime UID records, 시험 JS, question metadata, identity map은 canonical-only 요청에서 바뀌지 않으며 구현은 이를 fail-closed로 검사한다.

## Canonical maintenance request v1

요청 필드는 `schemaVersion`, `requestId`, `purpose`, `approval`, `registryChanges`, `crosswalkRefreshPaths`, `items`다. `items`는 빈 배열이어야 한다. `approval`과 각 변경의 근거는 실제 저장소 상대 경로 및 64자리 실바이트 SHA-256 `evidenceRefs`로 결속한다. 변경되는 pack/compiled/crosswalk 파일의 before SHA는 반복 검증할 evidenceRef가 아니라 정확한 `before` 객체 또는 `crosswalkRefreshPaths[].expectedBeforeSha256`에 보존한다.

`registryChanges`는 exact `path`에 대한 `before`/`after`를 요구한다. Native `pack.json`은 전체 문서 before/after 교체를 허용한다. 배열 변경은 `collection`, exact `match`, `before`, `after`를 사용한다. `bindings`/`applicabilityRules`는 이 방식으로 추가·수정하며, runtime pack versions와 counts, compiled registries 및 `canonical/registry_index.json`은 compiler가 파생한다.

`crosswalkRefreshPaths`는 허용된 RPM v1.0 crosswalk 경로마다 다음 정보를 받는다. `expectedSummary`는 선택 분모만이 아니라 해당 crosswalk 전체의 status summary와 `byScope`를 모두 포함해야 한다.

```json
{
  "path": "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/<file>.json",
  "expectedBeforeSha256": "현재 입력 crosswalk의 실바이트 SHA-256",
  "selector": { "curriculum": "2022", "scope": "미적분I", "standardCourse": "미적분I" },
  "expectedRecordCount": 50,
  "expectedSummary": {
    "recordCount": 98,
    "DIRECT_ACTIVE": 92,
    "FAMILY_ACTIVE": 6,
    "DIRECT_BINDING_GAP": 0,
    "FAMILY_BINDING_GAP": 0,
    "RPM_ONLY": 0,
    "byScope": {
      "수학II": { "DIRECT_ACTIVE": 45, "FAMILY_ACTIVE": 3, "DIRECT_BINDING_GAP": 0, "FAMILY_BINDING_GAP": 0, "RPM_ONLY": 0 },
      "미적분I": { "DIRECT_ACTIVE": 47, "FAMILY_ACTIVE": 3, "DIRECT_BINDING_GAP": 0, "FAMILY_BINDING_GAP": 0, "RPM_ONLY": 0 }
    }
  },
  "evidenceRefs": [{ "path": "변경되지 않는 정본 근거", "sha256": "실제 SHA-256" }]
}
```

Writer는 선택된 행에서 기존 semantic path/PT/TPL/family 후보가 유지되는지 확인한 뒤 exact ACTIVE course/unit/subunit/PT binding이 하나일 때만 binding object와 `DIRECT_*_GAP`/`FAMILY_*_GAP` 상태를 갱신한다. 선택 범위 밖 행은 보존하고 전체 status summary를 `expectedSummary`와 비교한다. `generatedAgainstMain`과 `activeAuthority.registrySha`는 transaction이 만든 최신 main revision 및 compiled registry에서 다시 계산한다.

## 실행 순서와 정직한 완료 상태

기본 CLI 실행은 dry-run이며 파일을 변경하지 않는다. 승인된 inbox 입력은 workflow가 정렬된 순서로 읽어 `--write`로 적용한다. Canonical maintenance의 적용 영수증은 `archive/data/meta-foundation/evidence/canonical-maintenance/v1/<requestId>.json`이며 상태는 `APPLIED`, `consumerSearchStatus: NOT_RUN`, `metadataRegistrationStatus: NOT_APPLICABLE`, `examFinalQaStatus: NOT_EVALUATED`다. 이는 최종 등록·검색 확인 완료가 아니다.

Actions는 `.github/workflows/archive-reviewed-exam-meta-register.yml`에서 `tools/ci/reviewed-meta-register-pass.sh`를 호출한다. inbox 요청이 있으면 이 pass는 등록 관련 네 테스트(`archive-reviewed-exam-registration-v2`, `meta-foundation-calculus1-bindings`, `archive-finalqa-nonpt-register`, `archive-finalqa-nonpt-real-geumdang`)를 실행하고 요청을 적용한 뒤, DB/UID/index/Catalog/runtime-readiness 파생 빌드, archive registration/catalog/canonical checks, 각 요청의 schema별 read-only verify와 `git diff --check`를 수행한다. Pass 자체는 commit/push하지 않으며, inbox 요청을 소비하기 전에 post-push consumer 검사를 위한 사본을 보존한다. Scoped source push는 inbox가 비어 있어도 재생성을 실행할 수 있다.

Canonical maintenance 요청의 read-only verify 명령은 다음과 같다.

```powershell
node archive/tools/meta-foundation/register-reviewed-exam-meta-source.mjs --request .archive-meta-register/inbox/<requestId>.json --verify-maintenance
```

`--verify-maintenance`는 read-only이며 완료 영수증과 현재 canonical/compiled/runtime/catalog/manifest/Search 값의 parity를 확인한다. 성공 결과 `maintenanceStatus: MAINTENANCE_COMPLETE`와 `consumerSearchStatus: STATIC_VALUES_VERIFIED`는 정적 값 검증을 뜻한다. 브라우저 검색·선택·화면 표시나 배포를 뜻하지 않는다. Push 성공 뒤 별도 `tools/ci/verify-registered-consumer-approval.sh`가 변경 UID의 effective student consumer 승인을 확인한다. request별 `--verify-projection` 또는 `--verify-maintenance`, shell pass, post-push consumer check와 원격 main readback은 각각 실제 결과로 구분한다. 실행되지 않은 검증은 `NOT_RUN`이다.

시험지 v2의 `--verify-projection`은 같은 원칙으로 승인 UID의 source/metadata/runtime/catalog/Search 값을 확인한다. 별도 실제 브라우저 검증, 학생 화면 확인 또는 배포 상태는 해당 실행이 별도로 성공한 경우에만 기록한다.

## 보고 한 줄 포맷

- 시험지 v2: `examUid | N/N | smallJsonRef+SHA | sourceBlob | targetUIDs | registrationActionRun | sharedProjectionReadback | ConsumerSearchParity | mainSHA | OPEN | nextAction`
- Canonical maintenance: `requestId | changedPackIds | registryChangeCounts | crosswalkPath+expectedBeforeSha256 | receiptSHA | APPLIED/MAINTENANCE_COMPLETE | build/readiness/verify results | Actions remoteMainSHA | OPEN | nextAction`

기존 전체 FINAL QA·Blind·학생 해설·Meta 검수 의무를 완화하거나 다른 시험지로 범위를 확대하지 않는다.
