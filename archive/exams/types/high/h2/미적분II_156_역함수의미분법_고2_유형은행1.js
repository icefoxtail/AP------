window.examTitle = "미적분II_156_역함수의미분법_고2_유형은행1";

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
    "content": "역함수 $g$를 갖는 미분가능한 함수 $f$의 그래프 위 $(2,7)$에서 접선의 방정식이 $y=6x-5$이다. $g'(7)$의 값은?",
    "choices": [
      "$\\frac{1}{6}$",
      "$\\frac{1}{3}$",
      "$\\frac{1}{2}$",
      "$\\frac{2}{3}$",
      "$\\frac{5}{6}$"
    ],
    "answer": "①",
    "solution": "접점 $(2,7)$이 그래프 위의 점이므로 $f(2)=7$이다.\n접선의 기울기는 미분계수이므로 $f'(2)=6$이다.\n역함수의 정의에서 $f(2)=7$일 때 $g(7)=2$이다.\n역함수의 미분법 $g'(y)=\\frac{1}{f'(x)}$ ($y=f(x)$)를 적용하면 $g'(7)=\\frac{1}{f'(2)}=\\frac{1}{6}$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-082",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_TANGENT_LINE_SLOPE_AT_POINT"
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
    "content": "미분가능한 두 함수 $f,g$는 서로 역함수이며 $f(-2)=3,\\ f'(-2)=3$이다. $h(x)=xg(x)$일 때 $h'(3)$의 값은?",
    "choices": [
      "$-1$",
      "$0$",
      "$1$",
      "$2$",
      "$3$"
    ],
    "answer": "①",
    "solution": "$f(-2)=3$이고 $f,g$가 서로 역함수이므로 $g(3)=-2$이다.\n역함수의 미분법으로 $g'(3)=\\frac{1}{f'(-2)}=\\frac{1}{3}$이다.\n$h(x)=xg(x)$에 곱의 미분법을 쓰면 $h'(x)=g(x)+xg'(x)$이다.\n$x=3$을 대입하면 $h'(3)=g(3)+3g'(3)=-2+3\\cdot\\frac{1}{3}$이다.\n계산하면 $-2+1=-1$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-082",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_PRODUCT_RULE"
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
    "content": "$f(x)=x^3+5x-2$의 역함수를 $g$라 할 때 $g'(4)$의 값은?",
    "choices": [
      "$\\frac{1}{40}$",
      "$\\frac{1}{20}$",
      "$\\frac{3}{40}$",
      "$\\frac{1}{10}$",
      "$\\frac{1}{8}$"
    ],
    "answer": "⑤",
    "solution": "$f(1)=1^3+5\\cdot1-2=4$임을 확인한다.\n역함수의 정의에서 $g(4)=1$이다.\n다항함수의 미분법으로 $f'(x)=3x^2+5$이므로 $f'(1)=3+5=8$이다.\n역함수의 미분법으로 $g'(4)=\\frac{1}{f'(1)}=\\frac{1}{8}$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-082",
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
    "content": "$f(x)=2x^3-1$의 역함수를 $g$라 하자. $f'(-4)g'(15)$의 값은?",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "④",
    "solution": "$f(2)=2\\cdot2^3-1=16-1=15$이므로 역함수의 정의에서 $g(15)=2$이다.\n다항함수의 미분법으로 $f'(x)=6x^2$이다.\n$f'(2)=6\\cdot2^2=24$이고 $f'(-4)=6\\cdot(-4)^2=96$이다.\n역함수의 미분법으로 $g'(15)=\\frac{1}{f'(2)}=\\frac{1}{24}$이다.\n따라서 $f'(-4)g'(15)=96\\cdot\\frac{1}{24}=4$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-082",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_POLYNOMIAL_DERIVATIVE_RULE"
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
    "content": "$f(x)=x^3+2x-2$의 역함수를 $g$라 하고 $h(x)=f(x)g(x)$라 하자. $h'(-2)$의 값은?",
    "choices": [
      "$-7$",
      "$-6$",
      "$-5$",
      "$-4$",
      "$-3$"
    ],
    "answer": "①",
    "solution": "$f(0)=0+0-2=-2$이므로 역함수의 정의에서 $g(-2)=0$이다.\n$f'(x)=3x^2+2$이므로 $f'(0)=2$이고, 역함수의 미분법으로 $g'(-2)=\\frac{1}{f'(0)}=\\frac{1}{2}$이다.\n$f(-2)=(-2)^3+2(-2)-2=-8-4-2=-14$이다.\n$h(x)=f(x)g(x)$에 곱의 미분법을 쓰면 $h'(x)=f'(x)g(x)+f(x)g'(x)$이다.\n$f'(-2)=3\\cdot4+2=14$이므로 $x=-2$를 대입하면 $h'(-2)=14\\cdot0+(-14)\\cdot\\frac{1}{2}$이다.\n계산하면 $0-7=-7$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-082",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_POLYNOMIAL_DERIVATIVE_RULE",
      "CC_PRODUCT_RULE"
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
    "content": "$f(x)=\\sqrt{x^2+9}$ ($x\\ge0$)의 역함수를 $g$라 하자. $g'(5)$의 값은?",
    "choices": [
      "$\\frac{1}{4}$",
      "$\\frac{1}{2}$",
      "$\\frac{3}{4}$",
      "$1$",
      "$\\frac{5}{4}$"
    ],
    "answer": "⑤",
    "solution": "$f(4)=\\sqrt{4^2+9}=\\sqrt{25}=5$이므로 역함수의 정의에서 $g(5)=4$이다.\n$f(x)=(x^2+9)^{1/2}$에 합성함수의 미분법을 쓰면 $f'(x)=\\frac{1}{2}(x^2+9)^{-1/2}\\cdot2x=\\frac{x}{\\sqrt{x^2+9}}$이다.\n$f'(4)=\\frac{4}{\\sqrt{25}}=\\frac{4}{5}$이다.\n역함수의 미분법으로 $g'(5)=\\frac{1}{f'(4)}=\\frac{1}{4/5}=\\frac{5}{4}$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-082",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_RADICAL_FUNCTION"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
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
    "content": "$x>0$에서 $f(x)=x-\\frac8x$의 역함수를 $g$라 하자. $h(x)=[g(x)]^2$일 때 $h'(2)$의 값은?",
    "choices": [
      "$\\frac{16}{3}$",
      "$\\frac{17}{3}$",
      "$6$",
      "$\\frac{19}{3}$",
      "$\\frac{20}{3}$"
    ],
    "answer": "①",
    "solution": "$f(4)=4-\\frac{8}{4}=4-2=2$이므로 역함수의 정의에서 $g(2)=4$이다.\n$f(x)=x-8x^{-1}$의 미분은 $f'(x)=1+\\frac{8}{x^2}$이다.\n$f'(4)=1+\\frac{8}{16}=1+\\frac{1}{2}=\\frac{3}{2}$이다.\n역함수의 미분법으로 $g'(2)=\\frac{1}{f'(4)}=\\frac{2}{3}$이다.\n$h(x)=\\{g(x)\\}^2$에 합성함수의 미분법을 쓰면 $h'(x)=2g(x)g'(x)$이다.\n$h'(2)=2\\cdot4\\cdot\\frac{2}{3}=\\frac{16}{3}$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-082",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_RATIONAL_FUNCTION"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
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
    "content": "미분가능한 함수 $f$는 역함수 $g$를 갖는다. 모든 실수 $x$에서 $f(x)-f(-x)=3x$이고 $f(2)=7,\\ f'(2)=1$일 때 $g'(1)$의 값은?",
    "choices": [
      "$\\frac{1}{4}$",
      "$\\frac{1}{2}$",
      "$\\frac{3}{4}$",
      "$1$",
      "$\\frac{5}{4}$"
    ],
    "answer": "②",
    "solution": "$f(x)-f(-x)=3x$에 $x=2$를 대입하면 $f(2)-f(-2)=6$이다.\n$f(2)=7$이므로 $7-f(-2)=6$에서 $f(-2)=1$이다.\n역함수의 정의에서 $g(1)=-2$이다.\n양변을 미분하면(합성함수의 미분법) $f'(x)+f'(-x)=3$이다.\n$x=2$를 대입하면 $f'(2)+f'(-2)=3$이고 $1+f'(-2)=3$에서 $f'(-2)=2$이다.\n역함수의 미분법으로 $g'(1)=\\frac{1}{f'(-2)}=\\frac{1}{2}$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-082",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_FUNCTIONAL_EQUATION"
    ],
    "conditionKeys": [
      "COND_UNIVERSAL_INPUTS"
    ],
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
    "content": "미분가능한 함수 $f$는 역함수 $g$를 갖는다. 모든 실수 $x$에 대해 $f(x)+f(6-x)=10$이고 $f(1)=9,\\ f'(1)=-5$이다. $g'(1)$의 값은?",
    "choices": [
      "$-1$",
      "$-\\frac{4}{5}$",
      "$-\\frac{3}{5}$",
      "$-\\frac{2}{5}$",
      "$-\\frac{1}{5}$"
    ],
    "answer": "⑤",
    "solution": "$f(x)+f(6-x)=10$에 $x=1$을 대입하면 $f(1)+f(5)=10$이다.\n$f(1)=9$이므로 $f(5)=1$이다.\n역함수의 정의에서 $g(1)=5$이다.\n양변을 미분하면 $f'(x)-f'(6-x)=0$, 즉 $f'(x)=f'(6-x)$이다.\n$x=1$을 대입하면 $f'(5)=f'(1)=-5$이다.\n역함수의 미분법으로 $g'(1)=\\frac{1}{f'(5)}=\\frac{1}{-5}=-\\frac{1}{5}$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-082",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_FUNCTIONAL_EQUATION"
    ],
    "conditionKeys": [
      "COND_UNIVERSAL_INPUTS"
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
    "content": "$f(t)=2e^t+e^{3t}$에 대해 $F(x)=f(3x)$의 역함수를 $g$라 하자. $g'(3)$의 값은?",
    "choices": [
      "$\\frac{1}{15}$",
      "$\\frac{2}{15}$",
      "$\\frac{1}{5}$",
      "$\\frac{4}{15}$",
      "$\\frac{1}{3}$"
    ],
    "answer": "①",
    "solution": "$F(x)=f(3x)=2e^{3x}+e^{9x}$이다.\n$F(0)=2e^0+e^0=2+1=3$이므로 역함수의 정의에서 $g(3)=0$이다.\n지수함수의 미분법으로 $f'(t)=2e^t+3e^{3t}$이다.\n합성함수의 미분법으로 $F'(x)=3f'(3x)$이다.\n$F'(0)=3f'(0)=3(2+3)=15$이다.\n역함수의 미분법으로 $g'(3)=\\frac{1}{F'(0)}=\\frac{1}{15}$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-082",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_FUNCTION_COMPOSITION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "증가함수 $f$의 그래프 위 $(6,4)$에서 접선의 기울기는 $\\frac23$이다. $F(x)=f(3x)$의 역함수를 $g$라 하고 $g(4)=a,\\ g'(4)=b$라 할 때 $2(a+b)$의 값은?",
    "choices": [
      "$4$",
      "$5$",
      "$6$",
      "$7$",
      "$8$"
    ],
    "answer": "②",
    "solution": "접점 $(6,4)$에서 $f(6)=4$이고 접선의 기울기는 $f'(6)=\\frac{2}{3}$이다.\n$F(2)=f(6)=4$이므로 역함수의 정의에서 $a=g(4)=2$이다.\n합성함수의 미분법으로 $F'(x)=3f'(3x)$이다.\n$F'(2)=3f'(6)=3\\cdot\\frac{2}{3}=2$이다.\n역함수의 미분법으로 $b=g'(4)=\\frac{1}{F'(2)}=\\frac{1}{2}$이다.\n따라서 $2(a+b)=2\\left(2+\\frac{1}{2}\\right)=2\\cdot\\frac{5}{2}=5$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-082",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_FUNCTION_COMPOSITION",
      "CC_TANGENT_LINE_SLOPE_AT_POINT"
    ],
    "conditionKeys": [
      "COND_STRICT_MONOTONE_VALUES"
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
    "content": "$f(t)=(t-2)^3+3(t-2)+1$과 미분가능한 함수 $g$가 모든 실수 $x$에서 $f(g(4x))=x+1$을 만족한다. $g'(0)$의 값은?",
    "choices": [
      "$\\frac{1}{36}$",
      "$\\frac{1}{18}$",
      "$\\frac{1}{12}$",
      "$\\frac{1}{9}$",
      "$\\frac{5}{36}$"
    ],
    "answer": "③",
    "solution": "$f(g(4x))=x+1$에 $x=0$을 대입하면 $f(g(0))=1$이다.\n$f(t)=(t-2)^3+3(t-2)+1$이므로 $f(t)=1$은 $(t-2)^3+3(t-2)=0$이다.\n인수분해하면 $(t-2)\\{(t-2)^2+3\\}=0$이고 $(t-2)^2+3>0$이므로 $t=2$, 즉 $g(0)=2$이다.\n양변을 미분하면(합성함수의 미분법) $4f'(g(4x))g'(4x)=1$이다.\n$f'(t)=3(t-2)^2+3$이므로 $f'(2)=3$이다.\n$x=0$을 대입하면 $4f'(g(0))g'(0)=4\\cdot3\\cdot g'(0)=1$이다.\n따라서 $g'(0)=\\frac{1}{12}$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-082",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_FUNCTION_COMPOSITION"
    ],
    "conditionKeys": [
      "COND_UNIVERSAL_INPUTS"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
