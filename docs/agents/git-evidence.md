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

## 루트 폴더는 main 전용 (2026-11-11 사용자 지시)

모든 라인(Claude·Codex·GPT·Gemini) 공통이다. 이유: 2026-11-11에 저장소 루트 폴더가 `main`이 아닌 `work/4slot-gpt-pilot-20261103`에 있었고 `main`보다 1,679커밋 뒤처져 있었다. 한 라인이 워크트리 없이 루트에서 직접 작업하며 로컬 `main`에 커밋 5개(원격 미반영), 다른 브랜치에 47개를 쌓았고, 미추적 파일 807개와 삭제 표시 44개가 남아 다른 세션이 이 상태를 병합해야 하는지 판단할 수 없었다. 사용자는 루트를 항상 main 기준으로 두기를 원한다.

- 저장소 루트 폴더(워크트리가 아닌 본 체크아웃)는 `main` 브랜치에 두고 `origin/main`을 받기만 한다. 루트에서 커밋, 브랜치 전환·생성, 파일 생성·수정을 하지 않는다.
- 모든 작업은 자기 워크트리에서 한다(`git worktree add <경로> -b <브랜치> origin/main`). 여유 공간이 부족하면 D 드라이브에 만든다. `main` 반영은 PR로만 한다.
- 로컬 `main`에 직접 커밋하지 않는다. 로컬 `main`이 `origin/main`보다 앞서 있으면 그 커밋을 브랜치로 옮겨 원격에 올리고 로컬 `main`을 `origin/main`에 맞춘다.
- 스크립트·중간 산출물을 루트에 미추적 파일로 쌓지 않는다. 자기 워크트리의 `.tmp/`에 두고, 남길 것은 PR로 올리거나 Drive에 둔다.
- 루트가 `main`이 아니거나 미커밋 변경이 있는 것을 발견하면, 남의 작업일 수 있으니 지우거나 병합하지 말고 경로·상태를 사용자에게 보고한다. 사용자가 정리를 지시하면 미추적 파일과 미커밋 변경을 먼저 백업하고(사본이 원본과 같은지 확인), 원격에 없는 커밋은 브랜치로 올린 뒤 루트를 `main`으로 맞춘다.
- 2026-11-11 정리 때 남긴 것: 루트의 미추적 작업 파일(`.archive-meta-register`, `tools/`의 교과서 스크립트, `.codex`, `META_PIPELINE`, `SVG_AUDIT_PIPELINE` 등)은 쓰는 라인이 있을 수 있어 지우지 않았다. 그 라인이 자기 워크트리로 옮기거나 지운다. 백업은 `D:\AI_WORKSPACES\APMS\root-untracked-backup-20261111`, 로컬 `main`에만 있던 교과서 커밋 5개는 `origin/backup/local-main-textbooks-20261111`에 있다.

## 워크트리 정리 (2026-11-10 사용자 지시)

모든 라인(Claude·Codex·GPT, 메인과 하위 에이전트를 띄운 세션) 공통이다. 이유: 2026-11-10에 C 드라이브(232GB) 여유가 767MB까지 떨어져 작업을 멈췄고, 병합이 끝난 에이전트 워크트리 2개를 지우니 약 15GB가 확보됐다(워크트리 하나가 약 7GB).

- 내 PR이 `main`에 병합되면 그 작업에 쓴 워크트리(하위 에이전트의 `isolation: "worktree"` 포함)를 바로 지운다: `git worktree remove <경로>`. 몰아서 하지 않는다.
- 지우기 전에 두 가지를 확인한다. ① `git branch -r --contains <워크트리 HEAD>`에 `origin/main`이 있다. ② `git status --short`에 `.claude/settings.local.json` 같은 로컬 설정 외의 미커밋 변경이 없다. 둘 다 맞을 때만 `--force`를 쓴다.
- main에 없는 커밋이나 미커밋 작업이 있는 워크트리, 다른 세션이 만든 워크트리는 지우지 않는다. 경로와 상태를 사용자에게 보고한다.
- 새 워크트리를 여러 개 만들기 전에 `df -h`로 여유를 본다. 여유가 20GB 아래면 먼저 정리한다.
- 렌더·캡처 같은 임시 산출물은 워크트리 안 `.tmp/`에 두고, 게시·병합이 끝난 묶음은 지운다.
