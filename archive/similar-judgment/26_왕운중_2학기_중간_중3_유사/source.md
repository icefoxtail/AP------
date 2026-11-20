

```
{"stem": "26_왕운중_2학기_중간_중3_유사", "sourceArchiveFile": "original/middle/m3/2mid/26_왕운중_2학기_중간_중3_기출.js", "examFolder": "2mid", "grade": "중3", "curriculum": "2015", "questionCount": 23, "totalScore": 100, "generatedAt": "2026-11-18"}
```

## Q01

- 형식: 객관식  
- 배점: 3

### 발문

오른쪽 그림과 같이 \$\\angle\\text{A} \= 90^\\circ\$인 직각삼각형 \$\\text{ABC}\$에서 \$\\overline{\\text{AB}} \= 12\$, \$\\overline{\\text{BC}} \= 13\$일 때, \$\\sin B\$의 값은? (3점)

### 선지

① \$\\frac{12}{13}\$ ② \$\\frac{5}{13}\$ ③ \$\\frac{5}{12}\$ ④ \$\\frac{12}{5}\$ ⑤ \$\\frac{13}{5}\$

### 정답

②

### 해설

\$\\angle\\text{A} \= 90^\\circ\$이므로 피타고라스 정리에 의해 \$\$\\overline{\\text{AC}} \= \\sqrt{13^2 \- 12^2} \= \\sqrt{169 \- 144} \= \\sqrt{25} \= 5\$\$ 따라서 \$\\sin B \= \\frac{\\overline{\\text{AC}}}{\\overline{\\text{BC}}} \= \\frac{5}{13}\$이다. 정답은 ②이다.

```
{"capability": "SOURCE_PLANE_FIGURE_v1", "triangle": {"vertices": ["A", "B", "C"], "angleA": 90, "AB": 12, "BC": 13}, "caption": "∠A=90°, AB=12, BC=13인 직각삼각형 ABC"}
```

```
{"sourceQid": "1", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO", "conceptClusterKey": "피타고라스 정리와 삼각비 sin B", "primaryMethod": "피타고라스 정리로 $\\overline{AC}=5$를 구한 뒤 $\\sin B = \\frac{5}{13}$을 구한다.", "decisiveStep": "직각삼각형에서 나머지 변 $\\overline{AC}=5$를 먼저 구해 빗변 $13$으로 나누는 단계", "rpm": {"majorUnit": "삼각비", "midUnit": "삼각비", "l3": "삼각비의 뜻", "l4": "sin·cos·tan"}, "ptTplCandidate": {"problemTypeKey": "PT_TRIG_RATIO", "templateKey": null, "why": "직각삼각형의 두 변으로 나머지 변을 구하고 $\\sin B$를 계산한다."}, "crossConceptKeys": ["CC_TRIG_RATIO_DEFINITIONS"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "피타고라스 정리 한 번과 사인 정의 한 번으로 바로 구해진다.", "level": "하", "item4slot": {"given": [{"term": "직각삼각형", "src": "stem", "quote": "직각삼각형 $\\text{ABC}$"}], "condition": [], "goal": [{"term": "삼각비", "src": "solution", "quote": "\\sin B = \\frac{\\overline{\\text{AC}}}{\\overline{\\text{BC}}} = \\frac{5}{13}"}], "method": [{"term": "직각삼각형", "src": "stem", "quote": "직각삼각형"}], "reasons": {"method": "피타고라스 정리로 $\\overline{AC}$를 구해 $\\sin B$를 계산한다."}}, "hold": ""}
```

## Q02

- 형식: 객관식  
- 배점: 3

### 발문

\$\\cos 30^\\circ \\times \\tan 60^\\circ \+ \\sin 30^\\circ\$를 계산하면? (3점)

### 선지

① \$1\$ ② \$\\frac{3}{2}\$ ③ \$\\sqrt{3}\$ ④ \$2\$ ⑤ \$\\frac{5}{2}\$

### 정답

④

### 해설

\$\\cos 30^\\circ \= \\frac{\\sqrt{3}}{2}\$, \$\\tan 60^\\circ \= \\sqrt{3}\$, \$\\sin 30^\\circ \= \\frac{1}{2}\$이므로 \$\$\\frac{\\sqrt{3}}{2} \\times \\sqrt{3} \+ \\frac{1}{2} \= \\frac{3}{2} \+ \\frac{1}{2} \= 2\$\$ 따라서 정답은 ④이다.

```
"NONE"
```

```
{"sourceQid": "2", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO", "conceptClusterKey": "특수각 삼각비 사칙연산", "primaryMethod": "$\\cos 30^\\circ=\\frac{\\sqrt{3}}{2}, \\tan 60^\\circ=\\sqrt{3}, \\sin 30^\\circ=\\frac{1}{2}$을 대입해 $2$를 계산한다.", "decisiveStep": "세 특수각의 삼각비 값을 정확히 대입해 곱셈 후 덧셈을 수행하는 단계", "rpm": {"majorUnit": "삼각비", "midUnit": "삼각비", "l3": "특수각의 삼각비", "l4": "특수각 계산"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "특수각 $30^\\circ, 60^\\circ$의 삼각비 값을 대입하여 식을 계산한다."}, "crossConceptKeys": ["CC_SPECIAL_ANGLES", "CC_TRIG_TABLE_LOOKUP"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "특수각 표의 값을 그대로 대입해 계산하면 된다.", "level": "하", "item4slot": {"given": [{"term": "삼각비", "src": "solution", "quote": "\\cos 30^\\circ = \\frac{\\sqrt{3}}{2}"}], "condition": [], "goal": [{"term": "합", "src": "solution", "quote": "\\frac{3}{2} + \\frac{1}{2} = 2"}], "method": [{"term": "대입", "src": "solution", "quote": "\\frac{\\sqrt{3}}{2} \\times \\sqrt{3} + \\frac{1}{2}"}], "reasons": {"method": "특수각의 삼각비 값을 대입하여 계산한다."}}, "hold": ""}
```

## Q03

- 형식: 객관식  
- 배점: 4

### 발문

다음 그림과 같이 반지름의 길이가 \$1\$인 사분원을 이용하여 보기에서 \$35^\\circ\$의 삼각비의 값으로 옳은 것만을 있는 대로 고르면? (4점) \[보기\] ㄱ. \$\\sin 35^\\circ \= 0.57\$ ㄴ. \$\\cos 35^\\circ \= 0.57\$ ㄷ. \$\\tan 35^\\circ \= 0.82\$

### 선지

① ㄱ ② ㄴ ③ ㄱ, ㄷ ④ ㄴ, ㄷ ⑤ ㄱ, ㄴ, ㄷ

### 정답

①

### 해설

반지름의 길이가 \$1\$인 사분원에서

- \$\\sin 35^\\circ \= 0.57\$ (ㄱ 참)  
- \$\\cos 35^\\circ \= 0.82\$ (ㄴ 거짓)  
- \$\\tan 35^\\circ \= 0.70\$ (ㄷ 거짓) 따라서 옳은 것은 ㄱ뿐이다. 정답은 ①이다.

```
{"capability": "SOURCE_PLANE_FIGURE_v1", "quarterCircle": {"radius": 1, "angle": 35, "sinVal": 0.57, "cosVal": 0.82, "tanVal": 0.7}, "caption": "반지름이 1인 사분원에서 35°에 대한 sin, cos, tan 선분 길이(0.57, 0.82, 0.70)"}
```

```
{"sourceQid": "3", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO", "conceptClusterKey": "단위 사분원에서 sin·cos·tan 읽기", "primaryMethod": "반지름 $1$인 사분원의 높이가 $\\sin 35^\\circ=0.57$, 밑변이 $\\cos 35^\\circ=0.82$, 접선이 $\\tan 35^\\circ=0.70$임을 읽는다.", "decisiveStep": "사분원에서 $\\sin, \\cos, \\tan$에 대응하는 세 선분의 길이를 정확히 구분하는 단계", "rpm": {"majorUnit": "삼각비", "midUnit": "삼각비", "l3": "삼각비의 뜻", "l4": "sin·cos·tan"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "반지름이 $1$인 사분원에서 특정 각의 $\\sin, \\cos, \\tan$ 값을 읽는다."}, "crossConceptKeys": ["CC_UNIT_QUARTER_CIRCLE", "CC_TRIG_RATIO_DEFINITIONS"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "사분원 그림에서 세 삼각비에 대응하는 선분을 각각 대조해 진위를 판별해야 한다.", "level": "중", "item4slot": {"given": [{"term": "사분원", "src": "stem", "quote": "반지름의 길이가 $1$인 사분원"}], "condition": [], "goal": [{"term": "삼각비", "src": "stem", "quote": "삼각비의 값"}], "method": [{"term": "사분원", "src": "solution", "quote": "사분원에서"}], "reasons": {"method": "사분원 그림에서 $\\sin, \\cos, \\tan$에 해당하는 선분 길이를 읽는다."}}, "hold": ""}
```

## Q04

- 형식: 객관식  
- 배점: 4

### 발문

오른쪽 그림과 같이 \$\\angle\\text{A} \= 90^\\circ\$, \$\\overline{\\text{AB}} \= 8\$, \$\\overline{\\text{AC}} \= 15\$인 직각삼각형 \$\\text{ABC}\$에서 \$\\overline{\\text{DE}} \\perp \\overline{\\text{BC}}\$이고 \$\\angle\\text{BDE} \= \\alpha\$라고 할 때, \$\\tan\\alpha\$의 값은? (4점)

### 선지

① \$\\frac{8}{17}\$ ② \$\\frac{15}{17}\$ ③ \$\\frac{8}{15}\$ ④ \$\\frac{15}{8}\$ ⑤ \$\\frac{7}{15}\$

### 정답

③

### 해설

\$\\triangle\\text{ABC}\$에서 \$\\angle\\text{A} \= 90^\\circ\$이므로 \$\\tan B \= \\frac{\\overline{\\text{AC}}}{\\overline{\\text{AB}}} \= \\frac{15}{8}\$이다. \$\\triangle\\text{BED}\$에서 \$\\angle\\text{BED} \= 90^\\circ\$이므로 \$\\alpha \= 90^\\circ \- B \= \\angle C\$이다. 따라서 \$\\tan\\alpha \= \\tan C \= \\frac{\\overline{\\text{AB}}}{\\overline{\\text{AC}}} \= \\frac{8}{15}\$이다. 정답은 ③이다.

```
{"capability": "SOURCE_PLANE_FIGURE_v1", "triangle": {"vertices": ["A", "B", "C"], "angleA": 90, "AB": 8, "AC": 15}, "perpendicular": {"from": "D_on_AB", "to": "E_on_BC", "angleBDE": "alpha"}, "caption": "∠A=90°, AB=8, AC=15인 △ABC에서 DE⊥BC, ∠BDE=α"}
```

```
{"sourceQid": "4", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO", "conceptClusterKey": "닮은 직각삼각형의 여각 삼각비", "primaryMethod": "$\\triangle\\text{BED} \\sim \\triangle\\text{BAC}$에서 $\\alpha = \\angle C$임을 이용해 $\\tan\\alpha = \\frac{8}{15}$를 구한다.", "decisiveStep": "$\\angle\\text{BED}=90^\\circ$이므로 $\\alpha = 90^\\circ - B = \\angle C$임을 찾아 큰 삼각형 변의 비를 쓰는 단계", "rpm": {"majorUnit": "삼각비", "midUnit": "삼각비", "l3": "삼각비의 뜻", "l4": "sin·cos·tan"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "큰 직각삼각형 내부의 작은 직각삼각형 각에 대한 삼각비를 닮음으로 구한다."}, "crossConceptKeys": ["CC_COMPLEMENTARY_ANGLE_TRIG", "CC_TRIANGLE_SIMILARITY"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "작은 삼각형의 변 길이가 주어지지 않아 큰 삼각형과의 각의 같음(닮음)을 찾아야 한다.", "level": "중", "item4slot": {"given": [{"term": "직각삼각형", "src": "stem", "quote": "직각삼각형 $\\text{ABC}$"}], "condition": [{"term": "삼각비", "src": "solution", "quote": "\\tan B"}], "goal": [{"term": "삼각비", "src": "solution", "quote": "\\tan\\alpha = \\tan C = \\frac{\\overline{\\text{AB}}}{\\overline{\\text{AC}}} = \\frac{8}{15}"}], "method": [{"term": "각", "src": "solution", "quote": "\\alpha = 90^\\circ - B = \\angle C"}], "reasons": {"method": "$\\alpha = \\angle C$임을 이용해 큰 직각삼각형에서 $\\tan C$를 구한다."}}, "hold": ""}
```

## Q05

- 형식: 객관식  
- 배점: 4

### 발문

\$45^\\circ \< \\angle\\text{A} \< 90^\\circ\$일 때, 다음 식을 간단히 한 것으로 옳은 것은? (4점) \$\$\\sqrt{(\\sin A \- 1)^2} \- \\sqrt{(1 \- \\tan A)^2}\$\$

### 선지

① \$\\sin A \+ \\tan A\$ ② \$\\tan A \- \\sin A\$ ③ \$\\sin A \- \\tan A\$ ④ \$\\sin A \+ \\tan A \- 2\$ ⑤ \$2 \- \\sin A \- \\tan A\$

### 정답

⑤

### 해설

\$45^\\circ \< A \< 90^\\circ\$일 때 \$0 \< \\sin A \< 1\$, \$\\tan A \> 1\$이므로 \$\\sin A \- 1 \< 0\$, \$1 \- \\tan A \< 0\$이다. \$\$\\sqrt{(\\sin A \- 1)^2} \= \-(\\sin A \- 1\) \= 1 \- \\sin A\$\$ \$\$\\sqrt{(1 \- \\tan A)^2} \= \-(1 \- \\tan A) \= \\tan A \- 1\$\$ 따라서 준식은 \$(1 \- \\sin A) \- (\\tan A \- 1\) \= 2 \- \\sin A \- \\tan A\$이다. 정답은 ⑤이다.

```
"NONE"
```

```
{"sourceQid": "5", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO", "conceptClusterKey": "삼각비 크기 범위와 제곱근 근호 풀기", "primaryMethod": "$45^\\circ<A<90^\\circ$에서 $\\sin A-1<0, 1-\\tan A<0$임을 이용해 근호를 풀어 $2-\\sin A-\\tan A$를 구한다.", "decisiveStep": "$\\tan A > 1$이므로 $1 - \\tan A < 0$임에 따라 부호를 반대로 꺼내는 단계", "rpm": {"majorUnit": "삼각비", "midUnit": "삼각비", "l3": "삼각비의 뜻", "l4": "삼각비의 관계"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "예각 범위에서 삼각비의 크기와 제곱근 성질을 결합해 식을 간단히 한다."}, "crossConceptKeys": ["CC_RADICAL_SQUARE_ABSOLUTE_VALUE", "CC_TRIG_RATIO_ORDER"], "conditionKeys": ["COND_RANGE"], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "각 범위에 따른 삼각비 부호 판정과 제곱근 절댓값 풀이를 결합해야 한다.", "level": "중", "item4slot": {"given": [{"term": "삼각비", "src": "solution", "quote": "\\sin A - 1 < 0"}], "condition": [], "goal": [{"term": "제곱근", "src": "solution", "quote": "\\sqrt{(\\sin A - 1)^2}"}], "method": [{"term": "부호", "src": "solution", "quote": "\\sin A - 1 < 0"}], "reasons": {"method": "$45^\\circ<A<90^\\circ$에서 $\\sin A<1, \\tan A>1$임을 이용해 근호를 푼다."}}, "hold": ""}
```

## Q06

- 형식: 객관식  
- 배점: 4

### 발문

보기의 삼각비의 값을 작은 것부터 차례로 나열한 것은? (4점) \[보기\] ㄱ. \$\\cos 55^\\circ\$　ㄴ. \$\\sin 90^\\circ\$　ㄷ. \$\\tan 35^\\circ\$　ㄹ. \$\\tan 55^\\circ\$

### 선지

① ㄱ, ㄷ, ㄴ, ㄹ ② ㄱ, ㄴ, ㄷ, ㄹ ③ ㄷ, ㄱ, ㄴ, ㄹ ④ ㄱ, ㄷ, ㄹ, ㄴ ⑤ ㄷ, ㄴ, ㄱ, ㄹ

### 정답

①

### 해설

\$\\cos 55^\\circ \= \\sin 35^\\circ\$이고, \$0^\\circ \< 35^\\circ \< 45^\\circ\$이므로 \$\\sin 35^\\circ \< \\tan 35^\\circ \< 1\$이다. 또한 \$\\sin 90^\\circ \= 1\$이고, \$55^\\circ \> 45^\\circ\$이므로 \$\\tan 55^\\circ \> 1\$이다. 따라서 작은 것부터 나열하면 ㄱ, ㄷ, ㄴ, ㄹ이다. 정답은 ①이다.

```
"NONE"
```

```
{"sourceQid": "6", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO", "conceptClusterKey": "삼각비 대소 비교와 순서 나열", "primaryMethod": "$\\cos 55^\\circ=\\sin 35^\\circ$로 바꾼 뒤 $45^\\circ$와 $1$을 기준으로 네 값의 크기를 비교한다.", "decisiveStep": "$\\cos 55^\\circ = \\sin 35^\\circ < \\tan 35^\\circ < 1 = \\sin 90^\\circ < \\tan 55^\\circ$ 순서를 세우는 단계", "rpm": {"majorUnit": "삼각비", "midUnit": "삼각비", "l3": "삼각비의 뜻", "l4": "삼각비의 관계"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "서로 다른 각과 종류의 삼각비 네 개를 작은 순서대로 나열한다."}, "crossConceptKeys": ["CC_TRIG_RATIO_ORDER", "CC_COMPLEMENTARY_ANGLE_TRIG"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "코사인을 사인으로 변환하고 $1$과의 크기 비교를 모두 적용해야 한다.", "level": "중", "item4slot": {"given": [{"term": "삼각비", "src": "stem", "quote": "보기의 삼각비"}], "condition": [], "goal": [{"term": "삼각비", "src": "stem", "quote": "삼각비의 값"}], "method": [{"term": "삼각비", "src": "solution", "quote": "\\sin 35^\\circ < \\tan 35^\\circ < 1"}], "reasons": {"method": "$\\cos 55^\\circ=\\sin 35^\\circ$와 기준값 $1$을 이용해 대소를 비교한다."}}, "hold": ""}
```

## Q07

- 형식: 객관식  
- 배점: 4

### 발문

오른쪽 그림과 같이 \$\\angle\\text{A} \= 90^\\circ\$인 직각삼각형 \$\\text{ABC}\$에서 점 \$\\text{G}\$는 삼각형 \$\\text{ABC}\$의 무게중심이고 점 \$\\text{D}\$는 빗변 \$\\text{BC}\$의 중점이다. \$\\overline{\\text{AC}} \= 12\\text{ cm}\$이고 \$\\overline{\\text{GD}} \= 5\\text{ cm}\$일 때, \$\\sin B\$의 값은? (4점)

### 선지

① \$\\frac{1}{3}\$ ② \$\\frac{5}{12}\$ ③ \$\\frac{2}{5}\$ ④ \$\\frac{3}{5}\$ ⑤ \$\\frac{4}{5}\$

### 정답

③

### 해설

무게중심 \$\\text{G}\$는 중선 \$\\text{AD}\$를 \$2 : 1\$로 나누므로 \$\\overline{\\text{AG}} \= 2\\overline{\\text{GD}} \= 10\\text{ cm}\$이고, \$\\overline{\\text{AD}} \= 10 \+ 5 \= 15\\text{ cm}\$이다. 점 \$\\text{D}\$는 직각삼각형 \$\\text{ABC}\$의 빗변의 중점(외심)이므로 \$\\overline{\\text{BD}} \= \\overline{\\text{CD}} \= \\overline{\\text{AD}} \= 15\\text{ cm}\$이다. 따라서 \$\\overline{\\text{BC}} \= 30\\text{ cm}\$이므로 \$\\sin B \= \\frac{\\overline{\\text{AC}}}{\\overline{\\text{BC}}} \= \\frac{12}{30} \= \\frac{2}{5}\$이다. 정답은 ③이다.

```
{"capability": "SOURCE_PLANE_FIGURE_v1", "triangle": {"vertices": ["A", "B", "C"], "angleA": 90, "AC": 12}, "median": {"from": "A", "to": "D_midpoint_BC", "centroid": "G", "GD": 5}, "caption": "∠A=90°, AC=12cm인 직각삼각형의 무게중심 G와 중선 AD (GD=5cm)"}
```

```
{"sourceQid": "7", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO_APPLICATION", "conceptClusterKey": "직각삼각형 무게중심·외심과 삼각비", "primaryMethod": "무게중심 비 $2:1$로 $\\overline{AD}=15$를 구하고 외심 성질로 $\\overline{BC}=30$을 얻어 $\\sin B=\\frac{2}{5}$를 구한다.", "decisiveStep": "직각삼각형 빗변의 중점 $\\text{D}$가 외심이어서 $\\overline{BC}=2\\overline{AD}=30$임을 연결하는 단계", "rpm": {"majorUnit": "삼각비", "midUnit": "삼각비의 활용", "l3": "복합도형", "l4": "보조선 활용"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "직각삼각형의 무게중심과 외심 성질을 결합해 빗변 길이를 구하고 삼각비를 계산한다."}, "crossConceptKeys": ["CC_TRIG_RATIO_DEFINITIONS"], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "무게중심의 $2:1$ 내분과 직각삼각형 외심 성질을 차례로 떠올려야 빗변 길이가 나온다.", "level": "상", "item4slot": {"given": [{"term": "직각삼각형", "src": "stem", "quote": "직각삼각형 $\\text{ABC}$"}, {"term": "무게중심", "src": "stem", "quote": "무게중심"}], "condition": [{"term": "중점", "src": "stem", "quote": "빗변 $\\text{BC}$의 중점"}], "goal": [{"term": "삼각비", "src": "solution", "quote": "\\sin B = \\frac{\\overline{\\text{AC}}}{\\overline{\\text{BC}}}"}], "method": [{"term": "외심", "src": "solution", "quote": "외심"}], "reasons": {"method": "무게중심 비로 중선 $\\overline{AD}$를 구하고 외심 성질로 $\\overline{BC}$를 구한다."}}, "hold": ""}
```

## Q08

- 형식: 객관식  
- 배점: 4

### 발문

반지름의 길이가 \$1\$인 사분원을 좌표평면 위에 나타낼 때, \$\\angle\\text{AOB} \= a^\\circ\$, \$\\angle\\text{OBC} \= b^\\circ\$에 대하여 다음 중에서 점 \$\\text{B}\$의 좌표를 나타내는 것은? (4점)

### 선지

① \$(\\sin a^\\circ, \\cos b^\\circ)\$ ② \$(\\sin b^\\circ, \\cos b^\\circ)\$ ③ \$(\\cos a^\\circ, \\tan a^\\circ)\$ ④ \$(\\cos b^\\circ, \\sin b^\\circ)\$ ⑤ \$(\\sin b^\\circ, \\cos a^\\circ)\$

### 정답

②

### 해설

점 \$\\text{B}\$에서 \$x\$축에 내린 수선의 발을 \$\\text{C}\$라 하면 \$\\overline{\\text{OB}} \= 1\$이므로 \$\\text{B}(\\cos a^\\circ, \\sin a^\\circ)\$이다. 직각삼각형 \$\\text{OBC}\$에서 \$a \+ b \= 90^\\circ\$이므로 \$\\cos a^\\circ \= \\sin b^\\circ\$, \$\\sin a^\\circ \= \\cos b^\\circ\$이다. 따라서 \$\\text{B}(\\sin b^\\circ, \\cos b^\\circ)\$이다. 정답은 ②이다.

```
{"capability": "SOURCE_COORDINATE_AXES_v1", "quarterCircle": {"radius": 1, "center": "O", "pointB": "on_arc", "footC": "on_x_axis", "angleAOB": "a", "angleOBC": "b"}, "caption": "좌표평면 위 반지름 1인 사분원의 호 위의 점 B와 ∠AOB=a°, ∠OBC=b°"}
```

```
{"sourceQid": "8", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO", "conceptClusterKey": "단위 사분원 위의 점 좌표와 여각 표현", "primaryMethod": "$\\text{B}(\\cos a^\\circ, \\sin a^\\circ)$를 여각 $a+b=90^\\circ$를 이용해 $(\\sin b^\\circ, \\cos b^\\circ)$로 바꾼다.", "decisiveStep": "$\\cos a^\\circ = \\sin(90^\\circ - a^\\circ) = \\sin b^\\circ$로 좌표를 변환하는 단계", "rpm": {"majorUnit": "삼각비", "midUnit": "삼각비", "l3": "삼각비의 뜻", "l4": "sin·cos·tan"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "단위 사분원 위 점의 좌표를 여각 $b^\\circ$의 삼각비로 나타낸다."}, "crossConceptKeys": ["CC_UNIT_QUARTER_CIRCLE", "CC_COMPLEMENTARY_ANGLE_TRIG"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "점 $\\text{B}$의 좌표를 각 $a^\\circ$로 쓴 뒤 여각 $b^\\circ$로 바꾸어야 한다.", "level": "중", "item4slot": {"given": [{"term": "사분원", "src": "stem", "quote": "반지름의 길이가 $1$인 사분원"}], "condition": [], "goal": [{"term": "좌표", "src": "stem", "quote": "점 $\\text{B}$의 좌표"}], "method": [{"term": "직각삼각형", "src": "solution", "quote": "직각삼각형 $\\text{OBC}$"}], "reasons": {"method": "$\\triangle OBC$에서 $\\text{B}$의 좌표를 구한 뒤 $a+b=90^\\circ$를 이용해 $b^\\circ$로 나타낸다."}}, "hold": ""}
```

## Q09

- 형식: 객관식  
- 배점: 4

### 발문

다음 그림과 같이 지름의 길이가 \$16\$인 원에 내접하는 정팔각형의 넓이를 구하면? (4점)

### 선지

① \$32\\sqrt{2}\$ ② \$64\\sqrt{2}\$ ③ \$96\\sqrt{2}\$ ④ \$112\\sqrt{2}\$ ⑤ \$128\\sqrt{2}\$

### 정답

⑤

### 해설

원의 반지름의 길이는 \$8\$이고, 정팔각형의 한 중심각의 크기는 \$\\frac{360^\\circ}{8} \= 45^\\circ\$이다. 따라서 정팔각형은 합동인 이등변삼각형 \$8\$개로 나누어지므로 넓이는 \$\$8 \\times \\left(\\frac{1}{2} \\times 8 \\times 8 \\times \\sin 45^\\circ\\right) \= 8 \\times 32 \\times \\frac{\\sqrt{2}}{2} \= 128\\sqrt{2}\$\$ 정답은 ⑤이다.

```
{"capability": "SOURCE_PLANE_FIGURE_v1", "circle": {"diameter": 16}, "inscribedPolygon": "regular_octagon", "caption": "지름이 16인 원에 내접하는 정팔각형"}
```

```
{"sourceQid": "9", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO_APPLICATION", "conceptClusterKey": "원에 내접하는 정팔각형의 넓이", "primaryMethod": "반지름 $8$, 중심각 $45^\\circ$인 이등변삼각형 $8$개의 넓이 합으로 $128\\sqrt{2}$를 구한다.", "decisiveStep": "지름 $16$에서 반지름 $8$을 구하고 중심각 $45^\\circ$에 삼각형 넓이 공식을 적용하는 단계", "rpm": {"majorUnit": "삼각비", "midUnit": "삼각비의 활용", "l3": "평면도형", "l4": "다각형의 길이·넓이"}, "ptTplCandidate": {"problemTypeKey": "PT_TRIG_RATIO_APPLICATION", "templateKey": null, "why": "원에 내접하는 정다각형을 $8$개의 합동인 삼각형으로 분할해 넓이를 구한다."}, "crossConceptKeys": ["CC_TRIANGLE_AREA_TRIG"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "지름을 반지름으로 바꾸고 중심각 $45^\\circ$ 삼각형 넓이를 $8$배 해야 한다.", "level": "중", "item4slot": {"given": [{"term": "원", "src": "stem", "quote": "지름의 길이가 $16$인 원"}], "condition": [], "goal": [{"term": "넓이", "src": "stem", "quote": "정팔각형의 넓이"}], "method": [{"term": "이등변삼각형", "src": "solution", "quote": "합동인 이등변삼각형 $8$개"}], "reasons": {"method": "반지름 $8$과 중심각 $45^\\circ$인 이등변삼각형 $8$개의 넓이를 구해 더한다."}}, "hold": ""}
```

## Q10

- 형식: 객관식  
- 배점: 4

### 발문

그림에서 두 점 \$\\text{A}, \\text{B}\$는 각각 직선 \$y \= mx \+ n\$과 \$x\$축, \$y\$축의 교점이고 \$\\overline{\\text{AB}} \\perp \\overline{\\text{OH}}\$, \$\\overline{\\text{OH}} \= 3\$이다. \$\\angle\\text{BAO} \= \\alpha\$라 하면 \$\\tan\\alpha \= \\frac{3}{4}\$일 때, 양수 \$m, n\$에 대하여 \$m \+ n\$의 값은? (단, \$\\text{O}\$는 원점이고, 직선은 제 \$2\$사분면을 지난다.) (4점)

### 선지

① \$\\frac{7}{2}\$ ② \$4\$ ③ \$\\frac{17}{4}\$ ④ \$\\frac{9}{2}\$ ⑤ \$5\$

### 정답

④

### 해설

\$\\overline{\\text{OA}} \= a,\\ \\overline{\\text{OB}} \= b\$라 하면 \$\\tan\\alpha \= \\frac{b}{a} \= \\frac{3}{4}\$이므로 \$a \= 4k,\\ b \= 3k\$ (\$k \> 0\$)라 둘 수 있다. 피타고라스 정리에 의해 \$\\overline{\\text{AB}} \= 5k\$이다. \$\\triangle\\text{OAB}\$의 넓이를 두 가지로 표현하면 \$\$\\frac{1}{2} \\cdot 4k \\cdot 3k \= \\frac{1}{2} \\cdot 5k \\cdot 3 \\implies 12k^2 \= 15k \\implies k \= \\frac{5}{4}\$\$ 따라서 \$\\overline{\\text{OA}} \= 5,\\ \\overline{\\text{OB}} \= \\frac{15}{4}\$이고, 직선은 \$(-5, 0)\$과 \$\\left(0, \\frac{15}{4}\\right)\$를 지나므로 기울기 \$m \= \\frac{3}{4}\$, \$y\$절편 \$n \= \\frac{15}{4}\$이다. 그러므로 \$m \+ n \= \\frac{3}{4} \+ \\frac{15}{4} \= \\frac{9}{2}\$이다. 정답은 ④이다.

```
{"capability": "SOURCE_COORDINATE_AXES_v1", "line": "0.75*x + 3.75", "points": {"O": [0, 0], "A": [-5, 0], "B": [0, 3.75], "H": [-1.8, 2.4]}, "segment": ["O", "H"], "caption": "직선 y=mx+n의 절편 A, B와 원점에서 내린 수선 OH=3, ∠BAO=α"}
```

```
{"sourceQid": "10", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO_APPLICATION", "conceptClusterKey": "직선 절편 직각삼각형 수선과 삼각비", "primaryMethod": "$\\tan\\alpha=\\frac{3}{4}$에서 $a=4k, b=3k, \\overline{AB}=5k$를 두고 넓이 등식으로 $k=\\frac{5}{4}$를 구한다.", "decisiveStep": "$\\triangle OAB$의 넓이 $\\frac{1}{2}ab = \\frac{1}{2}\\overline{AB}\\cdot\\overline{OH}$로 $k=\\frac{5}{4}$를 구하는 단계", "rpm": {"majorUnit": "삼각비", "midUnit": "삼각비의 활용", "l3": "복합도형", "l4": "피타고라스 결합"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "좌표축과 직선이 만드는 직각삼각형에서 $\\tan\\alpha$와 빗변 수선으로 직선 식을 구한다."}, "crossConceptKeys": ["CC_LINE_SLOPE_TANGENT", "CC_GEOMETRIC_AREA_VOLUME_FORMULA"], "conditionKeys": ["COND_POSITIVE"], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "삼각비로 변의 비를 세운 뒤 넓이 등식으로 실제 길이를 구해 기울기와 $y$절편을 연결해야 한다.", "level": "상", "item4slot": {"given": [{"term": "직선", "src": "stem", "quote": "직선 $y = mx + n$"}], "condition": [{"term": "삼각비", "src": "stem", "quote": "\\tan\\alpha = \\frac{3}{4}"}], "goal": [{"term": "합", "src": "solution", "quote": "m + n = \\frac{3}{4} + \\frac{15}{4} = \\frac{9}{2}"}], "method": [{"term": "넓이", "src": "solution", "quote": "넓이를 두 가지로 표현"}], "reasons": {"method": "$\\tan\\alpha$로 두 변의 비를 두고 $\\triangle OAB$ 넓이 등식으로 실제 절편을 구한다."}}, "hold": ""}
```

## Q11

- 형식: 객관식  
- 배점: 4

### 발문

다음 그림과 같이 \$\\overline{\\text{AC}} \= 30\\text{ m}\$, \$\\overline{\\text{BC}} \= 50\\text{ m}\$, \$\\angle\\text{ACB} \= 60^\\circ\$일 때, 두 지점 \$\\text{A}\$와 \$\\text{B}\$ 사이의 거리를 구하면? (4점)

### 선지

① \$10\\sqrt{19}\\text{ m}\$ ② \$10\\sqrt{17}\\text{ m}\$ ③ \$10\\sqrt{21}\\text{ m}\$ ④ \$20\\sqrt{5}\\text{ m}\$ ⑤ \$20\\sqrt{7}\\text{ m}\$

### 정답

①

### 해설

점 \$\\text{A}\$에서 \$\\overline{\\text{BC}}\$에 내린 수선의 발을 \$\\text{H}\$라 하면 \$\$\\overline{\\text{CH}} \= 30\\cos 60^\\circ \= 15\\text{ m},\\quad \\overline{\\text{AH}} \= 30\\sin 60^\\circ \= 15\\sqrt{3}\\text{ m}\$\$ \$\$\\overline{\\text{BH}} \= 50 \- 15 \= 35\\text{ m}\$\$ 직각삼각형 \$\\text{ABH}\$에서 피타고라스 정리에 의해 \$\$\\overline{\\text{AB}} \= \\sqrt{35^2 \+ (15\\sqrt{3})^2} \= \\sqrt{1225 \+ 675} \= \\sqrt{1900} \= 10\\sqrt{19}\\text{ m}\$\$ 따라서 정답은 ①이다.

```
{"capability": "SOURCE_PLANE_FIGURE_v1", "triangle": {"vertices": ["A", "B", "C"], "AC": 30, "BC": 50, "angleC": 60}, "caption": "AC=30m, BC=50m, ∠ACB=60°인 삼각형 ABC에서 두 지점 A, B 사이 거리"}
```

```
{"sourceQid": "11", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO_APPLICATION", "conceptClusterKey": "두 변과 끼인각으로 대변 길이 구하기", "primaryMethod": "수선 $\\text{AH}$를 내려 $\\overline{CH}=15, \\overline{AH}=15\\sqrt{3}$을 구한 뒤 $\\triangle ABH$에 피타고라스 정리를 적용한다.", "decisiveStep": "수선의 발 $\\text{H}$로 직각삼각형을 만들어 $\\overline{BH}=35$와 $\\overline{AH}=15\\sqrt{3}$을 구하는 단계", "rpm": {"majorUnit": "삼각비", "midUnit": "삼각비", "l3": "삼각비와 길이", "l4": "직각삼각형의 변"}, "ptTplCandidate": {"problemTypeKey": "PT_TRIG_RATIO_APPLICATION", "templateKey": null, "why": "두 변과 끼인각 $60^\\circ$가 주어진 일반 삼각형에서 나머지 한 변의 길이를 구한다."}, "crossConceptKeys": ["CC_AUXILIARY_ALTITUDE", "CC_SPECIAL_ANGLES"], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "보조선 수선을 그어 삼각비로 두 직각변을 구한 뒤 피타고라스 정리를 적용해야 한다.", "level": "상", "item4slot": {"given": [{"term": "삼각형", "src": "solution", "quote": "직각삼각형 $\\text{ABH}$"}], "condition": [], "goal": [{"term": "거리", "src": "stem", "quote": "사이의 거리"}], "method": [{"term": "직각삼각형", "src": "solution", "quote": "직각삼각형"}], "reasons": {"method": "수선 $\\text{AH}$를 그어 직각삼각형 $\\text{ABH}$에 피타고라스 정리를 적용한다."}}, "hold": ""}
```

## Q12

- 형식: 객관식  
- 배점: 4

### 발문

그림과 같이 넓이가 \$S\$인 삼각형 \$\\text{ABC}\$에서 \$\\overline{\\text{AB}}\$의 길이는 \$20%\$ 줄이고 \$\\overline{\\text{BC}}\$의 길이는 \$20%\$ 늘려서 새로운 삼각형 \$\\text{A}'\\text{BC}'\$를 만들었다. 새로운 삼각형 \$\\text{A}'\\text{BC}'\$의 넓이는? (4점)

### 선지

① \$0.92S\$ ② \$0.94S\$ ③ \$0.96S\$ ④ \$S\$ ⑤ \$1.04S\$

### 정답

③

### 해설

두 삼각형 \$\\text{ABC}\$와 \$\\text{A}'\\text{BC}'\$는 \$\\angle\\text{B}\$를 공유한다. \$\$S \= \\frac{1}{2} \\overline{\\text{AB}} \\cdot \\overline{\\text{BC}} \\sin B\$\$ \$\\overline{\\text{BA}'} \= 0.8\\overline{\\text{AB}}\$, \$\\overline{\\text{BC}'} \= 1.2\\overline{\\text{BC}}\$이므로 새로운 삼각형의 넓이는 \$\$\\frac{1}{2} (0.8\\overline{\\text{AB}})(1.2\\overline{\\text{BC}})\\sin B \= 0.96 \\left(\\frac{1}{2}\\overline{\\text{AB}}\\cdot\\overline{\\text{BC}}\\sin B\\right) \= 0.96S\$\$ 따라서 정답은 ③이다.

```
{"capability": "SOURCE_PLANE_FIGURE_v1", "triangle": {"vertices": ["A", "B", "C"], "modified": ["A'", "B", "C'"], "ratioAB": 0.8, "ratioBC": 1.2}, "caption": "∠B를 공유하며 AB를 20% 줄이고 BC를 20% 늘린 삼각형 A'BC'"}
```

```
{"sourceQid": "12", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO_APPLICATION", "conceptClusterKey": "두 변 길이 변화에 따른 삼각형 넓이 비", "primaryMethod": "$\\frac{1}{2}(0.8\\overline{AB})(1.2\\overline{BC})\\sin B = 0.96S$임을 계산한다.", "decisiveStep": "끼인각 $\\angle B$가 같으므로 두 변의 배율 $0.8 \\times 1.2 = 0.96$만 곱하는 단계", "rpm": {"majorUnit": "삼각비", "midUnit": "삼각비의 활용", "l3": "평면도형", "l4": "삼각형의 높이·넓이"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "삼각형의 두 변을 각각 일정 비율로 증감시켰을 때 넓이의 변화를 구한다."}, "crossConceptKeys": ["CC_TRIANGLE_AREA_TRIG"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "삼각형 넓이 공식을 이용해 두 변의 백분율 변화를 배율 곱으로 연결해야 한다.", "level": "중", "item4slot": {"given": [{"term": "삼각형", "src": "stem", "quote": "삼각형 $\\text{ABC}$"}], "condition": [], "goal": [{"term": "넓이", "src": "stem", "quote": "넓이가 $S$"}], "method": [{"term": "삼각비", "src": "solution", "quote": "\\frac{1}{2} \\overline{\\text{AB}} \\cdot \\overline{\\text{BC}} \\sin B"}], "reasons": {"method": "공통 끼인각 $\\angle B$를 이용해 넓이 공식에 $0.8$과 $1.2$를 곱한다."}}, "hold": ""}
```

## Q13

- 형식: 객관식  
- 배점: 4

### 발문

동굴을 탈출하기 위해 두 사람이 긴 끈에 매달려 있다. 그림과 같이 \$\\overline{\\text{AB}} \= \\overline{\\text{AC}} \= 4\\text{ m}\$, \$\\angle\\text{BAH} \= 51^\\circ\$이고 점 \$\\text{C}\$가 지면으로부터 \$0.4\\text{ m}\$ 높이에 있을 때, 점 \$\\text{B}\$의 지면으로부터의 높이 \$h\$는? (단, \$\\sin 51^\\circ \= 0.78\$, \$\\cos 51^\\circ \= 0.63\$, \$\\tan 51^\\circ \= 1.23\$으로 계산한다.) (4점)

### 선지

① \$1.48\\text{ m}\$ ② \$1.88\\text{ m}\$ ③ \$1.92\\text{ m}\$ ④ \$2.12\\text{ m}\$ ⑤ \$2.52\\text{ m}\$

### 정답

②

### 해설

점 \$\\text{B}\$에서 연직선 \$\\text{AC}\$에 내린 수선의 발을 \$\\text{H}\$라 하면 \$\$\\overline{\\text{AH}} \= 4\\cos 51^\\circ \= 4 \\times 0.63 \= 2.52\\text{ m}\$\$ 점 \$\\text{C}\$가 지면에서 \$0.4\\text{ m}\$ 위에 있고 \$\\overline{\\text{AC}} \= 4\\text{ m}\$이므로 \$\$h \= 4 \+ 0.4 \- 2.52 \= 1.88\\text{ m}\$\$ 따라서 정답은 ②이다.

```
{"capability": "SOURCE_PLANE_FIGURE_v1", "segments": {"AB": 4, "AC": 4, "C_to_ground": 0.4, "angleBAH": 51}, "caption": "연직선 AC=4m, AB=4m, ∠BAH=51°, 점 C의 지면 높이 0.4m일 때 점 B의 높이 h"}
```

```
{"sourceQid": "13", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO_APPLICATION", "conceptClusterKey": "삼각비 표를 이용한 실생활 높이 계산", "primaryMethod": "$\\overline{AH}=4\\cos 51^\\circ=2.52$를 구해 지면 높이 $4+0.4-2.52=1.88\\text{ m}$를 계산한다.", "decisiveStep": "수선 $\\overline{AH}$를 구한 뒤 전체 높이 $4+0.4$에서 빼서 $h$를 얻는 단계", "rpm": {"majorUnit": "삼각비", "midUnit": "삼각비의 활용", "l3": "측정 문제", "l4": "높이·거리"}, "ptTplCandidate": {"problemTypeKey": "PT_TRIG_RATIO_APPLICATION", "templateKey": null, "why": "삼각비 표의 $\\cos 51^\\circ$ 값을 이용해 수직 높이를 계산한다."}, "crossConceptKeys": ["CC_TRIG_MEASUREMENT", "CC_TRIG_TABLE_LOOKUP"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "그림에서 $\\cos 51^\\circ$를 선택해 $\\overline{AH}$를 구하고 지면 기준 높이를 빼야 한다.", "level": "중", "item4slot": {"given": [{"term": "삼각비", "src": "stem", "quote": "\\cos 51^\\circ = 0.63"}], "condition": [], "goal": [{"term": "높이", "src": "stem", "quote": "높이 $h$"}], "method": [{"term": "수선", "src": "solution", "quote": "수선의 발을 $\\text{H}$"}], "reasons": {"method": "$\\overline{AH}=4\\cos 51^\\circ$를 구해 지면에서 $\\text{A}$까지의 높이에서 뺀다."}}, "hold": ""}
```

## Q14

- 형식: 객관식  
- 배점: 5

### 발문

직사각형 모양의 색종이를 두 점 \$\\text{A}\$와 \$\\text{C}\$가 겹치도록 접었다. \$\\overline{\\text{AB}} \= 5\\text{ cm}\$, \$\\overline{\\text{AP}} \= 13\\text{ cm}\$이고 \$\\angle\\text{CPQ} \= x\$라 할 때, \$\\sin x\$의 값은? (5점)

### 선지

① \$\\frac{\\sqrt{26}}{26}\$ ② \$\\frac{2\\sqrt{26}}{26}\$ ③ \$\\frac{3\\sqrt{26}}{26}\$ ④ \$\\frac{4\\sqrt{26}}{26}\$ ⑤ \$\\frac{5\\sqrt{26}}{26}\$

### 정답

⑤

### 해설

접으면 \$\\text{A}\$와 \$\\text{C}\$가 겹치므로 \$\\overline{\\text{PC}} \= \\overline{\\text{PA}} \= 13\\text{ cm}\$이다. 직각삼각형 \$\\text{PDC}\$에서 \$\\overline{\\text{DC}} \= 5\\text{ cm}\$이므로 \$\\overline{\\text{PD}} \= \\sqrt{13^2 \- 5^2} \= 12\\text{ cm}\$이고, \$\\overline{\\text{AD}} \= 13 \+ 12 \= 25\\text{ cm}\$이다. 점 \$\\text{Q}\$에서 \$\\overline{\\text{AD}}\$에 내린 수선의 발을 \$\\text{H}\$라 하면 \$\\overline{\\text{QH}} \= 5\\text{ cm}\$이고, \$\\overline{\\text{CQ}} \= \\overline{\\text{AQ}} \= t\$라 하면 직각삼각형 \$\\text{ABQ}\$에서 \$\$t^2 \= 5^2 \+ (25 \- t)^2 \\implies 50t \= 650 \\implies t \= 13\\text{ cm}\$\$ 따라서 \$\\overline{\\text{AH}} \= \\overline{\\text{BQ}} \= 25 \- 13 \= 12\\text{ cm}\$이므로 \$\\overline{\\text{PH}} \= 13 \- 12 \= 1\\text{ cm}\$이다. 직각삼각형 \$\\text{PHQ}\$에서 \$\\overline{\\text{PQ}} \= \\sqrt{1^2 \+ 5^2} \= \\sqrt{26}\\text{ cm}\$이다. 접은 각에 의해 \$\\angle\\text{APQ} \= \\angle\\text{CPQ} \= x\$이므로 \$\\sin x \= \\frac{\\overline{\\text{QH}}}{\\overline{\\text{PQ}}} \= \\frac{5}{\\sqrt{26}} \= \\frac{5\\sqrt{26}}{26}\$이다. 정답은 ⑤이다.

```
{"capability": "SOURCE_PLANE_FIGURE_v1", "rectangle": {"vertices": ["A", "B", "C", "D"], "AB": 5, "AD": 25}, "fold": {"line": ["P", "Q"], "AP": 13, "angleCPQ": "x"}, "caption": "A와 C가 겹치도록 접은 직사각형 ABCD (AB=5cm, AP=13cm, ∠CPQ=x)"}
```

```
{"sourceQid": "14", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO_APPLICATION", "conceptClusterKey": "직사각형 종이접기와 삼각비", "primaryMethod": "접은 길이로 $\\overline{PD}=12, \\overline{BQ}=12$를 구해 $\\overline{PH}=1, \\overline{PQ}=\\sqrt{26}$을 얻고 $\\sin x = \\frac{5}{\\sqrt{26}}$을 계산한다.", "decisiveStep": "수선 $\\text{QH}$를 내려 직각삼각형 $\\text{PHQ}$의 밑변 $\\overline{PH}=1$과 빗변 $\\overline{PQ}=\\sqrt{26}$을 구하는 단계", "rpm": {"majorUnit": "삼각비", "midUnit": "삼각비의 활용", "l3": "복합도형", "l4": "피타고라스 결합"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "직사각형을 대각선 방향으로 접었을 때 접는 선이 이루는 각의 사인 값을 구한다."}, "crossConceptKeys": ["CC_PAPER_FOLDING_SIMILARITY", "CC_AUXILIARY_ALTITUDE"], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "종이접기 합동, 두 번의 피타고라스 정리, 보조선 수선을 통한 삼각비 계산까지 4단계가 필요하다.", "level": "상", "item4slot": {"given": [{"term": "직사각형", "src": "stem", "quote": "직사각형 모양"}], "condition": [], "goal": [{"term": "삼각비", "src": "solution", "quote": "\\sin x = \\frac{\\overline{\\text{QH}}}{\\overline{\\text{PQ}}} = \\frac{5}{\\sqrt{26}} = \\frac{5\\sqrt{26}}{26}"}], "method": [{"term": "직각삼각형", "src": "solution", "quote": "직각삼각형 $\\text{PHQ}$"}], "reasons": {"method": "접어서 같은 길이를 구한 뒤 수선 $\\text{QH}$를 내려 $\\triangle PHQ$에서 $\\sin x$를 구한다."}}, "hold": ""}
```

## Q15

- 형식: 객관식  
- 배점: 5

### 발문

그림의 \$\\triangle\\text{OAC}\$에서 \$\\angle\\text{A} \= 90^\\circ\$, \$\\overline{\\text{OB}} \= 13\$, \$\\sin\\angle\\text{AOB} \= \\frac{5}{13}\$이고 점 \$\\text{B}\$는 \$x\$축 양의 부분 위의 점이다. \$\\overline{\\text{OB}}\$가 \$\\triangle\\text{OAC}\$의 넓이를 이등분할 때, 점 \$\\text{C}\$의 좌표는? (5점)

### 선지

① \$\\left(\\frac{194}{13}, \-\\frac{50}{13}\\right)\$ ② \$\\left(\\frac{184}{13}, \-\\frac{60}{13}\\right)\$ ③ \$\\left(\\frac{190}{13}, \-\\frac{60}{13}\\right)\$ ④ \$\\left(\\frac{194}{13}, \-\\frac{60}{13}\\right)\$ ⑤ \$\\left(\\frac{184}{13}, \-\\frac{50}{13}\\right)\$

### 정답

④

### 해설

직각삼각형 \$\\text{OAB}\$에서 \$\\overline{\\text{OB}} \= 13\$, \$\\sin\\angle\\text{AOB} \= \\frac{5}{13}\$이므로 \$\\overline{\\text{AB}} \= 5\$, \$\\overline{\\text{OA}} \= 12\$이다. \$\\angle\\text{AOB} \= \\theta\$라 하면 점 \$\\text{A}\$의 좌표는 \$\$\\text{A}(12\\cos\\theta, 12\\sin\\theta) \= \\left(12 \\cdot \\frac{12}{13}, 12 \\cdot \\frac{5}{13}\\right) \= \\left(\\frac{144}{13}, \\frac{60}{13}\\right)\$\$ \$\\overline{\\text{OB}}\$가 \$\\triangle\\text{OAC}\$의 넓이를 이등분하므로 점 \$\\text{B}(13, 0)\$은 \$\\overline{\\text{AC}}\$의 중점이다. 따라서 점 \$\\text{C}\$의 좌표는 \$\$\\left(2 \\times 13 \- \\frac{144}{13},\\ 2 \\times 0 \- \\frac{60}{13}\\right) \= \\left(\\frac{194}{13}, \-\\frac{60}{13}\\right)\$\$ 정답은 ④이다.

```
{"capability": "SOURCE_COORDINATE_AXES_v1", "triangle": {"vertices": ["O", "A", "C"], "angleA": 90, "O": [0, 0], "B": [13, 0], "A": [11.08, 4.62], "C": [14.92, -4.62]}, "caption": "∠A=90°, OB=13이고 OB가 △OAC의 넓이를 이등분할 때 점 C의 좌표"}
```

```
{"sourceQid": "15", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO_APPLICATION", "conceptClusterKey": "삼각비 좌표와 삼각형 넓이 이등분선 중점", "primaryMethod": "$\\text{A}(12\\cos\\theta, 12\\sin\\theta)=(\\frac{144}{13}, \\frac{60}{13})$을 구한 뒤 중점 $\\text{B}(13, 0)$을 이용해 $\\text{C}$를 구한다.", "decisiveStep": "$\\overline{OB}$가 넓이를 이등분하므로 $\\text{B}$가 $\\overline{AC}$의 중점임을 좌표에 적용하는 단계", "rpm": {"majorUnit": "삼각비", "midUnit": "삼각비", "l3": "삼각비와 길이", "l4": "각을 이용한 길이"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "좌표평면 위 직각삼각형에서 삼각비로 한 점의 좌표를 구하고 넓이 이등분 중점으로 다른 점의 좌표를 구한다."}, "crossConceptKeys": ["CC_COORDINATE_TRIG", "CC_SHARED_HEIGHT"], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "삼각비를 이용한 점 $\\text{A}$의 좌표화와 넓이 이등분 조건을 중점 공식으로 연결해야 한다.", "level": "상", "item4slot": {"given": [{"term": "직각삼각형", "src": "solution", "quote": "직각삼각형 $\\text{OAB}$"}], "condition": [{"term": "중점", "src": "solution", "quote": "\\overline{\\text{AC}}$의 중점"}], "goal": [{"term": "좌표", "src": "stem", "quote": "점 $\\text{C}$의 좌표"}], "method": [{"term": "중점", "src": "solution", "quote": "중점이다"}], "reasons": {"method": "삼각비로 $\\text{A}$의 좌표를 구한 뒤 $\\text{B}$가 $\\overline{AC}$의 중점임을 이용한다."}}, "hold": ""}
```

## Q16

- 형식: 객관식  
- 배점: 3

### 발문

다음 그림에서 두 현의 길이가 모두 \$16\\text{ cm}\$이고 원의 반지름의 길이가 \$10\\text{ cm}\$일 때, 원의 중심에서 현까지의 거리 \$x\$의 값을 구하면? (3점)

### 선지

① \$4\$ ② \$5\$ ③ \$6\$ ④ \$7\$ ⑤ \$8\$

### 정답

③

### 해설

원의 중심 \$\\text{O}\$에서 현에 내린 수선은 현을 이등분하므로 반현의 길이는 \$\\frac{16}{2} \= 8\\text{ cm}\$이다. 두 현의 길이가 같으므로 중심에서 두 현까지의 거리도 모두 \$x\\text{ cm}\$로 같다. 피타고라스 정리에 의해 \$\$x \= \\sqrt{10^2 \- 8^2} \= \\sqrt{100 \- 64} \= \\sqrt{36} \= 6\$\$ 따라서 정답은 ③이다.

```
{"capability": "SOURCE_PLANE_FIGURE_v1", "circle": {"radius": 10, "chords": [{"length": 16, "dist": "x"}, {"length": 16, "dist": "x"}]}, "caption": "반지름 10cm인 원에서 길이가 같은 두 현(16cm)까지의 거리 x"}
```

```
{"sourceQid": "16", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-06", "subUnitKey": "M3-06-CIRCLE_LINE", "conceptClusterKey": "현의 수직이등분과 중심거리", "primaryMethod": "수선이 현 $16$을 이등분하므로 반현 $8$과 반지름 $10$으로 $x=\\sqrt{10^2-8^2}=6$을 구한다.", "decisiveStep": "두 현의 길이가 같아 중심거리가 같음과 반현 $8$에 피타고라스 정리를 적용하는 단계", "rpm": {"majorUnit": "원의 성질", "midUnit": "원과 직선", "l3": "원의 중심과 현", "l4": "중심에서 현에 내린 수선"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "반지름과 현의 길이를 이용해 중심에서 현까지의 거리를 구한다."}, "crossConceptKeys": ["CC_CIRCLE_CHORD_PERP_BISECTOR"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "현을 이등분해 직각삼각형에 피타고라스 정리를 바로 적용하면 된다.", "level": "하", "item4slot": {"given": [{"term": "원", "src": "stem", "quote": "원의 반지름의 길이가 $10\\text{ cm}$"}, {"term": "현", "src": "stem", "quote": "두 현의 길이"}], "condition": [], "goal": [{"term": "거리", "src": "stem", "quote": "거리 $x$"}], "method": [{"term": "현", "src": "solution", "quote": "현을 이등분"}], "reasons": {"method": "중심에서 현에 내린 수선이 현을 이등분함을 이용해 피타고라스 정리를 쓴다."}}, "hold": ""}
```

## Q17

- 형식: 객관식  
- 배점: 4

### 발문

오른쪽 그림과 같이 원 \$\\text{O}\$의 중심에서 두 현 \$\\text{AB}\$와 \$\\text{AC}\$에 이르는 거리가 같고 \$\\angle\\text{B} \= 63^\\circ\$일 때, \$\\angle x\$의 크기를 구하면? (4점)

### 선지

① \$54^\\circ\$ ② \$56^\\circ\$ ③ \$58^\\circ\$ ④ \$60^\\circ\$ ⑤ \$63^\\circ\$

### 정답

①

### 해설

원의 중심에서 같은 거리에 있는 두 현의 길이는 같으므로 \$\\overline{\\text{AB}} \= \\overline{\\text{AC}}\$이다. \$\\triangle\\text{ABC}\$는 이등변삼각형이므로 \$\\angle\\text{C} \= \\angle\\text{B} \= 63^\\circ\$이다. 따라서 \$\\angle x \= \\angle\\text{A} \= 180^\\circ \- (63^\\circ \+ 63^\\circ) \= 54^\\circ\$이다. 정답은 ①이다.

```
{"capability": "SOURCE_PLANE_FIGURE_v1", "circle": {"center": "O", "inscribedTriangle": ["A", "B", "C"], "equalDistTo": ["AB", "AC"], "angleB": 63, "angleA": "x"}, "caption": "원 O의 중심에서 두 현 AB, AC까지의 거리가 같고 ∠B=63°일 때 ∠A=x"}
```

```
{"sourceQid": "17", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-06", "subUnitKey": "M3-06-CIRCLE_LINE", "conceptClusterKey": "중심거리가 같은 두 현과 이등변삼각형 각", "primaryMethod": "중심거리가 같으므로 $\\overline{AB}=\\overline{AC}$임을 이용해 $\\angle x = 180^\\circ - 2(63^\\circ) = 54^\\circ$를 구한다.", "decisiveStep": "중심에서 같은 거리에 있는 두 현의 길이가 같아 $\\triangle ABC$가 이등변삼각형임을 판별하는 단계", "rpm": {"majorUnit": "원의 성질", "midUnit": "원과 직선", "l3": "원의 중심과 현", "l4": "중심거리와 현의 길이"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "중심거리가 같은 두 현으로 이루어진 이등변삼각형의 꼭지각을 구한다."}, "crossConceptKeys": ["CC_EQUAL_CHORDS_EQUAL_DISTANCE"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 현의 길이가 같음을 확인하면 이등변삼각형 내각의 합으로 바로 풀린다.", "level": "중", "item4slot": {"given": [{"term": "원", "src": "stem", "quote": "원 $\\text{O}$"}, {"term": "현", "src": "stem", "quote": "두 현 $\\text{AB}$와 $\\text{AC}$"}], "condition": [{"term": "거리", "src": "stem", "quote": "이르는 거리가 같고"}], "goal": [{"term": "각", "src": "stem", "quote": "\\angle x"}], "method": [{"term": "이등변삼각형", "src": "solution", "quote": "\\triangle\\text{ABC}$는 이등변삼각형"}], "reasons": {"method": "중심거리가 같으면 두 현의 길이가 같으므로 이등변삼각형의 성질을 이용한다."}}, "hold": ""}
```

## Q18

- 형식: 객관식  
- 배점: 4

### 발문

다음 그림과 같이 \$\\overline{\\text{PA}}, \\overline{\\text{PB}}\$는 반지름의 길이가 \$4\$인 원 \$\\text{O}\$의 접선이고, 두 점 \$\\text{A}, \\text{B}\$는 그 접점이다. \$\\angle\\text{APB} \= 60^\\circ\$일 때, \$\\overline{\\text{PA}}\$와 \$\\overline{\\text{PB}}\$의 길이의 합을 구하면? (4점)

### 선지

① \$4\\sqrt{3}\$ ② \$6\\sqrt{3}\$ ③ \$8\$ ④ \$8\\sqrt{3}\$ ⑤ \$12\$

### 정답

④

### 해설

\$\\overline{\\text{OA}} \\perp \\overline{\\text{PA}}\$, \$\\overline{\\text{OB}} \\perp \\overline{\\text{PB}}\$이고 \$\\overline{\\text{OA}} \= \\overline{\\text{OB}} \= 4\$이므로 \$\\triangle\\text{OAP} \\equiv \\triangle\\text{OBP}\$ (RHS 합동)이다. 따라서 \$\\angle\\text{APO} \= \\frac{1}{2}\\angle\\text{APB} \= 30^\\circ\$이다. 직각삼각형 \$\\text{OAP}\$에서 \$\\tan 30^\\circ \= \\frac{\\overline{\\text{OA}}}{\\overline{\\text{PA}}} \= \\frac{4}{\\overline{\\text{PA}}} \= \\frac{1}{\\sqrt{3}}\$이므로 \$\\overline{\\text{PA}} \= 4\\sqrt{3}\$이다. \$\\overline{\\text{PB}} \= \\overline{\\text{PA}} \= 4\\sqrt{3}\$이므로 \$\\overline{\\text{PA}} \+ \\overline{\\text{PB}} \= 8\\sqrt{3}\$이다. 정답은 ④이다.

```
{"capability": "SOURCE_PLANE_FIGURE_v1", "circle": {"center": "O", "radius": 4}, "tangents": {"from": "P", "points": ["A", "B"], "angleAPB": 60}, "caption": "반지름 4인 원 O에 점 P에서 그은 두 접선 PA, PB (∠APB=60°)"}
```

```
{"sourceQid": "18", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-06", "subUnitKey": "M3-06-CIRCLE_LINE", "conceptClusterKey": "원 밖의 점에서 그은 두 접선의 길이 합과 삼각비", "primaryMethod": "$\\angle APO=30^\\circ$와 반지름 $4$로 $\\overline{PA}=4\\sqrt{3}$을 구해 $2$배한 $8\\sqrt{3}$을 구한다.", "decisiveStep": "접점 반지름의 수직 성질로 $\\triangle OAP$에서 $\\tan 30^\\circ=\\frac{4}{PA}$를 적용하는 단계", "rpm": {"majorUnit": "원의 성질", "midUnit": "원과 직선", "l3": "원의 접선", "l4": "한 점에서 그은 두 접선"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "반지름과 두 접선이 이루는 각이 주어졌을 때 두 접선 길이의 합을 구한다."}, "crossConceptKeys": ["CC_CIRCLE_TANGENT_LENGTH", "CC_SPECIAL_ANGLES"], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "접선 수직과 RHS 합동으로 각을 이등분한 뒤 특수각 삼각비를 적용해야 한다.", "level": "상", "item4slot": {"given": [{"term": "원", "src": "stem", "quote": "원 $\\text{O}$"}, {"term": "접선", "src": "stem", "quote": "접선"}], "condition": [{"term": "접점", "src": "stem", "quote": "접점"}], "goal": [{"term": "합", "src": "stem", "quote": "길이의 합"}], "method": [{"term": "합동", "src": "solution", "quote": "RHS 합동"}], "reasons": {"method": "$\\triangle OAP \\equiv \\triangle OBP$에서 $\\angle APO=30^\\circ$를 얻어 $\\tan 30^\\circ$로 $\\overline{PA}$를 구한다."}}, "hold": ""}
```

## Q19

- 형식: 객관식  
- 배점: 4

### 발문

보기에서 원의 중심을 찾기 위한 세 사람의 대화를 읽고 옳은 것만을 있는 대로 고른 것은? (4점) \[보기\] 지수: 원에 외접하는 삼각형을 그리고 두 변의 수직이등분선의 교점을 찾으면 돼. 수호: 원에 서로 다른 두 현을 긋고 각 현의 수직이등분선이 만나는 점을 찾으면 돼. 민준: 원에 내접하는 삼각형을 그리고 두 내각의 이등분선이 만나는 점을 찾으면 돼.

### 선지

① 지수 ② 수호 ③ 지수, 수호 ④ 수호, 민준 ⑤ 지수, 민준

### 정답

②

### 해설

원의 중심은 원 위의 서로 다른 두 현의 수직이등분선의 교점이다.

- 지수: 원에 외접하는 삼각형의 두 변의 수직이등분선의 교점은 원의 중심이 아니라 삼각형의 외심이다. (거짓)  
- 수호: 서로 다른 두 현의 수직이등분선은 각각 원의 중심을 지나므로 교점이 원의 중심이다. (참)  
- 민준: 내접하는 삼각형의 내각의 이등분선의 교점은 내심이므로 원의 중심이 아니다. (거짓) 따라서 옳은 사람은 수호뿐이다. 정답은 ②이다.

```
"NONE"
```

```
{"sourceQid": "19", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-06", "subUnitKey": "M3-06-CIRCLE_LINE", "conceptClusterKey": "현의 수직이등분선을 이용한 원의 중심 찾기", "primaryMethod": "원 위의 두 현의 수직이등분선 교점이 원의 중심이라는 성질로 수호만 참임을 판별한다.", "decisiveStep": "외접삼각형의 외심(지수) 및 내접삼각형의 내심(민준)과 현의 수직이등분선 교점(수호)을 구분하는 단계", "rpm": {"majorUnit": "원의 성질", "midUnit": "원과 직선", "l3": "원의 중심과 현", "l4": "현의 수직이등분선과 중심"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "원의 중심을 작도하는 올바른 방법을 대화 보기에서 찾는다."}, "crossConceptKeys": ["CC_CIRCLE_CENTER_CONSTRUCTION", "CC_CIRCLE_CHORD_PERP_BISECTOR"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "원의 중심 찾기 작도 원리인 현의 수직이등분선 성질을 바로 판별하면 된다.", "level": "하", "item4slot": {"given": [{"term": "원", "src": "stem", "quote": "원의 중심"}], "condition": [], "goal": [{"term": "현", "src": "stem", "quote": "두 현"}], "method": [{"term": "수직이등분선", "src": "stem", "quote": "수직이등분선"}], "reasons": {"method": "서로 다른 두 현의 수직이등분선이 원의 중심에서 만남을 이용한다."}}, "hold": ""}
```

## Q20

- 형식: 객관식  
- 배점: 5

### 발문

그림과 같이 가로의 길이가 \$12\\text{ cm}\$, 세로의 길이가 \$8\\text{ cm}\$인 직사각형 \$\\text{ABCD}\$의 \$3\$개의 변에 원 \$\\text{O}\$가 내접하고 \$\\overline{\\text{DE}}\$는 원 \$\\text{O}\$의 접선일 때, \$\\overline{\\text{EC}}\$의 길이를 구하면? (5점)

### 선지

① \$3\\text{ cm}\$ ② \$4\\text{ cm}\$ ③ \$\\frac{9}{2}\\text{ cm}\$ ④ \$5\\text{ cm}\$ ⑤ \$6\\text{ cm}\$

### 정답

⑤

### 해설

원 \$\\text{O}\$의 반지름의 길이는 \$\\frac{8}{2} \= 4\\text{ cm}\$이다. \$\\overline{\\text{DE}}\$의 접점을 \$\\text{T}\$, 변 \$\\text{BC}\$와의 접점을 \$\\text{V}\$라 하자. 점 \$\\text{D}\$에서 원 \$\\text{O}\$에 그은 두 접선의 길이는 같으므로 \$\\overline{\\text{DT}} \= 12 \- 4 \= 8\\text{ cm}\$이다. \$\\overline{\\text{EC}} \= x\\text{ cm}\$라 하면 \$\\overline{\\text{ET}} \= \\overline{\\text{EV}} \= (12 \- 4\) \- x \= (8 \- x)\\text{ cm}\$이므로 \$\\overline{\\text{DE}} \= 8 \+ (8 \- x) \= (16 \- x)\\text{ cm}\$이다. 직각삼각형 \$\\text{ECD}\$에서 피타고라스 정리에 의해 \$\$8^2 \+ x^2 \= (16 \- x)^2 \\implies 64 \+ x^2 \= 256 \- 32x \+ x^2 \\implies 32x \= 192 \\implies x \= 6\$\$ 따라서 \$\\overline{\\text{EC}} \= 6\\text{ cm}\$이다. 정답은 ⑤이다.

```
{"capability": "SOURCE_PLANE_FIGURE_v1", "rectangle": {"vertices": ["A", "B", "C", "D"], "width": 12, "height": 8}, "circle": {"inscribedInThreeSides": ["AB", "BC", "DA"], "radius": 4}, "tangent": {"from": "D", "to": "E_on_BC"}, "caption": "가로 12cm, 세로 8cm인 직사각형의 세 변에 내접하는 원 O와 접선 DE"}
```

```
{"sourceQid": "20", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-06", "subUnitKey": "M3-06-CIRCLE_LINE", "conceptClusterKey": "직사각형 내접원과 접선 DE의 길이 피타고라스", "primaryMethod": "반지름 $4$와 접선 길이 같음으로 $\\overline{DE}=16-x$를 구해 $\\triangle ECD$에서 $8^2+x^2=(16-x)^2$을 푼다.", "decisiveStep": "점 $\\text{D}, \\text{E}$에서 그은 접선 길이로 $\\overline{DE}=8+(8-x)=16-x$를 세우는 단계", "rpm": {"majorUnit": "원의 성질", "midUnit": "원과 직선", "l3": "원의 접선", "l4": "접선 조건으로 길이 구하기"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "직사각형 세 변에 내접하는 원과 꼭짓점에서 그은 접선이 만드는 직각삼각형으로 변의 길이를 구한다."}, "crossConceptKeys": ["CC_RECTANGLE_INSCRIBED_CIRCLE_TANGENT"], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "내접원의 반지름 파악, 두 접점에서의 접선 길이 합 표현, 직각삼각형 피타고라스 정리까지 모두 결합해야 한다.", "level": "상", "item4slot": {"given": [{"term": "직사각형", "src": "stem", "quote": "직사각형 $\\text{ABCD}$"}, {"term": "접선", "src": "stem", "quote": "접선"}], "condition": [], "goal": [{"term": "길이", "src": "stem", "quote": "$\\overline{\\text{EC}}$의 길이"}], "method": [{"term": "직각삼각형", "src": "solution", "quote": "직각삼각형"}], "reasons": {"method": "두 점에서 그은 접선의 길이가 같음을 이용해 $\\overline{DE}$를 $x$로 나타내고 피타고라스 정리를 쓴다."}}, "hold": ""}
```

## Q21

- 형식: 서답형  
- 배점: 7

### 발문

다음 그림에서 원 \$\\text{O}\$는 \$\\triangle\\text{ABC}\$에 내접하고, 점 \$\\text{D}, \\text{E}, \\text{F}\$는 접점이다. \$\\overline{\\text{AB}} \= 12\\text{ cm}\$, \$\\overline{\\text{BE}} \= 7\\text{ cm}\$, \$\\overline{\\text{BC}} \= 13\\text{ cm}\$일 때, \$\\triangle\\text{ABC}\$의 둘레의 길이를 구하시오. (7점) (\$\\overline{\\text{BD}}, \\overline{\\text{CF}}, \\overline{\\text{AF}}\$ 길이 구하기 각각 2점, \$\\triangle\\text{ABC}\$의 둘레의 길이 구하기 1점)

### 선지

없음

### 정답

\$36\\text{ cm}\$

### 해설

원 밖의 한 점에서 원에 그은 두 접선의 길이는 같으므로

- \$\\overline{\\text{BD}} \= \\overline{\\text{BE}} \= 7\\text{ cm}\$  
- \$\\overline{\\text{AD}} \= \\overline{\\text{AB}} \- \\overline{\\text{BD}} \= 12 \- 7 \= 5\\text{ cm} \\implies \\overline{\\text{AF}} \= \\overline{\\text{AD}} \= 5\\text{ cm}\$  
- \$\\overline{\\text{CE}} \= \\overline{\\text{BC}} \- \\overline{\\text{BE}} \= 13 \- 7 \= 6\\text{ cm} \\implies \\overline{\\text{CF}} \= \\overline{\\text{CE}} \= 6\\text{ cm}\$ 따라서 \$\\triangle\\text{ABC}\$의 둘레의 길이는 \$\$2(7 \+ 5 \+ 6\) \= 36\\text{ cm}\$\$

```
{"capability": "SOURCE_PLANE_FIGURE_v1", "triangle": {"vertices": ["A", "B", "C"], "AB": 12, "BC": 13}, "incircle": {"center": "O", "touchPoints": {"D": "on_AB", "E": "on_BC", "F": "on_CA"}, "BE": 7}, "caption": "△ABC의 내접원 O와 접점 D, E, F (AB=12cm, BE=7cm, BC=13cm)"}
```

```
{"sourceQid": "21", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-06", "subUnitKey": "M3-06-CIRCLE_LINE", "conceptClusterKey": "삼각형 내접원과 두 접선 길이 같음", "primaryMethod": "접선 길이가 같음을 이용해 $\\overline{BD}=7, \\overline{AF}=5, \\overline{CF}=6$을 구해 둘레 $36\\text{ cm}$를 구한다.", "decisiveStep": "각 꼭짓점에서 접점까지의 두 접선 길이가 같음을 차례로 적용하는 단계", "rpm": {"majorUnit": "원의 성질", "midUnit": "원과 직선", "l3": "원의 접선", "l4": "접선 조건으로 길이 구하기"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "삼각형 내접원의 세 접점에서 접선 길이를 구해 삼각형의 둘레를 계산한다."}, "crossConceptKeys": ["CC_CIRCLE_TANGENT_LENGTH"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "세 꼭짓점에서 접선 길이가 같음을 순차적으로 적용해 둘레를 구해야 한다.", "level": "중", "item4slot": {"given": [{"term": "원", "src": "stem", "quote": "원 $\\text{O}$"}], "condition": [{"term": "접점", "src": "stem", "quote": "접점"}], "goal": [{"term": "길이", "src": "stem", "quote": "둘레의 길이"}], "method": [{"term": "접선", "src": "solution", "quote": "두 접선의 길이는 같으므로"}], "reasons": {"method": "꼭짓점 $\\text{B}, \\text{A}, \\text{C}$에서 두 접선 길이가 같음을 차례로 적용한다."}}, "hold": ""}
```

## Q22

- 형식: 서답형  
- 배점: 7

### 발문

다음 그림과 같이 \$\\angle\\text{ABD} \= 90^\\circ\$, \$\\overline{\\text{AD}} \= 12\\text{ cm}\$, \$\\angle\\text{DAB} \= 60^\\circ\$, \$\\overline{\\text{DC}} \= 10\\text{ cm}\$, \$\\angle\\text{BDC} \= 30^\\circ\$인 \$\\square\\text{ABCD}\$의 넓이를 구하시오. (7점) (\$\\overline{\\text{BD}}\$의 길이를 구한 경우 1점, \$\\triangle\\text{ABD}\$의 넓이를 구한 경우 2점, \$\\triangle\\text{DBC}\$의 넓이를 구한 경우 2점, \$\\square\\text{ABCD}\$의 넓이를 구한 경우 2점)

### 선지

없음

### 정답

\$33\\sqrt{3}\\text{ cm}^2\$

### 해설

직각삼각형 \$\\text{ABD}\$에서 \$\\overline{\\text{AD}} \= 12\\text{ cm}\$, \$\\angle\\text{DAB} \= 60^\\circ\$이므로 \$\$\\overline{\\text{AB}} \= 12\\cos 60^\\circ \= 6\\text{ cm},\\quad \\overline{\\text{BD}} \= 12\\sin 60^\\circ \= 6\\sqrt{3}\\text{ cm}\$\$ \$\$\\triangle\\text{ABD} \= \\frac{1}{2} \\times 6 \\times 6\\sqrt{3} \= 18\\sqrt{3}\\text{ cm}^2\$\$ \$\\triangle\\text{DBC}\$에서 \$\\overline{\\text{DC}} \= 10\\text{ cm}\$, \$\\angle\\text{BDC} \= 30^\\circ\$이므로 \$\$\\triangle\\text{DBC} \= \\frac{1}{2} \\times 6\\sqrt{3} \\times 10 \\times \\sin 30^\\circ \= 30\\sqrt{3} \\times \\frac{1}{2} \= 15\\sqrt{3}\\text{ cm}^2\$\$ 따라서 \$\\square\\text{ABCD} \= 18\\sqrt{3} \+ 15\\sqrt{3} \= 33\\sqrt{3}\\text{ cm}^2\$이다.

```
{"capability": "SOURCE_PLANE_FIGURE_v1", "quadrilateral": {"vertices": ["A", "B", "C", "D"], "diagonal": "BD", "angleABD": 90, "AD": 12, "angleDAB": 60, "DC": 10, "angleBDC": 30}, "caption": "대각선 BD로 나뉜 사각형 ABCD (∠ABD=90°, AD=12, ∠DAB=60°, DC=10, ∠BDC=30°)"}
```

```
{"sourceQid": "22", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO_APPLICATION", "conceptClusterKey": "대각선으로 분할한 사각형 넓이와 삼각비", "primaryMethod": "$\\triangle ABD$에서 $\\overline{AB}=6, \\overline{BD}=6\\sqrt{3}$을 구해 두 삼각형 넓이 $18\\sqrt{3}+15\\sqrt{3}$을 더한다.", "decisiveStep": "$\\overline{BD}=6\\sqrt{3}$을 구한 뒤 $\\triangle DBC$에 $\\frac{1}{2}ab\\sin 30^\\circ$ 공식을 적용하는 단계", "rpm": {"majorUnit": "삼각비", "midUnit": "삼각비의 활용", "l3": "평면도형", "l4": "다각형의 길이·넓이"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "사각형을 대각선으로 두 삼각형으로 나누어 삼각비로 각각의 넓이를 구해 합한다."}, "crossConceptKeys": ["CC_TRIANGLE_AREA_TRIG", "CC_SPECIAL_ANGLES"], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "직각삼각형 변 길이 구하기와 일반 삼각형 삼각비 넓이 공식을 연속으로 적용해야 한다.", "level": "상", "item4slot": {"given": [{"term": "직각삼각형", "src": "solution", "quote": "직각삼각형 $\\text{ABD}$"}], "condition": [], "goal": [{"term": "넓이", "src": "stem", "quote": "$\\square\\text{ABCD}$의 넓이"}], "method": [{"term": "삼각비", "src": "solution", "quote": "6\\sqrt{3} \\times 10 \\times \\sin 30^\\circ"}], "reasons": {"method": "$\\triangle ABD$의 변을 구해 넓이를 계산하고 $\\triangle DBC$에 $\\frac{1}{2}ab\\sin\\theta$를 적용한다."}}, "hold": ""}
```

## Q23

- 형식: 서답형  
- 배점: 6

### 발문

물체를 올려본각 또는 내려본각의 크기를 측정하는 기구를 ‘클리노미터(clinometer)’라고 한다. 그림과 같이 측정자의 눈높이는 \$1.5\\text{ m}\$, 측정자와 나무 사이의 거리는 \$12\\text{ m}\$이고, 빨대와 수직인 실이 이루는 각이 \$60^\\circ\$일 때, 측정자가 측정한 나무의 높이를 구하시오. (6점) (올바른 삼각비를 이용하는 과정 3점, 측정한 나무의 높이를 구하는 과정 3점)

### 선지

없음

### 정답

\$(1.5 \+ 4\\sqrt{3})\\text{ m}\$

### 해설

빨대와 수직인 실이 이루는 각이 \$60^\\circ\$이므로 빨대가 수평선과 이루는 올려본각은 \$90^\\circ \- 60^\\circ \= 30^\\circ\$이다. 눈높이보다 높은 나무의 길이를 \$x\\text{ m}\$라 하면 \$\$x \= 12\\tan 30^\\circ \= 12 \\times \\frac{\\sqrt{3}}{3} \= 4\\sqrt{3}\\text{ m}\$\$ 여기에 측정자의 눈높이 \$1.5\\text{ m}\$를 더하면 나무의 높이는 \$(1.5 \+ 4\\sqrt{3})\\text{ m}\$이다.

```
{"capability": "SOURCE_PLANE_FIGURE_v1", "clinometer": {"eyeHeight": 1.5, "distance": 12, "plumbAngle": 60, "elevationAngle": 30}, "caption": "눈높이 1.5m, 거리 12m, 실과 빨대 각 60°(올려본각 30°)인 클리노미터 나무 높이 측정"}
```

```
{"sourceQid": "23", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO_APPLICATION", "conceptClusterKey": "클리노미터 올려본각과 나무 높이 측정", "primaryMethod": "올려본각 $30^\\circ$를 구해 $12\\tan 30^\\circ = 4\\sqrt{3}$을 계산하고 눈높이 $1.5\\text{ m}$를 더한다.", "decisiveStep": "실과 빨대의 각 $60^\\circ$에서 수평 올려본각 $90^\\circ - 60^\\circ = 30^\\circ$를 찾아내는 단계", "rpm": {"majorUnit": "삼각비", "midUnit": "삼각비의 활용", "l3": "측정 문제", "l4": "앙각·부각"}, "ptTplCandidate": {"problemTypeKey": "PT_TRIG_RATIO_APPLICATION", "templateKey": null, "why": "클리노미터로 잰 각에서 올려본각을 구해 눈높이를 포함한 나무의 높이를 계산한다."}, "crossConceptKeys": ["CC_CLINOMETER_ELEVATION_ANGLE", "CC_ELEVATION_ANGLE"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "추 실과 빨대의 각을 올려본각으로 변환한 뒤 탄젠트와 눈높이를 합산해야 한다.", "level": "상", "item4slot": {"given": [{"term": "거리", "src": "stem", "quote": "나무 사이의 거리는 $12\\text{ m}$"}], "condition": [{"term": "각", "src": "stem", "quote": "실이 이루는 각이 $60^\\circ$"}], "goal": [{"term": "높이", "src": "stem", "quote": "나무의 높이"}], "method": [{"term": "삼각비", "src": "stem", "quote": "삼각비를 이용"}], "reasons": {"method": "올려본각 $30^\\circ$에 $\\tan 30^\\circ$를 적용하고 눈높이 $1.5\\text{ m}$를 더한다."}}, "hold": ""}
```

