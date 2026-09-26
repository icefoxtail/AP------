작업 시작 전 `.agent/BOOT.md` → 연결된 Notion 「GPT 작업 전 필독 라우터」 → 「Archive 2.0 / JS Archive 시작 페이지」 → 최신 `origin/main` → 해당 Git 정본 순서로 읽고 따른다. R2E는 최신 main의 `docs/rules/02_PIPELINES/JS_ARCHIVE_R2E_INTAKE_TO_MAIN_v1.md`를 필수 적용한다.

대상은 `work/intake/m2`, `work/intake/m3`의 유효한 READY_FOR_R2E 입력이다. 중1과 예전 레인별 branch는 포함하지 않는다. 목표는 selective R2E 최종 판정·허용된 최소 수정·검증·시험지별 main 반영을 거쳐 R2E_MAIN_FINAL까지 닫는 것이다. 세부 절차와 권한·validator·reopen 규칙은 정본을 적용한다. 현재 사용자 지시는 이 범위의 R2E 수정, checkpoint commit/push와 조건을 통과한 production integration을 허용한다.

모든 Meta adjudication은 `docs/rules/01_CANONICAL/JS아카이브_Meta_RPM_ACTIVE_공용Resolver_계약_v1.md`와 `archive/tools/meta-foundation/rpm-active-resolver.mjs`를 사용한다. Candidate key나 이전 verdict를 semantic first pass에 입력하지 않는다. Intake `READY_FOR_R2E`에는 shared resolver/difficulty sidecar ref가 있어야 하며, R2E_FINAL에는 공용 resolver가 재검증한 `metaResolutionReceipt`를 final gate에 넣는다. RPM_PRIMARY_MIGRATION_GAP, taxonomy proposal, unresolved CrossConcept, validator 미실행, runtime/Archive parity 실패는 final gate를 통과하지 못한다.

진행상태는 remote Git commit + 실제 ledger/receipt가 authority다. `work/r2e-state`의 기존 checkpoint가 있으면 신규 intake보다 먼저 복원한다. 기존 완료분을 다시 검수하지 않는다. intake HEAD와 대상 input commit을 시작 때 동결하고 이후 신규 R1 commit은 다음 run으로 넘긴다. 빈 queue는 NO_WORK로 종료한다.

이 구현 worktree의 `archive/tools/r2e/README.md`를 읽고 guard를 먼저 획득한다. 이전 실행이 active이면 RUN_ALREADY_ACTIVE로 종료한다. snapshot helper를 사용하되 현재 batch에 새 입력을 추가하지 않는다. checkpoint는 remote push 확인 후에만 저장 완료로 기록하며 모든 Git mutation 직전에 자기 guard를 check한다. 각 stage 사이에 heartbeat를 보내고 종료 시 guard를 stop한다.

정본·기존 도구로 검증하고 final-gate 보조를 통과한 시험지만 최신 main에 반영한다. 정상 PASS는 integrity만 확인하고 실제 deep-review 대상과 수정 영향 범위만 처리한다. 실패 시험지는 물리 상태를 저장하고 독립된 다른 시험지는 계속한다. main 반영과 parity를 실제 확인한 뒤 R2E_MAIN_FINAL receipt를 기록한다. 끝에는 완료/미완료 시험지, checkpoint/production commit, 다음 시작점만 간단히 보고한다.
