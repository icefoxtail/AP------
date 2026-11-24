window.examTitle = "미적분II_273_두도형의넓이가서로같은경우_고2_유형은행1";

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
    "content": "그림과 같이 곡선 $y=\\cos\\frac{\\pi}{3}x$와 직선 $y=k$ 및 두 직선 $x=0, x=1$로 둘러싸인 두 도형을 각각 $A, B$라 하자. 두 도형 $A, B$의 넓이가 서로 같을 때, 상수 $k$의 값은? (단, $\\frac{1}{2} < k < 1$) [그림: 좌표평면에 곡선 $y=\\cos\\frac{\\pi}{3}x$가 제1사분면에서 $(0,1)$부터 $(1,\\frac{1}{2})$까지 감소하는 형태로 그려져 있고, 직선 $y=k$ ($1/2 < k < 1$)가 곡선과 만난다. $x=0$과 교점 사이에서 곡선 위쪽과 직선 $y=k$ 아래쪽 영역이 $A$, 교점과 $x=1$ 사이에서 직선 $y=k$ 위쪽과 곡선 아래쪽 영역이 $B$로 표시되어 있다.]",
    "choices": [
      "$\\frac{\\sqrt{3}}{\\pi}$",
      "$\\frac{5\\sqrt{3}}{4\\pi}$",
      "$\\frac{3\\sqrt{3}}{2\\pi}$",
      "$\\frac{7\\sqrt{3}}{4\\pi}$",
      "$\\frac{2\\sqrt{3}}{\\pi}$"
    ],
    "answer": "③",
    "solution": "구간별 대소 비교: $x=0$에서 곡선은 $1$, $x=1$에서 $\\frac12$이고 $\\frac12<k<1$이므로, 교점 왼쪽에서는 곡선이 $y=k$ 위, 오른쪽에서는 $y=k$가 곡선 위에 있다.\n두 넓이 $A=B$이면 두 함수의 차를 $[0,1]$에서 적분한 값이 $0$이다(정적분의 성질).\n$$\\int_0^1\\left(\\cos\\frac{\\pi}{3}x-k\\right)dx=0$$\n삼각함수의 부정적분 $\\int\\cos(ax)\\,dx=\\frac1a\\sin(ax)+C$를 적용한다.\n$$\\left[\\frac3\\pi\\sin\\frac{\\pi}{3}x-kx\\right]_0^1=0$$\n위끝과 아래끝을 대입한다.\n$$\\left(\\frac3\\pi\\sin\\frac{\\pi}{3}-k\\right)-(0-0)=0$$\n$\\sin\\frac{\\pi}{3}=\\frac{\\sqrt3}{2}$를 대입한다.\n$$\\frac3\\pi\\cdot\\frac{\\sqrt3}{2}-k=0$$\n$k$에 대해 정리하면 $k=\\frac{3\\sqrt3}{2\\pi}$이다.\n주의: $\\frac12<\\frac{3\\sqrt3}{2\\pi}<1$이므로 조건을 만족한다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-102",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_RANGE"
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
    "content": "그림과 같이 곡선 $y=\\sqrt{2x}$와 $y$축 및 두 직선 $x=a, y=4$로 둘러싸인 두 도형을 각각 $A, B$라 하자. 두 도형 $A, B$의 넓이가 서로 같을 때, 상수 $a$의 값은? (단, $a>8$) [그림: 좌표평면에 곡선 $y=\\sqrt{2x}$와 직선 $y=4$, $y$축, 직선 $x=a$ ($a>8$)가 그려져 있다. $0 \\le x \\le 8$에서 직선 $y=4$ 아래와 곡선 위, $y$축으로 둘러싸인 영역이 $A$, $8 \\le x \\le a$에서 곡선 아래와 직선 $y=4$ 위, 직선 $x=a$로 둘러싸인 영역이 $B$로 표시되어 있다.]",
    "choices": [
      "$12$",
      "$14$",
      "$16$",
      "$18$",
      "$20$"
    ],
    "answer": "④",
    "solution": "교점의 $x$좌표: $\\sqrt{2x}=4$의 양변을 제곱하면 $2x=16$, 즉 $x=8$이다.\n$0\\le x\\le8$에서는 $4\\ge\\sqrt{2x}$, $8\\le x\\le a$에서는 $\\sqrt{2x}\\ge4$이므로 두 넓이 $A,B$가 같으면 차의 정적분이 $0$이다.\n$$\\int_0^a(4-\\sqrt{2x})\\,dx=0$$\n$\\sqrt{2x}=\\sqrt2\\,x^{1/2}$이고 $\\int x^{1/2}dx=\\frac23x^{3/2}+C$이므로 다음과 같다.\n$$\\left[4x-\\frac{2\\sqrt2}{3}x^{3/2}\\right]_0^a=0$$\n위끝 $a$와 아래끝 $0$을 대입한다.\n$$4a-\\frac{2\\sqrt2}{3}a^{3/2}=0$$\n$a>0$이므로 $a$를 약분하면 $4-\\frac{2\\sqrt2}{3}\\sqrt a=0$이다.\n$\\sqrt a$에 대해 풀면 $\\sqrt a=\\frac{4\\cdot3}{2\\sqrt2}=3\\sqrt2$이다.\n양변을 제곱하면 $a=18$이다.\n주의: $18>8$이므로 $a>8$을 만족한다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-102",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_RADICAL_FUNCTION",
      "CC_GRAPH_INTERSECTION"
    ],
    "conditionKeys": [
      "COND_RANGE"
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
    "content": "그림과 같이 곡선 $y=\\sqrt{x+4}$와 두 직선 $x=-4, y=2$로 둘러싸인 부분의 넓이와 곡선 $y=\\sqrt{x+4}$와 두 직선 $x=k, y=2$로 둘러싸인 부분의 넓이가 서로 같을 때, 상수 $k$의 값은? (단, $k>0$) [그림: 좌표평면에 곡선 $y=\\sqrt{x+4}$가 시작점 $(-4,0)$부터 제1사분면으로 뻗어가고, 직선 $y=2$와 점 $(0,2)$에서 만난다. $-4 \\le x \\le 0$에서 곡선과 두 직선 $x=-4, y=2$로 둘러싸인 영역이 빗금쳐져 있고, $0 \\le x \\le k$에서 곡선과 두 직선 $x=k, y=2$로 둘러싸인 영역이 색칠되어 있다.]",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "⑤",
    "solution": "교점의 $x$좌표: $\\sqrt{x+4}=2$에서 $x+4=4$, 즉 $x=0$이다.\n$-4\\le x\\le0$에서는 $2\\ge\\sqrt{x+4}$, $0\\le x\\le k$에서는 $\\sqrt{x+4}\\ge2$이므로 두 넓이가 같을 때 차의 정적분은 $0$이다.\n$$\\int_{-4}^k(2-\\sqrt{x+4})\\,dx=0$$\n$\\int(x+4)^{1/2}dx=\\frac23(x+4)^{3/2}+C$를 적용한다.\n$$\\left[2x-\\frac23(x+4)^{3/2}\\right]_{-4}^k=0$$\n위끝 $k$와 아래끝 $-4$를 대입한다.\n$$\\left(2k-\\frac23(k+4)^{3/2}\\right)-(-8-0)=0$$\n정리하면 $2k+8-\\frac23(k+4)^{3/2}=0$이다.\n$t=k+4$로 놓으면 $k=t-4$이므로 $2t-\\frac23t^{3/2}=0$이다.\n$t>0$이므로 $2t$로 나누면 $1-\\frac13\\sqrt t=0$, 즉 $\\sqrt t=3$이다.\n따라서 $t=9$이고 $k=t-4=5$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-102",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_RADICAL_FUNCTION",
      "CC_GRAPH_INTERSECTION"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
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
    "content": "그림과 같이 곡선 $y=e^{2x}$과 $y$축 및 직선 $y=-x+a$로 둘러싸인 영역을 $A$, 곡선 $y=e^{2x}$과 두 직선 $y=-x+a, x=1$로 둘러싸인 영역을 $B$라 하자. $A$의 넓이와 $B$의 넓이가 같을 때, 상수 $a$의 값은? (단, $1 < a < e^2$) [그림: 좌표평면에 곡선 $y=e^{2x}$과 기울기가 $-1$인 직선 $y=-x+a$가 제1사분면에서 만난다. $x=0$부터 교점까지 $y$축, 곡선, 직선으로 둘러싸인 영역이 $A$, 교점부터 $x=1$까지 직선, 곡선, 직선 $x=1$로 둘러싸인 영역이 $B$로 표시되어 있다.]",
    "choices": [
      "$\\frac{e^2-1}{2}$",
      "$\\frac{e^2}{2}$",
      "$\\frac{e^2+1}{2}$",
      "$\\frac{e^2+2}{2}$",
      "$\\frac{e^2+3}{2}$"
    ],
    "answer": "②",
    "solution": "$x=0$에서 $e^0=1<a$이고 $x=1$에서 $e^2>a-1$이므로, 교점 왼쪽은 직선이 위, 오른쪽은 곡선이 위에 있다.\n두 영역 $A,B$의 넓이가 같으면 $[0,1]$에서 차의 정적분이 $0$이다.\n$$\\int_0^1\\left(e^{2x}-(-x+a)\\right)dx=0$$\n피적분함수를 정리한다.\n$$\\int_0^1(e^{2x}+x-a)\\,dx=0$$\n$\\int e^{2x}dx=\\frac12e^{2x}+C$를 이용한다.\n$$\\left[\\frac12e^{2x}+\\frac12x^2-ax\\right]_0^1=0$$\n위끝 $1$과 아래끝 $0$을 대입한다.\n$$\\left(\\frac12e^2+\\frac12-a\\right)-\\left(\\frac12+0-0\\right)=0$$\n동류항을 정리한다.\n$$\\frac12e^2-a=0$$\n따라서 $a=\\frac12e^2$이다.\n주의: $1<\\frac{e^2}{2}<e^2$이므로 $1<a<e^2$를 만족한다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-102",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_EXPONENTIAL_FUNCTION_GRAPH",
      "CC_GRAPH_INTERSECTION",
      "CC_LINEAR_FUNCTIONS"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "INTERDEPENDENT"
  },
  {
    "id": 5,
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
    "content": "그림과 같이 곡선 $y=e^{-x}$에 대하여 이 곡선과 $y$축, 직선 $y=\\sqrt{e}$로 둘러싸인 도형을 $A$, 이 곡선과 $x$축, $y$축 및 직선 $x=k$ ($k>0$)로 둘러싸인 도형을 $B$라 하자. $A$의 넓이와 $B$의 넓이가 서로 같을 때, $k$의 값은? [그림: 좌표평면에 곡선 $y=e^{-x}$가 그려져 있고, 직선 $y=\\sqrt{e}$가 곡선과 제2사분면의 점 $(-\\frac{1}{2}, \\sqrt{e})$에서 만난다. $y$축, 곡선, 직선 $y=\\sqrt{e}$로 둘러싸인 영역이 $A$, $0 \\le x \\le k$에서 곡선 아래와 $x$축, $y$축, 직선 $x=k$로 둘러싸인 영역이 $B$로 표시되어 있다.]",
    "choices": [
      "$-\\ln\\frac{3\\sqrt{e}}{4}$",
      "$-\\ln\\frac{2\\sqrt{e}}{3}$",
      "$-\\ln\\frac{\\sqrt{e}}{2}$",
      "$-\\ln\\frac{2\\sqrt{e}}{5}$",
      "$-\\ln\\frac{\\sqrt{e}}{3}$"
    ],
    "answer": "③",
    "solution": "$A$는 $y$축 방향으로 적분한다. $y=e^{-x}$에서 $x=-\\ln y$이고 $y$가 $1$에서 $\\sqrt e$까지 변할 때 폭은 $0-(-\\ln y)=\\ln y$이다.\n$$A=\\int_1^{\\sqrt e}\\ln y\\,dy$$\n부분적분법 $\\int\\ln y\\,dy=y\\ln y-y+C$를 적용한다.\n$$A=\\left[y\\ln y-y\\right]_1^{\\sqrt e}$$\n위끝 $\\sqrt e$와 아래끝 $1$을 대입한다.\n$$A=\\left(\\sqrt e\\cdot\\frac12-\\sqrt e\\right)-(0-1)=1-\\frac{\\sqrt e}{2}$$\n$B$는 $x$축 방향으로 적분한다.\n$$B=\\int_0^k e^{-x}dx=\\left[-e^{-x}\\right]_0^k=1-e^{-k}$$\n$A=B$이므로 $1-\\frac{\\sqrt e}{2}=1-e^{-k}$이다.\n양변에서 $1$을 소거하면 $e^{-k}=\\frac{\\sqrt e}{2}$이다.\n자연로그를 취하면 $-k=\\ln\\frac{\\sqrt e}{2}$, 즉 $k=-\\ln\\frac{\\sqrt e}{2}$이다.\n주의: $\\frac{\\sqrt e}{2}<1$이므로 $k>0$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-102",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_EXPONENTIAL_FUNCTION_GRAPH"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 6,
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
    "content": "곡선 $y=\\ln x$와 두 직선 $x=1, y=a$로 둘러싸인 부분의 넓이와 곡선 $y=\\ln x$와 두 직선 $x=e^2, y=a$로 둘러싸인 부분의 넓이가 서로 같을 때, 실수 $a$의 값은? (단, $0 < a < 2$) [그림: 좌표평면에 곡선 $y=\\ln x$와 직선 $y=a$ ($0<a<2$)가 그려져 있다. $x=1$부터 교점 $(e^a, a)$까지 직선 $y=a$, 곡선 $y=\\ln x$, 직선 $x=1$로 둘러싸인 영역과, 교점부터 $x=e^2$까지 곡선 $y=\\ln x$, 직선 $y=a$, 직선 $x=e^2$으로 둘러싸인 영역이 각각 색칠되어 있다.]",
    "choices": [
      "$\\frac{e^2+1}{e^2-1}$",
      "$\\frac{e^2+2}{e^2-1}$",
      "$\\frac{e^2+3}{e^2-1}$",
      "$\\frac{e^2+4}{e^2-1}$",
      "$\\frac{e^2+5}{e^2-1}$"
    ],
    "answer": "①",
    "solution": "교점의 $x$좌표: $\\ln x=a$에서 $x=e^a$이고 $0<a<2$이므로 $1<e^a<e^2$이다.\n$1\\le x\\le e^a$에서는 $a\\ge\\ln x$, $e^a\\le x\\le e^2$에서는 $\\ln x\\ge a$이므로 두 넓이가 같으면 차의 정적분이 $0$이다.\n$$\\int_1^{e^2}(\\ln x-a)\\,dx=0$$\n$\\int\\ln x\\,dx=x\\ln x-x+C$를 적용한다.\n$$\\left[x\\ln x-x-ax\\right]_1^{e^2}=0$$\n위끝 $e^2$과 아래끝 $1$을 대입한다.\n$$\\left(e^2\\ln e^2-e^2-ae^2\\right)-(1\\ln1-1-a)=0$$\n$\\ln e^2=2$, $\\ln1=0$을 대입한다.\n$$(2e^2-e^2-ae^2)-(-1-a)=0$$\n동류항을 정리한다.\n$$e^2+1-a(e^2-1)=0$$\n$a$에 대해 풀면 $a(e^2-1)=e^2+1$이다.\n$$a=\\frac{e^2+1}{e^2-1}$$\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-102",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_LOGARITHMIC_FUNCTION_GRAPH",
      "CC_GRAPH_INTERSECTION"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "INTERDEPENDENT"
  },
  {
    "id": 7,
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
    "content": "두 곡선 $y=a\\sin x$와 $y=3\\cos x$ 및 두 직선 $x=0$과 $x=\\frac{\\pi}{3}$로 둘러싸인 도형에서 색칠한 두 부분의 넓이가 같을 때, 상수 $a$의 값은? (단, $a>\\sqrt{3}$) [그림: 좌표평면에 두 곡선 $y=a\\sin x$와 $y=3\\cos x$가 $0 \\le x \\le \\frac{\\pi}{3}$ 범위에서 그려져 있다. $x=0$에서 $y=3\\cos x$가 위쪽에 있고 두 곡선이 교점을 가지며, $x=\\frac{\\pi}{3}$에서는 $y=a\\sin x$가 위쪽에 있다. 교점을 기준으로 왼쪽 영역과 오른쪽 영역이 각각 색칠되어 있다.]",
    "choices": [
      "$\\sqrt{3}$",
      "$\\frac{3\\sqrt{3}}{2}$",
      "$2\\sqrt{3}$",
      "$\\frac{5\\sqrt{3}}{2}$",
      "$3\\sqrt{3}$"
    ],
    "answer": "⑤",
    "solution": "양 끝에서 대소 비교: $x=0$이면 $a\\sin0=0<3=3\\cos0$이고, $x=\\frac\\pi3$이면 $a>\\sqrt3$에서 $a\\sin\\frac\\pi3=\\frac{\\sqrt3}{2}a>\\frac32=3\\cos\\frac\\pi3$이다.\n교점을 경계로 대소가 바뀌므로 두 색칠 영역의 넓이가 같으면 차의 정적분이 $0$이다.\n$$\\int_0^{\\pi/3}(a\\sin x-3\\cos x)\\,dx=0$$\n$\\int\\sin x\\,dx=-\\cos x+C$, $\\int\\cos x\\,dx=\\sin x+C$를 적용한다.\n$$\\left[-a\\cos x-3\\sin x\\right]_0^{\\pi/3}=0$$\n위끝 $\\frac\\pi3$과 아래끝 $0$을 대입한다.\n$$\\left(-a\\cos\\frac\\pi3-3\\sin\\frac\\pi3\\right)-(-a\\cos0-3\\sin0)=0$$\n특수각의 값을 대입한다.\n$$\\left(-\\frac a2-\\frac{3\\sqrt3}{2}\\right)-(-a-0)=0$$\n동류항을 정리한다.\n$$\\frac a2-\\frac{3\\sqrt3}{2}=0$$\n따라서 $a=3\\sqrt3$이다.\n주의: $3\\sqrt3>\\sqrt3$이므로 $a>\\sqrt3$을 만족한다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-102",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_EQUATION",
      "CC_GRAPH_INTERSECTION"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "INTERDEPENDENT"
  },
  {
    "id": 8,
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
    "content": "그림과 같이 곡선 $y=2x\\sin x$ ($0 \\le x \\le \\pi$)와 점 $(\\pi, 0)$을 지나고 기울기가 음수인 직선 $l$이 있다. 곡선 $y=2x\\sin x$와 $y$축 및 직선 $l$로 둘러싸인 영역을 $A$, 곡선 $y=2x\\sin x$와 직선 $l$로 둘러싸인 영역을 $B$라 하자. 두 영역 $A, B$의 넓이가 같을 때, 직선 $l$의 기울기는? [그림: 좌표평면에 $0 \\le x \\le \\pi$에서 곡선 $y=2x\\sin x$가 아치 모양으로 그려져 있고, 점 $(\\pi, 0)$을 지나는 기울기가 음수인 직선 $l$이 곡선과 교점을 가지며 $y$축의 양의 부분을 지난다. $y$축, 직선 $l$, 곡선으로 둘러싸인 영역이 $A$, 곡선과 직선 $l$로 둘러싸인 영역이 $B$로 표시되어 있다.]",
    "choices": [
      "$-\\frac{5}{\\pi}$",
      "$-\\frac{4}{\\pi}$",
      "$-\\frac{3}{\\pi}$",
      "$-\\frac{2}{\\pi}$",
      "$-\\frac{1}{\\pi}$"
    ],
    "answer": "②",
    "solution": "직선 $l$의 방정식: 점 $(\\pi,0)$을 지나고 기울기가 $m<0$이므로 $y=m(x-\\pi)$이다.\n$x=0$에서 직선은 $-m\\pi>0$, 곡선은 $0$이므로 직선이 위에 있고, $x=\\pi$ 근처에서는 곡선이 직선 위에 있다.\n두 영역 $A,B$의 넓이가 같으면 차의 정적분이 $0$이다.\n$$\\int_0^\\pi\\left(m(x-\\pi)-2x\\sin x\\right)dx=0$$\n직선 부분의 적분은 다음과 같다.\n$$\\int_0^\\pi m(x-\\pi)\\,dx=\\left[\\frac m2(x-\\pi)^2\\right]_0^\\pi=-\\frac{\\pi^2}{2}m$$\n곡선 부분은 부분적분법($u=2x$, $v'=\\sin x$)으로 계산한다.\n$$\\int2x\\sin x\\,dx=-2x\\cos x+2\\sin x+C$$\n따라서 곡선 부분의 정적분은 다음과 같다.\n$$\\left[-2x\\cos x+2\\sin x\\right]_0^\\pi=2\\pi$$\n두 결과를 합치면 $-\\frac{\\pi^2}{2}m-2\\pi=0$이다.\n$m$에 대해 풀면 $\\frac{\\pi^2}{2}m=-2\\pi$이므로 $m=-\\frac{4}{\\pi}$이다.\n주의: $m<0$이므로 기울기가 음수라는 조건을 만족한다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-102",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_LINEAR_FUNCTIONS",
      "CC_GRAPH_INTERSECTION"
    ],
    "conditionKeys": [
      "COND_NEGATIVE",
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "INTERDEPENDENT"
  },
  {
    "id": 9,
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
    "content": "그림과 같이 곡선 $y=2\\sin\\pi x$ ($0 \\le x \\le 1$)과 직선 $y=k$ ($0<k<2$)가 있다. 곡선 $y=2\\sin\\pi x$와 직선 $y=k$, $y$축으로 둘러싸인 부분의 넓이를 $S_1$, 곡선 $y=2\\sin\\pi x$와 직선 $y=k$로 둘러싸인 부분의 넓이를 $S_2$라 하자. $S_2 = 2S_1$일 때, 상수 $k$의 값은? [그림: 좌표평면에 $0 \\le x \\le 1$에서 곡선 $y=2\\sin\\pi x$가 위로 볼록한 아치 모양으로 그려져 있고, 직선 $y=k$ ($0<k<2$)가 곡선과 두 점에서 만난다. $y$축, 직선 $y=k$, 곡선으로 둘러싸인 영역이 $S_1$, 직선 $y=k$ 위쪽과 곡선으로 둘러싸인 영역이 $S_2$로 표시되어 있다.]",
    "choices": [
      "$\\frac{3}{\\pi}$",
      "$\\frac{4}{\\pi}$",
      "$\\frac{5}{\\pi}$",
      "$\\frac{6}{\\pi}$",
      "$\\frac{7}{\\pi}$"
    ],
    "answer": "②",
    "solution": "$y=2\\sin\\pi x$는 $x=\\frac12$에 대해 대칭이므로 $S_2$는 $x=\\frac12$에 의해 같은 넓이 두 개로 나뉜다.\n조건 $S_2=2S_1$에서 $\\frac12S_2=S_1$이다.\n$[0,\\frac12]$에서 직선 $y=k$가 곡선보다 위인 부분($S_1$)과 곡선이 위인 부분($\\frac12S_2$)의 넓이가 같으므로 차의 정적분은 $0$이다.\n$$\\int_0^{1/2}(2\\sin\\pi x-k)\\,dx=0$$\n$\\int\\sin\\pi x\\,dx=-\\frac1\\pi\\cos\\pi x+C$를 적용한다.\n$$\\left[-\\frac2\\pi\\cos\\pi x-kx\\right]_0^{1/2}=0$$\n위끝 $\\frac12$과 아래끝 $0$을 대입한다.\n$$\\left(-\\frac2\\pi\\cos\\frac\\pi2-\\frac k2\\right)-\\left(-\\frac2\\pi\\cos0-0\\right)=0$$\n$\\cos\\frac\\pi2=0$, $\\cos0=1$을 대입한다.\n$$\\left(0-\\frac k2\\right)-\\left(-\\frac2\\pi\\right)=0$$\n정리하면 $-\\frac k2+\\frac2\\pi=0$이다.\n따라서 $k=\\frac4\\pi$이다.\n주의: $0<\\frac4\\pi<2$이므로 $0<k<2$를 만족한다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-102",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_EQUATION",
      "CC_GRAPH_INTERSECTION"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL",
      "COND_RANGE"
    ],
    "integrationPattern": "INTERDEPENDENT"
  },
  {
    "id": 10,
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
    "content": "그림과 같이 곡선 $y=xe^x$ ($0 \\le x \\le 1$)에 대하여 이 곡선과 $x$축, 직선 $x=k$로 둘러싸인 영역을 $A$, 이 곡선과 직선 $x=k$, 직선 $y=e$로 둘러싸인 영역을 $B$라 하자. $A$의 넓이와 $B$의 넓이가 같을 때, 상수 $k$의 값은? (단, $0 \\le k \\le 1$) [그림: 좌표평면에 곡선 $y=xe^x$가 원점 $(0,0)$부터 점 $(1,e)$까지 아래로 볼록하게 증가하는 형태로 그려져 있고, 직선 $y=e$와 $x=k$ ($0 < k < 1$)가 그어져 있다. $0 \\le x \\le k$에서 곡선 아래와 $x$축, 직선 $x=k$로 둘러싸인 영역이 $A$, $k \\le x \\le 1$에서 곡선 위와 직선 $y=e$, 직선 $x=k$로 둘러싸인 영역이 $B$로 표시되어 있다.]",
    "choices": [
      "$1 - \\frac{2}{e}$",
      "$1 - \\frac{3}{2e}$",
      "$1 - \\frac{1}{e}$",
      "$1 - \\frac{2}{3e}$",
      "$1 - \\frac{1}{2e}$"
    ],
    "answer": "③",
    "solution": "$A=\\int_0^k xe^x dx$, $B=\\int_k^1(e-xe^x)dx$이다.\n$A=B$이므로 두 식을 정리한다.\n$$\\int_0^k xe^x dx=e(1-k)-\\int_k^1 xe^x dx$$\n적분을 한쪽으로 모으면 다음과 같다.\n$$\\int_0^k xe^x dx+\\int_k^1 xe^x dx=e(1-k)$$\n정적분의 성질로 좌변을 합친다.\n$$\\int_0^1 xe^x dx=e(1-k)$$\n부분적분법($u=x$, $v'=e^x$)을 적용한다.\n$$\\int_0^1 xe^x dx=\\left[xe^x\\right]_0^1-\\int_0^1e^x dx$$\n각 항을 계산한다.\n$$\\left[xe^x\\right]_0^1=e,\\qquad\\int_0^1e^x dx=e-1$$\n따라서 $\\int_0^1xe^x dx=e-(e-1)=1$이다.\n$1=e(1-k)$에서 $1-k=\\frac1e$이므로 $k=1-\\frac1e$이다.\n주의: $0<1-\\frac1e<1$이므로 $0\\le k\\le1$을 만족한다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-102",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_INTEGRATION_BY_PARTS_OR_EXPANSION",
      "CC_EXPONENTIAL_FUNCTION_GRAPH"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
