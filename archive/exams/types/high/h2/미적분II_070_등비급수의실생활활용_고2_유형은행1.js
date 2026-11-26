window.examTitle = "미적분II_070_등비급수의실생활활용_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "급수",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-02",
    "standardUnit": "급수",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "급수"
    ],
    "wide": false,
    "content": "용기 공장에서 처음 생산한 플라스틱은 $2400\\,\\mathrm{kg}$이다. 사용 후 매번 직전 생산량의 $75\\%$를 회수하고 회수량의 $2/3$을 새 용기 생산에 쓴다. 이 과정을 무한히 반복할 때 회수한 플라스틱의 총량은?",
    "choices": [
      "$3000\\,\\mathrm{kg}$",
      "$3300\\,\\mathrm{kg}$",
      "$3600\\,\\mathrm{kg}$",
      "$3900\\,\\mathrm{kg}$",
      "$4200\\,\\mathrm{kg}$"
    ],
    "answer": "③",
    "solution": "처음 생산량에서 첫 회수량 계산: $2400\\times\\frac34=1800\\,\\mathrm{kg}$.\n회수량 중 새 용기 생산량: $1800\\times\\frac23=1200\\,\\mathrm{kg}$.\n다음 회수량: $1200\\times\\frac34=900\\,\\mathrm{kg}$이므로 회수량의 공비는 $\\frac{900}{1800}=\\frac12$.\n첫째항 $1800$, 공비 $\\frac12$인 등비급수의 합: $S=\\frac{1800}{1-\\frac12}$.\n계산하면 $S=1800\\times2=3600\\,\\mathrm{kg}$.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-065",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_APPLICATION",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 2,
    "category": "급수",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-02",
    "standardUnit": "급수",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "급수"
    ],
    "wide": false,
    "content": "처음에 만든 종이 상자 $900\\,\\mathrm{kg}$ 중 $75\\%$를 회수하고, 그중 $40\\%$를 새 상자로 만든다. 새 상자에도 같은 과정을 반복한다. 두 번째 재생산부터 만들어지는 상자의 총량은?",
    "choices": [
      "$\\frac{770}{7}\\,\\mathrm{kg}$",
      "$\\frac{810}{7}\\,\\mathrm{kg}$",
      "$\\frac{850}{7}\\,\\mathrm{kg}$",
      "$\\frac{890}{7}\\,\\mathrm{kg}$",
      "$\\frac{930}{7}\\,\\mathrm{kg}$"
    ],
    "answer": "②",
    "solution": "재생산량의 공비 계산: $0.75\\times0.40=0.30$.\n첫 번째 재생산량: $900\\times0.30=270\\,\\mathrm{kg}$.\n두 번째 재생산량: $270\\times0.30=81\\,\\mathrm{kg}$.\n두 번째 재생산부터의 총량이므로 첫째항 $81$, 공비 $0.3$인 등비급수의 합을 구한다.\n등비급수의 합: $S=\\frac{81}{1-0.3}$.\n계산하면 $S=\\frac{81}{0.7}=\\frac{810}{7}\\,\\mathrm{kg}$.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-065",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_APPLICATION",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 3,
    "category": "급수",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-02",
    "standardUnit": "급수",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "급수"
    ],
    "wide": false,
    "content": "장학 기금 $10$억 원을 매년 $20\\%$의 수익률로 운용하고, 연말에 원금과 수익을 합친 금액의 $25\\%$를 장학금으로 지급한다. 남은 돈을 다음 해에 같은 방식으로 운용할 때 장학금 총액은 몇 억 원인가?",
    "choices": [
      "$22$",
      "$24$",
      "$26$",
      "$28$",
      "$30$"
    ],
    "answer": "⑤",
    "solution": "첫 해 운용 후 금액: $10\\times1.2=12$억 원.\n첫 장학금: $12\\times0.25=3$억 원.\n지급 후 남은 금액: $12-3=9$억 원이므로 매년 기금은 직전 연초의 $1.2\\times0.75=0.9$배가 된다.\n따라서 장학금도 공비 $0.9$인 등비수열을 이룬다.\n등비급수의 합: $S=\\frac{3}{1-0.9}$.\n계산하면 $S=\\frac{3}{0.1}=30$억 원.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-065",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_APPLICATION",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 4,
    "category": "급수",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-02",
    "standardUnit": "급수",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "급수"
    ],
    "wide": false,
    "content": "급수 $A=\\sum_{n=1}^{\\infty}\\frac{1}{2n+1}$, $B=\\sum_{n=1}^{\\infty}\\frac1{n^2+2n}$의 수렴과 발산을 비교판정법으로 조사한다. 결과의 순서쌍 $(A,B)$는?",
    "choices": [
      "$(\\text{발산},\\text{수렴})$",
      "$(\\text{수렴},\\text{발산})$",
      "$(\\text{발산},\\text{발산})$",
      "$(\\text{수렴},\\text{수렴})$",
      "$(\\text{판정 불가},\\text{수렴})$"
    ],
    "answer": "①",
    "solution": "$A$의 일반항을 조화급수와 비교: 모든 $n\\ge1$에서 $\\frac1{2n+1}\\ge\\frac1{3n}>0$.\n$\\sum\\frac1{3n}=\\frac13\\sum\\frac1n$은 조화급수이므로 발산한다.\n비교판정법에 의해 $A$도 발산한다.\n$B$의 일반항을 $p$-급수와 비교: $0<\\frac1{n^2+2n}<\\frac1{n^2}$.\n$\\sum\\frac1{n^2}$은 $p=2>1$인 $p$-급수이므로 수렴한다.\n비교판정법에 의해 $B$도 수렴한다.\n따라서 $(A,B)=(\\text{발산},\\text{수렴})$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-065",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_APPLICATION",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  },
  {
    "id": 5,
    "category": "급수",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-02",
    "standardUnit": "급수",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "급수"
    ],
    "wide": false,
    "content": "상수 $a$에 대하여 급수 $\\sum_{n=1}^{\\infty}\\frac{an^2+6}{(n+2)(n+4)}$가 수렴한다. 이 급수의 합은?",
    "choices": [
      "$\\frac54$",
      "$\\frac{11}{8}$",
      "$\\frac32$",
      "$\\frac74$",
      "$2$"
    ],
    "answer": "④",
    "solution": "수렴하는 급수의 일반항은 $0$으로 수렴하므로 $\\lim_{n\\to\\infty}\\frac{an^2+6}{(n+2)(n+4)}=a=0$이어야 한다.\n따라서 $a=0$이다.\n$a=0$일 때 일반항: $\\frac6{(n+2)(n+4)}$.\n부분분수 분해: $\\frac6{(n+2)(n+4)}=3\\left(\\frac1{n+2}-\\frac1{n+4}\\right)$.\n부분합 계산: $S_N=3\\sum_{n=1}^N\\left(\\frac1{n+2}-\\frac1{n+4}\\right)$.\n텔레스코핑하면 $S_N=3\\left(\\frac13+\\frac14-\\frac1{N+3}-\\frac1{N+4}\\right)$.\n극한 계산: $S=3\\left(\\frac13+\\frac14\\right)=3\\times\\frac7{12}$.\n$S=\\frac74$.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-065",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_APPLICATION",
    "crossConceptKeys": [
      "CC_TELESCOPING_SERIES"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 6,
    "category": "급수",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-02",
    "standardUnit": "급수",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "급수"
    ],
    "wide": false,
    "content": "다항식 $a_nx^2+3a_nx+2$를 $x-n$으로 나눈 나머지가 항상 $8$이다. $\\sum_{n=1}^{\\infty}a_n$의 값은?",
    "choices": [
      "$3$",
      "$\\frac{10}{3}$",
      "$\\frac{11}{3}$",
      "$4$",
      "$\\frac{13}{3}$"
    ],
    "answer": "③",
    "solution": "나머지정리에 의해 $P(n)=a_nn^2+3a_nn+2=8$이다.\n정리하면 $a_nn(n+3)=6$이므로 $a_n=\\frac6{n(n+3)}$.\n부분분수 분해: $a_n=2\\left(\\frac1n-\\frac1{n+3}\\right)$.\n부분합 계산: $S_N=2\\sum_{n=1}^N\\left(\\frac1n-\\frac1{n+3}\\right)$.\n텔레스코핑하면 $S_N=2\\left(1+\\frac12+\\frac13-\\frac1{N+1}-\\frac1{N+2}-\\frac1{N+3}\\right)$.\n극한 계산: $S=2\\left(1+\\frac12+\\frac13\\right)$.\n$S=2\\times\\frac{11}{6}=\\frac{11}{3}$.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-065",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_APPLICATION",
    "crossConceptKeys": [
      "CC_TELESCOPING_SERIES",
      "CC_REMAINDER_THEOREM"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 7,
    "category": "급수",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-02",
    "standardUnit": "급수",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "급수"
    ],
    "wide": false,
    "content": "$\\sum_{n=1}^{\\infty}\\frac{4}{(n+1)(n+2)(n+3)}$의 값은?",
    "choices": [
      "$\\frac16$",
      "$\\frac15$",
      "$\\frac14$",
      "$\\frac{3}{10}$",
      "$\\frac13$"
    ],
    "answer": "⑤",
    "solution": "부분분수 분해의 차 계산: $\\frac1{(n+1)(n+2)}-\\frac1{(n+2)(n+3)}=\\frac2{(n+1)(n+2)(n+3)}$.\n따라서 일반항: $\\frac4{(n+1)(n+2)(n+3)}=2\\left(\\frac1{(n+1)(n+2)}-\\frac1{(n+2)(n+3)}\\right)$.\n부분합 계산: $S_N=2\\sum_{n=1}^N\\left(\\frac1{(n+1)(n+2)}-\\frac1{(n+2)(n+3)}\\right)$.\n텔레스코핑하면 $S_N=2\\left(\\frac1{2\\cdot3}-\\frac1{(N+2)(N+3)}\\right)$.\n극한 계산: $S=2\\times\\frac16$.\n$S=\\frac13$.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-065",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_APPLICATION",
    "crossConceptKeys": [
      "CC_TELESCOPING_SERIES"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  },
  {
    "id": 8,
    "category": "급수",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-02",
    "standardUnit": "급수",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "급수"
    ],
    "wide": false,
    "content": "급수 $\\frac{2}{1\\cdot2+2\\cdot3}+\\frac{2}{1\\cdot2+2\\cdot3+3\\cdot4}+\\cdots$의 합은?",
    "choices": [
      "$\\frac13$",
      "$\\frac12$",
      "$\\frac23$",
      "$\\frac56$",
      "$1$"
    ],
    "answer": "②",
    "solution": "부분합 공식: $\\sum_{k=1}^n k(k+1)=\\frac{n(n+1)(n+2)}3$.\n첫 항의 분모가 $\\sum_{k=1}^2k(k+1)$이므로 이 급수는 $n=2$부터 시작한다.\n일반항 정리: $\\frac2{\\frac{n(n+1)(n+2)}3}=\\frac6{n(n+1)(n+2)}$.\n부분분수 분해: $\\frac6{n(n+1)(n+2)}=3\\left(\\frac1{n(n+1)}-\\frac1{(n+1)(n+2)}\\right)$.\n부분합: $S_N=3\\sum_{n=2}^N\\left(\\frac1{n(n+1)}-\\frac1{(n+1)(n+2)}\\right)$.\n텔레스코핑하면 $S_N=3\\left(\\frac1{2\\cdot3}-\\frac1{(N+1)(N+2)}\\right)$.\n극한 계산: $S=3\\times\\frac16$.\n$S=\\frac12$.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-065",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_APPLICATION",
    "crossConceptKeys": [
      "CC_TELESCOPING_SERIES"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 9,
    "category": "급수",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-02",
    "standardUnit": "급수",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "급수"
    ],
    "wide": false,
    "content": "$a_n=\\sqrt{n+3}-\\sqrt n$이고 $S_N=\\sum_{n=1}^Na_n$이다. $(\\lim_{n\\to\\infty}a_n,\\lim_{N\\to\\infty}S_N)$은?",
    "choices": [
      "$(0,+\\infty)$",
      "$(0,0)$",
      "$(0,3)$",
      "$(1,+\\infty)$",
      "$(+\\infty,+\\infty)$"
    ],
    "answer": "①",
    "solution": "유리화: $a_n=\\frac{(\\sqrt{n+3}-\\sqrt n)(\\sqrt{n+3}+\\sqrt n)}{\\sqrt{n+3}+\\sqrt n}=\\frac3{\\sqrt{n+3}+\\sqrt n}$.\n극한 계산: $\\lim_{n\\to\\infty}a_n=0$.\n부분합: $S_N=\\sum_{n=1}^N(\\sqrt{n+3}-\\sqrt n)$.\n텔레스코핑: $S_N=(\\sqrt4-1)+(\\sqrt5-\\sqrt2)+\\cdots+(\\sqrt{N+3}-\\sqrt N)$.\n소거 후: $S_N=\\sqrt{N+1}+\\sqrt{N+2}+\\sqrt{N+3}-(1+\\sqrt2+\\sqrt3)$.\n$N\\to\\infty$일 때 $S_N\\to+\\infty$이므로 발산한다.\n따라서 $(\\lim_{n\\to\\infty}a_n,\\lim_{N\\to\\infty}S_N)=(0,+\\infty)$.\n주의: 일반항이 $0$으로 가도 급수는 발산할 수 있다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-065",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_APPLICATION",
    "crossConceptKeys": [
      "CC_TELESCOPING_SERIES"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 10,
    "category": "급수",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-02",
    "standardUnit": "급수",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "급수"
    ],
    "wide": false,
    "content": "급수 $\\sum_{n=1}^{\\infty}\\left(na_n-\\frac{5n^2}{3n+2}\\right)$이 수렴할 때 $\\lim_{n\\to\\infty}a_n$은?",
    "choices": [
      "$1$",
      "$\\frac43$",
      "$\\frac32$",
      "$\\frac53$",
      "$2$"
    ],
    "answer": "④",
    "solution": "수렴급수의 일반항은 $0$으로 수렴하므로 $b_n=na_n-\\frac{5n^2}{3n+2}\\to0$이다.\n식을 정리하면 $b_n=n\\left(a_n-\\frac{5n}{3n+2}\\right)$.\n양변을 $n$으로 나누면 $a_n-\\frac{5n}{3n+2}=\\frac{b_n}{n}$.\n$b_n\\to0$이고 $\\frac1n\\to0$이므로 $\\frac{b_n}{n}=b_n\\cdot\\frac1n\\to0$.\n따라서 $\\lim_{n\\to\\infty}\\left(a_n-\\frac{5n}{3n+2}\\right)=0$.\n극한의 성질에 의해 $\\lim_{n\\to\\infty}a_n=\\lim_{n\\to\\infty}\\frac{5n}{3n+2}$.\n$\\lim_{n\\to\\infty}\\frac{5n}{3n+2}=\\lim_{n\\to\\infty}\\frac5{3+\\frac2n}=\\frac53$.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-065",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_APPLICATION",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 11,
    "category": "급수",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-02",
    "standardUnit": "급수",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "급수"
    ],
    "wide": false,
    "content": "자연수 $n$에 대해 $y=|x|/(2n)$과 $y=|\\sin\\pi x|$의 교점 개수를 $a_n$이라 한다. $\\sum_{n=1}^{\\infty}\\frac1{a_na_{n+1}}$의 값은?\\n[그림: $n=1$일 때 $0\\le x\\le 2$에서 높이 $1$의 두 사인 아치와 직선 $y=x/2$를 그리고 $y$축 대칭으로 왼쪽 그래프를 그린다.]",
    "choices": [
      "$\\frac1{72}$",
      "$\\frac1{64}$",
      "$\\frac1{56}$",
      "$\\frac1{48}$",
      "$\\frac1{40}$"
    ],
    "answer": "③",
    "solution": "두 함수 $y=\\frac{|x|}{2n}$와 $y=|\\sin\\pi x|$는 모두 우함수이므로 $x>0$의 교점을 세어 2배 하고 원점을 더한다.\n$x\\ge2n$에서는 $\\frac{x}{2n}\\ge1\\ge|\\sin\\pi x|$이고 등호가 없으므로, $x\\ge0$에서는 아치 $[k,k+1]$ $(k=0,1,\\dots,2n-1)$만 비교하면 된다.\n$k=0$인 아치: 원점 이외의 교점이 $1$개이다. 중점에서 직선의 높이가 $\\frac1{2n}<1$이기 때문이다.\n$k=1,2,\\dots,2n-2$인 아치: 양 끝에서 직선이 $0$보다 위, 중점에서 직선이 $1$보다 아래이므로 교점이 각각 $2$개이다.\n$k=2n-1$인 마지막 아치: 왼쪽 끝과 중점, 오른쪽 끝을 비교하면 교점이 $2$개이다.\n따라서 $x>0$의 교점 수는 $1+2(2n-2)+2=4n-1$.\n원점을 더한 $x\\ge0$의 교점 수는 $4n$이고, 음의 $x$ 쪽에는 원점을 제외한 $4n-1$개가 대칭으로 있다.\n즉 $a_n=4n+(4n-1)=8n-1$.\n부분분수 분해: $\\frac1{a_na_{n+1}}=\\frac1{(8n-1)(8n+7)}=\\frac18\\left(\\frac1{8n-1}-\\frac1{8n+7}\\right)$.\n부분합: $S_N=\\frac18\\sum_{n=1}^N\\left(\\frac1{8n-1}-\\frac1{8n+7}\\right)$.\n텔레스코핑하면 $S_N=\\frac18\\left(\\frac17-\\frac1{8N+7}\\right)$.\n극한 계산: $S=\\frac18\\times\\frac17$.\n$S=\\frac1{56}$.\n따라서 정답은 ③이다.",
    "difficultyBucket": 5,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-065",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_APPLICATION",
    "crossConceptKeys": [
      "CC_GRAPH_INTERSECTION_COUNT",
      "CC_ABSOLUTE_VALUE_GRAPH",
      "CC_TELESCOPING_SERIES"
    ],
    "conditionKeys": [
      "COND_NATURAL_NUMBER"
    ],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/미적분II_070_등비급수의실생활활용_고2_유형은행1/q11-problem.svg",
    "imageAlt": "n=1에서 y=|sin(πx)|의 좌우 대칭 4개 반파장; 직선 y=|x|/2의 정확한 두 반직선 표현은 엔진 미지원.",
    "imageCaption": "n=1에서 y=|sin(πx)|의 좌우 대칭 4개 반파장; 직선 y=|x|/2의 정확한 두 반직선 표현은 엔진 미지원.",
    "imageSize": "full"
  },
  {
    "id": 12,
    "category": "급수",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-02",
    "standardUnit": "급수",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "급수"
    ],
    "wide": false,
    "content": "등비급수 $\\sum_{n=1}^{\\infty}3(2x-1)^{n-1}$이 수렴하는 $x$의 범위와 $x=1/4$일 때의 합을 순서대로 고르면?",
    "choices": [
      "$(-1<x<1,\\ 2)$",
      "$(0<x<1,\\ 1)$",
      "$(0<x\\le1,\\ 2)$",
      "$(0<x<1,\\ 6)$",
      "$(0<x<1,\\ 2)$"
    ],
    "answer": "⑤",
    "solution": "등비급수의 수렴 조건: 공비 $r=2x-1$에 대하여 $|r|<1$.\n부등식 풀이: $-1<2x-1<1$에서 각 변에 $1$을 더하면 $0<2x<2$.\n따라서 $0<x<1$이다. 경계 $x=0,1$에서는 $|r|=1$이라 발산한다.\n$x=\\frac14$일 때 공비: $2\\cdot\\frac14-1=-\\frac12$.\n등비급수의 합: $S=\\frac3{1-\\left(-\\frac12\\right)}$.\n계산하면 $S=\\frac3{\\frac32}=2$.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-065",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_APPLICATION",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  },
  {
    "id": 13,
    "category": "급수",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-02",
    "standardUnit": "급수",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "급수"
    ],
    "wide": false,
    "content": "급수 $\\sum_{n=1}^{\\infty}(x-3)\\left(\\frac{x+1}{3}\\right)^{n-1}$이 수렴하게 하는 모든 정수 $x$의 합을 $A$, 급수의 합을 $-4$로 만드는 실수 $x$를 $B$라 하자. $(A,B)$는?",
    "choices": [
      "$(-3,-1)$",
      "$(-2,-1)$",
      "$(-2,0)$",
      "$(-1,-1)$",
      "$(-1,0)$"
    ],
    "answer": "②",
    "solution": "등비급수의 첫째항은 $x-3$, 공비는 $r=\\frac{x+1}{3}$이다.\n(i) $x=3$이면 첫째항이 $0$이므로 모든 항이 $0$인 급수이고 수렴한다.\n(ii) $x\\ne3$이면 $|r|<1$일 때만 수렴하므로 $\\left|\\frac{x+1}{3}\\right|<1$.\n부등식 풀이: $-3<x+1<3$에서 $-4<x<2$.\n경계 $x=-4,2$에서는 $|r|=1$이고 첫째항이 $0$이 아니므로 발산한다.\n따라서 수렴하는 정수는 $-3,-2,-1,0,1,3$이고 합은 $A=-3-2-1+0+1+3=-2$.\n수렴할 때 급수의 합: $S=\\frac{x-3}{1-\\frac{x+1}{3}}=\\frac{3(x-3)}{2-x}$.\n$S=-4$로 놓으면 $\\frac{3(x-3)}{2-x}=-4$.\n양변에 $2-x$를 곱하면 $3x-9=-8+4x$.\n따라서 $x=-1$이고, 이 값은 $-4<x<2$에 속하며 공비가 $0$이다.\n즉 $B=-1$.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-065",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_APPLICATION",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_INTEGER"
    ],
    "integrationPattern": "NONE"
  },
  {
    "id": 14,
    "category": "급수",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-02",
    "standardUnit": "급수",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "급수"
    ],
    "wide": false,
    "content": "등비수열 $\\{a_n\\}$에 대하여 $\\sum_{n=1}^{\\infty}a_n=3$이고 $\\sum_{n=1}^{\\infty}a_n^2=3$이다. $\\sum_{n=1}^{\\infty}a_n^3$의 값은?",
    "choices": [
      "$\\frac{27}{7}$",
      "$4$",
      "$\\frac{30}{7}$",
      "$\\frac{32}{7}$",
      "$5$"
    ],
    "answer": "①",
    "solution": "등비수열의 첫째항을 $a$, 공비를 $r$이라 하면 수렴 조건은 $|r|<1$이다.\n$\\sum_{n=1}^{\\infty}a_n=3$에서 $\\frac a{1-r}=3$이므로 $a=3(1-r)$.\n$\\sum_{n=1}^{\\infty}a_n^2=3$에서 $\\frac{a^2}{1-r^2}=3$.\n$a=3(1-r)$를 대입: $\\frac{9(1-r)^2}{(1-r)(1+r)}=3$.\n약분하면 $\\frac{9(1-r)}{1+r}=3$.\n양변 정리: $9(1-r)=3(1+r)$에서 $9-9r=3+3r$.\n$6=12r$이므로 $r=\\frac12$, $a=\\frac32$.\n세제곱의 급수는 첫째항 $a^3=\\frac{27}{8}$, 공비 $r^3=\\frac18$인 등비급수이다.\n$\\sum_{n=1}^{\\infty}a_n^3=\\frac{\\frac{27}{8}}{1-\\frac18}$.\n계산하면 $\\frac{\\frac{27}{8}}{\\frac78}=\\frac{27}{7}$.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-065",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_APPLICATION",
    "crossConceptKeys": [
      "CC_GEOMETRIC_SEQUENCE"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 15,
    "category": "급수",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-02",
    "standardUnit": "급수",
    "standardUnitOrder": 2,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "급수"
    ],
    "wide": false,
    "content": "$a_1=2$이고 포물선 $y=3x^2$ 위의 점 $(a_n,3a_n^2)$에서 그은 접선의 $x$절편을 $a_{n+1}$이라 한다. 접선, 포물선, 직선 $x=a_{n+1}$이 둘러싸는 넓이를 $S_n$이라 할 때 $\\sum_{n=1}^{\\infty}S_n$의 값은?\\n[그림: $y=3x^2$와 $(2,12)$에서의 접선 $y=12x-12$, 세로선 $x=1$을 그리고 $1\\le x\\le2$에서 접선과 포물선 사이를 칠한다.]",
    "choices": [
      "$\\frac57$",
      "$\\frac67$",
      "$1$",
      "$\\frac87$",
      "$\\frac97$"
    ],
    "answer": "④",
    "solution": "접선의 방정식: $y-3a_n^2=6a_n(x-a_n)$이므로 $y=6a_nx-3a_n^2$.\n$x$절편: $0=6a_nx-3a_n^2$에서 $x=\\frac{a_n}{2}$이므로 $a_{n+1}=\\frac{a_n}{2}$.\n수열: $a_n=2\\left(\\frac12\\right)^{n-1}$.\n포물선과 접선의 높이 차: $3x^2-(6a_nx-3a_n^2)=3(x-a_n)^2$.\n넓이 적분: $S_n=\\int_{a_n/2}^{a_n}3(x-a_n)^2\\,dx$.\n적분 계산: $S_n=\\left[(x-a_n)^3\\right]_{a_n/2}^{a_n}$.\n$S_n=0-\\left(-\\frac{a_n}{2}\\right)^3=\\frac{a_n^3}{8}$.\n첫 넓이: $S_1=\\frac{2^3}{8}=1$.\n공비: $\\frac{S_{n+1}}{S_n}=\\left(\\frac{a_{n+1}}{a_n}\\right)^3=\\frac18$.\n등비급수의 합: $\\sum_{n=1}^{\\infty}S_n=\\frac1{1-\\frac18}$.\n$=\\frac87$.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-065",
    "problemTypeKey": "PT_CALCULUS_SERIES",
    "templateKey": "TPL_CALCULUS_SERIES_GEOMETRIC_APPLICATION",
    "crossConceptKeys": [
      "CC_TANGENT_LINE_SLOPE_AT_POINT",
      "CC_DEFINITE_INTEGRAL_AREA_DECOMPOSITION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
