window.examTitle = "미적분II_272_두곡선사이의넓이와급수_고2_유형은행1";

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
    "content": "자연수 $n$에 대하여 구간 $[0, 1]$에서 함수 $f(x)=x^n(1-x)^2$의 그래프와 $x$축으로 둘러싸인 부분의 넓이를 $S_n$이라 할 때, $\\sum_{n=1}^\\infty S_n$의 값은?",
    "choices": [
      "$\\frac{1}{12}$",
      "$\\frac{1}{10}$",
      "$\\frac{1}{8}$",
      "$\\frac{1}{6}$",
      "$\\frac{1}{4}$"
    ],
    "answer": "④",
    "solution": "구간 $[0,1]$에서 $x^n\\ge 0$, $(1-x)^2\\ge 0$이므로 $f(x)\\ge 0$이고, 넓이는 정적분 $S_n=\\int_0^1 x^n(1-x)^2\\,dx$로 구한다.\n피적분함수 전개: $x^n(1-x)^2=x^n(1-2x+x^2)=x^n-2x^{n+1}+x^{n+2}$\n다항함수의 적분법으로 항별 적분: $S_n=\\left[\\frac{x^{n+1}}{n+1}-\\frac{2x^{n+2}}{n+2}+\\frac{x^{n+3}}{n+3}\\right]_0^1$\n위끝 $1$과 아래끝 $0$ 대입: $S_n=\\frac{1}{n+1}-\\frac{2}{n+2}+\\frac{1}{n+3}$\n통분하여 정리: $S_n=\\frac{(n+2)(n+3)-2(n+1)(n+3)+(n+1)(n+2)}{(n+1)(n+2)(n+3)}=\\frac{2}{(n+1)(n+2)(n+3)}$\n부분분수 분해: $\\frac{2}{(n+1)(n+2)(n+3)}=\\frac{1}{(n+1)(n+2)}-\\frac{1}{(n+2)(n+3)}$\n부분합 계산(망원급수): $T_N=\\sum_{n=1}^N S_n=\\left(\\frac{1}{2\\cdot 3}-\\frac{1}{3\\cdot 4}\\right)+\\cdots+\\left(\\frac{1}{(N+1)(N+2)}-\\frac{1}{(N+2)(N+3)}\\right)=\\frac{1}{6}-\\frac{1}{(N+2)(N+3)}$\n주의: 무한급수의 합은 부분합의 극한이므로 마지막에 $N\\to\\infty$ 극한을 취해야 한다.\n극한값 계산: $\\sum_{n=1}^\\infty S_n=\\lim_{N\\to\\infty}\\left(\\frac{1}{6}-\\frac{1}{(N+2)(N+3)}\\right)=\\frac{1}{6}$\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-102",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_POLYNOMIAL_ANTIDERIVATIVE",
      "CC_TELESCOPING_SERIES",
      "CC_SERIES_SUM"
    ],
    "conditionKeys": [
      "COND_NATURAL_NUMBER",
      "COND_RESTRICTED_INTERVAL"
    ],
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
    "content": "자연수 $n$에 대하여 곡선 $y=(2n+1)\\cos x$와 $x$축 및 두 직선 $x=0$, $x=\\pi$로 둘러싸인 도형의 넓이를 $a_n$이라 할 때, $\\sum_{k=1}^{10} a_k$의 값은?",
    "choices": [
      "$220$",
      "$240$",
      "$260$",
      "$280$",
      "$300$"
    ],
    "answer": "②",
    "solution": "$0\\le x\\le\\frac{\\pi}{2}$에서 $\\cos x\\ge 0$, $\\frac{\\pi}{2}\\le x\\le\\pi$에서 $\\cos x\\le 0$임을 확인한다.\n주의: $x$축 아래에 있는 부분은 절댓값을 취해 양수로 적분해야 넓이가 된다.\n구간을 나눈 넓이 식: $a_n=\\int_0^{\\pi/2}(2n+1)\\cos x\\,dx+\\int_{\\pi/2}^{\\pi}-(2n+1)\\cos x\\,dx$\n정적분의 기본정리 적용: $a_n=(2n+1)[\\sin x]_0^{\\pi/2}-(2n+1)[\\sin x]_{\\pi/2}^{\\pi}$\n위끝과 아래끝 대입: $a_n=(2n+1)(1-0)-(2n+1)(0-1)=(2n+1)+(2n+1)=4n+2$\n합 분리: $\\sum_{k=1}^{10}a_k=\\sum_{k=1}^{10}(4k+2)=4\\sum_{k=1}^{10}k+\\sum_{k=1}^{10}2$\n자연수 거듭제곱의 합 $\\sum_{k=1}^{n}k=\\frac{n(n+1)}{2}$ 대입: $4\\cdot\\frac{10\\cdot 11}{2}+2\\cdot 10=4\\cdot 55+20=220+20=240$\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-102",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_PIECEWISE_INTEGRAL_EVALUATION",
      "CC_SERIES_SUM"
    ],
    "conditionKeys": [
      "COND_NATURAL_NUMBER"
    ],
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
    "content": "자연수 $n$에 대하여 구간 $\\left[0, \\frac{\\pi}{n}\\right]$에서 함수 $f(x)=\\frac{4}{n+2}\\sin nx$의 그래프와 $x$축으로 둘러싸인 도형의 넓이를 $S_n$이라 할 때, $\\sum_{n=1}^\\infty S_n$의 값은?",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "⑤",
    "solution": "$0\\le x\\le\\frac{\\pi}{n}$이면 $0\\le nx\\le\\pi$이므로 $\\sin nx\\ge 0$, 즉 $f(x)\\ge 0$이다.\n정적분으로 넓이 식 세우기: $S_n=\\int_0^{\\pi/n}\\frac{4}{n+2}\\sin nx\\,dx$\n삼각함수의 적분법: $\\int\\sin nx\\,dx=-\\frac{1}{n}\\cos nx+C$\n위끝과 아래끝 대입: $S_n=\\frac{4}{n+2}\\left[-\\frac{1}{n}\\cos nx\\right]_0^{\\pi/n}=\\frac{4}{n(n+2)}(-\\cos\\pi+\\cos 0)$\n특수각 값 대입: $\\cos\\pi=-1$, $\\cos 0=1$이므로 $S_n=\\frac{4}{n(n+2)}(1+1)=\\frac{8}{n(n+2)}$\n부분분수 분해: $\\frac{8}{n(n+2)}=4\\left(\\frac{1}{n}-\\frac{1}{n+2}\\right)$\n부분합 전개: $T_N=4\\left[\\left(1-\\frac{1}{3}\\right)+\\left(\\frac{1}{2}-\\frac{1}{4}\\right)+\\cdots+\\left(\\frac{1}{N}-\\frac{1}{N+2}\\right)\\right]=4\\left(1+\\frac{1}{2}-\\frac{1}{N+1}-\\frac{1}{N+2}\\right)$\n주의: 항이 두 칸씩 소거되므로 앞의 두 항 $1,\\frac{1}{2}$과 뒤의 두 항이 남는다.\n극한값 계산: $\\sum_{n=1}^\\infty S_n=\\lim_{N\\to\\infty}T_N=4\\left(1+\\frac{1}{2}\\right)=4\\cdot\\frac{3}{2}=6$\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-102",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_SERIES_SUM",
      "CC_TELESCOPING_SERIES"
    ],
    "conditionKeys": [
      "COND_NATURAL_NUMBER",
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 4,
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
    "content": "자연수 $n$에 대하여 닫힌 구간 $[(n-1)\\pi, n\\pi]$에서 곡선 $y=\\left(\\frac{3}{5}\\right)^n \\sin x$와 $x$축으로 둘러싸인 부분의 넓이를 $S_n$이라 할 때, $\\sum_{n=1}^\\infty S_n$의 값은?",
    "choices": [
      "$3$",
      "$4$",
      "$5$",
      "$6$",
      "$7$"
    ],
    "answer": "①",
    "solution": "$n$의 홀짝에 따라 구간 $[(n-1)\\pi,n\\pi]$에서 $\\sin x$의 부호가 달라지므로 경우를 나눈다.\n(i) $n$이 홀수일 때: $n-1$이 짝수이므로 $\\sin x\\ge 0$이고 $S_n=\\left(\\frac{3}{5}\\right)^n\\int_{(n-1)\\pi}^{n\\pi}\\sin x\\,dx=\\left(\\frac{3}{5}\\right)^n[-\\cos x]_{(n-1)\\pi}^{n\\pi}$\n대입: $S_n=-\\left(\\frac{3}{5}\\right)^n(\\cos n\\pi-\\cos(n-1)\\pi)=-\\left(\\frac{3}{5}\\right)^n(-1-1)=2\\left(\\frac{3}{5}\\right)^n$\n(ii) $n$이 짝수일 때: $n-1$이 홀수이므로 $\\sin x\\le 0$이고 $S_n=-\\left(\\frac{3}{5}\\right)^n\\int_{(n-1)\\pi}^{n\\pi}\\sin x\\,dx=-\\left(\\frac{3}{5}\\right)^n[-\\cos x]_{(n-1)\\pi}^{n\\pi}$\n대입: $S_n=\\left(\\frac{3}{5}\\right)^n(\\cos n\\pi-\\cos(n-1)\\pi)=\\left(\\frac{3}{5}\\right)^n(1+1)=2\\left(\\frac{3}{5}\\right)^n$\n(i), (ii)에 의해 모든 자연수 $n$에 대하여 $S_n=2\\left(\\frac{3}{5}\\right)^n$\n주의: 구간별 부호를 확인하지 않고 그대로 적분하면 $n$이 짝수일 때 넓이가 음수로 나온다.\n첫째항 $a=S_1=2\\cdot\\frac{3}{5}=\\frac{6}{5}$, 공비 $r=\\frac{3}{5}$이고 $|r|<1$이므로 무한등비급수가 수렴한다.\n무한등비급수의 합 $S=\\frac{a}{1-r}$ 적용: $\\sum_{n=1}^\\infty S_n=\\frac{6/5}{1-3/5}=\\frac{6/5}{2/5}=3$\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-102",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_GEOMETRIC_SEQUENCE",
      "CC_SERIES_SUM"
    ],
    "conditionKeys": [
      "COND_NATURAL_NUMBER",
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
