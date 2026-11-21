# APPROVED\_20261025\_1910\_BATCH09\_HA\_part1\_유형풀

```
{
  "sourceBatchId": "APPROVED_20261025_1910_BATCH09_HA_50ITEMS",
  "sourceFile": "06_APPROVED_BANK_20261025_1910.json",
  "sourceTitle": "백발백중_공통수학2(하) (2022개정).pdf",
  "section": "Ⅲ. 함수와 그래프 1. 함수 Best 1회 후반 & Best 2회 전반 (46~49쪽 4페이지 전수 - 공통수학2(하))",
  "part": "part1",
  "itemRange": "1-25",
  "itemCount": 25,
  "answerPoolOffsetStart": 1000,
  "answerPoolOffsetEnd": 1025,
  "curriculum": "2022",
  "standardCourse": "공통수학2"
}
```

## 문항 01 (P46-Q21-T1)

### 발문

두 일차함수 \$f(x) \= 3x \- 2\$, \$g(x) \= 2x \+ 1\$에 대하여 \$(f \\circ (g \\circ f)^{-1} \\circ g)(a) \= 5\$를 만족시키는 상수 \$a\$의 값은?

### 선지

① \$3\$ ② \$4\$ ③ \$5\$ ④ \$6\$ ⑤ \$7\$

### 정답

③

### 해설

합성함수의 역함수 성질에 의해 \$(g \\circ f)^{-1} \= f^{-1} \\circ g^{-1}\$이다. \$(f \\circ (g \\circ f)^{-1} \\circ g)(a) \= (f \\circ f^{-1} \\circ g^{-1} \\circ g)(a) \= a\$이다. 따라서 \$a \= 5\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "합성함수의 역함수 성질을 이용해 항등함수로 간소화되는 함숫값 방정식을 푸는 문항이다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "(g∘f)^(-1) = f^(-1)∘g^(-1)을 적용해 식을 항등함수로 줄이는 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_INVERSE",
  "rpm": "H1-RPM-260",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "함수"
    ],
    "goal": [
      "상수",
      "값"
    ],
    "method": [
      "대입"
    ],
    "condition": [
      "상수"
    ]
  }
}
```

## 문항 02 (P46-Q21-S1)

### 발문

두 함수 \$f(x) \= 2x \- 3\$, \$g(x) \= 4x \+ 1\$에 대하여 \$(g \\circ (f \\circ g)^{-1} \\circ f)(a) \= 2\$를 만족시키는 상수 \$a\$의 값은?

### 선지

① \$-2\$ ② \$-1\$ ③ \$0\$ ④ \$1\$ ⑤ \$2\$

### 정답

⑤

### 해설

합성함수의 역함수 성질에 의해 \$(f \\circ g)^{-1} \= g^{-1} \\circ f^{-1}\$이다. \$(g \\circ (f \\circ g)^{-1} \\circ f)(a) \= (g \\circ g^{-1} \\circ f^{-1} \\circ f)(a) \= a\$이다. 따라서 \$a \= 2\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "합성함수의 역함수 성질을 이용해 미지수를 구하는 문항이다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "(f∘g)^(-1) = g^(-1)∘f^(-1)을 적용해 식을 항등함수로 줄이는 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_INVERSE",
  "rpm": "H1-RPM-260",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "함수"
    ],
    "goal": [
      "상수",
      "값"
    ],
    "method": [
      "대입"
    ],
    "condition": [
      "상수"
    ]
  }
}
```

## 문항 03 (P46-Q21-S2)

### 발문

두 일차함수 \$f(x) \= 2x \- 5\$, \$g(x) \= \-x \+ 2\$에 대하여 \$((g \\circ f)^{-1} \\circ g)(k) \= 3\$일 때, 상수 \$k\$의 값은?

### 선지

① \$1\$ ② \$2\$ ③ \$3\$ ④ \$4\$ ⑤ \$5\$

### 정답

①

### 해설

\$(g \\circ f)^{-1} \= f^{-1} \\circ g^{-1}\$이므로 \$((g \\circ f)^{-1} \\circ g)(k) \= (f^{-1} \\circ g^{-1} \\circ g)(k) \= f^{-1}(k)\$이다. \$f^{-1}(k) \= 3\$에서 \$k \= f(3) \= 2(3) \- 5 \= 1\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "합성함수의 역함수를 간소화하여 역함숫값 조건을 만족시키는 상수를 구하는 문항이다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "식을 f^(-1)(k) = 3으로 정리한 뒤 k = f(3)을 계산하는 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_INVERSE",
  "rpm": "H1-RPM-260",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "함수"
    ],
    "goal": [
      "상수",
      "값"
    ],
    "method": [
      "대입"
    ],
    "condition": [
      "상수"
    ]
  }
}
```

## 문항 04 (P46-Q22-T1)

### 발문

두 함수 \$f(x) \= 2x \+ 3\$, \$g(x) \= \-x \+ 4\$에 대하여 \$(f \\circ (g \\circ f)^{-1})(2)\$의 값은?

### 선지

① \$-1\$ ② \$0\$ ③ \$1\$ ④ \$2\$ ⑤ \$3\$

### 정답

④

### 해설

\$(g \\circ f)^{-1} \= f^{-1} \\circ g^{-1}\$이므로 \$(f \\circ (g \\circ f)^{-1})(2) \= (f \\circ f^{-1} \\circ g^{-1})(2) \= g^{-1}(2)\$이다. \$g^{-1}(2) \= k\$라 하면 \$g(k) \= \-k \+ 4 \= 2\$이므로 \$k \= 2\$이다. 따라서 \$(f \\circ (g \\circ f)^{-1})(2) \= 2\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "합성함수의 역함수를 포함한 식의 함숫값을 구하는 문항이다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "식을 g^(-1)(2)로 간소화한 뒤 g(k) = 2를 푸는 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_INVERSE",
  "rpm": "H1-RPM-260",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "함수"
    ],
    "goal": [
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

## 문항 05 (P46-Q22-S1)

### 발문

두 함수 \$f(x) \= 3x \- 1\$, \$g(x) \= 2x \+ 5\$에 대하여 \$((f \\circ g)^{-1} \\circ f)(11)\$의 값은?

### 선지

① \$2\$ ② \$3\$ ③ \$4\$ ④ \$5\$ ⑤ \$6\$

### 정답

②

### 해설

\$(f \\circ g)^{-1} \= g^{-1} \\circ f^{-1}\$이므로 \$((f \\circ g)^{-1} \\circ f)(11) \= (g^{-1} \\circ f^{-1} \\circ f)(11) \= g^{-1}(11)\$이다. \$g^{-1}(11) \= k\$라 하면 \$g(k) \= 2k \+ 5 \= 11\$에서 \$2k \= 6\$, 즉 \$k \= 3\$이다. 따라서 \$((f \\circ g)^{-1} \\circ f)(11) \= 3\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "합성함수의 역함수를 포함한 식의 함숫값을 구하는 문항이다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "식을 g^(-1)(11)로 간소화한 뒤 g(k) = 11을 푸는 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_INVERSE",
  "rpm": "H1-RPM-260",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "함수"
    ],
    "goal": [
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

## 문항 06 (P46-Q22-S2)

### 발문

두 함수 \$f(x) \= 2x \- 3\$, \$g(x) \= \-x \+ 1\$에 대하여 \$((g \\circ f)^{-1} \\circ g)(7)\$의 값은?

### 선지

① \$4\$ ② \$5\$ ③ \$6\$ ④ \$7\$ ⑤ \$8\$

### 정답

②

### 해설

\$(g \\circ f)^{-1} \= f^{-1} \\circ g^{-1}\$이므로 \$((g \\circ f)^{-1} \\circ g)(7) \= (f^{-1} \\circ g^{-1} \\circ g)(7) \= f^{-1}(7)\$이다. \$f^{-1}(7) \= k\$라 하면 \$f(k) \= 2k \- 3 \= 7\$에서 \$2k \= 10\$, 즉 \$k \= 5\$이다. 따라서 \$((g \\circ f)^{-1} \\circ g)(7) \= 5\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "합성함수의 역함수를 포함한 식의 함숫값을 구하는 문항이다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "식을 f^(-1)(7)로 간소화한 뒤 f(k) = 7을 푸는 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_INVERSE",
  "rpm": "H1-RPM-260",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "함수"
    ],
    "goal": [
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

## 문항 07 (P46-Q23-T1)

### 발문

그림은 함수 \$y \= f(x)\$의 그래프와 직선 \$y \= x\$를 나타낸 것이다. \$(f^{-1} \\circ f^{-1} \\circ f^{-1})(d)\$의 값은? (단, 모든 점선은 좌표축에 평행하다.)

### 선지

① \$b\$ ② \$c\$ ③ \$d\$ ④ \$a\$ ⑤ \$e\$

### 정답

④

### 해설

그래프와 직선 \$y \= x\$를 따라 눈금을 읽으면 \$f(a) \= b\$, \$f(b) \= c\$, \$f(c) \= d\$이다. 따라서 \$f^{-1}(d) \= c\$, \$f^{-1}(c) \= b\$, \$f^{-1}(b) \= a\$이다. 그러므로 \$(f^{-1} \\circ f^{-1} \\circ f^{-1})(d) \= f^{-1}(f^{-1}(c)) \= f^{-1}(b) \= a\$이다.

```
{
  "questionPlan": {
    "status": "UNSUPPORTED",
    "reason": "제1사분면에 직선 y=x와 증가하는 곡선 y=f(x)를 그리고, x축과 y축에 눈금 a < b < c < d < e를 점선으로 연결해 f(a)=b, f(b)=c, f(c)=d, f(d)=e가 읽히도록 작도한다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "그래프와 직선 y=x를 이용해 d → c → b → a 순으로 역함숫값을 추적하는 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_INVERSE",
  "rpm": "H1-RPM-259",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "함수",
      "직선"
    ],
    "goal": [
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

## 문항 08 (P46-Q23-S1)

### 발문

그림은 함수 \$y \= f(x)\$의 그래프와 직선 \$y \= x\$를 나타낸 것이다. \$(f^{-1} \\circ f^{-1})(d)\$의 값은? (단, 모든 점선은 좌표축에 평행하다.)

### 선지

① \$a\$ ② \$c\$ ③ \$d\$ ④ \$e\$ ⑤ \$b\$

### 정답

⑤

### 해설

그래프와 직선 \$y \= x\$를 따라 눈금을 읽으면 \$f(c) \= d\$, \$f(b) \= c\$이므로 \$f^{-1}(d) \= c\$, \$f^{-1}(c) \= b\$이다. 따라서 \$(f^{-1} \\circ f^{-1})(d) \= f^{-1}(c) \= b\$이다.

```
{
  "questionPlan": {
    "status": "UNSUPPORTED",
    "reason": "제1사분면에 직선 y=x와 증가하는 곡선 y=f(x)를 그리고, x축과 y축에 눈금 a < b < c < d < e를 점선으로 연결해 f(a)=b, f(b)=c, f(c)=d, f(d)=e가 읽히도록 작도한다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "그래프와 직선 y=x를 이용해 d → c → b 순으로 역함숫값을 추적하는 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_INVERSE",
  "rpm": "H1-RPM-259",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "함수",
      "직선"
    ],
    "goal": [
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

## 문항 09 (P46-Q23-S2)

### 발문

그림은 함수 \$y \= f(x)\$의 그래프와 직선 \$y \= x\$를 나타낸 것이다. \$(f^{-1} \\circ f^{-1} \\circ f^{-1})(e)\$의 값은? (단, 모든 점선은 좌표축에 평행하다.)

### 선지

① \$b\$ ② \$a\$ ③ \$c\$ ④ \$d\$ ⑤ \$e\$

### 정답

①

### 해설

그래프와 직선 \$y \= x\$를 따라 눈금을 읽으면 \$f(d) \= e\$, \$f(c) \= d\$, \$f(b) \= c\$이므로 \$f^{-1}(e) \= d\$, \$f^{-1}(d) \= c\$, \$f^{-1}(c) \= b\$이다. 따라서 \$(f^{-1} \\circ f^{-1} \\circ f^{-1})(e) \= f^{-1}(f^{-1}(d)) \= f^{-1}(c) \= b\$이다.

```
{
  "questionPlan": {
    "status": "UNSUPPORTED",
    "reason": "제1사분면에 직선 y=x와 증가하는 곡선 y=f(x)를 그리고, x축과 y축에 눈금 a < b < c < d < e를 점선으로 연결해 f(a)=b, f(b)=c, f(c)=d, f(d)=e가 읽히도록 작도한다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "그래프와 직선 y=x를 이용해 e → d → c → b 순으로 역함숫값을 추적하는 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_INVERSE",
  "rpm": "H1-RPM-259",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "함수",
      "직선"
    ],
    "goal": [
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

## 문항 10 (P46-Q24-T1)

### 발문

함수 \$f(x) \= \\dfrac{1}{2}x \+ 3\$의 그래프와 그 역함수 \$y \= g(x)\$의 그래프의 교점을 \$\\mathrm{A}\$, 두 함수 \$y \= f(x)\$와 \$y \= g(x)\$의 그래프의 \$y\$절편을 각각 \$\\mathrm{B}\$, \$\\mathrm{C}\$라 할 때, 삼각형 \$\\mathrm{ABC}\$의 넓이는?

### 선지

① \$21\$ ② \$24\$ ③ \$27\$ ④ \$30\$ ⑤ \$33\$

### 정답

③

### 해설

함수 \$y \= f(x)\$와 그 역함수 \$y \= g(x)\$의 그래프의 교점 \$\\mathrm{A}\$는 직선 \$y \= x\$ 위에 있으므로 \$\\dfrac{1}{2}x \+ 3 \= x\$에서 \$x \= 6\$, 즉 \$\\mathrm{A}(6, 6)\$이다. \$f(x)\$의 \$y\$절편은 \$\\mathrm{B}(0, 3)\$이다. \$y \= \\dfrac{1}{2}x \+ 3\$에서 \$x \= 2y \- 6\$이므로 역함수는 \$g(x) \= 2x \- 6\$이고, \$y\$절편은 \$\\mathrm{C}(0, \-6)\$이다. 따라서 밑변 \$\\overline{\\mathrm{BC}} \= 3 \- (-6) \= 9\$, 높이가 \$6\$이므로 삼각형 \$\\mathrm{ABC}\$의 넓이는 \$\\dfrac{1}{2} \\times 9 \\times 6 \= 27\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "일차함수와 그 역함수의 교점 및 두 y절편으로 이루어진 삼각형의 넓이를 구하는 문항이다."
  },
  "solutionPlan": {
    "status": "UNSUPPORTED",
    "reason": "좌표평면 위에 y=1/2x+3, y=2x-6, y=x의 그래프와 교점 A(6, 6), y절편 B(0, 3), C(0, -6)으로 이루어진 삼각형 ABC를 나타낸 도해가 필요하다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_INVERSE",
  "rpm": "H1-RPM-260",
  "difficultyBucket": 3,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "함수",
      "y절편"
    ],
    "goal": [
      "넓이"
    ],
    "method": [
      "교점",
      "연립방정식"
    ],
    "condition": [
      "실수"
    ]
  }
}
```

## 문항 11 (P46-Q24-S1)

### 발문

함수 \$f(x) \= \\dfrac{1}{2}x \+ 2\$의 그래프와 그 역함수 \$y \= g(x)\$의 그래프의 교점을 \$\\mathrm{A}\$, 두 함수 \$y \= f(x)\$와 \$y \= g(x)\$의 그래프의 \$y\$절편을 각각 \$\\mathrm{B}\$, \$\\mathrm{C}\$라 할 때, 삼각형 \$\\mathrm{ABC}\$의 넓이는?

### 선지

① \$9\$ ② \$10\$ ③ \$11\$ ④ \$12\$ ⑤ \$13\$

### 정답

④

### 해설

교점 \$\\mathrm{A}\$는 직선 \$y \= x\$ 위에 있으므로 \$\\dfrac{1}{2}x \+ 2 \= x\$에서 \$x \= 4\$, 즉 \$\\mathrm{A}(4, 4)\$이다. \$f(x)\$의 \$y\$절편은 \$\\mathrm{B}(0, 2)\$이고, 역함수 \$g(x) \= 2x \- 4\$의 \$y\$절편은 \$\\mathrm{C}(0, \-4)\$이다. 따라서 밑변 \$\\overline{\\mathrm{BC}} \= 2 \- (-4) \= 6\$, 높이가 \$4\$이므로 삼각형 \$\\mathrm{ABC}\$의 넓이는 \$\\dfrac{1}{2} \\times 6 \\times 4 \= 12\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "일차함수와 그 역함수의 교점 및 두 y절편으로 이루어진 삼각형의 넓이를 구하는 문항이다."
  },
  "solutionPlan": {
    "status": "UNSUPPORTED",
    "reason": "좌표평면 위에 y=1/2x+2, y=2x-4, y=x의 그래프와 삼각형 ABC를 나타낸 도해가 필요하다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_INVERSE",
  "rpm": "H1-RPM-260",
  "difficultyBucket": 3,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "함수",
      "y절편"
    ],
    "goal": [
      "넓이"
    ],
    "method": [
      "교점",
      "연립방정식"
    ],
    "condition": [
      "실수"
    ]
  }
}
```

## 문항 12 (P46-Q24-S2)

### 발문

함수 \$f(x) \= \\dfrac{1}{3}x \+ 2\$의 그래프와 그 역함수 \$y \= g(x)\$의 그래프의 교점을 \$\\mathrm{A}\$, 두 함수 \$y \= f(x)\$와 \$y \= g(x)\$의 그래프의 \$y\$절편을 각각 \$\\mathrm{B}\$, \$\\mathrm{C}\$라 할 때, 삼각형 \$\\mathrm{ABC}\$의 넓이는?

### 선지

① \$10\$ ② \$12\$ ③ \$14\$ ④ \$16\$ ⑤ \$18\$

### 정답

②

### 해설

교점 \$\\mathrm{A}\$는 직선 \$y \= x\$ 위에 있으므로 \$\\dfrac{1}{3}x \+ 2 \= x\$에서 \$\\dfrac{2}{3}x \= 2\$, 즉 \$x \= 3\$이므로 \$\\mathrm{A}(3, 3)\$이다. \$f(x)\$의 \$y\$절편은 \$\\mathrm{B}(0, 2)\$이고, 역함수 \$g(x) \= 3x \- 6\$의 \$y\$절편은 \$\\mathrm{C}(0, \-6)\$이다. 따라서 밑변 \$\\overline{\\mathrm{BC}} \= 2 \- (-6) \= 8\$, 높이가 \$3\$이므로 삼각형 \$\\mathrm{ABC}\$의 넓이는 \$\\dfrac{1}{2} \\times 8 \\times 3 \= 12\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "일차함수와 그 역함수의 교점 및 두 y절편으로 이루어진 삼각형의 넓이를 구하는 문항이다."
  },
  "solutionPlan": {
    "status": "UNSUPPORTED",
    "reason": "좌표평면 위에 y=1/3x+2, y=3x-6, y=x의 그래프와 삼각형 ABC를 나타낸 도해가 필요하다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_INVERSE",
  "rpm": "H1-RPM-260",
  "difficultyBucket": 3,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "함수",
      "y절편"
    ],
    "goal": [
      "넓이"
    ],
    "method": [
      "교점",
      "연립방정식"
    ],
    "condition": [
      "실수"
    ]
  }
}
```

## 문항 13 (P47-Q01-T1)

### 발문

집합 \$X \= {-1, 0, 1}\$에 대하여 \$X\$에서 \$X\$로의 함수가 아닌 것은?

### 선지

① \$f(x) \= \-x\$ ② \$f(x) \= x^3\$ ③ \$f(x) \= \|x\| \- 1\$ ④ \$f(x) \= 1 \- \|x\|\$ ⑤ \$f(x) \= x \+ 1\$

### 정답

⑤

### 해설

① \$f(-1) \= 1, f(0) \= 0, f(1) \= \-1\$ (모두 \$X\$의 원소) ② \$f(-1) \= \-1, f(0) \= 0, f(1) \= 1\$ (모두 \$X\$의 원소) ③ \$f(-1) \= 0, f(0) \= \-1, f(1) \= 0\$ (모두 \$X\$의 원소) ④ \$f(-1) \= 0, f(0) \= 1, f(1) \= 0\$ (모두 \$X\$의 원소) ⑤ \$f(x) \= x \+ 1\$에서 \$f(1) \= 2 \\notin X\$이므로 \$X\$에서 \$X\$로의 함수가 아니다. 따라서 함수가 아닌 것은 ⑤이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "집합 X에서 X로의 함수가 되지 않는 식을 고르는 문항이다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "정의역의 원소를 대입하여 공역 X에 속하지 않는 함숫값을 찾는 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_BASIC",
  "rpm": "H1-RPM-251",
  "difficultyBucket": 1,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "집합",
      "함수"
    ],
    "goal": [
      "판정"
    ],
    "method": [
      "대입",
      "반례"
    ],
    "condition": [
      "실수"
    ]
  }
}
```

## 문항 14 (P47-Q01-S1)

### 발문

집합 \$X \= {0, 1, 2}\$에 대하여 \$X\$에서 \$X\$로의 함수인 것만을 \<보기\>에서 있는 대로 고른 것은?

\[보기\] ㄱ. \$f(x) \= 2 \- x\$ ㄴ. \$g(x) \= x^2 \- 1\$ ㄷ. \$h(x) \= 2x\$

### 선지

① ㄱ ② ㄴ ③ ㄱ, ㄷ ④ ㄴ, ㄷ ⑤ ㄱ, ㄴ, ㄷ

### 정답

①

### 해설

ㄱ. \$f(0) \= 2\$, \$f(1) \= 1\$, \$f(2) \= 0\$으로 모두 \$X\$의 원소이므로 함수이다. ㄴ. \$g(0) \= \-1 \\notin X\$이므로 함수가 아니다. ㄷ. \$h(2) \= 4 \\notin X\$이므로 함수가 아니다. 따라서 \$X\$에서 \$X\$로의 함수인 것은 ㄱ이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "집합 X에서 X로의 함수인 것을 고르는 문항이다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "정의역의 원소를 대입해 공역 X에 속하는지 확인하는 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_BASIC",
  "rpm": "H1-RPM-251",
  "difficultyBucket": 1,
  "item4slot": {
    "format": "옳은 것 고르기",
    "given": [
      "집합",
      "함수"
    ],
    "goal": [
      "판정"
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

## 문항 15 (P47-Q01-S2)

### 발문

두 집합 \$X \= {-1, 0, 1, 2}\$, \$Y \= {0, 1, 2, 3, 4}\$에 대하여 \$X\$에서 \$Y\$로의 함수가 아닌 것은?

### 선지

① \$f(x) \= x^2\$ ② \$f(x) \= \|x\| \+ 1\$ ③ \$f(x) \= 2x \- 1\$ ④ \$f(x) \= \|x \- 1\|\$ ⑤ \$f(x) \= 4 \- x^2\$

### 정답

③

### 해설

③ \$f(x) \= 2x \- 1\$에서 \$f(-1) \= \-3 \\notin Y\$이므로 \$X\$에서 \$Y\$로의 함수가 아니다. 나머지 ①, ②, ④, ⑤는 정의역 \$X\$의 모든 원소에 대한 함숫값이 \$Y\$에 속하므로 함수이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "집합 X에서 Y로의 함수가 아닌 식을 고르는 문항이다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "정의역의 원소를 대입해 공역 Y에 속하지 않는 반례를 찾는 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_BASIC",
  "rpm": "H1-RPM-251",
  "difficultyBucket": 1,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "집합",
      "함수"
    ],
    "goal": [
      "판정"
    ],
    "method": [
      "대입",
      "반례"
    ],
    "condition": [
      "실수"
    ]
  }
}
```

## 문항 16 (P47-Q02-T1)

### 발문

함수 \$f(x) \= \\begin{cases} x^2 \- 2x & (x \\ge 1\) \\ 3x \+ 1 & (x \< 1\) \\end{cases}\$에 대하여 \$f(3) \+ f(-2)\$의 값은?

### 선지

① \$-5\$ ② \$-4\$ ③ \$-3\$ ④ \$-2\$ ⑤ \$-1\$

### 정답

④

### 해설

\$3 \\ge 1\$이므로 \$f(3) \= 3^2 \- 2(3) \= 9 \- 6 \= 3\$이다. \$-2 \< 1\$이므로 \$f(-2) \= 3(-2) \+ 1 \= \-5\$이다. 따라서 \$f(3) \+ f(-2) \= 3 \+ (-5) \= \-2\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "구간별로 정의된 함수의 함숫값의 합을 구하는 문항이다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "입력값의 범위에 맞는 식에 대입하여 합을 구하는 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_BASIC",
  "rpm": "H1-RPM-251",
  "difficultyBucket": 1,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "함수"
    ],
    "goal": [
      "합"
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

## 문항 17 (P47-Q02-S1)

### 발문

함수 \$f(x) \= \\begin{cases} \-x^2 \+ 5 & (x \\le 2\) \\ 2x \- 3 & (x \> 2\) \\end{cases}\$에 대하여 \$f(1) \+ f(4)\$의 값은?

### 선지

① \$9\$ ② \$10\$ ③ \$11\$ ④ \$12\$ ⑤ \$13\$

### 정답

①

### 해설

\$1 \\le 2\$이므로 \$f(1) \= \-1^2 \+ 5 \= 4\$이다. \$4 \> 2\$이므로 \$f(4) \= 2(4) \- 3 \= 5\$이다. 따라서 \$f(1) \+ f(4) \= 4 \+ 5 \= 9\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "구간별로 정의된 함수의 함숫값의 합을 구하는 문항이다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "입력값의 범위에 맞는 식에 대입하여 합을 구하는 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_BASIC",
  "rpm": "H1-RPM-251",
  "difficultyBucket": 1,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "함수"
    ],
    "goal": [
      "합"
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

## 문항 18 (P47-Q02-S2)

### 발문

함수 \$f(x) \= \\begin{cases} 2x^2 \- 1 & (x \< 0\) \\ \-x \+ 4 & (x \\ge 0\) \\end{cases}\$에 대하여 \$f(-2) \+ f(3)\$의 값은?

### 선지

① \$4\$ ② \$5\$ ③ \$6\$ ④ \$7\$ ⑤ \$8\$

### 정답

⑤

### 해설

\$-2 \< 0\$이므로 \$f(-2) \= 2(-2)^2 \- 1 \= 8 \- 1 \= 7\$이다. \$3 \\ge 0\$이므로 \$f(3) \= \-3 \+ 4 \= 1\$이다. 따라서 \$f(-2) \+ f(3) \= 7 \+ 1 \= 8\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "구간별로 정의된 함수의 함숫값의 합을 구하는 문항이다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "입력값의 범위에 맞는 식에 대입하여 합을 구하는 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_BASIC",
  "rpm": "H1-RPM-251",
  "difficultyBucket": 1,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "함수"
    ],
    "goal": [
      "합"
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

## 문항 19 (P47-Q03-T1)

### 발문

자연수 전체의 집합에서 정의된 함수 \$f(n)\$이 자연수 \$n\$의 양의 약수의 개수일 때, 집합 \$X \= {6, 8, 9, 12, 16}\$을 정의역으로 하는 함수 \$f\$의 치역의 모든 원소의 합은?

### 선지

① \$16\$ ② \$18\$ ③ \$20\$ ④ \$22\$ ⑤ \$24\$

### 정답

②

### 해설

각 자연수의 양의 약수의 개수를 구하면 다음과 같다. \$f(6) \= 4\$, \$f(8) \= 4\$, \$f(9) \= 3\$, \$f(12) \= 6\$, \$f(16) \= 5\$ 따라서 치역은 \${3, 4, 5, 6}\$이므로 모든 원소의 합은 \$3 \+ 4 \+ 5 \+ 6 \= 18\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "양의 약수의 개수를 함숫값으로 하는 함수의 치역의 원소의 합을 구하는 문항이다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "각 원소의 약수의 개수를 구해 중복을 제외한 치역의 합을 계산하는 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_BASIC",
  "rpm": "H1-RPM-251",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "집합",
      "함수"
    ],
    "goal": [
      "합"
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

## 문항 20 (P47-Q03-S1)

### 발문

정의역이 \$X \= {2, 3, 4, 8, 12}\$이고, 함수 \$f(x)\$가 자연수 \$x\$의 양의 약수의 개수로 정의될 때, 함수 \$f\$의 치역의 원소의 개수는?

### 선지

① \$2\$개 ② \$3\$개 ③ \$4\$개 ④ \$5\$개 ⑤ \$6\$개

### 정답

③

### 해설

\$f(2) \= 2\$, \$f(3) \= 2\$, \$f(4) \= 3\$, \$f(8) \= 4\$, \$f(12) \= 6\$이다. 따라서 치역은 \${2, 3, 4, 6}\$이므로 원소의 개수는 \$4\$개이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "양의 약수의 개수를 함숫값으로 하는 함수의 치역의 원소의 개수를 구하는 문항이다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "각 원소의 약수의 개수를 구해 서로 다른 함숫값의 개수를 세는 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_BASIC",
  "rpm": "H1-RPM-251",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "집합",
      "함수"
    ],
    "goal": [
      "개수"
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

## 문항 21 (P47-Q03-S2)

### 발문

정의역이 \$X \= {4, 6, 9, 10, 15}\$이고, 함수 \$f(x)\$가 자연수 \$x\$의 서로 다른 소인수의 개수로 정의될 때, 함수 \$f\$의 치역의 모든 원소의 합은?

### 선지

① \$2\$ ② \$3\$ ③ \$4\$ ④ \$5\$ ⑤ \$6\$

### 정답

②

### 해설

\$4 \= 2^2\$, \$6 \= 2 \\times 3\$, \$9 \= 3^2\$, \$10 \= 2 \\times 5\$, \$15 \= 3 \\times 5\$이므로 \$f(4) \= 1\$, \$f(6) \= 2\$, \$f(9) \= 1\$, \$f(10) \= 2\$, \$f(15) \= 2\$이다. 따라서 치역은 \${1, 2}\$이므로 모든 원소의 합은 \$1 \+ 2 \= 3\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "소인수의 개수를 함숫값으로 하는 함수의 치역의 원소의 합을 구하는 문항이다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "소인수분해를 통해 각 함숫값을 구하고 치역의 합을 계산하는 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_BASIC",
  "rpm": "H1-RPM-251",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "집합",
      "함수"
    ],
    "goal": [
      "합"
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

## 문항 22 (P47-Q04-T1)

### 발문

양의 실수 전체의 집합에서 정의된 함수 \$f\$가 임의의 양수 \$x\$, \$y\$에 대하여 \$f(xy) \= f(x) \+ f(y)\$를 만족시킨다. \$f(2) \= a\$, \$f(3) \= b\$일 때, \$f(24)\$를 \$a\$, \$b\$로 나타낸 것은?

### 선지

① \$2a \+ 2b\$ ② \$a \+ 3b\$ ③ \$4a \+ b\$ ④ \$3a \+ 2b\$ ⑤ \$3a \+ b\$

### 정답

⑤

### 해설

\$24 \= 2^3 \\times 3\$이므로 주어진 조건을 반복 적용하면 \$f(4) \= f(2 \\times 2\) \= f(2) \+ f(2) \= 2a\$ \$f(8) \= f(4 \\times 2\) \= f(4) \+ f(2) \= 3a\$ 따라서 \$f(24) \= f(8 \\times 3\) \= f(8) \+ f(3) \= 3a \+ b\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "함수방정식 f(xy)=f(x)+f(y)를 이용해 f(24)를 a, b로 나타내는 문항이다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "24를 2와 3의 곱으로 분해하여 함숫값을 더하는 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_BASIC",
  "rpm": "H1-RPM-252",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "함수"
    ],
    "goal": [
      "값"
    ],
    "method": [
      "대입"
    ],
    "condition": [
      "양수"
    ]
  }
}
```

## 문항 23 (P47-Q04-S1)

### 발문

양의 실수 전체의 집합에서 정의된 함수 \$f\$가 임의의 양수 \$x\$, \$y\$에 대하여 \$f(xy) \= f(x) \+ f(y)\$를 만족시키고 \$f(2) \= 1\$, \$f(5) \= 2\$일 때, \$f(50)\$의 값은?

### 선지

① \$3\$ ② \$4\$ ③ \$5\$ ④ \$6\$ ⑤ \$7\$

### 정답

③

### 해설

\$50 \= 2 \\times 5 \\times 5\$이므로 \$f(50) \= f(2 \\times 25\) \= f(2) \+ f(5 \\times 5\) \= f(2) \+ f(5) \+ f(5) \= 1 \+ 2 \+ 2 \= 5\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "함수방정식 f(xy)=f(x)+f(y)를 이용해 f(50)의 값을 구하는 문항이다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "50 = 2 × 5 × 5로 분해하여 f(2) + 2f(5)를 계산하는 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_BASIC",
  "rpm": "H1-RPM-252",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "함수"
    ],
    "goal": [
      "값"
    ],
    "method": [
      "대입"
    ],
    "condition": [
      "양수"
    ]
  }
}
```

## 문항 24 (P47-Q04-S2)

### 발문

모든 실수 \$x\$, \$y\$에 대하여 \$f(x \+ y) \= f(x)f(y)\$를 만족시키는 함수 \$f\$가 있다. \$f(1) \= 3\$일 때, \$f(3)\$의 값은?

### 선지

① \$27\$ ② \$30\$ ③ \$36\$ ④ \$81\$ ⑤ \$243\$

### 정답

①

### 해설

\$x \= 1\$, \$y \= 1\$을 대입하면 \$f(2) \= f(1)f(1) \= 3 \\times 3 \= 9\$이다. \$x \= 2\$, \$y \= 1\$을 대입하면 \$f(3) \= f(2)f(1) \= 9 \\times 3 \= 27\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "함수방정식 f(x+y)=f(x)f(y)를 이용해 f(3)을 구하는 문항이다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "x, y에 1과 2를 대입하여 f(2), f(3)을 순차적으로 구하는 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_BASIC",
  "rpm": "H1-RPM-252",
  "difficultyBucket": 1,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "함수"
    ],
    "goal": [
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

## 문항 25 (P47-Q05-T1)

### 발문

두 함수 \$f(x) \= x^3 \- 2x\$, \$g(x) \= x^2\$에 대하여 \$f \= g\$가 성립하도록 하는 공집합이 아닌 정의역 \$X\$의 개수는?

### 선지

① \$1\$ ② \$3\$ ③ \$5\$ ④ \$7\$ ⑤ \$15\$

### 정답

④

### 해설

두 함수가 서로 같으려면 정의역 \$X\$의 모든 원소 \$x\$에 대하여 \$f(x) \= g(x)\$이어야 한다. \$x^3 \- 2x \= x^2\$에서 \$x^3 \- x^2 \- 2x \= 0\$, 즉 \$x(x \- 2)(x \+ 1\) \= 0\$이다. 따라서 방정식의 해는 \$x \= \-1\$, \$0\$, \$2\$이다. 정의역 \$X\$는 집합 \${-1, 0, 2}\$의 공집합이 아닌 부분집합이므로 개수는 \$2^3 \- 1 \= 7\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "두 함수가 서로 같아지도록 하는 공집합이 아닌 정의역의 개수를 구하는 문항이다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "f(x)=g(x)의 실근을 구한 뒤 공집합이 아닌 부분집합의 개수를 구하는 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-07",
  "subUnitKey": "H22-C2-07-FUNCTION_BASIC",
  "rpm": "H1-RPM-252",
  "difficultyBucket": 3,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "함수"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "부분집합"
    ],
    "condition": [
      "실수"
    ]
  }
}
```

