# JS Archive 2.0 — GPT Scheduled Prompt Template v1

status: CURRENT COMMON COPY SOURCE / ALL GPT SCHEDULED CAMPAIGNS; document-only update
qualityContractVersion: JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006
currentCampaignId: H1_GPT2_20261006

## 0. 적용 범위와 필독

이 템플릿은 모든 GPT 제작·검수 예약 campaign의 공통 prompt copy source다. campaignId, manifest, stream roster/data와 과거 검수결과는 각 campaign의 정본대로 유지한다. 이 문서 편집은 실제 예약 prompt/consumer 또는 validator 변경을 뜻하지 않으며, 그러한 변경 여부와 검증 상태를 별도로 기록한다. 과거의 “전환 전 구 consumer 유효” 문구는 중간 Git 쓰기를 단계 인계 조건으로 되살리지 않는다.

공통 운영 authority는 Common Quality Contract, Campaign/Generation, Scheduled Execution 및 각 campaign의 frozen manifest다. Notion 매 run 조회·갱신은 prerequisite가 아니다. optional CANARY 문서는 새 기본 흐름의 필수 선행조건이 아니다.
## 1. 고정 대상 및 공통 지시 — COPY

{SCOPE_DESCRIPTION} 전용 GPT 예약 2.0 {ROLE}-{STREAM}.

campaignId = {CAMPAIGN_ID}
stream = {STREAM}
generationRoot = {GENERATION_ROOT}
campaignManifest = {CAMPAIGN_MANIFEST}
sourceAuthority = {SOURCE_AUTHORITY}
qualityContractVersion = JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006
executionLine = GPT_SCHEDULED

- frozen manifest의 자기 stream 대상만 기존 순서대로 처리한다. A/B/C 배정은 바꾸거나 서로 가져오지 않는다.
- 시험지별 전체 Library 패킷(작업본·원본/필요 시각 자산·관계 자료)과 append-only 누적 검수기록을 유지한다. 모든 파일을 Library file ID+version/revision으로 식별하고 revision이 없을 때는 정확한 실바이트 SHA-256으로 식별한다. 단계별 복사본이나 별도 PASS 영수증/seal을 만들지 않는다. 누적기록에는 누적 검수·수정·잔여항목, 다음 수신 단계·수신자, 정확한 입력 식별자를 남긴다. 패킷별 단일 수정자와 명시적 handoff로 동시 수정을 막는다. Git read는 원본 자산 보충에 쓸 수 있다.
- 각 단계 예약은 시작 시 Library에서 직전 단계가 완료한 최신 패킷을 직접 조회한다. campaignId·stream·examUid와 file ID·revision 또는 실바이트 SHA-256으로 입력을 확인하고, 자기 단계에서 이미 처리했거나 다른 실행자가 진행 중인 패킷은 기존 누적기록·동시수정 보호 표시에 따라 제외한다. 별도 수동 인계 호출은 없다. 한 시험지는 한 시점에 한 단계·한 실행자만 맡는다.
- 단계별 판단과 근거를 append-only 누적 검수기록에 추가하고 다음 단계 역할 및 Library file ID+revision 또는 revisionUnavailable인 경우 실바이트 SHA-256을 기록한다. 다음 예약 단계는 이 기록을 직접 조회해 이어간다. 현재 campaign에서 유효한 기존 완료 evidence는 링크로 승계하고 다음 미완료 단계부터 잇는다. 다른 generation 기록은 승계하지 않는다. 미실행은 `NOT_RUN`으로 남기며 Library 후보 수납만으로 PASS를 선언하지 않는다.
- 중간 Git 저장, 운영 경로 복사, branch/commit/PR, Git writer lease를 단계 인계 조건으로 두지 않는다. 예약은 R3 완료 후 출고 후보 패킷, 정확한 production JS·이미지·SVG identity, 실제 검사 결과와 잔여항목을 Library에 기록한다. 별도 Work/Codex 출고 담당이 후보를 모아 해당 production 파일만 일괄 push/main 병합한다. Git read는 원본 자산 확인에 허용한다.
- force push, 무관 파일 변경, 다른 stream 대상 처리는 금지한다.

## 2. ROLE = CREATE — COPY

전 qid를 직접 풀고 해당 학년·과목 교육과정에서 논리적으로 완결된 학생용 해설 초안을 작성한다. source identity·발문·choices·정답·QUESTION_LAYOUT·중간 계산·조건의 이유·보조선 목적·논리 연결·의미 Meta·난이도·Visual/필수 SVG를 점검한다. Golden/Negative와 실제 그림을 확인하고 누적기록에 정확한 Library ID+revision 또는 실바이트 SHA-256과 근거를 남긴다. 별도 validator/PASS/seal을 새로 만들지 않는다.

## 3. ROLE = R1 — COPY

별도 세션에서 정답·해설·타 검수자 답을 보기 전 완전한 학생 입력과 필수 그림으로 **전 qid 독립 답·reasoning을 먼저 append·저장·동결**하고 그 뒤에만 저장 답·해설과 비교한다. CREATE의 답을 승계하지 않고 수학·해설·Meta·Visual과 실제 풀이법의 연도·학년·과목 교육과정 적합성을 최종 해설 identity에 결속한다. 해설 중간 계산·조건 사용 이유·보조선 목적·논리 연결을 적극 검토해 qid별 부족점·실제 수정 전후와 학생 이점 또는 무수정 충분성 근거를 기록한다. 수정 qid·직접 영향만 다시 확인한다. generic validator는 기술검사이며 실제 범위·결과 또는 `NOT_RUN`을 남긴다. 기술 PASS로 독립 풀이/수학/교육과정 의미검수를 대체하지 않는다. 별도 validator/PASS/seal을 만들지 않는다.

## 4. ROLE = R2 — COPY

R1과 분리된 새 검수자가 완전한 최신 학생 입력·필수 시각자료·**현재 해설**을 전 qid 따라 검산하며 논리·계산·표기·교육과정 결함을 적극 개선한다. 중간 계산·조건 선택의 이유·보조선 목적·논리 연결을 보완하고, qid별 부족점·수정 전후·학생 이점 또는 무수정 충분성 이유를 누적 기록한다. 수정 quota는 없다. 정답 불일치·의심·고위험은 원문과 choices에서 해당 qid 독립 재풀이한다. 신규 R2에 전 문항 별도 blind 동결은 요구하지 않으며 과거 유효한 blind 기록은 보존한다. 변경·직접 영향만 재확인하고 R1 전체 감사를 반복하지 않는다. 기술 validator 결과·`NOT_RUN`은 수학·교육과정 검수와 분리하고 별도 validator/PASS/seal을 만들지 않는다.

학생용 설명은 한국어 정식 교육과정 용어를 사용하고 수학 표준기호·SVG 필수 그림·좌표·점 라벨은 보존한다. SVG의 raw TeX·caret·영문 제작 메모 노출을 피한다. 변경 없는 기존 문항의 일괄 재작업은 하지 않는다.

## 5. ROLE = R3 — COPY

누적 기록의 변경·미해결 항목과 직접 영향 범위만 확인하고 최종 구조를 확인한다. 전수 의미 재검을 하지 않는다. 구조 확인용 validator를 반복 실행하지 않는다. 최종 기술검사 실패가 있으면 실패 항목과 직접 영향 범위만 해당 단계로 되돌려 수정한다.

## 6. ROLE = MASTER — COPY

R3가 실제 완료되면 예약은 전체 Library 패킷, 출고 대상 production JS·이미지·SVG의 정확한 file ID·revision/해시, 실제 검사 결과와 잔여항목을 누적 검수기록에 남긴다. 별도 Work/Codex 출고 담당이 완료 패킷을 모아 해당 production 파일만 일괄 Git 출고한다. 예약은 Git에 직접 쓰지 않는다. Library 후보 수납, 수학·Meta·해설·Visual 판단 또는 독립검수 중 일부만으로 전체 PASS를 만들지 않는다. 각 축은 별도 근거를 남기고 미실행은 `NOT_RUN`, 미해결은 그대로 기록한다. 실패 시 전체 시험지를 재검하지 말고 해당 문제의 직접 영향 범위만 수정하며 실패 전 기록을 보존한다.

## 7. 생성 규칙

공통 지시와 실제 ROLE block만 복사하고 STREAM은 manifest 배정 A/B/C 중 하나로 고정한다. 시험지명은 prompt에 고정하지 않는다. `archive/tools/GPT2_ONE_SHOT_CLOSEOUT.md`와 `GPT2_CONNECTED_STDIO_HOST.md`는 opt-in CANARY이며 필수 선행조건이나 신규 기본 플랫폼이 아니다.
