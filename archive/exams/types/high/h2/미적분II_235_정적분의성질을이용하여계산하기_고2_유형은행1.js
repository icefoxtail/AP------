window.examTitle = "미적분II_235_정적분의성질을이용하여계산하기_고2_유형은행1";

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
    "content": "정적분 $\\displaystyle\\int_0^1 (e^{2x} + 2)^2 dx - \\int_0^1 (e^{2x} - 2)^2 dx$의 값은?",
    "choices": [
      "$4(e^2 - 1)$",
      "$6(e^2 - 1)$",
      "$8(e^2 - 1)$",
      "$10(e^2 - 1)$",
      "$12(e^2 - 1)$"
    ],
    "answer": "①",
    "solution": "적분구간이 같으므로 정적분의 성질 $\\int_a^b f\\,dx-\\int_a^b g\\,dx=\\int_a^b (f-g)dx$로 하나로 합친다.\n곱셈공식 $(A+B)^2-(A-B)^2=4AB$에 의해 피적분함수는 $(e^{2x}+2)^2-(e^{2x}-2)^2=4\\cdot e^{2x}\\cdot 2=8e^{2x}$이다.\n따라서 주어진 식은 $\\int_0^1 8e^{2x}dx$가 된다.\n지수함수의 부정적분 $\\int e^{kx}dx=\\frac{1}{k}e^{kx}+C$에 의해 $\\int 8e^{2x}dx=4e^{2x}$이다.\n위끝과 아래끝을 대입하면 $\\left[4e^{2x}\\right]_0^1=4e^2-4e^0=4e^2-4=4(e^2-1)$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "정적분 $\\displaystyle\\int_0^{\\ln 3} \\frac{e^{2x}}{e^x + 1} dx + \\int_{\\ln 3}^0 \\frac{1}{e^t + 1} dt$의 값은?",
    "choices": [
      "$\\ln 3 - 2$",
      "$\\ln 3 - 1$",
      "$2 - \\ln 3$",
      "$1 + \\ln 3$",
      "$2 + \\ln 3$"
    ],
    "answer": "③",
    "solution": "적분변수는 문자에 무관하므로 둘째 적분의 $t$를 $x$로 바꾼다.\n정적분의 성질 $\\int_b^a f\\,dx=-\\int_a^b f\\,dx$에 의해 $\\int_{\\ln 3}^0\\frac{1}{e^x+1}dx=-\\int_0^{\\ln 3}\\frac{1}{e^x+1}dx$이다.\n구간이 $[0,\\ln 3]$으로 같으므로 합치면 $\\int_0^{\\ln 3}\\frac{e^{2x}-1}{e^x+1}dx$이다.\n인수분해 $e^{2x}-1=(e^x-1)(e^x+1)$로 약분하면 피적분함수는 $e^x-1$이다.\n부정적분 $\\int(e^x-1)dx=e^x-x$이다.\n$\\left[e^x-x\\right]_0^{\\ln 3}=(3-\\ln 3)-(1-0)=2-\\ln 3$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
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
    "content": "정적분 $\\displaystyle\\int_1^3 \\frac{3x+1}{x^2+2x} dx - \\int_1^3 \\frac{3x-1}{x^2+2x} dx$의 값은?",
    "choices": [
      "$\\ln \\frac{6}{5}$",
      "$\\ln \\frac{3}{2}$",
      "$\\ln \\frac{9}{5}$",
      "$\\ln 2$",
      "$\\ln \\frac{9}{4}$"
    ],
    "answer": "③",
    "solution": "구간이 $[1,3]$으로 같으므로 $\\int_1^3\\frac{(3x+1)-(3x-1)}{x^2+2x}dx$로 합친다.\n분자를 정리하면 $(3x+1)-(3x-1)=2$이므로 $\\int_1^3\\frac{2}{x(x+2)}dx$이다.\n부분분수 분해 $\\frac{2}{x(x+2)}=\\frac{1}{x}-\\frac{1}{x+2}$를 적용한다.\n부정적분은 $\\ln|x|-\\ln|x+2|=\\ln\\left|\\frac{x}{x+2}\\right|$이다.\n$\\left[\\ln\\frac{x}{x+2}\\right]_1^3=\\ln\\frac{3}{5}-\\ln\\frac{1}{3}=\\ln\\left(\\frac{3}{5}\\cdot 3\\right)=\\ln\\frac{9}{5}$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [
      "CC_RATIONAL_FUNCTION"
    ],
    "conditionKeys": [],
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
    "content": "정적분 $\\displaystyle\\int_0^{\\frac{\\pi}{4}} (2x + 6 + 2\\tan^2 x) dx - \\int_0^{\\frac{\\pi}{4}} (2y - 6 - 2\\tan^2 y) dy$의 값은?",
    "choices": [
      "$4 - 2\\pi$",
      "$4 - \\pi$",
      "$4$",
      "$4 + \\pi$",
      "$4 + 2\\pi$"
    ],
    "answer": "⑤",
    "solution": "적분변수에 무관하므로 둘째 적분의 $y$를 $x$로 통일한다.\n둘째 적분은 $\\int_0^{\\pi/4}(2x-6-2\\tan^2x)dx$와 같다.\n구간이 $[0,\\pi/4]$로 같으므로 합치면 $\\int_0^{\\pi/4}\\{(2x+6+2\\tan^2x)-(2x-6-2\\tan^2x)\\}dx$이다.\n동류항을 정리하면 $12+4\\tan^2x$이다.\n삼각함수의 관계식 $1+\\tan^2x=\\sec^2x$에 의해 $12+4\\tan^2x=8+4\\sec^2x$이다.\n부정적분 $\\int(8+4\\sec^2x)dx=8x+4\\tan x$이다.\n$\\left[8x+4\\tan x\\right]_0^{\\pi/4}=\\left(2\\pi+4\\cdot 1\\right)-(0+0)=4+2\\pi$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [],
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
    "content": "정적분 $\\displaystyle\\int_1^{e^5} \\ln x dx - \\int_2^{e^5} \\ln x dx + \\int_2^{e^4} \\ln x dx$의 값은?",
    "choices": [
      "$3e^4 - 2$",
      "$3e^4 - 1$",
      "$3e^4$",
      "$3e^4 + 1$",
      "$3e^4 + 2$"
    ],
    "answer": "④",
    "solution": "정적분의 성질 $\\int_b^a f\\,dx=-\\int_a^b f\\,dx$에 의해 $-\\int_2^{e^5}\\ln x\\,dx=\\int_{e^5}^2\\ln x\\,dx$이다.\n구간 연결 $\\int_1^{e^5}+\\int_{e^5}^2=\\int_1^2$에 의해 앞의 두 항은 $\\int_1^2\\ln x\\,dx$이다.\n다시 구간 연결 $\\int_1^2+\\int_2^{e^4}=\\int_1^{e^4}$이다.\n부분적분 $\\int\\ln x\\,dx=x\\ln x-\\int x\\cdot\\frac{1}{x}dx=x\\ln x-x$이다.\n$\\left[x\\ln x-x\\right]_1^{e^4}=(4e^4-e^4)-(0-1)=3e^4+1$이다.\n주의: 아래끝 대입값 $1\\ln 1-1=-1$의 부호를 놓치지 않는다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [
      "CC_INTEGRATION_BY_PARTS_OR_EXPANSION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "정적분 $\\displaystyle\\int_0^{\\frac{\\pi}{2}} \\frac{\\sin x}{1+2\\cos x} dx - \\int_{\\frac{\\pi}{2}}^0 \\frac{3\\sin x}{1+2\\cos x} dx$의 값은?",
    "choices": [
      "$\\ln 3$",
      "$2\\ln 3$",
      "$3\\ln 3$",
      "$4\\ln 3$",
      "$5\\ln 3$"
    ],
    "answer": "②",
    "solution": "정적분의 성질에 의해 $-\\int_{\\pi/2}^0\\frac{3\\sin x}{1+2\\cos x}dx=\\int_0^{\\pi/2}\\frac{3\\sin x}{1+2\\cos x}dx$이다.\n구간이 같으므로 합치면 $\\int_0^{\\pi/2}\\frac{4\\sin x}{1+2\\cos x}dx$이다.\n$(1+2\\cos x)'=-2\\sin x$이므로 $4\\sin x=-2(1+2\\cos x)'$이다.\n따라서 적분은 $-2\\int_0^{\\pi/2}\\frac{(1+2\\cos x)'}{1+2\\cos x}dx$로 쓸 수 있다.\n치환적분 $\\int\\frac{g'}{g}dx=\\ln|g|+C$에 의해 $\\left[-2\\ln(1+2\\cos x)\\right]_0^{\\pi/2}$이다.\n$-2\\ln(1+0)+2\\ln(1+2)=-2\\ln 1+2\\ln 3=2\\ln 3$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
