# AP_HERMES_NEXT_TASK_DRAFT

Date: 2026-05-26
Root: C:\Users\USER\Desktop\AP------
Purpose: next-round instruction for creating the AP root Hermes operating layer from the completed report-only assessment.

## Goal

Create AP root Hermes operating-layer documents only, based on:

- reports/AP_HERMES_FULL_MIGRATION_ASSESSMENT_20260526.md
- reports/AP_HERMES_DOMAIN_MAP_20260526.json
- reports/ap_hermes_domain_file_map_20260526.json
- docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md
- docs/00_READ_ME_FIRST.md
- docs/03_DOMAIN_INDEX.md

## Strict Prohibitions

- Do not run git add, git commit, or git push.
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
- Do not create daemon, cron, MCP server, or runtime automation.
- Do not overwrite archive/textbook sub-agent files.

## Allowed Creation Scope

Create only AP root operating documents:

`	ext
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
`

If the next task should remain report-only, create the same content under reports/AP_HERMES_ROOT_LAYER_DRAFT_20260526/ instead of real paths.

## Required Content Rules

- BOOT.md must start from the existing AP rulebook read order.
- SKILLS_INDEX.md must map every P0/P1 domain in AP_HERMES_DOMAIN_MAP_20260526.json to one SOP.
- DOMAIN_LOCK_POLICY.md must explicitly block broad edits to apmath/js, worker schema/migrations, archive/textbook generated files, and production/deploy actions.
- textbook-pipeline-sop.md must say archive/textbook is subordinate and follows its own BOOT when present.
- RESULT_TEMPLATE.md must keep CODEX_RESULT conventions but respect tasks that require separate report files.
- agent-memory JSON files must be valid JSON.
- Plans must be status/planning documents only, not implementation of product features.

## Verification Commands

Run from C:\Users\USER\Desktop\AP------:

`powershell
Get-Content reports\AP_HERMES_DOMAIN_MAP_*.json -Raw | ConvertFrom-Json | Out-Null
Get-Content reports\agent-memory\ap-domain-risk-register.json -Raw | ConvertFrom-Json | Out-Null
Get-Content reports\agent-memory\ap-workstream-locks.json -Raw | ConvertFrom-Json | Out-Null
Test-Path .agent\BOOT.md
Test-Path docs\agent-skills\ap-project-governance-sop.md
Test-Path plans\AP_DOMAIN_STATUS_BOARD.md
git status --short --untracked-files=all
git diff --name-only
`

## Completion Report

Write a new report file rather than overwriting root CODEX_RESULT.md if the task asks for report-only output. Include:

- created files
- source assessment files used
- verification results
- explicit confirmation that no code/schema/migration/generated textbook output/deploy/git action was performed
