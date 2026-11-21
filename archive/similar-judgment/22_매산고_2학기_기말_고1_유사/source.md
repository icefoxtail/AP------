

```
{"stem": "22_매산고_2학기_기말_고1_유사", "sourceArchiveFile": "original/high/h1/2final/22_매산고_2학기_기말_고1_기출.js", "examFolder": "2final", "grade": "고1", "curriculum": "2015", "questionCount": 20, "totalScore": 99.6, "generatedAt": "2026-11-16"}
```

## Q01

- 형식: 객관식  
- 배점: 3.6

### 발문

\${}\_nP\_2 \= 56\$을 만족시키는 자연수 \$n\$의 값을 구하면? \[3.6점\]

### 선지

① \$7\$ ② \$8\$ ③ \$9\$ ④ \$10\$ ⑤ \$11\$

### 정답

②

### 해설

\${}\_nP\_2 \= n(n - 1\) \= 56\$ \$n^2 - n - 56 \= 0 \\implies (n - 8)(n \+ 7\) \= 0\$ \$n\$은 자연수이므로 \$\\therefore n \= 8\$ (②)

```
{"status": "EXEMPT", "reason": "순열 기호의 정의식으로 이차방정식을 세워 자연수 $n$을 구하는 기본 문항이므로 그림이 필요하지 않다."}
```

```
{"sourceQid": 1, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-07", "subUnitKey": "H15-SB-07-PERMUTATION_RESTRICTED", "conceptClusterKey": "", "primaryMethod": "순열 ${}_nP_2=n(n-1)=56$을 이차방정식 $n^2-n-56=0$으로 바꾸어 자연수 해를 구한다.", "decisiveStep": "$(n-8)(n+7)=0$에서 자연수 조건으로 $n=8$을 택한다.", "rpm": {"majorUnit": "경우의 수", "midUnit": "경우의 수와 순열", "l3": "순열", "l4": "특정 조건 배열"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_ARRANGEMENT", "templateKey": "TPL_PERMUTATION_STANDARD_CONSTRAINT", "why": "high1.json H1-RPM-125(DIRECT_ACTIVE): 순열/특정 조건 배열"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "순열 공식 ${}_nP_2=n(n-1)$을 바로 적용하는 기본 계산 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"given": ["순열", "자연수"], "goal": ["값"], "method": ["순열", "인수분해"], "condition": []}}, "hold": ""}
```

## Q02

- 형식: 객관식  
- 배점: 3.7

### 발문

오른쪽 그림은 함수 \$y \= \\dfrac{ax \+ b}{x \+ c}\$의 그래프이다. 이때 상수 \$a, b, c\$에 대하여 \$a \+ b \+ c\$의 값은? \[3.7점\]

### 선지

① \$1\$ ② \$2\$ ③ \$3\$ ④ \$4\$ ⑤ \$5\$

### 정답

⑤

### 해설

그림에서 수직점근선은 \$x \= \-2\$, 수평점근선은 \$y \= 3\$이고 그래프는 원점 \$(0, 0)\$을 지난다. 수직점근선: \$x \= \-c \= \-2 \\implies c \= 2\$ 수평점근선: \$y \= a \= 3\$ 원점 \$(0, 0)\$을 지나므로 \$\\dfrac{b}{c} \= 0 \\implies b \= 0\$ \$\\therefore a \+ b \+ c \= 3 \+ 0 \+ 2 \= 5\$ (⑤)

```
{"question": {"capability": "rational-basic-v1", "graphPlan": {"family": "rational-basic", "numerator": ["0", "3"], "denominator": ["2", "1"], "domain": ["-8", "4"], "viewport": [-8, 4, -3, 9], "asymptotes": {"x": ["-2"], "y": ["3"]}, "points": [{"id": "O", "x": "0", "y": "0", "label": "O"}]}, "caption": "수직점근선 x=-2, 수평점근선 y=3이고 원점 O를 지나는 유리함수 그래프"}, "solution": {"capability": "rational-basic-v1", "graphPlan": {"family": "rational-basic", "numerator": ["0", "3"], "denominator": ["2", "1"], "domain": ["-8", "4"], "viewport": [-8, 4, -3, 9], "asymptotes": {"x": ["-2"], "y": ["3"]}, "points": [{"id": "O", "x": "0", "y": "0", "label": "O"}]}, "caption": "점근선 x=-2, y=3과 원점 대입으로 c=2, a=3, b=0을 구한다."}}
```

```
{"sourceQid": 2, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-04", "subUnitKey": "H15-SB-04-RATIONAL_APPLICATION", "conceptClusterKey": "", "primaryMethod": "그래프의 두 점근선 $x=-2, y=3$으로 $c, a$를 정하고 원점 $(0,0)$ 대입으로 $b=0$을 구한다.", "decisiveStep": "분모 영 조건 $x=-c=-2$와 계수비 $y=a=3$을 읽은 뒤 원점 통과로 $b=0$을 확정한다.", "rpm": {"majorUnit": "함수", "midUnit": "유리함수", "l3": "유리함수의 활용", "l4": "유리함수와 그래프의 교점"}, "ptTplCandidate": {"problemTypeKey": "PT_FUNCTION_GRAPH_INTERSECTION", "templateKey": "TPL_FUNCTION_INTERSECTION_TWO_FUNCTIONS", "why": "high1.json H1-RPM-114(DIRECT_ACTIVE): 유리함수의 활용/유리함수와 그래프의 교점"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "유리함수 그래프에서 점근선과 원점 통과 조건을 읽어 세 상수를 바로 구하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"given": ["유리함수", "그래프"], "goal": ["합"], "method": ["점근선", "대입"], "condition": ["원점", "통과"]}}, "hold": ""}
```

## Q03

- 형식: 객관식  
- 배점: 3.8

### 발문

함수 \$y \= \-\\sqrt{3x - a} \+ b\$의 정의역이 \${x \\mid x \\ge 2}\$이고 그래프가 점 \$(5, 2)\$를 지날 때, 이 함수의 치역을 구하면? (단, \$a, b\$는 상수이다.) \[3.8점\]

### 선지

① \${y \\mid y \\le 5}\$ ② \${y \\mid y \\le 4}\$ ③ \${y \\mid y \\le 3}\$ ④ \${y \\mid y \\le 2}\$ ⑤ \${y \\mid y \\le 1}\$

### 정답

①

### 해설

정의역은 \$3x - a \\ge 0 \\implies x \\ge \\dfrac{a}{3}\$이므로 \$\\dfrac{a}{3} \= 2 \\implies a \= 6\$이다. 그래프가 점 \$(5, 2)\$를 지나므로 \$2 \= \-\\sqrt{3(5) - 6} \+ b \= \-\\sqrt{9} \+ b \= \-3 \+ b \\implies b \= 5\$ \$y \= \-\\sqrt{3x - 6} \+ 5\$에서 \$-\\sqrt{3x - 6} \\le 0\$이므로 \$y \\le 5\$이다. \$\\therefore\$ 치역은 \${y \\mid y \\le 5}\$ (①)

```
{"question": {"status": "EXEMPT", "reason": "발문에 그림이 없는 무리함수 정의역과 통과점 기반 치역 구하기 문항이다."}, "solution": {"capability": "sqrt-affine-spike-v1", "graphPlan": {"family": "sqrt-affine", "radicand": ["-6", "3"], "amplitude": "1", "sign": -1, "offset": "5", "sourceDomain": {"kind": "NATURAL_SQRT_AFFINE"}, "domain": [2, 6], "viewport": [0, 6, 0, 6]}, "caption": "y=-√(3x-6)+5는 시작점 (2,5)에서 오른쪽 아래로 내려가므로 치역은 y≤5이다."}}
```

```
{"sourceQid": 3, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-05", "subUnitKey": "H15-SB-05-IRRATIONAL_GRAPH", "conceptClusterKey": "", "primaryMethod": "근호 안 $3x-a\\ge 0$과 정의역 $x\\ge 2$를 비교해 $a=6$을 구하고, $(5,2)$ 대입으로 $b=5$를 구해 치역을 정한다.", "decisiveStep": "$-\\sqrt{3x-6}\\le 0$으로부터 시작점 함숫값 $b=5$가 최댓값임을 확인한다.", "rpm": {"majorUnit": "함수", "midUnit": "무리함수", "l3": "정의역과 치역", "l4": "정의역 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_DOMAIN_RANGE_SURJECTIVITY", "templateKey": "TPL_FUNCTION_DOMAIN_RANGE_DIRECT", "why": "high1.json H1-RPM-117(DIRECT_ACTIVE): 정의역과 치역/정의역 조건"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "무리함수의 정의역 조건과 한 점 대입으로 계수를 구해 치역을 바로 판정하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"given": ["무리함수", "정의역"], "goal": ["치역"], "method": ["대입"], "condition": ["통과"]}}, "hold": ""}
```

## Q04

- 형식: 객관식  
- 배점: 3.9

### 발문

집합 \$X \= {1, 2, 3}\$에 대하여 \$X\$에서 \$X\$로의 두 함수 \$f, g\$가 오른쪽 그림과 같을 때 (\$f(1) \= 2, f(2) \= 3, f(3) \= 1\$, \$g(1) \= 3, g(2) \= 2, g(3) \= 1\$), \$(f \\circ g)(2) \+ (f^{-1} \\circ g)(1)\$의 값을 구하면? \[3.9점\]

### 선지

① \$2\$ ② \$3\$ ③ \$4\$ ④ \$5\$ ⑤ \$6\$

### 정답

④

### 해설

그림에서 \$f(1) \= 2, f(2) \= 3, f(3) \= 1\$이고 \$g(1) \= 3, g(2) \= 2, g(3) \= 1\$이다. \$(f \\circ g)(2) \= f(g(2)) \= f(2) \= 3\$ \$(f^{-1} \\circ g)(1) \= f^{-1}(g(1)) \= f^{-1}(3) \= 2\$ (since \$f(2) \= 3\$) \$\\therefore (f \\circ g)(2) \+ (f^{-1} \\circ g)(1) \= 3 \+ 2 \= 5\$ (④)

```
{"question": {"status": "UNSUPPORTED", "reason": "두 유한집합 X→X의 화살표 대응도는 SVG 엔진 지원 대상이 아니다."}, "solution": {"status": "EXEMPT", "reason": "대응도에서 읽은 함숫값으로 합성과 역합성을 차례로 계산한다."}}
```

```
{"sourceQid": 4, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-03", "subUnitKey": "H15-SB-03-COMPOSITE_FUNCTION", "conceptClusterKey": "", "primaryMethod": "대응도에서 $f, g$의 함숫값을 읽어 $(f\\circ g)(2)=f(g(2))$와 $(f^{-1}\\circ g)(1)=f^{-1}(g(1))$을 계산한다.", "decisiveStep": "$f(2)=3$에서 역함숫값 $f^{-1}(3)=2$를 정확히 읽어 $3+2=5$를 구한다.", "rpm": {"majorUnit": "함수", "midUnit": "함수", "l3": "합성함수", "l4": "합성함수 계산"}, "ptTplCandidate": {"problemTypeKey": "PT_COMPOSITION_EVALUATION", "templateKey": "TPL_COMPOSITION_VALUE_DIRECT", "why": "high1.json H1-RPM-102(DIRECT_ACTIVE): 합성함수/합성함수 계산"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "대응 관계에서 합성함수와 역함수의 함숫값을 차례로 구해 더하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": ["함수", "합성함수", "역함수"], "goal": ["합", "함숫값"], "method": ["대응", "역함수"], "condition": []}}, "hold": ""}
```

## Q05

- 형식: 객관식  
- 배점: 3.9

### 발문

\$360\$의 양의 약수 중 짝수의 개수를 \$p\$, \$3\$의 배수의 개수를 \$q\$라 할 때, \$p \+ q\$의 값은? \[3.9점\]

### 선지

① \$30\$ ② \$32\$ ③ \$34\$ ④ \$36\$ ⑤ \$38\$

### 정답

③

### 해설

\$360 \= 2^3 \\times 3^2 \\times 5^1\$ (1) 짝수인 약수는 \$2\$의 지수가 \$1, 2, 3\$ 중 하나(\$3\$가지), \$3\$의 지수 \$3\$가지, \$5\$의 지수 \$2\$가지이므로 \$p \= 3 \\times 3 \\times 2 \= 18\$ (2) \$3\$의 배수인 약수는 \$2\$의 지수 \$4\$가지, \$3\$의 지수가 \$1, 2\$ 중 하나(\$2\$가지), \$5\$의 지수 \$2\$가지이므로 \$q \= 4 \\times 2 \\times 2 \= 16\$ \$\\therefore p \+ q \= 18 \+ 16 \= 34\$ (③)

```
{"status": "EXEMPT", "reason": "소인수분해를 이용해 배수 조건이 붙은 양의 약수 개수를 곱의 법칙으로 구하는 문항이므로 그림이 필요하지 않다."}
```

```
{"sourceQid": 5, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-06", "subUnitKey": "H15-SB-06-COUNTING_PRINCIPLE", "conceptClusterKey": "", "primaryMethod": "$360=2^3\\cdot 3^2\\cdot 5$로 소인수분해한 뒤 짝수($2$의 지수 $\\ge 1$)와 $3$의 배수($3$의 지수 $\\ge 1$) 약수 개수를 곱의 법칙으로 센다.", "decisiveStep": "$2$의 배수에서는 $2^0$을 제외($3$가지), $3$의 배수에서는 $3^0$을 제외($2$가지)해 $p=18, q=16$을 구한다.", "rpm": {"majorUnit": "경우의 수", "midUnit": "경우의 수와 순열", "l3": "합·곱의 법칙", "l4": "경우를 나누어 세기"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COUNTING_PRINCIPLE_GENERAL", "templateKey": "TPL_H1_COUNTING_DIRECT_CASE", "why": "high1.json H1-RPM-122(DIRECT_ACTIVE): 합·곱의 법칙/경우를 나누어 세기"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "소인수분해 지수 선택에서 특정 소인수의 지수 $0$을 제외하여 약수 개수를 세는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": ["자연수", "약수"], "goal": ["합", "개수"], "method": ["소인수분해", "곱의법칙"], "condition": ["홀짝", "배수"]}}, "hold": ""}
```

## Q06

- 형식: 객관식  
- 배점: 4.1

### 발문

\$1000\$원 지폐 \$3\$장, \$500\$원짜리 동전 \$4\$개, \$100\$원짜리 동전 \$4\$개가 있다. 이 중 일부 또는 전부를 사용하여 지불하려고 할 때, 지불 가능한 금액의 수는? (단, \$0\$원을 지불하는 것은 제외한다.) \[4.1점\]

### 선지

① \$53\$ ② \$54\$ ③ \$55\$ ④ \$56\$ ⑤ \$57\$

### 정답

②

### 해설

지불할 수 있는 금액을 \$100\$원 단위로 나타내면 \$a \+ 5b \+ 10c\$ (\$0 \\le a \\le 4\$, \$0 \\le b \\le 4\$, \$0 \\le c \\le 3\$)이다. 먼저 \$a \+ 5b\$는 \$0\$부터 \$4 \+ 5 \\times 4 \= 24\$까지의 모든 정수를 빠짐없이 나타낼 수 있다. 여기에 \$10c \\in {0, 10, 20, 30}\$을 더하면 \$0\$부터 \$24 \+ 30 \= 54\$까지의 모든 정수를 만들 수 있다. \$0\$원을 지불하는 경우를 제외하면 \$100\$원부터 \$5400\$원까지 모두 가능하다. \$\\therefore 54\$ (②)

```
{"status": "EXEMPT", "reason": "화폐 단위 조합으로 만들 수 있는 연속된 정수 금액의 개수를 구하는 문항이므로 그림이 필요하지 않다."}
```

```
{"sourceQid": 6, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-08", "subUnitKey": "H15-SB-08-COMBINATION_BASIC", "conceptClusterKey": "", "primaryMethod": "지불 금액을 $100$원 단위 $a+5b+10c$로 환산해 $a+5b$가 $0\\sim 24$를 모두 덮으므로 $0\\sim 54$가 모두 가능함을 보인다.", "decisiveStep": "하위 화폐 최대합 $2400$원이 상위 단위 $1000$원 이상이므로 중복 없이 $100$원부터 $5400$원까지 연속 생성됨을 확인한다.", "rpm": {"majorUnit": "경우의 수", "midUnit": "조합", "l3": "조합의 뜻과 계산", "l4": "조합 계산"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_SELECTION_DISTRIBUTION", "templateKey": "TPL_H1_BINOMIAL_PARAMETER_RELATION", "why": "high1.json H1-RPM-277(DIRECT_ACTIVE): 조합의 뜻과 계산/조합 계산"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "화폐 지불 금액의 중복을 상위 단위 환산으로 정리해 연속 정수 범위를 확인하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": ["자연수"], "goal": ["개수"], "method": ["환원", "범위"], "condition": ["제외"]}}, "hold": ""}
```

## Q07

- 형식: 객관식  
- 배점: 4.2

### 발문

함수 \$y \= 4 - \\sqrt{9 - x}\$의 그래프와 직선 \$y \= \-x \+ k\$가 제\$1\$사분면에서 만나도록 하는 \$k\$의 값이 될 수 없는 것은? \[4.2점\]

### 선지

① \$1\$ ② \$2\$ ③ \$3\$ ④ \$4\$ ⑤ \$5\$

### 정답

①

### 해설

함수 \$y \= 4 - \\sqrt{9 - x}\$의 그래프에서 제\$1\$사분면에 속하는 부분은 \$0 \< x \\le 9\$이다. (\$x \= 0\$일 때 \$y \= 4 - 3 \= 1 \> 0\$, \$x \= 9\$일 때 \$y \= 4 \> 0\$이므로 \$0 \< x \\le 9\$에서 항상 \$y \> 0\$이다.) 교점에서 \$4 - \\sqrt{9 - x} \= \-x \+ k \\implies k \= x \+ 4 - \\sqrt{9 - x}\$ \$0 \< x \\le 9\$에서 \$x\$가 커질수록 \$x\$와 \$-\\sqrt{9 - x}\$가 모두 커지므로 \$k\$는 증가한다. \$x \\to 0^+\$일 때 \$k \\to 0 \+ 4 - 3 \= 1\$ (제\$1\$사분면 위가 아니므로 \$1\$은 제외) \$x \= 9\$일 때 \$k \= 9 \+ 4 - 0 \= 13\$ 따라서 제\$1\$사분면에서 만나는 \$k\$의 범위는 \$1 \< k \\le 13\$이다. \$\\therefore\$ \$k\$의 값이 될 수 없는 것은 \$1\$ (①)

```
{"question": {"status": "EXEMPT", "reason": "발문에 그림이 없는 무리함수와 직선의 제1사분면 교점 조건 문항이다."}, "solution": {"capability": "multi-curve-figure-v1", "graphPlan": {"family": "multi-curve", "curves": [{"id": "f", "kind": "SQRT", "radicand": ["9", "-1"], "amplitude": "1", "sign": -1, "offset": "4", "domain": ["-2", "9"]}], "overlays": {"lines": [{"id": "l1", "slope": "-1", "intercept": "1"}, {"id": "l2", "slope": "-1", "intercept": "13"}], "points": [{"id": "E", "x": "9", "y": "4", "label": "(9,4)"}]}, "axisTickValues": {"x": ["0", "9"], "y": ["1", "4"]}}, "caption": "제1사분면 구간 0<x≤9에서 y=-x+k가 곡선과 만나려면 1<k≤13이어야 한다."}}
```

```
{"sourceQid": 7, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-05", "subUnitKey": "H15-SB-05-IRRATIONAL_GRAPH", "conceptClusterKey": "", "primaryMethod": "제$1$사분면 범위 $0<x\\le 9$에서 교점식 $k=x+4-\\sqrt{9-x}$가 증가함을 이용해 $k$의 범위 $1<k\\le 13$을 구한다.", "decisiveStep": "$x=0$은 제$1$사분면에 속하지 않으므로 $k=1$이 제외($1<k\\le 13$)됨을 확인한다.", "rpm": {"majorUnit": "함수", "midUnit": "무리함수", "l3": "무리함수의 그래프", "l4": "기본 그래프"}, "ptTplCandidate": {"problemTypeKey": "PT_FUNCTION_GRAPH_PROPERTIES", "templateKey": "TPL_FUNCTION_GRAPH_PROPERTY_JUDGMENT", "why": "high1.json H1-RPM-115(DIRECT_ACTIVE): 무리함수의 그래프/기본 그래프"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "제1사분면 정의역 경계 처리($x=0$ 제외)와 단조증가식을 결합해 매개변수 범위를 판정하는 중상 난이도 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": ["무리함수", "직선"], "goal": ["판정", "범위"], "method": ["증가감소", "부등식"], "condition": ["사분면", "교점"]}}, "hold": ""}
```

## Q08

- 형식: 객관식  
- 배점: 4.4

### 발문

함수 \$y \= \\dfrac{3}{x}\$의 그래프의 제\$1\$사분면 위의 점 \$A\$에서 \$x\$축, \$y\$축에 평행한 직선을 그어 \$y \= \\dfrac{k}{x}\$ \$(k \> 3)\$의 그래프와 만나는 점을 각각 \$B, C\$라 하자. 삼각형 \$ABC\$의 넓이가 \$6\$일 때, 상수 \$k\$의 값은? \[4.4점\]

### 선지

① \$5\$ ② \$6\$ ③ \$7\$ ④ \$8\$ ⑤ \$9\$

### 정답

⑤

### 해설

제\$1\$사분면 위의 점 \$A\$의 좌표를 \$A\\left(t, \\dfrac{3}{t}\\right)\$ (\$t \> 0\$)라 하자. \$A\$에서 \$x\$축에 평행한 직선 \$y \= \\dfrac{3}{t}\$가 \$y \= \\dfrac{k}{x}\$와 만나는 점 \$B\$의 좌표는 \$B\\left(\\dfrac{kt}{3}, \\dfrac{3}{t}\\right)\$ \$A\$에서 \$y\$축에 평행한 직선 \$x \= t\$가 \$y \= \\dfrac{k}{x}\$와 만나는 점 \$C\$의 좌표는 \$C\\left(t, \\dfrac{k}{t}\\right)\$ \$k \> 3\$이므로 \$\\overline{AB} \= \\dfrac{kt}{3} - t \= \\dfrac{t(k - 3)}{3}\$, \$\\overline{AC} \= \\dfrac{k}{t} - \\dfrac{3}{t} \= \\dfrac{k - 3}{t}\$ \$\\angle A \= 90^\\circ\$이므로 삼각형 \$ABC\$의 넓이는 \$\\dfrac{1}{2} \\cdot \\overline{AB} \\cdot \\overline{AC} \= \\dfrac{1}{2} \\cdot \\dfrac{t(k - 3)}{3} \\cdot \\dfrac{k - 3}{t} \= \\dfrac{(k - 3)^2}{6} \= 6\$ \$(k - 3)^2 \= 36\$, \$k \> 3\$이므로 \$k - 3 \= 6\$ \$\\therefore k \= 9\$ (⑤)

```
{"question": {"status": "EXEMPT", "reason": "발문에 그림이 없는 두 반비례 유리함수 사이 직각삼각형 넓이 문항이다."}, "solution": {"capability": "multi-curve-figure-v1", "graphPlan": {"family": "multi-curve", "curves": [{"id": "f1", "kind": "RATIONAL", "numerator": ["3", "0"], "denominator": ["0", "1"], "domain": ["0.3", "6"]}, {"id": "f2", "kind": "RATIONAL", "numerator": ["9", "0"], "denominator": ["0", "1"], "domain": ["0.5", "6"]}], "overlays": {"points": [{"id": "A", "x": "1", "y": "3", "label": "A"}, {"id": "B", "x": "3", "y": "3", "label": "B"}, {"id": "C", "x": "1", "y": "9", "label": "C"}]}, "axisTickValues": {"x": ["1", "3"], "y": ["3", "9"]}}, "caption": "k=9, t=1일 때 A(1,3), B(3,3), C(1,9)가 만드는 직각삼각형 ABC의 넓이는 6이다."}}
```

```
{"sourceQid": 8, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-04", "subUnitKey": "H15-SB-04-RATIONAL_GRAPH", "conceptClusterKey": "", "primaryMethod": "점 $A(t,\\dfrac{3}{t})$에서 $B(\\dfrac{kt}{3},\\dfrac{3}{t}), C(t,\\dfrac{k}{t})$를 구해 직각삼각형 넓이 $\\dfrac{(k-3)^2}{6}=6$에서 $t$를 소거한다.", "decisiveStep": "넓이 식에서 매개좌표 $t$가 약분되어 $(k-3)^2=36$으로 $k=9$가 결정됨을 확인한다.", "rpm": {"majorUnit": "함수", "midUnit": "유리함수", "l3": "점근선과 위치", "l4": "그래프의 사분면"}, "ptTplCandidate": {"problemTypeKey": "PT_FUNCTION_GRAPH_QUADRANT", "templateKey": "TPL_FUNCTION_QUADRANT_DIRECT", "why": "high1.json H1-RPM-111(DIRECT_ACTIVE): 점근선과 위치/그래프의 사분면"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "점 $A$의 좌표를 $t$로 설정해 두 반비례 곡선 위 교점과 직각삼각형 넓이를 구할 때 $t$가 소거되는 불변량 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"given": ["유리함수", "삼각형"], "goal": ["매개변수"], "method": ["좌표", "넓이", "소거"], "condition": ["직각", "사분면"]}}, "hold": ""}
```

## Q09

- 형식: 객관식  
- 배점: 4.5

### 발문

다음 그림과 같은 토너먼트 방식으로 매산고 \$1\$학년 축구 동아리 리그를 치르려고 한다. 결승전 전까지 왼쪽 조 \$2\$팀(첫 경기 후 바로 결승 진출)과 오른쪽 조 \$4\$팀(\$2\$팀씩 첫 경기를 치른 뒤 준결승으로 결승 진출)으로 나누어 대진표를 작성하는 경우의 수를 구하면? \[4.5점\]

### 선지

① \$15\$ ② \$24\$ ③ \$30\$ ④ \$45\$ ⑤ \$60\$

### 정답

④

### 해설

\$6\$개 팀을 왼쪽 조 \$2\$팀과 오른쪽 조 \$4\$팀으로 나누는 경우의 수: \${}\_6C\_2 \\times {}\_4C\_4 \= 15\$ 오른쪽 조 \$4\$팀을 \$2\$팀씩 두 묶음(좌우 구별 없음)으로 나누는 경우의 수: \$\\dfrac{{}\_4C\_2 \\times {}\_2C\_2}{2\!} \= \\dfrac{6}{2} \= 3\$ \$\\therefore 15 \\times 3 \= 45\$ (④)

```
{"question": {"status": "UNSUPPORTED", "reason": "6개 팀(왼쪽 2팀, 오른쪽 4팀) 토너먼트 대진표 트리 도식은 SVG 엔진 지원 대상이 아니다."}, "solution": {"status": "EXEMPT", "reason": "조 분할 조합과 동일 인원 조의 대칭 나눗셈으로 대진표 경우의 수를 계산한다."}}
```

```
{"sourceQid": 9, "variationType": "CONDITION", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-06", "subUnitKey": "H15-SB-06-COUNTING_PRINCIPLE", "conceptClusterKey": "", "primaryMethod": "$6$팀을 $2$팀·$4$팀으로 나눈 뒤(${}_6C_2$), $4$팀을 $2$팀씩 대칭 분할($\\dfrac{{}_4C_2}{2!}$)해 곱한다.", "decisiveStep": "오른쪽 $4$팀의 두 소조는 인원수가 같아 순서가 구별되지 않으므로 $2!$로 나누어야 함을 반영한다.", "rpm": {"majorUnit": "경우의 수", "midUnit": "경우의 수와 순열", "l3": "합·곱의 법칙", "l4": "경우를 나누어 세기"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COUNTING_PRINCIPLE_GENERAL", "templateKey": "TPL_H1_COUNTING_DIRECT_CASE", "why": "high1.json H1-RPM-122(DIRECT_ACTIVE): 합·곱의 법칙/경우를 나누어 세기"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "토너먼트 대진표의 비대칭 분할과 대칭 분할을 구분해 조합으로 세는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": ["구별가능", "분할"], "goal": ["개수"], "method": ["조합", "곱의법칙"], "condition": ["대칭성"]}}, "hold": ""}
```

## Q10

- 형식: 객관식  
- 배점: 4.6

### 발문

서로 다른 \$6\$켤레의 구두 \$12\$짝 중에서 \$6\$짝을 택할 때, 두 켤레만 짝이 맞도록 하는 경우의 수를 구하면? \[4.6점\]

### 선지

① \$240\$ ② \$300\$ ③ \$360\$ ④ \$420\$ ⑤ \$480\$

### 정답

③

### 해설

짝이 맞는 두 켤레를 고르는 경우의 수: \${}\_6C\_2 \= 15\$ 남은 \$4\$켤레에서 \$2\$짝을 고르되 짝이 맞지 않게 하려면, 남은 \$4\$켤레 중 서로 다른 \$2\$켤레를 고른 뒤 각 켤레에서 \$1\$짝씩 골라야 한다. 그 경우의 수: \${}\_4C\_2 \\times 2 \\times 2 \= 6 \\times 4 \= 24\$ \$\\therefore 15 \\times 24 \= 360\$ (③)

```
{"status": "EXEMPT", "reason": "맞는 켤레를 고른 뒤 남은 짝이 서로 다른 켤레에서 나오도록 조합과 곱의 법칙을 적용하는 문항이므로 그림이 필요하지 않다."}
```

```
{"sourceQid": 10, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-06", "subUnitKey": "H15-SB-06-COUNTING_PRINCIPLE", "conceptClusterKey": "", "primaryMethod": "완전한 두 켤레를 ${}_6C_2$로 뽑고, 나머지 두 짝을 남은 $4$켤레 중 다른 $2$켤레(${}_4C_2$)에서 각각 $2$가지씩 고른다.", "decisiveStep": "나머지 $2$짝이 같은 켤레에서 나오지 않도록 ${}_4C_2\\times 2^2$으로 세어 곱한다.", "rpm": {"majorUnit": "경우의 수", "midUnit": "경우의 수와 순열", "l3": "합·곱의 법칙", "l4": "경우를 나누어 세기"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COUNTING_PRINCIPLE_GENERAL", "templateKey": "TPL_H1_COUNTING_DIRECT_CASE", "why": "high1.json H1-RPM-122(DIRECT_ACTIVE): 합·곱의 법칙/경우를 나누어 세기"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "짝이 맞는 켤레 수 고정과 나머지 짝의 비매칭 조합을 결합해 세는 중상 난이도 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"given": ["구별가능", "조합"], "goal": ["개수"], "method": ["조합", "곱의법칙"], "condition": ["제외"]}}, "hold": ""}
```

## Q11

- 형식: 객관식  
- 배점: 4.7

### 발문

집합 \$X \= {1, 2, 3, 4, 5, 6}\$에 대하여 일대일대응 함수 \$f: X \\to X\$가 \$1 \\le x \\le 2\$에서 \$(f \\circ f)(x) \= f(x) - 2x\$를 만족하고, \$f(4) \= 2\$이다. \$f(3) \= a\$일 때, 가능한 \$a\$의 값들의 곱을 구하면? \[4.7점\]

### 선지

① \$12\$ ② \$18\$ ③ \$20\$ ④ \$24\$ ⑤ \$30\$

### 정답

②

### 해설

조건에 \$x \= 2\$를 대입하면 \$f(f(2)) \= f(2) - 4 \\in X\$이므로 \$f(2) \\in {5, 6}\$이다.

- 만약 \$f(2) \= 6\$이면 \$f(6) \= 2\$가 되어 \$f(4) \= 2\$와 일대일대응 조건에 모순이다. 따라서 \$f(2) \= 5\$, \$f(5) \= 1\$이 유일하게 결정된다.

이제 \$x \= 1\$을 대입하면 \$f(f(1)) \= f(1) - 2 \\in X\$이므로 \$f(1) \\in {3, 4, 5, 6}\$인데, \$f(2) \= 5\$이므로 \$f(1) \\in {3, 4, 6}\$이다. (1) \$f(1) \= 3\$이면 \$f(3) \= 1 \= f(5)\$이므로 모순이다. (2) \$f(1) \= 4\$이면 \$f(4) \= 2\$로 조건과 일치한다. 이때 남은 원소 \${3, 6}\$이 \${3, 6}\$에 일대일대응하므로 \$f(3) \= 3\$ 또는 \$f(3) \= 6\$이다. (3) \$f(1) \= 6\$이면 \$f(6) \= 4\$가 되고, 남은 원소 \$3\$은 \$f(3) \= 3\$으로 결정된다.

따라서 가능한 \$a \= f(3)\$의 값은 \$3, 6\$이다. \$\\therefore 3 \\times 6 \= 18\$ (②)

```
{"status": "EXEMPT", "reason": "유한집합의 일대일대응 조건과 합성 방정식으로 가능한 함숫값 경우를 분류하는 문항이므로 그림이 필요하지 않다."}
```

```
{"sourceQid": 11, "variationType": "CONDITION", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-01", "subUnitKey": "H15-SB-01-SET_COUNT", "conceptClusterKey": "", "primaryMethod": "$x=2, 1$을 $(f\\circ f)(x)=f(x)-2x$에 차례로 대입하고 $f(4)=2$ 및 일대일대응 조건으로 모순되는 경우를 걸러낸다.", "decisiveStep": "$f(2)=5, f(5)=1$을 먼저 확정한 뒤 $f(1)=4$ 또는 $6$에서 가능한 $f(3)\\in\\{3,6\\}$을 모두 찾는다.", "rpm": {"majorUnit": "집합과 명제", "midUnit": "집합의 뜻과 포함 관계", "l3": "집합과 원소", "l4": "유한집합 원소 개수"}, "ptTplCandidate": {"problemTypeKey": "PT_SET_CARDINALITY", "templateKey": "TPL_SET_CARDINALITY_DIRECT", "why": "high1.json H1-RPM-081(DIRECT_ACTIVE): 집합과 원소/유한집합 원소 개수"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "합성함수 방정식과 일대일대응 충돌 배제를 여러 단계로 추적해 가능한 함숫값 집합을 완결해야 하는 고난도 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"given": ["함수", "일대일대응", "합성함수"], "goal": ["곱", "함숫값"], "method": ["경우분류", "일대일대응", "대입"], "condition": []}}, "hold": ""}
```

## Q12

- 형식: 객관식  
- 배점: 4.4

### 발문

아래 그림과 같은 함수 \$y \= f(x)\$와 그 역함수 \$y \= f^{-1}(x)\$의 그래프가 다음 조건을 모두 만족시킨다. 점 \$A \= (3, 4)\$이고, \$4 - f^{-1}(3) \= 9\$이다. 이때 삼각형 \$ABD\$의 넓이를 구하시오. (단, \$B\$는 \$A\$의 직선 \$y \= x\$에 대한 대칭점이고, \$C, D\$는 각각 \$y \= f^{-1}(x)\$와 \$y \= f(x)\$ 위에서 직선 \$y \= x\$에 대하여 서로 대칭인 점이며 \$C\$의 \$x\$좌표는 \$3\$이다.) \[4.4점\]

### 선지

① \$\\dfrac{9}{2}\$ ② \$5\$ ③ \$\\dfrac{11}{2}\$ ④ \$6\$ ⑤ \$\\dfrac{13}{2}\$

### 정답

①

### 해설

\$A \= (3, 4)\$는 \$y \= f(x)\$ 위의 점이므로 \$y \= x\$에 대하여 대칭인 점은 \$B \= (4, 3)\$이다. \$4 - f^{-1}(3) \= 9 \\implies f^{-1}(3) \= \-5\$ 따라서 \$y \= f^{-1}(x)\$ 위의 점은 \$C \= (3, \-5)\$이고, 이와 직선 \$y \= x\$에 대하여 대칭인 \$y \= f(x)\$ 위의 점은 \$D \= (-5, 3)\$이다. 두 점 \$B(4, 3)\$과 \$D(-5, 3)\$은 모두 직선 \$y \= 3\$ 위에 있으므로 밑변 \$\\overline{BD} \= 4 - (-5) \= 9\$이다. 점 \$A(3, 4)\$에서 직선 \$BD\$(\$y \= 3\$)까지의 높이는 \$4 - 3 \= 1\$이다. \$\\therefore \\triangle ABD \= \\dfrac{1}{2} \\times 9 \\times 1 \= \\dfrac{9}{2}\$ (①)

```
{"question": {"status": "UNSUPPORTED", "reason": "일반 함수와 역함수의 대칭 곡선 및 네 점 A, B, C, D를 포함한 추상 개형 도식은 SVG 엔진 지원 대상이 아니다."}, "solution": {"status": "EXEMPT", "reason": "직선 y=x 대칭 성질로 점 B, C, D의 좌표를 확정하여 삼각형의 밑변과 높이를 구한다."}}
```

```
{"sourceQid": 12, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-03", "subUnitKey": "H15-SB-03-INVERSE_FUNCTION", "conceptClusterKey": "", "primaryMethod": "원함수와 역함수의 $y=x$ 대칭성으로 $B(4,3), C(3,-5), D(-5,3)$의 좌표를 구해 $\\triangle ABD$의 넓이를 계산한다.", "decisiveStep": "선분 $BD$가 $y=3$ 위의 수평선분임과 높이 $4-3=1$을 이용해 넓이 $\\dfrac{9}{2}$를 구한다.", "rpm": {"majorUnit": "함수", "midUnit": "함수", "l3": "역함수", "l4": "그래프 대칭"}, "ptTplCandidate": {"problemTypeKey": "PT_INVERSE_GRAPH", "templateKey": "TPL_INVERSE_GRAPH_GEOMETRY", "why": "high1.json H1-RPM-105(DIRECT_ACTIVE): 역함수/그래프 대칭"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "역함수 대칭점 좌표를 함숫값 식에서 이끌어 내고 좌표평면 위 삼각형 넓이로 연결하는 중상 난이도 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"given": ["함수", "역함수", "그래프"], "goal": ["넓이"], "method": ["대칭성", "좌표"], "condition": ["대칭성"]}}, "hold": ""}
```

## Q13

- 형식: 객관식  
- 배점: 4.9

### 발문

실수 전체의 집합에서 정의된 함수 \$\$f(x) \= \\begin{cases} \\dfrac{-2x \+ 1}{x - 3} & (px \+ q \< 0\) \\ \\sqrt{px \+ q} \+ r & (px \+ q \\ge 0\) \\end{cases}\$\$ 의 역함수가 존재할 때, 상수 \$p, q, r\$에 대하여 \$\\dfrac{qr}{p}\$의 값은? (단, \$f\$의 치역은 실수 전체의 집합이다.) \[4.9점\]

### 선지

① \$-6\$ ② \$-3\$ ③ \$3\$ ④ \$6\$ ⑤ \$9\$

### 정답

④

### 해설

유리식 조각은 \$\\dfrac{-2x \+ 1}{x - 3} \= \-2 - \\dfrac{5}{x - 3}\$이므로 \$x \= 3\$에서 정의되지 않는다. 함수 \$f\$가 실수 전체에서 정의되고 일대일대응(역함수 존재, 치역이 실수 전체)이 되려면 \$x \= 3\$이 근호 조각에 속해야 하므로, 경계는 \$px \+ q \= 0\$의 해가 \$x \= 3\$이어야 한다. 또한 유리식 조각이 한쪽 반직선에서 단조여야 하므로 \$x \> 3\$에서 유리식, \$x \\le 3\$에서 근호식이 정의되어야 한다. 따라서 \$px \+ q \< 0\$의 해가 \$x \> 3\$이므로 \$p \< 0\$이고 \$3p \+ q \= 0 \\implies q \= \-3p\$이다. \$x \> 3\$에서 유리식 조각의 치역은 \$(-\\infty, \-2)\$이므로, \$x \\le 3\$에서 근호식 \$\\sqrt{px \+ q} \+ r\$의 치역이 \$\[-2, \\infty)\$이어야 한다. 즉 시작점의 \$y\$좌표가 \$r \= \-2\$이다. \$\\therefore \\dfrac{qr}{p} \= \\dfrac{(-3p)(-2)}{p} \= 6\$ (④)

```
{"question": {"status": "EXEMPT", "reason": "발문에 그림이 없는 조각함수의 역함수 존재 조건 문항이다."}, "solution": {"capability": "multi-curve-figure-v1", "graphPlan": {"family": "multi-curve", "curves": [{"id": "sq", "kind": "SQRT", "radicand": ["3", "-1"], "amplitude": "1", "sign": 1, "offset": "-2", "domain": ["-4", "3"]}, {"id": "rat", "kind": "RATIONAL", "numerator": ["1", "-2"], "denominator": ["-3", "1"], "domain": ["3.4", "9"]}], "overlays": {"lines": [{"id": "y2", "slope": "0", "intercept": "-2"}]}, "axisTickValues": {"x": ["3"], "y": ["-2"]}}, "caption": "x≤3에서 근호식이 y≥-2를, x>3에서 유리식이 y<-2를 일대일로 덮어 역함수가 존재한다."}}
```

```
{"sourceQid": 13, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-05", "subUnitKey": "H15-SB-05-IRRATIONAL_GRAPH", "conceptClusterKey": "", "primaryMethod": "유리식의 불연속점 $x=3$을 근호 구간 경계로 잠가 $p<0, q=-3p$를 정하고, 두 조각의 치역 연결로 $r=-2$를 구한다.", "decisiveStep": "유리식 $\\dfrac{-2x+1}{x-3}$의 치역 $(-\\infty, -2)$와 무리식 치역 $[r, \\infty)$의 경계 일치로 $r=-2$를 확정한다.", "rpm": {"majorUnit": "함수", "midUnit": "무리함수", "l3": "정의역과 치역", "l4": "정의역 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_DOMAIN_RANGE_SURJECTIVITY", "templateKey": "TPL_FUNCTION_DOMAIN_RANGE_DIRECT", "why": "high1.json H1-RPM-117(DIRECT_ACTIVE): 정의역과 치역/정의역 조건"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "유리함수 점근선 배제 조건과 무리함수 치역 이음 조건을 일대일대응으로 동시에 해결하는 고난도 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"given": ["조각함수", "유리함수", "무리함수"], "goal": ["값"], "method": ["치역", "점근선", "일대일대응"], "condition": ["실수", "역함수"]}}, "hold": ""}
```

## Q14

- 형식: 객관식  
- 배점: 4.9

### 발문

좌표평면 위의 두 곡선 \$y \= \-\\sqrt{kx \+ 4k} \+ 3\$, \$y \= \\sqrt{-kx \+ 4k} - 3\$에 대하여 두 곡선이 서로 다른 두 점에서 만나도록 하는 \$k\$의 최댓값은? \[4.9점\]

### 선지

① \$\\dfrac{7}{2}\$ ② \$4\$ ③ \$\\dfrac{9}{2}\$ ④ \$5\$ ⑤ \$\\dfrac{11}{2}\$

### 정답

③

### 해설

\$A \= \\sqrt{k(x \+ 4)} \\ge 0\$, \$B \= \\sqrt{k(4 - x)} \\ge 0\$이라 하자. (서로 다른 두 교점이 존재하려면 \$k \> 0\$이어야 한다.) 교점에서 \$3 - A \= B - 3 \\implies A \+ B \= 6\$ 또한 \$A^2 \+ B^2 \= k(x \+ 4\) \+ k(4 - x) \= 8k\$ \$(A \+ B)^2 \= A^2 \+ B^2 \+ 2AB\$에 대입하면 \$36 \= 8k \+ 2AB \\implies AB \= 18 - 4k\$ \$A \\ge 0, B \\ge 0\$이므로 \$AB \= 18 - 4k \\ge 0 \\implies k \\le \\dfrac{9}{2}\$ \$k \= \\dfrac{9}{2}\$일 때 \$AB \= 0\$이므로 \$(A, B) \= (0, 6)\$ 또는 \$(6, 0)\$, 즉 \$(-4, 3)\$과 \$(4, \-3)\$의 서로 다른 두 점에서 실제로 만난다. \$\\therefore k\$의 최댓값은 \$\\dfrac{9}{2}\$ (③)

```
{"question": {"status": "EXEMPT", "reason": "발문에 그림이 없는 두 무리함수의 교점 존재 조건 문항이다."}, "solution": {"capability": "multi-curve-figure-v1", "graphPlan": {"family": "multi-curve", "curves": [{"id": "c1", "kind": "SQRT", "radicand": ["18", "4.5"], "amplitude": "1", "sign": -1, "offset": "3", "domain": ["-4", "4"]}, {"id": "c2", "kind": "SQRT", "radicand": ["18", "-4.5"], "amplitude": "1", "sign": 1, "offset": "-3", "domain": ["-4", "4"]}], "overlays": {"points": [{"id": "P", "x": "-4", "y": "3", "label": "(-4,3)"}, {"id": "Q", "x": "4", "y": "-3", "label": "(4,-3)"}]}, "axisTickValues": {"x": ["-4", "4"], "y": ["-3", "3"]}}, "caption": "k=9/2일 때 두 곡선은 양 끝점 (-4,3)과 (4,-3)에서 만나므로 최댓값은 9/2이다."}}
```

```
{"sourceQid": 14, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-05", "subUnitKey": "H15-SB-05-IRRATIONAL_BASIC", "conceptClusterKey": "", "primaryMethod": "두 근호를 $A, B\\ge 0$으로 치환하여 $A+B=6, A^2+B^2=8k$를 얻고 $AB=18-4k\\ge 0$에서 $k$의 최댓값을 구한다.", "decisiveStep": "$k=\\dfrac{9}{2}$일 때 $AB=0$이 되어 양 끝점 $(-4,3), (4,-3)$의 서로 다른 두 교점이 존재함을 확인한다.", "rpm": {"majorUnit": "함수", "midUnit": "무리함수", "l3": "무리함수의 활용", "l4": "무리함수의 교점"}, "ptTplCandidate": {"problemTypeKey": "PT_FUNCTION_GRAPH_INTERSECTION", "templateKey": "TPL_FUNCTION_INTERSECTION_TWO_FUNCTIONS", "why": "high1.json H1-RPM-121(DIRECT_ACTIVE): 무리함수의 활용/무리함수의 교점"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 무리식을 대칭 치환해 합·제곱합 관계식에서 곱의 비음 조건으로 매개변수 최댓값을 구하는 고난도 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"given": ["무리함수"], "goal": ["최댓값", "매개변수"], "method": ["치환", "대칭식", "부등식"], "condition": ["교점", "구간"]}}, "hold": ""}
```

## Q15

- 형식: 객관식  
- 배점: 5.0

### 발문

오른쪽 그림과 같이 중앙 영역 \$A\$를 둘러싼 \$5\$개의 영역 \$B, C, D, E, F\$가 고리 모양으로 이어진 \$6\$개의 영역이 있다. 서로 다른 \$6\$가지 색 중에서 서로 다른 \$4\$가지 색을 사용하여 각 영역에 색을 칠하는 경우의 수가 \$\\alpha\$, 서로 다른 \$5\$가지 색을 사용하여 각 영역에 색을 칠하는 경우의 수가 \$\\beta\$일 때, \$\\alpha \+ \\beta\$의 값을 구하면? (단, 같은 색을 중복하여 사용해도 좋으나 인접한 영역은 서로 다른 색으로 칠하고 한 영역은 한 가지 색으로만 칠한다.) \[5.0점\]

### 선지

① \$3600\$ ② \$4200\$ ③ \$4800\$ ④ \$5100\$ ⑤ \$5400\$

### 정답

⑤

### 해설

(1) \$\\alpha\$ (서로 다른 \$4\$가지 색만 사용): 사용할 \$4\$가지 색을 고르는 방법: \${}\_6C\_4 \= 15\$가지 고른 \$4\$색 중 중앙 \$A\$의 색 선택: \$4\$가지 바깥 고리 \$B, C, D, E, F\$에는 나머지 \$3\$색(\$1, 2, 3\$이라 하자)을 모두 사용해 칠해야 한다(홀수 개 고리는 \$2\$색만으로 인접 다르게 칠할 수 없음). \$B\$는 \$3\$가지, \$C\$는 \$B\$와 다른 \$2\$가지. \$B, C\$가 정해졌을 때:

- \$D \= B\$이면 \$E\$는 \$B\$와 다른 \$2\$가지, 그때 \$F\$는 \$B\$와 다른 \$2\$가지 \$\\implies 2 \\times 2 \= 4\$가지  
- \$D\$가 세 번째 색이면 \$E \= B\$(\$1\$가지, 이때 \$F\$는 \$2\$가지) 또는 \$E \= C\$(\$1\$가지, 이때 \$F\$는 \$B, C\$ 모두와 다른 \$1\$가지) \$\\implies 2 \+ 1 \= 3\$가지 고리 전체는 \$3 \\times 2 \\times (4 \+ 3\) \= 42\$? 잠깐, \$D\$의 선택지마다 \$C\$는 이미 \$2\$가지에 곱해졌으므로 \$B(3) \\times \[C(2) \\times \\text{나머지}\] \= 3 \\times 2 \\times \\dots\$가 아니라 \$C\$는 \$2\$가지씩 동등하므로 \$3 \\times 2 \\times (4 \+ 3)\$... 아\! \$B\$가 \$1\$, \$C\$가 \$2\$일 때:  
- \$D \= 1\$: \$E \\in {2, 3}\$ (\$2\$가지) \$\\implies E=2\$면 \$F \\in {3}\$(\$1\$가지), \$E=3\$이면 \$F \\in {2}\$(\$1\$가지)\! 즉 \$E=2,3\$ 둘 다 \$B=1\$과 다르므로 \$F\$는 각각 \$1\$가지가 아니라... 아\! \$E=2\$이면 \$F\$는 \$B(1)\$과 \$E(2)\$ 모두와 달라야 하므로 \$F=3\$ (\$1\$가지)\! \$E=3\$이면 \$F\$는 \$B(1)\$과 \$E(3)\$ 모두와 달라야 하므로 \$F=2\$ (\$1\$가지)\!  
- \$D \= 3\$: \$E \= 1\$이면 \$F \\in {2, 3}\$ (\$2\$가지), \$E \= 2\$이면 \$F \= 3\$ (\$1\$가지)\!  
- 합계: \$(1 \+ 1\) \+ (2 \+ 1\) \= 5\$가지\! 따라서 \$B, C\$ 선택 \$3 \\times 2 \= 6\$을 곱하면 \$6 \\times 5 \= 30\$가지이다. \$\\implies \\alpha \= 15 \\times 4 \\times 30 \= 1800\$

(2) \$\\beta\$ (서로 다른 \$5\$가지 색만 사용): 사용할 \$5\$가지 색을 고르는 방법: \${}\_6C\_5 \= 6\$가지 중앙 \$A\$의 색 선택: \$5\$가지 바깥 \$5\$개 영역에 나머지 \$4\$색을 모두 사용하려면 한 색만 \$2\$번, 나머지 \$3\$색은 \$1\$번씩 쓰인다.

- 두 번 쓸 색 선택: \$4\$가지  
- 그 색이 놓일 서로 인접하지 않은 \$2\$영역 선택: \${}\_5C\_2 - 5 \= 5\$가지  
- 남은 \$3\$영역에 나머지 \$3\$색 배열: \$3\! \= 6\$가지 \$\\implies \\beta \= 6 \\times 5 \\times (4 \\times 5 \\times 6\) \= 30 \\times 120 \= 3600\$

\$\\therefore \\alpha \+ \\beta \= 1800 \+ 3600 \= 5400\$ (⑤)

```
{"question": {"status": "UNSUPPORTED", "reason": "중앙 영역 A와 바깥 5각 고리 B~F의 6영역 색칠 도식은 SVG 엔진 지원 대상이 아니다."}, "solution": {"status": "EXEMPT", "reason": "고정 색 수(4색, 5색)별로 중앙 A를 고정하고 바깥 5각 고리의 인접 조건을 경우 나누어 계산한다."}}
```

```
{"sourceQid": 15, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-07", "subUnitKey": "H15-SB-07-PERMUTATION_RESTRICTED", "conceptClusterKey": "", "primaryMethod": "사용 색 조합(${}_6C_4, {}_6C_5$)과 중앙 $A$ 색을 고정한 뒤 바깥 $5$각 고리에 정확히 $3$색($30$가지) 또는 $4$색($120$가지)을 칠하는 수를 곱한다.", "decisiveStep": "바깥 $5$각 고리에서 정확히 $3$색을 쓰는 경우($30$가지)와 $4$색 중 한 색만 $2$회 쓰는 경우($120$가지)를 정확히 구별한다.", "rpm": {"majorUnit": "경우의 수", "midUnit": "경우의 수와 순열", "l3": "순열", "l4": "특정 조건 배열"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_ARRANGEMENT", "templateKey": "TPL_PERMUTATION_STANDARD_CONSTRAINT", "why": "high1.json H1-RPM-125(DIRECT_ACTIVE): 순열/특정 조건 배열"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "사용 색 개수가 정확히 지정된 원형 고리 색칠에서 중복 사용 색의 위치 제약까지 분류해야 하는 고난도 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"given": ["도형", "영역"], "goal": ["합", "개수"], "method": ["경우분류", "조합", "순열"], "condition": ["인접"]}}, "hold": ""}
```

## Q16

- 형식: 서답형  
- 배점: 4

### 발문

\<단답형 1\> \$a \\le x \\le \-2\$에서 함수 \$y \= \-\\sqrt{b - 2x} \+ 3\$의 최댓값이 \$3\$, 최솟값이 \$-1\$일 때, \$a \+ b\$의 값을 구하시오. (단, \$b\$는 상수이다.) \[4점\]

### 선지

없음

### 정답

\$-14\$

### 해설

함수 \$y \= \-\\sqrt{b - 2x} \+ 3\$은 정의역에서 \$x\$가 커질수록 \$-2x\$가 작아지고 \$-\\sqrt{b - 2x}\$가 커지므로 증가함수이다. 따라서 구간 \$a \\le x \\le \-2\$에서 최댓값은 \$x \= \-2\$, 최솟값은 \$x \= a\$에서 갖는다. \$x \= \-2\$에서 \$-\\sqrt{b \+ 4} \+ 3 \= 3 \\implies \\sqrt{b \+ 4} \= 0 \\implies b \= \-4\$ \$x \= a\$에서 \$-\\sqrt{-4 - 2a} \+ 3 \= \-1 \\implies \\sqrt{-4 - 2a} \= 4 \\implies \-4 - 2a \= 16 \\implies a \= \-10\$ \$\\therefore a \+ b \= \-10 \+ (-4) \= \-14\$

```
{"question": {"status": "EXEMPT", "reason": "발문에 그림이 없는 무리함수의 제한 구간 최대·최소 문항이다."}, "solution": {"capability": "sqrt-affine-spike-v1", "graphPlan": {"family": "sqrt-affine", "radicand": ["-4", "-2"], "amplitude": "1", "sign": -1, "offset": "3", "sourceDomain": {"kind": "NATURAL_SQRT_AFFINE"}, "domain": [-12, -2], "viewport": [-12, 0, -3, 4]}, "caption": "y=-√(-4-2x)+3은 구간 [-10,-2]에서 증가하여 x=-2일 때 최댓값 3, x=-10일 때 최솟값 -1을 갖는다."}}
```

```
{"sourceQid": 16, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-05", "subUnitKey": "H15-SB-05-IRRATIONAL_GRAPH", "conceptClusterKey": "", "primaryMethod": "무리함수 $y=-\\sqrt{b-2x}+3$이 증가함수임을 확인해 양 끝점 $x=-2$와 $x=a$에 각각 최댓값과 최솟값을 대입한다.", "decisiveStep": "$x=-2$에서 $b=-4$를 먼저 구한 뒤 $x=a$ 대입으로 $a=-10$을 구한다.", "rpm": {"majorUnit": "함수", "midUnit": "무리함수", "l3": "정의역과 치역", "l4": "그래프 위치"}, "ptTplCandidate": {"problemTypeKey": "PT_FUNCTION_EXTREMUM", "templateKey": "TPL_FUNCTION_EXTREMUM_INTERVAL_ENDPOINT", "why": "high1.json H1-RPM-275(DIRECT_ACTIVE): 정의역과 치역/그래프 위치"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "무리함수의 증가·감소 방향을 판별해 구간 끝점 함숫값으로 두 미지수를 구하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단답", "slots": {"given": ["무리함수"], "goal": ["합"], "method": ["증가감소", "대입"], "condition": ["구간", "최댓값", "최솟값"]}}, "hold": ""}
```

## Q17

- 형식: 서답형  
- 배점: 5

### 발문

\<단답형 2\> \$0 \\le x \\le 1\$에서 정의된 함수 \$f(x) \= \\dfrac{-x \+ 1}{x \+ 1}\$이 모든 실수 \$x\$에 대하여 \$f(x) \= f(-x)\$, \$f(x) \= f(x \+ 2)\$를 만족시킨다. 함수 \$y \= f(x)\$의 그래프와 직선 \$y \= \\left\|\\dfrac{1}{2024}x\\right\|\$의 교점의 개수를 구하시오. \[5점\]

### 선지

없음

### 정답

\$4048\$

### 해설

\$f(x) \= f(-x)\$이고 \$f(x) \= f(x \+ 2)\$이므로 \$y \= f(x)\$는 \$y\$축에 대하여 대칭이고 주기가 \$2\$인 함수이다. \$\[0, 1\]\$에서 \$f(x) \= \-1 \+ \\dfrac{2}{x \+ 1}\$는 \$(0, 1)\$에서 \$(1, 0)\$으로 감소하고, \$\[1, 2\]\$에서는 \$y\$축 대칭과 주기성으로 \$(1, 0)\$에서 \$(2, 1)\$로 증가한다. \$x \\ge 0\$에서 직선 \$y \= \\dfrac{x}{2024}\$는 \$x \= 2024\$일 때 \$y \= 1\$이므로, \$x \> 2024\$에서는 교점이 없다. (\$f(x) \\le 1\$)

- 감소 구간 \$\[2n, 2n \+ 1\]\$ (\$n \= 0, 1, \\cdots, 1011\$): \$f\$는 감소(\$1 \\to 0\$)하고 직선은 증가(\$\\le 1\$)하므로 각 구간마다 교점이 \$1\$개씩 (\$1012\$개), 또한 \$x \= 2024\$에서 \$f(2024) \= 1 \= \\dfrac{2024}{2024}\$이므로 \$1\$개 추가되어 총 \$1013\$개이다.  
- 증가 구간 \$\[2n \+ 1, 2n \+ 2\]\$ (\$n \= 0, 1, \\cdots, 1011\$): 각 구간에서 \$t \= x - (2n \+ 1\) \\in \[0, 1\]\$로 두면 \$f(x) \= \\dfrac{t}{2 - t}\$는 \$0 \\to 1\$로 증가하고, \$\\dfrac{x}{2024} \= \\dfrac{2n \+ 1 \+ t}{2024}\$와 \$t=0\$에서 \$0 \< \\dfrac{2n+1}{2024}\$, \$t=1\$에서 \$1 \\ge \\dfrac{2n+2}{2024}\$이므로 사잇값 비교(이차방정식)로 각 구간마다 교점이 \$1\$개씩 총 \$1012\$개이다. 이 중 \$x \= 2024\$(\$n=1011\$의 끝점)는 두 목록에서 중복되므로 \$x \\ge 0\$에서의 교점 개수는 \$1013 \+ 1012 - 1 \= 2024\$개이다. \$x \= 0\$은 교점이 아니며 두 그래프 모두 \$y\$축에 대하여 대칭이므로 전체 교점의 개수는 \$\\therefore 2 \\times 2024 \= 4048\$

```
{"status": "EXEMPT", "reason": "주기성과 우함수 대칭을 이용해 $x=2024$까지의 반주기별 교점 개수를 세는 단답형 문항이므로 그림이 필요하지 않다."}
```

```
{"sourceQid": 17, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-04", "subUnitKey": "H15-SB-04-RATIONAL_APPLICATION", "conceptClusterKey": "", "primaryMethod": "$y$축 대칭과 주기 $2$를 이용해 $0\\le x\\le 2024$의 감소 구간과 증가 구간별 교점 개수를 세고 $2$배한다.", "decisiveStep": "끝점 $x=2024$의 중복과 $x=0$ 비교점을 확인하여 $x\\ge 0$ 교점이 $2024$개임을 구한다.", "rpm": {"majorUnit": "함수", "midUnit": "유리함수", "l3": "유리함수의 활용", "l4": "유리함수와 그래프의 교점"}, "ptTplCandidate": {"problemTypeKey": "PT_FUNCTION_GRAPH_INTERSECTION", "templateKey": "TPL_FUNCTION_INTERSECTION_TWO_FUNCTIONS", "why": "high1.json H1-RPM-114(DIRECT_ACTIVE): 유리함수의 활용/유리함수와 그래프의 교점"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "주기함수·우함수 조건으로 구간별 개형을 복원하고 경계 $x=2024$에서의 교점 중복까지 처리해야 하는 고난도 문항이다.", "level": "상", "item4slot": {"format": "단답", "slots": {"given": ["유리함수", "주기함수", "우함수"], "goal": ["개수"], "method": ["대칭성", "경우분류"], "condition": ["주기", "교점", "절댓값"]}}, "hold": ""}
```

## Q18

- 형식: 서답형  
- 배점: 6

### 발문

\<단답형 3\> \$6\$ 이하의 세 자연수 \$a, b, c\$에 대하여 정의역이 \${x \\mid x \> 0}\$인 함수 \$f(x) \= \\dfrac{ax \+ b}{x \+ c}\$가 일대일함수가 되도록 하는 순서쌍 \$(a, b, c)\$의 개수를 구하시오. \[6점\]

### 선지

없음

### 정답

\$202\$

### 해설

\$f(x) \= \\dfrac{ax \+ b}{x \+ c} \= a \+ \\dfrac{b - ac}{x \+ c}\$ 정의역 \$x \> 0\$에서 서로 다른 \$x\_1, x\_2\$에 대하여 \$\\dfrac{1}{x\_1 \+ c} \\ne \\dfrac{1}{x\_2 \+ c}\$이므로 \$b - ac \\ne 0\$이면 \$f\$는 일대일함수이고, \$b \= ac\$이면 \$f(x) \= a\$인 상수함수이므로 일대일함수가 아니다. \$6\$ 이하의 자연수 \$(a, b, c)\$의 전체 순서쌍 개수는 \$6^3 \= 216\$개이다. 이 중 \$b \= ac\$ (\$1 \\le b \\le 6\$)를 만족하는 순서쌍의 개수는

- \$a \= 1\$: \$c \= 1, 2, 3, 4, 5, 6\$ (\$6\$개)  
- \$a \= 2\$: \$c \= 1, 2, 3\$ (\$3\$개)  
- \$a \= 3\$: \$c \= 1, 2\$ (\$2\$개)  
- \$a \= 4, 5, 6\$: 각각 \$c \= 1\$ (\$3\$개) 합계 \$6 \+ 3 \+ 2 \+ 3 \= 14\$개이다. \$\\therefore 216 - 14 \= 202\$

```
{"status": "EXEMPT", "reason": "유리함수의 표준형 변형으로 상수함수가 되는 조건 $b=ac$를 찾아 여사건으로 세는 단답형 문항이므로 그림이 필요하지 않다."}
```

```
{"sourceQid": 18, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-03", "subUnitKey": "H15-SB-03-FUNCTION_RELATION", "conceptClusterKey": "", "primaryMethod": "$f(x)=a+\\dfrac{b-ac}{x+c}$에서 일대일함수 조건이 $b\\ne ac$임을 파악해 전체 $6^3$에서 $b=ac$인 경우를 뺀다.", "decisiveStep": "$1\\le ac\\le 6$을 만족하는 자연수 쌍 $(a,c)$가 $14$개임을 세어 $216-14=202$를 구한다.", "rpm": {"majorUnit": "함수", "midUnit": "함수", "l3": "함수의 성질", "l4": "일대일함수"}, "ptTplCandidate": {"problemTypeKey": "PT_FUNCTION_COUNTING", "templateKey": "TPL_MONOTONE_FUNCTION_COUNT", "why": "high1.json H1-RPM-284(DIRECT_ACTIVE): 함수의 성질/일대일함수"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "유리함수의 일대일 조건을 분자 상수 비영($b-ac\\ne 0$)으로 전환하고 여사건으로 자연수 순서쌍을 세는 중상 난이도 문항이다.", "level": "상", "item4slot": {"format": "단답", "slots": {"given": ["유리함수", "자연수"], "goal": ["개수"], "method": ["표준형", "여사건", "열거"], "condition": ["일대일함수", "범위"]}}, "hold": ""}
```

## Q19

- 형식: 서답형  
- 배점: 10

### 발문

\<서술형 1\> 그림과 같이 유리함수 \$y \= \\dfrac{k}{x}\$ \$(k \< 0)\$의 그래프가 직선 \$y \= x \+ 8\$과 두 점 \$P, Q\$에서 만난다. 삼각형 \$OPQ\$의 넓이가 \$16\$일 때, 상수 \$k\$의 값을 구하는 과정을 서술하시오. (단, \$O\$는 원점이다.) \[10점\]

### 선지

없음

### 정답

\$-12\$

### 해설

두 교점 \$P, Q\$의 \$x\$좌표를 \$x\_1, x\_2\$라 하면 \$\\dfrac{k}{x} \= x \+ 8 \\implies x^2 \+ 8x - k \= 0\$의 두 근이다. 근과 계수의 관계에 의하여 \$x\_1 \+ x\_2 \= \-8\$, \$x\_1 x\_2 \= \-k\$이다. \$P(x\_1, x\_1 \+ 8)\$, \$Q(x\_2, x\_2 \+ 8)\$이므로 삼각형 \$OPQ\$의 넓이는 \$\\dfrac{1}{2}\|x\_1(x\_2 \+ 8\) - x\_2(x\_1 \+ 8)\| \= \\dfrac{1}{2}\|8(x\_1 - x\_2)\| \= 4\|x\_1 - x\_2\|\$ 넓이가 \$16\$이므로 \$4\|x\_1 - x\_2\| \= 16 \\implies \|x\_1 - x\_2\| \= 4\$ 양변을 제곱하면 \$(x\_1 - x\_2)^2 \= (x\_1 \+ x\_2)^2 - 4x\_1 x\_2 \= (-8)^2 - 4(-k) \= 64 \+ 4k \= 16\$ \$4k \= \-48 \\implies k \= \-12\$ (\$k \= \-12 \< 0\$이고 판별식 \$D/4 \= 16 \+ (-12) \= 4 \> 0\$이므로 서로 다른 두 교점이 존재한다.) \$\\therefore k \= \-12\$

```
{"question": {"capability": "multi-curve-figure-v1", "graphPlan": {"family": "multi-curve", "curves": [{"id": "rat", "kind": "RATIONAL", "numerator": ["-12", "0"], "denominator": ["0", "1"], "domain": ["-10", "-1"]}], "overlays": {"lines": [{"id": "l", "slope": "1", "intercept": "8"}], "points": [{"id": "P", "x": "-6", "y": "2", "label": "P"}, {"id": "Q", "x": "-2", "y": "6", "label": "Q"}]}, "axisTickValues": {"x": ["-6", "-2"], "y": ["2", "6"]}}, "caption": "y=k/x (k<0)와 직선 y=x+8의 두 교점 P, Q와 원점 O가 이루는 삼각형 OPQ"}, "solution": {"capability": "multi-curve-figure-v1", "graphPlan": {"family": "multi-curve", "curves": [{"id": "rat", "kind": "RATIONAL", "numerator": ["-12", "0"], "denominator": ["0", "1"], "domain": ["-10", "-1"]}], "overlays": {"lines": [{"id": "l", "slope": "1", "intercept": "8"}], "points": [{"id": "P", "x": "-6", "y": "2", "label": "P"}, {"id": "Q", "x": "-2", "y": "6", "label": "Q"}]}, "axisTickValues": {"x": ["-6", "-2"], "y": ["2", "6"]}}, "caption": "k=-12일 때 두 교점은 P(-6,2), Q(-2,6)이고 삼각형 OPQ의 넓이는 16이다."}}
```

```
{"sourceQid": 19, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-04", "subUnitKey": "H15-SB-04-RATIONAL_APPLICATION", "conceptClusterKey": "", "primaryMethod": "교점 $x$좌표가 이루는 이차방정식 $x^2+8x-k=0$의 근과 계수의 관계와 삼각형 $OPQ$ 넓이 $4|x_1-x_2|=16$을 연립한다.", "decisiveStep": "$(x_1-x_2)^2=64+4k=16$에서 $k=-12$를 구하고 $k<0$ 조건을 확인한다.", "rpm": {"majorUnit": "함수", "midUnit": "유리함수", "l3": "유리함수의 활용", "l4": "유리함수와 그래프의 교점"}, "ptTplCandidate": {"problemTypeKey": "PT_FUNCTION_GRAPH_INTERSECTION", "templateKey": "TPL_FUNCTION_INTERSECTION_TWO_FUNCTIONS", "why": "high1.json H1-RPM-114(DIRECT_ACTIVE): 유리함수의 활용/유리함수와 그래프의 교점"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "유리함수와 직선의 교점 방정식에서 근과 계수의 관계와 좌표 삼각형 넓이 공식을 결합하는 중상 난이도 서술형 문항이다.", "level": "상", "item4slot": {"format": "서술", "slots": {"given": ["유리함수", "직선", "삼각형"], "goal": ["매개변수"], "method": ["근과계수의관계", "넓이", "이차방정식"], "condition": ["교점", "음수"]}}, "hold": ""}
```

## Q20

- 형식: 서답형  
- 배점: 10

### 발문

\<서술형 2\> 두 일차함수 \$f\_1, f\_2\$에 대하여 \$f\_1 \\circ f\_1\$, \$f\_1 \\circ f\_2\$, \$f\_2 \\circ f\_1\$, \$f\_2 \\circ f\_2\$는 각각 \$f\_1\$ 또는 \$f\_2\$와 일치한다. 이때 \$f\_1(3) \= f\_2(3) \= 3\$을 만족시키는 함수 \$f\_1, f\_2\$의 순서쌍 \$(f\_1, f\_2)\$ 중 \$f\_1(8) \= 8\$일 때, 가능한 \$f\_2(8)\$의 값의 곱을 구하는 과정을 서술하시오. \[10점\]

### 선지

없음

### 정답

\$-16\$

### 해설

\$f\_1(3) \= f\_2(3) \= 3\$인 두 일차함수는 기울기를 각각 \$a\_1, a\_2\$ (\$a\_1 \\ne 0, a\_2 \\ne 0\$)라 하면 \$f\_1(x) \= a\_1(x - 3\) \+ 3\$, \$f\_2(x) \= a\_2(x - 3\) \+ 3\$ 로 나타낼 수 있다. \$f\_1(8) \= 5a\_1 \+ 3 \= 8 \\implies a\_1 \= 1\$, 즉 \$f\_1(x) \= x\$이다. \$a\_2 \= t\$ (\$t \\ne 0\$)라 하면 \$(f\_2 \\circ f\_2)(x) \= t^2(x - 3\) \+ 3\$이 \$f\_1\$ 또는 \$f\_2\$와 같아야 하므로 \$t^2 \= 1\$ 또는 \$t^2 \= t\$ \$t \\ne 0\$이므로 \$t \= 1\$ 또는 \$t \= \-1\$이다. (실제로 \$t \= 1\$이면 \$f\_1 \= f\_2 \= I\$로 네 합성 모두 \$f\_1\$, \$t \= \-1\$이면 \$f\_1 \\circ f\_1 \= f\_2 \\circ f\_2 \= f\_1\$, \$f\_1 \\circ f\_2 \= f\_2 \\circ f\_1 \= f\_2\$가 되어 모두 성립한다.) 따라서 가능한 \$f\_2(8) \= 5t \+ 3\$의 값은 \$8\$과 \$-2\$이다. \$\\therefore 8 \\times (-2) \= \-16\$

```
{"status": "EXEMPT", "reason": "고정점 $(3,3)$을 지나는 일차함수를 기울기 매개변수로 표현해 합성 닫힘 조건을 푸는 서술형 문항이므로 그림이 필요하지 않다."}
```

```
{"sourceQid": 20, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-03", "subUnitKey": "H15-SB-03-COMPOSITE_FUNCTION", "conceptClusterKey": "", "primaryMethod": "점 $(3,3)$을 지나는 일차함수를 $a_i(x-3)+3$으로 두고 합성 닫힘 조건에서 기울기 방정식 $t^2=1$ 또는 $t^2=t$를 푼다.", "decisiveStep": "일차함수이므로 기울기 $t\\ne 0$임을 확인해 $t=\\pm 1$만 남기고 $f_2(8)=8,-2$의 곱 $-16$을 구한다.", "rpm": {"majorUnit": "함수", "midUnit": "함수", "l3": "합성함수", "l4": "정의역 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_COMPOSITION_PROPERTIES", "templateKey": "TPL_COMPOSITION_RELATION_CONDITION", "why": "high1.json H1-RPM-103(DIRECT_ACTIVE): 합성함수/정의역 조건"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "일차함수의 합성 구조가 고정점 $(3,3)$을 중심으로 한 기울기의 곱셈 닫힘으로 환원됨을 파악하는 고난도 서술형 문항이다.", "level": "상", "item4slot": {"format": "서술", "slots": {"given": ["일차함수", "합성함수"], "goal": ["곱", "함숫값"], "method": ["기울기", "방정식"], "condition": ["닫힘", "통과"]}}, "hold": ""}
```

