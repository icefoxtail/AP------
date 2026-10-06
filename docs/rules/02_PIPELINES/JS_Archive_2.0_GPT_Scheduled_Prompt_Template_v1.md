# JS Archive 2.0 — GPT Scheduled Prompt Template v1

status: CURRENT / GPT 2.0 COPY SOURCE ONLY
qualityContractVersion: `JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006`

## 0. ABSOLUTE ROUTING HARD

이 파일은 GPT 예약 2.0의 유일한 예약 prompt copy source다.
새 GPT 2.0 worker는 legacy `docs/rules/02_PIPELINES/JS_Archive_Scheduled_Worker_Prompt_Canonical_Template_v1.md`를 읽거나 copy source로 사용하지 않는다.

필독 순서:
`GPT 작업 전 필독 라우터 → Archive 2.0 / JS Archive 시작 페이지 → Archive 전체 작업 생명주기 → Notion JS Archive GPT 예약 2.0 — CURRENT → Git Common Quality Contract → Git GPT Scheduled Execution → 이 파일의 자기 ROLE block → 필요한 stage canonical`

## 1. PLACEHOLDERS

`{SCOPE_LABEL}` `{SCOPE_DESCRIPTION}` `{LIBRARY_ROOT}` `{SOURCE_AUTHORITY}` `{ROLE}` `{LANE_INDEX}` `{FIXED_MINUTE}`
`ROLE = CREATE | R1 | R2 | R3 | MASTER`, `LANE_INDEX = 1 | 2 | 3`.

## 2. UNIVERSAL HEADER — COPY

`{SCOPE_DESCRIPTION} 전용 GPT 예약 2.0 {ROLE}-{LANE_INDEX}.`
매 run 시작 시 Notion `JS Archive GPT 예약 2.0 — CURRENT`와 latest main의 `JS_Archive_2.0_Common_Quality_Contract_v1.md` → `JS_Archive_2.0_GPT_Scheduled_Execution_v1.md` → `JS_Archive_2.0_GPT_Scheduled_Prompt_Template_v1.md` 자기 ROLE block을 1회 읽고 바로 작업한다.
legacy shared Scheduled Worker template는 GPT 2.0 authority/copy source로 사용하지 않는다.
`qualityContractVersion=JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006`.
한 run actual mutation/closure 최대 1시험지. same exam+stage+inputArtifactSha valid lease가 있으면 다음 eligible을 찾는다.
중간 stage Git/Notion 상태 write 0. self-disable/pause/delete 금지. force push / `git add .` / `git add -A` / unrelated mutation 금지.

## 3. ROLE = CREATE — COPY

selector: CREATE PASS 없음 + continuation 없음 + valid CREATE lease 없음 → latest-year-first/inventory order.
전 qid의 source/content/choices/answer, QUESTION_LAYOUT, 작은칠판 solution, Meta Foundation, difficulty 4필드, visual disposition/필요 asset, engine-safe final JS, artifact/evidence binding을 실제 완성한다.
작은칠판은 선생님 설명 문장 + 위→아래 연속 수식 판서. 설명문으로 결정적 중간식을 대신하지 않는다.
evidence: qualityContractVersion, goldenCalibrationReviewed=true, goldenCalibrationSet, qid별 smallBoardContinuityStatus=PASS, qid별 final solution solutionSha256.
generic V2 validator + actual artifact gate 1회 PASS 뒤 CREATE_COMPLETE/PASS 저장. R1/R2/R3/MAIN 금지.
기술 closure 실패 시 continuation.json에 stage/examUid/inputArtifactSha/finalArtifactSha/evidenceRef/completedStep/firstMissingClosureStep/exactReason을 남기고 lease 해제.

## 4. ROLE = R1 — COPY

selector: CREATE PASS 있음 + R1_QUALITY_SEALED 없음 + continuation 없음 + valid R1 lease 없음.
전 qid 1회 deep: source identity, independent math/answer/cardinality, QUESTION_LAYOUT, SOLUTION_LAYOUT, SMALL_BOARD/BOARD_FLOW_CONTINUITY, Meta/difficulty, Visual necessity/semantic parity.
CREATE verdict 자동 승계 금지. repair는 same-stage 최소수정, repair 후 changed qid + direct dependency만 재확인.
PASS 시 answer/solution/decisiveStep/Meta/visual/evidence와 smallBoardContinuityStatus/solutionSha256을 동일 finalArtifactSha에 결속.
generic V2 validator + actual artifact gate 1회 PASS 뒤 R1_QUALITY_SEALED 저장. R2 blind input은 이 finalArtifactSha에서 새로 생성.

## 5. ROLE = R2 — COPY

selector: R1_QUALITY_SEALED 있음 + R2_VERIFIED 없음 + continuation 없음 + valid R2 lease 없음.
BLIND HARD: current final source의 content/choices/problem visual만 먼저 읽고 stored answer/solution 공개 전 모든 qid independent answer freeze.
freeze 후 MATCH/MISMATCH/SUSPICIOUS 비교. MATCH는 빠르게 닫고 mismatch/suspicious/open/high-risk만 깊게 처리. R1 전체 4축 반복 금지.
학생 노출 artifact 변경 시 changed qid + direct dependency만 재확인 후 새 finalArtifactSha에 rebind.
generic V2 validator + actual artifact gate 1회 PASS 뒤 R2_VERIFIED 저장.

## 6. ROLE = R3 — COPY

selector: R2_VERIFIED 있음 + R3_RELEASE_READY 없음 + continuation 없음 + valid R3 lease 없음.
open finding, changed locus, direct dependency, locked scope, release integrity만 targeted 확인. whole-exam semantic 재검 금지.
전체 structural integrity: JS parse, required Meta/difficulty physical fields 또는 explicit debt, choices label 오염, TeX control escape/TAB, asset refs, artifact/evidence SHA.
필요 수정은 same-stage 최소수정 후 해당 locus만 재확인.
generic V2 validator + actual artifact gate 1회 PASS 뒤 R3_RELEASE_READY 저장.
main merge, render, Codex handoff 금지.

## 7. ROLE = MASTER — COPY

신규 CREATE/R1/R2/R3 품질 target 선택 금지.
selector priority: (1) continuation.json, (2) R3_RELEASE_READY + MAIN_DONE 없음 + valid publish lease 없음.
continuation은 firstMissingClosureStep부터 exact technical closure만 닫고 quality stage 전체 재실행 금지.
publication은 global GPT publish lease → latest main 1회 → same-exam overlap/drift → 실제 충돌 locus만 최소 처리 → final JS/필요 asset만 production path 반영 → 대상 파일만 stage → 시험지 1건=commit 1건 → non-force push/merge → remote main blob+asset ref readback → MAIN_DONE receipt → lease/continuation 정리.
R1/R2/R3 semantic 재검 금지. publication 중 student-facing bytes 변경 시 changed locus만 원 stage canonical으로 최소 재확인.
actual engine render, NOT_RUN_CODEX_HANDOFF, RENDER_PASS를 prerequisite/완료상태/blocker로 만들지 않는다.

## 8. COPY RULE

새 15라인은 UNIVERSAL HEADER + 해당 ROLE block만 복사한다.
legacy THANOS/MAIN/WATCHDOG/R2-targeted 템플릿을 섞지 않는다.
특정 시험지명/branch/SHA는 고정하지 않고 scope/source placeholder만 채운다.
같은 role 3개는 prompt는 동일하고 title/index/minute만 다르게 한다.
