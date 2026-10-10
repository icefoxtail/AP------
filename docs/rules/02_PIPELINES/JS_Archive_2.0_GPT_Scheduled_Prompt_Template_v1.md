# JS Archive 2.0 — GPT Scheduled Prompt Template v1

status: CURRENT COPY SOURCE / POST-TRANSITION POLICY; operational transition pending
qualityContractVersion: JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006
currentCampaignId: H1_GPT2_20261006

## 0. 적용 상태와 필독

이 템플릿은 전환 후 GPT 예약 2.0 prompt copy source다. **문서 PR만으로 전환되지 않는다.** 현재 consumer/예약은 구방식이므로, 적용 담당자가 consumer·예약 지시를 갱신하고 예약 한 건을 끝까지 실증해 전환을 선언하기 전에는 현재 예약 지시를 그대로 따른다. 진행 중 시험지를 재시작하지 않는다.

전환 후 실행 authority는 Git의 Common Quality Contract, Campaign/Generation, Scheduled Execution 및 manifest다. Notion 매 run 조회·갱신은 prerequisite가 아니다. optional CANARY 문서는 새 기본 흐름의 필수 선행조건이 아니다.

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
- 시험지별 Library 작업본 하나와 누적 검수기록 하나를 쓴다. 정확한 검수 revision SHA와 실제 바이트를 보존한다. 단계별 복사본, 별도 PASS 영수증/seal, 중간 Git branch, 반복 validator, 반복 원격 SHA 조회를 만들지 않는다.
- 한 시험지는 한 시점에 한 단계·한 실행자만 맡는다. 앞선 실행의 종료가 불확실하면 중복 시작하지 말고 상태를 확인한다.
- 단계별 판단과 근거를 append-only 누적 검수기록에 추가하고 다음 단계의 입력 revision SHA를 기록한다. 미실행은 미실행으로 적고 완료/PASS를 꾸미지 않는다.
- 단계별 Git/Notion 관문이나 global publication lease는 두지 않는다. 마지막에 한 번 최종 기술검사 후 게시한다.
- force push, 무관 파일 변경, 다른 stream 대상 처리는 금지한다.

## 2. ROLE = CREATE — COPY

전 qid의 source identity, 학생용 발문·choices·answer, QUESTION_LAYOUT, 작은칠판 해설, 의미 기반 Meta·difficulty, visual/SVG 필요성·정확성, engine-safe 결과를 완성한다. 실제 Golden/Negative와 필요한 그림을 사전에 확인하고 근거와 revision SHA를 누적 기록에 남긴다. 품질 기준은 Scheduled Execution §§16–17을 따른다. 이 단계에서 별도 validator/PASS/seal을 만들지 않는다.

## 3. ROLE = R1 — COPY

CREATE 결론을 승계하지 않고 전 qid 품질 축을 독립 판단한다. 완전한 학생용 입력과 필요한 그림·표를 확인한 뒤 정답/해설을 보기 전에 독립 답과 필요한 풀이 근거를 먼저 저장·고정한다. 그 후에만 저장 답·해설과 대조한다. 이 순서를 보장하지 못한 실행은 실제대로 기록하고 독립 검수 완료로 표시하지 않는다. 수정 후 변경 qid와 직접 영향만 확인하고 revision SHA를 기록한다. 별도 validator/PASS/seal을 만들지 않는다.

## 4. ROLE = R2 — COPY

완전한 최신 학생용 입력(content, choices, 필요한 visual)에서 저장 정답/해설을 보기 전에 전 qid 독립 답과 필요한 근거를 먼저 기록·고정한다. 이후 비교해 일치 항목은 닫고 불일치·의심·미해결·고위험만 조사한다. R1의 전수 품질 검사를 반복하지 않는다. 별도 validator/PASS/seal을 만들지 않는다.

## 5. ROLE = R3 — COPY

누적 기록의 변경·미해결 항목과 직접 영향 범위만 확인하고 최종 구조를 확인한다. 전수 의미 재검을 하지 않는다. 구조 확인용 validator를 반복 실행하지 않는다. 최종 기술검사 실패가 있으면 실패 항목과 직접 영향 범위만 해당 단계로 되돌려 수정한다.

## 6. ROLE = MASTER — COPY

CREATE/R1/R2/R3 완료 후 현재 최종 revision에서 기술 validator를 한 번 실행하고, 필요한 자산·참조·identity를 확인한 다음 target-only 게시를 한 번 수행한다. 결과와 근거를 누적 검수기록에 남긴다. 동일 SHA 재조회, global publication lease, 단계별 Git branch, 학생용 자료 정책의 추가 승인 관문을 만들지 않는다. 실패 시 전체 시험지를 재검하지 말고 해당 문제의 직접 영향 범위만 수정하며 실패 전 기록을 보존한다.

## 7. 생성 규칙

공통 지시와 실제 ROLE block만 복사하고 STREAM은 manifest 배정 A/B/C 중 하나로 고정한다. 시험지명은 prompt에 고정하지 않는다. `archive/tools/GPT2_ONE_SHOT_CLOSEOUT.md`와 `GPT2_CONNECTED_STDIO_HOST.md`는 opt-in CANARY이며 필수 선행조건이나 신규 기본 플랫폼이 아니다.
