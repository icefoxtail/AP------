# APPROVED\_20261025\_2342\_BATCH10\_HA\_part1\_유형풀

```
{
  "sourceBatchId": "APPROVED_20261025_2342_BATCH10_HA_50ITEMS",
  "sourceFile": "06_APPROVED_BANK_20261025_2342.json",
  "sourceTitle": "백발백중_공통수학2(하) (2022개정).pdf",
  "section": "Ⅲ. 함수와 그래프 1. 함수 Best 2회 후반 & 집중공략 01~02 (50~53쪽 4페이지 전수 - 공통수학2(하))",
  "part": "part1",
  "itemRange": "1-25",
  "itemCount": 25,
  "answerPoolOffsetStart": 1050,
  "answerPoolOffsetEnd": 1075,
  "curriculum": "2022",
  "standardCourse": "공통수학2"
}
```

## 문항 01 (P50-Q16-T1)

### 발문

함수 \$f(x) \= \\dfrac{x-1}{x+1}\$에 대하여 \$f^1(x) \= f(x)\$, \$f^{n+1}(x) \= (f \\circ f^n)(x)\$ (\$n\$은 자연수)라 정의하자. \$f^{2026}(2)\$의 값은?

### 선지

① \$-3\$ ② \$-\\dfrac{1}{2}\$ ③ \$\\dfrac{1}{3}\$ ④ \$1\$ ⑤ \$2\$

### 정답

②

### 해설

\$f^1(2) \= f(2) \= \\dfrac{2 \- 1}{2 \+ 1} \= \\dfrac{1}{3}\$ \$f^2(2) \= f\\left(\\dfrac{1}{3}\\right) \= \\dfrac{\\frac{1}{3} \- 1}{\\frac{1}{3} \+ 1} \= \\dfrac{-\\frac{2}{3}}{\\frac{4}{3}} \= \-\\dfrac{1}{2}\$ \$f^3(2) \= f\\left(-\\dfrac{1}{2}\\right) \= \\dfrac{-\\frac{1}{2} \- 1}{-\\frac{1}{2} \+ 1} \= \\dfrac{-\\frac{3}{2}}{\\frac{1}{2}} \= \-3\$ \$f^4(2) \= f(-3) \= \\dfrac{-3 \- 1}{-3 \+ 1} \= \\dfrac{-4}{-2} \= 2\$ 따라서 \$f^n(2)\$는 주기가 \$4\$인 수열이 되고, \$2026 \= 4 \\times 506 \+ 2\$이므로 \$f^{2026}(2) \= f^2(2) \= \-\\dfrac{1}{2}\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "유리함수형 합성함수의 거듭제곱 함숫값을 주기성으로 구하는 문항이다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "x=2에서 시작해 함숫값을 순차 대입하고 주기 4를 찾는 대수적 풀이이다."
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
      "값"
    ],
    "method": [
      "대입",
      "주기"
    ],
    "condition": [
      "자연수"
    ]
  }
}
```

## 문항 02 (P50-Q16-S1)

### 발문

함수 \$f(x) \= 1 \- \\dfrac{1}{x}\$에 대하여 \$f^1(x) \= f(x)\$, \$f^{n+1}(x) \= (f \\circ f^n)(x)\$ (\$n\$은 자연수)라 할 때, \$f^{100}(3)\$의 값은?

### 선지

① \$-\\dfrac{1}{2}\$ ② \$0\$ ③ \$\\dfrac{1}{3}\$ ④ \$\\dfrac{2}{3}\$ ⑤ \$3\$

### 정답

④

### 해설

\$f^1(3) \= f(3) \= 1 \- \\dfrac{1}{3} \= \\dfrac{2}{3}\$ \$f^2(3) \= f\\left(\\dfrac{2}{3}\\right) \= 1 \- \\dfrac{3}{2} \= \-\\dfrac{1}{2}\$ \$f^3(3) \= f\\left(-\\dfrac{1}{2}\\right) \= 1 \- (-2) \= 3\$ 따라서 \$f^n(3)\$은 주기가 \$3\$인 수열이 되고, \$100 \= 3 \\times 33 \+ 1\$이므로 \$f^{100}(3) \= f^1(3) \= \\dfrac{2}{3}\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "합성함수의 거듭제곱 함숫값을 주기성으로 구하는 문항이다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "x=3에서 시작해 함숫값을 순차 대입하고 주기 3을 찾는 대수적 풀이이다."
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
      "값"
    ],
    "method": [
      "대입",
      "주기"
    ],
    "condition": [
      "자연수"
    ]
  }
}
```

## 문항 03 (P50-Q16-S2)

### 발문

함수 \$f(x) \= \\begin{cases} x \+ 1 & (x \< 4\) \\ 1 & (x \= 4\) \\end{cases}\$에 대하여 \$f^1(x) \= f(x)\$, \$f^{n+1}(x) \= (f \\circ f^n)(x)\$ (\$n\$은 자연수)라 할 때, \$f^{50}(2)\$의 값은?

### 선지

① \$2\$ ② \$3\$ ③ \$4\$ ④ \$5\$ ⑤ \$6\$

### 정답

③

### 해설

\$f^1(2) \= f(2) \= 2 \+ 1 \= 3\$ \$f^2(2) \= f(3) \= 3 \+ 1 \= 4\$ \$f^3(2) \= f(4) \= 1\$ \$f^4(2) \= f(1) \= 1 \+ 1 \= 2\$ \$f^5(2) \= f(2) \= 3\$ 따라서 \$f^n(2)\$는 \$3, 4, 1, 2\$가 반복되는 주기 \$4\$인 수열이므로 \$50 \= 4 \\times 12 \+ 2\$에서 \$f^{50}(2) \= f^2(2) \= 4\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "구간별 정의된 함수의 합성 거듭제곱 함숫값을 구하는 문항이다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "x=2에서 시작해 함숫값을 순차 계산하고 주기 4를 확인하는 풀이이다."
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
      "대입",
      "주기"
    ],
    "condition": [
      "자연수"
    ]
  }
}
```

## 문항 04 (P50-Q16-S3)

### 발문

함수 \$f(x) \= \-x \+ 3\$에 대하여 \$f^1(x) \= f(x)\$, \$f^{n+1}(x) \= (f \\circ f^n)(x)\$ (\$n\$은 자연수)라 정의하자. \$f^{2025}(5)\$의 값은?

### 선지

① \$-2\$ ② \$-1\$ ③ \$0\$ ④ \$3\$ ⑤ \$5\$

### 정답

①

### 해설

\$f^1(5) \= f(5) \= \-5 \+ 3 \= \-2\$ \$f^2(5) \= f(-2) \= \-(-2) \+ 3 \= 5\$ \$f^3(5) \= f(5) \= \-2\$ 따라서 \$f^n(5)\$는 주기가 \$2\$인 수열이고, \$2025\$는 홀수이므로 \$f^{2025}(5) \= f^1(5) \= \-2\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "일차함수의 합성 거듭제곱 함숫값을 구하는 문항이다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "x=5에서 시작해 주기 2를 확인하고 홀수 번째 항을 구하는 풀이이다."
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
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "일차함수",
      "합성함수"
    ],
    "goal": [
      "값"
    ],
    "method": [
      "대입",
      "주기"
    ],
    "condition": [
      "자연수"
    ]
  }
}
```

## 문항 05 (P50-Q17-T1)

### 발문

그림은 함수 \$y \= f(x)\$의 그래프와 직선 \$y \= x\$를 나타낸 것이다. \$(f \\circ f \\circ f \\circ f)(a)\$의 값은? (단, 모든 점선은 좌표축에 평행하다.)

### 선지

① \$a\$ ② \$b\$ ③ \$c\$ ④ \$d\$ ⑤ \$e\$

### 정답

⑤

### 해설

직선 \$y \= x\$와 좌표축에 평행한 점선을 따라 함숫값을 순차적으로 읽으면 \$f(a) \= b\$, \$f(b) \= c\$, \$f(c) \= d\$, \$f(d) \= e\$이다. 따라서 \$(f \\circ f \\circ f \\circ f)(a) \= f(f(f(f(a)))) \= f(f(f(b))) \= f(f(c)) \= f(d) \= e\$이다.

```
{
  "questionPlan": {
    "status": "UNSUPPORTED",
    "reason": "직선 y=x와 곡선 y=f(x) 위에서 f(a)=b, f(b)=c, f(c)=d, f(d)=e가 되도록 좌표축에 평행한 점선이 그려진 그래프 도해가 필요하다."
  },
  "solutionPlan": {
    "status": "UNSUPPORTED",
    "reason": "y=f(x)와 y=x 사이의 계단식 점선 추적 경로를 표시한 그래프 도해가 필요하다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_COMPOSITION",
  "rpm": "H1-RPM-255",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "함수",
      "그래프",
      "직선"
    ],
    "goal": [
      "합성함수",
      "값"
    ],
    "method": [
      "대입"
    ],
    "condition": [
      "실수"
    ]
  }
}
```

## 문항 06 (P50-Q17-S1)

### 발문

그림은 함수 \$y \= f(x)\$의 그래프와 직선 \$y \= x\$를 나타낸 것이다. \$(f \\circ f)(b)\$의 값은? (단, 모든 점선은 좌표축에 평행하다.)

### 선지

① \$a\$ ② \$b\$ ③ \$c\$ ④ \$d\$ ⑤ \$e\$

### 정답

④

### 해설

직선 \$y \= x\$와 좌표축에 평행한 점선을 따라 함숫값을 읽으면 \$f(b) \= c\$이다. 직선 \$y \= x\$를 이용해 \$x \= c\$에서의 함숫값을 읽으면 \$f(c) \= d\$이다. 따라서 \$(f \\circ f)(b) \= f(f(b)) \= f(c) \= d\$이다.

```
{
  "questionPlan": {
    "status": "UNSUPPORTED",
    "reason": "직선 y=x와 곡선 y=f(x) 위에서 f(b)=c, f(c)=d를 읽을 수 있는 좌표축에 평행한 점선 그래프 도해가 필요하다."
  },
  "solutionPlan": {
    "status": "UNSUPPORTED",
    "reason": "b에서 출발해 y=f(x)와 y=x를 거쳐 d에 도달하는 점선 추적 도해가 필요하다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_COMPOSITION",
  "rpm": "H1-RPM-255",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "함수",
      "그래프",
      "직선"
    ],
    "goal": [
      "합성함수",
      "값"
    ],
    "method": [
      "대입"
    ],
    "condition": [
      "실수"
    ]
  }
}
```

## 문항 07 (P50-Q17-S2)

### 발문

그림은 함수 \$y \= f(x)\$의 그래프와 직선 \$y \= x\$를 나타낸 것이다. \$(f^{-1} \\circ f^{-1})(c)\$의 값은? (단, \$f\$는 일대일대응이고 모든 점선은 좌표축에 평행하다.)

### 선지

① \$a\$ ② \$b\$ ③ \$c\$ ④ \$d\$ ⑤ \$e\$

### 정답

①

### 해설

직선 \$y \= x\$와 좌표축에 평행한 점선을 따라 읽으면 \$f(a) \= b\$, \$f(b) \= c\$이다. 따라서 \$f^{-1}(c) \= b\$, \$f^{-1}(b) \= a\$이므로 \$(f^{-1} \\circ f^{-1})(c) \= f^{-1}(f^{-1}(c)) \= f^{-1}(b) \= a\$이다.

```
{
  "questionPlan": {
    "status": "UNSUPPORTED",
    "reason": "직선 y=x와 일대일대응 y=f(x) 위에서 f(a)=b, f(b)=c가 표시된 그래프 도해가 필요하다."
  },
  "solutionPlan": {
    "status": "UNSUPPORTED",
    "reason": "y=c에서 시작해 y=f(x)와 y=x를 거꾸로 추적하여 a에 도달하는 역함수 추적 도해가 필요하다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_INVERSE",
  "rpm": "H1-RPM-258",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "일대일대응",
      "그래프",
      "직선"
    ],
    "goal": [
      "역함수",
      "값"
    ],
    "method": [
      "대입"
    ],
    "condition": [
      "실수"
    ]
  }
}
```

## 문항 08 (P50-Q17-S3)

### 발문

그림은 함수 \$y \= f(x)\$의 그래프와 직선 \$y \= x\$를 나타낸 것이다. \$(f \\circ f \\circ f)(b)\$의 값은? (단, 모든 점선은 좌표축에 평행하다.)

### 선지

① \$a\$ ② \$b\$ ③ \$c\$ ④ \$d\$ ⑤ \$e\$

### 정답

⑤

### 해설

직선 \$y \= x\$와 좌표축에 평행한 점선을 따라 함숫값을 읽으면 \$f(b) \= c\$, \$f(c) \= d\$, \$f(d) \= e\$이다. 따라서 \$(f \\circ f \\circ f)(b) \= f(f(f(b))) \= f(f(c)) \= f(d) \= e\$이다.

```
{
  "questionPlan": {
    "status": "UNSUPPORTED",
    "reason": "직선 y=x와 곡선 y=f(x) 위에서 f(b)=c, f(c)=d, f(d)=e가 표시된 그래프 도해가 필요하다."
  },
  "solutionPlan": {
    "status": "UNSUPPORTED",
    "reason": "b에서 출발해 y=f(x)와 y=x를 세 번 거쳐 e에 도달하는 계단식 추적 도해가 필요하다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_COMPOSITION",
  "rpm": "H1-RPM-255",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "함수",
      "그래프",
      "직선"
    ],
    "goal": [
      "합성함수",
      "값"
    ],
    "method": [
      "대입"
    ],
    "condition": [
      "실수"
    ]
  }
}
```

## 문항 09 (P50-Q18-T1)

### 발문

두 함수 \$f(x) \= 2x \+ a\$, \$g(x) \= 3x \- 6\$에 대하여 \$(g \\circ f)(2) \= 9\$일 때, \$f^{-1}(7)\$의 값은? (단, \$a\$는 상수이다.)

### 선지

① \$2\$ ② \$3\$ ③ \$4\$ ④ \$5\$ ⑤ \$6\$

### 정답

②

### 해설

\$f(2) \= 4 \+ a\$이므로 \$(g \\circ f)(2) \= g(4 \+ a) \= 3(4 \+ a) \- 6 \= 3a \+ 6\$이다. \$3a \+ 6 \= 9\$에서 \$3a \= 3\$, 즉 \$a \= 1\$이므로 \$f(x) \= 2x \+ 1\$이다. \$f^{-1}(7) \= k\$라 하면 \$f(k) \= 7\$이므로 \$2k \+ 1 \= 7\$에서 \$k \= 3\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "합성함수의 조건으로 미정계수를 구한 뒤 역함숫값을 구하는 문항이다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "대입으로 상수 a를 구하고 f(k)=7 방정식을 푸는 대수적 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_INVERSE",
  "rpm": "H1-RPM-256",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "일차함수",
      "합성함수"
    ],
    "goal": [
      "역함수",
      "값"
    ],
    "method": [
      "대입",
      "방정식"
    ],
    "condition": [
      "상수"
    ]
  }
}
```

## 문항 10 (P50-Q18-S1)

### 발문

두 함수 \$f(x) \= 3x \- 1\$, \$g(x) \= 2x \+ a\$에 대하여 \$(g \\circ f)(1) \= 8\$일 때, \$g^{-1}(10)\$의 값은? (단, \$a\$는 상수이다.)

### 선지

① \$1\$ ② \$2\$ ③ \$3\$ ④ \$4\$ ⑤ \$5\$

### 정답

③

### 해설

\$f(1) \= 3(1) \- 1 \= 2\$이므로 \$(g \\circ f)(1) \= g(2) \= 2(2) \+ a \= 4 \+ a\$이다. \$4 \+ a \= 8\$에서 \$a \= 4\$이므로 \$g(x) \= 2x \+ 4\$이다. \$g^{-1}(10) \= k\$라 하면 \$g(k) \= 10\$이므로 \$2k \+ 4 \= 10\$에서 \$k \= 3\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "합성함수의 조건으로 상수를 구한 뒤 역함숫값을 구하는 문항이다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "대입으로 상수 a를 구하고 g(k)=10 방정식을 푸는 대수적 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_INVERSE",
  "rpm": "H1-RPM-256",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "일차함수",
      "합성함수"
    ],
    "goal": [
      "역함수",
      "값"
    ],
    "method": [
      "대입",
      "방정식"
    ],
    "condition": [
      "상수"
    ]
  }
}
```

## 문항 11 (P50-Q18-S2)

### 발문

두 함수 \$f(x) \= x \+ 3\$, \$g(x) \= ax \- 2\$에 대하여 \$(g \\circ f)(1) \= 6\$일 때, \$g^{-1}(4)\$의 값은? (단, \$a\$는 상수이다.)

### 선지

① \$1\$ ② \$2\$ ③ \$3\$ ④ \$4\$ ⑤ \$5\$

### 정답

③

### 해설

\$f(1) \= 1 \+ 3 \= 4\$이므로 \$(g \\circ f)(1) \= g(4) \= 4a \- 2\$이다. \$4a \- 2 \= 6\$에서 \$4a \= 8\$, 즉 \$a \= 2\$이므로 \$g(x) \= 2x \- 2\$이다. \$g^{-1}(4) \= k\$라 하면 \$g(k) \= 4\$이므로 \$2k \- 2 \= 4\$에서 \$k \= 3\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "합성함수의 조건으로 상수를 구한 뒤 역함숫값을 구하는 문항이다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "대입으로 상수 a를 구하고 g(k)=4 방정식을 푸는 대수적 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_INVERSE",
  "rpm": "H1-RPM-256",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "일차함수",
      "합성함수"
    ],
    "goal": [
      "역함수",
      "값"
    ],
    "method": [
      "대입",
      "방정식"
    ],
    "condition": [
      "상수"
    ]
  }
}
```

## 문항 12 (P50-Q19-T1)

### 발문

실수 전체의 집합에서 정의된 함수 \$f(x) \= \|x \- 1\| \+ kx \+ 2\$가 역함수를 갖도록 하는 실수 \$k\$의 값의 범위는?

### 선지

① \$-1 \< k \< 1\$ ② \$-1 \\le k \\le 1\$ ③ \$k \\le \-1\$ 또는 \$k \\ge 1\$ ④ \$k \< \-1\$ 또는 \$k \> 1\$ ⑤ \$k \< \-2\$ 또는 \$k \> 2\$

### 정답

④

### 해설

\$f(x)\$가 역함수를 가지려면 실수 전체의 집합에서 일대일대응이어야 한다. \$x \\ge 1\$일 때 \$f(x) \= (k \+ 1)x \+ 1\$, \$x \< 1\$일 때 \$f(x) \= (k \- 1)x \+ 3\$이다. 이 함수가 계속 증가하거나 계속 감소해야 하므로 두 직선의 기울기의 부호가 같아야 한다. 따라서 \$(k \+ 1)(k \- 1\) \> 0\$이므로 \$k \< \-1\$ 또는 \$k \> 1\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "절댓값 기호가 포함된 구간별 일차함수가 역함수를 가질 조건을 구하는 문항이다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "x=1을 경계로 나눈 두 직선의 기울기 곱이 양수인 부등식을 푸는 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_INVERSE",
  "rpm": "H1-RPM-256",
  "difficultyBucket": 3,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "함수",
      "절댓값"
    ],
    "goal": [
      "범위"
    ],
    "method": [
      "일대일대응",
      "기울기",
      "부등식"
    ],
    "condition": [
      "실수"
    ]
  }
}
```

## 문항 13 (P50-Q19-S1)

### 발문

실수 전체의 집합에서 정의된 함수 \$f(x) \= 2\|x\| \+ ax \+ 1\$의 역함수가 존재하도록 하는 실수 \$a\$의 값의 범위는?

### 선지

① \$-2 \< a \< 2\$ ② \$a \\le \-2\$ 또는 \$a \\ge 2\$ ③ \$a \< \-1\$ 또는 \$a \> 1\$ ④ \$-1 \< a \< 1\$ ⑤ \$a \< \-2\$ 또는 \$a \> 2\$

### 정답

⑤

### 해설

\$f(x)\$의 역함수가 존재하려면 실수 전체의 집합에서 일대일대응이어야 한다. \$x \\ge 0\$일 때 \$f(x) \= (a \+ 2)x \+ 1\$, \$x \< 0\$일 때 \$f(x) \= (a \- 2)x \+ 1\$이다. 두 반직선의 기울기의 부호가 같아야 하므로 \$(a \+ 2)(a \- 2\) \> 0\$이다. 따라서 \$a \< \-2\$ 또는 \$a \> 2\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "절댓값 기호가 포함된 함수의 역함수 존재 조건을 구하는 문항이다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "x=0을 경계로 나눈 두 직선의 기울기 곱이 양수인 부등식을 푸는 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_INVERSE",
  "rpm": "H1-RPM-256",
  "difficultyBucket": 3,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "함수",
      "절댓값"
    ],
    "goal": [
      "범위"
    ],
    "method": [
      "일대일대응",
      "기울기",
      "부등식"
    ],
    "condition": [
      "실수"
    ]
  }
}
```

## 문항 14 (P50-Q19-S2)

### 발문

실수 전체의 집합에서 정의된 함수 \$f(x) \= \|2x \- 6\| \+ ax \+ 5\$의 역함수가 존재하지 않도록 하는 정수 \$a\$의 개수는?

### 선지

① \$5\$개 ② \$6\$개 ③ \$7\$개 ④ \$8\$개 ⑤ \$9\$개

### 정답

①

### 해설

\$x \\ge 3\$일 때 \$f(x) \= (a \+ 2)x \- 1\$, \$x \< 3\$일 때 \$f(x) \= (a \- 2)x \+ 11\$이다. \$f(x)\$가 역함수를 갖기 위한 조건은 두 기울기의 부호가 같은 \$(a \+ 2)(a \- 2\) \> 0\$이다. 따라서 역함수가 존재하지 않도록 하는 \$a\$의 범위는 \$(a \+ 2)(a \- 2\) \\le 0\$, 즉 \$-2 \\le a \\le 2\$이다. 이를 만족하는 정수 \$a\$는 \$-2, \-1, 0, 1, 2\$이므로 개수는 \$5\$개이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "절댓값 기호가 포함된 함수의 역함수가 존재하지 않을 정수 조건 개수를 구하는 문항이다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "x=3을 경계로 나눈 기울기 곱이 0 이하인 부등식을 푸는 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_INVERSE",
  "rpm": "H1-RPM-256",
  "difficultyBucket": 3,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "함수",
      "절댓값"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "일대일대응",
      "기울기",
      "부등식"
    ],
    "condition": [
      "실수",
      "정수"
    ]
  }
}
```

## 문항 15 (P50-Q20-T1)

### 발문

일차함수 \$f(x) \= \\dfrac{1}{3}x \- 2\$의 역함수가 \$g(x) \= ax \+ b\$일 때, \$a \+ b\$의 값은? (단, \$a\$, \$b\$는 상수이다.)

### 선지

① \$8\$ ② \$9\$ ③ \$10\$ ④ \$11\$ ⑤ \$12\$

### 정답

②

### 해설

\$y \= \\dfrac{1}{3}x \- 2\$를 \$x\$에 대하여 풀면 \$\\dfrac{1}{3}x \= y \+ 2\$, 즉 \$x \= 3y \+ 6\$이다. \$x\$와 \$y\$를 서로 바꾸면 역함수는 \$y \= 3x \+ 6\$이므로 \$a \= 3\$, \$b \= 6\$이다. 따라서 \$a \+ b \= 3 \+ 6 \= 9\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "일차함수의 역함수를 직접 구해 계수의 합을 구하는 문항이다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "x에 대하여 풀고 x, y를 바꾸어 역함수의 계수를 구하는 대수적 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_INVERSE",
  "rpm": "H1-RPM-257",
  "difficultyBucket": 1,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "일차함수"
    ],
    "goal": [
      "역함수",
      "값"
    ],
    "method": [
      "방정식"
    ],
    "condition": [
      "상수"
    ]
  }
}
```

## 문항 16 (P50-Q20-S1)

### 발문

일차함수 \$f(x) \= 2x \- 4\$의 역함수를 \$g(x) \= ax \+ b\$라 할 때, \$ab\$의 값은? (단, \$a\$, \$b\$는 상수이다.)

### 선지

① \$1\$ ② \$2\$ ③ \$3\$ ④ \$4\$ ⑤ \$5\$

### 정답

①

### 해설

\$y \= 2x \- 4\$를 \$x\$에 대하여 풀면 \$2x \= y \+ 4\$, 즉 \$x \= \\dfrac{1}{2}y \+ 2\$이다. \$x\$와 \$y\$를 서로 바꾸면 역함수는 \$y \= \\dfrac{1}{2}x \+ 2\$이므로 \$a \= \\dfrac{1}{2}\$, \$b \= 2\$이다. 따라서 \$ab \= \\dfrac{1}{2} \\times 2 \= 1\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "일차함수의 역함수를 구해 두 계수의 곱을 구하는 문항이다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "x에 대하여 풀고 x, y를 바꾸어 역함수의 계수를 구하는 대수적 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_INVERSE",
  "rpm": "H1-RPM-257",
  "difficultyBucket": 1,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "일차함수"
    ],
    "goal": [
      "역함수",
      "값"
    ],
    "method": [
      "방정식"
    ],
    "condition": [
      "상수"
    ]
  }
}
```

## 문항 17 (P50-Q20-S2)

### 발문

일차함수 \$f(x) \= \\dfrac{1}{2}x \- 1\$의 역함수를 \$g(x) \= ax \+ b\$라 할 때, \$a \+ b\$의 값은? (단, \$a\$, \$b\$는 상수이다.)

### 선지

① \$2\$ ② \$3\$ ③ \$4\$ ④ \$5\$ ⑤ \$6\$

### 정답

③

### 해설

\$y \= \\dfrac{1}{2}x \- 1\$을 \$x\$에 대하여 풀면 \$\\dfrac{1}{2}x \= y \+ 1\$, 즉 \$x \= 2y \+ 2\$이다. \$x\$와 \$y\$를 서로 바꾸면 역함수는 \$y \= 2x \+ 2\$이므로 \$a \= 2\$, \$b \= 2\$이다. 따라서 \$a \+ b \= 2 \+ 2 \= 4\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "일차함수의 역함수를 구해 두 계수의 합을 구하는 문항이다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "x에 대하여 풀고 x, y를 바꾸어 역함수의 계수를 구하는 대수적 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_INVERSE",
  "rpm": "H1-RPM-257",
  "difficultyBucket": 1,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "일차함수"
    ],
    "goal": [
      "역함수",
      "값"
    ],
    "method": [
      "방정식"
    ],
    "condition": [
      "상수"
    ]
  }
}
```

## 문항 18 (P50-Q21-T1)

### 발문

두 함수 \$f(x) \= 2x \+ 3\$, \$g(x) \= x \- 2\$에 대하여 \$(g \\circ f)^{-1}(7)\$의 값은?

### 선지

① \$0\$ ② \$1\$ ③ \$2\$ ④ \$3\$ ⑤ \$4\$

### 정답

④

### 해설

\$(g \\circ f)^{-1}(7) \= k\$라 하면 \$(g \\circ f)(k) \= 7\$이다. \$g(f(k)) \= (2k \+ 3\) \- 2 \= 2k \+ 1\$이므로 \$2k \+ 1 \= 7\$에서 \$2k \= 6\$, 즉 \$k \= 3\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "합성함수의 역함숫값을 구하는 문항이다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "역함수의 정의에 의해 g(f(k))=7 방정식을 푸는 대수적 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_INVERSE",
  "rpm": "H1-RPM-257",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "일차함수",
      "합성함수"
    ],
    "goal": [
      "역함수",
      "값"
    ],
    "method": [
      "대입",
      "방정식"
    ],
    "condition": [
      "실수"
    ]
  }
}
```

## 문항 19 (P50-Q21-S1)

### 발문

두 함수 \$f(x) \= 2x \- 1\$, \$g(x) \= 2x \+ 3\$에 대하여 \$(f^{-1} \\circ g^{-1})(9)\$의 값은?

### 선지

① \$-2\$ ② \$-1\$ ③ \$0\$ ④ \$1\$ ⑤ \$2\$

### 정답

⑤

### 해설

\$g^{-1}(9) \= a\$라 하면 \$g(a) \= 9\$이므로 \$2a \+ 3 \= 9\$에서 \$a \= 3\$이다. \$f^{-1}(3) \= b\$라 하면 \$f(b) \= 3\$이므로 \$2b \- 1 \= 3\$에서 \$b \= 2\$이다. 따라서 \$(f^{-1} \\circ g^{-1})(9) \= f^{-1}(g^{-1}(9)) \= f^{-1}(3) \= 2\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "두 역함수의 합성 함숫값을 구하는 문항이다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "역함수의 정의를 순차 적용해 일차방정식을 푸는 대수적 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_INVERSE",
  "rpm": "H1-RPM-257",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "일차함수",
      "역함수"
    ],
    "goal": [
      "합성함수",
      "값"
    ],
    "method": [
      "방정식"
    ],
    "condition": [
      "실수"
    ]
  }
}
```

## 문항 20 (P50-Q21-S2)

### 발문

두 함수 \$f(x) \= x \- 1\$, \$g(x) \= 3x \- 1\$에 대하여 \$(f^{-1} \\circ g^{-1})(8)\$의 값은?

### 선지

① \$3\$ ② \$4\$ ③ \$5\$ ④ \$6\$ ⑤ \$7\$

### 정답

②

### 해설

\$g^{-1}(8) \= a\$라 하면 \$g(a) \= 8\$이므로 \$3a \- 1 \= 8\$에서 \$a \= 3\$이다. \$f^{-1}(3) \= b\$라 하면 \$f(b) \= 3\$이므로 \$b \- 1 \= 3\$에서 \$b \= 4\$이다. 따라서 \$(f^{-1} \\circ g^{-1})(8) \= f^{-1}(g^{-1}(8)) \= f^{-1}(3) \= 4\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "두 역함수의 합성 함숫값을 구하는 문항이다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "역함수의 정의를 순차 적용해 일차방정식을 푸는 대수적 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_INVERSE",
  "rpm": "H1-RPM-257",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "일차함수",
      "역함수"
    ],
    "goal": [
      "합성함수",
      "값"
    ],
    "method": [
      "방정식"
    ],
    "condition": [
      "실수"
    ]
  }
}
```

## 문항 21 (P51-Q22-T1)

### 발문

그림과 같이 집합 \$X \= {1, 2, 3, 4, 5}\$에서 \$X\$로의 두 일대일대응 \$f\$, \$g\$가 주어질 때, \$(f \\circ g^{-1})(4)\$의 값은?

### 선지

① \$1\$ ② \$2\$ ③ \$3\$ ④ \$4\$ ⑤ \$5\$

### 정답

⑤

### 해설

주어진 대응 그림에서 \$g(2) \= 4\$이므로 \$g^{-1}(4) \= 2\$이다. 또한 \$f(2) \= 5\$이다. 따라서 \$(f \\circ g^{-1})(4) \= f(g^{-1}(4)) \= f(2) \= 5\$이다.

```
{
  "questionPlan": {
    "status": "UNSUPPORTED",
    "reason": "집합 X={1,2,3,4,5} 사이의 두 일대일대응 f(1->3, 2->5, 3->1, 4->2, 5->4), g(1->2, 2->4, 3->5, 4->1, 5->3)의 화살표 대응 다이어그램이 필요하다."
  },
  "solutionPlan": {
    "status": "UNSUPPORTED",
    "reason": "대응 그림에서 g^{-1}(4)=2와 f(2)=5를 역추적 및 정방향 추적하는 화살표 도해가 필요하다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_INVERSE",
  "rpm": "H1-RPM-258",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "집합",
      "일대일대응"
    ],
    "goal": [
      "합성함수",
      "역함수",
      "값"
    ],
    "method": [
      "대입"
    ],
    "condition": [
      "자연수"
    ]
  }
}
```

## 문항 22 (P51-Q22-S1)

### 발문

그림과 같이 집합 \$X \= {1, 2, 3, 4, 5}\$에서 \$X\$로의 두 일대일대응 \$f\$, \$g\$에 대하여 \$(g^{-1} \\circ f)(3)\$의 값은?

### 선지

① \$1\$ ② \$2\$ ③ \$3\$ ④ \$4\$ ⑤ \$5\$

### 정답

④

### 해설

주어진 대응 그림에서 \$f(3) \= 1\$이다. \$g(4) \= 1\$이므로 \$g^{-1}(1) \= 4\$이다. 따라서 \$(g^{-1} \\circ f)(3) \= g^{-1}(f(3)) \= g^{-1}(1) \= 4\$이다.

```
{
  "questionPlan": {
    "status": "UNSUPPORTED",
    "reason": "집합 X={1,2,3,4,5} 사이의 두 일대일대응 f(1->3, 2->5, 3->1, 4->2, 5->4), g(1->2, 2->4, 3->5, 4->1, 5->3)의 화살표 대응 다이어그램이 필요하다."
  },
  "solutionPlan": {
    "status": "UNSUPPORTED",
    "reason": "f(3)=1을 거쳐 g^{-1}(1)=4로 연결되는 대응 추적 도해가 필요하다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_INVERSE",
  "rpm": "H1-RPM-258",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "집합",
      "일대일대응"
    ],
    "goal": [
      "합성함수",
      "역함수",
      "값"
    ],
    "method": [
      "대입"
    ],
    "condition": [
      "자연수"
    ]
  }
}
```

## 문항 23 (P51-Q22-S2)

### 발문

그림과 같이 집합 \$X \= {1, 2, 3, 4, 5}\$에서 \$X\$로의 두 일대일대응 \$f\$, \$g\$에 대하여 \$(f^{-1} \\circ g^{-1})(5)\$의 값은?

### 선지

① \$1\$ ② \$2\$ ③ \$3\$ ④ \$4\$ ⑤ \$5\$

### 정답

①

### 해설

주어진 대응 그림에서 \$g(3) \= 5\$이므로 \$g^{-1}(5) \= 3\$이다. 또한 \$f(1) \= 3\$이므로 \$f^{-1}(3) \= 1\$이다. 따라서 \$(f^{-1} \\circ g^{-1})(5) \= f^{-1}(g^{-1}(5)) \= f^{-1}(3) \= 1\$이다.

```
{
  "questionPlan": {
    "status": "UNSUPPORTED",
    "reason": "집합 X={1,2,3,4,5} 사이의 두 일대일대응 f(1->3, 2->5, 3->1, 4->2, 5->4), g(1->2, 2->4, 3->5, 4->1, 5->3)의 화살표 대응 다이어그램이 필요하다."
  },
  "solutionPlan": {
    "status": "UNSUPPORTED",
    "reason": "g^{-1}(5)=3에서 f^{-1}(3)=1로 역추적하는 화살표 도해가 필요하다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_INVERSE",
  "rpm": "H1-RPM-258",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "집합",
      "일대일대응"
    ],
    "goal": [
      "합성함수",
      "역함수",
      "값"
    ],
    "method": [
      "대입"
    ],
    "condition": [
      "자연수"
    ]
  }
}
```

## 문항 24 (P51-Q22-S3)

### 발문

그림과 같이 집합 \$X \= {1, 2, 3, 4, 5}\$에서 \$X\$로의 두 일대일대응 \$f\$, \$g\$에 대하여 \$(g \\circ f^{-1})(4)\$의 값은?

### 선지

① \$1\$ ② \$2\$ ③ \$3\$ ④ \$4\$ ⑤ \$5\$

### 정답

③

### 해설

주어진 대응 그림에서 \$f(5) \= 4\$이므로 \$f^{-1}(4) \= 5\$이다. 또한 \$g(5) \= 3\$이다. 따라서 \$(g \\circ f^{-1})(4) \= g(f^{-1}(4)) \= g(5) \= 3\$이다.

```
{
  "questionPlan": {
    "status": "UNSUPPORTED",
    "reason": "집합 X={1,2,3,4,5} 사이의 두 일대일대응 f(1->3, 2->5, 3->1, 4->2, 5->4), g(1->2, 2->4, 3->5, 4->1, 5->3)의 화살표 대응 다이어그램이 필요하다."
  },
  "solutionPlan": {
    "status": "UNSUPPORTED",
    "reason": "f^{-1}(4)=5를 거쳐 g(5)=3으로 이어지는 대응 추적 도해가 필요하다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_INVERSE",
  "rpm": "H1-RPM-258",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "집합",
      "일대일대응"
    ],
    "goal": [
      "합성함수",
      "역함수",
      "값"
    ],
    "method": [
      "대입"
    ],
    "condition": [
      "자연수"
    ]
  }
}
```

## 문항 25 (P51-Q23-T1)

### 발문

그림은 함수 \$y \= f(x)\$의 그래프와 직선 \$y \= x\$를 나타낸 것이다. \$(f^{-1} \\circ f^{-1})(d)\$의 값은? (단, \$f\$는 일대일대응이고 모든 점선은 좌표축에 평행하다.)

### 선지

① \$a\$ ② \$b\$ ③ \$c\$ ④ \$d\$ ⑤ \$e\$

### 정답

②

### 해설

직선 \$y \= x\$와 좌표축에 평행한 점선을 따라 읽으면 \$f(b) \= c\$, \$f(c) \= d\$이다. 따라서 \$f^{-1}(d) \= c\$, \$f^{-1}(c) \= b\$이므로 \$(f^{-1} \\circ f^{-1})(d) \= f^{-1}(f^{-1}(d)) \= f^{-1}(c) \= b\$이다.

```
{
  "questionPlan": {
    "status": "UNSUPPORTED",
    "reason": "직선 y=x와 일대일대응 y=f(x) 위에서 f(b)=c, f(c)=d가 표시된 그래프 도해가 필요하다."
  },
  "solutionPlan": {
    "status": "UNSUPPORTED",
    "reason": "y=d에서 시작해 y=f(x)와 y=x를 거꾸로 추적하여 b에 도달하는 역함수 추적 도해가 필요하다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_INVERSE",
  "rpm": "H1-RPM-258",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "일대일대응",
      "그래프",
      "직선"
    ],
    "goal": [
      "역함수",
      "값"
    ],
    "method": [
      "대입"
    ],
    "condition": [
      "실수"
    ]
  }
}
```

