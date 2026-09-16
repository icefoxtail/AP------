# GOLD PILOT iteration r08

동일 10문항을 generator 변경 없이 clean rebuild한 안정성 iteration이다. 기준은 $PreviousIteration이며 input/TEX/SVG witness SHA와 render 결과의 parity를 확인한다.

`	ext
semantic_fail: 0
fact_fail: 0
math_fail: 0
render_fail: 0
collision: 0
clipping: 0
missing_glyph: 0
KEEP: 10
POLISH: 0
REBUILD: 0
NEW_WINS: 8
TIE: 2
OLD_WINS: 0
IMPROVED: 0
UNCHANGED: 10
REGRESSED: 0
`

RENDER_QA_PASS 20/20, SVG_STRUCTURAL_VALIDITY 10/10, VISUAL_POLISH_GATE 10/10을 기록했다. archive engine container render는 아직 수행하지 않았다.

판정: CONTINUE_GOLD (r10 및 HOLDOUT 전에는 종료하지 않음).
