window.examTitle = "미적분II_245_다항함수×지수함수정적분의부분적분법_고2_유형은행1";

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
    "content": "정적분 $\\int_{-1}^2 |x|e^x dx$의 값은?",
    "choices": [
      "$e^2 - \\frac{2}{e}$",
      "$e^2 - \\frac{2}{e} + 1$",
      "$e^2 + \\frac{2}{e}$",
      "$e^2 - \\frac{2}{e} + 2$",
      "$e^2 + \\frac{2}{e} + 2$"
    ],
    "answer": "④",
    "solution": "절댓값의 부호가 바뀌는 $x=0$을 기준으로 적분 구간을 나눈다(정적분의 구간 분할):\n$$\\int_{-1}^{2}|x|e^x dx=\\int_{-1}^{0}(-x)e^x dx+\\int_{0}^{2}xe^x dx$$\n부정적분 $\\int xe^x dx=(x-1)e^x+C$를 구한다(부분적분법 $\\int uv' dx=uv-\\int u'v dx$, $u=x,\\ v'=e^x$):\n$$\\int xe^x dx=xe^x-\\int e^x dx=(x-1)e^x+C$$\n(i) $[-1,0]$에서는 $|x|=-x$이므로:\n$$\\int_{-1}^{0}(-x)e^x dx=-\\Big[(x-1)e^x\\Big]_{-1}^{0}=-\\{(-1)-(-2)e^{-1}\\}=1-\\frac{2}{e}$$\n(ii) $[0,2]$에서는 $|x|=x$이므로:\n$$\\int_{0}^{2}xe^x dx=\\Big[(x-1)e^x\\Big]_{0}^{2}=e^2-(-1)=e^2+1$$\n(i), (ii)의 값을 더한다:\n$$\\int_{-1}^{2}|x|e^x dx=\\left(1-\\frac{2}{e}\\right)+(e^2+1)=e^2-\\frac{2}{e}+2$$\n주의: $[-1,0]$에서 $|x|=-x$이므로 부호를 뒤집는 것을 잊지 않는다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-099",
    "problemTypeKey": "PT_CALCULUS_INTEGRATION_BY_PARTS",
    "templateKey": "TPL_CALCULUS_PARTS_PRODUCT",
    "crossConceptKeys": [
      "CC_ABSOLUTE_VALUE_FUNCTION",
      "CC_PIECEWISE_INTEGRAL_EVALUATION"
    ],
    "conditionKeys": [],
    "integrationPattern": "CASE_BRANCH"
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
    "content": "정적분 $\\int_0^1 (x-1)^2 e^x dx$의 값은?",
    "choices": [
      "$2e - 5$",
      "$e - 2$",
      "$2e - 4$",
      "$e - 1$",
      "$2e - 3$"
    ],
    "answer": "①",
    "solution": "$u=(x-1)^2,\\ v'=e^x$로 놓고 부분적분법 $\\int uv' dx=uv-\\int u'v dx$를 적용한다($u'=2(x-1),\\ v=e^x$):\n$$\\int (x-1)^2e^x dx=(x-1)^2e^x-2\\int (x-1)e^x dx$$\n남은 적분에 부분적분법을 다시 적용한다($u=x-1,\\ v'=e^x$):\n$$\\int (x-1)e^x dx=(x-1)e^x-\\int e^x dx=(x-2)e^x$$\n두 결과를 결합하여 부정적분을 정리한다:\n$$\\int (x-1)^2e^x dx=(x-1)^2e^x-2(x-2)e^x=(x^2-4x+5)e^x$$\n$x=1$을 대입하면 $1-4+5=2$이므로 값은 $2e$이다.\n$x=0$을 대입하면 값은 $5$이다.\n정적분값은 위끝 값에서 아래끝 값을 뺀 것이다:\n$$\\int_{0}^{1}(x-1)^2e^x dx=2e-5$$\n주의: 아래끝 $x=0$에서 $(0-1)^2=1$이 남으므로 $0$이라고 착각하지 않는다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-099",
    "problemTypeKey": "PT_CALCULUS_INTEGRATION_BY_PARTS",
    "templateKey": "TPL_CALCULUS_PARTS_PRODUCT",
    "crossConceptKeys": [],
    "conditionKeys": [],
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
    "content": "함수\n$$f(x) = \\begin{cases} x & (0 \\le x \\le 1) \\\\ 2-x & (1 < x \\le 2) \\end{cases}$$\n에 대하여 정적분 $\\int_0^2 e^x f(x) dx$의 값은?",
    "choices": [
      "$e^2 - 2e + 1$",
      "$e^2 - e$",
      "$e^2 - 2$",
      "$e^2 - 1$",
      "$e^2$"
    ],
    "answer": "①",
    "solution": "$f(x)$가 $x=1$에서 식이 바뀌므로 적분 구간을 $[0,1]$과 $[1,2]$로 나눈다(정적분의 구간 분할):\n$$\\int_{0}^{2}e^xf(x)dx=\\int_{0}^{1}xe^x dx+\\int_{1}^{2}(2-x)e^x dx$$\n부정적분 $\\int xe^x dx=(x-1)e^x$를 이용한다(부분적분법):\n$$\\int_{0}^{1}xe^x dx=\\Big[(x-1)e^x\\Big]_{0}^{1}=0-(-1)=1$$\n$\\int(2-x)e^x dx$를 부분적분법으로 구한다($u=2-x,\\ v'=e^x$):\n$$\\int(2-x)e^x dx=(2-x)e^x+\\int e^x dx=(3-x)e^x$$\n$[1,2]$에서 정적분한다:\n$$\\int_{1}^{2}(2-x)e^x dx=\\Big[(3-x)e^x\\Big]_{1}^{2}=e^2-2e$$\n두 값을 더한다:\n$$\\int_{0}^{2}e^xf(x)dx=1+(e^2-2e)=e^2-2e+1$$\n주의: $x=1$은 두 구간의 경계이고 한 점의 함숫값은 적분값에 영향을 주지 않는다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-099",
    "problemTypeKey": "PT_CALCULUS_INTEGRATION_BY_PARTS",
    "templateKey": "TPL_CALCULUS_PARTS_PRODUCT",
    "crossConceptKeys": [
      "CC_PIECEWISE_INTEGRAL_EVALUATION"
    ],
    "conditionKeys": [
      "COND_PIECEWISE_DOMAIN_PARTITION"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 4,
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
    "content": "함수 $f(x) = \\frac{e^x - e^{-x}}{2}$에 대하여 정적분 $\\int_{-1}^1 (x+1)f'(x) dx$의 값은?",
    "choices": [
      "$1 - \\frac{2}{e}$",
      "$1 - \\frac{1}{e}$",
      "$2 - \\frac{2}{e}$",
      "$2 - \\frac{1}{e}$",
      "$e - \\frac{1}{e}$"
    ],
    "answer": "⑤",
    "solution": "$f(x)=\\frac{e^x-e^{-x}}{2}$를 미분하면 $f'(x)=\\frac{e^x+e^{-x}}{2}$이다.\n부분적분법 $\\int uv' dx=[uv]-\\int u'v dx$에서 $u=x+1,\\ v'=f'(x)$로 놓으면 $u'=1,\\ v=f(x)$이다:\n$$\\int_{-1}^{1}(x+1)f'(x)dx=\\Big[(x+1)f(x)\\Big]_{-1}^{1}-\\int_{-1}^{1}f(x)dx$$\n경계값을 계산한다:\n$$\\Big[(x+1)f(x)\\Big]_{-1}^{1}=2f(1)-0\\cdot f(-1)=2\\cdot\\frac{e-e^{-1}}{2}=e-\\frac{1}{e}$$\n$f(-x)=\\frac{e^{-x}-e^{x}}{2}=-f(x)$이므로 $f$는 기함수이다(기함수의 정적분 성질):\n$$\\int_{-1}^{1}f(x)dx=0$$\n두 결과를 결합한다:\n$$\\int_{-1}^{1}(x+1)f'(x)dx=\\left(e-\\frac{1}{e}\\right)-0=e-\\frac{1}{e}$$\n주의: $x=-1$에서 $x+1=0$이므로 $f(-1)$의 값은 계산할 필요가 없다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-099",
    "problemTypeKey": "PT_CALCULUS_INTEGRATION_BY_PARTS",
    "templateKey": "TPL_CALCULUS_PARTS_PRODUCT",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  },
  {
    "id": 5,
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
    "content": "$n \\ge 2$인 자연수 $n$에 대하여 $I_n = \\int_0^1 x^n e^{-x} dx$라고 할 때, $n I_{n-1} - I_n$의 값은?",
    "choices": [
      "$\\frac{1}{e^2}$",
      "$\\frac{1}{e}$",
      "$1 - \\frac{1}{e}$",
      "$1$",
      "$e - 1$"
    ],
    "answer": "②",
    "solution": "$I_n=\\int_{0}^{1}x^ne^{-x}dx$에 부분적분법을 적용한다($u=x^n,\\ v'=e^{-x}$이므로 $u'=nx^{n-1},\\ v=-e^{-x}$):\n$$I_n=\\Big[-x^ne^{-x}\\Big]_{0}^{1}+n\\int_{0}^{1}x^{n-1}e^{-x}dx$$\n경계값을 계산한다($n\\ge2$이므로 $0^n=0$):\n$$\\Big[-x^ne^{-x}\\Big]_{0}^{1}=-e^{-1}+0=-\\frac{1}{e}$$\n나머지 항은 $I_{n-1}$의 정의와 같다:\n$$n\\int_{0}^{1}x^{n-1}e^{-x}dx=nI_{n-1}$$\n따라서 점화식을 얻는다:\n$$I_n=nI_{n-1}-\\frac{1}{e}$$\n이를 이항하여 정리하면:\n$$nI_{n-1}-I_n=\\frac{1}{e}$$\n주의: $e^{-x}$의 부정적분이 $-e^{-x}$이므로 부분적분 후 부호가 $+$로 바뀌는 점을 놓치지 않는다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-099",
    "problemTypeKey": "PT_CALCULUS_INTEGRATION_BY_PARTS",
    "templateKey": "TPL_CALCULUS_PARTS_PRODUCT",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_NATURAL_NUMBER"
    ],
    "integrationPattern": "INTERDEPENDENT"
  },
  {
    "id": 6,
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
    "content": "자연수 $n$에 대하여\n$$I_n = \\int_0^1 x^n e^{-x} dx$$\n라고 할 때, <보기>에서 옳은 것만을 있는 대로 고른 것은?\n\n<보기>\nㄱ. $I_1 > I_2$\nㄴ. $n \\ge 2$일 때, $n I_{n-1} + I_n = \\frac{1}{e}$\nㄷ. $I_4 = 24 - \\frac{65}{e}$",
    "choices": [
      "ㄱ",
      "ㄱ, ㄴ",
      "ㄱ, ㄷ",
      "ㄴ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "③",
    "solution": "ㄱ. $0<x<1$에서 $x>x^2$이고 $e^{-x}>0$이므로 $xe^{-x}>x^2e^{-x}$이다.\n정적분의 대소 성질에 의하여 $\\int_{0}^{1}xe^{-x}dx>\\int_{0}^{1}x^2e^{-x}dx$, 즉 $I_1>I_2$이다. (참)\nㄴ. 부분적분법($u=x^n,\\ v'=e^{-x}$)으로 점화식을 구한다:\n$$I_n=\\Big[-x^ne^{-x}\\Big]_{0}^{1}+n\\int_{0}^{1}x^{n-1}e^{-x}dx=-\\frac{1}{e}+nI_{n-1}$$\n즉 $nI_{n-1}-I_n=\\frac{1}{e}$이므로 $nI_{n-1}+I_n=\\frac{1}{e}$은 성립하지 않는다. (거짓)\nㄷ. 먼저 $I_0$을 계산한다:\n$$I_0=\\int_{0}^{1}e^{-x}dx=\\Big[-e^{-x}\\Big]_{0}^{1}=1-\\frac{1}{e}$$\n점화식 $I_n=nI_{n-1}-\\frac{1}{e}$을 차례로 적용한다:\n$$I_1=1\\cdot\\left(1-\\frac{1}{e}\\right)-\\frac{1}{e}=1-\\frac{2}{e}$$\n$$I_2=2\\left(1-\\frac{2}{e}\\right)-\\frac{1}{e}=2-\\frac{5}{e}$$\n$$I_3=3\\left(2-\\frac{5}{e}\\right)-\\frac{1}{e}=6-\\frac{16}{e}$$\n$$I_4=4\\left(6-\\frac{16}{e}\\right)-\\frac{1}{e}=24-\\frac{65}{e}$$\n따라서 $I_4=24-\\frac{65}{e}$이다. (참)\n이상에서 옳은 것은 ㄱ, ㄷ이다.\n주의: 점화식을 반복 적용할 때 매 단계마다 $-\\frac{1}{e}$을 빠뜨리지 않는다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 5,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-099",
    "problemTypeKey": "PT_CALCULUS_INTEGRATION_BY_PARTS",
    "templateKey": "TPL_CALCULUS_PARTS_PRODUCT",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_NATURAL_NUMBER"
    ],
    "integrationPattern": "DEEP_COMPOSITE"
  }
];
