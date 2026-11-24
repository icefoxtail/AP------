window.examTitle = "미적분II_256_정적분으로정의된함수의최대최소_고2_유형은행1";

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
    "content": "$0 \\le x \\le \\pi$에서 정의된 함수\n$$f(x) = \\int_0^x (2\\sin t - 1) \\,dt$$\n의 최댓값을 $M$, 최솟값을 $m$이라 할 때, $M - m$의 값은?",
    "choices": [
      "$2\\sqrt{3} - \\pi$",
      "$\\sqrt{3} - \\dfrac{\\pi}{3}$",
      "$2\\sqrt{3} - \\dfrac{2}{3}\\pi$",
      "$3\\sqrt{3} - \\pi$",
      "$2\\sqrt{3} - \\dfrac{\\pi}{3}$"
    ],
    "answer": "③",
    "solution": "[1단계] 정적분으로 정의된 함수를 미분한다.\n$f'(x)=2\\sin x-1$ (미적분의 기본정리).\n$f'(x)=0$에서 $\\sin x=\\dfrac{1}{2}$이므로 $x=\\dfrac{\\pi}{6},\\ \\dfrac{5\\pi}{6}$이다.\n[2단계] 도함수의 부호로 증감을 판정한다.\n$0\\le x<\\dfrac{\\pi}{6}$에서 $f'(x)<0$이므로 $f(x)$는 감소한다.\n$\\dfrac{\\pi}{6}<x<\\dfrac{5\\pi}{6}$에서 $f'(x)>0$이므로 $f(x)$는 증가한다.\n$\\dfrac{5\\pi}{6}<x\\le\\pi$에서 $f'(x)<0$이므로 $f(x)$는 감소한다.\n따라서 $x=\\dfrac{\\pi}{6}$에서 극소, $x=\\dfrac{5\\pi}{6}$에서 극대이다.\n[3단계] 원시함수를 구해 후보값을 계산한다.\n$f(x)=\\left[-2\\cos t-t\\right]_0^x=2-2\\cos x-x$.\n$f(0)=0$.\n$f\\left(\\dfrac{\\pi}{6}\\right)=2-\\sqrt{3}-\\dfrac{\\pi}{6}$.\n$f\\left(\\dfrac{5\\pi}{6}\\right)=2+\\sqrt{3}-\\dfrac{5\\pi}{6}$.\n$f(\\pi)=4-\\pi$.\n[4단계] 닫힌구간의 끝값까지 비교한다.\n$f\\left(\\dfrac{5\\pi}{6}\\right)>f(\\pi)>f(0)>f\\left(\\dfrac{\\pi}{6}\\right)$이므로 $M=2+\\sqrt{3}-\\dfrac{5\\pi}{6}$, $m=2-\\sqrt{3}-\\dfrac{\\pi}{6}$이다.\n주의: 극값만 비교하지 말고 $x=0,\\ \\pi$에서의 함숫값도 반드시 비교해야 한다.\n[5단계] $M-m$을 계산한다.\n$M-m=2\\sqrt{3}-\\dfrac{4\\pi}{6}=2\\sqrt{3}-\\dfrac{2\\pi}{3}$.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
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
    "content": "$x > 0$일 때, 함수\n$$f(x) = \\int_1^x (3t - 2t\\ln t) \\,dt$$\n의 최댓값은?",
    "choices": [
      "$\\dfrac{1}{2}(e^3 - 5)$",
      "$\\dfrac{1}{2}(e^3 - 4)$",
      "$\\dfrac{1}{2}(e^3 - 3)$",
      "$\\dfrac{1}{2}(e^3 - 2)$",
      "$\\dfrac{1}{2}(e^3 - 1)$"
    ],
    "answer": "②",
    "solution": "[1단계] 정적분으로 정의된 함수를 미분한다.\n$f'(x)=3x-2x\\ln x=x(3-2\\ln x)$ (미적분의 기본정리).\n$x>0$에서 $f'(x)=0$이려면 $3-2\\ln x=0$, 즉 $\\ln x=\\dfrac{3}{2}$이므로 $x=e^{3/2}$이다.\n[2단계] 도함수의 부호로 증감을 판정한다.\n$0<x<e^{3/2}$에서 $\\ln x<\\dfrac{3}{2}$이므로 $f'(x)>0$이다.\n$x>e^{3/2}$에서 $\\ln x>\\dfrac{3}{2}$이므로 $f'(x)<0$이다.\n따라서 $f(x)$는 $x=e^{3/2}$에서 유일한 극대이자 최댓값을 갖는다.\n[3단계] 부분적분법으로 원시함수를 구한다.\n$\\int 2t\\ln t\\,dt=t^2\\ln t-\\int t\\,dt=t^2\\ln t-\\dfrac{1}{2}t^2+C$.\n따라서 $\\int(3t-2t\\ln t)\\,dt=\\dfrac{3}{2}t^2-t^2\\ln t+\\dfrac{1}{2}t^2=2t^2-t^2\\ln t$이다.\n[4단계] 정적분의 위끝과 아래끝을 대입한다.\n$f(x)=\\left[t^2(2-\\ln t)\\right]_1^x=x^2(2-\\ln x)-1^2(2-0)$\n$=x^2(2-\\ln x)-2$.\n$x=e^{3/2}$일 때 $\\ln e^{3/2}=\\dfrac{3}{2}$이므로\n$f(e^{3/2})=e^3\\left(2-\\dfrac{3}{2}\\right)-2=\\dfrac{1}{2}e^3-2=\\dfrac{1}{2}(e^3-4)$.\n주의: 아래끝 $t=1$에서의 값 $2$를 빼는 계산을 빠뜨리지 않는다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
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
    "content": "함수\n$$f(t) = \\int_0^1 (2e^x - 3tx)^2 \\,dx$$\n가 $t=a$에서 최솟값 $b$를 가질 때, 두 상수 $a, b$에 대하여 $a+b$의 값은?",
    "choices": [
      "$2e^2 - 18$",
      "$2e^2 - 16$",
      "$2e^2 - 14$",
      "$2e^2 - 12$",
      "$2e^2 - 10$"
    ],
    "answer": "④",
    "solution": "[1단계] 피적분함수를 전개한다.\n$(2e^x-3tx)^2=4e^{2x}-12txe^x+9t^2x^2$.\n$x$에 대한 적분이므로 $t$는 상수로 본다.\n$f(t)=9t^2\\int_0^1x^2\\,dx-12t\\int_0^1xe^x\\,dx+4\\int_0^1e^{2x}\\,dx$.\n[2단계] 각 정적분을 계산한다.\n$\\int_0^1x^2\\,dx=\\left[\\dfrac{x^3}{3}\\right]_0^1=\\dfrac{1}{3}$이므로 $t^2$의 계수는 $9\\cdot\\dfrac{1}{3}=3$이다.\n부분적분법에서 $u=x$, $v'=e^x$로 두면 $\\int_0^1xe^x\\,dx=\\left[xe^x\\right]_0^1-\\int_0^1e^x\\,dx=e-(e-1)=1$이다.\n따라서 $t$의 계수는 $-12\\cdot1=-12$이다.\n$\\int_0^1e^{2x}\\,dx=\\left[\\dfrac{1}{2}e^{2x}\\right]_0^1=\\dfrac{1}{2}(e^2-1)$이므로 상수항은 $4\\cdot\\dfrac{1}{2}(e^2-1)=2e^2-2$이다.\n[3단계] $t$에 대한 이차식으로 정리하고 완전제곱한다.\n$f(t)=3t^2-12t+2e^2-2$.\n$=3(t^2-4t+4)-12+2e^2-2$\n$=3(t-2)^2+2e^2-14$.\n[4단계] 최솟값과 $a+b$를 구한다.\n이차함수의 최솟값 성질에서 $t=2$일 때 최솟값 $b=2e^2-14$이므로 $a=2$이다.\n$a+b=2+2e^2-14=2e^2-12$.\n주의: 상수항 $2e^2-2$와 완전제곱 과정에서 더한 값 $12$를 혼동하지 않는다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-186",
    "problemTypeKey": "PT_DEFINITE_INTEGRAL_FUNCTION_RELATION",
    "templateKey": "TPL_INTEGRAL_DEFINED_FUNCTION_ANALYSIS",
    "crossConceptKeys": [
      "CC_DEFINITE_INTEGRAL",
      "CC_QUADRATIC_EXTREMUM"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
