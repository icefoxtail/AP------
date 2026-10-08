# ALIVE LITE 실행 계약 — 다른 채팅·Codex용

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
