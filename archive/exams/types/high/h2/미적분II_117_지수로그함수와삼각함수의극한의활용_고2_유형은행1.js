window.examTitle = "미적분II_117_지수로그함수와삼각함수의극한의활용_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "삼각함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-04",
    "standardUnit": "삼각함수의 미분",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "삼각함수의 미분"
    ],
    "wide": false,
    "content": "$P=(x,3^x-1)$에서 $x$축에 내린 수선의 발이 $H$이다. $\\lim_{x\\to0^+}[OHP]/\\sin^2(2x)$는? [그림: $y=3^x-1$과 그 위의 $P$, $H=(x,0)$, 원점 $O$.]",
    "choices": [
      "$\\ln3/32$",
      "$\\ln3/24$",
      "$\\ln3/16$",
      "$\\ln3/12$",
      "$\\ln3/8$"
    ],
    "answer": "⑤",
    "solution": "$OH=x$, $PH=3^x-1$이므로 직각삼각형의 넓이는 $[OHP]=\\frac12 x(3^x-1)$이다.\n구하는 극한을 정리하면 $\\lim_{x\\to0^+}\\frac{x(3^x-1)}{2\\sin^2(2x)}$이다.\n지수함수의 극한 $\\lim_{x\\to0}\\frac{3^x-1}{x}=\\ln3$을 쓴다.\n또 $\\lim_{x\\to0}\\frac{\\sin 2x}{2x}=1$이므로 $\\frac{x^2}{\\sin^2(2x)}\\to\\frac14$이다.\n따라서 극한은 $\\frac12\\cdot\\ln3\\cdot\\frac14=\\frac{\\ln3}{8}$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-167",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_VALUE_CALC_STANDARD",
    "crossConceptKeys": [
      "CC_EXPONENTIAL_FUNCTION_GRAPH",
      "CC_FUNCTION_LIMIT"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 2,
    "category": "삼각함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-04",
    "standardUnit": "삼각함수의 미분",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "삼각함수의 미분"
    ],
    "wide": false,
    "content": "$P=(x,\\ln(1+6x))$에서 $x$축에 내린 수선의 발이 $H$이다. $\\lim_{x\\to0^+}[OHP]/\\sin^2x$는? [그림: 로그 곡선 위 $P$에서 $H=(x,0)$까지 수직선, 원점 $O$.]",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "②",
    "solution": "$OH=x$, $PH=\\ln(1+6x)$이므로 $[OHP]=\\frac12 x\\ln(1+6x)$이다.\n따라서 극한은 $\\lim_{x\\to0^+}\\frac{x\\ln(1+6x)}{2\\sin^2x}$이다.\n로그의 극한 $\\lim_{x\\to0}\\frac{\\ln(1+6x)}{x}=6$을 쓴다.\n또 $\\lim_{x\\to0}\\frac{\\sin x}{x}=1$이므로 $\\frac{x^2}{\\sin^2x}\\to1$이다.\n그러면 $\\frac12\\cdot6\\cdot1=3$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-167",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_VALUE_CALC_STANDARD",
    "crossConceptKeys": [
      "CC_LOGARITHMIC_FUNCTION_GRAPH",
      "CC_FUNCTION_LIMIT"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 3,
    "category": "삼각함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-04",
    "standardUnit": "삼각함수의 미분",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "삼각함수의 미분"
    ],
    "wide": false,
    "content": "직각삼각형 $ABC$에서 $\\angle A=90^\\circ$, $AB=6$, $\\angle B=\\theta$이다. $H$는 $A$에서 빗변에 내린 수선의 발이다. $\\lim_{\\theta\\to0^+}CH/[\\theta\\ln(1+3\\theta)]$는? [그림: $A=(0,0),B=(6,0),C=(0,6\\tan\\theta)$와 수선 $AH$.]",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "①",
    "solution": "$BC=\\frac{AB}{\\cos\\theta}=\\frac6{\\cos\\theta}$이고 $AC=6\\tan\\theta$이다.\n직각삼각형의 사영 정리에서 $AC^2=CH\\cdot CB$이다.\n따라서 $CH=\\frac{AC^2}{CB}=\\frac{36\\tan^2\\theta}{6/\\cos\\theta}=6\\tan^2\\theta\\cos\\theta=\\frac{6\\sin^2\\theta}{\\cos\\theta}$이다.\n구하는 극한은 $\\lim_{\\theta\\to0^+}\\frac{6\\sin^2\\theta}{\\cos\\theta\\cdot\\theta\\ln(1+3\\theta)}$이다.\n$\\lim_{\\theta\\to0}\\frac{\\sin\\theta}{\\theta}=1$이고 $\\lim_{\\theta\\to0}\\frac{\\ln(1+3\\theta)}{3\\theta}=1$에서 $\\frac{\\theta}{\\ln(1+3\\theta)}\\to\\frac13$이다.\n그러면 $\\frac{\\sin^2\\theta}{\\theta\\ln(1+3\\theta)}=\\left(\\frac{\\sin\\theta}{\\theta}\\right)^2\\frac{\\theta}{\\ln(1+3\\theta)}\\to1\\cdot\\frac13=\\frac13$이다.\n따라서 극한은 $6\\cdot\\frac13=2$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-167",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_VALUE_CALC_STANDARD",
    "crossConceptKeys": [
      "CC_LOGARITHMIC_FUNCTION_GRAPH",
      "CC_TRIG_RATIO"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/미적분II_117_지수로그함수와삼각함수의극한의활용_고2_유형은행1/q3-problem.svg",
    "imageAlt": "직각삼각형 ABC에서 AB=6, ∠B=θ와 빗변 BC에 내린 수선 AH를 표시한다.",
    "imageCaption": "직각삼각형 ABC에서 AB=6, ∠B=θ와 빗변 BC에 내린 수선 AH를 표시한다.",
    "imageSize": "full"
  },
  {
    "id": 4,
    "category": "삼각함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-04",
    "standardUnit": "삼각함수의 미분",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "삼각함수의 미분"
    ],
    "wide": false,
    "content": "$P=(2\\cos\\theta,2\\sin\\theta)$를 지나는 수평선이 $y=e^{2x}-1$과 $Q$에서 만난다. $R$은 $Q$의 $x$축 정사영, $T=OP\\cap QR$이다. 충분히 작은 $\\theta>0$에서 $\\lim_{\\theta\\to0^+}20[ORT]/\\theta^3$은? [그림: 원점 중심 반지름 2인 사분원의 $P$, 그 높이에 있는 지수곡선 위 $Q$, $QR$과 $OP$의 교점 $T$.]",
    "choices": [
      "$7$",
      "$8$",
      "$9$",
      "$10$",
      "$11$"
    ],
    "answer": "④",
    "solution": "$P$의 $y$좌표가 $2\\sin\\theta$이므로 수평선 $y=2\\sin\\theta$와 $y=e^{2x}-1$의 교점 $Q$는 $e^{2x_Q}-1=2\\sin\\theta$를 만족한다.\n따라서 $e^{2x_Q}=1+2\\sin\\theta$이고 $OR=x_Q=\\frac12\\ln(1+2\\sin\\theta)$이다.\n$OP$의 기울기는 $\\tan\\theta$이므로 직선 $OP$는 $y=x\\tan\\theta$이다.\n$T$는 $OP$와 수직선 $QR$ 위에 있으므로 $RT=x_Q\\tan\\theta$이다.\n직각삼각형 $ORT$의 넓이는 $[ORT]=\\frac12 x_Q\\cdot x_Q\\tan\\theta=\\frac12 x_Q^2\\tan\\theta$이다.\n따라서 구하는 극한은 $\\lim_{\\theta\\to0^+}\\frac{20\\cdot\\frac12 x_Q^2\\tan\\theta}{\\theta^3}=\\lim_{\\theta\\to0^+}10\\left(\\frac{x_Q}{\\theta}\\right)^2\\frac{\\tan\\theta}{\\theta}$이다.\n로그의 극한 $\\lim_{t\\to0}\\frac{\\ln(1+t)}{t}=1$과 $\\lim_{\\theta\\to0}\\frac{\\sin\\theta}{\\theta}=1$을 쓴다.\n$\\frac{x_Q}{\\theta}=\\frac{\\ln(1+2\\sin\\theta)}{2\\theta}=\\frac{\\ln(1+2\\sin\\theta)}{2\\sin\\theta}\\cdot\\frac{\\sin\\theta}{\\theta}\\to1\\cdot1=1$이다.\n또 $\\lim_{\\theta\\to0}\\frac{\\tan\\theta}{\\theta}=1$이다.\n그러므로 극한은 $10\\cdot1^2\\cdot1=10$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-167",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_VALUE_CALC_STANDARD",
    "crossConceptKeys": [
      "CC_EXPONENTIAL_FUNCTION_GRAPH",
      "CC_LINE_SLOPE_TANGENT"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 5,
    "category": "삼각함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-04",
    "standardUnit": "삼각함수의 미분",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "삼각함수의 미분"
    ],
    "wide": false,
    "content": "$P=(2\\cos\\theta,2\\sin\\theta)$에서 $y$축에 내린 수선의 발을 $H$, 그 수선과 $y=\\ln(1+2x)$의 교점을 $Q$라 한다. 충분히 작은 $\\theta>0$에서 $\\lim_{\\theta\\to0^+}[OPQ]/HQ$는? [그림: 반지름 2인 사분원과 로그 곡선, 수평선 위에 왼쪽부터 $H,Q,P$.]",
    "choices": [
      "$-2$",
      "$-1$",
      "$0$",
      "$1$",
      "$2$"
    ],
    "answer": "⑤",
    "solution": "$H=(0,2\\sin\\theta)$이고 $Q$는 $y=2\\sin\\theta$ 위에 있으므로 $Q=(x_Q,2\\sin\\theta)$라 하자.\n$Q$가 $y=\\ln(1+2x)$ 위에 있으므로 $\\ln(1+2x_Q)=2\\sin\\theta$이다.\n따라서 $1+2x_Q=e^{2\\sin\\theta}$이고 $HQ=x_Q=\\frac{e^{2\\sin\\theta}-1}{2}$이다.\n$P=(2\\cos\\theta,2\\sin\\theta)$이므로 $QP=2\\cos\\theta-x_Q$이고, $O$에서 수평선 $y=2\\sin\\theta$까지의 거리는 $2\\sin\\theta$이다.\n삼각형 $OPQ$의 넓이는 $[OPQ]=\\frac12(2\\cos\\theta-x_Q)(2\\sin\\theta)=(2\\cos\\theta-x_Q)\\sin\\theta$이다.\n따라서 극한은 $\\lim_{\\theta\\to0^+}\\frac{(2\\cos\\theta-x_Q)\\sin\\theta}{x_Q}=\\lim_{\\theta\\to0^+}(2\\cos\\theta-x_Q)\\frac{\\sin\\theta}{x_Q}$이다.\n지수함수의 극한 $\\lim_{t\\to0}\\frac{e^t-1}{t}=1$을 쓰면 $\\frac{x_Q}{\\sin\\theta}=\\frac{e^{2\\sin\\theta}-1}{2\\sin\\theta}\\to1$이므로 $\\frac{\\sin\\theta}{x_Q}\\to1$이다.\n또 $2\\cos\\theta-x_Q\\to2-0=2$이다.\n그러므로 극한은 $2\\cdot1=2$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-167",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_VALUE_CALC_STANDARD",
    "crossConceptKeys": [
      "CC_LOGARITHMIC_FUNCTION_GRAPH",
      "CC_SHARED_HEIGHT"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
