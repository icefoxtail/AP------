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

## 2026-09-08 원격 재개용 최신 인계

### 현재 기준

- 재개 브랜치: `fix/solution-caption-cleanup`
- 원격 최신 커밋: `7715ef0b fix(archive): close specialist visual route contract`
- 원본 핸드오프가 지시한 `codex/review-h2-s1-algebra-20260908` 브랜치는 현재 원격 ref에 없다.
- 이 작업의 대상은 고2 **S1 대수 시각자료**이며, 확인된 source 경로는 주로 `archive/exams/original/high/h2/1mid/`와 `1final/`이다. 고2 2학기 수학II SVG 브랜치(`review/h2-math2-2mid-svg-full-repair`)와 혼동하지 않는다.

### 확인된 문제

1. 핸드오프 문서에는 `ADD 24/24 + REBUILD 14/14`, 총 39 candidate, production asset binding 39/39, render 72/72 PASS라고 기록되어 있다.
2. 그러나 현재 접근 가능한 원격 브랜치에는 그 기록을 뒷받침하는 `SOLUTION_FREEZE_STATUS.md`, `candidate_manifest.json`, V1/V2/V3 evidence, render matrix가 없다.
3. 현재 브랜치의 H2 S1 source 36개·800문항에는 `solutionImage` 참조가 0개이고, H2 S1용 신규 `q*-solution.svg` production asset도 확인되지 않는다. 따라서 39개 이미지 생성 결과는 집 컴퓨터의 미푸시 브랜치/작업 트리에만 있거나, 다른 브랜치에서 생성된 뒤 반영되지 않은 상태로 취급한다.
4. 초기 pipeline-core 테스트 실패는 최신 provider attestation 계약을 synthetic metadata reuse fixture가 따르지 않아 발생했다. 임의로 production contract를 약화해서는 안 된다.

### 이번 원격 브랜치에서 완료한 작업

- `function-family`를 `APMATH_VISUAL_FACT_v2`의 정식 typed visual family로 추가했다.
- 제한된 수식 parser와 deterministic generator에 다항·유리·무리·절댓값·지수·로그·삼각 branch를 연결했다.
- 정의역 불확실성, pole/점근선 통과, 지원하지 않는 수식은 fail-closed로 유지한다.
- metadata reuse fixture에 provider attestation plan, freeze/launch/context binding, terminal `providerPlanRef`를 연결했다.
- bundled Python runtime 기준 pipeline-core 전체 테스트 `130/130 PASS`.
- production asset 생성, 459-target seal, main merge, deploy는 수행하지 않았다.

### 집 컴퓨터 확인 후 진행 순서

1. reset/pull하지 말고 먼저 `git status --short`, `git worktree list`, `git reflog --all --date=iso`를 실행한다.
2. `codex/review-h2-s1-algebra-20260908` 또는 `SOLUTION_FREEZE_STATUS.md`, `candidate_manifest.json`, `PRODUCTION_ASSET_BINDINGS.json`, `browser_render_capture_matrix.json`, `*.svg`가 있는 작업 트리를 찾는다.
3. 찾은 로컬 브랜치를 별도 백업 브랜치로 보존하고 원격에 push한다. 미커밋 파일이면 먼저 commit한다.
4. `fix/solution-caption-cleanup`와 파일·커밋·asset SHA를 비교한 뒤 필요한 경우에만 병합한다. H2 2mid SVG 작업물은 이 작업에 섞지 않는다.
5. 39 candidate의 실제 SVG를 현재 canonical V1/V2/V3/render evidence contract로 재검증하고, 459 UID denominator와 freeze를 다시 확인한다.
6. pipeline-core `130/130`, source `node --check`, asset binding, desktop/mobile exam·solution·answer render를 통과시킨 뒤 사용자 검수 후에만 `main`에 merge한다.

### 안전 규칙

- 집 작업물 확인 전 `git reset --hard`, 무조건적인 `git pull`, 파일 삭제를 실행하지 않는다.
- custom SVG review JSON만으로 pipeline-core PASS를 만들지 않는다.
- 핸드오프의 39/39·72/72 기록은 현재 branch에서 재현되기 전까지 완료 사실로 승격하지 않는다.
