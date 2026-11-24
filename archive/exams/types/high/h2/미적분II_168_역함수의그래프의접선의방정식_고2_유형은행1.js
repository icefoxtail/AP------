window.examTitle = "미적분II_168_역함수의그래프의접선의방정식_고2_유형은행1";

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
    "content": "$f(x)=x^3+2x+2$의 역함수 $g$의 그래프에서 점 $(5,1)$에서의 접선의 $y$절편은?",
    "choices": [
      "$-\\frac25$",
      "$-\\frac15$",
      "$0$",
      "$\\frac15$",
      "$\\frac25$"
    ],
    "answer": "③",
    "solution": "역함수의 정의에 따라 $f(1)$을 계산하면 $f(1)=1^3+2\\cdot1+2=5$이므로 $g(5)=1$이다.\n다항함수의 미분법으로 $f'(x)=3x^2+2$이다.\n$f'(1)=3\\cdot1^2+2=5$이다.\n역함수의 미분법으로 $g'(5)=\\frac1{f'(1)}=\\frac15$이다.\n점 $(5,1)$에서의 접선은 $y-1=\\frac15(x-5)$이다.\n$x=0$을 대입하면 $y=1-\\frac15\\cdot5=1-1=0$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B12",
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
    "content": "$f(x)=\\ln(2x+1)$의 역함수 $g$의 그래프 위의 점 $(0,0)$에서 그은 접선이 점 $(6,a)$를 지날 때, $a$는?",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "③",
    "solution": "역함수의 정의에 따라 $f(0)=\\ln(2\\cdot0+1)=\\ln1=0$이므로 $g(0)=0$이다.\n합성함수의 미분법으로 $f'(x)=\\frac1{2x+1}\\cdot2=\\frac2{2x+1}$이다.\n$f'(0)=\\frac2{2\\cdot0+1}=2$이다.\n역함수의 미분법으로 $g'(0)=\\frac1{f'(0)}=\\frac12$이다.\n점 $(0,0)$에서의 접선은 $y-0=\\frac12(x-0)$, 즉 $y=\\frac x2$이다.\n점 $(6,a)$를 접선에 대입하면 $a=\\frac62=3$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-082",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_LOGARITHMIC_FUNCTION_GRAPH",
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [],
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
    "content": "$f(x)=(x-2)e^x$ $(x>1)$의 역함수 $g$에 대하여 $y=g(x)$ 위의 점 $(e^3,3)$에서의 접선이 $y=ax+b$일 때, $b/a$의 값은?",
    "choices": [
      "$2e^3$",
      "$3e^3$",
      "$4e^3$",
      "$5e^3$",
      "$6e^3$"
    ],
    "answer": "④",
    "solution": "$f(3)=(3-2)e^3=e^3$이므로 역함수의 정의에 의해 $g(e^3)=3$이다.\n곱의 미분법으로 $f'(x)=1\\cdot e^x+(x-2)e^x=(x-1)e^x$이다.\n$f'(3)=(3-1)e^3=2e^3$이다.\n역함수의 미분법으로 접선의 기울기는 $a=g'(e^3)=\\frac1{f'(3)}=\\frac1{2e^3}$이다.\n접점 $(e^3,3)$에서의 접선은 $y-3=\\frac1{2e^3}(x-e^3)$이다.\n이를 정리하면 $y=\\frac1{2e^3}x+3-\\frac{e^3}{2e^3}$이다.\n따라서 $b=3-\\frac12=\\frac52$이다.\n$\\frac ba=\\frac52\\div\\frac1{2e^3}=\\frac52\\cdot2e^3=5e^3$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-082",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
