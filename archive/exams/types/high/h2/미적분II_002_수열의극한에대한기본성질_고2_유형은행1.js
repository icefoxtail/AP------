window.examTitle = "미적분II_002_수열의극한에대한기본성질_고2_유형은행1";

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
    "content": "$\\lim_{n\\to\\infty}(a_n)=4$, $\\lim_{n\\to\\infty}(b_n)=-3$이고 모든 $b_n\\ne0$이다. 옳지 않은 것은?",
    "choices": [
      "$\\lim_{n\\to\\infty}(2a_n+b_n)=5$",
      "$\\lim_{n\\to\\infty}(a_n(a_n-2b_n))=40$",
      "$\\lim_{n\\to\\infty}((2a_n+1)/b_n^2)=1$",
      "$\\lim_{n\\to\\infty}(a_nb_n-2b_n)=-5$",
      "$\\lim_{n\\to\\infty}(2a_n/(a_n+b_n))=8$"
    ],
    "answer": "④",
    "solution": "수렴하는 수열의 극한 성질(사칙연산)로 각 식을 계산한다.\n① $\\lim(2a_n+b_n)=2\\cdot4+(-3)=5$ (참)\n② $\\lim a_n(a_n-2b_n)=4(4-2\\cdot(-3))=4\\cdot10=40$ (참)\n③ $b_n\\ne0$이므로 $\\lim\\dfrac{2a_n+1}{b_n^2}=\\dfrac{2\\cdot4+1}{(-3)^2}=\\dfrac{9}{9}=1$ (참)\n④ $\\lim(a_nb_n-2b_n)=4\\cdot(-3)-2\\cdot(-3)=-12+6=-6$ (거짓)\n⑤ $a_n+b_n\\to4+(-3)=1\\ne0$이므로 $\\lim\\dfrac{2a_n}{a_n+b_n}=\\dfrac{8}{1}=8$ (참)\n주의: ④에서 $-2b_n$의 부호를 살펴 $-12+6=-6$으로 계산해야 한다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-058",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_ALGEBRAIC",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_NONZERO"
    ],
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
    "content": "수렴하는 수열에서 $\\lim_{n\\to\\infty}(a_n)=7$, $\\lim_{n\\to\\infty}((2a_n+4)/(3b_n))=2$일 때 $\\lim_{n\\to\\infty}(b_n)$은?",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "③",
    "solution": "$\\lim a_n=7$이므로 분자의 극한은 $\\lim(2a_n+4)=2\\cdot7+4=18$이다.\n주어진 비가 수렴하므로 분모의 극한도 $0$이 아니고, 극한의 사칙연산을 쓸 수 있다.\n$\\lim\\dfrac{2a_n+4}{3b_n}=\\dfrac{18}{3\\lim b_n}=2$로 놓는다.\n양변에 $3\\lim b_n$을 곱하면 $18=6\\lim b_n$이다.\n따라서 $\\lim b_n=3$이다.\n주의: 분모의 극한 $3\\lim b_n$이 $0$이 아님을 확인해야 한다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-058",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_ALGEBRAIC",
    "crossConceptKeys": [],
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
    "content": "$a_n=3/n+2$, $b_n=8-(3n-1)^2/n^2$일 때 $\\lim_{n\\to\\infty}(a_n(3a_n-2b_n))$은?",
    "choices": [
      "$12$",
      "$16$",
      "$20$",
      "$24$",
      "$28$"
    ],
    "answer": "②",
    "solution": "$a_n=\\dfrac{3}{n}+2\\to0+2=2$이다.\n$b_n=8-\\left(\\dfrac{3n-1}{n}\\right)^2=8-\\left(3-\\dfrac{1}{n}\\right)^2$이므로 $\\lim b_n=8-3^2=8-9=-1$이다.\n먼저 $3a_n-2b_n$을 정리하면 $3\\left(\\dfrac{3}{n}+2\\right)-2\\left(8-\\left(3-\\dfrac{1}{n}\\right)^2\\right)$이다.\n$\\left(3-\\dfrac{1}{n}\\right)^2=9-\\dfrac{6}{n}+\\dfrac{1}{n^2}$이므로 $3a_n-2b_n=\\dfrac{9}{n}+6-16+18-\\dfrac{12}{n}+\\dfrac{2}{n^2}=8-\\dfrac{3}{n}+\\dfrac{2}{n^2}$이다.\n따라서 $\\lim(3a_n-2b_n)=8$이다.\n극한의 곱 성질로 $\\lim a_n(3a_n-2b_n)=2\\cdot8=16$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-058",
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
    "content": "$\\lim_{n\\to\\infty}(a_n-2)=3$, $\\lim_{n\\to\\infty}(a_n+3b_n)=17$일 때 $\\lim_{n\\to\\infty}(a_n(2+b_n))$은?",
    "choices": [
      "$15$",
      "$20$",
      "$25$",
      "$30$",
      "$35$"
    ],
    "answer": "④",
    "solution": "$\\lim(a_n-2)=3$에서 $\\lim a_n=3+2=5$이다.\n$\\lim(a_n+3b_n)=17$에 $\\lim a_n=5$를 대입하면 $5+3\\lim b_n=17$이다.\n이를 정리하면 $3\\lim b_n=12$이므로 $\\lim b_n=4$이다.\n따라서 $2+b_n\\to2+4=6$이다.\n극한의 곱 성질로 $\\lim a_n(2+b_n)=5\\cdot6=30$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
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
    "content": "$\\lim_{n\\to\\infty}(2a_n+b_n)=19$, $\\lim_{n\\to\\infty}(a_n+3b_n)=22$일 때 $\\lim_{n\\to\\infty}(a_n+b_n)$은?",
    "choices": [
      "$9$",
      "$11$",
      "$12$",
      "$13$",
      "$15$"
    ],
    "answer": "③",
    "solution": "$\\lim a_n=A$, $\\lim b_n=B$로 놓으면 $2A+B=19$, $A+3B=22$이다.\n첫 식에 $3$을 곱하면 $6A+3B=57$이다.\n이 식에서 둘째 식을 빼면 $(6A+3B)-(A+3B)=57-22$이므로 $5A=35$, $A=7$이다.\n$2A+B=19$에 $A=7$을 대입하면 $14+B=19$이므로 $B=5$이다.\n따라서 $\\lim(a_n+b_n)=A+B=7+5=12$이다.\n따라서 정답은 ③이다.",
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
    "content": "두 수열이 수렴하고 $\\lim_{n\\to\\infty}(a_n+b_n)=7$, $\\lim_{n\\to\\infty}(a_nb_n)=10$일 때 $\\lim_{n\\to\\infty}(a_n^2+b_n^2)$은?",
    "choices": [
      "$21$",
      "$23$",
      "$27$",
      "$29$",
      "$31$"
    ],
    "answer": "④",
    "solution": "$\\lim(a_n+b_n)=7$, $\\lim(a_nb_n)=10$이다.\n$x^2+y^2=(x+y)^2-2xy$이므로 $a_n^2+b_n^2=(a_n+b_n)^2-2a_nb_n$이다.\n극한의 사칙연산을 적용하면 $\\lim(a_n^2+b_n^2)=7^2-2\\cdot10$이다.\n계산하면 $49-20=29$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-058",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_ALGEBRAIC",
    "crossConceptKeys": [
      "CC_SYMMETRIC_POLYNOMIAL_IDENTITY"
    ],
    "conditionKeys": [],
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
    "content": "두 수열이 수렴하고 $\\lim_{n\\to\\infty}(a_n+b_n)=5$, $\\lim_{n\\to\\infty}(a_nb_n)=6$일 때 $\\lim_{n\\to\\infty}(1/a_n^2+1/b_n^2)$은?",
    "choices": [
      "$13/36$",
      "$14/36$",
      "$17/36$",
      "$19/36$",
      "$25/36$"
    ],
    "answer": "①",
    "solution": "$\\lim(a_n+b_n)=5$, $\\lim(a_nb_n)=6$이다.\n$\\dfrac{1}{a_n^2}+\\dfrac{1}{b_n^2}=\\dfrac{a_n^2+b_n^2}{a_n^2b_n^2}$로 통분한다.\n$a_n^2+b_n^2=(a_n+b_n)^2-2a_nb_n$이므로 분자의 극한은 $5^2-2\\cdot6=25-12=13$이다.\n분모의 극한은 $a_n^2b_n^2\\to6^2=36$이다.\n따라서 $\\lim\\left(\\dfrac{1}{a_n^2}+\\dfrac{1}{b_n^2}\\right)=\\dfrac{13}{36}$이다.\n주의: $a_nb_n\\to6\\ne0$이므로 분모가 $0$으로 가는 경우가 아니다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-058",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_ALGEBRAIC",
    "crossConceptKeys": [
      "CC_SYMMETRIC_POLYNOMIAL_IDENTITY"
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
    "content": "두 수열이 수렴하고 $\\lim_{n\\to\\infty}(a_n-b_n)=3$, $\\lim_{n\\to\\infty}(a_nb_n)=4$일 때 $\\lim_{n\\to\\infty}(a_n^3-b_n^3)$은?",
    "choices": [
      "$27$",
      "$39$",
      "$45$",
      "$54$",
      "$63$"
    ],
    "answer": "⑤",
    "solution": "$\\lim(a_n-b_n)=3$, $\\lim(a_nb_n)=4$이다.\n인수분해 공식 $x^3-y^3=(x-y)(x^2+xy+y^2)$을 쓴다.\n$x^2+xy+y^2=(x-y)^2+3xy$이므로 $a_n^3-b_n^3=(a_n-b_n)\\left((a_n-b_n)^2+3a_nb_n\\right)$이다.\n괄호 안의 극한은 $3^2+3\\cdot4=9+12=21$이다.\n따라서 $\\lim(a_n^3-b_n^3)=3\\cdot21=63$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
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
