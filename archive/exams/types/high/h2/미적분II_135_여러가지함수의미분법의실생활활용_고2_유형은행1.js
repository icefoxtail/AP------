window.examTitle = "미적분II_135_여러가지함수의미분법의실생활활용_고2_유형은행1";

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
    "content": "$x$개 생산할 때 평균 비용은 $C(x)=2x^2-30x+500+400/x$만 원이다. $x=20$에서 평균 비용의 순간변화율은?",
    "choices": [
      "$29$",
      "$34$",
      "$39$",
      "$44$",
      "$49$"
    ],
    "answer": "⑤",
    "solution": "평균 비용을 항별로 미분한다. $C'(x)=4x-30-\\dfrac{400}{x^2}$.\n$x=20$을 도함수에 대입한다. $C'(20)=4(20)-30-\\dfrac{400}{20^2}$.\n각 항을 계산한다. $80-30-1=49$.\n순간변화율은 $x=20$에서의 도함숫값이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 1,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-079",
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
    "content": "수심 $x$ m에서 기포의 부피가 $V(x)=12/(1+x/5)$ mL이다. 수심 $10$ m에서 수심에 대한 부피의 순간변화율은? (단위는 $\\mathrm{mL/m}$)",
    "choices": [
      "$-7/15$",
      "$-6/15$",
      "$-5/15$",
      "$-4/15$",
      "$-3/15$"
    ],
    "answer": "④",
    "solution": "분모를 정리하여 식을 간단히 한다. $V(x)=\\dfrac{12}{1+x/5}=\\dfrac{60}{x+5}$.\n몫의 미분법으로 미분한다. $V'(x)=-\\dfrac{60}{(x+5)^2}$.\n$x=10$을 대입한다. $V'(10)=-\\dfrac{60}{(10+5)^2}$.\n분모를 계산하면 $-\\dfrac{60}{225}$이고, 약분하면 $-\\dfrac{4}{15}$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-079",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "어떤 동물의 출생 $t$일 후 몸무게는 $w(t)=24/(1+10e^{-0.1t})$ kg이다. $30$일 후 증가율은? (단, $e^{-3}=0.05$로 계산한다. 단위는 kg/일이다.)",
    "choices": [
      "$4/15$",
      "$5/15$",
      "$6/15$",
      "$7/15$",
      "$8/15$"
    ],
    "answer": "⑤",
    "solution": "분모를 $u=1+10e^{-0.1t}$로 두면 $w=24u^{-1}$이다.\n합성함수의 미분법을 적용한다. $w'=-24u^{-2}\\cdot u'$이고 $u'=-e^{-0.1t}$이다.\n따라서 $w'(t)=\\dfrac{24e^{-0.1t}}{(1+10e^{-0.1t})^2}$.\n$t=30$, $e^{-3}=0.05$를 대입한다. 분모는 $1+10(0.05)=1.5$이다.\n$w'(30)=\\dfrac{24(0.05)}{(1.5)^2}=\\dfrac{1.2}{2.25}$.\n계산하면 $\\dfrac{1.2}{2.25}=\\dfrac{120}{225}=\\dfrac{8}{15}$.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-079",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_EXPONENTIAL_GROWTH"
    ],
    "conditionKeys": [
      "COND_SPECIFIED_APPROXIMATIONS"
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
    "content": "복용 $t$시간 후 체내에 남은 성분의 양은 $12/(t+1)^{3/2}$ mg이다. $t=3$에서의 순간변화율은? (단위는 $\\mathrm{mg/h}$)",
    "choices": [
      "$-9/16$",
      "$-7/16$",
      "$-5/16$",
      "$-3/16$",
      "$-1/16$"
    ],
    "answer": "①",
    "solution": "식을 거듭제곱 꼴로 고친다. $f(t)=12(t+1)^{-3/2}$.\n거듭제곱의 미분법으로 미분한다. $f'(t)=12\\left(-\\dfrac32\\right)(t+1)^{-5/2}$.\n계수를 정리한다. $f'(t)=-18(t+1)^{-5/2}$.\n$t=3$을 대입한다. $f'(3)=-18(4)^{-5/2}$.\n$4^{5/2}=(\\sqrt4)^5=2^5=32$이므로 $f'(3)=-\\dfrac{18}{32}$.\n약분하면 $-\\dfrac{9}{16}$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-079",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "부두의 $t$시간 후 수위는 $H(t)=100+k\\sin[\\pi(t-2)/4]$ cm이다. 현재 수위가 $76$ cm일 때 $6$시간 후 수위의 순간변화율은? (단위는 $\\mathrm{cm/h}$)",
    "choices": [
      "$-8\\pi$",
      "$-7\\pi$",
      "$-6\\pi$",
      "$-5\\pi$",
      "$-4\\pi$"
    ],
    "answer": "③",
    "solution": "$t=0$일 때 현재 수위가 $76$ cm이다. $H(0)=100+k\\sin\\left(-\\dfrac{\\pi}{2}\\right)=100-k$.\n$100-k=76$에서 $k=24$이다.\n$H(t)=100+24\\sin\\left[\\dfrac{\\pi(t-2)}{4}\\right]$를 합성함수의 미분법으로 미분한다.\n$H'(t)=24\\cos\\left[\\dfrac{\\pi(t-2)}{4}\\right]\\cdot\\dfrac{\\pi}{4}=6\\pi\\cos\\left[\\dfrac{\\pi(t-2)}{4}\\right]$.\n$t=6$을 대입한다. $H'(6)=6\\pi\\cos\\pi$.\n$\\cos\\pi=-1$이므로 $H'(6)=-6\\pi$.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-079",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_CURVE_POINT_COEFFICIENT_SYSTEM"
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
    "content": "시간 $t$초에서 물질의 양 $x$ g이 $x/(8-x)=e^{5(t-2)}$를 만족한다. $t=2$에서 양의 순간변화율은? (단위는 $\\mathrm{g/s}$)",
    "choices": [
      "$4$",
      "$6$",
      "$8$",
      "$10$",
      "$12$"
    ],
    "answer": "④",
    "solution": "$t=2$일 때 지수는 $0$이다. $\\dfrac{x}{8-x}=e^0=1$.\n$ x=8-x$에서 $2x=8$, 즉 $x=4$이다.\n양변을 $t$에 대해 미분한다. 좌변은 몫의 미분법으로 $\\dfrac{8x'}{(8-x)^2}$이다.\n우변은 합성함수의 미분법으로 $5e^{5(t-2)}$이다.\n$t=2$, $x=4$를 대입한다. $\\dfrac{8x'}{(8-4)^2}=5e^0$.\n$\\dfrac{8x'}{16}=5$에서 $\\dfrac{x'}{2}=5$이다.\n따라서 $x'=10$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-079",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "crossConceptKeys": [
      "CC_EXPONENTIAL_GROWTH"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
