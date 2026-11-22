# APPROVED\_20261031\_2243\_BATCH21\_HA\_part2\_유형풀

```
{
  "sourceBatchId": "APPROVED_20261031_2243_BATCH21_HA_50ITEMS",
  "sourceFile": "06_APPROVED_BANK_20261031_2243.json",
  "sourceTitle": "백발백중_공통수학2(하) (2022개정).pdf",
  "section": "Ⅲ. 함수와 그래프 2. 유리함수 실전 문제 1회 07~24(완결) (97~100쪽 4페이지 전수 - 공통수학2(하))",
  "part": "part2",
  "itemRange": "26-50",
  "itemCount": 25,
  "answerPoolOffsetStart": 425,
  "answerPoolOffsetEnd": 450,
  "curriculum": "2022",
  "standardCourse": "공통수학2"
}
```

## 문항 26 (P98-Q15-S2)

### 발문

오른쪽 그림과 같이 함수 \$f(x) \= \\frac{2x-1}{x-1}\$에 대하여 \$y \= f(x)\$의 그래프 위의 두 점 \$A(a, f(a))\$, \$B(b, f(b))\$ (\$a \> 1, b \< 1\$)를 대각선의 양 끝점으로 하고 각 변이 \$x\$축, \$y\$축과 평행한 직사각형 \$APBQ\$의 넓이의 최솟값은?

### 선지

① \$1\$ ② \$2\$ ③ \$3\$ ④ \$4\$ ⑤ \$5\$

### 정답

④

### 해설

\$f(x)=\\dfrac{2x-1}{x-1}=\\dfrac{1}{x-1}+2\$이다. \$a-1=u \> 0\$, \$1-b=v \> 0\$이라 하면 직사각형 \$APBQ\$의 가로 길이는 \$a-b=u+v\$이고, 세로 길이는 \$f(a)-f(b)=\\left(\\dfrac{1}{u}+2\\right)-\\left(-\\dfrac{1}{v}+2\\right)=\\dfrac{1}{u}+\\dfrac{1}{v}\$이다. 직사각형 \$APBQ\$의 넓이는 \$(u+v)\\left(\\dfrac{1}{u}+\\dfrac{1}{v}\\right)=2+\\dfrac{u}{v}+\\dfrac{v}{u}\$이다. \$u\>0, v\>0\$이므로 산술평균과 기하평균의 관계에 의하여 \$2+2\\sqrt{\\dfrac{u}{v}\\cdot\\dfrac{v}{u}}=2+2=4\$이다. 따라서 넓이의 최솟값은 \$4\$이다.

```
{
  "questionPlan": {
    "status": "UNSUPPORTED",
    "reason": "유리함수의 점근선과 그래프 또는 두 분지 위 점이 이루는 도형 작도가 필요하다.",
    "spec": "좌표평면 위에 점근선 $x=1$, $y=2$(점선)와 유리함수 $y=\\dfrac{1}{x-1}+2$의 두 분지 그래프를 그린다. $x>1$인 곡선 위의 점 $A$와 $x<1$인 곡선 위의 점 $B$를 대각선의 양 끝점으로 하고 각 변이 좌표축에 평행한 직사각형 $APBQ$를 작도한다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "점근선과 절편 대입 또는 산술평균과 기하평균의 관계를 대수적으로 전개하는 풀이이다."
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
      "표준형",
      "산술기하평균"
    ],
    "condition": [
      "양수"
    ]
  }
}
```

## 문항 27 (P98-Q16-T1)

### 발문

유리함수 \$f(x) \= \\frac{x+1}{x}\$에 대하여 \$f^1(x) \= f(x)\$, \$f^{n+1}(x) \= f(f^n(x))\$ (\$n=1, 2, 3, \\dots\$)이라 할 때, \$f^4(x) \= \\frac{ax+b}{cx+d}\$이다. 이때 \$\\frac{a+b}{c+d}\$의 값은? (단, \$a, b, c, d\$는 서로소인 자연수이다.)

### 선지

① \$\\dfrac{4}{5}\$ ② \$1\$ ③ \$\\dfrac{6}{5}\$ ④ \$\\dfrac{7}{5}\$ ⑤ \$\\dfrac{8}{5}\$

### 정답

⑤

### 해설

\$f^1(x)=\\dfrac{x+1}{x}\$이다. \$f^2(x)=f(f^1(x))=\\dfrac{\\frac{x+1}{x}+1}{\\frac{x+1}{x}}=\\dfrac{2x+1}{x+1}\$이다. \$f^3(x)=f(f^2(x))=\\dfrac{\\frac{2x+1}{x+1}+1}{\\frac{2x+1}{x+1}}=\\dfrac{3x+2}{2x+1}\$이다. \$f^4(x)=f(f^3(x))=\\dfrac{\\frac{3x+2}{2x+1}+1}{\\frac{3x+2}{2x+1}}=\\dfrac{5x+3}{3x+2}\$이다. 따라서 \$a=5, b=3, c=3, d=2\$이므로 \$\\dfrac{a+b}{c+d}=\\dfrac{5+3}{3+2}=\\dfrac{8}{5}\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "유리함수의 합성·역함수·대칭성 및 사분면 조건을 대수적으로 구하는 문항으로 별도 도형 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "합성함수 대입, 역함수 교점 방정식 및 점근선 성질을 단계별로 전개하는 대수적 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-08",
  "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
  "rpm": "H1-RPM-266",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "유리함수",
      "합성함수"
    ],
    "goal": [
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

## 문항 28 (P98-Q16-S1)

### 발문

유리함수 \$f(x) \= \\frac{x+1}{x}\$에 대하여 \$f^1(x) \= f(x)\$, \$f^{n+1}(x) \= f(f^n(x))\$ (\$n=1, 2, 3, \\dots\$)이라 할 때, \$f^3(2)\$의 값은?

### 선지

① \$\\dfrac{6}{5}\$ ② \$\\dfrac{7}{5}\$ ③ \$\\dfrac{8}{5}\$ ④ \$\\dfrac{9}{5}\$ ⑤ \$2\$

### 정답

③

### 해설

\$f^1(2)=\\dfrac{2+1}{2}=\\dfrac{3}{2}\$이다. \$f^2(2)=f\\left(\\dfrac{3}{2}\\right)=\\dfrac{\\frac{3}{2}+1}{\\frac{3}{2}}=\\dfrac{5}{3}\$이다. \$f^3(2)=f\\left(\\dfrac{5}{3}\\right)=\\dfrac{\\frac{5}{3}+1}{\\frac{5}{3}}=\\dfrac{8}{5}\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "유리함수의 합성·역함수·대칭성 및 사분면 조건을 대수적으로 구하는 문항으로 별도 도형 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "합성함수 대입, 역함수 교점 방정식 및 점근선 성질을 단계별로 전개하는 대수적 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-08",
  "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
  "rpm": "H1-RPM-266",
  "difficultyBucket": 1,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "유리함수",
      "합성함수"
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

## 문항 29 (P98-Q16-S2)

### 발문

유리함수 \$f(x) \= \\frac{x-1}{x}\$에 대하여 \$f^1(x) \= f(x)\$, \$f^{n+1}(x) \= f(f^n(x))\$ (\$n=1, 2, 3, \\dots\$)이라 할 때, \$f^{2026}(3)\$의 값은?

### 선지

① \$\\dfrac{2}{3}\$ ② \$1\$ ③ \$\\dfrac{4}{3}\$ ④ \$\\dfrac{5}{3}\$ ⑤ \$2\$

### 정답

①

### 해설

\$f^1(3)=\\dfrac{3-1}{3}=\\dfrac{2}{3}\$이다. \$f^2(3)=f\\left(\\dfrac{2}{3}\\right)=\\dfrac{\\frac{2}{3}-1}{\\frac{2}{3}}=-\\dfrac{1}{2}\$이다. \$f^3(3)=f\\left(-\\dfrac{1}{2}\\right)=\\dfrac{-\\frac{1}{2}-1}{-\\frac{1}{2}}=3\$이다. 따라서 \$f^n(3)\$의 값은 \$3\$을 주기로 반복되고 \$2026=3 \\times 675+1\$이므로 \$f^{2026}(3)=f^1(3)=\\dfrac{2}{3}\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "유리함수의 합성·역함수·대칭성 및 사분면 조건을 대수적으로 구하는 문항으로 별도 도형 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "합성함수 대입, 역함수 교점 방정식 및 점근선 성질을 단계별로 전개하는 대수적 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-08",
  "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
  "rpm": "H1-RPM-266",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "유리함수",
      "합성함수"
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

## 문항 30 (P99-Q17-T1)

### 발문

함수 \$f(x) \= ax-5\$에 대하여 \$(f \\circ g \\circ f)(x) \= \-\\frac{15}{x+1}\$를 만족시키는 함수 \$g(x)\$가 존재하고 \$g(1) \= 0\$일 때, 양수 \$a\$의 값은?

### 선지

① \$2\$ ② \$3\$ ③ \$4\$ ④ \$5\$ ⑤ \$6\$

### 정답

②

### 해설

\$f(x\_0)=1\$이라 하면 \$ax\_0-5=1 \\implies ax\_0=6\$이다. \$g(1)=0\$이므로 \$(f \\circ g \\circ f)(x\_0)=f(g(1))=f(0)=-5\$이다. 한편 \$(f \\circ g \\circ f)(x\_0)=-\\dfrac{15}{x\_0+1}\$이므로 \$-\\dfrac{15}{x\_0+1}=-5 \\implies x\_0+1=3 \\implies x\_0=2\$이다. 따라서 \$2a=6 \\implies a=3\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "유리함수의 합성·역함수·대칭성 및 사분면 조건을 대수적으로 구하는 문항으로 별도 도형 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "합성함수 대입, 역함수 교점 방정식 및 점근선 성질을 단계별로 전개하는 대수적 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-08",
  "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
  "rpm": "H1-RPM-266",
  "difficultyBucket": 3,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "합성함수",
      "유리함수"
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

## 문항 31 (P99-Q17-S1)

### 발문

함수 \$f(x) \= ax-4\$에 대하여 \$(f \\circ g \\circ f)(x) \= \-\\frac{16}{x+1}\$을 만족시키는 함수 \$g(x)\$가 존재하고 \$g(2) \= 0\$일 때, 양수 \$a\$의 값은?

### 선지

① \$0\$ ② \$1\$ ③ \$2\$ ④ \$3\$ ⑤ \$4\$

### 정답

③

### 해설

\$f(x\_0)=2\$라 하면 \$ax\_0-4=2 \\implies ax\_0=6\$이다. \$g(2)=0\$이므로 \$(f \\circ g \\circ f)(x\_0)=f(g(2))=f(0)=-4\$이다. 한편 \$-\\dfrac{16}{x\_0+1}=-4 \\implies x\_0+1=4 \\implies x\_0=3\$이다. 따라서 \$3a=6 \\implies a=2\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "유리함수의 합성·역함수·대칭성 및 사분면 조건을 대수적으로 구하는 문항으로 별도 도형 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "합성함수 대입, 역함수 교점 방정식 및 점근선 성질을 단계별로 전개하는 대수적 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-08",
  "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
  "rpm": "H1-RPM-266",
  "difficultyBucket": 3,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "합성함수",
      "유리함수"
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

## 문항 32 (P99-Q17-S2)

### 발문

함수 \$f(x) \= ax-6\$에 대하여 \$(f \\circ g \\circ f)(x) \= \-\\frac{18}{x+1}\$을 만족시키는 함수 \$g(x)\$가 존재하고 \$g(4) \= 0\$일 때, 양수 \$a\$의 값은?

### 선지

① \$4\$ ② \$5\$ ③ \$6\$ ④ \$7\$ ⑤ \$8\$

### 정답

②

### 해설

\$f(x\_0)=4\$라 하면 \$ax\_0-6=4 \\implies ax\_0=10\$이다. \$g(4)=0\$이므로 \$(f \\circ g \\circ f)(x\_0)=f(g(4))=f(0)=-6\$이다. 한편 \$-\\dfrac{18}{x\_0+1}=-6 \\implies x\_0+1=3 \\implies x\_0=2\$이다. 따라서 \$2a=10 \\implies a=5\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "유리함수의 합성·역함수·대칭성 및 사분면 조건을 대수적으로 구하는 문항으로 별도 도형 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "합성함수 대입, 역함수 교점 방정식 및 점근선 성질을 단계별로 전개하는 대수적 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-08",
  "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
  "rpm": "H1-RPM-266",
  "difficultyBucket": 3,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "합성함수",
      "유리함수"
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

## 문항 33 (P99-Q18-T1)

### 발문

함수 \$f(x) \= \\frac{2x+3}{x}\$에 대하여 두 함수 \$y \= f(x)\$와 \$y \= f^{-1}(x)\$의 그래프의 두 교점 사이의 거리는?

### 선지

① \$4\\sqrt{2}\$ ② \$5\\sqrt{2}\$ ③ \$6\\sqrt{2}\$ ④ \$7\\sqrt{2}\$ ⑤ \$8\\sqrt{2}\$

### 정답

①

### 해설

\$y=f(x)\$의 역함수 \$f^{-1}(x)=\\dfrac{3}{x-2}\$이므로 \$f(x)=f^{-1}(x)\$에서 \$\\dfrac{2x+3}{x}=\\dfrac{3}{x-2} \\implies (2x+3)(x-2)=3x \\implies 2x^2-4x-6=0 \\implies (x+1)(x-3)=0\$이다. 따라서 교점은 \$(-1, \-1)\$과 \$(3, 3)\$이므로 두 교점 사이의 거리는 \$\\sqrt{(3-(-1))^2+(3-(-1))^2}=\\sqrt{16+16}=4\\sqrt{2}\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "유리함수의 합성·역함수·대칭성 및 사분면 조건을 대수적으로 구하는 문항으로 별도 도형 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "합성함수 대입, 역함수 교점 방정식 및 점근선 성질을 단계별로 전개하는 대수적 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-08",
  "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
  "rpm": "H1-RPM-267",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "유리함수",
      "역함수"
    ],
    "goal": [
      "거리"
    ],
    "method": [
      "이차방정식",
      "거리"
    ],
    "condition": [
      "실수"
    ]
  }
}
```

## 문항 34 (P99-Q18-S1)

### 발문

함수 \$f(x) \= \\frac{3x+4}{x}\$에 대하여 두 함수 \$y \= f(x)\$와 \$y \= f^{-1}(x)\$의 그래프의 두 교점 사이의 거리는?

### 선지

① \$\\sqrt{2}\$ ② \$2\\sqrt{2}\$ ③ \$3\\sqrt{2}\$ ④ \$4\\sqrt{2}\$ ⑤ \$5\\sqrt{2}\$

### 정답

⑤

### 해설

\$f^{-1}(x)=\\dfrac{4}{x-3}\$이므로 \$\\dfrac{3x+4}{x}=\\dfrac{4}{x-3}\$에서 \$(3x+4)(x-3)=4x \\implies 3x^2-9x-12=0 \\implies (x+1)(x-4)=0\$이다. 두 교점은 \$(-1, \-1)\$과 \$(4, 4)\$이므로 두 점 사이의 거리는 \$\\sqrt{(4-(-1))^2+(4-(-1))^2}=5\\sqrt{2}\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "유리함수의 합성·역함수·대칭성 및 사분면 조건을 대수적으로 구하는 문항으로 별도 도형 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "합성함수 대입, 역함수 교점 방정식 및 점근선 성질을 단계별로 전개하는 대수적 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-08",
  "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
  "rpm": "H1-RPM-267",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "유리함수",
      "역함수"
    ],
    "goal": [
      "거리"
    ],
    "method": [
      "이차방정식",
      "거리"
    ],
    "condition": [
      "실수"
    ]
  }
}
```

## 문항 35 (P99-Q18-S2)

### 발문

함수 \$f(x) \= \\frac{2x+8}{x}\$에 대하여 두 함수 \$y \= f(x)\$와 \$y \= f^{-1}(x)\$의 그래프의 두 교점 사이의 거리는?

### 선지

① \$3\\sqrt{2}\$ ② \$4\\sqrt{2}\$ ③ \$5\\sqrt{2}\$ ④ \$6\\sqrt{2}\$ ⑤ \$7\\sqrt{2}\$

### 정답

④

### 해설

\$f^{-1}(x)=\\dfrac{8}{x-2}\$이므로 \$\\dfrac{2x+8}{x}=\\dfrac{8}{x-2}\$에서 \$(2x+8)(x-2)=8x \\implies 2x^2-4x-16=0 \\implies (x+2)(x-4)=0\$이다. 두 교점은 \$(-2, \-2)\$와 \$(4, 4)\$이므로 두 점 사이의 거리는 \$\\sqrt{(4-(-2))^2+(4-(-2))^2}=6\\sqrt{2}\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "유리함수의 합성·역함수·대칭성 및 사분면 조건을 대수적으로 구하는 문항으로 별도 도형 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "합성함수 대입, 역함수 교점 방정식 및 점근선 성질을 단계별로 전개하는 대수적 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-08",
  "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
  "rpm": "H1-RPM-267",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "유리함수",
      "역함수"
    ],
    "goal": [
      "거리"
    ],
    "method": [
      "이차방정식",
      "거리"
    ],
    "condition": [
      "실수"
    ]
  }
}
```

## 문항 36 (P99-Q19-T1)

### 발문

두 함수 \$f(x) \= x-2\$, \$g(x) \= \\frac{2x}{x+1}\$에 대하여 \$(f \\circ h)(x) \= g(x)\$를 만족시키는 함수 \$y \= h(x)\$의 그래프의 두 점근선의 교점의 좌표는?

### 선지

① \$(-2, 2)\$ ② \$(-1, 2)\$ ③ \$(-1, 3)\$ ④ \$(-1, 4)\$ ⑤ \$(1, 4)\$

### 정답

④

### 해설

\$(f \\circ h)(x)=f(h(x))=h(x)-2=\\dfrac{2x}{x+1}\$이므로 \$h(x)=\\dfrac{2x}{x+1}+2=\\dfrac{4x+2}{x+1}\$이다. 점근선의 방정식은 \$x=-1\$, \$y=4\$이므로 두 점근선의 교점의 좌표는 \$(-1, 4)\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "유리함수의 합성·역함수·대칭성 및 사분면 조건을 대수적으로 구하는 문항으로 별도 도형 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "합성함수 대입, 역함수 교점 방정식 및 점근선 성질을 단계별로 전개하는 대수적 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-08",
  "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
  "rpm": "H1-RPM-266",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "합성함수",
      "유리함수"
    ],
    "goal": [
      "점근선"
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

## 문항 37 (P99-Q19-S1)

### 발문

두 함수 \$f(x) \= x-3\$, \$g(x) \= \\frac{x-1}{x+2}\$에 대하여 \$(f \\circ h)(x) \= g(x)\$를 만족시키는 함수 \$y \= h(x)\$의 그래프의 두 점근선의 교점의 좌표는?

### 선지

① \$(-2, 1)\$ ② \$(-2, 2)\$ ③ \$(-2, 3)\$ ④ \$(-1, 4)\$ ⑤ \$(-2, 4)\$

### 정답

⑤

### 해설

\$(f \\circ h)(x)=h(x)-3=\\dfrac{x-1}{x+2}\$이므로 \$h(x)=\\dfrac{x-1}{x+2}+3=\\dfrac{4x+5}{x+2}\$이다. 점근선의 방정식은 \$x=-2\$, \$y=4\$이므로 두 점근선의 교점의 좌표는 \$(-2, 4)\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "유리함수의 합성·역함수·대칭성 및 사분면 조건을 대수적으로 구하는 문항으로 별도 도형 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "합성함수 대입, 역함수 교점 방정식 및 점근선 성질을 단계별로 전개하는 대수적 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-08",
  "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
  "rpm": "H1-RPM-266",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "합성함수",
      "유리함수"
    ],
    "goal": [
      "점근선"
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

## 문항 38 (P99-Q20-T1)

### 발문

두 함수 \$f(x) \= \\frac{ax+1}{x-2}\$와 \$g(x)\$가 다음 두 조건을 만족시킨다.

(가) \$x \\ne \-1\$일 때 \$(f \\circ g)(x) \= \\frac{6x+14}{x+1}\$ (나) \$g^{-1}(3) \= 1\$

함수 \$y \= f(x)\$의 그래프가 직선 \$y \= x+b\$에 대하여 대칭일 때, 상수 \$a, b\$에 대하여 \$a+b\$의 값은?

### 선지

① \$3\$ ② \$4\$ ③ \$5\$ ④ \$6\$ ⑤ \$7\$

### 정답

②

### 해설

조건 (나)에서 \$g^{-1}(3)=1\$이므로 \$g(1)=3\$이다. 조건 (가)에 \$x=1\$을 대입하면 \$(f \\circ g)(1)=f(g(1))=f(3)=\\dfrac{6\\times 1+14}{1+1}=10\$이다. \$f(3)=\\dfrac{3a+1}{3-2}=3a+1=10 \\implies a=3\$이다. 따라서 \$f(x)=\\dfrac{3x+1}{x-2}\$의 대칭의 중심은 \$(2, 3)\$이고, 직선 \$y=x+b\$가 \$(2, 3)\$을 지나므로 \$3=2+b \\implies b=1\$이다. 따라서 \$a+b=3+1=4\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "유리함수의 합성·역함수·대칭성 및 사분면 조건을 대수적으로 구하는 문항으로 별도 도형 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "합성함수 대입, 역함수 교점 방정식 및 점근선 성질을 단계별로 전개하는 대수적 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-08",
  "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
  "rpm": "H1-RPM-266",
  "difficultyBucket": 3,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "유리함수",
      "합성함수",
      "역함수"
    ],
    "goal": [
      "합"
    ],
    "method": [
      "대입",
      "대칭성"
    ],
    "condition": [
      "상수"
    ]
  }
}
```

## 문항 39 (P99-Q20-S1)

### 발문

두 함수 \$f(x) \= \\frac{ax+1}{x-2}\$와 \$g(x)\$가 다음 두 조건을 만족시킨다.

(가) \$x \\ne \-1\$일 때 \$(f \\circ g)(x) \= \\frac{5x+9}{x+1}\$ (나) \$g^{-1}(3) \= 1\$

함수 \$y \= f(x)\$의 그래프가 직선 \$y \= x+b\$에 대하여 대칭일 때, 상수 \$a, b\$에 대하여 \$a+b\$의 값은?

### 선지

① \$0\$ ② \$1\$ ③ \$2\$ ④ \$3\$ ⑤ \$4\$

### 정답

③

### 해설

\$g^{-1}(3)=1 \\implies g(1)=3\$이므로 \$f(3)=\\dfrac{5+9}{1+1}=7\$이다. \$f(3)=\\dfrac{3a+1}{3-2}=3a+1=7 \\implies a=2\$이다. \$f(x)=\\dfrac{2x+1}{x-2}\$의 대칭의 중심은 \$(2, 2)\$이므로 \$2=2+b \\implies b=0\$이다. 따라서 \$a+b=2+0=2\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "유리함수의 합성·역함수·대칭성 및 사분면 조건을 대수적으로 구하는 문항으로 별도 도형 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "합성함수 대입, 역함수 교점 방정식 및 점근선 성질을 단계별로 전개하는 대수적 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-08",
  "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
  "rpm": "H1-RPM-266",
  "difficultyBucket": 3,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "유리함수",
      "합성함수",
      "역함수"
    ],
    "goal": [
      "합"
    ],
    "method": [
      "대입",
      "대칭성"
    ],
    "condition": [
      "상수"
    ]
  }
}
```

## 문항 40 (P99-Q20-S2)

### 발문

두 함수 \$f(x) \= \\frac{ax+1}{x-1}\$과 \$g(x)\$가 다음 두 조건을 만족시킨다.

(가) \$x \\ne \-1\$일 때 \$(f \\circ g)(x) \= \\frac{4x+10}{x+1}\$ (나) \$g^{-1}(2) \= 1\$

함수 \$y \= f(x)\$의 그래프가 직선 \$y \= x+b\$에 대하여 대칭일 때, 상수 \$a, b\$에 대하여 \$a+b\$의 값은?

### 선지

① \$5\$ ② \$6\$ ③ \$7\$ ④ \$8\$ ⑤ \$9\$

### 정답

①

### 해설

\$g^{-1}(2)=1 \\implies g(1)=2\$이므로 \$f(2)=\\dfrac{4+10}{1+1}=7\$이다. \$f(2)=\\dfrac{2a+1}{2-1}=2a+1=7 \\implies a=3\$이다. \$f(x)=\\dfrac{3x+1}{x-1}\$의 대칭의 중심은 \$(1, 3)\$이므로 \$3=1+b \\implies b=2\$이다. 따라서 \$a+b=3+2=5\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "유리함수의 합성·역함수·대칭성 및 사분면 조건을 대수적으로 구하는 문항으로 별도 도형 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "합성함수 대입, 역함수 교점 방정식 및 점근선 성질을 단계별로 전개하는 대수적 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-08",
  "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
  "rpm": "H1-RPM-266",
  "difficultyBucket": 3,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "유리함수",
      "합성함수",
      "역함수"
    ],
    "goal": [
      "합"
    ],
    "method": [
      "대입",
      "대칭성"
    ],
    "condition": [
      "상수"
    ]
  }
}
```

## 문항 41 (P100-Q21-T1)

### 발문

함수 \$y \= \\frac{k}{x}\$ (\$k \> 0\$)의 그래프를 \$x\$축의 방향으로 \$1\$만큼, \$y\$축의 방향으로 \$2\$만큼 평행이동한 그래프가 제\$3\$사분면을 지나지 않도록 하는 상수 \$k\$의 값의 범위는?

### 선지

① \$0 \< k \< 2\$ ② \$0 \< k \\le 2\$ ③ \$k \\ge 2\$ ④ \$k \> 2\$ ⑤ \$k \\le 2\$

### 정답

②

### 해설

평행이동한 그래프의 식은 \$y=\\dfrac{k}{x-1}+2\$이다. \$k \> 0\$이고 점근선이 \$x=1\$, \$y=2\$이므로 그래프가 제\$3\$사분면을 지나지 않으려면 \$x=0\$일 때의 \$y\$좌표가 \$0\$ 이상이어야 한다. \$-k+2 \\ge 0 \\implies k \\le 2\$이고 \$k \> 0\$이므로 \$0 \< k \\le 2\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "유리함수의 합성·역함수·대칭성 및 사분면 조건을 대수적으로 구하는 문항으로 별도 도형 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "합성함수 대입, 역함수 교점 방정식 및 점근선 성질을 단계별로 전개하는 대수적 풀이이다."
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
      "유리함수"
    ],
    "goal": [
      "범위"
    ],
    "method": [
      "평행이동",
      "부등식"
    ],
    "condition": [
      "양수"
    ]
  }
}
```

## 문항 42 (P100-Q21-S1)

### 발문

함수 \$y \= \\frac{k}{x}\$ (\$k \> 0\$)의 그래프를 \$x\$축의 방향으로 \$2\$만큼, \$y\$축의 방향으로 \$3\$만큼 평행이동한 그래프가 제\$3\$사분면을 지나지 않도록 하는 상수 \$k\$의 값의 범위는?

### 선지

① \$k \< 6\$ ② \$0 \< k \< 6\$ ③ \$0 \< k \\le 6\$ ④ \$k \\ge 6\$ ⑤ \$k \> 6\$

### 정답

③

### 해설

평행이동한 그래프의 식은 \$y=\\dfrac{k}{x-2}+3\$이다. \$k \> 0\$이고 점근선이 \$x=2\$, \$y=3\$이므로 제\$3\$사분면을 지나지 않으려면 \$x=0\$일 때의 함숫값이 \$0\$ 이상이어야 한다. \$-\\dfrac{k}{2}+3 \\ge 0 \\implies k \\le 6\$이고 \$k \> 0\$이므로 \$0 \< k \\le 6\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "유리함수의 합성·역함수·대칭성 및 사분면 조건을 대수적으로 구하는 문항으로 별도 도형 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "합성함수 대입, 역함수 교점 방정식 및 점근선 성질을 단계별로 전개하는 대수적 풀이이다."
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
      "유리함수"
    ],
    "goal": [
      "범위"
    ],
    "method": [
      "평행이동",
      "부등식"
    ],
    "condition": [
      "양수"
    ]
  }
}
```

## 문항 43 (P100-Q21-S2)

### 발문

함수 \$y \= \\frac{k}{x}\$ (\$k \> 0\$)의 그래프를 \$x\$축의 방향으로 \$1\$만큼, \$y\$축의 방향으로 \$4\$만큼 평행이동한 그래프가 제\$3\$사분면을 지나지 않도록 하는 자연수 \$k\$의 개수는?

### 선지

① \$0\$ ② \$1\$ ③ \$2\$ ④ \$3\$ ⑤ \$4\$

### 정답

⑤

### 해설

평행이동한 그래프의 식은 \$y=\\dfrac{k}{x-1}+4\$이다. \$k \> 0\$일 때 제\$3\$사분면을 지나지 않으려면 \$x=0\$일 때 \$-k+4 \\ge 0 \\implies k \\le 4\$이어야 한다. 따라서 자연수 \$k\$는 \$1, 2, 3, 4\$로 개수는 \$4\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "유리함수의 합성·역함수·대칭성 및 사분면 조건을 대수적으로 구하는 문항으로 별도 도형 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "합성함수 대입, 역함수 교점 방정식 및 점근선 성질을 단계별로 전개하는 대수적 풀이이다."
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
      "유리함수"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "평행이동",
      "부등식"
    ],
    "condition": [
      "자연수"
    ]
  }
}
```

## 문항 44 (P100-Q22-T1)

### 발문

함수 \$y \= \\frac{bx+c}{ax+1}\$의 그래프가 오른쪽 그림과 같을 때, 상수 \$a, b, c\$에 대하여 \$a+b+c\$의 값은?

### 선지

① \$-10\$ ② \$-9\$ ③ \$-8\$ ④ \$-7\$ ⑤ \$-6\$

### 정답

④

### 해설

주어진 그래프에서 점근선의 방정식은 \$x=\\dfrac{1}{2}\$, \$y=2\$이고 \$y\$절편은 \$(0, \-1)\$이다. 유리함수 \$y=\\dfrac{bx+c}{ax+1}\$의 점근선은 \$x=-\\dfrac{1}{a}\$, \$y=\\dfrac{b}{a}\$이므로 \$-\\dfrac{1}{a}=\\dfrac{1}{2} \\implies a=-2\$, \$\\dfrac{b}{a}=2 \\implies b=2a=-4\$이다. 또한 점 \$(0, \-1)\$을 지나므로 \$\\dfrac{c}{1}=-1 \\implies c=-1\$이다. 따라서 \$a+b+c=-2+(-4)+(-1)=-7\$이다.

```
{
  "questionPlan": {
    "status": "UNSUPPORTED",
    "reason": "유리함수의 점근선과 그래프 또는 두 분지 위 점이 이루는 도형 작도가 필요하다.",
    "spec": "좌표평면 위에 점근선 $x=\\dfrac{1}{2}$, $y=2$(점선)를 표시하고, $y$절편 $(0, -1)$을 지나며 점근선에 가까워지는 유리함수 그래프를 제1, 2, 3, 4사분면에 걸쳐 그린다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "점근선과 절편 대입 또는 산술평균과 기하평균의 관계를 대수적으로 전개하는 풀이이다."
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

## 문항 45 (P100-Q22-S1)

### 발문

함수 \$y \= \\frac{bx+c}{ax+1}\$의 그래프가 오른쪽 그림과 같을 때, 상수 \$a, b, c\$에 대하여 \$a+b+c\$의 값은?

### 선지

① \$-3\$ ② \$-2\$ ③ \$-1\$ ④ \$0\$ ⑤ \$1\$

### 정답

①

### 해설

주어진 그래프에서 점근선의 방정식은 \$x=1\$, \$y=3\$이고 \$y\$절편은 \$(0, 1)\$이다. \$-\\dfrac{1}{a}=1 \\implies a=-1\$, \$\\dfrac{b}{a}=3 \\implies b=-3\$이고, \$x=0\$일 때 \$y=c=1\$이다. 따라서 \$a+b+c=-1+(-3)+1=-3\$이다.

```
{
  "questionPlan": {
    "status": "UNSUPPORTED",
    "reason": "유리함수의 점근선과 그래프 또는 두 분지 위 점이 이루는 도형 작도가 필요하다.",
    "spec": "좌표평면 위에 점근선 $x=1$, $y=3$(점선)을 표시하고, $y$절편 $(0, 1)$을 지나며 점근선에 가까워지는 유리함수 그래프를 그린다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "점근선과 절편 대입 또는 산술평균과 기하평균의 관계를 대수적으로 전개하는 풀이이다."
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

## 문항 46 (P100-Q22-S2)

### 발문

함수 \$y \= \\frac{bx+c}{ax+1}\$의 그래프가 오른쪽 그림과 같을 때, 상수 \$a, b, c\$에 대하여 \$a+b+c\$의 값은?

### 선지

① \$-7\$ ② \$-6\$ ③ \$-5\$ ④ \$-4\$ ⑤ \$-3\$

### 정답

①

### 해설

주어진 그래프에서 점근선의 방정식은 \$x=\\dfrac{1}{2}\$, \$y=3\$이고 \$y\$절편은 \$(0, 1)\$이다. \$-\\dfrac{1}{a}=\\dfrac{1}{2} \\implies a=-2\$, \$\\dfrac{b}{a}=3 \\implies b=-6\$이고, \$x=0\$일 때 \$y=c=1\$이다. 따라서 \$a+b+c=-2+(-6)+1=-7\$이다.

```
{
  "questionPlan": {
    "status": "UNSUPPORTED",
    "reason": "유리함수의 점근선과 그래프 또는 두 분지 위 점이 이루는 도형 작도가 필요하다.",
    "spec": "좌표평면 위에 점근선 $x=\\dfrac{1}{2}$, $y=3$(점선)을 표시하고, $y$절편 $(0, 1)$을 지나며 점근선에 가까워지는 유리함수 그래프를 그린다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "점근선과 절편 대입 또는 산술평균과 기하평균의 관계를 대수적으로 전개하는 풀이이다."
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

## 문항 47 (P100-Q23-T1)

### 발문

함수 \$y \= \\frac{2x-3}{x-1}\$의 그래프가 두 직선 \$y \= x+a, y \= \-x+b\$에 대하여 대칭일 때, 상수 \$a, b\$에 대하여 \$a+b\$의 값은?

### 선지

① \$2\$ ② \$3\$ ③ \$4\$ ④ \$5\$ ⑤ \$6\$

### 정답

③

### 해설

함수 \$y=\\dfrac{2x-3}{x-1}\$의 점근선은 \$x=1\$, \$y=2\$이므로 대칭의 중심은 \$(1, 2)\$이다. 두 직선 \$y=x+a\$, \$y=-x+b\$가 모두 점 \$(1, 2)\$를 지나므로 \$2=1+a \\implies a=1\$, \$2=-1+b \\implies b=3\$이다. 따라서 \$a+b=1+3=4\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "유리함수의 합성·역함수·대칭성 및 사분면 조건을 대수적으로 구하는 문항으로 별도 도형 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "합성함수 대입, 역함수 교점 방정식 및 점근선 성질을 단계별로 전개하는 대수적 풀이이다."
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
  "difficultyBucket": 1,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "유리함수",
      "대칭성"
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

## 문항 48 (P100-Q23-S1)

### 발문

함수 \$y \= \\frac{3x+1}{x-2}\$의 그래프가 두 직선 \$y \= x+a, y \= \-x+b\$에 대하여 대칭일 때, 상수 \$a, b\$에 대하여 \$a+b\$의 값은?

### 선지

① \$2\$ ② \$3\$ ③ \$4\$ ④ \$5\$ ⑤ \$6\$

### 정답

⑤

### 해설

함수 \$y=\\dfrac{3x+1}{x-2}\$의 점근선은 \$x=2\$, \$y=3\$이므로 대칭의 중심은 \$(2, 3)\$이다. 두 직선 \$y=x+a\$, \$y=-x+b\$가 모두 점 \$(2, 3)\$을 지나므로 \$3=2+a \\implies a=1\$, \$3=-2+b \\implies b=5\$이다. 따라서 \$a+b=1+5=6\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "유리함수의 합성·역함수·대칭성 및 사분면 조건을 대수적으로 구하는 문항으로 별도 도형 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "합성함수 대입, 역함수 교점 방정식 및 점근선 성질을 단계별로 전개하는 대수적 풀이이다."
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
  "difficultyBucket": 1,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "유리함수",
      "대칭성"
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

## 문항 49 (P100-Q24-T1)

### 발문

함수 \$f(x) \= \\frac{3x-9}{2x-4}\$에 대하여 \$(f \\circ g)(x) \= x\$를 만족시키는 함수 \$g(x)\$의 그래프의 두 점근선의 방정식을 \$x \= m, y \= n\$이라 할 때, \$2mn\$의 값은?

### 선지

① \$5\$ ② \$6\$ ③ \$7\$ ④ \$8\$ ⑤ \$9\$

### 정답

②

### 해설

\$(f \\circ g)(x)=x\$이므로 \$g(x)=f^{-1}(x)\$이다. 함수 \$f(x)=\\dfrac{3x-9}{2x-4}\$의 점근선은 \$x=2\$, \$y=\\dfrac{3}{2}\$이다. 역함수 \$g(x)=f^{-1}(x)\$의 그래프는 \$y=f(x)\$의 그래프를 직선 \$y=x\$에 대하여 대칭이동한 것이므로 점근선은 \$x=\\dfrac{3}{2}\$, \$y=2\$이다. 따라서 \$m=\\dfrac{3}{2}\$, \$n=2\$이므로 \$2mn=2 \\times \\dfrac{3}{2} \\times 2=6\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "유리함수의 합성·역함수·대칭성 및 사분면 조건을 대수적으로 구하는 문항으로 별도 도형 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "합성함수 대입, 역함수 교점 방정식 및 점근선 성질을 단계별로 전개하는 대수적 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-08",
  "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
  "rpm": "H1-RPM-267",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "유리함수",
      "역함수",
      "점근선"
    ],
    "goal": [
      "곱"
    ],
    "method": [
      "점근선",
      "대칭성"
    ],
    "condition": [
      "실수"
    ]
  }
}
```

## 문항 50 (P100-Q24-S1)

### 발문

함수 \$f(x) \= \\frac{4x+1}{3x-6}\$에 대하여 \$(f \\circ g)(x) \= x\$를 만족시키는 함수 \$g(x)\$의 그래프의 두 점근선의 방정식을 \$x \= m, y \= n\$이라 할 때, \$3mn\$의 값은?

### 선지

① \$2\$ ② \$4\$ ③ \$6\$ ④ \$8\$ ⑤ \$10\$

### 정답

④

### 해설

\$(f \\circ g)(x)=x\$이므로 \$g(x)=f^{-1}(x)\$이다. 함수 \$f(x)=\\dfrac{4x+1}{3x-6}\$의 점근선은 \$x=2\$, \$y=\\dfrac{4}{3}\$이다. 따라서 역함수 \$g(x)\$의 점근선은 \$x=\\dfrac{4}{3}\$, \$y=2\$이므로 \$m=\\dfrac{4}{3}\$, \$n=2\$이다. 따라서 \$3mn=3 \\times \\dfrac{4}{3} \\times 2=8\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "유리함수의 합성·역함수·대칭성 및 사분면 조건을 대수적으로 구하는 문항으로 별도 도형 작도가 불필요하다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "합성함수 대입, 역함수 교점 방정식 및 점근선 성질을 단계별로 전개하는 대수적 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-08",
  "subUnitKey": "H22-C2-08-FUNCTION_BASIC",
  "rpm": "H1-RPM-267",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "유리함수",
      "역함수",
      "점근선"
    ],
    "goal": [
      "곱"
    ],
    "method": [
      "점근선",
      "대칭성"
    ],
    "condition": [
      "실수"
    ]
  }
}
```

