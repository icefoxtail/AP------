

```
{"stem": "25_효천고_1학기_중간_고2_확률과통계_유사", "sourceArchiveFile": "original/high/h2/1mid/25_효천고_1학기_중간_고2_확률과통계.js", "examFolder": "1mid", "grade": "고2", "subject": "확률과 통계", "curriculum": "2022", "questionCount": 23, "totalScore": 100, "generatedAt": "2026-11-20"}
```

## Q01

- 형식: 객관식  
- 배점: 3.5

### 발문

정팔각형 모양의 탁자에 \$8\$명이 둘러앉는 경우의 수를 구하면? (단, 회전하여 일치하는 것은 같은 것으로 본다.)

### 선지

① \$5\!\$ ② \$6\!\$ ③ \$7\!\$ ④ \$8\!\$ ⑤ \$9\!\$

### 정답

③

### 해설

정팔각형 모양의 탁자는 \$8\$개의 자리가 회전 대칭을 이루므로 \$8\$명의 원순열의 수와 같다.

\$\$(8-1)\! \= 7\!\$\$

따라서 정답은 ③이다.

```
{"figureType": "polygon_table_seats", "description": "각 변 바깥쪽에 1명씩 총 8명이 앉을 수 있는 정팔각형 모양의 탁자", "elements": ["regular octagon", "8 seat circles around the perimeter"]}
```

```
{"sourceQid": "Q01", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H22-PS", "curriculum": "2022", "standardUnitKey": "H22-PS-01", "subUnitKey": "H22-PS-01-CORE", "conceptClusterKey": "COMBINATORICS", "primaryMethod": "정팔각형 탁자의 8회전 대칭에 원순열 공식 (8-1)!=7! 적용", "decisiveStep": "(8-1)! = 7!", "rpm": {"majorUnit": "경우의 수", "midUnit": "순열과 조합", "l3": "순열", "l4": "중복·원순열"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_ARRANGEMENT", "templateKey": null, "why": "순열 > 중복·원순열 (FAMILY_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "정다각형 탁자의 회전 대칭에 원순열 공식을 직접 대입하는 기초 문항이다.", "level": "중", "item4slot": {"given": ["집합"], "goal": ["개수"], "method": ["원순열"], "condition": []}, "hold": ""}
```

## Q02

- 형식: 객관식  
- 배점: 3.6

### 발문

\${}*{4}\\mathrm{H}*{n} \= 35\$일 때, 자연수 \$n\$의 값은?

### 선지

① \$3\$ ② \$4\$ ③ \$5\$ ④ \$6\$ ⑤ \$7\$

### 정답

②

### 해설

중복조합의 정의에 의하여 \${}*{4}\\mathrm{H}*{n} \= {}*{4+n-1}\\mathrm{C}*{n} \= {}*{n+3}\\mathrm{C}*{3}\$이다.

\$\$\\begin{aligned} {}*{n+3}\\mathrm{C}*{3} &= \\frac{(n+3)(n+2)(n+1)}{3\\times 2\\times 1} \= 35 \\ (n+3)(n+2)(n+1) &= 210 \= 7 \\times 6 \\times 5 \\end{aligned}\$\$

따라서 \$n+1 \= 5\$이므로 \$n \= 4\$이다. 정답은 ②이다.

```
"NONE"
```

```
{"sourceQid": "Q02", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H22-PS", "curriculum": "2022", "standardUnitKey": "H22-PS-01", "subUnitKey": "H22-PS-01-CORE", "conceptClusterKey": "COMBINATORICS", "primaryMethod": "4Hn을 (n+3)C3으로 변환하여 연속한 세 자연수의 곱 (n+3)(n+2)(n+1)=210에서 n=4 도출", "decisiveStep": "(n+3)C3 = 35 -> (n+3)(n+2)(n+1) = 7*6*5", "rpm": {"majorUnit": "경우의 수", "midUnit": "순열과 조합", "l3": "중복조합", "l4": "중복을 허용한 선택"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_SELECTION_DISTRIBUTION", "templateKey": "TPL_REPEATED_COMBINATION_DISTRIBUTION", "why": "중복조합 > 중복을 허용한 선택 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "중복조합을 조합으로 고쳐 방정식을 푸는 기본 계산 문항이다.", "level": "하", "item4slot": {"given": ["방정식", "자연수"], "goal": ["값"], "method": ["중복조합", "조합"], "condition": []}, "hold": ""}
```

## Q03

- 형식: 객관식  
- 배점: 3.6

### 발문

그림과 같이 직사각형 모양으로 연결된 도로망이 있다. 이 도로망을 따라 \$\\mathrm{A}\$지점에서 출발하여 \$\\mathrm{P}\$지점을 거쳐 \$\\mathrm{B}\$지점까지 최단 거리로 가는 경우의 수는?

### 선지

① \$12\$ ② \$16\$ ③ \$18\$ ④ \$20\$ ⑤ \$24\$

### 정답

⑤

### 해설

이동을 \$\\mathrm{A} \\to \\mathrm{P}\$와 \$\\mathrm{P} \\to \\mathrm{B}\$의 두 단계로 나눈다.

1. \$\\mathrm{A}\$에서 \$\\mathrm{P}\$까지(오른쪽 \$2\$칸, 위쪽 \$2\$칸): \$\\dfrac{4\!}{2\!,2\!} \= 6\$가지  
2. \$\\mathrm{P}\$에서 \$\\mathrm{B}\$까지(오른쪽 \$3\$칸, 위쪽 \$1\$칸): \$\\dfrac{4\!}{3\!,1\!} \= 4\$가지

곱의 법칙에 의하여 구하는 경우의 수는 \$6 \\times 4 \= 24\$이다. 정답은 ⑤이다.

```
{"figureType": "grid_shortest_path", "description": "가로 5칸, 세로 3칸의 직사각형 도로망에서 왼쪽 아래 A(0,0), 중간 P(2,2), 오른쪽 위 B(5,3)가 표시된 그림", "elements": ["5x3 rectangular grid", "point A at (0,0)", "point P at (2,2)", "point B at (5,3)"]}
```

```
{"sourceQid": "Q03", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H22-PS", "curriculum": "2022", "standardUnitKey": "H22-PS-01", "subUnitKey": "H22-PS-01-CORE", "conceptClusterKey": "COMBINATORICS", "primaryMethod": "A->P 최단경로 4!/(2!2!)=6과 P->B 최단경로 4!/(3!1!)=4를 곱의 법칙으로 결합해 24 계산", "decisiveStep": "4!/(2!2!) * 4!/(3!1!) = 6 * 4 = 24", "rpm": {"majorUnit": "경우의 수", "midUnit": "순열과 조합", "l3": "순열", "l4": "일렬 배열"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_ARRANGEMENT", "templateKey": "TPL_PERMUTATION_STANDARD_CONSTRAINT", "why": "순열 > 일렬 배열 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "경유점 P를 기준으로 두 구간의 최단 경로를 같은 것이 있는 순열로 각각 세어 곱하는 문항이다.", "level": "중", "item4slot": {"given": ["직사각형"], "goal": ["개수"], "method": ["같은것이있는순열", "곱의법칙"], "condition": ["최단거리"]}, "hold": ""}
```

## Q04

- 형식: 객관식  
- 배점: 3.7

### 발문

원소가 \$9\$개인 집합 \$A\$의 부분집합 중에서 원소의 개수가 짝수인 것의 개수는? (단, 공집합도 원소의 개수가 \$0\$개인 부분집합으로 포함한다.)

### 선지

① \$256\$ ② \$64\$ ③ \$128\$ ④ \$512\$ ⑤ \$1024\$

### 정답

①

### 해설

원소가 \$9\$개인 집합에서 원소의 개수가 짝수인 부분집합의 개수는 이항계수의 성질에 의하여 다음과 같다.

\$\${}*{9}\\mathrm{C}*{0} \+ {}*{9}\\mathrm{C}*{2} \+ {}*{9}\\mathrm{C}*{4} \+ {}*{9}\\mathrm{C}*{6} \+ {}*{9}\\mathrm{C}*{8} \= 2^{9-1} \= 2^8 \= 256\$\$

따라서 정답은 ①이다.

```
"NONE"
```

```
{"sourceQid": "Q04", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H22-PS", "curriculum": "2022", "standardUnitKey": "H22-PS-02", "subUnitKey": "H22-PS-02-CORE", "conceptClusterKey": "BINOMIAL_THEOREM", "primaryMethod": "9개 원소 집합의 짝수 번째 이항계수 합 9C0+9C2+9C4+9C6+9C8에 성질 2^(n-1)을 적용해 256 산출", "decisiveStep": "짝수 번째 이항계수의 합 = 2^(9-1) = 256", "rpm": {"majorUnit": "경우의 수", "midUnit": "이항정리", "l3": "이항계수", "l4": "이항계수의 성질"}, "ptTplCandidate": {"problemTypeKey": "PT_BINOMIAL_THEOREM", "templateKey": "TPL_BINOMIAL_COEFFICIENT_IDENTITY", "why": "이항계수 > 이항계수의 성질 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "부분집합의 개수와 이항계수 홀짝 합 공식 2^(n-1)을 연결하는 문항이다.", "level": "중", "item4slot": {"given": ["집합", "원소"], "goal": ["개수"], "method": ["이항정리", "조합"], "condition": ["부분집합", "짝수"]}, "hold": ""}
```

## Q05

- 형식: 객관식  
- 배점: 3.7

### 발문

\${}*{n}\\mathrm{C}*{0} \+ {}*{n}\\mathrm{C}*{1} \+ {}*{n+1}\\mathrm{C}*{2} \+ {}*{n+2}\\mathrm{C}*{3} \+ {}*{n+3}\\mathrm{C}*{4} \+ {}*{n+4}\\mathrm{C}*{5} \= {}*{12}\\mathrm{C}*{5}\$일 때, 등식을 만족시키는 자연수 \$n\$의 값은?

### 선지

① \$4\$ ② \$5\$ ③ \$6\$ ④ \$7\$ ⑤ \$8\$

### 정답

④

### 해설

파스칼의 삼각형 성질 \${}*{k}\\mathrm{C}*{r-1} \+ {}*{k}\\mathrm{C}*{r} \= {}*{k+1}\\mathrm{C}*{r}\$를 왼쪽부터 차례대로 적용한다.

\$\$\\begin{aligned} {}*{n}\\mathrm{C}*{0} \+ {}*{n}\\mathrm{C}*{1} &= {}*{n+1}\\mathrm{C}*{1} \\ {}*{n+1}\\mathrm{C}*{1} \+ {}*{n+1}\\mathrm{C}*{2} &= {}*{n+2}\\mathrm{C}*{2} \\ {}*{n+2}\\mathrm{C}*{2} \+ {}*{n+2}\\mathrm{C}*{3} &= {}*{n+3}\\mathrm{C}*{3} \\ {}*{n+3}\\mathrm{C}*{3} \+ {}*{n+3}\\mathrm{C}*{4} &= {}*{n+4}\\mathrm{C}*{4} \\ {}*{n+4}\\mathrm{C}*{4} \+ {}*{n+4}\\mathrm{C}*{5} &= {}*{n+5}\\mathrm{C}*{5} \\end{aligned}\$\$

즉 \${}*{n+5}\\mathrm{C}*{5} \= {}*{12}\\mathrm{C}*{5}\$이고 \$n\$은 자연수이므로 \$n+5 \= 12\$, 따라서 \$n \= 7\$이다. 정답은 ④이다.

```
"NONE"
```

```
{"sourceQid": "Q05", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H22-PS", "curriculum": "2022", "standardUnitKey": "H22-PS-02", "subUnitKey": "H22-PS-02-CORE", "conceptClusterKey": "BINOMIAL_THEOREM", "primaryMethod": "파스칼 항등식 kC(r-1)+kCr=(k+1)Cr을 연쇄 적용해 좌변을 (n+5)C5로 축약하여 n=7 산출", "decisiveStep": "연쇄 축약 결과 (n+5)C5 = 12C5", "rpm": {"majorUnit": "경우의 수", "midUnit": "이항정리", "l3": "이항계수", "l4": "조합 항등식"}, "ptTplCandidate": {"problemTypeKey": "PT_BINOMIAL_THEOREM", "templateKey": "TPL_BINOMIAL_COEFFICIENT_IDENTITY", "why": "이항계수 > 조합 항등식 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "파스칼 삼각형의 조합 항등식을 여러 단계 연쇄 적용해야 미지수 n을 구할 수 있는 문항이다.", "level": "상", "item4slot": {"given": ["방정식", "자연수"], "goal": ["값"], "method": ["파스칼의삼각형", "조합"], "condition": []}, "hold": ""}
```

## Q06

- 형식: 객관식  
- 배점: 3.8

### 발문

\$\\left(2x^2 - \\dfrac{1}{x^3}\\right)^5\$의 전개식에서 상수항은?

### 선지

① \$80\$ ② \$-80\$ ③ \$40\$ ④ \$-40\$ ⑤ \$160\$

### 정답

①

### 해설

이항정리의 일반항은 다음과 같다.

\$\${}*{5}\\mathrm{C}*{r} (2x^2)^{5-r} \\left(-\\frac{1}{x^3}\\right)^r \= {}*{5}\\mathrm{C}*{r} \\cdot 2^{5-r} (-1)^r x^{10-5r}\$\$

상수항이 되려면 \$x\$의 지수가 \$0\$이어야 하므로 \$10 - 5r \= 0\$, 즉 \$r \= 2\$이다.

\$\${}*{5}\\mathrm{C}*{2} \\cdot 2^{3} \\cdot (-1)^2 \= 10 \\times 8 \\times 1 \= 80\$\$

따라서 정답은 ①이다.

```
"NONE"
```

```
{"sourceQid": "Q06", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H22-PS", "curriculum": "2022", "standardUnitKey": "H22-PS-02", "subUnitKey": "H22-PS-02-CORE", "conceptClusterKey": "BINOMIAL_THEOREM", "primaryMethod": "일반항 5Cr*(2x^2)^(5-r)*(-x^-3)^r에서 x 지수 10-5r=0을 풀어 r=2를 구하고 계수 80 계산", "decisiveStep": "10 - 5r = 0 -> r = 2 대입", "rpm": {"majorUnit": "경우의 수", "midUnit": "이항정리", "l3": "이항정리", "l4": "특정 항의 계수"}, "ptTplCandidate": {"problemTypeKey": "PT_BINOMIAL_THEOREM", "templateKey": "TPL_BINOMIAL_TERM_COEFFICIENT", "why": "이항정리 > 특정 항의 계수 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "분수식이 포함된 이항전개식의 일반항에서 지수 방정식을 세워 상수항을 찾는 표준 문항이다.", "level": "중", "item4slot": {"given": ["다항식"], "goal": ["상수항"], "method": ["이항정리"], "condition": []}, "hold": ""}
```

## Q07

- 형식: 객관식  
- 배점: 4

### 발문

\$21^{18}\$을 \$100\$으로 나눈 나머지는?

### 선지

① \$21\$ ② \$31\$ ③ \$41\$ ④ \$51\$ ⑤ \$61\$

### 정답

⑤

### 해설

\$21^{18} \= (1+20)^{18}\$을 이항정리로 전개하면 다음과 같다.

\$\$(1+20)^{18} \= {}*{18}\\mathrm{C}*{0} \+ {}*{18}\\mathrm{C}*{1}\\cdot 20 \+ {}*{18}\\mathrm{C}*{2}\\cdot 20^2 \+ \\cdots \+ {}*{18}\\mathrm{C}*{18}\\cdot 20^{18}\$\$

세 번째 항부터는 \$20^2 \= 400\$을 인수로 가지므로 모두 \$100\$으로 나누어떨어진다. 따라서 구하는 나머지는 앞의 두 항의 합을 \$100\$으로 나눈 나머지와 같다.

\$\${}*{18}\\mathrm{C}*{0} \+ {}*{18}\\mathrm{C}*{1}\\cdot 20 \= 1 \+ 18 \\times 20 \= 361\$\$

\$361 \= 100 \\times 3 \+ 61\$이므로 나머지는 \$61\$이다. 정답은 ⑤이다.

```
"NONE"
```

```
{"sourceQid": "Q07", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H22-PS", "curriculum": "2022", "standardUnitKey": "H22-PS-02", "subUnitKey": "H22-PS-02-CORE", "conceptClusterKey": "BINOMIAL_THEOREM", "primaryMethod": "21^18=(1+20)^18 전개식에서 20^2=400 이상 항을 100의 배수로 소거해 1+360=361의 나머지 61 산출", "decisiveStep": "(1+20)^18 ≡ 1 + 18*20 = 361 (mod 100)", "rpm": {"majorUnit": "경우의 수", "midUnit": "이항정리", "l3": "이항정리", "l4": "전개식의 항"}, "ptTplCandidate": {"problemTypeKey": "PT_BINOMIAL_THEOREM", "templateKey": "TPL_BINOMIAL_TERM_COEFFICIENT", "why": "이항정리 > 전개식의 항 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "거듭제곱을 (1+20)^18 형태로 분해한 뒤 제수의 배수가 되는 고차항을 걸러내야 하는 응용 문항이다.", "level": "상", "item4slot": {"given": ["자연수"], "goal": ["나머지"], "method": ["이항정리"], "condition": []}, "hold": ""}
```

## Q08

- 형식: 객관식  
- 배점: 4.1

### 발문

여섯 개의 숫자 \$0, 1, 1, 1, 4, 4\$를 모두 사용하여 만들 수 있는 여섯 자리 자연수의 개수는?

### 선지

① \$40\$ ② \$50\$ ③ \$60\$ ④ \$70\$ ⑤ \$80\$

### 정답

②

### 해설

전체 \$6\$개의 숫자를 일렬로 나열하는 경우의 수는 다음과 같다.

\$\$\\frac{6\!}{3\!,2\!} \= \\frac{720}{6 \\times 2} \= 60\$\$

이 중 맨 앞자리에 \$0\$이 오는 경우의 수는 나머지 \$5\$개의 숫자 \$1, 1, 1, 4, 4\$를 나열하는 경우의 수와 같다.

\$\$\\frac{5\!}{3\!,2\!} \= \\frac{120}{6 \\times 2} \= 10\$\$

따라서 여섯 자리 자연수의 개수는 \$60 - 10 \= 50\$이다. 정답은 ②이다.

```
"NONE"
```

```
{"sourceQid": "Q08", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H22-PS", "curriculum": "2022", "standardUnitKey": "H22-PS-01", "subUnitKey": "H22-PS-01-CORE", "conceptClusterKey": "COMBINATORICS", "primaryMethod": "전체 같은 것이 있는 순열 6!/(3!2!)=60에서 맨 앞자리 0인 5!/(3!2!)=10을 빼서 50 산출", "decisiveStep": "6!/(3!2!) - 5!/(3!2!) = 60 - 10 = 50", "rpm": {"majorUnit": "경우의 수", "midUnit": "순열과 조합", "l3": "순열", "l4": "일렬 배열"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_ARRANGEMENT", "templateKey": "TPL_PERMUTATION_STANDARD_CONSTRAINT", "why": "순열 > 일렬 배열 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "0을 포함한 중복 숫자의 일렬 배열에서 최고차 자릿수 0 제외 여사건을 적용하는 문항이다.", "level": "상", "item4slot": {"given": ["자연수"], "goal": ["개수"], "method": ["같은것이있는순열", "여사건"], "condition": []}, "hold": ""}
```

## Q09

- 형식: 객관식  
- 배점: 4.2

### 발문

\$10\$등분된 원판에 빨강, 주황, 노랑, 초록, 파랑, 보라, 남색, 분홍의 \$8\$가지 색을 모두 사용하여 영역을 구분하려고 한다. 그림과 같이 빨강, 주황 두 가지 색은 각각 마주 보는 두 영역에 이미 칠해져 있을 때, 칠해져 있지 않은 \$6\$개의 영역에 남은 \$6\$가지 색을 칠할 수 있는 방법의 수는? (단, 한 영역에는 한 가지 색을 칠하고, 회전하여 같은 경우에는 한 가지 방법으로 한다.)

### 선지

① \$120\$ ② \$180\$ ③ \$240\$ ④ \$360\$ ⑤ \$720\$

### 정답

④

### 해설

그림에서 빨강(\$2\$칸)과 주황(\$2\$칸)은 원판의 중심에 대하여 서로 마주 보는 위치에 칠해져 있으므로 원판은 \$180^\\circ\$ 회전할 때마다 자기 자신과 일치하는 \$2\$회 회전 대칭성을 갖는다.

남은 \$6\$개의 빈 영역에 서로 다른 \$6\$가지 색을 일렬로 배치하는 경우는 \$6\! \= 720\$가지이고, \$180^\\circ\$ 회전에 의하여 \$2\$가지씩 같아지므로 구하는 방법의 수는 다음과 같다.

\$\$\\frac{6\!}{2} \= \\frac{720}{2} \= 360\$\$

따라서 정답은 ④이다.

```
{"figureType": "partitioned_disk_symmetry", "description": "10등분된 원판에서 중심을 기준으로 서로 마주 보는 두 쌍의 부채꼴에 각각 빨강, 주황이 칠해져 있고 나머지 6칸은 비어 있는 그림", "elements": ["circle divided into 10 equal sectors", "two opposite sectors labeled 빨강", "two opposite sectors labeled 주황", "6 blank sectors"]}
```

```
{"sourceQid": "Q09", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H22-PS", "curriculum": "2022", "standardUnitKey": "H22-PS-01", "subUnitKey": "H22-PS-01-CORE", "conceptClusterKey": "COMBINATORICS", "primaryMethod": "180도 대칭으로 이미 칠해진 빨강·주황 배치를 기준으로 남은 6칸 직순열 6!을 대칭수 2로 나누어 360 산출", "decisiveStep": "6! / 2 = 360", "rpm": {"majorUnit": "경우의 수", "midUnit": "순열과 조합", "l3": "순열", "l4": "중복·원순열"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_ARRANGEMENT", "templateKey": null, "why": "순열 > 중복·원순열 (FAMILY_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이미 색칠된 영역이 만든 2회 회전 대칭성을 읽어내어 남은 영역의 순열을 나누어야 하는 문항이다.", "level": "중", "item4slot": {"given": ["원", "대칭성"], "goal": ["개수"], "method": ["원순열", "순열"], "condition": []}, "hold": ""}
```

## Q10

- 형식: 객관식  
- 배점: 4.2

### 발문

숫자 \$1, 2, 3, 3, 3, 3, 5\$가 하나씩 적힌 \$7\$장의 카드를 모두 한 번씩 사용하여 일렬로 나열할 때, \$1\$이 적힌 카드와 \$2\$가 적힌 카드 사이에 한 장 이상의 카드가 있도록 나열하는 경우의 수는?

### 선지

① \$120\$ ② \$140\$ ③ \$150\$ ④ \$180\$ ⑤ \$210\$

### 정답

③

### 해설

\$7\$장의 카드를 모두 일렬로 나열하는 전체 경우의 수는 다음과 같다.

\$\$\\frac{7\!}{4\!} \= 7 \\times 6 \\times 5 \= 210\$\$

여사건은 \$1\$과 \$2\$가 적힌 카드가 서로 이웃하는 경우이므로, \$1\$과 \$2\$를 한 묶음으로 보아 전체 \$6\$개를 나열한 뒤 묶음 내부를 배열한다.

\$\$\\frac{6\!}{4\!} \\times 2\! \= 30 \\times 2 \= 60\$\$

따라서 구하는 경우의 수는 \$210 - 60 \= 150\$이다. 정답은 ③이다.

```
"NONE"
```

```
{"sourceQid": "Q10", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H22-PS", "curriculum": "2022", "standardUnitKey": "H22-PS-01", "subUnitKey": "H22-PS-01-CORE", "conceptClusterKey": "COMBINATORICS", "primaryMethod": "전체 순열 7!/4!=210에서 1과 2가 이웃하는 여사건 2*6!/4!=60을 빼서 150 계산", "decisiveStep": "7!/4! - 2*(6!/4!) = 210 - 60 = 150", "rpm": {"majorUnit": "경우의 수", "midUnit": "순열과 조합", "l3": "순열", "l4": "일렬 배열"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_ARRANGEMENT", "templateKey": "TPL_PERMUTATION_STANDARD_CONSTRAINT", "why": "순열 > 일렬 배열 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "같은 것이 있는 순열에서 '사이에 한 장 이상' 조건을 여사건(이웃)으로 전환해 푸는 문항이다.", "level": "상", "item4slot": {"given": ["자연수"], "goal": ["개수"], "method": ["같은것이있는순열", "여사건"], "condition": ["이웃"]}, "hold": ""}
```

## Q11

- 형식: 객관식  
- 배점: 4.4

### 발문

방정식 \$x+y+z=17\$에서 \$x \\ge 3,\\ y \\ge 2,\\ z \\ge 4\$를 만족시키는 정수해의 개수는?

### 선지

① \$45\$ ② \$28\$ ③ \$36\$ ④ \$55\$ ⑤ \$66\$

### 정답

①

### 해설

\$x' \= x-3,\\ y' \= y-2,\\ z' \= z-4\$라 하면 \$x',\\ y',\\ z'\$은 모두 음이 아닌 정수이다.

\$\$(x'+3)+(y'+2)+(z'+4) \= 17 \\implies x'+y'+z' \= 8\$\$

따라서 구하는 정수해의 개수는 다음과 같다.

\$\${}*{3}\\mathrm{H}*{8} \= {}*{10}\\mathrm{C}*{8} \= {}*{10}\\mathrm{C}*{2} \= \\frac{10 \\times 9}{2} \= 45\$\$

정답은 ①이다.

```
"NONE"
```

```
{"sourceQid": "Q11", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H22-PS", "curriculum": "2022", "standardUnitKey": "H22-PS-01", "subUnitKey": "H22-PS-01-CORE", "conceptClusterKey": "COMBINATORICS", "primaryMethod": "x'=x-3, y'=y-2, z'=z-4 치환으로 x'+y'+z'=8을 만들어 3H8=10C2=45 계산", "decisiveStep": "x'+y'+z' = 8 -> 3H8 = 45", "rpm": {"majorUnit": "경우의 수", "midUnit": "순열과 조합", "l3": "중복조합", "l4": "정수해 개수"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_SELECTION_DISTRIBUTION", "templateKey": "TPL_REPEATED_COMBINATION_DISTRIBUTION", "why": "중복조합 > 정수해 개수 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "하한 조건이 각각 다른 일차부정방정식을 치환해 음이 아닌 정수해 중복조합으로 바꾸는 문항이다.", "level": "상", "item4slot": {"given": ["방정식", "부등식"], "goal": ["정수해", "개수"], "method": ["중복조합"], "condition": []}, "hold": ""}
```

## Q12

- 형식: 객관식  
- 배점: 4.4

### 발문

자연수 \$n\$에 대하여 \$\${}*{n}\\mathrm{C}*{0} \+ {}*{n}\\mathrm{C}*{1}\\times 15 \+ {}*{n}\\mathrm{C}*{2}\\times 15^2 \+ {}*{n}\\mathrm{C}*{3}\\times 15^3 \+ \\cdots \+ {}*{n}\\mathrm{C}*{n}\\times 15^n \= 2^{48}\$\$ 을 만족시키는 \$n\$의 값은?

### 선지

① \$10\$ ② \$12\$ ③ \$14\$ ④ \$16\$ ⑤ \$18\$

### 정답

②

### 해설

주어진 식의 좌변은 \$(1+15)^n\$의 이항정리 전개식이다.

\$\$(1+15)^n \= 16^n \= (2^4)^n \= 2^{4n}\$\$

이 값이 \$2^{48}\$과 같으므로 \$4n \= 48\$, 즉 \$n \= 12\$이다. 정답은 ②이다.

```
"NONE"
```

```
{"sourceQid": "Q12", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H22-PS", "curriculum": "2022", "standardUnitKey": "H22-PS-02", "subUnitKey": "H22-PS-02-CORE", "conceptClusterKey": "BINOMIAL_THEOREM", "primaryMethod": "좌변 급수를 이항정리로 (1+15)^n=2^(4n)으로 묶어 지수 비교 4n=48에서 n=12 도출", "decisiveStep": "(1+15)^n = 2^(4n) = 2^48", "rpm": {"majorUnit": "경우의 수", "midUnit": "이항정리", "l3": "이항계수", "l4": "이항계수의 성질"}, "ptTplCandidate": {"problemTypeKey": "PT_BINOMIAL_THEOREM", "templateKey": "TPL_BINOMIAL_COEFFICIENT_IDENTITY", "why": "이항계수 > 이항계수의 성질 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "가중치가 붙은 이항계수의 합을 (1+x)^n 형태로 역변환하는 기본 응용 문항이다.", "level": "상", "item4slot": {"given": ["방정식", "자연수"], "goal": ["값"], "method": ["이항정리"], "condition": []}, "hold": ""}
```

## Q13

- 형식: 객관식  
- 배점: 4.6

### 발문

다음 조건을 만족시키는 음이 아닌 정수 \$a, b, c, d\$의 모든 순서쌍 \$(a, b, c, d)\$의 개수는?

(가) \$a+b+c-d=9\$ (나) \$d \\le 4\$이고 \$c \\ge d+2\$이다.

### 선지

① \$144\$ ② \$150\$ ③ \$165\$ ④ \$180\$ ⑤ \$225\$

### 정답

④

### 해설

조건 (나)에서 \$c \\ge d+2\$이므로 \$c' \= c - (d+2)\$라 두면 \$c' \\ge 0\$이고 \$c \= c' \+ d \+ 2\$이다. 이를 조건 (가)에 대입하면 다음과 같다.

\$\$a \+ b \+ (c' \+ d \+ 2\) - d \= 9 \\implies a \+ b \+ c' \= 7\$\$

\$a, b, c'\$은 음이 아닌 정수이므로 \$d\$의 값에 관계없이 해의 개수는 다음과 같다.

\$\${}*{3}\\mathrm{H}*{7} \= {}*{9}\\mathrm{C}*{7} \= {}*{9}\\mathrm{C}*{2} \= \\frac{9 \\times 8}{2} \= 36\$\$

한편 \$d\$는 \$0 \\le d \\le 4\$인 정수이므로 \$0, 1, 2, 3, 4\$의 \$5\$가지 값을 가질 수 있다. 따라서 전체 순서쌍의 개수는 \$36 \\times 5 \= 180\$이다. 정답은 ④이다.

```
"NONE"
```

```
{"sourceQid": "Q13", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H22-PS", "curriculum": "2022", "standardUnitKey": "H22-PS-01", "subUnitKey": "H22-PS-01-CORE", "conceptClusterKey": "COMBINATORICS", "primaryMethod": "c'=c-(d+2) 치환으로 d를 소거해 a+b+c'=7의 해 3H7=36을 구하고 d의 5가지 경우를 곱해 180 산출", "decisiveStep": "a+b+c'=7 (3H7=36)과 d∈{0,1,2,3,4}의 독립 곱", "rpm": {"majorUnit": "경우의 수", "midUnit": "순열과 조합", "l3": "중복조합", "l4": "정수해 개수"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_SELECTION_DISTRIBUTION", "templateKey": "TPL_REPEATED_COMBINATION_DISTRIBUTION", "why": "중복조합 > 정수해 개수 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "부등식 조건 c>=d+2를 치환하면 방정식에서 d가 소거되어 중복조합과 곱의 법칙으로 분리되는 문항이다.", "level": "상", "item4slot": {"given": ["방정식", "부등식"], "goal": ["순서쌍", "개수"], "method": ["중복조합", "곱의법칙"], "condition": []}, "hold": ""}
```

## Q14

- 형식: 객관식  
- 배점: 4.6

### 발문

방정식 \$x+y+z+5w=16\$을 만족시키는 자연수 \$x, y, z, w\$의 모든 순서쌍 \$(x, y, z, w)\$의 개수는?

### 선지

① \$36\$ ② \$45\$ ③ \$50\$ ④ \$54\$ ⑤ \$55\$

### 정답

⑤

### 해설

계수가 가장 큰 자연수 \$w\$의 값에 따라 경우를 나눈다.

1. \$w \= 1\$일 때: \$x+y+z \= 11\$의 자연수해는 \$x'+y'+z' \= 8\$의 음이 아닌 정수해와 같으므로 \$\${}*{3}\\mathrm{H}*{8} \= {}*{10}\\mathrm{C}*{2} \= 45\$\$  
2. \$w \= 2\$일 때: \$x+y+z \= 6\$의 자연수해는 \$x'+y'+z' \= 3\$의 음이 아닌 정수해와 같으므로 \$\${}*{3}\\mathrm{H}*{3} \= {}*{5}\\mathrm{C}*{2} \= 10\$\$  
3. \$w \\ge 3\$일 때: \$x+y+z \\le 1\$이므로 자연수 \$x, y, z\$가 존재하지 않는다.

따라서 구하는 순서쌍의 개수는 \$45 \+ 10 \= 55\$이다. 정답은 ⑤이다.

```
"NONE"
```

```
{"sourceQid": "Q14", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H22-PS", "curriculum": "2022", "standardUnitKey": "H22-PS-01", "subUnitKey": "H22-PS-01-CORE", "conceptClusterKey": "COMBINATORICS", "primaryMethod": "계수가 큰 자연수 w를 1, 2로 분류해 각각 3H8=45와 3H3=10을 합산하여 55 계산", "decisiveStep": "w=1 (3H8=45) + w=2 (3H3=10) = 55", "rpm": {"majorUnit": "경우의 수", "midUnit": "순열과 조합", "l3": "중복조합", "l4": "정수해 개수"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_SELECTION_DISTRIBUTION", "templateKey": "TPL_REPEATED_COMBINATION_DISTRIBUTION", "why": "중복조합 > 정수해 개수 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "CASE_BRANCH", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "계수가 다른 미지수가 포함된 부정방정식에서 큰 계수 기준으로 케이스를 나누어 중복조합을 적용하는 문항이다.", "level": "상", "item4slot": {"given": ["방정식", "자연수"], "goal": ["순서쌍", "개수"], "method": ["중복조합", "합의법칙"], "condition": []}, "hold": ""}
```

## Q15

- 형식: 객관식  
- 배점: 4.6

### 발문

집합 \$A \= {1, 2, 3, 4, 5}\$에서 집합 \$B \= {3, 6, 9, 12, 15}\$로의 함수 중에서 다음 조건을 만족시키는 함수 \$f\$의 개수는?

(가) \$f(2) \\times f(4)\$는 \$18\$의 약수이다. (나) \$f(1) \\le 2f(2)\$

### 선지

① \$125\$ ② \$150\$ ③ \$200\$ ④ \$225\$ ⑤ \$250\$

### 정답

③

### 해설

집합 \$B\$의 두 원소를 곱하여 \$18\$의 약수(\$1, 2, 3, 6, 9, 18\$)가 되는 순서쌍 \$(f(2), f(4))\$는 \$(3, 3)\$, \$(3, 6)\$, \$(6, 3)\$의 \$3\$가지뿐이다.

1. \$(f(2), f(4)) \= (3, 3)\$일 때: \$f(1) \\le 6\$이므로 \$f(1) \\in {3, 6}\$ (\$2\$가지) 나머지 \$f(3), f(5)\$는 각각 \$5\$가지씩이므로 \$2 \\times 5 \\times 5 \= 50\$가지  
2. \$(f(2), f(4)) \= (3, 6)\$일 때: \$f(1) \\le 6\$이므로 \$2\$가지 따라서 \$2 \\times 5 \\times 5 \= 50\$가지  
3. \$(f(2), f(4)) \= (6, 3)\$일 때: \$f(1) \\le 12\$이므로 \$f(1) \\in {3, 6, 9, 12}\$ (\$4\$가지) 따라서 \$4 \\times 5 \\times 5 \= 100\$가지

전체 함수의 개수는 \$50 \+ 50 \+ 100 \= 200\$이다. 정답은 ③이다.

```
"NONE"
```

```
{"sourceQid": "Q15", "variationType": "CONDITION", "standardCourse": "확률과 통계", "courseKey": "H22-PS", "curriculum": "2022", "standardUnitKey": "H22-PS-01", "subUnitKey": "H22-PS-01-CORE", "conceptClusterKey": "COMBINATORICS", "primaryMethod": "f(2)f(4)가 18의 약수인 (3,3),(3,6),(6,3)별로 f(1)<=2f(2)와 f(3),f(5)의 자유도를 곱해 200 합산", "decisiveStep": "(f(2),f(4)) 3쌍 분류 후 50+50+100=200", "rpm": {"majorUnit": "경우의 수", "midUnit": "순열과 조합", "l3": "순열", "l4": "중복·원순열"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_ARRANGEMENT", "templateKey": null, "why": "순열 > 중복·원순열 (FAMILY_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "CASE_BRANCH", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "약수 조건으로 (f(2), f(4))를 제한하고 부등식 조건에 따른 f(1)의 경우의 수를 분류해 합산해야 하는 문항이다.", "level": "상", "item4slot": {"given": ["집합", "함수", "부등식"], "goal": ["개수"], "method": ["중복순열", "곱의법칙", "합의법칙"], "condition": ["약수"]}, "hold": ""}
```

## Q16

- 형식: 객관식  
- 배점: 4.6

### 발문

오른쪽 그림과 같이 합동인 \$9\$개의 정사각형으로 이루어진 색칠판이 있다. 빨간색과 파란색을 포함하여 총 \$9\$가지의 서로 다른 색으로 이 색칠판을 다음 조건을 만족시키도록 칠하려고 한다.

(가) 주어진 \$9\$가지의 색을 모두 사용하여 칠한다. (나) 한 정사각형에는 한 가지 색만을 칠한다. (다) 빨간색과 파란색이 칠해진 두 정사각형은 변을 공유하지 않는다.

색칠판을 칠하는 경우의 수는 \$a \\times b\!\$이다. \$a+b\$의 값은? (단, 회전하여 일치하는 것은 같은 것으로 본다.)

### 선지

① \$15\$ ② \$19\$ ③ \$17\$ ④ \$21\$ ⑤ \$23\$

### 정답

②

### 해설

회전을 고려하지 않고 \$9\$칸 중 빨간색과 파란색을 배치하는 전체 경우의 수는 \$9 \\times 8 \= 72\$가지이다.

\$3 \\times 3\$ 격자에서 변을 공유하는 인접한 두 칸의 쌍은 가로 방향 \$6\$쌍, 세로 방향 \$6\$쌍으로 총 \$12\$쌍이다. 빨간색과 파란색이 이 \$12\$쌍에 놓이는 경우는 \$12 \\times 2 \= 24\$가지이다.

따라서 조건 (다)를 만족하도록 빨간색과 파란색을 칠하는 경우의 수는 \$72 - 24 \= 48\$가지이고, 남은 \$7\$칸에 나머지 \$7\$가지 색을 칠하는 방법은 \$7\!\$가지이다.

\$9\$가지 색이 모두 다르므로 \$90^\\circ\$ 회전할 때마다 \$4\$가지씩 같은 배치가 나온다. 따라서 구하는 경우의 수는 다음과 같다.

\$\$\\frac{48 \\times 7\!}{4} \= 12 \\times 7\!\$\$

\$a \= 12,\\ b \= 7\$이므로 \$a+b \= 19\$이다. 정답은 ②이다.

```
{"figureType": "grid_3x3_coloring", "description": "합동인 9개의 정사각형이 3x3으로 배열된 색칠판 그림", "elements": ["3x3 square grid"]}
```

```
{"sourceQid": "Q16", "variationType": "CONDITION", "standardCourse": "확률과 통계", "courseKey": "H22-PS", "curriculum": "2022", "standardUnitKey": "H22-PS-01", "subUnitKey": "H22-PS-01-CORE", "conceptClusterKey": "COMBINATORICS", "primaryMethod": "전체 2칸 배치 72에서 변 공유 12쌍*2=24를 빼 48을 구하고 7!을 곱한 뒤 4회 대칭으로 나누어 12*7! 산출", "decisiveStep": "(9*8 - 12*2) * 7! / 4 = 12 * 7!", "rpm": {"majorUnit": "경우의 수", "midUnit": "순열과 조합", "l3": "순열", "l4": "중복·원순열"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_ARRANGEMENT", "templateKey": null, "why": "순열 > 중복·원순열 (FAMILY_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "3x3 격자에서 변 공유 여사건을 세어 두 색을 배치한 뒤 4회 회전 대칭성까지 나누어야 하는 문항이다.", "level": "상", "item4slot": {"given": ["정사각형"], "goal": ["합"], "method": ["원순열", "여사건"], "condition": []}, "hold": ""}
```

## Q17

- 형식: 객관식  
- 배점: 4.7

### 발문

빨간색, 파란색, 노란색 색연필이 있다. 각 색의 색연필을 적어도 하나씩 포함하여 \$16\$개 이하의 색연필을 선택하는 방법의 수는? (단, 빨간색, 파란색 색연필은 각각 \$16\$개씩 있고, 노란색 색연필은 \$11\$개 있으며, 같은 색의 색연필은 서로 구별이 되지 않는다.)

### 선지

① \$520\$ ② \$530\$ ③ \$540\$ ④ \$550\$ ⑤ \$560\$

### 정답

④

### 해설

빨간색, 파란색, 노란색 색연필의 개수를 각각 \$R,\\ B,\\ Y\$라 하면 \$R \\ge 1,\\ B \\ge 1,\\ 1 \\le Y \\le 11\$이고 \$R+B+Y \\le 16\$이다.

\$R' \= R-1,\\ B' \= B-1,\\ Y' \= Y-1\$로 치환하면 \$R',\\ B',\\ Y' \\ge 0\$, \$Y' \\le 10\$이고 \$R'+B'+Y' \\le 13\$이다.

음이 아닌 정수 \$S\$를 도입하여 \$R'+B'+Y'+S \= 13\$의 해의 개수를 먼저 구하면 다음과 같다.

\$\${}*{4}\\mathrm{H}*{13} \= {}*{16}\\mathrm{C}*{13} \= {}*{16}\\mathrm{C}*{3} \= \\frac{16 \\times 15 \\times 14}{6} \= 560\$\$

여기서 여사건인 \$Y' \\ge 11\$의 경우를 뺀다. \$Y' \= 11 \+ Y''\$ (\$Y'' \\ge 0\$)이라 하면 \$R'+B'+Y''+S \= 2\$이므로 그 개수는 다음과 같다.

\$\${}*{4}\\mathrm{H}*{2} \= {}*{5}\\mathrm{C}*{2} \= 10\$\$

따라서 구하는 방법의 수는 \$560 - 10 \= 550\$이다. 정답은 ④이다.

```
"NONE"
```

```
{"sourceQid": "Q17", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H22-PS", "curriculum": "2022", "standardUnitKey": "H22-PS-01", "subUnitKey": "H22-PS-01-CORE", "conceptClusterKey": "COMBINATORICS", "primaryMethod": "보조변수 S를 추가한 R'+B'+Y'+S=13의 해 4H13=560에서 상한 초과 Y'>=11 여사건 4H2=10을 빼서 550 산출", "decisiveStep": "4H13 - 4H2 = 560 - 10 = 550", "rpm": {"majorUnit": "경우의 수", "midUnit": "순열과 조합", "l3": "중복조합", "l4": "정수해 개수"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_SELECTION_DISTRIBUTION", "templateKey": "TPL_REPEATED_COMBINATION_DISTRIBUTION", "why": "중복조합 > 정수해 개수 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "부등식 합 조건에 보조변수를 도입하고 상한 제한을 여사건으로 제거해야 하는 심화 중복조합 문항이다.", "level": "상", "item4slot": {"given": ["부등식"], "goal": ["개수"], "method": ["중복조합", "여사건"], "condition": []}, "hold": ""}
```

## Q18

- 형식: 객관식  
- 배점: 4.7

### 발문

문자 \$\\mathrm{A, B, C, D}\$가 각각 하나씩 적혀 있는 \$4\$개의 접시와 숫자 \$1, 2, 3\$이 각각 하나씩 적혀 있는 \$3\$개의 접시가 있다. 이 \$7\$개의 접시를 원 모양의 탁자에 일정한 간격을 두고 원형으로 놓을 때, 다음 조건을 만족시키도록 놓는 경우의 수는? (단, 회전하여 일치하는 것은 같은 것으로 본다.)

(가) \$\\mathrm{A, B}\$ 접시끼리는 서로 이웃하지 않는다. (나) 숫자가 적힌 접시끼리는 서로 이웃하지 않는다.

### 선지

① \$120\$ ② \$96\$ ③ \$108\$ ④ \$132\$ ⑤ \$144\$

### 정답

①

### 해설

숫자 접시 \$3\$개가 서로 이웃하지 않도록 먼저 원형으로 배치하는 경우의 수는 \$(3-1)\! \= 2\$가지이다.

숫자 접시 사이의 \$3\$개의 빈 공간에 문자 접시 \$4\$개를 적어도 \$1\$개씩 나누어 넣으려면 각 공간에 \$(2, 1, 1)\$개로 배치되어야 한다. \$2\$개가 들어갈 공간을 정하는 방법은 \$3\$가지이다.

\$4\$개의 문자를 \$4\$자리에 배열하는 전체 방법은 \$4\! \= 24\$가지이고, 이 중 조건 (가)에 위배되어 \$2\$개짜리 공간에 \$\\mathrm{A, B}\$가 함께 들어가는 경우는 \$\\mathrm{A, B}\$의 순서 \$2\!\$과 나머지 \$2\$자리의 배열 \$2\!\$을 곱한 \$2\! \\times 2\! \= 4\$가지이다.

따라서 유효한 문자 배치는 \$24 - 4 \= 20\$가지이므로 구하는 전체 경우의 수는 \$2 \\times 3 \\times 20 \= 120\$이다. 정답은 ①이다.

```
"NONE"
```

```
{"sourceQid": "Q18", "variationType": "CONDITION", "standardCourse": "확률과 통계", "courseKey": "H22-PS", "curriculum": "2022", "standardUnitKey": "H22-PS-01", "subUnitKey": "H22-PS-01-CORE", "conceptClusterKey": "COMBINATORICS", "primaryMethod": "숫자 3개 원순열 2!과 빈 3공간 중 2문자 공간 선택 3가지에 A,B 동반 배제 4!-2!*2!=20을 곱해 120 산출", "decisiveStep": "(3-1)! * 3 * (4! - 2!*2!) = 120", "rpm": {"majorUnit": "경우의 수", "midUnit": "순열과 조합", "l3": "순열", "l4": "중복·원순열"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_ARRANGEMENT", "templateKey": null, "why": "순열 > 중복·원순열 (FAMILY_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "숫자 비이웃 원순열로 사이 공간을 만든 뒤 2개 들어가는 공간에서만 발생하는 문자 이웃 금지를 여사건으로 처리해야 하는 문항이다.", "level": "상", "item4slot": {"given": ["원", "집합"], "goal": ["개수"], "method": ["원순열", "여사건", "곱의법칙"], "condition": ["이웃"]}, "hold": ""}
```

## Q19

- 형식: 서답형  
- 배점: 5

### 발문

다섯 개의 숫자 \$0, 1, 2, 3, 4\$ 중에서 중복을 허용하여 만든 자연수를 크기가 작은 것부터 차례대로 나열할 때, \$4000\$은 몇 번째 수인가 구하시오.

### 선지

없음

### 정답

500

### 해설

\$4000\$보다 작은 자연수의 개수를 자릿수별로 센다.

1. 한 자리 자연수: \$1, 2, 3, 4\$의 \$4\$개  
2. 두 자리 자연수: \$4 \\times 5 \= 20\$개  
3. 세 자리 자연수: \$4 \\times 5 \\times 5 \= 100\$개  
4. 천의 자리가 \$1, 2, 3\$인 네 자리 자연수: \$3 \\times 5 \\times 5 \\times 5 \= 375\$개

\$4000\$ 앞까지 모두 \$4 \+ 20 \+ 100 \+ 375 \= 499\$개의 수가 있으므로, \$4000\$은 \$500\$번째 수이다.

```
"NONE"
```

```
{"sourceQid": "Q19", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H22-PS", "curriculum": "2022", "standardUnitKey": "H22-PS-01", "subUnitKey": "H22-PS-01-CORE", "conceptClusterKey": "COMBINATORICS", "primaryMethod": "1~3자리 자연수 4+20+100=124개와 천의 자리 1,2,3인 4자리수 3*5^3=375개를 더해 4000의 순번 500 산출", "decisiveStep": "4 + 20 + 100 + 3*5^3 + 1 = 500", "rpm": {"majorUnit": "경우의 수", "midUnit": "순열과 조합", "l3": "순열", "l4": "중복·원순열"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_ARRANGEMENT", "templateKey": null, "why": "순열 > 중복·원순열 (FAMILY_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "CASE_BRANCH", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "0을 포함한 중복순열로 만드는 자연수를 자릿수와 최고차 자리별로 분류해 순번을 구하는 문항이다.", "level": "중", "item4slot": {"given": ["자연수"], "goal": ["값"], "method": ["중복순열", "합의법칙"], "condition": []}, "hold": ""}
```

## Q20

- 형식: 서답형  
- 배점: 5

### 발문

항등식 \$(1+x)^{2n} \= (1+x)^n \\times (1+x)^n\$임을 이용하여 \$({}*{12}\\mathrm{C}*{0})^2 \+ ({}*{12}\\mathrm{C}*{1})^2 \+ ({}*{12}\\mathrm{C}*{2})^2 \+ \\cdots \+ ({}*{12}\\mathrm{C}*{12})^2\$의 값을 구하시오.

### 선지

없음

### 정답

\${}*{24}\\mathrm{C}*{12}\$

### 해설

\$(1+x)^{2n}\$의 전개식에서 \$x^n\$의 계수는 \${}*{2n}\\mathrm{C}*{n}\$이다.

한편 \$(1+x)^n \\times (1+x)^n\$에서 \$x^n\$항은 앞의 식의 \$x^r\$항과 뒤의 식의 \$x^{n-r}\$항을 곱하여 얻으므로 \$x^n\$의 계수는 다음과 같다.

\$\$\\sum\_{r=0}^{n} {}*{n}\\mathrm{C}*{r} \\cdot {}*{n}\\mathrm{C}*{n-r} \= \\sum\_{r=0}^{n} ({}*{n}\\mathrm{C}*{r})^2\$\$

양변의 \$x^n\$의 계수를 비교하면 \$\\sum\_{r=0}^{n} ({}*{n}\\mathrm{C}*{r})^2 \= {}*{2n}\\mathrm{C}*{n}\$이다. \$n \= 12\$를 대입하면 구하는 값은 \${}*{24}\\mathrm{C}*{12}\$이다.

```
"NONE"
```

```
{"sourceQid": "Q20", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H22-PS", "curriculum": "2022", "standardUnitKey": "H22-PS-02", "subUnitKey": "H22-PS-02-CORE", "conceptClusterKey": "BINOMIAL_THEOREM", "primaryMethod": "(1+x)^2n=(1+x)^n*(1+x)^n 양변의 x^n 계수를 비교해 n=12일 때 제곱합을 24C12로 도출", "decisiveStep": "sum (nCr)^2 = (2n)Cn에 n=12 대입", "rpm": {"majorUnit": "경우의 수", "midUnit": "이항정리", "l3": "이항계수", "l4": "조합 항등식"}, "ptTplCandidate": {"problemTypeKey": "PT_BINOMIAL_THEOREM", "templateKey": "TPL_BINOMIAL_COEFFICIENT_IDENTITY", "why": "이항계수 > 조합 항등식 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "다항식 곱의 계수 비교 과정을 서술하여 이항계수 제곱합 항등식을 이끌어내는 문항이다.", "level": "중", "item4slot": {"given": ["다항식"], "goal": ["합", "계수"], "method": ["이항정리", "조합"], "condition": []}, "hold": ""}
```

## Q21

- 형식: 서답형  
- 배점: 5

### 발문

다항식 \$5(x+a)^n\$의 전개식에서 \$x^{n-2}\$의 계수와 다항식 \$(x-1)(x+a)^n\$의 전개식에서 \$x^{n-2}\$의 계수가 같게 되는 모든 순서쌍 \$(a, n)\$에 대하여 \$an\$의 최댓값을 구하시오. (단, \$a\$는 자연수이고, \$n\$은 \$n \\ge 3\$인 자연수이다.)

### 선지

없음

### 정답

54

### 해설

\$5(x+a)^n\$의 전개식에서 \$x^{n-2}\$의 계수는 \$5\\cdot {}*{n}\\mathrm{C}*{n-2},a^2 \= \\dfrac{5}{2}n(n-1)a^2\$이다.

\$(x-1)(x+a)^n \= x(x+a)^n - (x+a)^n\$에서 \$x^{n-2}\$의 계수는 다음과 같다.

\$\${}*{n}\\mathrm{C}*{n-3},a^3 - {}*{n}\\mathrm{C}*{n-2},a^2 \= \\frac{n(n-1)(n-2)}{6}a^3 - \\frac{n(n-1)}{2}a^2\$\$

두 계수가 같으므로 양변을 \$\\dfrac{n(n-1)a^2}{2}\$ (\$\>0\$)로 나누어 정리하면 다음과 같다.

\$\$5 \= \\frac{n-2}{3}a - 1 \\implies a(n-2) \= 18\$\$

\$a \\ge 1\$, \$n-2 \\ge 1\$인 자연수 쌍 \$(a, n-2)\$와 \$(a, n)\$, 그리고 \$an\$의 값은 다음과 같다.

- \$(18, 1\) \\to (18, 3)\$: \$an \= 54\$  
- \$(9, 2\) \\to (9, 4)\$: \$an \= 36\$  
- \$(6, 3\) \\to (6, 5)\$: \$an \= 30\$  
- \$(3, 6\) \\to (3, 8)\$: \$an \= 24\$  
- \$(2, 9\) \\to (2, 11)\$: \$an \= 22\$  
- \$(1, 18\) \\to (1, 20)\$: \$an \= 20\$

따라서 \$an\$의 최댓값은 \$54\$이다.

```
"NONE"
```

```
{"sourceQid": "Q21", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H22-PS", "curriculum": "2022", "standardUnitKey": "H22-PS-02", "subUnitKey": "H22-PS-02-CORE", "conceptClusterKey": "BINOMIAL_THEOREM", "primaryMethod": "x^(n-2) 계수 등식을 정리해 부정방정식 a(n-2)=18을 얻고 자연수 약수 쌍 중 an 최댓값 54 산출", "decisiveStep": "a(n-2) = 18의 양의 약수 쌍에서 an 최댓값 54 결정", "rpm": {"majorUnit": "경우의 수", "midUnit": "이항정리", "l3": "이항정리", "l4": "특정 항의 계수"}, "ptTplCandidate": {"problemTypeKey": "PT_BINOMIAL_THEOREM", "templateKey": "TPL_BINOMIAL_TERM_COEFFICIENT", "why": "이항정리 > 특정 항의 계수 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "다항식 곱의 특정 항 계수를 비교하여 정수 부정방정식 a(n-2)=18의 모든 해를 조사해야 하는 문항이다.", "level": "상", "item4slot": {"given": ["다항식", "자연수"], "goal": ["최댓값"], "method": ["이항정리"], "condition": ["계수"]}, "hold": ""}
```

## Q22

- 형식: 서답형  
- 배점: 5

### 발문

다음 조건을 만족시키는 \$10\$ 이하의 자연수 \$a, b, c, d, e\$의 모든 순서쌍 \$(a, b, c, d, e)\$의 개수를 구하시오.

(가) \$a \\le b \\le c \< 6 \< d \\le e\$ (나) \$a\$는 홀수, \$d\$는 짝수이다.

### 선지

없음

### 정답

88

### 해설

조건 (가)에 의하여 \$a, b, c \\in {1, 2, 3, 4, 5}\$이고 \$d, e \\in {7, 8, 9, 10}\$이다.

1. \$(a, b, c)\$의 개수: \$a\$는 홀수이므로 \$1, 3, 5\$이다.  
- \$a \= 1\$일 때 \$1 \\le b \\le c \\le 5\$: \${}*{5}\\mathrm{H}*{2} \= {}*{6}\\mathrm{C}*{2} \= 15\$가지  
- \$a \= 3\$일 때 \$3 \\le b \\le c \\le 5\$: \${}*{3}\\mathrm{H}*{2} \= {}*{4}\\mathrm{C}*{2} \= 6\$가지  
- \$a \= 5\$일 때 \$5 \\le b \\le c \\le 5\$: \${}*{1}\\mathrm{H}*{2} \= {}*{2}\\mathrm{C}*{2} \= 1\$가지 따라서 앞 그룹은 \$15 \+ 6 \+ 1 \= 22\$가지이다.  
2. \$(d, e)\$의 개수: \$d\$는 짝수이므로 \$8, 10\$이다.  
- \$d \= 8\$일 때 \$e \\in {8, 9, 10}\$: \$3\$가지  
- \$d \= 10\$일 때 \$e \\in {10}\$: \$1\$가지 따라서 뒤 그룹은 \$3 \+ 1 \= 4\$가지이다.

두 선택은 독립이므로 전체 순서쌍의 개수는 \$22 \\times 4 \= 88\$이다.

```
"NONE"
```

```
{"sourceQid": "Q22", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H22-PS", "curriculum": "2022", "standardUnitKey": "H22-PS-01", "subUnitKey": "H22-PS-01-CORE", "conceptClusterKey": "COMBINATORICS", "primaryMethod": "6을 경계로 (a,b,c) 22가지와 (d,e) 4가지를 홀짝 조건별 중복조합으로 구해 곱하여 88 산출", "decisiveStep": "(5H2 + 3H2 + 1H2) * (3 + 1) = 22 * 4 = 88", "rpm": {"majorUnit": "경우의 수", "midUnit": "순열과 조합", "l3": "중복조합", "l4": "중복을 허용한 선택"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_SELECTION_DISTRIBUTION", "templateKey": "TPL_REPEATED_COMBINATION_DISTRIBUTION", "why": "중복조합 > 중복을 허용한 선택 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "경계값 6을 기준으로 두 그룹을 독립 분리하고 홀짝 시작값에 따라 중복조합을 합산하는 서술형 문항이다.", "level": "상", "item4slot": {"given": ["자연수", "부등식"], "goal": ["순서쌍", "개수"], "method": ["중복조합", "곱의법칙"], "condition": ["홀수", "짝수"]}, "hold": ""}
```

## Q23

- 형식: 서답형  
- 배점: 5

### 발문

집합 \$X \= {1, 2, 3, 4}\$에 대하여 다음 조건을 만족시키는 함수 \$f: X \\to X\$의 개수를 구하시오.

(가) \$f(1)+f(2)+f(3)+f(4)\$는 짝수이다. (나) 함수 \$f\$의 치역의 원소의 개수는 \$3\$이다.

### 선지

없음

### 정답

48

### 해설

치역의 원소의 개수가 \$3\$이므로 \$4\$개의 함숫값은 \${x, x, y, z}\$ (\$x, y, z\$는 서로 다른 원소) 꼴이다.

조건 (가)에서 \$2x \+ y \+ z\$가 짝수이려면 \$y \+ z\$가 짝수여야 하므로 \$y\$와 \$z\$는 모두 홀수이거나 모두 짝수여야 한다.

치역 \$R\$이 될 수 있는 원소 \$3\$개의 부분집합 \$4\$가지에 대하여 \$x\$로 가능한 원소를 조사하면 다음과 같다.

- \$R \= {1, 2, 3}\$: \${y, z} \= {1, 3} \\implies x \= 2\$ (\$1\$가지)  
- \$R \= {1, 2, 4}\$: \${y, z} \= {2, 4} \\implies x \= 1\$ (\$1\$가지)  
- \$R \= {1, 3, 4}\$: \${y, z} \= {1, 3} \\implies x \= 4\$ (\$1\$가지)  
- \$R \= {2, 3, 4}\$: \${y, z} \= {2, 4} \\implies x \= 3\$ (\$1\$가지)

각 \$4\$가지 경우마다 \${x, x, y, z}\$를 정의역 \${1, 2, 3, 4}\$에 대응시키는 방법의 수는 \$\\dfrac{4\!}{2\!,1\!,1\!} \= 12\$가지이다.

따라서 구하는 함수의 개수는 \$4 \\times 12 \= 48\$이다.

```
"NONE"
```

```
{"sourceQid": "Q23", "variationType": "CONDITION", "standardCourse": "확률과 통계", "courseKey": "H22-PS", "curriculum": "2022", "standardUnitKey": "H22-PS-01", "subUnitKey": "H22-PS-01-CORE", "conceptClusterKey": "COMBINATORICS", "primaryMethod": "치역 {x,x,y,z}에서 y+z 짝수 조건으로 4가지 치역별 x를 1개씩 확정한 뒤 4!/2!=12를 곱해 48 산출", "decisiveStep": "치역 4가지마다 중복원소 x가 1가지씩 확정되어 4 * (4!/2!) = 48", "rpm": {"majorUnit": "경우의 수", "midUnit": "순열과 조합", "l3": "순열", "l4": "일렬 배열"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_ARRANGEMENT", "templateKey": "TPL_PERMUTATION_STANDARD_CONSTRAINT", "why": "순열 > 일렬 배열 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "치역 크기 3과 함숫값 합의 우기성을 결합해 중복 원소를 특정한 뒤 같은 것이 있는 순열로 대응수를 세는 문항이다.", "level": "상", "item4slot": {"given": ["집합", "함수", "치역"], "goal": ["개수"], "method": ["같은것이있는순열", "곱의법칙"], "condition": ["짝수"]}, "hold": ""}
```

