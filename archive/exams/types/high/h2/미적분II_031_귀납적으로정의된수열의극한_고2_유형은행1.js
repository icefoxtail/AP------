window.examTitle = "미적분II_031_귀납적으로정의된수열의극한_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "수열의 극한",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-01",
    "standardUnit": "수열의 극한",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "수열의 극한"
    ],
    "wide": false,
    "content": "$a_1=2$, $a_{n+1}=a_n/4+3$이다. 두 직선의 그래프를 이용할 때 $\\lim_{n\\to\\infty}a_n$은? [그림: $y=x$와 $y=x/4+3$을 그리고, $x=2$에서 시작해 수직으로 둘째 직선, 수평으로 첫째 직선에 닿는 과정을 반복해 표시한다.]",
    "choices": [
      "$0$",
      "$1$",
      "$2$",
      "$3$",
      "$4$"
    ],
    "answer": "⑤",
    "solution": "수렴값을 $L$이라 하면 (수열의 극한의 성질) $L=\\frac{L}{4}+3$이다.\n양변에서 $\\frac{L}{4}$를 빼면 $\\frac{3}{4}L=3$이다.\n양변에 $\\frac{4}{3}$을 곱하면 $L=4$이다.\n그래프에서도 두 직선 $y=x$, $y=\\frac{x}{4}+3$의 교점의 $x$좌표가 $4$임을 확인할 수 있다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-056",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_ALGEBRAIC",
    "crossConceptKeys": [
      "CC_GRAPH_INTERSECTION"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  },
  {
    "id": 2,
    "category": "수열의 극한",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-01",
    "standardUnit": "수열의 극한",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "수열의 극한"
    ],
    "wide": false,
    "content": "$a_1=9$, $a_{n+1}=\\sqrt{4a_n}$이다. 그래프를 이용할 때 $\\lim_{n\\to\\infty}a_n$은? [그림: $y=x$와 $y=\\sqrt{4x}$를 함께 그리고, $x=9$에서 곡선까지 수직으로 이동한 뒤 $y=x$까지 수평으로 이동하는 과정을 반복해 표시한다.]",
    "choices": [
      "$4$",
      "$5$",
      "$6$",
      "$7$",
      "$8$"
    ],
    "answer": "①",
    "solution": "극한을 $L$이라 하면 (수열의 극한의 성질) $L=\\sqrt{4L}$이다.\n양변을 제곱하면 $L^2=4L$, 즉 $L(L-4)=0$이다.\n$a_1=9>4$이고 $x>4$이면 $\\sqrt{4x}>4$이므로 모든 $n$에서 $a_n>4$, 즉 $L\\ge4$이다.\n따라서 $L=0$은 버리고 $L=4$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-056",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_ALGEBRAIC",
    "crossConceptKeys": [
      "CC_RADICAL_FUNCTION",
      "CC_GRAPH_INTERSECTION"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  },
  {
    "id": 3,
    "category": "수열의 극한",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-01",
    "standardUnit": "수열의 극한",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "수열의 극한"
    ],
    "wide": false,
    "content": "수렴하는 수열 $3,\\ 3+\\frac23,\\ 3+\\frac{2}{3+2/3},\\ 3+\\frac{2}{3+2/(3+2/3)},\\ldots$의 극한값은?",
    "choices": [
      "$\\frac{3+\\sqrt{5}}{2}$",
      "$\\frac{3+\\sqrt{7}}{2}$",
      "$\\frac{3+\\sqrt{11}}{2}$",
      "$\\frac{3+\\sqrt{13}}{2}$",
      "$\\frac{3+\\sqrt{17}}{2}$"
    ],
    "answer": "⑤",
    "solution": "수열의 극한을 $L$이라 하면 점화식 $a_{n+1}=3+\\frac{2}{a_n}$에서 $L=3+\\frac{2}{L}$이다.\n양변에 $L$을 곱하면 $L^2=3L+2$이다.\n이항하면 $L^2-3L-2=0$이다.\n근의 공식으로 $L=\\frac{3\\pm\\sqrt{9+8}}{2}=\\frac{3\\pm\\sqrt{17}}{2}$이다.\n모든 항이 $3$ 이상이므로 $L\\ge3$이고, $\\frac{3-\\sqrt{17}}{2}<0$은 버린다.\n따라서 $L=\\frac{3+\\sqrt{17}}{2}$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-056",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_ALGEBRAIC",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  },
  {
    "id": 4,
    "category": "수열의 극한",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-01",
    "standardUnit": "수열의 극한",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "수열의 극한"
    ],
    "wide": false,
    "content": "$a_1=3$, $a_{n+1}=-a_n/3+8$일 때 $\\lim_{n\\to\\infty}a_n$은?",
    "choices": [
      "$0$",
      "$2$",
      "$4$",
      "$6$",
      "$8$"
    ],
    "answer": "④",
    "solution": "고정점을 구하면 (점화식의 극한) $L=-\\frac{L}{3}+8$에서 $\\frac{4}{3}L=8$, $L=6$이다.\n$a_{n+1}-6=-\\frac{a_n}{3}+2=-\\frac{1}{3}(a_n-6)$이다.\n따라서 $a_n-6=(a_1-6)\\left(-\\frac13\\right)^{n-1}=-3\\left(-\\frac13\\right)^{n-1}$이다.\n즉 $a_n=6-3\\left(-\\frac13\\right)^{n-1}$이다.\n$\\left|-\\frac13\\right|<1$이므로 (등비수열의 극한) $\\left(-\\frac13\\right)^{n-1}\\to0$이다.\n따라서 $\\lim_{n\\to\\infty}a_n=6$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-056",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_ALGEBRAIC",
    "crossConceptKeys": [
      "CC_GEOMETRIC_SEQUENCE"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 5,
    "category": "수열의 극한",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-01",
    "standardUnit": "수열의 극한",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "수열의 극한"
    ],
    "wide": false,
    "content": "$a_1=5$인 양의 수열에 대해 $x^2-\\sqrt{2a_n}x+(a_{n+1}-2)=0$이 항상 중근을 갖는다. $\\lim_{n\\to\\infty}a_n$은?",
    "choices": [
      "$2$",
      "$4$",
      "$6$",
      "$8$",
      "$10$"
    ],
    "answer": "②",
    "solution": "중근 조건은 판별식 $D=0$이다.\n$D=(\\sqrt{2a_n})^2-4(a_{n+1}-2)=2a_n-4a_{n+1}+8=0$이다.\n정리하면 $4a_{n+1}=2a_n+8$, 즉 $a_{n+1}=\\frac{a_n}{2}+2$이다.\n양변에서 $4$를 빼면 $a_{n+1}-4=\\frac{a_n}{2}-2=\\frac12(a_n-4)$이다.\n따라서 $a_n-4=(a_1-4)\\left(\\frac12\\right)^{n-1}=\\left(\\frac12\\right)^{n-1}$이다.\n$\\left|\\frac12\\right|<1$이므로 (등비수열의 극한) $a_n-4\\to0$이다.\n따라서 $\\lim_{n\\to\\infty}a_n=4$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-056",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_ALGEBRAIC",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 6,
    "category": "수열의 극한",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-01",
    "standardUnit": "수열의 극한",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "수열의 극한"
    ],
    "wide": false,
    "content": "모든 항이 양수이고, 모든 자연수 $n$에서 $a_nx^2-5a_{n+1}x+a_n>0$이 모든 실수 $x$에 대해 성립한다. $\\lim_{n\\to\\infty}\\frac{a_n+4n^2}{2a_n+n^2+n}$은?",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "③",
    "solution": "$a_n>0$이므로 이차식이 모든 실수 $x$에서 양수일 조건은 판별식 $D<0$이다.\n$D=(-5a_{n+1})^2-4a_n\\cdot a_n=25a_{n+1}^2-4a_n^2<0$이다.\n$a_{n+1}>0$이므로 $5a_{n+1}<2a_n$, 즉 $0<a_{n+1}<\\frac25 a_n$이다.\n따라서 $0<a_n<a_1\\left(\\frac25\\right)^{n-1}$이고, $\\left(\\frac25\\right)^{n-1}\\to0$이므로 (조임 정리) $a_n\\to0$이다.\n구하는 식의 분자·분모를 $n^2$으로 나누면 $\\frac{a_n/n^2+4}{2a_n/n^2+1+1/n}$이다.\n$a_n\\to0$이므로 $a_n/n^2\\to0$이고, 따라서 극한은 $\\frac{0+4}{0+1+0}=4$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-056",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_ALGEBRAIC",
    "crossConceptKeys": [
      "CC_FUNCTION_VALUE_SIGN_INEQUALITY"
    ],
    "conditionKeys": [
      "COND_POSITIVE",
      "COND_UNIVERSAL_INPUTS"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 7,
    "category": "수열의 극한",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-01",
    "standardUnit": "수열의 극한",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "수열의 극한"
    ],
    "wide": false,
    "content": "수열 $a_n=\\sqrt{(3n+2)(3n+4)}+kn$이 수렴할 때 그 극한값은?",
    "choices": [
      "$3$",
      "$4$",
      "$5$",
      "$6$",
      "$7$"
    ],
    "answer": "①",
    "solution": "$\\frac{a_n}{n}=\\frac{\\sqrt{(3n+2)(3n+4)}}{n}+k$이다.\n$\\frac{\\sqrt{(3n+2)(3n+4)}}{n}=\\sqrt{\\left(3+\\frac2n\\right)\\left(3+\\frac4n\\right)}\\to3$이다.\n수렴하려면 $\\frac{a_n}{n}\\to0$이어야 하므로 $3+k=0$, $k=-3$이다.\n이때 $a_n=\\sqrt{9n^2+18n+8}-3n$이다.\n분자를 유리화하면 $a_n=\\frac{(9n^2+18n+8)-9n^2}{\\sqrt{9n^2+18n+8}+3n}=\\frac{18n+8}{\\sqrt{9n^2+18n+8}+3n}$이다.\n분자·분모를 $n$으로 나누면 $\\frac{18+8/n}{\\sqrt{9+18/n+8/n^2}+3}$이다.\n$\\frac1n\\to0$, $\\frac1{n^2}\\to0$이므로 극한은 $\\frac{18}{3+3}=3$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-056",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_ALGEBRAIC",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 8,
    "category": "수열의 극한",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-01",
    "standardUnit": "수열의 극한",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "수열의 극한"
    ],
    "wide": false,
    "content": "모든 자연수 $n$에 대해 $x^2-(2n+1)x+a_n=0$은 실근을 갖고 $x^2-2nx+a_n=0$은 실근을 갖지 않는다. $\\lim_{n\\to\\infty}\\frac{a_n}{n^2+n}$은?",
    "choices": [
      "$\\frac12$",
      "$1$",
      "$\\frac32$",
      "$2$",
      "$\\frac52$"
    ],
    "answer": "②",
    "solution": "첫째 이차방정식이 실근을 가지므로 판별식 $D_1=(2n+1)^2-4a_n\\ge0$이다.\n따라서 $a_n\\le\\frac{(2n+1)^2}{4}$이다.\n둘째 이차방정식이 실근을 갖지 않으므로 판별식 $D_2=4n^2-4a_n<0$이다.\n따라서 $a_n>n^2$이다.\n두 부등식을 합치면 $n^2<a_n\\le\\frac{(2n+1)^2}{4}$이다.\n각 변을 $n^2+n$으로 나누면 $\\frac{n^2}{n^2+n}<\\frac{a_n}{n^2+n}\\le\\frac{(2n+1)^2}{4(n^2+n)}$이다.\n$\\frac{n^2}{n^2+n}=\\frac{1}{1+1/n}\\to1$이다.\n$\\frac{(2n+1)^2}{4(n^2+n)}=\\frac{4n^2+4n+1}{4n^2+4n}=1+\\frac{1}{4n(n+1)}\\to1$이다.\n조임 정리에 의해 극한은 $1$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-056",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_ALGEBRAIC",
    "crossConceptKeys": [
      "CC_GRAPH_X_INTERCEPT_COUNT"
    ],
    "conditionKeys": [
      "COND_UNIVERSAL_INPUTS"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 9,
    "category": "수열의 극한",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-01",
    "standardUnit": "수열의 극한",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "수열의 극한"
    ],
    "wide": false,
    "content": "$f(x)=4x^2-x$의 그래프 위 점 $P_n(n,f(n))$, $Q_n(n+1,f(n+1))$ 사이의 거리를 $d_n$, 직선 $P_nQ_n$의 기울기를 $m_n$이라 하자. $\\lim_{n\\to\\infty}\\frac{d_n+m_n}{n}$은? [그림: 포물선 $y=4x^2-x$의 오른쪽 가지 위에 $P_n(n,4n^2-n)$과 $Q_n(n+1,4(n+1)^2-(n+1))$을 찍고 잇는다.]",
    "choices": [
      "$8$",
      "$10$",
      "$12$",
      "$14$",
      "$16$"
    ],
    "answer": "⑤",
    "solution": "$P_n(n,4n^2-n)$, $Q_n(n+1,4(n+1)^2-(n+1))$이다.\n$f(n+1)=4(n^2+2n+1)-n-1=4n^2+7n+3$이다.\n가로 차는 $(n+1)-n=1$, 세로 차는 $(4n^2+7n+3)-(4n^2-n)=8n+3$이다.\n기울기는 $m_n=\\frac{8n+3}{1}=8n+3$이다.\n거리는 $d_n=\\sqrt{1^2+(8n+3)^2}$이다.\n$\\frac{d_n+m_n}{n}=\\frac{\\sqrt{1+(8n+3)^2}}{n}+\\frac{8n+3}{n}$이다.\n$\\frac{\\sqrt{1+(8n+3)^2}}{n}=\\sqrt{\\frac{1}{n^2}+\\left(8+\\frac3n\\right)^2}\\to8$이다.\n$\\frac{8n+3}{n}=8+\\frac3n\\to8$이다.\n따라서 극한은 $8+8=16$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-056",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_ALGEBRAIC",
    "crossConceptKeys": [
      "CC_AVERAGE_RATE_OF_CHANGE",
      "CC_QUADRATIC_FUNCTION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 10,
    "category": "수열의 극한",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-01",
    "standardUnit": "수열의 극한",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "수열의 극한"
    ],
    "wide": false,
    "content": "첫째항이 $3$, 공비가 $2$인 등비수열에서 $f(n)=a_n$, $g(n)=\\sum_{j=1}^n a_j$, $k=\\lim_{n\\to\\infty}\\frac{g(n)}{a_n+a_{n+1}}$라 하자. $f(3)g(2)k$는?",
    "choices": [
      "$72$",
      "$75$",
      "$78$",
      "$81$",
      "$84$"
    ],
    "answer": "①",
    "solution": "$a_n=3\\cdot2^{n-1}$이므로 $f(n)=3\\cdot2^{n-1}$이다.\n등비수열의 합 공식으로 $g(n)=\\sum_{j=1}^n 3\\cdot2^{j-1}=3\\cdot\\frac{2^n-1}{2-1}=3(2^n-1)$이다.\n$a_n+a_{n+1}=3\\cdot2^{n-1}+3\\cdot2^n=3\\cdot2^{n-1}(1+2)=9\\cdot2^{n-1}$이다.\n$\\frac{g(n)}{a_n+a_{n+1}}=\\frac{3(2^n-1)}{9\\cdot2^{n-1}}=\\frac23\\cdot\\frac{2^n-1}{2^n}=\\frac23\\left(1-\\frac1{2^n}\\right)$이다.\n$\\frac1{2^n}\\to0$이므로 $k=\\frac23$이다.\n$f(3)=3\\cdot2^2=12$, $g(2)=3(2^2-1)=9$이다.\n$f(3)g(2)k=12\\cdot9\\cdot\\frac23=72$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-056",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_ALGEBRAIC",
    "crossConceptKeys": [
      "CC_GEOMETRIC_SEQUENCE",
      "CC_SERIES_SUM"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 11,
    "category": "수열의 극한",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-01",
    "standardUnit": "수열의 극한",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "수열의 극한"
    ],
    "wide": false,
    "content": "다항식 $(x+2)^n$을 $x(x-1)$로 나눈 나머지가 $R_n(x)$일 때 $\\lim_{n\\to\\infty}\\frac{3^{n+1}+1}{2^n+R_n(2)}$는?",
    "choices": [
      "$\\frac12$",
      "$1$",
      "$\\frac32$",
      "$2$",
      "$\\frac52$"
    ],
    "answer": "③",
    "solution": "$R_n(x)$는 나머지이므로 차수가 $1$ 이하이고, $R_n(x)=ax+b$로 둔다.\n$x=0$을 대입하면 (나머지 정리) $R_n(0)=2^n$, 즉 $b=2^n$이다.\n$x=1$을 대입하면 $R_n(1)=3^n$, 즉 $a+2^n=3^n$에서 $a=3^n-2^n$이다.\n따라서 $R_n(x)=(3^n-2^n)x+2^n$이다.\n$R_n(2)=2(3^n-2^n)+2^n=2\\cdot3^n-2^{n+1}+2^n=2\\cdot3^n-2^n$이다.\n$2^n+R_n(2)=2^n+2\\cdot3^n-2^n=2\\cdot3^n$이다.\n$\\frac{3^{n+1}+1}{2\\cdot3^n}=\\frac{3+3^{-n}}{2}$이다.\n$3^{-n}\\to0$이므로 극한은 $\\frac32$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-056",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_ALGEBRAIC",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 12,
    "category": "수열의 극한",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-01",
    "standardUnit": "수열의 극한",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "수열의 극한"
    ],
    "wide": false,
    "content": "두 점 $A(0,2n)$, $B(-n,0)$과 원 $x^2+y^2=n$이 있다. 원 위에서 삼각형 $PAB$의 넓이를 최대화하는 점 $P$의 $x$좌표가 $a_n$일 때 $\\lim_{n\\to\\infty}\\sqrt n(a_{n+1}-a_n)$은? [그림: 원점 중심의 반지름 $\\sqrt n$인 원과 직선 $AB$를 그리고, 원점에서 직선 $AB$의 반대편으로 뻗는 수직 반직선과 원의 교점을 $P$로 표시한다.]",
    "choices": [
      "$-\\frac{2}{\\sqrt5}$",
      "$-\\frac1{\\sqrt5}$",
      "$0$",
      "$\\frac1{\\sqrt5}$",
      "$\\frac2{\\sqrt5}$"
    ],
    "answer": "④",
    "solution": "직선 $AB$는 두 점 $(0,2n)$, $(-n,0)$을 지나므로 기울기는 $\\frac{2n-0}{0-(-n)}=2$이다.\n방정식은 $y=2x+2n$, 즉 $2x-y+2n=0$이다.\n삼각형 $PAB$는 밑변 $AB$가 고정이므로 $P$에서 직선 $AB$까지의 거리가 최대일 때 넓이가 최대이다.\n원 $x^2+y^2=n$의 중심은 원점, 반지름은 $\\sqrt n$이다.\n직선의 법선벡터 $(2,-1)$ 방향으로 원점에서 가장 먼 점이 거리를 최대로 한다.\n단위법선벡터 $\\frac{1}{\\sqrt5}(2,-1)$에 반지름 $\\sqrt n$을 곱하면 $P_n\\left(\\frac{2\\sqrt n}{\\sqrt5},-\\frac{\\sqrt n}{\\sqrt5}\\right)$이다.\n따라서 $a_n=\\frac{2\\sqrt n}{\\sqrt5}$이다.\n$a_{n+1}-a_n=\\frac{2}{\\sqrt5}(\\sqrt{n+1}-\\sqrt n)=\\frac{2}{\\sqrt5}\\cdot\\frac{1}{\\sqrt{n+1}+\\sqrt n}$이다.\n$\\sqrt n(a_{n+1}-a_n)=\\frac{2}{\\sqrt5}\\cdot\\frac{\\sqrt n}{\\sqrt{n+1}+\\sqrt n}=\\frac{2}{\\sqrt5}\\cdot\\frac{1}{\\sqrt{1+1/n}+1}$이다.\n$\\frac1n\\to0$이므로 극한은 $\\frac{2}{\\sqrt5}\\cdot\\frac{1}{1+1}=\\frac1{\\sqrt5}$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-056",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_ALGEBRAIC",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 13,
    "category": "수열의 극한",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-01",
    "standardUnit": "수열의 극한",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "수열의 극한"
    ],
    "wide": false,
    "content": "$x^2+4nx-4n=0$의 두 근은 $\\alpha_n<\\beta_n$이다. 수직선 위에서 $A(\\alpha_n)$, $B(\\beta_n)$을 잇는 선분을 $n:1$로 내분하는 점의 좌표를 $p_n$이라 할 때 $\\lim_{n\\to\\infty}p_n$은?",
    "choices": [
      "$-4$",
      "$-3$",
      "$-2$",
      "$-1$",
      "$0$"
    ],
    "answer": "②",
    "solution": "근과 계수의 관계로 $\\alpha_n+\\beta_n=-4n$, $\\alpha_n\\beta_n=-4n$이다.\n근의 공식으로 $\\beta_n=\\frac{-4n+\\sqrt{16n^2+16n}}{2}=-2n+2\\sqrt{n^2+n}$이다.\n유리화하면 $\\beta_n=2\\cdot\\frac{(n^2+n)-n^2}{\\sqrt{n^2+n}+n}=\\frac{2n}{\\sqrt{n^2+n}+n}$이다.\n분자·분모를 $n$으로 나누면 $\\beta_n=\\frac{2}{\\sqrt{1+1/n}+1}\\to1$이다.\n$\\alpha_n=-4n-\\beta_n$이므로 $\\frac{\\alpha_n}{n}=-4-\\frac{\\beta_n}{n}\\to-4$이다.\n$AP_n:P_nB=n:1$인 내분점은 $p_n=\\frac{1\\cdot\\alpha_n+n\\cdot\\beta_n}{n+1}$이다.\n$p_n=\\frac{-4n-\\beta_n+n\\beta_n}{n+1}=\\frac{-4n+(n-1)\\beta_n}{n+1}$이다.\n분자·분모를 $n$으로 나누면 $p_n=\\frac{-4+\\left(1-\\frac1n\\right)\\beta_n}{1+\\frac1n}$이다.\n$\\frac1n\\to0$, $\\beta_n\\to1$이므로 극한은 $\\frac{-4+1}{1}=-3$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-056",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_ALGEBRAIC",
    "crossConceptKeys": [
      "CC_PARABOLA_X_INTERCEPT_DISTANCE"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 14,
    "category": "수열의 극한",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-01",
    "standardUnit": "수열의 극한",
    "standardUnitOrder": 1,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "수열의 극한"
    ],
    "wide": false,
    "content": "$P_n=(4^n,2^n)$, $Q_n=(4^n,0)$이다. $P_nP_{n+1}$의 길이를 $L_n$, 사각형 $P_nQ_nQ_{n+1}P_{n+1}$의 넓이를 $A_n$이라 할 때 $\\lim_{n\\to\\infty}\\left((L_{n+1}/L_n)^2+\\frac{A_{n+1}-4^n}{A_n+4^n}\\right)$은? [그림: 곡선 $y=\\sqrt{x}$와 두 수직선 $x=4^n$, $x=4^{n+1}$을 그린다. 곡선과의 교점 두 개와 $x$축 위 수선의 발 두 개를 직선으로 이어 사다리꼴을 표시한다.]",
    "choices": [
      "$16$",
      "$20$",
      "$24$",
      "$28$",
      "$32$"
    ],
    "answer": "③",
    "solution": "$P_n(4^n,2^n)$, $P_{n+1}(4^{n+1},2^{n+1})$이므로 가로 차는 $4^{n+1}-4^n=3\\cdot4^n$이다.\n세로 차는 $2^{n+1}-2^n=2^n$이다.\n$L_n=\\sqrt{(3\\cdot4^n)^2+(2^n)^2}=\\sqrt{9\\cdot16^n+4^n}$이다.\n$\\left(\\frac{L_{n+1}}{L_n}\\right)^2=\\frac{9\\cdot16^{n+1}+4^{n+1}}{9\\cdot16^n+4^n}$이다.\n분자·분모를 $16^n$으로 나누면 $\\frac{144+4\\left(\\frac14\\right)^n}{9+\\left(\\frac14\\right)^n}\\to\\frac{144}{9}=16$이다.\n사다리꼴의 두 평행변은 $2^n$, $2^{n+1}$이고 높이는 $4^{n+1}-4^n=3\\cdot4^n$이다.\n$A_n=\\frac12(2^n+2^{n+1})(3\\cdot4^n)=\\frac12\\cdot3\\cdot2^n\\cdot3\\cdot4^n=\\frac92\\cdot8^n$이다.\n$A_{n+1}=\\frac92\\cdot8^{n+1}=36\\cdot8^n$이다.\n$\\frac{A_{n+1}-4^n}{A_n+4^n}=\\frac{36\\cdot8^n-4^n}{\\frac92\\cdot8^n+4^n}=\\frac{36-\\left(\\frac12\\right)^n}{\\frac92+\\left(\\frac12\\right)^n}$이다.\n$\\left(\\frac12\\right)^n\\to0$이므로 이 극한은 $\\frac{36}{9/2}=8$이다.\n따라서 전체 극한은 $16+8=24$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-056",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_ALGEBRAIC",
    "crossConceptKeys": [
      "CC_VERTICAL_SEGMENT_LENGTH"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
