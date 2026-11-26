window.examTitle = "미적분II_012_수열의극한의대소관계1_고2_유형은행1";

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
    "content": "실수 $\\theta$에 대해 $\\lim_{n\\to\\infty}(3n\\sin(n\\theta)/(n^2+2))$은?",
    "choices": [
      "$-1$",
      "$0$",
      "$1$",
      "$2$",
      "$3$"
    ],
    "answer": "②",
    "solution": "주어진 식의 절댓값을 취하면 $|3n\\sin(n\\theta)/(n^2+2)|\\le 3n/(n^2+2)$이다.\n분모를 $n^2$으로 나누면 $3n/(n^2+2)=3/(n+2/n)$이다.\n수열의 극한의 성질에 의해 $3/(n+2/n)\\to0$이다.\n따라서 조임 정리에 의해 $\\lim_{n\\to\\infty}3n\\sin(n\\theta)/(n^2+2)=0$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-059",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_SQUEEZE",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_EXTREMUM"
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
    "content": "$\\lim_{n\\to\\infty}(n(3n+2\\cos(n\\pi))/(n^2+4))$은?",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "③",
    "solution": "$\\cos(n\\pi)=(-1)^n$이므로 $|\\cos(n\\pi)|\\le1$이다.\n분자와 분모를 $n^2$으로 나누면 $$\\frac{n(3n+2\\cos n\\pi)}{n^2+4}=\\frac{3+2\\cos(n\\pi)/n}{1+4/n^2}.$$\n$|2\\cos(n\\pi)/n|\\le2/n\\to0$이므로 분자는 $3$으로 간다.\n분모는 $1+4/n^2\\to1$이다.\n수열의 극한의 성질(몫의 극한)에 의해 극한값은 $3/1=3$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-059",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_SQUEEZE",
    "crossConceptKeys": [
      "CC_COSINE_FUNCTION_RANGE"
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
    "content": "모든 $n$에서 $4n-2/n\\le na_n\\le4n+2/n$이면 $\\lim_{n\\to\\infty}(a_n)$은?",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "③",
    "solution": "주어진 부등식의 각 변을 양수 $n$으로 나누면 $4-\\frac{2}{n^2}\\le a_n\\le4+\\frac{2}{n^2}$이다.\n$\\frac{2}{n^2}\\to0$이므로 왼쪽 경계는 $4$로 간다.\n같은 이유로 오른쪽 경계도 $4$로 간다.\n조임 정리에 의해 $\\lim_{n\\to\\infty}a_n=4$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-059",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_SQUEEZE",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_UNIVERSAL_INPUTS"
    ],
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
    "content": "모든 $n$에서 $1/(n+2)\\le(a_n+2)/(4n+2)\\le1/n$이면 $\\lim_{n\\to\\infty}(a_n)$은?",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "①",
    "solution": "주어진 부등식의 각 변에 양수 $4n+2$를 곱하면 $\\frac{4n+2}{n+2}\\le a_n+2\\le\\frac{4n+2}{n}$이다.\n왼쪽 경계를 변형하면 $\\frac{4n+2}{n+2}=4-\\frac{6}{n+2}$이다.\n따라서 $2-\\frac{6}{n+2}\\le a_n\\le2+\\frac{2}{n}$이다.\n$\\frac{6}{n+2}\\to0$, $\\frac{2}{n}\\to0$이므로 양쪽 경계가 모두 $2$로 간다.\n조임 정리에 의해 $\\lim_{n\\to\\infty}a_n=2$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-059",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_SQUEEZE",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_UNIVERSAL_INPUTS"
    ],
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
    "content": "모든 $n$에서 $3n^3+2<n/a_n<3n^3+5$이면 $\\lim_{n\\to\\infty}((2n^2+1)a_n)$은?",
    "choices": [
      "$1/6$",
      "$1/4$",
      "$1/3$",
      "$1/2$",
      "$2/3$"
    ],
    "answer": "⑤",
    "solution": "$n/a_n>0$이므로 역수를 취하면 $\\frac{1}{3n^3+5}<\\frac{a_n}{n}<\\frac{1}{3n^3+2}$이다.\n각 변에 $n$을 곱하면 $\\frac{n}{3n^3+5}<a_n<\\frac{n}{3n^3+2}$이다.\n양변에 $2n^2+1>0$을 곱하면 $$\\frac{n(2n^2+1)}{3n^3+5}<(2n^2+1)a_n<\\frac{n(2n^2+1)}{3n^3+2}.$$\n왼쪽 경계는 분모·분자를 $n^3$으로 나누면 $\\frac{2+1/n^2}{3+5/n^3}\\to\\frac23$이다.\n오른쪽 경계도 $\\frac{2+1/n^2}{3+2/n^3}\\to\\frac23$이다.\n조임 정리에 의해 구하는 극한은 $\\frac23$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-059",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_SQUEEZE",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_UNIVERSAL_INPUTS"
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
    "content": "모든 $n$에 대해 $|a_n-5n|\\le7$이면 $\\lim_{n\\to\\infty}(a_n/(2n))$은?",
    "choices": [
      "$2$",
      "$5/2$",
      "$3$",
      "$7/2$",
      "$4$"
    ],
    "answer": "②",
    "solution": "절댓값 부등식 $|a_n-5n|\\le7$을 풀면 $5n-7\\le a_n\\le5n+7$이다.\n각 변을 양수 $2n$으로 나누면 $\\frac52-\\frac{7}{2n}\\le\\frac{a_n}{2n}\\le\\frac52+\\frac{7}{2n}$이다.\n$\\frac{7}{2n}\\to0$이므로 양쪽 경계는 모두 $\\frac52$로 간다.\n조임 정리에 의해 $\\lim_{n\\to\\infty}\\frac{a_n}{2n}=\\frac52$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-059",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_SQUEEZE",
    "crossConceptKeys": [],
    "conditionKeys": [
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
    "content": "첫째항 2, 공차 5인 등차수열 $a_n$에 대해 모든 $n$에서 $3n+1<a_nb_n<3n+4$이면 $\\lim_{n\\to\\infty}(b_n)$은?",
    "choices": [
      "$1/5$",
      "$3/10$",
      "$2/5$",
      "$1/2$",
      "$3/5$"
    ],
    "answer": "⑤",
    "solution": "등차수열의 일반항은 $a_n=2+(n-1)5=5n-3$이다.\n$n\\ge1$에서 $5n-3>0$이므로 주어진 부등식을 $5n-3$으로 나누면 $\\frac{3n+1}{5n-3}<b_n<\\frac{3n+4}{5n-3}$이다.\n두 경계의 분모·분자를 $n$으로 나누면 $\\frac{3+1/n}{5-3/n}$, $\\frac{3+4/n}{5-3/n}$이다.\n$1/n\\to0$이므로 두 경계는 모두 $\\frac35$로 간다.\n조임 정리에 의해 $\\lim_{n\\to\\infty}b_n=\\frac35$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-059",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_SQUEEZE",
    "crossConceptKeys": [
      "CC_GENERAL_TERM"
    ],
    "conditionKeys": [
      "COND_UNIVERSAL_INPUTS"
    ],
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
    "content": "모든 $n$에서 $6n-3<na_n<\\sqrt{36n^2+5n}$이면 $\\lim_{n\\to\\infty}((n+2)a_n/(2n+1))$은?",
    "choices": [
      "$1$",
      "$3/2$",
      "$2$",
      "$5/2$",
      "$3$"
    ],
    "answer": "⑤",
    "solution": "주어진 부등식의 각 변을 양수 $n$으로 나누면 $6-\\frac3n<a_n<\\sqrt{36+\\frac5n}$이다.\n$\\frac3n\\to0$이고 $\\sqrt{36+5/n}\\to\\sqrt{36}=6$이다.\n조임 정리에 의해 $a_n\\to6$이다.\n또 $\\frac{n+2}{2n+1}=\\frac{1+2/n}{2+1/n}\\to\\frac12$이다.\n수열의 극한의 성질(곱의 극한)에 의해 $\\lim_{n\\to\\infty}\\frac{(n+2)a_n}{2n+1}=6\\cdot\\frac12=3$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-059",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_SQUEEZE",
    "crossConceptKeys": [],
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
    "content": "$|(a_n+b_n)-17|<2/n$, $|(a_n-b_n)-5|<3/n$일 때 $\\lim_{n\\to\\infty}(b_n)$은?",
    "choices": [
      "$5$",
      "$6$",
      "$7$",
      "$8$",
      "$9$"
    ],
    "answer": "②",
    "solution": "두 식을 각각 $A_n=(a_n+b_n)-17$, $B_n=(a_n-b_n)-5$로 놓으면 $|A_n|<\\frac2n$, $|B_n|<\\frac3n$이다.\n차를 이용하면 $b_n=\\frac{(a_n+b_n)-(a_n-b_n)}2$이다.\n따라서 $b_n-6=\\frac{A_n-B_n}{2}$이다.\n삼각부등식으로 $|b_n-6|\\le\\frac{|A_n|+|B_n|}{2}<\\frac{5}{2n}$이다.\n$\\frac{5}{2n}\\to0$이므로 조임 정리에 의해 $b_n\\to6$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-059",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_SQUEEZE",
    "crossConceptKeys": [],
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
    "content": "$a_n=3-12n$, $S_n=\\sum_{k=1}^n a_k$이고 $S_{n+1}<n^2b_n<S_n$이다. $\\lim_{n\\to\\infty}((nb_n+2)/(-3-n))$은?",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "⑤",
    "solution": "$a_n=3-12n$이므로 $S_n=\\sum_{k=1}^n(3-12k)=3n-12\\cdot\\frac{n(n+1)}2=-6n^2-3n$이다.\n$S_{n+1}=-6(n+1)^2-3(n+1)=-6n^2-15n-9$이다.\n주어진 부등식의 각 변을 양수 $n^2$으로 나누면 $\\frac{S_{n+1}}{n^2}<b_n<\\frac{S_n}{n^2}$이다.\n$\\frac{S_n}{n^2}=-6-\\frac3n\\to-6$이고 $\\frac{S_{n+1}}{n^2}=-6-\\frac{15}{n}-\\frac9{n^2}\\to-6$이다.\n조임 정리에 의해 $b_n\\to-6$이다.\n구하는 식을 $n$으로 나누면 $\\frac{nb_n+2}{-3-n}=\\frac{b_n+2/n}{-1-3/n}$이다.\n분자는 $-6+0=-6$, 분모는 $-1-0=-1$로 간다.\n따라서 극한값은 $\\frac{-6}{-1}=6$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-059",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_SQUEEZE",
    "crossConceptKeys": [
      "CC_SERIES_SUM"
    ],
    "conditionKeys": [
      "COND_FUNCTION_VALUE_CONSTRAINT"
    ],
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
    "content": "모든 $n$에서 $y=2x^2-(4n+1)x+a_n$은 $x$축과 만나고 $y=2x^2-4nx+a_n$은 만나지 않는다. $\\lim_{n\\to\\infty}(a_n/n^2)$은?",
    "choices": [
      "$1/2$",
      "$1$",
      "$3/2$",
      "$2$",
      "$5/2$"
    ],
    "answer": "④",
    "solution": "첫 번째 이차식이 $x$축과 만나므로 판별식이 $0$ 이상이다: $(4n+1)^2-8a_n\\ge0$.\n이를 정리하면 $a_n\\le\\frac{(4n+1)^2}{8}$이다.\n두 번째 이차식이 $x$축과 만나지 않으므로 판별식이 $0$보다 작다: $(4n)^2-8a_n<0$.\n이를 정리하면 $2n^2<a_n$이다.\n따라서 $2<\\frac{a_n}{n^2}\\le\\frac{(4+1/n)^2}{8}$이다.\n$\\frac{(4+1/n)^2}{8}\\to\\frac{16}{8}=2$이므로 오른쪽 경계도 $2$로 간다.\n조임 정리에 의해 $\\lim_{n\\to\\infty}\\frac{a_n}{n^2}=2$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-059",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_SQUEEZE",
    "crossConceptKeys": [
      "CC_GRAPH_X_INTERCEPT_COUNT"
    ],
    "conditionKeys": [
      "COND_UNIVERSAL_INPUTS"
    ],
    "integrationPattern": "SEQUENTIAL",
    "solutionImage": "assets/images/미적분II_012_수열의극한의대소관계1_고2_유형은행1/q11-solution.svg",
    "solutionImageAlt": "n=2, a_n=9는 두 포물선의 x축 교점 유무 조건을 동시에 만족하는 대표 사례다. f는 x축과 두 점에서 만나고 g는 만나지 않는다. 전체 n에 대한 일반 증명은 판별식 부등식으로 한다.",
    "solutionImageCaption": "n=2, a_n=9는 두 포물선의 x축 교점 유무 조건을 동시에 만족하는 대표 사례다. f는 x축과 두 점에서 만나고 g는 만나지 않는다. 전체 n에 대한 일반 증명은 판별식 부등식으로 한다.",
    "solutionImageSize": "full",
    "solutionImageScale": 85
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
    "content": "$\\lim_{n\\to\\infty}(a_n+b_n)=5$이고 $1/(3n^2+1)\\le a_nb_n/(18n^2)\\le1/(3n^2-1)$일 때 $\\lim_{n\\to\\infty}(a_n^2+a_nb_n+b_n^2)$은?",
    "choices": [
      "$13$",
      "$15$",
      "$17$",
      "$19$",
      "$21$"
    ],
    "answer": "④",
    "solution": "주어진 부등식의 각 변에 양수 $18n^2$을 곱하면 $\\frac{18n^2}{3n^2+1}\\le a_nb_n\\le\\frac{18n^2}{3n^2-1}$이다.\n두 경계의 분모·분자를 $n^2$으로 나누면 $\\frac{18}{3+1/n^2}$, $\\frac{18}{3-1/n^2}$이다.\n$1/n^2\\to0$이므로 두 경계는 모두 $\\frac{18}{3}=6$으로 간다.\n조임 정리에 의해 $a_nb_n\\to6$이다.\n$\\lim_{n\\to\\infty}(a_n+b_n)=5$이므로 $(a_n+b_n)^2\\to25$이다.\n$a_n^2+a_nb_n+b_n^2=(a_n+b_n)^2-a_nb_n$이다.\n따라서 극한값은 $25-6=19$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-059",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_SQUEEZE",
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
    "content": "다음 중 옳지 않은 것은?",
    "choices": [
      "$3n-1<na_n<\\sqrt{9n^2+4n}$이면 $(n^2+n)a_n/(2n^2+1)\\to1$이다.",
      "$\\lim_{n\\to\\infty}(\\sin(n\\theta)/n)=0$",
      "$\\lim_{n\\to\\infty}((4a_n+2)/(3a_n-1))=2$이면 $a_n\\to2$이다.",
      "$na_n\\to3$이면 $(2n+1)a_n\\to6$이다.",
      "$a_n\\to\\infty$, $b_n-a_n\\to3$이면 $b_n^2/a_n-a_n^2/b_n\\to9$이다."
    ],
    "answer": "①",
    "solution": "① 주어진 부등식의 각 변을 $n$으로 나누면 $3-\\frac1n<a_n<\\sqrt{9+\\frac4n}$이고 양쪽 경계가 $3$으로 가므로 $a_n\\to3$이다.\n따라서 $\\frac{(n^2+n)a_n}{2n^2+1}=\\frac{(1+1/n)a_n}{2+1/n^2}\\to\\frac{1\\cdot3}{2}=\\frac32$이므로 ①의 주장 $1$은 거짓이다.\n② $|\\sin(n\\theta)|\\le1$이므로 $|\\sin(n\\theta)/n|\\le1/n\\to0$이고, 조임 정리에 의해 극한은 $0$이다.\n③ $r_n=\\frac{4a_n+2}{3a_n-1}$이라 하면 $r_n\\to2$이고, 식을 $a_n$에 대해 풀면 $a_n=\\frac{r_n+2}{3r_n-4}$이다.\n$r_n\\to2$이므로 $a_n\\to\\frac{2+2}{6-4}=2$이다.\n④ $na_n\\to3$이면 $a_n\\to0$이므로 $(2n+1)a_n=2na_n+a_n\\to2\\cdot3+0=6$이다.\n⑤ $b_n-a_n\\to3$이므로 $b_n=a_n+c_n$, $c_n\\to3$으로 놓으면 $\\frac{b_n^2}{a_n}=a_n+2c_n+\\frac{c_n^2}{a_n}$이고 $\\frac{a_n^2}{b_n}=a_n-c_n+\\frac{c_n^2}{a_n+c_n}$이다.\n두 식의 차는 $3c_n+c_n^2\\left(\\frac1{a_n}-\\frac1{a_n+c_n}\\right)\\to3\\cdot3+0=9$이다.\n이상에서 옳지 않은 것은 ①이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-059",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_SQUEEZE",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_EXTREMUM"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  }
];
