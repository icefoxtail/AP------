window.examTitle = "미적분II_115_도형의넓이에대한삼각함수의극한_고2_유형은행1";

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
    "content": "반지름 2인 사분원의 호 위에 $B=(2\\cos\\theta,2\\sin\\theta)$를 잡는다. $A=(2,0)$, $H=(2\\cos\\theta,0)$이고, 직선 $OB$와 $x=2$의 교점이 $D$이다. 사각형 $BHAD$의 넓이 $S$에 대해 $\\lim_{\\theta\\to0^+}S/\\theta^3$은? [그림: 원점 중심 사분원, $BH$와 $AD$를 평행한 세로변으로 그린다.]",
    "choices": [
      "$-2$",
      "$-1$",
      "$0$",
      "$1$",
      "$2$"
    ],
    "answer": "⑤",
    "solution": "$BH$와 $AD$는 모두 $x$축에 수직이므로 사각형 $BHAD$는 두 밑변 $BH$, $AD$가 평행한 사다리꼴이다.\n$BH=2\\sin\\theta$, $AD=2\\tan\\theta$, 높이 $HA=2-2\\cos\\theta$이다.\n사다리꼴의 넓이 공식으로 $S=\\frac12(BH+AD)\\cdot HA=\\frac12(2\\sin\\theta+2\\tan\\theta)(2-2\\cos\\theta)$.\n$S=2(1-\\cos\\theta)(\\sin\\theta+\\tan\\theta)$로 정리한다.\n극한을 분리하면 $\\lim_{\\theta\\to0^+}\\frac{S}{\\theta^3}=2\\left(\\lim_{\\theta\\to0^+}\\frac{1-\\cos\\theta}{\\theta^2}\\right)\\left(\\lim_{\\theta\\to0^+}\\frac{\\sin\\theta+\\tan\\theta}{\\theta}\\right)$.\n$\\lim_{\\theta\\to0^+}\\frac{1-\\cos\\theta}{\\theta^2}=\\frac12$, $\\lim_{\\theta\\to0^+}\\frac{\\sin\\theta}{\\theta}=1$, $\\lim_{\\theta\\to0^+}\\frac{\\tan\\theta}{\\theta}=1$ (삼각함수의 극한)이다.\n따라서 $2\\cdot\\frac12\\cdot(1+1)=2$.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-170",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_GEOMETRIC_FIGURE",
    "crossConceptKeys": [
      "CC_COORDINATE_TRIG",
      "CC_LINE_SLOPE_TANGENT"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/미적분II_115_도형의넓이에대한삼각함수의극한_고2_유형은행1/q1-problem.svg",
    "imageAlt": "제1사분면의 반지름 2 원호와 OB 연장선이 x=2에서 만나는 D, 평행한 세로변 BH와 AD의 사다리꼴을 그린다.",
    "imageCaption": "제1사분면의 반지름 2 원호와 OB 연장선이 x=2에서 만나는 D, 평행한 세로변 BH와 AD의 사다리꼴을 그린다.",
    "imageSize": "full"
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
    "content": "반지름 2인 사분원에서 $A=(2,0),B=(0,2)$, 호 위의 점 $P=(2\\cos\\theta,2\\sin\\theta)$이다. $P$에서 $OA$에 내린 수선의 발이 $H$, 그 수선과 $AB$의 교점이 $Q$이다. $\\lim_{\\theta\\to0^+}[AQH]/\\theta^4$는? [그림: 제1사분면 호와 현 $AB$, 수직선 $PH$가 현과 $Q$에서 만난다.]",
    "choices": [
      "$0.5$",
      "$0.75$",
      "$1$",
      "$1.25$",
      "$1.5$"
    ],
    "answer": "①",
    "solution": "직선 $AB$의 방정식은 $x+y=2$이므로 $x=2\\cos\\theta$에서 $Q=(2\\cos\\theta,\\,2-2\\cos\\theta)$이다.\n$H=(2\\cos\\theta,0)$이므로 $QH=2-2\\cos\\theta$, $AH=2-2\\cos\\theta$이다.\n$\\angle AHQ=90^\\circ$이므로 $[AQH]=\\frac12\\cdot QH\\cdot AH=\\frac12\\{2(1-\\cos\\theta)\\}^2=2(1-\\cos\\theta)^2$.\n따라서 $\\frac{[AQH]}{\\theta^4}=2\\left(\\frac{1-\\cos\\theta}{\\theta^2}\\right)^2$.\n$\\lim_{\\theta\\to0^+}\\frac{1-\\cos\\theta}{\\theta^2}=\\frac12$ (삼각함수의 극한)이므로 극한값은 $2\\cdot\\left(\\frac12\\right)^2=\\frac12$.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-170",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_GEOMETRIC_FIGURE",
    "crossConceptKeys": [
      "CC_COORDINATE_TRIG",
      "CC_GRAPH_INTERSECTION"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/미적분II_115_도형의넓이에대한삼각함수의극한_고2_유형은행1/q2-problem.svg",
    "imageAlt": "사분원 A–B의 현 AB와 수직선 PH가 Q에서 만나고, 삼각형 AQH의 대상 넓이만 연한 회색으로 나타낸다.",
    "imageCaption": "사분원 A–B의 현 AB와 수직선 PH가 Q에서 만나고, 삼각형 AQH의 대상 넓이만 연한 회색으로 나타낸다.",
    "imageSize": "full"
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
    "content": "반지름 2인 사분원에서 $P=(2\\cos\\theta,2\\sin\\theta)$, $H=(2\\cos\\theta,0)$이다. 호 위에서 $P$보다 높은 점 $Q$를 $\\angle PHQ=\\theta$가 되도록 잡는다. $\\lim_{\\theta\\to0^+}[OHQ]/\\theta$는? [그림: 원점 중심 사분원에 $P,Q$, $H$에서 수직선 $HP$보다 왼쪽으로 $\\theta$만큼 기울어진 반직선과 호의 교점이 $Q$.]",
    "choices": [
      "$1+\\sqrt2$",
      "$2+\\sqrt2$",
      "$3+\\sqrt2$",
      "$2+2\\sqrt2$",
      "$4+2\\sqrt2$"
    ],
    "answer": "④",
    "solution": "$\\overrightarrow{HQ}$는 $HP$와 각 $\\theta$를 이루며 왼쪽으로 기울므로 $Q=(2\\cos\\theta-u\\sin\\theta,\\ u\\cos\\theta)$ ($u=HQ>0$)로 둔다.\n$Q$가 원 $x^2+y^2=4$ 위에 있으므로 $(2\\cos\\theta-u\\sin\\theta)^2+(u\\cos\\theta)^2=4$.\n전개하면 $4\\cos^2\\theta-4u\\sin\\theta\\cos\\theta+u^2=4$, 즉 $u^2-4u\\sin\\theta\\cos\\theta-4\\sin^2\\theta=0$ (근의 공식).\n$u=2\\sin\\theta\\cos\\theta\\pm 2\\sin\\theta\\sqrt{\\cos^2\\theta+1}$이고 $u>0$이므로 $u=2\\sin\\theta(\\cos\\theta+\\sqrt{1+\\cos^2\\theta})$.\n따라서 $\\lim_{\\theta\\to0^+}\\frac{u}{\\theta}=2(1+\\sqrt2)=2+2\\sqrt2$.\n한편 $[OHQ]=\\frac12\\cdot OH\\cdot y_Q=\\frac12\\cdot2\\cos\\theta\\cdot u\\cos\\theta=u\\cos^2\\theta$.\n그러므로 $\\lim_{\\theta\\to0^+}\\frac{[OHQ]}{\\theta}=\\left(\\lim_{\\theta\\to0^+}\\frac{u}{\\theta}\\right)\\left(\\lim_{\\theta\\to0^+}\\cos^2\\theta\\right)=(2+2\\sqrt2)\\cdot1=2+2\\sqrt2$.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-170",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_GEOMETRIC_FIGURE",
    "crossConceptKeys": [
      "CC_COORDINATE_TRIG",
      "CC_GRAPH_INTERSECTION"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "INTERDEPENDENT",
    "image": "assets/images/미적분II_115_도형의넓이에대한삼각함수의극한_고2_유형은행1/q3-problem.svg",
    "imageAlt": "제1사분면 호 위 P보다 높은 Q, P 아래의 H에서 수직 HP보다 왼쪽으로 θ 기울어진 HQ를 보인다.",
    "imageCaption": "제1사분면 호 위 P보다 높은 Q, P 아래의 H에서 수직 HP보다 왼쪽으로 θ 기울어진 HQ를 보인다.",
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
    "content": "$A=(-2,0),B=(2,0),O=(0,0)$이고 지름 $AB$인 위쪽 반원에 $P=(2\\cos2\\theta,2\\sin2\\theta)$를 잡는다. $P$를 $AB$에 정사영한 점을 $Q$, $Q$를 $OP$에 정사영한 점을 $R$, $O$를 $AP$에 정사영한 점을 $S$라 하자. $\\lim_{\\theta\\to0^+}\\theta^2[AOS]/[PRQ]=q/p$일 때 서로소인 양의 정수 $p,q$에 대해 $p^2+q^2$는? [그림: 위 반원에 $P$를 찍고 $PQ,QR,OS$를 각각 해당 선분에 수직으로 그린다.]",
    "choices": [
      "$64$",
      "$65$",
      "$66$",
      "$67$",
      "$68$"
    ],
    "answer": "②",
    "solution": "$\\alpha=2\\theta$로 두면 $P=(2\\cos\\alpha,2\\sin\\alpha)$, $Q=(2\\cos\\alpha,0)$이다.\n$O$에서 $AP$에 내린 수선의 발이 $S$이고 $OA=OP=2$이므로 $S$는 $AP$의 중점이다 (이등변삼각형의 성질).\n중심각 $\\angle AOP=\\pi-\\alpha$이므로 $AS=2\\cos\\frac{\\alpha}{2}$, $OS=2\\sin\\frac{\\alpha}{2}$.\n$[AOS]=\\frac12\\cdot AS\\cdot OS=\\frac12\\cdot2\\cos\\frac{\\alpha}{2}\\cdot2\\sin\\frac{\\alpha}{2}=\\sin\\alpha=\\sin2\\theta$.\n직각삼각형 $PRQ$에서 빗변 $PQ=2\\sin\\alpha$이고 $\\angle QPR=90^\\circ-\\alpha$이다.\n$PR=PQ\\cos(90^\\circ-\\alpha)=2\\sin\\alpha\\cdot\\sin\\alpha=2\\sin^2\\alpha$.\n$QR=PQ\\sin(90^\\circ-\\alpha)=2\\sin\\alpha\\cos\\alpha=\\sin2\\alpha$.\n$[PRQ]=\\frac12\\cdot PR\\cdot QR=\\frac12\\cdot2\\sin^2\\alpha\\cdot2\\sin\\alpha\\cos\\alpha=2\\sin^3\\alpha\\cos\\alpha$.\n$\\frac{\\theta^2[AOS]}{[PRQ]}=\\frac{\\theta^2\\sin\\alpha}{2\\sin^3\\alpha\\cos\\alpha}=\\frac{\\theta^2}{2\\sin^2\\alpha\\cos\\alpha}$.\n$\\alpha=2\\theta$이고 $\\lim_{\\theta\\to0^+}\\frac{\\sin2\\theta}{2\\theta}=1$ (삼각함수의 극한)이므로 $\\frac{\\theta^2}{\\sin^2 2\\theta}\\to\\frac14$.\n따라서 극한값은 $\\frac12\\cdot\\frac14\\cdot1=\\frac18=\\frac{q}{p}$에서 $p=8$, $q=1$이다.\n$p^2+q^2=64+1=65$.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-170",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_GEOMETRIC_FIGURE",
    "crossConceptKeys": [
      "CC_COORDINATE_TRIG",
      "CC_TRIG_RATIO"
    ],
    "conditionKeys": [
      "COND_NATURAL_NUMBER",
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/미적분II_115_도형의넓이에대한삼각함수의극한_고2_유형은행1/q4-problem.svg",
    "imageAlt": "지름 AB인 위 반원에서 P, x축의 수선 발 Q, OP에 대한 Q의 수선 발 R, AP에 대한 O의 수선 발 S를 표시한다.",
    "imageCaption": "지름 AB인 위 반원에서 P, x축의 수선 발 Q, OP에 대한 Q의 수선 발 R, AP에 대한 O의 수선 발 S를 표시한다.",
    "imageSize": "full"
  }
];
