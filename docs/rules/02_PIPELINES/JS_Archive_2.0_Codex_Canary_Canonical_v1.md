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

## 4. Spawn Policy

5개 agent를 처음부터 동시에 spawn하지 않는다.

정상 흐름:

1. CREATE 필요 → `archive_create` spawn
2. CREATE V2 PASS → 즉시 `archive_r1` spawn
3. R1 V2 PASS → 즉시 `archive_r2` spawn
4. R2 V2 PASS → 즉시 `archive_r3` spawn
5. R3 V2 PASS → MAIN closure
6. `archive_master`는 durable continuation이 실제 발생했을 때만 spawn

정상 상황에서 production stage worker는 동시에 1개만 실행한다.

MASTER continuation이 병행될 때만 최대 2개 thread를 허용한다.

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

`independentAnswer`를 `storedAnswer` 공개 전에 freeze한다.

repair가 필요하면 같은 stage에서 최소 수정 후 changed locus만 다시 확인한다.

### R2

전 qid BLIND SWEEP.

`blindAnswer`를 R1/stored answer 공개 전에 freeze한다.

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
