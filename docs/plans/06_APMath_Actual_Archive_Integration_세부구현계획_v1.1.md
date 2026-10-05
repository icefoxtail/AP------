# APMath Actual Archive Integration 세부 구현계획 v1.1

> **상위 재검토 반영 기준:** `0bb88da58e41ae1154911d4e711f6247e60e5f16`. 본문의 기존 조사 이력은 보존한다. 이번 재검토의 최종 결정은 마지막 추가 절과 [검토 보고서](APMath_Construction_Visual_Production_아키텍처재검토_2026-10-05.md)에 기록하며, 해당 항목은 앞선 초안의 포괄적 표현보다 우선한다. 제품 코드·신규 engine qualification은 이번 변경 범위가 아니다.

**상위 문서:** `APMath Construction & Visual Production Engine — 최종 구현 계획서`  
**문서 역할:** Detail 06 / Actual Archive Integration  
**작성일:** 2026-10-05 (Asia/Seoul)  
**상태:** **통합검토 보완 반영 · 계획 v1.1 · 이번 작업 제품 코드 변경 0**  
**v1.0 원문 조사 기준(이력 보존):** `origin/main @ 32102c5e4f6016ed8ff3d4e85b367e084aa5814b`

**통합 보완 기준 main:** `3a7b2cb712fb192f3728f4df4a7ccc1e99d79427`  
**개정일:** 2026-10-05 (Asia/Seoul)  
**반영 이슈:** D-01  
**적용 관계:** 같은 Detail v1.0의 해당 계약/예시를 v1.1 본문으로 대체한다. 공통 요청·routing·상태의 단일 소유자는 Detail 05 §4/6/7/24–26/53–54다. 원문의 “현재 main 구현” 설명은 원 조사 시점 기록이며 이번에 전체 코드를 다시 조사했다는 뜻이 아니다. 이 문서의 test/qualification checklist는 구현 후 수행할 요구사항이고, 문서 보완은 실행 PASS·ACTIVE·PUBLICATION_READY·Seal 선언이 아니다.

---

## 0. 이 문서의 목적

이 문서는 APMath Visual Production Engine의 여섯 번째 세부계획으로, 앞선 단계에서 만들어진 **final candidate SVG**를 실제 JS Archive 화면에 연결해 다음을 모두 증명하는 실제 제품 통합 계획이다.

```text
questionUid
→ source exam bank
→ exact qid
→ generated candidate bank
→ final SVG asset
→ actual Archive engine/runtime
→ mode=sol
→ publication viewport
→ actual loaded asset response SHA
→ actual rendered image rect
→ screenshot
→ isolated actual-size replay
→ rendered-layout evidence
→ final result binding
```

핵심 목표:

> **“SVG 자체가 좋아 보인다”가 아니라, 실제 Archive가 정확한 문항에 정확한 final SVG bytes를 로드했고, production과 같은 runtime에서 desktop publication 기준으로 읽기 좋게 렌더됐다는 것을 물리적 evidence로 증명한다.**

본 문서는 **실제 Archive 통합과 render evidence**만 다룬다.

별도 책임:

- Construction math → Detail 01
- Function graph/axis math → Detail 02
- Typography/font → Detail 03
- Layout/composition → Detail 04
- One-Click orchestration → Detail 05
- Problem → VisualRequest planning → Detail 07
- 전체 독립 qualification/seal → Detail 08

---

# 1. 최상위 구현 결정

## 1.1 publication 기준은 실제 Archive desktop `mode=sol`

solution visual publication의 canonical reference:

```text
archive/engine.html
mode=sol
desktop
1440×1000
no page-fit / no screen-fit scale
actual candidate bank
actual final SVG bytes
```

모바일/좁은 화면은 별도 regression일 수 있으나
SVG publication PASS의 기준은 아니다.

---

## 1.2 기존 Archive engine은 수정하지 않는 candidate overlay 우선

qualification 시:

- production exam JS 직접 수정 금지
- original bank 복제
- target image field만 generated candidate로 patch
- protected field parity 확인
- local generated server로 actual Archive runtime 사용

방식을 유지한다.

---

## 1.3 actual loaded bytes가 authority

candidate manifest에 적힌 SHA만으로 PASS하지 않는다.

반드시 browser network response에서:

```text
target image URL
status 200
response bytes SHA
```

를 수집하고 final candidate SVG SHA와 비교한다.

---

## 1.4 screenshot은 보조가 아니라 binding된 evidence

screenshot은 단순 눈검수 이미지가 아니다.

다음과 결박한다.

- source bank SHA
- candidate bank SHA
- final SVG SHA
- runtime bundle SHA
- viewport
- mode
- target UID/qid
- screenshot SHA

---

# 2. 현재 main의 실제 상태

## 2.1 `build-visual-render-matrix.mjs`

현재 이미 수행:

- fixture manifest
- sourcePath별 grouping
- source bank load
- target question 존재 확인
- solutionImage patch
- source question count parity
- protected field parity
- generated candidate bank 저장
- source/candidate SHA
- target asset SHA
- matrix 생성

매우 중요한 기존 자산이다.

---

## 2.2 현재 render matrix의 publication 공백

현재 matrix는 기본적으로:

```text
preview=1
qpp=4
mode=sol
```

URL을 만들고,

viewport는:

- desktop 1440×1000
- mobile 390×844

두 개를 생성한다.

즉:

> 현재 general regression matrix와 publication reference가 섞여 있다.

이번 Detail에서는 별도 opt-in:

`publicationProfile = ACTUAL_ARCHIVE_DESKTOP_SOL_V1`

를 만든다.

---

## 2.3 `archive/engine.html`

현재 screen 환경에는:

```css
body.screen-fit-mode
transform: scale(var(--screen-page-scale, 1))
```

경로가 존재한다.

또 `preview-mode`도 별도 UI/layout 동작이 있다.

따라서 publication gate는:

- `fit=screen` 금지
- page 전체 transform scaling 금지
- preview-specific scaling이 있다면 배제
- 실제 solution image의 natural Archive layout 크기

를 명시적으로 증명해야 한다.

---

## 2.4 `record-visual-browser-evidence.mjs`

현재 이미 매우 많은 핵심 evidence를 수집한다.

### source/stale check

- engine SHA
- source SHA
- candidate SHA
- asset SHA

### runtime

- local HTTP server
- repo-root allow scope
- no-store
- Playwright Chromium

### readiness

- `#print-area`
- `.page`
- `apPrintReadiness`
- MathJax startup
- `document.fonts.ready`
- image decode
- APPrintRuntime ready

### page state

- question count
- page count
- horizontal overflow
- image count
- render error

### target image

- loaded 여부
- src
- actual client rect

### actual-size replay

same SVG bytes를
actual Archive image rect 크기로 isolated SVG replay 후
`analyzeRenderedLayout()` 실행.

### network response

실제 target `src` response의 SHA 수집.

이 기반은 최대한 재사용한다.

---

## 2.5 현재 evidence 공백

보강 필요:

1. stable UID → qid → image occurrence exact binding
2. URL substring만으로 동일 asset 오탐 방지
3. runtime 전체 dependency bundle hash
4. exact desktop publication profile
5. screen-fit/no-fit 명시 evidence
6. DPR
7. candidate patch field policy
8. source image occurrence uniqueness
9. screenshot SHA를 summary에 직접 결박
10. actual Archive crop ↔ isolated replay equivalence qualification
11. page/column/flow placement
12. continuation/adjacent item impact
13. final runner attempt와 Archive evidence 결박

---

# 3. ArchivePublicationProfile v1

제안:

```json
{
  "profileId": "actual-archive-desktop-sol-v1",
  "engine": "archive/engine.html",
  "mode": "sol",
  "viewport": {
    "width": 1440,
    "height": 1000,
    "dpr": 1
  },
  "fitPolicy": "NO_FIT",
  "previewPolicy": "DIRECT",
  "qpp": 4,
  "publicationSurface": "SOLUTION_VISUAL"
}
```

---

## 3.1 direct 의미

`DIRECT`는:

- Archive actual engine
- target bank
- solution mode
- publication CSS
- no screen transform

을 의미.

임의 standalone HTML mock을 뜻하지 않는다.

---

## 3.2 preview

현재 `preview=1`은 general Archive embed 용도로 존재한다.

publication qualification에서는:

- preview UI가 필요 없고
- layout/scaling 차이가 있으면

직접 mode=sol 경로를 우선한다.

만약 엔진의 안정적 자동화 진입을 위해 preview flag가 꼭 필요하다면:

> **preview flag가 layout/scale을 변경하지 않는다는 parity test**

를 먼저 통과해야 한다.

그렇지 않으면 publication profile에서 preview=1 금지.

---

# 4. Fit policy

## 4.1 NO_FIT

publication reference:

- page/root transform scale = 1
- target SVG 자체 width/height/viewBox로 렌더
- Archive image CSS max-width만 정상 적용

---

## 4.2 Screen-fit regression

`screen-fit-mode`는 usability 기능으로 유지할 수 있다.

하지만:

- font 11px gate
- exact publication readability

의 기준으로 사용하지 않는다.

---

# 5. CandidateBank v2

현재 source JS 뒤에 patch loop를 추가하는 방식을 유지할 수 있다.

다만 runner와 연결하기 위해 explicit manifest를 만든다.

---

## 5.1 CandidatePatchManifest

```json
{
  "schemaVersion": "apmath-archive-candidate-v2",
  "sourcePath": "...",
  "sourceSha256": "...",
  "questionUid": "...",
  "questionId": "...",
  "sourceQuestionOrdinal": 0,
  "patches": [
    {
      "field": "solutionImage",
      "before": "...",
      "after": "..."
    }
  ],
  "finalSvgSha256": "...",
  "protectedFieldParity": "PASS"
}
```

---

# 6. Patch scope

solution visual qualification에서 기본 patch 허용:

- `solutionImage`
- `solutionImageAlt`
- `solutionImageCaption`
- approved `solutionImageSize`

그 외 field mutation 금지.

---

## 6.1 `solutionImageSize`

현재 matrix는 무조건:

`solutionImageSize = full`

을 넣는다.

이것은 실제 제품 policy를 왜곡할 수 있다.

따라서:

- target existing approved display size
- planner가 명시한 intended size
- qualification profile

에 따라 정한다.

무조건 `full`로 덮어쓰지 않는다.

---

# 7. Stable identity binding

Archive integration은 다음 identity를 모두 보존한다.

```text
canonical sourceExamId
questionUid v2
sourceQuestionOrdinal
sourcePath
qid / question.id
surface = SOLUTION_VISUAL
assetId
final SVG SHA
```

---

## 7.1 UID ↔ qid mapping

`pipeline-core/question-uid.mjs`의 canonical mapping 재사용.

candidate matrix가 단순 question id 문자열만 신뢰하지 않게 한다.

---

# 8. Asset occurrence binding

같은 SVG path가 여러 문항에 존재할 수 있다.

따라서:

URL substring only matching 금지.

browser target 관측은 최소:

- question block identity
- q number / ordinal
- image element occurrence
- asset URL
- asset response SHA

를 함께 결박한다.

---

# 9. DOM target binding

actual page에서 target image를 찾을 때:

```text
question block
→ target qid/ordinal
→ .sol-image-wrap
→ img
```

로 scope를 좁힌다.

전역 `img[src*=...]`만으로 target identity를 확정하지 않는다.

---

# 10. Question count parity

현재 existing count check 유지.

추가:

- source total question count
- candidate total question count
- target block count
- target ordinal

을 명시.

---

# 11. Protected field parity

현재 JSON clone compare를 유지.

추가:

- patch manifest SHA
- before/after field map
- exact changed field list

를 evidence에 포함.

---

# 12. Runtime closure

현재 engine SHA 하나만으로는 부족.

Detail 06에서는 `pipeline-core/runtime.mjs` 기반 bundle을 사용한다.

최소 dependency:

- `archive/engine.html`
- relevant CSS
- native print/runtime JS
- MathJax
- font assets
- candidate bank
- target SVG
- publication profile/policy

---

# 13. RuntimeBundle v1

```json
{
  "schemaVersion": "apmath-visual-runtime-bundle-v1",
  "engineSha256": "...",
  "css": [],
  "scripts": [],
  "fonts": [],
  "mathjax": [],
  "candidateBankSha256": "...",
  "finalSvgSha256": "...",
  "bundleSha256": "..."
}
```

---

# 14. Bound local server

현재 local HTTP server를 재사용.

강화:

- allowlisted runtime bundle만 serve
- runtime bundle 밖 요청은 기록 또는 fail
- run 중 bytes 변경 감지
- no-store 유지

---

## 14.1 unbound response

publication에서 중요한 dependency가 bundle에 없는데 요청되면:

`UNBOUND_RUNTIME_DEPENDENCY`

---

# 15. Browser identity

evidence:

- Chromium/Chrome version
- executable identity/path class
- viewport
- DPR
- headless
- OS/runtime

를 기록.

---

# 16. Readiness contract

현재 wait 순서 유지:

1. DOM content
2. print area/page
3. AP readiness
4. MathJax
5. fonts
6. images decode
7. APPrintRuntime

보강:

- target image complete
- target SVG response SHA
- final layout stable frame 2회 또는 equivalent

---

# 17. Layout stability

capture 직전 두 animation frame 또는 짧은 stable interval에서:

- target rect
- page count
- target position

이 변하지 않는지 확인.

---

# 18. Publication scale evidence

capture 시:

```json
{
  "bodyScreenFit": false,
  "printAreaTransform": "none",
  "pageTransform": "none",
  "screenPageScale": 1,
  "targetRect": {},
  "svgIntrinsic": {},
  "cssScale": "<actual measured scale>"
}
```

기록.

---

# 19. Target SVG display size

actual Archive에서:

- image client width
- height
- natural width/height if meaningful
- CSS class
- `solutionImageSize`
- parent container

수집.

---

# 20. Actual-size isolated replay

기존 방식을 유지.

```text
final SVG bytes
→ isolated SVG DOM
→ width/height = actual Archive target rect
→ rendered-layout observer
```

---

## 20.1 replay의 의미

replay는:

- SVG internal layout
- collision
- glyph
- clipping

관측에 유용.

하지만:

> replay는 actual Archive `<img>` 내부 DOM을 직접 관측한 것이 아니다.

evidence에 명시.

---

# 21. Replay equivalence qualification

대표 fixture에서:

- actual Archive target crop screenshot
- isolated replay screenshot

비교.

축:

- dimensions
- major geometry position
- label position
- font/glyph visual
- clipping
- line thickness

---

## 21.1 equivalence failure

동등성이 확인되지 않으면 replay 결과를 final PASS authority로 사용하지 않는다.

상태:

`REPLAY_EQUIVALENCE_UNVERIFIED`

---

# 22. Screenshot evidence

최소:

1. full Archive page screenshot
2. target item screenshot
3. target solution image crop
4. isolated replay screenshot

각 SHA 저장.

---

# 23. Screenshot naming

stable assetId 기반.

예:

```text
<assetId>-archive-page.png
<assetId>-question-block.png
<assetId>-solution-image.png
<assetId>-replay.png
```

qid만 사용해 충돌시키지 않는다.

---

# 24. ArchiveEvidence v2

```json
{
  "schemaVersion": "apmath-archive-publication-evidence-v2",
  "questionUid": "...",
  "sourcePath": "...",
  "sourceSha256": "...",
  "candidateBankSha256": "...",
  "finalSvgSha256": "...",
  "runtimeBundleSha256": "...",
  "profileSha256": "...",
  "browser": {},
  "placement": {},
  "responses": {},
  "screenshots": {},
  "layoutAudit": {},
  "status": "PASS"
}
```

---

# 25. Placement evidence

target item:

- page number
- column
- flow position
- bounding box
- continuation
- preceding/following item

기록.

`render-impact.mjs` signature 구조와 맞춘다.

---

# 26. Pagination impact

SVG height 변화로:

- page break
- next question column
- continuation

이 바뀔 수 있다.

따라서 target만 보지 않는다.

---

## 26.1 Direct impact neighbors

최소:

- same page
- same column
- immediate continuation
- next flow item

을 impact scope에 포함.

---

# 27. Changed-only render policy

변경 없는 문항의:

- SVG 생성
- math audit

을 다시 하지 않아도 된다.

하지만 target height/placement로 pagination 영향이 생기면:

affected Archive placement는 재확인.

---

# 28. render-impact adapter

`pipeline-core/render-impact.mjs`가 요구하는:

- itemWitness
- block
- signature

형식으로 actual capture를 변환하는 adapter를 만든다.

---

# 29. Global invalidator

다음 변경 시 Archive render evidence 무효화:

- engine.html
- CSS
- font
- MathJax
- native print runtime
- viewport policy
- fit policy
- render policy

---

# 30. SVG-only change

final SVG만 바뀌면:

- math/layout static
- target Archive sol render
- direct impact neighbor

만 재실행.

전체 exam/mode/device matrix 재검이 기본은 아니다.

---

# 31. Archive mode scope

SOLUTION_VISUAL:

`mode=sol` 필수.

PROBLEM_VISUAL 활성화 시 별도:

`mode=exam`

qualification 필요.

이번 v1 기본 범위는 solution visual.

---

# 32. ans mode

solutionImage publication과 직접 관련 없는 경우:

NOT_APPLICABLE.

---

# 33. mobile

mobile은 optional regression.

publication READY 필수 축이 아님.

모바일 11px 절대 floor 신설 금지.

---

# 34. qpp

현재 qpp=4.

publication profile에서 고정.

변경 시 profile hash와 render evidence invalidate.

---

# 35. Actual asset response

현재 responses 배열 재사용.

보강:

- MIME type
- cache headers
- response SHA
- matched target occurrence

기록.

---

# 36. Wrong asset negative

다른 SVG path가 로드되면:

`ACTUAL_LOADED_ASSET_SHA_MISMATCH`

유지.

추가:

`TARGET_ASSET_OCCURRENCE_MISMATCH`

---

# 37. Stale source negative

source bytes 변경 후 이전 matrix/evidence 재사용:

FAIL.

---

# 38. Stale runtime negative

CSS/engine/font 변경 후 이전 screenshot/evidence 재사용:

FAIL.

---

# 39. Wrong UID negative

qid는 맞지만 UID/source identity가 다르면:

FAIL.

---

# 40. Duplicate asset path negative

같은 asset path가 여러 target에 걸릴 때
DOM block identity로 분리되지 않으면:

FAIL.

---

# 41. Horizontal overflow

현재 check 유지.

Archive page-level overflow는 FAIL.

---

# 42. Vertical clipping

solution block에서:

- image clipping
- overflow hidden
- page cut

관측 추가.

---

# 43. Target visibility

target SVG가 loaded=true여도
display:none / zero rect이면 FAIL.

---

# 44. Image scaling

target rect가 0이 아니어야 하고
aspect ratio가 intrinsic viewBox 비율과 의도한 policy에 맞는지 확인.

---

# 45. solutionImageSize policy

size class에 따라:

- small
- medium
- large
- full

실제 CSS limits가 다르다.

qualification request가 명시한 intended policy와 일치해야 함.

---

# 46. CSS max-height impact

현재 default solution image:

`max-height: 180px`

size class에 따라 달라진다.

publication visual은 11px floor를 실제 displayed size에서 검사하므로
size policy가 매우 중요하다.

---

# 47. Full size 남용 금지

font floor를 통과시키기 위해
모든 visual을 `full`로 강제하지 않는다.

visual composition 자체와 approved display policy가 적절해야 함.

---

# 48. Rendered font floor

isolated replay를 actual Archive rect로 맞춘 뒤:

base student-facing label 11 CSS px 이상.

Detail 03/04 gate와 동일.

---

# 49. Actual crop manual review input

독립 reviewer가 볼 기본 evidence:

- question context crop
- solution text + image crop
- image isolated crop
- relevant source/solution refs

---

# 50. ArchiveEvidence → RunnerResult

Detail 05 result reducer가:

`archive: PASS`

축을 읽는다.

Archive PASS만으로 PUBLICATION_READY 아님.

independent review가 남아 있으면:

`READY_FOR_INDEPENDENT_REVIEW`

---

# 51. Runner integration

Detail 05:

`READY_FOR_ARCHIVE_CHECK`

후:

```text
build archive candidate
→ capture
→ evidence
→ reduce
```

자동 호출.

---

# 52. Attempt binding / 검증된 이전 evidence 재사용

새 capture는 원래 run-id/asset-id/attempt, final SVG SHA, source/candidate/runtime/profile/browser/viewport/placement, 실제 screenshot bytes SHA에 결박한다. **영향받은 이전 screenshot을 새 attempt의 새 capture처럼 붙이는 것은 금지**한다.

| 경우 | 처리 |
|---|---|
| target SVG/source/solution/runtime/font/profile/capture 조건 또는 실제 placement가 바뀜 | 해당 target와 직접 layout 영향 범위를 재캡처·필요 재검 |
| 현재 item signature와 applicable dependency/placement가 동일하고 유효 root evidence가 있음 | 기존 render-impact 계약의 검증된 reuse로 원본 evidence를 참조 |
| 다른 target의 높이 변경 등으로 페이지/column/continuation 영향이 불명확 | affected bank의 현재 placement를 관측해 영향 범위를 확정한 뒤 recapture/reuse 결정 |

재사용은 원본 run/attempt/SVG/screenshot SHA와 root review identity를 그대로 보존한다. 새 소비 결과에는 `reusedFrom`에 해당 artifact ref+SHA와 current signature/impact verification을 기록한다. 기존 capture의 시간/attempt를 새 값으로 덮어쓰거나 오래된 screenshot에 새 SVG SHA를 붙이지 않는다.

은행 전체 candidate hash가 바뀌어도 다른 item의 모든 render를 자동 무효화하거나 자동 재사용하지 않는다. 기존 render-impact의 current item signature·runtime/policy·현 placement 보존과 bank change 영향 증거로 판단하고, origin capture의 원래 bank hash는 보존한다. 검증 자료가 부족하면 NOT_VERIFIED/해당 recapture다.

새 attempt 번호라는 이유만으로 모든 화면을 다시 만들지 않는다. SVG bytes가 같다는 이유만으로 페이지 밀림을 무시하지도 않는다. D08 §77도 이 동일 계약을 사용한다.

---

# 53. Failure classification

Archive failure:

- `ARCHIVE_SOURCE_STALE`
- `ARCHIVE_CANDIDATE_STALE`
- `ARCHIVE_RUNTIME_STALE`
- `ARCHIVE_TARGET_NOT_FOUND`
- `ARCHIVE_WRONG_QUESTION_BINDING`
- `ARCHIVE_TARGET_ASSET_NOT_LOADED`
- `ARCHIVE_TARGET_ASSET_SHA_MISMATCH`
- `ARCHIVE_LAYOUT_NOT_READY`
- `ARCHIVE_SCREEN_FIT_ACTIVE`
- `ARCHIVE_HORIZONTAL_OVERFLOW`
- `ARCHIVE_VERTICAL_CLIPPING`
- `ARCHIVE_PAGINATION_REGRESSION`
- `ARCHIVE_REPLAY_EQUIVALENCE_FAIL`
- `ARCHIVE_RENDER_PENDING`

---

# 54. Repairability

Archive failure 중 visual repair 가능:

- target visual clipping
- size mismatch
- pagination due to SVG height
- label unreadable at actual size

repair 불가/다른 owner:

- wrong UID
- source stale
- runtime mismatch
- wrong bank
- source mapping

---

# 55. Size-policy repair

actual Archive에서 너무 작다면
runner가 즉시 `full`로 바꾸지 않는다.

순서:

1. current composition/frame 최적화
2. approved size class 검토
3. parent display policy 변경 필요 시 explicit revision
4. 재capture

---

# 56. Pagination repair

SVG가 너무 길어 page flow를 깨면:

- internal composition compact
- validated panel/layout adjustment
- approved size class

순.

내용 삭제 금지.

---

# 57. Local server integrity

run 중:

- candidate bank
- SVG
- CSS/runtime

mtime/hash 변경 감지.

변경 시 현재 capture 무효화.

---

# 58. Network restriction

publication capture 중 외부 network 의존 금지.

필요한 asset은 repo/local runtime bundle에 있어야 함.

---

# 59. Missing dependency

외부 font/CDN 요청이 발생하면:

FAIL.

---

# 60. Browser console/page errors

현재처럼 pageerror 수집.

publication relevant error는 FAIL.

무관 warning은 분리 가능.

---

# 61. Archive render metrics

현재:

`data-ap-render-metrics`

수집.

가능하면 evidence에 원문 그대로 보존.

---

# 62. AP readiness

`apPrintReadiness` 상태를 final evidence에 포함.

---

# 63. Runtime bundle serving

`runtime.mjs` bundle을 collector가 읽어
허용 dependency list 생성.

collector 자체가 별도 runtime authority를 만들지 않는다.

---

# 64. Browser reuse

같은 run의 여러 target을 검사할 때
browser process 공유 가능.

페이지 state는 각 target/source별 격리.

---

# 65. Time budget

각 page navigation/capture bounded.

timeout은:

`ARCHIVE_RENDER_PENDING` 또는 infra failure.

false PASS 금지.

---

# 66. Archive matrix v2

제안:

```json
{
  "schemaVersion": "APMATH_ARCHIVE_PUBLICATION_MATRIX_v2",
  "profile": "...",
  "runtimeBundleSha256": "...",
  "sources": [],
  "rows": []
}
```

---

# 67. Row v2

```json
{
  "questionUid": "...",
  "questionId": "...",
  "mode": "sol",
  "viewport": "desktop-publication",
  "width": 1440,
  "height": 1000,
  "dpr": 1,
  "fit": "none",
  "urlPath": "...",
  "targetAsset": {}
}
```

---

# 68. General regression matrix와 분리

기존 matrix의:

- mobile
- exam
- ans
- preview

범용 회귀는 필요하면 유지.

publication matrix와 섞지 않는다.

---

# 69. Synthetic Archive test와 real exam test

둘 다 유지.

### synthetic

fixture bank / controlled case.

### real

actual exam bank + actual UID.

synthetic PASS를 real qualification로 대체하지 않는다.

---

# 70. Real qualification denominator

최종 마스터/D08의 Geometry ≥6 + Graph ≥4, 전체 ≥10 unique generated real UID 및 required feature qualification과 연결.

각 UID마다:

- source bank
- final SVG
- actual Archive evidence
- screenshot
- review

를 닫는다.

Graph capability가 추가되면 실제 graph UID도 별도 qualification에 포함.

---

# 71. Existing source candidate selection

문서 작성 단계에서는 특정 UID PASS를 미리 선언하지 않는다.

실제 구현 Phase 0에서:

- current source 존재
- verified solution
- visual type

을 확인 후 denominator freeze.

---

# 72. Production write boundary

이 단계도:

- production exam JS write 금지
- production SVG overwrite 금지

generated candidate만.

---

# 73. Final evidence location

One-Click attempt 아래:

```text
attempt-XX/
  archive/
    matrix.json
    runtime-bundle.json
    candidate-bank.js
    evidence.json
    screenshots/
```

---

# 74. Evidence immutability

capture 완료 후 file overwrite 금지.

재capture는 새 attempt 또는 archive-attempt version.

---

# 75. Screenshot privacy/scope

Archive local data 중 qualification에 필요 없는 개인/학생 정보가 있다면
fixture/test account 또는 non-sensitive bank 사용.

actual exam source content는 프로젝트 범위 내 보존.

---

# 76. Implementation files

## `build-visual-render-matrix.mjs`

보강:

- publication profile
- generic candidate manifest
- UID binding
- direct desktop/no-fit
- size policy
- runtime bundle ref

---

## `record-visual-browser-evidence.mjs`

보강:

- exact DOM question binding
- DPR/fit/transform
- screenshot SHA
- runtime bundle
- placement signature
- replay equivalence
- target crop

---

## `visual-browser-runtime.mjs`

보강:

- browser identity
- profile options
- bound serving integration

---

## `verify-rendered-layout.mjs`

재사용/보강:

- v2 label group
- actual-size replay
- publication profile recognition

---

## `pipeline-core/runtime.mjs`

가능하면 그대로 함수 재사용.

새 geometry-specific runtime hash 중복 구현 금지.

---

## `pipeline-core/render-impact.mjs`

capture adapter 추가.

---

## `pipeline-core/question-uid.mjs`

canonical UID mapping 재사용.

---

# 77. engine.html 수정 원칙

가능하면 Archive engine 자체는 변경하지 않고
collector/profile로 qualification한다.

정말 필요한 경우:

- explicit test/publication query
- stable no-fit option

같은 opt-in 최소 변경만.

일반 사용자 render policy를 바꾸지 않는다.

---

# 78. 구현 단계

## Phase 0 — publication profile / baseline freeze

고정:

- latest main
- engine SHA
- CSS/runtime bundle
- desktop 1440×1000
- DPR
- mode=sol
- fit=no-fit

종료:
profile JSON/hash 존재.

---

## Phase 1 — candidate manifest v2

구현:

- UID/qid/source
- exact patch
- protected parity
- size policy

종료:
generated bank deterministic.

---

## Phase 2 — publication matrix v2

기존 general matrix와 분리.

종료:
desktop/direct/no-fit 1 canonical row per target.

---

## Phase 3 — bound runtime server

runtime.mjs closure 연결.

종료:
unbound/stale dependency fail.

---

## Phase 4 — exact DOM target binding

qid/ordinal/block/image occurrence.

종료:
duplicate asset path에서도 정확한 target 식별.

---

## Phase 5 — publication capture

수집:

- readiness
- scale/fit
- target rect
- page placement
- response SHA
- screenshots

---

## Phase 6 — replay equivalence qualification

대표 fixture에서 actual crop vs replay.

종료:
replay 사용 권한 명시.

---

## Phase 7 — render-impact adapter

pagination/neighbor 영향.

---

## Phase 8 — runner integration

Detail 05 result에 Archive axis 연결.

---

# 79. 최소 synthetic regression

1. clean solution SVG
2. wrong asset SHA
3. stale source
4. stale candidate
5. stale engine
6. screen-fit active
7. preview layout mismatch
8. duplicate asset path
9. wrong qid
10. zero-size image
11. clipped image
12. page overflow
13. pagination shift
14. font runtime change
15. CSS change
16. replay mismatch
17. network external dependency
18. target image missing

---

# 80. Real exam regression

최소:

- geometry simple
- dense geometry
- fraction/root typography
- graph
- tall SVG
- multi-question same page

유형 포함.

---

# 81. Changed-only tests

| 변경/상황 | 기대 동작 |
|---|---|
| label-only | math cache 유지; final SVG가 달라진 target recapture |
| SVG height | 실제 page/column/continuation 영향 이웃 recapture |
| runtime CSS/font/profile | 그 dependency를 소비한 capture/review 무효화 |
| unrelated exam | 유효 signature/root evidence로 reuse 가능 |
| 동일 target의 새 attempt, 모든 relevant bytes/placement/환경 동일 | 원본 identity를 보존한 verified reuse 허용 |
| 같은 SVG bytes, 다른 page placement | reuse 거부 |
| 이전 screenshot에 새 final SHA/attempt를 덧붙임 | binding FAIL |

기존 render-impact schema를 재사용하고 geometry collector의 adapter만 보강한다. 같은 predicate를 D08에서 별도 구현하지 않는다.

---

# 82. Independent audit boundary

Archive collector는:

- bytes loaded
- placement
- clipping
- rendering

증거를 만든다.

학생 이해도/자연스러움 최종 평가는 independent visual review의 책임.

---

# 83. Archive collector가 하면 안 되는 것

- screenshot 보고 수학 PASS 판정
- source condition 새로 판단
- builder witness를 expected truth로 복사
- overlap=0만으로 publication quality PASS

---

# 84. Internal completion gate

Detail 06 완료 상태:

`ACTUAL_ARCHIVE_INTEGRATION_QUALIFIED`

의미:

- exact target
- exact bytes
- exact runtime
- desktop/no-fit
- screenshot/layout evidence

까지 자동화됨.

independent review가 남으면 전체 PUBLICATION_READY 아님.

---

# 85. 완료 기준

- [ ] publication canonical은 actual Archive desktop `mode=sol` 1440×1000/no-fit이다.
- [ ] general mobile/preview matrix와 publication matrix를 분리한다.
- [ ] source bank를 generated overlay로만 patch한다.
- [ ] patch field가 explicit manifest로 제한된다.
- [ ] stable UID→source→qid→image occurrence가 exact binding된다.
- [ ] 같은 asset path가 여러 문항에 있어도 target을 정확히 식별한다.
- [ ] final SVG response bytes SHA가 실제 network response에서 확인된다.
- [ ] runtime engine/CSS/font/MathJax bundle이 hash로 결박된다.
- [ ] screen-fit/page transform이 publication capture에서 비활성임을 증명한다.
- [ ] actual target display rect가 기록된다.
- [ ] actual Archive target crop screenshot이 저장된다.
- [ ] isolated replay가 actual rect 크기로 수행된다.
- [ ] replay equivalence가 representative fixture에서 qualification된다.
- [ ] browser layout audit가 final SVG SHA와 결박된다.
- [ ] screenshot SHA가 evidence에 포함된다.
- [ ] page/column/flow/pagination evidence가 기록된다.
- [ ] target size 변화의 direct neighbor impact를 확인한다.
- [ ] stale source/runtime/asset evidence 재사용을 거부한다.
- [ ] `solutionImageSize=full`을 무조건 강제하지 않는다.
- [ ] external network dependency 없이 capture된다.
- [ ] production exam/asset write는 0이다.
- [ ] runner result가 Archive PASS/FAIL을 machine-readable로 소비한다.
- [ ] Archive PASS만으로 PUBLICATION_READY를 주장하지 않는다.

- [ ] 영향받은 stale screenshot과 영향 없는 verified reuse를 구분한다.
- [ ] reuse 시 origin run/attempt/source/candidate/screenshot identity를 보존하고 current signature/placement 검증을 남긴다.
- [ ] actual display scale이 graph의 frozen reference transform과 다르면 screen-space 오차/관련 graph 관측을 재검한다.

---

# 86. 이 단계에서 하지 않는 것

- geometry/graph math 변경
- font renderer 변경
- layout algorithm 재설계
- production exam JS 직접 수정
- production SVG overwrite
- mobile absolute font gate
- 모든 mode/device 전수 render
- screenshot만 보고 math correctness 승인
- Archive UI 전체 리팩터링
- screen-fit 기능 제거
- preview 기능 제거

---

# 87. 후속 세부계획과 인터페이스

Detail 06 output:

```text
ArchivePublicationProfile
CandidatePatchManifest
ArchivePublicationMatrix
RuntimeBundle
ArchiveEvidence
PlacementSignature
ScreenshotManifest
ArchiveIntegrationResult
```

### Detail 07 — Problem → Visual Request

문항 한 개 지정에서 source/solution/visual intent를 자동 resolve하는 상위 planning을 완성.

### Detail 08 — Qualification & Seal

1~7차 전체를 실제 representative denominator로 독립 검토하고 최종 seal.

---

# 88. 최종 한 문장

> **APMath Actual Archive Integration v1은 generated SVG를 별도 브라우저에서 보기 좋게 렌더하는 작업이 아니라, exact questionUid·source bank·candidate patch·final SVG bytes·Archive runtime·desktop/no-fit 화면·screenshot을 하나의 hash chain으로 묶어 실제 JS Archive 안에서 publication 품질을 물리적으로 증명하는 통합 계층이다.**

---

# 89. 구현 전 확정: render 재사용의 실제 비용과 display feedback

`render-impact.mjs::renderSignatureMap`은 현재 screenshot SHA·runtimeResponseSha·assetSha·blocks가 있는 **완료된 capture**를 요구한다. 이 함수를 재사용하는 것만으로 screenshot 없는 placement만 비교하거나 촬영을 생략할 수는 없다. §52의 reuse는 이 실제 계약에 맞춰 구현한다.

v1 기본은 **affected bank를 현재 runtime으로 한 번 렌더하고 필요한 current item witnesses를 수집한 뒤, 기존 함수로 fresh review 범위를 줄이는 방식**이다. SVG/math를 불필요하게 다시 만들지 않지만 촬영/측정 비용 0을 약속하지 않는다. placement-only probe로 screenshot 수집까지 생략하는 최적화는 별도의 versioned observed-placement evidence와 충분한 equivalence 검증이 있을 때만 추가한다. 이전 screenshot SHA를 current observation으로 복사해서 API 요구사항을 채우지 않는다.

page reflow는 next item 한 개를 넘어 전파될 수 있다. affected bank의 전체 block/continuation placement를 확인하고 마지막 변경 지점까지 closure를 확장한다. review는 실제 영향 대상만 수행한다. current runtime response digest에 candidate bank 전체 hash를 무조건 합치면 모든 문항이 stale이 된다. runtime 코드/폰트와 per-item source/assets/placement를 분리하되 **원래 bank response provenance는 반드시 보존**한다. 분리는 검증된 adapter 변경으로 수행하고 기존 receipt를 새 의미로 해석하지 않는다.

`runtime.mjs`는 재사용하지만 정적 discovery는 동적 요청 전체의 증명이 아니다. `localFiles`와 후보 bank 전체의 problem/solution image dependency를 serving map에 합친다. original source URL→generated candidate bytes override를 manifest에 명시한다. 실제 요청은 canonical URL/response body로 검사하고 미결 promise를 모두 회수한 뒤 evidence를 닫는다. bundle에 외부 fallback URL이 나열되었다는 사실과 실제 외부 요청 발생을 구분한다. 무관 URL 문자열만으로 offline capture를 실패시키지 않되 실제 external dependency는 거부한다.

초기 `DisplayEnvelope`는 승인 size class와 bound Archive CSS/container 측정에서 얻는다. 이것을 D04에 넘기고 마지막 capture에서 실제 image content scale로 재확인한다. 실제 CSS transform/contain/letterbox가 다르면 graph 오차 및 label 크기의 기존 판정을 재사용하지 않는다. 이 feedback은 D05 단일 repair budget 안에서 처리한다.

재사용할 UID utility는 registry **validation/mapping 함수**이며 전체 저장소의 current registry/verified solution을 찾아주는 resolver가 아니다. `parentContext` 또는 설정된 repository authority adapter가 bound registry ref·current source ref·verified solution evidence ref를 제공해야 한다. 부재 시 정확한 missing authority를 반환하며 path/qid로 stable identity를 발명하지 않는다.

필수 추가 회귀: 3페이지 이상 연쇄 reflow, 같은 SVG/다른 solution 본문, candidate bank만 바뀐 무관 item, missing screenshot witness, runtime의 동적 asset 누락, original URL override의 실제 bytes, late response, medium/full envelope, registry 부재.
