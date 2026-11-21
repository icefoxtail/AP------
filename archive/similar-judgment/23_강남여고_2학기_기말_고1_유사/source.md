

```
{"stem": "23_강남여고_2학기_기말_고1_유사", "sourceArchiveFile": "original/high/h1/2final/23_강남여고_2학기_기말_고1_기출.js", "examFolder": "2final", "grade": "고1", "curriculum": "2015", "questionCount": 24, "totalScore": 100, "generatedAt": "2026-11-16"}
```

## Q01

- 형식: 객관식  
- 배점: 3.8

### 발문

등식 \${}\_nP\_2 - {}\_5C\_2 \= 20\$을 만족시키는 자연수 \$n\$의 값은? \[3.8점\]

### 선지

① \$8\$ ② \$7\$ ③ \$6\$ ④ \$5\$ ⑤ \$4\$

### 정답

③

### 해설

\${}\_nP\_2 \= n(n-1)\$, \${}\_5C\_2 \= \\dfrac{5 \\times 4}{2} \= 10\$이므로 \$n(n-1) - 10 \= 20\$ \$n^2 - n - 30 \= 0\$ \$(n-6)(n+5) \= 0\$ \$n\$은 자연수이므로 \$n \= 6\$

```
{"status": "EXEMPT", "reason": "순열과 조합의 기호 계산만으로 해결되는 대수 문항이므로 그림이 필요하지 않다."}
```

```
{"sourceQid": 1, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-08", "subUnitKey": "H15-SB-08-COMBINATION_BASIC", "conceptClusterKey": "", "primaryMethod": "순열 ${}_nP_2=n(n-1)$과 조합 ${}_5C_2=10$을 대수식으로 바꾸어 이차방정식을 푼다.", "decisiveStep": "$n(n-1)-10=20$에서 $(n-6)(n+5)=0$을 얻고 자연수 조건으로 $n=6$을 택한다.", "rpm": {"majorUnit": "경우의 수", "midUnit": "조합", "l3": "조합의 뜻과 계산", "l4": "조합 계산"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_SELECTION_DISTRIBUTION", "templateKey": "TPL_H1_BINOMIAL_PARAMETER_RELATION", "why": "high1.json H1-RPM-277(DIRECT_ACTIVE): 조합의 뜻과 계산/조합 계산"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "순열과 조합의 정의식을 바로 대입하여 이차방정식으로 푸는 직접 적용형 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"given": ["순열", "조합", "방정식"], "goal": ["미지수", "값"], "method": ["이차방정식", "인수분해"], "condition": ["자연수"]}}, "hold": ""}
```

## Q02

- 형식: 객관식  
- 배점: 3.8

### 발문

두 함수 \$f(x) \= 3x - 2\$, \$g(x) \= 2x^2\$에 대하여 \$(g \\circ f)(1)\$의 값은? \[3.8점\]

### 선지

① \$2\$ ② \$4\$ ③ \$6\$ ④ \$8\$ ⑤ \$10\$

### 정답

①

### 해설

\$f(1) \= 3(1) - 2 \= 1\$ \$(g \\circ f)(1) \= g(f(1)) \= g(1) \= 2(1)^2 \= 2\$

```
{"status": "EXEMPT", "reason": "합성함수의 함숫값을 직접 대입하여 계산하는 문항이므로 그림이 필요하지 않다."}
```

```
{"sourceQid": 2, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-03", "subUnitKey": "H15-SB-03-COMPOSITE_FUNCTION", "conceptClusterKey": "", "primaryMethod": "합성함수의 정의 $(g\\circ f)(1)=g(f(1))$에 따라 $f(1)=1$을 먼저 구한 뒤 $g$에 대입한다.", "decisiveStep": "$f(1)=1$을 구해 $g(1)=2\\cdot 1^2=2$를 계산한다.", "rpm": {"majorUnit": "함수", "midUnit": "함수", "l3": "합성함수", "l4": "합성함수 계산"}, "ptTplCandidate": {"problemTypeKey": "PT_COMPOSITION_EVALUATION", "templateKey": "TPL_COMPOSITION_VALUE_DIRECT", "why": "high1.json H1-RPM-102(DIRECT_ACTIVE): 합성함수/합성함수 계산"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "주어진 두 다항식 $f(x)=3x-2$, $g(x)=2x^2$에 $x=1$을 차례로 대입하는 직선적 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"given": ["일차함수", "이차함수", "합성함수"], "goal": ["함숫값"], "method": ["합성함수", "대입"], "condition": []}}, "hold": ""}
```

## Q03

- 형식: 객관식  
- 배점: 3.8

### 발문

함수 \$f(x) \= 3x \+ a\$에 대하여 \$f^{-1}(7) \= 3\$일 때, 상수 \$a\$의 값은? \[3.8점\]

### 선지

① \$-5\$ ② \$-4\$ ③ \$-3\$ ④ \$-2\$ ⑤ \$-1\$

### 정답

④

### 해설

\$f^{-1}(7) \= 3 \\iff f(3) \= 7\$ \$f(3) \= 3(3) \+ a \= 9 \+ a \= 7\$ \$\\therefore a \= \-2\$

```
{"status": "EXEMPT", "reason": "역함수의 정의 $f^{-1}(7)=3 \\iff f(3)=7$을 이용한 일차방정식 풀이이므로 그림이 필요하지 않다."}
```

```
{"sourceQid": 3, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-03", "subUnitKey": "H15-SB-03-INVERSE_FUNCTION", "conceptClusterKey": "", "primaryMethod": "역함수의 성질 $f^{-1}(7)=3 \\iff f(3)=7$을 이용해 $f(x)=3x+a$에서 상수 $a$를 구한다.", "decisiveStep": "$f(3)=7$에서 일차방정식 $9+a=7$을 세워 $a=-2$를 얻는다.", "rpm": {"majorUnit": "함수", "midUnit": "함수", "l3": "역함수", "l4": "역함수 구하기"}, "ptTplCandidate": {"problemTypeKey": "PT_INVERSE_VALUE", "templateKey": "TPL_INVERSE_FUNCTION_FORM", "why": "high1.json H1-RPM-104(DIRECT_ACTIVE): 역함수/역함수 구하기"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "역함수 함숫값 조건을 원함수의 대입식으로 바로 전환하는 1단계 적용 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"given": ["일차함수", "역함수"], "goal": ["매개변수", "값"], "method": ["역함수", "일차방정식"], "condition": []}}, "hold": ""}
```

## Q04

- 형식: 객관식  
- 배점: 3.8

### 발문

여자 \$5\$명과 남자 \$6\$명 중에서 \$3\$명의 대표를 뽑을 때, 여자 \$2\$명과 남자 \$1\$명을 뽑는 방법의 수는? \[3.8점\]

### 선지

① \$50\$ ② \$60\$ ③ \$70\$ ④ \$80\$ ⑤ \$90\$

### 정답

②

### 해설

여자 \$5\$명 중 \$2\$명을 뽑는 방법의 수는 \${}\_5C\_2 \= \\dfrac{5 \\times 4}{2} \= 10\$ 남자 \$6\$명 중 \$1\$명을 뽑는 방법의 수는 \${}\_6C\_1 \= 6\$ 곱의 법칙에 의하여 구하는 방법의 수는 \$10 \\times 6 \= 60\$

```
{"status": "EXEMPT", "reason": "조합의 수와 곱의 법칙을 바로 적용하는 경우의 수 문항이므로 그림이 필요하지 않다."}
```

```
{"sourceQid": 4, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-06", "subUnitKey": "H15-SB-06-COUNTING_PRINCIPLE", "conceptClusterKey": "", "primaryMethod": "여자와 남자를 각각 조합 ${}_5C_2$, ${}_6C_1$로 뽑은 뒤 곱의 법칙으로 곱한다.", "decisiveStep": "${}_5C_2=10$과 ${}_6C_1=6$을 곱해 $60$을 구한다.", "rpm": {"majorUnit": "경우의 수", "midUnit": "경우의 수와 순열", "l3": "합·곱의 법칙", "l4": "단계별 선택"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COUNTING_PRINCIPLE_GENERAL", "templateKey": "TPL_H1_COUNTING_DIRECT_CASE", "why": "high1.json H1-RPM-123(DIRECT_ACTIVE): 합·곱의 법칙/단계별 선택"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 집단에서 각각 지정 인원을 뽑아 곱의 법칙을 적용하는 기본 조합 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"given": ["조합"], "goal": ["개수"], "method": ["조합", "곱의법칙"], "condition": []}}, "hold": ""}
```

## Q05

- 형식: 객관식  
- 배점: 3.8

### 발문

함수 \$y \= \\dfrac{k}{x}\$ \$(k \< 0)\$에 대한 다음 설명 중 옳지 않은 것은? \[3.8점\]

### 선지

① 역함수는 \$y \= \\dfrac{k}{x}\$ \$(k \< 0)\$이다. ② 점근선의 방정식은 \$x \= 0\$, \$y \= 0\$이다. ③ 그래프는 제\$2\$, \$4\$사분면에 있다. ④ \$k \= \-1\$일 때의 그래프보다 \$k \= \-3\$일 때의 그래프가 원점으로부터 더 멀리 떨어져 있다. ⑤ 정의역과 치역은 모두 실수 전체의 집합이다.

### 정답

⑤

### 해설

① \$xy \= k\$에서 \$x\$와 \$y\$를 서로 바꾸어도 \$xy \= k\$이므로 역함수는 \$y \= \\dfrac{k}{x}\$ \$(k \< 0)\$이다. (참) ② 분모가 \$0\$이 되는 \$x \= 0\$과 함숫값이 가질 수 없는 \$y \= 0\$이 점근선이다. (참) ③ \$k \< 0\$이므로 \$x\$와 \$y\$의 부호가 반대여서 그래프는 제\$2\$, \$4\$사분면에 있다. (참) ④ \$\|k\|\$의 값이 클수록 원점에서 멀어지므로 \$\|-3\| \> \|-1\|\$에서 참이다. (참) ⑤ \$x \\ne 0\$, \$y \\ne 0\$이므로 정의역과 치역은 모두 \$0\$을 제외한 실수 전체의 집합이다. (거짓)

```
{"status": "EXEMPT", "reason": "유리함수 y=k/x의 기본 성질 판별 문항으로 식의 정의만으로 옳고 그름이 결정된다."}
```

```
{"sourceQid": 5, "variationType": "CONDITION", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-04", "subUnitKey": "H15-SB-04-RATIONAL_GRAPH", "conceptClusterKey": "", "primaryMethod": "분수함수 $y=\\frac{k}{x}$ ($k<0$)의 역함수, 점근선, 사분면, $|k|$에 따른 형태, 정의역·치역 성질을 점검한다.", "decisiveStep": "분모 $x \\ne 0$과 치역 $y \\ne 0$ 조건에 의해 실수 전체의 집합이라는 ⑤가 거짓임을 판별한다.", "rpm": {"majorUnit": "함수", "midUnit": "유리함수", "l3": "유리함수의 그래프", "l4": "기본 그래프"}, "ptTplCandidate": {"problemTypeKey": "PT_RATIONAL_ASYMPTOTE", "templateKey": "TPL_RATIONAL_ASYMPTOTE_DIRECT", "why": "high1.json H1-RPM-108(DIRECT_ACTIVE): 유리함수의 그래프/기본 그래프"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "유리함수의 여러 성질(역함수·점근선·사분면·정의역)을 함께 확인해야 하는 기본 성질 판별 문항이다.", "level": "하", "item4slot": {"format": "옳지 않은 것 고르기", "slots": {"given": ["유리함수"], "goal": ["판정"], "method": ["역함수", "점근선", "정의역", "치역"], "condition": ["음수"]}}, "hold": ""}
```

## Q06

- 형식: 객관식  
- 배점: 4

### 발문

함수 \$f(x) \= \-\\sqrt{3x - 6} \+ 4\$에 대하여 보기에서 옳은 것만을 있는 대로 고른 것은?

> ㄱ. 정의역은 \${x \\mid x \\ge 2}\$이고, 치역은 \${y \\mid y \\le 4}\$이다. ㄴ. 함수 \$y \= f(x)\$의 그래프는 함수 \$y \= \-\\sqrt{3x}\$의 그래프를 \$x\$축의 방향으로 \$2\$만큼, \$y\$축의 방향으로 \$4\$만큼 평행이동한 것이다. ㄷ. 함수 \$y \= f(x)\$의 그래프는 제\$2\$사분면을 지난다.

### 선지

① ㄱ ② ㄱ, ㄴ ③ ㄱ, ㄷ ④ ㄴ, ㄷ ⑤ ㄱ, ㄴ, ㄷ

### 정답

②

### 해설

\$f(x) \= \-\\sqrt{3(x - 2)} \+ 4\$ ㄱ. 근호 안이 \$0\$ 이상이어야 하므로 \$3x - 6 \\ge 0 \\implies x \\ge 2\$이고, \$-\\sqrt{3x - 6} \\le 0\$이므로 \$y \\le 4\$이다. (참) ㄴ. \$y \= \-\\sqrt{3x}\$의 그래프를 \$x\$축 방향으로 \$2\$, \$y\$축 방향으로 \$4\$만큼 평행이동하면 \$y \= \-\\sqrt{3(x - 2)} \+ 4\$이다. (참) ㄷ. 정의역이 \$x \\ge 2\$이므로 \$x \< 0\$인 구간에 그래프가 존재하지 않아 제\$2\$사분면을 지나지 않는다. (거짓)

```
{"question": {"status": "EXEMPT", "reason": "발문에 그림이 없는 무리함수 성질 판별 문항이다."}, "solution": {"capability": "sqrt-affine-spike-v1", "graphPlan": {"family": "sqrt-affine", "radicand": ["-6", "3"], "amplitude": "1", "sign": -1, "offset": "4", "sourceDomain": {"kind": "NATURAL_SQRT_AFFINE"}, "domain": [2, 10], "viewport": [-1, 10, -2, 6]}, "caption": "시작점이 (2, 4)이고 x≥2, y≤4인 무리함수 y=-√(3x-6)+4의 그래프이다."}}
```

```
{"sourceQid": 6, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-05", "subUnitKey": "H15-SB-05-IRRATIONAL_GRAPH", "conceptClusterKey": "", "primaryMethod": "무리함수 $f(x)=-\\sqrt{3(x-2)}+4$의 시작점 $(2,4)$와 뻗는 방향을 통해 정의역·치역·평행이동·지나는 사분면을 판정한다.", "decisiveStep": "정의역이 $x \\ge 2$이므로 $x < 0$인 제2사분면을 지날 수 없음을 확인해 ㄷ이 거짓임을 가린다.", "rpm": {"majorUnit": "함수", "midUnit": "무리함수", "l3": "무리함수의 그래프", "l4": "기본 그래프"}, "ptTplCandidate": {"problemTypeKey": "PT_FUNCTION_GRAPH_PROPERTIES", "templateKey": "TPL_FUNCTION_GRAPH_PROPERTY_JUDGMENT", "why": "high1.json H1-RPM-115(DIRECT_ACTIVE): 무리함수의 그래프/기본 그래프"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "무리함수의 표준형 변형 후 정의역·치역·평행이동·사분면 판정을 순차 적용하는 표준 입문 문항이다.", "level": "중", "item4slot": {"format": "보기(ㄱㄴㄷ) 판정", "slots": {"given": ["무리함수"], "goal": ["판정"], "method": ["정의역", "치역", "평행이동"], "condition": []}}, "hold": ""}
```

## Q07

- 형식: 객관식  
- 배점: 4

### 발문

남자 \$5\$명과 여자 \$4\$명으로 이루어진 동아리 회원들이 정원이 \$4\$명인 놀이기구를 타려고 할 때, 항상 남자와 여자가 놀이기구에 같이 탑승할 경우의 수는?

### 선지

① \$105\$ ② \$110\$ ③ \$115\$ ④ \$120\$ ⑤ \$125\$

### 정답

④

### 해설

전체 \$9\$명 중에서 \$4\$명을 뽑는 경우의 수는 \${}\_9C\_4 \= \\dfrac{9 \\times 8 \\times 7 \\times 6}{4 \\times 3 \\times 2 \\times 1} \= 126\$ 남자만 \$4\$명 타는 경우의 수는 \${}\_5C\_4 \= 5\$ 여자만 \$4\$명 타는 경우의 수는 \${}\_4C\_4 \= 1\$ 따라서 구하는 경우의 수는 \$126 - 5 - 1 \= 120\$

```
{"status": "EXEMPT", "reason": "여사건과 조합 계산만으로 풀리는 경우의 수 문항이므로 그림이 필요하지 않다."}
```

```
{"sourceQid": 7, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-08", "subUnitKey": "H15-SB-08-COMBINATION_BASIC", "conceptClusterKey": "", "primaryMethod": "전체 $9$명 중 $4$명을 뽑는 수 ${}_9C_4$에서 남자만 또는 여자만 뽑는 여사건 ${}_5C_4$, ${}_4C_4$를 뺀다.", "decisiveStep": "여사건으로 남자만 뽑는 $5$가지와 여자만 뽑는 $1$가지를 전체 $126$가지에서 제외한다.", "rpm": {"majorUnit": "경우의 수", "midUnit": "조합", "l3": "조합의 뜻과 계산", "l4": "조합 계산"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_SELECTION_DISTRIBUTION", "templateKey": "TPL_COMBINATION_SELECTION", "why": "high1.json H1-RPM-128(DIRECT_ACTIVE): 조합의 뜻과 계산/조합 계산"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "적어도 한 명씩 포함 조건을 여사건으로 해석하여 조합으로 계산하는 기본 응용 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": ["조합"], "goal": ["개수"], "method": ["여사건", "조합"], "condition": []}}, "hold": ""}
```

## Q08

- 형식: 객관식  
- 배점: 4

### 발문

\$\\dfrac{x \+ 3y}{5} \= \\dfrac{3y \+ z}{5} \= \\dfrac{z}{2} \= \\dfrac{3x \+ 6y - z}{a}\$를 만족시키는 상수 \$a\$의 값을 구하면? (단, \$x, y, z\$ 중 적어도 하나는 \$0\$이 아니다.)

### 선지

① \$10\$ ② \$11\$ ③ \$12\$ ④ \$13\$ ⑤ \$14\$

### 정답

①

### 해설

네 비의 공통값을 \$t\$라 두면 \$\\dfrac{z}{2} \= t \\implies z \= 2t\$ \$\\dfrac{3y \+ z}{5} \= t \\implies 3y \+ 2t \= 5t \\implies y \= t\$ \$\\dfrac{x \+ 3y}{5} \= t \\implies x \+ 3t \= 5t \\implies x \= 2t\$ \$x, y, z\$ 중 적어도 하나는 \$0\$이 아니므로 \$t \\ne 0\$ \$\\dfrac{3x \+ 6y - z}{a} \= \\dfrac{6t \+ 6t - 2t}{a} \= \\dfrac{10t}{a} \= t\$ \$t \\ne 0\$이므로 \$\\dfrac{10}{a} \= 1 \\implies a \= 10\$

```
{"status": "EXEMPT", "reason": "비례식의 값을 매개변수 t로 두어 푸는 식 변형 문항이므로 그림이 필요하지 않다."}
```

```
{"sourceQid": 8, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-05", "subUnitKey": "H15-SB-05-IRRATIONAL_GRAPH", "conceptClusterKey": "", "primaryMethod": "주어진 연비의 공통값을 $t$($t \\ne 0$)로 놓고 $x, y, z$를 $t$로 표현한 뒤 마지막 비에 대입한다.", "decisiveStep": "$x=2t, y=t, z=2t$를 대입해 $\\frac{10t}{a}=t$를 얻고 $t\\ne 0$ 조건으로 약분하여 $a=10$을 구한다.", "rpm": {"majorUnit": "함수", "midUnit": "무리함수", "l3": "정의역과 치역", "l4": "정의역 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_DOMAIN_RANGE_SURJECTIVITY", "templateKey": "TPL_FUNCTION_DOMAIN_RANGE_DIRECT", "why": "high1.json H1-RPM-117(DIRECT_ACTIVE): 정의역과 치역/정의역 조건"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "비례식을 공통 매개변수 $t$로 치환하여 순차 소거하고 $t \\ne 0$ 조건으로 약분하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": ["비례식", "유리식"], "goal": ["매개변수", "값"], "method": ["치환", "연립일차방정식"], "condition": []}}, "hold": ""}
```

## Q09

- 형식: 객관식  
- 배점: 4

### 발문

두 함수 \$f(x) \= \-3x \+ 2\$, \$g(x) \= 2x \+ 3\$에 대하여 \$(f \\circ (g \\circ f)^{-1} \\circ f)(1)\$의 값은?

### 선지

① \$-6\$ ② \$-5\$ ③ \$-4\$ ④ \$-3\$ ⑤ \$-2\$

### 정답

⑤

### 해설

\$h(x) \= (g \\circ f)(x) \= g(-3x \+ 2\) \= 2(-3x \+ 2\) \+ 3 \= \-6x \+ 7\$ \$y \= \-6x \+ 7 \\implies x \= \\dfrac{7 - y}{6}\$이므로 \$h^{-1}(x) \= \\dfrac{7 - x}{6}\$ \$f(1) \= \-3(1) \+ 2 \= \-1\$ \$h^{-1}(-1) \= \\dfrac{7 - (-1)}{6} \= \\dfrac{8}{6} \= \\dfrac{4}{3}\$ \$\\therefore (f \\circ (g \\circ f)^{-1} \\circ f)(1) \= f\\left(\\dfrac{4}{3}\\right) \= \-3\\left(\\dfrac{4}{3}\\right) \+ 2 \= \-4 \+ 2 \= \-2\$

```
{"status": "EXEMPT", "reason": "합성함수와 역함수의 식을 직접 구해 함숫값을 계산하는 문항이므로 그림이 필요하지 않다."}
```

```
{"sourceQid": 9, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-03", "subUnitKey": "H15-SB-03-COMPOSITE_FUNCTION", "conceptClusterKey": "", "primaryMethod": "합성함수 $h(x)=(g\\circ f)(x)=-6x+7$과 그 역함수 $h^{-1}(x)=\\frac{7-x}{6}$을 구한 뒤 차례로 대입한다.", "decisiveStep": "$f(1)=-1$을 $h^{-1}$에 넣어 $\\frac{4}{3}$를 얻고 다시 $f(\\frac{4}{3})=-2$를 계산한다.", "rpm": {"majorUnit": "함수", "midUnit": "함수", "l3": "합성함수", "l4": "합성함수 계산"}, "ptTplCandidate": {"problemTypeKey": "PT_COMPOSITION_EVALUATION", "templateKey": "TPL_COMPOSITION_VALUE_DIRECT", "why": "high1.json H1-RPM-102(DIRECT_ACTIVE): 합성함수/합성함수 계산"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "합성함수의 역함수를 구해 세 단계 합성을 순차 계산하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": ["일차함수", "합성함수", "역함수"], "goal": ["함숫값"], "method": ["합성함수", "역함수"], "condition": []}}, "hold": ""}
```

## Q10

- 형식: 객관식  
- 배점: 4

### 발문

\$a \= 3 - 2i\$일 때, \$\\dfrac{1}{1 - \\dfrac{1}{1 - \\dfrac{1}{a}}} - \\dfrac{1}{1 - \\dfrac{1}{1 \+ \\dfrac{1}{a}}}\$의 값은?

### 선지

① \$-6 - 4i\$ ② \$-6 \+ 2i\$ ③ \$-6 \+ 4i\$ ④ \$6 - 4i\$ ⑤ \$6 \+ 4i\$

### 정답

③

### 해설

첫째 항을 간단히 하면 \$1 - \\dfrac{1}{a} \= \\dfrac{a - 1}{a} \\implies \\dfrac{1}{1 - \\frac{1}{a}} \= \\dfrac{a}{a - 1}\$ \$1 - \\dfrac{a}{a - 1} \= \\dfrac{-1}{a - 1} \\implies \\dfrac{1}{1 - \\dfrac{1}{1 - \\frac{1}{a}}} \= 1 - a\$ 둘째 항을 간단히 하면 \$1 \+ \\dfrac{1}{a} \= \\dfrac{a \+ 1}{a} \\implies \\dfrac{1}{1 \+ \\frac{1}{a}} \= \\dfrac{a}{a \+ 1}\$ \$1 - \\dfrac{a}{a \+ 1} \= \\dfrac{1}{a \+ 1} \\implies \\dfrac{1}{1 - \\dfrac{1}{1 \+ \\frac{1}{a}}} \= 1 \+ a\$ \$\\therefore (\\text{준식}) \= (1 - a) - (1 \+ a) \= \-2a \= \-2(3 - 2i) \= \-6 \+ 4i\$

```
{"status": "EXEMPT", "reason": "복소수 번분수식의 단계적 통분·약분 문항이므로 그림이 필요하지 않다."}
```

```
{"sourceQid": 10, "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": "", "primaryMethod": "두 번분수식을 먼저 $a$에 대한 일차식 $1-a$와 $1+a$로 정리한 뒤 복소수 $a=3-2i$를 대입한다.", "decisiveStep": "각 번분수식이 각각 $1-a$와 $1+a$로 약분됨을 이끌어내어 $-2a=-6+4i$를 구한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "i의 거듭제곱", "l4": "복소수 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_CONDITION_EQUATION", "templateKey": "TPL_H1_COMPLEX_REAL_IMAG_CONSTRAINT", "why": "high1.json H1-RPM-026(DIRECT_ACTIVE): i의 거듭제곱/복소수 조건"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "번분수를 먼저 통분해 $a$의 일차식으로 단순화한 뒤 복소수를 대입하는 구조이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": ["복소수", "번분수식"], "goal": ["식의값"], "method": ["통분", "약분", "대입"], "condition": []}}, "hold": ""}
```

## Q11

- 형식: 객관식  
- 배점: 4

### 발문

집합 \$X \= {1, 2, 3, 4}\$에 대하여 \$X\$에서 \$X\$로의 함수 중 함수의 개수를 \$a\$, 일대일 함수의 개수를 \$b\$, 상수함수의 개수를 \$c\$, 항등함수의 개수를 \$d\$라 할 때, \$a \+ b \+ c \+ d\$의 값을 구하면?

### 선지

① \$285\$ ② \$284\$ ③ \$281\$ ④ \$261\$ ⑤ \$260\$

### 정답

①

### 해설

집합 \$X\$의 원소의 개수가 \$4\$이므로 전체 함수의 개수 \$a \= 4^4 \= 256\$ 일대일 함수의 개수 \$b \= 4\! \= 24\$ 상수함수의 개수 \$c \= 4\$ 항등함수의 개수 \$d \= 1\$ \$\\therefore a \+ b \+ c \+ d \= 256 \+ 24 \+ 4 \+ 1 \= 285\$

```
{"status": "EXEMPT", "reason": "유한집합의 여러 함수 개수를 정의에 따라 세는 문항이므로 그림이 필요하지 않다."}
```

```
{"sourceQid": 11, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-01", "subUnitKey": "H15-SB-01-SET_COUNT", "conceptClusterKey": "", "primaryMethod": "원소가 $4$개인 유한집합 $X$에서 정의되는 함수($4^4$), 일대일 함수($4!$), 상수함수($4$), 항등함수($1$)의 개수를 각각 구해 더한다.", "decisiveStep": "네 가지 함수의 개수를 $a=256, b=24, c=4, d=1$로 구하고 합산한다.", "rpm": {"majorUnit": "집합과 명제", "midUnit": "집합의 뜻과 포함 관계", "l3": "집합과 원소", "l4": "유한집합 원소 개수"}, "ptTplCandidate": {"problemTypeKey": "PT_SET_CARDINALITY", "templateKey": "TPL_SET_CARDINALITY_DIRECT", "why": "high1.json H1-RPM-081(DIRECT_ACTIVE): 집합과 원소/유한집합 원소 개수"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "네 종류의 함수 정의를 정확히 구분하여 각각의 개수를 계산하고 합하는 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"given": ["집합", "함수", "일대일함수", "상수함수", "항등함수"], "goal": ["개수", "합"], "method": ["곱의법칙", "순열"], "condition": []}}, "hold": ""}
```

## Q12

- 형식: 객관식  
- 배점: 4

### 발문

집합 \${x \\mid 0 \\le x \\le 5}\$에서 정의된 함수 \$y \= f(x)\$의 그래프가 그림과 같을 때, \$(f \\circ f)(a) \= 2\$를 만족시키는 상수 \$a\$의 값은?

### 선지

① \$1\$ ② \$2\$ ③ \$3\$ ④ \$4\$ ⑤ \$5\$

### 정답

⑤

### 해설

주어진 그래프에서 각 정수점의 함숫값을 읽으면 \$f(0) \= 0,; f(2) \= 1,; f(3) \= 2,; f(4) \= 5,; f(5) \= 3\$ (\$0 \\le x \\le 2\$ 구간은 \$(0, 0)\$과 \$(2, 1)\$을 잇는 선분이므로 \$f(1) \= \\dfrac{1}{2}\$) 따라서 \$a \= 5\$일 때 \$(f \\circ f)(5) \= f(f(5)) \= f(3) \= 2\$ (다른 선택지: \$(f \\circ f)(1) \= f(\\frac{1}{2}) \= \\frac{1}{4}\$, \$(f \\circ f)(2) \= f(1) \= \\frac{1}{2}\$, \$(f \\circ f)(3) \= f(2) \= 1\$, \$(f \\circ f)(4) \= f(5) \= 3\$)

```
{"question": {"status": "UNSUPPORTED", "reason": "구간별 일차함수가 4조각 이상([0,2],[2,3],[3,4],[4,5])인 꺾은선 그래프로, piecewise-polynomial-spike-v1의 조각 수/차수 규격과 달라 별도 꺾은선 지원이 필요하다."}, "solution": {"status": "EXEMPT", "reason": "발문 그래프에서 함숫값을 읽어 합성하므로 별도 해설 그림은 필요하지 않다."}}
```

```
{"sourceQid": 12, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-03", "subUnitKey": "H15-SB-03-COMPOSITE_FUNCTION", "conceptClusterKey": "", "primaryMethod": "주어진 구간 $[0,5]$의 꺾은선 그래프에서 $f(3)=2$와 $f(5)=3$을 읽어 $(f\\circ f)(a)=2$를 만족하는 $a$를 찾는다.", "decisiveStep": "역으로 $f(t)=2$인 $t=3$과 $f(a)=3$인 $a=5$를 그래프에서 대응시킨다.", "rpm": {"majorUnit": "함수", "midUnit": "함수", "l3": "합성함수", "l4": "합성함수 계산"}, "ptTplCandidate": {"problemTypeKey": "PT_INVERSE_COMPOSITION", "templateKey": "TPL_INVERSE_COMPOSITION_VALUE", "why": "high1.json H1-RPM-274(DIRECT_ACTIVE): 합성함수/합성함수 계산"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "그래프에서 함숫값을 두 번 연속 읽어 합성방정식의 해를 찾는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": ["그래프", "합성함수"], "goal": ["미지수", "값"], "method": ["합성함수"], "condition": ["구간"]}}, "hold": ""}
```

## Q13

- 형식: 객관식  
- 배점: 4

### 발문

A를 포함한 남자 \$3\$명과 B를 포함한 여자 \$4\$명을 다음 보기와 같은 방법으로 일렬로 세울 때, 보기의 ㄱ, ㄴ, ㄷ 경우의 수를 모두 더하면?

> ㄱ. A와 B가 서로 이웃하도록 세우는 경우의 수 ㄴ. 적어도 한 쪽 끝에 여자가 오도록 세우는 경우의 수 ㄷ. 남자끼리는 서로 이웃하지 않도록 세우는 경우의 수

### 선지

① \$6480\$ ② \$7200\$ ③ \$7440\$ ④ \$7920\$ ⑤ \$8640\$

### 정답

②

### 해설

ㄱ. A와 B를 한 묶음으로 보면 \$6\$명을 배열하는 \$6\!\$가지이고, 묶음 안의 순서가 \$2\!\$가지이므로 \$6\! \\times 2\! \= 720 \\times 2 \= 1440\$ ㄴ. 전체 \$7\!\$에서 양 끝에 모두 남자가 오는 경우를 빼면 \$7\! - {}\_3P\_2 \\times 5\! \= 5040 - 6 \\times 120 \= 5040 - 720 \= 4320\$ ㄷ. 여자 \$4\$명을 먼저 일렬로 세우고(\$4\!\$), 양 끝과 사이 \$5\$개의 빈자리에 남자 \$3\$명을 배열하면(\${}\_5P\_3\$) \$4\! \\times {}\_5P\_3 \= 24 \\times 60 \= 1440\$ \$\\therefore 1440 \+ 4320 \+ 1440 \= 7200\$

```
{"status": "EXEMPT", "reason": "세 가지 순열 조건을 각각 계산하여 합산하는 문항이므로 그림이 필요하지 않다."}
```

```
{"sourceQid": 13, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-07", "subUnitKey": "H15-SB-07-PERMUTATION_BASIC", "conceptClusterKey": "", "primaryMethod": "이웃 조건(묶음 배열), 적어도 한 끝 조건(여사건), 이웃하지 않음 조건(빈자리 삽입)을 각각 계산해 더한다.", "decisiveStep": "ㄱ($1440$), ㄴ($4320$), ㄷ($1440$) 세 경우의 수를 정확히 구해 합산한다.", "rpm": {"majorUnit": "경우의 수", "midUnit": "경우의 수와 순열", "l3": "순열", "l4": "일렬 배열"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_ARRANGEMENT", "templateKey": "TPL_PERMUTATION_STANDARD_CONSTRAINT", "why": "high1.json H1-RPM-124(DIRECT_ACTIVE): 순열/일렬 배열"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "CASE_BRANCH", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "순열의 대표적 제한 조건 3가지(이웃·여사건·교대/빈자리 배치)를 모두 구별해 계산해야 하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": ["순열"], "goal": ["개수", "합"], "method": ["이웃", "여사건", "순열"], "condition": []}}, "hold": ""}
```

## Q14

- 형식: 객관식  
- 배점: 4

### 발문

서로 다른 빨간색 가방 \$2\$개와 서로 다른 파란색 가방 \$2\$개를 오른쪽 그림과 같이 놓인 진열대 \$8\$칸(위아래 두 줄에 각각 \$4\$칸씩)에 진열하려고 한다. 두 색의 가방을 서로 다른 가로줄에 놓아 같은 가로줄에 같은 색 가방을 진열하는 경우의 수를 구하면?

### 선지

① \$144\$ ② \$216\$ ③ \$288\$ ④ \$360\$ ⑤ \$576\$

### 정답

③

### 해설

빨간색 가방을 놓을 가로줄을 정하는 방법은 \$2\$가지 그 줄의 \$4\$칸 중 \$2\$칸을 고르고 서로 다른 빨간색 가방 \$2\$개를 배열하는 방법은 \${}\_4C\_2 \\times 2\! \= 6 \\times 2 \= 12\$ 남은 다른 줄의 \$4\$칸 중 \$2\$칸을 고르고 서로 다른 파란색 가방 \$2\$개를 배열하는 방법은 \${}\_4C\_2 \\times 2\! \= 6 \\times 2 \= 12\$ \$\\therefore 2 \\times 12 \\times 12 \= 288\$

```
{"question": {"status": "UNSUPPORTED", "reason": "위아래 두 줄 각 4칸으로 이루어진 진열대 도식 그림은 SVG 엔진 지원 대상이 아니다."}, "solution": {"status": "EXEMPT", "reason": "순열과 조합의 곱으로 계산되므로 해설 그림이 필요하지 않다."}}
```

```
{"sourceQid": 14, "variationType": "CONTEXT", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-06", "subUnitKey": "H15-SB-06-COUNTING_PRINCIPLE", "conceptClusterKey": "", "primaryMethod": "두 색의 가방이 들어갈 가로줄을 먼저 정한 뒤($2$가지), 각 줄에서 $4$칸 중 $2$칸을 택해 배열한다.", "decisiveStep": "줄 선택 $2$가지와 각 줄의 자리 선택·배열 ${}_4P_2 = 12$를 곱해 $288$을 구한다.", "rpm": {"majorUnit": "경우의 수", "midUnit": "경우의 수와 순열", "l3": "합·곱의 법칙", "l4": "단계별 선택"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COUNTING_PRINCIPLE_GENERAL", "templateKey": "TPL_H1_COUNTING_DIRECT_CASE", "why": "high1.json H1-RPM-123(DIRECT_ACTIVE): 합·곱의 법칙/단계별 선택"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "medium", "difficultyBoundaryFlag": "B23", "difficultyReason": "배치 대칭(줄 선택)과 각 줄의 순열 선택을 단계적으로 곱하는 문장제 배열 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": ["순열"], "goal": ["개수"], "method": ["곱의법칙", "순열", "조합"], "condition": ["구별가능"]}}, "hold": ""}
```

## Q15

- 형식: 객관식  
- 배점: 4

### 발문

일차함수 \$f(x)\$의 역함수를 \$g(x)\$라고 할 때, 함수 \$y \= f(5x - 2)\$의 역함수를 \$g(x)\$에 대한 식으로 나타내면 \$y \= ag(x) \+ b\$이다. 두 상수 \$a, b\$에 대하여 \$a \+ b\$의 값은?

### 선지

① \$-\\dfrac{3}{5}\$ ② \$-\\dfrac{1}{5}\$ ③ \$\\dfrac{1}{5}\$ ④ \$\\dfrac{3}{5}\$ ⑤ \$1\$

### 정답

④

### 해설

\$y \= f(5x - 2)\$의 양변에 \$f^{-1} \= g\$를 적용하면 \$g(y) \= 5x - 2\$ \$5x \= g(y) \+ 2 \\implies x \= \\dfrac{1}{5}g(y) \+ \\dfrac{2}{5}\$ \$x\$와 \$y\$를 서로 바꾸면 구하는 역함수는 \$y \= \\dfrac{1}{5}g(x) \+ \\dfrac{2}{5}\$ 따라서 \$a \= \\dfrac{1}{5}\$, \$b \= \\dfrac{2}{5}\$이므로 \$a \+ b \= \\dfrac{3}{5}\$

```
{"question": {"status": "EXEMPT", "reason": "발문에 그림이 없는 합성 역함수 변환 문항이다."}, "solution": {"status": "EXEMPT", "reason": "일반적인 f(x)의 구체적 계수가 주어지지 않아 대수적 역변환으로 완결된다."}}
```

```
{"sourceQid": 15, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-03", "subUnitKey": "H15-SB-03-INVERSE_FUNCTION", "conceptClusterKey": "", "primaryMethod": "$y=f(5x-2)$에 역함수 $g=f^{-1}$를 적용해 $5x-2=g(y)$로 바꾼 뒤 $x$에 대하여 풀어 역함수를 구한다.", "decisiveStep": "$x=\\frac{1}{5}g(y)+\\frac{2}{5}$에서 $a=\\frac{1}{5}, b=\\frac{2}{5}$를 읽어 합을 구한다.", "rpm": {"majorUnit": "함수", "midUnit": "함수", "l3": "역함수", "l4": "역함수 구하기"}, "ptTplCandidate": {"problemTypeKey": "PT_INVERSE_VALUE", "templateKey": "TPL_INVERSE_FUNCTION_FORM", "why": "high1.json H1-RPM-104(DIRECT_ACTIVE): 역함수/역함수 구하기"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "평행·확대 이동된 합성형 함수 $f(5x-2)$의 역함수를 기호 조작으로 도출해야 하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": ["일차함수", "역함수"], "goal": ["매개변수", "합"], "method": ["역함수"], "condition": []}}, "hold": ""}
```

## Q16

- 형식: 객관식  
- 배점: 4.2

### 발문

실수 전체의 집합에서 정의된 함수 \$f(x) \= a\|x - 3\| \+ (2 - a)x \+ 3a\$가 일대일대응이 되도록 하는 실수 \$a\$의 값의 범위는? \[4.2점\]

### 선지

① \$a \< \-1\$ 또는 \$a \> 1\$ ② \$-1 \< a \< 1\$ ③ \$0 \< a \< 1\$ ④ \$a \> 1\$ ⑤ \$a \< 1\$

### 정답

⑤

### 해설

\$x \\ge 3\$일 때, \$f(x) \= a(x - 3\) \+ (2 - a)x \+ 3a \= 2x\$ \$x \< 3\$일 때, \$f(x) \= \-a(x - 3\) \+ (2 - a)x \+ 3a \= (2 - 2a)x \+ 6a\$ \$x \= 3\$에서 두 식의 값은 모두 \$6\$으로 연속이다. \$x \\ge 3\$인 부분의 기울기가 \$2 \> 0\$이므로 실수 전체에서 일대일대응이 되려면 \$x \< 3\$인 부분의 기울기도 양수여야 한다. \$2 - 2a \> 0 \\implies a \< 1\$

```
{"question": {"status": "EXEMPT", "reason": "발문에 그림이 없는 절댓값 포함 일차함수의 일대일대응 조건 문항이다."}, "solution": {"capability": "composite-panels-v1", "panels": [{"capability": "piecewise-affine-spike-v1", "graphPlan": {"family": "piecewise-affine", "sourceDomain": {"kind": "CLOSED_INTERVAL", "range": [-1, 6]}, "piecewise": {"breakX": "3", "owner": "RIGHT", "left": ["3", "1"], "right": ["0", "2"]}, "domain": [-1, 6], "viewport": [-1, 6, -1, 12]}, "caption": "a=1/2 (<1): 왼쪽 기울기 1>0, 오른쪽 기울기 2>0으로 일대일대응"}, {"capability": "piecewise-affine-spike-v1", "graphPlan": {"family": "piecewise-affine", "sourceDomain": {"kind": "CLOSED_INTERVAL", "range": [-1, 6]}, "piecewise": {"breakX": "3", "owner": "RIGHT", "left": ["12", "-2"], "right": ["0", "2"]}, "domain": [-1, 6], "viewport": [-1, 6, 0, 14]}, "caption": "a=2 (>1): 왼쪽 기울기 -2<0, 오른쪽 기울기 2>0으로 일대일대응이 아님"}], "caption": "경계 x=3을 기준으로 왼쪽 직선의 기울기 2-2a가 양수여야 일대일대응이 된다."}}
```

```
{"sourceQid": 16, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-03", "subUnitKey": "H15-SB-03-FUNCTION_RELATION", "conceptClusterKey": "", "primaryMethod": "절댓값 경계 $x=3$으로 구간을 나누어 두 직선의 기울기가 같은 부호(양수)를 갖도록 조건 $2-2a>0$을 세운다.", "decisiveStep": "$x\\ge 3$의 기울기가 $2>0$임을 확인하고 $x<3$의 기울기 $2-2a>0$에서 $a<1$을 얻는다.", "rpm": {"majorUnit": "함수", "midUnit": "함수", "l3": "함수의 뜻", "l4": "대응과 함수"}, "ptTplCandidate": {"problemTypeKey": "PT_FUNCTION_DEFINITION_JUDGMENT", "templateKey": "TPL_FUNCTION_JUDGMENT_MAPPING", "why": "high1.json H1-RPM-100(DIRECT_ACTIVE): 함수의 뜻/대응과 함수"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "CASE_BRANCH", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "절댓값 구간 분리 후 치역이 실수 전체가 되는 일대일대응 조건(두 기울기 동부호)을 판정해야 하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": ["함수", "절댓값"], "goal": ["범위"], "method": ["일대일대응", "경우분류", "기울기"], "condition": ["실수"]}}, "hold": ""}
```

## Q17

- 형식: 객관식  
- 배점: 4.2

### 발문

집합 \$X \= {1, 2, 3, 4, 5}\$에 대하여 \$X\$에서 \$X\$로의 일대일대응인 두 함수 \$f, g\$가 다음 조건을 만족시킨다.

> (가) \$f(1) \= 4\$, \$f(2) \+ g(3) \= 7\$ (나) \$f(2) \= g(2)\$, \$f(3) \= g(3)\$ (다) 함수 \$(g \\circ f)(x)\$는 항등함수이다.

\$g(5) - f(4)\$의 값은? \[4.2점\]

### 선지

① \$1\$ ② \$2\$ ③ \$3\$ ④ \$4\$ ⑤ \$5\$

### 정답

②

### 해설

조건 (다)에서 \$(g \\circ f)(x) \= x\$이므로 \$g \= f^{-1}\$ 조건 (나)에서 \$f(2) \= g(2) \= f^{-1}(2) \\implies f(f(2)) \= 2\$, 마찬가지로 \$f(f(3)) \= 3\$ 또한 \$g(3) \= f(3)\$이므로 조건 (가)에서 \$f(2) \+ f(3) \= 7\$ \$f\$는 일대일대응이므로 \$f(2) \\ne f(3)\$이고, \$f(1) \= 4\$이므로 \$f(2), f(3) \\in {1, 2, 3, 5}\$ 합이 \$7\$인 서로 다른 두 수는 \$2\$와 \$5\$뿐이므로 \${f(2), f(3)} \= {2, 5}\$ 만약 \$f(2) \= 5, f(3) \= 2\$이면 \$f(5) \= f(f(2)) \= 2 \= f(3)\$이 되어 일대일대응에 모순이다. 따라서 \$f(2) \= 2\$, \$f(3) \= 5\$이고, \$f(5) \= f(f(3)) \= 3\$ 남은 원소 \$4\$에 대하여 \$f(4) \= 1\$, \$g(5) \= f^{-1}(5) \= 3\$ \$\\therefore g(5) - f(4) \= 3 - 1 \= 2\$

```
{"status": "EXEMPT", "reason": "유한집합의 일대일대응 조건을 논리적 소거와 모순 배제로 추론하는 문항이다."}
```

```
{"sourceQid": 17, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-03", "subUnitKey": "H15-SB-03-INVERSE_FUNCTION", "conceptClusterKey": "", "primaryMethod": "$(g\\circ f)(x)=x$에서 $g=f^{-1}$임을 얻고, $f(f(2))=2, f(f(3))=3$과 $f(2)+f(3)=7$로 가능한 대응을 좁혀 모순을 배제한다.", "decisiveStep": "$\\{f(2), f(3)\\}=\\{2,5\\}$ 중 $f(3)=2$가 일대일대응에 모순임을 밝혀 $f(2)=2, f(3)=5, f(5)=3, f(4)=1$을 확정한다.", "rpm": {"majorUnit": "함수", "midUnit": "함수", "l3": "역함수", "l4": "역함수 구하기"}, "ptTplCandidate": {"problemTypeKey": "PT_INVERSE_VALUE", "templateKey": "TPL_INVERSE_FUNCTION_FORM", "why": "high1.json H1-RPM-104(DIRECT_ACTIVE): 역함수/역함수 구하기"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "INTERDEPENDENT", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "역함수 대칭성($f(f(a))=a$)과 일대일대응 배제 조건을 결합해 경우를 가려내는 준고난도 추론 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"given": ["집합", "일대일대응", "항등함수"], "goal": ["함숫값", "차"], "method": ["역함수", "귀류법", "경우분류"], "condition": []}}, "hold": ""}
```

## Q18

- 형식: 객관식  
- 배점: 4.2

### 발문

함수 \$f(x) \= \\dfrac{1}{1 - x}\$에 대하여 합성함수 \$f^{n+1} \= f^n \\circ f\$ \$(n \= 1, 2, \\cdots)\$로 정의한다. 그림에서 점 \$\\mathrm{A}\$의 좌표가 \$\\mathrm{A}(a, 0)\$이고 점 \$\\mathrm{B}\$의 좌표가 \$(f(a), f(a))\$일 때, 다음 점 중에서 점 \$\\mathrm{P}(f^{10}(a), f^{16}(a))\$와 같은 것은? \[4.2점\]

### 선지

① 점 \$\\mathrm{B}\$ ② 점 \$\\mathrm{C}\$ ③ 점 \$\\mathrm{D}\$ ④ 점 \$\\mathrm{E}\$ ⑤ 점 \$\\mathrm{F}\$

### 정답

①

### 해설

\$f(x) \= \\dfrac{1}{1 - x}\$ \$f^2(x) \= f(f(x)) \= \\dfrac{1}{1 - \\frac{1}{1 - x}} \= \\dfrac{1 - x}{-x} \= \\dfrac{x - 1}{x}\$ \$f^3(x) \= f(f^2(x)) \= \\dfrac{1}{1 - \\frac{x - 1}{x}} \= \\dfrac{x}{1} \= x\$ 따라서 \$f\$의 반복 주기는 \$3\$이다. \$10 \= 3 \\times 3 \+ 1\$, \$16 \= 3 \\times 5 \+ 1\$이므로 \$f^{10}(a) \= f(a)\$, \$f^{16}(a) \= f(a)\$ 그러므로 \$\\mathrm{P}(f(a), f(a))\$는 직선 \$y \= x\$ 위의 점 \$\\mathrm{B}\$와 같다.

```
{"question": {"capability": "multi-curve-figure-v1", "graphPlan": {"family": "multi-curve", "curves": [{"id": "f", "kind": "RATIONAL", "numerator": ["1", "0"], "denominator": ["1", "-1"], "domain": ["-2", "4"], "label": "y=1/(1-x)"}], "overlays": {"lines": [{"id": "diag", "slope": "1", "intercept": "0"}], "points": [{"id": "A", "x": "-1", "y": "0", "label": "A"}, {"id": "B", "x": "1/2", "y": "1/2", "label": "B"}, {"id": "C", "x": "-1", "y": "1/2", "label": "C"}]}, "axisTickValues": {"x": ["-1", "1"], "y": ["1"]}}, "caption": "유리함수 y=1/(1-x)와 직선 y=x, 그리고 점 A(a,0)에 대응하는 y=x 위의 점 B(f(a),f(a))이다."}, "solution": {"status": "EXEMPT", "reason": "합성 주기가 3임을 식 변형으로 확인하면 P=(f(a),f(a))=B임이 바로 결정된다."}}
```

```
{"sourceQid": 18, "variationType": "CONDITION", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-05", "subUnitKey": "H15-SB-05-IRRATIONAL_GRAPH", "conceptClusterKey": "", "primaryMethod": "유리함수 $f(x)=\\frac{1}{1-x}$의 $f^2, f^3$을 직접 계산해 주기 $3$을 찾고, $f^{10}=f^{16}=f$로 줄여 $y=x$ 위의 점을 찾는다.", "decisiveStep": "$f^3(x)=x$임을 도출해 $f^{10}(a)=f^{16}(a)=f(a)$를 확정한다.", "rpm": {"majorUnit": "함수", "midUnit": "무리함수", "l3": "무리함수의 그래프", "l4": "기본 그래프"}, "ptTplCandidate": {"problemTypeKey": "PT_FUNCTION_GRAPH_PROPERTIES", "templateKey": "TPL_FUNCTION_GRAPH_PROPERTY_JUDGMENT", "why": "high1.json H1-RPM-115(DIRECT_ACTIVE): 무리함수의 그래프/기본 그래프"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "분수함수의 반복 합성을 통해 주기 3을 발견하고 좌표평면 위 $y=x$ 대칭점과 연결하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": ["유리함수", "합성함수", "그래프"], "goal": ["좌표", "판정"], "method": ["합성함수", "주기"], "condition": ["자연수"]}}, "hold": ""}
```

## Q19

- 형식: 객관식  
- 배점: 4.2

### 발문

함수 \$f(x) \= 2\\sqrt{a(x \+ a)}\$의 그래프가 \$x\$축, \$y\$축과 만나는 점을 각각 \$\\mathrm{A}\$, \$\\mathrm{B}\$라 하고, 함수 \$y \= f(x)\$의 그래프와 직선 \$y \= 2x \+ b\$가 접하는 점을 \$\\mathrm{C}\$라 하자. 삼각형 \$\\mathrm{ABC}\$의 넓이가 \$1\$일 때, \$b - a\$의 값은? (단, \$a, b\$는 상수이고, \$a \> 0\$이다.) \[4.2점\]

### 선지

① \$\\dfrac{3}{2}\$ ② \$2\$ ③ \$\\dfrac{5}{2}\$ ④ \$3\$ ⑤ \$\\dfrac{7}{2}\$

### 정답

④

### 해설

\$\\mathrm{A}(-a, 0)\$, \$\\mathrm{B}(0, 2a)\$이다. \$2\\sqrt{a(x \+ a)} \= 2x \+ b\$의 양변을 제곱하면 \$4a(x \+ a) \= 4x^2 \+ 4bx \+ b^2\$ \$4x^2 \+ 4(b - a)x \+ b^2 - 4a^2 \= 0\$ 직선이 곡선에 접하므로 판별식 \$\\dfrac{D}{4} \= 4(b - a)^2 - 4(b^2 - 4a^2) \= 4a(5a - 2b) \= 0\$ \$a \> 0\$이므로 \$b \= \\dfrac{5}{2}a\$ 이때 접점 \$\\mathrm{C}\$의 좌표는 \$x\_{\\mathrm{C}} \= \-\\dfrac{b - a}{2} \= \-\\dfrac{3}{4}a\$, \$y\_{\\mathrm{C}} \= 2\\left(-\\dfrac{3}{4}a\\right) \+ \\dfrac{5}{2}a \= a\$ 세 점 \$\\mathrm{A}(-a, 0)\$, \$\\mathrm{B}(0, 2a)\$, \$\\mathrm{C}\\left(-\\dfrac{3}{4}a, a\\right)\$로 이루어진 삼각형 \$\\mathrm{ABC}\$의 넓이는 \$\\dfrac{1}{2}\\left\|(-a)(2a - a) \+ 0(a - 0\) \+ \\left(-\\dfrac{3}{4}a\\right)(0 - 2a)\\right\| \= \\dfrac{1}{2}\\left\|-a^2 \+ \\dfrac{3}{2}a^2\\right\| \= \\dfrac{1}{4}a^2\$ \$\\dfrac{1}{4}a^2 \= 1\$이고 \$a \> 0\$이므로 \$a \= 2\$, \$b \= 5\$ \$\\therefore b - a \= 5 - 2 \= 3\$

```
{"question": {"status": "EXEMPT", "reason": "발문에 그림이 없는 무리함수와 직선의 접선·넓이 문항이다."}, "solution": {"capability": "multi-curve-figure-v1", "graphPlan": {"family": "multi-curve", "curves": [{"id": "f", "kind": "SQRT", "radicand": ["4", "2"], "amplitude": "2", "sign": 1, "offset": "0", "domain": ["-2", "3"]}], "overlays": {"lines": [{"id": "tan", "slope": "2", "intercept": "5"}], "points": [{"id": "A", "x": "-2", "y": "0", "label": "A"}, {"id": "B", "x": "0", "y": "4", "label": "B"}, {"id": "C", "x": "-3/2", "y": "2", "label": "C"}], "polygons": [{"id": "tri", "points": ["A", "B", "C"]}]}, "axisTickValues": {"x": ["-2"], "y": ["4"]}}, "caption": "a=2, b=5일 때 무리함수 y=2√(2(x+2))와 접선 y=2x+5의 접점 C(-3/2, 2) 및 삼각형 ABC이다."}}
```

```
{"sourceQid": 19, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-05", "subUnitKey": "H15-SB-05-IRRATIONAL_GRAPH", "conceptClusterKey": "", "primaryMethod": "무리함수와 직선의 접선 조건($D=0$)으로 $b=\\frac{5}{2}a$와 접점 $\\mathrm{C}$의 좌표를 구한 뒤, 삼각형 $\\mathrm{ABC}$의 넓이식으로 $a, b$를 정한다.", "decisiveStep": "판별식 $D=0$에서 $b=\\frac{5}{2}a$를 얻어 $\\mathrm{C}(-\\frac{3}{4}a, a)$를 구하고 넓이 $\\frac{1}{4}a^2=1$로 $a=2$를 확정한다.", "rpm": {"majorUnit": "함수", "midUnit": "무리함수", "l3": "무리함수의 그래프", "l4": "평행이동"}, "ptTplCandidate": {"problemTypeKey": "PT_FUNCTION_GRAPH_GEOMETRY", "templateKey": "TPL_GRAPH_AREA_BY_SYMMETRY", "why": "high1.json H1-RPM-276(DIRECT_ACTIVE): 무리함수의 그래프/평행이동"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "무리함수 절편·접선 판별식·좌표 삼각형 넓이를 모두 결합하여 미지수를 결정해야 하는 준고난도 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"given": ["무리함수", "직선", "삼각형"], "goal": ["매개변수", "차"], "method": ["판별식", "접선", "넓이"], "condition": ["양수"]}}, "hold": ""}
```

## Q20

- 형식: 객관식  
- 배점: 4.2

### 발문

두 함수 \$f(x) \= \\dfrac{12}{x}\$ \$(x \> 0)\$, \$g(x) \= \\dfrac{12}{x - 3}\$ \$(x \> 3)\$의 그래프가 직선 \$y \= t\$ \$(t \> 0)\$과 만나는 점을 각각 \$\\mathrm{A}\$, \$\\mathrm{B}\$라 하자. 또 점 \$\\mathrm{B}\$를 지나고 \$y\$축에 평행한 직선이 함수 \$y \= f(x)\$의 그래프와 만나는 점을 \$\\mathrm{C}\$, 점 \$\\mathrm{C}\$를 지나고 \$x\$축에 평행한 직선이 함수 \$y \= g(x)\$의 그래프와 만나는 점을 \$\\mathrm{D}\$라 하자. 두 함수 \$y \= f(x)\$, \$y \= g(x)\$의 그래프와 두 직선 \$\\mathrm{AB}\$, \$\\mathrm{CD}\$로 둘러싸인 부분의 넓이가 \$6\$일 때, \$t\$의 값을 구하면? \[4.2점\]

### 선지

① \$2\$ ② \$3\$ ③ \$4\$ ④ \$5\$ ⑤ \$6\$

### 정답

③

### 해설

\$\\mathrm{A}\\left(\\dfrac{12}{t}, t\\right)\$, \$\\mathrm{B}\\left(3 \+ \\dfrac{12}{t}, t\\right)\$ 점 \$\\mathrm{C}\$의 \$x\$좌표는 \$\\mathrm{B}\$와 같으므로 \$y\_{\\mathrm{C}} \= f\\left(3 \+ \\dfrac{12}{t}\\right) \= \\dfrac{12}{3 \+ \\frac{12}{t}} \= \\dfrac{4t}{t \+ 4}\$ \$g(x) \= f(x - 3)\$이므로 같은 높이에서 두 곡선 사이의 가로 거리는 항상 \$3\$으로 일정하다. 따라서 둘러싸인 부분의 넓이는 가로 길이 \$3\$과 두 수평선 사이의 높이 \$t - y\_{\\mathrm{C}}\$의 곱과 같다. \$3\\left(t - \\dfrac{4t}{t \+ 4}\\right) \= 6 \\implies \\dfrac{3t^2}{t \+ 4} \= 6\$ \$3t^2 - 6t - 24 \= 0 \\implies t^2 - 2t - 8 \= 0 \\implies (t - 4)(t \+ 2\) \= 0\$ \$t \> 0\$이므로 \$t \= 4\$

```
{"question": {"capability": "multi-curve-figure-v1", "graphPlan": {"family": "multi-curve", "curves": [{"id": "f", "kind": "RATIONAL", "numerator": ["12", "0"], "denominator": ["0", "1"], "domain": ["1.5", "10"]}, {"id": "g", "kind": "RATIONAL", "numerator": ["12", "0"], "denominator": ["-3", "1"], "domain": ["4.5", "12"]}], "overlays": {"points": [{"id": "A", "x": "3", "y": "4", "label": "A"}, {"id": "B", "x": "6", "y": "4", "label": "B"}, {"id": "C", "x": "6", "y": "2", "label": "C"}, {"id": "D", "x": "9", "y": "2", "label": "D"}], "segments": [{"from": "A", "to": "B"}, {"from": "B", "to": "C"}, {"from": "C", "to": "D"}]}, "axisTickValues": {"x": ["3"], "y": ["4"]}}, "caption": "f(x)=12/x, g(x)=12/(x-3)의 그래프와 네 점 A, B, C, D로 둘러싸인 영역의 도식이다."}, "solution": {"status": "EXEMPT", "reason": "발문 그림에서 평행이동 거리 3이 그대로 보이므로 별도 해설 그림은 필요하지 않다."}}
```

```
{"sourceQid": 20, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-05", "subUnitKey": "H15-SB-05-IRRATIONAL_GRAPH", "conceptClusterKey": "", "primaryMethod": "$g(x)=f(x-3)$의 평행이동 구조로 두 곡선 사이 가로 거리가 항상 $3$임을 파악해 넓이를 직사각형 넓이 $3(t-y_{\\mathrm{C}})$로 바꾼다.", "decisiveStep": "$y_{\\mathrm{C}}=\\frac{4t}{t+4}$를 구하고 넓이식 $3(t-y_{\\mathrm{C}})=6$을 이차방정식 $t^2-2t-8=0$으로 풀어 $t=4$를 얻는다.", "rpm": {"majorUnit": "함수", "midUnit": "무리함수", "l3": "무리함수의 그래프", "l4": "평행이동"}, "ptTplCandidate": {"problemTypeKey": "PT_FUNCTION_GRAPH_GEOMETRY", "templateKey": "TPL_GRAPH_AREA_BY_SYMMETRY", "why": "high1.json H1-RPM-276(DIRECT_ACTIVE): 무리함수의 그래프/평행이동"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "REINTERPRETATION", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "평행이동한 두 유리함수 사이의 곡선 영역 넓이를 등적 변형(가로폭×높이)으로 재해석해야 하는 준고난도 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"given": ["유리함수", "그래프", "직선"], "goal": ["매개변수", "값"], "method": ["평행이동", "넓이", "이차방정식"], "condition": ["양수"]}}, "hold": ""}
```

## Q21

- 형식: 서답형  
- 배점: 5

### 발문

\[서술형1\] 함수 \$f(x) \= \\dfrac{1}{3}x \+ a\$의 역함수가 \$f^{-1}(x) \= bx - 6\$일 때, 두 상수 \$a, b\$를 구하는 풀이 과정과 답을 쓰시오. \[5점\]

### 선지

없음

### 정답

\$a \= 2,; b \= 3\$

### 해설

\$y \= \\dfrac{1}{3}x \+ a\$를 \$x\$에 대하여 정리하면 \$\\dfrac{1}{3}x \= y - a \\implies x \= 3y - 3a\$ \$x\$와 \$y\$를 서로 바꾸면 역함수는 \$f^{-1}(x) \= 3x - 3a\$ 이 식이 \$bx - 6\$과 같으므로 계수를 비교하면 \$b \= 3\$, \$-3a \= \-6 \\implies a \= 2\$ 따라서 \$a \= 2\$, \$b \= 3\$

```
{"status": "EXEMPT", "reason": "일차함수의 역함수를 직접 구해 계수를 비교하는 기본 서술형 문항이다."}
```

```
{"sourceQid": 21, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-03", "subUnitKey": "H15-SB-03-INVERSE_FUNCTION", "conceptClusterKey": "", "primaryMethod": "$y=\\frac{1}{3}x+a$를 $x$에 대해 정리한 뒤 $x, y$를 바꾸어 $f^{-1}(x)=3x-3a$를 구하고 $bx-6$과 계수를 비교한다.", "decisiveStep": "$b=3$과 $-3a=-6$을 얻어 $a=2, b=3$을 구한다.", "rpm": {"majorUnit": "함수", "midUnit": "함수", "l3": "역함수", "l4": "역함수 구하기"}, "ptTplCandidate": {"problemTypeKey": "PT_INVERSE_VALUE", "templateKey": "TPL_INVERSE_FUNCTION_FORM", "why": "high1.json H1-RPM-104(DIRECT_ACTIVE): 역함수/역함수 구하기"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "일차함수의 역함수 구하기 공식·절차를 그대로 적용해 계수 비교로 끝나는 기본 문항이다.", "level": "하", "item4slot": {"format": "서술", "slots": {"given": ["일차함수", "역함수"], "goal": ["매개변수", "값"], "method": ["역함수", "계수비교"], "condition": []}}, "hold": ""}
```

## Q22

- 형식: 서답형  
- 배점: 5

### 발문

\[서술형2\] 함수 \$y \= \\dfrac{ax \+ b}{x \+ c}\$의 그래프가 원점을 지나고 아래 그림과 같이 두 점근선이 \$x \= 3\$, \$y \= 2\$일 때, \$2 \\le x \\le 8\$에서 무리함수 \$y \= \\sqrt{ax \+ b} \+ c\$의 최솟값과 최댓값을 구하는 풀이 과정과 답을 쓰시오. \[5점\]

### 선지

없음

### 정답

최솟값 \$-1\$, 최댓값 \$1\$

### 해설

유리함수 \$y \= \\dfrac{ax \+ b}{x \+ c}\$의 점근선이 \$x \= 3\$, \$y \= 2\$이므로 \$-c \= 3 \\implies c \= \-3\$, \$a \= 2\$ 그래프가 원점 \$(0, 0)\$을 지나므로 \$0 \= \\dfrac{b}{c} \\implies b \= 0\$ 따라서 무리함수는 \$y \= \\sqrt{2x} - 3\$이다. 이 함수는 \$2 \\le x \\le 8\$에서 \$x\$의 값이 커질수록 함숫값도 커지는 증가함수이므로 \$x \= 2\$일 때 최솟값 \$\\sqrt{4} - 3 \= 2 - 3 \= \-1\$ \$x \= 8\$일 때 최댓값 \$\\sqrt{16} - 3 \= 4 - 3 \= 1\$

```
{"question": {"capability": "rational-spike-v1", "graphPlan": {"family": "rational", "numerator": ["0", "2"], "denominator": ["-3", "1"], "sourceDomain": {"kind": "ALL_REALS"}, "domain": [-4, 10], "viewport": [-4, 10, -4, 8]}, "caption": "점근선이 x=3, y=2이고 원점을 지나는 유리함수 y=2x/(x-3)의 그래프이다."}, "solution": {"capability": "sqrt-affine-spike-v1", "graphPlan": {"family": "sqrt-affine", "radicand": ["0", "2"], "amplitude": "1", "sign": 1, "offset": "-3", "sourceDomain": {"kind": "CLOSED_INTERVAL", "range": [2, 8]}, "domain": [2, 8], "viewport": [0, 10, -3, 3]}, "caption": "2≤x≤8에서 증가하는 무리함수 y=√(2x)-3의 최솟값(-1)과 최댓값(1)을 보인다."}}
```

```
{"sourceQid": 22, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-05", "subUnitKey": "H15-SB-05-IRRATIONAL_GRAPH", "conceptClusterKey": "", "primaryMethod": "유리함수의 점근선($x=3, y=2$)과 원점 통과 조건으로 $a, b, c$를 정한 뒤 무리함수의 증가 성질로 양 끝값을 구한다.", "decisiveStep": "$a=2, b=0, c=-3$을 구해 $y=\\sqrt{2x}-3$의 양 끝값 $x=2, 8$을 대입한다.", "rpm": {"majorUnit": "함수", "midUnit": "무리함수", "l3": "정의역과 치역", "l4": "그래프 위치"}, "ptTplCandidate": {"problemTypeKey": "PT_FUNCTION_EXTREMUM", "templateKey": "TPL_FUNCTION_EXTREMUM_INTERVAL_ENDPOINT", "why": "high1.json H1-RPM-275(DIRECT_ACTIVE): 정의역과 치역/그래프 위치"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "유리함수 그래프 해석과 무리함수의 제한 구간 최댓값·최솟값을 순차 연결한 표준 문항이다.", "level": "중", "item4slot": {"format": "서술", "slots": {"given": ["유리함수", "그래프", "무리함수"], "goal": ["최솟값", "최댓값"], "method": ["점근선", "대입"], "condition": ["구간"]}}, "hold": ""}
```

## Q23

- 형식: 서답형  
- 배점: 5

### 발문

\[서술형3\] 서로 다른 두 개의 주사위를 동시에 던져서 나오는 눈의 수를 각각 \$a, b\$라 할 때, \$x\$에 대한 이차방정식 \$x^2 \+ ax \+ 2b \= 0\$이 실근을 갖지 않도록 하는 \$a, b\$의 모든 순서쌍 \$(a, b)\$의 개수를 구하는 풀이 과정과 답을 쓰시오. \[5점\]

### 선지

없음

### 정답

\$26\$

### 해설

이차방정식 \$x^2 \+ ax \+ 2b \= 0\$이 실근을 갖지 않으려면 판별식 \$D \< 0\$이어야 한다. \$D \= a^2 - 8b \< 0 \\implies b \> \\dfrac{a^2}{8}\$ \$1 \\le a, b \\le 6\$인 자연수 \$a\$의 값에 따라 가능한 \$b\$의 개수를 세면 • \$a \= 1\$일 때: \$b \> \\dfrac{1}{8}\$이므로 \$b \= 1, 2, 3, 4, 5, 6\$ (\$6\$개) • \$a \= 2\$일 때: \$b \> \\dfrac{1}{2}\$이므로 \$b \= 1, 2, 3, 4, 5, 6\$ (\$6\$개) • \$a \= 3\$일 때: \$b \> \\dfrac{9}{8}\$이므로 \$b \= 2, 3, 4, 5, 6\$ (\$5\$개) • \$a \= 4\$일 때: \$b \> 2\$이므로 \$b \= 3, 4, 5, 6\$ (\$4\$개) • \$a \= 5\$일 때: \$b \> \\dfrac{25}{8}\$이므로 \$b \= 4, 5, 6\$ (\$3\$개) • \$a \= 6\$일 때: \$b \> \\dfrac{36}{8} \= 4.5\$이므로 \$b \= 5, 6\$ (\$2\$개) 따라서 순서쌍 \$(a, b)\$의 개수는 \$6 \+ 6 \+ 5 \+ 4 \+ 3 \+ 2 \= 26\$

```
{"status": "EXEMPT", "reason": "주사위 눈의 경우를 $a=1\\sim 6$으로 분류하여 직접 세는 문항이므로 그림이 필요하지 않다."}
```

```
{"sourceQid": 23, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-06", "subUnitKey": "H15-SB-06-COUNTING_PRINCIPLE", "conceptClusterKey": "", "primaryMethod": "이차방정식의 허근 조건 $D=a^2-8b<0$을 세운 뒤 $a=1$부터 $6$까지 나누어 만족하는 주사위 눈 $b$의 개수를 센다.", "decisiveStep": "$b > \\frac{a^2}{8}$ 부등식에 $a=1\\sim 6$을 대입해 각 경우의 $b$ 개수를 합산한다.", "rpm": {"majorUnit": "경우의 수", "midUnit": "경우의 수와 순열", "l3": "합·곱의 법칙", "l4": "경우를 나누어 세기"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COUNTING_PRINCIPLE_GENERAL", "templateKey": "TPL_H1_COUNTING_DIRECT_CASE", "why": "high1.json H1-RPM-122(DIRECT_ACTIVE): 합·곱의 법칙/경우를 나누어 세기"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "CASE_BRANCH", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "판별식 조건을 부등식으로 세우고 6가지 경우로 나누어 빠짐없이 세어야 하는 문항이다.", "level": "중", "item4slot": {"format": "서술", "slots": {"given": ["이차방정식"], "goal": ["순서쌍", "개수"], "method": ["판별식", "경우분류"], "condition": ["자연수", "구간"]}}, "hold": ""}
```

## Q24

- 형식: 서답형  
- 배점: 5

### 발문

\[서술형4\] 함수 \$y \= \\sqrt{4x - 8}\$의 그래프와 직선 \$y \= ax \+ 1\$이 만나도록 하는 실수 \$a\$의 값의 범위를 구하는 풀이 과정과 답을 쓰시오. \[5점\]

### 선지

없음

### 정답

\$-\\dfrac{1}{2} \\le a \\le \\dfrac{1}{2}\$

### 해설

무리함수 \$y \= \\sqrt{4(x - 2)}\$의 그래프의 시작점은 \$(2, 0)\$이고, 직선 \$y \= ax \+ 1\$은 \$a\$의 값에 관계없이 항상 점 \$(0, 1)\$을 지난다. (1) 직선이 시작점 \$(2, 0)\$을 지날 때: \$0 \= 2a \+ 1 \\implies a \= \-\\dfrac{1}{2}\$ (2) 직선이 무리함수의 그래프에 접할 때 (\$a \> 0\$): \$\\sqrt{4x - 8} \= ax \+ 1\$의 양변을 제곱하면 \$a^2 x^2 \+ (2a - 4)x \+ 9 \= 0\$ 판별식 \$\\dfrac{D}{4} \= (a - 2)^2 - 9a^2 \= \-8a^2 - 4a \+ 4 \= \-4(2a - 1)(a \+ 1\) \= 0\$ \$a \> 0\$이므로 \$a \= \\dfrac{1}{2}\$ (접점 \$x \= 6 \\ge 2\$ 확인) 또한 \$a \= 0\$일 때 직선 \$y \= 1\$은 점 \$\\left(\\dfrac{9}{4}, 1\\right)\$에서 그래프와 만난다. 따라서 구하는 실수 \$a\$의 값의 범위는 \$-\\dfrac{1}{2} \\le a \\le \\dfrac{1}{2}\$

```
{"question": {"status": "EXEMPT", "reason": "발문에 그림이 없는 무리함수와 직선의 위치 관계 문항이다."}, "solution": {"capability": "multi-curve-figure-v1", "graphPlan": {"family": "multi-curve", "curves": [{"id": "f", "kind": "SQRT", "radicand": ["-8", "4"], "amplitude": "1", "sign": 1, "offset": "0", "domain": ["2", "8"]}], "overlays": {"lines": [{"id": "l1", "slope": "-1/2", "intercept": "1"}, {"id": "l2", "slope": "1/2", "intercept": "1"}], "points": [{"id": "S", "x": "2", "y": "0", "label": "S"}, {"id": "P", "x": "0", "y": "1", "label": "P"}, {"id": "T", "x": "6", "y": "4", "label": "T"}]}, "axisTickValues": {"x": ["2", "6"], "y": ["1", "4"]}}, "caption": "정점 P(0,1)을 지나는 직선 y=ax+1이 시작점 S(2,0)을 지날 때(a=-1/2)와 접할 때(a=1/2)의 경계이다."}}
```

```
{"sourceQid": 24, "variationType": "NUMERIC", "standardCourse": "수학(하)", "courseKey": "H15-SB", "curriculum": "2015", "standardUnitKey": "H15-SB-05", "subUnitKey": "H15-SB-05-IRRATIONAL_BASIC", "conceptClusterKey": "", "primaryMethod": "정점 $(0,1)$을 지나는 직선이 무리함수의 시작점 $(2,0)$을 지날 때와 곡선에 접할 때($D=0$)의 기울기를 경계로 구한다.", "decisiveStep": "시작점 통과 조건 $a=-\\frac{1}{2}$과 접선 판별식 $D=0$($a=\\frac{1}{2}$)을 구해 사이의 범위를 확정한다.", "rpm": {"majorUnit": "함수", "midUnit": "무리함수", "l3": "무리함수의 활용", "l4": "무리함수의 교점"}, "ptTplCandidate": {"problemTypeKey": "PT_FUNCTION_GRAPH_INTERSECTION", "templateKey": "TPL_FUNCTION_INTERSECTION_TWO_FUNCTIONS", "why": "high1.json H1-RPM-121(DIRECT_ACTIVE): 무리함수의 활용/무리함수의 교점"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "CASE_BRANCH", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "무리함수와 회전하는 직선의 교점 존재 범위를 시작점 경계와 접선 경계 두 경우로 나누어 판정하는 준고난도 문항이다.", "level": "상", "item4slot": {"format": "서술", "slots": {"given": ["무리함수", "직선"], "goal": ["기울기", "범위"], "method": ["판별식", "접선", "경우분류"], "condition": ["실수"]}}, "hold": ""}
```

