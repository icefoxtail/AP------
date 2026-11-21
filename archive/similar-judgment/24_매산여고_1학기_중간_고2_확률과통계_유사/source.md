

```
{"stem": "24_매산여고_1학기_중간_고2_확률과통계_유사", "sourceArchiveFile": "original/high/h2/1mid/24_매산여고_1학기_중간_고2_확률과통계.js", "examFolder": "1mid", "grade": "고2", "subject": "확률과 통계", "curriculum": "2015", "questionCount": 23, "totalScore": 100, "generatedAt": "2026-11-20"}
```

## Q01

- 형식: 객관식  
- 배점: 3.5

### 발문

서로 다른 \$8\$권의 책 중 \$4\$권을 뽑아 원형으로 배열하는 경우의 수는? (단, 회전하여 일치하는 것은 같은 것으로 본다.)

### 선지

① \$210\$ ② \$360\$ ③ \$420\$ ④ \$840\$ ⑤ \$1680\$

### 정답

③

### 해설

서로 다른 \$8\$권 중 \$4\$권을 고르는 경우의 수는 \${}*{8}\\mathrm{C}*{4} \= 70\$가지이고, 고른 \$4\$권을 원형으로 배열하는 경우의 수는 \$(4-1)\! \= 6\$가지이다.

\$\$70 \\times 6 \= 420\$\$

따라서 정답은 ③이다.

```
"NONE"
```

```
{"sourceQid": "Q01", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H15-PS", "curriculum": "2015", "standardUnitKey": "H15-PS-01", "subUnitKey": "H15-PS-01-PERMUTATION", "conceptClusterKey": "COMBINATORICS", "primaryMethod": "8권 중 4권 선택 8C4=70과 4권의 원순열 3!=6을 곱해 420 계산", "decisiveStep": "8C4 * (4-1)! = 70 * 6 = 420", "rpm": {"majorUnit": "경우의 수", "midUnit": "순열과 조합", "l3": "순열", "l4": "중복·원순열"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_ARRANGEMENT", "templateKey": null, "why": "순열 > 중복·원순열 (FAMILY_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "조합으로 대상을 먼저 뽑은 뒤 원순열 공식을 적용해 곱하는 표준 문항이다.", "level": "중", "item4slot": {"given": ["집합"], "goal": ["개수"], "method": ["조합", "원순열", "곱의법칙"], "condition": []}, "hold": ""}
```

## Q02

- 형식: 객관식  
- 배점: 3.6

### 발문

\$5\$명이 가위, 바위, 보를 한 번 할 때, 나오는 모든 경우의 수는?

### 선지

① \$243\$ ② \$125\$ ③ \$180\$ ④ \$216\$ ⑤ \$729\$

### 정답

①

### 해설

각 사람은 가위, 바위, 보 중 \$3\$가지 선택을 독립적으로 할 수 있으므로

\$\${}*{3}\\Pi*{5} \= 3^5 \= 243\$\$

따라서 정답은 ①이다.

```
"NONE"
```

```
{"sourceQid": "Q02", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H15-PS", "curriculum": "2015", "standardUnitKey": "H15-PS-01", "subUnitKey": "H15-PS-01-PERMUTATION", "conceptClusterKey": "COMBINATORICS", "primaryMethod": "5명이 각각 3가지를 내는 중복순열 3^5=243 계산", "decisiveStep": "3Pi5 = 3^5 = 243", "rpm": {"majorUnit": "경우의 수", "midUnit": "순열과 조합", "l3": "순열", "l4": "중복·원순열"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_ARRANGEMENT", "templateKey": null, "why": "순열 > 중복·원순열 (FAMILY_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "중복순열의 밑과 지수를 구분해 3^5를 바로 구하는 기초 문항이다.", "level": "하", "item4slot": {"given": ["개수"], "goal": ["개수"], "method": ["중복순열"], "condition": []}, "hold": ""}
```

## Q03

- 형식: 객관식  
- 배점: 3.6

### 발문

흰 공 \$2\$개, 검은 공 \$4\$개, 빨간 공 \$4\$개를 일렬로 나열할 때, 흰 공은 서로 이웃하지 않게 나열하는 경우의 수는? (단, 같은 색의 공끼리는 서로 구별하지 않는다.)

### 선지

① \$1260\$ ② \$1890\$ ③ \$2160\$ ④ \$2520\$ ⑤ \$2880\$

### 정답

④

### 해설

먼저 검은 공 \$4\$개와 빨간 공 \$4\$개를 일렬로 나열하는 경우의 수는 \$\\dfrac{8\!}{4\!,4\!} \= 70\$가지이다.

나열된 \$8\$개의 공의 양 끝과 사이사이 총 \$9\$개의 자리 중 \$2\$개의 자리를 택하여 흰 공 \$2\$개를 놓으면 서로 이웃하지 않으므로 \${}*{9}\\mathrm{C}*{2} \= 36\$가지이다.

따라서 구하는 경우의 수는 \$70 \\times 36 \= 2520\$이다. 정답은 ④이다.

```
"NONE"
```

```
{"sourceQid": "Q03", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H15-PS", "curriculum": "2015", "standardUnitKey": "H15-PS-01", "subUnitKey": "H15-PS-01-PERMUTATION", "conceptClusterKey": "COMBINATORICS", "primaryMethod": "검은 공·빨간 공 8개 배열 8!/(4!4!)=70 후 사이·양끝 9자리에 흰 공 2개 배치 9C2=36을 곱해 2520 산출", "decisiveStep": "(8!/(4!4!)) * 9C2 = 70 * 36 = 2520", "rpm": {"majorUnit": "경우의 수", "midUnit": "순열과 조합", "l3": "순열", "l4": "일렬 배열"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_ARRANGEMENT", "templateKey": "TPL_PERMUTATION_STANDARD_CONSTRAINT", "why": "순열 > 일렬 배열 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "같은 것이 있는 순열로 기준 공들을 먼저 배열한 뒤 사이 공간에 조합으로 끼워 넣는 문항이다.", "level": "중", "item4slot": {"given": ["개수"], "goal": ["개수"], "method": ["같은것이있는순열", "조합", "곱의법칙"], "condition": ["이웃"]}, "hold": ""}
```

## Q04

- 형식: 객관식  
- 배점: 3.7

### 발문

\$(x+3)^5\$의 전개식에서 \$x^3\$의 계수는?

### 선지

① \$45\$ ② \$90\$ ③ \$135\$ ④ \$180\$ ⑤ \$270\$

### 정답

②

### 해설

\$(x+3)^5\$의 전개식에서 \$x^3\$항은 \${}*{5}\\mathrm{C}*{3}, x^3\\cdot 3^2\$이므로 계수는

\$\${}*{5}\\mathrm{C}*{3}\\cdot 3^2 \= 10 \\times 9 \= 90\$\$

따라서 정답은 ②이다.

```
"NONE"
```

```
{"sourceQid": "Q04", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H15-PS", "curriculum": "2015", "standardUnitKey": "H15-PS-02", "subUnitKey": "H15-PS-02-BINOMIAL_BASIC", "conceptClusterKey": "BINOMIAL_THEOREM", "primaryMethod": "이항정리 일반항 5C3*x^3*3^2으로 계수 90 계산", "decisiveStep": "5C3 * 3^2 = 90", "rpm": {"majorUnit": "경우의 수", "midUnit": "이항정리", "l3": "이항정리", "l4": "특정 항의 계수"}, "ptTplCandidate": {"problemTypeKey": "PT_BINOMIAL_THEOREM", "templateKey": "TPL_BINOMIAL_TERM_COEFFICIENT", "why": "이항정리 > 특정 항의 계수 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이항정리 일반항에 차수를 대입해 계수를 구하는 기초 문항이다.", "level": "하", "item4slot": {"given": ["다항식"], "goal": ["계수"], "method": ["이항정리"], "condition": []}, "hold": ""}
```

## Q05

- 형식: 객관식  
- 배점: 3.7

### 발문

표본공간을 \$S\$, 절대로 일어나지 않을 사건을 \$\\varnothing\$이라 할 때, 두 사건 \$A,\\ B\$에 대하여 옳은 것만을 \<보기\>에서 있는 대로 고른 것은?

ㄱ. \$0 \\le \\mathrm{P}(A) \\le 1\$ ㄴ. \$\\mathrm{P}(S) - \\mathrm{P}(\\varnothing) \= 1\$ ㄷ. \$\\mathrm{P}(A)+\\mathrm{P}(B)=1\$이면 두 사건 \$A\$와 \$B\$는 서로 배반사건이다. ㄹ. 두 사건 \$A\$와 \$B\$가 서로 배반사건이면 \$\\mathrm{P}(A\\cup B)=\\mathrm{P}(A)+\\mathrm{P}(B)\$이다.

### 선지

① ㄱ, ㄴ ② ㄱ, ㄹ ③ ㄴ, ㄹ ④ ㄱ, ㄴ, ㄷ ⑤ ㄱ, ㄴ, ㄹ

### 정답

⑤

### 해설

- ㄱ: 임의의 사건의 확률은 \$0\$ 이상 \$1\$ 이하이다. (참)  
- ㄴ: \$\\mathrm{P}(S)=1,\\ \\mathrm{P}(\\varnothing)=0\$이므로 \$1-0=1\$이다. (참)  
- ㄷ: \$\\mathrm{P}(A)=\\mathrm{P}(B)=\\dfrac{1}{2}\$이고 \$A=B\$인 경우 \$\\mathrm{P}(A)+\\mathrm{P}(B)=1\$이지만 배반사건이 아니다. (거짓)  
- ㄹ: 배반사건이면 \$\\mathrm{P}(A\\cap B)=0\$이므로 덧셈정리에 의해 참이다. (참)

따라서 옳은 것은 ㄱ, ㄴ, ㄹ이므로 정답은 ⑤이다.

```
"NONE"
```

```
{"sourceQid": "Q05", "variationType": "CONDITION", "standardCourse": "확률과 통계", "courseKey": "H15-PS", "curriculum": "2015", "standardUnitKey": "H15-PS-03", "subUnitKey": "H15-PS-03-PROBABILITY_BASIC", "conceptClusterKey": "PROBABILITY", "primaryMethod": "확률의 기본 성질과 배반사건의 덧셈정리(ㄱ,ㄴ,ㄹ 참) 및 확률 합=1 반례(ㄷ 거짓) 판별", "decisiveStep": "ㄷ 반례 A=B, P(A)=1/2 판정", "rpm": {"majorUnit": "확률", "midUnit": "확률의 뜻과 활용", "l3": "확률의 기본", "l4": "표본공간과 사건"}, "ptTplCandidate": {"problemTypeKey": "PT_PROBABILITY_PROPERTIES_APPLICATION", "templateKey": "TPL_PROBABILITY_BASIC_COUNT_RATIO", "why": "확률의 기본 > 표본공간과 사건 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "확률의 기본 공리와 배반사건의 필요충분조건 오개념을 판별하는 개념 문항이다.", "level": "하", "item4slot": {"given": ["표본공간", "사건"], "goal": ["확률"], "method": ["확률의덧셈정리"], "condition": ["배반사건"]}, "hold": ""}
```

## Q06

- 형식: 객관식  
- 배점: 3.8

### 발문

다음 조건을 만족시키는 다섯 자리 자연수의 개수는?

(가) 각 자리의 수의 합은 \$17\$이다. (나) 각 자리의 수는 모두 홀수이다.

### 선지

① \$165\$ ② \$185\$ ③ \$175\$ ④ \$195\$ ⑤ \$205\$

### 정답

②

### 해설

각 자리의 홀수를 \$2x\_i+1\$ (\$0\\le x\_i\\le 4\$, \$i=1,\\ 2,\\ 3,\\ 4,\\ 5\$)이라 하면

\$\$2(x\_1+x\_2+x\_3+x\_4+x\_5)+5 \= 17 \\implies x\_1+x\_2+x\_3+x\_4+x\_5 \= 6\$\$

상한 조건을 제외한 음이 아닌 정수해의 개수는 \${}*{5}\\mathrm{H}*{6} \= {}*{10}\\mathrm{C}*{6} \= {}*{10}\\mathrm{C}*{4} \= 210\$개이다.

이 중 한 변수가 \$5\$ 이상인 여사건을 제외한다.

- \$(6, 0, 0, 0, 0)\$의 배열: \$5\$개  
- \$(5, 1, 0, 0, 0)\$의 배열: \$5\\times 4 \= 20\$개

따라서 구하는 자연수의 개수는 \$210 - (5+20) \= 185\$이다. 정답은 ②이다.

```
"NONE"
```

```
{"sourceQid": "Q06", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H15-PS", "curriculum": "2015", "standardUnitKey": "H15-PS-01", "subUnitKey": "H15-PS-01-COMBINATION", "conceptClusterKey": "COMBINATORICS", "primaryMethod": "각 자리 홀수 2x_i+1 치환으로 x1+...+x5=6을 얻고 전체 5H6=210에서 한 자리>=11인 25개를 빼 185 산출", "decisiveStep": "5H6 - (5 + 5*4) = 210 - 25 = 185", "rpm": {"majorUnit": "경우의 수", "midUnit": "순열과 조합", "l3": "중복조합", "l4": "정수해 개수"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_SELECTION_DISTRIBUTION", "templateKey": "TPL_REPEATED_COMBINATION_DISTRIBUTION", "why": "중복조합 > 정수해 개수 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "홀수 자릿수 합 조건을 0<=x_i<=4 중복조합으로 변환하고 상한 초과 여사건을 제거해야 하는 문항이다.", "level": "중", "item4slot": {"given": ["자연수", "합"], "goal": ["개수"], "method": ["중복조합", "여사건"], "condition": ["홀수"]}, "hold": ""}
```

## Q07

- 형식: 객관식  
- 배점: 3.8

### 발문

다음 그림과 같은 도로망이 있다. \$\\mathrm{A}\$지점에서 \$\\mathrm{B}\$지점까지 최단 거리로 가는 경우의 수는?

### 선지

① \$42\$ ② \$38\$ ③ \$40\$ ④ \$44\$ ⑤ \$46\$

### 정답

①

### 해설

가로 \$5\$칸, 세로 \$4\$칸의 격자 도로망에서 가운데 두 교차점 \$(2,\\ 2)\$와 \$(3,\\ 2)\$를 지날 수 없으므로 \$\\mathrm{A}(0,\\ 0)\$에서 각 교차점까지의 최단 경로 수를 합의 법칙으로 구하면 다음과 같다.

- \$y=0\$: \$(0,0)=1,\\ (1,0)=1,\\ (2,0)=1,\\ (3,0)=1,\\ (4,0)=1,\\ (5,0)=1\$  
- \$y=1\$: \$(0,1)=1,\\ (1,1)=2,\\ (2,1)=3,\\ (3,1)=4,\\ (4,1)=5,\\ (5,1)=6\$  
- \$y=2\$: \$(0,2)=1,\\ (1,2)=3,\\ (4,2)=5,\\ (5,2)=11\$  
- \$y=3\$: \$(0,3)=1,\\ (1,3)=4,\\ (2,3)=4,\\ (3,3)=4,\\ (4,3)=9,\\ (5,3)=20\$  
- \$y=4\$: \$(0,4)=1,\\ (1,4)=5,\\ (2,4)=9,\\ (3,4)=13,\\ (4,4)=22,\\ (5,4)=42\$

따라서 최단 경로의 수는 \$42\$이다. 정답은 ①이다.

```
{"figureType": "grid_shortest_path_obstacle", "description": "가로 5칸, 세로 4칸의 직사각형 도로망에서 가운데 두 교차점 (2,2)와 (3,2)가 끊어져 있고 왼쪽 아래 A(0,0), 오른쪽 위 B(5,4)가 표시된 그림", "elements": ["5x4 rectangular grid", "missing nodes at (2,2) and (3,2)", "point A at (0,0)", "point B at (5,4)"]}
```

```
{"sourceQid": "Q07", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H15-PS", "curriculum": "2015", "standardUnitKey": "H15-PS-01", "subUnitKey": "H15-PS-01-PERMUTATION", "conceptClusterKey": "COMBINATORICS", "primaryMethod": "가운데 (2,2),(3,2)가 끊어진 5x4 격자 도로망에서 교차점마다 합의 법칙을 누적해 B(5,4)=42 산출", "decisiveStep": "결손 교차점 제외 후 합의 법칙 누적으로 42 도출", "rpm": {"majorUnit": "경우의 수", "midUnit": "순열과 조합", "l3": "순열", "l4": "일렬 배열"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_ARRANGEMENT", "templateKey": "TPL_PERMUTATION_STANDARD_CONSTRAINT", "why": "순열 > 일렬 배열 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "중간 경로가 끊어진 격자 도로망에서 교차점별 합의 법칙으로 최단 경로를 세는 문항이다.", "level": "중", "item4slot": {"given": ["직사각형"], "goal": ["개수"], "method": ["합의법칙"], "condition": ["최단거리"]}, "hold": ""}
```

## Q08

- 형식: 객관식  
- 배점: 3.9

### 발문

두 집합 \$X={0,\\ 1,\\ 2,\\ 3}\$, \$Y={1,\\ 2,\\ 3,\\ 4,\\ 5}\$에 대하여 \$X\$에서 \$Y\$로의 함수 \$f\$ 중에서 \$f(2)+f(3)=6\$을 만족시키는 함수의 개수는?

### 선지

① \$100\$ ② \$115\$ ③ \$120\$ ④ \$125\$ ⑤ \$150\$

### 정답

④

### 해설

\$f(2)+f(3)=6\$을 만족시키는 순서쌍 \$(f(2),\\ f(3))\$은 \$(1,5),\\ (2,4),\\ (3,3),\\ (4,2),\\ (5,1)\$의 \$5\$가지이다.

나머지 \$f(0),\\ f(1)\$은 각각 \$Y\$의 원소 \$5\$개 중 하나를 자유롭게 택할 수 있으므로 구하는 함수의 개수는 \$5\\times 5\\times 5 \= 125\$이다. 정답은 ④이다.

```
"NONE"
```

```
{"sourceQid": "Q08", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H15-PS", "curriculum": "2015", "standardUnitKey": "H15-PS-01", "subUnitKey": "H15-PS-01-PERMUTATION", "conceptClusterKey": "COMBINATORICS", "primaryMethod": "f(2)+f(3)=6인 5쌍과 f(0), f(1)의 각 5가지 중복 선택을 곱해 5*5*5=125 산출", "decisiveStep": "5쌍 * 5 * 5 = 125", "rpm": {"majorUnit": "경우의 수", "midUnit": "순열과 조합", "l3": "순열", "l4": "중복·원순열"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_ARRANGEMENT", "templateKey": null, "why": "순열 > 중복·원순열 (FAMILY_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 함숫값의 합 조건을 만족하는 순서쌍과 나머지 정의역의 중복순열을 곱하는 기본 문항이다.", "level": "하", "item4slot": {"given": ["집합", "함수", "합"], "goal": ["개수"], "method": ["중복순열", "곱의법칙"], "condition": []}, "hold": ""}
```

## Q09

- 형식: 객관식  
- 배점: 4

### 발문

여학생 \$3\$명과 남학생 \$6\$명이 원탁에 둘러앉을 때, 여학생끼리 이웃하게 앉는 경우의 수를 \$a\$, 여학생끼리 이웃하지 않게 앉는 경우의 수를 \$b\$라 할 때, \$\\dfrac{b}{a}\$의 값은? (단, 회전하여 일치하는 것은 같은 것으로 본다.)

### 선지

① \$3\$ ② \$\\dfrac{8}{3}\$ ③ \$\\dfrac{10}{3}\$ ④ \$4\$ ⑤ \$\\dfrac{11}{3}\$

### 정답

③

### 해설

여학생 \$3\$명이 모두 이웃하게 앉는 경우의 수는 \$a \= (7-1)\!\\cdot 3\! \= 6\!\\cdot 6\$이다.

여학생끼리 이웃하지 않게 앉는 경우의 수는 남학생 \$6\$명을 원형 배열한 뒤 사이 \$6\$자리 중 \$3\$자리에 여학생을 배열하므로 \$b \= (6-1)\!\\cdot {}*{6}\\mathrm{P}*{3} \= 5\!\\cdot 120\$이다.

\$\$\\frac{b}{a} \= \\frac{5\!\\cdot 120}{6\!\\cdot 6} \= \\frac{120}{36} \= \\frac{10}{3}\$\$

따라서 정답은 ③이다.

```
"NONE"
```

```
{"sourceQid": "Q09", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H15-PS", "curriculum": "2015", "standardUnitKey": "H15-PS-01", "subUnitKey": "H15-PS-01-PERMUTATION", "conceptClusterKey": "COMBINATORICS", "primaryMethod": "이웃 원순열 a=6!*3!과 비이웃 원순열 b=5!*6P3을 각각 구해 비율 b/a=10/3 산출", "decisiveStep": "(5! * 6P3) / (6! * 3!) = 10/3", "rpm": {"majorUnit": "경우의 수", "midUnit": "순열과 조합", "l3": "순열", "l4": "중복·원순열"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_ARRANGEMENT", "templateKey": null, "why": "순열 > 중복·원순열 (FAMILY_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "CASE_BRANCH", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "원순열의 이웃 조건(묶음)과 비이웃 조건(사이 끼워넣기)을 모두 계산해 비율을 구하는 문항이다.", "level": "중", "item4slot": {"given": ["원", "집합"], "goal": ["값"], "method": ["원순열", "순열"], "condition": ["이웃"]}, "hold": ""}
```

## Q10

- 형식: 객관식  
- 배점: 4

### 발문

두 집합 \$X={1,\\ 2,\\ 3,\\ 4}\$, \$Y={1,\\ 2,\\ 3,\\ 4,\\ 5,\\ 6,\\ 7}\$에 대하여 \$X\$에서 \$Y\$로의 함수 \$f\$ 중에서 다음 조건을 모두 만족시키는 함수의 개수는?

(가) \$f(3)\$의 값은 홀수이다. (나) \$a\\in X,\\ b\\in X\$일 때, \$a\<b\$이면 \$f(a)\\le f(b)\$이다.

### 선지

① \$82\$ ② \$96\$ ③ \$100\$ ④ \$104\$ ⑤ \$110\$

### 정답

⑤

### 해설

조건 (나)에서 \$1\\le f(1)\\le f(2)\\le f(3)\\le f(4)\\le 7\$이고, \$f(3)\$은 홀수이므로 \$1,\\ 3,\\ 5,\\ 7\$로 나누어 센다.

- \$f(3)=1\$: \${}*{1}\\mathrm{H}*{2} \\times 7 \= 1 \\times 7 \= 7\$  
- \$f(3)=3\$: \${}*{3}\\mathrm{H}*{2} \\times 5 \= 6 \\times 5 \= 30\$  
- \$f(3)=5\$: \${}*{5}\\mathrm{H}*{2} \\times 3 \= 15 \\times 3 \= 45\$  
- \$f(3)=7\$: \${}*{7}\\mathrm{H}*{2} \\times 1 \= 28 \\times 1 \= 28\$

따라서 구하는 함수의 개수는 \$7+30+45+28 \= 110\$이다. 정답은 ⑤이다.

```
"NONE"
```

```
{"sourceQid": "Q10", "variationType": "CONDITION", "standardCourse": "확률과 통계", "courseKey": "H15-PS", "curriculum": "2015", "standardUnitKey": "H15-PS-01", "subUnitKey": "H15-PS-01-COMBINATION", "conceptClusterKey": "COMBINATORICS", "primaryMethod": "f(3)을 홀수 1,3,5,7로 분류해 f(1)<=f(2)<=f(3) 중복조합과 f(4) 선택지 곱 7+30+45+28=110 합산", "decisiveStep": "f(3)=1,3,5,7별 kH2*(8-k) 합 = 110", "rpm": {"majorUnit": "경우의 수", "midUnit": "순열과 조합", "l3": "중복조합", "l4": "중복을 허용한 선택"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_SELECTION_DISTRIBUTION", "templateKey": "TPL_REPEATED_COMBINATION_DISTRIBUTION", "why": "중복조합 > 중복을 허용한 선택 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "CASE_BRANCH", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "단조비감소 함수에서 특정 함숫값 f(3)의 홀수 조건을 기준으로 앞뒤 중복조합을 곱해 합산하는 문항이다.", "level": "상", "item4slot": {"given": ["집합", "함수", "부등식"], "goal": ["개수"], "method": ["중복조합", "합의법칙"], "condition": ["홀수"]}, "hold": ""}
```

## Q11

- 형식: 객관식  
- 배점: 4

### 발문

두 집합 \$X={a,\\ b,\\ c,\\ d}\$, \$Y={1,\\ 2,\\ 3}\$에 대하여 \$X\$에서 \$Y\$로의 함수 \$f\$ 중에서 \$f(a)f(b)f(c)f(d)\\ge 16\$을 만족시키는 함수의 개수는?

### 선지

① \$32\$ ② \$28\$ ③ \$36\$ ④ \$40\$ ⑤ \$44\$

### 정답

①

### 해설

네 함숫값 중 \$3\$의 개수에 따라 경우를 나눈다.

- \$3\$이 \$0\$개일 때: 모두 \$2\$인 \$(2,2,2,2)\$만 가능하므로 \$1\$가지  
- \$3\$이 \$1\$개일 때: \$3\$의 위치 \$4\$가지, 나머지 세 값이 모두 \$2\$여야 곱이 \$24\\ge 16\$이므로 \$4\\times 1 \= 4\$가지  
- \$3\$이 \$2\$개일 때: \$3\$의 위치 \${}*{4}\\mathrm{C}*{2}=6\$가지, 나머지 두 값의 곱이 \$2\$ 이상인 경우는 \$2^2-1=3\$가지이므로 \$6\\times 3 \= 18\$가지  
- \$3\$이 \$3\$개일 때: \$3\$의 위치 \$4\$가지, 나머지 한 값은 \$1\$ 또는 \$2\$이므로 \$4\\times 2 \= 8\$가지  
- \$3\$이 \$4\$개일 때: \$1\$가지

따라서 구하는 함수의 개수는 \$1+4+18+8+1 \= 32\$이다. 정답은 ①이다.

```
"NONE"
```

```
{"sourceQid": "Q11", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H15-PS", "curriculum": "2015", "standardUnitKey": "H15-PS-01", "subUnitKey": "H15-PS-01-COMBINATION", "conceptClusterKey": "COMBINATORICS", "primaryMethod": "네 함숫값 중 3의 개수를 0~4개로 분류해 곱>=16 조건을 만족하는 1+4+18+8+1=32 합산", "decisiveStep": "3의 개수(0,1,2,3,4)별 1+4+18+8+1 = 32", "rpm": {"majorUnit": "경우의 수", "midUnit": "순열과 조합", "l3": "조합", "l4": "선택"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_SELECTION_DISTRIBUTION", "templateKey": "TPL_COMBINATION_SELECTION", "why": "조합 > 선택 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "CASE_BRANCH", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "네 함숫값의 곱이 16 이상인 경우를 치역 원소 3의 개수별로 빠짐없이 분류해 세는 문항이다.", "level": "상", "item4slot": {"given": ["집합", "함수", "부등식"], "goal": ["개수"], "method": ["조합", "합의법칙"], "condition": []}, "hold": ""}
```

## Q12

- 형식: 객관식  
- 배점: 4.1

### 발문

두 집합 \$X={1,\\ 2,\\ 3,\\ 4,\\ 5,\\ 6,\\ 7}\$, \$Y={1,\\ 2,\\ 3,\\ 4}\$에 대하여 함수 \$f:X\\to Y\$ 중에서 '\$x\_1\\in X,\\ x\_2\\in X\$에 대하여 \$x\_1+x\_2=8\$이면 \$f(x\_1)=f(x\_2)\$이다.'를 만족시키는 함수의 개수는?

### 선지

① \$64\$ ② \$128\$ ③ \$256\$ ④ \$512\$ ⑤ \$1024\$

### 정답

③

### 해설

\$x\_1+x\_2=8\$을 만족시키는 \$X\$의 원소 쌍은 \$(1,7),\\ (2,6),\\ (3,5)\$와 \$(4,4)\$이다.

각 쌍 \$(1,7),\\ (2,6),\\ (3,5)\$의 공통 함숫값과 \$f(4)\$를 각각 \$Y\$의 \$4\$개 원소 중에서 고를 수 있으므로 구하는 함수의 개수는 \$4^4 \= 256\$이다. 정답은 ③이다.

```
"NONE"
```

```
{"sourceQid": "Q12", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H15-PS", "curriculum": "2015", "standardUnitKey": "H15-PS-01", "subUnitKey": "H15-PS-01-PERMUTATION", "conceptClusterKey": "COMBINATORICS", "primaryMethod": "x1+x2=8인 3쌍 (1,7),(2,6),(3,5)과 단독 4에 각각 4가지 함숫값을 배정해 4^4=256 산출", "decisiveStep": "독립 그룹 4개에 4가지 선택 -> 4^4 = 256", "rpm": {"majorUnit": "경우의 수", "midUnit": "순열과 조합", "l3": "순열", "l4": "중복·원순열"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_ARRANGEMENT", "templateKey": null, "why": "순열 > 중복·원순열 (FAMILY_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "대칭 합 조건으로 정의역 원소를 동치류로 묶어 중복순열을 적용하는 문항이다.", "level": "중", "item4slot": {"given": ["집합", "함수"], "goal": ["개수"], "method": ["중복순열"], "condition": []}, "hold": ""}
```

## Q13

- 형식: 객관식  
- 배점: 4.1

### 발문

\$(x-a)^8\$의 전개식에서 \$x\$의 계수와 \$x^2\$의 계수의 합이 \$0\$일 때, 양수 \$a\$의 값은?

### 선지

① \$3\$ ② \$\\dfrac{7}{2}\$ ③ \$4\$ ④ \$\\dfrac{9}{2}\$ ⑤ \$5\$

### 정답

②

### 해설

\$(x-a)^8\$의 전개식에서 \$x\$의 계수는 \${}*{8}\\mathrm{C}*{1}(-a)^7 \= \-8a^7\$, \$x^2\$의 계수는 \${}*{8}\\mathrm{C}*{2}(-a)^6 \= 28a^6\$이다.

\$\$-8a^7 \+ 28a^6 \= 4a^6(-2a \+ 7\) \= 0\$\$

\$a\>0\$이므로 \$a \= \\dfrac{7}{2}\$이다. 정답은 ②이다.

```
"NONE"
```

```
{"sourceQid": "Q13", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H15-PS", "curriculum": "2015", "standardUnitKey": "H15-PS-02", "subUnitKey": "H15-PS-02-BINOMIAL_BASIC", "conceptClusterKey": "BINOMIAL_THEOREM", "primaryMethod": "(x-a)^8의 x계수 -8a^7과 x^2계수 28a^6의 합=0에서 양수 a=7/2 산출", "decisiveStep": "-8a^7 + 28a^6 = 0 -> a = 7/2", "rpm": {"majorUnit": "경우의 수", "midUnit": "이항정리", "l3": "이항정리", "l4": "특정 항의 계수"}, "ptTplCandidate": {"problemTypeKey": "PT_BINOMIAL_THEOREM", "templateKey": "TPL_BINOMIAL_TERM_COEFFICIENT", "why": "이항정리 > 특정 항의 계수 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이항정리 두 항의 계수를 구해 미지수 방정식을 푸는 기본 응용 문항이다.", "level": "중", "item4slot": {"given": ["다항식", "합"], "goal": ["값"], "method": ["이항정리"], "condition": []}, "hold": ""}
```

## Q14

- 형식: 객관식  
- 배점: 4.2

### 발문

전체집합 \$U={1,\\ 2,\\ 3,\\ \\cdots,\\ 15}\$의 두 부분집합 \$A,\\ B\$가 \$A\\subset B\$를 만족시키도록 두 집합 \$A,\\ B\$를 정하는 모든 경우의 수는?

### 선지

① \$2^{15}\$ ② \$3^{10}\$ ③ \$2^{30}\$ ④ \$3^{14}\$ ⑤ \$3^{15}\$

### 정답

⑤

### 해설

\$U\$의 각 원소는 \$(1)\$ \$A, B\$ 모두에 속하지 않거나, \$(2)\$ \$B\$에만 속하거나, \$(3)\$ \$A, B\$ 모두에 속하는 \$3\$가지 중 하나에 속한다.

따라서 \$15\$개의 원소마다 \$3\$가지씩 독립적으로 결정되므로 순서쌍 \$(A,\\ B)\$의 개수는 \$3^{15}\$이다. 정답은 ⑤이다.

```
"NONE"
```

```
{"sourceQid": "Q14", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H15-PS", "curriculum": "2015", "standardUnitKey": "H15-PS-01", "subUnitKey": "H15-PS-01-PERMUTATION", "conceptClusterKey": "COMBINATORICS", "primaryMethod": "15개 원소 각각을 A⊂B 벤다이어그램의 3개 영역에 배정하는 중복순열 3^15 계산", "decisiveStep": "원소당 3영역 선택 -> 3^15", "rpm": {"majorUnit": "경우의 수", "midUnit": "순열과 조합", "l3": "순열", "l4": "중복·원순열"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_ARRANGEMENT", "templateKey": null, "why": "순열 > 중복·원순열 (FAMILY_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "포함관계 A⊂B를 만족하는 집합 쌍의 개수를 원소별 3영역 배정 중복순열로 푸는 문항이다.", "level": "하", "item4slot": {"given": ["집합"], "goal": ["개수"], "method": ["중복순열"], "condition": ["부분집합"]}, "hold": ""}
```

## Q15

- 형식: 객관식  
- 배점: 4.2

### 발문

민수와 지수를 포함하여 \$14\$명의 학생으로 구성된 학급에서 민수와 지수를 포함하여 짝수 명의 학생을 택하는 경우의 수를 \$a\$라 하고, 집합 \$A={x\\mid x\\text{는 } 15\\text{ 이하의 자연수}}\$의 부분집합 중 두 원소 \$1,\\ 2\$를 모두 포함하고 원소의 개수가 홀수인 부분집합의 개수를 \$b\$라 할 때, \$b-a\$의 값은?

### 선지

① \$2^9\$ ② \$2^{10}\$ ③ \$2^{12}\$ ④ \$2^{11}\$ ⑤ \$2^{13}\$

### 정답

④

### 해설

민수와 지수 \$2\$명을 먼저 포함하면 남은 \$12\$명 중 짝수 명을 택해야 하므로 \$\$a \= {}*{12}\\mathrm{C}*{0} \+ {}*{12}\\mathrm{C}*{2} \+ \\cdots \+ {}*{12}\\mathrm{C}*{12} \= 2^{12-1} \= 2^{11}\$\$

집합 \$A\$에서 \$1,\\ 2\$를 먼저 포함하면 남은 \$13\$개의 원소 중 홀수 개를 택해야 하므로 \$\$b \= {}*{13}\\mathrm{C}*{1} \+ {}*{13}\\mathrm{C}*{3} \+ \\cdots \+ {}*{13}\\mathrm{C}*{13} \= 2^{13-1} \= 2^{12}\$\$

따라서 \$b - a \= 2^{12} - 2^{11} \= 2^{11}\$이다. 정답은 ④이다.

```
"NONE"
```

```
{"sourceQid": "Q15", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H15-PS", "curriculum": "2015", "standardUnitKey": "H15-PS-02", "subUnitKey": "H15-PS-02-BINOMIAL_COEFFICIENT", "conceptClusterKey": "BINOMIAL_THEOREM", "primaryMethod": "2명 고정 후 남은 12명의 짝수 조합 합 a=2^11과 13명의 홀수 조합 합 b=2^12의 차 2^11 산출", "decisiveStep": "a=2^11, b=2^12 -> b-a = 2^11", "rpm": {"majorUnit": "경우의 수", "midUnit": "이항정리", "l3": "이항계수", "l4": "이항계수의 성질"}, "ptTplCandidate": {"problemTypeKey": "PT_BINOMIAL_THEOREM", "templateKey": "TPL_BINOMIAL_COEFFICIENT_IDENTITY", "why": "이항계수 > 이항계수의 성질 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "특정 원소 포함 조건과 홀짝 개수 조건을 결합해 이항계수 합 공식 2^(n-1)을 적용하는 문항이다.", "level": "중", "item4slot": {"given": ["집합", "원소"], "goal": ["차", "값"], "method": ["이항정리", "조합"], "condition": ["부분집합", "짝수", "홀수"]}, "hold": ""}
```

## Q16

- 형식: 객관식  
- 배점: 4.2

### 발문

\$5\$개의 숫자 \$1,\\ 2,\\ 3,\\ 4,\\ 5\$에서 서로 다른 \$3\$개의 숫자를 택하여 세 자리의 정수를 만들 때, \$320\$보다 큰 짝수가 될 확률은?

### 선지

① \$\\dfrac{11}{60}\$ ② \$\\dfrac{13}{60}\$ ③ \$\\dfrac{1}{4}\$ ④ \$\\dfrac{7}{30}\$ ⑤ \$\\dfrac{3}{10}\$

### 정답

②

### 해설

전체 세 자리 정수의 개수는 \$5\\times 4\\times 3 \= 60\$가지이다.

\$320\$보다 큰 짝수를 백의 자리 숫자별로 세면 다음과 같다.

- 백의 자리가 \$3\$인 경우: \$324,\\ 342,\\ 352,\\ 354\$ (\$4\$개)  
- 백의 자리가 \$4\$인 경우: 일의 자리는 \$2\$뿐이고 십의 자리는 \$1,\\ 3,\\ 5\$ 중 \$1\$개이므로 \$3\$개  
- 백의 자리가 \$5\$인 경우: 일의 자리는 \$2\$ 또는 \$4\$ (\$2\$가지), 십의 자리는 남은 \$3\$개 중 \$1\$개이므로 \$6\$개

따라서 유리한 경우는 \$4+3+6=13\$개이므로 구하는 확률은 \$\\dfrac{13}{60}\$이다. 정답은 ②이다.

```
"NONE"
```

```
{"sourceQid": "Q16", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H15-PS", "curriculum": "2015", "standardUnitKey": "H15-PS-03", "subUnitKey": "H15-PS-03-PROBABILITY_BASIC", "conceptClusterKey": "PROBABILITY", "primaryMethod": "전체 5P3=60에 대해 백의 자리 3, 4, 5별 320 초과 짝수 4+3+6=13개를 나누어 13/60 계산", "decisiveStep": "(4 + 3 + 6) / 60 = 13/60", "rpm": {"majorUnit": "확률", "midUnit": "확률의 뜻과 활용", "l3": "확률의 기본", "l4": "확률 계산"}, "ptTplCandidate": {"problemTypeKey": "PT_PROBABILITY_PROPERTIES_APPLICATION", "templateKey": "TPL_PROBABILITY_BASIC_COUNT_RATIO", "why": "확률의 기본 > 확률 계산 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "CASE_BRANCH", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "크기 제한(320 초과)과 일의 자리 짝수 조건을 동시에 만족하는 세 자리 수를 백의 자리별로 분류해 확률을 구하는 문항이다.", "level": "중", "item4slot": {"given": ["자연수"], "goal": ["확률"], "method": ["순열", "수학적확률", "합의법칙"], "condition": ["짝수"]}, "hold": ""}
```

## Q17

- 형식: 객관식  
- 배점: 4.3

### 발문

오른쪽 그림과 같이 \$6\$등분한 원판의 각 영역에 \$1\$부터 \$6\$까지의 자연수가 각각 하나씩 적혀 있다. 이 원판을 회전시킨 후 화살을 \$2\$번 쏘았을 때, 화살이 꽂힌 영역에 적힌 두 수의 차가 \$2\$보다 클 확률은? (단, 화살은 반드시 원판 내부에 꽂히며, 경계선에 꽂히지 않는다.)

### 선지

① \$\\dfrac{1}{3}\$ ② \$\\dfrac{1}{4}\$ ③ \$\\dfrac{5}{18}\$ ④ \$\\dfrac{7}{18}\$ ⑤ \$\\dfrac{4}{9}\$

### 정답

①

### 해설

두 번 쏜 결과의 전체 순서쌍은 \$6\\times 6 \= 36\$가지이다.

두 수의 차가 \$3,\\ 4,\\ 5\$인 순서쌍의 개수는 각각 \$2(6-3)=6\$, \$2(6-4)=4\$, \$2(6-5)=2\$가지이다.

따라서 유리한 경우는 \$6+4+2 \= 12\$가지이므로 구하는 확률은 \$\\dfrac{12}{36} \= \\dfrac{1}{3}\$이다. 정답은 ①이다.

```
{"figureType": "spinner_6_sectors", "description": "1부터 6까지의 자연수가 각각 하나씩 적힌 6등분된 원판 그림", "elements": ["circle divided into 6 equal sectors", "numbers 1 to 6 in sectors"]}
```

```
{"sourceQid": "Q17", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H15-PS", "curriculum": "2015", "standardUnitKey": "H15-PS-03", "subUnitKey": "H15-PS-03-PROBABILITY_BASIC", "conceptClusterKey": "PROBABILITY", "primaryMethod": "전체 6*6=36 순서쌍 중 차가 3, 4, 5인 6+4+2=12가지의 비율 1/3 산출", "decisiveStep": "(6 + 4 + 2) / 36 = 1/3", "rpm": {"majorUnit": "확률", "midUnit": "확률의 뜻과 활용", "l3": "확률의 기본", "l4": "확률 계산"}, "ptTplCandidate": {"problemTypeKey": "PT_PROBABILITY_PROPERTIES_APPLICATION", "templateKey": "TPL_PROBABILITY_BASIC_COUNT_RATIO", "why": "확률의 기본 > 확률 계산 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "6등분 원판 두 번 시행에서 두 수의 차가 3 이상인 순서쌍을 세어 확률을 구하는 문항이다.", "level": "하", "item4slot": {"given": ["원", "자연수", "차"], "goal": ["확률"], "method": ["수학적확률"], "condition": []}, "hold": ""}
```

## Q18

- 형식: 객관식  
- 배점: 4.4

### 발문

한 개의 주사위를 두 번 던져서 첫 번째 나온 눈의 수를 \$a\$, 두 번째 나온 눈의 수를 \$b\$라 할 때, 방정식 \$x^2-(a+b)x+ab+\\dfrac{9}{4}=0\$의 근이 존재하지 않을 확률은?

### 선지

① \$\\dfrac{1}{2}\$ ② \$\\dfrac{5}{9}\$ ③ \$\\dfrac{2}{3}\$ ④ \$\\dfrac{3}{4}\$ ⑤ \$\\dfrac{7}{9}\$

### 정답

③

### 해설

이차방정식의 판별식 \$D\$가 \$D\<0\$이어야 하므로

\$\$D \= (a+b)^2 - 4\\left(ab+\\frac{9}{4}\\right) \= (a-b)^2 - 9 \< 0 \\implies \|a-b\| \< 3\$\$

주사위 눈 \$a,\\ b\$에 대하여 \$\|a-b\|=0\$ (\$6\$가지), \$\|a-b\|=1\$ (\$10\$가지), \$\|a-b\|=2\$ (\$8\$가지)이므로 조건을 만족시키는 경우는 \$6+10+8 \= 24\$가지이다.

따라서 구하는 확률은 \$\\dfrac{24}{36} \= \\dfrac{2}{3}\$이다. 정답은 ③이다.

```
"NONE"
```

```
{"sourceQid": "Q18", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H15-PS", "curriculum": "2015", "standardUnitKey": "H15-PS-03", "subUnitKey": "H15-PS-03-PROBABILITY_BASIC", "conceptClusterKey": "PROBABILITY", "primaryMethod": "판별식 (a-b)^2-9<0에서 |a-b|<=2인 주사위 순서쌍 6+10+8=24개를 구해 확률 2/3 산출", "decisiveStep": "D = (a-b)^2 - 9 < 0 -> 24/36 = 2/3", "rpm": {"majorUnit": "확률", "midUnit": "확률의 뜻과 활용", "l3": "확률의 기본", "l4": "확률 계산"}, "ptTplCandidate": {"problemTypeKey": "PT_PROBABILITY_PROPERTIES_APPLICATION", "templateKey": "TPL_PROBABILITY_BASIC_COUNT_RATIO", "why": "확률의 기본 > 확률 계산 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차방정식의 허근 조건을 판별식 부등식 |a-b|<3으로 바꾼 뒤 주사위 순서쌍을 세는 문항이다.", "level": "중", "item4slot": {"given": ["주사위", "이차방정식"], "goal": ["확률"], "method": ["판별식", "수학적확률"], "condition": []}, "hold": ""}
```

## Q19

- 형식: 객관식  
- 배점: 4.4

### 발문

다음 조건을 만족시키는 음이 아닌 정수 \$a,\\ b,\\ c,\\ d,\\ e\$의 모든 순서쌍 \$(a,\\ b,\\ c,\\ d,\\ e)\$의 개수는?

(가) \$a+b+c+d+e=11\$ (나) \$\|a-b+c-d+e\|\\le 1\$

### 선지

① \$295\$ ② \$305\$ ③ \$310\$ ④ \$315\$ ⑤ \$325\$

### 정답

④

### 해설

\$u \= a+c+e,\\ v \= b+d\$라 두면 \$u+v \= 11\$이고 \$\|u-v\|\\le 1\$이므로 \$(u,\\ v)\$는 \$(5,\\ 6)\$ 또는 \$(6,\\ 5)\$이다.

- \$(u,\\ v) \= (5,\\ 6)\$: \${}*{3}\\mathrm{H}*{5} \\times {}*{2}\\mathrm{H}*{6} \= {}*{7}\\mathrm{C}*{2} \\times 7 \= 21 \\times 7 \= 147\$  
- \$(u,\\ v) \= (6,\\ 5)\$: \${}*{3}\\mathrm{H}*{6} \\times {}*{2}\\mathrm{H}*{5} \= {}*{8}\\mathrm{C}*{2} \\times 6 \= 28 \\times 6 \= 168\$

따라서 구하는 순서쌍의 개수는 \$147 \+ 168 \= 315\$이다. 정답은 ④이다.

```
"NONE"
```

```
{"sourceQid": "Q19", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H15-PS", "curriculum": "2015", "standardUnitKey": "H15-PS-01", "subUnitKey": "H15-PS-01-COMBINATION", "conceptClusterKey": "COMBINATORICS", "primaryMethod": "u=a+c+e, v=b+d 치환으로 (u,v)=(5,6),(6,5)를 구하고 3Hu*2Hv의 합 147+168=315 계산", "decisiveStep": "(5,6) 21*7 + (6,5) 28*6 = 315", "rpm": {"majorUnit": "경우의 수", "midUnit": "순열과 조합", "l3": "중복조합", "l4": "정수해 개수"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_SELECTION_DISTRIBUTION", "templateKey": "TPL_REPEATED_COMBINATION_DISTRIBUTION", "why": "중복조합 > 정수해 개수 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "CASE_BRANCH", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "교대합 절댓값 조건을 두 부분합의 차로 변환해 케이스별 중복조합 곱을 합산하는 문항이다.", "level": "상", "item4slot": {"given": ["방정식", "부등식"], "goal": ["순서쌍", "개수"], "method": ["중복조합", "곱의법칙", "합의법칙"], "condition": []}, "hold": ""}
```

## Q20

- 형식: 객관식  
- 배점: 4.5

### 발문

방정식 \$a+b+c+d=15\$를 만족시키는 자연수 \$a,\\ b,\\ c,\\ d\$의 순서쌍 \$(a,\\ b,\\ c,\\ d)\$ 중에서 \$a,\\ b,\\ c,\\ d\$ 중 \$3\$개는 홀수, \$1\$개는 짝수인 순서쌍의 개수는?

### 선지

① \$140\$ ② \$168\$ ③ \$196\$ ④ \$210\$ ⑤ \$224\$

### 정답

⑤

### 해설

짝수인 변수를 선택하는 방법은 \$4\$가지이다. 그 변수를 \$2y\$ (\$y\\ge 1\$), 나머지 세 홀수 변수를 \$2x\_1+1,\\ 2x\_2+1,\\ 2x\_3+1\$ (\$x\_i\\ge 0\$)이라 하면

\$\$2(x\_1+x\_2+x\_3+y)+3 \= 15 \\implies x\_1+x\_2+x\_3+y \= 6\$\$

\$y' \= y-1 \\ge 0\$으로 치환하면 \$x\_1+x\_2+x\_3+y' \= 5\$이므로 해의 개수는 \${}*{4}\\mathrm{H}*{5} \= {}*{8}\\mathrm{C}*{5} \= {}*{8}\\mathrm{C}*{3} \= 56\$개이다.

따라서 구하는 순서쌍의 개수는 \$4 \\times 56 \= 224\$이다. 정답은 ⑤이다.

```
"NONE"
```

```
{"sourceQid": "Q20", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H15-PS", "curriculum": "2015", "standardUnitKey": "H15-PS-01", "subUnitKey": "H15-PS-01-COMBINATION", "conceptClusterKey": "COMBINATORICS", "primaryMethod": "짝수 위치 4가지에 2y(y>=1)와 세 홀수 2x_i+1을 대입해 x1+x2+x3+y'=5의 해 4H5=56을 곱해 224 산출", "decisiveStep": "4 * 4H5 = 4 * 56 = 224", "rpm": {"majorUnit": "경우의 수", "midUnit": "순열과 조합", "l3": "중복조합", "l4": "정수해 개수"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_SELECTION_DISTRIBUTION", "templateKey": "TPL_REPEATED_COMBINATION_DISTRIBUTION", "why": "중복조합 > 정수해 개수 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "홀짝 개수 조건이 주어진 부정방정식을 2x+1, 2y'+2 치환으로 음이 아닌 정수해 중복조합으로 바꾸는 문항이다.", "level": "중", "item4slot": {"given": ["방정식", "자연수"], "goal": ["순서쌍", "개수"], "method": ["중복조합", "곱의법칙"], "condition": ["홀수", "짝수"]}, "hold": ""}
```

## Q21

- 형식: 서답형  
- 배점: 6

### 발문

\[주관식1 (서술형)\] 한 개의 주사위를 두 번 던져서 나오는 눈의 수를 차례로 \$a,\\ b\$라 할 때, \$\|a-4\|+\|b-4\|=3\$일 확률을 구하는 풀이 과정과 답을 쓰시오.

### 선지

없음

### 정답

\$\\dfrac{5}{18}\$

### 해설

전체 순서쌍 \$(a,\\ b)\$의 개수는 \$6\\times 6 \= 36\$가지이다.

\$a \\in {1, 2, 3, 4, 5, 6}\$에 대하여 \$\|a-4\|+\|b-4\|=3\$을 만족시키는 \$b \\in {1, 2, 3, 4, 5, 6}\$를 구하면 다음과 같다.

- \$a=1\$ (\$\|a-4\|=3\$): \$b=4\$ (\$1\$개)  
- \$a=2\$ (\$\|a-4\|=2\$): \$b=3,\\ 5\$ (\$2\$개)  
- \$a=3\$ (\$\|a-4\|=1\$): \$b=2,\\ 6\$ (\$2\$개)  
- \$a=4\$ (\$\|a-4\|=0\$): \$b=1\$ (\$1\$개)  
- \$a=5\$ (\$\|a-4\|=1\$): \$b=2,\\ 6\$ (\$2\$개)  
- \$a=6\$ (\$\|a-4\|=2\$): \$b=3,\\ 5\$ (\$2\$개)

유리한 경우는 \$1+2+2+1+2+2 \= 10\$가지이므로 구하는 확률은 \$\\dfrac{10}{36} \= \\dfrac{5}{18}\$이다.

```
"NONE"
```

```
{"sourceQid": "Q21", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H15-PS", "curriculum": "2015", "standardUnitKey": "H15-PS-03", "subUnitKey": "H15-PS-03-PROBABILITY_BASIC", "conceptClusterKey": "PROBABILITY", "primaryMethod": "전체 36가지 중 a=1..6별로 |b-4|=3-|a-4|를 만족하는 b 개수 10가지를 세어 확률 5/18 산출", "decisiveStep": "a=1..6별 1+2+2+1+2+2=10가지 -> 10/36 = 5/18", "rpm": {"majorUnit": "확률", "midUnit": "확률의 뜻과 활용", "l3": "확률의 기본", "l4": "확률 계산"}, "ptTplCandidate": {"problemTypeKey": "PT_PROBABILITY_PROPERTIES_APPLICATION", "templateKey": "TPL_PROBABILITY_BASIC_COUNT_RATIO", "why": "확률의 기본 > 확률 계산 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "CASE_BRANCH", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "주사위 눈 범위 1~6을 벗어나지 않도록 절댓값 방정식의 해를 값별로 조사하는 서술형 문항이다.", "level": "중", "item4slot": {"given": ["주사위", "절댓값", "방정식"], "goal": ["확률"], "method": ["수학적확률", "합의법칙"], "condition": []}, "hold": ""}
```

## Q22

- 형식: 서답형  
- 배점: 7

### 발문

\[주관식2 (서술형)\] \$(x+a)^7\$의 전개식에서 \$x^2\$의 계수가 \$672\$이고 \$x^4\$의 계수가 \$b\$일 때, \$a+b\$의 값을 구하는 풀이 과정과 답을 쓰시오. (단, \$a,\\ b\$는 실수 상수)

### 선지

없음

### 정답

282

### 해설

\$(x+a)^7\$의 일반항은 \${}*{7}\\mathrm{C}*{r}, x^{7-r} a^r\$이다.

\$x^2\$항은 \$r=5\$일 때이므로 계수는 \${}*{7}\\mathrm{C}*{5}, a^5 \= 21a^5 \= 672\$이다. 따라서 \$a^5 \= 32\$이고 실수 \$a \= 2\$이다.

\$x^4\$항은 \$r=3\$일 때이므로 \$b \= {}*{7}\\mathrm{C}*{3}, 2^3 \= 35 \\times 8 \= 280\$이다.

따라서 \$a+b \= 2+280 \= 282\$이다.

```
"NONE"
```

```
{"sourceQid": "Q22", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H15-PS", "curriculum": "2015", "standardUnitKey": "H15-PS-02", "subUnitKey": "H15-PS-02-BINOMIAL_BASIC", "conceptClusterKey": "BINOMIAL_THEOREM", "primaryMethod": "x^2 계수 21a^5=672에서 실수 a=2를 구하고 x^4 계수 b=35*8=280을 더해 282 산출", "decisiveStep": "7C5*a^5 = 672 -> a=2, b = 7C3*2^3 = 280", "rpm": {"majorUnit": "경우의 수", "midUnit": "이항정리", "l3": "이항정리", "l4": "특정 항의 계수"}, "ptTplCandidate": {"problemTypeKey": "PT_BINOMIAL_THEOREM", "templateKey": "TPL_BINOMIAL_TERM_COEFFICIENT", "why": "이항정리 > 특정 항의 계수 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이항정리 일반항으로 미지수 a를 먼저 결정한 뒤 다른 항의 계수 b를 구하는 표준 서술형 문항이다.", "level": "중", "item4slot": {"given": ["다항식", "계수"], "goal": ["합", "값"], "method": ["이항정리"], "condition": []}, "hold": ""}
```

## Q23

- 형식: 서답형  
- 배점: 7

### 발문

\[주관식3 (서술형)\] 두 집합 \$X={1,\\ 2,\\ 3,\\ 4,\\ 5,\\ 6}\$, \$Y={1,\\ 2,\\ 3,\\ 4}\$에 대하여 다음 조건을 만족시키는 \$X\$에서 \$Y\$로의 함수 \$f\$의 개수를 구하는 풀이 과정과 답을 쓰시오.

(가) \$\\sqrt{f(1)\\times f(2)\\times f(3)}\$의 값은 자연수이다. (나) 집합 \$X\$의 임의의 두 원소 \$x\_1,\\ x\_2\$에 대하여 \$x\_1\<x\_2\$이면 \$f(x\_1)\\le f(x\_2)\$이다.

### 선지

없음

### 정답

39

### 해설

조건 (나)에서 \$1\\le f(1)\\le f(2)\\le f(3)\\le f(4)\\le f(5)\\le f(6)\\le 4\$이다.

\$(r,\\ s,\\ t) \= (f(1),\\ f(2),\\ f(3))\$ (\$1\\le r\\le s\\le t\\le 4\$)라 할 때, 조건 (가)에 의해 \$rst\$가 완전제곱수가 되는 순서쌍 \$(r,\\ s,\\ t)\$를 \$t\$의 값에 따라 찾으면 다음과 같다.

- \$t=1\$: \$(1,1,1)\$ (\$1\$개) \$\\to\$ \$(f(4),f(5),f(6))\$은 \${}*{4}\\mathrm{H}*{3} \= {}*{6}\\mathrm{C}*{3} \= 20\$가지  
- \$t=2\$: \$(1,2,2)\$ (\$1\$개) \$\\to\$ \$(f(4),f(5),f(6))\$은 \${}*{3}\\mathrm{H}*{3} \= {}*{5}\\mathrm{C}*{3} \= 10\$가지  
- \$t=3\$: \$(1,3,3)\$ (\$1\$개) \$\\to\$ \$(f(4),f(5),f(6))\$은 \${}*{2}\\mathrm{H}*{3} \= {}*{4}\\mathrm{C}*{3} \= 4\$가지  
- \$t=4\$: \$(1,1,4),\\ (1,4,4),\\ (2,2,4),\\ (3,3,4),\\ (4,4,4)\$ (\$5\$개) \$\\to\$ \$(f(4),f(5),f(6))\$은 \${}*{1}\\mathrm{H}*{3} \= 1\$가지

따라서 구하는 함수의 개수는 \$1\\times 20 \+ 1\\times 10 \+ 1\\times 4 \+ 5\\times 1 \= 39\$이다.

```
"NONE"
```

```
{"sourceQid": "Q23", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H15-PS", "curriculum": "2015", "standardUnitKey": "H15-PS-01", "subUnitKey": "H15-PS-01-COMBINATION", "conceptClusterKey": "COMBINATORICS", "primaryMethod": "f(1)f(2)f(3)이 제곱수인 비내림차순 8쌍을 f(3)=t별로 분류하고 f(4..6) 중복조합 (5-t)H3을 곱해 39 산출", "decisiveStep": "1*4H3 + 1*3H3 + 1*2H3 + 5*1H3 = 20+10+4+5 = 39", "rpm": {"majorUnit": "경우의 수", "midUnit": "순열과 조합", "l3": "중복조합", "l4": "중복을 허용한 선택"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_SELECTION_DISTRIBUTION", "templateKey": "TPL_REPEATED_COMBINATION_DISTRIBUTION", "why": "중복조합 > 중복을 허용한 선택 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "제곱수 곱 조건을 만족하는 앞 3개 함숫값의 비내림차순 쌍을 끝값별로 열거하고 뒤 3개를 중복조합으로 세는 고난도 서술형 문항이다.", "level": "상", "item4slot": {"given": ["집합", "함수", "자연수"], "goal": ["개수"], "method": ["중복조합", "곱의법칙", "합의법칙"], "condition": []}, "hold": ""}
```

