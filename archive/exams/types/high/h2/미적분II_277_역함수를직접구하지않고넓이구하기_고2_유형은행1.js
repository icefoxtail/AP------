window.examTitle = "미적분II_277_역함수를직접구하지않고넓이구하기_고2_유형은행1";

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
    "content": "그림과 같이 곡선 $y=\\sin 2x$ $\\left(0 \\le x \\le \\frac{\\pi}{4}\\right)$와 $y$축 및 두 직선 $y=\\frac{1}{2}$, $y=1$로 둘러싸인 도형의 넓이는? [그림: 좌표평면의 제1사분면에 곡선 $y=\\sin 2x$ $\\left(0 \\le x \\le \\frac{\\pi}{4}\\right)$가 원점 $(0,0)$에서 시작하여 점 $\\left(\\frac{\\pi}{4}, 1\\right)$까지 증가하는 모양으로 그려져 있다. $y$축 위의 점 $\\left(0, \\frac{1}{2}\\right)$과 $(0, 1)$을 지나고 $x$축에 평행한 두 직선 $y=\\frac{1}{2}$, $y=1$이 곡선과 만나는 점의 $x$좌표는 각각 $\\frac{\\pi}{12}$, $\\frac{\\pi}{4}$이다. 곡선 $y=\\sin 2x$와 $y$축 및 두 직선 $y=\\frac{1}{2}$, $y=1$로 둘러싸인 도형이 색칠되어 있다.]",
    "choices": [
      "$\\frac{1}{6}\\pi - \\frac{\\sqrt{3}}{4}$",
      "$\\frac{5}{24}\\pi - \\frac{\\sqrt{3}}{4}$",
      "$\\frac{1}{4}\\pi - \\frac{\\sqrt{3}}{4}$",
      "$\\frac{7}{24}\\pi - \\frac{\\sqrt{3}}{4}$",
      "$\\frac{1}{3}\\pi - \\frac{\\sqrt{3}}{4}$"
    ],
    "answer": "②",
    "solution": "두 교점의 $x$좌표 구하기: $\\sin 2x=\\frac{1}{2}$에서 $2x=\\frac{\\pi}{6}$이므로 $x=\\frac{\\pi}{12}$이고, $\\sin 2x=1$에서 $2x=\\frac{\\pi}{2}$이므로 $x=\\frac{\\pi}{4}$이다.\n$y$에 대한 정적분으로 넓이 나타내기: 도형의 넓이는 $S=\\int_{1/2}^{1} x\\,dy$이고, $y=\\sin 2x$에서 $x=\\frac{1}{2}\\arcsin y$이다.\n역삼각함수의 부정적분 공식 적용: $\\int \\arcsin y\\,dy=y\\arcsin y+\\sqrt{1-y^2}+C$이다.\n정적분 계산: $S=\\frac{1}{2}\\left[ y\\arcsin y+\\sqrt{1-y^2}\\right]_{1/2}^{1}=\\frac{1}{2}\\left\\{ \\frac{\\pi}{2}-\\left(\\frac{\\pi}{12}+\\frac{\\sqrt{3}}{2}\\right)\\right\\}$이다.\n값 정리: $S=\\frac{1}{2}\\left(\\frac{5\\pi}{12}-\\frac{\\sqrt{3}}{2}\\right)=\\frac{5}{24}\\pi-\\frac{\\sqrt{3}}{4}$이다.\n주의: $\\arcsin\\frac{1}{2}=\\frac{\\pi}{6}$이고 $\\sqrt{1-\\left(\\frac{1}{2}\\right)^2}=\\frac{\\sqrt{3}}{2}$임을 정확히 대입한다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-102",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "REINTERPRETATION"
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
    "content": "그림은 함수 $f(x)=xe^x$ $(0 \\le x \\le 2)$의 그래프이다. 함수 $f(x)$의 역함수를 $g(x)$라 할 때, $\\int_0^{2e^2} g(x)\\,dx$의 값은? [그림: 좌표평면의 제1사분면에 함수 $f(x)=xe^x$ ($0 \\le x \\le 2$)의 그래프가 원점 $(0,0)$에서 시작하여 점 $(2, 2e^2)$까지 아래로 볼록하게 증가하는 곡선으로 그려져 있다. 점 $(2, 2e^2)$에서 $x$축에 내린 수선의 발에 $2$, $y$축에 내린 수선의 발에 $2e^2$이 표시되어 있다.]",
    "choices": [
      "$2e^2 - 2$",
      "$2e^2 - 1$",
      "$3e^2 - 3$",
      "$3e^2 - 2$",
      "$3e^2 - 1$"
    ],
    "answer": "⑤",
    "solution": "함숫값 확인: $f(0)=0\\cdot e^0=0$, $f(2)=2e^2$이다.\n역함수의 함숫값 확인: $f(0)=0$이므로 $g(0)=0$, $f(2)=2e^2$이므로 $g(2e^2)=2$이다.\n역함수의 정적분 공식 적용: $\\int_{f(a)}^{f(b)} g(x)\\,dx=b f(b)-a f(a)-\\int_a^b f(x)\\,dx$이다.\n$a=0$, $b=2$ 대입: $\\int_0^{2e^2} g(x)\\,dx=2\\cdot 2e^2-0\\cdot 0-\\int_0^2 xe^x\\,dx=4e^2-\\int_0^2 xe^x\\,dx$이다.\n부분적분법 설정: $u=x$, $v'=e^x$로 놓으면 $u'=1$, $v=e^x$이다.\n부분적분법 계산: $\\int_0^2 xe^x\\,dx=\\left[ xe^x\\right]_0^2-\\int_0^2 e^x\\,dx=2e^2-\\left(e^2-1\\right)=e^2+1$이다.\n최종 계산: $\\int_0^{2e^2} g(x)\\,dx=4e^2-(e^2+1)=3e^2-1$이다.\n주의: $g$의 적분구간 아래끝은 $f(0)=0$이므로 $0$부터 적분한다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-102",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_INTEGRATION_BY_PARTS_OR_EXPANSION"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "REINTERPRETATION"
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
    "content": "실수 전체의 집합에서 정의된 함수 $f(x)=(2x^2+a)e^x$의 역함수가 존재하기 위한 상수 $a$의 최솟값을 $m$이라 하자. 함수 $g(x)=(2x^2+m)e^x$의 역함수를 $h(x)$라 할 때, $\\int_m^{4e} h(x)\\,dx$의 값은?",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "⑤",
    "solution": "역함수 존재 조건: $f$가 연속이고 일대일대응이어야 하므로 모든 실수 $x$에서 $f'(x)\\ge 0$이어야 한다.\n도함수 계산(곱의 미분법): $f'(x)=4xe^x+(2x^2+a)e^x=(2x^2+4x+a)e^x$이다.\n부등식 정리: $e^x>0$이므로 모든 $x$에서 $2x^2+4x+a\\ge 0$이어야 한다.\n판별식 적용: $\\frac{D}{4}=2^2-2a=4-2a\\le 0$이다.\n$a$의 범위: $4-2a\\le 0$에서 $a\\ge 2$이므로 최솟값은 $m=2$이다.\n$g$의 함숫값 확인: $g(x)=(2x^2+2)e^x$에서 $g(0)=2$, $g(1)=4e$이므로 $h(2)=0$, $h(4e)=1$이다.\n역함수의 정적분 공식 적용: $\\int_2^{4e} h(x)\\,dx=1\\cdot g(1)-0\\cdot g(0)-\\int_0^1 g(x)\\,dx=4e-\\int_0^1 (2x^2+2)e^x\\,dx$이다.\n부분적분법으로 부정적분 구하기: $\\int (2x^2+2)e^x\\,dx=(2x^2-4x+6)e^x+C$이다.\n정적분 계산: $\\int_0^1 (2x^2+2)e^x\\,dx=\\left[(2x^2-4x+6)e^x\\right]_0^1=4e-6$이다.\n최종 계산: $\\int_2^{4e} h(x)\\,dx=4e-(4e-6)=6$이다.\n주의: $D=0$인 $a=2$일 때 $f'$이 한 점에서만 $0$이므로 여전히 일대일대응이 되어 $a=2$를 포함한다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-102",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_POLYNOMIAL_INEQUALITY_DERIVATIVE",
      "CC_INTEGRATION_BY_PARTS_OR_EXPANSION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
