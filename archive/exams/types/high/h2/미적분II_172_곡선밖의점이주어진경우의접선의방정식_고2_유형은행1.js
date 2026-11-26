window.examTitle = "미적분II_172_곡선밖의점이주어진경우의접선의방정식_고2_유형은행1";

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
    "content": "점 $(-2,0)$에서 곡선 $y=xe^{2x}$에 그은 접선의 방정식은?",
    "choices": [
      "$y=-e^2(x+2)$",
      "$y=-\\frac2{e^2}(x+2)$",
      "$y=-\\frac1e(x+2)$",
      "$y=-\\frac1{e^2}(x+2)$",
      "$y=\\frac1{e^2}(x+2)$"
    ],
    "answer": "④",
    "solution": "접점의 $x$좌표를 $t$라 하면 곡선 위의 점은 $(t,te^{2t})$이다.\n곱의 미분법으로 $y'=e^{2x}+x\\cdot2e^{2x}=(1+2x)e^{2x}$이므로 접선의 기울기는 $(1+2t)e^{2t}$이다.\n접선의 방정식은 $y-te^{2t}=(1+2t)e^{2t}(x-t)$이다.\n점 $(-2,0)$을 대입하면 $-te^{2t}=(1+2t)e^{2t}(-2-t)$이다.\n$e^{2t}>0$이므로 양변을 $e^{2t}$로 나누면 $0=t+(1+2t)(-2-t)=-2(t+1)^2$이다.\n$-2(t+1)^2=0$에서 $t=-1$이고, 기울기는 $(1-2)e^{-2}=-\\frac1{e^2}$이다.\n점 $(-1,-e^{-2})$과 기울기 $-e^{-2}$로 접선을 쓰면 $y=-\\frac1{e^2}(x+2)$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
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
    "content": "원점에서 곡선 $y=\\frac{\\ln x}{x}$에 그은 접선이 점 $(a,1)$을 지날 때, $a$의 값은?",
    "choices": [
      "$2e$",
      "$3e$",
      "$4e$",
      "$5e$",
      "$6e$"
    ],
    "answer": "①",
    "solution": "$f(x)=\\frac{\\ln x}{x}$라 하면 몫의 미분법으로 $f'(x)=\\frac{\\frac1x\\cdot x-\\ln x\\cdot1}{x^2}=\\frac{1-\\ln x}{x^2}$이다.\n접점을 $x=t$라 하면 접선은 $y-f(t)=f'(t)(x-t)$이다.\n원점 $(0,0)$을 지나므로 $0-f(t)=f'(t)(0-t)$, 즉 $0=f(t)-tf'(t)$이다.\n대입하면 $0=\\frac{\\ln t}{t}-t\\cdot\\frac{1-\\ln t}{t^2}=\\frac{2\\ln t-1}{t}$이다.\n$t>0$이므로 $2\\ln t-1=0$에서 $\\ln t=\\frac12$, $t=\\sqrt e$이다.\n기울기는 $f'(\\sqrt e)=\\frac{1-1/2}{e}=\\frac1{2e}$이므로 접선은 $y=\\frac1{2e}x$이다.\n점 $(a,1)$을 대입하면 $1=\\frac a{2e}$이므로 $a=2e$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-083",
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENT_CONSTRUCTION",
    "crossConceptKeys": [
      "CC_LOGARITHMIC_FUNCTION_GRAPH"
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
    "content": "곡선 $y=2e^{2x-1}$ 위의 점 $A$에서 그은 접선이 원점 $O$를 지날 때, $\\overline{OA}$의 값은?",
    "choices": [
      "$\\frac{\\sqrt5}2$",
      "$\\frac{\\sqrt7}2$",
      "$\\frac{\\sqrt{10}}2$",
      "$\\frac{\\sqrt{13}}2$",
      "$\\frac{\\sqrt{17}}2$"
    ],
    "answer": "⑤",
    "solution": "$f(x)=2e^{2x-1}$이라 하면 합성함수의 미분법으로 $f'(x)=4e^{2x-1}$이다.\n접점 $A(t,2e^{2t-1})$에서 접선은 $y-2e^{2t-1}=4e^{2t-1}(x-t)$이다.\n원점을 지나므로 $0-2e^{2t-1}=4e^{2t-1}(0-t)$이다.\n$e^{2t-1}>0$으로 나누면 $-2=-4t$에서 $t=\\frac12$이다.\n$A$의 좌표는 $\\left(\\frac12,2e^0\\right)=\\left(\\frac12,2\\right)$이다.\n거리 공식으로 $\\overline{OA}=\\sqrt{\\left(\\frac12\\right)^2+2^2}=\\sqrt{\\frac14+4}=\\frac{\\sqrt{17}}2$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-083",
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENT_CONSTRUCTION",
    "crossConceptKeys": [
      "CC_EXPONENTIAL_FUNCTION_GRAPH"
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
    "content": "점 $(3,2)$에서 곡선 $y=\\frac{x-2}{x}$에 그은 두 접선의 기울기의 곱은?",
    "choices": [
      "$\\frac1{36}$",
      "$\\frac1{25}$",
      "$\\frac1{16}$",
      "$\\frac1{12}$",
      "$\\frac19$"
    ],
    "answer": "⑤",
    "solution": "$f(x)=\\frac{x-2}{x}=1-\\frac2x$라 하면 $f'(x)=\\frac2{x^2}$이다.\n접점 $x=t$에서 접선은 $y-\\left(1-\\frac2t\\right)=\\frac2{t^2}(x-t)$이다.\n점 $(3,2)$를 대입하면 $2-\\left(1-\\frac2t\\right)=\\frac2{t^2}(3-t)$이다.\n좌변과 우변을 정리하면 $1+\\frac2t=\\frac6{t^2}-\\frac2t$이다.\n$1+\\frac4t-\\frac6{t^2}=0$이고 $t^2$를 곱하면 $t^2+4t-6=0$이다.\n판별식 $D=4^2-4\\cdot1\\cdot(-6)=40>0$이므로 서로 다른 두 접점이 존재한다.\n근과 계수의 관계로 $t_1t_2=-6$이다.\n기울기의 곱은 $\\frac2{t_1^2}\\cdot\\frac2{t_2^2}=\\frac4{(t_1t_2)^2}=\\frac4{36}=\\frac19$이다.\n따라서 정답은 ⑤이다.",
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
    "content": "점 $(2,0)$에서 $y=xe^x$에 그은 두 접선의 기울기의 곱은?",
    "choices": [
      "$e^{-2}$",
      "$1$",
      "$e$",
      "$e^2$",
      "$e^3$"
    ],
    "answer": "④",
    "solution": "$f(x)=xe^x$라 하면 곱의 미분법으로 $f'(x)=e^x+xe^x=(1+x)e^x$이다.\n접점 $x=t$에서 접선은 $y-te^t=(1+t)e^t(x-t)$이다.\n점 $(2,0)$을 대입하면 $-te^t=(1+t)e^t(2-t)$이다.\n$e^t>0$으로 나누면 $-t=(1+t)(2-t)=2+t-t^2$이다.\n정리하면 $t^2-2t-2=0$이고 판별식 $D=(-2)^2-4\\cdot1\\cdot(-2)=12>0$이다.\n근과 계수의 관계로 $t_1+t_2=2$, $t_1t_2=-2$이다.\n기울기의 곱은 $(1+t_1)(1+t_2)e^{t_1+t_2}=(1+t_1+t_2+t_1t_2)e^2=(1+2-2)e^2=e^2$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
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
    "content": "원점에서 곡선 $y=(\\ln x)^2-2$에 그은 두 접선의 기울기의 곱은?",
    "choices": [
      "$-\\frac{12}{e^2}$",
      "$-\\frac{10}{e^2}$",
      "$-\\frac8{e^2}$",
      "$-\\frac6{e^2}$",
      "$-\\frac4{e^2}$"
    ],
    "answer": "③",
    "solution": "$f(x)=(\\ln x)^2-2$라 하면 합성함수의 미분법으로 $f'(x)=2\\ln x\\cdot\\frac1x=\\frac{2\\ln x}{x}$이다.\n접점 $x=t$에서 접선은 $y-f(t)=f'(t)(x-t)$이다.\n원점을 지나므로 $0=f(t)-tf'(t)$이다.\n대입하면 $0=(\\ln t)^2-2-t\\cdot\\frac{2\\ln t}{t}=(\\ln t)^2-2\\ln t-2$이다.\n$u=\\ln t$로 놓으면 $u^2-2u-2=0$이고 판별식 $D=(-2)^2-4\\cdot1\\cdot(-2)=12>0$이다.\n근과 계수의 관계로 $u_1+u_2=2$, $u_1u_2=-2$이다.\n$t_1t_2=e^{u_1}e^{u_2}=e^{u_1+u_2}=e^2$이다.\n기울기의 곱은 $\\frac{2u_1}{t_1}\\cdot\\frac{2u_2}{t_2}=\\frac{4u_1u_2}{t_1t_2}=\\frac{4\\cdot(-2)}{e^2}=-\\frac8{e^2}$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-083",
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENT_CONSTRUCTION",
    "crossConceptKeys": [
      "CC_LOGARITHMIC_FUNCTION_GRAPH",
      "CC_DERIVATIVE_ROOT_SOLVING"
    ],
    "conditionKeys": [],
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
    "content": "점 $(a,0)$에서 $y=xe^x$에 그은 서로 다른 두 접선의 기울기의 곱이 $e^2$일 때 $a$는?",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "②",
    "solution": "$f(x)=xe^x$라 하면 곱의 미분법으로 $f'(x)=(1+x)e^x$이다.\n접점 $x=t$에서 접선은 $y-te^t=(1+t)e^t(x-t)$이다.\n점 $(a,0)$을 대입하면 $-te^t=(1+t)e^t(a-t)$이다.\n$e^t>0$으로 나누면 $-t=(1+t)(a-t)=a+at-t-t^2$이다.\n정리하면 $t^2-at-a=0$이고 근과 계수의 관계로 $t_1+t_2=a$, $t_1t_2=-a$이다.\n기울기의 곱은 $(1+t_1)(1+t_2)e^{t_1+t_2}=(1+a-a)e^a=e^a$이다.\n$e^a=e^2$에서 $a=2$이다.\n$a=2$일 때 판별식 $D=(-2)^2-4\\cdot1\\cdot(-2)=12>0$이므로 서로 다른 두 접선이 실제로 존재한다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
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
    "content": "$a>0$일 때 점 $A(0,a)$를 지나는 곡선 $y=\\ln x+2$의 접선이 $x$축과 만나는 점을 $P$라 하자. 원점을 $O$라 할 때 $\\lim_{a\\to0+}\\frac{e\\overline{OP}-\\overline{OA}}{a^2}$의 값은? [그림: 곡선 $y=\\ln x+2$를 그리고, 예시로 $a=1$일 때의 접선 $y=x+1$과 그 접점 $(1,2)$를 표시한다. 두 절편에 $A(0,1)$과 $P(-1,0)$을 표시한다.]",
    "choices": [
      "$\\frac14$",
      "$\\frac12$",
      "$\\frac34$",
      "$1$",
      "$2$"
    ],
    "answer": "④",
    "solution": "$f(x)=\\ln x+2$라 하면 $f'(x)=\\frac1x$이다.\n접점 $x=t$에서 접선은 $y-(\\ln t+2)=\\frac1t(x-t)$, 즉 $y=\\frac xt+\\ln t+1$이다.\n$y$절편이 $a$이므로 $\\ln t+1=a$에서 $t=e^{a-1}$이다.\n$y=0$일 때 $0=\\frac xt+\\ln t+1$이므로 $x=-t(\\ln t+1)=-at$이다.\n$a>0$, $t>0$이므로 $\\overline{OP}=at$, $\\overline{OA}=a$이다.\n따라서 $e\\overline{OP}-\\overline{OA}=eat-a=a(et-1)$이다.\n$t=e^{a-1}$이므로 $et=e^a$이고 분자는 $a(e^a-1)$이다.\n극한은 $\\lim_{a\\to0+}\\frac{a(e^a-1)}{a^2}=\\lim_{a\\to0+}\\frac{e^a-1}{a}$이다.\n$e^x$의 $x=0$에서의 미분계수의 정의에 의해 이 극한은 $e^0=1$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 5,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-083",
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENT_CONSTRUCTION",
    "crossConceptKeys": [
      "CC_FUNCTION_LIMIT",
      "CC_LOGARITHMIC_FUNCTION_GRAPH"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/미적분II_172_곡선밖의점이주어진경우의접선의방정식_고2_유형은행1/q8-problem.svg",
    "imageAlt": "곡선 y=ln x+2와 a=1의 접선 y=x+1, 접점 (1,2) 및 y절편 A(0,1)를 나타낸다.",
    "imageCaption": "곡선 y=ln x+2와 a=1의 접선 y=x+1, 접점 (1,2) 및 y절편 A(0,1)를 나타낸다.",
    "imageSize": "medium"
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
    "content": "$a>0$일 때 점 $(\\ln a,0)$에서 곡선 $y=e^{2x}$에 그은 접선의 접점을 $(u(a),v(a))$라 하자. $\\displaystyle\\lim_{a\\to0^+}\\frac{a(u(a+1)-1/2)}{v(a)}$의 값은?",
    "choices": [
      "$\\frac1{2e}$",
      "$\\frac1e$",
      "$\\frac2e$",
      "$\\frac3e$",
      "$\\frac4e$"
    ],
    "answer": "②",
    "solution": "$f(x)=e^{2x}$라 하면 합성함수의 미분법으로 $f'(x)=2e^{2x}$이다.\n접점 $(u,v)=(t,e^{2t})$에서 접선은 $y-e^{2t}=2e^{2t}(x-t)$이다.\n점 $(\\ln a,0)$을 대입하면 $-e^{2t}=2e^{2t}(\\ln a-t)$이다.\n$e^{2t}>0$으로 나누면 $-1=2\\ln a-2t$에서 $t=\\ln a+\\frac12$이다.\n따라서 $u(a)=\\ln a+\\frac12$이고 $v(a)=e^{2(\\ln a+1/2)}=ea^2$이다.\n$u(a+1)=\\ln(a+1)+\\frac12$이므로 $u(a+1)-\\frac12=\\ln(a+1)$이다.\n분자는 $a\\ln(a+1)$이고 전체 식은 $\\frac{a\\ln(a+1)}{ea^2}=\\frac1e\\cdot\\frac{\\ln(1+a)}a$이다.\n로그함수의 $x=1$에서의 미분계수로 $\\lim_{a\\to0+}\\frac{\\ln(1+a)-\\ln1}{a}=1$이다.\n따라서 극한은 $\\frac1e\\cdot1=\\frac1e$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 5,
    "difficultyConfidence": "low",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-083",
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENT_CONSTRUCTION",
    "crossConceptKeys": [
      "CC_FUNCTION_LIMIT",
      "CC_EXPONENTIAL_FUNCTION_GRAPH"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
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
    "content": "자연수 $n$에 대해 점 $(\\ln3,0)$에서 곡선 $y=e^{nx-1}$에 그은 접선의 접점의 $y$좌표를 $a_n$이라 할 때, $\\displaystyle\\sum_{n=1}^{\\infty}\\frac1{a_n}$의 값은?",
    "choices": [
      "$\\frac14$",
      "$\\frac13$",
      "$\\frac12$",
      "$\\frac23$",
      "$\\frac34$"
    ],
    "answer": "③",
    "solution": "$f(x)=e^{nx-1}$이라 하면 합성함수의 미분법으로 $f'(x)=ne^{nx-1}$이다.\n접점 $x=t$에서 접선은 $y-e^{nt-1}=ne^{nt-1}(x-t)$이다.\n점 $(\\ln3,0)$을 대입하면 $-e^{nt-1}=ne^{nt-1}(\\ln3-t)$이다.\n$e^{nt-1}>0$으로 나누면 $-1=n(\\ln3-t)$에서 $t=\\ln3+\\frac1n$이다.\n접점의 $y$좌표는 $a_n=e^{n(\\ln3+1/n)-1}=e^{n\\ln3+1-1}=3^n$이다.\n따라서 $\\frac1{a_n}=\\frac1{3^n}=\\left(\\frac13\\right)^n$이다.\n첫째항 $\\frac13$, 공비 $\\frac13$인 등비수열이므로 무한등비급수의 합은 $\\frac{1/3}{1-1/3}$이다.\n$\\frac{1/3}{2/3}=\\frac12$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-083",
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENT_CONSTRUCTION",
    "crossConceptKeys": [
      "CC_SERIES_SUM",
      "CC_EXPONENTIAL_FUNCTION_GRAPH"
    ],
    "conditionKeys": [
      "COND_NATURAL_NUMBER"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
