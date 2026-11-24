window.examTitle = "미적분II_090_미분가능을이용한미정계수결정_고2_유형은행1";

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
    "content": "함수 $f(x)=\\begin{cases}8\\ln(x/2)+b &(x\\ge2)\\\\ ax^2+2 &(x<2)\\end{cases}$가 모든 실수에서 미분가능할 때, $a+b$의 값은?",
    "choices": [
      "$4$",
      "$5$",
      "$6$",
      "$7$",
      "$8$"
    ],
    "answer": "④",
    "solution": "$x=2$에서 연속이어야 하므로 $4a+2=8\\ln1+b=b$, 즉 $b=4a+2$이다(연속성).\n$x\\ge2$에서 $\\dfrac{d}{dx}\\{8\\ln(x/2)+b\\}=\\dfrac8x$이므로 우미분계수는 $\\dfrac82=4$이다.\n$x<2$에서 $\\dfrac{d}{dx}(ax^2+2)=2ax$이므로 좌미분계수는 $2a\\cdot2=4a$이다.\n미분가능하려면 좌우 미분계수가 같아야 하므로 $4a=4$, 즉 $a=1$이다(미분가능성).\n$b=4a+2=4\\cdot1+2=6$이므로 $a+b=1+6=7$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-068",
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
    "content": "함수 $f(x)=\\begin{cases}3x+b &(x\\le2)\\\\ a\\ln(x/2)+8 &(x>2)\\end{cases}$가 $x=2$에서 미분가능할 때, $a+b$의 값은?",
    "choices": [
      "$6$",
      "$7$",
      "$8$",
      "$9$",
      "$10$"
    ],
    "answer": "③",
    "solution": "$x=2$에서 연속이어야 하므로 $3\\cdot2+b=a\\ln1+8=8$, 즉 $6+b=8$에서 $b=2$이다(연속성).\n$x<2$에서 $\\dfrac{d}{dx}(3x+b)=3$이므로 좌미분계수는 $3$이다.\n$x>2$에서 $\\dfrac{d}{dx}\\{a\\ln(x/2)+8\\}=\\dfrac{a}{x}$이므로 우미분계수는 $\\dfrac{a}{2}$이다.\n미분가능하려면 $3=\\dfrac{a}{2}$, 즉 $a=6$이다(미분가능성).\n따라서 $a+b=6+2=8$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-068",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [],
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
    "content": "$a>0$이라 하자. 함수 $f(x)=\\begin{cases}\\ln(ax) &(x>1)\\\\ e^{2x-2}+bx+2 &(0<x\\le1)\\end{cases}$가 $x=1$에서 미분가능할 때, $-ab$의 값은?",
    "choices": [
      "$1$",
      "$e$",
      "$e^2/2$",
      "$2e$",
      "$e^2$"
    ],
    "answer": "⑤",
    "solution": "$0<x\\le1$인 쪽에서 $\\dfrac{d}{dx}(e^{2x-2}+bx+2)=2e^{2x-2}+b$이므로 $x=1$에서 좌미분계수는 $2e^{0}+b=2+b$이다.\n$x>1$인 쪽에서 $\\dfrac{d}{dx}\\ln(ax)=\\dfrac1x$이므로 $x=1$에서 우미분계수는 $1$이다.\n미분가능하려면 좌우 미분계수가 같아야 하므로 $2+b=1$, 즉 $b=-1$이다(미분가능성).\n$x=1$에서 연속이어야 하므로 $\\ln a=e^{0}+b+2=1-1+2=2$이다(연속성).\n따라서 $a=e^2$이고 $-ab=-e^2\\cdot(-1)=e^2$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-068",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 4,
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
    "content": "함수 $f(x)=\\begin{cases}2\\ln x+a &(0<x<1)\\\\ a\\cdot3^x+b &(x\\ge1)\\end{cases}$가 모든 양의 실수에서 미분가능할 때, $a-b$의 값은?",
    "choices": [
      "$\\frac1{2\\ln3}$",
      "$\\frac1{\\ln3}$",
      "$\\frac2{\\ln3}$",
      "$\\frac3{\\ln3}$",
      "$\\frac4{\\ln3}$"
    ],
    "answer": "③",
    "solution": "$x=1$에서 연속이어야 하므로 $2\\ln1+a=a\\cdot3^1+b=3a+b$, 즉 $a=3a+b$에서 $b=-2a$이다(연속성).\n$0<x<1$에서 $\\dfrac{d}{dx}(2\\ln x+a)=\\dfrac2x$이므로 좌미분계수는 $2$이다.\n$x\\ge1$에서 $\\dfrac{d}{dx}(a\\cdot3^x+b)=a\\cdot3^x\\ln3$이므로 우미분계수는 $3a\\ln3$이다.\n미분가능하려면 $2=3a\\ln3$, 즉 $a=\\dfrac{2}{3\\ln3}$이다(미분가능성).\n$a-b=a-(-2a)=3a=3\\cdot\\dfrac{2}{3\\ln3}=\\dfrac{2}{\\ln3}$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-068",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 5,
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
    "content": "함수 $f(x)=\\begin{cases}ae^{2-x} &(x\\le2)\\\\ x^2-bx+1 &(x>2)\\end{cases}$가 모든 실수에서 미분가능할 때, $a+b$의 값은?",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "①",
    "solution": "$x=2$에서 연속이어야 하므로 $ae^{0}=2^2-2b+1$, 즉 $a=5-2b$이다(연속성).\n$x\\le2$에서 $\\dfrac{d}{dx}(ae^{2-x})=-ae^{2-x}$이므로 좌미분계수는 $-a$이다.\n$x>2$에서 $\\dfrac{d}{dx}(x^2-bx+1)=2x-b$이므로 우미분계수는 $4-b$이다.\n미분가능하려면 $-a=4-b$이다(미분가능성).\n$a=5-2b$를 대입하면 $-(5-2b)=4-b$, 즉 $-5+2b=4-b$에서 $3b=9$, $b=3$이다.\n그러면 $a=5-2\\cdot3=-1$이므로 $a+b=-1+3=2$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-068",
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
    "id": 6,
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
    "content": "자연로그의 밑의 정의 $\\lim_{t\\to0}(1+t)^{1/t}=e$를 이용할 때, $\\lim_{x\\to1}\\ln\\!\\left(x^{\\frac{5}{2x-2}}\\right)$의 값은?",
    "choices": [
      "$\\tfrac32$",
      "$\\tfrac52$",
      "$\\tfrac72$",
      "$\\tfrac92$",
      "$\\tfrac{11}2$"
    ],
    "answer": "②",
    "solution": "$t=x-1$로 두면 $x\\to1$일 때 $t\\to0$이고 $x=1+t$이다(치환).\n지수법칙에 의해 $x^{\\frac{5}{2x-2}}=(1+t)^{\\frac{5}{2t}}=\\left\\{(1+t)^{1/t}\\right\\}^{5/2}$이다.\n자연로그의 밑의 정의 $\\lim_{t\\to0}(1+t)^{1/t}=e$를 적용하면 $\\left\\{(1+t)^{1/t}\\right\\}^{5/2}\\to e^{5/2}$이다.\n$\\ln$은 연속함수이므로 $\\lim_{x\\to1}\\ln\\!\\left(x^{\\frac{5}{2x-2}}\\right)=\\ln\\!\\left(e^{5/2}\\right)=\\dfrac52$이다(로그함수의 연속성).\n주의: $x\\to1$이므로 $x>0$이고 밑 $1+t>0$이어야 로그가 정의된다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-068",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_FUNCTION_LIMIT"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 7,
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
    "content": "$f(x)=\\log_5(2x+3)$ $(x>-3/2)$의 도함수를 미분계수의 정의로 구할 때, 옳은 것은?",
    "choices": [
      "$\\frac1{(2x+3)\\ln5}$",
      "$\\frac{3}{2(2x+3)\\ln5}$",
      "$\\frac{5}{3(2x+3)\\ln5}$",
      "$\\frac2{(2x+3)\\ln5}$",
      "$\\frac3{(2x+3)\\ln5}$"
    ],
    "answer": "④",
    "solution": "미분계수의 정의로 $f'(x)=\\lim_{h\\to0}\\dfrac{\\log_5(2(x+h)+3)-\\log_5(2x+3)}{h}$이다.\n로그의 성질로 차를 합치면 $f'(x)=\\lim_{h\\to0}\\dfrac1h\\log_5\\!\\left(1+\\dfrac{2h}{2x+3}\\right)=\\lim_{h\\to0}\\dfrac{\\ln\\!\\left(1+\\frac{2h}{2x+3}\\right)}{h\\ln5}$이다(밑의 변환).\n$t=\\dfrac{2h}{2x+3}$로 두면 $h=\\dfrac{(2x+3)t}{2}$이고 $h\\to0$일 때 $t\\to0$이다(치환).\n$\\lim_{t\\to0}\\dfrac{\\ln(1+t)}{t}=1$을 적용하면 $f'(x)=\\dfrac{2}{2x+3}\\cdot\\dfrac{1}{\\ln5}\\cdot1=\\dfrac{2}{(2x+3)\\ln5}$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-068",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 8,
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
    "content": "아래 조건을 만족하는 두 함수 $f,g$에 대하여 $A+B$의 값은?\n$\\lim_{x\\to\\infty}xf(x)=4$, $\\quad A=\\lim_{x\\to\\infty}x\\ln(1+3f(x))$\n$\\lim_{x\\to0}\\frac{g(x)}{\\ln(1+3x)}=2$, $\\quad B=\\lim_{x\\to0}\\frac{g(x)}{e^{-3x}-1}$",
    "choices": [
      "$6$",
      "$7$",
      "$8$",
      "$9$",
      "$10$"
    ],
    "answer": "⑤",
    "solution": "$xf(x)\\to4$이고 $x\\to\\infty$이므로 $f(x)=\\dfrac{xf(x)}{x}\\to0$이다.\n$A=\\lim_{x\\to\\infty}x\\ln(1+3f(x))=\\lim_{x\\to\\infty}x\\cdot3f(x)\\cdot\\dfrac{\\ln(1+3f(x))}{3f(x)}$로 변형한다.\n$t=3f(x)\\to0$일 때 $\\dfrac{\\ln(1+t)}{t}\\to1$이므로 $\\dfrac{\\ln(1+3f(x))}{3f(x)}\\to1$이다.\n따라서 $A=3\\lim_{x\\to\\infty}xf(x)\\cdot1=3\\cdot4=12$이다.\n$B$는 $\\dfrac{g(x)}{e^{-3x}-1}=\\dfrac{g(x)}{\\ln(1+3x)}\\cdot\\dfrac{\\ln(1+3x)}{3x}\\cdot\\dfrac{3x}{e^{-3x}-1}$로 분해한다.\n$\\lim_{x\\to0}\\dfrac{\\ln(1+3x)}{3x}=1$이고, $u=-3x\\to0$일 때 $\\dfrac{u}{e^u-1}\\to1$이므로 $\\dfrac{3x}{e^{-3x}-1}=-\\dfrac{-3x}{e^{-3x}-1}\\to-1$이다.\n따라서 $B=2\\cdot1\\cdot(-1)=-2$이다.\n$A+B=12+(-2)=10$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-068",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_FUNCTION_LIMIT"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  },
  {
    "id": 9,
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
    "content": "자연수 $n$에 대하여 $P_n(t)=\\prod_{j=1}^n(1+2jt)$, $S_n=\\lim_{x\\to\\infty}x\\ln P_n(1/x)$라 하자. $\\sum_{n=1}^{\\infty}\\frac{3}{S_n}$의 값은?",
    "choices": [
      "$3$",
      "$4$",
      "$5$",
      "$6$",
      "$7$"
    ],
    "answer": "①",
    "solution": "$S_n=\\lim_{x\\to\\infty}x\\ln\\!\\left(\\prod_{j=1}^n(1+2jt)\\right)$에서 $t=1/x$로 두면 $x\\to\\infty$일 때 $t\\to0^+$이다(치환).\n로그의 성질로 $\\ln\\prod_{j=1}^n(1+2jt)=\\sum_{j=1}^n\\ln(1+2jt)$이므로 $S_n=\\lim_{t\\to0^+}\\sum_{j=1}^n\\dfrac{\\ln(1+2jt)}{t}$이다.\n각 항은 $\\dfrac{\\ln(1+2jt)}{t}=2j\\cdot\\dfrac{\\ln(1+2jt)}{2jt}$이고, $\\lim_{u\\to0}\\dfrac{\\ln(1+u)}{u}=1$에 의해 $2j$로 수렴한다.\n유한합의 극한이므로 $S_n=\\sum_{j=1}^n2j=2\\cdot\\dfrac{n(n+1)}{2}=n(n+1)$이다(등차수열의 합).\n$\\dfrac{3}{S_n}=\\dfrac{3}{n(n+1)}=3\\left(\\dfrac1n-\\dfrac1{n+1}\\right)$이다(부분분수 분해).\n첫 $N$항의 합은 $3\\left(1-\\dfrac1{N+1}\\right)$이고, $N\\to\\infty$일 때 $\\dfrac1{N+1}\\to0$이므로 급수의 합은 $3$이다(망원급수).\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-068",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_TELESCOPING_SERIES"
    ],
    "conditionKeys": [
      "COND_NATURAL_NUMBER"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 10,
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
    "content": "$a>0$일 때 점 $P(a,0)$을 지나는 수직선이 그래프 $y=3^x$, $y=7^x$와 만나는 점을 각각 $Q$, $R$이라 하자. 원점을 $O$라 할 때, $\\lim_{a\\to0^+}\\frac{\\overline{QR}}{\\overline{OP}}$의 값은?\n[그림: 좌표축에 $(0,1)$을 지나는 두 곡선 $y=3^x$, $y=7^x$를 그린다. 수직선 $x=a$와 $x$축의 교점 $P(a,0)$, 곡선과의 교점 $Q(a,3^a)$, $R(a,7^a)$를 아래에서 위 순으로 표시한다. 원점 $O$와 선분 $OP$, $QR$을 표시한다.]",
    "choices": [
      "$\\ln2$",
      "$\\ln\\frac73$",
      "$\\ln3$",
      "$\\ln\\frac72$",
      "$\\ln4$"
    ],
    "answer": "②",
    "solution": "$Q$는 $x=a$와 $y=3^x$의 교점이므로 $Q(a,3^a)$이고, $R$은 $y=7^x$ 위의 점이므로 $R(a,7^a)$이다.\n$\\overline{QR}=7^a-3^a$, $\\overline{OP}=a$이므로 $\\dfrac{\\overline{QR}}{\\overline{OP}}=\\dfrac{7^a-3^a}{a}$이다.\n$\\dfrac{7^a-3^a}{a}=\\dfrac{7^a-1}{a}-\\dfrac{3^a-1}{a}$로 나누어 쓴다.\n지수함수의 극한 $\\lim_{a\\to0}\\dfrac{7^a-1}{a}=\\ln7$, $\\lim_{a\\to0}\\dfrac{3^a-1}{a}=\\ln3$을 적용한다.\n따라서 극한값은 $\\ln7-\\ln3=\\ln\\dfrac73$이다(로그의 성질).\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-068",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_FUNCTION_LIMIT"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 11,
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
    "content": "$a>0$이고 $f(x)=x\\log_2(ax^3)$ $(x>0)$이다. $\\lim_{x\\to1}\\frac{f(x)-\\log_2 a}{x-1}=2$일 때, $a$의 값은?",
    "choices": [
      "$e^{-3}$",
      "$2e^{-3}$",
      "$3e^{-3}$",
      "$4e^{-3}$",
      "$5e^{-3}$"
    ],
    "answer": "④",
    "solution": "$f(1)=1\\cdot\\log_2(a\\cdot1^3)=\\log_2 a$이므로 주어진 극한은 $\\lim_{x\\to1}\\dfrac{f(x)-f(1)}{x-1}=f'(1)$이다(미분계수의 정의).\n$f(x)=x\\log_2(ax^3)$에 곱의 미분법을 적용하면 $f'(x)=\\log_2(ax^3)+x\\cdot\\dfrac{1}{(ax^3)\\ln2}\\cdot3ax^2$이다.\n정리하면 $f'(x)=\\log_2(ax^3)+\\dfrac{3}{\\ln2}$이다.\n$f'(1)=\\log_2 a+\\dfrac{3}{\\ln2}=2$이므로 $\\log_2 a=2-\\dfrac{3}{\\ln2}=\\dfrac{2\\ln2-3}{\\ln2}$이다.\n밑의 변환 $\\log_2 a=\\dfrac{\\ln a}{\\ln2}$로부터 $\\ln a=2\\ln2-3$이다.\n따라서 $a=e^{2\\ln2-3}=4e^{-3}$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-068",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "REINTERPRETATION"
  },
  {
    "id": 12,
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
    "content": "함수 $f(x)=\\begin{cases}ae^{x-1}-3x &(x\\le1)\\\\ x^2+bx-2a+3 &(x>1)\\end{cases}$가 $x=1$에서 미분가능할 때, $a-b$의 값은?",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "⑤",
    "solution": "$x=1$에서의 함수값은 $ae^{0}-3=a-3$이고, 우극한은 $1+b-2a+3=4+b-2a$이다.\n연속이어야 하므로 $a-3=4+b-2a$, 즉 $3a-b=7$이다(연속성).\n$h<0$일 때 $\\dfrac{f(1+h)-f(1)}{h}=\\dfrac{ae^{h}-3(1+h)-(a-3)}{h}=a\\cdot\\dfrac{e^{h}-1}{h}-3$이므로 좌미분계수는 $a-3$이다(지수함수의 극한).\n$h>0$일 때 $\\dfrac{f(1+h)-f(1)}{h}=\\dfrac{(1+h)^2+b(1+h)-2a+3-(a-3)}{h}$이고, 연속 조건 $3a-b=7$을 쓰면 $2+b+h$로 정리되므로 우미분계수는 $2+b$이다.\n미분가능하려면 $a-3=2+b$, 즉 $a-b=5$이다(미분가능성).\n$3a-b=7$과 $a-b=5$를 변끼리 빼면 $2a=2$, 즉 $a=1$이고 $b=-4$이다.\n따라서 $a-b=1-(-4)=5$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-068",
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
    "id": 13,
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
    "content": "함수 $f(x)=2x\\ln x$ $(x>0)$가 있다. 구간 $(a,b)$의 모든 $x$에 대하여 급수 $\\sum_{n=1}^\\infty\\{f'(x)\\}^n$이 수렴할 때, $b-a$의 최댓값은?",
    "choices": [
      "$e^{-1/2}-e^{-3/2}$",
      "$1-e^{-1/2}$",
      "$e^{-1/2}-e^{-2}$",
      "$1-e^{-1}$",
      "$1-e^{-3/2}$"
    ],
    "answer": "①",
    "solution": "$f(x)=2x\\ln x$에 곱의 미분법을 적용하면 $f'(x)=2\\ln x+2x\\cdot\\dfrac1x=2(\\ln x+1)$이다.\n급수 $\\sum_{n=1}^\\infty\\{f'(x)\\}^n$은 첫째항이 $f'(x)$, 공비가 $f'(x)$인 등비급수이다.\n등비급수의 수렴 조건은 $|f'(x)|<1$이므로 $|2(\\ln x+1)|<1$이다(등비급수의 수렴 조건).\n절댓값을 풀면 $-1<2(\\ln x+1)<1$, 즉 $-\\dfrac12<\\ln x+1<\\dfrac12$이다.\n양변에서 $1$을 빼면 $-\\dfrac32<\\ln x<-\\dfrac12$이다.\n$\\ln x$는 증가함수이므로 $e^{-3/2}<x<e^{-1/2}$이다(지수함수와 로그함수의 대소 관계).\n구간 $(a,b)$의 모든 $x$에서 수렴하려면 $(a,b)\\subset(e^{-3/2},e^{-1/2})$이어야 하므로 $b-a$는 두 끝점의 차이를 넘을 수 없다.\n$b-a$의 최댓값은 $e^{-1/2}-e^{-3/2}$이다.\n주의: 등비급수는 $|f'(x)|=1$인 경계에서는 수렴하지 않으므로 끝점은 구간에 포함되지 않는다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-068",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_GEOMETRIC_SEQUENCE"
    ],
    "conditionKeys": [
      "COND_UNIVERSAL_INPUTS"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
