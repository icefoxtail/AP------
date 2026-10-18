# JS Archive — MAIN_FIRST / CI_DEFERRED 운영병합 계약 (CURRENT)

- 제정: 2026-10-18 KST, 사용자 직접 지시
- 적용: 사용자가 **Git main 반영/운영병합**을 명시한 Archive 시험지·이미지·정해진 산출물의 출판 담당 GPT Work, Codex, ROOT, 기술 병합 워커
- 비적용: CREATE/R1/R2/R3 자체의 수학·콘텐츠 품질 판정 변경, 사용자 지정 범위 밖 파일, 학생 배포 성공 주장, GitHub 보안 설정 변경
- 최상위 규칙: 사용자 최신 명시 지시의 대상·작업 범위·종료 조건 우선. 이미 완료된 콘텐츠에 대한 새로운 검수·CI 수리 의무를 출판 작업에 자동 추가하지 않는다.

## 1. 단일 실행 원칙 — main 병합 먼저

사용자가 `main에 병합`, `운영병합`, `병합만`, `CI는 나중에 따로 수리`를 요청한 경우:

1. 사용자가 지정한 산출물만 최신 `main`에 맞추고, 해당 JS/필수 에셋의 운영 경로와 변경 범위를 확인한다.
2. 기존 검수·수정 완료물을 재심사하거나 CREATE→R1→R2→R3를 재시작하지 않는다. 새 수학 검수, Golden/Negative 재검수, Meta 전체 재분류, 신규 런타임 검증 캠페인을 생성하지 않는다.
3. Git 병합에 필요한 기계적 사전 확인(실파일/경로, 변경 범위, 충돌, 필요 시 구문/필수 참조)만 수행한다. 정상 파일은 재수정하지 않는다.
4. PR 생성 뒤 **CI PASS 여부를 기다리지 않고** GitHub가 실제로 허용하는 즉시 병합을 시도한다. CI가 `pending`, `in_progress`, `failure`, `cancelled`, `not_run`이어도 *그 자체만을 이유로* 병합 작업을 중단하지 않는다.
5. 병합 후 최신 원격 `main` SHA, 대상 파일 경로/존재, 대상 PR을 readback한다. 여기까지를 `GIT_MAIN_MERGED`로 기록한다.
6. CI는 별도 상태 `CI_DEFERRED` 또는 `CI_FAIL_FOLLOWUP`로 사실대로 남긴다. 검사/빌드의 실제 통과 여부를 `PASS`로 조작·가정하지 않는다. **CI 원인 분석·수정·설정 완화는 사용자 별도 명령 전까지 실행하지 않는다.**

## 2. 상태를 3개 축으로 분리

- `gitPublicationStatus`: `PENDING` / `GIT_MAIN_MERGED` / `GIT_MERGE_BLOCKED`. 판정 기준은 실제 Git 원격 main readback.
- `ciStatus`: `NOT_CHECKED` / `RUNNING` / `PASS` / `FAIL_FOLLOWUP` / `CI_DEFERRED`. CI 실패는 merge status를 되돌리지 않는다.
- `studentDeploymentStatus`: `NOT_REQUESTED` / `NOT_VERIFIED` / `PUBLISHED_VERIFIED` / `FAILED`. `GIT_MAIN_MERGED`는 Pages/학생 사이트 배포 성공을 뜻하지 않는다.

기존 장부의 `MAIN_DONE`처럼 더 넓은 의미의 품질·등록·학생 화면 closeout을 가진 상태는 그 계약에 따른다. 사용자 요청이 **병합만**이면 그 이름으로 전체 배포 성공을 주장하지 말고 `GIT_MAIN_MERGED`를 명확히 보고한다. 등록/인덱스/배포를 사용자가 이번 요청에 포함했다면 그 직접 승인된 범위만 별도로 수행하며, CI 수리를 몰래 추가하지 않는다.

## 3. CI 관련 워커의 금지 행동

- 기존 다른 PR/main의 빨간 CI, 관련성 미확정 CI, 테스트 실패 알림만으로 명시된 운영병합을 보류하지 않는다.
- 본 요청을 CI 수리/리팩터링/워크플로 수정/새 도구 제작/공통 검사 완화로 변질시키지 않는다.
- `CI_FAIL_FOLLOWUP`는 남길 수 있지만, CI 재실행·수정 PR 생성은 별도 지시가 있을 때만 한다.
- `CI PASS`를 억지로 만들기 위한 검사 스킵·stub·거짓 receipt·workflow 조작을 하지 않는다.
- 내용상 실제 원본 미확정/JS 실물 누락·필수 자산 손상 등을 알고 있으면 새 검수를 만들지 말고 그 특정 대상의 실질적 차단 근거를 사실대로 기록한다. 나머지 독립 대상의 병합은 계속한다.

## 4. GitHub 플랫폼이 실제 거절하는 경우

- `mergeable` 추정치나 기존 CI 실패 이력만 보고 중단하지 말고, 실제 허용된 PR 병합 API/버튼으로 한 번 병합을 시도한다.
- GitHub required status check, branch protection, ruleset, conflict 또는 권한 부족 때문에 API가 **실제로 병합 거절**한 경우, 제한을 우회하는 강제 push/브랜치 설정 해제/검증 위조를 하지 않는다.
- 대상 파일까지 준비된 PR과 정확한 GitHub 오류를 남기고 `GIT_MERGE_BLOCKED_PLATFORM`이라고 보고한다. GitHub 규칙 변경은 소유자의 별도 정책 결정이다.
- 사용자에게 우회 수단을 찾는다고 무관한 CI 전체를 수리하거나 승인 범위를 확장하지 않는다.

## 5. 작업 범위·완료 보고

- 화이트리스트 파일만 stage/commit/PR; `git add .`/전체 파일 재등록 금지.
- 보고는 `PR`, `원격 main SHA`, `대상별 GIT_MAIN_MERGED 여부`, `실제 변경 파일`, `CI 결과(별도/후속)`, `학생 배포 결과(별도/미요청)`만 간단하게 한다.
- 예약 CREATE/R1/R2/R3의 Git writer 금지, original scope, 사용자 권한 경계는 그대로다. 이 문서는 **인가된 출고 담당**에만 적용된다.

## 6. Work·Codex 지시문 첫 줄에 넣을 문구

> **MAIN_FIRST / CI_DEFERRED:** 지정된 시험지와 필수 자산을 Git main에 먼저 운영병합하고 원격 SHA를 확인하라. CI 성공 여부는 병합 선행조건이 아니며 결과를 별도 기록하되, CI 원인 분석/수리/검사 우회/공통 코드 변경은 하지 마라. GitHub가 실제로 병합을 거절할 때만 정확한 플랫폼 차단을 보고하고, 나머지 대상은 계속하라. 학생 배포 성공을 main 병합과 혼동하지 마라.

## 7. 권위와 근거

- 사용자 2026-10-18 직접 지시: 운영병합과 CI 수리를 독립 업무로 운영하며 CI 수정은 이후 별도 명령.
- `AGENTS.md`, `archive/AGENTS.md`, `docs/rules/02_PIPELINES/JS_Archive_2.0_Codex_Fast_Lane_CURRENT_v1.md`, `docs/architecture/Archive_Correction_Owner_EndToEnd_Closeout_CURRENT_v1.md`와 함께 적용한다.
- 이 정책은 CI 자동 실행 자체를 비활성화하지 않고, 기존 검사 PASS와 CI/Pages 성공을 조작하지 않는다.
