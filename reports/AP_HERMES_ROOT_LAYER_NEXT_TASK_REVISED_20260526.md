# AP_HERMES_ROOT_LAYER_NEXT_TASK_REVISED

Date: 2026-05-26
Root: C:\Users\USER\Desktop\AP------
Purpose: paste-ready Codex instruction for creating the AP root Hermes-style operating document layer.

## Goal

Create the AP root document operating layer only:

- AP------/.agent
- AP------/docs/agent-skills
- AP------/plans
- AP------/reports/agent-memory

This is not a Hermes runtime installation task. It is a repository-local document/SOP/memory layer based on:

- docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md
- docs/00_READ_ME_FIRST.md
- docs/03_DOMAIN_INDEX.md
- reports/AP_HERMES_FULL_MIGRATION_ASSESSMENT_20260526.md
- reports/AP_HERMES_DOMAIN_MAP_20260526.json
- reports/AP_HERMES_SOURCE_RECHECK_20260526.md
- archive/textbook/.agent/BOOT.md
- archive/textbook/.agent/SKILLS_INDEX.md
- archive/textbook/reports/agent-memory/verified-decisions.md

## Hermes Source Boundary

Hermes Agent source was rechecked from:

- https://github.com/NousResearch/hermes-agent

Use only structural ideas:

- AGENTS/BOOT-style entry instructions
- skills and optional skills as SOP concepts
- plans and .plans as planning concepts
- static memory concepts such as verified decisions, repeated errors, and compressed history
- parallel workstream coordination concepts
- trajectory compression as a summarization concept

Do not use runtime features:

- Hermes install
- Hermes execution
- Hermes source copy
- tools/plugins copying
- mcp_serve.py
- daemon/cron
- gateway integrations
- mini_swe_runner / Docker / Modal runners
- dependencies

## Strict Prohibitions

- Do not run git add.
- Do not run git commit.
- Do not run git push.
- Do not deploy.
- Do not run wrangler deploy.
- Do not run remote D1 commands.
- Do not run production API smoke tests.
- Do not modify application code.
- Do not modify schema or migrations.
- Do not modify archive/exams data.
- Do not modify apmath/js behavior.
- Do not modify worker-backup route behavior.
- Do not modify archive/textbook generated outputs.
- Do not install Hermes Agent.
- Do not copy Hermes Agent source code.
- Do not add dependencies.
- Do not modify package.json or package-lock.json.
- Do not create daemon, cron, MCP server, gateway, or runtime automation.
- Do not modify archive/textbook/.agent.
- Do not modify archive/textbook/docs/agent-skills.
- Do not modify archive/textbook/plans.
- Do not modify archive/textbook/reports/agent-memory.
- Do not modify existing docs rulebook files.
- Do not overwrite root CODEX_RESULT.md.

## Required Read Order

Read first:

1. docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md
2. docs/00_READ_ME_FIRST.md
3. docs/03_DOMAIN_INDEX.md
4. reports/AP_HERMES_FULL_MIGRATION_ASSESSMENT_20260526.md
5. reports/AP_HERMES_DOMAIN_MAP_20260526.json
6. reports/AP_HERMES_SOURCE_RECHECK_20260526.md
7. archive/textbook/.agent/BOOT.md
8. archive/textbook/.agent/SKILLS_INDEX.md
9. archive/textbook/reports/agent-memory/verified-decisions.md

If any file is missing, record it in the result report and continue without guessing its content.

## Allowed Creation Scope

Create these files only:

```text
.agent/BOOT.md
.agent/SKILLS_INDEX.md
.agent/AP_PIPELINE_STATE.md
.agent/DOMAIN_LOCK_POLICY.md
.agent/RESULT_TEMPLATE.md
.agent/WORKSTREAM_TEMPLATE.md

docs/agent-skills/ap-project-governance-sop.md
docs/agent-skills/ap-docs-maintenance-sop.md
docs/agent-skills/apmath-static-app-sop.md
docs/agent-skills/apmath-worker-backend-sop.md
docs/agent-skills/archive-core-sop.md
docs/agent-skills/archive-exams-sop.md
docs/agent-skills/textbook-pipeline-sop.md
docs/agent-skills/omr-qr-clinic-report-sop.md
docs/agent-skills/student-parent-planner-sop.md
docs/agent-skills/timetable-attendance-classroom-sop.md
docs/agent-skills/billing-accounting-operations-sop.md
docs/agent-skills/public-site-brand-sop.md
docs/agent-skills/validation-and-review-pack-sop.md
docs/agent-skills/parallel-workstream-sop.md

plans/AP_DOMAIN_STATUS_BOARD.md
plans/AP_NEXT_ACTIONS.md
plans/AP_PARALLEL_WORK_ASSIGNMENTS.md

reports/agent-memory/ap-compressed-history.md
reports/agent-memory/ap-repeated-errors.md
reports/agent-memory/ap-verified-decisions.md
reports/agent-memory/ap-domain-risk-register.json
reports/agent-memory/ap-workstream-locks.json

reports/AP_HERMES_ROOT_LAYER_CODEX_RESULT_YYYYMMDD.md
```

## Required Content

`.agent/BOOT.md` must include:
- AP rulebook read order.
- Current task reading.
- Dirty worktree recording.
- Explicit allowed/forbidden file declaration before editing.
- No git/deploy/remote D1/production smoke by default.
- UI exposure approval policy.
- archive/textbook subordinate layer protection.

`.agent/SKILLS_INDEX.md` must map:
- Root / project governance -> ap-project-governance-sop
- docs / rulebook / plans -> ap-docs-maintenance-sop
- apmath static app -> apmath-static-app-sop
- worker / backend / D1 -> apmath-worker-backend-sop
- archive core -> archive-core-sop
- archive/exams -> archive-exams-sop
- archive/textbook -> textbook-pipeline-sop
- OMR / QR / clinic / report -> omr-qr-clinic-report-sop
- student / parent / planner portal -> student-parent-planner-sop
- timetable / attendance / classroom -> timetable-attendance-classroom-sop
- billing / accounting / operations -> billing-accounting-operations-sop
- public site / Wangji / brand -> public-site-brand-sop
- validation/review pack -> validation-and-review-pack-sop
- parallel workstreams -> parallel-workstream-sop

`.agent/DOMAIN_LOCK_POLICY.md` must include locks for:
- apmath/js broad edits
- apmath/worker-backup schema/migrations/routes
- archive/exams data
- archive core engines
- archive/textbook generated outputs
- archive/textbook subordinate .agent/docs/plans/memory
- docs rulebook files
- billing/accounting
- timetable
- student portal/OMR
- public/brand terminology
- git/deploy/remote D1/API smoke

`docs/agent-skills/textbook-pipeline-sop.md` must say:
- archive/textbook has its own subordinate operating layer.
- Root AP layer only routes/delegates.
- Textbook BOOT and textbook skills take priority for textbook tasks after the upper AP rulebook.
- Root AP layer must not overwrite textbook generated outputs or textbook operating files.

`reports/agent-memory/ap-domain-risk-register.json` and `reports/agent-memory/ap-workstream-locks.json` must be valid JSON.

## Verification

Run from C:\Users\USER\Desktop\AP------:

```powershell
Get-Content reports\agent-memory\ap-domain-risk-register.json -Raw | ConvertFrom-Json | Out-Null
Get-Content reports\agent-memory\ap-workstream-locks.json -Raw | ConvertFrom-Json | Out-Null
Test-Path .agent\BOOT.md
Test-Path .agent\SKILLS_INDEX.md
Test-Path .agent\DOMAIN_LOCK_POLICY.md
Test-Path docs\agent-skills\ap-project-governance-sop.md
Test-Path docs\agent-skills\textbook-pipeline-sop.md
Test-Path plans\AP_DOMAIN_STATUS_BOARD.md
Test-Path reports\agent-memory\ap-verified-decisions.md
Test-Path reports\AP_HERMES_ROOT_LAYER_CODEX_RESULT_*.md
git status --short --untracked-files=all
git diff --name-only
```

Verification criteria:
- Only the allowed root operating-layer files and root-layer result report are created.
- No app code is modified.
- No existing docs rulebook file is modified.
- No archive/textbook operating-layer file is modified.
- No archive/textbook generated file is modified.
- Root CODEX_RESULT.md is not modified.
- No git add/commit/push was run.
- No deploy, remote D1, production smoke, runtime install, dependency install, daemon, cron, MCP, or gateway was created.

## Completion Report

Write:

```text
reports/AP_HERMES_ROOT_LAYER_CODEX_RESULT_YYYYMMDD.md
```

Include:

- Created files.
- Read source files.
- Hermes source boundary summary.
- archive/textbook protection confirmation.
- Verification command results.
- Explicit list of prohibited actions not performed.
