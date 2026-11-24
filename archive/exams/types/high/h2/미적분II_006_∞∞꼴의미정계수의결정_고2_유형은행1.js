window.examTitle = "미적분II_006_∞∞꼴의미정계수의결정_고2_유형은행1";

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
    "content": "$\\lim_{n\\to\\infty}((an^3+bn-4)/(5n+2))=3$을 만족하는 상수 $a,b$에 대해 $a+b$는?",
    "choices": [
      "$7$",
      "$9$",
      "$11$",
      "$13$",
      "$15$"
    ],
    "answer": "⑤",
    "solution": "분모가 $5n+2$이므로 분자의 차수가 2 이상이면 극한이 발산한다. 따라서 $n^3$의 계수는 $0$이어야 하므로 $a=0$이다.\n$a=0$을 대입하면 $\\frac{bn-4}{5n+2}=\\frac{b-\\frac{4}{n}}{5+\\frac{2}{n}}$이다.\n분자와 분모를 $n$으로 나누고 극한을 취하면 $\\lim_{n\\to\\infty}\\frac{bn-4}{5n+2}=\\frac{b}{5}$이다.\n주어진 극한값이 $3$이므로 $\\frac{b}{5}=3$에서 $b=15$이다.\n따라서 $a+b=0+15=15$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
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
    "content": "$\\lim_{n\\to\\infty}((bn+3)/(an^2+4n+1))=2$일 때 상수 $a,b$의 합은?",
    "choices": [
      "$4$",
      "$6$",
      "$8$",
      "$10$",
      "$12$"
    ],
    "answer": "③",
    "solution": "분모가 $an^2+4n+1$이므로 $a\\ne0$이면 분모의 차수가 분자의 차수보다 커서 극한이 $0$이다.\n따라서 극한이 $2\\ne0$이 되려면 $a=0$이어야 한다.\n$a=0$을 대입하면 $\\frac{bn+3}{4n+1}=\\frac{b+\\frac{3}{n}}{4+\\frac{1}{n}}$이다.\n$n\\to\\infty$일 때 $\\frac{3}{n}\\to0$, $\\frac{1}{n}\\to0$이므로 극한은 $\\frac{b}{4}$이다.\n$\\frac{b}{4}=2$에서 $b=8$이다.\n따라서 $a+b=0+8=8$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
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
    "content": "$\\lim_{n\\to\\infty}((an^2+bn+1)/(8n+3))=1/2$일 때 $\\lim_{n\\to\\infty}((64n^2+5n+2)/(bn+a)^2)$은?",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "④",
    "solution": "분모가 $8n+3$이므로 분자의 차수가 2 이상이면 극한이 발산한다. 따라서 $n^2$의 계수는 $0$이어야 하므로 $a=0$이다.\n$a=0$을 대입하면 $\\frac{bn+1}{8n+3}=\\frac{b+\\frac{1}{n}}{8+\\frac{3}{n}}$이다.\n극한을 취하면 $\\frac{b}{8}$이고, 주어진 값이 $\\frac12$이므로 $\\frac{b}{8}=\\frac12$에서 $b=4$이다.\n구하는 식은 $b=4,a=0$일 때 $\\frac{64n^2+5n+2}{(4n)^2}=\\frac{64n^2+5n+2}{16n^2}$이다.\n분자와 분모를 $n^2$으로 나누면 $\\frac{64+\\frac{5}{n}+\\frac{2}{n^2}}{16}$이다.\n$n\\to\\infty$일 때 $\\frac{5}{n}\\to0$, $\\frac{2}{n^2}\\to0$이므로 극한은 $\\frac{64}{16}=4$이다.\n따라서 정답은 ④이다.",
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
    "content": "$\\lim_{n\\to\\infty}(((a^2-a-6)n^2+(a+2)n-1)/(n+1))=b\\ne0$일 때 $a+b$는?",
    "choices": [
      "$2$",
      "$4$",
      "$6$",
      "$8$",
      "$10$"
    ],
    "answer": "④",
    "solution": "분모가 $n+1$이므로 분자의 $n^2$ 항이 남으면 극한이 발산한다. 따라서 $n^2$의 계수는 $0$이어야 한다.\n$a^2-a-6=0$을 인수분해하면 $(a-3)(a+2)=0$이므로 $a=3$ 또는 $a=-2$이다.\n(i) $a=3$일 때 분자는 $(3+2)n-1=5n-1$이고, $\\frac{5n-1}{n+1}=5-\\frac{6}{n+1}$이므로 극한은 $5$이다.\n(ii) $a=-2$일 때 분자는 $0\\cdot n-1=-1$이고, $\\frac{-1}{n+1}\\to0$이므로 극한은 $0$이다.\n$b\\ne0$이므로 $a=-2$는 조건에 맞지 않고 $a=3$, $b=5$이다.\n따라서 $a+b=3+5=8$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-058",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_ALGEBRAIC",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_NONZERO"
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
    "content": "$\\lim_{n\\to\\infty}(((n+2/n)^6-1/n^6)/n^k)$이 수렴하도록 하는 실수 $k$의 최솟값은?",
    "choices": [
      "$4$",
      "$6$",
      "$8$",
      "$10$",
      "$12$"
    ],
    "answer": "②",
    "solution": "이항정리로 $(n+\\frac2n)^6$을 전개하면 $n^6+12n^4+60n^2+160+\\frac{240}{n^2}+\\frac{192}{n^4}+\\frac{64}{n^6}$이다.\n$\\frac{1}{n^6}$을 빼면 분자는 $n^6+12n^4+60n^2+160+\\frac{240}{n^2}+\\frac{192}{n^4}+\\frac{63}{n^6}$이다.\n이를 $n^k$으로 나누면 $n^{6-k}+12n^{4-k}+60n^{2-k}+160n^{-k}+\\cdots$이다.\n$k<6$이면 첫 항 $n^{6-k}$이 발산하므로 수렴하지 않는다.\n$k=6$이면 첫 항은 $1$이고 나머지 항은 모두 $0$으로 가므로 극한은 $1$이다.\n$k>6$이면 첫 항도 $0$으로 가므로 수렴하지만, 수렴하도록 하는 최솟값은 $k=6$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-058",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_ALGEBRAIC",
    "crossConceptKeys": [],
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
    "content": "양의 실수 $a$와 정수 $k$에 대해 $\\lim_{n\\to\\infty}(n^6(n^2+3)/(an^2+2n+1)^k)=1/81$일 때 $ak$는?",
    "choices": [
      "$4$",
      "$6$",
      "$8$",
      "$10$",
      "$12$"
    ],
    "answer": "⑤",
    "solution": "분자의 최고차항은 $n^6\\cdot n^2=n^8$이다.\n분모는 $(an^2+2n+1)^k$이므로 최고차항이 $a^k n^{2k}$이다.\n극한이 $0$도 아니고 무한대도 아닌 $\\frac{1}{81}$이므로 차수가 같아야 한다. 즉 $2k=8$에서 $k=4$이다.\n$k=4$를 대입하고 분자·분모를 $n^8$으로 나누면 $$\\frac{n^6(n^2+3)}{(an^2+2n+1)^4}=\\frac{1+\\frac{3}{n^2}}{\\left(a+\\frac{2}{n}+\\frac{1}{n^2}\\right)^4}$$이다.\n$n\\to\\infty$일 때 $\\frac{3}{n^2}\\to0$, $\\frac{2}{n}\\to0$, $\\frac{1}{n^2}\\to0$이므로 극한은 $\\frac{1}{a^4}$이다.\n$\\frac{1}{a^4}=\\frac{1}{81}$에서 $a^4=81$이고 $a>0$이므로 $a=3$이다.\n따라서 $ak=3\\cdot4=12$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-058",
    "problemTypeKey": "PT_CALCULUS_SEQUENCE_LIMIT",
    "templateKey": "TPL_CALCULUS_SEQ_LIMIT_ALGEBRAIC",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_POSITIVE",
      "COND_INTEGER"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
