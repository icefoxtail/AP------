# AP_HERMES_SOURCE_RECHECK

Date: 2026-05-26
Root: C:\Users\USER\Desktop\AP------
Mode: report-only source recheck. No runtime, code, docs, archive/textbook, git, deploy, or dependency changes were made.

## 1. Check Scope

Hermes source checked:
- https://github.com/NousResearch/hermes-agent
- README.md
- AGENTS.md
- repository root listing for `skills/`, `optional-skills/`, `plans/`, `.plans/`, `tools/`, `plugins/`, `mcp_serve.py`, `trajectory_compressor.py`, `mini_swe_runner.py`, `gateway/`, `cron/`, and related runtime files.

AP reports and documents checked:
- docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md
- docs/README.md
- docs/WANGJI_OS_STRUCTURE.md
- docs/WANGJI_OS_ROADMAP.md
- reports/AP_HERMES_FULL_MIGRATION_ASSESSMENT_20260526.md
- reports/AP_HERMES_DOMAIN_MAP_20260526.json
- reports/AP_HERMES_NEXT_TASK_DRAFT_20260526.md

archive/textbook subordinate operating layer checked:
- archive/textbook/.agent/BOOT.md
- archive/textbook/.agent/SKILLS_INDEX.md
- archive/textbook/reports/agent-memory/verified-decisions.md

Access failures:
- None for required AP local files.
- None for the Hermes public GitHub pages/raw files checked.

## 2. Hermes Source Core Structure

| Hermes component | Source location checked | Role | Safe AP import pattern | Do not import into AP |
|---|---|---|---|---|
| AGENTS.md | repository root | Development guide, structure map, coding instructions, plugin/tool conventions | Create AP-specific root BOOT and rule index based on AP rulebook | Do not copy Hermes AGENTS.md as AP policy |
| skills | repository root `skills/` | Built-in reusable task procedures | Create AP domain SOP documents under docs/agent-skills | Do not install or vendor Hermes skills |
| optional-skills | repository root `optional-skills/` | Heavier/niche procedures not active by default | Keep AP P1/P2 SOPs optional by domain | Do not auto-enable all skills |
| plans / .plans | repository root | Human/agent planning queues and working plans | Create AP_DOMAIN_STATUS_BOARD and AP_NEXT_ACTIONS | Do not create executable automation plans |
| tools | repository root `tools/` | Runtime tool implementations and registry patterns | Borrow only the concept of deliberate tool boundaries | Do not copy tools or register runtime tools |
| plugins | repository root `plugins/` | Extension surface for tools/hooks/providers | Use the concept of pluggable domain SOPs | Do not add Hermes plugins to AP |
| mcp_serve.py | repository root | MCP bridge for conversations, messages, events, approvals | Exclude from AP root layer; note as runtime risk | Do not create MCP server |
| trajectory_compressor.py | repository root | Compresses long agent trajectories while preserving protected turns | Use conceptually as `compressed-history` memory | Do not run compressor or add dependencies |
| mini_swe_runner.py | repository root | Runs tasks in local/Docker/Modal environments and emits trajectories | Exclude from AP first migration | Do not add runner, Docker, Modal, or batch execution |
| memory / learning loop | README and source structure | Skills from experience, nudges, search over past sessions, user modeling | Convert to static AP memory docs: repeated-errors, verified-decisions, compressed-history | Do not add autonomous learning runtime |
| subagent / parallel workstream | README and repository structure | Delegates and parallelizes isolated workstreams | Create parallel-workstream SOP and locks | Do not spawn autonomous subagents without task permission |
| gateway / external interfaces | README, gateway tree, mcp_serve.py | CLI and messaging bridge surfaces such as Telegram/Discord/Slack | Exclude from AP root docs except as explicit non-goal | Do not create Telegram/Discord/Slack/WhatsApp gateway |
| cron | repository root `cron/` and README scheduled automation description | Scheduled unattended jobs | Exclude from first AP root layer | Do not create daemon/cron automation |

## 3. What AP Root Should Adopt

Adopt as document-only operating concepts:

- BOOT: a root entry instruction that starts from AP rulebook read order and current task scope.
- SKILLS_INDEX: a map from AP domains to local SOPs.
- DOMAIN_LOCK_POLICY: explicit high-risk path locks for apmath/js, Worker/D1, archive, archive/textbook, docs, generated outputs, git, deploy, and API smoke.
- DOMAIN_STATUS_BOARD: a human-readable domain status board, not an execution engine.
- WORKSTREAM_TEMPLATE: a template for splitting AP work by domain without overlap.
- RESULT_TEMPLATE: a standard completion report that respects task-specific instructions such as separate report files.
- agent-memory: static memory documents for verified decisions, repeated errors, compressed history, risk register, and workstream locks.
- repeated-errors: AP-specific forbidden patterns such as broad UI exposure, root CODEX_RESULT overwrite when forbidden, generated textbook edits, deployment, and git actions.
- verified-decisions: stable AP decisions from rulebook and previous reports.
- compressed-history: concise handoff history, not generated by a runtime compressor.
- parallel-workstream: a coordination SOP with file locks and domain ownership.
- trajectory compression concept: use only as a metaphor for summarizing long AP history into `ap-compressed-history.md`.
- self-improvement suggestion loop: include as a manual review queue, not autonomous file rewriting.

## 4. What AP Root Should Exclude

Exclude from the AP root operating layer:

- Hermes runtime installation.
- Hermes source-code copy or vendoring.
- MCP server creation.
- daemon or cron creation.
- Telegram, Discord, Slack, WhatsApp, Signal, Matrix, or other gateway setup.
- automatic git add, commit, push, branch, or PR creation.
- automatic deploy or wrangler deploy.
- automatic production API smoke tests.
- automatic UI exposure of hidden foundation features.
- automatic schema migration or D1 execution.
- automatic problem, answer, solution, or prompt generation.
- runner-style Docker/Modal/local task execution.
- dependency additions to package.json, package-lock.json, Python env, or Node env.

## 5. Relationship To archive/textbook Subordinate Layer

archive/textbook already has a subordinate operating layer:

- `archive/textbook/.agent/BOOT.md` states the upper AP project rulebook remains higher priority and generated paths are protected by default.
- `archive/textbook/.agent/SKILLS_INDEX.md` maps textbook-specific tasks to textbook SOPs.
- `archive/textbook/reports/agent-memory/verified-decisions.md` records stable decisions such as no Hermes install, no Hermes dependency, no external code copy, generated JS protection, no answer guessing, and no git actions by default.

Therefore:

- AP root `.agent` should be an upper dispatcher and domain lock layer.
- AP root should not overwrite textbook BOOT, textbook skill index, textbook plans, or textbook memory.
- AP root should not directly control textbook queues.
- Textbook tasks must follow textbook BOOT and textbook SOPs first after the upper AP rulebook.
- AP root may include only a `textbook-pipeline-sop` that says when and how to delegate.

## 6. Revisions Needed For AP Root Creation Instruction

The existing `reports/AP_HERMES_NEXT_TASK_DRAFT_20260526.md` is directionally correct, but the next task should be tightened with these requirements:

- State that Hermes source was rechecked from GitHub before writing this revised task.
- State that AP root creates a document operating layer only, not Hermes runtime.
- Protect archive/textbook subordinate operating layer explicitly.
- Keep docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md as the highest local AP policy.
- Keep git, deploy, remote D1, and production smoke forbidden.
- Include UI exposure approval policy in BOOT and DOMAIN_LOCK_POLICY.
- Define domain locks for P0/P1 domains before SOP content is written.
- Require separate `reports/AP_HERMES_ROOT_LAYER_CODEX_RESULT_YYYYMMDD.md`; do not overwrite root CODEX_RESULT.md.

## 7. Final Recommendation

Proceed after revisions.

Reason:
- The AP source assessment, domain map, and Hermes source recheck agree on a safe first migration: document-only AP root operating layer.
- The dangerous Hermes parts are runtime/dependency/automation/gateway/MCP/runner features, and these can be explicitly excluded.
- archive/textbook already has a protected subordinate layer, so the AP root layer must coordinate rather than replace it.

The next round can create actual AP root operating documents if it follows the revised task in `reports/AP_HERMES_ROOT_LAYER_NEXT_TASK_REVISED_20260526.md`.
