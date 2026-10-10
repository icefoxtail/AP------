# JS Archive 2.0 — GPT Scheduled Execution Contract v1

status: CURRENT POLICY / GPT SCHEDULED LINE; operational transition pending
qualityContractVersion: JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006
currentCampaignId: H1_GPT2_20261006
parent quality authority: JS_Archive_2.0_Common_Quality_Contract_v1.md
scheduled prompt copy source: JS_Archive_2.0_GPT_Scheduled_Prompt_Template_v1.md
campaign authority: JS_Archive_2.0_GPT_Campaign_Generation_v1.md

## 0. Authority boundary and rollout state

이 문서는 GPT 예약 2.0의 문서상 목표 운영정책과 현재 적용 상태를 함께 정의한다. Prompt copy source는 `JS_Archive_2.0_GPT_Scheduled_Prompt_Template_v1.md`; A/B/C 대상 배정 authority는 `JS_Archive_2.0_GPT_Campaign_Generation_v1.md`와 frozen Git manifest다. Common Quality Contract의 문항 품질 기준은 계속 적용한다.

**이 문서 PR은 문서 준비다. 현재 consumer와 예약은 구방식이다.** 아래 간소화 정책은 적용 담당자가 consumer/예약 지시를 필요한 만큼 갱신하고, 예약 한 건을 처음부터 최종 검사·게시까지 실증한 뒤 전환을 선언할 때부터 효력이 있다. 그 전까지 실행자는 현재 consumer 지시를 따른다. 문서 변경만으로 진행 중 시험지나 예약 실행을 바꾸거나 재시작하지 않는다.

`archive/tools/GPT2_ONE_SHOT_CLOSEOUT.md`와 `GPT2_CONNECTED_STDIO_HOST.md`는 선택형 CANARY 도구다. 새 기본 흐름의 선행조건이 아니며, 이 문서 변경은 해당 코드를 활성화하지 않는다.

## 1. 목표 흐름

시험지별 단일 Library 작업본에서 `CREATE → R1 → R2 → R3 → 최종 기술검사·게시`를 수행하고, 단계별 결과는 하나의 누적 검수기록에 추가한다. 품질 역할은 유지하지만 중간 폴더로 작업본을 복사·이관하지 않고, 단계별 독립 PASS 영수증·반복 seal·validator 실행·같은 SHA 원격 재조회는 하지 않는다. 최종 기술검사와 게시를 한 번 수행한다.

이 간소화는 독립 검수 기준, 정확한 버전 식별, 대상 배정, 변경 영향 범위, 최종 구조 확인을 낮추지 않는다. 기존 PASS와 실패·검수 증거는 보존하며 삭제·위조·소급 승격하지 않는다. 기존 기록은 새 누적 검수기록의 허위 완료 상태로 옮기지 않는다.

## 2. 대상과 작업 소유권

현재 캠페인의 `H1_GPT2_20261006`와 frozen manifest A/B/C 시험지별 배정·순서는 유지한다. 새로 배정하거나 stream 사이에서 가져오지 않는다. 시험지 하나는 한 시점에 한 단계, 한 작성자/실행자만 담당한다. 이전 실행이 끝났는지 불확실하면 같은 시험지를 중복 시작하지 말고 기존 실행을 확인·회수한다. 실제 진행 중인 시험지는 현재 위치와 증거를 보존하고 전환 자체를 이유로 다시 시작하지 않는다.

전환 후 selector는 누적 기록에서 해당 단계가 아직 완료되지 않았고 현재 소유 실행이 없는 다음 배정 시험지를 선택한다. 단계 중간의 Git/Notion write나 별도 Notion 갱신 관문은 두지 않는다. Git manifest의 대상 배정은 기존 authority로 유지한다.

## 3. Library 작업본과 누적 검수기록

시험지마다 Library에 작업본 하나와 append-only 누적 검수기록 하나를 둔다. 역할별 CREATE/R1/R2/R3 하위 복사본이나 PASS/seal 영수증 파일은 만들지 않는다. 같은 Library 위치에서 작업하되, 검수기록은 각 단계가 실제로 읽고 판단한 작업본 revision의 SHA-256(필요한 경우 원본 Git blob SHA도 구분 표기), 단계, 실행자, 시각, 입력/출력 revision, 검토 범위, 발견·수정·미해결 항목을 기록한다. Library의 revision history에서 해당 SHA의 실제 바이트를 보존해 정확히 검수한 버전을 다시 식별할 수 있어야 한다. revision을 보존할 수 없다면 해당 버전을 덮어쓰지 말고 새 버전으로 저장한다.

누적 기록은 각 단계의 검토 완료를 표시하되 별도 PASS receipt나 seal을 만들지 않는다. 단계 결과는 같은 기록에 덧붙이며, 다음 단계는 기록에 명시된 정확한 작업본 revision을 입력으로 받는다. 내용 변경 시 새 revision을 만들고 변경한 시험지의 영향 단계만 재개한다. 다른 시험지나 영향 없는 단계는 되돌리지 않는다.

## 4. CREATE / R1 품질 역할

CREATE는 Common Quality Contract와 아래 §16–17의 실제 품질 기준에 따라 전 qid의 source identity, 학생용 문항·보기·정답, QUESTION_LAYOUT, 해설/작은칠판 전개, 의미 기반 Meta·난이도, visual 필요성과 정확성, 엔진 사용 가능한 결과를 완성하고 그 revision SHA와 근거를 누적 기록에 남긴다.

R1은 CREATE 결론을 승계하지 않고, 자기 독립 판단을 기록한다. 완전한 학생용 입력과 필요한 그림·표를 먼저 확인한다. 정답/해설을 보기 전에 각 qid의 독립 답과 필요한 풀이 근거를 먼저 저장·고정하고, 그 뒤에만 저장 답·해설과 대조한다. 이 순서가 보장되지 않으면 독립 답으로 꾸미지 말고 해당 실행을 증거와 함께 기록한 뒤 깨끗한 blind 입력을 확보해 R1을 다시 수행한다. 답 검수와 별도로 전 qid의 핵심 품질 축을 독립 판단한다. 수정은 변경 qid와 직접 영향 범위만 확인하고 새 revision SHA를 기록한다.

## 5. R2 blind answer 검수

R2는 완전한 최신 학생용 입력(content, choices, 필요한 시각자료)을 사용한다. stored answer/solution을 열기 전에 전 qid의 독립 답과 필요한 근거를 먼저 기록·고정한다. 이후 비교해 일치 항목은 닫고 불일치·의심·미해결·고위험 항목만 조사한다. 독립 freeze의 입력 revision과 답이 저장되기 전에는 정답·해설을 열지 않는다. 새 내용 수정은 해당 qid와 직접 영향만 재확인한다. R1의 전수 품질 검사를 반복하지 않는다.

## 6. R3와 최종 기술검사·게시

R3는 누적 기록의 변경 항목, 미해결 항목, 직접 영향 범위만 확인하고 전체 구조를 최종 확인한다. 전 시험지 의미 품질을 재검하지 않는다. 최종 구조 확인은 문서상 R3 완료 판단에 포함하되 기술 validator를 반복 실행하지 않는다.

CREATE/R1/R2/R3 판단과 필요한 수정을 모두 마친 후, 한 번의 최종 기술검사로 현재 최종 revision과 필요한 자산의 구조·참조·identity 결속을 확인하고 한 번 게시한다. 이때만 validator를 실행하고, 게시 결과와 remote 확인 근거를 누적 검수기록에 남긴다. 같은 SHA에 대한 단계별 원격 재조회는 하지 않는다. 최종 검사 실패 시 시험지 전체를 되감지 않고, 실패한 항목과 직접 영향 범위만 적절한 단계로 돌려 수정한 뒤 새 최종 revision에 대해 최종 검사·게시를 다시 한다. 실패·수정 전 기록은 보존한다. 기술 PASS나 게시 완료를 추정으로 기록하지 않는다.

MASTER의 역할은 이 최종 기술검사와 target-only 게시다. 전역 publication lease, 단계별 Git 브랜치, 시험지별 중간 commit, render 또는 Codex handoff를 새 관문으로 두지 않는다. 실제 게시에서 필요한 동시성 제어는 consumer가 보장하는 target/head 조건을 따른다. 학생용 main 자료 사용 정책에 새 승인 관문을 추가하지 않는다.

## 7. 품질 상태와 역사 기록

누적 검수기록이 stage 완료와 미해결 사항의 실행 authority다. 기존 campaign/stream/exam identity와 qualityContractVersion은 기존 manifest와 Common Quality Contract를 따른다. 별도 stage PASS receipt, 반복 seal, 독립 closure 파일을 만들지 않는다. 이전 세대·기존 pilot·기존 PASS/FAIL/evidence는 원 위치의 역사 기록으로 보존하고 새 기록의 완료로 소급 해석하지 않는다.

전환 전 기존 예약 실행은 현재 consumer가 요구하는 stage artifact, validator, PASS/seal 및 lease 동작을 계속 따른다. 새 정책을 이유로 해당 gate를 생략하거나 진행 중 작업을 바꾸지 않는다. 전환 이후에는 이 문서와 새 consumer/예약 지시가 함께 일치해야 하며, 둘 중 하나만 갱신된 상태를 전환 완료로 간주하지 않는다.

## 16. CREATE/R1 semantic quality acceptance — 2026-10-08

CREATE와 R1은 전 qid에 아래 3가지 학생 노출 품질을 확보한다. R2/R3/MASTER에 CREATE·R1의 전체 재검 책임을 전가하지 않는다.

1. **Difficulty and Meta**: legacy `level`의 canonical `하|중|상` 문자열 필수(`null`·숫자 불허); `difficultyBucket` 1~5 별도 판정. L3/L4/RPM/crossConceptKeys/conditionKeys/integrationPattern은 실제 풀이 기반 semantic 판정.
2. **Question layout**: `layoutTag`는 의미적 조판 단위에 맞춰 문항별 결정한다. `stack` 일괄 적용 및 기계적 줄바꿈을 금지한다. 다수 `stack`은 해당 문항별 재확인 신호이지 획일적인 비율 제한은 아니다.
3. **Solution educational completeness**: 쉬운 문제도 조건→식 설정→중간 계산→정답 연결을 설명하고, 서술형은 결정적 논증과 풀이 전개를 보존한다. 평균 글자수는 진단 신호이지 품질 PASS 근거/고정 최소 자수 기준이 아니다.

R1은 CREATE의 verdict를 독립 재확인하며 형식 유효성만으로 semantic PASS를 내리지 않는다. 신규 gate 구현 없이 실제 qid별 작업/evidence에 반영하고, 발견된 결함은 same-stage targeted repair로 처리한다. 2026-10-08 회귀 대상: 24 매산여고·24 금당고·24 매산고·24 여수고. 기존 PASS를 자동 무효화하거나 전체 rewind하지 않으며, 이 네 시험지는 별도 핀포인트 보정 대상으로 취급한다.


## 17. NEXT-RUN QUALITY FLOOR — GPT CREATE/R1 quality (2026-10-08)

§16–17의 실제 CREATE/R1 품질 기준은 전환 후에도 유지된다. 아래 실행 순서의 보관·버전 식별은 새 누적 검수기록에 반영한다. validator, PASS receipt, seal, continuation 등 전환 후 실행 산출물은 §0–7의 새 정책을 따른다. 전환 전에는 기존 consumer 지시가 유효하다. 완료 시험지를 일괄 되감지 않고 결함은 영향 범위만 유지·수정한다.

### 17.1 실제 검토 순서와 근거

1. **SOURCE / INPUT SNAPSHOT:** pin current generation/stream/examUid, exact source/final raw SHA, qid denominator, original choices/assets, curriculum and applicable Golden+Negative sample. Read the actual Golden example solution and relevant visual **before** authoring/review; record real example qid, SHA and observed board/layout rule. Never claim a preflight from a file name, boolean, or later reading.
2. **CREATE 4 axes, every qid:** source/QUESTION_LAYOUT; student-facing solution/SMALL_BOARD; actual semantic Meta+level/difficulty; visual/SVG necessity and correctness. Independently derive mathematical answer and verify **all five choices** where present, correct answer cardinality, and grade-appropriate solution. Preserve exact original stem/choices unless authorized repair; do not mechanically line-break source text.
3. **R1 independent four-axis review, every qid:** do not copy CREATE verdict. Read complete current *student-visible* input, including all required visual bytes, before independent mathematical judgment. Before opening stored answer/solution, save and freeze the independent answer and needed reasoning for every qid using complete student-only input, including required visuals; record its input revision SHA and freeze order. Then compare with the stored result. Never claim a blind/frozen review if answer content was exposed beforehand. In all cases actually independently rejudge every qid's four axes, including curricular method, full solution, Meta and visual necessity. A non-isolated attempt cannot be described as pre-disclosure independent; repair the input separation or leave precise stage continuation rather than fabricating R1 evidence.
4. **Repair in place:** when one semantic locus is defective, MINIMAL_REPAIR; if genuinely unrecoverable under current policy, ALIVE_REPLACEMENT. Re-evaluate changed qid and direct dependencies only, refresh solution/Meta/difficulty/visual and SHA/evidence, preserve unchanged good qids. Do not restart an already sealed stage without identified drift.
5. **Exact revision record:** 누적 검수기록에 실제 qid별 검토 결과와 source/asset 및 검토한 작업본의 정확한 SHA를 기록한다. 미실행 검토나 기술 검사는 완료로 쓰지 않는다. 전환 후 stage별 validator/PASS 영수증은 만들지 않고, 최종 validator는 §6에서 한 번 실행한다. 최종 기술검사 실패는 실패 locus와 직접 영향 범위만 수정한다.

### 17.2 Four regression traps — qid-local decisions

- **Difficulty / Meta:** legacy \`level\` must be exactly \`하|중|상\`, not number/null. \`difficultyBucket\` is separately judged 1..5, not mechanically mapped from level. For *every qid*, verify L3/L4/RPM primary, \`crossConceptKeys\`, \`conditionKeys\`, \`integrationPattern\` against decisive steps and actual conditions; empty/\`NONE\` only after affirmative semantic judgment. A whole exam with all empty relational metadata is a **mandatory investigation signal**, never an automatic nonzero quota or automatic FAIL.
- **QUESTION_LAYOUT:** \`layoutTag\` is selected per stem/choices/complete math expression. Do not use \`stack\` in bulk or insert line breaks based on character counts, regex or formula fragments. Excess stack usage triggers targeted explanation of each affected qid; a large number itself is not an automatic FAIL. Keep original student stem and choices fidelity.
- **Student solution / notation:** a short solution must still show why each essential expression follows, intermediate substitution/calculation and final answer; longer text alone is not a PASS. Every subjective item retains its assessable decisive proof/steps. Use engine-safe LaTeX delimiters and commands for nontrivial math expressions/fractions/powers/derivatives/integrals; do not substitute plain Unicode superscripts/prime glyphs as a blanket math-layout shortcut. Student-facing explanations should read like teacher boardwork, not prose-only or answer-only.
- **Curriculum / source truth:** check *actual chosen solution method* against that exam's year, grade and course. A mathematically correct but out-of-scope method is defective (e.g. high-1 solution relying on double-angle tangent/advanced trigonometry); derive a permitted method by targeted repair. Never treat a Golden example from another curriculum as permission to transplant an advanced method.

Regression examples: \`24_매산여고_1학기_중간\` numeric level; \`24_금당고_1학기_중간\` null level/short basics; \`24_매산고_1학기_중간\` repeated stack; \`24_여수고_1학기_중간\` short subjective solutions; historical \`22_강남여고_1학기_기말\` all-empty relational Meta and out-of-curriculum q20; Codex \`20_매산여고_2학기_기말_고2_수학II\` uses Unicode-style math as a **notation caution**, not a model output to copy. These are quality examples, not claims that each belongs to the current GPT2 campaign.

### 17.3 역할과 render 분리

CREATE는 완성된 학생용 결과를 만들고 R1은 독립 판정·수정한다. R2는 blind 답 검수를, R3는 변경·미해결·직접 영향 범위와 최종 구조 확인을 맡는다. MASTER는 최종 기술검사와 게시를 맡는다. GPT는 Archive Engine을 캡처하지 않는다. Codex render는 GPT 실행 선행조건이나 CREATE/R1 품질 검수를 대신하지 않는다. 정적 검토를 `RENDER_PASS`로 기록하지 않는다. 임의 글자 수 기준, Meta quota, 전체 재검 반복은 두지 않는다. A/B/C 고정 배정과 시험지당 한 번에 한 단계·한 실행자를 유지한다. 앞선 실행이 불확실하면 확인한 뒤 이어가고 중복 시작하지 않는다.

### 17.4 누적 검수기록 항목

CREATE/R1은 검토한 `examUid`와 revision SHA, qid 범위, 독립 검토 및 Golden 근거, 변경 qid와 직접 영향, 발견·수정·미해결 사항을 한 누적 검수기록에 남긴다. 별도 PASS/evidence 파일이나 stage별 closure receipt는 만들지 않는다. 최종 기술검사 결과는 §6에서만 기록한다.

## 2026-10-08 — Direct assignment completion scope

이 단락은 전환 전의 현재 consumer 흐름과 GPT 예약 외 Archive 실행에 적용된다. GPT 예약 2.0의 간소화 전환 후에는 §0–7이 단계 산출물·기술검사·게시 순서를 정한다. 이 문구는 학생용 main 자료 사용 정책에 승인 단계를 추가하지 않는다. 모든 실행선에서 실제 수행하지 않은 검수·렌더·게시를 완료로 기록하지 않는다.
