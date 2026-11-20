

```
{"stem": "26_팔마중_2학기_중간_중3_유사", "sourceArchiveFile": "original/middle/m3/2mid/26_팔마중_2학기_중간_중3_기출.js", "examFolder": "2mid", "grade": "중3", "curriculum": "2015", "questionCount": 24, "totalScore": 100, "generatedAt": "2026-11-18"}
```

## Q01

- 형식: 객관식  
- 배점: 3

### 발문

다음 직각삼각형 \$\\text{ABC}\$에서 \$\\sin A \\times \\tan B\$의 값은? (3점)

### 선지

① \$\\frac{1}{2}\$ ② \$\\frac{1}{4}\$ ③ \$\\frac{\\sqrt{3}}{4}\$ ④ \$\\frac{\\sqrt{3}}{2}\$ ⑤ \$\\frac{3}{2}\$

### 정답

①

### 해설

그림에서 \$\\angle\\text{C} \= 90^\\circ\$, \$\\overline{\\text{AB}} \= 6\$, \$\\overline{\\text{BC}} \= 3\\sqrt{3}\$이므로 피타고라스 정리에 의해 \$\$\\overline{\\text{AC}} \= \\sqrt{6^2 \- (3\\sqrt{3})^2} \= \\sqrt{36 \- 27} \= 3\$\$ 따라서 \$\\sin A \= \\frac{3\\sqrt{3}}{6} \= \\frac{\\sqrt{3}}{2}\$, \$\\tan B \= \\frac{3}{3\\sqrt{3}} \= \\frac{1}{\\sqrt{3}}\$이므로 \$\$\\sin A \\times \\tan B \= \\frac{\\sqrt{3}}{2} \\times \\frac{1}{\\sqrt{3}} \= \\frac{1}{2}\$\$ 정답은 ①이다.

```
{"capability": "SOURCE_PLANE_FIGURE_v1", "triangle": {"vertices": ["A", "B", "C"], "angleC": 90, "AB": 6, "BC": "3*sqrt(3)"}, "caption": "∠C=90°, AB=6, BC=3√3인 직각삼각형 ABC"}
```

```
{"sourceQid": "1", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO", "conceptClusterKey": "직각삼각형 세 변으로 sin A × tan B 계산", "primaryMethod": "피타고라스 정리로 $\\overline{AC}=3$을 구한 뒤 $\\sin A=\\frac{\\sqrt{3}}{2}, \\tan B=\\frac{1}{\\sqrt{3}}$을 곱한다.", "decisiveStep": "나머지 한 변 $\\overline{AC}=3$을 구해 각 $A$와 각 $B$에 대한 삼각비를 정확히 구분하는 단계", "rpm": {"majorUnit": "삼각비", "midUnit": "삼각비", "l3": "삼각비의 뜻", "l4": "sin·cos·tan"}, "ptTplCandidate": {"problemTypeKey": "PT_TRIG_RATIO", "templateKey": null, "why": "직각삼각형에서 나머지 변을 구해 두 예각의 삼각비 곱을 계산한다."}, "crossConceptKeys": ["CC_TRIG_RATIO_DEFINITIONS"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "피타고라스 정리로 변을 구한 뒤 서로 다른 두 각의 삼각비를 각각 구해 곱해야 한다.", "level": "중", "item4slot": {"given": [{"term": "직각삼각형", "src": "stem", "quote": "직각삼각형 $\\text{ABC}$"}], "condition": [], "goal": [{"term": "삼각비", "src": "solution", "quote": "\\sin A \\times \\tan B = \\frac{\\sqrt{3}}{2} \\times \\frac{1}{\\sqrt{3}} = \\frac{1}{2}"}], "method": [{"term": "직각삼각형", "src": "stem", "quote": "직각삼각형"}], "reasons": {"method": "피타고라스 정리로 $\\overline{AC}=3$을 구해 $\\sin A$와 $\\tan B$를 곱한다."}}, "hold": ""}
```

## Q02

- 형식: 객관식  
- 배점: 3

### 발문

다음 직각삼각형 \$\\text{ABC}\$에서 \$\\sin B \+ \\cos A\$의 값은? (3점)

### 선지

① \$\\frac{\\sqrt{21}}{5}\$ ② \$\\frac{2\\sqrt{21}}{5}\$ ③ \$\\frac{4}{5}\$ ④ \$\\frac{2}{5}\$ ⑤ \$\\frac{6}{5}\$

### 정답

③

### 해설

직각삼각형 \$\\text{ABC}\$에서 \$\\angle\\text{C} \= 90^\\circ\$, \$\\overline{\\text{AB}} \= 5\$, \$\\overline{\\text{BC}} \= \\sqrt{21}\$이므로 피타고라스 정리에 의해 \$\$\\overline{\\text{AC}} \= \\sqrt{5^2 \- (\\sqrt{21})^2} \= \\sqrt{25 \- 21} \= 2\$\$ 따라서 \$\\sin B \= \\frac{2}{5}\$, \$\\cos A \= \\frac{2}{5}\$이므로 \$\\sin B \+ \\cos A \= \\frac{2}{5} \+ \\frac{2}{5} \= \\frac{4}{5}\$이다. 정답은 ③이다.

```
{"capability": "SOURCE_PLANE_FIGURE_v1", "triangle": {"vertices": ["A", "B", "C"], "angleC": 90, "AB": 5, "BC": "sqrt(21)"}, "caption": "∠C=90°, AB=5, BC=√21인 직각삼각형 ABC"}
```

```
{"sourceQid": "2", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO", "conceptClusterKey": "여각 관계 sin B + cos A 계산", "primaryMethod": "피타고라스 정리로 $\\overline{AC}=2$를 구해 $\\sin B=\\cos A=\\frac{2}{5}$를 더한다.", "decisiveStep": "$\\overline{AC}=\\sqrt{25-21}=2$를 구해 $\\sin B$와 $\\cos A$가 모두 $\\frac{2}{5}$임을 계산하는 단계", "rpm": {"majorUnit": "삼각비", "midUnit": "삼각비", "l3": "삼각비의 뜻", "l4": "sin·cos·tan"}, "ptTplCandidate": {"problemTypeKey": "PT_TRIG_RATIO", "templateKey": null, "why": "직각삼각형에서 나머지 변을 구해 $\\sin B + \\cos A$를 계산한다."}, "crossConceptKeys": ["CC_TRIG_RATIO_DEFINITIONS", "CC_COMPLEMENTARY_ANGLE_TRIG"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "무리수 변이 포함된 피타고라스 정리 후 두 삼각비의 합을 구해야 한다.", "level": "중", "item4slot": {"given": [{"term": "직각삼각형", "src": "stem", "quote": "직각삼각형 $\\text{ABC}$"}], "condition": [], "goal": [{"term": "합", "src": "solution", "quote": "\\sin B + \\cos A = \\frac{2}{5} + \\frac{2}{5} = \\frac{4}{5}"}], "method": [{"term": "직각삼각형", "src": "stem", "quote": "직각삼각형"}], "reasons": {"method": "피타고라스 정리로 $\\overline{AC}=2$를 구해 $\\sin B$와 $\\cos A$를 더한다."}}, "hold": ""}
```

## Q03

- 형식: 객관식  
- 배점: 4

### 발문

\$3\\tan A \- \\sqrt{5} \= 0\$일 때, \$\\sin A \\times \\cos A\$의 값은? (단, \$\\angle\\text{A}\$는 예각) (4점)

### 선지

① \$\\frac{\\sqrt{5}}{14}\$ ② \$\\frac{3\\sqrt{5}}{14}\$ ③ \$\\frac{5}{14}\$ ④ \$\\frac{9}{14}\$ ⑤ \$\\frac{3\\sqrt{14}}{14}\$

### 정답

②

### 해설

\$3\\tan A \- \\sqrt{5} \= 0\$에서 \$\\tan A \= \\frac{\\sqrt{5}}{3}\$이다. 밑변의 길이가 \$3\$, 높이의 길이가 \$\\sqrt{5}\$인 직각삼각형을 그리면 빗변의 길이는 \$\\sqrt{3^2 \+ (\\sqrt{5})^2} \= \\sqrt{14}\$이다. 따라서 \$\\sin A \= \\frac{\\sqrt{5}}{\\sqrt{14}}\$, \$\\cos A \= \\frac{3}{\\sqrt{14}}\$이므로 \$\$\\sin A \\times \\cos A \= \\frac{\\sqrt{5}}{\\sqrt{14}} \\times \\frac{3}{\\sqrt{14}} \= \\frac{3\\sqrt{5}}{14}\$\$ 정답은 ②이다.

```
"NONE"
```

```
{"sourceQid": "3", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO", "conceptClusterKey": "탄젠트 값으로 직각삼각형을 그려 sin×cos 구하기", "primaryMethod": "$\\tan A=\\frac{\\sqrt{5}}{3}$에 대응하는 직각삼각형의 빗변 $\\sqrt{14}$를 구해 $\\sin A\\cos A$를 계산한다.", "decisiveStep": "밑변 $3$, 높이 $\\sqrt{5}$로 빗변 $\\sqrt{14}$를 구해 $\\sin A$와 $\\cos A$를 얻는 단계", "rpm": {"majorUnit": "삼각비", "midUnit": "삼각비", "l3": "삼각비의 뜻", "l4": "삼각비의 관계"}, "ptTplCandidate": {"problemTypeKey": "PT_TRIG_RATIO", "templateKey": null, "why": "주어진 $\\tan A$ 값으로부터 직각삼각형을 작도해 $\\sin A \\times \\cos A$를 구한다."}, "crossConceptKeys": ["CC_TRIG_RATIO_DEFINITIONS"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "한 삼각비에서 직각삼각형을 세워 나머지 두 삼각비를 구해 곱해야 한다.", "level": "상", "item4slot": {"given": [{"term": "삼각비", "src": "solution", "quote": "\\tan A = \\frac{\\sqrt{5}}{3}"}], "condition": [{"term": "예각", "src": "stem", "quote": "\\angle\\text{A}$는 예각"}], "goal": [{"term": "곱", "src": "solution", "quote": "\\sin A \\times \\cos A"}], "method": [{"term": "직각삼각형", "src": "solution", "quote": "직각삼각형"}], "reasons": {"method": "$\\tan A$로 직각삼각형의 빗변 $\\sqrt{14}$를 구해 $\\sin A, \\cos A$를 곱한다."}}, "hold": ""}
```

## Q04

- 형식: 객관식  
- 배점: 4

### 발문

\$\\tan x \= \\frac{\\sqrt{3}}{3}\$이고 \$\\sin y \= \\frac{\\sqrt{3}}{2}\$일 때, \$\\sin(x \+ y)\$의 값은? (단, \$0^\\circ \\le x \\le 90^\\circ\$, \$0^\\circ \\le y \\le 90^\\circ\$) (4점)

### 선지

① \$0\$ ② \$\\frac{1}{2}\$ ③ \$\\frac{\\sqrt{2}}{2}\$ ④ \$\\frac{\\sqrt{3}}{2}\$ ⑤ \$1\$

### 정답

⑤

### 해설

\$0^\\circ \\le x, y \\le 90^\\circ\$에서 \$\\tan x \= \\frac{\\sqrt{3}}{3}\$이므로 \$x \= 30^\\circ\$이고, \$\\sin y \= \\frac{\\sqrt{3}}{2}\$이므로 \$y \= 60^\\circ\$이다. 따라서 \$\\sin(x \+ y) \= \\sin(30^\\circ \+ 60^\\circ) \= \\sin 90^\\circ \= 1\$이다. 정답은 ⑤이다.

```
"NONE"
```

```
{"sourceQid": "4", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO", "conceptClusterKey": "특수각 역추적 후 sin(x+y) 계산", "primaryMethod": "$\\tan x=\\frac{\\sqrt{3}}{3}$에서 $x=30^\\circ$, $\\sin y=\\frac{\\sqrt{3}}{2}$에서 $y=60^\\circ$를 구해 $\\sin 90^\\circ=1$을 계산한다.", "decisiveStep": "각 삼각비 값에 대응하는 특수각 $30^\\circ, 60^\\circ$를 찾아 $\\sin 90^\\circ = 1$을 구하는 단계", "rpm": {"majorUnit": "삼각비", "midUnit": "삼각비", "l3": "특수각의 삼각비", "l4": "특수각 계산"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "특수각 삼각비 값에서 각의 크기를 구한 뒤 합의 사인 값을 계산한다."}, "crossConceptKeys": ["CC_SPECIAL_ANGLES", "CC_TRIG_TABLE_LOOKUP"], "conditionKeys": ["COND_RANGE"], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "삼각비에서 두 특수각을 역으로 구해 $\\sin 90^\\circ$ 값까지 계산해야 한다.", "level": "중", "item4slot": {"given": [{"term": "삼각비", "src": "stem", "quote": "\\tan x = \\frac{\\sqrt{3}}{3}"}], "condition": [], "goal": [{"term": "값", "src": "stem", "quote": "\\sin(x + y)$의 값"}], "method": [{"term": "대입", "src": "solution", "quote": "\\sin(30^\\circ + 60^\\circ) = \\sin 90^\\circ = 1"}], "reasons": {"method": "특수각 표에서 $x=30^\\circ, y=60^\\circ$를 구해 $\\sin(x+y)$에 대입한다."}}, "hold": ""}
```

## Q05

- 형식: 객관식  
- 배점: 4

### 발문

세 내각의 크기의 비가 \$3 : 4 : 5\$인 삼각형의 가장 작은 내각의 크기를 \$A\$라고 할 때, \$\\sin A : \\cos A : \\tan A\$의 값은? (4점)

### 선지

① \$1 : \\sqrt{2} : 1\$ ② \$\\sqrt{2} : 1 : 1\$ ③ \$\\sqrt{2} : \\sqrt{2} : 1\$ ④ \$1 : 1 : \\sqrt{2}\$ ⑤ \$1 : 2 : \\sqrt{2}\$

### 정답

④

### 해설

삼각형의 세 내각의 합은 \$180^\\circ\$이므로 가장 작은 내각의 크기는 \$\$A \= 180^\\circ \\times \\frac{3}{3 \+ 4 \+ 5} \= 180^\\circ \\times \\frac{3}{12} \= 45^\\circ\$\$ \$\\sin 45^\\circ \= \\frac{\\sqrt{2}}{2}\$, \$\\cos 45^\\circ \= \\frac{\\sqrt{2}}{2}\$, \$\\tan 45^\\circ \= 1\$이므로 \$\$\\sin A : \\cos A : \\tan A \= \\frac{\\sqrt{2}}{2} : \\frac{\\sqrt{2}}{2} : 1 \= 1 : 1 : \\sqrt{2}\$\$ 따라서 정답은 ④이다.

```
"NONE"
```

```
{"sourceQid": "5", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO", "conceptClusterKey": "삼각형 내각 비와 특수각 삼각비의 연비", "primaryMethod": "비례배분으로 $A=45^\\circ$를 구한 뒤 $\\frac{\\sqrt{2}}{2}:\\frac{\\sqrt{2}}{2}:1$을 가장 간단한 정수비 $1:1:\\sqrt{2}$로 나타낸다.", "decisiveStep": "$\\frac{\\sqrt{2}}{2} : \\frac{\\sqrt{2}}{2} : 1$에 $\\sqrt{2}$를 곱해 $1 : 1 : \\sqrt{2}$로 정리하는 단계", "rpm": {"majorUnit": "삼각비", "midUnit": "삼각비", "l3": "특수각의 삼각비", "l4": "특수각 계산"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "내각의 비로 특수각을 구하고 세 삼각비의 연비를 간단히 한다."}, "crossConceptKeys": ["CC_SPECIAL_ANGLES", "CC_RATIO"], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "내각 비례배분, 특수각 삼각비 대입, 무리수 연비 약분까지 이어진다.", "level": "상", "item4slot": {"given": [{"term": "삼각형", "src": "stem", "quote": "삼각형의 가장 작은 내각"}], "condition": [{"term": "비", "src": "stem", "quote": "크기의 비가 $3 : 4 : 5$"}], "goal": [{"term": "비", "src": "solution", "quote": "1 : 1 : \\sqrt{2}"}], "method": [{"term": "비", "src": "solution", "quote": "\\frac{\\sqrt{2}}{2} : \\frac{\\sqrt{2}}{2} : 1"}], "reasons": {"method": "비례배분으로 $A=45^\\circ$를 구한 뒤 세 삼각비의 비를 간단히 한다."}}, "hold": ""}
```

## Q06

- 형식: 객관식  
- 배점: 4

### 발문

다음 그림과 같이 점 \$\\text{O}\$를 중심으로 하고 반지름의 길이가 \$1\$인 사분원에서 \$\\sin 38^\\circ \- \\cos 52^\\circ \+ \\tan 38^\\circ\$의 값은? (4점)

### 선지

① \$0.78\$ ② \$0.62\$ ③ \$0.79\$ ④ \$0.16\$ ⑤ \$1.40\$

### 정답

①

### 해설

\$\\sin 38^\\circ \= \\cos(90^\\circ \- 38^\\circ) \= \\cos 52^\\circ\$이므로 \$\\sin 38^\\circ \- \\cos 52^\\circ \= 0\$이다. 따라서 준식은 \$\\tan 38^\\circ\$이고, 그림에서 \$\\tan 38^\\circ \= 0.78\$이다. 정답은 ①이다.

```
{"capability": "SOURCE_PLANE_FIGURE_v1", "quarterCircle": {"radius": 1, "angle": 38, "sinVal": 0.62, "cosVal": 0.79, "tanVal": 0.78}, "caption": "반지름 1인 사분원에서 38°에 대한 sin 38°=0.62, cos 38°=0.79, tan 38°=0.78"}
```

```
{"sourceQid": "6", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO", "conceptClusterKey": "사분원 삼각비와 여각 관계 상쇄", "primaryMethod": "$\\sin 38^\\circ = \\cos 52^\\circ$로 두 항을 소거하고 사분원에서 $\\tan 38^\\circ = 0.78$을 읽는다.", "decisiveStep": "$38^\\circ + 52^\\circ = 90^\\circ$이므로 $\\sin 38^\\circ - \\cos 52^\\circ = 0$임을 파악하는 단계", "rpm": {"majorUnit": "삼각비", "midUnit": "삼각비", "l3": "삼각비의 뜻", "l4": "sin·cos·tan"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "단위 사분원에서 여각 성질로 식을 단순화하고 $\\tan$ 값을 읽는다."}, "crossConceptKeys": ["CC_UNIT_QUARTER_CIRCLE", "CC_COMPLEMENTARY_ANGLE_TRIG"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "여각 관계 $\\sin 38^\\circ = \\cos 52^\\circ$를 이용해 소거하고 사분원에서 $\\tan 38^\\circ$를 읽어야 한다.", "level": "중", "item4slot": {"given": [{"term": "사분원", "src": "stem", "quote": "반지름의 길이가 $1$인 사분원"}], "condition": [], "goal": [{"term": "값", "src": "stem", "quote": "\\sin 38^\\circ - \\cos 52^\\circ + \\tan 38^\\circ$의 값"}], "method": [{"term": "삼각비", "src": "solution", "quote": "\\sin 38^\\circ = \\cos(90^\\circ - 38^\\circ) = \\cos 52^\\circ"}], "reasons": {"method": "여각 관계로 $\\sin 38^\\circ - \\cos 52^\\circ = 0$을 소거한 뒤 $\\tan 38^\\circ$를 읽는다."}}, "hold": ""}
```

## Q07

- 형식: 객관식  
- 배점: 4

### 발문

다음 그림과 같이 학생이 나무로부터 \$15\\text{ m}\$ 떨어진 지점 \$\\text{A}\$에서 나무의 꼭대기 \$\\text{B}\$를 올려본 각의 크기가 \$28^\\circ\$이다. 이 학생의 눈높이가 \$1.5\\text{ m}\$일 때, 이 나무의 높이는? (단, \$\\sin 28^\\circ \= 0.470\$, \$\\cos 28^\\circ \= 0.883\$, \$\\tan 28^\\circ \= 0.532\$로 계산한다.) (4점)

### 선지

① \$7.05\\text{ m}\$ ② \$7.98\\text{ m}\$ ③ \$8.55\\text{ m}\$ ④ \$13.25\\text{ m}\$ ⑤ \$9.48\\text{ m}\$

### 정답

⑤

### 해설

눈높이 위의 나무 높이는 \$15\\tan 28^\\circ \= 15 \\times 0.532 \= 7.98\\text{ m}\$이다. 학생의 눈높이 \$1.5\\text{ m}\$를 더하면 나무의 전체 높이는 \$\$7.98 \+ 1.5 \= 9.48\\text{ m}\$\$ 따라서 정답은 ⑤이다.

```
{"capability": "SOURCE_PLANE_FIGURE_v1", "measurement": {"distance": 15, "eyeHeight": 1.5, "elevationAngle": 28}, "caption": "나무로부터 15m 거리, 눈높이 1.5m에서 올려본 각이 28°인 나무 높이 측정"}
```

```
{"sourceQid": "7", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO_APPLICATION", "conceptClusterKey": "올려본각과 눈높이를 포함한 나무 높이 측정", "primaryMethod": "$15\\tan 28^\\circ = 7.98$을 계산한 뒤 눈높이 $1.5\\text{ m}$를 더해 $9.48\\text{ m}$를 구한다.", "decisiveStep": "눈높이 위 높이 $7.98\\text{ m}$에 눈높이 $1.5\\text{ m}$를 빠뜨리지 않고 더하는 단계", "rpm": {"majorUnit": "삼각비", "midUnit": "삼각비의 활용", "l3": "측정 문제", "l4": "앙각·부각"}, "ptTplCandidate": {"problemTypeKey": "PT_TRIG_RATIO_APPLICATION", "templateKey": null, "why": "수평 거리와 올려본 각의 탄젠트 값으로 높이를 구해 눈높이를 더한다."}, "crossConceptKeys": ["CC_ELEVATION_ANGLE", "CC_TRIG_TABLE_LOOKUP"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "세 삼각비 중 $\\tan 28^\\circ$를 선택해 곱하고 눈높이를 합산해야 한다.", "level": "중", "item4slot": {"given": [{"term": "삼각비", "src": "stem", "quote": "\\tan 28^\\circ = 0.532"}], "condition": [], "goal": [{"term": "높이", "src": "stem", "quote": "나무의 높이"}], "method": [{"term": "합", "src": "solution", "quote": "7.98 + 1.5 = 9.48"}], "reasons": {"method": "$15\\tan 28^\\circ$를 계산한 뒤 학생의 눈높이 $1.5\\text{ m}$를 더한다."}}, "hold": ""}
```

## Q08

- 형식: 객관식  
- 배점: 4

### 발문

다음 그림과 같이 \$\\overline{\\text{AC}} \= 8\$, \$\\overline{\\text{BC}} \= 5\\sqrt{2}\$, \$\\angle\\text{ACB} \= 45^\\circ\$인 삼각형 \$\\text{ABC}\$에서 \$\\overline{\\text{AB}}\$의 길이는? (4점)

### 선지

① \$4\\sqrt{2}\$ ② \$\\sqrt{34}\$ ③ \$6\$ ④ \$\\sqrt{38}\$ ⑤ \$2\\sqrt{10}\$

### 정답

②

### 해설

점 \$\\text{A}\$에서 \$\\overline{\\text{BC}}\$에 내린 수선의 발을 \$\\text{H}\$라 하면 \$\$\\overline{\\text{CH}} \= 8\\cos 45^\\circ \= 4\\sqrt{2},\\quad \\overline{\\text{AH}} \= 8\\sin 45^\\circ \= 4\\sqrt{2}\$\$ \$\$\\overline{\\text{BH}} \= 5\\sqrt{2} \- 4\\sqrt{2} \= \\sqrt{2}\$\$ 직각삼각형 \$\\text{ABH}\$에서 피타고라스 정리에 의해 \$\$\\overline{\\text{AB}} \= \\sqrt{(4\\sqrt{2})^2 \+ (\\sqrt{2})^2} \= \\sqrt{32 \+ 2} \= \\sqrt{34}\$\$ 따라서 정답은 ②이다.

```
{"capability": "SOURCE_PLANE_FIGURE_v1", "triangle": {"vertices": ["A", "B", "C"], "AC": 8, "BC": "5*sqrt(2)", "angleC": 45}, "caption": "AC=8, BC=5√2, ∠ACB=45°인 삼각형 ABC에서 AB의 길이"}
```

```
{"sourceQid": "8", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO_APPLICATION", "conceptClusterKey": "두 변과 끼인각 45°에서 대변 길이 구하기", "primaryMethod": "수선 $\\text{AH}$를 내려 $\\overline{CH}=\\overline{AH}=4\\sqrt{2}, \\overline{BH}=\\sqrt{2}$를 구해 $\\overline{AB}=\\sqrt{34}$를 계산한다.", "decisiveStep": "보조선 $\\text{AH}$로 $\\triangle ABH$의 두 직각변을 구해 피타고라스 정리를 적용하는 단계", "rpm": {"majorUnit": "삼각비", "midUnit": "삼각비", "l3": "삼각비와 길이", "l4": "직각삼각형의 변"}, "ptTplCandidate": {"problemTypeKey": "PT_TRIG_RATIO_APPLICATION", "templateKey": null, "why": "두 변과 끼인각 $45^\\circ$가 주어진 삼각형에서 수선을 내려 나머지 변 길이를 구한다."}, "crossConceptKeys": ["CC_AUXILIARY_ALTITUDE", "CC_SPECIAL_ANGLES"], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "수선 작도, $45^\\circ$ 삼각비, 피타고라스 정리를 순차적으로 적용해야 한다.", "level": "상", "item4slot": {"given": [{"term": "삼각형", "src": "stem", "quote": "삼각형 $\\text{ABC}$"}], "condition": [], "goal": [{"term": "길이", "src": "stem", "quote": "$\\overline{\\text{AB}}$의 길이"}], "method": [{"term": "직각삼각형", "src": "solution", "quote": "직각삼각형 $\\text{ABH}$"}], "reasons": {"method": "수선 $\\text{AH}$를 그어 직각삼각형 $\\text{ABH}$에 피타고라스 정리를 적용한다."}}, "hold": ""}
```

## Q09

- 형식: 객관식  
- 배점: 4

### 발문

다음 그림과 같이 \$\\overline{\\text{AB}} \= 8\\text{ cm}\$, \$\\overline{\\text{AC}} \= 10\\text{ cm}\$인 삼각형 \$\\text{ABC}\$의 넓이가 \$20\\sqrt{2}\\text{ cm}^2\$일 때, \$\\angle\\text{A}\$의 크기는? (단, \$\\angle\\text{A}\$는 둔각) (4점)

### 선지

① \$105^\\circ\$ ② \$120^\\circ\$ ③ \$125^\\circ\$ ④ \$135^\\circ\$ ⑤ \$150^\\circ\$

### 정답

④

### 해설

둔각삼각형의 넓이 공식에 의해 \$\$20\\sqrt{2} \= \\frac{1}{2} \\cdot 8 \\cdot 10 \\cdot \\sin(180^\\circ \- A) \= 40\\sin(180^\\circ \- A)\$\$ \$\$\\sin(180^\\circ \- A) \= \\frac{20\\sqrt{2}}{40} \= \\frac{\\sqrt{2}}{2}\$\$ \$180^\\circ \- A \= 45^\\circ\$이므로 \$\\angle\\text{A} \= 180^\\circ \- 45^\\circ \= 135^\\circ\$이다. 정답은 ④이다.

```
{"capability": "SOURCE_PLANE_FIGURE_v1", "triangle": {"vertices": ["A", "B", "C"], "AB": 8, "AC": 10, "obtuseAngle": "A"}, "caption": "AB=8cm, AC=10cm이고 ∠A가 둔각인 삼각형 ABC"}
```

```
{"sourceQid": "9", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO_APPLICATION", "conceptClusterKey": "둔각삼각형 넓이에서 둔각 크기 역산", "primaryMethod": "$\\frac{1}{2}\\cdot 8\\cdot 10\\sin(180^\\circ-A)=20\\sqrt{2}$에서 $180^\\circ-A=45^\\circ$를 구해 $A=135^\\circ$를 찾는다.", "decisiveStep": "둔각 조건에서 $\\sin(180^\\circ-A)=\\frac{\\sqrt{2}}{2}$로부터 $A=135^\\circ$를 구하는 단계", "rpm": {"majorUnit": "삼각비", "midUnit": "삼각비의 활용", "l3": "평면도형", "l4": "삼각형의 높이·넓이"}, "ptTplCandidate": {"problemTypeKey": "PT_TRIG_RATIO_APPLICATION", "templateKey": null, "why": "두 변과 넓이가 주어진 둔각삼각형에서 둔각의 크기를 구한다."}, "crossConceptKeys": ["CC_TRIANGLE_AREA_TRIG", "CC_OBLIQUE_TRIANGLE_MEASURE"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "넓이 공식으로 $\\sin(180^\\circ-A)$를 구한 뒤 둔각 $135^\\circ$로 변환해야 한다.", "level": "상", "item4slot": {"given": [{"term": "삼각형", "src": "stem", "quote": "삼각형 $\\text{ABC}$"}], "condition": [{"term": "넓이", "src": "stem", "quote": "넓이가 $20\\sqrt{2}\\text{ cm}^2$"}], "goal": [{"term": "각", "src": "stem", "quote": "\\angle\\text{A}$의 크기"}], "method": [{"term": "삼각비", "src": "solution", "quote": "\\sin(180^\\circ - A)"}], "reasons": {"method": "둔각삼각형 넓이 공식으로 $180^\\circ-A=45^\\circ$를 구해 $A$를 계산한다."}}, "hold": ""}
```

## Q10

- 형식: 객관식  
- 배점: 4

### 발문

다음 그림과 같이 \$\\angle\\text{B} \= 90^\\circ\$, \$\\angle\\text{A} \= 30^\\circ\$, \$\\overline{\\text{AC}} \= 16\$인 직각삼각형 \$\\text{ABC}\$에서 \$\\overline{\\text{AC}} \\perp \\overline{\\text{BD}}\$, \$\\overline{\\text{AB}} \\perp \\overline{\\text{DE}}\$일 때, 삼각형 \$\\text{ABD}\$의 넓이는? (4점)

### 선지

① \$12\\sqrt{3}\$ ② \$16\\sqrt{3}\$ ③ \$24\\sqrt{3}\$ ④ \$32\\sqrt{3}\$ ⑤ \$48\\sqrt{3}\$

### 정답

③

### 해설

직각삼각형 \$\\text{ABC}\$에서 \$\\overline{\\text{AC}} \= 16\$, \$\\angle\\text{A} \= 30^\\circ\$이므로 \$\$\\overline{\\text{AB}} \= 16\\cos 30^\\circ \= 8\\sqrt{3}\$\$ \$\\overline{\\text{BD}} \\perp \\overline{\\text{AC}}\$이므로 직각삼각형 \$\\text{ABD}\$에서 \$\$\\overline{\\text{BD}} \= \\overline{\\text{AB}}\\sin 30^\\circ \= 8\\sqrt{3} \\times \\frac{1}{2} \= 4\\sqrt{3},\\quad \\overline{\\text{AD}} \= \\overline{\\text{AB}}\\cos 30^\\circ \= 8\\sqrt{3} \\times \\frac{\\sqrt{3}}{2} \= 12\$\$ 따라서 \$\\triangle\\text{ABD} \= \\frac{1}{2} \\times 12 \\times 4\\sqrt{3} \= 24\\sqrt{3}\$이다. 정답은 ③이다.

```
{"capability": "SOURCE_PLANE_FIGURE_v1", "triangle": {"vertices": ["A", "B", "C"], "angleB": 90, "angleA": 30, "AC": 16}, "altitudes": ["BD_to_AC", "DE_to_AB"], "caption": "∠B=90°, ∠A=30°, AC=16인 △ABC에서 BD⊥AC, DE⊥AB"}
```

```
{"sourceQid": "10", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO_APPLICATION", "conceptClusterKey": "특수각 직각삼각형의 수선과 부분 삼각형 넓이", "primaryMethod": "$\\overline{AB}=8\\sqrt{3}$을 구한 뒤 $\\triangle ABD$에서 $\\overline{BD}=4\\sqrt{3}, \\overline{AD}=12$를 구해 넓이를 계산한다.", "decisiveStep": "큰 직각삼각형에서 $\\overline{AB}$를 먼저 구한 뒤 $\\triangle ABD$에 다시 $30^\\circ$ 삼각비를 적용하는 단계", "rpm": {"majorUnit": "삼각비", "midUnit": "삼각비의 활용", "l3": "복합도형", "l4": "보조선 활용"}, "ptTplCandidate": {"problemTypeKey": "PT_TRIG_RATIO_APPLICATION", "templateKey": null, "why": "특수각 직각삼각형에 내린 수선으로 생긴 부분 직각삼각형의 넓이를 구한다."}, "crossConceptKeys": ["CC_SPECIAL_ANGLES", "CC_TRIANGLE_AREA_TRIG"], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "직각삼각형을 두 번 연속으로 풀어 변의 길이를 구한 뒤 넓이를 계산해야 한다.", "level": "상", "item4slot": {"given": [{"term": "직각삼각형", "src": "stem", "quote": "직각삼각형 $\\text{ABC}$"}], "condition": [], "goal": [{"term": "넓이", "src": "stem", "quote": "삼각형 $\\text{ABD}$의 넓이"}], "method": [{"term": "삼각비", "src": "solution", "quote": "16\\cos 30^\\circ = 8\\sqrt{3}"}], "reasons": {"method": "$30^\\circ$ 삼각비를 두 번 적용해 $\\triangle ABD$의 두 직각변을 구해 넓이를 계산한다."}}, "hold": ""}
```

## Q11

- 형식: 객관식  
- 배점: 4

### 발문

사각형 \$\\text{ABCD}\$의 두 대각선 \$\\text{AC}\$, \$\\text{BD}\$의 길이가 각각 \$12\\text{ cm}\$, \$8\\text{ cm}\$이고, 두 대각선이 이루는 예각의 크기가 \$45^\\circ\$일 때, 사각형 \$\\text{ABCD}\$의 넓이는? (4점)

### 선지

① \$24\\sqrt{2}\\text{ cm}^2\$ ② \$24\\text{ cm}^2\$ ③ \$48\\text{ cm}^2\$ ④ \$48\\sqrt{2}\\text{ cm}^2\$ ⑤ \$24\\sqrt{3}\\text{ cm}^2\$

### 정답

①

### 해설

두 대각선의 길이가 \$12\\text{ cm}\$, \$8\\text{ cm}\$이고 끼인 예각이 \$45^\\circ\$이므로 사각형 \$\\text{ABCD}\$의 넓이는 \$\$\\frac{1}{2} \\times 12 \\times 8 \\times \\sin 45^\\circ \= 48 \\times \\frac{\\sqrt{2}}{2} \= 24\\sqrt{2}\\text{ cm}^2\$\$ 따라서 정답은 ①이다.

```
"NONE"
```

```
{"sourceQid": "11", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO_APPLICATION", "conceptClusterKey": "두 대각선과 끼인각으로 사각형 넓이 구하기", "primaryMethod": "사각형 넓이 공식 $\\frac{1}{2} \\times 12 \\times 8 \\times \\sin 45^\\circ = 24\\sqrt{2}$를 적용한다.", "decisiveStep": "사각형 대각선 넓이 공식에 $\\frac{1}{2}$을 곱해 $24\\sqrt{2}$를 얻는 단계", "rpm": {"majorUnit": "삼각비", "midUnit": "삼각비의 활용", "l3": "평면도형", "l4": "다각형의 길이·넓이"}, "ptTplCandidate": {"problemTypeKey": "PT_TRIG_RATIO_APPLICATION", "templateKey": null, "why": "두 대각선 길이와 끼인각으로 일반 사각형의 넓이를 구한다."}, "crossConceptKeys": ["CC_QUADRILATERAL_AREA_TRIG", "CC_SPECIAL_ANGLES"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 대각선과 끼인각의 넓이 공식에 바로 대입하면 된다.", "level": "중", "item4slot": {"given": [{"term": "대각선", "src": "stem", "quote": "두 대각선 $\\text{AC}$, $\\text{BD}$"}], "condition": [{"term": "예각", "src": "stem", "quote": "예각의 크기가 $45^\\circ$"}], "goal": [{"term": "넓이", "src": "stem", "quote": "사각형 $\\text{ABCD}$의 넓이"}], "method": [{"term": "삼각비", "src": "solution", "quote": "\\frac{1}{2} \\times 12 \\times 8 \\times \\sin 45^\\circ"}], "reasons": {"method": "사각형 두 대각선 넓이 공식 $\\frac{1}{2}ab\\sin\\theta$를 적용한다."}}, "hold": ""}
```

## Q12

- 형식: 객관식  
- 배점: 5

### 발문

다음 직사각형 \$\\text{ABCD}\$에서 대각선 \$\\text{AC}\$에 꼭짓점 \$\\text{D}\$에서 내린 수선의 발을 \$\\text{E}\$라 하자. \$\\overline{\\text{AE}} \= 9\$, \$\\overline{\\text{EC}} \= 4\$이고 \$\\angle\\text{ACB} \= x^\\circ\$일 때, \$\\cos x^\\circ\$의 값은? (5점)

### 선지

① \$\\frac{2\\sqrt{13}}{13}\$ ② \$\\frac{3\\sqrt{13}}{13}\$ ③ \$\\frac{4\\sqrt{13}}{13}\$ ④ \$\\frac{9}{13}\$ ⑤ \$\\frac{3}{13}\$

### 정답

②

### 해설

\$\\overline{\\text{AC}} \= 9 \+ 4 \= 13\$이다. 직각삼각형 \$\\text{ADC}\$에서 \$\\overline{\\text{DE}} \\perp \\overline{\\text{AC}}\$이므로 직각삼각형의 닮음에 의해 \$\$\\overline{\\text{AD}}^2 \= \\overline{\\text{AE}} \\cdot \\overline{\\text{AC}} \= 9 \\times 13 \\implies \\overline{\\text{AD}} \= 3\\sqrt{13}\$\$ 직사각형에서 \$\\overline{\\text{BC}} \= \\overline{\\text{AD}} \= 3\\sqrt{13}\$이므로 직각삼각형 \$\\text{ABC}\$에서 \$\$\\cos x^\\circ \= \\frac{\\overline{\\text{BC}}}{\\overline{\\text{AC}}} \= \\frac{3\\sqrt{13}}{13}\$\$ 따라서 정답은 ②이다.

```
{"capability": "SOURCE_PLANE_FIGURE_v1", "rectangle": {"vertices": ["A", "B", "C", "D"]}, "diagonal": "AC", "perpendicular": {"from": "D", "to": "E_on_AC", "AE": 9, "EC": 4}, "angleACB": "x", "caption": "직사각형 ABCD에서 DE⊥AC이고 AE=9, EC=4, ∠ACB=x°"}
```

```
{"sourceQid": "12", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO_APPLICATION", "conceptClusterKey": "직사각형 대각선 수선 닮음과 cos x", "primaryMethod": "직각삼각형 닮음으로 $\\overline{AD}=\\sqrt{9\\times 13}=3\\sqrt{13}$을 구해 $\\cos x^\\circ=\\frac{3\\sqrt{13}}{13}$을 구한다.", "decisiveStep": "$\\overline{AD}^2 = \\overline{AE} \\cdot \\overline{AC}$ 정리를 이용해 $\\overline{BC}=3\\sqrt{13}$을 구하는 단계", "rpm": {"majorUnit": "삼각비", "midUnit": "삼각비의 활용", "l3": "복합도형", "l4": "피타고라스 결합"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "직사각형 대각선에 내린 수선 분할 길이로 직각삼각형 닮음을 적용해 삼각비를 구한다."}, "crossConceptKeys": ["CC_TRIANGLE_SIMILARITY", "CC_TRIG_RATIO_DEFINITIONS"], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "직각삼각형의 닮음 정리($AD^2=AE\\cdot AC$)와 직사각형 대변 같음을 연결해야 한다.", "level": "상", "item4slot": {"given": [{"term": "직사각형", "src": "stem", "quote": "직사각형 $\\text{ABCD}$"}], "condition": [{"term": "수선", "src": "stem", "quote": "수선의 발을 $\\text{E}$"}], "goal": [{"term": "삼각비", "src": "solution", "quote": "\\cos x^\\circ = \\frac{\\overline{\\text{BC}}}{\\overline{\\text{AC}}} = \\frac{3\\sqrt{13}}{13}"}], "method": [{"term": "닮음", "src": "solution", "quote": "직각삼각형의 닮음"}], "reasons": {"method": "직각삼각형 $\\text{ADC}$의 닮음으로 $\\overline{AD}=\\overline{BC}$를 구해 $\\cos x^\\circ$를 계산한다."}}, "hold": ""}
```

## Q13

- 형식: 객관식  
- 배점: 5

### 발문

다음 그림과 같이 폭이 \$6\\text{ cm}\$인 종이를 선분 \$\\text{AC}\$를 접는 선으로 하여 접었다. \$\\angle\\text{ABC} \= 45^\\circ\$일 때, 삼각형 \$\\text{ABC}\$의 넓이는? (5점)

### 선지

① \$9\\text{ cm}^2\$ ② \$18\\text{ cm}^2\$ ③ \$9\\sqrt{2}\\text{ cm}^2\$ ④ \$18\\sqrt{2}\\text{ cm}^2\$ ⑤ \$36\\sqrt{2}\\text{ cm}^2\$

### 정답

④

### 해설

종이의 양쪽 가장자리가 평행하므로 엇각과 접은 각의 크기가 같아 \$\\triangle\\text{ABC}\$는 \$\\overline{\\text{AB}} \= \\overline{\\text{BC}}\$인 이등변삼각형이다. 점 \$\\text{C}\$에서 \$\\overline{\\text{AB}}\$의 연장선에 내린 수선의 길이(종이의 폭)가 \$6\\text{ cm}\$이고 \$\\angle\\text{ABC} \= 45^\\circ\$이므로 \$\$\\overline{\\text{BC}} \= \\frac{6}{\\sin 45^\\circ} \= 6\\sqrt{2}\\text{ cm}\$\$ 따라서 \$\\overline{\\text{AB}} \= 6\\sqrt{2}\\text{ cm}\$이므로 \$\\triangle\\text{ABC}\$의 넓이는 \$\$\\frac{1}{2} \\times 6\\sqrt{2} \\times 6 \= 18\\sqrt{2}\\text{ cm}^2\$\$ 정답은 ④이다.

```
{"capability": "SOURCE_PLANE_FIGURE_v1", "strip": {"width": 6}, "fold": {"crease": "AC", "triangle": ["A", "B", "C"], "angleABC": 45}, "caption": "폭 6cm인 종이를 AC로 접었을 때 ∠ABC=45°인 삼각형 ABC"}
```

```
{"sourceQid": "13", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO_APPLICATION", "conceptClusterKey": "종이띠 접기 이등변삼각형과 삼각비 넓이", "primaryMethod": "$\\overline{AB}=\\overline{BC}=\\frac{6}{\\sin 45^\\circ}=6\\sqrt{2}$를 구해 높이 $6$으로 넓이 $18\\sqrt{2}$를 계산한다.", "decisiveStep": "엇각과 접은 각으로 $\\triangle ABC$가 이등변삼각형임을 파악하고 폭 $6$으로 $\\overline{BC}$를 구하는 단계", "rpm": {"majorUnit": "삼각비", "midUnit": "삼각비의 활용", "l3": "평면도형", "l4": "삼각형의 높이·넓이"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "일정한 폭의 종이를 접어 생긴 이등변삼각형의 넓이를 삼각비로 구한다."}, "crossConceptKeys": ["CC_PAPER_FOLDING_SIMILARITY", "CC_SPECIAL_ANGLES"], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "접은 각·엇각에 의한 이등변삼각형 성질과 폭을 높이로 쓰는 삼각비 계산을 결합해야 한다.", "level": "상", "item4slot": {"given": [{"term": "삼각형", "src": "stem", "quote": "삼각형 $\\text{ABC}$"}], "condition": [], "goal": [{"term": "넓이", "src": "stem", "quote": "삼각형 $\\text{ABC}$의 넓이"}], "method": [{"term": "이등변삼각형", "src": "solution", "quote": "이등변삼각형"}], "reasons": {"method": "이등변삼각형 성질과 $\\sin 45^\\circ$로 밑변 $\\overline{AB}=6\\sqrt{2}$를 구해 넓이를 계산한다."}}, "hold": ""}
```

## Q14

- 형식: 객관식  
- 배점: 3

### 발문

다음 두 그림에서 \$x \+ y\$의 값은? (단, 왼쪽 원에서 중심에서 두 현까지의 거리는 같고, 오른쪽 원에서 \$\\overline{\\text{PA}}, \\overline{\\text{PB}}\$는 접선이다.) (3점)

### 선지

① \$19\$ ② \$21\$ ③ \$27\$ ④ \$25\$ ⑤ \$29\$

### 정답

③

### 해설

왼쪽 원에서 중심으로부터 같은 거리에 있는 두 현의 길이는 같고 수선은 현을 이등분하므로 \$\$x \= 2 \\times 7 \= 14\$\$ 오른쪽 원에서 \$\\overline{\\text{OA}} \\perp \\overline{\\text{PA}}\$이고 \$\\overline{\\text{OA}} \= 5\$, \$\\overline{\\text{PA}} \= 12\$이므로 피타고라스 정리에 의해 \$\$y \= \\overline{\\text{PO}} \= \\sqrt{5^2 \+ 12^2} \= \\sqrt{25 \+ 144} \= 13\$\$ 따라서 \$x \+ y \= 14 \+ 13 \= 27\$이다. 정답은 ③이다.

```
{"capability": "SOURCE_PLANE_FIGURE_v1", "panels": [{"type": "circle_chords", "halfChord": 7, "x": "full_chord"}, {"type": "circle_tangent", "radius": 5, "tangent": 12, "y": "PO"}], "caption": "중심거리가 같은 두 현(반현 7cm)의 길이 x와 반지름 5cm, 접선 12cm일 때 PO=y"}
```

```
{"sourceQid": "14", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-06", "subUnitKey": "M3-06-CIRCLE_LINE", "conceptClusterKey": "현의 성질과 접선 직각삼각형 피타고라스", "primaryMethod": "현의 이등분으로 $x=14$, 접선 수직 직각삼각형으로 $y=\\sqrt{5^2+12^2}=13$을 구해 더한다.", "decisiveStep": "왼쪽 원에서 현의 수직이등분선($x=14$), 오른쪽 원에서 $5$-$12$-$13$ 직각삼각형($y=13$)을 각각 구하는 단계", "rpm": {"majorUnit": "원의 성질", "midUnit": "원과 직선", "l3": "원의 접선", "l4": "접선 조건으로 길이 구하기"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "두 원 그림에서 각각 현의 성질과 접선 직각삼각형으로 $x, y$를 구해 합한다."}, "crossConceptKeys": ["CC_EQUAL_CHORDS_EQUAL_DISTANCE", "CC_CIRCLE_TANGENT_PROPERTY"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 독립된 원 성질(현의 길이, 접선 직각삼각형)을 각각 적용해 합해야 한다.", "level": "상", "item4slot": {"given": [{"term": "원", "src": "stem", "quote": "왼쪽 원"}, {"term": "접선", "src": "stem", "quote": "접선"}], "condition": [{"term": "거리", "src": "stem", "quote": "중심에서 두 현까지의 거리는 같고"}], "goal": [{"term": "합", "src": "solution", "quote": "x + y = 14 + 13 = 27"}], "method": [{"term": "현", "src": "solution", "quote": "현을 이등분"}], "reasons": {"method": "현의 이등분으로 $x$를, 접선과 반지름의 수직으로 $y$를 구해 더한다."}}, "hold": ""}
```

## Q15

- 형식: 객관식  
- 배점: 4

### 발문

다음 그림과 같이 원 \$\\text{O}\$의 지름 \$\\text{AB}\$와 현 \$\\text{CD}\$가 점 \$\\text{M}\$에서 수직으로 만난다. \$\\overline{\\text{AM}} \= 12\\text{ cm}\$, \$\\overline{\\text{MB}} \= 4\\text{ cm}\$일 때, \$\\overline{\\text{CD}}\$의 길이는? (4점)

### 선지

① \$4\\sqrt{2}\\text{ cm}\$ ② \$4\\sqrt{3}\\text{ cm}\$ ③ \$6\\sqrt{3}\\text{ cm}\$ ④ \$8\\sqrt{2}\\text{ cm}\$ ⑤ \$8\\sqrt{3}\\text{ cm}\$

### 정답

⑤

### 해설

지름 \$\\overline{\\text{AB}} \= 12 \+ 4 \= 16\\text{ cm}\$이므로 반지름의 길이는 \$8\\text{ cm}\$이다. 따라서 \$\\overline{\\text{OM}} \= 8 \- 4 \= 4\\text{ cm}\$이다. 직각삼각형 \$\\text{OMC}\$에서 \$\\overline{\\text{OC}} \= 8\\text{ cm}\$이므로 \$\$\\overline{\\text{CM}} \= \\sqrt{8^2 \- 4^2} \= \\sqrt{64 \- 16} \= \\sqrt{48} \= 4\\sqrt{3}\\text{ cm}\$\$ 현에 내린 수선은 현을 이등분하므로 \$\\overline{\\text{CD}} \= 2\\overline{\\text{CM}} \= 8\\sqrt{3}\\text{ cm}\$이다. 정답은 ⑤이다.

```
{"capability": "SOURCE_PLANE_FIGURE_v1", "circle": {"center": "O", "diameter": "AB", "chord": "CD", "perpAt": "M", "AM": 12, "MB": 4}, "caption": "원 O의 지름 AB와 수직인 현 CD의 교점 M (AM=12cm, MB=4cm)"}
```

```
{"sourceQid": "15", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-06", "subUnitKey": "M3-06-CIRCLE_LINE", "conceptClusterKey": "지름과 수직인 현의 길이", "primaryMethod": "반지름 $8$과 $\\overline{OM}=4$로 반현 $\\overline{CM}=4\\sqrt{3}$을 구해 $2$배한 $8\\sqrt{3}$을 구한다.", "decisiveStep": "지름 $16$에서 반지름 $8$과 $\\overline{OM}=4$를 구해 피타고라스 정리를 적용하는 단계", "rpm": {"majorUnit": "원의 성질", "midUnit": "원과 직선", "l3": "원의 중심과 현", "l4": "중심에서 현에 내린 수선"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "지름이 현에 의해 분할된 두 길이로 반지름과 중심거리를 구해 현의 길이를 계산한다."}, "crossConceptKeys": ["CC_CIRCLE_CHORD_PERP_BISECTOR"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "분할된 지름에서 반지름과 $\\overline{OM}$을 구한 뒤 반현의 $2$배를 구해야 한다.", "level": "상", "item4slot": {"given": [{"term": "원", "src": "stem", "quote": "원 $\\text{O}$"}, {"term": "현", "src": "stem", "quote": "현 $\\text{CD}$"}], "condition": [{"term": "원", "src": "stem", "quote": "원 $\\text{O}$"}], "goal": [{"term": "길이", "src": "stem", "quote": "$\\overline{\\text{CD}}$의 길이"}], "method": [{"term": "직각삼각형", "src": "solution", "quote": "직각삼각형 $\\text{OMC}$"}], "reasons": {"method": "반지름 $8$과 $\\overline{OM}=4$로 $\\triangle OMC$에서 $\\overline{CM}$을 구해 $2$배한다."}}, "hold": ""}
```

## Q16

- 형식: 객관식  
- 배점: 4

### 발문

다음 그림에서 \$\\overline{\\text{OM}} \\perp \\overline{\\text{AB}}\$, \$\\overline{\\text{ON}} \\perp \\overline{\\text{BC}}\$이고 \$\\overline{\\text{OM}} \= \\overline{\\text{ON}}\$이다. \$\\angle\\text{MON} \= 124^\\circ\$일 때, \$\\angle\\text{ACB}\$의 크기는? (4점)

### 선지

① \$58^\\circ\$ ② \$62^\\circ\$ ③ \$64^\\circ\$ ④ \$68^\\circ\$ ⑤ \$124^\\circ\$

### 정답

②

### 해설

\$\\overline{\\text{OM}} \= \\overline{\\text{ON}}\$이므로 두 현의 길이가 같고(\$\\overline{\\text{AB}} \= \\overline{\\text{BC}}\$), 대응하는 중심각도 \$\\angle\\text{AOB} \= \\angle\\text{BOC}\$로 같다. 중심에서 현에 내린 수선은 중심각을 이등분하므로 \$\$\\angle\\text{AOB} \= \\angle\\text{MON} \= 124^\\circ\$\$ 원주각은 중심각의 절반이므로 \$\\angle\\text{ACB} \= \\frac{1}{2}\\angle\\text{AOB} \= \\frac{1}{2} \\times 124^\\circ \= 62^\\circ\$이다. 정답은 ②이다.

```
{"capability": "SOURCE_PLANE_FIGURE_v1", "circle": {"center": "O", "inscribedTriangle": ["A", "B", "C"], "perpFeet": {"M": "on_AB", "N": "on_BC"}, "angleMON": 124}, "caption": "원 O에서 OM⊥AB, ON⊥BC, OM=ON이고 ∠MON=124°일 때 원주각 ∠ACB"}
```

```
{"sourceQid": "16", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-06", "subUnitKey": "M3-06-CIRCLE_INSCRIBED_ANGLE", "conceptClusterKey": "중심거리가 같은 두 현의 중심각과 원주각", "primaryMethod": "$\\angle AOB = \\angle MON = 124^\\circ$임을 구한 뒤 원주각 $\\angle ACB = \\frac{1}{2}(124^\\circ) = 62^\\circ$를 구한다.", "decisiveStep": "중심에서 현에 내린 수선이 중심각을 이등분해 $\\angle AOB = \\angle MON$이 됨을 파악하는 단계", "rpm": {"majorUnit": "원의 성질", "midUnit": "원주각", "l3": "원주각과 중심각", "l4": "중심각과 원주각"}, "ptTplCandidate": {"problemTypeKey": "PT_CIRCLE_ANGLE_RELATIONS", "templateKey": null, "why": "중심거리가 같은 두 현의 수선이 이루는 각에서 중심각과 원주각을 구한다."}, "crossConceptKeys": ["CC_EQUAL_CHORDS_EQUAL_DISTANCE"], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "현의 중심각 이등분 성질과 원주각이 중심각의 절반임을 연결해야 한다.", "level": "상", "item4slot": {"given": [{"term": "원", "src": "stem", "quote": "다음 그림에서 $\\overline{\\text{OM}} \\perp \\overline{\\text{AB}}$"}], "condition": [{"term": "현", "src": "solution", "quote": "두 현의 길이"}], "goal": [{"term": "원주각", "src": "solution", "quote": "원주각은 중심각의 절반"}], "method": [{"term": "중심각", "src": "solution", "quote": "중심각을 이등분"}], "reasons": {"method": "$\\angle AOB=\\angle MON=124^\\circ$를 구한 뒤 원주각이 중심각의 절반임을 이용한다."}}, "hold": ""}
```

## Q17

- 형식: 객관식  
- 배점: 4

### 발문

다음 그림에서 두 점 \$\\text{A}\$와 \$\\text{B}\$는 점 \$\\text{P}\$에서 원 \$\\text{O}\$에 그은 두 접선의 접점이다. \$\\overline{\\text{PA}} \= 8\\text{ cm}\$, \$\\angle\\text{APB} \= 60^\\circ\$일 때, 삼각형 \$\\text{APB}\$의 넓이는? (4점)

### 선지

① \$16\\sqrt{3}\\text{ cm}^2\$ ② \$16\\sqrt{2}\\text{ cm}^2\$ ③ \$16\\text{ cm}^2\$ ④ \$32\\sqrt{2}\\text{ cm}^2\$ ⑤ \$32\\sqrt{3}\\text{ cm}^2\$

### 정답

①

### 해설

원 밖의 한 점 \$\\text{P}\$에서 원에 그은 두 접선의 길이는 같으므로 \$\\overline{\\text{PB}} \= \\overline{\\text{PA}} \= 8\\text{ cm}\$이다. 따라서 \$\\triangle\\text{APB}\$의 넓이는 \$\$\\frac{1}{2} \\times 8 \\times 8 \\times \\sin 60^\\circ \= 32 \\times \\frac{\\sqrt{3}}{2} \= 16\\sqrt{3}\\text{ cm}^2\$\$ 정답은 ①이다.

```
{"capability": "SOURCE_PLANE_FIGURE_v1", "circle": {"center": "O"}, "tangents": {"from": "P", "points": ["A", "B"], "PA": 8, "angleAPB": 60}, "caption": "원 O에 점 P에서 그은 두 접선 PA, PB (PA=8cm, ∠APB=60°)"}
```

```
{"sourceQid": "17", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-06", "subUnitKey": "M3-06-CIRCLE_LINE", "conceptClusterKey": "두 접선의 길이 같음과 삼각형 넓이", "primaryMethod": "$\\overline{PB}=\\overline{PA}=8$을 이용해 $\\frac{1}{2}\\times 8\\times 8\\times\\sin 60^\\circ=16\\sqrt{3}$을 계산한다.", "decisiveStep": "두 접선의 길이가 같으므로 $\\triangle APB$가 한 변 $8$인 정삼각형이 됨을 이용하는 단계", "rpm": {"majorUnit": "원의 성질", "midUnit": "원과 직선", "l3": "원의 접선", "l4": "한 점에서 그은 두 접선"}, "ptTplCandidate": {"problemTypeKey": "PT_CIRCLE_TANGENT", "templateKey": null, "why": "원 밖의 점에서 그은 두 접선과 끼인각으로 삼각형 넓이를 구한다."}, "crossConceptKeys": ["CC_CIRCLE_TANGENT_LENGTH", "CC_TRIANGLE_AREA_TRIG"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "접선 길이 같음과 삼각비 넓이 공식을 함께 적용해야 한다.", "level": "중", "item4slot": {"given": [{"term": "원", "src": "stem", "quote": "원 $\\text{O}$"}, {"term": "접선", "src": "stem", "quote": "두 접선"}], "condition": [{"term": "접점", "src": "stem", "quote": "접점"}], "goal": [{"term": "넓이", "src": "stem", "quote": "삼각형 $\\text{APB}$의 넓이"}], "method": [{"term": "삼각비", "src": "solution", "quote": "\\frac{1}{2} \\times 8 \\times 8 \\times \\sin 60^\\circ"}], "reasons": {"method": "$\\overline{PB}=\\overline{PA}=8$임을 이용해 삼각비 넓이 공식에 대입한다."}}, "hold": ""}
```

## Q18

- 형식: 객관식  
- 배점: 4

### 발문

다음 그림에서 사각형 \$\\text{ABCD}\$가 원 \$\\text{O}\$에 외접할 때, \$\\overline{\\text{AB}} \= 7\\text{ cm}\$, \$\\overline{\\text{AD}} \= 5\\text{ cm}\$, \$\\overline{\\text{BC}} \= 10\\text{ cm}\$이면 \$\\overline{\\text{CD}}\$의 길이는? (4점)

### 선지

① \$5\\text{ cm}\$ ② \$6\\text{ cm}\$ ③ \$7\\text{ cm}\$ ④ \$8\\text{ cm}\$ ⑤ \$9\\text{ cm}\$

### 정답

④

### 해설

원에 외접하는 사각형에서 마주 보는 두 변의 길이의 합은 서로 같으므로 \$\$\\overline{\\text{AB}} \+ \\overline{\\text{CD}} \= \\overline{\\text{AD}} \+ \\overline{\\text{BC}}\$\$ \$\$7 \+ \\overline{\\text{CD}} \= 5 \+ 10 \\implies \\overline{\\text{CD}} \= 8\\text{ cm}\$\$ 따라서 정답은 ④이다.

```
{"capability": "SOURCE_PLANE_FIGURE_v1", "circle": {"center": "O"}, "circumscribedQuad": {"vertices": ["A", "B", "C", "D"], "AB": 7, "AD": 5, "BC": 10}, "caption": "원 O에 외접하는 사각형 ABCD (AB=7cm, AD=5cm, BC=10cm)"}
```

```
{"sourceQid": "18", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-06", "subUnitKey": "M3-06-CIRCLE_LINE", "conceptClusterKey": "원에 외접하는 사각형의 대변 합 성질", "primaryMethod": "$\\overline{AB}+\\overline{CD}=\\overline{AD}+\\overline{BC}$에 $7, 5, 10$을 대입해 $\\overline{CD}=8$을 구한다.", "decisiveStep": "외접사각형의 대변 합 등식 $7 + \\overline{CD} = 5 + 10$을 세우는 단계", "rpm": {"majorUnit": "원의 성질", "midUnit": "원과 직선", "l3": "원의 접선", "l4": "접선 조건으로 길이 구하기"}, "ptTplCandidate": {"problemTypeKey": "PT_CIRCLE_LINE_RELATION", "templateKey": null, "why": "원에 외접하는 사각형의 대변 길이 합이 같음을 이용해 한 변의 길이를 구한다."}, "crossConceptKeys": ["CC_CIRCUMSCRIBED_POLYGON", "CC_CIRCLE_TANGENT_LENGTH"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "외접사각형의 대변 합 공식에 세 변의 길이를 바로 대입하면 된다.", "level": "중", "item4slot": {"given": [{"term": "사각형", "src": "stem", "quote": "사각형 $\\text{ABCD}$"}, {"term": "원", "src": "stem", "quote": "원 $\\text{O}$에 외접"}], "condition": [], "goal": [{"term": "길이", "src": "stem", "quote": "$\\overline{\\text{CD}}$의 길이"}], "method": [{"term": "합", "src": "solution", "quote": "두 변의 길이의 합"}], "reasons": {"method": "원에 외접하는 사각형의 마주 보는 두 변의 합이 같음을 이용한다."}}, "hold": ""}
```

## Q19

- 형식: 객관식  
- 배점: 4

### 발문

다음 그림에서 \$\\overline{\\text{BC}}\$는 반원 \$\\text{O}\$의 지름이고 \$\\overline{\\text{AB}}, \\overline{\\text{AD}}, \\overline{\\text{CD}}\$는 반원 \$\\text{O}\$의 접선이다. 점 \$\\text{E}\$가 접점이고 \$\\overline{\\text{AB}} \= 4\\text{ cm}\$, \$\\overline{\\text{CD}} \= 9\\text{ cm}\$일 때, 반원 \$\\text{O}\$의 넓이는? (4점)

### 선지

① \$12\\pi\\text{ cm}^2\$ ② \$16\\pi\\text{ cm}^2\$ ③ \$18\\pi\\text{ cm}^2\$ ④ \$24\\pi\\text{ cm}^2\$ ⑤ \$36\\pi\\text{ cm}^2\$

### 정답

③

### 해설

두 접선의 길이가 같으므로 \$\\overline{\\text{AE}} \= \\overline{\\text{AB}} \= 4\\text{ cm}\$, \$\\overline{\\text{DE}} \= \\overline{\\text{CD}} \= 9\\text{ cm}\$이고, \$\\overline{\\text{AD}} \= 4 \+ 9 \= 13\\text{ cm}\$이다. 점 \$\\text{A}\$에서 \$\\overline{\\text{CD}}\$에 내린 수선의 발을 \$\\text{H}\$라 하면 \$\\overline{\\text{DH}} \= 9 \- 4 \= 5\\text{ cm}\$이다. 직각삼각형 \$\\text{AHD}\$에서 \$\$\\overline{\\text{BC}} \= \\overline{\\text{AH}} \= \\sqrt{13^2 \- 5^2} \= \\sqrt{169 \- 25} \= 12\\text{ cm}\$\$ 반원 \$\\text{O}\$의 반지름은 \$6\\text{ cm}\$이므로 반원의 넓이는 \$\\frac{1}{2} \\pi \\times 6^2 \= 18\\pi\\text{ cm}^2\$이다. 정답은 ③이다.

```
{"capability": "SOURCE_PLANE_FIGURE_v1", "semicircle": {"center": "O", "diameter": "BC"}, "tangents": ["AB", "AD", "CD"], "touchPoint": "E_on_AD", "AB": 4, "CD": 9, "caption": "지름 BC인 반원 O에 접하는 AB=4cm, CD=9cm, AD (접점 E)"}
```

```
{"sourceQid": "19", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-06", "subUnitKey": "M3-06-CIRCLE_LINE", "conceptClusterKey": "반원에 외접하는 직각사다리꼴과 반원의 넓이", "primaryMethod": "$\\overline{AD}=4+9=13$과 $\\overline{DH}=9-4=5$로 직각삼각형에서 지름 $12$를 구해 반원 넓이 $18\\pi$를 구한다.", "decisiveStep": "수선 $\\text{AH}$를 그어 빗변 $13$, 밑변 $5$인 직각삼각형에서 지름 $12$를 구하는 단계", "rpm": {"majorUnit": "원의 성질", "midUnit": "원과 직선", "l3": "원의 접선", "l4": "접선 조건으로 길이 구하기"}, "ptTplCandidate": {"problemTypeKey": "PT_CIRCLE_TANGENT", "templateKey": null, "why": "반원에 외접하는 사다리꼴에서 수선을 내려 반원의 지름과 넓이를 구한다."}, "crossConceptKeys": ["CC_CIRCLE_TANGENT_LENGTH", "CC_AUXILIARY_ALTITUDE"], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "접선 합으로 $\\overline{AD}$를 구하고 수선을 내려 피타고라스 정리로 지름을 구한 뒤 반원 넓이를 계산해야 한다.", "level": "상", "item4slot": {"given": [{"term": "반원", "src": "stem", "quote": "반원 $\\text{O}$"}, {"term": "접선", "src": "stem", "quote": "접선"}], "condition": [{"term": "접점", "src": "stem", "quote": "접점"}], "goal": [{"term": "넓이", "src": "stem", "quote": "반원 $\\text{O}$의 넓이"}], "method": [{"term": "직각삼각형", "src": "solution", "quote": "직각삼각형 $\\text{AHD}$"}], "reasons": {"method": "접선 길이 합으로 $\\overline{AD}=13$을 구한 뒤 수선 $\\text{AH}$로 지름을 구한다."}}, "hold": ""}
```

## Q20

- 형식: 객관식  
- 배점: 5

### 발문

다음 그림에서 중심이 같은 두 원의 반지름의 길이는 각각 \$5, 13\$이고 점 \$\\text{Q}, \\text{R}\$은 작은 원의 접점이다. 큰 원의 두 현 \$\\text{AB}\$와 \$\\text{CD}\$의 교점을 \$\\text{P}\$라 할 때, \$\\overline{\\text{AP}}\$의 길이는? (단, \$\\overline{\\text{AB}} \\perp \\overline{\\text{CD}}\$이고 \$\\text{A}\$는 \$\\text{P}\$에서 먼 쪽 끝점이다.) (5점)

### 선지

① \$7\$ ② \$12\$ ③ \$13\$ ④ \$15\$ ⑤ \$17\$

### 정답

⑤

### 해설

두 현이 작은 원에 접하므로 중심 \$\\text{O}\$에서 각 현까지의 거리는 모두 작은 원의 반지름 \$5\$이다. 큰 원의 반지름이 \$13\$이므로 두 현의 반길이는 \$\\sqrt{13^2 \- 5^2} \= 12\$이다. \$\\overline{\\text{AB}} \\perp \\overline{\\text{CD}}\$이고 \$\\overline{\\text{OQ}} \= \\overline{\\text{OR}} \= 5\$이므로 사각형 \$\\text{OQPR}\$은 한 변의 길이가 \$5\$인 정사각형이고 \$\\overline{\\text{QP}} \= 5\$이다. 점 \$\\text{Q}\$가 현 \$\\text{AB}\$의 중점이므로 \$\\overline{\\text{AQ}} \= 12\$이고, 따라서 \$\\overline{\\text{AP}} \= \\overline{\\text{AQ}} \+ \\overline{\\text{QP}} \= 12 \+ 5 \= 17\$이다. 정답은 ⑤이다.

```
{"capability": "SOURCE_PLANE_FIGURE_v1", "concentricCircles": {"center": "O", "r1": 5, "r2": 13}, "chords": {"AB": "tangent_at_Q", "CD": "tangent_at_R", "perpAt": "P"}, "caption": "동심원(반지름 5, 13)에서 작은 원에 접하며 수직으로 만나는 두 현 AB, CD"}
```

```
{"sourceQid": "20", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-06", "subUnitKey": "M3-06-CIRCLE_LINE", "conceptClusterKey": "동심원에서 작은 원에 접하는 수직 두 현의 교점 거리", "primaryMethod": "반현 $\\overline{AQ}=\\sqrt{13^2-5^2}=12$와 정사각형 $\\text{OQPR}$의 변 $\\overline{QP}=5$를 더해 $17$을 구한다.", "decisiveStep": "중심과 접점·교점이 한 변이 $5$인 정사각형 $\\text{OQPR}$을 이룸을 파악하는 단계", "rpm": {"majorUnit": "원의 성질", "midUnit": "원과 직선", "l3": "원의 중심과 현", "l4": "중심에서 현에 내린 수선"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "동심원에서 작은 원에 접하며 수직으로 만나는 두 현의 교점까지 선분 길이를 구한다."}, "crossConceptKeys": ["CC_CIRCLE_CHORD_PERP_BISECTOR", "CC_CIRCLE_TANGENT_PROPERTY"], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "현의 반길이 계산과 접점 수직이 만드는 정사각형 구조를 결합해 선분 합을 구해야 하는 고난도 문항이다.", "level": "상", "item4slot": {"given": [{"term": "원", "src": "stem", "quote": "두 원의 반지름"}, {"term": "현", "src": "stem", "quote": "두 현 $\\text{AB}$와 $\\text{CD}$"}], "condition": [{"term": "접점", "src": "stem", "quote": "접점"}], "goal": [{"term": "길이", "src": "stem", "quote": "$\\overline{\\text{AP}}$의 길이"}], "method": [{"term": "정사각형", "src": "solution", "quote": "정사각형"}], "reasons": {"method": "피타고라스 정리로 반현 $\\overline{AQ}=12$를 구하고 정사각형 $\\text{OQPR}$의 변 $5$를 더한다."}}, "hold": ""}
```

## Q21

- 형식: 서답형  
- 배점: 5

### 발문

다음 그림과 같이 한 모서리의 길이가 \$4\$인 정육면체에서 \$\\angle\\text{CEG} \= x^\\circ\$라 할 때, \$\\sin x^\\circ \\times \\tan x^\\circ\$의 값을 구하는 과정을 설명하시오. (5점, 부분점수 있음)

### 선지

없음

### 정답

\$\\frac{\\sqrt{6}}{6}\$

### 해설

정육면체에서 \$\\overline{\\text{EG}}\$는 밑면 정사각형의 대각선이므로 \$\\overline{\\text{EG}} \= 4\\sqrt{2}\$이고, \$\\overline{\\text{CG}} \= 4\$이다. 직각삼각형 \$\\text{EGC}\$에서 \$\\angle\\text{EGC} \= 90^\\circ\$이므로 공간대각선 \$\\overline{\\text{EC}} \= \\sqrt{(4\\sqrt{2})^2 \+ 4^2} \= \\sqrt{48} \= 4\\sqrt{3}\$이다. 따라서 \$\\sin x^\\circ \= \\frac{4}{4\\sqrt{3}} \= \\frac{1}{\\sqrt{3}}\$, \$\\tan x^\\circ \= \\frac{4}{4\\sqrt{2}} \= \\frac{1}{\\sqrt{2}}\$이므로 \$\$\\sin x^\\circ \\times \\tan x^\\circ \= \\frac{1}{\\sqrt{3}} \\times \\frac{1}{\\sqrt{2}} \= \\frac{1}{\\sqrt{6}} \= \\frac{\\sqrt{6}}{6}\$\$

```
{"capability": "SOURCE_SOLID_FIGURE_v1", "cube": {"edge": 4, "diagonal": "EC", "faceDiagonal": "EG", "angleCEG": "x"}, "caption": "한 모서리 길이가 4인 정육면체에서 ∠CEG=x°"}
```

```
{"sourceQid": "21", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO_APPLICATION", "conceptClusterKey": "정육면체 공간대각선과 삼각비", "primaryMethod": "밑면 대각선 $4\\sqrt{2}$와 공간대각선 $4\\sqrt{3}$을 구해 $\\sin x^\\circ=\\frac{1}{\\sqrt{3}}, \\tan x^\\circ=\\frac{1}{\\sqrt{2}}$를 곱한다.", "decisiveStep": "직각삼각형 $\\text{EGC}$의 세 변 $4, 4\\sqrt{2}, 4\\sqrt{3}$을 구해 삼각비를 계산하는 단계", "rpm": {"majorUnit": "삼각비", "midUnit": "삼각비의 활용", "l3": "복합도형", "l4": "피타고라스 결합"}, "ptTplCandidate": {"problemTypeKey": "PT_TRIG_RATIO_APPLICATION", "templateKey": null, "why": "정육면체의 면대각선과 공간대각선이 이루는 각의 삼각비 곱을 구한다."}, "crossConceptKeys": ["CC_TRIG_RATIO_DEFINITIONS"], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "입체도형에서 직각삼각형 $\\text{EGC}$를 추출해 대각선 두 개를 구한 뒤 삼각비를 곱해야 한다.", "level": "상", "item4slot": {"given": [{"term": "정육면체", "src": "stem", "quote": "정육면체"}], "condition": [], "goal": [{"term": "삼각비", "src": "solution", "quote": "\\sin x^\\circ \\times \\tan x^\\circ"}], "method": [{"term": "직각삼각형", "src": "solution", "quote": "직각삼각형 $\\text{EGC}$"}], "reasons": {"method": "정육면체의 면대각선과 공간대각선으로 $\\triangle EGC$의 세 변을 구해 삼각비를 곱한다."}}, "hold": ""}
```

## Q22

- 형식: 서답형  
- 배점: 5

### 발문

다음 그림과 같이 성 밖의 \$\\text{A}\$ 지점에서 성벽의 꼭대기 \$\\text{B}\$ 지점을 올려본 각의 크기가 \$30^\\circ\$이고, 성 쪽으로 \$30\\text{ m}\$ 다가간 \$\\text{D}\$ 지점에서 \$\\text{B}\$ 지점을 올려본 각의 크기가 \$45^\\circ\$이었다. 이때 성벽의 높이를 구하는 과정을 설명하시오. (5점, 부분점수 있음)

### 선지

없음

### 정답

\$15(\\sqrt{3} \+ 1)\\text{ m}\$

### 해설

성벽의 밑점을 \$\\text{C}\$, 성벽의 높이를 \$\\overline{\\text{BC}} \= h\\text{ m}\$라 하자. 직각삼각형 \$\\text{BCD}\$에서 \$\\angle\\text{BDC} \= 45^\\circ\$이므로 \$\\overline{\\text{CD}} \= \\frac{h}{\\tan 45^\\circ} \= h\\text{ m}\$이다. 직각삼각형 \$\\text{BCA}\$에서 \$\\angle\\text{BAC} \= 30^\\circ\$이므로 \$\\overline{\\text{AC}} \= \\frac{h}{\\tan 30^\\circ} \= h\\sqrt{3}\\text{ m}\$이다. \$\\overline{\\text{AD}} \= \\overline{\\text{AC}} \- \\overline{\\text{CD}} \= 30\$이므로 \$\$h\\sqrt{3} \- h \= 30 \\implies (\\sqrt{3} \- 1)h \= 30\$\$ \$\$h \= \\frac{30}{\\sqrt{3} \- 1} \= \\frac{30(\\sqrt{3} \+ 1)}{(\\sqrt{3} \- 1)(\\sqrt{3} \+ 1)} \= 15(\\sqrt{3} \+ 1)\\text{ m}\$\$

```
{"capability": "SOURCE_PLANE_FIGURE_v1", "measurement": {"AD": 30, "angleA": 30, "angleD": 45, "height": "BC"}, "caption": "30°와 45° 두 올려본각과 이동 거리 30m로 성벽 높이 구하기"}
```

```
{"sourceQid": "22", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-05", "subUnitKey": "M3-05-TRIG_RATIO_APPLICATION", "conceptClusterKey": "두 지점의 올려본각(30°, 45°)으로 높이 구하기", "primaryMethod": "$\\overline{CD}=h, \\overline{AC}=h\\sqrt{3}$을 세워 $h(\\sqrt{3}-1)=30$을 풀고 분모를 유리화한다.", "decisiveStep": "거리 차 $h\\sqrt{3} - h = 30$을 세운 뒤 켤레무리수로 분모를 유리화하는 단계", "rpm": {"majorUnit": "삼각비", "midUnit": "삼각비의 활용", "l3": "측정 문제", "l4": "앙각·부각"}, "ptTplCandidate": {"problemTypeKey": "PT_TRIG_RATIO_APPLICATION", "templateKey": null, "why": "두 지점에서 측정한 올려본각 $30^\\circ, 45^\\circ$와 거리 차로 성벽의 높이를 구한다."}, "crossConceptKeys": ["CC_ELEVATION_ANGLE", "CC_DENOMINATOR_RATIONALIZATION_CONJUGATE"], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "높이를 미지수로 두고 두 삼각비 길이 차 방정식을 세워 켤레 유리화까지 마쳐야 한다.", "level": "상", "item4slot": {"given": [{"term": "직각삼각형", "src": "solution", "quote": "직각삼각형 $\\text{BCD}$"}], "condition": [], "goal": [{"term": "높이", "src": "stem", "quote": "성벽의 높이"}], "method": [{"term": "유리화", "src": "solution", "quote": "\\frac{30(\\sqrt{3} + 1)}{(\\sqrt{3} - 1)(\\sqrt{3} + 1)} = 15(\\sqrt{3} + 1)"}], "reasons": {"method": "두 올려본각으로 밑변 차 $h\\sqrt{3}-h=30$을 세우고 분모를 유리화한다."}}, "hold": ""}
```

## Q23

- 형식: 서답형  
- 배점: 5

### 발문

다음 그림에서 \$\\overline{\\text{AB}} \\perp \\overline{\\text{OC}}\$이고 \$\\overline{\\text{BM}} \= 8\\text{ cm}\$, \$\\overline{\\text{CM}} \= 4\\text{ cm}\$일 때, 원의 반지름의 길이를 구하는 과정을 설명하시오. (5점, 부분점수 있음)

### 선지

없음

### 정답

\$10\\text{ cm}\$

### 해설

원의 반지름의 길이를 \$r\\text{ cm}\$라 하면 \$\\overline{\\text{OB}} \= r\\text{ cm}\$이고 \$\\overline{\\text{OM}} \= (r \- 4)\\text{ cm}\$이다. 직각삼각형 \$\\text{OMB}\$에서 피타고라스 정리에 의해 \$\$r^2 \= (r \- 4)^2 \+ 8^2\$\$ \$\$r^2 \= r^2 \- 8r \+ 16 \+ 64 \\implies 8r \= 80 \\implies r \= 10\$\$ 따라서 원의 반지름의 길이는 \$10\\text{ cm}\$이다.

```
{"capability": "SOURCE_PLANE_FIGURE_v1", "circle": {"center": "O", "chord": "AB", "radiusOC": "perp_to_AB_at_M", "BM": 8, "CM": 4}, "caption": "현 AB와 수직인 반지름 OC가 점 M에서 만날 때 BM=8cm, CM=4cm"}
```

```
{"sourceQid": "23", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-06", "subUnitKey": "M3-06-CIRCLE_LINE", "conceptClusterKey": "현의 길이와 활꼴 높이로 원의 반지름 구하기", "primaryMethod": "반지름을 $r$로 두어 $\\overline{OM}=r-4$를 얻고 $\\triangle OMB$에서 $r^2=(r-4)^2+8^2$을 푼다.", "decisiveStep": "$\\overline{OM}=r-4$로 설정해 피타고라스 방정식에서 $r^2$이 소거되도록 푸는 단계", "rpm": {"majorUnit": "원의 성질", "midUnit": "원과 직선", "l3": "원의 중심과 현", "l4": "중심에서 현에 내린 수선"}, "ptTplCandidate": {"problemTypeKey": "PT_CIRCLE_LINE_RELATION", "templateKey": null, "why": "반현의 길이와 활꼴의 높이로 원의 반지름을 구한다."}, "crossConceptKeys": ["CC_CIRCLE_CHORD_PERP_BISECTOR"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "반지름 $r$을 미지수로 잡아 $\\overline{OM}=r-4$를 표현하고 이차항 소거 방정식을 풀어야 한다.", "level": "상", "item4slot": {"given": [{"term": "원", "src": "stem", "quote": "원의 반지름"}], "condition": [], "goal": [{"term": "길이", "src": "stem", "quote": "반지름의 길이"}], "method": [{"term": "직각삼각형", "src": "solution", "quote": "직각삼각형 $\\text{OMB}$"}], "reasons": {"method": "반지름을 $r$로 두고 $\\triangle OMB$에 피타고라스 정리를 적용한다."}}, "hold": ""}
```

## Q24

- 형식: 서답형  
- 배점: 5

### 발문

다음 그림에서 원 \$\\text{O}\$는 직사각형 \$\\text{ABCD}\$의 세 변과 접하고, 세 점 \$\\text{E}, \\text{F}, \\text{G}\$는 접점이다. 또 \$\\overline{\\text{DH}}\$는 원 \$\\text{O}\$의 접선이고 점 \$\\text{I}\$는 접점이며 \$\\overline{\\text{DH}} \= 10\\text{ cm}\$, \$\\overline{\\text{DC}} \= 8\\text{ cm}\$일 때, \$\\overline{\\text{GH}}\$의 길이를 구하는 과정을 설명하시오. (5점, 부분점수 있음)

### 선지

없음

### 정답

\$2\\text{ cm}\$

### 해설

직각삼각형 \$\\text{DCH}\$에서 피타고라스 정리에 의해 \$\\overline{\\text{CH}} \= \\sqrt{10^2 \- 8^2} \= 6\\text{ cm}\$이다. 원 \$\\text{O}\$는 직사각형의 위·아래 두 변 \$\\text{AD}, \\text{BC}\$에 접하므로 지름이 \$\\overline{\\text{DC}} \= 8\\text{ cm}\$이고 반지름은 \$4\\text{ cm}\$이다. 따라서 \$\\overline{\\text{AE}} \= \\overline{\\text{BG}} \= 4\\text{ cm}\$이다. \$\\overline{\\text{GH}} \= x\\text{ cm}\$라 하면 \$\\overline{\\text{BC}} \= 4 \+ x \+ 6 \= (10 \+ x)\\text{ cm}\$이므로 \$\\overline{\\text{DE}} \= \\overline{\\text{AD}} \- 4 \= (6 \+ x)\\text{ cm}\$이다. 점 \$\\text{D}\$와 점 \$\\text{H}\$에서 그은 접선의 길이가 같으므로 \$\\overline{\\text{DI}} \= \\overline{\\text{DE}} \= 6 \+ x\$, \$\\overline{\\text{HI}} \= \\overline{\\text{HG}} \= x\$이다. \$\$\\overline{\\text{DH}} \= (6 \+ x) \+ x \= 10 \\implies 2x \= 4 \\implies x \= 2\$\$ 따라서 \$\\overline{\\text{GH}} \= 2\\text{ cm}\$이다.

```
{"capability": "SOURCE_PLANE_FIGURE_v1", "rectangle": {"vertices": ["A", "B", "C", "D"], "DC": 8}, "circle": {"inscribedInThreeSides": ["AB", "BC", "DA"], "touchPoints": ["F", "G", "E"]}, "tangent": {"from": "D", "to": "H_on_BC", "touchPoint": "I", "DH": 10}, "caption": "직사각형 ABCD의 세 변에 접하는 원 O와 접선 DH=10cm, DC=8cm"}
```

```
{"sourceQid": "24", "variationType": "NUMERIC", "standardCourse": "중3", "courseKey": "M3", "curriculum": "2015", "standardUnitKey": "M3-06", "subUnitKey": "M3-06-CIRCLE_LINE", "conceptClusterKey": "직사각형 내접원 접선과 사다리꼴 길이 방정식", "primaryMethod": "$\\overline{CH}=6$과 반지름 $4$를 구하고 $\\overline{GH}=x$로 두어 $\\overline{DH}=(6+x)+x=10$을 푼다.", "decisiveStep": "가로 길이 $\\overline{BC}=10+x$를 이용해 $\\overline{DE}=6+x$로 표현하고 $\\overline{DH}$ 합을 세우는 단계", "rpm": {"majorUnit": "원의 성질", "midUnit": "원과 직선", "l3": "원의 접선", "l4": "접선 조건으로 길이 구하기"}, "ptTplCandidate": {"problemTypeKey": "PT_CIRCLE_TANGENT", "templateKey": null, "why": "직사각형 내접원과 외부 접선이 만날 때 접점까지의 길이를 방정식으로 구한다."}, "crossConceptKeys": ["CC_RECTANGLE_INSCRIBED_CIRCLE_TANGENT", "CC_CIRCLE_TANGENT_LENGTH"], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "직각삼각형 피타고라스, 원의 반지름, 직사각형 대변 같음, 접선 길이 방정식을 모두 통합해야 한다.", "level": "상", "item4slot": {"given": [{"term": "직사각형", "src": "stem", "quote": "직사각형 $\\text{ABCD}$"}, {"term": "접선", "src": "stem", "quote": "접선"}], "condition": [{"term": "접점", "src": "stem", "quote": "접점"}], "goal": [{"term": "길이", "src": "stem", "quote": "$\\overline{\\text{GH}}$의 길이"}], "method": [{"term": "직각삼각형", "src": "solution", "quote": "직각삼각형 $\\text{DCH}$"}], "reasons": {"method": "$\\triangle DCH$에서 $\\overline{CH}=6$을 구한 뒤 접선 길이 같음으로 $\\overline{GH}$의 일차방정식을 푼다."}}, "hold": ""}
```

