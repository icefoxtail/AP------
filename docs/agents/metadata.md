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

## CURRENT — 모든 결과물의 확장 메타·4칸·검토 기록 작성 (2026-11-04, 사용자 결정)

- 기출·유사문제/시험지·ALIVE/Generated·교과서·문제집·교재/평가 결과물은 제작할 때 **문항 JS + 확장 의미 메타 + 4칸 + 작성·검토·변경·출처 기록**을 함께 작성한다. 필수 정보·역할별 책임·제출 분모·SOURCE_ONLY 인계·기존 UID 재사용은 [의미 메타 정본의 공통 작성·검토·인계 요건](../architecture/JS_Archive_Metadata_Required_On_Create_Edit_Review_CURRENT_v1.md)이 소유한다. 이유: 4칸을 별도 시범으로만 안내하면 신규 결과물에서 빠질 수 있다.
- 문항의 4칸(given·goal·method·condition × 용어 번호) 기록을 만들거나 검사할 때는 [4칸·용어 사전 계약](../architecture/JS_Archive_Item_4Slot_Term_Contract_CURRENT_v1.md)을 먼저 읽는다.
- 4칸은 문항의 발문과 해설을 읽고 판정한다. PT/TPL/CC/COND 키나 라벨을 보고 치환해 채우지 않는다.
- 신규 제작분은 해당 제작·검수 라인이 자기 역할 안에서 작성·검토한다. 기존 자료의 비교 시범·일괄 확대는 [4칸 GPT 인계](../operations/JS_Archive_4Slot_GPT_Handoff_CURRENT_v1.md)의 별도 배정·독립성·제출 형식을 따른다. 이 문서가 모델이나 예약·Git 쓰기 권한을 새로 지정하지 않는다.
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

- 기본범위 승인(question_metadata의 standardUnit/subUnit 승인 행 + `basic-scope-source-links.json` 부모 연결)된 문항의 그림만 바뀌어 fingerprint가 어긋나 strict 검색에서 사라졌을 때, 메타 값은 그대로 두고 원본 해시만 다시 묶는 등록 요청이다. 구현: `archive/tools/meta-foundation/register-basic-scope-rebind.mjs`, 테스트: `tests/archive-basic-scope-rebind.test.mjs`. 이유: 기존 등록기(v2)는 시험지 전체 재등록만 받아 그림 하나 때문에 전체 재검수를 해야 했고, 등록 동기화(main 등록기)는 본문 fingerprint가 달라진 부모 연결을 조용히 버린다.
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

## CURRENT — 5단계 난이도(Gemini) 인박스 운반: 수리는 도구가, 작업 목록은 빈 파일만 (2026-11-11, 사용자 위임 결정)

- **배경 숫자:** 2026-10-30 ~ 11-09 장부(`.archive-meta-register/diff5-intake-ledger.json`) 698건 중 반영 191건(3,424문항), 보류 504건. 보류의 절반(약 260건)은 이미 난이도가 있는 시험지를 다시 판정한 것이고, 나머지 절반(약 240건)은 형식 문제였다(원본 변경으로 해시 불일치 57, `ordinal` 대신 `sourceOrdinal` 48, 값 형식 무효 42, payload 형식 29 등). 그동안 난이도가 전혀 없는 파일 333개(7,611문항)는 그대로였다.
- **수리는 운반 작업자가 손으로 하지 않고 도구가 한다:** `node archive/tools/meta-foundation/register-difficulty5.mjs --wrap <Drive 원본> --normalize …`. `sourceOrdinal`→`ordinal`, 신뢰도 대문자→소문자, `schemaVersion`→`v1`, 등록 필드만 추출, `latestBlobSha`를 현재 파일의 LF blob 해시로 맞춘다. 고친 내용은 stderr의 `DIFF5_INTAKE_REPAIRS:` 줄과 `gemini._intakeNote`에 남는다. 이유: 지시문으로 시킨 손 수리는 규칙이 있는 동안에도 해시 불일치 57건을 그대로 흘렸다(Windows CRLF 바이트 해시를 쓰는 등 매번 다르게 처리).
- **난이도 값은 고치지 않는다.** `after.difficultyBucket` 등 판정 값은 그대로 옮기고, `"3"`·`"certain"`·`"none"`처럼 규격과 다른 값은 추정해 바꾸지 않아 지금처럼 `SKIP_INVALID`가 된다. 등록기의 문항 번호↔questionUid 대조와 "기존 숫자는 덮어쓰지 않는다"는 그대로다.
- **장부의 "같은 파일은 건너뛴다"는 유지한다.** 다만 수리 규칙이 바뀌어 다시 볼 가치가 생긴 보류 건은 장부에서 그 항목을 지워 다음 회차에 새 파일로 다시 처리되게 한다(2026-11-11에 해시 불일치·ordinal·payload·값 형식 무효 176건을 이렇게 되돌렸다). 충돌(기존 난이도와 다름)·questionUid 불일치·원본 없음은 되돌리지 않는다.
- **판정 대상은 난이도가 빈 파일만:** `node archive/tools/meta-foundation/list-missing-difficulty5.mjs [--format tsv] [--out <파일>]`이 정본 메타 기준으로 목록을 만든다(기출 최신 연도 먼저 → 유형 → 교과서 → 유사, 일부만 빈 파일은 빈 문항 번호 포함). Gemini 예약 라인에는 이 목록의 파일만 판정하게 한다. 이유: 이미 숫자가 있는 파일의 재판정은 인박스에서 전부 버려진다.
- 기존 난이도와 다르게 나온 재판정을 반영하려면 `reviewedCorrection`(정확한 근거 필요) 경로를 쓴다. 인박스 운반에서 덮어쓰지 않는다.

## CURRENT — 빈 메타 총정리: Codex가 직접 판정·등록한다 (2026-11-11, 사용자 결정)

- **라인 결정(같은 날 변경):** 처음 계획은 Gemini 1차 · GPT 예약 2차였으나 사용자가 "Gemini 워커는 빼고 Codex 창에서 바로 시킨다"로 바꿨다. Gemini는 유사문항 생성 라인으로 돌리고, 분류 판정에는 쓰지 않는다. 이유: Gemini 제출은 형식 문제와 재판정으로 버려진 비율이 높았고(난이도 698건 중 191건만 등록), 저장소에서 도구를 직접 돌릴 수 있는 Codex가 판정부터 등록까지 한 곳에서 하는 편이 운반 단계가 없다. 난이도 라인(위 절)은 이미 만들어져 있어 대상 목록이 빌 때까지 Gemini에 그대로 두되, 한 주 등록 실적이 나오지 않으면 Codex로 옮긴다.

- **배경 숫자(2026-11-11 정본 28,615문항):** 빈 값은 난이도 7,611(373개 파일), 단원 2,295(기출 106개 파일), 소단원 4,416(기출 2,713 · 교과서 1,703), 유형 PT/TPL 17,371(853개 파일). 개념 묶음·CrossConcept·Condition·Integration은 대부분 비어 있지만 Archive 2.0의 어느 화면도 읽지 않는다. 이미 판정했는데 등록되지 않은 유형 판정이 `pending-supplement` 72개 시험지(948문항)와 `rejected`(120문항)에 있고, 거부 사유는 대부분 `curriculumKey`·`before` 불일치 같은 형식 문제다.
- **판단은 모델이, 형식은 도구가 만든다.** 판정하는 세션은 아래 판정 원장만 낸다. 등록 요청의 `before`·해시·문항 수·스키마는 도구가 정본에서 읽어 채운다. 이유: 손으로 만든 요청이 난이도 약 240건, 분류 39건 이상 형식으로 거부됐다.
- **빈 것만 한다.** 대상은 저장소 도구가 만든 "빈 파일 목록"에 있는 파일뿐이고 위에서부터 한다. 이유: 난이도 제출 698건 중 약 260건이 이미 값이 있는 시험지의 재판정이라 버려졌다.
- **한 번 읽을 때 다 받는다.** 분류 읽기 한 번에 단원·소단원(빈 문항만), 핵심 풀이·결정 단계·RPM L1~L4, CrossConcept·Condition·Integration을 함께 낸다. 화면이 읽지 않는 항목만 채우는 단독 작업은 만들지 않는다. 난이도는 별도 판정이라 위 절의 라인을 그대로 쓴다.
- **판정은 두 번, 서로 보지 않고 한다. 안 맞으면 추정하지 않는다.** 1차 판정과 2차 판정은 서로 다른 대화 컨텍스트에서 한다(별도 Codex 창이거나, 한 감독 세션이 따로 띄운 하위 작업자 둘). 2차는 자기 원장을 다 쓰기 전에 1차 원장을 열지 않고, 감독 세션은 2차 작업자에게 대상 시험지 목록만 넘기고 1차 원장의 내용은 넘기지 않는다. 감독 세션은 불일치를 한쪽 값으로 정해 주지 않는다. 두 원장이 일치한 문항만 등록하고 불일치·판정 불가는 HOLD 목록에 `EVIDENCE_DEBT`로 남긴다. 같은 세션의 자기 점검을 독립 검수로 적지 않는다.
- **PT/TPL은 원장에 적지 않는다.** RPM 경로에서 공식 Resolver(`rpm-active-resolver.mjs`)가 뽑는다. 크로스워크 행이 없으면 등록하지 않고 "새 키 후보"로 빼서 Codex가 `registryChanges`로 처리한다(위 "확장 원칙" 절).
- **역할(창 A·B는 별도 창 또는 감독 세션의 하위 작업자 A·B):** Codex 창 A = 도구 제작, 밀린 판정 회수(판정 값은 그대로 두고 `before`·해시만 현재 정본으로 다시 만들어 새 `requestId`로 재제출), 분류 1차 원장. Codex 창 B = 분류 2차 원장, 두 원장 대조 → 도구로 요청 생성 → dry-run → 인박스 PR, HOLD·새 키 후보·거부 건 처리. 원장은 작업 폴더 `.tmp/meta-backfill/`에 두고 커밋하지 않는다.
- **채우는 순서(화면에 쓰이는 것부터):** ① 난이도(기출 2026년 → 과거 → 유형별·교과서·유사) ② 단원·소단원이 빈 기출 ③ 유형(기출 최신 연도부터) ④ 교과서 소단원, 유형별·유사 문제지.
- **판정 원장 `meta-judgment-ledger-v1`(시험지 하나에 파일 하나):** 최상위 `schemaVersion`, `judge`(`pass1`|`pass2`), `createdAt`, `sourceArchiveFile`(목록 값 그대로), `items[]`. 문항마다 `ordinal`, `questionUid`, `primaryMethod`(핵심 풀이 한 문장), `decisiveStep`(결정 단계 한 문장), `rpmPath{majorUnit, midUnit, l3, l4}`, `crossConceptKeys[]`, `conditionKeys[]`, `integrationPattern`, 그리고 목록에서 단원·소단원이 빈 문항에만 `standardUnitKey`, `subUnitKey`. 키는 저장소가 내보낸 선택지 표에 있는 값만 쓰고, 맞는 값이 없거나 판정할 수 없으면 값을 비우고 `hold`에 사유를 적는다.
- **도구:** 빈 메타 목록·선택지 표는 `list-missing-meta.mjs`, 두 원장을 대조해 v2 요청을 만드는 것은 `build-meta-request.mjs`(아직 없음)이다. 도구 병합을 기다리지 않고 판정을 먼저 시작한다(2026-11-11 변경, 아래 절).
- **이 계획 밖:** 소단원 값과 필드 승인은 있으나 문항 상태가 의미 검토 대기라 카탈로그가 빼는 문항이 약 11,800개 있다(`archive/tools/build-archive2-catalog.mjs`의 소단원 승인 조건). 값을 채울 일이 아니라 화면 규칙 결정이다.

## CURRENT — 빈 메타 채우기 실행 방식: 루나 밤샘 판정 + 기계 합격 검사 (2026-11-11, 사용자 결정)

위 "빈 메타 총정리" 절의 원칙(빈 것만, 두 번 독립 판정, 판단은 모델·형식은 도구)은 그대로이고, 실행 방식만 아래로 바꿨다.

- **받아 두고 나중에 묶는다(채워 가는 메타 전체의 방향).** 새 키가 생기면 미분류로 받아 두고, 묶기·포함시키기는 나중에 따로 한다. 이유: "정본이 아니다"라는 이유로 값이 밀려 파이프라인이 멈추는 일을 없앤다. 소단원은 묶음표의 미분류가 그 자리이고, PT/TPL·Condition 키도 같은 방향으로 간다(계약 변경은 따로 제안).
- **판정자는 루나(Codex 저비용 모델)이고 감독 세션이 직접 돌린다.** 난이도도 루나가 판정한다. Gemini 난이도 판정은 나중에 참고로만 쓴다. Sonnet은 코드와 작은 표본 확인에만 쓴다. 이유: 읽고 판정하는 대량 작업은 속도가 느려도 되고(밤새 실행), Sonnet 사용량을 아낀다.
- **한 번에 모든 층을 정리한다.** 난이도, 단원·소단원, RPM 경로, CrossConcept·Condition·Integration, 4칸까지 기출·유사·생성 문항 전부가 대상이다. 순서는 고1·고2 과목별로 먼저 끝내고 확인한 뒤 나머지다. 중등은 기존 L2·L3 분류에서 크게 벗어나지 않는다.
- **난이도는 보수적으로.** 두 단계 사이에서 애매하면 낮은 단계를 주고 경계 플래그로 표시한다. 정의·공식을 바로 쓰면 1단계다. 계산이 길다·서술형이다·배점이 높다는 올리는 이유가 아니다. 이유: 1차 표본 30문항 중 어긋난 7문항 가운데 6문항이 높게 잡은 쪽이었다.
- **기계 합격 검사(원장 단위).** 틀 문장 반복, 발문 인용, 일반 문구, 선택지에 없는 키, 사유 없는 빈 칸, 문항 식별자 불일치가 있으면 그 원장을 통째로 버리고 그 시험지를 다시 시킨다. 이유: 범주별 고정 문구를 스크립트로 찍어 낸 원장이 1차에서 45개 중 41개였다.
- **문항 번호 확인.** 판정 근거는 반드시 그 번호 문항의 내용이어야 한다(24번 칸에 20번 내용을 적은 사례). 두 판정을 대조할 때 근거가 같은 문항을 설명하는지도 본다.
- **보류 문항은 그림을 직접 읽는 라인으로 다시 판정한다.** "조건이 모순", "선택지에 답이 없음"은 보류 사유가 아니다. 이유: 중·고등 문항의 그런 오류는 이미 고친 상태라, 모순으로 보이면 잘못 읽은 것이다. 그림 파일이 실제로 없거나 값이 읽히지 않을 때만 보류한다.
- **4칸은 문항마다 판정한다.** 유사·생성 문항은 원본의 4칸을 참고하되 그대로 이어받지 않는다. 묻는 것·조건이 달라지면 값이 달라도 정상이다(정본 문서 미결 2번을 이것으로 닫는다).
- **단원·소단원의 기준은 2022 개정 교재 차례다.** 예: 연립일차부등식과 "이차방정식의 실근의 조건"은 공통수학1 "여러 가지 부등식". 학년이 어긋난 값(고1 문항에 중2 키 등)은 재판정 대상으로 넘겨 바로잡는다.
- **두 판정의 대조(2026-11-12 사용자 결정):** 일치 → `REVIEW2`(`reviewPassCount: 2`, 두 원장 파일의 SHA-256을 근거로)로 요청. 난이도 한 단계 차이 → **2차 값** + 경계 플래그, 확신도 `low`. 두 단계 이상·한쪽 보류·분류 불일치 → 요청에서 빼고 보류. 이유: 2차 전체가 보수 규칙 아래에서 판정됐고 틀 문장이 없었다. "낮은 쪽" 규칙은 보수 규칙과 겹쳐 두 번 내려가(1단계 28%) 2차가 구체적 근거로 올린 문항까지 내렸다.
- **옛 과목·표가 빈 과목은 지금 과목의 표로 합류한다(2026-11-12 사용자 결정).** 2009 개정 "기하와 벡터"처럼 유형 경로 선택지가 없는 과목의 문항은 보류하지 않고 같은 내용을 지금 다루는 과목(기하 등)의 표에서 고르고, 어느 표를 썼는지 원장에 `choiceTableUsed`로 남긴다. 이유: 표가 없다는 이유만으로 문항 전체가 보류돼 화면에서 유형으로 찾을 수 없었다.
- **작업자 감독(2026-11-12 사용자 지시):** 시험지 하나를 끝낼 때마다 보고 줄(`끝났어요 | 시각 | 시험지 | 문항 | 보류`)을 남기게 하고, 한 실행에서 기준(시험지 4개)보다 적게 한 실행은 다음 지시문에 실제 숫자와 함께 지적한다. 원장 없이 완료로만 적은 시험지는 진행표에서 빼 다시 시킨다. 형식 문제(PowerShell의 배열 감싸기, 수식 역슬래시)는 작업자 탓으로 버리지 않고 도구가 고쳐 읽는다.

## CURRENT — 소단원 묶음표: 같은 내용의 소단원 키를 하나로 보여 주고 고른다 (2026-11-11, 사용자 결정)

- **무엇:** `archive/data/archive2-subunit-groups.json`. 같은 통합 단원(subject + unitKey) 안에서 한 소단원으로 보여 주고 선택하는 `subUnitKey` 묶음이다. 기존 키·정본 값(`question_metadata.json`), 크로스워크, `sealed-digests`, 카탈로그는 바꾸지 않는다. 표시와 선택에만 쓰고 표에 없는 키는 자기 자신이 하나의 묶음이다. 이유: 같은 내용이 2015·2022 키, 표기, 단원 번호 때문에 여러 풀로 갈라져 소단원 평가가 모이지 않았다.
- **원천과 도구:** 사람이 문항 발문을 읽고 정한 판정은 `archive/data/meta-os/subunit-group-rules.json`이 소유한다. 표는 `node archive/tools/meta-os/build-subunit-groups.mjs`로 만들고 `--check`로 같은지 본다. 표를 손으로 고치지 않는다. 새 묶음은 규칙 파일에 판정을 추가해 다시 만든다. 새 키가 정본에 생겨도 `--check`는 실패하지 않고 미분류(자기 묶음) 키 수만 센다.
- **묶음 종류:** `subunit`(소단원, 이름은 마스터 표 `labelKo`이고 2022 체계 키가 있으면 그 이름), `unit_general`(`...-CORE` 같은 넓은 키, 쪼갠 키와 묶지 않음, 이름 "단원 일반"), `unit_other`(마스터 표에 없는 임시 키 중 분명한 마스터 소단원이 없는 것, 이름 "기타"), `moved`(다른 단원 소단원에 속하는 키, 아래), `excluded`(문제 번호가 키가 된 `...-P152-Q04` 류, 소단원 평가 제외).
- **묶는 기준:** 이름·내용이 사실상 같을 때만 묶는다. 삼각함수 정의와 삼각함수 기본처럼 범위가 다르면 묶지 않고, 확신이 없으면 따로 둔다. 키마다 실제 문항 2~3개의 발문을 읽어 같은 내용인지 확인한 묶음만 `reviewed: true`다.
- **이동 표시(`moved`):** 그 단원에 놓여 있지만 내용이 다른 단원 소단원(또는 그 단원의 "단원 일반")에 속하는 키는 `moved` 묶음의 `belongsTo{subject,unitKey,unitLabel,groupKey}`로 그 묶음을 가리킨다. 가리키는 묶음이 실제로 있어야 하고(생성기·테스트가 검사), 이동의 이동(사슬)은 없다. 키 값은 바꾸지 않는다. 예: 중2 연립일차부등식(M2-03-SYSTEM_INEQ_SOL 등)은 2022 교육과정에서 고1로 옮겨 가 공통수학1 "여러 가지 방정식과 부등식"의 연립부등식 묶음을 가리킨다. 화면이 이 표시를 읽는 방법은 아직 정해지지 않았다(통합 단원 배치 코드는 이 PR에서 바꾸지 않음).
- **학년이 다른 키(`cross_grade_key`):** 중등 범위에 다른 학년 접두어(M1·M2·M3)나 고등 키, 고등 범위에 중등 키가 있으면 근거를 `cross_grade_key`로 표시해야 하고(표시가 없으면 생성기가 실패), 이 표시는 그런 키에만 쓴다. 문항의 소단원 값이 틀렸다는 뜻이라 재판정 라인이 그 학년의 키로 고친다. 묶음표는 값을 고치지 않고 내용이 맞는 소단원에 묶어 보여 줄 뿐이다.
- **구역(`section`):** 한 단원의 소단원을 머리말로 나누고 싶을 때 단원에 `sections`(이름 목록)를 두고 소단원 묶음에 `section`을 단다. 지금은 공통수학1 "여러 가지 방정식과 부등식"만 "여러 가지 방정식"/"여러 가지 부등식"으로 나눈다. 단원 일반·기타·이동·제외 묶음에는 `section`이 없다.
- **검사:** `tests/meta-os-subunit-groups.test.mjs`(한 키는 통합 단원당 한 묶음, 표의 키가 정본에 있음, 라벨 한글·비어 있지 않음, 종류별 규칙, `--check` 일치). 운영 데이터의 정확한 개수는 고정하지 않는다.

## CURRENT — REVIEW2 등록 완화 (2026-11-13, 사용자 결정)

두 번 독립 판정(REVIEW2) 경로에만 적용한다. 다른 승인 유형(FINAL_QA, META_PIPELINE_AUDIT)과 나머지 검사는 그대로다.

- **원본이 갖지 않은 칸:** 시험지 JS가 `standardCourse`/`standardUnitKey`/`subUnitKey`/`level`을 아예 갖지 않으면 REVIEW2 등록과 검색 투영 검증이 이를 불일치로 보지 않는다. 값이 있는데 다르면 이전처럼 거부한다. `level`은 원본에 없으면 만들어 넣지 않는다(있는데 하·중·상이 아니면 거부).
- **검수 상태:** 시험지의 `reviewStatus`와 등록 후 `reviewed_pass`의 차이는 REVIEW2에서 소비자 충돌로 거부하지 않는다(`verifyConsumerValues`의 `blockingConflicts`와 `verify-changed-uid-consumer-approval.mjs`의 METADATA_CONFLICT 판정에서 `reviewStatus`만 제외). 시험지 파일은 고치지 않는다.
- **유형 경로를 정할 수 없는 문항(`typeHold`):** 항목에 `typeHold: true`를 두면 단원·소단원과 판정된 CrossConcept·Condition·Integration만 등록한다. PT/TPL이 둘 다 미등록인 문항에만 쓸 수 있고, `after`에 PT/TPL/L3/L4/rpmL3/rpmL4를 넣으면 거부한다. 결과 행은 `metadataStatus: approved_partial_with_explicit_holds`, `fieldStatus.problemType/template: manual_review_pending`, `metaFoundationHoldReason: TYPE_PATH_UNBOUND_UNIT_SUB_ONLY`이며 런타임 행을 만들지 않는다. 크로스워크·봉인 문서·4칸 사전은 건드리지 않는다.
- 도구: `_luna/classify-final/register/`의 `select-ready.cjs` → `build-meta-request.mjs` → `verify-batch.mjs` → `install-batch.sh`.
