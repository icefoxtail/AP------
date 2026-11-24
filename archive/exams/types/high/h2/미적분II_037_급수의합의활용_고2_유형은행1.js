window.examTitle = "미적분II_037_급수의합의활용_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "급수",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-02",
    "standardUnit": "급수",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "급수"
    ],
    "wide": false,
    "content": "모든 자연수 $n$에 대해 $a_nx(x+2)+4$를 $x-n$으로 나눈 나머지가 $16$일 때, $\\sum_{n=1}^{\\infty}a_n$의 값은?",
    "choices": [
      "$8$",
      "$9$",
      "$10$",
      "$11$",
      "$12$"
    ],
    "answer": "②",
    "solution": "나머지정리에 의해 $f(x)=a_nx(x+2)+4$를 $x-n$으로 나눈 나머지는 $f(n)$이다.\n$f(n)=a_nn(n+2)+4=16$이므로 $a_nn(n+2)=12$이다.\n부분분수 분해로 $a_n=\\frac{12}{n(n+2)}=\\frac{6}{n}-\\frac{6}{n+2}=6\\left(\\frac1n-\\frac1{n+2}\\right)$이다.\n제$N$항까지의 망원급수 부분합은 $S_N=6\\sum_{n=1}^{N}\\left(\\frac1n-\\frac1{n+2}\\right)=6\\left(1+\\frac12-\\frac1{N+1}-\\frac1{N+2}\\right)$이다.\n$N\\to\\infty$일 때 $\\frac1{N+1}\\to0$, $\\frac1{N+2}\\to0$이므로 $\\sum_{n=1}^{\\infty}a_n=6\\left(1+\\frac12\\right)=9$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-066",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_PARTIAL_SUM",
    "crossConceptKeys": [
      "CC_REMAINDER_THEOREM"
    ],
    "conditionKeys": [
      "COND_NATURAL_NUMBER"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 2,
    "category": "급수",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-02",
    "standardUnit": "급수",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "급수"
    ],
    "wide": false,
    "content": "모든 자연수 $n$에 대해 $a_n\\ne0$이고 $a_nx^2+2a_nx-3$을 $x-(n+1)$로 나눈 나머지가 $21$일 때, $\\sum_{n=1}^{\\infty}a_n$의 값은?",
    "choices": [
      "$7$",
      "$8$",
      "$9$",
      "$10$",
      "$11$"
    ],
    "answer": "④",
    "solution": "나머지정리에 의해 $f(x)=a_nx^2+2a_nx-3$을 $x-(n+1)$로 나눈 나머지는 $f(n+1)$이다.\n$f(n+1)=a_n(n+1)^2+2a_n(n+1)-3=a_n(n+1)(n+3)-3$이다.\n조건에서 $a_n(n+1)(n+3)-3=21$이므로 $a_n(n+1)(n+3)=24$이다.\n부분분수 분해로 $a_n=\\frac{24}{(n+1)(n+3)}=12\\left(\\frac1{n+1}-\\frac1{n+3}\\right)$이다.\n제$N$항까지의 망원급수 부분합은 $S_N=12\\sum_{n=1}^{N}\\left(\\frac1{n+1}-\\frac1{n+3}\\right)=12\\left(\\frac12+\\frac13-\\frac1{N+2}-\\frac1{N+3}\\right)$이다.\n$N\\to\\infty$일 때 $\\frac1{N+2}\\to0$, $\\frac1{N+3}\\to0$이므로 합은 $12\\left(\\frac12+\\frac13\\right)=12\\cdot\\frac56=10$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-066",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_PARTIAL_SUM",
    "crossConceptKeys": [
      "CC_REMAINDER_THEOREM"
    ],
    "conditionKeys": [
      "COND_NATURAL_NUMBER",
      "COND_NONZERO"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 3,
    "category": "급수",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-02",
    "standardUnit": "급수",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "급수"
    ],
    "wide": false,
    "content": "$2^{n+2}7^{n+4}$의 양의 약수 개수가 $a_n$일 때, $\\sum_{n=1}^{\\infty}\\frac{2}{a_n}$의 값은?",
    "choices": [
      "$\\frac{5}{20}$",
      "$\\frac{6}{20}$",
      "$\\frac{7}{20}$",
      "$\\frac{8}{20}$",
      "$\\frac{9}{20}$"
    ],
    "answer": "⑤",
    "solution": "약수의 개수 공식을 적용하기 위해 $2^{n+2}7^{n+4}$의 양의 약수를 $2^i7^j$ ($0\\le i\\le n+2$, $0\\le j\\le n+4$)로 나타낸다.\n지수의 선택 가지 수를 곱하면 $a_n=(n+2+1)(n+4+1)=(n+3)(n+5)$이다.\n부분분수 분해로 $\\frac{2}{a_n}=\\frac{2}{(n+3)(n+5)}=\\frac1{n+3}-\\frac1{n+5}$이다.\n제$N$항까지의 망원급수 부분합은 $S_N=\\sum_{n=1}^{N}\\left(\\frac1{n+3}-\\frac1{n+5}\\right)=\\frac14+\\frac15-\\frac1{N+4}-\\frac1{N+5}$이다.\n$N\\to\\infty$일 때 뒤의 두 항이 $0$에 수렴하므로 합은 $\\frac14+\\frac15=\\frac9{20}$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-066",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_PARTIAL_SUM",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 4,
    "category": "급수",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-02",
    "standardUnit": "급수",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "급수"
    ],
    "wide": false,
    "content": "직선 $x-4y+8=0$ 위의 두 좌표가 모두 자연수인 점을 $x$좌표가 작은 것부터 차례대로 $(a_n,b_n)$이라 할 때, $\\sum_{n=1}^{\\infty}\\frac{4}{a_nb_n}$의 값은?",
    "choices": [
      "$0.25$",
      "$0.5$",
      "$0.75$",
      "$1$",
      "$1.25$"
    ],
    "answer": "③",
    "solution": "직선 $x-4y+8=0$에서 $x=4y-8=4(y-2)$이다.\n$x,y$가 모두 자연수이려면 $y\\ge3$이어야 하므로 $y=n+2$ ($n=1,2,3,\\ldots$)로 놓을 수 있다.\n그러면 $x=4n$이므로 $a_n=4n$, $b_n=n+2$이다.\n따라서 $\\frac{4}{a_nb_n}=\\frac{4}{4n(n+2)}=\\frac1{n(n+2)}=\\frac12\\left(\\frac1n-\\frac1{n+2}\\right)$이다.\n주의: $y=1,2$이면 $x$가 각각 $-4,0$이 되어 양의 자연수가 아니다.\n제$N$항까지의 망원급수 부분합은 $S_N=\\frac12\\left(1+\\frac12-\\frac1{N+1}-\\frac1{N+2}\\right)$이다.\n$N\\to\\infty$일 때 합은 $\\frac12\\left(1+\\frac12\\right)=\\frac34=0.75$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-066",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_PARTIAL_SUM",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_NATURAL_NUMBER"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 5,
    "category": "급수",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-02",
    "standardUnit": "급수",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "급수"
    ],
    "wide": false,
    "content": "직선 $(3n-1)x+(3n+2)y=6$과 두 좌표축이 둘러싸는 삼각형의 넓이가 $a_n$일 때, $\\sum_{n=1}^{\\infty}a_n$의 값은? [그림: 제1사분면에서 원점과 두 절편 $(6/(3n-1),0)$, $(0,6/(3n+2))$을 꼭짓점으로 하는 삼각형]",
    "choices": [
      "$1.5$",
      "$2$",
      "$2.5$",
      "$3$",
      "$3.5$"
    ],
    "answer": "④",
    "solution": "직선의 $x$절편은 $y=0$일 때 $x=\\frac{6}{3n-1}$이고, $y$절편은 $x=0$일 때 $y=\\frac{6}{3n+2}$이다.\n삼각형의 넓이는 두 절편의 곱의 절반이므로 $a_n=\\frac12\\cdot\\frac{6}{3n-1}\\cdot\\frac{6}{3n+2}=\\frac{18}{(3n-1)(3n+2)}$이다.\n부분분수 분해로 $a_n=\\frac{6}{3n-1}-\\frac{6}{3n+2}=6\\left(\\frac1{3n-1}-\\frac1{3n+2}\\right)$이다.\n제$N$항까지의 망원급수 부분합은 $S_N=6\\sum_{n=1}^{N}\\left(\\frac1{3n-1}-\\frac1{3n+2}\\right)=6\\left(\\frac12-\\frac1{3N+2}\\right)$이다.\n$N\\to\\infty$일 때 $\\frac1{3N+2}\\to0$이므로 $\\sum_{n=1}^{\\infty}a_n=6\\cdot\\frac12=3$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-066",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_PARTIAL_SUM",
    "crossConceptKeys": [
      "CC_AXIS_INTERCEPT"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 6,
    "category": "급수",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-02",
    "standardUnit": "급수",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "급수"
    ],
    "wide": false,
    "content": "곡선 $y=\\frac6x$ 위의 두 점 $P_n=(2n,3/n)$, $P_{n+1}=(2n+2,3/(n+1))$을 대각선의 양 끝점으로 하고 변이 좌표축에 평행한 직사각형의 넓이가 $A_n$일 때, $\\sum_{n=1}^{\\infty}A_n$의 값은? [그림: 곡선 $y=6/x$의 제1사분면에 두 점을 표시하고, 각 점에서 수평선과 수직선을 그어 직사각형을 만든다.]",
    "choices": [
      "$6$",
      "$7$",
      "$8$",
      "$9$",
      "$10$"
    ],
    "answer": "①",
    "solution": "두 점의 $x$좌표 차이로 가로 길이는 $2n+2-2n=2$이다.\n두 점의 $y$좌표 차이로 세로 길이는 $\\frac3n-\\frac3{n+1}=\\frac{3}{n(n+1)}$이다.\n직사각형의 넓이는 가로와 세로의 곱이므로 $A_n=2\\cdot\\frac{3}{n(n+1)}=\\frac6{n(n+1)}$이다.\n부분분수 분해로 $A_n=6\\left(\\frac1n-\\frac1{n+1}\\right)$이다.\n제$N$항까지의 망원급수 부분합은 $S_N=6\\sum_{n=1}^{N}\\left(\\frac1n-\\frac1{n+1}\\right)=6\\left(1-\\frac1{N+1}\\right)$이다.\n$N\\to\\infty$일 때 $\\frac1{N+1}\\to0$이므로 급수의 합은 $6$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-066",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_PARTIAL_SUM",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 7,
    "category": "급수",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-02",
    "standardUnit": "급수",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "급수"
    ],
    "wide": false,
    "content": "정수 $n\\ge3$에 대해 중심이 각각 $(0,0)$과 $(4/n,0)$이고 반지름이 모두 $2$인 두 원의 공통현 길이를 $\\ell_n$이라 하자. $\\sum_{n=3}^{\\infty}\\frac{1}{(n\\ell_n)^2}=\\frac pq$일 때, 서로소인 자연수 $p,q$의 합은? [그림: 두 원과 공통현 $x=2/n$을 그리고, 공통현 중점 $(2/n,0)$과 위쪽 교점을 표시한다.]",
    "choices": [
      "$185$",
      "$189$",
      "$193$",
      "$197$",
      "$201$"
    ],
    "answer": "④",
    "solution": "두 원의 중심 사이의 거리는 $d=\\frac4n$이다.\n공통현은 중심을 잇는 선분을 수직으로 이등분하므로 공통현의 중점은 $\\left(\\frac2n,0\\right)$이고, 공통현은 직선 $x=\\frac2n$ 위에 있다.\n한 원의 중심 $(0,0)$에서 공통현의 중점까지의 거리는 $\\frac2n$이다.\n피타고라스 정리에 의해 공통현의 절반의 길이는 $\\sqrt{2^2-\\left(\\frac2n\\right)^2}=\\sqrt{4-\\frac4{n^2}}$이다.\n따라서 $\\ell_n=2\\sqrt{4-\\frac4{n^2}}=4\\sqrt{1-\\frac1{n^2}}$이다.\n그러면 $n\\ell_n=4n\\sqrt{1-\\frac1{n^2}}$이므로 $(n\\ell_n)^2=16n^2\\left(1-\\frac1{n^2}\\right)=16(n^2-1)$이다.\n부분분수 분해로 $\\frac1{(n\\ell_n)^2}=\\frac1{16(n^2-1)}=\\frac1{32}\\left(\\frac1{n-1}-\\frac1{n+1}\\right)$이다.\n제$N$항까지의 망원급수 부분합은 $S_N=\\frac1{32}\\sum_{n=3}^{N}\\left(\\frac1{n-1}-\\frac1{n+1}\\right)=\\frac1{32}\\left(\\frac12+\\frac13-\\frac1N-\\frac1{N+1}\\right)$이다.\n$N\\to\\infty$일 때 $\\frac1N\\to0$, $\\frac1{N+1}\\to0$이므로 합은 $\\frac1{32}\\left(\\frac12+\\frac13\\right)=\\frac1{32}\\cdot\\frac56=\\frac5{192}$이다.\n따라서 $p=5$, $q=192$이고 $p+q=197$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-066",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_PARTIAL_SUM",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_RANGE",
      "COND_NATURAL_NUMBER"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
