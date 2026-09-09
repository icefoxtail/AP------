# H2 수학I·대수 시각자료 업그레이드 — continuation handoff

학원 작업자가 현재 branch에서 이어갈 수 있도록 현재 상태와 남은 closure 작업을 고정한 문서다.

## 현재 위치

- branch: `codex/h2-s1-algebra-visual-upgrade-20260909`
- remote: `origin/codex/h2-s1-algebra-visual-upgrade-20260909`
- current branch was created from and synced with latest `origin/main`; latest pushed base is the merge commit before the unpushed follow-up pack
- main 최종 merge: 아직 하지 않음
- target: 459 / candidate inventory 475 / excluded 16
- current status: `SPECIALIST_EVIDENCE_PASS_CANONICAL_ROUTE_HOLD`, `NOT_SEALED`

재개 전 `git checkout codex/h2-s1-algebra-visual-upgrade-20260909`, `git pull --ff-only`, `git status --short`, `git log -2 --oneline --decorate`를 실행한다.

## 이미 닫힌 gate

- solution freeze: latest-UID dedup 기준 459/459 PASS, residual BLOCKED 0; `solution_freeze_batch_111.json`의 origin-main 변경 문항 3/3 PASS
- visual triage baseline: NO_VISUAL 364 / KEEP_EXISTING 56 / REBUILD_EXISTING 15 / ADD_NEW_VISUAL 24
- candidate manifest: 39 rows
  - ADD 24/24: candidate + source-only V1 + artifact-only V2 + parity V3 PASS
  - REBUILD 14/14: candidate + V1/V2/V3 PASS
  - blurry q9: `SOURCE_BLUR_RECONSTRUCTABLE`, V1/V2/V3 PASS
- production asset binding: 39/39 `solutionImage` parity PASS
- modified source JS: 22/22 `node --check` PASS
- browser render: 72/72 PASS
  - 12 changed source files × exam/solution/answer × desktop/mobile
  - image decode 0, overflow 0, clipping metric 0
  - representative review: q9 blurry reconstruction, q2 ADD tangent, q23 REBUILD geometry
- origin-main refresh render: 18/18 PASS (`browser_render_refresh_20260909.json`)
  - source-safe LaTeX repair 후 효천고 q24 6/6 재검수 포함

주요 근거는 `SOLUTION_FREEZE_STATUS.md`, `candidate_manifest.json`, `visual_triage.json`, `PRODUCTION_ASSET_BINDINGS.json`, `browser_render_capture_matrix.json`, `browser_render_review.json`, `browser_render_check.md`다.

## 해설 source adjudication 기록

아래 4개는 이전 baseline에서 발견해 기록한 역사적 adjudication이다. 최신 `origin/main` source가 공급한 정의는 batch 111에서 다시 판정했다.

- `23_부영여고 q21`: 표시 조건으로 a,b가 유일하지 않음 → 조건 불충분
- `25_순천고 q11`: ⑤ wording 교정
- `25_순천여고 q13`: stale UID batch를 현재 sector 문항으로 재검증
- `25_제일고 q13`: 이전 source에서는 1<b<a만으로 a와 b² 비교 불충분
- `25_효천고 q24`: 이전 source에서는 m−n=3이 불가능 → 해 없음

최신 source 재검산은 `solution_freeze_batch_111.json`을 확인한다.

## 닫힌 작업 A — specialist visual closure route

일반 삼각·지수·로그 함수 그래프를 unrelated typed family로 위장하지 않도록 별도 specialist route adapter를 pipeline-core CLI에 연결했다.

- runner: `archive/tools/visual-upgrade/build-function-graph-specialist-run.mjs`
- audit command: `node archive/tools/pipeline-core/cli.mjs audit-function-graph ...`
- current evidence: `function_graph_specialist_pipeline_closure_v7.json`
- result: route `PASS`; candidate 39/39, freeze 459/459, baseline render 72/72, refresh render 18/18
- authority: `productionAuthorized:false` 유지
- consolidated audit: `FINAL_AUDIT_EVIDENCE.json` (`MACHINE_AUDIT_PASS_CANONICAL_SEAL_HOLD`)

일반 그래프를 cartesian/geometry 사실로 억지 변환하지 않는다. route가 없으면 `MISSING_CURRENT_PIPELINE_EVIDENCE`를 유지한다.

## 닫힌 작업 B — pipeline-core test regression

현재 `npm --prefix archive/tools/pipeline-core test` 결과는 130/130 PASS다. metadata revision fixture에 synthetic provider plan, reservation binding, terminal receipt plan binding을 추가해 최신 contract에 맞췄다.

`archive/tools/pipeline-core/tests/v2.test.mjs`의 metadata revision reuse test → `PROVIDER_ATTESTATION_PLAN_REQUIRED`.

수정 commit: `65112cd13 test(pipeline-core): bind metadata fixture to provider attestation plan`. production contract는 약화하지 않았다.

근거: `npm --prefix archive/tools/pipeline-core test` → `PASS_SOFTWARE_REGRESSION`, 130/130.

## 학원에서 이어갈 작업 순서

1. 이 브랜치를 pull하고 `function_graph_specialist_pipeline_closure_v3.json`을 먼저 확인한다.
2. 대표 SVG와 실제 렌더 캡처를 시각 검수한다. 특히 blurry q9, ADD q2, REBUILD q13/q23, 모바일 해설지와 한글·수식·라벨·잘림을 확인한다.
3. FAIL이 발견되면 해당 문항만 source → artifact V2 → parity V3 → 영향 범위 render 순서로 재검한다.
4. 전수 audit에서 residual FAIL 0, asset binding 39/39, freeze 459/459, render 72/72 + refresh 18/18을 다시 확인한다.
5. 학원 검수가 끝난 뒤에만 `productionAuthorized` 승격과 main 병합을 별도 승인받는다.

현재 main merge 명령은 실행하지 않는다. 다음 작업은 이 브랜치의 커밋·푸시 확인, 학원에서의 대표/전수 시각 검수, 그리고 명시적 승인 후 main 병합이다.
