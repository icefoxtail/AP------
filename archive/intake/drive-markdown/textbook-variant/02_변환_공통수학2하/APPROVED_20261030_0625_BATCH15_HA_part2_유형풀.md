# APPROVED\_20261030\_0625\_BATCH15\_HA\_part2\_유형풀

```
{
  "sourceBatchId": "APPROVED_20261030_0625_BATCH15_HA_50ITEMS",
  "sourceFile": "06_APPROVED_BANK_20261030_0625.json",
  "sourceTitle": "백발백중_공통수학2(하) (2022개정).pdf",
  "section": "Ⅲ. 함수와 그래프 1. 함수 수능형 기출문제 & 변형문제 01~08 (70~73쪽 4페이지 전수 - 공통수학2(하))",
  "part": "part2",
  "itemRange": "26-50",
  "itemCount": 25,
  "answerPoolOffsetStart": 125,
  "answerPoolOffsetEnd": 150,
  "curriculum": "2022",
  "standardCourse": "공통수학2"
}
```

## 문항 01 (P71-Q04-S5)

### 발문

집합 \$X={-2, \-1, 3}\$에 대하여 \$X\$에서 \$X\$로의 함수 \$f(x) \= \\begin{cases} ax^2+bx-4 & (x \< 0\) \\ 3 & (x \\ge 0\) \\end{cases}\$가 항등함수일 때, \$a-b\$의 값은? (단, \$a, b\$는 상수이다.)

### 선지

① \$-1\$ ② \$0\$ ③ \$1\$ ④ \$2\$ ⑤ \$3\$

### 정답

⑤

### 해설

함수 \$f\$가 집합 \$X={-2, \-1, 3}\$에서 \$X\$로의 항등함수이므로 \$f(-2)=-2\$, \$f(-1)=-1\$, \$f(3)=3\$이어야 한다. \$x \< 0\$일 때 \$f(x)=ax^2+bx-4\$이므로 \$f(-2)=4a-2b-4=-2 \\implies 2a-b=1\$ \$f(-1)=a-b-4=-1 \\implies a-b=3\$ 두 식을 연립하여 풀면 \$a=-2\$, \$b=-5\$이다. 따라서 \$a-b=-2-(-5)=3\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "순수 대수적 함수·방정식 조건을 계산하는 문항으로 도형·그래프 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "구간 분할 및 합성함수 방정식의 대수적 풀이를 단계별로 전개한다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_BASIC",
  "rpm": "H1-RPM-258",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "함수",
      "항등함수"
    ],
    "goal": [
      "값"
    ],
    "method": [
      "대입",
      "연립방정식"
    ],
    "condition": [
      "유한집합"
    ]
  }
}
```

## 문항 02 (P72-Q05-T1)

### 발문

실수 전체의 집합에서 정의된 함수 \$f(x) \= \\begin{cases} 2x+2 & (x \< 2\) \\ x^2-7x+16 & (x \\ge 2\) \\end{cases}\$에 대하여 \$(f \\circ f)(a) \= f(a)\$를 만족시키는 모든 실수 \$a\$의 값의 합은?

### 선지

① \$5\$ ② \$6\$ ③ \$7\$ ④ \$8\$ ⑤ \$9\$

### 정답

②

### 해설

\$t=f(a)\$라 놓으면 \$(f \\circ f)(a)=f(a)\$는 \$f(t)=t\$이다. 먼저 \$f(t)=t\$를 풀면 (i) \$t \< 2\$일 때: \$2t+2=t \\implies t=-2\$ (범위 \$t \< 2\$ 만족) (ii) \$t \\ge 2\$일 때: \$t^2-7t+16=t \\implies t^2-8t+16=0 \\implies (t-4)^2=0 \\implies t=4\$ (범위 \$t \\ge 2\$ 만족) 따라서 \$f(a)=-2\$ 또는 \$f(a)=4\$이다. ① \$f(a)=-2\$인 경우:

- \$a \< 2\$일 때: \$2a+2=-2 \\implies a=-2\$ (만족)  
- \$a \\ge 2\$일 때: \$a^2-7a+16=-2 \\implies a^2-7a+18=0\$ (판별식 \$D=49-72 \< 0\$, 실근 없음) ② \$f(a)=4\$인 경우:  
- \$a \< 2\$일 때: \$2a+2=4 \\implies a=1\$ (만족)  
- \$a \\ge 2\$일 때: \$a^2-7a+16=4 \\implies a^2-7a+12=0 \\implies (a-3)(a-4)=0 \\implies a=3\$ 또는 \$a=4\$ (모두 \$a \\ge 2\$ 만족) 그러므로 모든 실수 \$a\$는 \$-2, 1, 3, 4\$이고 그 합은 \$-2+1+3+4=6\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "순수 대수적 함수·방정식 조건을 계산하는 문항으로 도형·그래프 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "구간 분할 및 합성함수 방정식의 대수적 풀이를 단계별로 전개한다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_COMPOSITION",
  "rpm": "H1-RPM-254",
  "difficultyBucket": 3,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "함수",
      "합성함수"
    ],
    "goal": [
      "합"
    ],
    "method": [
      "치환",
      "이차방정식"
    ],
    "condition": [
      "실수"
    ]
  }
}
```

## 문항 03 (P72-Q05-S1)

### 발문

실수 전체의 집합에서 정의된 함수 \$f(x) \= \\begin{cases} 2x+2 & (x \< 2\) \\ x^2-7x+16 & (x \\ge 2\) \\end{cases}\$에 대하여 \$(f \\circ f)(a) \= f(a)\$를 만족시키는 서로 다른 실수 \$a\$의 개수는?

### 선지

① \$1\$ ② \$2\$ ③ \$3\$ ④ \$4\$ ⑤ \$5\$

### 정답

④

### 해설

\$t=f(a)\$라 놓으면 \$(f \\circ f)(a)=f(a)\$는 \$f(t)=t\$이다. (i) \$t \< 2\$일 때: \$2t+2=t \\implies t=-2\$ (만족) (ii) \$t \\ge 2\$일 때: \$t^2-7t+16=t \\implies (t-4)^2=0 \\implies t=4\$ (만족) 이제 \$f(a)=-2\$ 또는 \$f(a)=4\$를 만족하는 실수 \$a\$를 구하면 ① \$f(a)=-2\$:

- \$a \< 2\$: \$2a+2=-2 \\implies a=-2\$  
- \$a \\ge 2\$: \$a^2-7a+18=0\$ (\$D=-23 \< 0\$, 실근 없음) ② \$f(a)=4\$:  
- \$a \< 2\$: \$2a+2=4 \\implies a=1\$  
- \$a \\ge 2\$: \$a^2-7a+12=0 \\implies a=3\$ 또는 \$a=4\$ 따라서 서로 다른 실수 \$a\$는 \$-2, 1, 3, 4\$로 총 \$4\$개이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "순수 대수적 함수·방정식 조건을 계산하는 문항으로 도형·그래프 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "구간 분할 및 합성함수 방정식의 대수적 풀이를 단계별로 전개한다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_COMPOSITION",
  "rpm": "H1-RPM-254",
  "difficultyBucket": 3,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "함수",
      "합성함수"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "치환",
      "이차방정식"
    ],
    "condition": [
      "실수"
    ]
  }
}
```

## 문항 04 (P72-Q05-S2)

### 발문

실수 전체의 집합에서 정의된 함수 \$f(x) \= \\begin{cases} 2x+2 & (x \< 2\) \\ x^2-7x+16 & (x \\ge 2\) \\end{cases}\$에 대하여 \$(f \\circ f)(a) \= f(a)\$를 만족시키는 실수 \$a\$의 최댓값은?

### 선지

① \$2\$ ② \$3\$ ③ \$4\$ ④ \$5\$ ⑤ \$6\$

### 정답

③

### 해설

\$t=f(a)\$라 놓으면 \$f(t)=t\$에서 \$t \< 2\$일 때 \$2t+2=t \\implies t=-2\$, \$t \\ge 2\$일 때 \$t^2-7t+16=t \\implies (t-4)^2=0 \\implies t=4\$이다. ① \$f(a)=-2\$에서 \$a \< 2\$이면 \$2a+2=-2 \\implies a=-2\$, \$a \\ge 2\$이면 \$a^2-7a+18=0\$은 실근이 없다. ② \$f(a)=4\$에서 \$a \< 2\$이면 \$2a+2=4 \\implies a=1\$, \$a \\ge 2\$이면 \$a^2-7a+12=0 \\implies a=3, 4\$이다. 따라서 실수 \$a\$의 값은 \$-2, 1, 3, 4\$이므로 최댓값은 \$4\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "순수 대수적 함수·방정식 조건을 계산하는 문항으로 도형·그래프 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "구간 분할 및 합성함수 방정식의 대수적 풀이를 단계별로 전개한다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_COMPOSITION",
  "rpm": "H1-RPM-254",
  "difficultyBucket": 3,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "함수",
      "합성함수"
    ],
    "goal": [
      "최댓값"
    ],
    "method": [
      "치환",
      "이차방정식"
    ],
    "condition": [
      "실수"
    ]
  }
}
```

## 문항 05 (P72-Q05-S3)

### 발문

실수 전체의 집합에서 정의된 함수 \$f(x) \= \\begin{cases} 2x+2 & (x \< 2\) \\ x^2-7x+16 & (x \\ge 2\) \\end{cases}\$에 대하여 \$(f \\circ f)(a) \= f(a)\$를 만족시키는 실수 \$a\$의 최솟값은?

### 선지

① \$-2\$ ② \$-1\$ ③ \$0\$ ④ \$1\$ ⑤ \$2\$

### 정답

①

### 해설

\$t=f(a)\$라 놓으면 \$f(t)=t\$에서 \$t \< 2\$일 때 \$2t+2=t \\implies t=-2\$, \$t \\ge 2\$일 때 \$t^2-7t+16=t \\implies (t-4)^2=0 \\implies t=4\$이다. ① \$f(a)=-2\$에서 \$a \< 2\$이면 \$2a+2=-2 \\implies a=-2\$, \$a \\ge 2\$이면 \$a^2-7a+18=0\$은 실근이 없다. ② \$f(a)=4\$에서 \$a \< 2\$이면 \$2a+2=4 \\implies a=1\$, \$a \\ge 2\$이면 \$a^2-7a+12=0 \\implies a=3, 4\$이다. 따라서 실수 \$a\$의 값은 \$-2, 1, 3, 4\$이므로 최솟값은 \$-2\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "순수 대수적 함수·방정식 조건을 계산하는 문항으로 도형·그래프 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "구간 분할 및 합성함수 방정식의 대수적 풀이를 단계별로 전개한다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_COMPOSITION",
  "rpm": "H1-RPM-254",
  "difficultyBucket": 3,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "함수",
      "합성함수"
    ],
    "goal": [
      "최솟값"
    ],
    "method": [
      "치환",
      "이차방정식"
    ],
    "condition": [
      "실수"
    ]
  }
}
```

## 문항 06 (P72-Q05-S4)

### 발문

실수 전체의 집합에서 정의된 함수 \$f(x) \= \\begin{cases} 2x+3 & (x \< 1\) \\ x^2-5x+9 & (x \\ge 1\) \\end{cases}\$에 대하여 \$(f \\circ f)(a) \= f(a)\$를 만족시키는 모든 실수 \$a\$의 값의 합은?

### 선지

① \$-2\$ ② \$-1\$ ③ \$0\$ ④ \$1\$ ⑤ \$2\$

### 정답

⑤

### 해설

\$t=f(a)\$라 놓으면 \$f(t)=t\$를 만족하는 \$t\$는 (i) \$t \< 1\$일 때: \$2t+3=t \\implies t=-3\$ (만족) (ii) \$t \\ge 1\$일 때: \$t^2-5t+9=t \\implies t^2-6t+9=0 \\implies (t-3)^2=0 \\implies t=3\$ (만족) 이제 \$f(a)=-3\$ 또는 \$f(a)=3\$을 풀면 ① \$f(a)=-3\$:

- \$a \< 1\$: \$2a+3=-3 \\implies a=-3\$ (만족)  
- \$a \\ge 1\$: \$a^2-5a+9=-3 \\implies a^2-5a+12=0\$ (\$D=25-48 \< 0\$, 실근 없음) ② \$f(a)=3\$:  
- \$a \< 1\$: \$2a+3=3 \\implies a=0\$ (만족)  
- \$a \\ge 1\$: \$a^2-5a+9=3 \\implies a^2-5a+6=0 \\implies (a-2)(a-3)=0 \\implies a=2\$ 또는 \$a=3\$ (모두 \$a \\ge 1\$ 만족) 따라서 모든 실수 \$a\$의 값의 합은 \$-3+0+2+3=2\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "순수 대수적 함수·방정식 조건을 계산하는 문항으로 도형·그래프 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "구간 분할 및 합성함수 방정식의 대수적 풀이를 단계별로 전개한다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_COMPOSITION",
  "rpm": "H1-RPM-254",
  "difficultyBucket": 3,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "함수",
      "합성함수"
    ],
    "goal": [
      "합"
    ],
    "method": [
      "치환",
      "이차방정식"
    ],
    "condition": [
      "실수"
    ]
  }
}
```

## 문항 07 (P72-Q05-S5)

### 발문

실수 전체의 집합에서 정의된 함수 \$f(x) \= \\begin{cases} 2x+3 & (x \< 1\) \\ x^2-5x+9 & (x \\ge 1\) \\end{cases}\$에 대하여 \$(f \\circ f)(a) \= f(a)\$를 만족시키는 서로 다른 실수 \$a\$의 개수는?

### 선지

① \$2\$ ② \$3\$ ③ \$4\$ ④ \$5\$ ⑤ \$6\$

### 정답

③

### 해설

\$t=f(a)\$라 놓으면 \$f(t)=t\$에서 \$t \< 1\$일 때 \$2t+3=t \\implies t=-3\$, \$t \\ge 1\$일 때 \$t^2-5t+9=t \\implies (t-3)^2=0 \\implies t=3\$이다. ① \$f(a)=-3\$에서 \$a \< 1\$이면 \$2a+3=-3 \\implies a=-3\$, \$a \\ge 1\$이면 \$a^2-5a+12=0\$은 실근이 없다. ② \$f(a)=3\$에서 \$a \< 1\$이면 \$2a+3=3 \\implies a=0\$, \$a \\ge 1\$이면 \$a^2-5a+6=0 \\implies a=2, 3\$이다. 따라서 서로 다른 실수 \$a\$는 \$-3, 0, 2, 3\$으로 총 \$4\$개이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "순수 대수적 함수·방정식 조건을 계산하는 문항으로 도형·그래프 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "구간 분할 및 합성함수 방정식의 대수적 풀이를 단계별로 전개한다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_COMPOSITION",
  "rpm": "H1-RPM-254",
  "difficultyBucket": 3,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "함수",
      "합성함수"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "치환",
      "이차방정식"
    ],
    "condition": [
      "실수"
    ]
  }
}
```

## 문항 08 (P72-Q06-T1)

### 발문

실수 전체의 집합에서 정의된 함수 \$f(x) \= \\begin{cases} 2x+4 & (x \< 0\) \\ x^2-4x+4 & (x \\ge 0\) \\end{cases}\$에 대하여 \$(f \\circ f)(a) \= f(a)\$를 만족시키는 모든 실수 \$a\$의 값의 합은?

### 선지

① \$2\$ ② \$\\dfrac{5}{2}\$ ③ \$3\$ ④ \$\\dfrac{7}{2}\$ ⑤ \$4\$

### 정답

②

### 해설

\$t=f(a)\$라 놓으면 \$f(t)=t\$를 만족하는 \$t\$는 (i) \$t \< 0\$일 때: \$2t+4=t \\implies t=-4\$ (만족) (ii) \$t \\ge 0\$일 때: \$t^2-4t+4=t \\implies t^2-5t+4=0 \\implies (t-1)(t-4)=0 \\implies t=1\$ 또는 \$t=4\$ (모두 만족) 이제 \$f(a) \\in {-4, 1, 4}\$인 실수 \$a\$를 구하면 ① \$f(a)=-4\$:

- \$a \< 0\$: \$2a+4=-4 \\implies a=-4\$  
- \$a \\ge 0\$: \$(a-2)^2=-4\$ (실근 없음) ② \$f(a)=1\$:  
- \$a \< 0\$: \$2a+4=1 \\implies a=-\\dfrac{3}{2}\$  
- \$a \\ge 0\$: \$a^2-4a+4=1 \\implies (a-1)(a-3)=0 \\implies a=1\$ 또는 \$a=3\$ ③ \$f(a)=4\$:  
- \$a \< 0\$: \$2a+4=4 \\implies a=0\$ (\$a \< 0\$ 불만족)  
- \$a \\ge 0\$: \$a^2-4a+4=4 \\implies a(a-4)=0 \\implies a=0\$ 또는 \$a=4\$ 따라서 모든 실수 \$a\$의 값의 합은 \$-4-\\dfrac{3}{2}+0+1+3+4=\\dfrac{5}{2}\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "순수 대수적 함수·방정식 조건을 계산하는 문항으로 도형·그래프 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "구간 분할 및 합성함수 방정식의 대수적 풀이를 단계별로 전개한다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_COMPOSITION",
  "rpm": "H1-RPM-254",
  "difficultyBucket": 3,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "함수",
      "합성함수"
    ],
    "goal": [
      "합"
    ],
    "method": [
      "치환",
      "이차방정식"
    ],
    "condition": [
      "실수"
    ]
  }
}
```

## 문항 09 (P72-Q06-S1)

### 발문

실수 전체의 집합에서 정의된 함수 \$f(x) \= \\begin{cases} 2x+4 & (x \< 0\) \\ x^2-4x+4 & (x \\ge 0\) \\end{cases}\$에 대하여 \$(f \\circ f)(a) \= f(a)\$를 만족시키는 서로 다른 실수 \$a\$의 개수는?

### 선지

① \$3\$ ② \$4\$ ③ \$5\$ ④ \$6\$ ⑤ \$7\$

### 정답

④

### 해설

\$t=f(a)\$라 놓으면 \$f(t)=t\$에서 \$t \< 0\$일 때 \$2t+4=t \\implies t=-4\$, \$t \\ge 0\$일 때 \$t^2-4t+4=t \\implies (t-1)(t-4)=0 \\implies t=1, 4\$이다. ① \$f(a)=-4\$: \$a \< 0\$에서 \$a=-4\$, \$a \\ge 0\$에서 실근 없음. ② \$f(a)=1\$: \$a \< 0\$에서 \$a=-\\dfrac{3}{2}\$, \$a \\ge 0\$에서 \$a=1, 3\$. ③ \$f(a)=4\$: \$a \< 0\$에서 해 없음, \$a \\ge 0\$에서 \$a=0, 4\$. 따라서 서로 다른 실수 \$a\$는 \$-4, \-\\dfrac{3}{2}, 0, 1, 3, 4\$로 총 \$6\$개이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "순수 대수적 함수·방정식 조건을 계산하는 문항으로 도형·그래프 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "구간 분할 및 합성함수 방정식의 대수적 풀이를 단계별로 전개한다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_COMPOSITION",
  "rpm": "H1-RPM-254",
  "difficultyBucket": 3,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "함수",
      "합성함수"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "치환",
      "이차방정식"
    ],
    "condition": [
      "실수"
    ]
  }
}
```

## 문항 10 (P72-Q06-S2)

### 발문

실수 전체의 집합에서 정의된 함수 \$f(x) \= \\begin{cases} 2x+4 & (x \< 0\) \\ x^2-4x+4 & (x \\ge 0\) \\end{cases}\$에 대하여 \$(f \\circ f)(a) \= f(a)\$를 만족시키는 실수 \$a\$의 최댓값은?

### 선지

① \$4\$ ② \$5\$ ③ \$6\$ ④ \$7\$ ⑤ \$8\$

### 정답

①

### 해설

\$t=f(a)\$라 놓으면 \$f(t)=t\$에서 \$t \\in {-4, 1, 4}\$이다. ① \$f(a)=-4\$: \$a=-4\$ ② \$f(a)=1\$: \$a=-\\dfrac{3}{2}, 1, 3\$ ③ \$f(a)=4\$: \$a=0, 4\$ 따라서 실수 \$a\$ 중 최댓값은 \$4\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "순수 대수적 함수·방정식 조건을 계산하는 문항으로 도형·그래프 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "구간 분할 및 합성함수 방정식의 대수적 풀이를 단계별로 전개한다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_COMPOSITION",
  "rpm": "H1-RPM-254",
  "difficultyBucket": 3,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "함수",
      "합성함수"
    ],
    "goal": [
      "최댓값"
    ],
    "method": [
      "치환",
      "이차방정식"
    ],
    "condition": [
      "실수"
    ]
  }
}
```

## 문항 11 (P72-Q06-S3)

### 발문

실수 전체의 집합에서 정의된 함수 \$f(x) \= \\begin{cases} 2x+4 & (x \< 0\) \\ x^2-4x+4 & (x \\ge 0\) \\end{cases}\$에 대하여 \$(f \\circ f)(a) \= f(a)\$를 만족시키는 실수 \$a\$의 최솟값은?

### 선지

① \$-5\$ ② \$-4\$ ③ \$-3\$ ④ \$-2\$ ⑤ \$-1\$

### 정답

②

### 해설

\$t=f(a)\$라 놓으면 \$f(t)=t\$에서 \$t \\in {-4, 1, 4}\$이다. ① \$f(a)=-4\$: \$a=-4\$ ② \$f(a)=1\$: \$a=-\\dfrac{3}{2}, 1, 3\$ ③ \$f(a)=4\$: \$a=0, 4\$ 따라서 실수 \$a\$ 중 최솟값은 \$-4\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "순수 대수적 함수·방정식 조건을 계산하는 문항으로 도형·그래프 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "구간 분할 및 합성함수 방정식의 대수적 풀이를 단계별로 전개한다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_COMPOSITION",
  "rpm": "H1-RPM-254",
  "difficultyBucket": 3,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "함수",
      "합성함수"
    ],
    "goal": [
      "최솟값"
    ],
    "method": [
      "치환",
      "이차방정식"
    ],
    "condition": [
      "실수"
    ]
  }
}
```

## 문항 12 (P72-Q06-S4)

### 발문

실수 전체의 집합에서 정의된 함수 \$f(x) \= \\begin{cases} 2x+4 & (x \< 0\) \\ x^2-4x+4 & (x \\ge 0\) \\end{cases}\$에 대하여 \$(f \\circ f)(a) \= f(a)\$를 만족시키는 양의 실수 \$a\$의 값의 합은?

### 선지

① \$8\$ ② \$9\$ ③ \$10\$ ④ \$11\$ ⑤ \$12\$

### 정답

①

### 해설

\$t=f(a)\$라 놓으면 \$f(t)=t\$에서 \$t \\in {-4, 1, 4}\$이다. ① \$f(a)=-4\$: \$a=-4\$ ② \$f(a)=1\$: \$a=-\\dfrac{3}{2}, 1, 3\$ ③ \$f(a)=4\$: \$a=0, 4\$ 이 중 양의 실수 \$a\$는 \$1, 3, 4\$이므로 그 합은 \$1+3+4=8\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "순수 대수적 함수·방정식 조건을 계산하는 문항으로 도형·그래프 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "구간 분할 및 합성함수 방정식의 대수적 풀이를 단계별로 전개한다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_COMPOSITION",
  "rpm": "H1-RPM-254",
  "difficultyBucket": 3,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "함수",
      "합성함수"
    ],
    "goal": [
      "합"
    ],
    "method": [
      "치환",
      "이차방정식"
    ],
    "condition": [
      "양수"
    ]
  }
}
```

## 문항 13 (P72-Q06-S5)

### 발문

실수 전체의 집합에서 정의된 함수 \$f(x) \= \\begin{cases} 2x+4 & (x \< 0\) \\ x^2-4x+4 & (x \\ge 0\) \\end{cases}\$에 대하여 \$(f \\circ f)(a) \= f(a)\$를 만족시키는 음의 실수 \$a\$의 값의 합은?

### 선지

① \$-7\$ ② \$-\\dfrac{13}{2}\$ ③ \$-6\$ ④ \$-\\dfrac{11}{2}\$ ⑤ \$-5\$

### 정답

④

### 해설

\$t=f(a)\$라 놓으면 \$f(t)=t\$에서 \$t \\in {-4, 1, 4}\$이다. ① \$f(a)=-4\$: \$a=-4\$ ② \$f(a)=1\$: \$a=-\\dfrac{3}{2}, 1, 3\$ ③ \$f(a)=4\$: \$a=0, 4\$ 이 중 음의 실수 \$a\$는 \$-4, \-\\dfrac{3}{2}\$이므로 그 합은 \$-4+\\left(-\\dfrac{3}{2}\\right)=-\\dfrac{11}{2}\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "순수 대수적 함수·방정식 조건을 계산하는 문항으로 도형·그래프 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "구간 분할 및 합성함수 방정식의 대수적 풀이를 단계별로 전개한다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_COMPOSITION",
  "rpm": "H1-RPM-254",
  "difficultyBucket": 3,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "함수",
      "합성함수"
    ],
    "goal": [
      "합"
    ],
    "method": [
      "치환",
      "이차방정식"
    ],
    "condition": [
      "음수"
    ]
  }
}
```

## 문항 14 (P73-Q07-T1)

### 발문

실수 전체의 집합에서 정의된 두 함수 \$f(x)=2x+1, g(x)\$가 있다. 모든 실수 \$x\$에 대하여 \$(g \\circ g)(x)=3x-1\$일 때, \$((f \\circ g) \\circ g)(a)=a\$를 만족시키는 실수 \$a\$의 값은?

### 선지

① \$-\\dfrac{1}{5}\$ ② \$0\$ ③ \$\\dfrac{1}{5}\$ ④ \$\\dfrac{2}{5}\$ ⑤ \$\\dfrac{3}{5}\$

### 정답

③

### 해설

합성함수의 결합법칙에 의하여 \$((f \\circ g) \\circ g)(a)=(f \\circ (g \\circ g))(a)=f((g \\circ g)(a))\$이다. \$(g \\circ g)(a)=3a-1\$이고 \$f(x)=2x+1\$이므로 \$f(3a-1)=2(3a-1)+1=6a-1\$이다. \$6a-1=a\$에서 \$5a=1\$이므로 \$a=\\dfrac{1}{5}\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "순수 대수적 함수·방정식 조건을 계산하는 문항으로 도형·그래프 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "구간 분할 및 합성함수 방정식의 대수적 풀이를 단계별로 전개한다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_COMPOSITION",
  "rpm": "H1-RPM-253",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "함수",
      "합성함수"
    ],
    "goal": [
      "값"
    ],
    "method": [
      "결합법칙",
      "일차방정식"
    ],
    "condition": [
      "실수"
    ]
  }
}
```

## 문항 15 (P73-Q07-S1)

### 발문

실수 전체의 집합에서 정의된 두 함수 \$f(x)=2x+3, g(x)\$가 있다. 모든 실수 \$x\$에 대하여 \$(g \\circ g)(x)=2x-4\$일 때, \$((f \\circ g) \\circ g)(a)=a\$를 만족시키는 실수 \$a\$의 값은?

### 선지

① \$\\dfrac{1}{3}\$ ② \$\\dfrac{2}{3}\$ ③ \$1\$ ④ \$\\dfrac{4}{3}\$ ⑤ \$\\dfrac{5}{3}\$

### 정답

⑤

### 해설

합성함수의 결합법칙에 의하여 \$((f \\circ g) \\circ g)(a)=f((g \\circ g)(a))\$이다. \$(g \\circ g)(a)=2a-4\$이고 \$f(x)=2x+3\$이므로 \$f(2a-4)=2(2a-4)+3=4a-5\$이다. \$4a-5=a\$에서 \$3a=5\$이므로 \$a=\\dfrac{5}{3}\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "순수 대수적 함수·방정식 조건을 계산하는 문항으로 도형·그래프 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "구간 분할 및 합성함수 방정식의 대수적 풀이를 단계별로 전개한다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_COMPOSITION",
  "rpm": "H1-RPM-253",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "함수",
      "합성함수"
    ],
    "goal": [
      "값"
    ],
    "method": [
      "결합법칙",
      "일차방정식"
    ],
    "condition": [
      "실수"
    ]
  }
}
```

## 문항 16 (P73-Q07-S2)

### 발문

실수 전체의 집합에서 정의된 두 함수 \$f(x)=2x+1, g(x)\$가 있다. 모든 실수 \$x\$에 대하여 \$(g \\circ g)(x)=3x-1\$일 때, \$((f \\circ g) \\circ g)(a)=a\$를 만족시키는 실수 \$a\$에 대하여 \$5a\$의 값은?

### 선지

① \$-3\$ ② \$-2\$ ③ \$-1\$ ④ \$0\$ ⑤ \$1\$

### 정답

⑤

### 해설

합성함수의 결합법칙에 의하여 \$((f \\circ g) \\circ g)(a)=f((g \\circ g)(a))\$이다. \$(g \\circ g)(a)=3a-1\$이고 \$f(x)=2x+1\$이므로 \$f(3a-1)=2(3a-1)+1=6a-1\$이다. \$6a-1=a\$에서 \$5a=1\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "순수 대수적 함수·방정식 조건을 계산하는 문항으로 도형·그래프 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "구간 분할 및 합성함수 방정식의 대수적 풀이를 단계별로 전개한다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_COMPOSITION",
  "rpm": "H1-RPM-253",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "함수",
      "합성함수"
    ],
    "goal": [
      "값"
    ],
    "method": [
      "결합법칙",
      "일차방정식"
    ],
    "condition": [
      "실수"
    ]
  }
}
```

## 문항 17 (P73-Q07-S3)

### 발문

실수 전체의 집합에서 정의된 두 함수 \$f(x)=3x+1, g(x)\$가 있다. 모든 실수 \$x\$에 대하여 \$(g \\circ g)(x)=2x+1\$일 때, \$((f \\circ g) \\circ g)(a)=a\$를 만족시키는 실수 \$a\$의 값은?

### 선지

① \$-\\dfrac{4}{5}\$ ② \$-\\dfrac{3}{5}\$ ③ \$-\\dfrac{2}{5}\$ ④ \$-\\dfrac{1}{5}\$ ⑤ \$0\$

### 정답

①

### 해설

합성함수의 결합법칙에 의하여 \$((f \\circ g) \\circ g)(a)=f((g \\circ g)(a))\$이다. \$(g \\circ g)(a)=2a+1\$이고 \$f(x)=3x+1\$이므로 \$f(2a+1)=3(2a+1)+1=6a+4\$이다. \$6a+4=a\$에서 \$5a=-4\$이므로 \$a=-\\dfrac{4}{5}\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "순수 대수적 함수·방정식 조건을 계산하는 문항으로 도형·그래프 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "구간 분할 및 합성함수 방정식의 대수적 풀이를 단계별로 전개한다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_COMPOSITION",
  "rpm": "H1-RPM-253",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "함수",
      "합성함수"
    ],
    "goal": [
      "값"
    ],
    "method": [
      "결합법칙",
      "일차방정식"
    ],
    "condition": [
      "실수"
    ]
  }
}
```

## 문항 18 (P73-Q07-S4)

### 발문

실수 전체의 집합에서 정의된 두 함수 \$f(x)=4x-3, g(x)\$가 있다. 모든 실수 \$x\$에 대하여 \$(g \\circ g)(x)=x+2\$일 때, \$((f \\circ g) \\circ g)(a)=a\$를 만족시키는 실수 \$a\$의 값은?

### 선지

① \$-2\$ ② \$-\\dfrac{5}{3}\$ ③ \$-\\dfrac{4}{3}\$ ④ \$-1\$ ⑤ \$-\\dfrac{2}{3}\$

### 정답

②

### 해설

합성함수의 결합법칙에 의하여 \$((f \\circ g) \\circ g)(a)=f((g \\circ g)(a))\$이다. \$(g \\circ g)(a)=a+2\$이고 \$f(x)=4x-3\$이므로 \$f(a+2)=4(a+2)-3=4a+5\$이다. \$4a+5=a\$에서 \$3a=-5\$이므로 \$a=-\\dfrac{5}{3}\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "순수 대수적 함수·방정식 조건을 계산하는 문항으로 도형·그래프 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "구간 분할 및 합성함수 방정식의 대수적 풀이를 단계별로 전개한다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_COMPOSITION",
  "rpm": "H1-RPM-253",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "함수",
      "합성함수"
    ],
    "goal": [
      "값"
    ],
    "method": [
      "결합법칙",
      "일차방정식"
    ],
    "condition": [
      "실수"
    ]
  }
}
```

## 문항 19 (P73-Q07-S5)

### 발문

실수 전체의 집합에서 정의된 두 함수 \$f(x)=x+4, g(x)\$가 있다. 모든 실수 \$x\$에 대하여 \$(g \\circ g)(x)=2x-1\$일 때, \$((f \\circ g) \\circ g)(a)=a\$를 만족시키는 실수 \$a\$의 값은?

### 선지

① \$-5\$ ② \$-4\$ ③ \$-3\$ ④ \$-2\$ ⑤ \$-1\$

### 정답

③

### 해설

합성함수의 결합법칙에 의하여 \$((f \\circ g) \\circ g)(a)=f((g \\circ g)(a))\$이다. \$(g \\circ g)(a)=2a-1\$이고 \$f(x)=x+4\$이므로 \$f(2a-1)=(2a-1)+4=2a+3\$이다. \$2a+3=a\$에서 \$a=-3\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "순수 대수적 함수·방정식 조건을 계산하는 문항으로 도형·그래프 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "구간 분할 및 합성함수 방정식의 대수적 풀이를 단계별로 전개한다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_COMPOSITION",
  "rpm": "H1-RPM-253",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "함수",
      "합성함수"
    ],
    "goal": [
      "값"
    ],
    "method": [
      "결합법칙",
      "일차방정식"
    ],
    "condition": [
      "실수"
    ]
  }
}
```

## 문항 20 (P73-Q08-T1)

### 발문

실수 전체의 집합에서 정의된 세 함수 \$f, g, h\$에 대하여 \$(f \\circ g)(x)=x^2-5, h(x)=x-1\$일 때, \$(f \\circ (g \\circ h))(a)=a\$를 만족시키는 모든 실수 \$a\$의 값의 합은?

### 선지

① \$0\$ ② \$1\$ ③ \$2\$ ④ \$3\$ ⑤ \$4\$

### 정답

④

### 해설

합성함수의 결합법칙에 의하여 \$(f \\circ (g \\circ h))(a)=((f \\circ g) \\circ h)(a)=(f \\circ g)(h(a))\$이다. \$h(a)=a-1\$이고 \$(f \\circ g)(x)=x^2-5\$이므로 \$(f \\circ g)(a-1)=(a-1)^2-5=a^2-2a-4\$이다. \$a^2-2a-4=a\$에서 \$a^2-3a-4=0\$ \$(a+1)(a-4)=0\$이므로 \$a=-1\$ 또는 \$a=4\$이다. 따라서 모든 실수 \$a\$의 값의 합은 \$-1+4=3\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "순수 대수적 함수·방정식 조건을 계산하는 문항으로 도형·그래프 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "구간 분할 및 합성함수 방정식의 대수적 풀이를 단계별로 전개한다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_COMPOSITION",
  "rpm": "H1-RPM-253",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "함수",
      "합성함수"
    ],
    "goal": [
      "합"
    ],
    "method": [
      "결합법칙",
      "이차방정식"
    ],
    "condition": [
      "실수"
    ]
  }
}
```

## 문항 21 (P73-Q08-S1)

### 발문

실수 전체의 집합에서 정의된 세 함수 \$f, g, h\$에 대하여 \$(f \\circ g)(x)=x^2-5, h(x)=x-1\$일 때, \$(f \\circ (g \\circ h))(a)=a\$를 만족시키는 모든 실수 \$a\$의 값의 곱은?

### 선지

① \$-8\$ ② \$-7\$ ③ \$-6\$ ④ \$-5\$ ⑤ \$-4\$

### 정답

⑤

### 해설

합성함수의 결합법칙에 의하여 \$(f \\circ (g \\circ h))(a)=((f \\circ g) \\circ h)(a)=(f \\circ g)(h(a))\$이다. \$(a-1)^2-5=a\$에서 \$a^2-3a-4=0\$ \$(a+1)(a-4)=0\$이므로 \$a=-1\$ 또는 \$a=4\$이다. 따라서 모든 실수 \$a\$의 값의 곱은 \$(-1) \\times 4=-4\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "순수 대수적 함수·방정식 조건을 계산하는 문항으로 도형·그래프 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "구간 분할 및 합성함수 방정식의 대수적 풀이를 단계별로 전개한다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_COMPOSITION",
  "rpm": "H1-RPM-253",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "함수",
      "합성함수"
    ],
    "goal": [
      "곱"
    ],
    "method": [
      "결합법칙",
      "이차방정식"
    ],
    "condition": [
      "실수"
    ]
  }
}
```

## 문항 22 (P73-Q08-S2)

### 발문

실수 전체의 집합에서 정의된 세 함수 \$f, g, h\$에 대하여 \$(f \\circ g)(x)=x^2-5, h(x)=x-1\$일 때, \$(f \\circ (g \\circ h))(a)=a\$를 만족시키는 실수 \$a\$의 최댓값은?

### 선지

① \$2\$ ② \$3\$ ③ \$4\$ ④ \$5\$ ⑤ \$6\$

### 정답

③

### 해설

합성함수의 결합법칙에 의하여 \$(f \\circ (g \\circ h))(a)=(f \\circ g)(h(a))=(a-1)^2-5\$이다. \$(a-1)^2-5=a\$에서 \$a^2-3a-4=0\$ \$(a+1)(a-4)=0\$이므로 \$a=-1\$ 또는 \$a=4\$이다. 따라서 실수 \$a\$의 최댓값은 \$4\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "순수 대수적 함수·방정식 조건을 계산하는 문항으로 도형·그래프 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "구간 분할 및 합성함수 방정식의 대수적 풀이를 단계별로 전개한다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_COMPOSITION",
  "rpm": "H1-RPM-253",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "함수",
      "합성함수"
    ],
    "goal": [
      "최댓값"
    ],
    "method": [
      "결합법칙",
      "이차방정식"
    ],
    "condition": [
      "실수"
    ]
  }
}
```

## 문항 23 (P73-Q08-S3)

### 발문

실수 전체의 집합에서 정의된 세 함수 \$f, g, h\$에 대하여 \$(f \\circ g)(x)=x^2-5, h(x)=x-1\$일 때, \$(f \\circ (g \\circ h))(a)=a\$를 만족시키는 실수 \$a\$의 최솟값은?

### 선지

① \$-2\$ ② \$-1\$ ③ \$0\$ ④ \$1\$ ⑤ \$2\$

### 정답

②

### 해설

합성함수의 결합법칙에 의하여 \$(f \\circ (g \\circ h))(a)=(f \\circ g)(h(a))=(a-1)^2-5\$이다. \$(a-1)^2-5=a\$에서 \$a^2-3a-4=0\$ \$(a+1)(a-4)=0\$이므로 \$a=-1\$ 또는 \$a=4\$이다. 따라서 실수 \$a\$의 최솟값은 \$-1\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "순수 대수적 함수·방정식 조건을 계산하는 문항으로 도형·그래프 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "구간 분할 및 합성함수 방정식의 대수적 풀이를 단계별로 전개한다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_COMPOSITION",
  "rpm": "H1-RPM-253",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "함수",
      "합성함수"
    ],
    "goal": [
      "최솟값"
    ],
    "method": [
      "결합법칙",
      "이차방정식"
    ],
    "condition": [
      "실수"
    ]
  }
}
```

## 문항 24 (P73-Q08-S4)

### 발문

실수 전체의 집합에서 정의된 세 함수 \$f, g, h\$에 대하여 \$(f \\circ g)(x)=x^2-3, h(x)=x-2\$일 때, \$(f \\circ (g \\circ h))(a)=a\$를 만족시키는 모든 실수 \$a\$의 값의 합은?

### 선지

① \$5\$ ② \$6\$ ③ \$7\$ ④ \$8\$ ⑤ \$9\$

### 정답

①

### 해설

합성함수의 결합법칙에 의하여 \$(f \\circ (g \\circ h))(a)=((f \\circ g) \\circ h)(a)=(f \\circ g)(h(a))\$이다. \$h(a)=a-2\$이고 \$(f \\circ g)(x)=x^2-3\$이므로 \$(f \\circ g)(a-2)=(a-2)^2-3=a^2-4a+1\$이다. \$a^2-4a+1=a\$에서 \$a^2-5a+1=0\$이다. 판별식 \$D=(-5)^2-4 \\cdot 1 \\cdot 1=21 \> 0\$이므로 서로 다른 두 실근을 가진다. 따라서 근과 계수의 관계에 의하여 모든 실수 \$a\$의 값의 합은 \$5\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "순수 대수적 함수·방정식 조건을 계산하는 문항으로 도형·그래프 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "구간 분할 및 합성함수 방정식의 대수적 풀이를 단계별로 전개한다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_COMPOSITION",
  "rpm": "H1-RPM-253",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "함수",
      "합성함수"
    ],
    "goal": [
      "합"
    ],
    "method": [
      "결합법칙",
      "근과계수의관계"
    ],
    "condition": [
      "실수"
    ]
  }
}
```

## 문항 25 (P73-Q08-S5)

### 발문

실수 전체의 집합에서 정의된 세 함수 \$f, g, h\$에 대하여 \$(f \\circ g)(x)=x^2-3, h(x)=x-2\$일 때, \$(f \\circ (g \\circ h))(a)=a\$를 만족시키는 모든 실수 \$a\$의 값의 곱은?

### 선지

① \$-2\$ ② \$-1\$ ③ \$0\$ ④ \$1\$ ⑤ \$2\$

### 정답

④

### 해설

합성함수의 결합법칙에 의하여 \$(f \\circ (g \\circ h))(a)=(f \\circ g)(h(a))=(a-2)^2-3\$이다. \$(a-2)^2-3=a\$에서 \$a^2-5a+1=0\$이다. 판별식 \$D=25-4=21 \> 0\$이므로 서로 다른 두 실근을 가진다. 따라서 근과 계수의 관계에 의하여 모든 실수 \$a\$의 값의 곱은 \$1\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "순수 대수적 함수·방정식 조건을 계산하는 문항으로 도형·그래프 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "구간 분할 및 합성함수 방정식의 대수적 풀이를 단계별로 전개한다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_COMPOSITION",
  "rpm": "H1-RPM-253",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "함수",
      "합성함수"
    ],
    "goal": [
      "곱"
    ],
    "method": [
      "결합법칙",
      "근과계수의관계"
    ],
    "condition": [
      "실수"
    ]
  }
}
```

