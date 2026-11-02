# JS Archive — Gemini 검수서 → GPT 핀포인트 해설 수리 → Git main 병합 (실행 SOP CURRENT v1.1)

> **적용일:** 2026-11-02  
> **범위:** 이미 Git main에 존재하는 기출 JS에 대해 Gemini 등 외부 검수자가 결함 후보를 제출한 후, GPT가 해당 문항만 직접 수리하고 main까지 운영병합하는 단일 대화/단일 작업.  
> **작업 호출명:** **해설 핀포인트 수리·운영병합**  
> **권위:** 최신 사용자 명시 지시 > [JS Archive FINAL QA 실행 카드](JS_Archive_FINAL_QA_EXECUTION_CARD_CURRENT.md) 및 현행 학생용 해설 규정 > 이 문서. 이 문서는 작업 방법의 **shortcut/recipe**일 뿐, 기존 FINAL QA 정본·검수 게이트를 대체하거나 변경하지 않는다.

## 0. 목표 및 작업 경계

- **Gemini는 건드리지 않는다.** Gemini 검수 예약의 시간·ON/OFF·프롬프트·검수 방식·Before→After 작성 여부를 수정하지 않는다. 검수서에 Before→After가 있어도 GPT에게 지시가 아닌 **참고 의견**이다.
- GPT는 검수서의 UPGRADE/OPEN/결함 후보만 받아서 **직접 원문과 수학을 판정하고, 받아들일 수리만 채택**한다. 충분한 기존 해설은 KEEP, 오진은 REJECT_WITH_REASON, 실제 결함은 REPAIR.
- 이미 검수된 KEEP 문항 61개 등을 전수 재풀이하거나 별도 R1/R2/R3를 다시 열지 않는다. **작업 분모 = 수리 후보 + 직접 영향 + 판본/증거 충돌**.
- Git main의 실제 시험지 JS와 해당 문항에 결속된 이미지·기존 증거가 **수정 정본**이다. Google Drive/Library 인계 자료는 **검수서·출처·작업 큐**이며, 과거 JS 복사본으로 main을 덮어쓰지 않는다.
- 기본 변경 범위는 확정 결함의 solution만. 발문·정답·선지·교육과정 분류·자산 자체 결함이 확정된 경우에만 그 최소 직접 관련 부분을 함께 고친다. 무관한 시스템·공통 도구·자동화/CI·Meta 전체 정본은 수정 금지.
- 병합할 수 있는 권한과 도구가 있으면 **GPT 본인이 PR → main 병합 → main SHA와 대상 Blob 재조회까지** 수행한다. 제안·지시서 작성으로만 종료하지 않는다.

## 1. 시작 입력 확인

1. 사용자가 지정한 **Drive 검수서/Library 파일/링크/배치**를 실제 열어 수리 후보를 확보한다. 사용자가 “최신 검수서”라고 하면 해당 Gemini 검수 라인의 실제 산출 폴더·인계 기록을 조회해 최신 확정본을 구분한다. **파일명 검색 부재만으로 작업 없음으로 판단하지 않는다.**
2. 검수서에서 시험지 정확한 Git 경로, 문항 번호, UID(있을 때), 결함 주장, 관련 그림, 제안 수리안, 보고된 blob/SHA를 추출한다. 검수서에 없는 번호·UID를 만들어내지 않는다.
3. 시작 규칙 라우팅은 해당 [FINAL QA 실행 카드](JS_Archive_FINAL_QA_EXECUTION_CARD_CURRENT.md)와 현재 소스의 실제 규칙으로 한다. 해당 작업에 요구되는 Golden Sample 2~3개 + Negative Sample을 **실제 읽어** 작은칠판 품질 눈높이를 고정하되, 타 문항 전수 재검수로 확대하지 않는다.
4. 최신 origin/main HEAD와 각 해당 JS의 **실제 Git Blob SHA, questionBank 전체 분모, 문항 식별 정보**를 확인한다. 보고서 latestBlobSha가 다르더라도 즉시 종료하지 않고, **같은 문항인지 원문·UID·발문·이미지·정답으로 재결속**한다. 결속 불가 시 임의 패치·병합 금지, 그 문항만 OPEN.
5. 현재 이미 동일 수리가 반영됐으면 NO_CHANGE로 처리한다. 다른 작업자 변경이 끼어들면 최신 main/대상 변경을 재조회하고 범위 내에서만 재적용한다.

## 2. GPT 독립 선별·수리

각 후보별로 **원문·보기·정답·현재 solution·필요한 실제 그림/해설 자산**을 확인하고 다음을 판정한다.

- 수학 정합성: 학생이 조건에서 식을 세우고 중간 계산을 따라가면 정답까지 재현되는가? 불필요한 정답만 맞춘 “계산하면”/“대칭이면”/“자명하다”를 남기지 않는가?
- 작은칠판 구조: **조건 해석 → 핵심 성질 선택 → 식 설정 → 줄별 계산 → 조건·경우 분리 → 답**. ㄱ/ㄴ/ㄷ·①~⑤·(i)/(ii)는 실제 독립 문단/블록으로 구분한다. 짧기만 한 해설보다 학생이 **손으로 다시 풀 수 있는 해설**을 우선한다.
- 교육과정: 해당 학년·시험 범위에서 배우는 정식 개념·기호·용어만 사용한다. 고1 문항에 불필요한 벡터·코시-슈바르츠·행렬식 등 상위 풀이를 끼워 넣지 않는다. 대신 기울기·좌표·거리·닮음·피타고라스·기초 대수 등 허용 풀이로 치환한다.
- 기존 유효 증명 보호: 문장을 매끄럽게 고친다는 이유로 **증명의 결정적 보조점·수선·닮음 대응·각도 추론·조건 검토를 삭제하지 않는다**. Gemini의 After에 계산/논리 누락이 있으면 채택하지 않는다.
- 그림이 사실상 필수인 문항은 실제 문제 이미지/SVG의 점·각·선분 귀속을 살펴 본문 주장과 일치시킨다. 그림을 확인하지 않고 도형 관련 품질 PASS를 선언하지 않는다.
- 수리할 필요가 없으면 REJECT/KEEP과 **한 줄의 수학적 근거**를 남기고 고치지 않는다. **수정 개수 할당이나 의무 수리 비율은 없다.**

## 3. 핀포인트 Git 수정

1. 최신 main의 파일을 작업 브랜치에 가져와 **검수로 확정한 대상 qid의 solution만** 가능한 한 원래 형태를 보존하여 수정한다. 필수 자산·정답·Meta 등은 결함이 확정되지 않으면 보호한다.
2. 수정 전후 questionBank의 문항 수, 순서, UID, 각 문항별 키/값을 비교한다. 미수정 문항 **완전 동일**, 수정 문항은 허용한 필드만 변경되었는지 기계 대조한다. **문항 번호(ordinal)만으로 UID identity를 대신하지 않는다.**
3. 수정한 모든 풀이를 독립 검산하고, 원문 조건·답과 대조한다. 문단 구조·교육과정·수식 escape·TeX 구분자·줄바꿈·필요한 경우 분리 확인. Golden quality floor와 **수정 범위 N/N** 대조한다.
4. 사용 가능한 실행 환경에서 최소 node --check, 실제 JS 로딩/questionBank JSON 파싱, 보호 필드 diff를 실시한다. 학생 mode=sol 렌더가 필요한 결함·그림 변경은 표적 실렌더를 수행한다. **실행하지 못한 검증은 NOT_RUN/TOOLING_GAP로 정확히 기재하고 PASS로 쓰지 않는다.** JS 구문 및 런타임 파싱 결과를 동일한 검사로 취급하지 않는다.
5. 관련 시험지 파일/필수 자산만 포함된 소형 PR을 만들고 main으로 병합한다. **충돌·branch protection·실질 HARD FAIL은 우회 금지**. 병합 성공 뒤 GitHub에서 **main commit SHA + 각 변경 파일 blob SHA**를 재조회한다.

## 4. 완료 판정 및 기록

- MAIN_DONE = 변경 대상의 원격 main 병합 + 최신 main의 파일 blob 일치. **PIPELINE_PASS 및 DEPLOY_DONE과 별개**다. CI/Pages/DB/Search 후속 자동화는 관련 Actions 담당이며, 반복 polling과 정상 문항 전체 재검은 하지 않는다.
- QUALITY_PASS는 **실제 수행한 수학·해설·교육과정·필수 표현/렌더 검사 범위**의 결과만 판정한다. 메인 병합 성공이 수학·조판·브라우저 최종 품질 PASS를 자동 보장하지 않는다.
- 종료 보고는 간단하게: **수리 시험지/QID, 실제 수정 수, 재사용 KEEP/REJECT, PR, main SHA, 변경 Blob 일치, 실행/NOT_RUN 검증, 미해결 첫 단계**. 없는 테스트 결과를 만들어내지 않는다.
- AWCR은 다른 taskId에 합류하지 말고, 이 작업 고유 taskId/owner를 부여해 **안전한 metadata만** 최신 revision으로 Drive append-only 저장 후 raw bytes/SHA readback을 확인한다. 저장 미확인이면 RECORD_PENDING. 학생 문제·정답·해설 원문/비밀정보는 공유 checkpoint에 넣지 않는다.
- 사용자가 다른 채팅을 열면 새 작업자는 **현재 최신 Git main·실제 신규 검수서**에서 시작한다. 이전 PR의 README/채팅 내용/오래된 SHA만으로 현 상태를 추정하지 않는다.

## 5. 다른 채팅에서 쓸 호출 문구

> **“JS Archive 해설 핀포인트 수리·운영병합 해줘. 최신 Git main의 docs/operations/JS_Archive_Gemini_Audit_GPT_Pinpoint_Repair_Main_SOP_CURRENT.md를 읽고, Gemini 최신 검수서의 수리 후보만 직접 판정해 필요한 해설을 작은칠판 기준으로 수정한 뒤 PR 생성부터 main 병합·원격 SHA 확인까지 마감해. Gemini 예약·프롬프트는 건드리지 마.”**

검수서가 특정되어 있다면 마지막에 **“대상 검수서: [정확한 Drive 링크/배치명]”**을 붙인다. 링크가 없으면 담당 Gemini 검수 산출 폴더에서 실제 최신 수리 후보를 찾는다.

## 6. 기준이 된 실제 실행 예 (이력, 재작업 지시 아님)

- Gemini read-only 인계: SOLUTION_UPGRADE_SPEC_20261102_1250.md (3시험지 69문항, KEEP 61, UPGRADE 후보 8).
- GPT가 직접 수리한 문항: 26_팔마고_2학기_중간_고1_기출.js Q15/Q18; 26_매산여고_2학기_중간_고1_기출.js Q14/Q20/Q22; 24_매산중_2학기_중간_중2_수학.js Q10/Q19/Q20.
- 결과: [PR #1202](https://github.com/icefoxtail/AP------/pull/1202), 원격 main merge SHA 21dee9100095d1b0ce676453c29fa77792105a29. 해당 3파일 blob 일치 MAIN_DONE.
- 당시 node --check 및 실제 브라우저 sol 렌더는 NOT_RUN. **이 예시를 최종 렌더/QA 통과 사례로 과장하거나 신규 작업의 검증 면제 근거로 사용하지 않는다.**

## 7. 변경 이력

- 2026-11-02 v1.0: Gemini 원본 검수 운영을 유지한 채 GPT 단독 수리·main 운영병합 사례를 단일 SOP/호출 문구로 정식화.


## 8. GPT 처리 완료 원장 — CURRENT v1.1 (2026-11-02)

**Gemini 원본과 GPT 완료 기록은 별개다.** Gemini 검수 예약·프롬프트·보고서·검수 폴더를 변경하지 않는다.

- **Gemini 원본 보고서 폴더:** https://drive.google.com/drive/folders/1ZuAPFi-oGjX-B7nKFbBTTAB4lqo7t4rf
- **GPT 완료 원장 폴더:** https://drive.google.com/drive/folders/1gNl9F5598JXuq1RaWiV2bvTvr4draojF
- GPT는 배치별 완료 영수증 JSON을 새 파일로 append-only 저장한다. 예: GPT_PINPOINT_RECEIPT_20261102_1600_MAIN_DONE.json. 과거 배치도 historical=true로 소급 기록한다.
- 영수증에는 sourceReportDriveId/URL, batchId, 시험지의 **실제 최신 Git 경로**와 과거 보고서 경로, qid/sourceQid/UID(있는 경우), 보고된 source blob, 변경 전후 blob, 문항별 REPAIRED/ALREADY_APPLIED/REJECT_WITH_REASON/OPEN 판정, 원격 PR/main SHA, 정확히 실행한 검증의 PASS/NOT_RUN, 남은 일과 nextAction만 기록한다. 문제·정답·해설 원문은 영수증에 저장하지 않는다.
- Gemini가 보고한 KEEP 수와 GPT가 실제 확인한 qid 수는 별개로 기록한다. Gemini의 66 KEEP을 GPT가 직접 전수 검수한 것으로 쓰지 않는다.
- MAIN_DONE 영수증은 원격 main commit SHA와 변경 파일 blob이 실제로 재조회되어 일치한 뒤에만 생성한다. 보고서 제출, PR 생성, PR 병합 시도는 MAIN_DONE이 아니다. 품질 PASS, PIPELINE_PASS, DEPLOY_DONE도 main 병합과 별도다.
- 기존 원장은 수정·삭제하지 않고 새 파일에 supersedesReceipt/previousReceiptId를 기록해 다음 revision으로 잇는다. 다른 작업자와 충돌하면 덮어쓰지 않는다.
- AWCR task checkpoint와 GPT 업무 원장은 분리한다. AWCR에는 taskId/owner/revision/안전한 증거 참조 등 bootstrap whitelist metadata만 공유한다.

## 9. 다음 Gemini 보고서를 받을 때 중복 수리 방지

1. 먼저 Gemini 보고서 폴더의 실제 직접 자식 목록을 열어 배치 시각/Drive 문서 ID 기준 최신 확정 보고서를 찾는다. 검색 결과가 없다고 작업이 없다고 단정하지 않는다.
2. GPT 완료 원장 폴더를 직접 조회해 동일 report ID, 동일 sourceArchiveFile 및 해당 qid의 이전 처리 결과를 확인한다.
3. source identity는 우선 실제 JS 경로, sourceQid/UID, 발문·정답·이미지 결속으로 비교한다. 검수서에서 옛 경로를 지시하면 최신 main 실제 폴더/파일을 찾아 mapping을 기록한다. 문항 번호만으로 정본 identity를 추정하지 않는다.
4. 이미 완료된 qid라도 최신 Git main에서 해당 solution과 필요한 필드가 이전 완료 버전대로 유지되는지 확인한다. 동일하게 반영되어 있으면 ALREADY_APPLIED로 기록하고 재수리하지 않는다.
5. 같은 시험지의 다른 qid에 새 결함이 생겼다면 새 qid만 작업한다. 과거 시험지 blob과 현재 blob이 다르다는 이유만으로 정상 문항을 전수 재검하지 않는다.
6. 외부 보고서의 Before/After는 참고하고 GPT가 직접 수학·교육과정·작은칠판·현재 보호 필드를 판단한다. 재검에서 확인한 실제 결함만 수정한다.
7. 작업은 Git 원격 main 병합·파일 blob 재조회·GPT 전용 Drive 완료 영수증 저장·원격 raw readback 후 종료한다. 어느 단계가 실패했는지 정직하게 남긴다.

### 이전 실제 배치의 식별

- 20261102_1250: 팔마고 고1 Q15/Q18, 매산여고 고1 Q14/Q20/Q22, 매산중 중2 Q10/Q19/Q20. PR #1202, main 21dee9100095d1b0ce676453c29fa77792105a29. GPT 작업 대상 8건은 main Blob 확인됨. node --check와 학생 sol 브라우저 실렌더는 NOT_RUN. 소급 영수증은 위 GPT 원장에서 확인한다.
- 20261102_1600: Gemini 2회차 3시험지 71문항 중 UPGRADE 후보 5문항. 최신 실제 결과는 GPT 원장의 배치 완료 영수증에서 확인하며 이 SOP의 정적 과거 사례를 최신 상태로 오해하지 않는다.
