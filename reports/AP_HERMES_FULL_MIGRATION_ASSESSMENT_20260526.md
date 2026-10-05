# AP_HERMES_FULL_MIGRATION_ASSESSMENT

Date: 2026-05-26
Root: C:\Users\USER\Desktop\AP------
Mode: report-only investigation. No code, schema, migration, generated textbook output, deployment, git add, commit, or push was performed.

## 1. Investigation Scope

Inventory files created:
- reports/ap_hermes_full_inventory_20260526.txt
- reports/ap_hermes_top_level_tree_20260526.txt
- reports/ap_hermes_domain_file_map_20260526.json

Required documents checked:
- docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md
- docs/README.md
- docs/00_READ_ME_FIRST.md
- docs/WANGJI_OS_STRUCTURE.md
- docs/WANGJI_OS_ROADMAP.md
- docs/03_DOMAIN_INDEX.md
- docs/domains/WANGJI_COMMON_DOMAIN.md
- docs/reference/PROJECT_STRUCTURE.md
- CODEX_TASK.md

Representative code and structure checked:
- apmath/index.html
- apmath/js/core.js, ui.js, dashboard.js, classroom.js, student.js, timetable.js, report.js, qr-omr.js, clinic-print.js, management.js
- apmath/student/index.html
- apmath/planner/index.html
- apmath/homework/index.html
- apmath/worker-backup/worker/index.js
- apmath/worker-backup/worker/routes/*.js
- apmath/worker-backup/worker/schema.sql and migrations
- archive/index.html, mixer.html, mixed_engine.html, wrong_print_engine.html, db.js, build_db.py
- archive/exams and archive/assets/images by inventory only
- archive/textbook by high-level placement only; generated assets were not expanded
- report-ai-proxy README, package files, and api/report-analysis.js

Excluded from deep read:
- Large images, PDFs, zip-like assets, and generated review packs
- archive/textbook generated/assets and generated/review_pack contents
- Git internals except status/diff checks

## 2. AP------ Structure Summary

AP------ is not a single small app. It is a combined AP Math OS / APMS operating repository with these major surfaces:

- Root governance: current task/result files, top-level static entry, package lock, ignore rules, and temporary review images.
- docs: rulebook, architecture, domain index, roadmap, plan documents, archived results, design notes, timetable notes, initial-data analysis, and reference maps.
- apmath: the main AP Math OS static application. It uses vanilla JS modules under apmath/js, static CSS, student/planner/homework subpages, and service worker/manifest assets.
- apmath/worker-backup: Cloudflare Worker and D1 reference/backup tree. It contains index.js, routes, helpers, schema files, seed data, migrations, wrangler config, and archived schema snapshots.
- archive: exam archive, engine, mixer, mixed engine, wrong-print engine, db scripts, exam JS data, and image assets.
- archive/textbook: a separate textbook pipeline domain that already has Hermes-like operational layering and should remain a subordinate domain, not a root-level controller.
- check/manual/planner/alive/rules: supporting submission, manual, planner, prompt, and rule assets.
- report-ai-proxy: external Node proxy for AP Math OS report analysis payloads.

## 3. Current Highest Rulebook / Collision Avoidance Basis

The top-level rulebook and read-first documents establish these stable constraints:

- Preserve existing AP Math OS behavior and wording unless the task explicitly asks to change it.
- Do not expose hidden foundation functions in UI without explicit approval.
- Keep AP Math as an operating module under the broader Wangji/academy OS direction, rather than replacing it.
- Treat student portal and OMR flows as high-risk. Student-facing direct exam access and completed OMR edit/re-submit paths are forbidden unless a task explicitly changes policy.
- Treat billing/accounting as high-risk because amount integrity and auditability matter.
- Treat timetable as high-risk because operating, draft, staging, and active schedules can be confused.
- Avoid deploy, remote D1, production API smoke, git add/commit/push unless the task explicitly permits it.
- For future Hermes migration, separate report-only design from actual creation of .agent, docs/agent-skills, plans, and memory files.

## 4. Domain-Level Hermes Migration Possibility

| Domain | Current files | Current role | Risks | Proposed skill | Proposed memory | Proposed plan queue | Priority | Notes |
|---|---|---|---|---|---|---|---|---|
| Root / project governance | CODEX_TASK.md, CODEX_RESULT.md, docs/codex, package-lock.json, .gitignore | Task scope, execution rules, result conventions | Accidental broad edits, dirty worktree, git actions | ap-project-governance-sop | repeated forbidden actions, dirty-state policy | status board, task intake checklist | P0 | Root BOOT should route all work through rulebook and domain map. |
| docs / rulebook / plans | docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md, docs/00_READ_ME_FIRST.md, docs/03_DOMAIN_INDEX.md, docs/plans | Source of policy and domain ownership | Stale docs, conflicting plans, unapproved UI exposure | ap-docs-maintenance-sop | canonical read order, doc update obligations | docs audit and domain sync plan | P0 | Must be root memory, not optional. |
| apmath static app | apmath/index.html, apmath/js, apmath/css, apmath/student, apmath/planner | Main AP Math OS UI and workflows | UI wording drift, large JS files, hidden foundation exposure | apmath-static-app-sop | protected UI phrases and module boundaries | frontend review checklist | P0 | Needs strict no-redesign/default-exposure policy. |
| worker / backend / D1 | apmath/worker-backup/worker/index.js, routes, helpers, schema.sql, migrations | Worker API, D1 schema, route logic, permissions | Schema drift, scope leaks, remote D1/deploy mistakes | apmath-worker-backend-sop | route ownership, permission helpers, migration guard | route/schema verification queue | P0 | Never run remote D1 or deploy by default. |
| archive core | archive/index.html, mixer.html, mixed_engine.html, wrong_print_engine.html, db.js | Exam archive, paper/QR generation, mixed exam engine | QR/OMR regression, engine divergence | archive-core-sop | engine variants and QR policy | archive smoke checklist | P1 | Separate from archive/exams data edits. |
| archive/exams | archive/exams, archive/assets/images | Exam source data and image assets | Large data churn, broken image paths, accidental generated pack edits | archive-exams-sop | allowed data fields, image path rules | exam-data validation plan | P1 | Inventory only in this task. |
| archive/textbook | archive/textbook | Existing textbook pipeline with its own Hermes-like layer | Root agent over-controlling subdomain, generated output churn | textbook-pipeline-sop | textbook BOOT boundary and generated asset exclusions | textbook sub-agent handoff plan | P1 | Root .agent should delegate, not rewrite textbook internals. |
| OMR / QR / clinic / report | check, qr-omr.js, clinic-print.js, report.js, reports-ai, report-ai-proxy | Submission, wrong answer, clinic print, reports, AI proxy | Student resubmit, public wording, parent-facing AI quality | omr-qr-clinic-report-sop | OMR no-edit rule, parent wording rules | report/OMR regression plan | P0 | High-risk because student and parent surfaces meet backend data. |
| student / parent / planner portal | apmath/student, apmath/planner, planner, parent-foundation, student-portal, planner route | Student/parent entry points, planner, PIN login, guardian foundation | Privacy, direct exam access, localStorage/SSO confusion | student-parent-planner-sop | PIN/portal constraints, parent data exposure rules | portal verification plan | P0 | Needs explicit public/private boundary memory. |
| timetable / attendance / classroom | timetable.js, classroom.js, timetable routes, attendance-homework, class-daily | Schedule, classroom, attendance, homework, daily journal | Staging/active confusion, teacher field workflow regression | timetable-attendance-classroom-sop | timetable state meanings, classroom protected flows | schedule/classroom guard plan | P0 | Timetable and classroom can be split into skills later. |
| billing / accounting / operations | billing-accounting routes, billing-foundation, operations.js, management.js, dashboard.js | Billing/accounting foundation, cashbook, consultations, operations | Amount integrity, internal memo leakage, audit trail loss | billing-accounting-operations-sop | money data no-delete policy, internal memo exposure rules | billing/operations staged plan | P0 | Billing may deserve its own P0 skill if activated. |
| public site / Wangji / brand | index.html, manual, alive, rules, homepage/cmath/eie plans | Public/brand assets, prompts, docs, future academy branches | Brand term drift, AP Math vs Wangji/CMath/EIE confusion | public-site-brand-sop | branch vocabulary, brand naming rules | brand/domain separation plan | P2 | Include after root operating layer is stable. |

## 5. Recommended AP Root Operating Layer Structure

The following is recommended only. It was not created in this task.

`	ext
.agent/
  BOOT.md
  SKILLS_INDEX.md
  AP_PIPELINE_STATE.md
  DOMAIN_LOCK_POLICY.md
  RESULT_TEMPLATE.md
  WORKSTREAM_TEMPLATE.md

docs/agent-skills/
  ap-project-governance-sop.md
  ap-docs-maintenance-sop.md
  apmath-static-app-sop.md
  apmath-worker-backend-sop.md
  archive-core-sop.md
  archive-exams-sop.md
  textbook-pipeline-sop.md
  omr-qr-clinic-report-sop.md
  student-parent-planner-sop.md
  timetable-attendance-classroom-sop.md
  billing-accounting-operations-sop.md
  public-site-brand-sop.md
  validation-and-review-pack-sop.md
  parallel-workstream-sop.md

plans/
  AP_DOMAIN_STATUS_BOARD.md
  AP_NEXT_ACTIONS.md
  AP_PARALLEL_WORK_ASSIGNMENTS.md

reports/agent-memory/
  ap-compressed-history.md
  ap-repeated-errors.md
  ap-verified-decisions.md
  ap-domain-risk-register.json
  ap-workstream-locks.json
`

## 6. Relationship To archive/textbook Operating Layer

archive/textbook should remain a subordinate domain. The root operating layer should know that archive/textbook has its own pipeline and generated-output exclusions, but should not directly overwrite textbook BOOT, generated JS, generated assets, review packs, or answer-fill reports unless a textbook-specific task explicitly asks for it.

Recommended model:

- Root AP .agent: owns repository-wide rules, domain routing, workstream locks, and cross-domain risk memory.
- archive/textbook .agent: owns textbook pipeline, answer/source validation, generated pack rules, and textbook-specific recovery memory.
- Root tasks that touch textbook should first delegate to or explicitly follow textbook BOOT.

## 7. Safe To Migrate Later

After review, these report-only structures are safe candidates for a future creation task:

- .agent document layer
- docs/agent-skills SOP layer
- plans status/action layer
- reports/agent-memory compressed memory layer

## 8. Still Unsafe To Migrate Automatically

Do not include these in the first migration:

- Hermes runtime installation
- MCP server or daemon creation
- cron automation
- automatic git actions
- automatic deploy or remote D1 actions
- automatic production API smoke tests
- automatic UI exposure
- automatic schema migration

## 9. Recommended Sequence

1. Review this assessment and domain map.
2. Decide whether AP root should get a report-only draft layer or actual .agent/docs/agent-skills/plans/reports files.
3. If actual creation is approved, create only root operating documents, not runtime or automation.
4. Add AP_DOMAIN_STATUS_BOARD and AP_NEXT_ACTIONS from the domain map.
5. Use the new BOOT instructions for future Codex work.

## 10. Next-Round Instruction Draft

See reports/AP_HERMES_NEXT_TASK_DRAFT_20260526.md.
