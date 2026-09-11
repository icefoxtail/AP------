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

기존 조사에서 `archive/**`만 검색한 결과 실제 시험지 렌더/인쇄 엔진을 두 개로 판정했으나, 저장소 전체 보완 조사 결과 실제 QUESTION_PAPER_ENGINE은 세 개다. `archive/engine.html`은 일반 아카이브, `archive/mixed_engine.html`은 Mixer/단원별/assessment 및 일부 clinic worksheet, `apmath/wrong_print_engine.html`은 학생별·반별·학년별·유형별 오답 클리닉 시험지/해설지/정답표를 담당한다.

일반 엔진은 `render-authority.js`, `layout-authority.js`, `print-contract.js`, `print-runtime.js`, `mathjax_render_loop.js`, exam/solution/answer executor와 부분적으로 공통화되어 있다. 그러나 현재 일반 엔진은 Fast Engine v2의 `screen-runtime`, snapshot, latest-wins, prewarm, side-effect ledger 계층을 사용하지 않고 직접 `render()` 트랜잭션을 수행한다.

Fast Engine v2 reference branch는 일반 `engine.html`에만 `render-state-normalizer.js`, `screen-runtime.js`, `screen-runtime-adapter.js`, `snapshot-contract.js`, `side-effect-ledger.js`, `layout-materializer.js`를 연결한다. 이 계층은 request generation, abort, latest-wins, render snapshot, cache, prewarm, commit/rollback, post-commit side effect, print snapshot preflight를 담당한다.

`mixed_engine.html`은 현재에도 exam/solution/answer renderer와 pagination을 HTML inline code로 보유한다. Fast Engine v2 reference branch에서도 mixed engine에는 일반 엔진의 screen runtime adapter가 연결되지 않았다. 따라서 “전체 출력 경로가 Fast Engine v2를 사용한다”고 볼 수 없다.

일반 엔진의 시험지/해설/정답 executor는 이미 별도 파일로 분리되어 있으므로 renderer primitive 수준에서는 공통화가 진행되어 있다. 반면 믹서는 같은 입력/출력/역할을 수행하는 inline renderer와 print preflight를 별도로 보유하므로 `DUPLICATED_EQUIVALENT`로 분류된다.

오답 기능에는 별도의 실제 시험지 renderer가 존재한다. `apmath/js/clinic-print.js`가 payload를 조립하고, 임시 출력은 `wrong_print_engine.html`과 `AP_CLINIC_PRINT_PAYLOAD` storage를 사용한다. 저장형 출력은 `wrong-clinics` API가 `public_set_key`와 `engine_url`을 반환하며, 학생 포털과 학생 상세 화면도 `wrong_print_engine.html?packet=...`를 직접 연다. `assessment-analysis.html`의 결과표/분석표 출력은 오답 클리닉 시험지와 별도의 REPORT_PRINT 경로다.

취약점 모듈은 weakness score, metadata join, supplement preset, closed-loop fixture를 계산하지만 실제 `engine.html`/`mixed_engine.html` URL을 만들지 않는다. `candidate_non_operational`, `readOnly`, `noDbWrite`, `noStudentExposure`, `operationalExposure: HOLD`, `writes: 0`, `networkCalls: 0`이 코드상 명시되어 있다.

따라서 현재 구조는 다음과 같이 보는 것이 코드상 가장 정확하다.

```text
일반 archive 시험지/해설/정답 출력: ACTIVE, Fast Engine v2 부분 공유
Mixer/혼합/단원별/assessment 시험지 출력: ACTIVE, 별도 inline renderer
오답 클리닉 시험지/해설지/정답표: ACTIVE, 별도 QUESTION_PAPER_ENGINE
오답 결과표/분석표 출력: ACTIVE, 별도 REPORT_PRINT
취약점 기반 보충시험 출력: NON_OPERATIONAL CANDIDATE
```

---

## B. Inventory

> 기존 이 절의 숫자 45/38/7은 `archive/**`에 한정한 1차 조사 denominator다. 저장소 전체 보완 조사 denominator와 엔진 수는 이 보고서의 `L. 보완 조사 Addendum`에서 갱신한다.

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

### C-5. 오답 결과표/분석표 — 1차 조사에서 확인한 부분

```text
assessment-mvp.html
→ openPack(..., 'analysis')
→ assessment-analysis.html?packId=...
→ buildRows()
→ correct/wrong/unchecked 입력
→ 결과표/분석표 렌더
→ window.print()
```

이 절은 `assessment-analysis.html`의 결과표/분석표 경로만 조사한 1차 결과였다. 저장소 전체 보완 조사에서 별도의 `apmath/wrong_print_engine.html` QUESTION_PAPER_ENGINE과 `clinic-print.js` 호출 경로가 추가로 확인되었다. 따라서 아래 1차 절의 “오답 renderer 없음” 결론은 폐기하고 Addendum의 corrected flow를 기준으로 한다.

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

### J-8. 오답 시험지 경로 — 1차 조사 누락

저장소 전체 보완 조사에서 다음 실제 경로가 확인되었다.

```text
apmath/index.html
→ apmath/js/clinic-print.js
→ clinicPrintBuildPayload()
→ clinicPrintOpenEngine()
→ wrong_print_engine.html
```

또는:

```text
clinicPrintSaveAndOpen()
→ POST wrong-clinics
→ public_set_key / print.engine_url
→ wrong_print_engine.html?set=...
```

학생 경로도 별도로 존재한다.

```text
apmath/js/student.js
→ wrong_print_engine.html?packet=...&mode=review

apmath/student/index.html
→ wrong_print_engine.html?packet=...&mode=exam|sol&fit=screen
```

따라서 1차 보고서의 “오답 시험지 renderer 없음”은 `CORRECTED`다.

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

---

## L. 보완 조사 Addendum — 저장소 전체 기준

### L-1. 보완 조사 범위와 검색 방법

기존 조사 브랜치와 기존 보고서를 기준으로 저장소 전체를 다시 검색했다.

검색 대상:

- `archive/**`
- `apmath/**`
- `eie/**`
- `check/**`
- `manual/**`
- root HTML/JS
- `apmath/worker-backup/worker/**`의 실제 payload/API route

검색 문자열:

```text
window.print
safePrint
print_engine
print-engine
engine.html
mixed_engine
wrong_print_engine
preview=1
window.open
iframe
print-area
MathJax
qpp
renderExam
renderSol
renderAns
AP_CLINIC_PRINT_PAYLOAD
mixedQuestions_
public_set_key
engine_url
clinic-print
wrong-clinic
reportCenter.*Print
printAttendanceLedgerReport
printTimetableReport
billingDocumentOpenPrint
printGradeReport
printStudents
```

다음은 검색에서 제외했다.

- `docs/**`: 문서/계획/evidence
- `tests/**`: 테스트와 fixture
- `reports/**`: 생성 report/evidence
- `archive/assets/**`, `archive/vendor/**`: asset/vendor
- `archive/tools/**`, `tools/**`: tooling
- `alive/**`: pipeline/evidence 문서 및 도구
- `node_modules/**`

이렇게 제한한 production source/config 검색 결과는 45개 파일이다. 이 수치는 “엔진 파일 수”가 아니라 출력 관련 token/call 관계가 있는 production source/config inventory다. 한 파일이 question-paper, preview, report print, business assembly를 동시에 지원할 수 있으므로 아래 카테고리 수와 합산하지 않는다.

### L-2. 저장소 전체 Inventory denominator

| 구분 | 조사 결과 |
|---|---:|
| 저장소 전체 production source/config 검색 hit | 45 files |
| 실제 QUESTION_PAPER_ENGINE HTML | 3 |
| REPORT_PRINT source modules | 11 |
| PREVIEW/INTERNAL_REVIEW 경로 | 6 route families |
| NON_OPERATIONAL weakness candidate modules | 5 |
| 별도 engine이 아닌 지원/호출/API source | 20+ |
| production code 수정 | 0 |

`REPORT_PRINT source modules = 11`은 source module 기준이다. `report-center.js` 내부에 여러 print view/function이 있으므로 function-level route family는 16개로 세분된다. 이 둘을 중복 합산하지 않았다.

### L-3. QUESTION_PAPER_ENGINE 확정 수

최종 QUESTION_PAPER_ENGINE_COUNT는 **3**이다.

| 엔진 | 역할 | 상태 |
|---|---|---|
| `archive/engine.html` | 일반 archive 시험지/해설지/정답표 | ACTIVE |
| `archive/mixed_engine.html` | Mixer/혼합/단원별/assessment 및 일부 clinic worksheet | ACTIVE |
| `apmath/wrong_print_engine.html` | 학생별/반별/학년별/유형별 오답 클리닉 시험지/해설지/정답표 | ACTIVE |

추가 검색에서 다음은 별도 QUESTION_PAPER_ENGINE이 아닌 기존 엔진의 호출자/adapter로 분류했다.

- `apmath/js/core.js`: clinic basket을 `archive/mixed_engine.html`로 보내는 source assembly
- `apmath/worker-backup/worker/routes/exam-pdf.js`: archive/mixed engine을 headless browser로 열어 PDF를 만드는 transport
- `check/check.js`: `archive/engine.html` 또는 `archive/mixed_engine.html` URL을 생성하는 answer/check flow
- `apmath/student/index.html`: archive/mixed/wrong 중 기존 엔진을 선택하는 student portal entry
- `archive/internal-review-engine.js`, `archive/internal-review-live.js`: `engine.html` preview를 사용하는 review UI

### L-4. REPORT_PRINT 확정 수

최종 REPORT_PRINT_COUNT는 **11 source modules**로 기록한다.

| Source module | 실제 report print 역할 |
|---|---|
| `archive/assessment/assessment-analysis.html` | 평가 결과표/분석표 `window.print()` |
| `archive/assessment/assessment-diagnostic-report-prototype.html` | 진단평가 report prototype print |
| `apmath/js/report-print.js` | AP Math 평가 리포트 clean PDF popup + MathJax + print |
| `apmath/js/report-center.js` | text/exam-analysis/batch/school-detail/premium report print view |
| `apmath/js/cumulative.js` | 출석부/누적 출결 report popup print |
| `apmath/js/timetable.js` | 시간표 report popup print |
| `apmath/js/management.js` | 납부확인서 billing document print |
| `eie/js/views/eie-attendance.js` | EIE 출결표 print |
| `eie/js/views/eie-students.js` | 학생 명단 및 grade report print |
| `eie/js/views/eie-timetable.js` | EIE 시간표 print |
| `eie/js/views/eie-timetable-editor.js` | 시간표 편집 결과 print |

이들은 question-paper engine이 아니다. 일부 report는 문항 원문/선택지/정답/해설 요약을 포함할 수 있지만, archive/mixer/clinic처럼 source question을 bank에서 복원하고 exam/solution/answer packet을 composition하는 엔진은 아니다.

`report-center.js`의 function-level print route는 다음처럼 세분된다.

- text report popup
- exam analysis print view
- batch report print view
- school exam detailed parent report
- premium exam report popup/portal

따라서 source-module 기준 11, function-route 기준 16으로 관리한다.

### L-5. PREVIEW/INTERNAL_REVIEW 확정

별도 question-paper engine이 추가로 발견된 것은 아니다. 확인된 preview/review route family는 다음과 같다.

1. `archive/index.html` assignment target preview → `engine.html?preview=1`
2. `archive/index.html` unit-past assignment preview → `mixed_engine.html?key=...`
3. `unit-past-exams.js` generated paper preview → `mixed_engine.html` iframe
4. `apmath/js/clinic-print.js` clinic preview → `wrong_print_engine.html?preview=1`
5. `archive/internal-review-engine.js` → `engine.html` live preview iframe
6. `archive/internal-review-live.js` → `engine.html` live preview iframe

이 중 1~4는 production preview, 5~6은 INTERNAL_REVIEW다. 엔진 수 denominator에는 중복하여 더하지 않았다.

---

## M. `apmath/js/clinic-print.js` E2E 조사

### M-1. 사용자 진입

`apmath/index.html:1010`에서 다음 script가 production AP Math OS에 로드된다.

```html
<script defer src="js/clinic-print.js"></script>
```

반 화면의 classroom UI에서도 `openClinicPrintCenter()`를 호출한다.

- `apmath/js/classroom.js:1573`
- `apmath/js/clinic-print.js:1650` 부근 `openClinicCenter()`
- `apmath/js/clinic-print.js:1667` 부근 `openClinicClassPicker()`
- `apmath/js/clinic-print.js:1771` 부근 `openClinicPrintCenter()`

모드 UI는 실제로 다음을 제공한다.

- 학생별 오답
- 반별 공통 오답
- 학년별 공통 오답
- 유형별 오답
- 유형별 최다빈출
- 유형별 최다오답
- 유형별 단원 선택

### M-2. Business aggregation

#### 학생별

`clinicPrintBuildStudentWrongItems()` (`clinic-print.js:594`)는 다음을 수행한다.

- selected exam keys
- selected student IDs
- class students
- exam sessions
- wrong answer IDs
- exam blueprint source identity
- source archive file/question no
- unit/course/concept metadata
- source-level dedupe

#### 학년별

`clinicPrintBuildGradeWrongSource()` (`clinic-print.js:671`)는:

- 같은 grade class 목록
- class별 latest session
- 학생별 wrong items
- grade cohort counts
- source-level dedupe

를 만든다.

#### 반별 공통 오답

`clinicPrintBuildClassWrongItems()` (`clinic-print.js:740`)는:

- 동일 source question aggregation
- wrong student list
- total cohort count
- wrong count
- correct rate
- unit/course/cluster metadata

를 만든다.

#### 전체 payload

`clinicPrintBuildPayload()` (`clinic-print.js:797`)는 다음 구조를 만든다.

```text
version
mode: student | class | grade | type
printTitle
classId/className/gradeName
range
options
headerOptions
exams
students
classWrongItems
gradeWrongItems
createdAt/createdDate
```

주요 output option:

- `groupByStudent`
- `groupByExam`
- `dedupeByQuestion`
- `showWrongStudents`
- `pageBreakByStudent`
- `includeAnswer`
- `includeSolution`
- `includeHomeworkCheckBox`

이 항목들은 오답 클리닉 business logic이며, renderer infrastructure와 분리해야 한다.

### M-3. 임시 출력 연결

`clinicPrintOpenEngine()` (`clinic-print.js:861`)는 다음을 수행한다.

```text
payload
→ JSON.stringify
→ sessionStorage['AP_CLINIC_PRINT_PAYLOAD']
→ localStorage['AP_CLINIC_PRINT_PAYLOAD']
→ new URL('wrong_print_engine.html', window.location.href)
→ window.open(engineUrl, '_blank', 'noopener')
```

실제 연결 증거:

```text
clinic-print.js:864  sessionStorage.setItem('AP_CLINIC_PRINT_PAYLOAD', payloadJson)
clinic-print.js:865  localStorage.setItem('AP_CLINIC_PRINT_PAYLOAD', payloadJson)
clinic-print.js:871  new URL('wrong_print_engine.html', window.location.href)
clinic-print.js:872  window.open(engineUrl, '_blank', 'noopener')
```

### M-4. 저장형 출력 연결

`clinicPrintSaveAndOpen()` (`clinic-print.js:916`)는 `api.post('wrong-clinics', ...)`를 호출한다.

payload:

```text
title
mode
source.scope_type
source.class_id
source.class_name
source.grade
targets
payload
```

API 성공 결과에서:

```text
result.public_set_key
result.print.engine_url
```

을 읽는다.

fallback URL:

```text
wrong_print_engine.html?set=<public_set_key>
```

근거:

- `clinic-print.js:919` `api.post('wrong-clinics', ...)`
- `clinic-print.js:931` success/public key 검증
- `clinic-print.js:934` `result.print.engine_url || wrong_print_engine.html?set=...`

### M-5. Preview iframe 연결

`openClinicPrintCenter()`가 만드는 UI에는 다음 iframe이 있다.

```html
<iframe id="clinic-print-preview-frame"
        title="출력 미리보기"
        src="wrong_print_engine.html?preview=1"></iframe>
```

근거:

- `clinic-print.js:1928`
- `clinic-print.js:989` 부근 `clinicPrintPushPreview()`
- `clinic-print.js:1004` parent message payload
- `clinic-print.js:2434` 부근 wrong engine의 `installPreviewMessageChannel()`

preview는 URL/storage의 stale payload를 먼저 렌더하지 않고, parent의 `AP_PRINT_PREVIEW` 또는 `AP_CLINIC_PREVIEW` message를 source authority로 사용한다.

---

## N. `apmath/wrong_print_engine.html` E2E 조사

### N-1. Source loading

지원 source:

```text
?packet=<packet_key>
?set=<public_set_key>
?wp=<packed QR payload>
sessionStorage['AP_CLINIC_PRINT_PAYLOAD']
localStorage['AP_CLINIC_PRINT_PAYLOAD']
preview parent message
```

근거:

- `wrong_print_engine.html:2463` 부근 `loadPayloadFromUrl()`
- `wrong_print_engine.html:2477` 부근 `loadWrongClinicPayloadFromServer()`
- `wrong_print_engine.html:2487` 부근 `loadPayloadFromUrlOrStorage()`
- `wrong_print_engine.html:2505` 부근 `boot()`
- `wrong_print_engine.html:2434` 부근 preview message channel

저장형 server source:

```text
GET https://ap-math-os-v2612.js-pdf.workers.dev/api/wrong-clinics/set/<key>
GET https://ap-math-os-v2612.js-pdf.workers.dev/api/wrong-clinics/packet/<key>
```

### N-2. Data normalize와 문항 복원

1. payload에서 `sourceArchiveFile` 또는 `archiveFile` 수집
2. `normalizeArchiveFile()`로 source path 정규화
3. 원본 archive JS를 `fetch()`로 로드
4. `extractQuestionBank()`가 sandbox `new Function()`으로 `questionBank` 추출
5. `normalizeQuestionBank()`가 array/questions/items/data를 수용
6. `findQuestionInBank()`가 source question no/originalId/questionId/id를 순서대로 검색
7. `cloneQuestionForRender()`가 output question no와 source identity를 보존

근거:

- `wrong_print_engine.html:645` 부근 `fetchArchiveText()`
- `wrong_print_engine.html:674` 부근 `normalizeQuestionBank()`
- `wrong_print_engine.html:699` 부근 `findQuestionInBank()`
- `wrong_print_engine.html:1111` 부근 `cloneQuestionForRender()`
- `wrong_print_engine.html:1360` 부근 `loadAllQuestionBanks()`

### N-3. Exam render

오답 엔진은 일반 archive executor를 로드하지 않는다. 대신 `renderMeasuredExamPages()` (`wrong_print_engine.html:1393`)가 자체적으로 다음을 수행한다.

- staging에 q-box 생성
- content/choice/image/wrong note 삽입
- image size 측정
- MathJax typeset
- raw/tight proxy height 측정
- `layoutTag`, `wide`, `subjective-2up`, `subjective-4up`, `fullwidth` 분류
- normal/special/wide block pagination
- page/column DOM 생성
- overflow auto compress
- 마지막 exam page에 solution QR 삽입

모드별 exam composition:

- `renderStudentPages()` (`:1556`)
- `renderClassPages()` (`:1603`)
- `renderGradePages()` (`:1671`)
- `renderTypePages()` (`:1763`)

### N-4. Solution render

`placeSolutionItems()` (`wrong_print_engine.html:1858`)가 별도로 구현되어 있다.

- 2-column solution page
- question reminder/content
- answer
- solution image
- solution HTML
- `makeSolutionHtmlChunks()`
- `makeLongSolutionShell()`
- column overflow 검사
- solution split continuation
- auto compression
- MathJax 재typeset

`renderSol()` (`:1985`)는 type/class/grade/student mode별 source items를 조립하고 `placeSolutionItems()`에 넘긴다.

### N-5. Answer render

`collectAnswerRows()` (`:2040`)와 `renderAnswerRows()` (`:2058`)가 정답표를 자체 구현한다.

- 40문항 page chunk
- 4문항 group-end
- 2-column answer grid
- student/class/grade/type mode별 source list
- sourceRef 보존

`renderAns()`는 student별 answer pages 또는 aggregate answer rows를 만든다.

### N-6. MathJax

오답 엔진은 일반 archive의 `mathjax_render_loop.js`를 로드하지 않는다.

대신:

- HTML head의 local MathJax + CDN fallback setup
- `MathJax.typesetPromise()` 직접 호출
- `waitForMathJaxOrContinue()` inline 구현
- staging/page/solution column별 개별 typeset

근거:

- `wrong_print_engine.html:8~26`
- `wrong_print_engine.html:2266` 부근 `waitForMathJaxOrContinue()`
- `wrong_print_engine.html:1406`, `1534`, `1923`, `2320`

### N-7. Image readiness

`waitForQuestionImage()`과 `waitForClinicPrintImages()`가 자체 구현되어 있다.

- `complete`
- `naturalWidth`
- load/error event
- timeout
- `decode()`
- `APPrintRuntime.summarizeImageReadiness()`가 존재하면 shared summary 사용

즉 readiness summary helper는 공유하지만 기다림/수집 wrapper는 오답 엔진이 별도로 구현한다.

### N-8. Pagination/layout

오답 엔진에는 `CLINIC_QPP = 4`가 고정되어 있다.

일반 exam pagination과 유사한 요소:

- 2-column page
- q-box height profile
- raw/tight measurement
- wide/fullwidth
- subjective-2up
- subjective-4up
- block gap
- page overflow auto compression

오답 고유 요소:

- 학생별 packet 경계
- class/grade recipient별 packet
- 학생별 duplex blank page
- packet-level QR recipient
- `pageBreakByStudent`
- class/grade/type composition

`APLayoutAuthority.planClinicComposition()`은 `renderAuthorityDualRun=1`일 때 composition evidence용으로 호출된다. Fast `layout-materializer.js`는 로드되지 않는다.

### N-9. Header

오답 payload는 다음 header policy를 가진다.

- `title`
- `metaRight`
- `subtitle`
- `showNameLine`
- `showScoreLine`
- `showDate`
- `applyToSolution`
- `applyToAnswer`

학생별/반별/학년별/유형별 title/meta/name/date/score가 다르므로 header는 business recipient composition과 강하게 결합되어 있다.

### N-10. QR

오답 엔진은 `qrious`를 직접 로드한다.

QR 종류:

- 학생별 solution QR
- 반/학년 common wrong QR
- stored packet QR
- stored set QR
- 공개 `wrong_print_engine.html` URL

URL 길이 안정성도 별도 관리한다.

```text
WRONG_PRINT_PUBLIC_URL
QR_URL_LENGTH.safe = 1200
QR_URL_LENGTH.warn = 1800
```

`injectSolutionQrToPage()`는 exam 마지막 페이지에 QR을 삽입한다. student packet은 `packet:<key>`를 target key로 사용할 수 있다.

### N-11. Print readiness/transport

오답 엔진은 `ClinicAdapter` readiness tracker를 사용한다.

상태 흐름:

```text
DATA_READY
→ MATH_READY
→ IMAGE_READY
→ LAYOUT_READY
→ RENDER_READY
→ PRINT_READY
```

`clinicSafePrint()` (`wrong_print_engine.html:214`)는:

1. `__AP_RENDER_READY__` 대기
2. `APPrintRuntime.assertSuccessfulRender()` 검증
3. `PRINT_READY` mark
4. `window.print()` 호출

오답 엔진에는 다음이 없다.

- `native_print.js`
- `print_image_optimizer.js`
- raster print
- GDI print
- native PCL print

따라서 wrong engine의 print transport는 현재 browser `window.print()`만 확인된다.

### N-12. Preview

`?preview=1`일 때:

- `preview-mode`/`screen-fit-mode` class
- parent message channel install
- stale storage/payload를 먼저 렌더하지 않음
- parent의 `AP_PRINT_PREVIEW` 또는 `AP_CLINIC_PREVIEW` message를 source authority로 사용
- header contenteditable
- header edit를 parent로 postMessage
- debounce preview rerender

근거:

- `wrong_print_engine.html:2434` 부근 `installPreviewMessageChannel()`
- `wrong_print_engine.html:2505` 부근 `boot()` preview branch
- `clinic-print.js:1928` iframe source
- `clinic-print.js:989` preview payload push

### N-13. Snapshot/cancellation/latest-wins

현재 wrong engine에는 다음이 없다.

- `render-state-normalizer.js`
- `screen-runtime.js`
- `screen-runtime-adapter.js`
- `snapshot-contract.js`
- `side-effect-ledger.js`
- `layout-materializer.js`
- AbortController 기반 render cancellation
- latest-wins request generation

preview debounce timer는 존재하지만 render transaction cancellation/latest-wins runtime과 동일하지 않다.

---

## O. 일반/Mixer/오답 3엔진 비교 Matrix

| 기능 | 일반 `archive/engine.html` | Mixer `archive/mixed_engine.html` | 오답 `apmath/wrong_print_engine.html` |
|---|---|---|---|
| source loading | `data=exams/<file>` dynamic script | localStorage `mixedQuestions_<key>` 또는 assessment pack | `packet`, `set`, packed `wp`, session/localStorage, preview message |
| normalization | `APRenderAuthority.normalizeArchiveQuestions()` | `APRenderAuthority.normalizeMixedQuestions()` | custom bank normalize + `APRenderAuthority.normalizeClinicQuestions()` dual-run only |
| exam render | shared `APExamRenderExecutor`, legacy fallback | inline `renderExam()` | inline `renderMeasuredExamPages()` + student/class/grade/type composition |
| solution render | shared `APSolutionRenderExecutor`, legacy fallback | inline `renderSol()` | inline `placeSolutionItems()`/`renderSol()` |
| answer render | shared `APAnswerRenderExecutor`, legacy fallback | inline `renderAns()` | inline `collectAnswerRows()`/`renderAnswerRows()` |
| MathJax | shared `mathjax_render_loop.js` wrapper + MathJax | same shared loop wrapper, inline engine orchestration | no shared loop script; direct `MathJax.typesetPromise()` and inline wait |
| image readiness | own wait wrapper + shared summary | own wait wrapper + shared summary | own `waitForClinicPrintImages()` + shared summary helper |
| pagination | executor/local algorithm; Fast ref has materializer | inline pagination | inline measured block pagination with clinic composition |
| layout authority | current authority/dual-run; Fast ref production materializer | authority/dual-run only; inline primary | `planClinicComposition()` dual-run/evidence only; inline primary |
| header | `printHeaderOptions` | `printHeaderOptions` | recipient/mode-specific header options and inline editable preview |
| QR | solution/submit QR, archive target | solution/submit QR, mixed target | student/class/grade/type/stored packet QR, public wrong engine URL |
| QPP | URL/AppState, default 4 | URL/meta, 4/6/8 | fixed `CLINIC_QPP = 4` |
| screen preview | `preview=1`, postMessage witness | unit/mixer iframe preview | `preview=1`, parent payload message, contenteditable header |
| print preflight | `__AP_RENDER_READY__`, fonts/images/math recovery | same direct preflight copy | render outcome + readiness tracker only |
| print transport | vector/raster/native/GDI | vector/raster/native/GDI | browser `window.print()` only |
| snapshot/cache | current none; Fast ref has snapshot/cache | none | payload source cache only; render snapshot none |
| cancellation/latest-wins | current none; Fast ref has runtime | none | none; preview debounce only |
| side effect | blueprint/class assignment async | mixed blueprint/class assignment async | wrong-clinics API save, packet/set fetch, student submit/reissue |
| legacy fallback | executor missing/authority legacy | inline renderer primary | common helpers missing → inline renderer remains authoritative |

---

## P. Fast Engine v2 ↔ wrong_print_engine 비교

| 기능 | 분류 | 근거 |
|---|---|---|
| `print-contract.js` | `SHARED_ALREADY` | `wrong_print_engine.html:23` 직접 include |
| `render-authority.js` | `SHARED_ALREADY` 제한적 | clinic normalizer/semantic dual-run에 사용되나 primary renderer는 inline |
| `layout-authority.js` | `SHARED_ALREADY` 제한적 | `planClinicComposition()` evidence/gate에 사용; materializer는 아님 |
| `print-runtime.js` | `SHARED_ALREADY` 제한적 | readiness tracker/assert/summarize helper 사용 |
| Fast exam executor | `DUPLICATED_EQUIVALENT` | executor를 로드하지 않고 `renderMeasuredExamPages()`가 동일 책임을 inline 수행 |
| Fast solution executor | `DUPLICATED_EQUIVALENT` | `placeSolutionItems()`와 chunk/continuation 자체 구현 |
| Fast answer executor | `DUPLICATED_EQUIVALENT` | `renderAnswerRows()` 자체 구현 |
| Fast layout materializer | `DUPLICATED_EQUIVALENT` | pagination/materialization 기능은 유사하나 clinic recipient/duplex 특수성 존재 |
| Fast MathJax loop | `DUPLICATED_EQUIVALENT` | local/CDN MathJax와 direct typeset은 있으나 `mathjax_render_loop.js`는 미로드 |
| image readiness | `DUPLICATED_EQUIVALENT` | image/decode/timeout/readiness summary 자체 wrapper |
| print preflight | `DUPLICATED_EQUIVALENT` | render readiness를 확인하지만 browser print만 사용 |
| header/QR policy | `ENGINE_SPECIFIC` | 학생/반/학년/유형/packet recipient별 header와 QR |
| screen runtime | `UNKNOWN` | Fast `screen-runtime.js`/adapter/snapshot과 clinic payload/recipient lifecycle parity 미확정 |
| snapshot/cache | `UNKNOWN` | source payload cache는 있으나 Fast render snapshot 계약 없음 |
| cancellation/latest-wins | `UNKNOWN` | preview debounce만 있고 Fast request generation/abort 없음 |
| side-effect ledger | `ENGINE_SPECIFIC` | wrong-clinics save/packet submit/reissue effect가 clinic business flow에 결합 |

---

## Q. 오답 Business Logic과 Render Infrastructure 경계

### Q-1. 오답 business logic

- 학생별 오답 선택
- 반별 공통 오답
- 학년별 공통 오답
- 최다빈출
- 최다오답
- 단원별 오답
- exam/student/class/grade scope
- wrong answer aggregation
- wrong count/correct rate
- wrong student list
- saved clinic set
- saved student packet
- reissue wrong-of-wrong packet
- target student selection
- packet/set/public key

구체적 근거:

- `clinicPrintBuildStudentWrongItems()`
- `clinicPrintBuildGradeWrongSource()`
- `clinicPrintBuildClassWrongItems()`
- `clinicPrintBuildPayload()`
- `clinicPrintSaveAndOpen()`
- `buildStudentWrongClinicReissuePayload()`

### Q-2. Render/Print Infrastructure

- bank fetch/extract
- question normalization
- question HTML
- choices
- solution HTML
- answer grid
- MathJax
- image load/decode
- measured pagination
- solution continuation
- page header
- recipient header
- QR injection
- preview message channel
- readiness tracker
- `window.print()`

오답 엔진에는 이 Infrastructure가 inline으로 존재하고, Fast executor/runtime을 직접 재사용하지 않는다.

---

## R. 추가 출력엔진 조사 결과

### R-1. Homework

저장소 전체에서 homework 관련 print 문자열은 확인했지만, homework 전용 QUESTION_PAPER_ENGINE은 확인되지 않았다.

- homework photo/file viewer: 새 창 열기/이미지 열람
- homework assignment/status: data/UI flow
- 별도 exam/solution/answer renderer: NONE

`manual/manual-data.js`의 “클리닉용 mixed_engine 시험지” 문구도 별도 엔진이 아니라 기존 `archive/mixed_engine.html`을 가리킨다.

분류: `NON_QUESTION_PAPER` 또는 기존 Mixer engine 호출

### R-2. Classroom

classroom 경로에서 확인되는 출력은 다음이다.

- clinic center 진입 → `wrong_print_engine.html`
- attendance print → report print
- timetable print → report print
- student/grade report → report print

classroom 전용 question-paper renderer는 확인되지 않았다.

### R-3. Diagnostic/Assessment

- `archive/assessment/assessment-mvp.html` → `mixed_engine.html`: QUESTION_PAPER_ENGINE, 기존 Mixer engine
- `archive/assessment/assessment-analysis.html`: REPORT_PRINT
- `archive/assessment/assessment-diagnostic-report-prototype.html`: REPORT_PRINT prototype
- `apmath/worker-backup/worker/routes/exam-pdf.js`: archive/mixed engine headless PDF transport

별도 diagnostic question-paper engine은 확인되지 않았다.

### R-4. Internal review

- `archive/internal-review-engine.html/js`
- `archive/internal-review-live.html/js`

둘은 review UI이며, 실제 시험지 렌더는 `engine.html` preview iframe으로 위임한다. 별도 QUESTION_PAPER_ENGINE이 아니다.

### R-5. Cumulative/Report/Student

- cumulative attendance ledger: REPORT_PRINT
- timetable: REPORT_PRINT
- billing receipt: REPORT_PRINT
- report center: REPORT_PRINT
- student wrong packet: `wrong_print_engine.html`
- student archive/mixed exam preview: `archive/engine.html`/`archive/mixed_engine.html`

---

## S. 기존 보고서 주장 재판정

| 기존 주장 | 재판정 | 근거 |
|---|---|---|
| 실제 엔진은 2개다 | `CORRECTED` | `apmath/wrong_print_engine.html` 추가 확인, QUESTION_PAPER_ENGINE_COUNT=3 |
| 오답 시험지 renderer는 없다 | `CORRECTED` | `clinic-print.js → wrong_print_engine.html`, student packet/set routes |
| 취약점 output은 없다 | `CONFIRMED` | weakness modules는 non-operational/fixture/HOLD, 다만 wrong clinic은 별도 operational engine |
| Mixer는 inline renderer다 | `CONFIRMED` | `mixed_engine.html` inline `renderExam/renderSol/renderAns` |
| Fast Engine은 일반 engine에만 적용된다 | `CONFIRMED` | reference branch의 screen runtime 계층은 `engine.html`에만 연결; Mixer/clinic은 별도 |
| renderer primitive는 일부 공통화되어 있다 | `CORRECTED` | 일반/Mixer/clinic 모두 print/render/layout authority 일부를 공유하지만 executor/runtime은 일반만 직접 사용 |
| 오답 출력은 assessment analysis report뿐이다 | `CORRECTED` | assessment report와 wrong clinic QUESTION_PAPER_ENGINE은 별도 경로 |
| archive-only inventory 45/38/7을 전체 denominator로 사용할 수 있다 | `CORRECTED` | `apmath/**`, `eie/**`, report print, clinic engine 누락 |

---

## T. 갱신된 Architecture Review 질문

1. 일반/Mixer/오답 3개 QUESTION_PAPER_ENGINE 모두 동일 Fast Runtime을 탈 수 있는가?
2. 각 엔진마다 source adapter만 다르게 두면 되는가?
3. `wrong_print_engine`의 학생별 packet/header/recipient/duplex 특수성이 runtime 공통화를 방해하는가?
4. Mixer와 오답의 inline exam/solution/answer renderer를 기존 executor로 대체 가능한가?
5. 일반/Mixer/오답의 print preflight를 하나로 합칠 수 있는가?
6. QR/header/QPP를 common policy로 분리할 수 있는가?
7. wrong clinic의 browser-only print transport를 native/raster/GDI transport와 같은 policy로 올릴 필요가 있는가?
8. `APLayoutAuthority.planClinicComposition()`을 Fast `layout-materializer`의 production authority로 승격할 수 있는가?
9. student packet/set source authority를 Fast snapshot key와 어떻게 결합할 것인가?
10. wrong-clinics API side effect를 `side-effect-ledger`에 넣을 수 있는가?
11. 취약점 출력은 새 renderer가 필요한가, 아니면 Mixer source adapter로 흡수 가능한가?
12. `apmath/js/core.js`의 clinic worksheet(Mixer 경로)와 `clinic-print.js`의 wrong clinic을 같은 business product로 볼 것인가, 아니면 별도 source family로 유지할 것인가?
13. report print와 question-paper engine의 공통 MathJax/print readiness만 공유하고 DOM/layout은 분리할 것인가?

---

## U. 보완 조사 최종 상태

```text
INVESTIGATION RESULT: PASS
PREVIOUS REPORT STATUS: CORRECTED
QUESTION-PAPER ENGINE COUNT: 3
REPORT PRINT COUNT: 11 source modules
REPORT PRINT ROUTE FAMILY COUNT: 16 function-level routes
PRODUCTION CODE MODIFIED: 0
FILES MODIFIED: 조사 보고서만
NEXT STEP: Architecture Review
```

수정된 기존 보고서 파일:

```text
reports/archive-output-engine-investigation.md
```

이번 보완 조사에서 수정해야 하는 것은 보고서뿐이며, `archive/**`, `apmath/**`, `eie/**`, worker route 등 production source는 수정하지 않는다.
