# ALIVE GPT QID9 — 원본 한 문항 × 9개 슬롯 작업 계약 CURRENT

## CURRENT HARD — 원장 직접 검수·main 반영 지시 = 품질 최종 승인 (2026-10-09 최신 사용자 지시)
- **원장이 특정 Generated/ALIVE 문항·배치에 대해 "검수하고 main에 반영", "검수 후 운영병합", "main에 반영" 등 품질 확인과 출시를 직접 지시하면, 그 명시한 범위의 품질 승인 authority는 `USER_DIRECTED_QUALITY_APPROVED`로 충족한다.** 추가로 새 GPT 세션의 "정식 품질검수", 별도 독립검수 인증, open-book review PASS, 재승인·배치 대기를 요구하지 않는다. 원장 지시를 받았는데 formal GPT REVIEW 0건이라는 이유로 QUALITY_PENDING으로 표시하거나 출시를 보류하지 않는다.
- 지시 범위와 최종 파일/UID를 결속해 `approvalBasis=USER_DIRECTED_QUALITY_APPROVED`(또는 현재 스키마의 기존 `USER_DIRECTED_OPERATING_APPROVED` 및 실제 원장 지시 evidence)를 남긴다. **실제로 수행하지 않은 독립 GPT 검사를 PASS했다고 꾸미지 않으며**, 이력의 `openBookQualityReviewed:0` 같은 계수는 독립 검수 이력일 뿐 사용자 승인 취소 근거가 아니다.
- **남는 작업은 기술적 출고·완료:** 최종 UID·출처/변경 범위, 정확한 Meta 영구보존·기존 정본 키, source/Consumer/index parity, 에셋 존재/렌더, 최소 validator·실제 필요한 Chrome, main 병합·remote readback. 기술 오류가 발견되면 문제 locus만 직접 수리하고 영향 범위만 재검증한다. 수학적/발문상 실제 오류가 드러나면 해당 UID만 수정·HOLD하고, 원장의 품질 승인 지시를 이유로 오류 자체를 무시하지 않는다. **기술 검사는 2차 품질 승인 절차가 아니다.**
- **기존 팔마고 QID9 q01~q04 36개:** `USER_DIRECTED_OPERATING_APPROVAL_20261009_QID9_36` 및 기존 main 등록/Chrome 근거를 품질 승인·운영 출시의 완료 authority로 사용한다. 별도 정식 GPT PASS 인증을 추가 요구하지 않고 q05부터 제작을 진행한다. 과거 `formal independent not claimed` 기록은 거짓 독립검수 표기를 막는 이력으로만 읽으며 품질 미승인·재작업 지시가 아니다.
- 이 절은 아래의 "별도 GPT가 독립 PASS한 후에만", "새 독립 세션 필수"라는 **생성문항 품질 승인의 선행 조건을 사용자 직접 지시 범위에서 supersede**한다. 원장이 직접 승인하지 않은 신규 초안은 기존 품질 검수 경로를 따른다. 학교 기출 원문 R1/R2 blind 및 Archive Runtime의 기술 무결성 검증은 그대로다.

## CURRENT HARD — 생성 Meta 설계→저장 영구보존 계약 (2026-10-09 문제은행 프로젝트)
- **문항 생성 시 실제 사용한 L1/L2/L3/L4, CrossConcept, Condition, IntegrationPattern 및 1~5단계 난이도는 작업용 사고 메모만 남겨서는 안 된다.** 최종 생성 source shard/metadata에 UID별 확정값으로 저장하고, GPT REVIEW 통과 후 학생용 Generated Consumer shard 및 인덱스에도 동일 UID로 검색·조회 가능한 형태로 투영한다. 보존 여부는 출시 직전 UID별 확인 대상이다.
- 필수: 정확한 RPM/Generated 확장 Primary L3와 L4, 교육과정·L1/L2 parent, difficultyBucket=1~5, crossConceptKeys[]/conditionKeys[]/integrationPattern. 개념·조건이 실제 미적용이면 [] 또는 NONE을 명시하여 **미기재와 구별**한다. problemTypeKey/templateKey는 ACTIVE 매핑을 사용하거나 실제 매핑 상태를 근거와 함께 보류한다. 가짜 canonical 키·L3/L4 임의 추정 금지.
- Generated Consumer 기존 `l2`는 storage bucket·subUnitKey 계열이며 RPM L2의 정식 의미 필드가 아니다. 신규 상세 Meta에서는 RPM L2를 **별도의 필드**로 보존하고 원본 교육과정 standardUnitKey/subUnitKey 및 generated EXT-L4와 혼동하지 않는다.
- 출판 전 `설계/검수 Meta → source JS/metadata → Consumer question → 학생용 검색 index` 데이터의 UID 단위 parity 확인이 필수다. **본문·정답·해설만 등록되었거나 RPM label만 표시되고 상세 Meta가 분실되면 `META_PERSISTENCE_HOLD`**이며, 해당 UID는 기술 출시 완료로 기록하지 않는다. 다른 정상 UID/생성 레인의 진행은 유지한다.
- 기존 학생용 323 UID(2026-10-09)의 Meta 보존 누락은 [실측 감사 원장](https://github.com/icefoxtail/AP------/blob/main/docs/architecture/Problem_Bank_Generated_Meta_Retention_Audit_20261009.md)에 격리한다. **이 지시만으로 기존 문항의 PASS를 철회하거나 323개를 일괄 재제작하지 않는다.** 검증된 현재 상태를 정확히 기록하고, 조회 가능한 원본/설계 증거가 있는 범위만 나중에 UID별 백필한다.
## CURRENT HARD — 제작 GPT 역발문 자가수정 HARD (2026-10-09 원장 직접 지시)
- **적용 범위:** 신규 ALIVE/QID9 A1~C3 생성 후보를 쓰는 GPT 제작자. 기출 원본 전사·조판 및 기존 R1/R2 blind 검수의 의미/입력은 변경하지 않는다. 제작 GPT는 최종 후보를 저장·qid별 commit하기 **전에 각 후보의 학생용 발문을 자신의 출제 의도에서 분리해 비판적으로 다시 읽고, 발견한 결함은 해당 제작자가 즉시 수정하여 최종본에 반영**해야 한다. 검수 단계의 다른 GPT에게 단순히 결함을 떠넘기지 않는다.
- **읽는 순서:** 완성된 **학생에게 실제 보이는 문장·보기·그림/표/수식**만 먼저 놓고 제작 당시 목표 정답·풀이·Blueprint의 자동 보충을 중지한다. 수학 풀이 전체의 별도 blind-first 재수행을 뜻하지 않는다. (1) 학생은 질문 대상·정의역·변수·부호·등호·그림 조건과 답형을 오해 없이 읽을 수 있는가? (2) 학교 수학 교사가 실제 시험에서 이렇게 묻는가? 단지 예쁜 답을 위해 임의 배수·이질량 합·부자연스러운 조건을 만들지 않았는가? (3) 발문만으로 **의도한 Primary L3의 결정적 사고**가 필요한가? 핵심 조건이 소거되거나 더 쉬운 우회 풀이로 평가 목표가 무력화되는가? (4) 보기 네 오답을 각 실재 오류 과정으로 만들 수 있는가? 정답 유일성·경계·시각 참조·해설과 학생 입력이 일치하는가?
- **역발문 복원:** 각 UID에 대해 학생 입력으로부터 `문제에서 주어진 것 → 실제로 묻는 것 → 필요한 결정적 판단 → 풀이 경로/우회 가능성`을 짧게 다시 복원하여 제작 설계와 대조한다. 의도와 다르면 `STEM_REVISED` 또는 `HOLD`; "검토 완료/수학 일치" 한 문장만 쓰고 넘어가지 않는다. **실제 결함이 없는 문항은 `KEEP`하고 억지 수정을 만들지 않는다.**
- **수정·전파:** 발문 결함이면 **발문 또는 목표량/조건부터** 재설계하고 최종 학생용 문장을 저장한다. 수학적 의미를 바꿨다면 정답·객관식 다섯 보기·오답 도출 경로·상세 해설·L3/L4/CrossConcept·difficulty·필수 asset 및 경계/유일성까지 **영향받은 부분만** 다시 검증·동기화한다. 표현만 다듬어 의미가 안 바뀌면 변경 위치의 문장·보기·해설 정합성만 확인한다. 명백한 결함이 해소되지 않으면 `HOLD` / `QID_INCOMPLETE`로 남기고 학생용 PASS나 수학 검증 완료를 주장하지 않는다. 다음 원본 qid 제작은 현행 누적 체크포인트 정책대로 별도 진행 가능하다.
- **제작자 self-review 증거(프로덕션 아님):** 각 source qid의 비출시 검수 ledger/핸드오프에 `uid / originalStemOrIssue / reverseReadingFinding / decision KEEP|REVISED|HOLD / finalStem / affectedFields / changedMathRecheck / remainingRisk`를 간명하게 남긴다. `KEEP`은 1줄 근거, `REVISED`는 구체적 결함·실제 전후 변경, `HOLD`는 미해결 원인/다음 조치를 남긴다. qid 집계로 KEEP·REVISED·HOLD 수를 합산하고 검수 대상 UID 분모와 매칭한다. `SELF_RECHECK_COMPLETE`는 각 슬롯의 결과와 수정 후 최종 파일이 실제 일치할 때만 선언한다. self-review 로그는 운영 JS/SVG/학생용 메타 스키마에 강제 삽입하지 않는다.
- **승인 경로 구분:** 원장 직접 검수·main 반영 지시가 있으면 이 문서 맨 위의 `USER_DIRECTED_QUALITY_APPROVED` 경로로 별도 GPT 정식 검수를 생략한다. 그 외에는 제작 GPT의 수정 완료와 별도 GPT 공개답 검수를 구분한다. 자가검수 KEEP/REVISED는 독립 `GPT_OPEN_BOOK_REVIEW_PASS`가 아니다. 불필요하게 완성된 다른 UID나 기존 PASS를 다시 검수하지 않는다.
- **다음 제작 GPT에 전달할 필수 실행문:** "발문·보기·정답·해설 1차 완성 후 자신의 설계 의도를 잠시 접고 학생·학교 출제자·우회풀이 관점에서 최종 발문을 역독해하라. 이상이 있으면 그 자리에서 발문/조건/목표량을 수정하고 영향을 받은 보기·정답·해설·Meta만 재확인하라. UID별 KEEP/REVISED/HOLD, 수정 전후와 해결 여부를 별도 self-review ledger에 남기고 최종 후보와 함께 같은 브랜치에 저장하라. 자체검수만으로 독립 PASS 또는 학생 출시를 주장하지 말라."
- **대표 네거티브:** 팔마고 q04 C3처럼 `k+4t`가 예쁜 정수를 만드는지와 별도로 학교 시험 질문으로 자연스러운지 평가하고, "k+t를 잘못 결합"과 오답 ⑤의 값처럼 실제 오답 값이 오류 경로에서 재현되는지도 확인한다. 이 예시는 **의심 locus**이지 검증 없이 자동 FAIL·답 변경을 명령하는 것은 아니다. 원문 출제 의도와 근거를 확인한 후 최소 수정한다.
- 이 CURRENT는 아래 이전 문구 중 모든 생성문항에 별도 blind-first/freeze를 요구하는 표현보다 우선한다. **제작자 역발문 self-check는 새 독립 리뷰 단계가 아니라 CREATE 안의 필수 수정 루프**이다.


### CURRENT HARD 보강 — 팔마고 q04 회귀 방지: 오답 재현·변경증거 무효화·출제 목표 역검사 (2026-10-09)
- **원인:** 계산값/해설 결론의 일치, 5지 개수·문자열 중복 없음, 정답번호 분포, 제한된 수치 샘플링은 각각 *그 검사만* 통과시킨다. 이 결과만으로 발문 교육성·L3 유지·오답의 유효한 유도 경로·변경 후 증거 정합성을 'AUTHOR_SELF_CHECKED'라고 포괄 선언하지 않는다. 정답이 맞는 문제와 출제할 가치가 있는 문제는 별개다.
- **① 문제 자체 역검사:** 각 UID의 학생에게 보이는 최종 입력만 읽고 '주어진 것 → 묻는 것 → 결정적 사고 → 실제 풀이/더 쉬운 우회'를 복원한다. 원본 Primary L3의 결정적 판단이 *실제 풀이에서 필요한지* 확인한다. C 슬롯의 '사고 확장'을 빌미로 거리합 최솟값을 두 거리의 최댓값 최소화로 바꾸는 등 평가 대상 자체를 교체하면 L3 유지로 자동 통과시키지 않는다. 보기값을 정수로 만들려고 임의의 'k+4t' 같은 결합값을 물으면 교육적 질문 이유를 설명할 수 있어야 하며, 아니라면 목표량을 자연스러운 값/위치/조건으로 재설계한다.
- **② 오답 4개 계산 경로 역재현:** 객관식은 정답을 제외한 선택지 **4개 번호를 각각 정확히 한 번** 대응시켜 '실제 잘못된 전제/연산 → 중간식(필요 시) → 계산된 값 또는 판단 → 해당 보기의 최종 값'을 직접 확인한다. 문자열 5개가 서로 다르다는 검사만으로는 불충분하다. 설명이 그럴듯해도 최종 보기값을 만들지 못하면 'DISTRACTOR_PATH_INVALID', 번호 중복/누락이면 'DISTRACTOR_INDEX_COVERAGE_INVALID', 동치인 복수 정답은 'ANSWER_UNIQUENESS_INVALID'. 재현 불가인 선택지/오답 근거는 제작자가 다시 설계하고 정답에 맞춰 억지 설명을 만들지 않는다.
- **③ 변경 후 evidence freshness HARD:** 발문·목표량·조건·보기·정답·해설·L3/L4/CrossConcept·난도·자산 중 하나라도 의미상 변경되면 그 UID의 **영향받는 증거를 먼저 STALE로 무효화**한다. 특히 기존 numericalSpotCheck·예상 정답/경계·오답 4개 경로·답 인덱스/분포·평가목표 판정·Meta 분류를 이전 artifact의 PASS인 것처럼 최종본에 남기지 않는다. 바뀐 문제와 무관한 계산은 이력으로 분리하거나 제거하고, 최종 학생 입력 기준으로 **변경 영향 범위만** 재계산·재확인한다. 수치 샘플링은 exact math나 교육성 PASS의 대체 증거가 아니다.
- **④ 최종 후보와 ledger 결속:** 비프로덕션 qid별 ledger에는 UID마다 'finalCandidateSha(또는 정확한 최종 후보 snapshot 식별자) / reverseStemFinding / primaryL3Necessity / distractorIndexCoverage(4/4) / distractorReproduction(4/4 또는 OPEN) / evidenceFreshness / decision KEEP|REVISED|HOLD / before→after / affectedFields / changedLocusRecheck / remainingRisk'를 기록한다. KEEP에도 학생 발문·보기·실제 사고의 역독해 근거를 남긴다. REVISED는 최종본의 영향 검사 증거를 갱신하고 HOLD는 미해결 사유를 남긴다. 최종 후보가 바뀌었는데 이전 예상값·정답·오답 계산을 현재 증거로 재사용하는 것은 금지한다.
- **⑤ 완료 조건의 범위:** 'SELF_RECHECK_COMPLETE'는 현재 저장된 최종 artifact의 UID 분모 전체에서 KEEP/REVISED/HOLD를 명시하고, **자체 통과로 선언하는 UID**의 학교식 발문·L3 필요성·오답경로 4/4·영향 증거 freshness를 실제 확인한 경우에만 기록한다. 일부 검사만 실행했으면 해당 축을 NOT_TESTED/HOLD로 기록하며 9개 자동 PASS를 강제하지 않는다. 제작자 자체검수만으로 자동 출시하지 않으며, 원장이 직접 검수·main 반영을 지시한 범위는 위 사용자 승인 경로가 우선한다.
- **회귀 네거티브 fixture:** 팔마고 초기 q04 C2는 거리합에서 'min max(PA,PB)'로 평가 목표가 이동했고 C3는 자연스럽지 않은 'k+4t'를 물으면서 오답 근거가 실제 보기값과 맞지 않았다. 이후 수정본에서는 B2·C1의 오답 설명에 번호 중복·누락이 남았고, C2 발문/답이 변경된 뒤에도 이전 min-max 문제의 numericalSpotCheck가 남았다. **수정된 문제의 정답이 옳아도 종전 수치 증거는 현재 계산 PASS가 아니다.** 이미 완성된 다른 qid 전부를 재생성하지 말고 확인된 UID/증거만 표적 보정한다.
- **허위완료 금지:** 'choices.length=5', 문자열 중복 0, 예상값과 수치 근접, 'solution.endsWith(정답)', 'studentSourceReverseRead=충분' 같은 요약을 모아 교육적 자가검수 완료로 선언하지 않는다. 실제 검사별 판정 범위를 한정한다. 별도 agent·독립풀이 전수 반복·신규 stage를 추가하는 규칙이 아니라 **CREATE 내 역발문 → 직접수정 → 변경증거 재확인의 최소 루프**다.


## CURRENT HARD — 시험지당 단일 브랜치 / 문항별 독립 커밋 / 누적 배치 검수 (2026-10-09)
- **대상:** 신규 ALIVE GPT QID9 생산 라인. **시험지 하나 = 보호된 작업 브랜치 하나**. 같은 시험지 원본 q1, q2, q3...의 설계·생성물은 한 브랜치에 순서대로 누적한다. **원본 source qid 1개 = 변경대상 파일만 포함한 독립 Git commit 1개**가 표준. 문항마다 새 브랜치·새 PR을 만들지 않는다. 필요 기술/검수/핸드오프 변경은 성격별 독립 commit으로 기록한다. `git add .` 또는 다른 작업 동시 stage 금지.
- **제작 단위와 검수 단위는 분리한다.** 제작은 qid 하나에 A1~C3 최대 9개 후보를 집중 설계·생성·자체검산한 뒤 SHA/UID/진도 ledger 기록 → 다음 source qid로 연속 진행한다. **매 qid마다 별도 GPT 품질검수를 기다리지 않는다.** 기술·수학적으로 미완성인 슬롯이 있으면 해당 qid의 OPEN/필요한 수정 사항을 checkpoint에 기록하고 다른 qid의 작업을 불필요하게 막지 않는다.
- 검수는 **여러 qid/UID가 모이면 한 번에 GPT 공개답 검수**한다. 권장 리뷰 크기 **약 45문항(9개×5 source qid)**, 컨텍스트/난도/시각자료에 따라 27·36·45 등 적응형으로 조절한다. 45개는 필수 최소 수량·HOLD 조건이 아니고, 형님이 요청하면 현재 쌓인 후보로 즉시 검수한다. 서로 다른 source qid의 분모·UID를 한 리뷰 ledger로 집계하고 결함은 해당 UID만 핀포인트 수정한다.
- 공개답 검수 기준은 **학교식 한국어 발문 → 답·상세 해설을 공개한 수학적 추적 검수 → 객관식 5지·L3/L4/CrossConcept·Meta**. 모든 UID에 blind-first·독립 재풀이 강제 금지, 의심 사례만 대체 계산·경계/반례 검산. 기존 학교 기출 R1/R2 freeze 의무는 영향 없다.
- 누적 브랜치의 `WORKING_MANIFEST/HANDOFF`에는 시험지 source SHA, qid별 A1~C3 UID·설계/후보 경로, 생성/자가점검/검수/학생 공급 단계, **개별 commit SHA**, 다음 qid, 리뷰 대기 UID 분모를 유지한다. 새 GPT 대화는 동일 브랜치와 manifest에서 시작하며 끝난 qid를 반복 제작하지 않는다. 정확한 컨텍스트 사용률 50/80%를 볼 수 없으면 추정하지 않고 checkpoint로 인계한다.
- GPT 검수 PASS 또는 `USER_DIRECTED_QUALITY_APPROVED` UID는 별도 L4 승인 대기 없이 **동일 업무에서 Archive 2.0 Generated Consumer 등록·학생 조회/출제·main 운영병합**까지 마감한다. 신규 생성 후보 저장과 학생용 노출은 다른 상태이므로 실제 출시 전에는 PASS/MAIN_DONE이라 하지 않는다. Codex는 확정 변경의 Git 운영병합·remote readback만 담당한다.
- 2026-10-09의 `qid 하나 만든 직후 반드시 리뷰/출시 후 다음 qid`, `원본별 별도 작업 branch/PR`, `매 문항 마다 새 GPT 검수 창` 등 과거 문구와 충돌하면 **이 CURRENT가 우선**한다. 기존 q1/q2/q3 각각의 임시 PR은 새 통합 브랜치가 정확하게 readback 된 뒤 종료하고 추적 링크만 보존한다.


## CURRENT HARD — 생성 문항 공개답 기반 '발문→풀이추적' 검수 (2026-10-09 원장 최신 지시)
- **적용 범위는 신규 ALIVE GPT 제작문항 검수만**이다. 기존 실제 기출 Archive 원문의 R1/R2/Blind-first 검수 계약은 이 변경으로 완화하지 않는다.
- 생성문항 리뷰어는 **최종 학생용 발문·보기·그림과 저장 정답·상세 해설·설계 근거를 함께 공개 열람**할 수 있다. 모든 문항에 답 가린 첫 풀이·fresh-blind freeze·다른 GPT 세션 별도 독립 재풀이를 필수로 요구하지 않는다. 이전 문서의 해당 규칙보다 본 CURRENT가 우선한다.
- **제1게이트 = 학교식 한국어 발문 품질**: 학생이 읽는 순서로 지칭/정의역/조건·경계·질문의 자연성, 단서의 충분성, 불필요한 문장·기계식 조합, 답형·선지·시각 결속을 보고 필요하면 *발문 자체를 수정*한다. 발문에 결함이 있으면 저장 답이 맞더라도 PASS하지 않는다.
- **제2게이트 = 공개 해설 추적 검증**: 정답·상세 해설을 보면서 모든 핵심 등식·부등식·변형·경우 분기·끝점·정의역·최종 선택지까지 실제로 검증한다. 풀이 단계 누락·설명 비약은 교육적으로 보강한다. '읽어보니 그럴듯함'이나 답과 해설의 자기일치는 수학 검증의 증거가 아니다.
- 의심 사례(분수·근호·복수 해·경계·그림·역조건·보기 간 동치)에서는 **그 문항만** 다른 계산 경로, 정확 경계 대입, 간단한 결정론 검사/수학적 반례로 핀포인트 재검한다. 전 UID에 무의미한 독립 정답풀이 반복 금지. 필수 수학·교육과정·정답 유일성 검사는 생략하지 않는다.
- **제3게이트 = 5지 오개념/Meta/교육 목적**: 오답 네 개의 실제 오류 경로, 답 1개 또는 원문 계약상의 복수 선택, ①~⑤ 세트 분포, 고정 Primary L3·L4/CrossConcept·난도와 최종 발문의 일치, 필수 problem asset 존재를 검토한다.
- 상태 이름은 `GPT_OPEN_BOOK_REVIEW_PASS`(발문 + 공개 해설 추적 + 보기·메타 완료), `TARGETED_RECHECK`, `REVISION_REQUIRED`를 **검수 레저의 설명 필드**로만 사용한다. 별도 ALIVE runtime enum을 임의 추가하거나 하지 않은 수학 검산·브라우저 확인을 PASS라고 쓰지 않는다. 자기 제작 후속 검산과 타 검수자의 공개검수는 식별하고, 전자는 독립 검수라 부르지 않는다.
- 공개검수 첫 PASS 문항은 불필요한 L4 승인·중복 정리 대기 없이 Archive 2.0 Generated Consumer 등록·main 병합·실제 학생 조회/출제까지 기술 마감한다. 명백한 수학 오류는 학생에 내보내지 않는다. 학생 컴플레인·원장 지시에 따른 UID별 비활성화는 별도 운영이다.

## CURRENT HARD — Gemini 역설계 5단계 × 발문 1순위 × QID별 9슬롯 (2026-10-09)
- **적용:** 기출 원본 그대로 추출·검수하는 업무는 원문과의 정확성·수학·조판을 검사한다. **새 문항 생성**에서만 학생이 보는 발문을 최우선 품질 산출물로 설계·심사한다. 혼동 금지.
- **0 경험 계획:** 한 원본의 잠근 실제 RPM Primary L3와 기존 경험 coverage를 확인하고, A1~C3의 학생 사고 목표·문형·표현·난도 사다리를 먼저 나눈다. A는 동일 풀이의 의도적 수치 instance도 유효. B/C는 결정적 판단·CrossConcept·경계·역산·복합 추론을 실제로 늘린다. 9슬롯 전부 제작 시도하지만 독립 의미 Blueprint가 9개여야 하는 것은 아니다.
- **1 불변량/자유도:** 원본 주 L3·평가 핵심·교육과정·첫 착수 개념을 잠근다. 변형 가능한 L4, 기존/신규 Generated L4, CrossConcept(선수 개념·필요한 역할), Condition, Integration, 표현을 구분한다.
- **2 직교 Blueprint:** 슬롯마다 `L3 → L4 → CrossConcept → 추가 결정 → 최종 질문`을 설명하고 같은 사고를 껍데기만 바꿔 신규성으로 과장하지 않는다. 생성 문항의 최종 풀이 주개념이 L3에서 이탈하면 그 슬롯을 재설계한다.
- **3 역설계 및 Stem Realizer:** 목표 수학 객체·유일 답·경계/퇴화·계산 부담을 먼저 만들고 좋은 계수/좌표/정수조건을 역산한다. 그 결과를 **실제 한국 학교 기출에 어울리는 자연스럽고 짧은 한국어 발문**으로 전환한다. 억지 조건·이질량 합산·불필요한 학생 캐릭터·수식 과밀·부자연스러운 질문을 없앤다. 발문은 내부 풀이 또는 답을 누설하지 않는다.
- **4 역발문 점검 + 독립풀이:** 학생에게 보이는 최종 발문·5지·조건표·필수 그림만으로 질문 대상·조건·실제 풀이 경로를 **다시 복원**한다(Reverse Stem Check). 먼저 학생 입력만 보고 답과 보기별 참/거짓을 동결한 뒤 생성자 답과 대조한다. 원래 Blueprint가 발문에서 실현되지 않았으면 설계부터 다시 고친다. 적용되는 family만 정확 임계값/바로 양측·정의역·퇴화 사례 확인. **같은 제작 GPT의 나중 자체검수는 별도 창의 독립 GPT 리뷰를 대체하지 않는다.**
- **5 오개념 보기 + 공급:** 객관식 오답 4개는 각기 다른 실제 오류 경로를 가진다. **원본 qid의 9문항 단위 정답 위치는 ①~⑤가 각각 1~2개**, 예시 분포 2/2/2/2/1이 되게 자연스러운 보기 순서만 재배열한다. 정답값·발문 수학을 위치 맞추려고 조작 금지. 객관식이 9개 미만이면 그 수에 맞춰 가능한 한 분산하고 잠긴 보기 순서는 유지한다. 난도 인지부담(새 개념/전환/판단·분기)과 계산량은 별도로 기록한다.
- **검수 경로:** 원장 직접 검수·main 반영 지시 범위는 별도 GPT 독립 인증 없이 사용자 품질 승인을 적용한다. 그 외의 신규 미승인 초안만 제작자 셀프체크 뒤 기존 별도 GPT 검수 경로를 따른다. 성공 UID는 즉시 Archive 2.0 Generated Consumer/index/main 출고; 승인 대기 L4로 막지 않는다. 불합격 UID만 수정하고 그 문항만 영향 재검한다.
- **근거:** Notion `GPT 유사·변형 문항 생성 5단계 — 불변량·Blueprint·조건 역산·독립검증 v1` (2026-10-09 Gemini/Claude 보강), `원과 직선 L3 — 사고 경험 커버리지 맵 v0.1`, Git `ALIVE_META_BLUEPRINT_MASS_EXPANSION_UPGRADE_PLAN_v0.1.md`의 Mathematical Spec→Stem Realizer→Reverse Stem Check. 이 문서에 적은 내용은 실행 계약이며 범용 엔진 기능이 이미 자동구현됐다는 주장이 아니다.

## CURRENT USER AUTHORITY — L3 고정·L4 확장·발문 우선·1회 검수 후 즉시 공급 (2026-10-09)
이 절은 **GPT 신규 ALIVE QID9 문항 생성·검수·Generated Bank 출시**에 한하여 아래의 'EXT 승격 별도 승인 대기', '정본 미승격 HOLD', '별도 사람 승인'을 대체한다. 수학적 오류·교육과정 위반·발문 결함·필수 그림 누락을 승인하는 규칙은 아니다. 원본 Archive와 RPM Primary LOCKED ID는 직접 변경하지 않는다.

### 1. L3 고정과 사고 확장의 설계 순서
1. 원본의 실제 **Primary RPM L3**를 잠근다. 최종 발문이 학생에게 요구하는 결정적 수학 판단이 이 L3에 남아야 한다. 단순 provenance label만 같게 쓰지 않는다. 새로운 L3가 실제 주목표가 됐다면 QID9의 해당 슬롯은 재설계한다.
2. 해당 L3 아래 기존 RPM L4·Generated EXT-L4를 먼저 조회한다. 적용 가능한 기존 L4를 재사용하고, 같은 L4 아래 수치 인스턴스·Condition/CrossConcept 변화는 별개 문항 UID로 충분히 보존한다.
3. 목표 경험에 필요한 **L4 / CrossConcept(이미 학습한 개념) / Condition / Integration** 후보를 펼친 뒤, 핵심 판단·출제 방식·기대 난도에 의미가 있는 조합을 선택한다. 필수 개념 각각의 역할과 선후관계(예: 이차함수-직선 교점 → 판별식 → 정수 조건)를 한 줄로 남긴다. 임의 개념 나열은 불허한다.
4. 9개 슬롯 A1→C3를 원본 개념에서 점차 확장한다. A는 핵심 풀이를 익히는 의도적 수치·조건 변형; B는 추가 판단·역산·반례·표현 전환; C는 실제 기출처럼 자연스러운 복합 추론·경계/경우 분기. 원본이 쉬워도 B/C 발전을 제한하지 않는다. 여러 개념 결합은 일반적으로 사고 부담을 늘리지만 실제 난도는 풀이 판단·분기·숨은 조건과 계산 부담을 따로 보고 확정한다.
5. 슬롯별 최소 설계 증거: `lockedL3Id / lockedL3DecisiveStep / chosenExistingOrGeneratedL4 / crossConcepts(역할 포함) / conditions / integrationPath / addedDecisionFromPrevious / finalQuestionObjective / schoolExamStyleEvidence / difficultyBasis`. 새로운 L4가 필요해도 우선 문제 의미를 확정한 뒤 등록한다.

### 2. 신규 Generated L4 즉시 등록·후속 통합
- 기존 L4가 최종 발문의 수학 목표를 설명하지 못할 때 GPT는 **Generated 전용 EXT-L4 ID를 생성 시 즉시 등록**한다. 상태는 `GENERATED_ACTIVE`로 취급하며 별도의 사람 승인·RPM 마스터 승격 대기 때문에 독립검수 통과 문항을 차단하지 않는다. Generated EXT-L4는 RPM LOCKED와 별도 namespace이며 기존 공식 ID인 것처럼 표시하지 않는다.
- 신규 EXT의 부모 L3, 이름·정의, 결정적 풀이 서명, 생성 UID, 기존 비교 L4, CrossConcept, source provenance를 물리 registry/metadata로 저장한다. 같은 의미 L4가 뒤늦게 확인되더라도 **이미 출시된 UID는 보존**하고 추후 alias/merge 표를 만들어 정리한다. 중복 의미 구조는 9개 고유 Blueprint로 과대 집계하지 않는다.
- 실제 제품에 `GENERATED_ACTIVE` 처리/데이터 등록 경로가 아직 없다면, 현행 Generated Consumer가 읽을 수 있는 최소 adapter·index를 먼저 구현한다. 구현하지 않은 등록이나 학생 노출을 가정해 `MAIN_DONE`이라고 보고하지 않는다. 이 절은 GPT의 생성/출시 권한 정책이며 코드 실행 가능성 선언이 아니다.

### 3. 학생용 발문을 첫 번째 품질 게이트로
- **1순위는 한국어 발문**: 교사가 내신에 낼 법한 자연스러운 문장, 의미상 필요한 조건만 사용, 질문 대상·답형 일치, 일관된 수식·단위·보기 형식, 그림과 정보 표현의 완결성을 먼저 검토한다. '한 학생이 주장하였다', 불필요한 캐릭터·이질량 합산·억지 목표값·장황한 정의역 설명은 실제 사고 경험을 평가하는 필수 이유가 없으면 표준 내신식으로 바꾼다.
- **2순위는 수학·교육과정·선지**: 학생용 최종 입력에서 독립 풀이를 동결한 뒤 답·다섯 보기의 유일성·경계·개념 적합성을 검수한다. 오류가 있으면 새 설계부터 수정한다.
- **3순위는 상세 한국어 해설**: 앞의 정확한 발문과 풀이 구조를 간명하게 설명한다. 설명 문장이 길다는 이유만으로 고품질이라고 평가하지 않는다.

### 4. GPT 검수 PASS 또는 원장 직접 품질 승인 → Archive 2.0 즉시 공급
- GPT 검수 PASS 또는 원장 지시에 따른 `USER_DIRECTED_QUALITY_APPROVED` UID는 별도 L4 승인·중복 승격 회의·보류 승인 없이 **같은 업무에서 Generated JS + metadata + Consumer shard/index 등록 → Git main 운영병합 → 학생 검색·선택·출제 가능**까지 마감한다.
- 최소 기술 검증은 UID 중복 0, 정답/보기 정합, 실제 asset 존재, 표준 대/중단원 표시·기본 스키마, Generated Consumer 조회/readback, 변경 경로 최소 Chrome smoke다. **기술 검증은 또 다른 품질 승인 절차가 아니다.** 오류가 있으면 해당 장애를 직접 수리하여 완료한다.
- 문제를 학생에게 공급한 후 제기된 오류 신고나 원장 지시에 따라 **해당 UID만 즉시 검색·출제 비활성화**하고 이력을 보존한다. 이를 위한 `enabled / complaintStatus / ownerDecision`와 복구·교체 경로를 설계한다. 교사 판단 전이라도 명백한 수학 오류가 확인되면 잘못된 정답의 출제는 중단한다.
- 9개 제작 의무와 9개 자동 PASS는 다르다. **독립검수 PASS 또는 원장 직접 승인 문항을 즉시 공급**하며 한 슬롯의 품질 실패나 출시 기술 실패를 이유로 무관한 다른 PASS 슬롯을 집단 보류하지 않는다. Archive 1 원본 및 기존 수학 시험지 인덱스는 변경하지 않는다.

---

2026-10-09 사용자 직접 지시. `alive/01_CANONICAL/ALIVE_MASTER_RULEBOOK_v9.1_STABLE.md`는 ALIVE MODE/proof/교육과정에 계속 상위. 이 문서는 **교육용 생산량과 세션 작업 단위**의 현재 사용자 override를 구현하며 무검수 출시를 허용하지 않는다.

## 단위·산출
1. 시험지 source 분모 고정 후 **source qid 하나**만 읽는다. 학생 원본(발문·보기·필요 이미지), 원본 풀이·curriculum·real RPM L3/L4를 이해한다. 한 세션에서 여러 source qid를 한꺼번에 생산하지 않는다.
2. A1~A3 반복 숙달(기본·수치·조건), B1~B3 사고 확장(판단 추가·역산·표현 전환), C1~C3 실전 평가(종합·변별·고난도)을 각각 목표로 설계한다. **아홉 칸을 전부 채우는 제작 시도를 의무화**한다. A 숫자변형은 의도적으로 허용하되 새 Blueprint라고 하지 않는다.
3. 슬롯마다 학생 발문, 5지 또는 원본 형식에 맞는 정식 답형, 정답, 한국어 상세 해설, 실제 오답 이유, 레벨/1~5 bucket, RPM 경로, 원본 UID/수식·에셋 요구를 명시한다. C3 최고난도 등급도 실제 풀이 기준으로 검수하여 조정한다. 서로 다른 9개 L4를 억지로 만들지 않는다.
4. 9개를 물리 draft로 만들되 어느 하나가 과도하게 억지스럽거나 수학이 틀리면 `QID_INCOMPLETE`로 반환한다. **9 PASS 강제 불가**. 다음 qid에 자동 이동하지 않고 해당 원본의 나머지 슬롯부터 이어서 완성한다.
5. 품질 승인: 원장 직접 검수·main 반영 지시 범위는 `USER_DIRECTED_QUALITY_APPROVED`로 승인 종료하고 별도 GPT 독립 인증을 요구하지 않는다. 그 외 미승인 신규 초안에 대해서만 현행 GPT 리뷰 경로를 적용한다.
6. GPT가 확정한 승인분만 학생 Consumer source에 등록하고 실렌더·DB 인덱스·학생 조회·remote SHA gate를 완료한다. Codex는 지정 파일에 대한 Git main 운영병합·readback만 담당한다. 이전 main 후보에 있던 기존 UID와의 중복/유사도는 별도로 판단한다.

## 세션·정본·인계
- source QID별 branch 파일과 durable 9-slot ledger를 남긴다. `A1~C3 -> UID/path/SHA/created/reviewed/release/HOLD reason` + source file SHA + latest main + next exact step가 최소 인계 필드다.
- 한 source qid의 설계/생산이 끝나면 checkpoint·HANDOFF 문서로 새 채팅을 바로 시작할 수 있게 한다. 80% 토큰 사용률은 도구에서 제공하지 않으면 **측정 불가**, 감지한 척 숫자를 적지 않는다. 장문·복잡도 증가, 대화 단절 위험, qid 완료 시점에 선제 인계한다.
- 인계 문서에 붙여넣을 짧은 실행 프롬프트를 포함한다. 다음 창은 기존 Git branch와 main을 확인하고 **첫 미완료 단계**부터 처리한다. 성공한 단계 중복 재작업 금지.
- 기존 팔마고 27후보는 main candidate 아카이브 보존; 학생 등록은 4이고 23은 supply HOLD로 별도 유지. 이 계획은 기존 HOLD를 자동으로 푸는 면제권이 아니다.

## 모의고사 3×3 선택·순환 계약 (설계; 현재 제품 구현/실출시 아님)
- 생성문항은 `sourceExamPath + sourceQid + generatedUid + purposeGroup(A/B/C) + slot(A1..C3) + difficulty + rpmPrimary + supplyEligibility`를 독립 메타로 보존한다. 같은 슬롯에 향후 여러 instance UID가 있을 수 있다.
- 학교 기출의 실제 문항 수는 불변이다. 한 시험지 회차는 각 원본 sourceQid 자리에 **승인 생성문항 1개**만 뽑는다. 원본 내용/문항 수를 자동 변조하지 않는다.
- 교사는 A 전체/B 전체/C 전체, 혹은 `A1+B1`, `C1+C2+C3` 등 임의 슬롯 합집합을 선택할 수 있다. 회차 3·4·5개 일괄 출력까지 장기 설계. 지정한 슬롯 안의 해당 qid 승인 후보를 먼저 **미사용 UID 우선으로 순환**하고 부족할 때만 재사용한다.
- 슬롯별 승인 UID가 없으면 임의 다른 목적·수학 난도로 대체하지 않는다. 누락된 sourceQid/slot 수를 보여주고 출제 범위를 재선택하거나 추가 제작 검수를 진행한다. HOLD·미검수 UID는 출제 풀에 포함하지 않는다.
- 9슬롯 작업량은 **제작 의무**, 학생 출시는 독립 게이트 통과한 문항만. 고유 semantic Blueprint 9개를 강제하지 않는다.
