window.examTitle = "미적분II_029_등비수열의수렴조건2_고2_유형은행1";

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
    "content": "수열 $\\{(x-5)(x-3)^{n-1}\\}$이 수렴하도록 하는 정수 $x$의 개수는?",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "③",
    "solution": "수열의 첫째항이 $0$이 되는 경우부터 확인한다(수열의 수렴 정의).\n$x=5$이면 모든 $n$에 대하여 $(x-5)(x-3)^{n-1}=0$이므로 수열은 $0$으로 수렴한다.\n$x\\ne5$이면 $0$이 아닌 상수 $x-5$를 곱한 등비수열이므로 $\\{(x-3)^{n-1}\\}$이 수렴해야 한다.\n등비수열의 극한에서 공비 $x-3$이 $-1<x-3\\le1$을 만족해야 한다.\n각 변에 $3$을 더하면 $2<x\\le4$이다.\n이 범위의 정수는 $x=3,4$이다.\n$x=3$이면 첫째항만 $-2$이고 그 뒤는 모두 $0$이므로 수렴한다.\n$x=4$이면 공비가 $1$인 등비수열이므로 수렴한다.\n주의: $x=5$이면 공비의 범위를 따지기 전에 모든 항이 $0$이 됨을 놓치지 않는다.\n따라서 조건을 만족하는 정수는 $x=3,4,5$의 $3$개이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-060",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_GEOMETRIC_RATIO",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_INTEGER"
    ],
    "integrationPattern": "CASE_BRANCH"
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
    "content": "수열 $\\{(x+4)(x^2-6x+8)^{n-1}\\}$이 수렴하도록 하는 모든 정수 $x$의 합은?",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "①",
    "solution": "첫째항이 $0$이 되는 경우부터 확인한다(수열의 수렴 정의).\n$x=-4$이면 모든 $n$에 대하여 $(x+4)(x^2-6x+8)^{n-1}=0$이므로 수열은 $0$으로 수렴한다.\n$x\\ne-4$이면 $0$이 아닌 상수 $x+4$를 곱한 등비수열이므로 공비 $x^2-6x+8$이 수렴 조건을 만족해야 한다.\n등비수열의 극한에서 $-1<x^2-6x+8\\le1$이 필요하다.\n왼쪽 부등식은 $x^2-6x+9>0$, 즉 $(x-3)^2>0$이므로 $x\\ne3$이다.\n오른쪽 부등식은 $x^2-6x+7\\le0$이고, 근은 $x=3\\pm\\sqrt2$이므로 $3-\\sqrt2\\le x\\le3+\\sqrt2$이다.\n이 범위의 정수는 $2,3,4$이고 $x\\ne3$이므로 $x=2,4$이다.\n주의: $x=-4$이면 공비의 조건과 무관하게 모든 항이 $0$이므로 반드시 포함한다.\n따라서 가능한 정수는 $x=-4,2,4$이고 그 합은 $-4+2+4=2$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-060",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_GEOMETRIC_RATIO",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_INTEGER"
    ],
    "integrationPattern": "CASE_BRANCH"
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
    "content": "$\\{r^n\\}$이 수렴할 때 반드시 수렴하는 수열을 모두 고르면? $\\text{ㄱ. }\\{((r+1)/2)^n\\}$, $\\text{ㄴ. }\\{((r-2)/4)^n\\}$, $\\text{ㄷ. }\\{(r-1)^n\\}$, $\\text{ㄹ. }\\{(2r)^n\\}$",
    "choices": [
      "ㄱ",
      "ㄱ, ㄴ",
      "ㄴ, ㄷ",
      "ㄷ, ㄹ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "②",
    "solution": "$\\{r^n\\}$이 수렴하므로 등비수열의 극한에서 $-1<r\\le1$이다.\n(i) ㄱ: $s=\\frac{r+1}{2}$라 하면 $r\\in(-1,1]$에서 $0<s\\le1$이다.\n따라서 $-1<s\\le1$이므로 $\\{s^n\\}$은 수렴한다.\n(ii) ㄴ: $s=\\frac{r-2}{4}$라 하면 $r\\in(-1,1]$에서 $-\\frac34<s\\le-\\frac14$이다.\n이때 $-1<s<1$이므로 $\\{s^n\\}$은 수렴한다.\n(iii) ㄷ: $r=0$이면 $\\{r^n\\}$은 수렴하지만 $(r-1)^n=(-1)^n$은 진동하여 발산한다.\n(iv) ㄹ: $r=1$이면 $\\{r^n\\}$은 수렴하지만 $(2r)^n=2^n$은 양의 무한대로 발산한다.\n주의: $r=0$과 $r=1$처럼 주어진 수열만 보고 다른 수열의 수렴을 단정하면 안 된다.\n따라서 반드시 수렴하는 것은 ㄱ, ㄴ이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-060",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_GEOMETRIC_RATIO",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "CASE_BRANCH"
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
    "content": "$\\{r^{4n}\\}$이 수렴할 때 반드시 수렴하는 수열을 모두 고르면? $\\text{ㄱ. }\\{((r+1)/2)^n\\}$, $\\text{ㄴ. }\\{((r-1)/4)^n\\}$, $\\text{ㄷ. }\\{((3r-1)/4)^n\\}$, $\\text{ㄹ. }\\{((3r+2)/4)^n\\}$",
    "choices": [
      "ㄴ",
      "ㄱ, ㄴ",
      "ㄱ, ㄷ",
      "ㄴ, ㄹ",
      "ㄱ, ㄴ, ㄹ"
    ],
    "answer": "②",
    "solution": "$\\{r^{4n}\\}=\\{(r^4)^n\\}$이 수렴하므로 등비수열의 극한에서 $-1<r^4\\le1$이다.\n$r^4\\ge0$이므로 $0\\le r^4\\le1$, 즉 $-1\\le r\\le1$이다.\n(i) ㄱ: $s=\\frac{r+1}{2}$라 하면 $r\\in[-1,1]$에서 $0\\le s\\le1$이다.\n따라서 $\\{s^n\\}$은 수렴한다.\n(ii) ㄴ: $s=\\frac{r-1}{4}$라 하면 $r\\in[-1,1]$에서 $-\\frac12\\le s\\le0$이다.\n따라서 $-1<s\\le1$이므로 $\\{s^n\\}$은 수렴한다.\n(iii) ㄷ: $r=-1$이면 $\\{r^{4n}\\}=\\{1\\}$은 수렴하지만 $\\left(\\frac{3r-1}{4}\\right)^n=(-1)^n$은 발산한다.\n(iv) ㄹ: $r=1$이면 $\\{r^{4n}\\}=\\{1\\}$은 수렴하지만 $\\left(\\frac{3r+2}{4}\\right)^n=\\left(\\frac54\\right)^n$은 발산한다.\n주의: $r=-1,1$에서 다른 밑이 $-1$ 또는 $1$보다 커질 수 있음을 확인한다.\n따라서 반드시 수렴하는 것은 ㄱ, ㄴ이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-060",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_GEOMETRIC_RATIO",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "CASE_BRANCH"
  }
];
