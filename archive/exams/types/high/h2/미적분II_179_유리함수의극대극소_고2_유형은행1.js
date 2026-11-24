window.examTitle = "미적분II_179_유리함수의극대극소_고2_유형은행1";

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
    "content": "$f(x)=\\frac{2x}{x^2+9}$의 극댓값을 $M$, 극솟값을 $m$이라 할 때, $Mm$은?",
    "choices": [
      "$-2/9$",
      "$-1/9$",
      "$-1/18$",
      "$1/18$",
      "$1/9$"
    ],
    "answer": "②",
    "solution": "몫의 미분법으로 $f'(x)=\\frac{2(x^2+9)-2x\\cdot 2x}{(x^2+9)^2}=\\frac{18-2x^2}{(x^2+9)^2}=\\frac{2(9-x^2)}{(x^2+9)^2}$이다.\n분자를 인수분해하면 $f'(x)=\\frac{2(3-x)(3+x)}{(x^2+9)^2}$이고, 분모는 항상 양수이다.\n도함수의 부호는 $x<-3$에서 음, $-3<x<3$에서 양, $x>3$에서 음이므로 $x=-3$에서 극소, $x=3$에서 극대이다.\n극댓값은 대입하여 $M=f(3)=\\frac{6}{9+9}=\\frac{6}{18}=\\frac13$이다.\n극솟값은 대입하여 $m=f(-3)=\\frac{-6}{9+9}=-\\frac{6}{18}=-\\frac13$이다.\n두 값을 곱하면 $Mm=\\frac13\\cdot\\left(-\\frac13\\right)=-\\frac19$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-086",
    "problemTypeKey": "PT_DERIVATIVE_EXTREMA",
    "templateKey": "TPL_EXTREMA_VALUE_PARAMETER",
    "crossConceptKeys": [
      "CC_CRITICAL_POINTS_SIGN_CHANGE",
      "CC_RATIONAL_FUNCTION_GRAPH"
    ],
    "conditionKeys": [],
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
    "content": "$f(x)=\\frac{3x-3}{x^2+3}$이 $x=\\alpha$에서 극대, $x=\\beta$에서 극소일 때, $\\alpha^2+\\beta^2$는?",
    "choices": [
      "8",
      "10",
      "12",
      "14",
      "16"
    ],
    "answer": "②",
    "solution": "몫의 미분법으로 $f'(x)=\\frac{3(x^2+3)-(3x-3)\\cdot 2x}{(x^2+3)^2}$이다.\n분자를 전개하면 $3x^2+9-6x^2+6x=-3x^2+6x+9$이다.\n분자를 인수분해하면 $-3(x^2-2x-3)=-3(x-3)(x+1)$이다.\n분모 $(x^2+3)^2$은 항상 양수이므로 도함수의 부호는 $-3(x-3)(x+1)$의 부호와 같다.\n부호를 조사하면 $x<-1$에서 음, $-1<x<3$에서 양, $x>3$에서 음이다.\n따라서 $x=-1$에서 극소, $x=3$에서 극대이므로 $\\alpha=3$, $\\beta=-1$이다.\n두 값을 제곱하여 더하면 $\\alpha^2+\\beta^2=3^2+(-1)^2=9+1=10$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-086",
    "problemTypeKey": "PT_DERIVATIVE_EXTREMA",
    "templateKey": "TPL_EXTREMA_VALUE_PARAMETER",
    "crossConceptKeys": [
      "CC_CRITICAL_POINTS_SIGN_CHANGE",
      "CC_RATIONAL_FUNCTION_GRAPH"
    ],
    "conditionKeys": [],
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
    "content": "$f(x)=\\frac{x-2}{x^2+5}$의 극댓값과 극솟값의 합은?",
    "choices": [
      "$-2/5$",
      "$-1/5$",
      "$0$",
      "$1/5$",
      "$2/5$"
    ],
    "answer": "①",
    "solution": "몫의 미분법으로 $f'(x)=\\frac{(x^2+5)-(x-2)\\cdot 2x}{(x^2+5)^2}$이다.\n분자를 정리하면 $x^2+5-2x^2+4x=-x^2+4x+5$이다.\n분자를 인수분해하면 $-x^2+4x+5=-(x^2-4x-5)=-(x-5)(x+1)$이다.\n분모 $(x^2+5)^2$은 항상 양수이고, 도함수의 부호는 $x<-1$에서 음, $-1<x<5$에서 양, $x>5$에서 음이다.\n따라서 $x=-1$에서 극소, $x=5$에서 극대이다.\n극솟값은 대입하여 $f(-1)=\\frac{-1-2}{1+5}=\\frac{-3}{6}=-\\frac12$이다.\n극댓값은 대입하여 $f(5)=\\frac{5-2}{25+5}=\\frac{3}{30}=\\frac{1}{10}$이다.\n두 값을 더하면 $-\\frac12+\\frac{1}{10}=-\\frac{5}{10}+\\frac{1}{10}=-\\frac{4}{10}=-\\frac25$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-086",
    "problemTypeKey": "PT_DERIVATIVE_EXTREMA",
    "templateKey": "TPL_EXTREMA_VALUE_PARAMETER",
    "crossConceptKeys": [
      "CC_CRITICAL_POINTS_SIGN_CHANGE",
      "CC_RATIONAL_FUNCTION_GRAPH"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
