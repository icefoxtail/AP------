window.examTitle = "미적분II_128_합성함수의미분법1_고2_유형은행1";

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
    "content": "미분가능한 함수 $f$가 $f(3)=2,\\ f'(3)=1$이다. $y=[xf(x)]^2$의 $x=3$에서의 미분계수는?",
    "choices": [
      "$54$",
      "$60$",
      "$66$",
      "$72$",
      "$78$"
    ],
    "answer": "②",
    "solution": "합성함수의 미분법을 쓰기 위해 $u=xf(x)$로 두면 $u(3)=3\\cdot2=6$이다.\n곱의 미분법으로 $u'(x)=f(x)+xf'(x)$이므로 $u'(3)=2+3\\cdot1=5$이다.\n$y=u^2$이므로 합성함수의 미분법으로 $y'=2uu'$이다.\n따라서 $x=3$에서의 미분계수는 $2\\cdot6\\cdot5=60$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-079",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [],
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
    "content": "$f(2)=2,\\ f'(2)=4$인 미분가능한 함수 $f$에 대하여 $y=[f(x)/x]^3$의 $x=2$에서의 미분계수는?",
    "choices": [
      "$\\frac12$",
      "$\\frac32$",
      "$\\frac52$",
      "$\\frac72$",
      "$\\frac92$"
    ],
    "answer": "⑤",
    "solution": "$u(x)=\\frac{f(x)}{x}$로 두면 $u(2)=\\frac{2}{2}=1$이다.\n몫의 미분법으로 $u'(x)=\\frac{f'(x)x-f(x)}{x^2}$이므로 $u'(2)=\\frac{4\\cdot2-2}{4}=\\frac{6}{4}=\\frac32$이다.\n$y=u^3$이므로 합성함수의 미분법으로 $y'=3u^2u'$이다.\n따라서 $x=2$에서의 미분계수는 $3\\cdot1^2\\cdot\\frac32=\\frac92$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-079",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [],
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
    "content": "$y=[x/(x^2+3)]^3$의 도함수가 $y'=(ax^4+bx^2)/(x^2+3)^4$일 때 $a+b$의 값은?",
    "choices": [
      "$6$",
      "$9$",
      "$12$",
      "$15$",
      "$18$"
    ],
    "answer": "①",
    "solution": "$u(x)=\\frac{x}{x^2+3}$로 두면 몫의 미분법으로 $u'(x)=\\frac{1\\cdot(x^2+3)-x\\cdot2x}{(x^2+3)^2}=\\frac{3-x^2}{(x^2+3)^2}$이다.\n$y=u^3$이므로 합성함수의 미분법으로 $y'=3u^2u'$이다.\n$u^2=\\frac{x^2}{(x^2+3)^2}$이므로 $y'=3\\cdot\\frac{x^2}{(x^2+3)^2}\\cdot\\frac{3-x^2}{(x^2+3)^2}=\\frac{3x^2(3-x^2)}{(x^2+3)^4}$이다.\n분자를 전개하면 $3x^2(3-x^2)=9x^2-3x^4=-3x^4+9x^2$이다.\n따라서 $a=-3$, $b=9$이므로 $a+b=6$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-079",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [],
    "conditionKeys": [],
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
    "content": "미분가능한 $f$가 $f(2)=9$이고 $y=(3x+6)\\sqrt{f(x)}$의 $x=2$에서의 미분계수가 $17$이다. $f'(2)$의 값은?",
    "choices": [
      "$3$",
      "$4$",
      "$5$",
      "$6$",
      "$7$"
    ],
    "answer": "②",
    "solution": "$y=(3x+6)\\sqrt{f(x)}$에서 $\\sqrt{f(x)}$는 합성함수이므로 미분하면 $\\frac{f'(x)}{2\\sqrt{f(x)}}$이다.\n곱의 미분법으로 $y'=3\\sqrt{f(x)}+(3x+6)\\cdot\\frac{f'(x)}{2\\sqrt{f(x)}}$이다.\n$x=2$에서 $f(2)=9$이므로 $\\sqrt{f(2)}=3$이다.\n대입하면 $17=3\\cdot3+(3\\cdot2+6)\\cdot\\frac{f'(2)}{2\\cdot3}=9+12\\cdot\\frac{f'(2)}{6}=9+2f'(2)$이다.\n따라서 $2f'(2)=8$에서 $f'(2)=4$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-079",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_CURVE_POINT_COEFFICIENT_SYSTEM"
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
    "content": "$\\lim_{x\\to2}[f(x)-4]/(x-2)=5$인 미분가능한 $f$에 대하여 $g(x)=f(x)\\sqrt{f(x)}$라 하자. $g'(2)$의 값은?",
    "choices": [
      "$9$",
      "$12$",
      "$15$",
      "$18$",
      "$21$"
    ],
    "answer": "③",
    "solution": "극한값이 존재하고 $f$가 미분가능하므로 $f$는 연속이다. 분모가 $0$으로 가므로 분자도 $0$으로 가야 하므로 $f(2)=4$이다.\n주어진 극한은 $f'(2)=\\lim_{x\\to2}\\frac{f(x)-f(2)}{x-2}=5$임을 뜻한다.\n$g(x)=f(x)\\sqrt{f(x)}=(f(x))^{3/2}$이고, $f(2)=4>0$ 근처에서 합성함수의 미분법을 쓸 수 있다.\n$g'(x)=\\frac32(f(x))^{1/2}f'(x)=\\frac32\\sqrt{f(x)}f'(x)$이다.\n따라서 $g'(2)=\\frac32\\sqrt{4}\\cdot5=\\frac32\\cdot2\\cdot5=15$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-079",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT"
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
    "content": "$y=f(x)$의 $x=3$에서의 접선 기울기가 $12$이다. $g(x)=f(\\sqrt{x})$의 $x=9$에서의 미분계수는?",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "②",
    "solution": "$x=3$에서 접선의 기울기가 $12$이므로 $f'(3)=12$이다.\n$g(x)=f(\\sqrt{x})$는 합성함수이므로 $g'(x)=f'(\\sqrt{x})\\cdot(\\sqrt{x})'$이다.\n$(\\sqrt{x})'=\\frac{1}{2\\sqrt{x}}$이므로 $g'(x)=\\frac{f'(\\sqrt{x})}{2\\sqrt{x}}$이다.\n$x=9$에서 $\\sqrt{9}=3$이므로 $g'(9)=\\frac{f'(3)}{2\\sqrt{9}}=\\frac{12}{2\\cdot3}$이다.\n계산하면 $g'(9)=\\frac{12}{6}=2$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-079",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_TANGENT_LINE_SLOPE_AT_POINT"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 7,
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
    "content": "$f(x)=(a-x)^3$의 $x=0$에서의 미분계수가 $-48$이다. $a>0$일 때 $\\lim_{h\\to0}[f(2+3h)-f(2-h)]/h$의 값은?",
    "choices": [
      "$-60$",
      "$-54$",
      "$-48$",
      "$-42$",
      "$-36$"
    ],
    "answer": "③",
    "solution": "$f'(x)=3(a-x)^2\\cdot(-1)=-3(a-x)^2$이다. (합성함수의 미분법)\n$x=0$에서의 미분계수가 $-48$이므로 $-3a^2=-48$, 즉 $a^2=16$이다.\n$a>0$이므로 $a=4$이고, $f'(x)=-3(4-x)^2$이다.\n$f'(2)=-3(4-2)^2=-3\\cdot4=-12$이다.\n극한을 나누면 $\\lim_{h\\to0}\\frac{f(2+3h)-f(2-h)}{h}=\\lim_{h\\to0}\\frac{f(2+3h)-f(2)}{h}-\\lim_{h\\to0}\\frac{f(2-h)-f(2)}{h}$이다.\n$t=3h$로 치환하면 첫 극한은 $3f'(2)$이고, $t=-h$로 치환하면 둘째 극한은 $-f'(2)$이다.\n따라서 전체 극한은 $3f'(2)-(-f'(2))=4f'(2)$이다.\n주의: 둘째 항은 $h\\to0$일 때 $-f'(2)$로 가므로 부호를 바꾸어 더해야 한다.\n그러므로 값은 $4\\cdot(-12)=-48$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-079",
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
  }
];
