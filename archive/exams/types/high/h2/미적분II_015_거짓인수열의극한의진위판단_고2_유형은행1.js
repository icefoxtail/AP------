window.examTitle = "미적분II_015_거짓인수열의극한의진위판단_고2_유형은행1";

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
    "content": "옳은 명제를 모두 고르시오.\nㄱ. $a_n\\to\\infty$, $b_n\\to0$이면 $a_nb_n\\to0$이다.\nㄴ. $a_n,b_n\\to\\infty$이면 $b_n/a_n\\to2$이다.\nㄷ. $a_n\\to\\infty$, $b_n-2a_n\\to7$이면 $b_n/a_n\\to2$이다.",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄷ",
      "ㄱ, ㄷ",
      "ㄴ, ㄷ"
    ],
    "answer": "③",
    "solution": "ㄷ의 참·거짓 판정: $b_n-2a_n\\to7$에서 $$\\frac{b_n}{a_n}=2+\\frac{b_n-2a_n}{a_n}$$로 변형한다.\n$a_n\\to\\infty$이므로 $\\frac{1}{a_n}\\to0$이고, 유한한 값에 $0$을 곱하는 극한 성질에서 $\\frac{b_n-2a_n}{a_n}\\to0$이다.\n따라서 $\\frac{b_n}{a_n}\\to2+0=2$이므로 ㄷ은 참이다.\nㄱ의 반례: $a_n=n$, $b_n=\\frac1n$이면 $a_nb_n=1\\to1\\ne0$이다.\nㄴ의 반례: $a_n=n$, $b_n=n$이면 $\\frac{b_n}{a_n}=1\\to1\\ne2$이다.\n참인 명제는 ㄷ뿐이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-057",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_CONVERGENCE_JUDGMENT",
    "crossConceptKeys": [],
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
    "content": "옳은 명제를 모두 고르시오.\nㄱ. $a_n\\to4$, $a_n-b_n\\to2$이면 $b_n\\to2$이다.\nㄴ. 두 수열이 수렴하고 항상 $a_n<b_n$이면 두 극한값의 차 $\\lim b_n-\\lim a_n$은 음이 아니다.\nㄷ. $a_nb_n\\to0$이면 두 수열 중 적어도 하나는 0에 수렴한다.",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄷ",
      "ㄱ, ㄷ",
      "ㄱ, ㄴ"
    ],
    "answer": "⑤",
    "solution": "ㄱ의 계산: $b_n=a_n-(a_n-b_n)$이므로 극한의 차 성질에서 $\\lim b_n=4-2=2$이다. 따라서 ㄱ은 참이다.\nㄴ의 판정: 모든 $n$에서 $b_n-a_n>0$이고 두 수열이 수렴하므로 $\\lim(b_n-a_n)=\\lim b_n-\\lim a_n\\ge0$이다. 따라서 ㄴ은 참이다.\nㄷ의 반례: 짝수 $n$에서 $(a_n,b_n)=(2,0)$, 홀수 $n$에서 $(a_n,b_n)=(0,3)$이라 하면 모든 $n$에서 $a_nb_n=0\\to0$이다.\n그런데 $a_n$은 $2,0,2,0,\\dots$, $b_n$은 $0,3,0,3,\\dots$로 각각 수렴하지 않는다. 따라서 ㄷ은 거짓이다.\n참인 명제는 ㄱ, ㄴ이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-057",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_CONVERGENCE_JUDGMENT",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_INEQUALITY_CONSTRAINT"
    ],
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
    "content": "옳은 명제를 모두 고르시오.\nㄱ. 항상 $a_n<b_n$이고 $a_n\\to-\\infty$이면 $b_n\\to-\\infty$이다.\nㄴ. 수렴하는 두 수열에 대해 항상 $2a_n<b_n$이면 $2\\lim a_n\\le\\lim b_n$이다.\nㄷ. $a_n-b_n\\to0$이면 두 수열은 모두 수렴한다.",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄷ",
      "ㄱ, ㄴ",
      "ㄴ, ㄷ"
    ],
    "answer": "②",
    "solution": "ㄱ의 반례: $a_n=-n$, $b_n=0$이면 모든 $n$에서 $a_n<b_n$이고 $a_n\\to-\\infty$이지만 $b_n\\to0$이다. 따라서 ㄱ은 거짓이다.\nㄴ의 판정: 모든 $n$에서 $b_n-2a_n>0$이고 두 수열이 수렴하므로 $\\lim(b_n-2a_n)=\\lim b_n-2\\lim a_n\\ge0$이다.\n이를 정리하면 $2\\lim a_n\\le\\lim b_n$이므로 ㄴ은 참이다.\nㄷ의 반례: $a_n=n$, $b_n=n+\\frac1n$이면 $a_n-b_n=-\\frac1n\\to0$이다.\n그런데 $a_n\\to\\infty$, $b_n\\to\\infty$로 두 수열 모두 수렴하지 않는다. 따라서 ㄷ은 거짓이다.\n참인 명제는 ㄴ뿐이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-057",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_CONVERGENCE_JUDGMENT",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_INEQUALITY_CONSTRAINT"
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
    "content": "옳은 명제를 모두 고르시오.\nㄱ. $a_n\\to\\infty$, $b_n\\to0$이면 $a_nb_n\\to1$이다.\nㄴ. $a_n\\to\\infty$, $3a_n-b_n\\to-4$이면 $b_n/a_n\\to3$이다.\nㄷ. $a_n^2\\to9$이면 $a_n$은 수렴한다.\nㄹ. $a_n$이 수렴하고 $a_n-b_n\\to0$이면 $b_n$도 같은 값에 수렴한다.",
    "choices": [
      "ㄱ, ㄴ",
      "ㄱ, ㄷ",
      "ㄴ, ㄹ",
      "ㄷ, ㄹ",
      "ㄴ, ㄷ, ㄹ"
    ],
    "answer": "③",
    "solution": "ㄱ의 반례: $a_n=n$, $b_n=\\frac2n$이면 $a_n\\to\\infty$, $b_n\\to0$이지만 $a_nb_n=2\\to2\\ne1$이다. 따라서 ㄱ은 거짓이다.\nㄴ의 계산: $b_n-3a_n=-(3a_n-b_n)\\to4$이고 $$\\frac{b_n}{a_n}=3+\\frac{b_n-3a_n}{a_n}$$로 변형한다.\n$a_n\\to\\infty$이므로 $\\frac{b_n-3a_n}{a_n}\\to0$이고, 따라서 $\\frac{b_n}{a_n}\\to3+0=3$이다. ㄴ은 참이다.\nㄷ의 반례: $a_n=3(-1)^n$이면 $a_n^2=9(-1)^{2n}=9\\to9$이지만 $a_n$은 $3,-3,3,-3,\\dots$로 수렴하지 않는다. 따라서 ㄷ은 거짓이다.\nㄹ의 계산: $b_n=a_n-(a_n-b_n)$이므로 $a_n\\to L$, $a_n-b_n\\to0$일 때 $b_n\\to L-0=L$이다. 따라서 ㄹ은 참이다.\n참인 명제는 ㄴ, ㄹ이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-057",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_CONVERGENCE_JUDGMENT",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "CASE_BRANCH"
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
    "content": "옳은 명제를 모두 고르시오.\nㄱ. $|a_n|\\to0$이면 $a_n\\to0$이다.\nㄴ. $a_n\\to3$, $a_n-b_n\\to1$이면 $b_n\\to2$이다.\nㄷ. $a_nb_n\\to5$이고 $a_n$이 수렴하면 $b_n$도 수렴한다.\nㄹ. 두 수열이 모두 발산하면 그 합도 발산한다.",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄷ",
      "ㄱ, ㄴ",
      "ㄷ, ㄹ"
    ],
    "answer": "④",
    "solution": "ㄱ의 판정: $-|a_n|\\le a_n\\le|a_n|$이고 $|a_n|\\to0$이므로, 샌드위치 정리로 $a_n\\to0$이다. 따라서 ㄱ은 참이다.\nㄴ의 계산: $b_n=a_n-(a_n-b_n)$이므로 극한의 차 성질에서 $\\lim b_n=3-1=2$이다. 따라서 ㄴ은 참이다.\nㄷ의 반례: $a_n=\\frac1n$, $b_n=5n$이면 $a_nb_n=5\\to5$이고 $a_n\\to0$으로 수렴하지만 $b_n\\to\\infty$로 발산한다. 따라서 ㄷ은 거짓이다.\nㄹ의 반례: $a_n=n$, $b_n=2-n$이면 두 수열은 각각 $\\infty$, $-\\infty$로 발산하지만 $a_n+b_n=2\\to2$로 수렴한다. 따라서 ㄹ은 거짓이다.\n참인 명제는 ㄱ, ㄴ이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-057",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_CONVERGENCE_JUDGMENT",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "CASE_BRANCH"
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
    "content": "옳은 명제를 모두 고르시오.\nㄱ. $a_n\\ne0$이고 $b_n/a_n$이 수렴하며 $a_n\\to0$이면 $b_n\\to0$이다.\nㄴ. $a_n\\le c_n\\le b_n$, $a_n\\to1$, $b_n\\to3$이면 $c_n$은 수렴한다.\nㄷ. $a_n<b_n$이고 둘 다 수렴하면 $\\lim a_n\\le\\lim b_n$이다.\nㄹ. $0<a_n<b_n$이고 $b_n\\to2$이면 $a_n$은 수렴한다.",
    "choices": [
      "ㄱ, ㄴ",
      "ㄱ, ㄹ",
      "ㄱ, ㄷ",
      "ㄴ, ㄷ",
      "ㄷ, ㄹ"
    ],
    "answer": "③",
    "solution": "ㄱ의 계산: $b_n=a_n\\cdot\\frac{b_n}{a_n}$이고 $a_n\\to0$, $\\frac{b_n}{a_n}\\to L$(유한값)이므로 곱의 극한 성질에서 $b_n\\to0\\cdot L=0$이다. 따라서 ㄱ은 참이다.\nㄴ의 반례: $a_n=1$, $b_n=3$, $c_n=2+(-1)^n$이면 $1\\le c_n\\le3$이다.\n그런데 $c_n$은 $3,1,3,1,\\dots$로 수렴하지 않는다. 따라서 ㄴ은 거짓이다.\nㄷ의 판정: $b_n-a_n>0$이고 두 수열이 수렴하므로 $\\lim(b_n-a_n)=\\lim b_n-\\lim a_n\\ge0$이다. 따라서 $\\lim a_n\\le\\lim b_n$이고 ㄷ은 참이다.\nㄹ의 반례: $b_n=2$, $a_n=1+\\frac{(-1)^n}{2}$이면 $0<a_n<b_n$이고 $b_n\\to2$이지만 $a_n$은 $\\frac12,\\frac32,\\frac12,\\frac32,\\dots$로 수렴하지 않는다. 따라서 ㄹ은 거짓이다.\n참인 명제는 ㄱ, ㄷ이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-057",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_CONVERGENCE_JUDGMENT",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_NONZERO",
      "COND_POSITIVE"
    ],
    "integrationPattern": "NONE"
  }
];
