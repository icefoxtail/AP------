# APPROVED\_20261019\_BATCH02\_50\_part1\_유형풀

```
{
  "sourceBatchId": "APPROVED_20261019_BATCH02_50",
  "sourceFile": "08_APPROVED_BANK_20261019_1930.json",
  "sourceTitle": "백발백중_공통수학2(상) (2022개정).pdf",
  "section": "Best 2회 전수 (14~17쪽 4페이지 전수)",
  "part": "part1",
  "itemRange": "1-25",
  "itemCount": 25,
  "answerPoolOffsetStart": 50,
  "answerPoolOffsetEnd": 75,
  "curriculum": "2022",
  "standardCourse": "공통수학2"
}
```

## 문항 01 (P14-Q01)

### 발문

세 점 \$O(0, 0)\$, \$A(3, 4)\$, \$B(0, 4)\$를 꼭짓점으로 하는 삼각형 \$OAB\$의 둘레의 길이는?

### 선지

① \$9\$ ② \$10\$ ③ \$11\$ ④ \$12\$ ⑤ \$13\$

### 정답

④

### 해설

삼각형 \$OAB\$의 세 변의 길이를 각각 구하면 \$\\overline{OA} \= \\sqrt{(3 \- 0)^2 \+ (4 \- 0)^2} \= \\sqrt{9 \+ 16} \= 5\$ \$\\overline{AB} \= \\sqrt{(0 \- 3)^2 \+ (4 \- 4)^2} \= \\sqrt{9} \= 3\$ \$\\overline{OB} \= \\sqrt{(0 \- 0)^2 \+ (4 \- 0)^2} \= \\sqrt{16} \= 4\$ 따라서 삼각형 \$OAB\$의 둘레의 길이는 \$5 \+ 3 \+ 4 \= 12\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "세 점의 좌표로 세 변의 길이를 구해 둘레를 계산하는 문항이다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "두 점 사이의 거리 공식을 세 변에 적용해 더하는 대수 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-01",
  "subUnitKey": "H22-C2-01-COORDINATE_METRIC",
  "rpm": "H1-RPM-205",
  "difficultyBucket": 1,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "삼각형",
      "꼭짓점",
      "좌표"
    ],
    "goal": [
      "둘레",
      "길이"
    ],
    "method": [
      "거리"
    ],
    "condition": []
  }
}
```

## 문항 02 (P14-Q02)

### 발문

세 점 \$A(-1, 2)\$, \$B(2, 6)\$, \$C(5, 2)\$를 꼭짓점으로 하는 삼각형 \$ABC\$의 둘레의 길이는?

### 선지

① \$12\$ ② \$13\$ ③ \$14\$ ④ \$15\$ ⑤ \$16\$

### 정답

⑤

### 해설

삼각형 \$ABC\$의 세 변의 길이를 각각 구하면 \$\\overline{AB} \= \\sqrt{(2 \- (-1))^2 \+ (6 \- 2)^2} \= \\sqrt{3^2 \+ 4^2} \= \\sqrt{25} \= 5\$ \$\\overline{BC} \= \\sqrt{(5 \- 2)^2 \+ (2 \- 6)^2} \= \\sqrt{3^2 \+ (-4)^2} \= \\sqrt{25} \= 5\$ \$\\overline{CA} \= \\sqrt{(-1 \- 5)^2 \+ (2 \- 2)^2} \= \\sqrt{(-6)^2} \= 6\$ 따라서 삼각형 \$ABC\$의 둘레의 길이는 \$5 \+ 5 \+ 6 \= 16\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "세 꼭짓점 좌표가 주어져 거리 공식으로 둘레를 구하는 문항이다."
  },
  "solutionPlan": {
    "capability": "construction-spike-v1",
    "mathPlan": {
      "realization": {
        "recipeId": "SOURCE_COORDINATE_AXES_v1",
        "unit": "source-coordinate",
        "reflectionEquivalent": false
      },
      "nodes": [
        {
          "id": "O",
          "op": "NORMALIZATION_ORIGIN",
          "outputType": "POINT"
        },
        {
          "id": "A",
          "op": "SOURCE_POINT",
          "outputType": "POINT",
          "args": {
            "coordinates": [
              "-1",
              "2"
            ]
          }
        },
        {
          "id": "B",
          "op": "SOURCE_POINT",
          "outputType": "POINT",
          "args": {
            "coordinates": [
              "2",
              "6"
            ]
          }
        },
        {
          "id": "C",
          "op": "SOURCE_POINT",
          "outputType": "POINT",
          "args": {
            "coordinates": [
              "5",
              "2"
            ]
          }
        }
      ]
    },
    "caption": "세 점 A(-1, 2), B(2, 6), C(5, 2)로 이루어진 삼각형 ABC의 세 변의 길이는 5, 5, 6이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-01",
  "subUnitKey": "H22-C2-01-COORDINATE_METRIC",
  "rpm": "H1-RPM-205",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "삼각형",
      "꼭짓점",
      "좌표"
    ],
    "goal": [
      "둘레",
      "길이"
    ],
    "method": [
      "거리",
      "이등변삼각형"
    ],
    "condition": []
  }
}
```

## 문항 03 (P14-Q03)

### 발문

세 점 \$A(1, 1)\$, \$B(5, 4)\$, \$C(1, 4)\$를 꼭짓점으로 하는 직각삼각형 \$ABC\$의 빗변의 길이는?

### 선지

① \$4\$ ② \$\\sqrt{17}\$ ③ \$5\$ ④ \$\\sqrt{26}\$ ⑤ \$6\$

### 정답

③

### 해설

세 점 \$A(1, 1)\$, \$B(5, 4)\$, \$C(1, 4)\$에 대하여 두 변 \$AC\$, \$BC\$의 길이를 구하면 \$\\overline{AC} \= \\sqrt{(1 \- 1)^2 \+ (4 \- 1)^2} \= 3\$ \$\\overline{BC} \= \\sqrt{(5 \- 1)^2 \+ (4 \- 4)^2} \= 4\$ \$\\angle C \= 90^\\circ\$이므로 빗변 \$AB\$의 길이는 \$\\overline{AB} \= \\sqrt{3^2 \+ 4^2} \= \\sqrt{25} \= 5\$

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "세 꼭짓점 좌표로 직각삼각형의 빗변 길이를 구하는 문항이다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "피타고라스 정리를 적용해 빗변 AB의 길이를 구하는 대수 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-01",
  "subUnitKey": "H22-C2-01-COORDINATE_METRIC",
  "rpm": "H1-RPM-205",
  "difficultyBucket": 1,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "직각삼각형",
      "꼭짓점",
      "좌표"
    ],
    "goal": [
      "길이"
    ],
    "method": [
      "거리",
      "피타고라스정리"
    ],
    "condition": []
  }
}
```

## 문항 04 (P14-Q04)

### 발문

두 점 \$A(1, 4)\$, \$B(5, 2)\$에서 같은 거리에 있는 \$x\$축 위의 점 \$P\$의 \$x\$좌표는?

### 선지

① \$\\dfrac{3}{2}\$ ② \$\\dfrac{7}{4}\$ ③ \$2\$ ④ \$\\dfrac{9}{4}\$ ⑤ \$\\dfrac{5}{2}\$

### 정답

①

### 해설

점 \$P\$는 \$x\$축 위의 점이므로 좌표를 \$(x, 0)\$이라 하자. \$\\overline{AP} \= \\overline{BP}\$에서 \$\\overline{AP}^2 \= \\overline{BP}^2\$이므로 \$(x \- 1)^2 \+ (0 \- 4)^2 \= (x \- 5)^2 \+ (0 \- 2)^2\$ \$x^2 \- 2x \+ 1 \+ 16 \= x^2 \- 10x \+ 25 \+ 4\$ \$x^2 \- 2x \+ 17 \= x^2 \- 10x \+ 29\$ \$8x \= 12\$ \$x \= \\dfrac{12}{8} \= \\dfrac{3}{2}\$

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "두 점의 좌표와 x축 위 조건이 주어져 식으로 풀리는 문항이다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "거리 제곱 등식을 세워 일차방정식을 푸는 대수 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-01",
  "subUnitKey": "H22-C2-01-COORDINATE_METRIC",
  "rpm": "H1-RPM-204",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "점",
      "좌표"
    ],
    "goal": [
      "좌표",
      "값"
    ],
    "method": [
      "거리",
      "일차방정식"
    ],
    "condition": [
      "등거리",
      "좌표축"
    ]
  }
}
```

## 문항 05 (P14-Q05)

### 발문

두 점 \$A(2, 1)\$, \$B(4, 3)\$에서 같은 거리에 있는 직선 \$y \= 2x\$ 위의 점 \$P\$의 \$x\$좌표는?

### 선지

① \$\\dfrac{4}{3}\$ ② \$\\dfrac{5}{3}\$ ③ \$2\$ ④ \$\\dfrac{7}{3}\$ ⑤ \$\\dfrac{8}{3}\$

### 정답

②

### 해설

점 \$P\$는 직선 \$y \= 2x\$ 위의 점이므로 좌표를 \$(t, 2t)\$라 하자. \$\\overline{AP} \= \\overline{BP}\$에서 \$\\overline{AP}^2 \= \\overline{BP}^2\$이므로 \$(t \- 2)^2 \+ (2t \- 1)^2 \= (t \- 4)^2 \+ (2t \- 3)^2\$ \$(t^2 \- 4t \+ 4\) \+ (4t^2 \- 4t \+ 1\) \= (t^2 \- 8t \+ 16\) \+ (4t^2 \- 12t \+ 9)\$ \$5t^2 \- 8t \+ 5 \= 5t^2 \- 20t \+ 25\$ \$12t \= 20\$ \$t \= \\dfrac{20}{12} \= \\dfrac{5}{3}\$ 따라서 점 \$P\$의 \$x\$좌표는 \$\\dfrac{5}{3}\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "직선 y=2x 위의 점 좌표를 매개변수로 두어 푸는 문항이다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "점 P(t, 2t)를 놓고 거리 제곱 등식을 푸는 대수 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-01",
  "subUnitKey": "H22-C2-01-COORDINATE_METRIC",
  "rpm": "H1-RPM-204",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "점",
      "좌표",
      "직선"
    ],
    "goal": [
      "좌표",
      "값"
    ],
    "method": [
      "거리",
      "일차방정식"
    ],
    "condition": [
      "등거리"
    ]
  }
}
```

## 문항 06 (P14-Q06)

### 발문

두 점 \$A(-3, 0)\$, \$B(5, 0)\$에서 같은 거리에 있는 직선 \$x \= k\$에 대하여, 상수 \$k\$의 값은?

### 선지

① \$-1\$ ② \$0\$ ③ \$1\$ ④ \$2\$ ⑤ \$3\$

### 정답

③

### 해설

두 점 \$A(-3, 0)\$, \$B(5, 0)\$에서 같은 거리에 있는 점들의 집합은 선분 \$AB\$의 수직이등분선이다. 선분 \$AB\$의 중점의 좌표는 \$\\left(\\dfrac{-3 \+ 5}{2}, \\dfrac{0 \+ 0}{2}\\right) \= (1, 0)\$ 선분 \$AB\$는 \$x\$축 위에 있으므로 수직이등분선은 점 \$(1, 0)\$을 지나고 \$y\$축에 평행한 직선 \$x \= 1\$이다. 따라서 \$k \= 1\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "x축 위의 두 점에서 같은 거리에 있는 직선을 구하는 문항이다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "선분 AB의 중점의 x좌표를 구하는 산술 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-01",
  "subUnitKey": "H22-C2-01-COORDINATE_METRIC",
  "rpm": "H1-RPM-204",
  "difficultyBucket": 1,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "점",
      "좌표",
      "직선"
    ],
    "goal": [
      "매개변수",
      "값"
    ],
    "method": [
      "수직이등분선",
      "중점"
    ],
    "condition": [
      "등거리",
      "상수"
    ]
  }
}
```

## 문항 07 (P14-Q07)

### 발문

세 점 \$A(1, 2)\$, \$B(4, 5)\$, \$C(1, 8)\$에 대하여 \$\\overline{AB}^2 \+ \\overline{BC}^2\$의 값은?

### 선지

① \$30\$ ② \$32\$ ③ \$34\$ ④ \$36\$ ⑤ \$38\$

### 정답

④

### 해설

두 변의 길이의 제곱을 각각 구하면 \$\\overline{AB}^2 \= (4 \- 1)^2 \+ (5 \- 2)^2 \= 3^2 \+ 3^2 \= 9 \+ 9 \= 18\$ \$\\overline{BC}^2 \= (1 \- 4)^2 \+ (8 \- 5)^2 \= (-3)^2 \+ 3^2 \= 9 \+ 9 \= 18\$ 따라서 \$\\overline{AB}^2 \+ \\overline{BC}^2 \= 18 \+ 18 \= 36\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "세 점의 좌표로 선분 길이의 제곱합을 구하는 문항이다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "거리 제곱을 각각 계산해 더하는 대수 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-01",
  "subUnitKey": "H22-C2-01-COORDINATE_METRIC",
  "rpm": "H1-RPM-204",
  "difficultyBucket": 1,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "점",
      "좌표"
    ],
    "goal": [
      "합",
      "값"
    ],
    "method": [
      "거리"
    ],
    "condition": []
  }
}
```

## 문항 08 (P14-Q08)

### 발문

세 점 \$O(0, 0)\$, \$A(2, 0)\$, \$B(1, \\sqrt{3})\$을 꼭짓점으로 하는 삼각형 \$OAB\$의 넓이는?

### 선지

① \$\\dfrac{\\sqrt{3}}{3}\$ ② \$\\dfrac{\\sqrt{3}}{2}\$ ③ \$1\$ ④ \$\\sqrt{2}\$ ⑤ \$\\sqrt{3}\$

### 정답

⑤

### 해설

두 점 \$O(0, 0)\$, \$A(2, 0)\$은 \$x\$축 위에 있으므로 밑변 \$OA\$의 길이는 \$\\overline{OA} \= 2 \- 0 \= 2\$ 꼭짓점 \$B(1, \\sqrt{3})\$에서 \$x\$축까지의 거리가 삼각형 \$OAB\$의 높이이므로 높이는 \$\\sqrt{3}\$이다. 따라서 삼각형 \$OAB\$의 넓이는 \$\\dfrac{1}{2} \\times 2 \\times \\sqrt{3} \= \\sqrt{3}\$

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "세 꼭짓점 좌표가 주어져 밑변과 높이로 넓이를 구하는 문항이다."
  },
  "solutionPlan": {
    "capability": "construction-spike-v1",
    "mathPlan": {
      "realization": {
        "recipeId": "SOURCE_COORDINATE_AXES_v1",
        "unit": "source-coordinate",
        "reflectionEquivalent": false
      },
      "nodes": [
        {
          "id": "O",
          "op": "NORMALIZATION_ORIGIN",
          "outputType": "POINT"
        },
        {
          "id": "A",
          "op": "SOURCE_POINT",
          "outputType": "POINT",
          "args": {
            "coordinates": [
              "2",
              "0"
            ]
          }
        },
        {
          "id": "B",
          "op": "SOURCE_POINT",
          "outputType": "POINT",
          "args": {
            "coordinates": [
              "1",
              "sqrt(3)"
            ]
          }
        }
      ]
    },
    "caption": "밑변 OA=2, 높이 √3인 삼각형 OAB의 넓이는 √3이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-01",
  "subUnitKey": "H22-C2-01-COORDINATE_METRIC",
  "rpm": "H1-RPM-205",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "삼각형",
      "꼭짓점",
      "좌표"
    ],
    "goal": [
      "넓이",
      "값"
    ],
    "method": [
      "거리"
    ],
    "condition": []
  }
}
```

## 문항 09 (P14-Q09)

### 발문

두 점 \$A(2, 1)\$, \$B(4, 5)\$와 \$x\$축 위의 점 \$P(x, 0)\$에 대하여 \$\\overline{AP}^2 \+ \\overline{BP}^2\$이 최소가 되도록 하는 \$x\$의 값은?

### 선지

① \$\\dfrac{5}{2}\$ ② \$3\$ ③ \$\\dfrac{7}{2}\$ ④ \$4\$ ⑤ \$\\dfrac{9}{2}\$

### 정답

②

### 해설

점 \$P(x, 0)\$에 대하여 \$\\overline{AP}^2 \+ \\overline{BP}^2\$을 \$x\$에 대한 식으로 나타내면 \$\\overline{AP}^2 \+ \\overline{BP}^2 \= {(x \- 2)^2 \+ (0 \- 1)^2} \+ {(x \- 4)^2 \+ (0 \- 5)^2}\$ \$= (x^2 \- 4x \+ 4 \+ 1\) \+ (x^2 \- 8x \+ 16 \+ 25)\$ \$= 2x^2 \- 12x \+ 46\$ \$= 2(x \- 3)^2 \+ 28\$ \$x\$는 실수이므로 \$x \= 3\$일 때 \$\\overline{AP}^2 \+ \\overline{BP}^2\$이 최소가 된다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "x축 위의 점에 대한 거리 제곱합의 최솟값 조건을 구하는 문항이다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "x에 대한 이차식을 완전제곱식으로 변형하는 대수 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-01",
  "subUnitKey": "H22-C2-01-COORDINATE_METRIC",
  "rpm": "H1-RPM-204",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "점",
      "좌표"
    ],
    "goal": [
      "좌표",
      "결정"
    ],
    "method": [
      "거리",
      "이차함수",
      "완전제곱식"
    ],
    "condition": [
      "좌표축"
    ]
  }
}
```

## 문항 10 (P14-Q10)

### 발문

두 점 \$A(0, 2)\$, \$B(6, 4)\$와 \$y\$축 위의 점 \$P(0, y)\$에 대하여 \$\\overline{AP}^2 \+ \\overline{BP}^2\$의 최솟값은?

### 선지

① \$38\$ ② \$40\$ ③ \$42\$ ④ \$44\$ ⑤ \$46\$

### 정답

①

### 해설

점 \$P(0, y)\$에 대하여 \$\\overline{AP}^2 \+ \\overline{BP}^2\$을 \$y\$에 대한 식으로 나타내면 \$\\overline{AP}^2 \+ \\overline{BP}^2 \= {(0 \- 0)^2 \+ (y \- 2)^2} \+ {(0 \- 6)^2 \+ (y \- 4)^2}\$ \$= (y^2 \- 4y \+ 4\) \+ (36 \+ y^2 \- 8y \+ 16)\$ \$= 2y^2 \- 12y \+ 56\$ \$= 2(y \- 3)^2 \+ 38\$ \$y\$는 실수이므로 \$(y \- 3)^2 \\ge 0\$이고, \$y \= 3\$일 때 최솟값은 \$38\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "y축 위의 점에 대한 거리 제곱합의 최솟값을 구하는 문항이다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "y에 대한 이차식을 완전제곱식으로 정리해 최솟값을 구하는 대수 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-01",
  "subUnitKey": "H22-C2-01-COORDINATE_METRIC",
  "rpm": "H1-RPM-204",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "점",
      "좌표"
    ],
    "goal": [
      "최솟값"
    ],
    "method": [
      "거리",
      "이차함수",
      "완전제곱식"
    ],
    "condition": [
      "좌표축"
    ]
  }
}
```

## 문항 11 (P14-Q11)

### 발문

세 점 \$A(1, 3)\$, \$B(2, 7)\$, \$C(6, 2)\$에 대하여 \$\\overline{AP}^2 \+ \\overline{BP}^2 \+ \\overline{CP}^2\$이 최소가 되는 점 \$P\$의 \$x\$좌표는?

### 선지

① \$2\$ ② \$\\dfrac{5}{2}\$ ③ \$3\$ ④ \$\\dfrac{7}{2}\$ ⑤ \$4\$

### 정답

③

### 해설

점 \$P\$의 좌표를 \$(x, y)\$라 하면 \$\\overline{AP}^2 \+ \\overline{BP}^2 \+ \\overline{CP}^2 \= (x-1)^2 \+ (y-3)^2 \+ (x-2)^2 \+ (y-7)^2 \+ (x-6)^2 \+ (y-2)^2\$ \$= (3x^2 \- 18x \+ 41\) \+ (3y^2 \- 24y \+ 62)\$ \$= 3(x \- 3)^2 \+ 3(y \- 4)^2 \+ 28\$ \$x\$, \$y\$는 실수이므로 \$x \= 3\$, \$y \= 4\$일 때 최소가 된다. 따라서 점 \$P\$의 \$x\$좌표는 \$3\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "세 점으로부터 거리 제곱의 합이 최소가 되는 점의 x좌표를 구하는 문항이다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "x, y에 대한 이차식을 각각 완전제곱식으로 변형하는 대수 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-01",
  "subUnitKey": "H22-C2-01-GEOMETRY_APPLICATION",
  "rpm": "H1-RPM-209",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "점",
      "좌표"
    ],
    "goal": [
      "좌표",
      "결정"
    ],
    "method": [
      "거리",
      "완전제곱식",
      "무게중심"
    ],
    "condition": []
  }
}
```

## 문항 12 (P14-Q12)

### 발문

두 점 \$A(-2, 3)\$, \$B(8, \-2)\$에 대하여 선분 \$AB\$를 \$2:3\$으로 내분하는 점의 좌표는?

### 선지

① \$(1, 1)\$ ② \$(2, 1)\$ ③ \$(2, 2)\$ ④ \$(3, 1)\$ ⑤ \$(3, 2)\$

### 정답

②

### 해설

선분 \$AB\$를 \$2:3\$으로 내분하는 점의 좌표 \$(x, y)\$는 \$x \= \\dfrac{2 \\times 8 \+ 3 \\times (-2)}{2 \+ 3} \= \\dfrac{16 \- 6}{5} \= \\dfrac{10}{5} \= 2\$ \$y \= \\dfrac{2 \\times (-2) \+ 3 \\times 3}{2 \+ 3} \= \\dfrac{-4 \+ 9}{5} \= \\dfrac{5}{5} \= 1\$ 따라서 구하는 내분점의 좌표는 \$(2, 1)\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "내분점 공식에 두 점의 좌표를 대입하는 기본 문항이다."
  },
  "solutionPlan": {
    "capability": "construction-spike-v1",
    "mathPlan": {
      "realization": {
        "recipeId": "SOURCE_COORDINATE_AXES_v1",
        "unit": "source-coordinate",
        "reflectionEquivalent": false
      },
      "nodes": [
        {
          "id": "O",
          "op": "NORMALIZATION_ORIGIN",
          "outputType": "POINT"
        },
        {
          "id": "A",
          "op": "SOURCE_POINT",
          "outputType": "POINT",
          "args": {
            "coordinates": [
              "-2",
              "3"
            ]
          }
        },
        {
          "id": "B",
          "op": "SOURCE_POINT",
          "outputType": "POINT",
          "args": {
            "coordinates": [
              "8",
              "-2"
            ]
          }
        },
        {
          "id": "P",
          "op": "DIVISION_POINT",
          "inputs": [
            "A",
            "B"
          ],
          "outputType": "POINT",
          "args": {
            "m": "2",
            "n": "3",
            "mode": "INTERNAL"
          }
        }
      ]
    },
    "caption": "선분 AB를 2:3으로 내분하는 점 P의 좌표는 (2, 1)이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-01",
  "subUnitKey": "H22-C2-01-GEOMETRY_APPLICATION",
  "rpm": "H1-RPM-206",
  "difficultyBucket": 1,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "점",
      "좌표",
      "선분",
      "비율"
    ],
    "goal": [
      "좌표",
      "결정"
    ],
    "method": [
      "내분"
    ],
    "condition": []
  }
}
```

## 문항 13 (P14-Q13)

### 발문

두 점 \$A(1, 4)\$, \$B(5, 8)\$에 대하여 선분 \$AB\$를 \$3:1\$로 외분하는 점의 좌표는?

### 선지

① \$(5, 8)\$ ② \$(6, 9)\$ ③ \$(6, 10)\$ ④ \$(7, 9)\$ ⑤ \$(7, 10)\$

### 정답

⑤

### 해설

선분 \$AB\$를 \$3:1\$로 외분하는 점의 좌표 \$(x, y)\$는 \$x \= \\dfrac{3 \\times 5 \- 1 \\times 1}{3 \- 1} \= \\dfrac{15 \- 1}{2} \= \\dfrac{14}{2} \= 7\$ \$y \= \\dfrac{3 \\times 8 \- 1 \\times 4}{3 \- 1} \= \\dfrac{24 \- 4}{2} \= \\dfrac{20}{2} \= 10\$ 따라서 구하는 외분점의 좌표는 \$(7, 10)\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "외분점 공식에 두 점의 좌표를 대입하는 기본 문항이다."
  },
  "solutionPlan": {
    "capability": "construction-spike-v1",
    "mathPlan": {
      "realization": {
        "recipeId": "SOURCE_COORDINATE_AXES_v1",
        "unit": "source-coordinate",
        "reflectionEquivalent": false
      },
      "nodes": [
        {
          "id": "O",
          "op": "NORMALIZATION_ORIGIN",
          "outputType": "POINT"
        },
        {
          "id": "A",
          "op": "SOURCE_POINT",
          "outputType": "POINT",
          "args": {
            "coordinates": [
              "1",
              "4"
            ]
          }
        },
        {
          "id": "B",
          "op": "SOURCE_POINT",
          "outputType": "POINT",
          "args": {
            "coordinates": [
              "5",
              "8"
            ]
          }
        },
        {
          "id": "Q",
          "op": "DIVISION_POINT",
          "inputs": [
            "A",
            "B"
          ],
          "outputType": "POINT",
          "args": {
            "m": "3",
            "n": "1",
            "mode": "EXTERNAL"
          }
        }
      ]
    },
    "caption": "선분 AB를 3:1로 외분하는 점 Q의 좌표는 (7, 10)이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-01",
  "subUnitKey": "H22-C2-01-GEOMETRY_APPLICATION",
  "rpm": "H1-RPM-207",
  "difficultyBucket": 1,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "점",
      "좌표",
      "선분",
      "비율"
    ],
    "goal": [
      "좌표",
      "결정"
    ],
    "method": [
      "외분"
    ],
    "condition": []
  }
}
```

## 문항 14 (P14-Q14)

### 발문

선분 \$AB\$의 중점이 \$M(3, 4)\$이고 점 \$A\$의 좌표가 \$(1, 2)\$일 때, 점 \$B\$의 좌표는?

### 선지

① \$(5, 6)\$ ② \$(5, 7)\$ ③ \$(6, 6)\$ ④ \$(6, 7)\$ ⑤ \$(7, 8)\$

### 정답

①

### 해설

점 \$B\$의 좌표를 \$(x, y)\$라 하면 선분 \$AB\$의 중점이 \$M(3, 4)\$이므로 \$\\dfrac{1 \+ x}{2} \= 3 \\implies 1 \+ x \= 6 \\implies x \= 5\$ \$\\dfrac{2 \+ y}{2} \= 4 \\implies 2 \+ y \= 8 \\implies y \= 6\$ 따라서 점 \$B\$의 좌표는 \$(5, 6)\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "중점 공식으로 끝점 좌표를 역산하는 문항이다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "중점 좌표 등식에서 일차방정식을 푸는 대수 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-01",
  "subUnitKey": "H22-C2-01-GEOMETRY_APPLICATION",
  "rpm": "H1-RPM-206",
  "difficultyBucket": 1,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "점",
      "좌표",
      "선분",
      "중점"
    ],
    "goal": [
      "좌표",
      "복원"
    ],
    "method": [
      "중점",
      "일차방정식"
    ],
    "condition": []
  }
}
```

## 문항 15 (P14-Q15)

### 발문

세 점 \$A(a, b)\$, \$B(1, 2)\$, \$C(3, 4)\$를 꼭짓점으로 하는 삼각형 \$ABC\$의 무게중심의 좌표가 \$(2, 3)\$일 때, \$a \+ b\$의 값은?

### 선지

① \$2\$ ② \$3\$ ③ \$4\$ ④ \$5\$ ⑤ \$6\$

### 정답

④

### 해설

삼각형 \$ABC\$의 무게중심의 좌표가 \$(2, 3)\$이므로 \$\\dfrac{a \+ 1 \+ 3}{3} \= 2 \\implies a \+ 4 \= 6 \\implies a \= 2\$ \$\\dfrac{b \+ 2 \+ 4}{3} \= 3 \\implies b \+ 6 \= 9 \\implies b \= 3\$ 따라서 \$a \+ b \= 2 \+ 3 \= 5\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "무게중심 공식으로 꼭짓점 미지수를 구하는 문항이다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "무게중심 좌표 등식에서 a, b를 구해 더하는 대수 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-01",
  "subUnitKey": "H22-C2-01-GEOMETRY_APPLICATION",
  "rpm": "H1-RPM-208",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "삼각형",
      "꼭짓점",
      "무게중심",
      "좌표"
    ],
    "goal": [
      "매개변수",
      "합",
      "값"
    ],
    "method": [
      "무게중심",
      "일차방정식"
    ],
    "condition": []
  }
}
```

## 문항 16 (P15-Q01)

### 발문

세 점 \$A(0, 0)\$, \$B(6, 0)\$, \$C(3, 9)\$를 꼭짓점으로 하는 삼각형 \$ABC\$의 무게중심 \$G\$의 좌표는?

### 선지

① \$(2, 2)\$ ② \$(2, 3)\$ ③ \$(2, 4)\$ ④ \$(3, 2)\$ ⑤ \$(3, 3)\$

### 정답

⑤

### 해설

삼각형 \$ABC\$의 무게중심 \$G\$의 좌표는 \$G\\left(\\dfrac{0 \+ 6 \+ 3}{3}, \\dfrac{0 \+ 0 \+ 9}{3}\\right) \= \\left(\\dfrac{9}{3}, \\dfrac{9}{3}\\right) \= (3, 3)\$

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "세 꼭짓점 좌표로 무게중심을 구하는 기본 문항이다."
  },
  "solutionPlan": {
    "capability": "construction-spike-v1",
    "mathPlan": {
      "realization": {
        "recipeId": "SOURCE_COORDINATE_AXES_v1",
        "unit": "source-coordinate",
        "reflectionEquivalent": false
      },
      "nodes": [
        {
          "id": "O",
          "op": "NORMALIZATION_ORIGIN",
          "outputType": "POINT"
        },
        {
          "id": "A",
          "op": "SOURCE_POINT",
          "outputType": "POINT",
          "args": {
            "coordinates": [
              "0",
              "0"
            ]
          }
        },
        {
          "id": "B",
          "op": "SOURCE_POINT",
          "outputType": "POINT",
          "args": {
            "coordinates": [
              "6",
              "0"
            ]
          }
        },
        {
          "id": "C",
          "op": "SOURCE_POINT",
          "outputType": "POINT",
          "args": {
            "coordinates": [
              "3",
              "9"
            ]
          }
        },
        {
          "id": "G",
          "op": "CENTROID",
          "inputs": [
            "A",
            "B",
            "C"
          ],
          "outputType": "POINT",
          "args": {}
        }
      ]
    },
    "caption": "세 점 A(0, 0), B(6, 0), C(3, 9)를 꼭짓점으로 하는 삼각형 ABC의 무게중심 G는 (3, 3)이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-01",
  "subUnitKey": "H22-C2-01-GEOMETRY_APPLICATION",
  "rpm": "H1-RPM-208",
  "difficultyBucket": 1,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "삼각형",
      "꼭짓점",
      "좌표"
    ],
    "goal": [
      "무게중심",
      "좌표"
    ],
    "method": [
      "무게중심"
    ],
    "condition": []
  }
}
```

## 문항 17 (P15-Q02)

### 발문

세 점 \$A(1, 1)\$, \$B(4, 2)\$, \$C(6, 6)\$에 대하여 사각형 \$ABCD\$가 평행사변형이 되도록 하는 점 \$D\$의 좌표는?

### 선지

① \$(2, 4)\$ ② \$(3, 4)\$ ③ \$(3, 5)\$ ④ \$(4, 5)\$ ⑤ \$(4, 6)\$

### 정답

③

### 해설

평행사변형 \$ABCD\$에서 두 대각선 \$AC\$와 \$BD\$의 중점은 서로 일치한다. 선분 \$AC\$의 중점의 좌표는 \$\\left(\\dfrac{1 \+ 6}{2}, \\dfrac{1 \+ 6}{2}\\right) \= \\left(\\dfrac{7}{2}, \\dfrac{7}{2}\\right)\$ 점 \$D\$의 좌표를 \$(x, y)\$라 하면 선분 \$BD\$의 중점도 \$\\left(\\dfrac{7}{2}, \\dfrac{7}{2}\\right)\$이므로 \$\\dfrac{4 \+ x}{2} \= \\dfrac{7}{2} \\implies x \= 3\$ \$\\dfrac{2 \+ y}{2} \= \\dfrac{7}{2} \\implies y \= 5\$ 따라서 점 \$D\$의 좌표는 \$(3, 5)\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "평행사변형의 대각선 중점 일치 성질로 네 번째 꼭짓점을 구하는 문항이다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "두 대각선의 중점 좌표가 같다는 등식을 푸는 대수 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-01",
  "subUnitKey": "H22-C2-01-GEOMETRY_APPLICATION",
  "rpm": "H1-RPM-209",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "평행사변형",
      "꼭짓점",
      "좌표"
    ],
    "goal": [
      "좌표",
      "결정"
    ],
    "method": [
      "대각선",
      "중점"
    ],
    "condition": []
  }
}
```

## 문항 18 (P15-Q03)

### 발문

평행사변형 \$ABCD\$에서 두 대각선의 교점의 좌표가 \$(2, 3)\$이고 점 \$A\$의 좌표가 \$(-1, 1)\$일 때, 꼭짓점 \$C\$의 좌표는?

### 선지

① \$(4, 4)\$ ② \$(5, 5)\$ ③ \$(5, 6)\$ ④ \$(6, 5)\$ ⑤ \$(6, 6)\$

### 정답

②

### 해설

평행사변형 \$ABCD\$에서 두 대각선의 교점 \$(2, 3)\$은 대각선 \$AC\$의 중점이다. 꼭짓점 \$C\$의 좌표를 \$(x, y)\$라 하면 \$\\dfrac{-1 \+ x}{2} \= 2 \\implies \-1 \+ x \= 4 \\implies x \= 5\$ \$\\dfrac{1 \+ y}{2} \= 3 \\implies 1 \+ y \= 6 \\implies y \= 5\$ 따라서 꼭짓점 \$C\$의 좌표는 \$(5, 5)\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "대각선 교점과 한 꼭짓점으로 마주 보는 꼭짓점을 구하는 문항이다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "중점 공식에 대입해 꼭짓점 C의 좌표를 구하는 대수 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-01",
  "subUnitKey": "H22-C2-01-GEOMETRY_APPLICATION",
  "rpm": "H1-RPM-209",
  "difficultyBucket": 1,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "평행사변형",
      "대각선",
      "교점",
      "꼭짓점",
      "좌표"
    ],
    "goal": [
      "좌표",
      "복원"
    ],
    "method": [
      "중점"
    ],
    "condition": []
  }
}
```

## 문항 19 (P15-Q04)

### 발문

네 점 \$A(0, 0)\$, \$B(4, 0)\$, \$C(5, 3)\$, \$D(1, 3)\$을 꼭짓점으로 하는 사각형 \$ABCD\$의 넓이는?

### 선지

① \$9\$ ② \$10\$ ③ \$11\$ ④ \$12\$ ⑤ \$14\$

### 정답

④

### 해설

선분 \$AB\$는 \$x\$축 위에 있고, 선분 \$CD\$는 직선 \$y \= 3\$ 위에 있으므로 \$\\overline{AB} \\parallel \\overline{CD}\$이다. 또한 \$\\overline{AB} \= 4 \- 0 \= 4\$, \$\\overline{DC} \= 5 \- 1 \= 4\$이므로 사각형 \$ABCD\$는 밑변의 길이가 \$4\$, 높이가 \$3\$인 평행사변형이다. 따라서 사각형 \$ABCD\$의 넓이는 \$4 \\times 3 \= 12\$

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "네 꼭짓점의 좌표가 주어져 밑변과 높이로 넓이를 구하는 문항이다."
  },
  "solutionPlan": {
    "capability": "construction-spike-v1",
    "mathPlan": {
      "realization": {
        "recipeId": "SOURCE_COORDINATE_AXES_v1",
        "unit": "source-coordinate",
        "reflectionEquivalent": false
      },
      "nodes": [
        {
          "id": "O",
          "op": "NORMALIZATION_ORIGIN",
          "outputType": "POINT"
        },
        {
          "id": "B",
          "op": "SOURCE_POINT",
          "outputType": "POINT",
          "args": {
            "coordinates": [
              "4",
              "0"
            ]
          }
        },
        {
          "id": "C",
          "op": "SOURCE_POINT",
          "outputType": "POINT",
          "args": {
            "coordinates": [
              "5",
              "3"
            ]
          }
        },
        {
          "id": "D",
          "op": "SOURCE_POINT",
          "outputType": "POINT",
          "args": {
            "coordinates": [
              "1",
              "3"
            ]
          }
        }
      ]
    },
    "caption": "밑변 AB=4, 높이 3인 평행사변형 ABCD의 넓이는 12이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-01",
  "subUnitKey": "H22-C2-01-GEOMETRY_APPLICATION",
  "rpm": "H1-RPM-209",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "평행사변형",
      "꼭짓점",
      "좌표"
    ],
    "goal": [
      "넓이",
      "값"
    ],
    "method": [
      "거리"
    ],
    "condition": []
  }
}
```

## 문항 20 (P15-Q05)

### 발문

세 점 \$A(0, 0)\$, \$B(0, 3)\$, \$C(6, 0)\$을 꼭짓점으로 하는 삼각형 \$ABC\$에서 \$\\angle A\$의 이등분선이 변 \$BC\$와 만나는 점 \$D\$의 좌표는?

### 선지

① \$(2, 2)\$ ② \$(2, 3)\$ ③ \$(3, 1)\$ ④ \$(3, 2)\$ ⑤ \$(3, 3)\$

### 정답

①

### 해설

세 점 \$A(0, 0)\$, \$B(0, 3)\$, \$C(6, 0)\$에 대하여 두 변 \$AB\$, \$AC\$의 길이는 \$\\overline{AB} \= 3\$, \$\\overline{AC} \= 6\$ 삼각형의 내각의 이등분선의 성질에 의하여 \$\\overline{BD} : \\overline{DC} \= \\overline{AB} : \\overline{AC} \= 3 : 6 \= 1 : 2\$ 따라서 점 \$D\$는 선분 \$BC\$를 \$1:2\$로 내분하는 점이므로 점 \$D\$의 좌표는 \$D\\left(\\dfrac{1 \\times 6 \+ 2 \\times 0}{1 \+ 2}, \\dfrac{1 \\times 0 \+ 2 \\times 3}{1 \+ 2}\\right) \= \\left(\\dfrac{6}{3}, \\dfrac{6}{3}\\right) \= (2, 2)\$

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "직각삼각형과 각의 이등분선 조건만으로 충분히 파악되는 문항이다."
  },
  "solutionPlan": {
    "capability": "construction-spike-v1",
    "mathPlan": {
      "realization": {
        "recipeId": "SOURCE_COORDINATE_AXES_v1",
        "unit": "source-coordinate",
        "reflectionEquivalent": false
      },
      "nodes": [
        {
          "id": "O",
          "op": "NORMALIZATION_ORIGIN",
          "outputType": "POINT"
        },
        {
          "id": "B",
          "op": "SOURCE_POINT",
          "outputType": "POINT",
          "args": {
            "coordinates": [
              "0",
              "3"
            ]
          }
        },
        {
          "id": "C",
          "op": "SOURCE_POINT",
          "outputType": "POINT",
          "args": {
            "coordinates": [
              "6",
              "0"
            ]
          }
        },
        {
          "id": "D",
          "op": "DIVISION_POINT",
          "inputs": [
            "B",
            "C"
          ],
          "outputType": "POINT",
          "args": {
            "m": "1",
            "n": "2",
            "mode": "INTERNAL"
          }
        }
      ]
    },
    "caption": "∠A의 이등분선이 변 BC와 만나는 점 D는 선분 BC를 1:2로 내분하는 점 (2, 2)이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-01",
  "subUnitKey": "H22-C2-01-GEOMETRY_APPLICATION",
  "rpm": "H1-RPM-206",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "삼각형",
      "꼭짓점",
      "좌표",
      "각이등분선"
    ],
    "goal": [
      "좌표",
      "결정"
    ],
    "method": [
      "각의이등분선정리",
      "내분"
    ],
    "condition": []
  }
}
```

## 문항 21 (P15-Q06)

### 발문

삼각형 \$ABC\$에서 \$\\overline{AB} \= 6\$, \$\\overline{AC} \= 4\$이고 \$\\angle A\$의 이등분선이 변 \$BC\$와 만나는 점을 \$D\$라 할 때, \$\\overline{BD} : \\overline{DC}\$는?

### 선지

① \$3:2\$ ② \$4:3\$ ③ \$5:3\$ ④ \$5:4\$ ⑤ \$2:1\$

### 정답

①

### 해설

삼각형 \$ABC\$에서 \$\\angle A\$의 이등분선이 변 \$BC\$와 만나는 점이 \$D\$이므로 내각의 이등분선의 성질에 의하여 \$\\overline{BD} : \\overline{DC} \= \\overline{AB} : \\overline{AC} \= 6 : 4 \= 3 : 2\$

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "삼각형의 각의 이등분선 정리를 직접 적용하는 개념 문항이다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "두 변의 길이의 비를 간단히 하는 산술 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-01",
  "subUnitKey": "H22-C2-01-GEOMETRY_APPLICATION",
  "rpm": "H1-RPM-206",
  "difficultyBucket": 1,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "삼각형",
      "길이",
      "각이등분선"
    ],
    "goal": [
      "비율"
    ],
    "method": [
      "각의이등분선정리"
    ],
    "condition": []
  }
}
```

## 문항 22 (P15-Q07)

### 발문

좌표평면 위의 두 점 \$A(0, 4)\$, \$B(3, 0)\$과 원점 \$O\$에 대하여 \$\\angle O\$의 이등분선이 선분 \$AB\$와 만나는 점의 \$x\$좌표는?

### 선지

① \$\\dfrac{10}{7}\$ ② \$\\dfrac{11}{7}\$ ③ \$\\dfrac{12}{7}\$ ④ \$\\dfrac{13}{7}\$ ⑤ \$2\$

### 정답

③

### 해설

두 점 \$A(0, 4)\$, \$B(3, 0)\$과 원점 \$O(0, 0)\$에 대하여 \$\\overline{OA} \= 4\$, \$\\overline{OB} \= 3\$ \$\\angle O\$의 이등분선이 선분 \$AB\$와 만나는 점을 \$D\$라 하면 내각의 이등분선의 성질에 의하여 \$\\overline{AD} : \\overline{DB} \= \\overline{OA} : \\overline{OB} \= 4 : 3\$ 따라서 점 \$D\$는 선분 \$AB\$를 \$4:3\$으로 내분하는 점이므로 점 \$D\$의 \$x\$좌표는 \$\\dfrac{4 \\times 3 \+ 3 \\times 0}{4 \+ 3} \= \\dfrac{12}{7}\$

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "좌표축 위의 직각삼각형과 각의 이등분선 조건만으로 충분히 파악되는 문항이다."
  },
  "solutionPlan": {
    "capability": "construction-spike-v1",
    "mathPlan": {
      "realization": {
        "recipeId": "SOURCE_COORDINATE_AXES_v1",
        "unit": "source-coordinate",
        "reflectionEquivalent": false
      },
      "nodes": [
        {
          "id": "O",
          "op": "NORMALIZATION_ORIGIN",
          "outputType": "POINT"
        },
        {
          "id": "A",
          "op": "SOURCE_POINT",
          "outputType": "POINT",
          "args": {
            "coordinates": [
              "0",
              "4"
            ]
          }
        },
        {
          "id": "B",
          "op": "SOURCE_POINT",
          "outputType": "POINT",
          "args": {
            "coordinates": [
              "3",
              "0"
            ]
          }
        },
        {
          "id": "D",
          "op": "DIVISION_POINT",
          "inputs": [
            "A",
            "B"
          ],
          "outputType": "POINT",
          "args": {
            "m": "4",
            "n": "3",
            "mode": "INTERNAL"
          }
        }
      ]
    },
    "caption": "∠O의 이등분선이 선분 AB와 만나는 점 D는 선분 AB를 4:3으로 내분한다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-01",
  "subUnitKey": "H22-C2-01-GEOMETRY_APPLICATION",
  "rpm": "H1-RPM-206",
  "difficultyBucket": 2,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "직각삼각형",
      "꼭짓점",
      "좌표",
      "각이등분선"
    ],
    "goal": [
      "좌표",
      "값"
    ],
    "method": [
      "각의이등분선정리",
      "내분"
    ],
    "condition": []
  }
}
```

## 문항 23 (P15-Q08)

### 발문

점 \$(2, \-1)\$을 지나고 기울기가 \$4\$인 직선의 방정식은?

### 선지

① \$y \= 4x \- 13\$ ② \$y \= 4x \- 12\$ ③ \$y \= 4x \- 11\$ ④ \$y \= 4x \- 10\$ ⑤ \$y \= 4x \- 9\$

### 정답

⑤

### 해설

점 \$(2, \-1)\$을 지나고 기울기가 \$4\$인 직선의 방정식은 \$y \- (-1) \= 4(x \- 2)\$ \$y \+ 1 \= 4x \- 8\$ \$y \= 4x \- 9\$

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "한 점과 기울기로 직선의 방정식을 세우는 기본 문항이다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "직선의 방정식 공식에 대입해 전개하는 순수 대수 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-02",
  "subUnitKey": "H22-C2-02-LINE_EQUATION",
  "rpm": "H1-RPM-210",
  "difficultyBucket": 1,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "점",
      "좌표",
      "기울기"
    ],
    "goal": [
      "직선의방정식",
      "방정식구하기"
    ],
    "method": [
      "직선의방정식"
    ],
    "condition": []
  }
}
```

## 문항 24 (P15-Q09)

### 발문

점 \$(-3, 2)\$를 지나고 \$x\$축에 평행한 직선의 방정식은?

### 선지

① \$x \= \-3\$ ② \$x \= 2\$ ③ \$y \= \-3\$ ④ \$y \= 2\$ ⑤ \$y \= 0\$

### 정답

④

### 해설

\$x\$축에 평행한 직선은 직선 위의 모든 점의 \$y\$좌표가 서로 같다. 점 \$(-3, 2)\$를 지나므로 구하는 직선의 방정식은 \$y \= 2\$

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "x축에 평행한 직선의 방정식을 구하는 기본 개념 문항이다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "지나는 점의 y좌표가 일정함을 이용하는 개념 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-02",
  "subUnitKey": "H22-C2-02-LINE_EQUATION",
  "rpm": "H1-RPM-210",
  "difficultyBucket": 1,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "점",
      "좌표"
    ],
    "goal": [
      "직선의방정식",
      "방정식구하기"
    ],
    "method": [
      "직선의방정식"
    ],
    "condition": [
      "평행",
      "좌표축"
    ]
  }
}
```

## 문항 25 (P15-Q10)

### 발문

점 \$(4, \-5)\$를 지나고 \$y\$축에 평행한 직선의 방정식은?

### 선지

① \$x \= \-5\$ ② \$x \= 4\$ ③ \$y \= \-5\$ ④ \$y \= 4\$ ⑤ \$x \+ y \= \-1\$

### 정답

②

### 해설

\$y\$축에 평행한 직선은 직선 위의 모든 점의 \$x\$좌표가 서로 같다. 점 \$(4, \-5)\$를 지나므로 구하는 직선의 방정식은 \$x \= 4\$

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "y축에 평행한 직선의 방정식을 구하는 기본 개념 문항이다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "지나는 점의 x좌표가 일정함을 이용하는 개념 풀이이다."
  }
}
```

```
{
  "curriculum": "2022",
  "standardCourse": "공통수학2",
  "standardUnitKey": "H22-C2-02",
  "subUnitKey": "H22-C2-02-LINE_EQUATION",
  "rpm": "H1-RPM-210",
  "difficultyBucket": 1,
  "item4slot": {
    "format": "단일 정답",
    "given": [
      "점",
      "좌표"
    ],
    "goal": [
      "직선의방정식",
      "방정식구하기"
    ],
    "method": [
      "직선의방정식"
    ],
    "condition": [
      "평행",
      "좌표축"
    ]
  }
}
```

