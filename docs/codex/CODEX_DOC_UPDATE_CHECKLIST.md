# CODEX_DOC_UPDATE_CHECKLIST

## Three Master Document Check

- Does this task affect `docs/MASTER_RULEBOOK.md`?
- Does this task affect `docs/MASTER_CURRENT_PROGRESS.md`?
- Does this task affect `docs/MASTER_NEXT_WORK.md`?
- Does this task affect `docs/README.md`, `docs/00_READ_ME_FIRST.md`, or `docs/_index/*`?
- If affected, were the relevant master docs updated?
- If not affected, was the no-update reason recorded in `CODEX_RESULT.md`?
- Do the relevant domain / implemented / plan docs still agree with the master docs?
- Were actual source files checked before any implementation was marked complete?
- Were unchecked files marked as `Needs verification`?

## Docs Structure Check

- Are only entry/policy/master/index documents left at `docs/` root?
- Are domain docs under `docs/domains/`?
- Are current implementation maps under `docs/implemented/`?
- Are future plans under `docs/plans/`?
- Are Codex rules under `docs/codex/`?
- Are SOPs under `docs/agent-skills/`?
- Are guides/references under `docs/guides/`?
- Are reports under `docs/reports/`?
- Are completed or historical documents under `docs/archive/*`?
- Were moved files recorded in `docs/_index/ARCHIVE_INDEX.md`?

## 변경 유형별 업데이트

- DB 변경: `CURRENT_DB_MAP.md`, 관련 domain, 관련 plan
- route/API 변경: `CURRENT_WORKER_ROUTE_MAP.md`, `CURRENT_API_FLOW_MAP.md`, 관련 domain
- frontend 변경: `CURRENT_FRONTEND_MAP.md`, `CURRENT_UI_EXPOSURE_MAP.md`, 관련 domain
- hidden foundation 노출: `CURRENT_HIDDEN_FOUNDATION_MAP.md`, 사용자 승인 근거
- 권한 변경: `CURRENT_AUTH_PERMISSION_MAP.md`, `STAFF_PERMISSION_AUDIT_DOMAIN.md`
- 회귀 위험 발견: `CURRENT_REGRESSION_RISK_MAP.md`
- 계획 변경: 관련 `plans/*.md`
- 모든 작업: `CODEX_RESULT.md`

