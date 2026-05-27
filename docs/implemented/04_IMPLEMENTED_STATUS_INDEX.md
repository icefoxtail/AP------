# 04_IMPLEMENTED_STATUS_INDEX

현재 구현 상태 문서는 실제 확인한 파일을 기준으로 작성한다. 라인 단위 완전 검수는 다음 라운드에서 보강한다.

| 문서 | 목적 |
|---|---|
| `implemented/00_IMPLEMENTED_READ_ORDER.md` | 구현 상태 문서 읽기 순서 |
| `implemented/CURRENT_DB_MAP.md` | schema.sql과 migrations 기준 DB map |
| `implemented/CURRENT_WORKER_ROUTE_MAP.md` | Worker index와 routes 위임 구조 |
| `implemented/CURRENT_FRONTEND_MAP.md` | frontend 화면/파일/API 연결 |
| `implemented/CURRENT_API_FLOW_MAP.md` | 주요 기능별 화면 -> API -> route -> DB 흐름 |
| `implemented/CURRENT_UI_EXPOSURE_MAP.md` | 현재 UI 노출 기능과 위치 |
| `implemented/CURRENT_HIDDEN_FOUNDATION_MAP.md` | foundation만 있거나 승인 전 숨김 기능 |
| `implemented/CURRENT_REGRESSION_RISK_MAP.md` | 고위험 회귀 흐름 |
| `implemented/CURRENT_AUTH_PERMISSION_MAP.md` | 인증/권한/scope 구조 |
| `implemented/CURRENT_DEPLOY_SMOKE_MAP.md` | 배포/검증 기준 |

## 이번 1차 확인 범위

- 읽음: `apmath/worker-backup/worker/schema.sql`
- 읽음: `apmath/worker-backup/worker/index.js`
- 읽음: `apmath/worker-backup/worker/routes` 목록과 export/handler 구조 검색
- 읽음: `apmath/js/core.js`, 주요 frontend API 호출 검색
- 읽음: `apmath/student/index.html`, `apmath/planner/index.html`, `check/check.js`
- 읽음: `apmath/worker-backup/worker/wrangler.jsonc`, `report-ai-proxy/package.json`

