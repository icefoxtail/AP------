window.examTitle = "미적분II_082_지수함수로그함수의극한의활용1_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "지수함수와 로그함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-03",
    "standardUnit": "지수함수와 로그함수의 미분",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "지수함수와 로그함수의 미분"
    ],
    "wide": false,
    "content": "곡선 $y=\\ln(1+6x)$의 제1사분면 위에 점 $P$를 잡는다. 원점 $O$에서 $P$를 잇는 선분과 $x$축의 양의 방향 사이 각을 $\\theta$라 할 때, $P$가 $O$에 가까워지면 $\\tan\\theta$는 어떤 값에 가까워지는가?\n[그림: 원점 $O$와 양의 $x$축을 표시한다. 곡선 $y=\\ln(1+6x)$에 $P=(t,\\ln(1+6t))$를 두고 $OP$를 그린 뒤 원점에 각 $\\theta$를 표시한다.]",
    "choices": [
      "$4$",
      "$6$",
      "$8$",
      "$10$",
      "$12$"
    ],
    "answer": "②",
    "solution": "점 $P$의 $x$좌표를 $t>0$이라 하면 $P=(t,\\ln(1+6t))$이고, 직선 $OP$의 기울기가 $\\tan\\theta$이므로 $$\\tan\\theta=\\frac{\\ln(1+6t)}{t}.$$\n분자를 변형하면 $$\\frac{\\ln(1+6t)}{t}=6\\cdot\\frac{\\ln(1+6t)}{6t}.$$\n$u=6t\\to0^+$로 놓으면 기본 극한 $\\lim_{u\\to0}\\frac{\\ln(1+u)}{u}=1$에 의해 $$\\lim_{t\\to0^+}6\\cdot\\frac{\\ln(1+6t)}{6t}=6\\lim_{u\\to0^+}\\frac{\\ln(1+u)}{u}=6\\cdot1=6.$$\n주의: $\\ln(1+6t)$를 $6t$로 근사하는 것이 아니라 비율의 극한이 $1$임을 이용한다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-146",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_EXP_LOG_STANDARD",
    "crossConceptKeys": [
      "CC_LINE_SLOPE_TANGENT"
    ],
    "conditionKeys": [],
    "integrationPattern": "REINTERPRETATION",
    "image": "assets/images/미적분II_082_지수함수로그함수의극한의활용1_고2_유형은행1/q1-problem.svg",
    "imageAlt": "자연로그 y=ln(1+6x)와 원점 O; 비정수 로그값 P·OP·θ는 ENGINE_CAPABILITY_PENDING.",
    "imageCaption": "자연로그 y=ln(1+6x)와 원점 O; 비정수 로그값 P·OP·θ는 ENGINE_CAPABILITY_PENDING.",
    "imageSize": "medium"
  },
  {
    "id": 2,
    "category": "지수함수와 로그함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-03",
    "standardUnit": "지수함수와 로그함수의 미분",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "지수함수와 로그함수의 미분"
    ],
    "wide": false,
    "content": "곡선 $y=\\ln(1+4x)$의 제1사분면 위의 점 $P$에서 $x$축에 내린 수선의 발을 $H$라 한다. $P$가 원점 $O$로 가까워질 때 $\\frac{\\overline{OH}}{\\overline{PH}}$의 극한값은?\n[그림: $P=(t,\\ln(1+4t))$와 $H=(t,0)$를 표시한다. $PH$를 수직으로 그리고 $H$에 직각 기호를 넣는다.]",
    "choices": [
      "$\\frac14$",
      "$\\frac13$",
      "$\\frac12$",
      "$\\frac34$",
      "$1$"
    ],
    "answer": "①",
    "solution": "$P=(t,\\ln(1+4t))$, $H=(t,0)$, $O=(0,0)$이므로 (두 점 사이의 거리) $\\overline{OH}=t$, $\\overline{PH}=\\ln(1+4t)$이다.\n따라서 $$\\frac{\\overline{OH}}{\\overline{PH}}=\\frac{t}{\\ln(1+4t)}.$$\n역수를 보면 $\\frac{\\ln(1+4t)}{t}=4\\cdot\\frac{\\ln(1+4t)}{4t}$이고, 기본 극한 $\\lim_{u\\to0}\\frac{\\ln(1+u)}{u}=1$에 의해 $\\to4\\cdot1=4$이다.\n역수의 극한이 $4$이므로 원래 비의 극한은 $\\frac14$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-146",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_EXP_LOG_STANDARD",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 3,
    "category": "지수함수와 로그함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-03",
    "standardUnit": "지수함수와 로그함수의 미분",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "지수함수와 로그함수의 미분"
    ],
    "wide": false,
    "content": "양의 $x$축 위의 점 $P=(t,0)$을 지나고 $y$축에 평행한 직선이 $y=3^x,y=5^x$와 만나는 점을 각각 $Q,R$이라 하자. $\\lim_{t\\to0^+}\\frac{\\overline{QR}}{\\overline{OP}}$의 값은?\n[그림: 두 지수곡선은 $(0,1)$을 지난다. 직선 $x=t$ 위에 아래부터 $P=(t,0),Q=(t,3^t),R=(t,5^t)$를 표시한다.]",
    "choices": [
      "$\\ln\\frac43$",
      "$\\ln\\frac53$",
      "$\\ln2$",
      "$\\ln3$",
      "$\\ln5$"
    ],
    "answer": "②",
    "solution": "$Q=(t,3^t)$, $R=(t,5^t)$, $P=(t,0)$이므로 $\\overline{QR}=5^t-3^t$, $\\overline{OP}=t$이다.\n따라서 $$\\frac{\\overline{QR}}{\\overline{OP}}=\\frac{5^t-3^t}{t}.$$\n분자를 나누면 $$\\frac{5^t-3^t}{t}=\\frac{(5^t-1)-(3^t-1)}{t}=\\frac{5^t-1}{t}-\\frac{3^t-1}{t}.$$\n기본 극한 $\\lim_{t\\to0}\\frac{a^t-1}{t}=\\ln a$를 각각 적용하면 극한은 $\\ln5-\\ln3$이다.\n로그의 성질로 $\\ln5-\\ln3=\\ln\\frac53$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-146",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_EXP_LOG_STANDARD",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 4,
    "category": "지수함수와 로그함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-03",
    "standardUnit": "지수함수와 로그함수의 미분",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "지수함수와 로그함수의 미분"
    ],
    "wide": false,
    "content": "직선 $x=t$가 두 곡선 $y=9^{x-2}$, $y=3^{x-2}$와 만나는 점을 각각 $A,B$라 하자. $\\lim_{t\\to2^-}\\frac{\\overline{AB}}{2-t}$의 값은?\n[그림: $(2,1)$을 지나는 두 지수곡선을 그린다. $t<2$인 수직선 $x=t$ 위에 아래부터 $A=(t,9^{t-2}),B=(t,3^{t-2})$를 표시한다.]",
    "choices": [
      "$\\frac12\\ln3$",
      "$\\frac23\\ln3$",
      "$\\ln3$",
      "$2\\ln3$",
      "$3\\ln3$"
    ],
    "answer": "③",
    "solution": "$u=t-2$로 놓으면 $t\\to2^-$일 때 $u\\to0^-$이고 $2-t=-u>0$이다.\n$A=(2+u,9^u)$, $B=(2+u,3^u)$이고 $u<0$이면 $9^u=3^{2u}<3^u$이므로 (밑이 $1$보다 큰 지수함수의 대소) $\\overline{AB}=3^u-9^u$이다.\n따라서 $$\\frac{\\overline{AB}}{2-t}=\\frac{3^u-9^u}{-u}=\\frac{9^u-3^u}{u}.$$\n분자를 나누면 $$\\frac{9^u-3^u}{u}=\\frac{9^u-1}{u}-\\frac{3^u-1}{u}.$$\n기본 극한 $\\lim_{u\\to0}\\frac{a^u-1}{u}=\\ln a$에 의해 극한은 $\\ln9-\\ln3=2\\ln3-\\ln3=\\ln3$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-146",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_EXP_LOG_STANDARD",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 5,
    "category": "지수함수와 로그함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-03",
    "standardUnit": "지수함수와 로그함수의 미분",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "지수함수와 로그함수의 미분"
    ],
    "wide": false,
    "content": "$a>e^2$일 때 곡선 $y=e^{2x-3}$과 $y=a^x$의 교점의 $x$좌표를 $p(a)$라 하자. $\\lim_{a\\to(e^2)^+}\\frac1{(e^2-a)p(a)}$의 값은?",
    "choices": [
      "$\\frac1{6e^2}$",
      "$\\frac1{5e^2}$",
      "$\\frac1{4e^2}$",
      "$\\frac2{7e^2}$",
      "$\\frac1{3e^2}$"
    ],
    "answer": "⑤",
    "solution": "교점의 $x$좌표가 $p$이므로 두 함숫값이 같다: $$e^{2p-3}=a^p.$$\n양변에 자연로그를 취하면 (로그의 성질) $$2p-3=p\\ln a.$$\n$p$에 대해 정리하면 $$p(2-\\ln a)=3,\\qquad p=\\frac{3}{2-\\ln a}.$$\n$a\\to(e^2)^+$이면 $\\ln a\\to2^+$이므로 $2-\\ln a\\to0^-$이고 $p\\to-\\infty$이다.\n구하는 식을 정리하면 $$\\frac{1}{(e^2-a)p}=\\frac{2-\\ln a}{3(e^2-a)}=\\frac{\\ln a-2}{3(a-e^2)}.$$\n$u=\\frac{a-e^2}{e^2}$로 놓으면 $u\\to0^+$이고 $a=e^2(1+u)$, $\\ln a=2+\\ln(1+u)$이다.\n대입하면 $$\\frac{\\ln a-2}{3(a-e^2)}=\\frac{\\ln(1+u)}{3e^2u}.$$\n기본 극한 $\\lim_{u\\to0^+}\\frac{\\ln(1+u)}{u}=1$을 적용하면 $$\\lim_{u\\to0^+}\\frac{\\ln(1+u)}{3e^2u}=\\frac{1}{3e^2}.$$\n주의: $e^2-a<0$, $p<0$이므로 곱은 양수이고, 부호를 정리해 $\\frac{\\ln a-2}{3(a-e^2)}$ 꼴로 바꾸어야 한다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-146",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_EXP_LOG_STANDARD",
    "crossConceptKeys": [
      "CC_GRAPH_INTERSECTION"
    ],
    "conditionKeys": [
      "COND_LOWER_BOUND"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
