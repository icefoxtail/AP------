# 시험지 출고·main 운영병합

> 2026-10-30 루트 `AGENTS.md`에서 옮긴 원문이다. 문구는 그대로 두고, 링크 경로만 이 폴더 기준으로 고쳤다. 본문 속 백틱 경로는 저장소 루트 기준이다.
> 이 영역 작업을 시작할 때 읽는다. 공통 규칙과 작업별 안내는 루트 [AGENTS.md](../../AGENTS.md)에 있다. 새 지시는 루트 `AGENTS.md`가 아니라 이 문서에 추가한다.

## CURRENT TOP — 사용자 지정 시험지 출고: 상태값만으로 전건 보류 금지 (2026-10-19)

- 사용자가 범위·examUid를 지정해 `main` 운영병합을 명시하면, **지정 감독·출고 실행자 Codex/Work/ROOT가 실제 R3/MASTER 패킷 검토·표적 결함 수리·PR/main 병합·요청된 Drive DONE 마감까지 직접 수행**한다. `SUPERVISORY_REVIEW_REQUIRED`, `PENDING_SUPERVISOR_DECISION`, `R3_REVIEWED`, `readyForUnattendedMerge=false`, `qualityPass=false`, `NOT_RUN`이라는 상태명 **단독**으로 승인자 부재를 이유 삼아 0건 PR·전건 중단 보고하는 것은 금지한다. `readyForUnattendedMerge=false`는 사용자 승인 없는 무인 자동 병합 금지이지 사용자 직접 지정한 감독 실행 금지가 아니다.
- 기존 검수 실증거를 승계하되 진짜 open qid/원본 충돌/JS·에셋 손상 등 직접 차단은 해당 시험지에서 **최소 확인·수정·영향 재확인**, 해결 불가하면 해당 시험지만 정확한 근거로 분리. 품질 PASS/검사 실행을 꾸미지 말고 나머지는 병합을 계속한다. GitHub 보호 규칙 우회 및 범위 밖/공통 CI 수리/전면 R1~R3 재시작 금지.
- HIGH_DYNAMIC 출고 입력은 [Google Drive RELEASE_HUB](https://drive.google.com/drive/folders/1DQigbs29hiuvwxbS-6i7w6hK6iziNk57)의 대상 PENDING revision이며 구 ChatGPT Library 허브가 아니다. 병합 후 원격 `main` SHA·대상 blob SHA 확인, **같은 revision만** Drive DONE+PR/SHA 기록/readback. main 병합만 요청된 경우 `GIT_MAIN_MERGED`와 CI/Pages 검증 상태를 분리한다.
- **운영병합 세부 정본:** [Archive MAIN_FIRST / CI_DEFERRED — 2026-10-19 감독 인수 override](../../docs/operations/Archive_MAIN_FIRST_CI_DEFERRED_CURRENT.md). 이 상단 조항이 출고 상태만으로 별도 관리자 인증을 기다리게 하는 구 해석에 우선하며, 예약 CREATE/R1/R2/R3·MASTER의 Git writer 금지는 불변이다.

## CURRENT TOP — 명시적 MAIN 운영병합은 CI 후속 수리와 분리 (2026-10-18, user-directed)

- 사용자가 시험지/산출물의 `main` 운영병합을 지시하면 **인가된 출고 담당 GPT Work/Codex/ROOT는 병합부터 실행한다.** `CI` pending/fail/not_run이나 무관한 오래된 테스트 실패를 선행 승인·중단 게이트로 해석하지 않는다. GitHub가 허용하는 PR 병합을 CI 완료 전에 시도하고 실제 원격 main SHA 및 파일을 readback한다.
- **CI 결과와 병합은 독립 장부**: `GIT_MAIN_MERGED`는 실제 병합만 뜻하며 CI/Pages/학생 배포 PASS를 뜻하지 않는다. CI 오류는 `CI_DEFERRED/CI_FAIL_FOLLOWUP`으로 사실대로 남기고 **사용자가 따로 지시하기 전에는 CI 수리·공통 도구/워크플로 수정·재검수·게이트 완화를 하지 않는다.**
- branch protection/required checks가 실제 GitHub 병합 API를 거절하면 강제 push나 보호 해제는 금지하며, PR·정확한 오류를 남긴다. 기존 시험지의 정답/필수 자산 실제 결함도 거짓 PASS로 우회하지 않고 해당 대상만 분리한다. 예약 CREATE/R1/R2/R3 Git writer 금지는 유지한다.
- **공통 실행 정본:** [Archive MAIN_FIRST / CI_DEFERRED](../../docs/operations/Archive_MAIN_FIRST_CI_DEFERRED_CURRENT.md). 명시적 “main 병합만”은 전체 학생 사이트 배포 및 콘텐츠 재검수 지시가 아니다.
