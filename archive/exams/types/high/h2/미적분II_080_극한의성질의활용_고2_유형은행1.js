window.examTitle = "미적분II_080_극한의성질의활용_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "지수함수와 로그함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-03",
    "standardUnit": "지수함수와 로그함수의 미분",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "지수함수와 로그함수의 미분"
    ],
    "wide": false,
    "content": "$\\lim_{x\\to0}\\frac{f(x)}{x}=3$이라 하자. $a=\\lim_{x\\to0}\\frac{e^{6x}-1}{f(x)}$, $b=\\lim_{x\\to0}\\frac{\\ln(1+9x)}{f(x)}$일 때 $a+b$는?",
    "choices": [
      "$3$",
      "$4$",
      "$5$",
      "$6$",
      "$7$"
    ],
    "answer": "③",
    "solution": "주어진 조건은 $\\lim_{x\\to0}\\frac{f(x)}x=3$이다.\n$e^u-1$의 기본 극한 $\\lim_{u\\to0}\\frac{e^u-1}{u}=1$을 쓰기 위해 $a$의 분자와 분모를 $x$로 나눈다.\n$$a=\\lim_{x\\to0}\\frac{(e^{6x}-1)/x}{f(x)/x}=\\frac{6}{3}=2$$\n로그의 기본 극한 $\\lim_{u\\to0}\\frac{\\ln(1+u)}u=1$을 쓰기 위해 $b$도 분자와 분모를 $x$로 나눈다.\n$$b=\\lim_{x\\to0}\\frac{\\ln(1+9x)/x}{f(x)/x}=\\frac{9}{3}=3$$\n따라서 $a+b=2+3=5$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-150",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_OPERATION_LAWS",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 2,
    "category": "지수함수와 로그함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-03",
    "standardUnit": "지수함수와 로그함수의 미분",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "지수함수와 로그함수의 미분"
    ],
    "wide": false,
    "content": "$\\lim_{x\\to0}\\frac{f(x)}{\\ln(1+2x)}=3$일 때 $\\lim_{x\\to4}\\frac{f(3x-12)}{x-4}$의 값은?",
    "choices": [
      "$9$",
      "$12$",
      "$15$",
      "$18$",
      "$21$"
    ],
    "answer": "④",
    "solution": "조건에서 로그의 기본 극한 $\\lim_{x\\to0}\\frac{\\ln(1+2x)}x=2$를 이용한다.\n주어진 식을 $x$로 나눈 형태로 정리하면 $$\\frac{f(x)}x=\\frac{f(x)}{\\ln(1+2x)}\\cdot\\frac{\\ln(1+2x)}x\\to3\\cdot2=6$$이다.\n구하는 극한에서 $t=x-4$로 치환하면 $x\\to4$일 때 $t\\to0$이고 $3x-12=3t$이다.\n따라서 $$\\lim_{x\\to4}\\frac{f(3x-12)}{x-4}=\\lim_{t\\to0}\\frac{f(3t)}t$$이다.\n분모 $t$를 $3t$로 맞추면 $$\\lim_{t\\to0}\\frac{f(3t)}t=3\\lim_{t\\to0}\\frac{f(3t)}{3t}=3\\cdot6=18$$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-150",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_OPERATION_LAWS",
    "crossConceptKeys": [
      "CC_DIFFERENCE_QUOTIENT_SCALING"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 3,
    "category": "지수함수와 로그함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-03",
    "standardUnit": "지수함수와 로그함수의 미분",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "지수함수와 로그함수의 미분"
    ],
    "wide": false,
    "content": "$\\lim_{x\\to0}\\frac{f(x)}{\\ln(1+2x)}=5$일 때 $\\lim_{x\\to0}\\frac{f(x)-(e^{4x}-1)}{\\ln(1+2x)}$의 값은?",
    "choices": [
      "$0$",
      "$1$",
      "$2$",
      "$3$",
      "$4$"
    ],
    "answer": "④",
    "solution": "조건에서 $\\lim_{x\\to0}\\frac{f(x)}{\\ln(1+2x)}=5$이다.\n구하는 식을 두 몫의 차로 분리한다.\n$$\\frac{f(x)-(e^{4x}-1)}{\\ln(1+2x)}=\\frac{f(x)}{\\ln(1+2x)}-\\frac{e^{4x}-1}{\\ln(1+2x)}$$\n두 번째 몫의 분자와 분모를 각각 $x$로 나눈다.\n$$\\frac{e^{4x}-1}{\\ln(1+2x)}=\\frac{(e^{4x}-1)/x}{\\ln(1+2x)/x}$$\n기본 극한 $\\lim_{x\\to0}\\frac{e^{4x}-1}{x}=4$, $\\lim_{x\\to0}\\frac{\\ln(1+2x)}x=2$이므로 두 번째 극한은 $\\frac42=2$이다.\n따라서 전체 극한은 $5-2=3$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-150",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_OPERATION_LAWS",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 4,
    "category": "지수함수와 로그함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-03",
    "standardUnit": "지수함수와 로그함수의 미분",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "지수함수와 로그함수의 미분"
    ],
    "wide": false,
    "content": "$\\lim_{x\\to0}\\frac{f(x)}{\\ln(1+3x)}=4$일 때 $\\lim_{x\\to0}\\frac{f(x)}{\\ln(1-2x)}$의 값은?",
    "choices": [
      "$-6$",
      "$-5$",
      "$-4$",
      "$-3$",
      "$-2$"
    ],
    "answer": "①",
    "solution": "조건에서 $\\lim_{x\\to0}\\frac{f(x)}{\\ln(1+3x)}=4$이다.\n구하는 식을 주어진 몫과 로그 비율의 곱으로 쓴다.\n$$\\frac{f(x)}{\\ln(1-2x)}=\\frac{f(x)}{\\ln(1+3x)}\\cdot\\frac{\\ln(1+3x)}{\\ln(1-2x)}$$\n로그 비율의 분자와 분모를 각각 $x$로 나눈다.\n$$\\frac{\\ln(1+3x)}{\\ln(1-2x)}=\\frac{\\ln(1+3x)/x}{\\ln(1-2x)/x}$$\n기본 극한 $\\lim_{x\\to0}\\frac{\\ln(1+3x)}x=3$, $\\lim_{x\\to0}\\frac{\\ln(1-2x)}x=-2$이므로 이 비율은 $\\frac3{-2}=-\\frac32$이다.\n따라서 구하는 극한은 $4\\cdot\\left(-\\frac32\\right)=-6$이다.\n주의: $\\ln(1-2x)$의 극한 비율은 $-2$이므로 부호를 놓치지 않는다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-150",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_OPERATION_LAWS",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 5,
    "category": "지수함수와 로그함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-03",
    "standardUnit": "지수함수와 로그함수의 미분",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "지수함수와 로그함수의 미분"
    ],
    "wide": false,
    "content": "연속함수 $f$가 $\\lim_{x\\to0}\\frac{\\ln(1+f(3x))}{x}=12$를 만족시킬 때 $\\lim_{x\\to0}\\frac{f(x)}{x}$의 값은?",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "④",
    "solution": "$h=\\ln(1+f(3x))$로 놓으면 주어진 조건에서 $\\frac hx\\to12$이다.\n$h\\to0$이므로 $e^h=1+f(3x)$, 즉 $f(3x)=e^h-1$이다.\n$f$의 연속성에서 $x\\to0$일 때 $f(3x)\\to0$이고 $f(0)=0$이다.\n구하는 식을 $h$와 연결하면 $$\\frac{f(3x)}{3x}=\\frac{e^h-1}{3x}=\\frac{e^h-1}{h}\\cdot\\frac h{3x}$$\n기본 극한 $\\lim_{h\\to0}\\frac{e^h-1}{h}=1$이고 $\\frac h{3x}\\to\\frac{12}{3}=4$이다.\n따라서 $\\lim_{x\\to0}\\frac{f(3x)}{3x}=1\\cdot4=4$이다.\n$t=3x$로 치환하면 $x\\to0$일 때 $t\\to0$이므로 $\\lim_{t\\to0}\\frac{f(t)}t=4$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-150",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_OPERATION_LAWS",
    "crossConceptKeys": [
      "CC_FUNCTION_CONTINUITY"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 6,
    "category": "지수함수와 로그함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-03",
    "standardUnit": "지수함수와 로그함수의 미분",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "지수함수와 로그함수의 미분"
    ],
    "wide": false,
    "content": "$\\lim_{x\\to\\infty} f(x)\\ln(1+\\frac5x)=15$일 때 $\\lim_{x\\to\\infty}\\frac{2f(x)}x$의 값은?",
    "choices": [
      "$6$",
      "$7$",
      "$8$",
      "$9$",
      "$10$"
    ],
    "answer": "①",
    "solution": "$x\\to\\infty$에서 $u=\\frac5x\\to0$이므로 기본 극한 $\\lim_{u\\to0}\\frac{\\ln(1+u)}u=1$을 쓴다.\n$$x\\ln\\left(1+\\frac5x\\right)=5\\cdot\\frac{\\ln(1+5/x)}{5/x}\\to5\\cdot1=5$$\n주어진 조건 $f(x)\\ln(1+\\frac5x)\\to15$의 양변을 위 극한 $5$로 나눈다.\n$$\\frac{f(x)}x=\\frac{f(x)\\ln(1+\\frac5x)}{x\\ln(1+\\frac5x)}\\to\\frac{15}{5}=3$$\n따라서 $\\lim_{x\\to\\infty}\\frac{2f(x)}x=2\\cdot3=6$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-150",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_OPERATION_LAWS",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 7,
    "category": "지수함수와 로그함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-03",
    "standardUnit": "지수함수와 로그함수의 미분",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "지수함수와 로그함수의 미분"
    ],
    "wide": false,
    "content": "$\\lim_{x\\to\\infty} f(x)\\ln(1+\\frac1{3x})=5$일 때 $\\lim_{x\\to\\infty}\\frac{f(x)}{x+4}$의 값은?",
    "choices": [
      "$9$",
      "$12$",
      "$15$",
      "$18$",
      "$21$"
    ],
    "answer": "③",
    "solution": "$x\\to\\infty$에서 $u=\\frac1{3x}\\to0$이므로 기본 극한 $\\lim_{u\\to0}\\frac{\\ln(1+u)}u=1$을 쓴다.\n$$\\ln\\left(1+\\frac1{3x}\\right)=\\frac1{3x}\\cdot\\frac{\\ln(1+\\frac1{3x})}{\\frac1{3x}}$$\n따라서 $(x+4)\\ln\\left(1+\\frac1{3x}\\right)=\\frac{x+4}{3x}\\cdot\\frac{\\ln(1+\\frac1{3x})}{\\frac1{3x}}\\to\\frac13\\cdot1=\\frac13$이다.\n구하는 식을 주어진 곱과 위 식의 비로 정리한다.\n$$\\frac{f(x)}{x+4}=\\frac{f(x)\\ln(1+\\frac1{3x})}{(x+4)\\ln(1+\\frac1{3x})}\\to\\frac5{1/3}=15$$\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-150",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_OPERATION_LAWS",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 8,
    "category": "지수함수와 로그함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-03",
    "standardUnit": "지수함수와 로그함수의 미분",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "지수함수와 로그함수의 미분"
    ],
    "wide": false,
    "content": "$\\lim_{x\\to0}\\frac{f(x)}{\\ln(1+2x)}=3$일 때 [보기]에서 참인 것을 모두 고른 것은?\nㄱ. $\\lim_{x\\to4}\\frac{f(x-4)}{x-4}=6$\nㄴ. $\\lim_{x\\to0}\\frac{f(x)+e^{4x}-1}{\\ln(1+2x)}=5$\nㄷ. $\\lim_{x\\to0}\\frac{f(x)\\ln(1+2x)}{x}=0$",
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄷ",
      "ㄱ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "answer": "⑤",
    "solution": "조건에서 로그의 기본 극한 $\\lim_{x\\to0}\\frac{\\ln(1+2x)}x=2$를 이용한다.\n$$\\frac{f(x)}x=\\frac{f(x)}{\\ln(1+2x)}\\cdot\\frac{\\ln(1+2x)}x\\to3\\cdot2=6$$\nㄱ. $t=x-4$로 치환하면 $x\\to4$일 때 $t\\to0$이고 $x-4=t$이다.\n$$\\lim_{x\\to4}\\frac{f(x-4)}{x-4}=\\lim_{t\\to0}\\frac{f(t)}t=6$$\n따라서 ㄱ은 참이다.\nㄴ. 극한을 두 몫으로 나눈다.\n$$\\lim_{x\\to0}\\frac{f(x)+e^{4x}-1}{\\ln(1+2x)}=3+\\lim_{x\\to0}\\frac{e^{4x}-1}{\\ln(1+2x)}$$\n기본 극한을 쓰면 두 번째 몫은 $\\frac{4}{2}=2$이다.\n따라서 $3+2=5$이므로 ㄴ은 참이다.\nㄷ. $\\ln(1+2x)\\to0$이고 $\\frac{f(x)}x\\to6$이다.\n$$\\lim_{x\\to0}\\frac{f(x)\\ln(1+2x)}x=\\lim_{x\\to0}\\frac{f(x)}x\\cdot\\ln(1+2x)=6\\cdot0=0$$\n따라서 ㄷ은 참이다.\n모두 참이므로 ㄱ, ㄴ, ㄷ이 모두 참이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-150",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_OPERATION_LAWS",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 9,
    "category": "지수함수와 로그함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-03",
    "standardUnit": "지수함수와 로그함수의 미분",
    "standardUnitOrder": 3,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "지수함수와 로그함수의 미분"
    ],
    "wide": false,
    "content": "이차함수 $f$가 $\\lim_{x\\to0}\\frac{e^{6x}-1}{f(x)}=2$, $\\lim_{x\\to\\infty} f(x)\\ln(1+\\frac2{x^2})=8$을 만족시킬 때 $f(3)$은?",
    "choices": [
      "$42$",
      "$43$",
      "$44$",
      "$45$",
      "$46$"
    ],
    "answer": "④",
    "solution": "$f(x)=ax^2+bx+c$로 놓는다.\n$\\lim_{x\\to0}(e^{6x}-1)=0$이고 극한값이 $2$로 존재하므로 분모도 $0$으로 가야 한다.\n$f$가 연속이므로 $f(0)=c=0$이다.\n그러면 $f(x)=ax^2+bx=x(ax+b)$이고 $$\\frac{e^{6x}-1}{f(x)}=\\frac{(e^{6x}-1)/x}{ax+b}$$\n기본 극한 $\\lim_{x\\to0}\\frac{e^{6x}-1}{x}=6$과 $ax+b\\to b$를 쓰면 $\\frac6b=2$이므로 $b=3$이다.\n따라서 $f(x)=ax^2+3x$이다.\n둘째 조건에서 $x^2\\ln(1+\\frac2{x^2})=2\\cdot\\frac{\\ln(1+2/x^2)}{2/x^2}\\to2$이다.\n$$f(x)\\ln\\left(1+\\frac2{x^2}\\right)=\\left(a+\\frac3x\\right)\\cdot x^2\\ln\\left(1+\\frac2{x^2}\\right)$$\n$x\\to\\infty$일 때 $a+\\frac3x\\to a$이므로 둘째 극한은 $a\\cdot2=2a$이다.\n$2a=8$에서 $a=4$이다.\n따라서 $f(x)=4x^2+3x$이고 $f(3)=4\\cdot9+3\\cdot3=36+9=45$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-150",
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_OPERATION_LAWS",
    "crossConceptKeys": [
      "CC_QUADRATIC_FUNCTION"
    ],
    "conditionKeys": [
      "COND_FUNCTION_TYPE_RESTRICTION"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
