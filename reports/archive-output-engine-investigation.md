# AP MATH 아카이브 출력엔진 구조 전수조사

## 0. 조사 메타데이터

- 대상 저장소: `icefoxtail/AP------`
- 조사 대상 워킹트리 기준 브랜치: `codex/hs-quadratic-svg-upgrade`
- Fast Engine v2 reference branch: `codex/archive-fast-engine-v2-phase1a`
- 본 보고서 생성 브랜치: `codex/archive-output-engine-investigation`
- 조사 성격: READ-ONLY 구조 조사
- 조사 중 코드 수정: 0건
- 조사 중 기존 파일 삭제/이름 변경: 0건
- 조사 중 커밋/push/merge: 보고서 커밋 전까지 0건

현재 워킹트리에는 조사 시작 전부터 존재한 변경 394건이 있었다. 이 변경은 이번 조사와 무관하므로 보고서 파일을 제외한 기존 변경은 커밋 대상에서 제외한다.

---

## A. Executive Summary

현재 코드상 실제 시험지 렌더/인쇄 엔진은 크게 `archive/engine.html`과 `archive/mixed_engine.html` 두 개다. 일반 아카이브는 `index.html`이 시험 JS URL을 만들어 `engine.html`을 열고, 엔진이 `questionBank`를 dynamic script로 로드한 뒤 시험지/해설/정답을 렌더한다.

일반 엔진은 `render-authority.js`, `layout-authority.js`, `print-contract.js`, `print-runtime.js`, `mathjax_render_loop.js`, exam/solution/answer executor와 부분적으로 공통화되어 있다. 그러나 현재 일반 엔진은 Fast Engine v2의 `screen-runtime`, snapshot, latest-wins, prewarm, side-effect ledger 계층을 사용하지 않고 직접 `render()` 트랜잭션을 수행한다.

Fast Engine v2 reference branch는 일반 `engine.html`에만 `render-state-normalizer.js`, `screen-runtime.js`, `screen-runtime-adapter.js`, `snapshot-contract.js`, `side-effect-ledger.js`, `layout-materializer.js`를 연결한다. 이 계층은 request generation, abort, latest-wins, render snapshot, cache, prewarm, commit/rollback, post-commit side effect, print snapshot preflight를 담당한다.

`mixed_engine.html`은 현재에도 exam/solution/answer renderer와 pagination을 HTML inline code로 보유한다. Fast Engine v2 reference branch에서도 mixed engine에는 일반 엔진의 screen runtime adapter가 연결되지 않았다. 따라서 “전체 출력 경로가 Fast Engine v2를 사용한다”고 볼 수 없다.

일반 엔진의 시험지/해설/정답 executor는 이미 별도 파일로 분리되어 있으므로 renderer primitive 수준에서는 공통화가 진행되어 있다. 반면 믹서는 같은 입력/출력/역할을 수행하는 inline renderer와 print preflight를 별도로 보유하므로 `DUPLICATED_EQUIVALENT`로 분류된다.

오답 기능은 현재 오답 문항만으로 새 시험지/해설지/정답표를 만드는 엔진으로 연결되어 있지 않다. 실제 확인된 오답 출력은 `assessment-analysis.html`의 결과표/분석표 브라우저 인쇄다.

취약점 모듈은 weakness score, metadata join, supplement preset, closed-loop fixture를 계산하지만 실제 `engine.html`/`mixed_engine.html` URL을 만들지 않는다. `candidate_non_operational`, `readOnly`, `noDbWrite`, `noStudentExposure`, `operationalExposure: HOLD`, `writes: 0`, `networkCalls: 0`이 코드상 명시되어 있다.

따라서 현재 구조는 다음과 같이 보는 것이 코드상 가장 정확하다.

```text
일반 archive 시험지/해설/정답 출력: ACTIVE, Fast Engine v2 부분 공유
Mixer/혼합/단원별/assessment 시험지 출력: ACTIVE, 별도 inline renderer
오답 결과표/분석표 출력: ACTIVE, 별도 browser print report
오답 시험지 renderer: NONE
취약점 기반 보충시험 출력: NON_OPERATIONAL CANDIDATE
```

---

## B. Inventory

### B-1. Inventory 기준

출력 관련 HTML/JS/CSS/JSON 중 다음을 후보로 조사했다.

- 실제 HTML script include 또는 dynamic script load 대상
- 출력 URL 생성, preview iframe, `window.print`, `engine.html`, `mixed_engine.html` 호출 관계를 보유
- renderer, layout, MathJax, image readiness, print transport, identity, metadata, mixer selection을 담당
- 현재 연결되지 않았지만 weakness 출력 후보로 조사해야 하는 contract module

다음은 엔진 후보 수에서 제외했다.

- `archive/exams/**/*.js`: 문항 데이터 원본
- `archive/assets/**`: 문제/해설 이미지와 기타 asset
- `archive/vendor/**`: MathJax/html2canvas vendor
- `archive/tools/**`: 생성/검증/pipeline tool
- `archive/analysis/**`, `reports/**`: 생성된 조사 evidence/report

### B-2. 수량

| 구분 | 수량 |
|---|---:|
| 출력 관련 후보 source/config 파일 | 45 |
| 실제 output/preview/report 경로 참여 파일 | 38 |
| 후보에서 제외한 파일 | 7 |
| 별도 시험 데이터 JS | 463 |
| asset 파일 | 3,685 |
| vendor 파일 | 236 |
| tools 파일 | 2,088 |
| archive analysis 파일 | 33 |

### B-3. 후보 파일 전체

#### 출력 진입점·일반/믹서 UI

- `archive/index.html`
- `archive/engine.html`
- `archive/mixer.html`
- `archive/mixed_engine.html`
- `archive/unit-past-exams.html`
- `archive/unit-past-exams.js`
- `archive/unit-past-exams-core.js`
- `archive/unit-past-exams.css`

#### 데이터·identity·metadata·business bridge

- `archive/db.js`
- `archive/question-index.js`
- `archive/question-meta.js`
- `archive/question-identity.js`
- `archive/concept_map.js`
- `archive/mixer-selector.js`
- `archive/mixer-school-fingerprint.js`
- `archive/mixer-school-fingerprint-runtime.js`

#### renderer/runtime/print

- `archive/exam-render-executor.js`
- `archive/solution-render-executor.js`
- `archive/answer-render-executor.js`
- `archive/render-authority.js`
- `archive/render-authority.css`
- `archive/layout-authority.js`
- `archive/mathjax_render_loop.js`
- `archive/print-contract.js`
- `archive/print-runtime.js`
- `archive/native_print.js`
- `archive/print_image_optimizer.js`
- `archive/print_guard.js`
- `archive/css/js-archive-theme-override.css`

#### 내부 preview/review

- `archive/internal-review-engine.html`
- `archive/internal-review-engine.js`
- `archive/internal-review-engine.css`
- `archive/internal-review-live.html`
- `archive/internal-review-live.js`
- `archive/internal-review-live.css`

#### assessment 출력/분석

- `archive/assessment/assessment-mvp.html`
- `archive/assessment/assessment-packs-1sem.generated.js`
- `archive/assessment/assessment-question-index-1sem.generated.js`
- `archive/assessment/assessment-analysis.html`
- `archive/assessment/assessment-diagnostic-report-prototype.html`

#### weakness contract

- `archive/weakness-aggregator.js`
- `archive/weakness-closed-loop.js`
- `archive/weakness-metadata-join.js`
- `archive/weakness-student-view.js`
- `archive/weakness-supplement-preset.js`

### B-4. 실제 출력 경로에서 제외한 7개

1. `archive/weakness-aggregator.js`
2. `archive/weakness-closed-loop.js`
3. `archive/weakness-metadata-join.js`
4. `archive/weakness-student-view.js`
5. `archive/weakness-supplement-preset.js`
6. `archive/print_guard.js`
7. `archive/render-authority.css`

`weakness-*`는 HTML include 및 engine URL 생성이 없고 non-operational/fixture 계약만 제공한다. `print_guard.js`는 production HTML에 include되지 않고 테스트 fixture에서만 확인된다. `render-authority.css`도 production output HTML에 link되지 않고 semantic CSS 테스트/evidence에서만 확인된다.

---

## C. Engine Entry Points

### C-1. 일반 아카이브

```text
index.html
→ openEngine()
→ qpp/mode 선택
→ goEngine()
→ engine.html?mode=...&qpp=...&data=exams/<file>&title=...
→ window.open()
→ engine.html:init()
```

근거:

- `archive/index.html:3422` 부근 `goEngine()`
- `archive/index.html:2741` 부근 `buildAssignTargetPreviewUrl()`
- `archive/engine.html:1555` 부근 `init()`
- `archive/engine.html:2168` 부근 `renderExam()` authority dispatch
- `archive/engine.html:2461` 부근 `renderSol()` authority dispatch
- `archive/engine.html:2580` 부근 `renderAns()` authority dispatch

### C-2. 일반 Mixer

```text
index.html
→ mixer.html
→ filters/cart/auto generation
→ openMixedEngine()
→ localStorage mixedQuestions_<key>
→ localStorage mixedMeta_<key>
→ mixed_engine.html?key=<key>&qpp=<qpp>
```

근거:

- `archive/index.html:1535`
- `archive/mixer.html:1810` 부근 `runAutoGenerate()`
- `archive/mixer.html:2317` 부근 `openMixedEngine()`
- `archive/mixer.html:2345` 부근 mixed URL 생성

### C-3. 단원별 기출

```text
unit-past-exams.html
→ unit-past-exams.js
→ unit-past-exams-core.js selection
→ restorePaperQuestions()
→ storeMixedPayload()
→ localStorage mixedQuestions_<snapshotKey>
→ mixed_engine.html?key=<snapshotKey>
```

근거:

- `archive/unit-past-exams-core.js:723` 부근 `selectBalancedCollectionRecords()`
- `archive/unit-past-exams-core.js:881` 부근 `selectRecords()`
- `archive/unit-past-exams-core.js:905` 부근 `selectByBlueprint()`
- `archive/unit-past-exams.js:122` 부근 `restorePaperQuestions()`
- `archive/unit-past-exams.js:195` 부근 `storeMixedPayload()`
- `archive/unit-past-exams.js:234` 부근 `buildMixedUrl()`

### C-4. Assessment pack

```text
assessment-mvp.html
→ openPack()
→ output mode/qpp selection
→ goAssessmentMixedEngine()
→ localStorage mixedQuestions_<key>
→ mixed_engine.html?key=<key>&qpp=<qpp>
```

근거:

- `archive/assessment/assessment-mvp.html:1013` 부근 `openPack()`
- `archive/assessment/assessment-mvp.html:1038` 부근 print mode modal
- `archive/assessment/assessment-mvp.html:1665` 부근 `goAssessmentMixedEngine()`
- `archive/mixed_engine.html:801` 부근 `loadAssessmentPackFallback()`

### C-5. 오답

```text
assessment-mvp.html
→ openPack(..., 'analysis')
→ assessment-analysis.html?packId=...
→ buildRows()
→ correct/wrong/unchecked 입력
→ 결과표/분석표 렌더
→ window.print()
```

확인된 오답 경로에는 `engine.html`, `mixed_engine.html`, exam renderer, solution renderer, answer renderer가 없다.

근거:

- `archive/assessment/assessment-mvp.html:1022`
- `archive/assessment/assessment-analysis.html:528` 부근 `buildRows()`
- `archive/assessment/assessment-analysis.html:592` 결과표 출력
- `archive/assessment/assessment-analysis.html:634` 분석표 출력
- `archive/assessment/assessment-analysis.html:812` 부근 `renderNeedsList()`

### C-6. 취약점

현재 production output entry point는 확인되지 않았다.

```text
weakness report/student view
→ buildSupplementPreset()
→ selectorRequests
→ selectorReplay()/runClosedLoop()
→ fixture payload/result/weakness 계산
→ engine URL: 없음
→ mixed_engine 호출: 없음
→ print: 없음
```

근거:

- `weakness-supplement-preset.js`의 `buildSupplementPreset()`과 `validatePreset()`
- `weakness-closed-loop.js`의 `runClosedLoop()`
- preset의 `candidate_non_operational`, `noDbWrite`, `noStudentExposure`
- closed-loop의 `operationalExposure: 'HOLD'`, `writes: 0`, `networkCalls: 0`, `writeMode: 'fixture_only'`

---

## D. End-to-End Flow

### D-1. 일반 archive flow

```text
사용자 출력 클릭
→ index.html: openEngine()
→ qpp/mode 선택
→ index.html: goEngine()
→ engine.html URL 생성
→ window.open()
→ engine.html: window.onload
→ restoreApmathSessionFromHash()
→ preview/screen-fit mode 판정
→ init()
→ URLSearchParams 읽기
→ data path normalize/보안 검사
→ data JS dynamic script append
→ window.questionBank/questions/problems 읽기
→ mergeArchiveQuestionMetadata()
→ APRenderAuthority.normalizeArchiveQuestions()
→ render()
→ APRenderLoop.start()
→ renderBody()
→ waitForMathJaxOrContinue()
→ exam/solution/answer mode 분기
→ executor 또는 legacy renderer
→ staging/image/MathJax/height measurement
→ page/column materialization
→ image readiness
→ QR/header/side effect 처리
→ __AP_RENDER_READY__ resolve
→ safePrint()
→ window.print() 또는 APNativePrint/native/GDI
```

### D-2. mixed flow

```text
Mixer/단원별/assessment source selection
→ source-specific business assembly
→ mixedQuestions_<key>, mixedMeta_<key> 저장
→ mixed_engine.html URL 생성
→ mixed_engine:init()
→ localStorage 또는 pack fallback 로딩
→ metadata merge
→ APRenderAuthority.normalizeMixedQuestions()
→ inline renderExam/renderSol/renderAns
→ own staging/pagination/solution placement
→ MathJax/image readiness
→ QR/header
→ __AP_RENDER_READY__ resolve
→ own safePrint()
→ window.print() 또는 native/GDI
```

### D-3. 오답 report flow

```text
assessment pack
→ analysis page
→ buildRows()
→ student answer/status 입력
→ renderOverallSummary()
→ renderAggregateTable()
→ renderRawAnalysisTable()
→ renderNeedsList()
→ browser window.print()
```

### D-4. weakness candidate flow

```text
weakness report
→ target dimensions
→ selector request allocation
→ fixture selector replay
→ mixed payload/blueprint/result/join/weakness calculation
→ operational output: 미연결
```

---

## E. Engine Structure Table

| 항목 | 일반 archive | 믹서/혼합 | 오답 결과표 | 취약점 기반 |
|---|---|---|---|---|
| 사용자 진입점 | `index.html → openEngine → goEngine` | `mixer.html`, `unit-past-exams.js`, `assessment-mvp.html` | `assessment-mvp → assessment-analysis` | production entry 없음 |
| 최초 호출 함수 | `window.onload → init()` | `window.onload → init()` | `renderApp()` | library function |
| 데이터 원본 | `data=exams/<file>` | `mixedQuestions_<key>` 또는 pack | generated pack + localStorage result | weakness report/student view |
| 데이터 변환 | metadata merge + `normalizeArchiveQuestions()` | metadata merge + `normalizeMixedQuestions()` | `buildRows()` | score/join/preset/fixture |
| 엔진 HTML | `archive/engine.html` | `archive/mixed_engine.html` | `assessment-analysis.html` | NONE |
| runtime | direct render; Fast ref는 screen runtime | direct render | browser DOM only | NONE |
| adapter | 현재 없음; Fast ref `screen-runtime-adapter.js` | 없음 | NONE | NONE |
| exam renderer | `APExamRenderExecutor`, legacy fallback | inline `renderExam()` | NONE | NONE |
| solution renderer | `APSolutionRenderExecutor`, legacy fallback | inline `renderSol()` | NONE | NONE |
| answer renderer | `APAnswerRenderExecutor`, legacy fallback | inline `renderAns()` | NONE | NONE |
| layout planner | executor/local algorithm + optional authority dual-run | own staging/profile/slot algorithm | CSS print flow | NONE |
| layout materializer | 현재 NONE; Fast ref `layout-materializer.js` | NONE | NONE | NONE |
| MathJax | shared loop + inline wrapper | shared loop + duplicate wrapper | NONE | NONE |
| image readiness | own wait + shared summarizer | own duplicate wait + shared summarizer | NONE | NONE |
| snapshot/cache | render snapshot 없음 | source payload localStorage만 있음 | NONE | NONE |
| prewarm | 현재 없음; Fast ref에 있음 | 없음 | NONE | NONE |
| QR | `QRious`, `solQr`, `submitQr` | mixed target QR | NONE | NONE |
| header | `printHeaderOptions` | `printHeaderOptions` | HTML report header | metadata only |
| QPP | query/AppState, default 4 | query/meta, 4/6/8 | NONE | print QPP 없음 |
| print readiness | `__AP_RENDER_READY__` + tracker | `__AP_RENDER_READY__` + tracker | NONE | NONE |
| 실제 인쇄 | `safePrint()` → vector/raster/native/GDI | own `safePrint()` → same transports | `window.print()` | NONE |
| side effect | blueprint/class assignment async | mixed blueprint/class assignment async | localStorage only | fixture-only, writes 0 |
| legacy fallback | authority query/executor missing fallback | inline renderer 자체 | NONE | NONE |

---

## F. Shared vs Duplicate Matrix

표기:

- `SA`: SHARED_ALREADY
- `DE`: DUPLICATED_EQUIVALENT
- `ES`: ENGINE_SPECIFIC
- `U`: UNKNOWN
- `NONE`: 구현 없음

| 기능 | 일반 | 믹서 | 오답 | 취약점 |
|---|---|---|---|---|
| 시험지 데이터 로딩 | DE | ES | ES | ES |
| question normalization | SA: `normalizeArchiveQuestions()` | SA: `normalizeMixedQuestions()` | ES: `buildRows()` | ES: weakness contracts |
| mode 전환 | DE | DE | NONE | NONE |
| exam renderer | SA: executor | DE: inline renderer | NONE | NONE |
| solution renderer | SA: executor | DE: inline renderer | NONE | NONE |
| answer renderer | SA: executor | DE: inline renderer | NONE | NONE |
| MathJax loop | SA helper + DE wrapper | SA helper + DE wrapper | NONE | NONE |
| image readiness | DE | DE | NONE | NONE |
| SVG/solution image | DE | DE | NONE | provenance only |
| page-height measurement | DE | DE | NONE | NONE |
| QPP | DE | DE | NONE | selection count만 ES |
| pagination | DE | DE | NONE | NONE |
| continuation | DE | DE | NONE | NONE |
| solution placement | DE | DE | NONE | NONE |
| header | DE | DE | report-specific ES | NONE |
| QR | DE | DE | NONE | NONE |
| print readiness | DE | DE | NONE | NONE |
| print transport | DE caller, SA transport helper | DE caller, SA transport helper | browser only | NONE |
| snapshot/cache | 현재 NONE; Fast ref SA | NONE | NONE | NONE |
| prewarm | 현재 NONE; Fast ref SA | NONE | NONE | NONE |
| stale/latest-wins | 현재 NONE; Fast ref SA | NONE | NONE | NONE |
| render cancellation | NONE | NONE | NONE | NONE |
| layout authority | SA contract, DE production bridge | SA contract, DE production bridge | NONE | NONE |
| layout materializer | 현재 NONE; Fast ref SA | NONE | NONE | NONE |
| print preflight | DE | DE | NONE | NONE |
| screen fit/scale | DE | DE | CSS only | NONE |
| legacy fallback | DE | DE/inline legacy-compatible | NONE | NONE |

`DUPLICATED_EQUIVALENT`는 이름이 유사하다는 의미가 아니다. 일반과 믹서의 exam/solution/answer/print 기능에 대해 입력, DOM 출력, MathJax, image readiness, height measurement, pagination, continuation, print transport를 실제로 비교한 결과다.

---

## G. Business Logic Boundary

### G-1. Mixer 고유 business logic

- source exam pool 구성
- course/unit/level/type/tag filter
- cart 및 pinned item
- auto generation 난이도 계획
- blueprint 기반 selection
- duplicate prevention
- source file/source question no/source UID 보존
- order mode(high-first/low-first)
- mixed key 생성
- `mixedQuestions_<key>`/`mixedMeta_<key>` 저장
- school fingerprint
- class/teacher assignment target

### G-2. 단원별 기출 고유 business logic

- grade/course/unit profile
- legacy unit key mapping
- source file candidate resolution
- school/semester/exam type normalization
- subunit/difficulty filter
- collection scope
- balanced selection
- blueprint selection
- snapshot key
- source JS lazy loading
- selected record의 원본 문항 복원

### G-3. 오답 고유 business logic

- correct/wrong/unchecked status
- student answer/note
- unit/type/level grouping
- wrong needs list
- diagnostic result localStorage
- result report rendering

현재 이 데이터가 시험지 renderer에 전달되는 호출은 확인되지 않았다.

### G-4. 취약점 고유 business logic

- weakness dimension grouping
- weakness score
- recency/repeated failure/recovery factor
- metadata join
- target priority
- selector request allocation
- recent question UID avoidance
- max template constraint
- closed-loop fixture reconstruction

다음은 business logic이 아니라 공통 Render/Print Infrastructure다.

- question HTML
- choice layout
- MathJax
- image readiness
- page height
- column/page pagination
- solution continuation
- QR/header
- print preflight
- actual print transport

---

## H. Fast Engine v2 비교

### H-1. Fast 기준 일반 엔진 추가 계층

Fast 기준 `archive/engine.html`에는 다음이 include된다.

```text
layout-materializer.js
render-state-normalizer.js
side-effect-ledger.js
screen-runtime.js
snapshot-contract.js
screen-runtime-adapter.js
```

### H-2. Fast 계층별 역할

#### `render-state-normalizer.js`

- 허용 render field projection
- immutable deep copy
- canonical render data
- candidate schema
- semantic digest
- snapshot key

#### `screen-runtime.js`

- render intent queue
- request generation
- active request abort
- latest-wins
- pending session
- build/validate/capture/attach/commit/rollback
- mode snapshot
- cache hit/miss
- prewarm
- stale request discard
- cleanup

#### `screen-runtime-adapter.js`

- URL/state를 candidate로 변환
- source load
- canonical data 구성
- hidden build root 생성
- readiness tracker
- executor dependency injection
- capture/commit/rollback
- post-commit effects

#### `snapshot-contract.js`

- root ownership
- session/source binding
- MathJax completion
- font readiness
- image completion
- overflow geometry
- page count
- readiness evidence
- fingerprint parity
- print preflight

#### `side-effect-ledger.js`

- pre-commit external effect 금지
- post-commit only
- logical effect idempotency
- retryable failure
- duplicate effect 방지

#### `layout-materializer.js`

- planner result를 실제 page/column DOM으로 materialize
- exam layout
- solution continuation
- layout authority 결합

### H-3. 현재 일반 엔진 vs Fast 기준

| 영역 | 현재 | Fast 기준 |
|---|---|---|
| state | `AppState` 직접 mutate | candidate/state normalizer |
| render start | 직접 `render()` | `screenRuntime.request()` |
| concurrent request | `modeSwitchPending` 정도 | generation + abort + latest-wins |
| DOM build | visible print area 중심 | hidden build root → validate → attach |
| snapshot | 없음 | mode snapshot/cache |
| prewarm | 없음 | idle prewarm |
| rollback | 직접 rollback 계층 없음 | capture/attach/commit/rollback |
| side effect | render 후 비동기 직접 호출 | post-commit ledger |
| layout | executor/local algorithm | layout authority/materializer |
| print stale check | render promise 중심 | active snapshot preflight |

### H-4. Mixer vs Fast 기준

Fast reference branch에서도 `mixed_engine.html`에는 일반 엔진의 screen runtime adapter가 없다. 따라서 Mixer는 현재와 Fast reference 양쪽 모두 다음을 유지한다.

- inline `renderExam()`
- inline `renderSol()`
- inline `renderAns()`
- inline pagination
- inline solution continuation
- inline print preflight
- inline side effect call

---

## I. Commonization Candidates

다음은 통합 결론이 아니라 구조 검토 대상이다.

### I-1. Source adapter와 common runtime

가능한 경계:

```text
ArchiveSourceAdapter
MixerSourceAdapter
Clinic/WrongSourceAdapter
        ↓
common candidate/render state
        ↓
common screen runtime
        ↓
common executor/layout materializer
        ↓
common print preflight/transport
```

### I-2. Exam/Solution/Answer executor

일반 엔진에는 이미 다음 executor가 있다.

- `exam-render-executor.js`
- `solution-render-executor.js`
- `answer-render-executor.js`

Mixer의 inline renderer를 동일 executor contract로 넘길 수 있는지 검토 후보다.

### I-3. Image readiness 공통화

현재 일반과 믹서 양쪽에 다음이 반복된다.

- `image.complete`
- `naturalWidth`
- `image.decode()`
- timeout
- readiness summary

### I-4. Print preflight 공통화

현재 양쪽 `safePrint()`에 다음이 반복된다.

- render outcome wait
- font wait
- image wait
- MathJax recovery
- vector/raster/native/GDI branch
- metrics
- cleanup
- `afterprint` fallback

### I-5. Header/QR policy 공통화

- `printHeaderOptions`
- title/meta/subtitle
- name/score line
- solution/answer 적용 여부
- solution QR
- submit QR
- last-page injection

### I-6. Side-effect ledger

현재 일반/믹서 모두 render correctness와 다음 external effect가 인접해 있다.

```text
registerBlueprintToOS()
registerClassExamAssignmentToOS()
```

Fast 기준의 ledger처럼 post-commit/idempotent effect로 분리 가능한지 검토 후보다.

### I-7. ENGINE_SPECIFIC_KEEP_CANDIDATE

- Mixer selection/filter/cart/blueprint logic
- unit past exam collection/selection
- assessment pack selection
- source identity restoration
- wrong status/result analysis
- weakness score/recovery aggregation
- weakness target allocation
- fixture/provenance validation

---

## J. Unknown / Risk Areas

### J-1. Mixer의 Fast runtime 편입

`print-contract.js`에는 `MIXED_STORAGE`, `MIXED_PACK` source kind가 정의되어 있지만, Fast `screen-runtime-adapter.js`는 일반 archive source adapter다. mixed localStorage payload, assessment fallback, `MIXED:<key>` identity, blueprint effect, source request identity가 Fast candidate contract로 완전히 표현되는지는 확정되지 않았다.

분류: `UNKNOWN`, `NEEDS_ARCHITECTURE_REVIEW`

### J-2. Canonical data와 actual render data

현재 일반/믹서는 canonical data를 만들어 dual-run/semantic comparison에 사용하지만, actual renderer에는 raw `AppState.data`가 전달된다. `renderAuthorityDualRun=1`이 아니면 canonical witness 비교가 실행되지 않는다.

분류: `UNKNOWN`

### J-3. Mixed dual-run의 의미

Mixed dual-run은 query parameter가 있을 때만 실행된다. 따라서 inline renderer와 shared authority renderer가 production default에서 항상 동등하다고 판정할 수 없다.

분류: `UNKNOWN`

### J-4. Legacy fallback 경계

일반은 authority query와 executor missing fallback이 명시되어 있다. Mixer는 inline renderer가 primary이며, 이것을 legacy fallback으로 부를지 독립 production engine으로 부를지는 architecture naming 문제로 남는다.

분류: `UNKNOWN`

### J-5. MathJax timeout 후 진행

`waitForMathJaxOrContinue()`는 MathJax가 지연되면 warning 후 렌더를 계속한다. Fast snapshot contract의 `MATH_TYPESET_INCOMPLETE` gate와 현재 timeout-tolerant behavior가 같은 readiness 의미인지 추가 검토가 필요하다.

### J-6. Side effect timing

현재 blueprint/class assignment 등록은 render transaction과 분리된 ledger 없이 render 마지막에서 비동기로 호출된다. Fast reference의 post-commit ledger와 Mixer의 mixed assignment effect를 동일 contract로 취급할 수 있는지 미확정이다.

### J-7. Source cache와 render snapshot 혼동

- `engine.html` sessionStorage: 최근 launch URL 복구
- `mixed_engine.html` localStorage: mixed source payload 저장
- Fast snapshot contract: rendered DOM/geometry/assets/math/font/readiness/fingerprint 저장

세 가지는 서로 다른 개념이다.

### J-8. 오답 시험지 경로 부재

현재 wrong status를 `engine.html` data URL 또는 `mixedQuestions_<key>`로 변환하는 함수는 확인되지 않았다. 오답 시험지를 추가하려면 별도 source adapter와 source identity contract가 필요하다.

### J-9. 취약점 operational gap

취약점 preset에는 `canonicalUidRequired`, `dedupeAcrossRequestsBy: questionUid`, `approvedMetadataOnly`가 있지만 실제 output transport가 없다. operationalization 시 source adapter, render identity, student/teacher exposure, assignment/QR policy를 새로 정해야 한다.

---

## K. 다음 Architecture Review 질문

1. Mixer는 문항 선택과 source identity 보존까지만 담당하고 Fast runtime으로 넘길 수 있는가?
2. `MIXED_STORAGE`와 `MIXED_PACK`을 실제 Fast source adapter가 처리할 수 있는가?
3. 일반 archive와 Mixer의 `sourceRef`를 같은 canonical contract로 표현할 수 있는가?
4. `MIXED:<key>`를 render snapshot key와 어떻게 분리할 것인가?
5. mixed localStorage payload의 source request identity는 무엇인가?
6. Mixer inline exam/solution/answer renderer를 shared executor로 대체할 수 있는가?
7. `subjective-2up`, `subjective-4up`, `fullwidth` layout behavior를 common materializer가 보존하는가?
8. 단원별 selection count와 print QPP를 어떤 contract로 분리할 것인가?
9. 오답 시험지의 source identity는 원본 archive reference인가, synthetic mixed source인가?
10. 오답 solution/answer는 원본 문항의 값을 그대로 재사용할 수 있는가?
11. 오답 출력에도 QR/assignment policy가 필요한가?
12. weakness preset을 실제 mixed payload로 승격하는 approval gate는 무엇인가?
13. fixture-only identity와 production assessment result identity를 같은 contract로 사용할 수 있는가?
14. `renderAuthorityDualRun`은 migration evidence인가 production correctness gate인가?
15. legacy renderer는 rollback 용도인가, compatibility fallback인가?
16. 일반 Fast runtime과 Mixer legacy inline runtime을 당분간 별도 운영할 것인가?

---

## 최종 조사 판정

```text
INVESTIGATION RESULT: PASS
FILES MODIFIED BY INVESTIGATION: 0
COMMITS BEFORE REPORT COMMIT: 0
PUSH/MERGE BEFORE REPORT COMMIT: NONE
NEXT STEP: Architecture Review
```
