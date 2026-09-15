# Generated Artifact Lifecycle Design

**Status:** implementation approved by the user request on 2026-09-15

## Goal

Archive pipeline 산출물을 파일 확장자가 아니라 생성 run의 lifecycle과 실제
생성자·소비자·보존 계약으로 관리한다. 작업 중에는 검수에 필요한 산출물을
생성하고, production 또는 canonical handoff 결과를 승격한 뒤 TEMP_GENERATED만
자동 cleanup하며, 실패·held 실행의 최소 debug bundle은 retention 경계까지
보존한다.

## Scope and safety boundary

이번 변경은 다음 네 경계를 함께 다룬다.

1. `archive/_generated/`, `archive/exams/_generated/`,
   `archive/tools/logic-visual-audit/reports/`의 archive-side staging/evidence.
2. `alive/runtime/`의 legacy, fast, staged, adaptive, universal run lifecycle.
3. Past Exam extraction/promotion의 성공·실패 전환점.
4. production JS와 `archive/assets/images/`의 SVG/PNG/JPG/WebP 보호 및 Git
   visibility.

현재 checkout의 다른 dirty/staged/untracked 파일은 입력·출력 어느 쪽에서도
수정하지 않는다. broad `git clean`, `git reset`, `git stash`, `git add .`,
`git add -A`, 확장자 전체 ignore는 금지한다. cleanup은 반드시 generated root
안의 명시된 run directory 또는 manifest가 가리키는 exact path에만 적용한다.

## Classification

### TEMP_GENERATED

source와 production/canonical 입력으로 다시 만들 수 있고, 현재 run의 다음
단계 또는 검수에서만 사용하는 산출물이다.

- candidate JS, page render, crop, debug bundle, review draft
- machine evidence, render capture, screenshot, benchmark output
- temporary manifest, packet, trace, receipt, report, CSV/JSON/TXT/HTML
- 실패한 실행의 이전 revision과 중복 output
- generated workspace 안의 intermediate SVG/PNG/JPG/WebP

TEMP_GENERATED는 run이 성공하고 필요한 production/canonical 결과가 먼저
검증된 뒤 자동 제거한다. 실패/held/수동 검수 상태에서는 제거하지 않고
debug bundle과 lineage를 retention 대상으로 남긴다.

### CANONICAL_GENERATED

이름에 `final`, `evidence`, `audit`, `receipt`가 들어갔다는 이유만으로
승격하지 않는다. 다음 조건을 모두 만족하는 최소 결과만 이 분류다.

- 다음 pipeline stage 또는 release/closure command가 실제로 읽는다.
- 코드 또는 현재 protocol에 보존 계약과 hash/identity binding이 있다.
- source와 production 결과만으로 동일한 승인 증거를 재생성할 수 없거나,
  handoff 동안 compact result가 필요하다.

현재 구현에서는 ALIVE `alive/runtime/results/<run-id>.zip`과
`<run-id>-summary.json`이 handoff/retention 계약을 가진 compact result다.
verbose run directory는 canonical이 아니며 성공 시 quarantine으로 이동한다.
Past Exam staging의 `production_promotion_receipt.json`은 promotion call 중
검증되는 TEMP evidence이고, 별도 보존 계약이 없는 한 staging cleanup 대상이다.

### PRODUCTION / SOURCE

- `archive/exams/original/`, `archive/exams/similar/`, `archive/exams/types/`
  아래의 production JS
- production JS가 참조하는 `archive/assets/images/` PNG/JPG/JPEG/WebP/SVG
- pipeline/generator/validator/renderer/runtime source, config, schema, fixture
- DB/index와 현재 rule/manifest 문서

이 경계의 파일은 삭제하거나 ignore하지 않는다. 새 production SVG/이미지는
Git status에 나타나야 하고, generated workspace의 동일 확장자 파일만
숨겨져야 한다.

## Lifecycle protocol

```text
ACTIVE run
  -> generated TEMP workspace
  -> review / machine evidence / render
  -> production or compact canonical promotion
  -> SUCCESS cleanup of TEMP only

ACTIVE run
  -> failure / HOLD / manual review
  -> minimal debug bundle retained
  -> next success or explicit retention GC
```

### Archive-side runs

`archive/tools/past-exam-pipeline/run-one-exam.mjs` creates only under the
configured generated root. Extraction/manual review/partial helper results do
not qualify for cleanup. `promote-reviewed-exam.mjs` is the success boundary:
only after the production JS, referenced assets, DB/index obligations, and
promotion receipt have passed does it mark the staging run successful and remove
its TEMP paths.

The cleanup helper refuses paths outside the generated roots, refuses a run
without an explicit success marker, and refuses an unknown/legacy run unless the
caller supplies an exact manifest-backed retention decision. This fail-closed
behavior prevents an old but potentially useful evidence bundle from being
mistaken for disposable output.

### ALIVE runs

`alive/engine/runtime_lifecycle.py` is the common runtime boundary. Package/final
commands call `finalize_run` by default. It verifies the package and writes a
compact result before removing successful verbose workdir data. Failed runs move
to an OS quarantine directory for bounded debugging retention. `--keep-workdir`
is the explicit debugging escape hatch.

The lifecycle includes universal runs and `SEALED_LOCAL` as a terminal success
state. `runtime-gc` remains dry-run by default, protects active/held runs, and
only finalizes terminal runs older than the explicit retention threshold.

The result root is a short-lived CANONICAL_GENERATED handoff surface. The
quarantine is not production data; it is retained only through the configured
retention period and then removed by an explicit GC operation.

## Git contract

Keep the existing path-specific rules. Do not add `*.svg`, `*.png`, `*.jpg`,
`*.jpeg`, `*.webp`, `*.json`, `*.txt`, `*.html`, or `*.js` rules. The existing
policy checker remains the forward production asset gate and is extended only
where necessary to prove the lifecycle boundary.

Required smoke cases:

- A: pipeline-only generation leaves no visible Git noise under generated roots.
- B: a source/production change remains visible.
- C: a new production SVG/PNG is visible and not ignored.
- D: a generated SVG/PNG is ignored and is accepted by cleanup only when its
  run is explicitly successful.
- E: an active/held/failed run is not removed by success cleanup.
- F: a sealed universal run is finalized into result summary/package and its
  verbose workdir leaves the repository.

## Evidence and final report

The implementation records inventory counts from a read-only snapshot, cleanup
counts/bytes from exact operations, the five source-module exception, production
forward-reference results, and every retained generated cluster with its
producer/consumer/reason. Unknown legacy output is reported as retained rather
than guessed into TEMP or CANONICAL.
