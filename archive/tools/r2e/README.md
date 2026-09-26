# Codex R2E 예약 실행 보조

운영 정본은 `docs/rules/02_PIPELINES/JS_ARCHIVE_R2E_INTAKE_TO_MAIN_v1.md`다.
이 디렉터리는 검수·수정·승격 알고리즘을 다시 구현하지 않는다. Codex가 정본과 기존
Archive/Meta/RPM 도구를 적용할 때 사용하는 실행 잠금, 입력 snapshot, 최종 gate만 제공한다.
새 intake 작업에는 legacy Library/Apply Bridge 경로를 사용하지 않는다.

## 시작 순서

1. `.agent/BOOT.md`.
2. 연결된 Notion `GPT 작업 전 필독 라우터`.
3. Notion `Archive 2.0 / JS Archive 시작 페이지`.
4. 최신 `origin/main` fetch 및 시작 SHA 기록.
5. 최신 main의 `JS_ARCHIVE_R2E_INTAKE_TO_MAIN_v1.md`, rules index/manifest,
   해당 source/correction/Meta/RPM/visual/검증 정본.

현재 사용자 지시가 기존 기본 금지보다 우선한다. 기존 dirty 파일을 수정하지 않는다.

## 6시간 예약

서울 시간 00:00 / 06:00 / 12:00 / 18:00. 모델 `gpt-6-luna`, reasoning `max`.
사용자에게 보이는 예약 prompt는 `AUTOMATION_PROMPT.md`를 사용한다.
새 run은 Git receipt와 checkpoint에서 상태를 복원하며 채팅을 authority로 사용하지 않는다.

## 실행 보조

아래 MODULE은 이 구현이 있는 worktree의 `archive/tools/r2e` 경로다. REPO는 동일 Git 저장소의
checkout이다. 모듈은 working branch와 관계없이 Git common directory의 하나의 OS lock을 사용한다.

```powershell
node MODULE/guard.mjs start --repo REPO --run-id RUN_ID
node MODULE/snapshot.mjs --repo REPO --run-id RUN_ID --out tmp/RUN_ID/snapshot.json
node MODULE/guard.mjs heartbeat --repo REPO --run-id RUN_ID
node MODULE/guard.mjs check --repo REPO --run-id RUN_ID
node MODULE/final-gate.mjs --repo CANDIDATE_WORKTREE --ledger LEDGER_JSON --validation VALIDATION_JSON
node MODULE/guard.mjs stop --repo REPO --run-id RUN_ID
```

`start`는 살아 있는 background terminal로 유지한다. `RUN_ALREADY_ACTIVE`면 해당 실행은 종료한다.
Python 표준 라이브러리의 Windows byte lock/POSIX flock은 프로세스 종료 시 OS가 해제한다.
다른 호스트의 잔여 owner는 자동으로 훔치지 않는다. fencing token은 획득마다 증가한다.
검수 중 stage 사이에 heartbeat를 보내고 모든 Git mutation 직전에 자기 runId로 check한다.
90분 동안 worker heartbeat가 없으면 guard가 종료되어 오래 방치된 무작업 프로세스가
이후 예약을 계속 차단하지 않는다. 만료 후 이전 worker는 mutation 전에 check 실패로 멈춘다.

## Snapshot과 receipt

- 입력 branch는 `work/intake/m2`, `work/intake/m3` 두 개만 allowlist에 있다.
- receipt는 정본의 `archive/data/r2e-intake/<grade>/<examUid>.json`을 읽는다.
- `nextState=READY_FOR_R2E`와 정본 최소 필드를 확인한다. item-level review evidence는
  Codex가 연결된 실제 ledger에서 확인하며 receipt 자체를 수학 PASS로 보지 않는다.
- 두 HEAD를 먼저 고정한 뒤 각 고정 tree에서 inventory를 만든다.
- 결과 receipt가 실제 들어간 commit을 `inputCommit`으로 동결한다. receipt 내부 inputCommit은
  `declaredInputCommit`으로 따로 보존하고 snapshot history의 조상인지 확인한다.
  이것은 같은 commit에 자기 SHA를 적어 넣는 순환 문제를 피한다.
- receipt 이후 JS/SVG byte drift가 있으면 새 receipt 없이는 READY로 인정하지 않는다.
- 원격 `work/r2e-state`가 있으면 `archive/data/r2e/<grade>/exams/*.json`을 먼저 복원한다.
- 현재 run이 끝날 때까지 snapshot을 다시 만들어 대상 시험지를 추가하지 않는다.
- `NO_WORK`면 guard를 종료한다. 잘못된 receipt는 파일별 오류로 남겨 다른 유효 입력을 막지 않는다.

Snapshot과 stage 결과는 정본 경로의 파일로 저장하고 R2E 전용 durable branch에
명시적으로 commit/push한다. ACK된 remote commit까지의 결과만 resume authority다.
수학/Meta/SVG 판단과 각 단계 수행은 예약 Codex가 한다. 새로운 HTTP controller나
checkpoint transaction framework, 자동 수학 판정기는 필요하지 않다.

## 최종 gate의 입력

정본 ledger 필드에 `examFile`, `inputBranch`, `inputCommit`, `dependencyShas[]`,
`denominator`, `integrityScanned`(실제로 확인한 문항 수), `deepReviewItems[]`,
`resolvedItems[]`, `remainingItems[]`, `unresolvedItems[]`, `items[]`를 제공한다.
정상 R1 PASS는 `reviewMode=INTEGRITY_REUSE`. 실제 invalidation이 있으면 이유를 기록한다.
최종 disposition은 정본의 `MATERIALIZED`를 포함한 7종을 사용한다.

검증 보고서는 `artifactSha256`, `inputCommit`, `artifacts[]`와 `gates`를 가진다.
각 gate는 실제 검사 결과와 `{status, evidenceRef:{path,sha256}}`를 담는다.
`REQUIRED_GATES`는 정본 검증 목록 및 actual render다. 보고서는 기존 도구의 실제
출력/검수 evidence를 연결해야 하며 빈 PASS 문자열을 만들어 넣지 않는다.
gate는 JS VM load·분모·identity·blank·문자열을 직접 확인하고, dependency/asset/evidence
SHA와 검증 coverage, 미해결 Meta를 확인한다. 나머지 의미 검증은 기존 정본 도구의 증거를 소비한다.
결과의 `productionAuthorized=false`는 이 helper 하나가 production 승격 권한을
만들지 않는다는 뜻이다. main 반영은 정본의 전체 조건과 사용자 권한을 함께 적용한다.

## Production 및 reopen

Codex가 최신 main의 격리 integration worktree에서 최종 파일만 명시 stage한다.
시험지 하나의 final production commit, 필요 시 별도의 shared Meta commit.
intake/state branch 전체 merge, `git add .`, `git add -A`, force push는 금지한다.
checkpoint/scratch/input ZIP은 main에 넣지 않는다. push 후 ancestry·최종 bytes와
canonical/runtime/catalog parity를 확인한 receipt를 durable state에 기록한다.
이미 완료된 항목은 정본의 source 변경·final byte drift·관련 canonical/rule invalidation·
regression·사용자 지시가 있을 때만 reopen한다.

## 테스트 범위

`node --test archive/tools/r2e/tests/*.test.mjs`.
임시 bare Git 저장소에서 remote READY snapshot, resume 우선, malformed receipt 격리,
lane authority 배제, late commit 동결, OS lock과 fencing, final gate 거부 조건을 검사한다.
실제 시험지 검수나 production main push는 테스트에서 실행하지 않는다.
