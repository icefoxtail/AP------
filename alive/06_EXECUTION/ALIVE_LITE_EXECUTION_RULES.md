# ALIVE LITE 실행 계약 — 다른 채팅·Codex용

## CURRENT HARD — 생성 문항 전용 Gemini 0~5 + 역발문 검증 + 답 위치 분산
- 신규 문항 1 qid × 9슬롯은 `ALIVE_GPT_QID9_ONE_SOURCE_CURRENT.md`의 2026-10-09 Gemini 역설계 5단계 계약을 **첫 진입 기준**으로 읽고, 발문 품질을 먼저 판정한다. 기존 기출 보존·추출 검수의 원문 동일성 검사와 구분한다.
- 객관식 9슬롯은 보기 정답 위치 ①~⑤ 각각 1~2개를 목표로 한다. 한 위치(특히 ③)가 3개 이상이면 오개념 보기/배열을 점검해 수학적으로 동치인 재배열로 분산한다. 임의 정답 변조 금지. 기출 기존 정답 위치를 수정하는 요구가 아니다.
- 제작자 1차 자체검산은 독립검수가 아니다. 다음 별도 GPT 리뷰에서 학생 입력만 독립 풀이하고 역발문 재구성 후 공개 답 비교한다.

## CURRENT USER OVERRIDE — 2026-10-09 L3·발문·자동출시
- 새 QID9의 최우선 실행은 `ALIVE_GPT_QID9_ONE_SOURCE_CURRENT.md` 상단 CURRENT USER AUTHORITY 절이다. **L3 잠금 → 기존 L4/Generated EXT 탐색 → CrossConcept/Condition/Integration 조합 → 9문항 기획** 후 학생용 발문부터 실제 내신 품질을 확인한다.
- GPT 독립검수 1회 PASS 후 해당 UID는 별도 EXT L4 승인·active binding 요청·중복 분류 정리 없이 Archive 2.0 Generated Consumer에 즉시 등록하고 main에 병합한다. Generated EXT L4는 별도 GENERATED_ACTIVE namespace로 기록해 RPM LOCKED를 건드리지 않는다.
- Codex는 품질판정 금지, 지정 파일 Git 병합만. 출시 가능한 PASS를 '마스터 승인 대기'로 보류하는 기존 문구는 신규 QID9에 적용하지 않는다. 기술적 조회/직렬화 오류는 수정해 닫고 미실행을 PASS라고 하지 않는다.
- 학교식 한국어 발문 → 독립 수학·교육과정/5지 → 한국어 해설 순서로 판단한다. 학생 사용 후 개별 UID 불만·원장 결정으로 비활성화할 수 있도록 진단 정보 보존.

## CURRENT HARD — GPT 원본 1문항 × 9슬롯 직렬 제작·검수 / 연속 핸드오프
- 상세 실행·모의고사 3×3 슬롯 선택 및 미사용 UID 순환 설계 정본: `alive/06_EXECUTION/ALIVE_GPT_QID9_ONE_SOURCE_CURRENT.md`. 이 계획의 제품 미구현 영역은 구현·출시 완료로 보고하지 않는다. (2026-10-09)
- 형님 직접 지시: **source qid 한 개씩만** 다룬다. 해당 문항의 A1·A2·A3(반복 숙달), B1·B2·B3(사고 확장), C1·C2·C3(실전 평가) 총 **9개 슬롯을 모두 설계하고 완성 후보 제작을 목표가 아니라 필수 작업량으로 배정**한다. 9개가 완성되지 않으면 숫자를 채운 척하지 말고 해당 qid를 `QID_INCOMPLETE`로 기록하고 누락 슬롯의 이유·다음 작업을 남긴다. 미완성인데 다음 qid를 자동 개시하지 않는다.
- 9개 슬롯은 모두 실제 완성된 발문·보기(객관식 5지)/답·한국어 상세 해설·수학 검산·Meta·교육 목적이 있어야 한다. A는 의도된 수치변형도 허용하되 서로 다른 수치 인스턴스 UID를 지닌다. B는 새로운 사고/역추적/경계·조건 판단, C는 실전 조건 종합·난이도 상승을 우선한다. **A/B/C 교육 목적 슬롯 ≠ 고유 RPM L3/L4·새 Blueprint 9개**다.
- **각 슬롯의 수학·발문 품질은 GPT 책임**, 별도 독립 GPT 검수 시 이전 답·해설을 숨겨 최초 풀이 동결 후 비교한다. 한 세션에서 CREATE한 산출물을 그 세션 자체검산으로 `INDEPENDENT_REVIEW_PASS`라고 기록하지 않는다. 결함 수정·교육적 승인도 GPT 담당. Codex는 이미 확정한 파일의 Git commit/push/main merge/remote SHA readback만 수행한다.
- 작업 checkpoint는 qid별 `sourceQid, sourceGitBlob, stage, A1~C3[UID, path, candidateSha, qualityState, releaseState, reason], completedCount, nextExactStep, headSha`를 Git에 기록한다. 시험지 전체 문항을 세션 한 번에 지시·적재하지 않는다. 이미 완료/검수한 슬롯은 SHA 동일하면 무의미하게 다시 제작하지 않는다.
- **컨텍스트 임계 사용률 80%를 직접 측정할 수 없는 ChatGPT 창에서는 실제 사용률을 안다고 주장하지 않는다.** 새 창 인계가 필요하다고 판단되는 즉시, 또는 안전하게 한 qid를 닫을 때, 현재 Git SHA·완료 문항·열린 finding·다음 qid·인계 프롬프트를 가진 물리적 HANDOFF 문서를 남기고 사용자에게 새 대화에서 이어받도록 안내한다. 50/80%처럼 근거 없는 숫자 추정 통보는 금지한다.
- 기존 팔마고 27개는 main에 **candidate 보존 완료**. 등록 4 / 공급 HOLD 23의 학생 접근 gate는 별개이며, 여기서 9슬롯 정책만으로 강제 해제하지 않는다. 최초 pilot은 팔마고 원본 q1부터 qid 단위로 새 UID namespace를 사용하여 기존 27개와 충돌하지 않게 한다. 기존 원본 JS 불변.


## CURRENT HARD — ALIVE 생성 품질은 GPT 직접 책임 / Codex는 Git 운영병합만 (2026-10-09 형님 직접 지시)
- 본 ALIVE 신규 문항 제작·검수 운영에서 수학 문항의 기획·A 반복 숙달/B 사고 확장/C 실전 평가 설계·독립 풀이·발문/보기/해설/교육적 가치 판정·수리·학생 공급 승인과 Meta 정확성 판단은 GPT 직접 품질 작업으로 수행한다.
- Codex에 신규 수학문항을 자동 제작시키거나, Codex 자체 PASS·검수로 학생용 품질을 승인시키지 않는다. Codex 담당은 **GPT가 확정해 전달한 변경 파일의 지정 범위 Git 커밋·push·main 운영병합·remote readback**으로 제한한다.
- 기존 하단의 Codex CREATE/REVIEW/Consumer 판단 위임 문구는 본 ALIVE 품질 책임 범위에서 이 CURRENT에 의해 대체된다. 다른 Archive 시험지 제작·코드 엔진·필수 validator 계약까지 자동 변경한다는 뜻은 아니다.
- 3×3 신규 운영에서는 원본당 9슬롯 전부 제작 목표를 필수 배정하되 품질 미달 시 QID_INCOMPLETE로 유지한다. A의 의도된 수치변형은 인정하되 고유 Blueprint 수와 분리한다. 필요 시 GPT가 독립된 품질 기록에 따라 공급 보류를 유지한다. 이 Codex용 문서에는 기존 문제은행 폐기 판단·명령을 위임하지 않는다.

## CURRENT — Codex 3×3 문항 제작 품질 방향 (2026-10-09)
- 원본마다 A 반복 숙달, B 사고 확장, C 실전 평가 중 필요한 교육 목적을 선택한다. 각 목적별 3개, 총 9개 슬롯을 실제 설계·완성 대상으로 배정한다. 불충족 시 완료로 선언하지 않는다.
- A 반복 숙달은 원본의 핵심 풀이를 보존하는 수치변형도 유효하다. 단, 새 의미적 Blueprint 수와 수치 인스턴스 수를 구분하고 실제 ALIVE MODE의 조건을 지킨다.
- B는 새로운 결정적 판단 또는 풀이·조건 구조를 요구하며, C는 자연스러운 내신형 종합 판단과 오개념 선택지 설계를 우선한다. 계산량만 늘려 B/C를 주장하지 않는다.
- 교육 목적 A/B/C와 ALIVE 런타임 MODE/검증 등급은 서로 다른 분류다. 기존 정본과 독립 검증 게이트를 유지한다.
- 공통 품질: 발문이 요구하는 답의 종류와 보기 형식 일치, 한국어 학생 해설, 교과 용어 정확성, 필요한 그림/표 완결, 5지 정답 유일성 및 교육적 오답을 확인한다.
- 신규 Consumer 등록은 정본 마스터의 키와 표기(labelKo)를 함께 대조한다. layoutTag는 현행 직렬화·표시 계약의 허용값을 확인한다. Chrome 표시 PASS는 콘텐츠 품질 PASS를 대신하지 않는다.

## CURRENT FINAL-CLOSURE OVERRIDE — REVIEW가 Consumer DB까지 마감 (2026-10-08)
- REVIEW+MAIN 담당자는 `ALIVE_LITE_REVIEW_CONSUMER_DB_CLOSEOUT_v1.md`를 읽는다. 독립 검수 → 정답 위치/5지 오개념 검수 → 필요 핀포인트 수리 → 승인 UID 확정 → Generated Consumer 등록·학생용 실제 검색/조회/선택 → main push·readback까지 한 채팅이 책임진다.
- `generated UID main 저장` ≠ `consumer DB 등록` ≠ `student supply verified`. ALITE UID를 기존 original qid_v1 UID로 강제 변환하지 않는다. Consumer adapter 미지원 시 기술 구현/검증을 닫기 전 DONE 선언 금지.
- 효천고 94 후보/기존 92 기록은 ③ 편중 규칙 도입 전 snapshot. answer-position repair branch 수정은 별도 independent review 전까지 소비 불가. 최종 approved와 HOLD를 재확정한 뒤 등록.


상위: `alive/05_DESIGN/ALIVE_GPT_LITE_GENERATION_FIRST_EXECUTION_v0.6.md`, `ALIVE_GPT_LITE_MASS_EXPANSION_WORKER_CONTRACT_v0.3.md`, `ALIVE_GPT_LITE_CURRICULUM_HARD_GATE_v0.4.md`, `ALIVE_GPT_LITE_GRAPH_SVG_TWO_PASS_OPERATION_v0.1.md`.

## 최소 실행
- 최신 main 및 target 원본 readback → 원본 수·원본 SHA → L3/L4 canonical → 생성 batch(원본 1~3 qids, 출력 수 자율) → 학생용 발문/5지/정답/해설/Meta → L2별 shard/meta UID 중복 검사 → receipt/manifest/index → SHA-bound 원격 readback.
- 유사 숫자변형은 의미 Blueprint 신규 유형으로 과대 계상 금지. 범위 위반/잘못된 보기·답/출처 혼동 금지. 원본 read-only, 신규 RPM extension은 candidate registry에서 심사.
- stage 상태별 분모: source qids, generated candidates, unique UIDs, imported, independent verified, visual required, SVG produced, Codex render verified, DB registered, student supply eligible.
- 생산 후 수학/해설 독립검수. 렌더는 **시각 필수 문항만 Codex**; 렌더 완료 증거는 실제 화면 캡처, 이미지 asset SHA, 문항 UID; pre-render 상태는 검수 PASS 불가.
- SOURCE 불명/ZIP이 sandbox에만 있음/metadata lineage 충돌: BLOCKED + 실제 근거. 임의로 재생성하거나 원래 출처인 척하지 않는다.
- 원본 수정·Archive2 runtime 변경은 본 생산 작업 권한 밖. 필요하면 별도 계약/검수.

## 다른 창용 단문
`origin/main fetch → alive/06_EXECUTION/ALIVE_LITE_CONTINUATION_CURRENT.md → ALIVE_LITE_EXECUTION_RULES.md → ALIVE_LITE_SCHOOL_ROSTER_LATEST_FIRST.md → NEXT 학교 폴더 00~07 → 첫 eligible 작업 1건을 실제로 마감 → Git remote readback 후 ledger 상태 갱신. SVG만 Codex 렌더. 기존 main 미커밋 변경 금지.`

## CURRENT OVERRIDE — 단일 세션 최대 생산량 실측 (2026-10-08)
- 복성고 2026 1학기 기말부터 CREATE 한 채팅은 원본 시험지 전체를 읽고 **실제 완료 가능한 문항까지 연속 대량 생산**한다.
- 과거의 `원본 1~3 qid` 실행 상한은 이번 ALIVE capacity 파일럿에 적용하지 않는다. shard/checkpoint는 보존 목적이며 대화 분할 기준이 아니다.
- 생성 채팅 = CREATE + candidate Git 저장. 별도 검수 채팅 = 독립 수학검수·수정·main 반영까지. SVG 개별 시각 렌더는 지금 bottleneck으로 만들지 않는다.
- authority: `alive/06_EXECUTION/ALIVE_LITE_CREATE_CAPACITY_STRESS_PILOT_v0.1.md`.

## CURRENT HARD OVERRIDE — source qid별 Blueprint 탐색 게이트 (2026-10-08)
- **하나의 채팅 세션은 시험지 전체를 연속 생산하지만, source qid 하나를 완료로 판정하기 전에 탐색-출제 2단계를 분리한다.**
- source 이해 → 관련 RPM L4/extension·CrossConcept/Condition/Integration Blueprint 우선 탐색 → 후보 disposition(ACCEPT/DUPLICATE/L3_DRIFT/CURRICULUM_VIOLATION/NO_VALID_MATH_STRUCTURE/HOLD) → ACCEPT 문항 발문/해설/Meta 원패스 → 미개척 L4 사유와 generated UID ledger 동결 → 다음 원본.
- **4~6문항 제작 또는 생산량 목표 달성만으로 source 완료 금지.** 확장 미완료인 경우 SOURCE_CONTINUATION_REQUIRED.
- 정본: `alive/06_EXECUTION/ALIVE_LITE_SOURCE_BLUEPRINT_EXHAUSTION_CONTRACT_v0.1.md`.

## CURRENT HARD OVERRIDE — 전체 스캔 → 계획 배치별 A/B/C/D (2026-10-08)
- **사용자가 '1단계 진행해'**: 시험지 전체 qid를 먼저 스캔/난이도·유형·확장 여력 평가하고 **적응형 배치 전체 계획을 저장·푸시한 뒤 보고**. 기본적으로 이때 문제 생성 금지.
- **이후 '다음 진행해'**: 미완료 계획 배치 하나를 골라 A 원본 심층분석 → B 배치 전체 Blueprint 설계 저장 → C 완성문항 생성 → D L2 shard·메타·ledger 브랜치 commit/push/readback까지 한 번에 끝내고 보고. 다음 지시 전 다른 배치 자동 착수 금지.
- 쉬운 문항은 6~8개, 표준 4~6개, 복합 2~4개가 시작점이며 실제 전수 스캔 결과로 조정.
- 모든 배치 후 **CREATE branch를 별도 REVIEW 채팅**이 독립 수학 검수·핀포인트 수정·main 병합·원격 readback까지 마감. SVG의 미관/렌더는 추후 일괄 업그레이드.
- 새 실행 authority: `alive/06_EXECUTION/ALIVE_LITE_FULL_SCAN_ADAPTIVE_BATCH_TWO_CHAT_CONTRACT_v1.md`. 과거 한 세션 전체 문항을 무조건 연속 생산/1~3 원본 배치라는 지시와 충돌하면 이 규칙 우선.

## CURRENT HARD — 정답 위치 설계 및 ③ 편중 금지 (2026-10-08)
- B Blueprint 설계 때 수학 정답값·오개념 오답·**①~⑤ 목표 정답 위치 분포**를 먼저 잡는다. C 제작 시 수학 정답을 변경하지 않고 적절한 보기 순서/정답 기호를 반영한다. 수의 오름차순 등 보기 순서 고정 사유는 예외로 기록.
- D batch 저장시 answer position histogram + 5지 유일정답 확인. 조정 가능한 신규 객관식에서 한 자리 정답 비중 >40%면 재검토 경고.
- 실제 효천고 파일럿 94개에서 **③ 63개(67.0%)** 발견: 정본 `alive/06_EXECUTION/ALIVE_LITE_ANSWER_POSITION_DESIGN_CONTRACT_v0.1.md` 참조. REVIEW+MAIN에서 별도 정답 독립검수와 함께 핀포인트 보기·정답기호·해설 참조 수정.

## CURRENT REVIEW HARD — 답 위치 분포 + 오답 설계 품질 보고 필수 (2026-10-08)
- REVIEW가 객관식 분모와 ①~⑤ 정답 위치 전수 빈도/비율을 보고한다. ③ 등 한 번호 편중 >40%는 finding.
- 보기 배열 순서만 무작위로 섞거나 ±등차 방식으로 틀린 보기를 추가하는 자동보정은 최종 PASS 불가. **수학적 오개념에 기반한 오답 재설계 + 보기의 자연스러운 질서 + answer/solution 동기화 + 5지 유일정답**을 확인할 것.
- 효천고 수치형 19문항의 1차 위치 보정은 별도 repair branch의 미승인 초안이며, main 반영 전 품질 게이트가 필요함.
- 정본: `alive/06_EXECUTION/ALIVE_LITE_ANSWER_POSITION_REVIEW_REPORT_GATE_v0.1.md`.
