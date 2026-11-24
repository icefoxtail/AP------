window.examTitle = "미적분II_004_∞∞꼴의극한_고2_유형은행1";

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
    "content": "$a=\\lim_{n\\to\\infty}((5n^2-1)/(n^2+3n))$, $b=\\lim_{n\\to\\infty}((\\sqrt{4n^2+n}+2n)/\\sqrt{n^2+4})$일 때 $ab$는?",
    "choices": [
      "$8$",
      "$10$",
      "$12$",
      "$16$",
      "$20$"
    ],
    "answer": "⑤",
    "solution": "$a$의 극한: 분자·분모를 $n^2$으로 나누면 $a=\\lim_{n\\to\\infty}\\frac{5-1/n^2}{1+3/n}=\\frac{5}{1}=5$이다.\n$b$의 극한: $\\sqrt{4n^2+n}=n\\sqrt{4+1/n}$이므로 분자·분모를 $n$으로 나누면 $b=\\lim_{n\\to\\infty}\\frac{\\sqrt{4+1/n}+2}{\\sqrt{1+4/n^2}}=\\frac{2+2}{1}=4$이다.\n따라서 $ab=5\\cdot4=20$이다.\n주의: 두 극한이 각각 수렴하므로 곱의 극한 성질을 그대로 쓸 수 있다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-058",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_ALGEBRAIC",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "방정식 $x^2+(3n^2+2)x+2n^2=0$의 두 근을 $\\alpha_n,\\beta_n$이라 할 때 $\\lim_{n\\to\\infty}(1/\\alpha_n+1/\\beta_n)$은?",
    "choices": [
      "$-3/2$",
      "$-1$",
      "$0$",
      "$1$",
      "$3/2$"
    ],
    "answer": "①",
    "solution": "근과 계수의 관계: $\\alpha_n+\\beta_n=-(3n^2+2)$, $\\alpha_n\\beta_n=2n^2$이다.\n$\\frac{1}{\\alpha_n}+\\frac{1}{\\beta_n}=\\frac{\\alpha_n+\\beta_n}{\\alpha_n\\beta_n}=\\frac{-(3n^2+2)}{2n^2}=-\\frac{3}{2}-\\frac{1}{n^2}$로 정리된다.\n$n\\to\\infty$일 때 $\\frac{1}{n^2}\\to0$이므로 극한은 $-\\frac{3}{2}$이다.\n주의: $\\alpha_n\\beta_n=2n^2\\ne0$이므로 두 근 모두 0이 아니어서 역수를 취할 수 있다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-058",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_ALGEBRAIC",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "두 등차수열 $a_n,b_n$의 공차가 각각 7, 3일 때 $\\lim_{n\\to\\infty}(b_n/(a_n+b_n))$은?",
    "choices": [
      "$1/10$",
      "$3/10$",
      "$5/10$",
      "$7/10$",
      "$9/10$"
    ],
    "answer": "②",
    "solution": "$a_n=a_1+7(n-1)$, $b_n=b_1+3(n-1)$이라 하자.\n분자·분모를 $n$으로 나누면 $\\frac{b_n}{a_n+b_n}=\\frac{b_1/n+3-3/n}{a_1/n+b_1/n+10-10/n}$이다.\n$n\\to\\infty$일 때 $\\frac{a_1}{n}\\to0$, $\\frac{b_1}{n}\\to0$, $\\frac{3}{n}\\to0$, $\\frac{10}{n}\\to0$이다.\n따라서 극한은 $\\frac{3}{10}$이다.\n주의: 분모의 극한이 $10\\ne0$이므로 극한의 성질(수렴하는 두 수열의 몫)을 쓸 수 있다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-058",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_ALGEBRAIC",
    "crossConceptKeys": [
      "CC_GENERAL_TERM"
    ],
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
    "content": "첫째항이 5, 공차가 6인 등차수열 $a_n$에 대해 $\\lim_{n\\to\\infty}((a_1+\\cdots+a_n)/n^2)$은?",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "③",
    "solution": "일반항: $a_n=5+6(n-1)=6n-1$이다.\n등차수열의 합 공식: $a_1+\\cdots+a_n=\\frac{n(a_1+a_n)}{2}=\\frac{n(5+6n-1)}{2}=\\frac{n(6n+4)}{2}=3n^2+2n$이다.\n따라서 $\\frac{a_1+\\cdots+a_n}{n^2}=\\frac{3n^2+2n}{n^2}=3+\\frac{2}{n}$이다.\n$n\\to\\infty$일 때 $\\frac{2}{n}\\to0$이므로 극한은 3이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-058",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_ALGEBRAIC",
    "crossConceptKeys": [
      "CC_SERIES_SUM"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "$a_1=2$, $a_2=5$이고 $a_{n+2}-a_{n+1}=a_{n+1}-a_n$일 때 $\\lim_{n\\to\\infty}(a_na_{n+1}/(3+6+\\cdots+3n))$은?",
    "choices": [
      "$6$",
      "$8$",
      "$9$",
      "$10$",
      "$12$"
    ],
    "answer": "①",
    "solution": "$a_{n+2}-a_{n+1}=a_{n+1}-a_n$은 이웃한 두 항의 차가 일정하다는 뜻이므로 $\\{a_n\\}$은 등차수열이다.\n공차는 $d=a_2-a_1=5-2=3$이므로 일반항은 $a_n=2+3(n-1)=3n-1$이다.\n따라서 $a_{n+1}=3(n+1)-1=3n+2$이다.\n분자: $a_na_{n+1}=(3n-1)(3n+2)=9n^2+6n-3n-2=9n^2+3n-2$이다.\n분모: $3+6+\\cdots+3n=3(1+2+\\cdots+n)=3\\cdot\\frac{n(n+1)}{2}=\\frac{3n^2+3n}{2}$이다.\n분자·분모를 $n^2$으로 나누면 $\\frac{9+\\frac{3}{n}-\\frac{2}{n^2}}{\\frac{3}{2}+\\frac{3}{2n}}$이다.\n$n\\to\\infty$일 때 $\\frac{3}{n}\\to0$, $\\frac{2}{n^2}\\to0$, $\\frac{3}{2n}\\to0$이므로 극한은 $\\frac{9}{3/2}=6$이다.\n주의: 분모의 $n^2$ 계수는 $\\frac{3}{2}$이므로 분모를 $3n^2$으로 착각하면 답이 달라진다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-058",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_ALGEBRAIC",
    "crossConceptKeys": [
      "CC_GENERAL_TERM",
      "CC_SERIES_SUM"
    ],
    "conditionKeys": [],
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
    "content": "그래프와 같이 정의된 함수 $f$에 대해 $\\lim_{n\\to\\infty}((|3nf(a)-2|-2nf(a))/(2n+1))=10$를 만족시키는 실수 $a$의 개수는? [그림: 좌표평면에서 $(-4,0),(-2,4),(1,-4),(3,2)$를 순서대로 선분으로 잇는다. 양 끝점을 포함한다.]",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "①",
    "solution": "분자·분모를 $n$으로 나누면 $\\frac{|3nf(a)-2|-2nf(a)}{2n+1}=\\frac{\\left|3f(a)-\\frac{2}{n}\\right|-2f(a)}{2+\\frac{1}{n}}$이다.\n$n\\to\\infty$일 때 $\\frac{1}{n}\\to0$, $\\frac{2}{n}\\to0$이므로 $f(a)\\ne0$이면 극한은 $\\frac{3|f(a)|-2f(a)}{2}$이다.\n(i) $f(a)>0$인 경우: $3|f(a)|-2f(a)=3f(a)-2f(a)=f(a)$이므로 $\\frac{f(a)}{2}=10$에서 $f(a)=20$이다.\n그러나 그래프의 함숫값은 최대 4이므로 $f(a)=20$인 $a$는 존재하지 않는다.\n(ii) $f(a)<0$인 경우: $3|f(a)|-2f(a)=-3f(a)-2f(a)=-5f(a)$이므로 $\\frac{-5f(a)}{2}=10$에서 $f(a)=-4$이다.\n그래프에서 $f(a)=-4$가 되는 점은 $(-2,4)$와 $(1,-4)$를 잇는 선분의 끝점 $a=1$뿐이다(그 다음 구간에서는 증가한다).\n확인: $f(1)=-4$를 원식에 대입하면 $\\frac{|3n(-4)-2|-2n(-4)}{2n+1}=\\frac{12n+2+8n}{2n+1}=\\frac{20n+2}{2n+1}\\to10$이다.\n주의: $f(a)=0$이면 분자가 $|-2|-0=2$로 남아 극한이 0이 되므로 답이 될 수 없다.\n따라서 조건을 만족하는 $a$는 $a=1$ 하나뿐이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-058",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_ALGEBRAIC",
    "crossConceptKeys": [
      "CC_ABSOLUTE_VALUE_GRAPH",
      "CC_PIECEWISE_FUNCTION"
    ],
    "conditionKeys": [],
    "integrationPattern": "CASE_BRANCH"
  }
];
