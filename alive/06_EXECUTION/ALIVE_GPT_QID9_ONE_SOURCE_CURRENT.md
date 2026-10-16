## CURRENT HARD — 2026-10-17 최신 원장 지시: 제작 GPT 9문항 마감과 후속 3단계 분리
- **필독:** [문항별 QID9 제작완료·인계보고서 v1.1](ALIVE_QID9_PER_ITEM_E2E_COMPLETION_REPORT_CURRENT_v1.md). 수동 QID9의 “1번 진행해”는 해당 원본 qid A1~C3 **9개 제작·학생용 해설·오답 4개/문항·정본 RPM/Meta·난이도 두 축·SVG 필요성/필수 자산·세로 배분·자기검수·개별 22항목 보고서 9/9**를 마감하는 명령이다. `QID_AUTHOR_COMPLETE` 판정 이후 다음 qid 제작 가능.
- **제작자 완료 선행조건에서 제외된 후속 3종:** ① **독립 품질검수는 다른 GPT** ② **운영 Meta 영구 등록·Consumer/index parity는 main 등록 담당** ③ **운영 브라우저·인쇄 검사는 Codex**. 제작자는 완전한 최종 UID·source/sidecar·Meta·정답·해설·자산·SHA와 문항별 보고를 인계하고 각 후속 항목을 `PENDING_NEXT_OWNER/NOT_RUN`으로 남긴다. 후속 미실행만으로 저자 완료를 FAIL로 강등·다음 qid 진입 차단하지 않는다.
- **제작자 필수 품질은 완화하지 않는다.** SourceLock/9 UID/45 보기/36 실제 오답/학생 재현 해설/level+1~5 별도 판정/정본 RPM L1~L4·PT/TPL·Cross·Condition·Integration 설계와 UID별 source·sidecar 기록/실 SVG 필요성·역발문·자체검수/세로 균형/9×22 보고가 불완전하면 `QID_AUTHOR_INCOMPLETE`. 결과를 단순 9문항 생성만으로 PASS 선언 금지.
- 이전 2026-10-17 E2E 계약의 “독립 GPT·운영 DB/index·브라우저까지 제작자가 닫아야 qid 성공”이라는 서술은 **잘못된 책임 통합이므로 이 단락과 v1.1로 대체**한다. 후속 승인/배포 PASS는 실제 별도 담당자 결과로만 판정. 예약형 Library NEW14는 별도 계약.

## CURRENT HARD — QID9 반복 제작 핸드오프·가로/세로 정답 배분 (2026-10-15 원장 지시)
- 매 원본 qid × A1~C3 신규 제작은 [QID9 표준 실행 템플릿](GPT_QID9_CREATE_HANDOFF_TEMPLATE_CURRENT.md)을 사용한다. Notion [GPT QID9 유사문항 제작 표준계약 CURRENT](https://app.notion.com/p/3fa0e68bd69f81c4abdaffdcd1a969a1)을 Archive 시작 페이지에서 읽고 qid·시험지·브랜치·진도만 갱신한다.
- 각 qid의 객관식 9개 정답 위치는 ①~⑤ 각각 1~2회(2/2/2/2/1 순열)를 **HARD**로 적용한다. 한 qid 안의 3×3 세로 중복 여부는 *세로 누적 배분*이 아니다. 동일 슬롯 A1~C3 각각의 q01~직전 qid 누적 정답번호 빈도 5개를 별도로 계산하고, 기존 복수정답/비객관식은 별도 분모로 관리한다.
- 가로 HARD를 만족하는 보기순서 배치에서 세로 슬롯별 (max-min) 합 → 최악 슬롯 (max-min) → 슬롯 빈도 제곱합을 순차 최소화한다. 개선을 임의 보장하거나 답·발문·고정 보기를 조작하지 않는다. 후보 탐색과 불가능한 제약을 Receipt에 기록한다. [배분 검사기](tools/qid9-answer-distribution-check.mjs)를 생성/검증 단계에 실제 실행하며 미실행은 PASS 금지.
- Source Lock 실파일/원본 SHA·UID 결속, Primary RPM/L4/CrossConcept/Condition/Integration, level·difficultyBucket, 학생 재현 해설·45보기·36오답경로, 문제/해설 SVG 필요성·실파일/SHA, 문항별 Reverse Stem Check, 원격 HEAD 재조회를 거친다. 제작자 AUTHOR_COMPLETE와 독립검수·Consumer·main 출시 상태는 구별하고 NOT_RUN을 보존한다.
- 기존 다른 qid의 산출물 및 운영 데이터를 이 문서 업데이트만으로 수정·재검·출시하지 않는다. 수동 QID9 브랜치 제작 경로와 예약 Library 인계 경로를 혼동하지 않는다.

## CURRENT HARD — 제작 전 숙독·사전 설계·UID별 근거 기록 (2026-10-14)
- 작업자는 Notion 필독 라우터·생명주기·제작 5단계와 Git AGENTS·Meta·교육과정·해설·Visual/Golden 정본의 해당 조항을 본문까지 읽고, 각 문서의 경로·SHA·작업 적용 이유를 preflight에 기록한다. 검색 결과나 목차 확인만으로 숙독 완료 금지.
- 후보 UID 설계는 원본 Primary RPM L3·추가 풀이 단계·교육과정 내 허용 방법·질문·보기·문제/해설 SVG 필요성부터 정한다.
- UID별 5축 증거를 저장한다: ① level(하/중/상)과 difficultyBucket(1~5)의 독립 선정 이유 및 사고·조건·함정. A/B/C 위치로 난이도 자동 배정 금지. ② RPM L1~L4, PT/TPL, CrossConcept·Condition·Integration의 최종 풀이 단계/정본 권위·미적용 근거. ③ 해당 학년 교육과정에서 허용되는 공식·풀이와 학생이 재현 가능한 해설·선택지 전수 판정. ④ 문제 SVG ⑤ 해설 SVG 각 필요성, 실파일/SHA, 좌표·primitive·라벨·열린점·닫힌점·가독성, 실제 렌더 결과.
- 키만 입력·정답만 일치·SVG 파일만 존재한 상태를 PASS로 선언하지 않는다. 문항별 직접 증거 없는 경우 EVIDENCE_DEBT, 실행하지 않은 렌더·검수는 NOT_RUN. 각 UID에 근거와 변경영향 재확인을 저장한다. 기존 단위별 검수·예약 Library 인계 규정 유지.
## CURRENT HARD — 문제은행 전체 문제·해설 SVG 필요성 2축 전수판정 (2026-10-10 원장 지시)
- **문제은행의 모든 기출·ALIVE Generated·교재/유형/유사문항**에서 *문제용*과 *해설용* 시각자료의 필요성을 UID마다 **독립 판단**한다. 문자·수식만으로 문제를 풀 수 있어도 해설의 접선/교점/대칭/보조선/그래프/영역 관계를 학생에게 명확히 전달하는 SVG가 필요하면 반드시 제작한다. `VISUAL_OPTIONAL`도 실질 교육 효과가 있으면 ADD하며, 진짜 중복·장식은 근거 있는 EXEMPT.
- 기존 Visual 생성 스킬과 엔진을 재사용하고, source PNG 불변·교육과정·실제 primitive/렌더 검증을 유지한다. 기존 승인 문항의 품질 상태를 일괄 취소하지 말고 누락 UID의 시각 결함만 보강한다. 실측 누락률은 고유 UID × 문제/해설 전수조사 후 확정한다.
- 실행 정본: `docs/rules/04_VISUAL/Problem_Bank_Per_Item_Problem_Solution_SVG_Full_Audit_CURRENT_v1.md`. 문서 작성은 전수조사/SVG 생성/Chrome 완료가 아니다.

# ALIVE GPT QID9 — 원본 한 문항 × 9개 슬롯 작업 계약 CURRENT

## CURRENT — ALIVE Generated 해설용 SVG 누락방지 (2026-10-10)
- **기존 HARD 우선:** `docs/rules/04_VISUAL/도형의방정식_해설_SVG_독립검수_운영규정_v1.1.md` §2-2-1 및 §2-2-1-A에 따라 **2022 공통수학2 도형의 방정식(H22-C2-01~04)의 의미 있는 실제 도형/그래프 문항은 원칙적으로 해설 SVG 전수 필수**다. 임의 ‘유용하면 제작’ 판정으로 축소 금지. 미생성은 `SOLUTION_VISUAL_MISSING`. 예외는 실수 도형 퇴화/불성립과 같은 문항별 수학적 이유로 제한하며, 기존 실제 검증된 SVG는 REUSE 가능하다.
- **문제용 studentVisual TEXT_ONLY/NOT_REQUIRED는 해설용 solution SVG 면제 사유가 아니다.** 각 UID별 독립 해설 시각화 ADD/REUSE/EXEMPT/HOLD 판정과 교육적 근거를 남긴다.
- 정본 실행 규정: [QID9 해설 SVG 전수조사·신규제작 게이트](ALIVE_QID9_SOLUTION_SVG_AUDIT_AND_CREATION_GATE_v1.md). 기존 `apmath-visual-upgrade` 스킬·시각엔진·도형추출 v3·독립 geometry evidence를 재사용하며 새 엔진/규칙을 중복 도입하지 않는다.
- 팔마고 2026-10-10 정적 조사: q01~q20 180 UID, q04~q20 JSON 153개에서 해설 직접 SVG 연결 0개, q01~q03 27개는 초안 Markdown, q10 네 SVG는 **문제용**. 이 숫자는 학생 Consumer 실조회 결과가 아니며 향후 UID별 해설 시각 효용을 반드시 확정한다.

## CURRENT HARD — 다음 학교 신규 제작은 해설 SVG를 CREATE에 동봉 (2026-10-10)
- 학교 첫 진입에 Visual 전문 문서·엔진 스키마 필독 후 생성 중 문항별 PROBLEM_VISUAL/SOLUTION_VISUAL을 별도로 처리한다. 도형의 방정식 해설 SVG 기본 필수 규정 적용, 실제 지원 renderer로 SVG 및 SHA/geometry 증거를 **qid 제작 시점에** 동결. 문항 패키지만 commit하고 SVG를 사후 일괄 보강 대상으로 남기는 관행 금지.
- 상세 규정 [ALIVE 다음 학교 CREATE+SVG CURRENT](ALIVE_NEXT_SCHOOL_CREATE_WITH_SOLUTION_SVG_CURRENT_v1.md). **기존 팔마고 QID9는 별도 SVG 엔진 보강 라인**, 재제작/재검수 자동 소급 없음. Student Consumer·Chrome 시험은 실제 시행 시에만 PASS.



## CURRENT HARD — 수정 AI OWN_AND_FIX / 메타 확장 / main 후 학생 화면 기술 마감 (2026-10-09 형님 직접 지시)
- 모든 JS Archive·ALIVE·문제은행 수정/검수/메타/출시 실행자는 [수정 AI 책임·Meta 확장·출시 마감 CURRENT](docs/architecture/Archive_Correction_Owner_EndToEnd_Closeout_CURRENT_v1.md)를 필독한다. **OWN_AND_FIX는 승인 범위에서** 발견 결함을 직접 수정하거나 실제 기술 실행자를 연결해 해결 결과를 수납하는 책임이다. 해결 가능한 `NOT_TESTED`를 보고만 하고 끝내지 말고 실행·연결을 계속한다. 정확한 blocker로 더 진행할 수 없으면 해당 확인을 미실행/판단 불확실로 남기고 초안/미완료로 보고하며 PASS로 바꾸지 않는다.
- 기존 canonical key를 먼저 검색하되 필요한 CrossConcept·Condition·Generated L4 키가 없으면 사용자 추가 승인 대기 없이 **Generated-only 확장 registry**에 의미·parent·evidence·UID를 등록한 뒤 Source/metadata/Consumer/index에 영구반영한다. RPM LOCKED·원본 기출 및 무관한 UID 보호, 무근거 추정 금지.
- 원장 직접 Generated 품질 지시의 별도 인증은 생략. **main 병합 이후 필요한 실제 Chrome 학생 조회/출력 등 기술 검사는 수정 AI가 실제 결과까지 수납**한다. main write만으로 MAIN_DONE이 아니며, 실패하면 본 작업의 수리 대상으로 처리한다. 실제 미실행을 PASS로 꾸미지 않는다. 실행 가능한 경로가 있으면 복구·대체 경로·기술 실행자 연결을 이어 간다. 정확한 blocker가 남으면 시도·blocker·주체를 ledger에 기록하고 해당 검사를 미실행/불확실·미완료로 남긴다.


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
## CURRENT HARD — QID9 제작자 자기점검·완료 판정 (2026-10-12 사용자 직접 지시)
- **적용 범위:** 신규 ALIVE/QID9 A1~C3 생성 후보의 제작자에게 적용한다. 기출 원본 전사·조판 및 기존 R1/R2 blind 검수의 입력·의미는 바꾸지 않는다. 후보 저장과 source qid commit 전에 CREATE 안에서 수행하는 수정 루프이며, 별도 단계·독립 검수·새 runtime enum을 만들지 않는다.
- **학생 관점 역독해:** 최종 학생용 발문·보기와 필요한 표·그림만 먼저 읽고, 제작 의도·정답·해설로 빠진 정보를 보충하지 않는다. 대안 해석/모호성, 정답 유일성, 의도한 Primary L3의 결정적 사고가 실제로 필요한지와 더 쉬운 우회 가능성, 각 조건의 실제 필요성, 학교 시험 문장으로서의 자연성을 반박 점검한다. 이는 별도 blind-first 전체 풀이를 요구하지 않으며, 적용되는 기존 독립 검수 경로를 대체하지 않는다.
- **정답·오답·SVG 확인:** 객관식은 정답을 실제로 계산하고, 오답 네 보기 각각을 정확히 한 번 대응시켜 서로 다른 실제 오류 전제·연산에서 최종 보기값/판단이 재현되는지 짧게 계산한다. 문자열 차이만으로 통과시키지 않는다. 필요한 SVG는 의미 관계·점/라벨의 정체와 좌표를 수학 조건에 대조하고, 적용되는 실제 renderer에서 렌더 결과의 잘림·겹침·오표현을 확인한다. 실제 계산·렌더 확인 없이 읽어본 것만으로 완료하지 않는다.
- **수정과 증거 갱신:** 결함은 제작자가 승인 범위에서 직접 고친다. 발문·목표량·조건·보기·정답·해설·Meta·자산의 의미가 바뀌면 영향받는 기존 증거를 STALE로 두고 최종 후보 기준으로 영향 부분만 재계산·재확인한다. 오류가 해결되지 않았거나 재확인을 못 하면 `HOLD` / `QID_INCOMPLETE`; 무관한 UID나 unchanged 시험지 전체를 다시 검수하지 않는다.
- **기존 qid 기록:** 현재 source-qid별 self-review ledger/HANDOFF를 재사용한다. 각 UID의 기존 기록에 제작 의도·원본에서 유지한 점/변경점, L3/L4/CrossConcept가 풀이의 어느 단계에서 실제 필요한지, 실제 정답·오답 4개 계산과 역독해·SVG 근거, 발견 결함→수정→영향 재확인, 미실행·불확실을 간명히 남긴다. 기존 `originalStemOrIssue / reverseReadingFinding / decision KEEP|REVISED|HOLD / affectedFields / changedMathRecheck / remainingRisk`를 이어 쓴다. KEEP은 확인 근거, REVISED는 결함·수정·영향 재확인, HOLD는 미해결 원인·다음 조치를 기록한다. 근거는 짧은 계산·결함·수정·남은 항목으로 충분하며 모델 내부 사고과정이나 반복 SHA receipt를 요구하지 않는다.
- **기존 q01~q12 108개 후보 전환:** 재생성하지 않고 현재 후보를 기존 QID별 기록을 사용해 검수한다. 누락 근거는 지금 최종 후보·원본·필수 그림을 실제 확인하고 해당 계산·역독해·SVG 확인으로 보완한다. 당시 수행하지 않은 점검이나 확인 불가한 제작 의도/원본 변경점을 소급해 사실처럼 쓰지 말고, 현시점 확인·미실행·불확실로 구분한다. 이 전환은 108개 문항 파일의 일괄 수정/재제작을 허가하지 않으며, 결함은 기존 승인 범위의 표적 보정 경로로 기록한다.
- **검사별 상태와 완료 판정:** 확인 완료·오류 발견·미실행·판단 불확실을 구별한다. 오류를 고친 뒤 영향 확인을 마치기 전에는 완료로 바꾸지 않는다. `SELF_RECHECK_COMPLETE`는 해당 source qid 분모 전체의 각 적용 검사와 최종 후보 일치가 확인된 경우에만 선언한다. 필수 확인이 하나라도 미실행·불확실·미해결이면 `QID_INCOMPLETE`/초안·미완료로 남기고, `NOT_TESTED`는 범위 안에서 실행·대체 backend·담당자 연결을 계속 시도하라는 뜻이지 PASS 표기가 아니다. 끝내 막힌 항목은 정확한 시도와 blocker를 남기되 미실행/불확실 상태를 유지한다.
- **보고 범위 구분:** 작성 후보 수·검수 UID 분모와 검사 종류별 실제 확인 수/범위를 따로 보고한다. 파일 존재, Meta 정적 PASS, 배포 PASS는 문항 내용 품질 PASS를 증명하지 않는다. `SELF_RECHECK_COMPLETE`, 별도 GPT 공개답 검수/원장 직접 품질 승인, 기술 출시·MAIN_DONE은 서로 다른 판정이다. 일부 검사 결과를 전체 완료로 확장하지 않는다.
- **승인 경로:** 원장 직접 검수·main 반영 지시는 문서 상단의 `USER_DIRECTED_QUALITY_APPROVED` 경로를 따른다. 그 외에는 제작자 자체 점검과 별도 GPT 공개답 검수를 구분하고, `KEEP`/`REVISED`만으로 `GPT_OPEN_BOOK_REVIEW_PASS`를 주장하지 않는다.
- **회귀 근거:** 팔마고 q04 C2의 평가목표 이동, C3의 부자연스러운 `k+4t` 질문과 보기값 불일치, B2/C1의 오답 번호 누락·중복, C2 수정 뒤 남은 구버전 수치 증거는 점검할 의심 지점이다. 예시만으로 자동 FAIL·답 변경하지 말고 해당 UID의 실제 결함과 영향 증거를 확인해 표적 보정한다.

## CURRENT HARD — 시험지당 단일 브랜치 / 문항별 독립 커밋 / 누적 배치 검수 (2026-10-09)
- **대상:** 신규 ALIVE GPT QID9 생산 라인. **시험지 하나 = 보호된 작업 브랜치 하나**. 같은 시험지 원본 q1, q2, q3...의 설계·생성물은 한 브랜치에 순서대로 누적한다. **원본 source qid 1개 = 변경대상 파일만 포함한 독립 Git commit 1개**가 표준. 문항마다 새 브랜치·새 PR을 만들지 않는다. 필요 기술/검수/핸드오프 변경은 성격별 독립 commit으로 기록한다. `git add .` 또는 다른 작업 동시 stage 금지.
- **제작 단위와 검수 단위는 분리한다.** 제작은 qid 하나에 A1~C3 최대 9개 후보를 집중 설계·생성·자체검산한 뒤 SHA/UID/진도 ledger 기록 → 다음 source qid로 연속 진행한다. **매 qid마다 별도 GPT 품질검수를 기다리지 않는다.** 기술·수학적으로 미완성인 슬롯이 있으면 해당 qid의 OPEN/필요한 수정 사항을 checkpoint에 기록하고 다른 qid의 작업을 불필요하게 막지 않는다.
- 검수는 **여러 qid/UID가 모이면 한 번에 GPT 공개답 검수**한다. 권장 리뷰 크기 **약 45문항(9개×5 source qid)**, 컨텍스트/난도/시각자료에 따라 27·36·45 등 적응형으로 조절한다. 45개는 필수 최소 수량·HOLD 조건이 아니고, 형님이 요청하면 현재 쌓인 후보로 즉시 검수한다. 서로 다른 source qid의 분모·UID를 한 리뷰 ledger로 집계하고 결함은 해당 UID만 핀포인트 수정한다. 검수 순서와 판정은 아래 **생성 문항 독립풀이 후 공개답 대조 검수** 규칙을 적용한다. 학교 기출 R1/R2 freeze 의무는 별도로 유지한다.
- 누적 브랜치의 `WORKING_MANIFEST/HANDOFF`에는 시험지 source SHA, qid별 A1~C3 UID·설계/후보 경로, 생성/자가점검/검수/학생 공급 단계, **개별 commit SHA**, 다음 qid, 리뷰 대기 UID 분모를 유지한다. 새 GPT 대화는 동일 브랜치와 manifest에서 시작하며 끝난 qid를 반복 제작하지 않는다. 정확한 컨텍스트 사용률 50/80%를 볼 수 없으면 추정하지 않고 checkpoint로 인계한다.
- GPT 검수 PASS 또는 `USER_DIRECTED_QUALITY_APPROVED` UID는 별도 L4 승인 대기 없이 **동일 업무에서 Archive 2.0 Generated Consumer 등록·학생 조회/출제·main 운영병합**까지 마감한다. 신규 생성 후보 저장과 학생용 노출은 다른 상태이므로 실제 출시 전에는 PASS/MAIN_DONE이라 하지 않는다. Codex는 확정 변경의 Git 운영병합·remote readback만 담당한다.
- 2026-10-09의 `qid 하나 만든 직후 반드시 리뷰/출시 후 다음 qid`, `원본별 별도 작업 branch/PR`, `매 문항 마다 새 GPT 검수 창` 등 과거 문구와 충돌하면 **이 CURRENT가 우선**한다. 기존 q1/q2/q3 각각의 임시 PR은 새 통합 브랜치가 정확하게 readback 된 뒤 종료하고 추적 링크만 보존한다.


## CURRENT HARD — 생성 문항 독립풀이 후 공개답 대조 검수 (2026-10-12 사용자 최신 지시)
- **적용 범위:** 신규 ALIVE GPT 제작문항의 기존 검수 경로에 적용한다. 실제 기출 Archive 원문의 R1/R2/Blind-first 계약은 바꾸지 않으며, 사용자 직접 품질 승인으로 별도 GPT 검수를 생략하는 기존 경로도 유지한다.
- **독립풀이 먼저:** 후속 검수자는 최종 학생용 발문·보기·필수 그림/표만으로 먼저 독립 풀이를 확정하고, 정답과 보기별 참/거짓·짧은 계산을 기록한 뒤 작성자의 답·해설·설계/자가검수 근거를 연다. 먼저 고정한 결과와 대조해 불일치·앵커링을 확인한다. 공개 기록은 결론·짧은 계산·발견점만 남기며 모델 내부 사고과정은 요구하거나 저장하지 않는다.
- **발문 게이트:** 학생의 질문 대상·정의역·조건·경계·답형 이해, 대안 해석, 정답 유일성, 학교식 자연성, 의도한 L3 사고의 필요성과 쉬운 우회, 불필요한 조건, 보기·필수 시각자료의 정합을 검토하고 실제 결함을 고친다.
- **해설 추적 게이트:** 독립 결과를 고정한 후 저장 정답·상세 해설과 비교하여 핵심 등식·부등식·변형·분기·끝점·정의역·최종 선택지를 검증하고, 풀이 단계 누락·비약을 보강한다. 답과 해설의 자기일치나 그럴듯한 문장만으로 검증 PASS하지 않는다.
- 의심 사례(분수·근호·복수 해·경계·그림·역조건·보기 간 동치)는 해당 UID만 대체 계산·정확 경계 대입·결정론 검사/반례로 재확인한다. 필요한 수학·교육과정·정답 유일성·오답 4개 실제 경로·Meta·필수 asset 확인을 생략하지 않는다.
- 상태 `GPT_OPEN_BOOK_REVIEW_PASS`(독립 결과와 공개답 추적 + 발문·보기·Meta 확인 완료), `TARGETED_RECHECK`, `REVISION_REQUIRED`는 기존 검수 레저 설명 필드로만 사용한다. 별도 runtime enum을 만들지 않는다. 제작자 자체 점검과 후속 검수는 구별하며, 독립풀이 freeze 전에 작성자 근거를 보지 않는다.
- 검수 PASS 문항의 기존 Consumer/index/main 기술 마감과 UID별 오류 비활성화 경로는 유지한다. 실제 하지 않은 검산·렌더·브라우저 검사를 PASS라고 쓰지 않는다.

## CURRENT HARD — Gemini 역설계 5단계 × 발문 1순위 × QID별 9슬롯 (2026-10-09)
- **적용:** 기출 원본 그대로 추출·검수하는 업무는 원문과의 정확성·수학·조판을 검사한다. **새 문항 생성**에서만 학생이 보는 발문을 최우선 품질 산출물로 설계·심사한다. 혼동 금지.
- **0 경험 계획:** 한 원본의 잠근 실제 RPM Primary L3와 기존 경험 coverage를 확인하고, A1~C3의 학생 사고 목표·문형·표현·난도 사다리를 먼저 나눈다. 발문 초안 전에 각 슬롯의 결정적 사고·필수 조건(제거했을 때 달라지는 점)과 객관식 오답 4개의 서로 다른 실제 오류 경로도 정한다. A는 동일 풀이의 의도적 수치 instance도 유효. B/C는 결정적 판단·CrossConcept·경계·역산·복합 추론을 실제로 늘린다. 9슬롯 전부 제작 시도하지만 독립 의미 Blueprint가 9개여야 하는 것은 아니다.
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
