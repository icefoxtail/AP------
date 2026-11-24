window.examTitle = "미적분II_084_지수함수로그함수의연속과미정계수_고2_유형은행1";

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
    "content": "양수 $a,b$에 대하여 함수 $f(x)=\\begin{cases}\\frac{\\ln(ax+b)}{x}&(x>0)\\\\2x+4&(x\\le0)\\end{cases}$가 $x=0$에서 연속일 때 $2a+b$는?",
    "choices": [
      "$8$",
      "$9$",
      "$10$",
      "$11$",
      "$12$"
    ],
    "answer": "②",
    "solution": "연속 조건에서 우극한이 유한해야 하므로 분자의 극한이 $0$이다(분모가 $0$에 가까워짐).\n따라서 $\\ln b=0$에서 $b=1$이다.\n$b=1$을 대입하면 우극한은 $\\lim_{x\\to0+}\\frac{\\ln(ax+1)}{x}=\\lim_{x\\to0+}\\frac{\\ln(1+ax)}{ax}\\cdot a=a$이다(로그함수의 극한).\n함숫값은 $f(0)=2\\cdot0+4=4$이다.\n연속이므로 $a=4$이다.\n따라서 $2a+b=2\\cdot4+1=9$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-153",
    "problemTypeKey": "PT_CONTINUITY_CONDITION",
    "templateKey": "TPL_CONTINUITY_PIECEWISE_BOUNDARY_MATCH",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
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
    "content": "함수 $f(x)=\\begin{cases}\\frac{e^{4x}+a}{x}&(x\\ne0)\\\\b&(x=0)\\end{cases}$가 $0$에서 연속일 때 $ab$는?",
    "choices": [
      "$-5$",
      "$-4$",
      "$-3$",
      "$-2$",
      "$-1$"
    ],
    "answer": "②",
    "solution": "$x\\to0$일 때 분모 $x\\to0$이고 극한이 존재해야 하므로 분자의 극한이 $0$이어야 한다(극한의 성질).\n$\\lim_{x\\to0}(e^{4x}+a)=1+a=0$이므로 $a=-1$이다.\n$a=-1$을 대입하고 $t=4x$로 놓으면 $\\lim_{x\\to0}\\frac{e^{4x}-1}{x}=\\lim_{t\\to0}\\frac{e^t-1}{t}\\cdot4=4$이다(지수함수의 극한).\n연속이므로 $b=4$이다.\n따라서 $ab=(-1)\\cdot4=-4$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-153",
    "problemTypeKey": "PT_CONTINUITY_CONDITION",
    "templateKey": "TPL_CONTINUITY_PIECEWISE_BOUNDARY_MATCH",
    "crossConceptKeys": [],
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
    "content": "함수 $f(x)=\\begin{cases}\\frac{e^{3x}-1}{ax}&(x<0)\\\\x^2+4x+6&(x\\ge0)\\end{cases}$가 모든 실수에서 연속일 때 $a$는?",
    "choices": [
      "$\\frac12$",
      "$\\frac23$",
      "$1$",
      "$\\frac32$",
      "$2$"
    ],
    "answer": "①",
    "solution": "경계점 $x=0$에서 좌극한과 함숫값이 같아야 한다(연속의 정의).\n좌극한은 $t=3x$로 놓으면 $\\lim_{x\\to0-}\\frac{e^{3x}-1}{ax}=\\lim_{t\\to0-}\\frac{e^t-1}{t}\\cdot\\frac{3}{a}=\\frac{3}{a}$이다.\n함숫값은 $f(0)=0^2+4\\cdot0+6=6$이다.\n$\\frac{3}{a}=6$에서 $a=\\frac{3}{6}=\\frac12$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-153",
    "problemTypeKey": "PT_CONTINUITY_CONDITION",
    "templateKey": "TPL_CONTINUITY_PIECEWISE_BOUNDARY_MATCH",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_UNIVERSAL_INPUTS"
    ],
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
    "content": "함수 $f(x)=\\begin{cases}\\frac{e^{9x}-1}{\\ln(1+3x)}&(-1/3<x<0)\\\\k&(x\\ge0)\\end{cases}$가 $0$에서 연속일 때 $k$는?",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "②",
    "solution": "$x\\to0-$일 때 분모 $\\ln(1+3x)\\to0$이고 극한이 존재하므로 분자도 $0$에 가까워진다. 이는 $e^0-1=0$이라 성립한다.\n분자와 분모를 각각 $x$로 나누면 $\\frac{e^{9x}-1}{\\ln(1+3x)}=\\frac{(e^{9x}-1)/x}{\\ln(1+3x)/x}$이다.\n$\\lim_{x\\to0}\\frac{e^{9x}-1}{x}=9$이다(지수함수의 극한).\n$\\lim_{x\\to0}\\frac{\\ln(1+3x)}{x}=3$이다(로그함수의 극한).\n따라서 좌극한은 $\\frac{9}{3}=3$이다.\n연속이므로 $k=3$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-153",
    "problemTypeKey": "PT_CONTINUITY_CONDITION",
    "templateKey": "TPL_CONTINUITY_PIECEWISE_BOUNDARY_MATCH",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
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
    "content": "함수 $f(x)=\\begin{cases}\\frac{e^{3x}+e^{7x}-2}{2x}&(x\\ne0)\\\\k&(x=0)\\end{cases}$가 $0$에서 연속일 때 $k$는?",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "⑤",
    "solution": "분자를 $(e^{3x}-1)+(e^{7x}-1)$로 묶는다.\n주어진 식을 정리하면 $\\frac{e^{3x}+e^{7x}-2}{2x}=\\frac12\\left(\\frac{e^{3x}-1}{x}+\\frac{e^{7x}-1}{x}\\right)$이다.\n$\\lim_{x\\to0}\\frac{e^{3x}-1}{x}=3$, $\\lim_{x\\to0}\\frac{e^{7x}-1}{x}=7$이다(지수함수의 극한).\n따라서 극한은 $\\frac12(3+7)=\\frac12\\cdot10=5$이다.\n연속이므로 $k=5$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-153",
    "problemTypeKey": "PT_CONTINUITY_CONDITION",
    "templateKey": "TPL_CONTINUITY_PIECEWISE_BOUNDARY_MATCH",
    "crossConceptKeys": [],
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
    "content": "함수 $f(x)=\\begin{cases}a-4x&(x\\le2)\\\\\\frac{6\\ln(x/2)}{x-2}&(x>2)\\end{cases}$가 모든 실수에서 연속일 때 $a$는?",
    "choices": [
      "$8$",
      "$9$",
      "$10$",
      "$11$",
      "$12$"
    ],
    "answer": "④",
    "solution": "경계점 $x=2$에서 연속이어야 하므로 $\\lim_{x\\to2+}f(x)=f(2)$이다.\n함숫값은 $f(2)=a-4\\cdot2=a-8$이다.\n$u=\\frac{x-2}{2}$로 놓으면 $x=2(1+u)$, $x-2=2u$, $\\ln\\frac{x}{2}=\\ln(1+u)$이다.\n우극한은 $\\lim_{u\\to0+}\\frac{6\\ln(1+u)}{2u}=3\\lim_{u\\to0+}\\frac{\\ln(1+u)}{u}=3$이다(로그함수의 극한).\n$a-8=3$이므로 $a=11$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-153",
    "problemTypeKey": "PT_CONTINUITY_CONDITION",
    "templateKey": "TPL_CONTINUITY_PIECEWISE_BOUNDARY_MATCH",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_UNIVERSAL_INPUTS"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
