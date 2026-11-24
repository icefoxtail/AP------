window.examTitle = "미적분II_226_삼각함수의치환적분법_고2_유형은행1";

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
    "content": "$f(x)=\\int (2-\\sin^2 x)\\sin 2x\\,dx$이고 $f(0)=1$일 때, $f(\\frac{\\pi}{6})$의 값은?",
    "choices": [
      "$\\frac{47}{32}$",
      "$\\frac32$",
      "$\\frac{49}{32}$",
      "$\\frac{25}{16}$",
      "$\\frac{51}{32}$"
    ],
    "answer": "①",
    "solution": "사인의 배각 공식 $\\sin 2x=2\\sin x\\cos x$로 피적분함수를 정리한다.\n$t=\\sin^2x$로 놓으면 $dt=2\\sin x\\cos x\\,dx=\\sin 2x\\,dx$이다.\n치환적분하면 $f(x)=\\int(2-t)\\,dt=2t-\\frac{t^2}{2}+C$이다.\n$x=0$일 때 $t=0$이므로 $f(0)=C=1$이다.\n$x=\\frac{\\pi}{6}$일 때 $t=\\left(\\frac12\\right)^2=\\frac14$이므로 $f\\left(\\frac{\\pi}{6}\\right)=2\\cdot\\frac14-\\frac12\\cdot\\frac1{16}+1=\\frac12-\\frac1{32}+1=\\frac{47}{32}$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-097",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_INDEFINITE",
    "crossConceptKeys": [
      "CC_INDEFINITE_INTEGRAL",
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [
      "COND_FUNCTION_VALUE_CONSTRAINT"
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
    "content": "$-\\frac{\\pi}{2}<x<\\frac{\\pi}{2}$에서 $f(x)=\\int\\frac{\\cos^3 x}{1+\\sin x}\\,dx$이고 $f(0)=1$일 때, $f(\\frac{\\pi}{6})$의 값은?",
    "choices": [
      "$\\frac54$",
      "$\\frac{11}{8}$",
      "$\\frac32$",
      "$\\frac{13}{8}$",
      "$\\frac74$"
    ],
    "answer": "②",
    "solution": "$\\cos^2x=1-\\sin^2x=(1-\\sin x)(1+\\sin x)$이므로 $\\cos^3x=\\cos x(1-\\sin x)(1+\\sin x)$이다.\n주어진 구간에서 $1+\\sin x\\neq0$이므로 약분하면 $\\frac{\\cos^3x}{1+\\sin x}=(1-\\sin x)\\cos x$이다.\n$t=\\sin x$로 놓으면 $dt=\\cos x\\,dx$이므로 $f(x)=\\int(1-t)\\,dt=t-\\frac{t^2}{2}+C$이다.\n$x=0$일 때 $t=0$이므로 $f(0)=C=1$이다.\n$x=\\frac{\\pi}{6}$일 때 $t=\\frac12$이므로 $f\\left(\\frac{\\pi}{6}\\right)=\\frac12-\\frac12\\cdot\\frac14+1=\\frac12-\\frac18+1=\\frac{11}{8}$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-097",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_INDEFINITE",
    "crossConceptKeys": [
      "CC_INDEFINITE_INTEGRAL",
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL",
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
    "content": "$-\\frac{\\pi}{2}<x<\\frac{\\pi}{2}$에서 $f(x)=\\int 3\\tan^2 x\\sec^2 x\\,dx$이고 $f(0)=-2$일 때, $f(\\frac{\\pi}{4})$의 값은?",
    "choices": [
      "$-3$",
      "$-2$",
      "$-1$",
      "$0$",
      "$1$"
    ],
    "answer": "③",
    "solution": "$t=\\tan x$로 놓으면 $(\\tan x)'=\\sec^2x$이므로 $dt=\\sec^2x\\,dx$이다.\n치환적분하면 $f(x)=\\int3t^2\\,dt=t^3+C=\\tan^3x+C$이다.\n$f(0)=-2$에서 $0^3+C=-2$이므로 $C=-2$이다.\n$\\tan\\frac{\\pi}{4}=1$이므로 $f\\left(\\frac{\\pi}{4}\\right)=1^3-2=-1$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-097",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_INDEFINITE",
    "crossConceptKeys": [
      "CC_INDEFINITE_INTEGRAL",
      "CC_TRIGONOMETRIC_TANGENT"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL",
      "COND_FUNCTION_VALUE_CONSTRAINT"
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
    "content": "$f(x)=\\int\\sin^3 x\\,dx$이고 $f(\\frac{\\pi}{2})=1$일 때, $f(0)$의 값은?",
    "choices": [
      "$\\frac16$",
      "$\\frac13$",
      "$\\frac12$",
      "$\\frac23$",
      "$\\frac56$"
    ],
    "answer": "②",
    "solution": "$\\sin^3x=\\sin x(1-\\cos^2x)$이다.\n$t=\\cos x$로 놓으면 $dt=-\\sin x\\,dx$이므로 $f(x)=-\\int(1-t^2)\\,dt=-t+\\frac{t^3}{3}+C$이다.\n$x=\\frac{\\pi}{2}$일 때 $t=0$이므로 $f\\left(\\frac{\\pi}{2}\\right)=0+0+C=1$이다.\n$x=0$일 때 $t=1$이므로 $f(0)=-1+\\frac13+1=\\frac13$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-097",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_INDEFINITE",
    "crossConceptKeys": [
      "CC_INDEFINITE_INTEGRAL",
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [
      "COND_FUNCTION_VALUE_CONSTRAINT"
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
    "content": "$f'(x)=2\\sin^5 x\\cos^3 x$이고 $f(x)=a\\sin^8 x+b\\sin^6 x+C$일 때, $8a-6b$의 값은? (단, $C$는 적분상수이다.)",
    "choices": [
      "$-8$",
      "$-6$",
      "$-5$",
      "$-4$",
      "$-2$"
    ],
    "answer": "④",
    "solution": "$\\cos^2x=1-\\sin^2x$이므로 $2\\sin^5x\\cos^3x=2\\sin^5x(1-\\sin^2x)\\cos x$이다.\n$t=\\sin x$로 놓으면 $dt=\\cos x\\,dx$이므로 $f(x)=2\\int(t^5-t^7)\\,dt$이다.\n거듭제곱 적분법으로 $f(x)=2\\left(\\frac{t^6}{6}-\\frac{t^8}{8}\\right)+C=\\frac{t^6}{3}-\\frac{t^8}{4}+C$이다.\n$t=\\sin x$를 되돌리면 $f(x)=\\frac13\\sin^6x-\\frac14\\sin^8x+C$이다.\n계수를 비교하면 $a=-\\frac14$, $b=\\frac13$이다.\n$8a-6b=8\\left(-\\frac14\\right)-6\\cdot\\frac13=-2-2=-4$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-097",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_INDEFINITE",
    "crossConceptKeys": [
      "CC_INDEFINITE_INTEGRAL",
      "CC_TRIGONOMETRIC_IDENTITY"
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
    "content": "$-\\frac{\\pi}{2}<x<\\frac{\\pi}{2}$에서 $f'(x)=\\sec^4 x$이고 $f(0)=2$일 때, $f(\\frac{\\pi}{4})$의 값은?",
    "choices": [
      "$\\frac{10}{3}$",
      "$\\frac{11}{3}$",
      "$\\frac{13}{3}$",
      "$\\frac{14}{3}$",
      "$\\frac{16}{3}$"
    ],
    "answer": "①",
    "solution": "$\\sec^2x=1+\\tan^2x$이므로 $\\sec^4x=(1+\\tan^2x)\\sec^2x$이다.\n$t=\\tan x$로 놓으면 $dt=\\sec^2x\\,dx$이므로 $f(x)=\\int(1+t^2)\\,dt=t+\\frac{t^3}{3}+C$이다.\n$f(0)=2$에서 $0+0+C=2$이므로 $C=2$이다.\n$\\tan\\frac{\\pi}{4}=1$이므로 $f\\left(\\frac{\\pi}{4}\\right)=1+\\frac13+2=\\frac{10}{3}$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-097",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_INDEFINITE",
    "crossConceptKeys": [
      "CC_INDEFINITE_INTEGRAL",
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL",
      "COND_FUNCTION_VALUE_CONSTRAINT"
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
    "content": "$-\\frac{\\pi}{2}<x<\\frac{\\pi}{2}$에서 미분가능한 함수 $f$가 $\\lim_{h\\to0}\\frac{f(x+3h)-f(x)}{h}=\\tan^2 x+\\tan^4 x$, $f(\\frac{\\pi}{4})=\\frac49$를 만족한다. 다음 풀이에서 상자 안에 들어갈 수와 식을 각각 $a,g(x),b,c,H(x)$라 할 때, $abc\\,g(\\frac{\\pi}{4})H(0)$의 값은?\n$\\displaystyle\\lim_{h\\to0}\\frac{f(x+3h)-f(x)}h=\\boxed{\\text{가}}\\,f'(x)$\n$\\displaystyle f(x)=\\frac1a\\int\\tan^2 x\\,\\boxed{\\text{나}}\\,dx=\\boxed{\\text{다}}\\tan^3 x+C$\n$\\displaystyle C=\\boxed{\\text{라}},\\qquad f(x)=\\boxed{\\text{마}}$",
    "choices": [
      "$\\frac{2}{243}$",
      "$\\frac{1}{81}$",
      "$\\frac{4}{243}$",
      "$\\frac{5}{243}$",
      "$\\frac{2}{27}$"
    ],
    "answer": "⑤",
    "solution": "미분계수의 정의에서 $k=3h$로 놓으면 $\\lim_{h\\to0}\\frac{f(x+3h)-f(x)}{h}=3\\lim_{k\\to0}\\frac{f(x+k)-f(x)}{k}=3f'(x)$이므로 $a=3$이다.\n$3f'(x)=\\tan^2x+\\tan^4x$에서 $f'(x)=\\frac13(\\tan^2x+\\tan^4x)=\\frac13\\tan^2x(1+\\tan^2x)$이다.\n$1+\\tan^2x=\\sec^2x$이므로 $g(x)=\\sec^2x$이고 $g\\left(\\frac{\\pi}{4}\\right)=1+1^2=2$이다.\n$t=\\tan x$로 놓으면 $dt=\\sec^2x\\,dx$이므로 $f(x)=\\frac13\\int t^2\\,dt=\\frac13\\cdot\\frac{t^3}{3}+C=\\frac19\\tan^3x+C$이다.\n따라서 $b=\\frac19$이다.\n$f\\left(\\frac{\\pi}{4}\\right)=\\frac49$에서 $\\frac19\\cdot1^3+C=\\frac49$이므로 $C=\\frac49-\\frac19=\\frac13$, 즉 $c=\\frac13$이다.\n$H(x)=\\frac19\\tan^3x+\\frac13$이므로 $H(0)=\\frac13$이다.\n구하는 값은 $abc\\,g\\left(\\frac{\\pi}{4}\\right)H(0)=3\\cdot\\frac19\\cdot\\frac13\\cdot2\\cdot\\frac13$이다.\n$=\\frac{3\\cdot1\\cdot1\\cdot2\\cdot1}{9\\cdot3\\cdot3}=\\frac{6}{81}=\\frac{2}{27}$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-097",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_INDEFINITE",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT",
      "CC_DIFFERENCE_QUOTIENT_SCALING",
      "CC_INDEFINITE_INTEGRAL"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL",
      "COND_FUNCTION_VALUE_CONSTRAINT"
    ],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "$-\\frac{\\pi}{2}<x<\\frac{\\pi}{2}$에서 $f'(x)=\\tan x-2\\tan^2 x+\\tan^3 x-2\\tan^4 x$이고 $f(0)=1$일 때, $f(\\frac{\\pi}{4})$의 값은?",
    "choices": [
      "$\\frac12$",
      "$\\frac23$",
      "$\\frac56$",
      "$1$",
      "$\\frac76$"
    ],
    "answer": "③",
    "solution": "$f'(x)=(\\tan x-2\\tan^2x)+(\\tan^3x-2\\tan^4x)=(\\tan x-2\\tan^2x)(1+\\tan^2x)$이다.\n$1+\\tan^2x=\\sec^2x$이다.\n$t=\\tan x$로 놓으면 $dt=\\sec^2x\\,dx$이므로 $f(x)=\\int(t-2t^2)\\,dt=\\frac12t^2-\\frac23t^3+C$이다.\n$f(0)=1$에서 $0-0+C=1$이므로 $C=1$이다.\n$\\tan\\frac{\\pi}{4}=1$이므로 $f\\left(\\frac{\\pi}{4}\\right)=\\frac12-\\frac23+1=\\frac{3-4+6}{6}=\\frac56$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-097",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_INDEFINITE",
    "crossConceptKeys": [
      "CC_INDEFINITE_INTEGRAL",
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL",
      "COND_FUNCTION_VALUE_CONSTRAINT"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
