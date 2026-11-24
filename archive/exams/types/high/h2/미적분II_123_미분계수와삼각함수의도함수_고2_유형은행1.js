window.examTitle = "미적분II_123_미분계수와삼각함수의도함수_고2_유형은행1";

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
    "content": "$f(x)=2x\\cos x$일 때 $\\lim_{h\\to0}\\frac{f(3\\pi+2h)-f(3\\pi-2h)}{4h}$는?",
    "choices": [
      "$-4$",
      "$-2$",
      "$0$",
      "$2$",
      "$4$"
    ],
    "answer": "②",
    "solution": "대칭 차분의 정의를 쓰면 $\\lim_{h\\to0}\\frac{f(3\\pi+2h)-f(3\\pi-2h)}{4h}=f'(3\\pi)$이다.\n$f(x)=2x\\cos x$를 곱의 미분법으로 미분하면 $f'(x)=2\\cos x-2x\\sin x$이다.\n$x=3\\pi$에서 $\\cos3\\pi=-1$, $\\sin3\\pi=0$이므로 $f'(3\\pi)=2(-1)-2(3\\pi)(0)=-2$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-074",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT",
      "CC_DIFFERENCE_QUOTIENT_SCALING"
    ],
    "conditionKeys": [],
    "integrationPattern": "REINTERPRETATION"
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
    "content": "$f(x)=x\\sin x+\\cos x$일 때 $\\lim_{h\\to0}\\frac{f(2\\pi+4h)-f(2\\pi+h)}{2h}$는?",
    "choices": [
      "$\\pi$",
      "$2\\pi$",
      "$3\\pi$",
      "$4\\pi$",
      "$5\\pi$"
    ],
    "answer": "③",
    "solution": "$f(2\\pi)$를 빼고 더하면 $\\frac{f(2\\pi+4h)-f(2\\pi)}{2h}-\\frac{f(2\\pi+h)-f(2\\pi)}{2h}$이다.\n각 차분몫의 극한은 $\\frac{4}{2}f'(2\\pi)$와 $\\frac{1}{2}f'(2\\pi)$이므로 전체 극한은 $\\left(2-\\frac12\\right)f'(2\\pi)=\\frac32f'(2\\pi)$이다.\n$f'(x)=\\sin x+x\\cos x-\\sin x=x\\cos x$이다.\n$f'(2\\pi)=2\\pi\\cos2\\pi=2\\pi$이다.\n따라서 극한은 $\\frac32\\cdot2\\pi=3\\pi$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-074",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT",
      "CC_DIFFERENCE_QUOTIENT_SCALING"
    ],
    "conditionKeys": [],
    "integrationPattern": "REINTERPRETATION"
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
    "content": "$f(x)=(2-\\cos x)\\sin x$일 때 $\\lim_{h\\to0}\\frac{f(3\\pi+3h)-f(3\\pi-2h)}{5h}$는?",
    "choices": [
      "$-5$",
      "$-3$",
      "$-1$",
      "$1$",
      "$3$"
    ],
    "answer": "②",
    "solution": "$f(3\\pi)$를 빼고 더하면 분자는 $[f(3\\pi+3h)-f(3\\pi)]-[f(3\\pi-2h)-f(3\\pi)]$이다.\n차분몫의 극한을 적용하면 각각 $3hf'(3\\pi)$, $-2hf'(3\\pi)$에 해당하므로 전체 극한은 $\\frac{3h+2h}{5h}f'(3\\pi)=f'(3\\pi)$이다.\n$f(x)=(2-\\cos x)\\sin x$를 곱의 미분법으로 미분하면 $f'(x)=\\sin^2x+(2-\\cos x)\\cos x$이다.\n$x=3\\pi$에서 $\\sin3\\pi=0$, $\\cos3\\pi=-1$이므로 $f'(3\\pi)=0+(2+1)(-1)=-3$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-074",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT",
      "CC_DIFFERENCE_QUOTIENT_SCALING"
    ],
    "conditionKeys": [],
    "integrationPattern": "REINTERPRETATION"
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
    "content": "$f(x)=\\sin x\\cos x$일 때 $\\lim_{h\\to0}\\frac{f(\\pi/2+2h)-f(\\pi/2-3h)}{h}$는?",
    "choices": [
      "$-5$",
      "$-3$",
      "$-1$",
      "$1$",
      "$3$"
    ],
    "answer": "①",
    "solution": "$f(\\pi/2)$를 빼고 더하면 분자는 $[f(\\pi/2+2h)-f(\\pi/2)]-[f(\\pi/2-3h)-f(\\pi/2)]$이다.\n차분몫의 극한으로부터 각 항은 $2hf'(\\pi/2)$, $-3hf'(\\pi/2)$이므로 전체 극한은 $\\frac{2h+3h}{h}f'(\\pi/2)=5f'(\\pi/2)$이다.\n$f(x)=\\sin x\\cos x=\\frac12\\sin2x$이므로 $f'(x)=\\cos2x$이다.\n$f'(\\pi/2)=\\cos\\pi=-1$이므로 극한은 $5(-1)=-5$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-074",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT",
      "CC_DIFFERENCE_QUOTIENT_SCALING"
    ],
    "conditionKeys": [],
    "integrationPattern": "REINTERPRETATION"
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
    "content": "$f(x)=\\sin x\\cos x$일 때 $\\lim_{h\\to0}\\frac{f(2h+\\pi/2)+f(2h-\\pi/2)}h$는?",
    "choices": [
      "$-4$",
      "$-2$",
      "$0$",
      "$2$",
      "$4$"
    ],
    "answer": "①",
    "solution": "$f(\\pi/2)=0$, $f(-\\pi/2)=0$이므로 분자를 $[f(\\pi/2+2h)-f(\\pi/2)]+[f(-\\pi/2+2h)-f(-\\pi/2)]$로 쓸 수 있다.\n각 차분몫의 극한은 $2hf'(\\pi/2)$와 $2hf'(-\\pi/2)$이므로 전체 극한은 $2[f'(\\pi/2)+f'(-\\pi/2)]$이다.\n$f(x)=\\frac12\\sin2x$에서 $f'(x)=\\cos2x$이다.\n$f'(\\pi/2)=\\cos\\pi=-1$, $f'(-\\pi/2)=\\cos(-\\pi)=-1$이다.\n따라서 극한은 $2(-1-1)=-4$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-074",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT",
      "CC_DIFFERENCE_QUOTIENT_SCALING"
    ],
    "conditionKeys": [],
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
    "content": "$f(x)=(\\sin x-\\cos x)^2$일 때 $\\lim_{h\\to0}\\frac{f(\\pi/2+3h)-1}{h}$는?",
    "choices": [
      "$-6$",
      "$-3$",
      "$0$",
      "$3$",
      "$6$"
    ],
    "answer": "⑤",
    "solution": "$f(\\pi/2)=(\\sin\\frac\\pi2-\\cos\\frac\\pi2)^2=(1-0)^2=1$이므로 주어진 극한은 $\\lim_{h\\to0}\\frac{f(\\pi/2+3h)-f(\\pi/2)}{h}$이다.\n차분몫의 정의에서 이는 $3f'(\\pi/2)$이다.\n$f(x)=(\\sin x-\\cos x)^2=1-\\sin2x$이다.\n$f'(x)=-2\\cos2x$이므로 $f'(\\pi/2)=-2\\cos\\pi=2$이다.\n따라서 극한은 $3\\cdot2=6$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-074",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT",
      "CC_DIFFERENCE_QUOTIENT_SCALING"
    ],
    "conditionKeys": [],
    "integrationPattern": "REINTERPRETATION"
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
    "content": "$f(x)=\\lim_{h\\to0}\\frac{2x\\cos(x+h)-2x\\cos x}{h}$일 때 $f'(\\pi/2)$는?",
    "choices": [
      "$-4$",
      "$-2$",
      "$0$",
      "$2$",
      "$4$"
    ],
    "answer": "②",
    "solution": "$h$에 대한 극한에서 $2x$는 상수이므로 $f(x)=2x\\lim_{h\\to0}\\frac{\\cos(x+h)-\\cos x}{h}$이다.\n이는 $f(x)=2x\\cdot(-\\sin x)=-2x\\sin x$이다.\n곱의 미분법으로 $f'(x)=-2\\sin x-2x\\cos x$이다.\n$x=\\pi/2$에서 $\\sin\\frac\\pi2=1$, $\\cos\\frac\\pi2=0$이므로 $f'(\\pi/2)=-2-0=-2$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-074",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "$f(x)=\\lim_{h\\to0}\\frac{2x\\sin(x+h)-2x\\sin x}{h}$일 때 $f''(2\\pi)$는?",
    "choices": [
      "$-8\\pi$",
      "$-6\\pi$",
      "$-5\\pi$",
      "$-4\\pi$",
      "$-2\\pi$"
    ],
    "answer": "④",
    "solution": "$h$에 대한 극한에서 $2x$는 상수이므로 $f(x)=2x\\lim_{h\\to0}\\frac{\\sin(x+h)-\\sin x}{h}$이다.\n이는 $f(x)=2x\\cos x$이다.\n곱의 미분법으로 $f'(x)=2\\cos x-2x\\sin x$이다.\n다시 미분하면 $f''(x)=-2\\sin x-2\\sin x-2x\\cos x=-4\\sin x-2x\\cos x$이다.\n$x=2\\pi$에서 $\\sin2\\pi=0$, $\\cos2\\pi=1$이므로 $f''(2\\pi)=0-2(2\\pi)(1)=-4\\pi$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-074",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT"
    ],
    "conditionKeys": [],
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
    "content": "$f(x)=\\lim_{h\\to0}\\frac{(x-2h)\\sin(x+h)-x\\cos(\\pi/2-x)}{h}$일 때 $f'(3\\pi/2)$는?",
    "choices": [
      "$-\\pi$",
      "$-\\pi/2$",
      "$0$",
      "$\\pi/2$",
      "$3\\pi/2$"
    ],
    "answer": "⑤",
    "solution": "$\\cos(\\frac\\pi2-x)=\\sin x$이므로 분자는 $(x-2h)\\sin(x+h)-x\\sin x$이다.\n$\\sin(x+h)=\\sin x\\cos h+\\cos x\\sin h$로 전개하면 분자는 $x\\sin x(\\cos h-1)-2h\\sin x\\cos h+x\\cos x\\sin h-2h\\cos x\\sin h$이다.\n$h$로 나누고 $\\frac{\\cos h-1}{h}\\to0$, $\\frac{\\sin h}{h}\\to1$을 적용하면 $f(x)=-2\\sin x+x\\cos x$이다.\n곱의 미분법으로 $f'(x)=-2\\cos x+\\cos x-x\\sin x=-\\cos x-x\\sin x$이다.\n$x=\\frac{3\\pi}{2}$에서 $\\cos\\frac{3\\pi}{2}=0$, $\\sin\\frac{3\\pi}{2}=-1$이므로 $f'(\\frac{3\\pi}{2})=0-\\frac{3\\pi}{2}(-1)=\\frac{3\\pi}{2}$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-074",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT",
      "CC_TRIGONOMETRIC_IDENTITY"
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
    "content": "$f(x)=2\\sin x+a\\cos x$이고 $\\lim_{x\\to\\pi/2}\\frac{f(x)-2}{x-\\pi/2}=-4$일 때 $f(\\pi/4)$는?",
    "choices": [
      "$0$",
      "$\\sqrt2$",
      "$2\\sqrt2$",
      "$3\\sqrt2$",
      "$4\\sqrt2$"
    ],
    "answer": "④",
    "solution": "$f(\\frac\\pi2)=2\\sin\\frac\\pi2+a\\cos\\frac\\pi2=2$이므로 주어진 극한은 $f'(\\frac\\pi2)$이다.\n$f'(x)=2\\cos x-a\\sin x$이므로 $f'(\\frac\\pi2)=2\\cdot0-a\\cdot1=-a$이다.\n$-a=-4$에서 $a=4$이다.\n$f(x)=2\\sin x+4\\cos x$에 $x=\\frac\\pi4$를 대입하면 $f(\\frac\\pi4)=2\\cdot\\frac{\\sqrt2}{2}+4\\cdot\\frac{\\sqrt2}{2}$이다.\n즉 $f(\\frac\\pi4)=\\sqrt2+2\\sqrt2=3\\sqrt2$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-074",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT",
      "CC_CURVE_POINT_COEFFICIENT_SYSTEM"
    ],
    "conditionKeys": [],
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
    "content": "$f(x)=x^2\\sin x+a\\cos x$이고 $\\lim_{x\\to2\\pi}\\frac{f(x)-2}{x-2\\pi}=b$일 때 $ab$는?",
    "choices": [
      "$-8\\pi^2$",
      "$-4\\pi^2$",
      "$8\\pi^2$",
      "$12\\pi^2$",
      "$16\\pi^2$"
    ],
    "answer": "③",
    "solution": "분모가 $0$으로 가고 극한이 유한하므로 분자도 $0$으로 가야 한다.\n$f(2\\pi)=(2\\pi)^2\\sin2\\pi+a\\cos2\\pi=a$이므로 $a-2=0$, 즉 $a=2$이다.\n이때 $b=\\lim_{x\\to2\\pi}\\frac{f(x)-f(2\\pi)}{x-2\\pi}=f'(2\\pi)$이다.\n$f'(x)=2x\\sin x+x^2\\cos x-a\\sin x$이다.\n$f'(2\\pi)=0+4\\pi^2-0=4\\pi^2$이므로 $b=4\\pi^2$이다.\n따라서 $ab=2\\cdot4\\pi^2=8\\pi^2$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-074",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT",
      "CC_CURVE_POINT_COEFFICIENT_SYSTEM"
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
    "content": "$f(x)=3\\sin x+2\\cos x$일 때 $\\lim_{n\\to\\infty}n[f(4/n)-f(0)]$은?",
    "choices": [
      "$4$",
      "$6$",
      "$8$",
      "$10$",
      "$12$"
    ],
    "answer": "⑤",
    "solution": "$h=\\frac4n$으로 두면 $n=\\frac4h$이고 $n\\to\\infty$일 때 $h\\to0$이다.\n따라서 주어진 극한은 $\\lim_{h\\to0}4\\frac{f(h)-f(0)}{h}=4f'(0)$이다.\n$f'(x)=3\\cos x-2\\sin x$이다.\n$f'(0)=3\\cos0-2\\sin0=3$이다.\n따라서 극한은 $4\\cdot3=12$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-074",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT",
      "CC_DIFFERENCE_QUOTIENT_SCALING"
    ],
    "conditionKeys": [],
    "integrationPattern": "REINTERPRETATION"
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
    "content": "$f(x)=\\sin x\\cos x$일 때 $\\lim_{n\\to\\infty}n[f(\\pi/2+2/n)-f(\\pi/2-4/n)]$은?",
    "choices": [
      "$-6$",
      "$-4$",
      "$-2$",
      "$0$",
      "$2$"
    ],
    "answer": "①",
    "solution": "$h=\\frac1n$으로 두면 주어진 식은 $\\lim_{h\\to0}\\frac{f(\\frac\\pi2+2h)-f(\\frac\\pi2-4h)}{h}$이다.\n$f(\\frac\\pi2)=0$이므로 분자를 $[f(\\frac\\pi2+2h)-f(\\frac\\pi2)]-[f(\\frac\\pi2-4h)-f(\\frac\\pi2)]$로 쓸 수 있다.\n각 차분몫의 극한은 $2hf'(\\frac\\pi2)$와 $-4hf'(\\frac\\pi2)$이므로 전체 극한은 $(2+4)f'(\\frac\\pi2)=6f'(\\frac\\pi2)$이다.\n$f(x)=\\frac12\\sin2x$에서 $f'(x)=\\cos2x$이다.\n$f'(\\frac\\pi2)=\\cos\\pi=-1$이다.\n따라서 극한은 $6(-1)=-6$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-074",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT",
      "CC_DIFFERENCE_QUOTIENT_SCALING"
    ],
    "conditionKeys": [],
    "integrationPattern": "REINTERPRETATION"
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
    "content": "$f(x)=(x-\\pi)\\sin x$일 때 $\\lim_{x\\to2\\pi}\\frac{f(x)-f(4\\pi-x)}{x-2\\pi}$는?",
    "choices": [
      "$\\pi$",
      "$2\\pi$",
      "$3\\pi$",
      "$4\\pi$",
      "$5\\pi$"
    ],
    "answer": "②",
    "solution": "$h=x-2\\pi$로 두면 $x=2\\pi+h$이고 $4\\pi-x=2\\pi-h$이다.\n$f(2\\pi)=(2\\pi-\\pi)\\sin2\\pi=0$이므로 주어진 극한은 $\\lim_{h\\to0}\\frac{f(2\\pi+h)-f(2\\pi-h)}{h}$이다.\n분자를 $[f(2\\pi+h)-f(2\\pi)]-[f(2\\pi-h)-f(2\\pi)]$로 나누면 각각 $hf'(2\\pi)$, $-hf'(2\\pi)$에 대응한다.\n따라서 극한은 $f'(2\\pi)-(-f'(2\\pi))=2f'(2\\pi)$이다.\n$f'(x)=\\sin x+(x-\\pi)\\cos x$이다.\n$f'(2\\pi)=0+\\pi\\cdot1=\\pi$이다.\n따라서 극한은 $2\\pi$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-074",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT"
    ],
    "conditionKeys": [],
    "integrationPattern": "REINTERPRETATION"
  },
  {
    "id": 15,
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
    "content": "$f(x)=3\\sin(2x)+x^2\\sin(1/x)$ ($x\\ne0$), $f(0)=0$일 때 $f'(0)$은?",
    "choices": [
      "$2$",
      "$4$",
      "$6$",
      "$8$",
      "$10$"
    ],
    "answer": "③",
    "solution": "미분계수의 정의로 $f'(0)=\\lim_{x\\to0}\\frac{3\\sin2x+x^2\\sin(1/x)-0}{x}$이다.\n분자를 나누면 $f'(0)=\\lim_{x\\to0}\\left(\\frac{3\\sin2x}{x}+x\\sin\\frac1x\\right)$이다.\n$\\lim_{x\\to0}\\frac{\\sin2x}{x}=2$이므로 첫 항의 극한은 $3\\cdot2=6$이다.\n$|x\\sin\\frac1x|\\le|x|$이고 $|x|\\to0$이므로 조임 정리에 의해 둘째 항은 $0$으로 간다.\n따라서 $f'(0)=6+0=6$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-074",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT",
      "CC_DIFFERENTIABILITY"
    ],
    "conditionKeys": [
      "COND_NONZERO"
    ],
    "integrationPattern": "CASE_BRANCH"
  }
];
