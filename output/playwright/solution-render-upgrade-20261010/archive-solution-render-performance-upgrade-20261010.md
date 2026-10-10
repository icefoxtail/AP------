# Archive 해설 진입 성능 업그레이드 — 2026-10-10

현재 fullwidth-aware main에 1차 해설 측정 생략을 최소 재적용하고, 시험지 완료 후 해설·정답을 차례로 준비하는 기본 prewarm을 추가했다. MathJax DOM 재사용과 첫 페이지 선표시는 실제 Chrome 실험에서 채택하지 않았다. 커밋·push·배포는 하지 않았다.

## A/B/C 실제 Chrome 결과

동일 Archive 원본 JS 3개를 Chrome 1280×720 CSS px, DPR 1, `fit=screen`, `qpp=4`, `prewarm=0`으로 열고 시험지에서 해설을 실제 클릭했다. 새 런타임에서 click 후 output-envelope 준비가 끝나기까지 약 2.10–2.16초가 더 들었다. 아래 `visibleReady`는 그 뒤 해설 snapshot이 보일 준비를 마친 시점이다.

| 시험지 | 보존된 원 cold baseline | 이전 1차 최종 | 현재 final cold | 페이지 / 해설 상자 / 분할 | 답 / 이미지 | MathJax / layout barrier | 잘림·overflow |
|---|---:|---:|---:|---|---|---|---|
| A 매산여고 | 37.930초 | 19.016초 | 21.035초 | 20 / 40 / 32 | 23답 / SVG 12 | 14.712초, 33 | 잘림 0, overflow 0px |
| B 복성고 | 8.275초 | 4.535초 | 4.606초 | 6 / 25 / 2 | 24답 / 이미지 0 | 3.761초, 3 | 잘림 0, overflow 2px |
| C 효천고 | 20.521초 | 10.301초 | 10.211초 | 14 / 29 / 12 | 23답 / SVG 18 | 7.623초, 13 | 잘림 0, overflow 1px |

현재 cold 결과는 보존된 첫 baseline보다 A 44.5%, B 44.3%, C 50.2% 짧다. 첫 1차 최종 수치와 비교하면 A는 2.019초, B는 0.071초 느리고 C는 0.090초 빠르다. 첫 보고서와 raw 결과는 main drift 뒤 현재 checkout에서 찾을 수 없어, 이 차이를 추가 최적화의 속도 향상으로 주장하지 않는다.

본문 해시 알고리즘은 문항 sourceRef 순서로 답과 모든 해설 조각의 `textContent`를 합친 뒤 SHA-256을 계산하고, 별도 HTML 해시는 각 `.sol-exp.innerHTML`을 기록했다. 현재 B/C 해설 본문·HTML 해시는 남아 있는 이전 1차 최종 Chrome session 결과와 각각 정확히 일치한다. A 본문 해시는 현재 공유 경로와 실제 `solutionAuthority=legacy` Chrome 경로가 일치했다. 세 roster 원본 JS의 SHA-256은 보고서 JSON에 결속했다.

## 실험 결론

**1. 이미 조판된 MathJax DOM을 분할 조각으로 재사용 — 미구현.** 실제 Chrome A q4에서 typeset DOM의 top-level node 132개가 source chunk contract의 88개 조각과 달라 `SOLUTION_CHUNK_SCHEMA_PARITY_FAILED`로 transaction이 실패했다. 40개의 `mjx-container`가 있는 상태에서 boundary를 강제로 바꾸면 planner의 split geometry가 달라지므로 적용하지 않았다. 후보 출력이 commit되지 않아 후보 경로의 최종 본문·수식 parity나 속도 향상은 주장하지 않는다. 화면에는 기존 6페이지 시험지가 그대로 남았다.

**2. 첫 해설 페이지 먼저 표시 — 미구현.** A의 test-only Chrome preview는 전체 measured planner가 READY된 뒤에야 첫 페이지 DOM을 만들 수 있었다. planner 완료 후 첫 페이지 DOM까지 2.2ms였고, test overlay를 실제 표시한 시점은 final `VISIBLE_READY`보다 466ms 빨랐다. planner가 32회 missing-range 측정을 마칠 때까지 첫 페이지 계획은 나오지 않았다. 첫 페이지 화면을 transaction의 final commit 전에 노출하면 print와 snapshot readiness 계약을 확장해야 하는데, 이 실험에서는 얻을 수 있는 cold 시작 단축이 약 0.47초뿐이었다. 첫 페이지 preview가 보일 때 safePrint를 요청하자 `window.print` test stub은 final solution 20페이지, MathJax ready, 완성된 output envelope 이후에만 호출됐고 preview는 `beforeprint`에 숨겨졌다. 이 실험은 OS 인쇄를 수행하지 않았다.

**3. 제한적 해설 사전 준비 — 기본 활성화.** 정상 Archive 원본 화면은 foreground `VISIBLE_READY` 뒤 1초간 trusted 입력이 없으면 idle callback에서 sol을 준비하고, 그 뒤 ans를 순차 준비한다. 준비 중 pointer/wheel/keydown/input, 인쇄, 숨김 전환, pagehide가 오면 background request를 취소한다. 사용자가 계속 머물러 화면이 다시 조용해지면 빠진 mode를 재개한다. 완료된 snapshot은 현재 화면을 바꾸거나 print-ready로 표시하지 않는다. `prewarm=0`, `snapshotCache=0`, QR/preview/review snapshot 및 review bridge, dual-run/observed/legacy measurement 경로는 제외한다.

실제 `.3` Chrome B에서는 시험지 foreground 1.821초 후 1초 quiet 정책에 따라 sol 4.135초, ans 39ms에 background 준비가 끝났다. 이어서 해설 버튼을 누른 runtime cache hit는 72ms visible-ready였고, 6페이지·24답·2 continuation 및 본문/HTML 해시가 유지됐다. A 장문 해설도 background에서 20페이지 snapshot을 완성한 뒤 205ms cache-hit visible-ready였으며 본문·분할·SVG 12개·MathJax readiness가 cold 공유 경로와 같았다.

background batch를 질문 1개씩, planner chunk 8개씩 MathJax 조판하고 각 묶음 뒤 취소 가능한 event-loop yield를 넣었다. 이전 bulk prototype에서 기록된 pointerdown 지연 175.9ms, 최대 frame gap 1,233ms, 최장 long task 1,180ms가 batched A 실험에서는 wheel 처리 지연 53.8ms, frame gap 99.9ms, 최장 long task 523ms로 줄었다. 그 입력 때 background solution은 `DISCARDED_STALE`이 됐고 exam snapshot은 ACTIVE 상태로 남았으며 partial sol snapshot은 등록되지 않았다. 이는 한 Chrome 기기의 표본이며 모든 기기에서 같은 상한을 보장하지 않는다. 긴 해설을 준비하는 중에 사용자가 mode를 누르면 해당 준비가 취소될 수 있고, mode click은 envelope 준비를 위해 runtime 시작 전 약 2.1초를 사용한다. envelope 경로는 이번 마감 범위에서 바꾸지 않았다.

source-change Chrome 검사에서는 B의 sol/ans prewarm 완료 뒤 효천고 source를 새 `SOURCE_CHANGE`로 열었다. session ID와 source가 새 값으로 바뀌고 새 session에는 exam만 ACTIVE, sol/ans는 null로 시작해 이전 source의 준비물이 재사용되지 않았다. `snapshotCache=0`과 `qr=1` 실제 Chrome 경로에서는 prewarm audit가 비어 있고 foreground SOURCE_CHANGE만 실행됐다. review snapshot exclusion은 `sourceKind==='review-snapshot'` guard와 review bridge URL의 `prewarm=0` 계약 및 runtime 단위 검사로 확인했다.

## Fullwidth 해설 SVG 및 상세 경로

실제 fullwidth solutionImage가 있는 신흥중 중간고사 JS(SHA-256 `6ae757501d3819612be07d8f14495cf6f016aa90b7693dbd3b62c8a309a7ed55`)를 `.3` Chrome에서 시험지→해설로 열었다. q10은 page 4를 단독 사용해 `columnSpan=2`, `layoutTag=fullwidth`로 배치됐고 q9는 page 3, q11은 page 5다. q10의 390×360 SVG는 전체 크기로 로드되어 해설 상자 안에 들어갔다. fullwidth 열 680px, 해설 상자 656×855px, 실제 raw/tight flowHeight 각 883.016px였으며 10페이지 전체에서 overflow·잘림·unrendered MathJax가 없었다. 화면 캡처는 [fullwidth-q10-chrome.png](C:\Users\USER\Desktop\AP------\output\playwright\solution-render-upgrade-20261010\fullwidth-q10-chrome.png)에 있다.

같은 fixture의 실제 `renderAuthorityDualRun=1` 실행은 full detail ledger(`SOLUTION_DECISION_DETAIL_V1`, 24 blocks)를 유지했다. q10 fullwidth placement와 SVG가 포함된 전체 render dual-run이 equal, solution layout promotion gate도 equal이었다. page/column/order/source/fullwidth/continuation/renderGeometry/overflow parity가 모두 true이며 omission/duplication/differences는 0이었다.

## 구현 파일과 검증

- `archive/solution-render-executor.js`: normal authority+batch 경로에서 중복 raw/tight, 전 문항 chunk 및 continuation-shell 사전 측정을 생략하고 source-free `SOLUTION_LAYOUT_ROSTER_V1` denominator/measurement source를 기록한다. `renderer=legacy`, `measurement=legacy`, `layoutPlanner=observed`, `renderAuthorityDualRun=1`은 기존 상세 경로를 유지한다.
- `archive/layout-materializer.js`: actual narrow/fullwidth output column에서 raw/tight flowHeight를 재고, 양쪽 모두 용량을 넘는 문항만 chunk를 만들며 sentinel chunk count를 actual count로 replanning한다. query 상한도 actual chunk count에 따라 확장한다.
- `archive/screen-runtime-adapter.js`: default bounded idle prewarm, quiet/input/print/visibility cancellation, source-key-aware ready snapshot reuse, background-only chunked MathJax yielding을 구현했다.
- `archive/engine.html`: module URL은 materializer/executor `.2`, adapter `.3`; candidate engine fingerprint `.3`으로 갱신했다. output envelope contract 및 print path는 바꾸지 않았다.
- `tests/archive-fast-engine-runtime.test.js`, `tests/archive-render-authority-adapter.test.js`: default prewarm/exclusion/cache version 검증을 갱신했다.

검증 exit 결과:

- `node tools/check-archive2-runtime.cjs` — PASS, 42/42.
- `node --test tests/archive-fast-engine-runtime.test.js tests/archive-render-authority-adapter.test.js tests/layout-authority.test.js tests/archive-solution-materializer-fit.test.cjs` — PASS, 41/41.
- `node tests/archive-solution-image.test.js` — PASS.
- 세 owned JS 및 browser test helper `node --check` — PASS.
- `git diff --check` — PASS.
- 실제 Chrome `.3` mode flow와 actual fullwidth solutionImage/dual-run은 위 결과대로 검증했다.

작업 시작 시 HEAD는 `20afab1c516c71e0d4e4d04a2978b1b5e155c268`였다. closeout 때 main은 다른 Palma merge로 `78745111d624ddad766c494dd3d6f8bc859bfef8`까지 전진했지만, 두 commit 사이에 이번 owned 파일 변경은 없었다. 기존 first-pass report 파일은 drift 뒤 현재 checkout에서 찾지 못해, 이전 세션에 남은 A/B/C baseline 수치와 원본 SHA를 보존하고 이번 raw Chrome JSON을 이 upgrade 폴더에 새로 저장했다. 기존 full-browser cancellation `PREPARE` NOT_PASS는 이번 background prewarm cancellation PASS와 별개이며, 이 작업에서 PASS로 재분류하지 않았다.

## 재현 자료와 최종 결속

새 원시 evidence 및 재현 파일은 `C:\Users\USER\Desktop\AP------\output\playwright\solution-render-upgrade-20261010\` 아래에 보존했다. A/B/C cold 결과는 `chrome-A-post-headless.json`, `chrome-B-post-headless.json`, `chrome-C-post.json`; B prewarm cache 재조회는 `prewarm-default-final-B-state.json` 및 `prewarm-default-final-B-click.json`; A prewarm 결과는 `prewarm-default-A-yielded.json` 및 `prewarm-default-A-after-click.json`; 입력 중단은 `prewarm-interruption-yield-v2-A.json`; source 변경 무효화는 `source-change-cache-invalidation-summary.json`; 제외 경로는 `exclusion-snapshotcache0.json` 및 `exclusion-qr.json`이다. 첫 페이지·print-gate prototype은 `progressive-first-page-A-prototype.json`과 `progressive-first-page-A-print-gate.json`, MathJax DOM 재사용 실패는 `experiment1-mathjax-dom-reuse-not-implemented.json`이다. fullwidth 실제 출력/상세 경로는 `chrome-fullwidth-solution-image-final.json`, `chrome-fullwidth-dualrun-final.json`, `fullwidth-q10-chrome.png`다. 재실행 helper도 같은 폴더에 남겼다.

본문 SHA-256 / HTML SHA-256은 각각 A `8bec4e403bba634204ec3396a851488fb74e0ab515046047a0aa9fb350e584b3` / `34d5d4fd594126f89fb0a254c7595d04bc019ed1d9c050d44e6f55272307ce61`, B `0438732059795b03aaf76adb493344aaa473366a6f4658a5f3ca749514cb9497` / `d73f3352edc118c347791209fb71301956f25403e05ec3d5c21bdf9dc54748fd`, C `d8dc60dda8efdb705c0c9d219d853984c664ece6c8b257899851c8f8f71fb55` / `514850954aa312f98cf1f518ec92936f464b625710c36c9cbb4dde72b2b426d2`이다. roster JS SHA-256은 A `7f283c40ccf322a73079324f53b161315ab142579b80790de4469008330be156`, B `550d579f4470bf6d4613c7865fa3fc5da9175d999b50fc31a97377b28092afae`, C `80cc1d0d2af2a76471441583075d0c2a04f62986d9ac95349c4985a9b2f3e54c`, fullwidth fixture `6ae757501d3819612be07d8f14495cf6f016aa90b7693dbd3b62c8a309a7ed55`다. 이 SHA는 `archive/exams/original/high/h1/2mid/25_매산여고_2학기_중간_고1_기출.js`, `archive/exams/original/high/h1/1mid/26_복성고_1학기_중간_고1_기출.js`, `archive/exams/original/high/h1/2mid/25_효천고_2학기_중간_고1_기출.js`, `archive/exams/original/middle/m3/2mid/25_신흥중_2학기_중간_중3_수학.js`에 대응한다.

최종 checkout HEAD는 `78745111d624ddad766c494dd3d6f8bc859bfef8`; 작업 시작 HEAD는 `20afab1c516c71e0d4e4d04a2978b1b5e155c268`였다. 두 commit 사이 remote/main drift의 commit diff는 이번 owned runtime/test 파일을 건드리지 않았다. 최종 source SHA-256은 다음과 같다.

| 파일 | SHA-256 |
|---|---|
| `archive/engine.html` | `b6ec80337e7d03de83c2b801f6b51d6a56599dc7cdbb43f0a799e265b997f865` |
| `archive/solution-render-executor.js` | `b0fa2ee21092bd64c968f391e890db0865add6344580561c10eb9cd4b8c5e5c3` |
| `archive/layout-materializer.js` | `2b5489e93ec6bffbb536f04ac1407d7dff7e2bda1f243593135821c2a09ba122` |
| `archive/screen-runtime-adapter.js` | `8d8b73115f1734c15850eb674db649f0cf4cab73de346e54e659dabcf57b6777` |
| `tests/archive-fast-engine-runtime.test.js` | `e7ebc9a9d658df825d4ecc2c186bc4dbca93df2628466b4115e29ae3308f778f` |
| `tests/archive-render-authority-adapter.test.js` | `1b8d9157d598398dc54473c417cdbe709670f11f93a7b7a8242ab4696eb5eccd` |

검사 원문은 `check-archive2-runtime-final.log`과 `archive-runtime-relevant-tests-final.log`에 있다. 저장된 상세 결과의 JSON 요약은 `solution-render-performance-upgrade-20261010.json`이다. 이 작업 전의 full-browser cancellation PREPARE 실패는 기존 실패 증거로 남기며, 여기서 검사 조건이나 분모를 낮추지 않았다.
