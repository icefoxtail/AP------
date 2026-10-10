# JS Archive 2.0 — GPT Scheduled Execution Contract v1

status: CURRENT POLICY / GPT SCHEDULED LINE; operational transition pending
qualityContractVersion: JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006
currentCampaignId: H1_GPT2_20261006
parent quality authority: JS_Archive_2.0_Common_Quality_Contract_v1.md
scheduled prompt copy source: JS_Archive_2.0_GPT_Scheduled_Prompt_Template_v1.md
campaign authority: JS_Archive_2.0_GPT_Campaign_Generation_v1.md

## 0. Authority boundary and rollout state

이 문서는 GPT 예약 2.0의 문서상 목표 운영정책과 현재 적용 상태를 함께 정의한다. Prompt copy source는 `JS_Archive_2.0_GPT_Scheduled_Prompt_Template_v1.md`; A/B/C 대상 배정 authority는 `JS_Archive_2.0_GPT_Campaign_Generation_v1.md`와 frozen Git manifest다. Common Quality Contract의 문항 품질 기준은 계속 적용한다.

**이 문서 PR은 문서 준비다. 현재 consumer와 예약은 구방식이다.** 적용 담당자는 consumer/예약 지시를 필요한 만큼 갱신하고, 신규 자격 대상 또는 다음 미완료 단계에서 실제 예약 인수·저장·후속 인수와 최종 마감을 확인한 뒤 전환을 선언한다. 이미 완료된 검수를 실증 목적으로 반복하지 않는다. 그 전까지 현재 consumer 지시를 따른다. 문서 변경만으로 진행 중 시험지나 예약 실행을 바꾸거나 재시작하지 않는다.
기존 저장 continuation/인계문에 옛 CAS·marker-last·복수 upload/readback 지시가 남아 있으면 적용 담당자가 해당 운영지시만 새 정책으로 바꾸고, 이미 동결된 답·검수 증거·수정본은 그대로 보존한다(B13/C8에서 잔존 확인).

`archive/tools/GPT2_ONE_SHOT_CLOSEOUT.md`와 `GPT2_CONNECTED_STDIO_HOST.md`는 선택형 CANARY 도구다. 새 기본 흐름의 선행조건이 아니며, 이 문서 변경은 해당 코드를 활성화하지 않는다.

## 1. 목표 흐름

시험지별 단일 Library 작업본에서 `CREATE → R1 → R2 → R3 → 최종 기술검사·게시`를 수행하고, 단계별 결과는 하나의 누적 검수기록에 추가한다. 품질 역할은 유지하지만 중간 폴더로 작업본을 복사·이관하지 않고, 단계별 독립 PASS 영수증·반복 seal·validator 실행·같은 SHA 원격 재조회는 하지 않는다. 최종 기술검사와 게시를 한 번 수행한다.

이 간소화는 독립 검수 기준, 정확한 버전 식별, 대상 배정, 변경 영향 범위, 최종 구조 확인을 낮추지 않는다. 현재 campaign에서 검수본과 수정 범위가 유효한 기존 완료 기록은 원본을 보존하고 누적 기록에 링크해 승계하며 다음 미완료 단계부터 진행한다. 증거의 삭제·위조·소급 승격은 금지한다. 다른 generation의 기록은 current campaign 완료로 승계하지 않는다.

## 2. 대상과 작업 소유권

현재 캠페인의 `H1_GPT2_20261006`와 frozen manifest A/B/C 시험지별 배정·순서는 유지한다. 새로 배정하거나 stream 사이에서 가져오지 않는다. 시험지 하나는 한 시점에 한 단계, 한 작성자/실행자만 담당한다. 이전 실행이 끝났는지 불확실하면 같은 시험지를 중복 시작하지 말고 기존 실행을 확인·회수한다. 실제 진행 중인 시험지는 현재 위치와 증거를 보존하고 전환 자체를 이유로 다시 시작하지 않는다.

전환 후 selector는 누적 기록에서 해당 단계가 아직 완료되지 않았고 현재 소유 실행이 없는 다음 배정 시험지를 선택한다. 단계 중간의 Git/Notion write나 별도 Notion 갱신 관문은 두지 않는다. Git manifest의 대상 배정은 기존 authority로 유지한다.

## 3. Library 작업본과 누적 검수기록

시험지마다 Library에 작업본 하나와 append-only 누적 검수기록 하나를 둔다. 역할별 복사본이나 PASS/seal 영수증 파일은 만들지 않는다. 작업본은 Library 파일 ID와 version/revision으로 식별하고, 누적 기록에는 단계, 실행자, 시각, input/output revision, 검토 범위, 발견·수정·미해결 항목을 적는다. Library에서 revision을 다시 읽을 수 있으면 그것으로 검수본을 식별한다. 과거 revision을 재조회할 수 없을 때만 필요한 snapshot을 보존한다. 추가 SHA 기록은 최종 기술검사 또는 실제 불일치 진단에 한정한다.

누적 기록은 각 단계의 검토 완료와 유효한 선행 완료 기록의 링크를 보인다. 별도 PASS receipt/seal은 만들지 않는다. 다음 단계는 정확히 지정된 Library file ID+revision을 입력으로 받는다. 내용 변경 시 새 revision을 만들고 변경한 시험지의 영향 단계만 재개한다. 다른 시험지나 영향 없는 단계를 되돌리지 않는다.

**B13 단일 예약 파일럿의 revision 미노출 예외(2026-10-11):** Files 제공자가 작업본 version/revision을 반환하지 않으면 값을 임의 생성하지 않고 `revisionUnavailable=true`로 표기한다. 정확한 Library file ID와 현재 실바이트 SHA-256, 변경 없는 이미 보존된 이전 단계 snapshot의 file ID·실바이트 동일성을 기록해 해당 파일을 검수본 witness로 참조한다. 현재 B13은 R1/R2 JS 각각 41,496바이트, SHA-256 `3a2724f945dc99a4de2211149692dc12bf569d8922265c2770dccc5441a35969`, Git blob `fb3e9dbb84fa0b85aa5332ab30d29ebb2f9ee089`가 같음을 확인했다. 이 경우에 한하여 다음 단계는 `current file ID + 동일바이트 witness file ID + SHA-256`을 실질 revision 인수 근거로 사용한다. 기존 snapshot이 사용 가능하면 새 복제본을 만들지 않는다. 학생용 본문이나 기존 완료 단계가 달라진 경우에는 이 예외를 적용하지 않으며 변경 범위만 다시 결속한다. 이 예외는 최종 기술 validator·게시 gate 또는 B13 외 시험지·예약 정책을 완화하지 않는다.

## 4. CREATE / R1 품질 역할

CREATE는 Common Quality Contract와 아래 §16–17의 실제 품질 기준에 따라 전 qid의 source identity, 학생용 문항·보기·정답, QUESTION_LAYOUT, 해설/작은칠판 전개, 의미 기반 Meta·난이도, visual 필요성과 정확성, 엔진 사용 가능한 결과를 완성하고 Library file ID+revision과 근거를 누적 기록에 남긴다.

R1은 이전 정답·해설·타 검수자의 답을 볼 수 없는 별도 세션에서 시작한다. 입력은 완전한 학생용 문항과 필요한 그림·표, 기존 진행상태의 정답 없는 요약뿐이다. 누적 검수기록의 기존 내용을 열람하지 않은 채 독립 답과 필요한 풀이 근거만 먼저 append·저장·고정한다. 그 다음에만 전체 기록과 저장 답·해설을 열어 비교한다. CREATE 결론을 승계하지 않고 전 qid 품질 축도 독립 판단한다. 분리 순서를 보장하지 못하면 독립 검수 완료로 표시하지 말고 blind 입력으로 다시 수행한다. 수정은 변경 qid와 직접 영향 범위만 확인하고 새 revision을 기록한다.

## 5. R2 blind answer 검수

R2는 이전 정답·해설·타 검수자의 답을 볼 수 없는 R1과 별도의 새 세션에서 시작한다. 입력은 완전한 최신 학생용 문항·choices·필요 시각자료와 정답 없는 진행상태 요약뿐이며, 누적 기록의 기존 내용은 열지 않는다. 전 qid 독립 답과 필요한 근거만 먼저 append·저장·고정한 뒤 전체 기록과 저장 정답·해설을 열어 비교한다. 일치 항목은 닫고 불일치·의심·미해결·고위험만 조사한다. 새 수정은 해당 qid와 직접 영향만 재확인한다. R1의 전수 품질 검사를 반복하지 않는다.

## 6. R3와 최종 기술검사·게시

R3는 누적 기록의 변경 항목, 미해결 항목, 직접 영향 범위만 확인하고 전체 구조를 최종 확인한다. 전 시험지 의미 품질을 재검하지 않는다. 최종 구조 확인은 문서상 R3 완료 판단에 포함하되 기술 validator를 반복 실행하지 않는다.

CREATE/R1/R2/R3의 완료기록을 확인하고 필요한 수정을 마친 뒤, 한 번의 최종 기술검사로 현재 최종 revision과 필요한 자산의 구조·참조·identity 결속을 확인하고 한 번 게시한다. 이때만 validator를 실행하고, 게시 결과와 remote 확인 근거를 누적 검수기록에 남긴다. 같은 SHA에 대한 단계별 원격 재조회는 하지 않는다. 최종 검사 실패 시 시험지 전체를 되감지 않고, 실패한 항목과 직접 영향 범위만 적절한 단계로 돌려 수정한 뒤 새 최종 revision에 대해 최종 검사·게시를 다시 한다. 실패·수정 전 기록은 보존한다. 기술 PASS나 게시 완료를 추정으로 기록하지 않는다.

MASTER의 역할은 이 최종 기술검사와 target-only 게시다. 전역 publication lease, 단계별 Git 브랜치, 시험지별 중간 commit, render 또는 Codex handoff를 새 관문으로 두지 않는다. 실제 게시에서 필요한 동시성 제어는 consumer가 보장하는 target/head 조건을 따른다. 학생용 main 자료 사용 정책에 새 승인 관문을 추가하지 않는다.

## 7. 품질 상태와 역사 기록

누적 검수기록이 stage 진행과 미해결 사항의 실행 authority다. 현재 campaign에서 검수본이 동일하고 이후 수정이 해당 검수 범위에 영향을 주지 않아 유효한 기존 PASS/evidence는 원본을 보존해 링크로 승계한다. 완료된 단계는 반복하지 않고 다음 미완료 단계부터 잇는다. 다른 generation의 PASS/evidence는 승계하지 않는다. 기존 실패·미해결 evidence도 보존한다. 별도 stage PASS receipt나 반복 seal은 만들지 않는다.

전환 전 기존 예약 실행은 현재 consumer가 요구하는 stage artifact, validator, PASS/seal 및 lease 동작을 계속 따른다. 새 정책을 이유로 해당 gate를 생략하거나 진행 중 작업을 바꾸지 않는다. 전환 이후에는 이 문서와 새 consumer/예약 지시가 함께 일치해야 하며, 둘 중 하나만 갱신된 상태를 전환 완료로 간주하지 않는다.

## 16. CREATE/R1 semantic quality acceptance — 2026-10-08

CREATE와 R1은 전 qid에 아래 3가지 학생 노출 품질을 확보한다. R2/R3/MASTER에 CREATE·R1의 전체 재검 책임을 전가하지 않는다. 현재 campaign의 검수본이 그대로이고 후속 수정이 해당 범위에 영향이 없는 유효한 CREATE/R1 완료 기록은 적용 전환 시 다시 실행하지 않는다.

1. **Difficulty and Meta**: legacy `level`의 canonical `하|중|상` 문자열 필수(`null`·숫자 불허); `difficultyBucket` 1~5 별도 판정. L3/L4/RPM/crossConceptKeys/conditionKeys/integrationPattern은 실제 풀이 기반 semantic 판정.
2. **Question layout**: `layoutTag`는 의미적 조판 단위에 맞춰 문항별 결정한다. `stack` 일괄 적용 및 기계적 줄바꿈을 금지한다. 다수 `stack`은 해당 문항별 재확인 신호이지 획일적인 비율 제한은 아니다.
3. **Solution educational completeness**: 쉬운 문제도 조건→식 설정→중간 계산→정답 연결을 설명하고, 서술형은 결정적 논증과 풀이 전개를 보존한다. 평균 글자수는 진단 신호이지 품질 PASS 근거/고정 최소 자수 기준이 아니다.

R1은 CREATE의 verdict를 독립 재확인하며 형식 유효성만으로 semantic PASS를 내리지 않는다. 신규 gate 구현 없이 실제 qid별 작업/evidence에 반영하고, 발견된 결함은 same-stage targeted repair로 처리한다. 2026-10-08 회귀 대상: 24 매산여고·24 금당고·24 매산고·24 여수고. 기존 PASS를 자동 무효화하거나 전체 rewind하지 않으며, 이 네 시험지는 별도 핀포인트 보정 대상으로 취급한다.


## 17. NEXT-RUN QUALITY FLOOR — GPT CREATE/R1 quality (2026-10-08)

§16–17의 실제 CREATE/R1 품질 기준은 전환 후에도 유지된다. 아래 실행 순서의 보관·버전 식별은 새 누적 검수기록에 반영한다. validator, PASS receipt, seal, continuation 등 전환 후 실행 산출물은 §0–7의 새 정책을 따른다. 전환 전에는 기존 consumer 지시가 유효하다. 완료 시험지를 일괄 되감지 않고 결함은 영향 범위만 유지·수정한다.

### 17.1 실제 검토 순서와 근거

1. **SOURCE / INPUT SNAPSHOT:** identify current generation/stream/examUid, Library file ID+revision, qid denominator, source, original choices/assets, curriculum and applicable Golden+Negative sample. Read the actual Golden example solution and relevant visual **before** authoring/review; record example file/revision and observed board/layout rule. Never claim a preflight from a file name, boolean, or later reading.
2. **CREATE 4 axes, every qid:** source/QUESTION_LAYOUT; student-facing solution/SMALL_BOARD; actual semantic Meta+level/difficulty; visual/SVG necessity and correctness. Independently derive mathematical answer and verify **all five choices** where present, correct answer cardinality, and grade-appropriate solution. Preserve exact original stem/choices unless authorized repair; do not mechanically line-break source text.
3. **R1 independent four-axis review, every qid:** do not copy CREATE verdict. In a separate session that has not seen prior answers, solutions, or other reviewers' answers, read only complete current *student-visible* input (including required visuals) and an answer-free status summary. Save/freeze each independent answer and needed reasoning before opening the full cumulative record or stored answer/solution. Then compare. Never claim blind review if answer content was exposed beforehand. Independently rejudge all four axes, including curriculum, solution, Meta and visual necessity. If isolation failed, do not record completion; use a clean blind session.
4. **Repair in place:** when one semantic locus is defective, MINIMAL_REPAIR; if genuinely unrecoverable under current policy, ALIVE_REPLACEMENT. Re-evaluate changed qid and direct dependencies only, preserve unchanged good qids and valid completed stages. Do not restart a completed stage without identified drift.
5. **Exact revision record:** 누적 검수기록에 Library file ID+revision과 qid별 검토 결과를 적는다. 과거 revision을 재조회할 수 없을 때만 필요한 snapshot을 보존한다. 추가 SHA는 최종 기술검사 또는 실제 불일치 진단에 한정한다. 미실행 검토나 기술 검사는 완료로 쓰지 않는다. 최종 기술검사 실패는 실패 locus와 직접 영향 범위만 수정한다.

### 17.2 Four regression traps — qid-local decisions

- **Difficulty / Meta:** legacy \`level\` must be exactly \`하|중|상\`, not number/null. \`difficultyBucket\` is separately judged 1..5, not mechanically mapped from level. For *every qid*, verify L3/L4/RPM primary, \`crossConceptKeys\`, \`conditionKeys\`, \`integrationPattern\` against decisive steps and actual conditions; empty/\`NONE\` only after affirmative semantic judgment. A whole exam with all empty relational metadata is a **mandatory investigation signal**, never an automatic nonzero quota or automatic FAIL.
- **QUESTION_LAYOUT:** \`layoutTag\` is selected per stem/choices/complete math expression. Do not use \`stack\` in bulk or insert line breaks based on character counts, regex or formula fragments. Excess stack usage triggers targeted explanation of each affected qid; a large number itself is not an automatic FAIL. Keep original student stem and choices fidelity.
- **Student solution / notation:** a short solution must still show why each essential expression follows, intermediate substitution/calculation and final answer; longer text alone is not a PASS. Every subjective item retains its assessable decisive proof/steps. Use engine-safe LaTeX delimiters and commands for nontrivial math expressions/fractions/powers/derivatives/integrals; do not substitute plain Unicode superscripts/prime glyphs as a blanket math-layout shortcut. Student-facing explanations should read like teacher boardwork, not prose-only or answer-only.
- **Curriculum / source truth:** check *actual chosen solution method* against that exam's year, grade and course. A mathematically correct but out-of-scope method is defective (e.g. high-1 solution relying on double-angle tangent/advanced trigonometry); derive a permitted method by targeted repair. Never treat a Golden example from another curriculum as permission to transplant an advanced method.

Regression examples: \`24_매산여고_1학기_중간\` numeric level; \`24_금당고_1학기_중간\` null level/short basics; \`24_매산고_1학기_중간\` repeated stack; \`24_여수고_1학기_중간\` short subjective solutions; historical \`22_강남여고_1학기_기말\` all-empty relational Meta and out-of-curriculum q20; Codex \`20_매산여고_2학기_기말_고2_수학II\` uses Unicode-style math as a **notation caution**, not a model output to copy. These are quality examples, not claims that each belongs to the current GPT2 campaign.

### 17.3 역할과 render 분리

CREATE는 완성된 학생용 결과를 만들고 R1은 독립 판정·수정한다. R2는 blind 답 검수를, R3는 변경·미해결·직접 영향 범위와 최종 구조 확인을 맡는다. MASTER는 최종 기술검사와 게시를 맡는다. GPT는 Archive Engine을 캡처하지 않는다. Codex render는 GPT 실행 선행조건이나 CREATE/R1 품질 검수를 대신하지 않는다. 정적 검토를 `RENDER_PASS`로 기록하지 않는다. 임의 글자 수 기준, Meta quota, 전체 재검 반복은 두지 않는다. A/B/C 고정 배정과 시험지당 한 번에 한 단계·한 실행자를 유지한다. 앞선 실행이 불확실하면 확인한 뒤 이어가고 중복 시작하지 않는다.

### 17.4 누적 검수기록 항목

CREATE/R1은 검토한 `examUid`와 Library file ID+revision, qid 범위, 독립 검토 및 Golden 근거, 변경 qid와 직접 영향, 발견·수정·미해결 사항을 한 누적 검수기록에 남긴다. 별도 PASS/evidence 파일이나 stage별 closure receipt는 만들지 않는다. 최종 기술검사 결과는 §6에서만 기록한다.

## 2026-10-08 — Direct assignment completion scope

이 단락은 전환 전의 현재 consumer 흐름과 GPT 예약 외 Archive 실행에 적용된다. GPT 예약 2.0의 간소화 전환 후에는 §0–7이 단계 산출물·기술검사·게시 순서를 정한다. 이 문구는 학생용 main 자료 사용 정책에 승인 단계를 추가하지 않는다. 모든 실행선에서 실제 수행하지 않은 검수·렌더·게시를 완료로 기록하지 않는다.
