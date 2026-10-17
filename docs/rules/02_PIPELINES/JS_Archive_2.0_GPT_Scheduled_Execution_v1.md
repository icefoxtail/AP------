## CURRENT CANONICAL PROMPT ENTRY — 2026-10-17 v1.0.0

이 실행계약은 품질·라이브러리 stage 계약으로 계속 유효하되 **새 GPT 예약을 개설하거나 기존 프롬프트를 변경할 때 복사할 최신 공용 본문**은 [gpt-reservation/README_CURRENT.md](gpt-reservation/README_CURRENT.md)와 [역할별 CURRENT 파일 5개](gpt-reservation/README_CURRENT.md#3-역할-파일-5개--복사수정은-여기서-시작)다. 캠페인별 소스/manifest·현재 예약 권한·ON/OFF는 기존 정본을 따르고 모든 문서 실제 열람 증거 및 qid 검수·Meta 직접 수리·Golden 실증거와 OWN_AND_FIX를 반영한다. 2026-10-17 현재 예약 프롬프트는 별도 실제 업데이트가 확인된 것만 유효; 본 문서 수정으로 과거 런타임까지 자동 교체됐다고 주장하지 않는다.

# JS Archive 2.0 — GPT Scheduled Execution Contract v1

status: CURRENT COMMON POLICY / ALL GPT SCHEDULED CAMPAIGNS; document-only update
qualityContractVersion: JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006
currentCampaignId: H1_GPT2_20261006
parent quality authority: JS_Archive_2.0_Common_Quality_Contract_v1.md
scheduled prompt copy source: JS_Archive_2.0_GPT_Scheduled_Prompt_Template_v1.md
campaign authority: JS_Archive_2.0_GPT_Campaign_Generation_v1.md

## CURRENT HARD — NEW14 R1·R2 proactive explanation enrichment / virtually uncapped (2026-10-17)

Only `SOURCE_ONLY_INTAKE14_20261016`: R1 independent source-only answer **and derivation** must be physically frozen before viewing stored answers/solutions; after compare R1 actively repairs student-explanation math, missed calculations, logical reasons, boundaries, curriculum and needed diagrams rather than stopping at correct-answer parity. R2 is separately responsible for **all reviewable qids' actual current solutions** as a student/teacher-board follow-through: inspect decisive equations, intervening calculations, selection reasons, cases/distractors/inequality endpoints, final statement and necessary actual SVG/PNG. Actively upgrade where an explanation skips essential mathematical reasoning. Each qid gets `UPGRADE` with before→after/student benefit; `KEEP` only with genuine calculation-following/sufficiency evidence; or `NOT_REVIEWED/EVIDENCE_DEBT` stating what was not verified. Full-R2 new blind freeze is not required, only source-based independent solve for suspicion/high risk.

**No cap** on upgraded questions within the chosen exam, solution word/line/formula counts, intermediate board steps, or pedagogically necessary visuals; answer a hard problem with the detail a teacher would actually write, not fixed brevity/2-line answers. Also no mandatory modification quota, ornamental verbosity or needless rewriting of sound existing solutions. One run's limit is **one exam with substantive changes**, not 1–2 qids; time/input/writer limits persist. Real work + partial ledger + actual Library ID/version or bytes SHA remote readback must still be saved and routed even if not all qids receive thorough review; unreviewed parts are expressly marked, never quality PASS. No worker HOLD, no rewind, valid old freezes preserved. This section changes quality work emphasis only; nonblocking routing, scheduling, Git-readonly intermediate workers, and the latest supervisory-GPT final disposition authority remain in force.

## 0. Authority boundary and current application

이 문서는 **모든 GPT 제작·검수 예약 캠페인**에 공통 적용되는 운영 계약이다. campaignId, frozen manifest, stream roster/data, source authority와 과거 검수결과는 각 캠페인의 기존 정본을 그대로 유지한다. H1_GPT2_20261006 등 특정 캠페인의 identity나 배정을 이 공통화 때문에 재생성·재배치하지 않는다. Prompt copy source는 `JS_Archive_2.0_GPT_Scheduled_Prompt_Template_v1.md`; 대상 배정 authority는 `JS_Archive_2.0_GPT_Campaign_Generation_v1.md` 및 해당 캠페인의 frozen Git manifest다. Common Quality Contract와 이 문서 §§16–17의 문항 품질 기준은 계속 적용한다. Common Quality Contract §1은 GPT 예약이 R3 완료 패킷과 실제 검사 결과를 Library에 남기고, 별도 Work/Codex 출고 담당이 production JS·이미지·SVG를 일괄 출고하는 동일한 흐름을 정의한다.

이번 변경은 **계약 문서만** 수정한다. 실제 예약 prompt/consumer 지시나 validator 코드는 변경하거나 실행하지 않았으며, 문서 수정만으로 실제 예약 설정이 바뀌었다고 주장하지 않는다. 다만 과거의 “전환 전 구 consumer 유효” 문구는 중간 Git 쓰기·운영경로 복사·branch/commit/PR·Git writer lease를 단계 인계 관문으로 되살리는 근거가 될 수 없다. 실제 prompt/validator 정비 여부는 이 문서 편집과 별도로 기록한다.

`archive/tools/GPT2_ONE_SHOT_CLOSEOUT.md`와 `GPT2_CONNECTED_STDIO_HOST.md`는 선택형 CANARY 도구다. 새 기본 흐름의 선행조건이 아니며, 이 문서 변경은 해당 코드를 활성화하지 않는다.
## 1. 목표 흐름

모든 GPT 예약 campaign은 시험지별 **전체 Library 패킷**으로 `CREATE → R1 → R2 → R3`를 수행한다. 각 단계의 실제 검사·수정·잔여항목을 누적 검수기록에 남긴다. R3 완료 후 예약은 출고 대상인 production JS·이미지·SVG의 정확한 Library 파일 ID·revision/해시와 실제 수행한 검사 결과를 기록하고, 완료 패킷을 Library에 쌓는다. R3 완료나 Library 수납만으로 공식 PASS·Git 출고를 뜻하지 않는다. 별도 Work 또는 Codex 출고 담당이 완료 패킷을 모아 production JS·이미지·SVG만 일괄 push하고 main에 병합한다. GPT 제작·검수 예약은 직접 Git에 쓰지 않는다.

단계 인계에 중간 Git 저장, 운영 경로 복사, branch/commit/PR 생성, Git writer lease 취득을 요구하지 않는다. 원본 자산을 보충할 때 Git은 읽기 전용 source로 사용할 수 있다. Library 패킷은 각 단계가 이어서 작업할 수 있도록 유지하며, 한 패킷에는 한 시점에 한 작성자/수정자만 둔다. 다음 수신자와 인계 revision을 명시하고 동시 수정은 금지한다.

이 흐름은 독립 검수 기준, 정확한 버전·바이트 식별, 대상 배정, 변경 영향 범위, 최종 구조 확인을 낮추지 않는다. Library에 후보를 저장하거나 패킷을 완성한 사실만으로 품질 PASS를 부여하지 않는다. 수학적 정답, 의미 기반 Meta, 해설 완결성, Visual 필요성·정확성, 독립 검수는 각자 근거를 남기며, 미실행 검사는 `NOT_RUN`으로 남긴다. 미해결 항목도 숨기거나 PASS로 바꾸지 않는다. 기존 유효 증거는 원본을 보존하고 누적 기록에 링크해 승계한다. 증거의 삭제·위조·소급 승격은 금지한다. 다른 generation 증거는 current campaign 완료로 승계하지 않는다.
## 2. 대상과 작업 소유권

공통 절차는 모든 GPT 제작·검수 예약에 적용하지만 각 campaign의 `campaignId`, frozen manifest, A/B/C 배정·순서, source authority와 roster/data는 해당 정본대로 유지한다. 기존 H1/M3 campaign ID·roster·data 및 과거 검수결과를 이 문서 변경으로 바꾸지 않는다. 각 단계 예약은 Library 조회에서 다른 실행자가 진행 중인 패킷을 제외하고, 기존 누적기록의 동시수정 보호를 재사용한다. 진행 중 시험지는 위치·패킷·증거를 보존하며 정책 문구 변경만으로 다시 시작하지 않는다.

각 단계 예약은 별도 수동 인계 호출을 기다리지 않는다. 실행 시작 시 Library에서 직전 단계가 완료한 최신 패킷을 직접 조회하고, campaignId·stream·examUid와 file ID·revision 또는 revisionUnavailable일 때 실바이트 SHA-256으로 정확한 입력을 확인한다. 자기 단계에서 이미 처리한 패킷과 다른 실행자가 진행 중인 패킷은 기존 누적기록·동시수정 보호 표시에 따라 제외하고, 이어서 처리할 수 있는 패킷만 선택한다. 선택·처리 상태와 다음 단계 역할을 기존 누적 검수기록에 저장한다. Git manifest와 원본 자산은 읽을 수 있지만 중간 Git 쓰기나 별도 수동 인계 호출은 필요하지 않다.
## 3. Library 작업본과 누적 검수기록

시험지마다 Library의 전체 작업 패킷과 append-only 누적 검수기록을 유지한다. 단계별 복사본이나 별도 PASS/seal 영수증 파일은 만들지 않는다. 패킷은 작업본, 원본·필요 시각 자산, 관계 자료와 검수기록을 포함한다. 각 파일은 Library file ID와 version/revision으로 식별하고, revision을 제공하지 않거나 재조회할 수 없을 때에만 정확한 실바이트 SHA-256을 기록해 구분한다. 필요한 snapshot은 대체 식별 수단이 없을 때만 보존한다. 누적 기록에는 campaignId/stream/examUid, stage, 작성자·검수자, 시각, input/output file ID·revision 또는 SHA-256, 검토범위, 발견·수정·잔여항목, 다음 수신 단계·수신자와 인계본을 적는다. 패킷별 단일 수정자와 명시된 인계본으로 동시 수정을 막는다. Git은 원본 자산을 읽어 패킷을 보충할 수 있으나 중간 쓰기는 요구하지 않는다.

누적 기록은 각 단계의 실제 수행 상태, 판단 근거, 유효한 선행 완료 기록 링크와 잔여항목을 보인다. 패킷 저장·수납 자체는 PASS가 아니다. 별도 단계 PASS receipt/seal은 만들지 않는다. 다음 단계 예약이 Library를 조회해 이 기록이 가리키는 정확한 최신 file ID+revision 또는 revisionUnavailable인 경우 실바이트 SHA-256을 직접 확인해 입력으로 가져간다. 별도 수동 인계 호출은 없다. 내용 변경 시 새 revision/해시를 기록하고 변경한 시험지의 직접 영향 단계만 재개한다. 다른 시험지나 영향 없는 단계를 되돌리지 않는다. 수학·Meta·해설·Visual·독립검수 결과는 각각 근거를 남기며 미실행은 `NOT_RUN`, 미해결은 그대로 표기한다.

**B13 단일 예약 파일럿의 revision 미노출 예외(2026-10-11):** Files 제공자가 작업본 version/revision을 반환하지 않으면 값을 임의 생성하지 않고 `revisionUnavailable=true`로 표기한다. 정확한 Library file ID와 현재 실바이트 SHA-256, 변경 없는 이미 보존된 이전 단계 snapshot의 file ID·실바이트 동일성을 기록해 해당 파일을 검수본 witness로 참조한다. 현재 B13은 R1/R2 JS 각각 41,496바이트, SHA-256 `3a2724f945dc99a4de2211149692dc12bf569d8922265c2770dccc5441a35969`, Git blob `fb3e9dbb84fa0b85aa5332ab30d29ebb2f9ee089`가 같음을 확인했다. 이 경우에 한하여 다음 단계는 `current file ID + 동일바이트 witness file ID + SHA-256`을 실질 revision 인수 근거로 사용한다. 기존 snapshot이 사용 가능하면 새 복제본을 만들지 않는다. 학생용 본문이나 기존 완료 단계가 달라진 경우에는 이 예외를 적용하지 않으며 변경 범위만 다시 결속한다. 이 예외는 최종 기술 validator·게시 gate 또는 B13 외 시험지·예약 정책을 완화하지 않는다.

## 4. CREATE / R1 품질 역할

**NEW14 2026-10-17 LATEST OVERRIDE — 무조건 작업 인계 / 최종 HOLD는 MASTER만

이 문단은 형님의 2026-10-17 최신 지시이며 `SOURCE_ONLY_INTAKE14_20261016` GPT Library 예약 5개에 한정된다. 아래/과거의 CREATE 전수 완성·검사 선행규칙이나 중간 단계 품질 마감 규칙보다 **단계 간 인계 시점**에 대해 우선한다. 다른 캠페인·Codex를 변경하지 않는다.

**ROUTED vs VERIFIED:** 모든 예약은 최선을 다해 담당 단계의 실물 문항·해설·시각 자료·Meta를 작성/수정하되, 누락된 발문·선지·답·해설·원본 PNG·SVG·UID·RPM·PT/TPL, 원본 모순, Golden/Negative 증거 부재, Node22 공식 검사 미실행, 학생 브라우저 미검사를 이유로 **다음 stage로 넘기는 것을 금지할 수 없다.** Library 실제 부분 JS/원본/자산/누적기록과 qid별 `MISSING_STEM/MISSING_CHOICES/MISSING_ANSWER/MISSING_SOLUTION/MISSING_PNG/MISSING_SVG/NOT_REVIEWABLE/EVIDENCE_DEBT/NOT_RUN`을 정확히 물리 저장·readback해 전달한다. 전달 완료 상태는 작업 라우팅이지 품질 PASS가 아니다. 기존 `CREATE_DONE` 등을 다른 소비자가 요구할 때에도 `ROUTED` alias임을 명시하고 실제 검수 PASS와 혼동하지 않는다. 수학이나 원본을 추측으로 메우거나 허위 검증 결과를 작성하지 않는다.

**역할별 즉시 인계:** CREATE(:00) `CREATE_ROUTED/READY_R1` → R1(:12) 가능 문항만 독립 blind freeze-before-compare, 누락 입력은 NOT_REVIEWABLE로 남기고 `R1_REVIEW_ROUTED/READY_R2` → R2(:24) 전 문항 가능한 해설·Meta·그림 수리 후 `R2_REVIEW_ROUTED/READY_R3` → R3(:36) 구조·공식 기술검사·시각자료·문항을 가능한 만큼 수리하고 `R3_REVIEWED/READY_MASTER_DECISION` → **MASTER(:48)만 최종 `FINAL_HOLD` 또는 실제 근거가 다 충족된 `R3_PASS/RELEASE_READY`를 결정한다.** CREATE/R1/R2/R3 예약은 HOLD를 판단·발행하거나 이전 단계로 되돌리거나 downstream 수납을 거부하지 않는다. 실제 패킷 저장/원격 readback 불가나 다른 worker의 동시 수정 충돌을 성공으로 위조하지 말고 기록하고 다른 eligible 작업을 계속한다. MASTER는 최종 검수부채를 직접 수리한 뒤 남은 결함의 정확한 qid와 재수리 행동을 기록하며 다른 시험지 흐름을 막지 않는다.

**불변:** 유효한 기존 PASS/freeze 보존, R1 독립성 준수, 학생용 최종 공개 시 실제 완전한 문항/정답/해설/필수 그림과 검증 필수, 한 실행 실질 수정 최대 한 시험지, Library ID/version 또는 실바이트 SHA 결속, 예약 자체 OFF 금지, GPT 예약 중간 Git 쓰기·PR·main·배포 금지. 최종 MASTER 결정 후 Git 출고는 별도 Work/Codex에서 처리한다.

그 외 GPT 캠페인의 CREATE는 Common Quality Contract와 §§16–17에 따라 전 qid를 직접 풀어 해당 교육과정 안의 정답·논리적으로 완성된 해설 초안을 만들고, source identity·QUESTION_LAYOUT·학생용 content/choices·의미 기반 Meta·난이도·Visual 및 실제 에셋을 결속한다. 중간 계산·조건을 쓰는 이유·보조선 목적과 논리 연결을 학생에게 설명한다. Library ID+revision 또는 정확한 실바이트 SHA-256과 근거를 누적 기록한다.

R1은 정답·해설·다른 검수자의 답을 보지 않는 별도 세션에서 완전한 학생 지문·보기·필수 그림으로 전 qid 독립 답과 풀이 근거를 먼저 append·저장·동결하고 이후 저장 정답·해설과 비교한다. CREATE 판정을 승계하지 않고 전 qid 수학·해설·Meta·Visual과 실제 풀이의 연도·학년·과목 교육과정 적합성을 판단해 최종 해설 Library ID+revision 또는 실바이트 SHA-256에 결속한다. 중간 계산·조건의 이유·보조선 목적·논리 연결을 적극 개선 검토하고, 문항별 부족점·수정 전후·학생 이점 또는 무수정 충분성 근거를 기록한다. 기술 validator 실행 결과나 `NOT_RUN`은 독립 풀이·수학·교육과정 검수 완료를 대신하지 않는다. 수정 qid·직접 영향만 재확인하며 검수 순서 미준수는 완료로 표시하지 않는다.

## 5. R2 독립 해설 개선 검토

R2는 R1과 분리된 검수자가 전 qid의 완전한 최신 학생 입력(content/choices/필수 그림)과 **현재 해설**을 학생 관점에서 읽고 핵심 계산·대입·논리·표기·교육과정 적합성을 검산한다. 중간 계산, 조건을 쓰는 이유, 보조선 목적, 학생이 막히는 연결을 적극 개선 검토한다. qid별 부족점, 실제 수정 전후와 학생 이점 또는 무수정 충분성 근거, 최종 해설 identity를 기록한다. 수정량 quota는 없다. 정답 불일치·의심·고위험·해설 정확성 우려에는 원문/보기에서 해당 qid를 독립 재풀이한다. 새 R2는 전 qid blind 답 freeze를 요구하거나 새 검수를 blind로 표시하지 않는다. 기존 blind freeze·유효 검수는 이력으로 보존하며 R1 전체 감사·진행중 작업의 중복 재배정을 금지한다.

새로 수정하는 학생용 해설 설명은 한국어 정식 교육과정 용어로 작성하고 변수·점·좌표·함수 등 표준 수학기호와 필수 그림·점 라벨을 유지한다. SVG에 raw TeX/caret/debug 문구를 그대로 노출하지 않고 필수 수식은 지원되는 본문 조판으로 옮긴다. 미변경 문항을 일괄 재작성하지 않는다.

## 6. R3 완료 패킷과 별도 일괄 출고

R3는 누적 기록의 변경 항목, 미해결 항목, 직접 영향 범위와 전체 구조를 확인하고 실제 수행한 검사의 결과를 기록한다. 변경되지 않은 qid의 전수 의미 재검을 반복하지 않으며, 미실행 항목은 `NOT_RUN`으로 남긴다. 예약은 production JS·이미지·SVG, 정확한 Library identity, 검사 결과와 잔여항목을 출고 후보 패킷으로 남긴다. `R3_RELEASE_READY`는 패킷 준비 상태이지 Git 출고나 전체 품질 PASS가 아니다.

별도 Work 또는 Codex 출고 담당이 Library의 완료 패킷과 실제 검사 기록을 모아 production JS·이미지·SVG만 일괄 push하고 main에 병합한다. 예약은 이 일괄 출고를 위해 필요한 파일 ID·revision/해시, 검사 결과, 잔여항목을 남기며 Git 쓰기·branch/commit/PR·운영 경로 복사·Git writer lease를 수행하지 않는다. 출고 담당은 실제 release/원격 확인 결과를 Library에 기록한다. 실패한 검사·미해결 항목은 출고 완료로 표시하지 않고 Library 패킷의 직접 영향 범위로 돌려 처리한다.

단계별 Library 동시성은 패킷의 단일 수정자와 누적 기록의 기존 보호를 따른다. 별도 Work/Codex 출고 담당은 예약의 Library 완료 패킷을 취합해 production JS·이미지·SVG를 일괄 출고하며, GPT 예약 단계의 작성자·검수자와 구분된다.
## 7. 품질 상태와 역사 기록

누적 검수기록이 stage 진행과 미해결 사항의 실행 authority다. 현재 campaign에서 검수본이 동일하고 이후 수정이 해당 검수 범위에 영향을 주지 않아 유효한 기존 PASS/evidence는 원본을 보존해 링크로 승계한다. 완료된 단계는 반복하지 않고 다음 미완료 단계부터 잇는다. 다른 generation의 PASS/evidence는 승계하지 않는다. 기존 실패·미해결 evidence도 보존한다. 별도 stage PASS receipt나 반복 seal은 만들지 않는다.

과거 consumer의 “전환 전 구방식 유효” 문구는 현재 공통 계약에 중간 Git 쓰기 관문을 추가하지 않는다. 문서 정책과 실제 예약 prompt/consumer/validator의 변경 상태는 별도로 기록한다. 이 문서 편집은 실제 예약 prompt나 validator의 변경·검증 완료를 뜻하지 않는다. 실제로 수행하지 않은 검수, 검사, 독립검토, 기술검증과 Git 출고는 `NOT_RUN` 또는 미완료로 남긴다.

## 16. CREATE/R1 semantic quality acceptance — 2026-10-08

CREATE와 R1은 전 qid에 아래 3가지 학생 노출 품질을 확보한다. R2/R3/출고 담당에 CREATE·R1의 전체 재검 책임을 전가하지 않는다. 현재 campaign의 검수본이 그대로이고 후속 수정이 해당 범위에 영향이 없는 유효한 CREATE/R1 완료 기록은 반복하지 않는다.

1. **Difficulty and Meta**: legacy `level`의 canonical `하|중|상` 문자열 필수(`null`·숫자 불허); `difficultyBucket` 1~5 별도 판정. L3/L4/RPM/crossConceptKeys/conditionKeys/integrationPattern은 실제 풀이 기반 semantic 판정.
2. **Question layout**: `layoutTag`는 의미적 조판 단위에 맞춰 문항별 결정한다. `stack` 일괄 적용 및 기계적 줄바꿈을 금지한다. 다수 `stack`은 해당 문항별 재확인 신호이지 획일적인 비율 제한은 아니다.
3. **Solution educational completeness**: 쉬운 문제도 조건→식 설정→중간 계산→정답 연결을 설명하고, 서술형은 결정적 논증과 풀이 전개를 보존한다. 평균 글자수는 진단 신호이지 품질 PASS 근거/고정 최소 자수 기준이 아니다.

R1은 CREATE의 verdict를 독립 재확인하며 형식 유효성만으로 semantic PASS를 내리지 않는다. 신규 gate 구현 없이 실제 qid별 작업/evidence에 반영하고, 발견된 결함은 same-stage targeted repair로 처리한다. 2026-10-08 회귀 대상: 24 매산여고·24 금당고·24 매산고·24 여수고. 기존 PASS를 자동 무효화하거나 전체 rewind하지 않으며, 이 네 시험지는 별도 핀포인트 보정 대상으로 취급한다.


## 17. NEXT-RUN QUALITY FLOOR — GPT CREATE/R1 quality (2026-10-08)

§16–17의 실제 CREATE/R1 품질 기준은 모든 GPT campaign에 공통 적용된다. 아래 실행 순서의 보관·버전 식별은 Library 패킷과 누적 검수기록에 반영한다. 단계별 validator/PASS receipt/seal을 만들지 않는다. 기존 consumer 문구는 중간 Git 인계 관문을 되살리지 않으며, 실제 예약 prompt/validator 변경 여부는 이 문서 계약과 별도로 관리한다. 완료 시험지를 일괄 되감지 않고 결함은 영향 범위만 유지·수정한다.

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

CREATE는 직접 풀이와 교육과정 내 완결된 해설을 만들고 R1은 답·이유의 독립 동결 후 교육과정/설명 검수·수정을 한다. 신규 R2는 전 qid의 현재 해설을 학생 관점에서 검산·개선하며 고위험·불일치·의심 문항만 독립 재풀이한다. 과거 blind 이력은 보존한다. R3는 변경·미해결·직접 영향 범위와 최종 구조 확인, 출고용 패킷·실제 검사 결과 기록을 맡는다. 별도 Work/Codex 출고 담당이 Library 완료 패킷의 production JS·이미지·SVG를 일괄 출고한다. GPT 예약은 직접 Git에 쓰지 않고 Archive Engine도 캡처하지 않는다. Codex render는 GPT 실행 선행조건이나 CREATE/R1 품질 검수를 대신하지 않는다. 정적 검토를 `RENDER_PASS`로 기록하지 않는다. 임의 글자 수 기준, Meta quota, 전체 재검 반복은 두지 않는다. A/B/C 고정 배정과 시험지당 한 번에 한 단계·한 실행자를 유지한다. 앞선 실행이 불확실하면 확인한 뒤 이어가고 중복 시작하지 않는다.

### 17.4 누적 검수기록 항목

CREATE/R1은 검토한 `examUid`와 Library file ID+revision, qid 범위, 독립 검토 및 Golden 근거, 변경 qid와 직접 영향, 발견·수정·미해결 사항을 한 누적 검수기록에 남긴다. 별도 PASS/evidence 파일이나 stage별 closure receipt는 만들지 않는다. 최종 기술검사 결과는 §6에서만 기록한다.

## 2026-10-08 — Direct assignment completion scope

이 단락은 GPT 예약 외 Archive 실행에 적용된다. 모든 GPT 예약 2.0 campaign은 §0–7의 Library 작업·검수·R3 완료 패킷 기록 및 별도 Work/Codex 담당의 일괄 출고 순서를 따른다. 이 문구는 학생용 main 자료 사용 정책에 승인 단계를 추가하지 않는다. 모든 실행선에서 실제 수행하지 않은 검수·렌더·게시를 완료로 기록하지 않는다.
