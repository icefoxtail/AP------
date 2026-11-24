window.examTitle = "미적분II_249_정적분의치환적분과부분적분법_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "여러 가지 적분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-07",
    "standardUnit": "여러 가지 적분법",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 적분법"
    ],
    "wide": false,
    "content": "자연수 $n$에 대하여 함수\n$$f(n) = \\int_0^n (x^3 + x) e^{x^2} dx$$\n라 할 때, $\\frac{f(4)}{f(2)}$의 값은?",
    "choices": [
      "$2e^{10}$",
      "$4e^{10}$",
      "$2e^{12}$",
      "$4e^{12}$",
      "$8e^{12}$"
    ],
    "answer": "④",
    "solution": "치환적분법을 적용하기 위해 $t=x^2$으로 놓으면 $\\frac{dt}{dx}=2x$이므로 $x\\,dx=\\frac{1}{2}dt$이다.\n적분구간은 $x=0$일 때 $t=0$, $x=n$일 때 $t=n^2$이다.\n피적분함수를 정리하면 $(x^3+x)dx=(x^2+1)\\cdot x\\,dx=\\frac{1}{2}(t+1)dt$이다.\n따라서 $f(n)=\\int_0^{n^2}\\frac{1}{2}(t+1)e^t dt$이다.\n곱의 미분법의 역으로 $(te^t)'=(t+1)e^t$임을 이용하면 $$f(n)=\\frac{1}{2}\\left[te^t\\right]_0^{n^2}$$이다.\n위끝과 아래끝을 대입하면 $f(n)=\\frac{1}{2}(n^2e^{n^2}-0)=\\frac{1}{2}n^2e^{n^2}$이다.\n$n=4$를 대입하면 $f(4)=\\frac{1}{2}\\cdot16\\,e^{16}=8e^{16}$이다.\n$n=2$를 대입하면 $f(2)=\\frac{1}{2}\\cdot4\\,e^{4}=2e^{4}$이다.\n따라서 $\\frac{f(4)}{f(2)}=\\frac{8e^{16}}{2e^{4}}=4e^{12}$이다.\n주의: 치환 후 적분구간을 $t$의 구간 $[0,n^2]$으로 반드시 바꾸어야 한다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_NATURAL_NUMBER"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 2,
    "category": "여러 가지 적분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-07",
    "standardUnit": "여러 가지 적분법",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 적분법"
    ],
    "wide": false,
    "content": "실수 전체의 집합에서 미분가능한 함수 $f(x)$에 대하여 $f'(x)$가 연속함수이고 다음 조건을 만족시킨다.\n(가) $f(1) = 4$\n(나) $\\int_0^1 (1-x) f'(2x+1) dx = 1$\n$\\int_1^3 f(x) dx$의 값은?",
    "choices": [
      "$6$",
      "$8$",
      "$10$",
      "$12$",
      "$14$"
    ],
    "answer": "④",
    "solution": "부분적분법을 적용하기 위해 $u=1-x$, $v'=f'(2x+1)$로 놓으면 $u'=-1$이고, 합성함수의 미분법의 역으로 $v=\\frac{1}{2}f(2x+1)$이다.\n부분적분 공식 $\\int u v' dx=[uv]-\\int u'v\\,dx$를 적용하면 $$\\int_0^1(1-x)f'(2x+1)dx=\\left[(1-x)\\cdot\\frac{1}{2}f(2x+1)\\right]_0^1+\\frac{1}{2}\\int_0^1 f(2x+1)dx$$이다.\n대괄호의 값을 계산하면 $0-\\frac{1}{2}f(1)=-\\frac{1}{2}f(1)$이다.\n남은 정적분에서 $t=2x+1$로 놓으면 $dx=\\frac{1}{2}dt$이고 구간은 $x=0$일 때 $t=1$, $x=1$일 때 $t=3$이다.\n치환적분법으로 정리하면 $\\frac{1}{2}\\int_0^1 f(2x+1)dx=\\frac{1}{2}\\int_1^3 f(t)\\cdot\\frac{1}{2}dt=\\frac{1}{4}\\int_1^3 f(x)dx$이다.\n조건 (나)에 대입하면 $-\\frac{1}{2}f(1)+\\frac{1}{4}\\int_1^3 f(x)dx=1$이다.\n조건 (가)에서 $f(1)=4$이므로 $-2+\\frac{1}{4}\\int_1^3 f(x)dx=1$, 즉 $\\frac{1}{4}\\int_1^3 f(x)dx=3$이다.\n양변에 $4$를 곱하면 $\\int_1^3 f(x)dx=12$이다.\n주의: $f'(2x+1)$을 적분할 때 계수 $\\frac{1}{2}$을 빠뜨리지 않는다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [
      "CC_INTEGRAL_BOUNDARY_ROOT_EVALUATION"
    ],
    "conditionKeys": [
      "COND_FUNCTION_VALUE_CONSTRAINT"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 3,
    "category": "여러 가지 적분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-07",
    "standardUnit": "여러 가지 적분법",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 적분법"
    ],
    "wide": false,
    "content": "정의역이 $\\{x \\mid x > -\\frac{1}{2}\\}$인 함수 $f(x)$에 대하여 $f'(x) = \\frac{1}{(2x^3+1)^2}$이고 함수 $g(x) = x^2$일 때,\n$$\\int_0^1 f(x) g'(x) dx = \\frac{2}{9}$$\n이다. $f(1)$의 값은?",
    "choices": [
      "$\\frac{1}{3}$",
      "$\\frac{4}{9}$",
      "$\\frac{5}{9}$",
      "$\\frac{2}{3}$",
      "$\\frac{7}{9}$"
    ],
    "answer": "①",
    "solution": "부분적분법 공식 $\\int_0^1 f(x)g'(x)dx=[f(x)g(x)]_0^1-\\int_0^1 f'(x)g(x)dx$를 적용한다.\n$g(x)=x^2$이므로 $[f(x)g(x)]_0^1=f(1)\\cdot1-f(0)\\cdot0=f(1)$이다.\n$f'(x)=\\frac{1}{(2x^3+1)^2}$, $g(x)=x^2$을 대입하면 $\\int_0^1 f'(x)g(x)dx=\\int_0^1\\frac{x^2}{(2x^3+1)^2}dx$이다.\n치환적분법으로 $t=2x^3+1$이라 하면 $dt=6x^2dx$이므로 $x^2dx=\\frac{1}{6}dt$이다.\n적분구간은 $x=0$일 때 $t=1$, $x=1$일 때 $t=3$이다.\n따라서 $\\int_0^1\\frac{x^2}{(2x^3+1)^2}dx=\\int_1^3\\frac{1}{t^2}\\cdot\\frac{1}{6}dt=\\frac{1}{6}\\left[-\\frac{1}{t}\\right]_1^3$이다.\n값을 계산하면 $\\frac{1}{6}\\left(-\\frac{1}{3}+1\\right)=\\frac{1}{6}\\cdot\\frac{2}{3}=\\frac{1}{9}$이다.\n그러므로 $\\int_0^1 f(x)g'(x)dx=f(1)-\\frac{1}{9}$이다.\n조건에서 $f(1)-\\frac{1}{9}=\\frac{2}{9}$이므로 $f(1)=\\frac{1}{3}$이다.\n주의: $f(0)$의 값은 주어지지 않았지만 $g(0)=0$이므로 $f(0)g(0)=0$이 되어 결과에 영향이 없다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
