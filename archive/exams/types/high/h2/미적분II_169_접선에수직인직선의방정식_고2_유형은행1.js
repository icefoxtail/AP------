window.examTitle = "미적분II_169_접선에수직인직선의방정식_고2_유형은행1";

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
    "content": "$y=2e^x+1$ 위의 점 $(0,3)$을 지나고 그 점에서의 접선과 수직인 직선이 두 좌표축과 둘러싸는 넓이는?",
    "choices": [
      "$9$",
      "$12$",
      "$15$",
      "$18$",
      "$21$"
    ],
    "answer": "①",
    "solution": "$y=2e^x+1$에서 지수함수의 미분법으로 $y'=2e^x$이다.\n점 $(0,3)$에서 접선의 기울기는 $y'(0)=2e^0=2$이다.\n수직인 두 직선의 기울기의 곱은 $-1$이므로 수직인 직선의 기울기는 $-\\frac12$이다.\n점-기울기 공식으로 직선의 방정식은 $y-3=-\\frac12(x-0)$, 즉 $y=3-\\frac x2$이다.\n$y$절편은 $3$이고, $x$절편은 $3-\\frac x2=0$에서 $x=6$이다.\n삼각형의 넓이는 $\\frac12\\cdot6\\cdot3=9$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-083",
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENT_CONSTRUCTION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "$f(x)=\\frac{x}{x+2}$의 도함수를 $\\frac2{g(x)}$라 하자. $(2,\\frac12)$에서의 접선의 기울기를 $a$, 이 접선에 수직이고 그 점을 지나는 직선의 기울기를 $b$ 및 방정식을 $y=h(x)$라 할 때, $g(0)h(2)ab$의 값은?",
    "choices": [
      "$-8$",
      "$-6$",
      "$-4$",
      "$-2$",
      "$0$"
    ],
    "answer": "④",
    "solution": "$f(x)=\\frac{x}{x+2}$에서 몫의 미분법으로 $f'(x)=\\frac{1\\cdot(x+2)-x\\cdot1}{(x+2)^2}=\\frac{2}{(x+2)^2}$이다.\n$f'(x)=\\frac2{g(x)}$와 비교하면 $g(x)=(x+2)^2$이므로 $g(0)=2^2=4$이다.\n$x=2$에서 접선의 기울기는 $a=f'(2)=\\frac{2}{(2+2)^2}=\\frac{2}{16}=\\frac18$이다.\n수직 조건 $ab=-1$에서 $b=-\\frac1a=-8$이다.\n점 $(2,\\frac12)$을 지나므로 $h(x)=\\frac12-8(x-2)$이고 $h(2)=\\frac12$이다.\n따라서 $g(0)h(2)ab=4\\cdot\\frac12\\cdot\\frac18\\cdot(-8)$이다.\n계산하면 $4\\cdot\\frac12=2$, $\\frac18\\cdot(-8)=-1$이므로 곱은 $-2$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-083",
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENT_CONSTRUCTION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION"
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
    "content": "곡선 $y=2x^2\\ln x+2$ 위의 점 $(1,2)$을 지나고 그 점에서의 접선과 수직인 직선이 점 $(-5,a)$를 지날 때, $a$의 값은?",
    "choices": [
      "$3$",
      "$4$",
      "$5$",
      "$6$",
      "$7$"
    ],
    "answer": "③",
    "solution": "$y=2x^2\\ln x+2$에서 곱의 미분법으로 $y'=4x\\ln x+2x^2\\cdot\\frac1x$이다.\n정리하면 $y'=4x\\ln x+2x$이다.\n$x=1$에서 접선의 기울기는 $4\\cdot1\\cdot\\ln1+2\\cdot1=0+2=2$이다.\n수직인 직선의 기울기는 두 기울기의 곱이 $-1$이라는 성질에서 $-\\frac12$이다.\n점 $(1,2)$를 지나므로 $y-2=-\\frac12(x-1)$, 즉 $y=2-\\frac12(x-1)$이다.\n$x=-5$를 대입하면 $a=2-\\frac12(-5-1)=2-\\frac12(-6)$이다.\n계산하면 $a=2+3=5$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-083",
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENT_CONSTRUCTION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION"
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
    "content": "$y=\\log_3(x+1)$의 그래프 위의 점 $(0,0)$에서의 접선에 수직인 직선의 방정식은?",
    "choices": [
      "$y=-(2\\ln3)x$",
      "$y=-(\\ln3)x$",
      "$y=-\\frac{x}{\\ln3}$",
      "$y=\\frac{x}{\\ln3}$",
      "$y=(\\ln3)x$"
    ],
    "answer": "②",
    "solution": "$y=\\log_3(x+1)$을 밑의 변환 공식으로 쓰면 $y=\\frac{\\ln(x+1)}{\\ln3}$이다.\n로그함수의 미분법으로 $y'=\\frac1{(x+1)\\ln3}$이다.\n$x=0$에서 접선의 기울기는 $\\frac1{(0+1)\\ln3}=\\frac1{\\ln3}$이다.\n수직인 직선의 기울기는 $m\\cdot\\frac1{\\ln3}=-1$에서 $m=-\\ln3$이다.\n직선이 원점 $(0,0)$을 지나므로 $y=-(\\ln3)x$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-083",
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENT_CONSTRUCTION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "$P(t,\\cos 2t)$에서 곡선 $y=\\cos 2x$의 접선에 수직인 직선이 $y$축과 만나는 점의 $y$좌표를 $h(t)$라 하자. $0<t<\\frac\\pi2$일 때, $\\lim_{t\\to0+}h(t)$의 값은?",
    "choices": [
      "$\\frac34$",
      "$\\frac78$",
      "$1$",
      "$\\frac98$",
      "$\\frac54$"
    ],
    "answer": "①",
    "solution": "$y=\\cos2x$에서 합성함수의 미분법으로 $y'=-2\\sin2x$이다.\n점 $P(t,\\cos2t)$에서 접선의 기울기는 $-2\\sin2t$이다.\n$0<t<\\frac\\pi2$에서 $\\sin2t>0$이고, 수직인 직선의 기울기는 $(-2\\sin2t)m=-1$에서 $m=\\frac1{2\\sin2t}$이다.\n점-기울기 공식으로 $y-\\cos2t=\\frac1{2\\sin2t}(x-t)$이다.\n$x=0$을 대입하면 $h(t)=\\cos2t-\\frac{t}{2\\sin2t}$이다.\n분수 부분은 $\\frac{t}{2\\sin2t}=\\frac14\\cdot\\frac{2t}{\\sin2t}$로 쓸 수 있다.\n삼각함수의 기본 극한 $\\lim_{u\\to0}\\frac{\\sin u}{u}=1$에서 $\\frac{2t}{\\sin2t}\\to1$이다.\n$\\cos2t\\to1$이므로 $\\lim_{t\\to0+}h(t)=1-\\frac14\\cdot1=\\frac34$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-083",
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENT_CONSTRUCTION",
    "crossConceptKeys": [
      "CC_FUNCTION_LIMIT",
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
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
    "content": "미분가능한 함수 $f$에 대하여 $f(e)=-2e$, $g(x)=f(x)\\ln(x^3)$이다. 두 그래프의 $x=e$에서의 접선이 서로 수직이고 $f'(e)<1$일 때, $6f'(e)$는?",
    "choices": [
      "$6-2\\sqrt6$",
      "$6-\\sqrt6$",
      "$6$",
      "$6+\\sqrt6$",
      "$6+2\\sqrt6$"
    ],
    "answer": "①",
    "solution": "$u=f'(e)$라 놓고 $\\ln(x^3)=3\\ln x$로 변형한다.\n$g(x)=f(x)\\ln(x^3)=3f(x)\\ln x$에서 곱의 미분법으로 $g'(x)=3f'(x)\\ln x+3f(x)\\cdot\\frac1x$이다.\n$x=e$를 대입하면 $g'(e)=3u\\ln e+\\frac{3f(e)}e$이다.\n$\\ln e=1$, $f(e)=-2e$이므로 $g'(e)=3u+\\frac{3(-2e)}e=3u-6$이다.\n두 접선이 수직이므로 $u(3u-6)=-1$이다.\n정리하면 $3u^2-6u+1=0$이다.\n근의 공식으로 $u=\\frac{6\\pm\\sqrt{36-12}}6=\\frac{6\\pm2\\sqrt6}6=1\\pm\\frac{\\sqrt6}3$이다.\n$f'(e)<1$이므로 $u=1-\\frac{\\sqrt6}3$이다.\n따라서 $6f'(e)=6-2\\sqrt6$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-083",
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENT_CONSTRUCTION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
      "COND_UPPER_BOUND"
    ],
    "integrationPattern": "INTERDEPENDENT"
  }
];
