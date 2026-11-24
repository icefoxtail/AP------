window.examTitle = "미적분II_164_이계도함수의미정계수결정_고2_유형은행1";

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
    "content": "$f(x)=xe^{ax+b}$가 $f'(0)=2,\\ f''(0)=12$를 만족한다. $a+e^b$의 값은?",
    "choices": [
      "$5$",
      "$6$",
      "$7$",
      "$8$",
      "$9$"
    ],
    "answer": "①",
    "solution": "곱의 미분법과 합성함수의 미분법으로 $f'(x)=1\\cdot e^{ax+b}+x\\cdot ae^{ax+b}=(1+ax)e^{ax+b}$이다.\n$f'(0)=e^b=2$이다.\n곱의 미분법을 다시 적용하면 $f''(x)=ae^{ax+b}+a(1+ax)e^{ax+b}=(2a+a^2x)e^{ax+b}$이다.\n$f''(0)=2ae^b=2a\\cdot2=4a=12$이므로 $a=3$이다.\n따라서 $a+e^b=3+2=5$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-175",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_SECOND_ORDER",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [],
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
    "content": "양수 $a$와 실수 $b$에 대해 $f(x)=(ax+b)e^{ax}$라 하자. $f'(0)=6,\\ f''(0)=16$일 때 $a-b$의 값은?",
    "choices": [
      "$-3$",
      "$-2$",
      "$-1$",
      "$0$",
      "$1$"
    ],
    "answer": "④",
    "solution": "곱의 미분법과 합성함수의 미분법으로 $f'(x)=ae^{ax}+(ax+b)\\cdot ae^{ax}=[a+a(ax+b)]e^{ax}$이다.\n$f'(0)=a+ab=6$이다.\n다시 미분하면 $f''(x)=a^2e^{ax}+a[a+a(ax+b)]e^{ax}=[a^2+a(a+ab)]e^{ax}$이다.\n$f''(0)=a^2+a(a+ab)=a^2+6a=16$이다.\n이항하여 인수분해하면 $a^2+6a-16=(a+8)(a-2)=0$이다.\n$a>0$이므로 $a=2$이다.\n$2+2b=6$에서 $b=2$이다.\n따라서 $a-b=2-2=0$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-175",
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
    "content": "$f(x)=(ax+b)\\cos(2x)$가 $f'(0)=3,\\ f''(0)=8$을 만족한다. $a+b$의 값은?",
    "choices": [
      "$-1$",
      "$0$",
      "$1$",
      "$2$",
      "$3$"
    ],
    "answer": "③",
    "solution": "곱의 미분법과 합성함수의 미분법으로 $f'(x)=a\\cos(2x)+(ax+b)(-2\\sin(2x))=a\\cos(2x)-2(ax+b)\\sin(2x)$이다.\n다시 미분하면 $f''(x)=-2a\\sin(2x)-2[a\\sin(2x)+2(ax+b)\\cos(2x)]$이다.\n정리하면 $f''(x)=-4a\\sin(2x)-4(ax+b)\\cos(2x)$이다.\n$\\sin0=0,\\ \\cos0=1$이므로 $f'(0)=a=3$이다.\n$f''(0)=-4b=8$이므로 $b=-2$이다.\n따라서 $a+b=3+(-2)=1$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-175",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_SECOND_ORDER",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [],
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
    "content": "$f(x)=e^{ax+b}\\sin(2x)$가 $f'(0)=6,\\ f''(0)=24$를 만족한다. $a+e^b$의 값은?",
    "choices": [
      "$4$",
      "$5$",
      "$6$",
      "$7$",
      "$8$"
    ],
    "answer": "②",
    "solution": "곱의 미분법과 합성함수의 미분법으로 $f'(x)=ae^{ax+b}\\sin(2x)+2e^{ax+b}\\cos(2x)=e^{ax+b}[a\\sin(2x)+2\\cos(2x)]$이다.\n$f'(0)=e^b\\cdot2=6$이므로 $e^b=3$이다.\n다시 미분하면 $f''(x)=e^{ax+b}[a(a\\sin(2x)+2\\cos(2x))+2a\\cos(2x)-4\\sin(2x)]$이다.\n정리하면 $f''(x)=e^{ax+b}[(a^2-4)\\sin(2x)+4a\\cos(2x)]$이다.\n$\\sin0=0,\\ \\cos0=1$이므로 $f''(0)=4ae^b=4a\\cdot3=12a=24$이다.\n따라서 $a=2$이다.\n$e^b=3$이므로 $a+e^b=2+3=5$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-175",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_SECOND_ORDER",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [],
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
    "content": "$f(x)=e^{2x}(a\\cos x+b\\sin x)$가 $f'(0)=5,\\ f''(0)=10$을 만족한다. $a-b$의 값은?",
    "choices": [
      "$-2$",
      "$-1$",
      "$0$",
      "$1$",
      "$2$"
    ],
    "answer": "④",
    "solution": "곱의 미분법과 합성함수의 미분법으로 $f'(x)=2e^{2x}(a\\cos x+b\\sin x)+e^{2x}(-a\\sin x+b\\cos x)$이다.\n정리하면 $f'(x)=e^{2x}[(2a+b)\\cos x+(2b-a)\\sin x]$이다.\n$f'(0)=2a+b=5$이다.\n다시 미분하면 $f''(x)=2e^{2x}[(2a+b)\\cos x+(2b-a)\\sin x]+e^{2x}[-(2a+b)\\sin x+(2b-a)\\cos x]$이다.\n정리하면 $f''(x)=e^{2x}[(3a+4b)\\cos x+(3b-4a)\\sin x]$이다.\n$f''(0)=3a+4b=10$이다.\n$b=5-2a$를 대입하면 $3a+4(5-2a)=3a+20-8a=10$이다.\n정리하면 $-5a=-10$이므로 $a=2,\\ b=5-4=1$이다.\n따라서 $a-b=2-1=1$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-175",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_SECOND_ORDER",
    "crossConceptKeys": [
      "CC_DERIVATIVE_VALUE_EVALUATION"
    ],
    "conditionKeys": [],
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
    "content": "두 번 미분가능한 함수 $f$가 모든 실수 $x,y$에 대하여 $f(x+y)=e^{2y}f(x)+e^{2x}f(y)$를 만족한다. $f'(0)=4$일 때 $f''(0)$의 값은?",
    "choices": [
      "$8$",
      "$10$",
      "$12$",
      "$14$",
      "$16$"
    ],
    "answer": "⑤",
    "solution": "$x=y=0$을 대입하면 $f(0)=e^0f(0)+e^0f(0)=2f(0)$이므로 $f(0)=0$이다.\n$x$를 고정하고 $y$에 대하여 미분하면 $f'(x+y)=2e^{2y}f(x)+e^{2x}f'(y)$이다.\n$y=0$을 대입하면 $f'(x)=2f(x)+e^{2x}f'(0)=2f(x)+4e^{2x}$이다.\n양변을 $x$에 대하여 미분하면 $f''(x)=2f'(x)+8e^{2x}$이다.\n$x=0$을 대입하면 $f''(0)=2f'(0)+8e^0$이다.\n$f'(0)=4$이므로 $f''(0)=2\\cdot4+8=16$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "low",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-175",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_SECOND_ORDER",
    "crossConceptKeys": [
      "CC_FUNCTIONAL_EQUATION"
    ],
    "conditionKeys": [
      "COND_UNIVERSAL_INPUTS"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
