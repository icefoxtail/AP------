# Generated Artifact Git Policy v1

적용일: 2026-09-15

## 목적

Archive/past-exam pipeline은 검수, evidence, debug, render, benchmark,
temporary manifest, candidate, crop, cache, runtime packet을 실행 중 계속
생성한다. 이 파일들은 검수에 필요할 수 있지만 source 또는 최종 production
artifact가 아니다. 이 정책은 그런 산출물을 생성하지 말라는 규칙이 아니라,
생성·소비는 허용하되 Git history에 영구 추적하지 않는 경계를 정한다.

반대로 최종 exam JS, 실제 문제/해설 이미지와 SVG, pipeline source,
runtime/config, DB/index, 그리고 명시적으로 승인된 canonical 기록은 확장자와
관계없이 Git에서 보여야 한다.

## 권위 관계

Past Exam의 source fidelity, 풀이 품질, visual provenance, independent audit,
render, promotion, release/seal은 `Past_Exam_V3_COMPLETE.md`,
`COMMON_PROTOCOL_v1.2.10.md`, `공통파이프라인_실행계약_v1.md`, 그리고
`archive/tools/pipeline-core/`가 계속 관할한다. 이 문서는 그 pipeline의
artifact 저장 위치와 Git 추적 경계만 정하며, generated evidence를 semantic
PASS 또는 production authority로 승격하지 않는다.

## 분류 규칙

### SOURCE

사람이 직접 유지보수하거나 실행에 필요한 원본이다.

- pipeline, generator, validator, renderer, runtime adapter source
- config, contract, fixed fixture
- `alive/runtime/provider-bridge/`의 다음 다섯 source module
  - `auditor-output-normalizer.mjs`
  - `auditor-output-schema.mjs`
  - `auditor-turn-output.mjs`
  - `codex-appserver-adapter.mjs`
  - `codex-appserver-launch-state.mjs`

SOURCE는 Git에 추적한다.

### PRODUCTION_ARTIFACT

사용자 runtime이 직접 제공하거나 production build가 직접 읽는 최종 결과다.

- `archive/exams/original/`, `archive/exams/similar/`, `archive/exams/types/`
  아래의 승인된 JS
- `archive/assets/images/` 아래 production JS가 참조하는 문제 이미지와
  해설 이미지/SVG
- production이 직접 읽는 manifest/data, `archive/db.js`,
  `archive/question-index.js`

PRODUCTION_ARTIFACT는 Git에 추적하며 `.gitignore`의 확장자 규칙으로 숨기지
않는다.

### CANONICAL_RECORD

재생성 가능한 실행 로그가 아니라 프로젝트의 영구 의사결정·운영 권위로
명시된 기록이다. 보고서처럼 보인다는 이유만으로 이 분류를 부여하지 않는다.
현재 operational rule 문서는 `docs/rules/MANIFEST.md`에 등록하고, historical
또는 generated report는 이 분류로 자동 승격하지 않는다.

### REGENERATABLE

source와 production 입력으로 정상 pipeline/test를 다시 실행하면 만들 수
있는 산출물이다.

- `archive/_generated/`
- `archive/exams/_generated/`
- `archive/tools/logic-visual-audit/reports/`
- `alive/runtime/` 아래의 runtime state, trace, packet, receipt,
  work-batch state, evidence
- review/audit/evidence/benchmark output, screenshot, render capture,
  crop/cache/temp, generated JSON/CSV/TXT/HTML

REGENERATABLE은 파일을 로컬에 보존할 수 있지만 Git index에서는 제거한다.
현재 정리 대상은 `archive/_generated/`의 1,202개 tracked entry, logic-visual
report의 1,316개 tracked entry, ALIVE runtime evidence 135개, root-level
2025/제일고 report·screenshot 5개다. 총 2,658개 entry를 index에서 제거하며,
135개는 provider-bridge evidence 126개와
`alive/runtime/work-batches/*/state.json` 9개로 구성된다. 다섯 source module은
유지한다.

### OBSOLETE

현재 source, production, canonical record 어느 쪽에서도 소비하지 않는 과거
실패 결과·중복 output·폐기 temp다. 삭제가 필요하더라도 먼저 exact reference
관계를 확인한다. 로컬 검수에 필요한 파일은 물리 삭제하지 않고 index만
정리할 수 있다.

## 저장 경로 계약

Git에 남는 production 경로와 실행 중간물을 같은 경로에 섞지 않는다.

```text
SOURCE / PRODUCTION_ARTIFACT
  archive/exams/
  archive/assets/images/
  archive/tools/
  archive/db.js
  archive/question-index.js

REGENERATABLE WORKSPACE
  archive/_generated/
  archive/exams/_generated/
  archive/tools/logic-visual-audit/reports/
  alive/runtime/
```

새 pipeline output은 위 generated workspace 중 하나 또는 별도로 명시된
path-specific workspace에 쓴다. production `archive/`에 직접 쓰는 작업은
현재 Past Exam promotion helper와 release authority를 거치지 않은 임의
생성으로 취급한다.

## `.gitignore` 계약

파일 형식이 아니라 생성 위치를 ignore한다. 다음은 유지해야 하는 핵심
경계다.

```gitignore
/archive/_generated/
/archive/_generated/**
/archive/exams/_generated/
/archive/exams/_generated/**
/archive/tools/logic-visual-audit/reports/
/alive/runtime/*
!/alive/runtime/provider-bridge/
/alive/runtime/provider-bridge/**
```

Provider bridge source module은 위 generated rule 뒤에 exact negation으로
다시 포함한다. production asset이 SVG, PNG, JPG, JPEG, GIF라는 이유만으로
무시하는 전역 규칙은 허용하지 않는다. 특히 `*.svg`, `*.png`, `*.jpg`,
`*.jpeg`, `*.gif`, `*.js`, `*.json`, `*.html`, `*.txt`를 전역 ignore하지
않는다.

`.gitignore`를 바꿀 때 기존 tracked 파일은 자동으로 index에서 빠지지 않는다.
재생성 가능성이 확인된 기존 entry는 exact path 목록으로 `git rm --cached`
하고, 로컬 파일이 계속 필요한지 확인한다.

## 필수 Git 안전 규칙

- `git add .`와 `git add -A`를 사용하지 않는다.
- 실제 source, production artifact, runtime/config, canonical document만
  exact path로 stage한다.
- generated directory와 production asset이 섞인 경우 directory 전체를
  untrack하지 않고 file-by-file boundary를 확정한다.
- 기존 modified/staged/untracked work는 baseline으로 보존하고 이 정책의
  변경과 섞지 않는다.
- `git stash`, `git reset`, `git clean`, `git restore`, `git checkout -- .`로
  baseline을 정리하지 않는다.

## 자동 hard gate

`tools/archive/check-generated-git-policy.mjs --jeilgo`는 tracked 제일고
production JS를 읽고 `image`와 `solutionImage` 참조를 정방향으로 검사한다.
각 참조는 파일 존재, Git tracked, `git check-ignore --no-index` 결과를
모두 확인해야 한다. 검사기는 다음을 실패로 본다.

- production JS 또는 참조 asset이 없음
- production JS 또는 참조 asset이 untracked임
- production JS 또는 참조 asset이 ignore됨
- generated root 아래 허용되지 않은 tracked entry가 있음
- generated root 자체가 path-specific ignore 경계를 가지지 않음

검사기는 `alive/runtime/provider-bridge/`의 다섯 source module만 허용된
tracked exception으로 취급한다. 이 exception은 runtime evidence나 packet을
허용하는 규칙이 아니다.

## 신규 asset smoke contract

정책 test는 임시 Git repository에 동일 확장자의 파일을 만들고 다음을
검증한다.

```text
CASE A  pipeline-only execution -> generated output does not add Git noise
CASE B  source/production edit  -> exact edit remains visible
CASE C  new production SVG/PNG  -> git status shows the file
CASE D  generated SVG/PNG       -> git status does not show the file
```

기존 파일이 이미 tracked되어 있다는 사실만으로 CASE C를 통과시키지 않는다.
새 파일을 실제로 추가할 수 있어야 한다.

## 2025 제일고 적용 범위

2025 제일고 production JS 및 그 JS가 참조하는 `archive/assets/images/`의
모든 image/SVG는 PRODUCTION_ARTIFACT로 유지한다. source/candidate/report/
evidence/render 파일은 manifest와 producer/consumer 관계를 확인해
REGENERATABLE 또는 CANONICAL_RECORD로 판정한다. 생성 evidence를 Git에서
제외해도 validator가 파일을 생성·소비하는 기능은 유지해야 한다.

현재 2025 제일고 대표 run의 로컬 generated output은
`archive/_generated/past-exams/`에 존재하며, 그 위치는 production JS 경로가
아니다. 실제 pipeline 재실행 후에도 generated output은 local workspace에
남고, source 또는 production 결과가 바뀐 경우에만 해당 exact path가 Git
status에 나타나야 한다.
