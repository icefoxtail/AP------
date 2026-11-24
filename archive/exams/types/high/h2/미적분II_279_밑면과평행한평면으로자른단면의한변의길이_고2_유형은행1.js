window.examTitle = "미적분II_279_밑면과평행한평면으로자른단면의한변의길이_고2_유형은행1";

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
    "content": "어떤 입체도형을 밑면으로부터 높이가 $x$인 곳에서 밑면에 평행한 평면으로 자를 때 생기는 단면은 한 변의 길이가 $\\sqrt{32-3x}$인 정사각형이다. 이 입체도형의 높이가 $8$일 때, 이 입체도형의 부피는? [그림: 밑면이 한 변의 길이 $\\sqrt{32}$인 정사각형이고 높이가 $8$인 입체도형. 밑면으로부터 높이 $x$ ($0 \\le x \\le 8$)인 지점에서 밑면에 평행한 평면으로 자른 단면이 한 변의 길이 $\\sqrt{32-3x}$인 정사각형으로 표시되어 있다.]",
    "choices": [
      "144",
      "148",
      "152",
      "156",
      "160"
    ],
    "answer": "⑤",
    "solution": "단면은 한 변의 길이가 $\\sqrt{32-3x}$인 정사각형이므로 정사각형의 넓이 공식에 의해 $S(x)=(\\sqrt{32-3x})^2=32-3x$이다.\n입체도형의 부피는 단면의 넓이를 높이 방향으로 적분하여 구하므로 $V=\\int_0^8 S(x)\\,dx=\\int_0^8 (32-3x)\\,dx$이다.\n다항함수의 적분법에 의해 부정적분은 $\\int(32-3x)\\,dx=32x-\\frac{3}{2}x^2+C$이다.\n정적분의 계산법으로 위끝 $8$과 아래끝 $0$을 대입하면 $V=\\left[32x-\\frac{3}{2}x^2\\right]_0^8$이다.\n$V=\\left(32\\cdot 8-\\frac{3}{2}\\cdot 64\\right)-0=256-96=160$이다.\n주의: 근호를 제곱하기 전에 $32-3x$가 $[0,8]$에서 항상 양수임을 확인해야 한다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-193",
    "problemTypeKey": "PT_CALCULUS_SOLID_VOLUME",
    "templateKey": "TPL_CALCULUS_VOLUME_CROSS_SECTION",
    "crossConceptKeys": [
      "CC_DEFINITE_INTEGRAL"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "NONE"
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
    "content": "높이가 $\\frac{\\pi}{3}$인 입체도형을 밑면으로부터 높이가 $x$인 지점에서 밑면에 평행한 평면으로 자른 단면이 한 변의 길이가 $\\sqrt{6}\\tan x$인 정삼각형일 때, 이 입체도형의 부피는?",
    "choices": [
      "$\\frac{7}{2} - \\frac{\\sqrt{3}}{2}\\pi$",
      "$\\frac{9}{2} - \\frac{\\sqrt{3}}{2}\\pi$",
      "$\\frac{9}{2} - \\frac{\\sqrt{3}}{3}\\pi$",
      "$\\frac{11}{2} - \\frac{\\sqrt{3}}{2}\\pi$",
      "$\\frac{11}{2} - \\frac{\\sqrt{3}}{3}\\pi$"
    ],
    "answer": "②",
    "solution": "한 변의 길이가 $a$인 정삼각형의 넓이는 $\\frac{\\sqrt{3}}{4}a^2$이므로 $S(x)=\\frac{\\sqrt{3}}{4}(\\sqrt{6}\\tan x)^2=\\frac{3\\sqrt{3}}{2}\\tan^2 x$이다.\n삼각함수의 항등식 $1+\\tan^2 x=\\sec^2 x$에서 $\\tan^2 x=\\sec^2 x-1$이므로 $S(x)=\\frac{3\\sqrt{3}}{2}(\\sec^2 x-1)$이다.\n부피는 $V=\\int_0^{\\pi/3}S(x)\\,dx=\\frac{3\\sqrt{3}}{2}\\int_0^{\\pi/3}(\\sec^2 x-1)\\,dx$이다.\n$(\\tan x)'=\\sec^2 x$이므로 $\\int(\\sec^2 x-1)\\,dx=\\tan x-x$이다.\n$V=\\frac{3\\sqrt{3}}{2}\\left[\\tan x-x\\right]_0^{\\pi/3}=\\frac{3\\sqrt{3}}{2}\\left(\\sqrt{3}-\\frac{\\pi}{3}-0\\right)$이다.\n$\\sqrt{3}\\cdot\\sqrt{3}=3$이므로 $V=\\frac{9}{2}-\\frac{\\sqrt{3}}{2}\\pi$이다.\n주의: $\\tan^2 x$는 그대로 적분하지 말고 $\\sec^2 x-1$로 변형한 뒤 적분해야 한다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-193",
    "problemTypeKey": "PT_CALCULUS_SOLID_VOLUME",
    "templateKey": "TPL_CALCULUS_VOLUME_CROSS_SECTION",
    "crossConceptKeys": [
      "CC_DEFINITE_INTEGRAL",
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "높이가 $e^2 - e$인 어떤 용기가 있다. 밑면으로부터 높이가 $x$인 지점에서 밑면과 평행한 평면으로 자른 단면이 반지름의 길이가 $\\frac{\\ln(x+e)}{\\sqrt{x+e}}$인 원일 때, 이 용기의 부피는?",
    "choices": [
      "$\\frac{7}{3}\\pi$",
      "$\\frac{8}{3}\\pi$",
      "$3\\pi$",
      "$\\frac{10}{3}\\pi$",
      "$\\frac{11}{3}\\pi$"
    ],
    "answer": "①",
    "solution": "반지름 $r$인 원의 넓이는 $\\pi r^2$이므로 $S(x)=\\pi\\left(\\frac{\\ln(x+e)}{\\sqrt{x+e}}\\right)^2=\\pi\\frac{(\\ln(x+e))^2}{x+e}$이다.\n부피는 $V=\\int_0^{e^2-e}S(x)\\,dx=\\pi\\int_0^{e^2-e}\\frac{(\\ln(x+e))^2}{x+e}\\,dx$이다.\n$t=\\ln(x+e)$로 치환하면 $\\frac{dt}{dx}=\\frac{1}{x+e}$이므로 $dt=\\frac{dx}{x+e}$이다.\n$x=0$일 때 $t=\\ln e=1$이고, $x=e^2-e$일 때 $t=\\ln e^2=2$이므로 적분 구간은 $[1,2]$로 바뀐다.\n따라서 $V=\\pi\\int_1^2 t^2\\,dt=\\pi\\left[\\frac{t^3}{3}\\right]_1^2$이다.\n$V=\\pi\\left(\\frac{8}{3}-\\frac{1}{3}\\right)=\\frac{7}{3}\\pi$이다.\n주의: 치환적분에서는 적분 구간도 $t$의 값으로 정확히 바꾸어야 한다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-193",
    "problemTypeKey": "PT_CALCULUS_SOLID_VOLUME",
    "templateKey": "TPL_CALCULUS_VOLUME_CROSS_SECTION",
    "crossConceptKeys": [
      "CC_DEFINITE_INTEGRAL",
      "CC_LOGARITHMIC_FUNCTION_GRAPH"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "어떤 용기에 물을 넣으면 깊이가 $x \\, (0 \\le x \\le \\pi)$일 때, 수면은 반지름의 길이가 $\\sqrt{2x\\sin x}$인 원이라고 한다. 물의 깊이가 $\\pi$일 때, 용기에 담긴 물의 부피는?",
    "choices": [
      "$\\frac{1}{2}\\pi^2$",
      "$\\pi^2$",
      "$\\frac{3}{2}\\pi^2$",
      "$2\\pi^2$",
      "$\\frac{5}{2}\\pi^2$"
    ],
    "answer": "④",
    "solution": "수면은 반지름이 $\\sqrt{2x\\sin x}$인 원이므로 $S(x)=\\pi(\\sqrt{2x\\sin x})^2=2\\pi x\\sin x$이다.\n물의 부피는 $V=\\int_0^\\pi S(x)\\,dx=2\\pi\\int_0^\\pi x\\sin x\\,dx$이다.\n부분적분법에서 $u=x$, $v'=\\sin x$로 놓으면 $u'=1$, $v=-\\cos x$이다.\n$\\int_0^\\pi x\\sin x\\,dx=\\left[-x\\cos x\\right]_0^\\pi+\\int_0^\\pi\\cos x\\,dx$이다.\n$\\left[-x\\cos x\\right]_0^\\pi=-\\pi\\cos\\pi+0=\\pi$이고, $\\int_0^\\pi\\cos x\\,dx=\\left[\\sin x\\right]_0^\\pi=0$이다.\n따라서 $V=2\\pi(\\pi+0)=2\\pi^2$이다.\n주의: $v=-\\cos x$의 부호와 부분적분 공식의 뺄셈 부호가 겹치므로 정리 시 부호를 확인해야 한다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-193",
    "problemTypeKey": "PT_CALCULUS_SOLID_VOLUME",
    "templateKey": "TPL_CALCULUS_VOLUME_CROSS_SECTION",
    "crossConceptKeys": [
      "CC_DEFINITE_INTEGRAL",
      "CC_INTEGRATION_BY_PARTS_OR_EXPANSION"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "NONE"
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
    "content": "높이가 $6\\text{ cm}$인 용기를 높이가 $x\\text{ cm}$인 지점에서 밑면에 평행하게 자를 때 생기는 단면은 한 변의 길이가 $\\sqrt{x+2}e^{\\frac{x}{6}}\\text{ cm}$인 정사각형이다. 이 용기의 부피는?",
    "choices": [
      "$(15e^2 - 3)\\text{ cm}^3$",
      "$(15e^2 + 3)\\text{ cm}^3$",
      "$(18e^2 - 6)\\text{ cm}^3$",
      "$18e^2\\text{ cm}^3$",
      "$(24e^2 - 6)\\text{ cm}^3$"
    ],
    "answer": "②",
    "solution": "한 변의 길이가 $\\sqrt{x+2}e^{x/6}$인 정사각형이므로 $S(x)=(\\sqrt{x+2}e^{x/6})^2=(x+2)e^{x/3}$이다.\n부피는 $V=\\int_0^6(x+2)e^{x/3}\\,dx$이다.\n부분적분법에서 $u=x+2$, $v'=e^{x/3}$으로 놓으면 $u'=1$, $v=3e^{x/3}$이다.\n$V=\\left[3(x+2)e^{x/3}\\right]_0^6-\\int_0^6 3e^{x/3}\\,dx$이다.\n$\\left[3(x+2)e^{x/3}\\right]_0^6=3\\cdot 8e^2-3\\cdot 2=24e^2-6$이다.\n$\\int_0^6 3e^{x/3}\\,dx=\\left[9e^{x/3}\\right]_0^6=9e^2-9$이다.\n$V=(24e^2-6)-(9e^2-9)=15e^2+3$이다.\n주의: 아래끝 대입에서 $e^0=1$이므로 상수항이 $-6-(-9)=3$이 된다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-193",
    "problemTypeKey": "PT_CALCULUS_SOLID_VOLUME",
    "templateKey": "TPL_CALCULUS_VOLUME_CROSS_SECTION",
    "crossConceptKeys": [
      "CC_DEFINITE_INTEGRAL",
      "CC_INTEGRATION_BY_PARTS_OR_EXPANSION",
      "CC_EXPONENTIAL_FUNCTION_GRAPH"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "오른쪽 그림과 같이 높이가 $e^2 - 1$인 그릇이 있다. 그릇에 담긴 물의 깊이가 $x$일 때, 수면은 한 변의 길이가 $\\sqrt{\\ln(x+1)}$인 정사각형이다. 이 그릇의 부피는? [그림: 거꾸로 세운 사각뿔 형태의 곡면 그릇. 그릇의 전체 높이는 $e^2 - 1$이고, 바닥으로부터 깊이(높이)가 $x$인 지점의 수면은 한 변의 길이가 $\\sqrt{\\ln(x+1)}$인 정사각형 단면으로 표시되어 있다.]",
    "choices": [
      "$e^2 - 2$",
      "$e^2 - 1$",
      "$e^2 + 1$",
      "$e^2 + 2$",
      "$2e^2 - 1$"
    ],
    "answer": "③",
    "solution": "수면이 한 변의 길이 $\\sqrt{\\ln(x+1)}$인 정사각형이므로 $S(x)=(\\sqrt{\\ln(x+1)})^2=\\ln(x+1)$이다.\n부피는 $V=\\int_0^{e^2-1}\\ln(x+1)\\,dx$이다.\n$t=x+1$로 치환하면 $dt=dx$이고, $x=0$일 때 $t=1$, $x=e^2-1$일 때 $t=e^2$이다.\n따라서 $V=\\int_1^{e^2}\\ln t\\,dt$이다.\n부분적분법에서 $u=\\ln t$, $v'=1$로 놓으면 $u'=\\frac{1}{t}$, $v=t$이므로 $\\int\\ln t\\,dt=t\\ln t-t$이다.\n$V=\\left[t\\ln t-t\\right]_1^{e^2}=(e^2\\ln e^2-e^2)-(1\\ln 1-1)$이다.\n$\\ln e^2=2$, $\\ln 1=0$이므로 $V=(2e^2-e^2)-(0-1)=e^2+1$이다.\n주의: 아래끝 값이 $-1$이므로 빼기를 할 때 $+1$이 된다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-193",
    "problemTypeKey": "PT_CALCULUS_SOLID_VOLUME",
    "templateKey": "TPL_CALCULUS_VOLUME_CROSS_SECTION",
    "crossConceptKeys": [
      "CC_DEFINITE_INTEGRAL",
      "CC_INTEGRATION_BY_PARTS_OR_EXPANSION",
      "CC_LOGARITHMIC_FUNCTION_GRAPH"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  }
];
