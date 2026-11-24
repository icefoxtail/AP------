window.examTitle = "미적분II_130_합성함수미분법을이용한미분계수극한값계산_고2_유형은행1";

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
    "content": "$f(2)=3,\\ f(3)=5,\\ f'(2)=4,\\ f'(3)=2$인 미분가능한 $f$에 대하여 $\\lim_{x\\to2}[f(f(x))-5]/(x-2)$의 값은?",
    "choices": [
      "$5$",
      "$6$",
      "$7$",
      "$8$",
      "$9$"
    ],
    "answer": "④",
    "solution": "$f(2)=3$이므로 $f(f(2))=f(3)=5$이다.\n$x\\to2$일 때 $f(x)\\to f(2)=3$이므로 $f(f(x))\\to f(3)=5$이다.\n합성함수의 미분법에 의하여 $\\lim_{x\\to2}\\frac{f(f(x))-5}{x-2}=(f\\circ f)'(2)=f'(f(2))f'(2)$이다.\n$f'(f(2))=f'(3)=2$이므로 극한값은 $2\\times4=8$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-079",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT",
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [],
    "integrationPattern": "REINTERPRETATION"
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
    "content": "$f(3)=g(1)=3,\\ f'(3)=g'(1)=a>0$이다. $\\lim_{x\\to1}[f(g(x))-3]/(x^3-1)=12$일 때 $a$는?",
    "choices": [
      "$6$",
      "$7$",
      "$8$",
      "$9$",
      "$10$"
    ],
    "answer": "①",
    "solution": "$x\\to1$일 때 $g(x)\\to g(1)=3$이므로 분자는 $f(g(x))-f(3)$으로 볼 수 있다.\n$x^3-1=(x-1)(x^2+x+1)$로 인수분해한다.\n따라서 주어진 극한은 $\\lim_{x\\to1}\\frac{f(g(x))-f(3)}{x-1}\\cdot\\frac{1}{x^2+x+1}$이다.\n합성함수의 미분법에 의하여 첫 인수는 $(f\\circ g)'(1)=f'(g(1))g'(1)=a\\cdot a=a^2$이다.\n둘째 인수는 $\\frac{1}{1^2+1+1}=\\frac13$이다.\n$\\frac{a^2}{3}=12$에서 $a^2=36$이고 $a>0$이므로 $a=6$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-079",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT",
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
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
    "content": "$f(0)=0,\\ f'(0)=4,\\ \\lim_{x\\to3}f(x)/(x-3)=5$이다. 미분가능한 $f$에 대하여 $\\lim_{x\\to3}f(f(x))/(x-3)$의 값은?",
    "choices": [
      "$4$",
      "$8$",
      "$12$",
      "$16$",
      "$20$"
    ],
    "answer": "⑤",
    "solution": "주어진 극한이 유한하고 분모 $x-3\\to0$이므로 $f(x)\\to0$이다.\n$f$가 미분가능하여 연속이므로 $f(3)=0$이다.\n$\\lim_{x\\to3}\\frac{f(x)-f(3)}{x-3}=f'(3)=5$이다.\n$x\\to3$일 때 $f(x)\\to0$이므로 합성함수의 미분법에 의하여 $\\lim_{x\\to3}\\frac{f(f(x))-f(0)}{x-3}=(f\\circ f)'(3)=f'(f(3))f'(3)$이다.\n$f'(f(3))=f'(0)=4$이므로 극한값은 $4\\times5=20$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-079",
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
    "content": "$f(0)=0,\\ f'(0)=2,\\ \\lim_{x\\to1}f(x)/(x-1)^2=7$인 미분가능한 $f$에 대해 $\\lim_{x\\to1}f(f(x))/(x-1)^2$의 값은?",
    "choices": [
      "$8$",
      "$10$",
      "$12$",
      "$14$",
      "$16$"
    ],
    "answer": "④",
    "solution": "주어진 극한값이 $7$이고 분모 $(x-1)^2\\to0$이므로 $f(x)\\to0$이다.\n$f$가 연속이므로 $f(1)=0$이다.\n$\\lim_{x\\to1}\\frac{f(x)}{(x-1)^2}=7$에서 $1$에 충분히 가까운 $x\\ne1$에 대해 $f(x)\\ne0$이다.\n$\\frac{f(f(x))}{(x-1)^2}=\\frac{f(f(x))}{f(x)}\\cdot\\frac{f(x)}{(x-1)^2}$로 분리한다.\n$x\\to1$일 때 $f(x)\\to0$이고 $f(0)=0$이므로 $\\lim_{x\\to1}\\frac{f(f(x))}{f(x)}=f'(0)=2$이다.\n따라서 극한값은 $2\\times7=14$이다.\n주의: $f(x)=0$인 점에서는 차분몫을 나눌 수 없지만, 주어진 극한값 $7$ 때문에 $x=1$ 근처에서는 $f(x)\\ne0$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-079",
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
    "content": "그래프 $y=f(x)$의 점 $(3,4)$에서의 접선 기울기는 $5$, 그래프 $y=g(x)$의 점 $(2,3)$에서의 접선 기울기는 $-2$이다. $\\lim_{x\\to2}[f(g(x))-4]/(x-2)$의 값은?",
    "choices": [
      "$-16$",
      "$-14$",
      "$-12$",
      "$-10$",
      "$-8$"
    ],
    "answer": "④",
    "solution": "점 $(2,3)$이 $y=g(x)$ 위의 점이므로 $g(2)=3$이다.\n점 $(3,4)$이 $y=f(x)$ 위의 점이므로 $f(3)=4$이고 $f(g(2))=f(3)=4$이다.\n합성함수의 미분법에 의하여 $(f\\circ g)'(2)=f'(g(2))g'(2)$이다.\n접선의 기울기에서 $f'(3)=5,\\ g'(2)=-2$이다.\n따라서 극한값은 $5\\times(-2)=-10$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-079",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_TANGENT_LINE_SLOPE_AT_POINT",
      "CC_DERIVATIVE_DEFINITION_LIMIT"
    ],
    "conditionKeys": [],
    "integrationPattern": "REINTERPRETATION"
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
    "content": "$\\lim_{x\\to3}[f(x)-2]/(x-3)=-3,\\ \\lim_{x\\to2}[g(x)+1]/(x-2)=-4$이다. 미분가능한 $f,g$에 대해 $(g\\circ f)'(3)$의 값은?",
    "choices": [
      "$4$",
      "$6$",
      "$8$",
      "$10$",
      "$12$"
    ],
    "answer": "⑤",
    "solution": "첫 극한이 유한하고 분모 $x-3\\to0$이므로 $f(x)\\to2$이고, 연속성에서 $f(3)=2$이다.\n따라서 $f'(3)=-3$이다.\n둘째 극한이 유한하고 분모 $x-2\\to0$이므로 $g(x)\\to-1$이고, 연속성에서 $g(2)=-1$이다.\n따라서 $g'(2)=-4$이다.\n합성함수의 미분법에 의하여 $(g\\circ f)'(3)=g'(f(3))f'(3)$이다.\n$f(3)=2$이므로 $g'(f(3))=g'(2)=-4$이다.\n따라서 값은 $(-4)\\times(-3)=12$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-079",
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
    "content": "$\\lim_{x\\to-2}[f(x)+1]/(x+2)=3,\\ \\lim_{x\\to-1}[g(x)+2]/(x+1)=-2$이다. 미분가능한 $f,g$에 대해 $(f\\circ g)'(-1)$의 값은?",
    "choices": [
      "$-6$",
      "$-5$",
      "$-4$",
      "$-3$",
      "$-2$"
    ],
    "answer": "①",
    "solution": "첫 극한이 유한하고 분모 $x+2\\to0$이므로 $f(x)\\to-1$이고, 연속성에서 $f(-2)=-1$이다.\n따라서 $f'(-2)=3$이다.\n둘째 극한이 유한하고 분모 $x+1\\to0$이므로 $g(x)\\to-2$이고, 연속성에서 $g(-1)=-2$이다.\n따라서 $g'(-1)=-2$이다.\n합성함수의 미분법에 의하여 $(f\\circ g)'(-1)=f'(g(-1))g'(-1)$이다.\n$g(-1)=-2$이므로 $f'(g(-1))=f'(-2)=3$이다.\n따라서 값은 $3\\times(-2)=-6$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-079",
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
    "id": 8,
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
    "content": "$h=g\\circ f,\\ f(2)=3,\\ f'(2)=4$이고 $\\lim_{x\\to2}[h(x)-7]/(x-2)=20$이다. 미분가능한 $f,g$에 대해 $g(3)+g'(3)$은?",
    "choices": [
      "$11$",
      "$12$",
      "$13$",
      "$14$",
      "$15$"
    ],
    "answer": "②",
    "solution": "$h(2)=g(f(2))=g(3)$이다.\n주어진 극한이 유한하고 분모 $x-2\\to0$이므로 $h(x)\\to7$이고, 연속성에서 $h(2)=7$이다.\n따라서 $g(3)=7$이다.\n주어진 극한은 $h'(2)=20$을 뜻한다.\n합성함수의 미분법에 의하여 $h'(2)=g'(f(2))f'(2)=g'(3)\\cdot4$이다.\n$4g'(3)=20$에서 $g'(3)=5$이다.\n따라서 $g(3)+g'(3)=7+5=12$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-079",
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
    "id": 9,
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
    "content": "$\\lim_{x\\to2}[f(x)+2]/(x-2)=4,\\ \\lim_{x\\to2}[g(x)-2]/[f(x)+2]=-3$이다. 미분가능한 $f,g$에 대해 $\\lim_{x\\to2}[f(g(x))+2]/(x-2)$의 값은?",
    "choices": [
      "$-48$",
      "$-40$",
      "$-32$",
      "$-24$",
      "$-16$"
    ],
    "answer": "①",
    "solution": "첫 극한이 유한하고 분모 $x-2\\to0$이므로 $f(x)+2\\to0$이고, 연속성에서 $f(2)=-2$이다.\n따라서 $f'(2)=4$이다.\n둘째 극한 $\\frac{g(x)-2}{f(x)+2}\\to-3$에서 $g(x)-2\\to0$이므로 $g(2)=2$이다.\n$\\frac{g(x)-2}{x-2}=\\frac{g(x)-2}{f(x)+2}\\cdot\\frac{f(x)+2}{x-2}$로 분해한다.\n극한을 취하면 $g'(2)=(-3)\\times4=-12$이다.\n$x\\to2$일 때 $g(x)\\to2$이므로 합성함수의 미분법에 의하여 $\\lim_{x\\to2}\\frac{f(g(x))+2}{x-2}=(f\\circ g)'(2)=f'(g(2))g'(2)$이다.\n$g(2)=2$이므로 $f'(g(2))=f'(2)=4$이다.\n따라서 값은 $4\\times(-12)=-48$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-079",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT",
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [],
    "integrationPattern": "INTERDEPENDENT"
  },
  {
    "id": 10,
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
    "content": "다항함수 $f$가 $\\lim_{x\\to0}x/f(x)=2,\\ \\lim_{x\\to2}(x-2)/f(x)=1/3$을 만족한다. $\\lim_{x\\to2}f(f(x))/[(x-2)(x+1)]$의 값은?",
    "choices": [
      "$-\\frac14$",
      "$0$",
      "$\\frac14$",
      "$\\frac12$",
      "$\\frac34$"
    ],
    "answer": "④",
    "solution": "첫 극한 $\\lim_{x\\to0}\\frac{x}{f(x)}=2$에서 분모 $f(x)\\to0$이어야 하므로 $f(0)=0$이다.\n역수를 취하면 $\\lim_{x\\to0}\\frac{f(x)}{x}=\\frac12$이므로 $f'(0)=\\frac12$이다.\n둘째 극한 $\\lim_{x\\to2}\\frac{x-2}{f(x)}=\\frac13$에서 분모 $f(x)\\to0$이어야 하므로 $f(2)=0$이다.\n역수를 취하면 $\\lim_{x\\to2}\\frac{f(x)}{x-2}=3$이므로 $f'(2)=3$이다.\n$\\frac{f(f(x))}{(x-2)(x+1)}=\\frac{f(f(x))}{f(x)}\\cdot\\frac{f(x)}{x-2}\\cdot\\frac{1}{x+1}$로 분해한다.\n$x\\to2$일 때 $f(x)\\to0$이고 $f(0)=0$이므로 $\\lim_{x\\to2}\\frac{f(f(x))}{f(x)}=f'(0)=\\frac12$이다.\n$\\lim_{x\\to2}\\frac{f(x)}{x-2}=3$이고 $\\lim_{x\\to2}\\frac{1}{x+1}=\\frac13$이다.\n따라서 극한값은 $\\frac12\\times3\\times\\frac13=\\frac12$이다.\n주의: $f'(2)=3\\ne0$이므로 $x=2$ 근처에서 $f(x)\\ne0$이고, $f(x)$가 $0$에 접근할 때도 $f'(0)=\\frac12$에 의해 차분몫 계산이 정당화된다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-079",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT",
      "CC_POLYNOMIAL_DERIVATIVE_RULE"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
