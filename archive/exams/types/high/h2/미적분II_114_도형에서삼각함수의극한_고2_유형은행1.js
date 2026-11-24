window.examTitle = "미적분II_114_도형에서삼각함수의극한_고2_유형은행1";

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
    "content": "지름 $AB$가 6인 원 위의 점 $P$에서 $AB$에 내린 수선의 발이 $H$이다. $\\angle PAH=\\theta$일 때 $\\lim_{\\theta\\to0^+}PH/\\theta$는? [그림: $A=(0,0),B=(6,0)$을 지름으로 하는 원의 위쪽 반원에 $P$, $P$의 수직 아래에 $H$.]",
    "choices": [
      "$6$",
      "$7$",
      "$8$",
      "$9$",
      "$10$"
    ],
    "answer": "①",
    "solution": "지름 $AB$에 대한 원주각이므로 $\\angle APB=90^\\circ$이다(탈레스 정리).\n직각삼각형 $APB$에서 빗변 $AB=6$, $\\angle PAB=\\theta$이므로 $AP=6\\cos\\theta$, $PB=6\\sin\\theta$이다.\n$H$는 $AB$ 위의 수선의 발이므로 $\\angle PAH=\\angle PAB=\\theta$이다.\n직각삼각형 $APH$에서 $PH=AP\\sin\\theta=6\\cos\\theta\\sin\\theta$이다.\n따라서 $\\displaystyle \\lim_{\\theta\\to0^+}\\frac{PH}{\\theta}=6\\lim_{\\theta\\to0^+}\\cos\\theta\\cdot\\frac{\\sin\\theta}{\\theta}=6\\cdot1\\cdot1=6$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-170",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_GEOMETRIC_FIGURE",
    "crossConceptKeys": [
      "CC_TRIG_RATIO"
    ],
    "conditionKeys": [],
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
    "content": "반지름 8인 사분원에서 $O=(0,0), B=(8,0)$이다. 호 위의 $P$를 $OB$에 정사영한 점을 $H$라 한다. $\\angle BOP=\\theta$일 때 $\\lim_{\\theta\\to0^+}BH/\\theta^2$는? [그림: 제1사분면의 호 위 $P=(8\\cos\\theta,8\\sin\\theta)$에서 $x$축까지 수직선.]",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "④",
    "solution": "$P=(8\\cos\\theta,8\\sin\\theta)$이므로 $H=(8\\cos\\theta,0)$이다.\n$BH=OB-OH=8-8\\cos\\theta=8(1-\\cos\\theta)$이다.\n반각 공식 $1-\\cos\\theta=2\\sin^2(\\theta/2)$를 쓰면 $BH=16\\sin^2(\\theta/2)$이다.\n따라서 $\\displaystyle \\frac{BH}{\\theta^2}=16\\left(\\frac{\\sin(\\theta/2)}{\\theta}\\right)^2=16\\cdot\\frac14\\left(\\frac{\\sin(\\theta/2)}{\\theta/2}\\right)^2$이다.\n$\\displaystyle \\lim_{\\theta\\to0^+}\\frac{\\sin(\\theta/2)}{\\theta/2}=1$이므로 극한값은 $16\\cdot\\frac14=4$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-170",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_GEOMETRIC_FIGURE",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [],
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
    "content": "직각삼각형 $ABC$에서 $\\angle A=90^\\circ,AB=6,\\angle ABC=\\theta$이다. $A$에서 빗변에 내린 수선의 발 $H$에 대해 $\\lim_{\\theta\\to0^+}CH/\\theta^2$는? [그림: $A=(0,0),B=(6,0),C=(0,6\\tan\\theta)$와 $BC$에 수직인 $AH$.]",
    "choices": [
      "$3$",
      "$4$",
      "$5$",
      "$6$",
      "$7$"
    ],
    "answer": "④",
    "solution": "$\\angle A=90^\\circ$이므로 $AC=AB\\tan\\theta=6\\tan\\theta$, $BC=AB\\sec\\theta=6\\sec\\theta$이다.\n$A$에서 빗변 $BC$에 내린 수선의 발이 $H$이므로 직각삼각형의 닮음(또는 정사영 정리)에서 $AC^2=CH\\cdot BC$이다.\n따라서 $CH=\\frac{AC^2}{BC}=\\frac{36\\tan^2\\theta}{6\\sec\\theta}=6\\frac{\\sin^2\\theta}{\\cos\\theta}$이다.\n$\\displaystyle \\frac{CH}{\\theta^2}=6\\left(\\frac{\\sin\\theta}{\\theta}\\right)^2\\frac1{\\cos\\theta}$이다.\n$\\displaystyle \\lim_{\\theta\\to0^+}\\frac{\\sin\\theta}{\\theta}=1$, $\\cos\\theta\\to1$이므로 극한값은 $6\\cdot1^2\\cdot1=6$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-170",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_GEOMETRIC_FIGURE",
    "crossConceptKeys": [
      "CC_TRIG_RATIO"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "직각삼각형 $ABC$에서 $\\angle B=90^\\circ,BC=8,\\angle C=\\theta$이다. $B$에서 $AC$에 내린 수선의 발을 $H$라 할 때 $\\lim_{\\theta\\to0^+}AH/[\\theta(e^{2\\theta}-1)]$은? [그림: $B=(0,0),C=(0,8),A=(-8\\tan\\theta,0)$와 $AC$에 수직인 $BH$.]",
    "choices": [
      "$2$",
      "$4$",
      "$6$",
      "$8$",
      "$10$"
    ],
    "answer": "②",
    "solution": "$\\angle B=90^\\circ$이므로 $AB=BC\\tan\\theta=8\\tan\\theta$, $AC=BC\\sec\\theta=8\\sec\\theta$이다.\n$B$에서 빗변 $AC$에 내린 수선의 발이 $H$이므로 $AB^2=AH\\cdot AC$이다.\n따라서 $AH=\\frac{AB^2}{AC}=\\frac{64\\tan^2\\theta}{8\\sec\\theta}=8\\frac{\\sin^2\\theta}{\\cos\\theta}$이다.\n분자를 $\\theta^2$로 나누면 $\\displaystyle \\frac{AH}{\\theta^2}=8\\left(\\frac{\\sin\\theta}{\\theta}\\right)^2\\frac1{\\cos\\theta}\\to8$이다.\n분모도 $\\theta^2$로 나누면 $\\displaystyle \\frac{\\theta(e^{2\\theta}-1)}{\\theta^2}=\\frac{e^{2\\theta}-1}{\\theta}=2\\cdot\\frac{e^{2\\theta}-1}{2\\theta}\\to2$이다.\n따라서 극한값은 $\\frac82=4$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-170",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_GEOMETRIC_FIGURE",
    "crossConceptKeys": [
      "CC_TRIG_RATIO"
    ],
    "conditionKeys": [],
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
    "content": "지름 $AB=6$인 원의 위쪽 반원에 $P$를 잡고, $P$를 지나 $AB$에 수직인 직선이 원과 다시 만나는 점을 $Q$라 한다. $\\angle PAB=\\theta$일 때 삼각형 $BPQ$의 넓이 $S$에 대해 $\\lim_{\\theta\\to0^+}S/\\theta^3$은? [그림: $A=(0,0),B=(6,0)$인 원에서 $P,Q$는 같은 수직선 위의 교점.]",
    "choices": [
      "$34$",
      "$35$",
      "$36$",
      "$37$",
      "$38$"
    ],
    "answer": "③",
    "solution": "$A=(0,0),B=(6,0)$로 두면 원의 중심은 $(3,0)$, 반지름은 $3$이다.\n$\\angle PAB=\\theta$이므로 $P=(6\\cos^2\\theta,6\\sin\\theta\\cos\\theta)$이다.\n$PQ$는 $AB$에 수직이므로 $Q=(6\\cos^2\\theta,-6\\sin\\theta\\cos\\theta)$이고, $PQ=12\\sin\\theta\\cos\\theta$이다.\n$B$에서 직선 $PQ$까지의 거리는 $6-6\\cos^2\\theta=6\\sin^2\\theta$이다.\n따라서 $S=\\frac12\\cdot PQ\\cdot6\\sin^2\\theta=\\frac12\\cdot12\\sin\\theta\\cos\\theta\\cdot6\\sin^2\\theta=36\\sin^3\\theta\\cos\\theta$이다.\n$\\displaystyle \\frac{S}{\\theta^3}=36\\left(\\frac{\\sin\\theta}{\\theta}\\right)^3\\cos\\theta\\to36\\cdot1^3\\cdot1=36$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-170",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_GEOMETRIC_FIGURE",
    "crossConceptKeys": [
      "CC_TRIANGLE_AREA_TRIG"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 6,
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
    "content": "$A=(12,0),O=(0,0),B=(12,12\\tan\\theta)$이고 $OC=12$인 점 $C$가 선분 $OB$ 위에 있다. $\\lim_{\\theta\\to0^+}(AC+BC)/\\theta$는? [그림: $OB$ 위에 $O,C,B$ 순서로 표시하고 $AC$를 잇는다.]",
    "choices": [
      "$8$",
      "$9$",
      "$10$",
      "$11$",
      "$12$"
    ],
    "answer": "⑤",
    "solution": "$\\overrightarrow{OB}$의 방향은 $(\\cos\\theta,\\sin\\theta)$이고 $OC=12$이므로 $C=(12\\cos\\theta,12\\sin\\theta)$이다.\n$B=(12,12\\tan\\theta)$이므로 $BC=OB-OC=12\\sec\\theta-12=12(\\sec\\theta-1)$이다.\n$A=(12,0)$에서 $AC$를 계산하면 $AC=\\sqrt{(12-12\\cos\\theta)^2+(0-12\\sin\\theta)^2}=12\\sqrt{2-2\\cos\\theta}$이다.\n$2-2\\cos\\theta=4\\sin^2(\\theta/2)$이므로 $AC=24\\sin(\\theta/2)$이다.\n따라서 $\\displaystyle \\frac{AC+BC}{\\theta}=24\\frac{\\sin(\\theta/2)}{\\theta}+12\\frac{\\sec\\theta-1}{\\theta}$이다.\n$\\displaystyle \\frac{\\sin(\\theta/2)}{\\theta}=\\frac12\\cdot\\frac{\\sin(\\theta/2)}{\\theta/2}\\to\\frac12$이고, $\\displaystyle \\frac{\\sec\\theta-1}{\\theta}=\\frac{1-\\cos\\theta}{\\theta\\cos\\theta}=\\frac{\\sin(\\theta/2)}{\\cos\\theta}\\cdot\\frac{\\sin(\\theta/2)}{\\theta/2}\\to0$이다.\n그러므로 극한값은 $24\\cdot\\frac12+12\\cdot0=12$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-170",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_GEOMETRIC_FIGURE",
    "crossConceptKeys": [
      "CC_COORDINATE_TRIG"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 7,
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
    "content": "$\\angle A=90^\\circ$, $AB=4$, $\\angle ABC=\\theta$인 삼각형에서 $A$를 $BC$에 정사영한 점을 $H$라 한다. $\\lim_{\\theta\\to0^+}(AC-AH)/\\theta^3$은? [그림: $B=(0,0)$, $BC$는 양의 $x$축, $A=(4\\cos\\theta,4\\sin\\theta)$, $C=(4\\sec\\theta,0)$, $H=(4\\cos\\theta,0)$.]",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "①",
    "solution": "$\\angle A=90^\\circ$이므로 $AC=AB\\tan\\theta=4\\tan\\theta$이다.\n$H$는 $A$에서 $BC$에 내린 수선의 발이므로 $AH=AB\\sin\\theta=4\\sin\\theta$이다.\n따라서 $AC-AH=4\\tan\\theta-4\\sin\\theta=4\\sin\\theta\\left(\\frac1{\\cos\\theta}-1\\right)=\\frac{4\\sin\\theta(1-\\cos\\theta)}{\\cos\\theta}$이다.\n$1-\\cos\\theta=2\\sin^2(\\theta/2)$를 쓰면 $AC-AH=\\frac{8\\sin\\theta\\sin^2(\\theta/2)}{\\cos\\theta}$이다.\n$\\displaystyle \\frac{AC-AH}{\\theta^3}=8\\left(\\frac{\\sin\\theta}{\\theta}\\right)\\left(\\frac{\\sin(\\theta/2)}{\\theta}\\right)^2\\frac1{\\cos\\theta}$이다.\n$\\displaystyle \\frac{\\sin\\theta}{\\theta}\\to1$, $\\frac{\\sin(\\theta/2)}{\\theta}\\to\\frac12$, $\\cos\\theta\\to1$이므로 극한값은 $8\\cdot1\\cdot\\left(\\frac12\\right)^2\\cdot1=2$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-170",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_GEOMETRIC_FIGURE",
    "crossConceptKeys": [
      "CC_TRIG_RATIO"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 8,
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
    "content": "$P=(t,2\\sin t)$이고 중심 $P$인 원이 $x$축에 $Q$에서 접한다. 이 원과 선분 $OP$의 교점을 $R$이라 한다. $\\lim_{t\\to0^+}OQ/OR=a+b\\sqrt5$일 때 정수 $a,b$의 합은? [그림: $O=(0,0),Q=(t,0)$, 반지름 $2\\sin t$인 원이 $OP$와 $R$에서 만난다.]",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "②",
    "solution": "$P=(t,2\\sin t)$이고 원이 $x$축에 접하므로 반지름은 $2\\sin t$, $Q=(t,0)$이다.\n$OP=\\sqrt{t^2+4\\sin^2t}$이고, $R$은 선분 $OP$ 위에서 원과 만나므로 $OR=OP-PR=\\sqrt{t^2+4\\sin^2t}-2\\sin t$이다.\n$OQ=t$이므로 구하는 극한은 $\\displaystyle \\lim_{t\\to0^+}\\frac{t}{\\sqrt{t^2+4\\sin^2t}-2\\sin t}$이다.\n분모를 유리화하면 $\\displaystyle \\frac{t(\\sqrt{t^2+4\\sin^2t}+2\\sin t)}{t^2+4\\sin^2t-4\\sin^2t}=\\frac{\\sqrt{t^2+4\\sin^2t}+2\\sin t}{t}$이다.\n$t>0$이므로 $t=\\sqrt{t^2}$로 두고 정리하면 $\\displaystyle \\sqrt{1+4\\left(\\frac{\\sin t}{t}\\right)^2}+2\\frac{\\sin t}{t}$이다.\n$\\displaystyle \\lim_{t\\to0^+}\\frac{\\sin t}{t}=1$이므로 극한값은 $\\sqrt{1+4\\cdot1^2}+2\\cdot1=\\sqrt5+2$이다.\n따라서 $a=2$, $b=1$이고 $a+b=3$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-170",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_GEOMETRIC_FIGURE",
    "crossConceptKeys": [
      "CC_COORDINATE_TRIG",
      "CC_RADICAL_FUNCTION"
    ],
    "conditionKeys": [
      "COND_INTEGER"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
