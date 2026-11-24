window.examTitle = "미적분II_176_두곡선의공통접선_고2_유형은행1";

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
    "content": "곡선 $y=ax^3$과 곡선 $y=\\ln x$가 서로 접할 때 $a$의 값은?",
    "choices": [
      "$\\frac1{3e}$",
      "$\\frac1{2e}$",
      "$\\frac1e$",
      "$\\frac2e$",
      "$\\frac3e$"
    ],
    "answer": "①",
    "solution": "접점의 $x$좌표를 $t>0$이라 하고 두 곡선의 높이가 같다고 두면 $at^3=\\ln t$이다.\n두 곡선이 접하므로 미분계수가 같고, $(ax^3)'=3ax^2$, $(\\ln x)'=\\frac1x$에서 $3at^2=\\frac1t$이다.\n둘째 식의 양변에 $t$를 곱하면 $3at^3=1$, 즉 $at^3=\\frac13$이다.\n높이 조건 $\\ln t=\\frac13$에서 $t=e^{1/3}$이다.\n$t^3=e$이므로 $a=\\frac1{3t^3}=\\frac1{3e}$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-084",
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENCY_RELATION_GEOMETRY",
    "crossConceptKeys": [
      "CC_TANGENT_LINE_SLOPE_AT_POINT",
      "CC_LOGARITHMIC_FUNCTION_GRAPH"
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
    "content": "$a>1$일 때 $f(x)=2a^x$와 그 역함수 $g(x)=\\log_a(x/2)$의 그래프가 한 점에서 만난다. $a$의 값은?",
    "choices": [
      "$e^{1/(6e)}$",
      "$e^{1/(5e)}$",
      "$e^{1/(4e)}$",
      "$e^{1/(3e)}$",
      "$e^{1/(2e)}$"
    ],
    "answer": "⑤",
    "solution": "역함수 그래프의 교점을 $(x,y)$라 하면 $y=f(x)$이고 $x=f(y)$이다.\n$f(x)=2a^x$는 $a>1$일 때 증가함수이므로 $x<y$이면 $f(x)<f(y)$, 즉 $y<x$가 되어 모순이고 $x>y$도 마찬가지다.\n따라서 $x=y$이고, 교점은 $f(x)=x$의 해이다.\n$x=2a^x$의 양변을 2로 나누고 로그를 취하면 $\\ln(x/2)=x\\ln a$이다.\n$x>0$에서 $H(x)=\\frac{\\ln(x/2)}x$라 두면 몫의 미분법으로 $H'(x)=\\frac{1-\\ln(x/2)}{x^2}$이다.\n$H'(x)>0$은 $\\ln(x/2)<1$, 즉 $0<x<2e$이고 $H'(x)<0$은 $x>2e$이므로 $H$는 $x=2e$에서 최댓값 $H(2e)=\\frac{\\ln e}{2e}=\\frac1{2e}$를 갖는다.\n또한 $H(2)=0$이고 $x\\to\\infty$일 때 $H(x)\\to0$이다.\n$c=\\ln a>0$이라 하면 $0<c<\\frac1{2e}$일 때 $H(x)=c$는 두 해, $c=\\frac1{2e}$일 때 한 해, $c>\\frac1{2e}$일 때 해가 없다.\n그래프가 한 점에서만 만나므로 $c=\\frac1{2e}$이다.\n따라서 $\\ln a=\\frac1{2e}$에서 $a=e^{1/(2e)}$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-084",
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENCY_RELATION_GEOMETRY",
    "crossConceptKeys": [
      "CC_EXPONENTIAL_FUNCTION_GRAPH",
      "CC_LOGARITHMIC_FUNCTION_GRAPH",
      "CC_INVERSE_GRAPH_SYMMETRY"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "INTERDEPENDENT"
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
    "content": "$a>2$일 때 두 곡선 $y=a-2\\sin^2x$와 $y=2\\cos x$가 $0<x<\\pi$에서 한 점에서 만난다. $a$는?",
    "choices": [
      "$\\frac52$",
      "$3$",
      "$\\frac72$",
      "$4$",
      "$\\frac92$"
    ],
    "answer": "①",
    "solution": "두 곡선의 높이가 같다고 두면 $a-2\\sin^2x=2\\cos x$이다.\n$\\sin^2x=1-\\cos^2x$를 대입하면 $a=2\\cos x+2(1-\\cos^2x)$이다.\n$u=\\cos x$라 두면 $0<x<\\pi$에서 $-1<u<1$이고 $a=2+2u-2u^2$이다.\n완전제곱꼴로 정리하면 $a=\\frac52-2\\left(u-\\frac12\\right)^2$이다.\n$0<x<\\pi$에서 $\\cos x$는 일대일이므로 해의 개수는 $u\\in(-1,1)$에서의 해의 개수와 같다.\n(i) $a>\\frac52$이면 우변의 최댓값 $\\frac52$보다 크므로 해가 없다.\n(ii) $2<a<\\frac52$이면 $0<\\frac{5/2-a}{2}<\\frac14$이고 $u=\\frac12\\pm\\sqrt{\\frac{5/2-a}{2}}$가 모두 $(0,1)$에 있어 해가 두 개다.\n(iii) $a=\\frac52$이면 $u=\\frac12$ 하나만 남아 해가 한 개다.\n따라서 한 점에서 만나는 경우는 $a=\\frac52$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-084",
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENCY_RELATION_GEOMETRY",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_IDENTITY",
      "CC_TRIGONOMETRIC_EQUATION"
    ],
    "conditionKeys": [
      "COND_RANGE",
      "COND_RESTRICTED_INTERVAL"
    ],
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
    "content": "곡선 $y=2e^x-2$ 위의 점 $(0,0)$에서의 접선이 곡선 $y=\\ln x+a$에도 접할 때, $a$는?",
    "choices": [
      "$1-\\ln2$",
      "$1$",
      "$1+\\frac12\\ln2$",
      "$1+\\ln2$",
      "$1+2\\ln2$"
    ],
    "answer": "④",
    "solution": "$y=2e^x-2$에서 $y'=2e^x$이므로 $x=0$에서 접선의 기울기는 $2e^0=2$이다.\n접선이 점 $(0,0)$을 지나므로 접선의 방정식은 $y=2x$이다.\n이 직선이 $y=\\ln x+a$에 접하는 접점의 $x$좌표를 $t>0$이라 하면 $\\frac1t=2$에서 $t=\\frac12$이다.\n접점의 높이를 직선과 곡선에서 각각 비교하면 $\\ln\\frac12+a=2\\cdot\\frac12$이다.\n$\\ln\\frac12=-\\ln2$이므로 $-\\ln2+a=1$에서 $a=1+\\ln2$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-084",
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENCY_RELATION_GEOMETRY",
    "crossConceptKeys": [
      "CC_TANGENT_LINE_SLOPE_AT_POINT",
      "CC_LOGARITHMIC_FUNCTION_GRAPH"
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
    "content": "양수 $k$에 대하여 $y=ke^x+1$과 $y=x^2-5x+8$이 점 $P$에서 만나고, 그 점에서 두 곡선의 접선이 서로 수직일 때, $k$는?",
    "choices": [
      "$\\frac1{5e^2}$",
      "$\\frac1{4e^2}$",
      "$\\frac1{3e^2}$",
      "$\\frac1{2e^2}$",
      "$\\frac1{e^2}$"
    ],
    "answer": "⑤",
    "solution": "교점의 $x$좌표를 $t$라 하고 높이를 같다고 두면 $ke^t+1=t^2-5t+8$, 즉 $ke^t=t^2-5t+7$이다.\n$(ke^x+1)'=ke^x$, $(x^2-5x+8)'=2x-5$이므로 두 접선의 기울기는 $ke^t$, $2t-5$이다.\n수직 조건에서 $ke^t(2t-5)=-1$이고, $ke^t=t^2-5t+7$을 대입하면 $(t^2-5t+7)(2t-5)=-1$이다.\n$u=t-2$로 두면 $t^2-5t+7=u^2-u+1$, $2t-5=2u-1$이므로 $(u^2-u+1)(2u-1)=-1$이다.\n전개하면 $2u^3-3u^2+3u-1=-1$이므로 $2u^3-3u^2+3u=0$, 즉 $u(2u^2-3u+3)=0$이다.\n이차식 $2u^2-3u+3$의 판별식은 $D=9-24=-15<0$이어서 실근이 없으므로 $u=0$이다.\n따라서 $t=2$이고, 높이 조건에서 $ke^2=4-10+7=1$이므로 $k=e^{-2}=\\frac1{e^2}$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-084",
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENCY_RELATION_GEOMETRY",
    "crossConceptKeys": [
      "CC_TANGENT_LINE_SLOPE_AT_POINT",
      "CC_GRAPH_INTERSECTION",
      "CC_EXPONENTIAL_FUNCTION_GRAPH"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "INTERDEPENDENT"
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
    "content": "곡선 $y=e^x$ 위의 점 $(0,1)$에서 그은 접선이 곡선 $y=4\\sqrt{x-k}$에 접할 때, $k$의 값은?",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "③",
    "solution": "$y=e^x$에서 $y'=e^x$이므로 $x=0$에서 접선의 기울기는 $e^0=1$이다.\n접선이 점 $(0,1)$을 지나므로 접선의 방정식은 $y=x+1$이다.\n$y=4\\sqrt{x-k}$에서 $y'=\\frac2{\\sqrt{x-k}}$이므로 접점의 $x$좌표를 $t>k$라 하면 접선의 기울기는 $\\frac2{\\sqrt{t-k}}$이다.\n기울기를 같다고 두면 $\\frac2{\\sqrt{t-k}}=1$에서 $\\sqrt{t-k}=2$, 즉 $t-k=4$이다.\n접점의 높이는 $4\\sqrt{t-k}=4\\sqrt4=8$이다.\n이 점이 직선 $y=x+1$ 위에 있으므로 $t+1=8$에서 $t=7$이다.\n따라서 $k=t-4=7-4=3$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-084",
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENCY_RELATION_GEOMETRY",
    "crossConceptKeys": [
      "CC_TANGENT_LINE_SLOPE_AT_POINT",
      "CC_IRRATIONAL_FUNCTION_GRAPH"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
