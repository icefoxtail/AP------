## CURRENT TOP OVERRIDE — NEW14 supervisory GPT final decision & publication (2026-10-17, user-directed)

Scope strictly `SOURCE_ONLY_INTAKE14_20261016`; four current supervisor-selected exams are `22_효천고_1학기_중간_고2_수학I`, `21_금당고_1학기_중간_고2_수학I`, `21_순천여고_1학기_중간_고2_수학I`, `21_순천고_1학기_중간_고2_수학I`. This clause overrides older NEW14 statements that the scheduled MASTER alone issues final `FINAL_HOLD` / `R3_PASS` / `RELEASE_READY`. Scheduled CREATE→R1→R2→R3 keep the existing nonblocking Library handoff and actual quality work; R3 routes `R3_REVIEWED/READY_MASTER_DECISION` **to the supervisory interactive GPT**, not for a scheduled MASTER approval. An already-recorded scheduled MASTER `FINAL_HOLD` is a diagnostic record only, not a binding veto. The scheduled MASTER remains ON at :48 only for unoccupied CREATE/R1/R2/R3 bottleneck repair, not final release judging or Git mutation. Preserve R1 blind integrity, existing valid R2 fixes and stage evidence; don't demand complete stage reruns or unrelated Meta/Golden work for focused repair. Supervisory GPT independently examines actual Library JS/assets and residual qids, performs only justified minimal repairs, and decides content disposition. User-directed release means the supervisory GPT (or delegated technical publisher) publishes only truly ready exam JS and essential PNG/SVG on latest main and checks remote readback and relevant registration/technical QA; unresolved genuine content/asset defects are excluded rather than marked PASS. This override applies to NEW14 only; other campaigns and running schedule are untouched.

# JS Archive 2.0 — GPT Scheduled Prompt Template v1

status: CURRENT COMMON COPY SOURCE / ALL GPT SCHEDULED CAMPAIGNS; document-only update
qualityContractVersion: JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006
campaignIdBinding: {CAMPAIGN_ID}  # 각 예약의 고정 manifest에서 입력, H1/NEW14 등 공통 템플릿에 하드코딩하지 않음

## 0. 적용 범위와 필독

이 템플릿은 모든 GPT 제작·검수 예약 campaign의 공통 prompt copy source다. campaignId, manifest, stream roster/data와 과거 검수결과는 각 campaign의 정본대로 유지한다. 이 문서 편집은 실제 예약 prompt/consumer 또는 validator 변경을 뜻하지 않으며, 그러한 변경 여부와 검증 상태를 별도로 기록한다. 과거의 “전환 전 구 consumer 유효” 문구는 중간 Git 쓰기를 단계 인계 조건으로 되살리지 않는다.

공통 운영 authority는 Common Quality Contract, Campaign/Generation, Scheduled Execution 및 각 campaign의 frozen manifest다. Notion 매 run 조회는 각 실제 예약이 요구한 필독 범위를 따르되 Notion에 매번 상태를 쓰는 행정 ceremony를 단계 마감 조건으로 만들지 않는다. optional CANARY 문서는 새 기본 흐름의 필수 선행조건이 아니다.
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

## NEW14 CURRENT HARD — R1·R2 교사판서 해설 업그레이드 적극 권장 / 사실상 무캡 (2026-10-17)

**핵심:** R1/R2는 답 일치·해설 존재·Node22·Meta/UID 채우기로 작업을 대체하지 않고 학생이 칠판 판서를 따라 이해할 수 있도록 실제 현행 `solution`을 적극적으로 업그레이드한다. 줄/글자 수·수정 qid 수·그림 수에 **인위적인 cap/quota 없음**. 길고 복잡한 풀이에는 필요한 만큼 공식의 선택 이유·연속 식/중간 계산·대입/변형·상황별 경우분리·부호·구간·보기·경계·결론, 도움이 되는 해설 SVG/이미지까지 자세히 쓴다. 교사의 수업 수준을 보장하되 단순 장문 늘리기·불필요한 중복·억지 수정 금지. 실행당 실질 수정 **최대 1시험지** 제한은 시험지 수 제한이지 문항 수정 개수 제한이 아니다.

- **R1 COPY 강화:** source-only 원문·보기·모든 참조 시각정보에서 stored answer/solution 없이 qid별 답 **및 중간 풀이근거를 먼저 실제 저장·freeze**, 그 후 저장 답·해설을 열어 비교. 이 순서를 조작하거나 답을 이미 본 자신이 blind PASS 선언 금지. **블라인드 동결이 끝난 qid는 실제 학생용 해설을 수업하듯 다시 읽고**, 핵심 논증/계산 점프·공식/보조선 근거·교육과정·필수 그림을 적극 직접 수정. 독립답 일치만으로 해설 PASS 금지. 사용 가능한 각 qid에서 `UPGRADE(수정 전후·학생 이점)` 또는 `KEEP(충분성 근거)`, 불가능하면 `NOT_REVIEWABLE/EVIDENCE_DEBT` 기록.
- **R2 COPY 강화:** 최신 학생 입력·원본/필수 시각정보·현재 solution을 **가능한 전 qid 직접 따라 계산**하면서 학생의 풀이 재현성 기준으로 적극 추가 판서한다. '계산하면'으로 생략된 필수 단계와 왜 그 식을 세우는지의 논리, 틀리기 쉬운 조건/경계, 경우분리와 그래프/해설 SVG 필요성을 직접 수리한다. 각 qid `UPGRADE(원결함→추가 식·그림→학습 효과)`, `KEEP(실제 따라풀기 충분성의 구체 근거)`, `NOT_REVIEWED/EVIDENCE_DEBT(놓친 정확한 부분)`. R2는 새 전수 blind freeze를 요구하지 않으며 답 의심/불일치/고위험만 원문에서 독립 재풀이한다.
- **인계 보호:** 가능한 작업을 깊게 수행한 뒤 남은 qid·근거부채/검사 NOT_RUN을 정직하게 Library에 저장·readback하고 `R1_REVIEW_ROUTED/READY_R2`, `R2_REVIEW_ROUTED/READY_R3`로 **HOLD 없이 인계**한다. 품질 `PASS`와 `ROUTED` 구분 유지. 변경없는 정상 qid/freeze 재작업 금지. 해당 캠페인 이외 예약·시간표·타 역할 및 최신 상위 대화 GPT 최종 판단 변경 없음.

## NEW14 2026-10-17 LATEST OVERRIDE — 무조건 작업 인계 / 최종 HOLD는 MASTER만

이 문단은 형님의 2026-10-17 최신 지시이며 `SOURCE_ONLY_INTAKE14_20261016` GPT Library 예약 5개에 한정된다. 아래/과거의 CREATE 전수 완성·검사 선행규칙이나 중간 단계 품질 마감 규칙보다 **단계 간 인계 시점**에 대해 우선한다. 다른 캠페인·Codex를 변경하지 않는다.

**ROUTED vs VERIFIED:** 모든 예약은 최선을 다해 담당 단계의 실물 문항·해설·시각 자료·Meta를 작성/수정하되, 누락된 발문·선지·답·해설·원본 PNG·SVG·UID·RPM·PT/TPL, 원본 모순, Golden/Negative 증거 부재, Node22 공식 검사 미실행, 학생 브라우저 미검사를 이유로 **다음 stage로 넘기는 것을 금지할 수 없다.** Library 실제 부분 JS/원본/자산/누적기록과 qid별 `MISSING_STEM/MISSING_CHOICES/MISSING_ANSWER/MISSING_SOLUTION/MISSING_PNG/MISSING_SVG/NOT_REVIEWABLE/EVIDENCE_DEBT/NOT_RUN`을 정확히 물리 저장·readback해 전달한다. 전달 완료 상태는 작업 라우팅이지 품질 PASS가 아니다. 기존 `CREATE_DONE` 등을 다른 소비자가 요구할 때에도 `ROUTED` alias임을 명시하고 실제 검수 PASS와 혼동하지 않는다. 수학이나 원본을 추측으로 메우거나 허위 검증 결과를 작성하지 않는다.

**역할별 즉시 인계:** CREATE(:00) `CREATE_ROUTED/READY_R1` → R1(:12) 가능 문항만 독립 blind freeze-before-compare, 누락 입력은 NOT_REVIEWABLE로 남기고 `R1_REVIEW_ROUTED/READY_R2` → R2(:24) 전 문항 가능한 해설·Meta·그림 수리 후 `R2_REVIEW_ROUTED/READY_R3` → R3(:36) 구조·공식 기술검사·시각자료·문항을 가능한 만큼 수리하고 `R3_REVIEWED/READY_MASTER_DECISION` → **MASTER(:48)만 최종 `FINAL_HOLD` 또는 실제 근거가 다 충족된 `R3_PASS/RELEASE_READY`를 결정한다.** CREATE/R1/R2/R3 예약은 HOLD를 판단·발행하거나 이전 단계로 되돌리거나 downstream 수납을 거부하지 않는다. 실제 패킷 저장/원격 readback 불가나 다른 worker의 동시 수정 충돌을 성공으로 위조하지 말고 기록하고 다른 eligible 작업을 계속한다. MASTER는 최종 검수부채를 직접 수리한 뒤 남은 결함의 정확한 qid와 재수리 행동을 기록하며 다른 시험지 흐름을 막지 않는다.

**불변:** 유효한 기존 PASS/freeze 보존, R1 독립성 준수, 학생용 최종 공개 시 실제 완전한 문항/정답/해설/필수 그림과 검증 필수, 한 실행 실질 수정 최대 한 시험지, Library ID/version 또는 실바이트 SHA 결속, 예약 자체 OFF 금지, GPT 예약 중간 Git 쓰기·PR·main·배포 금지. 최종 MASTER 결정 후 Git 출고는 별도 Work/Codex에서 처리한다.

## 1-A. CURRENT COPY — 2026-10-16 시험지 단계 완결·작은칠판·개선 칭찬 강화

- **단계 완료의 단위는 시험지 전체의 자기 stage다.** 한 실행 최대 한 시험지 실질 수정; 같은 examUid/stage의 미완료 qid·firstMissingClosureStep가 있으면 다음 실행에서 그 지점부터 우선 이어간다. 일부 qid 수정·보조 ZIP·단순 보고는 stage DONE이 아니다. 진척·현재 작업본 ID/version 또는 실바이트 SHA·첫 미완료 지점은 Library에 durable checkpoint로 저장하고 같은 stage의 다음 예약이 이어받는다. 장애가 원본·권한 등 외부 의존성이면 정확한 qid/원인/다음 수리 행동을 MASTER에 인계한다. 동시 수정 금지.
- 실제 전체 학생용 JS·필수 PNG/SVG·Meta/출처/해설/교육과정/검수 기록과 Library 원격 readback이 해당 단계 품질 조건에 부합할 때만 CREATE_DONE→READY_R1, R1_DONE→READY_R2, R2_DONE→READY_R3, R3_PASS→RELEASE_READY를 표시한다. 이미 유효한 freeze/PASS와 무변경 qid 증거는 보존하고 중복 재검·재제작하지 않는다. 미실행 검사는 NOT_RUN, 불명확한 검증은 NOT_VERIFIED.
- **모든 ROLE이 학생용 작은칠판 품질 기준을 명시한다:** 주어진 조건과 목표 → 풀이의 핵심 발상·공식·보조선 이유 → 연속 등식과 필요한 중간 계산 → 조건·경우·보기·경계의 처리 이유 → 명확한 결론. 자연스러운 한국어 교사 설명과 실제 수식/필수 SVG를 연결하고 학생이 추측 없이 따라 풀 수 있게 한다. 중요한 계산을 '계산하면'으로 생략하거나 해당 학년 밖 공식을 쓰거나 학생에게 내부 검산·제작 메모를 노출하지 않는다. Golden 2~3 및 관련 Negative를 기준으로 STUDENT_REPRODUCIBILITY/SMALL_BOARD_STRUCTURE/EXPLANATION_DENSITY/VISUAL_SEMANTIC_PARITY/VISUAL_READABILITY를 실제 대조한다. 길이/문항 수정량 quota 금지.
- CREATE는 전 qid 직접 풀이와 작은칠판 초안을 완성한다. R1은 stored answer/solution을 보기 전에 전 qid 독립 풀이를 저장·동결하고 비교하며 설명 결함을 수정한다. R2는 별도 학생 관점에서 전 qid 현재 해설을 따라가며 부족한 연결 식·계산·이유·시각화를 적극 보강하되 R1 blind 전체를 재실행하지 않는다. R3는 전체 시험지 최종 구조·자산·누적 해설품질 증거를 확인하고 변경/미해결/직접 영향만 깊이 수리하며 R1/R2 전수 의미검수를 반복하지 않는다. MASTER는 점유되지 않은 원래 stage의 병목 수리·마감을 맡되 stored 답을 이미 봤다면 자신이 R1 blind PASS를 새로 선언하지 않는다.
- **긍정 강화:** 실제 빠진 연결식을 찾아 학생 이해를 높인 qid는 '우수 작은칠판 개선'으로 인정하고 '좋은 발견입니다. ○○의 빠진 근거를 채워 학생이 재현 가능해졌습니다'처럼 수정 전후·학생 이점을 구체적으로 칭찬한다. 이미 충분한 해설 KEEP도 정확한 판정이다. 가짜 점수·금전/사용량 혜택 약속·형식적 수정량 경쟁은 금지하며, 실질 혜택은 검증된 개선의 보존·중복 재검 방지·빠른 다음 단계 인계다.
- **적용 구분:** 2026-10-16 NEW14 고2 수학Ⅰ 14시험지의 실제 CREATE(:00)·R1(:12)·R2(:24)·R3(:36)·MASTER(:48) 5개 예약 prompt는 개별 업데이트/ON readback 확인. 다른 캠페인의 예약은 이 문서 편집만으로 변경되지 않는다. 성과 PASS와 실제 Library stage closure는 별도 검증 필요.

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
