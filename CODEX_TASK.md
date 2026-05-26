/goal AP------ 전체 Hermes 운영층 실제 생성 전, Hermes Agent 원본 구조를 다시 확인하고 AP 루트 이식 지시를 보정하라.

이번 작업은 AP 루트 운영층을 바로 생성하는 작업이 아니다.
이번 작업은 AP 전체 Hermes 운영층 생성 전에 Codex가 Hermes Agent 원본 GitHub를 다시 읽고, 이미 작성된 AP 전체 조사 보고서와 대조해 실제 생성 지시서의 정확도를 높이는 사전 검토 작업이다.

작업 루트:
C:\Users\USER\Desktop\AP------

Hermes Agent 원본 GitHub:
https://github.com/NousResearch/hermes-agent

## 1. 목적

archive/textbook에는 이미 Hermes식 하위 운영층이 생성되어 있다.
AP------ 전체에도 Hermes식 상위 운영층을 만들 예정이지만, 실제 생성 전에 Hermes Agent 원본 구조를 다시 확인한다.

이번 작업의 목적은 다음이다.

- Hermes Agent 원본의 실제 구조를 다시 확인
- AP 전체 조사 보고서와 대조
- AP 루트 운영층에 가져올 개념과 가져오면 안 되는 개념을 재분류
- 다음 라운드 “AP 루트 운영층 실제 생성 지시서”를 보정
- 코드 수정 없이 report-only로 끝낸다

## 2. 절대 금지

- git add 금지
- git commit 금지
- git push 금지
- Hermes Agent 설치 금지
- Hermes Agent 실행 금지
- Hermes Agent 코드 복사 금지
- dependency 추가 금지
- package.json / package-lock.json 수정 금지
- daemon / cron / MCP 서버 생성 금지
- AP 루트 .agent 실제 생성 금지
- docs/agent-skills 실제 생성 금지
- plans 실제 생성 금지
- reports/agent-memory 실제 생성 금지
- archive/textbook/.agent 수정 금지
- archive/textbook/docs/agent-skills 수정 금지
- archive/textbook/plans 수정 금지
- archive/textbook/reports/agent-memory 수정 금지
- apmath 수정 금지
- apmath/worker-backup 수정 금지
- archive/exams 수정 금지
- archive/core HTML 수정 금지
- archive/textbook generated 산출물 수정 금지
- docs 기준 문서 수정 금지
- 코드 파일 수정 금지
- 운영 파일 수정 금지
- 루트 CODEX_RESULT.md 덮어쓰기 금지

이번 작업은 읽기/비교/보고서/다음 지시서 보정만 허용한다.

## 3. 먼저 읽을 AP 기준 파일

아래 파일을 실제로 확인한다.

- docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md
- docs/README.md
- docs/WANGJI_OS_STRUCTURE.md
- docs/WANGJI_OS_ROADMAP.md
- reports/AP_HERMES_FULL_MIGRATION_ASSESSMENT_*.md
- reports/AP_HERMES_DOMAIN_MAP_*.json
- reports/AP_HERMES_NEXT_TASK_DRAFT_*.md
- archive/textbook/.agent/BOOT.md
- archive/textbook/.agent/SKILLS_INDEX.md
- archive/textbook/reports/agent-memory/verified-decisions.md

파일이 없으면 없는 것으로 기록한다.
추측해서 쓰지 않는다.

## 4. Hermes Agent 원본 확인

반드시 아래 GitHub를 확인한다.

https://github.com/NousResearch/hermes-agent

확인할 항목:

- README.md
- AGENTS.md
- skills/
- optional-skills/
- plans/
- .plans/
- tools/
- plugins/
- mcp_serve.py
- trajectory_compressor.py
- mini_swe_runner.py 또는 유사 실행/runner 파일
- memory / learning loop / self-improvement 관련 설명
- subagent / parallel workstream 관련 설명
- gateway / CLI / Telegram / Discord / Slack 등 외부 interface 관련 설명

확인 기준:

- AP 루트 운영층에 구조로 가져올 것
- AP 루트 운영층에 가져오면 안 되는 것
- archive/textbook 하위 운영층과 충돌할 수 있는 것
- Codex 작업 흐름에 맞게 문서화만 해야 하는 것
- 실제 runtime/dependency로 도입하면 위험한 것

주의:
- Hermes 코드를 다운로드/복사하지 않는다.
- Hermes를 실행하지 않는다.
- pip/npm 설치하지 않는다.
- GitHub 접근 실패 시 실패 사유를 기록하고, 기존 조사 보고서 기준으로만 판단한다.

## 5. 작성할 보고서

다음 파일을 생성한다.

reports/AP_HERMES_SOURCE_RECHECK_YYYYMMDD.md
reports/AP_HERMES_SOURCE_RECHECK_CODEX_RESULT_YYYYMMDD.md
reports/AP_HERMES_ROOT_LAYER_NEXT_TASK_REVISED_YYYYMMDD.md

루트 CODEX_RESULT.md는 수정하지 않는다.

## 6. AP_HERMES_SOURCE_RECHECK 작성 구조

# AP_HERMES_SOURCE_RECHECK

## 1. 확인 범위
- Hermes GitHub URL
- 확인한 Hermes 파일/폴더
- 확인한 AP 보고서/문서
- 접근 실패 항목

## 2. Hermes 원본 핵심 구조
표로 작성한다.

열:
- Hermes 구성요소
- 원본 위치
- 역할
- AP에 가져올 방식
- AP에 가져오면 안 되는 방식

구성요소 예시:
- AGENTS.md
- skills
- optional-skills
- plans
- .plans
- trajectory_compressor.py
- tools
- plugins
- mcp_serve.py
- memory / learning loop
- subagent / parallel workstream
- gateway / external interface

## 3. AP 전체 이식에 가져올 것

반드시 아래 항목을 판단한다.

- BOOT
- SKILLS_INDEX
- DOMAIN_LOCK_POLICY
- DOMAIN_STATUS_BOARD
- WORKSTREAM_TEMPLATE
- RESULT_TEMPLATE
- agent-memory
- repeated-errors
- verified-decisions
- compressed-history
- parallel-workstream
- trajectory compression 개념
- self-improvement suggestion loop

## 4. AP 전체 이식에서 제외할 것

반드시 아래 항목을 제외 후보로 검토한다.

- Hermes runtime 전체 설치
- Hermes 외부 코드 복사
- MCP 서버
- daemon/cron
- Telegram/Discord/Slack/WhatsApp gateway
- 자동 git
- 자동 push
- 자동 deploy
- 자동 운영 API smoke
- 자동 UI 노출
- 자동 schema migration
- 자동 문제/정답/발문 생성

## 5. archive/textbook 하위 운영층과의 관계

- archive/textbook은 이미 하위 운영층으로 둔다.
- AP 루트 운영층은 상위 라우터 역할만 한다.
- AP 루트에서 textbook 내부 queue를 직접 덮어쓰지 않는다.
- textbook 작업은 textbook BOOT와 skill을 우선한다.
- AP 루트 skill에는 textbook-pipeline-sop을 “위임” 형태로 둔다.

## 6. AP 루트 운영층 생성 지시서 보정 사항

기존 reports/AP_HERMES_NEXT_TASK_DRAFT_*.md를 기준으로 보정할 점을 적는다.

반드시 포함:
- Hermes 원본을 읽었다는 근거
- AP 루트에는 runtime이 아니라 문서 운영층만 생성
- archive/textbook 하위 운영층 보호
- docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md 최상위 우선
- git/deploy/운영 smoke 금지
- UI 노출 승인 원칙
- 도메인별 lock 정책

## 7. 최종 권고

다음 중 하나로 판정한다.

- AP 루트 운영층 생성 진행 가능
- 보정 후 진행 가능
- 보류

사유를 적는다.

## 7. REVISED NEXT TASK 작성 기준

reports/AP_HERMES_ROOT_LAYER_NEXT_TASK_REVISED_YYYYMMDD.md에는 다음 라운드에서 바로 붙여넣을 수 있는 순수 지시서를 작성한다.

목표:
- AP 루트 Hermes 운영층 실제 생성
- AP------/.agent 생성
- AP------/docs/agent-skills 생성
- AP------/plans 생성
- AP------/reports/agent-memory 생성

단, 다음을 반드시 포함한다.

- Hermes 원본 구조를 참고하되 설치/복사 금지
- archive/textbook 하위 운영층 수정 금지
- docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md 최상위 우선
- root .agent는 AP 전체 라우터
- textbook .agent는 하위 도메인 운영층
- 도메인별 skill 생성
- 도메인별 lock policy 생성
- 코드 수정 금지
- 루트 CODEX_RESULT.md 덮어쓰기 금지
- 별도 reports/AP_HERMES_ROOT_LAYER_CODEX_RESULT_YYYYMMDD.md 작성

## 8. 검증

작업 후 아래를 실행한다.

cd C:\Users\USER\Desktop\AP------

Test-Path reports\AP_HERMES_SOURCE_RECHECK_*.md
Test-Path reports\AP_HERMES_SOURCE_RECHECK_CODEX_RESULT_*.md
Test-Path reports\AP_HERMES_ROOT_LAYER_NEXT_TASK_REVISED_*.md

git status --short --untracked-files=all
git diff --name-only

검증 기준:
- 생성 파일은 reports/AP_HERMES_SOURCE_RECHECK_*.md, reports/AP_HERMES_SOURCE_RECHECK_CODEX_RESULT_*.md, reports/AP_HERMES_ROOT_LAYER_NEXT_TASK_REVISED_*.md 정도만 있어야 한다.
- 코드 파일 수정 없어야 한다.
- docs 기준 문서 수정 없어야 한다.
- archive/textbook 운영층 수정 없어야 한다.
- 루트 CODEX_RESULT.md 수정 없어야 한다.
- git add/commit/push 없어야 한다.

## 9. CODEX_RESULT 작성

reports/AP_HERMES_SOURCE_RECHECK_CODEX_RESULT_YYYYMMDD.md에 작성한다.

형식:

# CODEX_RESULT

## 1. 생성/수정 파일
- reports/AP_HERMES_SOURCE_RECHECK_YYYYMMDD.md
- reports/AP_HERMES_ROOT_LAYER_NEXT_TASK_REVISED_YYYYMMDD.md
- reports/AP_HERMES_SOURCE_RECHECK_CODEX_RESULT_YYYYMMDD.md

## 2. 실제 확인한 파일
- Hermes 원본에서 확인한 파일/폴더
- AP 기준 문서
- AP Hermes 조사 보고서
- textbook 하위 운영층 대표 파일

## 3. 확인 완료
- Hermes 원본 구조 확인
- AP 전체 이식에 가져올 것/제외할 것 재분류
- archive/textbook 하위 운영층과 루트 운영층 관계 재정리
- 다음 라운드 지시서 보정

## 4. 실행 결과
- GitHub 확인 성공/실패
- 생성 파일 확인
- git status
- git diff --name-only

## 5. 결과 요약
- AP 루트 운영층 생성 가능 여부
- 보정된 조건
- 다음 조치

## 6. 하지 않은 작업
- Hermes 설치 없음
- Hermes 코드 복사 없음
- AP 코드 수정 없음
- docs 기준 문서 수정 없음
- archive/textbook 수정 없음
- 루트 CODEX_RESULT.md 수정 없음
- git add/commit/push 없음

## 10. 마지막 자기검증

완료 전 확인한다.

- Hermes GitHub 원본을 실제로 확인했는가?
- 확인 실패 시 실패 사유를 기록했는가?
- AP 전체 조사 보고서를 읽었는가?
- archive/textbook 하위 운영층을 읽었는가?
- runtime이 아니라 문서 운영층만 권고했는가?
- root .agent와 textbook .agent 관계를 구분했는가?
- 다음 라운드 지시서가 바로 붙여넣기 가능한가?
- 루트 CODEX_RESULT.md를 건드리지 않았는가?
- 코드 수정이 없는가?
- git add/commit/push를 하지 않았는가?

완료 후 멈춰라.
AP 루트 운영층 실제 생성은 다음 라운드에서 한다.