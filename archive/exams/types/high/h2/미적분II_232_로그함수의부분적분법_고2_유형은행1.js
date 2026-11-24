window.examTitle = "미적분II_232_로그함수의부분적분법_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "여러 가지 적분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-07",
    "standardUnit": "여러 가지 적분법",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 적분법"
    ],
    "wide": false,
    "content": "함수 $f(x)$에 대하여\n$$f'(x) = \\ln(x+e), \\quad f(0) = 0$$\n일 때, $f(e^2-e)$의 값은?",
    "choices": [
      "$e^2$",
      "$e^2+e$",
      "$2e^2-e$",
      "$2e^2$",
      "$2e^2+e$"
    ],
    "answer": "①",
    "solution": "도함수 $f'(x)=\\ln(x+e)$를 적분하여 $f(x)$를 구한다(부정적분).\n$$f(x)=\\int \\ln(x+e)\\,dx$$\n부분적분법 $\\int u v'\\,dx=uv-\\int u'v\\,dx$에서 $u=\\ln(x+e)$, $v'=1$로 놓는다.\n$u'=\\frac{1}{x+e}$이고 $v=x+e$로 잡으면 약분이 쉽다.\n$$f(x)=(x+e)\\ln(x+e)-\\int (x+e)\\cdot\\frac{1}{x+e}\\,dx=(x+e)\\ln(x+e)-\\int 1\\,dx$$\n$$f(x)=(x+e)\\ln(x+e)-(x+e)+C$$\n초기조건 $f(0)=0$을 대입한다.\n$f(0)=e\\ln e-e+C=e-e+C=C$이므로 $C=0$이다.\n따라서 $f(x)=(x+e)\\ln(x+e)-(x+e)$이다.\n$x=e^2-e$를 대입하면 $x+e=e^2$이고 $\\ln(e^2)=2$이다.\n$$f(e^2-e)=e^2\\ln(e^2)-e^2=e^2\\cdot 2-e^2=e^2$$\n주의: $v=x$로 잡아도 되지만 $v=x+e$로 잡으면 약분이 한 번에 되어 실수가 줄어든다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-099",
    "problemTypeKey": "PT_CALCULUS_INTEGRATION_BY_PARTS",
    "templateKey": "TPL_CALCULUS_PARTS_PRODUCT",
    "crossConceptKeys": [
      "CC_INDEFINITE_INTEGRAL"
    ],
    "conditionKeys": [
      "COND_FUNCTION_VALUE_CONSTRAINT"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 2,
    "category": "여러 가지 적분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-07",
    "standardUnit": "여러 가지 적분법",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 적분법"
    ],
    "wide": false,
    "content": "함수 $f(x) = e^x - 1$의 역함수 $f^{-1}(x)$에 대하여\n$$g(x) = \\int f^{-1}(x)\\,dx$$\n라 하자. $g(0) = 2$일 때, $g(e^2-1)$의 값은?",
    "choices": [
      "$e^2$",
      "$e^2+1$",
      "$e^2+2$",
      "$e^2+3$",
      "$e^2+4$"
    ],
    "answer": "④",
    "solution": "역함수를 먼저 구한다. $y=e^x-1$에서 $e^x=y+1$이므로 $x=\\ln(y+1)$이다.\n따라서 $f^{-1}(x)=\\ln(x+1)$ ($x>-1$)이다.\n$g(x)=\\int \\ln(x+1)\\,dx$에 부분적분법을 적용한다.\n$u=\\ln(x+1)$, $v'=1$로 놓으면 $u'=\\frac{1}{x+1}$, $v=x+1$이다.\n$$g(x)=(x+1)\\ln(x+1)-\\int (x+1)\\cdot\\frac{1}{x+1}\\,dx=(x+1)\\ln(x+1)-(x+1)+C$$\n조건 $g(0)=2$를 대입한다.\n$g(0)=1\\cdot\\ln 1-1+C=-1+C=2$이므로 $C=3$이다.\n따라서 $g(x)=(x+1)\\ln(x+1)-(x+1)+3$이다.\n$x=e^2-1$을 대입하면 $x+1=e^2$이고 $\\ln(e^2)=2$이다.\n$$g(e^2-1)=e^2\\ln(e^2)-e^2+3=2e^2-e^2+3=e^2+3$$\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-099",
    "problemTypeKey": "PT_CALCULUS_INTEGRATION_BY_PARTS",
    "templateKey": "TPL_CALCULUS_PARTS_PRODUCT",
    "crossConceptKeys": [
      "CC_INVERSE_FUNCTION",
      "CC_INDEFINITE_INTEGRAL"
    ],
    "conditionKeys": [
      "COND_FUNCTION_VALUE_CONSTRAINT"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 3,
    "category": "여러 가지 적분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-07",
    "standardUnit": "여러 가지 적분법",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 적분법"
    ],
    "wide": false,
    "content": "함수\n$$f(x) = \\int 8x\\ln x\\,dx, \\quad f(1) = -2$$\n일 때, $f(e)$의 값은?",
    "choices": [
      "$\\frac{1}{2}e^2$",
      "$\\frac{3}{4}e^2$",
      "$e^2$",
      "$\\frac{3}{2}e^2$",
      "$2e^2$"
    ],
    "answer": "⑤",
    "solution": "피적분함수가 다항함수와 로그함수의 곱이므로 부분적분법을 쓴다.\n$u=\\ln x$, $v'=8x$로 놓으면 $u'=\\frac{1}{x}$, $v=4x^2$이다.\n$$f(x)=4x^2\\ln x-\\int 4x^2\\cdot\\frac{1}{x}\\,dx=4x^2\\ln x-\\int 4x\\,dx$$\n$$f(x)=4x^2\\ln x-2x^2+C$$\n초기조건 $f(1)=-2$를 대입한다.\n$f(1)=4\\ln 1-2+C=0-2+C=-2$이므로 $C=0$이다.\n따라서 $f(x)=4x^2\\ln x-2x^2$이다.\n$x=e$를 대입하면 $\\ln e=1$이다.\n$$f(e)=4e^2\\cdot 1-2e^2=2e^2$$\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-099",
    "problemTypeKey": "PT_CALCULUS_INTEGRATION_BY_PARTS",
    "templateKey": "TPL_CALCULUS_PARTS_PRODUCT",
    "crossConceptKeys": [
      "CC_INDEFINITE_INTEGRAL"
    ],
    "conditionKeys": [
      "COND_FUNCTION_VALUE_CONSTRAINT"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 4,
    "category": "여러 가지 적분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-07",
    "standardUnit": "여러 가지 적분법",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 적분법"
    ],
    "wide": false,
    "content": "함수 $f(x)$에 대하여\n$$f'(x) = (4x-2)\\ln x, \\quad f(1) = 4$$\n일 때, $f(e)$의 값은?",
    "choices": [
      "$e^2+1$",
      "$e^2+3$",
      "$e^2+5$",
      "$2e^2+1$",
      "$2e^2+3$"
    ],
    "answer": "②",
    "solution": "$f(x)=\\int (4x-2)\\ln x\\,dx$에 부분적분법을 적용한다.\n$u=\\ln x$, $v'=4x-2$로 놓으면 $u'=\\frac{1}{x}$, $v=2x^2-2x$이다.\n$$f(x)=(2x^2-2x)\\ln x-\\int (2x^2-2x)\\cdot\\frac{1}{x}\\,dx$$\n약분하면 피적분함수는 $2x-2$이다.\n$$f(x)=(2x^2-2x)\\ln x-\\int (2x-2)\\,dx=(2x^2-2x)\\ln x-(x^2-2x)+C$$\n조건 $f(1)=4$를 대입한다.\n$f(1)=0-(1-2)+C=1+C=4$이므로 $C=3$이다.\n따라서 $f(x)=(2x^2-2x)\\ln x-(x^2-2x)+3$이다.\n$x=e$를 대입하면 $\\ln e=1$이다.\n$$f(e)=(2e^2-2e)-e^2+2e+3=e^2+3$$\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-099",
    "problemTypeKey": "PT_CALCULUS_INTEGRATION_BY_PARTS",
    "templateKey": "TPL_CALCULUS_PARTS_PRODUCT",
    "crossConceptKeys": [
      "CC_INDEFINITE_INTEGRAL"
    ],
    "conditionKeys": [
      "COND_FUNCTION_VALUE_CONSTRAINT"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 5,
    "category": "여러 가지 적분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-07",
    "standardUnit": "여러 가지 적분법",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 적분법"
    ],
    "wide": false,
    "content": "함수 $f(x)$가\n$$f(x) = \\int x^3\\ln x\\,dx, \\quad f(1) = -\\frac{1}{16}$$\n일 때, $f(e)$의 값은?",
    "choices": [
      "$\\frac{1}{16}e^4$",
      "$\\frac{1}{8}e^4$",
      "$\\frac{3}{16}e^4$",
      "$\\frac{1}{4}e^4$",
      "$\\frac{5}{16}e^4$"
    ],
    "answer": "③",
    "solution": "$f(x)=\\int x^3\\ln x\\,dx$에 부분적분법을 적용한다.\n$u=\\ln x$, $v'=x^3$으로 놓으면 $u'=\\frac{1}{x}$, $v=\\frac{1}{4}x^4$이다.\n$$f(x)=\\frac{1}{4}x^4\\ln x-\\int \\frac{1}{4}x^4\\cdot\\frac{1}{x}\\,dx=\\frac{1}{4}x^4\\ln x-\\frac{1}{4}\\int x^3\\,dx$$\n$$f(x)=\\frac{1}{4}x^4\\ln x-\\frac{1}{16}x^4+C$$\n조건 $f(1)=-\\frac{1}{16}$을 대입한다.\n$f(1)=0-\\frac{1}{16}+C=-\\frac{1}{16}$이므로 $C=0$이다.\n따라서 $f(x)=\\frac{1}{4}x^4\\ln x-\\frac{1}{16}x^4$이다.\n$x=e$를 대입하면 $\\ln e=1$이다.\n$$f(e)=\\frac{1}{4}e^4-\\frac{1}{16}e^4=\\frac{4-1}{16}e^4=\\frac{3}{16}e^4$$\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-099",
    "problemTypeKey": "PT_CALCULUS_INTEGRATION_BY_PARTS",
    "templateKey": "TPL_CALCULUS_PARTS_PRODUCT",
    "crossConceptKeys": [
      "CC_INDEFINITE_INTEGRAL"
    ],
    "conditionKeys": [
      "COND_FUNCTION_VALUE_CONSTRAINT"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 6,
    "category": "여러 가지 적분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-07",
    "standardUnit": "여러 가지 적분법",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 적분법"
    ],
    "wide": false,
    "content": "곡선 $y=f(x)$ ($x>0$) 위의 임의의 점 $(x, f(x))$에서의 접선의 기울기가 $(\\ln x)^2$이고, 이 곡선이 점 $(1, 3)$을 지날 때, $f(e)$의 값은?",
    "choices": [
      "$e-2$",
      "$e-1$",
      "$e$",
      "$e+1$",
      "$e+2$"
    ],
    "answer": "④",
    "solution": "접선의 기울기가 $f'(x)$이므로 $f'(x)=(\\ln x)^2$이고, 점 $(1,3)$을 지나므로 $f(1)=3$이다.\n$f(x)=\\int (\\ln x)^2\\,dx$에 부분적분법을 적용한다.\n$u=(\\ln x)^2$, $v'=1$로 놓으면 합성함수 미분법에 의해 $u'=2\\ln x\\cdot\\frac{1}{x}$, $v=x$이다.\n$$f(x)=x(\\ln x)^2-\\int x\\cdot\\frac{2\\ln x}{x}\\,dx=x(\\ln x)^2-2\\int \\ln x\\,dx$$\n$\\int \\ln x\\,dx=x\\ln x-x$이므로 대입한다.\n$$f(x)=x(\\ln x)^2-2(x\\ln x-x)+C=x(\\ln x)^2-2x\\ln x+2x+C$$\n조건 $f(1)=3$을 대입한다.\n$f(1)=0-0+2+C=2+C=3$이므로 $C=1$이다.\n따라서 $f(x)=x(\\ln x)^2-2x\\ln x+2x+1$이다.\n$x=e$를 대입하면 $\\ln e=1$이다.\n$$f(e)=e\\cdot 1^2-2e\\cdot 1+2e+1=e-2e+2e+1=e+1$$\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-099",
    "problemTypeKey": "PT_CALCULUS_INTEGRATION_BY_PARTS",
    "templateKey": "TPL_CALCULUS_PARTS_PRODUCT",
    "crossConceptKeys": [
      "CC_TANGENT_LINE_SLOPE_AT_POINT",
      "CC_INDEFINITE_INTEGRAL"
    ],
    "conditionKeys": [
      "COND_POSITIVE",
      "COND_FUNCTION_VALUE_CONSTRAINT"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 7,
    "category": "여러 가지 적분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-07",
    "standardUnit": "여러 가지 적분법",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 적분법"
    ],
    "wide": false,
    "content": "미분가능한 함수 $f(x)$ ($x>0$)의 한 부정적분을 $F(x)$라 할 때,\n$$F(x) = xf(x) - (2x^2\\ln x - x^2), \\quad f(e) = 6$$\n이다. 다음 [보기] 중 옳은 것만을 있는 대로 고른 것은?\n\n[보기]\nㄱ. $f'(x) = 4\\ln x$\nㄴ. $f(x) = 4x\\ln x - 4x + 6$\nㄷ. 함수 $f(x)$의 극솟값은 $2$이다.",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄱ, ㄴ",
      "ㄴ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "⑤",
    "solution": "$F$가 $f$의 부정적분이므로 $F'(x)=f(x)$이다.\n주어진 등식 $F(x)=xf(x)-(2x^2\\ln x-x^2)$의 양변을 미분한다.\n곱의 미분법에 의해 $(xf(x))'=f(x)+xf'(x)$이다.\n또 $(2x^2\\ln x-x^2)'=4x\\ln x+2x^2\\cdot\\frac{1}{x}-2x=4x\\ln x$이다.\n따라서 $f(x)=f(x)+xf'(x)-4x\\ln x$이므로 $xf'(x)=4x\\ln x$이다.\n$x>0$이므로 양변을 $x$로 나누면 $f'(x)=4\\ln x$이다. (ㄱ 참)\n$f(x)=\\int 4\\ln x\\,dx=4(x\\ln x-x)+C=4x\\ln x-4x+C$이다.\n$f(e)=4e-4e+C=C=6$이므로 $C=6$이다.\n따라서 $f(x)=4x\\ln x-4x+6$이다. (ㄴ 참)\n$f'(x)=4\\ln x=0$에서 $x=1$이고, $0<x<1$에서 $f'<0$, $x>1$에서 $f'>0$이므로 $x=1$에서 극소이다.\n극솟값은 $f(1)=4\\ln 1-4+6=0-4+6=2$이다. (ㄷ 참)\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-099",
    "problemTypeKey": "PT_CALCULUS_INTEGRATION_BY_PARTS",
    "templateKey": "TPL_CALCULUS_PARTS_PRODUCT",
    "crossConceptKeys": [
      "CC_INDEFINITE_INTEGRAL",
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS"
    ],
    "conditionKeys": [
      "COND_POSITIVE",
      "COND_FUNCTION_VALUE_CONSTRAINT"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 8,
    "category": "여러 가지 적분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-07",
    "standardUnit": "여러 가지 적분법",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 적분법"
    ],
    "wide": false,
    "content": "함수 $f(x)$에 대하여\n$$xf'(x) + f(x) = 2\\ln x, \\quad f(1) = -2$$\n일 때, $f(e^2)$의 값은?",
    "choices": [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "answer": "②",
    "solution": "좌변 $xf'(x)+f(x)$는 곱의 미분법에 의해 $(xf(x))'$이다.\n따라서 $(xf(x))'=2\\ln x$이다.\n양변을 적분하면 $xf(x)=\\int 2\\ln x\\,dx$이다.\n$\\int \\ln x\\,dx=x\\ln x-x$이므로 $xf(x)=2x\\ln x-2x+C$이다.\n조건 $f(1)=-2$를 대입한다.\n$1\\cdot f(1)=2\\ln 1-2+C=0-2+C=-2$이므로 $C=0$이다.\n따라서 $xf(x)=2x\\ln x-2x$이다.\n$x>0$이므로 양변을 $x$로 나누면 $f(x)=2\\ln x-2$이다.\n$x=e^2$을 대입하면 $\\ln(e^2)=2$이다.\n$$f(e^2)=2\\cdot 2-2=2$$\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-099",
    "problemTypeKey": "PT_CALCULUS_INTEGRATION_BY_PARTS",
    "templateKey": "TPL_CALCULUS_PARTS_PRODUCT",
    "crossConceptKeys": [
      "CC_INDEFINITE_INTEGRAL"
    ],
    "conditionKeys": [
      "COND_FUNCTION_VALUE_CONSTRAINT"
    ],
    "integrationPattern": "REINTERPRETATION"
  },
  {
    "id": 9,
    "category": "여러 가지 적분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-07",
    "standardUnit": "여러 가지 적분법",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 적분법"
    ],
    "wide": false,
    "content": "양의 실수 전체의 집합을 정의역으로 하는 함수 $f(x)=x$에 대하여 다음 두 조건을 모두 만족하는 함수 $g(x)$가 있다. 이때 $g(e)$의 값은?\n\n(가) $f'(x)g(x) + f(x)g'(x) = \\ln x - 1$\n(나) $g(1) = -2$",
    "choices": [
      "-2",
      "-1",
      "0",
      "1",
      "2"
    ],
    "answer": "②",
    "solution": "$f(x)=x$이므로 $f'(x)=1$이다.\n조건 (가)의 좌변은 곱의 미분법에 의해 $(xg(x))'$이다.\n따라서 $(xg(x))'=\\ln x-1$이다.\n양변을 적분한다.\n$$xg(x)=\\int(\\ln x-1)\\,dx=\\int\\ln x\\,dx-\\int 1\\,dx$$\n$\\int\\ln x\\,dx=x\\ln x-x$이므로 대입한다.\n$$xg(x)=(x\\ln x-x)-x+C=x\\ln x-2x+C$$\n조건 (나) $g(1)=-2$를 대입한다.\n$1\\cdot g(1)=0-2+C=-2$이므로 $C=0$이다.\n따라서 $xg(x)=x\\ln x-2x$이고, $x>0$이므로 $g(x)=\\ln x-2$이다.\n$g(e)=\\ln e-2=1-2=-1$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-099",
    "problemTypeKey": "PT_CALCULUS_INTEGRATION_BY_PARTS",
    "templateKey": "TPL_CALCULUS_PARTS_PRODUCT",
    "crossConceptKeys": [
      "CC_INDEFINITE_INTEGRAL"
    ],
    "conditionKeys": [
      "COND_POSITIVE",
      "COND_FUNCTION_VALUE_CONSTRAINT"
    ],
    "integrationPattern": "REINTERPRETATION"
  },
  {
    "id": 10,
    "category": "여러 가지 적분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-07",
    "standardUnit": "여러 가지 적분법",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 적분법"
    ],
    "wide": false,
    "content": "양의 실수 전체의 집합에서 정의된 미분가능한 함수 $f(x)$에 대하여 다음 조건을 만족할 때, $f(e)$의 값은?\n\n(가) $f'(x) = 2x\\ln x$\n(나) 함수 $f(x)$의 극솟값이 $1$이다.",
    "choices": [
      "$\\frac{e^2-1}{2}$",
      "$\\frac{e^2}{2}$",
      "$\\frac{e^2+1}{2}$",
      "$\\frac{e^2+2}{2}$",
      "$\\frac{e^2+3}{2}$"
    ],
    "answer": "⑤",
    "solution": "$f'(x)=2x\\ln x=0$에서 $x>0$이므로 $\\ln x=0$, 즉 $x=1$이다.\n$0<x<1$에서 $f'(x)<0$, $x>1$에서 $f'(x)>0$이므로 $x=1$에서 극소이다.\n조건 (나)에서 극솟값이 $1$이므로 $f(1)=1$이다.\n$f(x)=\\int 2x\\ln x\\,dx$에 부분적분법을 적용한다.\n$u=\\ln x$, $v'=2x$로 놓으면 $u'=\\frac{1}{x}$, $v=x^2$이다.\n$$f(x)=x^2\\ln x-\\int x^2\\cdot\\frac{1}{x}\\,dx=x^2\\ln x-\\int x\\,dx$$\n$$f(x)=x^2\\ln x-\\frac{1}{2}x^2+C$$\n$f(1)=0-\\frac{1}{2}+C=1$이므로 $C=\\frac{3}{2}$이다.\n따라서 $f(x)=x^2\\ln x-\\frac{1}{2}x^2+\\frac{3}{2}$이다.\n$x=e$를 대입하면 $\\ln e=1$이다.\n$$f(e)=e^2-\\frac{1}{2}e^2+\\frac{3}{2}=\\frac{1}{2}e^2+\\frac{3}{2}=\\frac{e^2+3}{2}$$\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-099",
    "problemTypeKey": "PT_CALCULUS_INTEGRATION_BY_PARTS",
    "templateKey": "TPL_CALCULUS_PARTS_PRODUCT",
    "crossConceptKeys": [
      "CC_INDEFINITE_INTEGRAL",
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS"
    ],
    "conditionKeys": [
      "COND_POSITIVE",
      "COND_FUNCTION_VALUE_CONSTRAINT"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
