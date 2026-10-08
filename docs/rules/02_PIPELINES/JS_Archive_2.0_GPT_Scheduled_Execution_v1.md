# JS Archive 2.0 — GPT Scheduled Execution Contract v1

status: CURRENT / GPT SCHEDULED LINE
qualityContractVersion: JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006
currentCampaignId: H1_GPT2_20261006
parent quality authority: JS_Archive_2.0_Common_Quality_Contract_v1.md
scheduled prompt copy source: JS_Archive_2.0_GPT_Scheduled_Prompt_Template_v1.md
campaign authority: JS_Archive_2.0_GPT_Campaign_Generation_v1.md

## 0. Authority boundary

이 문서는 GPT 예약 2.0만 정의한다.
새 GPT 2.0 예약 worker는 legacy JS_Archive_Scheduled_Worker_Prompt_Canonical_Template_v1.md를 authority 또는 copy source로 사용하지 않는다.

새 15라인의 유일한 예약 prompt copy source는 JS_Archive_2.0_GPT_Scheduled_Prompt_Template_v1.md다.
현재 campaign/generation 및 A/B/C 고정 partition authority는 JS_Archive_2.0_GPT_Campaign_Generation_v1.md와 Git `archive/data/gpt-campaigns/H1_GPT2_20261006.json`이다.

## 1. 정상 생명주기

CREATE → R1 → R2 → R3 → MASTER → MAIN_DONE

GPT 예약라인은 Codex와 독립적으로 끝까지 완결한다.
actual engine render, NOT_RUN_CODEX_HANDOFF, RENDER_PASS, Codex handoff를 GPT stage prerequisite/완료상태/blocker로 사용하지 않는다.

## 2. Current generation HARD

currentCampaignId = H1_GPT2_20261006

새 15라인은 오직 이 campaignId 아래에서 생성된 Library artifact/evidence/PASS만 현재 상태 authority로 인정한다.

기존 H1 pilot Library, CREATE PASS, R1 PASS, R2/R3 결과, continuation, MAIN_DONE은 HISTORY로 보존한다.
삭제하거나 덮어쓰지 않는다.
그러나 campaignId가 H1_GPT2_20261006이 아니면 현재 selector에서는 존재하지 않는 것으로 취급한다.

이전 generation PASS를 새 generation PASS로 복사, 링크 승계, alias, 재포장하는 것을 금지한다.
source bytes와 승인된 source asset은 source authority에서 새 generation source/로 복사할 수 있지만, 이전 quality PASS/evidence/lease/continuation은 승계하지 않는다.

따라서 H1_GPT2_20261006의 모든 시험지는 CREATE부터 0에서 시작한다.

## 3. 15-lane topology = 3 fixed streams

A stream:
CREATE-A → R1-A → R2-A → R3-A → MASTER-A

B stream:
CREATE-B → R1-B → R2-B → R3-B → MASTER-B

C stream:
CREATE-C → R1-C → R2-C → R3-C → MASTER-C

총 15 lane.

기존 CREATE-1/2/3처럼 공용 pool에서 서로 target을 훔쳐가는 구조를 사용하지 않는다.
각 시험지는 campaign-manifest에서 A/B/C 중 하나에 고정 배정된다.
worker는 자기 stream inventory만 소비한다.
cross-stream stealing, fallback, overflow takeover를 금지한다.

stream 배정은 activation 전에 frozen manifest로 확정한다.
activation 후 worker가 임의로 stream을 바꾸지 않는다.

## 4. Generation Library authority

현재 generation의 기본 구조:

Archive2-GPT/
  generations/
    H1_GPT2_20261006/
      A/
        <examUid>/
          source/
          CREATE/
          R1/
          R2/
          R3/
          final/
          continuation.json
      B/
        <examUid>/...
      C/
        <examUid>/...

현재 stage authority는 위 generation + stream 경로 안의 actual artifact/evidence/PASS와 finalArtifactSha다.

Library object에는 최소 다음 identity를 결속한다.
- campaignId = H1_GPT2_20261006
- stream = A | B | C
- examUid
- stage
- inputArtifactSha
- finalArtifactSha
- qualityContractVersion

campaignId 또는 stream이 다른 artifact는 현재 stage 계산에 사용할 수 없다.

중간 Git/Notion write는 stage 전환 prerequisite가 아니다.

## 5. Fixed stream manifest HARD

Git `archive/data/gpt-campaigns/H1_GPT2_20261006.json`이 activation authority다.

필수:
- campaignId
- qualityContractVersion
- partitionStatus = FROZEN
- inventoryDenominator
- sourceAuthority
- streams.A[]
- streams.B[]
- streams.C[]
- 각 examUid는 정확히 한 stream에만 존재
- duplicate examUid = 0
- unassigned examUid = 0
- assigned total = inventoryDenominator

partitionStatus가 FROZEN이 아니면 15라인을 ON하지 않는다.

worker는 inventory를 다시 분배하지 않고 manifest의 자기 stream 배열 순서만 따른다.
기본 소비 순서는 manifest order이며, manifest 작성 시 latest-year-first 원칙을 반영한다.

## 6. Selector identity HARD

모든 selector는 최소 다음을 동시에 만족해야 한다.

campaignId = H1_GPT2_20261006
AND stream = 자기 stream
AND examUid가 frozen manifest의 자기 stream에 존재
AND 해당 generation의 자기 stage PASS 조건

과거 Library에 동일 examUid의 PASS가 있어도 current campaign selector에는 영향이 없다.

lease key:
campaignId + stream + examUid + stage + inputArtifactSha

MASTER publication은 stream ownership을 유지하며 global PUBLISH_LEASE를 사용하지 않는다. target-only PR·expected head SHA와 merge 직전 main 재확인이 concurrency authority다.

## 7. CREATE

CREATE-A/B/C는 자기 stream에서 current generation CREATE PASS가 없는 다음 exam만 선택한다.

전 qid의 완제품 후보를 만든다:
source/content/choices/answer, QUESTION_LAYOUT, 작은칠판 solution, Meta Foundation, difficulty 4필드, visual disposition/필요 asset, engine-safe final JS, artifact/evidence binding.

작은칠판은 선생님 설명 문장과 위→아래 연속 수식 판서를 함께 보존하며 설명문으로 결정적 중간식을 대신하지 않는다.

CREATE evidence에는:
- qualityContractVersion
- campaignId
- stream
- goldenCalibrationReviewed=true
- goldenCalibrationSet
- qid별 smallBoardContinuityStatus=PASS
- final solution solutionSha256
를 결속한다.

## 8. R1

R1-A/B/C는 같은 stream의 current generation CREATE PASS만 받는다.

전 qid를 1회 깊게 독립 검수해 동일 final artifact를 통합 봉인한다:
source identity, independent math/answer/cardinality, QUESTION_LAYOUT, SOLUTION_LAYOUT, SMALL_BOARD/BOARD_FLOW_CONTINUITY, Meta/difficulty, Visual necessity/semantic parity.

CREATE verdict 자동 승계 금지.
repair 후 changed qid + direct dependency만 재확인한다.

PASS 시 answer/solution/decisiveStep/Meta/visual/evidence와 campaignId/stream이 동일 finalArtifactSha에 결속된다.

## 9. R2

R2-A/B/C는 같은 stream의 current generation R1_QUALITY_SEALED만 받는다.

qualification 동안 전 qid blind answer sweep을 유지한다.
완전한 student input(content/choices/problem visual)만 먼저 읽고 stored answer/solution 공개 전에 전 qid independent answer를 freeze한다.
freeze 후 MATCH는 빠르게 닫고 mismatch/suspicious/open/high-risk만 깊게 처리한다.
R1 전체 4축을 다시 돌지 않는다.

## 10. R3

R3-A/B/C는 같은 stream의 current generation R2_VERIFIED만 받는다.

R3는 targeted release owner다:
open finding, changed locus, direct dependency, locked scope, release integrity만 본다.
whole-exam semantic 재검 금지.

final artifact 전체는 JS parse, required Meta/difficulty physical fields 또는 explicit debt, choices engine-label 오염, TeX control escape/TAB 손상, asset refs, artifact/evidence SHA binding만 structural integrity scan한다.

정상 종료는 R3_RELEASE_READY.
R3는 main merge를 하지 않는다.

## 11. MASTER

MASTER-A/B/C는 자기 stream만 본다.

selector priority:
1. 자기 stream의 continuation.json
2. 자기 stream의 R3_RELEASE_READY + MAIN_DONE 없음 clean publication

신규 CREATE/R1/R2/R3 품질 target을 고르지 않는다.
다른 stream continuation/publication을 소비하지 않는다.

continuation은 firstMissingClosureStep부터 exact technical closure만 닫는다.

publication은:
latest main 1회
→ same-exam overlap/drift
→ target-only final JS/asset 반영
→ 시험지 1건 = commit 1건
→ non-force push/merge
→ remote main readback
→ current generation/stream Library MAIN_DONE receipt
순으로 닫는다.

git add . / git add -A / force push 금지.
MASTER는 R1/R2/R3 semantic review를 새로 수행하지 않는다.

## 12. Validator / status

qualityContractVersion=JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006 artifact는 generic V2 validator + actual artifact gate를 통과한다.
validator는 structural binding만 검사하며 수학/Meta/Visual semantic judge가 아니다.

current generation 상태 계산:
current generation CREATE 없음 → CREATE
current generation R1 seal 없음 → R1
current generation R2 verified 없음 → R2
current generation R3 release-ready 없음 → R3
current generation R3 release-ready + MAIN_DONE 없음 → MASTER
current generation MAIN_DONE → 종료

legacy/current generation 밖 PASS는 상태 계산에서 0으로 본다.

## 13. Activation HARD

15라인 ON 전 반드시:
1. campaignId = H1_GPT2_20261006 고정
2. 새 generation root 생성
3. Git `archive/data/gpt-campaigns/H1_GPT2_20261006.json`의 partitionStatus=FROZEN
4. denominator = A+B+C assignment total
5. duplicate/unassigned = 0
6. 15개 worker가 각각 자기 STREAM=A/B/C를 명시
7. 기존 H1 pilot 예약은 OFF/HISTORY 유지
8. 기존 pilot PASS를 current generation에 복사하지 않음

하나라도 미완료면 activation하지 않는다.

## 14. NONSTOP

오류가 나도 lane을 self-disable/pause/delete하지 않는다.
현재 target이 안 닫히면 exact continuation을 같은 generation/stream에 남기고 lease를 해제한 뒤 자기 stream의 다음 eligible target으로 이동한다.
다른 stream으로 넘어가지 않는다.
오직 사용자 명시 지시만 lane을 OFF할 수 있다.

## 15. Machine hardening — PR #296 공통 보강 반영

모든 current-generation stage artifact/evidence/state/continuation에 다음을 HARD로 결속한다.
- `executionLine=GPT_SCHEDULED`
- `campaignId=H1_GPT2_20261006`
- `stream=A|B|C`
- `qualityContractVersion=JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006`

validator는 기본 schema, difficulty 허용 enum, 실제 production asset 및 SVG dependency, EXCLUDED marker, known HOLD/FAIL review, examTitle을 기계적으로 거부한다.
CREATE/R1 Golden preflight는 파일명/boolean만 남기지 않고 GPT 전용 calibration registry의 실제 Golden/Negative 파일 SHA, 대표 qid solution SHA, 필요한 solution SVG SHA, observation을 evidence에 결속한다.

R3는 targeted `rows`를 확대하지 않는다. 미변경 문항의 합법적인 PT/TPL null debt는 현재 artifact SHA에 결속된 `artifactDispositions`로 인계한다.

stage validator 호출은 반드시:
`--quality-contract JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006 --execution-line GPT_SCHEDULED --campaign-id H1_GPT2_20261006 --stream <A|B|C>`
를 사용한다.

MASTER MAIN_DONE은 render 없이 다음 physical evidence를 요구한다.
- R3 validator report physical ref + SHA
- final artifact Git blob SHA
- 필요한 asset ref + SHA-256
- production canonical path
- final remote main SHA
- origin/main의 production blob + asset parity

이 closeout은 품질 의미판정을 다시 하지 않는다.


## 16. CREATE/R1 semantic quality acceptance — 2026-10-08

CREATE와 R1은 전 qid에 아래 3가지 학생 노출 품질을 확보한다. R2/R3/MASTER에 CREATE·R1의 전체 재검 책임을 전가하지 않는다.

1. **Difficulty and Meta**: legacy `level`의 canonical `하|중|상` 문자열 필수(`null`·숫자 불허); `difficultyBucket` 1~5 별도 판정. L3/L4/RPM/crossConceptKeys/conditionKeys/integrationPattern은 실제 풀이 기반 semantic 판정.
2. **Question layout**: `layoutTag`는 의미적 조판 단위에 맞춰 문항별 결정한다. `stack` 일괄 적용 및 기계적 줄바꿈을 금지한다. 다수 `stack`은 해당 문항별 재확인 신호이지 획일적인 비율 제한은 아니다.
3. **Solution educational completeness**: 쉬운 문제도 조건→식 설정→중간 계산→정답 연결을 설명하고, 서술형은 결정적 논증과 풀이 전개를 보존한다. 평균 글자수는 진단 신호이지 품질 PASS 근거/고정 최소 자수 기준이 아니다.

R1은 CREATE의 verdict를 독립 재확인하며 형식 유효성만으로 semantic PASS를 내리지 않는다. 신규 gate 구현 없이 실제 qid별 작업/evidence에 반영하고, 발견된 결함은 same-stage targeted repair로 처리한다. 2026-10-08 회귀 대상: 24 매산여고·24 금당고·24 매산고·24 여수고. 기존 PASS를 자동 무효화하거나 전체 rewind하지 않으며, 이 네 시험지는 별도 핀포인트 보정 대상으로 취급한다.


## 17. NEXT-RUN QUALITY FLOOR — GPT CREATE/R1 execution hard (2026-10-08)

**Effective immediately for the next unsealed exam/stage, A/B/C alike.** This GPT-only execution section takes priority over shorter generic CREATE/R1 summaries above when they conflict. It does not change frozen manifest, scheduler cadence, R2/R3 targeted scopes, or MASTER publication ownership. Existing completed exams are not blanket-rewound; known defects require target-only maintenance with new SHA-bound evidence.

### 17.1 Actual order; output is not evidence

1. **SOURCE / INPUT SNAPSHOT:** pin current generation/stream/examUid, exact source/final raw SHA, qid denominator, original choices/assets, curriculum and applicable Golden+Negative sample. Read the actual Golden example solution and relevant visual **before** authoring/review; record real example qid, SHA and observed board/layout rule. Never claim a preflight from a file name, boolean, or later reading.
2. **CREATE 4 axes, every qid:** source/QUESTION_LAYOUT; student-facing solution/SMALL_BOARD; actual semantic Meta+level/difficulty; visual/SVG necessity and correctness. Independently derive mathematical answer and verify **all five choices** where present, correct answer cardinality, and grade-appropriate solution. Preserve exact original stem/choices unless authorized repair; do not mechanically line-break source text.
3. **R1 independent 4-axis seal, every qid:** do not copy CREATE verdict. Read complete current *student-visible* input, including all required visual bytes, before independent mathematical judgment. When clean student-only material is available, freeze the pre-answer result and reasoning before looking at stored answer/solution; keep its input SHA and freeze timestamp/order. Never claim blind/frozen if answers were visible beforehand. In all cases actually independently rejudge every qid's four axes, including curricular method, full solution, Meta and visual necessity. A non-isolated attempt cannot be described as pre-disclosure independent; repair the input separation or leave precise stage continuation rather than fabricating R1 evidence.
4. **Repair in place:** when one semantic locus is defective, MINIMAL_REPAIR; if genuinely unrecoverable under current policy, ALIVE_REPLACEMENT. Re-evaluate changed qid and direct dependencies only, refresh solution/Meta/difficulty/visual and SHA/evidence, preserve unchanged good qids. Do not restart an already sealed stage without identified drift.
5. **Seal against real bytes:** record real qid dispositions and actual physical result of canonical V2 validator/active artifact contract, exact source/evidence/asset SHA, and actual PASS receipt; technical/missing tools are \`NOT_EXECUTED\` plus exact continuation, never PASS by inference. Failed raw validator must be repaired and rerun on the new revision, not re-labeled. R2/R3 may reuse unchanged valid evidence according to their own contracts.

### 17.2 Four regression traps — qid-local decisions

- **Difficulty / Meta:** legacy \`level\` must be exactly \`하|중|상\`, not number/null. \`difficultyBucket\` is separately judged 1..5, not mechanically mapped from level. For *every qid*, verify L3/L4/RPM primary, \`crossConceptKeys\`, \`conditionKeys\`, \`integrationPattern\` against decisive steps and actual conditions; empty/\`NONE\` only after affirmative semantic judgment. A whole exam with all empty relational metadata is a **mandatory investigation signal**, never an automatic nonzero quota or automatic FAIL.
- **QUESTION_LAYOUT:** \`layoutTag\` is selected per stem/choices/complete math expression. Do not use \`stack\` in bulk or insert line breaks based on character counts, regex or formula fragments. Excess stack usage triggers targeted explanation of each affected qid; a large number itself is not an automatic FAIL. Keep original student stem and choices fidelity.
- **Student solution / notation:** a short solution must still show why each essential expression follows, intermediate substitution/calculation and final answer; longer text alone is not a PASS. Every subjective item retains its assessable decisive proof/steps. Use engine-safe LaTeX delimiters and commands for nontrivial math expressions/fractions/powers/derivatives/integrals; do not substitute plain Unicode superscripts/prime glyphs as a blanket math-layout shortcut. Student-facing explanations should read like teacher boardwork, not prose-only or answer-only.
- **Curriculum / source truth:** check *actual chosen solution method* against that exam's year, grade and course. A mathematically correct but out-of-scope method is defective (e.g. high-1 solution relying on double-angle tangent/advanced trigonometry); derive a permitted method by targeted repair. Never treat a Golden example from another curriculum as permission to transplant an advanced method.

Regression examples: \`24_매산여고_1학기_중간\` numeric level; \`24_금당고_1학기_중간\` null level/short basics; \`24_매산고_1학기_중간\` repeated stack; \`24_여수고_1학기_중간\` short subjective solutions; historical \`22_강남여고_1학기_기말\` all-empty relational Meta and out-of-curriculum q20; Codex \`20_매산여고_2학기_기말_고2_수학II\` uses Unicode-style math as a **notation caution**, not a model output to copy. These are quality examples, not claims that each belongs to the current GPT2 campaign.

### 17.3 Ownership and render separation

CREATE authors complete student-facing output. R1 independently accepts/repairs it. R2 preserves blind math sweep; R3 targeted release/integrity; MASTER only same-stream continuation/publication. GPT does **not** recapture the Archive Engine; Codex's separate actual rendering/capture is an external observation and not a GPT worker execution prerequisite or a substitute for GPT CREATE/R1 quality. Do not claim \`RENDER_PASS\` from static GPT review. No arbitrary text-length thresholds, Meta quotas, or full rerun loops. Keep 1 exam/run, fixed stream, NONSTOP, and exact continuation when a real external capability is missing.

### 17.4 Minimal auditable worker handoff

For each completed CREATE/R1 deliver only existing canonical PASS/evidence plus a compact human-readable summary: \`examUid\`, \`input/finalArtifactSha\`, qid denominator, actual independent/Golden evidence refs where applicable, changed qids+direct dependencies, number and qids of structural/Meta/solution/curriculum findings (including fixed ones), actual validator raw status and first unresolved closure step. **Do not invent new PASS schema fields or claim a new machine gate has been implemented by this text change.**

## 2026-10-08 — DIRECT USER ASSIGNMENT AUTO-RELEASE HARD

형님이 특정 시험지 또는 Archive 작업의 제작·수정·해설·Meta·시각자료·등록·검수를 직접 진행하라고 지시하면 작업자는 해당 지시 범위의 실제 작업을 끝낸 다음, 사용자에게 출시 인증·운영병합을 다시 요청하거나 승인 대기하지 않는다. 해당 작업의 정식 출시 인증(현재 적용되는 R1/R2/R3, validator/receipt 및 필요한 실제 렌더 또는 근거 있는 허용된 면제), 등록(Archive 1 DB와 해당하는 Archive 2.0 question-index/identity/metadata/catalog), production publish, main 운영병합, remote readback과 MAIN_DONE closure까지 하나의 완료 목표로 연속 실행한다.

사용자가 발문 우선/해설 후속처럼 단계별 범위를 명시했다면 그 지시 범위만 출시·등록한다. 변경하지 않은 범위를 불필요하게 재검하거나 다른 시험지의 인증을 되감지 않는다. 검증하지 않은 PASS, 실행하지 않은 렌더 PASS, 미등록·미병합 상태의 MAIN_DONE 또는 품질 게이트 임의 우회는 금지한다. 기술 장애가 생기면 허용된 대체 경로로 수리한 뒤 결과를 재조회하며, 물리적으로 닫지 못한 단계는 정확한 결손과 재개 위치를 기록한다. 별도의 중지·보류·제외를 명시한 형님 최신 지시가 이 기본값보다 우선한다.
