

```
{
  "stem": "25_효천고_1학기_중간_고1_유사",
  "sourceArchiveFile": "original/high/h1/1mid/25_효천고_1학기_중간_고1_기출.js",
  "examFolder": "1mid",
  "grade": "고1",
  "curriculum": "2022",
  "questionCount": 23,
  "totalScore": 100.0,
  "generatedAt": "2026-11-17"
}
```

## Q01

- 형식: 객관식  
- 배점: 4

### 발문

다항식 \$x(x \+ 4)(x^2 \- ax \+ a)\$의 전개식에서 \$x^3\$의 계수와 \$x^2\$의 계수가 서로 같을 때, 상수 \$a\$의 값은?

### 선지

① \$-4\$ ② \$-3\$ ③ \$-2\$ ④ \$-1\$ ⑤ \$0\$

### 정답

③

### 해설

주어진 식을 전개하면 \$\$x(x \+ 4)(x^2 \- ax \+ a) \= (x^2 \+ 4x)(x^2 \- ax \+ a) \= x^4 \+ (4 \- a)x^3 \- 3ax^2 \+ 4ax\$\$ \$x^3\$의 계수 \$4 \- a\$와 \$x^2\$의 계수 \$-3a\$가 서로 같으므로 \$\$4 \- a \= \-3a \\implies 2a \= \-4 \\implies a \= \-2\$\$

```
"NONE"
```

```
{
  "sourceQid": "1",
  "variationType": "NUMERIC",
  "standardCourse": "공통수학1",
  "courseKey": null,
  "curriculum": "2022",
  "standardUnitKey": null,
  "subUnitKey": null,
  "conceptClusterKey": null,
  "primaryMethod": "다항식 $(x^2+4x)(x^2-ax+a)$를 전개해 $x^3$의 계수 $4-a$와 $x^2$의 계수 $-3a$가 같다는 방정식을 푼다.",
  "decisiveStep": "$x^2$ 항이 $ax^2-4ax^2=-3ax^2$임을 구해 $4-a=-3a$를 세우는 단계",
  "rpm": null,
  "ptTplCandidate": null,
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "사차식 전개를 통해 두 차수의 계수를 구하고 일차방정식을 푸는 문항이다.",
  "level": "중",
  "item4slot": {
    "domain": "다항식의연산",
    "concept": "다항식의곱셈",
    "skill": "계수비교방정식",
    "context": "다항식전개계수일치"
  },
  "hold": "원본 문항에 개별 배점이 미표기되어 총점 100점에 맞추어 배점(객관식 4점)을 배정함. 메타_키선택표_고1.json 부재로 키 선택표 기반 필드를 null로 보류 처리함."
}
```

## Q02

- 형식: 객관식  
- 배점: 4

### 발문

다항식 \$f(x)\$를 \$x \- 3\$으로 나누었을 때의 나머지가 \$2\$일 때, 다항식 \$x^2f(x)\$를 \$x \- 3\$으로 나누었을 때의 나머지는?

### 선지

① \$18\$ ② \$16\$ ③ \$14\$ ④ \$12\$ ⑤ \$10\$

### 정답

①

### 해설

나머지정리에 의하여 \$f(3) \= 2\$이다. \$x^2f(x)\$를 \$x \- 3\$으로 나누었을 때의 나머지는 \$x \= 3\$을 대입한 값이므로 \$\$3^2 f(3) \= 9 \\times 2 \= 18\$\$

```
"NONE"
```

```
{
  "sourceQid": "2",
  "variationType": "NUMERIC",
  "standardCourse": "공통수학1",
  "courseKey": null,
  "curriculum": "2022",
  "standardUnitKey": null,
  "subUnitKey": null,
  "conceptClusterKey": null,
  "primaryMethod": "나머지정리에 따라 $f(3)=2$를 얻고 $x^2f(x)$에 $x=3$을 대입해 나머지를 계산한다.",
  "decisiveStep": "$x^2f(x)$를 $x-3$으로 나눈 나머지가 $3^2f(3)$임을 바로 적용하는 단계",
  "rpm": null,
  "ptTplCandidate": null,
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "나머지정리를 두 번 직접 대입해 한 줄로 계산하는 문항이다.",
  "level": "중",
  "item4slot": {
    "domain": "항등식과나머지정리",
    "concept": "나머지정리",
    "skill": "변형다항식나머지계산",
    "context": "일차식나눗셈"
  },
  "hold": "원본 문항에 개별 배점이 미표기되어 총점 100점에 맞추어 배점함. 메타_키선택표_고1.json 부재로 키 선택표 기반 필드를 null로 보류 처리함."
}
```

## Q03

- 형식: 객관식  
- 배점: 4

### 발문

임의의 실수 \$k\$에 대하여 등식 \$(a \- 2)k \+ 3 \= 4k \+ b\$가 성립할 때, 두 상수 \$a, b\$에 대하여 \$a \- b\$의 값은?

### 선지

① \$-1\$ ② \$0\$ ③ \$1\$ ④ \$2\$ ⑤ \$3\$

### 정답

⑤

### 해설

주어진 등식이 \$k\$에 대한 항등식이므로 양변의 \$k\$의 계수와 상수항을 비교하면 \$\$a \- 2 \= 4 \\implies a \= 6, \\quad b \= 3\$\$ 따라서 \$a \- b \= 6 \- 3 \= 3\$이다.

```
"NONE"
```

```
{
  "sourceQid": "3",
  "variationType": "NUMERIC",
  "standardCourse": "공통수학1",
  "courseKey": null,
  "curriculum": "2022",
  "standardUnitKey": null,
  "subUnitKey": null,
  "conceptClusterKey": null,
  "primaryMethod": "$k$에 대한 항등식의 양변 일차항 계수와 상수항을 비교해 $a, b$를 구한다.",
  "decisiveStep": "계수비교 $a-2=4, 3=b$로 $a, b$를 바로 결정하는 단계",
  "rpm": null,
  "ptTplCandidate": null,
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "일차항등식의 계수비교법 한 번으로 끝나는 기본 문항이다.",
  "level": "중",
  "item4slot": {
    "domain": "항등식과나머지정리",
    "concept": "항등식",
    "skill": "계수비교법",
    "context": "일차항등식"
  },
  "hold": "원본 문항에 개별 배점이 미표기되어 총점 100점에 맞추어 배점함. 메타_키선택표_고1.json 부재로 키 선택표 기반 필드를 null로 보류 처리함."
}
```

## Q04

- 형식: 객관식  
- 배점: 4

### 발문

다음 중 인수분해가 옳지 않은 것은?

### 선지

① \$a^3 \- 3a^2 \+ 3a \- 1 \= (a \- 1)^3\$ ② \$x^4 \- x^2 \+ 1 \= (x^2 \+ x \+ 1)(x^2 \- x \+ 1)\$ ③ \$a^2 \+ b^2 \+ 4c^2 \+ 2ab \- 4bc \- 4ca \= (a \+ b \- 2c)^2\$ ④ \$a^3 \+ b^3 \+ c^3 \- 3abc \= (a \+ b \+ c)(a^2 \+ b^2 \+ c^2 \- ab \- bc \- ca)\$ ⑤ \$x^3 \- y^3 \= (x \- y)(x^2 \+ xy \+ y^2)\$

### 정답

②

### 해설

② \$(x^2 \+ x \+ 1)(x^2 \- x \+ 1\) \= (x^2 \+ 1)^2 \- x^2 \= x^4 \+ 2x^2 \+ 1 \- x^2 \= x^4 \+ x^2 \+ 1\$이므로 좌변 \$x^4 \- x^2 \+ 1\$과 다르다. 나머지 ①, ③, ④, ⑤는 모두 옳은 인수분해 공식이다.

```
"NONE"
```

```
{
  "sourceQid": "4",
  "variationType": "CONDITION",
  "standardCourse": "공통수학1",
  "courseKey": null,
  "curriculum": "2022",
  "standardUnitKey": null,
  "subUnitKey": null,
  "conceptClusterKey": null,
  "primaryMethod": "다섯 개의 인수분해 공식의 우변을 전개해 좌변과 부호·계수가 일치하지 않는 보기 ②를 찾는다.",
  "decisiveStep": "$(x^2+x+1)(x^2-x+1)=x^4+x^2+1$의 $x^2$ 항 부호가 $+$임을 확인하는 단계",
  "rpm": null,
  "ptTplCandidate": null,
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "고교 기본 인수분해 공식 다섯 가지를 대조해 오류를 찾는 문항이다.",
  "level": "중",
  "item4slot": {
    "domain": "인수분해",
    "concept": "인수분해공식",
    "skill": "공식오류판별",
    "context": "다항식공식검증"
  },
  "hold": "원본 문항에 개별 배점이 미표기되어 총점 100점에 맞추어 배점함. 메타_키선택표_고1.json 부재로 키 선택표 기반 필드를 null로 보류 처리함."
}
```

## Q05

- 형식: 객관식  
- 배점: 4

### 발문

복소수 \$z \= 5 \- 2i\$의 실수부분과 허수부분의 합은? (단, \$i \= \\sqrt{-1}\$)

### 선지

① \$-3\$ ② \$0\$ ③ \$2\$ ④ \$3\$ ⑤ \$7\$

### 정답

④

### 해설

복소수 \$z \= 5 \- 2i\$의 실수부분은 \$5\$, 허수부분은 \$-2\$이므로 두 부분의 합은 \$5 \+ (-2) \= 3\$이다.

```
"NONE"
```

```
{
  "sourceQid": "5",
  "variationType": "NUMERIC",
  "standardCourse": "공통수학1",
  "courseKey": null,
  "curriculum": "2022",
  "standardUnitKey": null,
  "subUnitKey": null,
  "conceptClusterKey": null,
  "primaryMethod": "복소수 $5-2i$에서 실수부분 $5$와 허수부분 $-2$를 읽어 더한다.",
  "decisiveStep": "허수부분이 $2$가 아니라 $-2$임을 정확히 추출하는 단계",
  "rpm": null,
  "ptTplCandidate": null,
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "복소수의 실수부분과 허수부분의 정의를 직접 읽는 문항이다.",
  "level": "중",
  "item4slot": {
    "domain": "복소수",
    "concept": "복소수의뜻",
    "skill": "실수부허수부합",
    "context": "복소수성분읽기"
  },
  "hold": "원본 문항에 개별 배점이 미표기되어 총점 100점에 맞추어 배점함. 메타_키선택표_고1.json 부재로 키 선택표 기반 필드를 null로 보류 처리함."
}
```

## Q06

- 형식: 객관식  
- 배점: 4

### 발문

복소수 \$z \= \-4 \+ 5i\$의 켤레복소수는? (단, \$i \= \\sqrt{-1}\$)

### 선지

① \$-4 \+ 5i\$ ② \$-4 \- 5i\$ ③ \$4 \+ 5i\$ ④ \$4 \- 5i\$ ⑤ \$5 \- 4i\$

### 정답

②

### 해설

복소수 \$z \= \-4 \+ 5i\$의 허수부분 \$+5\$의 부호를 반대로 바꾸면 켤레복소수는 \$-4 \- 5i\$이다.

```
"NONE"
```

```
{
  "sourceQid": "6",
  "variationType": "NUMERIC",
  "standardCourse": "공통수학1",
  "courseKey": null,
  "curriculum": "2022",
  "standardUnitKey": null,
  "subUnitKey": null,
  "conceptClusterKey": null,
  "primaryMethod": "복소수 $-4+5i$의 허수부분 $+5$의 부호만 바꾸어 켤레복소수 $-4-5i$를 구한다.",
  "decisiveStep": "실수부분 $-4$는 그대로 두고 허수부분 $+5$만 $-5$로 바꾸는 단계",
  "rpm": null,
  "ptTplCandidate": null,
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "켤레복소수의 정의를 바로 적용하는 기본 문항이다.",
  "level": "중",
  "item4slot": {
    "domain": "복소수",
    "concept": "켤레복소수",
    "skill": "켤레복소수구하기",
    "context": "복소수표현"
  },
  "hold": "원본 문항에 개별 배점이 미표기되어 총점 100점에 맞추어 배점함. 메타_키선택표_고1.json 부재로 키 선택표 기반 필드를 null로 보류 처리함."
}
```

## Q07

- 형식: 객관식  
- 배점: 4

### 발문

어느 직육면체의 모든 모서리의 길이의 합이 \$60\$이고 대각선의 길이가 \$9\$일 때, 이 직육면체의 겉넓이는?

### 선지

① \$112\$ ② \$120\$ ③ \$128\$ ④ \$136\$ ⑤ \$144\$

### 정답

⑤

### 해설

직육면체의 가로, 세로, 높이의 길이를 각각 \$a, b, c\$라 하면

- 모든 모서리의 길이의 합: \$4(a \+ b \+ c) \= 60 \\implies a \+ b \+ c \= 15\$  
- 대각선의 길이: \$\\sqrt{a^2 \+ b^2 \+ c^2} \= 9 \\implies a^2 \+ b^2 \+ c^2 \= 81\$

구하는 겉넓이는 \$2(ab \+ bc \+ ca)\$이므로 곱셈 공식의 변형에 의하여 \$\$2(ab \+ bc \+ ca) \= (a \+ b \+ c)^2 \- (a^2 \+ b^2 \+ c^2) \= 15^2 \- 81 \= 225 \- 81 \= 144\$\$

```
"NONE"
```

```
{
  "sourceQid": "7",
  "variationType": "NUMERIC",
  "standardCourse": "공통수학1",
  "courseKey": null,
  "curriculum": "2022",
  "standardUnitKey": null,
  "subUnitKey": null,
  "conceptClusterKey": null,
  "primaryMethod": "직육면체의 모서리 합 $4(a+b+c)=60$과 대각선 $a^2+b^2+c^2=81$을 곱셈 공식 $(a+b+c)^2$에 대입해 겉넓이 $2(ab+bc+ca)$를 구한다.",
  "decisiveStep": "모서리 합과 대각선 길이를 $a+b+c=15$, $a^2+b^2+c^2=81$로 번역해 공식에 대입하는 단계",
  "rpm": null,
  "ptTplCandidate": null,
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "입체도형 조건을 세 변수의 대칭식 조건으로 바꾼 뒤 곱셈 공식을 적용하는 문항이다.",
  "level": "중",
  "item4slot": {
    "domain": "다항식의연산",
    "concept": "곱셈공식의변형",
    "skill": "도형조건대칭식연계",
    "context": "직육면체겉넓이"
  },
  "hold": "원본 문항에 개별 배점이 미표기되어 총점 100점에 맞추어 배점함. 메타_키선택표_고1.json 부재로 키 선택표 기반 필드를 null로 보류 처리함."
}
```

## Q08

- 형식: 객관식  
- 배점: 4

### 발문

다항식 \$f(x) \= x^3 \+ ax^2 \+ bx \- 3\$이 \$(x \+ 1)^2\$으로 나누어떨어질 때, \$f(x)\$를 \$x \+ 2\$로 나누었을 때의 나머지는? (단, \$a, b\$는 상수이다.)

### 선지

① \$-5\$ ② \$-3\$ ③ \$-1\$ ④ \$1\$ ⑤ \$3\$

### 정답

①

### 해설

\$f(x)\$의 최고차항의 계수가 \$1\$이고 \$(x \+ 1)^2\$으로 나누어떨어지므로 \$f(x) \= (x \+ 1)^2(x \+ c)\$로 놓을 수 있다. 상수항을 비교하면 \$1^2 \\times c \= \-3 \\implies c \= \-3\$이므로 \$\$f(x) \= (x \+ 1)^2(x \- 3)\$\$ 따라서 \$f(x)\$를 \$x \+ 2\$로 나누었을 때의 나머지는 \$\$f(-2) \= (-2 \+ 1)^2(-2 \- 3\) \= 1 \\times (-5) \= \-5\$\$

```
"NONE"
```

```
{
  "sourceQid": "8",
  "variationType": "NUMERIC",
  "standardCourse": "공통수학1",
  "courseKey": null,
  "curriculum": "2022",
  "standardUnitKey": null,
  "subUnitKey": null,
  "conceptClusterKey": null,
  "primaryMethod": "$f(x)=(x+1)^2(x+c)$로 설정한 뒤 상수항 비교로 $c=-3$을 바로 구해 $f(-2)$를 계산한다.",
  "decisiveStep": "상수항 $-3$을 이용해 몫의 일차식 $x+c$에서 $c=-3$을 즉시 결정하는 단계",
  "rpm": null,
  "ptTplCandidate": null,
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "완전제곱식 나누어떨어짐 조건으로 몫을 설정하고 나머지정리를 적용하는 문항이다.",
  "level": "중",
  "item4slot": {
    "domain": "항등식과나머지정리",
    "concept": "인수정리",
    "skill": "몫설정후나머지계산",
    "context": "완전제곱식인수"
  },
  "hold": "원본 문항에 개별 배점이 미표기되어 총점 100점에 맞추어 배점함. 메타_키선택표_고1.json 부재로 키 선택표 기반 필드를 null로 보류 처리함."
}
```

## Q09

- 형식: 객관식  
- 배점: 4

### 발문

삼각형의 세 변의 길이 \$a, b, c\$가 \$a^3 \+ b^3 \+ c^3 \= 3abc\$를 만족시키고 이 삼각형의 둘레의 길이가 \$18\$일 때, 이 삼각형의 넓이는?

### 선지

① \$6\\sqrt{3}\$ ② \$8\\sqrt{3}\$ ③ \$9\\sqrt{3}\$ ④ \$12\\sqrt{3}\$ ⑤ \$18\\sqrt{3}\$

### 정답

③

### 해설

\$\$a^3 \+ b^3 \+ c^3 \- 3abc \= \\frac{1}{2}(a \+ b \+ c){(a \- b)^2 \+ (b \- c)^2 \+ (c \- a)^2} \= 0\$\$ \$a, b, c\$는 삼각형의 변의 길이이므로 \$a \+ b \+ c \> 0\$이고, 따라서 \$a \= b \= c\$인 정삼각형이다. 둘레의 길이가 \$18\$이므로 한 변의 길이는 \$6\$이고, 구하는 넓이는 \$\$\\frac{\\sqrt{3}}{4} \\times 6^2 \= 9\\sqrt{3}\$\$

```
"NONE"
```

```
{
  "sourceQid": "9",
  "variationType": "NUMERIC",
  "standardCourse": "공통수학1",
  "courseKey": null,
  "curriculum": "2022",
  "standardUnitKey": null,
  "subUnitKey": null,
  "conceptClusterKey": null,
  "primaryMethod": "$a^3+b^3+c^3-3abc=0$을 인수분해해 정삼각형 $a=b=c$임을 밝힌 뒤 둘레 $18$에서 한 변 $6$의 정삼각형 넓이를 구한다.",
  "decisiveStep": "세 변 길이 조건 $a+b+c>0$으로 $(a-b)^2+(b-c)^2+(c-a)^2=0$을 도출해 $a=b=c$를 얻는 단계",
  "rpm": null,
  "ptTplCandidate": null,
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "세제곱 항등식 인수분해를 통해 정삼각형을 판별하고 넓이 공식을 적용하는 문항이다.",
  "level": "중",
  "item4slot": {
    "domain": "인수분해",
    "concept": "인수분해의활용",
    "skill": "삼각형모양판별후넓이",
    "context": "세변길이인수분해"
  },
  "hold": "원본 문항에 개별 배점이 미표기되어 총점 100점에 맞추어 배점함. 메타_키선택표_고1.json 부재로 키 선택표 기반 필드를 null로 보류 처리함."
}
```

## Q10

- 형식: 객관식  
- 배점: 4

### 발문

다항식 \$x^2 \+ xy \- 2y^2 \+ 4x \+ 5y \+ 3\$을 인수분해한 것은?

### 선지

① \$(x \+ 2y \- 1)(x \- y \- 3)\$ ② \$(x \+ y \+ 1)(x \- 2y \+ 3)\$ ③ \$(x \- 2y \+ 1)(x \+ y \+ 3)\$ ④ \$(x \+ 2y \+ 1)(x \- y \+ 3)\$ ⑤ \$(x \+ 2y \+ 3)(x \- y \+ 1)\$

### 정답

④

### 해설

주어진 식을 \$x\$에 대하여 내림차순으로 정리하면 \$\$x^2 \+ (y \+ 4)x \- (2y^2 \- 5y \- 3\) \= x^2 \+ (y \+ 4)x \- (2y \+ 1)(y \- 3)\$\$ \$(2y \+ 1\) \+ (-y \+ 3\) \= y \+ 4\$이므로 \$\$x^2 \+ xy \- 2y^2 \+ 4x \+ 5y \+ 3 \= (x \+ 2y \+ 1)(x \- y \+ 3)\$\$

```
"NONE"
```

```
{
  "sourceQid": "10",
  "variationType": "NUMERIC",
  "standardCourse": "공통수학1",
  "courseKey": null,
  "curriculum": "2022",
  "standardUnitKey": null,
  "subUnitKey": null,
  "conceptClusterKey": null,
  "primaryMethod": "$x$에 대하여 내림차순 정리 후 상수항 역할을 하는 $y$의 이차식을 먼저 인수분해해 전체를 일차식의 곱으로 분해한다.",
  "decisiveStep": "상수항 $-(2y^2-5y-3)=-(2y+1)(y-3)$의 두 인수를 조합해 $x$의 계수 $y+4$를 맞추는 단계",
  "rpm": null,
  "ptTplCandidate": null,
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "두 문자 이차식을 한 문자 기준으로 내림차순 정리해 두 번 인수분해하는 표준 문항이다.",
  "level": "중",
  "item4slot": {
    "domain": "인수분해",
    "concept": "복잡한식의인수분해",
    "skill": "내림차순이중인수분해",
    "context": "두문자이차식"
  },
  "hold": "원본 문항에 개별 배점이 미표기되어 총점 100점에 맞추어 배점함. 메타_키선택표_고1.json 부재로 키 선택표 기반 필드를 null로 보류 처리함."
}
```

## Q11

- 형식: 객관식  
- 배점: 4

### 발문

복소수 \$\\dfrac{3a \- i}{4 \+ 3i}\$의 실수부분과 허수부분의 합이 \$\\dfrac{1}{5}\$일 때, 실수 \$a\$의 값은? (단, \$i \= \\sqrt{-1}\$)

### 선지

① \$4\$ ② \$5\$ ③ \$6\$ ④ \$7\$ ⑤ \$8\$

### 정답

①

### 해설

분모와 분자에 \$4 \- 3i\$를 곱하여 실수화하면 \$\$\\frac{3a \- i}{4 \+ 3i} \= \\frac{(3a \- i)(4 \- 3i)}{(4 \+ 3i)(4 \- 3i)} \= \\frac{12a \- 9ai \- 4i \+ 3i^2}{16 \+ 9} \= \\frac{(12a \- 3\) \- (9a \+ 4)i}{25}\$\$ 실수부분과 허수부분의 합이 \$\\frac{1}{5}\$이므로 \$\$\\frac{(12a \- 3\) \- (9a \+ 4)}{25} \= \\frac{3a \- 7}{25} \= \\frac{1}{5} \= \\frac{5}{25}\$\$ \$\$3a \- 7 \= 5 \\implies 3a \= 12 \\implies a \= 4\$\$

```
"NONE"
```

```
{
  "sourceQid": "11",
  "variationType": "NUMERIC",
  "standardCourse": "공통수학1",
  "courseKey": null,
  "curriculum": "2022",
  "standardUnitKey": null,
  "subUnitKey": null,
  "conceptClusterKey": null,
  "primaryMethod": "분모를 실수화하여 실수부와 허수부를 분리한 뒤 합이 $\frac{1}{5}$인 일차방정식을 푼다.",
  "decisiveStep": "분모 $4^2+3^2=25$로 실수화해 $\frac{3a-7}{25}=\frac{1}{5}$을 세우는 단계",
  "rpm": null,
  "ptTplCandidate": null,
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "분모 실수화 계산과 실수부·허수부 합 방정식을 푸는 표준 문항이다.",
  "level": "중",
  "item4slot": {
    "domain": "복소수",
    "concept": "복소수의나눗셈",
    "skill": "분모실수화후계수결정",
    "context": "실수부허수부합"
  },
  "hold": "원본 문항에 개별 배점이 미표기되어 총점 100점에 맞추어 배점함. 메타_키선택표_고1.json 부재로 키 선택표 기반 필드를 null로 보류 처리함."
}
```

## Q12

- 형식: 객관식  
- 배점: 4

### 발문

\$\\left(\\dfrac{1 \- i}{\\sqrt{2}}\\right)^7 \+ \\left(\\dfrac{\\sqrt{2}}{1 \- i}\\right)^7\$의 값은? (단, \$i \= \\sqrt{-1}\$)

### 선지

① \$-\\sqrt{2}\$ ② \$0\$ ③ \$\\sqrt{2}\$ ④ \$2\$ ⑤ \$2\\sqrt{2}\$

### 정답

③

### 해설

\$z \= \\frac{1 \- i}{\\sqrt{2}}\$라 하면 \$z^2 \= \\frac{1 \- 2i \- 1}{2} \= \-i\$, \$z^4 \= (-i)^2 \= \-1\$, \$z^6 \= (-1)(-i) \= i\$이므로 \$\$z^7 \= z^6 \\cdot z \= i \\cdot \\frac{1 \- i}{\\sqrt{2}} \= \\frac{1 \+ i}{\\sqrt{2}}\$\$ 한편 \$\\frac{\\sqrt{2}}{1 \- i} \= \\frac{\\sqrt{2}(1 \+ i)}{2} \= \\frac{1 \+ i}{\\sqrt{2}} \= \\bar{z}\$이므로 \$\$\\left(\\frac{\\sqrt{2}}{1 \- i}\\right)^7 \= (\\bar{z})^7 \= \\overline{z^7} \= \\overline{\\left(\\frac{1 \+ i}{\\sqrt{2}}\\right)} \= \\frac{1 \- i}{\\sqrt{2}}\$\$ 따라서 구하는 값은 \$\$\\frac{1 \+ i}{\\sqrt{2}} \+ \\frac{1 \- i}{\\sqrt{2}} \= \\frac{2}{\\sqrt{2}} \= \\sqrt{2}\$\$

```
"NONE"
```

```
{
  "sourceQid": "12",
  "variationType": "NUMERIC",
  "standardCourse": "공통수학1",
  "courseKey": null,
  "curriculum": "2022",
  "standardUnitKey": null,
  "subUnitKey": null,
  "conceptClusterKey": null,
  "primaryMethod": "$z=\frac{1-i}{\sqrt{2}}$의 제곱 $z^2=-i$를 이용해 $z^7$을 구하고 역수가 켤레복소수 $\bar{z}$임을 이용해 $\overline{z^7}$과 더한다.",
  "decisiveStep": "$\frac{\sqrt{2}}{1-i}=\bar{z}$임을 파악해 $z^7+\overline{z^7}$으로 실수화하는 단계",
  "rpm": null,
  "ptTplCandidate": null,
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "제곱을 통한 거듭제곱 차수 축소와 역수의 켤레복소수 성질을 함께 활용해야 한다.",
  "level": "중",
  "item4slot": {
    "domain": "복소수",
    "concept": "복소수의거듭제곱",
    "skill": "거듭제곱과켤레성질결합",
    "context": "역수복소수거듭제곱합"
  },
  "hold": "원본 문항에 개별 배점이 미표기되어 총점 100점에 맞추어 배점함. 메타_키선택표_고1.json 부재로 키 선택표 기반 필드를 null로 보류 처리함."
}
```

## Q13

- 형식: 객관식  
- 배점: 4

### 발문

이차방정식 \$2x^2 \+ 3x \+ 4 \= 0\$의 두 근을 \$\\alpha, \\beta\$라 하자. 두 수 \$\\dfrac{1}{\\alpha^2}, \\dfrac{1}{\\beta^2}\$을 두 근으로 하고 \$x^2\$의 계수가 \$1\$인 이차방정식이 \$x^2 \+ ax \+ b \= 0\$일 때, \$\\dfrac{7}{a} \+ \\dfrac{1}{b}\$의 값은? (단, \$a, b\$는 실수이다.)

### 선지

① \$18\$ ② \$20\$ ③ \$22\$ ④ \$24\$ ⑤ \$26\$

### 정답

②

### 해설

근과 계수의 관계에 의하여 \$\\alpha \+ \\beta \= \-\\frac{3}{2}\$, \$\\alpha\\beta \= 2\$이다. \$\$\\alpha^2 \+ \\beta^2 \= (\\alpha \+ \\beta)^2 \- 2\\alpha\\beta \= \\frac{9}{4} \- 4 \= \-\\frac{7}{4}, \\quad (\\alpha\\beta)^2 \= 4\$\$ 새로운 이차방정식 \$x^2 \+ ax \+ b \= 0\$의 두 근이 \$\\frac{1}{\\alpha^2}, \\frac{1}{\\beta^2}\$이므로 \$\$-a \= \\frac{1}{\\alpha^2} \+ \\frac{1}{\\beta^2} \= \\frac{\\alpha^2 \+ \\beta^2}{(\\alpha\\beta)^2} \= \\frac{-7/4}{4} \= \-\\frac{7}{16} \\implies a \= \\frac{7}{16}\$\$ \$\$b \= \\frac{1}{\\alpha^2\\beta^2} \= \\frac{1}{4}\$\$ 따라서 구하는 값은 \$\$\\frac{7}{a} \+ \\frac{1}{b} \= \\frac{7}{7/16} \+ \\frac{1}{1/4} \= 16 \+ 4 \= 20\$\$

```
"NONE"
```

```
{
  "sourceQid": "13",
  "variationType": "NUMERIC",
  "standardCourse": "공통수학1",
  "courseKey": null,
  "curriculum": "2022",
  "standardUnitKey": null,
  "subUnitKey": null,
  "conceptClusterKey": null,
  "primaryMethod": "근과 계수의 관계로 $\alpha^2+\beta^2, (\alpha\beta)^2$을 구한 뒤 역수 제곱 근의 합과 곱에서 $a, b$를 계산한다.",
  "decisiveStep": "$\frac{1}{\alpha^2}+\frac{1}{\beta^2}=\frac{(\alpha+\beta)^2-2\alpha\beta}{(\alpha\beta)^2}$으로 분수 계수 $a$를 정확히 구하는 단계",
  "rpm": null,
  "ptTplCandidate": null,
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "역수 제곱 근의 합·곱을 구하는 분수 계산과 근과 계수의 관계 적용이 연속으로 필요하다.",
  "level": "중",
  "item4slot": {
    "domain": "복소수와이차방정식",
    "concept": "이차방정식의근과계수의관계",
    "skill": "역수제곱근방정식작성",
    "context": "근의역수제곱"
  },
  "hold": "원본 문항에 개별 배점이 미표기되어 총점 100점에 맞추어 배점함. 메타_키선택표_고1.json 부재로 키 선택표 기반 필드를 null로 보류 처리함."
}
```

## Q14

- 형식: 객관식  
- 배점: 4

### 발문

\$x\$에 대한 이차방정식 \$x^2 \- kx \+ k \+ 2 \= 0\$의 두 근의 비가 \$1 : 2\$가 되도록 하는 실수 \$k\$의 최댓값을 \$M\$, 최솟값을 \$m\$이라 할 때, \$M \- m\$의 값은?

### 선지

① \$\\dfrac{11}{2}\$ ② \$6\$ ③ \$\\dfrac{13}{2}\$ ④ \$7\$ ⑤ \$\\dfrac{15}{2}\$

### 정답

⑤

### 해설

두 근을 \$\\alpha, 2\\alpha\$ (\$\\alpha \\neq 0\$)라 놓으면 근과 계수의 관계에 의하여 \$\$\\alpha \+ 2\\alpha \= 3\\alpha \= k \\implies \\alpha \= \\frac{k}{3}, \\quad \\alpha \\cdot 2\\alpha \= 2\\alpha^2 \= k \+ 2\$\$ 이를 연립하면 \$\$2\\left(\\frac{k}{3}\\right)^2 \= k \+ 2 \\implies 2k^2 \- 9k \- 18 \= 0 \\implies (2k \+ 3)(k \- 6\) \= 0\$\$ 따라서 \$k \= 6\$ 또는 \$k \= \-\\frac{3}{2}\$이므로 \$M \= 6\$, \$m \= \-\\frac{3}{2}\$이고 \$\$M \- m \= 6 \- \\left(-\\frac{3}{2}\\right) \= \\frac{15}{2}\$\$

```
"NONE"
```

```
{
  "sourceQid": "14",
  "variationType": "NUMERIC",
  "standardCourse": "공통수학1",
  "courseKey": null,
  "curriculum": "2022",
  "standardUnitKey": null,
  "subUnitKey": null,
  "conceptClusterKey": null,
  "primaryMethod": "두 근을 $\alpha, 2\alpha$로 놓고 근과 계수의 관계 두 식을 연립해 $k$에 대한 이차방정식 $2k^2-9k-18=0$을 푼다.",
  "decisiveStep": "$\alpha=\frac{k}{3}$을 곱의 관계식 $2\alpha^2=k+2$에 대입해 두 $k$ 값을 구하는 단계",
  "rpm": null,
  "ptTplCandidate": null,
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "두 근의 비 설정 후 근과 계수의 관계 연립으로 이차방정식을 푸는 표준 문항이다.",
  "level": "중",
  "item4slot": {
    "domain": "복소수와이차방정식",
    "concept": "이차방정식의근과계수의관계",
    "skill": "근의비조건연립",
    "context": "두근비율매개변수"
  },
  "hold": "원본 문항에 개별 배점이 미표기되어 총점 100점에 맞추어 배점함. 메타_키선택표_고1.json 부재로 키 선택표 기반 필드를 null로 보류 처리함."
}
```

## Q15

- 형식: 객관식  
- 배점: 4

### 발문

다항식 \$x^{2025} \- 1\$을 \$x \- 1\$로 나누었을 때의 몫을 \$f(x)\$, 나머지를 \$a\$라 하자. \$f(1) \= b\$라 할 때, \$a \+ b\$의 값은? (단, \$a, b\$는 상수이다.)

### 선지

① \$-2025\$ ② \$-2024\$ ③ \$2024\$ ④ \$2025\$ ⑤ \$2026\$

### 정답

④

### 해설

나눗셈 항등식을 세우면 \$x^{2025} \- 1 \= (x \- 1)f(x) \+ a\$이다. 양변에 \$x \= 1\$을 대입하면 \$1^{2025} \- 1 \= a \\implies a \= 0\$이다. 인수분해 공식에 의하여 \$\$x^{2025} \- 1 \= (x \- 1)(x^{2024} \+ x^{2023} \+ \\dots \+ x \+ 1)\$\$ 이므로 \$f(x) \= x^{2024} \+ x^{2023} \+ \\dots \+ x \+ 1\$이다. 따라서 \$b \= f(1) \= \\underbrace{1 \+ 1 \+ \\dots \+ 1}\_{2025\\text{개}} \= 2025\$이고 \$\$a \+ b \= 0 \+ 2025 \= 2025\$\$

```
"NONE"
```

```
{
  "sourceQid": "15",
  "variationType": "NUMERIC",
  "standardCourse": "공통수학1",
  "courseKey": null,
  "curriculum": "2022",
  "standardUnitKey": null,
  "subUnitKey": null,
  "conceptClusterKey": null,
  "primaryMethod": "나머지정리로 $a=0$을 구하고 $x^{2025}-1$의 인수분해로 몫 $f(x)$를 구해 $f(1)$을 계산한다.",
  "decisiveStep": "몫 $f(x)=x^{2024}+\dots+x+1$의 항의 개수가 $2025$개임을 파악해 $f(1)=2025$를 구하는 단계",
  "rpm": null,
  "ptTplCandidate": null,
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "고차식 $x^n-1$의 인수분해 공식과 항의 개수 세기를 연결하는 문항이다.",
  "level": "중",
  "item4slot": {
    "domain": "항등식과나머지정리",
    "concept": "나머지정리",
    "skill": "고차나눗셈몫함숫값",
    "context": "고차거듭제곱나눗셈"
  },
  "hold": "원본 문항에 개별 배점이 미표기되어 총점 100점에 맞추어 배점함. 메타_키선택표_고1.json 부재로 키 선택표 기반 필드를 null로 보류 처리함."
}
```

## Q16

- 형식: 객관식  
- 배점: 4

### 발문

\$x\$에 대한 이차방정식 \$2x^2 \+ ax \+ b \= 0\$의 한 근이 \$-2 \+ i\$이고, \$x\$에 대한 이차방정식 \$x^2 \- 2ax \+ b \+ k \= 0\$이 서로 다른 두 실근을 갖도록 하는 홀수인 자연수 \$k\$의 개수는? (단, \$a, b\$는 실수이고 \$i \= \\sqrt{-1}\$이다.)

### 선지

① \$27\$ ② \$28\$ ③ \$29\$ ④ \$30\$ ⑤ \$31\$

### 정답

①

### 해설

\$2x^2 \+ ax \+ b \= 0\$의 계수가 모두 실수이므로 한 근이 \$-2 \+ i\$이면 켤레복소수 \$-2 \- i\$도 근이다. 근과 계수의 관계에 의하여 \$\$(-2 \+ i) \+ (-2 \- i) \= \-4 \= \-\\frac{a}{2} \\implies a \= 8\$\$ \$\$(-2 \+ i)(-2 \- i) \= 4 \+ 1 \= 5 \= \\frac{b}{2} \\implies b \= 10\$\$ 이를 두 번째 방정식에 대입하면 \$x^2 \- 16x \+ 10 \+ k \= 0\$이고, 서로 다른 두 실근을 가지므로 \$\$\\frac{D}{4} \= (-8)^2 \- (10 \+ k) \> 0 \\implies 54 \- k \> 0 \\implies k \< 54\$\$ \$54\$보다 작은 홀수인 자연수는 \$1, 3, 5, \\dots, 53\$으로 총 \$27\$개이다.

```
"NONE"
```

```
{
  "sourceQid": "16",
  "variationType": "NUMERIC",
  "standardCourse": "공통수학1",
  "courseKey": null,
  "curriculum": "2022",
  "standardUnitKey": null,
  "subUnitKey": null,
  "conceptClusterKey": null,
  "primaryMethod": "실계수 켤레근 $-2\pm i$로 $a=8, b=10$을 구한 뒤 두 번째 방정식의 판별식 $D/4>0$에서 $k<54$를 얻어 홀수 개수를 센다.",
  "decisiveStep": "첫 방정식의 최고차항 계수 $2$를 반영해 $a, b$를 구하고 $k<54$인 홀수 자연수 개수를 세는 단계",
  "rpm": null,
  "ptTplCandidate": null,
  "crossConceptKeys": [],
  "conditionKeys": ["COND_NATURAL_NUMBER"],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "실계수 켤레근 성질, 근과 계수의 관계, 판별식 부등식, 홀수 개수 세기가 순차 결합된 문항이다.",
  "level": "중",
  "item4slot": {
    "domain": "복소수와이차방정식",
    "concept": "이차방정식의켤레근",
    "skill": "켤레근후판별식개수",
    "context": "복소수근과실근조건"
  },
  "hold": "원본 문항에 개별 배점이 미표기되어 총점 100점에 맞추어 배점함. 메타_키선택표_고1.json 부재로 키 선택표 기반 필드를 null로 보류 처리함."
}
```

## Q17

- 형식: 객관식  
- 배점: 4

### 발문

\$3\$ 이상의 자연수 \$n\$에 대하여 다항식 \${(n \- 2)x^n \+ 3x^{n-2} \+ 2}^2\$의 전개식에서 서로 다른 항의 개수가 \$5\$일 때, 이 다항식의 상수항을 포함한 모든 계수의 합은?

### 선지

① \$25\$ ② \$36\$ ③ \$42\$ ④ \$48\$ ⑤ \$49\$

### 정답

⑤

### 해설

전개식에서 나올 수 있는 항의 차수는 \$2n,\\ 2n \- 2,\\ 2n \- 4,\\ n,\\ n \- 2,\\ 0\$의 \$6\$가지이다. \$n \\ge 3\$이므로 \$2n \> 2n \- 2 \> 2n \- 4 \> 0\$이고 \$n \> n \- 2 \> 0\$이다. 서로 다른 항의 개수가 \$5\$개가 되려면 두 차수가 일치해야 하므로 가능한 경우는 \$2n \- 4 \= n\$, 즉 \$n \= 4\$뿐이다. \$n \= 4\$를 대입하면 다항식은 \$(2x^4 \+ 3x^2 \+ 2)^2\$이고, 모든 계수의 합은 \$x \= 1\$을 대입한 값과 같으므로 \$\$(2 \+ 3 \+ 2)^2 \= 7^2 \= 49\$\$

```
"NONE"
```

```
{
  "sourceQid": "17",
  "variationType": "NUMERIC",
  "standardCourse": "공통수학1",
  "courseKey": null,
  "curriculum": "2022",
  "standardUnitKey": null,
  "subUnitKey": null,
  "conceptClusterKey": null,
  "primaryMethod": "전개 시 발생하는 $6$개 항의 차수 대소를 $n \ge 3$ 조건으로 비교해 $2n-4=n \implies n=4$를 찾고 $x=1$을 대입한다.",
  "decisiveStep": "$6$개 차수 중 유일하게 일치할 수 있는 쌍이 $2n-4=n$임을 대소 비교로 확정하는 단계",
  "rpm": null,
  "ptTplCandidate": null,
  "crossConceptKeys": [],
  "conditionKeys": ["COND_NATURAL_NUMBER"],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "미지 차수 $n$에 대한 항의 차수 대소 비교와 중복 조건 분석을 스스로 수행해야 한다.",
  "level": "중",
  "item4slot": {
    "domain": "다항식의연산",
    "concept": "다항식의곱셈",
    "skill": "차수대소비교계수합",
    "context": "미지차수제곱전개"
  },
  "hold": "원본 문항에 개별 배점이 미표기되어 총점 100점에 맞추어 배점함. 메타_키선택표_고1.json 부재로 키 선택표 기반 필드를 null로 보류 처리함."
}
```

## Q18

- 형식: 객관식  
- 배점: 4

### 발문

두 자연수 \$a, b\$에 대하여 복소수 \$z \= a \+ bi\$가 \$(z \+ 3i)(\\bar{z} \- 3i) \= 65\$를 만족시킬 때, \$(z \+ 2)(\\bar{z} \+ 2)\$의 최솟값은? (단, \$i \= \\sqrt{-1}\$)

### 선지

① \$32\$ ② \$34\$ ③ \$36\$ ④ \$38\$ ⑤ \$40\$

### 정답

②

### 해설

\$z \+ 3i \= a \+ (b \+ 3)i\$와 \$\\bar{z} \- 3i \= a \- (b \+ 3)i\$는 서로 켤레복소수이므로 \$\$(z \+ 3i)(\\bar{z} \- 3i) \= a^2 \+ (b \+ 3)^2 \= 65\$\$ \$a, b\$가 자연수이므로 \$b \+ 3 \\ge 4\$이다. 제곱의 합이 \$65\$인 두 자연수 쌍은 \$1^2 \+ 8^2\$과 \$4^2 \+ 7^2\$이므로 가능한 \$(a, b)\$는

- \$(a, b \+ 3\) \= (1, 8\) \\implies (a, b) \= (1, 5)\$  
- \$(a, b \+ 3\) \= (4, 7\) \\implies (a, b) \= (4, 4)\$  
- \$(a, b \+ 3\) \= (7, 4\) \\implies (a, b) \= (7, 1)\$

구하는 값은 \$(z \+ 2)(\\bar{z} \+ 2\) \= (a \+ 2)^2 \+ b^2\$이므로 각 경우에 대입하면

- \$(1, 5)\$: \$3^2 \+ 5^2 \= 34\$  
- \$(4, 4)\$: \$6^2 \+ 4^2 \= 52\$  
- \$(7, 1)\$: \$9^2 \+ 1^2 \= 82\$

따라서 최솟값은 \$34\$이다.

```
"NONE"
```

```
{
  "sourceQid": "18",
  "variationType": "NUMERIC",
  "standardCourse": "공통수학1",
  "courseKey": null,
  "curriculum": "2022",
  "standardUnitKey": null,
  "subUnitKey": null,
  "conceptClusterKey": null,
  "primaryMethod": "켤레복소수 곱으로 부정방정식 $a^2+(b+3)^2=65$를 얻어 자연수 해를 모두 구한 뒤 $(a+2)^2+b^2$의 최솟값을 찾는다.",
  "decisiveStep": "$b+3 \ge 4$ 조건으로 가능한 $(a, b)$ 쌍을 $(1,5), (4,4), (7,1)$ 세 가지로 추리는 단계",
  "rpm": null,
  "ptTplCandidate": null,
  "crossConceptKeys": [],
  "conditionKeys": ["COND_NATURAL_NUMBER"],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "켤레복소수 곱을 제곱합 부정방정식으로 변환하고 자연수 해를 모두 대입해 최솟값을 비교해야 한다.",
  "level": "중",
  "item4slot": {
    "domain": "복소수",
    "concept": "켤레복소수의성질",
    "skill": "제곱합부정방정식최소",
    "context": "자연수성분복소수"
  },
  "hold": "원본 문항에 개별 배점이 미표기되어 총점 100점에 맞추어 배점함. 메타_키선택표_고1.json 부재로 키 선택표 기반 필드를 null로 보류 처리함."
}
```

## Q19

- 형식: 객관식  
- 배점: 4

### 발문

삼차다항식 \$f(x)\$에 대하여 \$f\!\\left(\\dfrac{1}{2}\\right) \= \\dfrac{f(2)}{8}\$, \$f\!\\left(\\dfrac{1}{3}\\right) \= \\dfrac{f(3)}{27}\$이 성립할 때, \$f(x)\$를 \$x \+ 1\$로 나누었을 때의 나머지는?

### 선지

① \$-3\$ ② \$-2\$ ③ \$-1\$ ④ \$0\$ ⑤ \$1\$

### 정답

④

### 해설

\$f(x) \= ax^3 \+ bx^2 \+ cx \+ d\$라 놓으면 주어진 두 조건은 각각 \$\$8f\!\\left(\\frac{1}{2}\\right) \- f(2) \= \-7(a \- d) \- 2(b \- c) \= 0\$\$ \$\$27f\!\\left(\\frac{1}{3}\\right) \- f(3) \= \-26(a \- d) \- 6(b \- c) \= 0\$\$ 두 식을 연립하여 풀면 \$a \- d \= 0\$, \$b \- c \= 0\$, 즉 \$d \= a\$, \$c \= b\$이다. 따라서 \$f(x)\$를 \$x \+ 1\$로 나누었을 때의 나머지는 \$\$f(-1) \= \-a \+ b \- c \+ d \= (-a \+ a) \+ (b \- b) \= 0\$\$

```
"NONE"
```

```
{
  "sourceQid": "19",
  "variationType": "NUMERIC",
  "standardCourse": "공통수학1",
  "courseKey": null,
  "curriculum": "2022",
  "standardUnitKey": null,
  "subUnitKey": null,
  "conceptClusterKey": null,
  "primaryMethod": "삼차다항식 $f(x)=ax^3+bx^2+cx+d$에 두 조건을 대입해 $a=d, b=c$임을 보인 뒤 $f(-1)=0$을 구한다.",
  "decisiveStep": "두 조건식이 $(a-d)$와 $(b-c)$에 대한 연립일차방정식이 되어 $a=d, b=c$를 강제함을 파악하는 단계",
  "rpm": null,
  "ptTplCandidate": null,
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "두 개의 함수값 비례 조건에서 삼차식 계수의 대칭성 $a=d, b=c$를 이끌어내야 하는 추론 문항이다.",
  "level": "중",
  "item4slot": {
    "domain": "항등식과나머지정리",
    "concept": "나머지정리",
    "skill": "계수대칭성유도",
    "context": "역수함숫값관계식"
  },
  "hold": "원본 문항에 개별 배점이 미표기되어 총점 100점에 맞추어 배점함. 메타_키선택표_고1.json 부재로 키 선택표 기반 필드를 null로 보류 처리함."
}
```

## Q20

- 형식: 서답형  
- 배점: 5

### 발문

\$x\$에 대한 이차방정식 \$(k \- 2)x^2 \+ 4x \- 5 \= 0\$이 서로 다른 두 실근을 갖도록 하는 정수 \$k\$의 최솟값을 구하고 그 과정을 서술하시오.

### 선지

없음

### 정답

\$3\$

### 해설

주어진 방정식이 \$x\$에 대한 이차방정식이므로 최고차항의 계수 \$k \- 2 \\neq 0\$, 즉 \$k \\neq 2\$이다. 서로 다른 두 실근을 가지므로 판별식 \$\\frac{D}{4} \> 0\$이어야 한다. \$\$\\frac{D}{4} \= 2^2 \- (k \- 2)(-5) \= 4 \+ 5k \- 10 \= 5k \- 6 \> 0 \\implies k \> \\frac{6}{5}\$\$ 따라서 \$k \> \\frac{6}{5}\$이고 \$k \\neq 2\$인 정수 \$k\$는 \$3, 4, 5, \\dots\$이므로 최솟값은 \$3\$이다.

```
"NONE"
```

```
{
  "sourceQid": "20",
  "variationType": "NUMERIC",
  "standardCourse": "공통수학1",
  "courseKey": null,
  "curriculum": "2022",
  "standardUnitKey": null,
  "subUnitKey": null,
  "conceptClusterKey": null,
  "primaryMethod": "이차방정식 조건 $k-2 \neq 0$과 판별식 $D/4>0$을 함께 적용해 정수 $k$의 최솟값을 구한다.",
  "decisiveStep": "최고차항 계수가 $0$이 아니어야 함($k \neq 2$)을 빠뜨리지 않고 $k=2$를 제외하는 단계",
  "rpm": null,
  "ptTplCandidate": null,
  "crossConceptKeys": [],
  "conditionKeys": ["COND_INTEGER", "COND_NONZERO"],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "판별식 부등식과 최고차항 계수 $0$ 제외 조건을 함께 확인해야 하는 문항이다.",
  "level": "중",
  "item4slot": {
    "domain": "복소수와이차방정식",
    "concept": "이차방정식의판별식",
    "skill": "최고차항비영및판별식",
    "context": "서술형이차방정식조건"
  },
  "hold": "원본 문항에 개별 배점이 미표기되어 총점 100점에 맞추어 배점(5점)을 배정함. 메타_키선택표_고1.json 부재로 키 선택표 기반 필드를 null로 보류 처리함."
}
```

## Q21

- 형식: 서답형  
- 배점: 5

### 발문

이차방정식 \$x^2 \+ ax \+ b \= 0\$의 서로 다른 두 근이 \$\\alpha, \\beta\$이다. \$x^2\$의 계수가 \$2\$인 이차식 \$f(x)\$에 대하여 \$f(\\alpha) \= 3\\alpha\$, \$f(\\beta) \= 3\\beta\$이고 \$f(1) \= 15\$일 때, \$a \+ b\$의 값을 구하고 그 과정을 서술하시오. (단, \$a, b\$는 실수이다.)

### 선지

없음

### 정답

\$5\$

### 해설

\$f(\\alpha) \- 3\\alpha \= 0\$, \$f(\\beta) \- 3\\beta \= 0\$이므로 이차식 \$f(x) \- 3x\$는 서로 다른 두 근 \$\\alpha, \\beta\$를 갖는다. \$f(x)\$의 \$x^2\$의 계수가 \$2\$이고 \$\\alpha, \\beta\$가 \$x^2 \+ ax \+ b \= 0\$의 두 근이므로 \$\$f(x) \- 3x \= 2(x \- \\alpha)(x \- \\beta) \= 2(x^2 \+ ax \+ b)\$\$ 따라서 \$f(x) \= 2(x^2 \+ ax \+ b) \+ 3x\$이다. \$f(1) \= 15\$를 대입하면 \$\$2(1 \+ a \+ b) \+ 3 \= 15 \\implies 2(1 \+ a \+ b) \= 12 \\implies 1 \+ a \+ b \= 6 \\implies a \+ b \= 5\$\$

```
"NONE"
```

```
{
  "sourceQid": "21",
  "variationType": "NUMERIC",
  "standardCourse": "공통수학1",
  "courseKey": null,
  "curriculum": "2022",
  "standardUnitKey": null,
  "subUnitKey": null,
  "conceptClusterKey": null,
  "primaryMethod": "$f(x)-3x$가 두 근 $\alpha, \beta$를 가짐을 이용해 $f(x)=2(x^2+ax+b)+3x$로 식을 세우고 $f(1)=15$를 대입한다.",
  "decisiveStep": "$f(\alpha)=3\alpha, f(\beta)=3\beta$를 $f(x)-3x=2(x^2+ax+b)$로 인수 정리하는 단계",
  "rpm": null,
  "ptTplCandidate": null,
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "함숫값 조건을 $f(x)-3x$의 근 조건으로 변환해 이차식을 작성하고 미정계수 합을 구하는 서술형이다.",
  "level": "중",
  "item4slot": {
    "domain": "복소수와이차방정식",
    "concept": "이차방정식의작성",
    "skill": "차함수인수분해식작성",
    "context": "서술형이차식작성"
  },
  "hold": "메타_키선택표_고1.json 부재로 키 선택표 기반 필드를 null로 보류 처리함."
}
```

## Q22

- 형식: 서답형  
- 배점: 7

### 발문

복소수 \$z \= \\dfrac{-1 \- \\sqrt{3}i}{2}\$에 대하여 등식 \$\$z \+ 2z^2 \+ 3z^3 \+ 4z^4 \+ \\dots \+ 39z^{39} \+ 40z^{40} \= a \+ bi\$\$ 가 성립할 때, \$ab\$의 값을 구하고 그 과정을 서술하시오. (단, \$a, b\$는 실수이고 \$i \= \\sqrt{-1}\$이다.)

### 선지

없음

### 정답

\$\\dfrac{27\\sqrt{3}}{4}\$

### 해설

\$z \= \\frac{-1 \- \\sqrt{3}i}{2}\$에서 \$2z \+ 1 \= \-\\sqrt{3}i\$의 양변을 제곱하면 \$4z^2 \+ 4z \+ 1 \= \-3 \\implies z^2 \+ z \+ 1 \= 0\$이고 \$z^3 \= 1\$이다. \$z^3 \= 1\$이므로 주어진 식 \$S\$를 \$3\$개 항씩 묶으면 \$\$S \= \\sum\_{k=1}^{13}{(3k \- 2)z \+ (3k \- 1)z^2 \+ 3k} \+ 40z^{40}\$\$ 각 묶음은 \$z \+ z^2 \= \-1\$을 이용하면 \$\$(3k \- 2)z \+ (3k \- 1)z^2 \+ 3k \= (3k \- 1)(z \+ z^2) \- z \+ 3k \= \-(3k \- 1\) \- z \+ 3k \= 1 \- z\$\$ 이므로 \$13\$개 묶음의 합은 \$13(1 \- z)\$이고, \$40z^{40} \= 40z\$이다. \$\$S \= 13(1 \- z) \+ 40z \= 13 \+ 27z \= 13 \+ 27 \\cdot \\frac{-1 \- \\sqrt{3}i}{2} \= \-\\frac{1}{2} \- \\frac{27\\sqrt{3}}{2}i\$\$ 따라서 \$a \= \-\\frac{1}{2}\$, \$b \= \-\\frac{27\\sqrt{3}}{2}\$이므로 \$\$ab \= \\left(-\\frac{1}{2}\\right)\\left(-\\frac{27\\sqrt{3}}{2}\\right) \= \\frac{27\\sqrt{3}}{4}\$\$

```
"NONE"
```

```
{
  "sourceQid": "22",
  "variationType": "NUMERIC",
  "standardCourse": "공통수학1",
  "courseKey": null,
  "curriculum": "2022",
  "standardUnitKey": null,
  "subUnitKey": null,
  "conceptClusterKey": null,
  "primaryMethod": "$z^2+z+1=0, z^3=1$을 이용해 $40$개 항을 $3$개씩 $13$묶음으로 묶어 각 묶음이 $1-z$로 일정함을 보인 뒤 계산한다.",
  "decisiveStep": "$(3k-2)z+(3k-1)z^2+3k$가 $k$에 무관하게 $1-z$로 간단해짐을 유도하는 단계",
  "rpm": null,
  "ptTplCandidate": null,
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "오메가의 $3$주기성과 계수가 등차수열인 유한합의 규칙적 묶음을 스스로 발견해 계산해야 하는 서술형이다.",
  "level": "중",
  "item4slot": {
    "domain": "복소수",
    "concept": "허수단위와오메가거듭제곱",
    "skill": "주기묶음합계산",
    "context": "서술형계수증가거듭제곱합"
  },
  "hold": "원본 문항에 개별 배점이 미표기되어 총점 100점에 맞추어 배점(7점)을 배정함. 메타_키선택표_고1.json 부재로 키 선택표 기반 필드를 null로 보류 처리함."
}
```

## Q23

- 형식: 서답형  
- 배점: 7

### 발문

자연수 \$n\$에 대하여 \$n^4 \+ 8n^3 \+ 14n^2 \- 8n \- 8\$이 소수일 때, 다항식 \$f(x) \= x^2 \- 6x \+ 11\$을 \$x \- n\$으로 나누었을 때의 나머지를 구하고 그 과정을 서술하시오.

### 선지

없음

### 정답

\$6\$

### 해설

주어진 식을 \$n^2 \+ 4n \= t\$로 치환할 수 있도록 변형하면 \$\$n^4 \+ 8n^3 \+ 14n^2 \- 8n \- 8 \= (n^2 \+ 4n)^2 \- 2(n^2 \+ 4n) \- 8 \= (t \- 4)(t \+ 2)\$\$ 즉, \$(n^2 \+ 4n \- 4)(n^2 \+ 4n \+ 2)\$로 인수분해된다. \$n\$은 자연수이므로 \$n^2 \+ 4n \- 4 \< n^2 \+ 4n \+ 2\$이고 \$n^2 \+ 4n \+ 2 \\ge 7\$이다. 두 정수의 곱이 소수가 되려면 작은 쪽 인수가 \$1\$이어야 하므로 \$\$n^2 \+ 4n \- 4 \= 1 \\implies n^2 \+ 4n \- 5 \= 0 \\implies (n \+ 5)(n \- 1\) \= 0\$\$ \$n\$은 자연수이므로 \$n \= 1\$이다. (이때 주어진 식의 값은 \$1 \\times 7 \= 7\$로 소수이다.) 따라서 \$f(x) \= x^2 \- 6x \+ 11\$을 \$x \- 1\$로 나누었을 때의 나머지는 \$\$f(1) \= 1 \- 6 \+ 11 \= 6\$\$

```
"NONE"
```

```
{
  "sourceQid": "23",
  "variationType": "NUMERIC",
  "standardCourse": "공통수학1",
  "courseKey": null,
  "curriculum": "2022",
  "standardUnitKey": null,
  "subUnitKey": null,
  "conceptClusterKey": null,
  "primaryMethod": "사차식을 $n^2+4n$ 치환으로 $(n^2+4n-4)(n^2+4n+2)$로 인수분해한 뒤 소수 조건으로 작은 인수를 $1$로 두어 $n=1$을 구한다.",
  "decisiveStep": "두 인수의 대소 관계에서 $n^2+4n-4=1$을 도출해 $n=1$을 확정하는 단계",
  "rpm": null,
  "ptTplCandidate": null,
  "crossConceptKeys": [],
  "conditionKeys": ["COND_NATURAL_NUMBER"],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "사차식을 공통부분 치환으로 인수분해하고 소수의 약수 성질을 결합해 자연수 $n$을 구하는 서술형이다.",
  "level": "중",
  "item4slot": {
    "domain": "인수분해",
    "concept": "인수분해의활용",
    "skill": "소수조건자연수결정",
    "context": "서술형사차식소수판별"
  },
  "hold": "원본 문항에 개별 배점이 미표기되어 총점 100점에 맞추어 배점(7점)을 배정함. 메타_키선택표_고1.json 부재로 키 선택표 기반 필드를 null로 보류 처리함."
}
```

---

```
{
  "examId": "25_효천고_1학기_중간_고1_유사",
  "sourceExamId": "25_효천고_1학기_중간_고1_기출",
  "totalQuestions": 23,
  "mcqCount": 19,
  "essayCount": 4,
  "answerDistribution": {
    "1": 4,
    "2": 4,
    "3": 3,
    "4": 4,
    "5": 4
  },
  "maxConsecutiveSameChoice": 1,
  "scoreCheck": {
    "mcqScoreSum": 76.0,
    "essayScoreSum": 24.0,
    "totalScore": 100.0
  },
  "textExplicitImageReplacements": []
}
```

