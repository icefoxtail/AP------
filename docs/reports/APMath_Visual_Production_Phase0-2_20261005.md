# APMath Construction & Visual Production — Phase 0–2 완료 보고

> **2026-10-06 P1 검토 정정:** 이 보고서의 세 UID 완료는 locator 기반 물리 E2E
> 실험을 뜻한다. Canonical/current UID authority가 닫혔다거나 기존 검수가
> Blind/Freeze→Compare였다는 해석은 철회한다. 새 경계와 수정 검증은
> `APMath_Visual_Production_P1_Repair_20261006.md`를 따른다. 기존 evidence는
> before-repair 이력으로 보존하며 새 검수 자격으로 자동 승격하지 않는다.

- branch: `codex/apmath-visual-production-phase0-2-20261005`
- 시작 main: `4309245e57abc8f9318fb76a506b0c68b3d2aa6c` (fetch 결과 사용자 기준과 일치)
- 범위: Phase 0 / 1 / 2의 요청된 최소 종료 기준 완료. Phase 3 이후, 전체 qualification, Seal/ACTIVE, production 쓰기, main merge는 수행하지 않았다.
- 최종 HEAD는 최종 응답의 Git 검증값을 따른다. 본문은 자기 commit SHA를 포함하지 않는다.

## 검증

| 검사 | 결과 |
|---|---|
| 기존 시작 기준 Python / Node | 118 / 48 PASS |
| 최종 geometry Python 전체 | 130/130 PASS |
| 최종 geometry + 기존 provider adapter Node | 94/94 PASS |
| 기존 publication fixtures static | 5/5 PASS |
| 기존 publication browser | 5/5 PASS |
| 기존 publication Actual Archive desktop | 5/5 PASS |
| Typography actual `<img>` spike | full PASS, medium의 7.64px negative 검출 |
| 실제 UID 3건 closure audit | 3/3 PASS, source policy/current fingerprint 일치 |

신규 test: `production-contract.test.mjs`, `construction-spike.test.mjs`,
`typography-spike.test.mjs`, `test_notation_spike.py`, `test_graph_spike.py`,
`production-runner.test.mjs`, `primitive-observer.test.mjs`, `source-policy.test.mjs`.
기존 provider adapter 18건도 변경 영향 검사로 다시 실행했다.

## Phase 0

Node pipeline-core canonical을 유일한 새 object hash authority로 사용한다.
Python은 그 UTF-8 blob의 raw SHA를 확인한다. 원본 raw bytes, object SHA,
기존 GE Python canonical hash, 기존 collector raw-hex SHA의 의미를 분리했다.
exact integer/rational/AST는 typed 문자열/트리로 전달하며 eval/sympify를 사용하지 않는다.
1/1.0, -0, NFC, unsafe number, exact scalar, bytes/ref mutation 회귀를 추가했다.

stable UID/surface/semantic-role → visualAssetKey → assetId와 plan revision을 분리했다.
generated 경로와 junction 이탈을 검사하고, writer lock + fsync + staging directory
rename + 마지막 immutable manifest로 commit한다. partial staging은 cache가 아니다.
계산 cache와 source/math/render/reviewer 증거를 분리하며 observer 변경은 감사/정책
fingerprint를 무효화한다. Source 정책 변경 시 이전 review를 그대로 승인하지 않고
새 독립 review와 새 plan ref를 만든다. required-audit descriptor와 scope fingerprint는
EXPERIMENTAL이며 qualification/activation 권한이 아니다.

## Phase 1

- Construction: 동일 primitive input을 SymPy 1.14.0 production과 CindyJS 0.0.5에서
  따로 실행했다. 수선의 발, 중점, 분기 교점, SSS 비좌표 realization, 3개 input 값,
  hidden branch refs/cycle/override/unknown op, 좌표 변조, timeout/recovery를 검사했다.
  Cindy에는 SymPy 결과 좌표를 전달하지 않는다.
- Typography: pinned Noto Sans KR outline과 실제 MathJax SVG를 사용했다. 한글,
  분수/근호/지수/아래첨자/prime/π/degree/unit, AB entity/product, programmatic AST의
  우선순위를 검사했다. actual Archive full 최소 약 19.99px, tall medium 약 7.64px.
  Final XML observer는 owner/glyph tree/bytes/ancestor-transform 변조를 거부한다.
- Graph: 기존 sampler를 유지하고 별도 SymPy root isolation + rational enclosure /
  second-derivative / sqrt boundary secant observer를 추가했다. 실제 polyline의 내부,
  topology, coverage와 root feature를 검증한다. 정점만 정확한 잘못된 chord, 중근 이동,
  clustered root, hole, pole crossing, sqrt endpoint 누락, viewport 재진입, clipped endpoint
  회귀를 검사했다. 0.35px 한계를 늘리지 않았다.

## Phase 2 실제 사례

세 건 모두 UID 입력에서 original bank/source image resolve → fresh verified solution
→ planner → 독립 source-condition review → frozen plan → normalizer → execution
→ 독립 reconstruction → frozen typography → 실제 browser measurement → display-envelope
layout → SVG → 독립 static audit → 실제 Archive desktop → 독립 visual review → result로 연결했다.

| 사례 | canonical UID v2 | 상태 | 실제 최소 CSS font |
|---|---|---|---|
| Geometry source coordinates, 두 점 거리 | `25_효천고_2학기_중간_고1_기출\|1` | 완료 | 15.528px |
| Polynomial graph | `25_연향중_1학기_기말_중3_기출c\|10` | 완료 | 15.528px |
| 추가 Geometry, 좌표 없는 직각삼각형 SSS | `25_삼산중_2학기_기말_중2_기출\|1` | 완료 | 15.528px |

Actual Archive는 수정하지 않은 `engine.html`, `mode=sol`, 1440×1000, no-fit이며
전체 original bank를 generated candidate overlay로 전달했다. 바뀐 것은 target의
generated solution-image attachment뿐이다. Body/choices/answer/solution/source image의
parity를 검사했다. `sol`의 native reminder에는 선택지/원본 문제 그림이 표시되지 않는
기존 제품 정책을 보존했다. Review는 원본 source packet/image, 최종 image crop와
native solution-block screenshot을 함께 받았다.

초기 실제 FAIL도 보존했다: 거리 계산 노드 누락, branch schema 오류, 누락 tick,
y축 10 라벨의 눈금 불일치, BC 길이 owner 모호성. 사실 JSON이나 final SVG를 고친 것이
아니라 typed op/schema/notation/layout 경로를 수리하고 같은 frozen plan/정상 builder를
통해 새 revision을 생성·재검했다. Native solution 모드의 선택지 누락과 실제 문항
데이터 손실은 분리했고, 보호 필드 parity와 기존 engine 코드로 전자를 확인했다.

## 최종 불변 evidence

루트: `archive/_generated/geometry-visual-engine/production/` (ignored, 로컬 보존).

| UID | RESULT key | result raw SHA256 |
|---|---|---|
| 효천고 1 | `7eae1d6e69f0492aa9019bad166e9a6f354e84af48faa0c0d326cd84d5a94b0a` | `5923a60f5399eae49e5f97c74d3f39a739b333d361536a0fa140e1cbb8077d69` |
| 연향중 10 | `58f3b951c5b8e6d221f8f01409ca10ef227fa2fbab3fde4e1b7df201bb6f12a5` | `60f0631ab1da10be0d16bba9f82864a99eaa1499d05f8bb389a0f2cae4905d4d` |
| 삼산중 1 | `7ade66bf5af0bec6f7d74f1b3dc3dcd6da63151f2814b0cafc497771ee98e551` | `249714907574b6c7722345d622ab3c0551a13b4ea4860a5355410bf4188ef2b1` |

각 파일은 `stages/RESULT/<key>/result.json`이며, manifest와 linked stage receipts에
source/solution/plan/model/fragments/metrics/SVG/audit/bank/capture/review refs가 있다.
`final-slice-audit-summary.json`은 각 ref bytes/hash, source policy, provider context
분리, final SVG/screenshot review 결속, actual layout/font를 재검한다.

Final SVG raw SHA:

- 효천고: `1164ed26377f9a61e3304df423ef4604ef37f962f4882542a6176735fefee7a7`
- 연향중: `7fef6d2a78b76cecc92a5ed08a68af6bed3785579a56109df45713827f127a5f`
- 삼산중: `734622eeaf464ca6cadecce46d649b9a67b32735bb614d993b6cd958e7652e3f`

## Unsupported / unresolved 및 main merge 전 검토

범용 제약/realization solver, scalar node refs, selected-point의 일반 geometry descendants,
Cindy line/line 교점은 미지원이다. Rational/sqrt는 spike observer의 제한된 범위만 검증했고
real UID publication은 polynomial만 dispatch한다. Hole marker 누락과 pole crossing은 FAIL,
subpixel clustered root는 UNSUPPORTED다. Trig/log/exp/abs/piecewise, mixed geometry/graph,
일반 mixed Korean/TeX shaping은 qualification하지 않았다.

hard-crash의 잔존 lock은 owner/process 확인 후 reconcile해야 하며 age로 삭제하지 않는다.
후기 layout/render defect의 범용 자동 repair, 전체 qualification ≥10 UID, Seal/ACTIVE,
다른 OS/browser CI 및 durable remote evidence registry는 후속 범위다.

Merge 전: 새 AppServer continuation의 isolation/timeout/모델 경로와 dependency/license,
scoped UID mapping의 기존 parent registry 편입 정책, Windows 외 CI, 엄격한 graph bound의
확대 범위, evidence 보존 경로를 별도 검토한다. 이번 case PASS를 전체 qualification으로
확대하지 않는다. Production exam JS/SVG 및 main 변경은 없다.

## 실제 수정 파일 전체 (41)

```text
alive/runtime/provider-bridge/codex-appserver-adapter.mjs
archive/tools/geometry-equation/production/README.md
archive/tools/geometry-equation/production/audit-slice.mjs
archive/tools/geometry-equation/production/cindy-observer.mjs
archive/tools/geometry-equation/production/construction.py
archive/tools/geometry-equation/production/contracts.mjs
archive/tools/geometry-equation/production/dependencies.mjs
archive/tools/geometry-equation/production/dependency-lock.json
archive/tools/geometry-equation/production/fingerprint.mjs
archive/tools/geometry-equation/production/graph-observer-worker.py
archive/tools/geometry-equation/production/graph_observer.py
archive/tools/geometry-equation/production/graph_spike.py
archive/tools/geometry-equation/production/phase2.mjs
archive/tools/geometry-equation/production/primitive-observer-worker.py
archive/tools/geometry-equation/production/repair-budget.mjs
archive/tools/geometry-equation/production/requirements.txt
archive/tools/geometry-equation/production/resolve-request.mjs
archive/tools/geometry-equation/production/run.mjs
archive/tools/geometry-equation/production/runtime-package-lock.json
archive/tools/geometry-equation/production/runtime-package.json
archive/tools/geometry-equation/production/setup-spikes.mjs
archive/tools/geometry-equation/production/source-policy.mjs
archive/tools/geometry-equation/production/store.mjs
archive/tools/geometry-equation/production/typography-spike.mjs
archive/tools/geometry-equation/production/typography.mjs
archive/tools/geometry-equation/production/worker.mjs
archive/tools/geometry-equation/production/worker.py
archive/tools/geometry-equation/record-visual-browser-evidence.mjs
archive/tools/geometry-equation/tests/construction-spike.test.mjs
archive/tools/geometry-equation/tests/primitive-observer.test.mjs
archive/tools/geometry-equation/tests/production-contract.test.mjs
archive/tools/geometry-equation/tests/production-runner.test.mjs
archive/tools/geometry-equation/tests/source-policy.test.mjs
archive/tools/geometry-equation/tests/test_graph_spike.py
archive/tools/geometry-equation/tests/test_notation_spike.py
archive/tools/geometry-equation/tests/typography-spike.test.mjs
archive/tools/geometry-equation/verify-rendered-layout.mjs
archive/tools/geometry-equation/visual_engine/engine.py
archive/tools/geometry-equation/visual_engine/math_expression.py
archive/tools/geometry-equation/visual_engine/svg_composer.py
docs/reports/APMath_Visual_Production_Phase0-2_20261005.md
```
