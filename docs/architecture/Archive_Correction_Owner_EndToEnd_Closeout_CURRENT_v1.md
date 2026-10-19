## CURRENT 사용자 지정 출고 감독 수납 — R3 인계 상태 단독 차단 금지 (2026-10-19)

사용자가 대상 시험지와 Git `main` 병합을 명시적으로 맡겼으면, 지정된 Codex/Work 출고 실행자는 그 업무의 **감독 검토·출고 직접 차단 결함 최소 수리·병합·요청된 Drive DONE 마감**을 수납한다. `SUPERVISORY_REVIEW_REQUIRED`, `PENDING_SUPERVISOR_DECISION`, `R3_REVIEWED`, `readyForUnattendedMerge=false`, `qualityPass=false`, `NOT_RUN` 상태값만을 근거로 사용자에게 별도 승인자를 다시 요청하거나 전체 배치를 PR 0건으로 종료하지 않는다. 이는 사용자 승인 없는 자동 출고 허용 또는 거짓 품질 승격이 아니다. 실제 학생 답·해설·원본·필수 asset/Meta 오류는 해당 examUid에서 근거를 대조하고 필요한 최소 수정과 변경 영향 검증을 수행하며, 해결 불능인 **개별 시험지만** 실제 차단으로 분리한다. 다른 독립 시험지는 진행한다.

구분: `GIT_MAIN_MERGED` + Drive `DONE` (사용자가 지정한 Git 운영병합 출고함 마감) ≠ 전체 소비자 인덱스/브라우저 검증 완료 `MAIN_DONE` 또는 `PUBLISHED_VERIFIED`. CI/Pages/Chrome을 이번 업무에서 제외했다면 `CI_DEFERRED` 및 `NOT_VERIFIED`로 사실대로 남긴다. 기존 §4의 **전체 출시 의뢰**에 대한 검증 의무는 변함없고, 사용자 범위가 `운영병합만`일 때만 이 별도 종료 조건을 적용한다. [MAIN_FIRST 정본](../operations/Archive_MAIN_FIRST_CI_DEFERRED_CURRENT.md)과 함께 적용.

## CURRENT 사용자 지정 종료조건 오버라이드 — MAIN 먼저, CI는 별도 업무 (2026-10-18)

사용자가 **`main 운영병합만` 또는 `CI 수리는 나중에 별도 지시`**라고 명시한 출고 작업에서는 Git main 병합 및 원격 파일/SHA 확인을 먼저 완료한다. CI running/fail/unexecuted는 Git 병합 여부를 좌우하는 새로운 품질 승인 게이트가 아니다. 해당 출고 담당은 CI 결함 수리·CI 검사 완화·공통 코드 개편·기존 시험지 전체 재검을 자동 추가하지 않는다. `GIT_MAIN_MERGED`, `CI_DEFERRED`, `studentDeploymentStatus`는 별도로 표기하고 학생 사이트 출시 PASS를 주장하지 않는다. 아래 전체 publication/Chrome 완료 규칙은 사용자가 등록·학생 배포까지 맡긴 별도 요청에 그대로 적용한다. GitHub가 병합을 기술적으로 거절하는 경우에는 플랫폼 오류만 정확히 기록하며 강제 push/보호 해제 금지.

자세한 계약: [Archive MAIN_FIRST / CI_DEFERRED](../operations/Archive_MAIN_FIRST_CI_DEFERRED_CURRENT.md)

# Archive / ALIVE 수정 AI 책임·Meta 확장·출시 마감 규정 — CURRENT v1.0

> 2026-10-09 원장 직접 지시. JS Archive·ALIVE Generated·문제은행의 제작/검수/수정/출판 담당 GPT 및 Codex 운영 실행자에게 적용. 이 문서는 **품질 추가 승인 단계가 아니라 기존 사용자 지시의 실행 책임·완료조건**을 고정한다. 사용자 최신 명시 지시가 최우선이다.

## 1. 최상위 실행 계약 — 보고서가 아니라 실제 수정·운영 마감

1. 최신 사용자 지시의 **대상·작업 종류·종료 조건**이 우선한다. 기존 문항의 한정 수정은 승인된 qid/파일/필드와 필수 직접 의존 부분만 **결함 확인 → 최소 수정 → 필요한 영향 검증 1회 → 지정된 종료 조건**으로 닫는다. 실제 실패·추가 수정이 있을 때만 영향 부분을 재검한다. 전체 제작·전수 검수를 명시한 경우에만 해당 전체 절차를 적용하며, 한정 수정을 CREATE/R1/R2/R3 자동 재진입이나 unchanged 시험지 전체 재풀이로 확대하지 않는다. 출시·main 반영까지 맡긴 경우(적용 가능한 기존 사용자 지시 포함)에는 해당 승인 범위의 **필요한 Meta 등록 → Source/Consumer/index 출판 → main 반영 → 원격 readback → 필요한 학생 화면 기술 QA → 완료 기록**까지 책임진다. 패치·커밋·draft PR 등 명시된 종료 조건과 단계 분할·보류·제외 지시를 우선한다.
2. **Git main에 파일이 있다고 출시 검증을 끝낸 것이 아니며, 사후 기술 검사를 새 "품질 인증" 또는 사용자 재승인으로 재명명하지 않는다.** 학생 화면 검증은 기존 출시의 기술적 QA이며 처음부터 작업자가 수행한다. main 기반 Chrome/브라우저 워크플로가 필요하면 병합 후 해당 workflow/동등한 학생 실제 런타임을 실행·결과 확인하고, 실패하면 바로 수정→증분 병합→재확인한다.
3. **수정 담당 AI의 기본값은 승인 범위 안의 직접 해결(OWN_AND_FIX)**이다. 범위 밖 발견사항은 보고만 하며 확장은 사용자 승인을 받는다. 정답·해설·발문·오답경로·태그·Meta·SVG·asset·DB/index·Chrome 결함을 발견한 담당자는 자신의 승인된 locus를 수정하고 적절한 실제 도구 실행까지 닫는다. "미확정/나중에/추후 작업자가/NOT_TESTED"라고 기록하는 것만으로 일반적으로 종료하지 않는다.
4. 특별한 기술 권한이 없는 역할은 해당 작업을 **실행 가능한 같은 작업의 기술 담당자(예: Codex Git/Chrome executor)**에게 명시된 파일·UID·조치·증거와 함께 넘기고, 인계자가 **완료 확인을 수납할 책임**을 유지한다. 책임만 넘기고 종료하지 않는다. 원장에게 동일 작업의 재승인을 요구하지 않는다.
5. 실제 권한·원천 증거·도구 부족이 재시도/대체 경로로도 해결되지 않으면 **해당 UID/검사만** OPEN_WITH_EXACT_BLOCKER로 남겨 근거·시도 내역·firstMissingClosureStep·복구 주체를 기록하고 전체 성공 또는 화면 PASS를 거짓 선언하지 않는다. 다른 정상 UID는 진행한다.

## 2. 역할별 해야 할 일

| 실행자 | 책임 | 완료 조건 |
| --- | --- | --- |
| CREATE 제작 AI | 학생 발문 역독해, 해설·정답/오답4개 재현, 실제 사용 Meta 설계, 활성 키 확인·신규 Generated 확장 키 등록, candidate와 수정 ledger 동결 | 해당 UID의 실제 수학·발문·Meta가 분리된 근거로 완성; 자신의 자체 검수를 독립검수로 위조하지 않음 |
| 검수·수정 GPT (R1/R2/R3/ALIVE 공개답 검수) | 원본/Generated에 맞는 검수 방식 적용, 결함을 **해당 UID에서 직접 핀포인트 수정**, 관련 Meta extension의 진입·검증·저장, 변경 영향만 재검 | 결함 미해결을 '통과'로 남기지 않음; 수학 오류는 확정 해결 아니면 UID HOLD; 사용자 직접 Generated 품질승인은 중복 독립 인증 불요 |
| Meta 분류·수정 AI | 실제 문항 사고에 사용한 L1~L4, CrossConcept, Condition, Integration, 난이도, PT/TPL 확인. 기존 canonical 탐색→없으면 별도 GENERATED_EXT namespace 생성·등록·parent/evidence/중복검증→Source metadata/Consumer/index 동기화 | 임시 label만 남기거나 `null` 14건처럼 결손을 방치한 채 'Meta 완성'이라고 쓰지 않음 |
| Publication/MASTER/Codex 기술 실행자 | 승인 UID·에셋/JS·Meta의 source→Consumer→index 일치, 도구 validator, 운영 Git single-writer merge, Chrome 학생 검색·선택·출력 실제 테스트, SHA readback 및 receipt | 화면/메타/인덱스/원격main 검증을 끝낸 뒤에만 MAIN_DONE. Git 커밋/정적 JSON count만으로 종료하지 않음 |
| WATCHDOG/담당자 | 누락된 기술 QA·Meta 등록·상태부채를 감시, 지정 주체가 작업을 완료하도록 직접 복구/조정 | "미완료 보고"만 계속 반복하지 않고 실행 가능 작업을 닫음 |

R1/R2 blind 등 학교 기출의 기존 별도 독립검수·잠금 단계는 변경하지 않는다. Generated 신규 품질은 사용자 직접 지정 시 `USER_DIRECTED_QUALITY_APPROVED`를 별도 품질 인증 대신 적용하며 수학·기술 결함을 무시하는 면제는 아니다. Codex가 Generated 수학 품질을 임의 승인하지 않는 역할 경계는 유지한다.

## 3. Meta 확장 규칙 — '미확정 14건' 같은 형식적 미분류 남기지 않기

1. 분류 작업자는 먼저 문항의 **실제 필요한 사고**를 확인한다. `L1→L2→L3→L4`, `CrossConcept`, `Condition`, `IntegrationPattern`, `PT/TPL`, `difficultyBucket(1~5)`, `level`을 분리하고, source/solution/원본 증거와 canonical taxonomy·registries에서 기존 키를 검색한다.
2. **사용되는 개념/조건인데 현재 키가 없다면:** 보류만 하는 대신 해당 작업자가 기존 registry 구조·명명규칙과 중복·parent를 확인해 **Generated 전용 확장 namespace(EXT-CROSS / EXT-COND / EXT-L4 등 현행 등록 형식)**에 정의·의미·적용 근거·parent L3/L4·provenance·UID를 등록한다. extension namespace는 canonical RPM LOCKED/타교재 마스터를 수정하거나 거짓 canonical 승격하는 것이 아니다.
3. 기존 허용값이 실제로 있음에도 불필요하게 새 키를 만드는 행위는 금지한다. L3 주개념을 옮기거나 근거 없는 CrossConcept·Condition을 임의 발명하지 않는다. 적용되지 않는 항목만 `[]` 또는 `NONE`이고, 실제 적용된 상태의 키 미등록·작업용 label·null은 등록 완료가 아니다. 데이터 불명·근거 충돌만 exact evidence debt로 분리한다.
4. 새 extension은 **registry → 최종 source 문항·metadata → Consumer record.question 및 Meta projection → 검색 index Meta projection**에 **같은 UID·같은 값**으로 영구보존한다. 바뀐 UID만 diff 검증하고, 기존 승인 UID와 RPM LOCKED는 변경하지 않는다.
5. Extension register를 작성할 권한/도구가 부족하면 같은 업무에 실제 Git 작성 가능한 executor에게 작업을 인계하고, 응답을 검증해 완료한다. **'나중에 사람이 분류'를 기본 정상 상태로 사용하지 않는다.** 정본 확장으로 해결할 수 없는 실제 수학/출처 충돌일 때만 격리한다.

## 4. 승인된 출시 마감 — 기술 검사도 출시 작업의 일부

이 절은 출시·등록·main 반영까지 맡긴 범위에 적용한다. 이미 승인된 출시·main 반영 지시(적용 가능한 기존 사용자 지시 포함)는 해당 변경 범위에서 유지하며, 최신 ‘패치·커밋·draft PR까지만’ 등의 명시적 종료·제외 조건이 있으면 우선한다. 출시 책임은 unchanged 전체 시험지 재검 허가가 아니며 기존 유효 증거를 재사용한다.

- **원장 직접 Generated 검수·수정·main 지시 = 추가 형식적 GPT 품질 인증 불요.** 품질 승인 evidence는 기존 `USER_DIRECTED_QUALITY_APPROVED`를 사용한다.
- 승인 후 production source/metadata/Consumer/index/학생 선택 상태·자산이 확정되면 **main까지 병합하고 정확히 그 main SHA로** 브라우저/Chrome에서 신규 UID 검색·선택, 발문·보기5·정답/해설의 적절한 모드·그림·수식 표시, HOLD 차단, 영향 범위의 겹침·누락을 확인한다. GitHub Actions와 실제 런타임 캡처 중 환경에 적합한 검증 경로를 사용한다. 성공을 확인했으면 증거 run URL/캡처 SHA/대상 UID 수를 남긴다.
- 오류가 나오면 해당 구현/설정/에셋을 즉시 수정하여 새 SHA에 검사결과를 다시 결속한다. 기존 PASS 시험지·UID를 무관하게 전량 재검수하지 않는다.
- **MAIN_DONE:** 품질 승인 경계 명확 + 실제 승인 UID 전부 Source/Consumer/index 연결 + 필요한 Meta extension 등록 + 새 main SHA remote readback + 필요한 실제 학생 브라우저 기술 QA와 도구 validator가 완료. 수치만 맞거나 `git push`만 된 상태는 `MAIN_REGISTERED_TECHNICAL_QA_OPEN`이라는 진행 정보이지 작업 종료가 아니다.
- 브라우저 기능에 접근 불가한 현 executor는 이를 '추가 인증'이라고 포장하지 말고 대체 실행 경로를 실제 탐색·시도한 뒤 unresolved 기술 장애를 기록한다. 수행하지 않은 테스트는 절대 PASS로 적지 않는다.

## 5. 즉시 시정할 사례 — 2025 팔마고 QID9 q05~q08 (36 UID)

- Git main 2026-10-09 `52c66767e8ad9ef28bc243566d5396b2170b54b1`은 **품질 지시 + 정적 Source/Consumer/index 병합**을 수행했다. 별도 신규 품질 승인이나 재검수를 요구하지 않는다.
- 그러나 **Chrome 학생 실조회 미실시와 Meta 14개 UID의 'canonical 미확정'**을 보고서에 남기고 끝낸 것은 폐쇄 조건 미충족이다. 이 항목들을 현재 owner가 직접 작업한다.
- 14건 분모는 `Q05 C2/C3 CrossConcept(외심) 2`, `Q06 A1~C3 condition working label 9`, `Q07 C1~C3 positive parameter condition 3`. 전부 실제 canonical 등록 필요성·중복 여부를 문항별 대조한 뒤 (a) 기존 유효 키 매핑 또는 (b) 필요한 Generated-only 확장 등록 또는 (c) 실제 분류 부적용이면 수학 근거를 기록한 `[]` 등으로 **개별 확정한다**. 이를 임의 '14개 신규 canonical 키'로 양산하지 않는다.
- 최종 수정 결과는 새로운 버전·SHA·메타 projection에 귀속하고, 등록 후 학생 브라우저 실제 스모크 및 main readback을 완료한다. 명백한 결함을 단순 부채 보고로 마감하지 않는다.

## 6. 변경 범위·검증 비용 최소화

동일 UID/출시 배치의 실제 변경 파일만 커밋. 시험지 1건 1개 독립 커밋 우선, 타 작업 `add .`·범위 밖 변경 금지. 현재 main 기반 merge 충돌은 fresh 조회·핀포인트 해결 후 readback. 이전에 승인/출시된 q01~q04 및 다른 학교·학생용 문항은 읽기 전용. 불필요한 전수 재검·계획만 반복·새 승인 절차 추가 금지.

**핵심: 승인된 범위의 실제 수리와 요청받은 종료 조건까지 책임진다. 범위 밖 확장·불필요한 전수 재검으로 한정 작업의 종료를 미루지 않는다. 출시를 맡겼다면 필요한 Meta·학생 화면·Git/DB 마감도 같은 범위에서 닫는다.**
