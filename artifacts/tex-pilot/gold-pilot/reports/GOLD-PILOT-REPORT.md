# AP Math TeX/TikZ SVG GOLD PILOT report

검증일: 2026-09-10. 이 파일럿은 `artifacts/tex-pilot/gold-pilot/` 아래의 후보 산출물만 만들었다. 기존 production SVG/JS와 기존 Python SVG 파이프라인은 수정·삭제·교체하지 않았다.

## Rule preflight

`node tools/skills/verify-skills.mjs`는 PASS였고 작업 브랜치는 `main`이며 `origin/main`과 동일하다. 이번 작업에 기록한 현재 rule pack은 다음과 같다.

| 규칙 | bytes | SHA-256 |
|---|---:|---|
| `docs/rules/01_CANONICAL/JS아카이브룰북_v2.6.md` | 93734 | `15bac5c693b4bac5a5d1794ec07f641b188bb125d4321c08e0524ebbce5b0514` |
| `docs/rules/02_PIPELINES/COMMON_PROTOCOL_v1.2.10.md` | 200952 | `69982524a063f5c49d252473eaf74eedd4d9a078e64fcc85a6144d838d056dac` |
| `docs/rules/02_PIPELINES/공통파이프라인_실행계약_v1.md` | 7347 | `971625ca5fd8228d01969521d8c2c4933b57e5088d6548d747101deeea6523c2` |
| `docs/rules/02_PIPELINES/작업방식_적응형배치루프_v1.md` | 9468 | `ce4166be64d437a98eebcacbb728e6625dd4ba6472f0d6d20295767265c71685` |
| `docs/rules/04_VISUAL/도형추출.md` v3.0 | 54520 | `292c193bdfe4544fe5cf2ebca779aaa0894374d452da9dd35b91fb8f85182fb6` |
| `docs/rules/04_VISUAL/도형의방정식_해설_SVG_독립검수_운영규정_v1.1.md` | 91353 | `b0c8b214d1052750d0ff60e3c83c179b02b3a4fe3f24ed72763f41292e0368c4` |
| `archive/tools/pipeline-core/README.md` | 17199 | `12779744b93601310c1ee4b89c4767e904a958047eca6b28e746da6e3102c180` |
| `archive/tools/pipeline-core/AGENT_BUDGET.md` | 14593 | `d42346f0cd7ad6a395b6df2d15c386539ac9a69394329c5d9de6bf333a889b02` |

적용 가능한 별도 `UNIT_OVERLAY`는 이 좌표·함수·미적분 시각자료 묶음에서 확인되지 않아 common rule과 VISUAL v3.0, geometry v1.1만 적용했다.

## Inventory and coverage

10/10 문항을 선정했고 모두 기존 SVG가 있어 직접 비교했다. 선정 근거는 좌표·원·함수·미적분·복합 라벨 구조를 한 번씩 포함하면서, 기존 자산의 실제 source facts가 명시된 문항을 우선한 것이다.

| ID | lane/type | source facts summary | old SVG |
|---|---|---|---|
| 01 | STANDARD / coordinate | `x+3y+2=0`, `6x−2y−1=0`, 기울기 −1/3과 3의 수직 관계 | `archive/assets/images/25_효천고_2학기_중간_고1_기출/q02-solution.svg` |
| 02 | STANDARD / coordinate | `2x−y+1=0`, `2x−y−4=0`의 평행·거리 √5 | `archive/assets/images/25_효천고_2학기_중간_고1_기출/q07-solution.svg` |
| 03 | STANDARD / circle | 중심 `(-1,3)`, 반지름 2, 중심과 반지름 선분 | `archive/assets/images/25_효천고_2학기_중간_고1_기출/q03-solution.svg` |
| 04 | STANDARD / circle | `C(a,a)` 경계 원과 `x+y=3` 접선, `m≤a≤M` | `archive/assets/images/25_효천고_2학기_중간_고1_기출/q11-solution.svg` |
| 05 | STANDARD / function | `p(x)=x+1`, `q(x)=x²−3x+4`, 교점 x=1,3과 branch 전환 | `archive/assets/images/25_제일고_2학기_중간_고2_수학II/q17-solution.svg` |
| 06 | STANDARD / function | `g=f−x`의 x=1 중근 조건과 `f(2)=3` | `archive/assets/images/25_제일고_2학기_중간_고2_수학II/q18-solution.svg` |
| 07 | STANDARD / calculus | `h(t)=0,1,2,1,0` 변화와 경계 `t=0,2`, `q(t)=t(t−2)` | `archive/assets/images/25_제일고_2학기_중간_고2_수학II/q16-solution.svg` |
| 08 | STANDARD / calculus | `f′=3(x−1)²−3`의 최솟값 −3과 `y=−3x+3` | `archive/assets/images/25_제일고_2학기_중간_고2_수학II/q22-solution.svg` |
| 09 | STANDARD / explanation | `y=x³−4x`, A=(1,−3)의 접선 `y=−x−2`, 재교점 B=(−2,0) | `archive/assets/images/23_복성고_2학기_중간_고2_수학II/q13-solution.svg` |
| 10 | SPECIAL / explanation geometry | A=(3,0), B=(0,2), 움직이는 P,Q와 PQ·AB의 교점 R→(9/5,4/5) | `archive/assets/images/23_복성고_2학기_중간_고2_수학II/q19-solution.svg` |

## Minimal schema

`schema/gold-visual.schema.json`은 다섯 `visualType`만 허용한다.

```text
coordinate_geometry | line_circle_geometry | function_graph
calculus_graph      | explanation_card
```

최소 객체는 `viewport`, `axes`, `points`, `lines`, `segments`, `circles`,
`functionGraphs`, `labels`, `annotations`, `auxiliaryLines`, `emphasis`,
`conditionBox`이며, 표시 순서와 의미를 고정하기 위해 `components` 배열을 둔다.
semantic component enum은 `POINT`, `POINT_LABEL`, `LINE`, `SEGMENT`, `CIRCLE`,
`FUNCTION_GRAPH`, `AXIS`, `INTERSECTION`, `AUXILIARY_LINE`, `EQUATION_LABEL`,
`GRAPH_ANNOTATION`, `CONDITION_BOX`, `PERPENDICULAR_MARK`, `ANGLE_MARK`다.

## Generator and lanes

`generator/generate.py`는 입력 JSON을 정렬된 canonical JSON으로 해시하고, 유한수·ID·viewport를 검증한다. 함수식은 제한된 Python AST만 평가하며 Python에서 샘플 좌표를 계산한 뒤 TikZ/PGFPlots `coordinates`로 출력한다. 따라서 입력 JSON이 같으면 `.tex`와 witness가 같다.

표준 실행은 다음과 같다.

```text
JSON → generate.py → .tex → xelatex -no-pdf → .xdv → dvisvgm → .svg
```

`STANDARD`는 9개 JSON 입력과 deterministic generator를 사용한다. `SPECIAL`은
`samples/special/10_moving_segment_intersection.tex`에만 handcrafted TikZ를
두고, 같은 XeLaTeX·dvisvgm·브라우저 QA를 `build_special.ps1`로 통과시킨다.
특수 문항 때문에 공통 schema를 확장하지 않았다.

## Lifecycle and render evidence

| 단계 | 결과 |
|---|---:|
| GENERATED_DRAFT | 10/10 |
| POLISHED_CANDIDATE | 10/10 |
| RENDER_VERIFIED | 10/10 (desktop 10, mobile 10) |
| FINAL_VISUAL | 0/10 |

`generator/build_pilot.ps1`와 `build_special.ps1`에서 10개 모두 `xelatex_exit=0`,
`dvisvgm_exit=0`을 기록했다. `reports/render_qa.cjs`는 Playwright 1.60.0과
기존 Chromium revision 1223으로 old/new 각각 desktop 1440×1000과 mobile
390×844 PNG를 만들었고 `RENDER_QA_PASS 10/10`을 반환했다.

구조 polish gate도 `reports/polish-results.json`에서 `POLISH_STRUCTURAL_PASS 10/10`이다. 이는 viewBox·width/height·양수 영역·실제 SVG geometry 존재를 점검한다. label collision과 composition 판정은 별도 triage 표에 남겼다.

문항별 산출물은 `outputs/<id>/` 아래에 있다.

```text
<id>.tex
<id>.xdv
<id>.svg
<id>.witness.json                 (STANDARD)
<id>.xelatex.log / <id>.dvisvgm.log
```

렌더 캡처와 old/new 비교 캡처는 `reports/renders/<id>/` 아래의
`old-desktop.png`, `old-mobile.png`, `new-desktop.png`, `new-mobile.png`다.

## OLD vs NEW comparison

전체 항목의 기계·수동 비교 원본은 `reports/comparison.json`에 있다. 평가 항목은
`MATH_CORRECTNESS`, `FACT_PARITY`, `TYPOGRAPHY`, `LABEL_QUALITY`, `COMPOSITION`,
`VISUAL_HIERARCHY`, `WHITESPACE`, `GRAPH_GEOMETRY_QUALITY`, `CLIPPING`,
`COLLISION`, `DESKTOP_RENDER`, `MOBILE_RENDER`, `SVG_BYTES`, `EDITABILITY`,
`REPRODUCIBILITY`다.

| ID | old bytes | new bytes | desktop/mobile | triage | final |
|---|---:|---:|---|---|---|
| 01 | 3,762 | 38,110 | PASS / PASS | POLISH | TIE |
| 02 | 4,078 | 34,525 | PASS / PASS | POLISH | OLD_WINS |
| 03 | 2,148 | 29,490 | PASS / PASS | POLISH | TIE |
| 04 | 3,263 | 28,835 | PASS / PASS | KEEP | TIE |
| 05 | 7,536 | 38,693 | PASS / PASS | KEEP | TIE |
| 06 | 5,929 | 40,348 | PASS / PASS | POLISH | OLD_WINS |
| 07 | 4,051 | 20,345 | PASS / PASS | KEEP | NEW_WINS |
| 08 | 5,532 | 37,690 | PASS / PASS | POLISH | OLD_WINS |
| 09 | 6,095 | 26,941 | PASS / PASS | KEEP | TIE |
| 10 | 4,372 | 32,173 | PASS / PASS | POLISH | OLD_WINS |

New SVG가 모두 더 큰 이유는 dvisvgm이 TeX glyph/path와 PGF geometry를 자체 SVG path로 보존하기 때문이다. 현재 단계에서는 SVGO를 추가하지 않았다. `viewBox`와 clipping은 구조 gate를 통과했지만, 02의 조건 상자, 01·03·06·08의 라벨 밀도, 10 SPECIAL의 설명 상자는 추가 polish 대상이다.

기존 old SVG는 고정 폭이라 mobile 캡처에서 가로 overflow가 발생했고, new SVG는 viewport를 조정한 뒤 10/10 mobile overflow가 해소됐다. 두 lane 모두 browser screenshot은 생성·decode·렌더 PASS로 기록했다.

집계: `NEW_WINS=1`, `TIE=4`, `OLD_WINS=5`. Triage는 `KEEP=4`, `POLISH=6`, `REBUILD=0`이다.

## Final conclusion

**PILOT_NEEDS_REPAIR**

10/10 생성·컴파일·SVG 변환·desktop/mobile 캡처는 완료됐지만, 현재 결과는 후보 단계다. 일부 라벨/조건 상자의 밀도와 SVG byte 비용이 남아 있고, pipeline-core가 요구하는 provider-attested FINAL_AUDIT 및 독립 render-review closure를 이 로컬 파일럿에서 수행하지 않았으므로 production 후보 승격은 보류한다.
