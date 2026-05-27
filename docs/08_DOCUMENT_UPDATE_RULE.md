# 08_DOCUMENT_UPDATE_RULE

## 1. 공통 3대 기준 문서 판단

모든 작업 끝에는 아래 문서 업데이트 필요 여부를 판단한다.

- `docs/MASTER_RULEBOOK.md`
- `docs/MASTER_CURRENT_PROGRESS.md`
- `docs/MASTER_NEXT_WORK.md`

업데이트하지 않은 기준 문서가 있으면 `CODEX_RESULT.md`에 이유를 기록한다.

## 2. 문서 추가 배치 규칙

새 문서는 루트에 바로 만들지 않는다. 먼저 `docs/_index/DOCS_STRUCTURE.md`를 확인하고 아래 기준으로 배치한다.

| 문서 유형 | 위치 |
|---|---|
| 도메인 정책/설계 | `docs/domains/` |
| 현재 구현 상태 | `docs/implemented/` |
| 다음 계획 | `docs/plans/` |
| Codex 실행/검수 규칙 | `docs/codex/` |
| agent SOP | `docs/agent-skills/` |
| 디자인/reference/운영 가이드 | `docs/guides/` |
| 분석 보고서 | `docs/reports/` |
| 완료 문서 | `docs/archive/completed/` |
| 과거 계획 | `docs/archive/old-plans/` |
| 과거 Codex 결과 | `docs/archive/codex-results/` |
| 과거 검수 요청 | `docs/archive/review-requests/` |
| legacy 문서 | `docs/archive/legacy/` |

## 3. 문서 이동 규칙

- 문서는 삭제하지 않는다.
- 이동 전 기존 경로와 새 경로 충돌 여부를 확인한다.
- 이동한 문서는 `docs/_index/ARCHIVE_INDEX.md`에 기록한다.
- 현재 진입 문서, README, 3대 기준 문서, domain index의 참조 경로를 우선 보정한다.
- archive 내부 과거 문서 본문은 과거 맥락을 보존할 수 있으므로 무리하게 모두 고치지 않는다.

## 4. 변경 유형별 업데이트

- 문서 구조 변경: `README.md`, `00_READ_ME_FIRST.md`, 3대 기준 문서, `_index/*`, 이 문서, 관련 Codex/SOP 문서.
- route/API 변경: `MASTER_CURRENT_PROGRESS.md`, `implemented/CURRENT_WORKER_ROUTE_MAP.md`, `implemented/CURRENT_API_FLOW_MAP.md`, 관련 domain/plan.
- DB/schema/migration 변경: `MASTER_CURRENT_PROGRESS.md`, `implemented/CURRENT_DB_MAP.md`, 관련 domain/plan.
- frontend 변경: `MASTER_CURRENT_PROGRESS.md`, `implemented/CURRENT_FRONTEND_MAP.md`, `implemented/CURRENT_UI_EXPOSURE_MAP.md`, 관련 domain.
- UI 문구 변경: 사용자 승인 근거, 관련 domain, `01_PROJECT_POLICY.md` 충돌 여부.
- hidden foundation 노출: 사용자 승인 근거, `CURRENT_HIDDEN_FOUNDATION_MAP.md`, 관련 domain/plan.
- 계획 변경: 관련 `plans/*.md`, `MASTER_NEXT_WORK.md`.

## 5. 금지

- 문서 정리 작업에서 코드, schema, migration, package, UI, Worker route를 수정하지 않는다.
- root `docs/`를 다시 과거 결과 문서 저장소로 쓰지 않는다.
- 확인하지 못한 구현을 완료로 기록하지 않는다.
- git add/commit/push, deploy, remote D1, production smoke는 명시 지시 없이는 하지 않는다.
