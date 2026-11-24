window.examTitle = "미적분II_225_무리함수의치환적분법_고2_유형은행1";

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
    "content": "$f(x)=\\int(x+1)\\sqrt{x^2+2x+2}\\,dx$이고 $f(-1)=0$일 때, $f(0)$의 값은?",
    "choices": [
      "$\\frac{\\sqrt2-1}{3}$",
      "$\\frac{2\\sqrt2-2}{3}$",
      "$\\frac13$",
      "$\\frac{2\\sqrt2-1}{3}$",
      "$\\frac{2\\sqrt2}{3}$"
    ],
    "answer": "④",
    "solution": "피적분함수에서 $x+1$이 $x^2+2x+2$의 도함수 $2x+2$의 절반임을 확인한다.\n$t=x^2+2x+2$로 놓으면 $dt=2(x+1)\\,dx$이므로 $(x+1)\\,dx=\\frac12\\,dt$이다.\n치환적분법과 거듭제곱 적분법으로 $f(x)=\\frac12\\int t^{1/2}\\,dt=\\frac12\\cdot\\frac23t^{3/2}+C=\\frac13t^{3/2}+C$이다.\n$x=-1$에서 $t=1-2+2=1$이므로 $f(-1)=\\frac13\\cdot1^{3/2}+C=\\frac13+C=0$에서 $C=-\\frac13$이다.\n$x=0$에서 $t=0+0+2=2$이므로 $f(0)=\\frac13\\cdot2^{3/2}-\\frac13=\\frac{2\\sqrt2}{3}-\\frac13=\\frac{2\\sqrt2-1}{3}$이다.\n주의: 적분상수는 $f(-1)=0$ 조건으로 먼저 정해야 한다.\n따라서 정답은 ④이다.",
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
    "content": "함수 $f$가 $\\lim_{h\\to0}\\frac{f(x+h)-f(x)}{h}=3x\\sqrt{x^2+4}$, $f(0)=8$을 만족할 때, $f(\\sqrt5)$의 값은?",
    "choices": [
      "$12$",
      "$16$",
      "$18$",
      "$24$",
      "$27$"
    ],
    "answer": "⑤",
    "solution": "주어진 극한은 미분계수의 정의이므로 $f'(x)=3x\\sqrt{x^2+4}$이다.\n$t=x^2+4$로 놓으면 $dt=2x\\,dx$이므로 $3x\\,dx=\\frac32\\,dt$이다.\n치환적분법과 거듭제곱 적분법으로 $f(x)=\\frac32\\int t^{1/2}\\,dt=\\frac32\\cdot\\frac23t^{3/2}+C=t^{3/2}+C$이다.\n$f(0)=8$에서 $t=4$이므로 $4^{3/2}+C=8+C=8$, 즉 $C=0$이다.\n$x=\\sqrt5$에서 $t=5+4=9$이므로 $f(\\sqrt5)=9^{3/2}=(3^2)^{3/2}=3^3=27$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-097",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_INDEFINITE",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT"
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
    "content": "$x>-2$에서 미분가능한 함수 $f$의 도함수는 $f'(x)=\\frac{x-2}{\\sqrt{x+2}}$이다. $f$의 극솟값이 $-\\frac{29}{3}$일 때, $f(7)$의 값은?",
    "choices": [
      "$-11$",
      "$-9$",
      "$-7$",
      "$-5$",
      "$-3$"
    ],
    "answer": "④",
    "solution": "$x>-2$에서 분모 $\\sqrt{x+2}>0$이므로 $f'(x)$의 부호는 분자 $x-2$의 부호와 같다.\n(i) $-2<x<2$에서 $x-2<0$이므로 $f'(x)<0$이고, (ii) $x>2$에서 $x-2>0$이므로 $f'(x)>0$이다.\n따라서 $x=2$에서 도함수의 부호가 음에서 양으로 바뀌므로 극솟값은 $f(2)=-\\frac{29}{3}$이다.\n$t=x+2$로 놓으면 $dx=dt$이고 $x-2=(t-2)-2=t-4$이다.\n피적분함수는 $\\frac{t-4}{\\sqrt t}=\\frac{t}{t^{1/2}}-\\frac{4}{t^{1/2}}=t^{1/2}-4t^{-1/2}$로 정리된다.\n치환적분법과 거듭제곱 적분법으로 $f(x)=\\int\\left(t^{1/2}-4t^{-1/2}\\right)dt=\\frac23t^{3/2}-4\\cdot2t^{1/2}+C=\\frac23t^{3/2}-8t^{1/2}+C$이다.\n$x=2$에서 $t=4$이므로 $f(2)=\\frac23\\cdot4^{3/2}-8\\cdot4^{1/2}+C=\\frac23\\cdot8-8\\cdot2+C=\\frac{16}{3}-16+C=-\\frac{32}{3}+C$이다.\n$-\\frac{29}{3}=-\\frac{32}{3}+C$에서 $C=\\frac{32}{3}-\\frac{29}{3}=1$이다.\n$x=7$에서 $t=9$이므로 $f(7)=\\frac23\\cdot9^{3/2}-8\\cdot9^{1/2}+1=\\frac23\\cdot27-8\\cdot3+1=18-24+1=-5$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-097",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_INDEFINITE",
    "crossConceptKeys": [
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
