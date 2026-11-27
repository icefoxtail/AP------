# Archive 등록기 자동 진단 — 운영 안내

`Archive Main Auto Metadata`가 유일한 등록 writer이다. `Archive Registration Assistant`는 등록 성공/실패를 읽고 GitHub 이슈 **`[자동 진단] Archive 등록기 차단 오류`**를 갱신하는 읽기 중심 보조 워크플로다.

## 자동 실행

- 등록기 실행이 완료되면 `workflow_run`으로 자동 진단한다. 성공하면 기존 열린 차단 이슈를 닫고, 실패하면 등록 잡 로그에서 오류 코드·대상·원인을 추려 하나의 이슈를 만든다/갱신한다.
- 예전 실행의 늦은 알림은 무시한다. 최신 완료 `main` 등록 실행만 처리한다. PR 테스트 실행은 대상이 아니다.
- 로그 전체를 이슈에 복사하지 않고 허용된 오류 코드·자산 경로만 기록한다. 불확실한 오류는 `UNCLASSIFIED`로 남긴다.
- 등록 writer·대기열·UID·승인 영수증·R2·Pages를 이 보조기가 변경하지 않는다. 필수 단계의 실패를 성공으로 처리하거나 검증·배포 게이트를 우회하지 않는다.

## 수동 실행

1. [Actions — Archive Main Auto Metadata](../../.github/workflows/archive-main-auto-meta.yml) → `Run workflow` → `main`으로 **등록 소화 실행**을 요청할 수 있다. 기존 동시성 잠금을 따르므로 실행 중이면 순서를 기다린다.
2. [Actions — Archive Registration Assistant](../../.github/workflows/archive-registration-assistant.yml) → `Run workflow` → `main`으로 **진단만** 다시 실행한다. `run_id`를 비우면 최신 완료 등록 실행을 본다.
3. 차단 이슈에 자산/오류가 나타나면 작업 AI에게 해당 문제의 최소 수리·검증·PR 병합·등록 확인을 요청할 수 있다. 이슈 진단만으로 수리/등록/학생 배포가 완료되는 것은 아니다.

## 자동 복구의 범위

등록기의 기존 소스 변경 감지·영속 pending·writer 재시도는 그대로 동작한다. 보조기는 오류를 공개적으로 분류하고 추적한다. 의미 메타 작성, 승인 검토, SVG 재제작 또는 코드 수정에 필요한 **상시 무인 AI 작성·병합 기능은 포함하지 않는다**. 그런 기능은 독립된 AI 실행 주체/자격 증명과 검증·권한 계약이 준비된 뒤 도입해야 한다.
