# ALIVE production manifest — 25 팔마고 고1 2학기 중간

- Status: `SOURCE_LOCKED / ADAPTIVE_PLAN_CONFIRMED / CANDIDATE_GENERATION_IN_PROGRESS`
- Current worktree base: `330394489f6e90c5c7d5c7ae28623ab52ca824b9` (latest fetched `origin/main` at start)
- Production branch: `codex/alive-palma-25-h1-2mid`
- Source: `archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js`
- Source Git blob SHA-1: `4cfce909c023e5c4df4a759945c8cc3e0a63ec76`
- Source file SHA-256: `1C7C2C331464AA214331D844E32F9378C86654B1B8E495C8C3CDF759B26BEAEF`
- Source denominator: 23 unique ordered IDs (1–23), confirmed within locked JS.
- Format: 19 multiple-choice, 4 constructed response; total 100 points.
- Primary L2 groups: 7, with exact one-time qid coverage in `01_ADAPTIVE_BATCH_PLAN.json`.
- Source HOLD qids: 11 and 16 due unresolved source wording; q20 school-name typo recorded and excluded from generated wording.
- Current authorized scope: this Palma exam only; after its closure pause for user quality review. All later schools are deferred until the user resumes.
- Independent review: NOT_STARTED
- Approved / rejected / candidate hold: 0 / 0 / 0
- Consumer DB registered / student lookup verified: 0 / 0
- Main publication: NOT_STARTED

## Authority and execution decisions

- User explicitly directed this 2025 Palma exam to precede the Git CURRENT's default 2026-first roster. This run records a user-directed order exception; later requested sequence is deferred until the user resumes: High-1 2026, High-1 2025, then High-2 2026. Within each year: 2학기 중간 → 2학기 기말 → 1학기 중간 → 1학기 기말. Missing originals will be inventoried and recorded as SKIPPED with evidence.
- The available Page context is null and no Notion connector is installed in this session. The Git CURRENT states Git main is execution authority and Notion is a mirror/entry point; repository-managed ALIVE Lite rules and skill verification are used as the operative source.
- CREATE/REVIEW model allocation follows supported routes as closely as available: at most four distinct L2-owned creators; create workers use `gpt-6-luna` at `max` where supported; independent review uses a separate `gpt-6-luna` worker at `high`. This session does not expose a switch for the root model, and `xhigh` is not an available Luna effort setting; neither will be claimed as used.
- The source analyst’s interface did not expose its resolved model/effort; none is claimed. All future agent routes will be recorded from the actual spawn settings.

## Agent route constraint

- The specialized `alive_staged_batch_builder` role requires a STAGED_EXAM packet/inbox that this ALIVE Lite job does not have. Its first attempt performed no source read or write; two same-role calls were interrupted before producing files. The actual L2 creators are reassigned to general worker agents with exclusive file ownership and explicit ALIVE Lite instructions; no specialist route will be claimed.

## Stage counts

| Stage | Denominator | State | Evidence |
|---|---:|---|---|
| Source inventory | 23 | PASS | `00_FULL_SCAN.json`, `01_SOURCE_AUDIT.md` |
| Adaptive L2 plan | 7 batches / 23 source qids | PASS | `01_ADAPTIVE_BATCH_PLAN.json` |
| Candidates generated | 0 | IN_PROGRESS | B01–B04 assigned to four distinct L2-owned CREATE workers |
| Independent review | 0 | NOT_STARTED | blind student-input-first review pending |
| Consumer registration | 0 | NOT_STARTED | approved UIDs only |
| Student lookup | 0 | NOT_STARTED | Chrome evidence pending |
| Main remote readback | 0 | NOT_STARTED | after eligible publication |
