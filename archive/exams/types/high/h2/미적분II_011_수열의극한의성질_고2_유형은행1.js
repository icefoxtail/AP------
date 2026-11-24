window.examTitle = "미적분II_011_수열의극한의성질_고2_유형은행1";

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
    "content": "$a_n\\to\\infty$이고 $\\lim_{n\\to\\infty}(a_n-b_n)=-2$일 때 $\\lim_{n\\to\\infty}((2a_n+b_n)/(b_n-2a_n))$은?",
    "choices": [
      "$-3$",
      "$-2$",
      "$-1$",
      "$0$",
      "$1$"
    ],
    "answer": "①",
    "solution": "$a_n-b_n\\to-2$이므로 $b_n-a_n=-(a_n-b_n)\\to2$이다. 즉 $b_n=a_n+2+o(1)$이고 $b_n/a_n=1+2/a_n+o(1/a_n)\\to1$이다.\n분자와 분모를 $a_n$으로 나누면 $$\\frac{2a_n+b_n}{b_n-2a_n}=\\frac{2+b_n/a_n}{b_n/a_n-2}.$$\n$b_n/a_n\\to1$을 대입하면 $$\\frac{2+1}{1-2}=-3$$으로 수렴한다.\n주의: $b_n-a_n\\to2$에서 $b_n/a_n\\to1$임을 먼저 확인해야 한다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
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
    "content": "$a_n\\to\\infty$, $\\lim_{n\\to\\infty}(a_n+3b_n)=4$일 때 $\\lim_{n\\to\\infty}((2a_n-b_n)/(a_n+2b_n))$은?",
    "choices": [
      "$4$",
      "$5$",
      "$6$",
      "$7$",
      "$8$"
    ],
    "answer": "④",
    "solution": "$a_n\\to\\infty$이고 $a_n+3b_n\\to4$이므로, 양변을 $a_n$으로 나누면 $1+3b_n/a_n\\to0$이다.\n따라서 $b_n/a_n\\to-1/3$이다.\n구하는 식의 분자·분모를 $a_n$으로 나누면 $$\\frac{2a_n-b_n}{a_n+2b_n}=\\frac{2-b_n/a_n}{1+2b_n/a_n}.$$\n극한값을 대입하면 $$\\frac{2-(-1/3)}{1+2(-1/3)}=\\frac{7/3}{1/3}=7.$$\n주의: $a_n+3b_n\\to4$에서 $b_n/a_n\\to0$이 아니라 $-1/3$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
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
    "content": "$a_n\\to\\infty$, $\\lim_{n\\to\\infty}(b_n-a_n)=4$일 때 $\\lim_{n\\to\\infty}(b_n^3/a_n^2-a_n^3/b_n^2)$은?",
    "choices": [
      "$8$",
      "$12$",
      "$16$",
      "$20$",
      "$24$"
    ],
    "answer": "④",
    "solution": "$b_n-a_n=d_n$이라 하면 $d_n\\to4$이고 $b_n=a_n+d_n$이다.\n첫째 항을 전개하면 $$\\frac{b_n^3}{a_n^2}=\\frac{(a_n+d_n)^3}{a_n^2}=a_n+3d_n+\\frac{3d_n^2}{a_n}+\\frac{d_n^3}{a_n^2}.$$\n둘째 항은 $$\\frac{a_n^3}{b_n^2}=\\frac{a_n^3}{(a_n+d_n)^2}=a_n\\left(1+\\frac{d_n}{a_n}\\right)^{-2}.$$\n일반화 이항정리로 전개하면 $$a_n\\left(1-\\frac{2d_n}{a_n}+\\frac{3d_n^2}{a_n^2}-\\cdots\\right)=a_n-2d_n+\\frac{3d_n^2}{a_n}-\\cdots.$$\n두 식을 빼면 $$\\frac{b_n^3}{a_n^2}-\\frac{a_n^3}{b_n^2}=(a_n+3d_n)-(a_n-2d_n)+o(1)=5d_n+o(1).$$\n$d_n\\to4$이므로 극한은 $5\\cdot4=20$이다.\n주의: $d_n$이 $0$으로 가는 것이 아니라 $4$로 가므로 $5d_n$의 극한은 $0$이 아니다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-058",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_ALGEBRAIC",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
