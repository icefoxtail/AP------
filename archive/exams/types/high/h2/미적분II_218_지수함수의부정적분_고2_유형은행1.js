window.examTitle = "미적분II_218_지수함수의부정적분_고2_유형은행1";

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
    "content": "$x>0$에서 함수 $f$가 $f'(x)=\\frac{2xe^{2x}-3}{x}$, $f(1)=e^2+4$를 만족시킨다. $f(e)$의 값은?",
    "choices": [
      "$e^{2e}$",
      "$e^{2e}+1$",
      "$e^{2e}+2$",
      "$e^{2e}+3$",
      "$e^{2e}+4$"
    ],
    "answer": "②",
    "solution": "1. 피적분함수를 항별로 나누면 $f'(x)=\\frac{2xe^{2x}}{x}-\\frac{3}{x}=2e^{2x}-\\frac{3}{x}$이다.\n2. 지수함수와 로그함수의 부정적분 공식으로 $f(x)=\\int 2e^{2x}\\,dx-\\int\\frac{3}{x}\\,dx=e^{2x}-3\\ln x+C$이다.\n3. 초기조건 $f(1)=e^2+4$를 대입하면 $e^2-3\\ln1+C=e^2+4$이고 $\\ln1=0$이므로 $C=4$이다.\n4. 따라서 $f(x)=e^{2x}-3\\ln x+4$이다.\n5. $x=e$를 대입하면 $f(e)=e^{2e}-3\\ln e+4=e^{2e}-3+4=e^{2e}+1$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-093",
    "problemTypeKey": "PT_CALCULUS_FUNCTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_INTEGRAL_POWER_EXP_LOG",
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
    "content": "함수 $f$가 $f'(x)=2e^{2x}-4e^x$, $f(0)=-8$을 만족시킨다. 방정식 $f(x)=0$의 실근은?",
    "choices": [
      "$\\ln 4$",
      "$\\ln 5$",
      "$\\ln 6$",
      "$\\ln 7$",
      "$\\ln 8$"
    ],
    "answer": "②",
    "solution": "1. 지수함수의 부정적분 공식으로 $f(x)=\\int(2e^{2x}-4e^x)\\,dx=e^{2x}-4e^x+C$이다.\n2. $f(0)=-8$을 대입하면 $e^0-4e^0+C=1-4+C=-8$이므로 $C=-5$이다.\n3. 따라서 $f(x)=e^{2x}-4e^x-5$이고, $f(x)=0$에서 $t=e^x$로 치환하면 $t^2-4t-5=0$이다.\n4. 인수분해하면 $(t-5)(t+1)=0$이므로 $t=5$ 또는 $t=-1$이다.\n5. (i) $t=5$이면 $e^x=5$에서 $x=\\ln5$이다.\n6. (ii) $t=-1$이면 $e^x=-1$인 실수 $x$가 없으므로 버린다.\n7. 따라서 실근은 $x=\\ln5$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-093",
    "problemTypeKey": "PT_CALCULUS_FUNCTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_INTEGRAL_POWER_EXP_LOG",
    "crossConceptKeys": [],
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
    "content": "함수 $f$가 $f'(x)=\\frac{e^{3x}+1}{e^x+1}$, $f(0)=\\frac32$를 만족시킨다. $f(\\ln 3)$의 값은?",
    "choices": [
      "$\\ln 3+\\frac32$",
      "$\\ln 3+\\frac52$",
      "$\\ln 3+\\frac72$",
      "$\\ln 3+\\frac92$",
      "$\\ln 3+\\frac{11}2$"
    ],
    "answer": "③",
    "solution": "1. 세제곱의 합 인수분해 $a^3+b^3=(a+b)(a^2-ab+b^2)$를 쓰면 $e^{3x}+1=(e^x+1)(e^{2x}-e^x+1)$이다.\n2. $x$가 실수이면 $e^x+1>0$이므로 분모와 약분하여 $f'(x)=e^{2x}-e^x+1$이다.\n3. 지수함수의 부정적분 공식으로 $f(x)=\\frac12e^{2x}-e^x+x+C$이다.\n4. $f(0)=\\frac32$를 대입하면 $\\frac12e^0-e^0+0+C=\\frac12-1+C=\\frac32$이므로 $C=2$이다.\n5. 따라서 $f(x)=\\frac12e^{2x}-e^x+x+2$이다.\n6. $x=\\ln3$을 대입하면 $f(\\ln3)=\\frac12e^{2\\ln3}-e^{\\ln3}+\\ln3+2=\\frac12\\cdot9-3+\\ln3+2$이다.\n7. 계산하면 $\\frac92-3+2+\\ln3=\\frac72+\\ln3=\\ln3+\\frac72$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-093",
    "problemTypeKey": "PT_CALCULUS_FUNCTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_INTEGRAL_POWER_EXP_LOG",
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
    "content": "$x>0$에서 $f(x)=2x\\ln x-2x+3$이다. 도함수 $f'$의 역함수 $g$의 한 부정적분 $G$가 $G(0)=2$를 만족시킬 때, $G(\\ln 9)$의 값은?",
    "choices": [
      "$6$",
      "$7$",
      "$8$",
      "$9$",
      "$10$"
    ],
    "answer": "①",
    "solution": "1. 곱의 미분법으로 $f'(x)=2\\ln x+2x\\cdot\\frac1x-2=2\\ln x+2-2=2\\ln x$이다.\n2. $y=f'(x)=2\\ln x$에서 $\\ln x=\\frac y2$이므로 $x=e^{y/2}$이다.\n3. 따라서 역함수는 $g(x)=e^{x/2}$이다.\n4. $G'(x)=g(x)$이므로 $G(x)=\\int e^{x/2}\\,dx=2e^{x/2}+C$이다.\n5. $G(0)=2$를 대입하면 $2e^0+C=2+C=2$이므로 $C=0$이다.\n6. $x=\\ln9$을 대입하면 $G(\\ln9)=2e^{(\\ln9)/2}=2e^{\\ln3}=2\\cdot3=6$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-093",
    "problemTypeKey": "PT_CALCULUS_FUNCTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_INTEGRAL_POWER_EXP_LOG",
    "crossConceptKeys": [
      "CC_INVERSE_FUNCTION_EVALUATION"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
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
    "content": "함수 $f(x)=\\int 3^x\\ln 3\\,dx$가 $f(0)=1$을 만족시킬 때, $\\displaystyle\\lim_{n\\to\\infty}\\sum_{k=1}^{n}\\frac1{f(k)}$의 값은?",
    "choices": [
      "$\\frac18$",
      "$\\frac16$",
      "$\\frac14$",
      "$\\frac12$",
      "$\\frac34$"
    ],
    "answer": "④",
    "solution": "1. $3^x$의 미분이 $3^x\\ln3$이므로 지수함수의 부정적분 공식으로 $f(x)=\\int3^x\\ln3\\,dx=3^x+C$이다.\n2. $f(0)=1$을 대입하면 $3^0+C=1+C=1$이므로 $C=0$이다.\n3. 따라서 $f(k)=3^k$이고 $\\frac1{f(k)}=\\frac1{3^k}=\\left(\\frac13\\right)^k$이다.\n4. 등비수열의 합 공식으로 $\\sum_{k=1}^n\\left(\\frac13\\right)^k=\\frac{\\frac13\\left(1-\\left(\\frac13\\right)^n\\right)}{1-\\frac13}=\\frac12\\left(1-\\left(\\frac13\\right)^n\\right)$이다.\n5. 등비수열의 극한 성질로 $\\left(\\frac13\\right)^n\\to0$이므로 $\\lim_{n\\to\\infty}\\sum_{k=1}^n\\frac1{f(k)}=\\frac12(1-0)=\\frac12$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-093",
    "problemTypeKey": "PT_CALCULUS_FUNCTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_INTEGRAL_POWER_EXP_LOG",
    "crossConceptKeys": [
      "CC_SERIES_SUM"
    ],
    "conditionKeys": [],
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
    "content": "연속함수 $f$와 그 한 부정적분 $F$가 $F(x)+\\int e^xf(x)\\,dx=2e^{2x}+4x$를 만족시킬 때, $f(\\ln 3)$의 값은?",
    "choices": [
      "$7$",
      "$8$",
      "$9$",
      "$10$",
      "$11$"
    ],
    "answer": "④",
    "solution": "1. 부정적분의 정의로 주어진 등식의 양변을 미분하면 $F'(x)+e^xf(x)=4e^{2x}+4$이다. (우변은 합성함수의 미분법)\n2. $F$가 $f$의 부정적분이므로 $F'(x)=f(x)$이다.\n3. 따라서 $f(x)+e^xf(x)=(1+e^x)f(x)=4e^{2x}+4$이다.\n4. $x=\\ln3$을 대입하면 $1+e^{\\ln3}=1+3=4$이고 $e^{2\\ln3}=(e^{\\ln3})^2=3^2=9$이다.\n5. 즉 $4f(\\ln3)=4\\cdot9+4=40$이다.\n6. 양변을 $4$로 나누면 $f(\\ln3)=10$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-093",
    "problemTypeKey": "PT_CALCULUS_FUNCTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_INTEGRAL_POWER_EXP_LOG",
    "crossConceptKeys": [
      "CC_FUNDAMENTAL_THEOREM_OF_CALCULUS"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
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
    "content": "두 함수 $f,g$가 $(f+g)'(x)=4e^x$, $(f-g)'(x)=6$과 $f(0)=3$, $g(0)=1$을 만족시킬 때, $f(1)g(1)$의 값은?",
    "choices": [
      "$4e^2-25$",
      "$4e^2-16$",
      "$4e^2-9$",
      "$4e^2-4$",
      "$4e^2-1$"
    ],
    "answer": "②",
    "solution": "1. $S=f+g$, $D=f-g$라 두면 $S(0)=f(0)+g(0)=3+1=4$, $D(0)=f(0)-g(0)=3-1=2$이다.\n2. $S'=4e^x$이므로 지수함수의 부정적분 공식으로 $S(x)=4e^x+C_1$이고, $S(0)=4$에서 $4+C_1=4$이므로 $C_1=0$이다.\n3. $D'=6$이므로 상수함수의 부정적분 공식으로 $D(x)=6x+C_2$이고, $D(0)=2$에서 $C_2=2$이다.\n4. 따라서 $S(1)=4e^1=4e$, $D(1)=6\\cdot1+2=8$이다.\n5. $f=\\frac{S+D}{2}$, $g=\\frac{S-D}{2}$이므로 제곱의 차 공식으로 $f(1)g(1)=\\frac{S(1)^2-D(1)^2}{4}$이다.\n6. 값을 대입하면 $f(1)g(1)=\\frac{(4e)^2-8^2}{4}=\\frac{16e^2-64}{4}=4e^2-16$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-093",
    "problemTypeKey": "PT_CALCULUS_FUNCTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_INTEGRAL_POWER_EXP_LOG",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
