window.examTitle = "미적분II_266_곡선과y축으로둘러싸인도형의넓이_고2_유형은행1";

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
    "content": "곡선 $y = \\dfrac{2}{x-1}$와 $y$축 및 두 직선 $y = 1, y = k\\;(k > 1)$로 둘러싸인 도형의 넓이를 $S(k)$라고 할 때, $S(k) = k + 3$을 만족시키는 상수 $k$의 값은?",
    "choices": [
      "$\\sqrt{e}$",
      "$e$",
      "$e\\sqrt{e}$",
      "$e^2$",
      "$e^3$"
    ],
    "answer": "④",
    "solution": "곡선 $y=\\dfrac{2}{x-1}$을 $x$에 대하여 풀면 $x-1=\\dfrac{2}{y}$이므로 $x=1+\\dfrac{2}{y}$이다. (역함수 관계)\n$k>1$인 구간 $1\\le y\\le k$에서 $x=1+\\dfrac{2}{y}>0$이므로 도형은 $y$축의 오른쪽에 있다. (그래프 위치 확인)\n$y$축에 대한 정적분으로 넓이를 세우면 $S(k)=\\int_1^k x\\,dy=\\int_1^k\\left(1+\\dfrac{2}{y}\\right)dy$이다. (넓이 공식)\n부정적분을 계산하면 $\\left[y+2\\ln y\\right]_1^k=(k+2\\ln k)-(1+0)=k+2\\ln k-1$이다. (로그의 적분)\n조건 $S(k)=k+3$을 대입하면 $k+2\\ln k-1=k+3$이다.\n양변에서 $k$를 소거하면 $2\\ln k=4$, 즉 $\\ln k=2$이다. (일차식 정리)\n로그의 정의로부터 $k=e^2$이다. (지수·로그 관계)\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-101",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_INVERSE_FUNCTION",
      "CC_DEFINITE_INTEGRAL_PARAMETER_SOLVING"
    ],
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
    "content": "상수 $a > 1$에 대하여 곡선 $y = \\ln(x+a)$와 $x$축 및 $y$축으로 둘러싸인 도형의 넓이가 $e^2 + 1$일 때, $a$의 값은?",
    "choices": [
      "$\\sqrt{e}$",
      "$e$",
      "$e\\sqrt{e}$",
      "$e^2$",
      "$e^3$"
    ],
    "answer": "④",
    "solution": "곡선 $y=\\ln(x+a)$의 $y$절편은 $x=0$일 때 $y=\\ln a$이고, $x$절편은 $y=0$일 때 $x=1-a<0$이다. ($a>1$)\n식을 $x$에 대하여 풀면 $x+a=e^y$이므로 $x=e^y-a$이다. (지수·로그 변환)\n$0\\le y\\le \\ln a$에서 $e^y\\le a$이므로 $x=e^y-a\\le 0$이고 곡선은 $y$축의 왼쪽에 있다. (위치 판정)\n넓이는 $y$축에 대한 정적분으로 $S=\\int_0^{\\ln a}(0-x)\\,dy=\\int_0^{\\ln a}(a-e^y)\\,dy$이다. (넓이 공식)\n계산하면 $\\left[ay-e^y\\right]_0^{\\ln a}=(a\\ln a-a)-(0-1)=a\\ln a-a+1$이다. (지수함수의 적분)\n조건 $S=e^2+1$에서 $a\\ln a-a+1=e^2+1$, 즉 $a(\\ln a-1)=e^2$이다.\n$g(a)=a(\\ln a-1)$은 $g'(a)=\\ln a>0$이므로 $a>1$에서 증가한다. (미분법, 증가함수)\n$a=e^2$이면 $e^2(2-1)=e^2$이므로 해는 $a=e^2$이다. (증가성에 의한 유일성)\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-101",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_INVERSE_FUNCTION",
      "CC_DEFINITE_INTEGRAL_PARAMETER_SOLVING"
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
    "content": "곡선 $y = \\ln(x+1)$과 $y$축 및 두 직선 $y = -1, y = 2$로 둘러싸인 도형의 넓이는?",
    "choices": [
      "$e^2 + \\dfrac{1}{e} - 5$",
      "$e^2 - 4$",
      "$e^2 + \\dfrac{1}{e} - 4$",
      "$e^2 - 3$",
      "$e^2 + \\dfrac{1}{e} - 3$"
    ],
    "answer": "⑤",
    "solution": "곡선 $y=\\ln(x+1)$을 $x$에 대하여 풀면 $x=e^y-1$이다. (지수·로그 변환)\n곡선이 $y$축과 만나는 점은 $x=0$, 즉 $e^y-1=0$에서 $y=0$이다.\n주의: $y=0$을 경계로 곡선이 $y$축의 왼쪽과 오른쪽으로 바뀌므로 구간을 나누어야 한다. (위치 판정)\n(i) $-1\\le y\\le 0$에서 $e^y-1\\le 0$이므로 $S_1=\\int_{-1}^0(0-x)\\,dy=\\int_{-1}^0(1-e^y)\\,dy$이다.\n계산하면 $S_1=\\left[y-e^y\\right]_{-1}^0=(0-1)-(-1-e^{-1})=\\dfrac{1}{e}$이다. (지수함수의 적분)\n(ii) $0\\le y\\le 2$에서 $e^y-1\\ge 0$이므로 $S_2=\\int_0^2(e^y-1)\\,dy$이다.\n계산하면 $S_2=\\left[e^y-y\\right]_0^2=(e^2-2)-(1-0)=e^2-3$이다.\n전체 넓이는 $S=S_1+S_2=\\dfrac{1}{e}+e^2-3$이다. (넓이의 합)\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-101",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_INVERSE_FUNCTION",
      "CC_LOGARITHMIC_FUNCTION_GRAPH",
      "CC_DEFINITE_INTEGRAL_AREA_DECOMPOSITION"
    ],
    "conditionKeys": [],
    "integrationPattern": "CASE_BRANCH"
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
    "content": "그림과 같이 곡선 $y = \\ln(x+e^2)$과 $y$축 및 두 직선 $y = 1, y = 3$으로 둘러싸인 부분의 넓이는?\n[그림: 좌표평면에 곡선 $y = \\ln(x+e^2)$가 그려져 있고, 점 $(-e^2+1, 0)$에서 $x$축과 만난다. 곡선과 $y$축의 교점은 $(0, 2)$이다. 두 직선 $y=1, y=3$이 가로로 그어져 있으며, $1 \\le y \\le 2$ 구간에서 곡선과 $y$축 사이의 부분($y$축의 왼쪽 영역)과 $2 \\le y \\le 3$ 구간에서 곡선과 $y$축 사이의 부분($y$축의 오른쪽 영역)이 각각 색칠되어 있다.]",
    "choices": [
      "$(e-1)^2$",
      "$e^2 - e$",
      "$e^2$",
      "$e(e-1)^2$",
      "$(e+1)^2$"
    ],
    "answer": "④",
    "solution": "곡선 $y=\\ln(x+e^2)$을 $x$에 대하여 풀면 $x=e^y-e^2$이다. (지수·로그 변환)\n$y$절편은 $x=0$일 때 $e^y=e^2$이므로 $y=2$이다.\n(i) $1\\le y\\le 2$에서 $e^y\\le e^2$이므로 곡선은 $y$축의 왼쪽에 있다. (위치 판정)\n$S_1=\\int_1^2(e^2-e^y)\\,dy=\\left[e^2y-e^y\\right]_1^2=(2e^2-e^2)-(e^2-e)=e$이다. (정적분 계산)\n(ii) $2\\le y\\le 3$에서 $e^y\\ge e^2$이므로 곡선은 $y$축의 오른쪽에 있다.\n$S_2=\\int_2^3(e^y-e^2)\\,dy=\\left[e^y-e^2y\\right]_2^3=(e^3-3e^2)-(e^2-2e^2)=e^3-2e^2$이다.\n전체 넓이는 $S=S_1+S_2=e+e^3-2e^2$이다. (넓이의 합)\n$e$로 묶으면 $S=e(e^2-2e+1)=e(e-1)^2$이다. (인수분해)\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-101",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_INVERSE_FUNCTION",
      "CC_DEFINITE_INTEGRAL_AREA_DECOMPOSITION"
    ],
    "conditionKeys": [],
    "integrationPattern": "CASE_BRANCH"
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
    "content": "곡선 $y = |\\ln x|$와 직선 $y = 2$로 둘러싸인 부분의 넓이는?",
    "choices": [
      "$e^2 - 2$",
      "$e^2 + \\dfrac{1}{e^2} - 2$",
      "$e^2$",
      "$e^2 + \\dfrac{1}{e^2}$",
      "$2e^2$"
    ],
    "answer": "②",
    "solution": "$y=|\\ln x|$는 (i) $x\\ge 1$에서 $y=\\ln x$, (ii) $0<x<1$에서 $y=-\\ln x$이다. (절댓값의 정의)\n각 경우를 $x$에 대하여 풀면 (i) $x=e^y$, (ii) $x=e^{-y}$이다. (지수·로그 변환)\n직선 $y=2$와의 교점은 $|\\ln x|=2$에서 $x=e^{-2}$ 또는 $x=e^2$이다.\n$0\\le y\\le 2$에서 도형은 오른쪽 곡선 $x=e^y$와 왼쪽 곡선 $x=e^{-y}$ 사이에 있다. (그래프 위치)\n넓이는 $S=\\int_0^2(e^y-e^{-y})\\,dy$이다. (두 곡선 사이의 넓이)\n계산하면 $S=\\left[e^y+e^{-y}\\right]_0^2$이다. ($e^{-y}$의 부정적분은 $-e^{-y}$)\n대입하면 $S=(e^2+e^{-2})-(1+1)=e^2+\\dfrac{1}{e^2}-2$이다. (정적분 계산)\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-101",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_ABSOLUTE_VALUE_GRAPH",
      "CC_LOGARITHMIC_FUNCTION_GRAPH",
      "CC_DEFINITE_INTEGRAL_AREA_DECOMPOSITION"
    ],
    "conditionKeys": [],
    "integrationPattern": "CASE_BRANCH"
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
    "content": "곡선 $y = |e^x - 1|$과 직선 $y = \\dfrac{1}{3}$로 둘러싸인 부분의 넓이는?",
    "choices": [
      "$\\dfrac{8}{3}\\ln 2 - \\dfrac{5}{3}\\ln 3$",
      "$\\dfrac{5}{3}\\ln 2 - \\ln 3$",
      "$\\dfrac{10}{3}\\ln 2 - 2\\ln 3$",
      "$\\dfrac{7}{3}\\ln 2 - \\dfrac{4}{3}\\ln 3$",
      "$\\dfrac{11}{3}\\ln 2 - 2\\ln 3$"
    ],
    "answer": "③",
    "solution": "$y=|e^x-1|$은 (i) $x\\ge 0$에서 $y=e^x-1$, (ii) $x<0$에서 $y=1-e^x$이다. (절댓값의 정의)\n직선 $y=\\dfrac{1}{3}$과의 교점을 각 경우에서 구한다.\n(i) $x\\ge 0$: $e^x-1=\\dfrac{1}{3}$에서 $e^x=\\dfrac{4}{3}$, $x=\\ln\\dfrac{4}{3}$이다.\n(ii) $x<0$: $1-e^x=\\dfrac{1}{3}$에서 $e^x=\\dfrac{2}{3}$, $x=\\ln\\dfrac{2}{3}$이다.\n각 가지를 $x$에 대하여 풀면 $x\\ge 0$에서 $x=\\ln(y+1)$, $x<0$에서 $x=\\ln(1-y)$이다. (지수·로그 변환)\n$0\\le y\\le \\dfrac{1}{3}$에서 넓이는 $S=\\int_0^{1/3}\\left[\\ln(1+y)-\\ln(1-y)\\right]dy=\\int_0^{1/3}\\ln\\dfrac{1+y}{1-y}\\,dy$이다. (두 곡선 사이의 넓이)\n부분적분법: $u=\\ln\\dfrac{1+y}{1-y}$, $v'=1$로 두면 $u'=\\dfrac{2}{1-y^2}$, $v=y$이다. (합성함수의 미분법)\n$S=\\left[y\\ln\\dfrac{1+y}{1-y}\\right]_0^{1/3}-\\int_0^{1/3}\\dfrac{2y}{1-y^2}\\,dy$이다. (부분적분 공식)\n첫 항은 $\\dfrac{1}{3}\\ln\\dfrac{4/3}{2/3}-0=\\dfrac{1}{3}\\ln 2$이다.\n둘째 항은 $t=1-y^2$, $dt=-2y\\,dy$로 치환하면 $\\int\\dfrac{2y}{1-y^2}dy=-\\ln(1-y^2)$이므로 $\\left[-\\ln(1-y^2)\\right]_0^{1/3}=-\\ln\\dfrac{8}{9}$이다. (치환적분법)\n따라서 $S=\\dfrac{1}{3}\\ln 2+\\ln\\dfrac{8}{9}=\\dfrac{1}{3}\\ln 2+3\\ln 2-2\\ln 3=\\dfrac{10}{3}\\ln 2-2\\ln 3$이다. (로그의 성질)\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-101",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_ABSOLUTE_VALUE_GRAPH",
      "CC_EXPONENTIAL_FUNCTION_GRAPH",
      "CC_DEFINITE_INTEGRAL_AREA_DECOMPOSITION"
    ],
    "conditionKeys": [],
    "integrationPattern": "CASE_BRANCH"
  }
];
