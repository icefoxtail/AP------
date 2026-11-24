window.examTitle = "미적분II_116_사인법칙과코사인법칙의도형에의활용_고2_유형은행1";

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
    "content": "삼각형 $ABC$에서 $BC=8$, $\\angle C=3\\theta$, $\\angle B=\\theta$이다. $A$에서 $BC$에 내린 수선의 발을 $H$라 할 때 $\\lim_{\\theta\\to0^+}BH$는? [그림: $B=(0,0),C=(8,0)$에서 두 각을 이루는 반직선의 교점 $A$, 그 수직 아래에 $H$.]",
    "choices": [
      "$3$",
      "$4$",
      "$5$",
      "$6$",
      "$7$"
    ],
    "answer": "④",
    "solution": "삼각형 $ABC$의 세 각의 합에서 $\\angle A=\\pi-4\\theta$이다.\n사인법칙 $\\frac{AB}{\\sin3\\theta}=\\frac{BC}{\\sin4\\theta}$에 $BC=8$을 대입하면 $AB=\\frac{8\\sin3\\theta}{\\sin4\\theta}$이다.\n직각삼각형 $ABH$에서 $BH=AB\\cos\\theta$이다.\n따라서 $BH=8\\cdot\\frac{\\sin3\\theta}{\\sin4\\theta}\\cos\\theta$이다.\n극한에서 $\\frac{\\sin3\\theta}{3\\theta}\\to1$, $\\frac{4\\theta}{\\sin4\\theta}\\to1$, $\\cos\\theta\\to1$이므로 $\\frac{\\sin3\\theta}{\\sin4\\theta}\\to\\frac34$이다.\n따라서 $\\lim_{\\theta\\to0^+}BH=8\\cdot\\frac34=6$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-172",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_GEOMETRIC_FIGURE",
    "crossConceptKeys": [
      "CC_AUXILIARY_ALTITUDE",
      "CC_SHARED_HEIGHT"
    ],
    "conditionKeys": [
      "COND_RANGE"
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
    "content": "반지름 2인 원 위의 제1사분면 점 $P$에 대해 양의 $x$축 위에 $\\angle POA=3\\angle PAO$인 점 $A$를 잡는다. $P$가 $(2,0)$에 가까워질 때 $OA$의 극한은? [그림: 원점 $O$ 중심의 원, $A$는 원 밖의 양의 $x$축 위에 놓고 $OP,PA$를 긋는다.]",
    "choices": [
      "$6$",
      "$7$",
      "$8$",
      "$9$",
      "$10$"
    ],
    "answer": "③",
    "solution": "$\\angle PAO=t$로 놓으면 조건에서 $\\angle POA=3t$이다.\n삼각형 $OAP$의 세 각의 합에서 $\\angle APO=\\pi-4t$이다.\n사인법칙 $\\frac{OA}{\\sin(\\pi-4t)}=\\frac{OP}{\\sin t}$에 $OP=2$를 대입한다.\n$\\sin(\\pi-4t)=\\sin4t$이므로 $OA=2\\cdot\\frac{\\sin4t}{\\sin t}$이다.\n$\\lim_{t\\to0^+}\\frac{\\sin4t}{\\sin t}=4$이므로 $\\lim_{t\\to0^+}OA=2\\cdot4=8$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-172",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_GEOMETRIC_FIGURE",
    "crossConceptKeys": [
      "CC_OBLIQUE_TRIANGLE_MEASURE",
      "CC_UNIT_CIRCLE"
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
    "content": "원 위의 $A,P,Q$가 이 순서로 작은 호를 이루고 작은 호 $PQ$의 길이가 호 $AP$의 3배이다. $P$가 $A$에 가까워질 때 현 길이의 비 $PQ/AP$의 극한은? [그림: 반지름 2인 원의 중심 $O$에서 차례로 방향각 $0,2t,8t$에 $A,P,Q$를 잡는다.]",
    "choices": [
      "$0$",
      "$1$",
      "$2$",
      "$3$",
      "$4$"
    ],
    "answer": "④",
    "solution": "반지름을 $r$이라 하고 두 호의 중심각을 구한다.\n호 $AP$의 중심각은 $2t$이고 호 $PQ$의 중심각은 $8t-2t=6t$이다.\n조건 '호 $PQ$의 길이는 호 $AP$의 3배'는 $6t=3\\cdot2t$로 확인된다.\n현의 길이 공식에 의해 $AP=2r\\sin t$, $PQ=2r\\sin3t$이다.\n따라서 $\\frac{PQ}{AP}=\\frac{2r\\sin3t}{2r\\sin t}=\\frac{\\sin3t}{\\sin t}$이다.\n$\\lim_{t\\to0^+}\\frac{\\sin3t}{\\sin t}=3$이므로 극한값은 $3$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-172",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_GEOMETRIC_FIGURE",
    "crossConceptKeys": [
      "CC_RADIAN_DEGREE_CONVERSION",
      "CC_TRIG_RATIO"
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
    "content": "반지름 5인 부채꼴 $OAB$의 중심각이 $2\\theta$이다. 호 $AB$의 길이를 $l$이라 할 때 $\\lim_{\\theta\\to0^+}(l/AB)^2$는? [그림: $O=(0,0)$, $A=(5\\cos\\theta,5\\sin\\theta)$, $B=(5\\cos\\theta,-5\\sin\\theta)$를 잇고 작은 호와 현을 그린다.]",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "①",
    "solution": "부채꼴의 호의 길이는 $l=r\\alpha$이므로 $l=5\\cdot2\\theta=10\\theta$이다.\n현 $AB$의 길이는 중심각 $2\\theta$에 대하여 $AB=2\\cdot5\\sin\\theta=10\\sin\\theta$이다.\n따라서 $\\left(\\frac{l}{AB}\\right)^2=\\left(\\frac{10\\theta}{10\\sin\\theta}\\right)^2=\\left(\\frac{\\theta}{\\sin\\theta}\\right)^2$이다.\n$\\lim_{\\theta\\to0^+}\\frac{\\sin\\theta}{\\theta}=1$이므로 극한값은 $1^2=1$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 1,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-172",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_GEOMETRIC_FIGURE",
    "crossConceptKeys": [
      "CC_RADIAN_DEGREE_CONVERSION",
      "CC_TRIG_RATIO"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "NONE"
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
    "content": "지름 $AB=6$인 위쪽 반원의 중심이 $O$이고 호 위 $P$에 대해 $\\angle PAB=\\theta$이다. $C$를 선분 $OB$ 위에서 $\\angle OPC=2\\angle APO$가 되도록 잡을 때 $\\lim_{\\theta\\to0^+}[PAC]/[PCB]$는? [그림: $A=(-3,0),B=(3,0)$, $P=(3\\cos2\\theta,3\\sin2\\theta)$와 $PC$, $OC$는 양의 $x$축.]",
    "choices": [
      "$0$",
      "$1$",
      "$2$",
      "$3$",
      "$4$"
    ],
    "answer": "④",
    "solution": "$OA=OP=3$이므로 삼각형 $AOP$는 이등변삼각형이다.\n$\\angle AOP=\\pi-2\\theta$이므로 밑각은 $\\angle APO=\\angle PAO=\\theta$이다.\n조건 $\\angle OPC=2\\angle APO$에서 $\\angle OPC=2\\theta$이다.\n$P=(3\\cos2\\theta,3\\sin2\\theta)$이고 $PO$는 음의 $x$축 아래로 $2\\theta$ 기운 방향이다.\n따라서 $PC$는 음의 $x$축 아래로 $2\\theta+2\\theta=4\\theta$ 기운 방향이다.\n직선 $PC$의 기울기를 이용하면 $C=(c,0)$에 대하여 $\\frac{3\\sin2\\theta}{3\\cos2\\theta-c}=\\tan4\\theta$이다.\n즉 $c=3\\cos2\\theta-\\frac{3\\sin2\\theta}{\\tan4\\theta}$이다.\n$\\lim_{\\theta\\to0^+}c=3-3\\cdot\\frac{2\\theta}{4\\theta}=3-\\frac32=\\frac32$이다.\n두 삼각형 $PAC$와 $PCB$는 밑변이 $AC$, $CB$이고 높이가 공통이므로 넓이비는 밑변비와 같다.\n$\\frac{[PAC]}{[PCB]}=\\frac{AC}{CB}=\\frac{c-(-3)}{3-c}=\\frac{c+3}{3-c}$이다.\n극한에서 $\\frac{\\frac32+3}{3-\\frac32}=\\frac{9/2}{3/2}=3$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-172",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_GEOMETRIC_FIGURE",
    "crossConceptKeys": [
      "CC_OBLIQUE_TRIANGLE_MEASURE",
      "CC_SHARED_HEIGHT"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
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
    "content": "삼각형 $ABC$에서 $AB=5,AC=3,\\angle A=\\theta$이다. $\\lim_{\\theta\\to0^+}(BC-2)/\\theta^2$는? [그림: $A=(0,0),B=(5,0),C=(3\\cos\\theta,3\\sin\\theta)$.]",
    "choices": [
      "$3$",
      "$3.25$",
      "$3.5$",
      "$3.75$",
      "$4$"
    ],
    "answer": "④",
    "solution": "코사인법칙으로 $BC^2=5^2+3^2-2\\cdot5\\cdot3\\cos\\theta=34-30\\cos\\theta$이다.\n$34=4+30$이므로 $BC^2=4+30(1-\\cos\\theta)$이다.\n유리화하면 $BC-2=\\frac{BC^2-4}{BC+2}=\\frac{30(1-\\cos\\theta)}{BC+2}$이다.\n$\\lim_{\\theta\\to0^+}BC=2$이므로 $BC+2\\to4$이다.\n$\\lim_{\\theta\\to0^+}\\frac{1-\\cos\\theta}{\\theta^2}=\\frac12$이다.\n따라서 $\\lim_{\\theta\\to0^+}\\frac{BC-2}{\\theta^2}=\\frac{30}{4}\\cdot\\frac12=\\frac{15}{4}$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-172",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_GEOMETRIC_FIGURE",
    "crossConceptKeys": [
      "CC_OBLIQUE_TRIANGLE_MEASURE",
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
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
    "content": "반지름 8인 원에 내접한 이등변삼각형 $ABC$에서 $AB=AC$, $\\angle A=\\theta$이다. 내접반지름을 $r$이라 할 때 $\\lim_{\\theta\\to\\pi^-}r/(\\pi-\\theta)^2$는? [그림: 원점 중심 원에서 $A=(0,8)$, $B,C$는 방향각 $\\pi/2\\pm(\\pi-\\theta)$인 점.]",
    "choices": [
      "$0$",
      "$1$",
      "$2$",
      "$3$",
      "$4$"
    ],
    "answer": "③",
    "solution": "$\\delta=\\pi-\\theta$로 놓으면 $\\theta\\to\\pi^-$일 때 $\\delta\\to0^+$이다.\n외접원 반지름 $R=8$이고, 이등변삼각형이므로 $\\angle B=\\angle C=\\frac{\\delta}{2}$이다.\n내접원 반지름 공식 $r=4R\\sin\\frac{A}{2}\\sin\\frac{B}{2}\\sin\\frac{C}{2}$를 사용한다.\n$\\sin\\frac{A}{2}=\\sin\\frac{\\pi-\\delta}{2}=\\cos\\frac{\\delta}{2}$이다.\n따라서 $r=4\\cdot8\\cdot\\cos\\frac{\\delta}{2}\\cdot\\sin^2\\frac{\\delta}{4}=32\\cos\\frac{\\delta}{2}\\sin^2\\frac{\\delta}{4}$이다.\n$\\lim_{\\delta\\to0^+}\\frac{\\sin(\\delta/4)}{\\delta/4}=1$이므로 $\\sin^2\\frac{\\delta}{4}\\sim\\frac{\\delta^2}{16}$이다.\n그러면 $\\frac{r}{\\delta^2}\\to32\\cdot1\\cdot\\frac1{16}=2$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-172",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_GEOMETRIC_FIGURE",
    "crossConceptKeys": [
      "CC_TRIANGLE_AREA_TRIG",
      "CC_TRIG_RATIO"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
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
    "content": "빗변 $AB=2$인 직각삼각형 $ABC$에서 $\\angle BAC=\\theta$이다. 직선 $AC$의 양쪽에 $B,D$가 있고 $\\angle CAD=\\theta$, $\\angle ACD=3\\pi/4$이다. $\\lim_{\\theta\\to0^+}[BCD]/\\theta^2$는? [그림: $A=(0,0),B=(2,0)$, 방향각 $\\theta$의 $AC$ 위에 직각 꼭짓점 $C$, 방향각 $2\\theta$의 $AD$ 위에 $D$.]",
    "choices": [
      "$0$",
      "$1$",
      "$2$",
      "$3$",
      "$4$"
    ],
    "answer": "③",
    "solution": "직각삼각형 $ABC$에서 $AB=2$가 빗변이므로 $AC=2\\cos\\theta$, $BC=2\\sin\\theta$이다.\n삼각형 $ACD$에서 $\\angle CAD=\\theta$, $\\angle ACD=\\frac{3\\pi}{4}$이므로 $\\angle ADC=\\frac{\\pi}{4}-\\theta$이다.\n사인법칙 $\\frac{CD}{\\sin\\theta}=\\frac{AC}{\\sin(\\pi/4-\\theta)}$에서 $CD=\\frac{2\\cos\\theta\\sin\\theta}{\\sin(\\pi/4-\\theta)}$이다.\n$B$와 $D$는 직선 $AC$의 양쪽에 있으므로 $\\angle BCD=2\\pi-\\left(\\frac{\\pi}{2}+\\frac{3\\pi}{4}\\right)=\\frac{3\\pi}{4}$이다.\n$[BCD]=\\frac12\\cdot BC\\cdot CD\\cdot\\sin\\frac{3\\pi}{4}$이다.\n대입하면 $[BCD]=\\frac12\\cdot2\\sin\\theta\\cdot\\frac{2\\cos\\theta\\sin\\theta}{\\sin(\\pi/4-\\theta)}\\cdot\\frac{\\sqrt2}{2}$이다.\n정리하면 $[BCD]=\\frac{\\sqrt2\\cos\\theta\\sin^2\\theta}{\\sin(\\pi/4-\\theta)}$이다.\n$\\sin\\theta\\sim\\theta$, $\\sin(\\pi/4-\\theta)\\to\\frac{\\sqrt2}{2}$이므로 $\\lim_{\\theta\\to0^+}\\frac{[BCD]}{\\theta^2}=\\frac{\\sqrt2}{\\sqrt2/2}=2$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-172",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_GEOMETRIC_FIGURE",
    "crossConceptKeys": [
      "CC_TRIANGLE_AREA_TRIG",
      "CC_TRIG_RATIO"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 9,
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
    "content": "삼각형 $ABC$에서 $AB=9$, $\\angle A=\\theta$, $\\angle B=2\\theta$이다. $AB$ 위 $D$가 $\\angle ACD=\\angle BCD$를 만족할 때 $\\lim_{\\theta\\to0^+}CD/\\theta$는? [그림: $A=(0,0),B=(9,0)$에서 각각 주어진 내각의 반직선을 그리고 교점 $C$의 내각 이등분선을 $AB$까지 긋는다.]",
    "choices": [
      "$5$",
      "$6$",
      "$7$",
      "$8$",
      "$9$"
    ],
    "answer": "②",
    "solution": "삼각형 $ABC$의 세 각의 합에서 $\\angle C=\\pi-3\\theta$이다.\n사인법칙 $\\frac{AC}{\\sin2\\theta}=\\frac{AB}{\\sin3\\theta}$에 $AB=9$를 대입하면 $AC=\\frac{9\\sin2\\theta}{\\sin3\\theta}$이다.\n$\\lim_{\\theta\\to0^+}AC=9\\cdot\\frac{2}{3}=6$이다.\n$CD$는 $\\angle C$의 이등분선이므로 삼각형 $ACD$에서 $\\angle ACD=\\frac{\\pi-3\\theta}{2}=\\frac{\\pi}{2}-\\frac{3\\theta}{2}$이다.\n따라서 $\\angle ADC=\\pi-\\theta-\\left(\\frac{\\pi}{2}-\\frac{3\\theta}{2}\\right)=\\frac{\\pi}{2}+\\frac{\\theta}{2}$이다.\n삼각형 $ACD$에 사인법칙을 쓰면 $\\frac{CD}{\\sin\\theta}=\\frac{AC}{\\sin(\\pi/2+\\theta/2)}=\\frac{AC}{\\cos(\\theta/2)}$이다.\n즉 $CD=\\frac{AC\\sin\\theta}{\\cos(\\theta/2)}$이다.\n따라서 $\\lim_{\\theta\\to0^+}\\frac{CD}{\\theta}=6\\cdot\\lim_{\\theta\\to0^+}\\frac{\\sin\\theta}{\\theta}\\cdot\\frac1{\\cos(\\theta/2)}=6\\cdot1\\cdot1=6$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-172",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_GEOMETRIC_FIGURE",
    "crossConceptKeys": [
      "CC_OBLIQUE_TRIANGLE_MEASURE",
      "CC_TRIG_RATIO"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 10,
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
    "content": "$A=(-3,0)$에서 양의 $x$축과 $\\theta$를 이루는 반직선이 $x^2+y^2=9$와 다시 만나는 점을 $P$, $(x-2)^2+y^2=1$과 만나는 점 중 $P$에 가까운 점을 $Q$라 한다. $\\lim_{\\theta\\to0^+}PQ/\\theta^2$는? [그림: 두 원은 $(3,0)$에서 내접하며 $A$에서 시작한 반직선은 두 원을 지난다.]",
    "choices": [
      "$12$",
      "$13$",
      "$14$",
      "$15$",
      "$16$"
    ],
    "answer": "①",
    "solution": "$A=(-3,0)$에서 각 $\\theta$인 반직선을 $A+t(\\cos\\theta,\\sin\\theta)$로 나타낸다.\n큰 원 $x^2+y^2=9$와의 교점은 $t=0$과 $t=6\\cos\\theta$이므로 $AP=6\\cos\\theta$이다.\n작은 원 $(x-2)^2+y^2=1$에 대입하면 $(-3+t\\cos\\theta-2)^2+(t\\sin\\theta)^2=1$이다.\n정리하면 $t^2-10t\\cos\\theta+24=0$이다.\n근의 공식으로 $t=5\\cos\\theta\\pm\\sqrt{25\\cos^2\\theta-24}=5\\cos\\theta\\pm\\sqrt{1-25\\sin^2\\theta}$이다.\n$P$에 가까운 점은 $t$가 큰 쪽이므로 $AQ=5\\cos\\theta+\\sqrt{1-25\\sin^2\\theta}$이다.\n따라서 $PQ=AP-AQ=6\\cos\\theta-\\left(5\\cos\\theta+\\sqrt{1-25\\sin^2\\theta}\\right)=\\cos\\theta-\\sqrt{1-25\\sin^2\\theta}$이다.\n유리화하면 $PQ=\\frac{\\cos^2\\theta-(1-25\\sin^2\\theta)}{\\cos\\theta+\\sqrt{1-25\\sin^2\\theta}}=\\frac{24\\sin^2\\theta}{\\cos\\theta+\\sqrt{1-25\\sin^2\\theta}}$이다.\n$\\lim_{\\theta\\to0^+}\\cos\\theta=1$, $\\lim_{\\theta\\to0^+}\\sqrt{1-25\\sin^2\\theta}=1$이므로 $\\frac{PQ}{\\theta^2}\\to\\frac{24}{1+1}=12$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-172",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_GEOMETRIC_FIGURE",
    "crossConceptKeys": [
      "CC_OBLIQUE_TRIANGLE_MEASURE",
      "CC_TRIG_RATIO"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
