# AP Domain Lock Policy

Locks are default protections. A current user task must explicitly unlock a path or behavior before work touches it.

## Repository-Wide Locks

- No git add, commit, push, deploy, remote D1, or production smoke by default.
- No package or dependency changes by default.
- No runtime automation: daemon, cron, MCP server, gateway, runner, or Hermes install.
- No root `CODEX_RESULT.md` overwrite when a task asks for separate report output.

## Domain Locks

| Domain | Locked paths / behavior | Unlock requirement |
|---|---|---|
| apmath static app | `apmath/js`, `apmath/index.html`, UI text, menus, modes | Explicit task scope and regression check |
| worker / backend / D1 | `apmath/worker-backup/worker/schema.sql`, migrations, routes, wrangler config | Explicit backend/schema task |
| archive core | `archive/index.html`, `archive/mixer.html`, `archive/mixed_engine.html`, `archive/wrong_print_engine.html`, `archive/db.js`, engines, QR output | Explicit archive engine task |
| archive/exams | `archive/exams`, `archive/assets/images` | Explicit exam data task and validation |
| archive/textbook | generated JS/assets/review packs and subordinate operating files | Textbook-specific task following textbook BOOT |
| docs rulebook | `docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md`, policy/read-first/domain docs | Explicit docs update task |
| billing/accounting | billing routes, cashbook/payment data, money history | Explicit finance task and no-delete policy |
| timetable | timetable versions, staging, active schedules, conflicts | Explicit timetable task |
| student portal / OMR | student direct access, completed OMR edit/re-submit, QR submit flow | Explicit portal/OMR task and policy review |
| public / brand | AP Math, Wangji, CMath, EIE terms and public wording | Explicit brand/public-site task |

## UI Exposure Rule

Backend or foundation functionality must not be exposed in UI simply because it exists. User approval is required before creating cards, buttons, menu entries, dashboard summaries, or default-visible controls for hidden foundation features.
