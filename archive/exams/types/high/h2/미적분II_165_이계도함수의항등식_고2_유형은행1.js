window.examTitle = "미적분II_165_이계도함수의항등식_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "여러 가지 미분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-05",
    "standardUnit": "여러 가지 미분법",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 미분법"
    ],
    "wide": false,
    "content": "$f(x)=e^{2x}\\sin(3x)$가 모든 실수 $x$에 대하여 $f''(x)-4f'(x)+af(x)=0$을 만족한다. 상수 $a$의 값은?",
    "choices": [
      "$5$",
      "$7$",
      "$9$",
      "$11$",
      "$13$"
    ],
    "answer": "⑤",
    "solution": "곱의 미분법과 합성함수의 미분법으로 $f'(x)=e^{2x}(2\\sin 3x+3\\cos 3x)$이다.\n한 번 더 미분하면 $f''(x)=2e^{2x}(2\\sin 3x+3\\cos 3x)+e^{2x}(6\\cos 3x-9\\sin 3x)$이다.\n동류항을 정리하면 $f''(x)=e^{2x}(-5\\sin 3x+12\\cos 3x)$이다.\n$f''-4f'+af=e^{2x}[(-5-8+a)\\sin 3x+(12-12)\\cos 3x]$이다.\n코사인 항이 자동으로 소거되므로 사인 항의 계수에서 $a-13=0$, 즉 $a=13$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-176",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_SECOND_ORDER",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
      "COND_UNIVERSAL_INPUTS"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 2,
    "category": "여러 가지 미분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-05",
    "standardUnit": "여러 가지 미분법",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 미분법"
    ],
    "wide": false,
    "content": "$y=e^{-2x}\\cos x$에 대하여 $y''+ay'+5y=0$이 모든 실수 $x$에서 성립한다. 상수 $a$의 값은?",
    "choices": [
      "$0$",
      "$1$",
      "$2$",
      "$3$",
      "$4$"
    ],
    "answer": "⑤",
    "solution": "곱의 미분법과 합성함수의 미분법으로 $y'=e^{-2x}(-2\\cos x-\\sin x)$이다.\n다시 미분하면 $y''=-2e^{-2x}(-2\\cos x-\\sin x)+e^{-2x}(2\\sin x-\\cos x)$이다.\n정리하면 $y''=e^{-2x}(3\\cos x+4\\sin x)$이다.\n$y''+ay'+5y=e^{-2x}[(3-2a+5)\\cos x+(4-a)\\sin x]$이다.\n모든 $x$에서 $0$이려면 두 계수가 모두 $0$이어야 하므로 $4-a=0$에서 $a=4$이다.\n$a=4$이면 $3-2a+5=8-8=0$도 성립한다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-176",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_SECOND_ORDER",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
      "COND_UNIVERSAL_INPUTS"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 3,
    "category": "여러 가지 미분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-05",
    "standardUnit": "여러 가지 미분법",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 미분법"
    ],
    "wide": false,
    "content": "양수 $a$에 대해 $y=e^{ax}\\cos(2x)$가 모든 실수 $x$에서 $y''-2ay'+13y=0$을 만족한다. $a$의 값은?",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "answer": "②",
    "solution": "$y'=ae^{ax}\\cos 2x-2e^{ax}\\sin 2x=e^{ax}(a\\cos 2x-2\\sin 2x)$이다.\n다시 미분하면 $y''=ae^{ax}(a\\cos 2x-2\\sin 2x)+e^{ax}(-2a\\sin 2x-4\\cos 2x)$이다.\n정리하면 $y''=e^{ax}[(a^2-4)\\cos 2x-4a\\sin 2x]$이다.\n$y''-2ay'+13y=e^{ax}[(a^2-4-2a^2+13)\\cos 2x+(-4a+4a)\\sin 2x]$이다.\n사인 항은 소거되고 $9-a^2=0$이 남는다.\n$a>0$이므로 $a=3$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-176",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_SECOND_ORDER",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
      "COND_POSITIVE",
      "COND_UNIVERSAL_INPUTS"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 4,
    "category": "여러 가지 미분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-05",
    "standardUnit": "여러 가지 미분법",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 미분법"
    ],
    "wide": false,
    "content": "$f(x)=e^{-x}\\sin(3x)$가 모든 실수 $x$에 대하여 $f''(x)+af'(x)+bf(x)=0$을 만족한다. $ab$의 값은?",
    "choices": [
      "$0$",
      "$5$",
      "$10$",
      "$15$",
      "$20$"
    ],
    "answer": "⑤",
    "solution": "$f'(x)=-e^{-x}\\sin 3x+3e^{-x}\\cos 3x=e^{-x}(-\\sin 3x+3\\cos 3x)$이다.\n다시 미분하면 $f''=-e^{-x}(-\\sin 3x+3\\cos 3x)+e^{-x}(-3\\cos 3x-9\\sin 3x)$이다.\n정리하면 $f''=e^{-x}(-8\\sin 3x-6\\cos 3x)$이다.\n$f''+af'+bf=e^{-x}[(-8-a+b)\\sin 3x+(-6+3a)\\cos 3x]$이다.\n$e^{-x}>0$이므로 대괄호가 항등적으로 $0$이다.\n코사인 계수에서 $-6+3a=0$이므로 $a=2$이다.\n사인 계수에서 $-8-2+b=0$이므로 $b=10$이다.\n따라서 $ab=2\\cdot 10=20$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-176",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_SECOND_ORDER",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
      "COND_UNIVERSAL_INPUTS"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 5,
    "category": "여러 가지 미분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-05",
    "standardUnit": "여러 가지 미분법",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 미분법"
    ],
    "wide": false,
    "content": "$0$을 포함하는 열린구간에서 미분가능한 함수 $f$가 $f'(x)=2+3[f(x)]^2,\\ f(0)=2$를 만족한다. $g(x)=\\ln|f'(x)|$일 때 $g'(0)$의 값은?",
    "choices": [
      "$8$",
      "$10$",
      "$12$",
      "$14$",
      "$16$"
    ],
    "answer": "③",
    "solution": "$f'(x)=2+3\\{f(x)\\}^2$에서 $x=0$을 대입하면 $f'(0)=2+3\\cdot 2^2=14$이다.\n$f'>0$이므로 $g(x)=\\ln f'(x)$로 쓸 수 있다.\n합성함수의 미분법으로 $f''(x)=6f(x)f'(x)$이다.\n$x=0$에서 $f''(0)=6\\cdot 2\\cdot 14=168$이다.\n합성함수와 로그함수의 미분법으로 $g'(x)=\\frac{f''(x)}{f'(x)}$이다.\n따라서 $g'(0)=\\frac{168}{14}=12$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-176",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_SECOND_ORDER",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION",
      "CC_FUNCTION_COMPOSITION"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 6,
    "category": "여러 가지 미분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-05",
    "standardUnit": "여러 가지 미분법",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 미분법"
    ],
    "wide": false,
    "content": "$f(x)=(ax+b)\\sin x$가 $f'(\\pi)=0$을 만족하고, 모든 실수 $x$에서 $f(x)+f''(x)=\\cos x$이다. $\\tan(ab)$의 값은?",
    "choices": [
      "$-2$",
      "$-\\sqrt3$",
      "$-\\sqrt2$",
      "$-1$",
      "$-\\frac{\\sqrt3}{3}$"
    ],
    "answer": "④",
    "solution": "$f'(x)=a\\sin x+(ax+b)\\cos x$이다.\n다시 미분하면 $f''(x)=a\\cos x+a\\cos x-(ax+b)\\sin x=2a\\cos x-(ax+b)\\sin x$이다.\n$f+f''=(ax+b)\\sin x+2a\\cos x-(ax+b)\\sin x=2a\\cos x$이다.\n$2a\\cos x=\\cos x$가 항등식이므로 $a=\\frac12$이다.\n$f'(\\pi)=a\\sin\\pi+(a\\pi+b)\\cos\\pi=-(a\\pi+b)=0$이다.\n따라서 $b=-a\\pi=-\\frac\\pi2$이고 $ab=-\\frac\\pi4$이다.\n$\\tan\\left(-\\frac\\pi4\\right)=-1$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-176",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_SECOND_ORDER",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
      "COND_UNIVERSAL_INPUTS"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 7,
    "category": "여러 가지 미분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-05",
    "standardUnit": "여러 가지 미분법",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 미분법"
    ],
    "wide": false,
    "content": "미분가능한 두 함수 $f,g$에 대해 $g(x)\\ne0$이다. 도함수의 정의로 $\\frac1{g(x)}$의 도함수를 구한 뒤 곱의 미분법을 적용할 때, $y=\\frac{f(x)}{[g(x)]^2}$의 도함수는?",
    "choices": [
      "$\\frac{f'(x)g(x)-2f(x)g'(x)}{[g(x)]^3}$",
      "$\\frac{f'(x)g(x)-f(x)g'(x)}{[g(x)]^3}$",
      "$\\frac{f'(x)g(x)+2f(x)g'(x)}{[g(x)]^3}$",
      "$\\frac{2f'(x)g(x)-f(x)g'(x)}{[g(x)]^3}$",
      "$\\frac{2f'(x)g(x)+f(x)g'(x)}{[g(x)]^3}$"
    ],
    "answer": "①",
    "solution": "$u(x)=\\frac1{g(x)}$라 하고 도함수의 정의를 쓰면 $u'(x)=\\lim_{h\\to0}\\frac1h\\left(\\frac1{g(x+h)}-\\frac1{g(x)}\\right)$이다.\n통분하면 $\\frac1h\\cdot\\frac{g(x)-g(x+h)}{g(x+h)g(x)}=-\\frac1{g(x+h)g(x)}\\cdot\\frac{g(x+h)-g(x)}h$이다.\n$g$가 연속이고 미분가능하므로 $u'(x)=-\\frac{g'(x)}{\\{g(x)\\}^2}$이다.\n$y=f\\cdot u^2$이므로 곱의 미분법으로 $y'=f'u^2+f\\cdot 2uu'$이다.\n대입하면 $y'=\\frac{f'}{g^2}-\\frac{2fg'}{g^3}$이다.\n통분하면 $y'=\\frac{f'g-2fg'}{g^3}$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-176",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_SECOND_ORDER",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT"
    ],
    "conditionKeys": [
      "COND_NONZERO"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 8,
    "category": "여러 가지 미분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-05",
    "standardUnit": "여러 가지 미분법",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 미분법"
    ],
    "wide": false,
    "content": "$f(x)=\\frac{5x}{x^2+4}$이다. $A=\\lim_{x\\to1}\\frac{f(x)-1}{x^2-1}$, $B=\\lim_{x\\to1}\\frac{[f(x)]^2-1}{x-1}$, $C=\\lim_{h\\to0}\\frac{f(1+3h)-f(1-2h)}h$일 때 $A+B+C$의 값은?",
    "choices": [
      "$4$",
      "$\\frac{9}{2}$",
      "$5$",
      "$\\frac{11}{2}$",
      "$6$"
    ],
    "answer": "②",
    "solution": "몫의 미분법으로 $f'(x)=\\frac{5(x^2+4)-5x\\cdot 2x}{(x^2+4)^2}=\\frac{20-5x^2}{(x^2+4)^2}$이다.\n$f(1)=\\frac55=1$, $f'(1)=\\frac{15}{25}=\\frac35$이다.\n$A$는 $x^2-1=(x-1)(x+1)$로 인수분해하면 $A=f'(1)\\cdot\\frac1{1+1}=\\frac35\\cdot\\frac12=\\frac3{10}$이다.\n$[f(x)]^2-1=(f(x)-1)(f(x)+1)$이므로 $B=f'(1)\\cdot(f(1)+1)=\\frac35\\cdot 2=\\frac65$이다.\n$C$의 분자를 정리하면 $f(1+3h)-f(1-2h)=\\{f(1+3h)-f(1)\\}-\\{f(1-2h)-f(1)\\}$이다.\n$h$로 나누면 $3\\cdot\\frac{f(1+3h)-f(1)}{3h}+2\\cdot\\frac{f(1-2h)-f(1)}{-2h}$이다.\n극한을 취하면 $C=3f'(1)+2f'(1)=5\\cdot\\frac35=3$이다.\n$A+B+C=\\frac3{10}+\\frac65+3=\\frac{3+12+30}{10}=\\frac{45}{10}=\\frac92$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-176",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_SECOND_ORDER",
    "crossConceptKeys": [
      "CC_DIFFERENCE_QUOTIENT_SCALING",
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  },
  {
    "id": 9,
    "category": "여러 가지 미분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-05",
    "standardUnit": "여러 가지 미분법",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 미분법"
    ],
    "wide": false,
    "content": "$f(x)=\\frac2{x-3}$ ($x\\ne3$)이고 $L=\\lim_{h\\to0}\\frac{f(3h)-f(-3h)}h$이다. $\\lim_{h\\to0}\\frac{f(a+h)-f(a)}h=-\\frac18$을 만족하는 양수 $a$에 대하여 $a+L$의 값은?",
    "choices": [
      "$5$",
      "$\\frac{16}{3}$",
      "$\\frac{17}{3}$",
      "$6$",
      "$\\frac{19}{3}$"
    ],
    "answer": "③",
    "solution": "$f'(x)=-\\frac2{(x-3)^2}$이다.\n$L$의 분자에 $f(0)$을 더하고 빼면 $f(3h)-f(-3h)=\\{f(3h)-f(0)\\}-\\{f(-3h)-f(0)\\}$이다.\n$h$로 나누어 극한을 취하면 $L=3f'(0)+3f'(0)=6f'(0)$이다.\n$f'(0)=-\\frac29$이므로 $L=6\\left(-\\frac29\\right)=-\\frac43$이다.\n$\\lim_{h\\to0}\\frac{f(a+h)-f(a)}h=f'(a)=-\\frac2{(a-3)^2}$이다.\n$-\\frac2{(a-3)^2}=-\\frac18$에서 $(a-3)^2=16$이다.\n(i) $a-3=4$이면 $a=7$이다.\n(ii) $a-3=-4$이면 $a=-1$인데 양수 조건에 맞지 않는다.\n따라서 $a=7$이고 $a+L=7-\\frac43=\\frac{21-4}{3}=\\frac{17}{3}$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-176",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_SECOND_ORDER",
    "crossConceptKeys": [
      "CC_DIFFERENCE_QUOTIENT_SCALING",
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
      "COND_NONZERO",
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 10,
    "category": "여러 가지 미분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-05",
    "standardUnit": "여러 가지 미분법",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 미분법"
    ],
    "wide": false,
    "content": "각 함수가 정의되는 곳에서 $\\tan(2x),\\ \\cot(2x),\\ \\sec(2x),\\ \\csc(2x)$의 도함수를 순서대로 적은 것은?",
    "choices": [
      "$(2\\sec^2(2x),\\,2\\csc^2(2x),\\,2\\sec(2x)\\tan(2x),\\,2\\csc(2x)\\cot(2x))$",
      "$(2\\sec^2(2x),\\,-2\\csc^2(2x),\\,-2\\sec(2x)\\tan(2x),\\,-2\\csc(2x)\\cot(2x))$",
      "$(-2\\sec^2(2x),\\,-2\\csc^2(2x),\\,2\\sec(2x)\\tan(2x),\\,-2\\csc(2x)\\cot(2x))$",
      "$(2\\sec^2(2x),\\,-2\\csc^2(2x),\\,2\\sec(2x)\\tan(2x),\\,-2\\csc(2x)\\cot(2x))$",
      "$(2\\sec^2(2x),\\,-2\\csc^2(2x),\\,2\\sec(2x)\\tan(2x),\\,2\\csc(2x)\\cot(2x))$"
    ],
    "answer": "④",
    "solution": "$u=2x$로 놓으면 합성함수의 미분법에 의해 $\\frac{d}{dx}F(2x)=2F'(2x)$이다.\n$\\tan u$의 도함수는 $\\sec^2u$이므로 $(\\tan 2x)'=2\\sec^2 2x$이다.\n$\\cot u$의 도함수는 $-\\csc^2u$이므로 $(\\cot 2x)'=-2\\csc^2 2x$이다.\n$\\sec u$의 도함수는 $\\sec u\\tan u$이므로 $(\\sec 2x)'=2\\sec 2x\\tan 2x$이다.\n$\\csc u$의 도함수는 $-\\csc u\\cot u$이므로 $(\\csc 2x)'=-2\\csc 2x\\cot 2x$이다.\n순서대로 쓰면 $2\\sec^2 2x,\\ -2\\csc^2 2x,\\ 2\\sec 2x\\tan 2x,\\ -2\\csc 2x\\cot 2x$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-176",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_SECOND_ORDER",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
  },
  {
    "id": 11,
    "category": "여러 가지 미분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-05",
    "standardUnit": "여러 가지 미분법",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 미분법"
    ],
    "wide": false,
    "content": "$f(x)=x^{2x}$ ($x>0$)의 도함수는?",
    "choices": [
      "$x^{2x}(2\\ln x+2)$",
      "$x^{2x}(2\\ln x+3)$",
      "$x^{2x}(2\\ln x+4)$",
      "$x^{2x}(2\\ln x+5)$",
      "$x^{2x}(2\\ln x+6)$"
    ],
    "answer": "①",
    "solution": "$x>0$이므로 $x^{2x}=e^{2x\\ln x}$로 변형한다.\n지수함수와 합성함수의 미분법으로 $f'(x)=e^{2x\\ln x}\\cdot(2x\\ln x)'$이다.\n곱의 미분법으로 $(2x\\ln x)'=2\\ln x+2x\\cdot\\frac1x=2\\ln x+2$이다.\n따라서 $f'(x)=x^{2x}(2\\ln x+2)$이다.\n(검산) 로그 미분법으로 $\\frac{f'(x)}{f(x)}=2\\ln x+2$에서 같은 결과를 얻는다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-176",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_SECOND_ORDER",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 12,
    "category": "여러 가지 미분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-05",
    "standardUnit": "여러 가지 미분법",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 미분법"
    ],
    "wide": false,
    "content": "$f(x)=x^{2\\ln x}$ ($x>0$)에 대하여 $f'(e)$의 값은?",
    "choices": [
      "$2e$",
      "$4e$",
      "$6e$",
      "$8e$",
      "$10e$"
    ],
    "answer": "②",
    "solution": "$f(x)=e^{2(\\ln x)^2}$로 변형한다.\n합성함수의 미분법으로 $f'(x)=e^{2(\\ln x)^2}\\cdot 2\\cdot 2\\ln x\\cdot\\frac1x$이다.\n즉 $f'(x)=x^{2\\ln x}\\cdot\\frac{4\\ln x}{x}$이다.\n$\\ln e=1$, $e^{2\\ln e}=e^2$이므로 $f'(e)=e^2\\cdot\\frac{4}{e}$이다.\n따라서 $f'(e)=4e$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-176",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_SECOND_ORDER",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 13,
    "category": "여러 가지 미분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-05",
    "standardUnit": "여러 가지 미분법",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 미분법"
    ],
    "wide": false,
    "content": "$f(x)=\\frac{x+2}{x^2+x+4}$, $g(x)=x^2-2x$일 때 $(f\\circ g)'(2)$의 값은?",
    "choices": [
      "$\\frac{1}{8}$",
      "$\\frac{3}{16}$",
      "$\\frac{1}{4}$",
      "$\\frac{5}{16}$",
      "$\\frac{3}{8}$"
    ],
    "answer": "③",
    "solution": "$g(2)=2^2-2\\cdot2=0$이다.\n$g'(x)=2x-2$이므로 $g'(2)=2$이다.\n몫의 미분법으로 $f'(x)=\\frac{(x^2+x+4)-(x+2)(2x+1)}{(x^2+x+4)^2}$이다.\n분자를 정리하면 $x^2+x+4-(2x^2+5x+2)=-x^2-4x+2$이다.\n$f'(0)=\\frac{2}{16}=\\frac18$이다.\n합성함수의 미분법으로 $(f\\circ g)'(2)=f'(g(2))g'(2)=f'(0)\\cdot 2=\\frac18\\cdot2=\\frac14$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-176",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_SECOND_ORDER",
    "crossConceptKeys": [
      "CC_FUNCTION_COMPOSITION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 14,
    "category": "여러 가지 미분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-05",
    "standardUnit": "여러 가지 미분법",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 미분법"
    ],
    "wide": false,
    "content": "미분가능한 함수 $f,g$가 $\\lim_{x\\to4}\\frac{f(x)-7}{x-4}=-3$과 $\\lim_{x\\to1}\\frac{g(x)-4}{x-1}=2$를 만족한다. $(f\\circ g)'(1)$의 값은?",
    "choices": [
      "$-12$",
      "$-10$",
      "$-8$",
      "$-6$",
      "$-4$"
    ],
    "answer": "④",
    "solution": "몫의 극한이 유한하고 분모가 $0$으로 가므로 분자도 $0$으로 가야 한다.\n$f$가 미분가능하면 연속이므로 $f(4)=7$이다.\n첫 식은 $f'(4)=\\lim_{x\\to4}\\frac{f(x)-f(4)}{x-4}=-3$이다.\n마찬가지로 $g(1)=4$이고 $g'(1)=2$이다.\n합성함수의 미분법으로 $(f\\circ g)'(1)=f'(g(1))g'(1)$이다.\n$g(1)=4$이므로 $(f\\circ g)'(1)=f'(4)\\cdot2=(-3)\\cdot2=-6$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-176",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_SECOND_ORDER",
    "crossConceptKeys": [
      "CC_FUNCTION_COMPOSITION",
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 15,
    "category": "여러 가지 미분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-05",
    "standardUnit": "여러 가지 미분법",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 미분법"
    ],
    "wide": false,
    "content": "미분가능한 함수 $f$가 $\\lim_{x\\to2}\\frac{e^{2x-4}f(x)-3}{x-2}=10$을 만족한다. 순서쌍 $(f(2),f'(2))$는?",
    "choices": [
      "$(3,4)$",
      "$(3,5)$",
      "$(3,6)$",
      "$(3,7)$",
      "$(3,8)$"
    ],
    "answer": "①",
    "solution": "$G(x)=e^{2x-4}f(x)$라 하면 $G$는 미분가능하고 연속이다.\n극한이 유한하고 분모 $x-2\\to0$이므로 $G(2)=3$이다.\n$G(2)=e^0f(2)=f(2)$이므로 $f(2)=3$이다.\n극한을 미분계수의 정의로 보면 $G'(2)=10$이다.\n곱과 합성함수의 미분법으로 $G'(x)=2e^{2x-4}f(x)+e^{2x-4}f'(x)$이다.\n$x=2$에서 $G'(2)=2\\cdot1\\cdot3+1\\cdot f'(2)=6+f'(2)$이다.\n$6+f'(2)=10$이므로 $f'(2)=4$이다.\n따라서 $(f(2),f'(2))=(3,4)$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-176",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_SECOND_ORDER",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 16,
    "category": "여러 가지 미분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-05",
    "standardUnit": "여러 가지 미분법",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 미분법"
    ],
    "wide": false,
    "content": "양수 $a$와 실수 $b$에 대하여 $f(x)=\\begin{cases}\\ln(ax)&(x\\ge2)\\\\ bx^2+2&(x<2)\\end{cases}$가 $x=2$에서 미분가능하다. 순서쌍 $(a,b)$는?",
    "choices": [
      "$(\\frac{e^{1/2}}{2},\\frac18)$",
      "$(\\frac{e^{2/2}}{2},\\frac18)$",
      "$(\\frac{e^{3/2}}{2},\\frac18)$",
      "$(\\frac{e^{4/2}}{2},\\frac18)$",
      "$(\\frac{e^{5/2}}{2},\\frac18)$"
    ],
    "answer": "⑤",
    "solution": "미분가능하면 연속이므로 $\\lim_{x\\to2^-}(bx^2+2)=f(2)$이다.\n$f(2)=\\ln(2a)$이므로 $4b+2=\\ln(2a)$이다. (연속 조건)\n(i) 왼쪽 미분계수: $\\lim_{x\\to2^-}\\frac{(bx^2+2)-\\ln(2a)}{x-2}$에 연속 조건을 넣으면 $\\lim\\frac{b(x^2-4)}{x-2}=4b$이다.\n(ii) 오른쪽 미분계수: $(\\ln ax)'=\\frac1x$이므로 $x=2$에서 $\\frac12$이다.\n미분가능하려면 좌우 미분계수가 같아야 하므로 $4b=\\frac12$이다.\n따라서 $b=\\frac18$이다.\n연속 조건에 대입하면 $\\ln(2a)=4\\cdot\\frac18+2=\\frac12+2=\\frac52$이다.\n지수식으로 바꾸면 $2a=e^{5/2}$이므로 $a=\\frac{e^{5/2}}2$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-176",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_SECOND_ORDER",
    "crossConceptKeys": [
      "CC_DIFFERENTIABILITY",
      "CC_FUNCTION_CONTINUITY"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 17,
    "category": "여러 가지 미분법",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-05",
    "standardUnit": "여러 가지 미분법",
    "standardUnitOrder": 5,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "여러 가지 미분법"
    ],
    "wide": false,
    "content": "그림의 그래프에 대해 $u(x)=f(x)g(x)$, $v(x)=\\frac{f(x)}{g(x)}$, $h(x)=f(g(x))$라 하자. 순서대로 적은 세 값 $(u'(1),v'(5),h'(1))$은? [그림: 좌표평면에서 $y=f(x)$는 $(0,2),(3,8),(9,5)$를 순서대로 선분으로 잇고, $y=g(x)$는 $(0,3),(2,1),(8,7)$을 순서대로 선분으로 잇는다. 두 꺾은선의 이름과 꼭짓점 좌표를 표시한다.]",
    "choices": [
      "$(0,-\\frac{11}{16},-2)$",
      "$(0,-\\frac9{16},-2)$",
      "$(0,-\\frac7{16},-2)$",
      "$(0,-\\frac5{16},-2)$",
      "$(0,-\\frac3{16},-2)$"
    ],
    "answer": "②",
    "solution": "$0<x<3$에서 $f$의 기울기는 $\\frac{8-2}{3-0}=2$이므로 $f'(1)=2$이고 $f(1)=2+2\\cdot1=4$이다.\n$0<x<2$에서 $g$의 기울기는 $\\frac{1-3}{2-0}=-1$이므로 $g'(1)=-1$이고 $g(1)=3-1=2$이다.\n곱의 미분법으로 $u'(1)=f'(1)g(1)+f(1)g'(1)=2\\cdot2+4\\cdot(-1)=0$이다.\n$3<x<9$에서 $f$의 기울기는 $\\frac{5-8}{9-3}=-\\frac12$이므로 $f'(5)=-\\frac12$, $f(5)=8-\\frac12\\cdot2=7$이다.\n$2<x<8$에서 $g$의 기울기는 $\\frac{7-1}{8-2}=1$이므로 $g'(5)=1$, $g(5)=1+1\\cdot3=4$이다.\n몫의 미분법으로 $v'(5)=\\frac{f'(5)g(5)-f(5)g'(5)}{\\{g(5)\\}^2}=\\frac{-2-7}{16}=-\\frac9{16}$이다.\n합성함수의 미분법으로 $h'(1)=f'(g(1))g'(1)=f'(2)\\cdot(-1)$이다.\n$f'(2)=2$이므로 $h'(1)=-2$이다.\n따라서 세 값은 $\\left(0,-\\frac9{16},-2\\right)$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "low",
    "difficultyBoundaryFlag": "B45",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-176",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_SECOND_ORDER",
    "crossConceptKeys": [
      "CC_FUNCTION_COMPOSITION",
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL",
    "image": "assets/images/미적분II_165_이계도함수의항등식_고2_유형은행1/q17-problem.svg",
    "imageAlt": "f와 g의 두 꺾은선 그래프를 공통 좌표축에 그려 곱·몫·합성함수의 도함수 읽기를 돕는다.",
    "imageCaption": "f와 g의 두 꺾은선 그래프를 공통 좌표축에 그려 곱·몫·합성함수의 도함수 읽기를 돕는다.",
    "imageSize": "full"
  }
];
