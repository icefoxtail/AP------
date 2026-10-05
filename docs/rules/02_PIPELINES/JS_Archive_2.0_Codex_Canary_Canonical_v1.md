# JS Archive 2.0 Codex Canary Canonical v1

**STATUS: CURRENT CANARY / PHASE 10 ONE-EXAM PILOT**

이 문서는 Archive 2.0의 Codex multi-agent canary 실행용 최소 정본이다. 기존 1.x / M2-1 운영을 변경하지 않는다.

## 1. Canary Target

이번 canary 대상은 오직 아래 1개다.

`archive/_generated/source-only/m2-20261004/21_연향중_2학기_기말_중2_기출.js`

다른 시험지를 신규 target으로 선택하지 않는다.

목표 흐름:

`CREATE → R1 → R2 → R3 → MAIN`

이 1개가 MAIN까지 닫히면 즉시 종료하고 보고한다.

### 승인된 5시험지 파일럿 — 2026-10-05

사용자가 승인한 이번 후속 파일럿에서는 위 1시험지 제한 대신 아래 5개만 대상으로 한다. 모두 `archive/_generated/source-only/m2-20261004/` 아래의 JS다. 기존 `21_연향중`은 재실행하지 않는다.

- `21_신흥중_2학기_기말_중2_기출.js`
- `21_왕운중_2학기_기말_중2_기출.js`
- `21_이수중_2학기_기말_중2_기출.js`
- `21_풍덕중_2학기_기말_중2_기출.js`
- `20_향림중_2학기_기말_중2_기출.js`

시험지별 CREATE → R1 → R2 → R3 → MAIN 순서를 유지하는 stage별 직렬 컨베이어다. CREATE/R1/R2/R3 담당은 각각 1개이며, 각 담당은 한 번에 시험지 하나만 처리한다. 시험지별 CREATE worker 5개를 동시에 spawn하는 방식은 금지한다.

CREATE가 A를 R1에 넘기면 새 `archive_r1` 세션이 A를 받고 새 `archive_create` 세션이 B를 시작한다. R1이 A를 R2에 넘기면 새 `archive_r2` 세션이 A를 받고, 새 `archive_r1` 세션이 B를 받으며, CREATE는 새 세션으로 C를 시작한다. 시험지별 순서와 각 역할의 처리 순서를 유지하며 같은 역할의 worker를 동시에 여러 개 실행하지 않는다. 다음 담당이 바쁘면 완료 산출물을 보존하고 해당 역할이 비는 즉시 인계한다. 별도 READY/QUEUE ceremony를 만들지 않는다.

MAIN publication/closeout은 ROOT의 기술 routing이다. 정상 품질 역할은 4개이며 MASTER는 실제 durable continuation이 발생할 때만 추가한다. concurrency cap 5는 동시 실행 상한이며 상시 5개 worker 실행 지시도, 누적 spawn 수의 제한도 아니다.

#### 에이전트 세션 수명과 인계

- 고정하는 것은 역할과 stage별 동시 처리 슬롯이다. 동일한 agent thread를 시험지 100개까지 계속 유지하는 방식은 기본 운영으로 사용하지 않는다.
- 새 `(examUid, stage)` 작업은 해당 custom role의 새 세션으로 시작한다. 기본 `fork_turns="none"`으로 ROOT의 누적 작업 이력을 상속하지 않고, 적용 지침과 해당 작업의 필요한 입력만 전달한다.
- 같은 시험지의 동일 stage 안에서 최소 수정·재확인·closure를 할 때는 기존 세션을 이어간다. 수정마다 새 worker를 spawn하지 않는다. 실제 세션 손실이나 blind 오염 등 새 세션이 필요한 오류는 해당 기록을 보존하고 필요한 범위만 재개한다. MASTER는 실제 durable continuation의 missing closure만 처리한다.
- 인계의 authority는 에이전트 기억이 아니라 저장된 final artifact, 입력/final SHA, PASS evidence 및 closure receipt다. 다음 담당에게 시험지 경로, SHA, 허용된 evidence, 변경 qid, direct dependency 및 남은 finding만 compact하게 전달한다.
- R1/R2의 독립 답 freeze 전에는 해당 시험지의 stored answer, 해설 또는 upstream 답 evidence를 전달하거나 읽지 않는다. 필요한 student-facing 입력과 답 evidence의 공개 순서를 분리한다.
- 각 새 worker는 자기 세션에서 필요한 지침을 최초 1회 읽는다. ROOT는 정상 인계마다 canonical이나 시험지/evidence 전체를 반복 읽지 않는다.
- 대규모 작업도 bounded 작업 단위를 유지한다. 기본은 시험지 하나이며, 대형 문제집은 단원·공통 자료·의존성을 보존하는 작은 묶음으로 나눈다. 실제 분할 범위와 대상은 별도 승인된 작업 범위에 따른다.
- 세션 재사용 최적화는 기본 fresh-session 운영과 비교 측정한 후 별도로 적용한다. MAIN_DONE당 실제 token/시간, 재작업·누락 보충·ROOT 개입을 함께 기록하며, 확인 불가능한 usage는 추정하지 않는다. spawn 수 감소만으로 효율 향상을 선언하지 않는다.

모든 작업자는 자기 시험지 파일과 별도 evidence만 소유하며 공용 파일을 수정하지 않는다.

공유 Git index의 병렬 충돌을 방지하기 위해 이번 파일럿에서는 worker가 파일 목록과 validator/closure 결과를 반환하고, ROOT가 해당 목록만 명시적으로 stage하여 stage별 독립 commit을 만든다. worker는 git add/commit/merge/push를 실행하지 않는다. MASTER는 실제 durable continuation에만 사용한다.

5개가 MAIN까지 닫히면 종료한다. 기존 모델, blind 입력 분리, read-once, validator 1회 및 routing-only 규칙은 그대로 적용한다. 사용자 안내는 결과/오류 중심으로 짧게 하고, 변화 없는 대기 안내를 반복하지 않는다.

## 2. Read-Once / Token Budget HARD

ROOT는 이 문서를 session 시작 시 1회 읽고 실행한다.

정상 stage 전환마다 아래를 반복하지 않는다.

- Notion 전체 재조회
- repo 전체 검색
- 시험지 JS 전체 반복 열람
- evidence 전체 반복 열람
- 이전 PASS stage 재검
- unrelated global CI 확인
- worker 결과 장문 재요약

새로운 충돌, main drift, validator/closure 오류, 새 사용자 지시가 실제 발생한 경우에만 해당 범위만 다시 확인한다.

ROOT는 품질 프로토콜 전체를 읽지 않는다. 품질 문서는 실제 stage worker가 필요할 때만 읽는다.

## 3. Model / Agent HARD

ROOT는 조율 전용으로 사용한다.

실제 작업 subagent는 정확히 아래 5개 역할만 사용한다.

- `archive_create`
- `archive_r1`
- `archive_r2`
- `archive_r3`
- `archive_master`

CREATE/R1/R2/R3/MASTER의 resolved model/effort는 반드시:

- model: `gpt-6-luna`
- reasoning effort: `high`

첫 `archive_create` spawn 전에 실제 resolved model/effort를 확인한다.

확인 결과가 다르면 production mutation을 시작하지 않고 설정 오류만 보고한다.

임의의 generic/explorer/reviewer subagent를 새로 만들어 production 역할을 대체하지 않는다.

project config의 global spawned-agent concurrency cap은 **5**다.

이번 1시험지 canary에서는 정상 production stage worker를 순차적으로 하나씩 사용한다. continuation이 실제 발생하면 MASTER가 추가될 수 있다. 이후 multi-exam pilot에서는 별도 사용자 지시에 따라 최대 5개 spawned-agent thread까지 병렬 사용 가능하다.

## 4. Spawn Policy

5개 agent를 처음부터 동시에 spawn하지 않는다.

정상 흐름:

1. CREATE 필요 → `archive_create` spawn
2. CREATE V2 PASS → 즉시 `archive_r1` spawn
3. R1 V2 PASS → 즉시 `archive_r2` spawn
4. R2 V2 PASS → 즉시 `archive_r3` spawn
5. R3 V2 PASS → MAIN closure
6. `archive_master`는 durable continuation이 실제 발생했을 때만 spawn

이번 1시험지 canary에서는 정상 상황에서 production stage worker는 동시에 1개만 실행한다.

## 5. ROOT Routing-Only HARD

ROOT가 직접 하지 않는 일:

- 문제 풀이
- solution 작성/재검수
- Meta/RPM/difficulty 판정
- SVG/Visual 생성 또는 품질 심사
- source pixel/PDF 재판독
- 전 문항 quality audit
- worker PASS 재판정

ROOT는 compact worker result와 generic V2 validator/closure result를 authority로 사용한다.

validator PASS를 다시 해석하거나 이전 validator를 반복 실행하지 않는다.

## 6. Stage Worker Contracts

### CREATE

전 qid의 다음 4축을 실제로 완성한다.

- QUESTION_LAYOUT
- SOLUTION_LAYOUT
- META
- VISUAL_SVG

qid별 `sourceMode` provenance와 필요한 evidence를 만든다.

필요한 solution/Visual 작업에서는 현재 Git의 관련 품질 프로토콜과 skill을 사용한다.

### R1

전 qid DEEP review.

수학 독립풀이/answer 비교와 별도로 전 qid의 QUESTION_LAYOUT / SOLUTION_LAYOUT / META / VISUAL_SVG 4축을 독립 검수하고 qid별 근거를 기록한다. CREATE의 PASS나 VISUAL_EXEMPT를 그대로 승계하지 않는다. Visual/SVG 필요성 및 Meta의 기존 값을 실제로 확인하며 validator는 Meta를 재분류하지 않는다.

기존 수학/answer PASS에 4축 검수만 누락된 경우 사용자 승인 범위의 supplemental evidence로 보충한다. 수학 독립풀이/answer 비교와 전체 CREATE/R1/R2/R3를 재실행하지 않는다. 실제 수정 qid와 direct dependency만 evidence를 재결속하고 필요한 R3도 해당 locus만 targeted 검수한다.

`independentAnswer`를 `storedAnswer` 공개 전에 freeze한다.

repair가 필요하면 같은 stage에서 최소 수정 후 changed locus만 다시 확인한다.

### R2

전 qid BLIND SWEEP.

`blindAnswer`를 R1/stored answer 공개 전에 freeze한다.

freeze 전에는 시험지 JS 전체 출력이나 answer/solution을 노출할 수 있는 검색을 하지 않는다. 안전한 파서로 학생용 지문/선택지/문제 그림 필드만 별도 입력으로 추출하고 그 입력만 읽는다.

freeze 전 저장 답/해설이 노출되면 해당 실행의 freeze 증거를 사실대로 기록하고 `FAILED_ATTEMPT`로 보존한다. 구조 validator가 PASS여도 closure를 소비하지 않는다. ROOT는 새 `archive_r2`를 clean context에서 spawn하며, 이 품질 재실행을 MASTER에 넘기지 않는다.

MATCH는 빠르게 통과하고 mismatch/suspicious locus만 깊게 처리한다.

### R3

TARGETED RELEASE 전용.

whole-exam 재검을 하지 않는다.

다음만 확인한다.

- open finding
- changed locus
- direct dependency
- locked-scope integrity
- release integrity

### MASTER

신규 production target을 절대 선택하지 않는다.

ROOT가 넘긴 durable continuation만 처리한다.

`firstMissingClosureStep`의 exact missing closure만 해결한다.

전체 시험지나 이전 stage를 다시 수행하지 않는다.

## 7. Generic Validator / Closure Authority

외부 validator entrypoint:

`archive/tools/archive-stage-validator.mjs`

V2 stage modules:

- CREATE: `archive-stage-validator-create-v2.mjs`
- R1: `archive-stage-validator-r1-v2.mjs`
- R2: `archive-stage-validator-r2-v2.mjs`
- R3: `archive-stage-validator-r3-v2.mjs`

runtime/closure:

`archive/tools/archive-stage-runtime-v2.mjs`

repair/rebind:

`archive/tools/archive-repair-alive-v2.mjs`

정상 흐름은:

`WORK COMPLETE → V2 VALIDATE ONCE → consumeValidationPass() → NEXT STAGE`

validator report 자체가 stage를 바꾸지 않는다.

READY/QUEUE/CLAIM/ELIGIBLE 같은 새 중간 ceremony를 만들지 않는다.

## 8. Continuation Contract

technical closure가 현재 worker에서 닫히지 않으면 durable continuation을 남긴다.

최소 payload:

- stage
- examUid
- inputArtifactSha
- finalArtifactSha
- evidenceRef
- completedStep
- firstMissingClosureStep
- exactReason

ROOT는 이를 MASTER에 넘긴다.

MASTER가 닫지 못해도 최신 continuation만 남기며 전체 quality stage를 rewind하지 않는다.

## 9. Worker Return Contract

worker는 우선 아래만 compact하게 반환한다.

- `examUid`
- `stage`
- `result = PASS | CONTINUATION | CLOSED`
- `finalArtifactSha`
- `evidenceRef`
- `firstMissingClosureStep = NONE | value`
- `exactReason = NONE | value`

필요할 때만 changed qid 등 최소 정보를 추가한다.

장문의 작업 일지를 ROOT에 보내지 않는다.

## 10. Git HARD

- 한 실제 작업 = 독립 commit
- 대상 파일만 stage
- `git add .` / `git add -A` 금지
- force push 금지
- 중간 stage마다 latest-main reconciliation 반복 금지
- MAIN 반영 직전에만 latest main / overlap 최종 확인
- unrelated production/M2-1 mutation 금지

### 실제 MAIN_DONE 조건

R3→MAIN state receipt는 publication 완료 증거가 아니다. `_generated/source-only/`의 final artifact만으로 MAIN_DONE을 선언하지 않는다. 실제 production canonical 파일에 final artifact를 반영하고 필요한 asset reference가 유효한지 최소 확인한 뒤, production path 및 최종 Git blob SHA에 결속된 MAIN_DONE/closeout receipt를 남긴다.

현재 `21_연향중_2학기_기말_중2_기출`의 production 대상은 `archive/exams/original/middle/m2/2final/21_연향중_2학기_기말_중2_기출.js`다. source-only/generated에서 시작한 구조의 재설계는 별도 작업이며 이번 보충 검수/publication에서는 변경하지 않는다.

## 11. Quality References for Workers Only

실제 수정이 필요할 때 해당 worker만 필요한 범위에서 확인한다.

- `docs/rules/02_PIPELINES/해설프로토콜.md`
- `docs/rules/02_PIPELINES/수정프로토콜.md`
- `.codex/skills/apmath-visual-upgrade/SKILL.md` — Visual/SVG 작업이 실제 필요한 경우

ROOT는 정상 routing을 위해 이 문서들을 읽지 않는다.

## 12. Canary Measurement

최종 보고:

- 최종 상태
- ROOT가 spawn한 총 subagent 수
- CREATE/R1/R2/R3/MASTER 역할별 spawn 횟수
- MASTER 발생 횟수
- ROOT가 정상 routing 외 판단에 개입한 횟수
- 가능하면 ROOT token/usage
- 가능하면 subagent별 token/usage
- 불필요한 재조회/재검 발생 여부
- stage별 PASS 여부
- 최종 main SHA

이번 canary의 목적은 **품질 + conveyor 동작 + ROOT 비용**을 한 시험지에서 측정하는 것이다.
