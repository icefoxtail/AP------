window.examTitle = "미적분II_018_내접원에관한수열의극한의활용_고2_유형은행1";

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
    "content": "$O=(0,0),P_n=(3n,4),Q_n=(3n,0)$을 꼭짓점으로 하는 삼각형의 내심의 $y$좌표를 $h_n$이라 하자. $\\lim_{n\\to\\infty}(h_n)$은? [그림: 세 점을 이어 직각삼각형을 그리고 세 변에 모두 접하는 내접원을 표시한다.]",
    "choices": [
      "$1/2$",
      "$1$",
      "$3/2$",
      "$7/4$",
      "$2$"
    ],
    "answer": "⑤",
    "solution": "직각삼각형 $OQ_nP_n$에서 $Q_n$이 직각이므로 $Q_nO=3n$, $Q_nP_n=4$, 빗변 $OP_n=\\sqrt{9n^2+16}$이다.\n삼각형의 넓이는 $\\Delta_n=\\frac12\\cdot3n\\cdot4=6n$이다.\n내접원의 반지름을 $r_n$이라 하면 $\\Delta_n=r_ns_n$ (넓이와 내접원의 반지름의 관계)에서 $r_n=\\frac{\\Delta_n}{s_n}$이고, 반둘레는 $s_n=\\frac{3n+4+\\sqrt{9n^2+16}}2$이다.\n따라서 $r_n=\\frac{6n}{(3n+4+\\sqrt{9n^2+16})/2}=\\frac{12n}{3n+4+\\sqrt{9n^2+16}}$이다.\n분모를 유리화하면 $r_n=\\frac{12n(3n+4-\\sqrt{9n^2+16})}{(3n+4)^2-(9n^2+16)}=\\frac{12n(3n+4-\\sqrt{9n^2+16})}{24n}=\\frac{3n+4-\\sqrt{9n^2+16}}2$이다.\n내심의 $y$좌표는 밑변 $Q_nO$(직선 $y=0$)까지의 거리와 같으므로 $h_n=r_n$이다.\n분자를 다시 유리화하여 $h_n=\\frac{12n}{3n+4+\\sqrt{9n^2+16}}$로 정리하고 분모와 분자를 $n$으로 나누면 $\\lim_{n\\to\\infty}h_n=\\lim_{n\\to\\infty}\\frac{12}{3+\\frac4n+\\sqrt{9+\\frac{16}{n^2}}}=\\frac{12}{3+0+3}=2$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
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
    "content": "$O=(0,0),A_n=(2n,3),B_n=(2n,0)$인 삼각형의 내심을 $C_n$이라 하자. 삼각형 $OA_nC_n$의 넓이가 $S_n$일 때 $\\lim_{n\\to\\infty}(S_n/n)$은? [그림: 세 점을 이어 내접원과 중심 $C_n$을 그리고, $OA_nC_n$을 표시한다.]",
    "choices": [
      "$1/2$",
      "$3/4$",
      "$1$",
      "$3/2$",
      "$2$"
    ],
    "answer": "④",
    "solution": "직각삼각형 $OB_nA_n$에서 $B_n$이 직각이므로 $OB_n=2n$, $B_nA_n=3$, 빗변 $OA_n=\\sqrt{4n^2+9}$이다.\n삼각형의 넓이는 $\\Delta_n=\\frac12\\cdot2n\\cdot3=3n$이다.\n내접원의 반지름을 $r_n$이라 하면 $\\Delta_n=r_ns_n$ (넓이와 내접원의 반지름의 관계)이고, 반둘레는 $s_n=\\frac{2n+3+\\sqrt{4n^2+9}}2$이다.\n따라서 $r_n=\\frac{3n}{(2n+3+\\sqrt{4n^2+9})/2}=\\frac{6n}{2n+3+\\sqrt{4n^2+9}}$이다.\n분모와 분자를 $n$으로 나누어 극한을 취하면 $\\lim_{n\\to\\infty}r_n=\\frac6{2+0+\\sqrt4}=\\frac32$이다.\n내심 $C_n=(2n-r_n,r_n)$에서 빗변 $OA_n$까지의 거리는 내접원의 반지름 $r_n$이다.\n$OA_n$을 밑변으로 하면 $S_n=\\frac12\\cdot OA_n\\cdot r_n=\\frac12r_n\\sqrt{4n^2+9}$이다.\n따라서 $\\frac{S_n}{n}=\\frac12r_n\\sqrt{4+\\frac9{n^2}}\\to\\frac12\\cdot\\frac32\\cdot2=\\frac32$이다.\n주의: 구하는 값은 $S_n$이 아니라 $S_n/n$이므로 빗변 길이를 $n$으로 나눈 극한 $\\sqrt{4+\\frac9{n^2}}\\to2$를 반드시 포함해야 한다.\n따라서 정답은 ④이다.",
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
  }
];
