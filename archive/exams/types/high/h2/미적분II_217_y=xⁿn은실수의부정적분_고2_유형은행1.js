window.examTitle = "미적분II_217_y=xⁿn은실수의부정적분_고2_유형은행1";

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
    "content": "$x>0$에서 곡선 $y=f(x)$ 위의 점 $(x,f(x))$에서 접선의 기울기가 $\\frac{x-2}{x}$이다. 이 곡선이 $(1,2)$를 지날 때, $f(e)$의 값은?",
    "choices": [
      "$e-4$",
      "$e-3$",
      "$e-2$",
      "$e-1$",
      "$e$"
    ],
    "answer": "④",
    "solution": "접선의 기울기는 도함수이므로 $f'(x)=\\frac{x-2}{x}=1-\\frac{2}{x}$이다.\n부정적분의 기본 공식으로 $f(x)=\\int\\left(1-\\frac{2}{x}\\right)dx=x-2\\ln x+C$이다.\n$f(1)=2$를 대입하면 $1-2\\ln 1+C=1+C=2$이므로 $C=1$이다.\n$x=e$를 대입하면 $f(e)=e-2\\ln e+1=e-2+1=e-1$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-181",
    "problemTypeKey": "PT_CALCULUS_FUNCTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_INTEGRAL_POWER_EXP_LOG",
    "crossConceptKeys": [
      "CC_TANGENT_LINE_SLOPE_AT_POINT"
    ],
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
    "content": "$x>0$에서 곡선 $y=f(x)$ 위의 점 $(x,f(x))$에서 접선의 기울기가 $-\\frac{2}{x}$이다. $x=1$에서의 접선이 $y=-2x+5$일 때, $f(e^2)$의 값은?",
    "choices": [
      "$-1$",
      "$0$",
      "$1$",
      "$2$",
      "$3$"
    ],
    "answer": "①",
    "solution": "접점은 접선 위의 점이므로 $f(1)=-2\\cdot 1+5=3$이다.\n접선의 기울기가 도함수이므로 $f'(x)=-\\frac{2}{x}$이다.\n부정적분의 기본 공식으로 $f(x)=-2\\ln x+C$이다.\n$f(1)=3$을 대입하면 $-2\\ln 1+C=C=3$이므로 $C=3$이다.\n$x=e^2$를 대입하면 $f(e^2)=-2\\ln e^2+3=-2\\cdot 2+3=-1$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-181",
    "problemTypeKey": "PT_CALCULUS_FUNCTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_INTEGRAL_POWER_EXP_LOG",
    "crossConceptKeys": [
      "CC_TANGENT_LINE_SLOPE_AT_POINT"
    ],
    "conditionKeys": [
      "COND_POSITIVE"
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
    "content": "$x>0$에서 함수 $f(x)=\\int\\frac{(x-2)(x+3)}{x^2}\\,dx$가 $f(1)=1$을 만족시킬 때, $f(2)$의 값은?",
    "choices": [
      "$-4+\\ln 2$",
      "$-3+\\ln 2$",
      "$-2+\\ln 2$",
      "$-1+\\ln 2$",
      "$\\ln 2$"
    ],
    "answer": "④",
    "solution": "분자를 전개하면 $\\frac{(x-2)(x+3)}{x^2}=\\frac{x^2+x-6}{x^2}$이다.\n항별로 나누면 $\\frac{x^2+x-6}{x^2}=1+\\frac{1}{x}-\\frac{6}{x^2}$이다.\n부정적분의 기본 공식으로 $f(x)=\\int\\left(1+\\frac1x-\\frac6{x^2}\\right)dx=x+\\ln x+\\frac{6}{x}+C$이다.\n$f(1)=1$을 대입하면 $1+0+6+C=1$이므로 $C=-6$이다.\n$x=2$를 대입하면 $f(2)=2+\\ln 2+\\frac62-6=-1+\\ln 2$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-181",
    "problemTypeKey": "PT_CALCULUS_FUNCTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_INTEGRAL_POWER_EXP_LOG",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_POSITIVE"
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
    "content": "$x>0$에서 곡선 $y=f(x)$ 위의 점 $(x,f(x))$에서 접선의 기울기가 $\\frac{(3\\sqrt{x}-2)^2}{x}$이다. 곡선이 $(1,4)$와 $(4,a)$를 지날 때, $a$의 값은?",
    "choices": [
      "$5+8\\ln 2$",
      "$7+8\\ln 2$",
      "$9+8\\ln 2$",
      "$11+8\\ln 2$",
      "$13+8\\ln 2$"
    ],
    "answer": "②",
    "solution": "접선의 기울기를 전개하면 $f'(x)=\\frac{9x-12\\sqrt{x}+4}{x}=9-12x^{-1/2}+4x^{-1}$이다.\n부정적분의 기본 공식으로 $f(x)=9x-24\\sqrt{x}+4\\ln x+C$이다.\n$f(1)=4$를 대입하면 $9-24+0+C=4$이므로 $C=19$이다.\n$x=4$를 대입하면 $a=9\\cdot 4-24\\sqrt4+4\\ln 4+19$이다.\n계산하면 $a=36-48+4\\ln 4+19=7+4\\ln 4$이다.\n로그의 성질로 $4\\ln 4=4\\cdot 2\\ln 2=8\\ln 2$이므로 $a=7+8\\ln 2$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-181",
    "problemTypeKey": "PT_CALCULUS_FUNCTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_INTEGRAL_POWER_EXP_LOG",
    "crossConceptKeys": [
      "CC_TANGENT_LINE_SLOPE_AT_POINT"
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
    "content": "$x>0$에서 함수 $f$의 한 부정적분 $F$가 $F(x)=xf(x)-2x\\sqrt{x}+3x$를 만족시킨다. $f(1)=4$일 때, $f(e)$의 값은?",
    "choices": [
      "$6\\sqrt e-7$",
      "$6\\sqrt e-5$",
      "$6\\sqrt e-3$",
      "$6\\sqrt e-1$",
      "$6\\sqrt e+1$"
    ],
    "answer": "②",
    "solution": "부정적분의 정의로 $F'(x)=f(x)$이다.\n곱의 미분법과 거듭제곱의 미분법으로 $F'(x)=f(x)+xf'(x)-3\\sqrt{x}+3$이다.\n$F'(x)=f(x)$와 비교하여 $f(x)$를 소거하면 $xf'(x)=3\\sqrt{x}-3$이다.\n양변을 $x$로 나누면 $f'(x)=3x^{-1/2}-3x^{-1}$이다.\n부정적분의 기본 공식으로 $f(x)=6\\sqrt{x}-3\\ln x+C$이다.\n$f(1)=4$를 대입하면 $6-0+C=4$이므로 $C=-2$이다.\n$x=e$를 대입하면 $f(e)=6\\sqrt e-3\\ln e-2=6\\sqrt e-3-2=6\\sqrt e-5$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-181",
    "problemTypeKey": "PT_CALCULUS_FUNCTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_INTEGRAL_POWER_EXP_LOG",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_POSITIVE"
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
    "content": "$x>0$에서 함수 $f$의 한 부정적분 $F$가 $F(x)=xf(x)-2x^2+3x$를 만족시킨다. $f(1)=1$일 때, $f(1/e)$의 값은?",
    "choices": [
      "$\\frac1e$",
      "$\\frac2e$",
      "$\\frac3e$",
      "$\\frac4e$",
      "$\\frac5e$"
    ],
    "answer": "④",
    "solution": "부정적분의 정의로 $F'(x)=f(x)$이다.\n곱의 미분법으로 $F'(x)=f(x)+xf'(x)-4x+3$이다.\n$F'(x)=f(x)$와 비교하여 $f(x)$를 소거하면 $xf'(x)=4x-3$이다.\n양변을 $x$로 나누면 $f'(x)=4-\\frac3x$이다.\n부정적분의 기본 공식으로 $f(x)=4x-3\\ln x+C$이다.\n$f(1)=1$을 대입하면 $4-0+C=1$이므로 $C=-3$이다.\n$\\ln\\frac1e=\\ln e^{-1}=-1$이므로 $f\\left(\\frac1e\\right)=\\frac4e-3(-1)-3$이다.\n계산하면 $f\\left(\\frac1e\\right)=\\frac4e+3-3=\\frac4e$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-181",
    "problemTypeKey": "PT_CALCULUS_FUNCTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_INTEGRAL_POWER_EXP_LOG",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
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
    "content": "$x>0$에서 함수 $f$의 한 부정적분 $F$가 $F(x)=xf(x)-2x^2+2\\ln x$를 만족시킨다. $f(2)=4$일 때, $f(\\frac12)$의 값은?",
    "choices": [
      "$-3$",
      "$-2$",
      "$-1$",
      "$0$",
      "$1$"
    ],
    "answer": "⑤",
    "solution": "부정적분의 정의로 $F'(x)=f(x)$이다.\n곱의 미분법과 로그의 미분법으로 $F'(x)=f(x)+xf'(x)-4x+\\frac2x$이다.\n$F'(x)=f(x)$와 비교하여 $f(x)$를 소거하면 $xf'(x)=4x-\\frac2x$이다.\n양변을 $x$로 나누면 $f'(x)=4-2x^{-2}$이다.\n부정적분의 기본 공식으로 $f(x)=4x+2x^{-1}+C=4x+\\frac2x+C$이다.\n$f(2)=4$를 대입하면 $8+1+C=4$이므로 $C=-5$이다.\n$x=\\frac12$를 대입하면 $f\\left(\\frac12\\right)=2+4-5=1$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-181",
    "problemTypeKey": "PT_CALCULUS_FUNCTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_INTEGRAL_POWER_EXP_LOG",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
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
    "content": "$x>0$에서 함수 $f$의 한 부정적분 $F$가 $F(x)=xf(x)-2x-3\\ln x$를 만족시킨다. $f(1)=5$일 때, $f(e^{-1})$의 값은?",
    "choices": [
      "$6-3e$",
      "$7-3e$",
      "$8-3e$",
      "$9-3e$",
      "$10-3e$"
    ],
    "answer": "①",
    "solution": "부정적분의 정의로 $F'(x)=f(x)$이다.\n곱의 미분법과 로그의 미분법으로 $F'(x)=f(x)+xf'(x)-2-\\frac3x$이다.\n$F'(x)=f(x)$와 비교하여 $f(x)$를 소거하면 $xf'(x)=2+\\frac3x$이다.\n양변을 $x$로 나누면 $f'(x)=2x^{-1}+3x^{-2}$이다.\n부정적분의 기본 공식으로 $f(x)=2\\ln x-3x^{-1}+C=2\\ln x-\\frac3x+C$이다.\n$f(1)=5$를 대입하면 $0-3+C=5$이므로 $C=8$이다.\n$x=e^{-1}$을 대입하면 $f(e^{-1})=2\\ln e^{-1}-\\frac{3}{e^{-1}}+8$이다.\n$\\ln e^{-1}=-1$, $\\frac{3}{e^{-1}}=3e$이므로 $f(e^{-1})=-2-3e+8=6-3e$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-181",
    "problemTypeKey": "PT_CALCULUS_FUNCTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_INTEGRAL_POWER_EXP_LOG",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
