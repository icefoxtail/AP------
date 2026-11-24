window.examTitle = "미적분II_255_정적분으로정의된함수의극대극소_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "여러 가지 적분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-07",
    "standardUnit": "여러 가지 적분법",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 적분법"
    ],
    "wide": false,
    "content": "$x > 0$일 때, 함수 $f(x)$에 대하여\n$$f(x) = \\int_1^x (2 - \\ln t)\\,dt$$\n일 때, 함수 $f(x)$는 $x = a$에서 극댓값 $b$를 갖는다. $a - b$의 값은?",
    "choices": [
      "2",
      "3",
      "4",
      "5",
      "6"
    ],
    "answer": "②",
    "solution": "[미적분의 기본정리] 위끝이 $x$인 정적분으로 정의된 함수이므로 양변을 $x$에 대하여 미분한다.\n$$f'(x)=\\frac{d}{dx}\\int_1^x (2-\\ln t)\\,dt=2-\\ln x$$\n[증감 조사] $0<x<e^2$이면 $\\ln x<2$이므로 $f'(x)>0$이고, $x>e^2$이면 $\\ln x>2$이므로 $f'(x)<0$이다.\n[극대 판정] $f'(x)$가 양에서 음으로 바뀌므로 $x=e^2$에서 극댓값을 갖는다. 즉 $a=e^2$이다.\n[부분적분법] $\\int \\ln t\\,dt=t\\ln t-t+C$를 이용하여 부정적분을 구한다.\n$$\\int (2-\\ln t)\\,dt=2t-(t\\ln t-t)+C=3t-t\\ln t+C$$\n[극댓값 계산] 위끝 $e^2$, 아래끝 $1$을 대입한다.\n$$b=f(e^2)=\\left[3t-t\\ln t\\right]_1^{e^2}=(3e^2-e^2\\ln e^2)-(3\\cdot1-1\\cdot\\ln 1)$$\n$$=(3e^2-2e^2)-(3-0)=e^2-3$$\n주의: $\\ln e^2=2$, $\\ln 1=0$을 정확히 대입하고 $2t-(t\\ln t-t)$의 부호 분배에 유의한다.\n[구하는 값] $a-b=e^2-(e^2-3)=3$\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-186",
    "problemTypeKey": "PT_DEFINITE_INTEGRAL_FUNCTION_RELATION",
    "templateKey": "TPL_INTEGRAL_DEFINED_FUNCTION_ANALYSIS",
    "crossConceptKeys": [
      "CC_DEFINITE_INTEGRAL",
      "CC_INTEGRATION_BY_PARTS_OR_EXPANSION"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 2,
    "category": "여러 가지 적분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-07",
    "standardUnit": "여러 가지 적분법",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 적분법"
    ],
    "wide": false,
    "content": "$x > 0$일 때, 함수 $f(x) = \\int_0^x (\\sqrt{t} - t^2)\\,dt$의 극댓값은?",
    "choices": [
      "$\\frac{1}{3}$",
      "$\\frac{1}{2}$",
      "$\\frac{2}{3}$",
      "$1$",
      "$\\frac{4}{3}$"
    ],
    "answer": "①",
    "solution": "[미적분의 기본정리] 양변을 $x$에 대하여 미분한다.\n$$f'(x)=\\frac{d}{dx}\\int_0^x (\\sqrt{t}-t^2)\\,dt=\\sqrt{x}-x^2$$\n[인수분해] 공통인수 $\\sqrt{x}$로 묶는다.\n$$f'(x)=\\sqrt{x}\\,(1-x^{\\frac{3}{2}})$$\n[극값의 후보] $x>0$이므로 $\\sqrt{x}>0$이고, $1-x^{\\frac{3}{2}}=0$에서 $x^{\\frac{3}{2}}=1$, 즉 $x=1$이다.\n[부호 조사] $0<x<1$이면 $x^{\\frac{3}{2}}<1$이므로 $f'(x)>0$이고, $x>1$이면 $x^{\\frac{3}{2}}>1$이므로 $f'(x)<0$이다.\n[극대 판정] $f'(x)$가 양에서 음으로 바뀌므로 $x=1$에서 극댓값을 갖는다.\n[거듭제곱의 적분법] $\\int t^n\\,dt=\\frac{1}{n+1}t^{n+1}+C$를 적용한다.\n$$f(1)=\\int_0^1 (t^{\\frac{1}{2}}-t^2)\\,dt=\\left[\\frac{2}{3}t^{\\frac{3}{2}}-\\frac{1}{3}t^3\\right]_0^1$$\n[대입 계산] $=\\left(\\frac{2}{3}\\cdot1-\\frac{1}{3}\\cdot1\\right)-(0-0)=\\frac{1}{3}$\n주의: $t^{\\frac{1}{2}}$의 적분 계수는 $\\frac{1}{\\frac{1}{2}+1}=\\frac{2}{3}$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-186",
    "problemTypeKey": "PT_DEFINITE_INTEGRAL_FUNCTION_RELATION",
    "templateKey": "TPL_INTEGRAL_DEFINED_FUNCTION_ANALYSIS",
    "crossConceptKeys": [
      "CC_DEFINITE_INTEGRAL"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 3,
    "category": "여러 가지 적분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-07",
    "standardUnit": "여러 가지 적분법",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 적분법"
    ],
    "wide": false,
    "content": "함수 $f(x) = \\int_0^x (2 - 2\\sin t)\\cos t\\,dt$의 극댓값을 $M$, 극솟값을 $m$이라 할 때, $M - m$의 값은? (단, $0 < x < 2\\pi$)",
    "choices": [
      "0",
      "1",
      "2",
      "3",
      "4"
    ],
    "answer": "⑤",
    "solution": "[미적분의 기본정리] 양변을 $x$에 대하여 미분한다.\n$$f'(x)=(2-2\\sin x)\\cos x=2(1-\\sin x)\\cos x$$\n[부호 분석] $-1\\le\\sin x\\le1$이므로 $1-\\sin x\\ge0$이고, 등호는 $x=\\frac{\\pi}{2}$에서만 성립한다. 따라서 $f'(x)$의 부호는 $\\cos x$의 부호로 결정된다.\n[구간별 부호 조사] (i) $0<x<\\frac{\\pi}{2}$이면 $\\cos x>0$이므로 $f'(x)>0$ (ii) $\\frac{\\pi}{2}<x<\\frac{3\\pi}{2}$이면 $\\cos x<0$이므로 $f'(x)<0$ (iii) $\\frac{3\\pi}{2}<x<2\\pi$이면 $\\cos x>0$이므로 $f'(x)>0$\n[극값 판정] $x=\\frac{\\pi}{2}$에서 양에서 음으로 바뀌므로 극대, $x=\\frac{3\\pi}{2}$에서 음에서 양으로 바뀌므로 극소이다.\n[치환적분법] $u=\\sin t$로 놓으면 $du=\\cos t\\,dt$이고, $t=0$일 때 $u=0$, $t=x$일 때 $u=\\sin x$이다.\n$$f(x)=\\int_0^{\\sin x}(2-2u)\\,du=\\left[2u-u^2\\right]_0^{\\sin x}=2\\sin x-\\sin^2 x$$\n[극댓값] $M=f\\left(\\frac{\\pi}{2}\\right)=2\\cdot1-1^2=1$\n[극솟값] $m=f\\left(\\frac{3\\pi}{2}\\right)=2\\cdot(-1)-(-1)^2=-2-1=-3$\n주의: $1-\\sin x$는 항상 $0$ 이상이므로 $x=\\frac{\\pi}{2}$에서의 부호 변화는 $\\cos x$로 판단한다.\n[구하는 값] $M-m=1-(-3)=4$\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-186",
    "problemTypeKey": "PT_DEFINITE_INTEGRAL_FUNCTION_RELATION",
    "templateKey": "TPL_INTEGRAL_DEFINED_FUNCTION_ANALYSIS",
    "crossConceptKeys": [
      "CC_DEFINITE_INTEGRAL",
      "CC_TRIGONOMETRIC_EQUATION"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "CASE_BRANCH"
  }
];
