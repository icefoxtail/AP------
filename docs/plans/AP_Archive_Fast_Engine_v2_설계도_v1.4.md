# AP Archive Fast Engine v2 설계도 v1.4

> 문서 상태: **DESIGN / Phase 0 착수 가능 · Phase 1A는 Phase 0 Freeze Gate 통과 후 착수**
>
> 기준 저장소: `icefoxtail/AP------`
>
> 기준 브랜치: `main`
>
> 기준 HEAD: `515cb9d2511c822cc54d13ddc7a6e78eb91db4ad`
>
> 기준일: 2026-09-10
>
> v1.4 목적: v1.3 외부검수의 **신규 P0 2건 + P1 4건**을 독립 검토해 실제 정합성 공백만 봉인한다. 핵심은 **requestedTargetSessionId 단일 binding 식**, **PendingRenderSession → RenderSession 명시적 materialization**, **requestGeneration/builtRequestGeneration 용어 완전 정규화**, **precommit effect compensation contract**, **retry logical-effect identity 분리**, **pending/retired session의 transient memory exception**이다.
>
> 핵심 원칙: **현재 canonical engine을 다시 갈아엎지 않는다. 모든 render 진입점을 하나의 runtime transaction으로 소유하고, snapshot은 검증 완료된 실제 canonical DOM을 재사용하며, 이후 measurement batching과 pure layout promotion을 단계적으로 수행한다.**

---

# 0. 최종 결론

현재 Archive 코어 교체 방향은 유지한다.

되돌리거나 별도 렌더 엔진을 새로 만들지 않는다.

현재 구조는 이미 다음 기반을 확보했다.

- `render-authority.js`
  - raw source → canonical normalization
- `layout-authority.js`
  - source/business data와 분리된 layout planner / promotion evidence 기반
- `exam-render-executor.js`
- `solution-render-executor.js`
- `answer-render-executor.js`
- `mathjax_render_loop.js`
- `print-runtime.js`
- `engine.html`
  - 실제 canonical browser render entry

다만 Fast Engine v2는 단순 cache 추가 작업이 아니다.

v1.0에서 부족했던 핵심은 다음이었다.

1. **Mode 전환 state commit이 render 성공보다 먼저 일어날 수 있음**
2. **`switchMode()` 외의 직접 `render()` 진입점이 runtime ownership 밖에 남음**
3. **detached/display:none build host로는 실제 geometry 측정이 불가능함**
4. **cache-hit snapshot과 현재 선형 Print Readiness transaction 연결이 없음**
5. **현재 `MATH_READY`와 snapshot의 “수식 렌더 완료” 의미가 다름**

v1.1에서는 이 다섯 문제를 설계 수준에서 HARD CONTRACT로 봉인한다.

---

## 0.1 v1.1 외부검수 수용 판정

외부검수의 새 지적은 아래처럼 판정한다.

| 항목 | 판정 | v1.2 처리 |
|---|---|---|
| request ordering과 READY snapshot 충돌 | **ACCEPT** | `requestGeneration`을 in-flight request/build stale 판정 전용으로 한정. snapshot에는 `builtRequestGeneration` provenance만 보존 |
| Mode 2PC만 있고 HEADER/QR/QPP/SOURCE candidate state 없음 | **ACCEPT** | immutable `CandidateRenderState`와 transaction-local render state view 도입. **Render State 2PC**로 일반화 |
| target attach 후 rAF 뒤 global state commit | **ACCEPT** | COMMIT 내부 `await`/rAF 금지. DOM/state/URL/tab/pointer를 같은 synchronous task에서 commit하고 `visibleReady`는 사후 관측으로 분리 |
| intent enum 불일치 | **ACCEPT** | canonical `RenderIntentType` 하나로 통일 |
| cached snapshot 상태와 transient build 상태 혼재 | **ACCEPT** | `BuildAttemptState`와 `ModeSnapshotStatus` 분리 |
| Print Preflight와 Print HARD invariant denominator 불일치 | **ACCEPT** | `PRINT_SNAPSHOT_PREFLIGHT_GATE` 단일 정본으로 통합 |
| mode별 Snapshot 완료 Gate 누락 | **ACCEPT** | `SNAPSHOT_COMMON_HARD_GATE`를 Answer/Exam/Solution이 공통 상속 |
| foreground side effect exactly-once 미봉인 | **ACCEPT WITH SCOPE** | Phase 0에서 실제 side-effect inventory/semantics를 freeze하고 Phase 1A 진입 Gate로 승격. 근거 없이 모든 side effect를 exactly-once로 단정하지 않음 |

즉 지적의 **구조적 문제는 모두 타당**하다. 다만 마지막 side-effect 건은 “모든 side effect가 exactly-once여야 한다”로 일반화하지 않고, **각 side effect의 실제 기존 계약을 Phase 0에서 분류·동결한 후 그 계약대로 정확히 한 번/매 activation/print-only 등을 구현**하는 방식으로 수용한다.

---

## 0.2 화면 전환 성능 조사에서 확인된 provisional evidence

별도 성능 조사 보고서는 22문항 고정 시험지에서 현재 mode 전환이 기존 DOM을 버리고 mode별 renderer를 다시 실행하는 구조임을 확인했다.

주요 관측:

```text
시험지 → 해설지 평균 click→visible: 약 24.24초
해설지 → 정답표: 약 0.31초
정답표 → 시험지: 약 3.33초

해설지:
- solution box 22개
- 이미지 19개
- MathJax 45회
- chunk/shell geometry 반복 측정
```

또한 document 전체 높이에 적용된 gradient는 raster 비용을 증가시키는 **contributing factor**였지만, 주 병목은 전체 DOM 재생성·MathJax·geometry measurement로 판정되었다.

단 해당 조사 도중 로컬 HEAD가 외부 merge로 이동했으므로, 이 숫자는 **설계 우선순위를 정하는 원인 evidence로는 사용하되 최종 SLA/회귀 기준 baseline으로 봉인하지 않는다.** Phase 0에서 하나의 frozen SHA로 재측정한다.

이 evidence에 따라 snapshot lifecycle 기술 검증은 Answer로 작게 시작하되, 그 다음 사용자 체감 개선 우선순위는 **Solution Snapshot → Exam Snapshot**으로 둔다. Solution first-render 내부 최적화 순서는 frozen baseline 재현 후 확정한다.

---

## 0.3 v1.2 외부검수 수용 판정

이번 지적은 **P0 2건 모두 수용**, P1 5건도 모두 계약 명확성/실패 처리 측면에서 유효하다고 판정한다.

다만 P0-1은 단순 `deepFreeze(candidate)`로 처리하지 않는다. 현재 canonical question은 top-level object는 freeze되지만 `choices` 배열과 `sourcePayload` 같은 nested/raw reference까지 transitive immutable이라고 볼 수 없다. 외부 source object를 in-place deep-freeze하면 원본 authority를 오염시킬 수 있으므로, v1.3은 **render-affecting 값을 canonical immutable copy로 분리**하는 방식을 정본으로 한다.

또 side effect의 "exactly-once"는 외부 시스템까지 무조건 보장한다고 쓰지 않는다. receiver dedupe/idempotency가 없는 외부 효과는 엄밀한 exactly-once를 보장할 수 없으므로, Phase 0에서 **trigger + delivery guarantee + failure policy + idempotency capability**를 분리해 freeze한다.

---

## 0.4 v1.3 외부검수 수용 판정

이번 지적은 **P0 2건 모두 ACCEPT**, P1 4건도 모두 구현 전 문서 정합성 차원에서 수용한다.

다만 다음처럼 정밀화한다.

```text
- Snapshot session binding의 정본은 currentSessionId가 아니라
  requestedTargetSessionId

- Pending session을 같은 object에서 status만 CURRENT로 바꾸지 않음
  → promotePendingSession()이 완전한 RenderSession을 materialize

- request ordering은 `requestGeneration`, snapshot provenance는 `builtRequestGeneration`으로만 명명
  → requestGeneration / builtRequestGeneration만 사용

- BLOCK_BEFORE_COMMIT은 기본 금지
  → 실제 reversible + compensation contract가 Phase 0에서 freeze된 경우에만 허용

- retry는 동일 logical effect의 재시도이므로 duplicate가 아님
  → logical creation duplicate와 retry key mismatch를 별도 계수

- memory policy의 current-session-only는 persistent residency 규칙
  → pending/retired는 transition-scoped transient exception
```

---

# 1. v1.1 핵심 아키텍처 결정

## 1.1 Fast Engine v2는 하나의 canonical engine만 가진다

최종 actual render authority:

```text
archive/engine.html
```

Fast runtime도 이 엔진 내부에 통합한다.

금지:

```text
fast-engine.html
preview-engine.html
standalone-fast-renderer.html
별도 React/Vue renderer
production과 다른 mock renderer
```

성능 개선을 위해 authority를 둘로 나누지 않는다.

---

## 1.2 Fast Runtime은 render cache가 아니라 Render Transaction Owner다

`APScreenRuntime`의 1차 책임은 cache가 아니다.

가장 먼저 해야 할 일은 **모든 render 원인을 단일 관문으로 소유하는 것**이다.

Fast Runtime 활성화 후 다음 경로는 직접 `render()`를 호출할 수 없다.

```text
MODE_CHANGE
HEADER_CHANGE
QR_CHANGE
QPP_CHANGE
SOURCE_CHANGE
FORCED_REBUILD
PRINT_STALE_REBUILD
PROFILE_CHANGE          (layout-affecting 경우)
FONT_INVALIDATION
ASSET_INVALIDATION
```

모두:

```text
RenderIntent
   ↓
APScreenRuntime.request(...)
```

를 통과한다.

기존 `render()`는 public UI entry가 아니라:

```text
authoritativeBuild(transactionContext)
```

에 해당하는 **runtime 내부 builder** 역할로 내려간다.

---

# 2. 현재 실제 구조와 목표 구조를 분리해 표기한다

## 2.1 Phase 1~5 실제 구조

Phase 1~5에서는 `layout-authority.js`가 production pagination을 항상 담당한다고 가정하지 않는다.

실제 구조:

```text
AppState.data / canonical data
          │
          ▼
   mode executor
(exam / solution / answer)
          │
          ├── executor-owned measurement
          ├── executor-owned pagination/materialization
          └── DOM 결과
                  │
                  ▼
             Mode Snapshot

별도:
executor DOM/measurement
          │
          └──────────────► Layout Authority
                            parity / promotion evidence
```

즉 Phase 1~5에서 Layout Authority는 **항상 production path의 필수 하위 엔진이 아니라 promotion/parity authority**다.

---

## 2.2 Phase 6 목표 구조

Phase 6에서만 다음 구조로 승격한다.

```text
Canonical Data
    ↓
Measured Blocks
    ↓
Layout Authority
    ↓
Deterministic Placement Plan
    ↓
DOM Materialization
    ↓
Snapshot
```

따라서 문서 내 모든 아키텍처 그림은:

```text
CURRENT PHASE 1~5
TARGET PHASE 6
```

를 명시해서 혼동을 막는다.

---

# 3. Mode Naming Contract

현재 engine 내부 명칭과 canonical 명칭을 명시적으로 분리한다.

## 3.1 UI / AppState mode

```text
exam
sol
ans
```

## 3.2 Canonical render mode

```text
exam
solution
answer
```

## 3.3 Mapping

```js
const MODE_MAP = Object.freeze({
  exam: 'exam',
  sol: 'solution',
  ans: 'answer'
});
```

반대 매핑도 명시한다.

```js
const CANONICAL_TO_APP_MODE = Object.freeze({
  exam: 'exam',
  solution: 'sol',
  answer: 'ans'
});
```

snapshot key, metrics, layout evidence, print validation에서 어느 naming domain을 쓰는지 반드시 표시한다.

HARD RULE:

```text
AppState.mode는 exam|sol|ans만 저장
Canonical renderMode는 exam|solution|answer만 저장
둘을 문자열 암묵 변환하지 않음
```

---

# 4. P0 봉인: Immutable Candidate Render State + 전체 Render State 2-Phase Commit

## 4.1 핵심 결정

Fast Engine의 PREPARE와 snapshot key는 mutable global state를 authority로 사용하지 않는다.

모든 render-affecting state는 intent 수신 순간 **canonical immutable copy**로 정규화되어 하나의 `CandidateRenderState`가 된다.

적용 범위:

```text
mode
qpp
print header
QR policy + QR payload inputs
source identity + canonical render data
profile
renderer mode
layout-affecting options
font/asset/layout fingerprints
```

---

## 4.2 "immutable"의 정확한 의미

다음은 불충분하다.

```js
Object.freeze({
  printHeaderOptions: mutableObject,
  qrState: mutableObject
});
```

top-level freeze만으로 nested object mutation은 막히지 않는다.

v1.3 HARD RULE:

```text
RENDER_AFFECTING_TRANSITIVE_IMMUTABILITY == PASS
```

즉 candidate가 참조하는 모든 render-affecting 값은:

```text
A. primitive
B. 이미 transitive immutable임이 executable contract로 보장된 value object
C. runtime이 새로 만든 canonical immutable copy
```

중 하나여야 한다.

---

## 4.3 외부 객체 in-place deepFreeze 금지

다음 방식은 금지한다.

```js
deepFreeze(window.questionBank);
deepFreeze(rawSourcePayload);
deepFreeze(AppState.printHeaderOptions);
```

이유:

- source authority 원본을 runtime이 변형할 수 있음
- 다른 기능이 같은 object reference를 사용하는 경우 예상치 못한 break
- raw `sourcePayload`가 render semantics보다 넓은 데이터를 포함할 수 있음

따라서 **copy → normalize → freeze** 순서를 사용한다.

---

## 4.4 CanonicalRenderDataSnapshot

현재 render-authority가 반환한 canonical question을 transitive immutable이라고 가정하지 않는다.

Phase 0에서 실제 contract를 확인하고, Fast Runtime은 최소 다음 render-affecting projection을 새 immutable graph로 만든다.

```js
CanonicalRenderQuestionSnapshot = deepImmutableCopy({
  sourceRef,
  displayNo,
  content,
  choices,
  answer,
  solution,
  image,
  imageSize,
  solutionImage,
  solutionImageAlt,
  solutionImageCaption,
  solutionImageSize,
  layoutTag,
  choiceColumns,
  wide
});
```

`sourcePayload`는 builder가 실제 render semantics에 필요하지 않으면 snapshot render input에서 제외하고 provenance/evidence ref로만 보존한다.

필요하다면 Phase 0 inventory에서 **실제로 읽는 sourcePayload field만 명시적으로 projection**한다.

금지:

```text
raw mutable sourcePayload 전체를 candidate render authority로 참조
```

---

## 4.5 normalizeImmutableRenderValue()

권장 contract:

```js
normalizeImmutableRenderValue(value, schema)
→ plain canonical value
→ deep copy
→ recursive freeze
→ unsupported value reject
```

reject 후보:

```text
function
DOM Node
Window
mutable class instance
Proxy/opaque host object
cyclic graph
schema 밖 field
```

필요 값은 명시적 normalizer로 plain value로 변환한다.

---

## 4.6 CandidateRenderState

```js
CandidateRenderState = deepFreeze({
  mode,                 // exam|sol|ans
  canonicalMode,        // exam|solution|answer
  qpp,

  source: {
    targetSessionId,
    safeDataUrl,
    sourceArchiveFile,
    canonicalRenderData,
    canonicalDataFingerprint,
    title,
    identityTitle
  },

  printHeaderOptions: immutableHeaderValue,
  qrState: immutableQrValue,
  profile: immutableProfileValue,
  rendererMode,
  layoutOptions: immutableLayoutValue,

  fingerprints: {
    engine,
    renderAuthority,
    layoutAuthority,
    executor,
    pageLayout,
    font,
    asset,
    qrPolicy,
    qrPayload,
    printHeader,
    profile
  }
});
```

---

## 4.7 Candidate immutability witness

Candidate 생성 직후 다음 evidence를 남긴다.

```text
CANDIDATE_SCHEMA_VERSION
CANDIDATE_SEMANTIC_DIGEST
CANDIDATE_IMMUTABILITY_GATE
CANONICAL_RENDER_DATA_IMMUTABILITY_GATE
```

개발/검수 모드에서는 recursive freeze assertion을 실제로 검사한다.

---

## 4.8 Key/Build Single Input Authority

```text
computeSnapshotKey(candidate)
authoritativeBuild(ctx.candidate)
print expected-key calculation
```

모두 **동일 immutable candidate**를 사용한다.

HARD RULE:

```text
KEY_INPUT_DIGEST == BUILD_INPUT_DIGEST
```

PREPARE 도중 외부 객체 변화가 있어도 이미 생성된 candidate의 semantic digest는 변하면 안 된다.

---

## 4.9 Transaction-local Render State View

기존 executor가 `appState.qpp`나 ledger write surface를 요구하면 global `AppState`를 넘기지 않는다.

```js
TransactionRenderState = {
  mode: candidate.mode,
  qpp: candidate.qpp,

  layoutMeasurementLedger: null,
  solutionDecisionLedger: null,
  solutionObservedPlacementLedger: null
};
```

executor output은 transaction-local state에 기록한다.

---

## 4.10 전체 Render State 2PC

```text
COMMITTED STATE + RenderIntent
→ immutable CandidateRenderState
→ PREPARE/build/validate
→ synchronous COMMIT
→ post-commit visible observation
```

PREPARE 중 committed `AppState`, URL, active tab, current session pointer는 변경하지 않는다.

---

## 4.11 synchronous COMMIT

COMMIT 내부:

```text
await == 0
rAF == 0
timer == 0
network/storage await == 0
```

같은 JavaScript task에서:

```text
1. rollback journal
2. old root/state 보관
3. target root attach
4. old snapshot status transition
5. target snapshot status transition
6. Candidate committed fields → AppState
7. current session/active snapshot pointer
8. title/qpp/tab/QR-lock UI
9. URL/history
10. COMMIT_SUCCESS
```

---

## 4.12 visibleReady

```text
COMMIT_SUCCESS
→ next paint proxy
→ visibleReady metric
```

visibleReady는 correctness commit 조건이 아니다.

# 5. P0/P1 봉인: 모든 Render Entry를 Runtime이 소유 + Canonical Intent Enum

## 5.1 Canonical RenderIntentType

Fast Engine v2에서 허용되는 intent type은 아래 **하나의 enum**만 사용한다.

```js
const RenderIntentType = Object.freeze({
  MODE_CHANGE: 'MODE_CHANGE',
  HEADER_CHANGE: 'HEADER_CHANGE',
  QR_CHANGE: 'QR_CHANGE',
  QPP_CHANGE: 'QPP_CHANGE',
  SOURCE_CHANGE: 'SOURCE_CHANGE',
  PROFILE_CHANGE: 'PROFILE_CHANGE',

  FONT_INVALIDATION: 'FONT_INVALIDATION',
  ASSET_INVALIDATION: 'ASSET_INVALIDATION',
  PAGE_LAYOUT_INVALIDATION: 'PAGE_LAYOUT_INVALIDATION',
  ENGINE_INVALIDATION: 'ENGINE_INVALIDATION',

  FORCED_REBUILD: 'FORCED_REBUILD',
  PRINT_STALE_REBUILD: 'PRINT_STALE_REBUILD'
});
```

`SCREEN_PROFILE_CHANGE`와 generic `INVALIDATION`은 사용하지 않는다.

새 invalidation 이유가 생기면 기존 특정 enum으로 표현하고, 분류할 수 없는 경우 `FORCED_REBUILD` + explicit `reason`을 사용한다.

---

## 5.2 RenderIntent

```js
RenderIntent = Object.freeze({
  type,                  // RenderIntentType 중 하나
  requestedMode,         // 필요 시
  payload,               // candidate delta
  reason,
  foreground,
  requestedAt
});
```

`payload`는 global state mutation 지시가 아니라 `CandidateRenderState`를 만드는 delta다.

---

## 5.3 모든 render 원인은 runtime 관문 통과

다음 경로는 직접 `render()`를 호출할 수 없다.

```text
MODE_CHANGE
HEADER_CHANGE
QR_CHANGE
QPP_CHANGE
SOURCE_CHANGE
PROFILE_CHANGE
FONT_INVALIDATION
ASSET_INVALIDATION
PAGE_LAYOUT_INVALIDATION
ENGINE_INVALIDATION
FORCED_REBUILD
PRINT_STALE_REBUILD
```

모두:

```text
APScreenRuntime.request(intent)
```

를 통과한다.

---

## 5.4 UI handler 금지 예

금지:

```js
setPrintHeaderOptions(next);
await render();
```

```js
AppState.qpp = next;
await render();
```

허용:

```js
await APScreenRuntime.request({
  type: RenderIntentType.QPP_CHANGE,
  payload: { qpp: next },
  foreground: true
});
```

---

## 5.5 Runtime ownership invariant

```text
TOTAL_RENDER_ENTRY_POINTS = N
ROUTED_THROUGH_RUNTIME = N
DIRECT_RENDER_BYPASS = 0
```

Fast Runtime enabled 상태에서:

```text
DIRECT_RENDER_CALL_OUTSIDE_RUNTIME_COUNT == 0
```

이어야 한다.

---

## 5.6 기존 render() 역할

public compatibility `render()`가 남아야 한다면:

```text
render()
→ APScreenRuntime.request({ type: FORCED_REBUILD })
```

로만 동작한다.

실제 build body:

```js
async function authoritativeBuild(ctx) { ... }
```

는 runtime만 호출한다.

# 6. Render Transaction Context + requestedTargetSessionId

모든 foreground/background build는 명시적 context를 가진다.

```js
RenderTransactionContext = {
  transactionId,
  requestGeneration,

  intentType,

  candidate,
  buildState,

  currentSessionId,
  requestedTargetSessionId,
  pendingSession,

  targetArea,
  buildHost,
  stagingHost,

  foreground,
  background,
  sideEffectsAllowed,

  snapshotKey,

  readinessTracker,
  renderReadyPromise,
  metrics,

  abortSignal,
  createdAt
}
```

---

## 6.1 requestedTargetSessionId가 snapshot binding의 단일 정본

same-session intent:

```text
requestedTargetSessionId = currentSessionId
pendingSession = null
```

SOURCE_CHANGE intent:

```text
requestedTargetSessionId = PendingRenderSession.sessionId
pendingSession != null
```

공통식:

```text
snapshot.sessionId == requestedTargetSessionId
```

이 식 하나를 cache lookup, READY reuse, Snapshot Freeze, print/source binding 검증에 사용한다.

금지:

```text
generic snapshot validity 식에서
`currentSessionId`를 직접 우변으로 하드코딩
```

---

## 6.2 Candidate와 Context의 session identity parity

```text
candidate.source.targetSessionId
== ctx.requestedTargetSessionId
```

HARD Gate:

```text
CANDIDATE_TARGET_SESSION_PARITY == PASS
```

---

## 6.3 입력 authority

render-affecting 입력 authority는 `ctx.candidate` 하나다.

builder 중간에 mutable `AppState`, URL, raw header/QR/source object를 다시 읽지 않는다.

---

## 6.4 Transaction-local output

measurement/placement ledger는 `ctx.buildState`에 기록한다.

COMMIT 성공 후 필요한 active evidence/pointer만 승격한다.

---

## 6.5 requestGeneration

`requestGeneration`은 요청/build stale 판정 전용.

snapshot provenance는 `builtRequestGeneration`.

READY snapshot validity와 `builtRequestGeneration`은 무관하다.

# 7. P0-3 봉인: Build Host는 Connected + Layout-Active

## 7.1 진짜 detached DOM 금지

다음에서 authoritative geometry 측정 금지:

```text
DocumentFragment only
display:none
visibility:hidden + layout 제거 조건
DOM 미연결 node
```

`scrollHeight`, `clientHeight`, `getBoundingClientRect`, font metric 등이 production geometry와 달라질 수 있기 때문이다.

---

## 7.2 Build Host Contract

authoritative background build host는 반드시:

```text
document에 연결됨
display != none
production과 동일 page CSS
production과 동일 font context
production과 동일 width / page geometry
layout 계산 가능
사용자에게는 보이지 않음
```

이어야 한다.

권장 개념:

```text
#render-build-root
  position: fixed/absolute;
  left: -20000px;
  top: 0;
  visibility: hidden;  // 실제 layout이 유지되는지 브라우저 실측 확인 필수
  pointer-events: none;
```

단 `visibility:hidden`이 해당 measurement와 MathJax geometry에 동일 결과를 주는지 baseline에서 확인해야 한다.

확신이 없으면:

```text
opacity:0
offscreen positioning
```

방식을 사용한다.

---

## 7.3 Geometry Parity Gate

build host는 production active host와 동일 fixture에서 다음이 같아야 한다.

```text
usable page height
page width
question raw height
question tight height
solution footprint
chunk footprint
font metrics
image natural dimensions
page count
column placement
overflow result
```

이 parity가 없으면 background authoritative build에 사용하지 않는다.

---

# 8. Build Host Pool 정책

v2 1차에서는 build host를 하나만 둔다.

```text
ONE AUTHORITATIVE BUILD HOST
ONE BUILD TRANSACTION AT A TIME
```

이유:

- 현재 global staging 의존성
- MathJax shared state
- readiness global bridge
- OS side effects
- layout measurement race

parallel authoritative builds 금지.

---

# 9. Latest-Wins / requestGeneration Contract

## 9.1 requestGeneration의 유일한 의미

runtime은 monotonically increasing `requestGeneration`을 가진다.

```js
currentRequestGeneration += 1;
```

각 intent/build attempt는 그 값을 캡처한다.

목적:

```text
in-flight/queued request가 최신 요청인지 판정
stale build의 COMMIT 방지
```

---

## 9.2 READY snapshot validity에는 builtRequestGeneration을 사용하지 않음

금지:

```text
snapshot.builtRequestGeneration == currentRequestGeneration
```

READY snapshot 재사용 유효성:

```text
snapshot.status == READY
snapshot.sessionId == requestedTargetSessionId
snapshot.key == expectedSnapshotKey(candidate)
snapshot.ownership == PASS
snapshot.commonHardGate == PASS
```

`builtRequestGeneration`은 provenance/debug 정보다.

---

## 9.3 BuildAttempt commit eligibility

```text
attempt.requestGeneration == currentRequestGeneration
```

일 때만 현재 foreground COMMIT 후보가 될 수 있다.

불일치:

```text
BuildAttemptState = DISCARDED_STALE
COMMIT_COUNT = 0
snapshot cache 등록 금지
```

---

## 9.4 queued coalescing

같은 category의 queued intent는 최신 값으로 병합 가능.

```text
HEADER_CHANGE requestGeneration=10
HEADER_CHANGE requestGeneration=11
HEADER_CHANGE requestGeneration=12
→ 10/11 폐기
→ 12 candidate만 build
```

---

## 9.5 in-flight cancellation

```text
Soft Abort:
ctx.abortSignal.aborted

Commit Abort:
attempt.requestGeneration != currentRequestGeneration
```

중단 불가능한 MathJax/DOM work가 끝나도 stale attempt는 commit하지 않는다.

---

## 9.6 cache-hit activation

cache hit request도 자신의 `requestGeneration`을 가진다.

COMMIT 직전 현재 request와 `currentRequestGeneration`이 같은지만 확인한다.

snapshot의 `builtRequestGeneration`과 비교하지 않는다.

# 10. Side Effect Contract: Trigger / Delivery / Failure / Compensation

render 외부 side effect는 Phase 0에서 전수 inventory하고 아래 축을 분리해 freeze한다.

---

## 10.1 Trigger Class

```text
COMMIT
ACTIVATION
PRINT
SOURCE_SESSION
OBSERVABILITY
BACKGROUND_FORBIDDEN
```

---

## 10.2 Delivery Guarantee Class

```text
REQUIRED_ACK
RETRYABLE_IDEMPOTENT
AT_MOST_ONCE_LOCAL
BEST_EFFORT
OBSERVABILITY_ONLY
```

receiver dedupe/idempotency가 없으면 `RETRYABLE_IDEMPOTENT`나 exactly-once 유사 표현을 사용하지 않는다.

---

## 10.3 Failure Policy

```text
BLOCK_BEFORE_COMMIT
POST_COMMIT_RETRY
POST_COMMIT_TERMINAL_FAILURE
BEST_EFFORT_LOG_ONLY
IGNORE_BY_CONTRACT
```

각 effect에:

```text
required
maxAttempts
retry cadence
terminal condition
operation-complete gate relation
user-visible failure policy
```

를 freeze한다.

---

## 10.4 BLOCK_BEFORE_COMMIT 기본 정책

`BLOCK_BEFORE_COMMIT`은 **기본 금지**다.

허용하려면 Phase 0에서 다음을 모두 증명/freeze해야 한다.

```text
PRECOMMIT_EFFECT_REVERSIBLE == PASS
PRECOMMIT_COMPENSATION_CONTRACT_FROZEN == PASS
PRECOMMIT_COMPENSATION_IDEMPOTENCY_FROZEN == PASS
PRECOMMIT_ABORT_RECOVERY_POLICY_FROZEN == PASS
```

하나라도 없으면 해당 effect는:

```text
POST_COMMIT_RETRY
또는
다른 실제 계약
```

으로 재분류한다.

---

## 10.5 PrecommitEffectJournal

허용된 precommit effect가 성공하면 COMMIT 전에 journal을 남긴다.

```js
PrecommitEffectJournal = {
  effectId,
  logicalEffectId,
  idempotencyKey,
  effectAck,
  compensationRequiredOnCommitAbort,
  compensationState
}
```

---

## 10.6 COMMIT abort 후 compensation

precommit effect 성공 후 synchronous COMMIT이 rollback되면:

```text
COMMIT_ABORTED_AFTER_PRECOMMIT_EFFECT
→ compensationRequiredOnCommitAbort == true
→ compensation ledger 생성
→ frozen compensation policy 실행
```

상태:

```text
COMPENSATION_PENDING
COMPENSATION_RUNNING
COMPENSATED
COMPENSATION_FAILED_RETRYABLE
COMPENSATION_FAILED_TERMINAL
```

screen/state rollback 완료와 외부 compensation 완료는 별도 상태로 추적한다.

최종 operation seal에서 required compensation unresolved를 허용하지 않는다.

---

## 10.7 SideEffect logical identity와 attempt identity 분리

정상 retry는 duplicate logical effect 생성이 아니다.

```text
logicalEffectId = 하나
idempotencyKey = 하나
attempt = 1,2,3...
```

정상:

```text
attempt 1 FAIL
attempt 2 same logicalEffectId
attempt 2 same idempotencyKey
```

HARD counters:

```text
DUPLICATE_LOGICAL_EFFECT_CREATION_COUNT == 0
RETRY_IDEMPOTENCY_KEY_MISMATCH_COUNT == 0
RETRY_LOGICAL_EFFECT_ID_MISMATCH_COUNT == 0
```

과거의 'idempotency-key 자체 중복' 중심 counter는 폐기한다.

---

## 10.8 Execution Ledger

```text
PENDING
RUNNING
ACKNOWLEDGED
FAILED_RETRYABLE
FAILED_TERMINAL
SKIPPED_BY_CONTRACT
```

record:

```text
logicalEffectId
effectId
triggerEventId
idempotencyKey
attempt
state
lastError
createdAt
updatedAt
```

---

## 10.9 missed execution

required effect:

```text
EXPECTED_REQUIRED_EFFECT_COUNT
ACKNOWLEDGED_REQUIRED_EFFECT_COUNT
MISSED_REQUIRED_EFFECT_COUNT
UNRESOLVED_REQUIRED_EFFECT_COUNT
```

fully-complete seal:

```text
MISSED_REQUIRED_EFFECT_COUNT == 0
UNRESOLVED_REQUIRED_EFFECT_COUNT == 0
UNRESOLVED_REQUIRED_COMPENSATION_COUNT == 0
```

---

## 10.10 Phase 0 canonical Gates

```text
SIDE_EFFECT_INVENTORY_COMPLETE
SIDE_EFFECT_CONTRACT_MATRIX_FROZEN
SIDE_EFFECT_IDEMPOTENCY_RULES_FROZEN
SIDE_EFFECT_FAILURE_POLICY_FROZEN
SIDE_EFFECT_COMPENSATION_POLICY_FROZEN
```

전부 PASS 전에는 Phase 1A 착수 금지.

---

## 10.11 Background

```text
BACKGROUND_SIDE_EFFECT_COUNT == 0
```

background/prewarm은 committed external side effect를 실행하지 않는다.

# 11. RenderSession + PendingRenderSession Promotion Contract

## 11.1 Current RenderSession

```js
RenderSession = {
  sessionId,

  sourceArchiveFile,
  canonicalDataFingerprint,

  engineFingerprint,
  layoutFingerprint,
  fontFingerprint,
  assetFingerprint,

  activeMode,
  activeSnapshotKey,

  status:
    | 'CURRENT'
    | 'RETIRED_PENDING_CLEANUP'
    | 'EVICTED',

  modeSnapshots: {
    exam: null,
    sol: null,
    ans: null
  },

  createdAt,
  promotedAt
};
```

`sessionId`는 RenderSession의 필수 canonical identity다.

---

## 11.2 PendingRenderSession은 Current RenderSession과 다른 type

```js
PendingRenderSession = {
  pendingSessionId,
  targetSessionId,

  parentCurrentSessionId,

  sourceArchiveFile,
  canonicalDataFingerprint,

  engineFingerprint,
  layoutFingerprint,
  fontFingerprint,
  assetFingerprint,

  intendedInitialMode,

  preparedSnapshots: {
    exam: null,
    sol: null,
    ans: null
  },

  status:
    | 'PREPARING'
    | 'READY_TO_COMMIT'
    | 'PROMOTED'
    | 'ABORTED',

  createdAt,
  promotedSessionId: null
};
```

HARD RULE:

```text
PendingRenderSession object를
status='CURRENT'로 바꿔 Current RenderSession처럼 사용 금지
```

---

## 11.3 targetSessionId 발급

SOURCE_CHANGE PREPARE 시작 시 unique `targetSessionId`를 발급한다.

```text
pending.targetSessionId = targetSessionId
candidate.source.targetSessionId = targetSessionId
ctx.requestedTargetSessionId = targetSessionId
snapshot.sessionId = targetSessionId
```

모두 같아야 한다.

Gate:

```text
PENDING_TARGET_SESSION_ID_PARITY == PASS
```

---

## 11.4 promotePendingSession()

Pending → Current 승격은 명시적 materialization 함수 하나가 authority다.

```js
function promotePendingSession({
  pending,
  candidate,
  promotedSnapshot,
  committedAt
}) {
  assert(pending.status === 'READY_TO_COMMIT');
  assert(promotedSnapshot.sessionId === pending.targetSessionId);

  return Object.freeze({
    sessionId: pending.targetSessionId,

    sourceArchiveFile: pending.sourceArchiveFile,
    canonicalDataFingerprint: pending.canonicalDataFingerprint,

    engineFingerprint: pending.engineFingerprint,
    layoutFingerprint: pending.layoutFingerprint,
    fontFingerprint: pending.fontFingerprint,
    assetFingerprint: pending.assetFingerprint,

    activeMode: promotedSnapshot.mode,
    activeSnapshotKey: promotedSnapshot.key,

    status: 'CURRENT',

    modeSnapshots: {
      ...pending.preparedSnapshots,
      [promotedSnapshot.mode]: promotedSnapshot
    },

    createdAt: pending.createdAt,
    promotedAt: committedAt
  });
}
```

실제 구현에서 mutable session container가 필요하면 outer container는 mutable일 수 있으나, **promotion 결과 필드 denominator와 의미는 위 계약을 따라야 한다.**

---

## 11.5 SOURCE_CHANGE PREPARE

```text
currentSession A 유지
→ PendingRenderSession B 생성
→ B source load
→ B canonicalize
→ immutable candidate B
→ B snapshot build
→ snapshot.sessionId == requestedTargetSessionId
→ pending.status = READY_TO_COMMIT
```

이 동안 A는 그대로 유지.

---

## 11.6 SOURCE_CHANGE synchronous COMMIT

PREPARE에서 미리:

```text
nextCurrentSession = promotePendingSession(...)
```

까지 materialize/validate해 둔다.

synchronous COMMIT 안에서는:

```text
oldSession = currentSession

old root 보관
target root attach

old active snapshot.status = READY
target snapshot.status = ACTIVE

currentSession = nextCurrentSession
pending.status = PROMOTED
pending.promotedSessionId = nextCurrentSession.sessionId

Candidate committed state → AppState
UI/URL
COMMIT_SUCCESS
```

`promotePendingSession()`에서 throw 가능성이 있는 validation/materialization은 PREPARE에서 끝내고 COMMIT에는 준비된 결과만 사용한다.

---

## 11.7 Old session cleanup

COMMIT 성공 후:

```text
oldSession.status = RETIRED_PENDING_CLEANUP
```

post-commit cleanup:

```text
old snapshots → EVICTED
required MathJax cleanup
old DOM release
oldSession.status = EVICTED
```

금지:

```text
OLD_SESSION_EVICT_BEFORE_NEW_SESSION_COMMIT
OLD_MATHJAX_CLEANUP_BEFORE_NEW_SESSION_COMMIT
```

---

## 11.8 SOURCE_CHANGE failure

pending PREPARE 실패:

```text
pending.status = ABORTED
pending build/snapshot discard
currentSession unchanged
current active DOM unchanged
old MathJax unchanged
AppState/URL unchanged
```

---

## 11.9 post-commit cleanup failure

새 session은 이미 CURRENT.

old cleanup 실패는:

```text
OLD_SESSION_CLEANUP_PENDING
```

으로 기록하고 resource cleanup retry.

새 session correctness commit을 rollback하지 않는다.

# 12. BuildAttemptState와 ModeSnapshotStatus

## 12.1 BuildAttemptState

```js
const BuildAttemptState = Object.freeze({
  QUEUED: 'QUEUED',
  BUILDING: 'BUILDING',
  SUCCEEDED: 'SUCCEEDED',
  FAILED: 'FAILED',
  ABORTED: 'ABORTED',
  DISCARDED_STALE: 'DISCARDED_STALE'
});
```

---

## 12.2 ModeSnapshotStatus

```js
const ModeSnapshotStatus = Object.freeze({
  READY: 'READY',
  ACTIVE: 'ACTIVE',
  STALE: 'STALE',
  EVICTED: 'EVICTED'
});
```

---

## 12.3 ModeSnapshot

```js
ModeSnapshot = {
  snapshotId,

  mode,
  canonicalMode,

  key,
  sessionId,

  status,

  rootNode,
  ownershipToken,

  pageCount,
  nodeCount,

  renderMetrics,
  readinessEvidence,
  layoutEvidence,
  qrEvidence,
  commonHardGateEvidence,

  createdAt,
  lastUsedAt,

  builtRequestGeneration
};
```

Canonical naming:

```text
request ordering/staleness = requestGeneration
snapshot provenance = builtRequestGeneration
session identity = sessionId / requestedTargetSessionId
```

request ordering/provenance에는 canonical 이름 외 별칭을 사용하지 않는다.

---

## 12.4 Snapshot 생성

```text
BuildAttempt SUCCEEDED
AND attempt.requestGeneration == currentRequestGeneration at freeze
AND SNAPSHOT_COMMON_HARD_GATE PASS
→ ModeSnapshot(
    status=READY,
    builtRequestGeneration=attempt.requestGeneration
  )
```

future requestGeneration 변화는 snapshot stale 조건이 아니다.

# 13. Snapshot DOM Ownership: MOVE, NEVER CLONE

P1 핵심 HARD RULE.

snapshot은 authoritative build에서 완성된 실제 node tree를 소유한다.

snapshot freeze/activate/deactivate 과정에서:

```text
cloneNode(true)
```

로 canonical snapshot을 복제하지 않는다.

이유:

- `<canvas>` bitmap
- MathJax-generated ownership/state
- event/data association
- future custom elements
- hidden mutable state

등이 clone으로 완전히 보존된다는 보장이 없다.

---

## 13.1 허용

```text
node MOVE
container appendChild(existingNode)
replaceChildren(existingNode)
detached ownership container로 이동
```

---

## 13.2 금지

```text
snapshot canonical DOM clone
QR canvas clone을 canonical evidence로 사용
clone 결과를 PRINT_READY 근거로 사용
```

HARD invariant:

```text
SNAPSHOT_CANONICAL_CLONE_COUNT == 0
```

---

# 14. QR Fingerprint Contract

v1.0의 `qrPolicyFingerprint`만으로 부족하다.

snapshot key에는 실제 QR payload까지 포함한다.

```text
QR_POLICY_FINGERPRINT
QR_PAYLOAD_FINGERPRINT
```

---

## 14.1 QR Payload Fingerprint 입력

실제 QR 결과에 영향을 주는 값을 전부 포함한다.

예:

```text
sourceArchiveFile
exam identity/title
data path / source path
class
teacher
className
date
question identifiers
mode
qr flags
submit QR payload
solution QR payload
recipient-related payload
versioned QR rules
```

현재 실제 payload 구성 코드를 기준으로 최종 필드 inventory를 확정한다.

---

## 14.2 QR canvas 규칙

QRious 등이 `<canvas>`에 실제 bitmap을 그리는 경우:

- snapshot은 canvas node 자체를 MOVE해서 보존
- clone 기반 cache 금지
- QR payload 변경 시 해당 snapshot invalidate

---

# 15. Fingerprint 체계

최소 다음 fingerprint를 분리한다.

```text
CANONICAL_DATA_FINGERPRINT
ENGINE_FINGERPRINT
RENDER_AUTHORITY_FINGERPRINT
LAYOUT_AUTHORITY_FINGERPRINT
EXECUTOR_FINGERPRINT
PAGE_LAYOUT_FINGERPRINT
SCREEN_CHROME_FINGERPRINT
FONT_FINGERPRINT
ASSET_FINGERPRINT
QR_POLICY_FINGERPRINT
QR_PAYLOAD_FINGERPRINT
PRINT_HEADER_FINGERPRINT
PROFILE_FINGERPRINT
```

---

# 16. Screen Chrome와 Page Layout 분리

화면 배경이나 toolbar 색이 바뀌었다고 page snapshot을 폐기하면 안 된다.

따라서:

```text
SCREEN_CHROME_FINGERPRINT
```

과

```text
PAGE_LAYOUT_FINGERPRINT
```

을 분리한다.

예:

```text
body background 변경
toolbar 색상 변경
screen-only decoration 변경
```

은 page geometry에 영향이 없다면 snapshot 유지.

반면:

```text
page width
page padding
font
line-height
question margin
grid gap
header height
```

변경은 invalidate.

---

# 17. Cache Key

snapshot key는 반드시 `CandidateRenderState` 하나에서 결정적으로 계산한다.

```text
candidate.source.sourceArchiveFile
candidate.source.canonicalDataFingerprint
candidate.mode
candidate.canonicalMode
candidate.qpp
candidate.fingerprints.engine
candidate.fingerprints.renderAuthority
candidate.fingerprints.layoutAuthority
candidate.fingerprints.executor
candidate.fingerprints.pageLayout
candidate.fingerprints.font
candidate.fingerprints.asset
candidate.fingerprints.qrPolicy
candidate.fingerprints.qrPayload
candidate.fingerprints.printHeader
candidate.fingerprints.profile
candidate.rendererMode
```

HARD RULE:

```text
SAME CandidateRenderState render semantics → SAME snapshot key
render-affecting candidate difference → key difference or explicit invalidation
mutable global AppState read → 0
```

# 18. P0-5 봉인: Math Readiness 의미 분리

현재 runtime의 `MATH_READY`와 snapshot 수식 완료는 같은 뜻이 아니다.

v1.1에서는 반드시 분리한다.

## 18.1 mathRuntimeReady

의미:

```text
MathJax runtime/startup이 사용 가능한 상태
```

이것이 기존 `MATH_READY`에 가장 가깝다.

---

## 18.2 mathTypesetComplete

의미:

```text
현재 snapshot의 canonical DOM에 필요한 MathJax typeset transaction이 완료됨
```

---

## 18.3 unrenderedMathCount

snapshot READY 조건:

```text
mathRuntimeReady == PASS
mathTypesetComplete == PASS
unrenderedMathCount == 0
```

예외적으로 수식 없는 문서는:

```text
mathTypesetComplete = NOT_REQUIRED
unrenderedMathCount = 0
```

로 정의할 수 있다.

---

## 18.4 Snapshot READY Math Gate

다음 중 하나:

```text
A.
mathRuntimeReady == PASS
AND mathTypesetComplete == PASS
AND unrenderedMathCount == 0

B.
noMathContent == true
AND unrenderedMathCount == 0
```

아니면 READY 금지.

---

# 19. Font Readiness Contract

P1 보강.

snapshot geometry는 font load 이전과 이후가 달라질 수 있다.

따라서 authoritative geometry 측정 전에:

```text
document.fonts.ready
```

또는 동등한 font readiness를 확인한다.

---

## 19.1 fontReady evidence

snapshot에 저장:

```js
fontReady = {
  status: 'PASS',
  fontFingerprint,
  checkedAt
}
```

---

## 19.2 geometry stabilization

font ready 직후 최소 한 번 layout barrier를 거친다.

권장:

```text
await document.fonts.ready
→ await raf/layout barrier
→ measurement
```

필요하면 representative fixture로:

```text
fontReady 전/후 question height delta
```

를 확인한다.

---

# 20. Image Readiness

snapshot 생성 시 image readiness를 완료하고 evidence를 저장한다.

cache hit에서는 다시 전체 `waitForPrintImages()`를 돌리지 않는다.

단:

```text
assetFingerprint mismatch
```

이면 snapshot invalidate.

---

# 21. Cache Snapshot과 Print Readiness 연결

기존 `print-runtime.js`의 선형 state 의미는 유지한다.

```text
DATA_READY
→ MATH_READY
→ IMAGE_READY
→ LAYOUT_READY
→ RENDER_READY
→ PRINT_READY
```

cache-hit snapshot을 인쇄할 때 과거 readiness transaction을 재개하지 않는다.

인쇄 요청마다 **새 Print Validation Transaction**을 만든다.

`MATH_READY` evidence는 snapshot의 `mathRuntimeReady + mathTypesetComplete + unrenderedMathCount`를 함께 재검증하여 기존 명칭의 의미 부족을 보완한다.

# 22. Print Validation Transaction

```text
PRINT REQUEST
    ↓
active snapshot resolve
    ↓
expected CandidateRenderState / key 계산
    ↓
new Print Validation Transaction
    ↓
PRINT_SNAPSHOT_PREFLIGHT_GATE
    ↓
stored evidence rebind
    ↓
current DOM preflight
    ↓
DATA→MATH→IMAGE→LAYOUT→RENDER evidence 순차 mark
    ↓
PRINT_READY
```

---

## 22.1 Snapshot Evidence Adapter

```js
revalidateSnapshotForPrint(snapshot, currentCandidate)
```

역할:

1. active/session/source identity 확인
2. expected snapshot key 확인
3. ownership 확인
4. math runtime/typeset/unrendered 확인
5. current font fingerprint/preflight
6. current assets/decode preflight
7. current page/layout/overflow preflight
8. QR policy + payload fingerprint 확인
9. print header fingerprint 확인
10. profile/renderer expectation 확인
11. 새 readiness transaction에 evidence 순서대로 mark
12. `PRINT_READY`

---

## 22.2 과거 transaction 재사용 금지

```text
OLD_RENDER_TRANSACTION_RESUME == FORBIDDEN
OLD_PRINT_READY_REUSE == FORBIDDEN
```

snapshot evidence는 새 transaction의 입력 증거일 뿐이다.

# 23. PRINT_SNAPSHOT_PREFLIGHT_GATE — 단일 HARD Denominator

Print Preflight와 Print Hard Invariant는 아래 **동일한 denominator**를 사용한다.

```text
P01 active snapshot exists
P02 snapshot.status == ACTIVE
P03 snapshot.sessionId == current print candidate requestedTargetSessionId
P04 snapshot source identity == current candidate source
P05 snapshot.key == expected current snapshot key
P06 DOM ownership token/root identity PASS
P07 pageCount > 0 and active DOM page count parity
P08 mathRuntimeReady PASS or NOT_REQUIRED
P09 mathTypesetComplete PASS or NOT_REQUIRED
P10 unrenderedMathCount == 0
P11 font readiness PASS
P12 font fingerprint matches
P13 asset fingerprint matches
P14 all required images/assets complete; decode error == 0
P15 layout/page geometry fingerprint matches
P16 vertical overflow == 0
P17 horizontal overflow == 0
P18 QR policy fingerprint matches
P19 QR payload fingerprint matches
P20 print header fingerprint matches
P21 renderer/profile expectations match
P22 snapshot common hard gate evidence valid
P23 readiness evidence belongs to this snapshot/session
```

하나라도 실패:

```text
PRINT_SNAPSHOT_PREFLIGHT_GATE = FAIL
→ PRINT_STALE_REBUILD or print block
→ stale reason evidence 기록
```

`#91 Print Hard Invariants`는 이 denominator를 그대로 참조한다. 별도 축약 목록을 만들지 않는다.

# 24. Snapshot Activation Fast Path

## 24.1 cache hit PREPARE

```text
MODE_CHANGE or other state intent
→ CandidateRenderState
→ expected key
→ READY snapshot lookup
→ session/key/ownership/common gate validation
→ requestGeneration latest 확인
→ synchronous COMMIT 준비
```

READY snapshot의 `builtRequestGeneration`은 현재 requestGeneration과 비교하지 않는다.

---

## 24.2 synchronous COMMIT

같은 task 안에서:

```text
old root storage MOVE
→ target root active host MOVE
→ candidate committed state 적용
→ active pointer/UI 적용
→ URL/history 마지막 적용
→ COMMIT_SUCCESS
```

중간 `await` 없음.

---

## 24.3 post-commit visible metric

```text
COMMIT_SUCCESS
→ rAF/paint proxy
→ visibleReadyMs 기록
```

---

## 24.4 cache hit에서 금지

```text
authoritative build
MathJax typeset
MathJax typesetClear
image readiness full wait
font wait
pagination
measurement
DOM rebuild
QR canvas redraw
canonical snapshot clone
```

# 25. Cache Miss Foreground Build

```text
RenderIntent
→ CandidateRenderState
→ requestGeneration
→ READY miss
→ BuildAttempt(QUEUED→BUILDING)
→ RenderTransactionContext
→ authoritative build
→ font/math/image/layout/render evidence
→ freeze gate
→ latest requestGeneration 확인
→ BuildAttempt SUCCEEDED
→ ModeSnapshot READY
→ synchronous COMMIT
→ post-commit visibleReady observation
```

현재 active 화면은 PREPARE/build 동안 유지한다.

build result가 stale이면:

```text
BuildAttempt = DISCARDED_STALE
snapshot 생성 금지
COMMIT 금지
```

# 26. SNAPSHOT_COMMON_HARD_GATE

모든 mode snapshot은 동일 공통 Gate를 상속한다.

```text
S01 build attempt SUCCEEDED
S02 snapshot key final parity PASS
S03 session identity PASS
S04 source identity PASS
S05 ownership token/root identity PASS
S06 canonical clone count == 0
S07 fontReady PASS
S08 mathRuntimeReady PASS or NOT_REQUIRED
S09 mathTypesetComplete PASS or NOT_REQUIRED
S10 unrenderedMathCount == 0
S11 image/assets readiness PASS
S12 layoutReady PASS
S13 renderReady PASS
S14 pageCount/DOM presence valid
S15 no required asset decode errors
S16 side-effect isolation PASS
S17 snapshot evidence complete
S18 build result not stale at freeze time
```

주의:

```text
S18은 "build result를 READY snapshot으로 만들 당시 stale이 아니었다"는 freeze-time evidence다.
future requestGeneration == builtRequestGeneration을 요구하지 않는다.
```

모드별 Gate는 이 공통 Gate 위에 추가된다.

### Exam additional

```text
layoutMeasurementLedger parity
qpp/layoutTag/wide placement evidence
exam image sizing evidence
```

### Solution additional

```text
solutionDecisionLedger
solutionObservedPlacementLedger
continuation parity
solution image ownership/parity
```

### Answer additional

```text
answer count/order
grouping/page/overflow-refit evidence
```

# 27. Synchronous Atomic Swap

## 27.1 JavaScript atomicity 정의

여기서 atomic은 데이터베이스 transaction이 아니라:

```text
사용자에게 intermediate frame을 노출하지 않도록
하나의 synchronous JavaScript task 안에서
DOM + committed state + UI pointer를 함께 바꾸는 것
```

이다.

---

## 27.2 COMMIT 내부 금지

```text
await
Promise.then yield
requestAnimationFrame
setTimeout
network
async storage
MathJax
image decode wait
geometry measurement
```

모든 heavy/throw-prone 검증은 PREPARE에서 끝낸다.

---

## 27.3 Rollback journal

COMMIT 시작 직전:

```text
previousCandidate/committed AppState snapshot
previous active snapshot id
previous root reference
previous URL/history state
previous tab/title/qpp/QR-lock UI state
```

를 rollback journal에 보관한다.

synchronous mutation 중 throw가 나면 같은 task에서 복원한다.

---

## 27.4 visibleReady

paint 확인은 commit 이후 성능 metric으로만 사용한다.

```text
COMMIT_SUCCESS
→ next frame
→ visibleReady
```

visibleReady가 늦어도 correctness commit 자체는 이미 완료된 상태다.

# 28. Snapshot Storage Host

inactive snapshot을 저장할 때도 ownership을 명확히 한다.

옵션:

```text
#snapshot-storage
```

inactive snapshot은 layout/paint 비용이 없도록 실제 브라우저 특성을 검증한 방식으로 보관한다.

DocumentFragment에 이동하는 것은 **완성 후 storage 단계에서는 허용**할 수 있다.

중요한 구분:

```text
authoritative BUILD measurement
  → connected layout-active 필수

completed snapshot STORAGE
  → detached/DocumentFragment 허용
```

---

# 29. MathJax Lifecycle

## READY → ACTIVE

```text
typesetClear 금지
typeset 금지
```

## ACTIVE → READY storage

```text
typesetClear 금지
```

## READY/ACTIVE → STALE/EVICTED

snapshot DOM을 실제 폐기할 때만 MathJax cleanup 검토.

---

# 30. Build Transaction과 MathJax

각 build transaction의 typeset call은 transaction metrics에 귀속한다.

기존 단일 `APRenderLoop.current`를 그대로 공유하면 background build와 foreground metrics가 섞일 수 있다.

v1.1에서는 metrics를 context 기반으로 확장한다.

---

# 31. Metrics Context

```js
RenderMetrics = {
  transactionId,
  requestGeneration,
  intentType,
  foreground,
  mode,

  sessionId,
  targetSessionId,

  cacheStatus,

  startedAt,
  commitReadyMs,
  commitMs,
  visibleReadyMs,

  snapshotBuildMs,
  snapshotAttachMs,

  mathJaxCalls,
  mathJaxTotalMs,

  imageWaitMs,
  fontWaitMs,

  measurementMs,
  layoutMs,
  materializeMs,

  rafCount,
  layoutBarrierCount,
  forcedLayoutReadCount,

  pages,
  nodeCount,

  committed,
  discardedAsStale,
  aborted,

  oldSessionCleanupMs,
  oldSessionCleanupFailed
};
```

HARD naming rule:

```text
request ordering = requestGeneration
snapshot provenance = builtRequestGeneration
session identity = sessionId / targetSessionId
```

Fast Runtime 계약에는 request/provenance canonical 이름 외 별칭 필드를 두지 않는다.

# 32. Forced Layout Metric 정의

P2 정밀화.

`forcedLayoutReadCount`는 단순 모든 `scrollHeight` 접근 횟수가 아니다.

다음 조건의 read를 대상으로 한다.

```text
직전 같은 transaction/task에서 layout-affecting DOM write가 있었고
layout flush 가능성이 있는 geometry read
```

대상 예:

```text
scrollHeight
clientHeight
offsetHeight
offsetWidth
getBoundingClientRect
getComputedStyle 중 geometry-dependent read
```

---

## 32.1 instrumentation

development/perf fixture에서 wrapper 사용 가능.

예:

```js
ctx.metrics.recordLayoutRead({
  type: 'scrollHeight',
  afterPendingWrite: true
});
```

production에서 monkey patching으로 브라우저 native property를 무리하게 감싸지 않는다.

---

# 33. Layout Barrier 정의

`rafCount`와 별개로:

```text
layoutBarrierCount
```

를 기록한다.

barrier 예:

```text
await raf()
await doubleRaf()
explicit task yield
font ready 이후 frame
```

measurement batching의 핵심 performance invariant는:

```text
layoutBarrierCount가 문항 수에 선형 증가하지 않을 것
```

이다.

---

# 34. Measurement Tolerance

P2 정밀화.

measurement batching parity에서 raw 숫자를 완전 동일만 요구하면 subpixel/font raster 차이 때문에 불필요한 FAIL이 생길 수 있다.

따라서 두 층으로 구분한다.

## Exact semantic parity

```text
question order
page count
placement
continuation
overflow boolean
layoutTag handling
```

는 exact.

## Geometry numeric parity

초기 허용 tolerance 후보:

```text
height absolute delta <= 1 CSS px
AND
relative delta <= 0.5%
```

단 이 값은 Phase 0 baseline 결과로 freeze한다.

임의로 1px을 정본으로 고정하지 않는다.

---

# 35. Solution First-Render Optimization — Phase 3

Phase 3의 우선 대상은 **Phase 0 fixed-SHA baseline이 solution dominant 병목을 재현하는 경우의 Solution first-render path**다.

provisional 조사에서는 다음이 관측되었다.

```text
solution mode:
- 22 solution boxes
- 19 images
- MathJax 45 calls
- chunk/shell geometry 반복 측정
```

따라서 후보 순서는:

```text
1. typeset call inventory
2. 안전하게 합칠 수 있는 MathJax boundary 식별
3. batch typeset/call collapse
4. solution box measurement batching
5. chunk measurement batching
6. continuation placement 반복 geometry read 축소
```

이다.

중요:

```text
MathJax call 수를 무조건 1회로 만드는 것이 목표가 아니다.
현재 45회 중 correctness상 필요한 boundary와 단순 historical/mechanical boundary를 분리한다.
```

Phase 0에서 이 병목 signature가 재현되지 않으면 Phase 3 대상은 frozen baseline의 실제 최고비용 first-render path로 바꾼다.

# 36. Solution First-Render Promotion Gate

```text
SOURCE/QUESTION ORDER PARITY == PASS
MATH_TYPESET_COMPLETENESS == PASS
UNRENDERED_MATH_COUNT == 0
SOLUTION_BOX_GEOMETRY_PARITY == PASS_WITH_FROZEN_TOLERANCE
CHUNK_GEOMETRY_PARITY == PASS_WITH_FROZEN_TOLERANCE
CONTINUATION_COUNT_PARITY == PASS
CONTINUATION_SOURCE_PARITY == PASS
CHUNK_ORDER_PARITY == PASS
SOLUTION_IMAGE_SINGLE_RENDER_PARITY == PASS
COLUMN_PLACEMENT_PARITY == PASS
PAGE_COUNT_PARITY == PASS
OVERFLOW_PARITY == PASS
FINAL_RENDER_VISUAL_PARITY == PASS
PERFORMANCE_IMPROVEMENT == PASS
```

call-count 감소만으로 promotion하지 않는다.

# 37. Solution Measurement Batching — Phase 3 후보

solution snapshot cache 안정화 뒤 first-render 내부 최적화로 수행한다.

대상:

```text
solution box raw/tight
chunk raw/tight
continuation shell overhead
placement overflow reads
autoCompress aftermath
```

목표 원칙:

```text
WRITE ALL
→ layout barrier
→ READ ALL
```

로 바꿀 수 있는 measurement group을 찾는다.

# 38. Solution Box/Chunk Batch

## Solution box

```text
READ ALL raw solution box footprint
→ WRITE ALL fit-tight
→ ONE layout barrier
→ READ ALL tight
→ WRITE ALL fit-tight off
```

## Solution chunk

가능하면:

```text
all chunk hosts create
→ safe MathJax batch
→ READ ALL raw
→ WRITE ALL fit-tight
→ ONE barrier
→ READ ALL tight
```

단 continuation decision에 필요한 순차 geometry dependency는 억지로 batch화하지 않는다.

실제 dependency graph를 확인해서 독립 group만 묶는다.

# 39. Exam Measurement Batching — Phase 4

Solution first-render 최적화 이후 exam renderer의 per-question layout barrier를 줄인다.

## 기존

```text
for each item:
  raw read
  fit-tight write
  await raf
  tight read
  remove
```

## 목표

```text
READ ALL raw
→ WRITE ALL fit-tight ON
→ ONE layout barrier
→ READ ALL tight
→ WRITE ALL fit-tight OFF
```

이 단계는 pagination 의미를 바꾸지 않고 measurement scheduling만 바꾸는 것을 우선한다.

# 40. Exam Batching Promotion Gate

```text
QUESTION_COUNT_PARITY == PASS
RAW_MEASUREMENT_PARITY == PASS_WITH_FROZEN_TOLERANCE
TIGHT_MEASUREMENT_PARITY == PASS_WITH_FROZEN_TOLERANCE
PAGE_COUNT_PARITY == PASS
BLOCK_PLACEMENT_PARITY == PASS
LAYOUTTAG/WIDE/QPP PARITY == PASS
OVERFLOW_PARITY == PASS
FINAL_RENDER_VISUAL_PARITY == PASS
LAYOUT_BARRIER_REDUCTION == PASS
```

# 41. Answer Snapshot을 첫 Cache Pilot으로 선택

Answer renderer는 상대적으로 단순하므로 runtime ownership과 snapshot lifecycle 검증에 적합하다.

정확한 순서:

```text
Phase 0
baseline + side-effect contract freeze

→ Phase 1A
CandidateRenderState
runtime ownership
RenderTransactionContext
Render State 2PC
synchronous atomic commit

→ Phase 1B
Answer Snapshot pilot
```

즉 answer cache를 먼저 덧붙이고 나중에 transaction ownership을 정리하는 방식은 금지한다.

Answer pilot이 PASS하면 사용자 체감상 가장 비싼 Solution Snapshot을 Phase 1C로 승격한다.

# 42. Phase 1A — Runtime Ownership Foundation

구현:

```text
CandidateRenderState
canonical RenderIntentType
screen-runtime
RenderTransactionContext
transaction-local render state view
all render entry routing
requestGeneration/latest-wins
Render State 2PC
synchronous atomic commit + rollback journal
foreground side-effect frozen contract 적용
transaction-scoped metrics
```

이 단계에서는 snapshot cache hit가 없어도 된다.

목표:

```text
모든 render-affecting 변경이
mutable global state 선변경 없이
CandidateRenderState → PREPARE → synchronous COMMIT
경로를 통과한다.
```

Phase 1A는 §102.1의 Phase 0 선행 Gate가 PASS한 뒤에만 시작한다.

# 43. Phase 1B — Answer Snapshot Pilot

첫 cache 대상.

Answer를 먼저 고르는 이유는 현재 renderer가 상대적으로 단순하여:

```text
snapshot ownership
MOVE, NEVER CLONE
cache-hit activation
print revalidation
Render State 2PC
common snapshot gate
```

를 저위험으로 실증하기 좋기 때문이다.

검증:

```text
ans 최초 authoritative build
→ SNAPSHOT_COMMON_HARD_GATE
→ READY
→ 다른 mode commit
→ ans 재요청
→ old builtRequestGeneration이어도 session/key/ownership 기준 cache HIT
→ synchronous commit
→ no rebuild
```

필수 확인:

```text
answer count/order
page count
4-question grouping
answer overflow refit
MathJax completeness
font/image readiness
print validation transaction
desktop/mobile actual-render parity
```

# 44. Phase 1C — Solution Snapshot

Answer Snapshot pilot PASS 후 **Solution Snapshot을 먼저 승격**한다.

이 우선순위는 provisional 성능 조사에서 해설지 전환이 가장 비쌌고, 22문항 시험지에서 MathJax 45회와 chunk/shell geometry 반복이 관측된 점을 반영한다.

단 snapshot 단계에서는 solution pagination/measurement algorithm 자체를 아직 바꾸지 않는다.

확인:

```text
solutionDecisionLedger
solutionObservedPlacementLedger
continuation identity/order
solution image ownership
chunk/shell structure
MathJax completeness
print revalidation
desktop/mobile actual-render parity
```

목표:

```text
첫 solution build = 기존 authoritative correctness 유지
재진입 = snapshot HIT / MathJax 0 / rebuild 0
```

# 45. Phase 1D — Exam Snapshot

Solution Snapshot PASS 후 exam snapshot에 적용한다.

확인:

```text
layoutMeasurementLedger
page count
qpp
wide/fullwidth
subjective-2up
subjective-4up
image sizing
sourceRef/order
MathJax completeness
print revalidation
desktop/mobile actual-render parity
```

snapshot 단계에서는 exam measurement/pagination algorithm 자체를 아직 바꾸지 않는다.

# 46. Background Build

Background build는 Phase 1 초기에 넣지 않는다.

선행 조건:

```text
RenderTransactionContext PASS
connected build host geometry parity PASS
side effect isolation PASS
metrics isolation PASS
requestGeneration latest-wins PASS
```

후 Phase 2에서 적용한다.

# 47. Phase 2 — Atomic Background Build

cache miss에서도 active 화면 유지.

```text
ACTIVE screen 유지
→ connected build host
→ authoritative build
→ READY
→ attempt.requestGeneration == currentRequestGeneration 확인
→ synchronous atomic COMMIT
→ post-commit visible observation
```

# 48. Background Build Failure

실패하면:

```text
active snapshot 유지
AppState.mode 유지
URL 유지
tab 유지
```

error evidence만 기록.

---

# 49. Idle Prewarm

Phase 5.

초기 exam COMMIT 후 idle에서:

```text
sol
→ ans
```

순차 prewarm 후보.

그러나 실제 비용 baseline에 따라 answer를 먼저 할 수도 있다.

정본 순서는 Phase 0 trace 후 결정한다.

---

# 50. Prewarm Cancellation

prewarm 중 foreground intent가 발생하면:

```text
foreground > prewarm
```

정책:

```text
1. prewarm soft abort signal
2. queued prewarm 제거
3. 새 foreground request에 새 requestGeneration 부여
4. stale prewarm attempt COMMIT 금지
```

# 51. Prewarm Side Effects

무조건:

```text
sideEffectsAllowed = false
foreground = false
background = true
```

---

# 52. Header Change 처리

헤더 입력이 layout에 영향을 줄 수 있다.

빠른 typing에서 build queue가 쌓이면 안 된다.

정책:

```text
HEADER_CHANGE debounce/coalesce
LATEST HEADER VALUE ONLY
```

debounce 시간은 UX 실측 후 결정.

고정 300ms 등 임의값을 정본으로 박지 않는다.

---

# 53. QR Change 처리

QR payload에 영향이 있으면 관련 snapshot invalidate.

화면 mode별 QR injection 규칙에 따라 selective invalidation 가능.

v2 1차에서는 correctness 우선으로 session snapshot 전체 invalidate도 허용.

---

# 54. QPP Change

QPP는 layout key 핵심.

```text
qpp 변경
→ exam/solution/answer 중 실제 영향 mode inventory 확정
```

불확실하면 전체 snapshot invalidate.

---

# 55. SOURCE_CHANGE — Pending Session 2PC

## PREPARE

```text
currentSession A 유지
→ unique targetSessionId
→ PendingRenderSession B
→ source load/canonicalize
→ immutable CandidateRenderState B
→ B snapshot build
→ snapshot.sessionId == requestedTargetSessionId
→ pending READY_TO_COMMIT
→ promotePendingSession() 결과 nextCurrentSession 미리 materialize/validate
```

## SYNCHRONOUS COMMIT

```text
old/target root + snapshot status transition
→ currentSession = prepared nextCurrentSession
→ pending = PROMOTED
→ Candidate state → AppState
→ UI/URL
→ COMMIT_SUCCESS
```

## POST-COMMIT

```text
old A = RETIRED_PENDING_CLEANUP
→ old snapshots EVICT
→ required MathJax cleanup
→ A = EVICTED
```

## FAILURE

PREPARE 실패 또는 COMMIT rollback:

```text
A remains CURRENT
A screen/snapshots remain
pending B abort/discard
```

HARD:

```text
CURRENT_SESSION_DESTROYED_BEFORE_TARGET_COMMIT == 0
PENDING_TARGET_SESSION_ID_PARITY == PASS
PENDING_TO_CURRENT_MATERIALIZATION_GATE == PASS
```

# 56. Profile Change

desktop/mobile screen-fit 자체가 page geometry를 안 바꾸는지 확인한다.

만약 실제 page CSS geometry는 동일하고 transform scale만 바뀌면 snapshot 유지.

page width/font/line wrap이 바뀌면 profile fingerprint 포함 및 invalidate.

---

# 57. State Machines

## 57.1 Build Attempt

```text
QUEUED
  ↓
BUILDING
  ├── error ─────────► FAILED
  ├── abort ─────────► ABORTED
  ├── stale request ─► DISCARDED_STALE
  └── gates pass ────► SUCCEEDED
                         ↓
                    snapshot freeze
```

---

## 57.2 Cached Snapshot

```text
READY
  ├── commit activate ─► ACTIVE
  │                       │
  │                       └── same-session deactivate ─► READY
  ├── invalidation ──────► STALE
  └── eviction ──────────► EVICTED
```

---

## 57.3 Session

```text
Pending:
PREPARING
  ├── failure ─► ABORTED
  └── ready ───► READY_TO_COMMIT
                   │
                   └── synchronous promotion ─► PROMOTED/CURRENT

Old current after source promotion:
CURRENT
  → RETIRED_PENDING_CLEANUP
  → EVICTED
```

old current는 target session COMMIT 전에 RETIRED/EVICTED로 이동할 수 없다.

# 58. Snapshot Ownership Token

각 snapshot은 unique ownership identity를 가진다.

```text
snapshotId
ownershipToken
rootNode identity
sessionId
builtRequestGeneration provenance
```

attach 전후에 WeakMap/dataset 등으로 root ownership을 검증한다.

HARD RULE:

```text
clone으로 ownership token을 복제해 canonical snapshot으로 인정 금지
rootNode identity mismatch → activation FAIL
session mismatch → activation FAIL
key mismatch → activation FAIL
builtRequestGeneration old → 정상일 수 있음
```

# 59. Snapshot READY / Reuse Contract

Snapshot 생성:

```text
BuildAttemptState == SUCCEEDED
AND SNAPSHOT_COMMON_HARD_GATE == PASS
AND mode-specific snapshot gate == PASS
```

공통 session binding:

```text
snapshot.sessionId == requestedTargetSessionId
```

same-session:

```text
requestedTargetSessionId = currentSessionId
```

SOURCE_CHANGE:

```text
requestedTargetSessionId = pending.targetSessionId
```

READY 재사용:

```text
status == READY
snapshot.sessionId == requestedTargetSessionId
key == expected key
ownership PASS
common gate evidence valid
mode-specific gate evidence valid
```

금지:

```text
snapshot.builtRequestGeneration == currentRequestGeneration
```

# 60. Cache Hit Contract

cache hit 성공 시:

```text
SNAPSHOT_COMMON_HARD_GATE evidence valid
session/key/ownership PASS
current requestGeneration latest
```

이어야 하며 다음 비용은 0이어야 한다.

```text
authoritativeBuildCount == 0
mathJaxCalls == 0
imageWaitCount == 0
fontWaitCount == 0
measurementCount == 0
paginationCount == 0
DOMRebuildCount == 0
QRRedrawCount == 0
snapshotCloneCount == 0
```

허용:

```text
root MOVE
synchronous committed-state/UI update
history update
screen-fit recalc
post-commit paint
```

# 61. Cache Hit Performance Target

Phase 0 baseline 후 최종 freeze.

초기 설계 목표:

Desktop Chrome:

```text
click → visible committed paint
P50 <= 50ms
P95 <= 100ms
```

Mobile:

```text
P95 <= 150ms
```

이 수치는 promotion target이지 correctness invariant가 아니다.

---

# 62. Cache Miss Performance Target

snapshot cache 이후 첫 render도 줄이기 위해 batching을 적용.

목표:

```text
current baseline 대비 P50 renderReadyMs 30% 이상 개선 후보
```

실제 target은 Phase 0 baseline 후 확정.

---

# 63. Current UI Background 성능 조사

최근 screen background 디자인과 체감 성능은 별도 trace로 검증한다.

확인:

```text
Paint
Composite
Raster
full viewport repaint
background layer invalidation
filter/backdrop-filter
fixed pseudo layer
gradient
```

단 Fast Engine 설계와 원인 판단을 혼동하지 않는다.

---

# 64. Screen Paint Containment

후보:

```text
#screen-background
#mode-ctrl
#render-viewport
```

구조 분리.

`contain: paint` 등은 실제 print/screen parity 확인 후만 적용.

---

# 65. Canonical Actual Render Review

Fast Engine v2 구현 후에도 최종 검수는 repository canonical engine 실제 browser render만 인정.

필수 모드:

```text
exam
solution
answer
```

필수 profile:

```text
desktop
mobile
```

검수:

```text
question count
last question
continuations
SVG/PNG decode
MathJax
clipping
vertical/horizontal overflow
readability
layoutTag/wide
imageSize
excessive whitespace
over-shrink
console/load errors
```

---

# 66. Performance Fixture Inventory

Phase 0에서 denominator 먼저 고정.

최소:

```text
A. 일반 객관식 중심
B. 이미지/SVG 다수
C. 긴 해설 다수
D. continuation 발생
E. subjective-2up / 4up
F. fullwidth / wide
G. 30~40문항 규모
H. answer overflow/refit 발생 가능
I. QR 포함
J. print header 변경 영향
```

표본이 아니라 구현 promotion에 사용될 fixture set을 전부 명시한다.

---

# 67. Baseline Metrics

각 fixture:

```text
initial exam render
exam → sol first
sol → ans first
ans → exam return
exam → sol return
header change
QR change
QPP change
```

각각 최소 반복 수를 고정한다.

기록:

```text
renderReadyMs
visibleReadyMs
MathJax calls
MathJax total ms
font wait
image wait
measurement
layout
materialization
RAF/layout barriers
page count
node count
Paint/Layout/Scripting
```

---

# 68. Snapshot Regression Matrix

mutation별 기대:

| Mutation | Snapshot 처리 |
|---|---|
| content | invalidate relevant/all |
| choices | exam invalidate |
| answer | ans + sol invalidate |
| solution | sol invalidate |
| image | exam invalidate |
| solutionImage | sol invalidate |
| imageSize | 해당 mode invalidate |
| solutionImageSize | sol invalidate |
| layoutTag | exam/layout invalidate |
| qpp | layout snapshot invalidate |
| page CSS geometry | all invalidate |
| toolbar color | page snapshot keep |
| screen background | page snapshot keep |
| font family/weight | all invalidate |
| executor version | relevant/all invalidate |
| QR policy | QR-bearing snapshot invalidate |
| QR payload | QR-bearing snapshot invalidate |
| print header geometry | relevant/all invalidate |

v2 1차에서는 selective invalidation이 불확실하면 전체 session invalidation을 선택한다.

---

# 69. Print Validation Regression Matrix

cache hit snapshot에서 인쇄:

```text
PASS path
fingerprint mismatch
font mismatch
asset mismatch
QR mismatch
ownership mismatch
unrendered math > 0
overflow detected
snapshot stale
```

각 경우가 올바르게 rebuild/block되는지 확인한다.

---

# 70. Build Host Geometry Fixture

active host vs build host:

```text
question raw/tight
solution box raw/tight
chunk raw/tight
page clientHeight
page width
line wrapping
image size
MathJax equation width/height
page count
continuation count
```

전부 비교한다.

---

# 71. Render State 2PC / Session / requestGeneration Regression

강제 실패 및 stale 상황을 전수 테스트한다.

예:

```text
solution MathJax failure
image timeout
font mismatch
layout throw
candidate validation failure
source load failure
stale requestGeneration
snapshot ownership mismatch
history commit throw simulation
precommit effect success + commit abort
```

PREPARE 실패 기대:

```text
previous screen remains
committed AppState unchanged
URL unchanged
tab unchanged
currentSession unchanged
foreground committed side effect == 0
```

COMMIT 중 throw 기대:

```text
rollback journal 실행
previous root/state/session/status restored
COMMIT_SUCCESS == false
```

SOURCE_CHANGE:

```text
pending target snapshot은 requestedTargetSessionId에 귀속
current session은 target commit 전까지 보존
```

Snapshot provenance test:

```text
BUILD ans at requestGeneration=1
activate exam at requestGeneration=2
request ans at requestGeneration=3
→ ans builtRequestGeneration=1이어도 session/key/ownership이 같으면 cache HIT
```

Side-effect compensation test:

```text
precommit effect ACK
→ synchronous COMMIT forced abort
→ compensation ledger 생성
→ frozen compensation policy 수행
→ required compensation unresolved == 0 before full seal
```

# 72. Runtime Ownership Regression

모든 기존 direct render caller inventory를 만든다.

최종:

```text
TOTAL_RENDER_ENTRY_POINTS = N
ROUTED_THROUGH_RUNTIME = N
DIRECT_BYPASS = 0
```

---

# 73. Background Side Effect Regression

prewarm/build 중:

```text
OS registration
history push
assignment creation
QR committed state
analytics
storage mutation
```

등이 실행되지 않는지 확인.

---

# 74. Metrics Isolation Regression

foreground exam render와 background sol prewarm을 연달아 수행했을 때:

```text
transactionId별 metric이 섞이지 않을 것
```

---

# 75. Phase 6 Pure Layout Promotion

가장 마지막.

현재 executor-owned pagination을 삭제하지 않고 dual-run.

```text
CURRENT executor result
vs
Layout Authority plan
```

비교.

---

# 76. Phase 6 Promotion Gate

```text
QUESTION_COUNT_PARITY
PAGE_COUNT_PARITY
SOURCE_REF_ORDER_PARITY
BLOCK_PLACEMENT_PARITY
COLUMN_PARITY
CONTINUATION_PARITY
LAYOUT_TAG_PARITY
OVERFLOW_PARITY
RENDER_GEOMETRY_PARITY
FINAL_SCREEN_VISUAL_PARITY
```

전부 PASS 후 default 변경.

---

# 77. Feature Flags

권장:

```text
?screenRuntime=legacy
?screenRuntime=fast

?snapshotCache=0|1

?measurement=legacy
?measurement=batch

?layoutPlanner=observed
?layoutPlanner=authority
```

---

# 78. Promotion 순서

```text
Phase 0
  Frozen-SHA baseline
  render entry inventory
  side-effect contract freeze

Phase 1A
  CandidateRenderState
  canonical intent
  runtime ownership
  transaction context
  Render State 2PC
  synchronous atomic commit/rollback
  latest-wins

Phase 1B
  Answer Snapshot pilot

Phase 1C
  Solution Snapshot

Phase 1D
  Exam Snapshot

Phase 2
  Connected layout-active build host
  atomic background build

Phase 3
  Solution first-render high-cost path optimization
  - frozen baseline에서 MathJax/chunk/measurement가 계속 주 병목인 경우
  - typeset call collapse/batching
  - solution box/chunk measurement batching

Phase 4
  Exam measurement batching
  - per-question layout barrier 제거
  - batch read/write

Phase 5
  Idle prewarm + cancellation

Phase 6
  Pure Layout Authority promotion

Phase 7
  Legacy path retirement 검토
```

Phase 3의 정확한 내부 최적화 순서는 **Phase 0 fixed-SHA baseline이 기존 45-call/solution-dominant signature를 재현하는지 확인한 뒤 freeze**한다. 재현되지 않으면 같은 원칙으로 frozen baseline의 실제 최고비용 path를 우선한다.

# 79. Phase별 commit 권장

```text
1. docs/perf: freeze archive render baseline and side-effect contract
2. refactor(archive): add candidate render state and canonical render intents
3. refactor(archive): route all render entries through screen runtime
4. refactor(archive): add transaction context, latest-wins and synchronous 2PC commit
5. perf(archive): cache answer snapshot pilot
6. perf(archive): cache solution mode snapshot
7. perf(archive): cache exam mode snapshot
8. perf(archive): add connected layout-active build host
9. perf(archive): optimize frozen highest-cost first-render path
10. perf(archive): batch remaining measurements
11. perf(archive): add cancellable idle prewarm
12. perf(archive): promote layout planner after parity
```

성능 조사에서는 solution이 압도적으로 비쌌으므로 Answer pilot 뒤 snapshot 적용은 Solution을 Exam보다 우선한다.

다만 내부 first-render optimization의 상세 순서는 **Phase 0 frozen-SHA 재측정 결과**로 확정한다.

# 80. 구현 파일 설계

## 신규 `archive/screen-runtime.js`

책임:

```text
canonical RenderIntent
CandidateRenderState orchestration
RenderSession / PendingRenderSession
BuildAttemptState / ModeSnapshot
requestGeneration/latest-wins
all render request serialization
Render State 2PC
synchronous commit/rollback
snapshot ownership/status transition
session promotion/retirement
prewarm scheduling
```

---

## 신규 `archive/render-state-normalizer.js`

책임:

```text
render-affecting value schema
copy → normalize → recursive freeze
CanonicalRenderDataSnapshot
CandidateRenderState construction
transitive immutability assertion
semantic digest
```

외부 raw object를 in-place freeze하지 않는다.

`screen-runtime.js` 내부 모듈로 시작해도 되지만 contract는 분리한다.

---

## 신규 또는 내부 `archive/render-transaction-context.js`

책임:

```text
transactionId
requestGeneration
currentSessionId
targetSessionId
pendingSession
candidate
buildState
target/staging/build host
readiness/metrics
abort signal
side-effect permission
```

---

## 신규 `archive/render-fingerprint.js`

책임:

```text
canonical render data fingerprint
engine/render/layout/executor fingerprint
font/asset fingerprint
QR policy/payload fingerprint
header/profile/page-layout fingerprint
snapshot key
```

---

## 신규 또는 확장 `archive/snapshot-print-adapter.js`

책임:

```text
active snapshot revalidation
PRINT_SNAPSHOT_PREFLIGHT_GATE
new print readiness transaction
stored evidence rebind
current DOM preflight
stale rebuild decision
```

---

## 신규 또는 확장 `archive/side-effect-ledger.js`

책임:

```text
frozen SideEffectContract
idempotency key
execution ledger
retry/ack/terminal state
required-effect counters
```

실제 inventory 결과상 불필요하면 runtime 내부로 둘 수 있다.

---

## 수정 `archive/engine.html`

변경 범위는 mode만이 아니다.

다음 모든 render-affecting mutation을 Runtime Intent로 라우팅한다.

```text
MODE_CHANGE
HEADER_CHANGE
QR_CHANGE
QPP_CHANGE
SOURCE_CHANGE
PROFILE_CHANGE
FONT/ASSET/PAGE_LAYOUT/ENGINE invalidation
FORCED_REBUILD
PRINT_STALE_REBUILD
```

추가:

```text
mutable AppState 선변경 제거
CandidateRenderState 기반 build
PendingRenderSession SOURCE_CHANGE
synchronous full Render State commit
snapshot READY↔ACTIVE status commit
commit 후 side-effect coordinator
connected build host
```

---

## 수정 `archive/mathjax_render_loop.js`

```text
transaction-scoped metrics
requestGeneration
sessionId/targetSessionId
mathRuntimeReady
mathTypesetComplete
visibleReadyMs
layout barriers
```

request/provenance canonical 이름 외 별칭 사용 금지.

---

## 수정 `archive/print-runtime.js`

기존 readiness 순서 유지.

snapshot을 새 Print Validation Transaction에 재결박.

---

## 수정 `archive/exam-render-executor.js`

Phase 1:
immutable candidate/dependency view와 snapshot compatibility.

Phase 4:
measurement batching.

---

## 수정 `archive/solution-render-executor.js`

Phase 1C:
immutable candidate/dependency view와 snapshot compatibility.

Phase 3:
frozen baseline이 solution dominant면 MathJax/measurement 최적화.

---

## 수정 `archive/answer-render-executor.js`

Phase 1B snapshot pilot.

---

## 유지/검증 `archive/render-authority.js` + `archive/print-contract.js`

Phase 0에서 canonical data의 **실제 transitive immutability 보장 범위**를 확인한다.

Fast Runtime은 보장되지 않은 nested/raw reference를 immutable하다고 가정하지 않는다.

---

## 유지/확장 `archive/layout-authority.js`

Phase 1~5 parity/promotion evidence.
Phase 6 production pure planner target.

# 81. Public API 스케치

```js
const runtime = APScreenRuntime.create({
  build: authoritativeBuild,
  computeSnapshotKey,
  validateSnapshot,
  validateForPrint,
  onCommit,
  onMetrics
});
```

초기화:

```js
await runtime.beginSession({
  sourceArchiveFile: AppState.sourceArchiveFile,
  canonicalData: AppState.canonicalData,
  initialMode: AppState.mode,
  qpp: AppState.qpp
});
```

---

# 82. Mode Request API

```js
await runtime.request({
  type: RenderIntentType.MODE_CHANGE,
  requestedMode: mode,
  foreground: true
});
```

runtime 내부:

```text
intent normalize
→ requestGeneration
→ CandidateRenderState
→ PREPARE
→ READY snapshot lookup or authoritative build
→ all validation
→ latest request check
→ synchronous COMMIT
→ post-commit rAF/paint proxy
→ visibleReady metric
```

HARD RULE:

```text
visible frame wait BEFORE COMMIT == forbidden
COMMIT 내부 await == 0
```

# 83. Header Request API

```js
runtime.request({
  type: RenderIntentType.HEADER_CHANGE,
  payload: { printHeaderOptions: nextHeaderValue },
  foreground: true
});
```

payload는 바로 AppState에 쓰지 않고 immutable CandidateRenderState delta로 사용한다.

rapid typing은 latest-wins/coalescing 규칙을 따른다.

# 84. QR Request API

```js
runtime.request({
  type: RenderIntentType.QR_CHANGE,
  payload: { qrState: nextQrValue },
  foreground: true
});
```

QR policy와 실제 payload fingerprint를 candidate에서 다시 계산한다.

global QR state를 build 전에 선변경하지 않는다.

# 85. Print Request API

```js
await runtime.preparePrint({
  mode: AppState.mode
});
```

내부:

```text
active snapshot resolve
→ expected key
→ new print validation transaction
→ evidence revalidate/replay
→ DOM preflight
→ PRINT_READY
```

---

# 86. Build Contract

```js
async function authoritativeBuild(ctx) {
  // render semantics read only from ctx.candidate
  return {
    targetSessionId: ctx.targetSessionId,
    rootNode,
    buildState,
    evidence: {
      candidateImmutability,
      dataReady,
      mathRuntimeReady,
      mathTypesetComplete,
      unrenderedMathCount,
      imageReady,
      fontReady,
      layoutReady,
      renderReady
    },
    metrics,
    pageCount
  };
}
```

HARD:

```text
BUILD_RESULT_TARGET_SESSION_ID == ctx.targetSessionId
BUILD_INPUT_DIGEST == CANDIDATE_SEMANTIC_DIGEST
MUTABLE_GLOBAL_RENDER_INPUT_READ_COUNT == 0
```

# 87. Commit Contract

COMMIT은 runtime만 수행한다.

builder/executor는 금지:

```text
AppState committed mutation
history push/replace
active tab final state
current session pointer mutation
snapshot ACTIVE/READY status mutation
foreground business side effect
```

builder는 PREPARE 결과만 반환한다.

---

## 87.1 Same-session COMMIT status transition

같은 session mode/state 전환:

```text
oldSnapshot.status == ACTIVE
targetSnapshot.status == READY
```

synchronous commit 안에서:

```text
oldSnapshot.status = READY
targetSnapshot.status = ACTIVE
session.activeSnapshotKey = targetSnapshot.key
session.activeMode = targetSnapshot.mode
```

root MOVE/pointer/AppState/UI/URL commit과 같은 task에서 수행한다.

---

## 87.2 SOURCE_CHANGE COMMIT status/session transition

```text
targetSnapshot.status = ACTIVE
pendingSession → CURRENT
currentSession pointer → targetSession
```

old session의 active snapshot은 rollback 가능한 상태로 보존한 뒤 old session을 `RETIRED_PENDING_CLEANUP`로 표시한다.

old snapshot EVICT는 post-commit cleanup에서 수행한다.

---

## 87.3 Status rollback

COMMIT 중 throw:

```text
oldSnapshot.status restore
targetSnapshot.status restore
session/current pointer restore
root restore
AppState/UI restore
```

Print Gate가 `status == ACTIVE`를 요구하므로 status mutation 누락은 HARD FAIL이다.

# 88. Side Effect Execution / Compensation Contract

Phase 0에서 freeze된 `SIDE_EFFECT_CONTRACT_MATRIX`가 authority다.

---

## 88.1 logical effect creation

한 trigger event에 대해 required logical effect는 한 번만 생성한다.

```text
DUPLICATE_LOGICAL_EFFECT_CREATION_COUNT == 0
```

---

## 88.2 retry

retry는 같은 logical effect의 새 attempt다.

```text
same logicalEffectId
same idempotencyKey
attempt += 1
```

HARD:

```text
RETRY_IDEMPOTENCY_KEY_MISMATCH_COUNT == 0
RETRY_LOGICAL_EFFECT_ID_MISMATCH_COUNT == 0
```

---

## 88.3 execution

```text
PENDING
→ RUNNING
→ ACKNOWLEDGED
   or FAILED_RETRYABLE
   or FAILED_TERMINAL
```

---

## 88.4 precommit compensation

허용된 `BLOCK_BEFORE_COMMIT` effect가 ACK된 뒤 COMMIT abort가 나면:

```text
COMPENSATION_PENDING
→ COMPENSATION_RUNNING
→ COMPENSATED
   or COMPENSATION_FAILED_RETRYABLE
   or COMPENSATION_FAILED_TERMINAL
```

full operation seal 전에:

```text
UNRESOLVED_REQUIRED_COMPENSATION_COUNT == 0
```

필수.

---

## 88.5 required execution

```text
EXPECTED_REQUIRED_EFFECT_COUNT
ACKNOWLEDGED_REQUIRED_EFFECT_COUNT
MISSED_REQUIRED_EFFECT_COUNT
UNRESOLVED_REQUIRED_EFFECT_COUNT
```

fully-complete seal:

```text
MISSED_REQUIRED_EFFECT_COUNT == 0
UNRESOLVED_REQUIRED_EFFECT_COUNT == 0
UNRESOLVED_REQUIRED_COMPENSATION_COUNT == 0
```

---

## 88.6 background

```text
BACKGROUND_SIDE_EFFECT_COUNT == 0
UNCLASSIFIED_SIDE_EFFECT_EXECUTION_COUNT == 0
```

# 89. Renderer Metrics Hard Invariants

cache hit:

```text
CACHE_STATUS == HIT
AUTHORITATIVE_BUILD_COUNT == 0
MATHJAX_CALLS == 0
IMAGE_WAIT_COUNT == 0
MEASUREMENT_COUNT == 0
PAGINATION_COUNT == 0
DOM_REBUILD_COUNT == 0
SNAPSHOT_CLONE_COUNT == 0
```

background:

```text
SIDE_EFFECT_COUNT == 0
```

stale build:

```text
COMMIT_COUNT == 0
```

---

# 90. Correctness Hard Invariants

COMMIT 성공 직후 같은 synchronous task 종료 시:

```text
ACTIVE_MODE == AppState.mode
ACTIVE_MODE == URL_MODE
ACTIVE_TAB == AppState.mode
ACTIVE_SNAPSHOT.mode == AppState.mode

ACTIVE_SNAPSHOT.sessionId == currentSession.sessionId
ACTIVE_SNAPSHOT.key == expectedKey(committed CandidateRenderState)
ACTIVE_SNAPSHOT.ownership == PASS

COMMITTED_QPP == AppState.qpp
COMMITTED_HEADER == AppState.printHeaderOptions semantic state
COMMITTED_QR_STATE == active QR semantic state
COMMITTED_SOURCE == current session source
```

그리고:

```text
INTERMEDIATE_VISIBLE_FRAME_WITH_MIXED_STATE == 0
```

을 요구한다.

# 91. Print Hard Invariants

별도 축약 invariant 목록을 두지 않는다.

Print HARD Gate는 정확히:

```text
PRINT_SNAPSHOT_PREFLIGHT_GATE (§23) == PASS
AND
new current Print Validation Transaction reaches PRINT_READY in canonical order
```

다.

즉 §23의 P01~P23 전체가 Print Hard Invariant denominator다.

추가:

```text
PRINT_TRANSACTION_IS_CURRENT == PASS
PRINT_TRANSACTION_BOUND_SNAPSHOT_ID == ACTIVE_SNAPSHOT_ID
OLD_PRINT_TRANSACTION_REUSED == false
```

# 92. Build Host Hard Invariants

```text
CONNECTED == true
DISPLAY_NONE == false
LAYOUT_ACTIVE == true
PAGE_GEOMETRY_PARITY == PASS
FONT_FINGERPRINT_PARITY == PASS
```

---

# 93. Snapshot Hard Invariants

```text
CANONICAL_CLONE == false
OWNERSHIP_TOKEN unique
READY only after SNAPSHOT_COMMON_HARD_GATE
STALE never activate
EVICTED never activate
stale build result never creates snapshot

RENDER_AFFECTING_TRANSITIVE_IMMUTABILITY == PASS
KEY_INPUT_DIGEST == BUILD_INPUT_DIGEST

same-session requestedTargetSessionId == currentSessionId AND snapshot.sessionId == requestedTargetSessionId
pending source snapshot.sessionId == requestedTargetSessionId

builtRequestGeneration is provenance only
snapshot validity does not compare it to currentRequestGeneration

ACTIVE/READY status transition occurs inside synchronous COMMIT
```

# 94. Invalidation 우선 원칙

성능과 correctness가 충돌하면 invalidate/rebuild를 선택한다.

Fast Engine v2는 stale cache 적중률보다 **틀린 화면 0건**이 우선이다.

---

# 95. Memory / Session Residency 정책

v2 1차의 **persistent cache residency**:

```text
CURRENT RenderSession만 장기 cache residency 허용
CURRENT session 내 max 3 mode snapshots
```

그러나 SOURCE_CHANGE transition 중에는 예외가 필요하다.

허용되는 transient residency:

```text
1. current session A
2. pending session B
3. COMMIT 직후 retired A cleanup window
```

즉:

```text
PERSISTENT_MULTI_SESSION_CACHE == FORBIDDEN
TRANSITION_SCOPED_PENDING_SESSION == ALLOWED
TRANSITION_SCOPED_RETIRED_CLEANUP_SESSION == ALLOWED
```

Pending/retired session은 user-navigation cache로 유지하지 않는다.

HARD:

```text
PENDING_SESSION_SURVIVES_ABORT == false
RETIRED_SESSION_SURVIVES_CLEANUP_COMPLETION == false
```

메모리 문제가 실측되기 전에는 LRU/persistent cross-source cache를 도입하지 않는다.

# 96. Persistent Cache 금지

v2 1차에서:

```text
localStorage DOM cache
IndexedDB rendered HTML cache
cross-session MathJax CHTML cache
```

금지.

동일 browser page session snapshot만 사용.

---

# 97. Framework Migration 금지

React/Vue/Svelte 등으로 바꾸지 않는다.

현재 병목은 framework absence가 아니다.

---

# 98. Canvas Full Renderer 금지

text semantics/print fidelity/MathJax/evidence 구조를 훼손할 수 있으므로 금지.

QR canvas 등 기존 부분적 canvas는 유지 가능.

---

# 99. 별도 Fast Renderer 금지

Fast runtime은 canonical `engine.html` 안에 있어야 한다.

---

# 100. Legacy Removal 정책

Fast path가 충분히 검증되더라도 legacy path를 즉시 삭제하지 않는다.

먼저:

```text
usage telemetry/evidence
rollback flag
full parity
```

확인 후 별도 release에서 제거 판단.

---

# 101. Phase 0 착수/완료 체크리스트

## 101.1 Baseline / source inventory

- [ ] one main HEAD freeze
- [ ] render entry inventory
- [ ] direct render caller inventory
- [ ] mode/header/QR/qpp/source/profile mutation caller inventory
- [ ] performance fixture denominator
- [ ] fixed-SHA mode-switch baseline
- [ ] Chrome trace
- [ ] build-host geometry prototype

## 101.2 Immutability inventory

- [ ] `print-contract.js` canonical object freeze 범위 확인
- [ ] `render-authority.js` canonicalData nested immutability 확인
- [ ] `choices` / sourceRef / sourcePayload / metadata nested reference inventory
- [ ] builder가 실제 읽는 render-affecting field denominator
- [ ] `CanonicalRenderDataSnapshot` schema freeze
- [ ] external raw object in-place freeze 금지 확인

Gate:

```text
CANONICAL_RENDER_INPUT_SCHEMA_FROZEN == PASS
CANDIDATE_IMMUTABILITY_STRATEGY_FROZEN == PASS
```

## 101.3 SOURCE_CHANGE/session inventory

- [ ] current source-load path
- [ ] source/canonicalize failure paths
- [ ] session identity requirements
- [ ] old MathJax/DOM cleanup requirements
- [ ] pending session promotion/abort/cleanup lifecycle freeze

Gate:

```text
PENDING_SESSION_LIFECYCLE_FROZEN == PASS
```

## 101.4 Side-effect contract freeze

- [ ] all side effects inventoried
- [ ] trigger class
- [ ] delivery guarantee
- [ ] failure policy
- [ ] idempotency capability/key
- [ ] retry/terminal policy
- [ ] required-effect completion semantics

Canonical Gate IDs:

```text
SIDE_EFFECT_INVENTORY_COMPLETE
SIDE_EFFECT_CONTRACT_MATRIX_FROZEN
SIDE_EFFECT_IDEMPOTENCY_RULES_FROZEN
SIDE_EFFECT_FAILURE_POLICY_FROZEN
SIDE_EFFECT_COMPENSATION_POLICY_FROZEN
```

## 101.5 Baseline Gate

최종 성능 기준은:

```text
ONE FROZEN SHA
ONE FIXTURE SET
ONE BROWSER/VIEWPORT PROFILE
NO MID-RUN MERGE
```

에서만 freeze.

Canonical baseline Gate ID:

```text
PHASE0_BASELINE_FROZEN
```

Phase 0 완료:

```text
PHASE0_BASELINE_FROZEN == PASS
RENDER_ENTRY_INVENTORY_COMPLETE == PASS
CANONICAL_RENDER_INPUT_SCHEMA_FROZEN == PASS
CANDIDATE_IMMUTABILITY_STRATEGY_FROZEN == PASS
PENDING_SESSION_LIFECYCLE_FROZEN == PASS
SIDE_EFFECT_INVENTORY_COMPLETE == PASS
SIDE_EFFECT_CONTRACT_MATRIX_FROZEN == PASS
SIDE_EFFECT_IDEMPOTENCY_RULES_FROZEN == PASS
SIDE_EFFECT_FAILURE_POLICY_FROZEN == PASS
SIDE_EFFECT_COMPENSATION_POLICY_FROZEN == PASS
```

# 102. Phase 1A 진입/완료 정의

## 102.1 Entry Gate

Phase 0의 아래 canonical IDs를 그대로 사용한다.

```text
PHASE0_BASELINE_FROZEN == PASS
RENDER_ENTRY_INVENTORY_COMPLETE == PASS
CANONICAL_RENDER_INPUT_SCHEMA_FROZEN == PASS
CANDIDATE_IMMUTABILITY_STRATEGY_FROZEN == PASS
PENDING_SESSION_LIFECYCLE_FROZEN == PASS

SIDE_EFFECT_INVENTORY_COMPLETE == PASS
SIDE_EFFECT_CONTRACT_MATRIX_FROZEN == PASS
SIDE_EFFECT_IDEMPOTENCY_RULES_FROZEN == PASS
SIDE_EFFECT_FAILURE_POLICY_FROZEN == PASS
SIDE_EFFECT_COMPENSATION_POLICY_FROZEN == PASS
```

하나라도 FAIL/NOT_TESTED면 Phase 1A 구현 금지.

## 102.2 Completion Gate

```text
CANONICAL_INTENT_ENUM == PASS
CANDIDATE_RENDER_STATE == PASS
RENDER_AFFECTING_TRANSITIVE_IMMUTABILITY == PASS
KEY_INPUT_DIGEST_BUILD_INPUT_DIGEST_PARITY == PASS

ALL_RENDER_ENTRY_ROUTED == PASS
RENDER_TRANSACTION_CONTEXT == PASS
PENDING_RENDER_SESSION == PASS
PENDING_TO_CURRENT_MATERIALIZATION_GATE == PASS
PENDING_TARGET_SESSION_ID_PARITY == PASS

RENDER_STATE_2PC == PASS
SYNCHRONOUS_ATOMIC_COMMIT == PASS
SNAPSHOT_STATUS_COMMIT == PASS
COMMIT_ROLLBACK == PASS

REQUEST_GENERATION_STALENESS_ONLY == PASS
DIRECT_RENDER_BYPASS == 0

SIDE_EFFECT_DELIVERY_FAILURE_CONTRACT == PASS
SIDE_EFFECT_COMPENSATION_CONTRACT == PASS
BACKGROUND_SIDE_EFFECT_COUNT == 0
```

# 103. SNAPSHOT_COMMON_PROMOTION_GATE

Answer/Exam/Solution 모든 snapshot phase는 먼저 아래 공통 조건을 전부 상속한다.

```text
SNAPSHOT_COMMON_HARD_GATE == PASS
NO_CANONICAL_CLONE == PASS
MATH_TYPESET_COMPLETENESS == PASS
FONT_READINESS == PASS
IMAGE_ASSET_READINESS == PASS
CACHE_HIT_NO_REBUILD == PASS
PRINT_REVALIDATION == PASS
ACTUAL_RENDER_VISUAL_PARITY_DESKTOP == PASS
ACTUAL_RENDER_VISUAL_PARITY_MOBILE == PASS
INVALIDATION_MATRIX == PASS
OWNERSHIP == PASS
```

mode별 완료 정의는 이 공통 Gate를 축약/대체할 수 없다.

# 104. Phase 1B — Answer Snapshot Pilot 완료 정의

```text
SNAPSHOT_COMMON_PROMOTION_GATE == PASS
ANSWER_SNAPSHOT_BUILD == PASS
ANSWER_CACHE_HIT == PASS
ANSWER_COUNT_ORDER_PARITY == PASS
ANSWER_GROUPING_PARITY == PASS
ANSWER_PAGE_OVERFLOW_REFIT_PARITY == PASS
```

Answer는 성능 이득 자체보다 runtime/snapshot lifecycle의 저위험 pilot 역할이다.

# 105. Phase 1C/1D — Solution → Exam Snapshot 완료 정의

## Phase 1C — Solution Snapshot

성능 조사에서 가장 비싼 mode였으므로 Answer pilot 성공 후 Solution Snapshot을 우선한다.

```text
SNAPSHOT_COMMON_PROMOTION_GATE == PASS
SOLUTION_SNAPSHOT_BUILD == PASS
SOLUTION_CACHE_HIT == PASS
CONTINUATION_PARITY == PASS
SOLUTION_IMAGE_PARITY == PASS
SOLUTION_LEDGER_PARITY == PASS
CHUNK/SHELL OWNERSHIP == PASS
```

## Phase 1D — Exam Snapshot

```text
SNAPSHOT_COMMON_PROMOTION_GATE == PASS
EXAM_SNAPSHOT_BUILD == PASS
EXAM_CACHE_HIT == PASS
EXAM_LAYOUT_LEDGER_PARITY == PASS
EXAM_IMAGE_PARITY == PASS
QPP/LAYOUTTAG/WIDE_PARITY == PASS
```

# 106. Phase 2 완료 정의

```text
BUILD_HOST_GEOMETRY_PARITY == PASS
ATOMIC_BACKGROUND_BUILD == PASS
NO_BLANK_FRAME == PASS
FAILED_BUILD_PRESERVES_ACTIVE == PASS
BACKGROUND_SIDE_EFFECT_COUNT == 0
```

---

# 107. Phase 3 완료 정의 — Solution First-Render Optimization

Phase 0에서 solution dominant 병목이 재현된 경우:

```text
SOLUTION_MATHJAX_CALL_REDUCTION == PASS
SOLUTION_BATCH_MEASUREMENT_PARITY == PASS
CONTINUATION_PARITY == PASS
SOLUTION_IMAGE_PARITY == PASS
SOLUTION_LAYOUT_BARRIER_REDUCTION == PASS
SOLUTION_FIRST_RENDER_PERF_IMPROVEMENT == PASS
SOLUTION_ACTUAL_RENDER_VISUAL_PARITY == PASS
```

MathJax call 수의 절대 목표는 baseline 후 freeze한다. 단 correctness를 위해 필요한 typeset boundary를 근거 없이 1회로 강제하지 않는다.

baseline이 다른 최고비용 path를 보여주면 Phase 3 대상은 그 path로 재동결하되 동일 parity/performance gate를 적용한다.

# 108. Phase 4 완료 정의 — Exam Measurement Batch

```text
EXAM_BATCH_MEASUREMENT_PARITY == PASS
EXAM_RAW_TIGHT_GEOMETRY_PARITY == PASS_WITH_FROZEN_TOLERANCE
EXAM_PAGE_COUNT_PARITY == PASS
EXAM_PLACEMENT_PARITY == PASS
EXAM_OVERFLOW_PARITY == PASS
EXAM_LAYOUT_BARRIER_REDUCTION == PASS
EXAM_ACTUAL_RENDER_VISUAL_PARITY == PASS
```

# 109. Phase 5 완료 정의

```text
PREWARM_CANCEL == PASS
LATEST_WINS == PASS
FOREGROUND_PRIORITY == PASS
FIRST_RENDER_NO_REGRESSION == PASS
BACKGROUND_SIDE_EFFECT_COUNT == 0
```

---

# 110. Phase 6 완료 정의

```text
LAYOUT_AUTHORITY_PRODUCTION_PROMOTION == PASS
ALL_PARITY_GATES == PASS
ACTUAL_RENDER_PARITY == PASS
```

---

# 111. 최종 Fast Engine v2 완료 정의

```text
CORRECTNESS_PARITY == PASS
ACTUAL_RENDER_PARITY == PASS
CACHE_INVALIDATION == PASS

RENDER_AFFECTING_TRANSITIVE_IMMUTABILITY == PASS
KEY_INPUT_DIGEST_BUILD_INPUT_DIGEST_PARITY == PASS

PENDING_SESSION_LIFECYCLE == PASS
PENDING_TARGET_SESSION_ID_PARITY == PASS
PENDING_TO_CURRENT_MATERIALIZATION_GATE == PASS
SOURCE_CHANGE_FAILURE_PRESERVES_CURRENT_SESSION == PASS
OLD_SESSION_EVICT_AFTER_NEW_COMMIT == PASS

SNAPSHOT_OWNERSHIP == PASS
SNAPSHOT_STATUS_COMMIT == PASS
RENDER_STATE_2PC == PASS
SYNCHRONOUS_ATOMIC_COMMIT == PASS

PRINT_READINESS == PASS
MATH_TYPESET_COMPLETENESS == PASS
FONT_READINESS == PASS
QR_PAYLOAD_PARITY == PASS

LATEST_WINS == PASS
BACKGROUND_TRANSACTION_ISOLATION == PASS

SIDE_EFFECT_CONTRACT_MATRIX == PASS
MISSED_REQUIRED_EFFECT_COUNT == 0
UNRESOLVED_REQUIRED_EFFECT_COUNT == 0
UNRESOLVED_REQUIRED_COMPENSATION_COUNT == 0  // fully-complete seal

CACHE_HIT_MATHJAX_CALLS == 0
CACHE_HIT_IMAGE_WAIT == 0
CACHE_HIT_MEASUREMENT == 0
CACHE_HIT_PAGINATION == 0
CACHE_HIT_DOM_REBUILD == 0
CACHE_HIT_CLONE == 0

NO_REGRESSION_FIRST_RENDER == PASS
MODE_SWITCH_P95 <= FROZEN_TARGET
```

# 112. 구현 착수 판정

v1.2 기준:

```text
READY FOR PHASE 0 BASELINE = YES
READY FOR PHASE 1A IMPLEMENTATION = ONLY AFTER §102.1 ENTRY GATE
READY FOR SNAPSHOT IMPLEMENTATION = ONLY AFTER PHASE 1A PASS
READY FOR DIRECT FULL IMPLEMENTATION = NO
```

실제 순서:

```text
Phase 0
baseline + render entry inventory + side-effect contract freeze

↓
Phase 1A
CandidateRenderState
canonical RenderIntent
runtime ownership
RenderTransactionContext
latest-wins
Render State 2PC
synchronous atomic commit + rollback

↓
Phase 1B
Answer Snapshot pilot

↓
Phase 1C
Solution Snapshot

↓
Phase 1D
Exam Snapshot
```

# 113. v1.0 → v1.1 P0 Closure Map

## P0-1 Mode 전환 상태 commit 순서

봉인:

```text
§4 2-Phase Commit
§87 Commit Contract
§90 Correctness Hard Invariants
```

상태:

```text
CLOSED_BY_DESIGN
```

---

## P0-2 모든 render 진입점 ownership

봉인:

```text
§5 Render Intent
§5.3 DIRECT_RENDER_CALL_OUTSIDE_RUNTIME_COUNT
§72 Runtime Ownership Regression
```

상태:

```text
CLOSED_BY_DESIGN
```

---

## P0-3 Background build context / detached host 문제

봉인:

```text
§6 Render Transaction Context
§7 Connected + Layout-Active Build Host
§8 One Build Transaction
§10 Side Effect Isolation
```

상태:

```text
CLOSED_BY_DESIGN
```

---

## P0-4 Cache hit Print Readiness

봉인:

```text
§21 Cache Snapshot ↔ Print Readiness
§22 Print Validation Transaction
§23 Print Preflight
§91 Print Hard Invariants
```

상태:

```text
CLOSED_BY_DESIGN
```

---

## P0-5 mathReady 의미 불일치

봉인:

```text
§18 mathRuntimeReady
§18.2 mathTypesetComplete
§18.3 unrenderedMathCount
```

상태:

```text
CLOSED_BY_DESIGN
```

---

# 114. v1.0 → v1.1 P1 Closure Map

## Authority diagram

```text
Phase 1~5 actual
vs
Phase 6 target
```

분리 완료.

## QR fingerprint

```text
QR_POLICY_FINGERPRINT
QR_PAYLOAD_FINGERPRINT
```

분리 완료.

## Snapshot DOM ownership

```text
MOVE, NEVER CLONE
```

HARD RULE 추가.

## cancellation/coalescing

```text
requestGeneration
latest-wins
soft abort
commit abort
```

추가.

## mode naming

```text
exam/sol/ans ↔ exam/solution/answer
```

명시.

## font readiness

snapshot READY 전에 font/geometry stabilization 추가.

## prewarm in-flight cancellation

foreground priority / stale commit 금지 추가.

---

# 115. v1.0 → v1.1 P2 Closure Map

## measurement tolerance

exact semantic parity와 numeric geometry tolerance 분리.

실제 tolerance 값은 Phase 0에서 freeze.

## forced layout metric

`forcedLayoutReadCount`와 `layoutBarrierCount` 의미 정의.

---

# 116. 설계 핵심 문장

> **Fast Engine v2는 기존 renderer 결과를 단순 캐시하는 기능이 아니라, 모든 render 진입점을 transaction runtime 하나가 소유하고, 성공한 canonical DOM만 MOVE 방식으로 snapshot화하며, cache-hit snapshot도 새 Print Validation Transaction에 재결박하는 구조다.**

---

# 117. 구현 시 가장 먼저 확인할 실제 코드

Codex 구현 전 반드시 최신 main에서 다음을 재확인한다.

```text
archive/engine.html
  - switchMode
  - render
  - renderBody
  - print header setter
  - QR setter
  - qpp setter
  - direct render caller
  - readiness tracker
  - __AP_RENDER_READY__
  - registerBlueprintToOS
  - registerClassExamAssignmentToOS
  - QR payload generation
  - staging ownership

archive/mathjax_render_loop.js
archive/print-runtime.js
archive/exam-render-executor.js
archive/solution-render-executor.js
archive/answer-render-executor.js
archive/render-authority.js
archive/layout-authority.js
```

문서에 적힌 함수명이 최신 main에서 달라졌다면 실제 current code를 기준으로 inventory를 갱신하고 구현한다.

---

# 118. 최종 판정

## v1.4 설계 판정

```text
DIRECTION = PASS

v1.3 NEW P0 2 = CLOSED_BY_DESIGN
v1.3 NEW P1 4 = CLOSED_BY_DESIGN

PHASE 0 = READY
PHASE 1A = CONDITIONALLY READY AFTER §102.1 ENTRY GATE
FULL FAST ENGINE IMPLEMENTATION = PHASED ONLY
```

v1.4 핵심 변경:

```text
1. snapshot session binding 공통식을
   snapshot.sessionId == requestedTargetSessionId
   로 단일화

2. RenderSession.sessionId를 canonical identity로 유지

3. PendingRenderSession을 Current와 다른 type으로 명시

4. promotePendingSession()이 완전한 RenderSession을
   PREPARE에서 materialize/validate

5. SOURCE_CHANGE COMMIT 전 old session cleanup 금지 유지

6. requestGeneration / builtRequestGeneration 용어만 사용

7. BLOCK_BEFORE_COMMIT 기본 금지
   reversible + compensation contract frozen일 때만 허용

8. retry를 duplicate와 분리
   logicalEffectId / idempotencyKey / attempt contract 도입

9. current-session-only memory 규칙을 persistent residency로 한정
   pending/retired transition exception 명시
```

# 119. v1.3 → v1.4 Closure Map

## P0-1 Session identity contradiction

외부검수: ACCEPT.

봉인:

```text
§6 requestedTargetSessionId
§9.2 READY reuse common formula
§11 RenderSession.sessionId canonical identity
§59 snapshot.sessionId == requestedTargetSessionId
```

판정:

```text
CLOSED_BY_DESIGN
```

---

## P0-2 Pending → Current promotion object contract

외부검수: ACCEPT.

봉인:

```text
§11.2 separate PendingRenderSession type
§11.4 promotePendingSession()
§11.6 PREPARE materialization + synchronous pointer commit
§55 SOURCE_CHANGE flow
```

판정:

```text
CLOSED_BY_DESIGN
```

---

## P1-1 requestGeneration naming residue

ACCEPT.

canonical:

```text
requestGeneration
builtRequestGeneration
```

request/provenance 명칭을 canonical 두 이름으로 정규화.

---

## P1-2 BLOCK_BEFORE_COMMIT compensation gap

ACCEPT.

정책:

```text
BLOCK_BEFORE_COMMIT = default forbidden
allow only with frozen reversible/compensation/idempotency/abort recovery contract
COMMIT abort after effect ACK → compensation ledger
```

---

## P1-3 retry duplicate counter collision

ACCEPT.

폐기:

```text
legacy ambiguous idempotency-key duplicate counter
```

신규:

```text
DUPLICATE_LOGICAL_EFFECT_CREATION_COUNT
RETRY_IDEMPOTENCY_KEY_MISMATCH_COUNT
RETRY_LOGICAL_EFFECT_ID_MISMATCH_COUNT
```

---

## P1-4 Memory current-session-only wording

ACCEPT.

정본:

```text
persistent residency = current session only
pending / retired = transition-scoped transient exception
```

판정:

```text
CLOSED_BY_DESIGN
```

# 120. 성능 조사 반영 결정

원인 evidence:

```text
전체 DOM 재생성
Solution MathJax 45회
chunk/shell geometry 반복 측정
document-sized gradient raster contribution
```

설계 반영:

```text
Answer Snapshot = architecture pilot
Solution Snapshot = first high-impact cache promotion
Exam Snapshot = next promotion
Gradient 최적화 = 독립 paint optimization; engine root-cause fix를 대체하지 않음
```

SLA/성능 회귀 기준은 Phase 0 fixed-SHA 재측정 전까지 확정하지 않는다.

---

# 121. 설계 핵심 한 문장

> **Fast Engine v2는 모든 render-affecting 입력을 immutable candidate로 고정하고, snapshot을 항상 `requestedTargetSessionId`에 결박하며, SOURCE_CHANGE는 PendingRenderSession에서 완전한 다음 RenderSession을 미리 materialize한 뒤 synchronous COMMIT으로 승격하고, 외부 side effect는 logical identity·retry·compensation까지 별도 ledger로 완결하는 canonical transaction runtime이다.**

---

# 122. 구현 직전 절대 금지

```text
- generic snapshot validity 식에 `currentSessionId`를 직접 결박
- RenderSession.sessionId 삭제/미사용 처리
- PendingRenderSession object에 status=CURRENT만 넣어 재사용
- promotePendingSession materialization을 COMMIT 중 수행

- request/provenance canonical 이름 외 alias 사용
- stale snapshot 판단에 builtRequestGeneration 사용

- BLOCK_BEFORE_COMMIT을 compensation 없이 허용
- 정상 retry를 duplicate logical effect로 집계
- retry 때 새로운 idempotency key 발급

- pending source 준비 전에 current session cleanup
- retired cleanup window를 persistent cross-source cache로 사용
```

---

# 123. 구현 착수 최종 순서

```text
Phase 0
  fixed-SHA baseline
  render-entry inventory
  immutable render-input schema freeze
  pending-session + promotion materialization freeze
  side-effect trigger/delivery/failure/idempotency/compensation freeze

→ Phase 1A
  CandidateRenderState
  requestedTargetSessionId
  PendingRenderSession
  promotePendingSession()
  Runtime ownership
  RenderTransactionContext
  requestGeneration latest-wins
  full Render State 2PC
  synchronous commit/rollback
  snapshot status commit
  side-effect execution/compensation ledger

→ Phase 1B
  Answer Snapshot pilot

→ Phase 1C
  Solution Snapshot

→ Phase 1D
  Exam Snapshot

→ Phase 2+
  connected background build
  first-render optimization
  measurement batching
  prewarm
  layout authority promotion
```

---

# 124. 구현 착수 Seal

Phase 1A 시작 전 아래가 모두 PASS여야 한다.

```text
PHASE0_BASELINE_FROZEN
RENDER_ENTRY_INVENTORY_COMPLETE
CANONICAL_RENDER_INPUT_SCHEMA_FROZEN
CANDIDATE_IMMUTABILITY_STRATEGY_FROZEN
PENDING_SESSION_LIFECYCLE_FROZEN

SIDE_EFFECT_INVENTORY_COMPLETE
SIDE_EFFECT_CONTRACT_MATRIX_FROZEN
SIDE_EFFECT_IDEMPOTENCY_RULES_FROZEN
SIDE_EFFECT_FAILURE_POLICY_FROZEN
SIDE_EFFECT_COMPENSATION_POLICY_FROZEN
```

그리고 문서 정합성 검사:

```text
GENERIC_CURRENT_SESSION_SNAPSHOT_BINDING_COUNT == 0
PENDING_AS_CURRENT_OBJECT_PROMOTION_COUNT == 0
BARE_GENERATION_CONTRACT_FIELD_COUNT == 0
AMBIGUOUS_RETRY_DUPLICATE_COUNTER_COUNT == 0
```
