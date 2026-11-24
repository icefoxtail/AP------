window.examTitle = "미적분II_133_로그함수의합성함수미분법_고2_유형은행1";

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
    "content": "$f(x)=\\ln(2x^2+7)$에 대해 $f'(1)$은?",
    "choices": [
      "$4/9$",
      "$5/9$",
      "$6/9$",
      "$7/9$",
      "$8/9$"
    ],
    "answer": "①",
    "solution": "$f(x)=\\ln(2x^2+7)$에서 진수 $2x^2+7$의 도함수는 $4x$이다. (합성함수의 미분법)\n$f'(x)=\\dfrac{1}{2x^2+7}\\cdot4x=\\dfrac{4x}{2x^2+7}$이다.\n$x=1$을 대입하면 $f'(1)=\\dfrac{4\\cdot1}{2\\cdot1^2+7}$이다.\n분모를 계산하면 $f'(1)=\\dfrac{4}{9}$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-071",
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
    "content": "$f(x)=(x^2+2)\\ln(ax)$이고 $a>0$이다. $f'(1)=7$일 때 $a$는?",
    "choices": [
      "$1$",
      "$e$",
      "$e^2$",
      "$e^3$",
      "$e^4$"
    ],
    "answer": "③",
    "solution": "$f(x)=(x^2+2)\\ln(ax)$에 곱의 미분법을 적용한다.\n$f'(x)=2x\\ln(ax)+(x^2+2)\\cdot\\dfrac{1}{x}$이다. ($(\\ln(ax))'=\\frac1x$)\n$x=1$을 대입하면 $f'(1)=2\\ln a+3$이다.\n$f'(1)=7$이므로 $2\\ln a+3=7$이다.\n$2\\ln a=4$에서 $\\ln a=2$이다.\n따라서 $a=e^2$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-071",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_POLYNOMIAL_DERIVATIVE_RULE",
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
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
    "content": "$f(x)=[\\ln(x+2)+1]^3$에 대해 $f'(e-2)$는?",
    "choices": [
      "$4/e$",
      "$8/e$",
      "$12/e$",
      "$16/e$",
      "$20/e$"
    ],
    "answer": "③",
    "solution": "$f(x)=[\\ln(x+2)+1]^3$에 합성함수의 미분법을 적용한다.\n$f'(x)=3[\\ln(x+2)+1]^2\\cdot\\dfrac{1}{x+2}$이다.\n$x=e-2$를 대입하면 $\\ln(x+2)=\\ln e=1$이다.\n따라서 $f'(e-2)=3(1+1)^2\\cdot\\dfrac{1}{e}$이다.\n$3\\cdot4\\cdot\\dfrac1e=\\dfrac{12}{e}$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-071",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
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
    "content": "$x>0$에서 $f(x)=(\\ln x)^3+e^{2x}$이다. $f'(1)$은?",
    "choices": [
      "$e^2/2$",
      "$e^2$",
      "$3e^2/2$",
      "$2e^2$",
      "$5e^2/2$"
    ],
    "answer": "④",
    "solution": "$f(x)=(\\ln x)^3+e^{2x}$를 항별로 미분한다.\n$(\\ln x)^3$의 도함수는 $3(\\ln x)^2\\cdot\\dfrac1x$이다. (합성함수의 미분법)\n$e^{2x}$의 도함수는 $2e^{2x}$이다. (합성함수의 미분법)\n따라서 $f'(x)=\\dfrac{3(\\ln x)^2}{x}+2e^{2x}$이다.\n$x=1$을 대입하면 $\\ln1=0$이므로 첫 항은 $0$이다.\n$f'(1)=0+2e^2=2e^2$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-071",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
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
    "content": "$x>1$에서 $f(x)=\\ln(\\log_3 x)$이다. $f'(e^2)$는?",
    "choices": [
      "$\\frac1{2e^2}$",
      "$\\frac1{e^2}$",
      "$\\frac3{2e^2}$",
      "$\\frac2{e^2}$",
      "$\\frac5{2e^2}$"
    ],
    "answer": "①",
    "solution": "$\\log_3 x=\\dfrac{\\ln x}{\\ln3}$이므로 $f(x)=\\ln\\left(\\dfrac{\\ln x}{\\ln3}\\right)$이다.\n로그의 성질로 $f(x)=\\ln(\\ln x)-\\ln(\\ln3)$이다.\n$\\ln(\\ln x)$를 합성함수의 미분법으로 미분하면 $\\dfrac{1}{\\ln x}\\cdot\\dfrac1x$이다.\n따라서 $f'(x)=\\dfrac{1}{x\\ln x}$이다. ($\\ln(\\ln3)$은 상수)\n$x=e^2$를 대입하면 $f'(e^2)=\\dfrac{1}{e^2\\ln(e^2)}$이다.\n$\\ln(e^2)=2$이므로 $f'(e^2)=\\dfrac{1}{2e^2}$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-071",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
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
    "content": "$x>2$에서 $f(x)=\\ln(x^2-4)$이다. $\\sum_{n=3}^{6} f'(n)/n$은?",
    "choices": [
      "$917/1680$",
      "$1017/1680$",
      "$1117/1680$",
      "$1217/1680$",
      "$1317/1680$"
    ],
    "answer": "④",
    "solution": "$f(x)=\\ln(x^2-4)$에 합성함수의 미분법을 적용한다.\n$f'(x)=\\dfrac{1}{x^2-4}\\cdot2x=\\dfrac{2x}{x^2-4}$이다.\n따라서 $\\dfrac{f'(n)}{n}=\\dfrac{2}{n^2-4}$이다.\n부분분수로 분해하면 $\\dfrac{2}{(n-2)(n+2)}=\\dfrac12\\left(\\dfrac{1}{n-2}-\\dfrac{1}{n+2}\\right)$이다.\n$n=3,4,5,6$에 대해 합을 쓰면 $\\sum_{n=3}^{6}\\dfrac{f'(n)}n=\\dfrac12\\left[\\left(1-\\dfrac15\\right)+\\left(\\dfrac12-\\dfrac16\\right)+\\left(\\dfrac13-\\dfrac17\\right)+\\left(\\dfrac14-\\dfrac18\\right)\\right]$이다.\n괄호 안을 정리하면 $\\dfrac12\\left(1+\\dfrac12+\\dfrac13+\\dfrac14-\\dfrac15-\\dfrac16-\\dfrac17-\\dfrac18\\right)$이다.\n분모를 $840$으로 통일하면 $\\dfrac12\\cdot\\dfrac{840+420+280+210-168-140-120-105}{840}$이다.\n분자를 계산하면 $840+420+280+210-168-140-120-105=1217$이다.\n따라서 합은 $\\dfrac12\\cdot\\dfrac{1217}{840}=\\dfrac{1217}{1680}$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-071",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_TELESCOPING_SERIES",
      "CC_SERIES_SUM"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
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
    "content": "$f(x)=e^{2x},\\ g(x)=\\ln\\lvert x^3-5\\rvert$이다. $(f\\circ g)'(-1)$은?",
    "choices": [
      "$-54$",
      "$-48$",
      "$-42$",
      "$-36$",
      "$-30$"
    ],
    "answer": "④",
    "solution": "$g(x)=\\ln\\lvert x^3-5\\rvert$이므로 $(f\\circ g)(x)=e^{2g(x)}$이다.\n$e^{2\\ln\\lvert x^3-5\\rvert}=\\lvert x^3-5\\rvert^2=(x^3-5)^2$이다. (로그의 성질)\n따라서 $(f\\circ g)(x)=(x^3-5)^2$이다.\n합성함수의 미분법으로 미분하면 $(f\\circ g)'(x)=2(x^3-5)\\cdot3x^2$이다.\n정리하면 $(f\\circ g)'(x)=6x^2(x^3-5)$이다.\n$x=-1$을 대입하면 $x^3-5=(-1)^3-5=-6$이다.\n따라서 $(f\\circ g)'(-1)=6\\cdot1\\cdot(-6)=-36$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-071",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_FUNCTION_COMPOSITION",
      "CC_ABSOLUTE_VALUE_FUNCTION"
    ],
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
    "content": "$f(x)=(\\ln x)/x^3$일 때 $\\lim_{h\\to0}[f(e+2h)-f(e-h)]/h$는?",
    "choices": [
      "$-8/e^4$",
      "$-6/e^4$",
      "$-4/e^4$",
      "$-2/e^4$",
      "$0$"
    ],
    "answer": "②",
    "solution": "극한을 미분계수의 정의를 쓰기 좋은 꼴로 나눈다.\n$\\lim_{h\\to0}\\dfrac{f(e+2h)-f(e-h)}h=\\lim_{h\\to0}\\dfrac{f(e+2h)-f(e)}h-\\lim_{h\\to0}\\dfrac{f(e-h)-f(e)}h$이다.\n첫째 항은 $\\lim_{h\\to0}2\\cdot\\dfrac{f(e+2h)-f(e)}{2h}=2f'(e)$이다.\n둘째 항은 $t=-h$로 놓으면 $\\lim_{t\\to0}\\dfrac{f(e+t)-f(e)}{-t}=-f'(e)$이다.\n따라서 주어진 극한은 $2f'(e)-(-f'(e))=3f'(e)$이다.\n$f(x)=\\dfrac{\\ln x}{x^3}$에 몫의 미분법을 적용하면 $f'(x)=\\dfrac{\\frac1x\\cdot x^3-(\\ln x)\\cdot3x^2}{x^6}$이다.\n약분하면 $f'(x)=\\dfrac{x^2-3x^2\\ln x}{x^6}=\\dfrac{1-3\\ln x}{x^4}$이다.\n$x=e$를 대입하면 $\\ln e=1$이므로 $f'(e)=\\dfrac{1-3}{e^4}=-\\dfrac{2}{e^4}$이다.\n따라서 극한값은 $3\\left(-\\dfrac2{e^4}\\right)=-\\dfrac6{e^4}$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-071",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_DIFFERENCE_QUOTIENT_SCALING"
    ],
    "conditionKeys": [],
    "integrationPattern": "REINTERPRETATION"
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
    "content": "$f(x)=3^x/\\ln3$이고 $g$는 미분가능하다. $\\lim_{h\\to0}[g(1+3h)-g(1)]/h=6,\\ (f\\circ g)'(1)=14$일 때 $g(1)$은?",
    "choices": [
      "$\\log_3 3$",
      "$\\log_3 4$",
      "$\\log_3 5$",
      "$\\log_3 6$",
      "$\\log_3 7$"
    ],
    "answer": "⑤",
    "solution": "$\\lim_{h\\to0}\\dfrac{g(1+3h)-g(1)}h=6$을 미분계수의 정의로 바꾼다.\n$\\dfrac{g(1+3h)-g(1)}h=3\\cdot\\dfrac{g(1+3h)-g(1)}{3h}$이므로 극한은 $3g'(1)$이다.\n$3g'(1)=6$에서 $g'(1)=2$이다.\n$f(x)=\\dfrac{3^x}{\\ln3}$의 도함수는 $f'(x)=\\dfrac{3^x\\ln3}{\\ln3}=3^x$이다.\n합성함수의 미분법으로 $(f\\circ g)'(1)=f'(g(1))g'(1)$이다.\n$(f\\circ g)'(1)=3^{g(1)}\\cdot2=14$이다.\n양변을 $2$로 나누면 $3^{g(1)}=7$이다.\n지수와 로그의 관계에서 $g(1)=\\log_3 7$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-071",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_FUNCTION_COMPOSITION",
      "CC_DIFFERENCE_QUOTIENT_SCALING"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
