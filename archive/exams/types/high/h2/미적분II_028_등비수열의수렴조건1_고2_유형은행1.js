window.examTitle = "미적분II_028_등비수열의수렴조건1_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "수열의 극한",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-01",
    "standardUnit": "수열의 극한",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "수열의 극한"
    ],
    "wide": false,
    "content": "등비수열 $\\{(\\log_2 x-2)^n\\}$이 수렴하도록 하는 정수 $x$는 몇 개인가?",
    "choices": [
      "$4$",
      "$5$",
      "$6$",
      "$7$",
      "$8$"
    ],
    "answer": "③",
    "solution": "수열 $\\{t^n\\}$이 수렴하려면 $-1<t\\le1$이어야 한다. (등비수열의 극한)\n$t=\\log_2 x-2$로 놓으면 $x>0$이고, $-1<\\log_2 x-2\\le1$이다.\n각 변에 $2$를 더하면 $1<\\log_2 x\\le3$이다.\n밑이 $2>1$이므로 로그의 대소 관계가 그대로 유지되어 $2^1<x\\le2^3$, 즉 $2<x\\le8$이다.\n이 범위의 정수 $x$는 $3,4,5,6,7,8$의 $6$개이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-060",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_GEOMETRIC_RATIO",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_INTEGER"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 2,
    "category": "수열의 극한",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-01",
    "standardUnit": "수열의 극한",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "수열의 극한"
    ],
    "wide": false,
    "content": "두 수열 $\\{(\\log_4 x)^n\\}$과 $\\{(x/3)^n\\}$이 모두 수렴할 때 $x$의 범위를 $\\alpha<x\\le\\beta$라 하자. $\\alpha+\\beta$는?",
    "choices": [
      "$\\frac94$",
      "$\\frac52$",
      "$\\frac{11}4$",
      "$3$",
      "$\\frac{13}4$"
    ],
    "answer": "⑤",
    "solution": "첫째 수열 $\\{(\\log_4 x)^n\\}$이 수렴하려면 $-1<\\log_4 x\\le1$이다.\n$\\log_4 x$의 정의역은 $x>0$이고, 이를 풀면 $\\frac14<x\\le4$이다.\n둘째 수열 $\\{(x/3)^n\\}$이 수렴하려면 $-1<\\frac x3\\le1$이므로 $-3<x\\le3$이다.\n두 범위의 교집합을 구하면 $\\frac14<x\\le3$이다.\n따라서 $\\alpha=\\frac14$, $\\beta=3$이고 $\\alpha+\\beta=\\frac14+3=\\frac{13}4$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-060",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_GEOMETRIC_RATIO",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 3,
    "category": "수열의 극한",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-01",
    "standardUnit": "수열의 극한",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "수열의 극한"
    ],
    "wide": false,
    "content": "수열 $\\{((x^2-3x)/10)^n\\}$이 수렴하도록 하는 모든 정수 $x$의 합은?",
    "choices": [
      "$12$",
      "$13$",
      "$14$",
      "$15$",
      "$16$"
    ],
    "answer": "①",
    "solution": "수열 $\\{a^n\\}$이 수렴하려면 $-1<a\\le1$이다. 여기서 $a=\\frac{x^2-3x}{10}$이다.\n먼저 $a>-1$은 $\\frac{x^2-3x}{10}>-1$에서 $x^2-3x+10>0$이다.\n판별식 $D=(-3)^2-4\\cdot1\\cdot10=9-40=-31<0$이고 $x^2$의 계수가 양수이므로 이 부등식은 모든 실수 $x$에서 성립한다.\n다음 $a\\le1$은 $\\frac{x^2-3x}{10}\\le1$에서 $x^2-3x-10\\le0$이다.\n인수분해하면 $(x-5)(x+2)\\le0$이므로 $-2\\le x\\le5$이다.\n이 범위의 정수는 $-2,-1,0,1,2,3,4,5$의 $8$개이고, 그 합은 $(-2-1+0+1+2+3+4+5)=12$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-060",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_GEOMETRIC_RATIO",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_INTEGER"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 4,
    "category": "수열의 극한",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-01",
    "standardUnit": "수열의 극한",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "수열의 극한"
    ],
    "wide": false,
    "content": "$1\\le x<12$인 자연수 중 수열 $\\{(\\sqrt2\\cos(\\pi x/6))^n\\}$이 수렴하도록 하는 $x$는 몇 개인가?",
    "choices": [
      "$4$",
      "$5$",
      "$6$",
      "$7$",
      "$8$"
    ],
    "answer": "③",
    "solution": "$a=\\sqrt2\\cos\\frac{\\pi x}{6}$로 놓으면 수열 $\\{a^n\\}$이 수렴하려면 $-1<a\\le1$이다.\n$\\sqrt2>0$이므로 $-\\frac1{\\sqrt2}<\\cos\\frac{\\pi x}{6}\\le\\frac1{\\sqrt2}$이다.\n$1\\le x<12$인 자연수 $x$에 대해 각 $\\frac{\\pi x}{6}=30^\\circ x$의 코사인 값을 조사한다.\n$\\cos30^\\circ=\\frac{\\sqrt3}2$, $\\cos60^\\circ=\\frac12$, $\\cos90^\\circ=0$, $\\cos120^\\circ=-\\frac12$, $\\cos150^\\circ=-\\frac{\\sqrt3}2$, $\\cos180^\\circ=-1$이고 이후는 대칭이다.\n$-\\frac1{\\sqrt2}\\approx-0.707$, $\\frac1{\\sqrt2}\\approx0.707$이므로 조건을 만족하는 것은 $\\cos\\frac{\\pi x}{6}=\\frac12,0,-\\frac12$인 경우이다.\n즉 $x=2,3,4,8,9,10$이다.\n주의: $x=1,11$은 $\\cos\\frac{\\pi x}{6}=\\frac{\\sqrt3}2>\\frac1{\\sqrt2}$라 제외되고, $x=5,6,7$은 코사인 값이 $-\\frac1{\\sqrt2}$보다 작아 제외된다.\n따라서 조건을 만족하는 자연수 $x$는 $6$개이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-060",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_GEOMETRIC_RATIO",
    "crossConceptKeys": [
      "CC_COSINE_FUNCTION_RANGE",
      "CC_SPECIAL_ANGLES"
    ],
    "conditionKeys": [
      "COND_NATURAL_NUMBER",
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
