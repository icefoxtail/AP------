window.examTitle = "미적분II_131_미분법과다항식의나눗셈_고2_유형은행1";

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
    "content": "$P(x)=x^4+ax+b$가 $(x-2)^2$로 나누어떨어질 때 $ab$의 값은?",
    "choices": [
      "$-2304$",
      "$-2048$",
      "$-1792$",
      "$-1536$",
      "$-1280$"
    ],
    "answer": "④",
    "solution": "$(x-2)^2$으로 나누어떨어지므로 중근의 조건에서 $P(2)=0$이고 $P'(2)=0$이다.\n$P(2)=2^4+2a+b=16+2a+b=0$이다.\n$P'(x)=4x^3+a$이므로 $P'(2)=32+a=0$에서 $a=-32$이다.\n$a=-32$를 $16+2a+b=0$에 대입하면 $16-64+b=0$이므로 $b=48$이다.\n따라서 $ab=(-32)\\cdot48=-1536$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-079",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_POLYNOMIAL_DERIVATIVE_RULE"
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
    "content": "$(3x-5)^n$을 $(x-2)^2$로 나눈 나머지가 $18x+k$일 때 자연수 $n$에 대하여 $n+k$는?",
    "choices": [
      "$-30$",
      "$-29$",
      "$-28$",
      "$-27$",
      "$-26$"
    ],
    "answer": "②",
    "solution": "$x-2=t$로 놓으면 $x=t+2$이고 $3x-5=3t+1$이다.\n$(3x-5)^n=(1+3t)^n$을 이항정리로 전개한다.\n$(x-2)^2=t^2$으로 나눈 나머지는 $t$의 1차 이하 항만 남으므로 $1+n(3t)=1+3nt$이다.\n주어진 나머지는 $18x+k=18(t+2)+k=18t+36+k$이다.\n$t$의 계수를 비교하면 $3n=18$에서 $n=6$이다.\n상수항을 비교하면 $1=36+k$에서 $k=-35$이다.\n따라서 $n+k=6-35=-29$이다.\n주의: 나머지를 $x$로 표현했으므로 상수항은 $k$가 아니라 $36+k$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-079",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_POLYNOMIAL_DERIVATIVE_RULE"
    ],
    "conditionKeys": [
      "COND_NATURAL_NUMBER"
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
    "content": "다항함수 $f$와 $g(x)=2e^{\\sin(2x)}$에 대해 $(f\\circ g)(0)=3,\\ (f\\circ g)'(0)=8$이다. $f(x)$를 $(x-2)^2$로 나눈 나머지 $R(x)$에 대해 $R(5)$의 값은?",
    "choices": [
      "$7$",
      "$8$",
      "$9$",
      "$10$",
      "$11$"
    ],
    "answer": "③",
    "solution": "$g(0)=2e^{\\sin0}=2$이다.\n합성함수의 미분법으로 $g'(x)=2e^{\\sin2x}\\cdot\\cos2x\\cdot2=4e^{\\sin2x}\\cos2x$이다.\n따라서 $g'(0)=4e^0\\cos0=4$이다.\n$(f\\circ g)(0)=3$에서 $f(g(0))=f(2)=3$이다.\n$(f\\circ g)'(0)=f'(g(0))g'(0)=f'(2)\\cdot4=8$이므로 $f'(2)=2$이다.\n나머지 정리에 의해 $f(x)$를 $(x-2)^2$으로 나눈 나머지는 $R(x)=f(2)+f'(2)(x-2)$이다.\n따라서 $R(x)=3+2(x-2)$이다.\n$R(5)=3+2(5-2)=3+6=9$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-079",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [],
    "integrationPattern": "INTERDEPENDENT"
  }
];
