

```
{"stem": "22_금당고_2학기_기말_고1_유사", "sourceArchiveFile": "original/high/h1/2final/22_금당고_2학기_기말_고1_기출.js", "examFolder": "2final", "grade": "고1", "curriculum": "2015", "questionCount": 21, "totalScore": 100.0, "generatedAt": "2026-11-16"}
```

## Q01

- 형식: 객관식  
- 배점: 3.8

### 발문

유리함수 \$y \= \\dfrac{3}{x \+ 4} \+ 2\$의 그래프의 점근선의 방정식이 \$x \= p\$, \$y \= q\$일 때, \$p \+ q\$의 값은? \[3.8점\]

### 선지

① \$-6\$ ② \$-4\$ ③ \$-2\$ ④ \$2\$ ⑤ \$6\$

### 정답

③

### 해설

유리함수 \$y \= \\dfrac{3}{x \+ 4} \+ 2\$에서 수직점근선은 \$x \+ 4 \= 0 \\implies x \= \-4\$이므로 \$p \= \-4\$ 수평점근선은 \$y \= 2\$이므로 \$q \= 2\$ \$\\therefore p \+ q \= \-4 \+ 2 \= \-2\$ (③)

```
{"question": {"status": "EXEMPT", "reason": "발문에 그림이 없는 유리함수 표준형의 점근선 판독 문항이다."}, "solution": {"capability": "rational-basic-v1", "graphPlan": {"family": "rational-basic", "numerator": ["11", "2"], "denominator": ["4", "1"], "domain": ["-10", "2"], "viewport": [-10, 2, -4, 8], "asymptotes": {"x": ["-4"], "y": ["2"]}}, "caption": "y=3/(x+4)+2의 수직점근선은 x=-4, 수평점근선은 y=2이다."}}
```

```
{"sourceQid": 1, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-04", "subUnitKey": "H15-SB-04-RATIONAL_APPLICATION", "conceptClusterKey": "", "primaryMethod": "표준형 $y=\\dfrac{3}{x+4}+2$에서 분모를 $0$으로 만드는 $x=-4$와 상수항 $y=2$를 두 점근선으로 읽어 합한다.", "decisiveStep": "수직점근선 $p=-4$의 부호에 유의하여 $p+q=-4+2=-2$를 계산한다.", "rpm": {"majorUnit": "함수", "midUnit": "유리함수", "l3": "유리함수의 활용", "l4": "유리함수와 그래프의 교점"}, "ptTplCandidate": {"problemTypeKey": "PT_FUNCTION_GRAPH_INTERSECTION", "templateKey": "TPL_FUNCTION_INTERSECTION_TWO_FUNCTIONS", "why": "high1.json H1-RPM-114(DIRECT_ACTIVE): 유리함수의 활용/유리함수와 그래프의 교점"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "유리함수의 표준형에서 두 점근선의 방정식을 직접 읽어 더하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"given": ["유리함수", "표준형"], "goal": ["합"], "method": ["점근선"], "condition": []}}, "hold": ""}
```

## Q02

- 형식: 객관식  
- 배점: 3.8

### 발문

함수 \$f(x) \= \\sqrt{x \+ a} \+ 3\$이 \$f(-2) \= 5\$를 만족시킬 때, 상수 \$a\$의 값은? \[3.8점\]

### 선지

① \$6\$ ② \$7\$ ③ \$8\$ ④ \$9\$ ⑤ \$10\$

### 정답

①

### 해설

\$f(-2) \= \\sqrt{-2 \+ a} \+ 3 \= 5\$ \$\\sqrt{a - 2} \= 2\$ 양변을 제곱하면 \$a - 2 \= 4 \\implies a \= 6\$ (\$a - 2 \= 4 \\ge 0\$이므로 근호 안이 음이 아닌 조건을 만족한다.) \$\\therefore a \= 6\$ (①)

```
{"question": {"status": "EXEMPT", "reason": "발문에 그림이 없는 무리함수 함숫값 대입 문항이다."}, "solution": {"capability": "sqrt-affine-spike-v1", "graphPlan": {"family": "sqrt-affine", "radicand": ["6", "1"], "amplitude": "1", "sign": 1, "offset": "3", "sourceDomain": {"kind": "NATURAL_SQRT_AFFINE"}, "domain": [-6, 2], "viewport": [-7, 3, 0, 7]}, "caption": "a=6일 때 y=√(x+6)+3은 점 (-2,5)를 지난다."}}
```

```
{"sourceQid": 2, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-05", "subUnitKey": "H15-SB-05-IRRATIONAL_GRAPH", "conceptClusterKey": "", "primaryMethod": "주어진 함숫값 $f(-2)=5$를 $f(x)=\\sqrt{x+a}+3$에 대입해 $\\sqrt{a-2}=2$의 양변을 제곱한다.", "decisiveStep": "$\\sqrt{a-2}=2$에서 $a=6$을 구하고 근호 안 비음 조건을 확인한다.", "rpm": {"majorUnit": "함수", "midUnit": "무리함수", "l3": "무리함수의 그래프", "l4": "기본 그래프"}, "ptTplCandidate": {"problemTypeKey": "PT_FUNCTION_GRAPH_PROPERTIES", "templateKey": "TPL_FUNCTION_GRAPH_PROPERTY_JUDGMENT", "why": "high1.json H1-RPM-115(DIRECT_ACTIVE): 무리함수의 그래프/기본 그래프"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "무리함수 식에 점 좌표를 대입하여 일차방정식으로 미정계수를 구하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"given": ["무리함수", "함숫값"], "goal": ["값"], "method": ["대입"], "condition": ["통과"]}}, "hold": ""}
```

## Q03

- 형식: 객관식  
- 배점: 4

### 발문

숫자 \$1, 2, 3, 4, 5\$가 각각 적힌 카드 \$5\$장이 있다. 이 중에서 \$2\$장을 뽑아 두 자리의 자연수를 만들 때, 짝수의 개수는? \[4점\]

### 선지

① \$4\$ ② \$5\$ ③ \$6\$ ④ \$8\$ ⑤ \$10\$

### 정답

④

### 해설

두 자리 자연수가 짝수이려면 일의 자리 숫자가 짝수(\$2\$ 또는 \$4\$)여야 한다. 일의 자리를 고르는 경우의 수: \$2\$가지 십의 자리는 남은 \$4\$장의 카드 중 \$1\$장을 고르므로: \$4\$가지 \$\\therefore 2 \\times 4 \= 8\$ (④)

```
{"status": "EXEMPT", "reason": "짝수 조건에 맞춰 일의 자리와 십의 자리를 차례로 정하는 기본 곱의 법칙 문항이다."}
```

```
{"sourceQid": 3, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-06", "subUnitKey": "H15-SB-06-COUNTING_PRINCIPLE", "conceptClusterKey": "", "primaryMethod": "짝수 조건이 걸린 일의 자리($2, 4$ 중 $2$가지)를 먼저 정한 뒤 십의 자리(남은 $4$가지)를 곱한다.", "decisiveStep": "일의 자리에 카드 $1$장을 사용한 뒤 십의 자리에 남은 $4$장만 올 수 있음을 곱의 법칙에 적용한다.", "rpm": {"majorUnit": "경우의 수", "midUnit": "경우의 수와 순열", "l3": "합·곱의 법칙", "l4": "경우를 나누어 세기"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COUNTING_PRINCIPLE_GENERAL", "templateKey": "TPL_H1_COUNTING_DIRECT_CASE", "why": "high1.json H1-RPM-122(DIRECT_ACTIVE): 합·곱의 법칙/경우를 나누어 세기"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "일의 자리 제한 조건과 곱의 법칙을 바로 적용하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"given": ["자연수"], "goal": ["개수"], "method": ["곱의법칙"], "condition": ["홀짝", "자리제한", "중복불허"]}}, "hold": ""}
```

## Q04

- 형식: 객관식  
- 배점: 4

### 발문

이어달리기 선수 \$7\$명 중에서 \$3\$명을 뽑아 달리기 순서를 정하는 모든 경우의 수는? \[4점\]

### 선지

① \$35\$ ② \$210\$ ③ \$240\$ ④ \$343\$ ⑤ \$840\$

### 정답

②

### 해설

서로 다른 \$7\$명 중에서 \$3\$명을 뽑아 순서대로 나열하는 경우의 수는 순열 \${}\_7P\_3\$이다. \$\\therefore {}\_7P\_3 \= 7 \\times 6 \\times 5 \= 210\$ (②)

```
{"status": "EXEMPT", "reason": "순열 기호의 정의를 직접 계산하는 기본 문항이므로 그림이 필요하지 않다."}
```

```
{"sourceQid": 4, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-08", "subUnitKey": "H15-SB-08-COMBINATION_BASIC", "conceptClusterKey": "", "primaryMethod": "서로 다른 $7$명에서 $3$명을 뽑아 순서를 정하는 순열 ${}_7P_3=7\\times 6\\times 5$를 계산한다.", "decisiveStep": "순서가 구별되므로 조합이 아닌 순열 ${}_7P_3=210$을 선택한다.", "rpm": {"majorUnit": "경우의 수", "midUnit": "조합", "l3": "조합의 뜻과 계산", "l4": "조합 계산"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_SELECTION_DISTRIBUTION", "templateKey": "TPL_H1_BINOMIAL_PARAMETER_RELATION", "why": "high1.json H1-RPM-277(DIRECT_ACTIVE): 조합의 뜻과 계산/조합 계산"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "순열의 정의 ${}_7P_3$을 한 단계로 계산하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"given": ["구별가능"], "goal": ["개수"], "method": ["순열"], "condition": ["순서"]}}, "hold": ""}
```

## Q05

- 형식: 객관식  
- 배점: 4

### 발문

두 자연수 \$a, b\$에 대하여 \${}*{12}C\_a \= {}*{11}C\_5 \+ {}\_{11}C\_6\$, \${}\_9C\_6 \= {}\_bC\_6 \+ {}\_8C\_5\$가 성립할 때, \$a \+ b\$의 값은? \[4점\]

### 선지

① \$10\$ ② \$11\$ ③ \$12\$ ④ \$13\$ ⑤ \$14\$

### 정답

⑤

### 해설

조합의 성질 \${}*{n}C\_r \= {}*{n-1}C\_{r-1} \+ {}*{n-1}C\_r\$에 의하여 \${}*{11}C\_5 \+ {}*{11}C\_6 \= {}*{12}C\_6\$이므로 \${}*{12}C\_a \= {}*{12}C\_6 \\implies a \= 6\$ (\$a=6\$은 가운데 항이므로 유일) 또한 \${}\_9C\_6 \= {}\_8C\_6 \+ {}\_8C\_5\$이므로 \${}\_bC\_6 \= {}\_8C\_6\$ \$b \\ge 6\$인 자연수에 대하여 \${}\_bC\_6\$은 증가하므로 \$b \= 8\$ \$\\therefore a \+ b \= 6 \+ 8 \= 14\$ (⑤)

```
{"status": "EXEMPT", "reason": "파스칼 항등식 성질을 두 번 적용하여 자연수 미지수를 구하는 문항이므로 그림이 필요하지 않다."}
```

```
{"sourceQid": 5, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-08", "subUnitKey": "H15-SB-08-COMBINATION_BASIC", "conceptClusterKey": "", "primaryMethod": "조합의 기본 성질 ${}_nC_r={}_{n-1}C_{r-1}+{}_{n-1}C_r$을 두 등식에 적용해 $a=6, b=8$을 구한다.", "decisiveStep": "${}_{12}C_6$의 유일한 아래첨자 $a=6$과 ${}_bC_6={}_8C_6$에서 $b=8$을 확정한다.", "rpm": {"majorUnit": "경우의 수", "midUnit": "조합", "l3": "조합의 뜻과 계산", "l4": "조합 계산"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_SELECTION_DISTRIBUTION", "templateKey": "TPL_H1_BINOMIAL_PARAMETER_RELATION", "why": "high1.json H1-RPM-277(DIRECT_ACTIVE): 조합의 뜻과 계산/조합 계산"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "조합의 항등식 ${}_nC_r={}_{n-1}C_{r-1}+{}_{n-1}C_r$을 순방향과 역방향으로 적용해 두 값을 구하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": ["조합", "자연수"], "goal": ["합"], "method": ["조합", "파스칼의삼각형"], "condition": ["유일성"]}}, "hold": ""}
```

## Q06

- 형식: 객관식  
- 배점: 4

### 발문

유리함수 \$y \= \\dfrac{4x - 3}{x - 1}\$의 역함수가 \$y \= \\dfrac{ax \+ b}{x \+ c}\$일 때, \$a \+ b \+ c\$의 값은? (단, \$a, b, c\$는 상수이다.) \[4점\]

### 선지

① \$-8\$ ② \$-7\$ ③ \$-6\$ ④ \$-5\$ ⑤ \$-4\$

### 정답

③

### 해설

\$y \= \\dfrac{4x - 3}{x - 1}\$에서 \$x\$와 \$y\$를 서로 바꾸면 \$x \= \\dfrac{4y - 3}{y - 1}\$ \$x(y - 1\) \= 4y - 3 \\implies xy - x \= 4y - 3 \\implies (x - 4)y \= x - 3\$ \$y \= \\dfrac{x - 3}{x - 4}\$ 따라서 \$a \= 1\$, \$b \= \-3\$, \$c \= \-4\$이므로 \$\\therefore a \+ b \+ c \= 1 \+ (-3) \+ (-4) \= \-6\$ (③)

```
{"question": {"status": "EXEMPT", "reason": "발문에 그림이 없는 분수함수의 역함수 계수 구하기 문항이다."}, "solution": {"capability": "rational-basic-v1", "graphPlan": {"family": "rational-basic", "numerator": ["-3", "4"], "denominator": ["-1", "1"], "domain": ["-4", "6"], "viewport": [-4, 6, -3, 7], "asymptotes": {"x": ["1"], "y": ["4"]}, "overlays": {"lines": [{"id": "yx", "slope": "1", "intercept": "0"}]}}, "caption": "y=(4x-3)/(x-1)의 점근선 x=1, y=4가 역함수 y=(x-3)/(x-4)에서 x=4, y=1로 바뀐다."}}
```

```
{"sourceQid": 6, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-04", "subUnitKey": "H15-SB-04-RATIONAL_GRAPH", "conceptClusterKey": "", "primaryMethod": "$x=\\dfrac{4y-3}{y-1}$을 $y$에 관해 정리해 역함수 $y=\\dfrac{x-3}{x-4}$를 구하고 계수를 합한다.", "decisiveStep": "분모 $y-1$을 곱해 $y$항을 묶은 식 $(x-4)y=x-3$에서 부호 실수 없이 $a, b, c$를 읽는다.", "rpm": {"majorUnit": "함수", "midUnit": "유리함수", "l3": "점근선과 위치", "l4": "점근선"}, "ptTplCandidate": {"problemTypeKey": "PT_RATIONAL_ASYMPTOTE", "templateKey": "TPL_RATIONAL_ASYMPTOTE_DIRECT", "why": "high1.json H1-RPM-110(DIRECT_ACTIVE): 점근선과 위치/점근선"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "유리함수 식에서 $x, y$를 바꾸어 역함수의 표준 계수를 직접 도출하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": ["유리함수"], "goal": ["합"], "method": ["역함수"], "condition": []}}, "hold": ""}
```

## Q07

- 형식: 객관식  
- 배점: 4

### 발문

함수 \$f(x) \= x^2 \+ 3x \+ 2\$에 대하여 \$\\dfrac{1}{f(1)} \+ \\dfrac{1}{f(2)} \+ \\dfrac{1}{f(3)} \+ \\cdots \+ \\dfrac{1}{f(14)}\$의 값은? \[4점\]

### 선지

① \$\\dfrac{7}{16}\$ ② \$\\dfrac{3}{8}\$ ③ \$\\dfrac{5}{16}\$ ④ \$\\dfrac{1}{4}\$ ⑤ \$\\dfrac{9}{16}\$

### 정답

①

### 해설

\$f(k) \= k^2 \+ 3k \+ 2 \= (k \+ 1)(k \+ 2)\$이므로 부분분수로 분해하면 \$\\dfrac{1}{f(k)} \= \\dfrac{1}{(k \+ 1)(k \+ 2)} \= \\dfrac{1}{k \+ 1} - \\dfrac{1}{k \+ 2}\$ \$k \= 1\$부터 \$14\$까지 더하면 \$\\left(\\dfrac{1}{2} - \\dfrac{1}{3}\\right) \+ \\left(\\dfrac{1}{3} - \\dfrac{1}{4}\\right) \+ \\cdots \+ \\left(\\dfrac{1}{15} - \\dfrac{1}{16}\\right) \= \\dfrac{1}{2} - \\dfrac{1}{16} \= \\dfrac{7}{16}\$ \$\\therefore\$ ①

```
{"status": "EXEMPT", "reason": "이차식을 인수분해해 부분분수 망원합을 계산하는 대수 문항이므로 그림이 필요하지 않다."}
```

```
{"sourceQid": 7, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-04", "subUnitKey": "H15-SB-04-RATIONAL_GRAPH", "conceptClusterKey": "", "primaryMethod": "$f(k)=(k+1)(k+2)$를 부분분수 $\\dfrac{1}{k+1}-\\dfrac{1}{k+2}$로 분해해 $k=1\\sim 14$의 합을 연쇄 소거한다.", "decisiveStep": "중간 항 소거 후 남는 처음 항과 마지막 항의 차 $\\dfrac{1}{2}-\\dfrac{1}{16}=\\dfrac{7}{16}$을 계산한다.", "rpm": {"majorUnit": "함수", "midUnit": "유리함수", "l3": "유리함수의 그래프", "l4": "평행이동"}, "ptTplCandidate": {"problemTypeKey": "PT_FUNCTION_GRAPH_TRANSFORM", "templateKey": "TPL_FUNCTION_GRAPH_TRANSLATION", "why": "high1.json H1-RPM-109(DIRECT_ACTIVE): 유리함수의 그래프/평행이동"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차식 인수분해와 부분분수 분해 및 연쇄 소거를 차례로 실행하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": ["유리식", "이차식"], "goal": ["합"], "method": ["인수분해", "부분분수", "소거"], "condition": []}}, "hold": ""}
```

## Q08

- 형식: 객관식  
- 배점: 4.2

### 발문

함수 \$y \= \\sqrt{2x - 6} \+ 3\$과 그 역함수의 그래프는 서로 다른 두 점에서 만난다. 이때 두 교점 사이의 거리를 \$d\$, 두 교점을 지나는 직선의 기울기를 \$m\$이라고 할 때, \$d \+ m\$의 값은? \[4.2점\]

### 선지

① \$\\sqrt{2} \+ 1\$ ② \$2\$ ③ \$\\sqrt{3} \+ 1\$ ④ \$2\\sqrt{2} \+ 1\$ ⑤ \$3\$

### 정답

④

### 해설

함수 \$y \= \\sqrt{2(x - 3)} \+ 3\$은 정의역 \$x \\ge 3\$에서 증가함수이므로, 원함수와 역함수의 교점은 직선 \$y \= x\$ 위에 있다. \$\\sqrt{2x - 6} \+ 3 \= x \\implies \\sqrt{2(x - 3)} \= x - 3\$ \$t \= x - 3 \\ge 0\$으로 놓으면 \$\\sqrt{2t} \= t \\implies 2t \= t^2 \\implies t(t - 2\) \= 0\$ \$t \= 0\$ 또는 \$t \= 2 \\implies x \= 3\$ 또는 \$x \= 5\$ 따라서 두 교점은 \$(3, 3)\$, \$(5, 5)\$이다. 두 교점 사이의 거리: \$d \= \\sqrt{(5 - 3)^2 \+ (5 - 3)^2} \= 2\\sqrt{2}\$ 두 교점을 지나는 직선은 \$y \= x\$이므로 기울기: \$m \= 1\$ \$\\therefore d \+ m \= 2\\sqrt{2} \+ 1\$ (④)

```
{"question": {"status": "EXEMPT", "reason": "발문에 그림이 없는 무리함수와 역함수의 교점 거리·기울기 문항이다."}, "solution": {"capability": "sqrt-affine-spike-v1", "graphPlan": {"family": "sqrt-affine", "radicand": ["-6", "2"], "amplitude": "1", "sign": 1, "offset": "3", "sourceDomain": {"kind": "NATURAL_SQRT_AFFINE"}, "domain": [3, 7], "viewport": [0, 7, 0, 7]}, "caption": "y=√(2x-6)+3과 역함수의 교점은 직선 y=x 위의 (3,3), (5,5)이다."}}
```

```
{"sourceQid": 8, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-05", "subUnitKey": "H15-SB-05-IRRATIONAL_BASIC", "conceptClusterKey": "", "primaryMethod": "증가하는 무리함수와 역함수의 교점을 $y=x$와 연립해 $(3,3), (5,5)$를 구한 뒤 거리 $d$와 기울기 $m$을 합한다.", "decisiveStep": "$x-3=t$로 치환하여 $t^2=2t$에서 두 고정점 $(3,3),(5,5)$를 구하고 $d=2\\sqrt{2}, m=1$을 얻는다.", "rpm": {"majorUnit": "함수", "midUnit": "무리함수", "l3": "무리함수의 활용", "l4": "무리함수의 교점"}, "ptTplCandidate": {"problemTypeKey": "PT_FUNCTION_GRAPH_INTERSECTION", "templateKey": "TPL_FUNCTION_INTERSECTION_TWO_FUNCTIONS", "why": "high1.json H1-RPM-121(DIRECT_ACTIVE): 무리함수의 활용/무리함수의 교점"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "무리함수와 역함수의 교점 좌표에서 거리와 직선 기울기를 함께 구하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": ["무리함수", "역함수"], "goal": ["합", "거리", "기울기"], "method": ["고정점", "치환"], "condition": ["증가감소"]}}, "hold": ""}
```

## Q09

- 형식: 객관식  
- 배점: 4.2

### 발문

\$f(3 - x)\$와 \$f(3 \+ x)\$가 모두 정의되는 모든 실수 \$x\$에 대하여 다항함수가 아닌 유리함수 \$f(x) \= \\dfrac{bx \+ c}{x \+ a}\$가 \$f(3 - x) \+ f(3 \+ x) \= 8\$을 만족시키고 점 \$(4, 7)\$을 지날 때, \$\|a\| \+ \|b\| \+ \|c\|\$의 값은? (단, \$a, b, c\$는 상수이다.) \[4.2점\]

### 선지

① \$14\$ ② \$16\$ ③ \$18\$ ④ \$20\$ ⑤ \$22\$

### 정답

②

### 해설

\$f(x) \= b \+ \\dfrac{c - ab}{x \+ a}\$라 하고 \$d \= c - ab\$ (\$d \\ne 0\$, 다항함수가 아니므로)라 놓자. \$f(3 - x) \+ f(3 \+ x) \= 2b \+ \\dfrac{d}{3 \+ a - x} \+ \\dfrac{d}{3 \+ a \+ x} \= 2b \+ \\dfrac{2d(a \+ 3)}{(a \+ 3)^2 - x^2} \= 8\$ 이 등식이 정의되는 모든 \$x\$에 대해 성립하고 \$d \\ne 0\$이므로 \$a \+ 3 \= 0 \\implies a \= \-3\$, \$2b \= 8 \\implies b \= 4\$ 점 \$(4, 7)\$을 지나므로 \$f(4) \= \\dfrac{4(4) \+ c}{4 - 3} \= 16 \+ c \= 7 \\implies c \= \-9\$ (\$d \= \-9 - (-3)(4) \= 3 \\ne 0\$이므로 조건을 만족한다.) \$\\therefore \|a\| \+ \|b\| \+ \|c\| \= \|-3\| \+ \|4\| \+ \|-9\| \= 3 \+ 4 \+ 9 \= 16\$ (②)

```
{"question": {"status": "EXEMPT", "reason": "발문에 그림이 없는 유리함수의 점대칭 항등식 조건 문항이다."}, "solution": {"capability": "rational-basic-v1", "graphPlan": {"family": "rational-basic", "numerator": ["-9", "4"], "denominator": ["-3", "1"], "domain": ["-2", "8"], "viewport": [-2, 8, -2, 10], "asymptotes": {"x": ["3"], "y": ["4"]}, "points": [{"id": "C", "x": "3", "y": "4", "label": "(3,4)"}, {"id": "P", "x": "4", "y": "7", "label": "(4,7)"}]}, "caption": "f(3-x)+f(3+x)=8은 점 (3,4)에 대한 점대칭이므로 점근선은 x=3, y=4이다."}}
```

```
{"sourceQid": 9, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-04", "subUnitKey": "H15-SB-04-RATIONAL_GRAPH", "conceptClusterKey": "", "primaryMethod": "유리함수 $f(x)=b+\\dfrac{d}{x+a}$ ($d\\ne 0$)를 대칭식 $f(3-x)+f(3+x)=8$에 대입해 항등식 조건으로 $a=-3, b=4$를 구한다.", "decisiveStep": "분수항이 모든 $x$에서 소거되려면 $a+3=0$이어야 함을 파악하고 $(4,7)$ 대입으로 $c=-9$를 구한다.", "rpm": {"majorUnit": "함수", "midUnit": "유리함수", "l3": "점근선과 위치", "l4": "점근선"}, "ptTplCandidate": {"problemTypeKey": "PT_RATIONAL_ASYMPTOTE", "templateKey": "TPL_RATIONAL_ASYMPTOTE_DIRECT", "why": "high1.json H1-RPM-110(DIRECT_ACTIVE): 점근선과 위치/점근선"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "유리함수의 점대칭 항등식에서 분수항 소거 조건과 통과점 대입을 결합해 세 계수를 구하는 중상 난이도 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"given": ["유리함수", "항등식"], "goal": ["합"], "method": ["대칭성", "대입"], "condition": ["통과", "절댓값"]}}, "hold": ""}
```

## Q10

- 형식: 객관식  
- 배점: 4.2

### 발문

서로 다른 공 \$4\$개를 서로 다른 \$4\$개의 상자에 넣을 때, 공이 한 개도 없는 상자가 \$1\$개가 되도록 넣는 방법의 수는? \[4.2점\]

### 선지

① \$72\$ ② \$96\$ ③ \$108\$ ④ \$120\$ ⑤ \$144\$

### 정답

⑤

### 해설

공이 들어갈 \$3\$개의 상자를 먼저 고르는 경우의 수: \${}\_4C\_3 \= 4\$ 고른 \$3\$개의 상자에 서로 다른 공 \$4\$개를 넣되, 빈 상자가 없도록 하는 경우의 수는 (전체 넣는 방법) \$-\$ (적어도 \$1\$개 상자가 비는 방법) \$= 3^4 - {}\_3C\_1 \\cdot 2^4 \+ {}\_3C\_2 \\cdot 1^4 \= 81 - 48 \+ 3 \= 36\$ \$\\therefore 4 \\times 36 \= 144\$ (⑤)

```
{"status": "EXEMPT", "reason": "사용할 상자를 택한 뒤 포함·배제의 원리로 빈 상자 없는 배치 수를 세는 문항이므로 그림이 필요하지 않다."}
```

```
{"sourceQid": 10, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-06", "subUnitKey": "H15-SB-06-COUNTING_PRINCIPLE", "conceptClusterKey": "", "primaryMethod": "비어 있지 않을 $3$개 상자를 ${}_4C_3$으로 고른 뒤 서로 다른 공 $4$개를 $3$개 상자에 빈 상자 없이 넣는 수 $3^4-3\\cdot 2^4+3\\cdot 1^4$를 곱한다.", "decisiveStep": "포함·배제의 원리로 $3$개 상자 모두 공이 $1$개 이상 들어가는 $36$가지를 정확히 계산한다.", "rpm": {"majorUnit": "경우의 수", "midUnit": "경우의 수와 순열", "l3": "합·곱의 법칙", "l4": "경우를 나누어 세기"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COUNTING_PRINCIPLE_GENERAL", "templateKey": "TPL_H1_COUNTING_DIRECT_CASE", "why": "high1.json H1-RPM-122(DIRECT_ACTIVE): 합·곱의 법칙/경우를 나누어 세기"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "상자 선택 조합과 포함·배제 원리를 이용한 전사 배치를 결합해 계산하는 중상 난이도 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": ["구별가능"], "goal": ["개수"], "method": ["조합", "포함배제의원리", "곱의법칙"], "condition": ["중복허용"]}}, "hold": ""}
```

## Q11

- 형식: 객관식  
- 배점: 4.2

### 발문

남학생 \$4\$명과 여학생 \$n\$명이 단체 사진을 찍으려고 한다. 여학생이 양 끝에 오도록 한 줄로 서는 경우의 수가 남학생 \$4\$명이 서로 이웃하도록 한 줄로 서는 경우의 수의 \$10\$배일 때, \$n\$의 값은? \[4.2점\]

### 선지

① \$6\$ ② \$7\$ ③ \$8\$ ④ \$9\$ ⑤ \$10\$

### 정답

①

### 해설

여학생이 양 끝에 오도록 한 줄로 서는 경우의 수: \${}\_nP\_2 \\times (n \+ 2)\! \= n(n - 1)(n \+ 2)\!\$ 남학생 \$4\$명이 서로 이웃하도록 한 줄로 서는 경우의 수: \$(n \+ 1)\! \\times 4\! \= 24(n \+ 1)\!\$ 조건에 의하여 \$\\dfrac{n(n - 1)(n \+ 2)\!}{24(n \+ 1)\!} \= 10 \\implies \\dfrac{n(n - 1)(n \+ 2)}{24} \= 10\$ \$n(n - 1)(n \+ 2\) \= 240\$ \$n \= 6\$일 때 \$6 \\times 5 \\times 8 \= 240\$이 성립한다. (\$n \\ge 2\$에서 좌변은 증가하므로 유일하다.) \$\\therefore n \= 6\$ (①)

```
{"status": "EXEMPT", "reason": "양 끝 순열과 이웃 묶음 순열의 비율 방정식을 세워 자연수 $n$을 구하는 문항이므로 그림이 필요하지 않다."}
```

```
{"sourceQid": 11, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-07", "subUnitKey": "H15-SB-07-PERMUTATION_RESTRICTED", "conceptClusterKey": "", "primaryMethod": "여학생 양 끝 배열 ${}_nP_2(n+2)!$와 남학생 묶음 배열 $(n+1)!4!$의 비가 $10$임을 식으로 세워 약분한다.", "decisiveStep": "$(n+2)!/(n+1)!=n+2$로 약분한 식 $n(n-1)(n+2)=240$에서 자연수 해 $n=6$을 구한다.", "rpm": {"majorUnit": "경우의 수", "midUnit": "경우의 수와 순열", "l3": "순열", "l4": "특정 조건 배열"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_ARRANGEMENT", "templateKey": "TPL_PERMUTATION_STANDARD_CONSTRAINT", "why": "high1.json H1-RPM-125(DIRECT_ACTIVE): 순열/특정 조건 배열"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 가지 조건부 순열 식을 문자로 세운 뒤 계승 약분으로 삼차방정식의 자연수 해를 구하는 중상 난이도 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"given": ["구별가능", "순열"], "goal": ["값"], "method": ["묶음", "순열", "약분"], "condition": ["이웃", "자리제한", "자연수"]}}, "hold": ""}
```

## Q12

- 형식: 객관식  
- 배점: 4.4

### 발문

주머니 속에 서로 다른 사탕 \$5\$개와 서로 같은 초콜릿 \$2\$개가 있다. 이 주머니에서 다음 조건을 만족시키면서 \$5\$개의 간식을 차례로 하나씩 꺼내는 방법의 수는? \[4.4점\]

> (가) 초콜릿은 연속하여 꺼내지 않는다. (나) 사탕은 \$2\$개까지 연속하여 꺼낼 수 있다.

### 선지

① \$300\$ ② \$360\$ ③ \$420\$ ④ \$480\$ ⑤ \$540\$

### 정답

③

### 해설

사탕을 C, 초콜릿을 H라 하고 꺼낸 초콜릿 개수에 따라 경우를 나눈다. (1) 초콜릿을 \$1\$개 꺼내는 경우 (사탕 \$4\$개, 초콜릿 \$1\$개): 사탕이 \$3\$개 이상 연속하지 않으려면 H가 정가운데에 오는 `C C H C C`의 \$1\$가지 위치 패턴만 가능하다. 서로 다른 사탕 \$5\$개 중 \$4\$개를 골라 배열하는 방법: \${}\_5P\_4 \= 120\$ \$\\implies 1 \\times 120 \= 120\$가지 (2) 초콜릿을 \$2\$개 꺼내는 경우 (사탕 \$3\$개, 초콜릿 \$2\$개): \$5\$자리 중 H가 이웃하지 않게 \$2\$자리를 고르는 방법은 \${}\_4C\_2 \= 6\$가지인데, 이 중 `H C C C H`는 사탕이 \$3\$개 연속되므로 제외한다. 따라서 가능한 위치 패턴은 `H C C H C`, `H C H C C`, `C H C H C`, `C H C C H`, `C C H C H`의 \$5\$가지이다. 서로 다른 사탕 \$5\$개 중 \$3\$개를 골라 배열하는 방법: \${}\_5P\_3 \= 60\$ \$\\implies 5 \\times 60 \= 300\$가지 \$\\therefore 120 \+ 300 \= 420\$ (③)

```
{"status": "EXEMPT", "reason": "초콜릿 개수에 따른 위치 패턴을 분류하고 서로 다른 사탕의 순열을 곱해 세는 문항이므로 그림이 필요하지 않다."}
```

```
{"sourceQid": 12, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-07", "subUnitKey": "H15-SB-07-PERMUTATION_RESTRICTED", "conceptClusterKey": "", "primaryMethod": "꺼낸 초콜릿 개수($1$개 또는 $2$개)로 분류해 조건 (가), (나)를 만족하는 자리 패턴 수를 세고 사탕 순열을 곱한다.", "decisiveStep": "초콜릿 $2$개일 때 비이웃 $6$패턴 중 사탕 $3$연속인 `HCCCH`를 제외해 $5$패턴만 남긴다.", "rpm": {"majorUnit": "경우의 수", "midUnit": "경우의 수와 순열", "l3": "순열", "l4": "특정 조건 배열"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_ARRANGEMENT", "templateKey": "TPL_PERMUTATION_STANDARD_CONSTRAINT", "why": "high1.json H1-RPM-125(DIRECT_ACTIVE): 순열/특정 조건 배열"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "동종·이종 대상 혼합 상태에서 비이웃 및 연속 상한 조건을 동시에 만족하는 패턴을 분류해야 하는 중상 난이도 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"given": ["구별가능", "구별불가"], "goal": ["개수"], "method": ["경우분류", "순열", "합의법칙"], "condition": ["이웃하지않음", "제외"]}}, "hold": ""}
```

## Q13

- 형식: 객관식  
- 배점: 4.4

### 발문

두 집합 \$A \= \\left{(x, y) ;\\middle\|; y \= \\dfrac{\|x\| - 2}{\|x - 2\|},; x \\ne 2\\right}\$, \$B \= {(x, y) \\mid y \= mx}\$에 대하여 \$A \\cap B \= \\varnothing\$일 때, 실수 \$m\$의 값의 범위는? \[4.4점\]

### 선지

① \$-\\dfrac{1}{2} \< m \\le \\dfrac{-3 \+ 2\\sqrt{2}}{2}\$ ② \$-\\dfrac{1}{2} \\le m \< \\dfrac{-3 \+ 2\\sqrt{2}}{2}\$ ③ \$-1 \\le m \< \\dfrac{-3 \+ 2\\sqrt{2}}{2}\$ ④ \$-1 \< m \\le \\dfrac{-3 \+ 2\\sqrt{2}}{2}\$ ⑤ \$-\\dfrac{1}{2} \\le m \\le \\dfrac{-3 \+ 2\\sqrt{2}}{2}\$

### 정답

②

### 해설

원점을 지나는 직선 \$y \= mx\$가 곡선 \$A\$와 만나는 기울기 \$m\$의 범위를 구간별로 구한다. (1) \$0 \\le x \< 2\$일 때: \$y \= \\dfrac{x - 2}{2 - x} \= \-1\$. \$x \= 0\$이면 점 \$(0, \-1)\$은 \$y \= mx\$ 위에 있지 않다. \$0 \< x \< 2\$에서는 \$-1 \= mx \\implies m \= \-\\dfrac{1}{x}\$이므로 교점이 생기는 범위는 \$m \< \-\\dfrac{1}{2}\$이다. (2) \$x \> 2\$일 때: \$y \= \\dfrac{x - 2}{x - 2} \= 1\$. \$1 \= mx \\implies m \= \\dfrac{1}{x}\$이므로 교점이 생기는 범위는 \$0 \< m \< \\dfrac{1}{2}\$이다. (3) \$x \< 0\$일 때: \$u \= \-x \> 0\$이라 놓으면 \$y \= \\dfrac{u - 2}{u \+ 2}\$이고 \$m \= \\dfrac{y}{x} \= \-\\dfrac{u - 2}{u(u \+ 2)}\$이다.

- \$0 \< u \< 2\$이면 \$m \= \\dfrac{2 - u}{u(u \+ 2)} \> 0\$이며, \$u \\to 0^+\$일 때 \$+\\infty\$, \$u \\to 2^-\$일 때 \$0\$이므로 모든 \$m \> 0\$에서 교점이 생긴다.  
- \$u \\ge 2\$이면 \$k \= \-m \= \\dfrac{u - 2}{u(u \+ 2)} \\ge 0\$이다. \$k \> 0\$일 때 이차방정식 \$ku^2 \+ (2k - 1)u \+ 2 \= 0\$이 \$u \> 2\$에서 실근을 가지려면 판별식 \$D \= (2k - 1)^2 - 8k \= 4k^2 - 12k \+ 1 \\ge 0\$이어야 한다. (\$k \= \\dfrac{3 - 2\\sqrt{2}}{2}\$일 때 \$u \= 2 \+ 2\\sqrt{2} \> 2\$에서 중근을 갖는다. \$k \\ge \\dfrac{3 \+ 2\\sqrt{2}}{2}\$이면 두 근의 합 \$\\dfrac{1 - 2k}{k} \< 0\$이므로 양근이 없다.) 따라서 \$0 \\le k \\le \\dfrac{3 - 2\\sqrt{2}}{2}\$, 즉 \$\\dfrac{-3 \+ 2\\sqrt{2}}{2} \\le m \\le 0\$에서 교점이 생긴다.

(1)\~(3)을 합하면 교점이 존재하는 기울기는 \$m \< \-\\dfrac{1}{2}\$ 또는 \$m \\ge \\dfrac{-3 \+ 2\\sqrt{2}}{2}\$이다. \$\\therefore\$ 교점이 없는(\$A \\cap B \= \\varnothing\$) 범위는 \$-\\dfrac{1}{2} \\le m \< \\dfrac{-3 \+ 2\\sqrt{2}}{2}\$ (②)

```
{"status": "EXEMPT", "reason": "발문에 그림이 없고, 절댓값 분수식과 직선 $y=mx$의 교점 존재 여부를 세 구간에서 대수 판별식으로 조사하는 문항이다."}
```

```
{"sourceQid": 13, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-04", "subUnitKey": "H15-SB-04-RATIONAL_APPLICATION", "conceptClusterKey": "", "primaryMethod": "$x$의 범위를 $0\\le x<2$, $x>2$, $x<0$으로 나누어 교점이 생기는 기울기 $m$의 합집합을 구한 뒤 여집합을 취한다.", "decisiveStep": "$x<0$에서 $u=-x\\ge 2$일 때 $ku^2+(2k-1)u+2=0$의 판별식과 양근 조건으로 상한 $k\\le\\dfrac{3-2\\sqrt{2}}{2}$을 구한다.", "rpm": {"majorUnit": "함수", "midUnit": "유리함수", "l3": "유리함수의 활용", "l4": "유리함수와 그래프의 교점"}, "ptTplCandidate": {"problemTypeKey": "PT_FUNCTION_GRAPH_INTERSECTION", "templateKey": "TPL_FUNCTION_INTERSECTION_TWO_FUNCTIONS", "why": "high1.json H1-RPM-114(DIRECT_ACTIVE): 유리함수의 활용/유리함수와 그래프의 교점"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "절댓값 구간 분할, 구멍 난 점 $(2,-1)$ 처리, 분수식 이차방정식 판별식을 모두 통합해야 하는 고난도 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"given": ["집합", "절댓값", "유리식", "직선"], "goal": ["범위"], "method": ["경우분류", "판별식", "여집합"], "condition": ["구간", "실근"]}}, "hold": ""}
```

## Q14

- 형식: 객관식  
- 배점: 4.4

### 발문

수지는 교내 연날리기 대회에서 가오리연을 만들어 날리려고 한다. 다음 그림과 같이 \$6\$개의 영역으로 나누어진 가오리연을 \$5\$가지 색의 일부 또는 전부를 사용하여 색칠하는 경우의 수는? (단, 인접한 영역은 서로 다른 색을 칠한다.) \[4.4점\]

### 선지

① \$1560\$ ② \$2080\$ ③ \$2600\$ ④ \$2880\$ ⑤ \$3120\$

### 정답

⑤

### 해설

그림의 \$6\$개 영역을 위쪽 \$3\$개 영역(위쪽 바깥 영역과 그 안의 원 \$2\$개 영역: 셋이 서로 모두 인접)과 아래쪽 \$3\$개 영역(좌, 우, 맨 아래: 위쪽 바깥 영역과 함께 \$4\$개 영역이 순환 인접)으로 나누어 센다. (1) 위쪽 \$3\$개 영역 칠하기: 서로 모두 인접하므로 \$5 \\times 4 \\times 3 \= 60\$가지 (2) 위쪽 바깥 영역 색이 정해진 상태에서 아래쪽 \$3\$개 영역 칠하기: 아래쪽 좌·우 영역은 각각 위쪽 바깥색을 제외한 \$4\$가지 색을 칠할 수 있다.

- 좌·우가 같은 색인 경우: \$4\$가지마다 맨 아래 영역은 \$4\$가지 \$\\implies 4 \\times 4 \= 16\$가지  
- 좌·우가 다른 색인 경우: \$4 \\times 3 \= 12\$가지마다 맨 아래 영역은 \$3\$가지 \$\\implies 12 \\times 3 \= 36\$가지 아래쪽 소계: \$16 \+ 36 \= 52\$가지 \$\\therefore 60 \\times 52 \= 3120\$ (⑤)

```
{"question": {"status": "UNSUPPORTED", "reason": "6개 영역으로 분할된 가오리연 색칠 도식은 SVG 엔진 지원 대상이 아니다."}, "solution": {"status": "EXEMPT", "reason": "위쪽 3영역을 먼저 칠하고 아래쪽 좌·우 영역의 색 일치 여부로 경우를 나누어 센다."}}
```

```
{"sourceQid": 14, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-06", "subUnitKey": "H15-SB-06-COUNTING_PRINCIPLE", "conceptClusterKey": "", "primaryMethod": "서로 모두 인접한 위쪽 $3$영역($5\\times 4\\times 3$)을 칠한 뒤, 아래쪽 좌·우 영역의 동색/이색 여부로 나누어 곱한다.", "decisiveStep": "아래쪽 좌·우가 같은 색($16$가지)과 다른 색($36$가지)일 때 맨 아래 영역 선택지($4$가지 vs $3$가지)가 다름을 분류한다.", "rpm": {"majorUnit": "경우의 수", "midUnit": "경우의 수와 순열", "l3": "합·곱의 법칙", "l4": "경우를 나누어 세기"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COUNTING_PRINCIPLE_GENERAL", "templateKey": "TPL_H1_COUNTING_DIRECT_CASE", "why": "high1.json H1-RPM-122(DIRECT_ACTIVE): 합·곱의 법칙/경우를 나누어 세기"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "순환형 인접 구조가 포함된 영역 색칠에서 대칭 영역의 색 일치 여부로 분기해 세는 중상 난이도 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"given": ["도형", "영역"], "goal": ["개수"], "method": ["경우분류", "곱의법칙"], "condition": ["인접"]}}, "hold": ""}
```

## Q15

- 형식: 객관식  
- 배점: 4.4

### 발문

\$2 \\le x \\le 3\$인 임의의 실수 \$x\$에 대하여 부등식 \$\$ax^2 - 2ax \+ a \+ 1 \\le \\dfrac{x \+ 5}{x - 1} \\le bx^2 - 2bx \+ b \+ 1\$\$ 이 항상 성립할 때, \$a\$의 최댓값을 \$M\$, \$b\$의 최솟값을 \$m\$이라고 하자. \$M \+ m\$의 값은? (단, \$a \\ne 0, b \\ne 0\$이다.) \[4.4점\]

### 선지

① \$\\dfrac{21}{4}\$ ② \$\\dfrac{23}{4}\$ ③ \$\\dfrac{25}{4}\$ ④ \$\\dfrac{27}{4}\$ ⑤ \$\\dfrac{29}{4}\$

### 정답

④

### 해설

\$t \= x - 1\$로 치환하면 \$2 \\le x \\le 3\$에서 \$1 \\le t \\le 2\$이다. 주어진 식의 각 변은 \$ax^2 - 2ax \+ a \+ 1 \= a(x - 1)^2 \+ 1 \= at^2 \+ 1\$ \$\\dfrac{x \+ 5}{x - 1} \= \\dfrac{t \+ 6}{t} \= 1 \+ \\dfrac{6}{t}\$ \$bx^2 - 2bx \+ b \+ 1 \= b(x - 1)^2 \+ 1 \= bt^2 \+ 1\$ 이므로 부등식은 \$at^2 \+ 1 \\le 1 \+ \\dfrac{6}{t} \\le bt^2 \+ 1 \\implies a \\le \\dfrac{6}{t^3} \\le b\$ (\$1 \\le t \\le 2\$) \$1 \\le t \\le 2\$에서 \$\\dfrac{6}{t^3}\$은 감소하므로 최솟값은 \$\\dfrac{6}{2^3} \= \\dfrac{3}{4}\$, 최댓값은 \$\\dfrac{6}{1^3} \= 6\$이다. 따라서 \$M \= \\dfrac{3}{4}\$, \$m \= 6\$이므로 \$\\therefore M \+ m \= \\dfrac{3}{4} \+ 6 \= \\dfrac{27}{4}\$ (④)

```
{"status": "EXEMPT", "reason": "치환 $t=x-1$을 통해 유리식과 이차식의 부등식을 단조감소 함수의 최대·최소 범위로 바꾸는 문항이므로 그림이 필요하지 않다."}
```

```
{"sourceQid": 15, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-04", "subUnitKey": "H15-SB-04-RATIONAL_APPLICATION", "conceptClusterKey": "", "primaryMethod": "$t=x-1\\in[1,2]$로 치환하여 부등식을 $a\\le\\dfrac{6}{t^3}\\le b$로 단순화한 뒤 구간의 양 끝값을 대입한다.", "decisiveStep": "양쪽 이차식을 $a(x-1)^2+1, b(x-1)^2+1$로 묶어 $t^2>0$으로 나누면 $\\dfrac{6}{t^3}$의 감소성만으로 $M, m$이 결정됨을 포착한다.", "rpm": {"majorUnit": "함수", "midUnit": "유리함수", "l3": "유리함수의 활용", "l4": "유리함수의 최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT_FUNCTION_EXTREMUM", "templateKey": null, "why": "high1.json H1-RPM-113(FAMILY_ACTIVE): 유리함수의 활용/유리함수의 최대·최소"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "완전제곱식 변형과 치환을 통해 부등식을 분리하고 단조함수의 최대·최소로 매개변수 극값을 구하는 중상 난이도 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"given": ["부등식", "이차식", "유리식"], "goal": ["합", "최댓값", "최솟값"], "method": ["치환", "완전제곱식"], "condition": ["항상성립", "구간"]}}, "hold": ""}
```

## Q16

- 형식: 객관식  
- 배점: 4.5

### 발문

남학생 \$2\$명과 여학생 \$2\$명이 함께 독서실을 등록하려고 한다. 그림과 같이 남은 \$7\$개의 좌석(연속한 \$3\$석 \$A\_1, A\_2, A\_3\$, 연속한 \$2\$석 \$B\_1, B\_2\$, 서로 떨어져 있는 단독 \$2\$석 \$C\_1, C\_2\$)에 자리를 배정할 때, 남학생끼리는 서로 이웃하고 여학생끼리는 서로 이웃하지 않는 모든 방법의 수는? \[4.5점\]

### 선지

① \$96\$ ② \$104\$ ③ \$112\$ ④ \$120\$ ⑤ \$128\$

### 정답

②

### 해설

남학생 \$2\$명이 서로 이웃하여 앉을 수 있는 좌석쌍은 \$(A\_1, A\_2)\$, \$(A\_2, A\_3)\$, \$(B\_1, B\_2)\$의 \$3\$가지이다. 각 경우 남은 \$5\$석에서 여학생 \$2\$명이 서로 이웃하지 않게 좌석 \$2\$개를 고르는 경우의 수는 다음과 같다. (1) 남학생이 \$(A\_1, A\_2)\$에 앉을 때: 남은 좌석 \${A\_3, B\_1, B\_2, C\_1, C\_2}\$ 중 이웃한 쌍은 \$(B\_1, B\_2)\$뿐이므로 \${}\_5C\_2 - 1 \= 10 - 1 \= 9\$가지 (2) 남학생이 \$(A\_2, A\_3)\$에 앉을 때: 같은 이유로 \$9\$가지 (3) 남학생이 \$(B\_1, B\_2)\$에 앉을 때: 남은 좌석 \${A\_1, A\_2, A\_3, C\_1, C\_2}\$ 중 이웃한 쌍은 \$(A\_1, A\_2)\$, \$(A\_2, A\_3)\$의 \$2\$개이므로 \${}\_5C\_2 - 2 \= 10 - 2 \= 8\$가지

따라서 좌석을 선택하는 전체 방법의 수는 \$9 \+ 9 \+ 8 \= 26\$가지이다. 각 좌석 선택마다 남학생 \$2\$명 배열 \$2\!\$가지, 여학생 \$2\$명 배열 \$2\!\$가지이므로 \$\\therefore 26 \\times 2\! \\times 2\! \= 26 \\times 4 \= 104\$ (②)

```
{"question": {"status": "UNSUPPORTED", "reason": "3석·2석·단독석으로 구성된 독서실 좌석 배치 도식은 SVG 엔진 지원 대상이 아니다."}, "solution": {"status": "EXEMPT", "reason": "남학생이 앉을 수 있는 인접 좌석쌍별로 여학생 2명의 비이웃 좌석 선택 수를 여사건으로 구한다."}}
```

```
{"sourceQid": 16, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-07", "subUnitKey": "H15-SB-07-PERMUTATION_BASIC", "conceptClusterKey": "", "primaryMethod": "남학생이 앉을 수 있는 인접 좌석쌍 $3$가지별로 남은 $5$석에서 여학생 비이웃 $2$석을 여사건으로 센 뒤 $2!\\times 2!$를 곱한다.", "decisiveStep": "남학생이 $(A_1,A_2), (A_2,A_3)$에 앉을 때와 $(B_1,B_2)$에 앉을 때 남은 인접 쌍 수가 $1$개와 $2$개로 달라짐을 구별한다.", "rpm": {"majorUnit": "경우의 수", "midUnit": "경우의 수와 순열", "l3": "중복·원순열 기초", "l4": "같은 것이 있는 배열"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_ARRANGEMENT", "templateKey": "TPL_IDENTICAL_OBJECT_PERMUTATION", "why": "high1.json H1-RPM-126(DIRECT_ACTIVE): 중복·원순열 기초/같은 것이 있는 배열"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "비대칭 좌석 배치에서 남학생 이웃 위치에 따라 여학생 비이웃 좌석 수가 달라지는 경우를 분류해 세는 중상 난이도 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"given": ["구별가능"], "goal": ["개수"], "method": ["경우분류", "여사건", "순열"], "condition": ["이웃", "이웃하지않음", "배치"]}}, "hold": ""}
```

## Q17

- 형식: 객관식  
- 배점: 4.5

### 발문

함수 \$y \= \\dfrac{4x}{x - 2}\$의 그래프와 함수 \$y \= \\sqrt{2x - 4t} - t\$의 그래프가 서로 다른 두 점에서 만날 때, 실수 \$t\$의 최댓값을 \$M\$, 최솟값을 \$m\$이라 하자. \$M - 2m\$의 값은? \[4.5점\]

### 선지

① \$3\$ ② \$4\$ ③ \$5\$ ④ \$6\$ ⑤ \$7\$

### 정답

④

### 해설

유리함수에서 \$y \\ne 4\$이고 \$x \= \\dfrac{2y}{y - 4}\$이다. 무리함수에서 \$w \= \\sqrt{2x - 4t} \= y \+ t \\ge 0\$이므로 \$2x \= w^2 \+ 4t\$이고 \$t \= w - y\$이다. 대입하면 \$w^2 \+ 4(w - y) \= \\dfrac{4y}{y - 4} \\implies (w \+ 2)^2 \= 4 \+ 4y \+ \\dfrac{4y}{y - 4} \= \\dfrac{4(y^2 - 2y - 4)}{y - 4}\$ \$R(y) \= \\dfrac{4(y^2 - 2y - 4)}{y - 4}\$라 하면 \$w \\ge 0\$이므로 \$R(y) \\ge 4\$여야 한다. \$R(y) - 4 \= \\dfrac{4y(y - 3)}{y - 4} \\ge 0 \\implies 0 \\le y \\le 3\$ 또는 \$y \> 4\$ 이때 \$t \= T(y) \= \\sqrt{R(y)} - 2 - y\$이다. 각 허용 구간에서 \$y\_2 \> y\_1\$이면 \$R(y\_2) - R(y\_1) \= 4(y\_2 - y\_1)\\left(1 - \\dfrac{4}{(y\_1 - 4)(y\_2 - 4)}\\right) \< 4(y\_2 - y\_1)\$이고 \$\\sqrt{R(y\_2)} \+ \\sqrt{R(y\_1)} \\ge 4\$이므로 \$\\sqrt{R(y\_2)} - \\sqrt{R(y\_1)} \< y\_2 - y\_1 \\implies T(y\_2) \< T(y\_1)\$ (즉 \$T(y)\$는 감소한다).

- \$y \> 4\$ 구간: \$y \\to 4^+\$일 때 \$T(y) \\to \+\\infty\$, \$y \\to \+\\infty\$일 때 \$T(y) \\to \-\\infty\$이므로 모든 실수 \$t\$에 대해 교점이 정확히 \$1\$개 존재한다.  
- \$0 \\le y \\le 3\$ 구간: \$(y \+ 2)^2 - R(y) \= \\dfrac{4y(y^2 - 4y - 4)}{y - 4} \\ge 0\$ (since \$0 \\le y \\le 3\$에서 \$y-4 \< 0\$이고 \$y^2 - 4y - 4 \< 0\$)이므로 \$w \= \\sqrt{R(y)} - 2 \\le y\$를 항상 만족하고 \$w \\ge 0\$이다. \$T(y)\$가 감소하므로 이 구간에서 교점이 \$1\$개 더 생기는 \$t\$의 범위는 \$\[T(3), T(0)\]\$이다. \$T(0) \= \\sqrt{4} - 2 - 0 \= 0\$, \$T(3) \= \\sqrt{4} - 2 - 3 \= \-3\$ 따라서 \$-3 \\le t \\le 0\$이고 \$M \= 0\$, \$m \= \-3\$이다. \$\\therefore M - 2m \= 0 - 2(-3) \= 6\$ (④)

```
{"question": {"status": "EXEMPT", "reason": "발문에 그림이 없는 유리함수와 매개변수 무리함수의 교점 개수 문항이다."}, "solution": {"capability": "multi-curve-figure-v1", "graphPlan": {"family": "multi-curve", "curves": [{"id": "rat", "kind": "RATIONAL", "numerator": ["0", "4"], "denominator": ["-2", "1"], "domain": ["-4", "10"]}, {"id": "sq", "kind": "SQRT", "radicand": ["0", "2"], "amplitude": "1", "sign": 1, "offset": "0", "domain": ["0", "10"]}], "overlays": {"points": [{"id": "O", "x": "0", "y": "0", "label": "(0,0)"}]}, "axisTickValues": {"x": ["0", "2"], "y": ["0", "4"]}}, "caption": "t=0일 때 y=4x/(x-2)와 y=√(2x)는 (0,0)과 y>4인 점에서 서로 다른 두 교점을 갖는다."}}
```

```
{"sourceQid": 17, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-05", "subUnitKey": "H15-SB-05-IRRATIONAL_GRAPH", "conceptClusterKey": "", "primaryMethod": "유리함수와 무리함수를 $y$로 연립해 $w=y+t\\ge 0$의 허용 구간 $0\\le y\\le 3$ 및 $y>4$를 구하고 단조감소 함수 $T(y)$의 치역을 구한다.", "decisiveStep": "$y>4$에서 항상 교점 $1$개가 존재함을 확인하고, $0\\le y\\le 3$에서 $T(3)=-3\\le t\\le T(0)=0$을 도출한다.", "rpm": {"majorUnit": "함수", "midUnit": "무리함수", "l3": "정의역과 치역", "l4": "그래프 위치"}, "ptTplCandidate": {"problemTypeKey": "PT_FUNCTION_EXTREMUM", "templateKey": "TPL_FUNCTION_EXTREMUM_INTERVAL_ENDPOINT", "why": "high1.json H1-RPM-275(DIRECT_ACTIVE): 정의역과 치역/그래프 위치"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "무리함수 근호 조건 $w\\ge 0$과 유리함수의 두 가지를 모두 추적해 교점 $2$개 범위를 엄밀히 확정해야 하는 고난도 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"given": ["유리함수", "무리함수", "매개변수"], "goal": ["차", "최댓값", "최솟값"], "method": ["치환", "부등식", "증가감소"], "condition": ["교점", "구간"]}}, "hold": ""}
```

## Q18

- 형식: 서답형  
- 배점: 4

### 발문

단답형 1\. 두 집합 \$A \= \\left{(x, y) ;\\middle\|; y \= \\dfrac{x^2 \+ n}{8},; x \\ge 0\\right}\$, \$B \= \\left{(x, y) ;\\middle\|; y \= \\sqrt{8x - n}\\right}\$에 대하여 \$n(A \\cap B) \= 1\$이 되도록 하는 양의 정수 \$n\$의 값은? \[4점\]

### 선지

없음

### 정답

\$16\$

### 해설

교점의 좌표를 \$(x, y)\$라 하면 \$x \\ge 0, y \\ge 0\$이고 \$x^2 \+ n \= 8y\$, \$y^2 \+ n \= 8x\$ 두 식을 변변 빼면 \$x^2 - y^2 \= 8(y - x) \\implies (x - y)(x \+ y \+ 8\) \= 0\$ \$x \\ge 0, y \\ge 0\$이므로 \$x \+ y \+ 8 \> 0\$, 따라서 \$x \= y\$이다. \$x \= y\$를 첫째 식에 대입하면 \$x^2 - 8x \+ n \= 0\$ 양의 정수 \$n\$에 대하여 \$1 \\le n \< 16\$이면 두 근 \$4 \\pm \\sqrt{16 - n}\$이 모두 양수이므로 교점이 \$2\$개이다. \$n \= 16\$이면 \$(x - 4)^2 \= 0\$으로 유일한 근 \$x \= 4 \\ge 0\$을 가지므로 교점이 \$1\$개이다. \$n \> 16\$이면 실근이 없다. \$\\therefore n \= 16\$

```
{"status": "EXEMPT", "reason": "두 곡선의 대칭 방정식을 연립하여 $x=y$를 이끌고 판별식으로 중근 조건을 구하는 단답형 문항이므로 그림이 필요하지 않다."}
```

```
{"sourceQid": 18, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-05", "subUnitKey": "H15-SB-05-IRRATIONAL_BASIC", "conceptClusterKey": "", "primaryMethod": "두 역함수 관계인 식 $x^2+n=8y$, $y^2+n=8x$를 빼 $x=y$를 얻은 뒤 $x^2-8x+n=0$이 유일한 양근을 갖도록 $n$을 정한다.", "decisiveStep": "$(x-y)(x+y+8)=0$에서 $x=y$를 얻고 $x^2-8x+n=0$의 중근 조건 $n=16$을 구한다.", "rpm": {"majorUnit": "함수", "midUnit": "무리함수", "l3": "무리함수의 활용", "l4": "무리함수의 교점"}, "ptTplCandidate": {"problemTypeKey": "PT_FUNCTION_GRAPH_INTERSECTION", "templateKey": "TPL_FUNCTION_INTERSECTION_TWO_FUNCTIONS", "why": "high1.json H1-RPM-121(DIRECT_ACTIVE): 무리함수의 활용/무리함수의 교점"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "대칭 연립방정식 감산으로 $x=y$를 유도하고 이차방정식 판별식과 양근 조건을 함께 확인하는 중상 난이도 문항이다.", "level": "상", "item4slot": {"format": "단답", "slots": {"given": ["집합", "이차함수", "무리함수"], "goal": ["값"], "method": ["대칭성", "판별식"], "condition": ["중근", "자연수"]}}, "hold": ""}
```

## Q19

- 형식: 서답형  
- 배점: 5

### 발문

단답형 2\. 평면 위에 \$12\$개의 직선이 있다. 다음 조건을 만족시키면서 \$12\$개의 직선으로 만들어지는 삼각형의 개수는? \[5점\]

> (가) 어느 세 직선도 한 점에서 만나지 않는다. (나) 네 직선만 평행하다.

### 선지

없음

### 정답

\$168\$

### 해설

\$12\$개의 직선 중 \$3\$개를 고르는 전체 경우의 수: \${}\_{12}C\_3 \= \\dfrac{12 \\times 11 \\times 10}{3 \\times 2 \\times 1} \= 220\$ 평행한 \$4\$개의 직선에서 \$2\$개 이상을 골라 삼각형이 만들어지지 않는 경우를 뺀다.

- 평행선 \$4\$개 중 \$2\$개, 나머지 \$8\$개 중 \$1\$개를 고르는 경우: \${}\_4C\_2 \\times 8 \= 6 \\times 8 \= 48\$  
- 평행선 \$4\$개 중 \$3\$개를 고르는 경우: \${}\_4C\_3 \= 4\$ \$\\therefore 220 - 48 - 4 \= 168\$

```
{"status": "EXEMPT", "reason": "직선 선택 조합에서 평행선으로 인해 삼각형이 되지 않는 경우를 제외하는 단답형 문항이므로 그림이 필요하지 않다."}
```

```
{"sourceQid": 19, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-08", "subUnitKey": "H15-SB-08-COMBINATION_APPLICATION", "conceptClusterKey": "", "primaryMethod": "전체 선택 ${}_{12}C_3$에서 평행한 $4$직선 중 $2$개 이상 포함하는 ${}_4C_2\\cdot 8+{}_4C_3$을 뺀다.", "decisiveStep": "평행선 중 $2$개를 고른 경우와 $3$개를 모두 고른 경우를 빠짐없이 제외해 $220-48-4=168$을 얻는다.", "rpm": {"majorUnit": "경우의 수", "midUnit": "조합", "l3": "조합의 활용", "l4": "선택 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_SELECTION_DISTRIBUTION", "templateKey": "TPL_COMBINATION_SELECTION", "why": "high1.json H1-RPM-130(DIRECT_ACTIVE): 조합의 활용/선택 조건"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "조합에서 평행 직선 선택이라는 제외 조건을 반영하여 도형 개수를 구하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단답", "slots": {"given": ["직선", "삼각형"], "goal": ["개수"], "method": ["조합", "여사건"], "condition": ["평행"]}}, "hold": ""}
```

## Q20

- 형식: 서답형  
- 배점: 10

### 발문

서술형 1\. 전체집합 \$U \= {x \\mid x\\text{는 } 9\\text{ 이하의 자연수}}\$의 두 부분집합 \$A, B\$가 다음 조건을 만족시킨다.

> (가) 집합 \$A^C \\cap B^C\$의 모든 원소의 합은 집합 \$(A - B) \\cup (B - A)\$의 모든 원소의 합의 \$3\$배이다. (나) \$n(A \\cap B) \= 1\$

\$3 \\le n(A \\cup B) \\le 4\$일 때, 두 집합 \$A, B\$의 순서쌍 \$(A, B)\$의 개수를 구하고 그 과정을 서술하시오. \[10점\]

### 선지

없음

### 정답

\$104\$

### 해설

\$A \\cap B \= {c}\$, \$S \= (A - B) \\cup (B - A)\$라 하면 \$c \\notin S\$이고, \$3 \\le n(A \\cup B) \\le 4\$이므로 \$n(S) \= 2\$ 또는 \$n(S) \= 3\$이다. 전체집합 \$U \= {1, 2, \\cdots, 9}\$의 모든 원소의 합은 \$45\$이고, \$S\$의 원소의 합을 \$\\sum S\$라 하면 \$A^C \\cap B^C\$의 원소의 합은 \$45 - c - \\sum S\$이다. 조건 (가)에 의하여 \$45 - c - \\sum S \= 3\\sum S \\implies c \+ 4\\sum S \= 45\$ \$4\\sum S \\equiv 0 \\pmod{4}\$이므로 \$c \\equiv 1 \\pmod{4}\$, 즉 \$c \\in {1, 5, 9}\$이다.

(1) \$c \= 1\$일 때 \$\\sum S \= 11\$ (\$S \\subseteq U \\setminus {1}\$):

- \$n(S) \= 2\$: \${2, 9}, {3, 8}, {4, 7}, {5, 6}\$ (\$4\$개) \$\\implies 4 \\times 2^2 \= 16\$가지  
- \$n(S) \= 3\$: \${2, 3, 6}, {2, 4, 5}\$ (\$2\$개) \$\\implies 2 \\times 2^3 \= 16\$가지

(2) \$c \= 5\$일 때 \$\\sum S \= 10\$ (\$S \\subseteq U \\setminus {5}\$):

- \$n(S) \= 2\$: \${1, 9}, {2, 8}, {3, 7}, {4, 6}\$ (\$4\$개) \$\\implies 4 \\times 2^2 \= 16\$가지  
- \$n(S) \= 3\$: \${1, 2, 7}, {1, 3, 6}\$ (\$2\$개) \$\\implies 2 \\times 2^3 \= 16\$가지

(3) \$c \= 9\$일 때 \$\\sum S \= 9\$ (\$S \\subseteq U \\setminus {9}\$):

- \$n(S) \= 2\$: \${1, 8}, {2, 7}, {3, 6}, {4, 5}\$ (\$4\$개) \$\\implies 4 \\times 2^2 \= 16\$가지  
- \$n(S) \= 3\$: \${1, 2, 6}, {1, 3, 5}, {2, 3, 4}\$ (\$3\$개) \$\\implies 3 \\times 2^3 \= 24\$가지

\$\\therefore\$ 순서쌍 \$(A, B)\$의 총 개수는 \$(16 \+ 16\) \+ (16 \+ 16\) \+ (16 \+ 24\) \= 104\$

```
{"status": "EXEMPT", "reason": "벤다이어그램 영역의 원소 합 관계식을 정수 조건으로 좁혀 대칭차집합 부분집합을 열거하는 서술형 문항이므로 그림이 필요하지 않다."}
```

```
{"sourceQid": 20, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-01", "subUnitKey": "H15-SB-01-SET_COUNT", "conceptClusterKey": "", "primaryMethod": "$A\\cap B=\\{c\\}$와 대칭차집합 $S$로 분할해 $c+4\\sum S=45$를 얻고, 가능한 $c\\in\\{1,5,9\\}$와 $n(S)\\in\\{2,3\\}$별로 배분 수 $2^{n(S)}$를 곱한다.", "decisiveStep": "$c+4\\sum S=45$에서 $c=1,5,9$만 가능함을 보이고, 각 $c$가 $S$에 중복 포함되지 않도록 세어 총 $104$개를 도출한다.", "rpm": {"majorUnit": "집합과 명제", "midUnit": "집합의 뜻과 포함 관계", "l3": "집합과 원소", "l4": "유한집합 원소 개수"}, "ptTplCandidate": {"problemTypeKey": "PT_SET_CARDINALITY", "templateKey": "TPL_SET_CARDINALITY_DIRECT", "why": "high1.json H1-RPM-081(DIRECT_ACTIVE): 집합과 원소/유한집합 원소 개수"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "집합 영역 합 방정식에서 정수 배수 조건으로 교집합 원소를 좁히고 대칭차집합 분할 경우를 빠짐없이 세어야 하는 고난도 서술형 문항이다.", "level": "상", "item4slot": {"format": "서술", "slots": {"given": ["전체집합", "집합", "대칭차집합"], "goal": ["개수"], "method": ["경우분류", "열거", "곱의법칙"], "condition": ["자연수", "원소의개수"]}}, "hold": ""}
```

## Q21

- 형식: 서답형  
- 배점: 10

### 발문

서술형 2\. 함수 \$f(x) \= \\dfrac{ax - 1}{bx \+ c}\$는 두 직선 \$y \= x \+ 1\$, \$y \= \-x \+ 3\$에 대하여 대칭이고 점 \$(2, 3)\$을 지난다. 함수 \$f(x)\$와 접점의 \$x\$좌표가 양수인 서로 다른 두 점에서 접하는 원이 있다. \$2\\sqrt{2}\$보다 큰 양수 \$k\$에 대하여 점 \$(1, 2)\$와 중심 사이의 거리가 \$k\$인 두 원의 넓이 중 큰 것부터 \$g(k)\$, \$h(k)\$라 할 때, \$g(4) - h(4)\$의 값을 구하고 그 과정을 서술하시오. (단, \$a, b, c\$는 상수이다.) \[10점\]

### 선지

없음

### 정답

\$4\\pi\$

### 해설

두 대칭축 \$y \= x \+ 1\$과 \$y \= \-x \+ 3\$의 교점이 \$(1, 2)\$이므로 유리함수 \$y \= f(x)\$의 점근선의 교점은 \$(1, 2)\$이다. \$-\\dfrac{c}{b} \= 1 \\implies c \= \-b\$, \$\\dfrac{a}{b} \= 2 \\implies a \= 2b\$ 점 \$(2, 3)\$을 지나므로 \$f(2) \= \\dfrac{4b - 1}{2b - b} \= 3 \\implies 4b - 1 \= 3b \\implies b \= 1\$ 따라서 \$a \= 2, b \= 1, c \= \-1\$이고 \$f(x) \= \\dfrac{2x - 1}{x - 1} \= 2 \+ \\dfrac{1}{x - 1}\$이다.

평행이동 \$X \= x - 1\$, \$Y \= y - 2\$를 적용하면 유리함수는 \$XY \= 1\$, 기준점 \$(1, 2)\$는 원점 \$(0, 0)\$으로 옮겨진다. 이 좌표계에서 중심이 \$(p, q)\$, 반지름이 \$r\$인 원 \$(X - p)^2 \+ (Y - q)^2 \= r^2\$에 \$Y \= \\dfrac{1}{X}\$를 대입하고 \$X^2\$을 곱하면 \$X^4 - 2pX^3 \+ (p^2 \+ q^2 - r^2)X^2 - 2qX \+ 1 \= 0\$ 서로 다른 두 점(\$X \= \\alpha, \\beta\$)에서 접하므로 위 사차식은 \$(X - \\alpha)^2(X - \\beta)^2\$과 항등식이다. 전개하면 \$X^4 - 2(\\alpha \+ \\beta)X^3 \+ (\\alpha^2 \+ 4\\alpha\\beta \+ \\beta^2)X^2 - 2\\alpha\\beta(\\alpha \+ \\beta)X \+ (\\alpha\\beta)^2 \= 0\$ 상수항에서 \$(\\alpha\\beta)^2 \= 1 \\implies \\alpha\\beta \= 1\$ 또는 \$\\alpha\\beta \= \-1\$이다. (1) \$\\alpha\\beta \= 1\$인 경우: 계수 비교로 \$p \= \\alpha \+ \\beta\$, \$q \= p\$이고, \$p^2 \+ q^2 - r^2 \= (\\alpha \+ \\beta)^2 \+ 2 \= p^2 \+ 2 \\implies r^2 \= p^2 - 2\$. 원점과 중심 사이 거리가 \$k\$이므로 \$p^2 \+ q^2 \= 2p^2 \= k^2\$. 접점의 \$x\$좌표가 양수여야 하므로 \$p \= \\dfrac{k}{\\sqrt{2}} \> 2\$이고 두 접점은 모두 \$X \> 0\$이므로 \$x \= X \+ 1 \> 1 \> 0\$이다. 이때 \$r^2 \= \\dfrac{k^2}{2} - 2\$. (2) \$\\alpha\\beta \= \-1\$인 경우: 계수 비교로 \$p \= \\alpha \+ \\beta\$, \$q \= \-p\$이고, \$p^2 \+ q^2 - r^2 \= (\\alpha \+ \\beta)^2 - 2 \= p^2 - 2 \\implies r^2 \= p^2 \+ 2\$. 역시 \$p \= \\dfrac{k}{\\sqrt{2}} \> 2\$이면 양근 \$\\alpha \> 2\$, 음근 \$\\beta \= \-\\dfrac{1}{\\alpha} \> \-\\dfrac{1}{2}\$이므로 두 접점 모두 \$x \= X \+ 1 \> \\dfrac{1}{2} \> 0\$을 만족한다. 이때 \$r^2 \= \\dfrac{k^2}{2} \+ 2\$.

따라서 \$g(k) \= \\pi\\left(\\dfrac{k^2}{2} \+ 2\\right)\$, \$h(k) \= \\pi\\left(\\dfrac{k^2}{2} - 2\\right)\$이므로 \$g(k) - h(k) \= 4\\pi\$ \$\\therefore g(4) - h(4) \= 4\\pi\$

```
{"question": {"status": "EXEMPT", "reason": "발문에 그림이 없는 유리함수와 이중 접원의 넓이 차 서술형 문항이다."}, "solution": {"capability": "rational-basic-v1", "graphPlan": {"family": "rational-basic", "numerator": ["-1", "2"], "denominator": ["-1", "1"], "domain": ["-2", "5"], "viewport": [-2, 5, -2, 6], "asymptotes": {"x": ["1"], "y": ["2"]}, "overlays": {"lines": [{"id": "s1", "slope": "1", "intercept": "1"}, {"id": "s2", "slope": "-1", "intercept": "3"}]}}, "caption": "f(x)=(2x-1)/(x-1)의 중심 (1,2)와 두 대칭축 y=x+1, y=-x+3 위에 두 접원의 중심이 놓인다."}}
```

```
{"sourceQid": 21, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-04", "subUnitKey": "H15-SB-04-RATIONAL_APPLICATION", "conceptClusterKey": "", "primaryMethod": "대칭축 교점 $(1,2)$로 평행이동해 $XY=1$을 만든 뒤 원과 연립한 사차식 $(X-\\alpha)^2(X-\\beta)^2$의 계수 비교로 두 접원의 $r^2$을 구한다.", "decisiveStep": "$(\\alpha\\beta)^2=1$에서 $\\alpha\\beta=\\pm 1$에 따라 $r^2=\\dfrac{k^2}{2}\\mp 2$를 얻어 넓이 차 $4\\pi$를 구한다.", "rpm": {"majorUnit": "함수", "midUnit": "유리함수", "l3": "유리함수의 활용", "l4": "유리함수와 그래프의 교점"}, "ptTplCandidate": {"problemTypeKey": "PT_FUNCTION_GRAPH_INTERSECTION", "templateKey": "TPL_FUNCTION_INTERSECTION_TWO_FUNCTIONS", "why": "high1.json H1-RPM-114(DIRECT_ACTIVE): 유리함수의 활용/유리함수와 그래프의 교점"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 5, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "유리함수 평행이동과 사차방정식 이중 중근 항등식 계수 비교 및 접점 부호 검증까지 요구하는 최고난도 서술형 문항이다.", "level": "상", "item4slot": {"format": "서술", "slots": {"given": ["유리함수", "원"], "goal": ["차", "넓이"], "method": ["평행이동", "항등식", "중근"], "condition": ["대칭성", "접함", "양수"]}}, "hold": ""}
```

