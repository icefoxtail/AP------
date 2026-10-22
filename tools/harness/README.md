# APMS / Archive Task Entry Harness v1

Optional local entry gate for shared-infrastructure experiments. It reuses exact existing Git authorities; it is **not** a new mandatory preflight for ordinary exams, reserved GPT workers, or FINAL QA. It does not change schedules, database records, runtime pipelines, or quality criteria.

Usage:

    node tools/harness/task-entry.mjs --task shared-harness --json
    node tools/harness/task-entry.mjs --task archive-final-qa --target archive/exams/original/.../exact.js --json
    node tools/harness/task-entry.mjs --task gpt-reservation-r1 --caps libraryRead=UNKNOWN --json
    node --test tools/harness/task-entry.test.mjs

Routes are exact enums in routes.v1.json (not a filename-search AI classifier). Local file targets require the exact repository-relative path. Library stage artifacts must be read through their own connector, not inferred from a local basename. Git HEAD/worktree and authority path are checked locally.

External capabilities (Git write, Notion, Drive, Library, browser) are caller-reported only. UNKNOWN produces PROBE_REQUIRED; UNAVAILABLE blocks. Even caller-provided AVAILABLE for any required external capability still produces PROBE_REQUIRED until actual provider use. No text claim grants permission or proves a tool is usable.

AP_HARNESS_ENTRY_v1 reports ENTRY_READY, PROBE_REQUIRED or BLOCKED plus nextRecommendedAction. ENTRY_READY is **only local entry readiness** and never math/SVG/Blind/Meta QA, Git main remote parity, CI, deployment or publication approval. The exact task CURRENT, existing validator, Git protection and the user's current instruction remain authoritative.

Skill static inventory and Git integrity are already handled by tools/skills/verify-skills.mjs. A9-style live Skill injection attestation is NOT implemented here; never claim SKILL_INJECTED merely from a file or this probe. This pilot does not add a daemon or auto-writer.

Negative contract tests explicitly inject unknown route, nonexistent authority/target, invalid path, forged capability and malformed registry. All 11 canonical authority paths are checked independently in the scoped CI job.
