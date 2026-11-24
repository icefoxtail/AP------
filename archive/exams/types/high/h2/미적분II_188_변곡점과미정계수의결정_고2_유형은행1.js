window.examTitle = "미적분II_188_변곡점과미정계수의결정_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "도함수의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도함수의 활용"
    ],
    "wide": false,
    "content": "$b>0$이고 $(3,a)$가 곡선 $y=3/(x^2+b)$의 변곡점일 때, $b/a$는?",
    "choices": [
      "108",
      "216",
      "270",
      "324",
      "432"
    ],
    "answer": "④",
    "solution": "거듭제곱꼴로 보고 합성함수의 미분법을 적용하면 $y=3(x^2+b)^{-1}$에서 $y'=-6x(x^2+b)^{-2}$이다.\n곱의 미분법으로 한 번 더 미분하면 $y''=-6(x^2+b)^{-2}+24x^2(x^2+b)^{-3}$이다.\n이를 통분하면 $y''=\\frac{6(3x^2-b)}{(x^2+b)^3}$이다.\n변곡점에서는 $y''=0$이어야 하므로 $x=3$을 대입해 $3\\cdot9-b=0$, 즉 $b=27$이다.\n원래 곡선에 $x=3$을 대입하면 $a=\\frac{3}{3^2+27}=\\frac{3}{36}=\\frac1{12}$이다.\n분모가 항상 양수이고 $3x^2-b$가 $x=3$에서 부호를 바꾸므로 실제 변곡점이다.\n따라서 $\\frac ba=27\\div\\frac1{12}=324$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-179",
    "problemTypeKey": "PT_CALCULUS_CONCAVITY_INFLECTION",
    "templateKey": "TPL_CALCULUS_INFLECTION_CONDITION",
    "crossConceptKeys": [
      "CC_RATIONAL_FUNCTION",
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 2,
    "category": "도함수의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도함수의 활용"
    ],
    "wide": false,
    "content": "$f(x)=xe^{2x}+ax^2+bx$가 $x=0$에서 극소이고 변곡점의 $x$좌표 중 하나가 $-1$일 때, $a+b$는?",
    "choices": [
      "$-3$",
      "$-2$",
      "$-1$",
      "$0$",
      "$1$"
    ],
    "answer": "③",
    "solution": "곱의 미분법과 합성함수의 미분법으로 $f'(x)=e^{2x}+2xe^{2x}+2ax+b=(1+2x)e^{2x}+2ax+b$이다.\n$x=0$에서 극소이므로 극값의 필요조건 $f'(0)=0$에서 $1+b=0$, 즉 $b=-1$이다.\n$f'(x)$를 다시 미분하면 $f''(x)=2e^{2x}+2(1+2x)e^{2x}+2a=4(1+x)e^{2x}+2a$이다.\n변곡점의 $x$좌표가 $-1$이므로 $f''(-1)=4(0)e^{-2}+2a=0$에서 $a=0$이다.\n$f''(x)=4(1+x)e^{2x}$는 $x=-1$의 좌우에서 부호가 바뀌므로 실제 변곡점이다.\n$a=0,\\ b=-1$일 때 $f''(0)=4>0$이므로 $x=0$은 실제 극소이다.\n따라서 $a+b=0+(-1)=-1$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-179",
    "problemTypeKey": "PT_CALCULUS_CONCAVITY_INFLECTION",
    "templateKey": "TPL_CALCULUS_INFLECTION_CONDITION",
    "crossConceptKeys": [
      "CC_POLYNOMIAL_DERIVATIVE_RULE",
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS"
    ],
    "conditionKeys": [
      "COND_FUNCTION_VALUE_CONSTRAINT"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 3,
    "category": "도함수의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도함수의 활용"
    ],
    "wide": false,
    "content": "$(e,3e^2)$가 곡선 $y=ax^2+bx^2\\ln x$의 변곡점일 때, $a-b$는?",
    "choices": [
      "6",
      "7",
      "8",
      "9",
      "10"
    ],
    "answer": "②",
    "solution": "$(e,3e^2)$를 대입하고 $\\ln e=1$을 이용하면 $ae^2+be^2=3e^2$이므로 $a+b=3$이다.\n$y=ax^2+bx^2\\ln x$를 곱의 미분법으로 미분하면 $y'=2ax+b(2x\\ln x+x)$이다.\n다시 곱의 미분법으로 미분하면 $y''=2a+b(2\\ln x+3)$이다.\n$x=e$가 변곡점의 $x$좌표이므로 $y''(e)=2a+b(2\\cdot1+3)=2a+5b=0$이다.\n$a+b=3$의 양변을 2배 하면 $2a+2b=6$이고, 이를 $2a+5b=0$에서 빼면 $3b=-6$이다.\n따라서 $b=-2$이고 $a=3-b=5$이다.\n$y''=4(1-\\ln x)$는 $x=e$의 좌우에서 부호가 바뀌므로 실제 변곡점이다.\n그러므로 $a-b=5-(-2)=7$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-179",
    "problemTypeKey": "PT_CALCULUS_CONCAVITY_INFLECTION",
    "templateKey": "TPL_CALCULUS_INFLECTION_CONDITION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
      "COND_NONZERO"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 4,
    "category": "도함수의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도함수의 활용"
    ],
    "wide": false,
    "content": "$f(x)=ax^2+bx-2\\ln x$가 $x=1$에서 극대이고 변곡점의 $x$좌표가 $1/2$일 때, 극솟값은?",
    "choices": [
      "$0+4\\ln2$",
      "$1+4\\ln2$",
      "$2+4\\ln2$",
      "$9/4+4\\ln2$",
      "$3+4\\ln2$"
    ],
    "answer": "④",
    "solution": "$f(x)=ax^2+bx-2\\ln x$의 정의역은 $x>0$이고, 로그함수의 미분법으로 $f'(x)=2ax+b-\\frac2x$이다.\n한 번 더 미분하면 $f''(x)=2a+\\frac{2}{x^2}$이다.\n$x=\\frac12$가 변곡점의 $x$좌표이므로 $f''\\left(\\frac12\\right)=2a+\\frac{2}{1/4}=2a+8=0$에서 $a=-4$이다.\n$x=1$에서 극대이므로 $f'(1)=2a+b-2=0$이고, $a=-4$를 대입하면 $-8+b-2=0$에서 $b=10$이다.\n이때 $f'(x)=-8x+10-\\frac2x=\\frac{-8x^2+10x-2}{x}=-\\frac{2(4x-1)(x-1)}{x}$이다.\n$x>0$에서 $f'$의 부호는 $x=\\frac14$을 지나 $-$에서 $+$로, $x=1$을 지나 $+$에서 $-$로 바뀐다.\n따라서 $x=\\frac14$에서 극소이고 $x=1$에서 극대이다.\n극솟값은 $f\\left(\\frac14\\right)=-4\\cdot\\frac1{16}+10\\cdot\\frac14-2\\ln\\frac14$이다.\n계산하면 $f\\left(\\frac14\\right)=-\\frac14+\\frac52+2\\ln4=\\frac94+4\\ln2$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-179",
    "problemTypeKey": "PT_CALCULUS_CONCAVITY_INFLECTION",
    "templateKey": "TPL_CALCULUS_INFLECTION_CONDITION",
    "crossConceptKeys": [
      "CC_CRITICAL_POINTS_SIGN_CHANGE",
      "CC_FUNCTION_EXTREMA"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 5,
    "category": "도함수의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도함수의 활용"
    ],
    "wide": false,
    "content": "$f(x)=(ax+b)/(x^2+c)$ ($c>0$)가 $x=-3$에서 극솟값 $-2$를 갖고 $x=0$에서 변곡점을 가질 때, 극댓값은?",
    "choices": [
      "$-2$",
      "$-1$",
      "$0$",
      "$1$",
      "$2$"
    ],
    "answer": "⑤",
    "solution": "몫의 미분법으로 $f'(x)=\\frac{a(x^2+c)-(ax+b)(2x)}{(x^2+c)^2}=\\frac{-ax^2-2bx+ac}{(x^2+c)^2}$이다.\n분자를 $N$이라 할 때 $f''(x)=\\frac{N'(x^2+c)-4xN}{(x^2+c)^3}$이고, $x=0$을 대입하면 $f''(0)=\\frac{-2b}{c^2}$이다.\n$x=0$이 변곡점이므로 $f''(0)=0$에서 $b=0$이다($c>0$).\n$b=0$이면 $f(x)=\\frac{ax}{x^2+c}$이고 $f'(-3)=\\frac{a(c-9)}{(9+c)^2}=0$이다.\n$f(-3)=-2$에서 $\\frac{-3a}{9+c}=-2$이므로 $a\\ne0$이고, 따라서 $c=9$이다.\n$c=9$를 대입하면 $a=\\frac{2(9+9)}{3}=12$이다.\n이때 $f'(x)=\\frac{12(9-x^2)}{(x^2+9)^2}$이고, $x=3$을 지나 도함수의 부호가 $+$에서 $-$로 바뀐다.\n따라서 $x=3$에서 극댓값을 가지며 그 값은 $f(3)=\\frac{36}{18}=2$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-179",
    "problemTypeKey": "PT_CALCULUS_CONCAVITY_INFLECTION",
    "templateKey": "TPL_CALCULUS_INFLECTION_CONDITION",
    "crossConceptKeys": [
      "CC_RATIONAL_FUNCTION",
      "CC_FUNCTION_EXTREMA"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 6,
    "category": "도함수의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도함수의 활용"
    ],
    "wide": false,
    "content": "$\\pi<x<2\\pi$에서 $f(x)=a\\sin x+b\\cos x+cx$가 $x=7\\pi/6$에서 극소이고 변곡점이 $(3\\pi/2,-3\\pi)$일 때, $a+b+c$는?",
    "choices": [
      "0",
      "1",
      "2",
      "3",
      "4"
    ],
    "answer": "③",
    "solution": "사인·코사인의 미분법으로 $f'(x)=a\\cos x-b\\sin x+c$이다.\n한 번 더 미분하면 $f''(x)=-a\\sin x-b\\cos x$이다.\n변곡점 $(3\\pi/2,-3\\pi)$에서 $f''(3\\pi/2)=-a\\sin(3\\pi/2)-b\\cos(3\\pi/2)=a=0$이다.\n같은 점의 함숫값 조건에서 $f(3\\pi/2)=b\\cos(3\\pi/2)+c\\cdot3\\pi/2=\\frac{3\\pi}{2}c=-3\\pi$이므로 $c=-2$이다.\n$x=7\\pi/6$에서 극소이므로 $f'(7\\pi/6)=0$이고 $\\sin(7\\pi/6)=-\\frac12$을 대입하면 $\\frac b2-2=0$에서 $b=4$이다.\n이때 $f''(7\\pi/6)=-4\\cos(7\\pi/6)=2\\sqrt3>0$이므로 실제 극소이다.\n또 $f''=-4\\cos x$는 $x=3\\pi/2$의 좌우에서 부호가 바뀌므로 실제 변곡점이다.\n따라서 $a+b+c=0+4-2=2$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-179",
    "problemTypeKey": "PT_CALCULUS_CONCAVITY_INFLECTION",
    "templateKey": "TPL_CALCULUS_INFLECTION_CONDITION",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_EXTREMUM",
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
