window.examTitle = "미적분II_026_등비수열{rⁿ}의수렴과발산_고2_유형은행1";

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
    "content": "수열 $\\left\\{\\frac{2-r^{2n}}{2+r^n}\\right\\}$에 대한 설명 중 옳지 않은 것은? (단, 분모가 항상 $0$이 아닌 $r$를 고려한다.)",
    "choices": [
      "$-1<r<0$이면 $1$에 수렴한다.",
      "$0\\le r<1$이면 $1$에 수렴한다.",
      "$r=1$이면 $1/3$에 수렴한다.",
      "$r=-1$이면 발산한다.",
      "$r>1$이면 양의 무한대로 발산한다."
    ],
    "answer": "⑤",
    "solution": "$|r|<1$이면 등비수열의 극한 $r^n\\to0$, $r^{2n}\\to0$이므로 $$\\lim_{n\\to\\infty}\\frac{2-r^{2n}}{2+r^n}=\\frac{2-0}{2+0}=1.$$\n따라서 $-1<r<0$과 $0\\le r<1$에서 모두 $1$에 수렴한다.\n$r=1$이면 각 항이 $\\frac{2-1}{2+1}=\\frac13$이므로 $\\frac13$에 수렴한다.\n$r=-1$이면 $r^{2n}=1$, $r^n=(-1)^n$이므로 홀수항은 $\\frac{1}{2-1}=1$, 짝수항은 $\\frac{1}{2+1}=\\frac13$이 되어 진동하며 발산한다.\n$r>1$이면 분모·분자를 $r^n$으로 나누어 $$\\frac{2-r^{2n}}{2+r^n}=\\frac{2r^{-n}-r^n}{2r^{-n}+1}\\to -\\infty$$이므로 양의 무한대가 아니라 음의 무한대로 발산한다.\n주의: $r>1$에서 최고차항의 부호가 음수임을 놓치지 않는다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-060",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_GEOMETRIC_RATIO",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_NONZERO"
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
    "content": "$f(x)=\\lim_{n\\to\\infty}\\frac{x^{2n+1}-2}{x^{2n}+2}$에 대해 옳은 것을 모두 고르면? $\\text{ㄱ. }|x|>1\\text{이면 }f(x)=0$, $\\text{ㄴ. }|x|<1\\text{이면 }f(x)=-1$, $\\text{ㄷ. }f(1)=0$",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄷ",
      "ㄱ, ㄴ",
      "ㄴ, ㄷ"
    ],
    "answer": "②",
    "solution": "$|x|>1$이면 $x^{2n}\\to\\infty$이므로 분모·분자를 $x^{2n}$으로 나누면 $$f(x)=\\lim_{n\\to\\infty}\\frac{x-2x^{-2n}}{1+2x^{-2n}}=x.$$ 따라서 ㄱ의 $f(x)=0$은 거짓이다.\n$|x|<1$이면 등비수열의 극한 $x^{2n}\\to0$, $x^{2n+1}\\to0$이므로 $$f(x)=\\frac{0-2}{0+2}=-1.$$ 따라서 ㄴ은 참이다.\n$x=1$이면 $x^{2n}=1$이므로 $$f(1)=\\frac{1-2}{1+2}=-\\frac13.$$ 따라서 ㄷ의 $f(1)=0$은 거짓이다.\n참인 것은 ㄴ뿐이다.\n따라서 정답은 ②이다.",
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
    "content": "$f(x)=\\lim_{n\\to\\infty}\\frac{x^{2n+1}+12}{x^{2n}+4}$일 때 $f(f(-1/2))$는?",
    "choices": [
      "$0$",
      "$1$",
      "$2$",
      "$3$",
      "$4$"
    ],
    "answer": "④",
    "solution": "$\\left|-\\frac12\\right|<1$이므로 등비수열의 극한에서 $\\left(-\\frac12\\right)^{2n}\\to0$, $\\left(-\\frac12\\right)^{2n+1}\\to0$이다.\n따라서 $$f\\left(-\\frac12\\right)=\\frac{0+12}{0+4}=3.$$\n$|3|>1$이므로 분모·분자를 $3^{2n}$으로 나누면 $$f(3)=\\lim_{n\\to\\infty}\\frac{3+12\\cdot3^{-2n}}{1+4\\cdot3^{-2n}}=3.$$\n그러므로 $$f\\left(f\\left(-\\frac12\\right)\\right)=f(3)=3.$$\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-060",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_GEOMETRIC_RATIO",
    "crossConceptKeys": [
      "CC_FUNCTION_COMPOSITION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "양수 $r$에 대해 $f(r)=\\lim_{n\\to\\infty}\\frac{r^{n+2}+2}{r^n+2r}$라 할 때 $f(1/4)+f(1/2)+f(1)+f(3)$은?",
    "choices": [
      "$12$",
      "$14$",
      "$16$",
      "$18$",
      "$20$"
    ],
    "answer": "③",
    "solution": "$0<r<1$이면 등비수열의 극한에서 $r^n\\to0$, $r^{n+2}=r^2r^n\\to0$이므로 $$f(r)=\\frac{0+2}{0+2r}=\\frac1r.$$\n$r=1$이면 $$f(1)=\\frac{1+2}{1+2}=1.$$\n$r>1$이면 분모·분자를 $r^n$으로 나누어 $$f(r)=\\lim_{n\\to\\infty}\\frac{r^2+2r^{-n}}{1+2r^{1-n}}=r^2.$$\n따라서 $$f\\left(\\frac14\\right)=4,\\quad f\\left(\\frac12\\right)=2,\\quad f(1)=1,\\quad f(3)=9.$$\n합은 $$4+2+1+9=16.$$\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-060",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_GEOMETRIC_RATIO",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
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
    "content": "$f(x)=\\lim_{n\\to\\infty}\\frac{x^{2n+1}+4x+2}{x^{2n}+1}$일 때 $f(-3)+f(1/4)+f(1)$은?",
    "choices": [
      "$\\frac12$",
      "$\\frac32$",
      "$\\frac52$",
      "$\\frac72$",
      "$\\frac92$"
    ],
    "answer": "④",
    "solution": "$x=-3$은 $|-3|>1$이므로 분모·분자를 $x^{2n}$으로 나누면 $$f(-3)=\\lim_{n\\to\\infty}\\frac{-3+(4\\cdot(-3)+2)(-3)^{-2n}}{1+(-3)^{-2n}}=-3.$$\n$x=\\frac14$은 $\\left|\\frac14\\right|<1$이므로 $x^{2n}\\to0$, $x^{2n+1}\\to0$이고 $$f\\left(\\frac14\\right)=\\frac{0+4\\cdot\\frac14+2}{0+1}=3.$$\n$x=1$이면 $x^{2n}=1$이므로 $$f(1)=\\frac{1+4+2}{1+1}=\\frac72.$$\n따라서 $$f(-3)+f\\left(\\frac14\\right)+f(1)=-3+3+\\frac72=\\frac72.$$\n따라서 정답은 ④이다.",
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
    "content": "$f(x)=\\lim_{n\\to\\infty}\\frac{x^{n+1}-2}{x^n+2}$라 할 때 $\\sum_{k=1}^8 f(k)$는?",
    "choices": [
      "$\\frac{89}3$",
      "$\\frac{92}3$",
      "$\\frac{95}3$",
      "$\\frac{101}3$",
      "$\\frac{104}3$"
    ],
    "answer": "⑤",
    "solution": "$x=1$이면 $1^n=1$이므로 $$f(1)=\\frac{1-2}{1+2}=-\\frac13.$$\n정수 $k\\ge2$이면 $|k|>1$이므로 분모·분자를 $k^n$으로 나누어 $$f(k)=\\lim_{n\\to\\infty}\\frac{k-2k^{-n}}{1+2k^{-n}}=k.$$\n따라서 $$\\sum_{k=1}^8 f(k)=-\\frac13+\\sum_{k=2}^8 k.$$\n$\\sum_{k=2}^8 k=2+3+\\cdots+8=\\frac{7(2+8)}2=35$이다.\n그러므로 $$\\sum_{k=1}^8 f(k)=-\\frac13+35=\\frac{-1+105}{3}=\\frac{104}{3}.$$\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-060",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_GEOMETRIC_RATIO",
    "crossConceptKeys": [
      "CC_SERIES_SUM"
    ],
    "conditionKeys": [],
    "integrationPattern": "CASE_BRANCH"
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
    "content": "양수 $r$에 대해 $f(r)=\\lim_{n\\to\\infty}\\frac{r^{n+1}-2\\cdot4^n}{r^n+4^n}$일 때 $\\sum_{k=1}^8 f(k)$는?",
    "choices": [
      "$19$",
      "$21$",
      "$23$",
      "$25$",
      "$27$"
    ],
    "answer": "②",
    "solution": "$0<r<4$이면 $\\left(\\frac r4\\right)^n\\to0$이므로 분모·분자를 $4^n$으로 나누어 $$f(r)=\\lim_{n\\to\\infty}\\frac{r\\left(\\frac r4\\right)^n-2}{\\left(\\frac r4\\right)^n+1}=-2.$$\n$r=4$이면 $$f(4)=\\lim_{n\\to\\infty}\\frac{4^{n+1}-2\\cdot4^n}{4^n+4^n}=\\frac{(4-2)4^n}{2\\cdot4^n}=1.$$\n$r>4$이면 $\\left(\\frac4r\\right)^n\\to0$이므로 분모·분자를 $r^n$으로 나누어 $$f(r)=\\lim_{n\\to\\infty}\\frac{r-2\\left(\\frac4r\\right)^n}{1+\\left(\\frac4r\\right)^n}=r.$$\n따라서 $$f(1)=f(2)=f(3)=-2,\\quad f(4)=1,$$\n$$f(5)=5,\\ f(6)=6,\\ f(7)=7,\\ f(8)=8.$$\n합은 $$\\sum_{k=1}^8 f(k)=3(-2)+1+(5+6+7+8)=-6+1+26=21.$$\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-060",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_GEOMETRIC_RATIO",
    "crossConceptKeys": [
      "CC_SERIES_SUM"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "CASE_BRANCH"
  }
];
