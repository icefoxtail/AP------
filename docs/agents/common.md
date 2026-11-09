# 모든 작업 공통 규칙 (원문)

> 2026-10-30 루트 `AGENTS.md`에서 옮긴 원문이다. 문구는 그대로 두고, 링크 경로만 이 폴더 기준으로 고쳤다. 본문 속 백틱 경로는 저장소 루트 기준이다.
> 이 영역 작업을 시작할 때 읽는다. 공통 규칙과 작업별 안내는 루트 [AGENTS.md](../../AGENTS.md)에 있다. 새 지시는 루트 `AGENTS.md`가 아니라 이 문서에 추가한다.

## CURRENT HARD — 공유 데이터 고정값: 원본 시험지·공유 크로스워크·생성문항 Meta (2026-11-03, 사용자 지시)

Claude·GPT·Codex 모든 라인 공통이다. 상세 원문은 [metadata.md](metadata.md) "공유 크로스워크" CURRENT 절에 있다.
이유: 2026-11-02~03에 서로 다른 세션의 정상 작업 때문에 main CI와 학생 사이트 배포가 두 번 막혔다. 원본 시험지 해설만 고쳤는데 테스트의 파일 해시 고정값이 깨졌고(#1263), 크로스워크에 행을 추가했더니 승인 생성문항 약 171건의 Meta 해시가 어긋났다(#1264). 지금은 봉인 레지스트리와 행 검사로 고쳐져 있다(#1264·#1266).

1. 공유 크로스워크(`archive/data/meta-foundation/crosswalks`)는 행을 추가만 한다. 기존 행의 수정·삭제·순서 변경은 하지 않는다. 고쳐야 하면 먼저 사용자에게 보고한다. 승인 생성문항은 자기가 쓰는 행이 그대로인지로 검증되기 때문이다.
2. 생성문항 Meta의 등록·승인은 공식 도구로만 한다(register-approved-generated-meta, auto-register-approved-qid9, backfill-generated-meta, build-generated-meta-browse-aliases). 이 도구들은 그때 읽은 크로스워크 해시를 `archive/data/meta-foundation/crosswalks/sealed-digests.v1.json`에 자동 봉인한다. Meta나 해시 필드(rpmDraftAuthoritySha256, rpmAuthoritySha256)를 손으로 고치지 않는다.
3. 봉인 레지스트리는 손으로 넓히지 않는다. 실제 파일 버전과 맞지 않는 해시는 넣지 않는다. 병합 때 완전히 같은 항목이 겹치는 것은 정상이다(도구가 합친다). 같은 (path, sha256)에 gitBlobSha1이 다르다는 CONFLICTING_GIT_BLOB_SHA1이 나오면 손대지 않고 보고한다.
4. CROSSWALK_DIGEST_NOT_SEALED가 나오면 검사를 끄거나 우회하지 않는다. 해당 공식 도구를 `--write`로 다시 돌려 봉인을 만들고 `--check`로 확인한다. EXISTING_APPROVED_UID_REQUIRES_PINPOINT_REPAIR가 나오면 원인을 조사해 보고한다. 승인 영수증(alive/)과 metaFinalSha256은 고치지 않는다.
5. 원본 시험지 JS(`archive/exams/original`)를 고칠 때는 바뀐 필드(content·answer·choices·solution)를 확인하고, 그 시험지를 고정한 생성문항·테스트 해시가 있는지 grep으로 찾는다(예: `tests/archive2-generated-bank-registration.test.js`). solution만 바뀌었으면 같은 PR에서 고정 해시를 갱신하고 "해설만 수정, 문제·정답·보기 변경 없음" 주석을 단다. content·answer·choices가 바뀌었으면 고정값을 바꾸지 말고 멈춰서 보고한다. 그 문항에서 나온 생성문항을 다시 검토해야 하기 때문이다.
   골든 표본 시험지(`25_효천고_2학기_중간_고1_기출.js`, `25_매산여고_2학기_중간_고1_기출.js`)의 해설 그림(solutionImage*, imageSize*)만 바꿨다면 m2 CREATE gate 테스트 10개가 GOLDEN_SAMPLE_SHA256_MISMATCH로 깨지므로, 같은 PR에서 `node archive/tools/rebind-m2-create-golden-sample-evidence.mjs --source <시험지 경로>`(dry-run) → 같은 명령에 `--write` → `tests/m2-*create-gate*.test.js` 순서로 고정값을 다시 묶는다. 이유: 그림 필드 외(content·answer·choices·solution·문항 수)가 바뀌었으면 도구가 REFUSE하므로 검사를 약하게 하지 않고 안전하게 재고정할 수 있다.
6. 병합 전에 바꾼 부분의 관련 테스트를 직접 돌리고, PR CI가 전부 녹색인지 확인한다. 특히 "Approved source, scoped Meta, and Consumer validation", "test", "Archive2 runtime contract"를 본다. 빨간 CI로는 병합하지 않는다. 내 변경과 무관한 기존 실패라면 main에서도 실패한다는 근거를 PR에 적고 사용자에게 보고한다. PR 기술검사는 고정 event base와 실제 검증 snapshot에 결속한다. 이후 main 이동은 병합 충돌·보호 규칙과 별도로 확인하며, 바뀐 입력·직접 의존성·검사기에 해당하는 검사만 재실행한다. 무관한 main 이동만으로 전체 Archive 검사를 반복하지 않는다(이력 재작성·강제 push 금지).
7. 보고에는 한 일, 확인 근거(실행한 명령과 결과), 남은 일, 사용자 결정이 필요한 것을 쓴다. 돌리지 않은 검사는 NOT_RUN으로 적는다.

## CURRENT TOP — 작업별 진입 / 과거 Notion 필독 해제 (2026-10-22)

- **범용으로 'GPT 작업 전 필독 라우터' 900줄과 Archive 생명주기를 매 작업 선열람하는 의무를 폐지한다.** 사용자 지정 범위·역할·현행 exact Git/Notion CURRENT **한 곳과 실물**에서 바로 시작한다. [Notion 공통 행동 규칙](https://app.notion.com/p/3e10e68bd69f81f19397e7cd1c8d3cfd)은 실제 공통 원칙·충돌이 있을 때만 확인하며, [캠페인별 상세 문서](https://app.notion.com/p/4010e68bd69f81b7a445c7c48abe1c05)는 **자기 캠페인 담당자만** 연다.
- 캠페인 스케줄·NEW14/HIGH_DYNAMIC·ALIVE·M3 등 개별 품질·인계·예외·현황의 수정은 **각 캠페인/역할 문서에서만** 수행한다. 범용 필독 라우터에는 프로젝트별 작업 이력·PR·ON/OFF·시간표를 추가하지 않는다. 신규 CREATE/R1/R2/R3의 최초 수학·블라인드·검수 증거 품질은 유지한다.
- GPT **사후 FINAL QA**는 [단일 실행 카드 v2.0](../../docs/operations/JS_Archive_FINAL_QA_EXECUTION_CARD_CURRENT.md)부터 읽고 열린 결함만 최소 수리 → 필요 시 시험지별 소형 등록 요청 → main 병합/대상 blob readback으로 종료. 후속 자동 DB/index/검색·Pages는 Git Actions 책임. Actions PASS를 근거 없이 선언하지 않고, 후속 CI poll은 GPT 종료조건에서 제외한다.

## CURRENT HARD — 최신 요청의 작업 범위·종료 조건 우선 (2026-10-10)

- 먼저 최신 사용자 지시의 대상·작업 종류·종료 조건을 따른다. 아래 전수 생산·검수 규정은 명시적으로 맡긴 전체 작업에 적용하며, 기존 문항의 한정 수정 지시를 확대하는 근거가 아니다.
- **한정 수정:** 지정 qid/파일/필드와 수정에 꼭 필요한 직접 의존 부분만 고친다. 변경 영향에 필요한 검증을 1회 수행하고 정한 종료 조건에서 끝낸다. 실제 실패·추가 수정이 있을 때만 영향 부분을 재검한다. CREATE→R1→R2→R3 자동 재진입, unchanged 시험지 전체 재풀이·전수 재검은 금지한다.
- **전체 제작·전수 검수:** 사용자가 전체 작업을 명시하면 기존 전체 품질 절차와 분모를 유지한다. 전수 검수 중 든 ‘예시 qid’와 ‘이 qid만 수정’이라는 명시적 한정을 구별한다.
- 범위 밖 발견사항은 간단히 보고만 하고 임의 수정·전수 조사하지 않는다. 범위 확장은 사용자 승인을 받는다. OWN_AND_FIX도 승인된 범위 안의 책임이다.
- 출시·등록·main 반영까지 요청받았다면(적용 가능한 기존 사용자 지시 포함) 해당 범위의 publication·remote readback·필요한 학생 화면 기술 QA까지 책임진다. 이 책임이 변경하지 않은 전체 시험지 재검의 허가는 아니다. 패치·커밋·draft PR 등 명시된 종료 조건을 main 병합으로 바꾸지 않는다.
- 시작할 때 실제 읽은 관련 정본 경로/버전과 대상·필요 검증·종료 조건만 짧게 밝힌다. 별도 대형 원장·반복 read receipt·새 승인 절차를 만들지 않는다.

## CURRENT HARD — 수정 AI OWN_AND_FIX / 메타 확장 / main 후 학생 화면 기술 마감 (2026-10-09 형님 직접 지시)
- 모든 JS Archive·ALIVE·문제은행 수정/검수/메타/출시 실행자는 [수정 AI 책임·Meta 확장·출시 마감 CURRENT](../../docs/architecture/Archive_Correction_Owner_EndToEnd_Closeout_CURRENT_v1.md)를 필독한다. **OWN_AND_FIX는 승인된 대상·종료 조건 안에서** 발견한 결함을 직접 수정하거나 실제 기술 실행자를 연결해 해결 결과를 수납하고, 해결 가능한 `NOT_TESTED`는 필요한 시도·연결을 이어 간다는 뜻이다. 범위 밖 결함은 보고하고 확장 승인을 받으며, 정확한 도구·권한 blocker나 명시된 한정 작업의 종료를 무한 재검으로 대신하지 않는다.
- 기존 canonical key를 먼저 검색하되 필요한 CrossConcept·Condition·Generated L4 키가 없으면 사용자 추가 승인 대기 없이 **Generated-only 확장 registry**에 의미·parent·evidence·UID를 등록한 뒤 Source/metadata/Consumer/index에 영구반영한다. RPM LOCKED·원본 기출 및 무관한 UID 보호, 무근거 추정 금지.
- 원장 직접 Generated 품질 지시의 별도 인증은 생략. **main 병합 이후 필요한 실제 Chrome 학생 조회/출력 등 기술 검사는 수정 AI가 끝까지 진행**한다. main write만으로 MAIN_DONE이 아니며, 실패하면 본 작업의 수리 대상으로 처리한다. 확인 완료·오류 발견·미실행·판단 불확실을 구분하고, 필수 확인이 남으면 초안/미완료로 보고한다. 산출량과 검사 종류별 실제 분모·범위를 분리하며 파일 존재·Meta 정적 PASS·배포 PASS를 문항 내용 품질 PASS로 확대하지 않는다. 실행 경로가 있으면 해결을 계속 시도하고, 막힌 항목은 실제 미실행/불확실과 정확한 blocker·시도·담당을 ledger에 남긴다. 미실행을 PASS로 기록하거나 재승인 요청/보고만 하고 끝내지 않는다.
