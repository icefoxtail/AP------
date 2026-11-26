window.examTitle = "미적분II_119_부채꼴의호의길이와넓이의삼각함수의극한_고2_유형은행1";

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
    "content": "지름 $AB=6$인 반원 위에 $\\angle ABC=\\theta$인 $C$를 잡는다. 삼각형 $ABC$의 내심을 $I$, $I$에서 $AB,BC$에 내린 수선의 발을 각각 $D,E$라 하자. 작은 호 $DE$가 내접원에 있을 때 $\\lim_{\\theta\\to0^+}\\widehat{DE}/\\widehat{AC}$는? [그림: 위쪽 반원과 삼각형, 내접원 위 접점 $D,E$, 두 작은 호를 표시한다.]",
    "choices": [
      "$\\pi/4$",
      "$\\pi/3$",
      "$\\pi/2$",
      "$2\\pi/3$",
      "$\\pi$"
    ],
    "answer": "③",
    "solution": "지름 $AB$에 대한 원주각이므로 $\\angle ACB=\\frac{\\pi}{2}$이고 빗변은 $AB=6$이다.\n직각삼각형 $ABC$에서 $\\angle ABC=\\theta$이므로 $AC=6\\sin\\theta$, $BC=6\\cos\\theta$이다.\n내접원의 반지름은 직각삼각형의 공식 $r=\\frac{a+b-c}{2}$로 $$r=\\frac{6\\sin\\theta+6\\cos\\theta-6}{2}=3(\\sin\\theta+\\cos\\theta-1)$$이다.\n$ID\\perp AB$, $IE\\perp BC$이므로 사각형 $BDIE$의 내각의 합에서 $\\angle DIE=\\pi-\\theta$이다.\n주의: 작은 호 $DE$의 중심각은 $\\theta$가 아니라 $\\pi-\\theta$이다.\n작은 호 $DE$의 길이는 반지름 $r$과 중심각 $\\pi-\\theta$를 써서 $\\widehat{DE}=r(\\pi-\\theta)$이다.\n큰 원에서 $\\angle ABC$는 호 $AC$에 대한 원주각이므로 중심각은 $2\\theta$이고, 반지름이 $3$이므로 $$\\widehat{AC}=3\\cdot2\\theta=6\\theta$$이다.\n따라서 $$\\frac{\\widehat{DE}}{\\widehat{AC}}=\\frac{r(\\pi-\\theta)}{6\\theta}$$이다.\n$\\frac{r}{\\theta}=3\\left(\\frac{\\sin\\theta}{\\theta}+\\frac{\\cos\\theta-1}{\\theta}\\right)\\to3(1+0)=3$이다.\n$\\theta\\to0^+$일 때 $\\pi-\\theta\\to\\pi$이므로 $$\\lim_{\\theta\\to0^+}\\frac{\\widehat{DE}}{\\widehat{AC}}=\\frac{3\\cdot\\pi}{6}=\\frac{\\pi}{2}$$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-170",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_GEOMETRIC_FIGURE",
    "crossConceptKeys": [
      "CC_RADIAN_DEGREE_CONVERSION",
      "CC_TRIG_RATIO"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "INTERDEPENDENT"
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
    "content": "반지름 2인 원 위에서 $P=(2,0)$이고 작은 호 $PQ$ 길이는 $3t$이다. 위쪽 호 위의 $Q$에서 $x$축에 내린 수선의 발을 $H$라 한다. $\\lim_{t\\to0^+}PH/t^2$는? [그림: 원점 중심 원 위의 $P,Q$와 $Q$의 수직 아래 $H$.]",
    "choices": [
      "$2$",
      "$2.25$",
      "$2.5$",
      "$2.75$",
      "$3$"
    ],
    "answer": "②",
    "solution": "작은 호 $PQ$의 길이가 $3t$이고 반지름이 $2$이므로 중심각은 $$\\angle POQ=\\frac{3t}{2}$$이다.\n점 $Q$의 좌표는 $$Q=\\left(2\\cos\\frac{3t}{2},\\,2\\sin\\frac{3t}{2}\\right)$$이다.\n수선의 발 $H$는 $H=\\left(2\\cos\\frac{3t}{2},0\\right)$이므로 $$PH=2-2\\cos\\frac{3t}{2}=2\\left(1-\\cos\\frac{3t}{2}\\right)$$이다.\n반각공식 $1-\\cos x=2\\sin^2\\frac{x}{2}$를 쓰면 $$PH=4\\sin^2\\frac{3t}{4}$$이다.\n$\\frac{\\sin(3t/4)}{t}\\to\\frac34$이므로 $$\\frac{PH}{t^2}=4\\left(\\frac{\\sin(3t/4)}{t}\\right)^2\\to4\\left(\\frac34\\right)^2=\\frac94$$이다.\n주의: $PH$는 호의 길이가 아니라 수평거리이므로 $2-2\\cos(\\angle POQ)$로 계산한다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-170",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_GEOMETRIC_FIGURE",
    "crossConceptKeys": [
      "CC_RADIAN_DEGREE_CONVERSION",
      "CC_TRIG_RATIO"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/미적분II_119_부채꼴의호의길이와넓이의삼각함수의극한_고2_유형은행1/q2-problem.svg",
    "imageAlt": "반지름 2의 윗쪽 원호 P–Q 길이 3t와 수선의 발 H, 수평거리 PH를 보인다.",
    "imageCaption": "반지름 2의 윗쪽 원호 P–Q 길이 3t와 수선의 발 H, 수평거리 PH를 보인다.",
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
    "content": "반지름 2인 사분원에서 $A=(2,0)$, $P=(2\\cos\\theta,2\\sin\\theta)$, $H=(2\\cos\\theta,0)$이다. $P$에서 그은 접선과 양의 $x$축의 교점을 $Q$라 한다. 중심이 $Q$이고 반지름이 $QA$인 원이 $QP$와 만나는 점을 $R$이라 하자. 부채꼴 $QRA$ 넓이를 $g$, 삼각형 $OHP$ 넓이를 $f$라 할 때 $\\lim_{\\theta\\to0^+}\\sqrt g/(\\theta f)$는? [그림: 원점 중심 사분원과 $P$의 접선, $Q$를 중심으로 $QA,QR$ 사이의 작은 부채꼴.]",
    "choices": [
      "$\\sqrt\\pi/6$",
      "$\\sqrt\\pi/5$",
      "$\\sqrt\\pi/4$",
      "$\\sqrt\\pi/3$",
      "$\\sqrt\\pi/2$"
    ],
    "answer": "③",
    "solution": "원 $x^2+y^2=4$ 위의 점 $P(2\\cos\\theta,2\\sin\\theta)$에서의 접선은 $$x\\cos\\theta+y\\sin\\theta=2$$이다.\n$y=0$을 대입하면 $Q=(2\\sec\\theta,0)$이고 $A=(2,0)$이므로 $$QA=2\\sec\\theta-2=2(\\sec\\theta-1)$$이다.\n접선 $QP$는 반지름 $OP$에 수직이고 $OQ$는 $x$축이므로 $$\\angle AQP=\\frac{\\pi}{2}-\\theta$$이다.\n$R$은 중심 $Q$, 반지름 $QA$인 원 위에서 $QP$ 위에 있으므로 $QR=QA$이고, 부채꼴 $QRA$의 중심각은 $\\frac{\\pi}{2}-\\theta$이다.\n따라서 $$g=\\frac12(QA)^2\\left(\\frac{\\pi}{2}-\\theta\\right)=2(\\sec\\theta-1)^2\\left(\\frac{\\pi}{2}-\\theta\\right)$$이다.\n삼각형 $OHP$는 밑변 $OH=2\\cos\\theta$, 높이 $PH=2\\sin\\theta$이므로 $$f=\\frac12(2\\cos\\theta)(2\\sin\\theta)=2\\sin\\theta\\cos\\theta$$이다.\n먼저 $1-\\cos\\theta\\sim\\frac{\\theta^2}{2}$에서 $$\\frac{QA}{\\theta^2}=\\frac{2(1-\\cos\\theta)}{\\theta^2\\cos\\theta}\\to2\\cdot\\frac12\\cdot1=1$$이다.\n그러면 $$\\frac{g}{\\theta^4}=\\frac12\\left(\\frac{QA}{\\theta^2}\\right)^2\\left(\\frac{\\pi}{2}-\\theta\\right)\\to\\frac12\\cdot1^2\\cdot\\frac{\\pi}{2}=\\frac{\\pi}{4}$$이다.\n따라서 $\\frac{\\sqrt g}{\\theta^2}\\to\\frac{\\sqrt\\pi}{2}$이다.\n또 $$\\frac{f}{\\theta}=\\frac{2\\sin\\theta\\cos\\theta}{\\theta}\\to2$$이다.\n그러므로 $$\\lim_{\\theta\\to0^+}\\frac{\\sqrt g}{\\theta f}=\\frac{\\lim_{\\theta\\to0^+}\\sqrt g/\\theta^2}{\\lim_{\\theta\\to0^+}f/\\theta}=\\frac{\\sqrt\\pi/2}{2}=\\frac{\\sqrt\\pi}{4}$$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-170",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_GEOMETRIC_FIGURE",
    "crossConceptKeys": [
      "CC_TRIG_RATIO",
      "CC_LINE_SLOPE_TANGENT"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "INTERDEPENDENT",
    "image": "assets/images/미적분II_119_부채꼴의호의길이와넓이의삼각함수의극한_고2_유형은행1/q3-problem.svg",
    "imageAlt": "사분원의 P에서 그은 접선과 x축의 교점 Q, 작은 부채꼴 QRA, 삼각형 OHP를 보여 준다.",
    "imageCaption": "사분원의 P에서 그은 접선과 x축의 교점 Q, 작은 부채꼴 QRA, 삼각형 OHP를 보여 준다.",
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
    "content": "중심 $O$인 반지름 2의 부채꼴 $OAB$에서 $OA$는 양의 $x$축 위에 있고 중심각은 $\\theta$이다. 호 $AB$ 위에서 $\\angle AOC=\\theta/4$인 $C$를 잡는다. 정사각형 $DEFG$의 아래 변 $DE$는 $OA$ 위에 있고 $D$가 $E$보다 $O$에 가깝다. 위 꼭짓점 $G,F$는 각각 $OC$, 호 $AC$ 위에 있다. $D$를 $OB$에 정사영한 점이 $P$, $DP$와 $OC$의 교점이 $Q$이다. $f=[DEFG]$, $g=[OQP]$일 때 $\\lim_{\\theta\\to0^+}60f/(\\theta g)$는? [그림: $D,E$에서 연직선을 올리고 왼쪽 끝 $G$를 반직선 $OC$ 위, 오른쪽 끝 $F$를 원호 위에 놓아 정사각형을 그린다. $D$에서 $OB$에 수직인 선분을 그린다.]",
    "choices": [
      "$4$",
      "$6$",
      "$8$",
      "$10$",
      "$12$"
    ],
    "answer": "④",
    "solution": "$\\alpha=\\frac{\\theta}{4}$라 하고 정사각형의 한 변의 길이를 $h$, $D=(d,0)$, $E=(d+h,0)$라 하자.\n정사각형이므로 $G=(d,h)$, $F=(d+h,h)$이다.\n$G$가 반직선 $OC$ 위에 있으므로 $\\tan\\alpha=\\frac{h}{d}$, 즉 $$d=h\\cot\\alpha$$이다.\n$F$가 반지름 $2$인 원 위에 있으므로 $$(d+h)^2+h^2=4$$이다.\n$d=h\\cot\\alpha$를 대입하고 $h>0$에서 정리하면 $$h^2\\left((\\cot\\alpha+1)^2+1\\right)=4$$이다.\n분자와 분모에 $\\tan\\alpha$를 곱하면 $$h=\\frac{2\\tan\\alpha}{\\sqrt{(1+\\tan\\alpha)^2+\\tan^2\\alpha}}$$이다.\n$\\alpha\\to0^+$일 때 $\\tan\\alpha\\to0$이므로 $\\frac{h}{\\alpha}\\to2$이고, $$\\frac{h}{\\theta}=\\frac{h}{\\alpha}\\cdot\\frac{\\alpha}{\\theta}\\to2\\cdot\\frac14=\\frac12$$이다.\n따라서 $f=h^2$이고 $$\\frac{f}{\\theta^2}=\\left(\\frac{h}{\\theta}\\right)^2\\to\\frac14$$이다.\n한편 $D$를 $OB$에 정사영한 점이 $P$이므로 직각삼각형 $ODP$에서 $$OP=OD\\cos\\theta=d\\cos\\theta$$이다.\n$DP\\perp OB$이고 $Q$는 $DP$와 $OC$의 교점이므로 $\\angle OPQ=\\frac{\\pi}{2}$이고 $$\\angle POQ=\\theta-\\alpha=\\frac{3\\theta}{4}$$이다.\n직각삼각형 $OPQ$에서 $PQ=OP\\tan(\\theta-\\alpha)$이므로 $$g=[OQP]=\\frac12 OP\\cdot PQ=\\frac12(d\\cos\\theta)^2\\tan(\\theta-\\alpha)$$이다.\n$\\alpha\\to0$일 때 $d=h\\cot\\alpha=\\frac{h}{\\alpha}(\\alpha\\cot\\alpha)\\to2\\cdot1=2$이고, $\\frac{\\tan(3\\theta/4)}{\\theta}\\to\\frac34$이다.\n따라서 $$\\frac{g}{\\theta}\\to\\frac12\\cdot2^2\\cdot1^2\\cdot\\frac34=\\frac32$$이다.\n그러므로 $$\\frac{60f}{\\theta g}=60\\cdot\\frac{f/\\theta^2}{g/\\theta}\\to60\\cdot\\frac{1/4}{3/2}=60\\cdot\\frac16=10$$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-170",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_GEOMETRIC_FIGURE",
    "crossConceptKeys": [
      "CC_TRIG_RATIO",
      "CC_LINE_SLOPE_TANGENT"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "DEEP_COMPOSITE",
    "image": "assets/images/미적분II_119_부채꼴의호의길이와넓이의삼각함수의극한_고2_유형은행1/q4-problem.svg",
    "imageAlt": "부채꼴 OAB 안에서 G가 OC에, F가 원호 AC에 있는 정사각형 DEFG와 DP⊥OB, Q=DP∩OC를 나타낸다.",
    "imageCaption": "부채꼴 OAB 안에서 G가 OC에, F가 원호 AC에 있는 정사각형 DEFG와 DP⊥OB, Q=DP∩OC를 나타낸다.",
    "imageSize": "full"
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
    "content": "$AB=2$, $\\angle B=90^\\circ$, $\\angle A=\\theta$인 삼각형에서 $C$의 내각 이등분선이 $AB$와 만나는 점을 $D$라 한다. 중심 $A$, 반지름 $AD$인 원과 $AC$의 교점을 $E$라 하자. 부채꼴 $ADE$의 넓이 $S$, 삼각형 $BCE$의 넓이 $T$에 대해 $\\lim_{\\theta\\to0^+}S^2/T$는? [그림: $A=(0,0),B=(2,0),C=(2,2\\tan\\theta)$와 $CD$, 호 $DE$.]",
    "choices": [
      "$-2$",
      "$-1$",
      "$0$",
      "$1$",
      "$2$"
    ],
    "answer": "⑤",
    "solution": "좌표를 $A=(0,0)$, $B=(2,0)$로 잡으면 $\\angle A=\\theta$, $\\angle B=90^\\circ$이므로 $$C=(2,2\\tan\\theta)$$이다.\n직각삼각형 $ABC$에서 $$AC=2\\sec\\theta,\\qquad BC=2\\tan\\theta$$이다.\n각 $C$의 이등분선이 $AB$와 만나는 점이 $D$이므로 각의 이등분선 정리에 의해 $$\\frac{AD}{DB}=\\frac{AC}{CB}=\\frac{2\\sec\\theta}{2\\tan\\theta}=\\frac1{\\sin\\theta}$$이다.\n$AD+DB=AB=2$이므로 $AD=x$라 하면 $$\\frac{x}{2-x}=\\frac1{\\sin\\theta}\\ \\Rightarrow\\ x(1+\\sin\\theta)=2,$$ 즉 $$AD=\\frac{2}{1+\\sin\\theta}$$이다.\n중심 $A$, 반지름 $AD$인 부채꼴 $ADE$의 중심각은 $\\angle DAE=\\theta$이므로 $$S=\\frac12 AD^2\\theta$$이다.\n$E$는 $AC$ 위의 점이고 $AE=AD$이므로 $$CE=AC-AE=2\\sec\\theta-\\frac{2}{1+\\sin\\theta}$$이다.\n삼각형 $BCE$의 넓이는 밑변 $CE$와 $B$에서 $AC$까지의 거리 $2\\sin\\theta$를 써서 $$T=\\frac12\\cdot CE\\cdot2\\sin\\theta=CE\\sin\\theta$$이다.\n$\\theta\\to0^+$일 때 $AD\\to2$이므로 $$\\frac{S}{\\theta}=\\frac12 AD^2\\to2,\\qquad \\frac{S^2}{\\theta^2}\\to4$$이다.\n또 $$\\frac{CE}{\\theta}=\\frac{2}{\\theta}\\left(\\frac1{\\cos\\theta}-\\frac1{1+\\sin\\theta}\\right)=\\frac{2(1+\\sin\\theta-\\cos\\theta)}{\\theta\\cos\\theta(1+\\sin\\theta)}$$이다.\n$\\frac{\\sin\\theta}{\\theta}\\to1$, $\\frac{1-\\cos\\theta}{\\theta}\\to0$이므로 $$\\frac{CE}{\\theta}\\to\\frac{2(1+0)}{1\\cdot1}=2$$이다.\n따라서 $$\\frac{T}{\\theta^2}=\\frac{CE}{\\theta}\\cdot\\frac{\\sin\\theta}{\\theta}\\to2\\cdot1=2$$이다.\n그러므로 $$\\lim_{\\theta\\to0^+}\\frac{S^2}{T}=\\frac{\\lim S^2/\\theta^2}{\\lim T/\\theta^2}=\\frac42=2$$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-170",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_GEOMETRIC_FIGURE",
    "crossConceptKeys": [
      "CC_TRIG_RATIO",
      "CC_TRIANGLE_AREA_TRIG"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "INTERDEPENDENT",
    "image": "assets/images/미적분II_119_부채꼴의호의길이와넓이의삼각함수의극한_고2_유형은행1/q5-problem.svg",
    "imageAlt": "직각삼각형 ABC에서 C의 각 이등분선 CD와 A 중심의 작은 부채꼴 ADE, 삼각형 BCE를 표시한다.",
    "imageCaption": "직각삼각형 ABC에서 C의 각 이등분선 CD와 A 중심의 작은 부채꼴 ADE, 삼각형 BCE를 표시한다.",
    "imageSize": "full"
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
    "content": "지름 $AB=10$인 위쪽 반원의 중심은 $O$이다. 호 위의 $P$가 $\\angle PAO=\\theta$를 만족한다. $A$를 지나 $OP$에 수직인 직선이 위쪽 호와 다시 만나는 점을 $Q$라 한다. $\\theta>\\pi/4$에서 $\\lim_{\\theta\\to(\\pi/4)^+}[AOQ]/(\\theta-\\pi/4)$는? [그림: $A=(-5,0),B=(5,0)$, $OP$의 방향각은 $2\\theta$, $AQ$의 방향각은 $2\\theta-\\pi/2$.]",
    "choices": [
      "$35$",
      "$40$",
      "$45$",
      "$50$",
      "$55$"
    ],
    "answer": "④",
    "solution": "$A=(-5,0)$, $B=(5,0)$라 하면 반원은 $$x^2+y^2=25\\quad(y\\ge0)$$이다.\n$\\angle PAO=\\theta$이므로 직선 $AP$는 $A$에서 양의 $x$축과 각 $\\theta$를 이루고, $P=A+t(\\cos\\theta,\\sin\\theta)$로 놓을 수 있다.\n$P$를 원에 대입하면 $$(-5+t\\cos\\theta)^2+(t\\sin\\theta)^2=25,$$ 즉 $25-10t\\cos\\theta+t^2=25$에서 $t(t-10\\cos\\theta)=0$이다.\n$t>0$이므로 $t=10\\cos\\theta$이고 $$P=(-5+10\\cos^2\\theta,10\\cos\\theta\\sin\\theta)=(5\\cos2\\theta,5\\sin2\\theta)$$이다.\n따라서 $OP$의 방향각은 $2\\theta$이다.\n$A$를 지나 $OP$에 수직인 직선의 방향각을 $\\phi$라 하면 $\\phi=2\\theta-\\frac{\\pi}{2}$로 잡을 수 있다.\n$Q=A+s(\\cos\\phi,\\sin\\phi)$를 원에 대입하면 $s=10\\cos\\phi$이고 $$Q=(5\\cos2\\phi,5\\sin2\\phi)$$이다.\n$\\phi=2\\theta-\\frac{\\pi}{2}$이므로 $Q$의 중심각은 $$2\\phi=4\\theta-\\pi$$이다.\n따라서 $$Q=(5\\cos(4\\theta-\\pi),5\\sin(4\\theta-\\pi))$$이다.\n삼각형 $AOQ$는 밑변 $AO=5$이고 $Q$의 높이가 $5\\sin(4\\theta-\\pi)$이므로 $$[AOQ]=\\frac12\\cdot5\\cdot5\\sin(4\\theta-\\pi)=\\frac{25}{2}\\sin(4\\theta-\\pi)$$이다.\n$u=\\theta-\\frac{\\pi}{4}$라 하면 $u\\to0^+$이고 $4\\theta-\\pi=4u$이다.\n주의: $\\theta>\\pi/4$이므로 $Q$가 위쪽 호에 있고 $4\\theta-\\pi>0$이다.\n$\\lim_{x\\to0}\\frac{\\sin x}{x}=1$을 쓰면 $$\\frac{[AOQ]}{\\theta-\\pi/4}=\\frac{25}{2}\\cdot\\frac{\\sin4u}{u}=\\frac{25}{2}\\cdot4\\cdot\\frac{\\sin4u}{4u}\\to\\frac{25}{2}\\cdot4=50$$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-170",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_TRIG_GEOMETRIC_FIGURE",
    "crossConceptKeys": [
      "CC_TRIG_RATIO",
      "CC_ISOSCELES_RIGHT_TRIANGLE"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/미적분II_119_부채꼴의호의길이와넓이의삼각함수의극한_고2_유형은행1/q6-problem.svg",
    "imageAlt": "지름 AB=10인 윗반원에서 호 위 P, OP와 수직인 AQ, 삼각형 AOQ와 교차 직각을 표시한다.",
    "imageCaption": "지름 AB=10인 윗반원에서 호 위 P, OP와 수직인 AQ, 삼각형 AOQ와 교차 직각을 표시한다.",
    "imageSize": "full"
  }
];
