### 3-11. 중학교 통계·확률: 도수 그래프, 줄기와 잎, 상자그림, 산점도, 주사위 표, 수형도 (`stat-chart-figure-v1`)

문제 그림이 **자료를 보여 주는 그림**이고 풀이가 그 그림의 값을 읽거나 세는 문항에 쓴다. 좌표축 함수 그래프가 아니라 교과서 모양의 통계 그림이며, plan에는 **문제에 나온 자료만** 정확히 쓴다. 계급의 가운데 값, 다각형의 양 끝(도수 0인 계급), 상대도수, 사분위수, 잎의 정렬, 표에서 색칠할 칸, 경로 확률은 엔진이 계산하고 독립 관측기가 같은 plan에서 다시 계산해 최종 SVG와 대조한다. 판 전체 모양은 `{"capability":"stat-chart-figure-v1","chart":{"kind":...},"caption":...,"sourceConditions":...,"newVisualInformation":...}`다.

| kind | 쓰는 곳 | 필요한 자료 |
|---|---|---|
| `HISTOGRAM` | 도수분포 히스토그램(`polygon:true`이면 도수분포다각형을 겹쳐 그림) | `boundaries`, `series:[{frequencies}]` |
| `FREQUENCY_POLYGON` | 다각형만(상대도수 그래프, 두 집단 비교) | `boundaries`, `series` 1~2개(`name` 필수) |
| `STEM_LEAF` | 줄기와 잎 그림(두 집단이면 등 맞댄 그림) | `values` 또는 `groups` |
| `BOX_PLOT` | 상자그림 1~3개 | `values` 또는 `summary` |
| `SCATTER` | 산점도 | `points`, `xRange`, `yRange` |
| `DICE_TABLE` | 서로 다른 두 주사위의 6×6 표 | `highlight`(사건의 조건) |
| `TREE` | 확률 수형도, 경우를 나열하는 수형도 | `root.children` |

**히스토그램·다각형.** `boundaries`는 계급의 경계값 n+1개(문자열, 크기가 모두 같고 0 이상, 계급 12개 이하)이고 `frequencies`는 계급마다 정수 하나다. 상대도수 그래프는 도수를 주고 `"yKind":"RELATIVE"`로 쓰면 엔진이 총합으로 나누고, 상대도수가 문제에 직접 주어졌으면 `relativeFrequencies:["0.1","0.15",...]`(합이 정확히 1)로 쓴다. 도수의 합을 문제가 말하면 `total`로 적어 두면 엔진이 합과 대조한다. 가로축은 계급의 경계값에 눈금이 찍히고(0에서 시작하지 않으면 물결 표시와 O가 붙는다), 세로축 눈금은 엔진이 고른다. `xTitle`/`yTitle`은 짧은 한글(`"기록(회)"`, `"도수(명)"`, `"상대도수"`, 14자 이내)이다. `grid:true`는 점선 격자, `showValues:true`는 값을 막대·꼭짓점 위에 쓴다(풀이가 값을 읽는 그림에서만 쓴다; 값이 다각형 선·점에 닿으면 엔진이 그 값만 가까운 빈자리로 옮기고, 피할 자리가 없으면 `STAT_VALUE_LABEL_NO_ROOM`). `highlightClasses:[4]`는 계급(0부터)을 진하게 칠한다. 두 집단은 `FREQUENCY_POLYGON`에 `series:[{name:"A",...},{name:"B",...}]`를 쓰고 B는 점선으로 그려지며 범례가 붙는다(히스토그램은 한 집단만).

**풀이 그림의 표시(모두 선택).** 문제에 안 보이는 계급이나 풀이가 짚는 계급·점을 그림에 표시한다. 엔진이 자료로 검산하고 관측기가 최종 SVG에서 다시 확인하며, 묻는 값은 그림에 쓰지 않는다.
- **미상 계급**: 문제가 지우거나 찢어서 안 보이는 계급의 도수는 `frequencies`에서 `null`로 쓴다(`[1,5,8,null,null,5,2]`; 상대도수도 같다). 그 계급은 막대도 꼭짓점도 그리지 않고 다각형은 거기서 끊긴다. 지워진 계급의 합을 검산하려면 `total`(보이는 도수의 합 이상)을 쓴다. 도수에서 상대도수를 만들 때(`RELATIVE`)는 `total`이 꼭 필요하다(`STAT_UNKNOWN_NEEDS_TOTAL`).
- **복원 막대**: `restoredClasses:[2]`(막대 히스토그램만, `total` 필수)는 총합에서 복원한 막대를 점선 테두리로 그리고, 묻는 값이므로 그 값은 쓰지 않는다(`showRestoredValues:true`면 쓴다). `showValues`가 켜진 그림에서 특정 막대의 값만 빼려면 `hideValues:[1]`.
- **강조의 두 가지 진하기**: `highlightClasses`의 항목은 계급 번호, `{"class":3,"tone":2}`, 또는 한 묶음 `{"classes":[0,1,2],"tone":1}`이다(`tone` 1은 회색, 2는 더 진한 회색; 생략하면 1). 막대 히스토그램은 막대를 칠하고, 다각형만 있는 그림(`FREQUENCY_POLYGON`)은 그 계급에서 모든 집단의 꼭짓점에 표시한다. 미상 계급은 강조할 수 없다(`STAT_HIGHLIGHT_UNKNOWN_CLASS`).
- **다각형 점 강조**: `highlightPoints:[{"series":0,"class":4,"tone":1,"showValue":true}]`(`series`를 생략하면 0). tone 1은 점을 동그라미로, tone 2는 큰 점으로 표시하고 `showValue:true`는 그 점의 값을 옆에 쓴다(두 집단 그림에서도 된다; `showValues:true`와 함께 쓰면 거절). 다각형이 없는 막대 히스토그램에는 쓸 수 없다(`STAT_HIGHLIGHT_POINT_INVALID`).
- **계급 묶음의 합**: `classSums:[{"series":0,"from":0,"to":2,"label":"13","unit":"명"}]`은 가로축 눈금 아래에 계급 `from`~`to`를 묶는 괄호를 치고 합을 쓴다(둘째 집단의 괄호는 점선). `label`은 엔진이 센 정확한 합과 같아야 하고(`0.30`처럼 쓴 그대로 보인다) 생략하면 괄호만 그린다. 미상 계급이 들어 있으면 `"?"`만 쓸 수 있고, 숫자 label은 그 미상 계급이 모두 한 괄호에 들어 있고 `total`이 있어야 검산된다(`STAT_CLASS_SUM_UNKNOWN`). 풀이가 묻는 값이면 label을 쓰지 않거나 `"?"`로 둔다. 같은 집단의 괄호는 계급이 겹칠 수 없다.

**줄기와 잎.** 원자료 값을 그대로 `values`에 쓴다(0~999, 줄기는 십의 자리, 잎은 일의 자리). 엔진이 오름차순으로 정렬하고 빈 줄기도 남기며 잎의 수를 센다. `unitText:"건"`, `title`을 쓰면 "1 | 4는 14건" 같은 설명이 붙는다(조사 은/는은 잎 숫자를 읽는 소리에 맞춰 엔진이 붙인다: 0 영·1 일·3 삼·6 육·7 칠·8 팔은 "은", 2 이·4 사·5 오·9 구는 "는"). `marks`로 잎을 동그라미로 강조한다: `{"median":true}`는 중앙값(짝수 개이면 가운데 두 값), `{"ranks":[4]}`(또는 한 개면 `{"rank":4}`)는 작은 쪽에서 4번째 값, 두 집단이면 `group`(0 또는 1)을 함께 쓴다. 동그라미는 한 그림에 16개까지, `ranks` 한 항목에 여러 순위를 쓸 수 있다. `rankLabels:"FROM_LARGEST"`(또는 `"FROM_SMALLEST"`)를 쓰면 동그라미 친 잎마다 큰(작은) 쪽부터 센 순번을 동그라미 위에 쓴다(`marks`가 있어야 한다; `STAT_STEM_RANK_LABELS_INVALID`). 큰 쪽에서 10번째까지 묶는 문항이면 `ranks`에 n-9~n번을 쓰고 `FROM_LARGEST`로 1~10을 단다.

**문자 잎과 순위 강조.** 문제가 잎을 값이 아니라 문자(`a`, `b`)로 주면 `values`에 `{"symbol":"a","stem":1,"order":3}`을 넣는다(`symbol`은 소문자 한 글자, `stem`은 줄기, `order`는 **그 줄기의 잎을 작은 순으로 늘어놓았을 때의 자리**(1부터), 숫자 잎이 `10,14,18`이고 `a`, `b`가 4와 8 사이면 `order` 3, 4). 엔진은 문자의 값을 짐작하거나 정하지 않고, 문제 그림의 순서 그대로 자리만 놓는다. 자리가 줄의 잎 수를 넘거나 겹치면 거절한다. 문자 잎도 순위에 세므로 `marks:[{"rank":10},{"rank":11}]`로 "작은 쪽 10번째·11번째 잎"(문자여도)을 동그라미로 강조할 수 있고, 관측기가 그림의 잎 순서를 직접 세어 그 잎에 동그라미가 붙었는지 확인한다. 문자 잎이 가운데에 끼면 중앙값은 숫자가 되지 못하므로 plan에도 값을 쓰지 않는다. `key`는 숫자 잎에서 골라 쓴다.

**계급 묶음.** `classGroups:[{"from":"5","to":"10","label":"3"}]`는 한 줄기 안의 값 구간 [from, to)에 드는 잎들을 아래쪽 괄호로 묶고 도수를 아래에 쓴다(`group`은 두 집단일 때). 구간은 한 줄기 줄 안에 있어야 한다(예: 5~10, 20~25, 10~20; 두 줄에 걸치면 거절). 도수는 엔진이 세며 `label`은 쓰지 않아도 되고, 쓰면 센 값과 같아야 한다(다르면 거절). 묶음이 있으면 줄 간격이 넓어진다. 문자 잎이 구간 안인지 밖인지 양옆 숫자 잎으로 정해지지 않으면(예: 4와 8 사이의 `a`를 5~10 계급에 세는 경우) 거절하니, 그런 줄은 묶지 말고 도수는 풀이 글에 쓴다.

**상자그림.** `values`(4개 이상)를 주면 교육과정 정의대로 중앙값, Q1(아래 절반의 중앙값), Q3(위 절반의 중앙값, 자료가 홀수 개이면 가운데 값은 양쪽에서 뺀다)을 엔진이 계산한다. 문제가 다섯 수치를 직접 주면 `summary:{min,q1,median,q3,max}`로 쓴다(작은 순서가 아니면 거절). `showValues:true`는 다섯 수를 상자 위에 쓴다(가까우면 `STAT_LABELS_TOO_CLOSE`).

**산점도.** `points`에는 그림에 찍힌 점을 **모두** 쓴다(이름 `name`은 문제가 이름 붙인 점만, 한 글자 대문자). `xRange`/`yRange`는 눈금 범위이며 양 끝이 `xStep`/`yStep`의 배수여야 하고 모든 점이 그 안에 있어야 한다. 범위가 0에서 시작하지 않으면 축에 물결 표시가 붙는다. `diagonal:true`는 y=x 직선을 점선으로 그려 "두 성적이 같은 학생"을 세게 한다. `labelEvery:2`는 눈금 숫자를 한 칸 걸러 쓴다. 이름 라벨이 격자선과 겹치는 곳은 격자선이 끊겨 그려진다.

**주사위 표.** `highlight`는 사건을 조건으로 쓴다. 가로(첫째 주사위)는 `a`, 세로(둘째 주사위)는 `b`다. `{"expr":"a+b","in":[2,7]}`, `{"expr":"a","cmp":"<=","value":2}`, `{"all":[...]}`, `{"any":[...]}`, `{"not":{...}}`로 쓰며 `expr`에는 정수, `a`, `b`, `+ - *`, 괄호만 쓴다(예: `b-2*a`). 엔진이 36칸 모두에 조건을 계산해 해당하는 칸만 칠하고 개수를 관측기가 다시 센다. 칸 안의 글자는 `cell`(`PAIR` (a,b), `SUM`, `PRODUCT`, `NONE`), `faces`(2~8, 기본 6), `colVar`/`rowVar`(기본 a, b)로 바꾼다.

**수형도.** `root:{"children":[{"label":"흰","p":"3/7","children":[{"label":"흰","p":"2/5"},{"label":"검","p":"3/5"}]},{"label":"검","p":"4/7","children":[...]}]}`. 한 마디의 가지는 2~5개, 깊이 3 이하, 끝 가지 12개 이하, 이름은 6자 이내다. 확률 `p`는 정확한 분수로 **모든 가지에 쓰거나 하나도 쓰지 않는다**(경우만 나열하는 수형도). 형제 가지의 확률 합은 정확히 1이어야 한다. `showPathProbability:true`는 각 끝에 `3/7×2/5=6/35`처럼 경로 확률의 곱을 쓴다. 확률은 세로 분수로만 쓰인다.

**오류와 한계.** 거절 코드: `STAT_CLASS_WIDTH_UNEQUAL`(계급 크기가 다름), `STAT_FREQUENCY_COUNT_MISMATCH`(도수 개수가 계급 수와 다름), `STAT_FREQUENCY_TOTAL_MISMATCH`(말한 총합이 합과 다름), `STAT_RELATIVE_SUM_NOT_ONE`, `STAT_UNKNOWN_NEEDS_TOTAL`(`null` 도수에서 상대도수를 만드는데 `total`이 없음), `STAT_HIGHLIGHT_INVALID`/`STAT_HIGHLIGHT_UNKNOWN_CLASS`/`STAT_HIGHLIGHT_POINT_INVALID`(강조의 모양·겹침·미상 계급·다각형 없음), `STAT_RESTORED_INVALID`/`STAT_RESTORED_UNSUPPORTED`(다각형이 겹친 그림이거나 막대 히스토그램이 아님)/`STAT_RESTORED_NEEDS_TOTAL`, `STAT_HIDE_VALUES_INVALID`, `STAT_CLASS_SUM_INVALID`/`STAT_CLASS_SUM_OVERLAP`/`STAT_CLASS_SUM_UNIT_INVALID`/`STAT_CLASS_SUM_LABEL_INVALID`/`STAT_CLASS_SUM_LABEL_MISMATCH`(label이 센 합과 다름)/`STAT_CLASS_SUM_UNKNOWN`(미상 계급의 합을 알 수 없음), `STAT_VALUE_LABEL_NO_ROOM`(값 라벨이 피할 자리가 없음), `STAT_STEM_MARK_INVALID`(순위가 범위 밖·겹침·`rank`/`ranks`/`median` 중 하나가 아님·동그라미 16개 초과), `STAT_STEM_SYMBOL_INVALID`(문자 잎의 모양이 틀림: 소문자 한 글자, `stem`, `order` 필요), `STAT_STEM_SYMBOL_DUPLICATE`(같은 문자를 두 번 씀), `STAT_STEM_SYMBOL_ORDER_CONFLICT`(문자 잎의 `order`가 줄의 잎 수를 넘거나 같은 자리를 두 번 씀), `STAT_STEM_CLASS_INVALID`/`STAT_STEM_CLASS_UNSUPPORTED`(구간이 두 줄 이상에 걸침)/`STAT_STEM_CLASS_EMPTY`(구간에 잎이 없음)/`STAT_STEM_CLASS_UNDETERMINED`(문자 잎이 구간 안인지 정해지지 않음)/`STAT_STEM_CLASS_OVERLAP`/`STAT_STEM_CLASS_COUNT_MISMATCH`(`label`이 센 도수와 다름), `STAT_BOX_NEEDS_FOUR_VALUES`, `STAT_BOX_SUMMARY_NOT_ORDERED`, `STAT_POINT_OUTSIDE_RANGE`, `STAT_RANGE_NOT_ON_STEP`, `STAT_DICE_EXPR_INVALID`(a, b 말고 다른 문자), `STAT_DICE_PREDICATE_INVALID`, `STAT_TREE_BRANCH_PROBABILITY_SUM`, `STAT_TREE_PROBABILITY_MIXED`. 그릴 자리가 없으면 `STAT_LABEL_OUT_OF_BOUNDS`/`STAT_LABELS_TOO_CLOSE`/`STAT_CHART_RENDERED_LAYOUT_FAIL`이니 제목을 줄이거나 계급을 줄이거나 `showValues`를 끈다. 원그래프, 범주형 막대그래프, 누적도수 그래프, 계급 크기가 다른 히스토그램은 지원하지 않으니 EXEMPT나 UNSUPPORTED를 쓴다(지워진 계급은 `null`로 쓴다). 이 그림은 문제에 이미 있는 그림을 다시 그리는 것이므로, 풀이에서 쓰는 값만 강조하고 정답을 그림에 쓰지 않는다.


### 3-43. 두 집단 비교 통계 다각형: 도수·상대도수를 두 개의 꺾은선으로 (`FREQUENCY_POLYGON` 두 series)

두 집단(남학생·여학생, A반·B반, 두 학교)의 **같은 계급** 자료를 한 그림에서 비교할 때 쓴다. 3-11절의 `stat-chart-figure-v1`에서 `kind`를 `FREQUENCY_POLYGON`으로 두고 `series`를 두 개 쓰는 형태이며, 히스토그램 막대 없이 꺾은선 두 개와 범례만 그린다. 자료값은 문제에 나온 그대로 쓰고, 비교해서 계산한 정답(차이·비율)은 그림에 쓰지 않는다.

```json
{"capability":"stat-chart-figure-v1",
 "chart":{"kind":"FREQUENCY_POLYGON","yKind":"RELATIVE",
  "boundaries":["30","40","50","60","70","80","90"],
  "series":[{"name":"남학생","relativeFrequencies":["0.10","0.25","0.30","0.20","0.10","0.05"]},
            {"name":"여학생","relativeFrequencies":["0.05","0.10","0.15","0.25","0.35","0.10"]}],
  "xTitle":"시간(분)","yTitle":"상대도수","grid":true},
 "caption":"남학생 300명과 여학생 200명의 상대도수 분포를 두 개의 꺾은선으로 함께 나타낸 그림",
 "sourceConditions":[{"id":"c1","condition":"...","mappedTo":"chart.boundaries"}],
 "newVisualInformation":["..."]}
```

- 이 capability의 plan은 `capability`, `chart`, `caption`, `sourceConditions`, `newVisualInformation` **다섯 키만** 받는다. 다른 키(`sourceQuote` 등)를 넣으면 `STAT_CHART_PLAN_INVALID`이므로 넣지 않는다.
- `series`는 1~2개다. 두 집단이면 각 series에 `name`이 **반드시** 있어야 하고(14자 이내, 서로 달라야 함, `STAT_SERIES_NAME_REQUIRED`·`STAT_SERIES_INVALID`), 첫 series는 실선·둘째는 점선으로 그려지고 위쪽에 범례가 붙는다. 범례 자리가 좁으면 이름을 짧게(`"한별네"`) 쓰고 두 집단의 정식 이름은 `caption`에 쓴다.
- **도수 비교**는 계급마다 정수 `frequencies`를 쓴다. `total`은 한 series일 때만 받으므로(`STAT_SERIES_INVALID`) 두 집단의 합계 대조는 그림이 아니라 plan의 `sourceConditions`에 적는다. 히스토그램(`HISTOGRAM`)은 한 집단만 되고(`STAT_HISTOGRAM_ONE_SERIES`), 두 집단은 반드시 `FREQUENCY_POLYGON`이다.
- **상대도수 비교**는 계급마다 정확한 문자열 `relativeFrequencies`를 쓰고 **각 series의 합이 정확히 1**이어야 한다(아니면 `STAT_RELATIVE_SUM_NOT_ONE`). `yKind`를 생략하면 상대도수가 든 series가 있을 때 `RELATIVE`로 본다. 한 그림에서 `frequencies`와 `relativeFrequencies`를 섞으면 `STAT_SERIES_INVALID`이며, 주어진 도수를 총합으로 나누는 방식은 한 series에서만 쓴다.
- **누적도수**는 별도 그래프이고 이 capability는 누적도수 그래프를 지원하지 않는다. 누적도수 자료를 도수분포다각형으로 바꿔 그리지 말고 EXEMPT나 UNSUPPORTED로 마무리한다.
- 계급 경계값 n+1개는 크기가 같고 0 이상이며 12계급 이하다. 도수분포다각형의 양 끝 도수 0인 계급은 엔진이 자동으로 붙이므로 plan에 쓰지 않는다. 가로축 눈금은 두 번째 경계값부터 쓰이므로 첫 경계값은 축 시작으로만 보인다.
- 두 series에서는 `showValues`를 쓸 수 없다(`STAT_VALUES_NEED_ONE_SERIES`). 값을 쓸 점은 `highlightPoints:[{"series":1,"class":3,"showValue":true}]`로 그 점만 표시하고 값을 쓴다(선·다른 점에 닿으면 엔진이 라벨을 비켜 놓는다). 나머지 값은 caption이나 풀이 글에서 설명한다.
- 풀이가 두 집단의 같은 계급(예: 80점 이상)을 짚으면 `highlightClasses:[3,4]`가 두 집단의 그 계급 점을 모두 동그라미로 표시하고, `classSums:[{"series":1,"from":3,"to":4,"label":"6","unit":"명"}]`이 한 집단의 합을 괄호로 묶는다(둘째 집단의 괄호는 점선). 합이 풀이가 묻는 답이면 label을 쓰지 않는다. 한 집단의 점만 강조하려면 `highlightPoints`를 쓴다(tone 1 동그라미, tone 2 큰 점).
- 라벨이 겹치거나 자리가 모자라면 `STAT_CHART_RENDERED_LAYOUT_FAIL`/`STAT_LABEL_OUT_OF_BOUNDS`/`STAT_LABELS_TOO_CLOSE`이니 제목을 줄이거나 계급 수를 줄인다. 계급 크기가 다르면 `STAT_CLASS_WIDTH_UNEQUAL`, 도수 개수가 계급 수와 다르면 `STAT_FREQUENCY_COUNT_MISMATCH`이다.
- 독립 관측기가 같은 plan에서 두 series의 모든 꼭짓점·양 끝 0점·눈금·범례 이름을 다시 계산해 최종 SVG와 대조한다. 문제 그림의 점 위치와 다른 계급 귀속이 보이면 자료값을 먼저 확인하고, 원본 풀이 글과 그림이 어긋나는 경우는 그림을 원본 그림 쪽에 맞춘 뒤 그 불일치를 handoff에 적는다.
