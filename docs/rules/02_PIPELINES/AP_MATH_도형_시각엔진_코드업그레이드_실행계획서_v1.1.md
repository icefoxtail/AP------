# AP MATH 도형 시각엔진 코드 업그레이드 실행계획서 v1.1
## 현행 production + GOLD r01~r10 결과 통합 구현안

작성일: 2026-09-25
작업 브랜치: `codex/geometry-visual-engine-upgrade`
브랜치 기준 SHA: `4be6351d3f4cd722ca12639d9e652777e51426db`

상위 계약:
- `docs/rules/04_VISUAL/AP_MATH_도형_시각엔진_통합업그레이드_규격_v1.0.md`

> 이 문서는 새 파일럿 계획서가 아니다.
> GOLD r01~r10은 이미 완료된 R&D evidence이며, 본 문서는 그 성과를 현재 production 코드에 구현하는 실행계획이다.

# 0. 목표

종료점:
```text
Numeric Geometry
+ Semantic Model
+ Safe Math Serializer
+ Function Sampling/Viewport
+ Collision-aware Label Layout
+ SVG Composer
+ optional TikZ Adapter
+ Actual SVG Parity
+ Rendered BBox QA
+ Archive Real Render QA
=
GEOMETRY_VISUAL_ENGINE_CODE_READY
```

이번 단계에서는:
- main merge 금지
- production-wide SVG 교체 금지
- 도형의 방정식 FULL PILOT 시작 금지

# 1. 구현 원칙

1. GOLD branch 전체 merge/cherry-pick 금지
2. useful logic만 선별 이식
3. 기존 independent verifier 독립성 유지
4. candidate/evidence는 `archive/_generated/geometry-visual-engine/<run-id>/` 사용
5. 승인된 최종 자산만 production promotion
6. legacy와 new engine 병존 후 parity 확인
7. 다른 dirty/staged/untracked 변경 금지
8. `git add .`, `git add -A`, stash/reset/clean 금지

# 2. 목표 코드 구조

Python:
```text
archive/tools/geometry-equation/visual_engine/
    __init__.py
    geometry_model.py
    semantic_model.py
    math_expression.py
    function_sampling.py
    viewport.py
    label_layout.py
    style_tokens.py
    svg_composer.py
    tikz_adapter.py
    engine.py
    visual_spec.schema.json
    style_tokens.json
```

Node/browser QA:
```text
archive/tools/geometry-equation/
    verify-visual-engine-static.mjs
    verify-rendered-layout.mjs
    build-visual-render-matrix.mjs
    record-visual-browser-evidence.mjs
```

Tests:
```text
archive/tools/geometry-equation/tests/
    test_geometry_model.py
    test_math_expression.py
    test_function_sampling.py
    test_label_layout.py
    test_svg_composer.py
    verify-rendered-layout.test.mjs
    verify-visual-engine-static.test.mjs
    verify-svg-coordinate-parity.test.mjs   # 기존 유지
```

# 3. Phase 0 — Baseline Freeze

작업:
- 브랜치 HEAD 고정
- 현재 핵심 generator/verifier SHA 기록
- production assets baseline hash snapshot
- 기존 dirty 상태 기록, 비접촉
- regression fixture 고정
- GOLD 10개는 regression fixture로 재사용 가능
- 실제 좌표 겹침 원의 방정식 사례 최소 1개 추가

산출물:
`archive/_generated/geometry-visual-engine/<run-id>/config/baseline.json`

Gate:
```text
BASELINE_FROZEN = PASS
PRODUCTION_MUTATION_COUNT = 0
```

# 4. Phase 1 — Numeric Geometry Model

신규:
`visual_engine/geometry_model.py`

필수:
```text
line_from_two_points
line_intersection
parallel_check
perpendicular_check
point_on_line
foot_of_perpendicular
point_line_distance
circle_line_intersections
circle_circle_intersections
midpoint
internal_division
external_division
tangent_check
```

규칙:
- canonical `a*x+b*y+c=0`
- vertical line을 slope special-case로 처리하지 않음
- degenerate fail-closed
- numeric과 student-facing text 분리

Gate:
```text
GEOMETRY_MODEL_UNIT_PASS = 100%
OLD_NUMERIC_RESULT_PARITY = PASS
```

# 5. Phase 2 — Semantic Visual Model

신규:
- `semantic_model.py`
- `visual_spec.schema.json`

객체:
```text
POINT
POINT_NAME
COORDINATE_LABEL
LINE
SEGMENT
CIRCLE
FUNCTION_GRAPH
INTERSECTION
TANGENT
PARALLEL
PERPENDICULAR
PERPENDICULAR_MARK
ANGLE_MARK
LENGTH_LABEL
EQUATION_LABEL
GRAPH_ANNOTATION
CONDITION_BOX
AUXILIARY_LINE
LEADER_LINE
```

facts:
```text
sourceFacts
derivedFacts
displayFacts
```

semantic mark는 numeric relation 검증 후만 materialize.

Gate:
```text
UNKNOWN_COMPONENT = 0
UNVERIFIED_SEMANTIC_MARK = 0
SOURCE_DERIVED_PARITY_FAIL = 0
```

# 6. Phase 3 — Safe Math Serializer

신규:
`math_expression.py`

regex-only 일반 수식 변환 금지.

최소 AST:
```text
integer/rational/symbol
+ - * /
power
sqrt
function call
sin/cos/tan/log/exp/abs
prime
subscript
coordinate tuple
inequality
```

GOLD regression:
```text
(x+1)^2+(y-3)^2=2^2
x^2-3x+4
3(x-1)^2-3
x^3-4x
sqrt(5)
1/2
-3/2
f'(x)
x<=2
```

Gate:
```text
DISPLAYED_MATH_PARITY_FAIL = 0
DOUBLE_BACKSLASH_CORRUPTION = 0
UNRESOLVED_EXPRESSION = 0
```

# 7. Phase 4 — Function Sampling / Viewport

신규:
- `function_sampling.py`
- `viewport.py`

지원:
```text
2/3/4차
유리/무리
exp/log
sin/cos/tan
piecewise-compatible segmented curve
```

adaptive refinement:
- 고곡률
- root/intersection
- turning/inflection
- asymptote
- large screen delta

branch split:
- division by zero
- log boundary
- tan asymptote
- NaN/Inf
- large jump
- viewport escape

Gate:
```text
FALSE_CONNECTION_ACROSS_DISCONTINUITY = 0
CRITICAL_POINT_OUTSIDE_VIEWPORT = 0
GRAPH_SAMPLE_NONFINITE_LEAK = 0
```

# 8. Phase 5 — Label Layout Engine

신규:
`label_layout.py`

이번 업그레이드 핵심.

점:
```text
POINT_MARKER
POINT_NAME
COORDINATE_LABEL
```

후보:
`N NE E SE S SW W NW`

collision:
```text
label-label
label-coordinate
label-marker
label-axis/tick
label-line/circle/curve
label-auxiliary/indicator
label-conditionBox
label-safeArea
```

priority:
```text
P0 critical intersection/tangent/center
P1 source main point
P2 solution-required coordinate
P3 helper
P4 auxiliary/tick
```

fallback:
```text
candidate switch
→ name/coordinate split
→ coordinate relocation
→ low-priority coordinate suppression
→ side panel
→ leader line
→ viewport expansion
→ panel split
→ POLISH_REQUIRED
```

기존 generic fixed offset FINAL 제거.

Gate:
`UNRESOLVED_HARD_COLLISION = 0` 또는 명시적 `POLISH_REQUIRED`.

# 9. Phase 6 — Style Token / SVG Composer

신규:
- `style_tokens.py/json`
- `svg_composer.py`

token:
```text
axis/grid
mainShape/secondaryShape
mainCurve/secondaryCurve
tangent/auxiliary/indicator
point/criticalPoint
pointName/coordinateLabel/mathLabel
conditionBox/leaderLine
```

현행 geometry DOM z-order 승계.

composer는 layout result와 semantic object를 SVG로 materialize하며 수학 relation을 계산하지 않는다.

Gate:
```text
DUPLICATE_SEMANTIC_LABEL = 0
INVALID_STUDENT_DECIMAL_LABEL = 0
```

# 10. Phase 7 — TikZ Adapter

신규:
`tikz_adapter.py`

TikZ/PGFPlots는 optional backend.

사용 가치:
- complex math typography
- structured function graph
- geometry notation

모든 backend는 동일하게:
```text
actual SVG parity
displayed math parity
rendered layout QA
```
통과.

# 11. Phase 8 — production entrypoint 연결

수정:
- `generate-svg-from-independent-facts.py`
- `generate-svg-assets.py`

목표:
monolithic builder → thin adapter/orchestrator.

```text
load facts
→ semantic visual spec
→ visual_engine.engine.build()
→ candidate SVG
→ witness
```

custom branch는:
```text
STANDARD 흡수
SPECIAL registry
LEGACY fallback
```
으로 명시 분류.

기존 solutionImage contract 유지.

# 12. Phase 9 — Static / Actual SVG Gate

기존 유지:
- `verify-svg-coordinate-parity.mjs`
- `verify-line-equation-v22-actual-svg.mjs`

신규 aggregate:
`verify-visual-engine-static.mjs`

계산을 재구현하지 않고 기존 verifier 결과 + displayed math + structural result를 모은다.

Gate:
```text
STATIC_GATE_PASS
MATH_PARITY_PASS
SEMANTIC_PARITY_PASS
```

# 13. Phase 10 — Rendered BBox QA

신규:
`verify-rendered-layout.mjs`

실제 browser:
- `getBBox()`
- `getBoundingClientRect()`

측정:
```text
label-label overlap
label-point overlap
label-axis/tick overlap
critical label-line crossing
viewport clipping
safe margin
conditionBox overflow
leader crossing
```

2-pass 권장:
```text
Python approximate
→ browser bbox
→ repair suggestion
→ rebuild
→ final bbox
```

자동 relayout 최대 2~3회.

Gate:
```text
HARD_RENDERED_COLLISION = 0
CLIPPING = 0
```

# 14. Phase 11 — Archive Real Render QA

신규:
- `build-visual-render-matrix.mjs`
- `record-visual-browser-evidence.mjs`

기존 `record-browser-evidence.mjs`의 원칙 재사용:
- real browser only
- synthetic=false
- source/asset SHA binding
- solution image load
- horizontal overflow/error 확인

특정 q20/high1 하드코딩 제거.

필수:
```text
sol desktop
sol mobile
```

capture:
```text
missingGlyphCount
labelCollisionCount
criticalCollisionCount
clippedTextCount
overflowCount
loadedSvgCount
failedSvgCount
```

# 15. Phase 12 — Config / Workspace / Determinism

신규 engine은 dated report path 하드코딩 금지.

run config:
```json
{
  "engineVersion": "geometry-visual-v1",
  "runId": "...",
  "outputRoot": "archive/_generated/geometry-visual-engine/...",
  "productionBaselinePolicy": "READ_ONLY",
  "allowProductionWrite": false
}
```

TeX/dvisvgm/Python/Node/Chromium 사용자 절대경로 하드코딩 금지.

determinism:
```text
visual spec SHA
TeX SHA
normalized SVG SHA
semantic witness SHA
```

# 16. Phase 13 — Tests

기존:
`verify-svg-coordinate-parity.test.mjs` 유지.

추가:
```text
test_geometry_model.py
test_math_expression.py
test_function_sampling.py
test_label_layout.py
test_svg_composer.py
verify-rendered-layout.test.mjs
verify-visual-engine-static.test.mjs
```

regression:
```text
wrong perpendicular mark
wrong intersection
math exponent corruption
duplicate equation label
bad graph aspect
conditionBox multiline
Hangul glyph
coordinate overlap
point-name overlap
tick-coordinate overlap
circle tangent cluster
cubic/quartic
rational/log/tan discontinuity
```

# 17. Phase 14 — 기존 contract regression

검증:
```text
existing SVG coordinate parity
line-equation v22 verifier
solutionImage field contract
archive asset load
exam/sol/ans rendering
```

기존 PASS 자산을 자동 재생성하지 않는다.

# 18. Phase 15 — Performance

정확성 이후 측정:
```text
SVG bytes
DOM node count
path count
text node count
build time
browser layout time
desktop/mobile render time
```

우선순위:
```text
수학 정확성
학생 가독성
시각 완성도
렌더 안정성
재현성
성능/크기
```

# 19. 권장 commit 단위

1. `refactor(geometry): add shared numeric geometry model`
2. `feat(geometry): add semantic visual specification`
3. `fix(geometry): add safe math expression serializer`
4. `feat(geometry): add adaptive graph sampling and viewport`
5. `feat(geometry): add collision-aware label layout`
6. `refactor(geometry): add shared SVG composer and style tokens`
7. `feat(geometry): integrate shared visual engine into independent-fact builder`
8. `refactor(geometry): route legacy SVG builder through shared engine`
9. `feat(geometry): add rendered bbox visual QA`
10. `feat(geometry): add generic archive visual render evidence`
11. `test(geometry): add full visual-engine regression suite`
12. `chore(geometry): seal deterministic upgrade candidate`

각 commit 후 branch push.

# 20. 공통 테스트

최소:
```text
python -m py_compile archive/tools/geometry-equation/visual_engine/*.py
python -m unittest discover archive/tools/geometry-equation/tests -p "test_*.py"
node --check modified .mjs
node --test archive/tools/geometry-equation/tests/*.test.mjs
```

각 Phase:
```text
BUILD_PASS
NUMERIC_PARITY_PASS
SEMANTIC_PARITY_PASS
DISPLAYED_MATH_PARITY_PASS
STRUCTURAL_VALIDITY_PASS
```

browser 이후:
```text
RENDERED_LAYOUT_PASS
ARCHIVE_RENDER_PASS
```

# 21. Code Ready 종료조건

```text
SHARED_NUMERIC_MODEL_PASS
SEMANTIC_MODEL_PASS
SAFE_MATH_SERIALIZER_PASS
FUNCTION_SAMPLING_PASS
LABEL_LAYOUT_PASS
SVG_COMPOSER_PASS
ACTUAL_SVG_PARITY_VERIFIER_PASS
RENDERED_BBOX_QA_PASS
ARCHIVE_RENDER_QA_PASS
DETERMINISTIC_REBUILD_PASS
REGRESSION_FAIL = 0
UNRESOLVED_P0 = 0
UNRESOLVED_P1 = 0
```

완료 상태명:
`GEOMETRY_VISUAL_ENGINE_CODE_READY`

# 22. 이후 단계

CODE_READY 이후에만 도형의 방정식 FULL PILOT.

```text
전체 inventory freeze
→ KEEP/POLISH/REBUILD/RASTER_KEEP
→ 새 engine 적용
→ 전체 math parity
→ 전체 coordinate/label collision QA
→ archive desktop/mobile
→ 독립 전수검수
→ pinpoint repair
→ final seal
→ production promotion
```

새 GOLD 10회는 다시 돌리지 않는다.
