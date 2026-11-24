window.examTitle = "미적분II_122_삼각함수의미분법_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "삼각함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-04",
    "standardUnit": "삼각함수의 미분",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "삼각함수의 미분"
    ],
    "wide": false,
    "content": "곡선 $y=1+4\\cos x$ 위의 점 $(\\frac{7\\pi}{6},1-2\\sqrt3)$에서 접선의 기울기는?",
    "choices": [
      "$-4$",
      "$-2$",
      "$0$",
      "$2$",
      "$4$"
    ],
    "answer": "④",
    "solution": "접선의 기울기는 $x=\\frac{7\\pi}{6}$에서의 미분계수이므로 $y=1+4\\cos x$를 미분한다.\n$y'=-4\\sin x$이다.\n$\\sin\\frac{7\\pi}{6}=-\\frac12$을 대입하면 $y'=-4\\left(-\\frac12\\right)=2$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 1,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-074",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_TANGENT_LINE_SLOPE_AT_POINT"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  },
  {
    "id": 2,
    "category": "삼각함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-04",
    "standardUnit": "삼각함수의 미분",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "삼각함수의 미분"
    ],
    "wide": false,
    "content": "$f(x)=2x\\sin x+2\\cos x$일 때, $f'(4\\pi)$의 값은?",
    "choices": [
      "$0$",
      "$2\\pi$",
      "$4\\pi$",
      "$6\\pi$",
      "$8\\pi$"
    ],
    "answer": "⑤",
    "solution": "곱의 미분법 $(uv)'=u'v+uv'$으로 $f(x)=2x\\sin x+2\\cos x$를 미분한다.\n$f'(x)=2\\sin x+2x\\cos x-2\\sin x$이다.\n동류항을 정리하면 $f'(x)=2x\\cos x$이다.\n$x=4\\pi$에서 $\\cos4\\pi=1$이므로 $f'(4\\pi)=2\\cdot4\\pi\\cdot1=8\\pi$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-074",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  },
  {
    "id": 3,
    "category": "삼각함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-04",
    "standardUnit": "삼각함수의 미분",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "삼각함수의 미분"
    ],
    "wide": false,
    "content": "$f(x)=2\\cos x$에 관한 옳은 설명을 모두 고른 것은?\nㄱ. $\\lim_{h\\to0}\\frac{f(h)-2}{h}=0$\nㄴ. $f'(\\pi/2)=-2$\nㄷ. $f'(x+\\pi/2)=f(x)$",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄱ, ㄴ",
      "ㄱ, ㄷ",
      "ㄴ, ㄷ"
    ],
    "answer": "③",
    "solution": "$f(x)=2\\cos x$를 미분하면 $f'(x)=-2\\sin x$이다.\nㄱ: 미분계수의 정의에 의해 $\\lim_{h\\to0}\\frac{f(h)-f(0)}h=f'(0)$이고 $f(0)=2$이므로 주어진 극한은 $f'(0)=-2\\sin0=0$이다. (참)\nㄴ: $f'\\left(\\frac\\pi2\\right)=-2\\sin\\frac\\pi2=-2\\cdot1=-2$이다. (참)\nㄷ: $f'\\left(x+\\frac\\pi2\\right)=-2\\sin\\left(x+\\frac\\pi2\\right)=-2\\cos x$이고 $f(x)=2\\cos x$이므로 서로 같지 않다. (거짓)\n옳은 것은 ㄱ, ㄴ이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-074",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT",
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  },
  {
    "id": 4,
    "category": "삼각함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-04",
    "standardUnit": "삼각함수의 미분",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "삼각함수의 미분"
    ],
    "wide": false,
    "content": "$f(x)=3\\cos x$의 구간 $[-\\pi, \\pi]$에서의 평균변화율과 $x=a$에서의 미분계수가 같다. $-\\pi<a<\\pi$일 때 $a$는?",
    "choices": [
      "$-\\pi/2$",
      "$-\\pi/4$",
      "$0$",
      "$\\pi/4$",
      "$\\pi/2$"
    ],
    "answer": "③",
    "solution": "평균변화율은 $\\frac{f(\\pi)-f(-\\pi)}{\\pi-(-\\pi)}$이다.\n$f(\\pi)=3\\cos\\pi=-3$, $f(-\\pi)=3\\cos(-\\pi)=-3$이므로 평균변화율은 $\\frac{-3-(-3)}{2\\pi}=0$이다.\n$f'(x)=-3\\sin x$이므로 $x=a$에서의 미분계수는 $-3\\sin a$이다.\n평균변화율과 미분계수가 같다고 하면 $-3\\sin a=0$, 즉 $\\sin a=0$이다.\n$-\\pi<a<\\pi$에서 해는 $a=0$뿐이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-074",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_AVERAGE_RATE_OF_CHANGE",
      "CC_TRIGONOMETRIC_EQUATION"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 5,
    "category": "삼각함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-04",
    "standardUnit": "삼각함수의 미분",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "삼각함수의 미분"
    ],
    "wide": false,
    "content": "$x>0$에서 $f(x)=\\ln(x^{2\\cos x})$이다. $x=2\\pi$에서 접선의 기울기는?",
    "choices": [
      "$\\frac{1}{2\\pi}$",
      "$\\frac{1}{\\pi}$",
      "$\\frac{2}{\\pi}$",
      "$\\frac{3}{\\pi}$",
      "$\\frac{4}{\\pi}$"
    ],
    "answer": "②",
    "solution": "로그의 성질로 $f(x)=\\ln(x^{2\\cos x})=2\\cos x\\ln x$이다.\n곱의 미분법으로 미분하면 $f'(x)=-2\\sin x\\ln x+2\\cos x\\cdot\\frac1x$이다.\n$x=2\\pi$에서 $\\sin2\\pi=0$, $\\cos2\\pi=1$이다.\n대입하면 $f'(2\\pi)=0+2\\cdot1\\cdot\\frac1{2\\pi}=\\frac1\\pi$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-074",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_TANGENT_LINE_SLOPE_AT_POINT"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 6,
    "category": "삼각함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-04",
    "standardUnit": "삼각함수의 미분",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "삼각함수의 미분"
    ],
    "wide": false,
    "content": "$f(x)=(\\sin x+2\\cos x)^2$일 때 $f'(\\pi/2)$는?",
    "choices": [
      "$-4$",
      "$-2$",
      "$0$",
      "$2$",
      "$4$"
    ],
    "answer": "①",
    "solution": "합성함수의 미분법으로 $f(x)=(\\sin x+2\\cos x)^2$을 미분한다.\n$f'(x)=2(\\sin x+2\\cos x)(\\cos x-2\\sin x)$이다.\n$x=\\frac\\pi2$에서 $\\sin\\frac\\pi2=1$, $\\cos\\frac\\pi2=0$이다.\n따라서 두 인수의 값은 $1+0=1$과 $0-2\\cdot1=-2$이다.\n$f'\\left(\\frac\\pi2\\right)=2\\cdot1\\cdot(-2)=-4$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-074",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  },
  {
    "id": 7,
    "category": "삼각함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-04",
    "standardUnit": "삼각함수의 미분",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "삼각함수의 미분"
    ],
    "wide": false,
    "content": "$f(x)=e^{3x}(2\\sin x+\\cos x)$일 때 $f'(0)$은?",
    "choices": [
      "$3$",
      "$4$",
      "$5$",
      "$6$",
      "$7$"
    ],
    "answer": "③",
    "solution": "곱의 미분법으로 $f(x)=e^{3x}(2\\sin x+\\cos x)$를 미분한다.\n$f'(x)=3e^{3x}(2\\sin x+\\cos x)+e^{3x}(2\\cos x-\\sin x)$이다.\n$e^{3x}$로 묶으면 $f'(x)=e^{3x}(6\\sin x+3\\cos x+2\\cos x-\\sin x)$이다.\n동류항을 정리하면 $f'(x)=e^{3x}(5\\sin x+5\\cos x)$이다.\n$x=0$에서 $e^0=1$, $\\sin0=0$, $\\cos0=1$이므로 $f'(0)=1\\cdot5=5$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-074",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  },
  {
    "id": 8,
    "category": "삼각함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-04",
    "standardUnit": "삼각함수의 미분",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "삼각함수의 미분"
    ],
    "wide": false,
    "content": "$f(x)=\\sin x-\\sqrt3\\cos x$이다. $[0,2\\pi]$에서 $f'(x)=0$인 모든 $x$의 합은?",
    "choices": [
      "$\\pi$",
      "$4\\pi/3$",
      "$5\\pi/3$",
      "$2\\pi$",
      "$8\\pi/3$"
    ],
    "answer": "⑤",
    "solution": "$f(x)=\\sin x-\\sqrt3\\cos x$를 미분하면 $f'(x)=\\cos x+\\sqrt3\\sin x$이다.\n삼각함수의 합성으로 $f'(x)=2\\left(\\frac12\\cos x+\\frac{\\sqrt3}{2}\\sin x\\right)=2\\sin\\left(x+\\frac\\pi6\\right)$이다.\n$f'(x)=0$이면 $\\sin\\left(x+\\frac\\pi6\\right)=0$이다.\n일반해는 $x+\\frac\\pi6=n\\pi$ (단, $n$은 정수)이다.\n$0\\le x\\le2\\pi$에서 $\\frac\\pi6\\le x+\\frac\\pi6\\le\\frac{13\\pi}6$이므로 $x+\\frac\\pi6=\\pi,2\\pi$이다.\n따라서 $x=\\frac{5\\pi}6,\\frac{11\\pi}6$이다.\n그 합은 $\\frac{5\\pi}6+\\frac{11\\pi}6=\\frac{16\\pi}6=\\frac{8\\pi}3$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-074",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_ROOT_SOLVING",
      "CC_TRIGONOMETRIC_EQUATION"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 9,
    "category": "삼각함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-04",
    "standardUnit": "삼각함수의 미분",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "삼각함수의 미분"
    ],
    "wide": false,
    "content": "반지름이 $a$ cm인 바퀴가 오른쪽으로 구른다. 처음 바닥과 닿던 테두리 위 점의 회전각이 $x$일 때 수평 변위는 $f(x)=a(x-\\sin x)$ cm이다. $f'(\\pi/2)=10$이면 $f'(2\\pi/3)$은?",
    "choices": [
      "$5$",
      "$10$",
      "$15$",
      "$20$",
      "$25$"
    ],
    "answer": "③",
    "solution": "$f(x)=a(x-\\sin x)$를 미분하면 $f'(x)=a(1-\\cos x)$이다.\n$f'\\left(\\frac\\pi2\\right)=a\\left(1-\\cos\\frac\\pi2\\right)=a(1-0)=a$이다.\n$f'\\left(\\frac\\pi2\\right)=10$이므로 $a=10$이다.\n$f'\\left(\\frac{2\\pi}3\\right)=10\\left(1-\\cos\\frac{2\\pi}3\\right)$이다.\n$\\cos\\frac{2\\pi}3=-\\frac12$이므로 $f'\\left(\\frac{2\\pi}3\\right)=10\\left(1+\\frac12\\right)=15$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-074",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_VELOCITY_FROM_POSITION_DERIVATIVE"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 10,
    "category": "삼각함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-04",
    "standardUnit": "삼각함수의 미분",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "삼각함수의 미분"
    ],
    "wide": false,
    "content": "$f(x)=e^{x/\\sqrt3}\\sin x$이다. $[0,2\\pi]$에서 $f'(x)=0$인 모든 $x$의 합은?",
    "choices": [
      "$2\\pi$",
      "$7\\pi/3$",
      "$5\\pi/2$",
      "$8\\pi/3$",
      "$3\\pi$"
    ],
    "answer": "②",
    "solution": "곱의 미분법과 합성함수의 미분법으로 $f(x)=e^{x/\\sqrt3}\\sin x$를 미분한다.\n$f'(x)=\\frac1{\\sqrt3}e^{x/\\sqrt3}\\sin x+e^{x/\\sqrt3}\\cos x$이다.\n$e^{x/\\sqrt3}$로 묶으면 $f'(x)=e^{x/\\sqrt3}\\left(\\frac1{\\sqrt3}\\sin x+\\cos x\\right)$이다.\n삼각함수의 합성으로 $\\frac1{\\sqrt3}\\sin x+\\cos x=\\frac2{\\sqrt3}\\left(\\frac12\\sin x+\\frac{\\sqrt3}2\\cos x\\right)=\\frac2{\\sqrt3}\\sin\\left(x+\\frac\\pi3\\right)$이다.\n따라서 $f'(x)=\\frac2{\\sqrt3}e^{x/\\sqrt3}\\sin\\left(x+\\frac\\pi3\\right)$이다.\n$f'(x)=0$이면 $\\sin\\left(x+\\frac\\pi3\\right)=0$이고, 일반해는 $x+\\frac\\pi3=n\\pi$이다.\n$0\\le x\\le2\\pi$에서 $x+\\frac\\pi3=\\pi,2\\pi$이므로 $x=\\frac{2\\pi}3,\\frac{5\\pi}3$이다.\n그 합은 $\\frac{2\\pi}3+\\frac{5\\pi}3=\\frac{7\\pi}3$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-074",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_ROOT_SOLVING",
      "CC_TRIGONOMETRIC_EQUATION"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 11,
    "category": "삼각함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-04",
    "standardUnit": "삼각함수의 미분",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "삼각함수의 미분"
    ],
    "wide": false,
    "content": "$f(x)=2\\cos(\\pi/2+x)+\\cos(\\pi+x)$일 때 $f'(\\pi/4)$는?",
    "choices": [
      "$-2\\sqrt2$",
      "$-3\\sqrt2/2$",
      "$-\\sqrt2$",
      "$-\\sqrt2/2$",
      "$0$"
    ],
    "answer": "④",
    "solution": "삼각함수의 성질 $\\cos\\left(\\frac\\pi2+x\\right)=-\\sin x$, $\\cos(\\pi+x)=-\\cos x$로 식을 정리한다.\n$f(x)=2(-\\sin x)+(-\\cos x)=-2\\sin x-\\cos x$이다.\n미분하면 $f'(x)=-2\\cos x+\\sin x$이다.\n$x=\\frac\\pi4$에서 $\\sin\\frac\\pi4=\\cos\\frac\\pi4=\\frac{\\sqrt2}2$이다.\n$f'\\left(\\frac\\pi4\\right)=-2\\cdot\\frac{\\sqrt2}2+\\frac{\\sqrt2}2=-\\sqrt2+\\frac{\\sqrt2}2=-\\frac{\\sqrt2}2$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-074",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 12,
    "category": "삼각함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-04",
    "standardUnit": "삼각함수의 미분",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "삼각함수의 미분"
    ],
    "wide": false,
    "content": "$f(x)=a\\sin x+b\\cos x$가 $f(\\pi/4)=3\\sqrt2$, $f'(\\pi/4)=\\sqrt2$를 만족한다. $a-b$의 값은?",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "①",
    "solution": "$f\\left(\\frac\\pi4\\right)=a\\sin\\frac\\pi4+b\\cos\\frac\\pi4=\\frac{a+b}{\\sqrt2}$이다.\n$\\frac{a+b}{\\sqrt2}=3\\sqrt2$이므로 $a+b=6$이다.\n$f'(x)=a\\cos x-b\\sin x$이므로 $f'\\left(\\frac\\pi4\\right)=a\\cos\\frac\\pi4-b\\sin\\frac\\pi4=\\frac{a-b}{\\sqrt2}$이다.\n$\\frac{a-b}{\\sqrt2}=\\sqrt2$이므로 $a-b=2$이다.\n두 식을 연립하면 $a=4$, $b=2$이고 주어진 조건을 만족한다.\n따라서 구하는 값은 $2$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-074",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_CURVE_POINT_COEFFICIENT_SYSTEM"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 13,
    "category": "삼각함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-04",
    "standardUnit": "삼각함수의 미분",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "삼각함수의 미분"
    ],
    "wide": false,
    "content": "$f(x)=\\sum_{k=1}^{60} k\\sin(k\\pi+x)$일 때 $f'(0)$은?",
    "choices": [
      "$0$",
      "$30$",
      "$60$",
      "$90$",
      "$120$"
    ],
    "answer": "②",
    "solution": "$f(x)=\\sum_{k=1}^{60}k\\sin(k\\pi+x)$를 항별로 미분한다.\n$f'(x)=\\sum_{k=1}^{60}k\\cos(k\\pi+x)$이다.\n$x=0$을 대입하면 $f'(0)=\\sum_{k=1}^{60}k\\cos(k\\pi)=\\sum_{k=1}^{60}k(-1)^k$이다.\n$k$가 홀수이면 $-k$, 짝수이면 $+k$이므로 짝을 지어 계산한다.\n$(-1+2)+(-3+4)+\\cdots+(-59+60)$이다.\n각 괄호의 값은 $1$이고 괄호는 $30$개이다.\n따라서 $f'(0)=30\\cdot1=30$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-074",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_IDENTITY",
      "CC_SERIES_SUM"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 14,
    "category": "삼각함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-04",
    "standardUnit": "삼각함수의 미분",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "삼각함수의 미분"
    ],
    "wide": false,
    "content": "$f(x)=2\\sin(x+\\alpha)+3\\cos(x+\\alpha)$이고 $f'(\\pi/4)=0$일 때 $\\tan\\alpha$의 값은?",
    "choices": [
      "$-3/5$",
      "$-2/5$",
      "$-1/3$",
      "$-1/4$",
      "$-1/5$"
    ],
    "answer": "⑤",
    "solution": "$f(x)=2\\sin(x+\\alpha)+3\\cos(x+\\alpha)$를 합성함수의 미분법으로 미분한다.\n$f'(x)=2\\cos(x+\\alpha)-3\\sin(x+\\alpha)$이다.\n$f'\\left(\\frac\\pi4\\right)=0$이므로 $2\\cos\\left(\\frac\\pi4+\\alpha\\right)-3\\sin\\left(\\frac\\pi4+\\alpha\\right)=0$이다.\n삼각함수의 덧셈정리로 $\\cos\\left(\\frac\\pi4+\\alpha\\right)=\\frac{\\cos\\alpha-\\sin\\alpha}{\\sqrt2}$, $\\sin\\left(\\frac\\pi4+\\alpha\\right)=\\frac{\\sin\\alpha+\\cos\\alpha}{\\sqrt2}$이다.\n대입하면 $\\frac{2(\\cos\\alpha-\\sin\\alpha)-3(\\sin\\alpha+\\cos\\alpha)}{\\sqrt2}=0$이다.\n분자를 정리하면 $-\\cos\\alpha-5\\sin\\alpha=0$, 즉 $\\cos\\alpha+5\\sin\\alpha=0$이다.\n주의: $\\cos\\alpha=0$이면 $5\\sin\\alpha=\\pm5\\ne0$이므로 $\\cos\\alpha\\ne0$이다.\n양변을 $\\cos\\alpha$로 나누면 $1+5\\tan\\alpha=0$이므로 $\\tan\\alpha=-\\frac15$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-074",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_TANGENT",
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
