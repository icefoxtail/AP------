# APPROVED\_20261031\_1325\_BATCH20\_HA\_part2\_유형풀

```
{
  "sourceBatchId": "APPROVED_20261031_1325_BATCH20_HA_50ITEMS",
  "sourceFile": "06_APPROVED_BANK_20261031_1325.json",
  "sourceTitle": "백발백중_공통수학2(하) (2022개정).pdf",
  "section": "Ⅲ. 함수와 그래프 2. 유리함수 서술형 What & How 유형 02~04(완결) & 실전 문제 1회 01~06 (93~96쪽 4페이지 전수 - 공통수학2(하))",
  "part": "part2",
  "itemRange": "26-50",
  "itemCount": 25,
  "answerPoolOffsetStart": 375,
  "answerPoolOffsetEnd": 400,
  "curriculum": "2022",
  "standardCourse": "공통수학2"
}
```

## 문항 26 (P95-Q08-S3)

### 발문

\$x \> 1\$에서 정의된 함수 \$y \= \\frac{x+8}{x-1}\$의 그래프 위의 한 점 \$P\$에서 \$x\$축, \$y\$축에 내린 수선의 발을 각각 \$Q, R\$라 할 때, 직사각형 \$OQPR\$의 넓이의 최솟값은? (단, \$O\$는 원점이다.)

### 선지

① \$14\$ ② \$15\$ ③ \$16\$ ④ \$17\$ ⑤ \$18\$

### 정답

③

### 해설

점 \$P\$의 좌표를 \$\\left(t, \\dfrac{t+8}{t-1}\\right)\$ (\$t \> 1\$)이라 하면 직사각형 \$OQPR\$의 넓이는 \$S=t \\cdot \\dfrac{t+8}{t-1}=t\\left(1+\\dfrac{9}{t-1}\\right)=t+\\dfrac{9t}{t-1}=(t-1)+\\dfrac{9}{t-1}+10\$이다. \$t-1 \> 0\$이므로 산술평균과 기하평균의 관계에 의하여 \$S \\ge 2\\sqrt{(t-1) \\cdot \\dfrac{9}{t-1}}+10=2 \\times 3+10=16\$이다. (등호는 \$t-1=\\dfrac{9}{t-1}\$, 즉 \$t=4\$일 때 성립) 따라서 직사각형 \$OQPR\$의 넓이의 최솟값은 \$16\$이다.

```
{
  "questionPlan": {
    "status": "UNSUPPORTED",
    "reason": "유리함수의 점근선과 수선의 발이 이루는 직사각형의 도형 작도가 필요하다.",
    "spec": "좌표평면 제1사분면에 점근선 $x=1$, $y=1$(점선)과 유리함수 $y=\\dfrac{9}{x-1}+1$ ($x>1$)의 그래프를 그린다. 곡선 위의 한 점 $P$에서 $x$축, $y$축에 내린 수선의 발 $Q, R$ 및 직사각형 $OQPR$를 작도한다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "점의 좌표를 설정하고 산술평균과 기하평균의 관계를 대수적으로 전개하는 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-08",
  "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
  "rpm": "H1-RPM-264",
  "difficultyBucket": 3,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "유리함수",
      "직사각형"
    ],
    "goal": [
      "넓이",
      "최솟값"
    ],
    "method": [
      "산술기하평균",
      "표준형"
    ],
    "condition": [
      "양수"
    ]
  }
}
```

## 문항 27 (P96-Q01-T1)

### 발문

식 \$\\frac{1}{x(x+1)} \+ \\frac{1}{(x+1)(x+2)} \+ \\frac{1}{(x+2)(x+3)} \+ \\frac{1}{(x+3)(x+4)}\$를 간단히 한 것은?

### 선지

① \$\\dfrac{1}{x(x+4)}\$ ② \$\\dfrac{2}{x(x+4)}\$ ③ \$\\dfrac{3}{x(x+4)}\$ ④ \$\\dfrac{4}{(x+1)(x+4)}\$ ⑤ \$\\dfrac{4}{x(x+4)}\$

### 정답

⑤

### 해설

부분분수로 변형하면 \$\\dfrac{1}{AB}=\\dfrac{1}{B-A}\\left(\\dfrac{1}{A}-\\dfrac{1}{B}\\right)\$이므로 \$\\left(\\dfrac{1}{x}-\\dfrac{1}{x+1}\\right)+\\left(\\dfrac{1}{x+1}-\\dfrac{1}{x+2}\\right)+\\left(\\dfrac{1}{x+2}-\\dfrac{1}{x+3}\\right)+\\left(\\dfrac{1}{x+3}-\\dfrac{1}{x+4}\\right)\$ \$=\\dfrac{1}{x}-\\dfrac{1}{x+4}=\\dfrac{4}{x(x+4)}\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "유리식의 계산, 항등식, 유리함수의 정의역·치역·점근선을 대수적으로 구하는 문항으로 별도 도형 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "부분분수 변형, 항등식, 표준형 변형 및 부등식을 단계별로 전개하는 대수적 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-08",
  "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
  "rpm": "H1-RPM-259",
  "difficultyBucket": 1,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "유리식"
    ],
    "goal": [
      "값"
    ],
    "method": [
      "부분분수"
    ],
    "condition": [
      "실수"
    ]
  }
}
```

## 문항 28 (P96-Q01-S1)

### 발문

식 \$\\frac{1}{x^2+x} \+ \\frac{1}{x^2+3x+2} \+ \\frac{1}{x^2+5x+6}\$을 간단히 한 것은?

### 선지

① \$\\dfrac{1}{x(x+3)}\$ ② \$\\dfrac{2}{x(x+3)}\$ ③ \$\\dfrac{3}{(x+1)(x+3)}\$ ④ \$\\dfrac{3}{x(x+3)}\$ ⑤ \$\\dfrac{4}{x(x+3)}\$

### 정답

④

### 해설

각 항의 분모를 인수분해하면 \$\\dfrac{1}{x(x+1)}+\\dfrac{1}{(x+1)(x+2)}+\\dfrac{1}{(x+2)(x+3)}\$이다. 부분분수로 변형하면 \$\\left(\\dfrac{1}{x}-\\dfrac{1}{x+1}\\right)+\\left(\\dfrac{1}{x+1}-\\dfrac{1}{x+2}\\right)+\\left(\\dfrac{1}{x+2}-\\dfrac{1}{x+3}\\right)=\\dfrac{1}{x}-\\dfrac{1}{x+3}=\\dfrac{3}{x(x+3)}\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "유리식의 계산, 항등식, 유리함수의 정의역·치역·점근선을 대수적으로 구하는 문항으로 별도 도형 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "부분분수 변형, 항등식, 표준형 변형 및 부등식을 단계별로 전개하는 대수적 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-08",
  "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
  "rpm": "H1-RPM-259",
  "difficultyBucket": 1,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "유리식"
    ],
    "goal": [
      "값"
    ],
    "method": [
      "부분분수",
      "인수분해"
    ],
    "condition": [
      "실수"
    ]
  }
}
```

## 문항 29 (P96-Q01-S2)

### 발문

식 \$\\frac{1}{x(x+2)} \+ \\frac{1}{(x+2)(x+4)} \+ \\frac{1}{(x+4)(x+6)}\$을 간단히 한 것은?

### 선지

① \$\\dfrac{2}{x(x+6)}\$ ② \$\\dfrac{3}{x(x+6)}\$ ③ \$\\dfrac{4}{x(x+6)}\$ ④ \$\\dfrac{5}{x(x+6)}\$ ⑤ \$\\dfrac{6}{x(x+6)}\$

### 정답

②

### 해설

부분분수로 변형하면 각 항의 두 인수의 차가 \$2\$이므로 \$\\dfrac{1}{2}\\left(\\dfrac{1}{x}-\\dfrac{1}{x+2}\\right)+\\dfrac{1}{2}\\left(\\dfrac{1}{x+2}-\\dfrac{1}{x+4}\\right)+\\dfrac{1}{2}\\left(\\dfrac{1}{x+4}-\\dfrac{1}{x+6}\\right)\$ \$=\\dfrac{1}{2}\\left(\\dfrac{1}{x}-\\dfrac{1}{x+6}\\right)=\\dfrac{1}{2}\\cdot\\dfrac{6}{x(x+6)}=\\dfrac{3}{x(x+6)}\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "유리식의 계산, 항등식, 유리함수의 정의역·치역·점근선을 대수적으로 구하는 문항으로 별도 도형 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "부분분수 변형, 항등식, 표준형 변형 및 부등식을 단계별로 전개하는 대수적 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-08",
  "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
  "rpm": "H1-RPM-259",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "유리식"
    ],
    "goal": [
      "값"
    ],
    "method": [
      "부분분수"
    ],
    "condition": [
      "실수"
    ]
  }
}
```

## 문항 30 (P96-Q01-S3)

### 발문

식 \$\\frac{2}{x^2+2x} \+ \\frac{2}{x^2+6x+8} \+ \\frac{2}{x^2+10x+24}\$를 간단히 한 것은?

### 선지

① \$\\dfrac{6}{x(x+6)}\$ ② \$\\dfrac{8}{x(x+6)}\$ ③ \$\\dfrac{10}{x(x+6)}\$ ④ \$\\dfrac{12}{x(x+6)}\$ ⑤ \$\\dfrac{6}{(x+2)(x+6)}\$

### 정답

①

### 해설

각 항의 분모를 인수분해하면 \$\\dfrac{2}{x(x+2)}+\\dfrac{2}{(x+2)(x+4)}+\\dfrac{2}{(x+4)(x+6)}\$이다. 부분분수로 변형하면 \$\\left(\\dfrac{1}{x}-\\dfrac{1}{x+2}\\right)+\\left(\\dfrac{1}{x+2}-\\dfrac{1}{x+4}\\right)+\\left(\\dfrac{1}{x+4}-\\dfrac{1}{x+6}\\right)=\\dfrac{1}{x}-\\dfrac{1}{x+6}=\\dfrac{6}{x(x+6)}\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "유리식의 계산, 항등식, 유리함수의 정의역·치역·점근선을 대수적으로 구하는 문항으로 별도 도형 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "부분분수 변형, 항등식, 표준형 변형 및 부등식을 단계별로 전개하는 대수적 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-08",
  "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
  "rpm": "H1-RPM-259",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "유리식"
    ],
    "goal": [
      "값"
    ],
    "method": [
      "부분분수",
      "인수분해"
    ],
    "condition": [
      "실수"
    ]
  }
}
```

## 문항 31 (P96-Q02-T1)

### 발문

모든 실수 \$x\$ (\$x \\neq 1\$)에 대하여 등식 \$\\frac{a}{x-1} \+ \\frac{bx+c}{x^2+x+1} \= \\frac{3x+3}{x^3-1}\$이 항상 성립할 때, 상수 \$a, b, c\$에 대하여 \$a+b+c\$의 값은?

### 선지

① \$-2\$ ② \$-1\$ ③ \$0\$ ④ \$1\$ ⑤ \$2\$

### 정답

②

### 해설

양변에 \$x^3-1=(x-1)(x^2+x+1)\$을 곱하면 \$a(x^2+x+1)+(bx+c)(x-1)=3x+3\$이다. \$(a+b)x^2+(a-b+c)x+(a-c)=3x+3\$이 \$x\$에 대한 항등식이므로 \$a+b=0\$, \$a-b+c=3\$, \$a-c=3\$이다. \$a+b=0\$에서 \$b=-a\$를 대입하면 \$2a+c=3\$이고, \$a-c=3\$과 연립하면 \$3a=6 \\implies a=2\$이다. 따라서 \$b=-2\$, \$c=-1\$이므로 \$a+b+c=2+(-2)+(-1)=-1\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "유리식의 계산, 항등식, 유리함수의 정의역·치역·점근선을 대수적으로 구하는 문항으로 별도 도형 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "부분분수 변형, 항등식, 표준형 변형 및 부등식을 단계별로 전개하는 대수적 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-08",
  "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
  "rpm": "H1-RPM-260",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "유리식",
      "등식"
    ],
    "goal": [
      "합"
    ],
    "method": [
      "통분",
      "항등식"
    ],
    "condition": [
      "상수"
    ]
  }
}
```

## 문항 32 (P96-Q02-S1)

### 발문

모든 실수 \$x\$ (\$x \\neq 1\$)에 대하여 등식 \$\\frac{a}{x-1} \+ \\frac{bx+c}{x^2+x+1} \= \\frac{6x}{x^3-1}\$이 항상 성립할 때, 상수 \$a, b, c\$에 대하여 \$a+b+c\$의 값은?

### 선지

① \$2\$ ② \$3\$ ③ \$4\$ ④ \$5\$ ⑤ \$6\$

### 정답

①

### 해설

양변에 \$x^3-1=(x-1)(x^2+x+1)\$을 곱하면 \$a(x^2+x+1)+(bx+c)(x-1)=6x\$이다. \$(a+b)x^2+(a-b+c)x+(a-c)=6x\$가 \$x\$에 대한 항등식이므로 \$a+b=0\$, \$a-b+c=6\$, \$a-c=0\$이다. \$b=-a\$, \$c=a\$를 대입하면 \$3a=6 \\implies a=2\$이다. 따라서 \$b=-2\$, \$c=2\$이므로 \$a+b+c=2+(-2)+2=2\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "유리식의 계산, 항등식, 유리함수의 정의역·치역·점근선을 대수적으로 구하는 문항으로 별도 도형 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "부분분수 변형, 항등식, 표준형 변형 및 부등식을 단계별로 전개하는 대수적 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-08",
  "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
  "rpm": "H1-RPM-260",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "유리식",
      "등식"
    ],
    "goal": [
      "합"
    ],
    "method": [
      "통분",
      "항등식"
    ],
    "condition": [
      "상수"
    ]
  }
}
```

## 문항 33 (P96-Q02-S2)

### 발문

모든 실수 \$x\$ (\$x \\neq 1\$)에 대하여 등식 \$\\frac{a}{x-1} \+ \\frac{bx+c}{x^2+x+1} \= \\frac{x^2+5x-3}{x^3-1}\$이 항상 성립할 때, 상수 \$a, b, c\$에 대하여 \$a+b+c\$의 값은?

### 선지

① \$3\$ ② \$4\$ ③ \$5\$ ④ \$6\$ ⑤ \$7\$

### 정답

③

### 해설

양변에 \$x^3-1=(x-1)(x^2+x+1)\$을 곱하면 \$a(x^2+x+1)+(bx+c)(x-1)=x^2+5x-3\$이다. \$(a+b)x^2+(a-b+c)x+(a-c)=x^2+5x-3\$이 항등식이므로 \$a+b=1\$, \$a-b+c=5\$, \$a-c=-3\$이다. \$b=1-a\$, \$c=a+3\$을 대입하면 \$a-(1-a)+(a+3)=5 \\implies 3a+2=5 \\implies a=1\$이다. 따라서 \$b=0\$, \$c=4\$이므로 \$a+b+c=1+0+4=5\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "유리식의 계산, 항등식, 유리함수의 정의역·치역·점근선을 대수적으로 구하는 문항으로 별도 도형 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "부분분수 변형, 항등식, 표준형 변형 및 부등식을 단계별로 전개하는 대수적 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-08",
  "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
  "rpm": "H1-RPM-260",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "유리식",
      "등식"
    ],
    "goal": [
      "합"
    ],
    "method": [
      "통분",
      "항등식"
    ],
    "condition": [
      "상수"
    ]
  }
}
```

## 문항 34 (P96-Q02-S3)

### 발문

모든 실수 \$x\$ (\$x \\neq 1\$)에 대하여 등식 \$\\frac{a}{x-1} \+ \\frac{bx+c}{x^2+x+1} \= \\frac{3}{x^3-1}\$이 항상 성립할 때, 상수 \$a, b, c\$에 대하여 \$a+b+c\$의 값은?

### 선지

① \$-6\$ ② \$-5\$ ③ \$-4\$ ④ \$-3\$ ⑤ \$-2\$

### 정답

⑤

### 해설

양변에 \$x^3-1=(x-1)(x^2+x+1)\$을 곱하면 \$a(x^2+x+1)+(bx+c)(x-1)=3\$이다. \$(a+b)x^2+(a-b+c)x+(a-c)=3\$이 항등식이므로 \$a+b=0\$, \$a-b+c=0\$, \$a-c=3\$이다. \$b=-a\$, \$c=a-3\$을 대입하면 \$3a-3=0 \\implies a=1\$이다. 따라서 \$b=-1\$, \$c=-2\$이므로 \$a+b+c=1+(-1)+(-2)=-2\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "유리식의 계산, 항등식, 유리함수의 정의역·치역·점근선을 대수적으로 구하는 문항으로 별도 도형 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "부분분수 변형, 항등식, 표준형 변형 및 부등식을 단계별로 전개하는 대수적 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-08",
  "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
  "rpm": "H1-RPM-260",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "유리식",
      "등식"
    ],
    "goal": [
      "합"
    ],
    "method": [
      "통분",
      "항등식"
    ],
    "condition": [
      "상수"
    ]
  }
}
```

## 문항 35 (P96-Q03-T1)

### 발문

함수 \$y \= \\frac{2x+8}{x-1}\$의 그래프 위의 점 중 \$x\$좌표와 \$y\$좌표가 모두 자연수인 점의 개수는?

### 선지

① \$1\$ ② \$2\$ ③ \$3\$ ④ \$4\$ ⑤ \$5\$

### 정답

④

### 해설

\$y=\\dfrac{2x+8}{x-1}=\\dfrac{10}{x-1}+2\$이다. \$x\$와 \$y\$가 모두 자연수이려면 \$x-1\$은 \$10\$의 약수이어야 한다. 가능한 \$x-1\$의 값은 \$-10, \-5, \-2, \-1, 1, 2, 5, 10\$이다. \$x \\ge 1\$이므로 \$x-1 \\ge 0\$이고, \$x-1\$은 \$1, 2, 5, 10\$만 가능하다. 각각에 대하여 \$(x, y)\$는 \$(2, 12), (3, 7), (6, 4), (11, 3)\$으로 모두 자연수이다. 따라서 구하는 점의 개수는 \$4\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "유리식의 계산, 항등식, 유리함수의 정의역·치역·점근선을 대수적으로 구하는 문항으로 별도 도형 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "부분분수 변형, 항등식, 표준형 변형 및 부등식을 단계별로 전개하는 대수적 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-08",
  "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
  "rpm": "H1-RPM-261",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "유리함수"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "표준형"
    ],
    "condition": [
      "자연수"
    ]
  }
}
```

## 문항 36 (P96-Q03-S1)

### 발문

함수 \$y \= \\frac{x+8}{x-1}\$의 그래프 위의 점 중 \$x\$좌표와 \$y\$좌표가 모두 자연수인 점의 개수는?

### 선지

① \$0\$ ② \$1\$ ③ \$2\$ ④ \$3\$ ⑤ \$4\$

### 정답

④

### 해설

\$y=\\dfrac{x+8}{x-1}=\\dfrac{9}{x-1}+1\$이다. \$x\$와 \$y\$가 모두 자연수이려면 \$x \\ge 1\$에서 \$x-1\$은 \$9\$의 양의 약수이어야 한다. \$x-1 \\in {1, 3, 9}\$이므로 \$(x, y)\$는 \$(2, 10), (4, 4), (10, 2)\$이다. 따라서 구하는 점의 개수는 \$3\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "유리식의 계산, 항등식, 유리함수의 정의역·치역·점근선을 대수적으로 구하는 문항으로 별도 도형 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "부분분수 변형, 항등식, 표준형 변형 및 부등식을 단계별로 전개하는 대수적 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-08",
  "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
  "rpm": "H1-RPM-261",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "유리함수"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "표준형"
    ],
    "condition": [
      "자연수"
    ]
  }
}
```

## 문항 37 (P96-Q03-S2)

### 발문

함수 \$y \= \\frac{2x+1}{x-2}\$의 그래프 위의 점 중 \$x\$좌표와 \$y\$좌표가 모두 자연수인 점의 개수는?

### 선지

① \$2\$ ② \$3\$ ③ \$4\$ ④ \$5\$ ⑤ \$6\$

### 정답

①

### 해설

\$y=\\dfrac{2x+1}{x-2}=\\dfrac{5}{x-2}+2\$이다. \$x\$와 \$y\$가 모두 자연수이려면 \$x-2\$는 \$5\$의 약수(\$\\pm 1, \\pm 5\$)이어야 한다. \$x-2=-5\$이면 \$x=-3\$ (불가능), \$x-2=-1\$이면 \$x=1, y=-3\$ (불가능)이다. \$x-2=1\$이면 \$(3, 7)\$, \$x-2=5\$이면 \$(7, 3)\$으로 모두 자연수이다. 따라서 구하는 점의 개수는 \$2\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "유리식의 계산, 항등식, 유리함수의 정의역·치역·점근선을 대수적으로 구하는 문항으로 별도 도형 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "부분분수 변형, 항등식, 표준형 변형 및 부등식을 단계별로 전개하는 대수적 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-08",
  "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
  "rpm": "H1-RPM-261",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "유리함수"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "표준형"
    ],
    "condition": [
      "자연수"
    ]
  }
}
```

## 문항 38 (P96-Q03-S3)

### 발문

함수 \$y \= \\frac{3x+5}{x-1}\$의 그래프 위의 점 중 \$x\$좌표와 \$y\$좌표가 모두 자연수인 점의 개수는?

### 선지

① \$2\$ ② \$3\$ ③ \$4\$ ④ \$5\$ ⑤ \$6\$

### 정답

③

### 해설

\$y=\\dfrac{3x+5}{x-1}=\\dfrac{8}{x-1}+3\$이다. \$x\$와 \$y\$가 모두 자연수이려면 \$x \\ge 1\$에서 \$x-1\$은 \$8\$의 양의 약수이어야 한다. \$x-1 \\in {1, 2, 4, 8}\$이므로 \$(x, y)\$는 \$(2, 11), (3, 7), (5, 5), (9, 4)\$이다. 따라서 구하는 점의 개수는 \$4\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "유리식의 계산, 항등식, 유리함수의 정의역·치역·점근선을 대수적으로 구하는 문항으로 별도 도형 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "부분분수 변형, 항등식, 표준형 변형 및 부등식을 단계별로 전개하는 대수적 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-08",
  "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
  "rpm": "H1-RPM-261",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "유리함수"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "표준형"
    ],
    "condition": [
      "자연수"
    ]
  }
}
```

## 문항 39 (P96-Q04-T1)

### 발문

함수 \$y \= \\frac{1}{x-1} \+ 3\$의 치역이 \$\\left{y ;\\middle\|; \\frac{10}{3} \\le y \\le 5\\right}\$일 때, 정의역에 속하는 모든 정수 \$x\$의 값의 합은?

### 선지

① \$8\$ ② \$9\$ ③ \$10\$ ④ \$11\$ ⑤ \$12\$

### 정답

②

### 해설

\$y=\\dfrac{1}{x-1}+3\$에서 \$\\dfrac{10}{3} \\le y \\le 5\$이므로 \$\\dfrac{1}{3} \\le \\dfrac{1}{x-1} \\le 2\$이다. 역수를 취하면 \$\\dfrac{1}{2} \\le x-1 \\le 3 \\implies \\dfrac{3}{2} \\le x \\le 4\$이다. 정의역에 속하는 정수 \$x\$는 \$2, 3, 4\$이므로 합은 \$2+3+4=9\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "유리식의 계산, 항등식, 유리함수의 정의역·치역·점근선을 대수적으로 구하는 문항으로 별도 도형 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "부분분수 변형, 항등식, 표준형 변형 및 부등식을 단계별로 전개하는 대수적 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-08",
  "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
  "rpm": "H1-RPM-262",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "유리함수",
      "치역"
    ],
    "goal": [
      "합"
    ],
    "method": [
      "부등식"
    ],
    "condition": [
      "정수"
    ]
  }
}
```

## 문항 40 (P96-Q04-S1)

### 발문

함수 \$y \= \\frac{2}{x-2} \+ 1\$의 치역이 \$\\left{y ;\\middle\|; \\frac{3}{2} \\le y \\le 3\\right}\$일 때, 정의역에 속하는 모든 정수 \$x\$의 값의 합은?

### 선지

① \$10\$ ② \$12\$ ③ \$14\$ ④ \$16\$ ⑤ \$18\$

### 정답

⑤

### 해설

\$y=\\dfrac{2}{x-2}+1\$에서 \$\\dfrac{3}{2} \\le y \\le 3\$이므로 \$\\dfrac{1}{2} \\le \\dfrac{2}{x-2} \\le 2 \\implies \\dfrac{1}{4} \\le \\dfrac{1}{x-2} \\le 1\$이다. 역수를 취하면 \$1 \\le x-2 \\le 4 \\implies 3 \\le x \\le 6\$이다. 정의역에 속하는 정수 \$x\$는 \$3, 4, 5, 6\$이므로 합은 \$3+4+5+6=18\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "유리식의 계산, 항등식, 유리함수의 정의역·치역·점근선을 대수적으로 구하는 문항으로 별도 도형 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "부분분수 변형, 항등식, 표준형 변형 및 부등식을 단계별로 전개하는 대수적 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-08",
  "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
  "rpm": "H1-RPM-262",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "유리함수",
      "치역"
    ],
    "goal": [
      "합"
    ],
    "method": [
      "부등식"
    ],
    "condition": [
      "정수"
    ]
  }
}
```

## 문항 41 (P96-Q04-S2)

### 발문

함수 \$y \= \\frac{3}{x+1} \+ 2\$의 치역이 \$\\left{y ;\\middle\|; \\frac{5}{2} \\le y \\le 5\\right}\$일 때, 정의역에 속하는 모든 정수 \$x\$의 값의 합은?

### 선지

① \$12\$ ② \$13\$ ③ \$14\$ ④ \$15\$ ⑤ \$16\$

### 정답

④

### 해설

\$y=\\dfrac{3}{x+1}+2\$에서 \$\\dfrac{5}{2} \\le y \\le 5\$이므로 \$\\dfrac{1}{2} \\le \\dfrac{3}{x+1} \\le 3 \\implies \\dfrac{1}{6} \\le \\dfrac{1}{x+1} \\le 1\$이다. 역수를 취하면 \$1 \\le x+1 \\le 6 \\implies 0 \\le x \\le 5\$이다. 정의역에 속하는 정수 \$x\$는 \$0, 1, 2, 3, 4, 5\$이므로 합은 \$0+1+2+3+4+5=15\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "유리식의 계산, 항등식, 유리함수의 정의역·치역·점근선을 대수적으로 구하는 문항으로 별도 도형 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "부분분수 변형, 항등식, 표준형 변형 및 부등식을 단계별로 전개하는 대수적 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-08",
  "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
  "rpm": "H1-RPM-262",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "유리함수",
      "치역"
    ],
    "goal": [
      "합"
    ],
    "method": [
      "부등식"
    ],
    "condition": [
      "정수"
    ]
  }
}
```

## 문항 42 (P96-Q04-S3)

### 발문

함수 \$y \= \\frac{4}{x-3} \+ 1\$의 치역이 \${y \\mid 2 \\le y \\le 5}\$일 때, 정의역에 속하는 모든 정수 \$x\$의 값의 합은?

### 선지

① \$22\$ ② \$24\$ ③ \$26\$ ④ \$28\$ ⑤ \$30\$

### 정답

①

### 해설

\$y=\\dfrac{4}{x-3}+1\$에서 \$2 \\le y \\le 5\$이므로 \$1 \\le \\dfrac{4}{x-3} \\le 4 \\implies \\dfrac{1}{4} \\le \\dfrac{1}{x-3} \\le 1\$이다. 역수를 취하면 \$1 \\le x-3 \\le 4 \\implies 4 \\le x \\le 7\$이다. 정의역에 속하는 정수 \$x\$는 \$4, 5, 6, 7\$이므로 합은 \$4+5+6+7=22\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "유리식의 계산, 항등식, 유리함수의 정의역·치역·점근선을 대수적으로 구하는 문항으로 별도 도형 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "부분분수 변형, 항등식, 표준형 변형 및 부등식을 단계별로 전개하는 대수적 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-08",
  "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
  "rpm": "H1-RPM-262",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "유리함수",
      "치역"
    ],
    "goal": [
      "합"
    ],
    "method": [
      "부등식"
    ],
    "condition": [
      "정수"
    ]
  }
}
```

## 문항 43 (P96-Q05-T1)

### 발문

함수 \$y \= \\frac{7x+1}{x+1}\$의 그래프를 \$x\$축의 방향으로 \$m\$만큼, \$y\$축의 방향으로 \$n\$만큼 평행이동한 후 직선 \$y \= x\$에 대하여 대칭이동하였더니 점근선의 교점이 \$(2, 3)\$인 유리함수의 그래프와 일치하였다. 이때 \$m+n\$의 값은? (단, \$m, n\$은 상수이다.)

### 선지

① \$-3\$ ② \$-2\$ ③ \$-1\$ ④ \$0\$ ⑤ \$1\$

### 정답

③

### 해설

\$y=\\dfrac{7x+1}{x+1}=\\dfrac{-6}{x+1}+7\$의 점근선의 교점은 \$(-1, 7)\$이다. \$x\$축의 방향으로 \$m\$만큼, \$y\$축의 방향으로 \$n\$만큼 평행이동하면 교점은 \$(-1+m, 7+n)\$이고, 직선 \$y=x\$에 대하여 대칭이동하면 교점은 \$(7+n, \-1+m)\$이다. 이 점이 \$(2, 3)\$이므로 \$7+n=2 \\implies n=-5\$, \$-1+m=3 \\implies m=4\$이다. 따라서 \$m+n=4+(-5)=-1\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "유리식의 계산, 항등식, 유리함수의 정의역·치역·점근선을 대수적으로 구하는 문항으로 별도 도형 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "부분분수 변형, 항등식, 표준형 변형 및 부등식을 단계별로 전개하는 대수적 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-08",
  "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
  "rpm": "H1-RPM-263",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "유리함수",
      "점근선"
    ],
    "goal": [
      "합"
    ],
    "method": [
      "표준형",
      "평행이동",
      "대칭이동"
    ],
    "condition": [
      "상수"
    ]
  }
}
```

## 문항 44 (P96-Q05-S1)

### 발문

함수 \$y \= \\frac{4x+5}{x-2}\$의 그래프를 \$x\$축의 방향으로 \$m\$만큼, \$y\$축의 방향으로 \$n\$만큼 평행이동한 후 직선 \$y \= x\$에 대하여 대칭이동하였더니 점근선의 교점이 \$(1, 5)\$인 유리함수의 그래프와 일치하였다. 이때 \$m-n\$의 값은? (단, \$m, n\$은 상수이다.)

### 선지

① \$2\$ ② \$3\$ ③ \$4\$ ④ \$5\$ ⑤ \$6\$

### 정답

⑤

### 해설

\$y=\\dfrac{4x+5}{x-2}=\\dfrac{13}{x-2}+4\$의 점근선의 교점은 \$(2, 4)\$이다. 평행이동 후 직선 \$y=x\$에 대하여 대칭이동한 점근선의 교점은 \$(4+n, 2+m)\$이다. 이 점이 \$(1, 5)\$이므로 \$4+n=1 \\implies n=-3\$, \$2+m=5 \\implies m=3\$이다. 따라서 \$m-n=3-(-3)=6\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "유리식의 계산, 항등식, 유리함수의 정의역·치역·점근선을 대수적으로 구하는 문항으로 별도 도형 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "부분분수 변형, 항등식, 표준형 변형 및 부등식을 단계별로 전개하는 대수적 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-08",
  "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
  "rpm": "H1-RPM-263",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "유리함수",
      "점근선"
    ],
    "goal": [
      "차"
    ],
    "method": [
      "표준형",
      "평행이동",
      "대칭이동"
    ],
    "condition": [
      "상수"
    ]
  }
}
```

## 문항 45 (P96-Q05-S2)

### 발문

함수 \$y \= \\frac{3x-2}{x+3}\$의 그래프를 \$x\$축의 방향으로 \$m\$만큼, \$y\$축의 방향으로 \$n\$만큼 평행이동한 후 직선 \$y \= x\$에 대하여 대칭이동하였더니 점근선의 교점이 \$(4, 1)\$인 유리함수의 그래프와 일치하였다. 이때 \$m+n\$의 값은? (단, \$m, n\$은 상수이다.)

### 선지

① \$4\$ ② \$5\$ ③ \$6\$ ④ \$7\$ ⑤ \$8\$

### 정답

②

### 해설

\$y=\\dfrac{3x-2}{x+3}=\\dfrac{-11}{x+3}+3\$의 점근선의 교점은 \$(-3, 3)\$이다. 평행이동 후 직선 \$y=x\$에 대하여 대칭이동한 점근선의 교점은 \$(3+n, \-3+m)\$이다. 이 점이 \$(4, 1)\$이므로 \$3+n=4 \\implies n=1\$, \$-3+m=1 \\implies m=4\$이다. 따라서 \$m+n=4+1=5\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "유리식의 계산, 항등식, 유리함수의 정의역·치역·점근선을 대수적으로 구하는 문항으로 별도 도형 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "부분분수 변형, 항등식, 표준형 변형 및 부등식을 단계별로 전개하는 대수적 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-08",
  "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
  "rpm": "H1-RPM-263",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "유리함수",
      "점근선"
    ],
    "goal": [
      "합"
    ],
    "method": [
      "표준형",
      "평행이동",
      "대칭이동"
    ],
    "condition": [
      "상수"
    ]
  }
}
```

## 문항 46 (P96-Q05-S3)

### 발문

함수 \$y \= \\frac{5x+2}{x-1}\$의 그래프를 \$x\$축의 방향으로 \$m\$만큼, \$y\$축의 방향으로 \$n\$만큼 평행이동한 후 직선 \$y \= x\$에 대하여 대칭이동하였더니 점근선의 교점이 \$(3, 4)\$인 유리함수의 그래프와 일치하였다. 이때 \$mn\$의 값은? (단, \$m, n\$은 상수이다.)

### 선지

① \$-9\$ ② \$-8\$ ③ \$-7\$ ④ \$-6\$ ⑤ \$-5\$

### 정답

④

### 해설

\$y=\\dfrac{5x+2}{x-1}=\\dfrac{7}{x-1}+5\$의 점근선의 교점은 \$(1, 5)\$이다. 평행이동 후 직선 \$y=x\$에 대하여 대칭이동한 점근선의 교점은 \$(5+n, 1+m)\$이다. 이 점이 \$(3, 4)\$이므로 \$5+n=3 \\implies n=-2\$, \$1+m=4 \\implies m=3\$이다. 따라서 \$mn=3 \\times (-2)=-6\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "유리식의 계산, 항등식, 유리함수의 정의역·치역·점근선을 대수적으로 구하는 문항으로 별도 도형 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "부분분수 변형, 항등식, 표준형 변형 및 부등식을 단계별로 전개하는 대수적 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-08",
  "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
  "rpm": "H1-RPM-263",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "유리함수",
      "점근선"
    ],
    "goal": [
      "곱"
    ],
    "method": [
      "표준형",
      "평행이동",
      "대칭이동"
    ],
    "condition": [
      "상수"
    ]
  }
}
```

## 문항 47 (P96-Q06-T1)

### 발문

함수 \$y \= \\frac{bx+c}{2x+a}\$의 그래프와 함수 \$y \= \\frac{2x+1}{x-1}\$의 그래프의 점근선의 방정식이 서로 같고, 함수 \$y \= \\frac{bx+c}{2x+a}\$의 그래프가 점 \$(0, 1)\$을 지날 때, 상수 \$a, b, c\$에 대하여 \$a+b+c\$의 값은?

### 선지

① \$-4\$ ② \$-3\$ ③ \$-2\$ ④ \$-1\$ ⑤ \$0\$

### 정답

⑤

### 해설

함수 \$y=\\dfrac{2x+1}{x-1}\$의 점근선의 방정식은 \$x=1\$, \$y=2\$이다. 함수 \$y=\\dfrac{bx+c}{2x+a}\$의 점근선은 \$x=-\\dfrac{a}{2}\$, \$y=\\dfrac{b}{2}\$이므로 \$-\\dfrac{a}{2}=1 \\implies a=-2\$, \$\\dfrac{b}{2}=2 \\implies b=4\$이다. 또한 그래프가 점 \$(0, 1)\$을 지나므로 \$\\dfrac{c}{a}=1 \\implies c=a=-2\$이다. 따라서 \$a+b+c=-2+4+(-2)=0\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "유리식의 계산, 항등식, 유리함수의 정의역·치역·점근선을 대수적으로 구하는 문항으로 별도 도형 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "부분분수 변형, 항등식, 표준형 변형 및 부등식을 단계별로 전개하는 대수적 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-08",
  "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
  "rpm": "H1-RPM-261",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "유리함수",
      "점근선"
    ],
    "goal": [
      "합"
    ],
    "method": [
      "점근선",
      "대입"
    ],
    "condition": [
      "상수"
    ]
  }
}
```

## 문항 48 (P96-Q06-S1)

### 발문

함수 \$y \= \\frac{bx+c}{3x+a}\$의 그래프와 함수 \$y \= \\frac{3x-2}{x-2}\$의 그래프의 점근선의 방정식이 같고, 함수 \$y \= \\frac{bx+c}{3x+a}\$의 그래프가 점 \$(0, 2)\$를 지날 때, 상수 \$a, b, c\$에 대하여 \$a+b+c\$의 값은?

### 선지

① \$-10\$ ② \$-9\$ ③ \$-8\$ ④ \$-7\$ ⑤ \$-6\$

### 정답

②

### 해설

함수 \$y=\\dfrac{3x-2}{x-2}\$의 점근선의 방정식은 \$x=2\$, \$y=3\$이다. 함수 \$y=\\dfrac{bx+c}{3x+a}\$의 점근선은 \$x=-\\dfrac{a}{3}\$, \$y=\\dfrac{b}{3}\$이므로 \$-\\dfrac{a}{3}=2 \\implies a=-6\$, \$\\dfrac{b}{3}=3 \\implies b=9\$이다. 또한 그래프가 점 \$(0, 2)\$를 지나므로 \$\\dfrac{c}{a}=2 \\implies c=2a=-12\$이다. 따라서 \$a+b+c=-6+9+(-12)=-9\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "유리식의 계산, 항등식, 유리함수의 정의역·치역·점근선을 대수적으로 구하는 문항으로 별도 도형 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "부분분수 변형, 항등식, 표준형 변형 및 부등식을 단계별로 전개하는 대수적 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-08",
  "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
  "rpm": "H1-RPM-261",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "유리함수",
      "점근선"
    ],
    "goal": [
      "합"
    ],
    "method": [
      "점근선",
      "대입"
    ],
    "condition": [
      "상수"
    ]
  }
}
```

## 문항 49 (P96-Q06-S2)

### 발문

함수 \$y \= \\frac{bx+c}{2x+a}\$의 그래프와 함수 \$y \= \\frac{4x+1}{x+3}\$의 그래프의 점근선의 방정식이 같고, 함수 \$y \= \\frac{bx+c}{2x+a}\$의 그래프가 점 \$(0, \-1)\$을 지날 때, 상수 \$a, b, c\$에 대하여 \$a+b+c\$의 값은?

### 선지

① \$8\$ ② \$9\$ ③ \$10\$ ④ \$11\$ ⑤ \$12\$

### 정답

①

### 해설

함수 \$y=\\dfrac{4x+1}{x+3}\$의 점근선의 방정식은 \$x=-3\$, \$y=4\$이다. 함수 \$y=\\dfrac{bx+c}{2x+a}\$의 점근선은 \$x=-\\dfrac{a}{2}\$, \$y=\\dfrac{b}{2}\$이므로 \$-\\dfrac{a}{2}=-3 \\implies a=6\$, \$\\dfrac{b}{2}=4 \\implies b=8\$이다. 또한 그래프가 점 \$(0, \-1)\$을 지나므로 \$\\dfrac{c}{a}=-1 \\implies c=-a=-6\$이다. 따라서 \$a+b+c=6+8+(-6)=8\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "유리식의 계산, 항등식, 유리함수의 정의역·치역·점근선을 대수적으로 구하는 문항으로 별도 도형 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "부분분수 변형, 항등식, 표준형 변형 및 부등식을 단계별로 전개하는 대수적 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-08",
  "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
  "rpm": "H1-RPM-261",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "유리함수",
      "점근선"
    ],
    "goal": [
      "합"
    ],
    "method": [
      "점근선",
      "대입"
    ],
    "condition": [
      "상수"
    ]
  }
}
```

## 문항 50 (P96-Q06-S3)

### 발문

함수 \$y \= \\frac{bx+c}{x+a}\$의 그래프와 함수 \$y \= \\frac{5x-3}{x-4}\$의 그래프의 점근선의 방정식이 같고, 함수 \$y \= \\frac{bx+c}{x+a}\$의 그래프가 점 \$(0, 2)\$를 지날 때, 상수 \$a, b, c\$에 대하여 \$a+b+c\$의 값은?

### 선지

① \$-9\$ ② \$-8\$ ③ \$-7\$ ④ \$-6\$ ⑤ \$-5\$

### 정답

③

### 해설

함수 \$y=\\dfrac{5x-3}{x-4}\$의 점근선의 방정식은 \$x=4\$, \$y=5\$이다. 함수 \$y=\\dfrac{bx+c}{x+a}\$의 점근선은 \$x=-a\$, \$y=b\$이므로 \$a=-4, b=5\$이다. 또한 그래프가 점 \$(0, 2)\$를 지나므로 \$\\dfrac{c}{a}=2 \\implies c=2a=-8\$이다. 따라서 \$a+b+c=-4+5+(-8)=-7\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "유리식의 계산, 항등식, 유리함수의 정의역·치역·점근선을 대수적으로 구하는 문항으로 별도 도형 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "부분분수 변형, 항등식, 표준형 변형 및 부등식을 단계별로 전개하는 대수적 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-08",
  "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
  "rpm": "H1-RPM-261",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "유리함수",
      "점근선"
    ],
    "goal": [
      "합"
    ],
    "method": [
      "점근선",
      "대입"
    ],
    "condition": [
      "상수"
    ]
  }
}
```

