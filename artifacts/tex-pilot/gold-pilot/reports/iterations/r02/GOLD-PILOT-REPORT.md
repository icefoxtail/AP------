# GOLD PILOT iteration r02

기준 branch: `codex/tex-tikz-gold-pilot`
기준 iteration: `reports/iterations/r01/`
대상 inventory: 동일 10문항 (STANDARD 9, SPECIAL 1)

## 변경 사항

- Geometry model v2 최소판: `a*x+b*y+c=0`, line intersection, parallel/perpendicular, tangent slope, source/derived witness를 Python에서 계산한다.
- 01의 `PERPENDICULAR_MARK`는 두 line ref와 dot-product 검증을 요구한다.
- 06의 잘못된 perpendicular mark를 제거하고 `TANGENT` component와 수치 접선 검증으로 교체했다.
- 10 SPECIAL은 `AB`, `PQ`, `R`를 `validate_special.py`가 계산하고 handcrafted TeX의 witness marker와 대조한다. 계산 결과는 `R=(1.8,0.8)`이다.
- geometry 계열은 equal-unit aspect, function/calculus 계열은 readability aspect를 사용한다. graph SVG 폭을 mobile-safe 상한으로 제한했다.
- `LINE.equation`은 metadata로만 사용하고 실제 표시는 explicit `EQUATION_LABEL` component만 담당한다.
- math label은 `\sqrt`, `\Delta`, `\le`, `\ge`, `\to`, superscript grammar를 사용하며 XeLaTeX `fontspec`은 `Malgun Gothic`을 고정한다.
- condition box는 multiline/math-aware lines, padding, width bound를 사용한다.
- 구조 gate 명칭은 `SVG_STRUCTURAL_VALIDITY`, 후보 polish gate는 `VISUAL_POLISH_GATE`로 분리했다.

## Evidence

| 단계 | 결과 |
|---|---:|
| semantic validation | 10/10 PASS |
| SVG structural validity | 10/10 PASS |
| standalone desktop | 10/10 PASS |
| standalone mobile | 10/10 PASS |
| human visual review | 7 PASS / 3 POLISH_REQUIRED / 0 REBUILD |
| archive engine render | NOT_RUN (후기 iteration에서 추가) |

`render_qa.cjs`의 새 candidate 기준 결과는 `RENDER_QA_PASS 20/20`이다. old fixed-width baseline의 mobile overflow는 비교 evidence로 남겼고, new candidate는 10/10 mobile overflow를 제거했다.

## Comparison aggregate

`comparison.json`에 15개 비교 축과 근거를 남겼고, `defects.json`에 P0/P1 closed 및 remaining 목록을 분리했다.

```text
NEW_WINS = 5
TIE      = 5
OLD_WINS = 0
```

남은 visual defect는 01, 06, 08의 라벨 밀도/placement WARN이다. 이는 semantic 또는 render FAIL이 아니라 다음 iteration의 `POLISH_REQUIRED` 항목이다. SVG byte 최적화는 아직 수행하지 않았다.

## Decision

```text
CONTINUE_GOLD
```

종료 조건의 `NEW_WINS >= 7`, `POLISH_REQUIRED=0`, `FINAL_VISUAL candidate 10/10`, archive engine render closure를 아직 충족하지 않았다.
