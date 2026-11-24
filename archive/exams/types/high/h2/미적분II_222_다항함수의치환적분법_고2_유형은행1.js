window.examTitle = "미적분II_222_다항함수의치환적분법_고2_유형은행1";

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
    "content": "$f(x)=\\int (2x+2)(x^2+2x-2)^3\\,dx$이고 $f(-1)=5$일 때, $f(1)$의 값은?",
    "choices": [
      "$-25$",
      "$-22$",
      "$-18$",
      "$-15$",
      "$-10$"
    ],
    "answer": "④",
    "solution": "치환할 부분을 정한다: $t=x^2+2x-2$로 놓으면 $dt=(2x+2)\\,dx$이다.\n주어진 피적분함수를 치환적분법으로 바꾸면 $f(x)=\\int t^3\\,dt$이다.\n거듭제곱 적분법으로 적분하면 $f(x)=\\frac{t^4}{4}+C=\\frac{(x^2+2x-2)^4}{4}+C$이다.\n조건 $f(-1)=5$에서 $x=-1$일 때 $t=(-1)^2+2(-1)-2=-3$이므로 $5=\\frac{(-3)^4}{4}+C=\\frac{81}{4}+C$이다.\n이를 풀면 $C=5-\\frac{81}{4}=\\frac{20-81}{4}=-\\frac{61}{4}$이다.\n구한 $f(x)$에 $x=1$을 대입하면 $t=1^2+2\\cdot1-2=1$이므로 $f(1)=\\frac{1^4}{4}-\\frac{61}{4}=\\frac{1-61}{4}=-15$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-097",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_INDEFINITE",
    "crossConceptKeys": [
      "CC_POLYNOMIAL_DERIVATIVE_RULE"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "곡선 $y=f(x)$가 점 $(1,3)$을 지나고, 점 $(x,f(x))$에서 접선의 기울기가 $(8x-8)(x^2-2x+2)^3$이다. $f(2)$의 값은?",
    "choices": [
      "$10$",
      "$15$",
      "$18$",
      "$20$",
      "$23$"
    ],
    "answer": "③",
    "solution": "접선의 기울기가 도함수의 값이므로 $f'(x)=(8x-8)(x^2-2x+2)^3$이다.\n$t=x^2-2x+2$로 놓으면 $dt=(2x-2)\\,dx$이고 $8x-8=4(2x-2)$이므로 $(8x-8)\\,dx=4\\,dt$이다.\n치환적분법으로 식을 바꾸면 $f(x)=4\\int t^3\\,dt$이다.\n거듭제곱 적분법으로 적분하면 $f(x)=4\\cdot\\frac{t^4}{4}+C=t^4+C=(x^2-2x+2)^4+C$이다.\n점 $(1,3)$을 지나므로 $x=1$일 때 $t=1-2+2=1$이고 $3=1^4+C$에서 $C=2$이다.\n$x=2$일 때 $t=4-4+2=2$이므로 $f(2)=2^4+2=16+2=18$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-097",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_INDEFINITE",
    "crossConceptKeys": [
      "CC_TANGENT_LINE_SLOPE_AT_POINT",
      "CC_POINT_ON_CURVE_SUBSTITUTION"
    ],
    "conditionKeys": [],
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
    "content": "다항함수 $f(x)$가 $\\lim_{x\\to\\infty}\\frac{f(x)}{x^2+x+1}=1$, $\\lim_{x\\to2}\\frac{f(x)}{x-2}=2$를 만족한다. $F'(x)=(x-1)\\{f(x)\\}^2$일 때, $F(0)-F(1)$의 값은?",
    "choices": [
      "$-\\frac{1}{3}$",
      "$-\\frac{1}{6}$",
      "$\\frac{1}{6}$",
      "$\\frac{1}{3}$",
      "$\\frac{1}{2}$"
    ],
    "answer": "③",
    "solution": "$\\lim_{x\\to\\infty}\\frac{f(x)}{x^2+x+1}=1$이므로 다항함수 $f(x)$의 차수는 2이고 최고차항의 계수는 1이다. 즉 $f(x)=x^2+bx+c$이다.\n$\\lim_{x\\to2}\\frac{f(x)}{x-2}=2$가 유한한 값이므로 분모가 0으로 갈 때 분자도 0으로 가야 한다. 즉 $f(2)=0$이다.\n$f(x)$를 $(x-2)$로 인수분해하면 $f(x)=(x-2)(x+a)$이다.\n$x\\ne2$일 때 $\\frac{f(x)}{x-2}=x+a$이므로 극한값은 $2+a$이다.\n조건에서 $2+a=2$이므로 $a=0$이고, 따라서 $f(x)=(x-2)x=x^2-2x$이다.\n$F'(x)=(x-1)(x^2-2x)^2$이고, $t=x^2-2x$로 놓으면 $dt=(2x-2)\\,dx=2(x-1)\\,dx$이다.\n치환적분법으로 $F(x)=\\frac12\\int t^2\\,dt=\\frac{t^3}{6}+C=\\frac{(x^2-2x)^3}{6}+C$이다.\n$F(0)=\\frac{0^3}{6}+C=C$이고 $F(1)=\\frac{(1-2)^3}{6}+C=-\\frac16+C$이다.\n따라서 $F(0)-F(1)=C-\\left(-\\frac16+C\\right)=\\frac16$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-097",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_INDEFINITE",
    "crossConceptKeys": [
      "CC_FUNCTION_LIMIT",
      "CC_DERIVATIVE_DEFINITION_LIMIT"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
