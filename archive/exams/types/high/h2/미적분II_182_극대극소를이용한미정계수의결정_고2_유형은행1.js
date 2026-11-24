window.examTitle = "미적분II_182_극대극소를이용한미정계수의결정_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "도함수의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도함수의 활용"
    ],
    "wide": false,
    "content": "$f(x)=(x^2+ax+b)/(x+2)$가 $x=-4$에서 극댓값 $-6$을 가질 때, 극솟값은?",
    "choices": [
      "$-2$",
      "$-1$",
      "$0$",
      "$1$",
      "$2$"
    ],
    "answer": "⑤",
    "solution": "다항식의 나눗셈으로 $f(x)=x+(a-2)+\\frac{b-2a+4}{x+2}$로 쓴다. $A=a-2$, $B=b-2a+4$라 하면 $f(x)=x+A+\\frac{B}{x+2}$이다.\n분수함수의 미분법으로 $f'(x)=1-\\frac{B}{(x+2)^2}$이다.\n$x=-4$에서 극댓값을 가지므로 $f'(-4)=1-\\frac{B}{4}=0$에서 $B=4$이다.\n극댓값 조건 $f(-4)=-4+A-2=-6$에서 $A=0$이다.\n$A=0$, $B=4$를 대입하면 $f(x)=x+\\frac{4}{x+2}$이고 $f'(x)=1-\\frac{4}{(x+2)^2}=\\frac{(x+2)^2-4}{(x+2)^2}=\\frac{x(x+4)}{(x+2)^2}$이다.\n정의역 $x\\ne-2$에서 도함수의 부호는 $x<-4$에서 $+$, $-4<x<-2$에서 $-$, $-2<x<0$에서 $-$, $x>0$에서 $+$이다.\n따라서 $x=-4$에서 극대, $x=0$에서 극소이다.\n극솟값은 $f(0)=0+\\frac{4}{2}=2$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-086",
    "problemTypeKey": "PT_DERIVATIVE_EXTREMA",
    "templateKey": "TPL_EXTREMA_VALUE_PARAMETER",
    "crossConceptKeys": [
      "CC_RATIONAL_FUNCTION",
      "CC_DERIVATIVE_ROOT_SOLVING"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 2,
    "category": "도함수의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도함수의 활용"
    ],
    "wide": false,
    "content": "$f(x)=(4x+k)/(x^2+1)$이 $x=2$에서 극값을 가질 때, 극댓값과 극솟값의 합은?",
    "choices": [
      "$-4$",
      "$-3$",
      "$-2$",
      "$-1$",
      "$0$"
    ],
    "answer": "②",
    "solution": "몫의 미분법으로 $f'(x)=\\frac{4(x^2+1)-(4x+k)\\cdot2x}{(x^2+1)^2}=\\frac{-4x^2-2kx+4}{(x^2+1)^2}$이다.\n$x=2$에서 극값을 가지므로 $f'(2)=\\frac{-16-4k+4}{25}=0$에서 $-12-4k=0$, 즉 $k=-3$이다.\n$k=-3$을 대입하고 인수분해하면 $f'(x)=\\frac{-4x^2+6x+4}{(x^2+1)^2}=\\frac{-2(x-2)(2x+1)}{(x^2+1)^2}$이다.\n분모가 항상 양수이므로 도함수의 부호는 분자의 부호와 같다.\n부호는 $x<-\\frac12$에서 $-$, $-\\frac12<x<2$에서 $+$, $x>2$에서 $-$이므로 $x=-\\frac12$에서 극소, $x=2$에서 극대이다.\n극댓값은 $f(2)=\\frac{8-3}{5}=1$이다.\n극솟값은 $f\\left(-\\frac12\\right)=\\frac{-2-3}{\\frac14+1}=\\frac{-5}{\\frac54}=-4$이다.\n두 값을 더하면 $1+(-4)=-3$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-086",
    "problemTypeKey": "PT_DERIVATIVE_EXTREMA",
    "templateKey": "TPL_EXTREMA_VALUE_PARAMETER",
    "crossConceptKeys": [
      "CC_RATIONAL_FUNCTION",
      "CC_DERIVATIVE_ROOT_SOLVING"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 3,
    "category": "도함수의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도함수의 활용"
    ],
    "wide": false,
    "content": "$f(x)=(x^2+ax+b)e^{2x}$가 $x=1$에서 극솟값 $-3e^2$를 가질 때, $ab$는?",
    "choices": [
      "$-40$",
      "$-32$",
      "$-24$",
      "$-16$",
      "$-8$"
    ],
    "answer": "②",
    "solution": "함숫값 조건 $f(1)=(1+a+b)e^2=-3e^2$에서 $1+a+b=-3$이다.\n곱과 합성함수의 미분법으로 $f'(x)=2xe^{2x}+2(x^2+ax+b)e^{2x}=e^{2x}\\{2x^2+(2a+2)x+a+2b\\}$이다.\n극소의 필요조건 $f'(1)=e^2(3a+2b+4)=0$에서 $3a+2b+4=0$이다.\n$b=-4-a$를 대입하면 $3a+2(-4-a)+4=a-4=0$이므로 $a=4$이고 $b=-8$이다.\n이때 $f'(x)=e^{2x}(2x^2+10x-12)=2e^{2x}(x+6)(x-1)$이다.\n$e^{2x}>0$, $x+6>0$이므로 $x=1$ 근처에서 도함수가 음에서 양으로 바뀌어 극소가 된다.\n따라서 $ab=4\\cdot(-8)=-32$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-086",
    "problemTypeKey": "PT_DERIVATIVE_EXTREMA",
    "templateKey": "TPL_EXTREMA_VALUE_PARAMETER",
    "crossConceptKeys": [
      "CC_POLYNOMIAL_DERIVATIVE_RULE",
      "CC_DERIVATIVE_ROOT_SOLVING"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 4,
    "category": "도함수의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도함수의 활용"
    ],
    "wide": false,
    "content": "$f(x)=x^2e^{2x}+a$의 극솟값이 $2$일 때, 극댓값은?",
    "choices": [
      "$2-2e^{-2}$",
      "$2-e^{-2}$",
      "$2+e^{-2}$",
      "$2+2e^{-2}$",
      "$2+3e^{-2}$"
    ],
    "answer": "③",
    "solution": "곱과 합성함수의 미분법으로 $f'(x)=2xe^{2x}+x^2\\cdot2e^{2x}=2x(x+1)e^{2x}$이다.\n$e^{2x}>0$이므로 도함수의 부호는 $x(x+1)$의 부호와 같다.\n부호는 $x<-1$에서 $+$, $-1<x<0$에서 $-$, $x>0$에서 $+$이므로 $x=-1$에서 극대, $x=0$에서 극소이다.\n극솟값 조건 $f(0)=0+a=2$에서 $a=2$이다.\n극댓값은 $f(-1)=(-1)^2e^{-2}+2=2+e^{-2}$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-086",
    "problemTypeKey": "PT_DERIVATIVE_EXTREMA",
    "templateKey": "TPL_EXTREMA_VALUE_PARAMETER",
    "crossConceptKeys": [
      "CC_POLYNOMIAL_DERIVATIVE_RULE",
      "CC_DERIVATIVE_ROOT_SOLVING"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 5,
    "category": "도함수의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도함수의 활용"
    ],
    "wide": false,
    "content": "$f(x)=xe^{2x}-(6x+a)e^x$가 $x=-1/2$에서 극댓값을 가질 때, 극솟값은?",
    "choices": [
      "$11(1-\\ln3)$",
      "$10(1-\\ln3)$",
      "$9(1-\\ln3)$",
      "$8(1-\\ln3)$",
      "$7(1-\\ln3)$"
    ],
    "answer": "③",
    "solution": "곱의 미분법으로 $f'(x)=e^{2x}+2xe^{2x}-\\{6e^x+(6x+a)e^x\\}=e^x[(1+2x)e^x-6x-a-6]$이다.\n$x=-\\frac12$에서 극댓값을 가지므로 $f'\\left(-\\frac12\\right)=e^{-1/2}(-a-3)=0$에서 $a=-3$이다.\n대입하면 $f'(x)=e^x[(1+2x)e^x-6x-3]=e^x(2x+1)(e^x-3)$이다.\n$e^x>0$이므로 도함수의 부호는 $(2x+1)(e^x-3)$의 부호와 같다.\n부호는 $x<-\\frac12$에서 $+$, $-\\frac12<x<\\ln3$에서 $-$, $x>\\ln3$에서 $+$이므로 $x=\\ln3$에서 극소이다.\n$e^{2\\ln3}=9$, $e^{\\ln3}=3$을 대입하면 $f(\\ln3)=9\\ln3-(6\\ln3-3)\\cdot3=9\\ln3-18\\ln3+9=9-9\\ln3$이다.\n따라서 극솟값은 $9(1-\\ln3)$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-086",
    "problemTypeKey": "PT_DERIVATIVE_EXTREMA",
    "templateKey": "TPL_EXTREMA_VALUE_PARAMETER",
    "crossConceptKeys": [
      "CC_POLYNOMIAL_DERIVATIVE_RULE",
      "CC_DERIVATIVE_ROOT_SOLVING"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 6,
    "category": "도함수의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도함수의 활용"
    ],
    "wide": false,
    "content": "$f(x)=2\\ln x+a/x-x$가 $x=3$에서 극값을 가질 때, 극댓값은?",
    "choices": [
      "$2\\ln3-7$",
      "$2\\ln3-6$",
      "$2\\ln3-5$",
      "$2\\ln3-4$",
      "$2\\ln3-3$"
    ],
    "answer": "④",
    "solution": "로그함수와 거듭제곱의 미분 공식으로 $f'(x)=\\frac2x-\\frac{a}{x^2}-1$이다.\n$x=3$에서 극값을 가지므로 $f'(3)=\\frac23-\\frac{a}{9}-1=\\frac{-a-3}{9}=0$에서 $a=-3$이다.\n대입하고 통분하면 $f'(x)=\\frac2x+\\frac3{x^2}-1=\\frac{2x+3-x^2}{x^2}=\\frac{-(x-3)(x+1)}{x^2}$이다.\n정의역 $x>0$에서 $x+1>0$, $x^2>0$이므로 도함수의 부호는 $-(x-3)$의 부호와 같다.\n$0<x<3$에서 $+$, $x>3$에서 $-$이므로 $x=3$에서 극대이다.\n극댓값은 $f(3)=2\\ln3+\\frac{-3}{3}-3=2\\ln3-4$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-086",
    "problemTypeKey": "PT_DERIVATIVE_EXTREMA",
    "templateKey": "TPL_EXTREMA_VALUE_PARAMETER",
    "crossConceptKeys": [
      "CC_RATIONAL_FUNCTION",
      "CC_DERIVATIVE_ROOT_SOLVING"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 7,
    "category": "도함수의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-06",
    "standardUnit": "도함수의 활용",
    "standardUnitOrder": 6,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "도함수의 활용"
    ],
    "wide": false,
    "content": "$-\\pi<x<\\pi$에서 $f(x)=x-a\\sin x$의 극솟값이 $-2$일 때, 극댓값은? (단, $a>1$)",
    "choices": [
      "$-2$",
      "$-1$",
      "$0$",
      "$1$",
      "$2$"
    ],
    "answer": "⑤",
    "solution": "사인 함수의 미분 공식으로 $f'(x)=1-a\\cos x$이고 $f''(x)=a\\sin x$이다.\n$a>1$이므로 $0<\\frac1a<1$이고 $u=\\arccos\\frac1a$라 하면 $0<u<\\frac{\\pi}{2}$이다.\n$-\\pi<x<\\pi$에서 $f'(x)=0$의 해는 $x=\\pm u$이다.\n$\\sin u>0$이므로 $f''(u)=a\\sin u>0$에서 $x=u$는 극소, $f''(-u)=-a\\sin u<0$에서 $x=-u$는 극대이다.\n극솟값 조건 $f(u)=u-a\\sin u=-2$이다.\n사인의 홀함수 성질로 $f(-u)=-u+a\\sin u=-(u-a\\sin u)=-f(u)$이다.\n따라서 극댓값은 $f(-u)=-(-2)=2$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-086",
    "problemTypeKey": "PT_DERIVATIVE_EXTREMA",
    "templateKey": "TPL_EXTREMA_VALUE_PARAMETER",
    "crossConceptKeys": [
      "CC_TRIGONOMETRIC_EQUATION",
      "CC_TRIGONOMETRIC_EXTREMUM"
    ],
    "conditionKeys": [
      "COND_RESTRICTED_INTERVAL",
      "COND_LOWER_BOUND"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
