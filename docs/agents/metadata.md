# 문항 메타데이터

> 2026-10-30 루트 `AGENTS.md`에서 옮긴 원문이다. 문구는 그대로 두고, 링크 경로만 이 폴더 기준으로 고쳤다. 본문 속 백틱 경로는 저장소 루트 기준이다.
> 이 영역 작업을 시작할 때 읽는다. 공통 규칙과 작업별 안내는 루트 [AGENTS.md](../../AGENTS.md)에 있다. 새 지시는 루트 `AGENTS.md`가 아니라 이 문서에 추가한다.

## CURRENT — 공유 크로스워크는 추가만 한다 / 통파일 해시 고정은 봉인 영수증 + 행 검사로만 허용 (2026-11-03, 사용자 결정 A안)

- `archive/data/meta-foundation/crosswalks/**`는 다른 세션이 계속 행을 덧붙이는 공유 파일이다. 승인된 Generated Meta가 박아 둔 파일 통해시(`rpmDraftAuthoritySha256`, `rpmAuthoritySha256`)는 이 파일이 자라면 달라진다. 가드는 고정된 옛 해시를 (1) 봉인된 영수증(`archive/tools/sealed-crosswalk-digests.cjs`)이 같은 파일에 대해 기록한 해시이고 (2) Meta가 가리키는 행이 현재 파일에 그대로 있을 때(코스·단원·소단원·L1~L3, 생성 L4가 아니면 L4 라벨 일치)만 받는다. 어느 쪽이든 어긋나면 그대로 실패시킨다. 승인·영수증·학생 화면 내용은 고치지 않는다.
- `auto-register-approved-qid9.mjs`는 기존 승인 기록을 "다시 계산한 Meta와 크로스워크 해시 필드만 다르다"(해시를 같게 맞춘 정규화 비교) + 위 두 조건일 때만 변경 없음으로 넘긴다. 소스 샤드·시각 결속·샤드 드리프트·중복 검사는 그대로다. 새 가드를 만들 때도 통해시 동일성 대신 이 방식을 쓴다.
- 이유: 2026-11-03 f8e9ca610(고1 2학기 기말 유사 5건의 크로스워크 행 추가)이 `high1.json` 통해시를 바꿔 승인 Palma UID 약 171건의 Meta가 옛 해시를 가리키게 됐고, 학생 내용은 그대로인데 CI(`EXISTING_APPROVED_UID_REQUIRES_PINPOINT_REPAIR`)와 학생 사이트 배포가 막혔다. 이 때문에 봉인을 영수증 2개에 손으로 두지 않고 아래 레지스트리로 자동화했다(2026-11-03 사용자 승인).
- **봉인 레지스트리:** `archive/data/meta-foundation/crosswalks/sealed-digests.v1.json`(추가 전용, 항목 = path·sha256·gitBlobSha1·sealedAt·sealedBy·reason). `crosswalkDigestAccepted`는 현재 해시, 영수증, 레지스트리에 같은 경로로 봉인된 해시만 받는다(경로가 다르면 불가). 레지스트리가 깨지면(중복·형식 오류·`crosswalks/` 밖 경로) 실패 쪽으로 닫는다.
- **등록 때 자동 봉인:** Meta에 통해시를 박는 도구(`register-approved-generated-meta.mjs`, 이를 부르는 `auto-register-approved-qid9.mjs`, `backfill-generated-meta.cjs`, `build-generated-meta-browse-aliases.cjs`)는 자기가 실제로 읽은 크로스워크 바이트의 해시를 같은 쓰기에서 덧붙인다(멱등). 현재도 봉인도 아닌 해시를 박은 Meta는 `auto-register ... --check`와 게이트에서 `CROSSWALK_DIGEST_NOT_SEALED`로 실패하므로 PR 단계에서 잡힌다. 새 도구를 만들 때도 `planSeal`로 같은 방식을 쓴다.
- **백필은 git 이력으로 검증되는 것만:** `node archive/tools/backfill-sealed-crosswalk-digests.cjs [--write]`는 저장소의 승인 Meta가 박은 해시를 모아 그 크로스워크 파일의 실제 과거 버전(`git log -- <path>`)과 일치하는 것만 봉인하고, 일치 없는 해시는 봉인하지 않고 목록으로 보고한다. 이유: 추가 전용 공유 파일 때문에 행이 그대로인 승인 항목이 막혀서는 안 된다. 봉인은 증거일 뿐 면제가 아니다(Meta가 가리키는 행 검사는 그대로).

## CURRENT TOP — 단일 메타 Resolver 연결 (2026-10-30)

- 신규 기출 CREATE/R1/R2/R3에서 Primary RPM L1~L4 + CrossConcept/Condition/Integration을 교육과정 내 실제 풀이로 판정하고, PT/TPL은 [단일 진입·Resolver CURRENT](https://github.com/icefoxtail/AP------/blob/main/docs/architecture/JS_Archive_Meta_Single_Entry_Resolver_CURRENT.md)의 공식 명령/ACTIVE 바인딩으로만 투영한다. 작업자가 PT/TPL을 자유 추정하거나 CrossConcept으로 Primary를 대체하지 않는다. 모델 공통 규칙이며 사후 FINAL QA의 기존 PT/TPL 재검 제외·예약 Git writer 금지/현재 캠페인 설정은 유지한다.

## CURRENT — 문항 4칸·용어 사전 (2026-11-03, 사용자 결정)

- 문항의 4칸(given·goal·method·condition × 용어 번호) 기록을 만들거나 검사할 때는 [4칸·용어 사전 계약](../architecture/JS_Archive_Item_4Slot_Term_Contract_CURRENT_v1.md)을 먼저 읽는다.
- 4칸은 문항의 발문과 해설을 읽고 판정한다. PT/TPL/CC/COND 키나 라벨을 보고 치환해 채우지 않는다.
- 작성은 GPT 라인이 맡는다(2026-11-03 사용자 결정). 역할·단계·제출 형식은 [4칸 GPT 인계](../operations/JS_Archive_4Slot_GPT_Handoff_CURRENT_v1.md)를 따른다. 이유: 시범으로 규칙이 검증됐고 전체 확대는 저비용 모델로 하기로 했다.
- 작성한 4칸 기록의 검수·main 반영(compact 파일 `archive/data/item-4slot/`, 도구 `tools/4slot/`, 반려 절차)은 [4칸 검수와 main 반영](../operations/JS_Archive_4Slot_Review_and_Main_Import_CURRENT_v1.md)을 따른다. 이유: 증거는 작업 브랜치에 두고 main에는 용어 번호만 올리는 분리를 지키기 위해서다.
- 아직 운영 메타(`question_metadata.json`)·등록기·catalog·검색 화면과 연결하지 않았고 기존 승인·출제 자격에 영향이 없다. 이유: 시범 결과는 좋지만 통합은 장애 주입과 PC·휴대폰 실제 확인을 거쳐 따로 승인받기로 했다.

## CURRENT — PT·TPL·CrossConcept·Condition·크로스워크 행 확장 원칙 (2026-11-02, 사용자 결정)

사용자 결정 취지: "맞는 키가 없으면 새로 만들어도 된다. PT·TPL·CrossConcept 등은 언제나 확장 가능하고, 나중에 같은 형태의 문제가 나오면 거기에 붙이면 된다. 문항은 계속 생성되고 형태가 다양하니 유연하게 만들고 문서화하라."

- **(a) 맞는 기존 키가 없으면 가장 가까운 키에 억지로 붙이지 않는다. 정식 `registryChanges`로 새 키를 만든다.** 문항 해설과 정의가 모순되는 키를 달아 두면 학생 화면의 L4·유형 설명이 문항과 어긋나고, 그 키를 근거로 같은 유형을 모으면 엉뚱한 문항이 섞인다(신흥중 25 Q19가 다른 시험의 "미정계수 결정" TPL을 숫자 위치만 보고 물려받은 사례).
- **(b) 새 키의 이름·정의·`internalSkeleton`은 같은 형태 문항이 재사용할 수 있게 일반화해서 쓴다.** 특정 시험의 숫자·식·인물을 넣지 않고 풀이 구조(무엇을 어떤 순서로 하는지)로 쓴다. 이유: 정의가 한 문항에 묶이면 다음 문항이 붙을 수 없어 같은 유형의 키가 계속 늘어난다. 이름 규칙은 기존 키 패턴을 따른다(예: `TPL_<과정>_<풀이 구조>`, 부모 PT 아래). 기존 키로 충분한지 먼저 같은 PT 아래 TPL 정의를 읽고 판단한다.
- **(c) 새로 만든 키도 공식 레지스트리·Resolver를 거치므로 "PT/TPL은 공식 Resolver 결과만" 규칙과 충돌하지 않는다.** 그 규칙의 뜻은 작업자가 PT/TPL을 추정해 쓰지 말라는 것이지 새 키를 만들지 말라는 것이 아니다. 새 키는 반드시 정식 요청(근거 파일 SHA 결속, 등록기 검증, 크로스워크·바인딩 정합)으로 들어가고, 이후 Resolver가 그 키를 결과로 낸다.
- **(d) 다음 문항이 같은 형태면 그 키를 재사용한다.** 새 키를 또 만들지 않는다. 지원 문항(`supportingQuestionUids`)과 크로스워크 `templateCandidates`에 덧붙이고, 정의가 그 문항을 포함하도록 억지로 넓혀야 하면 새 키를 만든다. 이유: 키가 같은 형태 문항의 묶음 단위여야 검색·통계가 의미를 가진다.
- **(e) 추가(add-only)를 우선하고, 기존 행·키 수정은 영향 문항을 확인하고 기록한다.** 새 TPL·바인딩·크로스워크 행은 추가로 처리한다. 같은 리프·단원에 쓰는 행이 `RPM_ONLY`뿐이라 후보 TPL을 붙일 ACTIVE 행이 없는 경우처럼 기존 행을 바꿔야 할 때만 최소 수정하고(예: `RPM_ONLY`를 `FAMILY_ACTIVE`로), 같은 행을 쓰는 모든 문항의 Resolver 결과가 그대로인지 확인해 요청의 증거 파일에 적는다. 이유: 기존 행을 쓰는 다른 시험지의 메타를 조용히 바꾸지 않기 위해서다. 의미 키 삭제·정의 변경은 지금처럼 등록기가 막는다.
- **크로스워크 행 확장:** 문항의 PT/TPL에 맞는 ACTIVE 행이 없어 RPM Primary 경로(`rpmPrimaryPath`)를 못 채우면, 문항·해설을 보고 마스터에 있는 RPM 리프를 정해 `archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/<파일>.json`에 `DIRECT_ACTIVE` 행(문항의 PT/TPL, 문항 자신의 `standardUnitKey`·`subUnitKey`, ACTIVE 바인딩)을 덧붙이고 `summary` 개수를 갱신한다. 이름이 비슷하다고 고르지 않는다. 같은 리프 후보가 둘이면 소형 메타에 `rpmPrimaryRecordId`로 지목한다. 마스터에 맞는 리프가 아예 없거나 해설이 두 리프 중 하나로 정해지지 않는 문항만 비워 두고 이유를 EVIDENCE_DEBT로 적는다.
- **같은 (리프, 단원)에 TPL이 둘 이상이면 새 행을 더해도 된다. Resolver가 행을 고른다:** 행은 (리프, 단원, PT/TPL) 단위이고 등록기(`targetParentRef.crosswalkRef`)와 `main_merge_master.py`는 PT/TPL이 정확히 같은 `DIRECT_ACTIVE` 행을 요구한다. Resolver는 리프+단원으로 행을 찾고, 세부단원(`subUnitKey`)이 다른 행은 제외한 뒤에도 `DIRECT_ACTIVE` 행이 둘 이상이면 `CROSSWALK_ROW_SELECTION_PENDING`을 내고, 결정 단계로 고른 `familyTemplateSelection`(`crosswalkRecordId`와 그 행의 `templateKey`)이 있으면 그 행으로 `PROJECTION_REUSE`를 낸다(`FAMILY_ACTIVE`와 같은 선택 규칙). 행 중 하나라도 `DIRECT_ACTIVE`/`ACTIVE`가 아니거나 PT/TPL이 비면 이전처럼 `CROSSWALK_COMPATIBILITY_ROW_AMBIGUOUS`다. 한 리프에 PT가 둘 이상(예: 수II 증감표)이어도 되고, 같은 PT 아래 TPL만 여럿이면 `FAMILY_ACTIVE` 한 행에 `templateCandidates`로 모아도 된다(신흥중 M3-RPM-025). 이유: 새 형태가 생길 때마다 행을 더하는 쪽이 add-only이고 이미 등록된 문항 값은 건드리지 않는다. 2026-11-02 전수 확인: 같은 (curriculum, scope, rpmPath, 단원) 중복 11군 25행이 모두 선택으로 해소됨(`rpm-active-resolver.test.mjs`).
- 실행 기록: 신흥중 25 중3 Q19·Q20 신규 TPL `TPL_M3_COMMON_FACTOR_BY_FACTORIZATION`, `TPL_M3_FIND_OTHER_FACTOR_BY_FACTORIZATION`(+ 크로스워크 `M3-RPM-025` FAMILY_ACTIVE) `archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/finalqa-shinheung-25-1mid-m3-q19-q20-tpl-20261102.review.json`, 비워 둔 RPM 경로 8문항과 금당고 유사 Q1·Q16 단원 재정렬 `.../rpmpath-8q-crosswalk-decisions-20261102.review.json`. 같은 형태 문항을 만나면 이 사례를 먼저 본다.
- 도구: `python3 tools/main_merge_master.py --exam <시험지> --rpm-path-delta --request-tag <태그> --evidence <결정 파일>`은 이미 한 번 delta를 낸 시험지에 새 requestId로 두 번째 delta를 만든다(같은 requestId는 등록기가 거부). 소형 메타 항목에 `unitRealign: true`와 바뀐 단원 필드(`standardUnitKey/standardUnit/subUnitKey/subUnit/conceptClusterKey`)·`parentAssignment`를 적으면 그 단원 필드와 RPM 경로를 한 요청으로 보낸다(내용이 속한 교육과정 단원과 등록 단원이 달라 경로와 어긋날 때). 시험지 JS의 같은 필드도 함께 맞춰야 등록기가 받는다.

## CURRENT — 기본범위 승인 재결속 `archive-basic-scope-rebind-request-v1` (2026-11-02, 사용자 결정)

- 기본범위 승인(question_metadata의 standardUnit/subUnit 승인 행 + `basic-scope-source-links.json` 부모 연결)된 문항의 그림만 바뀌어 fingerprint가 어긋나 strict 검색에서 사라졌을 때, 메타 값은 그대로 두고 원본 해시만 다시 묶는 등록 요청이다. 구현: `archive/tools/meta-foundation/register-basic-scope-rebind.mjs`, 테스트: `tests/archive-basic-scope-rebind.test.mjs`. 이유: 기존 등록기(v2)는 시험지 전체 재등록만 받아 그림 하나 때문에 전체 재검수를 해야 했고, Registration Sync는 본문 fingerprint가 달라진 부모 연결을 조용히 버린다.
- 거부 조건: 요청이 메타 값을 바꾸려 함(before/after는 두 fingerprint만), 승인 행이 아님·검토 초기화 대기, 요청 시험지에 없는 qid, 소스 blob/이전 blob/저장된 fingerprint/after 해시 불일치, 이전 blob이 승인 fingerprint를 재현하지 못함, 정답·선택지·풀이·분류 필드 변경, 본문 변경(맨 앞 `[도형필요]`/`[그래프필요]` 줄 제거와 숫자·`$`·`\` 없는 8자 이하 선언 문구 수정만 허용), 그림 파일 없음, 그림·본문이 실제로 안 바뀜, `basicParent`가 승인 소단원의 유일한 정본 부모가 아님, 기존 연결의 부모 변경. 거부 시 어떤 파일도 쓰지 않는다.
- 추가 결속(2026-11-02 검수 반영): 새 그림(image 참조 변경, 파일 존재, 해당 문항 `assets/images/<시험지>/q<번호>.<ext>`)이 항상 필수이고 본문 수정은 그 위에서만 허용한다. 글자 수·숫자 제한만으로는 "최대→최소" 같은 뜻 뒤집기를 못 막으므로, 승인 evidenceRefs의 검토 파일(`archive-basic-scope-rebind-review-v1`)에 같은 requestId·examUid·sourceArchiveFile, 문항별 `contentEdits`(요청과 정확히 같음)와 변경 후 본문 `contentAfterSha256`이 있어야 한다. 다른 요청·시험지·문항의 검토 파일은 거부한다.
- 이 경로는 검수를 대신하지 않는다. 그림 변경이 문항 의미를 바꾸지 않았다는 확인(문항·해설·정답·그림 직접 확인)을 `evidenceRefs`의 검토 파일에 남긴 요청만 쓴다.

## CURRENT — 유사시험지 RPM Primary 경로(rpmPrimaryPath) 등록 (2026-11-02)

- 등록기가 읽는 RPM 경로 필드는 `rpmPrimaryPath`(L1~L4, crosswalkRecordIds)뿐이다. 소형 메타가 `rpmPrimary{recordId}`·`rpmPrimaryL1~4`로만 적으면 등록 요청 생성기(`tools/main_merge_master.py`)가 버려 학생 검색 카드에 "RPM L1~L4 미지정"이 나온다(24 매산여고·25 제일고 수II, 25 금당고 확통이 그랬다). 이제 생성기가 공식 크로스워크에서 경로를 정해 `rpmPrimaryPath`로 싣는다: 같은 교육과정·과목·PT·TPL의 ACTIVE 행 중 소형 메타가 지목한 레코드이거나, 후보 경로가 하나뿐일 때만. 후보가 없거나 여럿인데 지목이 없거나 지목 레코드의 PT/TPL이 다르면 그 문항은 비워 둔다(EVIDENCE_DEBT, 이름이 비슷하다고 추정하지 않는다). 이유: RPM Primary는 Resolver/크로스워크 결과만 쓴다.
- 이미 등록된 시험지에 경로만 추가: `python3 tools/main_merge_master.py --exam <시험지> --rpm-path-delta --apply` → `.archive-meta-register/inbox/rpmpath-<시험지>.json`(FINAL_QA, 다른 승인 값 변경 없음, 기존 `targetParentRef` 유지, 경로를 못 정한 문항은 빈 패치). 이유: 같은 requestId로 다시 등록하면 "requestId reused with different content"로 거부된다.

- 생성기 보강(2026-11-02): ① 크로스워크 행의 `scope`(`수학_상/하`)와 `standardCourse`(`수학(상/하)`)는 같은 과목의 두 표기라 어느 쪽이든 과목과 같으면 후보로 본다(2015 고1 문항이 모두 경로를 잃었던 원인). ② `FAMILY_ACTIVE` 행은 `templateCandidates`에 문항의 TPL이 있으면 후보다(행이 TPL 선택을 Resolver에 맡기는 구조라 `templateKey`가 없다). 소형 메타가 지목한 레코드가 문항의 PT/TPL·내용과 맞지 않으면 지목을 고치거나(새 행 `rpmPrimaryRecordId`) 마스터에 맞는 리프가 없을 때만 비운다. 이유: 지목이 틀린 채로 두면 문항이 엉뚱한 리프에 붙거나 경로 없이 등록된다.
- 24 고1 2학기 기말 유사 5건 기록: 결정과 영향 확인은 `archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/rpmpath-h1-2final-24-5exams-crosswalk-decisions-20261102.review.json`. 소형 메타의 L1/L2가 RPM 부모(예: 함수>함수)인데 `parentAssignment`가 없으면 등록기가 'canonical label mismatch'로 거부하므로 값을 낮추지 말고 `parentAssignment`(CROSSWALK_EXACT)를 항목마다 적는다. 같은 바인딩을 필요로 하는 요청이 여럿이면 registryChanges는 요청 처리 순서(inbox 파일명 순)상 먼저 오는 요청 하나에만 싣는다(두 번 실으면 둘째가 'registry before mismatch'로 거부된다).

## CURRENT — Generated 확장 키(EXT-*) 등록 (2026-11-02, 사용자 결정)

- 소형 메타가 `EXT-CROSS-*`/`EXT-COND-*`를 쓰면 등록기(`reviewed-exam-registration-v2.mjs`)가 색인·원본 registry·정본 부모·교육과정/과목 범위를 확인하고 받는다. 정본 승격은 일어나지 않는다(정본 registry, compiled, RPM LOCKED, 색인은 바뀌지 않음). 미등록·부모 없음·승격 주장·`GENERATED_ACTIVE` 아님은 계속 거부한다. 이유: 확장 키 하나 때문에 시험지 전체 등록이 막혔다. 상세: [등록 v2](../architecture/Reviewed_Exam_Meta_Registration_v2.md).
- 요청 JSON은 확장 키를 `crossConceptKeys`/`conditionKeys`에 그대로 적는다(`registryChanges`에 확장 정의를 넣지 않는다). 확장 L4(`rpmGeneratedL4Key`)는 등록기 필드가 아니라 원본 JS·확장 registry에 둔다.

## CURRENT TOP — 메타 계약은 정확한 업무 정본으로 이동 (2026-10-22)

- [Notion 02-06 메타데이터 라우트](https://app.notion.com/p/4010e68bd69f81588ea0cc325bbe51cb)에서 **의미 판정**과 **공용 조회/소형 JSON 쓰기** 및 **Git 자동 등록 기술 담당**을 구분한다. 실질적 규칙은 [의미 메타 정본](../../docs/architecture/JS_Archive_Metadata_Required_On_Create_Edit_Review_CURRENT_v1.md), [소형 JSON 쓰기 정본](../../docs/architecture/JS_Archive_Small_JSON_Meta_Write_Contract_CURRENT_v1.md)에 한 번만 둔다. 기존 역할별 검수·Golden·Blind 의무는 유지한다.
- 공용 대형 메타는 조회용이며 작업자는 시험지 소형 JSON/stage-local 패킷만 수정한다. 병합 후 등록·Consumer/Search parity는 Git 자동화/기술 소유 범위다. GPT 사후 FINAL QA의 종료는 [v2.0 카드](../../docs/operations/JS_Archive_FINAL_QA_EXECUTION_CARD_CURRENT.md)대로 Git main/대상 blob 확인까지이며, PT/TPL 신규 검사 제외·후속 CI/Pages 수동 폴링 제외를 지킨다. 자동화 검증을 수행하지 않았으면 `PIPELINE_PASS`라고 주장하지 않는다.

## CURRENT HARD — JS 신규·수정·검수 Meta 필수 확인 (2026-10-10)
- 모든 기출·유사·Generated·교재/평가용 JS의 신규 제작·기존 수정·문항 검수에서 [JS Metadata 필수 계약](../../docs/architecture/JS_Archive_Metadata_Required_On_Create_Edit_Review_CURRENT_v1.md)을 적용한다. 해당 작업 UID의 standardUnit/subUnit·RPM L1~L4·CrossConcept/Condition/Integration/PT/TPL·level/1~5 난이도·UID/sourceQid/provenance·Consumer/index 정합을 확인한다. 미확정 근거는 정확한 EVIDENCE_DEBT로 기록하고 가짜 키/추정값/가짜 NONE으로 채우지 않는다. 핀포인트 작업의 범위를 무관한 문항 전수 재검으로 확대하지 않는다. 메타 변경은 필수 직접 dependency와 운영 검색 projection에 결속한다.
