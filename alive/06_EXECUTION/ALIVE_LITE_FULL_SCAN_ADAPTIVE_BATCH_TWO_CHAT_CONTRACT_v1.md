# ALIVE LITE — 전체 스캔 선행·적응형 배치·2채팅 생산 검수 계약 v1

## CURRENT HARD — QID9 시험지 단일 브랜치 및 누적 공개답 검수 (2026-10-09)
- 신규 GPT 문항 생성은 `ALIVE_GPT_QID9_ONE_SOURCE_CURRENT.md` 최상단 CURRENT HARD에 따른다. **한 시험지=한 Git 작업 브랜치**, **원본 qid 1개=독립 제작 커밋 1개**. qid별 브랜치/PR을 새로 생성하거나 하나씩 별도 품질검수로 차단하지 않는다.
- 원본 문항은 한 번에 하나씩 설계·생성·자체검산 후 동일 브랜치에 누적한다. 완료/미완료·UID·SHA를 manifest에 기록하고 다음 qid로 계속 진행한다.
- 여러 qid가 모이면 공개답 기반 **발문 우선 → 해설 수학 추적 → 오답·메타** 순서로 **묶음 품질검수**. 권장 45UID(5×9), 27/36/45 등 적응형. 45개 이전에도 형님 지시 시 즉시 검수. HOLD 숫자 채우기 금지.
- GPT가 품질과 학생 공급을 판단하고, Codex는 이미 확정된 파일의 Git commit/push/main 운영병합·readback만 담당한다. 기존 기출 R1/R2 blind 계약과 RPM LOCKED 정본은 불변.

## CURRENT HARD — Generated-only 리뷰를 발문 우선·공개답 추적으로 전환 (2026-10-09)
- 신규 ALIVE 생성문항은 **정답·해설 공개를 허용하는 검수**로 전환한다. 검수자는 학교시험식 자연스러운 발문·보기·그림부터 평가하고, 해설을 실제 단계별로 따라가면서 모든 계산·정의역·경계·경우를 확인한다. 단순 승인/저장해설 그대로 믿기는 금지.
- 고위험·의심 UID만 대체 계산·정확 경계·반례 등 표적 재검한다. 9문항의 답/해설을 먼저 볼 수 있으므로 **blind freeze evidence를 의무화하거나 새 채팅에서 정답 가린 재풀이를 강제하지 않는다**. 신규 Generated 전용 절차이며 기존 Archive 기출 Blind-first는 불변.
- 질문·답형 일치, 정답 유일성, 오개념 5지, 학생 풀이 교육성과 L3/L4·CrossConcept, 수업시점 교육과정을 빼먹지 않는다. 바로 PASS한 UID는 추가 사람 승인 없이 기술 등록·main·Archive2 조회까지 닫는다.

## CURRENT HARD 2026-10-09 — GPT QID9 사용자 변경 (기존 배치 용량 규칙보다 우선)
- 이번 신규 ALIVE 생성은 시험지 전체를 여러 L2 batch로 한 번에 생산하는 구 계약 대신 **원본 source qid 정확히 1개 단위로 설계·실행**한다. 한 qid에 A1~C3 아홉 슬롯 각각을 설계하고 완성 후보 9개 제작을 필수 목표로 둔다. 9개가 안 나오면 완료가 아니라 QID_INCOMPLETE로 인계한다. 품질 나쁜 내용을 숫자 맞추려고 승인하지 않는다.
- A 3개(반복 숙달, 유의미한 수치변형 가능), B 3개(사고 확장), C 3개(실전 평가). 생성 9개와 신규 의미적 Blueprint 9개는 다르다. 어느 슬롯도 사전 고정 난도/교차개념을 억지 강제하지 않는다.
- GPT가 9문항 설계·생산과 GPT 별도 독립검수 및 품질 수정·공급 판단을 책임진다. Codex는 GPT가 확정한 산출물의 Git 운영병합·remote readback만 담당한다. 현재 상세 계약은 `alive/06_EXECUTION/ALIVE_GPT_QID9_ONE_SOURCE_CURRENT.md`.
- 한 qid checkpoint가 물리 Git에 저장되면 핸드오프 MD 및 다음 대화 붙여넣기 프롬프트를 기록한다. 실제 컨텍스트 50/80%는 시스템이 제공하지 않으면 측정 불가로 표기한다. 이전 stage 재실행·완료 슬롯 재생성을 강제하지 않는다.

## CURRENT USER OVERRIDE — GPT 제작·검수 / Codex Git 병합 전용 (2026-10-09)
- 본 ALIVE 신규 생성문항 라인은 GPT가 A/B/C 학습 목적별 설계·발문·정답·상세 해설·Meta 품질 확인·실제 검수·필요한 수리를 직접 책임진다. Codex는 GPT가 확정한 파일의 지정 범위 Git 커밋·push·main 운영병합·remote readback만 담당한다.
- 아래의 'CREATE=Codex', 'REVIEW+MAIN=Codex'로 읽힐 수 있는 과거 분업 지시는 이 범위에서 적용하지 않는다. 실행 단계/품질 HARD gate 자체는 유지한다. 코덱스용 문서에는 기존 후보의 재설계/폐기 정책을 명령하지 않는다.

## CURRENT — 3×3 목적형 제작 보강 (2026-10-09)
- B(Blueprint 설계) 전에 원본별 A 반복 숙달 / B 사고 확장 / C 실전 평가 목적과 실제 학생의 사고 경험을 선택한다. 각 목적에서 최대 3개(원본당 최대 9개)는 구성의 상한이며 필수 생산량이 아니다.
- A는 원본 사고·풀이를 유지한 유효 수치변형도 교육적으로 가치 있다. 단순 수치변형은 고유 Blueprint가 아니라 해당 유형의 별도 instance로 집계한다. 선택한 ALIVE MODE와 STRICT_VARIANT 증거 요건은 그대로 준수한다.
- B는 새로운 판단·발문 목표·풀이 진입점이 필요하고, C는 교육과정 내 실전 변별력과 자연스러운 조건 종합을 요구한다. A/B/C 목적 태그와 ALIVE 런타임 proof class는 별개다.
- B와 C에서 RPM L4 명칭에 특정 풀이가 없다는 사실만으로 새 유형을 인정하지 않는다. 원본과 최종 발문의 질문 대상·결정적 단계·조건을 비교한다.
- C 완성 시 한국어 상세 해설, 개념 용어, 발문과 선택지의 답 형식 일치, 오개념에 기초한 5지 오답, 필요한 시각자료를 확인한다. 최종 UID와 기존 Blueprint 수/수치 instance 수는 각각 기록한다.

## CURRENT ADDENDUM — 두 번째 채팅의 최종 종료 경계 (2026-10-08)
- 제2채팅 REVIEW+MAIN은 독립 수학/보기/Meta 검수 및 핀포인트 수정 이후 **Archive 2.0 Generated Bank Consumer DB 물리 등록과 학생용 검색·불러오기·선택 검증**까지 반드시 직접 수행한다. 완료 조건은 `ALIVE_LITE_REVIEW_CONSUMER_DB_CLOSEOUT_v1.md`가 정한다.
- 정상 리뷰 PASS / main 브랜치에 shard 저장만으로 최종 완료가 아니다. 기존 original qid_v1 consumer index는 ALITE UID용으로 직접 덮어쓰지 않는다. 미지원 adapter는 최소 범위 기술 구현 및 검증 후 완료; 불가 시 DB 미등록 기술 부채를 별도로 남긴다.

날짜: 2026-10-08 KST
상태: CURRENT / 이 문서가 기존 최대생산량 실험과 source-qid exhaustion의 **실행 순서**에 우선함. 기존 원본 Archive 검수계약은 그대로 유지.

## 1. 지시어별 실제 완료 의무
**첫 번째 사용자 지시 “1단계 진행해 / 시작해”**는 문항 생성 지시가 아니다.
- 최신 main + 원본 SHA, 원본 모든 qid/학생용 발문/보기/원본 풀이/필수 그림·표/교육과정/RPM L3·L4를 한 번 전수 스캔한다.
- 모든 qid에 난이도, 결정적 풀이 단계, 확장 가능 L4/새 Blueprint, 독립 사고량, 시각 부담, 인접 문항의 범위·형태를 기록한다. 정확한 그림/원본 자료를 못 읽으면 해당 qid는 SOURCE_VISUAL_UNREAD로 명시.
- **시험지 전체 적응형 배치 계획을 먼저 확정·저장한다.** 쉬운 기본형은 원본 6~8문항, 표준형은 4~6문항, 고난도·복합형은 2~4문항을 시작점으로 삼되 반드시 실제 원본 풀이구조/확장 여력을 보고 자율 조정. 앞 번호가 쉽다는 가정만으로 묶지 말 것.
- 전 원본 qid가 배치 중 정확히 한 번 포함되도록 누락·중복 검증. 각 배치에 원본 번호, 이유, 예상 탐색 L3/L4, 시각자료, 위험도, 의도된 시작 순서/완료조건 기재. 질문할 필요 없이 설계안을 Git branch의 `00_FULL_SCAN.json`, `01_ADAPTIVE_BATCH_PLAN.json`, 요약 CURRENT/ledger에 저장·push·remote readback.
- **첫 단계에서 기본적으로 신규 문제를 만들지 않는다.** 사용자가 분명히 “스캔·계획 후 첫 배치까지”라고 추가 지시한 경우만 수행.

**이후 “다음 진행해 / 2단계 진행해”**는 계획된 다음 미완료 배치 딱 하나를 의미한다.
A. 해당 배치의 모든 원본 풀이/메타 심층 분석 → 원본별 진짜 L3/목표 L4 확정.
B. **문제부터 만들지 않고** 배치 전체의 Blueprint 설계안 선완성 및 Git `batch-design` 저장: 각 원본에 기존 RPM L4 후보, 신규 extension L4(정본 아님), Condition/CrossConcept/Integration, 목표/결정적 풀이구조, 중복 및 교육과정 위험, `ACCEPT/DUPLICATE/L3_DRIFT/CURRICULUM_VIOLATION/NO_VALID_MATH_STRUCTURE/HOLD` disposition. 미개척 L4·제외 사유 기록. Blueprint를 검토한 뒤에만 C 실행.
C. ACCEPT Blueprint별 완성 학생용 발문·정답·5지 보기(객관식)·자세한 해설·RPM L1~L4·난이도·출처 마커를 원패스 제작. 숫자변형은 별도 유형으로 부풀리지 않는다. SVG 필수면 수학 명세·자산 생성, 이후 비주얼 일괄 업그레이드로 넘긴다.
D. L2별 생성 shard·metadata·uid index·manifest·batch ledger·receipts를 같은 **CREATE 전용 브랜치**에 저장 → UID 중복/구조/자체 수학 정합 확인 → commit/push/readback. 해당 배치의 모든 원본을 `SOURCE_EXPANSION_DONE` 또는 `SOURCE_CONTINUATION_REQUIRED`로 닫음. 미완성 항목은 근거 있는 HOLD.
- 하나의 배치를 A, B, C, D 중간에서 종료하고 완료로 보고하지 않는다. 중간 checkpoint는 후속 복구용일 뿐 batch DONE 아님.
- 완료하면 생성 문항 수·설계 Blueprint 수·중복/보류·다음 batch 번호·Git SHA만 간결 보고. **사용자 “다음 진행해”를 기다린다.** 자동으로 다음 배치 전체를 실행하지 않는다.

**계획된 모든 배치 완료 시** CREATE 브랜치에 대상 시험지의 문항·해설·메타·유형 설계·manifest/index/receipt를 일체화. 독립 REVIEW에 handoff. 생성자가 독립 PASS, main 출고를 대신 선언하지 않는다.

## 2. 두 번째 채팅창 REVIEW + MAIN
- 독립 채팅에서 CREATE 브랜치를 fetch하고 실제 UID/원본·각 batch 설계 ledger를 읽는다.
- 생성 정답·해설 공개 전 학생용 발문·보기·문제 풀이에 필수적인 시각 조건을 기준으로 **모든 후보를 독립 풀이·정답 동결** → 저장된 답·풀이 비교 → L3/L4/교육과정/해설/중복/문항 이상함(억지 조건·선지/문장/출제 목표) 확인.
- 오류 문항만 핀포인트 수정·다시 검증. 정상 문항 전수 반복검수 금지. 불량은 HOLD/FAIL 분리.
- APPROVED 후보만 실제 Generated Bank 공급 권한/인덱스에 반영, **같은 REVIEW 채팅이 main commit/push/remote readback까지 책임**. 다른 채팅/마스터 불필요.
- SVG 시각적 폰트/라벨/미관 전수 검수는 현재 출고 이전 의무 아님. 단, SVG에 제시된 수학 정보가 풀이와 불일치하거나 필수 그림을 해석할 수 없는 경우 math PASS 금지. 추후 Codex 일괄 업그레이드 큐에 기록.

## 3. 품질·속도 구분
- 시간/문항 수 할당량 강제 금지. **첫 단계 전수 스캔과 적응형 계획의 질**이 우선.
- 배치 크기는 고정 수가 아닌 추정 → 실제 수학 풀이/확장 여력에 따라 조정 가능. 조정 시 `planRevision` + 사유 + 나머지 qid 누락 여부 기록.
- 중간 설계가 없어 숫자만 바뀐 문항이 대량 나온 경우 해당 배치 DONE 불인정.
- original source read-only. RPM canon LOCKED 유지; extension은 별도 candidate registry.
- 시험지 간 우선순위: **최신연도 먼저(2026 전체 → 2025 전체)**; 실제 원본 존재·SHA 필수.
- 채팅 첨부 ZIP만 존재하면 Git 저장으로 간주하지 않는다. 생성 브랜치 remote readback을 확인한다.

## 4. 실행 예시 (원본 23문항은 실제 스캔 후 확정)
사용자 “1단계 진행해” → 원본 23개 전체 스캔, 가령 q1~7 / q8~12 / q13~16 / q17~19 / q20~23 배치 계획만 저장.
사용자 “다음 진행해” → q1~7 전부 A→B→C→D+커밋.
다음 “다음 진행해” → q8~12 A→B→C→D+커밋.
모든 CREATE 완료 후 독립 REVIEW 채팅이 생성 결과 전체 검수·수정·main 반영.

## 5. 다른 채팅의 첫 프롬프트
`origin/main fetch → AGENTS/nested → alive/06_EXECUTION/ALIVE_LITE_CONTINUATION_CURRENT.md → 본 계약 → 학교 00~07 → 현재 phase 결정. 최초 “1단계”면 시험지 전체 scan/적응형 batch plan 저장만. “다음 진행해”면 next planned batch A→B→C→D 완결·branch readback. 2차 채팅은 REVIEW+MAIN.`

## CURRENT HARD — 정답 위치 설계 및 ③ 편중 금지 (2026-10-08)
- B Blueprint 설계 때 수학 정답값·오개념 오답·**①~⑤ 목표 정답 위치 분포**를 먼저 잡는다. C 제작 시 수학 정답을 변경하지 않고 적절한 보기 순서/정답 기호를 반영한다. 수의 오름차순 등 보기 순서 고정 사유는 예외로 기록.
- D batch 저장시 answer position histogram + 5지 유일정답 확인. 조정 가능한 신규 객관식에서 한 자리 정답 비중 >40%면 재검토 경고.
- 실제 효천고 파일럿 94개에서 **③ 63개(67.0%)** 발견: 정본 `alive/06_EXECUTION/ALIVE_LITE_ANSWER_POSITION_DESIGN_CONTRACT_v0.1.md` 참조. REVIEW+MAIN에서 별도 정답 독립검수와 함께 핀포인트 보기·정답기호·해설 참조 수정.

## CURRENT REVIEW HARD — 답 위치 분포 + 오답 설계 품질 보고 필수 (2026-10-08)
- REVIEW가 객관식 분모와 ①~⑤ 정답 위치 전수 빈도/비율을 보고한다. ③ 등 한 번호 편중 >40%는 finding.
- 보기 배열 순서만 무작위로 섞거나 ±등차 방식으로 틀린 보기를 추가하는 자동보정은 최종 PASS 불가. **수학적 오개념에 기반한 오답 재설계 + 보기의 자연스러운 질서 + answer/solution 동기화 + 5지 유일정답**을 확인할 것.
- 효천고 수치형 19문항의 1차 위치 보정은 별도 repair branch의 미승인 초안이며, main 반영 전 품질 게이트가 필요함.
- 정본: `alive/06_EXECUTION/ALIVE_LITE_ANSWER_POSITION_REVIEW_REPORT_GATE_v0.1.md`.
