window.examTitle = "미적분II_216_속도가속도의활용_고2_유형은행1";

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
    "content": "지면에서 차 올린 공의 $t$초 후 위치가 $(9t,\\,12t-5t^2)$이다. 좌표의 단위가 $\\mathrm m$일 때, 공이 지면에 다시 닿는 순간의 속력을 구하여라. (단위는 $\\mathrm{m/s}$)",
    "choices": [
      "$15$",
      "$16$",
      "$17$",
      "$18$",
      "$20$"
    ],
    "answer": "①",
    "solution": "지면에 다시 닿는 순간은 높이가 $0$이 될 때이므로 $12t-5t^2=0$을 푼다.\n좌변을 인수분해하면 $t(12-5t)=0$이다.\n(i) $t=0$은 공을 차 올린 순간이다.\n(ii) $12-5t=0$에서 $t=\\frac{12}{5}$가 다시 지면에 닿는 순간이다.\n위치 $(9t,\\,12t-5t^2)$를 거듭제곱의 미분법으로 미분하면 속도는 $(9,\\,12-10t)$이다.\n$t=\\frac{12}{5}$를 대입하면 수직 속도는 $12-10\\cdot\\frac{12}{5}=12-24=-12$이다.\n속력은 속도 벡터의 크기이므로 $\\sqrt{9^2+(-12)^2}=\\sqrt{81+144}=\\sqrt{225}=15$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-091",
    "problemTypeKey": "PT_DERIVATIVE_MOTION",
    "templateKey": "TPL_MOTION_EVENT_ANALYSIS",
    "crossConceptKeys": [
      "CC_VELOCITY_FROM_POSITION_DERIVATIVE"
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
    "content": "선수가 지면에서 찬 공의 $t$초 후 수평 이동 거리가 $20t\\,\\mathrm m$이고, 높이가 $(15t-5t^2)\\,\\mathrm m$이다. 공이 지면에 다시 닿을 때 속도 벡터의 크기를 구하여라. (단위는 $\\mathrm{m/s}$)",
    "choices": [
      "$15$",
      "$18$",
      "$20$",
      "$24$",
      "$25$"
    ],
    "answer": "⑤",
    "solution": "높이가 $0$이 되는 시각은 $15t-5t^2=0$을 풀어 구한다.\n좌변을 인수분해하면 $5t(3-t)=0$이다.\n(i) $t=0$은 공을 찬 순간이다.\n(ii) $3-t=0$에서 $t=3$이 다시 지면에 닿는 순간이다.\n위치 $(20t,\\,15t-5t^2)$를 거듭제곱의 미분법으로 미분하면 속도는 $(20,\\,15-10t)$이다.\n$t=3$을 대입하면 속도는 $(20,\\,15-30)=(20,-15)$이다.\n속력은 속도 벡터의 크기이므로 $\\sqrt{20^2+(-15)^2}=\\sqrt{400+225}=\\sqrt{625}=25$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-091",
    "problemTypeKey": "PT_DERIVATIVE_MOTION",
    "templateKey": "TPL_MOTION_EVENT_ANALYSIS",
    "crossConceptKeys": [
      "CC_VELOCITY_FROM_POSITION_DERIVATIVE"
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
    "content": "지면에서 던진 공의 $t$초 후 위치가 $(12t,\\,16t-5t^2)$이다. 좌표의 단위는 $\\mathrm m$이다. 공이 최고점에 이르는 시각을 $a$, 지면에 다시 닿는 순간의 속력을 $b$라 할 때, $ab$의 값을 구하여라.",
    "choices": [
      "$32$",
      "$36$",
      "$40$",
      "$44$",
      "$48$"
    ],
    "answer": "①",
    "solution": "위치 $(12t,\\,16t-5t^2)$를 미분하면 속도는 $(12,\\,16-10t)$이다.\n수직 속도 $16-10t$는 $t<\\frac85$에서 양, $t>\\frac85$에서 음이므로 최고점에 이르는 시각은 $a=\\frac85$이다.\n착지 조건 $16t-5t^2=0$을 인수분해하면 $t(16-5t)=0$이다.\n(i) $t=0$은 출발 시각이다.\n(ii) $16-5t=0$에서 착지 시각은 $t=\\frac{16}{5}$이다.\n그때 수직 속도는 $16-10\\cdot\\frac{16}{5}=16-32=-16$이다.\n수평 속도는 $12$로 일정하므로 착지 속력은 $b=\\sqrt{12^2+(-16)^2}=\\sqrt{144+256}=\\sqrt{400}=20$이다.\n따라서 $ab=\\frac85\\cdot20=32$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-091",
    "problemTypeKey": "PT_DERIVATIVE_MOTION",
    "templateKey": "TPL_MOTION_EVENT_ANALYSIS",
    "crossConceptKeys": [
      "CC_VELOCITY_FROM_POSITION_DERIVATIVE",
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
    "content": "방정식 $e^{2x}-\\frac{2e^4}{x}=0$의 서로 다른 모든 실근의 합을 구하여라.",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "①",
    "solution": "좌변을 $f(x)=e^{2x}-\\frac{2e^4}{x}$라 하면 정의역은 $x\\ne0$이다.\n$x=2$를 대입하면 $f(2)=e^4-\\frac{2e^4}{2}=e^4-e^4=0$이다.\n(i) $x<0$이면 $e^{2x}>0$이고 $-\\frac{2e^4}{x}>0$이므로 $f(x)>0$이다.\n따라서 음의 실근은 없다.\n(ii) $x>0$에서 합성함수와 거듭제곱의 미분법으로 $f'(x)=2e^{2x}+\\frac{2e^4}{x^2}>0$이다.\n도함수가 항상 양수이므로 $f$는 $(0,\\infty)$에서 증가하고, 양의 근은 최대 한 개이다.\n이미 $f(2)=0$이므로 양의 근은 $2$뿐이다.\n두 경우를 합치면 실근은 $x=2$ 하나이고 그 합은 $2$이다.\n주의: $x=0$에서는 분모가 $0$이므로 실근 후보에서 제외한다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-091",
    "problemTypeKey": "PT_DERIVATIVE_MOTION",
    "templateKey": "TPL_MOTION_EVENT_ANALYSIS",
    "crossConceptKeys": [
      "CC_EXPONENTIAL_FUNCTION_GRAPH",
      "CC_FUNCTION_MONOTONICITY"
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
    "content": "자연수 $n$에 대하여 $\\frac{e^{2x}}{x}=2(n-3)$의 서로 다른 실근 개수를 $a_n$, $\\frac{2\\ln x}{x}=\\frac1n$의 서로 다른 실근 개수를 $b_n$이라 한다. $\\sum_{n=1}^{8}(a_n+b_n)$의 값을 구하여라.",
    "choices": [
      "$14$",
      "$16$",
      "$18$",
      "$20$",
      "$22$"
    ],
    "answer": "⑤",
    "solution": "첫째 방정식의 좌변을 $f(x)=\\frac{e^{2x}}{x}$라 하면 정의역은 $x\\ne0$이다.\n몫의 미분법으로 $f'(x)=\\frac{2e^{2x}\\cdot x-e^{2x}\\cdot1}{x^2}=\\frac{e^{2x}(2x-1)}{x^2}$이다.\n(i) $x<0$이면 $2x-1<0$이므로 $f'<0$이고, $\\lim_{x\\to0^-}f(x)=-\\infty$, $\\lim_{x\\to-\\infty}f(x)=0$이다.\n우변이 음수인 $n=1,2$에서만 음의 근이 각각 하나씩 있다.\n(ii) $x>0$이면 $x=\\frac12$에서 $f'=0$이고 부호가 음에서 양으로 바뀌므로 최솟값은 $f(\\frac12)=\\frac{e}{1/2}=2e$이다.\n$\\lim_{x\\to0^+}f(x)=\\infty$, $\\lim_{x\\to\\infty}f(x)=\\infty$이므로 $2(n-3)>2e$일 때 양의 근이 두 개이다.\n$e<3$이므로 $2(n-3)>2e$는 $n-3>e$, 즉 $n\\ge6$에서 성립한다.\n따라서 $a_n$은 $n=1,2$에서 $1$, $n=6,7,8$에서 $2$, 나머지에서 $0$이므로 $\\sum_{n=1}^8 a_n=1+1+2+2+2=8$이다.\n둘째 방정식의 좌변을 $g(x)=\\frac{2\\ln x}{x}$라 하면 몫의 미분법으로 $g'(x)=\\frac{\\frac2x\\cdot x-2\\ln x\\cdot1}{x^2}=\\frac{2(1-\\ln x)}{x^2}$이다.\n$x=e$에서 $g'=0$이고 부호가 양에서 음으로 바뀌므로 최댓값은 $g(e)=\\frac{2}{e}$이다.\n$0<x\\le1$에서 $g(x)\\le0$이고, $x>1$에서는 증가 후 감소하여 $\\lim_{x\\to\\infty}g(x)=0$이다.\n따라서 $0<\\frac1n<\\frac2e$일 때 두 근이 생기고, $\\frac1n\\ge\\frac2e$이면 근이 없다.\n$\\frac1n<\\frac2e$는 $n>\\frac e2$이므로 $n\\ge2$에서 두 근이고 $n=1$에서는 근이 없다.\n그러므로 $\\sum_{n=1}^8 b_n=7\\cdot2=14$이고, 두 합은 $8+14=22$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 5,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-091",
    "problemTypeKey": "PT_DERIVATIVE_MOTION",
    "templateKey": "TPL_MOTION_EVENT_ANALYSIS",
    "crossConceptKeys": [
      "CC_ROOT_INTERSECTION_COUNT_FUNCTION",
      "CC_LOGARITHMIC_FUNCTION_GRAPH"
    ],
    "conditionKeys": [
      "COND_NATURAL_NUMBER"
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
    "content": "방정식 $\\ln(2x)-kx=0$이 서로 다른 두 실근을 갖도록 하는 실수 $k$의 범위를 구하여라.",
    "choices": [
      "$0<k<\\frac2e$",
      "$0\\le k<\\frac2e$",
      "$0<k\\le\\frac2e$",
      "$k<0$",
      "$k>\\frac2e$"
    ],
    "answer": "①",
    "solution": "진수 조건에서 $x>0$이므로 $\\ln(2x)-kx=0$의 양변을 $x$로 나누어 $\\frac{\\ln(2x)}{x}=k$로 바꾼다.\n$f(x)=\\frac{\\ln(2x)}{x}$라 하고 몫의 미분법을 쓰면 $f'(x)=\\frac{\\frac1x\\cdot x-\\ln(2x)\\cdot1}{x^2}=\\frac{1-\\ln(2x)}{x^2}$이다.\n$f'(x)=0$이면 $\\ln(2x)=1$이므로 $2x=e$, 즉 $x=\\frac e2$이다.\n$0<x<\\frac e2$에서 $f'>0$, $x>\\frac e2$에서 $f'<0$이므로 최댓값은 $f(\\frac e2)=\\frac{\\ln e}{e/2}=\\frac{2}{e}$이다.\n$\\lim_{x\\to0^+}\\ln(2x)=-\\infty$이므로 $\\lim_{x\\to0^+}f(x)=-\\infty$이다.\n로그함수의 극한 $\\lim_{u\\to\\infty}\\frac{\\ln u}{u}=0$에서 $u=2x$로 두면 $\\lim_{x\\to\\infty}f(x)=0$이다.\n(i) $k\\le0$이면 증가 구간에서 한 번 만나고, 감소 구간의 함숫값은 양수여서 더 만나지 않는다.\n(ii) $0<k<\\frac2e$이면 증가 구간과 감소 구간에서 각각 한 번씩 만나 서로 다른 두 근을 갖는다.\n(iii) $k=\\frac2e$이면 최고점에서 한 번, $k>\\frac2e$이면 만나지 않는다.\n따라서 구하는 범위는 $0<k<\\frac2e$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-091",
    "problemTypeKey": "PT_DERIVATIVE_MOTION",
    "templateKey": "TPL_MOTION_EVENT_ANALYSIS",
    "crossConceptKeys": [
      "CC_LOGARITHMIC_FUNCTION_GRAPH",
      "CC_ROOT_INTERSECTION_COUNT_FUNCTION"
    ],
    "conditionKeys": [],
    "integrationPattern": "REINTERPRETATION"
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
    "content": "다음 각 부등식이 지정된 범위의 모든 $x$에서 성립하도록 하는 상수 $A,B,C$의 최댓값을 각각 구해 $A-B+C$의 값을 구하여라.\n$e^{2x}\\ge2x+A$ ($x\\in\\mathbb R$)\n$x\\ln(x/2)\\ge x+B$ ($x>0$)\n$2x\\ge\\ln(1+2x)+C$ ($x\\ge0$)",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "②",
    "solution": "(i) $e^{2x}\\ge2x+A$에서 $A\\le e^{2x}-2x$이므로 $F(x)=e^{2x}-2x$의 최솟값을 구한다.\n합성함수의 미분법으로 $F'(x)=2e^{2x}-2=2(e^{2x}-1)$이다.\n$x<0$에서 $F'<0$, $x>0$에서 $F'>0$이므로 최솟값은 $F(0)=e^0-0=1$이고 $A$의 최댓값은 $1$이다.\n(ii) $x\\ln\\frac x2\\ge x+B$에서 $B\\le x\\ln\\frac x2-x$이므로 $G(x)=x\\ln\\frac x2-x$의 최솟값을 구한다.\n곱의 미분법으로 $G'(x)=1\\cdot\\ln\\frac x2+x\\cdot\\frac1x-1=\\ln\\frac x2$이다.\n$0<x<2$에서 $G'<0$, $x>2$에서 $G'>0$이므로 최솟값은 $G(2)=2\\ln1-2=-2$이고 $B$의 최댓값은 $-2$이다.\n(iii) $2x\\ge\\ln(1+2x)+C$에서 $C\\le2x-\\ln(1+2x)$이므로 $H(x)=2x-\\ln(1+2x)$의 최솟값을 구한다.\n로그함수의 미분법으로 $H'(x)=2-\\frac{2}{1+2x}=\\frac{2(1+2x)-2}{1+2x}=\\frac{4x}{1+2x}$이다.\n$x\\ge0$에서 $H'\\ge0$이므로 최솟값은 $H(0)=0-\\ln1=0$이고 $C$의 최댓값은 $0$이다.\n따라서 $A-B+C=1-(-2)+0=3$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 5,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-091",
    "problemTypeKey": "PT_DERIVATIVE_MOTION",
    "templateKey": "TPL_MOTION_EVENT_ANALYSIS",
    "crossConceptKeys": [
      "CC_MINIMUM_VALUE_GREATER_THAN_ZERO",
      "CC_EXPONENTIAL_FUNCTION_GRAPH",
      "CC_LOGARITHMIC_FUNCTION_GRAPH"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "NONE"
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
    "content": "$-\\frac\\pi2<x<\\frac\\pi2$에서 방정식 $\\tan x-4x=k$가 서로 다른 세 실근을 갖도록 하는 실수 $k$의 범위를 구하여라. 단, $A=\\frac{4\\pi}{3}-\\sqrt3$이다.",
    "choices": [
      "$-A<k<0$",
      "$0<k<A$",
      "$-A<k<A$",
      "$-A\\le k\\le A$",
      "$k<-A\\text{ 또는 }k>A$"
    ],
    "answer": "③",
    "solution": "$f(x)=\\tan x-4x$라 하면 탄젠트의 미분법으로 $f'(x)=\\sec^2x-4=\\frac{1}{\\cos^2x}-4$이다.\n$f'(x)=0$이면 $\\cos^2x=\\frac14$이고, 주어진 구간에서 $\\cos x>0$이므로 $\\cos x=\\frac12$에서 $x=\\pm\\frac\\pi3$이다.\n$\\frac\\pi3<|x|<\\frac\\pi2$이면 $\\cos x<\\frac12$이므로 $f'>0$이다.\n$|x|<\\frac\\pi3$이면 $\\cos x>\\frac12$이므로 $f'<0$이다.\n따라서 $x=-\\frac\\pi3$에서 극대, $x=\\frac\\pi3$에서 극소이다.\n극댓값은 $f(-\\frac\\pi3)=-\\sqrt3+\\frac{4\\pi}{3}=A$이다.\n극솟값은 $f(\\frac\\pi3)=\\sqrt3-\\frac{4\\pi}{3}=-A$이다.\n탄젠트함수의 극한에서 $\\lim_{x\\to-\\pi/2^+}f(x)=-\\infty$, $\\lim_{x\\to\\pi/2^-}f(x)=\\infty$이다.\n(i) $-A<k<A$이면 증가·감소·증가하는 세 구간에서 각각 한 번씩 만나 서로 다른 세 근을 갖는다.\n(ii) $k=\\pm A$이면 극점에서 접하여 두 근, $k<-A$ 또는 $k>A$이면 한 근뿐이다.\n따라서 구하는 범위는 $-A<k<A$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 5,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-091",
    "problemTypeKey": "PT_DERIVATIVE_MOTION",
    "templateKey": "TPL_MOTION_EVENT_ANALYSIS",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_EQUATION",
      "CC_DERIVATIVE_SIGN_EXTREMA_ANALYSIS"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "REINTERPRETATION"
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
    "content": "모든 실수 $x\\ge0$에 대하여 $x^2-8+ke^{-x}\\ge0$이 성립하도록 하는 실수 $k$의 최솟값을 구하여라.",
    "choices": [
      "$e^2$",
      "$2e^2$",
      "$3e^2$",
      "$4e^2$",
      "$5e^2$"
    ],
    "answer": "④",
    "solution": "$e^x>0$이므로 부등식 $x^2-8+ke^{-x}\\ge0$의 양변에 $e^x$를 곱하면 $(x^2-8)e^x+k\\ge0$이다.\n$f(x)=(x^2-8)e^x$라 두면 모든 $x\\ge0$에서 $f(x)\\ge-k$가 성립해야 한다.\n곱의 미분법으로 $f'(x)=2xe^x+(x^2-8)e^x=e^x(x^2+2x-8)$이다.\n인수분해하면 $f'(x)=e^x(x+4)(x-2)$이다.\n$0\\le x<2$에서 $x-2<0$이라 $f'<0$이므로 $f$는 감소한다.\n$x>2$에서 $f'>0$이므로 $f$는 증가한다.\n따라서 $[0,\\infty)$에서 최솟값은 $f(2)=(4-8)e^2=-4e^2$이다.\n조건은 $-4e^2\\ge-k$, 즉 $k\\ge4e^2$이다.\n그러므로 $k$의 최솟값은 $4e^2$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-091",
    "problemTypeKey": "PT_DERIVATIVE_MOTION",
    "templateKey": "TPL_MOTION_EVENT_ANALYSIS",
    "crossConceptKeys": [
      "CC_MINIMUM_VALUE_GREATER_THAN_ZERO",
      "CC_EXPONENTIAL_FUNCTION_GRAPH"
    ],
    "conditionKeys": [
      "COND_LOWER_BOUND"
    ],
    "integrationPattern": "REINTERPRETATION"
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
    "content": "시각 $t$ ($t\\ge0$)에서 점 $\\mathrm P$의 위치가 $(e^{2t}\\cos t,\\,e^{2t}\\sin t)$이다. 속력이 $\\sqrt5 e^3$일 때의 시각을 $a$, $t=1$에서의 가속도의 크기를 $b$라 할 때, $ab$를 구하여라.",
    "choices": [
      "$\\frac{7e^2}{2}$",
      "$\\frac{9e^2}{2}$",
      "$\\frac{11e^2}{2}$",
      "$\\frac{13e^2}{2}$",
      "$\\frac{15e^2}{2}$"
    ],
    "answer": "⑤",
    "solution": "곱의 미분법으로 위치 $(e^{2t}\\cos t,\\,e^{2t}\\sin t)$를 미분하면 속도는 $\\left(e^{2t}(2\\cos t-\\sin t),\\,e^{2t}(2\\sin t+\\cos t)\\right)$이다.\n속력의 제곱은 $e^{4t}\\left[(2\\cos t-\\sin t)^2+(2\\sin t+\\cos t)^2\\right]$이다.\n괄호 안을 전개하면 $4\\cos^2t-4\\sin t\\cos t+\\sin^2t+4\\sin^2t+4\\sin t\\cos t+\\cos^2t=5(\\sin^2t+\\cos^2t)=5$이다.\n따라서 속력은 $\\sqrt{5e^{4t}}=\\sqrt5e^{2t}$이다.\n속력이 $\\sqrt5e^3$인 시각 $a$는 $\\sqrt5e^{2a}=\\sqrt5e^3$에서 $2a=3$, 즉 $a=\\frac32$이다.\n가속도는 속도를 다시 미분하여 구한다.\n첫째 성분은 $2e^{2t}(2\\cos t-\\sin t)+e^{2t}(-2\\sin t-\\cos t)=e^{2t}(3\\cos t-4\\sin t)$이다.\n둘째 성분은 $2e^{2t}(2\\sin t+\\cos t)+e^{2t}(2\\cos t-\\sin t)=e^{2t}(3\\sin t+4\\cos t)$이다.\n가속도 크기의 제곱은 $e^{4t}\\left[(3\\cos t-4\\sin t)^2+(3\\sin t+4\\cos t)^2\\right]=e^{4t}\\cdot25(\\sin^2t+\\cos^2t)=25e^{4t}$이다.\n$t=1$에서 가속도의 크기는 $b=\\sqrt{25e^4}=5e^2$이다.\n따라서 $ab=\\frac32\\cdot5e^2=\\frac{15e^2}{2}$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-091",
    "problemTypeKey": "PT_DERIVATIVE_MOTION",
    "templateKey": "TPL_MOTION_EVENT_ANALYSIS",
    "crossConceptKeys": [
      "CC_VELOCITY_FROM_POSITION_DERIVATIVE"
    ],
    "conditionKeys": [
      "COND_LOWER_BOUND"
    ],
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
    "content": "시각 $t$ ($t\\ge0$)에서 점 $\\mathrm P$의 위치가 $(2-2\\cos 2t,\\,\\sin 2t)$이다. 속력의 최댓값과 가속도 크기의 최댓값의 합을 구하여라.",
    "choices": [
      "$12$",
      "$14$",
      "$16$",
      "$18$",
      "$20$"
    ],
    "answer": "①",
    "solution": "합성함수의 미분법으로 위치 $(2-2\\cos2t,\\,\\sin2t)$를 미분하면 속도는 $(4\\sin2t,\\,2\\cos2t)$이다.\n속력의 제곱은 $(4\\sin2t)^2+(2\\cos2t)^2=16\\sin^22t+4\\cos^22t$이다.\n$\\cos^22t=1-\\sin^22t$를 대입하면 $16\\sin^22t+4(1-\\sin^22t)=4+12\\sin^22t$이다.\n$0\\le\\sin^22t\\le1$이므로 속력의 제곱은 $16$ 이하이고, $2t=\\frac\\pi2$ 즉 $t=\\frac\\pi4$에서 최대 $16$이다.\n따라서 속력의 최댓값은 $\\sqrt{16}=4$이다.\n속도를 미분하면 가속도는 $(-8\\cos2t,\\,-4\\sin2t)$이다.\n가속도 크기의 제곱은 $64\\cos^22t+16\\sin^22t=64\\cos^22t+16(1-\\cos^22t)=16+48\\cos^22t$이다.\n$\\cos^22t\\le1$이므로 $t=0$에서 최대 $16+48=64$이다.\n따라서 가속도 크기의 최댓값은 $\\sqrt{64}=8$이다.\n주의: 속력과 가속도가 각각 최대가 되는 시각은 $\\frac\\pi4$와 $0$으로 서로 다르다.\n구하는 합은 $4+8=12$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-091",
    "problemTypeKey": "PT_DERIVATIVE_MOTION",
    "templateKey": "TPL_MOTION_EVENT_ANALYSIS",
    "crossConceptKeys": [
      "CC_VELOCITY_FROM_POSITION_DERIVATIVE",
      "CC_TRIGONOMETRIC_EXTREMUM"
    ],
    "conditionKeys": [
      "COND_LOWER_BOUND"
    ],
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
    "content": "시각 $t$에서 점 $\\mathrm P$의 위치가 $(at^2+a\\sin 2t,\\,a\\sin 2t)$이고 $a>0$이다. $t=\\frac\\pi4$에서 가속도의 크기가 $6\\sqrt5$일 때, 그 순간의 속력을 구하여라.",
    "choices": [
      "$\\pi$",
      "$\\frac{3\\pi}{2}$",
      "$2\\pi$",
      "$\\frac{5\\pi}{2}$",
      "$3\\pi$"
    ],
    "answer": "②",
    "solution": "거듭제곱과 합성함수의 미분법으로 위치 $(at^2+a\\sin2t,\\,a\\sin2t)$를 미분하면 속도는 $(2at+2a\\cos2t,\\,2a\\cos2t)$이다.\n속도를 다시 미분하면 가속도는 $(2a-4a\\sin2t,\\,-4a\\sin2t)$이다.\n$t=\\frac\\pi4$에서 $2t=\\frac\\pi2$이므로 $\\sin2t=1$, $\\cos2t=0$이다.\n가속도에 대입하면 $(2a-4a,\\,-4a)=(-2a,-4a)$이다.\n가속도의 크기는 $\\sqrt{(-2a)^2+(-4a)^2}=\\sqrt{20a^2}=2\\sqrt5a$이다.\n조건 $2\\sqrt5a=6\\sqrt5$에서 $a=3$이다.\n속도에 $t=\\frac\\pi4$, $a=3$을 대입하면 $(2\\cdot3\\cdot\\frac\\pi4+2\\cdot3\\cdot0,\\,2\\cdot3\\cdot0)=(\\frac{3\\pi}{2},0)$이다.\n따라서 그 순간의 속력은 $\\sqrt{(\\frac{3\\pi}{2})^2+0^2}=\\frac{3\\pi}{2}$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-091",
    "problemTypeKey": "PT_DERIVATIVE_MOTION",
    "templateKey": "TPL_MOTION_EVENT_ANALYSIS",
    "crossConceptKeys": [
      "CC_VELOCITY_FROM_POSITION_DERIVATIVE"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
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
    "content": "지면 위에서 던진 돌의 $t$초 후 위치가 $(ut,\\,\\frac{3w^2}{2g}+wt-\\frac12gt^2)$이다. 여기서 $u,w,g$는 양수이고, 지면은 $y=0$이다. 돌이 최고점에 이르는 시각과 지면에 닿는 순간의 속력을 차례로 나타낸 것은?",
    "choices": [
      "$\\left(\\frac{w}{g},\\,\\sqrt{u^2+w^2}\\right)$",
      "$\\left(\\frac{2w}{g},\\,\\sqrt{u^2+w^2}\\right)$",
      "$\\left(\\frac{w}{g},\\,\\sqrt{u^2+4w^2}\\right)$",
      "$\\left(\\frac{2w}{g},\\,\\sqrt{u^2+4w^2}\\right)$",
      "$\\left(\\frac{3w}{g},\\,\\sqrt{u^2+4w^2}\\right)$"
    ],
    "answer": "③",
    "solution": "위치 $(ut,\\,\\frac{3w^2}{2g}+wt-\\frac12gt^2)$를 거듭제곱의 미분법으로 미분하면 속도는 $(u,\\,w-gt)$이다.\n최고점에서는 수직 속도가 $0$이 되므로 $w-gt=0$에서 $t=\\frac wg$이다.\n$t<\\frac wg$에서 $w-gt>0$, $t>\\frac wg$에서 $w-gt<0$이므로 이때 높이가 최대이다.\n지면에 닿는 시각은 $\\frac{3w^2}{2g}+wt-\\frac12gt^2=0$을 푼다.\n양변에 $-2g$를 곱하면 $g^2t^2-2gwt-3w^2=0$이다.\n좌변을 인수분해하면 $(gt-3w)(gt+w)=0$이다.\n(i) $gt+w=0$이면 $t=-\\frac wg<0$이므로 버린다.\n(ii) $gt-3w=0$이면 $t=\\frac{3w}{g}$이고 이것이 착지 시각이다.\n이때 수직 속도는 $w-g\\cdot\\frac{3w}{g}=w-3w=-2w$이다.\n수평 속도는 $u$로 일정하므로 착지 순간의 속력은 $\\sqrt{u^2+(-2w)^2}=\\sqrt{u^2+4w^2}$이다.\n따라서 최고점 시각과 착지 속력은 $\\left(\\frac wg,\\,\\sqrt{u^2+4w^2}\\right)$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 5,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-091",
    "problemTypeKey": "PT_DERIVATIVE_MOTION",
    "templateKey": "TPL_MOTION_EVENT_ANALYSIS",
    "crossConceptKeys": [
      "CC_VELOCITY_FROM_POSITION_DERIVATIVE",
      "CC_DERIVATIVE_ROOT_SOLVING"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
