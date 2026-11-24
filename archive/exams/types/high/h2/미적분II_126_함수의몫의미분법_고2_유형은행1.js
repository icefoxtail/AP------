window.examTitle = "미적분II_126_함수의몫의미분법_고2_유형은행1";

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
    "content": "함수 $f(x)=2x^2-x+3/x+2/x^2$의 $f'(-1)$의 값은?",
    "choices": [
      "$-6$",
      "$-5$",
      "$-4$",
      "$-3$",
      "$-2$"
    ],
    "answer": "③",
    "solution": "$f(x)=2x^2-x+\\frac{3}{x}+\\frac{2}{x^2}=2x^2-x+3x^{-1}+2x^{-2}$로 쓴다.\n항별로 다항함수와 음의 거듭제곱의 미분법을 적용하면 $f'(x)=4x-1-3x^{-2}-4x^{-3}=4x-1-\\frac{3}{x^2}-\\frac{4}{x^3}$이다.\n$x=-1$을 대입하면 $f'(-1)=4(-1)-1-\\frac{3}{(-1)^2}-\\frac{4}{(-1)^3}$이다.\n계산하면 $f'(-1)=-4-1-3+4=-4$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 1,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-078",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_POLYNOMIAL_DERIVATIVE_RULE"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "함수 $f(x)=\\sum_{k=1}^{8}x^{-k}$에 대하여 $f'(1)$의 값은?",
    "choices": [
      "$-52$",
      "$-48$",
      "$-44$",
      "$-40$",
      "$-36$"
    ],
    "answer": "⑤",
    "solution": "$f(x)=\\sum_{k=1}^{8}x^{-k}$의 각 항 $x^{-k}$를 미분하면 $-kx^{-k-1}$이다.\n합의 미분법에 의해 $f'(x)=-\\sum_{k=1}^{8}kx^{-k-1}$이다.\n$x=1$을 대입하면 $f'(1)=-\\sum_{k=1}^{8}k$이다.\n$\\sum_{k=1}^{8}k=\\frac{8\\cdot9}{2}=36$이므로 $f'(1)=-36$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-078",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_SERIES_SUM"
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
    "content": "$y=(2x^2+5)/(x-4)$의 도함수가 $y'=(ax^2+bx-5)/(x-4)^2$일 때 $a+b$의 값은?",
    "choices": [
      "$-18$",
      "$-16$",
      "$-14$",
      "$-12$",
      "$-10$"
    ],
    "answer": "③",
    "solution": "몫의 미분법 $\\left(\\frac{u}{v}\\right)'=\\frac{u'v-uv'}{v^2}$을 적용한다.\n$u=2x^2+5$, $v=x-4$이므로 $u'=4x$, $v'=1$이다.\n분자는 $u'v-uv'=4x(x-4)-(2x^2+5)$이다.\n전개하면 $4x^2-16x-2x^2-5=2x^2-16x-5$이다.\n따라서 $a=2$, $b=-16$이므로 $a+b=2-16=-14$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-078",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_POLYNOMIAL_DERIVATIVE_RULE"
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
    "content": "함수 $f(x)=3/(2x+1)^2$에 대하여 $f'(1)$의 값은?",
    "choices": [
      "$-\\frac49$",
      "$-\\frac39$",
      "$-\\frac29$",
      "$-\\frac19$",
      "$\\frac19$"
    ],
    "answer": "①",
    "solution": "$f(x)=3(2x+1)^{-2}$로 쓴다.\n합성함수의 미분법과 거듭제곱의 미분법으로 $f'(x)=3\\cdot(-2)(2x+1)^{-3}\\cdot2$이다.\n정리하면 $f'(x)=-\\frac{12}{(2x+1)^3}$이다.\n$x=1$을 대입하면 $f'(1)=-\\frac{12}{3^3}=-\\frac{12}{27}=-\\frac49$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-078",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "함수 $f(x)=ax/(x+b)$가 $f(2)=3,\\ f'(2)=1$을 만족할 때 $a+b$의 값은?",
    "choices": [
      "$9$",
      "$10$",
      "$11$",
      "$12$",
      "$13$"
    ],
    "answer": "⑤",
    "solution": "$f(2)=\\frac{2a}{2+b}=3$에서 $2a=3(2+b)$, 즉 $a=\\frac{3(2+b)}{2}$이다.\n몫의 미분법으로 $f'(x)=\\frac{a(x+b)-ax}{(x+b)^2}=\\frac{ab}{(x+b)^2}$이다.\n$f'(2)=1$에서 $\\frac{ab}{(2+b)^2}=1$, 즉 $ab=(2+b)^2$이다.\n$b\\ne-2$이므로 $a=\\frac{3(2+b)}{2}$를 대입하면 $\\frac{3b(2+b)}{2}=(2+b)^2$이다.\n양변을 $2+b$로 나누면 $\\frac{3b}{2}=2+b$이고, $3b=4+2b$에서 $b=4$이다.\n그때 $a=\\frac{3\\cdot6}{2}=9$이므로 $a+b=9+4=13$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-078",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_CURVE_POINT_COEFFICIENT_SYSTEM"
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
    "content": "함수 $f(x)=(ax^2-bx+4)/(x-2)$가 $f'(0)=1,\\ f'(1)=-3$을 만족할 때 $f'(3)$의 값은?",
    "choices": [
      "$-4$",
      "$-3$",
      "$-2$",
      "$-1$",
      "$0$"
    ],
    "answer": "②",
    "solution": "$f(x)=\\frac{ax^2-bx+4}{x-2}$에 몫의 미분법을 적용한다.\n분자는 $(2ax-b)(x-2)-(ax^2-bx+4)$이다.\n전개하면 $2ax^2-4ax-bx+2b-ax^2+bx-4=ax^2-4ax+2b-4$이다.\n따라서 $f'(x)=\\frac{ax^2-4ax+2b-4}{(x-2)^2}$이다.\n$f'(0)=1$에서 $\\frac{2b-4}{4}=1$이므로 $2b-4=4$, $b=4$이다.\n$f'(1)=-3$에서 $\\frac{a-4a+2b-4}{(-1)^2}=-3$이고, $b=4$를 대입하면 $-3a+4=-3$이다.\n이때 $a=\\frac73$이다.\n$x=3$에서 분자는 $9a-12a+2b-4=-3a+4=-7+4=-3$이고 분모는 $1$이다.\n따라서 $f'(3)=-3$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-078",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_CURVE_POINT_COEFFICIENT_SYSTEM"
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
    "content": "함수 $f(x)=(x^2-a)/(x-3)$에 대해 $f'(4)=0$일 때 $a$는?",
    "choices": [
      "$4$",
      "$5$",
      "$6$",
      "$7$",
      "$8$"
    ],
    "answer": "⑤",
    "solution": "몫의 미분법으로 $f'(x)=\\frac{2x(x-3)-(x^2-a)}{(x-3)^2}$이다.\n분자를 전개하면 $2x^2-6x-x^2+a=x^2-6x+a$이다.\n$f'(4)=0$이므로 $\\frac{4^2-6\\cdot4+a}{(4-3)^2}=0$이다.\n분모가 $1$이므로 $16-24+a=0$, 즉 $a-8=0$이다.\n따라서 $a=8$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-078",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_ROOT_SOLVING"
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
    "content": "미분가능한 함수 $f$가 $f(2)=2,\\ f'(2)=-3$을 만족한다. $g(x)=(x^2+2)/f(x)$에 대하여 $g'(2)$의 값은?",
    "choices": [
      "$\\frac72$",
      "$\\frac92$",
      "$\\frac{11}2$",
      "$\\frac{13}2$",
      "$\\frac{15}2$"
    ],
    "answer": "④",
    "solution": "몫의 미분법으로 $g'(x)=\\frac{2x f(x)-(x^2+2)f'(x)}{\\{f(x)\\}^2}$이다.\n$x=2$에서 $f(2)=2$, $f'(2)=-3$을 대입한다.\n분자는 $2\\cdot2\\cdot2-(2^2+2)(-3)$이다.\n계산하면 $8-6\\cdot(-3)=8+18=26$이다.\n분모는 $\\{f(2)\\}^2=2^2=4$이다.\n따라서 $g'(2)=\\frac{26}{4}=\\frac{13}{2}$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-078",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "함수 $f(x)=(x+2)/(x^2+5)$에 대하여 $f'(x)>0$인 정수 $x$의 개수는?",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "⑤",
    "solution": "몫의 미분법으로 $f'(x)=\\frac{(x^2+5)-(x+2)\\cdot2x}{(x^2+5)^2}$이다.\n분자를 정리하면 $x^2+5-2x^2-4x=5-4x-x^2$이다.\n분모 $(x^2+5)^2>0$이므로 $f'(x)>0$은 $5-4x-x^2>0$과 같다.\n$-x^2-4x+5>0$에서 $x^2+4x-5<0$이다.\n인수분해하면 $(x+5)(x-1)<0$이므로 $-5<x<1$이다.\n이 범위의 정수는 $-4,-3,-2,-1,0$의 $5$개이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-078",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_POLYNOMIAL_INEQUALITY_DERIVATIVE"
    ],
    "conditionKeys": [
      "COND_INTEGER"
    ],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "$x\\ne3$에서 $f(x)=(x^2+3x+2)/(x-3)$이다. $f(x)+(x-3)f'(x)=ax+b$일 때 $a+b$는?",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "⑤",
    "solution": "$x\\ne3$에서 $(x-3)f(x)=x^2+3x+2$이다.\n양변을 미분하면 곱의 미분법에 의해 $f(x)+(x-3)f'(x)=2x+3$이다.\n따라서 $a=2$, $b=3$이다.\n그러므로 $a+b=2+3=5$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-078",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_POLYNOMIAL_DERIVATIVE_RULE"
    ],
    "conditionKeys": [],
    "integrationPattern": "REINTERPRETATION"
  },
  {
    "id": 11,
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
    "content": "$x>0$에서 $f(x)=\\sum_{k=1}^{\\infty}(1+2x)^{-k}$이다. $f'(1/4)$의 값은?",
    "choices": [
      "$-8$",
      "$-6$",
      "$-4$",
      "$-2$",
      "$0$"
    ],
    "answer": "①",
    "solution": "$x>0$에서 $1+2x>1$이므로 등비급수의 공비는 $\\frac1{1+2x}$이고 $\\left|\\frac1{1+2x}\\right|<1$이다.\n등비급수의 합 공식으로 $f(x)=\\frac{\\frac1{1+2x}}{1-\\frac1{1+2x}}$이다.\n분모를 정리하면 $1-\\frac1{1+2x}=\\frac{2x}{1+2x}$이므로 $f(x)=\\frac1{2x}$이다.\n$f(x)=\\frac12x^{-1}$을 미분하면 $f'(x)=-\\frac12x^{-2}=-\\frac1{2x^2}$이다.\n$x=\\frac14$을 대입하면 $f'\\left(\\frac14\\right)=-\\frac1{2\\cdot(1/4)^2}$이다.\n계산하면 $f'\\left(\\frac14\\right)=-\\frac1{2\\cdot\\frac1{16}}=-\\frac1{\\frac18}=-8$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-078",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_GEOMETRIC_SEQUENCE",
      "CC_SERIES_SUM"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 12,
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
    "content": "$0<x<1/2$에서 $f_k(x)=(2x)^k$, $g(x)=\\lim_{n\\to\\infty}\\sum_{k=1}^{n}f_k(x)$이다. $g'(1/4)$의 값은?",
    "choices": [
      "$4$",
      "$8$",
      "$12$",
      "$16$",
      "$20$"
    ],
    "answer": "②",
    "solution": "$0<x<\\frac12$에서 $|2x|<1$이므로 등비급수가 수렴한다.\n$g(x)=\\lim_{n\\to\\infty}\\sum_{k=1}^{n}(2x)^k$의 첫째항은 $2x$, 공비는 $2x$이다.\n등비급수의 합 공식으로 $g(x)=\\frac{2x}{1-2x}$이다.\n몫의 미분법으로 $g'(x)=\\frac{2(1-2x)-2x\\cdot(-2)}{(1-2x)^2}$이다.\n분자를 정리하면 $2-4x+4x=2$이므로 $g'(x)=\\frac{2}{(1-2x)^2}$이다.\n$x=\\frac14$을 대입하면 $g'\\left(\\frac14\\right)=\\frac{2}{(1-\\frac12)^2}$이다.\n계산하면 $g'\\left(\\frac14\\right)=\\frac{2}{(\\frac12)^2}=\\frac{2}{\\frac14}=8$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-078",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_GEOMETRIC_SEQUENCE",
      "CC_SERIES_SUM"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
