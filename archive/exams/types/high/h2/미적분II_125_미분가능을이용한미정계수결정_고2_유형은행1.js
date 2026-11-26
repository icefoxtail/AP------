window.examTitle = "미적분II_125_미분가능을이용한미정계수결정_고2_유형은행1";

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
    "content": "$f(x)=\\begin{cases}a\\cos(2x)&(x\\ge0)\\\\2x^2+bx-3&(x<0)\\end{cases}$가 $0$에서 미분가능하다. $a+b$는?",
    "choices": [
      "$-3$",
      "$-2$",
      "$-1$",
      "$0$",
      "$1$"
    ],
    "answer": "①",
    "solution": "함숫값을 계산하면 $f(0)=a\\cos0=a$이다.\n좌극한은 $\\lim_{x\\to0-}(2x^2+bx-3)=-3$이다.\n연속 조건 $\\lim_{x\\to0-}f(x)=f(0)$에서 $a=-3$이다.\n우미분계수는 $(a\\cos2x)'=-2a\\sin2x$에 $x=0$을 대입하여 $0$이다.\n좌미분계수는 $(2x^2+bx-3)'=4x+b$에 $x=0$을 대입하여 $b$이다.\n미분가능 조건은 좌우 미분계수가 같다는 것이므로 $b=0$이다.\n따라서 $a+b=-3+0=-3$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-077",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_FUNCTION_CONTINUITY"
    ],
    "conditionKeys": [
      "COND_PIECEWISE_DOMAIN_PARTITION"
    ],
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
    "content": "$f(x)=\\begin{cases}2\\sin(2x)-1&(x\\le0)\\\\ax+b&(x>0)\\end{cases}$가 $0$에서 미분가능할 때 $a^2+b^2$는?",
    "choices": [
      "$15$",
      "$17$",
      "$19$",
      "$21$",
      "$23$"
    ],
    "answer": "②",
    "solution": "함숫값은 $f(0)=2\\sin0-1=-1$이다.\n우극한은 $\\lim_{x\\to0+}(ax+b)=b$이다.\n연속 조건에서 $b=-1$이다.\n좌미분계수는 $(2\\sin2x-1)'=4\\cos2x$에 $x=0$을 대입하여 $4$이다.\n우미분계수는 $(ax+b)'=a$에서 $a$이다.\n미분가능 조건에서 $a=4$이다.\n따라서 $a^2+b^2=4^2+(-1)^2=16+1=17$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-077",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_FUNCTION_CONTINUITY"
    ],
    "conditionKeys": [
      "COND_PIECEWISE_DOMAIN_PARTITION"
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
    "content": "$f(x)=\\begin{cases}\\sin(3x)+2\\cos x&(0\\le x<1)\\\\ax+b&(-1<x<0)\\end{cases}$가 $0$에서 미분가능할 때 $a+b$는?",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "⑤",
    "solution": "함숫값은 $f(0)=\\sin0+2\\cos0=2$이다.\n좌극한은 $\\lim_{x\\to0-}(ax+b)=b$이다.\n연속 조건에서 $b=2$이다.\n우미분계수는 $(\\sin3x+2\\cos x)'=3\\cos3x-2\\sin x$에 $x=0$을 대입하여 $3$이다.\n좌미분계수는 $(ax+b)'=a$이다.\n미분가능 조건에서 $a=3$이다.\n따라서 $a+b=3+2=5$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-077",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_FUNCTION_CONTINUITY"
    ],
    "conditionKeys": [
      "COND_PIECEWISE_DOMAIN_PARTITION"
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
    "content": "$f(x)=\\begin{cases}ae^{2x}+b&(x<0)\\\\\\sin(4x)+1&(x\\ge0)\\end{cases}$가 $0$에서 미분가능할 때 $ab$는?",
    "choices": [
      "$-4$",
      "$-2$",
      "$0$",
      "$2$",
      "$4$"
    ],
    "answer": "②",
    "solution": "함숫값은 $f(0)=\\sin0+1=1$이다.\n좌극한은 $\\lim_{x\\to0-}(ae^{2x}+b)=a+b$이다.\n연속 조건에서 $a+b=1$이다.\n우미분계수는 $(\\sin4x+1)'=4\\cos4x$에 $x=0$을 대입하여 $4$이다.\n좌미분계수는 $(ae^{2x}+b)'=2ae^{2x}$에 $x=0$을 대입하여 $2a$이다.\n미분가능 조건에서 $2a=4$이므로 $a=2$이다.\n$a+b=1$에서 $b=1-2=-1$이다.\n따라서 $ab=2\\times(-1)=-2$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-077",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_FUNCTION_CONTINUITY"
    ],
    "conditionKeys": [
      "COND_PIECEWISE_DOMAIN_PARTITION"
    ],
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
    "content": "$f(x)=\\begin{cases}a\\cos x+b\\sin(2x)&(x\\ge0)\\\\e^{2x+1}&(x<0)\\end{cases}$가 $0$에서 미분가능할 때 $a+b$는?",
    "choices": [
      "$0$",
      "$e$",
      "$2e$",
      "$3e$",
      "$4e$"
    ],
    "answer": "③",
    "solution": "함숫값은 $f(0)=a\\cos0+b\\sin0=a$이다.\n좌극한은 $\\lim_{x\\to0-}e^{2x+1}=e$이다.\n연속 조건에서 $a=e$이다.\n우미분계수는 $(a\\cos x+b\\sin2x)'=-a\\sin x+2b\\cos2x$에 $x=0$을 대입하여 $2b$이다.\n좌미분계수는 $(e^{2x+1})'=2e^{2x+1}$에 $x=0$을 대입하여 $2e$이다.\n미분가능 조건에서 $2b=2e$이므로 $b=e$이다.\n따라서 $a+b=e+e=2e$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-077",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_FUNCTION_CONTINUITY"
    ],
    "conditionKeys": [
      "COND_PIECEWISE_DOMAIN_PARTITION"
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
    "content": "$f(x)=\\begin{cases}2x^2+ax+b&(x<0)\\\\e^{3x}\\cos(2x)&(x\\ge0)\\end{cases}$가 $0$에서 미분가능할 때 $a+b$는?",
    "choices": [
      "$0$",
      "$1$",
      "$2$",
      "$3$",
      "$4$"
    ],
    "answer": "⑤",
    "solution": "함숫값은 $f(0)=e^0\\cos0=1$이다.\n좌극한은 $\\lim_{x\\to0-}(2x^2+ax+b)=b$이다.\n연속 조건에서 $b=1$이다.\n우미분계수는 곱의 미분법으로 $(e^{3x}\\cos2x)'=3e^{3x}\\cos2x-2e^{3x}\\sin2x$이다.\n$x=0$을 대입하면 $3\\cdot1\\cdot1-2\\cdot1\\cdot0=3$이다.\n좌미분계수는 $(2x^2+ax+b)'=4x+a$에 $x=0$을 대입하여 $a$이다.\n미분가능 조건에서 $a=3$이다.\n따라서 $a+b=3+1=4$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-077",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_FUNCTION_CONTINUITY"
    ],
    "conditionKeys": [
      "COND_PIECEWISE_DOMAIN_PARTITION"
    ],
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
    "content": "반지름 $2$인 원의 중심을 $O$라 하고, 양의 $x$축에서 잰 두 동경의 각을 $\\alpha,\\beta$라 하자. 동경과 원의 교점을 각각 $P,Q$라 한다. $0<\\beta<\\alpha<\\pi/2$일 때 거리 공식과 코사인법칙으로 $\\cos(\\alpha-\\beta)$를 구한 뒤, 이를 이용해 $\\tan(\\alpha-\\beta)$를 나타낸 식을 고르시오. [그림: 중심 $O=(0,0)$, 반지름 $2$인 원에 $P=(2\\cos\\alpha,2\\sin\\alpha)$, $Q=(2\\cos\\beta,2\\sin\\beta)$를 표시하고 $OP,OQ,PQ$를 잇는다.]",
    "choices": [
      "$\\frac{\\tan\\alpha-\\tan\\beta}{1+\\tan\\alpha\\tan\\beta}$",
      "$\\frac{\\tan\\alpha+\\tan\\beta}{1+\\tan\\alpha\\tan\\beta}$",
      "$\\frac{\\tan\\alpha-\\tan\\beta}{1-\\tan\\alpha\\tan\\beta}$",
      "$\\frac{\\tan\\beta-\\tan\\alpha}{1+\\tan\\alpha\\tan\\beta}$",
      "$\\frac{1+\\tan\\alpha\\tan\\beta}{\\tan\\alpha-\\tan\\beta}$"
    ],
    "answer": "①",
    "solution": "$P=(2\\cos\\alpha,2\\sin\\alpha)$, $Q=(2\\cos\\beta,2\\sin\\beta)$로 둔다.\n거리 공식으로 $PQ^2=(2\\cos\\alpha-2\\cos\\beta)^2+(2\\sin\\alpha-2\\sin\\beta)^2$이다.\n이를 전개하면 $PQ^2=4(\\cos^2\\alpha+\\sin^2\\alpha+\\cos^2\\beta+\\sin^2\\beta-2(\\cos\\alpha\\cos\\beta+\\sin\\alpha\\sin\\beta))$이다.\n$\\cos^2\\theta+\\sin^2\\theta=1$을 쓰면 $PQ^2=8-8(\\cos\\alpha\\cos\\beta+\\sin\\alpha\\sin\\beta)$이다.\n삼각형 $OPQ$에서 $OP=OQ=2$, 끼인각 $\\alpha-\\beta$이므로 코사인법칙으로 $PQ^2=2^2+2^2-2\\cdot2\\cdot2\\cos(\\alpha-\\beta)$이다.\n즉 $PQ^2=8-8\\cos(\\alpha-\\beta)$이다.\n두 식을 비교하면 $\\cos(\\alpha-\\beta)=\\cos\\alpha\\cos\\beta+\\sin\\alpha\\sin\\beta$이다.\n위 식에서 $\\alpha$ 대신 $\\frac{\\pi}{2}-\\alpha$, $\\beta$ 대신 $-\\beta$를 넣으면 $\\sin(\\alpha-\\beta)=\\sin\\alpha\\cos\\beta-\\cos\\alpha\\sin\\beta$이다.\n따라서 $\\tan(\\alpha-\\beta)=\\frac{\\sin(\\alpha-\\beta)}{\\cos(\\alpha-\\beta)}=\\frac{\\sin\\alpha\\cos\\beta-\\cos\\alpha\\sin\\beta}{\\cos\\alpha\\cos\\beta+\\sin\\alpha\\sin\\beta}$이다.\n분자와 분모를 $\\cos\\alpha\\cos\\beta$로 나누면 $\\tan(\\alpha-\\beta)=\\frac{\\tan\\alpha-\\tan\\beta}{1+\\tan\\alpha\\tan\\beta}$이다.\n주의: $\\alpha,\\beta$가 제1사분면의 각이므로 $\\cos\\alpha\\cos\\beta\\ne0$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-077",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_COTERMINAL_ANGLES",
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/미적분II_125_미분가능을이용한미정계수결정_고2_유형은행1/q7-problem.svg",
    "imageAlt": "원점 중심의 반지름 2인 원, 양의 x축과 각 α·β를 이루는 두 동경 OP·OQ 및 현 PQ를 나타낸다.",
    "imageCaption": "원점 중심의 반지름 2인 원, 양의 x축과 각 α·β를 이루는 두 동경 OP·OQ 및 현 PQ를 나타낸다.",
    "imageSize": "full"
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
    "content": "$\\theta$가 제1사분면의 각이고 $\\sin\\theta\\cos\\theta=12/25$일 때, $\\sec\\theta+\\csc\\theta$는?",
    "choices": [
      "$\\frac{25}{12}$",
      "$\\frac{35}{12}$",
      "$\\frac{41}{12}$",
      "$\\frac{47}{12}$",
      "$\\frac{49}{12}$"
    ],
    "answer": "②",
    "solution": "$\\sin\\theta\\cos\\theta=\\frac{12}{25}$이다.\n$(\\sin\\theta+\\cos\\theta)^2=\\sin^2\\theta+\\cos^2\\theta+2\\sin\\theta\\cos\\theta=1+\\frac{24}{25}=\\frac{49}{25}$이다.\n$\\theta$가 제1사분면의 각이므로 $\\sin\\theta+\\cos\\theta>0$이고, 따라서 $\\sin\\theta+\\cos\\theta=\\frac75$이다.\n또 $\\tan\\theta+\\cot\\theta=\\frac{\\sin\\theta}{\\cos\\theta}+\\frac{\\cos\\theta}{\\sin\\theta}=\\frac{\\sin^2\\theta+\\cos^2\\theta}{\\sin\\theta\\cos\\theta}=\\frac{1}{12/25}=\\frac{25}{12}$이다.\n$\\sec\\theta+\\csc\\theta=\\frac1{\\cos\\theta}+\\frac1{\\sin\\theta}=\\frac{\\sin\\theta+\\cos\\theta}{\\sin\\theta\\cos\\theta}$이다.\n이를 계산하면 $\\sec\\theta+\\csc\\theta=\\frac{7/5}{12/25}=\\frac75\\cdot\\frac{25}{12}=\\frac{35}{12}$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-077",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_QUADRANT_CONDITION",
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
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
    "content": "$0<\\alpha<\\pi/2<\\beta<\\pi$, $\\cos\\alpha=4/5$, $\\tan\\beta=-5/12$일 때 $\\sin(\\alpha+\\beta)$는?",
    "choices": [
      "$-\\frac{36}{65}$",
      "$-\\frac{24}{65}$",
      "$-\\frac{16}{65}$",
      "$\\frac{16}{65}$",
      "$\\frac{24}{65}$"
    ],
    "answer": "③",
    "solution": "$\\alpha$는 제1사분면의 각이므로 $\\sin\\alpha>0$이고, $\\sin\\alpha=\\sqrt{1-\\cos^2\\alpha}=\\sqrt{1-\\frac{16}{25}}=\\frac35$이다.\n$\\beta$는 제2사분면의 각이고 $\\tan\\beta=-\\frac5{12}$이다.\n$\\tan\\beta=\\frac{\\sin\\beta}{\\cos\\beta}$에서 $\\sin\\beta>0$, $\\cos\\beta<0$이므로 $\\sin\\beta=\\frac5{13}$, $\\cos\\beta=-\\frac{12}{13}$이다.\n사인 덧셈정리로 $\\sin(\\alpha+\\beta)=\\sin\\alpha\\cos\\beta+\\cos\\alpha\\sin\\beta$이다.\n값을 대입하면 $\\sin(\\alpha+\\beta)=\\frac35\\cdot\\left(-\\frac{12}{13}\\right)+\\frac45\\cdot\\frac5{13}$이다.\n계산하면 $\\sin(\\alpha+\\beta)=-\\frac{36}{65}+\\frac{20}{65}=-\\frac{16}{65}$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-077",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_QUADRANT_CONDITION",
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 10,
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
    "content": "직사각형 $ABCD$에서 $B$는 왼쪽 아래, $C$는 오른쪽 아래, $D$는 오른쪽 위에 있다. $E$는 변 $CD$의 내부, $F$는 변 $AD$의 내부에 있고 $BE\\perp EF$이다. $\\angle CBE=\\alpha$, $\\angle EBF=\\beta$, $\\tan\\alpha=5/12$, $\\tan\\beta=3/4$, $BF=65$이다. $F$에서 $BC$에 내린 수선의 발을 $G$라 할 때 $(FG,BG)$는? [그림: $B=(0,0)$, $C=(48,0)$, $D=(48,56)$, $A=(0,56)$, $E=(48,20)$, $F=(33,56)$, $G=(33,0)$을 표시한다. 완성 그림에는 좌표와 미지 길이를 적지 않고 $BE,EF,BF,FG$와 두 각 및 직각 표시를 넣는다.]",
    "choices": [
      "$(44,33)$",
      "$(48,39)$",
      "$(52,35)$",
      "$(56,33)$",
      "$(60,39)$"
    ],
    "answer": "④",
    "solution": "직각삼각형 $BEF$에서 $\\angle EBF=\\beta$이고 $BF=65$이다.\n$\\tan\\beta=\\frac34$이므로 $\\sin\\beta=\\frac35$, $\\cos\\beta=\\frac45$이다.\n따라서 $BE=BF\\cos\\beta=65\\cdot\\frac45=52$, $EF=BF\\sin\\beta=65\\cdot\\frac35=39$이다.\n직각삼각형 $BCE$에서 $\\angle CBE=\\alpha$이고 $\\tan\\alpha=\\frac5{12}$이므로 $\\sin\\alpha=\\frac5{13}$, $\\cos\\alpha=\\frac{12}{13}$이다.\n따라서 $BC=BE\\cos\\alpha=52\\cdot\\frac{12}{13}=48$, $CE=BE\\sin\\alpha=52\\cdot\\frac5{13}=20$이다.\n$BE\\perp EF$이고 $BC\\perp CD$이므로 $\\angle FED=\\alpha$이다.\n직각삼각형 $EFD$에서 $EF=39$이므로 $FD=EF\\sin\\alpha=39\\cdot\\frac5{13}=15$, $DE=EF\\cos\\alpha=39\\cdot\\frac{12}{13}=36$이다.\n$CD=CE+DE=20+36=56$이고 $F$는 $AD$ 위에 있으므로 $FG=CD=56$이다.\n$BC=48$이고 $F$의 $BC$ 방향 위치는 $D$에서 $FD$만큼 왼쪽이므로 $BG=BC-FD=48-15=33$이다.\n따라서 $(FG,BG)=(56,33)$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-077",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_TRIG_RATIO",
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/미적분II_125_미분가능을이용한미정계수결정_고2_유형은행1/q10-problem.svg",
    "imageAlt": "직사각형 ABCD와 E∈CD, F∈AD, G∈BC, BE⊥EF, FG⊥BC를 그리고 BF=65·α·β를 표시한다.",
    "imageCaption": "직사각형 ABCD와 E∈CD, F∈AD, G∈BC, BE⊥EF, FG⊥BC를 그리고 BF=65·α·β를 표시한다.",
    "imageSize": "full"
  },
  {
    "id": 11,
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
    "content": "$AB\\perp BC$, $AC\\perp CD$이고 $AB=12$, $BC=5$, $CD=13$이다. $C$는 직선 $AB$ 위쪽에 있고, $D$는 직선 $AC$에 대해 $B$의 반대쪽에 있다. $D$에서 $AB$에 내린 수선의 발을 $H$라 할 때 $(AH,DH)$는? [그림: $A=(0,0)$, $B=(12,0)$, $C=(12,5)$, $D=(7,17)$, $H=(7,0)$으로 배치하여 $AB,BC,AC,CD,AD,DH$를 긋는다. 완성 그림에는 좌표와 미지 길이를 적지 않고 주어진 세 길이와 직각을 표시한다.]",
    "choices": [
      "$(3,12)$",
      "$(4,13)$",
      "$(5,15)$",
      "$(6,16)$",
      "$(7,17)$"
    ],
    "answer": "⑤",
    "solution": "$AB\\perp BC$이므로 직각삼각형 $ABC$에서 피타고라스 정리에 의해 $AC=\\sqrt{12^2+5^2}=\\sqrt{169}=13$이다.\n$AC\\perp CD$이고 $CD=13$이므로 직각삼각형 $ACD$에서 $AD=\\sqrt{13^2+13^2}=13\\sqrt2$이다.\n$\\alpha=\\angle CAB$라 하면 $\\sin\\alpha=\\frac5{13}$, $\\cos\\alpha=\\frac{12}{13}$이다.\n$AC=CD$인 직각삼각형 $ACD$이므로 $\\angle DAC=45^\\circ$이고, $\\beta=\\angle DAC$라 하면 $\\sin\\beta=\\cos\\beta=\\frac1{\\sqrt2}$이다.\n$D$가 직선 $AC$에 대해 $B$의 반대쪽에 있으므로 $\\angle DAB=\\alpha+\\beta$이다.\n코사인 덧셈정리로 $\\cos(\\alpha+\\beta)=\\cos\\alpha\\cos\\beta-\\sin\\alpha\\sin\\beta$이다.\n값을 대입하면 $\\cos(\\alpha+\\beta)=\\frac{12}{13}\\cdot\\frac1{\\sqrt2}-\\frac5{13}\\cdot\\frac1{\\sqrt2}=\\frac7{13\\sqrt2}$이다.\n사인 덧셈정리로 $\\sin(\\alpha+\\beta)=\\sin\\alpha\\cos\\beta+\\cos\\alpha\\sin\\beta=\\frac5{13\\sqrt2}+\\frac{12}{13\\sqrt2}=\\frac{17}{13\\sqrt2}$이다.\n$AH=AD\\cos(\\alpha+\\beta)=13\\sqrt2\\cdot\\frac7{13\\sqrt2}=7$이다.\n$DH=AD\\sin(\\alpha+\\beta)=13\\sqrt2\\cdot\\frac{17}{13\\sqrt2}=17$이다.\n따라서 $(AH,DH)=(7,17)$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-077",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_TRIG_RATIO",
      "CC_SPECIAL_ANGLES"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/미적분II_125_미분가능을이용한미정계수결정_고2_유형은행1/q11-problem.svg",
    "imageAlt": "AB⊥BC, AC⊥CD인 꺾인 두 직각삼각형과 AB 위의 H, DH⊥AB를 표시한다.",
    "imageCaption": "AB⊥BC, AC⊥CD인 꺾인 두 직각삼각형과 AB 위의 H, DH⊥AB를 표시한다.",
    "imageSize": "full"
  },
  {
    "id": 12,
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
    "content": "예각삼각형 $ABC$에서 $\\sin A+\\cos B=\\cos A+\\sin B=\\sqrt{1+\\sqrt3/2}$이다. $(\\sin C,\\tan A+\\tan B+\\tan C-\\tan A\\tan B\\tan C)$는?",
    "choices": [
      "$(\\sqrt3/2,0)$",
      "$(\\sqrt3/2,1)$",
      "$(1/2,0)$",
      "$(1/2,1)$",
      "$(\\sqrt2/2,0)$"
    ],
    "answer": "①",
    "solution": "$k=\\sqrt{1+\\frac{\\sqrt3}{2}}$라 하면 주어진 두 식은 $\\sin A+\\cos B=k$, $\\cos A+\\sin B=k$이다.\n두 식을 각각 제곱하면 $\\sin^2A+2\\sin A\\cos B+\\cos^2B=k^2$와 $\\cos^2A+2\\cos A\\sin B+\\sin^2B=k^2$이다.\n두 식을 더하면 $1+1+2(\\sin A\\cos B+\\cos A\\sin B)=2k^2$이다.\n사인 덧셈정리로 $\\sin A\\cos B+\\cos A\\sin B=\\sin(A+B)$이므로 $2+2\\sin(A+B)=2\\left(1+\\frac{\\sqrt3}{2}\\right)=2+\\sqrt3$이다.\n따라서 $\\sin(A+B)=\\frac{\\sqrt3}{2}$이고, $\\sin C=\\sin(\\pi-(A+B))=\\sin(A+B)=\\frac{\\sqrt3}{2}$이다.\n삼각형이 예각삼각형이므로 $C$는 예각이고, $\\sin C=\\frac{\\sqrt3}{2}$에서 $C=\\frac{\\pi}{3}$이다.\n$A+B=\\pi-C=\\frac{2\\pi}{3}$이므로 $\\tan(A+B)=\\tan\\frac{2\\pi}{3}=-\\sqrt3$이다.\n탄젠트 덧셈정리로 $\\tan(A+B)=\\frac{\\tan A+\\tan B}{1-\\tan A\\tan B}$이므로 $\\tan A+\\tan B=-\\sqrt3(1-\\tan A\\tan B)=\\sqrt3(\\tan A\\tan B-1)$이다.\n$\\tan C=\\tan\\frac{\\pi}{3}=\\sqrt3$을 대입하면 구하는 값은 $\\sqrt3(\\tan A\\tan B-1)+\\sqrt3-\\sqrt3\\tan A\\tan B=0$이다.\n따라서 $\\left(\\sin C,\\tan A+\\tan B+\\tan C-\\tan A\\tan B\\tan C\\right)=\\left(\\frac{\\sqrt3}{2},0\\right)$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-077",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_IDENTITY"
    ],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 13,
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
    "content": "두 직선 $2x-y+3=0$, $mx-y-4=0$이 이루는 예각이 $\\pi/4$가 되도록 하는 모든 실수 $m$의 곱은?",
    "choices": [
      "$-2$",
      "$-1$",
      "$0$",
      "$1$",
      "$2$"
    ],
    "answer": "②",
    "solution": "두 직선의 기울기는 각각 $2$, $m$이다.\n두 직선이 이루는 예각을 $\\theta$라 하면 탄젠트 공식으로 $\\tan\\theta=\\left|\\frac{m-2}{1+2m}\\right|$이다.\n$\\theta=\\frac\\pi4$이므로 $\\tan\\theta=1$이고, $\\left|\\frac{m-2}{1+2m}\\right|=1$이다.\n양변을 제곱하면 $(m-2)^2=(1+2m)^2$이다.\n전개하면 $m^2-4m+4=1+4m+4m^2$이다.\n정리하면 $3m^2+8m-3=0$이다.\n이차방정식의 근과 계수의 관계에서 두 근의 곱은 $\\frac{-3}{3}=-1$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-077",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_LINE_SLOPE_TANGENT"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
