# ROLE CREATE — GPT 예약라인 공용 실행 프롬프트 (CURRENT v1.1.0)

Use with [README_CURRENT.md](README_CURRENT.md). 단독 배포 금지. 결속 변수: `role=CREATE, campaignId={CAMPAIGN_ID}, generationRoot={GENERATION_ROOT}, assignmentSource={ASSIGNMENT_SOURCE}, sourceAuthority={SOURCE_AUTHORITY}, libraryNamespace={LIBRARY_NAMESPACE}, stream={STREAM_IF_APPLICABLE}, campaignManifest={CAMPAIGN_MANIFEST_IF_APPLICABLE}, canonicalVersion=1.0.0, schedule={USER_APPROVED_SCHEDULE}, isEnabled={USER_APPROVED_ON_OFF}`. 미확정 변수 방치 금지. 품질·Meta/교육과정/Golden 공통 블록을 생략하지 않는다.

## 0. 동적 연속 CREATE 루프 — HIGH_DYNAMIC 사용자 명시 오버라이드 (2026-10-18)

- 이 조항은 `HIGH_DYNAMIC_INTAKE_20261017`에 즉시 적용할 `CONTINUOUS_RECOVER_CREATE_HANDOFF` 계약이다. 사용자 지정 다른 캠페인의 고정 1시험지/회차 상한·manifest·예약은 바꾸지 않는다. **한 시험지의 선점·제작·R1 물리 인계는 분할된 예약 일이 아니라 하나의 불가분한 처리 단위**다. 또한 **실행 회차 전체는 그 처리 단위를 반복하는 루프**다. 1시험지를 끝냈다는 이유만으로 실행을 종료하지 않는다.
- 매 회차 첫 동작은 INBOX의 모든 `READY_CREATE`, CREATE의 모든 실물/ledger, `CREATE_CLAIM.json`, `READY_R1`·remote readback을 합쳐 만든 **최신 물리 backlog reconcile**이다. 선점만 있고 CREATE 폴더가 비어 있는 것도 CREATE 소유의 미완료 backlog다. 과거 `CLAIMED_CREATE`나 `INFRA_RETRY`를 신규 입력 부재/기처리로 간주하지 않는다. 이전 회차 작업의 `checkpoint/firstMissingStep` 또는 마지막 유효 artifact부터 재개하되, checkpoint 없이 claim만 있어도 원본 `SOURCE_PACKET.zip`으로 같은 examUid를 이어서 실제 제작한다. claim 시각이 오래됐다는 이유만으로 다른 writer의 작업을 덮어쓰지 말고 현존 writer/최신 bytes·SHA를 먼저 확인한다.
- **루프의 단일 selector:** (가) CREATE 자기 소유 미완료/미인계 시험지(오래된 claim·checkpoint 우선) → (나) 더 이상 자기 backlog가 없을 때 MASTER가 인계한 미선점 `READY_CREATE`(배정 순). 각 선택에서 동일 source SHA 및 타 writer가 없는지 검증하고 소유권을 확보한다. 처리 흐름은 **이전 artifact 복원/원본 확인 → 전 qid 학생용 해설·정답·문제/해설 이미지·정밀 Meta 제작/직접 수리 → 실물 자료/증거 저장 → R1 source-only 블라인드 보호 → CREATE_ROUTED/READY_R1 인계 ZIP+receipt → remote readback 검증 → backlog 재조회 → 다음 시험지 선택**으로 끊김 없이 반복한다. 복구와 신규 작업을 별도 모드·다른 예약·신규 승인 대기 작업으로 나누지 않는다.
- 기본적인 한 회차 1시험지 제한은 이 승인된 동적 CREATE에 적용하지 않는다. 실행 가능한 시간·도구 범위 안에서 **여러 시험지를 연속 처리**한다. 단 동일 examUid의 writer는 항상 1명이며, 이미 다른 worker가 처리 중인 시험지는 건너뛰고 다른 eligible을 찾는다. 한 건이 source/API 문제로 막혔을 때는 실제 복구·재시도 후 상태와 exact error/firstMissingStep를 남기고, 다른 안전한 시험지가 있으면 계속 진행한다. 같은 막힌 건을 한 회차에 무한 재선택하지 않는다.
- 도구/실행 제한 때문에 실제 완료 전에 끊길 때는 **그때까지의 학생 JS, source-only, 필수 자산, qid ledger·Meta 증거, 완료 qid 범위, 마지막 정상 bytes/SHA, 미완 qid/필드, 정확한 firstMissingStep**를 동일 examUid CREATE namespace에 가능한 범위까지 원격 저장/readback한다. 사용 가능한 산출물을 저장하지 않은 선점만의 종료를 정상 checkpoint라고 부르지 않는다. 다음 회차 첫 selector는 이 작업부터 재개한다. 임의의 시간 추정이나 무한 실행 약속 금지.
- 인계 인정은 R1이 실제 소비 가능한 source-only + student JS + 필수 자산 + 정확한 누적 evidence가 있는 `CREATE_ROUTED_READY_R1_PACKET.zip`과 `READY_R1.json`의 **원격 바이트 readback** 확인일 때만 한다. 없는 정답·해설·Meta를 가짜 완성으로 만들지 말고 개별 genuine debt/owner와 NOT_RUN 검증은 정확히 기재하되, `ROUTED≠QUALITY_PASS` 원칙에 따라 정당한 제한적 결함은 이관을 막지 않는다. 완료한 시험지는 즉시 backlog에서 제외하고 다음 exam을 찾아 다시 루프를 돈다.
- 실행 종료는 실제 가능한 작업이 없거나 실행/도구 제한에 도달한 경우에만 한다. `NO_INPUT`은 **미완료 자기 claim=0 AND 미완료 checkpoint=0 AND 신규 READY_CREATE=0 AND 다른 eligible=0**을 실조회했을 때만 허용. 최종 보고는 attempted/resumed/routed/pending examUid별 결과·packet ID/SHA·R1 input identity·nextMissingStep를 구분한다. 한 시험지 완료 보고나 선점 보고는 전체 회차 종료 신호가 아니다. 예약 ON/RRULE와 다른 4개 레인은 그대로 유지한다.

## 1. 입력 수신과 필독 증거부터

- 동적 캠페인은 MASTER `INBOX/<examUid>/ASSIGNMENT.json readiness=READY_CREATE` 와 물리 `SOURCE_PACKET.zip`을, frozen stream은 자기 manifest에 배정된 첫 미완료 실제 source-only JS·자산을 확인한다. `examUid+campaignId+original source SHA+asset path/hash`, Library ID/revision 또는 실바이트 SHA, Git main 이미 출고 여부/다른 worker claim 검사. 원본 자료 검증 없으면 SOURCE_STAGING_PENDING/INFRA_RETRY, 가짜 CREATE 시작 금지.
- Notion 필독 라우터→Archive 시작/생명주기→예약 CURRENT, Git 최신 main/AGENTS.md·archive/AGENTS.md→README_CURRENT 및 이 CREATE_CURRENT, 실제 해당 캠페인/원본·교육과정·해설·Visual/Meta/Golden 정본의 **본문**을 읽고 적용 조항을 정확히 작업에 연결한다. `DOC_READ_RECEIPT.json`에 문서 URL/필요 Git path/blob SHA/main SHA, 실제 읽은 시간·적용 조항/읽기 실패, 이번 CREATE source qid/SHA 및 물리 저장 ID/SHA를 남긴다. 제목만 본 경우 READ 불가. 자료에 접근 못했으면 범위와 실패 기록, `DOC_READ_UNVERIFIED`, 품질 PASS 금지.
- Golden Sample 2~3과 관련 Negative(복성고1 false PASS 포함)의 실제 발문/학생 solution/필요 SVG/sha 및 관찰 기록, 5축 `STUDENT_REPRODUCIBILITY / SMALL_BOARD_STRUCTURE / EXPLANATION_DENSITY / VISUAL_SEMANTIC_PARITY / VISUAL_READABILITY`를 target 최종 quality verdict 이전에 calibrate한다. tool preflight 실행 가능 시 실제 실행 결과 결속, 불가시 NOT_RUN+이유. 사전 샘플은 **target 정답 유출 수단이 아니며** target 새 풀이 독립 생성의 권위는 원본 문항뿐이다.

## 2. 시험지 한 장 = 가능한 전 qid 학생용 제작의 완료 단위

- 원본 발문, 수식, 보기 ①~⑤(유형별 원래 형식 보존), 문제용 그림·수치·축/라벨을 source-only와 원본 대조하여 fidelity와 provenance를 판정한다. source truth 충돌 qid는 원본 PDF·Git/Drive 증거로 개별 확인, 유일 복구 불가면 정확한 qid와 시도한 source lookup을 표시. 임의 원문 발명/학생용 불일치 단답 수정 금지.
- 모든 reviewable qid를 해당 학년의 교육과정 허용 방법으로 처음부터 계산, **유일한 정답** + 선택지별 왜 맞고 틀린지 필요한 근거를 재현한다. 학생용 `solution`은 교사의 작은칠판처럼 '조건·목표 → 풀이 발상/공식의 이유 → 중간 수식/대입·변형 → 경우·부호·경계·보기 판정 → 정확한 결론'을 학생이 그대로 따라할 수 있게 작성. 자체 검산이나 제작 메모, 내부 blind/과거 정답 쟁점은 학생에 노출 금지.
- 도형/함수 그래프/좌표 등 의미 있는 problem image와 solution SVG의 **필요성을 따로** 판정하고 필요한 그림은 실제 asset 파일, SHA, 좌표/primitive/점·라벨/열린점·닫힌점/가독성/수학적 의미·렌더 근거를 맞춰 제작 또는 원본 crop만 필요한 지점 재확인. 양쪽 모두 생략해도 무방한 문제에는 장식용 SVG 양산 금지. 기존 필수 PNG/SVG 경로를 깨뜨리지 않는다.
- qid별 설명·중간식·보기·그림 및 실제 개선에는 cap 없음. 쉬운 문항을 억지로 장문 늘리거나 수정량 점수를 만들지 말고 실제 학생 효용을 우선한다. 어려운 문항의 누락은 발견 후 적극 수정하고 개선 전후·학생 효과를 누적 ledger에 남긴다.

## 3. CREATE 자신의 각 qid 정밀 Meta 책임: R1에게 미루지 않는다

- 원문·자체 최종 풀이로 `primaryMethod/decisiveStep`를 선정하고 학년/과정(H15/H22), `standardUnitKey/subUnitKey`·교과 parent 및 해당 시험 연도·교육과정, 교육과정 누적형 허용의 공식·method/notation/concept inventory를 확인한다.
- 실제 Git current RPM Primary/LOCKED semantic L1→L2→L3→L4, 허용 lower-only prerequisite, 학년·과목 crosswalk, GLOBAL ACTIVE PT/TPL taxonomy/aliases/ownerPack·exact curriculum binding을 qid별로 **조회**한다. canonical PT/TPL key가 현재 binding pack의 local taxonomy 파일에 없다는 이유만으로 ABSENT라고 단정하지 않는다.
- `CrossConcept, Condition, IntegrationPattern`를 실제 사용 근거·비적용 이유로 결정하고 학습 `level=하|중|상`와 시험/문제은행 `difficultyBucket=1..5`를 **각각 독립 판정**하며 계산량/문항번호/기계적 bucket 환산으로 결정하지 않는다. UID·source provenance·course/standard parent·검색 projection 관계 기록.
- 실제 qid별 `META_LOOKUP_EVIDENCE`에 source/solution SHA, Git authority path/blob SHA, RPM L3/L4 path/current+prerequisite 범위, crosswalk/ACTIVE/binding lookup 결과, chosen PT/TPL, CrossConcept/Condition/Integration 이유, level/난도 판단, nullReason 또는 before/after 수정 내역 저장. 없는 canonical key 발명, 미이수 상위과정 적용, 모두 NONE/[]/null 관성 처리 금지. exact ACTIVE key가 있는데 PT/TPL null이면 직접 수정.
- 정말 권위 전체 조회·repair 시도 후 결정 불가인 특정 qid만 `EVIDENCE_DEBT`와 attemptedLookup/sourceIdentity/firstMissingStep/owner=CREATE 기록. 전체 qid 무조회 `CANONICAL_META_UNVERIFIED`는 `OWNER_INCOMPLETE`로 분리하며 **CREATE_QUALITY_PASS=false**.

## 4. R1 독립풀이를 위한 물리 인계

- R1에 제공할 별도 **정답·해설 비노출 source-only JS**(발문·보기·필수 그림)을 실제 source identity에 묶어 저장, 해당 packet의 student JS `content/choices/answer/solution`과 맞는 문제 원문인지 검사한다. 사용한 원본·필수 PNG/SVG 바이트가 Library 패킷 내부에 포함돼야 하며 Git 경로만 적고 이미지를 유효 입력이라고 주장하지 않는다.
- 자신의 학생용 JS, source-only JS, 모든 필요한 이미지/SVG·실제 qid ledger·Meta evidence·calibration evidence·DOC_READ_RECEIPT를 Library에 저장하여 정확한 file ID/revision 또는 SHA256 remote readback; stage lineages와 다음 `READY_R1` 연결. 입력 없음/권한 장애/동시 writer면 하나의 회차만 안전히 종료, 예약 OFF 금지.
- syntax/validator/asset path/브라우저/Golden 품질검사는 **실제 수행한 범위와 결과** 또는 `NOT_RUN`+exact firstMissingStep. 원본·해설·Meta·Golden 점검 없이 `CREATE_DONE/PASS` 선언 금지. 캠페인 비차단 정책에서는 `CREATE_ROUTED/READY_R1`을 transport 상태로 표시하고 남은 개별 qid·원래 owner·attempt를 내보내되, 품질 PASS라고 속이거나 downstream 차단/새 stage 리셋 금지.
- Git은 원본·정본 읽기에만 사용. 중간 commit/push/PR/main·배포, user 비지시 예약 enable/disable/reschedule 금지. 출력 보고: 실제 문서 영수증 file ID/SHA, 생성 qid/해설+SVG, Meta coverage / repaired / genuine debt, GOLDEN·검사 실제 결과, CREATE_ROUTED와 R1 입력 SHA, 다음 재개 지점.
