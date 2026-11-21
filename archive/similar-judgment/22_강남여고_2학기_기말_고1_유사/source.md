

```
{"stem": "22_강남여고_2학기_기말_고1_유사", "sourceArchiveFile": "original/high/h1/2final/22_강남여고_2학기_기말_고1_기출.js", "examFolder": "2final", "grade": "고1", "curriculum": "2015", "questionCount": 24, "totalScore": 100.0, "generatedAt": "2026-11-16"}
```

## Q01

- 형식: 객관식  
- 배점: 2.6

### 발문

집합 \$A \= {x \\mid x\\text{는 } 15\\text{ 이상 } 30\\text{ 이하의 소수}}\$일 때, 보기에서 옳은 것만을 있는 대로 고르면? \[2.6점\]

> \<보기\> ㄱ. \$19 \\in A\$ ㄴ. \$21 \\in A\$ ㄷ. \${17, 23} \\in A\$ ㄹ. \$\\varnothing \\subset A\$ ㅁ. \${29} \\subset A\$ ㅂ. \${23, 27} \\subset A\$

### 선지

① ㄱ, ㄴ, ㄹ ② ㄱ, ㄹ, ㅁ ③ ㄴ, ㄷ, ㅁ ④ ㄷ, ㄹ, ㅂ ⑤ ㄹ, ㅁ, ㅂ

### 정답

②

### 해설

\$15\$ 이상 \$30\$ 이하의 소수는 \$17, 19, 23, 29\$이므로 \$A \= {17, 19, 23, 29}\$이다. ㄱ. \$19 \\in A\$ (참) ㄴ. \$21 \= 3 \\times 7\$이므로 소수가 아니다 \$\\implies 21 \\notin A\$ (거짓) ㄷ. \${17, 23}\$은 \$A\$의 원소가 아니라 부분집합이므로 \${17, 23} \\subset A\$이다 (거짓) ㄹ. 공집합 \$\\varnothing\$은 모든 집합의 부분집합이므로 \$\\varnothing \\subset A\$ (참) ㅁ. \$29 \\in A\$이므로 \${29} \\subset A\$ (참) ㅂ. \$27 \= 3^3 \\notin A\$이므로 \${23, 27} \\not\\subset A\$ (거짓) \$\\therefore\$ 옳은 것은 ㄱ, ㄹ, ㅁ (②)

```
{"status": "EXEMPT", "reason": "조건제시법으로 주어진 유한집합에서 원소 기호와 부분집합 기호의 참·거짓을 판별하는 문항이므로 그림이 필요하지 않다."}
```

```
{"sourceQid": 1, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-01", "subUnitKey": "H15-SB-01-SET_COUNT", "conceptClusterKey": "", "primaryMethod": "15 이상 30 이하의 소수 집합 $A=\\{17,19,23,29\\}$를 원소나열법으로 구한 뒤 원소 기호($\\in$)와 부분집합 기호($\\subset$)를 구별한다.", "decisiveStep": "$21=3\\times 7$, $27=3^3$이 소수가 아님과 집합 기호 $\\{17,23\\}$에 $\\in$이 아닌 $\\subset$이 쓰여야 함을 가려낸다.", "rpm": {"majorUnit": "집합과 명제", "midUnit": "집합의 뜻과 포함 관계", "l3": "집합과 원소", "l4": "유한집합 원소 개수"}, "ptTplCandidate": {"problemTypeKey": "PT_SET_CARDINALITY", "templateKey": "TPL_SET_CARDINALITY_DIRECT", "why": "high1.json H1-RPM-081(DIRECT_ACTIVE): 집합과 원소/유한집합 원소 개수"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "소수 판별과 원소·부분집합 기호의 정의를 직접 적용하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"given": ["집합", "소수"], "goal": ["판정"], "method": ["원소나열법", "판정"], "condition": ["범위"]}}, "hold": ""}
```

## Q02

- 형식: 객관식  
- 배점: 2.8

### 발문

두 집합 \$A \= {x \\mid ax^2 - 5x - 6 \= 0}\$, \$B \= {-1, b}\$에 대하여 \$A \\subseteq B\$이고 \$B \\subseteq A\$일 때, \$a \+ b\$의 값은? (단, \$a, b\$는 상수이다.) \[2.8점\]

### 선지

① \$-5\$ ② \$1\$ ③ \$5\$ ④ \$7\$ ⑤ \$11\$

### 정답

④

### 해설

\$A \\subseteq B\$이고 \$B \\subseteq A\$이므로 \$A \= B \= {-1, b}\$이다. \$-1 \\in A\$이므로 \$ax^2 - 5x - 6 \= 0\$에 \$x \= \-1\$을 대입하면 \$a(-1)^2 - 5(-1) - 6 \= 0 \\implies a - 1 \= 0 \\implies a \= 1\$ 따라서 방정식은 \$x^2 - 5x - 6 \= 0\$ \$(x \+ 1)(x - 6\) \= 0 \\implies x \= \-1\$ 또는 \$x \= 6\$ \$A \= {-1, 6} \= {-1, b}\$이므로 \$b \= 6\$ \$\\therefore a \+ b \= 1 \+ 6 \= 7\$ (④)

```
{"status": "EXEMPT", "reason": "집합의 상등 조건과 이차방정식의 해를 대수적으로 구하는 문항이므로 그림이 필요하지 않다."}
```

```
{"sourceQid": 2, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-01", "subUnitKey": "H15-SB-01-SET_BASIC", "conceptClusterKey": "", "primaryMethod": "$A\\subseteq B$와 $B\\subseteq A$에서 $A=B$임을 파악하고, $-1$을 $ax^2-5x-6=0$에 대입해 $a=1$과 나머지 근 $b=6$을 구한다.", "decisiveStep": "방정식 $x^2-5x-6=0$을 인수분해하여 $-1$과 다른 근 $b=6$을 확정한다.", "rpm": {"majorUnit": "집합과 명제", "midUnit": "집합의 뜻과 포함 관계", "l3": "집합의 포함 관계", "l4": "두 집합의 포함"}, "ptTplCandidate": {"problemTypeKey": "PT_SET_INCLUSION", "templateKey": "TPL_INCLUSION_DIRECT", "why": "high1.json H1-RPM-084(DIRECT_ACTIVE): 집합의 포함 관계/두 집합의 포함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "집합의 상등 정의에서 $A=B$를 이끌어 내고 일차·이차방정식을 바로 푸는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"given": ["집합", "이차방정식"], "goal": ["합"], "method": ["대입", "인수분해"], "condition": ["상등"]}}, "hold": ""}
```

## Q03

- 형식: 객관식  
- 배점: 3

### 발문

유리함수 \$y \= \\dfrac{bx \+ c}{x \+ a}\$의 그래프가 오른쪽 그림과 같을 때, 상수 \$a, b, c\$에 대하여 \$a \+ b \+ c\$의 값을 구하면? \[3점\]

### 선지

① \$1\$ ② \$2\$ ③ \$3\$ ④ \$5\$ ⑤ \$9\$

### 정답

①

### 해설

그림에서 수직점근선은 \$x \= \-3\$, 수평점근선은 \$y \= 2\$, \$x\$절편은 \$(2, 0)\$이다. 수직점근선 \$x \= \-a \= \-3 \\implies a \= 3\$ 수평점근선 \$y \= \\dfrac{b}{1} \= 2 \\implies b \= 2\$ 점 \$(2, 0)\$을 지나므로 \$\\dfrac{2b \+ c}{2 \+ a} \= 0 \\implies 2(2) \+ c \= 0 \\implies c \= \-4\$ \$\\therefore a \+ b \+ c \= 3 \+ 2 \+ (-4) \= 1\$ (①)

```
{"question": {"capability": "rational-basic-v1", "graphPlan": {"family": "rational-basic", "numerator": ["-4", "2"], "denominator": ["3", "1"], "domain": ["-9", "5"], "viewport": [-8, 6, -4, 8], "asymptotes": {"x": ["-3"], "y": ["2"]}, "points": [{"id": "Xint", "x": "2", "y": "0", "label": "(2,0)"}]}, "caption": "수직점근선 x=-3, 수평점근선 y=2이고 점 (2,0)을 지나는 유리함수 그래프"}, "solution": {"capability": "rational-basic-v1", "graphPlan": {"family": "rational-basic", "numerator": ["-4", "2"], "denominator": ["3", "1"], "domain": ["-9", "5"], "viewport": [-8, 6, -4, 8], "asymptotes": {"x": ["-3"], "y": ["2"]}, "points": [{"id": "Xint", "x": "2", "y": "0", "label": "(2,0)"}]}, "caption": "점근선 x=-3, y=2에서 a=3, b=2를 읽고 x절편 (2,0)으로 c=-4를 구한다."}}
```

```
{"sourceQid": 3, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-04", "subUnitKey": "H15-SB-04-RATIONAL_GRAPH", "conceptClusterKey": "", "primaryMethod": "그래프의 두 점근선 $x=-3$, $y=2$로 $a, b$를 먼저 결정하고 $x$절편 $(2,0)$을 대입해 $c$를 구한다.", "decisiveStep": "분모가 $0$이 되는 $x=-a=-3$과 극한비 $y=b=2$를 읽은 뒤 분자 $2b+c=0$에 대입한다.", "rpm": {"majorUnit": "함수", "midUnit": "유리함수", "l3": "점근선과 위치", "l4": "그래프의 사분면"}, "ptTplCandidate": {"problemTypeKey": "PT_FUNCTION_GRAPH_QUADRANT", "templateKey": "TPL_FUNCTION_QUADRANT_DIRECT", "why": "high1.json H1-RPM-111(DIRECT_ACTIVE): 점근선과 위치/그래프의 사분면"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "그래프에서 두 점근선과 한 절편을 읽어 세 미정계수를 순차적으로 구하는 표준 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"given": ["유리함수", "그래프"], "goal": ["합"], "method": ["점근선", "대입"], "condition": ["통과"]}}, "hold": ""}
```

## Q04

- 형식: 객관식  
- 배점: 3.3

### 발문

어느 전시 기획자가 서로 다른 도자기 작품 \$7\$개를 전시실에 일렬로 나열하려고 한다. 작품 \$7\$개 중에서 \$2\$개만 동일한 작가의 작품일 때, 동일한 작가의 작품 \$2\$개를 서로 이웃하게 나열하는 모든 경우의 수를 구하면? \[3.3점\]

### 선지

① \$240\$ ② \$720\$ ③ \$1440\$ ④ \$2160\$ ⑤ \$5040\$

### 정답

③

### 해설

동일한 작가의 작품 \$2\$개를 한 묶음으로 생각하면, 이 묶음과 나머지 \$5\$개의 작품을 합쳐 모두 \$6\$개의 서로 다른 대상을 일렬로 나열한다. \$6\$개 대상을 나열하는 경우의 수: \$6\! \= 720\$ 묶음 안의 두 작품이 자리를 바꾸는 경우의 수: \$2\! \= 2\$ \$\\therefore 6\! \\times 2\! \= 720 \\times 2 \= 1440\$ (③)

```
{"status": "EXEMPT", "reason": "이웃 조건이 있는 순열을 묶음 처리하여 계산하는 기본 문항이므로 그림이 필요하지 않다."}
```

```
{"sourceQid": 4, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-07", "subUnitKey": "H15-SB-07-PERMUTATION_BASIC", "conceptClusterKey": "", "primaryMethod": "동일 작가의 $2$개 작품을 하나로 묶어 전체 $6$개 대상을 일렬 배열($6!$)한 뒤 묶음 내부 순서($2!$)를 곱한다.", "decisiveStep": "묶음 내부의 두 작품이 서로 다른 작품이므로 $2!$를 곱하는 곱의 법칙 단계를 빠뜨리지 않는다.", "rpm": {"majorUnit": "경우의 수", "midUnit": "경우의 수와 순열", "l3": "순열", "l4": "일렬 배열"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_ARRANGEMENT", "templateKey": "TPL_PERMUTATION_STANDARD_CONSTRAINT", "why": "high1.json H1-RPM-124(DIRECT_ACTIVE): 순열/일렬 배열"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이웃하여 나열하는 기본 순열 공식을 바로 적용하는 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"given": ["구별가능"], "goal": ["개수"], "method": ["묶음", "순열", "곱의법칙"], "condition": ["이웃"]}}, "hold": ""}
```

## Q05

- 형식: 객관식  
- 배점: 3.4

### 발문

전체집합 \$U\$의 세 부분집합 \$A, B, C\$에 대하여 다음 중 집합 \$(A \\cap B) \\cup (A - C)\$와 같은 집합은? \[3.4점\]

### 선지

① \$A - (B \\cup C)\$ ② \$A - (B \\cap C)\$ ③ \$(A \\cap B) - C\$ ④ \$A - (B - C)\$ ⑤ \$A - (C - B)\$

### 정답

⑤

### 해설

차집합 성질 \$X - Y \= X \\cap Y^C\$과 분배법칙을 이용하면 \$(A \\cap B) \\cup (A - C) \= (A \\cap B) \\cup (A \\cap C^C) \= A \\cap (B \\cup C^C)\$ 한편 보기 ⑤를 정리하면 \$A - (C - B) \= A \\cap (C \\cap B^C)^C \= A \\cap (C^C \\cup B) \= A \\cap (B \\cup C^C)\$ 따라서 \$(A \\cap B) \\cup (A - C) \= A - (C - B)\$이다. \$\\therefore\$ ⑤

```
{"status": "EXEMPT", "reason": "집합의 연산 법칙(차집합, 드모르간 법칙, 분배법칙)으로 동치인 식을 찾는 문항이므로 그림이 필요하지 않다."}
```

```
{"sourceQid": 5, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-01", "subUnitKey": "H15-SB-01-SET_OPERATION", "conceptClusterKey": "", "primaryMethod": "차집합을 여집합의 교집합으로 고친 뒤 분배법칙으로 $A\\cap(B\\cup C^C)$로 묶어 드모르간 법칙과 비교한다.", "decisiveStep": "$A-(C-B)=A\\cap(C\\cap B^C)^C=A\\cap(B\\cup C^C)$임을 확인하여 주어진 식과 일치시킨다.", "rpm": {"majorUnit": "집합과 명제", "midUnit": "집합의 연산", "l3": "집합의 연산법칙", "l4": "드모르간 법칙"}, "ptTplCandidate": {"problemTypeKey": "PT_SET_OPERATION_LAW", "templateKey": "TPL_OPERATION_LAW_COMPOSITE", "why": "high1.json H1-RPM-090(DIRECT_ACTIVE): 집합의 연산법칙/드모르간 법칙"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "차집합 변환, 분배법칙, 드모르간 법칙을 연결해 동치인 집합식을 판별하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": ["전체집합", "집합"], "goal": ["판정"], "method": ["분배법칙", "드모르간법칙"], "condition": ["상등"]}}, "hold": ""}
```

## Q06

- 형식: 객관식  
- 배점: 3.5

### 발문

전체집합 \$U\$에 대하여 두 조건 \$p, q\$의 진리집합을 각각 \$P, Q\$라 하자. 명제 \$\\sim p \\to q\$가 참일 때, 다음 중 항상 옳은 것은? \[3.5점\]

### 선지

① \$P \\cap Q \= \\varnothing\$ ② \$Q^C - P \= \\varnothing\$ ③ \$P - Q \= P\$ ④ \$P \\cup Q^C \= U\$ ⑤ \$P^C \\cup Q^C \= U\$

### 정답

②

### 해설

명제 \$\\sim p \\to q\$가 참이므로 진리집합의 포함 관계는 \$P^C \\subset Q\$이다. 양변의 여집합을 취하면(대우 \$\\sim q \\to p\$가 참이므로) \$Q^C \\subset P\$ \$Q^C\$의 모든 원소가 \$P\$에 속하므로 \$Q^C - P \= \\varnothing\$이 항상 성립한다. (반례: \$U \= {1, 2, 3}\$, \$P \= {1, 2}\$, \$Q \= {2, 3}\$이면 \$P^C \= {3} \\subset Q\$이지만 ① \$P \\cap Q \= {2} \\ne \\varnothing\$, ③ \$P - Q \= {1} \\ne P\$, ④ \$P \\cup Q^C \= {1, 2} \\ne U\$, ⑤ \$P^C \\cup Q^C \= {1, 3} \\ne U\$이다.) \$\\therefore\$ ②

```
{"status": "EXEMPT", "reason": "명제의 참·거짓을 진리집합 포함 관계와 대우로 바꾸어 항상 옳은 등식을 판별하는 문항이므로 그림이 필요하지 않다."}
```

```
{"sourceQid": 6, "variationType": "CONDITION", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-01", "subUnitKey": "H15-SB-01-SET_BASIC", "conceptClusterKey": "", "primaryMethod": "명제 $\\sim p\\to q$의 참에서 $P^C\\subset Q$와 그 대우 $Q^C\\subset P$를 이끌어 내어 항상 참인 차집합 등식을 찾는다.", "decisiveStep": "$Q^C\\subset P$로부터 $Q^C$에서 $P$를 빼면 공집합($Q^C-P=\\varnothing$)이 됨을 포착한다.", "rpm": {"majorUnit": "집합과 명제", "midUnit": "집합의 뜻과 포함 관계", "l3": "집합의 포함 관계", "l4": "두 집합의 포함"}, "ptTplCandidate": {"problemTypeKey": "PT_SET_INCLUSION", "templateKey": "TPL_INCLUSION_DIRECT", "why": "high1.json H1-RPM-084(DIRECT_ACTIVE): 집합의 포함 관계/두 집합의 포함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "명제 조건을 진리집합 포함 관계와 대우로 변환해 5개 등식을 검증하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": ["명제", "진리집합"], "goal": ["판정"], "method": ["대우", "반례"], "condition": ["포함관계"]}}, "hold": ""}
```

## Q07

- 형식: 객관식  
- 배점: 3.6

### 발문

두 도시 A, B를 연결하는 도로는 \$5\$가지, 두 도시 B, C를 연결하는 도로는 \$n\$가지이다. A도시를 출발하여 B도시를 거쳐 C도시까지 갔다가 B도시로 돌아오는 경우의 수는 \$150\$가지이다. 자연수 \$n\$의 값을 구하면? (단, 한 번 이용한 도로는 다시 이용하지 않는다.) \[3.6점\]

### 선지

① \$3\$ ② \$4\$ ③ \$5\$ ④ \$6\$ ⑤ \$7\$

### 정답

④

### 해설

A \$\\to\$ B 이동: \$5\$가지 B \$\\to\$ C 이동: \$n\$가지 C \$\\to\$ B 이동: 직전에 이용한 도로 \$1\$개를 제외하므로 \$(n - 1)\$가지 곱의 법칙에 의하여 \$5 \\times n \\times (n - 1\) \= 150 \\implies n(n - 1\) \= 30\$ \$n^2 - n - 30 \= 0 \\implies (n - 6)(n \+ 5\) \= 0\$ \$n\$은 자연수이므로 \$n \= 6\$이다. \$\\therefore\$ ④

```
{"status": "EXEMPT", "reason": "도로 선택 수에 곱의 법칙을 적용하여 이차방정식을 푸는 문항이므로 그림이 필요하지 않다."}
```

```
{"sourceQid": 7, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-06", "subUnitKey": "H15-SB-06-COUNTING_PRINCIPLE", "conceptClusterKey": "", "primaryMethod": "A$\\to$B($5$가지), B$\\to$C($n$가지), C$\\to$B($n-1$가지)를 곱의 법칙으로 곱해 $5n(n-1)=150$을 푼다.", "decisiveStep": "돌아올 때 직전 사용 도로 $1$개를 제외해 선택지를 $n-1$로 두는 조건을 정확히 반영한다.", "rpm": {"majorUnit": "경우의 수", "midUnit": "경우의 수와 순열", "l3": "합·곱의 법칙", "l4": "단계별 선택"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COUNTING_PRINCIPLE_GENERAL", "templateKey": "TPL_H1_COUNTING_DIRECT_CASE", "why": "high1.json H1-RPM-123(DIRECT_ACTIVE): 합·곱의 법칙/단계별 선택"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "경로별 선택 수의 곱으로 이차방정식을 세워 자연수 해를 구하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": ["경로", "자연수"], "goal": ["값"], "method": ["곱의법칙", "이차방정식"], "condition": ["재방문금지"]}}, "hold": ""}
```

## Q08

- 형식: 객관식  
- 배점: 3.6

### 발문

학생 \$6\$명의 이름표를 상자 속에 \$1\$개씩 넣은 후 임의로 \$1\$개씩 고를 때, \$6\$명 중에서 \$3\$명만 자신의 이름표를 고르는 모든 경우의 수를 구하면? \[3.6점\]

### 선지

① \$40\$ ② \$60\$ ③ \$80\$ ④ \$100\$ ⑤ \$120\$

### 정답

①

### 해설

자신의 이름표를 고르는 학생 \$3\$명을 택하는 경우의 수: \${}\_6C\_3 \= \\dfrac{6 \\times 5 \\times 4}{3 \\times 2 \\times 1} \= 20\$ 나머지 학생 \$3\$명(A, B, C라 하자)이 모두 다른 사람의 이름표를 고르는 경우는 (B의 것, C의 것, A의 것), (C의 것, A의 것, B의 것)의 \$2\$가지이다. \$\\therefore 20 \\times 2 \= 40\$ (①)

```
{"status": "EXEMPT", "reason": "조합으로 고정 인원을 뽑고 나머지 3명의 교란순열을 곱해 세는 문항이므로 그림이 필요하지 않다."}
```

```
{"sourceQid": 8, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-06", "subUnitKey": "H15-SB-06-COUNTING_PRINCIPLE", "conceptClusterKey": "", "primaryMethod": "자기 이름표를 고를 $3$명을 ${}_6C_3$으로 택한 뒤 남은 $3$명이 모두 제자리를 피하는 경우의 수 $2$를 곱한다.", "decisiveStep": "$3$명의 교란순열 수가 $2$가지임을 확인해 ${}_6C_3\\times 2=40$을 계산한다.", "rpm": {"majorUnit": "경우의 수", "midUnit": "경우의 수와 순열", "l3": "합·곱의 법칙", "l4": "경우를 나누어 세기"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COUNTING_PRINCIPLE_GENERAL", "templateKey": "TPL_H1_COUNTING_DIRECT_CASE", "why": "high1.json H1-RPM-122(DIRECT_ACTIVE): 합·곱의 법칙/경우를 나누어 세기"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "일부 고정 조합과 3원소 교란순열을 결합하여 곱의 법칙으로 해결하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": ["순열"], "goal": ["개수"], "method": ["조합", "열거", "곱의법칙"], "condition": ["제자리금지"]}}, "hold": ""}
```

## Q09

- 형식: 객관식  
- 배점: 3.8

### 발문

다음 중 두 조건 \$p, q\$에 대하여 \$p\$가 \$q\$이기 위한 필요충분조건인 것은? (단, \$x, y\$는 실수이다.) \[3.8점\]

### 선지

① \$p: xy \= 0\$, \$q: x^2 \+ y^2 \= 0\$ ② \$p: x \= \-2\$, \$q: x^2 - x - 6 \= 0\$ ③ \$p: \|x\| \+ \|y\| \= 2\$, \$q: x^2 \+ y^2 \= 4\$ ④ \$p: x \> y\$, \$q: x^2 \> y^2\$ ⑤ \$p: x \< 0, y \< 0\$, \$q: x \+ y \< 0, xy \> 0\$

### 정답

⑤

### 해설

① \$(x, y) \= (1, 0)\$일 때 \$p\$는 참이지만 \$q\$는 거짓이므로 \$p \\not\\to q\$ ② \$x \= 3\$일 때 \$q\$는 참이지만 \$p\$는 거짓이므로 \$q \\not\\to p\$ ③ \$(x, y) \= (1, 1)\$일 때 \$p\$는 참이지만 \$q\$는 \$1 \+ 1 \= 2 \\ne 4\$로 거짓이므로 \$p \\not\\to q\$ ④ \$x \= 1, y \= \-2\$일 때 \$p\$는 참이지만 \$q\$는 \$1 \> 4\$로 거짓이고, \$x \= \-2, y \= 1\$일 때 \$q\$는 참이지만 \$p\$는 거짓이다. ⑤ \$x \< 0, y \< 0\$이면 \$x \+ y \< 0\$이고 \$xy \> 0\$이다 (\$p \\implies q\$). 반대로 \$xy \> 0\$이면 \$x, y\$의 부호가 같고, \$x \+ y \< 0\$이므로 둘 다 음수이다 (\$q \\implies p\$). 따라서 \$p\$는 \$q\$이기 위한 필요충분조건이다. \$\\therefore\$ ⑤

```
{"status": "EXEMPT", "reason": "실수 조건의 필요충분조건을 동치 증명과 반례로 판별하는 문항이므로 그림이 필요하지 않다."}
```

```
{"sourceQid": 9, "variationType": "CONDITION", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-02", "subUnitKey": "H15-SB-02-PROPOSITION_BASIC", "conceptClusterKey": "", "primaryMethod": "각 보기에서 $p\\implies q$와 $q\\implies p$의 성립 여부를 반례 탐색과 부호 판정으로 검증해 동치인 쌍을 찾는다.", "decisiveStep": "$xy>0$이 동부호 조건임을 이용해 $x+y<0$과 결합하면 $x<0, y<0$과 동치가 됨을 확인한다.", "rpm": {"majorUnit": "집합과 명제", "midUnit": "명제", "l3": "명제와 조건", "l4": "명제의 참·거짓"}, "ptTplCandidate": {"problemTypeKey": "PT_PROPOSITION_JUDGMENT", "templateKey": "TPL_PROPOSITION_TRUTH_JUDGMENT", "why": "high1.json H1-RPM-093(DIRECT_ACTIVE): 명제와 조건/명제의 참·거짓"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "실수, 절댓값, 제곱 부등식에 대한 충분·필요 방향 반례를 정확히 찾아내야 하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": ["필요충분조건", "실수"], "goal": ["판정"], "method": ["반례", "판정"], "condition": ["부호", "음수"]}}, "hold": ""}
```

## Q10

- 형식: 객관식  
- 배점: 4

### 발문

두 집합 \$X \= {1, 2, 3, 4}\$, \$Y \= {4, 5, 6, 7}\$에 대하여 함수 \$f\$는 \$X\$에서 \$Y\$로의 일대일대응이다. \$f(1) \= 6\$, \$f(2) - f(3) \= 3\$일 때, \$f(3) \\times f(4)\$의 값을 구하면? \[4점\]

### 선지

① \$12\$ ② \$16\$ ③ \$20\$ ④ \$24\$ ⑤ \$28\$

### 정답

③

### 해설

\$f\$는 일대일대응이고 \$f(1) \= 6\$이므로 \$f(2), f(3), f(4)\$는 남은 원소 \${4, 5, 7}\$을 각각 하나씩 값으로 갖는다. \${4, 5, 7}\$의 서로 다른 두 수 중 차가 \$3\$인 경우는 \$7 - 4 \= 3\$뿐이다. 따라서 \$f(2) \= 7\$, \$f(3) \= 4\$이고, 남은 원소에서 \$f(4) \= 5\$이다. \$\\therefore f(3) \\times f(4) \= 4 \\times 5 \= 20\$ (③)

```
{"status": "EXEMPT", "reason": "유한집합 사이의 일대일대응 조건과 차 조건으로 함숫값을 유일하게 결정하는 문항이므로 그림이 필요하지 않다."}
```

```
{"sourceQid": 10, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-01", "subUnitKey": "H15-SB-01-SET_COUNT", "conceptClusterKey": "", "primaryMethod": "일대일대응 조건으로 $f(2), f(3), f(4)$의 후보를 $\\{4,5,7\\}$로 좁힌 뒤 $f(2)-f(3)=3$을 만족하는 쌍을 찾는다.", "decisiveStep": "$\\{4,5,7\\}$에서 차가 $3$인 유일한 순서쌍 $(7,4)$를 찾아 $f(4)=5$를 확정한다.", "rpm": {"majorUnit": "집합과 명제", "midUnit": "집합의 뜻과 포함 관계", "l3": "집합과 원소", "l4": "유한집합 원소 개수"}, "ptTplCandidate": {"problemTypeKey": "PT_SET_CARDINALITY", "templateKey": "TPL_SET_CARDINALITY_DIRECT", "why": "high1.json H1-RPM-081(DIRECT_ACTIVE): 집합과 원소/유한집합 원소 개수"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "일대일대응 정의를 유한집합 원소 소거로 적용해 차 조건을 만족하는 쌍을 찾는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": ["함수", "일대일대응"], "goal": ["곱"], "method": ["일대일대응", "열거"], "condition": ["차"]}}, "hold": ""}
```

## Q11

- 형식: 객관식  
- 배점: 4.1

### 발문

무리함수 \$f(x) \= \\sqrt{2x - 4} \+ 2\$에 대하여 \$y \= f(x)\$의 그래프와 그 역함수 \$y \= f^{-1}(x)\$의 그래프가 서로 다른 두 점에서 만날 때, 이 두 점 사이의 거리를 구하면? \[4.1점\]

### 선지

① \$\\sqrt{2}\$ ② \$2\$ ③ \$\\sqrt{6}\$ ④ \$2\\sqrt{2}\$ ⑤ \$4\$

### 정답

④

### 해설

\$f(x) \= \\sqrt{2(x - 2)} \+ 2\$는 정의역 \$x \\ge 2\$에서 증가함수이므로, \$y \= f(x)\$와 그 역함수 \$y \= f^{-1}(x)\$의 교점은 직선 \$y \= x\$ 위에 있다. \$\\sqrt{2x - 4} \+ 2 \= x \\implies \\sqrt{2(x - 2)} \= x - 2\$ \$t \= x - 2 \\ge 0\$으로 놓으면 \$\\sqrt{2t} \= t\$ 양변을 제곱하면 \$2t \= t^2 \\implies t(t - 2\) \= 0 \\implies t \= 0\$ 또는 \$t \= 2\$ 따라서 \$x \= 2\$ 또는 \$x \= 4\$이고, 두 교점은 \$(2, 2)\$, \$(4, 4)\$이다. \$\\therefore\$ 두 점 사이의 거리는 \$\\sqrt{(4 - 2)^2 \+ (4 - 2)^2} \= \\sqrt{4 \+ 4} \= 2\\sqrt{2}\$ (④)

```
{"question": {"status": "EXEMPT", "reason": "발문에 그림이 없는 무리함수와 역함수의 교점 거리 문항이다."}, "solution": {"capability": "sqrt-affine-spike-v1", "graphPlan": {"family": "sqrt-affine", "radicand": ["-4", "2"], "amplitude": "1", "sign": 1, "offset": "2", "sourceDomain": {"kind": "NATURAL_SQRT_AFFINE"}, "domain": [2, 6], "viewport": [0, 6, 0, 6]}, "caption": "증가하는 무리함수 y=√(2x-4)+2와 역함수의 교점은 직선 y=x 위의 (2,2), (4,4)이다."}}
```

```
{"sourceQid": 11, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-05", "subUnitKey": "H15-SB-05-IRRATIONAL_BASIC", "conceptClusterKey": "", "primaryMethod": "증가하는 무리함수 $y=f(x)$와 역함수 $y=f^{-1}(x)$의 교점을 $f(x)=x$로 구해 두 점 사이의 거리를 계산한다.", "decisiveStep": "$x-2=t\\ge 0$으로 치환해 $t^2=2t$에서 두 고정점 $(2,2)$와 $(4,4)$를 구한다.", "rpm": {"majorUnit": "함수", "midUnit": "무리함수", "l3": "무리함수의 활용", "l4": "무리함수의 교점"}, "ptTplCandidate": {"problemTypeKey": "PT_FUNCTION_GRAPH_INTERSECTION", "templateKey": "TPL_FUNCTION_INTERSECTION_TWO_FUNCTIONS", "why": "high1.json H1-RPM-121(DIRECT_ACTIVE): 무리함수의 활용/무리함수의 교점"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "증가함수와 역함수의 교점이 $y=x$ 위에 있음을 이용해 이차방정식과 거리 공식을 적용하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": ["무리함수", "역함수"], "goal": ["거리"], "method": ["고정점", "교점", "치환"], "condition": ["증가감소"]}}, "hold": ""}
```

## Q12

- 형식: 객관식  
- 배점: 4.3

### 발문

서로 다른 \$6\$개의 자연수를 일렬로 나열하였더니 적어도 한쪽 끝에 짝수가 오는 경우의 수가 \$576\$이었다. 이때, 짝수의 개수를 구하면? \[4.3점\]

### 선지

① \$2\$ ② \$3\$ ③ \$4\$ ④ \$5\$ ⑤ \$6\$

### 정답

②

### 해설

홀수의 개수를 \$o\$라 하면 짝수의 개수는 \$6 - o\$이다. \$6\$개의 서로 다른 자연수를 일렬로 나열하는 전체 경우의 수는 \$6\! \= 720\$이다. 양쪽 끝이 모두 홀수인 경우의 수는 \${}\_oP\_2 \\times 4\! \= o(o - 1\) \\times 24\$이다. 여사건에 의하여 \$720 - 24o(o - 1\) \= 576 \\implies 24o(o - 1\) \= 144 \\implies o(o - 1\) \= 6\$ \$o\$는 자연수이므로 \$o \= 3\$이다. \$\\therefore\$ 짝수의 개수는 \$6 - 3 \= 3\$ (②)

```
{"status": "EXEMPT", "reason": "적어도 한쪽 끝에 짝수가 오는 순열을 여사건으로 세어 미지 개수를 역산하는 문항이므로 그림이 필요하지 않다."}
```

```
{"sourceQid": 12, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-07", "subUnitKey": "H15-SB-07-PERMUTATION_BASIC", "conceptClusterKey": "", "primaryMethod": "전체 순열 $6!$에서 양쪽 끝이 모두 홀수인 ${}_oP_2\\times 4!$를 뺀 식을 $576$과 같게 두어 홀수 개수 $o$를 역산한다.", "decisiveStep": "$24o(o-1)=720-576=144$에서 $o=3$을 구한 뒤 전체 $6$개에서 빼 짝수 개수 $3$을 답한다.", "rpm": {"majorUnit": "경우의 수", "midUnit": "경우의 수와 순열", "l3": "순열", "l4": "일렬 배열"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_ARRANGEMENT", "templateKey": "TPL_PERMUTATION_STANDARD_CONSTRAINT", "why": "high1.json H1-RPM-124(DIRECT_ACTIVE): 순열/일렬 배열"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "여사건 순열 공식을 세운 뒤 주어지는 경우의 수로부터 원소의 개수를 역산해야 하는 중상 난이도 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"given": ["자연수", "순열"], "goal": ["개수"], "method": ["여사건", "순열"], "condition": ["홀짝", "적어도", "자리제한"]}}, "hold": ""}
```

## Q13

- 형식: 객관식  
- 배점: 4.4

### 발문

\$a, b\$가 양수일 때, \$a \+ b \\ge 2\\sqrt{ab}\$가 성립한다. 이를 이용하여 \$ab \+ a \+ b \= 15\$일 때, \$ab\$의 최댓값을 구하면? \[4.4점\]

### 선지

① \$9\$ ② \$10\$ ③ \$12\$ ④ \$15\$ ⑤ \$16\$

### 정답

①

### 해설

\$ab \+ a \+ b \= 15\$에서 \$a \+ b \= 15 - ab\$이다. \$a \> 0, b \> 0\$이므로 산술평균과 기하평균의 관계에 의해 \$15 - ab \= a \+ b \\ge 2\\sqrt{ab}\$ \$t \= \\sqrt{ab} \> 0\$으로 놓으면 \$ab \= t^2\$이므로 \$15 - t^2 \\ge 2t \\implies t^2 \+ 2t - 15 \\le 0 \\implies (t \+ 5)(t - 3\) \\le 0\$ \$t \> 0\$이므로 \$0 \< t \\le 3 \\implies ab \= t^2 \\le 9\$ 등호는 \$a \= b \= 3\$일 때 성립하며, 이때 \$ab \+ a \+ b \= 9 \+ 3 \+ 3 \= 15\$를 만족한다. \$\\therefore\$ \$ab\$의 최댓값은 \$9\$ (①)

```
{"status": "EXEMPT", "reason": "산술·기하평균 부등식과 치환 이차부등식으로 곱의 최댓값을 구하는 문항이므로 그림이 필요하지 않다."}
```

```
{"sourceQid": 13, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-02", "subUnitKey": "H15-SB-02-NECESSARY_SUFFICIENT", "conceptClusterKey": "", "primaryMethod": "$a+b=15-ab\\ge 2\\sqrt{ab}$에 $t=\\sqrt{ab}>0$을 치환하여 이차부등식 $t^2+2t-15\\le 0$을 푼다.", "decisiveStep": "$t\\le 3$에서 $ab=t^2\\le 9$를 구하고 $a=b=3$에서 등호가 성립함을 확인한다.", "rpm": {"majorUnit": "집합과 명제", "midUnit": "명제", "l3": "필요조건·충분조건", "l4": "조건 관계"}, "ptTplCandidate": {"problemTypeKey": "PT_NEC_SUFF_RELATION", "templateKey": "TPL_NEC_SUFF_DIRECT_JUDGMENT", "why": "high1.json H1-RPM-096(DIRECT_ACTIVE): 필요조건·충분조건/조건 관계"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "산술·기하평균 부등식을 대입 변형한 뒤 제곱근 치환으로 이차부등식을 풀어 최댓값을 구하는 중상 난이도 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"given": ["양수", "절대부등식"], "goal": ["최댓값"], "method": ["산술기하평균", "치환", "이차부등식"], "condition": ["등호조건"]}}, "hold": ""}
```

## Q14

- 형식: 객관식  
- 배점: 4.5

### 발문

함수 \$f: R \\to R\$를 다음과 같이 정의한다. \$f(x) \= 3\$ (\$x\$가 유리수일 때), \$f(x) \= \-1\$ (\$x\$가 무리수일 때) 합성함수 \$f \\circ f\$의 치역은? (단, \$R\$은 실수 전체의 집합이다.) \[4.5점\]

### 선지

① \${-1}\$ ② \${-1, 3}\$ ③ \${1, 3}\$ ④ 유리수 전체 집합 ⑤ \${3}\$

### 정답

⑤

### 해설

임의의 실수 \$x\$에 대하여 \$f(x)\$의 값은 \$3\$ 또는 \$-1\$이다. \$3\$과 \$-1\$은 모두 유리수이므로 \$f(3) \= 3\$, \$f(-1) \= 3\$ 따라서 모든 실수 \$x\$에 대하여 \$(f \\circ f)(x) \= f(f(x)) \= 3\$이다. \$\\therefore\$ 합성함수 \$f \\circ f\$의 치역은 \${3}\$ (⑤)

```
{"status": "EXEMPT", "reason": "유리수·무리수 판별 조각함수를 두 번 합성해 치역을 구하는 추론 문항이므로 그림이 필요하지 않다."}
```

```
{"sourceQid": 14, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-03", "subUnitKey": "H15-SB-03-COMPOSITE_FUNCTION", "conceptClusterKey": "", "primaryMethod": "첫 적용 결과 $f(x)\\in\\{3,-1\\}$이 모두 유리수임을 파악해 두 번째 적용에서 항상 $3$이 됨을 확인한다.", "decisiveStep": "$3$과 $-1$이 모두 유리수여서 $f(3)=f(-1)=3$으로 치역이 한 원소 집합 $\\{3\\}$으로 모임을 짚어낸다.", "rpm": {"majorUnit": "함수", "midUnit": "함수", "l3": "합성함수", "l4": "합성함수 계산"}, "ptTplCandidate": {"problemTypeKey": "PT_INVERSE_COMPOSITION", "templateKey": "TPL_INVERSE_COMPOSITION_VALUE", "why": "high1.json H1-RPM-274(DIRECT_ACTIVE): 합성함수/합성함수 계산"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "함숫값이 모두 유리수라는 성질에 다시 함수 규칙을 적용해 상수함수화됨을 확인하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": ["함수", "합성함수"], "goal": ["치역"], "method": ["유리수", "무리수", "경우분류"], "condition": ["실수"]}}, "hold": ""}
```

## Q15

- 형식: 객관식  
- 배점: 4.5

### 발문

함수 \$y \= \\dfrac{2x - 3}{x - 1}\$의 그래프에 대한 보기의 설명 중에서 옳은 것을 모두 고르면? \[4.5점\]

> \[보기\] ㄱ. 제\$3\$사분면을 지나지 않는다. ㄴ. 두 점근선의 교점은 \$(1, 2)\$이다. ㄷ. 직선 \$y \= x \+ 2\$에 대하여 대칭이다.

### 선지

① ㄱ ② ㄷ ③ ㄱ, ㄴ ④ ㄴ, ㄷ ⑤ ㄱ, ㄴ, ㄷ

### 정답

③

### 해설

\$y \= \\dfrac{2x - 3}{x - 1} \= \\dfrac{2(x - 1\) - 1}{x - 1} \= 2 - \\dfrac{1}{x - 1}\$ ㄱ. \$x \< 0\$이면 \$1 - x \> 1\$이므로 \$y \= 2 \+ \\dfrac{1}{1 - x} \> 2 \> 0\$이다. 즉, \$x \< 0\$에서 \$y \< 0\$인 점이 없으므로 제\$3\$사분면을 지나지 않는다. (참) ㄴ. 두 점근선은 \$x \= 1\$, \$y \= 2\$이므로 두 점근선의 교점은 \$(1, 2)\$이다. (참) ㄷ. 그래프는 점 \$(1, 2)\$를 지나고 기울기가 \$\\pm 1\$인 직선, 즉 \$y - 2 \= \\pm(x - 1)\$에 대하여 대칭이다. 따라서 대칭축은 \$y \= x \+ 1\$과 \$y \= \-x \+ 3\$이므로 \$y \= x \+ 2\$에는 대칭이 아니다. (거짓) \$\\therefore\$ 옳은 것은 ㄱ, ㄴ (③)

```
{"question": {"status": "EXEMPT", "reason": "발문에 그림이 없는 유리함수 그래프 성질 판별 문항이다."}, "solution": {"capability": "rational-basic-v1", "graphPlan": {"family": "rational-basic", "numerator": ["-3", "2"], "denominator": ["-1", "1"], "domain": ["-4", "6"], "viewport": [-4, 6, -3, 7], "asymptotes": {"x": ["1"], "y": ["2"]}, "overlays": {"lines": [{"id": "sym1", "slope": "1", "intercept": "1"}, {"id": "sym2", "slope": "-1", "intercept": "3"}]}}, "caption": "y=2-1/(x-1)은 제3사분면을 지나지 않고 점근선 교점 (1,2)를 지나는 두 직선 y=x+1, y=-x+3에 대칭이다."}}
```

```
{"sourceQid": 15, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-04", "subUnitKey": "H15-SB-04-RATIONAL_GRAPH", "conceptClusterKey": "", "primaryMethod": "$y=\\dfrac{2x-3}{x-1}$을 표준형 $2-\\dfrac{1}{x-1}$로 변형하여 지나는 사분면, 점근선 교점, 기울기 $\\pm 1$ 대칭축을 확인한다.", "decisiveStep": "$x<0$일 때 $y=2+\\dfrac{1}{1-x}>2$로 제$3$사분면을 지나지 않음과 대칭축이 $y=x+1, y=-x+3$임을 구별한다.", "rpm": {"majorUnit": "함수", "midUnit": "유리함수", "l3": "점근선과 위치", "l4": "그래프의 사분면"}, "ptTplCandidate": {"problemTypeKey": "PT_FUNCTION_GRAPH_QUADRANT", "templateKey": "TPL_FUNCTION_QUADRANT_DIRECT", "why": "high1.json H1-RPM-111(DIRECT_ACTIVE): 점근선과 위치/그래프의 사분면"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "유리함수의 표준형 변형을 통해 사분면, 점근선, 대칭 직선을 모두 점검하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": ["유리함수"], "goal": ["판정"], "method": ["표준형", "점근선", "대칭성"], "condition": ["사분면", "축"]}}, "hold": ""}
```

## Q16

- 형식: 객관식  
- 배점: 4.6

### 발문

\$\\dfrac{{}\_nC\_r}{1} \= \\dfrac{{}*nC*{r+1}}{2} \= \\dfrac{{}*nC*{r+2}}{3}\$을 만족시키는 두 자연수 \$n, r\$의 합 \$n \+ r\$의 값은? \[4.6점\]

### 선지

① \$16\$ ② \$18\$ ③ \$20\$ ④ \$22\$ ⑤ \$24\$

### 정답

②

### 해설

연속한 조합의 비에서 \$\\dfrac{{}*nC*{r+1}}{{}\_nC\_r} \= \\dfrac{n - r}{r \+ 1} \= \\dfrac{2}{1} \\implies n - r \= 2r \+ 2 \\implies n \= 3r \+ 2\$ 또한 \$\\dfrac{{}*nC*{r+2}}{{}*nC*{r+1}} \= \\dfrac{n - r - 1}{r \+ 2} \= \\dfrac{3}{2} \\implies 2(n - r - 1\) \= 3(r \+ 2\) \\implies 2n \= 5r \+ 8\$ \$n \= 3r \+ 2\$를 대입하면 \$2(3r \+ 2\) \= 5r \+ 8 \\implies 6r \+ 4 \= 5r \+ 8 \\implies r \= 4\$ \$n \= 3(4) \+ 2 \= 14\$ \$\\therefore n \+ r \= 14 \+ 4 \= 18\$ (②)

```
{"status": "EXEMPT", "reason": "연속한 조합의 비를 이용해 연립일차방정식을 세워 푸는 문항이므로 그림이 필요하지 않다."}
```

```
{"sourceQid": 16, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-08", "subUnitKey": "H15-SB-08-COMBINATION_BASIC", "conceptClusterKey": "", "primaryMethod": "연속한 두 조합의 비 $\\dfrac{{}_nC_{r+1}}{{}_nC_r}=\\dfrac{n-r}{r+1}$ 공식을 두 번 적용해 $n, r$의 연립일차방정식을 푼다.", "decisiveStep": "$n=3r+2$와 $2n=5r+8$을 연립해 $r=4, n=14$를 구한다.", "rpm": {"majorUnit": "경우의 수", "midUnit": "조합", "l3": "조합의 뜻과 계산", "l4": "조합 계산"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_SELECTION_DISTRIBUTION", "templateKey": "TPL_H1_BINOMIAL_PARAMETER_RELATION", "why": "high1.json H1-RPM-277(DIRECT_ACTIVE): 조합의 뜻과 계산/조합 계산"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "조합의 정의식 약분을 통해 연속 조합비 식 두 개를 끌어내고 연립방정식으로 해결하는 중상 난이도 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"given": ["조합", "자연수"], "goal": ["합"], "method": ["조합", "연립일차방정식", "비"], "condition": ["연속정수"]}}, "hold": ""}
```

## Q17

- 형식: 객관식  
- 배점: 4.7

### 발문

그림과 같이 \$6\$개의 정육각형이 벌집 모양(첫째 줄 \$1, 2\$, 둘째 줄이 오른쪽으로 반 칸 어긋난 \$3, 4\$, 셋째 줄이 다시 왼쪽으로 맞춘 \$5, 6\$)으로 서로 이웃해 있다. 이때, \$1\$의 정육각형을 출발하여 모든 정육각형을 한 번씩만 지나는 방법의 수는? (단, 변을 공유하는 이웃한 정육각형으로만 이동 가능하다.) \[4.7점\]

### 선지

① \$5\$ ② \$6\$ ③ \$7\$ ④ \$8\$ ⑤ \$9\$

### 정답

④

### 해설

그림에서 각 정육각형과 변을 공유하는 이웃은 다음과 같다.

- \$1\$: \$2, 3\$ / \$2\$: \$1, 3, 4\$ / \$3\$: \$1, 2, 4, 5, 6\$ / \$4\$: \$2, 3, 6\$ / \$5\$: \$3, 6\$ / \$6\$: \$3, 4, 5\$ \$1\$에서 첫 번째로 이동하는 칸에 따라 경로를 나열한다. (1) \$1 \\to 2\$로 시작하는 경우:  
- \$1-2-3-4-6-5\$  
- \$1-2-3-5-6-4\$  
- \$1-2-4-3-5-6\$  
- \$1-2-4-3-6-5\$  
- \$1-2-4-6-5-3\$  
- \$1-2-4-6-3-5\$ (이상 \$6\$가지) (2) \$1 \\to 3\$으로 시작하는 경우:  
- \$1-3-2-4-6-5\$  
- \$1-3-5-6-4-2\$ (\$1-3-4\$나 \$1-3-6\$으로 가면 \$2\$ 또는 \$5\$가 고립되어 완주 불가, 이상 \$2\$가지) \$\\therefore 6 \+ 2 \= 8\$ (④)

```
{"question": {"status": "UNSUPPORTED", "reason": "6개 정육각형이 벌집 모양으로 배치된 번호 격자 도식은 SVG 엔진 지원 대상이 아니다."}, "solution": {"status": "EXEMPT", "reason": "첫 이동 칸을 기준으로 재방문 없이 6칸을 모두 지나는 경로를 빠짐없이 열거한다."}}
```

```
{"sourceQid": 17, "variationType": "CONDITION", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-01", "subUnitKey": "H15-SB-01-SET_COUNT", "conceptClusterKey": "", "primaryMethod": "각 정육각형의 인접 관계를 정리한 뒤 $1\\to 2$와 $1\\to 3$ 첫 이동별로 모든 칸을 한 번씩 지나는 경로를 열거한다.", "decisiveStep": "$5$번 정육각형의 이웃이 $3, 6$뿐임에 유의하여 중간에 고립되는 분기를 배제하고 총 $6+2=8$가지를 찾는다.", "rpm": {"majorUnit": "집합과 명제", "midUnit": "집합의 뜻과 포함 관계", "l3": "집합과 원소", "l4": "유한집합 원소 개수"}, "ptTplCandidate": {"problemTypeKey": "PT_SET_CARDINALITY", "templateKey": "TPL_SET_CARDINALITY_DIRECT", "why": "high1.json H1-RPM-081(DIRECT_ACTIVE): 집합과 원소/유한집합 원소 개수"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "벌집 격자 도형의 인접 관계를 파악하고 고립 분기를 배제하며 모든 해밀턴 경로를 빠짐없이 세어야 하는 고난도 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"given": ["도형", "정육각형", "경로"], "goal": ["개수"], "method": ["경우분류", "열거"], "condition": ["인접", "재방문금지"]}}, "hold": ""}
```

## Q18

- 형식: 객관식  
- 배점: 5

### 발문

다음 그림과 같이 두 함수 \$y \= \\sqrt{x \+ 1}\$, \$y \= \\sqrt{x}\$의 그래프가 \$y\$축에 평행한 직선 \$x \= k\$ \$(k \= 1, 2, 3, \\cdots)\$와 만나는 점을 각각 \$P\_k, Q\_k\$라 하자. \$\\overline{P\_1 Q\_1} \+ \\overline{P\_2 Q\_2} \+ \\overline{P\_3 Q\_3} \+ \\cdots \+ \\overline{P\_{17} Q\_{17}} \= a \+ b\\sqrt{2}\$일 때, 유리수 \$a, b\$에 대하여 \$ab\$의 값은? \[5점\]

### 선지

① \$-6\$ ② \$-4\$ ③ \$-3\$ ④ \$3\$ ⑤ \$6\$

### 정답

③

### 해설

\$P\_k(k, \\sqrt{k \+ 1})\$, \$Q\_k(k, \\sqrt{k})\$이고 \$\\sqrt{k \+ 1} \> \\sqrt{k}\$이므로 \$\\overline{P\_k Q\_k} \= \\sqrt{k \+ 1} - \\sqrt{k}\$ \$k \= 1\$부터 \$17\$까지 모두 더하면 \$(\\sqrt{2} - \\sqrt{1}) \+ (\\sqrt{3} - \\sqrt{2}) \+ \\cdots \+ (\\sqrt{18} - \\sqrt{17}) \= \\sqrt{18} - 1 \= 3\\sqrt{2} - 1\$ 따라서 \$a \= \-1\$, \$b \= 3\$이므로 \$\\therefore ab \= (-1) \\times 3 \= \-3\$ (③)

```
{"question": {"capability": "multi-curve-figure-v1", "graphPlan": {"family": "multi-curve", "curves": [{"id": "f", "kind": "SQRT", "radicand": ["1", "1"], "amplitude": "1", "sign": 1, "offset": "0", "domain": ["-1", "6"]}, {"id": "g", "kind": "SQRT", "radicand": ["0", "1"], "amplitude": "1", "sign": 1, "offset": "0", "domain": ["0", "6"]}], "overlays": {"lines": [{"id": "x1", "vertical": "1"}, {"id": "x2", "vertical": "2"}]}, "axisTickValues": {"x": ["1", "2"], "y": ["1", "2"]}}, "caption": "두 곡선 y=√(x+1), y=√x와 직선 x=k의 교점 P_k, Q_k 사이의 세로 선분"}, "solution": {"capability": "multi-curve-figure-v1", "graphPlan": {"family": "multi-curve", "curves": [{"id": "f", "kind": "SQRT", "radicand": ["1", "1"], "amplitude": "1", "sign": 1, "offset": "0", "domain": ["-1", "6"]}, {"id": "g", "kind": "SQRT", "radicand": ["0", "1"], "amplitude": "1", "sign": 1, "offset": "0", "domain": ["0", "6"]}], "overlays": {"lines": [{"id": "x1", "vertical": "1"}, {"id": "x2", "vertical": "2"}]}, "axisTickValues": {"x": ["1", "2"], "y": ["1", "2"]}}, "caption": "세로 길이 √(k+1)-√k를 k=1부터 17까지 더하면 중간 항이 소거되어 3√2-1이 남는다."}}
```

```
{"sourceQid": 18, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-05", "subUnitKey": "H15-SB-05-IRRATIONAL_BASIC", "conceptClusterKey": "", "primaryMethod": "선분 길이 $\\overline{P_kQ_k}=\\sqrt{k+1}-\\sqrt{k}$를 구한 뒤 $k=1$부터 $17$까지 망원 소거하여 $3\\sqrt{2}-1$을 얻는다.", "decisiveStep": "연속 소거 후 남는 $\\sqrt{18}-1=3\\sqrt{2}-1$에서 유리수 조건을 이용해 $a=-1, b=3$을 결정한다.", "rpm": {"majorUnit": "함수", "midUnit": "무리함수", "l3": "무리함수의 활용", "l4": "무리함수의 교점"}, "ptTplCandidate": {"problemTypeKey": "PT_FUNCTION_GRAPH_INTERSECTION", "templateKey": "TPL_FUNCTION_INTERSECTION_TWO_FUNCTIONS", "why": "high1.json H1-RPM-121(DIRECT_ACTIVE): 무리함수의 활용/무리함수의 교점"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 무리함수 그래프의 세로 선분 길이를 수식으로 표현하고 연쇄 소거와 무리수 상등으로 계수를 구하는 중상 난이도 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"given": ["무리함수", "그래프"], "goal": ["곱"], "method": ["소거", "합"], "condition": ["유리수", "길이"]}}, "hold": ""}
```

## Q19

- 형식: 객관식  
- 배점: 5.1

### 발문

\$6\$개의 자연수 \$1, 2, 3, 4, 5, 6\$ 중에서 서로 다른 \$3\$개의 자연수로 만들 수 있는 세 자리 자연수의 집합을 \$A\$, \$5\$개의 자연수 \$1, 2, 3, 7, 8\$ 중에서 서로 다른 \$3\$개의 자연수로 만들 수 있는 세 자리 자연수의 집합을 \$B\$라고 하자. \$n(A \\cup B)\$의 값을 구하면? \[5.1점\]

### 선지

① \$174\$ ② \$180\$ ③ \$186\$ ④ \$192\$ ⑤ \$210\$

### 정답

①

### 해설

\$n(A) \= {}\_6P\_3 \= 6 \\times 5 \\times 4 \= 120\$ \$n(B) \= {}\_5P\_3 \= 5 \\times 4 \\times 3 \= 60\$ 두 집합에서 공통으로 사용할 수 있는 숫자는 \${1, 2, 3}\$의 \$3\$개이므로 \$n(A \\cap B) \= {}\_3P\_3 \= 3\! \= 6\$ \$\\therefore n(A \\cup B) \= n(A) \+ n(B) - n(A \\cap B) \= 120 \+ 60 - 6 \= 174\$ (①)

```
{"status": "EXEMPT", "reason": "순열로 두 집합의 원소 개수와 교집합 원소 개수를 구해 합집합 원소 개수를 계산하는 문항이므로 그림이 필요하지 않다."}
```

```
{"sourceQid": 19, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-01", "subUnitKey": "H15-SB-01-SET_COUNT", "conceptClusterKey": "", "primaryMethod": "각 숫자 집합의 순열 ${}_6P_3, {}_5P_3$과 공통 숫자 $\\{1,2,3\\}$의 순열 ${}_3P_3$을 구해 포함·배제 원리에 대입한다.", "decisiveStep": "교집합 $A\\cap B$가 두 숫자 집합의 교집합 $\\{1,2,3\\}$으로만 만든 세 자리 수임을 파악한다.", "rpm": {"majorUnit": "집합과 명제", "midUnit": "집합의 연산", "l3": "교집합과 합집합", "l4": "원소 개수"}, "ptTplCandidate": {"problemTypeKey": "PT_SET_CARDINALITY", "templateKey": "TPL_OPERATION_CARDINALITY_COMPOSITE", "why": "high1.json H1-RPM-087(DIRECT_ACTIVE): 교집합과 합집합/원소 개수"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "순열과 집합의 포함·배제 원리를 결합하여 세 자리 자연수의 합집합 원소 수를 구하는 중상 난이도 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"given": ["자연수", "집합"], "goal": ["원소의개수"], "method": ["순열", "포함배제의원리"], "condition": ["중복불허"]}}, "hold": ""}
```

## Q20

- 형식: 객관식  
- 배점: 5.2

### 발문

함수 \$f(x) \= \\dfrac{4x - 9}{x \+ a}\$에 대하여 \$(f \\circ f)(k) \= k\$를 만족시키는 실수 \$k\$가 오직 한 개 존재할 때, \$a \+ k\$의 값은? (단, \$a \> 0\$이다.) \[5.2점\]

### 선지

① \$3\$ ② \$4\$ ③ \$5\$ ④ \$6\$ ⑤ \$7\$

### 정답

⑤

### 해설

\$(f \\circ f)(x) \= \\dfrac{4 \\cdot \\dfrac{4x - 9}{x \+ a} - 9}{\\dfrac{4x - 9}{x \+ a} \+ a} \= \\dfrac{4(4x - 9\) - 9(x \+ a)}{(4x - 9\) \+ a(x \+ a)} \= \\dfrac{7x - 9a - 36}{(a \+ 4)x \+ a^2 - 9}\$ \$(f \\circ f)(x) \= x\$에서 분모가 \$0\$이 아닌 \$x\$에 대하여 \$(a \+ 4)x^2 \+ (a^2 - 9)x \= 7x - 9a - 36\$ \$(a \+ 4)x^2 \+ (a^2 - 16)x \+ 9(a \+ 4\) \= 0\$ \$a \> 0\$이므로 \$a \+ 4 \\ne 0\$이고 양변을 \$a \+ 4\$로 나누면 \$x^2 \+ (a - 4)x \+ 9 \= 0\$ 실수 \$k\$가 오직 한 개 존재하려면 이 이차방정식이 중근을 가져야 하므로 판별식 \$D \= 0\$이다. \$D \= (a - 4)^2 - 36 \= 0 \\implies a - 4 \= \\pm 6\$ \$a \> 0\$이므로 \$a \= 10\$ 이때 \$(x \+ 3)^2 \= 0\$이므로 중근은 \$k \= \-3\$이다. (\$a \= 10, k \= \-3\$일 때 \$k \+ a \= 7 \\ne 0\$, \$f(k) \+ a \= \-3 \+ 10 \= 7 \\ne 0\$으로 모두 정의된다.) \$\\therefore a \+ k \= 10 \+ (-3) \= 7\$ (⑤)

```
{"question": {"status": "EXEMPT", "reason": "발문에 그림이 없는 유리함수의 합성 방정식 실근 유일성 문항이다."}, "solution": {"capability": "rational-basic-v1", "graphPlan": {"family": "rational-basic", "numerator": ["-9", "4"], "denominator": ["10", "1"], "domain": ["-9", "4"], "viewport": [-9, 4, -8, 5], "asymptotes": {"x": ["-10"], "y": ["4"]}, "points": [{"id": "T", "x": "-3", "y": "-3", "label": "(-3,-3)"}], "overlays": {"lines": [{"id": "yx", "slope": "1", "intercept": "0"}]}}, "caption": "a=10일 때 y=(4x-9)/(x+10)이 직선 y=x와 유일한 고정점 (-3,-3)에서 접한다."}}
```

```
{"sourceQid": 20, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-03", "subUnitKey": "H15-SB-03-COMPOSITE_FUNCTION", "conceptClusterKey": "", "primaryMethod": "유리함수 $f(f(x))$를 직접 계산해 $(f\\circ f)(x)=x$를 이차방정식 $x^2+(a-4)x+9=0$으로 정리한 뒤 중근 조건 $D=0$을 쓴다.", "decisiveStep": "분모 인자 $a+4$로 약분해 얻은 이차방정식의 판별식 $(a-4)^2-36=0$에서 $a=10, k=-3$을 구하고 정의역을 점검한다.", "rpm": {"majorUnit": "함수", "midUnit": "함수", "l3": "합성함수", "l4": "합성함수 계산"}, "ptTplCandidate": {"problemTypeKey": "PT_COMPOSITION_EVALUATION", "templateKey": "TPL_COMPOSITION_VALUE_DIRECT", "why": "high1.json H1-RPM-102(DIRECT_ACTIVE): 합성함수/합성함수 계산"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "유리함수의 합성식을 전개·약분하여 이차방정식 중근 조건과 분모 영 배제까지 확인하는 고난도 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"given": ["유리함수", "합성함수"], "goal": ["합"], "method": ["판별식", "이차방정식"], "condition": ["중근", "실근", "양수"]}}, "hold": ""}
```

## Q21

- 형식: 서답형  
- 배점: 5

### 발문

서술형 1\. 전체집합 \$U \= {x \\mid x\\text{는 } 20\\text{의 양의 약수}}\$의 세 부분집합 \$A, B, C\$에 대하여 \$A^C \= {2, 10, 20}\$, \$(B \\cup C)^C \= {1, 5}\$일 때, 집합 \$(B \\cup C) - A\$의 모든 원소들의 합을 구하시오. \[5점\]

### 선지

없음

### 정답

\$32\$

### 해설

\$20\$의 양의 약수 전체의 집합은 \$U \= {1, 2, 4, 5, 10, 20}\$이다. \$A^C \= {2, 10, 20}\$이므로 \$A \= U - A^C \= {1, 4, 5}\$ \$(B \\cup C)^C \= {1, 5}\$이므로 \$B \\cup C \= U - (B \\cup C)^C \= {2, 4, 10, 20}\$ 따라서 \$(B \\cup C) - A \= {2, 4, 10, 20} - {1, 4, 5} \= {2, 10, 20}\$ \$\\therefore\$ 모든 원소의 합은 \$2 \+ 10 \+ 20 \= 32\$

```
{"status": "EXEMPT", "reason": "전체집합과 여집합으로부터 두 집합을 구한 뒤 차집합 원소의 합을 계산하는 기본 서술형 문항이다."}
```

```
{"sourceQid": 21, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-01", "subUnitKey": "H15-SB-01-SET_COUNT", "conceptClusterKey": "", "primaryMethod": "전체집합 $U=\\{1,2,4,5,10,20\\}$에서 여집합을 빼 $A$와 $B\\cup C$를 구한 뒤 차집합 $(B\\cup C)-A$의 원소 합을 계산한다.", "decisiveStep": "$(B\\cup C)-A=\\{2,10,20\\}$을 정확히 구하고 합 $32$를 도출한다.", "rpm": {"majorUnit": "집합과 명제", "midUnit": "집합의 뜻과 포함 관계", "l3": "집합과 원소", "l4": "유한집합 원소 개수"}, "ptTplCandidate": {"problemTypeKey": "PT_SET_CARDINALITY", "templateKey": "TPL_SET_CARDINALITY_DIRECT", "why": "high1.json H1-RPM-081(DIRECT_ACTIVE): 집합과 원소/유한집합 원소 개수"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "전체집합 나열과 여집합·차집합 연산을 순차적으로 적용하는 표준 서술형 문항이다.", "level": "중", "item4slot": {"format": "서술", "slots": {"given": ["전체집합", "약수", "여집합"], "goal": ["합"], "method": ["원소나열법", "차집합"], "condition": ["자연수"]}}, "hold": ""}
```

## Q22

- 형식: 서답형  
- 배점: 5

### 발문

서술형 2\. 함수 \$f(x) \= \\sqrt{3x \+ a} - 6\$의 그래프가 원점을 지날 때, \$a\$의 값과 \$f(x)\$의 역함수와 역함수의 정의역을 구하시오. \[5점\]

### 선지

없음

### 정답

\$a \= 36\$, \$f^{-1}(x) \= \\dfrac{1}{3}x^2 \+ 4x\$, 정의역 \${x \\mid x \\ge \-6}\$

### 해설

\$f(x)\$의 그래프가 원점 \$(0, 0)\$을 지나므로 \$f(0) \= \\sqrt{a} - 6 \= 0 \\implies \\sqrt{a} \= 6 \\implies a \= 36\$ \$y \= \\sqrt{3x \+ 36} - 6\$에서 \$\\sqrt{3x \+ 36} \\ge 0\$이므로 치역은 \${y \\mid y \\ge \-6}\$이다. \$y \+ 6 \= \\sqrt{3x \+ 36}\$ (\$y \\ge \-6\$)의 양변을 제곱하면 \$(y \+ 6)^2 \= 3x \+ 36 \\implies y^2 \+ 12y \+ 36 \= 3x \+ 36 \\implies 3x \= y^2 \+ 12y\$ \$x \= \\dfrac{1}{3}y^2 \+ 4y\$ \$x\$와 \$y\$를 바꾸면 \$f^{-1}(x) \= \\dfrac{1}{3}x^2 \+ 4x\$이고, 역함수의 정의역은 원래 함수의 치역이므로 \${x \\mid x \\ge \-6}\$이다. \$\\therefore a \= 36\$, \$f^{-1}(x) \= \\dfrac{1}{3}x^2 \+ 4x\$, 정의역 \${x \\mid x \\ge \-6}\$

```
{"question": {"status": "EXEMPT", "reason": "발문에 그림이 없는 무리함수의 계수 결정 및 역함수 구하기 서술형 문항이다."}, "solution": {"capability": "sqrt-affine-spike-v1", "graphPlan": {"family": "sqrt-affine", "radicand": ["36", "3"], "amplitude": "1", "sign": 1, "offset": "-6", "sourceDomain": {"kind": "NATURAL_SQRT_AFFINE"}, "domain": [-12, 4], "viewport": [-14, 6, -8, 6]}, "caption": "a=36일 때 y=√(3x+36)-6은 (0,0)을 지나며 치역 y≥-6이 역함수의 정의역 x≥-6이 된다."}}
```

```
{"sourceQid": 22, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-05", "subUnitKey": "H15-SB-05-IRRATIONAL_GRAPH", "conceptClusterKey": "", "primaryMethod": "원점 $(0,0)$ 대입으로 $a=36$을 먼저 구하고, $y=\\sqrt{3x+36}-6$을 $x$에 관해 푼 뒤 원래 치역 $y\\ge -6$을 역함수의 정의역으로 옮긴다.", "decisiveStep": "무리함수 치역 $y\\ge -6$을 역함수의 정의역 $\\{x\\mid x\\ge -6\\}$으로 빠뜨리지 않고 명시한다.", "rpm": {"majorUnit": "함수", "midUnit": "무리함수", "l3": "정의역과 치역", "l4": "정의역 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_DOMAIN_RANGE_SURJECTIVITY", "templateKey": "TPL_FUNCTION_DOMAIN_RANGE_DIRECT", "why": "high1.json H1-RPM-117(DIRECT_ACTIVE): 정의역과 치역/정의역 조건"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "무리함수의 미정계수 결정과 역함수·정의역 도출을 순서대로 서술하는 표준 문항이다.", "level": "중", "item4slot": {"format": "서술", "slots": {"given": ["무리함수", "원점"], "goal": ["값", "역함수", "정의역"], "method": ["대입", "역함수"], "condition": ["통과", "치역"]}}, "hold": ""}
```

## Q23

- 형식: 서답형  
- 배점: 5

### 발문

서술형 3\. 회장과 부회장을 포함하여 회원이 A동아리 \$5\$명, B동아리 \$4\$명이 그림과 같이 위쪽 \$5\$석, 아래쪽 \$4\$석(아래쪽 \$4\$석은 각각 위쪽 좌석 \$1\$개와 정면으로 마주 봄)에 마주 보도록 배치된 고정된 좌석에서 모임을 가질 때, 회장은 회장끼리, 부회장은 부회장끼리 정면으로 볼 수 있도록 앉는 경우의 수를 구하시오. (단, 두 동아리의 회장과 부회장은 각각 \$1\$명씩이며, A동아리는 위쪽, B동아리는 아래쪽에 앉는다.) \[5점\]

### 선지

없음

### 정답

\$144\$

### 해설

아래쪽 B동아리 \$4\$개 좌석은 각각 위쪽 A동아리 좌석 \$1\$개와 정면으로 마주 보므로, 정면으로 마주 보는 좌석쌍은 모두 \$4\$쌍이다. 두 회장이 마주 앉을 좌석쌍을 고르는 방법: \$4\$가지 나머지 좌석쌍 중 두 부회장이 마주 앉을 좌석쌍을 고르는 방법: \$3\$가지 A동아리의 나머지 일반 회원 \$3\$명이 위쪽 남은 \$3\$석에 앉는 방법: \$3\! \= 6\$가지 B동아리의 나머지 일반 회원 \$2\$명이 아래쪽 남은 \$2\$석에 앉는 방법: \$2\! \= 2\$가지 \$\\therefore 4 \\times 3 \\times 3\! \\times 2\! \= 12 \\times 6 \\times 2 \= 144\$

```
{"question": {"status": "UNSUPPORTED", "reason": "위쪽 5석과 아래쪽 4석이 마주 보는 동아리 좌석 배치 도식은 SVG 엔진 지원 대상이 아니다."}, "solution": {"status": "EXEMPT", "reason": "마주 보는 좌석쌍 4개 중 회장쌍과 부회장쌍을 순차 배치한 뒤 일반 회원을 배열한다."}}
```

```
{"sourceQid": 23, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-06", "subUnitKey": "H15-SB-06-COUNTING_PRINCIPLE", "conceptClusterKey": "", "primaryMethod": "정면 마주 보는 $4$개 좌석쌍에서 회장쌍($4$가지)과 부회장쌍($3$가지)을 먼저 정하고, A동아리 $3$명($3!$)과 B동아리 $2$명($2!$)을 곱한다.", "decisiveStep": "위쪽 $5$석 중 $4$석만 아래쪽과 정면 대칭이므로 마주 보는 쌍 선택이 ${}_4P_2$임을 포착한다.", "rpm": {"majorUnit": "경우의 수", "midUnit": "경우의 수와 순열", "l3": "합·곱의 법칙", "l4": "단계별 선택"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COUNTING_PRINCIPLE_GENERAL", "templateKey": "TPL_H1_COUNTING_DIRECT_CASE", "why": "high1.json H1-RPM-123(DIRECT_ACTIVE): 합·곱의 법칙/단계별 선택"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "대칭 좌석쌍 제약과 일반 회원 순열을 단계별로 분리해 곱의 법칙으로 세는 중상 난이도 서술형 문항이다.", "level": "상", "item4slot": {"format": "서술", "slots": {"given": ["구별가능", "순열"], "goal": ["개수"], "method": ["순열", "곱의법칙"], "condition": ["자리제한"]}}, "hold": ""}
```

## Q24

- 형식: 서답형  
- 배점: 5

### 발문

서술형 4\. 서로 다른 상자 \$6\$개가 일렬로 놓여 있다. 여기에 같은 종류의 구슬 \$10\$개를 상자에 넣으려고 한다. 구슬을 넣는 방법의 수를 구하시오. (단, 모든 상자에는 반드시 적어도 \$1\$개의 구슬을 넣어야 한다.) \[5점\]

### 선지

없음

### 정답

\$126\$

### 해설

같은 종류의 구슬 \$10\$개를 일렬로 나열하면 구슬과 구슬 사이의 틈은 \$9\$곳이다. \$6\$개의 상자에 각각 적어도 \$1\$개의 구슬을 넣는 것은, \$9\$곳의 틈 중에서 \$5\$곳을 경계로 골라 \$6\$개의 비어 있지 않은 묶음으로 나누고 차례로 \$1\$번부터 \$6\$번 상자에 넣는 것과 일대일대응한다. \$\\therefore {}\_9C\_5 \= {}\_9C\_4 \= \\dfrac{9 \\times 8 \\times 7 \\times 6}{4 \\times 3 \\times 2 \\times 1} \= 126\$

```
{"status": "EXEMPT", "reason": "동일한 구슬을 서로 다른 상자에 최소 1개씩 나누어 넣는 조합 문항이므로 그림이 필요하지 않다."}
```

```
{"sourceQid": 24, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-08", "subUnitKey": "H15-SB-08-COMBINATION_BASIC", "conceptClusterKey": "", "primaryMethod": "같은 구슬 $10$개 사이의 $9$개 틈에서 경계 $5$곳을 고르는 조합 ${}_9C_5$로 계산한다.", "decisiveStep": "모든 상자에 최소 $1$개 조건이 $9$개 틈 중 $5$개 칸막이 선택(${}_9C_5=126$)과 일대일대응함을 확인한다.", "rpm": {"majorUnit": "경우의 수", "midUnit": "조합", "l3": "조합의 뜻과 계산", "l4": "조합 계산"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_SELECTION_DISTRIBUTION", "templateKey": "TPL_COMBINATION_SELECTION", "why": "high1.json H1-RPM-128(DIRECT_ACTIVE): 조합의 뜻과 계산/조합 계산"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "동일 대상 분배의 최소 1개 조건을 자연수 분할 조합 ${}_{n-1}C_{r-1}$로 바로 연결하는 표준 서술형 문항이다.", "level": "중", "item4slot": {"format": "서술", "slots": {"given": ["구별불가", "구별가능", "조합"], "goal": ["개수"], "method": ["조합", "분배"], "condition": ["적어도"]}}, "hold": ""}
```

