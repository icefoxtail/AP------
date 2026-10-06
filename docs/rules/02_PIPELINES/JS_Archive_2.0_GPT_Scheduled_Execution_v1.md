# JS Archive 2.0 — GPT Scheduled Execution Contract v1

status: DRAFT / GPT SCHEDULED LINE
qualityContractVersion: `JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006`
parent quality authority: `JS_Archive_2.0_Common_Quality_Contract_v1.md`

## 1. 목적

이 문서는 JS Archive 2.0의 **GPT 예약 실행 라인만** 정의한다.
Codex ROOT/subagent 라인과 독립적으로 끝까지 완결한다.

정상 생명주기:

```text
CREATE
→ R1
→ R2
→ R3
→ MASTER
→ MAIN_DONE
```

GPT 예약라인에서는 actual engine render를 열지 않는다.
render 미실행 상태, Codex handoff, `NOT_RUN_CODEX_HANDOFF`, `RENDER_PASS`를 stage prerequisite 또는 완료조건으로 사용하지 않는다.

## 2. 권장 15-lane topology

역할 수는 다음으로 고정한다.

- CREATE × 3
- R1 × 3
- R2 × 3
- R3 × 3
- MASTER × 3

총 15 lane.

같은 시험지/같은 stage에 active writer가 중복되지 않도록 examUid + stage + inputArtifactSha 기준 lease를 사용한다.
각 역할의 3개 lane은 동일 selector 계약을 사용하고, valid lease가 있는 target은 건너뛰고 다음 eligible을 소비한다.

## 3. 시험지별 Library

시험지 하나마다 독립 Library를 사용한다.

```text
Archive2-GPT/
  <examUid>/
    source/
    CREATE/
    R1/
    R2/
    R3/
    final/
    continuation.json   # 실제 continuation이 있을 때만
```

stage authority는 Notion 상태표나 worker 기억이 아니라 Library에 실제 저장된 artifact/evidence/PASS와 finalArtifactSha다.
중간 Git/Notion write는 stage 전환 prerequisite가 아니다.

## 4. CREATE × 3

CREATE는 전 qid의 Archive 완제품 후보를 만든다.

- source identity / content / choices / answer
- QUESTION_LAYOUT exact parity
- 학생용 작은칠판 solution
- Meta Foundation
- difficulty 4필드
- visual disposition + 필요한 problem/solution asset
- engine-safe final JS
- artifact/evidence binding

작은칠판은 선생님이 실제로 말로 설명할 부분을 문장으로 두되, 계산의 본체는 등호·부등호·대입·변형이 위에서 아래로 한 줄씩 이어지는 수식이어야 한다.
설명문으로 중간 수식을 대신하지 않는다.

새 CREATE evidence/PASS:
- `qualityContractVersion=JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006`
- `goldenCalibrationReviewed=true`
- `goldenCalibrationSet`
- qid별 `smallBoardContinuityStatus=PASS`
- qid별 final solution `solutionSha256`

## 5. R1 × 3

R1은 전 qid를 한 번 깊게 보고 같은 final artifact를 통합 봉인한다.

- source identity
- independent math / answer / answer cardinality
- QUESTION_LAYOUT
- SOLUTION_LAYOUT / SMALL_BOARD / BOARD_FLOW_CONTINUITY
- Meta / difficulty
- Visual necessity / semantic parity

CREATE verdict를 기계적으로 승계하지 않는다.
수정은 same-stage 최소수정하고 changed qid + direct dependency만 다시 확인한다.
학생 입력 content/choices/problem visual이 바뀌면 기존 independent freeze의 유효성을 다시 판단한다.

PASS 시 answer·solution·decisiveStep·Meta·visual·evidence가 동일 finalArtifactSha에 결속돼야 한다.

## 6. R2 × 3

다음 qualification 동안 전 qid blind answer sweep을 유지한다.

- content / choices / problem visual의 완전한 student input만 먼저 읽는다.
- stored answer/solution 공개 전에 전 qid independent answer를 freeze한다.
- freeze 후 MATCH/MISMATCH/SUSPICIOUS를 비교한다.
- MATCH는 빠르게 닫는다.
- mismatch/suspicious/open/high-risk만 깊게 처리한다.
- R1의 전체 4축을 다시 돌지 않는다.

repair가 학생 노출 artifact를 바꾸면 changed qid + direct dependency만 해당 canonical으로 재확인하고 새 finalArtifactSha에 rebind한다.

## 7. R3 × 3

R3는 targeted release owner다.

확인 범위:
- open finding
- changed locus
- direct dependency
- locked scope
- release integrity

whole-exam semantic 재검을 하지 않는다.
다만 final artifact 전체의 구조적 integrity는 확인한다.

- JS parse
- 필수 Meta/difficulty physical fields 또는 explicit canonical debt
- choices engine-label 오염
- TeX control escape/TAB 손상
- asset refs
- artifact/evidence SHA binding

정상 종료:
`R3_RELEASE_READY`

R3는 main merge를 하지 않는다.

## 8. MASTER × 3

MASTER는 GPT 예약라인의 **technical continuation + final publication owner**다.

### 8.1 우선순위

각 run에서 다음 순서로 selector를 계산한다.

1. 실제 `continuation.json`이 있는 CREATE/R1/R2/R3 target
2. `R3_RELEASE_READY`이고 MAIN_DONE이 없는 clean publication target

신규 CREATE/R1/R2/R3 품질 target을 선점하지 않는다.

### 8.2 continuation closure

continuation target은 `firstMissingClosureStep`부터 exact technical closure만 닫는다.
품질 stage 전체를 처음부터 다시 돌지 않는다.
artifact mutation이 필요하면 해당 locus만 current canonical으로 최소 재확인한다.

### 8.3 publication / main merge

clean R3 target은 MASTER가 직접 마감한다.

1. global GPT publish lease 획득
2. latest main 1회 조회
3. 해당 시험지 production canonical과 Library final artifact overlap/drift 확인
4. 같은 시험지의 실제 충돌 locus만 처리
5. final JS + 필요한 final asset만 production canonical path에 반영
6. 대상 파일만 stage
7. 시험지 1건 = publication commit 1건
8. non-force push/merge
9. remote main에서 production target blob + asset reference 최소 readback
10. Library에 MAIN_DONE receipt 결속
11. lease/continuation 정리

MASTER는 R1/R2/R3 의미 검수를 새로 수행하지 않는다.
publication 과정에서 학생 노출 bytes가 바뀌면 해당 changed locus만 원래 stage canonical으로 최소 재확인한 뒤 publication을 계속한다.

### 8.4 render 경계

GPT 예약라인의 MASTER는 browser/engine render를 completion prerequisite로 사용하지 않는다.
render를 실행했다고 주장하지 않고, render 미실행 상태를 별도 blocker/debt/handoff로 만들지도 않는다.
이 라인의 MAIN_DONE 의미는 **GPT 품질계약을 통과한 final artifact가 production canonical에 반영되고 Git main readback까지 닫힌 상태**다.

## 9. Golden

H1 현재 고정 Golden 3:
- `25_매산여고_2학기_중간_고1_기출.js`
- `25_효천고_2학기_중간_고1_기출.js`
- `25_제일고_2학기_중간_고1_기출.js`

Golden은 학생 노출 해설/조판/Visual quality floor다.
Meta/difficulty authority가 아니다.
현재 known exception: 제일고 q18 visual.

## 10. Validator

새 contract marker가 있는 artifact는 generic V2 validator + actual artifact gate를 통과한다.
validator는 structural binding만 확인하고 수학/Meta/Visual semantic judge가 되지 않는다.

## 11. 상태 계산

```text
CREATE PASS 없음                          → CREATE
CREATE COMPLETE + R1 seal 없음             → R1
R1 QUALITY SEALED + R2 verified 없음        → R2
R2 VERIFIED + R3 release-ready 없음         → R3
R3 RELEASE READY + MAIN_DONE 없음           → MASTER publication
continuation.json 있음                      → MASTER continuation
MAIN_DONE 있음                              → 종료
```

별도 render/handoff 상태를 상태 계산에 넣지 않는다.

## 12. NONSTOP

오류가 나도 예약 lane을 스스로 OFF하지 않는다.
특정 target이 현재 run에서 닫히지 않으면 exact continuation을 남기고 lease를 해제한 뒤 다음 eligible target으로 이동한다.
오직 사용자 명시 지시만 lane을 OFF할 수 있다.
