window.examTitle = "미적분II_237_대칭성을이용한정적분계산_고2_유형은행1";

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
    "content": "정적분\n$$\\int_{-\\frac{\\pi}{4}}^{\\frac{\\pi}{4}} \\left( x^5 \\cos 2x - 3x^2 \\sin 4x + \\frac{\\sin x}{1+x^2} + 4\\cos 2x \\right) dx$$\n의 값은?",
    "choices": [
      "$0$",
      "$1$",
      "$2$",
      "$3$",
      "$4$"
    ],
    "answer": "⑤",
    "solution": "적분구간이 $\\left[-\\frac{\\pi}{4},\\frac{\\pi}{4}\\right]$로 원점에 대하여 대칭이므로 기함수와 우함수의 정적분 성질을 이용한다.\n$f_1(x)=x^5\\cos 2x$이면 $f_1(-x)=(-x)^5\\cos(-2x)=-x^5\\cos2x=-f_1(x)$이므로 기함수이다.\n$f_2(x)=-3x^2\\sin4x$이면 $f_2(-x)=-3(-x)^2\\sin(-4x)=3x^2\\sin4x=-f_2(x)$이므로 기함수이다.\n$f_3(x)=\\frac{\\sin x}{1+x^2}$이면 $f_3(-x)=\\frac{\\sin(-x)}{1+(-x)^2}=-\\frac{\\sin x}{1+x^2}=-f_3(x)$이므로 기함수이다.\n따라서 $\\int_{-\\pi/4}^{\\pi/4}(f_1(x)+f_2(x)+f_3(x))dx=0$이다.\n$f_4(x)=4\\cos2x$는 $f_4(-x)=4\\cos(-2x)=4\\cos2x=f_4(x)$인 우함수이므로 $\\int_{-\\pi/4}^{\\pi/4}4\\cos2x\\,dx=2\\int_0^{\\pi/4}4\\cos2x\\,dx$이다.\n$2\\int_0^{\\pi/4}4\\cos2x\\,dx=8\\left[\\frac{1}{2}\\sin2x\\right]_0^{\\pi/4}=4\\left(\\sin\\frac{\\pi}{2}-\\sin0\\right)=4(1-0)=4$이다.\n주의: 기함수 항은 적분하기 전에 정적분 값이 $0$임을 먼저 확인하여 소거한다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [
      "CC_ODD_EVEN_FUNCTION_INTEGRATION"
    ],
    "conditionKeys": [],
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
    "content": "정적분\n$$\\int_{-1}^1 \\left( e^x - x\\sqrt{x^2+3} - \\sin \\pi x \\right) dx$$\n의 값은?",
    "choices": [
      "$e - \\frac{1}{e}$",
      "$e + \\frac{1}{e}$",
      "$2e - \\frac{2}{e}$",
      "$2e + \\frac{2}{e}$",
      "$3e - \\frac{3}{e}$"
    ],
    "answer": "①",
    "solution": "정적분의 선형성에 의해 주어진 적분을 세 항으로 분리한다.\n$\\int_{-1}^1\\left(e^x-x\\sqrt{x^2+3}-\\sin\\pi x\\right)dx=\\int_{-1}^1e^x dx-\\int_{-1}^1x\\sqrt{x^2+3}dx-\\int_{-1}^1\\sin\\pi x\\,dx$\n$g_1(x)=x\\sqrt{x^2+3}$이면 $g_1(-x)=(-x)\\sqrt{(-x)^2+3}=-x\\sqrt{x^2+3}=-g_1(x)$이므로 기함수이다.\n$g_2(x)=\\sin\\pi x$이면 $g_2(-x)=\\sin(-\\pi x)=-\\sin\\pi x=-g_2(x)$이므로 기함수이다.\n대칭구간 $[-1,1]$에서 기함수의 정적분은 $0$이므로 $\\int_{-1}^1x\\sqrt{x^2+3}dx=0$, $\\int_{-1}^1\\sin\\pi x\\,dx=0$이다.\n$\\int_{-1}^1e^x dx=\\left[e^x\\right]_{-1}^1=e^1-e^{-1}=e-\\frac{1}{e}$이다.\n따라서 전체 값은 $(e-\\frac{1}{e})-0-0=e-\\frac{1}{e}$이다.\n주의: $e^x$는 우함수도 기함수도 아니므로 대칭성만으로 $0$이라 하면 안 된다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [
      "CC_ODD_EVEN_FUNCTION_INTEGRATION"
    ],
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
    "content": "모든 실수 $x$에서 연속인 함수 $f(x)$가\n$$f(x) + f(-x) = 4\\cos^2 x$$\n를 만족시킬 때, 정적분 $\\int_{-\\frac{\\pi}{2}}^{\\frac{\\pi}{2}} f(x)dx$의 값은?",
    "choices": [
      "$\\frac{\\pi}{2}$",
      "$\\pi$",
      "$\\frac{3\\pi}{2}$",
      "$2\\pi$",
      "$\\frac{5\\pi}{2}$"
    ],
    "answer": "②",
    "solution": "$I=\\int_{-\\pi/2}^{\\pi/2}f(x)dx$라 하자.\n$x=-t$로 치환하면 $dx=-dt$이고, $x=-\\frac{\\pi}{2}$일 때 $t=\\frac{\\pi}{2}$, $x=\\frac{\\pi}{2}$일 때 $t=-\\frac{\\pi}{2}$이다.\n따라서 $I=\\int_{\\pi/2}^{-\\pi/2}f(-t)(-dt)=\\int_{-\\pi/2}^{\\pi/2}f(-t)dt=\\int_{-\\pi/2}^{\\pi/2}f(-x)dx$이다.\n두 식을 변끼리 더하면 $2I=\\int_{-\\pi/2}^{\\pi/2}[f(x)+f(-x)]dx$이다.\n조건 $f(x)+f(-x)=4\\cos^2x$를 대입하면 $2I=\\int_{-\\pi/2}^{\\pi/2}4\\cos^2x\\,dx$이다.\n반각공식 $\\cos^2x=\\frac{1+\\cos2x}{2}$에 의해 $4\\cos^2x=2(1+\\cos2x)$이다.\n우함수의 정적분 성질에 의해 $2I=2\\int_0^{\\pi/2}2(1+\\cos2x)dx=4\\int_0^{\\pi/2}(1+\\cos2x)dx$이다.\n$\\int_0^{\\pi/2}(1+\\cos2x)dx=\\left[x+\\frac{1}{2}\\sin2x\\right]_0^{\\pi/2}=\\frac{\\pi}{2}$이다.\n따라서 $2I=4\\cdot\\frac{\\pi}{2}=2\\pi$이므로 $I=\\pi$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [
      "CC_FUNCTIONAL_EQUATION",
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [
      "COND_UNIVERSAL_INPUTS"
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
    "content": "연속함수 $y=f(x)$의 그래프가 $y$축에 대하여 대칭이고 모든 실수 $a$에 대하여\n$$\\int_{a-2}^{a+2} f(a-x)dx = 36$$\n일 때, 정적분 $\\int_0^2 f(x)dx$의 값은?",
    "choices": [
      "$12$",
      "$15$",
      "$18$",
      "$21$",
      "$24$"
    ],
    "answer": "③",
    "solution": "$t=a-x$로 치환하면 $dt=-dx$이고, $x=a-2$일 때 $t=2$, $x=a+2$일 때 $t=-2$이다.\n따라서 $\\int_{a-2}^{a+2}f(a-x)dx=\\int_2^{-2}f(t)(-dt)=\\int_{-2}^2f(t)dt=36$이다.\n적분변수를 $x$로 바꾸면 $\\int_{-2}^2f(x)dx=36$이다.\n$y=f(x)$의 그래프가 $y$축에 대하여 대칭이므로 $f(-x)=f(x)$, 즉 $f$는 우함수이다.\n우함수의 정적분 성질에 의해 $\\int_{-2}^2f(x)dx=2\\int_0^2f(x)dx$이다.\n$2\\int_0^2f(x)dx=36$에서 $\\int_0^2f(x)dx=18$이다.\n주의: 치환 후 적분구간이 $[2,-2]$로 뒤집히며 생기는 음의 부호를 반드시 반영한다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [
      "CC_FUNCTION_SYMMETRY",
      "CC_ODD_EVEN_FUNCTION_INTEGRATION"
    ],
    "conditionKeys": [
      "COND_UNIVERSAL_INPUTS"
    ],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "실수 전체의 집합에서 미분가능한 함수 $f(x)$가 다음 세 조건을 만족시킨다.\n\n(가) $f(1) = 4$\n(나) 곡선 $y=f(x)$는 원점에 대하여 대칭이다.\n(다) $f'(x)$는 연속함수이다.\n\n정적분 $\\int_{-1}^1 f'(x) \\left( 1 + x^3 \\cos \\pi x + \\tan x \\right) dx$의 값은?",
    "choices": [
      "$2$",
      "$4$",
      "$6$",
      "$8$",
      "$10$"
    ],
    "answer": "④",
    "solution": "조건 (나)에서 그래프가 원점에 대하여 대칭이므로 $f(-x)=-f(x)$이다.\n양변을 $x$에 대하여 미분하면 $-f'(-x)=-f'(x)$, 즉 $f'(-x)=f'(x)$이므로 $f'$는 우함수이다.\n주어진 적분을 세 항으로 나눈다.\n$\\int_{-1}^1f'(x)\\left(1+x^3\\cos\\pi x+\\tan x\\right)dx=\\int_{-1}^1f'(x)dx+\\int_{-1}^1f'(x)x^3\\cos\\pi x\\,dx+\\int_{-1}^1f'(x)\\tan x\\,dx$\n$h_1(x)=f'(x)x^3\\cos\\pi x$이면 $h_1(-x)=f'(-x)(-x)^3\\cos(-\\pi x)=f'(x)(-x^3)\\cos\\pi x=-h_1(x)$이므로 기함수이다.\n$h_2(x)=f'(x)\\tan x$이면 $h_2(-x)=f'(-x)\\tan(-x)=f'(x)(-\\tan x)=-h_2(x)$이므로 기함수이다.\n대칭구간 $[-1,1]$에서 기함수의 정적분은 $0$이므로 둘째 항과 셋째 항의 값은 $0$이다.\n미적분의 기본정리에 의해 $\\int_{-1}^1f'(x)dx=\\left[f(x)\\right]_{-1}^1=f(1)-f(-1)$이다.\n조건 (나)에서 $f(-1)=-f(1)$이고 조건 (가)에서 $f(1)=4$이므로 $f(-1)=-4$이다.\n따라서 $f(1)-f(-1)=4-(-4)=8$이다.\n주의: 원점 대칭인 함수를 미분하면 우함수가 되고, 우함수와 기함수의 곱은 기함수임을 이용한다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [
      "CC_ODD_EVEN_FUNCTION_INTEGRATION",
      "CC_FUNDAMENTAL_THEOREM_OF_CALCULUS"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
