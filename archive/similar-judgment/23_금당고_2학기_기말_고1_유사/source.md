

```
{"stem": "23_금당고_2학기_기말_고1_유사", "sourceArchiveFile": "original/high/h1/2final/23_금당고_2학기_기말_고1_기출.js", "examFolder": "2final", "grade": "고1", "curriculum": "2015", "questionCount": 21, "totalScore": 100, "generatedAt": "2026-11-16"}
```

## Q01

- 형식: 객관식  
- 배점: 3.8



### 발문



다음 중 \${}\_6P\_3\$의 값으로 옳은 것은? \[3.8점\]



### 선지



① \$30\$ ② \$60\$ ③ \$90\$ ④ \$120\$ ⑤ \$150\$



### 정답



④



### 해설



\${}\_6P\_3 \= 6 \\times 5 \\times 4 \= 120\$

```
{"status": "EXEMPT", "reason": "순열의 기본 계산 문항이므로 그림이 필요하지 않다."}
```

```
{"sourceQid": 1, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-07", "subUnitKey": "H15-SB-07-PERMUTATION_BASIC", "conceptClusterKey": "", "primaryMethod": "순열 ${}_6P_3$의 정의에 따라 $6$부터 $1$씩 작아지는 $3$개의 자연수를 곱한다.", "decisiveStep": "$6 \\times 5 \\times 4 = 120$을 계산한다.", "rpm": {"majorUnit": "경우의 수", "midUnit": "경우의 수와 순열", "l3": "순열", "l4": "일렬 배열"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_ARRANGEMENT", "templateKey": "TPL_PERMUTATION_STANDARD_CONSTRAINT", "why": "high1.json H1-RPM-124(DIRECT_ACTIVE): 순열/일렬 배열"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "순열의 정의식을 바로 적용하는 1단계 계산 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"given": ["순열"], "goal": ["값"], "method": ["순열"], "condition": []}}, "hold": ""}
```

## Q02

- 형식: 객관식  
- 배점: 3.8



### 발문



\$6\$명의 학생을 \$2\$명, \$4\$명의 두 모둠으로 나누는 모든 경우의 수는? \[3.8점\]



### 선지



① \$6\$ ② \$12\$ ③ \$15\$ ④ \$20\$ ⑤ \$30\$



### 정답



③



### 해설



두 모둠의 인원수가 다르므로 \$2\$명인 모둠을 정하면 나머지 \$4\$명은 자동으로 정해진다. \${}\_6C\_2 \= \\dfrac{6 \\times 5}{2 \\times 1} \= 15\$

```
{"status": "EXEMPT", "reason": "조합의 기본 계산 문항이므로 그림이 필요하지 않다."}
```

```
{"sourceQid": 2, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-08", "subUnitKey": "H15-SB-08-COMBINATION_BASIC", "conceptClusterKey": "", "primaryMethod": "인원수가 다른 두 모둠 분할이므로 $6$명 중 $2$명을 택하는 조합 ${}_6C_2$를 계산한다.", "decisiveStep": "${}_6C_2 = 15$를 구한다.", "rpm": {"majorUnit": "경우의 수", "midUnit": "조합", "l3": "조합의 뜻과 계산", "l4": "조합 계산"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_SELECTION_DISTRIBUTION", "templateKey": "TPL_COMBINATION_SELECTION", "why": "high1.json H1-RPM-128(DIRECT_ACTIVE): 조합의 뜻과 계산/조합 계산"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "서로 다른 인원의 분할을 조합 ${}_6C_2$ 한 번으로 계산하는 직접 적용형 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"given": ["조합"], "goal": ["개수"], "method": ["조합", "분할"], "condition": []}}, "hold": ""}
```

## Q03

- 형식: 객관식  
- 배점: 3.8



### 발문



두 함수 \$f(x) \= 2x \+ 3\$, \$g(x) \= 3x - 7\$에 대하여 \$f(g(2))\$의 값은? \[3.8점\]



### 선지



① \$1\$ ② \$2\$ ③ \$3\$ ④ \$4\$ ⑤ \$5\$



### 정답



①



### 해설



\$g(2) \= 3(2) - 7 \= \-1\$ \$f(g(2)) \= f(-1) \= 2(-1) \+ 3 \= 1\$

```
{"status": "EXEMPT", "reason": "합성함수의 함숫값을 차례로 대입하여 구하는 문항이므로 그림이 필요하지 않다."}
```

```
{"sourceQid": 3, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-03", "subUnitKey": "H15-SB-03-COMPOSITE_FUNCTION", "conceptClusterKey": "", "primaryMethod": "안쪽 함수 $g(2)=-1$을 먼저 구한 뒤 바깥쪽 함수 $f$에 대입해 $f(-1)=1$을 구한다.", "decisiveStep": "$g(2)=-1$을 $f(x)=2x+3$에 대입해 $1$을 얻는다.", "rpm": {"majorUnit": "함수", "midUnit": "함수", "l3": "합성함수", "l4": "합성함수 계산"}, "ptTplCandidate": {"problemTypeKey": "PT_COMPOSITION_EVALUATION", "templateKey": "TPL_COMPOSITION_VALUE_DIRECT", "why": "high1.json H1-RPM-102(DIRECT_ACTIVE): 합성함수/합성함수 계산"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 일차함수에 수치를 차례로 대입하는 직선적 계산 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"given": ["일차함수", "합성함수"], "goal": ["함숫값"], "method": ["합성함수", "대입"], "condition": []}}, "hold": ""}
```

## Q04

- 형식: 객관식  
- 배점: 3.8



### 발문



다음 중 함수의 그래프가 아닌 것을 고르면? \[3.8점\]



### 선지



① 직선 \$y \= 2x \+ 1\$의 그래프 ② 중심이 원점이고 반지름의 길이가 \$2\$인 원 \$x^2 \+ y^2 \= 4\$의 그래프 ③ 포물선 \$y \= x^2 - 1\$의 그래프 ④ 꺾은선 \$y \= \|x\|\$의 그래프 ⑤ 무리함수 \$y \= \\sqrt{x}\$의 그래프



### 정답



②



### 해설



함수의 그래프는 정의역의 각 \$x\$에 대하여 \$y\$값이 오직 하나씩만 대응해야 한다. ②의 원 \$x^2 \+ y^2 \= 4\$는 \$-2 \< x \< 2\$인 \$x\$값(예: \$x \= 0\$)에 대하여 \$y \= 2\$와 \$y \= \-2\$의 두 값이 대응하므로 함수의 그래프가 아니다.

```
{"question": {"status": "UNSUPPORTED", "reason": "함수 그래프 판별을 위한 5개 보기 패널 중 원 방정식과 무리·절댓값 그래프를 함께 격자로 묶는 composite-panels-v1 혼합 규격이 지원되지 않는다."}, "solution": {"status": "EXEMPT", "reason": "수직선 판정법으로 반례(x=0일 때 y=±2)를 들어 판별하므로 별도 해설 그림이 필요하지 않다."}}
```

```
{"sourceQid": 4, "variationType": "CONDITION", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-05", "subUnitKey": "H15-SB-05-IRRATIONAL_GRAPH", "conceptClusterKey": "", "primaryMethod": "수직선과 두 점 이상에서 만나는 도형(하나의 $x$에 두 개 이상의 $y$가 대응하는 원)을 함수가 아닌 것으로 가려낸다.", "decisiveStep": "원 $x^2+y^2=4$에서 $x=0$일 때 $y=\\pm 2$로 두 값이 대응함을 확인해 ②를 고른다.", "rpm": {"majorUnit": "함수", "midUnit": "무리함수", "l3": "무리함수의 그래프", "l4": "기본 그래프"}, "ptTplCandidate": {"problemTypeKey": "PT_FUNCTION_GRAPH_PROPERTIES", "templateKey": "TPL_FUNCTION_GRAPH_PROPERTY_JUDGMENT", "why": "high1.json H1-RPM-115(DIRECT_ACTIVE): 무리함수의 그래프/기본 그래프"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "함수의 정의(하나의 $x$에 하나의 $y$ 대응)를 그래프에 직접 적용해 판별하는 문항이다.", "level": "하", "item4slot": {"format": "옳지 않은 것 고르기", "slots": {"given": ["그래프", "원"], "goal": ["판정"], "method": ["수직선판정법"], "condition": []}}, "hold": ""}
```

## Q05

- 형식: 객관식  
- 배점: 4



### 발문



무리함수 \$y \= \\sqrt{2 - 3x}\$의 정의역이 \${x \\mid x \\le a}\$일 때, 상수 \$a\$의 값은? \[4.0점\]



### 선지



① \$-\\dfrac{3}{2}\$ ② \$-\\dfrac{2}{3}\$ ③ \$0\$ ④ \$\\dfrac{1}{3}\$ ⑤ \$\\dfrac{2}{3}\$



### 정답



⑤



### 해설



근호 안의 식이 \$0\$ 이상이어야 하므로 \$2 - 3x \\ge 0 \\implies 3x \\le 2 \\implies x \\le \\dfrac{2}{3}\$ \$\\therefore a \= \\dfrac{2}{3}\$

```
{"question": {"status": "EXEMPT", "reason": "발문에 그림이 없는 무리함수 정의역 문항이다."}, "solution": {"capability": "sqrt-affine-spike-v1", "graphPlan": {"family": "sqrt-affine", "radicand": ["2", "-3"], "amplitude": "1", "sign": 1, "offset": "0", "sourceDomain": {"kind": "NATURAL_SQRT_AFFINE"}, "domain": [-4, 1], "viewport": [-4, 2, -1, 4]}, "caption": "시작점이 (2/3, 0)이고 x≤2/3에서 정의되는 무리함수 y=√(2-3x)의 그래프이다."}}
```

```
{"sourceQid": 5, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-05", "subUnitKey": "H15-SB-05-IRRATIONAL_GRAPH", "conceptClusterKey": "", "primaryMethod": "근호 안의 일차식 $2-3x \\ge 0$ 부등식을 풀어 무리함수의 정의역을 구한다.", "decisiveStep": "$-3x \\ge -2$에서 부등호 방향이 바뀌어 $x \\le \\frac{2}{3}$를 얻는다.", "rpm": {"majorUnit": "함수", "midUnit": "무리함수", "l3": "무리함수의 그래프", "l4": "기본 그래프"}, "ptTplCandidate": {"problemTypeKey": "PT_FUNCTION_GRAPH_PROPERTIES", "templateKey": "TPL_FUNCTION_GRAPH_PROPERTY_JUDGMENT", "why": "high1.json H1-RPM-115(DIRECT_ACTIVE): 무리함수의 그래프/기본 그래프"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "근호 안이 $0$ 이상이라는 무리함수의 정의역 조건을 일차부등식으로 바로 푸는 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"given": ["무리함수"], "goal": ["매개변수", "값"], "method": ["정의역", "일차부등식"], "condition": []}}, "hold": ""}
```

## Q06

- 형식: 객관식  
- 배점: 4



### 발문



\$\\dfrac{1}{1 \\times 2} \+ \\dfrac{1}{2 \\times 3} \+ \\dfrac{1}{3 \\times 4} \+ \\cdots \+ \\dfrac{1}{11 \\times 12}\$의 값은? \[4.0점\]



### 선지



① \$\\dfrac{1}{12}\$ ② \$\\dfrac{5}{12}\$ ③ \$\\dfrac{7}{12}\$ ④ \$\\dfrac{11}{12}\$ ⑤ \$\\dfrac{13}{12}\$



### 정답



④



### 해설



\$\\dfrac{1}{k(k \+ 1)} \= \\dfrac{1}{k} - \\dfrac{1}{k \+ 1}\$을 이용하면 \$(\\text{준식}) \= \\left(1 - \\dfrac{1}{2}\\right) \+ \\left(\\dfrac{1}{2} - \\dfrac{1}{3}\\right) \+ \\cdots \+ \\left(\\dfrac{1}{11} - \\dfrac{1}{12}\\right)\$ \$= 1 - \\dfrac{1}{12} \= \\dfrac{11}{12}\$

```
{"status": "EXEMPT", "reason": "부분분수 분해와 소거로 계산되는 유리식 문항이므로 그림이 필요하지 않다."}
```

```
{"sourceQid": 6, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-04", "subUnitKey": "H15-SB-04-RATIONAL_GRAPH", "conceptClusterKey": "", "primaryMethod": "각 항 $\\frac{1}{k(k+1)}$을 부분분수 $\\frac{1}{k}-\\frac{1}{k+1}$로 분해하여 이웃한 항을 소거한다.", "decisiveStep": "망원합으로 중간 항이 모두 사라지고 처음 항 $1$과 마지막 항 $-\\frac{1}{12}$만 남는다.", "rpm": {"majorUnit": "함수", "midUnit": "유리함수", "l3": "유리함수의 그래프", "l4": "기본 그래프"}, "ptTplCandidate": {"problemTypeKey": "PT_RATIONAL_ASYMPTOTE", "templateKey": "TPL_RATIONAL_ASYMPTOTE_DIRECT", "why": "high1.json H1-RPM-108(DIRECT_ACTIVE): 유리함수의 그래프/기본 그래프"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "부분분수 변형 공식을 떠올려 연속 소거하는 표준 유형 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"given": ["유리식", "합"], "goal": ["값"], "method": ["부분분수", "망원합"], "condition": []}}, "hold": ""}
```

## Q07

- 형식: 객관식  
- 배점: 4



### 발문



함수 \$y \= \\dfrac{x \+ 2}{1 - x}\$에 대한 설명으로 옳지 않은 것은? \[4.0점\]



### 선지



① 함수 \$y \= \\dfrac{3}{x}\$의 그래프를 평행이동하여 겹쳐진다. ② 정의역은 \${x \\mid x \\ne 1}\$인 모든 실수이다. ③ 치역은 \${y \\mid y \\ne \-1}\$인 모든 실수이다. ④ 점근선의 교점은 \$(1, \-1)\$이다. ⑤ 직선 \$y \= x - 2\$에 대하여 대칭이다.



### 정답



①



### 해설



\$y \= \\dfrac{x \+ 2}{1 - x} \= \\dfrac{-x - 2}{x - 1} \= \\dfrac{-(x - 1\) - 3}{x - 1} \= \-1 - \\dfrac{3}{x - 1}\$ ① 표준형의 분자가 \$-3\$이므로 \$y \= \-\\dfrac{3}{x}\$의 그래프를 평행이동한 것이다. (거짓) ②, ③, ④ 점근선이 \$x \= 1\$, \$y \= \-1\$이므로 정의역은 \${x \\mid x \\ne 1}\$, 치역은 \${y \\mid y \\ne \-1}\$, 점근선의 교점은 \$(1, \-1)\$이다. (참) ⑤ 점 \$(1, \-1)\$을 지나고 기울기가 \$1\$인 직선은 \$y \+ 1 \= x - 1\$, 즉 \$y \= x - 2\$이다. (참)

```
{"question": {"status": "EXEMPT", "reason": "발문에 그림이 없는 유리함수 성질 판별 문항이다."}, "solution": {"capability": "rational-spike-v1", "graphPlan": {"family": "rational", "numerator": ["2", "1"], "denominator": ["1", "-1"], "sourceDomain": {"kind": "ALL_REALS"}, "domain": [-4, 6], "viewport": [-4, 6, -6, 4]}, "caption": "점근선이 x=1, y=-1이고 분자가 -3인 유리함수 y=(x+2)/(1-x)의 그래프이다."}}
```

```
{"sourceQid": 7, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-05", "subUnitKey": "H15-SB-05-IRRATIONAL_GRAPH", "conceptClusterKey": "", "primaryMethod": "분수함수 $y=\\frac{x+2}{1-x}$를 표준형 $-1-\\frac{3}{x-1}$로 변형하여 점근선·평행이동·대칭축을 판정한다.", "decisiveStep": "분자가 $-3$이므로 $y=\\frac{3}{x}$가 아니라 $y=-\\frac{3}{x}$의 평행이동임을 밝혀 ①을 고른다.", "rpm": {"majorUnit": "함수", "midUnit": "무리함수", "l3": "무리함수의 그래프", "l4": "기본 그래프"}, "ptTplCandidate": {"problemTypeKey": "PT_FUNCTION_GRAPH_PROPERTIES", "templateKey": "TPL_FUNCTION_GRAPH_PROPERTY_JUDGMENT", "why": "high1.json H1-RPM-115(DIRECT_ACTIVE): 무리함수의 그래프/기본 그래프"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "유리함수를 표준형으로 변형한 뒤 점근선, 대칭직선, 평행이동 여부를 함께 판정하는 표준 문항이다.", "level": "중", "item4slot": {"format": "옳지 않은 것 고르기", "slots": {"given": ["유리함수"], "goal": ["판정"], "method": ["점근선", "평행이동", "대칭성"], "condition": []}}, "hold": ""}
```

## Q08

- 형식: 객관식  
- 배점: 4.2



### 발문



함수 \$f(x) \= \\dfrac{1}{2}x^2 - x \+ \\dfrac{3}{2}\$ \$\\left(x \\ge 1\\right)\$의 역함수를 \$g(x)\$라 할 때, 두 함수 \$y \= f(x)\$, \$y \= g(x)\$의 그래프가 서로 다른 두 점 \$\\mathrm{P}\$, \$\\mathrm{Q}\$에서 만난다. 선분 \$\\mathrm{PQ}\$의 길이는? \[4.2점\]



### 선지



① \$\\sqrt{2}\$ ② \$\\sqrt{3}\$ ③ \$2\$ ④ \$\\sqrt{6}\$ ⑤ \$2\\sqrt{2}\$



### 정답



⑤



### 해설



\$f(x) \= \\dfrac{1}{2}(x - 1)^2 \+ 1\$은 정의역 \$x \\ge 1\$에서 증가하는 함수이므로 \$y \= f(x)\$와 \$y \= g(x)\$의 교점은 직선 \$y \= x\$ 위에 있다. \$\\dfrac{1}{2}x^2 - x \+ \\dfrac{3}{2} \= x\$ \$x^2 - 4x \+ 3 \= 0 \\implies (x - 1)(x - 3\) \= 0\$ 두 근 \$x \= 1, 3\$ 모두 \$x \\ge 1\$에 속하므로 두 교점은 \$\\mathrm{P}(1, 1)\$, \$\\mathrm{Q}(3, 3)\$이다. \$\\therefore \\overline{\\mathrm{PQ}} \= \\sqrt{(3 - 1)^2 \+ (3 - 1)^2} \= \\sqrt{8} \= 2\\sqrt{2}\$

```
{"question": {"status": "EXEMPT", "reason": "발문에 그림이 없는 이차함수와 역함수의 교점 거리 문항이다."}, "solution": {"capability": "multi-curve-figure-v1", "graphPlan": {"family": "multi-curve", "curves": [{"id": "f", "kind": "Y_OF_X", "coefficients": ["3/2", "-1", "1/2"], "domain": ["1", "4"], "label": "y=f(x)"}, {"id": "g", "kind": "X_OF_Y", "coefficients": ["3/2", "-1", "1/2"], "domain": ["1", "4"], "branch": "POSITIVE", "label": "y=g(x)"}], "overlays": {"lines": [{"id": "diag", "slope": "1", "intercept": "0"}], "points": [{"id": "P", "x": "1", "y": "1", "label": "P"}, {"id": "Q", "x": "3", "y": "3", "label": "Q"}]}, "axisTickValues": {"x": ["1", "3"], "y": ["1", "3"]}}, "caption": "증가함수 y=f(x)와 역함수 y=g(x)의 두 교점 P(1,1), Q(3,3)이 직선 y=x 위에 있다."}}
```

```
{"sourceQid": 8, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-03", "subUnitKey": "H15-SB-03-INVERSE_FUNCTION", "conceptClusterKey": "", "primaryMethod": "증가함수 $f$와 역함수 $g$의 교점이 $y=x$ 위에 있음을 이용해 $f(x)=x$를 풀고 두 교점 사이 거리를 구한다.", "decisiveStep": "$\\frac{1}{2}x^2-x+\\frac{3}{2}=x$에서 교점 $(1,1), (3,3)$을 구해 거리 $2\\sqrt{2}$를 계산한다.", "rpm": {"majorUnit": "함수", "midUnit": "함수", "l3": "역함수", "l4": "그래프 대칭"}, "ptTplCandidate": {"problemTypeKey": "PT_INVERSE_GRAPH", "templateKey": "TPL_INVERSE_GRAPH_INTERSECTION", "why": "high1.json H1-RPM-282(DIRECT_ACTIVE): 역함수/그래프 대칭"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "B23", "difficultyReason": "역함수 교점을 $y=x$와의 교점으로 환원하여 이차방정식과 두 점 사이 거리를 연결하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": ["이차함수", "역함수"], "goal": ["선분", "길이"], "method": ["이차방정식", "거리"], "condition": ["구간"]}}, "hold": ""}
```

## Q09

- 형식: 객관식  
- 배점: 4.2



### 발문



오른쪽 그림과 같이 정오각형의 꼭짓점 \$\\mathrm{P}\$, \$\\mathrm{Q}\$, \$\\mathrm{R}\$, \$\\mathrm{S}\$, \$\\mathrm{T}\$와 대각선들의 교점 \$5\$개가 있다. 서로 다른 점 \$10\$개 중에서 세 점을 꼭짓점으로 하는 모든 삼각형의 개수는? \[4.2점\]



### 선지



① \$80\$ ② \$100\$ ③ \$120\$ ④ \$140\$ ⑤ \$160\$



### 정답



②



### 해설



\$10\$개의 점 중에서 서로 다른 \$3\$개의 점을 택하는 전체 경우의 수는 \${}\_{10}C\_3 \= \\dfrac{10 \\times 9 \\times 8}{3 \\times 2 \\times 1} \= 120\$ 정오각형의 \$5\$개의 대각선 위에는 각각 꼭짓점 \$2\$개와 교점 \$2\$개, 총 \$4\$개의 점이 일직선 위에 놓인다. 한 대각선 위의 \$4\$개 점 중 \$3\$개를 택하면 삼각형이 되지 않으므로 제외할 경우의 수는 \$5 \\times {}\_4C\_3 \= 5 \\times 4 \= 20\$ \$\\therefore 120 - 20 \= 100\$

```
{"question": {"status": "UNSUPPORTED", "reason": "정오각형의 5개 꼭짓점과 내부 별 모양 대각선 교점 5개를 함께 그리는 전용 다각형-대각선 교점 모드가 지원되지 않는다."}, "solution": {"status": "EXEMPT", "reason": "전체 조합에서 대각선 5개 위 일직선 3점 조합을 빼는 여사건 계산이므로 별도 해설 그림은 필요하지 않다."}}
```

```
{"sourceQid": 9, "variationType": "CONTEXT", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-08", "subUnitKey": "H15-SB-08-COMBINATION_BASIC", "conceptClusterKey": "", "primaryMethod": "전체 $10$개 점 중 $3$개를 고르는 수 ${}_{10}C_3$에서 정오각형의 $5$개 대각선 위 일직선 $4$점 중 $3$점을 고르는 경우를 뺀다.", "decisiveStep": "일직선 위에 놓인 $4$점의 조합 $5 \\times {}_4C_3 = 20$을 $120$에서 제외한다.", "rpm": {"majorUnit": "경우의 수", "midUnit": "조합", "l3": "조합의 뜻과 계산", "l4": "조합 계산"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_SELECTION_DISTRIBUTION", "templateKey": "TPL_COMBINATION_SELECTION", "why": "high1.json H1-RPM-128(DIRECT_ACTIVE): 조합의 뜻과 계산/조합 계산"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "도형 위 점 선택에서 일직선 위 세 점의 공선 조건을 여사건으로 빼는 표준 조합 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": ["정다각형", "교점"], "goal": ["삼각형", "개수"], "method": ["조합", "여사건"], "condition": []}}, "hold": ""}
```

## Q10

- 형식: 객관식  
- 배점: 4.2



### 발문



두 집합 \$X \= {x \\mid \-2 \< x \< 5}\$, \$Y \= {y \\mid \-4 \< y \< 3}\$에 대하여 \$X\$에서 \$Y\$로의 함수 \$f(x) \= ax \+ b\$의 역함수가 존재할 때, 양수 \$b\$에 대하여 상수 \$a\$의 값은? \[4.2점\]



### 선지



① \$-3\$ ② \$-2\$ ③ \$-1\$ ④ \$1\$ ⑤ \$2\$



### 정답



③



### 해설



일차함수 \$f(x) \= ax \+ b\$가 \$X\$에서 \$Y\$로의 일대일대응이 되어야 하므로 두 구간의 길이 비에서 \$\|a\| \= \\dfrac{3 - (-4)}{5 - (-2)} \= \\dfrac{7}{7} \= 1\$ (1) \$a \= 1\$이면 증가함수이므로 \$f(-2) \= \-4 \\implies \-2 \+ b \= \-4 \\implies b \= \-2\$ (\$b \> 0\$에 모순) (2) \$a \= \-1\$이면 감소함수이므로 \$f(-2) \= 3 \\implies 2 \+ b \= 3 \\implies b \= 1 \> 0\$ (성립) \$\\therefore a \= \-1\$

```
{"question": {"status": "EXEMPT", "reason": "발문에 그림이 없는 일차함수의 일대일대응 조건 문항이다."}, "solution": {"capability": "composite-panels-v1", "panels": [{"capability": "piecewise-polynomial-spike-v1", "graphPlan": {"family": "piecewise-polynomial", "pieces": [{"domain": [-2, 5], "coefficients": ["1", "-1"]}], "overlays": {"lines": [{"id": "y1", "slope": "0", "intercept": "3"}, {"id": "y2", "slope": "0", "intercept": "-4"}]}, "domain": [-2, 5], "viewport": [-3, 6, -5, 4]}, "caption": "a=-1, b=1일 때 (-2,3)과 (5,-4)를 이어 일대일대응이 된다."}, {"capability": "piecewise-polynomial-spike-v1", "graphPlan": {"family": "piecewise-polynomial", "pieces": [{"domain": [-2, 5], "coefficients": ["-2", "1"]}], "overlays": {"lines": [{"id": "y1", "slope": "0", "intercept": "3"}, {"id": "y2", "slope": "0", "intercept": "-4"}]}, "domain": [-2, 5], "viewport": [-3, 6, -5, 4]}, "caption": "a=1이면 b=-2가 되어 양수 b 조건에 맞지 않는다."}], "caption": "a=-1일 때만 양수 b=1이 되어 열린구간 X에서 Y로의 일대일대응이 성립한다."}}
```

```
{"sourceQid": 10, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-03", "subUnitKey": "H15-SB-03-FUNCTION_RELATION", "conceptClusterKey": "", "primaryMethod": "두 열린구간의 길이가 $7$로 같으므로 $|a|=1$임을 구한 뒤, $a=1$과 $a=-1$ 중 $b>0$을 만족하는 경우를 선택한다.", "decisiveStep": "$a=1$일 때 $b=-2<0$으로 탈락하고 $a=-1$일 때 $b=1>0$이 성립함을 보인다.", "rpm": {"majorUnit": "함수", "midUnit": "함수", "l3": "함수의 성질", "l4": "일대일함수"}, "ptTplCandidate": {"problemTypeKey": "PT_FUNCTION_COUNTING", "templateKey": "TPL_MONOTONE_FUNCTION_COUNT", "why": "high1.json H1-RPM-284(DIRECT_ACTIVE): 함수의 성질/일대일함수"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "CASE_BRANCH", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "구간 사이의 일차함수 일대일대응 조건을 증가·감소 두 경우로 나누어 부호 조건으로 거르는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": ["집합", "일차함수", "역함수"], "goal": ["매개변수", "값"], "method": ["일대일대응", "경우분류"], "condition": ["양수", "구간"]}}, "hold": ""}
```

## Q11

- 형식: 객관식  
- 배점: 4.2



### 발문



유리함수 \$y \= f(x)\$의 그래프의 두 점근선의 교점이 \$(3, 4)\$이고 \$1 \\le x \\le 2\$에서 최댓값이 \$2\$일 때, \$f(5)\$의 값은? \[4.2점\]



### 선지



① \$6\$ ② \$\\dfrac{13}{2}\$ ③ \$7\$ ④ \$\\dfrac{15}{2}\$ ⑤ \$8\$



### 정답



①



### 해설



두 점근선이 \$x \= 3\$, \$y \= 4\$이므로 \$f(x) \= \\dfrac{a}{x - 3} \+ 4\$ (\$a \\ne 0\$)로 놓을 수 있다. \$1 \\le x \\le 2\$에서 \$x - 3 \< 0\$이다. 만약 \$a \< 0\$이면 \$\\dfrac{a}{x - 3} \> 0\$이므로 \$f(x) \> 4\$가 되어 최댓값이 \$2\$일 수 없다. 따라서 \$a \> 0\$이고, 이 구간에서 \$f(x)\$는 감소하므로 \$x \= 1\$에서 최댓값을 갖는다. \$f(1) \= \\dfrac{a}{1 - 3} \+ 4 \= 2 \\implies \-\\dfrac{a}{2} \= \-2 \\implies a \= 4\$ \$\\therefore f(5) \= \\dfrac{4}{5 - 3} \+ 4 \= 2 \+ 4 \= 6\$

```
{"question": {"status": "EXEMPT", "reason": "발문에 그림이 없는 유리함수 최대·최소 문항이다."}, "solution": {"capability": "rational-spike-v1", "graphPlan": {"family": "rational", "numerator": ["-8", "4"], "denominator": ["-3", "1"], "sourceDomain": {"kind": "ALL_REALS"}, "domain": [-1, 7], "viewport": [-1, 7, -1, 9]}, "caption": "점근선이 x=3, y=4이고 1≤x≤2에서 감소하여 최댓값 f(1)=2를 갖는 유리함수 y=4/(x-3)+4의 그래프이다."}}
```

```
{"sourceQid": 11, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-04", "subUnitKey": "H15-SB-04-RATIONAL_APPLICATION", "conceptClusterKey": "", "primaryMethod": "점근선 교점 $(3,4)$로 $f(x)=\\frac{a}{x-3}+4$를 세우고, 최댓값 $2<4$ 조건으로 $a>0$ 및 감소성을 판정해 $f(1)=2$로 $a$를 구한다.", "decisiveStep": "$1\\le x\\le 2$에서 최댓값이 $4$보다 작으므로 $a>0$이고 $x=1$에서 최댓값 $2$를 가짐을 결정한다.", "rpm": {"majorUnit": "함수", "midUnit": "유리함수", "l3": "유리함수의 활용", "l4": "유리함수와 그래프의 교점"}, "ptTplCandidate": {"problemTypeKey": "PT_FUNCTION_GRAPH_INTERSECTION", "templateKey": "TPL_FUNCTION_INTERSECTION_TWO_FUNCTIONS", "why": "high1.json H1-RPM-114(DIRECT_ACTIVE): 유리함수의 활용/유리함수와 그래프의 교점"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "유리함수의 점근선 식 설정 후 부호 조건으로 증감을 판정해 미지수를 구하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": ["유리함수", "점근선"], "goal": ["함숫값"], "method": ["유리함수", "최댓값"], "condition": ["구간"]}}, "hold": ""}
```

## Q12

- 형식: 객관식  
- 배점: 4.4



### 발문



\$garden\$에 있는 \$6\$개의 문자를 모두 한 번씩 사용하여 사전식으로 배열할 때, \$275\$번째 오는 문자열은? \[4.4점\]



### 선지



① \$edgnar\$ ② \$edgnra\$ ③ \$edgarn\$ ④ \$edgran\$ ⑤ \$edgrna\$



### 정답



④



### 해설



알파벳 순서로 나열하면 \$a \< d \< e \< g \< n \< r\$이다. • 첫 글자가 \$a\$, \$d\$인 문자열의 개수는 각각 \$5\! \= 120\$개씩이므로 총 \$240\$개다. • \$275\$번째 문자열은 \$e\$로 시작하는 문자열 중 \$275 - 240 \= 35\$번째이다. • \$ea\$로 시작하는 문자열은 \$4\! \= 24\$개이므로, \$ed\$로 시작하는 문자열 중 \$35 - 24 \= 11\$번째이다. • \$eda\$로 시작하는 문자열은 \$3\! \= 6\$개이므로, \$edg\$로 시작하는 문자열 중 \$11 - 6 \= 5\$번째이다. 남은 문자 \$a, n, r\$의 사전식 배열: \$edganr(1)\$, \$edgarn(2)\$, \$edgnar(3)\$, \$edgnra(4)\$, \$edgran(5)\$ 따라서 \$275\$번째 문자열은 \$edgran\$이다.

```
{"status": "EXEMPT", "reason": "사전식 배열의 순번을 계승 블록으로 계산하는 순열 문항이므로 그림이 필요하지 않다."}
```

```
{"sourceQid": 12, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-07", "subUnitKey": "H15-SB-07-PERMUTATION_BASIC", "conceptClusterKey": "", "primaryMethod": "알파벳 순서를 정하고 앞 글자를 고정한 블록 크기($5!, 4!, 3!$)를 차례로 빼며 $275$번째 문자열을 추적한다.", "decisiveStep": "$240$($a,d$), $24$($ea$), $6$($eda$)을 차례로 빼서 $edg$ 블록의 $5$번째를 찾는다.", "rpm": {"majorUnit": "경우의 수", "midUnit": "경우의 수와 순열", "l3": "순열", "l4": "일렬 배열"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_ARRANGEMENT", "templateKey": "TPL_H1_ARRANGEMENT_LEXICOGRAPHIC_RANK", "why": "high1.json H1-RPM-283(DIRECT_ACTIVE): 순열/일렬 배열"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "사전식 배열에서 각 자리 고정 시의 계승 블록 크기를 계산해 정확한 순번을 찾는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": ["사전식배열"], "goal": ["사전식순위"], "method": ["순열", "팩토리얼"], "condition": ["순서"]}}, "hold": ""}
```

## Q13

- 형식: 객관식  
- 배점: 4.4



### 발문



역함수가 존재하는 함수 \$f(x)\$에 대하여 \$f(2 - x) \= 2x \+ a\$이고 \$f^{-1}(-2) \= 3\$일 때, 함수 \$y \= f^{-1}(x)\$의 그래프와 \$x\$축 및 \$y\$축으로 둘러싸인 부분의 넓이는? (단, \$a\$는 상수이다.) \[4.4점\]



### 선지



① \$3\$ ② \$4\$ ③ \$5\$ ④ \$6\$ ⑤ \$7\$



### 정답



②



### 해설



\$t \= 2 - x\$로 놓으면 \$x \= 2 - t\$이므로 \$f(t) \= 2(2 - t) \+ a \= \-2t \+ 4 \+ a\$, 즉 \$f(x) \= \-2x \+ 4 \+ a\$ \$f^{-1}(-2) \= 3 \\iff f(3) \= \-2\$이므로 \$-6 \+ 4 \+ a \= \-2 \\implies a \= 0\$ 따라서 \$f(x) \= \-2x \+ 4\$이고, 역함수는 \$f^{-1}(x) \= \-\\dfrac{1}{2}x \+ 2\$이다. \$y \= f^{-1}(x)\$의 \$x\$절편은 \$4\$, \$y\$절편은 \$2\$이므로 좌표축과 둘러싸인 삼각형의 넓이는 \$\\dfrac{1}{2} \\times 4 \\times 2 \= 4\$

```
{"question": {"status": "EXEMPT", "reason": "발문에 그림이 없는 합성형 일차함수와 역함수의 넓이 문항이다."}, "solution": {"capability": "piecewise-polynomial-spike-v1", "graphPlan": {"family": "piecewise-polynomial", "pieces": [{"domain": [-1, 5], "coefficients": ["2", "-1/2"]}], "overlays": {"points": [{"id": "O", "x": "0", "y": "0", "label": "O"}, {"id": "A", "x": "4", "y": "0", "label": "A"}, {"id": "B", "x": "0", "y": "2", "label": "B"}], "polygons": [{"id": "tri", "points": ["O", "A", "B"]}]}, "domain": [-1, 5], "viewport": [-1, 5, -1, 3]}, "caption": "역함수 y=-x/2+2의 그래프와 x축, y축으로 둘러싸인 직각삼각형 OAB의 넓이가 4이다."}}
```

```
{"sourceQid": 13, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-03", "subUnitKey": "H15-SB-03-INVERSE_FUNCTION", "conceptClusterKey": "", "primaryMethod": "$2-x=t$ 치환으로 $f(x)$의 식을 구하고 $f(3)=-2$로 $a=0$을 확정한 뒤 역함수 $f^{-1}(x)$의 두 절편으로 넓이를 구한다.", "decisiveStep": "$f^{-1}(x)=-\\frac{1}{2}x+2$의 절편 $4, 2$를 구해 삼각형 넓이 $4$를 계산한다.", "rpm": {"majorUnit": "함수", "midUnit": "함수", "l3": "역함수", "l4": "그래프 대칭"}, "ptTplCandidate": {"problemTypeKey": "PT_INVERSE_GRAPH", "templateKey": "TPL_INVERSE_GRAPH_GEOMETRY", "why": "high1.json H1-RPM-105(DIRECT_ACTIVE): 역함수/그래프 대칭"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "치환을 통한 일차함수 복원, 역함수 계산, 좌표축 삼각형 넓이를 순차적으로 결합한 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": ["일차함수", "역함수"], "goal": ["넓이"], "method": ["치환", "역함수", "넓이"], "condition": []}}, "hold": ""}
```

## Q14

- 형식: 객관식  
- 배점: 4.4



### 발문



\$0\$이 아닌 세 실수 \$a, b, c\$에 대하여 \$\\dfrac{a - 3b - 3c}{a} \= \\dfrac{-3a \+ b - 3c}{b} \= \\dfrac{-3a - 3b \+ c}{c}\$가 성립할 때, \$a\\left(\\dfrac{1}{b} \+ \\dfrac{1}{c}\\right) \+ b\\left(\\dfrac{1}{a} \+ \\dfrac{1}{c}\\right) \+ c\\left(\\dfrac{1}{a} \+ \\dfrac{1}{b}\\right)\$의 값으로 가능한 모든 수의 합은? \[4.4점\]



### 선지



① \$-6\$ ② \$-3\$ ③ \$0\$ ④ \$1\$ ⑤ \$3\$



### 정답



⑤



### 해설



세 비의 공통값을 \$k\$라 두면 \$(1 - k)a \= 3(b \+ c)\$, \$(1 - k)b \= 3(a \+ c)\$, \$(1 - k)c \= 3(a \+ b)\$ 세 식을 변끼리 모두 더하면 \$(1 - k)(a \+ b \+ c) \= 6(a \+ b \+ c)\$ \$(k \+ 5)(a \+ b \+ c) \= 0\$ (1) \$a \+ b \+ c \\ne 0\$이면 \$k \= \-5\$이므로 \$6a \= 3(b \+ c) \\implies b \+ c \= 2a\$, 마찬가지로 \$a \+ c \= 2b\$, \$a \+ b \= 2c\$ 구하는 식 \$= \\dfrac{b \+ c}{a} \+ \\dfrac{a \+ c}{b} \+ \\dfrac{a \+ b}{c} \= 2 \+ 2 \+ 2 \= 6\$ (2) \$a \+ b \+ c \= 0\$이면 \$b \+ c \= \-a\$, \$a \+ c \= \-b\$, \$a \+ b \= \-c\$ 구하는 식 \$= \-1 - 1 - 1 \= \-3\$ \$\\therefore 6 \+ (-3) \= 3\$

```
{"status": "EXEMPT", "reason": "연비의 가비의 리와 경우 분기를 이용한 대칭 유리식 계산이므로 그림이 필요하지 않다."}
```

```
{"sourceQid": 14, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-06", "subUnitKey": "H15-SB-06-COUNTING_PRINCIPLE", "conceptClusterKey": "", "primaryMethod": "세 비의 값을 $k$로 두고 세 식을 더하여 $(k+5)(a+b+c)=0$을 얻은 뒤, $a+b+c=0$인 경우와 $a+b+c\\ne 0$인 경우로 나누어 계산한다.", "decisiveStep": "두 경우에서 준식의 값이 각각 $6$과 $-3$임을 구해 합 $3$을 얻는다.", "rpm": {"majorUnit": "경우의 수", "midUnit": "경우의 수와 순열", "l3": "합·곱의 법칙", "l4": "경우를 나누어 세기"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COUNTING_PRINCIPLE_GENERAL", "templateKey": "TPL_H1_COUNTING_DIRECT_CASE", "why": "high1.json H1-RPM-122(DIRECT_ACTIVE): 합·곱의 법칙/경우를 나누어 세기"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "CASE_BRANCH", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "$a+b+c=0$일 때와 $0$이 아닐 때의 경우 분기를 놓치기 쉬운 비례식 핵심 변별 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"given": ["비례식", "유리식"], "goal": ["식의값", "합"], "method": ["치환", "경우분류"], "condition": ["실수"]}}, "hold": ""}
```

## Q15

- 형식: 객관식  
- 배점: 4.4



### 발문



H 고등학교는 수학여행 일정을 짜고 있다. 아래 제시된 \$8\$개의 체험 중 총 \$4\$가지 체험을 선택하되, 각 테마별로 \$1\$가지 이상의 체험을 하도록 시간순으로 일정을 계획하는 모든 경우의 수는? \[4.4점\]

| 테마 | 레저 스포츠 (2개) | 놀이공원 (2개) | 관람 (4개) |
| :---- | :---- | :---- | :---- |
| 체험 종류 | 카약 보트 체험, 제트 보트 체험 | 카트 체험, 서바이벌 체험 | 서커스, 아쿠아리움, 해안탐방, 박물관 |



### 선지



① \$480\$ ② \$720\$ ③ \$960\$ ④ \$1080\$ ⑤ \$1440\$



### 정답



③



### 해설



세 테마에서 각각 \$1\$개 이상씩 총 \$4\$개를 고르므로 테마별 선택 개수는 \$(2, 1, 1)\$, \$(1, 2, 1)\$, \$(1, 1, 2)\$ 중 하나이다. • \$(2, 1, 1)\$: \${}\_2C\_2 \\times {}\_2C\_1 \\times {}\_4C\_1 \= 1 \\times 2 \\times 4 \= 8\$ • \$(1, 2, 1)\$: \${}\_2C\_1 \\times {}\_2C\_2 \\times {}\_4C\_1 \= 2 \\times 1 \\times 4 \= 8\$ • \$(1, 1, 2)\$: \${}\_2C\_1 \\times {}\_2C\_1 \\times {}\_4C\_2 \= 2 \\times 2 \\times 6 \= 24\$ 고른 \$4\$개의 체험을 시간순으로 배열하는 방법은 \$4\! \= 24\$가지이므로 \$\\therefore (8 \+ 8 \+ 24\) \\times 4\! \= 40 \\times 24 \= 960\$

```
{"status": "EXEMPT", "reason": "표로 제시된 조건을 조합과 순열의 곱으로 계산하는 문항이므로 그림이 필요하지 않다."}
```

```
{"sourceQid": 15, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-07", "subUnitKey": "H15-SB-07-PERMUTATION_RESTRICTED", "conceptClusterKey": "", "primaryMethod": "세 테마에서 적어도 $1$개씩 총 $4$개를 고르는 조합을 $(2,1,1), (1,2,1), (1,1,2)$로 나누어 구한 뒤 시간순 배열 $4!$를 곱한다.", "decisiveStep": "조합 합 $40$가지에 배열 $4!=24$를 곱해 $960$을 구한다.", "rpm": {"majorUnit": "경우의 수", "midUnit": "경우의 수와 순열", "l3": "순열", "l4": "특정 조건 배열"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_ARRANGEMENT", "templateKey": "TPL_PERMUTATION_STANDARD_CONSTRAINT", "why": "high1.json H1-RPM-125(DIRECT_ACTIVE): 순열/특정 조건 배열"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "분류별 조합 선택 후 순열 배열($4!$)을 결합하는 표준 뽑기-나열 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": ["조합"], "goal": ["개수"], "method": ["조합", "순열", "경우분류"], "condition": []}}, "hold": ""}
```

## Q16

- 형식: 객관식  
- 배점: 4.6



### 발문



실수 \$p, q\$ \$(p \\ge 0)\$에 대하여 함수 \$f(x) \= \\begin{cases} \\sqrt{x - p} & (x \\ge p) \\ \\left\|\\dfrac{1}{x} \+ q\\right\| & (x \< p) \\end{cases}\$이다. 실수 \$t\$에 대하여 함수 \$y \= f(x)\$의 그래프와 직선 \$y \= t\$의 교점의 개수를 \$g(t)\$라 하면 \${t \\mid g(t) \= 2} \= {t \\mid 0 \< t \\le 4}\$일 때, \$p - q\$의 값으로 가능한 모든 수의 합은? \[4.6점\]



### 선지



① \$\\dfrac{9}{2}\$ ② \$\\dfrac{19}{4}\$ ③ \$5\$ ④ \$\\dfrac{21}{4}\$ ⑤ \$\\dfrac{11}{2}\$



### 정답



①



### 해설



\$x \\ge p\$인 무리함수 부분은 \$t \\ge 0\$인 모든 \$t\$에 대하여 직선 \$y \= t\$와 교점을 정확히 \$1\$개 갖는다. 따라서 \$g(t) \= 2\$가 되려면 \$x \< p\$인 부분의 그래프와 \$y \= t\$가 정확히 \$1\$개의 교점을 가져야 한다. (1) \$p \= 0\$이면 \$x \< 0\$에서 \$u \= \\dfrac{1}{x} \+ q\$의 치역은 \$(-\\infty, q)\$이다. 이때 \$\|u\| \= t\$의 해가 정확히 \$1\$개인 \$t \> 0\$의 집합은 \$q \> 0\$이면 \$\[q, \\infty)\$, \$q \\le 0\$이면 \$(-q, \\infty)\$가 되어 조건을 만족할 수 없다. (2) \$p \> 0\$이면 \$x \< 0\$에서 \$u \< q\$, \$0 \< x \< p\$에서 \$u \> q \+ \\dfrac{1}{p}\$이므로, \$u\$가 가질 수 없는 구간은 \$\\left\[q, q \+ \\dfrac{1}{p}\\right\]\$이다. \$\|u\| \= t\$의 해가 오직 \$0 \< t \\le 4\$에서만 \$1\$개가 되려면 빠진 구간의 한 끝이 \$0\$이고 다른 끝과의 거리(또는 대칭)가 \$4\$여야 한다. • \$q \= 0\$일 때: \$u \< 0\$ 또는 \$u \> \\dfrac{1}{p}\$이므로 \$0 \< t \\le \\dfrac{1}{p}\$에서 \$\|u\| \= t\$의 해가 \$1\$개다. 따라서 \$\\dfrac{1}{p} \= 4 \\implies p \= \\dfrac{1}{4}\$, \$p - q \= \\dfrac{1}{4}\$. • \$q \+ \\dfrac{1}{p} \= 0\$일 때: \$u \< \-\\dfrac{1}{p}\$ 또는 \$u \> 0\$이므로 \$0 \< t \\le \\dfrac{1}{p}\$에서 \$\|u\| \= t\$의 해가 \$1\$개다. 따라서 \$p \= \\dfrac{1}{4}\$, \$q \= \-4\$, \$p - q \= \\dfrac{17}{4}\$. \$\\therefore \\dfrac{1}{4} \+ \\dfrac{17}{4} \= \\dfrac{18}{4} \= \\dfrac{9}{2}\$

```
{"question": {"status": "EXEMPT", "reason": "발문에 그림이 없는 조각함수 교점 개수 조건 문항이다."}, "solution": {"status": "UNSUPPORTED", "reason": "y=|1/x+q|의 절댓값 반사 유리함수와 무리함수 조각의 치역·교점 개수를 동시에 나타내는 혼합 그래프 모드가 지원되지 않는다."}}
```

```
{"sourceQid": 16, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-05", "subUnitKey": "H15-SB-05-IRRATIONAL_GRAPH", "conceptClusterKey": "", "primaryMethod": "$x\\ge p$의 교점 $1$개를 분리한 뒤, $x<p$에서 $u=\\frac{1}{x}+q$의 빠진 치역 구간 $[q, q+\\frac{1}{p}]$를 이용해 $|u|=t$의 해가 $1$개인 범위가 $(0,4]$가 되는 두 경우를 구한다.", "decisiveStep": "치역 공백 $[q, q+\\frac{1}{p}]$에서 $q=0$ 또는 $q+\\frac{1}{p}=0$ 두 경우만이 $(0,4]$ 조건을 만족함을 밝혀 $p-q=\\frac{1}{4}, \\frac{17}{4}$를 얻는다.", "rpm": {"majorUnit": "함수", "midUnit": "무리함수", "l3": "무리함수의 그래프", "l4": "기본 그래프"}, "ptTplCandidate": {"problemTypeKey": "PT_FUNCTION_GRAPH_PROPERTIES", "templateKey": "TPL_FUNCTION_GRAPH_PROPERTY_JUDGMENT", "why": "high1.json H1-RPM-115(DIRECT_ACTIVE): 무리함수의 그래프/기본 그래프"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "DEEP_COMPOSITE", "difficultyBucket": 5, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "무리함수와 절댓값 유리함수 조각의 치역 공백을 해석해 교점 개수 집합을 역추적해야 하는 최고난도 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"given": ["조각함수", "무리함수", "유리함수", "절댓값"], "goal": ["매개변수", "합"], "method": ["치역", "경우분류", "교점"], "condition": ["실수", "구간"]}}, "hold": ""}
```

## Q17

- 형식: 객관식  
- 배점: 4.8



### 발문



아래 그림의 영역 \$\\mathrm{A}\$, \$\\mathrm{B}\$, \$\\mathrm{C}\$, \$\\mathrm{D}\$, \$\\mathrm{E}\$, \$\\mathrm{F}\$, \$\\mathrm{G}\$ \$7\$개를 서로 다른 \$4\$가지의 색으로 칠하려고 한다. 같은 색을 여러 번 사용해도 좋으나 인접하는 영역은 서로 다른 색으로 칠하는 모든 방법의 수는? \[4.8점\]



### 선지



① \$1260\$ ② \$1380\$ ③ \$1440\$ ④ \$1560\$ ⑤ \$1620\$



### 정답



②



### 해설



바깥쪽은 \$\\mathrm{A}-\\mathrm{B}-\\mathrm{C}-\\mathrm{D}-\\mathrm{E}-\\mathrm{F}-\\mathrm{A}\$ 순으로 인접하고, 가운데 \$\\mathrm{G}\$는 \$\\mathrm{B}, \\mathrm{D}, \\mathrm{F}\$와 인접한다. 먼저 \$\\mathrm{G}\$에 칠할 색을 고르는 방법은 \$4\$가지이다. \$\\mathrm{B}, \\mathrm{D}, \\mathrm{F}\$는 \$\\mathrm{G}\$와 다른 나머지 \$3\$가지 색 중 하나씩을 칠한다. (1) \$\\mathrm{B}, \\mathrm{D}, \\mathrm{F}\$가 모두 같은 색인 경우: \$3\$가지. 이때 \$\\mathrm{A}, \\mathrm{C}, \\mathrm{E}\$는 양옆의 같은 색 \$1\$가지만 피하면 되므로 각각 \$3\$가지씩: \$3 \\times 3^3 \= 81\$가지. (2) \$\\mathrm{B}, \\mathrm{D}, \\mathrm{F}\$ 중 정확히 \$2\$개만 같은 색인 경우: 같은 색일 \$2\$개 영역 선택 \${}\_3C\_2 \= 3\$가지, 색 선택 \$3 \\times 2 \= 6\$가지로 총 \$18\$가지. 이때 같은 두 영역 사이의 바깥 영역은 \$3\$가지, 나머지 두 바깥 영역은 양옆의 서로 다른 \$2\$색을 피하므로 각각 \$2\$가지씩: \$18 \\times (3 \\times 2 \\times 2\) \= 216\$가지. (3) \$\\mathrm{B}, \\mathrm{D}, \\mathrm{F}\$가 모두 다른 색인 경우: \$3\! \= 6\$가지. \$\\mathrm{A}, \\mathrm{C}, \\mathrm{E}\$는 각각 양옆의 서로 다른 \$2\$색을 피하므로 \$2\$가지씩: \$6 \\times 2^3 \= 48\$가지. \$\\therefore 4 \\times (81 \+ 216 \+ 48\) \= 4 \\times 345 \= 1380\$

```
{"question": {"status": "UNSUPPORTED", "reason": "가운데 영역 G가 B, D, F와 인접하고 바깥 6개 영역 A~F가 순환 인접한 평면 분할 도식은 SVG 엔진 지원 대상이 아니다."}, "solution": {"status": "EXEMPT", "reason": "중심 영역 G와 B, D, F의 색 일치 여부로 경우를 나누어 곱셈으로 계산한다."}}
```

```
{"sourceQid": 17, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-06", "subUnitKey": "H15-SB-06-COUNTING_PRINCIPLE", "conceptClusterKey": "", "primaryMethod": "가운데 영역 $\\mathrm{G}$의 색($4$가지)을 먼저 정한 뒤, $\\mathrm{G}$와 인접한 $\\mathrm{B, D, F}$의 색이 모두 같음·2개만 같음·모두 다름의 3가지 경우로 나누어 센다.", "decisiveStep": "$\\mathrm{B,D,F}$의 색 배열을 3가지(81, 216, 48)로 분류해 합산한 뒤 $\\mathrm{G}$의 $4$가지를 곱한다.", "rpm": {"majorUnit": "경우의 수", "midUnit": "경우의 수와 순열", "l3": "합·곱의 법칙", "l4": "경우를 나누어 세기"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COUNTING_PRINCIPLE_GENERAL", "templateKey": "TPL_H1_COUNTING_DIRECT_CASE", "why": "high1.json H1-RPM-122(DIRECT_ACTIVE): 합·곱의 법칙/경우를 나누어 세기"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "CASE_BRANCH", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "인접 영역의 색 같음/다름에 따라 인접한 바깥 영역의 선택지가 달라지는 3분기 색칠 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"given": ["영역", "도형"], "goal": ["개수"], "method": ["곱의법칙", "경우분류"], "condition": ["인접"]}}, "hold": ""}
```

## Q18

- 형식: 서답형  
- 배점: 4



### 발문



\<단답형 1\> \$0 \\le x \\le 4\$에서 정의된 두 함수 \$y \= f(x)\$, \$y \= g(x)\$의 그래프가 다음 그림과 같을 때, 함수 \$(g \\circ f)(x) \= 2\$를 만족시키는 모든 \$x\$값들의 합을 구하시오. \[4.0점\]



### 선지



없음



### 정답



\$\\dfrac{31}{12}\$



### 해설



그림에서 \$f(x) \= \\begin{cases} 2x & (0 \\le x \\le 2\) \\ 4 & (2 \< x \\le 4\) \\end{cases}\$이고, \$g(u)\$는 \$(0,0), (1,3), (2,1), (4,3)\$을 차례로 선분으로 이은 함수이다. 먼저 \$g(u) \= 2\$를 만족하는 \$u\$를 각 구간에서 구하면 • \$0 \\le u \\le 1\$: \$3u \= 2 \\implies u \= \\dfrac{2}{3}\$ • \$1 \< u \\le 2\$: \$-2u \+ 5 \= 2 \\implies u \= \\dfrac{3}{2}\$ • \$2 \< u \\le 4\$: \$u - 1 \= 2 \\implies u \= 3\$ 이제 \$f(x) \= \\dfrac{2}{3}, \\dfrac{3}{2}, 3\$을 만족하는 \$x\$를 구하면 \$2 \< x \\le 4\$에서는 \$f(x) \= 4\$이므로 해가 없고, \$0 \\le x \\le 2\$에서 \$2x \= u\$이므로 \$x \= \\dfrac{1}{3},; \\dfrac{3}{4},; \\dfrac{3}{2}\$ \$\\therefore \\dfrac{1}{3} \+ \\dfrac{3}{4} \+ \\dfrac{3}{2} \= \\dfrac{4 \+ 9 \+ 18}{12} \= \\dfrac{31}{12}\$

```
{"question": {"status": "UNSUPPORTED", "reason": "f(x)와 3조각 꺾은선 g(x) 두 그래프를 함께 그리는 다중 꺾은선 그래프는 지원되지 않는다."}, "solution": {"status": "EXEMPT", "reason": "발문 그래프에서 g(u)=2의 해와 f(x)=u의 해를 역추적하여 더하는 계산이다."}}
```

```
{"sourceQid": 18, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-03", "subUnitKey": "H15-SB-03-COMPOSITE_FUNCTION", "conceptClusterKey": "", "primaryMethod": "그래프에서 $g(u)=2$가 되는 $u=\\frac{2}{3}, \\frac{3}{2}, 3$을 먼저 찾은 뒤 각 $u$에 대해 $f(x)=u$를 만족하는 $x$를 구해 더한다.", "decisiveStep": "$g(u)=2$의 세 해 $u=\\frac{2}{3}, \\frac{3}{2}, 3$을 $f(x)=2x$에 대입해 $x=\\frac{1}{3}, \\frac{3}{4}, \\frac{3}{2}$를 얻는다.", "rpm": {"majorUnit": "함수", "midUnit": "함수", "l3": "합성함수", "l4": "합성함수 계산"}, "ptTplCandidate": {"problemTypeKey": "PT_COMPOSITION_EVALUATION", "templateKey": "TPL_COMPOSITION_VALUE_DIRECT", "why": "high1.json H1-RPM-102(DIRECT_ACTIVE): 합성함수/합성함수 계산"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "꺾은선 그래프 두 개에서 합성방정식 $g(f(x))=2$를 역순으로 분해하여 해를 구하는 문항이다.", "level": "중", "item4slot": {"format": "단답", "slots": {"given": ["조각함수", "그래프", "합성함수"], "goal": ["해", "합"], "method": ["합성함수", "일차방정식"], "condition": ["구간"]}}, "hold": ""}
```

## Q19

- 형식: 서답형  
- 배점: 5



### 발문



\<단답형 2\> 그림과 같은 \$7\$개의 사물함(위층 \$3\$개, 아래층 \$4\$개) 중 \$5\$개의 사물함 대신 \$4\$개의 사물함을 남학생 \$2\$명과 여학생 \$2\$명에게 각각 \$1\$개씩 배정하려고 한다. 다음 조건을 만족시키도록 사물함을 배정하는 모든 경우의 수를 구하시오. \[5.0점\]

> (가) 남학생 \$2\$명이 같은 층의 사물함을 사용할 경우 서로 이웃한다. (나) 같은 층에서는 남학생과 여학생의 사물함이 서로 이웃하지 않는다.



### 선지



없음



### 정답



\$180\$



### 해설



2층에는 사물함이 \$3\$개, 1층에는 \$4\$개가 가로로 놓여 있다. (1) 남학생 \$2\$명이 모두 2층을 사용하는 경우: 이웃한 \$2\$칸을 고르는 방법은 \$2\$가지, 남학생 배열은 \$2\!\$가지. 2층 남은 \$1\$칸은 남학생과 이웃하므로 여학생은 1층 \$4\$칸 중 \$2\$칸에 배정(\${}\_4P\_2 \= 12\$). \$2 \\times 2\! \\times 12 \= 48\$ (2) 남학생 \$2\$명이 모두 1층을 사용하는 경우: • 양 끝 쌍 (1,2) 또는 (3,4)를 쓰는 경우(\$2\$가지): 1층 남학생과 이웃하지 않는 칸 \$1\$개와 2층 \$3\$칸, 총 \$4\$칸에 여학생 배정(\${}\_4P\_2 \= 12\$) \$\\implies 2 \\times 2\! \\times 12 \= 48\$ • 가운데 쌍 (2,3)을 쓰는 경우(\$1\$가지): 1층 나머지 칸 모두 이웃하므로 2층 \$3\$칸에만 여학생 배정(\${}\_3P\_2 \= 6\$) \$\\implies 1 \\times 2\! \\times 6 \= 12\$ (3) 남학생 \$2\$명이 서로 다른 층을 사용하는 경우(층 배정 \$2\!\$가지): • 2층 끝(\$2\$곳), 1층 끝(\$2\$곳): 여학생 가능 칸 \$1 \+ 2 \= 3\$칸 \$\\implies 4 \\times {}\_3P\_2 \= 24\$ • 2층 끝(\$2\$곳), 1층 가운데(\$2\$곳): 여학생 가능 칸 \$1 \+ 1 \= 2\$칸 \$\\implies 4 \\times {}\_2P\_2 \= 8\$ • 2층 가운데(\$1\$곳), 1층 끝(\$2\$곳): 여학생 가능 칸 \$0 \+ 2 \= 2\$칸 \$\\implies 2 \\times {}\_2P\_2 \= 4\$ • 2층 가운데(\$1\$곳), 1층 가운데(\$2\$곳): 여학생 가능 칸 \$0 \+ 1 \= 1\$칸 \$\\implies 0\$가지 따라서 \$2\! \\times (24 \+ 8 \+ 4\) \= 72\$ \$\\therefore 48 \+ 48 \+ 12 \+ 72 \= 180\$

```
{"question": {"status": "UNSUPPORTED", "reason": "2층 3칸·1층 4칸 사물함 배치도는 SVG 엔진 지원 대상이 아니다."}, "solution": {"status": "EXEMPT", "reason": "남학생 위치에 따른 여학생 가능 칸 수를 경우별로 세어 합산하는 조합·순열 문항이다."}}
```

```
{"sourceQid": 19, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-07", "subUnitKey": "H15-SB-07-PERMUTATION_RESTRICTED", "conceptClusterKey": "", "primaryMethod": "남학생 2명이 같은 층(2층/1층)에 있는 경우와 다른 층에 있는 경우로 나누고, 각 위치에서 남학생과 이웃하지 않는 칸에 여학생 2명을 순열로 배정한다.", "decisiveStep": "남학생의 층 배치와 끝/가운데 위치에 따라 여학생 가능 칸 수($4, 3, 2, 1$)가 달라짐을 분류해 $180$을 구한다.", "rpm": {"majorUnit": "경우의 수", "midUnit": "경우의 수와 순열", "l3": "순열", "l4": "특정 조건 배열"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_ARRANGEMENT", "templateKey": "TPL_PERMUTATION_STANDARD_CONSTRAINT", "why": "high1.json H1-RPM-125(DIRECT_ACTIVE): 순열/특정 조건 배열"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "CASE_BRANCH", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "남학생의 층·위치 선택이 여학생이 들어갈 수 있는 비이웃 칸 수를 결정하는 다중 경우 분기 문항이다.", "level": "상", "item4slot": {"format": "단답", "slots": {"given": ["순열"], "goal": ["개수"], "method": ["경우분류", "순열"], "condition": ["이웃", "이웃하지않음"]}}, "hold": ""}
```

## Q20

- 형식: 서답형  
- 배점: 10



### 발문



\<서술형 1\> 두 함수 \$y \= \\sqrt{x \+ 4}\$, \$y \= x \+ k\$에 대하여 \$f(k)\$를 두 함수의 그래프의 교점의 개수라 하자. \$f(3) \+ f(4) \+ f(5)\$의 값을 구하는 과정을 서술하시오. \[10점\]



### 선지



없음



### 정답



\$3\$



### 해설



\$u \= \\sqrt{x \+ 4} \\ge 0\$으로 놓으면 \$x \= u^2 - 4\$이므로 교점의 방정식 \$\\sqrt{x \+ 4} \= x \+ k\$는 \$u \= u^2 - 4 \+ k \\implies u^2 - u \+ (k - 4\) \= 0\$ (\$u \\ge 0\$) • \$k \= 3\$일 때: \$u^2 - u - 1 \= 0\$의 두 근의 곱이 \$-1 \< 0\$이므로 \$u \\ge 0\$인 근이 \$1\$개 \$\\implies f(3) \= 1\$ • \$k \= 4\$일 때: \$u^2 - u \= 0 \\implies u \= 0, 1\$ (모두 \$u \\ge 0\$) \$\\implies f(4) \= 2\$ • \$k \= 5\$일 때: \$u^2 - u \+ 1 \= 0\$의 판별식 \$D \= 1 - 4 \= \-3 \< 0\$이므로 실근 없음 \$\\implies f(5) \= 0\$ \$\\therefore f(3) \+ f(4) \+ f(5) \= 1 \+ 2 \+ 0 \= 3\$

```
{"question": {"status": "EXEMPT", "reason": "발문에 그림이 없는 무리함수와 직선의 교점 개수 문항이다."}, "solution": {"capability": "multi-curve-figure-v1", "graphPlan": {"family": "multi-curve", "curves": [{"id": "f", "kind": "SQRT", "radicand": ["4", "1"], "amplitude": "1", "sign": 1, "offset": "0", "domain": ["-4", "4"]}], "overlays": {"lines": [{"id": "k3", "slope": "1", "intercept": "3"}, {"id": "k4", "slope": "1", "intercept": "4"}, {"id": "k5", "slope": "1", "intercept": "5"}], "points": [{"id": "S", "x": "-4", "y": "0", "label": "S"}]}, "axisTickValues": {"x": ["-4"], "y": ["3", "4", "5"]}}, "caption": "무리함수 y=√(x+4)와 직선 y=x+k(k=3, 4, 5)의 위치 관계에 따른 교점 개수(1개, 2개, 0개)이다."}}
```

```
{"sourceQid": 20, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-05", "subUnitKey": "H15-SB-05-IRRATIONAL_GRAPH", "conceptClusterKey": "", "primaryMethod": "$u=\\sqrt{x+4}\\ge 0$으로 치환해 교점 개수를 이차방정식 $u^2-u+(k-4)=0$의 음이 아닌 실근 개수로 바꾸어 $k=3,4,5$를 판정한다.", "decisiveStep": "$u \\ge 0$ 제한을 놓치지 않고 $k=3,4,5$의 음이 아닌 근 개수를 각각 $1, 2, 0$으로 구한다.", "rpm": {"majorUnit": "함수", "midUnit": "무리함수", "l3": "무리함수의 그래프", "l4": "기본 그래프"}, "ptTplCandidate": {"problemTypeKey": "PT_FUNCTION_GRAPH_PROPERTIES", "templateKey": "TPL_FUNCTION_GRAPH_PROPERTY_JUDGMENT", "why": "high1.json H1-RPM-115(DIRECT_ACTIVE): 무리함수의 그래프/기본 그래프"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "CASE_BRANCH", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "무리방정식을 $u \\ge 0$ 범위의 이차방정식 근 개수로 전환하여 세 경우를 판정하는 서술형 문항이다.", "level": "중", "item4slot": {"format": "서술", "slots": {"given": ["무리함수", "직선"], "goal": ["개수", "합"], "method": ["치환", "이차방정식", "판별식"], "condition": ["실수"]}}, "hold": ""}
```

## Q21

- 형식: 서답형  
- 배점: 10



### 발문



\<서술형 2\> 집합 \$X \= {2, 3, 5, 7}\$에 대하여 \$X\$에서 \$X\$로의 일대일대응인 함수 \$f, g, h\$가 다음 조건을 만족시킬 때, \$(h \\circ f)(7) \+ (h \\circ g)(5)\$의 값을 구하는 과정을 서술하시오. \[10점\]

> (가) \$g(2) - f(2) \= 3\$ (나) \$3f(5) \= g(3){h(2) \+ 3}\$ (다) \$(f \\circ h)(3) \+ (g \\circ h)(3) \= 10\$



### 선지



없음



### 정답



\$9\$



### 해설



조건 (나)에서 \$f(5) \\in {2, 3, 5, 7}\$이므로 좌변 \$3f(5) \\in {6, 9, 15, 21}\$이다. 우변에서 \$g(3) \\in {2, 3, 5, 7}\$, \$h(2) \+ 3 \\in {5, 6, 8, 10}\$이므로 두 값의 곱이 \${6, 9, 15, 21}\$에 속하는 경우는 \$3 \\times 5 \= 15\$뿐이다. 따라서 \$f(5) \= 5\$, \$g(3) \= 3\$, \$h(2) \= 2\$가 확정된다. 조건 (가)에서 \$g(2) - f(2) \= 3\$을 만족하는 \$X\$의 원소 쌍은 \$(2, 5)\$와 \$(3, 6)\$이 아닌 \$(2, 5)\$뿐(\$f(5) \= 5\$이므로 \$f(2) \= 5\$는 불가)이므로 \$f(2) \= 2\$, \$g(2) \= 5\$이다. 조건 (다)에서 \$f(h(3)) \+ g(h(3)) \= 10\$을 만족하는 두 함수값의 순서쌍은 \$(3, 7)\$, \$(7, 3)\$, \$(5, 5)\$ 중 하나이다. \$f\$의 남은 치역은 \${3, 7}\$, \$g\$의 남은 치역은 \${2, 7}\$이므로 가능한 경우는 \$f(h(3)) \= 3\$, \$g(h(3)) \= 7\$뿐이다. \$h(2) \= 2\$이므로 \$h(3) \\ne 2\$이고, \$f(5) \= 5 \\ne 3\$, \$g(3) \= 3 \\ne 7\$이므로 \$h(3) \= 7\$이 확정된다. 따라서 \$f(7) \= 3\$, \$g(7) \= 7\$이고, 일대일대응에 의해 남은 \$f(3) \= 7\$, \$g(5) \= 2\$이다. \$\\therefore (h \\circ f)(7) \+ (h \\circ g)(5) \= h(f(7)) \+ h(g(5)) \= h(3) \+ h(2) \= 7 \+ 2 \= 9\$

```
{"status": "EXEMPT", "reason": "세 일대일대응 함수의 대응 값을 수의 배수·차·합 조건으로 추론하는 문항이므로 그림이 필요하지 않다."}
```

```
{"sourceQid": 21, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-03", "subUnitKey": "H15-SB-03-FUNCTION_RELATION", "conceptClusterKey": "", "primaryMethod": "곱셈 등식 (나)에서 $f(5)=5, g(3)=3, h(2)=2$를 먼저 확정한 뒤, (가)와 (다)의 일대일대응 배제 조건으로 $f(2)=2, g(2)=5, h(3)=7, f(7)=3, g(5)=2$를 차례로 결정한다.", "decisiveStep": "$3f(5)=g(3)\\{h(2)+3\\}$의 유일해 $15=3\\times 5$에서 출발해 연쇄적으로 $f(7)=3, g(5)=2$를 확정한다.", "rpm": {"majorUnit": "함수", "midUnit": "함수", "l3": "함수의 뜻", "l4": "정의역·공역·치역"}, "ptTplCandidate": {"problemTypeKey": "PT_DOMAIN_RANGE_SURJECTIVITY", "templateKey": "TPL_DOMAIN_CODOMAIN_RANGE_CONDITION", "why": "high1.json H1-RPM-101(DIRECT_ACTIVE): 함수의 뜻/정의역·공역·치역"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "INTERDEPENDENT", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "세 일대일대응 함수 사이의 상호 제약 조건을 논리적으로 연쇄 추론하여 값을 확정하는 준고난도 서술형 문항이다.", "level": "상", "item4slot": {"format": "서술", "slots": {"given": ["집합", "일대일대응", "합성함수"], "goal": ["함숫값", "합"], "method": ["합성함수", "경우분류"], "condition": []}}, "hold": ""}
```

