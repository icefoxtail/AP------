# 모든 작업 공통 규칙 (원문)

> 2026-10-30 루트 `AGENTS.md`에서 옮긴 원문이다. 문구는 그대로 두고, 링크 경로만 이 폴더 기준으로 고쳤다. 본문 속 백틱 경로는 저장소 루트 기준이다.
> 이 영역 작업을 시작할 때 읽는다. 공통 규칙과 작업별 안내는 루트 [AGENTS.md](../../AGENTS.md)에 있다. 새 지시는 루트 `AGENTS.md`가 아니라 이 문서에 추가한다.

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
