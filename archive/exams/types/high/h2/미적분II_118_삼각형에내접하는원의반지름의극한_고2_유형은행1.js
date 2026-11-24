window.examTitle = "미적분II_118_삼각형에내접하는원의반지름의극한_고2_유형은행1";

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
    "content": "$x$축 위 $P$, $y$축 위 $Q$가 모두 양의 반축에 있고 $PQ=24$이다. $\\angle OPQ=\\theta$일 때 삼각형 $OPQ$의 내접원 반지름을 $r$이라 하자. $\\lim_{\\theta\\to0^+}r/\\theta$는? [그림: 원점과 두 양의 절편 $P=(24\\cos\\theta,0)$, $Q=(0,24\\sin\\theta)$을 잇고 내접원을 그린다.]",
    "choices": [
      "$8$",
      "$9$",
      "$10$",
      "$11$",
      "$12$"
    ],
    "answer": "⑤",
    "solution": "직각삼각형 $OPQ$에서 빗변은 $PQ=24$이고, 삼각비에서 두 직각변은 $OP=24\\cos\\theta$, $OQ=24\\sin\\theta$이다.\n직각삼각형의 내접원 반지름 공식 $r=\\frac{a+b-c}{2}$를 적용하면 $r=\\frac{24\\cos\\theta+24\\sin\\theta-24}{2}=12(\\cos\\theta+\\sin\\theta-1)$이다.\n양변을 $\\theta$로 나누면 $\\frac{r}{\\theta}=12\\left(\\frac{\\sin\\theta}{\\theta}-\\frac{1-\\cos\\theta}{\\theta}\\right)$이다.\n$\\frac{1-\\cos\\theta}{\\theta}=\\frac{\\sin\\theta}{\\theta}\\cdot\\frac{\\sin\\theta}{1+\\cos\\theta}$이고 $\\frac{\\sin\\theta}{\\theta}\\to1$, $\\frac{\\sin\\theta}{1+\\cos\\theta}\\to0$이다.\n따라서 $\\frac{r}{\\theta}\\to12(1-0)=12$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-171",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_GEOMETRIC_FIGURE",
    "crossConceptKeys": [
      "CC_TRIG_RATIO",
      "CC_TRIANGLE_AREA_TRIG"
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
    "content": "반지름 6인 사분원의 $B=(0,6)$에서 반직선 $OP$에 내린 수선의 발을 $Q$, $Q$에서 $OB$에 내린 수선의 발을 $R$이라 하자. $OP$가 양의 $x$축과 이루는 각이 $\\theta$일 때 삼각형 $BQR$의 내접반지름 $r$에 대해 $\\lim_{\\theta\\to0^+}r/\\theta$는? [그림: $O=(0,0)$, $P=(6\\cos\\theta,6\\sin\\theta)$와 두 직각 투영을 그린다.]",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "②",
    "solution": "$B$에서 $OP$에 내린 수선의 발은 $Q=(6\\sin\\theta\\cos\\theta,6\\sin^2\\theta)$이고, $R=(0,6\\sin^2\\theta)$이다.\n삼각비와 피타고라스 정리에서 $BQ=6\\cos\\theta$, $BR=6-6\\sin^2\\theta=6\\cos^2\\theta$, $QR=6\\sin\\theta\\cos\\theta$이다.\n직각삼각형 $BQR$의 내접원 반지름 공식 $r=\\frac{BR+QR-BQ}{2}$를 적용하면 $r=\\frac{6\\cos^2\\theta+6\\sin\\theta\\cos\\theta-6\\cos\\theta}{2}=3\\cos\\theta(\\cos\\theta+\\sin\\theta-1)$이다.\n양변을 $\\theta$로 나누면 $\\frac{r}{\\theta}=3\\cos\\theta\\left(\\frac{\\sin\\theta}{\\theta}-\\frac{1-\\cos\\theta}{\\theta}\\right)$이다.\n$\\frac{\\sin\\theta}{\\theta}\\to1$이고 $\\frac{1-\\cos\\theta}{\\theta}=\\frac{\\sin\\theta}{\\theta}\\cdot\\frac{\\sin\\theta}{1+\\cos\\theta}\\to0$이다.\n따라서 $\\frac{r}{\\theta}\\to3\\cdot1\\cdot(1-0)=3$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-171",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_GEOMETRIC_FIGURE",
    "crossConceptKeys": [
      "CC_TRIG_RATIO",
      "CC_COMPLEMENTARY_ANGLE_TRIG"
    ],
    "conditionKeys": [
      "COND_RANGE"
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
    "content": "반지름 4인 사분원에서 $A=(4,0)$, $P=(4\\cos\\theta,4\\sin\\theta)$이고 $H$는 $P$의 $x$축 정사영이다. 삼각형 $AHP$의 내접반지름 $r$에 대해 $\\lim_{\\theta\\to0^+}r/\\theta^2$는? [그림: 원점 중심의 제1사분면 호와 직각삼각형 $AHP$.]",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "①",
    "solution": "$H=(4\\cos\\theta,0)$이므로 $AH=4-4\\cos\\theta=4(1-\\cos\\theta)$이고 $PH=4\\sin\\theta$이다.\n현 $AP$의 길이는 $AP=2\\cdot4\\sin\\frac{\\theta}{2}=8\\sin\\frac{\\theta}{2}$이다.\n직각삼각형 $AHP$의 내접원 반지름은 $r=\\frac{AH+PH-AP}{2}$이다.\n따라서 $\\frac{r}{\\theta^2}=\\frac{4(1-\\cos\\theta)}{2\\theta^2}+\\frac{4\\sin\\theta-8\\sin\\frac{\\theta}{2}}{2\\theta^2}$이다.\n첫째 항은 $2\\cdot\\frac{1-\\cos\\theta}{\\theta^2}\\to2\\cdot\\frac12=1$이다.\n둘째 항은 $4\\sin\\theta-8\\sin\\frac{\\theta}{2}=8\\sin\\frac{\\theta}{2}\\left(\\cos\\frac{\\theta}{2}-1\\right)$이므로 $u=\\frac{\\theta}{2}$라 하면 $\\frac{8\\sin u(\\cos u-1)}{8u^2}=\\sin u\\cdot\\frac{\\cos u-1}{u^2}\\to0\\cdot\\left(-\\frac12\\right)=0$이다.\n따라서 $\\frac{r}{\\theta^2}\\to1+0=1$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-171",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_GEOMETRIC_FIGURE",
    "crossConceptKeys": [
      "CC_TRIG_RATIO",
      "CC_COORDINATE_TRIG"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
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
    "content": "지름 $AB=6$인 반원 위에 $\\angle PAB=\\theta$인 $P$를 잡고 $P$의 $AB$ 정사영을 $H$라 하자. 삼각형 $AHP$의 내접원 넓이를 $S$라 할 때 $\\lim_{\\theta\\to0^+}S/[\\pi(PH)^2]$는? [그림: $A=(0,0),B=(6,0)$, 위쪽 반원에 $P$, 수직 아래 $H$, 삼각형 $AHP$의 내접원.]",
    "choices": [
      "$0.125$",
      "$0.2$",
      "$0.25$",
      "$0.5$",
      "$1$"
    ],
    "answer": "③",
    "solution": "$AB$가 지름이므로 원주각의 성질에서 $\\angle APB=90^\\circ$이다.\n직각삼각형 $APB$에서 $AP=6\\cos\\theta$, $PB=6\\sin\\theta$이다.\n$H$가 $P$의 $AB$ 위 정사영이므로 $AH=AP\\cos\\theta=6\\cos^2\\theta$, $PH=AP\\sin\\theta=6\\sin\\theta\\cos\\theta$이다.\n직각삼각형 $AHP$의 내접원 반지름은 $r=\\frac{AH+PH-AP}{2}=3\\cos\\theta(\\cos\\theta+\\sin\\theta-1)$이다.\n$PH=6\\sin\\theta\\cos\\theta$로 나누면 $\\frac{r}{PH}=\\frac{\\cos\\theta+\\sin\\theta-1}{2\\sin\\theta}=\\frac12\\left(1-\\frac{1-\\cos\\theta}{\\sin\\theta}\\right)$이다.\n$\\frac{1-\\cos\\theta}{\\sin\\theta}=\\frac{\\sin\\theta}{1+\\cos\\theta}\\to0$이므로 $\\frac{r}{PH}\\to\\frac12$이다.\n내접원의 넓이 $S=\\pi r^2$이므로 $\\frac{S}{\\pi(PH)^2}=\\left(\\frac{r}{PH}\\right)^2\\to\\left(\\frac12\\right)^2=\\frac14$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-171",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_GEOMETRIC_FIGURE",
    "crossConceptKeys": [
      "CC_TRIG_RATIO",
      "CC_ISOSCELES_RIGHT_TRIANGLE"
    ],
    "conditionKeys": [
      "COND_RANGE"
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
    "content": "지름 $AB=6$인 반원 위의 점 $P$가 $\\angle PAB=\\theta$를 만족한다. 삼각형 $APB$의 내접반지름을 $r$이라 할 때 ($PB$, $r$, $\\lim_{\\theta\\to0^+}r/\\theta$)가 옳게 나열된 것은? [그림: $A=(0,0),B=(6,0)$인 위쪽 반원에 $P$와 삼각형 $APB$의 내접원.]",
    "choices": [
      "$(6\\cos\\theta,3\\sin\\theta,3)$",
      "$(6\\sin\\theta,6(\\sin\\theta+\\cos\\theta-1),6)$",
      "$(6\\sin\\theta,3(\\sin\\theta+\\cos\\theta-1),3)$",
      "$(3\\sin\\theta,3(\\sin\\theta+\\cos\\theta-1),3)$",
      "$(6\\sin\\theta,3(\\sin\\theta+\\cos\\theta-1),6)$"
    ],
    "answer": "③",
    "solution": "$AB$가 지름이므로 원주각의 성질에서 $\\angle APB=90^\\circ$이다.\n직각삼각형 $APB$에서 $PB=6\\sin\\theta$, $AP=6\\cos\\theta$이다.\n직각삼각형의 내접원 반지름 공식 $r=\\frac{AP+PB-AB}{2}$를 적용하면 $r=\\frac{6\\cos\\theta+6\\sin\\theta-6}{2}=3(\\sin\\theta+\\cos\\theta-1)$이다.\n따라서 $(PB,r)=\\left(6\\sin\\theta,3(\\sin\\theta+\\cos\\theta-1)\\right)$이다.\n$\\frac{r}{\\theta}=3\\left(\\frac{\\sin\\theta}{\\theta}-\\frac{1-\\cos\\theta}{\\theta}\\right)$이고 $\\frac{1-\\cos\\theta}{\\theta}\\to0$이다.\n따라서 $\\frac{r}{\\theta}\\to3(1-0)=3$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-171",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_GEOMETRIC_FIGURE",
    "crossConceptKeys": [
      "CC_TRIG_RATIO",
      "CC_SPECIAL_ANGLES"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
