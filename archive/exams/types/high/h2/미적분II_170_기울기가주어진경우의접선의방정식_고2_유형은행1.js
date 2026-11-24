window.examTitle = "미적분II_170_기울기가주어진경우의접선의방정식_고2_유형은행1";

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
    "content": "곡선 $y=\\frac2{3-x}$에 접하고 기울기가 $2$인 두 직선의 $y$절편의 합은?",
    "choices": [
      "$-18$",
      "$-16$",
      "$-14$",
      "$-12$",
      "$-10$"
    ],
    "answer": "④",
    "solution": "곡선 $y=\\frac2{3-x}=2(3-x)^{-1}$의 도함수를 합성함수의 미분법으로 구하면 $y'=2\\cdot(-1)(3-x)^{-2}\\cdot(-1)=\\frac2{(3-x)^2}$이다.\n접선의 기울기가 $2$이므로 $\\frac2{(3-x)^2}=2$에서 $(3-x)^2=1$, 즉 $3-x=\\pm1$이므로 $x=2$ 또는 $x=4$이다.\n(i) $x=2$일 때 접점은 $\\left(2,\\frac2{1}\\right)=(2,2)$이고, 접선은 $y-2=2(x-2)$, 즉 $y=2x-2$이므로 $y$절편은 $-2$이다.\n(ii) $x=4$일 때 접점은 $\\left(4,\\frac2{-1}\\right)=(4,-2)$이고, 접선은 $y+2=2(x-4)$, 즉 $y=2x-10$이므로 $y$절편은 $-10$이다.\n두 $y$절편의 합은 $-2+(-10)=-12$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-083",
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENT_CONSTRUCTION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_ROOT_SOLVING"
    ],
    "conditionKeys": [],
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
    "content": "곡선 $y=2x\\ln x+x$에 접하고 기울기가 $5$인 직선의 $y$절편은?",
    "choices": [
      "$-2e$",
      "$-e$",
      "$0$",
      "$e$",
      "$2e$"
    ],
    "answer": "①",
    "solution": "곱의 미분법으로 $y'=2\\ln x+2x\\cdot\\frac1x+1=2\\ln x+2+1=2\\ln x+3$이다.\n기울기가 $5$이므로 $2\\ln x+3=5$에서 $2\\ln x=2$, 즉 $\\ln x=1$이므로 $x=e$이다.\n접점의 $y$좌표는 $2e\\ln e+e=2e\\cdot1+e=3e$이다.\n점 $(e,3e)$에서 기울기 $5$인 접선은 $y-3e=5(x-e)=5x-5e$이므로 $y=5x-2e$이다.\n따라서 $y$절편은 $-2e$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-083",
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENT_CONSTRUCTION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_ROOT_SOLVING"
    ],
    "conditionKeys": [],
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
    "content": "곡선 $y=\\ln(x-5)$에 접하고 기울기가 $1$인 직선이 두 좌표축과 이루는 삼각형의 넓이는?",
    "choices": [
      "$8$",
      "$10$",
      "$12$",
      "$16$",
      "$18$"
    ],
    "answer": "⑤",
    "solution": "로그함수의 미분법으로 $y'=\\frac1{x-5}$이다.\n기울기가 $1$이므로 $\\frac1{x-5}=1$에서 $x-5=1$, 즉 $x=6$이다.\n접점의 $y$좌표는 $\\ln(6-5)=\\ln1=0$이다.\n점 $(6,0)$에서 기울기 $1$인 접선은 $y-0=1\\cdot(x-6)$, 즉 $y=x-6$이다.\n이 직선의 $x$절편은 $6$, $y$절편은 $-6$이다.\n두 좌표축과 이루는 삼각형의 넓이는 $\\frac12\\cdot6\\cdot6=18$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-083",
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENT_CONSTRUCTION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_ROOT_SOLVING"
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
    "content": "곡선 $y=2x-2x\\ln x$에 접하고 직선 $x-y+1=0$과 평행한 직선의 $y$절편은?",
    "choices": [
      "$\\frac1{2\\sqrt e}$",
      "$\\frac2{\\sqrt e}$",
      "$2$",
      "$2\\sqrt e$",
      "$2e$"
    ],
    "answer": "②",
    "solution": "직선 $x-y+1=0$을 정리하면 $y=x+1$이므로 기울기는 $1$이다.\n곱의 미분법으로 $y'=2-2\\left(\\ln x+x\\cdot\\frac1x\\right)=2-2(\\ln x+1)=-2\\ln x$이다.\n$-2\\ln x=1$에서 $\\ln x=-\\frac12$, 즉 $x=e^{-1/2}$이다.\n접점의 $y$좌표는 $2e^{-1/2}-2e^{-1/2}\\left(-\\frac12\\right)=2e^{-1/2}+e^{-1/2}=3e^{-1/2}$이다.\n점 $(e^{-1/2},3e^{-1/2})$에서 기울기 $1$인 접선은 $y-3e^{-1/2}=x-e^{-1/2}$이므로 $y=x+2e^{-1/2}$이다.\n따라서 $y$절편은 $2e^{-1/2}=\\frac2{\\sqrt e}$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-083",
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENT_CONSTRUCTION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_ROOT_SOLVING"
    ],
    "conditionKeys": [],
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
    "content": "직선 $y=\\frac13x+2$가 곡선 $y=\\ln x+a$에 접할 때, $a+\\ln 3$의 값은?",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "②",
    "solution": "로그함수 $y=\\ln x+a$의 도함수는 $y'=\\frac1x$이다.\n접선의 기울기가 $\\frac13$이므로 $\\frac1x=\\frac13$에서 $x=3$이다.\n직선 $y=\\frac13x+2$에 $x=3$을 대입하면 $y=\\frac33+2=1+2=3$이다.\n곡선 $y=\\ln x+a$에 $x=3$을 대입하면 $y=\\ln3+a$이다.\n접점에서 두 함숫값이 같으므로 $\\ln3+a=3$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-083",
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENT_CONSTRUCTION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_ROOT_SOLVING",
      "CC_CURVE_POINT_COEFFICIENT_SYSTEM"
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
    "content": "직선 $y=3x+a$가 곡선 $y=2x-\\cos x$ $(0\\le x\\le\\pi)$에 접할 때, $a$의 값은?",
    "choices": [
      "$-\\frac{3\\pi}2$",
      "$-\\pi$",
      "$-\\frac\\pi2$",
      "$0$",
      "$\\frac\\pi2$"
    ],
    "answer": "③",
    "solution": "삼각함수의 미분법으로 $y'=2+\\sin x$이다.\n접선의 기울기가 $3$이므로 $2+\\sin x=3$에서 $\\sin x=1$이다.\n$0\\le x\\le\\pi$에서 $\\sin x=1$인 $x$는 $x=\\frac\\pi2$뿐이다.\n접점의 $y$좌표는 $2\\cdot\\frac\\pi2-\\cos\\frac\\pi2=\\pi-0=\\pi$이다.\n직선 $y=3x+a$에 $x=\\frac\\pi2$, $y=\\pi$를 대입하면 $\\pi=\\frac{3\\pi}2+a$이다.\n따라서 $a=\\pi-\\frac{3\\pi}2=-\\frac\\pi2$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-083",
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENT_CONSTRUCTION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_ROOT_SOLVING"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 7,
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
    "content": "직선 $y=x+b$가 곡선 $y=3x\\ln x-ax$의 $x=e$인 점에서 접할 때, $a+b$의 값은?",
    "choices": [
      "$5-6e$",
      "$5-5e$",
      "$5-4e$",
      "$5-3e$",
      "$5-2e$"
    ],
    "answer": "④",
    "solution": "곱의 미분법으로 $y'=3\\ln x+3x\\cdot\\frac1x-a=3\\ln x+3-a$이다.\n$x=e$에서 접선의 기울기가 $1$이므로 $3\\ln e+3-a=3\\cdot1+3-a=6-a=1$에서 $a=5$이다.\n곡선 $y=3x\\ln x-5x$에 $x=e$를 대입하면 $y=3e\\ln e-5e=3e-5e=-2e$이다.\n접점 $(e,-2e)$를 직선 $y=x+b$에 대입하면 $-2e=e+b$이다.\n따라서 $b=-3e$이다.\n$a+b=5-3e$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-083",
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENT_CONSTRUCTION",
    "crossConceptKeys": [
      "CC_CURVE_POINT_COEFFICIENT_SYSTEM",
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 8,
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
    "content": "곡선 $y=2x\\ln x+3$에 접하고 직선 $x+2y-4=0$에 수직인 직선이 $y=ax+b$일 때, $a-b$의 값은?",
    "choices": [
      "$-1$",
      "$0$",
      "$1$",
      "$2$",
      "$3$"
    ],
    "answer": "③",
    "solution": "직선 $x+2y-4=0$을 정리하면 $y=-\\frac12x+2$이므로 기울기는 $-\\frac12$이다.\n수직 조건에서 접선의 기울기는 $-\\frac12$의 역수에 부호를 바꾼 $2$이다.\n곱의 미분법으로 $y'=2\\ln x+2x\\cdot\\frac1x=2\\ln x+2$이다.\n$2\\ln x+2=2$에서 $2\\ln x=0$, 즉 $\\ln x=0$이므로 $x=1$이다.\n접점의 $y$좌표는 $2\\cdot1\\cdot\\ln1+3=0+3=3$이다.\n점 $(1,3)$에서 기울기 $2$인 접선은 $y-3=2(x-1)$, 즉 $y=2x+1$이다.\n따라서 $a=2$, $b=1$이므로 $a-b=2-1=1$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-083",
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENT_CONSTRUCTION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_ROOT_SOLVING"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 9,
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
    "content": "$x>0$에서 미분가능한 $f$가 $\\sqrt{x}\\le f(x)\\le e^x$를 만족한다. $f(4)=2$, $f(1)=e$일 때, $f'(4)+f'(1)$의 값은?",
    "choices": [
      "$e-\\frac12$",
      "$e-\\frac14$",
      "$e+\\frac14$",
      "$e+\\frac12$",
      "$e+1$"
    ],
    "answer": "③",
    "solution": "하한 조건 $\\sqrt x\\le f(x)$에서 $u(x)=f(x)-\\sqrt x$라 두면 $u(x)\\ge0$이다.\n$u(4)=f(4)-\\sqrt4=2-2=0$이므로 $x=4$에서 $u$는 최솟값 $0$을 갖는다.\n$x=4$는 정의역 $x>0$의 내부이므로 페르마의 정리에 의해 $u'(4)=0$이다.\n$u'(x)=f'(x)-\\frac1{2\\sqrt x}$이므로 $f'(4)-\\frac1{2\\sqrt4}=0$, 즉 $f'(4)-\\frac14=0$에서 $f'(4)=\\frac14$이다.\n상한 조건 $f(x)\\le e^x$에서 $v(x)=e^x-f(x)$라 두면 $v(x)\\ge0$이다.\n$v(1)=e^1-f(1)=e-e=0$이므로 $x=1$에서 $v$는 최솟값 $0$을 갖는다.\n$x=1$은 정의역 $x>0$의 내부이므로 페르마의 정리에 의해 $v'(1)=0$이다.\n$v'(x)=e^x-f'(x)$이므로 $v'(1)=e-f'(1)=0$에서 $f'(1)=e$이다.\n따라서 $f'(4)+f'(1)=\\frac14+e=e+\\frac14$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-083",
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENT_CONSTRUCTION",
    "crossConceptKeys": [
      "CC_MINIMUM_VALUE_GREATER_THAN_ZERO",
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "INTERDEPENDENT"
  }
];
