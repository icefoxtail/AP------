window.examTitle = "미적분II_278_밑면과평행한평면으로자른단면의넓이가주어_고2_유형은행1";

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
    "content": "높이가 $2$인 입체도형이 있다. 이 입체도형의 밑면으로부터 높이가 $x$인 지점에서 밑면에 평행한 평면으로 자를 때 생기는 단면의 넓이 $S(x)$가\n$$S(x) = \\cos\\left(\\frac{\\pi}{4}x\\right) + x$$\n일 때, 이 입체도형의 부피는?",
    "choices": [
      "$2 + \\frac{2}{\\pi}$",
      "$2 + \\frac{3}{\\pi}$",
      "$2 + \\frac{4}{\\pi}$",
      "$4 + \\frac{2}{\\pi}$",
      "$4 + \\frac{4}{\\pi}$"
    ],
    "answer": "③",
    "solution": "입체도형의 부피 공식: 단면의 넓이가 $S(x)$이고 높이가 $h$이면 $V=\\int_0^h S(x)\\,dx$이다.\n조건 대입: $h=2$, $S(x)=\\cos\\left(\\frac{\\pi}{4}x\\right)+x$이므로 $$V=\\int_0^2\\left\\{\\cos\\left(\\frac{\\pi}{4}x\\right)+x\\right\\}dx$$이다.\n적분의 선형성: 두 적분으로 나눈다. $$V=\\int_0^2\\cos\\left(\\frac{\\pi}{4}x\\right)dx+\\int_0^2 x\\,dx$$\n삼각함수의 적분: $\\int\\cos(kx)\\,dx=\\frac{1}{k}\\sin(kx)+C$이므로 $$\\int_0^2\\cos\\left(\\frac{\\pi}{4}x\\right)dx=\\left[\\frac{4}{\\pi}\\sin\\left(\\frac{\\pi}{4}x\\right)\\right]_0^2=\\frac{4}{\\pi}\\sin\\frac{\\pi}{2}-\\frac{4}{\\pi}\\sin 0=\\frac{4}{\\pi}$$\n다항함수의 적분: $$\\int_0^2 x\\,dx=\\left[\\frac{1}{2}x^2\\right]_0^2=\\frac{1}{2}\\cdot 4-0=2$$\n합산: $$V=\\frac{4}{\\pi}+2=2+\\frac{4}{\\pi}$$\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-192",
    "problemTypeKey": "PT_CALCULUS_SOLID_VOLUME",
    "templateKey": "TPL_CALCULUS_VOLUME_CROSS_SECTION",
    "crossConceptKeys": [
      "CC_DEFINITE_INTEGRAL"
    ],
    "conditionKeys": [],
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
    "content": "높이가 $2$인 어떤 입체도형을 밑면으로부터 높이가 $x\\,(0 \\le x \\le 2)$인 지점에서 밑면에 평행한 평면으로 자른 단면의 넓이가\n$$S(x) = 6x\\sqrt{4-x^2}$$\n일 때, 이 입체도형의 부피는?",
    "choices": [
      "$8$",
      "$12$",
      "$16$",
      "$20$",
      "$24$"
    ],
    "answer": "③",
    "solution": "입체도형의 부피 공식: $V=\\int_0^2 S(x)\\,dx$이다.\n조건 대입: $$V=\\int_0^2 6x\\sqrt{4-x^2}\\,dx$$\n치환적분법: $t=4-x^2$으로 놓으면 $\\frac{dt}{dx}=-2x$이므로 $x\\,dx=-\\frac{1}{2}dt$, 즉 $6x\\,dx=-3\\,dt$이다.\n적분구간 변경: $x=0$일 때 $t=4$, $x=2$일 때 $t=0$이다.\n치환 후: $$V=\\int_4^0 \\sqrt{t}\\,(-3)\\,dt=3\\int_0^4 t^{\\frac{1}{2}}dt$$\n멱함수의 정적분: $$V=3\\left[\\frac{2}{3}t^{\\frac{3}{2}}\\right]_0^4=2\\left[t^{\\frac{3}{2}}\\right]_0^4$$\n대입: $$V=2\\left(4^{\\frac{3}{2}}-0\\right)=2\\cdot(2^2)^{\\frac{3}{2}}=2\\cdot 2^3=16$$\n주의: 구간을 뒤집으면서 생기는 $(-)$ 부호를 $\\int_4^0$을 $\\int_0^4$으로 바꾸어 처리해야 한다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-192",
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
    "content": "높이가 $2$인 입체도형이 있다. 밑면으로부터 높이가 $x$인 지점에서 밑면에 평행한 평면으로 자른 단면의 넓이가 $\\frac{x^2+4x+5}{x+2}$일 때, 이 입체도형의 부피는?",
    "choices": [
      "$3 + \\ln 2$",
      "$4 + \\ln 2$",
      "$5 + \\ln 2$",
      "$6 + \\ln 2$",
      "$6 + 2\\ln 2$"
    ],
    "answer": "④",
    "solution": "입체도형의 부피 공식: $$V=\\int_0^2\\frac{x^2+4x+5}{x+2}\\,dx$$\n분자 변형: $x^2+4x+5=(x+2)^2+1$이므로 $$\\frac{x^2+4x+5}{x+2}=(x+2)+\\frac{1}{x+2}$$\n정적분 분리: $$V=\\int_0^2(x+2)\\,dx+\\int_0^2\\frac{1}{x+2}\\,dx$$\n다항함수 적분: $$\\int_0^2(x+2)\\,dx=\\left[\\frac{1}{2}x^2+2x\\right]_0^2=(2+4)-0=6$$\n분수함수 적분: $\\int\\frac{1}{x+2}dx=\\ln|x+2|+C$이므로 $$\\int_0^2\\frac{1}{x+2}dx=\\left[\\ln(x+2)\\right]_0^2=\\ln 4-\\ln 2=\\ln 2$$\n합산: $$V=6+\\ln 2$$\n주의: 아래끝 대입값 $\\ln 2$를 반드시 빼주어야 한다($0$이 아님).\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-192",
    "problemTypeKey": "PT_CALCULUS_SOLID_VOLUME",
    "templateKey": "TPL_CALCULUS_VOLUME_CROSS_SECTION",
    "crossConceptKeys": [
      "CC_DEFINITE_INTEGRAL",
      "CC_RATIONAL_FUNCTION"
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
    "content": "어떤 그릇에 물을 부었더니, 물의 깊이가 $x\\text{ cm}\\,(0 \\le x \\le \\pi)$일 때의 수면의 넓이가 $(x+1)\\sin x\\text{ cm}^2$라고 한다. 물의 깊이가 $\\frac{\\pi}{2}\\text{ cm}$일 때, 이 그릇에 담긴 물의 부피는? (단, 단위는 $\\text{cm}^3$)",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "②",
    "solution": "수면의 넓이와 부피의 관계: 깊이가 $x$일 때 수면의 넓이가 $S(x)$이면 $V=\\int_0^{\\frac{\\pi}{2}}S(x)\\,dx$이다.\n조건 대입: $$V=\\int_0^{\\frac{\\pi}{2}}(x+1)\\sin x\\,dx$$\n부분적분법: $\\int f g'\\,dx=fg-\\int f'g\\,dx$에서 $f=x+1$, $g'=\\sin x$로 놓으면 $f'=1$, $g=-\\cos x$이다.\n전개: $$V=\\left[-(x+1)\\cos x\\right]_0^{\\frac{\\pi}{2}}-\\int_0^{\\frac{\\pi}{2}}1\\cdot(-\\cos x)\\,dx$$\n정리: $$V=\\left[-(x+1)\\cos x\\right]_0^{\\frac{\\pi}{2}}+\\int_0^{\\frac{\\pi}{2}}\\cos x\\,dx$$\n첫 항 계산: $$\\left[-(x+1)\\cos x\\right]_0^{\\frac{\\pi}{2}}=0-(-1\\cdot 1)=1$$\n둘째 항 계산: $$\\int_0^{\\frac{\\pi}{2}}\\cos x\\,dx=\\left[\\sin x\\right]_0^{\\frac{\\pi}{2}}=1-0=1$$\n합산: $$V=1+1=2$$\n주의: 아래끝 $x=0$에서 $-(0+1)\\cos 0=-1$이므로 부호 처리를 조심한다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-192",
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
    "content": "어떤 그릇에 높이가 $x\\text{ cm}$가 되도록 물을 넣으면 물의 부피가\n$$\\frac{1}{2\\ln 2}(4^x + 2^{x+2} - 5)\\text{ cm}^3$$\n이라 한다. 수면의 넓이가 $1088\\text{ cm}^2$일 때의 채워진 물의 높이는? (단위는 $\\text{cm}$)",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "⑤",
    "solution": "부피와 수면의 넓이의 관계: 미적분의 기본정리에 의해 $S(x)=V'(x)$이다.\n지수함수의 미분법: $\\frac{d}{dx}a^x=a^x\\ln a$이므로 $$S(x)=\\frac{1}{2\\ln 2}\\left(4^x\\ln 4+2^{x+2}\\ln 2\\right)$$\n정리: $\\ln 4=2\\ln 2$, $2^{x+2}=4\\cdot 2^x$이므로 $$S(x)=\\frac{1}{2\\ln 2}\\left(2\\ln 2\\cdot 4^x+4\\ln 2\\cdot 2^x\\right)=4^x+2\\cdot 2^x$$\n방정식: 수면의 넓이가 $1088$이므로 $$4^x+2\\cdot 2^x=1088$$\n치환: $t=2^x>0$이라 하면 $4^x=t^2$이므로 $$t^2+2t-1088=0$$\n판별식: $D=2^2-4\\cdot 1\\cdot(-1088)=4+4352=4356=66^2$이므로 $$t=\\frac{-2\\pm 66}{2}$$\n경우 처리: (i) $t=\\frac{64}{2}=32$, (ii) $t=\\frac{-68}{2}=-34$. $t>0$이므로 (ii)는 버린다.\n환원: $2^x=32=2^5$이므로 $x=5$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-192",
    "problemTypeKey": "PT_CALCULUS_SOLID_VOLUME",
    "templateKey": "TPL_CALCULUS_VOLUME_CROSS_SECTION",
    "crossConceptKeys": [
      "CC_FUNDAMENTAL_THEOREM_OF_CALCULUS",
      "CC_EXPONENTIAL_FUNCTION_GRAPH"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
