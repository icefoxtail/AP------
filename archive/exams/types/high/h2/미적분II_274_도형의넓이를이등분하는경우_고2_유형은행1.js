window.examTitle = "미적분II_274_도형의넓이를이등분하는경우_고2_유형은행1";

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
    "content": "곡선 $y=\\sqrt[3]{x}$와 $x$축 및 직선 $x=8$로 둘러싸인 영역의 넓이를 곡선 $y=\\sqrt[3]{ax}$가 이등분할 때, 양수 $a$의 값은? (단, $a>0$)",
    "choices": [
      "\\frac{1}{8}",
      "\\frac{1}{6}",
      "\\frac{1}{4}",
      "\\frac{1}{3}",
      "\\frac{1}{2}"
    ],
    "answer": "①",
    "solution": "전체 영역의 넓이 계산(정적분): $S=\\int_0^8 x^{\\frac{1}{3}}\\,dx=\\left[\\frac{3}{4}x^{\\frac{4}{3}}\\right]_0^8=\\frac{3}{4}\\cdot 16=12$ (이때 $8^{\\frac{4}{3}}=(2^3)^{\\frac{4}{3}}=2^4=16$).\n곡선 $y=\\sqrt[3]{ax}=a^{\\frac{1}{3}}x^{\\frac{1}{3}}$ 아래의 넓이 계산(상수배): $T=\\int_0^8 a^{\\frac{1}{3}}x^{\\frac{1}{3}}\\,dx=a^{\\frac{1}{3}}\\cdot 12$.\n이등분 조건 적용: $T=\\frac{1}{2}S$이므로 $12a^{\\frac{1}{3}}=6$.\n$a$에 대해 풀기: $a^{\\frac{1}{3}}=\\frac{1}{2}$에서 $a=\\left(\\frac{1}{2}\\right)^3=\\frac{1}{8}$.\n주의: $y=\\sqrt[3]{ax}$의 비례계수는 $a$가 아니라 $a^{\\frac{1}{3}}$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-102",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_RADICAL_FUNCTION"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
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
    "content": "함수 $y=e^{2x}$의 그래프와 $x$축, $y$축 및 직선 $x=1$로 둘러싸인 영역의 넓이가 직선 $y=ax$ ($0 < a < e^2$)에 의하여 이등분될 때, 상수 $a$의 값은?",
    "choices": [
      "\\frac{e^2 - 1}{2}",
      "\\frac{e^2}{2}",
      "\\frac{e^2 + 1}{2}",
      "e^2 - 1",
      "e^2"
    ],
    "answer": "①",
    "solution": "전체 영역의 넓이 계산(정적분): $S=\\int_0^1 e^{2x}\\,dx=\\left[\\frac{1}{2}e^{2x}\\right]_0^1=\\frac{e^2-1}{2}$.\n직선이 곡선 아래에 있는지 확인: $\\frac{e^{2x}}{x}$는 $x=\\frac{1}{2}$에서 최솟값 $2e$이고 $a=\\frac{e^2-1}{2}<2e$이므로 $0<x\\le 1$에서 $ax<e^{2x}$이다.\n직선 아래쪽 영역의 넓이(삼각형): $T=\\frac{1}{2}\\cdot 1\\cdot a=\\frac{a}{2}$.\n이등분 조건 적용: $\\frac{a}{2}=\\frac{1}{2}\\cdot\\frac{e^2-1}{2}$.\n$a$의 값 계산: $a=\\frac{e^2-1}{2}$.\n주의: $\\int e^{2x}dx=\\frac{1}{2}e^{2x}$이며, 직선이 곡선과 만나면 아래쪽이 삼각형이 아니므로 아래 조건 확인이 필요하다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-102",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_EXPONENTIAL_FUNCTION_GRAPH",
      "CC_LINEAR_FUNCTIONS"
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
    "content": "곡선 $y=\\frac{e^x}{\\sqrt{2e^x+1}}$과 $x$축 및 두 직선 $x=\\ln 24$, $x=\\ln 40$으로 둘러싸인 도형의 넓이를 직선 $y=\\frac{1}{\\ln a}$이 이등분할 때, 양수 $a$의 값은? [그림: 좌표평면의 제1사분면에 증가하는 곡선 $y=\\frac{e^x}{\\sqrt{2e^x+1}}$이 있고, 두 수직선 $x=\\ln 24$, $x=\\ln 40$과 $x$축으로 둘러싸인 띠 모양의 영역이 있다. 이 영역을 가로지르는 수평선 $y=\\frac{1}{\\ln a}$가 곡선의 아래쪽에서 두 수직선 $x=\\ln 24$, $x=\\ln 40$ 사이를 지나며 직사각형 형태의 아랫부분을 만들고 있다.]",
    "choices": [
      "\\frac{4}{3}",
      "\\frac{5}{3}",
      "2",
      "\\frac{7}{3}",
      "\\frac{8}{3}"
    ],
    "answer": "②",
    "solution": "치환적분법 적용: $u=2e^x+1$이면 $du=2e^x\\,dx$, 즉 $e^x dx=\\frac{1}{2}du$.\n적분 구간 변환: $x=\\ln 24$일 때 $u=2\\cdot24+1=49$, $x=\\ln 40$일 때 $u=2\\cdot40+1=81$.\n전체 넓이 계산: $S=\\int_{49}^{81}\\frac{1}{\\sqrt u}\\cdot\\frac{1}{2}\\,du=\\left[\\sqrt u\\right]_{49}^{81}=9-7=2$.\n직선이 곡선 아래를 지나는지 확인: 곡선의 최솟값은 $\\frac{24}{\\sqrt{49}}=\\frac{24}{7}\\approx3.43$이고 높이는 $\\frac{1}{\\ln(5/3)}\\approx1.96$이므로 아래쪽은 직사각형이다.\n직선 아래 넓이(직사각형): $T=\\left(\\ln 40-\\ln 24\\right)\\cdot\\frac{1}{\\ln a}=\\frac{\\ln\\frac{5}{3}}{\\ln a}$.\n이등분 조건 적용: $T=1$이므로 $\\frac{\\ln\\frac{5}{3}}{\\ln a}=1$.\n$\\ln a=\\ln\\frac{5}{3}$에서 $a=\\frac{5}{3}$.\n주의: $\\ln 40-\\ln 24=\\ln\\frac{40}{24}=\\ln\\frac{5}{3}$이며 진수를 그대로 빼지 않는다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-102",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_EXPONENTIAL_FUNCTION_GRAPH",
      "CC_LOGARITHMIC_FUNCTION_GRAPH"
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
    "content": "오른쪽 그림과 같이 곡선 $y=\\frac{\\ln x}{x}$와 $x$축 및 두 직선 $x=k$, $x=e^{2\\sqrt{2}}$로 둘러싸인 두 부분 $A$와 $B$의 넓이가 서로 같도록 하는 실수 $k$의 값은? (단, $1 < k < e^{2\\sqrt{2}}$) [그림: 좌표평면의 제1사분면에서 곡선 $y=\\frac{\\ln x}{x}$가 점 $(1,0)$에서 $x$축과 만나며 증가하다가 감소하는 형태로 그려져 있다. $x=1$부터 $x=k$까지 곡선과 $x$축 사이의 영역을 $A$, $x=k$부터 $x=e^{2\\sqrt{2}}$까지 곡선과 $x$축 사이의 영역을 $B$라 표시하고, 수직선 $x=k$와 $x=e^{2\\sqrt{2}}$가 그어져 있다.]",
    "choices": [
      "e",
      "e\\sqrt{e}",
      "e^2",
      "e^2\\sqrt{e}",
      "e^3"
    ],
    "answer": "③",
    "solution": "곡선과 $x$축의 교점 확인: $\\frac{\\ln x}{x}=0$에서 $x=1$이므로 $A$의 왼쪽 경계는 $x=1$이다.\n부정적분 계산(치환적분법): $u=\\ln x$, $du=\\frac{1}{x}dx$이므로 $\\int\\frac{\\ln x}{x}dx=\\int u\\,du=\\frac{1}{2}(\\ln x)^2+C$.\n영역 $A$의 넓이: $S_A=\\left[\\frac{1}{2}(\\ln x)^2\\right]_1^k=\\frac{1}{2}(\\ln k)^2-0=\\frac{1}{2}(\\ln k)^2$.\n전체 넓이: $S=\\left[\\frac{1}{2}(\\ln x)^2\\right]_1^{e^{2\\sqrt2}}=\\frac{1}{2}(2\\sqrt2)^2=\\frac{1}{2}\\cdot8=4$.\n$S_A=S_B$이면 $S_A=\\frac{1}{2}S=2$이므로 $\\frac{1}{2}(\\ln k)^2=2$.\n$(\\ln k)^2=4$에서 $1<k$이므로 $\\ln k>0$, 따라서 $\\ln k=2$.\n로그의 정의로 $k=e^2$.\n확인: $S_B=\\frac{1}{2}\\left[(2\\sqrt2)^2-2^2\\right]=\\frac{1}{2}(8-4)=2=S_A$.\n주의: $\\ln k=-2$는 $k=e^{-2}<1$이므로 주어진 조건에 맞지 않는다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-102",
    "problemTypeKey": "PT_AREA_BY_DEFINITE_INTEGRAL",
    "templateKey": "TPL_INTERSECTION_SIGN_AREA",
    "crossConceptKeys": [
      "CC_LOGARITHMIC_FUNCTION_GRAPH"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "오른쪽 그림과 같이 곡선 $y=k\\cos x \\left(0 \\le x \\le \\frac{\\pi}{2}\\right)$와 $x$축, $y$축으로 둘러싸인 부분이 곡선 $y=3\\sin x$에 의해 잘린 두 부분의 넓이가 서로 같을 때, 양수 $k$의 값은? [그림: 좌표평면의 제1사분면에서 $y$축의 점 $(0, k)$에서 시작하여 $x$축의 점 $(\\pi/2, 0)$으로 내려가는 곡선 $y=k\\cos x$가 있고, 원점 $(0,0)$에서 시작하여 점 $(\\pi/2, 3)$으로 올라가는 곡선 $y=3\\sin x$가 있다. 두 곡선은 한 점 $(\\alpha, y_0)$에서 만나며, 원래 $y=k\\cos x$와 두 축으로 둘러싸인 영역이 두 부분으로 나뉘어 있다.]",
    "choices": [
      "2",
      "3",
      "4",
      "5",
      "6"
    ],
    "answer": "③",
    "solution": "전체 넓이: $S=\\int_0^{\\frac{\\pi}{2}}k\\cos x\\,dx=[k\\sin x]_0^{\\frac{\\pi}{2}}=k$.\n교점 $\\alpha$의 조건: $k\\cos\\alpha=3\\sin\\alpha$에서 $\\tan\\alpha=\\frac{k}{3}$.\n삼각비 계산: 빗변이 $\\sqrt{k^2+9}$이므로 $\\sin\\alpha=\\frac{k}{\\sqrt{k^2+9}}$, $\\cos\\alpha=\\frac{3}{\\sqrt{k^2+9}}$.\n곡선 $3\\sin x$ 위쪽 부분의 넓이: $T=\\int_0^\\alpha(k\\cos x-3\\sin x)dx=[k\\sin x+3\\cos x]_0^\\alpha$.\n계산: $k\\sin\\alpha+3\\cos\\alpha=\\frac{k^2}{\\sqrt{k^2+9}}+\\frac{9}{\\sqrt{k^2+9}}=\\frac{k^2+9}{\\sqrt{k^2+9}}=\\sqrt{k^2+9}$이므로 $T=\\sqrt{k^2+9}-3$.\n이등분 조건 적용: $T=\\frac{k}{2}$이므로 $\\sqrt{k^2+9}=\\frac{k}{2}+3$.\n양변 제곱: $k^2+9=\\frac{k^2}{4}+3k+9$.\n정리: $\\frac{3}{4}k^2-3k=0$, 즉 $\\frac{3}{4}k(k-4)=0$.\n$k>0$이므로 $k=4$.\n확인: $T=\\sqrt{16+9}-3=5-3=2=\\frac{4}{2}$로 이등분된다.\n주의: 제곱 전에 $\\frac{k}{2}+3>0$이고 $k>0$임을 확인한다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
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
      "COND_POSITIVE",
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "INTERDEPENDENT",
    "image": "assets/images/미적분II_274_도형의넓이를이등분하는경우_고2_유형은행1/q5-problem.svg",
    "imageAlt": "원문 y=3sin x는 정확한 0≤x≤π/2 구간. 미지 kcos x와 이등분 면은 엔진 보류.",
    "imageCaption": "원문 y=3sin x는 정확한 0≤x≤π/2 구간. 미지 kcos x와 이등분 면은 엔진 보류.",
    "imageSize": "medium"
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
    "content": "그림과 같이 곡선 $y=2\\sin x \\left(0 \\le x \\le \\frac{\\pi}{2}\\right)$와 $x$축 및 직선 $x=\\frac{\\pi}{2}$로 둘러싸인 도형의 넓이를 곡선 $y=a\\cos x$가 이등분할 때, 양수 $a$의 값은? [그림: 좌표평면의 제1사분면에 원점 $(0,0)$에서 시작하여 점 $(\\pi/2, 2)$에 도달하는 곡선 $y=2\\sin x$와 수직선 $x=\\pi/2$, 그리고 $x$축으로 둘러싸인 도형이 있다. $y$축의 점 $(0, a)$에서 시작하여 $x$축의 점 $(\\pi/2, 0)$으로 내려오는 곡선 $y=a\\cos x$가 곡선 $y=2\\sin x$와 점 $(\\alpha, y_0)$에서 만나며 이 도형의 넓이를 둘로 나누고 있다.]",
    "choices": [
      "\\frac{3}{4}",
      "1",
      "\\frac{5}{4}",
      "\\frac{3}{2}",
      "\\frac{7}{4}"
    ],
    "answer": "④",
    "solution": "전체 넓이: $S=\\int_0^{\\frac{\\pi}{2}}2\\sin x\\,dx=[-2\\cos x]_0^{\\frac{\\pi}{2}}=-0-(-2)=2$.\n교점 $\\alpha$의 조건: $2\\sin\\alpha=a\\cos\\alpha$에서 $\\tan\\alpha=\\frac{a}{2}$.\n삼각비 계산: 빗변이 $\\sqrt{a^2+4}$이므로 $\\sin\\alpha=\\frac{a}{\\sqrt{a^2+4}}$, $\\cos\\alpha=\\frac{2}{\\sqrt{a^2+4}}$.\n곡선 $a\\cos x$ 위쪽 부분의 넓이: $T=\\int_\\alpha^{\\frac{\\pi}{2}}(2\\sin x-a\\cos x)dx=[-2\\cos x-a\\sin x]_\\alpha^{\\frac{\\pi}{2}}$.\n계산: $T=-a+2\\cos\\alpha+a\\sin\\alpha$이고 $2\\cos\\alpha+a\\sin\\alpha=\\frac{4+a^2}{\\sqrt{a^2+4}}=\\sqrt{a^2+4}$이므로 $T=\\sqrt{a^2+4}-a$.\n이등분 조건 적용: $T=1$이므로 $\\sqrt{a^2+4}=a+1$.\n양변 제곱: $a^2+4=a^2+2a+1$.\n정리: $2a=3$에서 $a=\\frac{3}{2}$.\n확인: $T=\\sqrt{\\frac{9}{4}+4}-\\frac{3}{2}=\\frac{5}{2}-\\frac{3}{2}=1$로 전체 넓이의 절반이다.\n주의: $a+1>0$이므로 제곱하여도 해가 변하지 않는다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
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
      "COND_POSITIVE",
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "INTERDEPENDENT",
    "image": "assets/images/미적분II_274_도형의넓이를이등분하는경우_고2_유형은행1/q6-problem.svg",
    "imageAlt": "정확한 y=2sin x (0≤x≤π/2)와 끝점 눈금. y=a cos x와 이등분 면은 보류.",
    "imageCaption": "정확한 y=2sin x (0≤x≤π/2)와 끝점 눈금. y=a cos x와 이등분 면은 보류.",
    "imageSize": "medium"
  }
];
