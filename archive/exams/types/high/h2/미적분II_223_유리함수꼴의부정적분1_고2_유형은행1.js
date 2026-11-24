window.examTitle = "미적분II_223_유리함수꼴의부정적분1_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "여러 가지 적분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-07",
    "standardUnit": "여러 가지 적분법",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 적분법"
    ],
    "wide": false,
    "content": "모든 실수 $x$에서 $f(x)>0$, $\\frac{f'(x)}{f(x)}=3$인 미분가능한 함수 $f$가 $f(2)=e^2$를 만족한다. $f(3)$의 값은?",
    "choices": [
      "$e^2$",
      "$e^3$",
      "$e^4$",
      "$e^5$",
      "$e^6$"
    ],
    "answer": "④",
    "solution": "$f(x)>0$이므로 로그함수의 미분법에서 $(\\ln f(x))'=\\frac{f'(x)}{f(x)}=3$이다.\n양변을 $x$에 대하여 적분하면 $\\ln f(x)=3x+C$이다.\n$f(2)=e^2$를 대입하면 $\\ln e^2=2=3\\cdot2+C$이므로 $C=-4$이다.\n따라서 $\\ln f(x)=3x-4$이고 $x=3$에서 $\\ln f(3)=9-4=5$이다.\n지수함수로 되돌리면 $f(3)=e^5$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-097",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_INDEFINITE",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 2,
    "category": "여러 가지 적분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-07",
    "standardUnit": "여러 가지 적분법",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 적분법"
    ],
    "wide": false,
    "content": "점 $(1,0)$을 지나는 곡선 $y=f(x)$ 위의 점 $(x,f(x))$에서 접선의 기울기가 $\\frac{2(x-1)}{4+(x-1)^2}$일 때, $f(5)$의 값은?",
    "choices": [
      "$\\ln 2$",
      "$\\ln 3$",
      "$\\ln 4$",
      "$\\ln\\frac92$",
      "$\\ln 5$"
    ],
    "answer": "⑤",
    "solution": "접선의 기울기가 $f'(x)$이므로 $f'(x)=\\frac{2(x-1)}{4+(x-1)^2}$이다.\n$t=4+(x-1)^2$로 놓으면 $dt=2(x-1)\\,dx$이고 $t>0$이다.\n치환적분하면 $f(x)=\\int\\frac{1}{t}\\,dt=\\ln t+C=\\ln(4+(x-1)^2)+C$이다.\n$f(1)=0$을 대입하면 $0=\\ln4+C$이므로 $C=-\\ln4$이다.\n$x=5$에서 $4+(5-1)^2=4+16=20$이므로 $f(5)=\\ln20-\\ln4$이다.\n로그의 몫 법칙에서 $\\ln\\frac{20}{4}=\\ln5$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-097",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_INDEFINITE",
    "crossConceptKeys": [
      "CC_TANGENT_LINE_SLOPE_AT_POINT"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 3,
    "category": "여러 가지 적분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-07",
    "standardUnit": "여러 가지 적분법",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 적분법"
    ],
    "wide": false,
    "content": "$f'(x)=\\frac{4x}{x^2+3}$, $f(0)=1$일 때, $f(\\sqrt{3(e-1)})$의 값은?",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "③",
    "solution": "$t=x^2+3$으로 놓으면 $dt=2x\\,dx$이므로 $4x\\,dx=2\\,dt$이다.\n치환적분하면 $f(x)=\\int\\frac{4x}{x^2+3}\\,dx=2\\int\\frac{1}{t}\\,dt=2\\ln(x^2+3)+C$이다.\n$f(0)=1$을 대입하면 $1=2\\ln3+C$이므로 $C=1-2\\ln3$이다.\n따라서 $f(x)=2\\ln(x^2+3)+1-2\\ln3=1+2\\ln\\frac{x^2+3}{3}$이다.\n$x=\\sqrt{3(e-1)}$이면 $x^2=3(e-1)$이고 $\\frac{x^2+3}{3}=\\frac{3(e-1)+3}{3}=e$이다.\n그러므로 $f(\\sqrt{3(e-1)})=1+2\\ln e=1+2=3$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-097",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_INDEFINITE",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 4,
    "category": "여러 가지 적분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-07",
    "standardUnit": "여러 가지 적분법",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 적분법"
    ],
    "wide": false,
    "content": "$f'(x)=\\frac{2\\sin x}{3+\\cos x}$, $f(\\frac{\\pi}{2})=0$일 때, $f(0)$의 값은?",
    "choices": [
      "$\\ln\\frac{9}{16}$",
      "$\\ln\\frac34$",
      "$\\ln\\frac89$",
      "$\\ln\\frac43$",
      "$\\ln\\frac{16}{9}$"
    ],
    "answer": "①",
    "solution": "$t=3+\\cos x$로 놓으면 $dt=-\\sin x\\,dx$이므로 $\\sin x\\,dx=-dt$이다.\n치환적분하면 $f(x)=\\int\\frac{2\\sin x}{3+\\cos x}\\,dx=-2\\int\\frac{1}{t}\\,dt=-2\\ln(3+\\cos x)+C$이다.\n$f(\\frac{\\pi}{2})=0$을 대입하면 $\\cos\\frac{\\pi}{2}=0$이므로 $0=-2\\ln3+C$, 즉 $C=2\\ln3$이다.\n$x=0$에서 $\\cos0=1$이므로 $f(0)=-2\\ln4+2\\ln3=2\\ln\\frac34$이다.\n로그의 거듭제곱 법칙에서 $2\\ln\\frac34=\\ln\\left(\\frac34\\right)^2=\\ln\\frac9{16}$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-097",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_INDEFINITE",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 5,
    "category": "여러 가지 적분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-07",
    "standardUnit": "여러 가지 적분법",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 적분법"
    ],
    "wide": false,
    "content": "$0<x<\\pi$에서 $f(x)=\\sin x-\\frac12\\sin x\\cos x+\\frac14\\sin x\\cos^2 x-\\cdots$이다. $F'(x)=f(x)$, $F(\\frac{\\pi}{2})=0$일 때, $F(\\frac{\\pi}{3})$의 값은?",
    "choices": [
      "$\\ln\\frac{16}{25}$",
      "$\\ln\\frac45$",
      "$\\ln\\frac9{10}$",
      "$\\ln\\frac54$",
      "$\\ln\\frac{25}{16}$"
    ],
    "answer": "①",
    "solution": "주어진 급수는 첫째항이 $\\sin x$, 공비가 $-\\frac12\\cos x$인 등비급수이다.\n$0<x<\\pi$에서 $\\left|-\\frac12\\cos x\\right|\\le\\frac12<1$이므로 등비급수의 합 공식을 쓸 수 있다.\n$f(x)=\\frac{\\sin x}{1-\\left(-\\frac12\\cos x\\right)}=\\frac{\\sin x}{1+\\frac12\\cos x}=\\frac{2\\sin x}{2+\\cos x}$이다.\n$t=2+\\cos x$로 놓으면 $dt=-\\sin x\\,dx$이므로 $F(x)=\\int\\frac{2\\sin x}{2+\\cos x}\\,dx=-2\\int\\frac{1}{t}\\,dt$이다.\n$t>0$이므로 로그함수의 미분법에서 $F(x)=-2\\ln(2+\\cos x)+C$이다.\n$F(\\frac{\\pi}{2})=0$에서 $\\cos\\frac{\\pi}{2}=0$이므로 $0=-2\\ln2+C$, 즉 $C=2\\ln2$이다.\n$\\cos\\frac{\\pi}{3}=\\frac12$이므로 $F(\\frac{\\pi}{3})=-2\\ln\\frac52+2\\ln2$이다.\n로그의 몫 법칙에서 $-2\\ln\\frac52+2\\ln2=2\\ln\\frac{2}{5/2}=2\\ln\\frac45$이다.\n거듭제곱 법칙에서 $2\\ln\\frac45=\\ln\\frac{16}{25}$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-097",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_INDEFINITE",
    "crossConceptKeys": [
      "CC_GEOMETRIC_SEQUENCE",
      "CC_SERIES_SUM"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 6,
    "category": "여러 가지 적분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-07",
    "standardUnit": "여러 가지 적분법",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 적분법"
    ],
    "wide": false,
    "content": "$1<x<\\frac{\\pi}{2}$에서 다음 부정적분 중 옳은 것은? (단, $C$는 적분상수이다.)",
    "choices": [
      "$\\displaystyle\\int 2\\tan x\\,dx=-2\\ln(\\cos x)+C$",
      "$\\displaystyle\\int\\frac{2e^x}{2+e^x}\\,dx=\\ln(2+e^x)+C$",
      "$\\displaystyle\\int\\frac{1}{x\\ln x}\\,dx=2\\ln(\\ln x)+C$",
      "$\\displaystyle\\int\\frac{3-e^x}{3+e^x}\\,dx=-\\ln(3+e^x)+C$",
      "$\\displaystyle\\int\\frac{\\cos x-2\\sin x}{\\sin x+2\\cos x}\\,dx=-\\ln(\\sin x+2\\cos x)+C$"
    ],
    "answer": "①",
    "solution": "부정적분을 검산할 때는 로그함수의 미분법 $(\\ln u)'=\\frac{u'}{u}$로 우변을 미분한다.\n①은 $(-2\\ln(\\cos x))'=\\frac{2\\sin x}{\\cos x}=2\\tan x$이므로 옳다.\n②의 우변을 미분하면 $\\frac{e^x}{2+e^x}$이므로 분자에 $2$가 부족하다.\n③의 우변을 미분하면 $\\frac{2}{x\\ln x}$이므로 주어진 함수의 두 배이다.\n④의 우변을 미분하면 $\\frac{-e^x}{3+e^x}$이므로 분자에 상수항 $3$이 없다.\n⑤의 우변을 미분하면 $-\\frac{\\cos x-2\\sin x}{\\sin x+2\\cos x}$이므로 주어진 함수와 부호가 반대이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-097",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_INDEFINITE",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_TANGENT"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "CASE_BRANCH"
  },
  {
    "id": 7,
    "category": "여러 가지 적분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-07",
    "standardUnit": "여러 가지 적분법",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 적분법"
    ],
    "wide": false,
    "content": "미분가능한 함수 $f$가 $\\lim_{x\\to2}\\frac{f(x)}{x-2}=k+6$, $f'(x)=\\frac{kx}{x^2+4}$를 만족할 때, $f(0)$의 값은? (단, $k$는 실수이다.)",
    "choices": [
      "$-4\\ln2$",
      "$2\\ln2$",
      "$4\\ln2$",
      "$6\\ln2$",
      "$8\\ln2$"
    ],
    "answer": "③",
    "solution": "극한이 유한하고 $f$가 미분가능(따라서 연속)이므로 $\\lim_{x\\to2}f(x)=0$, 즉 $f(2)=0$이다.\n미분계수의 정의에서 $f'(2)=\\lim_{x\\to2}\\frac{f(x)-f(2)}{x-2}=\\lim_{x\\to2}\\frac{f(x)}{x-2}=k+6$이다.\n$f'(x)=\\frac{kx}{x^2+4}$에 $x=2$를 대입하면 $f'(2)=\\frac{2k}{8}=\\frac{k}{4}$이다.\n따라서 $\\frac{k}{4}=k+6$이고 $k=4k+24$, 즉 $-3k=24$에서 $k=-8$이다.\n이때 $f'(x)=\\frac{-8x}{x^2+4}$이고, $t=x^2+4$로 놓으면 $dt=2x\\,dx$이므로 $f(x)=-4\\int\\frac{1}{t}\\,dt=-4\\ln(x^2+4)+C$이다.\n$f(2)=0$에서 $0=-4\\ln8+C$이므로 $C=4\\ln8$이다.\n$x=0$에서 $f(0)=-4\\ln4+4\\ln8=4\\ln\\frac84$이다.\n로그의 몫 법칙에서 $4\\ln2$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-097",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_INDEFINITE",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 8,
    "category": "여러 가지 적분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-07",
    "standardUnit": "여러 가지 적분법",
    "standardUnitOrder": 7,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 적분법"
    ],
    "wide": false,
    "content": "연속함수 $f$는 $f(0)=0$이고 $x\\ne0$에서 미분가능하며 $f(x)f'(x)=\\frac{3x}{x^2+4}$를 만족한다. $\\{f(2)\\}^2$의 값은?",
    "choices": [
      "$3\\ln2$",
      "$4\\ln2$",
      "$5\\ln2$",
      "$6\\ln2$",
      "$7\\ln2$"
    ],
    "answer": "①",
    "solution": "연쇄법칙에서 $(\\{f(x)\\}^2)'=2f(x)f'(x)$이다.\n주어진 식의 양변에 2를 곱하면 $2f(x)f'(x)=\\frac{6x}{x^2+4}$이다.\n$x>0$에서 양변을 적분하고 $t=x^2+4$, $dt=2x\\,dx$로 치환하면 $\\{f(x)\\}^2=3\\int\\frac{1}{t}\\,dt=3\\ln(x^2+4)+C$이다.\n$f(0)=0$이고 $f$가 연속이므로 $\\lim_{x\\to0^+}\\{f(x)\\}^2=0$이고 $0=3\\ln4+C$, 즉 $C=-3\\ln4$이다.\n$x=2$에서 $\\{f(2)\\}^2=3\\ln8-3\\ln4$이다.\n로그의 몫 법칙에서 $3\\ln\\frac84=3\\ln2$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-097",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_INDEFINITE",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_NONZERO"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
