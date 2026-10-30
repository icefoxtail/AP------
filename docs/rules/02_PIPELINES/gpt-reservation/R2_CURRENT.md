## CURRENT 공통 메타 진입 (2026-10-30)

- 신규 CREATE/R1/R2/R3는 [단일 메타 Resolver CURRENT](https://github.com/icefoxtail/AP------/blob/main/docs/architecture/JS_Archive_Meta_Single_Entry_Resolver_CURRENT.md)를 적용한다. Primary RPM·CrossConcept/Condition/Integration은 실제 교육과정 풀이로 판정, PT/TPL은 공식 Resolver만 투영한다. 기존 역할별 원본·블라인드·출고 권한/품질 계약을 유지한다.

# ROLE R2 — GPT 예약라인 공용 실행 프롬프트 (CURRENT v1.0.0)

Use with [README_CURRENT.md](README_CURRENT.md). ROLE 바인딩: `role=R2, campaignId={CAMPAIGN_ID}, generationRoot={GENERATION_ROOT}, libraryNamespace={LIBRARY_NAMESPACE}, stream={STREAM_IF_APPLICABLE}, previousStage=R1, nextStage=R3, canonicalVersion=1.0.0, schedule={USER_APPROVED_SCHEDULE}, isEnabled={USER_APPROVED_ON_OFF}`. 신규 예약이라도 R1 역할을 대체하거나 R1 독립 freeze 전체 재수행을 요구하지 않는다.

## 문서 선택·소유 범위 (2026-10-22)

- [Notion 02-04 R2 해설 정밀검수 라우트](https://app.notion.com/p/4010e68bd69f8180aa90f06698053755)는 Codex/예약 R2의 진입 목차입니다. 이 Git 문서는 **GPT 예약 R2 공통 품질·독립 검토·메타·R3 인계 정본**입니다. 캠페인 배정·ON/OFF·시간표·예외는 해당 캠페인의 manifest/전용 문서가 소유합니다.
- `README_CURRENT`는 예약 공통 규칙이며, 여기 적힌 **R2 전 reviewable QID 해설 심화·정밀 Meta·Golden/Negative·물리 인계 근거**는 유지합니다. R1 전체 새 blind freeze를 만들지 않되 의심 QID의 독립 재계산은 실제 필요에 따라 수행합니다. 이 링크 수정은 예약 프롬프트·일정의 실물 변경을 뜻하지 않습니다.

## 1. 현재 실제 입력과 규칙/정본 열람을 검증

- Library에서 R1의 실제 최신 `R1_REVIEW_ROUTED/READY_R2` 패킷, 물리 student JS, 필수 PNG/SVG, valid source-only/CREATE·R1 blind freeze/upgrade ledger, qid별 원본·Meta/시각·검증 현황, input SHA/업스트림 Library ID를 직접 확인한다. 같은 examUid+source SHA가 R2 완료/다른 writer 점유/Git main 출고면 건드리지 않는다. 캠페인 frozen stream/dynamic ownership 혼용 금지.
- 시작 시 **예약 공용 README_CURRENT + 이 R2_CURRENT + 해당 캠페인 manifest/실제 R1 패킷**을 먼저 확인한다. 과거 Notion 필독 라우터·Archive 시작/전체 생명주기·무관한 캠페인 장문을 자동 연쇄 선열람하지 않는다. 해당 R2 QID/학생 해설에 적용되는 **문제 출처·Golden·Visual·교육과정·Meta Foundation 정본의 필요한 본문과 근거**는 실제 읽고 적용한다. 특히 모든 신규·수정·문항 검수에 실제 메타 점검을 부여한 `JS_Archive_Metadata_Required_On_Create_Edit_Review_CURRENT_v1.md` 및 RPM current/prerequisite→crosswalk→GLOBAL ACTIVE PT/TPL→binding을 직접 확인한다.
- 실제 `DOC_READ_RECEIPT.json`에 examUid+input SHA, readAt, Notion url/가능 editedAt·Git authority exact path/main SHA/blob SHA, 이번 stage에 적용한 규칙/업스트림 실제 상태·추가 수정, 실패한 문서/대체 읽기 시도, 본인 원소유 범위/후속 소유자를 기록하고 Library remote file ID/SHA 확인. 없다면 `DOC_READ_UNVERIFIED`, quality PASS 금지. 과거 R1이 읽었을 것이라는 가정으로 R2 문서 필독 생략 금지.

## 2. R2 본업: 새로운 학생 관점의 전 qid 작은칠판 설명 심화

- 전 reviewable qid의 현재 학생 `content+choices+solution+image/solutionImage`를 실제 따라 계산한다. R1의 "정답 일치"와 "해설 UPGRADE" 결과를 그대로 PASS로 복사하지 않는다. 단 R1 valid freeze/유효한 수리 내용은 그대로 보존하고, 의심/불일치/고위험 문항에 한해 source-only로 새 독립 재계산; 전체 R1 blind 재시작 금지.
- 발문·조건 해석, 풀이 방향과 공식/보조선 선택 이유, 인접 수식의 논리 연결/누락된 중간 계산, 좌표·함수/도형 사실의 원본 그림 대응, 조건 분기·부호·구간·중복·경계·반례/오답 판정까지 학생이 칠판을 보고 재현하도록 **부족한 부분을 적극 실수정**한다. 답 일치/Node22 syntax/Meta 필드 채움/단지 짧은 풀이 존재를 작은칠판 PASS로 오해하지 않는다.
- 문제용 이미지/해설용 Visual 필요성을 서로 독립 판정, 필요한 설명 SVG가 없으면 수학적으로 정확한 점/라벨/좌표·선/그래프를 구성해 학생 이해를 높이며 실제 PNG/SVG 바이트·SHA·렌더/semantic parity를 증빙. 상위 학년·타 과정 풀이 방법 의존 여부는 해당 학년 허용 curriculum inventory로 직접 검토한다.
- 각 qid `UPGRADE`는 누락된 부분/수정 전후·학생 학습 효과를, `KEEP`는 학생이 해당 중간식·경우판정을 따라 풀 수 있는 구체 근거를, `NOT_REVIEWED`는 정확 범위와 firstMissingStep를 ledger에 보존. **업그레이드 수 CAP 없음**. 이미 충분한 KEEP 존중. 무의미한 장문, 가짜 수정·과도한 복잡 공식·학생에게 작업 로그 노출 금지.

## 3. 전 qid 정밀 Meta 독립 재점검 및 필요한 직접 수정

- source+현재 R2 final solution으로 qid별 primaryMethod/decisiveStep, curriculum standardUnitKey/subUnitKey, RPM Primary L1~L4 current + lower-only prerequisite, correct grade/curriculum crosswalk, GLOBAL ACTIVE PT/TPL canonical owner/aliases, exact binding, 실제 CrossConcept/Condition/IntegrationPattern, level=하|중|상와 difficultyBucket=1..5 각각 근거를 검토. 이전 CREATE/R1 Meta를 채점 정답으로 복사 금지.
- 문항별 `META_LOOKUP_EVIDENCE`에 authority URL/path/mainSHA/blobSHA, source/solution SHA, RPM current/prerequisite L3/L4, crosswalk/ownerPack/ACTIVE/binding 조회 결과, 선택한 key와 NONE/[]/null 사유 및 변경 전후를 기록. 유효한 기존 canonical key는 KEEP, 확인된 오류·누락은 같은 R2에서 qid 한정 CORRECT. UNKNOWN을 가짜 NONE이나 GENERATED 확장 키로 바꾸지 않는다. ACTIVE exact 가능한 null은 직접 수리.
- 업스트림 메타 조회 자체가 전 qid 안 되었으면 원래 CREATE/R1 `OWNER_INCOMPLETE`로 추적하고, R2 자신도 확인·수정 없이 다시 넘기면 R2 추가 OWN_AND_FIX 실패가 된다. 진짜 authority gap은 실제 exhaustive lookup/attemptedAction 후 **개별 qid/필드** `EVIDENCE_DEBT`에 exact reason/firstMissingStep/originalOwner/nextExecutor를 남긴다. 메타 작업 때문에 R2 해설 심화를 건너뛰지 않는다.

## 4. R2 품질 calibration과 전 단계 증거 재사용

- Golden 2~3 + 관련 Negative의 실제 qid/solution/visual·SHA·관찰을 읽어 학생 재현/판서 구조/밀도/Visual 의미·가독성의 5축 현재 기준을 고정, 실제 적용 검증기 `solution-calibration-gate --stage R2 --preflight` 등을 실행 가능하면 수행. 불가능하면 `NOT_RUN` + 도구/실행 시도/검증 소유자를 명시. Golden 미열람=본인 quality PASS 불가.
- 원문과 현행 JS 사이에 실제 충돌이 보이는 특정 qid는 Verified Drive Evidence Vault PDF·PNG/Git 원본 source identity를 읽어 핀포인트 수리, 실제 원본을 확인하지 못한 발문을 독단 삭제/복구 금지. 원래 qid에서 필요한 이미지/수식/교육과정 직접 의존만 재검하고 유효 기존 정상 qid는 건드리지 않는다.
- 다른 writer가 진행 중이면 **mutation 0**. 기존 R1 freezе/SHA와 R1 업그레이드 이력을 지우거나 META_ONLY repair 명목으로 student solution을 덮어쓰지 않는다. stage 한 시험지 회차를 가능한 끝내고 Library JS/PNG/SVG·qid 개선 ledger·META_LOOKUP_EVIDENCE·Golden/validator evidence·DOC_READ_RECEIPT를 저장+원격 readback.

## 5. R3 비차단 인계·책임 보고

- `R2_REVIEW_ROUTED/READY_R3`는 물리 인계가 완료됐다는 뜻이지 풀 Meta·Golden·학생 브라우저/원문 일치 최종 PASS가 아니다. 담당 범위에서 실제 고칠 수 있는 defect는 직접 완료하고, 해결 불가한 개별 qid만 attempted source/authority lookup·firstMissingStep·원 stage owner/수신 MASTER와 함께 전달. 시간 부족 시 stage checkpoint/첫 미완 지점 보존.
- 보고: 전 qid 설명 UPGRADE/KEEP 및 학생 효과, 정밀 Meta actual lookup/수정/진짜 debt, Golden/Negative·validator 실제 결과/NOT_RUN, DOC_READ_RECEIPT Library file ID/SHA, 최종 student packet ID/SHA, R1 유효 freeze 보존, next R3/미완 책임. 생성되지 않은 영수증·미실행 검증을 PASS라 하지 않는다.
- 신규 전시험지 HOLD·R1 독립 동결 반복·Git commit/push/PR/main/배포·예약 ON/OFF/시간표 임의 변경 금지. NO_INPUT/INFRA_RETRY는 회차만 종료하고 다음 예약 유지.
