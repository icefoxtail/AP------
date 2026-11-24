window.examTitle = "미적분II_021_등비수열의극한의미정계수의결정_고2_유형은행1";

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
    "content": "$\\lim_{n\\to\\infty}\\frac{a\\cdot8^{n+1}+3^n}{2\\cdot8^n-3^n}=3$일 때 실수 $a$는?",
    "choices": [
      "$\\frac12$",
      "$\\frac34$",
      "$1$",
      "$\\frac54$",
      "$\\frac32$"
    ],
    "answer": "②",
    "solution": "분자와 분모를 $8^n$으로 나눈다. (지수함수의 극한)\n$$\\lim_{n\\to\\infty}\\frac{a\\cdot8^{n+1}+3^n}{2\\cdot8^n-3^n}=\\lim_{n\\to\\infty}\\frac{8a+(3/8)^n}{2-(3/8)^n}$$\n$0<3/8<1$이므로 $(3/8)^n\\to0$이다. (등비수열의 극한)\n따라서 극한값은 $\\frac{8a}{2}=4a$이다.\n$4a=3$에서 $a=\\frac34$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-060",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_GEOMETRIC_RATIO",
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
    "content": "$\\lim_{n\\to\\infty}\\frac{a\\cdot4^{n+2}+3^n}{4^n-2\\cdot3^n}=80$, $\\lim_{n\\to\\infty}\\frac{b\\cdot12^{n+1}+3^n}{3^n(4^n+2^n)}=36$일 때 $ab$는?",
    "choices": [
      "$10$",
      "$12$",
      "$15$",
      "$18$",
      "$20$"
    ],
    "answer": "③",
    "solution": "첫째 극한의 분자·분모를 $4^n$으로 나눈다. (지수함수의 극한)\n$$\\lim_{n\\to\\infty}\\frac{a\\cdot4^{n+2}+3^n}{4^n-2\\cdot3^n}=\\lim_{n\\to\\infty}\\frac{16a+(3/4)^n}{1-2(3/4)^n}=16a$$\n$(3/4)^n\\to0$이므로 $16a=80$, 즉 $a=5$이다.\n둘째 극한의 분모를 전개하면 $3^n(4^n+2^n)=12^n+6^n$이다.\n분자·분모를 $12^n$으로 나눈다.\n$$\\lim_{n\\to\\infty}\\frac{b\\cdot12^{n+1}+3^n}{12^n+6^n}=\\lim_{n\\to\\infty}\\frac{12b+(1/4)^n}{1+(1/2)^n}=12b$$\n$(1/4)^n\\to0$, $(1/2)^n\\to0$이므로 $12b=36$, 즉 $b=3$이다.\n$ab=5\\cdot3=15$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-060",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_GEOMETRIC_RATIO",
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
    "content": "$0<a<b$이고 $\\lim_{n\\to\\infty}\\frac{2a^{n+1}+3b^n}{a^n+b^{n+1}}=\\frac12$일 때 $b$는?",
    "choices": [
      "$4$",
      "$6$",
      "$8$",
      "$10$",
      "$12$"
    ],
    "answer": "②",
    "solution": "$0<a<b$이므로 $0<\\frac{a}{b}<1$이다.\n분자·분모를 $b^n$으로 나눈다.\n$$\\lim_{n\\to\\infty}\\frac{2a^{n+1}+3b^n}{a^n+b^{n+1}}=\\lim_{n\\to\\infty}\\frac{2a(a/b)^n+3}{(a/b)^n+b}$$\n$(a/b)^n\\to0$이므로 극한은 $\\frac{3}{b}$이다. (등비수열의 극한)\n$\\frac{3}{b}=\\frac12$에서 $b=6$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-060",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_GEOMETRIC_RATIO",
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
    "content": "$\\lim_{n\\to\\infty}a_n=4$일 때 $\\lim_{n\\to\\infty}\\frac{3^na_n-2^n}{a_n+3\\cdot3^n}$은?",
    "choices": [
      "$\\frac23$",
      "$\\frac43$",
      "$\\frac53$",
      "$\\frac73$",
      "$\\frac83$"
    ],
    "answer": "②",
    "solution": "분자·분모를 $3^n$으로 나눈다.\n$$\\lim_{n\\to\\infty}\\frac{3^na_n-2^n}{a_n+3\\cdot3^n}=\\lim_{n\\to\\infty}\\frac{a_n-(2/3)^n}{a_n/3^n+3}$$\n$(2/3)^n\\to0$이고 $a_n\\to4$이다. (수렴하는 수열의 극한)\n분모의 $a_n/3^n\\to0$이다. (유한한 값 나누기 지수함수)\n따라서 극한은 $\\frac{4-0}{0+3}=\\frac43$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-060",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_GEOMETRIC_RATIO",
    "crossConceptKeys": [],
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
    "content": "$x>0$, $x\\ne3$에 대해 $\\lim_{n\\to\\infty}\\frac{2^{n+2}}{(\\log_3 x-1)^n}$이 $0$이 아닌 실수 $B$로 수렴할 때 $x+B$는?",
    "choices": [
      "$25$",
      "$27$",
      "$29$",
      "$31$",
      "$33$"
    ],
    "answer": "④",
    "solution": "일반항을 정리하면 $$\\frac{2^{n+2}}{(\\log_3x-1)^n}=4\\left(\\frac{2}{\\log_3x-1}\\right)^n$$이다.\n$r=\\frac{2}{\\log_3x-1}$이라 하고 등비수열 $\\{r^n\\}$의 수렴 조건을 따진다.\n(i) $|r|<1$이면 $r^n\\to0$이므로 $B=0$이 되어 $B\\ne0$에 맞지 않는다.\n(ii) $r=1$이면 모든 항이 $4$이므로 $B=4$이다.\n(iii) $r=-1$이면 $4(-1)^n$이 진동하여 수렴하지 않는다.\n(iv) $|r|>1$이면 $|r^n|\\to\\infty$이므로 발산한다.\n따라서 $r=1$, 즉 $\\frac{2}{\\log_3x-1}=1$이다.\n$\\log_3x-1=2$에서 $\\log_3x=3$, $x=27$이다.\n$x+B=27+4=31$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-060",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_GEOMETRIC_RATIO",
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
    "content": "수렴하는 수열 $\\{a_n\\}$에 대해 $\\lim_{n\\to\\infty}\\frac{7^{n+1}+2^na_n}{2^{n+1}-7^na_n}=7$일 때 $\\lim_{n\\to\\infty}a_n$은?",
    "choices": [
      "$-1$",
      "$0$",
      "$1$",
      "$2$",
      "$7$"
    ],
    "answer": "①",
    "solution": "$L=\\lim_{n\\to\\infty}a_n$이라 하면 $\\{a_n\\}$이 수렴하므로 $L$은 유한한 실수이다.\n분자·분모를 $7^n$으로 나눈다.\n$$\\frac{7^{n+1}+2^na_n}{2^{n+1}-7^na_n}=\\frac{7+(2/7)^n a_n}{2(2/7)^n-a_n}$$\n$(2/7)^n\\to0$이고 $a_n\\to L$이므로 분자는 $7$, 분모는 $-L$로 수렴한다.\n따라서 극한은 $\\frac{7}{-L}=7$이다.\n$-L=1$에서 $L=-1$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-060",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_GEOMETRIC_RATIO",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "$x^2-8x+15=0$의 두 근이 $a,b$일 때 $\\lim_{n\\to\\infty}\\frac{a^{n+2}+b^{n+2}}{a^n+b^n}$은?",
    "choices": [
      "$9$",
      "$15$",
      "$16$",
      "$20$",
      "$25$"
    ],
    "answer": "⑤",
    "solution": "인수분해하면 $x^2-8x+15=(x-3)(x-5)=0$이므로 두 근은 $a=3$, $b=5$이다.\n분자·분모를 $5^n$으로 나눈다.\n$$\\lim_{n\\to\\infty}\\frac{a^{n+2}+b^{n+2}}{a^n+b^n}=\\lim_{n\\to\\infty}\\frac{9(3/5)^n+25}{(3/5)^n+1}$$\n$(3/5)^n\\to0$이므로 극한은 $\\frac{25}{1}=25$이다. (등비수열의 극한)\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-060",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_GEOMETRIC_RATIO",
    "crossConceptKeys": [
      "CC_QUADRATIC_EQUATION_ROOTS"
    ],
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
    "content": "$x^2-6x-2=0$의 두 근이 $\\alpha,\\beta$일 때 $\\lim_{n\\to\\infty}\\frac{\\alpha^n+\\beta^n}{\\alpha^{n+1}+\\beta^{n+1}}$은?",
    "choices": [
      "$\\frac{\\sqrt{11}-3}{4}$",
      "$\\frac{\\sqrt{11}-3}{2}$",
      "$\\sqrt{11}-3$",
      "$\\frac{\\sqrt{11}+3}{4}$",
      "$\\frac{\\sqrt{11}+3}{2}$"
    ],
    "answer": "②",
    "solution": "근의 공식으로 $x=3\\pm\\sqrt{11}$이므로 $\\alpha=3+\\sqrt{11}$, $\\beta=3-\\sqrt{11}$이라 하자.\n$|\\alpha|>|\\beta|$이므로 $\\left|\\frac{\\beta}{\\alpha}\\right|<1$이다. (주의: $\\beta<0$이지만 절댓값 비교로 판단한다.)\n분자·분모를 $\\alpha^n$으로 나눈다.\n$$\\frac{\\alpha^n+\\beta^n}{\\alpha^{n+1}+\\beta^{n+1}}=\\frac{1+(\\beta/\\alpha)^n}{\\alpha+\\beta(\\beta/\\alpha)^n}$$\n$(\\beta/\\alpha)^n\\to0$이므로 극한은 $\\frac{1}{\\alpha}$이다.\n$\\frac{1}{3+\\sqrt{11}}=\\frac{3-\\sqrt{11}}{9-11}=\\frac{3-\\sqrt{11}}{-2}=\\frac{\\sqrt{11}-3}{2}$이다. (분모의 유리화)\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-060",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_GEOMETRIC_RATIO",
    "crossConceptKeys": [
      "CC_QUADRATIC_EQUATION_ROOTS"
    ],
    "conditionKeys": [],
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
    "content": "자연수 $a,b$에 대해 $\\lim_{n\\to\\infty}\\frac{a^{n+1}+b^{n+1}}{3a^n+b^n}=3$을 만족시키는 순서쌍 $(a,b)$는 몇 개인가?",
    "choices": [
      "$9$",
      "$10$",
      "$11$",
      "$12$",
      "$13$"
    ],
    "answer": "③",
    "solution": "$a,b$의 대소에 따라 경우를 나눈다.\n(i) $a>b$: 분자·분모를 $a^n$으로 나누면 $$\\lim_{n\\to\\infty}\\frac{a+b(b/a)^n}{3+(b/a)^n}=\\frac{a}{3}$$이다.\n$\\frac{a}{3}=3$에서 $a=9$이고 $b=1,2,\\ldots,8$이므로 $8$개이다.\n(ii) $a<b$: 분자·분모를 $b^n$으로 나누면 $$\\lim_{n\\to\\infty}\\frac{a(a/b)^n+b}{3(a/b)^n+1}=b$$이다.\n$b=3$이고 $a=1,2$이므로 $2$개이다.\n(iii) $a=b$: $\\frac{2a^{n+1}}{4a^n}=\\frac{a}{2}$이므로 $\\frac{a}{2}=3$, $a=6$이다.\n따라서 $(6,6)$의 $1$개이다.\n합계는 $8+2+1=11$개이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-060",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_GEOMETRIC_RATIO",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_NATURAL_NUMBER"
    ],
    "integrationPattern": "CASE_BRANCH"
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
    "content": "$a_1=4$이고 모든 자연수 $n$에 대해 $x^2+4\\sqrt{a_n}x+a_{n+1}=0$이 중근을 가질 때 $\\lim_{n\\to\\infty}\\frac{2^na_n+3\\cdot12^n}{3^na_n+5^n}$은?",
    "choices": [
      "$\\frac12$",
      "$1$",
      "$2$",
      "$3$",
      "$4$"
    ],
    "answer": "④",
    "solution": "이차방정식이 중근을 가지므로 판별식 $D=0$이다.\n$D=(4\\sqrt{a_n})^2-4a_{n+1}=16a_n-4a_{n+1}=0$\n$a_{n+1}=4a_n$이므로 $\\{a_n\\}$은 공비 $4$인 등비수열이다.\n$a_n=4\\cdot4^{n-1}=4^n$이다.\n주어진 식에 대입하면 $$\\frac{2^n\\cdot4^n+3\\cdot12^n}{3^n\\cdot4^n+5^n}=\\frac{8^n+3\\cdot12^n}{12^n+5^n}$$이다.\n분자·분모를 $12^n$으로 나눈다.\n$$\\lim_{n\\to\\infty}\\frac{(8/12)^n+3}{1+(5/12)^n}=\\frac{0+3}{1+0}=3$$\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-060",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_GEOMETRIC_RATIO",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_UNIVERSAL_INPUTS"
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
    "content": "양의 항으로 이루어진 두 수열이 $\\lim_{n\\to\\infty}(9^n+2)a_n=3$, $\\lim_{n\\to\\infty}(3^n+1)b_n=15$를 만족할 때 $\\lim_{n\\to\\infty}\\frac{b_n}{(3^{n+1}-1)a_n}$은?",
    "choices": [
      "$\\frac53$",
      "$2$",
      "$\\frac73$",
      "$\\frac83$",
      "$3$"
    ],
    "answer": "①",
    "solution": "첫 조건에서 $9^na_n=\\frac{3\\cdot9^n}{9^n+2}\\to3$이다.\n둘째 조건에서 $3^nb_n=\\frac{15\\cdot3^n}{3^n+1}\\to15$이다.\n구하는 식의 분자·분모에 $3^n$을 곱한다.\n$$\\frac{b_n}{(3^{n+1}-1)a_n}=\\frac{3^nb_n}{(3\\cdot3^n-1)\\cdot3^na_n}$$\n분모를 정리하면 $(3\\cdot3^n-1)\\cdot3^na_n=(3-3^{-n})\\cdot9^na_n$이다.\n$(3-3^{-n})\\to3$, $9^na_n\\to3$이므로 분모는 $3\\cdot3=9$로 수렴한다.\n분자는 $3^nb_n\\to15$이다.\n따라서 극한은 $\\frac{15}{9}=\\frac53$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-060",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_GEOMETRIC_RATIO",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
