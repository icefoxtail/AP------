

```
{"stem": "24_강남여고_1학기_중간_고2_확률과통계_유사", "sourceArchiveFile": "original/high/h2/1mid/24_강남여고_1학기_중간_고2_확률과통계.js", "examFolder": "1mid", "grade": "고2", "subject": "확률과 통계", "curriculum": "2015", "questionCount": 24, "totalScore": 100, "generatedAt": "2026-11-20"}
```

## Q01

- 형식: 객관식  
- 배점: 3.7

### 발문

\${}*{4}\\Pi*{3} \+ {}*{6}\\mathrm{H}*{3}\$의 값은?

### 선지

① \$108\$ ② \$120\$ ③ \$112\$ ④ \$124\$ ⑤ \$132\$

### 정답

②

### 해설

\$\${}*{4}\\Pi*{3} \= 4^3 \= 64, \\qquad {}*{6}\\mathrm{H}*{3} \= {}*{6+3-1}\\mathrm{C}*{3} \= {}*{8}\\mathrm{C}*{3} \= \\frac{8\\times 7\\times 6}{3\\times 2\\times 1} \= 56\$\$

따라서 \${}*{4}\\Pi*{3}+{}*{6}\\mathrm{H}*{3} \= 64+56 \= 120\$이다. 정답은 ②이다.

```
"NONE"
```

```
{"sourceQid": "Q01", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H15-PS", "curriculum": "2015", "standardUnitKey": "H15-PS-01", "subUnitKey": "H15-PS-01-PERMUTATION", "conceptClusterKey": "COMBINATORICS", "primaryMethod": "중복순열 4^3=64와 중복조합 8C3=56을 각각 계산하여 120 합산", "decisiveStep": "4^3 + 8C3 = 64 + 56 = 120", "rpm": {"majorUnit": "경우의 수", "midUnit": "순열과 조합", "l3": "순열", "l4": "중복·원순열"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_ARRANGEMENT", "templateKey": null, "why": "순열 > 중복·원순열 (FAMILY_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "중복순열과 중복조합의 기본 공식을 바로 계산해 더하는 기초 문항이다.", "level": "하", "item4slot": {"given": ["합"], "goal": ["값"], "method": ["중복순열", "중복조합"], "condition": []}, "hold": ""}
```

## Q02

- 형식: 객관식  
- 배점: 3.8

### 발문

방정식 \$x+y+z=12\$에 대하여 음이 아닌 정수해의 개수는?

### 선지

① \$78\$ ② \$84\$ ③ \$88\$ ④ \$91\$ ⑤ \$105\$

### 정답

④

### 해설

방정식 \$x+y+z=12\$의 음이 아닌 정수해의 개수는 \${}*{3}\\mathrm{H}*{12}\$와 같다.

\$\${}*{3}\\mathrm{H}*{12} \= {}*{3+12-1}\\mathrm{C}*{12} \= {}*{14}\\mathrm{C}*{2} \= \\frac{14\\times 13}{2} \= 91\$\$

따라서 정답은 ④이다.

```
"NONE"
```

```
{"sourceQid": "Q02", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H15-PS", "curriculum": "2015", "standardUnitKey": "H15-PS-01", "subUnitKey": "H15-PS-01-COMBINATION", "conceptClusterKey": "COMBINATORICS", "primaryMethod": "x+y+z=12의 음이 아닌 정수해 개수를 중복조합 3H12=14C2=91로 계산", "decisiveStep": "3H12 = 14C2 = 91", "rpm": {"majorUnit": "경우의 수", "midUnit": "순열과 조합", "l3": "중복조합", "l4": "정수해 개수"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_SELECTION_DISTRIBUTION", "templateKey": "TPL_REPEATED_COMBINATION_DISTRIBUTION", "why": "중복조합 > 정수해 개수 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "음이 아닌 정수해의 개수에 중복조합 공식을 바로 적용하는 기본 문항이다.", "level": "하", "item4slot": {"given": ["방정식"], "goal": ["정수해", "개수"], "method": ["중복조합"], "condition": []}, "hold": ""}
```

## Q03

- 형식: 객관식  
- 배점: 3.9

### 발문

\$(2x+3)^5\$의 전개식에서 \$x^3\$의 계수는?

### 선지

① \$720\$ ② \$360\$ ③ \$540\$ ④ \$960\$ ⑤ \$1080\$

### 정답

①

### 해설

이항정리에 의하여 \$(2x+3)^5\$의 전개식에서 \$x^3\$항은 \${}*{5}\\mathrm{C}*{3}(2x)^3\\cdot 3^2\$이다.

\$\${}*{5}\\mathrm{C}*{3}\\cdot 2^3\\cdot 3^2 \= 10 \\times 8 \\times 9 \= 720\$\$

따라서 정답은 ①이다.

```
"NONE"
```

```
{"sourceQid": "Q03", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H15-PS", "curriculum": "2015", "standardUnitKey": "H15-PS-02", "subUnitKey": "H15-PS-02-BINOMIAL_BASIC", "conceptClusterKey": "BINOMIAL_THEOREM", "primaryMethod": "이항정리 일반항 5C3*(2x)^3*3^2을 전개해 계수 720 산출", "decisiveStep": "5C3 * 2^3 * 3^2 = 720", "rpm": {"majorUnit": "경우의 수", "midUnit": "이항정리", "l3": "이항정리", "l4": "특정 항의 계수"}, "ptTplCandidate": {"problemTypeKey": "PT_BINOMIAL_THEOREM", "templateKey": "TPL_BINOMIAL_TERM_COEFFICIENT", "why": "이항정리 > 특정 항의 계수 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이항정리 일반항에서 특정 차수 항의 계수를 구하는 표준 문항이다.", "level": "하", "item4slot": {"given": ["다항식"], "goal": ["계수"], "method": ["이항정리"], "condition": []}, "hold": ""}
```

## Q04

- 형식: 객관식  
- 배점: 3.9

### 발문

\$1,\\ 2,\\ 3,\\ 4,\\ 5\$에서 중복을 허용하여 \$3\$개를 뽑아 만들 수 있는 모든 세 자리 자연수의 개수는?

### 선지

① \$60\$ ② \$75\$ ③ \$100\$ ④ \$120\$ ⑤ \$125\$

### 정답

⑤

### 해설

백의 자리, 십의 자리, 일의 자리에 각각 \$5\$가지 숫자를 중복 허용하여 놓을 수 있으므로

\$\${}*{5}\\Pi*{3} \= 5^3 \= 125\$\$

따라서 정답은 ⑤이다.

```
"NONE"
```

```
{"sourceQid": "Q04", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H15-PS", "curriculum": "2015", "standardUnitKey": "H15-PS-01", "subUnitKey": "H15-PS-01-PERMUTATION", "conceptClusterKey": "COMBINATORICS", "primaryMethod": "5개 숫자에서 중복 허용해 세 자리 자연수를 만드는 중복순열 5^3=125 계산", "decisiveStep": "5Pi3 = 5^3 = 125", "rpm": {"majorUnit": "경우의 수", "midUnit": "순열과 조합", "l3": "순열", "l4": "중복·원순열"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_ARRANGEMENT", "templateKey": null, "why": "순열 > 중복·원순열 (FAMILY_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "0이 없는 숫자 집합으로 중복순열 5^3을 바로 계산하는 기본 문항이다.", "level": "하", "item4slot": {"given": ["자연수"], "goal": ["개수"], "method": ["중복순열"], "condition": []}, "hold": ""}
```

## Q05

- 형식: 객관식  
- 배점: 3.9

### 발문

흰 공 \$4\$개와 검은 공 \$5\$개가 들어 있는 주머니에서 임의로 공 \$3\$개를 동시에 꺼낼 때, 흰 공 \$1\$개와 검은 공 \$2\$개가 나올 확률은?

### 선지

① \$\\dfrac{8}{21}\$ ② \$\\dfrac{3}{7}\$ ③ \$\\dfrac{10}{21}\$ ④ \$\\dfrac{11}{21}\$ ⑤ \$\\dfrac{4}{7}\$

### 정답

③

### 해설

전체 \$9\$개의 공 중 \$3\$개를 꺼내는 경우의 수는 \${}*{9}\\mathrm{C}*{3} \= \\dfrac{9\\times 8\\times 7}{3\\times 2\\times 1} \= 84\$가지이다.

흰 공 \$4\$개 중 \$1\$개, 검은 공 \$5\$개 중 \$2\$개를 꺼내는 경우의 수는 \${}*{4}\\mathrm{C}*{1}\\cdot {}*{5}\\mathrm{C}*{2} \= 4 \\times 10 \= 40\$가지이다.

따라서 구하는 확률은 \$\\dfrac{40}{84} \= \\dfrac{10}{21}\$이다. 정답은 ③이다.

```
"NONE"
```

```
{"sourceQid": "Q05", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H15-PS", "curriculum": "2015", "standardUnitKey": "H15-PS-03", "subUnitKey": "H15-PS-03-PROBABILITY_BASIC", "conceptClusterKey": "PROBABILITY", "primaryMethod": "전체 경우 9C3=84에 대한 흰 공 1·검은 공 2 경우 4C1*5C2=40의 비율 10/21 계산", "decisiveStep": "(4C1 * 5C2) / 9C3 = 40/84 = 10/21", "rpm": {"majorUnit": "확률", "midUnit": "확률의 뜻과 활용", "l3": "확률의 기본", "l4": "확률 계산"}, "ptTplCandidate": {"problemTypeKey": "PT_PROBABILITY_PROPERTIES_APPLICATION", "templateKey": "TPL_PROBABILITY_BASIC_COUNT_RATIO", "why": "확률의 기본 > 확률 계산 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "조합으로 근원사건과 해당 사건의 경우의 수를 세어 수학적 확률을 구하는 표준 문항이다.", "level": "하", "item4slot": {"given": ["사건"], "goal": ["확률"], "method": ["조합", "수학적확률"], "condition": []}, "hold": ""}
```

## Q06

- 형식: 객관식  
- 배점: 3.9

### 발문

\$6\$명의 학생과 \$3\$명의 교사가 원탁에 둘러앉을 때, 교사가 이웃하지 않게 앉는 경우의 수는? (단, 회전하여 일치하는 것은 같은 것으로 본다.)

### 선지

① \$14400\$ ② \$7200\$ ③ \$10800\$ ④ \$12000\$ ⑤ \$17280\$

### 정답

①

### 해설

먼저 학생 \$6\$명을 원탁에 앉히는 경우의 수는 \$(6-1)\! \= 5\! \= 120\$가지이다.

학생 사이의 \$6\$개의 자리 중 \$3\$개의 자리를 택하여 교사 \$3\$명을 배열하는 경우의 수는 \${}*{6}\\mathrm{P}*{3} \= 6 \\times 5 \\times 4 \= 120\$가지이다.

따라서 구하는 경우의 수는 \$120 \\times 120 \= 14400\$이다. 정답은 ①이다.

```
"NONE"
```

```
{"sourceQid": "Q06", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H15-PS", "curriculum": "2015", "standardUnitKey": "H15-PS-01", "subUnitKey": "H15-PS-01-PERMUTATION", "conceptClusterKey": "COMBINATORICS", "primaryMethod": "학생 6명 원순열 5!=120 후 사이 6자리에 교사 3명을 6P3=120으로 배치해 14400 계산", "decisiveStep": "5! * 6P3 = 120 * 120 = 14400", "rpm": {"majorUnit": "경우의 수", "midUnit": "순열과 조합", "l3": "순열", "l4": "중복·원순열"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_ARRANGEMENT", "templateKey": null, "why": "순열 > 중복·원순열 (FAMILY_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이웃하지 않는 원순열을 기준 집단 원순열 후 사이 공간 배치로 해결하는 문항이다.", "level": "중", "item4slot": {"given": ["원", "집합"], "goal": ["개수"], "method": ["원순열", "순열", "곱의법칙"], "condition": ["이웃"]}, "hold": ""}
```

## Q07

- 형식: 객관식  
- 배점: 3.9

### 발문

서로 다른 과일 \$6\$개를 \$3\$개의 그릇 \$\\mathrm{A,\\ B,\\ C}\$에 남김없이 담으려고 할 때, 그릇 \$\\mathrm{A}\$에는 과일 \$2\$개만 담는 경우의 수는? (단, 과일을 하나도 담지 않은 그릇이 있을 수 있다.)

### 선지

① \$180\$ ② \$210\$ ③ \$225\$ ④ \$240\$ ⑤ \$270\$

### 정답

④

### 해설

그릇 \$\\mathrm{A}\$에 담을 과일 \$2\$개를 선택하는 경우의 수는 \${}*{6}\\mathrm{C}*{2} \= 15\$가지이다.

남은 서로 다른 과일 \$4\$개는 각각 그릇 \$\\mathrm{B}\$ 또는 \$\\mathrm{C}\$에 담을 수 있으므로 \${}*{2}\\Pi*{4} \= 2^4 \= 16\$가지이다.

따라서 구하는 경우의 수는 \$15 \\times 16 \= 240\$이다. 정답은 ④이다.

```
"NONE"
```

```
{"sourceQid": "Q07", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H15-PS", "curriculum": "2015", "standardUnitKey": "H15-PS-01", "subUnitKey": "H15-PS-01-COMBINATION", "conceptClusterKey": "COMBINATORICS", "primaryMethod": "A에 담을 2개 선택 6C2=15와 나머지 4개를 B,C에 중복 배정 2^4=16을 곱해 240 산출", "decisiveStep": "6C2 * 2^4 = 15 * 16 = 240", "rpm": {"majorUnit": "경우의 수", "midUnit": "순열과 조합", "l3": "조합", "l4": "분할·분배"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_SELECTION_DISTRIBUTION", "templateKey": "TPL_COMBINATION_SELECTION", "why": "조합 > 분할·분배 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "특정 그릇의 개수를 조합으로 먼저 고정한 뒤 나머지 대상을 중복순열로 분배하는 문항이다.", "level": "중", "item4slot": {"given": ["개수"], "goal": ["개수"], "method": ["조합", "중복순열", "곱의법칙"], "condition": []}, "hold": ""}
```

## Q08

- 형식: 객관식  
- 배점: 4

### 발문

확률에 대한 다음 설명 중 옳은 것의 개수는?

ㄱ. 어떤 시행에서 일어날 수 있는 모든 결과의 집합을 표본공간이라 한다. ㄴ. 임의의 사건 \$\\mathrm{A}\$에 대하여 \$0 \< \\mathrm{P}(\\mathrm{A}) \< 1\$이다. ㄷ. 어떤 시행을 \$n\$번 반복하여 사건 \$\\mathrm{A}\$가 \$r\_n\$번 일어났을 때, \$n\$을 한없이 크게 함에 따라 상대도수 \$\\dfrac{r\_n}{n}\$이 일정한 값 \$p\$에 가까워지면 이 값 \$p\$를 사건 \$\\mathrm{A}\$의 통계적 확률이라 한다. ㄹ. 임의의 사건 \$\\mathrm{A}\$에 대하여 \$\\mathrm{P}(\\mathrm{A}^c) \= 1 - \\mathrm{P}(\\mathrm{A})\$이다. ㅁ. 두 사건 \$\\mathrm{A,\\ B}\$가 서로 배반사건이면 \$\\mathrm{P}(\\mathrm{A}\\cup\\mathrm{B}) \= \\mathrm{P}(\\mathrm{A}) \+ \\mathrm{P}(\\mathrm{B}) - 1\$이다.

### 선지

① \$1\$개 ② \$3\$개 ③ \$2\$개 ④ \$4\$개 ⑤ \$5\$개

### 정답

②

### 해설

- ㄱ: 어떤 시행에서 일어날 수 있는 모든 결과의 집합이 표본공간이다. (참)  
- ㄴ: 공사건과 전사건에 대하여 \$\\mathrm{P}(\\varnothing)=0\$, \$\\mathrm{P}(\\mathrm{S})=1\$이므로 \$0 \\le \\mathrm{P}(\\mathrm{A}) \\le 1\$이다. (거짓)  
- ㄷ: 상대도수 \$\\dfrac{r\_n}{n}\$의 극한값을 통계적 확률이라 한다. (참)  
- ㄹ: 여사건의 확률 성질에 의해 참이다. (참)  
- ㅁ: 두 사건이 배반사건이면 \$\\mathrm{P}(\\mathrm{A}\\cap\\mathrm{B})=0\$이므로 \$\\mathrm{P}(\\mathrm{A}\\cup\\mathrm{B}) \= \\mathrm{P}(\\mathrm{A})+\\mathrm{P}(\\mathrm{B})\$이다. (거짓)

따라서 옳은 것은 ㄱ, ㄷ, ㄹ의 \$3\$개이다. 정답은 ②이다.

```
"NONE"
```

```
{"sourceQid": "Q08", "variationType": "CONDITION", "standardCourse": "확률과 통계", "courseKey": "H15-PS", "curriculum": "2015", "standardUnitKey": "H15-PS-03", "subUnitKey": "H15-PS-03-PROBABILITY_BASIC", "conceptClusterKey": "PROBABILITY", "primaryMethod": "표본공간·확률의 범위·통계적 확률·여사건·배반사건 덧셈정리의 정의를 판별해 참 3개 도출", "decisiveStep": "ㄱ, ㄷ, ㄹ 참 / ㄴ(등호 누락), ㅁ(-1 오류) 거짓 판별", "rpm": {"majorUnit": "확률", "midUnit": "확률의 뜻과 활용", "l3": "확률의 기본", "l4": "표본공간과 사건"}, "ptTplCandidate": {"problemTypeKey": "PT_PROBABILITY_PROPERTIES_APPLICATION", "templateKey": "TPL_PROBABILITY_BASIC_COUNT_RATIO", "why": "확률의 기본 > 표본공간과 사건 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "확률의 기본 용어와 성질(등호, 배반사건, 통계적 확률)의 참·거짓을 확인하는 개념 문항이다.", "level": "하", "item4slot": {"given": ["표본공간", "사건"], "goal": ["개수"], "method": ["여사건", "확률의덧셈정리"], "condition": ["배반사건"]}, "hold": ""}
```

## Q09

- 형식: 객관식  
- 배점: 4

### 발문

그림과 같이 직사각형 모양의 일부가 빠진 도로망이 있다. 이 도로망을 따라 \$\\mathrm{A}\$지점에서 출발하여 \$\\mathrm{B}\$지점까지 최단 거리로 가는 경우의 수는?

### 선지

① \$50\$ ② \$51\$ ③ \$52\$ ④ \$53\$ ⑤ \$54\$

### 정답

⑤

### 해설

격자의 각 교차점 \$(x,\\ y)\$ (\$0\\le x\\le 5,\\ 0\\le y\\le 3\$)에 대하여 \$\\mathrm{A}(0,\\ 0)\$에서 출발해 오른쪽·위쪽으로만 이동하여 \$\\mathrm{B}(5,\\ 3)\$까지 가는 경로 수를 세면 다음과 같다. (단, 왼쪽 위 모서리 \$(0,\\ 3)\$과 오른쪽 아래 모서리 \$(5,\\ 0)\$은 끊어져 있다.)

- \$y=0\$: \$(0,0)=1,\\ (1,0)=1,\\ (2,0)=1,\\ (3,0)=1,\\ (4,0)=1\$  
- \$y=1\$: \$(0,1)=1,\\ (1,1)=2,\\ (2,1)=3,\\ (3,1)=4,\\ (4,1)=5,\\ (5,1)=5\$  
- \$y=2\$: \$(0,2)=1,\\ (1,2)=3,\\ (2,2)=6,\\ (3,2)=10,\\ (4,2)=15,\\ (5,2)=20\$  
- \$y=3\$: \$(1,3)=3,\\ (2,3)=9,\\ (3,3)=19,\\ (4,3)=34,\\ (5,3)=54\$

따라서 최단 경로의 수는 \$54\$이다. 정답은 ⑤이다.

```
{"figureType": "grid_shortest_path_cut_corners", "description": "가로 5칸, 세로 3칸의 직사각형 도로망에서 왼쪽 위 모서리(0,3)와 오른쪽 아래 모서리(5,0) 칸의 외곽선이 빠진 도로망. 왼쪽 아래에 A(0,0), 오른쪽 위에 B(5,3)가 표시되어 있다.", "elements": ["5x3 grid with missing top-left corner (0,3) and bottom-right corner (5,0)", "point A at (0,0)", "point B at (5,3)"]}
```

```
{"sourceQid": "Q09", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H15-PS", "curriculum": "2015", "standardUnitKey": "H15-PS-01", "subUnitKey": "H15-PS-01-PERMUTATION", "conceptClusterKey": "COMBINATORICS", "primaryMethod": "모서리 (0,3)과 (5,0)이 빠진 5x3 격자 도로망의 각 교차점에 합의 법칙을 순차 적용해 B(5,3)=54 산출", "decisiveStep": "각 교차점 합의 법칙 누적으로 B(5,3) = 54 도출", "rpm": {"majorUnit": "경우의 수", "midUnit": "순열과 조합", "l3": "순열", "l4": "일렬 배열"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_ARRANGEMENT", "templateKey": "TPL_PERMUTATION_STANDARD_CONSTRAINT", "why": "순열 > 일렬 배열 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "일부 모서리가 비어 있는 격자 도로망에서 교차점마다 합의 법칙으로 경로 수를 누적해야 하는 문항이다.", "level": "중", "item4slot": {"given": ["직사각형"], "goal": ["개수"], "method": ["합의법칙"], "condition": ["최단거리"]}, "hold": ""}
```

## Q10

- 형식: 객관식  
- 배점: 4

### 발문

다음 두 식을 만족시키는 값 \$\\mathrm{A},\\ \\mathrm{B}\$에 대하여 \$\\mathrm{A}+\\mathrm{B}\$의 값은?

\$\${}*{9}\\mathrm{C}*{0} \+ {}*{9}\\mathrm{C}*{2} \+ {}*{9}\\mathrm{C}*{4} \+ {}*{9}\\mathrm{C}*{6} \+ {}*{9}\\mathrm{C}*{8} \= \\mathrm{A}\$\$ \$\${}*{10}\\mathrm{C}*{1} \+ {}*{10}\\mathrm{C}*{3} \+ {}*{10}\\mathrm{C}*{5} \+ {}*{10}\\mathrm{C}*{7} \+ {}*{10}\\mathrm{C}*{9} \= \\mathrm{B}\$\$

### 선지

① \$640\$ ② \$720\$ ③ \$768\$ ④ \$896\$ ⑤ \$1024\$

### 정답

③

### 해설

이항계수의 성질에 의하여 짝수 번째 항들의 합과 홀수 번째 항들의 합은 각각 \$2^{n-1}\$이다.

\$\$\\mathrm{A} \= 2^{9-1} \= 2^8 \= 256, \\qquad \\mathrm{B} \= 2^{10-1} \= 2^9 \= 512\$\$

따라서 \$\\mathrm{A}+\\mathrm{B} \= 256+512 \= 768\$이다. 정답은 ③이다.

```
"NONE"
```

```
{"sourceQid": "Q10", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H15-PS", "curriculum": "2015", "standardUnitKey": "H15-PS-02", "subUnitKey": "H15-PS-02-BINOMIAL_COEFFICIENT", "conceptClusterKey": "BINOMIAL_THEOREM", "primaryMethod": "짝수 번째 이항계수 합 A=2^8=256과 홀수 번째 이항계수 합 B=2^9=512를 계산해 768 합산", "decisiveStep": "A = 2^8 = 256, B = 2^9 = 512", "rpm": {"majorUnit": "경우의 수", "midUnit": "이항정리", "l3": "이항계수", "l4": "이항계수의 성질"}, "ptTplCandidate": {"problemTypeKey": "PT_BINOMIAL_THEOREM", "templateKey": "TPL_BINOMIAL_COEFFICIENT_IDENTITY", "why": "이항계수 > 이항계수의 성질 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이항계수의 홀짝 번째 합 공식 2^(n-1)을 두 식에 적용해 합산하는 표준 문항이다.", "level": "중", "item4slot": {"given": ["합"], "goal": ["합", "값"], "method": ["이항정리", "조합"], "condition": []}, "hold": ""}
```

## Q11

- 형식: 객관식  
- 배점: 4

### 발문

다음 그림과 같이 정오각형 모양의 책상에 \$10\$명이 앉는 방법의 수를 \$a\$, 정사각형 모양의 탁자에 \$8\$명이 둘러앉는 방법의 수를 \$b\$라 할 때, \$\\dfrac{a}{b}\$의 값은? (단, 회전하여 일치하는 것은 같은 것으로 본다.)

### 선지

① \$72\$ ② \$64\$ ③ \$68\$ ④ \$76\$ ⑤ \$80\$

### 정답

①

### 해설

정오각형 책상은 한 변에 \$2\$명씩 앉아 \$72^\\circ\$씩 회전한 \$5\$가지 배치가 같으므로 \$a \= \\dfrac{10\!}{5}\$이다.

정사각형 탁자는 한 변에 \$2\$명씩 앉아 \$90^\\circ\$씩 회전한 \$4\$가지 배치가 같으므로 \$b \= \\dfrac{8\!}{4}\$이다.

\$\$\\frac{a}{b} \= \\frac{10\!/5}{8\!/4} \= \\frac{10\\times 9\\times 8\!}{5} \\times \\frac{4}{8\!} \= 2 \\times 9 \\times 4 \= 72\$\$

따라서 정답은 ①이다.

```
{"figureType": "polygon_tables_comparison", "description": "각 변에 2명씩 총 10명이 앉는 정오각형 책상과 각 변에 2명씩 총 8명이 앉는 정사각형 탁자가 나란히 그려진 그림", "elements": ["regular pentagon with 2 seats per side (10 seats)", "square with 2 seats per side (8 seats)"]}
```

```
{"sourceQid": "Q11", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H15-PS", "curriculum": "2015", "standardUnitKey": "H15-PS-01", "subUnitKey": "H15-PS-01-PERMUTATION", "conceptClusterKey": "COMBINATORICS", "primaryMethod": "정오각형 대칭 a=10!/5와 정사각형 대칭 b=8!/4를 구해 비율 a/b=72 계산", "decisiveStep": "(10!/5) / (8!/4) = 72", "rpm": {"majorUnit": "경우의 수", "midUnit": "순열과 조합", "l3": "순열", "l4": "중복·원순열"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_ARRANGEMENT", "templateKey": null, "why": "순열 > 중복·원순열 (FAMILY_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "각 변에 여러 명이 앉는 정다각형 탁자의 회전 대칭수를 구해 두 경우의 수의 비를 계산하는 문항이다.", "level": "중", "item4slot": {"given": ["정사각형", "대칭성"], "goal": ["값"], "method": ["원순열", "순열"], "condition": []}, "hold": ""}
```

## Q12

- 형식: 객관식  
- 배점: 4

### 발문

주머니에 \$1\$부터 \$8\$까지 자연수가 각각 적힌 \$8\$장의 카드가 들어 있다. 이 주머니에서 카드를 임의로 \$1\$장씩 꺼내어 카드에 적힌 수의 합이 \$7\$의 배수가 될 때까지 꺼내는 시행을 할 때, 카드를 \$3\$장 이상 꺼낼 확률은? (단, 꺼낸 카드는 다시 넣지 않고, 처음 꺼낸 카드에 적힌 수가 \$7\$이면 시행을 멈춘다.)

### 선지

① \$\\dfrac{37}{56}\$ ② \$\\dfrac{39}{56}\$ ③ \$\\dfrac{15}{56}\$ ④ \$\\dfrac{43}{56}\$ ⑤ \$\\dfrac{41}{56}\$

### 정답

⑤

### 해설

\$2\$장 이하를 꺼내고 시행이 멈추는 여사건의 확률을 구한다.

1. \$1\$장째에 멈추는 경우: 처음 꺼낸 카드가 \$7\$일 확률은 \$\\dfrac{1}{8}\$이다.  
2. \$2\$장째에 멈추는 경우: 첫 카드가 \$7\$이 아니고 두 수의 합이 \$7\$의 배수(\$7\$ 또는 \$14\$)인 순서쌍은  
   - 합이 \$7\$: \$(1,6),\\ (6,1),\\ (2,5),\\ (5,2),\\ (3,4),\\ (4,3)\$ (\$6\$개)  
   - 합이 \$14\$: \$(6,8),\\ (8,6)\$ (\$2\$개) 전체 \$8\\times 7 \= 56\$개 중 \$8\$개이므로 확률은 \$\\dfrac{8}{56} \= \\dfrac{1}{7}\$이다.

따라서 \$3\$장 이상 꺼낼 확률은 \$1 - \\dfrac{1}{8} - \\dfrac{1}{7} \= 1 - \\dfrac{15}{56} \= \\dfrac{41}{56}\$이다. 정답은 ⑤이다.

```
"NONE"
```

```
{"sourceQid": "Q12", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H15-PS", "curriculum": "2015", "standardUnitKey": "H15-PS-03", "subUnitKey": "H15-PS-03-PROBABILITY_ADDITION", "conceptClusterKey": "PROBABILITY", "primaryMethod": "1장 멈춤 1/8과 2장 합 7의 배수 멈춤 8/56=1/7을 여사건으로 빼서 3장 이상 확률 41/56 산출", "decisiveStep": "1 - (1/8 + 8/56) = 41/56", "rpm": {"majorUnit": "확률", "midUnit": "확률의 뜻과 활용", "l3": "확률의 덧셈정리", "l4": "여사건"}, "ptTplCandidate": {"problemTypeKey": "PT_PROBABILITY_PROPERTIES_APPLICATION", "templateKey": "TPL_EVENT_RELATION_COMPLEMENT_ADDITION", "why": "확률의 덧셈정리 > 여사건 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "CASE_BRANCH", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "시행 중단 조건에서 '3장 이상'을 여사건인 1장·2장 중단 경우의 합으로 전환해 확률을 구하는 문항이다.", "level": "중", "item4slot": {"given": ["배수", "사건"], "goal": ["확률"], "method": ["여사건", "확률"], "condition": []}, "hold": ""}
```

## Q13

- 형식: 객관식  
- 배점: 4

### 발문

\$7\$개의 문자 \$a,\\ b,\\ c,\\ d,\\ e,\\ f,\\ g\$를 일렬로 나열할 때, \$a\$가 \$c\$보다 왼쪽에 오고, \$b\$가 \$e\$보다 오른쪽에 오도록 나열하는 모든 방법의 수는?

### 선지

① \$1120\$ ② \$1260\$ ③ \$1320\$ ④ \$1440\$ ⑤ \$2520\$

### 정답

②

### 해설

\$(a,\\ c)\$의 순서가 정해져 있고 \$(b,\\ e)\$의 순서도 정해져 있으므로 같은 것이 있는 순열과 같다.

\$\$\\frac{7\!}{2\!,2\!} \= \\frac{5040}{4} \= 1260\$\$

따라서 정답은 ②이다.

```
"NONE"
```

```
{"sourceQid": "Q13", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H15-PS", "curriculum": "2015", "standardUnitKey": "H15-PS-01", "subUnitKey": "H15-PS-01-PERMUTATION", "conceptClusterKey": "COMBINATORICS", "primaryMethod": "두 쌍 (a,c)와 (b,e)의 상대 순서 고정에 같은 것이 있는 순열 7!/(2!2!)=1260 적용", "decisiveStep": "7! / (2! * 2!) = 1260", "rpm": {"majorUnit": "경우의 수", "midUnit": "순열과 조합", "l3": "순열", "l4": "일렬 배열"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_ARRANGEMENT", "templateKey": "TPL_PERMUTATION_STANDARD_CONSTRAINT", "why": "순열 > 일렬 배열 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 쌍의 상대 순서가 고정된 직순열을 같은 것이 있는 순열로 환원해 푸는 표준 문항이다.", "level": "중", "item4slot": {"given": ["집합"], "goal": ["개수"], "method": ["같은것이있는순열"], "condition": []}, "hold": ""}
```

## Q14

- 형식: 객관식  
- 배점: 4

### 발문

집합 \$X \= {1,\\ 2,\\ 3,\\ 4,\\ 5,\\ 6}\$에 대하여 함수 \$f : X \\to X\$는 다음 조건을 만족시킨다.

(가) \$f(3)\$은 홀수이다. (나) \$x \< 3\$이면 \$f(x) \< f(3)\$이다. (다) \$x \> 3\$이면 \$f(x) \> f(3)\$이다.

함수 \$f\$의 개수는?

### 선지

① \$108\$ ② \$116\$ ③ \$120\$ ④ \$124\$ ⑤ \$132\$

### 정답

④

### 해설

\$f(3)\$은 홀수이므로 \$1,\\ 3,\\ 5\$로 나누어 센다.

1. \$f(3) \= 1\$일 때: \$f(x) \< 1\$인 공역의 원소가 없으므로 \$0\$개  
2. \$f(3) \= 3\$일 때: \$f(1),\\ f(2) \\in {1, 2}\$ (\$2^2\$가지), \$f(4),\\ f(5),\\ f(6) \\in {4, 5, 6}\$ (\$3^3\$가지) \$\$2^2 \\times 3^3 \= 4 \\times 27 \= 108\$\$  
3. \$f(3) \= 5\$일 때: \$f(1),\\ f(2) \\in {1, 2, 3, 4}\$ (\$4^2\$가지), \$f(4),\\ f(5),\\ f(6) \\in {6}\$ (\$1^3\$가지) \$\$4^2 \\times 1^3 \= 16\$\$

따라서 구하는 함수의 개수는 \$108 \+ 16 \= 124\$이다. 정답은 ④이다.

```
"NONE"
```

```
{"sourceQid": "Q14", "variationType": "CONDITION", "standardCourse": "확률과 통계", "courseKey": "H15-PS", "curriculum": "2015", "standardUnitKey": "H15-PS-01", "subUnitKey": "H15-PS-01-PERMUTATION", "conceptClusterKey": "COMBINATORICS", "primaryMethod": "f(3)을 홀수 1, 3, 5로 분류해 각 경우에 x<3, x>3의 중복순열 선택지를 곱해 108+16=124 합산", "decisiveStep": "f(3)=3 (2^2*3^3=108) + f(3)=5 (4^2*1^3=16) = 124", "rpm": {"majorUnit": "경우의 수", "midUnit": "순열과 조합", "l3": "순열", "l4": "중복·원순열"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_ARRANGEMENT", "templateKey": null, "why": "순열 > 중복·원순열 (FAMILY_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "CASE_BRANCH", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "기준 함숫값 f(3)의 홀수 조건에 따라 경우를 나누고 좌우 정의역의 함숫값 범위를 독립 곱으로 계산하는 문항이다.", "level": "상", "item4slot": {"given": ["집합", "함수", "부등식"], "goal": ["개수"], "method": ["중복순열", "합의법칙"], "condition": ["홀수"]}, "hold": ""}
```

## Q15

- 형식: 객관식  
- 배점: 4

### 발문

다음 다항식에서 \$x^{16}\$의 계수는?

\$\$(x+1)^{18} \+ x(x+1)^{17} \+ x^2(x+1)^{16} \+ \\cdots \+ x^{15}(x+1)^3 \+ x^{16}(x+1)^2\$\$

### 선지

① \$918\$ ② \$935\$ ③ \$969\$ ④ \$986\$ ⑤ \$1020\$

### 정답

③

### 해설

각 항 \$x^i(x+1)^{18-i}\$ (\$i=0,\\ 1,\\ \\dots,\\ 16\$)에서 \$x^{16}\$의 계수는 \$(x+1)^{18-i}\$의 \$x^{16-i}\$의 계수인 \${}*{18-i}\\mathrm{C}*{16-i} \= {}*{18-i}\\mathrm{C}*{2}\$이다.

파스칼의 삼각형 성질(하키스틱 정리)에 의하여 계수의 합은 다음과 같다.

\$\$\\sum\_{i=0}^{16} {}*{18-i}\\mathrm{C}*{2} \= {}*{2}\\mathrm{C}*{2} \+ {}*{3}\\mathrm{C}*{2} \+ \\cdots \+ {}*{18}\\mathrm{C}*{2} \= {}*{19}\\mathrm{C}*{3} \= \\frac{19\\times 18\\times 17}{3\\times 2\\times 1} \= 969\$\$

따라서 정답은 ③이다.

```
"NONE"
```

```
{"sourceQid": "Q15", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H15-PS", "curriculum": "2015", "standardUnitKey": "H15-PS-02", "subUnitKey": "H15-PS-02-BINOMIAL_COEFFICIENT", "conceptClusterKey": "BINOMIAL_THEOREM", "primaryMethod": "각 항 x^i(x+1)^(18-i)의 x^16 계수 (18-i)C2의 합을 하키스틱 공식 19C3=969로 계산", "decisiveStep": "sum_{j=2}^{18} jC2 = 19C3 = 969", "rpm": {"majorUnit": "경우의 수", "midUnit": "이항정리", "l3": "이항계수", "l4": "조합 항등식"}, "ptTplCandidate": {"problemTypeKey": "PT_BINOMIAL_THEOREM", "templateKey": "TPL_BINOMIAL_COEFFICIENT_IDENTITY", "why": "이항계수 > 조합 항등식 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "여러 다항식의 합에서 특정 차수의 계수를 조합 합으로 정리하고 하키스틱 공식을 적용하는 문항이다.", "level": "중", "item4slot": {"given": ["다항식"], "goal": ["계수"], "method": ["이항정리", "파스칼의삼각형"], "condition": []}, "hold": ""}
```

## Q16

- 형식: 객관식  
- 배점: 4.1

### 발문

똑같은 \$15\$개의 펜을 \$\\mathrm{A,\\ B,\\ C}\$ 세 명의 학생에게 모두 나누어 주려고 한다. 다음 조건을 만족시키며 펜을 나누어 주는 모든 방법의 수는? (단, 펜을 하나도 받지 못하는 학생이 있을 수 있다.)

(가) \$\\mathrm{A}\$는 \$2\$개 이상을 받는다. (나) \$\\mathrm{B}\$는 \$2\$개 이상을 받는다. (다) \$\\mathrm{C}\$는 \$3\$개 이하를 받는다.

### 선지

① \$38\$ ② \$42\$ ③ \$40\$ ④ \$44\$ ⑤ \$46\$

### 정답

②

### 해설

\$\\mathrm{A,\\ B,\\ C}\$가 받는 펜의 개수를 각각 \$a,\\ b,\\ c\$라 하면 \$a+b+c=15\$이고 \$a\\ge 2,\\ b\\ge 2,\\ 0\\le c\\le 3\$이다.

\$a' \= a-2 \\ge 0,\\ b' \= b-2 \\ge 0\$으로 치환하면 \$a'+b' \= 11-c\$이다.

\$c \= 0,\\ 1,\\ 2,\\ 3\$일 때 해의 개수는 \${}*{2}\\mathrm{H}*{11-c} \= 12-c\$이므로 전체 방법의 수는 다음과 같다.

\$\$12 \+ 11 \+ 10 \+ 9 \= 42\$\$

따라서 정답은 ②이다.

```
"NONE"
```

```
{"sourceQid": "Q16", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H15-PS", "curriculum": "2015", "standardUnitKey": "H15-PS-01", "subUnitKey": "H15-PS-01-COMBINATION", "conceptClusterKey": "COMBINATORICS", "primaryMethod": "C의 개수 c∈{0,1,2,3}별로 a'+b'=11-c의 해 12-c를 구해 12+11+10+9=42 합산", "decisiveStep": "c=0,1,2,3별 2H(11-c) = 12+11+10+9 = 42", "rpm": {"majorUnit": "경우의 수", "midUnit": "순열과 조합", "l3": "중복조합", "l4": "중복을 허용한 선택"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_SELECTION_DISTRIBUTION", "templateKey": "TPL_REPEATED_COMBINATION_DISTRIBUTION", "why": "중복조합 > 중복을 허용한 선택 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "CASE_BRANCH", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "하한과 상한 조건이 섞인 분배 문제에서 상한 변수를 기준으로 분류해 중복조합을 합산하는 문항이다.", "level": "중", "item4slot": {"given": ["부등식"], "goal": ["개수"], "method": ["중복조합", "합의법칙"], "condition": []}, "hold": ""}
```

## Q17

- 형식: 객관식  
- 배점: 4.2

### 발문

다음 조건을 만족시키는 음이 아닌 정수 \$a,\\ b,\\ c\$의 모든 순서쌍 \$(a,\\ b,\\ c)\$의 개수는?

(가) \$a+b+c=12\$ (나) 좌표평면에서 세 점 \$(1,\\ a),\\ (2,\\ b),\\ (3,\\ c)\$가 한 직선 위에 있지 않다.

### 선지

① \$78\$ ② \$79\$ ③ \$80\$ ④ \$81\$ ⑤ \$82\$

### 정답

⑤

### 해설

\$a+b+c=12\$를 만족시키는 음이 아닌 정수해의 전체 개수는 \${}*{3}\\mathrm{H}*{12} \= {}*{14}\\mathrm{C}*{2} \= 91\$이다.

여사건은 세 점 \$(1,\\ a),\\ (2,\\ b),\\ (3,\\ c)\$가 한 직선 위에 있는 경우이므로 \$a+c \= 2b\$가 성립해야 한다.

이를 \$a+b+c=12\$에 대입하면 \$3b \= 12\$, 즉 \$b \= 4\$이고 \$a+c \= 8\$이다. 음이 아닌 정수 쌍 \$(a,\\ c)\$는 \$(0,8),\\ (1,7),\\ \\dots,\\ (8,0)\$의 \$9\$개이다.

따라서 구하는 순서쌍의 개수는 \$91 - 9 \= 82\$이다. 정답은 ⑤이다.

```
"NONE"
```

```
{"sourceQid": "Q17", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H15-PS", "curriculum": "2015", "standardUnitKey": "H15-PS-01", "subUnitKey": "H15-PS-01-COMBINATION", "conceptClusterKey": "COMBINATORICS", "primaryMethod": "전체 중복조합 3H12=91에서 세 점 공선 조건 a+c=2b (b=4, a+c=8) 9가지를 여사건으로 빼서 82 산출", "decisiveStep": "3H12 - #{a+c=8} = 91 - 9 = 82", "rpm": {"majorUnit": "경우의 수", "midUnit": "순열과 조합", "l3": "중복조합", "l4": "정수해 개수"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_SELECTION_DISTRIBUTION", "templateKey": "TPL_REPEATED_COMBINATION_DISTRIBUTION", "why": "중복조합 > 정수해 개수 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "좌표평면 세 점의 공선 조건을 등차중항 a+c=2b로 해석해 중복조합의 여사건으로 제거하는 문항이다.", "level": "상", "item4slot": {"given": ["방정식", "직선"], "goal": ["순서쌍", "개수"], "method": ["중복조합", "여사건", "등차수열"], "condition": []}, "hold": ""}
```

## Q18

- 형식: 객관식  
- 배점: 4.2

### 발문

\$1\$학년 \$2\$명, \$2\$학년 \$4\$명, \$3\$학년 \$2\$명이 원탁에 둘러앉을 때, \$1\$학년끼리는 이웃하고 \$1\$학년과 \$3\$학년은 이웃하지 않도록 앉는 경우의 수는? (단, 회전하여 일치하는 것은 같은 것으로 본다.)

### 선지

① \$576\$ ② \$480\$ ③ \$512\$ ④ \$540\$ ⑤ \$640\$

### 정답

①

### 해설

\$1\$학년 \$2\$명을 한 묶음으로 보고 이 묶음을 원탁의 기준 자리에 고정한다. 묶음 내부에서 \$1\$학년 \$2\$명이 자리를 바꾸는 경우는 \$2\! \= 2\$가지이다.

\$1\$학년과 \$3\$학년이 이웃하지 않으려면 \$1\$학년 묶음의 양옆 두 자리에 모두 \$2\$학년이 앉아야 하므로, \$2\$학년 \$4\$명 중 \$2\$명을 뽑아 양옆에 앉히는 경우의 수는 \${}*{4}\\mathrm{P}*{2} \= 4 \\times 3 \= 12\$가지이다.

남은 \$4\$개의 자리에 나머지 \$2\$학년 \$2\$명과 \$3\$학년 \$2\$명을 배열하는 경우의 수는 \$4\! \= 24\$가지이다.

따라서 구하는 경우의 수는 \$2 \\times 12 \\times 24 \= 576\$이다. 정답은 ①이다.

```
"NONE"
```

```
{"sourceQid": "Q18", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H15-PS", "curriculum": "2015", "standardUnitKey": "H15-PS-01", "subUnitKey": "H15-PS-01-PERMUTATION", "conceptClusterKey": "COMBINATORICS", "primaryMethod": "1학년 묶음을 기준 고정하고 양옆에 2학년 4P2=12, 나머지 4!과 묶음 내부 2!을 곱해 576 산출", "decisiveStep": "2! * 4P2 * 4! = 2 * 12 * 24 = 576", "rpm": {"majorUnit": "경우의 수", "midUnit": "순열과 조합", "l3": "순열", "l4": "중복·원순열"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_ARRANGEMENT", "templateKey": null, "why": "순열 > 중복·원순열 (FAMILY_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "원순열에서 특정 묶음의 양옆 자리를 제한 조건에 맞는 학년으로 먼저 채운 뒤 나머지를 배열하는 문항이다.", "level": "상", "item4slot": {"given": ["원", "집합"], "goal": ["개수"], "method": ["원순열", "순열", "곱의법칙"], "condition": ["이웃"]}, "hold": ""}
```

## Q19

- 형식: 객관식  
- 배점: 4.2

### 발문

좌표평면 위에서 상하 또는 좌우 방향으로 한 번에 \$1\$만큼씩 움직이는 점 \$\\mathrm{P}\$가 있다. 이때 원점을 출발한 점 \$\\mathrm{P}\$가 \$7\$번 움직여서 최종 위치가 점 \$\\mathrm{A}(2,\\ 3)\$이 되는 경우의 수는?

### 선지

① \$210\$ ② \$225\$ ③ \$235\$ ④ \$245\$ ⑤ \$260\$

### 정답

④

### 해설

오른쪽, 왼쪽, 위쪽, 아래쪽으로 움직인 횟수를 각각 \$R,\\ L,\\ U,\\ D\$라 하면

\$\$R - L \= 2, \\qquad U - D \= 3, \\qquad R \+ L \+ U \+ D \= 7\$\$

앞의 두 식을 세 번째 식에 대입하면 \$(L+2) \+ L \+ (D+3) \+ D \= 7 \\implies L \+ D \= 1\$이다.

1. \$(L,\\ D) \= (1,\\ 0)\$일 때: \$(R,\\ U) \= (3,\\ 3)\$이므로 배열 수는 \$\\dfrac{7\!}{3\!,1\!,3\!} \= 140\$가지  
2. \$(L,\\ D) \= (0,\\ 1)\$일 때: \$(R,\\ U) \= (2,\\ 4)\$이므로 배열 수는 \$\\dfrac{7\!}{2\!,4\!,1\!} \= 105\$가지

따라서 구하는 경우의 수는 \$140 \+ 105 \= 245\$이다. 정답은 ④이다.

```
{"figureType": "coordinate_grid_random_walk", "description": "원점 O(0,0)에서 출발해 상하좌우로 이동하여 점 A(2,3)에 도달하는 격자 좌표평면 그림", "elements": ["coordinate grid", "origin O(0,0)", "point A(2,3)"]}
```

```
{"sourceQid": "Q19", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H15-PS", "curriculum": "2015", "standardUnitKey": "H15-PS-01", "subUnitKey": "H15-PS-01-PERMUTATION", "conceptClusterKey": "COMBINATORICS", "primaryMethod": "R-L=2, U-D=3, 합=7 연립으로 L+D=1을 얻고 (1,0), (0,1)별 같은 것이 있는 순열 140+105=245 합산", "decisiveStep": "L+D=1 분류 후 7!/(3!1!3!) + 7!/(2!4!1!) = 245", "rpm": {"majorUnit": "경우의 수", "midUnit": "순열과 조합", "l3": "순열", "l4": "일렬 배열"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_ARRANGEMENT", "templateKey": "TPL_PERMUTATION_STANDARD_CONSTRAINT", "why": "순열 > 일렬 배열 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "CASE_BRANCH", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "4방향 이동 횟수 방정식을 세워 역방향 이동 횟수 L+D를 특정한 뒤 케이스별 같은 것이 있는 순열을 구하는 문항이다.", "level": "중", "item4slot": {"given": ["원점", "방정식"], "goal": ["개수"], "method": ["같은것이있는순열", "합의법칙"], "condition": []}, "hold": ""}
```

## Q20

- 형식: 객관식  
- 배점: 4.3

### 발문

다음 조건을 만족시키는 음이 아닌 정수 \$a,\\ b,\\ c,\\ d,\\ e\$의 모든 순서쌍 \$(a,\\ b,\\ c,\\ d,\\ e)\$의 개수는?

(가) \$a+b+c+d+e=10\$ (나) \$\|a-b+c-d+e\| \\le 2\$

### 선지

① \$355\$ ② \$363\$ ③ \$371\$ ④ \$379\$ ⑤ \$385\$

### 정답

③

### 해설

\$x \= a+c+e\$, \$y \= b+d\$라 두면 \$x+y \= 10\$이고 \$\|x-y\| \\le 2\$이므로 \$x \\in {4,\\ 5,\\ 6}\$이다.

음이 아닌 정수해에서 \$a+c+e=x\$의 해는 \${}*{3}\\mathrm{H}*{x} \= {}*{x+2}\\mathrm{C}*{2}\$개, \$b+d=10-x\$의 해는 \${}*{2}\\mathrm{H}*{10-x} \= 11-x\$개이다.

- \$x=4,\\ y=6\$: \${}*{6}\\mathrm{C}*{2} \\times 7 \= 15 \\times 7 \= 105\$  
- \$x=5,\\ y=5\$: \${}*{7}\\mathrm{C}*{2} \\times 6 \= 21 \\times 6 \= 126\$  
- \$x=6,\\ y=4\$: \${}*{8}\\mathrm{C}*{2} \\times 5 \= 28 \\times 5 \= 140\$

따라서 전체 순서쌍의 개수는 \$105 \+ 126 \+ 140 \= 371\$이다. 정답은 ③이다.

```
"NONE"
```

```
{"sourceQid": "Q20", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H15-PS", "curriculum": "2015", "standardUnitKey": "H15-PS-01", "subUnitKey": "H15-PS-01-COMBINATION", "conceptClusterKey": "COMBINATORICS", "primaryMethod": "x=a+c+e, y=b+d 치환으로 x∈{4,5,6}을 구하고 각 경우의 3Hx*2H(10-x)를 합산해 371 계산", "decisiveStep": "x=4,5,6별 105 + 126 + 140 = 371", "rpm": {"majorUnit": "경우의 수", "midUnit": "순열과 조합", "l3": "중복조합", "l4": "정수해 개수"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_SELECTION_DISTRIBUTION", "templateKey": "TPL_REPEATED_COMBINATION_DISTRIBUTION", "why": "중복조합 > 정수해 개수 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "CASE_BRANCH", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "교대합 절댓값 부등식을 두 변수 그룹의 합으로 묶어 가능한 합을 분류한 뒤 중복조합을 곱해 합산하는 문항이다.", "level": "상", "item4slot": {"given": ["방정식", "부등식"], "goal": ["순서쌍", "개수"], "method": ["중복조합", "곱의법칙", "합의법칙"], "condition": []}, "hold": ""}
```

## Q21

- 형식: 서답형  
- 배점: 5

### 발문

\[서술형 1\] 부모 \$2\$명과 자녀 \$5\$명을 포함한 \$7\$명의 가족이 일정한 간격을 두고 원 모양의 탁자에 둘러앉을 때, 부모 \$2\$명이 이웃하게 앉는 경우의 수를 구하고 그 과정을 서술하시오. (단, 회전하여 일치하는 것은 같은 것으로 본다.)

### 선지

없음

### 정답

240

### 해설

부모 \$2\$명을 한 묶음으로 보면 묶음과 자녀 \$5\$명, 총 \$6\$개의 단위를 원형으로 배열하는 경우의 수는 \$(6-1)\! \= 5\! \= 120\$가지이다.

묶음 내부에서 부모 \$2\$명이 자리를 바꾸는 경우의 수는 \$2\! \= 2\$가지이다.

따라서 구하는 경우의 수는 \$120 \\times 2 \= 240\$이다.

```
"NONE"
```

```
{"sourceQid": "Q21", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H15-PS", "curriculum": "2015", "standardUnitKey": "H15-PS-01", "subUnitKey": "H15-PS-01-PERMUTATION", "conceptClusterKey": "COMBINATORICS", "primaryMethod": "부모 2명을 1묶음으로 묶은 6단위의 원순열 5!=120에 묶음 내부 배열 2!을 곱해 240 산출", "decisiveStep": "(6-1)! * 2! = 240", "rpm": {"majorUnit": "경우의 수", "midUnit": "순열과 조합", "l3": "순열", "l4": "중복·원순열"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_ARRANGEMENT", "templateKey": null, "why": "순열 > 중복·원순열 (FAMILY_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이웃 조건이 있는 원순열을 묶음 처리와 내부 순열의 곱으로 푸는 기본 서술형 문항이다.", "level": "중", "item4slot": {"given": ["원", "집합"], "goal": ["개수"], "method": ["원순열", "순열"], "condition": ["이웃"]}, "hold": ""}
```

## Q22

- 형식: 서답형  
- 배점: 5

### 발문

\[서술형 2\] 표본공간 \$\\mathrm{S}\$의 두 사건 \$\\mathrm{A,\\ B}\$에 대하여 다음 물음에 답하시오.

1) 확률의 덧셈정리를 서술하시오. (단, 두 사건 \$\\mathrm{A,\\ B}\$는 배반사건이 아니다.) \[1점\]  
2) 각 면에 \$1\$부터 \$24\$까지 자연수가 각각 적힌 정이십사면체 모양의 주사위 한 개를 던지는 시행에서 \$4\$의 배수의 눈이 나오는 사건을 \$\\mathrm{A}\$, \$16\$ 이상의 눈이 나오는 사건을 \$\\mathrm{B}\$라 할 때, \$\\mathrm{P}(\\mathrm{A}\\cup\\mathrm{B})\$의 값을 구하고 그 과정을 서술하시오. \[4점\]

### 선지

없음

### 정답

\$\\mathrm{P}(\\mathrm{A}\\cup\\mathrm{B})=\\mathrm{P}(\\mathrm{A})+\\mathrm{P}(\\mathrm{B})-\\mathrm{P}(\\mathrm{A}\\cap\\mathrm{B}),\\ \\dfrac{1}{2}\$

### 해설

1) 두 사건 \$\\mathrm{A,\\ B}\$에 대하여 확률의 덧셈정리는 다음과 같다. \$\$\\mathrm{P}(\\mathrm{A}\\cup\\mathrm{B}) \= \\mathrm{P}(\\mathrm{A}) \+ \\mathrm{P}(\\mathrm{B}) - \\mathrm{P}(\\mathrm{A}\\cap\\mathrm{B})\$\$  
     
2) 표본공간 \$\\mathrm{S} \= {1,\\ 2,\\ \\dots,\\ 24}\$에서 \$n(\\mathrm{S}) \= 24\$이다.  
     
- \$4\$의 배수의 눈: \$\\mathrm{A} \= {4, 8, 12, 16, 20, 24}\$이므로 \$n(\\mathrm{A}) \= 6\$, \$\\mathrm{P}(\\mathrm{A}) \= \\dfrac{6}{24}\$  
- \$16\$ 이상의 눈: \$\\mathrm{B} \= {16, 17, \\dots, 24}\$이므로 \$n(\\mathrm{B}) \= 9\$, \$\\mathrm{P}(\\mathrm{B}) \= \\dfrac{9}{24}\$  
- \$\\mathrm{A}\\cap\\mathrm{B} \= {16, 20, 24}\$이므로 \$n(\\mathrm{A}\\cap\\mathrm{B}) \= 3\$, \$\\mathrm{P}(\\mathrm{A}\\cap\\mathrm{B}) \= \\dfrac{3}{24}\$

따라서 \$\\mathrm{P}(\\mathrm{A}\\cup\\mathrm{B}) \= \\dfrac{6}{24} \+ \\dfrac{9}{24} - \\dfrac{3}{24} \= \\dfrac{12}{24} \= \\dfrac{1}{2}\$이다.

```
"NONE"
```

```
{"sourceQid": "Q22", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H15-PS", "curriculum": "2015", "standardUnitKey": "H15-PS-03", "subUnitKey": "H15-PS-03-PROBABILITY_ADDITION", "conceptClusterKey": "PROBABILITY", "primaryMethod": "확률의 덧셈정리를 서술하고 1~24 중 4의 배수(6개), 16 이상(9개), 교집합(3개)으로 P(A∪B)=1/2 산출", "decisiveStep": "(6 + 9 - 3) / 24 = 1/2", "rpm": {"majorUnit": "확률", "midUnit": "확률의 뜻과 활용", "l3": "확률의 덧셈정리", "l4": "배반사건"}, "ptTplCandidate": {"problemTypeKey": "PT_PROBABILITY_PROPERTIES_APPLICATION", "templateKey": "TPL_EVENT_RELATION_COMPLEMENT_ADDITION", "why": "확률의 덧셈정리 > 배반사건 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "확률의 덧셈정리 공식을 서술하고 원소 개수 세기를 통해 합사건의 확률을 구하는 문항이다.", "level": "중", "item4slot": {"given": ["표본공간", "주사위", "배수"], "goal": ["합집합", "확률"], "method": ["확률의덧셈정리", "교집합"], "condition": []}, "hold": ""}
```

## Q23

- 형식: 서답형  
- 배점: 5

### 발문

\[서술형 3\] \$1\$부터 \$8\$까지 자연수가 각각 적힌 \$8\$개의 공이 들어 있는 상자가 있다. 이 상자에서 임의로 \$3\$개의 공을 동시에 꺼낼 때, 공에 적힌 수를 작은 것부터 차례로 \$a,\\ b,\\ c\$라고 하자. \$b \\ge 4\$일 확률을 구하고 그 과정을 서술하시오.

### 선지

없음

### 정답

\$\\dfrac{5}{7}\$

### 해설

전체 경우의 수는 \${}*{8}\\mathrm{C}*{3} \= \\dfrac{8\\times 7\\times 6}{3\\times 2\\times 1} \= 56\$가지이다.

가운데 수 \$b\$의 값에 따라 \$a \< b \< c\$를 만족시키는 \$(a,\\ c)\$의 개수는 \$(b-1)(8-b)\$가지이다.

- \$b \= 4\$: \$3 \\times 4 \= 12\$가지  
- \$b \= 5\$: \$4 \\times 3 \= 12\$가지  
- \$b \= 6\$: \$5 \\times 2 \= 10\$가지  
- \$b \= 7\$: \$6 \\times 1 \= 6\$가지

유리한 경우의 수는 \$12 \+ 12 \+ 10 \+ 6 \= 40\$가지이므로 구하는 확률은 \$\\dfrac{40}{56} \= \\dfrac{5}{7}\$이다.

```
"NONE"
```

```
{"sourceQid": "Q23", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H15-PS", "curriculum": "2015", "standardUnitKey": "H15-PS-03", "subUnitKey": "H15-PS-03-PROBABILITY_BASIC", "conceptClusterKey": "PROBABILITY", "primaryMethod": "전체 8C3=56에 대해 가운데 수 b=4,5,6,7별 (b-1)(8-b)의 합 40을 나누어 확률 5/7 산출", "decisiveStep": "(12+12+10+6) / 8C3 = 40/56 = 5/7", "rpm": {"majorUnit": "확률", "midUnit": "확률의 뜻과 활용", "l3": "확률의 기본", "l4": "확률 계산"}, "ptTplCandidate": {"problemTypeKey": "PT_PROBABILITY_PROPERTIES_APPLICATION", "templateKey": "TPL_PROBABILITY_BASIC_COUNT_RATIO", "why": "확률의 기본 > 확률 계산 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "CASE_BRANCH", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "순서가 정해진 세 수의 중간값 b>=4 조건을 b의 값별로 분류해 경우의 수를 합산하는 서술형 문항이다.", "level": "중", "item4slot": {"given": ["자연수", "부등식"], "goal": ["확률"], "method": ["조합", "수학적확률", "합의법칙"], "condition": []}, "hold": ""}
```

## Q24

- 형식: 서답형  
- 배점: 5

### 발문

\[서술형 4\] 그림과 같이 \$7\$개의 숫자 \$1,\\ 1,\\ 2,\\ 2,\\ 2,\\ 3,\\ 3\$이 하나씩 적혀 있는 \$7\$장의 카드에서 \$5\$장의 카드를 택해 일렬로 나열하여 다섯 자리의 자연수를 만들 때, 짝수의 개수를 구하고 그 과정을 서술하시오.

### 선지

없음

### 정답

54

### 해설

다섯 자리 자연수가 짝수이려면 일의 자리에 숫자 \$2\$가 와야 한다. \$2\$가 적힌 카드 \$1\$장을 일의 자리에 놓으면 남은 카드는 \$1\$(\$2\$장), \$2\$(\$2\$장), \$3\$(\$2\$장)의 \$6\$장이며, 이 중 \$4\$장을 뽑아 앞 네 자리에 배열한다.

1. 같은 숫자 \$2\$쌍 \$(a,\\ a,\\ b,\\ b)\$을 뽑아 배열하는 경우: 종류 \$3\$가지 중 \$2\$가지를 고르는 방법 \${}*{3}\\mathrm{C}*{2} \= 3\$가지마다 \$\\dfrac{4\!}{2\!,2\!} \= 6\$가지이므로 \$3 \\times 6 \= 18\$가지  
2. 같은 숫자 \$1\$쌍과 서로 다른 숫자 \$2\$개 \$(a,\\ a,\\ b,\\ c)\$를 뽑아 배열하는 경우: 쌍으로 쓸 종류를 고르는 방법 \$3\$가지마다 \$\\dfrac{4\!}{2\!,1\!,1\!} \= 12\$가지이므로 \$3 \\times 12 \= 36\$가지

따라서 구하는 짝수의 개수는 \$18 \+ 36 \= 54\$이다.

```
{"figureType": "number_cards_row", "description": "1, 1, 2, 2, 2, 3, 3이 각각 하나씩 적혀 있는 7장의 사각형 카드가 나열된 그림", "elements": ["7 rectangular cards labeled 1, 1, 2, 2, 2, 3, 3"]}
```

```
{"sourceQid": "Q24", "variationType": "NUMERIC", "standardCourse": "확률과 통계", "courseKey": "H15-PS", "curriculum": "2015", "standardUnitKey": "H15-PS-01", "subUnitKey": "H15-PS-01-PERMUTATION", "conceptClusterKey": "COMBINATORICS", "primaryMethod": "일의 자리에 2를 고정한 뒤 남은 {1,1,2,2,3,3}에서 4장을 뽑는 중복 유형 (2,2) 18가지와 (2,1,1) 36가지를 합산해 54 산출", "decisiveStep": "3*(4!/(2!2!)) + 3*(4!/2!) = 18 + 36 = 54", "rpm": {"majorUnit": "경우의 수", "midUnit": "순열과 조합", "l3": "순열", "l4": "일렬 배열"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_ARRANGEMENT", "templateKey": "TPL_PERMUTATION_STANDARD_CONSTRAINT", "why": "순열 > 일렬 배열 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "CASE_BRANCH", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "일의 자리 짝수 고정 후 남은 중복 카드에서 4장을 뽑아 배열하는 경우를 중복 패턴별로 나누어 세는 문항이다.", "level": "중", "item4slot": {"given": ["자연수"], "goal": ["개수"], "method": ["같은것이있는순열", "합의법칙"], "condition": ["짝수"]}, "hold": ""}
```

