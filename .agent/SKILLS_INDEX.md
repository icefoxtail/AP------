# AP Root Skills Index

Use only the SOPs that match the current task. A skill never widens scope or grants permission beyond the task.

| Domain | SOP |
|---|---|
| Root / project governance | `docs/agent-skills/ap-project-governance-sop.md` |
| docs / rulebook / plans | `docs/agent-skills/ap-docs-maintenance-sop.md` |
| apmath static app | `docs/agent-skills/apmath-static-app-sop.md` |
| worker / backend / D1 | `docs/agent-skills/apmath-worker-backend-sop.md` |
| archive core | `docs/agent-skills/archive-core-sop.md` |
| archive/exams | `docs/agent-skills/archive-exams-sop.md` |
| archive/textbook | `docs/agent-skills/textbook-pipeline-sop.md` |
| OMR / QR / clinic / report | `docs/agent-skills/omr-qr-clinic-report-sop.md` |
| student / parent / planner portal | `docs/agent-skills/student-parent-planner-sop.md` |
| timetable / attendance / classroom | `docs/agent-skills/timetable-attendance-classroom-sop.md` |
| billing / accounting / operations | `docs/agent-skills/billing-accounting-operations-sop.md` |
| public site / Wangji / brand | `docs/agent-skills/public-site-brand-sop.md` |
| validation and review packs | `docs/agent-skills/validation-and-review-pack-sop.md` (review pack zip output must go to Downloads) |
| parallel workstreams | `docs/agent-skills/parallel-workstream-sop.md` |

## Git-managed project skills

Project-specific Codex skills are canonical repository files and must be
reviewed and changed in the active Git branch. The inventory is maintained in
tools/skills/manifest.json; verify the current worktree before starting a
skill-dependent task:

    git fetch origin main
    node tools/skills/verify-skills.mjs

Do not treat a host-global skill installation as the source of truth for this
repository. Keep each skill's SKILL.md, references, scripts, and UI metadata
together in its declared canonical directory.

## Rules

- Read `.agent/BOOT.md` first.
- Read `.agent/DOMAIN_LOCK_POLICY.md` before editing.
- For documentation work or completion-time documentation reflection, follow `docs/agent-skills/ap-docs-maintenance-sop.md`.
- Three master documents are the first fixed checkpoint for docs / rulebook / plans:
  - `docs/MASTER_RULEBOOK.md`
  - `docs/MASTER_CURRENT_PROGRESS.md`
  - `docs/MASTER_NEXT_WORK.md`
- For textbook tasks, follow `archive/textbook/.agent/BOOT.md` after the AP rulebook.
- If a task is report-only, every SOP is report-only.
