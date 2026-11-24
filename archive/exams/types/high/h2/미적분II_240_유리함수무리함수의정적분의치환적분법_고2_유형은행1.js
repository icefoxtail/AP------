window.examTitle = "미적분II_240_유리함수무리함수의정적분의치환적분법_고2_유형은행1";

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
    "content": "정적분 $2\\int_{0}^{2} \\frac{x+1}{x^2+2x+2}\\,dx$의 값은?",
    "choices": [
      "$\\ln 3$",
      "$\\ln 4$",
      "$\\ln 5$",
      "$\\ln 6$",
      "$\\ln 7$"
    ],
    "answer": "③",
    "solution": "치환 준비(치환적분법): $t=x^2+2x+2$로 놓으면 $dt=(2x+2)\\,dx=2(x+1)\\,dx$이다.\n적분구간 변환: $x=0$이면 $t=2$, $x=2$이면 $t=4+4+2=10$이다.\n피적분식 정리: $2\\int_{0}^{2}\\frac{x+1}{x^2+2x+2}\\,dx=\\int_{0}^{2}\\frac{2(x+1)}{x^2+2x+2}\\,dx=\\int_{2}^{10}\\frac{1}{t}\\,dt$이다.\n적분 계산: $\\int_{2}^{10}\\frac{1}{t}\\,dt=\\left[\\ln|t|\\right]_{2}^{10}=\\ln 10-\\ln 2$이다.\n로그의 성질: $\\ln 10-\\ln 2=\\ln\\frac{10}{2}=\\ln 5$이다.\n주의: 분자에 이미 $2$가 있으므로 $dt=2(x+1)\\,dx$의 계수 $2$를 한 번 더 곱해 $4$로 만들지 않는다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "정적분 $\\int_{-a}^{a} \\frac{e^{2x}}{e^{2x}+1}\\,dx = 3$일 때, 양의 상수 $a$의 값은?",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "answer": "③",
    "solution": "치환 설정(치환적분법): $t=e^{2x}+1$로 놓으면 $dt=2e^{2x}\\,dx$이므로 $e^{2x}\\,dx=\\frac{1}{2}\\,dt$이다.\n적분구간 변환: $x=-a$이면 $t=e^{-2a}+1$, $x=a$이면 $t=e^{2a}+1$이다.\n정적분 변환: $\\int_{-a}^{a}\\frac{e^{2x}}{e^{2x}+1}\\,dx=\\frac{1}{2}\\int_{e^{-2a}+1}^{e^{2a}+1}\\frac{1}{t}\\,dt=\\frac{1}{2}\\left[\\ln t\\right]_{e^{-2a}+1}^{e^{2a}+1}$이다.\n로그 계산: $=\\frac{1}{2}\\ln\\frac{e^{2a}+1}{e^{-2a}+1}$이다.\n분모 통분: $e^{-2a}+1=\\frac{1}{e^{2a}}+1=\\frac{1+e^{2a}}{e^{2a}}$이다.\n분수 정리: $\\frac{e^{2a}+1}{\\dfrac{e^{2a}+1}{e^{2a}}}=e^{2a}$이다.\n값 계산: $\\frac{1}{2}\\ln e^{2a}=\\frac{1}{2}\\cdot 2a=a$이다.\n방정식 풀이: 정적분의 값이 $3$이므로 $a=3$이다.\n주의: $\\ln$ 안의 비율을 정리할 때 분모를 통분해야 $e^{2a}$가 남는다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [
      "CC_SYMMETRIC_INTERVAL_INTEGRATION"
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
    "content": "정적분 $\\int_{0}^{\\ln 3} \\frac{e^x}{e^x+e^{-x}}\\,dx$의 값은?",
    "choices": [
      "$\\frac{1}{2}\\ln 5$",
      "$\\frac{1}{2}\\ln 6$",
      "$\\frac{1}{2}\\ln 7$",
      "$\\frac{1}{2}\\ln 10$",
      "$\\frac{1}{2}\\ln 11$"
    ],
    "answer": "①",
    "solution": "식 변형: 분모·분자에 $e^{x}$를 곱하면 $\\frac{e^x}{e^x+e^{-x}}=\\frac{e^{2x}}{e^{2x}+1}$이다.\n치환 설정(치환적분법): $t=e^{2x}+1$로 놓으면 $dt=2e^{2x}\\,dx$이므로 $e^{2x}\\,dx=\\frac{1}{2}\\,dt$이다.\n적분구간 변환: $x=0$이면 $t=1+1=2$, $x=\\ln 3$이면 $e^{2\\ln 3}=(e^{\\ln 3})^2=9$이므로 $t=10$이다.\n정적분 변환: $\\int_{0}^{\\ln 3}\\frac{e^{2x}}{e^{2x}+1}\\,dx=\\frac{1}{2}\\int_{2}^{10}\\frac{1}{t}\\,dt=\\frac{1}{2}\\left[\\ln t\\right]_{2}^{10}$이다.\n계산: $=\\frac{1}{2}(\\ln 10-\\ln 2)=\\frac{1}{2}\\ln\\frac{10}{2}=\\frac{1}{2}\\ln 5$이다.\n주의: $e^{-x}\\cdot e^{x}=1$임을 이용해 분모를 $e^{2x}+1$로 만든 뒤 치환한다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "정적분 $\\int_{0}^{\\sqrt{5}} x\\sqrt{x^2+4}\\,dx$의 값은?",
    "choices": [
      "$\\frac{16}{3}$",
      "$\\frac{17}{3}$",
      "$6$",
      "$\\frac{19}{3}$",
      "$\\frac{20}{3}$"
    ],
    "answer": "④",
    "solution": "치환 설정(치환적분법): $t=x^2+4$로 놓으면 $dt=2x\\,dx$이므로 $x\\,dx=\\frac{1}{2}\\,dt$이다.\n적분구간 변환: $x=0$이면 $t=4$, $x=\\sqrt5$이면 $t=5+4=9$이다.\n정적분 변환: $\\int_{0}^{\\sqrt5}x\\sqrt{x^2+4}\\,dx=\\frac{1}{2}\\int_{4}^{9}t^{1/2}\\,dt$이다.\n적분 계산: $=\\frac{1}{2}\\left[\\frac{2}{3}t^{3/2}\\right]_{4}^{9}=\\frac{1}{3}\\left[t^{3/2}\\right]_{4}^{9}$이다.\n거듭제곱 계산: $9^{3/2}=(\\sqrt9)^3=27$, $4^{3/2}=(\\sqrt4)^3=8$이다.\n값 계산: $\\frac{1}{3}(27-8)=\\frac{19}{3}$이다.\n주의: $x\\,dx$를 $\\frac{1}{2}\\,dt$로 바꾸는 계수 $\\frac12$을 빠뜨리지 않는다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B12",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "정적분 $\\int_{1}^{2} (3-x)\\sqrt{x-1}\\,dx$의 값은?",
    "choices": [
      "$\\frac{14}{15}$",
      "$\\frac{16}{15}$",
      "$\\frac{6}{5}$",
      "$\\frac{4}{3}$",
      "$\\frac{22}{15}$"
    ],
    "answer": "①",
    "solution": "치환 설정(치환적분법): $t=x-1$로 놓으면 $x=t+1$, $dx=dt$이다.\n피적분식 변환: $3-x=3-(t+1)=2-t$이다.\n적분구간 변환: $x=1$이면 $t=0$, $x=2$이면 $t=1$이다.\n정적분 변환: $\\int_{1}^{2}(3-x)\\sqrt{x-1}\\,dx=\\int_{0}^{1}(2-t)t^{1/2}\\,dt$이다.\n전개: $(2-t)t^{1/2}=2t^{1/2}-t^{3/2}$이다.\n적분 계산: $=\\left[\\frac{4}{3}t^{3/2}-\\frac{2}{5}t^{5/2}\\right]_{0}^{1}$이다.\n값 계산: $\\frac{4}{3}-\\frac{2}{5}=\\frac{20-6}{15}=\\frac{14}{15}$이다.\n주의: $3-x$를 $t$로 바꿀 때 $3-(t+1)=2-t$의 부호를 정확히 한다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "B23",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "NONE"
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
    "content": "정적분 $\\int_{1}^{\\sqrt{2}} (2x^3-x)\\sqrt{x^2-1}\\,dx$의 값은?",
    "choices": [
      "$\\frac{8}{15}$",
      "$\\frac{3}{5}$",
      "$\\frac{2}{3}$",
      "$\\frac{11}{15}$",
      "$\\frac{4}{5}$"
    ],
    "answer": "④",
    "solution": "인수분해: $2x^3-x=x(2x^2-1)$이다.\n치환 설정(치환적분법): $t=x^2-1$로 놓으면 $x^2=t+1$이고 $dt=2x\\,dx$, 즉 $x\\,dx=\\frac{1}{2}\\,dt$이다.\n피적분식 변환: $2x^2-1=2(t+1)-1=2t+1$이다.\n적분구간 변환: $x=1$이면 $t=0$, $x=\\sqrt2$이면 $t=2-1=1$이다.\n정적분 변환: $\\int_{1}^{\\sqrt2}(2x^3-x)\\sqrt{x^2-1}\\,dx=\\frac{1}{2}\\int_{0}^{1}(2t+1)t^{1/2}\\,dt$이다.\n전개: $=\\frac{1}{2}\\int_{0}^{1}(2t^{3/2}+t^{1/2})\\,dt$이다.\n적분 계산: $=\\frac{1}{2}\\left[\\frac{4}{5}t^{5/2}+\\frac{2}{3}t^{3/2}\\right]_{0}^{1}$이다.\n값 계산: $=\\frac{1}{2}\\left(\\frac{4}{5}+\\frac{2}{3}\\right)=\\frac{1}{2}\\cdot\\frac{22}{15}=\\frac{11}{15}$이다.\n주의: $2x^2-1$을 $t$에 대한 식으로 바꾼 뒤 남는 $x\\,dx$를 $\\frac12\\,dt$로 처리한다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-098",
    "problemTypeKey": "PT_CALCULUS_SUBSTITUTION_INTEGRAL",
    "templateKey": "TPL_CALCULUS_SUBSTITUTION_DEFINITE",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  }
];
