window.examTitle = "미적분II_286_곡선의길이_고2_유형은행1";

window.questionBank = [
  {
    "id": 1,
    "category": "정적분의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-08",
    "standardUnit": "정적분의 활용",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "정적분의 활용"
    ],
    "wide": false,
    "content": "실수 전체의 집합에서 이계도함수를 갖고 $f(1) = -2$, $f(6) = 10$을 만족시키는 모든 함수 $f(x)$에 대하여 $\\int_1^6 \\sqrt{1+\\{f'(x)\\}^2}\\,dx$의 최솟값은?",
    "choices": [
      "7",
      "9",
      "11",
      "13",
      "15"
    ],
    "answer": "④",
    "solution": "곡선의 길이 공식 확인: $\\int_1^6 \\sqrt{1+\\{f'(x)\\}^2}\\,dx$는 곡선 $y=f(x)$의 $x=1$에서 $x=6$까지의 길이이다.\n최단 곡선은 선분임을 이용: 두 점 $(1,-2)$, $(6,10)$을 잇는 곡선의 길이는 두 점을 잇는 선분의 길이보다 작을 수 없다.\n두 점 사이 거리 계산: $\\sqrt{(6-1)^2+(10-(-2))^2}=\\sqrt{5^2+12^2}=\\sqrt{25+144}=\\sqrt{169}=13$이다.\n등호 성립 확인: $f(x)=\\frac{12}{5}x-\\frac{22}{5}$이면 $f(1)=-2$, $f(6)=10$이고 $f''(x)=0$이므로 등호가 성립한다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-196",
    "problemTypeKey": "PT_CALCULUS_CURVE_LENGTH",
    "templateKey": "TPL_CALCULUS_CURVE_LENGTH_GRAPH",
    "crossConceptKeys": [
      "CC_AVERAGE_RATE_OF_CHANGE"
    ],
    "conditionKeys": [
      "COND_FUNCTION_TYPE_RESTRICTION",
      "COND_FUNCTION_VALUE_CONSTRAINT"
    ],
    "integrationPattern": "REINTERPRETATION"
  },
  {
    "id": 2,
    "category": "정적분의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-08",
    "standardUnit": "정적분의 활용",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "정적분의 활용"
    ],
    "wide": false,
    "content": "곡선 $y = \\frac{2}{3}x\\sqrt{x}\\;(0 \\le x \\le 3)$의 길이는?",
    "choices": [
      "\\frac{14}{3}",
      "5",
      "\\frac{16}{3}",
      "\\frac{17}{3}",
      "6"
    ],
    "answer": "①",
    "solution": "도함수 계산: $y=\\frac{2}{3}x^{3/2}$에서 $y'=\\frac{2}{3}\\cdot\\frac{3}{2}x^{1/2}=\\sqrt{x}$이다.\n피적분함수 정리: $1+(y')^2=1+(\\sqrt{x})^2=1+x$이다.\n곡선의 길이 공식 적용: $L=\\int_0^3\\sqrt{1+x}\\,dx$이다.\n부정적분 계산: $\\int\\sqrt{1+x}\\,dx=\\frac{2}{3}(1+x)^{3/2}+C$이다.\n정적분 계산: $L=\\left[\\frac{2}{3}(1+x)^{3/2}\\right]_0^3=\\frac{2}{3}(4^{3/2}-1^{3/2})=\\frac{2}{3}(8-1)=\\frac{14}{3}$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 2,
    "difficultyConfidence": "high",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-196",
    "problemTypeKey": "PT_CALCULUS_CURVE_LENGTH",
    "templateKey": "TPL_CALCULUS_CURVE_LENGTH_GRAPH",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 3,
    "category": "정적분의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-08",
    "standardUnit": "정적분의 활용",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "정적분의 활용"
    ],
    "wide": false,
    "content": "곡선 $y = \\frac{1}{6}(x^2+4)^{\\frac{3}{2}};(0 \\le x \\le 3)$의 길이는?",
    "choices": [
      "\\frac{15}{2}",
      "8",
      "\\frac{17}{2}",
      "9",
      "\\frac{19}{2}"
    ],
    "answer": "①",
    "solution": "합성함수의 미분법: $y'=\\frac{1}{6}\\cdot\\frac{3}{2}(x^2+4)^{1/2}\\cdot 2x=\\frac{1}{2}x\\sqrt{x^2+4}$이다.\n도함수의 제곱: $(y')^2=\\frac{1}{4}x^2(x^2+4)=\\frac{1}{4}x^4+x^2$이다.\n완전제곱식 변형: $1+(y')^2=\\frac{1}{4}(x^4+4x^2+4)=\\frac{1}{4}(x^2+2)^2=\\left(\\frac{x^2+2}{2}\\right)^2$이다.\n근호 벗기기: $0\\le x\\le 3$에서 $\\frac{x^2+2}{2}>0$이므로 $\\sqrt{1+(y')^2}=\\frac{x^2+2}{2}$이다.\n곡선의 길이 공식: $L=\\int_0^3\\frac{x^2+2}{2}\\,dx$이다.\n정적분 계산: $L=\\left[\\frac{x^3}{6}+x\\right]_0^3=\\frac{27}{6}+3=\\frac{9}{2}+3=\\frac{15}{2}$이다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-196",
    "problemTypeKey": "PT_CALCULUS_CURVE_LENGTH",
    "templateKey": "TPL_CALCULUS_CURVE_LENGTH_GRAPH",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 4,
    "category": "정적분의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-08",
    "standardUnit": "정적분의 활용",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "정적분의 활용"
    ],
    "wide": false,
    "content": "곡선 $f(x) = \\frac{1}{2}(e^x + e^{-x})$의 $x=0$에서 $x=2$까지의 길이는?",
    "choices": [
      "\\frac{1}{2}\\left(e - \\frac{1}{e}\\right)",
      "e - \\frac{1}{e}",
      "\\frac{1}{2}(e^2 - 1)",
      "\\frac{1}{2}\\left(e^2 - \\frac{1}{e^2}\\right)",
      "\\frac{1}{2}\\left(e^2 + \\frac{1}{e^2}\\right)"
    ],
    "answer": "④",
    "solution": "도함수 계산: 지수함수의 미분법에 의해 $f'(x)=\\frac{1}{2}(e^x-e^{-x})$이다.\n제곱 전개: $\\{f'(x)\\}^2=\\frac{1}{4}(e^{2x}-2+e^{-2x})$이다.\n완전제곱식 변형: $1+\\{f'(x)\\}^2=\\frac{1}{4}(e^{2x}+2+e^{-2x})=\\left(\\frac{e^x+e^{-x}}{2}\\right)^2$이다.\n근호 벗기기: 모든 실수 $x$에서 $\\frac{e^x+e^{-x}}{2}>0$이므로 $\\sqrt{1+\\{f'(x)\\}^2}=\\frac{e^x+e^{-x}}{2}$이다.\n곡선의 길이 공식: $L=\\int_0^2\\frac{e^x+e^{-x}}{2}\\,dx$이다.\n정적분 계산: $L=\\left[\\frac{e^x-e^{-x}}{2}\\right]_0^2=\\frac{e^2-e^{-2}}{2}-0=\\frac{1}{2}\\left(e^2-\\frac{1}{e^2}\\right)$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-196",
    "problemTypeKey": "PT_CALCULUS_CURVE_LENGTH",
    "templateKey": "TPL_CALCULUS_CURVE_LENGTH_GRAPH",
    "crossConceptKeys": [],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 5,
    "category": "정적분의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-08",
    "standardUnit": "정적분의 활용",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "정적분의 활용"
    ],
    "wide": false,
    "content": "곡선 $y = \\frac{1}{4}(e^{2x} + e^{-2x})\\;(-a \\le x \\le a)$의 길이가 $\\frac{e^8 - e^{-8}}{2}$일 때, 양수 $a$의 값은?",
    "choices": [
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "answer": "④",
    "solution": "도함수 계산: $y'=\\frac{1}{4}(2e^{2x}-2e^{-2x})=\\frac{e^{2x}-e^{-2x}}{2}$이다.\n제곱 전개: $(y')^2=\\frac{1}{4}(e^{4x}-2+e^{-4x})$이다.\n완전제곱식 변형: $1+(y')^2=\\frac{1}{4}(e^{4x}+2+e^{-4x})=\\left(\\frac{e^{2x}+e^{-2x}}{2}\\right)^2$이다.\n근호 벗기기: $\\frac{e^{2x}+e^{-2x}}{2}>0$이므로 $\\sqrt{1+(y')^2}=\\frac{e^{2x}+e^{-2x}}{2}$이다.\n곡선의 길이 적분: $L=\\int_{-a}^{a}\\frac{e^{2x}+e^{-2x}}{2}\\,dx=\\left[\\frac{e^{2x}-e^{-2x}}{4}\\right]_{-a}^{a}$이다.\n정적분 계산: $L=\\frac{e^{2a}-e^{-2a}}{4}-\\frac{e^{-2a}-e^{2a}}{4}=\\frac{e^{2a}-e^{-2a}}{2}$이다.\n조건 대입: $\\frac{e^{2a}-e^{-2a}}{2}=\\frac{e^8-e^{-8}}{2}$에서 $e^{2a}-e^{-2a}=e^8-e^{-8}$이다.\n증가함수이므로 지수 비교: $g(t)=e^t-e^{-t}$는 증가함수이므로 $2a=8$, 즉 $a=4$이다.\n따라서 정답은 ④이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-196",
    "problemTypeKey": "PT_CALCULUS_CURVE_LENGTH",
    "templateKey": "TPL_CALCULUS_CURVE_LENGTH_GRAPH",
    "crossConceptKeys": [
      "CC_SYMMETRIC_INTERVAL_INTEGRATION"
    ],
    "conditionKeys": [
      "COND_RANGE",
      "COND_POSITIVE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 6,
    "category": "정적분의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-08",
    "standardUnit": "정적분의 활용",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "정적분의 활용"
    ],
    "wide": false,
    "content": "곡선 $y = \\frac{1}{2}x^2 - \\frac{1}{4}\\ln x\\;(1 \\le x \\le e)$의 길이는?",
    "choices": [
      "\\frac{1}{2}e^2 - \\frac{1}{2}",
      "\\frac{1}{2}e^2 - \\frac{1}{4}",
      "\\frac{1}{2}e^2",
      "\\frac{1}{2}e^2 + \\frac{1}{4}",
      "\\frac{1}{2}e^2 + \\frac{1}{2}"
    ],
    "answer": "②",
    "solution": "도함수 계산: $y'=x-\\frac{1}{4x}$이다.\n제곱 전개: $(y')^2=x^2-2\\cdot x\\cdot\\frac{1}{4x}+\\frac{1}{16x^2}=x^2-\\frac{1}{2}+\\frac{1}{16x^2}$이다.\n완전제곱식 변형: $1+(y')^2=x^2+\\frac{1}{2}+\\frac{1}{16x^2}=\\left(x+\\frac{1}{4x}\\right)^2$이다.\n근호 벗기기: $1\\le x\\le e$에서 $x+\\frac{1}{4x}>0$이므로 $\\sqrt{1+(y')^2}=x+\\frac{1}{4x}$이다.\n곡선의 길이 공식: $L=\\int_1^e\\left(x+\\frac{1}{4x}\\right)dx$이다.\n정적분 계산: $L=\\left[\\frac{x^2}{2}+\\frac{\\ln x}{4}\\right]_1^e=\\left(\\frac{e^2}{2}+\\frac{1}{4}\\right)-\\frac{1}{2}=\\frac{e^2}{2}-\\frac{1}{4}$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-196",
    "problemTypeKey": "PT_CALCULUS_CURVE_LENGTH",
    "templateKey": "TPL_CALCULUS_CURVE_LENGTH_GRAPH",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 7,
    "category": "정적분의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-08",
    "standardUnit": "정적분의 활용",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "정적분의 활용"
    ],
    "wide": false,
    "content": "곡선 $f(x) = \\frac{1}{8}x^2 - \\ln x$의 $x=1$에서 $x=3$까지의 길이는?",
    "choices": [
      "\\frac{1}{2} + \\ln 3",
      "\\frac{3}{4} + \\ln 3",
      "1 + \\ln 3",
      "\\frac{5}{4} + \\ln 3",
      "\\frac{3}{2} + \\ln 3"
    ],
    "answer": "③",
    "solution": "도함수 계산: $f'(x)=\\frac{x}{4}-\\frac{1}{x}$이다.\n제곱 전개: $\\{f'(x)\\}^2=\\frac{x^2}{16}-2\\cdot\\frac{x}{4}\\cdot\\frac{1}{x}+\\frac{1}{x^2}=\\frac{x^2}{16}-\\frac{1}{2}+\\frac{1}{x^2}$이다.\n완전제곱식 변형: $1+\\{f'(x)\\}^2=\\frac{x^2}{16}+\\frac{1}{2}+\\frac{1}{x^2}=\\left(\\frac{x}{4}+\\frac{1}{x}\\right)^2$이다.\n근호 벗기기: $1\\le x\\le 3$에서 $\\frac{x}{4}+\\frac{1}{x}>0$이므로 $\\sqrt{1+\\{f'(x)\\}^2}=\\frac{x}{4}+\\frac{1}{x}$이다.\n곡선의 길이 공식: $L=\\int_1^3\\left(\\frac{x}{4}+\\frac{1}{x}\\right)dx$이다.\n정적분 계산: $L=\\left[\\frac{x^2}{8}+\\ln x\\right]_1^3=\\left(\\frac{9}{8}+\\ln 3\\right)-\\frac{1}{8}=1+\\ln 3$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-196",
    "problemTypeKey": "PT_CALCULUS_CURVE_LENGTH",
    "templateKey": "TPL_CALCULUS_CURVE_LENGTH_GRAPH",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 8,
    "category": "정적분의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-08",
    "standardUnit": "정적분의 활용",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "정적분의 활용"
    ],
    "wide": false,
    "content": "좌표평면 위의 곡선 $y = \\ln(1-x^2)$에 대하여 $x=0$에서 $x=\\frac{1}{3}$까지의 곡선의 길이는?",
    "choices": [
      "\\ln 2 - \\frac{1}{2}",
      "\\ln 2 - \\frac{1}{3}",
      "\\ln 2",
      "\\ln 2 + \\frac{1}{3}",
      "\\ln 2 + \\frac{1}{2}"
    ],
    "answer": "②",
    "solution": "합성함수의 미분법: $y'=\\frac{-2x}{1-x^2}$이다.\n통분하여 정리: $1+(y')^2=\\frac{(1-x^2)^2+4x^2}{(1-x^2)^2}=\\frac{x^4+2x^2+1}{(1-x^2)^2}=\\frac{(1+x^2)^2}{(1-x^2)^2}$이다.\n근호 벗기기: $0\\le x\\le\\frac{1}{3}$에서 $1-x^2>0$, $1+x^2>0$이므로 $\\sqrt{1+(y')^2}=\\frac{1+x^2}{1-x^2}$이다.\n부분분수 분해: $\\frac{1+x^2}{1-x^2}=-1+\\frac{2}{1-x^2}=-1+\\frac{1}{1-x}+\\frac{1}{1+x}$이다.\n적분 계산: $\\int\\left(-1+\\frac{1}{1-x}+\\frac{1}{1+x}\\right)dx=-x-\\ln|1-x|+\\ln|1+x|$이다.\n주의: $\\int\\frac{1}{1-x}dx=-\\ln|1-x|$로 부호가 음(-)이 됨을 놓치지 않는다.\n곡선의 길이 정적분: $L=\\left[-x+\\ln\\frac{1+x}{1-x}\\right]_0^{1/3}$이다.\n값 대입: $L=\\left(-\\frac{1}{3}+\\ln\\frac{4/3}{2/3}\\right)-0=-\\frac{1}{3}+\\ln 2$이다.\n따라서 정답은 ②이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-196",
    "problemTypeKey": "PT_CALCULUS_CURVE_LENGTH",
    "templateKey": "TPL_CALCULUS_CURVE_LENGTH_GRAPH",
    "crossConceptKeys": [],
    "conditionKeys": [
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 9,
    "category": "정적분의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-08",
    "standardUnit": "정적분의 활용",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "정적분의 활용"
    ],
    "wide": false,
    "content": "곡선 $y = \\int_0^x \\sqrt{4\\sec^4 t - 1}\\,dt$에 대하여 $x=-\\frac{\\pi}{4}$에서 $x=\\frac{\\pi}{4}$까지의 곡선의 길이는?",
    "choices": [
      "1",
      "\\sqrt{2}",
      "2",
      "2\\sqrt{2}",
      "4"
    ],
    "answer": "⑤",
    "solution": "미적분의 기본정리: $y'=\\frac{d}{dx}\\int_0^x\\sqrt{4\\sec^4t-1}\\,dt=\\sqrt{4\\sec^4x-1}$이다.\n피적분함수 정리: $1+(y')^2=1+(4\\sec^4x-1)=4\\sec^4x$이다.\n근호 벗기기: $-\\frac{\\pi}{4}\\le x\\le\\frac{\\pi}{4}$에서 $\\sec x>0$이므로 $\\sqrt{1+(y')^2}=2\\sec^2x$이다.\n곡선의 길이 공식: $L=\\int_{-\\pi/4}^{\\pi/4}2\\sec^2x\\,dx$이다.\n우함수 성질: $\\sec^2x$는 우함수이므로 $L=4\\int_0^{\\pi/4}\\sec^2x\\,dx$이다.\n삼각함수 적분: $(\\tan x)'=\\sec^2x$이므로 $L=4\\left[\\tan x\\right]_0^{\\pi/4}=4(1-0)=4$이다.\n따라서 정답은 ⑤이다.",
    "difficultyBucket": 3,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "B34",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-196",
    "problemTypeKey": "PT_CALCULUS_CURVE_LENGTH",
    "templateKey": "TPL_CALCULUS_CURVE_LENGTH_GRAPH",
    "crossConceptKeys": [
      "CC_FUNDAMENTAL_THEOREM_OF_CALCULUS_LEIBNIZ",
      "CC_SYMMETRIC_INTERVAL_INTEGRATION"
    ],
    "conditionKeys": [],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 10,
    "category": "정적분의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-08",
    "standardUnit": "정적분의 활용",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "정적분의 활용"
    ],
    "wide": false,
    "content": "$x \\ge 0$에서 정의된 미분가능한 함수 $f(x)$에 대하여 곡선 $y=f(x)$ 위의 점 $(0, f(0))$에서 곡선 위의 임의의 점 $(x, y)$까지의 곡선의 길이가 $\\frac{3}{2}x^2 + y + 2$일 때, $f'(1)$의 값은?",
    "choices": [
      "-\\frac{4}{3}",
      "-1",
      "0",
      "\\frac{3}{4}",
      "\\frac{4}{3}"
    ],
    "answer": "①",
    "solution": "곡선의 길이를 적분으로 표현: 점 $(0,f(0))$에서 $(x,y)$까지의 길이는 $s(x)=\\int_0^x\\sqrt{1+\\{f'(t)\\}^2}\\,dt$이다.\n조건식 정리: $y=f(x)$이므로 $s(x)=\\frac{3}{2}x^2+f(x)+2$이다.\n양변 미분: $s'(x)=\\sqrt{1+\\{f'(x)\\}^2}$이고 우변은 $3x+f'(x)$이다.\n식 세우기: $\\sqrt{1+\\{f'(x)\\}^2}=3x+f'(x)$이다.\n양변 제곱: $1+\\{f'(x)\\}^2=9x^2+6xf'(x)+\\{f'(x)\\}^2$이다.\n동류항 정리: $1-9x^2=6xf'(x)$이므로 $f'(x)=\\frac{1-9x^2}{6x}$ ($x>0$)이다.\n$x=1$ 대입: $f'(1)=\\frac{1-9}{6}=-\\frac{8}{6}=-\\frac{4}{3}$이다.\n근호 조건 확인: $3x+f'(x)=3x+\\frac{1-9x^2}{6x}=\\frac{9x^2+1}{6x}>0$이므로 제곱 전의 식을 만족한다.\n따라서 정답은 ①이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-196",
    "problemTypeKey": "PT_CALCULUS_CURVE_LENGTH",
    "templateKey": "TPL_CALCULUS_CURVE_LENGTH_GRAPH",
    "crossConceptKeys": [
      "CC_FUNDAMENTAL_THEOREM_OF_CALCULUS"
    ],
    "conditionKeys": [
      "COND_FUNCTION_TYPE_RESTRICTION",
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  },
  {
    "id": 11,
    "category": "정적분의 활용",
    "standardCourse": "미적분II",
    "curriculum": "2022",
    "standardUnitKey": "H22-M2-08",
    "standardUnit": "정적분의 활용",
    "standardUnitOrder": 8,
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "정적분의 활용"
    ],
    "wide": false,
    "content": "미분가능한 함수 $f(x)$가 $\\lim_{h\\to 0} \\frac{f(x+h)-f(x-h)}{h} = 4x\\sqrt{x^2+1}$을 만족시킬 때, $0 \\le x \\le 3$에서의 곡선 $y=f(x)$의 길이는?",
    "choices": [
      "15",
      "18",
      "21",
      "24",
      "27"
    ],
    "answer": "③",
    "solution": "미분계수의 정의 이용: $\\lim_{h\\to 0}\\frac{f(x+h)-f(x-h)}{h}=\\lim_{h\\to 0}\\left(\\frac{f(x+h)-f(x)}{h}+\\frac{f(x-h)-f(x)}{-h}\\right)=2f'(x)$이다.\n도함수 결정: $2f'(x)=4x\\sqrt{x^2+1}$이므로 $f'(x)=2x\\sqrt{x^2+1}$이다.\n제곱 계산: $\\{f'(x)\\}^2=4x^2(x^2+1)=4x^4+4x^2$이다.\n완전제곱식 변형: $1+\\{f'(x)\\}^2=4x^4+4x^2+1=(2x^2+1)^2$이다.\n근호 벗기기: $2x^2+1>0$이므로 $\\sqrt{1+\\{f'(x)\\}^2}=2x^2+1$이다.\n곡선의 길이 공식: $L=\\int_0^3(2x^2+1)\\,dx$이다.\n정적분 계산: $L=\\left[\\frac{2x^3}{3}+x\\right]_0^3=\\left(\\frac{2}{3}\\cdot 27+3\\right)=18+3=21$이다.\n따라서 정답은 ③이다.",
    "difficultyBucket": 4,
    "difficultyConfidence": "medium",
    "difficultyBoundaryFlag": "NONE",
    "legacyLevelCompatibility": "NORMAL",
    "rpmPrimaryRecordId": "H2-CALC-RPM-196",
    "problemTypeKey": "PT_CALCULUS_CURVE_LENGTH",
    "templateKey": "TPL_CALCULUS_CURVE_LENGTH_GRAPH",
    "crossConceptKeys": [
      "CC_DERIVATIVE_DEFINITION_LIMIT",
      "CC_DIFFERENCE_QUOTIENT_SCALING"
    ],
    "conditionKeys": [
      "COND_FUNCTION_TYPE_RESTRICTION",
      "COND_RANGE"
    ],
    "integrationPattern": "SEQUENTIAL"
  }
];
