window.examTitle = "미적분II_005_합또는곱을이용한∞∞꼴의극한_고2_유형은행1";

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
    "content": "$a=\\lim_{n\\to\\infty}((2+4+\\cdots+2n)/n^2)$, $b=\\lim_{n\\to\\infty}((1^3+2^3+\\cdots+n^3)/n^4)$일 때 $a+b$는?",
    "choices": [
      "$1$",
      "$5/4$",
      "$3/2$",
      "$7/4$",
      "$2$"
    ],
    "answer": "②",
    "solution": "등차수열의 합 공식으로 분자를 계산하면 $2+4+\\cdots+2n=2\\cdot\\frac{n(n+1)}2=n(n+1)$이다.\n따라서 $a=\\lim_{n\\to\\infty}\\frac{n(n+1)}{n^2}=\\lim_{n\\to\\infty}\\left(1+\\frac1n\\right)=1$이다.\n세제곱의 합 공식으로 분자를 계산하면 $1^3+2^3+\\cdots+n^3=\\left(\\frac{n(n+1)}2\\right)^2$이다.\n따라서 $b=\\lim_{n\\to\\infty}\\frac{n^2(n+1)^2}{4n^4}=\\lim_{n\\to\\infty}\\frac14\\left(1+\\frac1n\\right)^2=\\frac14$이다.\n두 극한값을 더하면 $a+b=1+\\frac14=\\frac54$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-058",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_ALGEBRAIC",
    "crossConceptKeys": [
      "CC_SERIES_SUM"
    ],
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
    "content": "$a=\\lim_{n\\to\\infty}((3+6+\\cdots+3n)/(1+3+\\cdots+(2n-1)))$, $b=\\lim_{n\\to\\infty}(n^3/(2\\sum_{k=1}^n k(k+1)))$일 때 $a+b$는?",
    "choices": [
      "$3$",
      "$7/2$",
      "$4$",
      "$9/2$",
      "$5$"
    ],
    "answer": "①",
    "solution": "등차수열의 합 공식으로 분자를 계산하면 $3+6+\\cdots+3n=3\\cdot\\frac{n(n+1)}2$이다.\n홀수의 합 성질로 분모를 계산하면 $1+3+\\cdots+(2n-1)=n^2$이다.\n따라서 $a=\\lim_{n\\to\\infty}\\frac{3n(n+1)/2}{n^2}=\\lim_{n\\to\\infty}\\frac32\\left(1+\\frac1n\\right)=\\frac32$이다.\n$\\sum_{k=1}^n k(k+1)=\\sum_{k=1}^n k^2+\\sum_{k=1}^n k=\\frac{n(n+1)(2n+1)}6+\\frac{n(n+1)}2$이다.\n이를 정리하면 $\\sum_{k=1}^n k(k+1)=\\frac{n(n+1)(n+2)}3$이다.\n따라서 $b=\\lim_{n\\to\\infty}\\frac{n^3}{2\\cdot n(n+1)(n+2)/3}=\\lim_{n\\to\\infty}\\frac{3n^2}{2(n+1)(n+2)}=\\frac32$이다.\n두 극한값을 더하면 $a+b=\\frac32+\\frac32=3$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-058",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_ALGEBRAIC",
    "crossConceptKeys": [
      "CC_SERIES_SUM"
    ],
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
    "content": "$\\lim_{n\\to\\infty}((2+4+\\cdots+2n+2(n-1)+\\cdots+2)/(2+7+\\cdots+(5n-3)))$은?",
    "choices": [
      "$1/5$",
      "$2/5$",
      "$3/5$",
      "$4/5$",
      "$1$"
    ],
    "answer": "④",
    "solution": "분자의 앞부분은 등차수열의 합으로 $2+4+\\cdots+2n=n(n+1)$이다.\n분자의 뒷부분은 $2+4+\\cdots+2(n-1)=n(n-1)$이다.\n따라서 분자는 $n(n+1)+n(n-1)=2n^2$이다.\n분모는 첫째항 $2$, 공차 $5$인 등차수열의 합이므로 $2+7+\\cdots+(5n-3)=\\frac n2\\{2+(5n-3)\\}=\\frac{n(5n-1)}2$이다.\n극한을 계산하면 $\\lim_{n\\to\\infty}\\frac{2n^2}{n(5n-1)/2}=\\lim_{n\\to\\infty}\\frac{4n}{5n-1}=\\lim_{n\\to\\infty}\\frac4{5-1/n}=\\frac45$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
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
    "content": "$\\lim_{n\\to\\infty}(((2n+1)+(2n+2)+\\cdots+3n)/(1+2+\\cdots+n))$은?",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "④",
    "solution": "분자는 첫째항 $2n+1$, 끝항 $3n$, 항의 개수 $n$인 등차수열의 합이다.\n따라서 분자는 $\\frac n2\\{(2n+1)+3n\\}=\\frac{n(5n+1)}2$이다.\n분모는 $1+2+\\cdots+n=\\frac{n(n+1)}2$이다.\n극한을 계산하면 $\\lim_{n\\to\\infty}\\frac{n(5n+1)/2}{n(n+1)/2}=\\lim_{n\\to\\infty}\\frac{5n+1}{n+1}$이다.\n분모와 분자를 $n$으로 나누면 $\\lim_{n\\to\\infty}\\frac{5+1/n}{1+1/n}=5$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
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
    "content": "$\\lim_{n\\to\\infty}(kn^2/(4+8+\\cdots+4n))=7$일 때 상수 $k$는?",
    "choices": [
      "$10$",
      "$12$",
      "$14$",
      "$16$",
      "$18$"
    ],
    "answer": "③",
    "solution": "분모는 첫째항 $4$, 공차 $4$인 등차수열의 합이므로 $4+8+\\cdots+4n=4\\cdot\\frac{n(n+1)}2=2n(n+1)$이다.\n주어진 극한은 $\\lim_{n\\to\\infty}\\frac{kn^2}{2n(n+1)}=\\lim_{n\\to\\infty}\\frac{kn}{2(n+1)}$이다.\n분모와 분자를 $n$으로 나누면 $\\lim_{n\\to\\infty}\\frac{k}{2(1+1/n)}=\\frac k2$이다.\n이 값이 $7$이므로 $\\frac k2=7$에서 $k=14$이다.\n따라서 정답은 ③이다.",
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
    "content": "$\\lim_{n\\to\\infty}(\\prod_{k=4}^n(1-1/k^2))$은?",
    "choices": [
      "$3/4$",
      "$4/5$",
      "$5/6$",
      "$6/7$",
      "$7/8$"
    ],
    "answer": "①",
    "solution": "$1-\\frac1{k^2}=\\frac{k^2-1}{k^2}=\\frac{(k-1)(k+1)}{k^2}$로 인수분해한다.\n따라서 $\\prod_{k=4}^n\\left(1-\\frac1{k^2}\\right)=\\prod_{k=4}^n\\frac{k-1}{k}\\cdot\\prod_{k=4}^n\\frac{k+1}{k}$이다.\n첫째 곱은 $\\prod_{k=4}^n\\frac{k-1}{k}=\\frac{3\\cdot4\\cdots(n-1)}{4\\cdot5\\cdots n}=\\frac3n$으로 약분된다.\n둘째 곱은 $\\prod_{k=4}^n\\frac{k+1}{k}=\\frac{5\\cdot6\\cdots(n+1)}{4\\cdot5\\cdots n}=\\frac{n+1}{4}$로 약분된다.\n두 곱을 곱하면 $\\frac3n\\cdot\\frac{n+1}{4}=\\frac{3(n+1)}{4n}$이다.\n극한을 계산하면 $\\lim_{n\\to\\infty}\\frac{3(n+1)}{4n}=\\lim_{n\\to\\infty}\\frac34\\left(1+\\frac1n\\right)=\\frac34$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "low",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-058",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_ALGEBRAIC",
    "crossConceptKeys": [
      "CC_TELESCOPING_SERIES"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
