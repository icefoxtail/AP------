window.examTitle = "미적분II_110_삼각함수의극한에서의미정계수의결정_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "삼각함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-04",
    "standardUnit": "삼각함수의 미분",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "삼각함수의 미분"
    ],
    "wide": false,
    "content": "$\\lim_{x\\to0}\\sin 6x/(x^2+ax+b)=3$일 때 $a+b$는?",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "①",
    "solution": "분자 $\\sin6x\\to0$이고 극한값이 $3$으로 존재하므로 분모도 $0$으로 가야 한다.\n$\\lim_{x\\to0}(x^2+ax+b)=b=0$이다.\n$b=0$을 대입하면 $\\frac{\\sin6x}{x^2+ax}=\\frac{\\sin6x}{x(x+a)}$이다.\n$\\lim_{x\\to0}\\frac{\\sin6x}{6x}=1$이므로 $\\frac{\\sin6x}{x}\\to6$이다.\n따라서 $\\frac{6}{a}=3$에서 $a=2$이다.\n$a+b=2+0=2$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-169",
    "problemTypeKey": "PT_LIMIT_PARAMETER_DETERMINATION",
    "templateKey": "TPL_LIMIT_FINITE_CONDITION_PARAMETER",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 2,
    "category": "삼각함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-04",
    "standardUnit": "삼각함수의 미분",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "삼각함수의 미분"
    ],
    "wide": false,
    "content": "$\\lim_{x\\to0}\\tan 2x/\\sin(ax+b)=1/2$, $0\\le b<\\pi/2$일 때 $a-b$는?",
    "choices": [
      "$3$",
      "$4$",
      "$5$",
      "$6$",
      "$7$"
    ],
    "answer": "②",
    "solution": "분자 $\\tan2x\\to0$이고 극한값이 $\\frac12$로 존재하므로 분모도 $0$으로 가야 한다.\n$\\lim_{x\\to0}\\sin(ax+b)=\\sin b=0$이고 $0\\le b<\\frac{\\pi}{2}$이므로 $b=0$이다.\n$b=0$을 대입하면 $\\frac{\\tan2x}{\\sin ax}$이다.\n$\\tan2x\\sim2x$, $\\sin ax\\sim ax$이므로 극한은 $\\frac{2x}{ax}=\\frac2a$이다.\n$\\frac2a=\\frac12$에서 $a=4$이다.\n$a-b=4-0=4$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-169",
    "problemTypeKey": "PT_LIMIT_PARAMETER_DETERMINATION",
    "templateKey": "TPL_LIMIT_FINITE_CONDITION_PARAMETER",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 3,
    "category": "삼각함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-04",
    "standardUnit": "삼각함수의 미분",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "삼각함수의 미분"
    ],
    "wide": false,
    "content": "$\\lim_{x\\to0}(ax+b)/\\sin 4x=3$일 때 $\\lim_{x\\to0}\\tan((a+6)x)/[(a+b)x]$는?",
    "choices": [
      "$0.5$",
      "$0.75$",
      "$1$",
      "$1.25$",
      "$1.5$"
    ],
    "answer": "⑤",
    "solution": "분모 $\\sin4x\\to0$이고 극한값이 $3$으로 존재하므로 분자도 $0$으로 가야 한다.\n$\\lim_{x\\to0}(ax+b)=b=0$이다.\n$b=0$을 대입하면 $\\frac{ax}{\\sin4x}$이고 $\\frac{\\sin4x}{4x}\\to1$에서 $\\frac a4=3$이다.\n따라서 $a=12$이다.\n구하는 식은 $\\frac{\\tan((12+6)x)}{(12+0)x}=\\frac{\\tan18x}{12x}$이다.\n$\\tan18x\\sim18x$이므로 극한은 $\\frac{18}{12}=\\frac32$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-169",
    "problemTypeKey": "PT_LIMIT_PARAMETER_DETERMINATION",
    "templateKey": "TPL_LIMIT_FINITE_CONDITION_PARAMETER",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 4,
    "category": "삼각함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-04",
    "standardUnit": "삼각함수의 미분",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "삼각함수의 미분"
    ],
    "wide": false,
    "content": "$\\lim_{x\\to0}\\sin 4x/(\\sqrt{ax+b}-2)=8$일 때 $ab$는?",
    "choices": [
      "$8$",
      "$9$",
      "$10$",
      "$11$",
      "$12$"
    ],
    "answer": "①",
    "solution": "분자 $\\sin4x\\to0$이고 극한값이 $8$로 존재하므로 분모도 $0$으로 가야 한다.\n$\\sqrt b-2=0$에서 $b=4$이다.\n분모를 유리화하면 $\\sqrt{4+ax}-2=\\frac{ax}{\\sqrt{4+ax}+2}$이다.\n따라서 주어진 식은 $\\frac{\\sin4x(\\sqrt{4+ax}+2)}{ax}$이다.\n$\\frac{\\sin4x}{x}\\to4$, $\\sqrt{4+ax}+2\\to4$이므로 극한은 $\\frac{4\\cdot4}{a}=\\frac{16}{a}$이다.\n$\\frac{16}{a}=8$에서 $a=2$이다.\n$ab=2\\cdot4=8$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-169",
    "problemTypeKey": "PT_LIMIT_PARAMETER_DETERMINATION",
    "templateKey": "TPL_LIMIT_FINITE_CONDITION_PARAMETER",
    "crossConceptKeys": [
      "CC_RADICAL_FUNCTION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 5,
    "category": "삼각함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-04",
    "standardUnit": "삼각함수의 미분",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "삼각함수의 미분"
    ],
    "wide": false,
    "content": "$\\lim_{x\\to0}(a-\\cos 4x)/x^2=b$에서 $b$가 실수일 때 $a+b$는?",
    "choices": [
      "$8$",
      "$9$",
      "$10$",
      "$11$",
      "$12$"
    ],
    "answer": "②",
    "solution": "분모 $x^2\\to0^+$이고 극한값 $b$가 실수이므로 분자도 $0$으로 가야 한다.\n$a-\\cos0=a-1=0$에서 $a=1$이다.\n$1-\\cos4x=2\\sin^2 2x$이다(반각공식).\n따라서 $\\frac{1-\\cos4x}{x^2}=\\frac{2\\sin^2 2x}{x^2}$이다.\n$\\frac{\\sin2x}{x}\\to2$이므로 극한은 $2\\cdot2^2=8$이다.\n즉 $b=8$이고 $a+b=1+8=9$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-169",
    "problemTypeKey": "PT_LIMIT_PARAMETER_DETERMINATION",
    "templateKey": "TPL_LIMIT_FINITE_CONDITION_PARAMETER",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 6,
    "category": "삼각함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-04",
    "standardUnit": "삼각함수의 미분",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "삼각함수의 미분"
    ],
    "wide": false,
    "content": "$\\lim_{x\\to0}\\tan 2x/(ax+b)=1/2$, $\\lim_{x\\to0}(c\\sin^2 x+d)/(\\cos 2x-1)=2$일 때 $a+b+c+d$는?",
    "choices": [
      "$-3$",
      "$-2$",
      "$-1$",
      "$0$",
      "$1$"
    ],
    "answer": "④",
    "solution": "첫 식에서 분자 $\\tan2x\\to0$이고 극한값이 $\\frac12$이므로 분모도 $0$으로 가야 한다.\n$\\lim_{x\\to0}(ax+b)=b=0$이다.\n$b=0$이면 $\\frac{\\tan2x}{ax}\\to\\frac2a=\\frac12$이므로 $a=4$이다.\n둘째 식에서 분모 $\\cos2x-1\\to0$이고 극한값이 $2$이므로 분자도 $0$으로 가야 한다.\n$\\lim_{x\\to0}(c\\sin^2x+d)=d=0$이다.\n$\\cos2x-1=-2\\sin^2x$이므로 $\\frac{c\\sin^2x}{-2\\sin^2x}=-\\frac c2=2$에서 $c=-4$이다.\n$a+b+c+d=4+0-4+0=0$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-169",
    "problemTypeKey": "PT_LIMIT_PARAMETER_DETERMINATION",
    "templateKey": "TPL_LIMIT_FINITE_CONDITION_PARAMETER",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 7,
    "category": "삼각함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-04",
    "standardUnit": "삼각함수의 미분",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "삼각함수의 미분"
    ],
    "wide": false,
    "content": "$\\lim_{x\\to0}(a-3\\cos 2x)/(x\\tan 2x)=b$에서 $b$가 실수일 때 $a-b$는?",
    "choices": [
      "$-2$",
      "$-1$",
      "$0$",
      "$1$",
      "$2$"
    ],
    "answer": "③",
    "solution": "분모 $x\\tan2x\\to0$이고 극한값 $b$가 실수이므로 분자도 $0$으로 가야 한다.\n$a-3\\cos0=a-3=0$에서 $a=3$이다.\n$3-3\\cos2x=3(1-\\cos2x)=6\\sin^2x$이다.\n분모는 $x\\tan2x\\sim x\\cdot2x=2x^2$이다.\n따라서 극한은 $\\frac{6\\sin^2x}{2x^2}=3\\left(\\frac{\\sin x}{x}\\right)^2\\to3$이다.\n즉 $b=3$이고 $a-b=3-3=0$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-169",
    "problemTypeKey": "PT_LIMIT_PARAMETER_DETERMINATION",
    "templateKey": "TPL_LIMIT_FINITE_CONDITION_PARAMETER",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 8,
    "category": "삼각함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-04",
    "standardUnit": "삼각함수의 미분",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "삼각함수의 미분"
    ],
    "wide": false,
    "content": "$\\lim_{x\\to0}(a\\sin 3x+b\\sin x)/x^3=8$일 때 $a+b$는?",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "④",
    "solution": "삼배각공식 $\\sin3x=3\\sin x-4\\sin^3x$를 대입한다.\n분자는 $a(3\\sin x-4\\sin^3x)+b\\sin x=(3a+b)\\sin x-4a\\sin^3x$이다.\n이를 $x^3$으로 나누면 $\\frac{(3a+b)\\sin x}{x^3}-\\frac{4a\\sin^3x}{x^3}$이다.\n$\\frac{\\sin x}{x}\\to1$이므로 첫 항이 유한하려면 $3a+b=0$이어야 한다.\n$3a+b=0$일 때 둘째 항의 극한은 $-4a\\left(\\frac{\\sin x}{x}\\right)^3\\to-4a$이다.\n$-4a=8$에서 $a=-2$이다.\n$b=-3a=6$이다.\n$a+b=-2+6=4$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-169",
    "problemTypeKey": "PT_LIMIT_PARAMETER_DETERMINATION",
    "templateKey": "TPL_LIMIT_FINITE_CONDITION_PARAMETER",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 9,
    "category": "삼각함수의 미분",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-04",
    "standardUnit": "삼각함수의 미분",
    "standardUnitOrder": 4,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "삼각함수의 미분"
    ],
    "wide": false,
    "content": "$\\lim_{x\\to0}(a\\sin 2x+x^2)/(\\cos 2x+b)=-1/2$일 때 $a+b$는?",
    "choices": [
      "$-3$",
      "$-2$",
      "$-1$",
      "$0$",
      "$1$"
    ],
    "answer": "③",
    "solution": "분자 $a\\sin2x+x^2\\to0$이고 극한값 $-\\frac12$이 $0$이 아니므로 분모도 $0$으로 가야 한다.\n$\\cos2x+b\\to1+b=0$에서 $b=-1$이다.\n$b=-1$이면 분모는 $\\cos2x-1=-2\\sin^2x\\sim-2x^2$이다.\n분자는 $a\\sin2x+x^2\\sim2ax+x^2=x(2a+x)$이다.\n따라서 비는 $\\frac{x(2a+x)}{-2x^2}=-\\frac{a}{x}-\\frac12$에 가까워진다.\n유한한 극한 $-\\frac12$이 되려면 $a=0$이어야 한다.\n$a=0$이면 $\\frac{x^2}{-2\\sin^2x}\\to-\\frac12$이므로 조건을 만족한다.\n$a+b=0-1=-1$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-169",
    "problemTypeKey": "PT_LIMIT_PARAMETER_DETERMINATION",
    "templateKey": "TPL_LIMIT_FINITE_CONDITION_PARAMETER",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
