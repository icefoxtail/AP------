window.examTitle = "미적분II_234_여러가지함수의정적분_고2_유형은행1";

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
    "content": "정적분 $\\int_1^3 \\frac{4x-3}{x^2}\\,dx$의 값은?",
    "choices": [
      "$4\\ln 3 - 3$",
      "$4\\ln 3 - 2$",
      "$4\\ln 3 - 1$",
      "$4\\ln 3$",
      "$4\\ln 3 + 1$"
    ],
    "answer": "②",
    "solution": "피적분함수를 항별로 나눈다.\n$\\frac{4x-3}{x^2}=\\frac{4}{x}-\\frac{3}{x^2}$\n부정적분 공식 $\\int\\frac{1}{x}\\,dx=\\ln|x|+C$, $\\int x^{-2}\\,dx=-x^{-1}+C$를 적용한다.\n$\\int\\left(\\frac{4}{x}-3x^{-2}\\right)dx=4\\ln|x|+\\frac{3}{x}+C$\n정적분의 기본정리에 따라 위끝 3과 아래끝 1을 대입한다.\n$\\left[4\\ln x+\\frac{3}{x}\\right]_1^3=(4\\ln3+1)-(0+3)$\n계산하면 $4\\ln3-2$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [
      "CC_RATIONAL_FUNCTION"
    ],
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
    "content": "$0 < a < b$일 때, 정적분 $\\int_a^b \\frac{1}{x}\\,dx$와 항상 그 값이 같은 것은?",
    "choices": [
      "$\\int_1^{\\frac{b}{a}} \\frac{1}{x}\\,dx$",
      "$\\int_1^{b-a} \\frac{1}{x}\\,dx$",
      "$\\int_{\\frac{b}{a}}^1 \\frac{1}{x}\\,dx$",
      "$\\int_a^b \\frac{1}{x^2}\\,dx$",
      "$\\int_a^b \\frac{1}{x+1}\\,dx$"
    ],
    "answer": "①",
    "solution": "로그함수의 부정적분 $\\int\\frac{1}{x}\\,dx=\\ln|x|+C$를 적용한다.\n$\\int_a^b\\frac{1}{x}\\,dx=[\\ln x]_a^b=\\ln b-\\ln a$\n로그의 성질에 따라 $\\ln b-\\ln a=\\ln\\frac{b}{a}$이다.\n보기 ①은 $\\int_1^{b/a}\\frac{1}{x}\\,dx=\\ln\\frac{b}{a}-\\ln1=\\ln\\frac{b}{a}$이므로 주어진 정적분과 같다.\n치환 $x=at$를 쓰면 $dx=a\\,dt$이고 끝점은 $1$에서 $\\frac{b}{a}$이므로 $\\int_a^b\\frac{1}{x}\\,dx=\\int_1^{b/a}\\frac{1}{at}\\cdot a\\,dt=\\int_1^{b/a}\\frac{1}{t}\\,dt$이다.\n주의: $\\ln b-\\ln a\\neq\\ln(b-a)$이므로 ②는 성립하지 않는다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [
      "CC_DEFINITE_INTEGRAL_INTERVAL_ADDITIVITY"
    ],
    "conditionKeys": [
      "COND_INEQUALITY_CONSTRAINT"
    ],
    "integrationPattern": "REINTERPRETATION"
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
    "content": "$\\int_0^2 \\frac{1}{x^2+3x+2}\\,dx = \\ln k$일 때, 양수 $k$의 값은?",
    "choices": [
      "$\\frac{3}{2}$",
      "$\\frac{5}{3}$",
      "$\\frac{7}{4}$",
      "$2$",
      "$\\frac{9}{4}$"
    ],
    "answer": "①",
    "solution": "분모의 이차식을 인수분해한다.\n$x^2+3x+2=(x+1)(x+2)$\n부분분수 분해로 $\\frac{1}{(x+1)(x+2)}=\\frac{1}{x+1}-\\frac{1}{x+2}$이다.\n부정적분은 $\\ln|x+1|-\\ln|x+2|=\\ln\\frac{x+1}{x+2}+C$이다.\n$\\left[\\ln\\frac{x+1}{x+2}\\right]_0^2=\\ln\\frac{3}{4}-\\ln\\frac{1}{2}$\n로그의 성질로 $\\ln\\left(\\frac{3}{4}\\div\\frac{1}{2}\\right)=\\ln\\frac{3}{2}$이다.\n$\\ln k=\\ln\\frac{3}{2}$에서 $k=\\frac{3}{2}$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [
      "CC_RATIONAL_FUNCTION",
      "CC_DEFINITE_INTEGRAL_PARAMETER_SOLVING"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
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
    "content": "양수 $k$에 대하여 정적분 $\\int_0^k 4e^{2x-1}\\,dx = 2(e^5 - e^{-1})$일 때, $k$의 값은?",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "③",
    "solution": "$\\int e^{2x-1}\\,dx=\\frac{1}{2}e^{2x-1}+C$이므로\n$\\int4e^{2x-1}\\,dx=2e^{2x-1}+C$이다.\n정적분의 기본정리로 계산한다.\n$[2e^{2x-1}]_0^k=2e^{2k-1}-2e^{-1}$\n조건과 비교하면 $2(e^{2k-1}-e^{-1})=2(e^5-e^{-1})$이다.\n양변을 2로 나누면 $e^{2k-1}=e^5$이다.\n지수함수는 일대일이므로 $2k-1=5$, 즉 $k=3$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [
      "CC_DEFINITE_INTEGRAL_PARAMETER_SOLVING"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
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
    "content": "정적분 $\\int_0^1 \\frac{27^x - 1}{3^x - 1}\\,dx$의 값은?",
    "choices": [
      "$\\frac{2}{\\ln 3} + 1$",
      "$\\frac{3}{\\ln 3} + 1$",
      "$\\frac{4}{\\ln 3} + 1$",
      "$\\frac{5}{\\ln 3} + 1$",
      "$\\frac{6}{\\ln 3} + 1$"
    ],
    "answer": "⑤",
    "solution": "$27^x=(3^x)^3$이므로 세제곱의 차 공식 $a^3-b^3=(a-b)(a^2+ab+b^2)$을 적용한다.\n$27^x-1=(3^x-1)(9^x+3^x+1)$\n$(3^x-1)\\neq0$인 구간에서 약분하면 피적분함수는 $9^x+3^x+1$이다.\n$\\int9^x\\,dx=\\frac{9^x}{\\ln9}$, $\\int3^x\\,dx=\\frac{3^x}{\\ln3}$이므로\n$\\int(9^x+3^x+1)\\,dx=\\frac{9^x}{2\\ln3}+\\frac{3^x}{\\ln3}+x+C$\n위끝 1을 대입하면 $\\frac{9}{2\\ln3}+\\frac{3}{\\ln3}+1=\\frac{15}{2\\ln3}+1$이다.\n아래끝 0을 대입하면 $\\frac{1}{2\\ln3}+\\frac{1}{\\ln3}=\\frac{3}{2\\ln3}$이다.\n두 값을 빼면 $\\frac{12}{2\\ln3}+1=\\frac{6}{\\ln3}+1$이다.\n따라서 정답은 ⑤이다.",
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
    "content": "자연수 $n$에 대하여 $a_n = \\int_0^n 4^x \\ln 4\\,dx$일 때, 급수 $\\sum_{n=1}^\\infty \\frac{1}{a_n + 1}$의 합은?",
    "choices": [
      "$\\frac{1}{5}$",
      "$\\frac{1}{4}$",
      "$\\frac{1}{3}$",
      "$\\frac{1}{2}$",
      "$\\frac{2}{3}$"
    ],
    "answer": "③",
    "solution": "$\\int a^x\\ln a\\,dx=a^x+C$이므로\n$a_n=[4^x]_0^n=4^n-1$이다.\n따라서 $a_n+1=4^n$이고 $\\frac{1}{a_n+1}=\\frac{1}{4^n}=\\left(\\frac{1}{4}\\right)^n$이다.\n첫째항이 $\\frac{1}{4}$, 공비가 $\\frac{1}{4}$인 등비수열이므로 $|r|<1$에서 수렴한다.\n무한등비급수의 합 $S=\\frac{a}{1-r}$을 적용한다.\n$\\sum_{n=1}^{\\infty}\\left(\\frac{1}{4}\\right)^n=\\frac{\\frac{1}{4}}{1-\\frac{1}{4}}=\\frac{\\frac{1}{4}}{\\frac{3}{4}}=\\frac{1}{3}$\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [
      "CC_SERIES_SUM",
      "CC_GEOMETRIC_SEQUENCE"
    ],
    "conditionKeys": [
      "COND_NATURAL_NUMBER"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 7,
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
    "content": "정적분 $\\int_0^{\\frac{\\pi}{2}} (\\sin x + \\cos x)^2\\,dx$의 값은?",
    "choices": [
      "$\\frac{\\pi}{4} + 1$",
      "$\\frac{\\pi}{2} + 1$",
      "$\\frac{3\\pi}{4} + 1$",
      "$\\pi + 1$",
      "$\\frac{5\\pi}{4} + 1$"
    ],
    "answer": "②",
    "solution": "$(\\sin x+\\cos x)^2=\\sin^2x+2\\sin x\\cos x+\\cos^2x$\n$\\sin^2x+\\cos^2x=1$과 배각공식 $2\\sin x\\cos x=\\sin2x$를 적용하면 피적분함수는 $1+\\sin2x$이다.\n$\\int(1+\\sin2x)\\,dx=x-\\frac{1}{2}\\cos2x+C$\n$\\left[x-\\frac{1}{2}\\cos2x\\right]_0^{\\pi/2}$\n위끝 대입: $\\frac{\\pi}{2}-\\frac{1}{2}\\cos\\pi=\\frac{\\pi}{2}+\\frac{1}{2}$\n아래끝 대입: $0-\\frac{1}{2}\\cos0=-\\frac{1}{2}$\n차는 $\\frac{\\pi}{2}+\\frac{1}{2}-\\left(-\\frac{1}{2}\\right)=\\frac{\\pi}{2}+1$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  },
  {
    "id": 8,
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
    "content": "정적분 $\\int_0^{\\frac{\\pi}{2}} \\frac{\\cos^3 x}{1 + \\sin x}\\,dx$의 값은?",
    "choices": [
      "$\\frac{1}{2}$",
      "$1$",
      "$\\frac{3}{2}$",
      "$2$",
      "$\\frac{5}{2}$"
    ],
    "answer": "①",
    "solution": "$\\cos^3x=\\cos x\\cos^2x=\\cos x(1-\\sin^2x)$\n$1-\\sin^2x=(1-\\sin x)(1+\\sin x)$이므로\n$\\frac{\\cos^3x}{1+\\sin x}=\\cos x(1-\\sin x)=\\cos x-\\sin x\\cos x$\n배각공식 $\\sin x\\cos x=\\frac{1}{2}\\sin2x$를 적용하면 피적분함수는 $\\cos x-\\frac{1}{2}\\sin2x$이다.\n부정적분은 $\\sin x+\\frac{1}{4}\\cos2x+C$이다.\n위끝 $\\frac{\\pi}{2}$: $1+\\frac{1}{4}\\cos\\pi=\\frac{3}{4}$\n아래끝 $0$: $0+\\frac{1}{4}\\cos0=\\frac{1}{4}$\n차는 $\\frac{3}{4}-\\frac{1}{4}=\\frac{1}{2}$이다.\n따라서 정답은 ①이다.",
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
    "integrationPattern": "NONE"
  },
  {
    "id": 9,
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
    "content": "정적분 $\\int_{\\frac{\\pi}{6}}^{\\frac{\\pi}{3}} (\\sec^2 x + \\csc^2 x)\\,dx$의 값은?",
    "choices": [
      "$\\frac{\\sqrt{3}}{3}$",
      "$\\frac{2\\sqrt{3}}{3}$",
      "$\\sqrt{3}$",
      "$\\frac{4\\sqrt{3}}{3}$",
      "$\\frac{5\\sqrt{3}}{3}$"
    ],
    "answer": "④",
    "solution": "$(\\tan x)'=\\sec^2x$, $(-\\cot x)'=\\csc^2x$이므로\n$\\int(\\sec^2x+\\csc^2x)\\,dx=\\tan x-\\cot x+C$\n$[\\tan x-\\cot x]_{\\pi/6}^{\\pi/3}$\n위끝: $\\tan\\frac{\\pi}{3}=\\sqrt3$, $\\cot\\frac{\\pi}{3}=\\frac{\\sqrt3}{3}$이므로 $\\sqrt3-\\frac{\\sqrt3}{3}=\\frac{2\\sqrt3}{3}$\n아래끝: $\\tan\\frac{\\pi}{6}=\\frac{\\sqrt3}{3}$, $\\cot\\frac{\\pi}{6}=\\sqrt3$이므로 $\\frac{\\sqrt3}{3}-\\sqrt3=-\\frac{2\\sqrt3}{3}$\n차는 $\\frac{2\\sqrt3}{3}-\\left(-\\frac{2\\sqrt3}{3}\\right)=\\frac{4\\sqrt3}{3}$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_TANGENT"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  },
  {
    "id": 10,
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
    "content": "정적분 $\\int_0^{\\frac{\\pi}{4}} \\frac{1 + 4x\\cos^2 x}{1 - \\sin^2 x}\\,dx$의 값은?",
    "choices": [
      "$1 + \\frac{\\pi^2}{32}$",
      "$1 + \\frac{\\pi^2}{16}$",
      "$1 + \\frac{\\pi^2}{12}$",
      "$1 + \\frac{\\pi^2}{8}$",
      "$1 + \\frac{\\pi^2}{4}$"
    ],
    "answer": "④",
    "solution": "$1-\\sin^2x=\\cos^2x$이므로 분모를 변형한다.\n$\\frac{1+4x\\cos^2x}{\\cos^2x}=\\sec^2x+4x$\n$(\\tan x)'=\\sec^2x$, $\\int4x\\,dx=2x^2$이므로\n$\\int(\\sec^2x+4x)\\,dx=\\tan x+2x^2+C$\n$[\\tan x+2x^2]_0^{\\pi/4}$\n위끝: $\\tan\\frac{\\pi}{4}+2\\left(\\frac{\\pi}{4}\\right)^2=1+2\\cdot\\frac{\\pi^2}{16}=1+\\frac{\\pi^2}{8}$\n아래끝: $\\tan0+2\\cdot0^2=0$\n차는 $1+\\frac{\\pi^2}{8}$이다.\n따라서 정답은 ④이다.",
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
    "integrationPattern": "NONE"
  },
  {
    "id": 11,
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
    "content": "정적분 $\\int_{\\frac{\\pi}{4}}^{\\frac{\\pi}{3}} \\left(\\tan x - \\frac{1}{x}\\right) dx$의 값은?",
    "choices": [
      "$\\ln 3 - \\frac{3}{2}\\ln 2$",
      "$\\ln 3 - \\ln 2$",
      "$\\ln 3 - \\frac{1}{2}\\ln 2$",
      "$\\ln 3$",
      "$\\ln 3 + \\frac{1}{2}\\ln 2$"
    ],
    "answer": "①",
    "solution": "$\\tan x=\\frac{\\sin x}{\\cos x}$이고 $(\\cos x)'=-\\sin x$이므로 치환적분법으로\n$\\int\\tan x\\,dx=-\\ln|\\cos x|+C$\n$\\int\\frac{1}{x}\\,dx=\\ln|x|+C$이므로\n$\\int\\left(\\tan x-\\frac{1}{x}\\right)dx=-\\ln|\\cos x|-\\ln|x|=-\\ln|x\\cos x|+C$\n$[-\\ln|x\\cos x|]_{\\pi/4}^{\\pi/3}$\n위끝: $-\\ln\\left(\\frac{\\pi}{3}\\cdot\\frac{1}{2}\\right)=-\\ln\\frac{\\pi}{6}$\n아래끝: $-\\ln\\left(\\frac{\\pi}{4}\\cdot\\frac{\\sqrt2}{2}\\right)=-\\ln\\frac{\\sqrt2\\pi}{8}$\n차: $\\ln\\frac{\\sqrt2\\pi}{8}-\\ln\\frac{\\pi}{6}=\\ln\\left(\\frac{\\sqrt2\\pi}{8}\\cdot\\frac{6}{\\pi}\\right)=\\ln\\frac{3\\sqrt2}{4}$\n$\\ln\\frac{3\\sqrt2}{4}=\\ln3+\\frac{1}{2}\\ln2-2\\ln2=\\ln3-\\frac{3}{2}\\ln2$\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_TANGENT"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  }
];
