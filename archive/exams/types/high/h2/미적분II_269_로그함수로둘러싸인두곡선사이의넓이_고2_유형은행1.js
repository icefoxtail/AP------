window.examTitle = "미적분II_269_로그함수로둘러싸인두곡선사이의넓이_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "정적분의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-08",
    "standardUnit": "정적분의 활용",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "정적분의 활용"
    ],
    "wide": false,
    "content": "두 곡선 $y=-\\ln(x+1)$, $y=2\\sin x$ 및 직선 $x=\\pi$로 둘러싸인 도형의 넓이는?",
    "choices": [
      "$4+(\\pi-1)\\ln(\\pi-1)-\\pi$",
      "$4+(\\pi-1)\\ln(\\pi-1)$",
      "$4+(\\pi+1)\\ln(\\pi+1)-\\pi$",
      "$4+(\\pi+1)\\ln(\\pi+1)$",
      "$4+(\\pi+1)\\ln(\\pi+1)+\\pi$"
    ],
    "answer": "③",
    "solution": "[교점 확인] $x=0$에서 $-\\ln 1=0$, $2\\sin 0=0$이므로 두 곡선은 $(0,\\,0)$에서 만난다.\n[구간에서의 대소 관계] $0<x\\le\\pi$에서 $2\\sin x>0$이고 $x+1>1$이므로 $\\ln(x+1)>0$, 즉 $-\\ln(x+1)<0$이다. 따라서 $2\\sin x>-\\ln(x+1)$이다.\n[넓이 식 세우기] $S=\\int_{0}^{\\pi}\\{2\\sin x-(-\\ln(x+1))\\}\\,dx=\\int_{0}^{\\pi}2\\sin x\\,dx+\\int_{0}^{\\pi}\\ln(x+1)\\,dx$이다.\n[삼각함수의 정적분] $\\int_{0}^{\\pi}2\\sin x\\,dx=[-2\\cos x]_{0}^{\\pi}=-2\\cos\\pi-(-2\\cos 0)=-2(-1)-(-2)=4$이다.\n[부분적분법] $u=\\ln(x+1)$, $dv=dx$로 두면 $du=\\frac{1}{x+1}dx$, $v=x+1$이므로 $\\int\\ln(x+1)\\,dx=(x+1)\\ln(x+1)-\\int 1\\,dx=(x+1)\\ln(x+1)-(x+1)+C$이다.\n[로그함수의 정적분] $\\int_{0}^{\\pi}\\ln(x+1)\\,dx=[(x+1)\\ln(x+1)-(x+1)]_{0}^{\\pi}$이다.\n[위끝·아래끝 대입] $=\\{(\\pi+1)\\ln(\\pi+1)-(\\pi+1)\\}-\\{1\\cdot\\ln 1-1\\}=(\\pi+1)\\ln(\\pi+1)-(\\pi+1)+1=(\\pi+1)\\ln(\\pi+1)-\\pi$이다.\n[두 정적분의 합] $S=4+(\\pi+1)\\ln(\\pi+1)-\\pi$이다.\n주의: 아래끝 $x=0$을 대입할 때 $-(x+1)=-1$이므로 $-(-1)=+1$이 되어 $-(\\pi+1)+1=-\\pi$로 정리됨을 놓치지 않아야 한다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-102",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_LOGARITHMIC_FUNCTION_GRAPH",
      "CC_INTEGRATION_BY_PARTS_OR_EXPANSION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 2,
    "category": "정적분의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-08",
    "standardUnit": "정적분의 활용",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "정적분의 활용"
    ],
    "wide": false,
    "content": "곡선 $y=\\ln x$와 이 곡선 위의 두 점 $\\mathrm{P}(1, 0)$, $\\mathrm{Q}(e^2, 2)$를 지나는 직선으로 둘러싸인 부분의 넓이는?",
    "choices": [
      "$1$",
      "$\\frac{3}{2}$",
      "$2$",
      "$\\frac{5}{2}$",
      "$3$"
    ],
    "answer": "③",
    "solution": "[직선의 기울기 구하기] 두 점 $\\mathrm{P}(1,\\,0)$, $\\mathrm{Q}(e^2,\\,2)$를 지나는 직선의 기울기는 $m=\\frac{2-0}{e^2-1}=\\frac{2}{e^2-1}$이다.\n[직선의 방정식] 점 $\\mathrm{P}(1,\\,0)$을 지나므로 $y=\\frac{2}{e^2-1}(x-1)$이다.\n[대소 관계 확인] $y=\\ln x$의 이계도함수가 $-\\frac{1}{x^2}<0$이므로 곡선은 위로 볼록하다. 따라서 $[1,\\,e^2]$에서 곡선이 두 점을 잇는 현보다 위쪽, 즉 $\\ln x\\ge\\frac{2}{e^2-1}(x-1)$이다.\n[넓이 식 세우기] $S=\\int_{1}^{e^2}\\left\\{\\ln x-\\frac{2}{e^2-1}(x-1)\\right\\}\\,dx$이다.\n[부분적분법] $\\int_{1}^{e^2}\\ln x\\,dx=[x\\ln x-x]_{1}^{e^2}$이다.\n[대입] $=(e^2\\ln e^2-e^2)-(1\\cdot\\ln 1-1)=(2e^2-e^2)-(-1)=e^2+1$이다.\n[직선 부분의 정적분] $\\frac{2}{e^2-1}\\int_{1}^{e^2}(x-1)\\,dx=\\frac{2}{e^2-1}\\left[\\frac{(x-1)^2}{2}\\right]_{1}^{e^2}=\\frac{(e^2-1)^2}{e^2-1}=e^2-1$이다.\n[차로 넓이 계산] $S=(e^2+1)-(e^2-1)=e^2+1-e^2+1=2$이다.\n주의: $\\ln(e^2)=2$이므로 $x\\ln x$에 $x=e^2$을 대입하면 $e^2\\cdot 2=2e^2$이 되어 $2e^2-e^2=e^2$으로 정리된다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-102",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_LOGARITHMIC_FUNCTION_GRAPH",
      "CC_LINEAR_FUNCTIONS",
      "CC_INTEGRATION_BY_PARTS_OR_EXPANSION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 3,
    "category": "정적분의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-08",
    "standardUnit": "정적분의 활용",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "정적분의 활용"
    ],
    "wide": false,
    "content": "오른쪽 그림과 같이 두 직선 $x=p$, $x=q$와 $x$축 및 곡선 $y=\\log_b x$로 둘러싸인 부분을 곡선 $y=\\log_a x$가 두 부분 $A$와 $B$로 나눈다. 두 부분 $A$와 $B$의 넓이를 각각 $\\alpha$, $\\beta$라 할 때, $\\frac{\\alpha}{\\beta}$의 값은? (단, $1<b<a$, $1<p<q$)\n[그림: 좌표평면의 제1사분면에 점 $(1, 0)$을 지나고 $x>1$에서 정의된 두 곡선 $y=\\log_b x$와 $y=\\log_a x$가 있다. $1<b<a$이므로 $x>1$에서 곡선 $y=\\log_b x$가 곡선 $y=\\log_a x$의 위쪽에 위치한다. $1<p<q$인 두 수직선 $x=p$, $x=q$에 의해 두 곡선 사이의 영역이 $A$, 곡선 $y=\\log_a x$와 $x$축 사이의 영역이 $B$로 표시되어 있다.]",
    "choices": [
      "$\\left(\\frac{a}{b}-1\\right)(q-p)$",
      "$\\frac{b}{a}-1$",
      "$\\log_a b - 1$",
      "$\\log_b a - 1$",
      "$(q-p)\\log_a b$"
    ],
    "answer": "④",
    "solution": "[밑변환 공식] $\\log_b x=\\frac{\\ln x}{\\ln b}$, $\\log_a x=\\frac{\\ln x}{\\ln a}$이다.\n[두 곡선의 대소 관계] $1<b<a$이므로 $\\ln b<\\ln a$, 즉 $\\frac{1}{\\ln b}>\\frac{1}{\\ln a}$이다. 따라서 $x>1$에서 $\\log_b x>\\log_a x$이므로 $y=\\log_b x$가 위쪽 곡선이다.\n[영역 $B$의 넓이 $\\beta$] $\\beta=\\int_{p}^{q}\\log_a x\\,dx=\\frac{1}{\\ln a}\\int_{p}^{q}\\ln x\\,dx$이다.\n[영역 $A$의 넓이 $\\alpha$] $\\alpha=\\int_{p}^{q}(\\log_b x-\\log_a x)\\,dx=\\left(\\frac{1}{\\ln b}-\\frac{1}{\\ln a}\\right)\\int_{p}^{q}\\ln x\\,dx$이다.\n[약분 조건 확인] $1<p<q$에서 $x>1$이므로 $\\ln x>0$이고 $\\int_{p}^{q}\\ln x\\,dx\\neq 0$이므로 분자·분모를 약분할 수 있다.\n[넓이의 비] $\\frac{\\alpha}{\\beta}=\\frac{\\left(\\frac{1}{\\ln b}-\\frac{1}{\\ln a}\\right)\\int_{p}^{q}\\ln x\\,dx}{\\frac{1}{\\ln a}\\int_{p}^{q}\\ln x\\,dx}=\\frac{\\frac{1}{\\ln b}-\\frac{1}{\\ln a}}{\\frac{1}{\\ln a}}$이다.\n[식 정리] $=\\frac{\\frac{1}{\\ln b}}{\\frac{1}{\\ln a}}-1=\\frac{\\ln a}{\\ln b}-1$이다.\n[로그의 성질] $\\frac{\\ln a}{\\ln b}=\\log_b a$이므로 $\\frac{\\alpha}{\\beta}=\\log_b a-1$이다.\n주의: 밑이 $1$보다 클 때 밑이 작을수록 $x>1$에서 그래프가 위쪽에 있으므로 위쪽 함수는 $\\log_b x$이다. 밑을 뒤집어 $\\log_a b-1$을 고르지 않도록 주의한다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-102",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_LOGARITHMIC_FUNCTION_GRAPH"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "REINTERPRETATION"
  }
];
