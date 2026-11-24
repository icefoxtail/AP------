window.examTitle = "미적분II_030_함수의그래프에서등비수열의극한의활용_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "수열의 극한",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-01",
    "standardUnit": "수열의 극한",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "수열의 극한"
    ],
    "wide": false,
    "content": "직선 $x=n$이 $y=5^x$, $y=2^x$와 만나는 점을 각각 $P_n,Q_n$이라 하자. $\\lim_{n\\to\\infty}\\frac{\\overline{P_{n+1}Q_{n+1}}}{\\overline{P_nQ_n}}$은? [그림: 두 지수곡선을 그리고, 수직선 $x=n$ 위에 $P_n(n,5^n)$과 $Q_n(n,2^n)$을 찍어 잇는다.]",
    "choices": [
      "$4$",
      "$5$",
      "$6$",
      "$7$",
      "$8$"
    ],
    "answer": "②",
    "solution": "직선 $x=n$ 위의 두 점은 $P_n(n,5^n)$, $Q_n(n,2^n)$이므로 선분의 길이는\n$$\\overline{P_nQ_n}=5^n-2^n$$\n이다.\n$n+1$에서도 같은 방식으로\n$$\\overline{P_{n+1}Q_{n+1}}=5^{n+1}-2^{n+1}$$\n이다.\n구하는 극한은\n$$\\lim_{n\\to\\infty}\\frac{5^{n+1}-2^{n+1}}{5^n-2^n}$$\n이고, 분모와 분자를 $5^n$으로 나누면\n$$=\\lim_{n\\to\\infty}\\frac{5-2\\left(\\frac25\\right)^n}{1-\\left(\\frac25\\right)^n}$$\n이다.\n$0<\\frac25<1$이므로 $\\left(\\frac25\\right)^n\\to0$ (등비수열의 극한)이고,\n$$=\\frac{5-0}{1-0}=5$$\n이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-061",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_GEOMETRIC_RATIO",
    "crossConceptKeys": [
      "CC_EXPONENTIAL_FUNCTION_GRAPH",
      "CC_VERTICAL_SEGMENT_LENGTH"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 2,
    "category": "수열의 극한",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-01",
    "standardUnit": "수열의 극한",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "수열의 극한"
    ],
    "wide": false,
    "content": "직선 $x=9^n$과 곡선 $y=\\sqrt{x}$의 교점을 $P_n$이라 하고, $P_nP_{n+1}$의 길이를 $L_n$이라 하자. $\\lim_{n\\to\\infty}(L_{n+1}/L_n)^2$은? [그림: $y=\\sqrt{x}$를 그리고 $P_n(9^n,3^n)$과 $P_{n+1}(9^{n+1},3^{n+1})$을 직선으로 잇는다.]",
    "choices": [
      "$49$",
      "$64$",
      "$81$",
      "$100$",
      "$121$"
    ],
    "answer": "③",
    "solution": "직선 $x=9^n$과 $y=\\sqrt{x}$의 교점은\n$$P_n(9^n,\\sqrt{9^n})=(9^n,3^n)$$\n이고, $P_{n+1}=(9^{n+1},3^{n+1})=(9\\cdot9^n,3\\cdot3^n)$이다.\n두 점의 $x$좌표 차와 $y$좌표 차는 각각\n$$8\\cdot9^n,\\quad 2\\cdot3^n$$\n이므로 거리의 제곱은\n$$L_n^2=(8\\cdot9^n)^2+(2\\cdot3^n)^2=64\\cdot81^n+4\\cdot9^n$$\n이다.\n같은 방식으로\n$$L_{n+1}^2=64\\cdot81^{n+1}+4\\cdot9^{n+1}$$\n이다.\n따라서\n$$\\left(\\frac{L_{n+1}}{L_n}\\right)^2=\\frac{64\\cdot81^{n+1}+4\\cdot9^{n+1}}{64\\cdot81^n+4\\cdot9^n}$$\n이고, 분모와 분자를 $81^n$으로 나누면\n$$=\\frac{64\\cdot81+36\\left(\\frac19\\right)^n}{64+4\\left(\\frac19\\right)^n}$$\n이다.\n$\\left(\\frac19\\right)^n\\to0$ (등비수열의 극한)이므로\n$$=\\frac{5184}{64}=81$$\n이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-061",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_GEOMETRIC_RATIO",
    "crossConceptKeys": [
      "CC_RADICAL_FUNCTION",
      "CC_POINT_ON_CURVE_SUBSTITUTION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 3,
    "category": "수열의 극한",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-01",
    "standardUnit": "수열의 극한",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "수열의 극한"
    ],
    "wide": false,
    "content": "직선 $y=n$과 두 곡선 $y=\\log_4 x$, $y=\\log_4 x-2$의 교점을 각각 $A_n,B_n$이라 하자. 삼각형 $OA_nB_n$의 넓이를 $a_n$이라 할 때 $\\lim_{n\\to\\infty}a_n/a_{n+1}$은? [그림: 두 로그곡선과 수평선 $y=n$을 그린다. $A_n(4^n,n)$, $B_n(4^{n+2},n)$와 원점 $O$를 이어 삼각형을 표시한다.]",
    "choices": [
      "$\\frac18$",
      "$\\frac14$",
      "$\\frac38$",
      "$\\frac12$",
      "$\\frac58$"
    ],
    "answer": "②",
    "solution": "$y=n$과 $y=\\log_4 x$의 교점은 $\\log_4 x=n$에서\n$$A_n(4^n,n)$$\n이다.\n$y=n$과 $y=\\log_4 x-2$의 교점은 $\\log_4 x-2=n$, 즉 $\\log_4 x=n+2$에서\n$$B_n(4^{n+2},n)$$\n이다.\n두 점은 높이가 같으므로 삼각형 $OA_nB_n$의 밑변의 길이는\n$$4^{n+2}-4^n=16\\cdot4^n-4^n=15\\cdot4^n$$\n이다.\n원점 $O$에서 직선 $y=n$까지의 거리는 $n$이므로 넓이는\n$$a_n=\\frac12\\cdot15\\cdot4^n\\cdot n$$\n이다.\n같은 방식으로 $a_{n+1}=\\frac12\\cdot15\\cdot4^{n+1}(n+1)$이므로\n$$\\frac{a_n}{a_{n+1}}=\\frac{n\\cdot4^n}{(n+1)\\cdot4^{n+1}}=\\frac{n}{4(n+1)}$$\n이다.\n분모와 분자를 $n$으로 나누면\n$$\\lim_{n\\to\\infty}\\frac{1}{4\\left(1+\\frac1n\\right)}=\\frac14$$\n이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-061",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_GEOMETRIC_RATIO",
    "crossConceptKeys": [
      "CC_LOGARITHMIC_FUNCTION_GRAPH",
      "CC_GRAPH_INTERSECTION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 4,
    "category": "수열의 극한",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-01",
    "standardUnit": "수열의 극한",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "수열의 극한"
    ],
    "wide": false,
    "content": "$a>5$일 때 두 곡선 $y=a^{x-1}$, $y=5^x$의 교점의 $x$좌표를 $k$라 하자. $\\lim_{n\\to\\infty}\\frac{(a/5)^{n+k}}{(a/5)^{n+1}+1}$은? [그림: 두 지수곡선을 그려 교점 $P(k,5^k)$를 표시하고 $P$에서 $x$축 위 $(k,0)$에 수선을 내린다.]",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "⑤",
    "solution": "$a>5$이므로 $r=\\frac a5>1$이라 하자.\n교점의 $x$좌표가 $k$이므로\n$$a^{k-1}=5^k$$\n이다.\n양변을 $5^k$로 나누면\n$$\\frac{a^{k-1}}{5^k}=1$$\n이고, 이를 정리하면\n$$\\frac{a^k}{a}\\cdot\\frac1{5^k}=1\\quad\\Rightarrow\\quad\\left(\\frac a5\\right)^k=a$$\n이다.\n따라서\n$$\\left(\\frac a5\\right)^{k-1}=\\frac{\\left(\\frac a5\\right)^k}{\\frac a5}=\\frac{a}{\\frac a5}=5$$\n이다.\n구하는 극한에서 분모와 분자를 $\\left(\\frac a5\\right)^{n+1}$로 나누면\n$$\\lim_{n\\to\\infty}\\frac{\\left(\\frac a5\\right)^{n+k}}{\\left(\\frac a5\\right)^{n+1}+1}=\\lim_{n\\to\\infty}\\frac{\\left(\\frac a5\\right)^{k-1}}{1+\\left(\\frac a5\\right)^{-(n+1)}}$$\n이다.\n$\\frac a5>1$이므로 $\\left(\\frac a5\\right)^{-(n+1)}\\to0$ (등비수열의 극한)이고,\n$$=\\frac{5}{1+0}=5$$\n이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-061",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_GEOMETRIC_RATIO",
    "crossConceptKeys": [
      "CC_EXPONENTIAL_FUNCTION_GRAPH",
      "CC_GRAPH_INTERSECTION"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
