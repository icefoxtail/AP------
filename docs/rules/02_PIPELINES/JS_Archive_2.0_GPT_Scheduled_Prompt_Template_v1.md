# JS Archive 2.0 — GPT Scheduled Prompt Template v1

status: CURRENT / GPT 2.0 COPY SOURCE ONLY
qualityContractVersion: `JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006`

## 0. ABSOLUTE ROUTING HARD

이 파일은 **GPT 예약 2.0의 유일한 예약 prompt 복사 원본**이다.

새 GPT 2.0 예약 worker는 아래 legacy 공용 템플릿을 읽거나 복사 원본으로 사용하지 않는다.

`docs/rules/02_PIPELINES/JS_Archive_Scheduled_Worker_Prompt_Canonical_Template_v1.md`

필독 순서:

```text
GPT 작업 전 필독 라우터
→ Archive 2.0 / JS Archive 시작 페이지
→ Archive 전체 작업 생명주기
→ Notion `JS Archive GPT 예약 2.0 — CURRENT`
→ Git `JS_Archive_2.0_Common_Quality_Contract_v1.md`
→ Git `JS_Archive_2.0_GPT_Scheduled_Execution_v1.md`
→ 이 파일의 해당 ROLE block
→ 필요한 stage-specific canonical
```

같은 run 안에서 새 충돌/drift/사용자 지시가 없으면 동일 authority를 반복 재조회하지 않는다.

## 1. PLACEHOLDERS

```text
{SCOPE_LABEL}
{SCOPE_DESCRIPTION}
{LIBRARY_ROOT}
{SOURCE_AUTHORITY}
{ROLE}          CREATE | R1 | R2 | R3 | MASTER
{LANE_INDEX}    1 | 2 | 3
{FIXED_MINUTE}
```

정상 15라인:
- CREATE-1/2/3
- R1-1/2/3
- R2-1/2/3
- R3-1/2/3
- MASTER-1/2/3

## 2. UNIVERSAL HEADER — COPY

```text
{SCOPE_DESCRIPTION} 전용 GPT 예약 2.0 {ROLE}-{LANE_INDEX}.

매 run 시작 시 최신 Notion
'GPT 작업 전 필독 라우터'
→ 'Archive 2.0 / JS Archive 시작 페이지'
→ 'Archive 전체 작업 생명주기'
→ 'JS Archive GPT 예약 2.0 — CURRENT'
그리고 latest main의
'JS_Archive_2.0_Common_Quality_Contract_v1.md'
→ 'JS_Archive_2.0_GPT_Scheduled_Execution_v1.md'
→ 'JS_Archive_2.0_GPT_Scheduled_Prompt_Template_v1.md'의 자기 ROLE block
을 1회 snapshot으로 읽고 바로 작업한다.

legacy 'JS_Archive_Scheduled_Worker_Prompt_Canonical_Template_v1.md'를
GPT 2.0 authority나 copy source로 사용하지 않는다.

qualityContractVersion=JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006.

Library root = {LIBRARY_ROOT}
source authority = {SOURCE_AUTHORITY}

한 run actual mutation/closure 최대 1시험지.
same exam + stage + inputArtifactSha valid lease가 있으면 건너뛰고 다음 eligible을 찾는다.
오류 때문에 automation을 self-disable/pause/delete하지 않는다.
force push, git add ., git add -A, unrelated mutation 금지.
중간 stage의 Git/Notion 상태 write는 0.
```

## 3. ROLE = CREATE — COPY

```text
ROLE = CREATE ONLY.

selector:
1) CREATE COMPLETE/PASS 없는 Library
2) continuation.json 없는 Library
3) valid CREATE lease 없는 Library
4) latest-year-first → inventory order

전 qid의 Archive 완제품 후보를 실제로 만든다:
source identity/content/choices/answer,
QUESTION_LAYOUT exact parity,
학생용 작은칠판 solution,
Meta Foundation,
difficulty 4필드,
visual disposition + 필요한 asset,
engine-safe final JS,
artifact/evidence binding.

작은칠판:
선생님 설명 문장 + 위→아래 연속 수식 판서.
설명문으로 결정적 중간식을 대신하지 않는다.

evidence:
qualityContractVersion,
goldenCalibrationReviewed=true,
goldenCalibrationSet,
qid별 smallBoardContinuityStatus=PASS,
qid별 final solution solutionSha256.

generic V2 validator + actual artifact gate 1회 PASS 뒤 CREATE_COMPLETE/PASS를 저장한다.
R1/R2/R3/MAIN은 하지 않는다.

기술 closure가 현재 run에서 안 닫히면 continuation.json에
stage/examUid/inputArtifactSha/finalArtifactSha/evidenceRef/
completedStep/firstMissingClosureStep/exactReason
을 남기고 lease를 해제한다.
```

## 4. ROLE = R1 — COPY

```text
ROLE = R1 ONLY / FULL-QID QUALITY SEAL.

selector:
CREATE COMPLETE/PASS 있음
+ R1_QUALITY_SEALED 없음
+ continuation.json 없음
+ valid R1 lease 없음.

전 qid를 1회 깊게 독립 검수한다:
source identity,
independent math/answer/cardinality,
QUESTION_LAYOUT,
SOLUTION_LAYOUT,
SMALL_BOARD/BOARD_FLOW_CONTINUITY,
Meta/difficulty,
Visual necessity/semantic parity.

CREATE verdict 자동 승계 금지.
repair는 same-stage 최소수정.
repair 후 changed qid + direct dependency만 재확인.
content/choices/problem visual이 바뀌면 independent freeze 유효성을 다시 판단한다.

PASS 시 answer/solution/decisiveStep/Meta/visual/evidence가
동일 finalArtifactSha를 가리키게 결속한다.
qid row의 smallBoardContinuityStatus와 solutionSha256도 final solution에 결속한다.

generic V2 validator + actual artifact gate 1회 PASS 뒤 R1_QUALITY_SEALED를 저장한다.
R2 blind input은 이 finalArtifactSha에서 새로 만든다.
```

## 5. ROLE = R2 — COPY

```text
ROLE = R2 ONLY / FULL-QID BLIND ANSWER SWEEP.

selector:
R1_QUALITY_SEALED 있음
+ R2_VERIFIED 없음
+ continuation.json 없음
+ valid R2 lease 없음.

BLIND HARD:
current final source의 complete student input
(content/choices/problem visual)만 먼저 읽는다.
stored answer/solution 공개 전에 모든 qid independent answer를 freeze한다.
freeze 전 answer/solution/full artifact 노출 금지.

freeze 후 MATCH/MISMATCH/SUSPICIOUS 비교.
MATCH는 빠르게 닫는다.
mismatch/suspicious/open/high-risk만 깊게 처리한다.
R1의 전체 4축을 다시 돌지 않는다.

학생 노출 artifact가 바뀌면 changed qid + direct dependency만
해당 canonical으로 재확인하고 새 finalArtifactSha에 rebind한다.

generic V2 validator + actual artifact gate 1회 PASS 뒤 R2_VERIFIED를 저장한다.
```

## 6. ROLE = R3 — COPY

```text
ROLE = R3 ONLY / TARGETED RELEASE.

selector:
R2_VERIFIED 있음
+ R3_RELEASE_READY 없음
+ continuation.json 없음
+ valid R3 lease 없음.

확인:
open finding,
changed locus,
direct dependency,
locked scope,
release integrity.

whole-exam semantic 재검 금지.

final artifact 전체의 structural integrity만 scan:
JS parse,
required Meta/difficulty physical fields 또는 explicit canonical debt,
choices engine-label 오염,
TeX control escape/TAB 손상,
asset refs,
artifact/evidence SHA binding.

필요 수정은 same-stage 최소수정 후 해당 locus만 재확인한다.
generic V2 validator + actual artifact gate 1회 PASS 뒤 R3_RELEASE_READY를 저장한다.

main merge, render, Codex handoff를 만들지 않는다.
```

## 7. ROLE = MASTER — COPY

```text
ROLE = MASTER / CONTINUATION + PUBLICATION.

신규 CREATE/R1/R2/R3 품질 target을 고르지 않는다.

selector priority:
1) continuation.json이 있는 Library
2) R3_RELEASE_READY + MAIN_DONE 없음 + valid publish lease 없음

continuation:
firstMissingClosureStep부터 exact technical closure만 닫는다.
이전 quality stage 전체 재실행 금지.
artifact mutation이 필요하면 changed locus만 해당 canonical으로 최소 재확인한다.

publication:
global GPT publish lease 획득
→ latest main 1회
→ same-exam production canonical vs Library final overlap/drift 확인
→ 실제 충돌 locus만 최소 처리
→ final JS + 필요한 final asset만 production canonical path에 반영
→ 대상 파일만 stage
→ 시험지 1건 = publication commit 1건
→ non-force push/merge
→ remote main production blob + asset reference 최소 readback
→ Library MAIN_DONE receipt
→ lease/continuation 정리.

R1/R2/R3 semantic review를 새로 하지 않는다.
publication 중 학생노출 bytes가 바뀌면 changed locus만 원래 stage canonical으로 최소 재확인한다.

GPT 예약라인에서는 actual engine render,
NOT_RUN_CODEX_HANDOFF,
RENDER_PASS를 prerequisite/완료상태/blocker로 만들지 않는다.
render를 실행했다고 주장하지 않는다.
```

## 8. COPY RULE

새 15라인 생성 시:
- 이 파일의 UNIVERSAL HEADER + 해당 ROLE block만 복사한다.
- legacy THANOS/MAIN/WATCHDOG/R2-targeted 템플릿을 섞지 않는다.
- 특정 시험지명/branch/SHA는 prompt에 고정하지 않고 scope/source placeholder만 채운다.
- 같은 role 3개는 prompt는 동일하고 title/index/minute만 다르게 한다.
