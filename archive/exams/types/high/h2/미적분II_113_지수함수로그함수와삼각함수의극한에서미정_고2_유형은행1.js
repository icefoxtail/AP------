window.examTitle = "미적분II_113_지수함수로그함수와삼각함수의극한에서미정_고2_유형은행1";

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
    "content": "$\\lim_{x\\to0}\\ln(2x+b)/\\sin(ax)=4$일 때 $a+b$는?",
    "choices": [
      "$1.5$",
      "$1.75$",
      "$2$",
      "$2.25$",
      "$2.5$"
    ],
    "answer": "①",
    "solution": "분모 $\\sin(ax)\\to0$이고 극한이 유한하므로 분자도 $0$으로 수렴해야 한다(극한의 성질).\n$\\ln(2x+b)\\to\\ln b$이므로 $\\ln b=0$에서 $b=1$이다.\n$b=1$을 대입하면 $\\lim_{x\\to0}\\frac{\\ln(1+2x)}{\\sin(ax)}$이다.\n$\\ln(1+2x)\\sim2x$, $\\sin(ax)\\sim ax$이므로 극한은 $\\frac{2}{a}$이다.\n$\\frac{2}{a}=4$에서 $a=\\frac12$이다.\n따라서 $a+b=\\frac12+1=\\frac32=1.5$이다.\n따라서 정답은 ①이다.",
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
    "content": "$\\lim_{x\\to a}(5^x-1)/(4\\sin(x-a))=b\\ln5$일 때 $a+b$는?",
    "choices": [
      "$-0.25$",
      "$0$",
      "$0.25$",
      "$0.5$",
      "$0.75$"
    ],
    "answer": "③",
    "solution": "분모 $4\\sin(x-a)\\to0$이고 극한이 유한하므로 분자도 $0$으로 수렴해야 한다.\n$5^a-1=0$에서 $5^a=1$이므로 $a=0$이다.\n$a=0$을 대입하면 $\\lim_{x\\to0}\\frac{5^x-1}{4\\sin x}$이다.\n지수함수·삼각함수의 극한에서 $5^x-1\\sim x\\ln5$, $\\sin x\\sim x$이다.\n따라서 극한은 $\\frac{x\\ln5}{4x}=\\frac{\\ln5}{4}$이다.\n$b\\ln5=\\frac{\\ln5}{4}$에서 $b=\\frac14$이다.\n$a+b=0+\\frac14=0.25$이다.\n따라서 정답은 ③이다.",
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
    "content": "$\\lim_{x\\to0}\\sin9x/(3^{x+1}-a)=b/\\ln3$, $a,b>0$일 때 $ab$는?",
    "choices": [
      "$9$",
      "$10$",
      "$11$",
      "$12$",
      "$13$"
    ],
    "answer": "①",
    "solution": "분모 $3^{x+1}-a\\to3-a$이고 분자 $\\sin9x\\to0$이며 극한이 유한하므로 분모도 $0$이어야 한다.\n$3-a=0$에서 $a=3$이다.\n$a=3$을 대입하면 분모는 $3^{x+1}-3=3(3^x-1)$이다.\n$\\sin9x\\sim9x$, $3^x-1\\sim x\\ln3$이므로 극한은 $\\frac{9x}{3\\cdot x\\ln3}$이다.\n약분하면 $\\frac{3}{\\ln3}$이다.\n$\\frac{b}{\\ln3}=\\frac{3}{\\ln3}$에서 $b=3$이다.\n$ab=3\\cdot3=9$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-169",
    "problemTypeKey": "PT_LIMIT_PARAMETER_DETERMINATION",
    "templateKey": "TPL_LIMIT_FINITE_CONDITION_PARAMETER",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
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
    "content": "$\\lim_{x\\to0}x(e^{\\sin 3x}-a)/(1-\\cos2x)=b$가 유한할 때 $a+b$는?",
    "choices": [
      "$2.25$",
      "$2.5$",
      "$2.75$",
      "$3$",
      "$3.25$"
    ],
    "answer": "②",
    "solution": "분모 $1-\\cos2x\\to0$이고 극한이 유한하므로 분자의 극한도 $0$이어야 한다.\n분자 $x(e^{\\sin3x}-a)$에서 $x\\to0$, $e^{\\sin3x}\\to e^0=1$이므로 $1-a=0$에서 $a=1$이다.\n$a=1$을 대입하면 $\\lim_{x\\to0}\\frac{x(e^{\\sin3x}-1)}{1-\\cos2x}$이다.\n$e^{\\sin3x}-1\\sim\\sin3x\\sim3x$이므로 분자는 $x\\cdot3x=3x^2$에 근사한다.\n$1-\\cos2x=2\\sin^2x\\sim2x^2$이다.\n따라서 극한은 $\\frac{3x^2}{2x^2}=\\frac32$이므로 $b=\\frac32$이다.\n$a+b=1+\\frac32=\\frac52=2.5$이다.\n따라서 정답은 ②이다.",
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
    "content": "$\\lim_{x\\to0}x(5^x-1)/(4-a\\cos x)=\\ln b$, $a,b>0,b\\ne1$일 때 $ab$는?",
    "choices": [
      "$\\sqrt5$",
      "$2\\sqrt5$",
      "$3\\sqrt5$",
      "$4\\sqrt5$",
      "$5\\sqrt5$"
    ],
    "answer": "④",
    "solution": "분자가 $x(5^x-1)\\to0$이고 우변 $\\ln b\\ne0$이므로 분모도 $0$으로 수렴해야 한다.\n$4-a\\cos0=4-a=0$에서 $a=4$이다.\n$a=4$를 대입하면 $\\lim_{x\\to0}\\frac{x(5^x-1)}{4(1-\\cos x)}$이다.\n$5^x-1\\sim x\\ln5$이므로 분자는 $x\\cdot x\\ln5=x^2\\ln5$에 근사한다.\n$1-\\cos x\\sim\\frac{x^2}{2}$이므로 분모는 $4\\cdot\\frac{x^2}{2}=2x^2$이다.\n따라서 극한은 $\\frac{x^2\\ln5}{2x^2}=\\frac{\\ln5}{2}$이다.\n$\\ln b=\\frac{\\ln5}{2}=\\ln\\sqrt5$에서 $b=\\sqrt5$이다.\n$ab=4\\sqrt5$이다.\n주의: $b\\ne1$이므로 $\\ln b\\ne0$이고, 분모가 $0$으로 가는 조건을 놓치면 안 된다.\n따라서 정답은 ④이다.",
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
    "conditionKeys": [
      "COND_POSITIVE"
    ],
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
    "content": "$\\lim_{x\\to0}(e^{2x}-1)\\ln(1+3x)/(a+b\\cos^2x)=2$일 때 $ab$는?",
    "choices": [
      "$-13$",
      "$-12$",
      "$-11$",
      "$-10$",
      "$-9$"
    ],
    "answer": "⑤",
    "solution": "분자 $(e^{2x}-1)\\ln(1+3x)\\to0$이고 극한값이 $2\\ne0$이므로 분모도 $0$으로 수렴해야 한다.\n$a+b\\cos^20=a+b=0$이다.\n$a=-b$를 대입하면 분모는 $-b+b\\cos^2x=b(\\cos^2x-1)=-b\\sin^2x$이다.\n$e^{2x}-1\\sim2x$, $\\ln(1+3x)\\sim3x$이므로 분자는 $(2x)(3x)=6x^2$에 근사한다.\n$\\sin^2x\\sim x^2$이므로 분모는 $-bx^2$에 근사한다.\n따라서 극한은 $\\frac{6x^2}{-bx^2}=-\\frac{6}{b}$이다.\n$-\\frac{6}{b}=2$에서 $b=-3$이다.\n$a=-b=3$이다.\n$ab=3\\cdot(-3)=-9$이다.\n따라서 정답은 ⑤이다.",
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
  }
];
