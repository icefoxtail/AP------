# H2 수학I·대수 시각자료 업그레이드 — continuation handoff

학원 작업자가 현재 branch에서 이어갈 수 있도록 현재 상태와 남은 closure 작업을 고정한 문서다.

## 현재 위치

- branch: `codex/review-h2-s1-algebra-20260908`
- last commit: `d0b13155d feat(archive): upgrade H2 S1 algebra visuals and freeze audit`
- main 최종 merge: 아직 하지 않음
- target: 459 / candidate inventory 475 / excluded 16
- current status: `READY_FOR_SPECIALIST_CLOSURE`, `NOT_SEALED`

재개 전 `git checkout codex/review-h2-s1-algebra-20260908`, `git status --short`, `git log -2 --oneline --decorate`를 실행한다.

## 이미 닫힌 gate

- solution freeze: latest-UID dedup 기준 459/459 PASS, residual BLOCKED 0
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

주요 근거는 `SOLUTION_FREEZE_STATUS.md`, `candidate_manifest.json`, `visual_triage.json`, `PRODUCTION_ASSET_BINDINGS.json`, `browser_render_capture_matrix.json`, `browser_render_review.json`, `browser_render_check.md`다.

## 해설 source adjudication 기록

- `23_부영여고 q21`: 표시 조건으로 a,b가 유일하지 않음 → 조건 불충분
- `25_순천고 q11`: ⑤ wording 교정
- `25_순천여고 q13`: stale UID batch를 현재 sector 문항으로 재검증
- `25_제일고 q13`: 1<b<a만으로 a와 b² 비교 불충분
- `25_효천고 q24`: m−n=3이 불가능 → 해 없음

상세 batch는 `solution_freeze_batch_001.json`~`solution_freeze_batch_110.json`과 `solution_freeze_batch_110.json`을 확인한다.

## 남은 작업 A — canonical specialist visual closure

현재 pipeline-core `visual-contract.json`은 typed family를 제한하고, 일반 삼각·지수·로그 함수 그래프의 현재 specialist evidence adapter가 없다. custom SVG review JSON만으로 pipeline-core PASS를 만들면 안 된다.

다음 중 정식 route를 구현·승인해야 한다.

1. function-family specialist route adapter를 current pipeline-core closure에 연결한다.
2. 기존 function-family local audit를 current V1/V2/V3/render evidence contract로 연결한다.
3. 39 candidate에 대해 새 revision으로 canonical V1/V2/V3, asset SHA, render capture/review, closure manifest를 생성한다.

일반 그래프를 cartesian/geometry 사실로 억지 변환하지 않는다. route가 없으면 `MISSING_CURRENT_PIPELINE_EVIDENCE`를 유지한다.

## 남은 작업 B — pipeline-core test regression

현재 `npm --prefix archive/tools/pipeline-core test` 결과는 129/130 PASS다. 실패는 다음 fixture다.

`archive/tools/pipeline-core/tests/v2.test.mjs`의 metadata revision reuse test → `PROVIDER_ATTESTATION_PLAN_REQUIRED`.

최신 work-batch contract는 STATELESS_MODEL evidence에 `providerAttestationPlanRef`를 요구한다. `metadataAuditFixture()`에 synthetic provider plan을 생성하고 reservation request의 `providerAttestationPlanRef`, terminal receipt의 `providerPlanRef`, freeze/launch/context SHA binding을 연결한 뒤 전체 test를 다시 실행한다. production contract를 약화하지 않는다.

## 최종 작업 순서

1. A specialist route와 B regression을 닫는다.
2. 새 pipeline-core closure revision을 생성한다.
3. `npm --prefix archive/tools/pipeline-core test`를 130/130으로 확인한다.
4. 459 UID denominator, freeze, triage, 39 candidate evidence, asset SHA, render evidence를 전수 audit한다.
5. production authority/seal evidence를 생성한다.
6. 사용자 검수 완료 후에만 main merge한다.

현재 main merge 명령은 실행하지 않는다. 기존 candidate·freeze·render 작업은 재실행하지 말고 A/B closure부터 이어간다.

## 2026-09-08 continuation update

- This handoff was resumed from `origin/fix/solution-caption-cleanup` at `b62402ca`.
- The branch named in the original handoff (`codex/review-h2-s1-algebra-20260908`) is not currently present in the remote refs.
- B closure is complete: the metadata reuse fixture now binds a synthetic provider attestation plan to the reservation, launch, freeze/context snapshot, and terminal receipt.
- A closure route is now available in `archive/tools/pipeline-core`: typed `function-family` facts accept bounded polynomial/rational/radical/absolute/exponential/logarithmic/trigonometric branches, with explicit domain/pole rejection and deterministic Python candidate generation.
- Verification: pipeline-core `130/130` tests PASS with the bundled Python runtime; no production archive asset, main merge, or deploy was performed.
- The H2 S1 target remains `NOT_SEALED` until the 459-target run has current canonical V1/V2/V3 and render evidence generated through this route.
