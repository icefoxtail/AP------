window.examTitle = "미적분II_083_지수함수로그함수의극한의활용2_고2_유형은행1";

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
    "content": "곡선 $y=\\ln(x/2)$ 위의 점 $P=(t,\\ln(t/2))$와 두 점 $A=(2,0),B=(6,0)$이 만드는 삼각형의 넓이를 $S(t)$라 한다. $\\lim_{t\\to2^+}\\frac{S(t)}{t-2}$의 값은?\n[그림: $x$축 위에 $A,B$를 표시한다. $2<t<6$인 $P$를 곡선 위에 잡고 $PAB$를 연결한다.]",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "①",
    "solution": "밑변 $AB$의 길이는 $6-2=4$이고, 점 $P$의 $x$축까지의 거리는 $\\ln(t/2)$이다. (삼각형의 넓이 공식)\n따라서 $t>2$ 근처에서 $S(t)=\\frac12\\cdot4\\cdot\\ln(t/2)=2\\ln(t/2)$이다.\n구하는 극한은 $\\lim_{t\\to2^+}\\frac{2\\ln(t/2)}{t-2}=2\\lim_{t\\to2^+}\\frac{\\ln(t/2)}{t-2}$이다.\n$u=t-2$로 놓으면 $u\\to0^+$이고 $\\frac{\\ln(t/2)}{t-2}=\\frac{\\ln(1+u/2)}{u}=\\frac12\\cdot\\frac{\\ln(1+u/2)}{u/2}$이다.\n로그의 극한 $\\lim_{v\\to0}\\frac{\\ln(1+v)}v=1$을 쓰면 $\\frac{\\ln(1+u/2)}{u/2}\\to1$이다.\n따라서 극한값은 $2\\cdot\\frac12\\cdot1=1$이다.\n주의: $t\\to2^+$이므로 $\\ln(t/2)>0$이고 넓이의 절댓값을 그대로 쓸 수 있다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-146",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_EXP_LOG_STANDARD",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/미적분II_083_지수함수로그함수의극한의활용2_고2_유형은행1/q1-problem.svg",
    "imageAlt": "로그곡선 y=ln(x/2)와 x축의 A,B; 곡선 위 P와 삼각형은 ENGINE_CAPABILITY_PENDING.",
    "imageCaption": "로그곡선 y=ln(x/2)와 x축의 A,B; 곡선 위 P와 삼각형은 ENGINE_CAPABILITY_PENDING.",
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
    "content": "$A=(0,4),B=(0,1),C=(2,1)$이고 $P=(t,e^{2t})$이다. 삼각형 $PAB,PBC$의 넓이를 각각 $S_1,S_2$라 할 때 $\\lim_{t\\to0^+}\\frac{S_1}{S_2}$의 값은?\n[그림: $A,B$를 $y$축에 두고 $C$를 $B$의 오른쪽에 둔다. $y=e^{2x}$ 위의 $B$ 오른쪽 가까이에 $P$를 두고 $AP,BP,CP,AB,BC$를 그린다.]",
    "choices": [
      "$\\frac14$",
      "$\\frac12$",
      "$\\frac34$",
      "$1$",
      "$\\frac54$"
    ],
    "answer": "③",
    "solution": "삼각형 $PAB$는 밑변 $AB=4-1=3$, 높이가 $P$와 $y$축 사이의 거리 $t$이므로 $S_1=\\frac12\\cdot3\\cdot t=\\frac{3t}{2}$이다. (삼각형의 넓이 공식)\n삼각형 $PBC$는 밑변 $BC=2$, 높이가 $e^{2t}-1$이므로 $S_2=\\frac12\\cdot2\\cdot(e^{2t}-1)=e^{2t}-1$이다.\n따라서 $\\frac{S_1}{S_2}=\\frac{3t/2}{e^{2t}-1}=\\frac32\\cdot\\frac{t}{e^{2t}-1}$이다.\n$x=2t$로 놓으면 $\\frac{t}{e^{2t}-1}=\\frac12\\cdot\\frac{x}{e^x-1}$이다.\n지수함수의 극한 $\\lim_{x\\to0}\\frac{e^x-1}{x}=1$의 역수를 쓰면 $\\frac{x}{e^x-1}\\to1$이다.\n따라서 극한값은 $\\frac32\\cdot\\frac12\\cdot1=\\frac34$이다.\n주의: $t>0$ 근처에서 $P$가 $BC$보다 위에 있으므로 높이는 $e^{2t}-1$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-146",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_EXP_LOG_STANDARD",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/미적분II_083_지수함수로그함수의극한의활용2_고2_유형은행1/q2-problem.svg",
    "imageAlt": "자연지수 y=e^(2x)와 A=(0,4),B=(0,1); C와 P 연결선은 ENGINE_CAPABILITY_PENDING.",
    "imageCaption": "자연지수 y=e^(2x)와 A=(0,4),B=(0,1); C와 P 연결선은 ENGINE_CAPABILITY_PENDING.",
    "imageSize": "medium"
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
    "content": "곡선 $y=3^x-1$의 제1사분면 위의 점 $P$와 $O=(0,0),A=(2,0),B=(0,1)$을 잡는다. 삼각형 $OAP$와 $OBP$의 넓이를 각각 $S_A,S_B$라 할 때, $P$가 $O$로 가까워지면 $S_A/S_B$는 어떤 값에 가까워지는가?\n[그림: 두 좌표축 위에 $A,B$를 표시한다. 곡선 위의 $P=(t,3^t-1)$를 $O,A,B$와 연결한다.]",
    "choices": [
      "$\\frac12\\ln3$",
      "$\\ln3$",
      "$\\frac43\\ln3$",
      "$\\frac32\\ln3$",
      "$2\\ln3$"
    ],
    "answer": "⑤",
    "solution": "$P=(t,3^t-1)$에서 $t>0$이고 $3^t-1>0$이다. (제1사분면)\n$S_A$는 밑변 $OA=2$, 높이 $3^t-1$이므로 $S_A=\\frac12\\cdot2\\cdot(3^t-1)=3^t-1$이다.\n$S_B$는 밑변 $OB=1$, 높이 $t$이므로 $S_B=\\frac12\\cdot1\\cdot t=\\frac t2$이다.\n따라서 $\\frac{S_A}{S_B}=\\frac{3^t-1}{t/2}=\\frac{2(3^t-1)}{t}$이다.\n$3^t=e^{t\\ln3}$이므로 $\\frac{3^t-1}{t}=\\ln3\\cdot\\frac{e^{t\\ln3}-1}{t\\ln3}$이다.\n지수함수의 극한 $\\lim_{x\\to0}\\frac{e^x-1}{x}=1$에서 $\\frac{e^{t\\ln3}-1}{t\\ln3}\\to1$이다.\n따라서 극한값은 $2\\ln3$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-146",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_EXP_LOG_STANDARD",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/미적분II_083_지수함수로그함수의극한의활용2_고2_유형은행1/q3-problem.svg",
    "imageAlt": "y=3^x−1 위 P=(1,2), O(0,0),A(2,0),B(0,1)의 두 삼각형.",
    "imageCaption": "y=3^x−1 위 P=(1,2), O(0,0),A(2,0),B(0,1)의 두 삼각형.",
    "imageSize": "medium"
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
    "content": "$a>0$일 때 $y=ax^2$, $y=\\ln(1+4x)$의 제1사분면 교점을 $P$라 한다. $O=(0,0), B=(1,0), C=(0,2)$에 대하여 삼각형 $OBP,OCP$의 넓이를 각각 $S_1,S_2$라 할 때 $\\lim_{a\\to\\infty}S_1/S_2$는?\n[그림: 두 곡선의 원점과 제1사분면 교점 $P$를 표시한다. 좌표축 위의 $B,C$와 $P$를 연결하고 $OP$를 긋는다.]",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "①",
    "solution": "교점 $P$의 $x$좌표를 $t>0$라 하면 $at^2=\\ln(1+4t)$이다.\n$g(x)=\\frac{\\ln(1+4x)}{x}$라 하면 $g'(x)=\\frac{\\frac{4x}{1+4x}-\\ln(1+4x)}{x^2}$이다.\n$h(x)=\\frac{4x}{1+4x}-\\ln(1+4x)$는 $h'(x)=-\\frac{16x}{(1+4x)^2}<0$이고 $h(0)=0$이므로 $g'(x)<0$이다.\n따라서 $f(x)=\\frac{g(x)}{x}$도 양수이면서 감소하고, $\\lim_{x\\to0^+}f(x)=\\infty$, $\\lim_{x\\to\\infty}f(x)=0$이다.\n중간값 정리에 의해 각 $a>0$에 대해 $f(t)=a$인 $t>0$가 유일하게 존재한다.\n이때 $a\\to\\infty$이면 $t\\to0^+$이다. 실제로 $at^2=\\ln(1+4t)\\le4t$에서 $0<t\\le\\frac4a\\to0$이다.\n삼각형 $OBP$는 밑변 $OB=1$, 높이 $\\ln(1+4t)$이므로 $S_1=\\frac12\\ln(1+4t)$이다.\n삼각형 $OCP$는 밑변 $OC=2$, 높이 $t$이므로 $S_2=\\frac12\\cdot2\\cdot t=t$이다.\n따라서 $\\frac{S_1}{S_2}=\\frac{\\ln(1+4t)}{2t}$이다.\n$t\\to0^+$일 때 $\\frac{\\ln(1+4t)}{4t}\\to1$이므로 (로그의 극한) $\\frac{\\ln(1+4t)}{2t}=2\\cdot\\frac{\\ln(1+4t)}{4t}\\to2$이다.\n따라서 정답은 ①이다.",
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
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/미적분II_083_지수함수로그함수의극한의활용2_고2_유형은행1/q4-problem.svg",
    "imageAlt": "대표 포물선 y=4x²와 O,B,C; 자연로그 곡선·제1사분면 교점 P는 ENGINE_CAPABILITY_PENDING.",
    "imageCaption": "대표 포물선 y=4x²와 O,B,C; 자연로그 곡선·제1사분면 교점 P는 ENGINE_CAPABILITY_PENDING.",
    "imageSize": "full"
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
    "content": "$A=(0,1)$과 곡선 $y=e^{3x}$ 위의 점 $P=(t,e^{3t})$를 잇는 선분의 수직이등분선이 $x$축과 만나는 점을 $Q$라 한다. $t\\to0^+$일 때 $Q$의 $x$좌표의 극한은?\n[그림: $A$와 $P$를 잇고 중점 $M=(t/2,(1+e^{3t})/2)$을 표시한다. $M$에서 $AP$에 수직인 직선을 그어 양의 $x$축과 만나는 점을 $Q$로 표시한다.]",
    "choices": [
      "$3$",
      "$4$",
      "$5$",
      "$6$",
      "$7$"
    ],
    "answer": "①",
    "solution": "$A=(0,1)$, $P=(t,e^{3t})$이므로 $AP$의 기울기는 $\\frac{e^{3t}-1}{t-0}=\\frac{e^{3t}-1}{t}$이다. (두 점을 지나는 직선의 기울기)\n수직이등분선의 기울기는 $AP$의 기울기의 음의 역수이므로 $-\\frac{t}{e^{3t}-1}$이다. (수직인 두 직선의 기울기의 곱은 $-1$)\n$AP$의 중점은 $M=\\left(\\frac t2,\\frac{1+e^{3t}}2\\right)$이다. (중점 공식)\n수직이등분선의 방정식은 $y-\\frac{1+e^{3t}}2=-\\frac{t}{e^{3t}-1}\\left(x-\\frac t2\\right)$이다.\n$Q$는 $x$축 위의 점이므로 $y=0$을 대입하면 $-\\frac{1+e^{3t}}2=-\\frac{t}{e^{3t}-1}\\left(x_Q-\\frac t2\\right)$이다.\n양변에 $-\\frac{e^{3t}-1}{t}$를 곱하면 $x_Q-\\frac t2=\\frac{(1+e^{3t})(e^{3t}-1)}{2t}=\\frac{e^{6t}-1}{2t}$이다.\n따라서 $x_Q=\\frac t2+\\frac{e^{6t}-1}{2t}$이다.\n$x=6t$로 놓으면 $\\frac{e^{6t}-1}{2t}=3\\cdot\\frac{e^x-1}{x}$이다.\n지수함수의 극한 $\\lim_{x\\to0}\\frac{e^x-1}{x}=1$에서 $3\\cdot\\frac{e^x-1}{x}\\to3$이다.\n또 $\\frac t2\\to0$이므로 $\\lim_{t\\to0^+}x_Q=0+3=3$이다.\n주의: $t\\to0^+$이므로 $e^{3t}-1>0$이고 수직이등분선의 기울기가 정의된다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-146",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_EXP_LOG_STANDARD",
    "crossConceptKeys": [
      "CC_DIFFERENCE_QUOTIENT_SCALING"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/미적분II_083_지수함수로그함수의극한의활용2_고2_유형은행1/q5-problem.svg",
    "imageAlt": "자연지수 y=e^(3x)와 A=(0,1); P·중점 M·수직이등분선 Q는 ENGINE_CAPABILITY_PENDING.",
    "imageCaption": "자연지수 y=e^(3x)와 A=(0,1); P·중점 M·수직이등분선 Q는 ENGINE_CAPABILITY_PENDING.",
    "imageSize": "medium"
  },
  {
    "id": 6,
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
    "content": "$t<2$일 때 직선 $x+y=t$와 곡선 $y=\\ln(x/2)$의 교점을 $P$라 한다. $P$를 지나는 수직선이 $x$축과 만나는 점을 $H$, 곡선 $y=e^x$와 만나는 점을 $Q$라 하자. 삼각형 $OHQ$의 넓이가 $S(t)$일 때 $\\lim_{t\\to2^-}\\frac{2S(t)-2e^2}{t-2}$의 값은?\n[그림: $y=\\ln(x/2)$와 $x+y=t$의 교점 $P=(u,\\ln(u/2))$를 $x$축 아래에 그린다. 직선 $x=u$ 위에 $H=(u,0)$, $Q=(u,e^u)$를 표시하고 원점과 $H,Q$를 연결한다.]",
    "choices": [
      "$e^2$",
      "$2e^2$",
      "$\\frac52e^2$",
      "$3e^2$",
      "$4e^2$"
    ],
    "answer": "②",
    "solution": "$P=(u,\\ln(u/2))$라 하면 $P$가 직선 $x+y=t$ 위에 있으므로 $t=u+\\ln(u/2)$이다.\n$t\\to2^-$일 때 $u\\to2^-$이다. (함수 $u+\\ln(u/2)$는 도함수 $1+\\frac1u>0$인 증가함수)\n$H=(u,0)$, $Q=(u,e^u)$이므로 삼각형 $OHQ$는 밑변 $OH=u$, 높이 $e^u$이다.\n따라서 $2S(t)=u e^u$이다.\n구하는 극한은 $\\lim_{u\\to2^-}\\frac{u e^u-2e^2}{u+\\ln(u/2)-2}$이다.\n분자 $F(u)=u e^u$, 분모 $G(u)=u+\\ln(u/2)$로 놓으면 $F(2)=2e^2$, $G(2)=2$이다.\n$F'(u)=e^u+u e^u=e^u(1+u)$이므로 $F'(2)=3e^2$이다. (곱의 미분법)\n$G'(u)=1+\\frac1u$이므로 $G'(2)=1+\\frac12=\\frac32$이다. (로그의 미분법)\n$\\frac00$ 꼴이므로 로피탈의 정리를 쓰면 극한은 $\\frac{F'(2)}{G'(2)}$이다.\n따라서 극한값은 $\\frac{3e^2}{3/2}=2e^2$이다.\n주의: $u\\to2$일 때 $F(2)-2e^2=0$, $G(2)-2=0$인 $\\frac00$ 꼴임을 확인해야 한다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "low",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-146",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_EXP_LOG_STANDARD",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT"
    ],
    "conditionKeys": [
      "COND_UPPER_BOUND"
    ],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/미적분II_083_지수함수로그함수의극한의활용2_고2_유형은행1/q6-problem.svg",
    "imageAlt": "자연로그 y=ln(x/2)와 t=1의 x+y=t 직선; P,H,Q·y=e^x는 ENGINE_CAPABILITY_PENDING.",
    "imageCaption": "자연로그 y=ln(x/2)와 t=1의 x+y=t 직선; P,H,Q·y=e^x는 ENGINE_CAPABILITY_PENDING.",
    "imageSize": "medium"
  }
];
