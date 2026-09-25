# AP MATH 도형 시각엔진 통합 업그레이드 규격 v1.0
## GOLD r01~r10 결과 + 현행 도형 정본 통합본

작성일: 2026-09-25
작업 브랜치: `codex/geometry-visual-engine-upgrade`
브랜치 기준 SHA: `4be6351d3f4cd722ca12639d9e652777e51426db`

> 이 문서는 새 GOLD 파일럿 계획서가 아니다.
> 이미 완료된 GOLD r01~r10과 HOLDOUT의 성과·실패를 현재 production 도형 규칙에 흡수한 상위 구현 계약이다.
> 같은 GOLD 10문항을 다시 10회 반복하는 것을 요구하지 않는다.

# 1. 기준 자료

현행 도형 정본:
- `docs/rules/04_VISUAL/도형의방정식_해설_SVG_독립검수_운영규정_v1.1.md`
- `docs/rules/04_VISUAL/도형추출.md`
- `docs/rules/04_VISUAL/기하_시각자료_해설_독립검수_통합운영규정_v1.1_QUALIFICATION_READY.md`

현행 production:
- `archive/tools/geometry-equation/generate-svg-from-independent-facts.py`
- `archive/tools/geometry-equation/generate-svg-assets.py`
- `archive/tools/geometry-equation/verify-svg-coordinate-parity.mjs`
- `archive/tools/geometry-equation/verify-line-equation-v22-actual-svg.mjs`
- `archive/tools/geometry-equation/record-browser-evidence.mjs`

GOLD evidence:
- `artifacts/tex-pilot/gold-pilot/`
- GOLD r01~r10 iteration reports
- HOLDOUT 3 cases
- GOLD generator/schema/witness/render evidence

# 2. GOLD에서 승계할 것

다음은 production engine으로 승계한다.

1. Numeric Geometry Authority
   - canonical line: `a*x + b*y + c = 0`
   - intersection, parallel, perpendicular, tangent relation
   - sourceFacts / derivedFacts 분리

2. Semantic Visual Model
   - POINT / LINE / SEGMENT / CIRCLE / FUNCTION_GRAPH
   - INTERSECTION / TANGENT / PARALLEL / PERPENDICULAR
   - EQUATION_LABEL / CONDITION_BOX / AUXILIARY_LINE
   - 의미 검증 후 materialize

3. Visual System
   - shared style token
   - geometry와 graph의 aspect policy 분리
   - AUTO label 후보
   - deterministic witness
   - desktop/mobile browser QA

# 3. GOLD에서 그대로 승계하지 않을 것

## 3-1. regex-only math serializer 금지

GOLD 독립검수에서 표시식 변조가 확인됐다.

예:
```text
x^2-3x+4
→ x^{2-3x+4}
```

따라서 production은:
```text
source math
→ safe expression model / AST
→ TeX serialization
→ rendered display
→ DISPLAYED_MATH_PARITY
```
를 사용한다.

## 3-2. machine structural PASS를 visual PASS로 간주 금지

다음을 분리한다.

```text
SVG_STRUCTURAL_VALIDITY
VISUAL_COLLISION_GATE
TYPOGRAPHY_GATE
COMPOSITION_GATE
PEDAGOGICAL_VISUAL_GATE
```

## 3-3. item-level review를 aggregate가 덮어쓰기 금지

```text
aggregate unresolved count
=
item-level unresolved count
```

불일치 시 `AGGREGATE_EVIDENCE_FAIL`.

## 3-4. standalone render만으로 FINAL 금지

최소:
```text
standalone desktop
standalone mobile
archive sol desktop
archive sol mobile
```
모두 PASS.

# 4. 현행 production에서 유지할 강점

- Python numeric authority 유지
- blind solve → EXPECTED FACT freeze 유지
- actual SVG geometry 역검증 유지
- metadata만 읽고 PASS 금지
- equal-scale가 필요한 좌표기하의 축척 정직성 유지
- geometry z-order / stroke hierarchy / exact coordinate label 규칙 유지
- 기존 independent verifier는 builder와 독립성 유지

# 5. 핵심 업그레이드: Coordinate Label Layout Engine

현재 generic production 경로의 고정 offset 라벨은 FINAL 방식으로 사용하지 않는다.

한 점을:
```text
POINT_MARKER
POINT_NAME
COORDINATE_LABEL
```
로 분리한다.

후보 위치:
```text
N NE E SE S SW W NW
```

충돌 검사:
```text
label ↔ label
label ↔ coordinate label
label ↔ point
label ↔ axis/tick
label ↔ line/circle/curve
label ↔ auxiliary/indicator
label ↔ condition box
label ↔ safe area
```

priority:
```text
P0 핵심 교점/접점/중심
P1 원문 핵심점
P2 풀이 필수 좌표
P3 보조점
P4 보조 설명/눈금
```

fallback:
```text
후보 위치 변경
→ name/coordinate 분리
→ coordinate 별도 이동
→ 낮은 priority 좌표 생략
→ side panel
→ leader line
→ viewport 확대
→ panel 분리
→ POLISH_REQUIRED
```

font-size 무한 축소는 금지한다.

# 6. Rendered BBox가 최종 기준

builder-time approximate bbox는 허용한다.
FINAL collision은 실제 browser rendered bbox로 검증한다.

```text
approximate layout
→ SVG render
→ browser getBBox()/BoundingClientRect
→ actual collision detection
→ 제한된 relayout
→ final render
```

무한 relayout 금지. 최대 2~3회.

# 7. 학생용 좌표 표시

내부 float와 학생 표시 문자열을 분리한다.

우선:
```text
정수
기약분수
근호
간단한 기호식
검증된 유한소수
```

정확 표현을 독립 확정할 수 없으면 점 이름만 표시하고 값은 solution/side panel로 보낸다.

# 8. 함수 그래프 production 범위

Python numeric layer를 유지·확장한다.

지원 목표:
```text
2차 / 3차 / 4차
유리 / 무리
지수 / 로그
sin / cos / tan
미분 그래프 / 접선 / 할선
```

adaptive sampling:
- 고곡률
- 근/교점
- 극값/변곡점
- 점근선 근처

branch split:
- 분모 0
- log 정의역 경계
- tan 점근선
- NaN/Inf
- 큰 jump
- piecewise 분기

geometry는 equal-unit, function/calculus는 readability aspect.

# 9. 역할 분담

```text
Python
= Numeric / Geometry Authority

TeX / TikZ / PGFPlots
= Math Typography + structured vector drafting

SVG Composer
= Korean text + semantic layout + panel composition

Browser QA
= rendered bbox / clipping / collision / final appearance
```

TikZ를 모든 그림의 강제 backend로 만들지 않는다.

# 10. STANDARD / SPECIAL

STANDARD:
```text
facts → semantic model → generator → SVG → QA
```

SPECIAL:
handcrafted TikZ/SVG 허용. 단:
```text
numeric witness
semantic witness
actual SVG parity
same browser QA
```
필수.

문항 ID hack을 generic STANDARD engine에 넣지 않는다.

# 11. 목표 production flow

```text
SOURCE / PRODUCTION JS
↓
BLIND SOLVE
↓
EXPECTED FACT FREEZE
↓
VISUAL TYPE
↓
NUMERIC GEOMETRY
↓
SEMANTIC MODEL
↓
FUNCTION SAMPLING / MATH TYPOGRAPHY
↓
SVG COMPOSER
↓
LABEL LAYOUT
↓
STRUCTURAL VALIDITY
↓
ACTUAL SVG FACT PARITY
↓
DISPLAYED MATH PARITY
↓
RENDERED BBOX COLLISION QA
↓
TYPOGRAPHY / COMPOSITION QA
↓
ARCHIVE SOL DESKTOP / MOBILE
↓
FINAL_VISUAL
```

# 12. HARD FAIL

하나라도 있으면 FINAL 금지.

```text
wrong coordinate/intersection/tangent/radius
wrong parallel/perpendicular relation
wrong displayed equation
coordinate-coordinate overlap
critical label-label overlap
critical label-line overlap
clipping/overflow
missing glyph
broken graph branch
false asymptote
archive render failure
```

# 13. 기존 자산 현대화 정책

기존 자산은 전부 자동 교체하지 않는다.

```text
KEEP
POLISH
REBUILD
RASTER_KEEP
```

# 14. 코드 업그레이드 이후

코드 자체가 `GEOMETRY_VISUAL_ENGINE_CODE_READY`가 된 뒤에만
도형의 방정식 FULL PILOT으로 넘어간다.

그때:
```text
전체 inventory freeze
→ KEEP/POLISH/REBUILD/RASTER_KEEP
→ 새 engine 적용
→ 전수 math parity
→ 전수 label collision QA
→ archive desktop/mobile
→ 독립 전수검수
→ pinpoint repair
→ final seal
→ production promotion
```

새 GOLD 10회 반복은 하지 않는다.
