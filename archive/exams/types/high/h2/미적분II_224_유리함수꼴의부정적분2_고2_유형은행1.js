window.examTitle = "미적분II_224_유리함수꼴의부정적분2_고2_유형은행1";

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
    "content": "$x>3$에서 $\\int\\frac{7}{x^2+x-12}\\,dx=\\ln\\left|\\frac{x+a}{x+b}\\right|+C$이다. 상수 $a,b$에 대하여 $a-b$의 값은?",
    "choices": [
      "$-12$",
      "$-10$",
      "$-8$",
      "$-7$",
      "$7$"
    ],
    "answer": "④",
    "solution": "분모를 인수분해하면 $x^2+x-12=(x-3)(x+4)$이다.\n부분분수 분해로 $\\frac{7}{(x-3)(x+4)}=\\frac{A}{x-3}+\\frac{B}{x+4}$라 두면 $A(x+4)+B(x-3)=7$이다.\n$x=3$을 대입하면 $7A=7$이므로 $A=1$이고, $x=-4$를 대입하면 $-7B=7$이므로 $B=-1$이다.\n따라서 $\\frac{7}{x^2+x-12}=\\frac{1}{x-3}-\\frac{1}{x+4}$이다.\n로그함수의 미분법을 역으로 써서 적분하면 $\\ln|x-3|-\\ln|x+4|+C$이다.\n로그의 몫 법칙으로 묶으면 $\\ln\\left|\\frac{x-3}{x+4}\\right|+C$이므로 $a=-3$, $b=4$이다.\n따라서 $a-b=-3-4=-7$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-097",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_INDEFINITE",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_RANGE"
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
    "content": "$1<x<4$에서 함수 $f(x)=\\int\\frac{3}{x^2-5x+4}\\,dx$가 $f(2)=6$을 만족할 때, $f(3)$의 값은?",
    "choices": [
      "$6-\\ln4$",
      "$6-\\ln3$",
      "$6-\\ln2$",
      "$6+\\ln2$",
      "$6+\\ln4$"
    ],
    "answer": "①",
    "solution": "분모를 인수분해하면 $x^2-5x+4=(x-1)(x-4)$이다.\n부분분수 분해로 $\\frac{3}{(x-1)(x-4)}=\\frac{A}{x-1}+\\frac{B}{x-4}$라 두면 $A(x-4)+B(x-1)=3$이다.\n$x=1$에서 $-3A=3$이므로 $A=-1$이고, $x=4$에서 $3B=3$이므로 $B=1$이다.\n따라서 $\\frac{3}{x^2-5x+4}=-\\frac{1}{x-1}+\\frac{1}{x-4}$이다.\n$1<x<4$에서 로그함수의 미분법으로 적분하면 $f(x)=-\\ln(x-1)+\\ln(4-x)+C=\\ln\\frac{4-x}{x-1}+C$이다.\n$f(2)=6$을 대입하면 $\\ln\\frac{2}{1}+C=6$이므로 $C=6-\\ln2$이다.\n$f(3)=\\ln\\frac{1}{2}+6-\\ln2=6-2\\ln2=6-\\ln4$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-097",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_INDEFINITE",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_RANGE"
    ],
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
    "content": "$x>-2$에서 곡선 $y=f(x)$의 접선 기울기가 $\\frac{1}{x^2+5x+6}$이고, $y$절편이 $\\ln3$일 때, $f(1)$의 값은?",
    "choices": [
      "$\\ln\\frac98$",
      "$\\ln\\frac32$",
      "$\\ln\\frac94$",
      "$\\ln3$",
      "$\\ln\\frac{27}{8}$"
    ],
    "answer": "⑤",
    "solution": "접선의 기울기가 $f'(x)$이므로 $f'(x)=\\frac{1}{x^2+5x+6}=\\frac{1}{(x+2)(x+3)}$이다.\n부분분수 분해로 $\\frac{1}{(x+2)(x+3)}=\\frac{1}{x+2}-\\frac{1}{x+3}$이다.\n$x>-2$에서 로그함수의 미분법으로 적분하면 $f(x)=\\ln(x+2)-\\ln(x+3)+C=\\ln\\frac{x+2}{x+3}+C$이다.\n$y$절편 $f(0)=\\ln3$을 대입하면 $\\ln\\frac{2}{3}+C=\\ln3$이므로 $C=\\ln3-\\ln\\frac{2}{3}=\\ln\\frac{9}{2}$이다.\n$f(1)=\\ln\\frac{3}{4}+\\ln\\frac{9}{2}=\\ln\\frac{27}{8}$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-097",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_INDEFINITE",
    "crossConceptKeys": [
      "CC_TANGENT_LINE_SLOPE_AT_POINT"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
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
    "content": "$x>1$에서 $f(x)=\\int\\frac{4}{x^2-1}\\,dx$, $f(2)=-2\\ln3$이다. $\\sum_{n=2}^{7} f(n)=a\\ln b$를 만족하는 정수 $a,b$에 대하여 $a+b$의 값은? (단, $1<b<100$)",
    "choices": [
      "$20$",
      "$22$",
      "$23$",
      "$24$",
      "$26$"
    ],
    "answer": "⑤",
    "solution": "분모를 인수분해하면 $x^2-1=(x-1)(x+1)$이므로 $\\frac{4}{x^2-1}=\\frac{2}{x-1}-\\frac{2}{x+1}$이다.\n$x>1$에서 로그함수의 미분법으로 적분하면 $f(x)=2\\ln(x-1)-2\\ln(x+1)+C=2\\ln\\frac{x-1}{x+1}+C$이다.\n$f(2)=-2\\ln3$을 대입하면 $2\\ln\\frac{1}{3}+C=-2\\ln3+C=-2\\ln3$이므로 $C=0$이다.\n따라서 $f(x)=2\\ln\\frac{x-1}{x+1}$이다.\n로그의 곱 법칙으로 합을 하나의 로그로 묶으면 $\\sum_{n=2}^{7}f(n)=2\\ln\\prod_{n=2}^{7}\\frac{n-1}{n+1}$이다.\n$\\prod_{n=2}^{7}\\frac{n-1}{n+1}=\\frac{1\\cdot2\\cdot3\\cdot4\\cdot5\\cdot6}{3\\cdot4\\cdot5\\cdot6\\cdot7\\cdot8}$이다.\n분모·분자의 공통인수 $3,4,5,6$을 약분하면 $\\frac{1\\cdot2}{7\\cdot8}=\\frac{1}{28}$이다.\n따라서 $\\sum_{n=2}^{7}f(n)=2\\ln\\frac{1}{28}=-2\\ln28$이다.\n$-2\\ln28=a\\ln b$에서 $a=-2$, $b=28$이고 $1<28<100$을 만족한다.\n따라서 $a+b=-2+28=26$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-097",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_INDEFINITE",
    "crossConceptKeys": [
      "CC_TELESCOPING_SERIES",
      "CC_SERIES_SUM"
    ],
    "conditionKeys": [
      "COND_INTEGER",
      "COND_RANGE"
    ],
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
    "content": "$x>-1$에서 $f(x)=\\int\\frac{x}{x^2+3x+2}\\,dx$이고 $f(0)=1$일 때, $f(2)$의 값은?",
    "choices": [
      "$1-\\ln2$",
      "$1-\\ln\\frac43$",
      "$1+\\ln\\frac43$",
      "$1+\\ln2$",
      "$1+\\ln3$"
    ],
    "answer": "③",
    "solution": "분모를 인수분해하면 $x^2+3x+2=(x+1)(x+2)$이다.\n부분분수 분해로 $\\frac{x}{(x+1)(x+2)}=\\frac{A}{x+1}+\\frac{B}{x+2}$라 두면 $A(x+2)+B(x+1)=x$이다.\n$x=-1$에서 $A=-1$이고, $x=-2$에서 $-B=-2$이므로 $B=2$이다.\n따라서 $\\frac{x}{x^2+3x+2}=-\\frac{1}{x+1}+\\frac{2}{x+2}$이다.\n로그함수의 미분법으로 적분하면 $f(x)=-\\ln(x+1)+2\\ln(x+2)+C$이다.\n$f(0)=1$을 대입하면 $0+2\\ln2+C=1$이므로 $C=1-2\\ln2$이다.\n$f(2)=-\\ln3+2\\ln4+1-2\\ln2=1-\\ln3+2\\ln2$이다.\n로그의 곱·몫 법칙으로 $2\\ln2-\\ln3=\\ln\\frac{4}{3}$이므로 $f(2)=1+\\ln\\frac{4}{3}$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-097",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_INDEFINITE",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
