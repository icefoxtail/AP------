# TASK-04 유형 잠금 코드·CI 조건 결과

기준 main: `22ea1b9c7af2ebcc63a2f2903a3a0b6c6c2bc47d`. 최신 main에서 `feat/type-unlock-code-20261116` 생성. TASK02/03의 미병합 feature를 기반으로 삼지 않았다. main 병합·PR 생성·운영 등록·배포 없음. 사용자 원칙인 넓은 단일 경로를 따르되 ACTIVE 키·부모·출처 결속은 유지한다.

문서 기준: 계획 브랜치 TASK04/PLAN 6-2·7-1, PR2288 head `cc9b92d45b076c14bbf4919682a75b6f556c09ad`의 단일 Resolver 계약 §0. 봉인 문서는 수정하지 않았다.

## A. CI native preview의 typeHold 정합

커밋: `5eb14e53f4d7b25e4bb7219a7357bd3502e72f0e`.

변경: `tools/ci/archive-pr-native-preview.mjs`, `tests/archive-pr-native-preview.test.mjs`.

기존 difficultyAssignmentInformation은 assignment_missing을 difficulty5 요청에만 허용했다. 등록기의 `isTypeHoldRecord`(`reviewed-exam-registration-v2.mjs:133`)는 REVIEW2 + TYPE_PATH_UNBOUND_UNIT_SUB_ONLY + PT 없음이고, `:2650–2675`의 explicit typeHold 등록과 `:3098–3101,3178`의 실제 저장 행 검증이 usable-meta lane을 만든다.

미리보기에서 명시 REVIEW2 typeHold 요청, 원본 PT/TPL 없음, after에 유형 필드 없음에 한해 selectedItem에 증명 표지를 붙인다(`archive-pr-native-preview.mjs:821–827`). 그 표지 수와 공식 등록기 projection이 실제 저장 행을 검증해 낸 `consumerLanes.typeHold` 수가 같아야 한다(`:998–1009`). 이후 Consumer row의 request file, source/exam, UID, ordinal, 유일 소유를 결속하고 같은 pending의 중복도 거부한다(`:950–981`). 일반 assignment_missing은 여전히 거부한다. 요청의 typeHold 주장만으로 통과시키는 것이 아니라 registrar persisted-row 검증과 Consumer 관측을 함께 요구한다.

검증: 직접 관련 전체 파일 214/214 PASS. 마지막 test-only 반례 추가 후 집중 회귀 1/1 PASS. 반례: 다른 승인 종류, 원본 PT/TPL 존재, after 유형값 존재, 다른 UID/ordinal, 중복 pending/요청 소유, 공식 typeHold projection 건수 없음. 독립 검토가 찾은 continue 분기의 duplicate seen 누락을 고쳐 회귀에 넣었다. 기존 테스트 삭제·skip·기준 완화 없음.

남은 위험: #2224의 native preview 변경과 같은 파일이 겹칠 수 있어 통합 시 해당 guarded branch와 기존 증거/분모 검증을 함께 보존해야 한다. 실제 PR CI는 실행하지 않았다.


## B. 요청 생성기의 add-only 바인딩

커밋: `4801cc7e8d7335965bfde295420b0589c24ff4c1` (A 커밋의 자식).

변경: `tools/main_merge_master.py`, `tests/test_type_binding_changes.py`. 현재 main에는 후보 `build-meta-request.mjs`가 없고 실제 생성기는 main_merge_master.py다. registrar `resolve()`와 registryChanges 검증은 그대로 두었다.

소형 메타에 아래 근거 입력이 있으면 `plan_type_binding_changes`가 native registryChanges를 **추가만** 한다. 별도 느슨한 등록기를 만들지 않는다. 이 소형 메타 파일 자체의 SHA-256이 변경 요청 evidenceRefs에 결속되고, 문항 UID/ordinal·선택 PT/TPL·decisiveStep이 생성 요청과 같아야 한다. sourceExcerpt는 해당 문항의 실제 content/question/solution 문자열 안에 있어야 한다.

```json
{"typeBindingJudgments":[{
  "questionUid":"<현재 identity UID>", "sourceOrdinal":1,
  "problemTypeKey":"<ACTIVE PT>", "templateKey":"<그 PT의 ACTIVE TPL>",
  "decisiveStep":"<판정한 결정 단계>", "sourceExcerpt":"<이 문항 원문 또는 풀이의 실제 구절>"
}]}
```

ACTIVE 키·TPL 부모·마스터 단원/소단원·UID 결속을 검사한 뒤, 같은 curriculum/course/unit/sub의 기존 ACTIVE 바인딩들에서 owner/L1/L2를 유일하게 증명할 수 있을 때만 `before:null`인 bindings collection 행을 만든다. owner pack이 교육과정/과목 범위를 포함해야 한다. 이미 ACTIVE exact binding이 있으면 0건, 기존 충돌/비활성 행이 있으면 덮지 않는다. 같은 새 binding을 뒷받침하는 여러 UID는 한 행으로 합쳐 supportingQuestionUids/supportingJudgments와 SHA 근거를 보존한다.

안전한 부모/owner를 도출할 근거가 없거나 모호하면 `TYPE_BINDING_NEEDS_BINDING`을 반환한다. 이름·교육과정 대응·크로스워크를 추정하지 않는다. 이 입력을 주지 않은 기존 요청 생성 분기는 바꾸지 않았다. builder의 기존 FINAL_QA 승인 계약을 새 승인으로 바꾸지 않았으며, 동일 registryChanges는 REVIEW2 요청에서도 기존 registrar가 검증한다.

직접 증명: C와 같은 임시 registry fixture에 ACTIVE PT/TPL은 있지만 해당 PT binding만 없는 상태를 만들었다. 생성행 없는 공식 registrar dry-run은 `ACTIVE curriculum binding missing`으로 실패한다. 생성한 add-only 1행을 넣은 동일 요청은 `PASS`, `write:false`, `registryChangeCount:1`, `runtimeMaterialized:1`이다. dry-run 전후 metadata/bindings/registry index 바이트 동일을 확인했다. 실제 운영 데이터는 쓰지 않았다.

검증: 신규 Python 12/12 + 기존 생성기 36/36 PASS, py_compile 및 diff 검사 PASS. 독립 검토 직접 신규 11/11 PASS(이후 추가된 두 UID dedupe 반례 1개는 구현 담당 실행으로 구분).

임의로 정한 것/한계: 새 명시 근거 입력의 이름을 typeBindingJudgments로 정했다. 없던 의미/부모 라벨을 생성하지 않으려고 정확 scope의 기존 parent/owner가 유일할 때만 자동 제안한다. 크로스워크 DIRECT_ACTIVE 생성은 PT 판정만으로 RPM 경로 권위를 도출할 수 없어 구현하지 않았다. RPM 경로·소단원 대응의 별도 근거가 있는 명시 요청이 필요하며, 해당 없는 문항을 자동 완성했다고 주장하지 않는다. 운영 registry와 compiled 파일은 변경하지 않았다.


## C. 기존 typeHold 이후 유형 최초 등록: 기존 경로 확인, 코드 변경 없음

`reviewed-exam-registration-v2.mjs:2593–2607`의 source parity는 REVIEW2의 비어 있는 PT/TPL placeholder와 최초 등록을 허용한다. `:2650–2678`은 explicit typeHold를 unit-only로 등록한다. 다음 요청에서 typeHold를 다시 주지 않고 ACTIVE PT/TPL을 주면 정상 resolve와 labelsFor를 거쳐 `:2714–2754`의 필드 승인을 만들고 holdReason을 null, L3/L4 disposition을 ASSIGNED로 바꾼다. 등록기는 이미 이 경로를 지원하므로 C 코드는 수정하지 않았다.

현재 registrar를 직접 호출하는 저장소 밖 일회성 fixture로 다음 순서를 실행했다. 이것은 실제 문항의 의미 판정/승인이 아니라 경로 검증용 합성 fixture다.

1. 공식 REVIEW2 `typeHold:true` 등록으로 PT/TPL 없는 `approved_partial_with_explicit_holds` 행을 만든다(임시 저장소만).
2. 서로 다른 두 fixture 원장의 실제 SHA-256을 evidenceRefs로 넣은 새 requestId의 REVIEW2 요청을 만든다. 승인 pass count 2와 before 현재 값을 결속하고 기존 registryChanges는 재사용하지 않는다.
3. 공식 `registerReviewedExamV2({root, request})` dry-run 실행. `PASS`, `write:false`, `totalQuestions:1`, `registryChangeCount:0`, `runtimeMaterialized:1`, `fingerprintRepairCount:0`, `consumerSearchStatus:NOT_RUN`. dry-run 전후 metadata 바이트 동일 확인.
4. 같은 임시 저장소에만 적용하여 결과 필드를 확인: PT_NEW/TPL_NEW, L3=새 유형/L4=새 풀이 구조, `metaFoundationHoldReason:null`, `l3Disposition/l4Disposition:ASSIGNED`, `metadataStatus:approved_semantic_review`, 유형/틀 fieldStatus `approved_review2`.

최소 요청 모양(실제 실행은 fixture source blob·문항 수·SHA를 채운 완전한 v2 요청):

```json
{
  "schemaVersion": "archive-reviewed-exam-meta-register-request-v2",
  "requestId": "test-fill-type-after-hold",
  "examUid": "exam1", "sourceArchiveFile": "fixture/exam.js",
  "expectedQuestionCount": 1, "expectedSourceBlobSha1": "<현재 fixture source blob SHA-1>",
  "approval": {
    "type": "REVIEW2", "metadataReviewed": true, "reviewPassCount": 2,
    "approvedBy": "fixture-two-independent-reviews",
    "evidenceRefs": [
      {"path": "docs/judgment-1.json", "sha256": "<원장 1 실제 SHA-256>"},
      {"path": "docs/judgment-2.json", "sha256": "<원장 2 실제 SHA-256>"}
    ]
  },
  "registryChanges": [],
  "items": [{
    "questionUid": "uid1", "sourceOrdinal": 1,
    "before": {"problemTypeKey": null, "templateKey": null, "rpmL3": null, "rpmL4": null, "L3": null, "L4": null},
    "after": {"problemTypeKey": "PT_NEW", "templateKey": "TPL_NEW", "rpmL3": "reviewed-rpm-l3", "rpmL4": "reviewed-rpm-l4"},
    "reason": "독립 두 원장 일치: 학생용 해설",
    "evidenceRefs": [
      {"path":"docs/judgment-1.json","sha256":"<원장 1 실제 SHA-256>"},
      {"path":"docs/judgment-2.json","sha256":"<원장 2 실제 SHA-256>"}
    ]
  }]
}
```

남은 조건: 실제 등록에서는 ACTIVE 바인딩, 현재 source/identity/메타 before, 독립 판정 근거가 모두 있어야 한다. 유효하지 않은 키, 비어 있지 않은 충돌 source 값, 잘못된 before를 허용한 것이 아니다. C 커밋 없음(기존 지원 확인).

## D. 생산 게이트의 직접 유형 판정: 조사 후 미구현

**판정:** 작업 지시의 "소비자가 새 상태를 모르면 깨지는 곳이 있으면 구현하지 말고 선택지만" 조건에 해당하여 코드 변경을 하지 않았다. `PROJECTION_DIRECT`를 parity 함수 한 곳에서 허용하는 변경은 전체 생산 경로의 통과를 만들지 못하며 기존 증거 재계산 계약과 충돌한다. 이 항목의 코드 커밋은 없다.

### 호출 경로와 확인한 소비자

- `stage-meta-bridge.mjs:18–35`의 `checkResolverProjectionParity` 직접 호출은 같은 파일 `:48`의 `evaluateMetaStage`와 `past-exam-pipeline/lib/completion-evidence.mjs:119`의 `validateMetaRow` 두 곳이다.
- 생산 호출은 `promote-reviewed-exam.mjs:65` → `hardening.mjs:641`의 `assertPastExamPromotion` → `validatePastExamPromotion:574` → `validateCompletionEvidence:597` → 문항별 `validateMetaRow`다. `hardening.mjs:626`은 최종 `ADVANCED_META_ELIGIBLE`을 읽고 `:718`에서 promotion receipt에 귀속한다. 메타의 advanced 실패와 기초 출고 여부를 혼동하지 않았다.
- `completion-evidence.mjs:114–119`는 parity와 별개로 `validateMetaFinalization`을 호출한다. `rpm-active-resolver.mjs:805–821`이 다시 candidate PT/TPL과 resolver 키의 동일성을 확인한다. 앞단 parity만 바꿔도 이 오류가 남는다.
- `completion-evidence.mjs:126`의 projectionReady는 REUSE만 인정한다. `:244–251` 집계 어휘는 REUSE/BINDING_PENDING/UNMATERIALIZED/META_ONLY_COMPATIBILITY_PENDING뿐이어서 DIRECT는 분류에서 빠진다. `past-exam-pipeline/completion-contract.json:16–19,41`도 DIRECT를 정의하지 않는다.
- `stage-meta-bridge.mjs:61`은 REUSE가 아닌 상태를 전부 PROJECTION_PENDING으로 내며, CLI `:114–115`는 R1/R2/R3에서 META_FINALIZATION_PASS가 아니면 exit 2다. DIRECT를 단순 추가하면 새 판정이 준비완료로 전달되지 않는다.
- `rpm-active-resolver.mjs:24`의 projection 상태 목록에 DIRECT가 없다. `validateResolverEvidence:727–755`는 Resolver 결과 전체를 재계산하고 바디·해시 일치를 확인한다. 기존 resolverEvidence의 projectionStatus를 DIRECT로 덮어쓰는 방식은 `META_RESOLUTION_RECOMPUTE_MISMATCH`다.
- 공유 소비자도 좁은 두 파일 밖에 있다: `rpm-active-resolver.mjs:898,969,1099,1114`의 receipt/R2E finalization, `r2e/read-only-r1-adapter.mjs:97–100,295–306`의 projection pending 분류·집계, `r2e/final-gate.mjs:54–65`의 pending 판정, `materialize-meta-v2-payloads.mjs:43`의 CONFIRMED 대 PROJECTION_PENDING 투영. 모두 REUSE만 확정으로 취급한다.

### 근거 스키마

현재 `completion-evidence.mjs:96–97`은 row의 primaryMethod/decisiveStep/semanticReason을 필수로 하고, solution identity의 primaryMethod/decisiveSteps와 같은지 확인한다. 그러나 직접 고른 PT/TPL과 **그 선택을 뒷받침하는 원문 구절**을 결속하는 별도 정식 증거 스키마는 없다. `rpm-active-resolver.mjs:198`의 semanticDecision 허용키는 primaryMethod/decisiveStep/rpmPath뿐이다. candidate에 quote 문자열을 임의로 붙이는 것만으로는 해당 문항의 원문인지·판정 두 번의 근거인지 검증되지 않는다.

### 직접 실행한 검사

- `node --test archive/tools/meta-foundation/stage-meta-bridge.test.mjs`: 6/6 PASS (기존 테스트/기대값 변경 없음).
- 외부 일회성 import probe에서 `projectionStatus: PROJECTION_DIRECT`와 동일 PT/TPL candidate를 넣어도 parity는 `META_RESOLVER_ONLY_PROBLEMTYPEKEY_MISMATCH`, `META_RESOLVER_ONLY_TEMPLATEKEY_MISMATCH` 두 오류를 반환했다.
- 동일 DIRECT evidence를 built.validation PASS로 입력한 stage R2 probe도 metaStatus PROJECTION_PENDING을 반환했다. 이는 상태 소비자의 분기만 재현한 fixture이며 실제 Resolver 승인·생산 PASS를 주장하지 않는다.

### 선택지

1. **권장:** 기존 immutable resolverEvidence는 그대로 두고 별도 버전의 `directProjectionEvidence`를 설계한다. 동일 UID/ordinal, source content/solution hash, 실제 원문 구절과 그 위치, decisiveStep, 직접 선택 PT/TPL, 독립 판정/검수 근거를 결속한다. ACTIVE·TPL parent는 기존 validator로 검증한다. 직접 판정 상태와 add-only crosswalk 후보를 bridge, finalization, completion 계약/집계 및 관련 R2E/materializer 소비자까지 한 번에 연결하는 별도 한정 작업으로 시행한다. 이것은 strict/loose 이중 사용자 모드를 만들자는 뜻이 아니라 서로 다른 출처의 증거를 보존한 단일 경로다.
2. 이미 승인된 add-only binding/crosswalk 요청을 먼저 등록해 기존 Resolver가 같은 ACTIVE 키를 재현하게 한 뒤 현재 파이프라인을 사용할 수 있다. 다만 직접 판정은 언제나 Resolver와 같아야 한다는 제한을 제거한 최종 구현은 아니며 이번 D의 완료로 보고하지 않는다.

전체 생산 end-to-end/운영 적용/브라우저 검사는 NOT_RUN. D 관련 코드·테스트·정본·증거 파일 수정 없음.


## 공통 검증·앞 작업 합칠 곳·임의 선택

- A 직접 파일 214/214, 최종 반례 집중1/1 PASS.
- B 신규12/12 + 기존36/36 PASS. 변경된 요청 생성물의 공식 registrar dry-run PASS와 불변성 확인.
- C 기존 공식 경로 dry-run PASS, 임시 적용의 hold 해제 확인. C 코드 변경0.
- D 기존 stage bridge6/6 PASS와 DIRECT 상태 소비 거부 재현. D 위험 조건에 따라 코드 변경0.
- 독립 검토 A1/B11 PASS, 발견한 A 중복 pending 우회 수정 확인, `git diff --check` PASS. 위 검사 집합은 중복이 있어 합산하지 않는다.
- 코드 브랜치 head는 B 커밋, A/B 항목별 커밋 분리. C/D는 지시에서 허용한 조사 마감으로 코드 커밋 없음.


- TASK02의 `NEEDS_BINDING` 판정 산출물을 B의 source-bound 요청 입력으로 연결하는 어댑터는 앞 작업 병합 후 합칠 곳이다. 서로 미병합이라 해당 feature를 직접 가져오지 않았다.
- TASK03의 sourceDrift/reviewPending과 이 작업은 서로 다른 문제다. 바인딩 추가나 typeHold 해제는 source fingerprint 재결속·4칸 검증을 대신하지 않는다.
- 기존 메타 값/등록 영수증/정본 registry/크로스워크·봉인/4칸 사전/실제 시험지 JS 변경 없음. 테스트 fixture의 임시 등록과 운영 등록을 구분한다.
- 전체 테스트 suite, 원격 CI, 브라우저/학생 화면, 실제 운영 데이터 등록/파생 재생성은 NOT_RUN. feature branch 초벌이지 main 반영/출시 완료가 아니다.
