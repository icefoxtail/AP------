# Git 저장 범위·Drive 증거

> 2026-10-30 루트 `AGENTS.md`에서 옮긴 원문이다. 문구는 그대로 두고, 링크 경로만 이 폴더 기준으로 고쳤다. 본문 속 백틱 경로는 저장소 루트 기준이다.
> 이 영역 작업을 시작할 때 읽는다. 공통 규칙과 작업별 안내는 루트 [AGENTS.md](../../AGENTS.md)에 있다. 새 지시는 루트 `AGENTS.md`가 아니라 이 문서에 추가한다.

## CURRENT HARD — Git production-only / Drive cold evidence (2026-10-16 user direction)
- Git contains production sources/assets/runtime, build and test tools, current contracts, and only the index-declared offline hot evidence authorities. `archive/data/evidence-authority/v1/index.json` is the versioned source of exact aliases and per-entry source Git blob, SHA-256, byte length, role, and consumer bindings; consult it and the ROOT receipt for current counts and total bytes. Do not treat this lane as a quality verdict.
- After the authorized history rewrite, continue from a fresh clone and new rewritten history. Keep old dirty checkouts untouched for recovery; recover only reviewed changes by narrow cherry-picks onto the fresh clone, and never merge or cherry-pick an entire pre-rewrite graph. The active `tools/git-history-rewrite-policy.v1.json` and `docs/operations/Git_Footprint_and_Evidence_Retention_v1.md` define the ancestry guard and recovery path. Historical ROOT receipts' `historyRewrite: false` records their earlier preservation event only.
- The only permitted cold roots are the explicit prefixes `archive/analysis/`, `archive/_generated/`, `output/`, `reports/`, `render_review/`, `artifacts/`, `archive-work/`, `evidence/`, `archive/evidence/`, and `스캔_인테이크_산출물/`; each pack sidecar and ROOT receipt must carry the same allowlist subset. Raw histories, captures, catalog/conflict snapshots, backups, intermediate logs, and render outputs belong in the verified Drive vault and ignored local cache. Current/reusable source code stays in Git; historical scripts under a reviewed cold root may be archived when current-code consumer audit finds no active read/import. The prior blanket-ignore prohibition is superseded by this explicit user direction after the Drive pack and readback are verified. Until then, preserve source originals.
- Before removing any original Git paths, verify each Drive pack's exact ID, parent, name, MIME type, size, SHA-256, metadata readback, and full downloaded bytes against the sidecar path index and baseline Git blob/SHA-256. Git keeps only the compact verified ROOT pointer/receipt and the index-declared offline authority lane; the full path index and raw packs stay outside Git.
- Cold evidence is hydrated on demand into `.codex/archive-analysis-drive-cache/`. Verify the ZIP, internal manifest, member bytes, reconstructed full object SHA-256, size, and Git blob SHA-1 before returning bytes. Missing or corrupt evidence remains unavailable and cannot be converted to PASS.
- ROOT consumes compact verified completion receipts and fetches raw proof only when needed. Workers still inspect the actual source/evidence and perform the assigned independent quality review. Validators, review scope, and quality gates remain unchanged; Drive access must not become a GitHub CI prerequisite.

## 워크트리 정리 (2026-11-10 사용자 지시)

모든 라인(Claude·Codex·GPT, 메인과 하위 에이전트를 띄운 세션) 공통이다. 이유: 2026-11-10에 C 드라이브(232GB) 여유가 767MB까지 떨어져 작업을 멈췄고, 병합이 끝난 에이전트 워크트리 2개를 지우니 약 15GB가 확보됐다(워크트리 하나가 약 7GB).

- 내 PR이 `main`에 병합되면 그 작업에 쓴 워크트리(하위 에이전트의 `isolation: "worktree"` 포함)를 바로 지운다: `git worktree remove <경로>`. 몰아서 하지 않는다.
- 지우기 전에 두 가지를 확인한다. ① `git branch -r --contains <워크트리 HEAD>`에 `origin/main`이 있다. ② `git status --short`에 `.claude/settings.local.json` 같은 로컬 설정 외의 미커밋 변경이 없다. 둘 다 맞을 때만 `--force`를 쓴다.
- main에 없는 커밋이나 미커밋 작업이 있는 워크트리, 다른 세션이 만든 워크트리는 지우지 않는다. 경로와 상태를 사용자에게 보고한다.
- 새 워크트리를 여러 개 만들기 전에 `df -h`로 여유를 본다. 여유가 20GB 아래면 먼저 정리한다.
- 렌더·캡처 같은 임시 산출물은 워크트리 안 `.tmp/`에 두고, 게시·병합이 끝난 묶음은 지운다.
