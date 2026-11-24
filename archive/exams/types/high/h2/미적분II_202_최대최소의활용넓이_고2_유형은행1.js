window.examTitle = "미적분II_202_최대최소의활용넓이_고2_유형은행1";

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
    "content": "곡선 $y=2e^x$의 제2사분면 위 점에서의 접선과 두 좌표축이 만드는 삼각형의 최대 넓이는? [그림: A$(t,2e^t)$ ($t<0$)의 접선과 절편 $(t-1,0)$, $(0,2(1-t)e^t)$를 표시한다.]",
    "choices": [
      "$1/e$",
      "$2/e$",
      "$5/(2e)$",
      "$3/e$",
      "$4/e$"
    ],
    "answer": "⑤",
    "solution": "제2사분면의 점 $A(t,2e^t)$에서 $t<0$이다.\n접선의 기울기는 $y'=2e^x$에 $x=t$를 대입한 $2e^t$이므로 접선은 $y-2e^t=2e^t(x-t)$이다.\n정리하면 $y=2e^t(x-t+1)$이므로 $x$절편은 $t-1$, $y$절편은 $2e^t(1-t)$이다.\n$t<0$이므로 두 절편의 절댓값은 $1-t$와 $2e^t(1-t)$이고, 삼각형의 넓이는 $S(t)=\\frac12(1-t)\\cdot2e^t(1-t)=(1-t)^2e^t$이다.\n곱의 미분법으로 $S'(t)=e^t\\{(1-t)^2-2(1-t)\\}=e^t(1-t)(-1-t)$이다.\n$t<-1$에서 $S'>0$, $-1<t<0$에서 $S'<0$이므로 $t=-1$에서 넓이가 최대이다.\n$S(-1)=(1+1)^2e^{-1}=\\frac4e$이다.\n주의: $t<0$이므로 절편의 부호를 확인해 길이를 양수로 잡아야 한다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-088",
    "problemTypeKey": "PT_DERIVATIVE_MAX_MIN",
    "templateKey": "TPL_MODELED_QUANTITY_OPTIMIZATION",
    "crossConceptKeys": [
      "CC_TANGENT_LINE_SLOPE_AT_POINT",
      "CC_AXIS_INTERCEPT"
    ],
    "conditionKeys": [
      "COND_NEGATIVE"
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
    "content": "곡선 $y=2\\ln x$ 위 P$(t,2\\ln t)$ ($0<t<1$)의 접선이 두 좌표축과 만나는 점을 Q, R이라 하자. 삼각형 OQR의 최대 넓이는? [그림: P에서의 접선과 절편 Q$(t(1-\\ln t),0)$, R$(0,2\\ln t-2)$를 표시한다.]",
    "choices": [
      "$1/e$",
      "$2/e$",
      "$3/e$",
      "$4/e$",
      "$5/e$"
    ],
    "answer": "④",
    "solution": "$P(t,2\\ln t)$에서 $0<t<1$이다.\n로그함수의 미분 $y'=\\frac2x$에 의해 접선은 $y-2\\ln t=\\frac2t(x-t)$이다.\n$y=0$을 대입하면 $x=t(1-\\ln t)$이고, $x=0$을 대입하면 $y=2(\\ln t-1)$이다.\n$0<t<1$이므로 $\\ln t<0$이고 $\\overline{OQ}=t(1-\\ln t)$, $\\overline{OR}=2(1-\\ln t)$이다.\n삼각형의 넓이는 $S(t)=\\frac12\\cdot t(1-\\ln t)\\cdot2(1-\\ln t)=t(1-\\ln t)^2$이다.\n곱의 미분법으로 $S'=(1-\\ln t)^2+t\\cdot2(1-\\ln t)\\cdot(-\\frac1t)=(1-\\ln t)(-1-\\ln t)$이다.\n$t=e^{-1}$에서 $S'$가 양에서 음으로 바뀌므로 최대이고 $S(e^{-1})=e^{-1}(1+1)^2=\\frac4e$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-088",
    "problemTypeKey": "PT_DERIVATIVE_MAX_MIN",
    "templateKey": "TPL_MODELED_QUANTITY_OPTIMIZATION",
    "crossConceptKeys": [
      "CC_TANGENT_LINE_SLOPE_AT_POINT",
      "CC_AXIS_INTERCEPT",
      "CC_LOGARITHMIC_FUNCTION_GRAPH"
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
    "content": "곡선 $y=2\\ln x$ ($x>1$) 위 점 P를 지나는 법선과 $x$축의 교점을 Q, P에서 $x$축에 내린 수선의 발을 R이라 하자. 삼각형 PQR의 최대 넓이는? [그림: P$(t,2\\ln t)$, R$(t,0)$, Q$(t+4\\ln t/t,0)$를 표시한다.]",
    "choices": [
      "$12/e^2$",
      "$14/e^2$",
      "$16/e^2$",
      "$18/e^2$",
      "$20/e^2$"
    ],
    "answer": "③",
    "solution": "$P(t,2\\ln t)$, $t>1$에서 접선의 기울기는 $\\frac2t$이다.\n법선의 기울기는 음의 역수이므로 $-\\frac t2$이고 법선은 $y-2\\ln t=-\\frac t2(x-t)$이다.\n$y=0$을 대입하면 $-2\\ln t=-\\frac t2(x-t)$에서 $x=t+\\frac{4\\ln t}{t}$이다.\n$R(t,0)$이므로 $\\overline{RQ}=\\frac{4\\ln t}{t}$이고 $\\overline{PR}=2\\ln t$이다.\n$S(t)=\\frac12\\cdot2\\ln t\\cdot\\frac{4\\ln t}{t}=\\frac{4(\\ln t)^2}{t}$이다.\n몫의 미분법으로 $S'=4\\cdot\\frac{\\frac{2\\ln t}{t}\\cdot t-(\\ln t)^2}{t^2}=\\frac{4\\ln t(2-\\ln t)}{t^2}$이다.\n$t=e^2$에서 양에서 음으로 바뀌므로 최대이고 $S(e^2)=\\frac{4\\cdot2^2}{e^2}=\\frac{16}{e^2}$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-088",
    "problemTypeKey": "PT_DERIVATIVE_MAX_MIN",
    "templateKey": "TPL_MODELED_QUANTITY_OPTIMIZATION",
    "crossConceptKeys": [
      "CC_TANGENT_LINE_SLOPE_AT_POINT",
      "CC_LOGARITHMIC_FUNCTION_GRAPH"
    ],
    "conditionKeys": [
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
    "content": "$y=3e^{-2x}$ 위 P$(t,3e^{-2t})$ ($t>0$)에서 $y$축에 내린 수선의 발을 A라 하고 P에서의 접선의 $y$절편을 B라 하자. 삼각형 APB의 넓이가 최대인 $t$는? [그림: A$(0,3e^{-2t})$, B$(0,3(1+2t)e^{-2t})$와 P를 이어 표시한다.]",
    "choices": [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "answer": "①",
    "solution": "$P(t,3e^{-2t})$에서 합성함수의 미분법으로 접선의 기울기는 $-6e^{-2t}$이다.\n접선은 $y-3e^{-2t}=-6e^{-2t}(x-t)$이므로 $x=0$에서 $y=3e^{-2t}(1+2t)$이다.\n$A(0,3e^{-2t})$이므로 $\\overline{AB}=3e^{-2t}(1+2t)-3e^{-2t}=6te^{-2t}$이고 $\\overline{AP}=t$이다.\n직각삼각형의 넓이는 $S(t)=\\frac12\\cdot t\\cdot6te^{-2t}=3t^2e^{-2t}$이다.\n곱의 미분법으로 $S'=3(2te^{-2t}+t^2(-2)e^{-2t})=6t(1-t)e^{-2t}$이다.\n$0<t<1$에서 $S'>0$, $t>1$에서 $S'<0$이므로 $t=1$에서 최대이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-088",
    "problemTypeKey": "PT_DERIVATIVE_MAX_MIN",
    "templateKey": "TPL_MODELED_QUANTITY_OPTIMIZATION",
    "crossConceptKeys": [
      "CC_TANGENT_LINE_SLOPE_AT_POINT",
      "CC_AXIS_INTERCEPT"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
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
    "content": "아래 두 꼭짓점은 $x$축 위, 위의 두 꼭짓점은 $y=3e^{-2x^2}$ 위에 있는 직사각형의 최대 넓이는? [그림: 위의 두 꼭짓점을 $(-t,3e^{-2t^2})$, $(t,3e^{-2t^2})$로 잡고 $x$축에 수직으로 내려 직사각형을 그린다.]",
    "choices": [
      "$1/\\sqrt e$",
      "$3/(2\\sqrt e)$",
      "$2/\\sqrt e$",
      "$5/(2\\sqrt e)$",
      "$3/\\sqrt e$"
    ],
    "answer": "⑤",
    "solution": "위의 두 꼭짓점의 높이가 같으므로 $3e^{-2x^2}$가 일대일함수인 점에서 $x$좌표를 $-t,t$로 놓을 수 있다.\n가로는 $2t$, 세로는 $3e^{-2t^2}$이므로 $S(t)=6te^{-2t^2}$이다.\n곱과 합성함수의 미분법으로 $S'=6(e^{-2t^2}+t\\cdot(-4t)e^{-2t^2})=6e^{-2t^2}(1-4t^2)$이다.\n$t>0$에서 $t=\\frac12$ 전후로 $S'$가 양에서 음으로 바뀌므로 최대이다.\n$S(\\frac12)=6\\cdot\\frac12\\cdot e^{-2\\cdot\\frac14}=3e^{-1/2}=\\frac3{\\sqrt e}$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-088",
    "problemTypeKey": "PT_DERIVATIVE_MAX_MIN",
    "templateKey": "TPL_MODELED_QUANTITY_OPTIMIZATION",
    "crossConceptKeys": [
      "CC_FUNCTION_SYMMETRY",
      "CC_VERTICAL_SEGMENT_LENGTH"
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
    "content": "위의 두 꼭짓점이 각각 $y=2e^{4x}$ ($x<0$), $y=2e^{-4x}$ ($x>0$) 위에 있고 아래 두 꼭짓점이 $x$축 위인 직사각형의 최대 넓이는? [그림: $x=-t,t$에서 같은 높이 $2e^{-4t}$에 꼭짓점을 표시하고 $x$축까지 수직선을 내린다.]",
    "choices": [
      "$1/(4e)$",
      "$1/(2e)$",
      "$3/(4e)$",
      "$1/e$",
      "$2/e$"
    ],
    "answer": "④",
    "solution": "두 윗점을 $(x_1,2e^{4x_1})$, $(x_2,2e^{-4x_2})$라 하면 높이가 같으므로 $2e^{4x_1}=2e^{-4x_2}$이다.\n지수함수가 일대일이므로 $4x_1=-4x_2$, 즉 $x_1=-x_2$이다.\n$x_2=t>0$이라 놓으면 가로는 $2t$, 세로는 $2e^{-4t}$이므로 $S(t)=4te^{-4t}$이다.\n곱의 미분법으로 $S'=4(e^{-4t}+t\\cdot(-4)e^{-4t})=4e^{-4t}(1-4t)$이다.\n$0<t<\\frac14$에서 $S'>0$, $t>\\frac14$에서 $S'<0$이므로 $t=\\frac14$에서 최대이다.\n$S(\\frac14)=4\\cdot\\frac14\\cdot e^{-1}=\\frac1e$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-088",
    "problemTypeKey": "PT_DERIVATIVE_MAX_MIN",
    "templateKey": "TPL_MODELED_QUANTITY_OPTIMIZATION",
    "crossConceptKeys": [
      "CC_FUNCTION_SYMMETRY",
      "CC_VERTICAL_SEGMENT_LENGTH"
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
    "content": "곡선 $y=\\ln(2x)$의 제4사분면 위 점 P를 두 좌표축에 수직 투영하여 원점과 직사각형을 만든다. 최대 넓이는? [그림: P$(t,\\ln(2t))$, $(t,0)$, $(0,\\ln(2t))$, $(0,0)$을 잇는다.]",
    "choices": [
      "$1/(2e)$",
      "$1/e$",
      "$3/(2e)$",
      "$2/e$",
      "$5/(2e)$"
    ],
    "answer": "①",
    "solution": "제4사분면의 점 $P(t,\\ln(2t))$는 $t>0$이고 $\\ln(2t)<0$이므로 $0<t<\\frac12$이다.\n직사각형의 가로는 $t$, 세로는 $-\\ln(2t)$이므로 $S(t)=-t\\ln(2t)$이다.\n곱의 미분법으로 $S'=-\\ln(2t)-t\\cdot\\frac1t=-\\ln(2t)-1$이다.\n$S'=0$에서 $\\ln(2t)=-1$, 즉 $t=\\frac1{2e}$이다.\n$0<t<\\frac1{2e}$에서 $S'>0$, $\\frac1{2e}<t<\\frac12$에서 $S'<0$이므로 최대이다.\n$S(\\frac1{2e})=-\\frac1{2e}\\ln(e^{-1})=\\frac1{2e}$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-088",
    "problemTypeKey": "PT_DERIVATIVE_MAX_MIN",
    "templateKey": "TPL_MODELED_QUANTITY_OPTIMIZATION",
    "crossConceptKeys": [
      "CC_LOGARITHMIC_FUNCTION_GRAPH"
    ],
    "conditionKeys": [
      "COND_NEGATIVE"
    ],
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
    "content": "반지름이 $4$인 반원에 지름을 아랫변으로 하는 사다리꼴을 내접시킬 때 최대 넓이는? [그림: $x^2+y^2=16$의 위 반원에 아랫변의 끝점 $(-4,0),(4,0)$, 윗변의 끝점 $(-t,\\sqrt{16-t^2}),(t,\\sqrt{16-t^2})$를 표시한다.]",
    "choices": [
      "$4\\sqrt3$",
      "$6\\sqrt3$",
      "$8\\sqrt3$",
      "$10\\sqrt3$",
      "$12\\sqrt3$"
    ],
    "answer": "⑤",
    "solution": "윗변의 오른쪽 끝을 $(t,\\sqrt{16-t^2})$라 하면 $0<t<4$이고 윗변은 $2t$, 아랫변은 $8$, 높이는 $\\sqrt{16-t^2}$이다.\n사다리꼴의 넓이는 $S(t)=\\frac12(8+2t)\\sqrt{16-t^2}=(4+t)\\sqrt{16-t^2}$이다.\n곱의 미분법으로 $S'=\\sqrt{16-t^2}+(4+t)\\cdot\\frac{-t}{\\sqrt{16-t^2}}$이다.\n통분하면 $S'=\\frac{(16-t^2)-t(4+t)}{\\sqrt{16-t^2}}=\\frac{16-4t-2t^2}{\\sqrt{16-t^2}}$이다.\n분자를 인수분해하면 $16-4t-2t^2=2(2-t)(t+4)$이다.\n$0<t<2$에서 $S'>0$, $2<t<4$에서 $S'<0$이므로 $t=2$에서 최대이다.\n$S(2)=6\\sqrt{12}=12\\sqrt3$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-088",
    "problemTypeKey": "PT_DERIVATIVE_MAX_MIN",
    "templateKey": "TPL_MODELED_QUANTITY_OPTIMIZATION",
    "crossConceptKeys": [
      "CC_FUNCTION_SYMMETRY",
      "CC_VERTICAL_SEGMENT_LENGTH"
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
    "content": "수로 단면이 밑변 2 m, 양 옆변 각 2 m인 사다리꼴이다. 밑변과 양 옆변의 내부 각이 같은 둔각일 때 단면의 최대 넓이는? [그림: 밑변 끝점을 $(0,0),(2,0)$, 윗변 끝점을 $(2\\cos\\theta,2\\sin\\theta),(2-2\\cos\\theta,2\\sin\\theta)$로 잡아 잇는다.]",
    "choices": [
      "$1\\sqrt3$ $\\mathrm{m}^2$",
      "$1.5\\sqrt3$ $\\mathrm{m}^2$",
      "$2\\sqrt3$ $\\mathrm{m}^2$",
      "$2.5\\sqrt3$ $\\mathrm{m}^2$",
      "$3\\sqrt3$ $\\mathrm{m}^2$"
    ],
    "answer": "⑤",
    "solution": "밑변의 왼쪽 끝을 $(0,0)$, 오른쪽 끝을 $(2,0)$이라 하고 밑변과 옆변의 내부 각을 둔각 $\\theta$라 하자.\n옆변의 길이가 $2$이므로 왼쪽 윗점은 $(2\\cos\\theta,2\\sin\\theta)$, 오른쪽 윗점은 $(2-2\\cos\\theta,2\\sin\\theta)$이다.\n윗변의 길이는 $2-4\\cos\\theta$, 높이는 $2\\sin\\theta$이므로 $S(\\theta)=\\frac12(2+2-4\\cos\\theta)\\cdot2\\sin\\theta=4(1-\\cos\\theta)\\sin\\theta$이다.\n곱의 미분법으로 $S'=4[\\sin\\theta\\cdot\\sin\\theta+(1-\\cos\\theta)\\cos\\theta]=4(1+\\cos\\theta-2\\cos^2\\theta)$이다.\n인수분해하면 $S'=4(1-\\cos\\theta)(1+2\\cos\\theta)$이다.\n둔각 $\\frac\\pi2<\\theta<\\pi$에서 $\\cos\\theta=-\\frac12$인 $\\theta=\\frac{2\\pi}3$ 전후로 $S'$가 양에서 음으로 바뀐다.\n$S(\\frac{2\\pi}3)=4(1+\\frac12)\\cdot\\frac{\\sqrt3}2=3\\sqrt3$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-088",
    "problemTypeKey": "PT_DERIVATIVE_MAX_MIN",
    "templateKey": "TPL_MODELED_QUANTITY_OPTIMIZATION",
    "crossConceptKeys": [
      "CC_TRIG_RATIO",
      "CC_TRIGONOMETRIC_EXTREMUM"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 10,
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
    "content": "반지름이 $2$인 원에 내접하는 이등변삼각형의 최대 넓이는? [그림: $x^2+y^2=4$에서 꼭짓점 $(0,2)$와 밑변의 두 끝점 $(\\pm\\sqrt{4-t^2},t)$를 잇는다.]",
    "choices": [
      "$3\\sqrt3$",
      "$4\\sqrt3$",
      "$5\\sqrt3$",
      "$6\\sqrt3$",
      "$7\\sqrt3$"
    ],
    "answer": "①",
    "solution": "원점이 중심이고 반지름이 $2$인 원에서 꼭짓점을 $A(0,2)$에 두자.\n밑변의 높이를 $t$라 하면 $-2<t<2$이고 밑변의 두 끝은 $(\\pm\\sqrt{4-t^2},t)$이다.\n밑변의 길이는 $2\\sqrt{4-t^2}$, 높이는 $2-t$이므로 $S(t)=(2-t)\\sqrt{4-t^2}$이다.\n곱의 미분법으로 $S'=-\\sqrt{4-t^2}+(2-t)\\cdot\\frac{-t}{\\sqrt{4-t^2}}$이다.\n통분하면 $S'=\\frac{-(4-t^2)-t(2-t)}{\\sqrt{4-t^2}}=\\frac{2t^2-2t-4}{\\sqrt{4-t^2}}$이다.\n분자를 인수분해하면 $2t^2-2t-4=2(t-2)(t+1)$이다.\n$-2<t<-1$에서 $S'>0$, $-1<t<2$에서 $S'<0$이므로 $t=-1$에서 최대이다.\n$S(-1)=(2+1)\\sqrt{4-1}=3\\sqrt3$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-088",
    "problemTypeKey": "PT_DERIVATIVE_MAX_MIN",
    "templateKey": "TPL_MODELED_QUANTITY_OPTIMIZATION",
    "crossConceptKeys": [
      "CC_FUNCTION_SYMMETRY",
      "CC_VERTICAL_SEGMENT_LENGTH"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 11,
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
    "content": "사진의 인쇄 면적은 $32\\,\\mathrm{cm}^2$이다. 인쇄 영역에서 왼쪽과 오른쪽에 각각 2 cm, 위와 아래에 각각 1 cm의 여백을 둔다. 종이 전체의 최소 넓이는? [그림: 인쇄 영역의 크기를 $x$ cm와 $32/x$ cm로, 바깥 직사각형의 크기를 $x+4$ cm와 $32/x+2$ cm로 표시한다.]",
    "choices": [
      "$56\\,\\mathrm{cm}^2$",
      "$60\\,\\mathrm{cm}^2$",
      "$64\\,\\mathrm{cm}^2$",
      "$72\\,\\mathrm{cm}^2$",
      "$76\\,\\mathrm{cm}^2$"
    ],
    "answer": "④",
    "solution": "인쇄 영역의 가로를 $x>0$이라 하면 세로는 $\\frac{32}{x}$이다.\n여백을 더하면 종이의 가로는 $x+4$, 세로는 $\\frac{32}{x}+2$이다.\n넓이는 $S(x)=(x+4)(\\frac{32}{x}+2)=40+2x+\\frac{128}{x}$이다.\n거듭제곱의 미분 공식으로 $S'=2-\\frac{128}{x^2}=\\frac{2(x^2-64)}{x^2}$이다.\n$0<x<8$에서 $S'<0$, $x>8$에서 $S'>0$이므로 $x=8$에서 최소이다.\n$S(8)=12\\cdot6=72$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-088",
    "problemTypeKey": "PT_DERIVATIVE_MAX_MIN",
    "templateKey": "TPL_MODELED_QUANTITY_OPTIMIZATION",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  },
  {
    "id": 12,
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
    "content": "반지름이 $2$인 제1사분면의 사분원에서 호 위 점 A의 $x$축으로의 수선의 발을 B라 한다. AB를 왼쪽 변으로 하여 오른쪽에 정사각형 ABCD를 만든다. 정사각형에서 사분원과 겹치지 않는 넓이가 최대일 때 AB의 길이는? [그림: 중심 O, 호 끝점 $(0,2),(2,0)$, A$(2\\cos\\theta,2\\sin\\theta)$, B$(2\\cos\\theta,0)$를 표시하고 오른쪽에 정사각형을 그린다.]",
    "choices": [
      "$2\\sqrt5/5$",
      "$3\\sqrt5/5$",
      "$4\\sqrt5/5$",
      "$9\\sqrt5/10$",
      "$\\sqrt5$"
    ],
    "answer": "③",
    "solution": "$A(2\\cos\\theta,2\\sin\\theta)$, $B(2\\cos\\theta,0)$라 하면 $0<\\theta<\\frac\\pi2$이고 정사각형의 한 변은 $\\overline{AB}=2\\sin\\theta$이다.\n정사각형의 넓이는 $4\\sin^2\\theta$이다.\n정사각형의 오른쪽 끝의 $x$좌표는 $2(\\cos\\theta+\\sin\\theta)>2$이므로 겹치는 부분은 $x=2\\cos\\theta$부터 $x=2$까지의 호 아래 영역이다.\n그 겹침은 중심각 $\\theta$인 부채꼴에서 삼각형 $OAB$를 뺀 것과 같으므로 넓이는 $2\\theta-2\\sin\\theta\\cos\\theta$이다.\n따라서 겹치지 않는 넓이는 $S(\\theta)=4\\sin^2\\theta-2\\theta+2\\sin\\theta\\cos\\theta$이다.\n미분하면 $S'=8\\sin\\theta\\cos\\theta-2+2(\\cos^2\\theta-\\sin^2\\theta)$이다.\n$\\cos^2\\theta-\\sin^2\\theta=1-2\\sin^2\\theta$를 대입하면 $S'=8\\sin\\theta\\cos\\theta-4\\sin^2\\theta=4\\sin\\theta(2\\cos\\theta-\\sin\\theta)$이다.\n$0<\\theta<\\frac\\pi2$에서 $\\sin\\theta>0$이고 $\\tan\\theta=2$ 전후로 $S'$가 양에서 음으로 바뀌므로 최대이다.\n$\\tan\\theta=2$일 때 $\\sin\\theta=\\frac2{\\sqrt5}$이므로 $\\overline{AB}=2\\sin\\theta=\\frac4{\\sqrt5}=\\frac{4\\sqrt5}5$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "low",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-088",
    "problemTypeKey": "PT_DERIVATIVE_MAX_MIN",
    "templateKey": "TPL_MODELED_QUANTITY_OPTIMIZATION",
    "crossConceptKeys": [
      "CC_TRIG_RATIO",
      "CC_VERTICAL_SEGMENT_LENGTH"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 13,
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
    "content": "가로 6, 세로 3인 직사각형 종이 ABCD의 꼭짓점 C를 윗변 AD 위의 E로 접는다. 접는 선이 오른쪽 변 CD와 밑변 BC를 각각 F, G에서 자를 때 삼각형 EFG의 최소 넓이는? [그림: C$(0,0)$, D$(0,3)$, A$(6,3)$, B$(6,0)$, E$(u,3)$을 표시하고 CE의 수직이등분선과 CD, BC의 교점을 각각 F, G라 한다.]",
    "choices": [
      "$1\\sqrt3$",
      "$2\\sqrt3$",
      "$3\\sqrt3$",
      "$4\\sqrt3$",
      "$5\\sqrt3$"
    ],
    "answer": "②",
    "solution": "좌표를 $C(0,0)$, $D(0,3)$, $A(6,3)$, $B(6,0)$로 잡고 $E(u,3)$라 하자.\n접는 선은 $\\overline{CE}$의 수직이등분선이므로 선 위의 점 $(x,y)$는 $x^2+y^2=(x-u)^2+(y-3)^2$을 만족한다.\n전개하면 $2ux+6y=u^2+9$, 즉 $y=\\frac{u^2+9-2ux}{6}$이다.\n$CD$와의 교점은 $x=0$일 때 $F(0,\\frac{u^2+9}{6})$, $BC$와의 교점은 $y=0$일 때 $G(\\frac{u^2+9}{2u},0)$이다.\n접는 선이 $CD$, $BC$를 자르려면 $\\frac{u^2+9}{6}\\le3$이고 $\\frac{u^2+9}{2u}\\le6$이므로 $6-3\\sqrt3\\le u\\le3$이다.\n접기 전의 $\\triangle CFG$가 접은 뒤 $\\triangle EFG$로 옮겨지므로 두 넓이는 같다.\n따라서 $S(u)=\\frac12\\cdot\\frac{u^2+9}{6}\\cdot\\frac{u^2+9}{2u}=\\frac{(u^2+9)^2}{24u}$이다.\n몫의 미분법으로 $S'=\\frac{4u^2(u^2+9)-(u^2+9)^2}{24u^2}=\\frac{(u^2+9)(3u^2-9)}{24u^2}$이다.\n$u=\\sqrt3$ 전후로 $S'$가 음에서 양으로 바뀌므로 최소이다.\n이때 $\\overline{CF}=2<3$, $\\overline{CG}=2\\sqrt3<6$이어서 접기가 가능하다.\n$S(\\sqrt3)=\\frac{144}{24\\sqrt3}=\\frac6{\\sqrt3}=2\\sqrt3$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-088",
    "problemTypeKey": "PT_DERIVATIVE_MAX_MIN",
    "templateKey": "TPL_MODELED_QUANTITY_OPTIMIZATION",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
