

```
{"stem": "25_순천여고_1학기_중간_고2_확률과통계_유사", "sourceArchiveFile": "original/high/h2/1mid/25_순천여고_1학기_중간_고2_확률과통계.js", "examFolder": "1mid", "grade": "고2", "subject": "확률과 통계", "curriculum": "2022", "questionCount": 24, "totalScore": 100, "generatedAt": "2026-11-20"}
```

## Q01

- 형식: 객관식  
- 배점: 3.2

### 발문

그림과 같이 정오각형을 중심에서 각 꼭짓점을 잇는 선분으로 \$5\$등분한 \$5\$개의 합동인 삼각형 영역에 서로 다른 \$5\$가지 색을 모두 사용하여 칠하는 경우의 수는? (단, 각 영역에는 한 가지 색만 칠하고, 회전하여 일치하는 것은 같은 것으로 본다.)

### 선지

① \$12\$ ② \$20\$ ③ \$24\$ ④ \$60\$ ⑤ \$120\$

### 정답

③

### 해설

회전 대칭성이 있으므로 서로 다른 \$5\$가지 색을 원형으로 배열하는 원순열을 적용한다. \$\$(5-1)\! \= 4\! \= 24\$\$ 정답은 ③이다.

```
{"figureType": "pentagon_5_sectors", "description": "중심에서 5개의 꼭짓점으로 선분을 그어 5등분한 정오각형", "elements": ["regular pentagon", "5 congruent triangular sectors from center"]}
```

```
{
  "sourceQid": "Q01",
  "variationType": "NUMERIC",
  "standardCourse": "확률과 통계",
  "courseKey": "H22-PS",
  "curriculum": "2022",
  "standardUnitKey": "H22-PS-01",
  "subUnitKey": "H22-PS-01-CORE",
  "conceptClusterKey": "COMBINATORICS",
  "primaryMethod": "정오각형 5등분 영역의 회전 대칭에 원순열 (5-1)!=24 적용",
  "decisiveStep": "(5-1)! = 24",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "순열과 조합",
    "l3": "순열",
    "l4": "중복·원순열"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COUNTING_ARRANGEMENT",
    "templateKey": null,
    "why": "순열 > 중복·원순열"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "대칭 분할 도형의 색칠에 원순열 공식 (n-1)!을 바로 적용하는 기초 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "정오각형"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "원순열"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q02

- 형식: 객관식  
- 배점: 3.8

### 발문

그림과 같이 정사각형 모양의 탁자 각 변에 \$2\$명씩 총 \$8\$명이 앉을 수 있다. 남자 \$2\$명과 여자 \$6\$명이 이 탁자에 둘러앉을 때, 남자 \$2\$명이 탁자의 서로 다른 변(모서리)에 앉는 경우의 수는? (단, 회전하여 일치하는 것은 같은 것으로 본다.)

### 선지

① \$8640\$ ② \$7200\$ ③ \$7920\$ ④ \$9360\$ ⑤ \$10080\$

### 정답

①

### 해설

전체 \$8\$명이 정사각형 탁자에 둘러앉는 경우의 수는 회전 대칭 \$4\$가지를 나누어 \$\\dfrac{8\!}{4}=10080\$이다. 남자 \$2\$명이 같은 변에 앉는 경우의 수는 변 선택 \$4\$가지, 남자 배열 \$2\!\$, 여자 배열 \$6\!\$을 회전 대칭 \$4\$로 나눈 \$\\dfrac{4\\times 2\!\\times 6\!}{4}=1440\$이다. 따라서 서로 다른 변에 앉는 경우의 수는 \$10080-1440=8640\$이다. 정답은 ①이다.

```
{"figureType": "square_table_8_seats", "description": "각 변에 2명씩 총 8명이 앉는 정사각형 탁자", "elements": ["square table", "2 seat dots along each of the 4 sides"]}
```

```
{
  "sourceQid": "Q02",
  "variationType": "NUMERIC",
  "standardCourse": "확률과 통계",
  "courseKey": "H22-PS",
  "curriculum": "2022",
  "standardUnitKey": "H22-PS-01",
  "subUnitKey": "H22-PS-01-CORE",
  "conceptClusterKey": "COMBINATORICS",
  "primaryMethod": "전체 원순열 8!/4=10080에서 남자 2명이 같은 변에 앉는 2!*6!=1440을 여사건으로 빼 8640 계산",
  "decisiveStep": "8!/4 - 2!*6! = 8640",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "순열과 조합",
    "l3": "순열",
    "l4": "중복·원순열"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COUNTING_ARRANGEMENT",
    "templateKey": null,
    "why": "순열 > 중복·원순열"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "다각형 탁자 순열에서 특정 두 사람이 서로 다른 변에 앉는 조건을 여사건으로 푸는 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "정사각형"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "원순열",
      "여사건"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q03

- 형식: 객관식  
- 배점: 3.4

### 발문

\$4\$명의 학생이 서로 다른 \$3\$곳의 체험장 중 하나를 택하는 경우의 수는? (단, 아무도 고르지 않는 체험장이 있을 수 있다.)

### 선지

① \$12\$ ② \$24\$ ③ \$27\$ ④ \$64\$ ⑤ \$81\$

### 정답

⑤

### 해설

\$4\$명의 학생이 각각 \$3\$곳 중 하나를 선택하므로 \${}*{3}\\Pi*{4}=3^4=81\$이다. 정답은 ⑤이다.

```
"NONE"
```

```
{
  "sourceQid": "Q03",
  "variationType": "NUMERIC",
  "standardCourse": "확률과 통계",
  "courseKey": "H22-PS",
  "curriculum": "2022",
  "standardUnitKey": "H22-PS-01",
  "subUnitKey": "H22-PS-01-CORE",
  "conceptClusterKey": "COMBINATORICS",
  "primaryMethod": "4명의 학생이 3곳 중 중복 선택하는 중복순열 3^4=81 계산",
  "decisiveStep": "3Pi4 = 3^4 = 81",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "순열과 조합",
    "l3": "순열",
    "l4": "중복·원순열"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COUNTING_ARRANGEMENT",
    "templateKey": null,
    "why": "순열 > 중복·원순열"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "중복순열의 밑과 지수를 정확히 구분해 n^r를 계산하는 기초 문항이다.",
  "level": "하",
  "item4slot": {
    "given": [
      "집합"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "중복순열"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q04

- 형식: 객관식  
- 배점: 3.4

### 발문

\$\\mathrm{gunsansi}\$에 있는 \$8\$개의 문자를 일렬로 나열하는 경우의 수가 \$k\\times 7\!\$일 때, 상수 \$k\$의 값은?

### 선지

① \$1\$ ② \$2\$ ③ \$3\$ ④ \$4\$ ⑤ \$6\$

### 정답

②

### 해설

\$\\mathrm{gunsansi}\$에는 \$\\mathrm{n}\$이 \$2\$개, \$\\mathrm{s}\$가 \$2\$개 있고 나머지 \$\\mathrm{g},\\ \\mathrm{u},\\ \\mathrm{a},\\ \\mathrm{i}\$는 각 \$1\$개씩 총 \$8\$개의 문자가 있다. \$\$\\frac{8\!}{2\!,2\!} \= \\frac{8\\times 7\!}{4} \= 2\\times 7\!\$\$ 따라서 \$k=2\$이다. 정답은 ②이다.

```
"NONE"
```

```
{
  "sourceQid": "Q04",
  "variationType": "NUMERIC",
  "standardCourse": "확률과 통계",
  "courseKey": "H22-PS",
  "curriculum": "2022",
  "standardUnitKey": "H22-PS-01",
  "subUnitKey": "H22-PS-01-CORE",
  "conceptClusterKey": "COMBINATORICS",
  "primaryMethod": "8개 문자 중 중복 문자 n(2개), s(2개)를 반영해 8!/(2!2!)=2*7!에서 k=2 결정",
  "decisiveStep": "8! / (2! * 2!) = 2 * 7!",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "순열과 조합",
    "l3": "순열",
    "l4": "일렬 배열"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COUNTING_ARRANGEMENT",
    "templateKey": "TPL_PERMUTATION_STANDARD_CONSTRAINT",
    "why": "순열 > 일렬 배열"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "같은 것이 있는 순열의 공식을 적용해 팩토리얼 앞의 계수를 구하는 기본 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "집합"
    ],
    "goal": [
      "상수"
    ],
    "method": [
      "같은것이있는순열"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q05

- 형식: 객관식  
- 배점: 4.0

### 발문

\$4\$개의 숫자 \$1,\\ 2,\\ 3,\\ 5\$에서 중복을 허용하여 \$4\$개를 뽑아 일렬로 나열할 때, 짝수끼리 이웃하지 않도록 나열하는 경우의 수는?

### 선지

① \$192\$ ② \$204\$ ③ \$210\$ ④ \$216\$ ⑤ \$228\$

### 정답

④

### 해설

짝수는 \$2\$뿐이므로 \$2\$끼리 이웃하지 않는 경우를 구한다. 전체 경우의 수는 \$4^4=256\$이다. \$2\$끼리 이웃하는 경우는 다음과 같다. ① \$2\$가 \$4\$번 나오는 경우: \$1\$가지 ② \$2\$가 \$3\$번 나오는 경우: \$4\\times 3=12\$가지 ③ \$2\$가 \$2\$번 이웃해 나오는 경우: 이웃 위치 \$3\$곳에 나머지 두 자리 \$3^2\$을 곱한 \$3\\times 9=27\$가지 따라서 구하는 경우의 수는 \$256-(1+12+27)=256-40=216\$이다. 정답은 ④이다.

```
"NONE"
```

```
{
  "sourceQid": "Q05",
  "variationType": "NUMERIC",
  "standardCourse": "확률과 통계",
  "courseKey": "H22-PS",
  "curriculum": "2022",
  "standardUnitKey": "H22-PS-01",
  "subUnitKey": "H22-PS-01-CORE",
  "conceptClusterKey": "COMBINATORICS",
  "primaryMethod": "전체 중복순열 4^4=256에서 짝수 2가 4번·3번·2번 이웃해 나오는 1+12+27=40가지를 빼 216 계산",
  "decisiveStep": "2의 등장 횟수(4, 3, 2)별 이웃 경우 1+12+27=40 분리",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "순열과 조합",
    "l3": "순열",
    "l4": "중복·원순열"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COUNTING_ARRANGEMENT",
    "templateKey": null,
    "why": "순열 > 중복·원순열"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "중복순열에서 특정 숫자(짝수)가 이웃하지 않는 조건을 등장 횟수별 여사건으로 분류해 세는 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "자연수"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "중복순열",
      "여사건"
    ],
    "condition": [
      "짝수"
    ]
  },
  "hold": ""
}
```

## Q06

- 형식: 객관식  
- 배점: 4.2

### 발문

수아는 확통과 국어, 영어를 포함한 \$7\$개의 과목을 월요일부터 일요일까지 매일 한 과목씩 공부하려고 한다. 다음 조건을 만족시키면서 \$7\$일 동안 공부하는 과목의 순서를 정하는 경우의 수는? (가) 확통과 국어는 월요일부터 수요일 사이에 공부한다. (나) 확통을 국어보다 먼저 공부한다. (다) 영어는 목요일부터 일요일 사이에 공부한다.

### 선지

① \$288\$ ② \$144\$ ③ \$216\$ ④ \$360\$ ⑤ \$576\$

### 정답

①

### 해설

남은 \$4\$과목 중 월~~수에 배치할 \$1\$과목을 고르는 방법은 \${}*{4}\\mathrm{C}*{1}=4\$가지이다. 월~~수 \$3\$일에 확통, 국어와 선택된 \$1\$과목을 확통이 국어보다 앞서도록 배열하는 방법은 \$\\dfrac{3\!}{2\!}=3\$가지이다. 목\~일 \$4\$일에 영어와 남은 \$3\$과목을 배열하는 방법은 \$4\!=24\$가지이다. 따라서 구하는 경우의 수는 \$4\\times 3\\times 24=288\$이다. 정답은 ①이다.

```
"NONE"
```

```
{
  "sourceQid": "Q06",
  "variationType": "NUMERIC",
  "standardCourse": "확률과 통계",
  "courseKey": "H22-PS",
  "curriculum": "2022",
  "standardUnitKey": "H22-PS-01",
  "subUnitKey": "H22-PS-01-CORE",
  "conceptClusterKey": "COMBINATORICS",
  "primaryMethod": "월~수 1과목 선택 4C1=4, 순서 고정 배열 3!/2=3, 목~일 4!=24를 곱해 288 계산",
  "decisiveStep": "4C1 * (3!/2!) * 4! = 4 * 3 * 24",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "순열과 조합",
    "l3": "순열",
    "l4": "일렬 배열"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COUNTING_ARRANGEMENT",
    "templateKey": "TPL_PERMUTATION_STANDARD_CONSTRAINT",
    "why": "순열 > 일렬 배열"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "구간 분할 선택(조합)과 상대적 순서 고정(같은 것이 있는 순열)을 곱의 법칙으로 결합하는 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "집합"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "조합",
      "같은것이있는순열"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q07

- 형식: 객관식  
- 배점: 3.2

### 발문

\${}*{4}\\mathrm{H}*{3}\$의 값은?

### 선지

① \$12\$ ② \$15\$ ③ \$20\$ ④ \$24\$ ⑤ \$35\$

### 정답

③

### 해설

\$\${}*{4}\\mathrm{H}*{3} \= {}*{4+3-1}\\mathrm{C}*{3} \= {}*{6}\\mathrm{C}*{3} \= \\frac{6\\times 5\\times 4}{3\\times 2\\times 1} \= 20\$\$ 정답은 ③이다.

```
"NONE"
```

```
{
  "sourceQid": "Q07",
  "variationType": "NUMERIC",
  "standardCourse": "확률과 통계",
  "courseKey": "H22-PS",
  "curriculum": "2022",
  "standardUnitKey": "H22-PS-01",
  "subUnitKey": "H22-PS-01-CORE",
  "conceptClusterKey": "COMBINATORICS",
  "primaryMethod": "중복조합 정의 nHr=(n+r-1)Cr을 적용해 4H3=6C3=20 계산",
  "decisiveStep": "4H3 = 6C3 = 20",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "순열과 조합",
    "l3": "중복조합",
    "l4": "중복을 허용한 선택"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COUNTING_SELECTION_DISTRIBUTION",
    "templateKey": "TPL_REPEATED_COMBINATION_DISTRIBUTION",
    "why": "중복조합 > 중복을 허용한 선택"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "중복조합의 기본 공식 하나만 계산하는 기초 문항이다.",
  "level": "하",
  "item4slot": {
    "given": [
      "중복조합"
    ],
    "goal": [
      "값"
    ],
    "method": [
      "중복조합"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q08

- 형식: 객관식  
- 배점: 3.6

### 발문

\$2\$명의 후보자가 출마한 선거에서 \$6\$명의 유권자가 한 명의 후보에게 각각 투표할 때, 무기명으로 투표하는 경우의 수를 \$a\$, 기명으로 투표하는 경우의 수를 \$b\$라 하자. \$b-a\$의 값은? (단, 기권이나 무효인 표는 없다.)

### 선지

① \$49\$ ② \$51\$ ③ \$53\$ ④ \$55\$ ⑤ \$57\$

### 정답

⑤

### 해설

무기명 투표는 중복조합 \$a={}*{2}\\mathrm{H}*{6}={}*{7}\\mathrm{C}*{6}=7\$이고, 기명 투표는 중복순열 \$b={}*{2}\\Pi*{6}=2^6=64\$이다. 따라서 \$b-a=64-7=57\$이다. 정답은 ⑤이다.

```
"NONE"
```

```
{
  "sourceQid": "Q08",
  "variationType": "NUMERIC",
  "standardCourse": "확률과 통계",
  "courseKey": "H22-PS",
  "curriculum": "2022",
  "standardUnitKey": "H22-PS-01",
  "subUnitKey": "H22-PS-01-CORE",
  "conceptClusterKey": "COMBINATORICS",
  "primaryMethod": "무기명 투표 2H6=7과 기명 투표 2^6=64를 각각 구해 차 64-7=57 산출",
  "decisiveStep": "2^6 - 2H6 = 64 - 7",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "순열과 조합",
    "l3": "중복조합",
    "l4": "중복을 허용한 선택"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COUNTING_SELECTION_DISTRIBUTION",
    "templateKey": "TPL_REPEATED_COMBINATION_DISTRIBUTION",
    "why": "중복조합 > 중복을 허용한 선택"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "무기명(중복조합)과 기명(중복순열) 투표의 모델링 차이를 비교해 차를 구하는 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "집합"
    ],
    "goal": [
      "값"
    ],
    "method": [
      "중복조합",
      "중복순열"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q09

- 형식: 객관식  
- 배점: 3.8

### 발문

주사위 한 개를 \$4\$번 던져 나온 눈의 수를 차례대로 \$a,\\ b,\\ c,\\ d\$라 하자. \$a\<b\<c\<d\$인 경우의 수를 \$m\$, \$a\\le b\\le c\\le d\$인 경우의 수를 \$n\$이라 할 때, \$m+n\$의 값은?

### 선지

① \$135\$ ② \$141\$ ③ \$144\$ ④ \$150\$ ⑤ \$156\$

### 정답

②

### 해설

\$m={}*{6}\\mathrm{C}*{4}={}*{6}\\mathrm{C}*{2}=15\$, \$n={}*{6}\\mathrm{H}*{4}={}*{9}\\mathrm{C}*{4}=\\dfrac{9\\times 8\\times 7\\times 6}{24}=126\$이다. 따라서 \$m+n=15+126=141\$이다. 정답은 ②이다.

```
"NONE"
```

```
{
  "sourceQid": "Q09",
  "variationType": "NUMERIC",
  "standardCourse": "확률과 통계",
  "courseKey": "H22-PS",
  "curriculum": "2022",
  "standardUnitKey": "H22-PS-01",
  "subUnitKey": "H22-PS-01-CORE",
  "conceptClusterKey": "COMBINATORICS",
  "primaryMethod": "엄격 증가 6C4=15와 비감소 6H4=126을 각각 계산해 합 141 산출",
  "decisiveStep": "6C4 + 6H4 = 15 + 126",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "순열과 조합",
    "l3": "중복조합",
    "l4": "중복을 허용한 선택"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COUNTING_SELECTION_DISTRIBUTION",
    "templateKey": "TPL_REPEATED_COMBINATION_DISTRIBUTION",
    "why": "중복조합 > 중복을 허용한 선택"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "부등호 등호 유무에 따라 조합(6C4)과 중복조합(6H4)을 구분해 계산하는 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "주사위",
      "부등식"
    ],
    "goal": [
      "값"
    ],
    "method": [
      "조합",
      "중복조합"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q10

- 형식: 객관식  
- 배점: 4.0

### 발문

방정식 \$x+y+z=17\$을 만족시키는 홀수인 자연수 \$x,\\ y,\\ z\$의 순서쌍 \$(x,\\ y,\\ z)\$의 개수는?

### 선지

① \$21\$ ② \$28\$ ③ \$32\$ ④ \$36\$ ⑤ \$45\$

### 정답

④

### 해설

\$x=2a+1\$, \$y=2b+1\$, \$z=2c+1\$(\$a,\\ b,\\ c\$는 음이 아닌 정수)로 놓으면 \$2(a+b+c)+3=17\$, 즉 \$a+b+c=7\$이다. 따라서 구하는 순서쌍의 개수는 \${}*{3}\\mathrm{H}*{7}={}*{9}\\mathrm{C}*{7}={}*{9}\\mathrm{C}*{2}=36\$이다. 정답은 ④이다.

```
"NONE"
```

```
{
  "sourceQid": "Q10",
  "variationType": "NUMERIC",
  "standardCourse": "확률과 통계",
  "courseKey": "H22-PS",
  "curriculum": "2022",
  "standardUnitKey": "H22-PS-01",
  "subUnitKey": "H22-PS-01-CORE",
  "conceptClusterKey": "COMBINATORICS",
  "primaryMethod": "x=2a+1 치환으로 a+b+c=7 음이 아닌 정수해를 구해 3H7=9C2=36 계산",
  "decisiveStep": "홀수 치환 후 3H7 = 36",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "순열과 조합",
    "l3": "중복조합",
    "l4": "정수해 개수"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COUNTING_SELECTION_DISTRIBUTION",
    "templateKey": "TPL_REPEATED_COMBINATION_DISTRIBUTION",
    "why": "중복조합 > 정수해 개수"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "홀수 자연수 조건을 2a+1로 치환해 기본 중복조합 방정식으로 바꾸는 표준 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "방정식"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "중복조합"
    ],
    "condition": [
      "홀수",
      "자연수"
    ]
  },
  "hold": ""
}
```

## Q11

- 형식: 객관식  
- 배점: 3.4

### 발문

다음 중 \${}*{4}\\mathrm{C}*{0}+{}*{5}\\mathrm{C}*{1}+{}*{6}\\mathrm{C}*{2}+{}*{7}\\mathrm{C}*{3}+{}*{8}\\mathrm{C}*{4}\$의 값과 같은 것은?

### 선지

① \${}*{8}\\mathrm{C}*{5}\$ ② \${}*{9}\\mathrm{C}*{3}\$ ③ \${}*{9}\\mathrm{C}*{4}\$ ④ \${}*{10}\\mathrm{C}*{3}\$ ⑤ \${}*{10}\\mathrm{C}*{4}\$

### 정답

③

### 해설

\${}*{4}\\mathrm{C}*{0}={}*{5}\\mathrm{C}*{0}\$이므로 파스칼의 삼각형 성질 \${}*{n}\\mathrm{C}*{r}+{}*{n}\\mathrm{C}*{r+1}={}*{n+1}\\mathrm{C}*{r+1}\$을 차례로 적용하면 \$\${}*{5}\\mathrm{C}*{0}+{}*{5}\\mathrm{C}*{1}={}*{6}\\mathrm{C}*{1}, \\quad {}*{6}\\mathrm{C}*{1}+{}*{6}\\mathrm{C}*{2}={}*{7}\\mathrm{C}*{2}, \\quad {}*{7}\\mathrm{C}*{2}+{}*{7}\\mathrm{C}*{3}={}*{8}\\mathrm{C}*{3}, \\quad {}*{8}\\mathrm{C}*{3}+{}*{8}\\mathrm{C}*{4}={}*{9}\\mathrm{C}*{4}\$\$ 이다. 정답은 ③이다.

```
"NONE"
```

```
{
  "sourceQid": "Q11",
  "variationType": "NUMERIC",
  "standardCourse": "확률과 통계",
  "courseKey": "H22-PS",
  "curriculum": "2022",
  "standardUnitKey": "H22-PS-02",
  "subUnitKey": "H22-PS-02-CORE",
  "conceptClusterKey": "BINOMIAL_THEOREM",
  "primaryMethod": "4C0=5C0 치환 후 파스칼 항등식을 연쇄 적용해 9C4 도출",
  "decisiveStep": "nCr + nC(r+1) = (n+1)C(r+1) 연쇄 결합",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "이항정리",
    "l3": "이항계수",
    "l4": "조합 항등식"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_BINOMIAL_THEOREM",
    "templateKey": "TPL_BINOMIAL_COEFFICIENT_IDENTITY",
    "why": "이항계수 > 조합 항등식"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "파스칼의 삼각형 점화식을 연달아 적용해 단일 조합 기호로 압축하는 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "조합"
    ],
    "goal": [
      "조합"
    ],
    "method": [
      "이항정리"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q12

- 형식: 객관식  
- 배점: 4.0

### 발문

\$21^{15}\$을 \$40\$으로 나누었을 때의 나머지는?

### 선지

① \$21\$ ② \$11\$ ③ \$19\$ ④ \$29\$ ⑤ \$31\$

### 정답

①

### 해설

\$21^{15}=(20+1)^{15}={}*{15}\\mathrm{C}*{0}+{}*{15}\\mathrm{C}*{1}\\cdot 20+{}*{15}\\mathrm{C}*{2}\\cdot 20^2+\\cdots+{}*{15}\\mathrm{C}*{15}\\cdot 20^{15}\$이다. 세 번째 항부터는 모두 \$20^2=400\$의 배수이므로 \$40\$으로 나누어떨어진다. 따라서 나머지는 \$1+15\\times 20=301=40\\times 7+21\$에서 \$21\$이다. 정답은 ①이다.

```
"NONE"
```

```
{
  "sourceQid": "Q12",
  "variationType": "NUMERIC",
  "standardCourse": "확률과 통계",
  "courseKey": "H22-PS",
  "curriculum": "2022",
  "standardUnitKey": "H22-PS-02",
  "subUnitKey": "H22-PS-02-CORE",
  "conceptClusterKey": "BINOMIAL_THEOREM",
  "primaryMethod": "21^15=(20+1)^15를 이항정리로 전개해 20^2 이상 항을 40의 배수로 소거하고 301 mod 40=21 산출",
  "decisiveStep": "1 + 15*20 = 301을 40으로 나눈 나머지 계산",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "이항정리",
    "l3": "이항계수",
    "l4": "이항계수의 성질"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_BINOMIAL_THEOREM",
    "templateKey": "TPL_BINOMIAL_COEFFICIENT_IDENTITY",
    "why": "이항계수 > 이항계수의 성질"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "거듭제곱을 (20+1)^15로 분해해 이항정리의 저차 항만 남겨 나머지를 구하는 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "자연수"
    ],
    "goal": [
      "나머지"
    ],
    "method": [
      "이항정리"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q13

- 형식: 객관식  
- 배점: 4.2

### 발문

\$(x^2-2x)^5\$의 전개식에서 \$x^7\$의 계수를 \$p\$, \$x^8\$의 계수를 \$q\$라 할 때, \$p+q\$의 값은?

### 선지

① \$-120\$ ② \$-80\$ ③ \$-60\$ ④ \$-40\$ ⑤ \$40\$

### 정답

④

### 해설

\$(x^2-2x)^5=x^5(x-2)^5\$이므로 \$p\$는 \$(x-2)^5\$의 \$x^2\$ 계수, \$q\$는 \$(x-2)^5\$의 \$x^3\$ 계수이다. \$\$p={}*{5}\\mathrm{C}*{3}(-2)^3=-80, \\quad q={}*{5}\\mathrm{C}*{2}(-2)^2=40\$\$ 따라서 \$p+q=-80+40=-40\$이다. 정답은 ④이다.

```
"NONE"
```

```
{
  "sourceQid": "Q13",
  "variationType": "NUMERIC",
  "standardCourse": "확률과 통계",
  "courseKey": "H22-PS",
  "curriculum": "2022",
  "standardUnitKey": "H22-PS-02",
  "subUnitKey": "H22-PS-02-CORE",
  "conceptClusterKey": "BINOMIAL_THEOREM",
  "primaryMethod": "x^5(x-2)^5로 묶어 (x-2)^5의 x^2 계수 -80과 x^3 계수 40을 합산해 -40 계산",
  "decisiveStep": "(x^2-2x)^5 = x^5(x-2)^5 인수 추출",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "이항정리",
    "l3": "이항정리",
    "l4": "특정 항의 계수"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_BINOMIAL_THEOREM",
    "templateKey": "TPL_BINOMIAL_TERM_COEFFICIENT",
    "why": "이항정리 > 특정 항의 계수"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "공통인수 x^5을 묶어낸 뒤 일반항에서 두 차수의 계수를 구해 더하는 표준 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "다항식"
    ],
    "goal": [
      "값"
    ],
    "method": [
      "이항정리"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q14

- 형식: 객관식  
- 배점: 4.4

### 발문

그림과 같은 도로망에서 \$A\$ 지점에서 출발하여 \$B\$ 지점까지 최단 거리로 갈 때, \$P\$ 지점을 거치지 않고 가는 경우의 수는? (단, 끊어진 도로는 통행할 수 없다.)

### 선지

① \$14\$ ② \$16\$ ③ \$18\$ ④ \$20\$ ⑤ \$24\$

### 정답

②

### 해설

가로 \$5\$칸, 세로 \$3\$칸 격자에서 왼쪽 위 \$A(0,\\ 0)\$에서 오른쪽 아래 \$B(5,\\ 3)\$까지 각 교차점에 누적 경우의 수를 적으면 다음과 같다. (\$(3,\\ 0)-(4,\\ 0)\$과 \$(2,\\ 1)-(2,\\ 2)\$ 구간이 끊어져 있다.) \$\$\\begin{array}{cccccc} 1&1&1&1&0&0 \\ 1&2&3&4&4&4 \\ 1&3&3&7&11&15 \\ 1&4&7&14&25&40 \\end{array}\$\$ 전체 최단경로는 \$40\$가지이고, \$A\\to P(3,\\ 1)\$ 경로는 \$4\$가지, \$P\\to B\$ 경로는 끊어진 길 없이 \${}*{4}\\mathrm{C}*{2}=6\$가지이므로 \$P\$를 거치는 경우는 \$4\\times 6=24\$가지이다. 따라서 \$P\$를 거치지 않고 가는 경우의 수는 \$40-24=16\$이다. 정답은 ②이다.

```
{"figureType": "broken_grid_shortest_path", "description": "5x3 격자에서 (3,0)-(4,0)과 (2,1)-(2,2)가 끊어진 도로망, A(0,0), B(5,3), P(3,1)", "elements": ["5x3 grid from A(0,0) to B(5,3)", "missing edge (3,0)-(4,0)", "missing edge (2,1)-(2,2)", "node P(3,1) highlighted"]}
```

```
{
  "sourceQid": "Q14",
  "variationType": "NUMERIC",
  "standardCourse": "확률과 통계",
  "courseKey": "H22-PS",
  "curriculum": "2022",
  "standardUnitKey": "H22-PS-01",
  "subUnitKey": "H22-PS-01-CORE",
  "conceptClusterKey": "COMBINATORICS",
  "primaryMethod": "끊어진 두 도로를 반영한 격자 누적합으로 전체 40가지를 구하고 P 경유 4*6=24를 빼 16 산출",
  "decisiveStep": "단절 구간을 제외한 누적표 합 40에서 P 경유 24 제외",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "순열과 조합",
    "l3": "순열",
    "l4": "일렬 배열"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COUNTING_ARRANGEMENT",
    "templateKey": "TPL_PERMUTATION_STANDARD_CONSTRAINT",
    "why": "순열 > 일렬 배열"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "단절된 도로가 여러 곳 있는 격자에서 누적합으로 전체 경로를 세고 특정 지점 미경유를 여사건으로 처리하는 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "직사각형"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "같은것이있는순열",
      "여사건"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q15

- 형식: 객관식  
- 배점: 4.6

### 발문

두 집합 \$X={1,\\ 2,\\ 3,\\ 4,\\ 5,\\ 6}\$, \$Y={2,\\ 4,\\ 6,\\ 8}\$에 대하여 다음 조건을 만족시키는 \$X\$에서 \$Y\$로의 함수 \$f\$의 개수는? (가) \$f(a)=8\$인 집합 \$X\$의 원소 \$a\$의 개수는 \$1\$이다. (나) \$f(b)=2\$, \$f(c)=4\$, \$f(d)=6\$인 집합 \$X\$의 원소 \$b,\\ c,\\ d\$의 개수는 각각 최대 \$2,\\ 4,\\ 1\$이다.

### 선지

① \$360\$ ② \$390\$ ③ \$400\$ ④ \$410\$ ⑤ \$420\$

### 정답

⑤

### 해설

\$f(a)=8\$인 원소 \$1\$개를 고르는 방법은 \${}*{6}\\mathrm{C}*{1}=6\$가지이다. 남은 \$5\$개 원소를 \$2,\\ 4,\\ 6\$에 대응시키는 개수를 \$n\_2,\\ n\_4,\\ n\_6\$이라 하면 \$n\_2+n\_4+n\_6=5\$ (\$0\\le n\_2\\le 2,\\ 0\\le n\_4\\le 4,\\ 0\\le n\_6\\le 1\$)이다. ① \$n\_6=0\$: \$(n\_2,\\ n\_4)=(1,\\ 4),\\ (2,\\ 3)\$이므로 \$\\dfrac{5\!}{1\!4\!}+\\dfrac{5\!}{2\!3\!}=5+10=15\$가지 ② \$n\_6=1\$: \$(n\_2,\\ n\_4)=(0,\\ 4),\\ (1,\\ 3),\\ (2,\\ 2)\$이므로 \$\\dfrac{5\!}{4\!1\!}+\\dfrac{5\!}{1\!3\!1\!}+\\dfrac{5\!}{2\!2\!1\!}=5+20+30=55\$가지 따라서 구하는 함수의 개수는 \$6\\times(15+55)=6\\times 70=420\$이다. 정답은 ⑤이다.

```
"NONE"
```

```
{
  "sourceQid": "Q15",
  "variationType": "NUMERIC",
  "standardCourse": "확률과 통계",
  "courseKey": "H22-PS",
  "curriculum": "2022",
  "standardUnitKey": "H22-PS-01",
  "subUnitKey": "H22-PS-01-CORE",
  "conceptClusterKey": "COMBINATORICS",
  "primaryMethod": "8 대응 원소 6C1=6 선택 후 n6=0,1별 (n2,n4) 순서쌍을 같은 것이 있는 순열로 합산해 6*70=420 계산",
  "decisiveStep": "n6=0, 1 기준 상한 조건 충족 (n2,n4) 분할 및 다항계수 합산",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "순열과 조합",
    "l3": "순열",
    "l4": "일렬 배열"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COUNTING_ARRANGEMENT",
    "templateKey": "TPL_PERMUTATION_STANDARD_CONSTRAINT",
    "why": "순열 > 일렬 배열"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "치역 원소별 상한 제약이 걸린 함수 개수를 n6 값으로 분류한 뒤 다항계수를 빠짐없이 합산해야 하는 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "집합",
      "함수"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "같은것이있는순열",
      "경우분류"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q16

- 형식: 객관식  
- 배점: 4.4

### 발문

집합 \$A={1,\\ 2,\\ 3,\\ 4,\\ 5,\\ 6,\\ 7,\\ 8}\$의 부분집합 중에서 원소 \$1\$을 포함하고 원소의 개수가 홀수인 집합의 개수는?

### 선지

① \$32\$ ② \$64\$ ③ \$96\$ ④ \$128\$ ⑤ \$256\$

### 정답

②

### 해설

\$1\$을 반드시 포함하고 나머지 \$7\$개의 원소 중 짝수 개를 선택하면 되므로 \${}*{7}\\mathrm{C}*{0}+{}*{7}\\mathrm{C}*{2}+{}*{7}\\mathrm{C}*{4}+{}*{7}\\mathrm{C}*{6}=2^{7-1}=2^6=64\$이다. 정답은 ②이다.

```
"NONE"
```

```
{
  "sourceQid": "Q16",
  "variationType": "NUMERIC",
  "standardCourse": "확률과 통계",
  "courseKey": "H22-PS",
  "curriculum": "2022",
  "standardUnitKey": "H22-PS-02",
  "subUnitKey": "H22-PS-02-CORE",
  "conceptClusterKey": "BINOMIAL_THEOREM",
  "primaryMethod": "1을 제외한 7개 원소 중 짝수 개를 고르는 이항계수 합 2^(7-1)=64 산출",
  "decisiveStep": "7C0+7C2+7C4+7C6 = 2^6 = 64",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "이항정리",
    "l3": "이항계수",
    "l4": "이항계수의 성질"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_BINOMIAL_THEOREM",
    "templateKey": "TPL_BINOMIAL_COEFFICIENT_IDENTITY",
    "why": "이항계수 > 이항계수의 성질"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "특정 원소 포함 조건을 제외한 뒤 짝수 번째 이항계수의 합 2^(n-1) 공식을 적용하는 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "집합",
      "부분집합"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "이항정리"
    ],
    "condition": [
      "홀수"
    ]
  },
  "hold": ""
}
```

## Q17

- 형식: 객관식  
- 배점: 4.4

### 발문

전체집합 \$U={1,\\ 2,\\ 3,\\ 4}\$의 두 부분집합 \$A,\\ B\$에 대하여 다음 조건을 만족시키는 순서쌍 \$(A,\\ B)\$의 개수는? (가) \$A\\cup B=U\$ (나) \$A\\cap B\\ne\\varnothing\$

### 선지

① \$49\$ ② \$57\$ ③ \$65\$ ④ \$73\$ ⑤ \$81\$

### 정답

③

### 해설

\$A\\cup B=U\$를 만족시키는 경우는 각 원소가 \$A-B,\\ B-A,\\ A\\cap B\$ 중 하나에 속하므로 \$3^4=81\$가지이다. 이 중 \$A\\cap B=\\varnothing\$인 경우는 \$B=A^C\$이므로 \$2^4=16\$가지이다. 따라서 \$81-16=65\$이다. 정답은 ③이다.

```
"NONE"
```

```
{
  "sourceQid": "Q17",
  "variationType": "NUMERIC",
  "standardCourse": "확률과 통계",
  "courseKey": "H22-PS",
  "curriculum": "2022",
  "standardUnitKey": "H22-PS-01",
  "subUnitKey": "H22-PS-01-CORE",
  "conceptClusterKey": "COMBINATORICS",
  "primaryMethod": "벤다이어그램 3영역 배치 3^4=81에서 서로소 여사건 2^4=16을 빼 65 산출",
  "decisiveStep": "3^4 - 2^4 = 65",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "순열과 조합",
    "l3": "순열",
    "l4": "중복·원순열"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COUNTING_ARRANGEMENT",
    "templateKey": null,
    "why": "순열 > 중복·원순열"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "합집합 조건을 벤다이어그램 영역 중복순열로 모델링하고 공집합이 아닌 교집합을 여사건으로 빼는 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "집합",
      "부분집합"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "중복순열",
      "여사건"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q18

- 형식: 객관식  
- 배점: 4.6

### 발문

같은 종류의 사탕 \$11\$개를 \$4\$명의 학생 \$A,\\ B,\\ C,\\ D\$에게 남김없이 나누어 줄 때, 다음 조건을 만족시키도록 나누어 주는 경우의 수는? (가) 각 학생은 적어도 \$1\$개의 사탕을 받는다. (나) \$A\$ 학생은 \$B\$ 학생보다 더 많은 사탕을 받는다. (다) 사탕을 \$1\$개만 받는 학생은 \$2\$명이다.

### 선지

① \$15\$ ② \$12\$ ③ \$14\$ ④ \$16\$ ⑤ \$18\$

### 정답

①

### 해설

네 학생이 받는 사탕의 개수를 \$a,\\ b,\\ c,\\ d\$라 하면 \$a\>b\\ge 1\$이므로 \$a\\ge 2\$이다. 따라서 \$1\$개를 받는 \$2\$명은 \$B,\\ C,\\ D\$ 중 \$2\$명이다. ① \$b=1,\\ c=1\$: \$a+d=9\$ (\$a,\\ d\\ge 2\$)이므로 \$(2,\\ 7),\\ \\dots,\\ (7,\\ 2)\$의 \$6\$가지 ② \$b=1,\\ d=1\$: \$a+c=9\$ (\$a,\\ c\\ge 2\$)이므로 \$6\$가지 ③ \$c=1,\\ d=1\$: \$a+b=9\$ (\$a\>b\\ge 2\$)이므로 \$(5,\\ 4),\\ (6,\\ 3),\\ (7,\\ 2)\$의 \$3\$가지 따라서 총 경우의 수는 \$6+6+3=15\$이다. 정답은 ①이다.

```
"NONE"
```

```
{
  "sourceQid": "Q18",
  "variationType": "NUMERIC",
  "standardCourse": "확률과 통계",
  "courseKey": "H22-PS",
  "curriculum": "2022",
  "standardUnitKey": "H22-PS-01",
  "subUnitKey": "H22-PS-01-CORE",
  "conceptClusterKey": "COMBINATORICS",
  "primaryMethod": "a>b>=1로 A가 1개 대상에서 제외됨을 확인한 뒤 {B,C,D} 중 1개 받는 2명 선택 3경우를 합산해 6+6+3=15 계산",
  "decisiveStep": "(B,C), (B,D), (C,D) 세 경우로 나누고 (C,D)에서 a>b 대칭 절반 적용",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "순열과 조합",
    "l3": "중복조합",
    "l4": "정수해 개수"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COUNTING_SELECTION_DISTRIBUTION",
    "templateKey": "TPL_REPEATED_COMBINATION_DISTRIBUTION",
    "why": "중복조합 > 정수해 개수"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "대소 조건(a>b)과 정확히 2명이 1개를 받는 조건을 결합해 3가지 케이스를 누락 없이 세어야 하는 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "부등식",
      "방정식"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "경우분류"
    ],
    "condition": [
      "자연수"
    ]
  },
  "hold": ""
}
```

## Q19

- 형식: 객관식  
- 배점: 4.6

### 발문

\$(1+x+x^2+x^3)\\left(x^2+\\dfrac{a}{x}\\right)^5\$의 전개식에서 \$x^7\$의 계수가 \$140\$일 때, 정수 \$a\$의 값은?

### 선지

① \$-6\$ ② \$-5\$ ③ \$-3\$ ④ \$-4\$ ⑤ \$4\$

### 정답

④

### 해설

\$\\left(x^2+\\dfrac{a}{x}\\right)^5\$의 일반항은 \${}*{5}\\mathrm{C}*{r}a^r x^{10-3r}\$이다. \$10-3r=7 \\implies r=1\$ (계수 \$5a\$), \$10-3r=4 \\implies r=2\$ (계수 \$10a^2\$)이고 \$10-3r=6,\\ 5\$는 정수해가 없다. \$\$10a^2+5a=140 \\implies 2a^2+a-28=(2a-7)(a+4)=0\$\$ \$a\$는 정수이므로 \$a=-4\$이다. 정답은 ④이다.

```
"NONE"
```

```
{
  "sourceQid": "Q19",
  "variationType": "NUMERIC",
  "standardCourse": "확률과 통계",
  "courseKey": "H22-PS",
  "curriculum": "2022",
  "standardUnitKey": "H22-PS-02",
  "subUnitKey": "H22-PS-02-CORE",
  "conceptClusterKey": "BINOMIAL_THEOREM",
  "primaryMethod": "일반항 5Cr a^r x^(10-3r)에서 x^7과 x^4 항을 골라 10a^2+5a=140 이차방정식으로 정수 a=-4 결정",
  "decisiveStep": "10a^2+5a=140 -> (2a-7)(a+4)=0",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "이항정리",
    "l3": "이항정리",
    "l4": "특정 항의 계수"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_BINOMIAL_THEOREM",
    "templateKey": "TPL_BINOMIAL_TERM_COEFFICIENT",
    "why": "이항정리 > 특정 항의 계수"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "다항식과 이항식의 곱에서 목표 차수 항들을 찾아 미지수에 관한 이차방정식을 푸는 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "다항식"
    ],
    "goal": [
      "정수"
    ],
    "method": [
      "이항정리",
      "이차방정식"
    ],
    "condition": [
      "정수"
    ]
  },
  "hold": ""
}
```

## Q20

- 형식: 서답형  
- 배점: 5.0

### 발문

\[서술형 1\] 집합 \$X={1,\\ 2,\\ 3,\\ 4}\$에 대하여 \$X\$에서 \$X\$로의 함수 \$f\$ 중에서 다음 조건을 만족시키는 함수의 개수를 구하고, 그 과정을 함께 서술하시오. (가) \$f(2)\$는 \$2\$ 이하의 자연수이다. (나) \$f(1)\\le f(2)\\le f(3)\<f(4)\$

### 선지

없음

### 정답

12

### 해설

조건 (가)에 의해 \$f(2)=1\$ 또는 \$f(2)=2\$이다. ① \$f(2)=1\$: \$f(1)=1\$ (\$1\$가지), \$1\\le f(3)\<f(4)\\le 4\$이므로 \${}*{4}\\mathrm{C}*{2}=6\$가지 \$\\implies 1\\times 6=6\$가지 ② \$f(2)=2\$: \$f(1)\\in{1,\\ 2}\$ (\$2\$가지), \$2\\le f(3)\<f(4)\\le 4\$이므로 \${}*{3}\\mathrm{C}*{2}=3\$가지 \$\\implies 2\\times 3=6\$가지 따라서 구하는 함수의 개수는 \$6+6=12\$이다.

```
"NONE"
```

```
{
  "sourceQid": "Q20",
  "variationType": "NUMERIC",
  "standardCourse": "확률과 통계",
  "courseKey": "H22-PS",
  "curriculum": "2022",
  "standardUnitKey": "H22-PS-01",
  "subUnitKey": "H22-PS-01-CORE",
  "conceptClusterKey": "COMBINATORICS",
  "primaryMethod": "f(2)=1, 2로 경우를 나누어 f(1) 선택과 f(3)<f(4) 조합을 곱해 6+6=12 계산",
  "decisiveStep": "f(2)=1일 때 4C2=6, f(2)=2일 때 2*3C2=6 분할",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "순열과 조합",
    "l3": "조합",
    "l4": "선택"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COUNTING_SELECTION_DISTRIBUTION",
    "templateKey": "TPL_COMBINATION_SELECTION",
    "why": "조합 > 선택"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "경계값 f(2)로 경우를 분류한 뒤 비감소 조건과 엄격 증가 조건을 분리해 세는 서술형 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "집합",
      "함수"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "조합",
      "경우분류"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q21

- 형식: 서답형  
- 배점: 6.0

### 발문

\[서술형 2\] 파란 펜 \$1\$자루와 빨간 펜 \$6\$자루를 세 학생 \$A,\\ B,\\ C\$에게 남김없이 나누어 주려고 한다. 다음 경우의 수를 각각 구하고 그 과정을 함께 서술하시오. (단, 같은 색의 펜끼리는 서로 구분하지 않는다.) (1) 펜을 받지 못하는 사람이 있을 수 있는 경우 \[3점\] (2) 각 사람이 \$1\$자루 이상의 펜을 받도록 나누어 주는 경우 \[3점\]

### 선지

없음

### 정답

(1) 84, (2) 45

### 해설

(1) 파란 펜 \$1\$자루를 주는 방법 \$3\$가지, 빨간 펜 \$6\$자루를 나누어 주는 방법 \${}*{3}\\mathrm{H}*{6}={}*{8}\\mathrm{C}*{2}=28\$가지이므로 \$3\\times 28=84\$이다. (2) 파란 펜을 줄 학생 \$1\$명을 정하는 방법 \$3\$가지에 대해, 나머지 두 학생은 빨간 펜을 \$1\$자루 이상 받아야 하므로 빨간 펜 분배는 \${}*{3}\\mathrm{H}*{4}={}*{6}\\mathrm{C}*{2}=15\$가지이다. 따라서 \$3\\times 15=45\$이다.

```
"NONE"
```

```
{
  "sourceQid": "Q21",
  "variationType": "NUMERIC",
  "standardCourse": "확률과 통계",
  "courseKey": "H22-PS",
  "curriculum": "2022",
  "standardUnitKey": "H22-PS-01",
  "subUnitKey": "H22-PS-01-CORE",
  "conceptClusterKey": "COMBINATORICS",
  "primaryMethod": "파란 펜 1자루 배정(3가지) 후 빨간 펜 6자루를 (1) 3H6=28, (2) 3H4=15로 분배해 84, 45 계산",
  "decisiveStep": "(2)에서 파란 펜 수령자 제외 2명에게 빨간 펜 1개씩 선배분 후 3H4 적용",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "순열과 조합",
    "l3": "중복조합",
    "l4": "중복을 허용한 선택"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COUNTING_SELECTION_DISTRIBUTION",
    "templateKey": "TPL_REPEATED_COMBINATION_DISTRIBUTION",
    "why": "중복조합 > 중복을 허용한 선택"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "서로 다른 종류의 물건 중 1개만 있는 경우를 먼저 배정한 뒤 나머지 동종 물건을 조건에 맞게 중복조합으로 분배하는 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "방정식"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "중복조합"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q22

- 형식: 객관식  
- 배점: 4.8

### 발문

동아리 \$A\$ 학생 \$2\$명, 동아리 \$B\$ 학생 \$3\$명, 동아리 \$C\$ 학생 \$3\$명이 그림과 같이 일정한 간격을 두고 원 모양의 탁자에 다음 조건을 만족시키도록 모두 둘러앉는 경우의 수는? (단, 회전하여 일치하는 것은 같은 것으로 본다.) (가) 같은 동아리 학생끼리는 서로 이웃하여 앉지 않는다. (나) 같은 동아리 학생끼리는 서로 마주보고 앉지 않는다.

### 선지

① \$72\$ ② \$120\$ ③ \$288\$ ④ \$360\$ ⑤ \$144\$

### 정답

⑤

### 해설

원탁의 \$8\$개 좌석을 \$0\\sim 7\$이라 할 때, 동아리 \$C\$의 \$3\$명이 이웃하지도 마주보지도 않게 앉는 좌석 배치는 회전 대칭을 제외하면 \${0,\\ 2,\\ 5}\$와 \${0,\\ 3,\\ 6}\$의 거울상 \$2\$가지 패턴 중 하나뿐이며, 실제로 회전하면 서로 다르므로 좌석 패턴은 \$1\$가지가 아니라 좌석 내 \$3\!\$ 배열까지 고려하면 먼저 \$C\$를 앉히는 방법은 \$6\$가지이다. 구체적으로 \$C\$의 좌석 패턴이 \${0,\\ 2,\\ 5}\$로 고정될 때 남은 좌석 \${1,\\ 3,\\ 4,\\ 6,\\ 7}\$에서 \$B\$(\$3\$명)가 이웃하지도 마주보지도 않으려면 \${1,\\ 4,\\ 6}\$ 또는 \${1,\\ 3,\\ 7}\$의 \$2\$가지뿐이고, 나머지 \$2\$자리에 \$A\$(\$2\$명)를 앉히면 마주보지도 이웃하지도 않는다. 따라서 전체 경우의 수는 \$6\\times 2\\times 3\!\\times 2\!=144\$이다. 정답은 ⑤이다.

```
{"figureType": "round_table_8_seats", "description": "일정한 간격의 8개 좌석이 표시된 원탁", "elements": ["circle table", "8 equally spaced seat dots"]}
```

```
{
  "sourceQid": "Q22",
  "variationType": "CONTEXT",
  "standardCourse": "확률과 통계",
  "courseKey": "H22-PS",
  "curriculum": "2022",
  "standardUnitKey": "H22-PS-01",
  "subUnitKey": "H22-PS-01-CORE",
  "conceptClusterKey": "COMBINATORICS",
  "primaryMethod": "C(3명)의 비이웃·비대칭 좌석 배치 6가지마다 B(3명) 유효 좌석 2가지와 3!*2!을 곱해 144 계산",
  "decisiveStep": "8등분 원탁에서 3명 비이웃·비마주보기 좌석 조합 2가지 확정",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "순열과 조합",
    "l3": "순열",
    "l4": "중복·원순열"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COUNTING_ARRANGEMENT",
    "templateKey": null,
    "why": "순열 > 중복·원순열"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 5,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "8등분 원탁에서 3개 집단의 비이웃·비마주보기 조건을 동시에 만족하는 좌석 배치를 대칭성으로 분류해야 하는 최고난도 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "원"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "원순열",
      "경우분류"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q23

- 형식: 서답형  
- 배점: 4.0

### 발문

\[서술형 3\] 그림과 같이 밑면이 정사각형이고 옆면이 모두 합동인 사각뿔의 \$5\$개의 면에 서로 다른 \$7\$가지 색 중 \$5\$가지 색을 사용하여 칠하는 경우의 수를 구하고, 그 과정을 함께 서술하시오. (단, 한 면에는 한 가지 색만 칠하고, 회전하여 일치하는 것은 같은 것으로 본다.)

### 선지

없음

### 정답

630

### 해설

\$7\$가지 색 중 \$5\$가지 색을 고르는 경우의 수는 \${}*{7}\\mathrm{C}*{5}={}*{7}\\mathrm{C}*{2}=21\$이다. 고른 \$5\$가지 색 중 밑면을 칠할 색을 고르는 경우는 \$5\$가지이고, 남은 \$4\$가지 색을 합동인 \$4\$개의 옆면에 칠하는 원순열은 \$(4-1)\!=6\$가지이다. 따라서 구하는 경우의 수는 \$21\\times 5\\times 6=630\$이다.

```
{"figureType": "square_pyramid_5_faces", "description": "밑면이 정사각형이고 옆면이 합동인 사각뿔", "elements": ["square pyramid with visible and dashed edges"]}
```

```
{
  "sourceQid": "Q23",
  "variationType": "NUMERIC",
  "standardCourse": "확률과 통계",
  "courseKey": "H22-PS",
  "curriculum": "2022",
  "standardUnitKey": "H22-PS-01",
  "subUnitKey": "H22-PS-01-CORE",
  "conceptClusterKey": "COMBINATORICS",
  "primaryMethod": "7C5=21로 5색 선택 후 밑면 5가지와 옆면 원순열 (4-1)!=6을 곱해 630 계산",
  "decisiveStep": "7C5 * 5 * 3! = 21 * 5 * 6",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "순열과 조합",
    "l3": "순열",
    "l4": "중복·원순열"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COUNTING_ARRANGEMENT",
    "templateKey": null,
    "why": "순열 > 중복·원순열"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "색 선택(조합)과 사각뿔 밑면 지정 및 옆면 원순열을 순서대로 곱하는 기본 입체도형 색칠 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "각뿔"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "조합",
      "원순열"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q24

- 형식: 서답형  
- 배점: 5.0

### 발문

\[서술형 4\] \$6\$개의 숫자 \$0,\\ 1,\\ 2,\\ 3,\\ 4,\\ 6\$을 모두 사용하여 만들 수 있는 여섯 자리 자연수 중에서 \$4\$의 배수의 개수를 구하고, 그 과정을 함께 서술하시오.

### 선지

없음

### 정답

204

### 해설

\$4\$의 배수가 되려면 끝 두 자리가 \$4\$의 배수여야 하므로 가능한 끝 두 자리는 \$04,\\ 20,\\ 40,\\ 60\$ (\$0\$ 포함 \$4\$개)과 \$12,\\ 16,\\ 24,\\ 32,\\ 36,\\ 64\$ (\$0\$ 미포함 \$6\$개)이다. ① \$0\$이 끝 두 자리에 포함된 \$4\$가지 경우: 앞 \$4\$자리에는 \$0\$이 없으므로 각각 \$4\!=24\$가지 \$\\implies 4\\times 24=96\$가지 ② \$0\$이 끝 두 자리에 없는 \$6\$가지 경우: 첫 자리에 \$0\$이 올 수 없으므로 각각 \$3\\times 3\!=18\$가지 \$\\implies 6\\times 18=108\$가지 따라서 \$4\$의 배수의 개수는 \$96+108=204\$이다.

```
"NONE"
```

```
{
  "sourceQid": "Q24",
  "variationType": "NUMERIC",
  "standardCourse": "확률과 통계",
  "courseKey": "H22-PS",
  "curriculum": "2022",
  "standardUnitKey": "H22-PS-01",
  "subUnitKey": "H22-PS-01-CORE",
  "conceptClusterKey": "COMBINATORICS",
  "primaryMethod": "끝 두 자리 4의 배수 10가지를 0 포함(4가지*4!)과 0 미포함(6가지*3*3!)으로 분류해 96+108=204 산출",
  "decisiveStep": "끝 두 자리에 0이 포함될 때(4!)와 미포함될 때(3*3!) 분리 계산",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "순열과 조합",
    "l3": "순열",
    "l4": "일렬 배열"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COUNTING_ARRANGEMENT",
    "templateKey": "TPL_PERMUTATION_STANDARD_CONSTRAINT",
    "why": "순열 > 일렬 배열"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "4의 배수 판정법과 최고 자리 0 금지 조건이 결합되어 끝 두 자리의 0 포함 여부에 따라 나누어 세어야 하는 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "자연수"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "순열",
      "경우분류"
    ],
    "condition": [
      "자연수"
    ]
  },
  "hold": ""
}
```

