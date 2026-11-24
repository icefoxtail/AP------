window.examTitle = "미적분II_158_지수함수의역함수와미분계수_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "여러 가지 미분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-05",
    "standardUnit": "여러 가지 미분법",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 미분법"
    ],
    "wide": false,
    "content": "$f(x)=2x+3e^x$의 역함수를 $g$라 하자. $g'(3)$의 값은?",
    "choices": [
      "$\\frac{1}{10}$",
      "$\\frac{1}{5}$",
      "$\\frac{3}{10}$",
      "$\\frac{2}{5}$",
      "$\\frac{1}{2}$"
    ],
    "answer": "②",
    "solution": "$f(0)=2\\cdot0+3e^0=0+3\\cdot1=3$이므로 역함수의 정의에서 $g(3)=0$이다.\n지수함수의 미분법으로 $f'(x)=2+3e^x$이다.\n$x=0$을 대입하면 $f'(0)=2+3e^0=2+3=5$이다.\n역함수의 미분법 $g'(b)=\\frac1{f'(a)}$ ($b=f(a)$)로 $g'(3)=\\frac1{f'(0)}=\\frac15$이다.\n주의: $g'(3)$은 $f'(3)$의 역수가 아니라 $f'(0)$의 역수이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-082",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_POLYNOMIAL_DERIVATIVE_RULE",
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 2,
    "category": "여러 가지 미분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-05",
    "standardUnit": "여러 가지 미분법",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 미분법"
    ],
    "wide": false,
    "content": "$f(x)=(x-2)e^x$ ($x>1$)의 역함수를 $g$라 하자. 곡선 $y=g(x)$ 위의 점 $(e^3,3)$에서 접선의 기울기는?",
    "choices": [
      "$\\frac{1}{6e^{3}}$",
      "$\\frac{1}{5e^{3}}$",
      "$\\frac{1}{4e^{3}}$",
      "$\\frac{1}{3e^{3}}$",
      "$\\frac{1}{2e^{3}}$"
    ],
    "answer": "⑤",
    "solution": "$f(3)=(3-2)e^3=1\\cdot e^3=e^3$이므로 역함수의 정의에서 $g(e^3)=3$이다.\n곱의 미분법으로 $f'(x)=(x-2)'e^x+(x-2)(e^x)'=e^x+(x-2)e^x=(x-1)e^x$이다.\n$x=3$을 대입하면 $f'(3)=(3-1)e^3=2e^3$이다.\n역함수의 미분법으로 $g'(e^3)=\\frac1{f'(3)}=\\frac1{2e^3}$이다.\n점 $(e^3,3)$에서 접선의 기울기는 $g'(e^3)$와 같다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-082",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_TANGENT_LINE_SLOPE_AT_POINT",
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 3,
    "category": "여러 가지 미분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-05",
    "standardUnit": "여러 가지 미분법",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 미분법"
    ],
    "wide": false,
    "content": "$f(x)=xe^{2x}$ ($x>0$)의 역함수를 $g$라 하자. $\\lim_{h\\to0}\\frac{g(e^2+h)-g(e^2)}h$의 값은?",
    "choices": [
      "$\\frac{1}{6e^{2}}$",
      "$\\frac{1}{5e^{2}}$",
      "$\\frac{1}{4e^{2}}$",
      "$\\frac{1}{3e^{2}}$",
      "$\\frac{1}{2e^{2}}$"
    ],
    "answer": "④",
    "solution": "미분계수의 정의에 의해 $\\lim_{h\\to0}\\frac{g(e^2+h)-g(e^2)}h=g'(e^2)$이다.\n$f(1)=1\\cdot e^{2\\cdot1}=e^2$이므로 역함수의 정의에서 $g(e^2)=1$이다.\n곱의 미분법과 합성함수의 미분법으로 $f'(x)=1\\cdot e^{2x}+x\\cdot e^{2x}\\cdot2=(1+2x)e^{2x}$이다.\n$x=1$을 대입하면 $f'(1)=(1+2)e^2=3e^2$이다.\n역함수의 미분법으로 $g'(e^2)=\\frac1{f'(1)}=\\frac1{3e^2}$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-082",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT",
      "CC_DIFFERENCE_QUOTIENT_SCALING"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 4,
    "category": "여러 가지 미분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-05",
    "standardUnit": "여러 가지 미분법",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 미분법"
    ],
    "wide": false,
    "content": "$f(x)=4e^{3x}+2x+\\sin x$의 역함수를 $g$라 하자. $\\lim_{x\\to4}\\frac{x-4}{g(x)-g(4)}$의 값은?",
    "choices": [
      "$13$",
      "$14$",
      "$15$",
      "$16$",
      "$17$"
    ],
    "answer": "③",
    "solution": "$f(0)=4e^0+2\\cdot0+\\sin0=4+0+0=4$이므로 역함수의 정의에서 $g(4)=0$이다.\n지수함수와 삼각함수의 미분법으로 $f'(x)=12e^{3x}+2+\\cos x$이다.\n$x=0$을 대입하면 $f'(0)=12e^0+2+\\cos0=12+2+1=15$이다.\n역함수의 미분법으로 $g'(4)=\\frac1{f'(0)}=\\frac1{15}$이다.\n미분계수의 정의에 의해 $\\lim_{x\\to4}\\frac{g(x)-g(4)}{x-4}=g'(4)=\\frac1{15}$이다.\n주어진 식은 이 값의 역수이므로 $\\lim_{x\\to4}\\frac{x-4}{g(x)-g(4)}=\\frac1{g'(4)}=15$이다.\n주의: $g'(4)$를 그대로 답으로 고르면 안 되고 그 역수를 구해야 한다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-082",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT",
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 5,
    "category": "여러 가지 미분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-05",
    "standardUnit": "여러 가지 미분법",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 미분법"
    ],
    "wide": false,
    "content": "$f(x)=(x^2+3)e^{-x}$에 대하여 미분가능한 함수 $g$가 $g(\\frac{x+9}{12})=f^{-1}(x)$를 만족한다. $g'(1)$의 값은?",
    "choices": [
      "$-7$",
      "$-6$",
      "$-5$",
      "$-4$",
      "$-3$"
    ],
    "answer": "④",
    "solution": "$f(0)=(0^2+3)e^{-0}=3\\cdot1=3$이므로 역함수의 정의에서 $f^{-1}(3)=0$이다.\n$g\\left(\\frac{x+9}{12}\\right)=f^{-1}(x)$에서 $\\frac{x+9}{12}=1$이면 $x=3$이므로 $g(1)=f^{-1}(3)=0$이다.\n곱의 미분법과 합성함수의 미분법으로 $f'(x)=2xe^{-x}+(x^2+3)(-e^{-x})=(-x^2+2x-3)e^{-x}$이다.\n$x=0$을 대입하면 $f'(0)=(-0+0-3)e^0=-3$이다.\n역함수의 미분법으로 $(f^{-1})'(3)=\\frac1{f'(0)}=-\\frac13$이다.\n주어진 등식의 양변을 $x$로 미분하면 $\\frac1{12}g'\\left(\\frac{x+9}{12}\\right)=(f^{-1})'(x)$이다.\n$x=3$을 대입하면 $\\frac1{12}g'(1)=-\\frac13$이다.\n양변에 $12$를 곱하면 $g'(1)=12\\left(-\\frac13\\right)=-4$이다.\n주의: $g'(1)$을 구할 때 $x=1$이 아니라 $x=3$을 대입한다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-082",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_FUNCTION_COMPOSITION",
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 6,
    "category": "여러 가지 미분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-05",
    "standardUnit": "여러 가지 미분법",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 미분법"
    ],
    "wide": false,
    "content": "$x>1$에서 $f(x)=x^{2\\ln x}$라 하자. $F(x)=f(3x)$ ($x>\\frac13$)의 역함수 $g$의 그래프 위 $(e^2,\\frac e3)$에서의 접선 기울기는?",
    "choices": [
      "$\\frac{1}{13e}$",
      "$\\frac{1}{12e}$",
      "$\\frac{1}{11e}$",
      "$\\frac{1}{10e}$",
      "$\\frac{1}{9e}$"
    ],
    "answer": "②",
    "solution": "$x^{2\\ln x}=e^{\\ln(x^{2\\ln x})}=e^{2(\\ln x)^2}$이므로 $f(x)=e^{2(\\ln x)^2}$이다.\n$F\\left(\\frac e3\\right)=f\\left(3\\cdot\\frac e3\\right)=f(e)$이다.\n$f(e)=e^{2(\\ln e)^2}=e^{2\\cdot1^2}=e^2$이므로 역함수의 정의에서 $g(e^2)=\\frac e3$이다.\n합성함수의 미분법으로 $f'(x)=e^{2(\\ln x)^2}\\cdot2\\cdot2\\ln x\\cdot\\frac1x=\\frac{4\\ln x}{x}e^{2(\\ln x)^2}$이다.\n$x=e$를 대입하면 $f'(e)=\\frac{4\\ln e}{e}e^{2(\\ln e)^2}=\\frac4e\\cdot e^2=4e$이다.\n$F(x)=f(3x)$이므로 합성함수의 미분법으로 $F'(x)=3f'(3x)$이다.\n$x=\\frac e3$을 대입하면 $F'\\left(\\frac e3\\right)=3f'(e)=3\\cdot4e=12e$이다.\n역함수의 미분법으로 $g'(e^2)=\\frac1{F'\\left(\\frac e3\\right)}=\\frac1{12e}$이다.\n점 $(e^2,\\frac e3)$에서 접선의 기울기는 $g'(e^2)$이므로 $\\frac1{12e}$이다.\n주의: $F(e/3)=e^2$의 역수를 취하는 것이 아니라 $F'(e/3)$의 역수를 취해야 한다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-082",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_FUNCTION_COMPOSITION",
      "CC_TANGENT_LINE_SLOPE_AT_POINT"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
