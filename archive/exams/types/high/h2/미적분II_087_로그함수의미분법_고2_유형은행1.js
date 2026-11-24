window.examTitle = "미적분II_087_로그함수의미분법_고2_유형은행1";

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
    "content": "함수 $f(x)=2x\\ln x$에 대하여 $f'(e)$의 값은?",
    "choices": [
      "$0$",
      "$2$",
      "$4$",
      "$6$",
      "$8$"
    ],
    "answer": "③",
    "solution": "$f(x)=2x\\ln x$에서 곱의 미분법을 적용한다.\n$f'(x)=2\\ln x+2x\\cdot\\frac1x=2\\ln x+2$이다.\n$x=e$를 대입하면 $f'(e)=2\\ln e+2=2\\cdot1+2=4$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-070",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_POLYNOMIAL_DERIVATIVE_RULE"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "함수 $f(x)=x^4\\ln x$에 대하여 $\\frac{f'(e^2)}{e^6}$의 값은?",
    "choices": [
      "$3$",
      "$5$",
      "$7$",
      "$9$",
      "$11$"
    ],
    "answer": "④",
    "solution": "$f(x)=x^4\\ln x$에서 곱의 미분법을 적용한다.\n$f'(x)=4x^3\\ln x+x^4\\cdot\\frac1x=x^3(4\\ln x+1)$이다.\n$x=e^2$에서 $x^3=e^6$, $\\ln e^2=2$이므로 $f'(e^2)=e^6(4\\cdot2+1)=9e^6$이다.\n따라서 $\\frac{f'(e^2)}{e^6}=\\frac{9e^6}{e^6}=9$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-070",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_POLYNOMIAL_DERIVATIVE_RULE"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "함수 $f(x)=e^{2x+1}\\ln(x^3)$에 대하여 $f'(1)$의 값은?",
    "choices": [
      "$\\tfrac12e^3$",
      "$e^3$",
      "$\\tfrac32e^3$",
      "$2e^3$",
      "$3e^3$"
    ],
    "answer": "⑤",
    "solution": "$x>0$에서 로그의 성질로 $\\ln(x^3)=3\\ln x$이다.\n$f(x)=e^{2x+1}\\cdot3\\ln x$에 곱의 미분법과 합성함수의 미분법을 적용한다.\n$f'(x)=3\\left(2e^{2x+1}\\ln x+e^{2x+1}\\cdot\\frac1x\\right)=e^{2x+1}\\left(6\\ln x+\\frac3x\\right)$이다.\n$x=1$을 대입하면 $\\ln1=0$이므로 $f'(1)=e^3\\left(0+3\\right)=3e^3$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-070",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "함수 $f(x)=4^x\\log_3 x$에 대하여 $f'(1)$의 값은?",
    "choices": [
      "$\\frac4{\\ln3}$",
      "$\\frac5{\\ln3}$",
      "$\\frac6{\\ln3}$",
      "$\\frac7{\\ln3}$",
      "$\\frac8{\\ln3}$"
    ],
    "answer": "①",
    "solution": "$f(x)=4^x\\log_3 x$에서 곱의 미분법을 적용한다.\n$f'(x)=4^x\\ln4\\cdot\\log_3 x+4^x\\cdot\\frac1{x\\ln3}$이다.\n$x=1$에서 $\\log_3 1=0$이므로 첫 항은 $0$이다.\n$f'(1)=4^1\\cdot\\frac1{1\\cdot\\ln3}=\\frac4{\\ln3}$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-070",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "함수 $f(x)=\\ln(2x)+\\ln(3x)+\\cdots+\\ln(13x)$에 대하여 $f'(\\frac14)$의 값은?",
    "choices": [
      "$36$",
      "$40$",
      "$44$",
      "$48$",
      "$52$"
    ],
    "answer": "④",
    "solution": "$\\ln(kx)=\\ln k+\\ln x$이므로 $f(x)=(\\ln2+\\ln3+\\cdots+\\ln13)+12\\ln x$이다.\n$k=2$부터 $k=13$까지 항이 $12$개이므로 $\\ln x$의 계수는 $12$이다.\n$f'(x)=12\\cdot\\frac1x=\\frac{12}x$이다.\n$x=\\frac14$을 대입하면 $f'\\left(\\frac14\\right)=12\\cdot4=48$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-070",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
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
    "content": "함수 $f(x)=(x+a)\\ln x$에 대하여 $f'(e^2)=7$일 때, 상수 $a$의 값은?",
    "choices": [
      "$e^2$",
      "$2e^2$",
      "$3e^2$",
      "$\\tfrac72e^2$",
      "$4e^2$"
    ],
    "answer": "⑤",
    "solution": "$f(x)=(x+a)\\ln x$에서 곱의 미분법을 적용한다.\n$f'(x)=1\\cdot\\ln x+(x+a)\\cdot\\frac1x=\\ln x+1+\\frac ax$이다.\n$f'(e^2)=7$이므로 $\\ln e^2+1+\\frac a{e^2}=7$이다.\n$2+1+\\frac a{e^2}=7$에서 $\\frac a{e^2}=4$이므로 $a=4e^2$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-070",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
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
    "content": "다음 중 도함수를 잘못 나타낸 것은?",
    "choices": [
      "$y=7^{x+1},\\quad y'=7^{x+1}\\ln7$",
      "$y=\\log_3(x^2),\\quad y'=\\frac1{x\\ln3}$",
      "$y=e^{2x}\\ln x,\\quad y'=e^{2x}(2\\ln x+1/x)$",
      "$y=(x^2+2)e^x,\\quad y'=(x^2+2x+2)e^x$",
      "$y=\\ln(9/x),\\quad y'=-1/x$"
    ],
    "answer": "②",
    "solution": "각 보기의 도함수를 직접 계산해 확인한다.\n① $y=7^{x+1}$에서 $y'=7^{x+1}\\ln7$이므로 옳다.\n② $y=\\log_3(x^2)=2\\log_3 x$에서 $y'=2\\cdot\\frac1{x\\ln3}=\\frac2{x\\ln3}$이므로 $\\frac1{x\\ln3}$은 틀렸다.\n③ $y=e^{2x}\\ln x$에서 $y'=2e^{2x}\\ln x+e^{2x}\\cdot\\frac1x=e^{2x}\\left(2\\ln x+\\frac1x\\right)$이므로 옳다.\n④ $y=(x^2+2)e^x$에서 $y'=2xe^x+(x^2+2)e^x=(x^2+2x+2)e^x$이므로 옳다.\n⑤ $y=\\ln\\frac9x=\\ln9-\\ln x$에서 $y'=-\\frac1x$이므로 옳다.\n주의: ②는 $\\log_3(x^2)=2\\log_3 x$로 고친 뒤 미분해야 한다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-070",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_POLYNOMIAL_DERIVATIVE_RULE"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "두 함수 $f(x)=e^{2x}(x^2-2x+1)$, $g(x)=(4x^2-2)\\log_3 x$에 대하여 $f'(1)+g'(1)$의 값은?",
    "choices": [
      "$\\frac1{2\\ln3}$",
      "$\\frac1{\\ln3}$",
      "$\\frac2{\\ln3}$",
      "$\\frac3{\\ln3}$",
      "$\\frac4{\\ln3}$"
    ],
    "answer": "③",
    "solution": "$f(x)=e^{2x}(x^2-2x+1)=e^{2x}(x-1)^2$으로 인수분해한다.\n곱의 미분법으로 $f'(x)=2e^{2x}(x-1)^2+e^{2x}\\cdot2(x-1)$이다.\n$f'(x)=2e^{2x}(x-1)\\{(x-1)+1\\}=2e^{2x}x(x-1)$이므로 $f'(1)=0$이다.\n$g(x)=(4x^2-2)\\log_3 x$에 곱의 미분법을 적용하면 $g'(x)=8x\\log_3 x+\\frac{4x^2-2}{x\\ln3}$이다.\n$x=1$에서 $\\log_3 1=0$이므로 $g'(1)=\\frac{4-2}{1\\cdot\\ln3}=\\frac2{\\ln3}$이다.\n따라서 $f'(1)+g'(1)=0+\\frac2{\\ln3}=\\frac2{\\ln3}$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-070",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_POLYNOMIAL_DERIVATIVE_RULE"
    ],
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
    "content": "함수 $f(x)=5^x$의 역함수를 $g(x)$라 할 때, $g'(\\log_5\\sqrt e)$의 값은?",
    "choices": [
      "$\\tfrac12$",
      "$1$",
      "$\\tfrac43$",
      "$\\tfrac32$",
      "$2$"
    ],
    "answer": "⑤",
    "solution": "$f(x)=5^x$의 역함수는 $g(x)=\\log_5 x$이다.\n로그함수의 미분법으로 $g'(x)=\\frac1{x\\ln5}$이다.\n$x=\\log_5\\sqrt e=\\log_5 e^{1/2}=\\frac1{2\\ln5}$이다.\n$g'\\left(\\log_5\\sqrt e\\right)=\\frac1{\\frac1{2\\ln5}\\cdot\\ln5}=\\frac1{\\frac12}=2$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-070",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_INVERSE_FUNCTION"
    ],
    "conditionKeys": [],
    "integrationPattern": "REINTERPRETATION"
  },
  {
    "id": 10,
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
    "content": "함수 $f(x)=x\\ln x$에 대하여 구간 $[1,e^2]$에서의 평균변화율과 $x=a$에서의 순간변화율이 같을 때, $a$의 값은?",
    "choices": [
      "$e^{\\frac{e^2+1}{e^2-1}}$",
      "$e^{3/2}$",
      "$e^2$",
      "$e^{5/2}$",
      "$e^3$"
    ],
    "answer": "①",
    "solution": "$f(x)=x\\ln x$에서 $f(e^2)=e^2\\ln e^2=2e^2$, $f(1)=1\\cdot\\ln1=0$이다.\n평균변화율은 $\\frac{f(e^2)-f(1)}{e^2-1}=\\frac{2e^2-0}{e^2-1}=\\frac{2e^2}{e^2-1}$이다.\n$f'(x)=\\ln x+1$이므로 $x=a$에서의 순간변화율은 $f'(a)=\\ln a+1$이다.\n두 값이 같으므로 $\\ln a+1=\\frac{2e^2}{e^2-1}$이다.\n$\\ln a=\\frac{2e^2}{e^2-1}-1=\\frac{2e^2-(e^2-1)}{e^2-1}=\\frac{e^2+1}{e^2-1}$이다.\n따라서 $a=e^{\\frac{e^2+1}{e^2-1}}$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-070",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_AVERAGE_RATE_OF_CHANGE",
      "CC_MEAN_VALUE_THEOREM_FORMULA"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 11,
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
    "content": "$x>0$에서 $f(x)=\\lim_{n\\to\\infty}2n(x^{1/n}-1)$이라 할 때, $f'(4)$의 값은?",
    "choices": [
      "$\\tfrac14$",
      "$\\tfrac12$",
      "$\\tfrac34$",
      "$1$",
      "$2$"
    ],
    "answer": "②",
    "solution": "$x^{1/n}=e^{\\frac{\\ln x}{n}}$이므로 $t=\\frac{\\ln x}{n}$이라 하면 $x^{1/n}-1=e^{t}-1$이다.\n$2n(x^{1/n}-1)=2\\ln x\\cdot\\frac{e^t-1}{t}$로 변형된다.\n$n\\to\\infty$일 때 $t\\to0$이고 $\\lim_{t\\to0}\\frac{e^t-1}{t}=1$이므로 $f(x)=2\\ln x$이다.\n$f'(x)=\\frac2x$이므로 $f'(4)=\\frac24=\\frac12$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-070",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_FUNCTION_LIMIT"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 12,
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
    "content": "함수 $f(x)=\\lim_{n\\to\\infty}(1-\\frac{2x}{n})^n$에 대하여 $\\lim_{x\\to0}\\frac{f'(x)+2}{5x}$의 값은?",
    "choices": [
      "$-\\tfrac45$",
      "$-\\tfrac25$",
      "$\\tfrac45$",
      "$1$",
      "$2$"
    ],
    "answer": "③",
    "solution": "$\\lim_{n\\to\\infty}\\left(1-\\frac{2x}{n}\\right)^n=e^{-2x}$이므로 $f(x)=e^{-2x}$이다.\n합성함수의 미분법으로 $f'(x)=-2e^{-2x}$이다.\n구하는 극한은 $\\lim_{x\\to0}\\frac{-2e^{-2x}+2}{5x}=\\frac25\\lim_{x\\to0}\\frac{1-e^{-2x}}{x}$이다.\n$\\lim_{x\\to0}\\frac{e^{-2x}-1}{-2x}=1$이므로 $\\lim_{x\\to0}\\frac{1-e^{-2x}}{x}=2$이다.\n따라서 $\\frac25\\cdot2=\\frac45$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-070",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_FUNCTION_LIMIT",
      "CC_DERIVATIVE_DEFINITION_LIMIT"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 13,
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
    "content": "모든 실수 $x$에서 $f(-x)=-f(x)$인 삼차함수 $f$에 대하여 $g(x)=f(x)(\\ln x+1)$ $(x>0)$이라 하자. $g'(1)=14$, $g'(e)=14e^2+9$일 때, $f(1)$의 값은?",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "④",
    "solution": "$f(-x)=-f(x)$인 삼차함수는 $f(x)=ax^3+bx$ ($a\\ne0$) 꼴이다.\n$g(x)=(ax^3+bx)(\\ln x+1)$에 곱의 미분법을 적용하면 $g'(x)=(3ax^2+b)(\\ln x+1)+(ax^3+bx)\\cdot\\frac1x$이다.\n정리하면 $g'(x)=(3ax^2+b)(\\ln x+1)+ax^2+b$이다.\n$g'(1)=14$에서 $\\ln1=0$이므로 $(3a+b)\\cdot1+2b=4a+2b=14$이다.\n$g'(e)=14e^2+9$에서 $\\ln e=1$이므로 $(3ae^2+b)\\cdot2+(ae^2+b)=7ae^2+3b=14e^2+9$이다.\n$2a+b=7$에서 $b=7-2a$를 대입하면 $7ae^2+3(7-2a)=14e^2+9$이다.\n$7ae^2-6a=14e^2-12$에서 $a(7e^2-6)=2(7e^2-6)$이므로 $a=2$이다.\n$b=7-4=3$이므로 $f(x)=2x^3+3x$이고 $f(1)=2+3=5$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-070",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_FUNCTION_SYMMETRY",
      "CC_CUBIC_POLYNOMIAL_COEFFICIENTS_RECOVERY"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
