window.examTitle = "미적분II_177_함수의증가와감소_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "도함수의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도함수의 활용"
    ],
    "wide": false,
    "content": "$0<x<2\\pi$에서 $f(x)=x+2\\cos x$가 감소하는 최대 열린 구간은?",
    "choices": [
      "$(0,\\pi/6)$",
      "$(0,5\\pi/6)$",
      "$(\\pi/6,\\pi/2)$",
      "$(\\pi/2,5\\pi/6)$",
      "$(\\pi/6,5\\pi/6)$"
    ],
    "answer": "⑤",
    "solution": "코사인 함수의 미분 공식으로 $f'(x)=1-2\\sin x$이다.\n감소 조건은 $f'(x)<0$이므로 $1-2\\sin x<0$, 즉 $\\sin x>\\frac12$이다.\n$0<x<2\\pi$에서 $\\sin x=\\frac12$인 각은 $x=\\frac{\\pi}{6},\\ \\frac{5\\pi}{6}$이다.\n단위원에서 두 각 사이인 $\\frac{\\pi}{6}<x<\\frac{5\\pi}{6}$에서 $\\sin x>\\frac12$임을 확인한다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-085",
    "problemTypeKey": "PT_DERIVATIVE_MONOTONICITY",
    "templateKey": "TPL_MONOTONICITY_DIRECT",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_INEQUALITY"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 2,
    "category": "도함수의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도함수의 활용"
    ],
    "wide": false,
    "content": "$-\\pi<x<\\pi$에서 $f(x)=\\sin x-\\frac{\\sqrt2}{2}x$가 증가하는 최대 열린 구간을 $(\\alpha,\\beta)$라 할 때, $\\alpha+\\beta$는?",
    "choices": [
      "0",
      "$\\pi/4$",
      "$\\pi/2$",
      "$3\\pi/4$",
      "$\\pi$"
    ],
    "answer": "①",
    "solution": "사인 함수의 미분 공식으로 $f'(x)=\\cos x-\\frac{\\sqrt2}{2}$이다.\n증가 조건은 $f'(x)>0$이므로 $\\cos x>\\frac{\\sqrt2}{2}$이다.\n$-\\pi<x<\\pi$에서 $\\cos x=\\frac{\\sqrt2}{2}$인 각은 $x=-\\frac{\\pi}{4},\\ \\frac{\\pi}{4}$이다.\n코사인은 짝함수이고 $[0,\\pi]$에서 감소하므로 해는 $-\\frac{\\pi}{4}<x<\\frac{\\pi}{4}$이다.\n따라서 $\\alpha=-\\frac{\\pi}{4},\\ \\beta=\\frac{\\pi}{4}$이고 $\\alpha+\\beta=-\\frac{\\pi}{4}+\\frac{\\pi}{4}=0$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-085",
    "problemTypeKey": "PT_DERIVATIVE_MONOTONICITY",
    "templateKey": "TPL_MONOTONICITY_DIRECT",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_INEQUALITY"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 3,
    "category": "도함수의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도함수의 활용"
    ],
    "wide": false,
    "content": "$f(x)=(x^2-4x+k)e^x$가 실수 전체에서 증가하도록 하는 실수 $k$의 최솟값은?",
    "choices": [
      "4",
      "5",
      "6",
      "7",
      "8"
    ],
    "answer": "②",
    "solution": "곱의 미분법으로 $f'(x)=\\{2x-4+(x^2-4x+k)\\}e^x=(x^2-2x+k-4)e^x$이다.\n$e^x>0$이므로 $f'(x)$의 부호는 $g(x)=x^2-2x+k-4$의 부호와 같다.\n$g(x)=(x-1)^2+k-5$로 완전제곱식 정리하면 최솟값은 $g(1)=k-5$이다.\n실수 전체에서 증가하려면 모든 $x$에 대해 $g(x)\\ge0$이어야 하므로 $k-5\\ge0$, 즉 $k\\ge5$이다.\n판별식으로 확인하면 $D=4-4(k-4)=20-4k\\le0$에서도 $k\\ge5$를 얻는다.\n$k=5$이면 $g(x)=(x-1)^2$이고 $x=1$에서만 $0$이므로 증가 조건을 만족한다.\n따라서 $k$의 최솟값은 $5$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-085",
    "problemTypeKey": "PT_DERIVATIVE_MONOTONICITY",
    "templateKey": "TPL_MONOTONICITY_DIRECT",
    "crossConceptKeys": [
      "CC_MINIMUM_VALUE_GREATER_THAN_ZERO"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 4,
    "category": "도함수의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도함수의 활용"
    ],
    "wide": false,
    "content": "$f(x)=(x-a)e^{2x^2}$가 실수 전체에서 정의된 일대일함수일 때, 가능한 $2a$의 정수 값의 개수는?",
    "choices": [
      "2",
      "3",
      "4",
      "5",
      "6"
    ],
    "answer": "④",
    "solution": "곱의 미분법과 합성함수의 미분법으로 $f'(x)=e^{2x^2}+(x-a)\\cdot4x\\,e^{2x^2}=(4x^2-4ax+1)e^{2x^2}$이다.\n$e^{2x^2}>0$이므로 모든 $x$에서 $4x^2-4ax+1\\ge0$이어야 한다.\n연속인 일대일함수는 단조이고 $f'(0)=1>0$이므로 증가하는 경우만 가능하다.\n이차식의 판별식으로 $D=(-4a)^2-4\\cdot4\\cdot1=16a^2-16\\le0$이다.\n$16(a^2-1)\\le0$에서 $-1\\le a\\le1$이다.\n이 범위에서는 도함수가 많아야 한 점에서만 $0$이므로 $f$는 실수 전체에서 증가한다.\n$2a$의 범위는 $-2\\le2a\\le2$이고 정수값은 $-2,-1,0,1,2$의 $5$개이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-085",
    "problemTypeKey": "PT_DERIVATIVE_MONOTONICITY",
    "templateKey": "TPL_MONOTONICITY_DIRECT",
    "crossConceptKeys": [
      "CC_ONE_TO_ONE_FUNCTION",
      "CC_QUADRATIC_FUNCTION"
    ],
    "conditionKeys": [
      "COND_FUNCTION_INJECTIVE",
      "COND_INTEGER"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 5,
    "category": "도함수의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도함수의 활용"
    ],
    "wide": false,
    "content": "$f(x)=(ax^2+4)e^x$가 실수 전체에서 증가하도록 하는 실수 $a$의 범위는?",
    "choices": [
      "$0\\le a\\le 4$",
      "$0<a\\le 4$",
      "$0\\le a\\le 8$",
      "$a\\le4$",
      "$a\\ge4$"
    ],
    "answer": "①",
    "solution": "곱의 미분법으로 $f'(x)=2ax\\,e^x+(ax^2+4)e^x=(ax^2+2ax+4)e^x$이다.\n$e^x>0$이므로 $g(x)=ax^2+2ax+4$가 모든 $x$에서 $g(x)\\ge0$이어야 한다.\n(i) $a<0$이면 $g(x)$는 아래로 볼록이고 $|x|\\to\\infty$일 때 $g(x)\\to-\\infty$이므로 조건에 어긋난다.\n(ii) $a=0$이면 $g(x)=4>0$이므로 항상 증가한다.\n(iii) $a>0$이면 위로 볼록이고 판별식 $D=(2a)^2-4\\cdot a\\cdot4=4a^2-16a\\le0$이어야 한다.\n$4a(a-4)\\le0$에서 $0<a\\le4$이다.\n(i)(ii)(iii)을 합치면 $0\\le a\\le4$이다.\n경계 $a=4$에서 $g(x)=4x^2+8x+4=4(x+1)^2$이고 $x=-1$에서만 $0$이므로 증가 조건을 만족한다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-085",
    "problemTypeKey": "PT_DERIVATIVE_MONOTONICITY",
    "templateKey": "TPL_MONOTONICITY_DIRECT",
    "crossConceptKeys": [
      "CC_MINIMUM_VALUE_GREATER_THAN_ZERO"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 6,
    "category": "도함수의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도함수의 활용"
    ],
    "wide": false,
    "content": "$f(x)=ax+\\ln(x^2+9)$가 실수 전체에서 증가하도록 하는 실수 $a$의 범위는?",
    "choices": [
      "$a\\le-1/3$",
      "$a\\ge1/3$",
      "$a\\ge2/3$",
      "$0<a\\le1/3$",
      "$0<a\\le2/3$"
    ],
    "answer": "②",
    "solution": "로그 함수의 미분 공식과 합성함수의 미분법으로 $f'(x)=a+\\frac{2x}{x^2+9}$이다.\n$h(x)=\\frac{2x}{x^2+9}$라 하고 몫의 미분법으로 $h'(x)=\\frac{2(x^2+9)-2x\\cdot2x}{(x^2+9)^2}=\\frac{18-2x^2}{(x^2+9)^2}$이다.\n$h'(x)=0$에서 $x=\\pm3$이고, 부호 변화를 보면 $x=-3$에서 $h$가 최소이다.\n최솟값은 $h(-3)=\\frac{-6}{9+9}=-\\frac13$이다.\n따라서 $f'(x)$의 최솟값은 $a-\\frac13$이다.\n실수 전체에서 증가하려면 모든 $x$에서 $f'(x)\\ge0$이어야 하므로 $a-\\frac13\\ge0$, 즉 $a\\ge\\frac13$이다.\n$a\\ge\\frac13$이면 $f'$는 음이 아니고 $x=-3$에서만 $0$이므로 증가 조건을 만족한다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-085",
    "problemTypeKey": "PT_DERIVATIVE_MONOTONICITY",
    "templateKey": "TPL_MONOTONICITY_DIRECT",
    "crossConceptKeys": [
      "CC_MINIMUM_VALUE_GREATER_THAN_ZERO"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
