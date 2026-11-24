window.examTitle = "미적분II_140_지수함수미분법을이용한미분계수극한값계산_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "지수함수와 로그함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-03",
    "standardUnit": "지수함수와 로그함수의 미분",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "지수함수와 로그함수의 미분"
    ],
    "wide": false,
    "content": "$\\lim_{x\\to0}\\frac1x\\ln\\frac{e^{2x}+e^{4x}+\\cdots+e^{12x}}6$의 값은?",
    "choices": [
      "$5$",
      "$6$",
      "$7$",
      "$8$",
      "$9$"
    ],
    "answer": "③",
    "solution": "$A(x)=\\frac{e^{2x}+e^{4x}+\\cdots+e^{12x}}6$라 하면 $A(0)=\\frac{1+1+\\cdots+1}6=1$이다.\n$A'(x)=\\frac{2e^{2x}+4e^{4x}+\\cdots+12e^{12x}}6$이므로 $A'(0)=\\frac{2+4+\\cdots+12}6=\\frac{42}6=7$이다.\n$\\lim_{x\\to0}\\frac{\\ln A(x)}x$는 $x=0$에서 $\\ln A(x)$의 미분계수이므로 $\\lim_{x\\to0}\\frac{\\ln A(x)}x=(\\ln A)'(0)$이다.\n$\\ln A(x)$를 합성함수의 미분법으로 미분하면 $(\\ln A)'(x)=\\frac{A'(x)}{A(x)}$이다.\n따라서 $(\\ln A)'(0)=\\frac{A'(0)}{A(0)}=\\frac71=7$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-069",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT"
    ],
    "conditionKeys": [],
    "integrationPattern": "REINTERPRETATION"
  },
  {
    "id": 2,
    "category": "지수함수와 로그함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-03",
    "standardUnit": "지수함수와 로그함수의 미분",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "지수함수와 로그함수의 미분"
    ],
    "wide": false,
    "content": "자연수 $n$이 $\\lim_{x\\to0}\\frac1x\\ln\\frac{e^{3x}+e^{6x}+\\cdots+e^{3nx}}n=27$을 만족할 때 $n$은?",
    "choices": [
      "$13$",
      "$15$",
      "$17$",
      "$19$",
      "$21$"
    ],
    "answer": "③",
    "solution": "$B(x)=\\frac{e^{3x}+e^{6x}+\\cdots+e^{3nx}}n$이라 하면 $B(0)=\\frac{1+1+\\cdots+1}n=1$이다.\n$B'(x)=\\frac{3e^{3x}+6e^{6x}+\\cdots+3ne^{3nx}}n$이므로 $B'(0)=\\frac{3+6+\\cdots+3n}n$이다.\n$3+6+\\cdots+3n=3\\cdot\\frac{n(n+1)}2$이므로 $B'(0)=\\frac{3n(n+1)}{2n}=\\frac{3(n+1)}2$이다.\n$\\lim_{x\\to0}\\frac{\\ln B(x)}x=(\\ln B)'(0)=\\frac{B'(0)}{B(0)}=\\frac{3(n+1)}2$이다.\n주어진 극한값이 $27$이므로 $\\frac{3(n+1)}2=27$에서 $n+1=18$, 즉 $n=17$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-069",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT",
      "CC_SERIES_SUM"
    ],
    "conditionKeys": [
      "COND_NATURAL_NUMBER"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 3,
    "category": "지수함수와 로그함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-03",
    "standardUnit": "지수함수와 로그함수의 미분",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "지수함수와 로그함수의 미분"
    ],
    "wide": false,
    "content": "$\\lim_{x\\to0}\\frac1x\\ln\\frac{2^x+4^x+7^x}{3}$의 값은?",
    "choices": [
      "$\\frac{\\ln28}3$",
      "$\\frac{\\ln56}3$",
      "$\\frac{\\ln72}3$",
      "$\\frac{\\ln84}3$",
      "$\\frac{\\ln112}3$"
    ],
    "answer": "②",
    "solution": "$C(x)=\\frac{2^x+4^x+7^x}{3}$라 하면 $C(0)=\\frac{1+1+1}3=1$이다.\n$C'(x)=\\frac{(\\ln2)2^x+(\\ln4)4^x+(\\ln7)7^x}{3}$이므로 $C'(0)=\\frac{\\ln2+\\ln4+\\ln7}{3}$이다.\n로그의 성질에 의해 $\\ln2+\\ln4+\\ln7=\\ln(2\\cdot4\\cdot7)=\\ln56$이다.\n$\\lim_{x\\to0}\\frac{\\ln C(x)}x=(\\ln C)'(0)=\\frac{C'(0)}{C(0)}=\\frac{\\ln56}{3}$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-069",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT"
    ],
    "conditionKeys": [],
    "integrationPattern": "REINTERPRETATION"
  }
];
