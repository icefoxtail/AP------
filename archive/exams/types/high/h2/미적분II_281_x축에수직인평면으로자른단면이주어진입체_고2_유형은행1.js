window.examTitle = "미적분II_281_x축에수직인평면으로자른단면이주어진입체_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "정적분의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-08",
    "standardUnit": "정적분의 활용",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "정적분의 활용"
    ],
    "wide": false,
    "content": "그림과 같이 곡선 $y = \\sqrt{6\\sin x}$ ($0 \\le x \\le \\pi$)와 $x$축으로 둘러싸인 도형을 밑면으로 하는 입체도형이 있다. 이 입체도형을 $x$축에 수직인 평면으로 자른 단면이 모두 정삼각형일 때, 이 입체도형의 부피는?\n[그림: 좌표평면 위의 곡선 $y=\\sqrt{6\\sin x}$ ($0 \\le x \\le \\pi$)와 $x$축으로 둘러싸인 영역을 밑면으로 하고, $x$축 위의 임의의 점 $x$에서 $x$축에 수직인 단면이 한 변의 길이가 $\\sqrt{6\\sin x}$인 정삼각형으로 위쪽에 세워진 입체도형]",
    "choices": [
      "$2\\sqrt{3}$",
      "$3\\sqrt{3}$",
      "$4\\sqrt{3}$",
      "$5\\sqrt{3}$",
      "$6\\sqrt{3}$"
    ],
    "answer": "②",
    "solution": "단면은 한 변의 길이가 $y=\\sqrt{6\\sin x}$인 정삼각형이므로 넓이는 $S(x)=\\frac{\\sqrt{3}}{4}y^2$이다.\n대입하면 $S(x)=\\frac{\\sqrt{3}}{4}\\cdot 6\\sin x=\\frac{3\\sqrt{3}}{2}\\sin x$이다.\n부피는 단면적의 정적분이므로 $V=\\int_0^\\pi \\frac{3\\sqrt{3}}{2}\\sin x\\,dx$이다.\n$\\sin x$의 부정적분은 $-\\cos x$이므로 $V=\\frac{3\\sqrt{3}}{2}\\left[-\\cos x\\right]_0^\\pi$이다.\n$=-\\frac{3\\sqrt{3}}{2}(\\cos\\pi-\\cos 0)=-\\frac{3\\sqrt{3}}{2}(-1-1)=3\\sqrt{3}$이다.\n주의: 정삼각형의 넓이는 $\\frac{\\sqrt{3}}{4}s^2$이지 $\\frac12s^2$이 아니다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-194",
    "problemTypeKey": "PT_CALCULUS_SOLID_VOLUME",
    "templateKey": "TPL_CALCULUS_VOLUME_CROSS_SECTION",
    "crossConceptKeys": [
      "CC_DEFINITE_INTEGRAL"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 2,
    "category": "정적분의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-08",
    "standardUnit": "정적분의 활용",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "정적분의 활용"
    ],
    "wide": false,
    "content": "반지름의 길이가 $3$인 원의 지름 $AB$에 수직인 현을 한 변으로 하는 정삼각형을 원을 포함하는 평면에 수직인 상태로 점 $A$에서 점 $B$까지 움직일 때 생기는 입체도형의 부피는?\n[그림: 반지름의 길이가 $3$인 원 $x^2+y^2=9$가 $xy$평면 위에 놓여 있고, 지름 $AB$가 $x$축 위에 놓여 있으며, 점 $x$ ($-3 \\le x \\le 3$)에서 $x$축에 수직인 현의 양 끝점을 잇는 선분을 한 변으로 하는 정삼각형이 평면에 수직으로 세워져 점 $A(-3, 0)$에서 점 $B(3, 0)$까지 이동하는 모습]",
    "choices": [
      "$36\\sqrt{3}$",
      "$40\\sqrt{3}$",
      "$44\\sqrt{3}$",
      "$48\\sqrt{3}$",
      "$52\\sqrt{3}$"
    ],
    "answer": "①",
    "solution": "지름 $AB$를 $x$축에 두고 원의 중심을 원점에 놓으면 원은 $x^2+y^2=9$이다.\n$x$축에 수직인 현의 길이는 원 위 두 점의 $y$좌표의 차이이므로 $2\\sqrt{9-x^2}$이다.\n단면은 이 현을 한 변으로 하는 정삼각형이므로 $S(x)=\\frac{\\sqrt{3}}{4}\\left(2\\sqrt{9-x^2}\\right)^2=\\sqrt{3}(9-x^2)$이다.\n부피는 $V=\\int_{-3}^{3}\\sqrt{3}(9-x^2)\\,dx$이고 피적분함수가 우함수이므로 $V=2\\sqrt{3}\\int_0^3(9-x^2)\\,dx$이다.\n$\\int_0^3(9-x^2)\\,dx=\\left[9x-\\frac{x^3}{3}\\right]_0^3=27-9=18$이다.\n따라서 $V=2\\sqrt{3}\\cdot 18=36\\sqrt{3}$이다.\n주의: 현의 길이는 $\\sqrt{9-x^2}$이 아니라 그 $2$배인 $2\\sqrt{9-x^2}$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-194",
    "problemTypeKey": "PT_CALCULUS_SOLID_VOLUME",
    "templateKey": "TPL_CALCULUS_VOLUME_CROSS_SECTION",
    "crossConceptKeys": [
      "CC_DEFINITE_INTEGRAL",
      "CC_SYMMETRIC_INTERVAL_INTEGRATION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 3,
    "category": "정적분의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-08",
    "standardUnit": "정적분의 활용",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "정적분의 활용"
    ],
    "wide": false,
    "content": "닫힌구간 $[0, 4]$에서 곡선 $y = \\frac{1}{\\sqrt{2x+1}}$ 위의 점 $P\\left(x, \\frac{1}{\\sqrt{2x+1}}\\right)$에서 $x$축에 내린 수선의 발을 $Q$라 하고, 선분 $PQ$를 한 변으로 하는 정사각형을 $x$축에 수직인 평면 위에 그린다. 점 $P$의 $x$좌표가 $x=0$에서 $x=4$까지 변할 때, 이 정사각형이 만드는 입체도형의 부피는?\n[그림: 좌표평면 위의 곡선 $y=\\frac{1}{\\sqrt{2x+1}}$ 위의 점 $P$에서 $x$축에 내린 수선의 발 $Q$, 선분 $PQ$를 한 변으로 하고 $x$축에 수직인 평면에 세워진 정사각형 단면]",
    "choices": [
      "$\\frac{1}{2}\\ln 2$",
      "$\\ln 2$",
      "$\\frac{1}{2}\\ln 5$",
      "$\\ln 3$",
      "$\\ln 4$"
    ],
    "answer": "④",
    "solution": "$x$축에 내린 수선 $PQ$의 길이는 곡선의 $y$좌표인 $\\frac{1}{\\sqrt{2x+1}}$이다.\n단면은 $PQ$를 한 변으로 하는 정사각형이므로 $S(x)=\\left(\\frac{1}{\\sqrt{2x+1}}\\right)^2=\\frac{1}{2x+1}$이다.\n$x$가 $0$에서 $4$까지 변하므로 $V=\\int_0^4\\frac{1}{2x+1}\\,dx$이다.\n$\\int\\frac{f'(x)}{f(x)}dx=\\ln|f(x)|+C$이므로 $\\int\\frac{1}{2x+1}dx=\\frac12\\ln(2x+1)+C$이다.\n따라서 $V=\\left[\\frac12\\ln(2x+1)\\right]_0^4=\\frac12(\\ln 9-\\ln 1)=\\frac12\\cdot 2\\ln 3=\\ln 3$이다.\n주의: $2x+1$의 계수 $2$의 역수 $\\frac12$을 곱해야 한다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-194",
    "problemTypeKey": "PT_CALCULUS_SOLID_VOLUME",
    "templateKey": "TPL_CALCULUS_VOLUME_CROSS_SECTION",
    "crossConceptKeys": [
      "CC_DEFINITE_INTEGRAL"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 4,
    "category": "정적분의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-08",
    "standardUnit": "정적분의 활용",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "정적분의 활용"
    ],
    "wide": false,
    "content": "곡선 $y = \\sqrt{x(4-x^2)}$ ($0 \\le x \\le 2$) 위의 점 $P(x, \\sqrt{x(4-x^2)})$에서 $x$축에 내린 수선의 발을 $Q$라 하고, 선분 $PQ$를 한 변으로 하는 정삼각형을 $x$축에 수직인 평면 위에 그린다. 점 $P$의 $x$좌표가 $x=0$에서 $x=2$까지 변할 때, 이 정삼각형이 만드는 입체도형의 부피는?\n[그림: $xy$평면에서 $0 \\le x \\le 2$에 정의된 곡선 $y=\\sqrt{x(4-x^2)}$, 곡선 위의 점 $P$에서 $x$축에 내린 수선의 발 $Q$, 선분 $PQ$를 한 변으로 하는 정삼각형이 $x$축에 수직으로 세워진 입체도형]",
    "choices": [
      "$\\frac{\\sqrt{3}}{4}$",
      "$\\frac{\\sqrt{3}}{2}$",
      "$\\sqrt{3}$",
      "$2\\sqrt{3}$",
      "$3\\sqrt{3}$"
    ],
    "answer": "③",
    "solution": "$x$축에 내린 수선 $PQ$의 길이는 $\\sqrt{x(4-x^2)}$이다.\n정삼각형의 넓이 공식 $S=\\frac{\\sqrt{3}}{4}s^2$에 대입하면 $S(x)=\\frac{\\sqrt{3}}{4}\\cdot x(4-x^2)=\\frac{\\sqrt{3}}{4}(4x-x^3)$이다.\n부피는 $V=\\frac{\\sqrt{3}}{4}\\int_0^2(4x-x^3)\\,dx$이다.\n$\\int_0^2(4x-x^3)dx=\\left[2x^2-\\frac{x^4}{4}\\right]_0^2=8-4=4$이다.\n따라서 $V=\\frac{\\sqrt{3}}{4}\\cdot 4=\\sqrt{3}$이다.\n주의: 제곱근을 제곱하면 $x(4-x^2)$이지 $x^2(4-x^2)$이 아니다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-194",
    "problemTypeKey": "PT_CALCULUS_SOLID_VOLUME",
    "templateKey": "TPL_CALCULUS_VOLUME_CROSS_SECTION",
    "crossConceptKeys": [
      "CC_DEFINITE_INTEGRAL"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 5,
    "category": "정적분의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-08",
    "standardUnit": "정적분의 활용",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "정적분의 활용"
    ],
    "wide": false,
    "content": "곡선 $y = \\sqrt{2e^x + 1}$과 $x$축, $y$축 및 직선 $x=1$로 둘러싸인 도형을 밑면으로 하는 입체도형이 있다. 이 입체도형을 $x$축에 수직인 평면으로 자른 단면이 모두 정사각형일 때, 이 입체도형의 부피는?\n[그림: 좌표평면에서 곡선 $y=\\sqrt{2e^x+1}$과 $y$축, $x$축, $x=1$로 둘러싸인 밑면 영역과, $x$축에 수직인 평면으로 자른 단면이 정사각형인 입체도형]",
    "choices": [
      "$2e - 1$",
      "$2e$",
      "$2e + 1$",
      "$3e - 1$",
      "$3e$"
    ],
    "answer": "①",
    "solution": "단면인 정사각형의 한 변의 길이는 $y=\\sqrt{2e^x+1}$이다.\n정사각형의 넓이는 $S(x)=y^2=2e^x+1$이다.\n$x$의 범위가 $0$부터 $1$까지이므로 $V=\\int_0^1(2e^x+1)\\,dx$이다.\n$2e^x+1$의 부정적분은 $2e^x+x$이므로 $V=\\left[2e^x+x\\right]_0^1$이다.\n$=(2e+1)-(2\\cdot 1+0)=2e-1$이다.\n주의: $e^0=1$이므로 아래끝 값은 $2$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-194",
    "problemTypeKey": "PT_CALCULUS_SOLID_VOLUME",
    "templateKey": "TPL_CALCULUS_VOLUME_CROSS_SECTION",
    "crossConceptKeys": [
      "CC_DEFINITE_INTEGRAL"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 6,
    "category": "정적분의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-08",
    "standardUnit": "정적분의 활용",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "정적분의 활용"
    ],
    "wide": false,
    "content": "두 곡선 $y = \\sqrt{2x+1}$과 $y = -\\sqrt{2x+1}$ 및 두 직선 $x=0, x=4$로 둘러싸인 도형을 밑면으로 하는 입체도형이 있다. 이 입체도형을 $x$축에 수직인 평면으로 자른 단면이 모두 정사각형일 때, 이 입체도형의 부피는?\n[그림: $xy$평면에서 $x=0$부터 $x=4$까지 위아래로 대칭인 두 곡선 $y=\\sqrt{2x+1}$과 $y=-\\sqrt{2x+1}$로 둘러싸인 도형을 밑면으로 하고, $x$축에 수직인 평면으로 자른 단면이 두 곡선 사이의 거리를 한 변으로 하는 정사각형인 입체도형]",
    "choices": [
      "$64$",
      "$72$",
      "$80$",
      "$88$",
      "$96$"
    ],
    "answer": "③",
    "solution": "두 곡선 사이의 거리가 정사각형의 한 변이므로 $s(x)=\\sqrt{2x+1}-(-\\sqrt{2x+1})=2\\sqrt{2x+1}$이다.\n단면의 넓이는 $S(x)=s(x)^2=4(2x+1)=8x+4$이다.\n부피는 $V=\\int_0^4(8x+4)\\,dx$이다.\n$\\int(8x+4)dx=4x^2+4x$이므로 $V=\\left[4x^2+4x\\right]_0^4$이다.\n$=64+16=80$이다.\n주의: 한 변의 길이는 두 곡선의 $y$값의 차이이므로 $2\\sqrt{2x+1}$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-194",
    "problemTypeKey": "PT_CALCULUS_SOLID_VOLUME",
    "templateKey": "TPL_CALCULUS_VOLUME_CROSS_SECTION",
    "crossConceptKeys": [
      "CC_DEFINITE_INTEGRAL"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 7,
    "category": "정적분의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-08",
    "standardUnit": "정적분의 활용",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "정적분의 활용"
    ],
    "wide": false,
    "content": "높이가 $4$인 입체도형이 있다. 밑면으로부터 높이가 $x$ ($0 \\le x \\le 4$)인 지점에서 밑면과 평행한 평면으로 자른 단면이 밑변과 높이의 길이가 모두 $\\sqrt{16-x^2}$인 직각이등변삼각형일 때, 이 입체도형의 부피는?\n[그림: 높이가 $4$인 입체도형에서 밑면으로부터 높이 $x$ ($0 \\le x \\le 4$)인 위치의 단면이 밑변과 높이가 모두 $\\sqrt{16-x^2}$인 직각이등변삼각형으로 나타난 입체도형]",
    "choices": [
      "$\\frac{32}{3}$",
      "$\\frac{40}{3}$",
      "$\\frac{56}{3}$",
      "$\\frac{64}{3}$",
      "$\\frac{80}{3}$"
    ],
    "answer": "④",
    "solution": "높이 $x$에서 단면은 밑변과 높이가 모두 $\\sqrt{16-x^2}$인 직각이등변삼각형이다.\n직각이등변삼각형의 넓이는 $S=\\frac12a^2$이므로 $S(x)=\\frac12(16-x^2)=8-\\frac12x^2$이다.\n부피는 높이 $0$부터 $4$까지 적분하여 $V=\\int_0^4\\left(8-\\frac12x^2\\right)dx$이다.\n$\\int\\left(8-\\frac12x^2\\right)dx=8x-\\frac{x^3}{6}$이므로 $V=\\left[8x-\\frac{x^3}{6}\\right]_0^4$이다.\n$=32-\\frac{64}{6}=32-\\frac{32}{3}=\\frac{96-32}{3}=\\frac{64}{3}$이다.\n주의: 적분 변수는 밑면에 수직인 높이 $x$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-194",
    "problemTypeKey": "PT_CALCULUS_SOLID_VOLUME",
    "templateKey": "TPL_CALCULUS_VOLUME_CROSS_SECTION",
    "crossConceptKeys": [
      "CC_DEFINITE_INTEGRAL"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 8,
    "category": "정적분의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-08",
    "standardUnit": "정적분의 활용",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "정적분의 활용"
    ],
    "wide": false,
    "content": "곡선 $y = \\tan(2x)$ ($0 \\le x \\le \\frac{\\pi}{6}$)와 $x$축 및 직선 $x = \\frac{\\pi}{6}$로 둘러싸인 도형을 밑면으로 하는 입체도형이 있다. 이 입체도형을 $x$축에 수직인 평면으로 자른 단면이 모두 정사각형일 때, 이 입체도형의 부피는?\n[그림: $xy$평면에서 곡선 $y=\\tan(2x)$ ($0 \\le x \\le \\frac{\\pi}{6}$)와 $x$축, 직선 $x=\\frac{\\pi}{6}$로 둘러싸인 밑면과, $x$축에 수직인 평면으로 자른 정사각형 단면으로 이루어진 입체도형]",
    "choices": [
      "$\\frac{\\sqrt{3}}{3} - \\frac{\\pi}{6}$",
      "$\\frac{\\sqrt{3}}{2} - \\frac{\\pi}{4}$",
      "$\\frac{\\sqrt{3}}{2} - \\frac{\\pi}{6}$",
      "$\\sqrt{3} - \\frac{\\pi}{3}$",
      "$\\sqrt{3} - \\frac{\\pi}{4}$"
    ],
    "answer": "③",
    "solution": "단면의 한 변의 길이가 $\\tan(2x)$인 정사각형이므로 $S(x)=\\tan^2(2x)$이다.\n$1+\\tan^2\\theta=\\sec^2\\theta$이므로 $S(x)=\\sec^2(2x)-1$이다.\n부피는 $V=\\int_0^{\\pi/6}(\\sec^2(2x)-1)\\,dx$이다.\n합성함수의 미분법의 역으로 $\\int\\sec^2(2x)dx=\\frac12\\tan(2x)+C$이다.\n따라서 $V=\\left[\\frac12\\tan(2x)-x\\right]_0^{\\pi/6}$이다.\n$=\\frac12\\tan\\frac{\\pi}{3}-\\frac{\\pi}{6}-0=\\frac{\\sqrt{3}}{2}-\\frac{\\pi}{6}$이다.\n주의: $\\sec^2(2x)$를 적분할 때 $\\frac12$을 곱해야 한다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-194",
    "problemTypeKey": "PT_CALCULUS_SOLID_VOLUME",
    "templateKey": "TPL_CALCULUS_VOLUME_CROSS_SECTION",
    "crossConceptKeys": [
      "CC_DEFINITE_INTEGRAL",
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 9,
    "category": "정적분의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-08",
    "standardUnit": "정적분의 활용",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "정적분의 활용"
    ],
    "wide": false,
    "content": "곡선 $y = \\sqrt{(2x+1)e^x}$ ($0 \\le x \\le 1$)와 $x$축 및 직선 $x=1$로 둘러싸인 도형을 밑면으로 하는 입체도형이 있다. 이 입체도형을 $x$축에 수직인 평면으로 자른 단면이 모두 정사각형일 때, 이 입체도형의 부피는?\n[그림: $0 \\le x \\le 1$에서 곡선 $y=\\sqrt{(2x+1)e^x}$, $x$축, 직선 $x=1$로 둘러싸인 밑면과, $x$축에 수직인 평면으로 자른 정사각형 단면을 갖는 입체도형]",
    "choices": [
      "$e$",
      "$e + 1$",
      "$2e - 1$",
      "$2e$",
      "$2e + 1$"
    ],
    "answer": "②",
    "solution": "단면인 정사각형의 한 변의 길이가 $\\sqrt{(2x+1)e^x}$이므로 $S(x)=(2x+1)e^x$이다.\n부피는 $V=\\int_0^1(2x+1)e^x\\,dx$이다.\n부분적분법 $\\int uv' dx=uv-\\int u'v\\,dx$에서 $u=2x+1$, $v'=e^x$로 두면 $u'=2$, $v=e^x$이다.\n따라서 $V=\\left[(2x+1)e^x\\right]_0^1-\\int_0^1 2e^x\\,dx$이다.\n$\\left[(2x+1)e^x\\right]_0^1=3e-1$이다.\n$\\int_0^1 2e^x dx=\\left[2e^x\\right]_0^1=2e-2$이다.\n$V=(3e-1)-(2e-2)=e+1$이다.\n주의: 아래끝에서 $(2\\cdot 0+1)e^0=1$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-194",
    "problemTypeKey": "PT_CALCULUS_SOLID_VOLUME",
    "templateKey": "TPL_CALCULUS_VOLUME_CROSS_SECTION",
    "crossConceptKeys": [
      "CC_DEFINITE_INTEGRAL",
      "CC_INTEGRATION_BY_PARTS_OR_EXPANSION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 10,
    "category": "정적분의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-08",
    "standardUnit": "정적분의 활용",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "정적분의 활용"
    ],
    "wide": false,
    "content": "양수 $k$에 대하여 곡선 $y = \\sqrt{\\frac{kx}{x^2 + 1}}$ ($0 \\le x \\le 2$)와 $x$축 및 직선 $x = 2$로 둘러싸인 도형을 밑면으로 하고, $x$축에 수직인 평면으로 자른 단면이 모두 정사각형인 입체도형의 부피가 $3\\ln 5$일 때, $k$의 값은?\n[그림: $xy$평면에서 $0 \\le x \\le 2$에 정의된 곡선 $y=\\sqrt{\\frac{kx}{x^2+1}}$과 $x$축, 직선 $x=2$로 둘러싸인 영역을 밑면으로 하고, $x$축에 수직인 정사각형 단면을 세운 입체도형]",
    "choices": [
      "$6$",
      "$7$",
      "$8$",
      "$9$",
      "$10$"
    ],
    "answer": "①",
    "solution": "단면의 한 변의 길이가 $\\sqrt{\\frac{kx}{x^2+1}}$이므로 $S(x)=\\frac{kx}{x^2+1}$이다.\n부피는 $V=\\int_0^2\\frac{kx}{x^2+1}\\,dx$이다.\n$t=x^2+1$로 치환하면 $dt=2x\\,dx$이므로 $x\\,dx=\\frac12dt$이다.\n구간은 $x=0$일 때 $t=1$, $x=2$일 때 $t=5$이다.\n따라서 $V=\\frac{k}{2}\\int_1^5\\frac{1}{t}\\,dt=\\frac{k}{2}\\left[\\ln t\\right]_1^5=\\frac{k}{2}\\ln 5$이다.\n$\\frac{k}{2}\\ln 5=3\\ln 5$이므로 $k=6$이다.\n주의: 치환 시 $\\frac12$을 빠뜨리면 $k=3$이 되어 틀린다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-194",
    "problemTypeKey": "PT_CALCULUS_SOLID_VOLUME",
    "templateKey": "TPL_CALCULUS_VOLUME_CROSS_SECTION",
    "crossConceptKeys": [
      "CC_DEFINITE_INTEGRAL",
      "CC_DEFINITE_INTEGRAL_PARAMETER_SOLVING"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 11,
    "category": "정적분의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-08",
    "standardUnit": "정적분의 활용",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "정적분의 활용"
    ],
    "wide": false,
    "content": "곡선 $f(x) = 2\\sqrt{x\\sin x}$ ($0 \\le x \\le \\pi$)와 $x$축으로 둘러싸인 부분을 밑면으로 하는 입체도형이 있다. 두 점 $P(x, 0)$, $Q(x, f(x))$를 지나고 $x$축에 수직인 평면으로 이 입체도형을 자른 단면은 선분 $PQ$를 지름으로 하는 반원일 때, 이 입체도형의 부피는?\n[그림: $0 \\le x \\le \\pi$에서 곡선 $f(x)=2\\sqrt{x\\sin x}$와 $x$축으로 둘러싸인 밑면과, $P(x,0)$와 $Q(x,f(x))$를 지름의 양 끝점으로 하는 반원이 $x$축에 수직으로 세워진 입체도형]",
    "choices": [
      "$\\frac{\\pi^2}{16}$",
      "$\\frac{\\pi^2}{8}$",
      "$\\frac{\\pi^2}{6}$",
      "$\\frac{\\pi^2}{4}$",
      "$\\frac{\\pi^2}{2}$"
    ],
    "answer": "⑤",
    "solution": "선분 $PQ$가 지름이므로 지름의 길이는 $f(x)=2\\sqrt{x\\sin x}$이다.\n반원의 반지름은 $r=\\sqrt{x\\sin x}$이다.\n반원의 넓이는 $S(x)=\\frac12\\pi r^2=\\frac{\\pi}{2}x\\sin x$이다.\n부피는 $V=\\frac{\\pi}{2}\\int_0^\\pi x\\sin x\\,dx$이다.\n부분적분법에서 $u=x$, $v'=\\sin x$로 두면 $u'=1$, $v=-\\cos x$이다.\n$\\int_0^\\pi x\\sin x\\,dx=\\left[-x\\cos x\\right]_0^\\pi+\\int_0^\\pi\\cos x\\,dx$이다.\n$\\left[-x\\cos x\\right]_0^\\pi=\\pi$이고 $\\int_0^\\pi\\cos x\\,dx=\\left[\\sin x\\right]_0^\\pi=0$이다.\n따라서 $V=\\frac{\\pi}{2}\\cdot\\pi=\\frac{\\pi^2}{2}$이다.\n주의: 단면은 반원이므로 $\\frac12\\pi r^2$을 쓴다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-194",
    "problemTypeKey": "PT_CALCULUS_SOLID_VOLUME",
    "templateKey": "TPL_CALCULUS_VOLUME_CROSS_SECTION",
    "crossConceptKeys": [
      "CC_DEFINITE_INTEGRAL",
      "CC_INTEGRATION_BY_PARTS_OR_EXPANSION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 12,
    "category": "정적분의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-08",
    "standardUnit": "정적분의 활용",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "정적분의 활용"
    ],
    "wide": false,
    "content": "좌표평면 위의 점 $P(x, 0)$ ($0 \\le x \\le \\pi$)을 지나면서 $x$축과 수직인 직선이 곡선 $y = 2\\sin x$와 만나는 점을 $Q$, 직선 $y = -x$와 만나는 점을 $R$이라 하자. $x$축을 접는 선으로 하여 좌표평면의 위쪽과 아래쪽 두 평면이 서로 수직이 되도록 접고 점 $P$가 원점에서 점 $(\\pi, 0)$까지 움직일 때, 삼각형 $PQR$에 의하여 만들어지는 입체도형의 부피는?\n[그림: $x$축을 공유하며 서로 수직으로 만나는 두 평면에서, 한 평면에는 곡선 $y=2\\sin x$ 위의 점 $Q(x, 2\\sin x, 0)$가 있고 다른 평면에는 직선 위의 점 $R(x, 0, x)$가 있으며, 선분 $PQ$와 $PR$이 직교하여 만들어진 직각삼각형 $PQR$이 $x=0$부터 $x=\\pi$까지 움직이며 형성하는 입체도형]",
    "choices": [
      "$\\frac{\\pi}{2}$",
      "$\\pi$",
      "$\\frac{3\\pi}{2}$",
      "$2\\pi$",
      "$\\frac{5\\pi}{2}$"
    ],
    "answer": "②",
    "solution": "점 $P(x,0)$에서 곡선 $y=2\\sin x$ 위의 점 $Q$까지의 거리는 $PQ=2\\sin x$이다.\n점 $P$에서 직선 $y=-x$ 위의 점 $R$까지의 거리는 $PR=|-x|=x$이다.\n$x$축을 접는 선으로 두 평면을 수직으로 접으면 $x$축에 수직인 $PQ$와 $PR$도 서로 수직이다.\n따라서 단면은 $\\angle QPR=90^\\circ$인 직각삼각형이고 $S(x)=\\frac12\\cdot 2\\sin x\\cdot x=x\\sin x$이다.\n부피는 $V=\\int_0^\\pi x\\sin x\\,dx$이다.\n부분적분법에서 $u=x$, $v'=\\sin x$이면 $V=\\left[-x\\cos x\\right]_0^\\pi+\\int_0^\\pi\\cos x\\,dx$이다.\n$=-(-\\pi)+0=\\pi$이다.\n주의: 접은 뒤에도 두 선분이 $x$축에 수직이므로 서로 수직이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-194",
    "problemTypeKey": "PT_CALCULUS_SOLID_VOLUME",
    "templateKey": "TPL_CALCULUS_VOLUME_CROSS_SECTION",
    "crossConceptKeys": [
      "CC_DEFINITE_INTEGRAL",
      "CC_INTEGRATION_BY_PARTS_OR_EXPANSION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 13,
    "category": "정적분의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-08",
    "standardUnit": "정적분의 활용",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "정적분의 활용"
    ],
    "wide": false,
    "content": "원 $x^2 + y^2 = 1$의 경계와 내부로 둘러싸인 영역을 밑면으로 하는 입체도형을 $x$축에 수직인 평면으로 자른 단면이 정사각형에서 그 정사각형에 내접하는 원을 제외한 도형과 같을 때, 이 입체도형의 부피는?\n[그림: $xy$평면 위의 원 $x^2+y^2=1$ 내부를 밑면으로 하고, $x$축 위의 점 $x$에서 $x$축에 수직인 평면으로 자른 단면이 한 변의 길이가 원의 현의 길이와 같은 정사각형 내부에서 내접원을 파낸 영역으로 이루어진 입체도형]",
    "choices": [
      "$\\frac{4-\\pi}{3}$",
      "$\\frac{8-2\\pi}{3}$",
      "$\\frac{12-3\\pi}{3}$",
      "$\\frac{16-4\\pi}{3}$",
      "$\\frac{20-5\\pi}{3}$"
    ],
    "answer": "④",
    "solution": "원 $x^2+y^2=1$에서 $x$축에 수직인 현의 길이는 $2\\sqrt{1-x^2}$이다.\n정사각형의 한 변이 이 현이므로 넓이는 $S_1=4(1-x^2)$이다.\n정사각형의 내접원의 반지름은 한 변의 절반인 $\\sqrt{1-x^2}$이므로 넓이는 $S_2=\\pi(1-x^2)$이다.\n단면의 넓이는 $S(x)=S_1-S_2=(4-\\pi)(1-x^2)$이다.\n부피는 $V=(4-\\pi)\\int_{-1}^1(1-x^2)\\,dx$이고 우함수이므로 $V=2(4-\\pi)\\int_0^1(1-x^2)\\,dx$이다.\n$\\int_0^1(1-x^2)dx=\\left[x-\\frac{x^3}{3}\\right]_0^1=\\frac23$이다.\n따라서 $V=2(4-\\pi)\\cdot\\frac23=\\frac{4(4-\\pi)}{3}=\\frac{16-4\\pi}{3}$이다.\n주의: 내접원의 지름이 한 변의 길이이므로 반지름은 절반이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-194",
    "problemTypeKey": "PT_CALCULUS_SOLID_VOLUME",
    "templateKey": "TPL_CALCULUS_VOLUME_CROSS_SECTION",
    "crossConceptKeys": [
      "CC_DEFINITE_INTEGRAL",
      "CC_SYMMETRIC_INTERVAL_INTEGRATION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 14,
    "category": "정적분의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-08",
    "standardUnit": "정적분의 활용",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "정적분의 활용"
    ],
    "wide": false,
    "content": "함수 $f(x) = \\sqrt{3x^2\\sin(x^3)}$ ($0 \\le x \\le \\sqrt[3]{\\pi}$)의 그래프와 $x$축으로 둘러싸인 부분을 밑면으로 하는 입체도형이 있다. 두 점 $P(x, 0)$, $Q(x, f(x))$를 지나고 $x$축에 수직인 평면으로 입체도형을 자른 단면이 선분 $PQ$를 한 변으로 하는 정삼각형일 때, 이 입체도형의 부피는?\n[그림: $0 \\le x \\le \\sqrt[3]{\\pi}$에서 곡선 $f(x)=\\sqrt{3x^2\\sin(x^3)}$과 $x$축으로 둘러싸인 밑면과, 선분 $PQ$를 한 변으로 하는 정삼각형이 $x$축에 수직으로 세워진 입체도형]",
    "choices": [
      "$\\frac{\\sqrt{3}}{10}$",
      "$\\frac{\\sqrt{3}}{8}$",
      "$\\frac{\\sqrt{3}}{6}$",
      "$\\frac{\\sqrt{3}}{4}$",
      "$\\frac{\\sqrt{3}}{2}$"
    ],
    "answer": "⑤",
    "solution": "단면은 $PQ=f(x)=\\sqrt{3x^2\\sin(x^3)}$을 한 변으로 하는 정삼각형이므로 $S(x)=\\frac{\\sqrt{3}}{4}\\cdot 3x^2\\sin(x^3)$이다.\n부피는 $V=\\frac{3\\sqrt{3}}{4}\\int_0^{\\sqrt[3]{\\pi}}x^2\\sin(x^3)\\,dx$이다.\n$u=x^3$으로 치환하면 $du=3x^2\\,dx$이므로 $x^2\\,dx=\\frac13du$이다.\n구간은 $x=0$일 때 $u=0$, $x=\\sqrt[3]{\\pi}$일 때 $u=\\pi$이다.\n따라서 $V=\\frac{3\\sqrt{3}}{4}\\cdot\\frac13\\int_0^\\pi\\sin u\\,du=\\frac{\\sqrt{3}}{4}\\int_0^\\pi\\sin u\\,du$이다.\n$=\\frac{\\sqrt{3}}{4}\\left[-\\cos u\\right]_0^\\pi=\\frac{\\sqrt{3}}{4}(1+1)=\\frac{\\sqrt{3}}{2}$이다.\n주의: $\\sqrt[3]{\\pi}$을 세제곱하면 $\\pi$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-194",
    "problemTypeKey": "PT_CALCULUS_SOLID_VOLUME",
    "templateKey": "TPL_CALCULUS_VOLUME_CROSS_SECTION",
    "crossConceptKeys": [
      "CC_DEFINITE_INTEGRAL"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 15,
    "category": "정적분의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-08",
    "standardUnit": "정적분의 활용",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "정적분의 활용"
    ],
    "wide": false,
    "content": "함수 $f(x) = \\begin{cases} \\sqrt{1-x^2} & (-1 \\le x \\le 0) \\\\ \\sqrt{4-x^2} & (0 < x \\le 2) \\end{cases}$의 그래프 위의 임의의 점 $P(x, f(x))$에서 $x$축에 내린 수선의 발을 $H$라 하고, 선분 $PH$를 한 변으로 하는 정사각형을 $x$축에 수직인 평면 위에 그린다. 점 $P$가 $x=-1$에서 $x=2$까지 변할 때, 이 정사각형이 만드는 입체도형의 부피는?\n[그림: $-1 \\le x \\le 0$에서는 $y=\\sqrt{1-x^2}$, $0 < x \\le 2$에서는 $y=\\sqrt{4-x^2}$로 정의된 곡선 위의 점 $P$에서 $x$축에 내린 수선의 발 $H$, 선분 $PH$를 한 변으로 하는 정사각형 단면이 세워진 입체도형]",
    "choices": [
      "$4$",
      "$5$",
      "$6$",
      "$7$",
      "$8$"
    ],
    "answer": "③",
    "solution": "$x\\le 0$에서 $PH=\\sqrt{1-x^2}$이므로 $S(x)=1-x^2$이다.\n$x>0$에서 $PH=\\sqrt{4-x^2}$이므로 $S(x)=4-x^2$이다.\n정적분의 구간 분할 성질에 의해 $V=\\int_{-1}^0(1-x^2)\\,dx+\\int_0^2(4-x^2)\\,dx$이다.\n(i) $\\int_{-1}^0(1-x^2)dx=\\left[x-\\frac{x^3}{3}\\right]_{-1}^0=0-\\left(-1+\\frac13\\right)=\\frac23$이다.\n(ii) $\\int_0^2(4-x^2)dx=\\left[4x-\\frac{x^3}{3}\\right]_0^2=8-\\frac83=\\frac{16}{3}$이다.\n따라서 $V=\\frac23+\\frac{16}{3}=\\frac{18}{3}=6$이다.\n주의: $x=0$에서 함수가 바뀌므로 구간을 반드시 나눈다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-194",
    "problemTypeKey": "PT_CALCULUS_SOLID_VOLUME",
    "templateKey": "TPL_CALCULUS_VOLUME_CROSS_SECTION",
    "crossConceptKeys": [
      "CC_DEFINITE_INTEGRAL",
      "CC_PIECEWISE_INTERVAL_SUM_DECOMPOSITION"
    ],
    "conditionKeys": [
      "COND_PIECEWISE_DOMAIN_PARTITION"
    ],
    "integrationPattern": "CASE_BRANCH"
  }
];
