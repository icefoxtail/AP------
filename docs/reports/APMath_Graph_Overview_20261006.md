# 그래프 개형 범위 보강 — 2026-10-06

사용자 첨부 3개 화면은 버전 authority로 단정하지 않고 시각 문제 사례로 사용했다.
첫 지수함수의 작은/debug 문구, 두 번째 이차함수의 좁은 graph 영역,
세 번째 circle/line의 전체 framing과 annotation을 구분했다. 이번 수정은 현재
지원하는 quadratic publication의 overview gate에 한정하며 exp나 복합 기하 capability를
새로 활성화하지 않는다.

## 실제 코드

- Planner가 원문 sourceDomain과 필요한 점을 선언하고 source-only inventory/compare로
  검토한다. 명시적 ALL_REALS에서만 drawing interval 확대를 허용한다.
- 별도 producer frame adapter가 꼭짓점/개구 방향/계수 scale을 바탕으로 display window를
  조정한다. 원 함수와 원문 domain은 바꾸지 않는다. 원문 제한 또는 지나치게 좁은
  unreviewed interval은 보류한다.
- Independent graph observer는 producer framing helper를 import하지 않고 source 식과
  final SVG polyline에서 vertex/양쪽 arm의 실제 크기/필수 점 보존을 계산한다.
- vertex 5% 내부 여백, 각 arm ≥40px 및 plot width 22%, rise ≥50px 및 plot height 45%.
  실제 Archive 표시 scale에서도 재계산한다. Math curve PASS와 GRAPH_OVERVIEW PASS는 별도다.
- narrow crop, one-sided curve, excessive zoom-out/flat appearance, omitted source point,
  too-small actual display를 negative로 추가했다. x²/−x², 이동, 큰/작은 계수도 검사한다.

## 검증

- Python **137/137 PASS**, Node/provider **101/101 PASS**.
- 새 `test_graph_overview.py` 7건 PASS. 기존 수학 검사가 PASS하는 좁은 crop을
  overview gate가 FAIL하는 것을 재현했다.
- 연향중 q10 actual Archive + 독립 visual review 재실행은
  **EXPERIMENTAL_LOCATOR_COMPLETE** (canonical authority 완료 아님).
- 실제 plot size 약 248×199 CSS px, 양쪽 arm 각각 수평 115.84px / 수직 175.83px,
  vertex (0,−1), overview PASS.
- result:
  `archive/_generated/geometry-visual-engine/production/stages/RESULT/87cd55cc0f8bf93b03116c3ccbbd66da021071464c16fdd0bbc95d1cd873b729/result.json`

전체 qualification, 다른 함수군 overview, context+zoom inset, medium/current 정책 전수,
remote CI 및 main merge는 수행/선언하지 않는다. Production exam JS/SVG 수정은 없다.
